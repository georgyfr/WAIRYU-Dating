# -*- coding: utf-8 -*-
"""WAIRYU — WTC-EXT-Q3-02 : simulateur Extensions Q3 « Le pas de l'horizon ».
650 couples · 14 groupes · seed 42 ×2 (D-SIM) · σ_item = 0,60 (D-PARAM).

Entrées = sorties RIO-16 des deux rives + croisement Q2 (A2-a : zéro item
nouveau) — la mécanique RIO-16 verrouillée (addf575 : L1-L3) et le croisement
Q2 (5bc9600 : niveaux/config/palier/L6) sont ré-implémentés ICI pour produire
les entrées consommées par le pas (ré-implémentation indépendante = croisé
D-VÉRITÉ, patron Q2). Population percentiles HÉRITÉE de Q2 (core, jamais
recalculée — une mesure un rôle). Classification VRAIE ancrée sur les μ vrais
(D-GÉOMÉTRIE). Déterministe (seed 42).

Groupes (SPEC §6 verrouillée — 3 × 50 paliers + ZONE_CALME 40 + SIGNAL_FILET
40 + FRONTIÈRES_9_14 40 + RCI_FRONTIÈRES 40 + ANTI_C6 40 ; complétement
LIBRE) : G09_RCI_FIABLE 50 · G10_RCI_BRUIT 60 · G11_RCI_CONTRASTE 40
(ensembles PAR RIVE — jamais comparés) · G12_STYLES_DISSEMBLABLES 50 ·
G13_BOUCLE_PERCENTILES 50 · G14_RQS_NON_ENTRÉE 40 (20 INVALIDE déterministes
+ 20 PRUDENCE entrants — la frontière RQS testée dans le groupe)."""
from __future__ import annotations

import numpy as np

import wtc_ext_q3_core as core

rng = np.random.default_rng(42)

SEED = 42
SIGMA_ITEM = 0.60
N_ITEMS = 18
ITEMS = [f"EXT-H1-{k}" for k in (1, 2, 3)] + [f"EXT-H2-{k}" for k in (1, 2, 3)] \
    + [f"EXT-L1-{k}" for k in (1, 2, 3)] + [f"EXT-L2-{k}" for k in (1, 2, 3)] \
    + [f"EXT-C1-{k}" for k in (1, 2, 3)] + [f"EXT-C2-{k}" for k in (1, 2, 3)]
INVERSES = {"EXT-H2-3", "EXT-C2-3"}
ITEM_VIGILANCE = "EXT-VIG"
FACES_NOMS = ("H1", "H2", "L1", "L2", "C1", "C2")

GEOMETRIE = core.GEOMETRIE
POPULATION = core.POPULATION          # héritée de Q2 — jamais recalculée
DELTAS_EXACTES_G07 = core.DELTAS_EXACTES_G07


def _item_corr(mu):
    """Item corrigé ~ N(mu, σ) tronqué [1,4] arrondi (inversions corrigées
    en bloc par le générateur vectorisé du core — même processus)."""
    return int(np.clip(round(rng.normal(mu, SIGMA_ITEM)), 1, 4))


def _corr_from_mu(mu_faces):
    out = []
    for face in FACES_NOMS:
        for _ in range(3):
            out.append(int(np.clip(round(rng.normal(mu_faces[face], SIGMA_ITEM)), 1, 4)))
    return out


def _corr_to_raws(corr):
    """Convertit les valeurs corrigées en réponses brutes (inversés : 5 − c)."""
    raws = {}
    for it, c in zip(ITEMS, corr):
        raws[it] = int(5 - c) if it in INVERSES else int(c)
    return raws


def _temps(normale=True):
    if normale:
        t = {it: float(np.clip(rng.normal(4.5, 1.2), 1.0, None)) for it in ITEMS}
        t[ITEM_VIGILANCE] = float(np.clip(rng.normal(4.5, 1.2), 1.0, None))
        return t, float(sum(t.values()) + rng.normal(10.0, 3.0))
    # fabrication G14-INVALIDE : session < 60 s, items rapides
    t = {it: 1.5 for it in ITEMS}
    t[ITEM_VIGILANCE] = 1.5
    return t, 45.0


# ═══════ Ré-implémentation des sorties RIO-16 (mécanique verrouillée) ════════
def corrige(item, raw):
    return round(5.0 - float(raw), 2) if item in INVERSES else round(float(raw), 2)


def calcule_rqs(raws, temps_items, temps_session):
    """L1 verbatim (ligne 257) — mêmes règles que RIO-16 (addf575)."""
    corr = {i: corrige(i, raws[i]) for i in ITEMS}
    penalites = []
    vals = [corr[i] for i in ITEMS]
    m = sum(vals) / len(vals)
    sd = (sum((v - m) ** 2 for v in vals) / len(vals)) ** 0.5
    if sd < 0.45:
        penalites.append(20)
    for inv in sorted(INVERSES):
        face = inv.rsplit("-", 1)[0]
        freres = [f for f in ITEMS if f.startswith(face) and f != inv]
        moi = corr[inv]
        autres = [corr[f] for f in freres]
        if abs(moi - sum(autres) / len(autres)) >= 2.5:
            penalites.append(20)
    rapides = sum(1 for t in temps_items.values() if t < 2.0)
    if rapides >= 5 or temps_session < 60.0:
        penalites.append(25)
    if float(raws.get(ITEM_VIGILANCE, 1)) > 1:
        penalites.append(20)
    rqs = max(0, 100 - sum(penalites))
    statut = "OK" if rqs >= 85 else ("PRUDENCE" if rqs >= 70 else "INVALIDE")
    return {"rqs": rqs, "statut": statut, "sd_items": round(sd, 4)}


def sortie_rive(profil):
    """Sortie RIO-16 d'une rive (ce que le croisement puis le pas
    consomment) : statut RQS, filet, scores d'axes H/L/C, faces, agrégat."""
    raws = {i: profil[i] for i in ITEMS}
    raws[ITEM_VIGILANCE] = profil.get(ITEM_VIGILANCE, 1)
    rqs = calcule_rqs(raws, profil.get("temps_items", {}),
                      profil.get("temps_session", 999.0))
    corr = {i: corrige(i, raws[i]) for i in ITEMS}
    faces = {}
    for face in FACES_NOMS:
        items_face = [i for i in ITEMS if i.startswith(f"EXT-{face}-")]
        faces[face] = round(sum(corr[i] for i in items_face) / 3, 2)
    axes = {}
    for axe in ("H", "L", "C"):
        items_axe = [i for i in ITEMS if f"EXT-{axe}" in i]
        axes[axe] = round(sum(corr[i] for i in items_axe) / 6, 4)
    aggregate = round(sum(corr[i] for i in ITEMS) / N_ITEMS, 3)
    return {"rqs_statut": rqs["statut"], "rqs": rqs["rqs"],
            "filet": bool(profil.get("signal_herite", False)),
            "score_H": axes["H"], "score_L": axes["L"], "score_C": axes["C"],
            "faces": faces, "aggregate": aggregate, "moyenne": aggregate}


def _rive(mu_faces, groupe, idx, rive, filet=False, fabrication=None):
    """fabrication : None (normale) | "INVALIDE" (raws plats + vigilance 4 +
    session 45 s → RQS 35) | "PRUDENCE" (vigilance 2 → RQS 80)."""
    corr = _corr_from_mu(mu_faces)
    raws = _corr_to_raws(corr)
    temps, session = _temps(normale=(fabrication != "INVALIDE"))
    p = {it: int(raws[it]) for it in ITEMS}
    p[ITEM_VIGILANCE] = 1 if fabrication is None else (
        4 if fabrication == "INVALIDE" else 2)
    p["temps_items"] = temps
    p["temps_session"] = round(session, 1)
    p["signal_herite"] = bool(filet)
    p["id"] = f"{groupe}_{idx:03d}_{rive}"
    p["groupe"] = groupe
    p["_mu_faces"] = dict(mu_faces)
    p["_fabrication"] = fabrication
    return p


# ═══════ Ré-implémentation du croisement Q2 (5bc9600 — croisé D-VÉRITÉ) ══════
def niveau_croisement(score):
    """Faible < 2,50 ≤ Modéré < 3,50 ≤ Forte (Q2-A3, tranchage inclusif)."""
    if score < 2.50:
        return "FAIBLE"
    if score < 3.50:
        return "MODÉRÉE"
    return "FORTE"


def croisement_q2(rive_a, rive_b):
    """Verdict du croisement Q2 consommé par le pas (hérité, JAMAIS
    recalculé par le moteur Q3) : config, palier max-niveau, zone calme,
    héritages L6 (boucle, styles, asymétries L/C)."""
    filet = bool(rive_a["filet"] or rive_b["filet"])
    n1 = niveau_croisement(rive_a["score_H"])
    n2 = niveau_croisement(rive_b["score_H"])
    i, j = ["FAIBLE", "MODÉRÉE", "FORTE"].index(n1), \
        ["FAIBLE", "MODÉRÉE", "FORTE"].index(n2)
    num = i * 3 + j + 1
    plus_haut = max(n1, n2, key=["FAIBLE", "MODÉRÉE", "FORTE"].index)
    palier = ("ORIENTATION" if plus_haut == "FORTE"
              else "MODULE DE COUPLE" if plus_haut == "MODÉRÉE"
              else "EXERCICE MAISON")
    pa = core.percentile_de(rive_a["aggregate"])
    pb = core.percentile_de(rive_b["aggregate"])
    return {"niveaux": {"rive1": n1, "rive2": n2},
            "config_num": num,
            "config_nom": _NOM_CONFIG[num],
            "palier": palier,
            "zone_calme": num == 1,
            "entree": not filet
            and "INVALIDE" not in (rive_a["rqs_statut"],
                                   rive_b["rqs_statut"]),
            "override": filet,
            "boucle_probable": abs(pa - pb) >= 30.0,
            "styles_dissemblables":
                round(abs(rive_a["moyenne"] - rive_b["moyenne"]), 2) >= 1.00,
            "asym_L": {"ecart": round(abs(rive_a["score_L"]
                                          - rive_b["score_L"]), 2),
                       "lecture": "ASYMÉTRIE MARQUÉE"
                       if round(abs(rive_a["score_L"] - rive_b["score_L"]),
                                2) >= 1.00 else "asymétrie légère"},
            "asym_C": {"ecart": round(abs(rive_a["score_C"]
                                          - rive_b["score_C"]), 2),
                       "lecture": "ASYMÉTRIE MARQUÉE"
                       if round(abs(rive_a["score_C"] - rive_b["score_C"]),
                                2) >= 1.00 else "asymétrie légère"}}


_NOM_CONFIG = {
    1: "LA MÊME HEURE", 2: "LE CADRAN QUI S'ÉVEILLE", 3: "L'HORLOGE SEULE",
    4: "L'ÉCHO QUI ATTEND", 5: "DEUX CADRANS", 6: "L'HORLOGE QUI DEVANCE",
    7: "L'HORLOGE SEULE, DE L'AUTRE CÔTÉ", 8: "L'AUTRE QUI DEVANCE",
    9: "LES DEUX HORLOGES VIVES",
}


# ═══════════════ Séries de check-in et choix de pas par groupe ═══════════════
def _serie_groupe(gname, i):
    """Série PARTAGÉE de 14 booléens (A3) — totaux fixés par groupe."""
    if gname == "G01_PALIER_VERT_EXERCICE":
        return tuple(j != 6 for j in range(core.N_JOURS))          # 13/14
    if gname == "G02_PALIER_ORANGE_MODULE":
        return tuple(j not in (2, 9) for j in range(core.N_JOURS))  # 12/14
    if gname == "G03_PALIER_ROUGE_ORIENTATION":
        return tuple(j not in (1, 5, 12) for j in range(core.N_JOURS))  # 11/14
    if gname in ("G04_ZONE_CALME_PAS_ZERO", "G05_SIGNAL_FILET"):
        return None                       # pas zéro : rien à évaluer / override
    if gname == "G06_FRONTIERES_9_14":
        total = (8, 9, 10)[i % 3]         # 8/14 · 9/14 · 10/14 pile
        return tuple(j < total for j in range(core.N_JOURS))
    if gname == "G07_RCI_FRONTIERES":
        return tuple(j not in (3, 11) for j in range(core.N_JOURS))  # 12/14
    if gname == "G08_ANTI_C6":
        if i < 20:
            return tuple(True for _ in range(core.N_JOURS))        # PERFECT
        return tuple(False for _ in range(core.N_JOURS))           # ZERO
    if gname == "G09_RCI_FIABLE":
        return tuple(j not in (2, 13) for j in range(core.N_JOURS))  # 12/14
    if gname == "G10_RCI_BRUIT":
        return tuple(j not in (4, 8, 12) for j in range(core.N_JOURS))  # 11/14
    if gname == "G11_RCI_CONTRASTE":
        return tuple(j != 7 for j in range(core.N_JOURS))          # 13/14
    if gname == "G12_STYLES_DISSEMBLABLES":
        return tuple(j not in (5, 10) for j in range(core.N_JOURS))  # 12/14
    if gname == "G13_BOUCLE_PERCENTILES":
        return tuple(j not in (1, 8) for j in range(core.N_JOURS))  # 12/14
    if gname == "G14_RQS_NON_ENTREE":
        if i < 20:
            return None                                            # non-entrée
        return tuple(j < 10 for j in range(core.N_JOURS))          # 10/14
    return None


def _choix_groupe(gname, i):
    """Le pas choisi par le couple (§5.5 — dans la banque de SA famille)."""
    bv = core.BANQUE_PAS_EXT[core.FAMILLE_VERT]
    bo = core.BANQUE_PAS_EXT[core.FAMILLE_ORANGE]
    br = core.BANQUE_PAS_EXT[core.FAMILLE_ROUGE]
    if gname in ("G01_PALIER_VERT_EXERCICE", "G06_FRONTIERES_9_14",
                 "G08_ANTI_C6", "G10_RCI_BRUIT"):
        return bv[i % 3]
    if gname in ("G02_PALIER_ORANGE_MODULE", "G07_RCI_FRONTIERES",
                 "G09_RCI_FIABLE", "G11_RCI_CONTRASTE",
                 "G12_STYLES_DISSEMBLABLES", "G13_BOUCLE_PERCENTILES"):
        return bo[i % 2]
    if gname == "G03_PALIER_ROUGE_ORIENTATION":
        return br[0]
    if gname == "G04_ZONE_CALME_PAS_ZERO":
        return core.PAS_ZERO
    if gname == "G05_SIGNAL_FILET":
        return br[0]                      # jamais servi — override D-CRISE
    if gname == "G14_RQS_NON_ENTREE":
        return br[0] if i < 20 else bv[i % 3]
    return None


def _gen_couple(gname, idx):
    g = GEOMETRIE[gname]
    filet_a = filet_b = False
    fab_a = fab_b = None
    if g.get("filet"):
        filet_a = True                    # crise héritée d'UNE rive (rive A)
        if idx >= 35:
            fab_a = "INVALIDE"            # items Forte traités en INVALIDE :
            # la crise court-circuite AVANT quoi qu'il arrive (override pur)
    if g.get("rqs_non_entree") and idx < 20:
        fab_a = "INVALIDE"                # RQS 35 → NON ENTRÉE déterministe
    elif g.get("rqs_non_entree"):
        fab_a = "PRUDENCE"                # RQS 80 → PRUDENCE entre (ligne 257)
    if g.get("rqs_non_entree"):
        mu_a = dict(g["A_inv"] if idx < 20 else g["A_pru"])
        mu_b = dict(g["B_inv"] if idx < 20 else g["B_pru"])
    else:
        mu_a = dict(g["A"])
        mu_b = dict(g["B"])
    if g.get("filet") and idx >= 35:
        mu_a = {f: 3.8 for f in FACES_NOMS}   # items Forte : override quand même
    couple = {
        "id": f"{gname}_{idx:03d}", "groupe": gname,
        "rive_a": _rive(mu_a, gname, idx, "A", filet=filet_a, fabrication=fab_a),
        "rive_b": _rive(mu_b, gname, idx, "B", filet=filet_b, fabrication=fab_b),
        "serie": _serie_groupe(gname, idx),
        "choix": _choix_groupe(gname, idx),
    }
    return couple


def tous_les_couples():
    """650 couples, 14 groupes — ordre déterministe (seed 42)."""
    out = []
    for gname, meta in GEOMETRIE.items():
        for i in range(meta["n"]):
            out.append(_gen_couple(gname, i))
    return out


def effectifs():
    return [(name, meta["n"]) for name, meta in GEOMETRIE.items()]


# ═════════════ Classification VRAIE — ancrée sur les μ vrais ═════════════════
def _mu_H(mu_faces):
    return round((mu_faces["H1"] + mu_faces["H2"]) / 2, 4)


def _mu_axe(mu_faces, axe):
    return round((mu_faces[f"{axe}1"] + mu_faces[f"{axe}2"]) / 2, 4)


def _mu_agg(mu_faces):
    return round(sum(mu_faces.values()) / 6.0, 4)


def classification_vraie(couple, sorties_pair):
    """Classification vraie (D-GÉOMÉTRIE) : filet → override ; INVALIDE
    fabriqué → non-entrée ; sinon config + palier + pas + statut + héritages
    + ensembles RCI par rive (μ → μ+d)."""
    a, b = couple["rive_a"], couple["rive_b"]
    g = GEOMETRIE[couple["groupe"]]
    if a.get("signal_herite") or b.get("signal_herite"):
        return {"type": "override"}
    if a.get("_fabrication") == "INVALIDE" or b.get("_fabrication") == "INVALIDE":
        return {"type": "non_entree"}
    mu_a, mu_b = a["_mu_faces"], b["_mu_faces"]
    nA, nB = niveau_croisement(_mu_H(mu_a)), niveau_croisement(_mu_H(mu_b))
    i, j = ["FAIBLE", "MODÉRÉE", "FORTE"].index(nA), \
        ["FAIBLE", "MODÉRÉE", "FORTE"].index(nB)
    cfg = i * 3 + j + 1
    plus_haut = max(nA, nB, key=["FAIBLE", "MODÉRÉE", "FORTE"].index)
    palier = ("ORIENTATION" if plus_haut == "FORTE"
              else "MODULE DE COUPLE" if plus_haut == "MODÉRÉE"
              else "EXERCICE MAISON")
    ua = core._mu_regime(mu_a)
    ub = core._mu_regime(mu_b)
    herit = core._heritage_vrai(ua, ub)
    pas = core.pas_de(palier, couple["choix"], cfg == 1)
    statut = core.statut_engagement_de(couple["serie"])
    rci = None
    if couple.get("re_tests"):
        rci = _rci_vrai(mu_a, mu_b, couple["groupe"], couple)
    return {"type": "entree", "config_num": cfg, "palier": palier,
            "pas": pas, "statut": statut, "heritages": herit, "rci": rci}


def _rci_vrai(mu_a, mu_b, gname, couple):
    """Ensembles RCI vrais par rive : statuts sur (μ, μ+d)."""
    g = GEOMETRIE[gname]
    out = {}
    for rive, mu, d in (("rive_a", mu_a, g.get("dA")),
                        ("rive_b", mu_b, g.get("dB"))):
        if d is None:
            # G07 : deltas exacts du sous-profil (ε = 0 → mesuré = vrai)
            d = couple["re_tests"][rive]["_d_exact"]
        statuts = []
        for k, axe in enumerate(core.AXES):
            base = _mu_axe(mu, axe)
            statuts.append(core.statut_rci_de(base, base + d[k]))
        out[rive] = core.statut_ensemble_de(statuts)
    return out


def _d_exact_g07(idx):
    return DELTAS_EXACTES_G07[idx % 4]


# ═══════════════ Assemblage : sorties, bases, re-tests ═══════════════════════
def _bases_de(sorties_pair):
    return {"rive_a": {"H": sorties_pair["rive_a"]["score_H"],
                       "L": sorties_pair["rive_a"]["score_L"],
                       "C": sorties_pair["rive_a"]["score_C"]},
            "rive_b": {"H": sorties_pair["rive_b"]["score_H"],
                       "L": sorties_pair["rive_b"]["score_L"],
                       "C": sorties_pair["rive_b"]["score_C"]}}


def _re_tests_de(gname, idx, bases):
    """Re-tests à 8 semaines (ligne 274) : nouvelle mesure de l'axe —
    SEM L7 verbatim (mode sem) ou Δ pile aux bornes (G07, ε = 0)."""
    g = GEOMETRIE[gname]
    if g.get("frontieres_rci"):
        dA, dB = _d_exact_g07(idx)
        return {"rive_a": {"H": round(bases["rive_a"]["H"] + dA[0], 4),
                           "L": round(bases["rive_a"]["L"] + dA[1], 4),
                           "C": round(bases["rive_a"]["C"] + dA[2], 4),
                           "_d_exact": dA},
                "rive_b": {"H": round(bases["rive_b"]["H"] + dB[0], 4),
                           "L": round(bases["rive_b"]["L"] + dB[1], 4),
                           "C": round(bases["rive_b"]["C"] + dB[2], 4),
                           "_d_exact": dB}}
    if g.get("re_mode") == "sem":
        dA, dB = g["dA"], g["dB"]
        out = {}
        for rive, d in (("rive_a", dA), ("rive_b", dB)):
            out[rive] = {}
            for k, axe in enumerate(core.AXES):
                bruit = float(rng.normal(0.0, core.SEM_L7))
                out[rive][axe] = round(bases[rive][axe] + d[k] + bruit, 4)
        return out
    return None


def construire():
    """Chaîne complète : items → sorties RIO-16 → croisement Q2 → bases →
    re-tests → entrées moteur. Déterministe (seed 42) : le flux rng est
    re-seedé LOCALEMENT à CHAQUE appel (D-EMPREINTE : deux exécutions →
    mêmes couples, mêmes re-tests → même SHA)."""
    global rng
    rng = np.random.default_rng(SEED)
    couples = tous_les_couples()
    lignes = []
    for c in couples:
        sorties = {"rive_a": sortie_rive(c["rive_a"]),
                   "rive_b": sortie_rive(c["rive_b"])}
        c["sorties"] = sorties
        c["sortie_q2"] = croisement_q2(sorties["rive_a"], sorties["rive_b"])
        c["bases"] = _bases_de(sorties)
        c["re_tests"] = _re_tests_de(c["groupe"],
                                     int(c["id"].split("_")[-1]), c["bases"])
        c["vrai"] = classification_vraie(c, sorties)
        lignes.append(c)
    return couples


def verdicts(couples):
    """Verdicts du moteur Q3 pour chaque couple (entrée du classifier)."""
    return [core.classifier(c["sortie_q2"], c["sorties"]["rive_a"],
                            c["sorties"]["rive_b"], c["serie"], c["choix"],
                            c["bases"], c["re_tests"]) for c in couples]


def conforme(couple, verdict):
    """Surface de conformité moteur / classification vraie (identique à la
    surface calibrée : type de sortie + config + palier + pas + statut +
    héritages + ensembles RCI par rive)."""
    vrai = couple["vrai"]
    if vrai["type"] == "override":
        return verdict["override"] is True
    if vrai["type"] == "non_entree":
        return verdict["display"] == core.DISPLAY_NON_ENTREE
    if not verdict["entree"]:
        return False
    ok = (verdict["config_num"] == vrai["config_num"]
          and verdict["palier"] == vrai["palier"]
          and verdict["pas"] == vrai["pas"]
          and verdict["statut"] == vrai["statut"])
    h = verdict.get("heritages") or {}
    for k in ("boucle", "styles", "asym_L", "asym_C"):
        if k in ("boucle", "styles"):
            ok &= bool(h.get(f"{k}_probable" if k == "boucle"
                             else f"{k}_dissemblables")) == vrai["heritages"][k]
        else:
            ok &= (h.get(k, {}).get("lecture")
                   == ("ASYMÉTRIE MARQUÉE" if vrai["heritages"][k]
                       else "asymétrie légère"))
    if vrai["rci"] is not None:
        for rive in core.RIVES:
            ok &= verdict["rci"]["rives"][rive]["ensemble"] == vrai["rci"][rive]
    return ok


def resume_groupes(couples, verdicts_list):
    """Résumé par groupe : N, conformes, pas servis, statuts, paliers,
    ensembles RCI, traversées, overrides, non-entrées."""
    resume = {}
    for gname, n in effectifs():
        membres = [(c, v) for c, v in zip(couples, verdicts_list)
                   if c["groupe"] == gname]
        conf = 0
        pas_servis = {}
        statuts = {core.STATUT_CELEBRE: 0, core.STATUT_EN_CHEMIN: 0,
                   "NON_ÉVALUÉ": 0}
        paliers = {"EXERCICE MAISON": 0, "MODULE DE COUPLE": 0,
                   "ORIENTATION": 0, "OVERRIDE": 0, "NON ENTRÉE": 0}
        ensembles = {core.ENSEMBLE_FIABLE: 0, core.ENSEMBLE_SUGGESTION: 0,
                     core.ENSEMBLE_BRUIT: 0, "N/A": 0}
        traversee_a = traversee_b = 0
        boucles = styles_servis = 0
        for c, v in membres:
            conf += int(conforme(c, v))
            if v["override"]:
                paliers["OVERRIDE"] += 1
            elif not v["entree"]:
                paliers["NON ENTRÉE"] += 1
            else:
                paliers[v["palier"]] += 1
                pas_servis[v["pas"]] = pas_servis.get(v["pas"], 0) + 1
                if v["statut"] is None:
                    statuts["NON_ÉVALUÉ"] += 1
                else:
                    statuts[v["statut"]] += 1
                if v["rci"]:
                    for rive in core.RIVES:
                        ensembles[v["rci"]["rives"][rive]["ensemble"]] += 1
                        tr = sum(1 for axe in core.AXES
                                 if v["rci"]["rives"][rive]["traversees"][axe])
                        if rive == "rive_a":
                            traversee_a += tr
                        else:
                            traversee_b += tr
                h = v.get("heritages") or {}
                boucles += int(bool(h.get("boucle_probable")))
                styles_servis += int(bool(h.get("styles_dissemblables")))
        resume[gname] = {"n": n, "conformes": conf, "pas_servis": pas_servis,
                         "statuts": statuts, "paliers": paliers,
                         "ensembles": ensembles, "traversees_a": traversee_a,
                         "traversees_b": traversee_b, "boucles": boucles,
                         "styles": styles_servis}
    return resume
