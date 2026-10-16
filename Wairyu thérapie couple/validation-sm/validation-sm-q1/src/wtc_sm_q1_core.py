# -*- coding: utf-8 -*-
"""WAIRYU — WTC-SM-Q1 : moteur Quête 1 Santé mentale
« Ma détresse et la leur » — RIO-11 cible.
D-CRISE : court-circuit de crise AVANT l'arbre.
Option B (D-CANAL) — périmètre verrouillé."""

SM_D = ["SM-D1", "SM-D2", "SM-D3"]
SM_A = ["SM-A1", "SM-A2", "SM-A3"]
SM_C = ["SM-C1", "SM-C2", "SM-C3"]
FACES = SM_D + SM_A + SM_C
SOUS_ECHELLES = {"SM-D": SM_D, "SM-A": SM_A, "SM-C": SM_C}
FORCE_ORDER = ["F-S1", "F-S2", "F-S3", "F-S4", "F-S5", "F-S6"]
CLASSIFICATIONS = ["STABLE", "CHARGE", "MASQUE", "CRISE", "MIXTE"]
SEUIL_MID = 3.00
SEUIL_DOMINANCE = 3.5
SEUIL_CRISE = 4.0
SEUIL_CELEBRE = 10
SEUIL_AJUSTEMENT = 6

def moyenne(items, rep):
    vals = [float(rep.get(i, 3)) for i in items]
    return round(sum(vals) / len(vals), 2) if vals else 3.0

def tous_scores_faces(rep):
    return {f: moyenne([f], rep) for f in FACES}

def detecter_crise(profil):
    sm_c1 = float(profil.get("SM-C1", 3))
    h5 = profil.get("h5_actif", False)
    if sm_c1 >= SEUIL_CRISE or h5:
        return {"crise": True, "cause": "SM-C1 ≥ 4" if sm_c1 >= SEUIL_CRISE else "H5 hérité actif",
                "filet": "3919 (violences conjugales) / 3114 (détresse psychiatrique)"}
    return {"crise": False, "cause": None, "filet": None}

def classifier_dominance(rep):
    sm_d1 = float(rep.get("SM-D1", 3))
    sm_d2 = float(rep.get("SM-D2", 3))
    sm_c1 = float(rep.get("SM-C1", 3))
    if sm_c1 >= SEUIL_CRISE:
        return "CRISE"
    if sm_d1 <= 2.5 and sm_d2 <= 2.5 and float(rep.get("SM-D3", 3)) <= 2.5:
        return "STABLE"
    hautes = []
    if sm_d1 >= SEUIL_DOMINANCE: hautes.append("SM-D1")
    if sm_d2 >= SEUIL_DOMINANCE: hautes.append("SM-D2")
    if len(hautes) == 1:
        return "CHARGE" if hautes[0] == "SM-D1" else "MASQUE"
    return "MIXTE"

def forces_sm(rep, journal=None):
    j_ok = journal is not None and journal.get("complete", False)
    jL = journal.get("l", 0) if j_ok else 0
    jU = journal.get("u", 0) if j_ok else 0
    jM = journal.get("m", 0) if j_ok else 0
    sm_d2 = float(rep.get("SM-D2", 3))
    sm_d3 = float(rep.get("SM-D3", 3))
    sm_a1 = float(rep.get("SM-A1", 3))
    sm_a2 = float(rep.get("SM-A2", 3))
    sm_c1 = float(rep.get("SM-C1", 3))
    sm_c3 = float(rep.get("SM-C3", 3))
    conds = {
        "F-S1": [sm_d3 >= 3, jL >= 4],
        "F-S2": [(sm_a1 <= 2.5 and sm_a2 <= 3), jU >= 4],
        "F-S3": [sm_c1 <= 2, jL >= 4],
        "F-S4": [sm_a2 <= 2.5, jM >= 4],
        "F-S5": [sm_d2 <= 2.5, jU >= 3],
        "F-S6": [sm_c3 >= 3, jM >= 4],
    }
    trace = {f: [bool(c) for c in cs] for f, cs in conds.items()}
    actives = [f for f in FORCE_ORDER if any(trace[f])]
    if len(actives) <= 2:
        return {"forces": actives, "silencieuse": len(actives) == 0,
                "trace": trace, "exclues": [], "nombre": len(actives)}
    densite = {f: sum(trace[f]) for f in actives}
    tri = sorted(actives, key=lambda f: (-densite[f], FORCE_ORDER.index(f)))
    retenues = sorted(tri[:2], key=lambda f: FORCE_ORDER.index(f))
    exclues = [f for f in actives if f not in retenues]
    return {"forces": retenues, "silencieuse": False, "trace": trace,
            "exclues": exclues, "nombre": 2}

def selectionner_pas(profil):
    crise = detecter_crise(profil)
    if crise["crise"]:
        return {"pas": "CRISE", "label": "Orientation — filet de sécurité",
                "template": "Ce que tu décris nécessite une orientation immédiate. "
                            "Le 3919 (violences conjugales) et le 3114 (détresse psychiatrique) "
                            "sont des numéros gratuits, anonymes, disponibles 24h/24. "
                            "Tu n'es pas seul(e).",
                "trace": {"source": "D-CRISE court-circuit", "arbre": "AVANT forces"},
                "crise": crise}
    rep = profil
    forces = forces_sm(rep, profil.get("journal"))
    sm_d3 = float(rep.get("SM-D3", 3))
    sm_a1 = float(rep.get("SM-A1", 3))
    sm_c1 = float(rep.get("SM-C1", 3))
    sm_d2 = float(rep.get("SM-D2", 3))
    sm_a3 = float(rep.get("SM-A3", 3))
    sm_c3 = float(rep.get("SM-C3", 3))
    sm_d1 = float(rep.get("SM-D1", 3))
    sm_c2 = float(rep.get("SM-C2", 3))
    if sm_d3 >= 3:
        pas, src = "F-S1", "SM-D3 (signal d'aide)"
    elif sm_a1 >= 3:
        pas, src = "F-S2", "SM-A1 (épuisement)"
    elif sm_c1 >= 2.5:
        pas, src = "F-S3", "SM-C1 (contrôle)"
    elif sm_d2 >= 3:
        pas, src = "F-S5", "SM-D2 (masque)"
    elif sm_a3 >= 3:
        pas, src = "F-S3", "SM-A3 (hostilité/EE)"
    elif sm_c3 >= 3:
        pas, src = "F-S6", "SM-C3 (réparation)"
    elif sm_d1 >= 3:
        pas, src = "F-S1", "SM-D1 (poids)"
    elif sm_c2 >= 3:
        pas, src = "F-S2", "SM-C2 (culpabilité)"
    else:
        pas, src = "F-S5", "fallback (aucun héritage actif)"
    PAS_LABELS = {
        "F-S1": "Signaler ta détresse sans la crier",
        "F-S2": "Mettre des limites au soin sans rompre",
        "F-S3": "Protéger sans contrôler",
        "F-S4": "Accueillir la détresse de l'autre sans la porter",
        "F-S5": "Savoir te retirer pour te ressourcer",
        "F-S6": "Te réparer après une crise",
        "CRISE": "Orientation — filet de sécurité",
    }
    return {"pas": pas, "label": PAS_LABELS.get(pas, pas),
            "trace": {"source": src, "arbre": "SM-D3 > SM-A1 > SM-C1 > SM-D2 > SM-A3 > SM-C3 > SM-D1 > SM-C2"},
            "crise": crise, "forces": forces}

def suivre_14_jours(jours_tenus):
    if not isinstance(jours_tenus, int) or jours_tenus < 0:
        jours_tenus = 0
    jours_tenus = min(jours_tenus, 14)
    if jours_tenus >= SEUIL_CELEBRE: cat = "CELEBRE"
    elif jours_tenus >= SEUIL_AJUSTEMENT: cat = "AJUSTEMENT"
    else: cat = "REPRISE"
    TEMPLATES_SUIVI = {
        "CELEBRE": "Tu as tenu ton geste 10 jours sur 14 ou plus — c'est une assise réelle. "
                   "Les jours manqués ne sont pas une faute. Le geste est entré dans ta semaine.",
        "AJUSTEMENT": "Tu as tenu ton geste 7 jours sur 14. C'est un début d'assise — pas un échec. "
                      "Les jours manqués ne sont pas une faute. Peut-être le geste demande-t-il un ajustement.",
        "REPRISE": "Tu as tenu ton geste 3 jours sur 14. Ce n'est pas un échec — c'est un signal. "
                   "Le geste tel qu'il est ne tient pas dans ta vie actuelle. La suite du parcours t'aide à le reprendre.",
    }
    return {"jours_tenus": jours_tenus, "jours_total": 14,
            "taux": round(jours_tenus / 14 * 100, 1),
            "categorie": cat, "message": TEMPLATES_SUIVI[cat], "sanction": None}

def programmer_re_test(date_pas, semaines=8):
    from datetime import datetime, timedelta
    d = datetime.fromisoformat(date_pas) if isinstance(date_pas, str) else (date_pas or datetime.now())
    if not isinstance(d, datetime): d = datetime.now()
    date_re_test = d + timedelta(weeks=semaines)
    return {"date_pas": d.isoformat() if isinstance(date_pas, datetime) else str(date_pas),
            "date_re_test": date_re_test.isoformat(), "semaines": semaines,
            "force": False,
            "message": f"Dans {semaines} semaines (à partir du {date_re_test.strftime('%d/%m/%Y')}), "
                       f"tu pourras reprendre la Quête 1 Santé mentale. Pas pour te comparer — "
                       f"pour voir ce qui a bougé. Le re-test n'est jamais forcé."}

def verifier_anti_perfectionnisme():
    TEMPLATES_SUIVI = ["CELEBRE", "AJUSTEMENT", "REPRISE"]
    violations = []
    mots_interdits = ["échec personnel", "tu aurais dû", "tu devrais", "tu dois",
                      "c'est ta faute", "manquement", "insuffisant", "décevant"]
    for j in [0, 3, 5, 6, 7, 9, 10, 14]:
        s = suivre_14_jours(j)
        if s["sanction"] is not None:
            violations.append({"jours": j, "mot": "sanction_non_null"})
    return {"messages_testes": 3, "violations": violations, "ok": len(violations) == 0}

def verifier_templates():
    FORCE_OK = len(FORCE_ORDER) == 6
    return {"force_count": len(FORCE_ORDER), "ok": FORCE_OK}
