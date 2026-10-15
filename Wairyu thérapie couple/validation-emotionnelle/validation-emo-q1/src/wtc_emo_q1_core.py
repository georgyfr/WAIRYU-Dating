"""
WTC-EMO-Q1 — Moteur de la Quête 1 Émotionnelle « Ma météo intérieure »
=======================================================================

Dimension ÉMOTIONNELLE — première dimension TRIPARTITE du projet WAIRYU.
3 sous-échelles (E-R Régulation, E-B Besoins, E-L Langages) × 3 faces = 9 faces.
+ 3 blocs annexes (C comportement, D-EXP demande explicite, CAP capitalisation)
+ 1 bloc optionnel (OPT-A, croisement couple)

Fondation documentaire v1.1 (commit 7a5ea81) — reproduite MOT POUR MOT.

Faute n°16 pré-attrapée (D-TABLE étendue aux conditions de forces) :
jamais de OU simple sur condition négative. F-E2 corrigée à la source —
l'absence d'explosion (E-R1 ≤ 2,5) ne suffit pas à activer « pacifique » ;
il faut une preuve comportementale (C-B ≥ 2 ou journal U ≥ 4/7).

Avertissement D-SIM : résultats issus de simulations (seed 42) —
la mécanique est validée, pas la prévalence clinique.
"""

# ============================================================
# Tables du core — items (MOT POUR MOT depuis fondation v1.1)
# ============================================================

# Échelle 5 points (nouvelle granularité)
ECHELLE_5PTS = {
    1: "JAMAIS",
    2: "RAREMENT",
    3: "PARFOIS",
    4: "SOUVENT",
    5: "TOUT LE TEMPS",
}

# 9 faces (3 sous-échelles × 3 faces)
FACES = [
    # E-R Régulation
    "E-R1", "E-R2", "E-R3",
    # E-B Besoins
    "E-B1", "E-B2", "E-B3",
    # E-L Langages
    "E-L1", "E-L2", "E-L3",
]

SOUS_ECHELLES = {
    "E-R": ["E-R1", "E-R2", "E-R3"],
    "E-B": ["E-B1", "E-B2", "E-B3"],
    "E-L": ["E-L1", "E-L2", "E-L3"],
}

# Items par face (3 items par face, 27 items déclaratifs)
ITEMS_PAR_FACE = {
    "E-R1": ["E-R1-1", "E-R1-2", "E-R1-3"],
    "E-R2": ["E-R2-1", "E-R2-2", "E-R2-3"],
    "E-R3": ["E-R3-1", "E-R3-2", "E-R3-3"],
    "E-B1": ["E-B1-1", "E-B1-2", "E-B1-3"],
    "E-B2": ["E-B2-1", "E-B2-2", "E-B2-3"],
    "E-B3": ["E-B3-1", "E-B3-2", "E-B3-3"],
    "E-L1": ["E-L1-1", "E-L1-2", "E-L1-3"],
    "E-L2": ["E-L2-1", "E-L2-2", "E-L2-3"],
    "E-L3": ["E-L3-1", "E-L3-2", "E-L3-3"],
}

# 6 forces (banque fermée)
FORCES = ["F-E1", "F-E2", "F-E3", "F-E4", "F-E5", "F-E6"]

# 5 labels de classification par dominance
CLASSIFICATIONS = ["RÉGULÉ", "EXPLOSIF", "SUPPRESSIF", "RUMINANT", "MIXTE"]

# ============================================================
# 7 templates d'affichage (MOT POUR MOT — fondation v1.1)
# ============================================================
# 6 forces + SILENCIEUSE

TEMPLATES = {
    "F-E1": "Le cœur qui écoute : tu accueilles l'émotion de l'autre sans la "
            "corriger ni la minimiser — c'est une force que ton couple connaît.",
    "F-E2": "Le cœur qui pacifie : tu désamorses les tensions avant qu'elles "
            "montent — ta présence apaise le climat.",
    "F-E3": "Le cœur qui célèbre : tu réponds aux bonnes nouvelles avec "
            "enthousiasme — la joie de l'autre te touche.",
    "F-E4": "Le cœur qui réclame : tu formules tes besoins clairement, tu ne "
            "les laisses pas deviner — c'est une assise.",
    "F-E5": "Le cœur qui tient : tu traverses les tempêtes sans abandonner — "
            "c'est sur toi que la relation s'appuie quand ça tremble.",
    "F-E6": "Le cœur qui convertit : tu donnes dans la devise de l'autre, pas "
            "dans la tienne — tu sais changer de canal pour toucher.",
    "SILENCIEUSE": "Ton cœur est encore discret sur ces questions — c'est un "
                   "constat, pas un défaut : la suite du parcours servira "
                   "aussi à ça.",
}

# ============================================================
# Seuils (D-STD — posés AVANT critères, plafond mesuré au validateur)
# ============================================================

SEUIL_PACIFIQUE_E_R1 = 2.5  # E-R1 ≤ 2,5 = absence d'explosion
SEUIL_RUMINATION_E_R3 = 2.5  # E-R3 ≤ 2,5 = absence de rumination
SEUIL_DOMINANCE = 3.5  # face ≥ 3,5 = dominance nette
SEUIL_JOURNAL = 4  # journal X ≥ 4/7 = activation voie C
SEUIL_JOURNAL_FAIBLE = 3  # journal M ≥ 3/7 (F-E5 condition combinée)
SEUIL_CAP = 1  # CAP = 1 (active-constructive choisi)
SEUIL_DEMANDE_EXPLICITE = 3  # D-EXP ≥ 3
SEUIL_CONTRADICTION_ER1_ER2 = 3.5  # E-R1 × E-R2 ≥ 3,5 = contradiction naturelle
SEUIL_LINEARITE_RQS = 0.55  # linéarité < 0,55 = qualité acceptable


# ============================================================
# Calcul des scores de face et sous-échelle
# ============================================================

def score_face(profil, face):
    """Calcule le score moyen d'une face (moyenne des 3 items, échelle 1-5).

    Args:
        profil : dict avec les items (clés = codes d'items)
        face : code de la face (ex: "E-R1")

    Returns:
        float : score moyen (1-5), ou 3.0 si items manquants (défaut neutre)
    """
    items = ITEMS_PAR_FACE.get(face, [])
    valeurs = []
    for item in items:
        v = profil.get(item)
        if v is not None:
            # Accepter int ou string d'échelle
            if isinstance(v, str):
                # Convertir "JAMAIS" → 1, etc.
                for k, lbl in ECHELLE_5PTS.items():
                    if v.upper() == lbl:
                        v = k
                        break
            if isinstance(v, (int, float)):
                valeurs.append(float(v))
    if not valeurs:
        return 3.0  # défaut neutre
    return sum(valeurs) / len(valeurs)


def score_sous_echelle(profil, sous_echelle):
    """Calcule le score moyen d'une sous-échelle (moyenne des 3 faces).

    Args:
        profil : dict
        sous_echelle : "E-R", "E-B" ou "E-L"

    Returns:
        float : score moyen (1-5)
    """
    faces = SOUS_ECHELLES.get(sous_echelle, [])
    if not faces:
        return 3.0
    scores = [score_face(profil, f) for f in faces]
    return sum(scores) / len(scores)


def tous_scores_faces(profil):
    """Retourne un dict {face: score} pour les 9 faces."""
    return {face: score_face(profil, face) for face in FACES}


# ============================================================
# Classification par dominance (5 labels)
# ============================================================

def classifier_dominance(profil):
    """Classifie le profil par dominance émotionnelle.

    RÈGLES (D-STD — posées AVANT critères) :
    - RÉGULÉ : les 3 faces E-R ≤ 2,5 (régulation saine, pas de dominance pathologique)
    - EXPLOSIF : E-R1 dominant (E-R1 > E-R2, E-R1 > E-R3, E-R1 ≥ 3,5)
    - SUPPRESSIF : E-R2 dominant (E-R2 > E-R1, E-R2 > E-R3, E-R2 ≥ 3,5)
    - RUMINANT : E-R3 dominant (E-R3 > E-R1, E-R3 > E-R2, E-R3 ≥ 3,5)
    - MIXTE : multiple faces ≥ 3,5, ou aucune dominance claire

    Args:
        profil : dict

    Returns:
        str : l'un des 5 labels
    """
    er1 = score_face(profil, "E-R1")
    er2 = score_face(profil, "E-R2")
    er3 = score_face(profil, "E-R3")

    # RÉGULÉ : toutes les faces E-R ≤ 2,5
    if er1 <= SEUIL_PACIFIQUE_E_R1 and er2 <= SEUIL_PACIFIQUE_E_R1 and er3 <= SEUIL_PACIFIQUE_E_R1:
        return "RÉGULÉ"

    # Dominance nette : une face > les autres ET ≥ 3,5
    faces_hautes = []
    if er1 >= SEUIL_DOMINANCE:
        faces_hautes.append(("E-R1", er1))
    if er2 >= SEUIL_DOMINANCE:
        faces_hautes.append(("E-R2", er2))
    if er3 >= SEUIL_DOMINANCE:
        faces_hautes.append(("E-R3", er3))

    # Une seule face haute = dominance nette
    if len(faces_hautes) == 1:
        face_dom = faces_hautes[0][0]
        if face_dom == "E-R1" and er1 > er2 and er1 > er3:
            return "EXPLOSIF"
        if face_dom == "E-R2" and er2 > er1 and er2 > er3:
            return "SUPPRESSIF"
        if face_dom == "E-R3" and er3 > er1 and er3 > er2:
            return "RUMINANT"

    # Plusieurs faces hautes ou aucune dominance claire = MIXTE
    return "MIXTE"


# ============================================================
# RQS — Response Quality Score (recalibré pour échelle 5 points)
# ============================================================

def calculer_rqs(profil):
    """Calcule le RQS (Response Quality Score) pour échelle 5 points.

    Deux signaux de mauvaise qualité :
    1. Linéarité ≥ 0,55 : trop de réponses identiques consécutives (straight-lining)
    2. Contradiction naturelle E-R1 × E-R2 ≥ 3,5 : explosion ET mur élevés simultanément

    Returns:
        dict avec :
            linearite : float (0-1)
            linearite_ok : bool (True si < 0,55)
            contradiction_er1_er2 : float (produit)
            contradiction_ok : bool (True si < 3,5)
            rqs_ok : bool (linearite_ok ET contradiction_ok)
    """
    # 1. Linéarité : proportion de paires consécutives identiques
    items_ordres = []
    for face in FACES:
        for item in ITEMS_PAR_FACE[face]:
            v = profil.get(item)
            if v is not None:
                items_ordres.append(v)
    if len(items_ordres) < 2:
        linearite = 1.0
    else:
        paires_identiques = sum(1 for i in range(len(items_ordres) - 1)
                                if items_ordres[i] == items_ordres[i + 1])
        linearite = paires_identiques / (len(items_ordres) - 1)

    # 2. Contradiction E-R1 × E-R2
    er1 = score_face(profil, "E-R1")
    er2 = score_face(profil, "E-R2")
    contradiction = er1 * er2

    return {
        "linearite": round(linearite, 3),
        "linearite_ok": linearite < SEUIL_LINEARITE_RQS,
        "contradiction_er1_er2": round(contradiction, 3),
        "contradiction_ok": contradiction < SEUIL_CONTRADICTION_ER1_ER2,
        "rqs_ok": (linearite < SEUIL_LINEARITE_RQS
                   and contradiction < SEUIL_CONTRADICTION_ER1_ER2),
    }


# ============================================================
# Conditions des forces (F-E1 à F-E6)
# ============================================================
# FAUTE n°16 pré-attrapée (D-TABLE étendue aux conditions de forces) :
# JAMAIS de OU simple sur condition négative.
# F-E2 corrigée : (E-R1 ≤ 2,5 ET C-B ≥ 2) OU (C-B ≥ 3) OU (journal U ≥ 4/7)
# L'absence d'explosion seule ne suffit pas — il faut une preuve comportementale.

def cond_forces(profil):
    """Évalue les 6 conditions de forces.

    Voies :
    - Voie déclarative (items C, D-EXP, CAP)
    - Voie journal (variables t, u, l, m)

    Returns:
        dict {force: bool} pour les 6 forces
    """
    # Scores de face
    er1 = score_face(profil, "E-R1")
    er3 = score_face(profil, "E-R3")

    # Items comportementaux (bloc C)
    c_a = profil.get("C-A", 3)
    c_b = profil.get("C-B", 3)
    c_c = profil.get("C-C", 3)
    # D-EXP
    d_exp = profil.get("D-EXP", 3)
    # CAP (1 si active-constructive, 0 sinon)
    cap = profil.get("CAP", 0)

    # Journal (variables t, u, l, m — minuscules dans le code, S-EMO-6)
    journal = profil.get("journal") or {}
    j_l = journal.get("l", 0)  # liens entretenus
    j_u = journal.get("u", 0)  # moments de compréhension
    j_m = journal.get("m", 0)  # marques de tendresse

    conditions = {}

    # F-E1 Le cœur qui écoute : (C-A ≥ 2) OU (journal L ≥ 4/7)
    conditions["F-E1"] = (c_a >= 2) or (j_l >= 4)

    # F-E2 Le cœur qui pacifie — FAUTE n°16 CORRIGÉE :
    # Original (bug) : (E-R1 ≤ 2,5) OU (C-B ≥ 2) OU (journal U ≥ 4/7)
    #   → E-R1 ≤ 2,5 seul activait "pacifique" (absence = présence, D-Q3-A)
    # Corrigé : (E-R1 ≤ 2,5 ET C-B ≥ 2) OU (C-B ≥ 3) OU (journal U ≥ 4/7)
    #   → l'absence d'explosion doit être accompagnée d'une preuve comportementale
    conditions["F-E2"] = (
        (er1 <= SEUIL_PACIFIQUE_E_R1 and c_b >= 2)
        or (c_b >= 3)
        or (j_u >= 4)
    )

    # F-E3 Le cœur qui célèbre : (CAP = AC) OU (journal M ≥ 4/7)
    conditions["F-E3"] = (cap >= SEUIL_CAP) or (j_m >= 4)

    # F-E4 Le cœur qui réclame : (C-C ≥ 2) OU (D-EXP ≥ 3) OU (journal M ≥ 4/7)
    conditions["F-E4"] = (c_c >= 2) or (d_exp >= SEUIL_DEMANDE_EXPLICITE) or (j_m >= 4)

    # F-E5 Le cœur qui tient :
    # (E-R3 ≤ 2,5 ET C-B ≥ 2) OU (C-A ≥ 2) OU (journal L ≥ 4/7 ET M ≥ 3/7)
    conditions["F-E5"] = (
        (er3 <= SEUIL_RUMINATION_E_R3 and c_b >= 2)
        or (c_a >= 2)
        or (j_l >= 4 and j_m >= 3)
    )

    # F-E6 Le cœur qui convertit : (C-C ≥ 3) OU (journal U ≥ 3/7)
    # Note S-EMO-3b : la mention "question OPT" est à spécifier au package Q4
    # La condition principale C-C ≥ 3 reste évaluable.
    conditions["F-E6"] = (c_c >= 3) or (j_u >= 3)

    return conditions


# ============================================================
# verifier_forces — assemblage + règle des 2 max par densité
# ============================================================

def verifier_forces(profil):
    """Évalue le profil et retourne les forces sélectionnées + trace.

    Règles (même logique que RIO-03) :
    - densité(f) = nombre de voies activées (ici 1 par force, la voie déclarative/journal)
    - forces activées = celles dont la condition est True
    - si > 2 forces activées : sélection des 2 à plus forte densité,
      tie-break par ordre de banque (F-E1 < F-E2 < ... < F-E6)
    - si 0 force → statut SILENCIEUSE

    Returns:
        dict avec :
            statut : "ACTIF" ou "SILENCIEUSE"
            forces : liste des forces sélectionnées (≤ 2)
            conditions : dict {force: bool} (toutes les conditions)
            exclues_densite : forces exclues par la règle des 2 max
    """
    conditions = cond_forces(profil)

    # Forces activées (condition True)
    forces_actives = [f for f in FORCES if conditions[f]]

    # Densité = 1 si activée, 0 sinon (simplification — une condition composite)
    densite = {f: 1 if conditions[f] else 0 for f in FORCES}

    # Règle des 2 max par densité + tie-break ordre de banque
    exclues_densite = []
    if len(forces_actives) > 2:
        forces_triees = sorted(
            forces_actives,
            key=lambda f: (-densite[f], FORCES.index(f))
        )
        forces_actives = forces_triees[:2]
        exclues_densite = forces_triees[2:]

    if not forces_actives:
        return {
            "statut": "SILENCIEUSE",
            "forces": [],
            "conditions": conditions,
            "densite": densite,
            "exclues_densite": [],
        }

    return {
        "statut": "ACTIF",
        "forces": forces_actives,
        "conditions": conditions,
        "densite": densite,
        "exclues_densite": exclues_densite,
    }


# ============================================================
# verifier_templates — complétude
# ============================================================

def verifier_templates():
    """Vérifie la complétude des templates (6 forces + SILENCIEUSE = 7).

    Returns:
        dict avec count, manquants, ok
    """
    attendus = set(FORCES) | {"SILENCIEUSE"}
    presents = set(TEMPLATES.keys())
    manquants = attendus - presents
    return {
        "count": len(TEMPLATES),
        "attendu": 7,
        "manquants": list(manquants),
        "ok": len(TEMPLATES) == 7 and not manquants,
    }


# ============================================================
# verifier_classification — 5 labels
# ============================================================

def verifier_classification():
    """Vérifie que les 5 labels de classification sont définis.

    Returns:
        dict
    """
    return {
        "count": len(CLASSIFICATIONS),
        "attendu": 5,
        "labels": CLASSIFICATIONS,
        "ok": len(CLASSIFICATIONS) == 5,
    }
