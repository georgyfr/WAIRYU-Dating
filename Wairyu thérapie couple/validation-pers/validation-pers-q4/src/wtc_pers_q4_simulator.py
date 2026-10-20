# -*- coding: utf-8 -*-
"""WAIRYU — WTC-PERS-Q4 : simulateur Quête 4 Personnalité
« Le croisement sous nos cartes » — RIO-22.

Univers : 650 couples, 14 groupes (SPEC §6 verrouillée), seed 42 ×2.
PREMIÈRE quête du croisement à deux : chaque COUPLE porte SIX héritages —
pour chaque rive : héritage Q1 (patron des sorties contresignées RIO-19,
SHA 3b1a7490…), héritage Q2 (patron RIO-20, SHA 6d9b3c59…) et lumière Q3
(patron RIO-21, SHA 7644a957…) — cette dernière produite par le MOTEUR
RIO-21 CONTRESIGNÉ lui-même (wtc_pers_q3_core.deriver_rive) : zéro
ré-implémentation, zéro dérive. Les héritages Q1/Q2 sont générés par les
mêmes fonctions D-TABLE que le simulateur RIO-21 (lois d'items identiques
aux calibrations exactes des moteurs Q1/Q2 — jamais inventés à la main) :
  cochés Q2        : Bernoulli(p) iid — 0/1
  fréquences Q2    : clip(round(N(mu, 0,60)), 0, 3)
  items Q1 (1-4)   : clip(round(N(mu, 0,60)), 1, 4) — 3 items par face

Géométrie des profils d'ombre (D-GÉOMÉTRIE) :
  FAIBLE  (F)     : ombre globale ≈ 1,60 — marge au conservateur ≥ 0,89
                    (≈ 9 σ_eff, bruit items σ 0,60)
  MODÉRÉE (M)     : ombre globale = 3,00 FIXÉE (items fixés) — marge
                    0,50 des deux bornes (échelle plafonnée : la règle
                    0,5 pt s'applique pleinement ici)
  FORTE           : ombre globale = 4,00 saturée (marges de clip) —
                    conservateur 3,79, marge 0,29 ≈ 4 σ_eff ; le plafond
                    4,00 de l'échelle ne permet pas 0,5 pt au-dessus de
                    la borne 3,50 — la contrainte ≥ 3 σ_eff prévaut
                    (déposé, SPEC §6).

Population de référence L6 (percentiles) : seed 42, 20 000 profils mixtes
(basses/moyennes/hauts) — ≥ 2 000 requis (ligne 262, calibrage LIBRE).

Vérité ancrée sur les paramètres vrais CLIP-AWARE (E[item] par énumération
exacte — leçon Q2) ; la conformité porte sur les DÉCISIONS du croisement
(état, configuration, palier, boucle, dissemblance, inférences croisées,
statut RQS, hiérarchie/nuage, verdicts RCI, forces re-affichées) — pattern
Q1/Q2/Q3. Calibration D-STD-2 : p̂ par Monte-Carlo déterministe (graine
4200, 20 000 couples/groupe, mêmes lois que l'univers) ; bornes DISTINCTES
pour les groupes à p̂ < 1 (leçon SM-Q5 ad01f21) ; groupes DÉTERMINISTES
(entrées fixées / saturées, p̂ = 1,0) au seuil 100,0 signalés comme tels."""
import os
import random
import sys

_HERE = os.path.dirname(os.path.abspath(__file__))
_Q3_SRC = os.path.normpath(os.path.join(
    _HERE, "..", "..", "validation-pers-q3", "src"))
for _p in (_Q3_SRC,):
    if _p not in sys.path:
        sys.path.insert(0, _p)

import wtc_pers_q3_core as q3core          # noqa: E402 (moteur RIO-21)
import wtc_pers_q3_simulator as q3sim      # noqa: E402 (lois D-TABLE RIO-19/20)
import wtc_pers_q4_core as core            # noqa: E402 (moteur croisement)

SEED = 42
SEED_CALIB = 4200
N_MC = 20_000
N_REF = 20_000
GRAINE_REF = "ref-l6-q4"


def _graine(*parts):
    """Graine entière bien mélangée (sha256) — streams décorrélatés."""
    import hashlib
    h = hashlib.sha256("/".join(str(x) for x in parts).encode()).digest()
    return int.from_bytes(h[:8], "big")


# ═══════════════════ Profils de rives (D-TABLE — patrons contresignés) ═══════
# FAIBLE saturé : faces Q1 sources μ 6 (items clip 4) / puits μ −3 (items
# clip 1) — réalisations DÉTERMINISTES, espérance CLIP-AWARE identique après
# arrondi (zéro dérive, leçon G01/G02) ; dispersion des faces = 1,5 exacte.
# Ombre globale = 1,1875 exacte ; forces A/R soutenues TRANQUILLE stables.
HER1_F_MU = {"AO1": 8.0, "AO2": -8.0, "N1": -8.0, "N2": 8.0,
             "R1": 8.0, "R2": -8.0, "J1": 8.0, "J2": -8.0}
HER2_F_PARAMS = {"pA": 0.0, "pJ": 0.0, "muN": [-8.0, -8.0, -8.0, -8.0],
                 "muR": [-8.0, -8.0, -8.0, -8.0], "muG": [-8.0, -8.0]}
HER2_F_FIXE = {"A": [0] * 6, "N": [1, 1, 1, 2], "R": [1, 1, 1, 1, 0, 0],
               "J": [0] * 6}
SUMS_F_FIXE = {"AO1": 6, "AO2": 6, "N1": 6, "N2": 6,
               "R1": 6, "R2": 6, "J1": 6, "J2": 6}
# MODÉRÉE fixée : ombre globale = 3,00 exactement (marge 0,50 des bornes).
SUMS_M = {"AO1": 9, "AO2": 3, "N1": 9, "N2": 3, "R1": 9, "R2": 3,
          "J1": 9, "J2": 3}
HER2_M_ITEMS = {"A": [1, 1, 1, 1, 0, 0], "N": [2, 2, 2, 1],
                "R": [2, 2, 2, 2, 0, 0], "J": [1, 1, 1, 1, 0, 0]}
# FORTE saturée : ombre globale = 4,00 exacte (sources μ 6 → clip, N4 μ −3
# → corr 3) ; J2 μ −3 (somme 3 — zéro signal Q1) ; dispersion faces = 1,111.
HER1_FORTE_MU = {"AO1": 8.0, "AO2": 8.0, "N1": 8.0, "N2": 8.0,
                 "R1": 8.0, "R2": 8.0, "J1": 8.0, "J2": -8.0}
HER2_FORTE_PARAMS = {"pA": 1.00, "pJ": 1.00, "muN": [8.0, 8.0, 8.0, -8.0],
                     "muR": [8.0, 8.0, 8.0, 8.0], "muG": [8.0, 8.0]}
HER2_FORTE_FIXE = {"A": [1] * 6, "N": [3, 3, 3, 0],
                   "R": [3, 3, 3, 3, 3, 3], "J": [1] * 6}
SUMS_FORTE = {"AO1": 12, "AO2": 6, "N1": 12, "N2": 6,
              "R1": 12, "R2": 6, "J1": 12, "J2": 6}
# FRONTIÈRES (G13) : ombre globale pile sur les bornes 2,50 / 3,50.
HER2_FRONT_250 = {"A": [1, 1, 1, 0, 0, 0], "N": [2, 2, 1, 2],
                  "R": [2, 2, 1, 1, 0, 0], "J": [1, 1, 1, 0, 0, 0]}
HER2_FRONT_350 = {"A": [1, 1, 1, 1, 1, 0], "N": [3, 2, 2, 0],
                  "R": [3, 3, 2, 2, 0, 0], "J": [1, 1, 1, 1, 1, 0]}
# Re-tests L7 (Δ vrai sur l'ombre globale) : FIABLE ±1,00 · SUGGESTION ±0,50
# · BRUIT 0 — Δ de chaque bloc +0,25 × 4 (A/N/R/J) sauf indication.
HER2_RT_250_FIABLE = {"A": [1, 1, 1, 1, 1, 0], "N": [3, 3, 3, 2],
                      "R": [3, 3, 2, 2, 0, 0], "J": [1, 1, 1, 1, 1, 0]}
HER2_RT_250_SUGG = {"A": [1, 1, 1, 1, 0, 0], "N": [2, 2, 2, 1],
                    "R": [2, 2, 2, 2, 0, 0], "J": [1, 1, 1, 1, 0, 0]}
HER2_RT_350_FIABLE = HER2_FRONT_250          # Δ = −1,00 (3,50 → 2,50)
HER2_RT_350_SUGG = HER2_RT_250_SUGG          # Δ = −0,50 (3,50 → 3,00)
# STYLES (G12) : rive A dispersion 0 (faces toutes à 2,0), rive B 1,5.
SUMS_HOMO = SUMS_F_FIXE
SUMS_HETERO = {"AO1": 12, "AO2": 3, "N1": 12, "N2": 3,
               "R1": 12, "R2": 3, "J1": 12, "J2": 3}
HER2_STYLES = {"A": [0] * 6, "N": [1, 1, 1, 1], "R": [1, 1, 1, 1, 0, 0],
               "J": [0] * 6}
# SUPPRIMÉE (G14) : Q1 axes FORTE (CV1-CV4 déclenchés) + blocs discrets
# (aucune satisfaction) → convergence 0,00 → OMBRE_SUPPRIMÉE.
SUMS_SUPP = {"AO1": 12, "AO2": 12, "N1": 12, "N2": 12,
             "R1": 12, "R2": 12, "J1": 12, "J2": 12}
HER2_SUPP = {"A": [0] * 6, "N": [0, 0, 0, 0], "R": [0, 0, 0, 0, 0, 0],
             "J": [0] * 6}


# ═══════════════════ Génération d'une rive ══════════════════════════════════
def _gen_rive(spec, idx, rng, esperance=False):
    """(h1, h2) d'une rive selon le profil du groupe. esperance=True :
    items = E[item | μ] (CLIP-AWARE) — vérité, mêmes formules, zéro dérive.
    Retour : (h1, h2, h2_rt|None) — le re-test porte sur l'ombre (Q2) :
    l'ombre globale est le construit Q2, son re-test est une re-passe Q2."""
    t = spec["type"]
    fixe = spec.get("fixe", False)
    if t == "F":
        if fixe:
            h1 = q3sim._her1_fixe(SUMS_F_FIXE, signal=False)
            h2 = q3sim._her2_fixe(h1, HER2_F_FIXE)
        elif esperance:
            h1 = q3sim._gen_heritage_q1(HER1_F_MU, None,
                                        signal_fixe=spec.get("signal"),
                                        rqs=spec.get("rqs", 95.0),
                                        esperance=True)
            h2 = q3sim._her2_esp(HER2_F_PARAMS, h1)
        else:
            h1 = q3sim._her1_stoch(HER1_F_MU, rng,
                                   signal_fixe=spec.get("signal"),
                                   rqs=spec.get("rqs", 95.0))
            h2 = q3sim._her2_stoch(HER2_F_PARAMS, rng, h1)
    elif t == "M":
        h1 = q3sim._her1_fixe(SUMS_M, signal=False)
        h2 = q3sim._her2_fixe(h1, HER2_M_ITEMS)
    elif t == "FORTE":
        if fixe:
            h1 = q3sim._her1_fixe(SUMS_FORTE, signal=False)
            h2 = q3sim._her2_fixe(h1, HER2_FORTE_FIXE)
        elif esperance:
            h1 = q3sim._gen_heritage_q1(HER1_FORTE_MU, None,
                                        signal_fixe=False, esperance=True)
            h2 = q3sim._her2_esp(HER2_FORTE_PARAMS, h1)
        else:
            h1 = q3sim._her1_stoch(HER1_FORTE_MU, rng, signal_fixe=False)
            h2 = q3sim._her2_stoch(HER2_FORTE_PARAMS, rng, h1)
    elif t == "FRONT":
        base = HER2_FRONT_250 if idx % 2 == 0 else HER2_FRONT_350
        h1 = q3sim._her1_fixe(SUMS_M, signal=False)
        h2 = q3sim._her2_fixe(h1, base)
    elif t == "STYLES":
        sums = SUMS_HOMO if idx % 2 == 0 else SUMS_HETERO
        h1 = q3sim._her1_fixe(sums, signal=False)
        h2 = q3sim._her2_fixe(h1, HER2_STYLES)
    elif t == "SUPPRIMEE":
        h1 = q3sim._her1_fixe(SUMS_SUPP, signal=False)
        h2 = q3sim._her2_fixe(h1, HER2_SUPP)
    elif t == "FILET":
        # idx < 20 : signal Q1 fixé · 20-29 : Q2 P-FILTRE (patron transmis)
        # · ≥ 30 : RQS Q1 = 60 (héritage invalide)
        if idx < 20:
            if esperance:
                h1 = q3sim._gen_heritage_q1(HER1_F_MU, None,
                                            signal_fixe=True, esperance=True)
                h2 = q3sim._her2_esp(HER2_F_PARAMS, h1)
            else:
                h1 = q3sim._her1_stoch(HER1_F_MU, rng, signal_fixe=True)
                h2 = q3sim._her2_stoch(HER2_F_PARAMS, rng, h1)
        elif idx < 30:
            h1 = (q3sim._gen_heritage_q1(HER1_F_MU, None, signal_fixe=False,
                                         esperance=True) if esperance
                  else q3sim._her1_stoch(HER1_F_MU, rng, signal_fixe=False))
            h2 = q3sim._patron_q2_p_filtre()
        else:
            if esperance:
                h1 = q3sim._gen_heritage_q1(HER1_F_MU, None,
                                            signal_fixe=False, rqs=60.0,
                                            esperance=True)
                h2 = q3sim._her2_esp(HER2_F_PARAMS, h1)
            else:
                h1 = q3sim._her1_stoch(HER1_F_MU, rng, signal_fixe=False,
                                       rqs=60.0)
                h2 = q3sim._her2_stoch(HER2_F_PARAMS, rng, h1)
    else:
        raise ValueError(f"profil inconnu : {t}")
    # re-test ombre (G13 — Δ vrai injecté)
    h2_rt = None
    if t == "FRONT" and idx >= 20:
        base = HER2_FRONT_250 if idx % 2 == 0 else HER2_FRONT_350
        sub = idx % 4
        if sub == 0:
            h2_rt = HER2_RT_250_FIABLE
        elif sub == 1:
            h2_rt = HER2_RT_350_FIABLE
        elif sub == 2:
            h2_rt = HER2_RT_250_SUGG
        else:
            h2_rt = base                     # BRUIT (Δ = 0)
    return h1, h2, h2_rt


# ═══════════════════ Géométrie des 14 groupes — 450 + 200 = 650 ══════════════
GEOMETRIE = {
    "G01_REPOS_FAIBLE_FAIBLE":   {"a": {"type": "F"}, "b": {"type": "F"},
                                  "n": 50},
    "G02_OMBRE_D_UN_COTE":       {"a": {"type": "F"}, "b": {"type": "M"},
                                  "n": 50},
    "G03_OMBRE_SOLO":            {"a": {"type": "F"}, "b": {"type": "FORTE"},
                                  "n": 50},
    "G04_ECHO_DE_L_AUTRE_COTE":  {"a": {"type": "M"}, "b": {"type": "F"},
                                  "n": 50},
    "G05_EVEIL_MODERE_MODERE":   {"a": {"type": "M"}, "b": {"type": "M"},
                                  "n": 50},
    "G06_ECART_DECLARE":         {"a": {"type": "M"},
                                  "b": {"type": "FORTE"}, "n": 50},
    "G07_SOLO_AUTRE_COTE":       {"a": {"type": "FORTE"}, "b": {"type": "F"},
                                  "n": 50},
    "G08_ECART_DECLARE_INVERSE": {"a": {"type": "FORTE"}, "b": {"type": "M"},
                                  "n": 50},
    "G09_VIVES_FORTE_FORTE":     {"a": {"type": "FORTE"},
                                  "b": {"type": "FORTE"}, "n": 50},
    "G10_SIGNAL_FILET":          {"a": {"type": "FILET"}, "b": {"type": "F"},
                                  "n": 40},
    "G11_ECART_PERCENTILES":     {"a": {"type": "FORTE", "fixe": True},
                                  "b": {"type": "F", "fixe": True}, "n": 40},
    "G12_STYLES_DISSEMBLABLES":  {"a": {"type": "F", "fixe": True},
                                  "b": {"type": "STYLES"}, "n": 40},
    "G13_FRONTIERES_BORNES":     {"a": {"type": "FRONT"},
                                  "b": {"type": "F", "fixe": True}, "n": 40},
    "G14_OMBRE_SUPPRIMEE_RIVE":  {"a": {"type": "F", "fixe": True},
                                  "b": {"type": "SUPPRIMEE"}, "n": 40},
}


def effectifs():
    return {g: GEOMETRIE[g]["n"] for g in GEOMETRIE}


# ═══════════════════ Population de référence L6 (percentiles) ════════════════
_REF_H1 = None
_REF = None


def _ref_h1():
    global _REF_H1
    if _REF_H1 is None:
        _REF_H1 = q3sim._her1_fixe({"AO1": 3, "AO2": 3, "N1": 3, "N2": 3,
                                    "R1": 3, "R2": 3, "J1": 3, "J2": 3},
                                   signal=False)
    return _REF_H1


def population_reference(n=N_REF, seed=SEED):
    """20 000 profils mixtes (basses 45 % / moyennes 40 % / hautes 15 %) —
    mêmes lois d'items que l'univers ; ombres globales triées (L6, ligne
    262 : correction du style par PERCENTILES — ≥ 2 000 requis)."""
    global _REF
    if _REF is not None and n == N_REF:
        return _REF
    rng = random.Random(_graine(GRAINE_REF, seed))
    ombres = []
    h1 = _ref_h1()
    for _ in range(n):
        u = rng.random()
        if u < 0.45:
            g = {"pA": rng.uniform(0.0, 0.25), "pJ": rng.uniform(0.0, 0.25),
                 "muN": [rng.uniform(0.0, 1.8) for _ in range(3)] +
                        [rng.uniform(0.5, 3.0)],
                 "muR": [rng.uniform(0.0, 1.8) for _ in range(4)],
                 "muG": [rng.uniform(0.0, 1.0), rng.uniform(0.0, 1.0)]}
        elif u < 0.85:
            g = {"pA": rng.uniform(0.25, 0.85), "pJ": rng.uniform(0.25, 0.85),
                 "muN": [rng.uniform(1.5, 3.0) for _ in range(3)] +
                        [rng.uniform(1.0, 2.5)],
                 "muR": [rng.uniform(1.5, 3.0) for _ in range(4)],
                 "muG": [rng.uniform(0.5, 2.5), rng.uniform(0.5, 2.5)]}
        else:
            g = {"pA": rng.uniform(0.85, 1.0), "pJ": rng.uniform(0.85, 1.0),
                 "muN": [rng.uniform(3.0, 5.0) for _ in range(3)] +
                        [rng.uniform(0.0, 1.0)],
                 "muR": [rng.uniform(3.0, 5.0) for _ in range(4)],
                 "muG": [rng.uniform(1.5, 3.0), rng.uniform(1.5, 3.0)]}
        h2 = q3sim._gen_heritage_q2(g, 0, rng, h1)
        mec = h2["mecanismes"]
        ombres.append(round(sum(mec[b]["score"] for b in "ANRJ") / 4.0, 4))
    ombres.sort()
    if n == N_REF:
        _REF = ombres
    return ombres


# ═══════════════════ Vérité (espérance CLIP-AWARE) + conformité ══════════════
_VRAIS = {}


def _gen_couple(gname, idx, rng, esperance=False):
    g = GEOMETRIE[gname]
    h1a, h2a, h2a_rt = _gen_rive(g["a"], idx, rng, esperance=esperance)
    h1b, h2b, h2b_rt = _gen_rive(g["b"], idx, rng, esperance=esperance)
    couple = {"groupe": gname, "idx": idx,
              "heritage_a": h1a, "heritage2_a": h2a,
              "heritage_b": h1b, "heritage2_b": h2b}
    if h2a_rt is not None:
        couple["heritage2_a_rt"] = h2a_rt
    if h2b_rt is not None:
        couple["heritage2_b_rt"] = h2b_rt
    return couple


def _avec_lumieres(couple):
    """Ajoute les lumières Q3 produites par le MOTEUR RIO-21 contresigné."""
    c = dict(couple)
    c["lumiere_a"] = q3core.deriver_rive(c["heritage_a"], c["heritage2_a"])
    c["lumiere_b"] = q3core.deriver_rive(c["heritage_b"], c["heritage2_b"])
    return c


def vrai_couple(gname, idx):
    """Décisions vraies du croisement : le moteur appliqué aux héritages
    d'ESPÉRANCE (mêmes moteurs que la lecture échantillonnée — zéro dérive)."""
    cle = (gname, idx)
    if cle in _VRAIS:
        return _VRAIS[cle]
    c = _gen_couple(gname, idx, None, esperance=True)
    v = core.croiser_couple(_avec_lumieres(c), population_reference())
    _VRAIS[cle] = v
    return v


def conformite_couple(c, m):
    """Vrai vs observé sur les DÉCISIONS du croisement (None-safe — leçon
    Q1 : un crash latent ne doit jamais être un crash)."""
    try:
        v = c["vrai"]
        o = m
        if o.get("etat") != v["etat"]:
            return False
        if v["etat"] in ("P-FILTRE", "QUÊTE_VERROUILLÉE"):
            tv, to = v.get("config_tracee"), o.get("config_tracee")
            if (tv is None) != (to is None):
                return False
            if tv is not None and tv["index"] != to["index"]:
                return False
            return True
        if v["etat"] == core.ETAT_CARTE_SEULE_CROISE:
            for cote in ("a", "b"):
                fv = frozenset((f["mec"], f["conservateur"])
                               for f in (v[f"forces_{cote}"] or []))
                fo = frozenset((f["mec"], f["conservateur"])
                               for f in (o[f"forces_{cote}"] or []))
                if fv != fo:
                    return False
            return True
        # CROISEMENT régulier
        if o.get("mode") != v.get("mode"):
            return False
        if o["rqs"]["statut"] != v["rqs"]["statut"]:
            return False
        if (o["config"]["index"], o["config"]["nom"]) != \
                (v["config"]["index"], v["config"]["nom"]):
            return False
        if o["palier"] != v["palier"]:
            return False
        if bool(v["frontiere"]) != bool(o["frontiere"]):
            return False
        if v["frontiere"] and o["frontiere"] and \
                (v["frontiere"]["rive"], v["frontiere"]["bas"]) != \
                (o["frontiere"]["rive"], o["frontiere"]["bas"]):
            return False
        if o["percentiles"]["boucle"] != v["percentiles"]["boucle"]:
            return False
        if o["styles"]["dissemblables"] != v["styles"]["dissemblables"]:
            return False
        iv = frozenset(i["regle"] for i in (v["inferences"] or []))
        io = frozenset(i["regle"] for i in (o["inferences"] or []))
        if iv != io:
            return False
        hv, ho = v["hierarchie"], o["hierarchie"]
        if (hv["type"], hv["cote"]) != (ho["type"], ho["cote"]):
            return False
        for cote in ("a", "b"):
            fv = frozenset((f["mec"], f["conservateur"])
                           for f in (v[f"forces_{cote}"] or []))
            fo = frozenset((f["mec"], f["conservateur"])
                           for f in (o[f"forces_{cote}"] or []))
            if fv != fo:
                return False
        if (v["rci"] is None) != (o["rci"] is None):
            return False
        if v["rci"]:
            for cote in ("a", "b"):
                rv, ro = v["rci"].get(cote), o["rci"].get(cote)
                if (rv is None) != (ro is None):
                    return False
                if rv is not None and rv["verdict"] != ro["verdict"]:
                    return False
        return True
    except Exception:
        return False


# ═══════════════════ Assemblage des couples ═════════════════════════════════
_CACHES = {}


def tous_les_couples(run=1):
    """650 couples, seed 42 ×2 (run 1 : seed 42 ; run 2 : même graine,
    seconde exécution pour l'empreinte D-EMPREINTE)."""
    if run in _CACHES:
        return _CACHES[run]
    ref = population_reference()
    couples = []
    for gname in GEOMETRIE:
        g = GEOMETRIE[gname]
        for idx in range(g["n"]):
            rng = random.Random(_graine(SEED, gname, idx))
            c = _avec_lumieres(_gen_couple(gname, idx, rng))
            c["vrai"] = vrai_couple(gname, idx)
            c["ref"] = ref
            couples.append(c)
    _CACHES[run] = couples
    return couples


# ═══════════════════ Calibration D-STD-2 (Monte-Carlo déterministe) ═════════
_CALIB = None


def calibration_d_std_2():
    """p̂ PAR groupe (Monte-Carlo déterministe, graine 4200, 20 000 couples,
    mêmes lois que l'univers) → seuil = (p̂ − 2,5 σ̂) × 100, σ̂ binomial n_g.
    Bornes DISTINCTES pour les groupes à p̂ < 1 (leçon SM-Q5 ad01f21) ;
    groupes DÉTERMINISTES (p̂ = 1,0 — entrées fixées / saturées) : seuil
    100,0, signalés comme tels. Retourne aussi le tableau des centres
    (D-GÉOMÉTRIE : distance des ombres vraies aux bornes de croisement,
    en σ_eff = écart-type simulé de l'ombre globale du groupe)."""
    global _CALIB
    if _CALIB is not None:
        return _CALIB
    seuils, centres = {}, {}
    for gname in GEOMETRIE:
        g = GEOMETRIE[gname]
        ok = 0
        ombres = []
        for i in range(N_MC):
            idx = i % g["n"]
            rng_c = random.Random(_graine("calib-q4", gname, i))
            c = _avec_lumieres(_gen_couple(gname, idx, rng_c))
            v = vrai_couple(gname, idx)
            m = core.croiser_couple(c, population_reference())
            ok += 1 if conformite_couple({"vrai": v}, m) else 0
            if m.get("config"):
                ombres.extend([m["config"]["ombre_a"],
                               m["config"]["ombre_b"]])
        p = ok / N_MC
        determine = p >= 0.9999
        sigma = (p * (1.0 - p) / g["n"]) ** 0.5
        seuil = 100.0 if determine else round(
            max(0.0, (p - 2.5 * sigma)) * 100.0, 1)
        seuils[gname] = seuil
        # centres D-GÉOMÉTRIE : distance des ombres vraies aux bornes 2,50 /
        # 3,50, en multiples de σ_eff (écart-type empirique du groupe MC)
        v0 = vrai_couple(gname, 0)
        dists, dans_bande = None, None
        if v0.get("config"):
            mu_a, mu_b = v0["config"]["ombre_a"], v0["config"]["ombre_b"]
            n_omb = len(ombres)
            mu_emp = sum(ombres) / n_omb
            sigma_eff = (sum((x - mu_emp) ** 2 for x in ombres) / n_omb) ** 0.5
            if sigma_eff > 0:
                dd = []
                for mu in (mu_a, mu_b):
                    for b in core.BORNES_CROISEMENT:
                        dd.append(abs(mu - b) / sigma_eff)
                dists = round(min(dd), 2)
                dans_bande = dists < 3.0
            else:
                dists = None
                dans_bande = False
        centres[gname] = {"p_hat": round(p, 5), "n_mc": N_MC,
                          "seuil": seuil, "deterministe": determine,
                          "distance_min_borne_sigma_eff": dists,
                          "dans_bande_3sigma": dans_bande}
    stoch = {k: v for k, v in seuils.items()
             if not centres[k]["deterministe"]}
    distinct = len(set(stoch.values())) == len(stoch)
    _CALIB = {"seuils": seuils, "centres": centres,
              "bornes_distinctes": distinct,
              "n_stochastiques": len(stoch),
              "n_deterministes": len(seuils) - len(stoch),
              "ok": distinct}
    return _CALIB


# ═══════════════════ Anti-inversion des rives (C2) ══════════════════════════
MIROIR = {1: 1, 2: 4, 3: 7, 4: 2, 5: 5, 6: 8, 7: 3, 8: 6, 9: 9}


def anti_inversion(couple, ref):
    """Chaque niveau vient de sa propre rive : en échangeant les deux rives,
    la configuration doit passer à la cellule miroir (pattern EXT-Q2-C2)."""
    m = core.croiser_couple(couple, ref)
    if m.get("etat") != core.ETAT_CROISEMENT:
        return True, None          # hors matrice : l'anti-inversion ne s'applique pas
    echange = {"heritage_a": couple["heritage_b"],
               "heritage2_a": couple["heritage2_b"],
               "lumiere_a": couple["lumiere_b"],
               "heritage_b": couple["heritage_a"],
               "heritage2_b": couple["heritage2_a"],
               "lumiere_b": couple["lumiere_a"]}
    if couple.get("heritage2_a_rt") or couple.get("heritage2_b_rt"):
        echange["heritage2_a_rt"] = couple.get("heritage2_b_rt")
        echange["heritage2_b_rt"] = couple.get("heritage2_a_rt")
    mi = core.croiser_couple(echange, ref)
    attendu = MIROIR[m["config"]["index"]]
    return mi["config"]["index"] == attendu, (m["config"]["index"], attendu)


if __name__ == "__main__":
    cs = tous_les_couples(run=1)
    print("couples :", len(cs))
    cal = calibration_d_std_2()
    print("seuils :", cal["seuils"])
    print("bornes distinctes :", cal["bornes_distinctes"],
          "| stochastiques :", cal["n_stochastiques"],
          "| déterministes :", cal["n_deterministes"])
