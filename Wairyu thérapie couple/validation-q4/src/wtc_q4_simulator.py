"""
WTC-Q4 — Simulateur de la Quête 4 « Notre danse »
===================================================

2×400 profils croisés (800 paires), répartis en 9 groupes par
configuration connue (vérification à vérité cachée — C1).
Ré-implémentation indépendante `configuration_vraie` pour la
vérité croisée C2.

D-STD recalculé d'emblée : les bornes de faisabilité sont calculées
AVANT que les critères ne soient posés (leçon D-Q3-J).

Avertissement D-SIM : résultats issus de simulations (seed 42) —
la mécanique est validée, pas la prévalence clinique.
"""

import numpy as np

import wtc_q4_core as core

SEED = 42
_RNG = np.random.default_rng(SEED)


# ============================================================
# Génération d'un partenaire
# ============================================================
# Profils cohérents avec les Quêtes 1-3 :
# - sA, sB : scores d'attachement (axes A/B)
# - h_norm, r_norm : normes d'hypervigilance et de retrait (Quête 2)
# - forces : liste de forces (Quête 3, 0-2 forces)
# - label_ombre : "ZONE CALME" / "PEUR DE PERDRE" / "PEUR D'ÊTRE ÉTOUFFÉE"
# - style : "HAUT" / "BAS" / "MOYEN"

# Moyennes par type d'attachement (muA, muB)
_TYPE_PARAMS = {
    "SEREIN":      (2.0, 2.0),
    "PREOCCUPE":   (3.2, 2.1),
    "DETACHE":     (2.1, 3.3),
    "EN_ALERTFEU": (3.3, 3.2),
}

# Forces possibles par type (simplifié — la Quête 3 fait la sélection
# réelle ; ici on tire dans une banque cohérente avec le type)
_FORCES_PAR_TYPE = {
    "SEREIN":      ["F4", "F6"],      # constance, tendresse (assise posée)
    "PREOCCUPE":   ["F1", "F3"],      # port, vigilance (engagement)
    "DETACHE":     ["F2"],            # assise (autonomie)
    "EN_ALERTFEU": ["F3", "F5"],      # vigilance, légèreté (gestion du feu)
}


def _gen_partenaire(type_att):
    """Génère un partenaire d'un type d'attachement donné.

    Args:
        type_att : "SEREIN", "PREOCCUPE", "DETACHE" ou "EN_ALERTFEU"

    Returns:
        dict profil (cohérent avec les Quêtes 1-3)
    """
    muA, muB = _TYPE_PARAMS[type_att]
    sA = float(np.clip(_RNG.normal(muA, 0.5), 0.0, 4.0))
    sB = float(np.clip(_RNG.normal(muB, 0.5), 0.0, 4.0))

    # Forcer le type (les tirages peuvent dériver) — on recycle sA/sB
    # dans la plage du type attendu
    if type_att == "SEREIN":
        sA = min(sA, 2.6)
        sB = min(sB, 2.6)
    elif type_att == "PREOCCUPE":
        sA = max(sA, 2.61)
        sB = min(sB, 2.6)
    elif type_att == "DETACHE":
        sA = min(sA, 2.6)
        sB = max(sB, 2.61)
    elif type_att == "EN_ALERTFEU":
        sA = max(sA, 2.61)
        sB = max(sB, 2.61)

    # h_norm, r_norm (Quête 2)
    if type_att == "EN_ALERTFEU":
        h_norm = float(np.clip(_RNG.normal(0.55, 0.15), 0.0, 1.0))
    elif type_att == "PREOCCUPE":
        h_norm = float(np.clip(_RNG.normal(0.50, 0.15), 0.0, 1.0))
    else:
        h_norm = float(np.clip(_RNG.normal(0.20, 0.15), 0.0, 1.0))

    if type_att == "DETACHE":
        r_norm = float(np.clip(_RNG.normal(0.55, 0.15), 0.0, 1.0))
    else:
        r_norm = float(np.clip(_RNG.normal(0.25, 0.15), 0.0, 1.0))

    # Label d'ombre (Quête 2)
    if sA < 2.61 and sB < 2.61:
        label_ombre = "ZONE CALME"
    elif sA >= 2.61 and sB < 2.61:
        label_ombre = "PEUR DE PERDRE"
    elif sA < 2.61 and sB >= 2.61:
        label_ombre = "PEUR D'ÊTRE ÉTOUFFÉE"
    else:
        label_ombre = "PEUR DE PERDRE"  # EN_ALERTFEU — on garde PEUR DE PERDRE par convention

    # Forces (Quête 3) — tirage de 1-2 forces dans la banque du type
    forces_possibles = _FORCES_PAR_TYPE[type_att]
    n_forces = int(_RNG.integers(1, 3))  # 1 ou 2
    forces = list(_RNG.choice(forces_possibles,
                              size=min(n_forces, len(forces_possibles)),
                              replace=False))

    # Style de réponse (L6) — la plupart MOYEN, quelques HAUT/BAS
    style_roll = _RNG.random()
    if style_roll < 0.15:
        style = "HAUT"
    elif style_roll < 0.30:
        style = "BAS"
    else:
        style = "MOYEN"

    return {
        "sA": sA, "sB": sB,
        "h_norm": h_norm, "r_norm": r_norm,
        "label_ombre": label_ombre,
        "forces": forces,
        "style": style,
        "type_attendu": type_att,
    }


# ============================================================
# Génération des paires par configuration connue
# ============================================================
# 9 configurations × ~89 paires = 800 paires (2×400 profils)

_CONFIG_PAIRES = {
    "BASE_SEREINE":            [("SEREIN", "SEREIN")],
    "DANSE_QUI_TOURNE":        [("PREOCCUPE", "DETACHE"), ("DETACHE", "PREOCCUPE")],
    # NOTE D-Q4-1 (corrigé) : FEU_CROISE = 2×EN_ALERTFEU ou 2×PREOCCUPE
    # (les paires mixtes PREOCCUPE×EN_ALERTFEU vont à MIXTE_POURSUITE_FEU)
    "FEU_CROISE":              [("EN_ALERTFEU", "EN_ALERTFEU"),
                                 ("PREOCCUPE", "PREOCCUPE")],
    "DISTANCE_POLIE":          [("DETACHE", "DETACHE")],
    "MIXTE_SEREINE_POURSUITE": [("SEREIN", "PREOCCUPE"), ("PREOCCUPE", "SEREIN")],
    "MIXTE_SEREINE_RETRAIT":   [("SEREIN", "DETACHE"), ("DETACHE", "SEREIN")],
    "MIXTE_SEREINE_FEU":       [("SEREIN", "EN_ALERTFEU"), ("EN_ALERTFEU", "SEREIN")],
    "MIXTE_POURSUITE_FEU":     [("PREOCCUPE", "EN_ALERTFEU"), ("EN_ALERTFEU", "PREOCCUPE")],
    "MIXTE_RETRAIT_FEU":       [("DETACHE", "EN_ALERTFEU"), ("EN_ALERTFEU", "DETACHE")],
}


def gen_paires(n_total=800):
    """Génère n_total paires réparties sur les 9 configurations.

    Returns:
        liste de dicts {config_attendue, p1, p2}
    """
    paires = []
    n_par_config = n_total // 9
    reste = n_total - n_par_config * 9

    for i, config in enumerate(core.CONFIGS_9):
        n = n_par_config + (1 if i < reste else 0)
        paires_type = _CONFIG_PAIRES[config]
        for j in range(n):
            type_p1, type_p2 = paires_type[j % len(paires_type)]
            p1 = _gen_partenaire(type_p1)
            p2 = _gen_partenaire(type_p2)
            paires.append({
                "id": f"{config}_{j}",
                "config_attendue": config,
                "p1": p1,
                "p2": p2,
            })
    return paires


# ============================================================
# Ré-implémentation indépendante pour la vérité croisée C2
# ============================================================

def configuration_vraie(p1, p2):
    """Ré-implémentation indépendante de identifier_configuration.

    Pour la vérité croisée C2 : toute divergence avec le moteur
    = bug démontré.
    """
    # Dérivation indépendante du type (même logique que le moteur)
    def _type(sA, sB):
        if sA < 2.61 and sB < 2.61:
            return "SEREIN"
        if sA >= 2.61 and sB < 2.61:
            return "PREOCCUPE"
        if sA < 2.61 and sB >= 2.61:
            return "DETACHE"
        return "EN_ALERTFEU"

    # Correction L6 indépendante
    def _corrige(score, style):
        if style == "HAUT":
            return score - 0.5
        if style == "BAS":
            return score + 0.5
        return score

    sA1 = _corrige(p1["sA"], p1.get("style"))
    sB1 = _corrige(p1["sB"], p1.get("style"))
    sA2 = _corrige(p2["sA"], p2.get("style"))
    sB2 = _corrige(p2["sB"], p2.get("style"))

    t1 = _type(sA1, sB1)
    t2 = _type(sA2, sB2)

    # Table indépendante (reconstruite — pas d'import du core)
    # NOTE D-Q4-1 (corrigé) : pas de duplication des clés PREOCCUPE×EN_ALERTFEU.
    table = {
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
    return table.get((t1, t2))


def percentile_vrai(p):
    """Ré-implémentation indépendante de convertir_percentile."""
    def _corrige(score, style):
        if style == "HAUT":
            return score - 0.5
        if style == "BAS":
            return score + 0.5
        return score

    sA = _corrige(p["sA"], p.get("style"))
    sB = _corrige(p["sB"], p.get("style"))

    if sA < 2.61 and sB < 2.61:
        return 25
    if sA >= 2.61 and sB < 2.61:
        return 70
    if sA < 2.61 and sB >= 2.61:
        return 20
    return 85


# ============================================================
# Données simulées (800 paires, seed 42)
# ============================================================
# Construites au chargement du module — déterministes.

def generer_donnees(n=800):
    """Génère les données simulées (appelable pour D-STD recalculé)."""
    return gen_paires(n)


# Construction au chargement
PAIRES = generer_donnees(800)


def resume_configs():
    """Retourne un dict {config: effectif} des paires attendues."""
    resume = {c: 0 for c in core.CONFIGS_9}
    for paire in PAIRES:
        resume[paire["config_attendue"]] += 1
    return resume


def tous_les_profils():
    """Retourne la liste plate des profils (2 × 400 = 800 profils)."""
    tous = []
    for paire in PAIRES:
        for qui, p in [("p1", paire["p1"]), ("p2", paire["p2"])]:
            p_copy = dict(p)
            p_copy["config_attendue"] = paire["config_attendue"]
            p_copy["role"] = qui
            p_copy["id"] = paire["id"] + "_" + qui
            tous.append(p_copy)
    return tous
