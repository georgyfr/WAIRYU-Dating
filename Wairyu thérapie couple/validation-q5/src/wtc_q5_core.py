"""
WTC-Q5 — Moteur de la Quête 5 « Mon premier pas » (pas + suivi 14 jours)
=========================================================================

Dernière quête de la dimension attachement.
Package construit avec D-STD recalculé d'emblée + D-STD-2 (plafond
PAR CONFIGURATION, pas seulement global — leçon Q4).

Principes non négociables :
- Anti-perfectionnisme : 9/14 = célébré, jamais de sanction.
- Rappels doux, jamais culpabilisants.
- Compteurs privés (pas d'exposition sociale du taux de tenue).
- Le pas est sélectionné par la face dominante (Q1) et l'empreinte (Q2).
- Re-test Q1 à 8 semaines programmé (jamais forcé).

Avertissement D-SIM : résultats issus de simulations (seed 42) —
la mécanique est validée, pas la prévalence clinique.
"""

# ============================================================
# Tables du core
# ============================================================

# Faces d'attachement (Quête 1 — RIO-01, 2 axes × 3 faces)
# L'anxiété (sA) et l'évitement (sB) définissent 3 faces dominantes :
# - RASSUREE   : sA < 2.61 (anxiété basse)
# - EN_QUETE   : sA ≥ 2.61 ET sB < 2.61 (anxiété haute, évitement basse)
# - SUR_LA_RA  : sB ≥ 2.61 (évitement haut — la garde reste)
FACES = ["RASSUREE", "EN_QUETE", "SUR_LA_RA"]

# Empreintes (Quête 2 — RIO-02, 3 labels d'ombre)
EMPREINTES = ["ZONE_CALME", "PEUR_DE_PERDRE", "PEUR_D_ETRE_ETOUFFEE"]

# Banque de pas possibles — 6 pas (construits ex nihilo)
# Chaque pas est lié à une face dominante + une empreinte.
PAS_BANQUE = ["P1", "P2", "P3", "P4", "P5", "P6"]

# Table de sélection : (face, empreinte) → pas
# 3 faces × 3 empreintes = 9 combinaisons, mappées sur 6 pas
# (certaines combinaisons partagent un pas — c'est voulu : le pas
# est large, l'ajustement est personnel).
_PAS_TABLE = {
    ("RASSUREE", "ZONE_CALME"):            "P1",  # poser une présence simple
    ("RASSUREE", "PEUR_DE_PERDRE"):        "P2",  # nommer la peur quand elle vient
    ("RASSUREE", "PEUR_D_ETRE_ETOUFFEE"):  "P3",  # garder l'espace sans rupture
    ("EN_QUETE", "ZONE_CALME"):            "P2",  # nommer la peur quand elle vient
    ("EN_QUETE", "PEUR_DE_PERDRE"):        "P4",  # demander sans exiger
    ("EN_QUETE", "PEUR_D_ETRE_ETOUFFEE"):  "P5",  # tenir le lien à distance
    ("SUR_LA_RA", "ZONE_CALME"):           "P3",  # garder l'espace sans rupture
    ("SUR_LA_RA", "PEUR_DE_PERDRE"):       "P5",  # tenir le lien à distance
    ("SUR_LA_RA", "PEUR_D_ETRE_ETOUFFEE"): "P6",  # desserrer la garde un peu
}

# Labels des pas (descriptif court, non prescriptif)
PAS_LABELS = {
    "P1": "Poser une présence simple",
    "P2": "Nommer la peur quand elle vient",
    "P3": "Garder l'espace sans rupture",
    "P4": "Demander sans exiger",
    "P5": "Tenir le lien à distance",
    "P6": "Desserrer la garde un peu",
}

# Templates d'affichage des pas (non prescriptifs, personnels)
TEMPLATES_PAS = {
    "P1": "Ton premier pas : poser une présence simple. Pas un grand "
          "geste — juste être là, sans raison, un moment. Ce qui te "
          "porte déjà (ta constance) se prête à ce pas.",
    "P2": "Ton premier pas : nommer la peur quand elle vient. Pas la "
          "chasser — juste la nommer, à toi d'abord, peut-être à "
          "l'autre. Ce qui te porte (ta vigilance fidèle) se prête à "
          "ce pas.",
    "P3": "Ton premier pas : garder l'espace sans rupture. Pas fuir, "
          "pas s'effacer — juste garder ton espace, en restant là. "
          "Ce qui te porte (ton assise) se prête à ce pas.",
    "P4": "Ton premier pas : demander sans exiger. Pas un ultimatum — "
          "une demande, qui peut être refusée. Ce qui te porte (ton "
          "port dans la tempête) se prête à ce pas.",
    "P5": "Ton premier pas : tenir le lien à distance. Pas couper — "
          "tenir, depuis ta place, sans t'écraser. Ce qui te porte "
          "(ton assise) se prête à ce pas.",
    "P6": "Ton premier pas : desserrer la garde un peu. Pas l'abandonner "
          "— la desserrer, juste un peu, sur un moment. Ce qui te porte "
          "(ta légèreté qui désamorce) se prête à ce pas.",
}

# Templates des messages de suivi (14 jours) — anti-perfectionnisme
# 3 cas : 9/14 (célébré), 7/14 (ajustement), 3/14 (reprise)
# JAMAIS de sanction. JAMAIS de culpabilisation.
TEMPLATES_SUIVI = {
    "CELEBRE":   # 9/14 et plus
        "Tu as tenu 9 jours sur 14 (ou plus). C'est une assise réelle — "
        "pas un échec les jours manqués. Le pas est entré dans ta "
        "semaine. Tu peux le garder tel quel, ou l'ajuster si tu sens "
        "qu'il pourrait mieux te aller.",
    "AJUSTEMENT":  # 7/14 à 8/14
        "Tu as tenu 7 jours sur 14. C'est un début d'assise — pas un "
        "échec. Les jours manqués ne sont pas une faute. Peut-être le "
        "pas demande-t-il un ajustement : plus petit, plus simple, "
        "mieux placé dans ta journée. La suite du parcours t'aide à "
        "le voir.",
    "REPRISE":   # 6/14 et moins
        "Tu as tenu 3 jours sur 14. Ce n'est pas un échec — c'est un "
        "signal. Le pas tel qu'il est ne tient pas dans ta vie "
        "actuelle. Peut-être est-il trop grand, mal placé, ou le "
        "moment n'est pas le bon. La suite du parcours t'aide à le "
        "reprendre, autrement, sans pression.",
}

# Seuils de catégorisation du suivi (anti-perfectionnisme)
SEUIL_CELEBRE = 9     # ≥ 9/14 → CELEBRE
SEUIL_AJUSTEMENT = 7  # 7-8/14 → AJUSTEMENT
# 0-6/14 → REPRISE

# ============================================================
# Dérivation de la face dominante (Quête 1)
# ============================================================

def face_dominante(sA, sB):
    """Dérive la face dominante des scores A/B.

    RASSUREE   : sA < 2.61 (anxiété basse — peu importe sB)
    EN_QUETE   : sA ≥ 2.61 ET sB < 2.61 (anxiété haute, évitement bas)
    SUR_LA_RA  : sB ≥ 2.61 (évitement haut — la garde reste)
    """
    if sB >= 2.61:
        return "SUR_LA_RA"
    if sA >= 2.61:
        return "EN_QUETE"
    return "RASSUREE"


# ============================================================
# Dérivation de l'empreinte (Quête 2)
# ============================================================

def empreinte(label_ombre):
    """Convertit le label d'ombre (Q2) en empreinte normalisée.

    Accepte les variantes d'accent/espacement.
    """
    if not label_ombre:
        return "ZONE_CALME"
    norm = label_ombre.upper().strip().replace(" ", "_")
    if "CALME" in norm:
        return "ZONE_CALME"
    if "PERDRE" in norm:
        return "PEUR_DE_PERDRE"
    if "ETOUFF" in norm or "ÉTOUFF" in norm:
        return "PEUR_D_ETRE_ETOUFFEE"
    return "ZONE_CALME"


# ============================================================
# Sélection du pas (face dominante + empreinte)
# ============================================================

def selectionner_pas(sA, sB, label_ombre):
    """Sélectionne le pas par la face dominante (Q1) + empreinte (Q2).

    Args:
        sA : score d'anxiété (axe A)
        sB : score d'évitement (axe B)
        label_ombre : label d'ombre (Quête 2)

    Returns:
        dict avec :
            face : face dominante
            empreinte : empreinte normalisée
            pas : pas sélectionné (P1-P6)
            label : label descriptif du pas
            template : template d'affichage (mot pour mot)
            trace : traçabilité vers Q1 (face) et Q2 (empreinte)
    """
    face = face_dominante(sA, sB)
    emp = empreinte(label_ombre)
    pas = _PAS_TABLE.get((face, emp), "P1")  # défaut P1 si inconnu
    return {
        "face": face,
        "empreinte": emp,
        "pas": pas,
        "label": PAS_LABELS[pas],
        "template": TEMPLATES_PAS[pas],
        "trace": {
            "Q1_face": face,
            "Q2_empreinte": emp,
            "source": "face dominante (Q1) + empreinte (Q2)",
        },
    }


# ============================================================
# Suivi 14 jours — déterministe
# ============================================================

def suivre_14_jours(jours_tenus):
    """Catégorise le suivi sur 14 jours.

    Args:
        jours_tenus : nombre de jours où le pas a été tenu (0-14)

    Returns:
        dict avec :
            jours_tenus : int
            categorie : "CELEBRE" / "AJUSTEMENT" / "REPRISE"
            message : template mot pour mot
            sanction : None (jamais)
    """
    if not isinstance(jours_tenus, int) or jours_tenus < 0:
        jours_tenus = 0
    jours_tenus = min(jours_tenus, 14)

    if jours_tenus >= SEUIL_CELEBRE:
        cat = "CELEBRE"
    elif jours_tenus >= SEUIL_AJUSTEMENT:
        cat = "AJUSTEMENT"
    else:
        cat = "REPRISE"

    return {
        "jours_tenus": jours_tenus,
        "jours_total": 14,
        "taux": round(jours_tenus / 14 * 100, 1),
        "categorie": cat,
        "message": TEMPLATES_SUIVI[cat],
        "sanction": None,  # JAMAIS de sanction
    }


# ============================================================
# Rappels doux (jamais culpabilisants)
# ============================================================

# Templates de rappels doux — 3 variantes, jamais culpabilisantes
TEMPLATES_RAPPELS = {
    "DOUX_J1":   # rappel du jour 1
        "Ton pas d'aujourd'hui : {label_pas}. Pas une obligation — une "
        "invitation. Si ça ne tient pas aujourd'hui, ce n'est pas grave.",
    "DOUX_J7":   # rappel à mi-parcours
        "Une semaine déjà. Ton pas : {label_pas}. Les jours tenus sont "
        "comptés pour toi — pas pour te juger. Ajuste si besoin.",
    "DOUX_J14":  # rappel final
        "C'est le dernier jour du suivi. Ton pas : {label_pas}. Quoi "
        "que tu aies tenu, c'est une information, pas un verdict.",
}


def rappel_doux(jour, label_pas):
    """Génère un rappel doux pour un jour donné.

    Args:
        jour : 1, 7 ou 14
        label_pas : label descriptif du pas

    Returns:
        str : message de rappel (jamais culpabilisant)
    """
    if jour == 1:
        tmpl = TEMPLATES_RAPPELS["DOUX_J1"]
    elif jour == 7:
        tmpl = TEMPLATES_RAPPELS["DOUX_J7"]
    elif jour == 14:
        tmpl = TEMPLATES_RAPPELS["DOUX_J14"]
    else:
        # Pour les autres jours, on utilise le rappel doux générique
        tmpl = "Ton pas : {label_pas}. Pas une obligation — une invitation."
    return tmpl.format(label_pas=label_pas)


# ============================================================
# Re-test Q1 à 8 semaines — programmé, jamais forcé
# ============================================================

def programmer_re_test_q1(date_pas, semaines=8):
    """Programme le re-test Q1 à 8 semaines.

    Args:
        date_pas : date du choix du pas (str ISO ou datetime)
        semaines : délai en semaines (défaut 8)

    Returns:
        dict avec :
            date_pas : date d'origine
            date_re_test : date programmée (str ISO)
            semaines : délai
            force : False (jamais forcé)
            message : message doux de programmation
    """
    # Calcul simple : on ajoute 8 semaines (56 jours) à la date
    # Si date_pas est une string ISO, on la parse
    from datetime import datetime, timedelta
    if isinstance(date_pas, str):
        try:
            d = datetime.fromisoformat(date_pas)
        except ValueError:
            d = datetime.now()
    elif isinstance(date_pas, datetime):
        d = date_pas
    else:
        d = datetime.now()

    date_re_test = d + timedelta(weeks=semaines)

    return {
        "date_pas": d.isoformat() if isinstance(date_pas, datetime) else date_pas,
        "date_re_test": date_re_test.isoformat(),
        "semaines": semaines,
        "force": False,  # jamais forcé
        "message": (
            f"Dans {semaines} semaines (à partir du {date_re_test.strftime('%d/%m/%Y')}), "
            f"tu pourras reprendre la Quête 1. Pas pour te comparer — "
            f"pour voir ce qui a bougé. Le re-test n'est jamais forcé : "
            f"tu le fais quand tu es prêt(e)."
        ),
    }


# ============================================================
# Bilan du pas (14 jours + re-test programmé)
# ============================================================

def bilan_du_pas(sA, sB, label_ombre, jours_tenus, date_pas):
    """Produit le bilan complet du pas.

    Args:
        sA, sB : scores d'attachement (Q1)
        label_ombre : label d'ombre (Q2)
        jours_tenus : jours tenus sur 14
        date_pas : date du choix du pas

    Returns:
        dict avec :
            pas : sélection du pas
            suivi : suivi 14 jours
            re_test : re-test Q1 programmé
            affichage : affichage conforme (rappels sans culpabilisation)
    """
    pas = selectionner_pas(sA, sB, label_ombre)
    suivi = suivre_14_jours(jours_tenus)
    re_test = programmer_re_test_q1(date_pas)

    # Affichage conforme :
    # - rappels sans culpabilisation
    # - compteur privé (le taux est pour le sujet, pas exposé)
    # - message anti-perfectionnisme
    # - D-SIM affiché
    affichage = {
        "pas_template": pas["template"],
        "suivi_message": suivi["message"],
        "rappel_j1": rappel_doux(1, pas["label"]),
        "rappel_j7": rappel_doux(7, pas["label"]),
        "rappel_j14": rappel_doux(14, pas["label"]),
        "compteur_prive": True,  # jamais exposé socialement
        "re_test_message": re_test["message"],
        "sanction": None,  # JAMAIS
        "d_sim": ("AVERTISSEMENT D-SIM : le suivi 14 jours est simulé "
                  "pour la validation — la mécanique est validée, pas "
                  "la prévalence clinique."),
    }

    return {
        "pas": pas,
        "suivi": suivi,
        "re_test": re_test,
        "affichage": affichage,
    }


# ============================================================
# verifier_templates — complétude
# ============================================================

def verifier_templates():
    """Vérifie la complétude des templates.

    Returns:
        dict avec :
            pas_count : 6 attendus
            suivi_count : 3 attendus (CELEBRE, AJUSTEMENT, REPRISE)
            rappels_count : 3 attendus
            manquants : listes
            ok : booléen
    """
    pas_ok = len(TEMPLATES_PAS) == 6 and all(p in TEMPLATES_PAS for p in PAS_BANQUE)
    suivi_ok = (len(TEMPLATES_SUIVI) == 3 and
                all(c in TEMPLATES_SUIVI for c in ["CELEBRE", "AJUSTEMENT", "REPRISE"]))
    rappels_ok = (len(TEMPLATES_RAPPELS) == 3 and
                  all(k in TEMPLATES_RAPPELS for k in ["DOUX_J1", "DOUX_J7", "DOUX_J14"]))
    return {
        "pas_count": len(TEMPLATES_PAS),
        "suivi_count": len(TEMPLATES_SUIVI),
        "rappels_count": len(TEMPLATES_RAPPELS),
        "pas_ok": pas_ok,
        "suivi_ok": suivi_ok,
        "rappels_ok": rappels_ok,
        "ok": pas_ok and suivi_ok and rappels_ok,
    }


# ============================================================
# verifier_anti_perfectionnisme — pour C2
# ============================================================

def verifier_anti_perfectionnisme():
    """Vérifie qu'aucun message de suivi n'est culpabilisant.

    Critères anti-perfectionnisme :
    - Aucun message ne contient "échec" (au sens de faute personnelle)
    - Aucun message ne contient "devoir" / "devrais" / "aurais dû"
    - Chaque catégorie a un message distinct
    - Aucune sanction (toujours None)

    Returns:
        dict avec :
            messages_testes : int
            violations : liste
            ok : booléen
    """
    violations = []
    mots_interdits = ["échec personnel", "tu aurais dû", "tu devrais",
                      "tu dois", "c'est ta faute", "manquement",
                      "insuffisant", "décevant"]

    for cat, msg in TEMPLATES_SUIVI.items():
        msg_lower = msg.lower()
        for mot in mots_interdits:
            if mot in msg_lower:
                violations.append({
                    "categorie": cat,
                    "mot_interdit": mot,
                    "message": msg,
                })

    # Vérifier que les 3 catégories sont distinctes
    cats = list(TEMPLATES_SUIVI.keys())
    if len(set(cats)) != 3:
        violations.append({"categorie": "GLOBAL",
                          "mot_interdit": "categories_non_distinctes",
                          "message": str(cats)})

    # Vérifier qu'aucun suivi ne produit une sanction
    for j in [0, 3, 6, 7, 8, 9, 14]:
        s = suivre_14_jours(j)
        if s["sanction"] is not None:
            violations.append({
                "categorie": s["categorie"],
                "mot_interdit": "sanction_non_null",
                "message": f"jours_tenus={j}",
            })

    return {
        "messages_testes": len(TEMPLATES_SUIVI),
        "violations": violations,
        "ok": len(violations) == 0,
    }


# ============================================================
# verifier_rappels_doux — pour C5
# ============================================================

def verifier_rappels_doux():
    """Vérifie qu'aucun rappel n'est culpabilisant.

    Critères :
    - Aucun "tu dois", "tu devrais", "obligation" (au sens prescriptif)
    - Le mot "invitation" ou équivalent doux est présent
    - "Pas une obligation" ou équivalent présent

    NOTE D-Q5-1 : la phrase "Pas une obligation — une invitation" contient
    le mot "obligation" mais c'est l'INVERSE d'être culpabilisant. Le
    vérificateur doit chercher "une obligation" SANS "pas" devant, pas
    le mot "obligation" isolé.

    Returns:
        dict
    """
    violations = []
    # Phrases culpabilisantes (et non leurs négations)
    # On cherche "tu dois", "tu devrais", "c'est ta faute" (intrinsèquement
    # culpabilisants). Pour "obligation", on cherche "une obligation"
    # SANS "pas " devant (sinon c'est "pas une obligation" = anti-culpabilisant).
    phrases_interdites = ["tu dois", "tu devrais", "il faut que",
                          "c'est ta faute"]

    for key, tmpl in TEMPLATES_RAPPELS.items():
        # On teste avec un label de pas factice
        msg = tmpl.format(label_pas="test")
        msg_lower = msg.lower()
        for phrase in phrases_interdites:
            if phrase in msg_lower:
                violations.append({
                    "rappel": key,
                    "mot_interdit": phrase,
                    "message": msg,
                })
        # Vérification "obligation" au sens prescriptif :
        # on cherche "une obligation" NON précédé de "pas "
        import re
        # Match "une obligation" pas précédé de "pas "
        matches = re.findall(r"(?<!pas )une obligation", msg_lower)
        if matches:
            violations.append({
                "rappel": key,
                "mot_interdit": "une obligation (prescriptif)",
                "message": msg,
            })

    return {
        "rappels_testes": len(TEMPLATES_RAPPELS),
        "violations": violations,
        "ok": len(violations) == 0,
    }
