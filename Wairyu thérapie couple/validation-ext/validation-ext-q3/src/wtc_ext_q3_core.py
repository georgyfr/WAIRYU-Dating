# -*- coding: utf-8 -*-
"""WAIRYU — WTC-EXT-Q3 « Le pas de l'horizon » (RIO-18) : moteur.

SPEC EXT-Q3-SPEC.md VERROUILLÉE (c68c78d) — tranchages A1-A6 par délégation
fondateur, 19/10/2026 (« fais le toi meme ») :
A1 titre « Le pas de l'horizon » · A2 pas = f(palier croisé hérité de Q2) +
pas zéro zone calme · A3 check-in binaire PARTAGÉ (1 coche/couple/jour, seuil
9/14 verbatim) · A4 re-test RIO-16 à 8 semaines — Δ = re-test − base PAR RIVE,
RCI L7 verbatim · A5 en 🔴 ORIENTATION le pas EST la démarche · A6
récapitulatif descriptif de dimension.

Couches canon : « Q5 Le pas (1 changement + suivi 14 jours) » (lignes 224-225)
· tracking verbatim « 9/14 = célébré, jamais de sanction » (lignes 297-298) ·
L7 verbatim (ligne 263 : SE_diff = √2 × SEM ≈ 0,356 · |Δ| ≥ 0,58 FIABLE ·
0,41-0,58 SUGGESTION · < 0,41 BRUIT · + signification clinique si seuil
traversé) · re-test programmé à 8 semaines (ligne 274) · palier hérité de Q2
JAMAIS recalculé (note de verrouillage 5bc9600 — une règle, zéro exception) ·
override D-CRISE AVANT le choix du pas (« JAMAIS de pas de couple en crise »)
· RQS INVALIDE = pas d'entrée (ligne 257) · non-évaluation de l'autre (ligne
363) · anti-fabrication §5.5 · WTC-Q5 = tracking d'engagement (ligne 429).
Entrées = sorties contresignées RIO-17 (croisement) + RIO-16 ×2 (cartes).
Zéro item nouveau (A2-a). 0 invention de contenu thérapeutique."""
from __future__ import annotations

import math

import numpy as np

# ── A1 — titre d'instrument (registre) ────────────────────────────────────────
TITRE_INSTRUMENT = "Le pas de l'horizon"

# ── A2 — familles de pas (mécanique pure, table §2 verrouillée) ──────────────
FAMILLE_VERT = "exercice maison à deux"
FAMILLE_ORANGE = "engagement du module à deux"
FAMILLE_ROUGE = "démarche d'orientation"
PAS_ZERO = "pas zéro — zone calme"

BANQUE_PAS_EXT = {
    FAMILLE_VERT: (
        "À deux : préparer la conversation de l'horizon — chacun relit sa "
        "propre carte (RIO-16) et choisit une chose à dire",
        "À deux : ouvrir le plan des jours durs (Les Deux Rives, ligne 133) "
        "à la lumière des horloges",
        "À deux : un tour des marées normatives (Les Marées de la durée, "
        "esquisse, ligne 111) — où en sommes-nous, chacun son tour",
    ),
    FAMILLE_ORANGE: (
        "À deux : engager le module « L'Écart des horloges » (ligne 112) — "
        "première séance",
        "À deux : reprendre la conversation de l'horizon appuyée sur la "
        "configuration tracée (RIO-17)",
    ),
    FAMILLE_ROUGE: (
        "Le pas est la démarche d'orientation : prendre le premier "
        "rendez-vous — le chemin le plus court, pas un échec",
    ),
}
_FAMILLE_PAR_PALIER = {
    "EXERCICE MAISON": FAMILLE_VERT,
    "MODULE DE COUPLE": FAMILLE_ORANGE,
    "ORIENTATION": FAMILLE_ROUGE,
}

# ── A3 — check-in partagé 14 jours (canon tracking, lignes 297-298) ──────────
N_JOURS = 14
SEUIL_CELEBRE = 9          # 9/14 = célébré, jamais de sanction (verbatim)
STATUT_CELEBRE = "CÉLÉBRÉ"
STATUT_EN_CHEMIN = "EN CHEMIN"

# ── A4 — L7 verbatim (ligne 263) + bornes de traversée par axe ───────────────
SE_DIFF = 0.356            # √2 × SEM ≈ 0,356 (constante L7)
SEUIL_FIABLE = 0.58        # |Δ| ≥ 0,58 = FIABLE
SEUIL_SUGGESTION = 0.41    # 0,41-0,58 = SUGGESTION ; < 0,41 = BRUIT
STATUT_FIABLE = "FIABLE"
STATUT_SUGGESTION = "SUGGESTION"
STATUT_BRUIT = "BRUIT"
ENSEMBLE_FIABLE = "UN CHANGEMENT FIABLE"
ENSEMBLE_SUGGESTION = "UNE PISTE À CONFIRMER"
ENSEMBLE_BRUIT = "DANS LE BRUIT DE LA MESURE"
AXES = ("H", "L", "C")
RIVES = ("rive_a", "rive_b")
# Bornes de signification clinique — une mesure garde un seul rôle :
# axe H → bornes de croisement (Q2, héritées) ; axes L/C → seuils L3 (RIO-16,
# ligne 257 du moteur Q1 : DISCRÈTE < 1,80 ≤ TRANQUILLE < 2,60 ≤ VIVE <
# 3,20 ≤ FORTE — lecture de la carte, jamais recalculée).
SEUILS_TRAVERSEE = {
    "H": (2.50, 3.50),
    "L": (1.80, 2.60, 3.20),
    "C": (1.80, 2.60, 3.20),
}
NIVEAUX_L3 = ("DISCRÈTE", "TRANQUILLE", "VIVE", "FORTE")

# ── D-CRISE + entrée (règles permanentes héritées) ───────────────────────────
DISPLAY_OVERRIDE = "OVERRIDE D-CRISE"
DISPLAY_NON_ENTREE = "NON ENTRÉE (RQS)"
DISPLAY_PAS_ZERO = "ZONE CALME"

NOMENCLATURE = (
    TITRE_INSTRUMENT,
    FAMILLE_VERT, FAMILLE_ORANGE, FAMILLE_ROUGE, PAS_ZERO,
    STATUT_CELEBRE, STATUT_EN_CHEMIN,
    STATUT_FIABLE, STATUT_SUGGESTION, STATUT_BRUIT,
    ENSEMBLE_FIABLE, ENSEMBLE_SUGGESTION, ENSEMBLE_BRUIT,
    "EXERCICE MAISON", "MODULE DE COUPLE", "ORIENTATION",
    DISPLAY_OVERRIDE, DISPLAY_NON_ENTREE, DISPLAY_PAS_ZERO,
    # configurations héritées de Q2 (affichage tracé — registre RIO-17)
    "LA MÊME HEURE", "LE CADRAN QUI S'ÉVEILLE", "L'HORLOGE SEULE",
    "L'ÉCHO QUI ATTEND", "DEUX CADRANS", "L'HORLOGE QUI DEVANCE",
    "L'HORLOGE SEULE, DE L'AUTRE CÔTÉ", "L'AUTRE QUI DEVANCE",
    "LES DEUX HORLOGES VIVES",
    # banque de pas servie (A2 — libellés descriptifs, jamais prescriptifs)
) + BANQUE_PAS_EXT[FAMILLE_VERT] + BANQUE_PAS_EXT[FAMILLE_ORANGE] \
    + BANQUE_PAS_EXT[FAMILLE_ROUGE]

# ── Anti-collision registres publiés (C1 — D-NOMENCLATURE) ───────────────────
# RIO-05 « Mon premier pas » (validation-q5, PAS_LABELS verbatim)
REGISTRE_RIO05 = ("Poser une présence simple", "Nommer la peur quand elle vient",
                  "Garder l'espace sans rupture", "Demander sans exiger",
                  "Tenir le lien à distance", "Desserrer la garde un peu")
# RIO-15 « Mon premier pas vers l'autre rive » (banque SM-Q5 verbatim + libre)
REGISTRE_RIO15 = (
    "Exercice maison : pratiquer la force dérivée identifiée en Q3 (banque F-S1 à F-S6)",
    "Exercice maison : noter chaque soir un mot sur sa rive, 7 jours (météo intérieure, ligne 128)",
    "Exercice maison : préparer sa question pour la Revue mensuelle",
    "À deux : co-étiqueter la frontière (3 cases : trouble / toi / désaccord)",
    "À deux : tenir Les rituels de deux adultes une fois cette semaine",
    "À deux : ouvrir Le plan des jours durs et l'ajuster ensemble",
    "ou écrire votre propre pas")
# RIO-17 « Notre conversation de l'horizon » (9 configurations + 3 inférences)
REGISTRE_RIO17 = ("LA MÊME HEURE", "LE CADRAN QUI S'ÉVEILLE", "L'HORLOGE SEULE",
                  "L'ÉCHO QUI ATTEND", "DEUX CADRANS", "L'HORLOGE QUI DEVANCE",
                  "L'HORLOGE SEULE, DE L'AUTRE CÔTÉ", "L'AUTRE QUI DEVANCE",
                  "LES DEUX HORLOGES VIVES", "la taxe se paie à deux",
                  "deux horloges, un seul sujet",
                  "le silence partagé est aussi une réponse")

# ── A6 — récapitulatif descriptif de dimension (0 verdict) ──────────────────
RECAP_DIMENSION = (
    {"quete": "Q1", "rio": "RIO-16", "instrument": "L'écart de nos horloges",
     "role": "la carte (mesure, 3 axes H/L/C)", "statut": "contresigné (e4b7018)",
     "empreinte": "3583fe56…"},
    {"quete": "Q2", "rio": "RIO-17", "instrument": "Notre conversation de l'horizon",
     "role": "le croisement à deux (9 configurations H×H + L5-L6)",
     "statut": "contresigné (1fc88a5)", "empreinte": "2aea8d99…"},
    {"quete": "Q3", "rio": "RIO-18", "instrument": TITRE_INSTRUMENT,
     "role": "le pas + suivi 14 j + couche L7 (re-test 8 semaines)",
     "statut": "ce package (en audit)", "empreinte": "—"},
)


# ═══════════════ A2 — le pas = f(palier hérité) ══════════════════════════════
def famille_de(palier_herite):
    """Famille de pas = f(palier croisé HÉRITÉ de Q2) — le palier n'est JAMAIS
    recalculé en Q3 (une mesure un rôle, leçon A1-SM-Q4)."""
    return _FAMILLE_PAR_PALIER[palier_herite]


def pas_zero_legitime(zone_calme):
    """Règle §2 verrouillée : le pas zéro est légitime si zone calme
    (config LA MÊME HEURE — affichage Q2 hérité, jamais recalculé)."""
    return bool(zone_calme)


def pas_de(palier_herite, choix=None, zone_calme=False):
    """Pas servi (A2/A5) : le choix reste au couple (§5.5 — l'utilisateur
    valide/conteste, ligne 366) dans la famille de son palier hérité.
    Zone calme : le pas zéro est légitime et servi comme tel (« rien à
    fabriquer ») ; hors zone calme le pas zéro n'est pas au menu (retombée
    sur la famille). 🔴 ORIENTATION (sans crise) : le pas EST la démarche
    (A5-a). D-CRISE : court-circuit AVANT — traité par classifier()."""
    fam = famille_de(palier_herite)
    banque = BANQUE_PAS_EXT[fam]
    if choix is None:
        if zone_calme and fam == FAMILLE_VERT:
            return PAS_ZERO
        return banque[0]
    if choix == PAS_ZERO:
        return PAS_ZERO if pas_zero_legitime(zone_calme) else banque[0]
    return choix if choix in banque else banque[0]


# ═══════════════ A3 — check-in partagé 14 jours ══════════════════════════════
def statut_engagement_de(serie):
    """A3 : statut du suivi PARTAGÉ = f(14 cases binaires du couple).
    ≥ 9/14 CÉLÉBRÉ · < 9/14 EN CHEMIN — jamais de sanction (verbatim).
    None (pas non déployé — D-CRISE / non-entrée) → rien à évaluer."""
    if serie is None:
        return None
    if len(serie) != N_JOURS:
        raise ValueError("check-in partagé : 14 jours attendus")
    return STATUT_CELEBRE if sum(1 for j in serie if j) >= SEUIL_CELEBRE \
        else STATUT_EN_CHEMIN


# ═══════════════ A4 — L7 verbatim (ligne 263) ════════════════════════════════
def delta_de(base, re_test):
    """Δ = re-test − base — ASYMÉTRIE TEMPORELLE sans exception
    (homologue de l'anti-inversion Q2/Q4)."""
    return re_test - base


def statut_rci_de(base, re_test):
    """L7 verbatim : |Δ| ≥ 0,58 FIABLE · [0,41 ; 0,58[ SUGGESTION ·
    < 0,41 BRUIT (bornes en lecture directe de « 0,41-0,58 » et « < 0,41 »)."""
    d = abs(delta_de(base, re_test))
    if d >= SEUIL_FIABLE:
        return STATUT_FIABLE
    if d >= SEUIL_SUGGESTION:
        return STATUT_SUGGESTION
    return STATUT_BRUIT


_STATUT_RANG = {STATUT_BRUIT: 0, STATUT_SUGGESTION: 1, STATUT_FIABLE: 2}
_STATUT_PAR_RANG = {0: ENSEMBLE_BRUIT, 1: ENSEMBLE_SUGGESTION, 2: ENSEMBLE_FIABLE}


def statut_ensemble_de(statuts):
    """A4 : agrégation d'ensemble = max des statuts (BRUIT < SUGGESTION <
    FIABLE) — convention d'affichage explicite, anti-surinterprétation (L4).
    Affichage descriptif PAR RIVE conservé : l'ensemble ne compare jamais
    les rives, il nomme le plus fort des six statuts lus."""
    return _STATUT_PAR_RANG[max(_STATUT_RANG[s] for s in statuts)]


def niveau_H_de(score):
    """Niveau de croisement (Q2 hérité — pour la SIGNIFICATION CLINIQUE de
    l'axe H uniquement) : < 2,50 FAIBLE · [2,50 ; 3,50[ MODÉRÉE · ≥ 3,50
    FORTE. Une mesure un rôle : l'affichage de rive reste celui de Q2."""
    if score < 2.50:
        return "FAIBLE"
    if score < 3.50:
        return "MODÉRÉE"
    return "FORTE"


def niveau_L3_de(score):
    """Lecture L3 de la carte (RIO-16, verbatim ligne 257 Q1) — pour la
    SIGNIFICATION CLINIQUE des axes L/C uniquement."""
    if score < 1.80:
        return NIVEAUX_L3[0]
    if score < 2.60:
        return NIVEAUX_L3[1]
    if score < 3.20:
        return NIVEAUX_L3[2]
    return NIVEAUX_L3[3]


def traverse_de(axe, base, re_test):
    """Signification clinique (L7) : traversée d'un seuil de SA propre
    échelle entre base et re-test (H : bornes croisement 2,50/3,50 ;
    L/C : seuils L3 1,80/2,60/3,20)."""
    fn = niveau_H_de if axe == "H" else niveau_L3_de
    return fn(base) != fn(re_test)


def signification_de(axe, base, re_test):
    """Libellé de traversée (« Vive → Forte ») ou chaîne vide."""
    fn = niveau_H_de if axe == "H" else niveau_L3_de
    n1, n2 = fn(base), fn(re_test)
    return f"{n1} → {n2}" if n1 != n2 else ""


def rci_de(bases, re_tests):
    """A4 : RCI par rive, par axe — 3 statuts par rive + ensemble DE RIVE
    (max des 3 axes de la rive — convention d'affichage explicite,
    anti-surinterprétation L4). L'ensemble ne traverse JAMAIS les rives
    (C7) : chaque rive porte son propre label descriptif."""
    out = {"rives": {}}
    for rive in RIVES:
        b, r = bases[rive], re_tests[rive]
        ent = {"deltas": {}, "statuts": {}, "traversees": {},
               "significations": {}}
        statuts_rive = []
        for axe in AXES:
            d = round(delta_de(b[axe], r[axe]), 2)
            s = statut_rci_de(b[axe], r[axe])
            ent["deltas"][axe] = d
            ent["statuts"][axe] = s
            ent["traversees"][axe] = traverse_de(axe, b[axe], r[axe])
            ent["significations"][axe] = signification_de(axe, b[axe], r[axe])
            statuts_rive.append(s)
        ent["ensemble"] = statut_ensemble_de(statuts_rive)
        out["rives"][rive] = ent
    return out


# ═══════════════ Classifier du pas (à deux) ══════════════════════════════════
def classifier(sortie_q2, rive_a, rive_b, serie=None, choix=None,
               bases=None, re_tests=None):
    """Classement complet d'un couple Q3 — pure, déterministe.
    sortie_q2 : verdict du croisement contresigné (palier, config, zone
    calme, entree, override) — HÉRITÉ, jamais recalculé.
    rive_a/rive_b : sorties RIO-16 (filet, rqs_statut, scores H/L/C).
    serie : check-in partagé (14 bool | None). choix : pas choisi dans la
    banque de la famille (| PAS_ZERO | None). bases/re_tests : axes H/L/C
    par rive (L7)."""
    filet = bool(rive_a["filet"] or rive_b["filet"])
    out = {
        "config_num": sortie_q2["config_num"],
        "config_nom": sortie_q2["config_nom"],
        "palier_herite": sortie_q2["palier"],
        "zone_calme_heritee": sortie_q2["zone_calme"],
        "display": None, "entree": False, "override": False,
        "palier": None, "pas": None, "statut": None, "rci": None,
        "bandeau": None,
    }
    # (1) D-CRISE — court-circuit AVANT le choix du pas (règle permanente) :
    # JAMAIS de pas de couple en crise ; la configuration reste calculée et
    # tracée, jamais servie.
    if filet:
        out.update({
            "override": True, "display": DISPLAY_OVERRIDE,
            "bandeau": "D-CRISE : court-circuit AVANT le choix du pas — "
                       "P-FILTRE, jamais de pas de couple en crise "
                       "(configuration calculée et tracée)."})
        return out
    # (2) Entrée RQS (ligne 257) : INVALIDE chez une rive = pas d'entrée.
    if rive_a["rqs_statut"] == "INVALIDE" or rive_b["rqs_statut"] == "INVALIDE":
        out.update({
            "display": DISPLAY_NON_ENTREE,
            "bandeau": "RQS < 70 chez une rive — le couple n'entre pas au "
                       "pas (ligne 257) ; aucun résultat de couple."})
        return out
    # (3) Entrée complète — le palier hérité n'est JAMAIS recalculé.
    palier = sortie_q2["palier"]
    zone = sortie_q2["zone_calme"]
    pas = pas_de(palier, choix, zone)
    statut = statut_engagement_de(serie)
    rci = rci_de(bases, re_tests) if (bases and re_tests) else None
    heritages = {k: sortie_q2[k] for k in sortie_q2
                 if k in ("boucle_probable", "styles_dissemblables",
                          "asym_L", "asym_C")} if "boucle_probable" \
        in sortie_q2 else None
    out.update({
        "entree": True, "palier": palier, "pas": pas, "statut": statut,
        "rci": rci, "heritages": heritages,
        "display": DISPLAY_PAS_ZERO if pas == PAS_ZERO
        else sortie_q2["config_nom"],
        "recap_dimension": list(RECAP_DIMENSION),
    })
    return out


# ═══════════════ Templates d'affichage (autoporteurs, C5/C6/C7) ══════════════
TEMPLATES = {
    "pas_zero": "Pas zéro — zone calme : rien à fabriquer ici (§5.5). "
                "L'exercice maison reste disponible si vous le voulez.",
    "vert_1": "À deux : préparer la conversation de l'horizon — chacun relit "
              "sa propre carte (RIO-16) et choisit une chose à dire.",
    "vert_2": "À deux : ouvrir le plan des jours durs (Les Deux Rives, "
              "ligne 133) à la lumière des horloges.",
    "vert_3": "À deux : un tour des marées normatives (Les Marées de la "
              "durée, esquisse, ligne 111) — où en sommes-nous, chacun son "
              "tour.",
    "orange_1": "À deux : engager le module « L'Écart des horloges » "
                "(ligne 112) — première séance.",
    "orange_2": "À deux : reprendre la conversation de l'horizon appuyée sur "
                "la configuration tracée (RIO-17).",
    "rouge_1": "Le pas est la démarche d'orientation : prendre le premier "
               "rendez-vous — le chemin le plus court, pas un échec.",
    "celebre": "{n} jours sur 14 — c'est célébré. Le pas a tenu.",
    "celebre_pile": "9 jours sur 14 — c'est célébré pile sur le seuil. Pas "
                    "besoin de viser plus : le programme compte 9/14 comme "
                    "un pas tenu.",
    "en_chemin": "{n} jours sur 14 — le pas est en chemin. Rien n'est perdu, "
                 "rien n'est noté : le suivi continue, sans sanction.",
    "suivi_partage": "Case partagée : une coche par jour à deux — 9/14 = "
                     "célébré, jamais de sanction (le bit commun n'expose "
                     "jamais le contenu d'une rive, ligne 370).",
    "fiable": "Le changement est mesuré comme fiable (au-delà du bruit de la "
              "mesure).",
    "suggestion": "Une piste de changement se dessine — à confirmer au "
                  "prochain re-test.",
    "bruit": "Dans le bruit de la mesure — ça ne dit ni réussite ni échec, "
             "ça dit que la mesure ne tranche pas encore.",
    "jamais_comparees": "Les lectures L7 sont déclarées par rive, jamais "
                        "comparées entre rives.",
    "orientation": "Palier 🔴 ORIENTATION : le chemin le plus court, pas un "
                   "échec — le pas est la démarche (A5).",
    "override": "D-CRISE : court-circuit AVANT le choix du pas — P-FILTRE, "
                "jamais de pas de couple en crise (configuration calculée et "
                "tracée).",
    "non_entree": "RQS < 70 chez une rive — le couple n'entre pas au pas ; "
                  "aucun résultat de couple.",
    "aide_seuils": "QUAND DEMANDER DE L'AIDE : tout signal de crise chez "
                   "l'une des rives → P-FILTRE — 3919 / 3114 (jamais de pas "
                   "de couple en crise).",
    "re_cap": "Récapitulatif descriptif de la dimension Générationnelle — "
              "carte (RIO-16) → croisement (RIO-17) → pas (RIO-18) : trois "
              "quêtes produites, lecture descriptive, 0 verdict de "
              "dimension.",
}

D_SIM = ("AVERTISSEMENT D-SIM : résultats issus de simulations (seed 42) — "
         "la mécanique est validée, pas la prévalence clinique.")


# ═══════════════ D-TABLE (C1 — cas exhaustifs) ═══════════════════════════════
def _sortie_q2_test(palier, config_num=1, config_nom="LA MÊME HEURE",
                    zone_calme=True):
    return {"palier": palier, "config_num": config_num,
            "config_nom": config_nom, "zone_calme": zone_calme,
            "entree": True, "override": False}


def _rive_test(score_h=2.40, rqs="OK", filet=False, score_l=2.40,
               score_c=2.40):
    return {"score_H": score_h, "score_L": score_l, "score_C": score_c,
            "rqs_statut": rqs, "filet": filet}


def verifier_d_table():
    """D-VÉRITÉ : les RÈGLES prouvées exactement (leçon Q5 : C1 croisé sur
    cas de table, pas sur données bruitées)."""
    t = {}
    # Check-in partagé : grille complète 0..14 → statut attendu
    grille_ok = True
    for total in range(N_JOURS + 1):
        serie = tuple(j < total for j in range(N_JOURS))
        attendu = STATUT_CELEBRE if total >= SEUIL_CELEBRE else STATUT_EN_CHEMIN
        grille_ok &= statut_engagement_de(serie) == attendu
    t["grille_engagement_15"] = grille_ok
    # Frontières RCI exactes (bornes incluses, lecture verbatim L7)
    frontieres = {
        (3.0, 3.58): STATUT_FIABLE,      # |Δ| = 0,58 pile → FIABLE (incluse)
        (3.0, 2.42): STATUT_FIABLE,      # |Δ| = 0,58 à la baisse
        (3.0, 3.41): STATUT_SUGGESTION,  # |Δ| = 0,41 pile → SUGGESTION
        (3.0, 2.59): STATUT_SUGGESTION,
        (3.0, 3.40): STATUT_BRUIT,       # |Δ| = 0,40 → BRUIT
        (3.0, 2.60): STATUT_BRUIT,
        (3.0, 3.59): STATUT_FIABLE,
        (3.0, 2.00): STATUT_FIABLE,      # |Δ| = 1,00
    }
    t["frontieres_rci"] = all(statut_rci_de(b, r) == s
                              for (b, r), s in frontieres.items())
    # Asymétrie temporelle : swap base/re-test → Δ signé inversé exactement
    t["inversion_temporelle"] = all(
        delta_de(r, b) == -delta_de(b, r) for (b, r) in frontieres)
    # Pas = f(palier hérité) — familles exactes (table §2 verrouillée)
    t["famille_vert"] = famille_de("EXERCICE MAISON") == FAMILLE_VERT
    t["famille_orange"] = famille_de("MODULE DE COUPLE") == FAMILLE_ORANGE
    t["famille_rouge"] = famille_de("ORIENTATION") == FAMILLE_ROUGE
    # Le pas ne re-scale JAMAIS le palier : un palier hérité 🟠 servi même si
    # les scores re-mesurés diraient autre chose (entrée structurale — le
    # moteur reçoit le palier, il ne le recalcule pas).
    out_rescale = classifier(
        _sortie_q2_test("MODULE DE COUPLE", 5, "DEUX CADRANS", False),
        _rive_test(score_h=1.60), _rive_test(score_h=1.60),
        serie=tuple(True for _ in range(N_JOURS)),
        choix=BANQUE_PAS_EXT[FAMILLE_ORANGE][0],
        bases={"rive_a": {"H": 1.6, "L": 2.4, "C": 2.4},
               "rive_b": {"H": 1.6, "L": 2.4, "C": 2.4}},
        re_tests={"rive_a": {"H": 1.6, "L": 2.4, "C": 2.4},
                  "rive_b": {"H": 1.6, "L": 2.4, "C": 2.4}})
    t["palier_jamais_rescale"] = (
        out_rescale["palier"] == "MODULE DE COUPLE"
        and out_rescale["pas"] == BANQUE_PAS_EXT[FAMILLE_ORANGE][0])
    # Pas zéro : légitime ⟺ zone calme (règle §2)
    t["pas_zero_zone_calme"] = pas_de(
        "EXERCICE MAISON", PAS_ZERO, True) == PAS_ZERO
    t["pas_zero_hors_zone_retombe_famille"] = pas_de(
        "EXERCICE MAISON", PAS_ZERO, False) == BANQUE_PAS_EXT[FAMILLE_VERT][0]
    t["pas_zero_par_defaut_zone_calme"] = pas_de(
        "EXERCICE MAISON", None, True) == PAS_ZERO
    t["pas_zero_legitime_regle"] = (pas_zero_legitime(True)
                                    and not pas_zero_legitime(False))
    # Banque injective : 6 pas uniques + famille rouge = 1 (A5) — libellés
    # descriptifs, jamais prescriptifs
    banque = (BANQUE_PAS_EXT[FAMILLE_VERT] + BANQUE_PAS_EXT[FAMILLE_ORANGE]
              + BANQUE_PAS_EXT[FAMILLE_ROUGE])
    t["banque_injective"] = (len(banque) == 6 and len(set(banque)) == 6
                             and len(BANQUE_PAS_EXT[FAMILLE_VERT]) == 3
                             and len(BANQUE_PAS_EXT[FAMILLE_ORANGE]) == 2
                             and len(BANQUE_PAS_EXT[FAMILLE_ROUGE]) == 1)
    # Anti-collision registres publiés (C1 — D-NOMENCLATURE)
    labels_q3 = set(banque) | {PAS_ZERO, TITRE_INSTRUMENT}
    t["anti_collision_rio05"] = not (labels_q3 & set(REGISTRE_RIO05))
    t["anti_collision_rio15"] = not (labels_q3 & set(REGISTRE_RIO15))
    t["anti_collision_rio17"] = not (labels_q3 & set(REGISTRE_RIO17))
    # Override D-CRISE : UNE rive suffit, AVANT le choix du pas — même sur
    # des items Forte ; configuration tracée, pas non servi, suivi non évalué
    ov = classifier(_sortie_q2_test("ORIENTATION", 9, "LES DEUX HORLOGES VIVES",
                                    False),
                    _rive_test(score_h=3.9, filet=True),
                    _rive_test(score_h=3.9),
                    serie=tuple(True for _ in range(N_JOURS)),
                    choix=BANQUE_PAS_EXT[FAMILLE_ROUGE][0])
    t["override_une_rive"] = (ov["override"] and ov["pas"] is None
                              and ov["statut"] is None and ov["rci"] is None
                              and ov["display"] == DISPLAY_OVERRIDE
                              and ov["config_nom"] == "LES DEUX HORLOGES VIVES")
    ov2 = classifier(_sortie_q2_test("EXERCICE MAISON", 1, "LA MÊME HEURE",
                                     True),
                     _rive_test(score_h=1.9),
                     _rive_test(score_h=1.9, filet=True),
                     serie=None, choix=None)
    t["override_autre_rive"] = (ov2["override"] and ov2["pas"] is None
                                and ov2["statut"] is None)
    # Non-entrée RQS (ligne 257) : INVALIDE chez une rive = pas d'entrée ;
    # PRUDENCE entre
    ne = classifier(_sortie_q2_test("EXERCICE MAISON", 1, "LA MÊME HEURE",
                                    True),
                    _rive_test(rqs="INVALIDE"), _rive_test())
    t["non_entree_rqs"] = (ne["display"] == DISPLAY_NON_ENTREE
                           and ne["pas"] is None and ne["statut"] is None
                           and ne["entree"] is False)
    pr = classifier(_sortie_q2_test("EXERCICE MAISON", 1, "LA MÊME HEURE",
                                    True),
                    _rive_test(rqs="PRUDENCE"), _rive_test(),
                    serie=tuple(j < 10 for j in range(N_JOURS)),
                    choix=BANQUE_PAS_EXT[FAMILLE_VERT][0],
                    bases={"rive_a": {"H": 1.9, "L": 2.4, "C": 2.4},
                           "rive_b": {"H": 1.9, "L": 2.4, "C": 2.4}},
                    re_tests={"rive_a": {"H": 1.9, "L": 2.4, "C": 2.4},
                              "rive_b": {"H": 1.9, "L": 2.4, "C": 2.4}})
    t["prudence_entre"] = pr["entree"] and pr["pas"] is not None
    # Signification clinique : bornes par axe (H : 2,50/3,50 ; L/C : L3)
    t["traversee_h_2_49_2_50"] = (
        traverse_de("H", 2.49, 2.51)           # FAIBLE → MODÉRÉE (borne 2,50)
        and not traverse_de("H", 2.49, 2.495)  # même niveau — pas de traversée
        and not traverse_de("H", 3.505, 3.51)  # FORTE → FORTE
        and niveau_H_de(2.49) == "FAIBLE" and niveau_H_de(2.50) == "MODÉRÉE"
        and niveau_H_de(3.49) == "MODÉRÉE" and niveau_H_de(3.50) == "FORTE")
    t["traversee_l3_l"] = (
        niveau_L3_de(1.79) == "DISCRÈTE" and niveau_L3_de(1.80) == "TRANQUILLE"
        and niveau_L3_de(2.59) == "TRANQUILLE"
        and niveau_L3_de(2.60) == "VIVE"
        and niveau_L3_de(3.19) == "VIVE" and niveau_L3_de(3.20) == "FORTE"
        and traverse_de("L", 2.40, 3.30)
        and signification_de("L", 2.40, 3.30) == "TRANQUILLE → FORTE"
        and signification_de("C", 2.40, 2.75) == "TRANQUILLE → VIVE")
    t["pas_de_traversee_si_meme_niveau"] = (
        not traverse_de("C", 2.40, 2.55)
        and signification_de("C", 2.40, 2.55) == "")
    # Agrégation max : les 9 combinaisons par paires de statuts → ensemble
    agg_ok = True
    for s1 in (STATUT_BRUIT, STATUT_SUGGESTION, STATUT_FIABLE):
        for s2 in (STATUT_BRUIT, STATUT_SUGGESTION, STATUT_FIABLE):
            attendu = ENSEMBLE_FIABLE if STATUT_FIABLE in (s1, s2) else (
                ENSEMBLE_SUGGESTION if STATUT_SUGGESTION in (s1, s2)
                else ENSEMBLE_BRUIT)
            agg_ok &= statut_ensemble_de((s1, s2)) == attendu
    t["agregation_max"] = agg_ok
    t["agregation_max_6"] = statut_ensemble_de(
        (STATUT_BRUIT,) * 5 + (STATUT_FIABLE,)) == ENSEMBLE_FIABLE
    # RCI par rive : les labels suivent LEUR rive (anti-inversion des rives)
    bases = {"rive_a": {"H": 3.0, "L": 2.4, "C": 2.4},
             "rive_b": {"H": 3.0, "L": 2.4, "C": 2.4}}
    re_tests = {"rive_a": {"H": 3.7, "L": 2.4, "C": 2.4},
                "rive_b": {"H": 3.0, "L": 2.4, "C": 2.4}}
    rci = rci_de(bases, re_tests)
    t["rci_par_rive"] = (rci["rives"]["rive_a"]["statuts"]["H"] == STATUT_FIABLE
                         and rci["rives"]["rive_b"]["statuts"]["H"]
                         == STATUT_BRUIT
                         and rci["rives"]["rive_a"]["ensemble"]
                         == ENSEMBLE_FIABLE
                         and rci["rives"]["rive_b"]["ensemble"]
                         == ENSEMBLE_BRUIT)
    # Pas zéro : rien à évaluer — le suivi d'un pas zéro n'est pas fabriqué
    pz = classifier(_sortie_q2_test("EXERCICE MAISON", 1, "LA MÊME HEURE",
                                    True),
                    _rive_test(), _rive_test(), serie=None, choix=PAS_ZERO)
    t["pas_zero_rien_a_evaluer"] = (pz["pas"] == PAS_ZERO
                                    and pz["statut"] is None
                                    and pz["display"] == DISPLAY_PAS_ZERO)
    # Zéro 0/14 (piège ANTI_C6) : un VRAI pas choisi, aucune coche →
    # EN CHEMIN — jamais de sanction (distinct du pas zéro)
    zr = classifier(_sortie_q2_test("EXERCICE MAISON", 1, "LA MÊME HEURE",
                                    True),
                    _rive_test(), _rive_test(),
                    serie=tuple(False for _ in range(N_JOURS)),
                    choix=BANQUE_PAS_EXT[FAMILLE_VERT][0])
    t["zero_0_14_en_chemin"] = (zr["pas"] == BANQUE_PAS_EXT[FAMILLE_VERT][0]
                                and zr["statut"] == STATUT_EN_CHEMIN)
    # A6 : récapitulatif descriptif — 3 quêtes, 0 verdict de dimension
    t["recap_descriptif"] = (
        len(RECAP_DIMENSION) == 3
        and [e["rio"] for e in RECAP_DIMENSION] == ["RIO-16", "RIO-17",
                                                    "RIO-18"]
        and "0 verdict" in TEMPLATES["re_cap"])
    return t


def verifier_d_confirmation(couples, verdicts):
    """D-CONFIRMATION : pureté (re-classification identique, 2e passe) +
    anti-inversion temporelle sur données réelles (swap base/re-test →
    Δ signé inversé exactement, statut |Δ| identique) + anti-inversion des
    rives (échange des entrées L7 entre rives → chaque label suit SA rive
    échangée — les lectures restent attachées à leur source)."""
    pure = all(classifier(c["sortie_q2"], c["sorties"]["rive_a"],
                          c["sorties"]["rive_b"],
                          c["serie"], c["choix"], c["bases"], c["re_tests"])
               == v for c, v in zip(couples, verdicts))
    inv_t = True
    inv_r = True
    n_rci = 0
    for c, v in zip(couples, verdicts):
        if not v.get("entree") or v["rci"] is None:
            continue
        n_rci += 1
        # anti-inversion temporelle : swap base/re-test
        for rive in RIVES:
            for axe in AXES:
                b, r = c["bases"][rive][axe], c["re_tests"][rive][axe]
                d1 = round(delta_de(b, r), 9)
                d2 = round(delta_de(r, b), 9)
                inv_t &= (d1 == -d2)
                inv_t &= (statut_rci_de(r, b) == statut_rci_de(b, r))
        # anti-inversion des rives : échange des entrées L7 entre rives
        rci_swap = rci_de({"rive_a": c["bases"]["rive_b"],
                           "rive_b": c["bases"]["rive_a"]},
                          {"rive_a": c["re_tests"]["rive_b"],
                           "rive_b": c["re_tests"]["rive_a"]})
        inv_r &= (rci_swap["rives"]["rive_a"] == v["rci"]["rives"]["rive_b"]
                  and rci_swap["rives"]["rive_b"] == v["rci"]["rives"]["rive_a"])
    return {"pure": pure, "anti_inversion_temporelle": inv_t,
            "anti_inversion_rives": inv_r, "n_rci": n_rci}


# ═════════ Géométrie des 14 groupes (miroir du simulateur — croisé) ══════════
# μ par face (source des μ vrais) ; le simulateur génère les items, le cœur
# calibre (p̂ Monte-Carlo — même processus générateur, patron Q2).
# μ_H : FAIBLE ≈ 1,7-2,1 · MODÉRÉE ≈ 2,95-3,1 · FORTE ≈ 3,85-3,95 — centres
# ≥ 0,5 pt des bornes (D-GÉOMÉTRIE) ; les écarts hérités (boucle/styles/asym)
# sont calibrés sur leur géométrie propre (bandes rapportées en robustesse).
GEOMETRIE = {
    "G01_PALIER_VERT_EXERCICE": {
        "A": {"H1": 1.8, "H2": 2.0, "L1": 2.4, "L2": 2.5, "C1": 2.3, "C2": 2.2},
        "B": {"H1": 1.8, "H2": 2.0, "L1": 2.4, "L2": 2.5, "C1": 2.3, "C2": 2.2},
        "n": 50},
    "G02_PALIER_ORANGE_MODULE": {
        "A": {"H1": 2.9, "H2": 3.1, "L1": 2.5, "L2": 2.5, "C1": 2.5, "C2": 2.5},
        "B": {"H1": 2.9, "H2": 3.1, "L1": 2.6, "L2": 2.6, "C1": 2.5, "C2": 2.5},
        "n": 50},
    "G03_PALIER_ROUGE_ORIENTATION": {
        "A": {"H1": 3.8, "H2": 4.0, "L1": 2.2, "L2": 2.2, "C1": 2.2, "C2": 2.2},
        "B": {"H1": 2.9, "H2": 3.1, "L1": 2.5, "L2": 2.5, "C1": 2.5, "C2": 2.5},
        "n": 50},
    "G04_ZONE_CALME_PAS_ZERO": {
        "A": {"H1": 1.7, "H2": 1.9, "L1": 2.4, "L2": 2.4, "C1": 2.3, "C2": 2.3},
        "B": {"H1": 1.7, "H2": 1.9, "L1": 2.4, "L2": 2.4, "C1": 2.3, "C2": 2.3},
        "n": 40},
    "G05_SIGNAL_FILET": {
        "A": {"H1": 2.4, "H2": 2.4, "L1": 2.4, "L2": 2.4, "C1": 2.4, "C2": 2.4},
        "B": {"H1": 2.4, "H2": 2.4, "L1": 2.4, "L2": 2.4, "C1": 2.4, "C2": 2.4},
        "n": 40, "filet": True},
    "G06_FRONTIERES_9_14": {
        "A": {"H1": 1.6, "H2": 1.8, "L1": 2.3, "L2": 2.3, "C1": 2.3, "C2": 2.3},
        "B": {"H1": 1.6, "H2": 1.8, "L1": 2.3, "L2": 2.3, "C1": 2.3, "C2": 2.3},
        "n": 40, "frontieres_9_14": True},
    "G07_RCI_FRONTIERES": {
        "A": {"H1": 2.9, "H2": 3.0, "L1": 3.3, "L2": 3.3, "C1": 2.4, "C2": 2.4},
        "B": {"H1": 2.9, "H2": 3.0, "L1": 3.3, "L2": 3.3, "C1": 2.4, "C2": 2.4},
        "n": 40, "frontieres_rci": True},
    "G08_ANTI_C6": {
        "A": {"H1": 1.8, "H2": 1.9, "L1": 2.4, "L2": 2.5, "C1": 2.3, "C2": 2.2},
        "B": {"H1": 1.8, "H2": 1.9, "L1": 2.4, "L2": 2.5, "C1": 2.3, "C2": 2.2},
        "n": 40, "anti_c6": True},
    "G09_RCI_FIABLE": {
        "A": {"H1": 2.9, "H2": 3.1, "L1": 2.5, "L2": 2.5, "C1": 2.5, "C2": 2.5},
        "B": {"H1": 3.0, "H2": 3.2, "L1": 2.55, "L2": 2.55, "C1": 2.55, "C2": 2.55},
        "n": 50, "re_mode": "sem",
        "dA": (-0.80, -0.80, -0.80), "dB": (0.80, 0.80, 0.80)},
    "G10_RCI_BRUIT": {
        "A": {"H1": 1.9, "H2": 2.1, "L1": 2.3, "L2": 2.3, "C1": 2.3, "C2": 2.3},
        "B": {"H1": 2.0, "H2": 2.2, "L1": 2.35, "L2": 2.35, "C1": 2.35, "C2": 2.35},
        "n": 70, "re_mode": "sem",
        "dA": (0.15, -0.15, 0.10), "dB": (-0.12, 0.14, -0.10)},
    "G11_RCI_CONTRASTE": {
        "A": {"H1": 2.9, "H2": 3.1, "L1": 2.5, "L2": 2.5, "C1": 2.5, "C2": 2.5},
        "B": {"H1": 3.0, "H2": 3.2, "L1": 2.55, "L2": 2.55, "C1": 2.55, "C2": 2.55},
        "n": 40, "re_mode": "sem",
        "dA": (-0.90, -0.90, -0.90), "dB": (0.12, -0.14, 0.10)},
    "G12_STYLES_DISSEMBLABLES": {
        "A": {"H1": 1.8, "H2": 1.8, "L1": 1.9, "L2": 1.9, "C1": 1.9, "C2": 1.9},
        "B": {"H1": 2.9, "H2": 3.1, "L1": 3.3, "L2": 3.3, "C1": 3.3, "C2": 3.3},
        "n": 50},
    "G13_BOUCLE_PERCENTILES": {
        "A": {"H1": 1.9, "H2": 2.1, "L1": 2.5, "L2": 2.5, "C1": 2.5, "C2": 2.5},
        "B": {"H1": 2.9, "H2": 3.1, "L1": 2.9, "L2": 2.9, "C1": 2.9, "C2": 2.9},
        "n": 50},
    "G14_RQS_NON_ENTREE": {
        "A_inv": {"H1": 2.4, "H2": 2.4, "L1": 2.4, "L2": 2.4, "C1": 2.4, "C2": 2.4},
        "B_inv": {"H1": 2.9, "H2": 3.1, "L1": 2.5, "L2": 2.5, "C1": 2.5, "C2": 2.5},
        "A_pru": {"H1": 1.8, "H2": 2.0, "L1": 2.4, "L2": 2.5, "C1": 2.3, "C2": 2.2},
        "B_pru": {"H1": 1.8, "H2": 2.0, "L1": 2.4, "L2": 2.5, "C1": 2.3, "C2": 2.2},
        "n": 40, "rqs_non_entree": True},
}
# Deltas EXACTS de G07 (|Δ| pile aux bornes L7 — ε = 0, déterministe) —
# cycle de 4 sous-profils : 2 × FIABLE (avec traversées), 1 × SUGGESTION,
# 1 × BRUIT ; signification clinique servie quand le seuil est traversé.
DELTAS_EXACTES_G07 = (
    ((-0.58, -0.58, -0.58), (0.58, 0.58, -0.58)),
    ((0.58, -0.58, 0.58), (-0.58, 0.58, 0.58)),
    ((0.41, -0.41, 0.41), (-0.41, 0.41, -0.41)),
    ((0.30, -0.30, 0.35), (-0.28, 0.32, -0.35)),
)

# Population de référence percentiles — HÉRITÉE DE Q2 (une mesure un rôle) :
# génération déterministe identique (default_rng(42).normal(3.0 ; 0.8, 2000)
# arrondi 4) — jamais recalculée (SPEC §6).
rng_pop = np.random.default_rng(42)
POPULATION = np.round(rng_pop.normal(3.0, 0.8, 2000), 4).tolist()
_POP_TRI = np.sort(np.asarray(POPULATION))
SIGMA_ITEM = 0.60
N_MC = 10000
SEED_MC = 42
SEM_L7 = SE_DIFF / (2 ** 0.5)          # ≈ 0,252 — SEM du programme (L7)
SIGMA_H = round(0.60 / math.sqrt(6.0), 4)   # σ normal de référence (rapport)
_ORDRE_FACES = ("H1", "H2", "L1", "L2", "C1", "C2")


def _mu_regime(src):
    h = (src["H1"] + src["H2"]) / 2.0
    l = (src["L1"] + src["L2"]) / 2.0
    c = (src["C1"] + src["C2"]) / 2.0
    agg = sum(src.values()) / 6.0
    return {"H": h, "L": l, "C": c, "agg": agg}


def _mc_scores(mu_faces, n, rng):
    """(score_H, agg, axeL, axeC) mesurés — n tirages vectorisés d'une rive
    (18 items entiers clippés [1,4], inversés corrigés — même générateur que
    le simulateur ; ré-implémentation RIO-16 indépendante = croisé D-VÉRITÉ)."""
    mu_vec = np.concatenate([np.full(3, mu_faces[f]) for f in _ORDRE_FACES])
    draws = rng.normal(mu_vec, SIGMA_ITEM, size=(n, 18))
    corr = np.clip(np.round(draws), 1, 4)
    corr[:, 5] = 5.0 - corr[:, 5]     # EXT-H2-3 inversé
    corr[:, 17] = 5.0 - corr[:, 17]   # EXT-C2-3 inversé
    return (corr[:, 0:6].mean(axis=1), corr.mean(axis=1),
            corr[:, 6:12].mean(axis=1), corr[:, 12:18].mean(axis=1))


def _mc_pct(values):
    """Percentile mid-rank vectorisé — identique à percentile_de (round 1)."""
    left = np.searchsorted(_POP_TRI, values, side="left")
    right = np.searchsorted(_POP_TRI, values, side="right")
    return np.round(100.0 * (left + right) / 2.0 / len(_POP_TRI), 1)


def _niveau_mc(scores):
    return np.where(scores < 2.50, 0, np.where(scores < 3.50, 1, 2))


def percentile_de(valeur, population=None):
    """Percentile mid-rank dans la population de référence (héritée Q2)."""
    tri = _POP_TRI if population is None else np.sort(np.asarray(population))
    n = len(tri)
    inferieurs = int(np.searchsorted(tri, valeur, side="left"))
    egaux = int(np.searchsorted(tri, valeur, side="right")) - inferieurs
    return round(100.0 * (inferieurs + egaux / 2.0) / n, 1)


def _heritage_vrai(ua, ub):
    """Héritages Q2 vrais (boucle L6, styles, asymétries L/C) sur les μ."""
    pa = percentile_de(ua["agg"])
    pb = percentile_de(ub["agg"])
    return {"boucle": abs(pa - pb) >= 30.0,
            "styles": round(abs(ua["agg"] - ub["agg"]), 2) >= 1.00,
            "asym_L": round(abs(ua["L"] - ub["L"]), 2) >= 1.00,
            "asym_C": round(abs(ua["C"] - ub["C"]), 2) >= 1.00}


def _p_regime_mc(src_a, src_b, g, rng, n):
    """p̂ Monte-Carlo d'un régime : conformité de la surface servie complète
    (config + palier + pas + statut + héritages + ensembles RCI par rive)
    contre la classification vraie ancrée sur les μ. statut/pas sont
    déterministes (totaux et choix fixés) → toujours conformes."""
    sA = _mc_scores(src_a, n, rng)
    sB = _mc_scores(src_b, n, rng)
    ua, ub = _mu_regime(src_a), _mu_regime(src_b)
    vrai = _heritage_vrai(ua, ub)
    nA, nB = NIVEAUX_MC_H(ua["H"]), NIVEAUX_MC_H(ub["H"])
    vrai_cfg = int(nA) * 3 + int(nB) + 1
    vrai_palier = ("ORIENTATION" if 2 in (nA, nB)
                   else "MODULE DE COUPLE" if 1 in (nA, nB)
                   else "EXERCICE MAISON")
    mA, mB = _niveau_mc(sA[0]), _niveau_mc(sB[0])
    cfg_ok = (mA * 3 + mB + 1) == vrai_cfg
    pal_ok = np.ones(n, dtype=bool)
    for i, (x, y) in enumerate(zip(mA, mB)):
        pal = ("ORIENTATION" if 2 in (x, y)
               else "MODULE DE COUPLE" if 1 in (x, y)
               else "EXERCICE MAISON")
        pal_ok[i] = pal == vrai_palier
    # héritages mesurés vs vrais
    boucle_ok = (np.abs(_mc_pct(np.round(sA[1], 3))
                        - _mc_pct(np.round(sB[1], 3))) >= 30.0) == vrai["boucle"]
    styles_ok = (np.round(np.abs(np.round(sA[1], 3) - np.round(sB[1], 3)), 2)
                 >= 1.00) == vrai["styles"]
    aL_ok = (np.round(np.abs(sA[2] - sB[2]), 2) >= 1.00) == vrai["asym_L"]
    aC_ok = (np.round(np.abs(sA[3] - sB[3]), 2) >= 1.00) == vrai["asym_C"]
    ok = cfg_ok & pal_ok & boucle_ok & styles_ok & aL_ok & aC_ok
    # RCI (A4) : ensembles PAR RIVE vs vrais (μ → μ+d)
    mode = g.get("re_mode")
    if mode == "exact" or g.get("frontieres_rci"):
        ok &= True                     # ε = 0 : Δ mesuré = Δ vrai (déterministe)
    elif mode == "sem":
        dA = np.asarray(g["dA"], dtype=float)
        dB = np.asarray(g["dB"], dtype=float)
        bruits = rng.normal(0.0, SEM_L7, size=(n, 6))
        for rive_idx, (mu_axes, d) in enumerate((
                ((ua["H"], ua["L"], ua["C"]), dA),
                ((ub["H"], ub["L"], ub["C"]), dB))):
            base = np.asarray(mu_axes)
            delta = d + bruits[:, rive_idx * 3:(rive_idx + 1) * 3]
            statuts = np.where(np.abs(delta) >= SEUIL_FIABLE, 2,
                               np.where(np.abs(delta) >= SEUIL_SUGGESTION,
                                        1, 0))
            vrai_ens = int(np.max(np.where(
                np.abs(d) >= SEUIL_FIABLE, 2,
                np.where(np.abs(d) >= SEUIL_SUGGESTION, 1, 0))))
            ok &= (statuts.max(axis=1) == vrai_ens)
    return float(ok.mean())


def NIVEAUX_MC_H(mu_h):
    """Indice de niveau de croisement d'un μ (0/1/2)."""
    if mu_h < 2.50:
        return 0
    if mu_h < 3.50:
        return 1
    return 2


def p_conformite_groupe(gname, rng):
    """p̂ théorique de conformité du groupe (surface servie complète ;
    override filet et non-entrée INVALIDE déterministes → 1,0)."""
    g = GEOMETRIE[gname]
    if g.get("filet"):
        return 1.0
    if g.get("rqs_non_entree"):
        return float(0.5 * 1.0
                     + 0.5 * _p_regime_mc(g["A_pru"], g["B_pru"], g, rng,
                                          N_MC))
    return float(_p_regime_mc(g["A"], g["B"], g, rng, N_MC))


def calibration_d_std_2():
    """Seuil PAR groupe = (p̂_MC − 2,5σ̂) — calibré binomial sur l'effectif
    réel du groupe, bornes DISTINCTES (leçon ad01f21). Le générateur MC est
    re-seedé LOCALEMENT à chaque appel (D-EMPREINTE : deux exécutions →
    même calibration)."""
    calib, centres = {}, {}
    rng = np.random.default_rng(SEED_MC)
    for gname, g in GEOMETRIE.items():
        n = g["n"]
        p = p_conformite_groupe(gname, rng)
        sigma = float((p * (1.0 - p) / n) ** 0.5)
        seuil = float(round(max(0.0, (p - 2.5 * sigma)) * 100.0, 1))
        calib[gname] = {"p_theo": round(p, 4), "sigma": round(sigma, 4),
                        "seuil": seuil, "n": n}
        if g.get("rqs_non_entree"):
            ua, ub = _mu_regime(g["A_pru"]), _mu_regime(g["B_pru"])
        else:
            ua, ub = _mu_regime(g["A"]), _mu_regime(g["B"])
        dists = [min(abs(ua["H"] - b), abs(ub["H"] - b)) / SIGMA_H
                 for b in (2.50, 3.50)]
        centres[gname] = {"mu_H_A": round(ua["H"], 3), "mu_H_B": round(ub["H"], 3),
                          "mu_agg_A": round(ua["agg"], 3),
                          "mu_agg_B": round(ub["agg"], 3),
                          "distance_min_seuil_sigma": round(min(dists), 2)}
    distinct = len({c["seuil"] for c in calib.values()}) == len(calib)
    return {"seuils": {k: v["seuil"] for k, v in calib.items()},
            "detail": calib, "centres": centres,
            "bornes_distinctes": distinct,
            "ok": distinct}


SEUILS_D_STD_2 = {k: v["seuil"] for k, v in calibration_d_std_2()["detail"].items()}
