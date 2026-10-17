# -*- coding: utf-8 -*-
"""WAIRYU — WTC-SM-Q2 (RIO-12) : simulateur de l'aidant. Seed 42.

10 classes (7 groupes + 2 pièges SURCHARGE_AIDANT configs verrouillées + voie
héritée) — aucune classe exclue en bloc (D-ÉCART) ; crise_vraie ancrée sur μ
vrai (paramètre sans bruit, D-GÉOMÉTRIE).

Peuplement des 3 voies D-CRISE (verrouillage « 3 voies peuplées ») :
- voie A2 (nouvelle Q2)  : G4_surimplique_crise (70 profils, μ_A2 = 4.9)
- voie SM-C1 (héritée Q1): G8_sm_c1_crise   (20 profils, μ_C1 = 4.9)
- voie H5 (héritée RIO-02): G7_h5           (20 profils, h5 = true, μ_C1 = 2.0)

Pièges (2, verrouillés) :
- SANS_CHARGE (anti-fabrication) : tout à 1.0 → STABLE
- SURCHARGE_AIDANT en 2 configs :
  (a) A2 = 4.9 → CRISE voie A2 (court-circuit prime) = G4_surimplique_crise
  (b) A2 = 3.7 (dans bande [3.10, 4.90]) → SURIMPLIQUÉ non-crise,
      bascule théorique 15,9 % (continu) confrontée à l'observé
      = G3_surimplique_bande

G6_frontières teste que les faces B (hautes) ne classifient PAS (B
descriptives, verrouillage). G9_mixte_aidant peuple le label MIXTE (n_high=2)."""
import numpy as np

rng = np.random.default_rng(42)

FACES_A = ["SM-A1", "SM-A2", "SM-A3"]
FACES_B = ["SM-B1", "SM-B2", "SM-B3"]
FACES = FACES_A + FACES_B
VOIE_HERITEE = "SM-C1"
N_ITEMS = 4
SIGMA = 0.60  # D-PARAM

CLASSIFICATIONS = ["STABLE", "ÉPUISÉ", "SURIMPLIQUÉ", "HOSTILE", "MIXTE"]
LABELS_SIMULATEUR = set(CLASSIFICATIONS) | {"CRISE", "CRISIS_MODE"}


def _it(mu):
    """Un item : entier 1-5, bruit normal σ=0.60 (D-PARAM), borné."""
    return int(np.clip(round(rng.normal(mu, SIGMA)), 1, 5))


def _gen_face(rep, face, mu):
    for i in range(1, N_ITEMS + 1):
        rep[f"{face}-{i}"] = _it(mu)


def _gen_profil(groupe, idx, mu_faces, mu_c1, h5):
    """Profil complet : 6 faces × 4 items (instrument Q2) + voie héritée
    SM-C1 (4 items, hors instrument) + h5_actif + paramètres vrais."""
    rep = {}
    for f in FACES:
        _gen_face(rep, f, mu_faces.get(f, 2.0))
    _gen_face(rep, VOIE_HERITEE, mu_c1)
    rep["h5_actif"] = h5
    rep["id"] = f"{groupe}_{idx}"
    rep["groupe"] = groupe
    rep["_mu_vrai"] = {f: mu_faces.get(f, 2.0) for f in FACES}
    rep["_mu_c1_vrai"] = mu_c1
    rep["_h5_vrai"] = h5
    return rep


# ============================================================
# Univers 520 profils — 10 classes, centres D-GÉOMÉTRIE
# Crise : μ voie = 4.9 · Non-crise : μ voies ≤ 2.5
#         (sauf SURIMPLIQUÉ bande : centre A2 = 3.70 verrouillé)
# ============================================================

GROUPES = []

# G1_stable : tout bas → STABLE, non-crise
for i in range(70):
    GROUPES.append(_gen_profil("G1_stable", i, {}, 2.0, False))

# G2_epuise : A1 = 4.5 → ÉPUISÉ, non-crise (A2 = 2.0 hors bande)
for i in range(70):
    GROUPES.append(_gen_profil("G2_epuise", i, {"SM-A1": 4.5}, 2.0, False))

# G3_surimplique_bande : A2 = 3.70 (bande) → SURIMPLIQUÉ non-crise.
# Piège SURCHARGE_AIDANT config (b) — bascule A2 ≥ 4.0 attendue ~15,9 %
# (continu), retombant DANS la bande → exclue du décompte C3.
for i in range(70):
    GROUPES.append(_gen_profil("G3_surimplique_bande", i, {"SM-A2": 3.70}, 2.0, False))

# G4_surimplique_crise : A2 = 4.9 → CRISE voie A2 (court-circuit prime).
# Piège SURCHARGE_AIDANT config (a) + voie A2 peuplée.
for i in range(70):
    GROUPES.append(_gen_profil("G4_surimplique_crise", i, {"SM-A2": 4.90}, 2.0, False))

# G5_hostile : A3 = 4.5 → HOSTILE, non-crise (EE élevée sans surimplication)
for i in range(70):
    GROUPES.append(_gen_profil("G5_hostile", i, {"SM-A3": 4.5}, 2.0, False))

# G6_frontieres : B1/B3 = 4.5, B2 = 3.0, faces A basses → STABLE.
# Test D-VÉRITÉ : les faces B hautes ne doivent PAS classer (B descriptives).
for i in range(70):
    GROUPES.append(_gen_profil("G6_frontieres", i,
                               {"SM-B1": 4.5, "SM-B2": 3.0, "SM-B3": 4.5}, 2.0, False))

# G9_mixte_aidant : A1 = 4.5 ET A3 = 4.5 → n_high = 2 → MIXTE, non-crise
for i in range(20):
    GROUPES.append(_gen_profil("G9_mixte_aidant", i,
                               {"SM-A1": 4.5, "SM-A3": 4.5}, 2.0, False))

# G7_h5 : H5 = true, SM-C1 = 2.0 → CRISE voie H5 (héritée RIO-02, fix E-SM-6)
for i in range(20):
    GROUPES.append(_gen_profil("G7_h5", i, {}, 2.0, True))

# G8_sm_c1_crise : SM-C1 = 4.9 → CRISE voie SM-C1 (héritée Q1, centre arbitré)
for i in range(20):
    GROUPES.append(_gen_profil("G8_sm_c1_crise", i, {}, 4.9, False))

PIEGES = []

# SANS_CHARGE : tout à 1.0 → STABLE, non-crise (anti-fabrication)
for i in range(40):
    PIEGES.append(_gen_profil("SANS_CHARGE", i, {}, 1.0, False))


CLASSIFS_ATTENDUES = {
    "G1_stable": "STABLE",
    "G2_epuise": "ÉPUISÉ",
    "G3_surimplique_bande": "SURIMPLIQUÉ",
    "G4_surimplique_crise": "CRISE",
    "G5_hostile": "HOSTILE",
    "G6_frontieres": "STABLE",
    "G9_mixte_aidant": "MIXTE",
    "G7_h5": "CRISE",
    "G8_sm_c1_crise": "CRISE",
    "SANS_CHARGE": "STABLE",
}

ROLES = {
    "G1_stable": "aidant sans charge excessive (base)",
    "G2_epuise": "épuisement élevé, présence maintenue",
    "G3_surimplique_bande": "piège SURCHARGE_AIDANT (b) — surimplication en bande",
    "G4_surimplique_crise": "piège SURCHARGE_AIDANT (a) — surimplication sévère",
    "G5_hostile": "hostilité installée (EE), sans surimplication",
    "G6_frontieres": "frontières B hautes — test B non classifiantes",
    "G9_mixte_aidant": "deux faces A hautes — n_high = 2",
    "G7_h5": "voie H5 héritée (RIO-02)",
    "G8_sm_c1_crise": "voie SM-C1 héritée (Q1)",
    "SANS_CHARGE": "piège anti-fabrication (tout bas)",
}


# ============================================================
# D-VÉRITÉ — ré-implémentation indépendante du moteur
# ============================================================

def _moy(items):
    return sum(items) / len(items) if items else 3.0


def _face(profil, face):
    return _moy([float(profil[f"{face}-{i}"]) for i in range(1, N_ITEMS + 1)])


def classification_vraie(profil):
    """Ré-implémentation indépendante de classifier (autre code, même
    sémantique verrouillée) : D-CRISE d'abord, puis n_high faces A."""
    a2 = _face(profil, "SM-A2")
    c1 = _face(profil, VOIE_HERITEE)
    if a2 >= 4.0 or c1 >= 4.0 or profil.get("h5_actif", False):
        return "CRISE"
    hautes = [f for f in FACES_A if _face(profil, f) >= 3.5]
    if len(hautes) == 0:
        return "STABLE"
    if len(hautes) == 1:
        return {"SM-A1": "ÉPUISÉ", "SM-A2": "SURIMPLIQUÉ", "SM-A3": "HOSTILE"}[hautes[0]]
    return "MIXTE"


def crise_vraie(profil):
    """D-GÉOMÉTRIE : crise ancrée sur μ VRAI (paramètre sans bruit).
    A2 ≥ 4.0 (μ vrai) ∨ SM-C1 ≥ 4.0 (μ vrai) ∨ H5."""
    return (_mu_a2_vrai(profil) >= 4.0 or profil.get("_mu_c1_vrai", 2.0) >= 4.0
            or profil.get("_h5_vrai", False))


def _mu_a2_vrai(profil):
    return profil.get("_mu_vrai", {}).get("SM-A2", 2.0)


def crise_voie(profil):
    """Voies de crise VRAIES du profil (peut être multiple)."""
    voies = []
    if _mu_a2_vrai(profil) >= 4.0:
        voies.append("A2")
    if profil.get("_mu_c1_vrai", 2.0) >= 4.0:
        voies.append("SM-C1")
    if profil.get("_h5_vrai", False):
        voies.append("H5")
    return "+".join(voies) if voies else None


def taux_bascule_theorique(mu=3.70, seuil=4.00, sigma_eff=0.30):
    """Taux de bascule en approximation CONTINUE (publié au verrouillage :
    ≈ 15,9 %). La confrontation à l'observé tient compte du grain entier
    des items (arrondi 1-5) qui élargit la variance effective du tirage."""
    from math import erf, sqrt
    z = (seuil - mu) / sigma_eff
    return 1.0 - 0.5 * (1.0 + erf(z / sqrt(2.0)))


def tous_les_profils():
    return GROUPES + PIEGES


def resume_groupes():
    r = {}
    for p in GROUPES + PIEGES:
        r[p["groupe"]] = r.get(p["groupe"], 0) + 1
    return r
