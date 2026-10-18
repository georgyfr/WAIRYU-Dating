# -*- coding: utf-8 -*-
"""WAIRYU — WTC-SM-Q4 « Nos deux rives » (RIO-14) : moteur du croisement.

SPEC SM-Q4-SPEC.md VERROUILLÉE (fondateur → pont par délégation, 18/10/2026) :
- A1 : niveau détresse = moyenne des 3 faces D de Q1 (SM-D1/D2/D3, 1 item/face)
       niveau charge = moyenne des 3 faces A de Q2 (SM-A1/A2/A3, 4 items/face)
       bornes Faible < 2,50 ≤ Moyen < 3,50 ≤ Élevé (cohérence Q2/Q3)
- A2 : zéro item nouveau — Q4 croise les sorties Q1 × Q2 uniquement
- A3 : percentiles (population de référence seed 42, 2 000 couples) pour les
       rangs — boucle probable si écart de percentiles ≥ 30 (avertissement,
       JAMAIS un verdict) ; avertissement si styles dissemblables
       (programme wairyu couple.txt ligne 262 : « Couple par PERCENTILES
       (correction du style de réponse) · boucle probable si écart de
       percentiles ≥ 30 · avertissement si styles dissemblables »)
- A4 : override crise héritée (pattern Q3-A3) — flag crise héritée
       (A2 ∨ SM-C1 ∨ H5) sur l'un des deux profils -> affichage routé 🔴
       (orientation « chemin le plus court »), configuration tracée mais
       pas déployée comme verdict de couple (D-CRISE)
- A5 : 9 noms de configurations mot pour mot (D-NOMENCLATURE)
Asymétrie structurelle (ligne 133 « Ma rive / ta rive asymétriques ») :
la détresse se lit sur Q1, la charge sur Q2, sans exception (anti-inversion).
Déterministe. Zéro item nouveau. 0 pas produit (prescription -> Q5)."""
from __future__ import annotations

# --- Agrégats d'entrée (A1 — sorties des packages contresignés) ---------------
FACES_DET = ("SM-D1", "SM-D2", "SM-D3")       # Q1-R3 (RIO-11) — 1 item/face
FACES_CHG = ("SM-A1", "SM-A2", "SM-A3")       # Q2 (RIO-12) — 4 items/face

VOIES_HERITEES = ("A2", "SM-C1", "H5")        # D-CRISE hérité (0 voie nouvelle)

# --- Bornes de niveau (A1 — verrouillées) --------------------------------------
SEUIL_FAIBLE = 2.50   # Faible < 2,50
SEUIL_ELEVE = 3.50    # < 3,50 Moyen — 3,50 Élevé (borne haute inclusive)

NIVEAUX = ("FAIBLE", "MOYEN", "ÉLEVÉ")

# Seuil de la boucle probable (ligne 262 — écart de percentiles ≥ 30)
SEUIL_BOUCLIE = 30.0
# Seuil de dissemblance des styles (INTERPRÉTÉ, D-PARAM : explicité, non sourcé)
# style d'une rive = écart-type de ses 3 scores de face ;
# dissemblables si écart de dispersion ≥ 1,00 pt (demi-niveau sur échelle 1-5)
SEUIL_STYLES = 1.00

# --- Les 9 configurations (A5 — noms mot pour mot, D-NOMENCLATURE) -------------
# (label, cellule détresse, cellule charge) — ordre du tableau §2 de la SPEC
TABLE_CONFIGS = (
    ("CALME DES DEUX RIVES", "FAIBLE", "FAIBLE"),
    ("VEILLE",               "FAIBLE", "MOYEN"),
    ("PORTE SEULE",          "FAIBLE", "ÉLEVÉ"),
    ("COURANT FORT",         "MOYEN",  "FAIBLE"),
    ("DEUX COURANTS",        "MOYEN",  "MOYEN"),
    ("RIVE QUI CÈDE",        "MOYEN",  "ÉLEVÉ"),
    ("TEMPÊTE",              "ÉLEVÉ",  "FAIBLE"),
    ("TEMPÊTE ET DIGUE",     "ÉLEVÉ",  "MOYEN"),
    ("DÉBORDEMENT",          "ÉLEVÉ",  "ÉLEVÉ"),
)
CONFIG_LABELS = tuple(c[0] for c in TABLE_CONFIGS)
_LOOKUP = {(c[1], c[2]): c[0] for c in TABLE_CONFIGS}

AFFICHAGE_CRISE = "CRISE_HÉRITÉE"

# D-STD-2 : seuil de conformité PAR configuration — 9 bornes distinctes,
# calibrées comme émo-Q4, marge sous la conformité attendue par géométrie
# (détresse 3 items σ_eff ≈ 0,35 : rangée Faible ≈ 92 %, Moyen ≈ 84 %,
# Élevé ≈ 99 % ; charge 12 items σ_eff ≈ 0,17 : > 99 % partout ;
# n = 50/groupe -> σ binomiale ≈ 2,6-5 pts, marge ≥ 1,7σ)
SEUILS_D_STD_2 = {
    "CALME DES DEUX RIVES": 82,
    "VEILLE": 83,
    "PORTE SEULE": 84,
    "COURANT FORT": 74,
    "DEUX COURANTS": 75,
    "RIVE QUI CÈDE": 76,
    "TEMPÊTE": 96,
    "TEMPÊTE ET DIGUE": 94,
    "DÉBORDEMENT": 98,
}


def niveau_de(score):
    """Niveau d'un score agrégé — bornes A1, tranchées de façon déterministe :
    < 2,50 FAIBLE · [2,50 ; 3,50[ MOYEN · ≥ 3,50 ÉLEVÉ."""
    if score < SEUIL_FAIBLE:
        return "FAIBLE"
    if score < SEUIL_ELEVE:
        return "MOYEN"
    return "ÉLEVÉ"


def configuration_de(niv_det, niv_chg):
    """Configuration = f(niveau détresse, niveau charge) — pure, positionnelle,
    asymétrique (anti-inversion : jamais de symétrie p1×p2)."""
    return _LOOKUP[(niv_det, niv_chg)]


# --- Diagnostics A3 (couche lecture — jamais un verdict) ----------------------

def percentile_de(score, population):
    """Rang d'un score dans la population de référence (percentile 0-100).
    Mid-rank (gère les ex-aequo) — déterministe, arrondi à 0,1."""
    pop = list(population)
    n = len(pop)
    inferieurs = sum(1 for v in pop if v < score)
    egaux = sum(1 for v in pop if v == score)
    return round(100.0 * (inferieurs + 0.5 * egaux) / n, 1)


def boucle_probable_de(pct_det, pct_chg):
    """Boucle probable (Coyne) : écart de percentiles ≥ 30 — avertissement,
    jamais un verdict (ligne 262)."""
    return abs(pct_det - pct_chg) >= SEUIL_BOUCLIE


def _ecart_type(vals):
    """Écart-type de population (ddof=0) — déterministe, sans numpy."""
    n = len(vals)
    mu = sum(vals) / n
    return (sum((v - mu) ** 2 for v in vals) / n) ** 0.5


def styles_de(scores_det, scores_chg):
    """Style d'une rive = dispersion (écart-type) de ses 3 scores de face."""
    return _ecart_type(list(scores_det)), _ecart_type(list(scores_chg))


def styles_dissemblables_de(sd_det, sd_chg):
    """Styles dissemblables si écart de dispersion ≥ 1,00 pt (D-PARAM)."""
    return abs(sd_det - sd_chg) >= SEUIL_STYLES


# --- Classification (A4 — override crise héritée) ------------------------------

def crise_heritee_de(voies_p1, voies_p2):
    """D-CRISE hérité : l'un des DEUX profils porte un flag
    (A2 ∨ SM-C1 ∨ H5) -> crise héritée du croisement. 0 voie nouvelle."""
    return any(v in VOIES_HERITEES for v in tuple(voies_p1) + tuple(voies_p2))


def classifier(scores_det, scores_chg, voies_p1=(), voies_p2=()):
    """Classification complète d'un couple — coeur du moteur Q4.
    scores_det : 3 scores de faces D (Q1) · scores_chg : 3 scores de faces A (Q2).
    L'affichage (affichage) est overridé 🔴 si crise héritée (A4) :
    la configuration reste TRACÉE (config_calculee) mais n'est PAS déployée."""
    niv_det = round(sum(scores_det) / len(scores_det), 2)
    niv_chg = round(sum(scores_chg) / len(scores_chg), 2)
    niveau_det = niveau_de(niv_det)
    niveau_chg = niveau_de(niv_chg)
    config = configuration_de(niveau_det, niveau_chg)
    crise = crise_heritee_de(voies_p1, voies_p2)
    return {
        "niv_det": niv_det, "niv_chg": niv_chg,
        "niveau_det": niveau_det, "niveau_chg": niveau_chg,
        "config_calculee": config,                      # tracée (traçabilité A4)
        "affichage": AFFICHAGE_CRISE if crise else config,  # override 🔴 (A4)
        "crise_heritee": crise,
        "template": TEMPLATE_CRISE if crise else TEMPLATES_CONFIG[config],
    }


# --- Templates (affichage — style constat, anti-verdict, « vous ») -------------
# Le template CALME porte la clause anti-fabrication §5.5 « rien à fabriquer »
# (C7 — zone calme affichée comme telle).

TEMPLATE_CRISE = (
    "Un des deux porte une crise active — ce croisement n'est pas déployé "
    "aujourd'hui : le chemin le plus court passe par l'orientation (palier "
    "🔴), pas par un verdict de couple. La configuration reste notée pour la "
    "suite du parcours."
)

TEMPLATES_CONFIG = {
    "CALME DES DEUX RIVES":
        "Les deux rives sont calmes — détresse contenue, charge tenable. "
        "C'est une zone calme : rien à fabriquer ici, le constat se suffit.",
    "VEILLE":
        "La charge s'installe pendant que la détresse reste contenue — "
        "l'aidant s'active en silence. C'est une veille, pas une alerte.",
    "PORTE SEULE":
        "La charge est élevée sans détresse déclarée — l'aidant porte seul. "
        "Le masquage est une possibilité à vérifier, pas un constat établi.",
    "COURANT FORT":
        "La détresse est réelle et l'aide n'est pas encore structurée — "
        "le courant porte l'un des deux avant que l'autre ait pu s'ancrer.",
    "DEUX COURANTS":
        "Détresse et charge cohabitent à niveau moyen — c'est la zone de "
        "travail ordinaire des couples sous suivi.",
    "RIVE QUI CÈDE":
        "La charge déborde pendant que la détresse reste moyenne — l'aidant "
        "bascule avant l'autre. La rive qui cède mérite d'être nommée.",
    "TEMPÊTE":
        "La détresse est élevée et la charge déclarée faible — aidant absent "
        "ou épuisé en silence. La tempête ne dit pas qui tient la digue.",
    "TEMPÊTE ET DIGUE":
        "La détresse est élevée et la charge tient à niveau moyen — le duo "
        "tient, sous tension. La digue existe, elle a un coût.",
    "DÉBORDEMENT":
        "Les deux rives cèdent à niveau élevé — vigilance maximale, les "
        "repères du couple sont saturés des deux côtés.",
}


# --- Vérificateurs de règles ---------------------------------------------------

_TABLE_SPEC = TABLE_CONFIGS  # la table de vérité Q4 = tableau §2 de la SPEC


def verifier_d_table():
    """D-TABLE : la table du code == la table de la SPEC (§2), mot pour mot,
    cellule par cellule (9/9)."""
    return {
        "ok": _TABLE_SPEC == TABLE_CONFIGS and len(set(CONFIG_LABELS)) == 9,
        "n_labels": len(set(CONFIG_LABELS)),
        "table": TABLE_CONFIGS,
    }


def verifier_d_confirmation():
    """D-CONFIRMATION (C2) : pureté + déterminisme + anti-inversion.
    - grille 3×3 : classifier sur les 9 cellules exactes == SPEC (9/9)
    - anti-inversion : échanger les rives doit donner la config de la cellule
      échangée — 6/6 cellules hors diagonale changent de nom, 3/3 diagonales
      stables (le classifieur ne « corrige » jamais une inversion)
    - pureté : deux exécutions sur les mêmes entrées -> résultats identiques."""
    cellules = [("FAIBLE", "FAIBLE"), ("FAIBLE", "MOYEN"), ("FAIBLE", "ÉLEVÉ"),
                ("MOYEN", "FAIBLE"), ("MOYEN", "MOYEN"), ("MOYEN", "ÉLEVÉ"),
                ("ÉLEVÉ", "FAIBLE"), ("ÉLEVÉ", "MOYEN"), ("ÉLEVÉ", "ÉLEVÉ")]
    grille = {}
    for det, chg in cellules:
        grille[(det, chg)] = configuration_de(det, chg)
    grille_ok = all(grille[(c[1], c[2])] == c[0] for c in TABLE_CONFIGS)

    flips = 0
    stables = 0
    for det, chg in cellules:
        cfg = configuration_de(det, chg)
        cfg_swap = configuration_de(chg, det)
        attendu_swap = _LOOKUP[(chg, det)]
        if cfg_swap != attendu_swap:
            return {"ok": False, "cause": "swap non positionnel"}
        if det == chg:
            stables += (cfg_swap == cfg)
        else:
            flips += (cfg_swap != cfg)
    anti_inversion_ok = (flips == 6 and stables == 3)

    entrees = ((2.0, 2.0, 2.0), (3.0, 3.5, 2.5))
    pur = (classifier(*entrees) == classifier(*entrees))

    return {"ok": bool(grille_ok and anti_inversion_ok and pur),
            "grille_9_9": bool(grille_ok),
            "anti_inversion": f"{flips} flips / {stables} stables",
            "purete": bool(pur)}
