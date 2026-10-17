# -*- coding: utf-8 -*-
"""WAIRYU — WTC-SM-Q2 « Ce que je porte pour toi » (RIO-12) : moteur de l'aidant.

Portage verrouillé (SM-Q2-VERROUILLAGE + arbitrage Q2-C3-ARBITRAGE) :
- 6 faces × 4 items = 24 items (A1/A2/A3 héritées de Q1, B1/B2/B3 NOUVELLES —
  ancrage « La frontière co-étiquetée », programme wairyu couple.txt ligne 133)
- Classification n_high sur les faces A (seuil 3,50) ; faces B descriptives,
  NON classifiantes en Q2
- D-CRISE intégrale (court-circuit AVANT l'arbre) : A2 ≥ 4.0 (Q2, voie
  nouvelle) ∨ SM-C1 ≥ 4.0 (héritée Q1) ∨ H5 (héritée RIO-02) — filet
  3919 (violences conjugales) / 3114 (détresse psychiatrique)
- D-GÉOMÉTRIE : σ_item = 0.60 (D-PARAM), σ_eff = 0.60/√4 = 0.30,
  3σ_eff = 0.90 ; bande [3.10, 4.90] exclue du décompte C3 sur les DEUX voies
  score (SM-C1 héritée ET A2 nouvelle — l'arbitrage a restauré la bande Q1-R3
  sur SM-C1) ; crise_vraie ancrée sur le paramètre vrai (μ), pas sur le groupe
- SM-C1 (4 items) est une voie HÉRITÉE hors instrument Q2 : le simulateur la
  fournit, le moteur la lit (lecture héritée instrument Q1 citée)."""
from __future__ import annotations

FACES_A = ["SM-A1", "SM-A2", "SM-A3"]   # Axe A « La charge que je porte »
FACES_B = ["SM-B1", "SM-B2", "SM-B3"]   # Axe B « La frontière que je garde »
FACES = FACES_A + FACES_B               # instrument Q2 : 6 faces
N_ITEMS_PAR_FACE = 4
ITEMS_TOTAL = len(FACES) * N_ITEMS_PAR_FACE  # 24

VOIE_HERITEE = "SM-C1"  # voie héritée de Q1 (hors instrument Q2, 4 items)

SEUIL_MID = 3.00        # D-ÉCHELLE (milieu de l'échelle 5 points)
SEUIL_CLASSIF = 3.50    # n_high (verrouillage)
SEUIL_CRISE = 4.00      # D-CRISE (hérité Q1 — 3 voies)

SIGMA_ITEM = 0.60       # D-PARAM
SIGMA_EFF = SIGMA_ITEM / (N_ITEMS_PAR_FACE ** 0.5)  # 0.30
TROIS_SIGMA = 3 * SIGMA_EFF                         # 0.90
BANDE_MIN = SEUIL_CRISE - TROIS_SIGMA               # 3.10
BANDE_MAX = SEUIL_CRISE + TROIS_SIGMA               # 4.90

ECHELLE_5PTS = {1: "JAMAIS", 2: "RAREMENT", 3: "PARFOIS", 4: "SOUVENT", 5: "TOUT LE TEMPS"}

CLASSE_FACE = {"SM-A1": "ÉPUISÉ", "SM-A2": "SURIMPLIQUÉ", "SM-A3": "HOSTILE"}
CLASSIFICATIONS = ["STABLE", "ÉPUISÉ", "SURIMPLIQUÉ", "HOSTILE", "MIXTE"]
LABELS_MOTEUR = set(CLASSIFICATIONS) | {"CRISE", "CRISIS_MODE"}

FILET = "3919 (violences conjugales) / 3114 (détresse psychiatrique)"


def moyenne_face(rep, face):
    """Moyenne des 4 items d'une face (A, B) ou de la voie héritée SM-C1.
    Déterministe : aucune lecture implicite, absence → 3.0 (milieu)."""
    vals = []
    for i in range(1, N_ITEMS_PAR_FACE + 1):
        v = rep.get(f"{face}-{i}")
        if v is not None:
            vals.append(float(v))
    return round(sum(vals) / len(vals), 2) if vals else 3.0


def scores_faces(rep):
    return {f: moyenne_face(rep, f) for f in FACES}


def n_high_a(s_faces):
    """Verrouillage n_high : nombre de faces A ≥ 3,50. Les B ne comptent pas."""
    return sum(1 for f in FACES_A if s_faces[f] >= SEUIL_CLASSIF)


def crise_de_scores(a2_score, sm_c1_score, h5_actif):
    """D-CRISE intégrale — fonction pure (test de frontière 3,99/4,00 exigé).
    Ordre des voies : A2 (Q2) puis SM-C1 (héritée) puis H5 (héritée)."""
    if a2_score >= SEUIL_CRISE:
        return {"crise": True, "voie": "A2", "mode": "CRISIS_MODE",
                "cause": "A2 ≥ 4.0 (surimplication sévère — contrôle coercitif potentiel)",
                "filet": FILET, "a2_score": a2_score, "sm_c1_score": sm_c1_score}
    if sm_c1_score >= SEUIL_CRISE:
        return {"crise": True, "voie": "SM-C1", "mode": "CRISIS_MODE",
                "cause": "SM-C1 ≥ 4.0 (contrôle coercitif — voie héritée Q1)",
                "filet": FILET, "a2_score": a2_score, "sm_c1_score": sm_c1_score}
    if h5_actif:
        return {"crise": True, "voie": "H5", "mode": "CRISIS_MODE",
                "cause": "H5 hérité actif (RIO-02 — item de sécurité)",
                "filet": FILET, "a2_score": a2_score, "sm_c1_score": sm_c1_score}
    return {"crise": False, "voie": None, "mode": "NORMAL",
            "cause": None, "filet": None,
            "a2_score": a2_score, "sm_c1_score": sm_c1_score}


def detecter_crise(profil):
    a2 = moyenne_face(profil, "SM-A2")
    sm_c1 = moyenne_face(profil, VOIE_HERITEE)
    return crise_de_scores(a2, sm_c1, bool(profil.get("h5_actif", False)))


def classifier(profil):
    """5 labels + CRISE. D-CRISE testé EN PREMIER (court-circuit).
    Sinon n_high sur faces A : 0 → STABLE · 1 → classe de la face · ≥2 → MIXTE."""
    if detecter_crise(profil)["crise"]:
        return "CRISE"
    s = scores_faces(profil)
    n = n_high_a(s)
    if n == 0:
        return "STABLE"
    if n == 1:
        for f in FACES_A:
            if s[f] >= SEUIL_CLASSIF:
                return CLASSE_FACE[f]
    return "MIXTE"


def est_dans_bande_exclue(sm_c1_score, a2_score):
    """D-GÉOMÉTRIE : bande [3.10, 4.90] sur les scores des DEUX voies score.
    Un profil est « dans bande » si AU MOINS UN score de voie y figure
    (portage fidèle de Q1-R3 où la bande portait sur SM-C1 seule)."""
    return (BANDE_MIN <= sm_c1_score <= BANDE_MAX) or (BANDE_MIN <= a2_score <= BANDE_MAX)


def verifier_d_echelle():
    return {"seuils": {"MID": SEUIL_MID, "CLASSIF": SEUIL_CLASSIF, "CRISE": SEUIL_CRISE},
            "ok": True}


def verifier_d_verite():
    """D-VÉRITÉ : inventaire structurel de l'instrument Q2."""
    return {"faces_count": len(FACES), "faces_attendu": 6,
            "faces_a": len(FACES_A), "faces_b": len(FACES_B),
            "items_par_face": N_ITEMS_PAR_FACE, "items_total": ITEMS_TOTAL,
            "items_total_attendu": 24,
            "voie_heritee": VOIE_HERITEE,
            "labels_count": len(LABELS_MOTEUR), "labels": sorted(LABELS_MOTEUR),
            "faces_b_classifiantes": False,
            "ok": len(FACES) == 6 and ITEMS_TOTAL == 24}


def tableau_centres():
    """Tableau des centres exigé par D-GÉOMÉTRIE (Section B du rapport)."""
    return {
        "sigma_item": SIGMA_ITEM,
        "n_items_par_face": N_ITEMS_PAR_FACE,
        "sigma_eff": round(SIGMA_EFF, 4),
        "trois_sigma": round(TROIS_SIGMA, 4),
        "seuil_classif": SEUIL_CLASSIF,
        "seuil_crise": SEUIL_CRISE,
        "borne_non_crise": round(BANDE_MIN, 2),
        "borne_crise": round(BANDE_MAX, 2),
        "bande_exclue": f"[{BANDE_MIN:.2f}, {BANDE_MAX:.2f}]",
        "voies": {"A2": "Q2 (surimplication sévère) — nouvelle",
                  "SM-C1": "héritée Q1 (contrôle coercitif)",
                  "H5": "héritée RIO-02 (binaire, sans score)"},
        "note": ("24 items = 6 faces × 4. σ_eff = 0.60/√4 = 0.30. 3σ_eff = 0.90. "
                 "Bande exclue [3.10, 4.90] sur les 2 voies score (A2 et SM-C1). "
                 "Crise : centres μ = 4.90. Non-crise : centres ≤ 2.50, "
                 "sauf SURIMPLIQUÉ en bande (centre 3.70 verrouillé, bascule "
                 "théorique 15,9 % en continu — confrontée à l'observé)."),
    }
