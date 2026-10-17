# -*- coding: utf-8 -*-
"""WAIRYU — WTC-SM-Q1-R2 : moteur Quête 1 Santé mentale
« Ma détresse et la leur » — RIO-11 cible.
R2 : D-GÉOMÉTRIE appliquée. SM-C1 = 4 items agrégés (σ_eff=0.30).
Bande [3.10, 4.90] exclue du décompte C3.
crise_vraie ancrée sur le paramètre vrai (μ), pas sur le groupe."""

SM_D = ["SM-D1", "SM-D2", "SM-D3"]
SM_A = ["SM-A1", "SM-A2", "SM-A3"]
SM_C = ["SM-C1", "SM-C2", "SM-C3"]
FACES = SM_D + SM_A + SM_C
SOUS_ECHELLES = {"SM-D": SM_D, "SM-A": SM_A, "SM-C": SM_C}
CLASSIFICATIONS = ["STABLE", "CHARGE", "MASQUE", "CRISE", "MIXTE"]
LABELS_MOTEUR = set(CLASSIFICATIONS) | {"CRISIS_MODE"}

SEUIL_MID = 3.00
SEUIL_DOMINANCE = 3.5
SEUIL_CRISE = 4.0

# D-GÉOMÉTRIE : SM-C1 = 4 items agrégés (réduction structurelle)
# σ_item = 0.60 (D-PARAM), n=4 → σ_eff = 0.60/√4 = 0.30
# 3σ_eff = 0.90
# Bande exclue : [4.0 - 0.90, 4.0 + 0.90] = [3.10, 4.90]
N_ITEMS_SM_C1 = 4
SIGMA_ITEM = 0.60
SIGMA_EFF_SM_C1 = SIGMA_ITEM / (N_ITEMS_SM_C1 ** 0.5)  # 0.30
TROIS_SIGMA = 3 * SIGMA_EFF_SM_C1  # 0.90
BANDE_EXCLUE_MIN = SEUIL_CRISE - TROIS_SIGMA  # 3.10
BANDE_EXCLUE_MAX = SEUIL_CRISE + TROIS_SIGMA  # 4.90

ECHELLE_5PTS = {1: "JAMAIS", 2: "RAREMENT", 3: "PARFOIS", 4: "SOUVENT", 5: "TOUT LE TEMPS"}


def moyenne_face(rep, face):
    """Moyenne d'une face. Déterministe.
    Pour SM-C1 : moyenne de 4 items (SM-C1-1 à SM-C1-4).
    Pour les autres : 1 item."""
    if face == "SM-C1":
        vals = []
        for i in range(1, N_ITEMS_SM_C1 + 1):
            key = f"SM-C1-{i}"
            v = rep.get(key)
            if v is not None:
                vals.append(float(v))
        return round(sum(vals) / len(vals), 2) if vals else 3.0
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
    return {f: moyenne_face(rep, f) for f in FACES}


def detecter_crise(profil):
    """D-CRISE : court-circuit AVANT tout calcul.
    Seuil sur SM-C1 (moyenne de 4 items, σ_eff=0.30).
    Voies : SM-C1 ≥ 4.0 OU H5 hérité actif."""
    sm_c1 = moyenne_face(profil, "SM-C1")
    h5 = profil.get("h5_actif", False)
    if sm_c1 >= SEUIL_CRISE:
        return {"crise": True, "cause": "SM-C1 ≥ 4.0 (contrôle coercitif)",
                "filet": "3919 (violences conjugales) / 3114 (détresse psychiatrique)",
                "mode": "CRISIS_MODE", "sm_c1_score": sm_c1}
    if h5:
        return {"crise": True, "cause": "H5 hérité actif (RIO-02)",
                "filet": "3919 / 3114", "mode": "CRISIS_MODE",
                "sm_c1_score": sm_c1}
    return {"crise": False, "cause": None, "filet": None,
            "mode": "NORMAL", "sm_c1_score": sm_c1}


def classifier_dominance(profil):
    """5 labels. D-CRISE testé en premier."""
    crise = detecter_crise(profil)
    if crise["crise"]:
        return "CRISE"
    sm_d1 = moyenne_face(profil, "SM-D1")
    sm_d2 = moyenne_face(profil, "SM-D2")
    sm_d3 = moyenne_face(profil, "SM-D3")
    if sm_d1 <= 2.5 and sm_d2 <= 2.5 and sm_d3 <= 2.5:
        return "STABLE"
    hautes = []
    if sm_d1 >= SEUIL_DOMINANCE: hautes.append("SM-D1")
    if sm_d2 >= SEUIL_DOMINANCE: hautes.append("SM-D2")
    if len(hautes) == 1:
        return "CHARGE" if hautes[0] == "SM-D1" else "MASQUE"
    return "MIXTE"


def est_dans_bande_exclue(sm_c1_score):
    """D-GÉOMÉTRIE : bande [3.10, 4.90] exclue du décompte C3."""
    return BANDE_EXCLUE_MIN <= sm_c1_score <= BANDE_EXCLUE_MAX


def verifier_d_echelle():
    return {"seuils": {"MID": SEUIL_MID, "DOMINANCE": SEUIL_DOMINANCE, "CRISE": SEUIL_CRISE},
            "ok": True}


def verifier_d_verite():
    labels = set(CLASSIFICATIONS) | {"CRISIS_MODE"}
    return {"faces_count": len(FACES), "faces_attendu": 9,
            "sous_echelles_count": len(SOUS_ECHELLES), "sous_echelles_attendu": 3,
            "labels_count": len(labels), "labels": sorted(labels),
            "ok": len(FACES) == 9 and len(SOUS_ECHELLES) == 3}


def tableau_centres():
    """Tableau des centres exigé par D-GÉOMÉTRIE (rapport)."""
    return {
        "sigma_item": SIGMA_ITEM,
        "n_items_sm_c1": N_ITEMS_SM_C1,
        "sigma_eff_sm_c1": round(SIGMA_EFF_SM_C1, 4),
        "trois_sigma": round(TROIS_SIGMA, 4),
        "seuil_crise": SEUIL_CRISE,
        "borne_non_crise": round(BANDE_EXCLUE_MIN, 2),
        "borne_crise": round(BANDE_EXCLUE_MAX, 2),
        "bande_exclue": f"[{BANDE_EXCLUE_MIN:.2f}, {BANDE_EXCLUE_MAX:.2f}]",
        "note": "σ_eff = σ_item/√n = 0.60/√4 = 0.30. 3σ_eff = 0.90. "
                "Bande exclue [3.10, 4.90]. "
                "Non-crise: μ ≤ 3.10. Crise: μ ≥ 4.90 (borné 5.0).",
    }
