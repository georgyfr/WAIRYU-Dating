# -*- coding: utf-8 -*-
"""WAIRYU — WTC-SM-Q1-R2-02 : simulateur Santé mentale Q1.
R2 : D-GÉOMÉTRIE. SM-C1 = 4 items agrégés (σ_eff=0.30).
G4_crise μ=4.9 (≥ 4.90). Non-crise μ ≤ 2.0 (≤ 3.10).
SURCHARGE_AIDANT SM-C1 = 1 (pas 4). crise_vraie sur μ vrai."""
import numpy as np
rng = np.random.default_rng(42)

FACES = ["SM-D1","SM-D2","SM-D3","SM-A1","SM-A2","SM-A3","SM-C1","SM-C2","SM-C3"]
CLASSIFICATIONS = ["STABLE", "CHARGE", "MASQUE", "CRISE", "MIXTE"]
LABELS_SIMULATEUR = set(CLASSIFICATIONS) | {"CRISIS_MODE"}
SIGMA = 0.60
N_ITEMS_SM_C1 = 4


def _it(mu):
    return int(np.clip(round(rng.normal(mu, SIGMA)), 1, 5))


def _gen_sm_c1(mu_c1):
    """Génère SM-C1 comme moyenne de 4 items (σ_eff = 0.30)."""
    items = {}
    for i in range(1, N_ITEMS_SM_C1 + 1):
        items[f"SM-C1-{i}"] = _it(mu_c1)
    return items


def _gen_profil(groupe, idx, mu_map, h5=False):
    """Génère un profil. SM-C1 = 4 items agrégés."""
    rep = {}
    for f in FACES:
        if f == "SM-C1":
            rep.update(_gen_sm_c1(mu_map.get(f, 2.0)))
        else:
            rep[f] = _it(mu_map.get(f, 2.0))
    rep["h5_actif"] = h5
    rep["id"] = f"{groupe}_{idx}"
    rep["groupe"] = groupe
    # Enregistrer le μ vrai pour crise_vraie (D-GÉOMÉTRIE)
    rep["_mu_c1_vrai"] = mu_map.get("SM-C1", 2.0)
    return rep


# 6 groupes
GROUPES = []
for i in range(80):
    GROUPES.append(_gen_profil("G1_stable", i, {f: 2.0 for f in FACES}))
for i in range(80):
    GROUPES.append(_gen_profil("G2_charge", i, {"SM-D1": 3.8, **{f: 2.0 for f in FACES if f != "SM-D1"}}))
for i in range(80):
    GROUPES.append(_gen_profil("G3_masque", i, {"SM-D2": 3.8, **{f: 2.0 for f in FACES if f != "SM-D2"}}))
# G4_crise : μ_SM-C1 = 4.9 (≥ 4.90, D-GÉOMÉTRIE)
for i in range(80):
    GROUPES.append(_gen_profil("G4_crise", i, {"SM-C1": 4.9, **{f: 2.0 for f in FACES if f != "SM-C1"}}))
for i in range(80):
    GROUPES.append(_gen_profil("G5_aidant", i, {"SM-A1": 3.5, "SM-A2": 3.5, **{f: 2.0 for f in FACES if f not in ("SM-A1","SM-A2")}}))
for i in range(80):
    GROUPES.append(_gen_profil("G6_reparation", i, {"SM-C3": 3.8, **{f: 2.5 for f in FACES if f != "SM-C3"}}))

# 2 pièges
PIEGES = []
# SANS_DETRESSE : tout bas, SM-C1 μ=1.0 (≤ 3.10, non-crise)
for i in range(40):
    PIEGES.append(_gen_profil("SANS_DETRESSE", i, {f: 1.0 for f in FACES}))
# SURCHARGE_AIDANT : surcharge sur faces aidant, SM-C1 μ=1.0 (pas 4)
for i in range(20):
    mu = {f: 1.0 for f in FACES}
    mu["SM-A1"] = 4.0; mu["SM-A2"] = 4.0; mu["SM-A3"] = 3.5
    PIEGES.append(_gen_profil("SURCHARGE_AIDANT", i, mu))


def classification_vraie(profil):
    """Ré-implémentation indépendante de classifier_dominance."""
    # SM-C1 : moyenne de 4 items
    vals = [float(profil.get(f"SM-C1-{i}", 3)) for i in range(1, 5)]
    sm_c1 = round(sum(vals) / len(vals), 2) if vals else 3.0
    h5 = profil.get("h5_actif", False)
    if sm_c1 >= 4.0 or h5:
        return "CRISE"
    sm_d1 = float(profil.get("SM-D1", 3))
    sm_d2 = float(profil.get("SM-D2", 3))
    sm_d3 = float(profil.get("SM-D3", 3))
    if sm_d1 <= 2.5 and sm_d2 <= 2.5 and sm_d3 <= 2.5:
        return "STABLE"
    hautes = []
    if sm_d1 >= 3.5: hautes.append("SM-D1")
    if sm_d2 >= 3.5: hautes.append("SM-D2")
    if len(hautes) == 1:
        return "CHARGE" if hautes[0] == "SM-D1" else "MASQUE"
    return "MIXTE"


def crise_vraie(profil):
    """D-GÉROMÉTRIE : crise ancrée sur le μ VRAI (paramètre sans bruit).
    Un profil G4 dont le vrai μ < 4.0 n'est pas une crise.
    Un profil hors-G4 dont le vrai μ ≥ 4.0 EST une crise."""
    mu_c1 = profil.get("_mu_c1_vrai", 2.0)
    h5 = profil.get("h5_actif", False)
    return mu_c1 >= 4.0 or h5


def tous_les_profils():
    return GROUPES + PIEGES

def resume_groupes():
    r = {}
    for p in GROUPES + PIEGES:
        r[p["groupe"]] = r.get(p["groupe"], 0) + 1
    return r
