# -*- coding: utf-8 -*-
"""WAIRYU — WTC-EMO-Q5-01 : moteur Quête 5 émotionnelle
« Mon premier geste du cœur » — le pas + suivi 14 jours.
RIO-10 cible. Déterministe · local.
Option B autorisée — périmètre verrouillé. Voir Section F validation.

Construits cités : engagement comportemental (Gollwitzer) ;
auto-compassion (Neff) ; boucle de réassessation douce (Prochaska).
Adapté du gabarit RIO-05 (attachement Q5) pour la dimension émotionnelle.

D-DENSITÉ : pas de voie B (cohérent Q3-Q4 émotionnel).
D-ÉCHELLE : seuils 3,00 (milieu échelle 5 points).
D-CANAL : production locale (code non transmis par IM gateway)."""

# ============================================================
# Tables du core
# ============================================================

# Les 8 pas possibles (banque fermée) — arbre de priorité
# INV > RC > CAP > FE1 > FE6 > ER1 > ER2 > FE3
PAS_ORDER = ["INV", "RC", "CAP", "FE1", "FE6", "ER1", "ER2", "FE3"]

PAS_LABELS = {
    "INV":  "Nommer l'invalidation quand elle vient",
    "RC":   "Formuler ton besoin au lieu d'attendre qu'on le devine",
    "CAP":  "Célébrer la bonne nouvelle de l'autre",
    "FE1":  "Écouter sans corriger ni minimiser",
    "FE6":  "Donner dans la devise de l'autre",
    "ER1":  "Reconnaître quand l'émotion monte trop vite",
    "ER2":  "Nommer ce que tu ressens au lieu de le cacher",
    "FE3":  "Répondre aux bonnes nouvelles avec enthousiasme",
}

# 3 templates anti-perfectionnisme (comme RIO-05, adaptés émotionnel)
TEMPLATES_SUIVI = {
    "CELEBRE":   # ≥ 10/14
        "Tu as tenu ton geste du cœur 10 jours sur 14 ou plus — c'est une "
        "assise réelle. Les jours manqués ne sont pas une faute. Le geste "
        "est entré dans ta semaine. Garde-le tel quel, ou ajuste-le si tu "
        "sens qu'il pourrait mieux tealler.",
    "AJUSTEMENT":  # 6-9/14
        "Tu as tenu ton geste du cœur 7 jours sur 14. C'est un début "
        "d'assise — pas un échec. Les jours manqués ne sont pas une faute. "
        "Peut-être le geste demande-t-il un ajustement : plus petit, plus "
        "simple, mieux placé. La suite du parcours t'aide à le voir.",
    "REPRISE":   # ≤ 5/14
        "Tu as tenu ton geste du cœur 3 jours sur 14. Ce n'est pas un "
        "échec — c'est un signal. Le geste tel qu'il est ne tient pas dans "
        "ta vie actuelle. Peut-être est-il trop grand, mal placé, ou le "
        "moment n'est pas le bon. La suite du parcours t'aide à le "
        "reprendre, autrement, sans pression.",
}

# Seuils anti-perfectionnisme (comme RIO-05)
SEUIL_CELEBRE = 10
SEUIL_AJUSTEMENT = 6
# ≤ 5 → REPRISE

# 3 templates de rappels doux (comme RIO-05)
TEMPLATES_RAPPELS = {
    "DOUX_J1":   "Ton geste d'aujourd'hui : {label_pas}. Pas une obligation — "
                 "une invitation. Si ça ne tient pas aujourd'hui, ce n'est pas grave.",
    "DOUX_J7":   "Une semaine déjà. Ton geste : {label_pas}. Les jours tenus "
                 "sont comptés pour toi — pas pour te juger. Ajuste si besoin.",
    "DOUX_J14":  "C'est le dernier jour du suivi. Ton geste : {label_pas}. "
                 "Quoi que tu aies tenu, c'est une information, pas un verdict.",
}

# Templates des pas
TEMPLATES_PAS = {
    "INV":  "Ton premier geste du cœur : nommer l'invalidation quand elle "
            "vient — sans accuser, sans encaisser. Dire 'ce que tu dis "
            "minimise ce que je ressens' au lieu de subir.",
    "RC":   "Ton premier geste du cœur : formuler ton besoin au lieu "
            "d'attendre qu'on le devine. Pas un reproche — une demande "
            "claire, qui peut être refusée.",
    "CAP":  "Ton premier geste du cœur : célébrer la bonne nouvelle de "
            "l'autre — doubled la joie au lieu de la laisser passer.",
    "FE1":  "Ton premier geste du cœur : écouter sans corriger ni "
            "minimiser — juste être là, présent, sans conseil.",
    "FE6":  "Ton premier geste du cœur : donner dans la devise de "
            "l'autre — pas dans la tienne. Changer de canal pour toucher.",
    "ER1":  "Ton premier geste du cœur : reconnaître quand l'émotion "
            "monte trop vite — l'observer avant de la montrer.",
    "ER2":  "Ton premier geste du cœur : nommer ce que tu ressens au "
            "lieu de le cacher — dire 'je suis blessé(e)' au lieu "
            "d'encaisser seul(e).",
    "FE3":  "Ton premier geste du cœur : répondre aux bonnes nouvelles "
            "avec enthousiasme — doublé la joie de l'autre.",
}

PHRASE_PIVOT = "—"


# ============================================================
# Sélection du pas — arbre de priorité déterministe
# ============================================================
# INV > RC > CAP > FE1 > FE6 > ER1 > ER2 > FE3
# Chaque pas a une condition d'héritage (issue des quêtes précédentes).

def selectionner_pas(profil):
    """Sélectionne le pas par arbre de priorité.

    Args:
        profil : dict avec les héritages :
            - inv_d_zone : zone d'invalidation donnée (Q2 émotionnel)
            - rc_label : label de reproche-code (Q2 émotionnel)
            - cap : type de capitalisation (Q1/Q3 émotionnel)
            - fe1_active : bool (Q3 émotionnel — force F-E1)
            - fe6_active : bool (Q3 émotionnel — force F-E6)
            - er1_moyenne : float (Q1 émotionnel — face explosion)
            - er2_moyenne : float (Q1 émotionnel — face mur)
            - fe3_active : bool (Q3 émotionnel — force F-E3)

    Returns:
        dict avec : pas, label, template, trace (source de l'héritage)
    """
    inv_d_zone = profil.get("inv_d_zone", "ABSENT")
    rc_label = profil.get("rc_label", "BESOIN DISCRET")
    cap = profil.get("cap", "PD")
    fe1_active = profil.get("fe1_active", False)
    fe6_active = profil.get("fe6_active", False)
    er1_moyenne = profil.get("er1_moyenne", 3.0)
    er2_moyenne = profil.get("er2_moyenne", 3.0)
    fe3_active = profil.get("fe3_active", False)

    # Arbre de priorité (dans l'ordre exact — 100% déterministe)
    if inv_d_zone in ("OCCASIONNEL", "FRÉQUENT"):
        pas = "INV"
        source = "inv_d_zone (Q2 émotionnel)"
    elif rc_label in ("REPROCHE-CODE ACTIF", "BESOIN VIVANT, FORMULATION MIXTE"):
        pas = "RC"
        source = "rc_label (Q2 émotionnel)"
    elif cap != "AC":
        pas = "CAP"
        source = "cap (Q1/Q3 émotionnel)"
    elif fe1_active:
        pas = "FE1"
        source = "fe1_active (Q3 émotionnel)"
    elif fe6_active:
        pas = "FE6"
        source = "fe6_active (Q3 émotionnel)"
    elif er1_moyenne >= 3.0:
        pas = "ER1"
        source = "er1_moyenne (Q1 émotionnel)"
    elif er2_moyenne >= 3.0:
        pas = "ER2"
        source = "er2_moyenne (Q1 émotionnel)"
    elif fe3_active:
        pas = "FE3"
        source = "fe3_active (Q3 émotionnel)"
    else:
        # Fallback : ER2 par défaut (le mur est le plus commun)
        pas = "ER2"
        source = "fallback (aucun héritage actif)"

    return {
        "pas": pas,
        "label": PAS_LABELS[pas],
        "template": TEMPLATES_PAS[pas],
        "trace": {"source": source, "arbre": "INV > RC > CAP > FE1 > FE6 > ER1 > ER2 > FE3"},
    }


# ============================================================
# Suivi 14 jours — déterministe (comptage de booléens)
# ============================================================

def suivre_14_jours(jours_tenus):
    """Catégorise le suivi sur 14 jours.

    Args:
        jours_tenus : int (0-14) — nombre de jours où le geste a été tenu

    Returns:
        dict avec : jours_tenus, categorie, message, sanction (toujours None)
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
# Rappels doux (comme RIO-05)
# ============================================================

def rappel_doux(jour, label_pas):
    """Génère un rappel doux pour un jour donné."""
    if jour == 1:
        tmpl = TEMPLATES_RAPPELS["DOUX_J1"]
    elif jour == 7:
        tmpl = TEMPLATES_RAPPELS["DOUX_J7"]
    elif jour == 14:
        tmpl = TEMPLATES_RAPPELS["DOUX_J14"]
    else:
        tmpl = "Ton geste : {label_pas}. Pas une obligation — une invitation."
    return tmpl.format(label_pas=label_pas)


# ============================================================
# Re-test à 8 semaines — programmé, jamais forcé (comme RIO-05)
# ============================================================

def programmer_re_test(date_pas, semaines=8):
    """Programme le re-test Q1 émotionnel à 8 semaines."""
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
            f"tu pourras reprendre la Quête 1 émotionnelle. Pas pour te comparer — "
            f"pour voir ce qui a bougé. Le re-test n'est jamais forcé : "
            f"tu le fais quand tu es prêt(e)."
        ),
    }


# ============================================================
# Bilan du pas (14 jours + re-test programmé)
# ============================================================

def bilan_du_pas(profil, jours_tenus, date_pas):
    """Produit le bilan complet du pas."""
    pas = selectionner_pas(profil)
    suivi = suivre_14_jours(jours_tenus)
    re_test = programmer_re_test(date_pas)

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
    """Vérifie la complétude des templates."""
    pas_ok = len(TEMPLATES_PAS) == 8 and all(p in TEMPLATES_PAS for p in PAS_ORDER)
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
# verifier_anti_perfectionnisme — pour C3
# ============================================================

def verifier_anti_perfectionnisme():
    """Vérifie qu'aucun message n'est culpabilisant."""
    violations = []
    mots_interdits = ["échec personnel", "tu aurais dû", "tu devrais",
                      "tu dois", "c'est ta faute", "manquement",
                      "insuffisant", "décevant"]

    for cat, msg in TEMPLATES_SUIVI.items():
        msg_lower = msg.lower()
        for mot in mots_interdits:
            if mot in msg_lower:
                violations.append({"categorie": cat, "mot_interdit": mot})

    # Vérifier qu'aucune sanction n'est produite
    for j in [0, 3, 5, 6, 7, 9, 10, 14]:
        s = suivre_14_jours(j)
        if s["sanction"] is not None:
            violations.append({"categorie": s["categorie"],
                               "mot_interdit": "sanction_non_null"})

    return {
        "messages_testes": len(TEMPLATES_SUIVI),
        "violations": violations,
        "ok": len(violations) == 0,
    }
