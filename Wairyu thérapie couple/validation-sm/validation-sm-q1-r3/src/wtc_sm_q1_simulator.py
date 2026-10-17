# -*- coding: utf-8 -*-
"""WAIRYU — WTC-SM-Q1-R3-02 : simulateur Santé mentale Q1.
R3 : réconciliation + voie H5 peuplée.
8 classes : 6 groupes + SANS_DETRESSE + SURCHARGE_AIDANT.
H5 peuplé : G7_h5 (20 profils H5=true, SM-C1 μ=2.0).
Aucune classe exclue en bloc — D-ÉCART s'applique aux 8 classes.
crise_vraie sur μ vrai (paramètre sans bruit)."""
import numpy as np
rng = np.random.default_rng(42)

FACES = ["SM-D1","SM-D2","SM-D3","SM-A1","SM-A2","SM-A3","SM-C1","SM-C2","SM-C3"]
CLASSIFICATIONS = ["STABLE", "CHARGE", "MASQUE", "CRISE", "MIXTE"]
LABELS_SIMULATEUR = set(CLASSIFICATIONS) | {"CRISIS_MODE"}
SIGMA = 0.60
N_ITEMS_SM_C1 = 4
# D-GÉOMÉTRIE : σ_eff = 0.60/√4 = 0.30, 3σ = 0.90
# Bande exclue : [3.10, 4.90]
# Centres : non-crise μ ≤ 3.10, crise μ ≥ 4.90


def _it(mu):
    return int(np.clip(round(rng.normal(mu, SIGMA)), 1, 5))


def _gen_sm_c1(mu_c1):
    """Génère SM-C1 comme 4 items (σ_eff = 0.30)."""
    items = {}
    for i in range(1, N_ITEMS_SM_C1 + 1):
        items[f"SM-C1-{i}"] = _it(mu_c1)
    return items


def _gen_profil(groupe, idx, mu_map, h5=False):
    rep = {}
    for f in FACES:
        if f == "SM-C1":
            rep.update(_gen_sm_c1(mu_map.get(f, 2.0)))
        else:
            rep[f] = _it(mu_map.get(f, 2.0))
    rep["h5_actif"] = h5
    rep["id"] = f"{groupe}_{idx}"
    rep["groupe"] = groupe
    rep["_mu_c1_vrai"] = mu_map.get("SM-C1", 2.0)
    rep["_h5_vrai"] = h5
    return rep


# ============================================================
# 8 classes (6 groupes + 2 pièges + 1 voie H5 = 9 classes)
# D-ÉCART : aucune classe exclue en bloc
# ============================================================

GROUPES = []

# G1_stable : μ=2.0 partout → STABLE, non-crise (μ_c1=2.0 ≤ 3.10)
for i in range(70):
    GROUPES.append(_gen_profil("G1_stable", i, {f: 2.0 for f in FACES}))

# G2_charge : SM-D1=3.8 → CHARGE, non-crise (μ_c1=2.0)
for i in range(70):
    GROUPES.append(_gen_profil("G2_charge", i, {"SM-D1": 3.8, **{f: 2.0 for f in FACES if f != "SM-D1"}}))

# G3_masque : SM-D2=3.8 → MASQUE, non-crise (μ_c1=2.0)
for i in range(70):
    GROUPES.append(_gen_profil("G3_masque", i, {"SM-D2": 3.8, **{f: 2.0 for f in FACES if f != "SM-D2"}}))

# G4_crise : SM-C1=4.9 (≥ 4.90) → CRISE par voie SM-C1
for i in range(70):
    GROUPES.append(_gen_profil("G4_crise", i, {"SM-C1": 4.9, **{f: 2.0 for f in FACES if f != "SM-C1"}}))

# G5_aidant : SM-A1=3.5, SM-A2=3.5 → MIXTE, non-crise (μ_c1=2.0)
for i in range(70):
    GROUPES.append(_gen_profil("G5_aidant", i, {"SM-A1": 3.5, "SM-A2": 3.5, **{f: 2.0 for f in FACES if f not in ("SM-A1","SM-A2")}}))

# G6_reparation : SM-C3=3.8 → MIXTE, non-crise (μ_c1=2.5 ≤ 3.10)
for i in range(70):
    GROUPES.append(_gen_profil("G6_reparation", i, {"SM-C3": 3.8, **{f: 2.5 for f in FACES if f != "SM-C3"}}))

# G7_h5 : H5=true, SM-C1=2.0 (≤ 3.10, non-crise par SM-C1) → CRISE par voie H5
# 20 profils : H5 peuplé. filet déclenché 100%.
for i in range(20):
    GROUPES.append(_gen_profil("G7_h5", i, {f: 2.0 for f in FACES}, h5=True))

# Pièges
PIEGES = []
# SANS_DETRESSE : tout bas, H5=false, μ_c1=1.0 → STABLE, non-crise
for i in range(40):
    PIEGES.append(_gen_profil("SANS_DETRESSE", i, {f: 1.0 for f in FACES}))

# SURCHARGE_AIDANT : surcharge sur faces aidant, SM-C1=1.0 → non-crise
for i in range(20):
    mu = {f: 1.0 for f in FACES}
    mu["SM-A1"] = 4.0; mu["SM-A2"] = 4.0; mu["SM-A3"] = 3.5
    PIEGES.append(_gen_profil("SURCHARGE_AIDANT", i, mu))


# ============================================================
# D-VÉRITÉ — ré-implémentation indépendante
# ============================================================

def classification_vraie(profil):
    """Ré-implémentation indépendante de classifier_dominance."""
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
    """D-GÉOMÉTRIE : crise ancrée sur μ VRAI (paramètre sans bruit).
    Voies : SM-C1 (μ_vrai ≥ 4.0) OU H5 (h5_vrai = True)."""
    mu_c1 = profil.get("_mu_c1_vrai", 2.0)
    h5 = profil.get("_h5_vrai", False)
    return mu_c1 >= 4.0 or h5


def crise_voie(profil):
    """Retourne la voie de crise ('SM-C1', 'H5', 'LES_DEUX', ou None)."""
    mu_c1 = profil.get("_mu_c1_vrai", 2.0)
    h5 = profil.get("_h5_vrai", False)
    sm_c1_crise = mu_c1 >= 4.0
    if sm_c1_crise and h5: return "LES_DEUX"
    if sm_c1_crise: return "SM-C1"
    if h5: return "H5"
    return None


def tous_les_profils():
    return GROUPES + PIEGES

def resume_groupes():
    r = {}
    for p in GROUPES + PIEGES:
        r[p["groupe"]] = r.get(p["groupe"], 0) + 1
    return r
