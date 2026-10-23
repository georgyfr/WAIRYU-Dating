# -*- coding: utf-8 -*-
"""
WTC-EXT-Q1 — COUCHE DE CORRECTION PHILOSOPHIQUE (fichier SUPPLÉMENTAIRE)
========================================================================
RIO-16 « L'écart de nos horloges » (carte) — rattrapage au gabarit
universel §5.1-§5.4 du canon (demande fondateur, même ordre que
RIO-01/02/03/04/06/07/08/09/10/11/12/13/14/15 : fichiers SUPPLÉMENTAIRES,
zéro modification de l'existant, exactitude des calculs).

RÈGLE ABSOLUE : ce module NE MODIFIE AUCUN moteur existant.
- Le vrai cœur de la quête reste `validation-ext/validation-ext-q1/src/
  wtc_ext_q1_core.py` (18 items — 3 axes H/L/C × 2 faces × 3 items —
  échelle 1-4, 2 inversés, 1 vigilance ; L1-L4 + L7 ; palier max-niveau ;
  D-STD-2 calibrée ; VALIDÉ et CONTRESIGNÉ) — importé tel quel, jamais
  recopié.
- Les junctions utilisent les VRAIS moteurs aval `validation-ext-q2`
  (le croisement « Notre conversation de l'horizon » — RIO-17 :
  niveau_croisement, config_de, palier_croise, CONFIGS, INF_*) et
  `validation-ext-q3` (le pas « Le pas de l'horizon » — RIO-18 :
  famille_de, pas_de, BANQUE_PAS_EXT, pas_zero_legitime,
  statut_engagement_de).
- Cette couche ajoute ce que l'audit (Task 163) a trouvé manquant sur
  RIO-16 : F3 (15/25) — le contenu CONCRET des 3 paliers (les exercices
  maison produits, pas seulement désignés) ; F4 (10/25) — le fragment de
  bilan L8 (7 blocs canon : position · forme · empreinte · couple ·
  force · limites · palier/pas). La lecture graduée F1 (25/25) et le
  palier F2 (25/25 — palier max-niveau + QUAND DEMANDER déjà validés C5)
  sont PRÉSERVÉS tels quels : le palier reste celui du cœur, l'assert
  de junction le vérifie À CHAQUE appel.

Chaque règle ci-dessous est PRÉ-ENREGISTRÉE (écrite avant tout calcul) et
dérivée MÉCANIQUEMENT des sorties du vrai cœur — zéro invention de mesure.

Règles pré-enregistrées :
- R1 (palier max-niveau, 0 seuil ajouté) : le palier affiché est le VRAI
  `palier_de` sorti par le VRAI `classifier_rive` — max des niveaux
  conservateurs des 3 axes (décision conservatrice L3 du cœur) ; signal
  sécurité → 🔴 ORIENTATION, carte non affichée. La couche ne recalcule
  JAMAIS le palier : l'assert de junction le vérifie à chaque appel.
  Aucun seuil numérique n'est ajouté : les VRAIS seuils L3 du cœur
  (1,80 / 2,60 / 3,20) restent les seules frontières.
- R2 (filet primordial, court-circuit) : en filet, l'écran n'affiche QUE
  le court-circuit du VRAI moteur (bandeau D-CRISE + P-FILTRE — le
  literal RÉEL « 3919 / 3114 — P-FILTRE » de `signal_filet_de`) — le
  VRAI classifier_rive retourne carte=None : afficher la carte serait
  une fabrication. JAMAIS de pas de couple sur un signal sécurité.
- R3 (lecture graduée, sans étiquette) : les niveaux affichés sont les
  VRAIS `lecture_L3` (NIVEAU, ou FRONTIÈRE « entre X et Y » + décision
  conservatrice = niveau le plus bas touché) ; les faces sont les VRAIS
  `lecture_L4` (HIÉRARCHIE DÉCLARABLE ou NUAGE — anti-surinterprétation
  L4 du canon, ligne 260) ; les noms écran sont les VRAI `FACES[f]["nom"]`
  lus au chargement — jamais réécrits. Descriptif causal — aucun nom de
  pathologie.
- R4 (frontière honnête) : la FRONTIÈRE est affichée comme telle (« entre
  X et Y » + conservateur). BORNES RÉELLES CONSIGNÉES (mesurées, COR0) :
  1,80 / 2,60 / 3,20 sont PILE inatteignables sur le grain 1/6 des axes
  (moyenne de 6 items entiers) — distances minimales 1/30 ≈ 0,0333
  (seuils 1,80 et 3,20) et 1/15 ≈ 0,0667 (seuil 2,60) ; les bornes de
  l'intervalle CI90 (arrondies à 2 décimales) ne touchent jamais un
  seuil PILE non plus (34 bornes distinctes, 0 touche — mesuré). Le
  seuil de hiérarchie L4 (0,8837) est PILE inatteignable sur le grain
  1/3 des faces (écarts arrondis ∈ {0 ; 0,33 ; 0,34 ; 0,66 ; 0,67 ;
  1,00 ; …} — distance minimale 0,1163, mesurée). Le tranchage
  inclusif du VRAI moteur reste écrit tel quel dans la règle.
- R5 (anti-fabrication temporelle — C6, arbitrage A5 de la SPEC
  verrouillée) : 0 verdict sur le temps restant · 0 modèle de la bonne
  saison · jamais « trop tard », jamais de compte à rebours, jamais
  d'injonction temporelle — la sélectivité socio-émotionnelle
  (Carstensen) lit une priorisation DÉCLARÉE, pas une ressource à
  optimiser. « Rien à fabriquer » n'est affiché que si le VRAI palier
  est EXERCICE MAISON (zone calme dite comme telle, §5.5). L'item de
  vigilance (EXT-VIG) ne touche que le RQS du VRAI cœur — il est TRACÉ
  et jamais affiché comme lecture.
- R6 (vocabulaire écran, canon Partie 9, lignes 355-356) : aucun mot de
  la liste interdite (vocabulaire clinique ET injonctions temporelles
  C6) dans tout texte affiché. EXCEPTION SOURCÉE consignée : le filet
  « 3919 / 3114 — P-FILTRE » est le literal du VRAI moteur (ressource
  d'urgence, court-circuit P-FILTRE validé P1 à l'audit) — cité tel
  quel, jamais réécrit.
- R7 (D-SIM) : bandeau simulation sur chaque bloc écran.
- R8 (couplage pas réel — une mesure un rôle) : la suite du parcours
  annoncée est celle des VRAIS moteurs aval. Croisement Q2 : le
  `niveau_croisement` du score H MESURÉ ici (VRAI `niveau_croisement`),
  l'autre rive BALAYÉE (FAIBLE/MODÉRÉE/FORTE — mesurée par RIO-17,
  jamais devinée) → VRAI `config_de` → VRAI `palier_croise`. Pas Q3 :
  VRAI `famille_de` + VRAI `BANQUE_PAS_EXT` (servis verbatim, jamais
  réécrits) ; le pas zéro n'est légitime que sur zone calme config 1
  (VRAI `pas_zero_legitime`) ; le suivi 14 j est sans sanction (VRAI
  `statut_engagement_de`, 15 totaux vérifiés). 🔴 → le pas EST la
  démarche d'orientation (VRAI pas rouge de la banque).
- R9 (re-test 8 semaines) : le re-test est PROGRAMMÉ à 8 semaines
  (arithmétique de dates, +56 jours ISO — même sémantique que le vrai
  programmer_re_test émotionnel ; consigné : arithmétique, pas une
  mesure). Les re-tests ne sont PAS consommés en Q1 (une mesure un
  rôle — SPEC Q2 §7).
"""

from __future__ import annotations

import importlib.util
import sys
from datetime import date, timedelta
from pathlib import Path

# ─────────────────────────────────────────────────────────────────────────────
# CHARGEMENT DES VRAIS MOTEURS (jamais recopiés, jamais modifiés)
# ─────────────────────────────────────────────────────────────────────────────
_PKG = Path(__file__).resolve().parents[1]           # …/validation-ext-q1/correction-philosophique
_Q1 = _PKG.parent                                    # …/validation-ext-q1
_EXT = _Q1.parent                                    # …/validation-ext
_WTC = _EXT.parent                                   # …/Wairyu thérapie couple


def _charge(nom: str, chemin: Path):
    spec = importlib.util.spec_from_file_location(nom, chemin)
    mod = importlib.util.module_from_spec(spec)
    sys.modules[nom] = mod
    spec.loader.exec_module(mod)
    return mod


# Le core ext-q1 DOIT porter son nom canonique dans sys.modules (les
# fichiers de validation du package font `import wtc_ext_q1_core`).
core_q1 = _charge("wtc_ext_q1_core", _Q1 / "src" / "wtc_ext_q1_core.py")
core_q2 = _charge("wtc_ext_q2_core", _EXT / "validation-ext-q2" / "src" / "wtc_ext_q2_core.py")
core_q3 = _charge("wtc_ext_q3_core", _EXT / "validation-ext-q3" / "src" / "wtc_ext_q3_core.py")

# Vérification d'intégrité des moteurs chargés (ce sont bien les vrais) :
assert len(core_q1.FACES) == 6 and core_q1.N_ITEMS == 18
assert len(core_q1.INVERSES) == 2 and core_q1.ITEM_VIGILANCE == "EXT-VIG"
assert core_q1.ITEM_VIGILANCE not in core_q1.ITEMS
assert core_q1.SEM == 0.2517 and core_q1.CI90_DEMI == 0.4128
assert core_q1.SE_FACE == 0.381 and core_q1.SEUIL_HIERARCHIE == 0.8837
assert core_q1.SEUILS_NIVEAUX == (1.80, 2.60, 3.20)
assert core_q1.SEUIL_RQS_OK == 85 and core_q1.SEUIL_RQS_PRUDENCE == 70
assert core_q1.SE_DIFF == round(2 ** 0.5 * core_q1.SEM, 4)
assert len(core_q2.NIVEAUX_CROISEMENT) == 3
assert core_q2.BORNES_CROISEMENT == (2.50, 3.50)
assert len(core_q2.CONFIGS) == 9 and len(core_q2.MIROIR) == 9
assert core_q2.SEUIL_BOUCLE_PCT == 30.0 and core_q2.SEUIL_STYLES == 1.00
assert core_q2.SEUIL_INF_TAXE == 2.60
assert core_q3.N_JOURS == 14 and core_q3.SEUIL_CELEBRE == 9
assert len(core_q3.BANQUE_PAS_EXT[core_q3.FAMILLE_VERT]) == 3
assert len(core_q3.BANQUE_PAS_EXT[core_q3.FAMILLE_ORANGE]) == 2
assert len(core_q3.BANQUE_PAS_EXT[core_q3.FAMILLE_ROUGE]) == 1
assert core_q3.pas_zero_legitime(True) and not core_q3.pas_zero_legitime(False)

# ─────────────────────────────────────────────────────────────────────────────
# CONSTANTES DE LA COUCHE (R1-R9)
# ─────────────────────────────────────────────────────────────────────────────
AXES = ("H", "L", "C")

# Noms écran des faces — lus depuis le VRAI moteur (jamais réécrits, R3) :
NOM_FACE_ECRAN = {f: core_q1.FACES[f]["nom"] for f in core_q1.FACES}

# Le VRAI palier est déjà un libellé (EXERCICE MAISON / MODULE DE COUPLE /
# ORIENTATION) — l'emoji est la seule addition d'affichage (comme RIO-15) :
PALIER_EMOJI = {core_q1.PALIER_VERT: "🟢", core_q1.PALIER_ORANGE: "🟠",
                core_q1.PALIER_ROUGE: "🔴"}
PALIER_NOM = {core_q1.PALIER_VERT: "Exercice maison",
              core_q1.PALIER_ORANGE: "Module de couple",
              core_q1.PALIER_ROUGE: "Orientation professionnelle"}

# Vocabulaire interdit — canon Partie 9 (clinique) + C6 Générationnelle
# (injonctions temporelles, arbitrage A5) — R5/R6 :
MOTS_INTERDITS = (
    # canon Partie 9, lignes 355-356 + liste SM (le même écran du canon) :
    "pathologie", "diagnostic", "dépistage", "anxieux", "anxiété",
    "dépressif", "dépression", "trouble", "syndrome", "symptôme",
    "burn-out", "burnout", "addiction", "bipolaire", "borderline",
    "schizophrénie", "névrose", "psychose", "suicide", "médicament",
    "posologie", "chronique",
    # C6 Générationnelle — 0 verdict temporel, 0 modèle de la bonne saison :
    "trop tard", "trop jeune", "trop vieux", "compte à rebours",
    "il est temps", "bonne saison", "mauvaise saison", "temps restant",
    "temps qui reste", "dépêch", "pressé", "presser", "urgence",
    "sablier", "échéance",
)

BANDEAU_DSIM = ("[D-SIM] Lecture issue d'une simulation — la mécanique est "
                "validée, pas la prévalence clinique.")

# Filet — literal du VRAI moteur (exception sourcée, R6) :
FILET_LITERAL = core_q1.signal_filet_de({"signal_herite": True})["filet_num"]

CLAUSE_AIDE = (
    "QUAND DEMANDER DE L'AIDE — seuils posés d'avance, les mêmes pour tout "
    "le monde : un signal de sécurité (filet, 9 signaux) → court-circuit "
    "P-FILTRE 3919 / 3114, la carte n'est pas affichée ; un axe VIVE "
    "(≥ 2,60) → à deux, et un re-test est proposé à 8 semaines ; un axe "
    "FORTE (≥ 3,20) → orientation (le chemin le plus court, pas un échec) ; "
    "tous les axes DISCRÈTES ou TRANQUILLES → rien à fabriquer, la suite "
    "du parcours sert aussi à ça."
)

# Balayage de l'autre rive au croisement (mesurée par RIO-17) — les VRAIS
# niveaux de croisement, jamais devinés (R8) :
NIVEAUX_CROISEMENT = core_q2.NIVEAUX_CROISEMENT


# ─────────────────────────────────────────────────────────────────────────────
# R1/R3 — LECTURE ÉCRAN (purement mécanique, via le VRAI moteur)
# ─────────────────────────────────────────────────────────────────────────────
def lecture_axe_ecran(niv: dict) -> str:
    """R3/R4 — le VRAI lecture_L3 affiché tel quel (NIVEAU ou FRONTIÈRE
    « entre X et Y » + décision conservatrice)."""
    if niv["type"] == "NIVEAU":
        return f"{niv['lecture']} (lecture posée)"
    return (f"FRONTIÈRE {niv['lecture']} — décision conservatrice : "
            f"{niv['conservateur']}")


def palier_et_contenu(rive_out: dict) -> dict:
    """R1/R2/R5 — lecture complète : palier VRAI (assert de junction),
    contenu des 3 paliers (F3), seuils d'aide S1/S2, seuils L3 réels.

    Args:
        rive_out : sortie du VRAI classifier_rive (carte, palier, niveaux,
                   faces, rqs, filet, bandeau).

    Returns:
        dict palier, palier_nom, emoji, contenu, S1, S2, seuils, filet,
        carte_affichee, qualite.
    """
    filet = bool(rive_out["filet"]["filet"])
    if filet:
        # R2 — le VRAI classifier a court-circuité (carte=None) :
        assert rive_out["carte"] is None
        assert rive_out["palier"] == core_q1.PALIER_ROUGE
        return {"palier": core_q1.PALIER_ROUGE,
                "palier_nom": PALIER_NOM[core_q1.PALIER_ROUGE],
                "emoji": PALIER_EMOJI[core_q1.PALIER_ROUGE],
                "contenu": None, "S1": True, "S2": False,
                "seuils": core_q1.SEUILS_NIVEAUX, "filet": True,
                "carte_affichee": False,
                "qualite": "CRISE — court-circuit P-FILTRE, carte non affichée"}
    if rive_out["carte"] is None:
        # RQS INVALIDE — aucun résultat (VRAI ligne 257) :
        assert rive_out["palier"] is None
        return {"palier": None, "palier_nom": None, "emoji": None,
                "contenu": None, "S1": False, "S2": False,
                "seuils": core_q1.SEUILS_NIVEAUX, "filet": False,
                "carte_affichee": False,
                "qualite": "RQS INVALIDE — aucun résultat affiché"}
    # R1 — assert de junction : le palier est le VRAI (recalcul interdit) :
    conservateurs = [rive_out["niveaux"][a]["conservateur"] for a in AXES]
    palier_vrai = core_q1.palier_de(*conservateurs, False)["palier"]
    assert palier_vrai == rive_out["palier"], "junction palier : le VRAI palier_de ne correspond pas"
    dominant = axe_dominant(rive_out)
    contenu = contenu_palier(rive_out["palier"], dominant, rive_out)
    # S2 (QUAND DEMANDER DE L'AIDE, seuil ≥ 2,60) : au moins un axe
    # conservateur VIVE ou FORTE — soit tout palier non-VERT (le palier
    # ROUGE — axe FORTE — est AUSSI un moment « demander de l'aide »,
    # il porte en plus l'orientation) :
    s2 = rive_out["palier"] != core_q1.PALIER_VERT
    return {"palier": rive_out["palier"],
            "palier_nom": PALIER_NOM[rive_out["palier"]],
            "emoji": PALIER_EMOJI[rive_out["palier"]],
            "contenu": contenu,
            "S1": False,
            "S2": s2,
            "seuils": core_q1.SEUILS_NIVEAUX, "filet": False,
            "carte_affichee": True,
            "qualite": ("PRUDENCE — carte lisible avec prudence"
                        if rive_out["rqs"]["statut"] == "PRUDENCE"
                        else "hors frontière — lecture posée")}


def axe_dominant(rive_out: dict) -> str | None:
    """L'axe le plus haut (niveau conservateur) — None si tous TRANQUILLE
    ou moins (zone calme : contenu par défaut, R5)."""
    rang = {n: i for i, n in enumerate(core_q1.NIVEAUX)}
    actifs = [(rang[rive_out["niveaux"][a]["conservateur"]], a)
              for a in AXES
              if rang[rive_out["niveaux"][a]["conservateur"]] >= 2]
    if not actifs:
        return None
    return max(actifs)[1]


# ─────────────────────────────────────────────────────────────────────────────
# R5/R6 — F3 : LE CONTENU CONCRET DES 3 PALIERS (produit, pas désigné)
# ─────────────────────────────────────────────────────────────────────────────
EXERCICE_ZONE_CALME = (
    "🟢 Zone calme — rien à fabriquer ici. L'exercice maison reste "
    "disponible : un tour des trois horloges, chacun sa note, une fois "
    "quand vous voulez. Un re-test est proposé à 8 semaines pour relire "
    "la carte."
)
# INVARIANT PROUVÉ (stage 1, COR0-invar) : palier VERT ⇔ tous les
# conservateurs ≤ TRANQUILLE ⇔ axe_dominant() = None — le contenu du
# palier 🟢 est donc TOUJOURS la zone calme (§5.5). Un exercice « par
# axe » sur 🟢 serait du code mort : supprimé, l'invariant est vérifié
# sur chaque configuration au lieu d'être supposé.

# Le contenu 🟠/🔴 s'appuie sur les VRAIS pas de la banque Q3 (junction, R8) :
PAS_ORANGE_REELS = core_q3.BANQUE_PAS_EXT[core_q3.FAMILLE_ORANGE]
PAS_ROUGE_REEL = core_q3.BANQUE_PAS_EXT[core_q3.FAMILLE_ROUGE][0]
PAS_VERT_REELS = core_q3.BANQUE_PAS_EXT[core_q3.FAMILLE_VERT]


def _clause_module(dominant: str | None) -> str:
    """F3 — contenu du palier 🟠 : le VRAI pas orange de la banque Q3
    (verbatim) + la clause contextuelle de l'axe dominant."""
    if dominant == "H":
        return (f"🟠 À deux : {PAS_ORANGE_REELS[0]} — autour de ce que vos "
                "deux priorisations déclarées disent du nous ; chacun "
                "valide ou conteste (ligne 366).")
    if dominant == "L":
        return (f"🟠 À deux : {PAS_ORANGE_REELS[1]} — la taxe de "
                "justification se pose sur la table à deux, jamais sur "
                "l'un : c'est un coût ressenti, pas un reproche.")
    return (f"🟠 À deux : {PAS_ORANGE_REELS[0]} — un seul sujet d'horizon "
            "par séance, choisi par le couple (ligne 366 : l'utilisateur "
            "valide ou conteste chaque proposition).")


def contenu_palier(palier: str, dominant: str | None,
                   rive_out: dict = None) -> dict:
    """F3 — le contenu CONCRET du palier VRAI (exercices produits, pas
    seulement désignés — l'écart F3 de l'audit)."""
    if palier == core_q1.PALIER_VERT:
        # INVARIANT (prouvé au stage 1) : dominant est toujours None ici :
        assert dominant is None, "VERT avec axe dominant — invariant violé"
        return {"exercice": EXERCICE_ZONE_CALME,
                "zone_calme": True,
                "suite_du_parcours": "re-test proposé à 8 semaines",
                "rien_a_fabriquer": True}
    if palier == core_q1.PALIER_ORANGE:
        return {"module": _clause_module(dominant),
                "pas_reel_serve": list(PAS_ORANGE_REELS),
                "re_test": "re-test proposé à 8 semaines",
                "rien_a_fabriquer": False}
    # 🔴 ORIENTATION — R2/R8 : le pas EST la démarche (VRAI pas rouge) :
    return {"orientation": f"🔴 À deux : {PAS_ROUGE_REEL}.",
            "filet": ("tout signal de sécurité → court-circuit P-FILTRE — "
                      f"{FILET_LITERAL}"),
            "re_test": "re-test proposé à 8 semaines",
            "rien_a_fabriquer": False}


def bloc_ecran(rive_out: dict) -> dict:
    """F2/F3 — assemble le bloc écran complet RIO-16 (toutes les clauses
    sont dérivées des VRAIES sorties ; bandeau D-SIM — R7)."""
    pal = palier_et_contenu(rive_out)
    bloc = {"bandeau_dsim": BANDEAU_DSIM,
            "palier": pal["palier"], "palier_nom": pal["palier_nom"],
            "emoji": pal["emoji"], "qualite": pal["qualite"],
            "S1": pal["S1"], "S2": pal["S2"],
            "seuils_aide": CLAUSE_AIDE,
            "seuils_l3": core_q1.SEUILS_NIVEAUX}
    if pal["contenu"] is not None:
        bloc["contenu_palier"] = pal["contenu"]
    if rive_out["carte"]:
        bloc["lectures"] = {a: lecture_axe_ecran(rive_out["niveaux"][a])
                            for a in AXES}
        bloc["faces"] = {
            a: (f"NUAGE — la mesure ne départage pas "
                f"{NOM_FACE_ECRAN[rive_out['faces'][a]['faces'][0]]} de "
                f"{NOM_FACE_ECRAN[rive_out['faces'][a]['faces'][1]]}"
                if rive_out["faces"][a]["dominante"] is None
                else f"{NOM_FACE_ECRAN[rive_out['faces'][a]['dominante']]} "
                     "ressort de façon déclarable")
            for a in AXES}
        bloc["rqs"] = (f"RQS {rive_out['rqs']['rqs']}/100 — "
                       f"{rive_out['rqs']['statut']}")
    if pal["filet"]:
        bloc["court_circuit"] = (
            f"{rive_out['bandeau']} Filet : {rive_out['filet']['filet_num']}")
    if rive_out["carte"] is None and not pal["filet"]:
        bloc["aucun_resultat"] = rive_out["bandeau"]
    return bloc


# ─────────────────────────────────────────────────────────────────────────────
# R8 — COUPLAGE PAS RÉEL (junctions vers les VRAIS moteurs Q2/Q3)
# ─────────────────────────────────────────────────────────────────────────────
def configurations_atteignables(score_h: float) -> dict:
    """R8 — depuis le score H MESURÉ de cette rive : le VRAI
    niveau_croisement, l'autre rive BALAYÉE (jamais devinée) → les VRAIS
    config_de / palier_croise. C'est le miroir exact des
    configurations_couple de la correction RIO-11."""
    n1 = core_q2.niveau_croisement(score_h)
    out = {"niveau_croisement_mesure": n1,
           "configs_atteignables": [], "paliers_croises_atteignables": []}
    for n2 in NIVEAUX_CROISEMENT:
        num = core_q2.config_de(n1, n2)
        palier = core_q2.palier_croise(n1, n2, False)
        out["configs_atteignables"].append(
            {"num": num, "nom": core_q2.CONFIGS[num]["nom"],
             "autre_rive_balayee": n2, "palier_croise": palier})
        out["paliers_croises_atteignables"].append(palier)
    return out


def pas_possibles(score_h: float) -> dict:
    """R8 — les pas annoncés sont ceux des VRAIS moteurs aval : famille
    (VRAI famille_de) + banque (VRAI BANQUE_PAS_EXT) — servis verbatim ;
    le pas zéro n'est légitime que sur zone calme config 1 (VRAI
    pas_zero_legitime) ; 🔴 → le pas EST la démarche."""
    cfg = configurations_atteignables(score_h)
    familles = {}
    for c in cfg["configs_atteignables"]:
        palier = c["palier_croise"]
        if palier not in familles:
            familles[palier] = {
                "famille": core_q3.famille_de(palier),
                "pas_banque_reelle": list(
                    core_q3.BANQUE_PAS_EXT[core_q3.famille_de(palier)]),
                "pas_zero_legitime": core_q3.pas_zero_legitime(c["num"] == 1),
            }
    return {"niveau_croisement_mesure": cfg["niveau_croisement_mesure"],
            "familles": familles,
            "note": ("la configuration réelle du couple sera mesurée par "
                     "RIO-17 — ici, l'autre rive est balayée, jamais devinée")}


def inferences_atteignables(rive_out: dict) -> dict:
    """R8 — les 3 inférences L5 réelles (libellés VERROUILLÉS du VRAI
    moteur Q2) : ce qui est déjà atteignable depuis CETTE rive, l'autre
    rive balayée — jamais devinée."""
    return {
        "inf_taxe_atteignable": ("ssi la taxe de justification est vive "
                                 "(≥ 2,60) chez au moins une rive — la "
                                 "face L1 de cette rive est lue au "
                                 "croisement"),
        "inf_sujet_atteignable": ("dès que les deux niveaux de croisement "
                                  "diffèrent — l'autre rive balayée en "
                                  "donne toujours deux possibles"),
        "inf_silence_atteignable": ("ssi l'évitement dépasse l'ouverture "
                                    "chez les deux rives — la face C2 de "
                                    "cette rive est lue au croisement"),
    }


def re_test_huit_semaines(depuis: str = "2026-01-01") -> str:
    """R9 — arithmétique de dates, +56 jours ISO (même sémantique que le
    vrai programmer_re_test émotionnel ; consigné : arithmétique, pas une
    mesure)."""
    d = date.fromisoformat(depuis) + timedelta(days=56)
    return d.isoformat()


# ─────────────────────────────────────────────────────────────────────────────
# F4 — FRAGMENT DE BILAN L8 (7 blocs canon : position · forme · empreinte ·
#      couple · force · limites · palier/pas + flux vers Q2-Q5, ligne 265)
# ─────────────────────────────────────────────────────────────────────────────
def _fragment_hors_carte(rive_out: dict, pal: dict) -> dict:
    """F4 — fragment complet des cas sans carte (filet court-circuité,
    RQS INVALIDE) : les 7 blocs restent remplis — aucun bloc vide (COR1)."""
    filet = pal["filet"]
    out = {
        "bloc_1_position": {
            "niveaux": ("non lus — la carte n'est pas affichée (court-circuit "
                        "AVANT l'arbre)" if filet
                        else "non lus — RQS INVALIDE, aucun résultat (ligne 257)"),
            "aggregate": ("non calculé — la carte n'est pas affichée" if filet
                          else "non calculé — aucun résultat"),
            "rqs": rive_out["rqs"]["rqs"],
            "statut_rqs": rive_out["rqs"]["statut"],
            "palier_moteur": (pal["palier"] or "aucun — aucun résultat affiché"),
            "qualite": pal["qualite"],
            "dans_bande_dsim": True,
        },
        "bloc_2_forme": {
            "forme": ("non lue — la carte n'est pas affichée (court-circuit "
                      "AVANT l'arbre)" if filet
                      else "non lue — RQS INVALIDE, aucun résultat (ligne 257)"),
            "note": ("aucune lecture de forme sur un signal sécurité — "
                     "afficher serait fabriquer" if filet
                     else "répondre de nouveau avec des réponses de "
                          "qualité suffisante permet de repasser la carte"),
        },
        "bloc_3_empreinte": {
            "source": "RIO-17 — vrai moteur ext-q2 (le croisement à deux)",
            "note": ("le croisement n'est jamais déployé sur une crise "
                     "active — configuration calculée et tracée" if filet
                     else "le croisement attend une carte valide des deux rives"),
        },
        "bloc_4_couple": {
            "source": "RIO-17 — vrai moteur ext-q2 (palier croisé max-niveau)",
            "override_d_crise": ("court-circuit ACTIF — le croisement est "
                                 "court-circuité avant tout verdict (VRAI "
                                 "classifier_croisement)" if filet
                                 else "non concerné — aucun signal de crise"),
            "verdict_comparatif": ("0 % compatibilité — le croisement lit "
                                   "deux lectures déclarées, jamais un "
                                   "score comparé"),
        },
        "bloc_5_force": {
            "source": ("la permission à deux (face EXT-L2), tirée des "
                       "vraies réponses"),
            "note": ("aucune force lue — la carte n'est pas affichée" if filet
                     else "aucune force lue — aucun résultat"),
        },
        "bloc_6_limites": {
            "note": ("court-circuit sécurité — P-FILTRE, carte non "
                     "affichée" if filet
                     else "RQS < 70 — réponses de qualité insuffisante"),
            "item_vigilance": ("EXT-VIG tracé — ne touche que le RQS, "
                               "jamais affiché comme lecture"),
            "bandeau_dsim": BANDEAU_DSIM,
        },
        "bloc_7_palier_pas": {
            # RQS INVALIDE → aucun palier affiché (palier None du VRAI
            # classifier) — le fragment reste complet, la consignation dit
            # pourquoi (COR1 : aucun bloc vide, y compris hors-carte) :
            "palier": pal["palier"] or "aucun — aucun résultat affiché",
            "palier_nom": (pal["palier_nom"]
                           or "aucun — aucun résultat affiché"),
            "pas_possibles": ("aucun pas servi — le court-circuit passe "
                              "avant tout choix (D-CRISE)" if filet
                              else "aucun pas servi — aucun résultat affiché"),
            "pas_en_crise": ("aucun pas de couple sur un signal sécurité — "
                             "l'orientation EST le pas : "
                             + PAS_ROUGE_REEL if filet
                             else "non concerné — aucun palier servi"),
            "filet": (FILET_LITERAL if filet
                      else "aucun signal"),
            "suivi_14_jours_sans_sanction": True,
            "retest": ("re-test RIO-16 programmé à 8 semaines — "
                       + re_test_huit_semaines()),
        },
    }
    out["_complet"] = all(
        v not in (None, "", [], {}) for v in _valeurs_feuilles(out)
        if v is not True and v is not False)
    return out


def bilan_fragment(rive_out: dict, pal: dict | None = None) -> dict:
    """Contribution de RIO-16 au bilan d'ensemble (assemblage L8 du canon,
    ligne 265 : « position · forme · empreinte · couple · force · limites ·
    palier/pas » + flux vers Q2-Q5). Les blocs couple/pas pointent les
    VRAIS moteurs Q2 (9 configurations) et Q3 (familles + banque de pas +
    suivi)."""
    if pal is None:
        pal = palier_et_contenu(rive_out)
    if not rive_out["carte"]:
        # filet court-circuité ou RQS INVALIDE — fragment complet dédié :
        return _fragment_hors_carte(rive_out, pal)
    niv = rive_out["niveaux"]
    score_h = rive_out["niveaux"]["H"]["score"]
    rang = {n: i for i, n in enumerate(core_q1.NIVEAUX)}
    ordre_axes = ">".join(sorted(AXES, key=lambda a: -rang[niv[a]["conservateur"]]))
    frontieres = [a for a in AXES if niv[a]["type"] == "FRONTIÈRE"]
    cfg = configurations_atteignables(score_h)
    actifs = [a for a in AXES
              if rang[niv[a]["conservateur"]] >= 2] if rive_out["carte"] else []
    veille = [a for a in AXES
              if rang[niv[a]["conservateur"]] == 1] if rive_out["carte"] else []
    bas = [a for a in AXES
           if rang[niv[a]["conservateur"]] == 0] if rive_out["carte"] else []
    frag = {
        "bloc_1_position": {
            "niveaux": {a: {"score": niv[a]["score"],
                            "ci90": niv[a]["ci90"],
                            "type": niv[a]["type"],
                            "lecture": niv[a]["lecture"],
                            "conservateur": niv[a]["conservateur"]}
                        for a in AXES} if rive_out["carte"] else None,
            "aggregate": rive_out["aggregate"],
            "rqs": rive_out["rqs"]["rqs"],
            "statut_rqs": rive_out["rqs"]["statut"],
            "palier_moteur": pal["palier"],
            "palier_cause": rive_out.get("palier_cause"),
            "qualite": pal["qualite"],
            "dans_bande_dsim": True,
        },
        "bloc_2_forme": {
            "ordre_axes_conservateur": ordre_axes,
            "axes_en_frontiere": frontieres if frontieres
            else ["aucune frontière — chaque axe porte un niveau posé"],
            "faces": {a: {"lecture": rive_out["faces"][a]["lecture"],
                          "dominante": (rive_out["faces"][a]["dominante"]
                                        or "NUAGE — pas de dominante "
                                        "(anti-surinterprétation)"),
                          "ecart": rive_out["faces"][a]["ecart"],
                          "seuil": rive_out["faces"][a]["seuil"]}
                      for a in AXES},
            "nuages": ([a for a in AXES
                        if rive_out["faces"][a]["dominante"] is None]
                       or ["aucun nuage — chaque axe porte une hiérarchie "
                           "déclarable"]),
        },
        "bloc_3_empreinte": {
            "source": "RIO-17 — vrai moteur ext-q2 (le croisement à deux)",
            "configs_possibles": 9,
            "configs_atteignables_depuis_cette_rive": [
                c["num"] for c in cfg["configs_atteignables"]],
            "inferences_L5_possibles": [core_q2.INF_TAXE, core_q2.INF_SUJET,
                                        core_q2.INF_SILENCE],
            "note": ("les inférences réelles se calculent au croisement "
                     "(RIO-17) sur les deux rives — cette rive ne les "
                     "devine pas"),
        },
        "bloc_4_couple": {
            "source": "RIO-17 — vrai moteur ext-q2 (palier croisé max-niveau)",
            "paliers_croises_atteignables": sorted(set(
                c["palier_croise"] for c in cfg["configs_atteignables"])),
            "override_d_crise": ("jamais de croisement sur crise active — "
                                 "configuration calculée et tracée, "
                                 "jamais déployée (VRAI classifier_croisement)"),
            "verdict_comparatif": ("0 % compatibilité — le croisement lit "
                                   "deux lectures déclarées, jamais un "
                                   "score comparé"),
        },
        "bloc_5_force": {
            "source": ("la permission à deux (face EXT-L2), tirée des "
                       "vraies réponses"),
            "note": ("la force de la carte est la permission à deux — "
                     "les autres forces du lien se mesurent au croisement"),
            "l2_face": "EXT-L2",
            "seuil_force": core_q2.SEUIL_INF_TAXE,
        },
        "bloc_6_limites": {
            "axes_actifs": actifs if actifs
            else ["aucun axe actif — rien à fabriquer"],
            "axes_en_veille": veille if veille else ["aucun axe en veille"],
            "axes_bas": bas if bas else ["aucun axe bas"],
            "rqs_note": ("qualité PRUDENCE — la carte reste lisible avec "
                         "prudence" if rive_out["carte"]
                         and rive_out["rqs"]["statut"] == "PRUDENCE"
                         else "aucune note"),
            "item_vigilance": ("EXT-VIG tracé — ne touche que le RQS, "
                               "jamais affiché comme lecture"),
            "bandeau_dsim": BANDEAU_DSIM,
        },
        "bloc_7_palier_pas": {
            "palier": pal["palier"],
            "palier_nom": pal["palier_nom"],
            "contenu_palier": pal["contenu"],
            "pas_possibles": {p: fam["pas_banque_reelle"]
                              for p, fam in pas_possibles(
                                  score_h)["familles"].items()},
            "pas_zero_legitime": ("ssi la configuration croisée est LA MÊME "
                                  "HEURE (config 1 — zone calme) — VRAI "
                                  "pas_zero_legitime"),
            "suivi_14_jours_sans_sanction": True,
            "retest": ("re-test RIO-16 programmé à 8 semaines — "
                       + re_test_huit_semaines()),
        },
    }
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


def textes_ecran(rive_out: dict) -> list[str]:
    """Tous les textes affichés d'une configuration (COR4 — vocabulaire)."""
    bloc = bloc_ecran(rive_out)
    frag = bilan_fragment(rive_out)
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
