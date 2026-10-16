# -*- coding: utf-8 -*-
"""WAIRYU — WTC-SM-Q1-02 : simulateur Santé mentale. seed = 42.
D-PARAM : σ = 0.60. D-VÉRITÉ : pas_vrai indépendant."""
import numpy as np
rng = np.random.default_rng(42)

FACES = ["SM-D1","SM-D2","SM-D3","SM-A1","SM-A2","SM-A3","SM-C1","SM-C2","SM-C3"]
FORCE_ORDER = ["F-S1", "F-S2", "F-S3", "F-S4", "F-S5", "F-S6"]
CLASSIFICATIONS = ["STABLE", "CHARGE", "MASQUE", "CRISE", "MIXTE"]

def _it(mu):
    return int(np.clip(round(rng.normal(mu, 0.60)), 1, 5))

def _gen_profil(groupe, idx, mu_map, h5=False, jours_mu=7, jours_sigma=3):
    rep = {f: _it(mu_map.get(f, 2.0)) for f in FACES}
    rep["h5_actif"] = h5
    rep["journal"] = None
    if rng.random() < 0.4:
        rep["journal"] = {"complete": True, "n": int(rng.integers(0, 3)),
                          "t": int(rng.integers(0, 8)), "u": int(rng.integers(0, 8)),
                          "l": int(rng.integers(0, 8)), "m": int(rng.integers(0, 8))}
    rep["jours_tenus"] = int(np.clip(round(rng.normal(jours_mu, jours_sigma)), 0, 14))
    rep["date_pas"] = "2026-01-01T00:00:00"
    rep["id"] = f"{groupe}_{idx}"
    rep["groupe"] = groupe
    return rep

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

PIEGES = []
for i in range(40):
    p = _gen_profil("SANS_DETRESSE", i, {f: 1 for f in FACES}, h5=False, jours_mu=1, jours_sigma=1)
    p["jours_tenus"] = 0
    PIEGES.append(p)
for i in range(20):
    p = _gen_profil("SURCHARGE_AIDANT", i, {f: 4 for f in FACES}, h5=False, jours_mu=7, jours_sigma=3)
    p["journal"] = {"complete": True, "n": 0, "t": 5, "u": 5, "l": 5, "m": 4}
    PIEGES.append(p)
for i in range(20):
    p = _gen_profil("PERFECT", i, {f: 2.5 for f in FACES}, h5=False, jours_mu=14, jours_sigma=0)
    p["jours_tenus"] = 14
    PIEGES.append(p)
for i in range(20):
    p = _gen_profil("ZERO", i, {f: 2.5 for f in FACES}, h5=False, jours_mu=0, jours_sigma=0)
    p["jours_tenus"] = 0
    PIEGES.append(p)

def pas_vrai(profil):
    sm_c1 = float(profil.get("SM-C1", 3))
    h5 = profil.get("h5_actif", False)
    if sm_c1 >= 4.0 or h5:
        return "CRISE"
    sm_d3 = float(profil.get("SM-D3", 3))
    sm_a1 = float(profil.get("SM-A1", 3))
    sm_d2 = float(profil.get("SM-D2", 3))
    sm_a3 = float(profil.get("SM-A3", 3))
    sm_c3 = float(profil.get("SM-C3", 3))
    sm_d1 = float(profil.get("SM-D1", 3))
    sm_c2 = float(profil.get("SM-C2", 3))
    if sm_d3 >= 3: return "F-S1"
    if sm_a1 >= 3: return "F-S2"
    if sm_c1 >= 2.5: return "F-S3"
    if sm_d2 >= 3: return "F-S5"
    if sm_a3 >= 3: return "F-S3"
    if sm_c3 >= 3: return "F-S6"
    if sm_d1 >= 3: return "F-S1"
    if sm_c2 >= 3: return "F-S2"
    return "F-S5"

def categorie_vraie(jours_tenus):
    if not isinstance(jours_tenus, int) or jours_tenus < 0: jours_tenus = 0
    jours_tenus = min(jours_tenus, 14)
    if jours_tenus >= 10: return "CELEBRE"
    elif jours_tenus >= 6: return "AJUSTEMENT"
    else: return "REPRISE"

def classification_vraie(profil):
    sm_c1 = float(profil.get("SM-C1", 3))
    sm_d1 = float(profil.get("SM-D1", 3))
    sm_d2 = float(profil.get("SM-D2", 3))
    sm_d3 = float(profil.get("SM-D3", 3))
    if sm_c1 >= 4.0: return "CRISE"
    if sm_d1 <= 2.5 and sm_d2 <= 2.5 and sm_d3 <= 2.5: return "STABLE"
    hautes = []
    if sm_d1 >= 3.5: hautes.append("SM-D1")
    if sm_d2 >= 3.5: hautes.append("SM-D2")
    if len(hautes) == 1:
        return "CHARGE" if hautes[0] == "SM-D1" else "MASQUE"
    return "MIXTE"

def tous_les_profils():
    return GROUPES + PIEGES

def resume_groupes():
    r = {}
    for p in GROUPES + PIEGES:
        r[p["groupe"]] = r.get(p["groupe"], 0) + 1
    return r
