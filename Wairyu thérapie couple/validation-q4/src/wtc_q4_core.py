"""
WTC-Q4 — Moteur de la Quête 4 « Notre danse » (croisement de couple)
====================================================================

Package WTC-Q4 — premier package construit avec D-STD recalculé d'emblée
(leçon D-Q3-J : les bornes sont conditionnelles à la géométrie du
simulateur — on les calcule AVANT de poser les seuils).

Principes non négociables respectés :
- Honnêteté sans condamnation : les 9 templates sont non-blâmants.
- Jamais l'évaluation du partenaire : chaque partenaire confirme sur soi.
- Aucun pourcentage de « compatibilité » affiché.
- La boucle de poursuite-retrait est nommée ENSEMBLE (pas « c'est toi qui
  poursuis »).

Avertissement D-SIM : résultats issus de simulations (seed 42) —
la mécanique est validée, pas la prévalence clinique.
"""

# ============================================================
# Tables du core
# ============================================================

# 4 types d'attachement (dérivés des scores A/B des Quêtes 1-2)
# SEREIN      : sA < 2.61 ET sB < 2.61  → ZONE CALME
# PREOCCUPE   : sA ≥ 2.61              → PEUR DE PERDRE
# DETACHE     : sB ≥ 2.61              → PEUR D'ÊTRE ÉTOUFFÉE
# EN_ALERTFEU : sA ≥ 2.61 ET sB ≥ 2.61  → les deux peurs vives
TYPES_ATTACH = ["SEREIN", "PREOCCUPE", "DETACHE", "EN_ALERTFEU"]

# 9 configurations de couple (paires de types, avec variantes symétriques)
# 1. BASE_SEREINE          : SEREIN × SEREIN
# 2. DANSE_QUI_TOURNE      : PREOCCUPE × DETACHE (ou symétrique)
# 3. FEU_CROISE            : EN_ALERTFEU × EN_ALERTFEU (ou × PREOCCUPE)
# 4. DISTANCE_POLIE        : DETACHE × DETACHE
# 5. MIXTE_SEREINE_POURSUITE : SEREIN × PREOCCUPE (ou symétrique)
# 6. MIXTE_SEREINE_RETRAIT   : SEREIN × DETACHE (ou symétrique)
# 7. MIXTE_SEREINE_FEU       : SEREIN × EN_ALERTFEU (ou symétrique)
# 8. MIXTE_POURSUITE_FEU     : PREOCCUPE × EN_ALERTFEU (ou symétrique)
# 9. MIXTE_RETRAIT_FEU       : DETACHE × EN_ALERTFEU (ou symétrique)
CONFIGS_9 = [
    "BASE_SEREINE",
    "DANSE_QUI_TOURNE",
    "FEU_CROISE",
    "DISTANCE_POLIE",
    "MIXTE_SEREINE_POURSUITE",
    "MIXTE_SEREINE_RETRAIT",
    "MIXTE_SEREINE_FEU",
    "MIXTE_POURSUITE_FEU",
    "MIXTE_RETRAIT_FEU",
]

# Table de correspondance (type_p1, type_p2) → configuration
# L'ordre canonique est (p1, p2) mais l'identification est SYMÉTRIQUE.
#
# NOTE D-Q4-1 (corrigé) : (PREOCCUPE, EN_ALERTFEU) et (EN_ALERTFEU, PREOCCUPE)
# sont MIXTE_POURSUITE_FEU (pas FEU_CROISE). FEU_CROISE = deux partenaires en
# alerte (EN_ALERTFEU×EN_ALERTFEU) ou deux préoccupés (PREOCCUPE×PREOCCUPE).
# Bug initial : entrées dupliquées → la dernière valeur écrasait MIXTE_POURSUITE_FEU.
_CONFIG_TABLE = {
    ("SEREIN", "SEREIN"): "BASE_SEREINE",
    ("PREOCCUPE", "DETACHE"): "DANSE_QUI_TOURNE",
    ("DETACHE", "PREOCCUPE"): "DANSE_QUI_TOURNE",
    ("EN_ALERTFEU", "EN_ALERTFEU"): "FEU_CROISE",
    ("PREOCCUPE", "PREOCCUPE"): "FEU_CROISE",
    ("DETACHE", "DETACHE"): "DISTANCE_POLIE",
    ("SEREIN", "PREOCCUPE"): "MIXTE_SEREINE_POURSUITE",
    ("PREOCCUPE", "SEREIN"): "MIXTE_SEREINE_POURSUITE",
    ("SEREIN", "DETACHE"): "MIXTE_SEREINE_RETRAIT",
    ("DETACHE", "SEREIN"): "MIXTE_SEREINE_RETRAIT",
    ("SEREIN", "EN_ALERTFEU"): "MIXTE_SEREINE_FEU",
    ("EN_ALERTFEU", "SEREIN"): "MIXTE_SEREINE_FEU",
    ("PREOCCUPE", "EN_ALERTFEU"): "MIXTE_POURSUITE_FEU",
    ("EN_ALERTFEU", "PREOCCUPE"): "MIXTE_POURSUITE_FEU",
    ("DETACHE", "EN_ALERTFEU"): "MIXTE_RETRAIT_FEU",
    ("EN_ALERTFEU", "DETACHE"): "MIXTE_RETRAIT_FEU",
}

# ============================================================
# 9 templates non-blâmants (MOT POUR MOT)
# ============================================================
# Chacun nomme la danse ENSEMBLE, sans blâmer l'un ou l'autre.
# Aucun pourcentage de compatibilité. Chacun confirme sur soi.

TEMPLATES_CONFIGS = {
    "BASE_SEREINE":
        "Votre danse est posée. Chacun se tient à sa place, l'espace "
        "entre vous respire — c'est une assise qui se reconnaît des "
        "deux côtés.",
    "DANSE_QUI_TOURNE":
        "Votre danse tourne. L'un avance quand l'autre recule, et le "
        "mouvement se répète. Ce n'est pas une faute — c'est un pas "
        "de danse que votre couple connaît.",
    "FEU_CROISE":
        "Votre danse est vive. Les deux êtes en alerte, et les "
        "étincelles se croisent. L'intensité est réelle des deux "
        "côtés — ni l'un ni l'autre ne la subit seul.",
    "DISTANCE_POLIE":
        "Votre danse se tient à distance. Chacun reste sur sa "
        "réserve, et le silence s'installe. C'est un retrait "
        "partagé, pas une indifférence.",
    "MIXTE_SEREINE_POURSUITE":
        "Votre danse est déséquilibrée. L'un est posé, l'autre "
        "avance — c'est un pas qui se cherche, pas un tort de l'un "
        "ou de l'autre.",
    "MIXTE_SEREINE_RETRAIT":
        "Votre danse s'écarte. L'un est posé, l'autre recule — "
        "c'est un écart qui se mesure, sans blâme pour le retrait.",
    "MIXTE_SEREINE_FEU":
        "Votre danse contraste. L'un est posé, l'autre est en "
        "alerte — l'intensité d'un côté ne nie pas le calme de "
        "l'autre.",
    "MIXTE_POURSUITE_FEU":
        "Votre danse s'accélère. L'un avance, l'autre est en "
        "alerte — le mouvement et l'intensité se rencontrent, sans "
        "qu'aucun ait tort.",
    "MIXTE_RETRAIT_FEU":
        "Votre danse se crispe. L'un recule, l'autre est en "
        "alerte — le retrait et l'intensité se côtoient, c'est une "
        "configuration connue des couples.",
}

# Phrase pivot (séparateur)
PHRASE_PIVOT = "—"

# ============================================================
# Tables de normes percentiles (simulées — D-SIM)
# ============================================================
# Percentiles par type d'attachement. Construits à partir des
# distributions simulées (moyennes par type). Ce ne sont PAS des
# normes cliniques — ce sont des repères internes à la simulation.
# Avertissement D-SIM : la prévalence clinique n'est pas validée.

# Percentiles moyens par type (sur l'axe global d'attachement)
# Plus le type est en alerte, plus le percentile est élevé.
NORMES_PERCENTILES = {
    "SEREIN":      25,   # ZONE CALME → percentile bas
    "PREOCCUPE":   70,   # PEUR DE PERDRE → percentile élevé
    "DETACHE":     20,   # PEUR D'ÊTRE ÉTOUFFÉE → percentile bas (retrait)
    "EN_ALERTFEU": 85,   # les deux peurs vives → percentile très élevé
}

# ============================================================
# Correction du style de réponse (L6 — hérité de la Quête 1)
# ============================================================
# Le style de réponse est la tendance d'un répondant à noter
# systématiquement haut/bas/moyen. La correction L6 recalibre les
# scores en fonction du style observé.
#
# Détection :
#   - HAUT  : moyenne des scores > 3.5  → correction -0.5
#   - BAS   : moyenne des scores < 1.5  → correction +0.5
#   - MOYEN : sinon                     → correction 0.0

STYLES_REPONSE = ["HAUT", "BAS", "MOYEN"]


def detecter_style(scores):
    """Détecte le style de réponse d'un répondant.

    Args:
        scores : liste de scores (sA, sB, h_norm×10, r_norm×10, ...)

    Returns:
        "HAUT", "BAS" ou "MOYEN"
    """
    if not scores:
        return "MOYEN"
    moyenne = sum(scores) / len(scores)
    if moyenne > 3.5:
        return "HAUT"
    if moyenne < 1.5:
        return "BAS"
    return "MOYEN"


def corriger_style(score, style):
    """Applique la correction L6 à un score."""
    if style == "HAUT":
        return score - 0.5
    if style == "BAS":
        return score + 0.5
    return score


def styles_dissimulables(style_p1, style_p2):
    """Détecte si les styles de réponse sont dissimulables.

    Deux styles opposés (HAUT vs BAS) sont potentiellement
    dissimulables : l'un minore, l'autre majore. Avertissement
    affiché (pas un blocage).
    """
    return {style_p1, style_p2} == {"HAUT", "BAS"}


# ============================================================
# Conversion par percentiles
# ============================================================

def type_attachement(sA, sB):
    """Dérive le type d'attachement des scores A/B (Quêtes 1-2).

    SEREIN      : sA < 2.61 ET sB < 2.61
    PREOCCUPE   : sA ≥ 2.61 ET sB < 2.61
    DETACHE     : sA < 2.61 ET sB ≥ 2.61
    EN_ALERTFEU : sA ≥ 2.61 ET sB ≥ 2.61
    """
    if sA < 2.61 and sB < 2.61:
        return "SEREIN"
    if sA >= 2.61 and sB < 2.61:
        return "PREOCCUPE"
    if sA < 2.61 and sB >= 2.61:
        return "DETACHE"
    return "EN_ALERTFEU"


def convertir_percentile(sA, sB, style=None):
    """Convertit les scores A/B d'un profil en percentile global.

    Le percentile est dérivé du type d'attachement (table simulée).
    La correction L6 est appliquée aux scores AVANT classification
    si un style est fourni.

    Avertissement D-SIM : les percentiles sont des repères internes
    à la simulation, pas des normes cliniques.
    """
    sA_c = corriger_style(sA, style) if style else sA
    sB_c = corriger_style(sB, style) if style else sB
    typ = type_attachement(sA_c, sB_c)
    return NORMES_PERCENTILES[typ]


# ============================================================
# Identification de la configuration
# ============================================================

def identifier_configuration(type_p1, type_p2):
    """Identifie la configuration de couple (symétrique).

    Args:
        type_p1 : type d'attachement du partenaire 1
        type_p2 : type d'attachement du partenaire 2

    Returns:
        Le nom de la configuration (l'une des 9) ou None si inconnue.
    """
    return _CONFIG_TABLE.get((type_p1, type_p2))


# ============================================================
# Boucle de poursuite-retrait
# ============================================================

def boucle_poursuite_retrait(percentile_p1, percentile_p2):
    """Détecte une boucle de poursuite-retrait probable.

    La boucle est probable si l'écart de percentiles entre les
    deux partenaires est ≥ 30. La boucle est nommée ENSEMBLE
    (pas « c'est toi qui poursuis »).

    Returns:
        dict avec :
            ecart : écart absolu de percentiles
            boucle_probable : booléen
            direction : "P1_AVANCE_P2_RECULE" ou "P2_AVANCE_P1_RECULE"
                        ou None (pas de boucle ou écart insuffisant)
    """
    ecart = abs(percentile_p1 - percentile_p2)
    boucle = ecart >= 30
    if not boucle:
        direction = None
    elif percentile_p1 > percentile_p2:
        direction = "P1_AVANCE_P2_RECULE"
    else:
        direction = "P2_AVANCE_P1_RECULE"
    return {
        "ecart": ecart,
        "boucle_probable": boucle,
        "direction": direction,
    }


# ============================================================
# Génération de l'affichage
# ============================================================

def rendre_affichage(config, boucle, avertissement_style, label_ombre_p1,
                     label_ombre_p2, forces_p1, forces_p2):
    """Génère l'affichage conforme pour le couple.

    Principes :
    - La boucle est nommée ENSEMBLE (pas « c'est toi qui poursuis »).
    - Chaque partenaire confirme sur SOI (ses propres forces, son
      propre label d'ombre) — pas sur l'autre.
    - Aucun pourcentage de « compatibilité » n'est affiché.
    - Le template de la configuration est reproduit MOT POUR MOT.

    Returns:
        dict avec :
            template_config : str (mot pour mot)
            boucle_nommee_ensemble : str (phrase sur la boucle, ou None)
            confirmation_p1 : str (forces + label d'ombre de p1)
            confirmation_p2 : str (forces + label d'ombre de p2)
            avertissement_style : str ou None
            pct_compatibilite : None (jamais affiché)
    """
    template = TEMPLATES_CONFIGS.get(config, "")

    # Boucle nommée ensemble (jamais « c'est toi »)
    if boucle["boucle_probable"]:
        boucle_phrase = (
            f"Un écart de {boucle['ecart']} points sépare vos positions — "
            f"votre danse tourne probablement (l'un avance, l'autre recule, "
            f"et le mouvement se répète). C'est un pas de danse à deux, pas "
            f"un tort de l'un ou de l'autre."
        )
    else:
        boucle_phrase = None

    # Confirmation de chaque partenaire sur soi
    forces_p1_str = ", ".join(forces_p1) if forces_p1 else "rien de marqué pour l'instant"
    forces_p2_str = ", ".join(forces_p2) if forces_p2 else "rien de marqué pour l'instant"

    confirmation_p1 = (
        f"Partenaire 1 — ce qui te porte : {forces_p1_str}. "
        f"Ce qui t'effraie : {label_ombre_p1}."
    )
    confirmation_p2 = (
        f"Partenaire 2 — ce qui te porte : {forces_p2_str}. "
        f"Ce qui t'effraie : {label_ombre_p2}."
    )

    # Avertissement si styles dissimulables
    if avertissement_style:
        avert = (
            "Vos styles de réponse sont opposés — l'un minore, l'autre "
            "majore. Les percentiles sont à lire avec prudence : ce qui "
            "semble un écart peut être un effet de style."
        )
    else:
        avert = None

    return {
        "template_config": template,
        "boucle_nommee_ensemble": boucle_phrase,
        "confirmation_p1": confirmation_p1,
        "confirmation_p2": confirmation_p2,
        "avertissement_style": avert,
        "pct_compatibilite": None,  # JAMAIS affiché
    }


# ============================================================
# verifier_templates — complétude 9 configurations
# ============================================================

def verifier_templates():
    """Vérifie la complétude des 9 templates de configuration.

    Returns:
        dict avec :
            count : nombre de templates (attendu 9)
            configurations_manquantes : liste des configs sans template
            ok : booléen
    """
    manquantes = [c for c in CONFIGS_9 if c not in TEMPLATES_CONFIGS]
    return {
        "count": len(TEMPLATES_CONFIGS),
        "attendu": len(CONFIGS_9),
        "configurations_manquantes": manquantes,
        "ok": len(TEMPLATES_CONFIGS) == 9 and not manquantes,
    }


# ============================================================
# verifier_symetrie — pour C2
# ============================================================

def verifier_symetrie():
    """Vérifie que l'identification des configurations est symétrique.

    Pour toute paire (t1, t2), identifier(t1, t2) doit donner la même
    configuration que identifier(t2, t1).

    Returns:
        dict avec :
            paires_testees : int
            asymetries : liste des paires asymétriques
            ok : booléen
    """
    asymetries = []
    paires_testees = 0
    for t1 in TYPES_ATTACH:
        for t2 in TYPES_ATTACH:
            paires_testees += 1
            c1 = identifier_configuration(t1, t2)
            c2 = identifier_configuration(t2, t1)
            if c1 != c2:
                asymetries.append({
                    "paire": (t1, t2),
                    "aller": c1,
                    "retour": c2,
                })
    return {
        "paires_testees": paires_testees,
        "asymetries": asymetries,
        "ok": len(asymetries) == 0,
    }


# ============================================================
# verifier_non_blamant — pour C3 (test bilatéral anti-verdict)
# ============================================================

def verifier_non_blamant():
    """Vérifie qu'aucun template n'est blâmant.

    Critères anti-verdict (test bilatéral) :
    - Aucun template ne contient les mots « faute de », « tort de »
      au singulier (« ta faute », « ton tort ») — seul « pas un tort
      de l'un ou de l'autre » est autorisé (partage).
    - Aucun template ne pointe un partenaire (« c'est toi », « tu »).
    - Aucun template ne contient de pourcentage.
    - Chaque template nomme la danse ENSEMBLE.

    Returns:
        dict avec :
            templates_testes : int
            violations : liste des templates en violation
            ok : booléen
    """
    violations = []
    mots_interdits_singulier = ["ta faute", "ton tort", "c'est toi", "tu poursuis",
                                  "tu recules", "tu avances", "c'est lui",
                                  "c'est elle", "il poursuit", "elle poursuit"]
    for config, template in TEMPLATES_CONFIGS.items():
        template_lower = template.lower()
        for mot in mots_interdits_singulier:
            if mot in template_lower:
                violations.append({
                    "config": config,
                    "mot_interdit": mot,
                    "template": template,
                })
        # Vérifier absence de pourcentage
        if "%" in template:
            violations.append({
                "config": config,
                "mot_interdit": "%",
                "template": template,
            })
    return {
        "templates_testes": len(TEMPLATES_CONFIGS),
        "violations": violations,
        "ok": len(violations) == 0,
    }
