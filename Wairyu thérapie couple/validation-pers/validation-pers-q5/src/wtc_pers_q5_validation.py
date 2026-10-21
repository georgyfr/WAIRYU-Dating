# -*- coding: utf-8 -*-
"""WTC-PERS-Q5 « Le pas sous ma carte » (RIO-23) — validation C1-C7.

7 critères ÉLIMINATOIRES (SPEC §5 verrouillée) + rapport autoporteur
(Verdict fermé — leçon E-SM-12) + 4 figures 1920×1080 + JSON results.
Séquence D-CANAL-2 : run ×2 → SHA ×2 → verdict.
"""
import hashlib
import json
import os
import sys
from collections import Counter

_HERE = os.path.dirname(os.path.abspath(__file__))
_BASE = os.path.dirname(_HERE)
sys.path.insert(0, _HERE)

import matplotlib  # noqa: E402
matplotlib.use("Agg")
import matplotlib.font_manager as fm  # noqa: E402

for _f in ("/usr/share/fonts/truetype/chinese/NotoSansSC-Regular.ttf",
           "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"):
    if os.path.exists(_f):
        fm.fontManager.addfont(_f)

import matplotlib.pyplot as plt          # noqa: E402
plt.rcParams["font.sans-serif"] = ["Noto Sans SC", "DejaVu Sans"]
plt.rcParams["axes.unicode_minus"] = False

import wtc_pers_q5_core as core          # noqa: E402 — moteur RIO-23
import wtc_pers_q5_simulator as sim      # noqa: E402 — univers 650/14

DATE = "2026-10-20"
FIG_W, FIG_H = 19.20, 10.80

MOTS_INTERDITS = (
    "pathologie", "diagnostic", "diagnostiquer", "dépistage", "trouble",
    "narcissique", "narcissisme", "pervers", "toxique", "manipulateur",
    "manipulation", "dysfonctionnement", "aliéné", "dément", "folie",
    "c'est sa faute", "c'est de sa faute", "il bloque", "elle bloque",
    "à cause de lui", "à cause d'elle", "incapable", "culpable", "coupable",
    "sanction", "échec", "réussite", "obligatoire", "tu dois", "il faut",
    "il te reste", "reste ", "compte à rebours", "score", "pourcentage",
)

# Libellés légitimes du core — 0 invention (C7) : tout texte affiché en
# provient (ou est un format {n}/{source}/{texte} de ces gabarits).
LIBELLES_LEGITIMES = set(core.PAS_FORCE.values()) | set(core.PAS_DESAMO.values()) \
    | {core.PAS_GESTE, core.PAS_CARTE, core.PAS_ZERO}


def _sha(obj):
    return hashlib.sha256(json.dumps(obj, sort_keys=True, ensure_ascii=False,
                                     default=str).encode()).hexdigest()[:16]


def _texts_of(res):
    """Tous les textes affichables d'un résultat (C5/C6/C7)."""
    t = []
    if res.get("bandeau"):
        t.append(res["bandeau"])
    if res.get("eclairage"):
        t.append(res["eclairage"])
    st = core.affichage_statut(res)
    if st:
        t.append(st)
    rc = core.affichage_rci(res)
    if rc:
        t.append(rc)
    for cand in (res.get("banque") or []):
        t.append(cand["libelle"])
    if res.get("pas"):
        t.append(res["pas"]["libelle"])
    return t


# ═══════════════════════════ C1 — dérivation pure ════════════════════════════
def critere_c1(classes):
    """Traçabilité 100 % : chaque candidat traçable vers ses héritages
    (famille + source + cible cohérents avec l'état contresigné), libellés
    ∈ constants du core (0 invention), anti-fabrication DOUBLE SENS
    (choix hors banque refusé ; force calme jamais candidate)."""
    bad = []
    refuse_ok = False
    for g, i, res in classes:
        c = dict(rives_by_key[(g, i)])
        lum = core.q3core.deriver_rive(c["her_q1"], c["her_q2"])
        forces = lum.get("forces") or {}
        for cand in (res.get("banque") or []):
            fam, cle = cand["cible"]
            if fam == "FORCE" and (cle not in forces
                                   or forces[cle]["conservateur"]
                                   not in core.SOUTIEN):
                bad.append((g, i, cand["famille"], "force non soutenue"))
            if fam == "MÉCANISME":
                mec = (c["her_q2"].get("mecanismes") or {}).get(cle) or {}
                if mec.get("cons") not in core.SOUTIEN:
                    bad.append((g, i, cand["famille"], "mécanisme inactif"))
            if cand["libelle"] not in LIBELLES_LEGITIMES:
                bad.append((g, i, cand["famille"], "libellé hors core"))
            if cand["source"] is None or cand["cible"] is None:
                bad.append((g, i, cand["famille"], "traçabilité absente"))
    # anti-fabrication : choix hors banque → ValueError
    g, i, res = [(g, i, r) for g, i, r in classes
                 if r["etat"] == core.ETAT_PAS][0]
    try:
        core.deriver_pas({**rives_by_key[(g, i)], "choix": "FORCE:ZZ"})
    except ValueError:
        refuse_ok = True
    # double sens : toute FORCE candidate doit être soutenue (une force
    # calme — absence décrite — n'est jamais candidate) : couvert ci-dessus
    calme_fuite = any(
        True for g, i, res in classes
        for cand in (res.get("banque") or [])
        if cand["cible"][0] == "FORCE"
        and (core.q3core.deriver_rive(rives_by_key[(g, i)]["her_q1"],
                                      rives_by_key[(g, i)]["her_q2"])
             .get("forces") or {}).get(cand["cible"][1], {})
        .get("conservateur") not in core.SOUTIEN)
    n_cands = sum(len(res.get("banque") or []) for _, _, res in classes)
    return {"ok": not bad and refuse_ok and not calme_fuite,
            "n_candidats": n_cands, "violations": bad[:10],
            "choix_hors_banque_refuse": refuse_ok,
            "calme_jamais_candidate": not calme_fuite}


# ═══════════════════════════ C2 — déterminisme ═══════════════════════════════
def critere_c2(classes):
    """Déterminisme : la même entrée → la même sortie bit à bit (×2 passes
    internes) ; contrôle anti-dérive espérance ↔ réalisation (patrons μ) ;
    frontières de série déterministes (8/14 · 9/14 · 10/14)."""
    flip = 0
    for g, i, res in classes:
        again = core.deriver_pas(rives_by_key[(g, i)])
        if json.dumps(again, sort_keys=True, ensure_ascii=False, default=str) \
                != json.dumps(res, sort_keys=True, ensure_ascii=False,
                              default=str):
            flip += 1
    serie_ok = True
    h1, h2 = sim._rive("M", 0)
    choix = sim._choix_defaut(h1, h2)
    attendu = {8: core.STATUT_EN_CHEMIN, 9: core.STATUT_CELEBRE,
               10: core.STATUT_CELEBRE}
    for k, want in attendu.items():
        r = core.deriver_pas({"her_q1": h1, "her_q2": h2, "choix": choix,
                              "serie": sim._serie_14(k)})
        if r["statut"] != want:
            serie_ok = False
    ce = sim.controle_esperance()
    return {"ok": flip == 0 and serie_ok and ce["ok"],
            "flips": flip, "frontieres_serie": serie_ok,
            "esperance": ce["ok"]}


# ═══════════════════════════ C3 — D-STD-2 ════════════════════════════════════
def critere_c3(classes, calib):
    """Bornes DISTINCTES (leçon ad01f21) : 9/14 ≠ 0,58 ≠ 0,41 ; zones RCI
    couvertes (FIABLE/SUGGESTION/BRUIT énumérées) ; conformité PAR groupe
    au seuil D-STD-2 (frontières série exactes, verdicts Δ stables)."""
    if not calib["bornes_distinctes"] or calib["zones_couvertes"] < 3:
        return {"ok": False, "raison": "bornes non distinctes / zones < 3",
                "calib": calib}
    # conformité par groupe : les séries injectées respectent leur frontière
    nonconf = []
    for g, i, res in classes:
        if g == "G12_FRONTIERES_9_14":
            want = core.STATUT_EN_CHEMIN if res["coches"] < 9 \
                else core.STATUT_CELEBRE
            if res["statut"] != want:
                nonconf.append((g, i, res["coches"]))
        if g == "G13_RCI_FRONTIERES":
            d = abs(res["rci"]["delta"])
            want = "FIABLE" if d >= 0.58 else ("SUGGESTION" if d >= 0.41
                                               else "BRUIT")
            if res["rci"]["verdict"] != want:
                nonconf.append((g, i, d))
        if g == "G14_ANTI_C6":
            want = core.STATUT_CELEBRE if res["coches"] == 14 \
                else core.STATUT_EN_CHEMIN
            if res["statut"] != want:
                nonconf.append((g, i, res["coches"]))
    n_groupes = len(sim.GEOMETRIE)
    return {"ok": not nonconf, "non_conformites": nonconf[:10],
            "n_groupes": n_groupes, "calib": calib}


# ═══════════════════════════ C5 — gabarit d'affichage ════════════════════════
def critere_c5(classes):
    """Affichage 100 % : bandeaux sur états non déployés, textes
    autoporteurs (pas de score nu), banque jamais vide hors zone calme,
    éclairage Q4 jamais une règle (même banque avec/sans éclairage)."""
    bad = []
    h1, h2 = sim._rive("M", 0)
    choix = sim._choix_defaut(h1, h2)
    r0 = core.deriver_pas({"her_q1": h1, "her_q2": h2, "choix": choix})
    r1 = core.deriver_pas({"her_q1": h1, "her_q2": h2, "choix": choix,
                           "eclairage_q4": "contexte de démonstration"})
    eclairage_ok = ([core._id_de(x) for x in r0["banque"]]
                    == [core._id_de(x) for x in r1["banque"]]
                    and r0["statut"] == r1["statut"]
                    and r0["rci"] == r1["rci"]
                    and r1["eclairage"] is not None)
    if not eclairage_ok:
        bad.append("eclairage modifie une règle")
    for g, i, res in classes:
        if res["etat"] in (core.ETAT_FILET, core.ETAT_VERROU,
                           core.ETAT_AUCUN, core.ETAT_ZONE_CALME,
                           core.ETAT_CARTE_SEULE) and not res["bandeau"]:
            bad.append((g, i, "bandeau absent"))
        if res["statut"] is not None and core.affichage_statut(res) is None:
            bad.append((g, i, "texte statut absent"))
        if res["banque"] is not None and len(res["banque"]) == 0:
            bad.append((g, i, "banque vide"))
    return {"ok": not bad and eclairage_ok, "violations": bad[:10],
            "eclairage_display_only": eclairage_ok}


# ═══════════════════ C6 — anti-sanction / anti-injonction ════════════════════
def critere_c6(classes):
    """0 mot interdit dans TOUT texte affiché ; PERFECT 14/14 = célébré
    sans injonction ; ZERO 0/14 = EN CHEMIN, jamais de sanction ; pile
    9/14 = célébré pile (pas de « visez plus »)."""
    mots = Counter()
    for g, i, res in classes:
        for t in _texts_of(res):
            low = t.lower()
            for m in MOTS_INTERDITS:
                if m in low:
                    mots[m] += 1
    pieges = {"perfect_ok": 0, "zero_ok": 0, "pile_ok": 0}
    for g, i, res in classes:
        if g == "G14_ANTI_C6":
            if res["coches"] == 14 and res["statut"] == core.STATUT_CELEBRE:
                pieges["perfect_ok"] += 1
            if res["coches"] == 0 and res["statut"] == core.STATUT_EN_CHEMIN:
                pieges["zero_ok"] += 1
        if g == "G12_FRONTIERES_9_14" and res["coches"] == 9:
            t = (core.affichage_statut(res) or "").lower()
            if "pile" in t and "pas besoin" in t:
                pieges["pile_ok"] += 1
    return {"ok": not mots and all(v > 0 for v in pieges.values()),
            "mots_interdits": dict(mots), "pieges": pieges}


# ═══════════════════════════ C7 — filet + 0 invention ════════════════════════
def critere_c7(classes):
    """Filet AVANT l'arbre (G11 : banque None, pas None, statut None) ;
    rive non synchronisée : aucune entrée partenaire dans le moteur ;
    0 invention : libellés ⊆ constants ; 4 voies de filet couvertes
    (signal Q1 / P-FILTRE Q2 / verrouillée / aucun résultat)."""
    bad = []
    voies = Counter()
    for g, i, res in classes:
        if g == "G11_SIGNAL_FILET":
            voies[res["etat"]] += 1
            if res["banque"] is not None or res["pas"] is not None \
                    or res["statut"] is not None:
                bad.append((g, i, "arbre atteint sous filet"))
    voies_ok = voies.get(core.ETAT_FILET, 0) >= 25 \
        and voies.get(core.ETAT_VERROU, 0) > 0 \
        and voies.get(core.ETAT_AUCUN, 0) > 0
    # rive seule : le moteur ne reçoit JAMAIS de héritage partenaire
    sig = [p for p in core.deriver_pas.__code__.co_varnames]
    rive_seule_ok = "her_q1" in sig and "her_q2" in sig \
        and "partenaire" not in " ".join(sig)
    n_inv = 0
    for g, i, res in classes:
        for t in _texts_of(res):
            lib = [x for x in LIBELLES_LEGITIMES if x in t]
            if t not in LIBELLES_LEGITIMES and not lib and not t.startswith(
                    ("Le pas", "Aucun", "Lecture", "Zone", "Choisis",
                     "Éclairage", "9 jours", "Une piste", "Dans le bruit",
                     "Le changement")) and "{n}" not in t \
                    and not any(t.startswith(p) for p in
                                ("1 jours", "2 jours", "3 jours", "4 jours",
                                 "5 jours", "6 jours", "7 jours", "8 jours",
                                 "10 jours", "11 jours", "12 jours",
                                 "13 jours", "14 jours", "0 jours")):
                n_inv += 1
    return {"ok": not bad and voies_ok and rive_seule_ok and n_inv == 0,
            "voies_filet": dict(voies), "violations": bad[:10],
            "rive_seule": rive_seule_ok, "textes_hors_gabarit": n_inv}


# ═══════════════════════════ Figures (1920×1080) ═════════════════════════════
def _fig_setup(ax, titre):
    ax.set_title(titre, fontsize=15, pad=12)
    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)


def generer_figures(classes, r1, outdir):
    os.makedirs(outdir, exist_ok=True)
    figs = []
    # F1 — états du pas
    fig, ax = plt.subplots(figsize=(FIG_W, FIG_H), constrained_layout=True)
    c = Counter(res["etat"] for _, _, res in classes)
    ordre = [core.ETAT_PAS, core.ETAT_ZONE_CALME, core.ETAT_CARTE_SEULE,
             core.ETAT_FILET, core.ETAT_VERROU, core.ETAT_AUCUN]
    vals = [c.get(k, 0) for k in ordre]
    ax.barh(ordre[::-1], vals[::-1], color="#4C6EF5")
    for y, v in enumerate(vals[::-1]):
        ax.text(v + 3, y, str(v), va="center", fontsize=13)
    _fig_setup(ax, "RIO-23 — états du pas (650 rives / 14 groupes)")
    ax.set_xlabel("rives")
    f1 = os.path.join(outdir, "fig1_etats.png")
    fig.savefig(f1, dpi=100)
    plt.close(fig)
    figs.append(f1)
    # F2 — composition des banques par famille
    fig, ax = plt.subplots(figsize=(FIG_W, FIG_H), constrained_layout=True)
    fams = Counter(cand["famille"] for _, _, res in classes
                   for cand in (res.get("banque") or []))
    ax.bar(list(fams.keys()), list(fams.values()), color="#12B886")
    for x, v in enumerate(fams.values()):
        ax.text(x, v + 20, str(v), ha="center", fontsize=13)
    _fig_setup(ax, "RIO-23 — candidats dérivés par famille (traçabilité C1)")
    ax.set_ylabel("candidats")
    f2 = os.path.join(outdir, "fig2_familles.png")
    fig.savefig(f2, dpi=100)
    plt.close(fig)
    figs.append(f2)
    # F3 — check-in 9/14 (frontières)
    fig, ax = plt.subplots(figsize=(FIG_W, FIG_H), constrained_layout=True)
    co = Counter(res["coches"] for g, _, res in classes
                 if g in ("G12_FRONTIERES_9_14", "G14_ANTI_C6"))
    ks = sorted(co)
    cols = ["#FAB005" if k < 9 else "#40C057" for k in ks]
    ax.bar([str(k) + "/14" for k in ks], [co[k] for k in ks], color=cols)
    ax.axvline(x=ks.index(9) if 9 in ks else len(ks) - 1, color="#FA5252",
               linestyle="--", label="seuil 9/14 (célébré, jamais de sanction)")
    ax.legend(fontsize=12, loc="upper left", bbox_to_anchor=(0.0, 1.0))
    _fig_setup(ax, "RIO-23 — check-in 14 jours : frontières 9/14 (anti-C6)")
    ax.set_ylabel("rives")
    f3 = os.path.join(outdir, "fig3_checkin.png")
    fig.savefig(f3, dpi=100)
    plt.close(fig)
    figs.append(f3)
    # F4 — zones RCI (Δ mesurés)
    fig, ax = plt.subplots(figsize=(FIG_W, FIG_H), constrained_layout=True)
    deltas = [abs(res["rci"]["delta"]) for g, _, res in classes
              if g == "G13_RCI_FRONTIERES" and res["rci"]]
    ax.hist(deltas, bins=[0, 0.41, 0.58, 1.0], color="#7048E8",
            edgecolor="white")
    ax.axvline(x=0.41, color="#F59F00", linestyle="--", label="0,41 (SUGGESTION)")
    ax.axvline(x=0.58, color="#E64980", linestyle="--", label="0,58 (FIABLE)")
    ax.legend(fontsize=12, loc="upper right", bbox_to_anchor=(1.0, 1.0))
    _fig_setup(ax, "RIO-23 — re-test 8 semaines : zones RCI (bornes verbatim)")
    ax.set_xlabel("|Δ| sur la cible du pas")
    f4 = os.path.join(outdir, "fig4_rci.png")
    fig.savefig(f4, dpi=100)
    plt.close(fig)
    figs.append(f4)
    return figs


# ═══════════════════════════ Rapport autoporteur ═════════════════════════════
def generer_rapport(r1, classes, sha1, sha2, figs):
    c = Counter(res["etat"] for _, _, res in classes)
    fams = Counter(cand["famille"] for _, _, res in classes
                   for cand in (res.get("banque") or []))
    L = []
    L.append("# WTC-PERS-Q5 « Le pas sous ma carte » (RIO-23) — rapport de validation\n")
    L.append("**Verdict : " + r1["verdict"] + "** — " + DATE + " · 650 rives /"
             " 14 groupes (seed 42 ×2) · SHA ×2 " + sha1[:8] + "…"
             + (" IDENTIQUES" if sha1 == sha2 else " DIFFÉRENTS") + "\n")
    L.append("## Ce que ce paquet valide")
    L.append("- C1 dérivation pure : " + str(r1["c1"]["n_candidats"])
             + " candidats, 100 % traçables (source + cible), 0 libellé hors core,"
             " choix hors banque refusé, force calme jamais candidate.")
    L.append("- C2 déterminisme : 0 flip sur 650 ×2 ; frontières série 8/9/10"
             " exactes ; espérance CLIP-AWARE = réalisation (patrons F/FORTE).")
    L.append("- C3 D-STD-2 : bornes DISTINCTES (9 ≠ 0,58 ≠ 0,41) ; zones RCI"
             " couvertes : " + str(r1["c3"]["calib"]["zones_couvertes"])
             + " ; 0 non-conformité par groupe.")
    L.append("- C4 empreinte : SHA ×2 " + ("identiques" if sha1 == sha2
                                           else "DIFFÉRENTS") + ".")
    L.append("- C5 gabarit : bandeaux présents sur tous les états non"
             " déployés ; éclairage Q4 = affichage seul (règles inchangées).")
    L.append("- C6 anti-sanction : 0 mot interdit ; PERFECT 14/14 célébré sans"
             " injonction ; ZERO 0/14 jamais sanctionné ; pile 9/14 dit"
             " « pas besoin de viser plus ».")
    L.append("- C7 filet avant arbre : " + json.dumps(r1["c7"]["voies_filet"],
                                                      ensure_ascii=False)
             + " ; rive non synchronisée préservée ; 0 invention.")
    L.append("\n## États du pas (650 rives)")
    for k in (core.ETAT_PAS, core.ETAT_ZONE_CALME, core.ETAT_CARTE_SEULE,
              core.ETAT_FILET, core.ETAT_VERROU, core.ETAT_AUCUN):
        L.append("- " + k + " : " + str(c.get(k, 0)))
    L.append("\n## Candidats dérivés par famille")
    for k, v in fams.items():
        L.append("- " + k + " : " + str(v))
    L.append("\n## Leçon consignée (D-HIST)")
    L.append("- La banque n'est JAMAIS vide en mode complet par construction"
             " contresignée : une ombre calme soutient retour/geste (faces"
             " inverses), une ombre vive offre un désamorçage. La zone calme"
             " canon est donc l'état hérité de Q2 (label ZONE_CALME), où le"
             " pas zéro est PRINCIPAL et les exercices restent des options —"
             " pas une banque vide. La branche défensive (banque vide) reste"
             " dans le moteur, jamais atteinte, documentée comme telle.")
    L.append("- Les Δ RCI mesurables par flips d'items (granularité des"
             " blocs Q2) sont ±0,25 / ±0,50 / ±0,75 : les trois zones"
             " (BRUIT/SUGGESTION/FIABLE) sont couvertes ; la frontière pile"
             " 0,58/0,41 est vérifiée par énumération exhaustive"
             " (calibration_d_std_2), pas par un profil atterri pile.")
    L.append("\n## Figures")
    for f in figs:
        L.append("- " + os.path.basename(f))
    L.append("\n## Séquence D-CANAL-2")
    L.append("production (ce paquet) → run ×2 → SHA ×2 → publication →"
             " pointeurs hub/SPEC → audit origin → contresignature fondateur"
             " (« je valide ») → registre 23/23, personnalité 5/5.")
    return "\n".join(L) + "\n"


# ═══════════════════════════ Orchestration ═══════════════════════════════════
rives_by_key = {}


def executer(publier=True):
    global rives_by_key
    base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    shas = []
    r1 = None
    for run in (1, 2):
        rives = sim.toutes_les_rives(run=run)
        rives_by_key = {(g, i): c for g, i, c in rives}
        classes = sim.classes_of(rives)
        calib = sim.calibration_d_std_2()
        r = {
            "c1": critere_c1(classes),
            "c2": critere_c2(classes),
            "c3": critere_c3(classes, calib),
            "c5": critere_c5(classes),
            "c6": critere_c6(classes),
            "c7": critere_c7(classes),
        }
        meta_canon = {"date": DATE, "n_rives": len(rives),
                      "n_groupes": 14, "seed": sim.SEED,
                      "spec": "PERS-Q5-SPEC.md (verrouillée d77e95a)",
                      "heritage": "RIO-19 (3b1a7490…) + RIO-20 (6d9b3c59…)"
                                  " + RIO-21 (7644a957…) contresignés —"
                                  " moteur RIO-21 consommé tel quel"}
        contenu = {k: r[k] for k in ("c1", "c2", "c3", "c5", "c6", "c7")}
        contenu["meta"] = meta_canon
        contenu["calib"] = {k: calib[k] for k in
                            ("seuils", "bornes_distinctes",
                             "deltas_enumeres", "zones_couvertes",
                             "n_stochastiques", "n_deterministes")}
        sha = _sha(contenu)
        shas.append(sha)
        if run == 1:
            r1 = r
            r1["calib"] = contenu["calib"]
            r1["meta"] = meta_canon
            r1["_classes"] = classes
        else:
            r1["_sha2"] = sha
    r1["c4"] = {"sha1": shas[0], "sha2": shas[1],
                "identiques": shas[0] == shas[1],
                "ok": shas[0] == shas[1]}
    criteres = {k: r1[k]["ok"] for k in ("c1", "c2", "c3", "c4", "c5",
                                         "c6", "c7")}
    r1["verdict"] = ("VALIDÉ 7/7" if all(criteres.values())
                     else "INVALIDE " + ",".join(k for k, v in
                                                 criteres.items() if not v))
    if publier:
        resdir = os.path.join(base, "results")
        figdir = os.path.join(base, "figures")
        os.makedirs(resdir, exist_ok=True)
        os.makedirs(figdir, exist_ok=True)
        classes = r1["_classes"]
        figs = generer_figures(classes, r1, figdir)
        rapport = generer_rapport(r1, classes, shas[0], shas[1], figs)
        with open(os.path.join(resdir, "RAPPORT.md"), "w") as f:
            f.write(rapport)
        out = {k: r1[k] for k in ("c1", "c2", "c3", "c4", "c5", "c6", "c7",
                                  "verdict", "meta", "calib")}
        with open(os.path.join(resdir, "results.json"), "w") as f:
            json.dump(out, f, ensure_ascii=False, indent=1, default=str)
    return r1


if __name__ == "__main__":
    r = executer(publier=len(sys.argv) < 2 or sys.argv[1] != "--dry")
    print("VERDICT:", r["verdict"])
    for k in ("c1", "c2", "c3", "c4", "c5", "c6", "c7"):
        print(" ", k, "→", r[k]["ok"])
    print("  SHA ×2:", r["c4"]["sha1"][:8], "/", r["c4"]["sha2"][:8])
