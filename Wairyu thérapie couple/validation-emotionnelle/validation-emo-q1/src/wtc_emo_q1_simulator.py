"""
WTC-EMO-Q1 — Simulateur de la Quête 1 Émotionnelle « Ma météo intérieure »
===========================================================================

4 groupes + 3 pièges (SANS_FORCE, SURCHARGE, ASYM_RQS).
Ré-implémentation indépendante `forces_vraies` pour la vérité croisée C2.

D-STD : le plafond de classification C1a est mesuré AVANT les seuils,
sur le CODE réel du simulateur (leçon D-Q3-J + D-STD-2 par config).

Avertissement D-SIM : résultats issus de simulations (seed 42) —
la mécanique est validée, pas la prévalence clinique.
"""

import numpy as np

import wtc_emo_q1_core as core

SEED = 42
_RNG = np.random.default_rng(SEED)


# ============================================================
# Génération d'un profil
# ============================================================
# Profil = dict avec :
# - 27 items déclaratifs (E-R1-1 à E-L3-3, échelle 1-5)
# - 3 items comportementaux (C-A, C-B, C-C, échelle 1-5)
# - 1 item D-EXP (échelle 1-5)
# - 1 question CAP (0 ou 1)
# - 4 items optionnels OPT-A (échelle 1-5) — posés si partenaire lié
# - journal (dict t, u, l, m) ou None

# Moyennes par groupe (mu_er1, mu_er2, mu_er3, mu_eb, mu_el, mu_c, mu_dexp, p_cap, journal_rate)
_GROUPE_PARAMS = {
    "G1_régulé":         (2.0, 2.0, 2.0, 3.0, 3.0, 3.5, 3.5, 0.6, 0.5),
    "G2_force_claire":   (2.5, 2.5, 2.5, 3.5, 3.5, 4.0, 4.0, 0.8, 0.7),
    "G3_explosif_vif":   (4.0, 2.0, 3.0, 3.0, 3.0, 2.0, 2.5, 0.3, 0.4),
    "G4_suppressif":     (2.0, 4.0, 2.5, 2.5, 2.5, 2.0, 2.0, 0.2, 0.3),
}


def _gen_profil(groupe, idx):
    """Génère un profil pour un groupe donné.

    Args:
        groupe : nom du groupe (clé de _GROUPE_PARAMS)
        idx : index dans le groupe

    Returns:
        dict profil
    """
    params = _GROUPE_PARAMS[groupe]
    mu_er1, mu_er2, mu_er3, mu_eb, mu_el, mu_c, mu_dexp, p_cap, journal_rate = params

    profil = {"id": f"{groupe}_{idx}", "groupe": groupe}

    # Items E-R1 (3 items, moyenne mu_er1)
    for item in ["E-R1-1", "E-R1-2", "E-R1-3"]:
        profil[item] = int(np.clip(round(_RNG.normal(mu_er1, 0.8)), 1, 5))
    # Items E-R2 (3 items)
    for item in ["E-R2-1", "E-R2-2", "E-R2-3"]:
        profil[item] = int(np.clip(round(_RNG.normal(mu_er2, 0.8)), 1, 5))
    # Items E-R3 (3 items)
    for item in ["E-R3-1", "E-R3-2", "E-R3-3"]:
        profil[item] = int(np.clip(round(_RNG.normal(mu_er3, 0.8)), 1, 5))

    # Items E-B (3 faces × 3 items, moyenne mu_eb)
    for face in ["E-B1", "E-B2", "E-B3"]:
        for i in range(1, 4):
            profil[f"{face}-{i}"] = int(np.clip(round(_RNG.normal(mu_eb, 0.8)), 1, 5))

    # Items E-L (3 faces × 3 items, moyenne mu_el)
    for face in ["E-L1", "E-L2", "E-L3"]:
        for i in range(1, 4):
            profil[f"{face}-{i}"] = int(np.clip(round(_RNG.normal(mu_el, 0.8)), 1, 5))

    # Items comportementaux C-A, C-B, C-C (échelle 1-5, moyenne mu_c)
    profil["C-A"] = int(np.clip(round(_RNG.normal(mu_c, 0.8)), 1, 5))
    profil["C-B"] = int(np.clip(round(_RNG.normal(mu_c, 0.8)), 1, 5))
    profil["C-C"] = int(np.clip(round(_RNG.normal(mu_c, 0.8)), 1, 5))

    # D-EXP (échelle 1-5, moyenne mu_dexp)
    profil["D-EXP"] = int(np.clip(round(_RNG.normal(mu_dexp, 0.8)), 1, 5))

    # CAP (0 ou 1, probabilité p_cap d'avoir CAP=1)
    profil["CAP"] = 1 if _RNG.random() < p_cap else 0

    # OPT-A (4 items optionnels — générés même si pas toujours posés)
    for i in range(1, 5):
        profil[f"OPT-A{i}"] = int(np.clip(round(_RNG.normal(3.0, 0.8)), 1, 5))

    # Journal (présent avec probabilité journal_rate)
    if _RNG.random() < journal_rate:
        profil["journal"] = {
            "complete": True,
            "n": int(_RNG.integers(0, 8)),
            "t": int(_RNG.integers(0, 8)),  # tensions
            "u": int(_RNG.integers(0, 8)),  # compréhensions
            "l": int(_RNG.integers(0, 8)),  # liens
            "m": int(_RNG.integers(0, 8)),  # marques
        }
    else:
        profil["journal"] = None

    return profil


# ============================================================
# Génération des 4 groupes
# ============================================================

def gen_groupes():
    """Génère les 4 groupes principaux.

    Returns:
        liste de profils
    """
    tailles = {
        "G1_régulé": 150,
        "G2_force_claire": 120,
        "G3_explosif_vif": 80,
        "G4_suppressif": 50,
    }
    profils = []
    for groupe, n in tailles.items():
        for i in range(n):
            profils.append(_gen_profil(groupe, i))
    return profils


# ============================================================
# Piège SANS_FORCE (n=40) — test C1b anti-fabrication
# ============================================================
# Tous les items bas, pas de preuve comportementale, pas de journal.
# Avec F-E2 corrigée (faute n°16), l'absence d'explosion ne suffit pas
# à activer F-E2 → SILENCIEUSE obligatoire.

def _gen_sans_force(n=40):
    profils = []
    for i in range(n):
        profil = {"id": f"SANS_FORCE_{i}", "groupe": "SANS_FORCE"}
        # Tous les items déclaratifs à 2 (RAREMENT — bas mais pas 1)
        for face in core.FACES:
            for item in core.ITEMS_PAR_FACE[face]:
                profil[item] = 2
        # Items comportementaux à 1 (JAMAIS — pas de preuve)
        profil["C-A"] = 1
        profil["C-B"] = 1
        profil["C-C"] = 1
        profil["D-EXP"] = 1
        profil["CAP"] = 0
        for i_opt in range(1, 5):
            profil[f"OPT-A{i_opt}"] = 2
        profil["journal"] = None
        profils.append(profil)
    return profils


# ============================================================
# Piège SURCHARGE (n=20) — test C1c limite 2 par densité
# ============================================================
# Toutes les forces activables (C-A, C-B, C-C ≥ 3, D-EXP ≥ 3, CAP=1, journal plein).
# La règle des 2 max doit sélectionner exactement 2 forces.

def _gen_surcharge(n=20):
    profils = []
    for i in range(n):
        profil = {"id": f"SURCHARGE_{i}", "groupe": "SURCHARGE"}
        # Items déclaratifs variés mais forces activables
        for face in core.FACES:
            for item in core.ITEMS_PAR_FACE[face]:
                profil[item] = 4
        # Items comportementaux élevés
        profil["C-A"] = 4
        profil["C-B"] = 4
        profil["C-C"] = 4
        profil["D-EXP"] = 4
        profil["CAP"] = 1
        for i_opt in range(1, 5):
            profil[f"OPT-A{i_opt}"] = 4
        # Journal complet avec marques
        profil["journal"] = {
            "complete": True,
            "n": 7,
            "t": 3, "u": 5, "l": 5, "m": 5,
        }
        profils.append(profil)
    return profils


# ============================================================
# Piège ASYM_RQS (n=15) — test C3 RQS miroir
# ============================================================
# Profils avec straight-lining (linéarité ≥ 0,55) ou contradiction E-R1×E-R2 ≥ 3,5.

def _gen_asym_rqs(n=15):
    profils = []
    for i in range(n):
        profil = {"id": f"ASYM_RQS_{i}", "groupe": "ASYM_RQS"}
        if i < 8:
            # Straight-lining : tous les items à 3
            for face in core.FACES:
                for item in core.ITEMS_PAR_FACE[face]:
                    profil[item] = 3
            profil["C-A"] = 3
            profil["C-B"] = 3
            profil["C-C"] = 3
            profil["D-EXP"] = 3
            profil["CAP"] = 0
        else:
            # Contradiction E-R1 × E-R2 ≥ 3,5 : E-R1=3, E-R2=3 (produit 9)
            for item in ["E-R1-1", "E-R1-2", "E-R1-3"]:
                profil[item] = 4
            for item in ["E-R2-1", "E-R2-2", "E-R2-3"]:
                profil[item] = 4
            for item in ["E-R3-1", "E-R3-2", "E-R3-3"]:
                profil[item] = 2
            for face in ["E-B1", "E-B2", "E-B3", "E-L1", "E-L2", "E-L3"]:
                for k in range(1, 4):
                    profil[f"{face}-{k}"] = 3
            profil["C-A"] = 3
            profil["C-B"] = 3
            profil["C-C"] = 3
            profil["D-EXP"] = 3
            profil["CAP"] = 0
        for i_opt in range(1, 5):
            profil[f"OPT-A{i_opt}"] = 3
        profil["journal"] = None
        profils.append(profil)
    return profils


# ============================================================
# Ré-implémentation indépendante forces_vraies (vérité croisée C2)
# ============================================================

def forces_vraies(profil):
    """Ré-implémentation indépendante de verifier_forces pour C2.

    Toute divergence avec le moteur = bug démontré.
    """
    # Scores de face indépendants
    def _score_face(face):
        items = core.ITEMS_PAR_FACE.get(face, [])
        vals = [float(profil[it]) for it in items if it in profil]
        return sum(vals) / len(vals) if vals else 3.0

    er1 = _score_face("E-R1")
    er3 = _score_face("E-R3")
    c_a = profil.get("C-A", 3)
    c_b = profil.get("C-B", 3)
    c_c = profil.get("C-C", 3)
    d_exp = profil.get("D-EXP", 3)
    cap = profil.get("CAP", 0)
    journal = profil.get("journal") or {}
    j_l = journal.get("l", 0)
    j_u = journal.get("u", 0)
    j_m = journal.get("m", 0)

    conds = {}
    conds["F-E1"] = (c_a >= 2) or (j_l >= 4)
    # F-E2 corrigée (faute n°16)
    conds["F-E2"] = (
        (er1 <= 2.5 and c_b >= 2) or (c_b >= 3) or (j_u >= 4)
    )
    conds["F-E3"] = (cap >= 1) or (j_m >= 4)
    conds["F-E4"] = (c_c >= 2) or (d_exp >= 3) or (j_m >= 4)
    conds["F-E5"] = (
        (er3 <= 2.5 and c_b >= 2) or (c_a >= 2) or (j_l >= 4 and j_m >= 3)
    )
    conds["F-E6"] = (c_c >= 3) or (j_u >= 3)

    forces = [f for f in core.FORCES if conds[f]]
    if len(forces) > 2:
        forces = sorted(forces, key=lambda f: core.FORCES.index(f))[:2]
    return forces


def classification_vraie(profil):
    """Ré-implémentation indépendante de classifier_dominance pour C2."""
    def _score_face(face):
        items = core.ITEMS_PAR_FACE.get(face, [])
        vals = [float(profil[it]) for it in items if it in profil]
        return sum(vals) / len(vals) if vals else 3.0

    er1 = _score_face("E-R1")
    er2 = _score_face("E-R2")
    er3 = _score_face("E-R3")

    if er1 <= 2.5 and er2 <= 2.5 and er3 <= 2.5:
        return "RÉGULÉ"
    hautes = []
    if er1 >= 3.5: hautes.append(("E-R1", er1))
    if er2 >= 3.5: hautes.append(("E-R2", er2))
    if er3 >= 3.5: hautes.append(("E-R3", er3))
    if len(hautes) == 1:
        f = hautes[0][0]
        if f == "E-R1" and er1 > er2 and er1 > er3: return "EXPLOSIF"
        if f == "E-R2" and er2 > er1 and er2 > er3: return "SUPPRESSIF"
        if f == "E-R3" and er3 > er1 and er3 > er2: return "RUMINANT"
    return "MIXTE"


# ============================================================
# Données simulées (construction au chargement, seed 42)
# ============================================================

GROUPES = gen_groupes()
SANS_FORCE = _gen_sans_force(40)
SURCHARGE = _gen_surcharge(20)
ASYM_RQS = _gen_asym_rqs(15)


def tous_les_profils():
    """Retourne la liste plate de tous les profils."""
    return GROUPES + SANS_FORCE + SURCHARGE + ASYM_RQS


def resume_groupes():
    """Retourne un dict {groupe: effectif}."""
    resume = {}
    for p in GROUPES:
        resume[p["groupe"]] = resume.get(p["groupe"], 0) + 1
    resume["SANS_FORCE"] = len(SANS_FORCE)
    resume["SURCHARGE"] = len(SURCHARGE)
    resume["ASYM_RQS"] = len(ASYM_RQS)
    return resume
