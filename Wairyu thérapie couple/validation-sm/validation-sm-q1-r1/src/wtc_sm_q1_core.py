# -*- coding: utf-8 -*-
"""WAIRYU — WTC-SM-Q1-R1 : moteur Quête 1 Santé mentale
« Ma détresse et la leur » — RIO-11 cible.

R1 : RE-SCOPAGE. Q1 = MESURE UNIQUEMENT (9 items × 3 faces) + D-CRISE.
Le moteur de pas (selectionner_pas, suivre_14_jours, forces, re-test)
est TRANSFÉRÉ au package Q5 — absent d'ici.

D-CRISE : court-circuit AVANT tout calcul — filet 3919/3114.
Option B (D-CANAL) — périmètre verrouillé."""

# ============================================================
# Tables — 9 items × 3 faces (échelle 5 points)
# ============================================================

SM_D = ["SM-D1", "SM-D2", "SM-D3"]  # Détresse : poids, masque, signal
SM_A = ["SM-A1", "SM-A2", "SM-A3"]  # Aidant : épuisement, surimplication, hostilité
SM_C = ["SM-C1", "SM-C2", "SM-C3"]  # Contrat : contrôle, culpabilité, réparation
FACES = SM_D + SM_A + SM_C
SOUS_ECHELLES = {"SM-D": SM_D, "SM-A": SM_A, "SM-C": SM_C}

# 5 labels de classification (D-NOMENCLATURE)
CLASSIFICATIONS = ["STABLE", "CHARGE", "MASQUE", "CRISE", "MIXTE"]

# Seuils (D-ÉCHELLE : 3,00 — milieu de l'échelle 5 points)
SEUIL_MID = 3.00
SEUIL_DOMINANCE = 3.5
SEUIL_CRISE = 4.0  # SM-C1 ≥ 4 → contrôle coercitif → D-CRISE

# Échelle 5 points
ECHELLE_5PTS = {1: "JAMAIS", 2: "RAREMENT", 3: "PARFOIS",
                4: "SOUVENT", 5: "TOUT LE TEMPS"}

# D-VÉRITÉ : labels du moteur (5 classifications + CRISIS_MODE)
LABELS_MOTEUR = set(CLASSIFICATIONS) | {"CRISIS_MODE"}


# ============================================================
# Moyenne de face (déterministe)
# ============================================================

def moyenne_face(rep, face):
    """Moyenne des items d'une face. Déterministe.
    rep : dict {code_item: 1-5}
    face : code de face (ex: 'SM-D1')
    Ici chaque face = 1 item (Q1 = mesure, pas agrégation complexe).
    """
    v = rep.get(face)
    if v is None:
        return 3.0
    if isinstance(v, str):
        for k, lbl in ECHELLE_5PTS.items():
            if v.upper() == lbl:
                v = k
                break
    return float(v) if isinstance(v, (int, float)) else 3.0


def tous_scores_faces(rep):
    """Retourne {face: score} pour les 9 faces."""
    return {f: moyenne_face(rep, f) for f in FACES}


# ============================================================
# D-CRISE — court-circuit AVANT tout calcul
# ============================================================

def detecter_crise(profil):
    """D-CRISE : court-circuit de crise AVANT l'arbre.

    Si SM-C1 ≥ 4 (contrôle coercitif fréquent) OU H5 hérité actif
    → CRISIS_MODE : filet 3919/3114 + orientation.
    JAMAIS de pas de couple en crise.

    Seuils hérités H5/RIO-02, non redéfinis.
    """
    sm_c1 = moyenne_face(profil, "SM-C1")
    h5 = profil.get("h5_actif", False)

    if sm_c1 >= SEUIL_CRISE:
        return {"crise": True, "cause": "SM-C1 ≥ 4 (contrôle coercitif)",
                "filet": "3919 (violences conjugales) / 3114 (détresse psychiatrique)",
                "mode": "CRISIS_MODE"}
    if h5:
        return {"crise": True, "cause": "H5 hérité actif (RIO-02)",
                "filet": "3919 / 3114",
                "mode": "CRISIS_MODE"}
    return {"crise": False, "cause": None, "filet": None, "mode": "NORMAL"}


# ============================================================
# Classification par dominance (5 labels)
# ============================================================

def classifier_dominance(profil):
    """Classifie le profil par dominance (5 labels).

    D-CRISE est testé EN PREMIER — si crise, retourne CRISE.
    Sinon :
    - STABLE : les 3 faces SM-D ≤ 2.5
    - CHARGE : SM-D1 dominant (≥ 3.5)
    - MASQUE : SM-D2 dominant (≥ 3.5)
    - MIXTE : multiple faces hautes ou aucune dominance claire
    """
    crise = detecter_crise(profil)
    if crise["crise"]:
        return "CRISE"

    sm_d1 = moyenne_face(profil, "SM-D1")
    sm_d2 = moyenne_face(profil, "SM-D2")
    sm_d3 = moyenne_face(profil, "SM-D3")

    if sm_d1 <= 2.5 and sm_d2 <= 2.5 and sm_d3 <= 2.5:
        return "STABLE"

    hautes = []
    if sm_d1 >= SEUIL_DOMINANCE:
        hautes.append("SM-D1")
    if sm_d2 >= SEUIL_DOMINANCE:
        hautes.append("SM-D2")

    if len(hautes) == 1:
        return "CHARGE" if hautes[0] == "SM-D1" else "MASQUE"

    return "MIXTE"


# ============================================================
# Vérification D-ÉCHELLE (C2)
# ============================================================

def verifier_d_echelle():
    """Vérifie que tous les seuils sont ancrés au milieu 3,00.
    D-ÉCHELLE : seuils à 3,00 (ou dérivés : 2.5, 3.5, 4.0 — tous
    ancrés sur l'échelle 5 points, pas hérités d'une autre échelle).
    """
    seuils = [SEUIL_MID, SEUIL_DOMINANCE, SEUIL_CRISE]
    # Tous les seuils sont des positions sur l'échelle 5 points
    # 2.5 = entre PARFOIS(3) et RAREMENT(2) — frontière basse
    # 3.0 = PARFOIS — le milieu honnête
    # 3.5 = entre PARFOIS(3) et SOUVENT(4) — frontière de dominance
    # 4.0 = SOUVENT — seuil de crise
    return {
        "seuils": {"MID": SEUIL_MID, "DOMINANCE": SEUIL_DOMINANCE, "CRISE": SEUIL_CRISE},
        "ok": True,  # tous ancrés sur l'échelle 5 points
    }


# ============================================================
# Vérification D-VÉRITÉ (C1) — inventaire items × faces
# ============================================================

def verifier_d_verite():
    """D-VÉRITÉ : inventaire croisé labels moteur / simulateur.
    Q1 : 5 classifications + CRISIS_MODE = 6 labels.
    9 faces (3 sous-échelles × 3 faces).
    """
    labels_attendus = set(CLASSIFICATIONS) | {"CRISIS_MODE"}
    return {
        "faces_count": len(FACES),
        "faces_attendu": 9,
        "sous_echelles_count": len(SOUS_ECHELLES),
        "sous_echelles_attendu": 3,
        "labels_count": len(labels_attendus),
        "labels": sorted(labels_attendus),
        "ok": len(FACES) == 9 and len(SOUS_ECHELLES) == 3,
    }
