"""
WTC-Q5 — Simulateur de la Quête 5 « Mon premier pas »
=======================================================

3 groupes par cas de suivi (9/14, 7/14, 3/14) + variations de
faces/empreintes pour tester la traçabilité vers Q1-Q2.
Ré-implémentation indépendante `pas_vrai` pour la vérité croisée C2.

D-STD recalculé d'emblée + D-STD-2 (plafond PAR CONFIGURATION).

Avertissement D-SIM : résultats issus de simulations (seed 42) —
la mécanique est validée, pas la prévalence clinique.
"""

import numpy as np

import wtc_q5_core as core

SEED = 42
_RNG = np.random.default_rng(SEED)


# ============================================================
# Génération d'un profil Q5
# ============================================================
# Profil = (sA, sB, label_ombre, jours_tenus, date_pas)
# Les jours_tenus sont contrôlés par groupe (9/14, 7/14, 3/14 + bruit).

# Moyennes par face dominante (cohérent Q1)
_FACE_PARAMS = {
    "RASSUREE":  (2.0, 2.0),  # sA bas, sB bas
    "EN_QUETE":  (3.2, 2.0),  # sA haut, sB bas
    "SUR_LA_RA": (2.0, 3.3),  # sA bas, sB haut
}

# Correspondance face → empreinte principale (pour la génération)
# On génère des profils variés : chaque face est croisée avec 3 empreintes
_FACE_EMPREINTES = {
    "RASSUREE":  ["ZONE_CALME", "PEUR_DE_PERDRE", "PEUR_D_ETRE_ETOUFFEE"],
    "EN_QUETE":  ["ZONE_CALME", "PEUR_DE_PERDRE", "PEUR_D_ETRE_ETOUFFEE"],
    "SUR_LA_RA": ["ZONE_CALME", "PEUR_DE_PERDRE", "PEUR_D_ETRE_ETOUFFEE"],
}


def _gen_profil(face_cible, empreinte_cible, jours_cible, idx, groupe):
    """Génère un profil Q5.

    Args:
        face_cible : face dominante attendue
        empreinte_cible : empreinte attendue
        jours_cible : jours tenus cible (9, 7, 3 + bruit)
        idx : index dans le groupe
        groupe : nom du groupe (pour l'id)

    Returns:
        dict profil
    """
    muA, muB = _FACE_PARAMS[face_cible]
    sA = float(np.clip(_RNG.normal(muA, 0.4), 0.0, 4.0))
    sB = float(np.clip(_RNG.normal(muB, 0.4), 0.0, 4.0))

    # Forcer la face (les tirages peuvent dériver)
    if face_cible == "RASSUREE":
        sA = min(sA, 2.6)
        sB = min(sB, 2.6)
    elif face_cible == "EN_QUETE":
        sA = max(sA, 2.61)
        sB = min(sB, 2.6)
    elif face_cible == "SUR_LA_RA":
        sB = max(sB, 2.61)
        # sA reste libre (peut être < 2.61)

    # Empreinte (label_ombre brut — le core normalise)
    label_ombre = empreinte_cible.replace("_", " ").title()
    # Variations d'écriture pour tester la robustesse du parser
    if _RNG.random() < 0.3:
        label_ombre = empreinte_cible.replace("_", " ")

    # Jours tenus : target + bruit borné
    # Pour 9 : entre 9 et 14 (CELEBRE)
    # Pour 7 : entre 7 et 8 (AJUSTEMENT)
    # Pour 3 : entre 0 et 6 (REPRISE)
    if jours_cible == 9:
        jours = int(_RNG.integers(9, 15))  # 9 à 14
    elif jours_cible == 7:
        jours = int(_RNG.integers(7, 9))   # 7 à 8
    elif jours_cible == 3:
        jours = int(_RNG.integers(0, 7))   # 0 à 6
    else:
        jours = jours_cible

    # Date du pas (simulée — pour le re-test à 8 semaines)
    # On prend une date fixe pour la reproductibilité
    from datetime import datetime, timedelta
    date_pas = (datetime(2026, 1, 1) + timedelta(days=int(idx))).isoformat()

    return {
        "id": f"{groupe}_{idx}",
        "groupe": groupe,
        "sA": sA, "sB": sB,
        "label_ombre": label_ombre,
        "jours_tenus": jours,
        "date_pas": date_pas,
        "face_attendue": face_cible,
        "empreinte_attendue": empreinte_cible,
        "jours_cible": jours_cible,
    }


# ============================================================
# 3 groupes par cas de suivi (9/14, 7/14, 3/14)
# ============================================================
# Chaque groupe contient des profils variés sur les 3 faces × 3 empreintes
# pour tester la traçabilité vers Q1-Q2.

def gen_groupes(n_par_groupe=60):
    """Génère 3 groupes de n profils chacun.

    Groupe CELEBRE    : jours_tenus 9-14 (catégorie attendue CELEBRE)
    Groupe AJUSTEMENT : jours_tenus 7-8  (catégorie attendue AJUSTEMENT)
    Groupe REPRISE    : jours_tenus 0-6  (catégorie attendue REPRISE)

    Returns:
        liste de profils
    """
    profils = []
    faces = ["RASSUREE", "EN_QUETE", "SUR_LA_RA"]
    empreintes = ["ZONE_CALME", "PEUR_DE_PERDRE", "PEUR_D_ETRE_ETOUFFEE"]

    # Mapping groupe → jours_cible
    groupes_config = {
        "CELEBRE": 9,
        "AJUSTEMENT": 7,
        "REPRISE": 3,
    }

    for groupe, jours_cible in groupes_config.items():
        # Répartir n_par_groupe sur les 9 combinaisons face×empreinte
        for i in range(n_par_groupe):
            face = faces[i % 3]
            emp = empreintes[(i // 3) % 3]
            profil = _gen_profil(face, emp, jours_cible, i, groupe)
            profils.append(profil)

    return profils


# ============================================================
# Ré-implémentation indépendante pour la vérité croisée C2
# ============================================================

def pas_vrai(sA, sB, label_ombre):
    """Ré-implémentation indépendante de selectionner_pas.

    Pour la vérité croisée C2 : toute divergence avec le moteur
    = bug démontré.
    """
    # Face dominante indépendante
    if sB >= 2.61:
        face = "SUR_LA_RA"
    elif sA >= 2.61:
        face = "EN_QUETE"
    else:
        face = "RASSUREE"

    # Empreinte indépendante
    if not label_ombre:
        emp = "ZONE_CALME"
    else:
        norm = label_ombre.upper().strip().replace(" ", "_")
        if "CALME" in norm:
            emp = "ZONE_CALME"
        elif "PERDRE" in norm:
            emp = "PEUR_DE_PERDRE"
        elif "ETOUFF" in norm or "ÉTOUFF" in norm:
            emp = "PEUR_D_ETRE_ETOUFFEE"
        else:
            emp = "ZONE_CALME"

    # Table indépendante (reconstruite — pas d'import du core)
    table = {
        ("RASSUREE", "ZONE_CALME"):            "P1",
        ("RASSUREE", "PEUR_DE_PERDRE"):        "P2",
        ("RASSUREE", "PEUR_D_ETRE_ETOUFFEE"):  "P3",
        ("EN_QUETE", "ZONE_CALME"):            "P2",
        ("EN_QUETE", "PEUR_DE_PERDRE"):        "P4",
        ("EN_QUETE", "PEUR_D_ETRE_ETOUFFEE"):  "P5",
        ("SUR_LA_RA", "ZONE_CALME"):           "P3",
        ("SUR_LA_RA", "PEUR_DE_PERDRE"):       "P5",
        ("SUR_LA_RA", "PEUR_D_ETRE_ETOUFFEE"): "P6",
    }
    pas = table.get((face, emp), "P1")

    return {
        "face": face,
        "empreinte": emp,
        "pas": pas,
    }


def categorie_suivi_vraie(jours_tenus):
    """Ré-implémentation indépendante de suivre_14_jours (catégorie).

    Pour la vérité croisée C2.
    """
    if not isinstance(jours_tenus, int) or jours_tenus < 0:
        jours_tenus = 0
    jours_tenus = min(jours_tenus, 14)

    if jours_tenus >= 9:
        return "CELEBRE"
    elif jours_tenus >= 7:
        return "AJUSTEMENT"
    else:
        return "REPRISE"


# ============================================================
# Données simulées (180 profils, seed 42)
# ============================================================

def generer_donnees(n_par_groupe=60):
    """Génère les données simulées."""
    return gen_groupes(n_par_groupe)


# Construction au chargement
PROFILS = generer_donnees(60)


def resume_groupes():
    """Retourne un dict {groupe: effectif}."""
    resume = {}
    for p in PROFILS:
        resume[p["groupe"]] = resume.get(p["groupe"], 0) + 1
    return resume


def tous_les_profils():
    """Retourne la liste des profils."""
    return PROFILS
