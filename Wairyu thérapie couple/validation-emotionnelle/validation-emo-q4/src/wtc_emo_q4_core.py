# -*- coding: utf-8 -*-
"""WAIRYU — WTC-EMO-Q4-01 : moteur Quête 4 émotionnelle
« Nos deux langues » — le croisement de couple émotionnel.
Construits cités : capitalisation (Gable & Reis) ; erreur du
miroir (chapitre émotionnel WTC) ; boucle des bids 86/33
(Gottman) ; co-régulation (Porges). RIO-09 cible. Déterministe."""

CANALS = ["paroles", "temps", "contact"]
DEVISE_PATTERNS = ["ALIGNE", "SURPLUS", "DEFICIT", "DORMANT",
                   "RECIPROQUE", "MIXTE_LEGER"]

# Les 9 configurations officielles (D-NOMENCLATURE — noms uniques)
CONFIG_LABELS = [
    "LANGUE COMMUNE",
    "DONNEUR NON CONVERTI (A)",
    "DONNEUR NON CONVERTI (B)",
    "LANGUE DORMANTE",
    "CROISÉE (À CONVERTIR)",
    "MIXTE POURSUITE",
    "MIXTE RETRAIT",
    "FEU CROISÉ",
    "ÉQUILIBRÉE MIXTE",
]

def devise_par_canal(donne, recoit, donne_croise=None):
    """Classification d'un canal pour un partenaire.
    donne/recoit : échelle 1-5 (items OPT-D/OPT-R).
    donne_croise : le donne de l'autre partenaire (optionnel)."""
    if donne >= 3 and recoit >= 3:
        return "ALIGNE"
    if donne >= 4 and recoit <= 2:
        return "SURPLUS"
    if donne <= 2 and recoit >= 4:
        return "DEFICIT"
    if donne <= 2 and recoit <= 2:
        return "DORMANT"
    if donne_croise is not None and donne_croise >= 4 and recoit >= 3:
        return "RECIPROQUE"
    if donne >= 3 and recoit <= 2:
        return "SURPLUS"
    return "MIXTE_LEGER"

def boucle_bids(bid_d_1, bid_r_1, bid_d_2, bid_r_2):
    """La boucle des bids croisée.
    bid_d_1 = A donne · bid_r_1 = A reçoit ·
    bid_d_2 = B donne · bid_r_2 = B reçoit
    Asymétrie si l'écart donne/reçoit d'un partenaire ≥ 2 (sur
    échelle 1-5, équivalent 25 pts sur 0-100)."""
    ecart_A = abs(bid_d_1 - bid_r_2)
    ecart_B = abs(bid_d_2 - bid_r_1)
    asymetrie = max(ecart_A, ecart_B) >= 2
    return {"ecart_A": ecart_A, "ecart_B": ecart_B,
            "asymetrie": asymetrie}

def co_regulation(er1_A, er1_B):
    """La co-régulation : les deux explosifs = la paire la plus
    instable du projet."""
    return {"explosif_A": er1_A >= 3.0,
            "explosif_B": er1_B >= 3.0,
            "paire_explosive": er1_A >= 3.0 and er1_B >= 3.0}

def configuration_devises(dev_A, dev_B, er1_A, er1_B,
                          boucle_active, inv_d_zone_A, inv_d_zone_B):
    """La matrice des 9 configurations croisées (D-NOMENCLATURE).
    dev_A/dev_B : dicts {canal: pattern} par partenaire.
    er1_A/er1_B : les faces explosion (Q1) pour la co-régulation.
    boucle_active : la boucle des bids (§boucle_bids).
    inv_d_zone_A/B : les zones d'invalidation (Q2) pour le
    croisement avec FEU CROISÉ."""
    alignes = sum(1 for c in CANALS
                  if dev_A.get(c) == "ALIGNE"
                  and dev_B.get(c) == "ALIGNE")
    surplus_A = sum(1 for c in CANALS if dev_A.get(c) == "SURPLUS")
    surplus_B = sum(1 for c in CANALS if dev_B.get(c) == "SURPLUS")
    deficit_A = sum(1 for c in CANALS if dev_A.get(c) == "DEFICIT")
    deficit_B = sum(1 for c in CANALS if dev_B.get(c) == "DEFICIT")

    co = co_regulation(er1_A, er1_B)

    if co["paire_explosive"] and boucle_active:
        return "FEU CROISÉ"
    if alignes >= 3:
        return "LANGUE COMMUNE"
    if surplus_A >= 2 and deficit_B >= 2:
        return "DONNEUR NON CONVERTI (A)"
    if surplus_B >= 2 and deficit_A >= 2:
        return "DONNEUR NON CONVERTI (B)"
    if deficit_A >= 2 and deficit_B >= 2:
        return "LANGUE DORMANTE"
    if surplus_A + surplus_B >= 2 and deficit_A + deficit_B >= 2:
        return "CROISÉE (À CONVERTIR)"
    if boucle_active and inv_d_zone_A in ("OCCASIONNEL", "FRÉQUENT") \
            and inv_d_zone_B in ("ABSENT",):
        return "MIXTE POURSUITE"
    if boucle_active and inv_d_zone_B in ("OCCASIONNEL", "FRÉQUENT") \
            and inv_d_zone_A in ("ABSENT",):
        return "MIXTE RETRAIT"
    return "ÉQUILIBRÉE MIXTE"

TEMPLATES_DEVISES = {
    "ALIGNE": "Vous parlez la même langue sur ce canal — c'est "
              "votre langue commune. Continuez.",
    "SURPLUS": "De l'amour authentique livré dans une devise que "
               "l'autre ne dépense pas — une richesse à convertir, "
               "pas une faute.",
    "DEFICIT": "L'un de vous reçoit fort sur ce canal mais ne le "
               "reçoit pas — le candidat prioritaire à un rituel "
               "de conversion.",
    "DORMANT": "Ce canal est silencieux pour vous deux — peut-être "
               "une langue que ni l'un ni l'autre n'a jamais "
               "parlée. À explorer ensemble.",
    "RECIPROQUE": "Chacun donne dans la devise de l'autre — c'est "
                  "déjà le change, et c'est une richesse.",
    "MIXTE_LEGER": "Un mélange de dons et de besoins sur ce "
                   "canal — à explorer ensemble.",
}

TEMPLATES_CONFIG = {
    "LANGUE COMMUNE": "Vos deux langues se parlent — vous êtes "
                      "alignés sur les trois canaux. C'est une "
                      "richesse que peu de couples ont.",
    "DONNEUR NON CONVERTI (A)": "L'un de vous donne beaucoup dans "
                      "une devise que l'autre ne reçoit pas — ce "
                      "n'est pas un manque d'amour, c'est un "
                      "problème de traduction. À explorer ensemble.",
    "DONNEUR NON CONVERTI (B)": "Idem, de l'autre côté.",
    "LANGUE DORMANTE": "Vos deux langues sont silencieuses sur "
                       "ces canaux — peut-être des langues que "
                       "ni l'un ni l'autre n'a jamais ose parler.",
    "CROISÉE (À CONVERTIR)": "Chacun donne dans une devise que "
                       "l'autre ne reçoit pas, et reçoit dans une "
                       "devise que l'autre ne donne pas — le "
                       "circuit croisé. C'est le cas le plus "
                       "courant des couples qui s'aiment mais se "
                       "ratent.",
    "MIXTE POURSUITE": "L'un poursuit les signes d'affection, "
                       "l'autre se retire — c'est la boucle "
                       "poursuite-retrait, appliquée aux devises.",
    "MIXTE RETRAIT": "Idem, l'inverse.",
    "FEU CROISÉ": "Vous êtes tous les deux en dysrégulation "
                  "explosive — c'est la paire la plus instable "
                  "du projet. Ce n'est pas une faute, c'est une "
                  "configuration qui exige des protocoles "
                  "d'apaisement avant tout dialogue.",
    "ÉQUILIBRÉE MIXTE": "Vos deux langues se répondent sur les "
                        "canaux, avec quelques différences — "
                        "c'est le paysage le plus courant des "
                        "couples réels. À explorer, pas à corriger.",
}
