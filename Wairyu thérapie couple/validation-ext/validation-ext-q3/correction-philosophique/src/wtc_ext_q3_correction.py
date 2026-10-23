# -*- coding: utf-8 -*-
"""
WTC-EXT-Q3 — COUCHE DE CORRECTION PHILOSOPHIQUE (fichier SUPPLÉMENTAIRE)
========================================================================
RIO-18 « Le pas de l'horizon » (pas + récapitulatif) — rattrapage au
gabarit universel §5.1-§5.4 du canon (demande fondateur « lance RIO-16→18 »,
même ordre que RIO-01→17 : fichiers SUPPLÉMENTAIRES, zéro modification de
l'existant, exactitude des calculs).

RÈGLE ABSOLUE : ce module NE MODIFIE AUCUN moteur existant.
- Le vrai cœur de la quête reste `validation-ext/validation-ext-q3/src/
  wtc_ext_q3_core.py` (le pas — banque 3/2/1 par famille héritée, pas zéro
  zone calme, choix jamais prescrit ligne 366, check-in partagé 14 j 9/14
  célébré sans sanction, RCI L7 verbatim 0,58/0,41, agrégation max,
  traversées H 2,50/3,50 et L/C 1,80/2,60/3,20, override D-CRISE, entrée
  RQS ligne 257, A6 récapitulatif descriptif de dimension — VALIDÉ 7/7 et
  CONTRESIGNÉ) — importé tel quel, jamais recopié.
- Cette couche ajoute ce que l'audit (Task 163) a trouvé manquant sur
  RIO-18 : F4 (22/25) — le fragment de bilan L8 niveau COUPLE à 7 blocs
  canon, COMPLET sur TOUS les chemins (override D-CRISE · non-entrée RQS ·
  entrée avec pas zéro / pas servi / pas non évalué). F3 (25/25) est
  PRÉSERVÉ tel quel (leçon RIO-15 : les pas affichés sont les VRAIS de la
  banque, servis par le VRAI `pas_de`, JAMAIS réécrits) ; F1 reste 20/25
  (PLAFOND STRUCTUREL du barème pour les quêtes « pas » — RIO-05/10/15/18/
  23 notées F1 20 ; prétendre 100 % serait une fabrication) ; F2 (25/25)
  est préservé (palier hérité affiché + doctrine du pas + QUAND DEMANDER,
  validés C5-C7).

Chaque règle ci-dessous est PRÉ-ENREGISTRÉE (écrite avant tout calcul) et
dérivée MÉCANIQUEMENT des sorties du vrai cœur — zéro invention de mesure.

Règles pré-enregistrées :
- R1 (palier HÉRITÉ, jamais recalculé) : le palier, la configuration et la
  zone calme affichés sont CEUX DE Q2 (sortie contresignée — une mesure un
  rôle, leçon A1-SM-Q4) ; l'assert de junction vérifie à chaque appel que
  le pas servi est le VRAI `pas_de(palier_hérité, choix, zone)`. **0 seuil
  ajouté.**
- R2 (override D-CRISE, court-circuit) : JAMAIS de pas de couple en crise
  (le VRAI classifier retourne pas=None, statut=None, rci=None) — le
  bandeau MOT POUR MOT, la config calculée et tracée, jamais servie.
  Afficher un pas serait fabriquer.
- R3 (entrée RQS — ligne 257) : RQS INVALIDE chez une rive = le couple
  n'entre pas au pas — aucun résultat (bandeau VRAI). Les textes affichés
  sont les VRAIS templates du cœur (pas_zero, celebree, en_chemin,
  suivi_partage, orientation, re_cap… mot pour mot).
- R4 (frontières exactes consignées) : check-in 9/14 PILE inclusive
  (9 → CÉLÉBRÉ) · RCI |Δ| ≥ 0,58 FIABLE · [0,41 ; 0,58[ SUGGESTION ·
  < 0,41 BRUIT (bornes testées PILE, 2 sens) · traversées H 2,50/3,50 et
  L/C 1,80/2,60/3,20 (VRAI `traverse_de`/`signification_de`) · agrégation
  d'ensemble = MAX des 3 statuts de la rive (convention d'affichage
  explicite — anti-surinterprétation L4, prouvée sur les 27 triplets).
- R5 (anti-fabrication) : le pas est CHOISI jamais prescrit (le VRAI
  `pas_de` respecte le choix dans la banque de la famille — ligne 366) ;
  le suivi est CÉLÉBRÉ jamais sanctionné (compteur partagé privé — le bit
  commun n'expose jamais le contenu d'une rive, ligne 370) ; le pas zéro
  n'est légitime qu'en zone calme (VRAI `pas_zero_legitime`) — « rien à
  fabriquer » dit comme tel ; le pas non déployé (override/non-entrée) =
  rien à évaluer (VRAI statut None). 0 verdict temporel.
- R6 (vocabulaire écran, canon Partie 9 + C7 anti-blâme/anti-tiers) :
  aucun mot de la liste interdite, aucun reproche (« coupable », « blâme »,
  « fautif »…), aucun nom de tiers (aînés/familles = rôles, jamais de
  noms — ligne 363). EXCEPTION SOURCÉE : le filet 3919/3114 est le literal
  du VRAI moteur.
- R7 (D-SIM) : bandeau simulation (le VRAI D_SIM du cœur) sur chaque bloc.
- R8 (L7 — une mesure un rôle) : les lectures RCI sont DÉCLARÉES PAR RIVE,
  JAMAIS comparées entre rives (VRAI template + C7) ; l'ensemble nomme le
  plus fort des six statuts lus (max), il ne compare jamais.
- R9 (A6 — récapitulatif de dimension) : le récapitulatif affiché est le
  VRAI `RECAP_DIMENSION` du cœur (3 quêtes : carte → croisement → pas),
  descriptif, 0 verdict de dimension — cité tel quel.
"""

from __future__ import annotations

import importlib.util
import sys
from pathlib import Path

# ─────────────────────────────────────────────────────────────────────────────
# CHARGEMENT DU VRAI MOTEUR (jamais recopié, jamais modifié)
# ─────────────────────────────────────────────────────────────────────────────
_PKG = Path(__file__).resolve().parents[1]           # …/validation-ext-q3/correction-philosophique
_Q3 = _PKG.parent                                    # …/validation-ext-q3


def _charge(nom: str, chemin: Path):
    spec = importlib.util.spec_from_file_location(nom, chemin)
    mod = importlib.util.module_from_spec(spec)
    sys.modules[nom] = mod
    spec.loader.exec_module(mod)
    return mod


core_q3 = _charge("wtc_ext_q3_core", _Q3 / "src" / "wtc_ext_q3_core.py")

# Vérification d'intégrité (c'est bien le vrai moteur) :
assert core_q3.N_JOURS == 14 and core_q3.SEUIL_CELEBRE == 9
assert len(core_q3.BANQUE_PAS_EXT[core_q3.FAMILLE_VERT]) == 3
assert len(core_q3.BANQUE_PAS_EXT[core_q3.FAMILLE_ORANGE]) == 2
assert len(core_q3.BANQUE_PAS_EXT[core_q3.FAMILLE_ROUGE]) == 1
assert core_q3.SEUIL_FIABLE == 0.58 and core_q3.SEUIL_SUGGESTION == 0.41
assert len(core_q3.RECAP_DIMENSION) == 3
assert core_q3.pas_zero_legitime(True) and not core_q3.pas_zero_legitime(False)
assert core_q3.statut_engagement_de(None) is None

# ─────────────────────────────────────────────────────────────────────────────
# CONSTANTES DE LA COUCHE (R1-R9)
# ─────────────────────────────────────────────────────────────────────────────
D_SIM = core_q3.D_SIM
CLAUSE_AIDE = core_q3.TEMPLATES["aide_seuils"]
TEMPLATE_OVERRIDE = core_q3.TEMPLATES["override"]
TEMPLATE_NON_ENTREE = core_q3.TEMPLATES["non_entree"]
TEMPLATE_PAS_ZERO = core_q3.TEMPLATES["pas_zero"]
TEMPLATE_SUIVI = core_q3.TEMPLATES["suivi_partage"]
TEMPLATE_ORIENTATION = core_q3.TEMPLATES["orientation"]
TEMPLATE_JAMAIS_COMPAREES = core_q3.TEMPLATES["jamais_comparees"]
RECAP_DIMENSION = core_q3.RECAP_DIMENSION
FILET_LITERAL = "3919 / 3114 — P-FILTRE"
DOCTRINE_COMPARATIF = ("0 % compatibilité — le pas lit le palier HÉRITÉ de "
                       "Q2 et deux lectures déclarées, jamais un score "
                       "comparé")

# Les libellés de palier HÉRITÉS de Q2 sont les clés du VRAI
# _FAMILLE_PAR_PALIER du moteur (source unique — jamais réécrites) :
PALIER_VERT = next(k for k, f in core_q3._FAMILLE_PAR_PALIER.items()
                   if f == core_q3.FAMILLE_VERT)
PALIER_ORANGE = next(k for k, f in core_q3._FAMILLE_PAR_PALIER.items()
                     if f == core_q3.FAMILLE_ORANGE)
PALIER_ROUGE = next(k for k, f in core_q3._FAMILLE_PAR_PALIER.items()
                    if f == core_q3.FAMILLE_ROUGE)
PALIER_NOM = {PALIER_VERT: "Exercice maison", PALIER_ORANGE: "Module de couple",
              PALIER_ROUGE: "Orientation professionnelle"}

# Vocabulaire interdit — canon Partie 9 + C6 (temporel) + C7 (blâme/tiers) :
MOTS_INTERDITS = (
    "pathologie", "diagnostic", "dépistage", "anxieux", "anxiété",
    "dépressif", "dépression", "trouble", "syndrome", "symptôme",
    "burn-out", "burnout", "addiction", "bipolaire", "borderline",
    "schizophrénie", "névrose", "psychose", "suicide", "médicament",
    "posologie", "chronique",
    "trop tard", "trop jeune", "trop vieux", "compte à rebours",
    "il est temps", "bonne saison", "mauvaise saison", "temps restant",
    "temps qui reste", "dépêch", "pressé", "presser", "urgence",
    "sablier", "échéance",
    # C7 — anti-blâme / anti-tiers (listes du VRAI package) :
    "coupable", "blâme", "fautif", "à condamner", "de sa faute",
    "c'est sa faute", "il bloque", "elle bloque", "qui a raté",
    "qui devait", "nom d'ainé", "nom de famille", "monsieur", "madame",
)


# ─────────────────────────────────────────────────────────────────────────────
# R1 — JUNCTION : pas et statut (asserts à chaque appel)
# ─────────────────────────────────────────────────────────────────────────────
def _assert_junction(sortie_q2: dict, v: dict, serie=None, choix=None,
                     bases=None, re_tests=None) -> None:
    """R1/R4/R5 — la sortie consommée est bien celle du VRAI cœur : le pas
    est le VRAI `pas_de(palier_hérité, choix, zone)` (jamais réécrit — le
    choix du couple est respecté dans la banque), le statut le VRAI
    `statut_engagement_de(serie)`, le RCI le VRAI `rci_de`."""
    palier = sortie_q2["palier"]
    zone = sortie_q2["zone_calme"]
    pas_vrai = core_q3.pas_de(palier, choix, zone)
    statut_vrai = core_q3.statut_engagement_de(serie)
    if v["override"] or not v["entree"]:
        assert v["pas"] is None and v["statut"] is None and v["rci"] is None
        return
    assert v["palier"] == palier and v["pas"] == pas_vrai, \
        "junction pas : le VRAI pas_de ne correspond pas"
    assert v["statut"] == statut_vrai
    if bases and re_tests:
        assert v["rci"] == core_q3.rci_de(bases, re_tests)
    else:
        assert v["rci"] is None
    # le pas servi appartient à la banque de la famille (ou pas zéro légitime) :
    fam = core_q3.famille_de(palier)
    assert v["pas"] == core_q3.PAS_ZERO or v["pas"] in core_q3.BANQUE_PAS_EXT[fam]
    if v["pas"] == core_q3.PAS_ZERO:
        # règle du VRAI moteur : le pas zéro CHOISI est honoré ssi zone calme
        # (pas_zero_legitime) — la zone calme n'existe qu'en config 1 (VERT)
        # dans le flux réel, consigné
        assert core_q3.pas_zero_legitime(zone)


# ─────────────────────────────────────────────────────────────────────────────
# F2/F3 — BLOC ÉCRAN PAS (toutes les clauses dérivées des VRAIES sorties)
# ─────────────────────────────────────────────────────────────────────────────
def bloc_ecran_pas(sortie_q2: dict, v: dict, serie=None, choix=None,
                   bases=None, re_tests=None) -> dict:
    """F2/F3 — assemble le bloc écran complet RIO-18 (palier HÉRITÉ + pas =
    VRAIS — asserts de junction ; bandeau D-SIM — R7)."""
    bloc = {"bandeau_dsim": D_SIM}
    if v["override"]:
        # R2 — court-circuit MOT POUR MOT, aucun pas :
        bloc.update({
            "display": v["display"],
            "bandeau_court_circuit": v["bandeau"],
            "palier_herite_trace": {"palier": sortie_q2["palier"],
                                    "config": sortie_q2["config_nom"],
                                    "deploiement": ("calculée et tracée — "
                                                    "JAMAIS de pas de couple "
                                                    "en crise")},
            "pas_servi": "aucun — jamais de pas de couple en crise",
            "seuils_aide": CLAUSE_AIDE,
            "demarche_orientation": TEMPLATE_ORIENTATION,
        })
        return bloc
    if not v["entree"]:
        # R3 — ligne 257 : aucun résultat de couple :
        bloc.update({
            "display": v["display"],
            "bandeau_non_entree": v["bandeau"],
            "palier_herite_trace": {"palier": sortie_q2["palier"],
                                    "config": sortie_q2["config_nom"],
                                    "deploiement": ("calculée et tracée — le "
                                                    "couple n'entre pas au pas "
                                                    "(ligne 257)")},
            "pas_servi": "aucun — aucun résultat de couple affiché",
            "seuils_aide": CLAUSE_AIDE,
        })
        return bloc
    # entrée complète — le pas servi est le VRAI (junction, choix respecté) :
    _assert_junction(sortie_q2, v, serie, choix, bases, re_tests)
    pas = v["pas"]
    zone = sortie_q2["zone_calme"]
    nb_jours = (sum(1 for j in serie if j) if serie is not None else None)
    if v["statut"] is None:
        suivi_texte = ("rien à évaluer — la série de check-in n'est pas "
                       "fournie (le VRAI statut_engagement_de retourne None)")
    elif nb_jours == core_q3.SEUIL_CELEBRE:
        suivi_texte = core_q3.TEMPLATES["celebre_pile"]
    elif v["statut"] == core_q3.STATUT_CELEBRE:
        suivi_texte = core_q3.TEMPLATES["celebre"].format(n=nb_jours)
    else:
        suivi_texte = core_q3.TEMPLATES["en_chemin"].format(n=nb_jours)
    bloc.update({
        "display": v["display"],
        "palier_herite": v["palier"],
        "palier_nom": PALIER_NOM[v["palier"]],
        "config": {"num": sortie_q2["config_num"],
                   "nom": sortie_q2["config_nom"],
                   "zone_calme": zone},
        "pas_servi": pas,
        "famille": core_q3.famille_de(v["palier"]),
        "banque_famille": list(
            core_q3.BANQUE_PAS_EXT[core_q3.famille_de(v["palier"])]),
        "pas_zero_legitime": core_q3.pas_zero_legitime(zone),
        "doctrine_choix": ("le pas est choisi, jamais prescrit (ligne 366) — "
                           "le couple valide ou conteste dans la banque de "
                           "sa famille"),
        "suivi": {
            "statut": v["statut"],
            "texte": suivi_texte,
            "regle": TEMPLATE_SUIVI,
        },
        "seuils_aide": CLAUSE_AIDE,
        "recap_dimension": [dict(r) for r in RECAP_DIMENSION],
    })
    return bloc


# ─────────────────────────────────────────────────────────────────────────────
# F4 — FRAGMENT DE BILAN L8 NIVEAU COUPLE (7 blocs canon, complet partout)
# ─────────────────────────────────────────────────────────────────────────────
def _fragment_hors_pas(sortie_q2: dict, v: dict, chemin: str,
                       rive_a: dict = None, rive_b: dict = None) -> dict:
    """F4 — fragment complet des chemins sans pas (override, non-entrée) :
    les 7 blocs restent remplis — aucun bloc vide (COR1)."""
    if chemin == "override":
        cause = ("court-circuit D-CRISE — JAMAIS de pas de couple en crise "
                 "(configuration calculée et tracée)")
        pas_note = "aucun pas servi — le court-circuit passe avant tout choix"
        palier_note = PALIER_ROUGE
    else:
        cause = ("RQS < 70 chez une rive — le couple n'entre pas au pas "
                 "(ligne 257) ; aucun résultat de couple")
        pas_note = "aucun pas servi — aucun résultat affiché"
        palier_note = "aucun — aucun résultat de couple affiché"
    out = {
        "bloc_1_position": {
            "palier_herite": sortie_q2["palier"],
            "config": {"num": sortie_q2["config_num"],
                       "nom": sortie_q2["config_nom"],
                       "zone_calme": sortie_q2["zone_calme"]},
            "deploiement": cause,
            "dans_bande_dsim": True,
        },
        "bloc_2_forme": {
            # COR1 : aucun bloc vide — la consignation dit POURQUOI aucun pas
            "pas_servi": ("aucun — " + cause.split(" — ")[0].lower()),
            "note": pas_note,
            "famille": core_q3.famille_de(sortie_q2["palier"]),
        },
        "bloc_3_empreinte": {
            "source": "le RCI L7 se lit sur les re-tests à 8 semaines",
            "note": ("aucun RCI lu — aucun pas déployé, rien à évaluer"),
            "jamais_comparees": TEMPLATE_JAMAIS_COMPAREES,
        },
        "bloc_4_couple": {
            "palier": palier_note,
            "override_d_crise": (TEMPLATE_OVERRIDE if chemin == "override"
                                 else "non concerné — aucun signal de crise"),
            "entree_rqs": (TEMPLATE_NON_ENTREE if chemin != "override"
                           else "non concerné — les deux rives entrent"),
            "verdict_comparatif": DOCTRINE_COMPARATIF,
        },
        "bloc_5_force": {
            "source": "le pas tenu (check-in partagé 14 j)",
            "note": ("rien à évaluer — aucun pas déployé (le VRAI statut "
                     "retourne None)"),
        },
        "bloc_6_limites": {
            "note": cause,
            "filet": (FILET_LITERAL if chemin == "override" else "aucun signal"),
            "bandeau_dsim": D_SIM,
        },
        "bloc_7_palier_pas": {
            "palier": palier_note,
            "pas_possibles": pas_note,
            "pas_en_crise": ("aucun pas de couple sur un signal sécurité — "
                             "l'orientation EST la démarche" if chemin == "override"
                             else "non concerné"),
            "filet": (FILET_LITERAL if chemin == "override" else "aucun signal"),
            "suivi_14_jours_sans_sanction": True,
            "statut": ("non évalué — aucun pas déployé (le VRAI statut "
                       "retourne None : rien à évaluer)"),
            "retest": ("re-tests RIO-16 des rives à 8 semaines — le pas se "
                       "relit après"),
            "recap_dimension": [dict(r) for r in RECAP_DIMENSION],
        },
    }
    out["_complet"] = all(
        x not in (None, "", [], {}) for x in _valeurs_feuilles(out)
        if x is not True and x is not False)
    return out


def bilan_fragment_pas(sortie_q2: dict, v: dict, serie=None,
                       bases=None, re_tests=None, choix=None,
                       rive_a: dict = None, rive_b: dict = None) -> dict:
    """Contribution de RIO-18 au bilan d'ensemble (assemblage L8 du canon,
    ligne 265) — niveau COUPLE, avec le VRAI A6 récapitulatif de dimension.
    Complet sur TOUS les chemins (COR1)."""
    _assert_junction(sortie_q2, v, serie, choix, bases, re_tests)
    if v["override"]:
        return _fragment_hors_pas(sortie_q2, v, "override")
    if not v["entree"]:
        return _fragment_hors_pas(sortie_q2, v, "non_entree",
                                  rive_a, rive_b)
    pas = v["pas"]
    rci = v["rci"]
    pas_zero_legitime = core_q3.pas_zero_legitime(sortie_q2["zone_calme"])
    if pas == core_q3.PAS_ZERO:
        pas_contenu = {"pas": pas, "template": TEMPLATE_PAS_ZERO,
                       "zone_calme": True,
                       "note": ("le pas zéro est légitime en zone calme — "
                                "rien à fabriquer, l'exercice maison reste "
                                "disponible")}
        pas_zero = True
    elif v["palier"] == PALIER_ROUGE:
        pas_contenu = {"pas": pas, "template": TEMPLATE_ORIENTATION,
                       "note": ("le pas EST la démarche d'orientation — le "
                                "chemin le plus court, pas un échec")}
        pas_zero = False
    else:
        pas_contenu = {"pas": pas,
                       "note": ("le pas servi est le VRAI de la banque de la "
                                "famille, jamais réécrit — choisi, jamais "
                                "prescrit")}
        pas_zero = False
    rci_bloc = {
        "present": rci is not None,
        "jamais_comparees": TEMPLATE_JAMAIS_COMPAREES,
        "note": ("lectures L7 réelles : statuts par rive et par axe, "
                 "traversées de seuil nommées" if rci is not None else
                 ("aucun re-test consommé — le RCI se lit à 8 semaines "
                  "(bases/re_tests absents)")),
    }
    if rci is not None:
        for rive in core_q3.RIVES:
            ent = rci["rives"][rive]
            rci_bloc[f"rive_{rive}"] = {
                "statuts": dict(ent["statuts"]),
                "ensemble": ent["ensemble"],
                # signification_de retourne "" sans traversée — la
                # consignation le dit (COR1 : aucune feuille vide) :
                "traversees": {a: (ent["traversees"][a],
                                   core_q3.signification_de(
                                       a, bases[rive][a], re_tests[rive][a])
                                   or "aucune traversée — le niveau est "
                                      "resté le même")
                               for a in core_q3.AXES},
            }
    statut_bloc = {
        "statut": (v["statut"] or
                   "non évalué — rien à évaluer (le VRAI "
                   "statut_engagement_de retourne None)"),
        "note": ("suivi PARTAGÉ 14 j — 9/14 célébré pile sur le seuil, "
                 "jamais de sanction (le bit commun n'expose jamais le "
                 "contenu d'une rive, ligne 370)"
                 if v["statut"] is not None else
                 "rien à évaluer — la zone calme est dite comme telle (§5.5)"),
        "regle": TEMPLATE_SUIVI,
    }
    frag = {
        "bloc_1_position": {
            "palier_herite": v["palier"],
            "palier_nom": PALIER_NOM[v["palier"]],
            "config": {"num": sortie_q2["config_num"],
                       "nom": sortie_q2["config_nom"],
                       "zone_calme": sortie_q2["zone_calme"]},
            "display": v["display"],
            "dans_bande_dsim": True,
        },
        "bloc_2_forme": {
            "pas_servi": pas,
            "contenu_pas": pas_contenu,
            "famille": core_q3.famille_de(v["palier"]),
            "banque_famille": list(
                core_q3.BANQUE_PAS_EXT[core_q3.famille_de(v["palier"])]),
            "doctrine_choix": ("choisi, jamais prescrit (ligne 366) — le "
                               "couple valide ou conteste"),
            "pas_zero_legitime": pas_zero_legitime,
        },
        "bloc_3_empreinte": rci_bloc,
        "bloc_4_couple": {
            "palier": v["palier"],
            "zone_calme": sortie_q2["zone_calme"],
            "override_d_crise": "non concerné — aucun signal de crise",
            "verdict_comparatif": DOCTRINE_COMPARATIF,
            "doctrine": ("boucle et styles hérités de Q2 comme AVERTISSEMENTS "
                         "— jamais des verdicts ; 0 % compatibilité"),
            "heritages": v.get("heritages") or {
                "note": ("héritages Q2 non transmis par cette sortie — les "
                         "avertissements (boucle, styles, asymétries) sont "
                         "affichés au croisement RIO-17, jamais redevés ici")},
        },
        "bloc_5_force": {
            "source": "le pas tenu (check-in partagé 14 j, sans sanction)",
            "statut": statut_bloc,
            "pas_zero": pas_zero,
            "note": ("le pas zéro n'est pas un échec — la zone calme est dite "
                     "comme telle (§5.5)" if pas_zero else
                     "le suivi compte à deux, jamais contre"),
        },
        "bloc_6_limites": {
            "rqs_rive_a": (rive_a or {}).get("rqs_statut", "non transmis"),
            "rqs_rive_b": (rive_b or {}).get("rqs_statut", "non transmis"),
            "note": ("les deux rives entrent avec une qualité suffisante "
                     "(ligne 257)"),
            "bandeau_dsim": D_SIM,
        },
        "bloc_7_palier_pas": {
            "palier": v["palier"],
            "pas_servi": pas,
            "pas_zero_legitime": pas_zero_legitime,
            "suivi_14_jours_sans_sanction": True,
            "statut": (v["statut"] or
                       "non évalué — rien à évaluer (pas non déployé ou "
                       "série de check-in absente)"),
            "retest": ("le RCI se lit sur les re-tests à 8 semaines — les "
                       "lectures L7 sont déclarées par rive, jamais comparées"),
            "recap_dimension": [dict(r) for r in RECAP_DIMENSION],
        },
    }
    frag["_complet"] = all(
        x not in (None, "", [], {}) for x in _valeurs_feuilles(frag)
        if x is not True and x is not False)
    return frag


def bilan_fragment(sortie_q2: dict, v: dict, serie=None,
                   bases=None, re_tests=None, choix=None,
                   rive_a: dict = None, rive_b: dict = None) -> dict:
    """Wrapper commun (identité avec bilan_fragment_pas — COR1)."""
    return bilan_fragment_pas(sortie_q2, v, serie, bases, re_tests,
                              choix, rive_a, rive_b)


def _valeurs_feuilles(obj):
    """Feuilles d'un dict/liste imbriqué (agrégat des valeurs terminales)."""
    if isinstance(obj, dict):
        for v in obj.values():
            yield from _valeurs_feuilles(v)
    elif isinstance(obj, (list, tuple)):
        for v in obj:
            yield from _valeurs_feuilles(v)
    else:
        yield obj


def textes_ecran(sortie_q2: dict, v: dict, serie=None, choix=None,
                 bases=None, re_tests=None) -> list[str]:
    """Tous les textes affichés d'un pas (COR4 — vocabulaire)."""
    bloc = bloc_ecran_pas(sortie_q2, v, serie, choix, bases, re_tests)
    frag = bilan_fragment_pas(sortie_q2, v, serie, bases=bases,
                              re_tests=re_tests, choix=choix)
    return _textes(bloc) + _textes(frag)


def _textes(obj) -> list[str]:
    if isinstance(obj, str):
        return [obj]
    if isinstance(obj, dict):
        out = []
        for v in obj.values():
            out.extend(_textes(v))
        return out
    if isinstance(obj, (list, tuple)):
        out = []
        for v in obj:
            out.extend(_textes(v))
        return out
    return []
