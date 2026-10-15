# -*- coding: utf-8 -*-
"""WAIRYU — WTC-EMO-Q3-01 : moteur Quête 3 émotionnelle
« Ce que mon cœur sait faire »
Principe fondateur : le positif n'est jamais généré — il est
SÉLECTIONNÉ dans la banque fermée de 6 forces (fondation v1.1,
F-E2 corrigée faute n°16), par règles déterministes. Sinon
SILENCIEUSE. Construits cités : capitalisation (Gable & Reis) ;
co-régulation (Porges) ; forces de caractère (VIA/Peterson —
cadre public, items ex nihilo). RIO-08 cible. Déterministe · local."""

FORCE_ORDER = ["F-E1", "F-E2", "F-E3", "F-E4", "F-E5", "F-E6"]
CAP_TYPES = ["AC", "PC", "AD", "PD"]
C_KEYS = ["C-A", "C-B", "C-C"]

def moyenne_face(items, rep):
    """Moyenne d'une face E-R (3 items, 2 décimales)."""
    return round(sum(rep[i] for i in items) / len(items), 2)

def forces_emo(cA, cB, cC, cap, er1_m, er3_m, journal, d_exp):
    """La sélection déterministe des forces.
    cA, cB, cC : scores de l'échelle C (1-5)
    cap : type de capitalisation ('AC'|'PC'|'AD'|'PD')
    er1_m, er3_m : moyennes des faces explosion et rumination (Q1)
    journal : dict {t,u,l,m,n,complete} ou None
    d_exp : score de la demande explicite (1-5)

    Retourne : forces (max 2), silencieuse (bool), trace (les
    voies par force), exclues (les forces actives non retenues
    par la règle de densité)."""
    j_ok = journal is not None and journal.get("complete", False)
    jL = journal.get("l", 0) if j_ok else 0
    jU = journal.get("u", 0) if j_ok else 0
    jM = journal.get("m", 0) if j_ok else 0

    conds = {
        # M1 (R1) — D-DENSITÉ : toutes les forces à 2 voies max (symétrie)
        # Voie A = comportement (C-A/B/C, D-EXP, CAP combinés logiquement)
        # Voie C = journal
        "F-E1": [cA >= 2, jL >= 4],                                    # 2 voies
        "F-E2": [(er1_m <= 2.5 and cB >= 2) or cB >= 3, jU >= 4],      # 2 voies (was 3)
        "F-E3": [cap == "AC", jM >= 4],                                 # 2 voies
        "F-E4": [(cC >= 2 or d_exp >= 3), jM >= 4],                     # 2 voies (M1 initial)
        "F-E5": [(er3_m <= 2.5 and cB >= 2) or cA >= 2, (jL >= 4 and jM >= 3)],  # 2 voies (was 3)
        "F-E6": [cC >= 3, jU >= 3],                                     # 2 voies
    }
    trace = {f: [bool(c) for c in cs] for f, cs in conds.items()}
    actives = [f for f in FORCE_ORDER if any(trace[f])]

    if len(actives) <= 2:
        return {"forces": actives,
                "silencieuse": len(actives) == 0,
                "trace": trace, "exclues": [],
                "nombre": len(actives)}

    densite = {f: sum(trace[f]) for f in actives}
    tri = sorted(actives, key=lambda f: (-densite[f],
                                         FORCE_ORDER.index(f)))
    retenues = sorted(tri[:2], key=lambda f: FORCE_ORDER.index(f))
    exclues = [f for f in actives if f not in retenues]
    return {"forces": retenues, "silencieuse": False,
            "trace": trace, "exclues": exclues, "nombre": 2}

def indice_capitalisation(cap_distribution):
    """L'indice de capitalisation d'une population :
    (% AC + % PC/2) pondéré — le marqueur Gable & Reis.
    Métrique de Section E (analyse) — JAMAIS un verdict
    individuel. cap_distribution : dict {type: effectif}."""
    total = sum(cap_distribution.get(t, 0) for t in CAP_TYPES)
    if total == 0:
        return 0.0
    ac = cap_distribution.get("AC", 0)
    pc = cap_distribution.get("PC", 0)
    return round((ac + pc / 2) / total, 3)

def statut_journal(journal):
    """L'honnêteté du journal — jamais de sanction du silence.
    4 statuts : NON_RENSEIGNÉ · PARTIEL · SILENCIEUX (N ≥ 5) · ACTIF."""
    if journal is None:
        return "NON_RENSEIGNÉ"
    if not journal.get("complete", False):
        return "PARTIEL"
    if journal.get("n", 0) >= 5:
        return "SILENCIEUX"
    return "ACTIF"

def coherence_cap_forces(cap, forces):
    """Le garde clinique : F-E3 (le cœur qui célèbre) ne peut
    JAMAIS être activée si CAP ≠ AC — la tiédeur ne fabrique pas
    de célébration. Retourne True si cohérent (F-E3 absente de
    forces OU cap == AC). Utilisé par le validateur (C3a)."""
    if "F-E3" not in forces:
        return True
    return cap == "AC"

TEMPLATES = {
    "F-E1": "Le cœur qui écoute : tu accueilles l'émotion de "
            "l'autre sans la corriger ni la minimiser — c'est une "
            "force que ton couple vit déjà.",
    "F-E2": "Le cœur qui pacifie : tu désamorces les tensions "
            "avant qu'elles montent — tu sais ramener l'air.",
    "F-E3": "Le cœur qui célèbre : tu réponds aux bonnes "
            "nouvelles avec enthousiasme — tu sais doubler la joie.",
    "F-E4": "Le cœur qui réclame : tu formules tes besoins "
            "clairement, tu ne les laisses pas deviner — c'est la "
            "compétence la plus rare.",
    "F-E5": "Le cœur qui tient : tu traverses les tempêtes sans "
            "abandonner — tu es là, encore, et encore.",
    "F-E6": "Le cœur qui convertit : tu donnes dans la devise de "
            "l'autre, pas dans la tienne — c'est le change qui fait "
            "les couples.",
    "SILENCIEUSE": "Ton cœur est encore discret sur ces questions "
            "— c'est un constat, pas un défaut : la suite du "
            "parcours servira aussi à ça.",
}

def verifier_templates():
    """C5a — complétude : 7 templates (6 forces + SILENCIEUSE),
    non vides, non dupliqués. Retourne la liste des manquants."""
    attendus = FORCE_ORDER + ["SILENCIEUSE"]
    manquants = [k for k in attendus
                 if k not in TEMPLATES or not TEMPLATES[k].strip()]
    return manquants
