# -*- coding: utf-8 -*-
"""
WTC-EMO-Q4-R3 — COUCHE DE CORRECTION PHILOSOPHIQUE (fichier SUPPLÉMENTAIRE)
===========================================================================
RIO-09 « Nos deux langues » — rattrapage au gabarit universel §5.1-§5.4
du canon (demande fondateur, même ordre que RIO-01→08 : fichiers
SUPPLÉMENTAIRES, zéro modification de l'existant, exactitude des calculs).

RÈGLE ABSOLUE : ce module NE MODIFIE AUCUN moteur existant.
- Le vrai moteur de la quête reste `validation-emotionnelle/
  validation-emo-q4-r3/src/wtc_emo_q4_core.py` (R3 — moyennes par canal
  D-EMO-5, asymétrie interne des bids S-EMO-Q4-R2-2, CROISÉE testée avant
  DONNEUR S-EMO-Q4-R2-1) — importé tel quel, jamais recopié.
- Le vrai simulateur archivé est `wtc_emo_q4_simulator.py` (R3, seed 42,
  450 couples : 9 groupes × 50, config_vraie D-VÉRITÉ 9/9).
- Les junctions utilisent les VRAIS moteurs `validation-emo-q2-r1` (les
  zones/labels réels que RIO-07 mesure pour CHACUN des deux partenaires),
  `validation-emo-q5` (le pas du cœur, arbre 8 pas + suivi 14 j + re-test
  8 semaines). Les héritages cœur (er1 de chaque partenaire — RIO-06)
  sont balayés sur leurs classes réelles, jamais devinés.

CE QUE CETTE COUCHE AJOUTE (audit Task 163 : RIO-09 = 61 %, F2 15/25,
F3 6/25, F4 10→15/25 — F1 25 inchangé ; F2/F4 partent plus haut que les
autres quêtes parce que le croisement valide déjà des configurations
NOMMÉES — D-NOMENCLATURE 9 noms uniques, templates réels cités) :
- F2 : le palier de COUPLE 🟢🟠🔴 dérivé MÉCANIQUEMENT des VRAIES sorties
  (S1 = paire explosive du VRAI co_regulation — inclut FEU CROISÉ ;
  S2 = boucle asymétrique du VRAI boucle_bids ou configuration à
  convertir — CROISÉE/DONNEUR) + « QUAND DEMANDER DE L'AIDE » (version
  couple) + la doctrine du moteur appliquée : JAMAIS de croisement
  détaillé sur crise active — le vrai template FEU CROISÉ exige des
  protocoles d'apaisement AVANT tout dialogue.
- F3 : contenu des 3 paliers PAR CONFIGURATION RÉELLE (les 9 noms de la
  D-NOMENCLATURE → capitalisation 🟢 / module à deux 🟠 / orientation 🔴)
  + branchement quête « pas » pour CHACUN des deux partenaires (zones Q2
  mesurées par RIO-07, héritages balayés) + suivi 14 j sans sanction +
  re-test 8 semaines.
- F4 : fragment de bilan L8 à 7 blocs (niveau COUPLE) avec junctions
  réelles.

Chaque règle est PRÉ-ENREGISTRÉE et dérivée mécaniquement des sorties du
vrai moteur — zéro invention de mesure.

Règles pré-enregistrées :
- R1 (palier de couple) : 🔴 ssi le VRAI co_regulation retourne
  paire_explosive=True (les deux er1 ≥ 3,0 — le vrai seuil 3,0, PILE
  atteignable, inclusif, consigné) — couvre FEU CROISÉ (les deux
  explosifs + boucle) ; 🟠 ssi (boucle asymétrique du VRAI boucle_bids
  — écart interne ≥ 2 — OU configuration à convertir : CROISÉE (À
  CONVERTIR), DONNEUR NON CONVERTI (A/B)) sans 🔴 ; 🟢 sinon (LANGUE
  COMMUNE, LANGUE DORMANTE, ÉQUILIBRÉE MIXTE sans signal — « à explorer,
  pas à corriger » : template réel).
- R2 (S1) : paire explosive → orientation chaleureuse + apaisement avant
  tout dialogue (le vrai template FEU CROISÉ, cité mot pour mot).
- R3 (S2) : boucle asymétrique ou à convertir → module à deux + re-test
  8 semaines (le VRAI programmer_re_test de la quête pas).
- R4 (qualité avant sens) : le croisement ne lit QUE des moyennes par
  canal (D-EMO-5 — le vrai moteur réduit le bruit de √3) ; les bids ne
  sont lus que via leurs écarts internes |Δ| (prouvé par espion
  exhaustif 625) ; aucun gate RQS sur cet instrument — aucune suspension
  inventée ; score_A/label_ombre portés par le simulateur ne sont PAS lus
  par le vrai moteur (prouvé par espion) — consigné.
- R5 (anti-fabrication) : la configuration affichée est EXACTEMENT celle
  du VRAI configuration_devises (les 9 noms D-NOMENCLATURE, jamais
  d'autre) ; les templates cités sont les VRAIS (9 configs + 6 devises) ;
  JAMAIS de pourcentage de compatibilité ni de verdict d'être (les 9
  formulations interdites C3a du package, vérifiées) ; les deux
  partenaires confirment sur soi — jamais de blâme (C3b/C3c).
- R6 (symétrie) : la configuration est SYMÉTRIQUE par échange des
  partenaires via les paires miroirs archivées (DONNEUR A ⇔ B, MIXTE
  POURSUITE ⇔ RETRAIT) — vérifiée sur les 450 couples archivés ET sur
  toute l'énumération.
- R7 (vocabulaire écran, canon Partie 9) : aucun mot de la liste
  interdite ; D-CRISE non applicable à cet instrument (aucun construit
  d'auto-danger — consigné) ; la crise de COUPLE active (FEU CROISÉ) est
  traitée par la doctrine du vrai moteur : apaisement avant tout dialogue.
- R8 (D-SIM) : bandeau simulation sur chaque bloc écran.
- R9 (couplage réel) : le pas annoncé pour CHAQUE partenaire est celui du
  VRAI selectionner_pas (arbre INV > RC > CAP > FE1 > FE6 > ER1 > ER2 >
  FE3) — la zone Q2 de chaque partenaire est MESURÉE par RIO-07 (ce
  croisement la porte pour les deux) ; les autres héritages (labels,
  cap/forces, er) sont balayés sur leurs valeurs réelles, jamais devinés.
"""

from __future__ import annotations

import hashlib
import importlib.util
import itertools
import sys
from pathlib import Path

_PKG = Path(__file__).resolve().parents[1]           # …/validation-emo-q4-r3/correction-philosophique
_Q4 = _PKG.parent                                    # …/validation-emo-q4-r3
_EMO = _Q4.parent                                    # …/validation-emotionnelle
_WTC = _EMO.parent                                   # …/Wairyu thérapie couple


def _charge(nom: str, chemin: Path):
    spec = importlib.util.spec_from_file_location(nom, chemin)
    mod = importlib.util.module_from_spec(spec)
    sys.modules[nom] = mod
    spec.loader.exec_module(mod)
    return mod


core_q4 = _charge("wtc_emo_q4_core", _Q4 / "src" / "wtc_emo_q4_core.py")
core_q2 = _charge("wtc_emo_q2_core", _EMO / "validation-emo-q2-r1" / "src" / "wtc_emo_q2_core.py")
core_q5 = _charge("wtc_emo_q5_core", _EMO / "validation-emo-q5" / "src" / "wtc_emo_q5_core.py")

# Intégrité des moteurs chargés :
assert len(core_q4.CONFIG_LABELS) == 9 and len(core_q4.CANALS) == 3
assert len(core_q4.TEMPLATES_CONFIG) == 9
assert len(core_q4.TEMPLATES_DEVISES) == 6
assert len(core_q2.TEMPLATES_REPROCHE_CODE) == 4
assert len(core_q5.PAS_ORDER) == 8 and core_q5.SEUIL_CELEBRE == 10

# ─────────────────────────────────────────────────────────────────────────────
# CONSTANTES DE LA COUCHE (R1-R9)
# ─────────────────────────────────────────────────────────────────────────────
CONFIGS = tuple(core_q4.CONFIG_LABELS)
CANALS = tuple(core_q4.CANALS)
CONFIGS_A_CONVERTIR = ("CROISÉE (À CONVERTIR)", "DONNEUR NON CONVERTI (A)",
                       "DONNEUR NON CONVERTI (B)")
ZONES_Q2 = tuple(sorted(core_q2.TEMPLATES_INVALIDATION_DONNEE.keys()))
LABELS_RC_Q2 = tuple(sorted(core_q2.TEMPLATES_REPROCHE_CODE.keys()))
SOMMES_COEUR = tuple(range(3, 16))
CAP_CHOIX_PAS = ("PC", "AC")

# Bandes des moyennes par canal (m = s/3, s = 3..15 — 13 valeurs réelles) :
#   ≤ 2,5  (s ≤ 7 — 2,5 NON sur la grille, dist min 1/6)
#   (2,5 ; 3)  (s = 8)
#   [3 ; 4)  (s ∈ {9, 10, 11} — 3,00 PILE atteignable, consigné)
#   ≥ 4  (s ≥ 12 — 4,00 PILE atteignable, consigné)
BANDES_M = ("LEQ_25", "GT_25_LT_3", "GE_3_LT_4", "GE_4")
BANDE_NOM = {"LEQ_25": "≤ 2,5", "GT_25_LT_3": "(2,5 ; 3)",
             "GE_3_LT_4": "[3 ; 4)", "GE_4": "≥ 4"}


def bande_m(s: int) -> str:
    if s <= 7:
        return "LEQ_25"
    if s == 8:
        return "GT_25_LT_3"
    if s <= 11:
        return "GE_3_LT_4"
    return "GE_4"


MOTS_INTERDITS = (
    "pathologie", "diagnostic", "dépistage", "anxieux", "anxiété",
    "évitement", "évitant", "évitante", "désorganisé", "trouble",
    "syndrome", "désordre", "symptôme", "névrosisme", "narcissisme",
    "jalousie",
)
MOTS_VERDICT_C3A = (
    "compatibilité", "compatible", "pourcentage de", "score de couple",
    "tu es le problème", "tu es la cause", "c'est ta faute",
    "tu devrais", "tu dois changer",
)

BANDEAU_DSIM = ("[D-SIM] Lecture issue d'une simulation — la mécanique est "
                "validée, pas la prévalence clinique.")
PHRASE_ORIENTATION = ("le chemin le plus court est de ne pas porter ça "
                      "seul·e — l'orientation vers un professionnel de la "
                      "relation n'est pas un échec, c'est le pas qui compte "
                      "ici, à deux")
NOTE_APAISEMENT = ("Doctrine du moteur : jamais de croisement détaillé sur "
                   "crise active — l'apaisement vient avant tout dialogue.")
NOTE_BOUCLE = ("La boucle se lit à deux : ce que l'un donne et ce qu'il "
               "reçoit se comparent chez lui, jamais l'un contre l'autre.")
NOTE_D_EMO5 = ("Les langues se lisent en moyennes par canal (D-EMO-5) — "
               "le bruit des réponses isolées ne définit pas votre couple.")

PALIER_NOM = {"🟢": "Seul·e à deux — capitalisation",
              "🟠": "Module de couple — à deux, guidé",
              "🔴": "Avec un professionnel — orientation chaleureuse"}

# Contenu F3 PAR CONFIGURATION RÉELLE (les 9 noms D-NOMENCLATURE) :
EXERCICE_CONFIG = {
    "LANGUE COMMUNE":
        "🟢 À vous deux : capitalisez — un rituel fixe qui utilise votre "
        "langue commune (le canal qui marche) au moins une fois par jour.",
    "DONNEUR NON CONVERTI (A)":
        "🟢 À vous deux : un rituel de conversion par semaine — A donne, "
        "et vous notez ce qui arrive dans la devise de B. Une seule "
        "expérience, notée, sans enjeu.",
    "DONNEUR NON CONVERTI (B)":
        "🟢 À vous deux : un rituel de conversion par semaine — B donne, "
        "et vous notez ce qui arrive dans la devise de A. Une seule "
        "expérience, notée, sans enjeu.",
    "LANGUE DORMANTE":
        "🟢 À vous deux : une exploration sans enjeu — essayez une langue "
        "encore silencieuse (paroles, temps ou contact) une fois cette "
        "semaine, et notez ce qui bouge.",
    "CROISÉE (À CONVERTIR)":
        "🟢 À vous deux : le change croisé assumé — chacun nomme ce qu'il "
        "donne et ce qu'il aimerait recevoir ; une conversion par semaine.",
    "MIXTE POURSUITE":
        "🟢 À vous deux : la pause convenue — un mot pour demander une "
        "pause quand la boucle démarre, honoré sans discussion.",
    "MIXTE RETRAIT":
        "🟢 À vous deux : la pause convenue — un mot pour demander une "
        "pause quand la boucle démarre, honoré sans discussion.",
    "FEU CROISÉ":
        "🟢 À vous deux : un seul protocole d'apaisement, écrit à froid — "
        "ce qui se fait quand ça monte (pause, pièce séparée, retour à "
        "heure fixe). Rien d'autre tant que l'apaisement ne tient pas.",
    "ÉQUILIBRÉE MIXTE":
        "🟢 À vous deux : à explorer, pas à corriger — une conversation "
        "curieuse par semaine sur un canal, sans objectif.",
}
MODULE_CONFIG = {
    "CROISÉE (À CONVERTIR)":
        "🟠 À deux, guidé : le rituel de conversion à deux — chacun offre "
        "dans la devise de l'autre, une fois par semaine, avec un temps "
        "fixe pour dire ce que ça a fait.",
    "DONNEUR NON CONVERTI (A)":
        "🟠 À deux, guidé : la traduction à deux — B nomme ce qu'il "
        "reçoit vraiment du don de A ; A ajuste un canal, pas toute la "
        "personne.",
    "DONNEUR NON CONVERTI (B)":
        "🟠 À deux, guidé : la traduction à deux — A nomme ce qu'il "
        "reçoit vraiment du don de B ; B ajuste un canal, pas toute la "
        "personne.",
    "MIXTE POURSUITE":
        "🟠 À deux, guidé : le décodeur de la boucle — celui qui poursuit "
        "nomme le besoin derrière, celui qui se retire nomme le seuil ; "
        "un rituel de réassurance différée, écrit.",
    "MIXTE RETRAIT":
        "🟠 À deux, guidé : le décodeur de la boucle — celui qui poursuit "
        "nomme le besoin derrière, celui qui se retire nomme le seuil ; "
        "un rituel de réassurance différée, écrit.",
}
_MODULE_PAR_DEFAUT = (
    "🟠 À deux, guidé : le temps fixe de couple — un rituel hebdomadaire "
    "de 15 minutes où chaque partenaire nomme ce qu'il a donné et ce qu'il "
    "a reçu, chez lui, sans blâme.")


def palier_couple(config: str, paire_explosive: bool,
                  boucle_asym: bool) -> dict:
    """R1/R2/R3 — palier de COUPLE dérivé mécaniquement des VRAIES sorties."""
    s1 = bool(paire_explosive)
    s2 = (not s1) and (bool(boucle_asym) or config in CONFIGS_A_CONVERTIR)
    palier = "🔴" if s1 else ("🟠" if s2 else "🟢")
    return {"palier": palier, "palier_nom": PALIER_NOM[palier],
            "S1": s1, "S2": s2,
            "orientation_affichee": s1, "surveillance_affichee": s2}


def palier_independant(explosif_A: bool, explosif_B: bool,
                       ecart_A: int, ecart_B: int, config: str) -> dict:
    """COR2 — chemin INDÉPENDANT (entiers purs) : paire explosive ⇔
    les deux classes er1 (≥ 3,0) ; boucle ⇔ |Δ| ≥ 2 (entiers) ; mêmes
    règles de palier. Doit converger EXACTEMENT avec palier_couple()."""
    pe = explosif_A and explosif_B
    boucle = (abs(ecart_A) >= 2) or (abs(ecart_B) >= 2)
    s1 = pe
    s2 = (not s1) and (boucle or config in CONFIGS_A_CONVERTIR)
    palier = "🔴" if s1 else ("🟠" if s2 else "🟢")
    return {"palier": palier, "S1": s1, "S2": s2}


def clause_aide_standing() -> str:
    return ("QUAND DEMANDER DE L'AIDE (version couple) — seuils posés "
            "d'avance, les mêmes pour tous les couples : paire explosive "
            "(les deux cœurs lus explosifs, vrai seuil 3,0) → parler à un "
            "professionnel est proposé, et l'apaisement vient avant tout "
            "dialogue ; boucle poursuivre-retrait ou langues à convertir → "
            "un module de couple, à surveiller, re-test proposé à 8 "
            "semaines ; sinon → capitalisez ce qui marche déjà. Aucun "
            "score d'affinité affiché ici, jamais de verdict d'être — "
            "cette lecture décrit des mécanismes, pas des personnes.")


def bloc_ecran(config: str, co: dict, boucle: dict, inv_A: str,
               inv_B: str, pal: dict) -> dict:
    """Assemble le bloc écran complet RIO-09 — templates réels cités mot
    pour mot, configuration EXACTEMENT celle du vrai moteur."""
    parties = [BANDEAU_DSIM]
    parties.append(f"Vos deux langues se lisent : configuration {config}.")
    parties.append("> " + core_q4.TEMPLATES_CONFIG[config])
    parties.append(f"Co-régulation : cœur A "
                   f"{'explosif' if co['explosif_A'] else 'apaisé'} · cœur B "
                   f"{'explosif' if co['explosif_B'] else 'apaisé'}.")
    parties.append(
        "Boucle des bids : "
        + ("asymétrique — un de vous deux donne beaucoup plus qu'il ne "
           "reçoit, chez lui" if boucle["asymetrie"]
           else "équilibrée — ce que chacun donne est proche de ce qu'il "
                "reçoit, chez lui") + ".")
    if pal["S1"]:
        parties.append("CE QUE VOUS POUVEZ CHANGER — palier 🔴 "
                       f"({pal['palier_nom']}) :")
        parties.append("> " + core_q4.TEMPLATES_CONFIG["FEU CROISÉ"])
        parties.append("🔴 Avec un professionnel : " + NOTE_APAISEMENT
                       + " " + PHRASE_ORIENTATION[:1].upper()
                       + PHRASE_ORIENTATION[1:] + ".")
    else:
        parties.append(f"CE QUE VOUS POUVEZ CHANGER — palier {pal['palier']} "
                       f"({pal['palier_nom']}) :")
        parties.append(EXERCICE_CONFIG[config])
        if pal["palier"] == "🟠":
            parties.append(MODULE_CONFIG.get(config, _MODULE_PAR_DEFAUT))
            parties.append("À surveiller : re-test proposé à 8 semaines.")
    parties.append(NOTE_APAISEMENT)
    parties.append(NOTE_BOUCLE)
    parties.append(NOTE_D_EMO5)
    parties.append(clause_aide_standing())
    texte = "\n".join(parties)
    bas = texte.lower()
    return {
        "texte": texte,
        "md5": hashlib.md5(texte.encode("utf-8")).hexdigest(),
        "nb_mots_interdits": (sum(1 for m in MOTS_INTERDITS if m in bas)
                              + sum(1 for m in MOTS_VERDICT_C3A if m in bas)),
        "nb_templates_cites": texte.count("> "),
        "config": config,
    }


# ─────────────────────────────────────────────────────────────────────────────
# R9 — BRANCHEMENT PAS (VRAI Q5, zones Q2 MESURÉES par partenaire)
# ─────────────────────────────────────────────────────────────────────────────
def _tables_pas():
    """Tables pas_possibles par zone Q2 MESURÉE (RIO-07, par partenaire) —
    3 tables ; chaque table balaye les héritages réels (label 4 × cap 2 ×
    forces 8 × er 169 = 10 784) via le VRAI selectionner_pas. Les MÊMES
    tables servent aux deux partenaires (le vrai arbre est le même)."""
    tables = {}
    for zone in ZONES_Q2:
        tab = {}
        for label in LABELS_RC_Q2:
            for cap_i in (0, 1):
                for f1 in (True, False):
                    for f3 in (True, False):
                        for f6 in (True, False):
                            for e1 in SOMMES_COEUR:
                                for e2 in SOMMES_COEUR:
                                    sel = core_q5.selectionner_pas({
                                        "inv_d_zone": zone,
                                        "rc_label": label,
                                        "cap": CAP_CHOIX_PAS[cap_i],
                                        "fe1_active": f1, "fe6_active": f6,
                                        "er1_moyenne": e1 / 3.0,
                                        "er2_moyenne": e2 / 3.0,
                                        "fe3_active": f3})
                                    tab.setdefault(sel["pas"],
                                                   sel["trace"]["source"])
        tables[zone] = tab
    return tables


def _table_ecarts():
    """Table exhaustive des écarts du VRAI boucle_bids : les 625
    combinaisons brutes de bids → (ecart_A, ecart_B, asymetrie) — la
    preuve que le moteur ne lit que |Δ| (25 états)."""
    tab = {}
    for bd1, br1, bd2, br2 in itertools.product(range(1, 6), repeat=4):
        b = core_q4.boucle_bids(bd1, br1, bd2, br2)
        tab[(bd1, br1, bd2, br2)] = (b["ecart_A"], b["ecart_B"],
                                     b["asymetrie"])
    return tab


# ─────────────────────────────────────────────────────────────────────────────
# F4 — FRAGMENT DE BILAN L8 (7 blocs, niveau COUPLE)
# ─────────────────────────────────────────────────────────────────────────────
def bilan_fragment(config: str, co: dict, boucle: dict, inv_A: str,
                   inv_B: str, pal: dict, bandes: dict,
                   canaux_dominants: dict, tables_pas: dict,
                   table_ecarts: dict) -> dict:
    """Contribution de RIO-09 au bilan d'ensemble (assemblage L8) —
    niveau COUPLE : le croisement lui-même est le bloc central."""
    pas_A = tables_pas[inv_A]
    pas_B = tables_pas[inv_B]
    force_parties = (
        ["> " + core_q4.TEMPLATES_CONFIG[config]]
        if pal["palier"] == "🟢"
        else ["aucune force de couple visible ce point-ci — terrain de "
              "travail, pas un verdict"])
    limites = []
    if boucle["asymetrie"]:
        limites.append("boucle asymétrique (écart interne ≥ 2 chez au "
                       "moins un partenaire)")
    if config in CONFIGS_A_CONVERTIR:
        limites.append("langues à convertir — " + config.lower())
    if co["paire_explosive"]:
        limites.append("paire explosive — apaisement avant tout dialogue")
    if not limites:
        limites.append("aucun signal de couple actif — rien à fabriquer")
    retest = core_q5.programmer_re_test("2026-01-01", semaines=8)
    fragment = {
        "bloc_1_position": {
            "configuration": config,
            "co_regulation": {"explosif_A": co["explosif_A"],
                               "explosif_B": co["explosif_B"],
                               "paire_explosive": co["paire_explosive"]},
            "boucle": {"asymetrie": boucle["asymetrie"],
                        "ecart_A": boucle["ecart_A"],
                        "ecart_B": boucle["ecart_B"]},
            "zones_invalidation": {"A": inv_A, "B": inv_B},
            "moyennes_par_canal": bandes,
            "canaux_dominants": canaux_dominants,
            "echelle": "D-EMO-5 — moyennes par canal (bruit réduit de √3)",
        },
        "bloc_2_forme": {
            "ecarts_bids_possibles": {
                f"(|ΔA|={a}, |ΔB|={b})": {
                    "asymetrie": v[2]}
                for (a, b), v in sorted(
                    {(k[0] - 0, k[1] - 0): v for k, v in
                     _ecarts_uniques(table_ecarts).items()}.items())},
            "symetrie": "paires miroirs archivées : DONNEUR A ⇔ B · "
                        "MIXTE POURSUITE ⇔ RETRAIT",
        },
        "bloc_3_empreinte": {
            "source": ("RIO-07 (zones Q2 de chaque partenaire — mesurées) "
                       "· RIO-06 (classes er1 — balayage, seuil 3,0 PILE "
                       "inclusif consigné)"),
            "zones_Q2": {"A": inv_A, "B": inv_B},
            "heritages_balayes": True,
        },
        "bloc_4_couple": {
            "source": "LE croisement lui-même — vrai moteur émo-q4-r3",
            "template_config": core_q4.TEMPLATES_CONFIG[config],
            "doctrine_crise_active": NOTE_APAISEMENT if
            co["paire_explosive"] else
            "non applicable — pas de crise active (paire non explosive)",
        },
        "bloc_5_force": {
            "statut": "VISIBLE" if pal["palier"] == "🟢" else "EN TRAVAIL",
            "assises": force_parties,
        },
        "bloc_6_limites": {
            "signaux": limites,
            "jamais": "jamais de pourcentage de compatibilité, jamais de "
                      "blâme — les deux partenaires confirment sur soi",
        },
        "bloc_7_palier_pas": {
            "palier": pal["palier"],
            "pas_possibles_par_partenaire": {"A": pas_A, "B": pas_B},
            "pas_labels": sorted({core_q5.PAS_LABELS[p] for p in pas_A}
                                 | {core_q5.PAS_LABELS[p] for p in pas_B}),
            "suivi_14_jours_sans_sanction": True,
            "retest": ("re-test RIO-09 proposé à 8 semaines — vrai "
                       "programmer_re_test émo-q5 : " + retest["message"][:60]),
        },
    }
    fragment["_complet"] = all(
        v not in (None, "", [], {}) for v in _valeurs_feuilles(fragment)
    )
    return fragment


def _ecarts_uniques(table_ecarts: dict) -> dict:
    vu = {}
    for (bd1, br1, bd2, br2), v in table_ecarts.items():
        cle = (abs(bd1 - br1), abs(bd2 - br2))
        vu.setdefault(cle, v)
    return vu


def _valeurs_feuilles(obj):
    if isinstance(obj, dict):
        for v in obj.values():
            yield from _valeurs_feuilles(v)
    elif isinstance(obj, (list, tuple)):
        for v in obj:
            yield from _valeurs_feuilles(v)
    else:
        yield obj
