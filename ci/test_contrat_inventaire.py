#!/usr/bin/env python3
# ═══════════════════════════════════════════════════════════════════
# CI — TEST DU CONTRAT D'INVENTAIRE
# quete: transverse · session: 2026-09-28 · fiche-mutation: FM-014 §4b
#
# Rôle : LE test que le manifeste de chaque quête matérialisée doit
# passer. Il ne lit pas les verdicts sur parole — il les REJOUE.
#   · invariants tranchés par le comité (2026-09-28) encodés ci-dessous
#   · empreintes sha256 recomputées et comparées au manifeste
#   · 6 contraintes du plan de mélange rejouées depuis items.yaml
#   · anti-orphelins côté signatures (verrou CI n°2)
#   · anti-doublons de codes (arbitrage ③ — un code jamais réattribué)
#   · tableau de bord : invariants + taux de matérialisation
#
# Dépendance : pyyaml (pip install pyyaml)
# Exécution :  python3 ci/test_contrat_inventaire.py   (depuis la racine)
# Sortie : N/N vérifications · code 0 si tout passe, 1 sinon
# ═══════════════════════════════════════════════════════════════════

import hashlib
import json
import sys
import unicodedata
from pathlib import Path

import yaml

RACINE = Path(__file__).resolve().parents[1]

# ─────────────────────────────────────────────────────────────────────
# INVARIANTS — verdict du comité, tranché le 2026-09-28 (FM-013 §5).
# L'invariant compte ce qui EXISTE au contrat (design) ; la
# matérialisation mesure ce qui EXISTE en fichiers (production).
# Deux métriques, jamais confondues.
# ─────────────────────────────────────────────────────────────────────
INVARIANTS = {
    "mondes": 11,
    "quetes": 51,
    "items_total": 570,          # INCHANGÉ — matérialisation ≠ ajout d'items
    "trame_fiabilite": 30,
    "signatures_total": 35,      # 30 M1 (déclarées) + 1 M2 (SIG_CONTRIB) + 4 M3
    "codes_signaux": 18,
    "quetes_materialisees": 1,   # à ce jour : la quête 2.1
}
SIGNATURES_M1_DECLAREES = 30   # registre M1 : maison fichier en attente (Voie B)

DIMENSIONS_CARTE = {
    "autonomie", "stimulation", "hedonisme", "reussite", "pouvoir",
    "securite", "conformite", "tradition", "bienveillance", "universalisme",
}
BLOCS_PORTRAIT = {
    "ouverture_au_changement": {"autonomie", "stimulation", "hedonisme"},
    "affirmation_de_soi": {"reussite", "pouvoir"},
    "conservation": {"securite", "conformite", "tradition"},
    "depassement_de_soi": {"bienveillance", "universalisme"},
}
BLOC_DE = {d: b for b, ds in BLOCS_PORTRAIT.items() for d in ds}
LIBELLES_LIKERT5 = {
    1: "Pas du tout comme moi",
    2: "Plutôt pas comme moi",
    3: "Neutre / je ne sais pas",
    4: "Plutôt comme moi",
    5: "Tout à fait comme moi",
}
Q23_V2_EXACT = "Dans un groupe, ma place doit être reconnue avant celle des autres."
Q23_V1_INTERDITE = "Dans un groupe, les décisions importantes me reviennent naturellement."
LEXIQUE_DECISION = {"decide", "decides", "decision", "decisions", "decider",
                    "trancher", "tranche", "dirige", "diriger", "direction"}


def norm(txt: str) -> str:
    """minuscules + suppression des accents — pour comparaisons lexicales."""
    nfkd = unicodedata.normalize("NFD", txt)
    return "".join(c for c in nfkd if not unicodedata.combining(c)).lower()


def tokens(txt: str):
    return {t for t in norm(txt).split() if t.isalpha()}


# ─────────────────────────────────────────────────────────────────────
# Registre de vérifications
# ─────────────────────────────────────────────────────────────────────
RESULTATS = []          # (id, nom, ok, message)


def check(cid: str, nom: str):
    def deco(fn):
        def run():
            try:
                ok, msg = fn()
            except Exception as e:                      # noqa: BLE001
                ok, msg = False, f"exception : {type(e).__name__}: {e}"
            RESULTATS.append((cid, nom, bool(ok), str(msg)))
        CHECKS.append(run)
        return fn
    return deco


CHECKS = []


def charger_yaml(rel: str):
    with open(RACINE / rel, encoding="utf-8") as f:
        return yaml.safe_load(f)


def charger_json(rel: str):
    with open(RACINE / rel, encoding="utf-8") as f:
        return json.load(f)


def sha256_fichier(rel: str) -> str:
    return hashlib.sha256((RACINE / rel).read_bytes()).hexdigest()


# ═══════════════════════════════════════════════════════════════════
# BLOC 1 — INVARIANTS ET MANIFESTES
# ═══════════════════════════════════════════════════════════════════

@check("CI-01", "invariants tranchés — cohérence interne du verdict comité")
def ci01():
    ok_570 = INVARIANTS["items_total"] == 540 + INVARIANTS["trame_fiabilite"]
    ok_35 = INVARIANTS["signatures_total"] == SIGNATURES_M1_DECLAREES + 1 + 4
    ok_q = 0 < INVARIANTS["quetes_materialisees"] <= INVARIANTS["quetes"]
    details = f"570 == 540+30 : {ok_570} · 35 == 30+1+4 : {ok_35} · matérialisées ≤ quêtes : {ok_q}"
    return (ok_570 and ok_35 and ok_q), details


MANIFESTES = sorted((RACINE / "ci" / "manifeste-quete").glob("*.json"))


@check("CI-02", "manifestes découverts — au moins celui de la quête 2.1")
def ci02():
    noms = [m.name for m in MANIFESTES]
    return ("2.1.json" in noms), f"manifestes trouvés : {', '.join(noms) or 'AUCUN'}"


# ═══════════════════════════════════════════════════════════════════
# BLOC 2 — VÉRIFICATIONS PAR QUÊTE MATÉRIALISÉE
# ═══════════════════════════════════════════════════════════════════

def _quête_base(mani: dict, chemin: Path):
    """Contrôles d'identité et de plage, valables pour toute quête."""
    res = []
    q = chemin.stem
    res.append(("identité", mani.get("quete") == q and mani.get("monde") in {f"M{i}" for i in range(1, 12)}
                and mani.get("statut_freemium") in {"gratuit", "premium"}
                and bool(mani.get("categorie")) and bool(mani.get("phase")),
                f"quete={mani.get('quete')} monde={mani.get('monde')} freemium={mani.get('statut_freemium')}"))
    plage = mani.get("plage_codes", {})
    debut, fin = plage.get("debut", ""), plage.get("fin", "")
    attendus = [f"Q{q}-{i:02d}" for i in range(1, int(fin.split("-")[-1]) + 1)]
    res.append(("plage de codes gelée", debut == attendus[0] and fin == attendus[-1]
                and plage.get("codes_utilises") == len(attendus)
                and plage.get("codes_geler_a_jamais") is True,
                f"{debut} → {fin} ({plage.get('codes_utilises')} codes)"))
    tot = mani.get("totaux", {})
    res.append(("totaux internes", tot.get("items_total") == tot.get("items_carte", 0) + tot.get("items_trame", 0)
                and tot.get("paires_miroir") == tot.get("items_carte", 0) // 2
                and tot.get("dimensions_carte") == 10,
                f"{tot.get('items_total')} = {tot.get('items_carte')} carte + {tot.get('items_trame')} trame · "
                f"{tot.get('paires_miroir')} paires · {tot.get('dimensions_carte')} dimensions"))
    trame_sig = tot.get("trames_par_signal", {})
    res.append(("trames par signal", sum(trame_sig.values()) == tot.get("items_trame"),
                f"{trame_sig} (Σ={sum(trame_sig.values())})"))
    return res


def _quête_hashes(mani: dict):
    res = []
    for rel, ref in mani.get("empreintes", {}).get("fichiers", {}).items():
        p = RACINE / rel
        if not p.exists():
            res.append((rel, False, "fichier ABSENT"))
            continue
        h = sha256_fichier(rel)
        taille = p.stat().st_size
        res.append((rel, h == ref.get("sha256") and taille == ref.get("octets"),
                    f"sha256 {h[:16]}… · {taille} octets (manifeste : {ref.get('sha256', '')[:16]}… · {ref.get('octets')})"))
    return res


def _quête_contenu(mani: dict):
    """Items, mélange rejoué, slots, signatures — toute quête."""
    res = []
    q = mani["quete"]
    dossier = None
    for rel in mani.get("empreintes", {}).get("fichiers", {}):
        if rel.endswith("items.yaml"):
            dossier = str(Path(rel).parent)
    if dossier is None:
        return [("localisation items.yaml", False, "absent des empreintes du manifeste")]

    items_doc = charger_yaml(f"{dossier}/items.yaml")
    meta, items = items_doc["meta"], items_doc["items"]
    par_id = {it["id"]: it for it in items}
    ids = [it["id"] for it in items]

    plage = mani["plage_codes"]
    attendus = [f"Q{q}-{i:02d}" for i in range(1, plage["codes_utilises"] + 1)]
    res.append(("items — plage exacte (zéro trou, zéro doublon)",
                sorted(ids) == attendus and len(ids) == len(set(ids)),
                f"{len(ids)} items · doublons : {len(ids) - len(set(ids))}"))

    res.append(("items — échelle likert5 + recodage 6−r (arbitrages ①②)",
                meta.get("echelle") == "likert5"
                and {int(k): v for k, v in meta.get("libelles_echelle", {}).items()} == LIBELLES_LIKERT5
                and norm(str(meta.get("recodage_inverse"))) == norm("6 - réponse"),
                "libellés exacts 1→5 · recodage « 6 - réponse »"))

    carte = [it for it in items if not it.get("signal")]
    trames = [it for it in items if it.get("signal")]
    dims_carte = [it["dimension"] for it in carte]
    res.append(("items — 20 carte : dimensions valides, 1 D + 1 I par valeur",
                len(carte) == mani["totaux"]["items_carte"]
                and all(d in DIMENSIONS_CARTE for d in dims_carte)
                and all(sum(1 for it in carte if it["dimension"] == d and it["orientation"] == o) == 1
                        for d in DIMENSIONS_CARTE for o in ("D", "I")),
                f"{len(carte)} items carte · dimensions hors référentiel : "
                f"{sorted(set(d for d in dims_carte if d not in DIMENSIONS_CARTE)) or 'aucune'}"))

    paires_ok, defauts = True, []
    for it in carte:
        pm = it.get("paire_miroir")
        j = par_id.get(pm)
        if (j is None or j.get("signal") or j["paire_miroir"] != it["id"]
                or j["dimension"] != it["dimension"] or j["orientation"] == it["orientation"]):
            paires_ok = False
            defauts.append(it["id"])
    res.append(("items — paires miroir symétriques (règle R6)",
                paires_ok and len(carte) // 2 == mani["totaux"]["paires_miroir"],
                f"10 paires attendues · défauts : {defauts or 'aucun'}"))

    sig_trame = {t["signal"] for t in trames}
    trames_ok = (
        len(trames) == mani["totaux"]["items_trame"]
        and sig_trame == set(mani["totaux"]["trames_par_signal"])
        and all(t.get("dimension") is None and t.get("paire_miroir") is None
                and t.get("computation", {}).get("carte") is None
                and "INTERDIT" in str(t.get("computation", {}).get("ancrage", "")).upper()
                for t in trames)
    )
    res.append(("items — trames ▲ : signal moteur seul, rappel interdit",
                trames_ok, f"{len(trames)} trames · signaux {sorted(sig_trame)} · ancrage « rappel INTERDIT » partout"))

    blocs_ok = all(BLOC_DE.get(it["dimension"]) in meta.get("blocs_portrait", {}) for it in carte)
    correspondence_ok = all(
        any(it["dimension"] in dims for dims in meta.get("blocs_portrait", {}).values())
        for it in carte)
    res.append(("items — chaque dimension dans son bloc portrait",
                blocs_ok and correspondence_ok,
                "4 blocs : ouverture / affirmation / conservation / dépassement"))

    # ── Mélange : on ne lit pas les verdicts, on les REJOUE ──
    mel = charger_json(f"{dossier}/melange.json")
    ordre = sorted(mel["ordre_passation"], key=lambda x: x["position"])
    seq = [(e["position"], e["code"], par_id[e["code"]]) for e in ordre]
    verdicts = {c["id"]: c["verdict"] for c in mel["contraintes"]}

    # C1 — aucune dimension consécutive (paires dimensionnées)
    v1 = all(not (a[2]["dimension"] and b[2]["dimension"]) or a[2]["dimension"] != b[2]["dimension"]
             for a, b in zip(seq, seq[1:]))
    # C2 — trames jamais adjacentes à BE/UN/RE/PO
    pos_trames = [p for p, _, it in seq if it.get("signal")]
    interdits = {"bienveillance", "universalisme", "reussite", "pouvoir"}
    v2 = True
    for p in pos_trames:
        for voisin in (p - 1, p + 1):
            e = next((x for x in seq if x[0] == voisin), None)
            if e and e[2]["dimension"] in interdits:
                v2 = False
    # C3 — exactement 1 trame par bloc de 6
    v3 = all(sum(1 for p in pos_trames if 6 * b + 1 <= p <= 6 * b + 6) == 1 for b in range(4))
    # C4 — distance intra-dimension ≥ 3
    v4 = True
    for d in DIMENSIONS_CARTE:
        ps = [p for p, _, it in seq if it["dimension"] == d]
        if len(ps) == 2 and abs(ps[0] - ps[1]) < 3:
            v4 = False
    # C6 — l'ordre de passation n'est pas l'ordre des codes
    v6 = [c for _, c, _ in seq] != sorted(c for _, c, _ in seq)

    rejoue = {1: v1, 2: v2, 3: v3, 4: v4, 6: v6}
    ecart = {i: (verdicts.get(i), "pass" if ok else "FAIL") for i, ok in rejoue.items() if verdicts.get(i) != ("pass" if ok else "FAIL")}
    res.append(("mélange — contraintes 1,2,3,4,6 REJOUÉES = verdicts déclarés",
                not ecart,
                f"graine {mel.get('graine')} · écarts : {ecart or 'aucun'}"))

    # C5 — alternance D/I : le verrou « sans regroupement »
    orient_seq = [it["orientation"] for _, _, it in seq]

    def max_run(xs):
        best = cur = 1
        for a, b in zip(xs, xs[1:]):
            cur = cur + 1 if a == b else 1
            best = max(best, cur)
        return best

    run_incl = max_run(orient_seq)
    carte_seq = [it["orientation"] for _, _, it in seq if not it.get("signal")]
    run_excl = max_run(carte_seq)
    v5 = run_incl <= 2
    ecart5 = verdicts.get(5) != ("pass" if v5 else "FAIL")
    res.append(("mélange — contrainte 5 (alternance D/I) REJOUÉE = verdict déclaré",
                not ecart5,
                f"runs max D/I en passation réelle (trames incluses) : {run_incl} · hors trames : {run_excl} · "
                f"detail déclaré : « aucun bloc de même orientation > 2 » · verdict déclaré : « {verdicts.get(5)} » · "
                f"rejoué : « {'pass' if v5 else 'FAIL'} » — {'cohérent' if not ecart5 else 'DIVERGENCE : la déclaration ne résiste pas au rejeu'}"))

    # cohérence croisée mélange × items : les trames déclarées dans le mélange
    trames_mel = sorted(e["code"] for e in mel["ordre_passation"] if e.get("trame"))
    trames_items = sorted(t["id"] for t in trames)
    res.append(("mélange × items — les trames du mélange sont les trames des items",
                trames_mel == trames_items, f"{trames_mel}"))

    res.append(("mélange — verdict global déclaré « 6/6 pass » présent",
                mel.get("verdicts_contraintes") if "verdicts_contraintes" in mel
                else mani.get("melange", {}).get("verdicts_contraintes") == "6/6 pass"
                or mel.get("verdicts_contraintes") == "6/6 pass",
                f"mani.melange={mani.get('melange', {}).get('verdicts_contraintes')}"))

    # ── Slots ──
    slots_doc = charger_yaml(f"{dossier}/slots.yaml")
    slots = slots_doc.get("slots", [])
    slots_txt = json.dumps(slots_doc, ensure_ascii=False)
    codes_trames = [f"Q{q}-{i:02d}" for i in range(plage["codes_utilises"] - mani["totaux"]["items_trame"] + 1,
                                                    plage["codes_utilises"] + 1)]
    fuite = [c for c in codes_trames if c in slots_txt]
    ids_slots = [s["id"] for s in slots]
    res.append(("slots — ids alignés au manifeste, aucune trame ▲ n'alimente un slot",
                sorted(ids_slots) == sorted(mani.get("slots", [])) and not fuite,
                f"{len(ids_slots)} slots · fuite trame vers rendu : {fuite or 'aucune'}"))

    s3 = next((s for s in slots if s["id"].startswith("S3")), None)
    silence = str(s3.get("regle_silence", "")) if s3 else ""
    res.append(("slots — règle de silence S3 (rappel uniquement à voix basse, ≥ 2 paires)",
                bool(s3) and "voix basse" in silence and "2 paires" in silence,
                "observation de revue appliquée : pas de rappel des 2 réponses au degré « nuancée »"))

    # ── Signatures de la quête ──
    sigs_doc = charger_yaml(f"{dossier}/signatures.yaml")
    sigs = sigs_doc.get("signatures", [])
    ids_sig = [s["id"] for s in sigs]
    verrous_ok = all(
        "À VALIDER PAR LE COMITÉ" in json.dumps(s, ensure_ascii=False) for s in sigs)
    res.append(("signatures — ids alignés au manifeste, seuils sous verrou [9]",
                ids_sig == mani.get("signatures", []) and verrous_ok,
                f"{len(ids_sig)} signatures · verrou comité présent sur chacune"))
    return res, ids_sig, par_id


# ═══════════════════════════════════════════════════════════════════
# BLOC 3 — EXÉCUTION PAR MANIFESTE
# ═══════════════════════════════════════════════════════════════════

IDS_SIGNATURES_PAR_QUETE = {}
TOUS_IDS_ITEMS = []


@check("CI-03", "manifeste 2.1 — identité, plage gelée, totaux internes")
def ci03():
    chemin = RACINE / "ci" / "manifeste-quete" / "2.1.json"
    mani = charger_json(f"ci/manifeste-quete/2.1.json")
    exact = (mani.get("monde") == "M3" and mani.get("statut_freemium") == "gratuit"
             and mani.get("categorie") == "Socle" and mani.get("phase") == "MVP")
    sous = _quête_base(mani, chemin)
    totaux_ok = all(ok for _, ok, _ in sous)
    detail = " · ".join(f"{n}: {'ok' if ok else m}" for n, ok, m in sous)
    return exact and totaux_ok, f"quête 2.1 = M3 · gratuit · Socle · MVP — {detail}"


@check("CI-04", "manifeste 2.1 — empreintes sha256 des 5 fichiers de contenu")
def ci04():
    mani = charger_json("ci/manifeste-quete/2.1.json")
    sous = _quête_hashes(mani)
    ok = all(o for _, o, _ in sous)
    detail = " | ".join(f"{Path(rel).name}: {'ok' if o else m}" for rel, o, m in sous)
    return ok, detail


@check("CI-05", "quête 2.1 — structure items (plage, échelle, paires, trames, blocs)")
def ci05():
    mani = charger_json("ci/manifeste-quete/2.1.json")
    res, _, _ = _quête_contenu(mani)
    sous = [(n, o, m) for n, o, m in res if n.startswith("items —")]
    ok = all(o for _, o, _ in sous) and len(sous) == 6
    detail = " · ".join(f"{n.split('—')[1].split(':')[0].strip()}: {'ok' if o else m}" for n, o, m in sous)
    return ok, detail


@check("CI-06", "quête 2.1 — mélange REJOUÉ (contraintes 1,2,3,4,6 + cohérence trames)")
def ci06():
    mani = charger_json("ci/manifeste-quete/2.1.json")
    res, _, _ = _quête_contenu(mani)
    sous = [(n, o, m) for n, o, m in res
            if n.startswith("mélange — contraintes 1") or n.startswith("mélange × items")
            or n.startswith("mélange — verdict global")]
    ok = all(o for _, o, _ in sous) and len(sous) == 3
    return ok, " · ".join(m for _, o, m in sous)


@check("CI-07", "🔴 quête 2.1 — contrainte 5 (alternance D/I) : la déclaration résiste au rejeu")
def ci07():
    mani = charger_json("ci/manifeste-quete/2.1.json")
    res, _, _ = _quête_contenu(mani)
    ligne = next((o, m) for n, o, m in res if n.startswith("mélange — contrainte 5"))
    return ligne[0], ligne[1]


@check("CI-08", "quête 2.1 — slots : trames exclues du rendu + règle de silence S3")
def ci08():
    mani = charger_json("ci/manifeste-quete/2.1.json")
    res, _, _ = _quête_contenu(mani)
    sous = [(n, o, m) for n, o, m in res if n.startswith("slots —")]
    ok = all(o for _, o, _ in sous) and len(sous) == 2
    return ok, " · ".join(m for _, o, m in sous)


@check("CI-09", "quête 2.1 — signatures attendues alignées au manifeste, verrou [9] partout")
def ci09():
    mani = charger_json("ci/manifeste-quete/2.1.json")
    res, ids_sig, _ = _quête_contenu(mani)
    ligne = next((o, m) for n, o, m in res if n.startswith("signatures —"))
    IDS_SIGNATURES_PAR_QUETE[mani["quete"]] = ids_sig
    return ligne[0], f"{ligne[1]} · {ids_sig}"


@check("CI-10", "garde anti-régression Q2.1-23 v2 (contamination 09×23 — FM-013 §2)")
def ci10():
    doc = charger_yaml("contenu/mondes/M3-boussole/2.1-valeurs/items.yaml")
    it23 = next(it for it in doc["items"] if it["id"] == "Q2.1-23")
    it09 = next(it for it in doc["items"] if it["id"] == "Q2.1-09")
    exact = it23["enonce"] == Q23_V2_EXACT
    v1_absente = Q23_V1_INTERDITE not in it23["enonce"]
    tok23 = tokens(it23["enonce"])
    lexique = sorted(tok23 & LEXIQUE_DECISION)
    surface = sorted(tok23 & tokens(it09["enonce"]))
    ok = exact and v1_absente and not lexique
    return ok, (f"v2 exacte : {exact} · v1 absente : {v1_absente} · lexique décision dans 23 : {lexique or 'aucun'} · "
                f"mots partagés avec Q2.1-09 (structurels, tolérés) : {surface or 'aucun'}")


@check("CI-11", "en-têtes de traçabilité présents sur les 5 fichiers de contenu")
def ci11():
    rels = list(charger_json("ci/manifeste-quete/2.1.json")["empreintes"]["fichiers"])
    manquants = []
    for rel in rels:
        txt = (RACINE / rel).read_text(encoding="utf-8")
        a_un_quete = ("quete: 2.1" in txt) or ('"quete": "2.1"' in txt)
        if not (a_un_quete and "FM-013" in txt):
            manquants.append(rel)
    return not manquants, f"traçabilité (quete · fiche) absente de : {manquants or 'aucun fichier — 5/5'}"


# ═══════════════════════════════════════════════════════════════════
# BLOC 4 — REGISTRES DE SIGNATURES ET ANTI-ORPHELINS (verrou n°2)
# ═══════════════════════════════════════════════════════════════════

@check("CI-12", "registre M3.json — monde M3, 4 signatures alignées au manifeste")
def ci12():
    reg = charger_json("contrat/registres/signatures/M3.json")
    ids = [s["id"] for s in reg["signatures"]]
    mani = charger_json("ci/manifeste-quete/2.1.json")
    ok = reg["monde"] == "M3" and ids == mani["signatures"]
    return ok, f"{ids}"


@check("CI-13", "registre M2.json — SIG_CONTRIB régularisée (quête 1.10, verrou [9])")
def ci13():
    reg = charger_json("contrat/registres/signatures/M2.json")
    sigs = reg["signatures"]
    ok = (reg["monde"] == "M2" and len(sigs) == 1
          and sigs[0]["id"] == "SIG_CONTRIB" and sigs[0]["quete"] == "1.10"
          and "facteur de confiance" in sigs[0]["consequence"]
          and "À VALIDER PAR LE COMITÉ" in sigs[0]["statut"])
    return ok, "SIG_CONTRIB · 1.10 « Ce que tu apportes » · conséquence : facteur de confiance · seuils au verrou [9]"


@check("CI-14", "anti-orphelins signatures — total déclaré = invariant 35, maisons cohérentes")
def ci14():
    dossier = RACINE / "contrat" / "registres" / "signatures"
    fichiers = sorted(dossier.glob("*.json"))
    ids, maisons, incoherences = [], [], []
    for f in fichiers:
        reg = json.loads(f.read_text(encoding="utf-8"))
        if reg.get("monde") != f.stem:
            incoherences.append(f"{f.name} : monde={reg.get('monde')}")
        for s in reg.get("signatures", []):
            ids.append(s["id"])
            maisons.append((s["id"], f.stem))
    doublons = sorted({i for i in ids if ids.count(i) > 1})
    pour_2_1 = IDS_SIGNATURES_PAR_QUETE.get("2.1", [])
    orphelins = [s for s in pour_2_1 if s not in ids]
    total_declare = len(ids) + SIGNATURES_M1_DECLAREES
    ok = (total_declare == INVARIANTS["signatures_total"] and not doublons
          and not incoherences and not orphelins and {"M2.json", "M3.json"} <= {f.name for f in fichiers})
    return ok, (f"matérialisées {len(ids)} (M2:1 · M3:4) + M1 déclarées {SIGNATURES_M1_DECLAREES} (maison en attente, Voie B) "
                f"= {total_declare}/35 · doublons : {doublons or 'aucun'} · monde≠fichier : {incoherences or 'aucun'} · "
                f"signatures 2.1 sans maison : {orphelins or 'aucune'}")


@check("CI-15", "anti-doublons de codes d'items (arbitrage ③ — un code jamais réattribué)")
def ci15():
    total_mat = 0
    for mani_path in MANIFESTES:
        mani = json.loads(mani_path.read_text(encoding="utf-8"))
        for rel in mani.get("empreintes", {}).get("fichiers", {}):
            if rel.endswith("items.yaml"):
                doc = charger_yaml(rel)
                TOUS_IDS_ITEMS.extend(it["id"] for it in doc["items"])
                total_mat += len(doc["items"])
    doublons = sorted({i for i in TOUS_IDS_ITEMS if TOUS_IDS_ITEMS.count(i) > 1})
    ok = not doublons and total_mat <= INVARIANTS["items_total"]
    return ok, f"{total_mat} items matérialisés sur {INVARIANTS['items_total']} · codes en double : {doublons or 'aucun'}"


# ═══════════════════════════════════════════════════════════════════
# TABLEAU DE BORD + EXÉCUTION
# ═══════════════════════════════════════════════════════════════════

def tableau_de_bord():
    items_mat = len(TOUS_IDS_ITEMS)
    taux = 100.0 * items_mat / INVARIANTS["items_total"]
    sigs_mat = len(json.loads((RACINE / "contrat/registres/signatures/M3.json").read_text(encoding="utf-8"))["signatures"]) \
        + len(json.loads((RACINE / "contrat/registres/signatures/M2.json").read_text(encoding="utf-8"))["signatures"])
    print("═══ TABLEAU DE BORD — CONTRAT D'INVENTAIRE (verdict comité 2026-09-28) ═══")
    print(f"Mondes ............ {INVARIANTS['mondes']}      (inchangé)")
    print(f"Quêtes ............ {INVARIANTS['quetes']}       (matérialisées : {INVARIANTS['quetes_materialisees']}/{INVARIANTS['quetes']} — la quête 2.1)")
    print(f"Items ............. {INVARIANTS['items_total']}     (matérialisés : {items_mat} → taux de matérialisation {taux:.1f} %)")
    print(f"Trame fiabilité ... {INVARIANTS['trame_fiabilite']}       (inchangée)")
    print(f"Signatures ........ {INVARIANTS['signatures_total']}       (matérialisées : {sigs_mat}/35 — M2:1 · M3:4 · M1:30 déclarées, maison en attente Voie B)")
    print(f"Codes signaux ..... {INVARIANTS['codes_signaux']}       (inchangés)")
    print()


def etitle(cid: str, nom: str) -> str:
    return f"{cid} · {nom}"


def main() -> int:
    for run in CHECKS:
        run()
    tableau_de_bord()
    passes = sum(1 for _, _, ok, _ in RESULTATS if ok)
    echecs = [(cid, nom, msg) for cid, nom, ok, msg in RESULTATS if not ok]
    largeur = max(len(etitle(cid, nom)) for cid, nom, _, _ in RESULTATS) + 2
    for cid, nom, ok, msg in RESULTATS:
        etiquette = "PASS" if ok else "🔴 ÉCHEC"
        print(f"{etitle(cid, nom):<{largeur}} {etiquette}")
        print(f"{'':<{largeur}} └─ {msg}")
    print()
    if echecs:
        print(f"VERDICT CI : {passes}/{len(RESULTATS)} vérifications passent · {len(echecs)} échec(s) — finding(s) ouvert(s), verdict du comité requis (Constitution [8] : le contrat gagne, on signale, on ne corrige pas).")
        for cid, nom, msg in echecs:
            print(f"  · {cid} — {nom}")
        return 1
    print(f"VERDICT CI : {passes}/{len(RESULTATS)} vérifications passent — le dépôt est conforme aux invariants tranchés.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
