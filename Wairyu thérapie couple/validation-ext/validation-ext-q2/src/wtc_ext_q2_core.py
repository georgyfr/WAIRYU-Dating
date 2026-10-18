# -*- coding: utf-8 -*-
"""WAIRYU — WTC-EXT-Q2 : moteur Quête 2 Extensions (Générationnelle)
« Notre conversation de l'horizon » — RIO-17 cible.

SPEC VERROUILLÉE (5bc9600) — tranchages A1-A6 :
A1 titre « Notre conversation de l'horizon » · A2 ZÉRO item nouveau (entrées =
sorties RIO-16 contresignées des deux rives) · A3 axe H en 3 niveaux à bornes
propres Faible < 2,50 ≤ Modéré < 3,50 ≤ Forte (L et C hors matrice, en
asymétries averties) · A4 L6 verbatim structurelle (percentiles seed 42,
boucle probable si écart ≥ 30, avertissement styles dissemblables) + L5
empreinte (3 inférences Générationnelles VERROUILLÉES mot pour mot) ·
A5 les 9 noms §2 mot pour mot · A6 0 verdict croisé sur l'axe C.

Couches canon : patron « croisement à 9 configurations, percentiles » (lignes
297-298) · L5-L6 reportées à Q2 par A4-Q1 (lignes 261-262) · palier §5.4 =
max-niveau croisé (une règle, zéro exception — leçon Q5-A3) · override D-CRISE
(pattern SM-Q4-A4 : ligne 369, JAMAIS de croisement de couple en crise — la
configuration est calculée et tracée, jamais déployée comme verdict) ·
entrée au croisement : RQS INVALIDE = pas d'entrée (ligne 257) · gabarit
universel §5.1 (lignes 202-212) · non-évaluation des tiers (ligne 363) ·
C6 anti-fabrication temporelle À DEUX (A5-Q1 transposée) · re-tests L7 NON
consommés (une mesure un rôle — SPEC §7)."""
import math
import numpy as np

# ── A3 — bornes de croisement (propres, une mesure un rôle) ──────────────────
BORNES_CROISEMENT = (2.50, 3.50)
NIVEAUX_CROISEMENT = ["FAIBLE", "MODÉRÉE", "FORTE"]
PALIER_VERT = "EXERCICE MAISON"
PALIER_ORANGE = "MODULE DE COUPLE"
PALIER_ROUGE = "ORIENTATION"

# ── A5 — les 9 configurations (table §2 mot pour mot) ────────────────────────
CONFIGS = {
    1: {"nom": "LA MÊME HEURE", "h1": "FAIBLE", "h2": "FAIBLE",
        "lecture": "les deux horloges tournent discrètes — zone calme dite "
                   "comme telle (§5.5), rien à fabriquer"},
    2: {"nom": "LE CADRAN QUI S'ÉVEILLE", "h1": "FAIBLE", "h2": "MODÉRÉE",
        "lecture": "une rive entend son horloge, l'autre pas encore"},
    3: {"nom": "L'HORLOGE SEULE", "h1": "FAIBLE", "h2": "FORTE",
        "lecture": "tout le vécu générationnel porté par une rive — asymétrie "
                   "affichée en avertissement, jamais portée comme reproche (C7)"},
    4: {"nom": "L'ÉCHO QUI ATTEND", "h1": "MODÉRÉE", "h2": "FAIBLE",
        "lecture": "l'horloge active de la rive 1 sans écho déclaré — miroir "
                   "de la 2"},
    5: {"nom": "DEUX CADRANS", "h1": "MODÉRÉE", "h2": "MODÉRÉE",
        "lecture": "les deux horloges tournent — le terrain naturel de la "
                   "conversation de l'horizon"},
    6: {"nom": "L'HORLOGE QUI DEVANCE", "h1": "MODÉRÉE", "h2": "FORTE",
        "lecture": "une rive vive, l'autre en éveil — un écart déclaré, "
                   "descriptif causal"},
    7: {"nom": "L'HORLOGE SEULE, DE L'AUTRE CÔTÉ", "h1": "FORTE", "h2": "FAIBLE",
        "lecture": "miroir de la 3 — l'unicité des labels prime sur la "
                   "symétrie (D-NOMENCLATURE)"},
    8: {"nom": "L'AUTRE QUI DEVANCE", "h1": "FORTE", "h2": "MODÉRÉE",
        "lecture": "miroir de la 6"},
    9: {"nom": "LES DEUX HORLOGES VIVES", "h1": "FORTE", "h2": "FORTE",
        "lecture": "le vécu générationnel fort des deux côtés — palier rouge "
                   "par max-niveau mécanique, sans aucun verdict temporel"},
}
MIROIR = {1: 1, 2: 4, 3: 7, 4: 2, 5: 5, 6: 8, 7: 3, 8: 6, 9: 9}

# Registre des 9 noms SM-Q4 (RIO-14) — vérification anti-collision (D-NOMENCLATURE)
REGISTRE_SM_Q4 = ("ALIGNED_FORCES", "QUIET_DRIFT", "ONE_ANCHOR", "SPLIT_CURRENTS",
                  "PARALLEL_FLOWS", "CROSS_UNDERTOW", "TWO_ANCHORS",
                  "RESCUE_TANDEM", "STORM_TOGETHER")

# ── A4 — L6 verbatim structurelle + L5 empreinte ─────────────────────────────
SEUIL_BOUCLE_PCT = 30.0        # boucle probable si écart de percentiles ≥ 30
SEUIL_STYLES = 1.00            # avertissement styles dissemblables (écart moyen)
SEUIL_ASYM = 1.00              # asymétrie L/C « marquée » (avertissement)
POP_N = 2000                   # population de référence percentiles (≥ 2 000)
POP_SEED = 42
POP_MU, POP_SD = 3.0, 0.8      # placeholder L2 — à remplacer par le pilote

INF_TAXE = "la taxe se paie à deux"
INF_SUJET = "deux horloges, un seul sujet"
INF_SILENCE = "le silence partagé est aussi une réponse"
SEUIL_INF_TAXE = 2.60          # L1 vive/forte chez une rive (lecture L3 de Q1)

# ── Entrée au croisement (ligne 257 via Q1-A4) ───────────────────────────────
SEUIL_RQS_OK, SEUIL_RQS_PRUDENCE = 85, 70
STATUTS_RQS = ("OK", "PRUDENCE", "INVALIDE")

# ── Paramètres hérités des sorties RIO-16 (addf575 — lignes 257-259) ─────────
SEUILS_L3 = (1.80, 2.60, 3.20)
CI90_DEMI = 0.4128             # placeholder L2 (SD 0,65 / α 0,85, ligne 258)

NOMENCLATURE = (list(NIVEAUX_CROISEMENT)
                + [PALIER_VERT, PALIER_ORANGE, PALIER_ROUGE]
                + [c["nom"] for c in CONFIGS.values()]
                + [INF_TAXE, INF_SUJET, INF_SILENCE]
                + ["BOUCLE PROBABLE", "STYLES DISSEMBLABLES",
                   "ASYMÉTRIE MARQUÉE", "asymétrie légère",
                   "OVERRIDE D-CRISE", "NON ENTRÉE (RQS)",
                   "ZONE CALME", "force silencieuse"] + list(STATUTS_RQS))


# ═══════════════ Niveau de croisement (A3 — bornes propres) ══════════════════
def niveau_croisement(score):
    """Faible < 2,50 ≤ Modéré < 3,50 ≤ Forte — lecture du score déclaré
    (déterministe pure, C2) ; tranchage inclusif aux bornes."""
    if score < BORNES_CROISEMENT[0]:
        return NIVEAUX_CROISEMENT[0]
    if score < BORNES_CROISEMENT[1]:
        return NIVEAUX_CROISEMENT[1]
    return NIVEAUX_CROISEMENT[2]


def config_de(n1, n2):
    """Configuration = f(niveau H rive 1, niveau H rive 2) — pure et
    déterministe (C2) ; les paires miroirs 2/4, 3/7, 6/8 (lecture symétrique,
    labels uniques)."""
    i, j = NIVEAUX_CROISEMENT.index(n1), NIVEAUX_CROISEMENT.index(n2)
    return i * 3 + j + 1


def palier_croise(n1, n2, filet):
    """Max-niveau croisé — une règle, zéro exception (leçon Q5-A3) :
    🟢 ⟺ les deux FAIBLES · 🟠 ⟺ au moins une MODÉRÉE · 🔴 ⟺ au moins une
    FORTE ; signal sécurité → override (court-circuit AVANT le verdict)."""
    if filet:
        return PALIER_ROUGE
    plus_haut = max(n1, n2, key=NIVEAUX_CROISEMENT.index)
    if plus_haut == NIVEAUX_CROISEMENT[2]:
        return PALIER_ROUGE
    if plus_haut == NIVEAUX_CROISEMENT[1]:
        return PALIER_ORANGE
    return PALIER_VERT


# ═══════════════ L6 — percentiles (mid-rank, pattern SM-Q4) ══════════════════
def percentile_de(valeur, population):
    """Percentile mid-rank dans la population de référence (seed 42)."""
    tri = sorted(population)
    n = len(tri)
    inferieurs = sum(1 for v in tri if v < valeur)
    egaux = sum(1 for v in tri if v == valeur)
    return round(100.0 * (inferieurs + egaux / 2.0) / n, 1)


def boucle_probable(pa, pb):
    """L6 verbatim (ligne 262) : boucle probable si écart de percentiles ≥ 30 —
    avertissement, jamais verdict."""
    return abs(pa - pb) >= SEUIL_BOUCLE_PCT


def styles_dissemblables(moy_a, moy_b):
    """Avertissement styles dissemblables : écart des moyennes brutes ≥ 1,00
    (note L6 de Q1 — sans verdict)."""
    return round(abs(moy_a - moy_b), 2) >= SEUIL_STYLES


def lecture_asymetrie(score_a, score_b):
    """Axes L et C hors matrice (A3-a/A6) : asymétrie nommée affichée en
    avertissement — jamais verdict, jamais reproche."""
    ecart = round(abs(score_a - score_b), 2)
    if ecart >= SEUIL_ASYM:
        return {"ecart": ecart, "lecture": "ASYMÉTRIE MARQUÉE"}
    return {"ecart": ecart, "lecture": "asymétrie légère"}


# ═══════════════ L5 — empreinte du croisement (3 inférences) ═════════════════
def inferences_L5(sa, sb, n1, n2):
    """Empreinte situationnelle du croisement (ligne 261) — inférences
    Générationnelles descriptives causales, sans injonction (libellés
    VERROUILLÉS A4). Déclencheurs mécaniques documentés."""
    return {
        INF_TAXE: max(sa["faces"]["L1"], sb["faces"]["L1"]) >= SEUIL_INF_TAXE,
        INF_SUJET: n1 != n2,
        INF_SILENCE: (sa["faces"]["C2"] > sa["faces"]["C1"])
                     and (sb["faces"]["C2"] > sb["faces"]["C1"]),
    }


# ═══════════════ Classifier du croisement (à deux) ═══════════════════════════
def classifier_croisement(sa, sb, population=None):
    """Croisement des sorties RIO-16 contresignées des deux rives (A2-a).
    Ordre : (1) override D-CRISE — court-circuit AVANT le verdict de couple
    (la configuration reste calculée et tracée, jamais déployée) ;
    (2) entrée RQS — INVALIDE chez une rive = pas d'entrée (ligne 257) ;
    (3) croisement complet."""
    filet = bool(sa["filet"] or sb["filet"])
    n1 = niveau_croisement(sa["score_H"])
    n2 = niveau_croisement(sb["score_H"])
    num = config_de(n1, n2)
    cfg = CONFIGS[num]
    out = {"niveaux": {"rive1": n1, "rive2": n2},
           "scores_H": {"rive1": sa["score_H"], "rive2": sb["score_H"]},
           "config_num": num, "config_nom": cfg["nom"],
           "config_lecture": cfg["lecture"]}
    if filet:
        out.update({
            "override": True, "entree": False, "verdict": None,
            "palier": PALIER_ROUGE,
            "bandeau": "D-CRISE : court-circuit AVANT le verdict de couple — "
                       "P-FILTRE, croisement jamais déployé sur une crise "
                       "active (configuration calculée et tracée).",
            "display": "OVERRIDE D-CRISE"})
        return out
    invalide = sa["rqs_statut"] == "INVALIDE" or sb["rqs_statut"] == "INVALIDE"
    if invalide:
        out.update({
            "override": False, "entree": False, "verdict": None,
            "palier": None,
            "bandeau": "RQS < 70 chez une rive — la rive n'entre pas au "
                       "croisement (ligne 257) ; aucun résultat de couple.",
            "display": "NON ENTRÉE (RQS)"})
        return out
    pa = pb = ecart_pct = None
    boucle = None
    if population is not None:
        pa = percentile_de(sa["aggregate"], population)
        pb = percentile_de(sb["aggregate"], population)
        ecart_pct = round(abs(pa - pb), 1)
        boucle = boucle_probable(pa, pb)
    styles = styles_dissemblables(sa["moyenne"], sb["moyenne"])
    ecart_styles = round(abs(sa["moyenne"] - sb["moyenne"]), 2)
    asym_L = lecture_asymetrie(sa["score_L"], sb["score_L"])
    asym_C = lecture_asymetrie(sa["score_C"], sb["score_C"])
    inf = inferences_L5(sa, sb, n1, n2)
    palier = palier_croise(n1, n2, False)
    zone_calme = num == 1
    force = None
    if min(sa["faces"]["L2"], sb["faces"]["L2"]) >= SEUIL_INF_TAXE:
        force = "les deux permissions à deux sont là (tirées des vraies réponses)"
    elif max(sa["faces"]["L2"], sb["faces"]["L2"]) >= SEUIL_INF_TAXE:
        force = "force silencieuse : la permission à deux est vive chez une rive"
    out.update({
        "override": False, "entree": True,
        "verdict": {"config": cfg["nom"], "palier": palier,
                    "zone_calme": zone_calme},
        "palier": palier,
        "percentiles": {"rive1": pa, "rive2": pb}, "ecart_pct": ecart_pct,
        "boucle_probable": boucle, "styles_dissemblables": styles,
        "ecart_styles": ecart_styles, "asym_L": asym_L, "asym_C": asym_C,
        "inferences_L5": inf, "force": force,
        "bandeau": None, "display": cfg["nom"]})
    return out


# ═══════════════ Templates d'affichage (autoporteurs, C5/C6/C7) ══════════════
TEMPLATES = {
    "config_1": "LA MÊME HEURE : les deux horloges tournent discrètes — zone "
                "calme dite comme telle, rien à fabriquer.",
    "config_2": "LE CADRAN QUI S'ÉVEILLE : une rive entend son horloge, "
                "l'autre pas encore.",
    "config_3": "L'HORLOGE SEULE : tout le vécu générationnel est porté par "
                "une rive — asymétrie affichée en avertissement, jamais portée "
                "comme reproche.",
    "config_4": "L'ÉCHO QUI ATTEND : l'horloge active de la rive 1 sans écho "
                "déclaré — miroir de la 2.",
    "config_5": "DEUX CADRANS : les deux horloges tournent — le terrain "
                "naturel de la conversation de l'horizon.",
    "config_6": "L'HORLOGE QUI DEVANCE : une rive vive, l'autre en éveil — un "
                "écart déclaré, descriptif causal (« devance » = niveau "
                "déclaré plus fort, pas une position dans le temps).",
    "config_7": "L'HORLOGE SEULE, DE L'AUTRE CÔTÉ : miroir de la 3 — l'unicité "
                "des labels prime sur la symétrie.",
    "config_8": "L'AUTRE QUI DEVANCE : miroir de la 6 — écart déclaré, "
                "descriptif causal.",
    "config_9": "LES DEUX HORLOGES VIVES : le vécu générationnel est fort des "
                "deux côtés — palier servi par max-niveau mécanique, lecture "
                "déclarée comparée, sans aucun verdict temporel.",
    "boucle": "BOUCLE PROBABLE (L6) : écart de percentiles ≥ 30 entre vos deux "
              "façons de répondre — à revoir ensemble à la prochaine lecture, "
              "l'avertissement ne change aucun résultat.",
    "styles": "STYLES DISSEMBLABLES (L6) : vos deux rives répondent avec des "
              "niveaux très différents — le croisement lit l'écart déclaré "
              "comme il est, sans verdict.",
    "asym_marquee": "ASYMÉTRIE MARQUÉE sur {axe} (écart {ecart}) — affichée en "
                    "avertissement, jamais portée comme reproche.",
    "asym_legere": "asymétrie légère sur {axe} (écart {ecart}) — descriptive.",
    "inf_taxe": "Empreinte (L5) : la taxe se paie à deux — une taxe de "
                "justification forte déclarée par une rive renchérit la "
                "conversation pour les deux.",
    "inf_sujet": "Empreinte (L5) : deux horloges, un seul sujet — le sujet "
                 "générationnel existe dès qu'une rive le porte ; la "
                 "conversation à deux demande les deux permissions.",
    "inf_silence": "Empreinte (L5) : le silence partagé est aussi une réponse "
                   "— une conversation évitée des deux côtés est la "
                   "configuration actuelle, pas un vide.",
    "palier_vert": "Palier 🟢 EXERCICE MAISON : une petite pratique à soi — si "
                   "la zone est calme, rien à fabriquer.",
    "palier_orange": "Palier 🟠 MODULE DE COUPLE : un temps à deux autour de la "
                     "conversation de l'horizon.",
    "palier_rouge": "Palier 🔴 ORIENTATION : le chemin le plus court, pas un "
                    "échec.",
    "override": "D-CRISE : court-circuit AVANT le verdict de couple — P-FILTRE, "
                "croisement jamais déployé sur une crise active (configuration "
                "calculée et tracée).",
    "non_entree": "RQS < 70 chez une rive — la rive n'entre pas au croisement ; "
                  "aucun résultat de couple.",
    "force_permissions": "Ta zone de force, tirée des vraies réponses : "
                         "{force}.",
    "ombre_config": "Ce que l'on voit dans vos réponses : {lecture} — "
                    "descriptif causal, sans étiquette.",
    "aide_seuils": "QUAND DEMANDER DE L'AIDE : tout signal de crise chez l'une "
                   "des rives → P-FILTRE — 3919 / 3114 (le croisement n'est "
                   "jamais déployé sur une crise active).",
    "re_test_non_consomme": "Les re-tests à 8 semaines ne sont pas consommés "
                            "ici — une mesure un rôle (SPEC §7).",
}

D_SIM = ("AVERTISSEMENT D-SIM : résultats issus de simulations (seed 42) — "
         "la mécanique est validée, pas la prévalence clinique.")


# ═══════════════ D-TABLE (C1 — cas exhaustifs) ═══════════════════════════════
def _sortie_test(score_h, rqs="OK", filet=False, score_l=2.40, score_c=2.40,
                 faces=None, aggregate=2.40, moyenne=2.40):
    return {"score_H": score_h, "score_L": score_l, "score_C": score_c,
            "faces": faces or {"H1": score_h, "H2": score_h, "L1": 2.4,
                               "L2": 2.4, "C1": 2.4, "C2": 2.4},
            "rqs_statut": rqs, "filet": filet, "aggregate": aggregate,
            "moyenne": moyenne}


def verifier_d_table(population=None):
    """D-VÉRITÉ : les RÈGLES prouvées exactement (leçon Q5 : C1 croisé sur cas
    de table, pas sur données bruitées)."""
    t = {}
    # niveaux de croisement : bornes exactes (A3, tranchage inclusif)
    t["niveau_2_49_faible"] = niveau_croisement(2.49) == "FAIBLE"
    t["niveau_2_50_moderée"] = niveau_croisement(2.50) == "MODÉRÉE"
    t["niveau_3_49_moderée"] = niveau_croisement(3.49) == "MODÉRÉE"
    t["niveau_3_50_forte"] = niveau_croisement(3.50) == "FORTE"
    # 9 configurations : noms exacts + paires (A5)
    for num, cfg in CONFIGS.items():
        obtenu = config_de(cfg["h1"], cfg["h2"])
        t[f"config_{num}_paire"] = obtenu == num
    t["noms_uniques"] = len({c["nom"] for c in CONFIGS.values()}) == 9
    t["noms_hors_registre_sm_q4"] = (
        not ({c["nom"] for c in CONFIGS.values()} & set(REGISTRE_SM_Q4)))
    # anti-inversion des rives : f(F, M) = 2 ≠ f(M, F) = 4 (C2)
    t["anti_inversion_2_4"] = (config_de("FAIBLE", "MODÉRÉE") == 2
                               and config_de("MODÉRÉE", "FAIBLE") == 4)
    t["anti_inversion_3_7"] = (config_de("FAIBLE", "FORTE") == 3
                               and config_de("FORTE", "FAIBLE") == 7)
    t["anti_inversion_6_8"] = (config_de("MODÉRÉE", "FORTE") == 6
                               and config_de("FORTE", "MODÉRÉE") == 8)
    # miroirs : la paire échangée donne le miroir (ou soi pour 1/5/9)
    ok_miroir = all(
        config_de(cfg["h2"], cfg["h1"]) == MIROIR[num]
        for num, cfg in CONFIGS.items())
    t["miroirs_corrects"] = ok_miroir
    # palier croisé : max-niveau (note de verrouillage §3)
    t["palier_ff_vert"] = palier_croise("FAIBLE", "FAIBLE", False) == PALIER_VERT
    t["palier_fm_orange"] = palier_croise("FAIBLE", "MODÉRÉE", False) == PALIER_ORANGE
    t["palier_mm_orange"] = palier_croise("MODÉRÉE", "MODÉRÉE", False) == PALIER_ORANGE
    t["palier_mf_rouge"] = palier_croise("MODÉRÉE", "FORTE", False) == PALIER_ROUGE
    t["palier_ff_rouge"] = palier_croise("FORTE", "FORTE", False) == PALIER_ROUGE
    # override D-CRISE : une seule rive en crise suffit, AVANT le verdict
    ov = classifier_croisement(_sortie_test(1.9, filet=True),
                               _sortie_test(3.9), population=population)
    t["override_une_rive"] = (ov["override"] and ov["verdict"] is None
                              and ov["palier"] == PALIER_ROUGE
                              and ov["display"] == "OVERRIDE D-CRISE")
    ov2 = classifier_croisement(_sortie_test(3.9), _sortie_test(3.9, filet=True),
                                population=population)
    t["override_autre_rive"] = (ov2["override"] and ov2["verdict"] is None)
    # non-entrée RQS (ligne 257) : INVALIDE chez une rive = pas d'entrée
    ne = classifier_croisement(_sortie_test(1.9, rqs="INVALIDE"),
                               _sortie_test(3.0), population=population)
    t["non_entree_rqs"] = (ne["entree"] is False and ne["verdict"] is None
                           and ne["display"] == "NON ENTRÉE (RQS)")
    ok_ne = classifier_croisement(_sortie_test(1.9, rqs="PRUDENCE"),
                                  _sortie_test(3.0), population=population)
    t["prudence_entre"] = ok_ne["entree"] is True
    # croisement complet : config tracée + palier + zone calme honnête
    pop = population if population is not None else [3.0] * 10
    crois = classifier_croisement(_sortie_test(1.9), _sortie_test(2.1),
                                  population=pop)
    t["croisement_config_1"] = crois["config_num"] == 1
    t["croisement_zone_calme"] = (crois["verdict"]["zone_calme"] is True
                                  and "rien à fabriquer" in TEMPLATES["config_1"])
    crois_9 = classifier_croisement(_sortie_test(3.9), _sortie_test(3.7),
                                    population=pop)
    t["croisement_config_9"] = crois_9["config_num"] == 9
    t["croisement_palier_9"] = crois_9["palier"] == PALIER_ROUGE
    # L6 : boucle probable (écart ≥ 30) + styles
    t["boucle_29_9_faux"] = boucle_probable(65.0, 94.9) is False
    t["boucle_30_vrai"] = boucle_probable(65.0, 95.0) is True
    t["styles_0_99_faux"] = styles_dissemblables(2.00, 2.99) is False
    t["styles_1_00_vrai"] = styles_dissemblables(2.00, 3.00) is True
    # asymétries : marquée vs légère
    am = lecture_asymetrie(3.50, 2.40)
    al = lecture_asymetrie(2.40, 2.10)
    t["asym_marquee_1_1"] = am["lecture"] == "ASYMÉTRIE MARQUÉE"
    t["asym_legere_0_3"] = al["lecture"] == "asymétrie légère"
    # L5 : déclencheurs mécaniques des 3 inférences
    faces_taxe = {"H1": 1.9, "H2": 1.9, "L1": 2.8, "L2": 2.4, "C1": 2.4, "C2": 2.4}
    faces_calm = {"H1": 1.9, "H2": 1.9, "L1": 2.0, "L2": 2.4, "C1": 2.4, "C2": 2.4}
    faces_evite = {"H1": 1.9, "H2": 1.9, "L1": 2.0, "L2": 2.4, "C1": 2.0, "C2": 2.8}
    inf1 = inferences_L5(_sortie_test(1.9, faces=faces_taxe),
                         _sortie_test(1.9, faces=faces_calm), "FAIBLE", "FAIBLE")
    t["inf_taxe_declenchee"] = inf1[INF_TAXE] is True
    t["inf_sujet_non_faible_faible"] = inf1[INF_SUJET] is False
    inf2 = inferences_L5(_sortie_test(1.9, faces=faces_evite),
                         _sortie_test(1.9, faces=faces_evite), "FAIBLE", "FAIBLE")
    t["inf_silence_declenchee"] = inf2[INF_SILENCE] is True
    inf3 = inferences_L5(_sortie_test(1.9), _sortie_test(3.9), "FAIBLE", "FORTE")
    t["inf_sujet_declenchee"] = inf3[INF_SUJET] is True
    # percentiles : mid-rank dans une population connue
    if population is not None:
        p_min = percentile_de(min(population) - 1.0, population)
        p_max = percentile_de(max(population) + 1.0, population)
        t["percentiles_bornes"] = (p_min == 0.0 and p_max == 100.0)
    return t


def verifier_d_confirmation(couples, croisements):
    """D-CONFIRMATION : déterminisme pur (re-classification identique) +
    anti-inversion des rives sur données réelles (échange des deux sorties →
    miroir ou soi, chaque niveau venant de SA propre carte)."""
    again = [classifier_croisement(c["rive_a"], c["rive_b"],
                                   couples["population"])
             for c in couples["liste"]]
    pure = all(a == b for a, b in zip(croisements, again))
    inv_ok = n_inv = 0
    for idx, c in enumerate(couples["liste"]):
        cr = croisements[idx]
        if cr["entree"] and not cr["override"]:
            n_inv += 1
            cr_swap = classifier_croisement(c["rive_b"], c["rive_a"],
                                            couples["population"])
            if cr_swap["config_num"] == MIROIR[cr["config_num"]]:
                inv_ok += 1
    return {"deterministe": pure, "anti_inversion": f"{inv_ok}/{n_inv}",
            "anti_inversion_ok": inv_ok == n_inv and n_inv > 0}


# ═════════ Géométrie des 14 groupes (miroir du simulateur — croisé) ══════════
GEOMETRIE = {
    "G01_CONFIG_1_MEME_HEURE":     {"A": {"H1": 1.8, "H2": 2.0, "L1": 2.4, "L2": 2.5, "C1": 2.3, "C2": 2.2},
                                    "B": {"H1": 1.8, "H2": 2.0, "L1": 2.4, "L2": 2.5, "C1": 2.3, "C2": 2.2}, "n": 50},
    "G02_CONFIG_2_CADRAN_EVEILLE": {"A": {"H1": 1.8, "H2": 1.9, "L1": 2.4, "L2": 2.4, "C1": 2.4, "C2": 2.4},
                                    "B": {"H1": 2.9, "H2": 3.1, "L1": 2.5, "L2": 2.5, "C1": 2.5, "C2": 2.5}, "n": 50},
    "G03_CONFIG_3_HORLOGE_SEULE":  {"A": {"H1": 1.8, "H2": 1.9, "L1": 2.4, "L2": 2.4, "C1": 2.4, "C2": 2.4},
                                    "B": {"H1": 3.8, "H2": 4.0, "L1": 2.0, "L2": 2.0, "C1": 2.0, "C2": 2.0}, "n": 50},
    "G04_CONFIG_4_ECHO_ATTEND":    {"A": {"H1": 2.9, "H2": 3.0, "L1": 2.5, "L2": 2.5, "C1": 2.5, "C2": 2.5},
                                    "B": {"H1": 1.8, "H2": 1.8, "L1": 2.4, "L2": 2.4, "C1": 2.4, "C2": 2.4}, "n": 50},
    "G05_CONFIG_5_DEUX_CADRANS":   {"A": {"H1": 2.9, "H2": 3.1, "L1": 2.5, "L2": 2.5, "C1": 2.5, "C2": 2.5},
                                    "B": {"H1": 3.0, "H2": 3.1, "L1": 2.55, "L2": 2.55, "C1": 2.55, "C2": 2.55}, "n": 50},
    "G06_CONFIG_6_HORLOGE_DEVANCE": {"A": {"H1": 2.9, "H2": 3.1, "L1": 2.5, "L2": 2.5, "C1": 2.5, "C2": 2.5},
                                     "B": {"H1": 3.8, "H2": 4.0, "L1": 2.45, "L2": 2.45, "C1": 2.45, "C2": 2.45}, "n": 50},
    "G07_CONFIG_7_SEULE_AUTRE_COTE": {"A": {"H1": 3.7, "H2": 4.0, "L1": 2.0, "L2": 2.0, "C1": 2.0, "C2": 2.0},
                                      "B": {"H1": 1.8, "H2": 1.8, "L1": 2.4, "L2": 2.4, "C1": 2.4, "C2": 2.4}, "n": 50},
    "G08_CONFIG_8_AUTRE_DEVANCE":  {"A": {"H1": 3.7, "H2": 4.0, "L1": 2.5, "L2": 2.5, "C1": 2.5, "C2": 2.5},
                                    "B": {"H1": 3.0, "H2": 3.1, "L1": 2.5, "L2": 2.5, "C1": 2.5, "C2": 2.5}, "n": 50},
    "G09_CONFIG_9_DEUX_VIVES":     {"A": {"H1": 3.8, "H2": 4.0, "L1": 2.2, "L2": 2.2, "C1": 2.2, "C2": 2.2},
                                    "B": {"H1": 3.9, "H2": 4.0, "L1": 2.2, "L2": 2.2, "C1": 2.2, "C2": 2.2}, "n": 50},
    "G10_SIGNAL_FILET":            {"A": {"H1": 2.4, "H2": 2.4, "L1": 2.4, "L2": 2.4, "C1": 2.4, "C2": 2.4},
                                    "B": {"H1": 2.4, "H2": 2.4, "L1": 2.4, "L2": 2.4, "C1": 2.4, "C2": 2.4},
                                    "n": 40, "filet": True},
    "G11_ECART_PERCENTILES":       {"A": {"H1": 1.9, "H2": 2.1, "L1": 2.3, "L2": 2.3, "C1": 2.3, "C2": 2.3},
                                    "B": {"H1": 2.9, "H2": 3.1, "L1": 4.0, "L2": 4.0, "C1": 4.0, "C2": 4.0},
                                    "n": 40, "boucle": True},
    "G12_STYLES_DISSEMBLABLES":    {"A": {"H1": 1.8, "H2": 1.8, "L1": 1.9, "L2": 1.9, "C1": 1.9, "C2": 1.9},
                                    "B": {"H1": 2.9, "H2": 3.1, "L1": 3.8, "L2": 3.8, "C1": 3.8, "C2": 3.8},
                                    "n": 40, "styles": True},
    "G13_FRONTIERES_BORNES":       {"A": {"H1": 2.5, "H2": 2.5, "L1": 2.5, "L2": 2.5, "C1": 2.5, "C2": 2.5},
                                    "B": {"H1": 3.5, "H2": 3.5, "L1": 2.5, "L2": 2.5, "C1": 2.5, "C2": 2.5},
                                    "n": 40, "frontieres": True,
                                    "bruite": {"A": {"H1": 2.5, "H2": 2.62, "L1": 2.4, "L2": 2.4, "C1": 2.4, "C2": 2.4},
                                               "B": {"H1": 3.4, "H2": 3.48, "L1": 2.4, "L2": 2.4, "C1": 2.4, "C2": 2.4}}},
    "G14_ANTI_C6_ZONE_SEREINE":    {"A": {"H1": 1.8, "H2": 1.9, "L1": 2.4, "L2": 2.5, "C1": 2.3, "C2": 2.2},
                                    "B": {"H1": 1.8, "H2": 1.9, "L1": 2.4, "L2": 2.5, "C1": 2.3, "C2": 2.2},
                                    "n": 40, "anti_c6": True},
}

# ═════════ Calibration D-STD-2 (leçon ad01f21 — bornes DISTINCTES) ═══════════
# Population de référence L6 (ligne 262 verbatim : « correction du style par
# PERCENTILES ») — 2 000 profils, seed 42, N(3,0 ; 0,8) placeholder L2 (à
# remplacer par le pilote). Source unique : le simulateur la consomme.
rng_pop = np.random.default_rng(42)
POPULATION = np.round(rng_pop.normal(3.0, 0.8, 2000), 4).tolist()
# p̂ est estimé par Monte-Carlo DÉTERMINISTE (seed 42, 10 000 couples/groupe)
# sur le MÊME processus générateur que le simulateur : items entiers clippés
# [1,4], arrondis, inversés corrigés (5 − raw), percentiles mid-rank dans la
# population déposée. Motif : la variance empirique du score H (sd ≈ 0,262 à
# μ 1,9 ; 0,196 au plafond 3,85) et la discrétisation aux bornes s'écartent du
# modèle normal analytique — D-GÉOMÉTRIE : σ_eff = propagation structurale
# item→face, jamais modification ; la calibration est donc empirique.
SIGMA_ITEM = 0.60
N_MC = 10000
SEED_MC = 42
_POP_TRI = np.sort(np.asarray(POPULATION))
_ORDRE_FACES = ("H1", "H2", "L1", "L2", "C1", "C2")
SIGMA_H = round(0.60 / math.sqrt(6.0), 4)   # σ normal de référence du score d'axe
                                            # (rapport de centres uniquement —
                                            # la calibration est empirique, MC)


def _mu_regime(src):
    h = (src["H1"] + src["H2"]) / 2.0
    l = (src["L1"] + src["L2"]) / 2.0
    c = (src["C1"] + src["C2"]) / 2.0
    agg = sum(src.values()) / 6.0
    return {"H": h, "L": l, "C": c, "agg": agg}


def _mc_scores(mu_faces, n, rng):
    """(score_H, agg, axeL, axeC) mesurés — n tirages vectorisés d'une rive."""
    mu_vec = np.concatenate([np.full(3, mu_faces[f]) for f in _ORDRE_FACES])
    draws = rng.normal(mu_vec, SIGMA_ITEM, size=(n, 18))
    corr = np.clip(np.round(draws), 1, 4)
    corr[:, 5] = 5.0 - corr[:, 5]    # EXT-H2-3 inversé
    corr[:, 17] = 5.0 - corr[:, 17]  # EXT-C2-3 inversé
    return (corr[:, 0:6].mean(axis=1), corr.mean(axis=1),
            corr[:, 6:12].mean(axis=1), corr[:, 12:18].mean(axis=1))


def _mc_pct(values):
    """Percentile mid-rank vectorisé — identique à percentile_de (round 1)."""
    left = np.searchsorted(_POP_TRI, values, side="left")
    right = np.searchsorted(_POP_TRI, values, side="right")
    return np.round(100.0 * (left + right) / 2.0 / len(_POP_TRI), 1)


def _niveau_mc(scores):
    return np.where(scores < BORNES_CROISEMENT[0], 0,
                    np.where(scores < BORNES_CROISEMENT[1], 1, 2))


def _p_regime_mc(src_a, src_b, rng, n, exact_a=None, exact_b=None):
    """p̂ Monte-Carlo d'un régime : conformité (config + boucle + styles +
    asymétries L/C) contre la classification vraie ancrée sur les μ."""
    if exact_a is not None:
        # items constants : corr = motif exact (identiques pour tous)
        corr_a = np.tile(np.array(exact_a, dtype=float), (n, 1))
        corr_b = np.tile(np.array(exact_b, dtype=float), (n, 1))
        sA = (corr_a[:, 0:6].mean(axis=1), corr_a.mean(axis=1),
              corr_a[:, 6:12].mean(axis=1), corr_a[:, 12:18].mean(axis=1))
        sB = (corr_b[:, 0:6].mean(axis=1), corr_b.mean(axis=1),
              corr_b[:, 6:12].mean(axis=1), corr_b[:, 12:18].mean(axis=1))
    else:
        sA = _mc_scores(src_a, n, rng)
        sB = _mc_scores(src_b, n, rng)
    ua, ub = _mu_regime(src_a), _mu_regime(src_b)
    nA_vrai = NIVEAUX_CROISEMENT.index(niveau_croisement(ua["H"]))
    nB_vrai = NIVEAUX_CROISEMENT.index(niveau_croisement(ub["H"]))
    vrai_num = nA_vrai * 3 + nB_vrai + 1
    cfg_ok = (_niveau_mc(sA[0]) * 3 + _niveau_mc(sB[0]) + 1) == vrai_num
    pa, pb = _mc_pct(np.round(sA[1], 3)), _mc_pct(np.round(sB[1], 3))
    boucle_ok = (np.abs(pa - pb) >= SEUIL_BOUCLE_PCT) == (
        abs(percentile_de(ua["agg"], POPULATION)
            - percentile_de(ub["agg"], POPULATION)) >= SEUIL_BOUCLE_PCT)
    styles_ok = (np.round(np.abs(np.round(sA[1], 3) - np.round(sB[1], 3)), 2)
                 >= SEUIL_STYLES) == (round(abs(ua["agg"] - ub["agg"]), 2)
                                      >= SEUIL_STYLES)
    aL_ok = (np.round(np.abs(sA[2] - sB[2]), 2) >= SEUIL_ASYM) == (
        round(abs(ua["L"] - ub["L"]), 2) >= SEUIL_ASYM)
    aC_ok = (np.round(np.abs(sA[3] - sB[3]), 2) >= SEUIL_ASYM) == (
        round(abs(ua["C"] - ub["C"]), 2) >= SEUIL_ASYM)
    return (cfg_ok & boucle_ok & styles_ok & aL_ok & aC_ok).mean()


def p_conformite_groupe(g, rng):
    """p̂ théorique de conformité du groupe (surface : entrée + config + boucle
    + styles + asymétries ; override déterministe pour le filet)."""
    if g.get("filet"):
        return 1.0
    if g.get("frontieres"):
        # 20 couples exacts (items constants → scores pile sur les bornes)
        # + 20 couples adjacents (μ bruités, géométrie propre)
        exact_a, exact_b = [], []
        for f in _ORDRE_FACES:
            if f.startswith("H"):
                exact_a.extend([2, 3, 2, 3, 2, 3])
                exact_b.extend([3, 4, 3, 4, 3, 4])
            else:
                exact_a.extend([2, 3, 2, 3, 2, 3])
                exact_b.extend([2, 3, 2, 3, 2, 3])
        p_exact = _p_regime_mc(g["A"], g["B"], rng, N_MC // 2,
                               exact_a=exact_a, exact_b=exact_b)
        p_bruit = _p_regime_mc(g["bruite"]["A"], g["bruite"]["B"], rng,
                               N_MC // 2)
        return float(0.5 * p_exact + 0.5 * p_bruit)
    return float(_p_regime_mc(g["A"], g["B"], rng, N_MC))


def calibration_d_std_2():
    """Seuil PAR groupe = (p̂_MC − 2,5σ̂) — calibré binomial sur l'effectif
    réel du groupe, bornes DISTINCTES (leçon ad01f21 : distinctes entre
    configurations ET entre groupes). Le générateur MC est re-seedé LOCALEMENT
    à chaque appel (D-EMPREINTE : deux exécutions → même calibration)."""
    calib, centres = {}, {}
    rng = np.random.default_rng(SEED_MC)
    for gname, g in GEOMETRIE.items():
        n = g["n"]
        p = float(p_conformite_groupe(g, rng))
        sigma = float((p * (1.0 - p) / n) ** 0.5)
        seuil = float(round(max(0.0, (p - 2.5 * sigma)) * 100.0, 1))
        calib[gname] = {"p_theo": round(p, 4), "sigma": round(sigma, 4),
                        "seuil": seuil, "n": n}
        ua, ub = _mu_regime(g["A"]), _mu_regime(g["B"])
        dists = [min(abs(ua[axe] - b), abs(ub[axe] - b)) / SIGMA_H
                 for axe in ("H",) for b in BORNES_CROISEMENT]
        centres[gname] = {"mu_H_A": round(ua["H"], 3), "mu_H_B": round(ub["H"], 3),
                          "mu_agg_A": round(ua["agg"], 3),
                          "mu_agg_B": round(ub["agg"], 3),
                          "ecart_pct_vrai": round(abs(percentile_de(ua["agg"], POPULATION)
                                                      - percentile_de(ub["agg"], POPULATION)), 1),
                          "distance_min_seuil_sigma": round(min(dists), 2)}
    distinct = len({c["seuil"] for c in calib.values()}) == len(calib)
    distinct_9 = (len({calib[g]["seuil"] for g in calib
                       if not GEOMETRIE[g].get("filet")
                       and not GEOMETRIE[g].get("frontieres")
                       and not GEOMETRIE[g].get("boucle")
                       and not GEOMETRIE[g].get("styles")
                       and not GEOMETRIE[g].get("anti_c6")}) == 9)
    return {"seuils": {k: v["seuil"] for k, v in calib.items()},
            "detail": calib, "centres": centres,
            "bornes_distinctes": distinct,
            "bornes_distinctes_9_configs": distinct_9,
            "ok": distinct and distinct_9}


SEUILS_D_STD_2 = {k: v["seuil"] for k, v in calibration_d_std_2()["detail"].items()}
