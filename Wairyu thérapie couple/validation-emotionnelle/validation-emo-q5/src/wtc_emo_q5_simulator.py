# -*- coding: utf-8 -*-
"""WAIRYU — WTC-EMO-Q5-02 : simulateur Quête 5 émotionnelle.
seed = 42. D-PARAM : σ = 0,60.
Option B autorisée — périmètre verrouillé. Voir Section F validation.

6 groupes + 2 pièges (PERFECT, ZERO) = 8 entités.
pas_vrai : ré-implémentation indépendante (D-VÉRITÉ)."""
import numpy as np
rng = np.random.default_rng(42)


def _gen_profil(groupe, idx, inv_d_zone, rc_label, cap, fe1, fe6,
                 er1_mu, er2_mu, fe3, jours_mu, jours_sigma):
    """Génère un profil avec héritages et jours tenus."""
    er1_m = round(float(np.clip(rng.normal(er1_mu, 0.60), 1.0, 5.0)), 2)
    er2_m = round(float(np.clip(rng.normal(er2_mu, 0.60), 1.0, 5.0)), 2)
    jours = int(np.clip(round(rng.normal(jours_mu, jours_sigma)), 0, 14))
    return {
        "id": f"{groupe}_{idx}",
        "groupe": groupe,
        "inv_d_zone": inv_d_zone,
        "rc_label": rc_label,
        "cap": cap,
        "fe1_active": fe1,
        "fe6_active": fe6,
        "er1_moyenne": er1_m,
        "er2_moyenne": er2_m,
        "fe3_active": fe3,
        "jours_tenus": jours,
        "date_pas": "2026-01-01T00:00:00",
    }


# ============================================================
# 6 groupes (couverture canonique transposée RIO-05 → émotionnel)
# ============================================================

def gen_groupes():
    """Génère les 6 groupes principaux."""
    profils = []

    # G1 : invalidation fréquente → pas INV
    for i in range(80):
        profils.append(_gen_profil("G1_inv", i, "FRÉQUENT", "BESOIN DISCRET",
                                    "PD", False, False, 2.5, 2.5, False, 7, 3))

    # G2 : reproche-code actif → pas RC
    for i in range(80):
        profils.append(_gen_profil("G2_rc", i, "ABSENT", "REPROCHE-CODE ACTIF",
                                    "PC", False, False, 2.5, 2.5, False, 7, 3))

    # G3 : CAP non-AC → pas CAP
    for i in range(80):
        profils.append(_gen_profil("G3_cap", i, "ABSENT", "BESOIN DISCRET",
                                    "PD", False, False, 2.5, 2.5, False, 7, 3))

    # G4 : FE1 active → pas FE1
    for i in range(80):
        profils.append(_gen_profil("G4_fe1", i, "ABSENT", "BESOIN DISCRET",
                                    "AC", True, False, 2.5, 2.5, False, 9, 3))

    # G5 : ER1 élevée → pas ER1
    for i in range(80):
        profils.append(_gen_profil("G5_er1", i, "ABSENT", "BESOIN DISCRET",
                                    "AC", False, False, 3.8, 2.5, False, 6, 3))

    # G6 : rien d'actif → pas ER2 (fallback)
    for i in range(80):
        profils.append(_gen_profil("G6_fallback", i, "ABSENT", "BESOIN DISCRET",
                                    "AC", False, False, 2.0, 2.0, False, 7, 3))

    return profils


# ============================================================
# 2 pièges : PERFECT (14/14) et ZERO (0/14)
# ============================================================

def gen_pieges():
    """Génère les 2 pièges."""
    profils = []

    # PERFECT : 14/14 jours → CELEBRE attendu (sans flatterie ni fabrication)
    for i in range(20):
        p = _gen_profil("PERFECT", i, "ABSENT", "BESOIN DISCRET",
                        "AC", False, False, 2.5, 2.5, False, 14, 0)
        p["jours_tenus"] = 14
        profils.append(p)

    # ZERO : 0/14 jours → REPRISE attendu (sans condamnation)
    for i in range(20):
        p = _gen_profil("ZERO", i, "ABSENT", "BESOIN DISCRET",
                        "AC", False, False, 2.5, 2.5, False, 0, 0)
        p["jours_tenus"] = 0
        profils.append(p)

    return profils


# ============================================================
# Ré-implémentation indépendante (D-VÉRITÉ — vérité croisée)
# ============================================================

def pas_vrai(profil):
    """Ré-implémentation indépendante de selectionner_pas pour C2.
    Même arbre de priorité, ré-implémenté séparément."""
    inv_d_zone = profil.get("inv_d_zone", "ABSENT")
    rc_label = profil.get("rc_label", "BESOIN DISCRET")
    cap = profil.get("cap", "PD")
    fe1 = profil.get("fe1_active", False)
    fe6 = profil.get("fe6_active", False)
    er1 = profil.get("er1_moyenne", 3.0)
    er2 = profil.get("er2_moyenne", 3.0)
    fe3 = profil.get("fe3_active", False)

    if inv_d_zone in ("OCCASIONNEL", "FRÉQUENT"):
        return "INV"
    if rc_label in ("REPROCHE-CODE ACTIF", "BESOIN VIVANT, FORMULATION MIXTE"):
        return "RC"
    if cap != "AC":
        return "CAP"
    if fe1:
        return "FE1"
    if fe6:
        return "FE6"
    if er1 >= 3.0:
        return "ER1"
    if er2 >= 3.0:
        return "ER2"
    if fe3:
        return "FE3"
    return "ER2"


def categorie_vraie(jours_tenus):
    """Ré-implémentation indépendante de suivre_14_jours (catégorie)."""
    if not isinstance(jours_tenus, int) or jours_tenus < 0:
        jours_tenus = 0
    jours_tenus = min(jours_tenus, 14)
    if jours_tenus >= 10:
        return "CELEBRE"
    elif jours_tenus >= 6:
        return "AJUSTEMENT"
    else:
        return "REPRISE"


# ============================================================
# Données simulées (construction au chargement, seed 42)
# ============================================================

GROUPES = gen_groupes()
PIEGES = gen_pieges()


def tous_les_profils():
    """Retourne la liste plate de tous les profils."""
    return GROUPES + PIEGES


def resume_groupes():
    """Retourne un dict {groupe: effectif}."""
    resume = {}
    for p in GROUPES:
        resume[p["groupe"]] = resume.get(p["groupe"], 0) + 1
    for p in PIEGES:
        resume[p["groupe"]] = resume.get(p["groupe"], 0) + 1
    return resume
