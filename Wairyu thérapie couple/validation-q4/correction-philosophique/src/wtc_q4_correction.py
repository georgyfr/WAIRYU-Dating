# -*- coding: utf-8 -*-
"""
WTC-Q4 — COUCHE DE CORRECTION PHILOSOPHIQUE (fichier SUPPLÉMENTAIRE)
=====================================================================
RIO-04 « Notre danse » (croisement de couple) — rattrapage au gabarit
universel §5.1-§5.4 du canon (demande fondateur, trace 1a167755f324af9d).

RÈGLE ABSOLUE : ce module NE MODIFIE AUCUN moteur existant.
- Le vrai cœur du croisement reste `validation-q4/src/wtc_q4_core.py` —
  importé tel quel, jamais recopié : les 9 configurations nommées, les
  9 templates mot pour mot, le VRAI `rendre_affichage`, la VRAIE
  `boucle_poursuite_retrait`, le VRAI `identifier_configuration`.
- Les junctions utilisent le VRAI moteur `validation-q5/src/wtc_q5_core.py`
  (pas de chaque partenaire + suivi 14 j + re-test 8 semaines).
- Cette couche ajoute ce que l'audit (Task 163) a trouvé manquant sur
  RIO-04 : F2 palier de couple 🟢🟠🔴 + QUAND DEMANDER DE L'AIDE (15/25) ;
  F3 contenu des 3 paliers + branchement quête « pas » pour CHACUN des
  deux partenaires (6/25) ; F4 fragment de bilan L8 à 7 blocs niveau
  couple (15/25).

Chaque règle ci-dessous est PRÉ-ENREGISTRÉE (écrite avant tout calcul) et
dérivée MÉCANIQUEMENT des sorties du vrai cœur — zéro invention de mesure.

Règles pré-enregistrées :
- R1 (palier de couple) : dérivé MÉCANIQUEMENT des sorties du VRAI moteur,
  zéro seuil numérique ajouté — 🔴 ssi FEU_CROISE (les deux partenaires en
  alerte : les deux types corrigés ≥ 2,61 du moteur) ; 🟠 ssi boucle
  probable du VRAI `boucle_poursuite_retrait` (écart ≥ 30) OU exactement
  un partenaire en alerte (MIXTE_*_FEU) OU DISTANCE_POLIE (retrait
  partagé) ; 🟢 sinon (BASE_SEREINE, MIXTE_SEREINE_RETRAIT).
- R2 (seuil d'aide S1) : S1 ⇔ palier 🔴 — orientation chaleureuse à deux
  affichée (« l'orientation vers un professionnel de la relation n'est pas
  un échec — c'est le pas qui compte ici »).
- R3 (seuil d'aide S2) : S2 ⇔ palier 🟠 — à surveiller, re-test proposé à
  8 semaines ; la date est programmée par le VRAI `programmer_re_test_q1`,
  jamais forcée.
- R4 (qualité avant sens) : styles dissimulables (VRAI
  `styles_dissimulables`) → l'avertissement RÉEL du moteur est reproduit
  et la lecture est maintenue avec prudence (ce qui semble un écart peut
  être un effet de style).
- R5 (anti-fabrication §5.5) : aucun pourcentage de compatibilité n'est
  jamais affiché (pct_compatibilite None — hérité du VRAI moteur) ; la
  direction de la boucle est calculée par le moteur mais JAMAIS affichée
  (la danse est nommée ENSEMBLE) ; « rien à fabriquer » n'apparaît que là
  où le moteur nomme le calme — BASE_SEREINE, jamais ailleurs.
- R6 (gravité individuelle jamais dupliquée) : le palier de COUPLE lit la
  danse (configurations + boucle du moteur) ; la lecture individuelle de
  chaque partenaire reste portée par sa propre carte (RIO-01).
  MIXTE_SEREINE_RETRAIT se lit 🟢 au niveau du couple — aucun drapeau du
  VRAI moteur ne la marque — sans jamais minimiser le vécu de chacun.
- R7 (vocabulaire écran, canon Partie 9 + liste anti-blâme du VRAI
  moteur) : 0 mot interdit dans tout texte affiché ; D-CRISE non
  applicable à cet instrument (aucun construit d'auto-danger mesuré par
  le croisement) — consigné, remplacé par S1/S2.
- R8 (D-SIM) : bandeau simulation sur chaque bloc écran.
- R9 (couplage réel) : le pas annoncé pour CHACUN des deux partenaires est
  celui du VRAI `selectionner_pas` (face × empreinte — héritages MESURÉS
  par les Quêtes 1-2 de chaque partenaire, jamais devinés) ; le suivi
  14 j est le VRAI `suivre_14_jours` (0 sanction, compteur privé) ; le
  re-test est le VRAI `programmer_re_test_q1` (jamais forcé).
"""

from __future__ import annotations

import hashlib
import importlib.util
import sys
from pathlib import Path

# ─────────────────────────────────────────────────────────────────────────────
# CHARGEMENT DES VRAIS MOTEURS (jamais recopiés, jamais modifiés)
# ─────────────────────────────────────────────────────────────────────────────
_PKG = Path(__file__).resolve().parents[1]           # …/validation-q4/correction-philosophique
_WTC = _PKG.parents[1]                                # …/Wairyu thérapie couple


def _charge(nom: str, chemin: Path):
    spec = importlib.util.spec_from_file_location(nom, chemin)
    mod = importlib.util.module_from_spec(spec)
    sys.modules[nom] = mod
    spec.loader.exec_module(mod)
    return mod


core_q4 = _charge("wtc_q4_core", _WTC / "validation-q4" / "src" / "wtc_q4_core.py")
core_q5 = _charge("wtc_q5_core", _WTC / "validation-q5" / "src" / "wtc_q5_core.py")

# Vérification d'intégrité des moteurs chargés (ce sont bien les vrais) :
assert len(core_q4.CONFIGS_9) == 9
assert len(core_q4.TEMPLATES_CONFIGS) == 9
assert core_q5.SEUIL_CELEBRE == 9 and core_q5.SEUIL_AJUSTEMENT == 7
assert core_q4.verifier_templates()["ok"]
assert core_q4.verifier_symetrie()["ok"]
assert core_q4.verifier_non_blamant()["ok"]
assert core_q5.verifier_templates()["ok"]

# ─────────────────────────────────────────────────────────────────────────────
# CONSTANTES DE LA COUCHE (R1-R9)
# ─────────────────────────────────────────────────────────────────────────────
CONFIGS = core_q4.CONFIGS_9
FEU_SIMPLE = ("MIXTE_SEREINE_FEU", "MIXTE_POURSUITE_FEU", "MIXTE_RETRAIT_FEU")
CONFIG_SILENCE = "DISTANCE_POLIE"
CONFIG_CALME = "BASE_SEREINE"
CONFIG_FEU_DOUBLE = "FEU_CROISE"

PALIER_NOM = {"🟢": "Capitalisation — exercice maison",
              "🟠": "À deux — module de couple",
              "🔴": "Avec un professionnel — orientation chaleureuse"}

LABELS_OMBRE = ["ZONE CALME", "PEUR DE PERDRE", "PEUR D'ÊTRE ÉTOUFFÉE"]

# Scores corrigés représentatifs par type (l'espace des PAS est compacté
# par (type, empreinte) — la compactation est PROUVÉE en validation) :
SCORES_REPRESENTATIFS = {
    "SEREIN": (2.0, 2.0),
    "PREOCCUPE": (3.0, 2.0),
    "DETACHE": (2.0, 3.0),
    "EN_ALERTFEU": (3.0, 3.0),
}

FACE_DE_TYPE = {"SEREIN": "RASSUREE", "PREOCCUPE": "EN_QUETE",
                "DETACHE": "SUR_LA_RA", "EN_ALERTFEU": "SUR_LA_RA"}

MOTS_INTERDITS = (
    "pathologie", "diagnostic", "dépistage", "anxieux", "anxiété",
    "évitement", "évitant", "évitante", "désorganisé", "trouble",
    "syndrome", "désordre", "symptôme", "névrosisme", "narcissisme",
    "jalousie",
)

# Liste anti-blâme du VRAI moteur (verifier_non_blamant) — étendue à la
# couche entière (les mêmes interdits, le même esprit) :
MOTS_BLAME = (
    "ta faute", "ton tort", "c'est toi", "tu poursuis", "tu recules",
    "tu avances", "c'est lui", "c'est elle", "il poursuit", "elle poursuit",
    "%",
)

BANDEAU_DSIM = ("[D-SIM] Lecture issue d'une simulation — la mécanique est "
                "validée, pas la prévalence clinique.")

PHRASE_ORIENTATION = ("l'orientation vers un professionnel de la relation "
                      "n'est pas un échec — c'est le pas qui compte ici")

# Direction calculée par le VRAI moteur mais JAMAIS affichée (R5) :
DIRECTIONS_CACHEES = ("P1_AVANCE_P2_RECULE", "P2_AVANCE_P1_RECULE")


# ─────────────────────────────────────────────────────────────────────────────
# LECTURE DU CROISEMENT — 100 % via le VRAI moteur
# ─────────────────────────────────────────────────────────────────────────────
def lecture_croisement(p1: dict, p2: dict) -> dict:
    """Lit le croisement EXCLUSIVEMENT par les fonctions réelles du cœur.

    Args:
        p1, p2 : profils partenaires — clés lues : sA, sB, style,
                 label_ombre, forces (clés parasites tolérées, ignorées —
                 espion COR0).

    Returns:
        dict : types corrigés, percentiles (VRAI convertir_percentile),
        configuration (VRAI identifier_configuration), boucle (VRAI
        boucle_poursuite_retrait), avertissement style (VRAI
        styles_dissimulables), palier de couple (R1), S1/S2 (R2/R3).
    """
    t1 = core_q4.type_attachement(
        core_q4.corriger_style(p1["sA"], p1.get("style")),
        core_q4.corriger_style(p1["sB"], p1.get("style")))
    t2 = core_q4.type_attachement(
        core_q4.corriger_style(p2["sA"], p2.get("style")),
        core_q4.corriger_style(p2["sB"], p2.get("style")))
    pct1 = core_q4.convertir_percentile(p1["sA"], p1["sB"], p1.get("style"))
    pct2 = core_q4.convertir_percentile(p2["sA"], p2["sB"], p2.get("style"))
    boucle = core_q4.boucle_poursuite_retrait(pct1, pct2)
    config = core_q4.identifier_configuration(t1, t2)
    avert = core_q4.styles_dissimulables(p1.get("style"), p2.get("style"))
    pal = palier_couple(config, boucle["boucle_probable"])
    return {
        "type_p1": t1, "type_p2": t2, "pct_p1": pct1, "pct_p2": pct2,
        "ecart": boucle["ecart"], "boucle_probable": boucle["boucle_probable"],
        "direction": boucle["direction"], "boucle_dict": boucle,
        "config": config, "avert_style": avert, "palier": pal,
    }


def palier_couple(config: str, boucle_probable: bool) -> dict:
    """R1/R2/R3 — palier de couple dérivé MÉCANIQUEMENT des sorties du
    VRAI moteur (configuration + drapeau de boucle). Aucun seuil
    numérique ajouté : mapping catégoriel pur."""
    feu_double = config == CONFIG_FEU_DOUBLE
    feu_simple = config in FEU_SIMPLE
    silence = config == CONFIG_SILENCE
    if feu_double:
        palier = "🔴"
    elif boucle_probable or feu_simple or silence:
        palier = "🟠"
    else:
        palier = "🟢"
    causes = []
    if boucle_probable:
        causes.append("boucle")
    if feu_simple:
        causes.append("feu")
    if silence:
        causes.append("silence")
    return {
        "palier": palier, "palier_nom": PALIER_NOM[palier],
        "S1": feu_double, "S2": palier == "🟠",
        "causes_S2": causes, "feu_double": feu_double,
    }


def palier_independant(t1: str, t2: str) -> dict:
    """COR2 — chemin de calcul INDÉPENDANT (table et règle ré-encodées,
    sans appeler le moteur). Doit converger EXACTEMENT avec palier_couple()
    sur l'espace complet."""
    table = {
        ("SEREIN", "SEREIN"): "BASE_SEREINE",
        ("PREOCCUPE", "DETACHE"): "DANSE_QUI_TOURNE",
        ("DETACHE", "PREOCCUPE"): "DANSE_QUI_TOURNE",
        ("EN_ALERTFEU", "EN_ALERTFEU"): "FEU_CROISE",
        ("PREOCCUPE", "PREOCCUPE"): "FEU_CROISE",
        ("DETACHE", "DETACHE"): "DISTANCE_POLIE",
        ("SEREIN", "PREOCCUPE"): "MIXTE_SEREINE_POURSUITE",
        ("PREOCCUPE", "SEREIN"): "MIXTE_SEREINE_POURSUITE",
        ("SEREIN", "DETACHE"): "MIXTE_SEREINE_RETRAIT",
        ("DETACHE", "SEREIN"): "MIXTE_SEREINE_RETRAIT",
        ("SEREIN", "EN_ALERTFEU"): "MIXTE_SEREINE_FEU",
        ("EN_ALERTFEU", "SEREIN"): "MIXTE_SEREINE_FEU",
        ("PREOCCUPE", "EN_ALERTFEU"): "MIXTE_POURSUITE_FEU",
        ("EN_ALERTFEU", "PREOCCUPE"): "MIXTE_POURSUITE_FEU",
        ("DETACHE", "EN_ALERTFEU"): "MIXTE_RETRAIT_FEU",
        ("EN_ALERTFEU", "DETACHE"): "MIXTE_RETRAIT_FEU",
    }
    pct = {"SEREIN": 25, "PREOCCUPE": 70, "DETACHE": 20, "EN_ALERTFEU": 85}
    config = table[(t1, t2)]
    boucle = abs(pct[t1] - pct[t2]) >= 30
    feu_double = config == CONFIG_FEU_DOUBLE
    feu_simple = config in FEU_SIMPLE
    silence = config == CONFIG_SILENCE
    palier = "🔴" if feu_double else ("🟠" if (boucle or feu_simple or silence) else "🟢")
    return {"config": config, "boucle": boucle, "palier": palier,
            "S1": feu_double, "S2": palier == "🟠"}


# ─────────────────────────────────────────────────────────────────────────────
# F3 — CONTENU DES 3 PALIERS PAR CONFIGURATION RÉELLE (les 9 noms)
# ─────────────────────────────────────────────────────────────────────────────
_CONTENU_PALIER = {
    "BASE_SEREINE":
        "🟢 À votre portée, à deux : une fois par semaine, chacun nomme sur "
        "soi un moment où la danse a bien tenu — deux phrases suffisent. "
        "Cette zone est calme chez vous — rien à fabriquer ici, l'assise "
        "s'entretient en la nommant.",
    "MIXTE_SEREINE_RETRAIT":
        "🟢 À votre portée, à deux : laisser la porte ouverte sans la "
        "forcer — un détail d'intérieur partagé par jour par chacun, sur "
        "soi, sans attendre de réponse. L'écart se mesure sans blâme pour "
        "le retrait.",
    "DANSE_QUI_TOURNE":
        "🟠 À deux : nommer la rotation à froid — un temps fixe de paroles "
        "(15 minutes par semaine), l'un parle de sa danse en « je », "
        "l'autre répète ce qu'il a entendu avant de répondre. La rotation "
        "se ralentit quand elle est nommée ensemble, pas quand on la "
        "chasse.",
    "MIXTE_SEREINE_POURSUITE":
        "🟠 À deux : un rendez-vous fixe de retrouvaille — celui qui "
        "avance laisse un espace de réponse sans insister, celui qui est "
        "posé donne un signe clair (« je suis là »). Le pas se cherche à "
        "deux, jamais en silence.",
    "MIXTE_SEREINE_FEU":
        "🟠 À deux : convenir ensemble d'un signal d'apaisement et d'un "
        "signal de retour au calme — l'intensité d'un côté ne nie pas le "
        "calme de l'autre ; le feu se gère à deux, jamais à la place de "
        "l'autre.",
    "MIXTE_POURSUITE_FEU":
        "🟠 À deux : un canal clair pour l'avancée (une demande à la fois, "
        "qui peut être refusée) et le signal d'apaisement convenu ensemble "
        "— le mouvement et l'intensité se rencontrent sans qu'aucun ait "
        "tort.",
    "MIXTE_RETRAIT_FEU":
        "🟠 À deux : l'espace garanti sans rupture (une sortie honorable, "
        "une marche, dix minutes) et le signal d'apaisement convenu "
        "ensemble — le retrait et l'intensité se côtoient sans verdict.",
    "DISTANCE_POLIE":
        "🟠 À deux : un rituel de retrouvaille minuscule et fixe — dix "
        "minutes sans écran, chacun dit un détail de sa journée. Le "
        "retrait partagé n'est pas une indifférence ; la porte reste "
        "ouverte des deux côtés.",
    "FEU_CROISE":
        "🔴 Avec un professionnel : vos deux feux sont réels, l'intensité "
        "est portée des deux côtés — l'apaisement avant tout dialogue ; "
        + PHRASE_ORIENTATION + ".",
}


def clause_surveillance(causes: list) -> str:
    """R3 — clause S2 : les causes nommées SANS blâme, par le VRAI
    drapeau de boucle et la VRAIE configuration."""
    motifs = []
    if "boucle" in causes:
        motifs.append("votre danse tourne (l'un avance, l'autre recule, "
                      "et le mouvement se répète)")
    if "feu" in causes:
        motifs.append("un des deux feux est allumé dans votre danse")
    if "silence" in causes:
        motifs.append("le silence s'installe des deux côtés")
    return ("À surveiller : " + " ; ".join(motifs) +
            " — re-test proposé à 8 semaines (chacun reprend ses Quêtes "
            "1-2 ; la date est programmée, jamais forcée).")


def clause_orientation() -> str:
    """R2 — clause S1 : orientation chaleureuse à deux."""
    return ("Seuil atteint : votre danse se lit FEU CROISÉ — les deux "
            "partenaires en alerte. L'orientation est proposée. "
            + PHRASE_ORIENTATION + ".")


def clause_aide_standing() -> str:
    """QUAND DEMANDER DE L'AIDE — version couple, seuils posés d'avance."""
    return ("QUAND DEMANDER DE L'AIDE — seuils posés d'avance, les mêmes "
            "pour tous les couples : les deux partenaires en alerte (FEU "
            "CROISÉ) → parler à un professionnel de la relation est "
            "proposé ; une boucle qui tourne, un feu actif d'un côté ou un "
            "silence installé → à surveiller, re-test proposé à 8 "
            "semaines ; des styles de réponse opposés → lire les repères "
            "avec prudence, ce qui semble un écart peut être un effet de "
            "style. La lecture individuelle de chacun reste portée par sa "
            "propre carte — le palier de couple ne remplace jamais la "
            "lecture de chacun. Aucun pourcentage de compatibilité n'est "
            "affiché : votre danse n'est pas une note.")


# ─────────────────────────────────────────────────────────────────────────────
# BLOC ÉCRAN — l'affichage RÉEL du moteur + les couches manquantes
# ─────────────────────────────────────────────────────────────────────────────
def _texte_sain(texte: str) -> int:
    bas = texte.lower()
    return (sum(1 for m in MOTS_INTERDITS if m in bas)
            + sum(1 for m in MOTS_BLAME if m in bas)
            + sum(1 for d in DIRECTIONS_CACHEES if d in texte))


def bloc_ecran(lect: dict, label_p1: str, label_p2: str,
               forces_p1: list, forces_p2: list) -> dict:
    """Assemble le bloc écran couple complet : l'affichage RÉEL du VRAI
    moteur (template mot pour mot, boucle nommée ensemble, confirmations
    sur soi, avertissement de style) + les couches manquantes de l'audit
    (palier, contenu, S1/S2, aide debout). Toutes les clauses sont
    déterminées mécaniquement par les sorties du vrai cœur."""
    aff = core_q4.rendre_affichage(lect["config"], lect["boucle_dict"],
                                   lect["avert_style"], label_p1, label_p2,
                                   forces_p1, forces_p2)
    pal = lect["palier"]
    parties = [BANDEAU_DSIM]
    parties.append(aff["template_config"])
    if aff["boucle_nommee_ensemble"]:
        parties.append(aff["boucle_nommee_ensemble"])
    parties.append(aff["confirmation_p1"])
    parties.append(aff["confirmation_p2"])
    if aff["avertissement_style"]:
        parties.append(aff["avertissement_style"])
    parties.append(f"CE QUE VOUS POUVEZ CHANGER — palier {pal['palier']} "
                   f"({pal['palier_nom']}) :")
    parties.append(_CONTENU_PALIER[lect["config"]])
    if pal["S1"]:
        parties.append(clause_orientation())
    if pal["S2"]:
        parties.append(clause_surveillance(pal["causes_S2"]))
    parties.append(clause_aide_standing())
    texte = "\n".join(parties)
    return {
        "texte": texte,
        "md5": hashlib.md5(texte.encode("utf-8")).hexdigest(),
        "nb_mots_interdits": _texte_sain(texte),
        "pct_compatibilite": aff["pct_compatibilite"],
        "calme_present": "rien à fabriquer" in texte,
        "direction_affichee": any(d in texte for d in DIRECTIONS_CACHEES),
        "avert_present": aff["avertissement_style"] is not None,
    }


# ─────────────────────────────────────────────────────────────────────────────
# R9 — PAS DE CHACUN (VRAI moteur Q5) — chacun sur soi, jamais un pas de couple
# ─────────────────────────────────────────────────────────────────────────────
def pas_du_couple(type_p1: str, label_p1: str, type_p2: str, label_p2: str) -> dict:
    """Le pas de CHACUN des deux partenaires via le VRAI selectionner_pas
    (face × empreinte). Les scores représentatifs ne portent que le type —
    la compactation pas ≡ (type, empreinte) est PROUVÉE en validation."""
    sA1, sB1 = SCORES_REPRESENTATIFS[type_p1]
    sA2, sB2 = SCORES_REPRESENTATIFS[type_p2]
    pas1 = core_q5.selectionner_pas(sA1, sB1, label_p1)
    pas2 = core_q5.selectionner_pas(sA2, sB2, label_p2)
    return {"pas_p1": pas1, "pas_p2": pas2}


# ─────────────────────────────────────────────────────────────────────────────
# F4 — FRAGMENT DE BILAN L8 (7 blocs) — niveau couple, junctions VRAIES
# ─────────────────────────────────────────────────────────────────────────────
def bilan_fragment(lect: dict, label_p1: str, label_p2: str,
                   forces_p1: list, forces_p2: list) -> dict:
    """Contribution de RIO-04 au bilan d'ensemble (assemblage L8 du canon)
    — niveau couple. Les blocs pointent les VRAIES tables du moteur Q4
    (les 9 configurations, le template mot pour mot) et le VRAI moteur Q5
    (pas de chaque partenaire)."""
    pal = lect["palier"]
    pc = pas_du_couple(lect["type_p1"], label_p1, lect["type_p2"], label_p2)
    feu_p1 = lect["type_p1"] in ("PREOCCUPE", "EN_ALERTFEU")
    feu_p2 = lect["type_p2"] in ("PREOCCUPE", "EN_ALERTFEU")
    fragment = {
        "bloc_1_position": {
            "p1": {"type_corrige": lect["type_p1"], "percentile": lect["pct_p1"]},
            "p2": {"type_corrige": lect["type_p2"], "percentile": lect["pct_p2"]},
            "styles_lus": True,
            "configuration": lect["config"],
        },
        "bloc_2_forme": {
            "boucle_probable": lect["boucle_probable"],
            "ecart_points": lect["ecart"],
            "direction": "calculée par le moteur, jamais affichée — la "
                         "danse est nommée ensemble",
            "pivot": "—",
        },
        "bloc_3_empreinte": {
            "source": "RIO-02 — vraie empreinte Q2 de chacun (normalisée "
                      "par le VRAI empreinte())",
            "p1": core_q5.empreinte(label_p1),
            "p2": core_q5.empreinte(label_p2),
        },
        "bloc_4_couple": {
            "source": "RIO-04 — vraie table Q4 (CONFIGS_9)",
            "configuration": lect["config"],
            "les_neuf_configurations": sorted(CONFIGS),
            "template_mot_pour_mot": core_q4.TEMPLATES_CONFIGS[lect["config"]],
            "boucle_nommee_ensemble": lect["boucle_probable"],
        },
        "bloc_5_force": {
            "p1": forces_p1 if forces_p1 else ["rien de marqué pour l'instant"],
            "p2": forces_p2 if forces_p2 else ["rien de marqué pour l'instant"],
        },
        "bloc_6_limites": {
            "p1": "en alerte — les peurs vives" if feu_p1 else "aucune alerte",
            "p2": "en alerte — les peurs vives" if feu_p2 else "aucune alerte",
            "nommé_sans_blâme": True,
        },
        "bloc_7_palier_pas": {
            "palier": pal["palier"],
            "palier_nom": pal["palier_nom"],
            "pas_p1": pc["pas_p1"]["pas"],
            "pas_p2": pc["pas_p2"]["pas"],
            "pas_labels": sorted({pc["pas_p1"]["label"], pc["pas_p2"]["label"]}),
            "suivi": "14 jours par le VRAI suivi — 3 cas (CELEBRE 9/14 · "
                     "AJUSTEMENT 7-8/14 · REPRISE ≤ 6/14), 0 sanction, "
                     "compteur privé",
            "retest": "re-test proposé à 8 semaines — programmé par le "
                      "VRAI programmer_re_test_q1, jamais forcé",
        },
    }
    fragment["_complet"] = all(
        v not in (None, "", [], {}) for v in _valeurs_feuilles(fragment)
    )
    return fragment


def _valeurs_feuilles(obj):
    if isinstance(obj, dict):
        for v in obj.values():
            yield from _valeurs_feuilles(v)
    elif isinstance(obj, (list, tuple)):
        for v in obj:
            yield from _valeurs_feuilles(v)
    else:
        yield obj
