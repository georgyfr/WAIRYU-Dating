# -*- coding: utf-8 -*-
"""
WTC-EXT-Q2 — COUCHE DE CORRECTION PHILOSOPHIQUE (fichier SUPPLÉMENTAIRE)
========================================================================
RIO-17 « Notre conversation de l'horizon » (croisement) — rattrapage au
gabarit universel §5.1-§5.4 du canon (demande fondateur « lance RIO-16→18 »,
même ordre que RIO-01→16 : fichiers SUPPLÉMENTAIRES, zéro modification de
l'existant, exactitude des calculs).

RÈGLE ABSOLUE : ce module NE MODIFIE AUCUN moteur existant.
- Le vrai cœur de la quête reste `validation-ext/validation-ext-q2/src/
  wtc_ext_q2_core.py` (croisement des sorties RIO-16 contresignées des
  deux rives — 9 configurations nommées, miroirs 2/4 · 3/7 · 6/8, palier
  croisé max-niveau, override D-CRISE AVANT le verdict, entrée RQS ligne
  257, percentiles L6 avertissement, 3 inférences L5 à libellés
  VERROUILLÉS, D-STD-2 calibrée — VALIDÉ 7/7 et CONTRESIGNÉ) — importé
  tel quel, jamais recopié.
- Les junctions pas utilisent le VRAI moteur aval `validation-ext-q3`
  (le pas « Le pas de l'horizon » — RIO-18 : famille_de, BANQUE_PAS_EXT,
  pas_zero_legitime, statut_engagement_de).
- Cette couche ajoute ce que l'audit (Task 163) a trouvé manquant sur
  RIO-17 : F3 (18/25) — le contenu CONCRET des 3 paliers croisés (les
  exercices/modules produits par configuration réelle, pas seulement la
  lecture) ; F4 (22/25) — le fragment de bilan L8 niveau COUPLE (7 blocs
  canon : position · forme · empreinte · couple · force · limites ·
  palier/pas), complet y compris hors-verdict (override D-CRISE, non-
  entrée RQS). La mesure graduée F1 (25/25) et le gabarit complet F2
  (25/25 — 9 templates + QUAND DEMANDER + avertissements L6 déjà
  validés C5-C7) sont PRÉSERVÉS tels quels : la config et le palier
  restent ceux du cœur, les asserts de junction les vérifient À CHAQUE
  appel.

Chaque règle ci-dessous est PRÉ-ENREGISTRÉE (écrite avant tout calcul) et
dérivée MÉCANIQUEMENT des sorties du vrai cœur — zéro invention de mesure.

Règles pré-enregistrées :
- R1 (config + palier croisés, 0 seuil ajouté) : la configuration affichée
  est le VRAI `config_de` (9 noms uniques, miroirs 2/4 · 3/7 · 6/8), le
  palier de couple le VRAI `palier_croise` (max-niveau : 🟢 ⇔ (FAIBLE,
  FAIBLE) = config 1 · 🟠 ⇔ max MODÉRÉE · 🔴 ⇔ max FORTE). La couche ne
  recalcule JAMAIS : les asserts de junction vérifient à chaque appel.
  Les seules frontières restent les VRAIES bornes 2,50 / 3,50 — PILE
  ATTEIGNABLES sur le grain 1/6 des scores H (15/6 = 2,50 · 21/6 = 3,50),
  tranchage inclusif du VRAI moteur consigné et testé.
- R2 (override D-CRISE, court-circuit) : une seule rive en signal
  sécurité suffit — le VRAI `classifier_croisement` court-circuite AVANT
  le verdict de couple : verdict=None, bandeau MOT POUR MOT, la
  configuration reste CALCULÉE et TRACÉE, JAMAIS déployée. Afficher un
  verdict de couple serait fabriquer. JAMAIS de pas de couple sur crise.
- R3 (entrées RQS — ligne 257) : RQS INVALIDE chez UNE rive = la rive
  n'entre pas au croisement — aucun résultat de couple (bandeau VRAI).
  Les lectures affichées sont les VRAIS templates du cœur (config_1 à
  config_9, mot pour mot) ; les avertissements sont les VRAIS L6
  (boucle ≥ 30 · styles ≥ 1,00 · asymétries marquées/légères) — des
  AVERTISSEMENTS, jamais des verdicts, jamais un reproche.
- R4 (honnêteté des bornes) : les scores H consommés sont sur le grain
  1/6 — les bornes 2,50/3,50 sont PILE atteignables et le tranchage
  inclusif du VRAI moteur décide (2,50 → MODÉRÉE · 3,50 → FORTE — testé
  sur les cas de table D-VÉRITÉ du cœur). Aucune borne ajoutée.
- R5 (anti-fabrication temporelle — C6) : 0 verdict sur le temps restant,
  0 modèle de la bonne saison — « devance » = niveau DÉCLARÉ plus fort,
  jamais une position dans le temps (le VRAI template config_6 le dit) ;
  la zone calme n'est dite que sur la config 1 (LA MÊME HEURE — VRAI
  template + VRAI zone_calme) ; les re-tests ne sont PAS consommés au
  croisement (une mesure un rôle — SPEC §7, VRAI template).
- R6 (vocabulaire écran, canon Partie 9, lignes 355-356) : aucun mot de
  la liste interdite (clinique ET injonctions temporelles) dans tout
  texte affiché. EXCEPTION SOURCÉE consignée : le filet « 3919 / 3114 —
  P-FILTRE » et le bandeau d'override sont les literals du VRAI cœur —
  cités tels quels, jamais réécrits. Doctrine couple : la boucle est
  nommée ENSEMBLE, la direction JAMAIS affichée, JAMAIS de pourcentage
  de compatibilité (0 % compatibilité = consignation, pas une mesure).
- R7 (D-SIM) : bandeau simulation sur chaque bloc écran (le VRAI D_SIM
  du cœur, mot pour mot).
- R8 (couplage pas réel — une mesure un rôle) : la suite du parcours est
  celle du VRAI moteur aval Q3 : famille_de(palier croisé HÉRITÉ — le
  palier n'est JAMAIS recalculé en Q3, leçon A1-SM-Q4) + BANQUE_PAS_EXT
  servie verbatim ; le pas zéro n'est légitime que sur la config 1 (VRAI
  pas_zero_legitime) ; le suivi 14 j est sans sanction (VRAI
  statut_engagement_de, 15 totaux vérifiés).
- R9 (percentiles L6 — placeholder honnête) : les percentiles mid-rank
  sont calculés par le VRAI `percentile_de` dans la population de
  référence déposée (2 000, seed 42 — placeholder L2, à remplacer par le
  pilote) ; l'écart ≥ 30 déclenche le VRAI avertissement « boucle
  probable », qui ne change AUCUN résultat (junction testée : même
  config, même palier, mêmes inférences avec et sans population).
"""

from __future__ import annotations

import importlib.util
import sys
from pathlib import Path

# ─────────────────────────────────────────────────────────────────────────────
# CHARGEMENT DES VRAIS MOTEURS (jamais recopiés, jamais modifiés)
# ─────────────────────────────────────────────────────────────────────────────
_PKG = Path(__file__).resolve().parents[1]           # …/validation-ext-q2/correction-philosophique
_Q2 = _PKG.parent                                    # …/validation-ext-q2
_EXT = _Q2.parent                                    # …/validation-ext


def _charge(nom: str, chemin: Path):
    spec = importlib.util.spec_from_file_location(nom, chemin)
    mod = importlib.util.module_from_spec(spec)
    sys.modules[nom] = mod
    spec.loader.exec_module(mod)
    return mod


core_q2 = _charge("wtc_ext_q2_core", _Q2 / "src" / "wtc_ext_q2_core.py")
core_q3 = _charge("wtc_ext_q3_core", _EXT / "validation-ext-q3" / "src" / "wtc_ext_q3_core.py")

# Vérification d'intégrité des moteurs chargés (ce sont bien les vrais) :
assert len(core_q2.NIVEAUX_CROISEMENT) == 3
assert core_q2.BORNES_CROISEMENT == (2.50, 3.50)
assert len(core_q2.CONFIGS) == 9 and len(core_q2.MIROIR) == 9
assert len({c["nom"] for c in core_q2.CONFIGS.values()}) == 9
assert core_q2.SEUIL_BOUCLE_PCT == 30.0 and core_q2.SEUIL_STYLES == 1.00
assert core_q2.SEUIL_ASYM == 1.00 and core_q2.SEUIL_INF_TAXE == 2.60
assert len(core_q2.TEMPLATES) >= 20 and core_q2.POP_N == 2000
assert len(core_q2.POPULATION) == core_q2.POP_N
assert core_q3.N_JOURS == 14 and core_q3.SEUIL_CELEBRE == 9
assert len(core_q3.BANQUE_PAS_EXT[core_q3.FAMILLE_VERT]) == 3
assert len(core_q3.BANQUE_PAS_EXT[core_q3.FAMILLE_ORANGE]) == 2
assert len(core_q3.BANQUE_PAS_EXT[core_q3.FAMILLE_ROUGE]) == 1
assert core_q3.pas_zero_legitime(True) and not core_q3.pas_zero_legitime(False)

# ─────────────────────────────────────────────────────────────────────────────
# CONSTANTES DE LA COUCHE (R1-R9)
# ─────────────────────────────────────────────────────────────────────────────
PALIER_EMOJI = {core_q2.PALIER_VERT: "🟢", core_q2.PALIER_ORANGE: "🟠",
                core_q2.PALIER_ROUGE: "🔴"}
PALIER_NOM = {core_q2.PALIER_VERT: "Exercice maison",
              core_q2.PALIER_ORANGE: "Module de couple",
              core_q2.PALIER_ROUGE: "Orientation professionnelle"}

# Textes affichés lus dans le VRAI cœur (jamais réécrits, R3/R5/R6/R7) :
D_SIM = core_q2.D_SIM
CLAUSE_AIDE = core_q2.TEMPLATES["aide_seuils"]
RE_TEST_NON_CONSOMME = core_q2.TEMPLATES["re_test_non_consomme"]
TEMPLATE_OVERRIDE = core_q2.TEMPLATES["override"]
TEMPLATE_NON_ENTREE = core_q2.TEMPLATES["non_entree"]
TEMPLATE_ZONE_CALME = core_q2.TEMPLATES["config_1"]
TEMPLATE_PALIER = {core_q2.PALIER_VERT: core_q2.TEMPLATES["palier_vert"],
                   core_q2.PALIER_ORANGE: core_q2.TEMPLATES["palier_orange"],
                   core_q2.PALIER_ROUGE: core_q2.TEMPLATES["palier_rouge"]}
TEMPLATES_INF = {core_q2.INF_TAXE: core_q2.TEMPLATES["inf_taxe"],
                 core_q2.INF_SUJET: core_q2.TEMPLATES["inf_sujet"],
                 core_q2.INF_SILENCE: core_q2.TEMPLATES["inf_silence"]}
DOCTRINE_COMPARATIF = ("0 % compatibilité — le croisement lit deux lectures "
                       "déclarées, jamais un score comparé")

# Le literal filet du VRAI cœur Q1 (ressource d'urgence, exception sourcée) :
FILET_LITERAL = "3919 / 3114 — P-FILTRE"

# Vocabulaire interdit — canon Partie 9 (clinique) + C6 Générationnelle
# (injonctions temporelles, arbitrage A5) — R5/R6 :
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
)

# Les VRAIS pas de la banque Q3 (junction R8, servis verbatim) :
PAS_VERT_REELS = core_q3.BANQUE_PAS_EXT[core_q3.FAMILLE_VERT]
PAS_ORANGE_REELS = core_q3.BANQUE_PAS_EXT[core_q3.FAMILLE_ORANGE]
PAS_ROUGE_REEL = core_q3.BANQUE_PAS_EXT[core_q3.FAMILLE_ROUGE][0]


# ─────────────────────────────────────────────────────────────────────────────
# R1 — JUNCTION : config + palier croisés (assert à chaque appel)
# ─────────────────────────────────────────────────────────────────────────────
def _assert_junction(sa: dict, sb: dict, cr: dict) -> None:
    """R1/R2 — la sortie consommée est bien celle du VRAI cœur : config,
    palier, override/entrée et inférences recalculés par les VRAIS moteurs
    et comparés (recalcul de la couche interdit — ici, vérification seule)."""
    n1 = core_q2.niveau_croisement(sa["score_H"])
    n2 = core_q2.niveau_croisement(sb["score_H"])
    num = core_q2.config_de(n1, n2)
    assert cr["config_num"] == num and cr["niveaux"] == {"rive1": n1, "rive2": n2}
    filet = bool(sa["filet"] or sb["filet"])
    invalide = sa["rqs_statut"] == "INVALIDE" or sb["rqs_statut"] == "INVALIDE"
    if filet:
        assert cr["override"] and not cr["entree"] and cr["verdict"] is None
        assert cr["palier"] == core_q2.PALIER_ROUGE
        return
    if invalide:
        assert not cr["override"] and not cr["entree"] and cr["palier"] is None
        return
    assert cr["entree"] and not cr["override"]
    palier_vrai = core_q2.palier_croise(n1, n2, False)
    assert cr["palier"] == palier_vrai, "junction palier croisé : le VRAI palier_croise ne correspond pas"
    assert cr["verdict"]["palier"] == palier_vrai
    # zone calme ⇔ config 1 exactement (VRAI) :
    assert cr["verdict"]["zone_calme"] == (num == 1)
    # inférences ≡ VRAI inferences_L5 :
    inf_vraie = core_q2.inferences_L5(sa, sb, n1, n2)
    assert cr["inferences_L5"] == inf_vraie


def _rive_hors_jeu(sa: dict, sb: dict, cr: dict) -> str | None:
    """Le chemin sans verdict (R2/R3) : 'override' (crise) ou 'non_entree'
    (RQS INVALIDE) — None si le croisement complet est déployé."""
    if cr["override"]:
        return "override"
    if not cr["entree"]:
        return "non_entree"
    return None


# ─────────────────────────────────────────────────────────────────────────────
# R5/R8 — F3 : LE CONTENU CONCRET DES 3 PALIERS CROISÉS (par configuration)
# ─────────────────────────────────────────────────────────────────────────────
def contenu_palier_croise(num: int, palier: str) -> dict:
    """F3 — le contenu CONCRET du palier croisé VRAI pour la configuration
    num (1-9) : les solutions produites, pas seulement désignées (l'écart
    F3 de l'audit). 🟠/🔴 s'appuient sur les VRAIS pas de la banque Q3
    (verbatim, junction R8) ; 🟢 = la zone calme dite comme telle (config 1
    uniquement — invariant prouvé : VERT ⇔ (FAIBLE, FAIBLE) ⇔ config 1)."""
    cfg = core_q2.CONFIGS[num]
    if palier == core_q2.PALIER_VERT:
        # config 1 (LA MÊME HEURE) — zone calme, rien à fabriquer :
        assert num == 1, "palier VERT sur une config non-1 — invariant violé"
        return {"zone_calme": True,
                "lecture": core_q2.CONFIGS[1]["lecture"],
                "exercice": (
                    "🟢 Zone calme — rien à fabriquer ici. Si vous voulez, un "
                    "tour des deux horloges, chacun sa note, une fois quand "
                    "vous voulez : les forces et le pas se mesurent plus loin "
                    "dans le parcours (RIO-18)."),
                "pas_zero_legitime": core_q3.pas_zero_legitime(num == 1),
                "suite_du_parcours": RE_TEST_NON_CONSOMME,
                "rien_a_fabriquer": True}
    if palier == core_q2.PALIER_ORANGE:
        # configs 2 (F,M) · 4 (M,F) · 5 (M,M) — module à deux :
        clause = {
            2: ("l'horloge active est côté rive 1 — le temps à deux part de "
                "ce qu'elle porte, l'autre rive écoute sans obligation"),
            4: ("l'horloge active est côté rive 2 — miroir de la config 2 : "
                "le temps à deux part de ce que la rive 2 porte"),
            5: ("les deux horloges tournent — le terrain naturel de la "
                "conversation de l'horizon, un seul sujet par séance"),
        }[num]
        return {"zone_calme": False,
                "module": (f"🟠 À deux : {PAS_ORANGE_REELS[0]} — {clause} "
                           "(ligne 366 : chaque rive valide ou conteste)."),
                "pas_reels_servis": list(PAS_ORANGE_REELS),
                "pas_zero_legitime": core_q3.pas_zero_legitime(num == 1),
                "re_test": RE_TEST_NON_CONSOMME,
                "rien_a_fabriquer": False}
    # 🔴 ORIENTATION — configs 3, 6, 7, 8, 9 (max FORTE) — le pas EST la
    # démarche d'orientation (VRAI pas rouge de la banque) :
    return {"zone_calme": False,
            "orientation": f"🔴 À deux : {PAS_ROUGE_REEL}.",
            "filet": (f"tout signal de sécurité chez l'une des rives → "
                      f"court-circuit P-FILTRE — {FILET_LITERAL}"),
            "pas_reel_serve": PAS_ROUGE_REEL,
            "pas_zero_legitime": core_q3.pas_zero_legitime(num == 1),
            "re_test": RE_TEST_NON_CONSOMME,
            "rien_a_fabriquer": False}


# ─────────────────────────────────────────────────────────────────────────────
# F2/F3 — BLOC ÉCRAN COUPLE (toutes les clauses dérivées des VRAIES sorties)
# ─────────────────────────────────────────────────────────────────────────────
def bloc_ecran_couple(sa: dict, sb: dict, cr: dict) -> dict:
    """F2/F3 — assemble le bloc écran complet RIO-17 (config + palier =
    VRAIS — asserts de junction ; bandeau D-SIM du VRAI cœur — R7)."""
    _assert_junction(sa, sb, cr)
    hors_jeu = _rive_hors_jeu(sa, sb, cr)
    bloc = {"bandeau_dsim": D_SIM}
    if hors_jeu == "override":
        # R2 — court-circuit MOT POUR MOT, config TRACÉE jamais déployée :
        bloc.update({
            "display": cr["display"],
            "bandeau_court_circuit": cr["bandeau"],
            "config_tracee": {"num": cr["config_num"], "nom": cr["config_nom"],
                              "lecture": cr["config_lecture"],
                              "deploiement": ("calculée et tracée, JAMAIS "
                                              "déployée sur une crise active")},
            "seuils_aide": CLAUSE_AIDE,
            "pas_croise": ("aucun pas de couple sur un signal sécurité — "
                           "l'orientation EST la démarche : " + PAS_ROUGE_REEL),
        })
        return bloc
    if hors_jeu == "non_entree":
        # R3 — ligne 257 : aucun résultat de couple :
        bloc.update({
            "display": cr["display"],
            "bandeau_non_entree": cr["bandeau"],
            "rqs_rive1": sa.get("rqs"), "rqs_rive2": sb.get("rqs"),
            "config_tracee": {"num": cr["config_num"], "nom": cr["config_nom"],
                              "lecture": cr["config_lecture"],
                              "deploiement": ("calculée et tracée — la rive "
                                              "n'entre pas (ligne 257)")},
            "seuils_aide": CLAUSE_AIDE,
        })
        return bloc
    palier = cr["palier"]
    num = cr["config_num"]
    bloc.update({
        "display": cr["display"],
        "config": {"num": num, "nom": cr["config_nom"],
                   "lecture": cr["config_lecture"],
                   "niveaux": cr["niveaux"],
                   "scores_H": cr["scores_H"]},
        "palier": palier, "palier_nom": PALIER_NOM[palier],
        "emoji": PALIER_EMOJI[palier],
        "template_palier": TEMPLATE_PALIER[palier],
        "contenu_palier": contenu_palier_croise(num, palier),
        "seuils_aide": CLAUSE_AIDE,
        "avertissements": {
            "boucle_probable": (core_q2.TEMPLATES["boucle"]
                                if cr["boucle_probable"] else None),
            "styles_dissemblables": (core_q2.TEMPLATES["styles"]
                                     if cr["styles_dissemblables"] else None),
            "asym_L": (core_q2.TEMPLATES["asym_marquee"].format(
                axe="L", ecart=cr["asym_L"]["ecart"])
                if cr["asym_L"]["lecture"] == "ASYMÉTRIE MARQUÉE"
                else core_q2.TEMPLATES["asym_legere"].format(
                    axe="L", ecart=cr["asym_L"]["ecart"])),
            "asym_C": (core_q2.TEMPLATES["asym_marquee"].format(
                axe="C", ecart=cr["asym_C"]["ecart"])
                if cr["asym_C"]["lecture"] == "ASYMÉTRIE MARQUÉE"
                else core_q2.TEMPLATES["asym_legere"].format(
                    axe="C", ecart=cr["asym_C"]["ecart"])),
        },
        "empreinte_L5": {k: (TEMPLATES_INF[k] if v else None)
                         for k, v in cr["inferences_L5"].items()},
        "force": cr["force"],
        "percentiles": cr["percentiles"],
        "verdict_comparatif": DOCTRINE_COMPARATIF,
    })
    # nettoyer les avertissements/empreintes absents (None → clé retirée) :
    bloc["avertissements"] = {k: v for k, v in bloc["avertissements"].items()
                              if v is not None}
    bloc["empreinte_L5"] = {k: v for k, v in bloc["empreinte_L5"].items()
                            if v is not None}
    return bloc


# ─────────────────────────────────────────────────────────────────────────────
# F4 — FRAGMENT DE BILAN L8 NIVEAU COUPLE (7 blocs canon, complet hors-verdict)
# ─────────────────────────────────────────────────────────────────────────────
def _fragment_hors_verdict(sa: dict, sb: dict, cr: dict, chemin: str) -> dict:
    """F4 — fragment complet des chemins sans verdict (override D-CRISE,
    non-entrée RQS) : les 7 blocs restent remplis — aucun bloc vide (COR1)."""
    if chemin == "override":
        cause = ("court-circuit D-CRISE — le croisement n'est JAMAIS déployé "
                 "sur une crise active (configuration calculée et tracée)")
        pas_note = ("aucun pas de couple sur un signal sécurité — "
                    "l'orientation EST la démarche : " + PAS_ROUGE_REEL)
    else:
        cause = ("RQS < 70 chez une rive — la rive n'entre pas au croisement "
                 "(ligne 257) ; aucun résultat de couple")
        pas_note = "aucun pas servi — aucun résultat de couple affiché"
    out = {
        "bloc_1_position": {
            "niveaux": {"rive1": cr["niveaux"]["rive1"],
                        "rive2": cr["niveaux"]["rive2"]},
            "scores_H": cr["scores_H"],
            "config": {"num": cr["config_num"], "nom": cr["config_nom"],
                       "lecture": cr["config_lecture"]},
            "deploiement": cause,
            "dans_bande_dsim": True,
        },
        "bloc_2_forme": {
            "note": ("aucune lecture de forme sur un chemin sans verdict — "
                     "afficher serait fabriquer"),
            "rqs_rive1": sa.get("rqs"), "statut_rive1": sa["rqs_statut"],
            "rqs_rive2": sb.get("rqs"), "statut_rive2": sb["rqs_statut"],
        },
        "bloc_3_empreinte": {
            "source": "les inférences L5 se calculent au croisement COMPLET",
            "note": ("jamais calculées sur un chemin sans verdict — les "
                     "3 libellés verrouillés apparaissent au déploiement"),
            "libelles_verrouilles": [core_q2.INF_TAXE, core_q2.INF_SUJET,
                                     core_q2.INF_SILENCE],
        },
        "bloc_4_couple": {
            "override_d_crise": (TEMPLATE_OVERRIDE if chemin == "override"
                                 else "non concerné — aucun signal de crise"),
            "entree_rqs": (TEMPLATE_NON_ENTREE if chemin == "non_entree"
                           else "non concerné — les deux rives entrent"),
            "verdict_comparatif": DOCTRINE_COMPARATIF,
        },
        "bloc_5_force": {
            "source": "la permission à deux (faces L2), tirée des vraies réponses",
            "note": ("aucune force lue — aucun verdict de couple déployé"),
        },
        "bloc_6_limites": {
            "note": cause,
            "bandeau_dsim": D_SIM,
        },
        "bloc_7_palier_pas": {
            "palier": (core_q2.PALIER_ROUGE if chemin == "override"
                       else "aucun — aucun résultat de couple affiché"),
            "pas_possibles": pas_note,
            "pas_zero_legitime": "non concerné — aucun verdict déployé",
            "suivi_14_jours_sans_sanction": True,
            "suite_du_parcours": ("re-test RIO-16 des rives à 8 semaines — "
                                  "le croisement se relit après"),
        },
    }
    out["_complet"] = all(
        v not in (None, "", [], {}) for v in _valeurs_feuilles(out)
        if v is not True and v is not False)
    return out


def bilan_fragment_couple(sa: dict, sb: dict, cr: dict) -> dict:
    """Contribution de RIO-17 au bilan d'ensemble (assemblage L8 du canon,
    ligne 265) — niveau COUPLE. Les blocs pas pointent le VRAI moteur Q3
    (famille héritée du palier croisé + banque verbatim + suivi)."""
    _assert_junction(sa, sb, cr)
    hors_jeu = _rive_hors_jeu(sa, sb, cr)
    if hors_jeu:
        return _fragment_hors_verdict(sa, sb, cr, hors_jeu)
    num = cr["config_num"]
    palier = cr["palier"]
    inf_actives = [k for k, v in cr["inferences_L5"].items() if v]
    return {
        "bloc_1_position": {
            "niveaux": {"rive1": cr["niveaux"]["rive1"],
                        "rive2": cr["niveaux"]["rive2"]},
            "scores_H": cr["scores_H"],
            "config": {"num": num, "nom": cr["config_nom"],
                       "lecture": cr["config_lecture"]},
            "percentiles": cr["percentiles"],
            "ecart_pct": cr["ecart_pct"],
            "population_note": ("placeholder L2 (2 000, seed 42) — à "
                                "remplacer par le pilote, comme consigné"),
            "dans_bande_dsim": True,
        },
        "bloc_2_forme": {
            "asym_L": cr["asym_L"], "asym_C": cr["asym_C"],
            "ecart_styles": cr["ecart_styles"],
            "note": ("les asymétries et les écarts de styles sont des "
                     "AVERTISSEMENTS L6 — jamais des verdicts, jamais un "
                     "reproche"),
        },
        "bloc_3_empreinte": {
            "inferences_L5": cr["inferences_L5"],
            "inferences_actives": inf_actives or ["aucune — les 3 seuils ne "
                                                  "sont pas atteints"],
            "templates": ({k: TEMPLATES_INF[k] for k in inf_actives}
                          if inf_actives
                          else ["aucun template — aucune inférence active"]),
            "libelles_verrouilles": [core_q2.INF_TAXE, core_q2.INF_SUJET,
                                     core_q2.INF_SILENCE],
        },
        "bloc_4_couple": {
            "palier": palier, "palier_nom": PALIER_NOM[palier],
            "zone_calme": cr["verdict"]["zone_calme"],
            "override_d_crise": "non concerné — aucun signal de crise",
            "boucle_probable": cr["boucle_probable"],
            "styles_dissemblables": cr["styles_dissemblables"],
            "verdict_comparatif": DOCTRINE_COMPARATIF,
            "doctrine": ("boucle nommée ENSEMBLE — la direction n'est JAMAIS "
                         "affichée ; jamais de pourcentage de compatibilité"),
        },
        "bloc_5_force": {
            "source": "la permission à deux (faces L2), tirée des vraies réponses",
            "force": cr["force"] or ("aucune force seuillée — la permission "
                                     "à deux reste disponible dans le parcours"),
            "seuil": core_q2.SEUIL_INF_TAXE,
        },
        "bloc_6_limites": {
            "rqs_rive1": sa.get("rqs"), "statut_rive1": sa["rqs_statut"],
            "rqs_rive2": sb.get("rqs"), "statut_rive2": sb["rqs_statut"],
            "note": ("les deux rives entrent avec une qualité suffisante "
                     "(ligne 257)"),
            "bandeau_dsim": D_SIM,
        },
        "bloc_7_palier_pas": {
            "palier": palier,
            "contenu_palier": contenu_palier_croise(num, palier),
            "famille_pas": core_q3.famille_de(palier),
            "banque_pas_reelle": list(
                core_q3.BANQUE_PAS_EXT[core_q3.famille_de(palier)]),
            "pas_zero_legitime": core_q3.pas_zero_legitime(num == 1),
            "suivi_14_jours_sans_sanction": True,
            "re_tests_non_consommes": RE_TEST_NON_CONSOMME,
            "suite_du_parcours": ("le pas se choisit en RIO-18 (famille "
                                  "héritée du palier croisé — jamais recalculée)"),
        },
    }
    # (l'_complet du fragment entrée est ajouté par le wrapper commun)


def bilan_fragment(sa: dict, sb: dict, cr: dict) -> dict:
    """Wrapper commun : complet sur les 3 chemins (COR1)."""
    frag = bilan_fragment_couple(sa, sb, cr)
    if "_complet" not in frag:
        frag["_complet"] = all(
            v not in (None, "", [], {}) for v in _valeurs_feuilles(frag)
            if v is not True and v is not False)
    return frag


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


def textes_ecran(sa: dict, sb: dict, cr: dict) -> list[str]:
    """Tous les textes affichés d'un croisement (COR4 — vocabulaire)."""
    bloc = bloc_ecran_couple(sa, sb, cr)
    frag = bilan_fragment(sa, sb, cr)
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
