# -*- coding: utf-8 -*-
"""WAIRYU — WTC-PERS-Q3 : simulateur Quête 3 Personnalité
« La lumière sous ma carte » — RIO-21.

Univers : 560 couples, 14 groupes × 40 (SPEC §6 verrouillée), seed 42 ×2.
PREMIÈRE quête à deux ancêtres : chaque rive porte un héritage DOUBLE —
héritage Q1 (patron des sorties contresignées RIO-19, SHA 3b1a7490…) et
héritage Q2 (patron des sorties contresignées RIO-20, SHA 6d9b3c59…),
générés par le même modèle D-TABLE (lois d'items identiques aux calibrations
exactes des moteurs Q1/Q2 — jamais inventés à la main) :
  cochés Q2        : Bernoulli(p) iid — 0/1
  fréquences Q2    : clip(round(N(mu, 0,60)), 0, 3)
  items Q1 (1-4)   : clip(round(N(mu, 0,60)), 1, 4) — 3 items par face
ZÉRO item nouveau pour Q3 (A2-a) : le moteur ne lit QUE les patrons hérités.

Entrées fixées (pattern Q1 « à items fixés ») : G08 (signaux du filet),
G10 (items Q2 de l'ombre supprimée + sous-géométries carte), G11 (frontières
L3), G12 (nuage), G13 (pièges RQS), G14 (re-test L7). Sous-géométries par
index pour G04 (limite 2), G05 (4 règles d'empreinte), G06 (3 inférences +
témoin), G10 (a/b), G11 (3 seuils), G13 (PRUDENCE/INVALIDE), G14 (4 cibles).

Vérité ancrée sur les paramètres vrais CLIP-AWARE (E[item] par énumération
exacte des lois — leçon Q2 : un mu 4,0 sur échelle 1-4 sature au plafond) ;
la conformité porte sur les DÉCISIONS du moteur (état, mode, forces
soutenues + conservateurs, calmes, main ouverte J, hiérarchie/nuage,
empreintes, inférences, statut RQS, verdicts RCI) — pattern Q1/Q2.
Le palier hérité n'est PAS comparé au vrai paramétrique : sa règle Q3 est
l'IDENTITÉ (affiché sans recalcul — leçon Q5-A3), vérifiée en C1 croisement.

Calibration D-STD-2 : p̂ par Monte-Carlo déterministe (graine 4200, 40 000
couples/groupe, mêmes lois que l'univers — la surface de décision Q3
(moyennes de moyennes, ensembles de règles) n'est pas fermée : la borne
Monte-Carlo (±0,002) est négligeable devant l'écart binomial 2,5σ (n=40) ;
leçon SM-Q5 ad01f21 : bornes DISTINCTES pour les groupes stochastiques ;
les groupes DÉTERMINISTES (entrées fixées, p̂ = 1,0) portent le seuil 100,0
et sont identifiés comme tels — aucun masquage possible)."""
import copy
import hashlib
import math
import random

import wtc_pers_q3_core as core

SEED = 42
SEED_CALIB = 4200
N_MC = 40_000
SIGMA_ITEM = 0.60


def _graine(*parts):
    """Graine entière bien mélangée (sha256) — streams décorrélatés."""
    h = hashlib.sha256("/".join(str(x) for x in parts).encode()).digest()
    return int.from_bytes(h[:8], "big")


# ═══════════════════ Lois d'items (identiques aux moteurs Q1/Q2) ══════════════
def _item_freq(mu, rng):
    return max(0, min(3, round(rng.gauss(mu, SIGMA_ITEM))))


def _item_her(mu, rng):
    return max(1, min(4, round(rng.gauss(mu, SIGMA_ITEM))))


def _item_coche(p, rng):
    return 1 if rng.random() < p else 0


def _e_freq(mu):
    """E[item] CLIP-AWARE (0-3) — énumération exacte (leçon Q2)."""
    p0 = _phi((0.5 - mu) / SIGMA_ITEM)
    p3 = 1.0 - _phi((2.5 - mu) / SIGMA_ITEM)
    p1 = _phi((1.5 - mu) / SIGMA_ITEM) - p0
    p2 = 1.0 - p0 - p1 - p3
    return p1 + 2.0 * p2 + 3.0 * p3


def _e_her(mu):
    """E[item] CLIP-AWARE (1-4) — énumération exacte."""
    p1 = _phi((1.5 - mu) / SIGMA_ITEM)
    p4 = 1.0 - _phi((3.5 - mu) / SIGMA_ITEM)
    p2 = _phi((2.5 - mu) / SIGMA_ITEM) - p1
    p3 = 1.0 - p1 - p2 - p4
    return p1 + 2.0 * p2 + 3.0 * p3 + 4.0 * p4


def _phi(x):
    return 0.5 * (1.0 + math.erf(x / math.sqrt(2.0)))


# ═══════════════════ Patron héritage Q1 (sorties contresignées RIO-19) ═══════
def _cons_bas(score, se):
    return core.niveau_ponctuel(round(score - se, 4))


def _gen_heritage_q1(her_mu, rng, rqs=95.0, signal_fixe=None, items_fixes=None,
                     esperance=False):
    """Patron héritage Q1 : faces (3 items, score = somme/3), axes (moyenne
    de 6 items), lectures conservatrices (SE du modèle Q1 : 0,60/√n),
    signal sécurité (somme face J2 ≥ 11 — borne patron Q1), RQS hérité.
    Mode espérance (vrai paramétrique) : chaque item vaut E[item | μ]
    (CLIP-AWARE, énumération exacte) — mêmes formules, zéro dérive."""
    items, faces = {}, {}
    for f in ("AO1", "AO2", "N1", "N2", "R1", "R2", "J1", "J2"):
        if items_fixes:
            vals = items_fixes[f][:]
        elif esperance:
            vals = [_e_her(her_mu[f])] * 3
        else:
            vals = [_item_her(her_mu[f], rng) for _ in range(3)]
        items[f] = vals
        s = sum(vals)
        score = round(s / 3.0, 4)
        faces[f] = {"score": score, "cons": _cons_bas(score, core.SE_Q1_FACE),
                    "somme": s}
    axes = {}
    for axe in ("AO", "N", "R", "J"):
        s = round((faces[axe + "1"]["score"] + faces[axe + "2"]["score"]) / 2.0, 4)
        axes[axe] = {"score": s, "cons": _cons_bas(s, core.CI_Q1_AXIS)}
    if signal_fixe is not None:
        signal = signal_fixe
    elif esperance:
        signal = faces["J2"]["somme"] >= 11
    else:
        signal = faces["J2"]["somme"] >= 11
    return {"rqs": rqs, "signal": signal, "axes": axes, "faces": faces}


# ═══════════════════ Patron héritage Q2 (sorties contresignées RIO-20) ═══════
def _gen_heritage_q2(g, idx, rng, her_q1, items_fixes_q2=None, rqs=95.0,
                     etat="OMBRE", esperance=False):
    """Patron héritage Q2 : blocs A/N/R/J (mêmes transpositions que le moteur
    RIO-20), 8 faces L4, gestes, convergence CV1-CV4 répliquée, nommage,
    palier — le patron que Q3 consomme réellement. Mode espérance : items =
    E[item | μ] (CLIP-AWARE) — mêmes formules, zéro dérive."""
    if items_fixes_q2:
        a = items_fixes_q2["A"][:]
        n_raw = items_fixes_q2["N"][:]
        r_raw = items_fixes_q2["R"][:]
        j = items_fixes_q2["J"][:]
    elif esperance:
        p_part = g.get("pA_part", g["pA"])
        a = [g["pA"]] * 3 + [p_part] * 3
        n_raw = [_e_freq(g["muN"][k]) for k in range(4)]
        r_raw = [_e_freq(g["muR"][k]) for k in range(4)] + \
            [_e_freq(g["muG"][k]) for k in range(2)]
        j = [g["pJ"]] * 6
    else:
        p_part = g.get("pA_part", g["pA"])
        a = [_item_coche(g["pA"], rng) for _ in range(3)] + \
            [_item_coche(p_part, rng) for _ in range(3)]
        n_raw = [_item_freq(g["muN"][k], rng) for k in range(4)]
        r_raw = [_item_freq(g["muR"][k], rng) for k in range(4)] + \
            [_item_freq(g["muG"][k], rng) for k in range(2)]
        j = [_item_coche(g["pJ"], rng) for _ in range(6)]
    corr_n4 = 3.0 - n_raw[3]
    sA, sJ = sum(a), sum(j)
    mec = {
        "A": round(1.0 + 3.0 * sA / 6.0, 4),
        "N": round(1.0 + (n_raw[0] + n_raw[1] + n_raw[2] + corr_n4) / 4.0, 4),
        "R": round(1.0 + sum(r_raw[:4]) / 4.0, 4),
        "J": round(1.0 + 3.0 * sJ / 6.0, 4),
    }
    faces = {
        "A_ext": round(1.0 + 3.0 * sum(a[:3]) / 3.0, 4),
        "A_part": round(1.0 + 3.0 * sum(a[3:]) / 3.0, 4),
        "N_orage": round(1.0 + (n_raw[0] + n_raw[1] + n_raw[2]) / 3.0, 4),
        "N_retour": round(1.0 + corr_n4, 4),
        "R_mur": mec["R"],
        "R_geste": round(1.0 + sum(r_raw[4:]) / 2.0, 4),
        "J_chaine": round(1.0 + 3.0 * sum(j[:3]) / 3.0, 4),
        "J_verif": round(1.0 + 3.0 * sum(j[3:]) / 3.0, 4),
    }
    se_faces = {"A_ext": core.SE_Q2_FACE["A_part"],
                "A_part": core.SE_Q2_FACE["A_part"],
                "N_orage": core.SE_Q2_FACE["A_part"],
                "N_retour": core.SE_Q2_FACE["N_retour"],
                "R_mur": round(core.SEM / 2.0, 4),
                "R_geste": core.SE_Q2_FACE["R_geste"],
                "J_chaine": core.SE_Q2_FACE["A_part"],
                "J_verif": core.SE_Q2_FACE["A_part"]}
    faces_c = {k: {"score": v, "cons": _cons_bas(v, se_faces[k])}
               for k, v in faces.items()}
    mecanismes = {b: {"score": mec[b], "cons": _cons_bas(mec[b], core.CI90_Q2)}
                  for b in "ANRJ"}
    gestes = {"score": faces["R_geste"], "cons": faces_c["R_geste"]["cons"]}
    # convergence CV1-CV4 (répliquée du moteur RIO-20 — même code de règles)
    niv = {k: her_q1["axes"][k]["cons"] for k in ("AO", "N", "R", "J")}
    cvs = []
    if niv["AO"] in ("VIVE", "FORTE"):
        cvs.append(("CV1", sA >= 2))
    if niv["N"] in ("VIVE", "FORTE"):
        cvs.append(("CV2", mec["N"] >= core.SEUILS_NIVEAUX[1]))
    if niv["R"] == "FORTE":
        cvs.append(("CV3", mec["R"] >= core.SEUILS_NIVEAUX[1]))
    if niv["J"] in ("VIVE", "FORTE"):
        cvs.append(("CV4", sJ >= 2))
    if not cvs:
        cv = {"index": None, "etat": "N/A"}
    else:
        sat = sum(1 for _, ok in cvs if ok)
        index = round(sat / len(cvs), 4)
        etat_cv = "SUPPRIMÉE" if sat == 0 else (
            "PRUDENTE" if index <= core.INDEX_PRUDENCE else "OK")
        cv = {"index": index, "etat": etat_cv}
    # nommage + palier (répliqués RIO-20)
    if cv["etat"] == "SUPPRIMÉE":
        label = "OMBRE_SUPPRIMÉE"
    elif cv["etat"] == "PRUDENTE":
        label = "OMBRE_PRUDENTE"
    else:
        vives = [b for b in "ANRJ" if mecanismes[b]["cons"] in ("VIVE", "FORTE")]
        label = ("ZONE_CALME" if not vives else
                 "DOUBLE_PENTE" if len(vives) >= 2 else
                 {"R": "MUR_DE_DÉFENSE", "N": "ORAGE_LENT",
                  "J": "LENTILLE", "A": "PENCHANT_PROPRE"}[vives[0]])
    plus_haut = max((mecanismes[b]["cons"] for b in "ANRJ"),
                    key=core.NIVEAUX.index)
    palier = {core.NIVEAUX[3]: core.PALIER_ROUGE,
              core.NIVEAUX[2]: core.PALIER_ORANGE}.get(plus_haut,
                                                       core.PALIER_VERT)
    return {"rqs": rqs, "etat": etat, "label": label, "palier": palier,
            "mecanismes": mecanismes, "faces_lumiere": faces_c,
            "gestes": gestes, "cv": cv}


def _patron_q2_p_filtre():
    """Patron minimal d'un héritage Q2 déjà en P-FILTRE (état transmis)."""
    return {"rqs": 95.0, "etat": "P-FILTRE", "label": None,
            "palier": core.PALIER_ROUGE, "mecanismes": None,
            "faces_lumiere": None, "gestes": None, "cv": None}


# ═══════════════════ Géométrie des 14 groupes — 40 × 14 = 560 ════════════════
# her : μ des faces Q1 héritées (échelle 1-4) · pA/pJ : probabilité de cocher
# (0-1) · muN : μ des 4 items N (N4 = retour raw) · muR : μ des 4 items mur ·
# muG : μ des 2 items geste (0-3). Sous-géométries par index (voir builder).
GEOMETRIE = {
    "G01_LUMIÈRE_PLEINE": {
        "her": {"AO1": 5.0, "AO2": 5.0, "N1": 5.0, "N2": 5.0, "R1": 1.2,
                "R2": 1.2, "J1": 1.2, "J2": 1.2},
        "pA": 1.00, "pJ": 0.10, "muN": [5.0, 5.0, 5.0, -1.0],
        "muR": [1.3, 1.3, 1.3, 1.3], "muG": [0.2, 0.2], "n": 40},
    "G02_FORCE_SANS_OMBRE": {
        "her": {"AO1": 5.0, "AO2": 0.4, "N1": 1.2, "N2": 1.2, "R1": 1.2,
                "R2": 1.2, "J1": 1.2, "J2": 1.2},
        "pA": 0.08, "pA_part": 0.0, "pJ": 0.10, "muN": [1.3, 1.3, 1.3, 2.8],
        "muR": [1.3, 1.3, 1.3, 1.3], "muG": [0.2, 0.2], "n": 40},
    "G03_OMBRE_SANS_FORCE": {
        "her": {"AO1": 1.2, "AO2": 1.2, "N1": 1.2, "N2": 1.2, "R1": 1.2,
                "R2": 1.2, "J1": 1.2, "J2": 1.2},
        "pA": 0.03, "pJ": 0.10, "muN": [3.4, 3.4, 3.4, 2.8],
        "muR": [3.3, 3.3, 3.3, 3.3], "muG": [0.2, 0.2], "n": 40},
    "G04_DOUBLE_FORCE": {
        "her": {"AO1": 5.0, "AO2": 1.2, "N1": 1.2, "N2": 5.0, "R1": 1.2,
                "R2": 1.2, "J1": 1.2, "J2": 1.2},
        "pA": 1.00, "pJ": 0.10, "muN": [5.0, 5.0, 5.0, -1.0],
        "muR": [1.3, 1.3, 1.3, 1.3], "muG": [0.2, 0.2], "n": 40,
        "sous_geometrie": True},   # idx < 20 : nuage (2 FORTE) · idx ≥ 20 : fixé (hiérarchie)
    "G05_EMPREINTE_CROISÉE": {
        "her": {"AO1": 1.2, "AO2": 1.2, "N1": 1.2, "N2": 1.2, "R1": 1.2,
                "R2": 1.2, "J1": 1.2, "J2": 1.2},
        "pA": 0.03, "pJ": 0.05, "muN": [1.3, 1.3, 1.3, 2.8],
        "muR": [1.3, 1.3, 1.3, 1.3], "muG": [0.2, 0.2], "n": 40,
        "sous_geometrie": True},   # idx % 4 : N / A / R / J (4 règles EMP)
    "G06_INFÉRENCES_TROIS": {
        "her": {"AO1": 1.2, "AO2": 1.2, "N1": 1.2, "N2": 1.2, "R1": 1.2,
                "R2": 1.2, "J1": 1.2, "J2": 1.2},
        "pA": 0.03, "pJ": 0.05, "muN": [1.3, 1.3, 1.3, 2.8],
        "muR": [1.3, 1.3, 1.3, 1.3], "muG": [0.2, 0.2], "n": 40,
        "sous_geometrie": True},   # idx % 4 : INF-1 / INF-2 / INF-3 / témoin
    "G07_ZONE_CALME_LUMIÈRE": {
        "her": {"AO1": 1.2, "AO2": 1.2, "N1": 1.2, "N2": 1.2, "R1": 1.2,
                "R2": 1.2, "J1": 1.2, "J2": 1.2},
        "pA": 0.10, "pJ": 0.10, "muN": [1.3, 1.3, 1.3, 2.8],
        "muR": [1.3, 1.3, 1.3, 1.3], "muG": [0.2, 0.2], "n": 40},
    "G08_SIGNAL_FILET": {
        "her": {"AO1": 2.0, "AO2": 2.0, "N1": 2.0, "N2": 2.0, "R1": 2.0,
                "R2": 2.0, "J1": 2.0, "J2": 2.0},
        "pA": 0.10, "pJ": 0.10, "muN": [1.5, 1.5, 1.5, 1.5],
        "muR": [1.4, 1.4, 1.4, 1.4], "muG": [0.2, 0.2], "n": 40,
        "filet": True},            # idx < 25 : signal Q1 · idx ≥ 25 : Q2 P-FILTRE
    "G09_HÉRITAGE_INVALIDE": {
        "her": {"AO1": 2.0, "AO2": 2.0, "N1": 2.0, "N2": 2.0, "R1": 2.0,
                "R2": 2.0, "J1": 2.0, "J2": 2.0},
        "pA": 0.50, "pJ": 0.50, "muN": [2.0, 2.0, 2.0, 2.0],
        "muR": [2.0, 2.0, 2.0, 2.0], "muG": [1.0, 1.0], "n": 40,
        "rqs_her": 55.0, "heritage_invalide": True},
    "G10_OMBRE_SUPPRIMÉE": {
        "her": {"AO1": 4.0, "AO2": 4.0, "N1": 4.0, "N2": 4.0, "R1": 1.0,
                "R2": 1.0, "J1": 1.0, "J2": 1.0},
        "pA": 0.0, "pJ": 0.0, "muN": [0.0, 0.0, 0.0, 0.0],
        "muR": [1.0, 1.0, 1.0, 1.0], "muG": [0.0, 0.0], "n": 40,
        "items_fixes": True, "sous_geometrie": True},  # idx % 2 : R1 discret / R1 4,0
    "G11_FRONTIÈRE_LUMIÈRE": {
        "her": {"AO1": 1.0, "AO2": 1.0, "N1": 1.0, "N2": 1.0, "R1": 2.0,
                "R2": 1.0, "J1": 1.0, "J2": 1.0},
        "pA": 0.0, "pJ": 0.0, "muN": [0.0, 0.0, 0.0, 3.0],
        "muR": [1.0, 1.0, 1.0, 1.0], "muG": [0.5, 0.5], "n": 40,
        "items_fixes": True, "sous_geometrie": True},  # idx % 3 : 3 frontières L3
    "G12_NUAGE_FORCE": {
        "her": {"AO1": 3.0, "AO2": 1.0, "N1": 1.0, "N2": 3.0, "R1": 1.0,
                "R2": 1.0, "J1": 1.0, "J2": 1.0},
        "pA": 0.0, "pJ": 0.0, "muN": [0.0, 0.0, 0.0, 1.0],
        "muR": [1.0, 1.0, 1.0, 1.0], "muG": [0.0, 0.0], "n": 40,
        "items_fixes": True},
    "G13_PIÉGÉS_RQS": {
        "her": {"AO1": 4.0, "AO2": 1.0, "N1": 1.0, "N2": 4.0, "R1": 1.0,
                "R2": 1.0, "J1": 1.0, "J2": 1.0},
        "pA": 0.0, "pJ": 0.0, "muN": [0.0, 0.0, 0.0, 3.0],
        "muR": [1.0, 1.0, 1.0, 1.0], "muG": [0.0, 0.0], "n": 40,
        "items_fixes": True, "piege": True},  # idx % 2 : RQS 75 (PRUDENCE) / 60 (INVALIDE)
    "G14_RE_TEST_LUMIÈRE": {
        "her": {"AO1": 1.333, "AO2": 1.0, "N1": 1.0, "N2": 1.333, "R1": 1.333,
                "R2": 1.0, "J1": 1.0, "J2": 1.0},
        "pA": 0.0, "pJ": 0.0, "muN": [0.0, 0.0, 0.0, 3.0],
        "muR": [1.0, 1.0, 1.0, 1.0], "muG": [0.0, 0.0], "n": 40,
        "items_fixes": True, "re_test": True},  # idx % 4 : cible du Δ vrai
}

# ═══════════════════ Génération des héritages (fixés / stochastiques) ════════
def _her1_stoch(her_mu, rng, rqs=95.0, signal_fixe=None):
    return _gen_heritage_q1(her_mu, rng, rqs=rqs, signal_fixe=signal_fixe)


def _her1_fixe(sums, rqs=95.0, signal=None):
    """Patron Q1 à faces fixées — sums : dict face → somme d'items (3-12)."""
    faces = {}
    for f, s in sums.items():
        score = round(s / 3.0, 4)
        faces[f] = {"score": score, "cons": _cons_bas(score, core.SE_Q1_FACE),
                    "somme": s}
    axes = {}
    for axe in ("AO", "N", "R", "J"):
        s = round((faces[axe + "1"]["score"] + faces[axe + "2"]["score"]) / 2.0, 4)
        axes[axe] = {"score": s, "cons": _cons_bas(s, core.CI_Q1_AXIS)}
    if signal is None:
        signal = faces["J2"]["somme"] >= 11
    return {"rqs": rqs, "signal": signal, "axes": axes, "faces": faces}


def _her2_stoch(g, rng, her_q1, rqs=95.0, etat="OMBRE"):
    return _gen_heritage_q2(g, 0, rng, her_q1, rqs=rqs, etat=etat)


def _her2_fixe(her_q1, items, rqs=95.0, etat="OMBRE"):
    return _gen_heritage_q2(None, 0, None, her_q1,
                            items_fixes_q2=items, rqs=rqs, etat=etat)


HER_FIXE_G10_Q2 = ({"A": [0] * 6, "N": [0, 0, 0, 0],
                    "R": [1, 1, 1, 1, 0, 0], "J": [0] * 6})
HER_FIXE_G11_Q2 = ({"A": [0] * 6, "N": [0, 0, 0, 3],
                    "R": [1, 1, 1, 1, 1, 1], "J": [0] * 6})   # sub 0/1
HER_FIXE_G11_Q2_B = ({"A": [0] * 6, "N": [0, 0, 0, 3],
                      "R": [1, 1, 1, 1, 2, 2], "J": [1, 1, 1, 1, 1, 0]})  # sub 2
HER_FIXE_G12_Q2 = ({"A": [0, 0, 0, 1, 1, 0], "N": [0, 0, 0, 1],
                    "R": [1, 1, 1, 1, 0, 0], "J": [0] * 6})
HER_FIXE_G13_Q2 = ({"A": [0] * 6, "N": [0, 0, 0, 3],
                    "R": [1, 1, 1, 1, 0, 0], "J": [0] * 6})
HER_FIXE_G14_Q2 = ({"A": [0] * 6, "N": [0, 0, 0, 3],
                    "R": [1, 1, 1, 1, 0, 0], "J": [0] * 6})
HER_FIXE_G04B_Q2 = ({"A": [0, 0, 0, 1, 0, 0], "N": [0, 0, 0, 0],
                     "R": [1, 1, 1, 1, 0, 0], "J": [0] * 6})
HER_FIXE_G04B_HER = {"AO1": 7, "AO2": 3, "N1": 3, "N2": 12, "R1": 3,
                     "R2": 3, "J1": 3, "J2": 3}


def _cible_g14(idx):
    return {0: "A", 1: "N", 2: "R", 3: None}[idx % 4]


def _gen_heritages_rive(gname, g, idx, rng):
    """(her_q1, her_q2, her_q1_rt, her_q2_rt) d'une rive pour le groupe."""
    if gname == "G04_DOUBLE_FORCE" and idx >= 20:
        h1 = _her1_fixe(HER_FIXE_G04B_HER)
        return h1, _her2_fixe(h1, HER_FIXE_G04B_Q2), None, None
    if gname == "G05_EMPREINTE_CROISÉE":
        sub = idx % 4
        her = dict(g["her"])
        ombre = {"pA": g["pA"], "pJ": g["pJ"], "muN": list(g["muN"]),
                 "muR": list(g["muR"]), "muG": list(g["muG"])}
        if sub == 0:                      # EMP-N (+ INF-1 : co-déclenchement
            her["N1"] = 5.0               # structurel — documenté au rapport)
            ombre["muN"] = [5.0, 5.0, 5.0, 2.8]
        elif sub == 1:                    # EMP-A — pA splitté : ext saturé,
            her["AO2"] = 5.0              # part basse (force A discrète)
            ombre["pA"] = 1.00
            ombre["pA_part"] = 0.08
        elif sub == 2:                    # EMP-R (face carte R2 — R1 reste
            her["R2"] = 5.0               # source discrète de la force R)
            ombre["muR"] = [4.0, 4.0, 4.0, 4.0]
        else:                             # EMP-J (face J1 — J2 reste discret :
            her["J1"] = 5.0               # pas de signal Q1, force J silencieuse)
            ombre["pJ"] = 0.90
        h1 = _her1_stoch(her, rng)
        return h1, _her2_stoch(ombre, rng, h1), None, None
    if gname == "G06_INFÉRENCES_TROIS":
        sub = idx % 4
        her = dict(g["her"])
        ombre = {"pA": 0.03, "pJ": 0.05, "muN": [1.3, 1.3, 1.3, 2.8],
                 "muR": [1.3, 1.3, 1.3, 1.3], "muG": [0.2, 0.2]}
        if sub == 0:                      # INF-1 (+ EMP-N, co-déclenchement)
            her["N1"] = 5.0
            ombre["muN"] = [5.0, 5.0, 5.0, 2.5]
        elif sub == 1:                    # INF-2
            ombre["muG"] = [2.9, 2.9]
        elif sub == 2:                    # INF-3 (+ EMP-R) ; J1 saturé
            her["R1"] = 5.0               # (silence J) ; INF-2 co-fire (axe J
            her["J1"] = 5.0               # tranquille + geste vive) — J2
            ombre["muR"] = [4.0, 4.0, 4.0, 4.0]   # discret → pas de signal
            ombre["muG"] = [2.9, 2.9]
        h1 = _her1_stoch(her, rng)
        return h1, _her2_stoch(ombre, rng, h1), None, None
    if gname == "G08_SIGNAL_FILET":
        if idx < 25:                      # voie héritée — signal Q1 fixé
            h1 = _her1_stoch(g["her"], rng, signal_fixe=True)
            return h1, _her2_stoch(g, rng, h1), None, None
        h1 = _her1_stoch(g["her"], rng, signal_fixe=False)
        return h1, _patron_q2_p_filtre(), None, None
    if gname == "G09_HÉRITAGE_INVALIDE":
        h1 = _her1_stoch(g["her"], rng, rqs=g["rqs_her"], signal_fixe=False)
        return h1, _her2_stoch(g, rng, h1), None, None
    if gname == "G10_OMBRE_SUPPRIMÉE":
        sums = {"AO1": 12, "AO2": 12, "N1": 12, "N2": 12,
                "R1": 3 if idx % 2 == 0 else 12, "R2": 3,
                "J1": 3, "J2": 3}
        h1 = _her1_fixe(sums, signal=False)
        return h1, _her2_fixe(h1, HER_FIXE_G10_Q2), None, None
    if gname == "G11_FRONTIÈRE_LUMIÈRE":
        sub = idx % 3
        sums = {"AO1": 3, "AO2": 3, "N1": 3, "N2": 3, "J1": 3, "J2": 3,
                "R1": (6 if sub == 0 else 10), "R2": 3}
        r_items = [1, 1, 1, 1] + ([0, 1] if sub == 0 else
                                  [1, 1] if sub == 1 else [2, 2])
        h1 = _her1_fixe(sums, signal=False)
        fixe = HER_FIXE_G11_Q2 if sub < 2 else HER_FIXE_G11_Q2_B
        n_items = [0, 0, 0, 3]
        j_items = [0] * 6 if sub < 2 else [1, 1, 1, 1, 1, 0]
        h2 = _her2_fixe(h1, {"A": [0] * 6, "N": n_items, "R": r_items,
                             "J": j_items})
        return h1, h2, None, None
    if gname == "G12_NUAGE_FORCE":
        h1 = _her1_fixe({"AO1": 9, "AO2": 3, "N1": 3, "N2": 9, "R1": 3,
                         "R2": 3, "J1": 3, "J2": 3}, signal=False)
        return h1, _her2_fixe(h1, HER_FIXE_G12_Q2), None, None
    if gname == "G13_PIÉGÉS_RQS":
        # PRUDENCE (min héritages 75, résultat lisible) / INVALIDE
        # (min 60 via Q2 — héritage Q1 valide → AUCUN_RÉSULTAT)
        r1q, r2q = (75.0, 75.0) if idx % 2 == 0 else (95.0, 60.0)
        h1 = _her1_fixe({"AO1": 12, "AO2": 3, "N1": 3, "N2": 12, "R1": 3,
                         "R2": 3, "J1": 3, "J2": 3}, rqs=r1q, signal=False)
        return h1, _her2_fixe(h1, HER_FIXE_G13_Q2, rqs=r2q), None, None
    if gname == "G14_RE_TEST_LUMIÈRE":
        cible = _cible_g14(idx)
        sums = {"AO1": 4, "AO2": 3, "N1": 3, "N2": 4, "R1": 4, "R2": 3,
                "J1": 3, "J2": 3}
        h1 = _her1_fixe(sums, signal=False)
        h2 = _her2_fixe(h1, HER_FIXE_G14_Q2)
        # re-test : sources de la force cible décalées (Q1 somme +4, Q2 +1)
        sums_rt = {k: (v + 4 if k == {"A": "AO1", "N": "N2",
                                      "R": "R1"}.get(cible) else v)
                   for k, v in sums.items()}
        h1_rt = _her1_fixe(sums_rt, signal=False)
        a = list(HER_FIXE_G14_Q2["A"])
        n = list(HER_FIXE_G14_Q2["N"])
        r = list(HER_FIXE_G14_Q2["R"])
        j = list(HER_FIXE_G14_Q2["J"])
        if cible == "A":
            a[3] = 1
        elif cible == "N":
            n[3] = 2
        elif cible == "R":
            r[4] = 1
            r[5] = 1
        h2_rt = _her2_fixe(h1_rt, {"A": a, "N": n, "R": r, "J": j})
        return h1, h2, h1_rt, h2_rt
    # groupes stochastiques standard (G01, G02, G03, G07 + G04 idx < 20)
    h1 = _her1_stoch(g["her"], rng)
    return h1, _her2_stoch(g, rng, h1), None, None


def _gen_heritages_rive_vrai(gname, g, idx):
    """Héritages VRAIS (espérance CLIP-AWARE) d'une rive — mêmes contrôles de
    flux que la génération échantillonnée, zéro dérive de règles."""
    if gname == "G04_DOUBLE_FORCE" and idx >= 20:
        h1 = _her1_fixe(HER_FIXE_G04B_HER)
        return h1, _her2_fixe(h1, HER_FIXE_G04B_Q2), None, None
    if gname == "G05_EMPREINTE_CROISÉE":
        sub = idx % 4
        her = dict(g["her"])
        ombre = {"pA": g["pA"], "pJ": g["pJ"], "muN": list(g["muN"]),
                 "muR": list(g["muR"]), "muG": list(g["muG"])}
        if sub == 0:
            her["N1"] = 5.0
            ombre["muN"] = [5.0, 5.0, 5.0, 2.8]
        elif sub == 1:
            her["AO2"] = 5.0
            ombre["pA"] = 1.00
            ombre["pA_part"] = 0.08
        elif sub == 2:
            her["R2"] = 5.0
            ombre["muR"] = [4.0, 4.0, 4.0, 4.0]
        else:
            her["J1"] = 5.0
            ombre["pJ"] = 0.90
        h1 = _gen_heritage_q1(her, None, esperance=True)
        return h1, _her2_esp(ombre, h1), None, None
    if gname == "G06_INFÉRENCES_TROIS":
        sub = idx % 4
        her = dict(g["her"])
        ombre = {"pA": 0.03, "pJ": 0.05, "muN": [1.3, 1.3, 1.3, 2.8],
                 "muR": [1.3, 1.3, 1.3, 1.3], "muG": [0.2, 0.2]}
        if sub == 0:
            her["N1"] = 5.0
            ombre["muN"] = [5.0, 5.0, 5.0, 2.5]
        elif sub == 1:
            ombre["muG"] = [2.9, 2.9]
        elif sub == 2:
            her["R1"] = 5.0
            her["J1"] = 5.0
            ombre["muR"] = [4.0, 4.0, 4.0, 4.0]
            ombre["muG"] = [2.9, 2.9]
        h1 = _gen_heritage_q1(her, None, esperance=True)
        return h1, _her2_esp(ombre, h1), None, None
    if gname == "G08_SIGNAL_FILET":
        if idx < 25:
            h1 = _gen_heritage_q1(g["her"], None, signal_fixe=True,
                                  esperance=True)
            return h1, _her2_esp(g, h1), None, None
        h1 = _gen_heritage_q1(g["her"], None, signal_fixe=False,
                              esperance=True)
        return h1, _patron_q2_p_filtre(), None, None
    if gname == "G09_HÉRITAGE_INVALIDE":
        h1 = _gen_heritage_q1(g["her"], None, rqs=g["rqs_her"],
                              signal_fixe=False, esperance=True)
        return h1, _her2_esp(g, h1), None, None
    if gname == "G10_OMBRE_SUPPRIMÉE":
        sums = {"AO1": 12, "AO2": 12, "N1": 12, "N2": 12,
                "R1": 3 if idx % 2 == 0 else 12, "R2": 3, "J1": 3, "J2": 3}
        h1 = _her1_fixe(sums, signal=False)
        return h1, _her2_fixe(h1, HER_FIXE_G10_Q2), None, None
    if gname == "G11_FRONTIÈRE_LUMIÈRE":
        sub = idx % 3
        sums = {"AO1": 3, "AO2": 3, "N1": 3, "N2": 3, "J1": 3, "J2": 3,
                "R1": (6 if sub == 0 else 10), "R2": 3}
        r_items = [1, 1, 1, 1] + ([0, 1] if sub == 0 else
                                  [1, 1] if sub == 1 else [2, 2])
        h1 = _her1_fixe(sums, signal=False)
        n_items = [0, 0, 0, 3]
        j_items = [0] * 6 if sub < 2 else [1, 1, 1, 1, 1, 0]
        h2 = _her2_fixe(h1, {"A": [0] * 6, "N": n_items, "R": r_items,
                             "J": j_items})
        return h1, h2, None, None
    if gname == "G12_NUAGE_FORCE":
        h1 = _her1_fixe({"AO1": 9, "AO2": 3, "N1": 3, "N2": 9, "R1": 3,
                         "R2": 3, "J1": 3, "J2": 3}, signal=False)
        return h1, _her2_fixe(h1, HER_FIXE_G12_Q2), None, None
    if gname == "G13_PIÉGÉS_RQS":
        # PRUDENCE (min héritages 75, résultat lisible) / INVALIDE
        # (min 60 via Q2 — héritage Q1 valide → AUCUN_RÉSULTAT)
        r1q, r2q = (75.0, 75.0) if idx % 2 == 0 else (95.0, 60.0)
        h1 = _her1_fixe({"AO1": 12, "AO2": 3, "N1": 3, "N2": 12, "R1": 3,
                         "R2": 3, "J1": 3, "J2": 3}, rqs=r1q, signal=False)
        return h1, _her2_fixe(h1, HER_FIXE_G13_Q2, rqs=r2q), None, None
    if gname == "G14_RE_TEST_LUMIÈRE":
        return _gen_heritages_rive(gname, g, idx, None)   # fixé — identique
    h1 = _gen_heritage_q1(g["her"], None, esperance=True)
    return h1, _her2_esp(g, h1), None, None


def _her2_esp(g, her_q1, rqs=95.0, etat="OMBRE"):
    return _gen_heritage_q2(g, 0, None, her_q1, rqs=rqs, etat=etat,
                            esperance=True)


# ═══════════════════ Vérité (espérance CLIP-AWARE) + conformité ══════════════
_VRAIS = {}


def vrai_rive(gname, idx):
    """Décisions vraies d'une rive : le moteur appliqué aux héritages
    d'ESPÉRANCE (même code de règles que la lecture échantillonnée — zéro
    dérive ; les entrées sont les vraies valeurs paramétriques)."""
    cle = (gname, idx)
    if cle in _VRAIS:
        return _VRAIS[cle]
    g = GEOMETRIE[gname]
    h1, h2, h1_rt, h2_rt = _gen_heritages_rive_vrai(gname, g, idx)
    v = core.deriver_rive(h1, h2, h1_rt, h2_rt)
    _VRAIS[cle] = v
    return v


def conformite_rive(vrai, obs):
    """Vrai vs observé sur les DÉCISIONS (None-safe — leçon Q1 : un crash
    latent ne doit jamais être un crash). Le palier hérité n'est PAS comparé
    au vrai paramétrique : sa règle Q3 est l'identité (C1 croisement)."""
    try:
        if obs is None or vrai is None:
            return False
        if obs.get("etat") != vrai["etat"]:
            return False
        if vrai["etat"] in ("P-FILTRE", "QUÊTE_VERROUILLÉE", "AUCUN_RÉSULTAT"):
            return True          # court-circuits : l'état est la décision
        if obs.get("mode") != vrai.get("mode"):
            return False
        if obs["rqs"]["statut"] != vrai["rqs"]["statut"]:
            return False
        sup_v = frozenset(
            (m, vrai["forces"][m]["conservateur"])
            for m in vrai["principales"] + vrai["mentions"])
        sup_o = frozenset(
            (m, obs["forces"][m]["conservateur"])
            for m in obs["principales"] + obs["mentions"])
        if sup_v != sup_o:
            return False
        if frozenset(vrai["principales"]) != frozenset(obs["principales"]):
            return False
        if frozenset(vrai["calmes"]) != frozenset(obs["calmes"]):
            return False
        if bool(vrai["j_affichee"]) != bool(obs["j_affichee"]):
            return False
        hv, ho = vrai["hierarchie"], obs["hierarchie"]
        if (hv is None) != (ho is None):
            return False
        if hv is not None and (hv["type"], hv["dominante"]) != \
                (ho["type"], ho["dominante"]):
            return False
        ev = frozenset(e["regle"] for e in (vrai["empreinte"] or []))
        eo = frozenset(e["regle"] for e in (obs["empreinte"] or []))
        if ev != eo:
            return False
        iv = frozenset(i["regle"] for i in (vrai["inferences"] or []))
        io = frozenset(i["regle"] for i in (obs["inferences"] or []))
        if iv != io:
            return False
        if (vrai["rci"] is None) != (obs["rci"] is None):
            return False
        if vrai["rci"]:
            for m in "ANRJ":
                if vrai["rci"][m]["verdict"] != obs["rci"][m]["verdict"]:
                    return False
        return True
    except Exception:
        return False


def conformite_couple(c, m):
    """Conformité au niveau COUPLE (les deux rives — pattern Q1)."""
    return (conformite_rive(c["vrai_a"], m["rive_a"]) and
            conformite_rive(c["vrai_b"], m["rive_b"]))


# ═══════════════════ Assemblage des couples ══════════════════════════════════
def _gen_couple(gname, idx, rng):
    g = GEOMETRIE[gname]
    h1a, h2a, h1a_rt, h2a_rt = _gen_heritages_rive(gname, g, idx, rng)
    h1b, h2b, h1b_rt, h2b_rt = _gen_heritages_rive(gname, g, idx, rng)
    couple = {"groupe": gname, "idx": idx, "geometrie": g,
              "heritage_a": h1a, "heritage2_a": h2a,
              "heritage_b": h1b, "heritage2_b": h2b}
    if h1a_rt is not None:
        couple["heritage_a_rt"], couple["heritage2_a_rt"] = h1a_rt, h2a_rt
    if h1b_rt is not None:
        couple["heritage_b_rt"], couple["heritage2_b_rt"] = h1b_rt, h2b_rt
    v = vrai_rive(gname, idx)
    couple["vrai_a"] = v
    couple["vrai_b"] = v
    return couple


_CACHES = {}


def tous_les_couples(run=1):
    """560 couples, seed 42 ×2 (run 1 : seed 42 ; run 2 : seed 42 re-dérivé —
    même graine, seconde exécution pour l'empreinte D-EMPREINTE)."""
    if run in _CACHES:
        return _CACHES[run]
    couples = []
    for gname in GEOMETRIE:
        g = GEOMETRIE[gname]
        for idx in range(g["n"]):
            rng = random.Random(_graine(SEED, gname, idx))
            couples.append(_gen_couple(gname, idx, rng))
    _CACHES[run] = couples
    return couples


def effectifs():
    return {g: GEOMETRIE[g]["n"] for g in GEOMETRIE}


# ═══════════════════ Calibration D-STD-2 (Monte-Carlo déterministe) ══════════
_CALIB = None


def calibration_d_std_2():
    """p̂ PAR groupe (Monte-Carlo déterministe, graine 4200, 20 000 couples,
    mêmes lois que l'univers) → seuil = (p̂ − 2,5 σ̂) × 100, σ̂ binomial n=40.
    Bornes DISTINCTES pour les groupes stochastiques (leçon SM-Q5 ad01f21) ;
    groupes DÉTERMINISTES (p̂ = 1,0 — entrées fixées) : seuil 100,0, signalés
    comme tels. Retourne aussi le tableau des centres (D-GÉOMÉTRIE)."""
    global _CALIB
    if _CALIB is not None:
        return _CALIB
    seuils, detail, centres = {}, {}, {}
    for gname in GEOMETRIE:
        g = GEOMETRIE[gname]
        rng = random.Random(_graine("calib-q3", gname))
        ok = 0
        for i in range(N_MC):
            idx = i % g["n"]
            rng_c = random.Random(_graine("calib-q3", gname, i))
            c = _gen_couple(gname, idx, rng_c)
            m = {"rive_a": core.deriver_rive(
                     c["heritage_a"], c["heritage2_a"],
                     c.get("heritage_a_rt"), c.get("heritage2_a_rt")),
                 "rive_b": core.deriver_rive(
                     c["heritage_b"], c["heritage2_b"],
                     c.get("heritage_b_rt"), c.get("heritage2_b_rt"))}
            ok += 1 if conformite_couple(c, m) else 0
        p = ok / N_MC
        determine = p >= 0.9999
        sigma = (p * (1.0 - p) / g["n"]) ** 0.5
        seuil = 100.0 if determine else round(
            max(0.0, (p - 2.5 * sigma)) * 100.0, 1)
        seuils[gname] = seuil
        # centres D-GÉOMÉTRIE : distance des forces vraies aux seuils L3 (σ_eff)
        v = vrai_rive(gname, 0)
        dists, dans_bande = None, None
        if v["forces"]:
            dd = []
            for m_ in "ANRJ":
                mu = v["forces"][m_]["score"]
                for s in core.SEUILS_NIVEAUX:
                    dd.append(abs(mu - s) / core.SE_FORCE[m_])
            dists = round(min(dd), 2)
            dans_bande = dists < 3.0
        centres[gname] = {"p_hat": round(p, 5), "n_mc": N_MC,
                          "seuil": seuil, "deterministe": determine,
                          "distance_min_seuil_sigma": dists,
                          "dans_bande_3sigma": dans_bande}
    stoch = {k: v for k, v in seuils.items()
             if not centres[k]["deterministe"]}
    distinct = len(set(stoch.values())) == len(stoch)
    _CALIB = {"seuils": seuils, "detail": centres, "centres": centres,
              "bornes_distinctes": distinct,
              "n_stochastiques": len(stoch),
              "n_deterministes": len(seuils) - len(stoch),
              "ok": distinct}
    return _CALIB


