# -*- coding: utf-8 -*-
"""
WTC-Q1 — Cœur calculaire de la Quête 1 « Comment je me raccroche »
==================================================================
WAIRYU Thérapie Couple — Package WTC-Q1 (échelle d'attachement adulte
originale WAIRYU, fiche RIO-01).

Construit mesuré : attachement adulte, deux dimensions indépendantes —
« peur de perdre » (anxiété d'abandon) et « peur de dépendre »
(évitement de l'intimité).
Références scientifiques publiques citées : Bowlby ; Brennan, Clark & Shaver.
L'instrument lui-même est original WAIRYU.

Ce module implémente STRICTEMENT la Spécification 2 (couches L1 à L4 et L7).
Aucun seuil, poids ou paramètre n'est modifiable : toutes les constantes
proviennent mot pour mot de la spécification. Les points d'ambiguïté
d'interprétation sont commentés inline ET repris dans la Section F du
rapport de validation (signalement seul — aucune correction libre).

Rôle : EXÉCUTEUR STRICT (Data Insight) — la vérité du système prime sur
son succès apparent.
"""

from __future__ import annotations

import math

import numpy as np

# ─────────────────────────────────────────────────────────────────────────────
# SPÉCIFICATION 1 — L'INSTRUMENT
# ─────────────────────────────────────────────────────────────────────────────
N_ITEMS = 18
ECHELLE_MIN, ECHELLE_MAX = 1, 4  # FAUX de moi=1 · Plutôt faux=2 · Plutôt vrai=3 · VRAI de moi=4

# Items inversés : score corrigé = 5 − réponse brute
ITEMS_INVERSES = (5, 15)

# 19e question de vigilance : non comptée dans les scores, réponse attendue = 3
VIGILANCE_ATTENDUE = 3

AXES = {
    "A": {"nom": "PEUR DE PERDRE", "items": (1, 2, 3, 4, 5, 6, 7, 8, 9)},
    "B": {"nom": "PEUR DE DÉPENDRE", "items": (10, 11, 12, 13, 14, 15, 16, 17, 18)},
}

FACES = {
    "A1": {"nom": "Vigie", "axe": "A", "items": (1, 2, 5)},
    "A2": {"nom": "Besoin de mots", "axe": "A", "items": (3, 4, 6)},
    "A3": {"nom": "Rumeur", "axe": "A", "items": (7, 8, 9)},
    "B1": {"nom": "Inconfort du près", "axe": "B", "items": (10, 11, 15)},
    "B2": {"nom": "Debout-seul", "axe": "B", "items": (12, 13, 14)},
    "B3": {"nom": "Porte fermée", "axe": "B", "items": (16, 17, 18)},
}


def face_de_item(item: int) -> str:
    """Retourne l'identifiant de la face contenant l'item (ex. 5 → 'A1')."""
    for fid, f in FACES.items():
        if item in f["items"]:
            return fid
    raise ValueError(f"Item inconnu : {item}")


# ─────────────────────────────────────────────────────────────────────────────
# SPÉCIFICATION 2 — PARAMÈTRES FIGÉS (placeholders — NE PAS MODIFIER)
# ─────────────────────────────────────────────────────────────────────────────
# [L2] SEM d'axe dérivé de la fiabilité cible (placeholder) : 0,65 × √(1 − 0,85)
SD_AXE = 0.65
FIDELITE_AXE = 0.85
SEM_AXE = SD_AXE * math.sqrt(1.0 - FIDELITE_AXE)  # ≈ 0.25175 (spec : ≈ 0,252)
Z90 = 1.64
CI90_DEMI = Z90 * SEM_AXE  # ≈ 0.41286

# [L4] SE de face : 0,72 × √(1 − 0,72).
# SIGNALÉ (Section F) : la formule donne 0,38105 ; la spec affiche « ≈ 0,379 ».
# La formule fait foi (aucun paramètre inventé).
SD_FACE = 0.72
FIDELITE_FACE = 0.72
SE_FACE = SD_FACE * math.sqrt(1.0 - FIDELITE_FACE)  # ≈ 0.38105

# [L7] Changement fiable (Jacobson & Truax)
SE_DIFF = math.sqrt(2.0) * SEM_AXE  # ≈ 0.35598 (spec : ≈ 0,356)
SEUIL_FIABLE = Z90 * SE_DIFF  # ≈ 0.58381 (spec : « ≈ 0,58 » — formule normative)
SEUIL_SUGGESTION = 0.41  # borne littérale de la spec (≈ 1,64 × SEM = 0,4129 — signalé Section F)

# [L3] Seuils de niveaux — Discrète < 1,80 ≤ Tranquille < 2,60 ≤ Vive < 3,20 ≤ Forte
SEUILS_NIVEAUX = (1.80, 2.60, 3.20)
NIVEAUX = ("Discrète", "Tranquille", "Vive", "Forte")

# [L1] Pénalités RQS
SEUIL_LINEARITE = 0.45  # écart-type des 18 scores corrigés < 0,45 → pénalité
PENALITE_LINEARITE = 20
SEUIL_CONTRADICTION = 2.5  # |corrigé(inversé) − moyenne des 2 autres items de sa face| ≥ 2,5
PENALITE_CONTRADICTION = 20  # UNE FOIS AU TOTAL, même si les 2 items inversés déclenchent
SEUIL_ITEM_RAPIDE_S = 2.0
NB_ITEMS_RAPIDES = 5
SEUIL_SESSION_S = 60.0
PENALITE_RYTHME = 25
PENALITE_VIGILANCE = 20

# [L1] Statuts : OK ≥ 85 · PRUDENCE 70-84 · INVALIDE < 70
SEUIL_STATUT_OK = 85
SEUIL_STATUT_PRUDENCE = 70


# ─────────────────────────────────────────────────────────────────────────────
# CORRECTION DES ITEMS
# ─────────────────────────────────────────────────────────────────────────────
def corrige(item: int, brut: int) -> int:
    """Score corrigé d'un item : 5 − brut pour les items inversés (5, 15), sinon brut."""
    return 5 - brut if item in ITEMS_INVERSES else brut


def corrige_tous(bruts: dict[int, int]) -> dict[int, int]:
    """Dictionnaire item → score corrigé pour les 18 items."""
    return {i: corrige(i, bruts[i]) for i in range(1, N_ITEMS + 1)}


# ─────────────────────────────────────────────────────────────────────────────
# [L1] RQS — QUALITÉ DE RÉPONSE (0-100)
# ─────────────────────────────────────────────────────────────────────────────
def calcule_rqs(
    bruts: dict[int, int],
    temps_items: dict[int, float],
    temps_session: float,
    reponse_vigilance: int,
) -> dict:
    """
    L1 — Qualité de réponse.

    Paramètres
    ----------
    bruts : dict item(1..18) → réponse brute (1-4)
    temps_items : dict item(1..18) → durée de réponse en secondes
    temps_session : durée totale de session en secondes.
        AMBIGUÏTÉ signalée (Section F) : la spec ne précise pas si la question
        de vigilance (19e) compte dans la session. Choix d'implémentation :
        session = somme des 19 questions (18 items + vigilance).
    reponse_vigilance : réponse à la 19e question (attendu : 3).

    Retour
    ------
    dict : détail des 4 contrôles, pénalités, RQS, statut.
    """
    details: list[str] = []
    cor = corrige_tous(bruts)

    # (a) Anti-linéarité — écart-type des 18 scores corrigés < 0,45 → −20
    #     AMBIGUÏTÉ signalée (Section F) : ddof non précisé dans la spec.
    #     Choix : ddof=1 (écart-type d'échantillon). Aucun impact sur C1-C4 :
    #     les linéaires restent sous 0,45 dans les deux conventions.
    valeurs = np.array([cor[i] for i in range(1, N_ITEMS + 1)], dtype=float)
    et_corriges = float(np.std(valeurs, ddof=1))
    pen_linearite = et_corriges < SEUIL_LINEARITE
    if pen_linearite:
        details.append(
            f"(a) anti-linéarité : écart-type des 18 corrigés = {et_corriges:.3f} "
            f"< {SEUIL_LINEARITE} → -{PENALITE_LINEARITE}"
        )
    else:
        details.append(
            f"(a) anti-linéarité : écart-type des 18 corrigés = {et_corriges:.3f} "
            f">= {SEUIL_LINEARITE} → pas de pénalité"
        )

    # (b) Anti-contradiction — pour CHACUN des 2 items inversés :
    #     |corrigé(inversé) − moyenne des 2 autres items de sa face| ≥ 2,5
    #     → pénalité UNE SEULE FOIS au total (spécification explicite).
    contradictions: list[dict] = []
    for item_inv in sorted(ITEMS_INVERSES):
        fid = face_de_item(item_inv)
        autres = [i for i in FACES[fid]["items"] if i != item_inv]
        # Les 2 « autres » items de la face ne sont pas inversés → brut = corrigé.
        moyenne_autres = sum(bruts[i] for i in autres) / len(autres)
        ecart = abs(cor[item_inv] - moyenne_autres)
        declenche = ecart >= SEUIL_CONTRADICTION
        contradictions.append(
            {
                "item": item_inv,
                "face": fid,
                "corrige": cor[item_inv],
                "moyenne_autres": round(moyenne_autres, 3),
                "ecart": round(ecart, 3),
                "declenche": bool(declenche),
            }
        )
    pen_contradiction = any(c["declenche"] for c in contradictions)
    if pen_contradiction:
        items_decl = ", ".join(str(c["item"]) for c in contradictions if c["declenche"])
        details.append(
            f"(b) anti-contradiction : déclenchée sur item(s) {items_decl} "
            f"→ -{PENALITE_CONTRADICTION} (une fois au total)"
        )
    else:
        details.append("(b) anti-contradiction : aucun écart >= 2,5 → pas de pénalité")

    # (c) Rythme — (≥ 5 items < 2,0 s) OU (session < 60 s) → −25
    nb_rapides = sum(1 for t in temps_items.values() if t < SEUIL_ITEM_RAPIDE_S)
    rythme_items = nb_rapides >= NB_ITEMS_RAPIDES
    rythme_session = temps_session < SEUIL_SESSION_S
    pen_rythme = rythme_items or rythme_session
    if pen_rythme:
        cause = []
        if rythme_items:
            cause.append(f"{nb_rapides} items < {SEUIL_ITEM_RAPIDE_S} s")
        if rythme_session:
            cause.append(f"session {temps_session:.1f} s < {SEUIL_SESSION_S:.0f} s")
        details.append(f"(c) rythme : {' OU '.join(cause)} → -{PENALITE_RYTHME}")
    else:
        details.append(
            f"(c) rythme : {nb_rapides} item(s) < {SEUIL_ITEM_RAPIDE_S} s ; "
            f"session {temps_session:.1f} s → pas de pénalité"
        )

    # (d) Vigilance ratée (réponse ≠ 3) → −20
    vigilance_ok = reponse_vigilance == VIGILANCE_ATTENDUE
    pen_vigilance = not vigilance_ok
    if pen_vigilance:
        details.append(
            f"(d) vigilance : réponse {reponse_vigilance} ≠ {VIGILANCE_ATTENDUE} "
            f"→ -{PENALITE_VIGILANCE}"
        )
    else:
        details.append(
            f"(d) vigilance : réponse {reponse_vigilance} = {VIGILANCE_ATTENDUE} → pas de pénalité"
        )

    total_penalites = (
        (PENALITE_LINEARITE if pen_linearite else 0)
        + (PENALITE_CONTRADICTION if pen_contradiction else 0)
        + (PENALITE_RYTHME if pen_rythme else 0)
        + (PENALITE_VIGILANCE if pen_vigilance else 0)
    )
    rqs = max(0, 100 - total_penalites)
    if rqs >= SEUIL_STATUT_OK:
        statut = "OK"
    elif rqs >= SEUIL_STATUT_PRUDENCE:
        statut = "PRUDENCE"
    else:
        statut = "INVALIDE"

    return {
        "et_corriges": round(et_corriges, 4),
        "contradictions": contradictions,
        "nb_items_rapides": nb_rapides,
        "temps_session": round(temps_session, 2),
        "vigilance_ok": bool(vigilance_ok),
        "penalites": {
            "linearite": bool(pen_linearite),
            "contradiction": bool(pen_contradiction),
            "rythme": bool(pen_rythme),
            "vigilance": bool(pen_vigilance),
        },
        "total_penalites": total_penalites,
        "details": details,
        "rqs": rqs,
        "statut": statut,
    }


# ─────────────────────────────────────────────────────────────────────────────
# [L2] SCORES — faces, axes, CI90
# ─────────────────────────────────────────────────────────────────────────────
def scores_faces(corriges: dict[int, int]) -> dict[str, float]:
    """Score de chaque face = moyenne des 3 items corrigés, arrondi à 2 décimales."""
    out = {}
    for fid, f in FACES.items():
        moyenne = sum(corriges[i] for i in f["items"]) / 3.0
        out[fid] = round(moyenne, 2)
    return out


def scores_axes(corriges: dict[int, int]) -> dict[str, float]:
    """Score de chaque axe = moyenne des 9 items corrigés, arrondi à 2 décimales.

    CHOIX signalé (Section F) : l'arrondi à 2 décimales (imposé par la spec :
    « Scores (2 décimales) ») est appliqué AVANT les seuils L3, afin que le
    rapport et le calcul soient strictement identiques.
    """
    out = {}
    for aid, a in AXES.items():
        moyenne = sum(corriges[i] for i in a["items"]) / 9.0
        out[aid] = round(moyenne, 2)
    return out


def bornes_ci90(score_axe: float) -> tuple[float, float]:
    """CI90 = score ± 1,64 × SEM (bornes arrondies à 2 décimales pour l'affichage
    et pour le test de chevauchement — cohérence rapport/calcul)."""
    return round(score_axe - CI90_DEMI, 2), round(score_axe + CI90_DEMI, 2)


# ─────────────────────────────────────────────────────────────────────────────
# [L3] LECTURE PAR AXE — 4 niveaux à seuils fixes + frontières
# ─────────────────────────────────────────────────────────────────────────────
def niveau_ponctuel(score: float) -> str:
    """Niveau d'un score ponctuel : Discrète < 1,80 ≤ Tranquille < 2,60 ≤ Vive < 3,20 ≤ Forte."""
    if score < SEUILS_NIVEAUX[0]:
        return NIVEAUX[0]
    if score < SEUILS_NIVEAUX[1]:
        return NIVEAUX[1]
    if score < SEUILS_NIVEAUX[2]:
        return NIVEAUX[2]
    return NIVEAUX[3]


def niveaux_touches(bas: float, haut: float) -> list[str]:
    """Liste ordonnée (du plus bas au plus haut) des niveaux touchés par
    l'intervalle [bas ; haut].

    Un niveau est touché si l'intervalle intersecte sa plage :
      Discrète   : ]-∞ ; 1,80[   → touché ssi bas < 1,80
      Tranquille : [1,80 ; 2,60[ → touché ssi haut >= 1,80 et bas < 2,60
      Vive       : [2,60 ; 3,20[ → touché ssi haut >= 2,60 et bas < 3,20
      Forte      : [3,20 ; +∞[   → touché ssi haut >= 3,20
    """
    touches: list[str] = []
    if bas < SEUILS_NIVEAUX[0]:
        touches.append(NIVEAUX[0])
    if haut >= SEUILS_NIVEAUX[0] and bas < SEUILS_NIVEAUX[1]:
        touches.append(NIVEAUX[1])
    if haut >= SEUILS_NIVEAUX[1] and bas < SEUILS_NIVEAUX[2]:
        touches.append(NIVEAUX[2])
    if haut >= SEUILS_NIVEAUX[2]:
        touches.append(NIVEAUX[3])
    return touches


def lecture_L3(score_axe: float, ci_bas: float, ci_haut: float) -> dict:
    """Lecture L3 d'un axe.

    - Si l'intervalle CI90 ne chevauche aucun seuil → lecture NIVEAU ponctuelle.
    - Sinon → lecture FRONTIÈRE « entre X et Y » + DÉCISION CONSERVATRICE :
      le niveau le plus bas touché est retenu pour toute décision en aval.
      AMBIGUÏTÉ signalée (Section F) : si l'intervalle chevauche DEUX seuils
      (3 niveaux touchés), la spec ne définit la frontière que « entre X et Y ».
      Choix : frontière entre le niveau le plus bas et le plus haut touchés,
      décision conservatrice = niveau le plus bas.
    """
    touches = niveaux_touches(ci_bas, ci_haut)
    if not touches:
        # Impossible mathématiquement (l'intervalle contient le score) — garde-fou.
        raise ValueError(f"Intervalle invalide : [{ci_bas} ; {ci_haut}]")
    if len(touches) == 1:
        return {
            "type": "NIVEAU",
            "lecture": touches[0],
            "touches": list(touches),
            "niveau_conservateur": touches[0],
        }
    return {
        "type": "FRONTIERE",
        "lecture": f"entre {touches[0]} et {touches[-1]}",
        "touches": list(touches),
        "niveau_conservateur": touches[0],  # décision conservatrice : le plus bas
    }


# ─────────────────────────────────────────────────────────────────────────────
# [L4] FACES DOMINANTES (par axe)
# ─────────────────────────────────────────────────────────────────────────────
def lecture_L4(faces_scores: dict[str, float], axe: str) -> dict:
    """
    Ordonne les 3 faces de l'axe ; écart = face1 − face2 ;
    seuil de significativité = 1,64 × √(SE1² + SE2²) avec SE_face = 0,72 × √(1 − 0,72).
    écart ≥ seuil → hiérarchie déclarable ; sinon → « nuage ».

    Égalités de scores : tri stable, départage par identifiant de face (A1 < A2 < A3).
    """
    fids = [fid for fid, f in FACES.items() if f["axe"] == axe]
    ordre = sorted(fids, key=lambda fid: (-faces_scores[fid], fid))
    f1, f2 = ordre[0], ordre[1]
    ecart = round(faces_scores[f1] - faces_scores[f2], 2)
    seuil = round(Z90 * math.sqrt(SE_FACE**2 + SE_FACE**2), 4)  # ≈ 0.8837
    declarable = ecart >= seuil
    return {
        "ordre": ordre,
        "face1": f1,
        "face2": f2,
        "ecart_1_2": ecart,
        "seuil": seuil,
        "hierarchie_declarable": bool(declarable),
        "lecture": "hiérarchie déclarable" if declarable else "nuage",
    }


# ─────────────────────────────────────────────────────────────────────────────
# [L7] CHANGEMENT FIABLE LONGITUDINAL (Jacobson & Truax) — hors périmètre des
# critères C1-C4 (pas de données longitudinales ici), implémenté pour complétude.
# ─────────────────────────────────────────────────────────────────────────────
def changement_fiable(delta: float) -> dict:
    """
    SE_diff = √2 × SEM ≈ 0,356.
    |Δ| ≥ 1,64 × SE_diff (≈ 0,58) → FIABLE
    0,41 ≤ |Δ| < 1,64 × SE_diff   → SUGGESTION
    |Δ| < 0,41                    → BRUIT
    (La borne FIABLE utilise la FORMULE 1,64 × SE_diff = 0,58381 — signalé Section F.)
    """
    d = abs(delta)
    if d >= SEUIL_FIABLE:
        verdict = "FIABLE"
    elif d >= SEUIL_SUGGESTION:
        verdict = "SUGGESTION"
    else:
        verdict = "BRUIT"
    return {
        "delta": round(delta, 4),
        "abs_delta": round(d, 4),
        "seuil_fiable": round(SEUIL_FIABLE, 4),
        "seuil_suggestion": SEUIL_SUGGESTION,
        "verdict": verdict,
    }


# ─────────────────────────────────────────────────────────────────────────────
# ALPHA DE CRONBACH OBSERVÉ (Section C du rapport — indicateur, JAMAIS
# substitué aux placeholders de la spécification).
# Calculé sur les items CORRIGÉS (clés inversées appliquées) — sur items bruts
# non retournés, les items 5/15 corréleraient négativement et l'alpha serait
# artéfactuel (signalé Section F).
# ─────────────────────────────────────────────────────────────────────────────
def cronbach_alpha(matrice_items: np.ndarray) -> float:
    """
    matrice_items : np.ndarray (n répondants × k items), items déjà corrigés/clés.
    alpha = (k/(k-1)) × (1 − Σ var(item_i) / var(score total)), variances d'échantillon (ddof=1).
    """
    mat = np.asarray(matrice_items, dtype=float)
    n, k = mat.shape
    if n < 2 or k < 2:
        return float("nan")
    var_items = mat.var(axis=0, ddof=1)
    var_total = mat.sum(axis=1).var(ddof=1)
    if var_total == 0:
        return float("nan")
    return float((k / (k - 1.0)) * (1.0 - var_items.sum() / var_total))
