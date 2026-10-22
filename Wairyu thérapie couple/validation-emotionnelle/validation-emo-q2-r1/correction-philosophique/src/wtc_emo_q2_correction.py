# -*- coding: utf-8 -*-
"""
WTC-EMO-Q2-R1 — COUCHE DE CORRECTION PHILOSOPHIQUE (fichier SUPPLÉMENTAIRE)
===========================================================================
RIO-07 « Ce que je n'arrive pas à dire » — rattrapage au gabarit universel
§5.1-§5.4 du canon (demande fondateur, même ordre que RIO-01/02/03/06 :
fichiers SUPPLÉMENTAIRES, zéro modification de l'existant, exactitude des
calculs).

RÈGLE ABSOLUE : ce module NE MODIFIE AUCUN moteur existant.
- Le vrai moteur de la quête reste `validation-emotionnelle/
  validation-emo-q2-r1/src/wtc_emo_q2_core.py` (M3 — logique inchangée,
  arbre 4 débouchés documenté D-VÉRITÉ, arbitrage S-EMO-Q2-3 confirmé :
  « le code était juste, c'est la table de vérité qui avait un label
  orphelin ») — importé tel quel, jamais recopié.
- Le vrai simulateur archivé est `wtc_emo_q2_simulator.py` (R1 : M1 E5
  corrigé + M2 E6 ajouté, seed 42) — utilisé par le pipeline de preuve
  pour le re-score bit-exact des 460 profils.
- Les junctions utilisent les VRAIS moteurs `validation-emo-q1`
  (héritages cœur er1/er2/cap/fe1/fe3/fe6 — RIO-06 les a mesurés),
  `validation-emo-q4` (croisement à deux, 9 configurations — RIO-09) et
  `validation-emo-q5` (le pas du cœur, arbre 8 pas + suivi 14 j +
  re-test 8 semaines — RIO-10).

CE QUE CETTE COUCHE AJOUTE (audit Task 163 : RIO-07 = 53 %, F2 12/25,
F3 6/25, F4 10/25 — F1 25 inchangé) :
- F2 : le palier 🟢🟠🔴 DE LA QUÊTE existe dans le VRAI moteur (fonction
  `palier`) mais n'était validé par AUCUN critère du package (l'audit :
  « aucun match “palier / orientation / QUAND DEMANDER” dans les
  critères validés ») — la couche le VALIDE tel quel (jamais réécrit) et
  ajoute « QUAND DEMANDER DE L'AIDE » (S1 = palier 🔴 du VRAI moteur —
  la dynamique d'invalidation chronique documentée à haut risque ;
  S2 = palier 🟠 — signal présent, à surveiller, re-test 8 semaines) +
  la zone d'ombre causale sans étiquette (les VRAIS templates du
  moteur, cités mot pour mot — l'invalidant n'est jamais condamné,
  l'invalidé n'est jamais minimisé).
- F3 : contenu des 3 paliers (exercices 🟢 de formulation claire,
  modules 🟠 « le décodeur à deux », orientation 🔴 phrase canon) +
  branchement quête « pas » sur le VRAI selectionner_pas émotionnel —
  avec les héritages Q2 (inv_d_zone, rc_label) MAINTENANT MESURÉS par
  CETTE quête (RIO-06 les avait balayés — « RIO-07 viendra les mesurer,
  jamais devinés » : la boucle est fermée ici) + suivi 14 j sans
  sanction + re-test 8 semaines (vrais moteurs Q5).
- F4 : fragment de bilan L8 à 7 blocs avec junctions réelles
  (croisement RIO-01/02 via le VRAI convergence_interdimensions — les
  héritages score_A/label_ombre balayés ; couple RIO-09 via le VRAI
  configuration_devises ALIMENTÉ PAR LA VRAIE ZONE MESURÉE de cette
  quête ; pas RIO-10 via le VRAI selectionner_pas).

Chaque règle ci-dessous est PRÉ-ENREGISTRÉE (écrite avant tout calcul)
et dérivée MÉCANIQUEMENT des sorties du vrai moteur — zéro invention de
mesure.

Règles pré-enregistrées :
- R1 (palier de quête) : le VRAI palier du moteur (core.palier) appliqué
  tel quel : 🔴 si invalidation donnée FRÉQUENT ∧ moyenne ≥ 4,0 ∧ boucle
  active (dynamique d'invalidation chronique bilatérale — « documentée
  à haut risque », template réel du moteur) ; 🟠 si signal présent
  (zone ≠ ABSENT ∨ moyenne ≥ 2,60 ∨ REPROCHE-CODE ACTIF ∨ boucle
  active) ; 🟢 sinon (exercice maison). La couche ne recalcule JAMAIS le
  palier : elle l'appelle et en dérive l'affichage. Nota : la zone REÇUE
  n'entre pas dans le palier — le répondant n'est jamais placé en 🟠/🔴
  pour ce qu'il subit (elle est affichée, prise au sérieux, jamais
  sanctionnée).
- R2 (seuil d'aide S1) : palier 🔴 (conditions du VRAI palier, motifs
  indépendants des inconnues) → orientation chaleureuse affichée
  (« le chemin le plus court, pas un échec »).
- R3 (seuil d'aide S2) : palier 🟠 sans 🔴 → « à surveiller » + re-test
  8 semaines (le VRAI programmer_re_test de la quête pas), palier
  restant 🟠 (le décodeur à deux).
- R4 (qualité avant sens) : CET instrument ne définit aucun gate RQS
  (le cœur RQS appartient à RIO-06) — aucune suspension n'est inventée.
  Le seul statut de qualité défini par le vrai moteur est la prudence
  de convergence (VRAI index_p : index ≤ 0,50 → prudence forte) —
  affichée telle quelle dans le croisement RIO-01/02. D-ÉCHELLE (seuils
  ancrés au milieu 3,00) est appliquée par le moteur lui-même, sans
  retouche.
- R5 (anti-fabrication §5.5) : « rien à fabriquer » énoncé si et
  seulement si le VRAI palier vaut 🟢 (conditions du moteur : zone
  donnée ABSENT ∧ moyenne < 2,60 ∧ label ≠ REPROCHE-CODE ACTIF ∧ boucle
  inactive) — et il porte sur le côté DONNÉ du répondant uniquement ;
  JAMAIS sur une zone reçue (le ressenti reçu est toujours réel —
  template réel du moteur). Les textes affichés citent les VRAIS
  templates des zones/labels/boucle/palier — mot pour mot, jamais
  paraphrasés, jamais de template fabriqué.
- R6 (le succès affiché comme tel) : FORMULATION ACQUISE (4e débouché
  de l'arbre M3) est affiché comme une assise (« c'est le succès,
  affiché comme tel » — docstring du vrai moteur), jamais comme un
  problème à traiter.
- R7 (vocabulaire écran, canon Partie 9) : aucun mot de la liste
  interdite dans tout texte affiché ; les 8 formulations condamnantes
  du moteur (MOTS_INTERDITS_VERDICT, critère C3a éliminatoire) sont
  également testées ; D-CRISE non applicable à cet instrument (il ne
  mesure aucun construit d'auto-danger — consigné ; le filet D-CRISE de
  l'app reste porté par les quêtes qui le mesurent, RIO-02 côté
  attachement). Les textes utilisent les descriptions causales des
  templates réels (« la minimisation apparaît… », « le lien s'use »,
  « ce que tu ressens est réel ») — descriptif, jamais verdict d'être.
- R8 (D-SIM) : bandeau simulation sur chaque bloc écran.
- R9 (couplage réel) : le pas annoncé est celui du VRAI moteur
  émotionnel Q5 (arbre INV > RC > CAP > FE1 > FE6 > ER1 > ER2 > FE3).
  Les héritages Q2 (inv_d_zone, rc_label) sont MESURÉS par cette quête
  et transmis au vrai arbre tels quels ; les héritages cœur (er1, er2,
  cap, fe1, fe3, fe6 — RIO-06) et couple (devises, boucle des bids,
  zone du partenaire — RIO-09) sont balayés sur leurs valeurs réelles
  possibles (jamais devinés) ; le croisement RIO-01/02
  (convergence_interdimensions) balaye score_A/label_ombre sur les
  mêmes principes.
"""

from __future__ import annotations

import hashlib
import importlib.util
import sys
from pathlib import Path

# ─────────────────────────────────────────────────────────────────────────────
# CHARGEMENT DES VRAIS MOTEURS (jamais recopiés, jamais modifiés)
# ─────────────────────────────────────────────────────────────────────────────
_PKG = Path(__file__).resolve().parents[1]           # …/validation-emo-q2-r1/correction-philosophique
_Q2 = _PKG.parent                                    # …/validation-emo-q2-r1
_EMO = _Q2.parent                                    # …/validation-emotionnelle
_WTC = _EMO.parent                                   # …/Wairyu thérapie couple


def _charge(nom: str, chemin: Path):
    spec = importlib.util.spec_from_file_location(nom, chemin)
    mod = importlib.util.module_from_spec(spec)
    sys.modules[nom] = mod
    spec.loader.exec_module(mod)
    return mod


# Le VRAI moteur de la quête (R1 — M3 : logique inchangée depuis le
# package initial, arbitrage S-EMO-Q2-3 confirmé). Le VRAI simulateur
# (M1+M2, seed 42) est chargé par le pipeline de validation.
core_q2 = _charge("wtc_emo_q2_core", _Q2 / "src" / "wtc_emo_q2_core.py")
core_q4 = _charge("wtc_emo_q4_core", _EMO / "validation-emo-q4" / "src" / "wtc_emo_q4_core.py")
core_q5 = _charge("wtc_emo_q5_core", _EMO / "validation-emo-q5" / "src" / "wtc_emo_q5_core.py")

# Vérification d'intégrité des moteurs chargés (ce sont bien les vrais) :
assert core_q2.SEUIL_MID == 3.00                      # D-ÉCHELLE
assert len(core_q2.INV_D) == 3 and len(core_q2.INV_R) == 3 and len(core_q2.RC) == 3
assert len(core_q2.TEMPLATES_INVALIDATION_DONNEE) == 3
assert len(core_q2.TEMPLATES_INVALIDATION_RECUE) == 3
assert len(core_q2.TEMPLATES_REPROCHE_CODE) == 4
assert len(core_q2.TEMPLATES_BOUCLE) == 2
assert len(core_q2.TEMPLATES_PALIER) == 3
assert len(core_q2.MOTS_INTERDITS_VERDICT) == 8
assert len(core_q4.CONFIG_LABELS) == 9 and len(core_q4.CANALS) == 3
assert len(core_q4.DEVISE_PATTERNS) == 6
assert len(core_q5.PAS_ORDER) == 8 and len(core_q5.TEMPLATES_PAS) == 8
assert core_q5.SEUIL_CELEBRE == 10 and core_q5.SEUIL_AJUSTEMENT == 6

# ─────────────────────────────────────────────────────────────────────────────
# CONSTANTES DE LA COUCHE (R1-R9)
# ─────────────────────────────────────────────────────────────────────────────
ZONES = ("ABSENT", "OCCASIONNEL", "FRÉQUENT")
LABELS_RC = tuple(core_q2.TEMPLATES_REPROCHE_CODE.keys())      # 4 labels réels
LABELS_ACTIFS = ("REPROCHE-CODE ACTIF", "BESOIN VIVANT, FORMULATION MIXTE")

PALIER_NOM = {"🟢": "Seul·e — exercice maison", "🟠": "À deux — le décodeur",
              "🔴": "Avec un professionnel — orientation chaleureuse"}

# Bornes du VRAI moteur sur la grille des moyennes (13 valeurs s/3,
# s = 3..15) — consignées, jamais retouchées :
#   zone   : ABSENT m ≤ 2,00 (inclusif) · OCCASIONNEL ≤ 3,50 · FRÉQUENT au-delà
#   signal : m ≥ 2,60 (🟠) — non atteignable pile (2,33 / 2,67 : dist min 0,07)
#   grave  : m ≥ 4,0  (🔴) — ATTEIGNABLE PILE (12/3 = 4,00), borne inclusive
#            définie par le VRAI palier — consignée (COR3)
#   D-ÉCH. : m ≥ 3,00 (reproche-code) — ATTEIGNABLE PILE (9/3), borne
#            inclusive D-ÉCHELLE (le milieu = le mixte honnête) — consignée
SEUIL_SIGNAL_ENTIER = 8    # m ≥ 2,60 ⇔ somme ≥ 8  (8/3 = 2,67)
SEUIL_GRAVE_ENTIER = 12    # m ≥ 4,00 ⇔ somme ≥ 12 (12/3 = 4,00, pile — inclusif)
SEUIL_MID_ENTIER = 9       # m ≥ 3,00 ⇔ somme ≥ 9  (9/3 = 3,00, pile — inclusif)

MOTS_INTERDITS = (
    "pathologie", "diagnostic", "dépistage", "anxieux", "anxiété",
    "évitement", "évitant", "évitante", "désorganisé", "trouble",
    "syndrome", "désordre", "symptôme", "névrosisme", "narcissisme",
    "jalousie",
)

BANDEAU_DSIM = ("[D-SIM] Lecture issue d'une simulation — la mécanique est "
                "validée, pas la prévalence clinique.")

PHRASE_ORIENTATION = ("le chemin le plus court est de ne pas porter ça "
                      "seul·e — l'orientation vers un professionnel de la "
                      "relation n'est pas un échec, c'est le pas qui compte ici")

NOTE_D_ECHELLE = ("Échelle lue avec les seuils D-ÉCHELLE du moteur — ancrés "
                  "au milieu (3,00) : en dessous le besoin est discret, au "
                  "dessus il s'exprime.")

# Héritages RIO-02 (label d'ombre) — balayage des valeurs réelles que
# RIO-02 mesure ; le VRAI convergence_interdimensions n'en lit que
# l'appartenance à {"PEUR DE PERDRE", "LES DEUX"} (prouvé au stage 0) :
OMBRES_DOMINANTES = ("PEUR DE PERDRE", "LES DEUX")
OMBRE_HORS_CLASSE = "ZONE CALME"

# Héritages RIO-01 (terrain : score_A, i_alarm, h_norm) — balayage des
# représentants réels de part et d'autre des VRAIS seuils du moteur
# (2,61 / 5 / 0,30) :
TERRAIN_REPS = (
    (2.0, 3, 0.10),    # calme sur les trois voies
    (2.0, 7, 0.10),    # i_alarm seule
    (2.0, 3, 0.35),    # h_norm seule
    (2.0, 7, 0.35),    # i_alarm + h_norm
    (3.3, 3, 0.10),    # score_A seule
    (3.3, 7, 0.10),    # score_A + i_alarm
    (3.3, 3, 0.35),    # score_A + h_norm
    (3.3, 7, 0.35),    # les trois
)


# ─────────────────────────────────────────────────────────────────────────────
# R1/R2/R3 — PALIER DE QUÊTE (VRAI moteur) + SEUILS D'AIDE
# ─────────────────────────────────────────────────────────────────────────────
def palier_et_seuils(rep: dict, rc_d, score_A, i_alarm, h_norm) -> dict:
    """R1/R2/R3 — le VRAI palier du moteur + ses dérivés S1/S2.

    Toutes les lectures passent par les VRAIES fonctions du moteur
    (zones_invalidation, reproche_code, boucle_reassurance, palier).
    La couche n'ajoute AUCUN seuil numérique : S1 = palier 🔴, S2 =
    palier 🟠 — exactement.
    """
    zones = core_q2.zones_invalidation(rep)
    rc = core_q2.reproche_code(rep, rc_d)
    boucle = core_q2.boucle_reassurance(rep, score_A, i_alarm, h_norm)
    palier = core_q2.palier(zones["donnee"], rc["label"], boucle["active"])
    s1 = palier == "🔴"
    s2 = palier == "🟠"
    return {
        "zones": zones, "rc": rc, "boucle": boucle, "palier": palier,
        "palier_nom": PALIER_NOM[palier],
        "S1": s1, "S2": s2,
        "orientation_affichee": s1, "surveillance_affichee": s2,
    }


def palier_independant(s_d: int, s_r: int, s_c: int, rc_d: int,
                       re1: int, re2: int, terrain: bool) -> dict:
    """COR2 — chemin de calcul INDÉPENDANT (entiers purs, zéro float).

    Recalcule zones, label, boucle et palier depuis les SOMMES brutes
    d'items (moyenne = s/3, seuils entiers) sans passer par aucun score
    flottant :
      zone    : ABSENT s ≤ 6 (2,00 inclusif) · OCCASIONNEL 7-10 · FRÉQUENT ≥ 11
      signal  : m ≥ 2,60 ⇔ s ≥ 8   (8/3 = 2,67 ; 7/3 = 2,33)
      grave   : m ≥ 4,00 ⇔ s ≥ 12  (12/3 = 4,00 — pile, inclusif)
      D-ÉCH.  : m ≥ 3,00 ⇔ s ≥ 9   (9/3 = 3,00 — pile, inclusif)
      boucle  : RE-1 ≥ 3 ∧ RE-2 ≥ 3 ∧ terrain (entiers)
    Doit converger EXACTEMENT avec palier_et_seuils() (VRAI moteur).
    """
    def zone(s: int) -> str:
        if s <= 6:
            return "ABSENT"
        if s <= 10:
            return "OCCASIONNEL"
        return "FRÉQUENT"

    zd = zone(s_d)
    zr = zone(s_r)
    if s_c >= SEUIL_MID_ENTIER and rc_d >= 3:
        label = "BESOIN VIVANT, FORMULATION MIXTE"
    elif s_c >= SEUIL_MID_ENTIER:
        label = "REPROCHE-CODE ACTIF"
    elif rc_d >= 3:
        label = "FORMULATION ACQUISE"
    else:
        label = "BESOIN DISCRET"
    boucle_active = (re1 >= 3) and (re2 >= 3) and terrain
    grave = (zd == "FRÉQUENT" and s_d >= SEUIL_GRAVE_ENTIER and boucle_active)
    if grave:
        palier = "🔴"
    elif (zd != "ABSENT" or s_d >= SEUIL_SIGNAL_ENTIER
            or label == "REPROCHE-CODE ACTIF" or boucle_active):
        palier = "🟠"
    else:
        palier = "🟢"
    return {"zone_d": zd, "zone_r": zr, "label": label,
            "boucle_active": boucle_active, "palier": palier,
            "S1": palier == "🔴", "S2": palier == "🟠"}


# ─────────────────────────────────────────────────────────────────────────────
# R5/R6/R7/R8 — TEXTES ÉCRAN (templates réels cités mot pour mot)
# ─────────────────────────────────────────────────────────────────────────────
def _clause_zone_calmes(lect: dict) -> str:
    """R5 — « rien à fabriquer » : énoncé SSI le VRAI palier vaut 🟢."""
    if lect["palier"] == "🟢":
        return ("Rien à fabriquer ici : ta minimisation n'apparaît pas dans "
                "ce que tu décris, tes besoins ne passent pas par la "
                "devinette, le cercle de la réassurance ne tourne pas — "
                "cette zone est calme chez toi.")
    return ""


def _clause_formule_acquise(lect: dict) -> str:
    """R6 — le succès affiché comme tel (FORMULATION ACQUISE = assise).
    Le template réel est déjà cité dans la lecture ; cette clause ne fait
    qu'ajouter le cadre : un succès, pas un problème à traiter."""
    if lect["rc"]["label"] == "FORMULATION ACQUISE":
        return ("Le succès est affiché comme tel : formuler tes besoins est "
                "déjà acquis chez toi — c'est une assise, pas un problème à "
                "traiter.")
    return ""


# F3 — exercices maison 🟢 (capitalisation de la formulation claire),
# dérivés des construits cités du moteur (reproche-code / demande
# explicite, chapitre émotionnel WTC) et du signal dominant réel :
_EXERCICE_LABEL = {
    "REPROCHE-CODE ACTIF":
        "la traduction une fois par jour : reprends un reproche que tu as "
        "en tête et écris la demande cachée en une phrase qui commence par "
        "« j'aimerais ». Un carnet, deux minutes",
    "BESOIN VIVANT, FORMULATION MIXTE":
        "le choix de canal : avant de parler, demande-toi « je reproche ou "
        "je demande ? » — et dis la version demande. Une fois par jour "
        "suffit pour voir le mixte bouger",
    "BESOIN DISCRET":
        "une chose retenue dite à voix haute une fois par jour — une "
        "seule, choisie, minuscule. Le besoin discret sort un mot à la "
        "fois, pas d'un coup",
    "FORMULATION ACQUISE":
        "capitalise : note ce qui marche quand tu formules — la phrase, "
        "le moment, la réaction. Ce que tu notes devient ton mode d'emploi",
}
_EXERCICE_BOUCLE = (
    "le calme différé : quand tu demandes une preuve, écris-la au lieu de "
    "la demander — relis-la le lendemain. Le cercle ralentit d'un tour")
_EXERCICE_ZONE = (
    "l'accueil en direct : quand le ressenti de l'autre monte, répète ce "
    "que tu as entendu avant de répondre. La minimisation n'a pas de "
    "place dans la répétition")


def _clause_exercice(lect: dict) -> str:
    """F3 — contenu du palier 🟢 (signal dominant réel → exercice)."""
    morceaux = ["🟢 À ta portée, seul·e : "
                + _EXERCICE_LABEL[lect["rc"]["label"]] + "."]
    if lect["boucle"]["active"]:
        morceaux.append("🟢 En plus : " + _EXERCICE_BOUCLE + ".")
    if lect["zones"]["donnee"]["zone"] != "ABSENT":
        morceaux.append("🟢 En plus : " + _EXERCICE_ZONE + ".")
    return " ".join(morceaux)


def _clause_module(lect: dict) -> str:
    """F3 — contenu du palier 🟠 : le décodeur à deux (par signal réel)."""
    modules = []
    if lect["rc"]["label"] in LABELS_ACTIFS:
        modules.append("🟠 À deux — le décodeur : chacun reformule ce qu'il "
                       "a entendu (« si je te comprends, tu demandes… ») "
                       "avant de répondre. 15 minutes par semaine.")
    if lect["zones"]["donnee"]["zone"] != "ABSENT":
        modules.append("🟠 À deux — l'accueil du ressenti : un temps fixe "
                       "où ce que l'un ressent est répété, pas contesté. "
                       "L'autre écoute, sans réparer.")
    if lect["boucle"]["active"]:
        modules.append("🟠 À deux — la réassurance différée : les demandes "
                       "de preuves sont posées par écrit, répondues le "
                       "lendemain à heure fixe.")
    if not modules:
        modules.append("🟠 À deux — le point de vigilance : un temps fixe "
                       "pour parler de ce qui n'a pas été dit. 15 minutes "
                       "par semaine.")
    return " ".join(modules)


def clause_orientation(lect: dict) -> str:
    return ("🔴 Avec un professionnel : " + core_q2.TEMPLATES_PALIER["🔴"]
            + " " + PHRASE_ORIENTATION[:1].upper() + PHRASE_ORIENTATION[1:]
            + ".")


def _clause_surveillance(lect: dict) -> str:
    return ("Seuil approché : ton palier est 🟠 — un signal est présent "
            "sans être la dynamique à haut risque. À surveiller, re-test "
            "proposé à 8 semaines.")


def clause_aide_standing() -> str:
    return ("QUAND DEMANDER DE L'AIDE — seuils posés d'avance, les mêmes "
            "pour tout le monde : palier 🔴 du moteur (invalidation donnée "
            "fréquente à 4,0 ou plus, boucle active) → la dynamique "
            "d'invalidation chronique est documentée à haut risque, parler "
            "à un professionnel est proposé ; palier 🟠 → le décodeur à "
            "deux, à surveiller, re-test proposé à 8 semaines ; palier 🟢 "
            "→ exercice maison ; ce que tu reçois est toujours pris au "
            "sérieux quelle que soit ta note — ce n'est jamais une faute "
            "de ressentir.")


def bloc_ecran(lect: dict) -> dict:
    """Assemble le bloc écran complet RIO-07 (toutes les clauses sont
    déterminées mécaniquement par les sorties du VRAI moteur — les
    templates sont cités mot pour mot).

    R4 — aucun gate RQS sur cet instrument : pas de suspension inventée ;
    la prudence CI (vrai index_p) est affichée dans le fragment seulement.
    R5 — « rien à fabriquer » ⟺ palier 🟢 exactement.
    """
    zones, rc, boucle, palier = lect["zones"], lect["rc"], lect["boucle"], lect["palier"]
    parties = [BANDEAU_DSIM]
    parties.append(
        "Ce que tu n'arrives pas à dire se lit : minimisation donnée "
        + zones["donnee"]["zone"] + " · minimisation reçue "
        + zones["recue"]["zone"] + " · reproche-code "
        + rc["label"] + " · boucle de réassurance "
        + ("active" if boucle["active"] else "inactive") + ".")
    parties.append("> " + core_q2.TEMPLATES_INVALIDATION_DONNEE[zones["donnee"]["zone"]])
    parties.append("> " + core_q2.TEMPLATES_INVALIDATION_RECUE[zones["recue"]["zone"]])
    parties.append("> " + core_q2.TEMPLATES_REPROCHE_CODE[rc["label"]])
    parties.append("> " + core_q2.TEMPLATES_BOUCLE[boucle["active"]])
    calme = _clause_zone_calmes(lect)
    if calme:
        parties.append(calme)
    acquise = _clause_formule_acquise(lect)
    if acquise:
        parties.append(acquise)
    parties.append(f"CE QUE TU PEUX CHANGER — palier {palier} "
                   f"({lect['palier_nom']}) :")
    parties.append("> " + core_q2.TEMPLATES_PALIER[palier])
    if palier == "🟢":
        parties.append(_clause_exercice(lect))
    elif palier == "🟠":
        parties.append(_clause_exercice(lect))
        parties.append(_clause_module(lect))
    else:
        parties.append(clause_orientation(lect))
    if lect["S2"]:
        parties.append(_clause_surveillance(lect))
    parties.append(NOTE_D_ECHELLE)
    parties.append(clause_aide_standing())
    texte = "\n".join(parties)
    bas = texte.lower()
    return {
        "texte": texte,
        "md5": hashlib.md5(texte.encode("utf-8")).hexdigest(),
        "nb_mots_interdits": sum(1 for m in MOTS_INTERDITS if m in bas)
        + sum(1 for m in core_q2.MOTS_INTERDITS_VERDICT if m in bas),
        "rien_a_fabriquer": calme != "",
        "nb_templates_cites": texte.count("> "),
        "suspendu": False,
    }


# ─────────────────────────────────────────────────────────────────────────────
# R9 — BRANCHEMENT PAS (VRAI Q5, héritages Q2 MESURÉS) + COUPLE (VRAI Q4)
#      + CROISEMENT RIO-01/02 (VRAI convergence_interdimensions)
# ─────────────────────────────────────────────────────────────────────────────
# Héritages cœur (RIO-06) balayés sur leurs valeurs réelles possibles :
#   er1/er2 : les 13 sommes de face E-R possibles / 3 (moyennes réelles) ;
#   cap : "AC" si CAP=1 sinon "PC" (le vrai arbre lit cap != "AC") ;
#   fe1/fe3/fe6 : les 8 combinaisons de forces réelles du cœur.
SOMMES_COEUR = tuple(range(3, 16))
CAP_CHOIX = ("PC", "AC")          # indexé par cap ∈ {0, 1}

def _tables_pas():
    """Tables pas_possibles par héritage Q2 MESURÉ (zone × label) —
    12 tables ; chaque table balaye les héritages cœur réels
    (13² er × 2 cap × 8 forces = 2 704 combinaisons) via le VRAI
    selectionner_pas. Retour : {(zone, label): {pas: source}}."""
    tables = {}
    for zone in ZONES:
        for label in LABELS_RC:
            tab = {}
            for e1 in SOMMES_COEUR:
                for e2 in SOMMES_COEUR:
                    for cap in (0, 1):
                        for f1 in (True, False):
                            for f3 in (True, False):
                                for f6 in (True, False):
                                    sel = core_q5.selectionner_pas({
                                        "inv_d_zone": zone,
                                        "rc_label": label,
                                        "cap": CAP_CHOIX[cap],
                                        "fe1_active": f1, "fe6_active": f6,
                                        "er1_moyenne": e1 / 3.0,
                                        "er2_moyenne": e2 / 3.0,
                                        "fe3_active": f3})
                                    tab.setdefault(sel["pas"],
                                                   sel["trace"]["source"])
            tables[(zone, label)] = tab
    return tables


def _tables_ci():
    """Tables de croisement RIO-01/02 par lecture mesurée (zone reçue ×
    label) — le VRAI convergence_interdimensions est appelé sur le
    balayage des héritages (score_A vif × ombre dominante — 4 classes
    réelles). Retour : {(zone_r, label): [4 dicts]}."""
    tables = {}
    for zone_r in ZONES:
        for label in LABELS_RC:
            lignes = []
            for sA_vif in (False, True):
                for ombre in (OMBRE_HORS_CLASSE, OMBRES_DOMINANTES[0]):
                    score_A = 3.3 if sA_vif else 2.0
                    conv = core_q2.convergence_interdimensions(
                        score_A, ombre, zone_r, label)
                    lignes.append({
                        "score_A_vif": sA_vif,
                        "ombre_dominante": ombre in OMBRES_DOMINANTES,
                        "applicable": conv["applicables"] > 0,
                        "index": conv["index"],
                        "prudence": conv["prudence"],
                        "checks": [c[0] for c in conv["checks"]],
                    })
            tables[(zone_r, label)] = lignes
    return tables


def _tables_couple():
    """Tables de configurations de couple par zone donnée MESURÉE (le
    VRAI configuration_devises reçoit la VRAIE zone de cette quête en
    inv_d_zone_A) — devises des deux partenaires (6³ × 6³ réels),
    er1 du cœur (2 classes réelles), boucle des bids (RIO-09) et zone
    du partenaire balayés. Retour : {zone_d: dict}."""
    patterns = list(core_q4.DEVISE_PATTERNS)
    tables = {}
    for zone_d in ZONES:
        configs = set()
        for dA1 in patterns:
            for dA2 in patterns:
                for dA3 in patterns:
                    dev_A = {"paroles": dA1, "temps": dA2, "contact": dA3}
                    for dB1 in patterns:
                        for dB2 in patterns:
                            for dB3 in patterns:
                                dev_B = {"paroles": dB1, "temps": dB2,
                                         "contact": dB3}
                                for er1_A in (2.9, 3.1):
                                    for boucle in (True, False):
                                        for zone_B in ZONES:
                                            configs.add(
                                                core_q4.configuration_devises(
                                                    dev_A, dev_B, er1_A, 3.0,
                                                    boucle, zone_d, zone_B))
        configs = sorted(configs)
        tables[zone_d] = {
            "zone_inval_donnee_mesuree": zone_d,
            "configurations_atteignables": configs,
            "nb_configurations": len(configs),
            "configurations_total": len(core_q4.CONFIG_LABELS),
        }
    return tables


# ─────────────────────────────────────────────────────────────────────────────
# F4 — FRAGMENT DE BILAN L8 (7 blocs) — junctions VRAIES q4/q5 + héritages
# ─────────────────────────────────────────────────────────────────────────────
def bilan_fragment(lect: dict, tables_pas: dict, tables_ci: dict,
                   tables_couple: dict) -> dict:
    """Contribution de RIO-07 au bilan d'ensemble (assemblage L8).

    7 blocs : position · forme · empreinte (croisement RIO-01/02) ·
    couple (RIO-09) · force · limites · palier/pas (RIO-10). Les blocs
    hérités balayent les valeurs réelles des quêtes amont — jamais
    devinés ; les blocs mesurés (cette quête) sont exacts.
    """
    zones, rc, boucle = lect["zones"], lect["rc"], lect["boucle"]
    zone_d = zones["donnee"]["zone"]
    zone_r = zones["recue"]["zone"]
    label = rc["label"]
    pas_tab = tables_pas[(zone_d, label)]
    ci_tab = tables_ci[(zone_r, label)]
    couple = tables_couple[zone_d]
    calmes = [z for z, ou in (("minimisation donnée", zone_d),
                              ("minimisation reçue", zone_r)) if ou == "ABSENT"]
    actifs = []
    if zone_d != "ABSENT":
        actifs.append("minimisation donnée " + zone_d.lower())
    if zone_r != "ABSENT":
        actifs.append("minimisation reçue " + zone_r.lower())
    if label in LABELS_ACTIFS:
        actifs.append("reproche-code " + label.lower())
    if boucle["active"]:
        actifs.append("boucle de réassurance active")
    force_parties = []
    if label == "FORMULATION ACQUISE":
        force_parties.append(
            "ta formulation est une assise — " + core_q2.TEMPLATES_REPROCHE_CODE[label])
    for nom, z in (("minimisation donnée", zone_d), ("minimisation reçue", zone_r)):
        if z == "ABSENT":
            force_parties.append(f"{nom} : zone calme — rien à fabriquer")
    if not force_parties:
        force_parties.append("aucune zone calme ce point-ci — terrain de "
                             "travail, pas un verdict")
    limites_parties = actifs if actifs else [
        "aucun signal actif — rien à fabriquer"]
    retest = core_q5.programmer_re_test("2026-01-01", semaines=8)
    fragment = {
        "bloc_1_position": {
            "invalidation_donnee": {"moyenne": zones["donnee"]["moyenne"],
                                     "zone": zone_d},
            "invalidation_recue": {"moyenne": zones["recue"]["moyenne"],
                                    "zone": zone_r},
            "reproche_code": {"moyenne": rc["moyenne"],
                               "formulation": rc["formulation"],
                               "label": label},
            "boucle": {"demande": boucle["demande"], "tenue": boucle["tenue"],
                        "active": boucle["active"],
                        "terrain_herite_RIO_01_02": boucle["terrain"]},
            "palier": lect["palier"],
            "echelle": "D-ÉCHELLE — seuils 3,00 du moteur, appliqués tels quels",
        },
        "bloc_2_forme": {
            "ecart_minimisation_donnee_recue": round(
                zones["donnee"]["moyenne"] - zones["recue"]["moyenne"], 2),
            "besoin_au_dessus_du_milieu": rc["moyenne"] >= core_q2.SEUIL_MID,
            "formulation_explicite": rc["formulation"] >= 3,
            "terrain_vif": boucle["terrain"],
        },
        "bloc_3_empreinte": {
            "source": ("RIO-01/02 — vrai convergence_interdimensions "
                       "(héritages score_A/label_ombre balayés, "
                       "S-EMO-Q2-1 consignée)"),
            "croisements": ci_tab,
        },
        "bloc_4_couple": {
            "source": "RIO-09 — vrai moteur émo-q4 (configuration_devises)",
            "apport_mesure": "zone d'invalidation donnée de A — MESURÉE ici",
            **couple,
        },
        "bloc_5_force": {
            "formulation_acquise": label == "FORMULATION ACQUISE",
            "zones_calmes": calmes if calmes else ["aucune zone calme"],
            "assises": force_parties,
        },
        "bloc_6_limites": {
            "signaux_actifs": limites_parties,
            "jamais_sanctionne": ("ce que tu reçois est toujours pris au "
                                   "sérieux — la zone reçue ne met jamais "
                                   "le répondant en 🟠/🔴"),
        },
        "bloc_7_palier_pas": {
            "palier": lect["palier"],
            "pas_possibles": pas_tab,
            "pas_labels": sorted({core_q5.PAS_LABELS[p] for p in pas_tab}),
            "heritages_q2_mesures": {"inv_d_zone": zone_d, "rc_label": label},
            "suivi_14_jours_sans_sanction": True,
            "retest": ("re-test RIO-07 proposé à 8 semaines — vrai "
                       "programmer_re_test émo-q5 : " + retest["message"][:60]),
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
