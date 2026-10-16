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

def configuration_devises(donne_A, recoit_A, donne_B, recoit_B,
                          er1_A, er1_B, boucle_active,
                          inv_A, inv_B):
    """M1 (R1 v3) — D-EMO-5 + moyennes par canal (faute n°29 corrigée).
    Les propriétés globales (LANGUE COMMUNE, DONNEUR, DORMANTE) sont
    évaluées sur la MOYENNE des 3 canaux (réduit le bruit de √3).
    Seule CROISÉE reste canal-spécifique (pattern par nature)."""
    # Moyennes par canal (réduisent le bruit de √3)
    dA_m = round(sum(donne_A[c] for c in CANALS) / 3, 2)
    rA_m = round(sum(recoit_A[c] for c in CANALS) / 3, 2)
    dB_m = round(sum(donne_B[c] for c in CANALS) / 3, 2)
    rB_m = round(sum(recoit_B[c] for c in CANALS) / 3, 2)

    # FEU CROISÉ (priorité sécurité)
    if er1_A >= 3.0 and er1_B >= 3.0 and boucle_active:
        return "FEU CROISÉ"

    # MIXTE POURSUITE / RETRAIT (priorité boucle)
    if boucle_active and inv_A == "FRÉQUENT" and inv_B == "ABSENT":
        return "MIXTE POURSUITE"
    if boucle_active and inv_B == "FRÉQUENT" and inv_A == "ABSENT":
        return "MIXTE RETRAIT"

    # LANGUE COMMUNE : les deux donnent ET reçoivent bien (moyennes)
    if dA_m >= 3 and rA_m >= 2.5 and dB_m >= 3 and rB_m >= 2.5:
        return "LANGUE COMMUNE"

    # DONNEUR NON CONVERTI : un donne fort (moyenne), LUI-MÊME reçoit peu
    if dA_m >= 4 and rA_m <= 2.5:
        return "DONNEUR NON CONVERTI (A)"
    if dB_m >= 4 and rB_m <= 2.5:
        return "DONNEUR NON CONVERTI (B)"

    # LANGUE DORMANTE : les deux donnent et reçoivent peu (moyennes)
    if dA_m <= 2.5 and rA_m <= 2.5 and dB_m <= 2.5 and rB_m <= 2.5:
        return "LANGUE DORMANTE"

    # CROISÉE : canal-spécifique (le seul pattern qui exige le niveau canal)
    canal_don_A = max(CANALS, key=lambda c: donne_A[c])
    canal_don_B = max(CANALS, key=lambda c: donne_B[c])
    if (donne_A[canal_don_A] >= 4 and donne_B[canal_don_B] >= 4
            and canal_don_A != canal_don_B):
        return "CROISÉE (À CONVERTIR)"

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
