# -*- coding: utf-8 -*-
"""WAIRYU — WTC-SM-Q1-R1-02 : simulateur Santé mentale Q1.
seed = 42. D-PARAM : σ = 0.60.
R1 : Q1 = MESURE uniquement. Pas de pas, pas de suivi, pas de forces.
6 groupes + SANS_DETRESSE + SURCHARGE_AIDANT (PERFECT/ZERO transférés à Q5).
classification_vraie indépendant (D-VÉRITÉ)."""
import numpy as np
rng = np.random.default_rng(42)

FACES = ["SM-D1","SM-D2","SM-D3","SM-A1","SM-A2","SM-A3","SM-C1","SM-C2","SM-C3"]
CLASSIFICATIONS = ["STABLE", "CHARGE", "MASQUE", "CRISE", "MIXTE"]
LABELS_SIMULATEUR = set(CLASSIFICATIONS) | {"CRISIS_MODE"}


def _it(mu):
    return int(np.clip(round(rng.normal(mu, 0.60)), 1, 5))


def _gen_profil(groupe, idx, mu_map, h5=False):
    """Génère un profil avec 9 items (1 par face) + h5_actif.
    Q1 = mesure uniquement : pas de jours_tenus, pas de journal."""
    rep = {f: _it(mu_map.get(f, 2.0)) for f in FACES}
    rep["h5_actif"] = h5
    rep["id"] = f"{groupe}_{idx}"
    rep["groupe"] = groupe
    return rep


# ============================================================
# 6 groupes (MESURE — pas de suivi 14j)
# ============================================================

GROUPES = []
for i in range(80):
    GROUPES.append(_gen_profil("G1_stable", i, {f: 2.0 for f in FACES}))
for i in range(80):
    GROUPES.append(_gen_profil("G2_charge", i, {"SM-D1": 3.8, **{f: 2.0 for f in FACES if f != "SM-D1"}}))
for i in range(80):
    GROUPES.append(_gen_profil("G3_masque", i, {"SM-D2": 3.8, **{f: 2.0 for f in FACES if f != "SM-D2"}}))
for i in range(80):
    GROUPES.append(_gen_profil("G4_crise", i, {"SM-C1": 4.2, **{f: 2.0 for f in FACES if f != "SM-C1"}}))
for i in range(80):
    GROUPES.append(_gen_profil("G5_aidant", i, {"SM-A1": 3.5, "SM-A2": 3.5, **{f: 2.0 for f in FACES if f not in ("SM-A1","SM-A2")}}))
for i in range(80):
    GROUPES.append(_gen_profil("G6_reparation", i, {"SM-C3": 3.8, **{f: 2.5 for f in FACES if f != "SM-C3"}}))

# ============================================================
# 2 pièges (PERFECT/ZERO transférés à Q5)
# ============================================================

PIEGES = []
# SANS_DETRESSE : tout bas, H5 inactif, SM-C1=1 → STABLE + 0 alarme fabriquée
for i in range(40):
    p = _gen_profil("SANS_DETRESSE", i, {f: 1 for f in FACES}, h5=False)
    PIEGES.append(p)
# SURCHARGE_AIDANT : toutes faces élevées → plafonds D-STD-2 par config
for i in range(20):
    p = _gen_profil("SURCHARGE_AIDANT", i, {f: 4 for f in FACES}, h5=False)
    PIEGES.append(p)


# ============================================================
# D-VÉRITÉ — ré-implémentation indépendante
# ============================================================

def classification_vraie(profil):
    """Ré-implémentation indépendante de classifier_dominance."""
    sm_c1 = float(profil.get("SM-C1", 3))
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
    """Ré-implémentation indépendante de detecter_crise."""
    sm_c1 = float(profil.get("SM-C1", 3))
    h5 = profil.get("h5_actif", False)
    if sm_c1 >= 4.0 or h5:
        return True
    return False


def tous_les_profils():
    return GROUPES + PIEGES

def resume_groupes():
    r = {}
    for p in GROUPES + PIEGES:
        r[p["groupe"]] = r.get(p["groupe"], 0) + 1
    return r
