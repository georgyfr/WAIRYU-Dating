# -*- coding: utf-8 -*-
"""
WTC-EMO-Q3-R1 — COUCHE DE CORRECTION PHILOSOPHIQUE (fichier SUPPLÉMENTAIRE)
===========================================================================
RIO-08 « Ce que mon cœur sait faire » — rattrapage au gabarit universel
§5.1-§5.4 du canon (demande fondateur, même ordre que RIO-01/02/03/06/07 :
fichiers SUPPLÉMENTAIRES, zéro modification de l'existant, exactitude des
calculs).

RÈGLE ABSOLUE : ce module NE MODIFIE AUCUN moteur existant.
- Le vrai moteur de la quête reste `validation-emotionnelle/
  validation-emo-q3-r1/src/wtc_emo_q3_core.py` (M1 — D-DENSITÉ
  uniformisée : toutes les forces à 2 voies max, arbitrage S-EMO-Q3-2
  confirmé — C2 = 100 %, 0 désaccord moteur/simulateur sur 475 profils) —
  importé tel quel, jamais recopié.
- Le vrai simulateur archivé est `wtc_emo_q3_simulator.py` (R1, seed 42,
  475 profils : H1 120 · H2 100 · H3 100 · H4 80 · SANS_PREUVE 40 ·
  SURCHARGE 20 · CAP_NON_AC 15) — utilisé par le pipeline de preuve pour
  le re-score bit-exact.
- Les junctions utilisent les VRAIS moteurs `validation-emo-q1`
  (les VRAIS seuils du cœur 3,5/2,5 pour le plancher hérité — RIO-06),
  `validation-emo-q4` (croisement à deux, 9 configurations — RIO-09) et
  `validation-emo-q5` (le pas du cœur, arbre 8 pas + suivi 14 j +
  re-test 8 semaines — RIO-10). Les héritages Q2 (inv_d_zone, rc_label)
  sont MESURÉS par RIO-07 (boucle fermée) — balayés ici sur leurs valeurs
  réelles, jamais devinés.

CE QUE CETTE COUCHE AJOUTE (audit Task 163 : RIO-08 = 55 %, F2 12/25,
F3 8/25, F4 10/25 — F1 25 inchangé ; le F3 part de 8 parce que l'affichage
des forces F-E1 à F-E6 est déjà validé P1 par le critère C5 du package —
il est PRÉSERVÉ tel quel) :
- F2 : le palier 🟢🟠🔴 PLANCHER HÉRITÉ (le VRAI rang des faces E-R1/E-R3
  via les VRAIS seuils du cœur 3,5/2,5 — la même lecture de gravité que
  RIO-06) + « QUAND DEMANDER DE L'AIDE » (S1 = plancher 🔴 ; S2 = plancher
  🟠 ou cœur SILENCIEUX — re-test 8 semaines) + plancher PARTIEL consigné
  (la face E-R2 n'est pas portée par ce moteur — la vraie gravité de la
  dimension peut être plus haute, jamais plus basse : monotonie du max).
- F3 : contenu des 3 paliers (exercices 🟢 de capitalisation par force
  réelle, modules 🟠 à deux, orientation 🔴 phrase canon) + branchement
  quête « pas » sur le VRAI selectionner_pas (cap et forces retenues
  MESURÉES par cette quête, héritages Q2/Q1 balayés) + suivi 14 j sans
  sanction + re-test 8 semaines.
- F4 : fragment de bilan L8 à 7 blocs avec junctions réelles.

Chaque règle ci-dessous est PRÉ-ENREGISTRÉE (écrite avant tout calcul) et
dérivée MÉCANIQUEMENT des sorties du vrai moteur — zéro invention de
mesure.

Règles pré-enregistrées :
- R1 (palier plancher) : rang de face via les VRAIS seuils du cœur
  émotionnel — Forte = moyenne ≥ 3,5 (SEUIL_DOMINANCE) ; Vive > 2,5
  (au-dessus de SEUIL_PACIFIQUE_E_R1) ; Tranquille ≥ 1,5 (borne basse
  D-STD posée par la couche RIO-06, symétrique, consignée) ; Discrète <
  1,5. rang ∈ {0,1,2,3} ; rang_plancher = max(rang E-R1 hérité, rang E-R3
  hérité) — les DEUX faces que ce moteur porte ; 🟢 si rang ≤ 1 · 🟠 si
  = 2 · 🔴 si = 3 (canon §5.4, max-niveau). PLANCHER PARTIEL consigné :
  la face E-R2 (le mur) n'entre pas dans le moteur de cette quête — la
  vraie gravité de la dimension peut être plus haute, JAMAIS plus basse
  (monotonie du max — consignée à l'écran et au bilan).
- R2 (seuil d'aide S1) : plancher 🔴 (une face héritée lue Forte —
  dominance nette du cœur) → orientation chaleureuse affichée (« le
  chemin le plus court, pas un échec »), avec la mention honnête
  d'héritage (gravité lue par RIO-06, borne basse ici).
- R3 (seuil d'aide S2) : plancher 🟠 sans 🔴 OU cœur SILENCIEUSE (0 force
  retenue — « c'est un constat, pas un défaut » : template réel) → « à
  surveiller » + re-test 8 semaines (le VRAI programmer_re_test de la
  quête pas).
- R4 (qualité avant sens) : le journal n'est JAMAIS sanctionné — les 4
  statuts du VRAI statut_journal (NON_RENSEIGNÉ · PARTIEL · SILENCIEUX
  [N ≥ 5] · ACTIF) sont des statuts-information ; aucun gate RQS sur cet
  instrument (celui du cœur appartient à RIO-06) — aucune suspension
  inventée. D-ÉCHELLE (seuils entiers 2/3/4 de l'échelle C) est appliquée
  par le moteur lui-même, sans retouche.
- R5 (anti-fabrication §5.5 — LA doctrine de cette quête) : le positif
  n'est JAMAIS généré — il est sélectionné dans la banque fermée de 6
  forces par le VRAI forces_emo (règle des 2 max par densité, tie-break
  ordre de banque) ; SILENCIEUSE = EXACTEMENT le statut du vrai moteur
  (0 force active) — jamais fabriquée ; les forces affichées sont
  EXACTEMENT celles retenues (les exclues de densité sont tracées et
  jamais affichées — « elles s'afficheront au fil du parcours ») ; la
  garde du VRAI coherence_cap_forces est vérifiée sur chaque lecture
  (F-E3 — le cœur qui célèbre — jamais active si CAP ≠ AC : « la tiédeur
  ne fabrique pas de célébration »).
- R6 (exclues tracées) : exclue de densité → jamais affichée comme force,
  toujours tracée comme existante.
- R7 (vocabulaire écran, canon Partie 9) : aucun mot de la liste
  interdite dans tout texte affiché ; D-CRISE non applicable à cet
  instrument (il ne mesure aucun construit d'auto-danger — consigné ; le
  filet de l'app reste porté par RIO-02 côté attachement).
- R8 (D-SIM) : bandeau simulation sur chaque bloc écran.
- R9 (couplage réel) : le pas annoncé est celui du VRAI moteur
  émotionnel Q5 (arbre INV > RC > CAP > FE1 > FE6 > ER1 > ER2 > FE3).
  Les héritages MESURÉS par cette quête : cap (le vrai type de
  capitalisation) et fe1/fe3/fe6 (les forces RETENUES — ce qui s'affiche ;
  les exclues de densité redeviennent éligibles au fil du parcours —
  consigné). Les héritages Q2 (inv_d_zone, rc_label — RIO-07 les mesure)
  et er1/er2 (le cœur — RIO-06) sont balayés sur leurs valeurs réelles,
  jamais devinés.
"""

from __future__ import annotations

import hashlib
import importlib.util
import sys
from pathlib import Path

# ─────────────────────────────────────────────────────────────────────────────
# CHARGEMENT DES VRAIS MOTEURS (jamais recopiés, jamais modifiés)
# ─────────────────────────────────────────────────────────────────────────────
_PKG = Path(__file__).resolve().parents[1]           # …/validation-emo-q3-r1/correction-philosophique
_Q3 = _PKG.parent                                    # …/validation-emo-q3-r1
_EMO = _Q3.parent                                    # …/validation-emotionnelle
_WTC = _EMO.parent                                   # …/Wairyu thérapie couple


def _charge(nom: str, chemin: Path):
    spec = importlib.util.spec_from_file_location(nom, chemin)
    mod = importlib.util.module_from_spec(spec)
    sys.modules[nom] = mod
    spec.loader.exec_module(mod)
    return mod


# Le VRAI moteur de la quête (R1 — M1 : D-DENSITÉ uniformisée, C2 100 %).
# Le VRAI simulateur (seed 42, 475 profils) est chargé par le pipeline.
core_q3 = _charge("wtc_emo_q3_core", _Q3 / "src" / "wtc_emo_q3_core.py")
core_q1 = _charge("wtc_emo_q1_core", _EMO / "validation-emo-q1" / "src" / "wtc_emo_q1_core.py")
core_q2 = _charge("wtc_emo_q2_core", _EMO / "validation-emo-q2-r1" / "src" / "wtc_emo_q2_core.py")
core_q4 = _charge("wtc_emo_q4_core", _EMO / "validation-emo-q4" / "src" / "wtc_emo_q4_core.py")
core_q5 = _charge("wtc_emo_q5_core", _EMO / "validation-emo-q5" / "src" / "wtc_emo_q5_core.py")

# Vérification d'intégrité des moteurs chargés (ce sont bien les vrais) :
assert len(core_q3.FORCE_ORDER) == 6 and len(core_q3.CAP_TYPES) == 4
assert len(core_q3.TEMPLATES) == 7                    # 6 forces + SILENCIEUSE
assert core_q3.verifier_templates() == []
assert core_q1.SEUIL_DOMINANCE == 3.5 and core_q1.SEUIL_PACIFIQUE_E_R1 == 2.5
assert len(core_q2.TEMPLATES_REPROCHE_CODE) == 4      # les 4 labels réels Q2
assert len(core_q4.CONFIG_LABELS) == 9 and len(core_q4.CANALS) == 3
assert len(core_q5.PAS_ORDER) == 8 and len(core_q5.TEMPLATES_PAS) == 8
assert core_q5.SEUIL_CELEBRE == 10 and core_q5.SEUIL_AJUSTEMENT == 6

# ─────────────────────────────────────────────────────────────────────────────
# CONSTANTES DE LA COUCHE (R1-R9)
# ─────────────────────────────────────────────────────────────────────────────
FORCES = tuple(core_q3.FORCE_ORDER)                   # F-E1 … F-E6
CAP_TYPES = tuple(core_q3.CAP_TYPES)                  # AC · PC · AD · PD

RANG_NIVEAU = {"Discrète": 0, "Tranquille": 1, "Vive": 2, "Forte": 3}
NIVEAU_DE_RANG = {v: k for k, v in RANG_NIVEAU.items()}
PALIER_DE_RANG = {0: "🟢", 1: "🟢", 2: "🟠", 3: "🔴"}
PALIER_NOM = {"🟢": "Seul·e — exercice maison", "🟠": "À deux — module de couple",
              "🔴": "Avec un professionnel — orientation chaleureuse"}

# Borne basse D-STD (posée par la couche RIO-06, symétrique — consignée) :
SEUIL_BAS_DISCRETE = 1.5

# Bornes entières de la grille des moyennes héritées (s = 3..15, m = s/3) :
#   Discrète  s ≤ 4   (< 1,5 — 4,5 hors grille)      rang 0
#   Tranquille 5 ≤ s ≤ 7  (≤ 2,5 — 7,5 hors grille)  rang 1
#   Vive      8 ≤ s ≤ 10 (< 3,5 — 10,5 hors grille)  rang 2
#   Forte     s ≥ 11  (≥ 3,5)                        rang 3
# Aucun seuil du cœur (1,5 / 2,5 / 3,5) n'est atteignable pile sur la
# grille (dist min 1/6) — 0 borne pile (COR3).
SEUIL_DISCRETE_ENTIER = 4     # s ≤ 4 → Discrète
SEUIL_TRANQUILLE_ENTIER = 7   # 5-7 → Tranquille (er ≤ 2,5 du moteur)
SEUIL_VIVE_ENTIER = 10        # 8-10 → Vive

MOTS_INTERDITS = (
    "pathologie", "diagnostic", "dépistage", "anxieux", "anxiété",
    "évitement", "évitant", "évitante", "désorganisé", "trouble",
    "syndrome", "désordre", "symptôme", "névrosisme", "narcissisme",
    "jalousie",
)

BANDEAU_DSIM = ("[D-SIM] Lecture issue d'une simulation — la mécanique est "
                "validée, pas la prévalence clinique.")

PHRASE_ORIENTATION = ("le chemin le plus court est de ne pas la porter "
                      "seul·e — l'orientation vers un professionnel de la "
                      "relation n'est pas un échec, c'est le pas qui compte ici")

NOTE_PLANCHER = ("Gravité lue en plancher hérité (RIO-06 — les faces de ta "
                 "météo intérieure, mêmes seuils du cœur) : c'est une borne "
                 "basse — la vraie gravité de la dimension peut être plus "
                 "haute, jamais plus basse.")

NOTE_JOURNAL = ("Ton journal est une information, jamais une sanction — "
                "quatre statuts honnêtes (non renseigné · partiel · "
                "silencieux · actif), aucun n'est une faute.")

# Héritages RIO-07 (mesurés là-bas) — balayage des VALEURS RÉELLES que le
# vrai moteur émo-q2 produit (les 3 zones de `zones_invalidation` et les
# 4 labels de `reproche_code` — clés des VRAIS templates) :
ZONES_Q2 = tuple(sorted(core_q2.TEMPLATES_INVALIDATION_DONNEE.keys()))
LABELS_RC_Q2 = tuple(sorted(core_q2.TEMPLATES_REPROCHE_CODE.keys()))

# Héritages cœur (RIO-06) : les 13 sommes de face E-R possibles / 3 :
SOMMES_COEUR = tuple(range(3, 16))
CAP_CHOIX_PAS = ("PC", "AC")          # indexé par cap ∈ {0, 1} pour l'arbre


# ─────────────────────────────────────────────────────────────────────────────
# R1/R2/R3 — PALIER PLANCHER HÉRITÉ (VRAIS seuils du cœur) + SEUILS D'AIDE
# ─────────────────────────────────────────────────────────────────────────────
def niveau_face(er_m: float) -> str:
    """R1 — niveau d'une face héritée via les VRAIS seuils du cœur.

    Forte ≥ 3,5 (SEUIL_DOMINANCE) · Vive > 2,5 (au-dessus de
    SEUIL_PACIFIQUE_E_R1) · Tranquille ≥ 1,5 (SEUIL_BAS_DISCRETE, D-STD) ·
    Discrète < 1,5.
    """
    if er_m >= core_q1.SEUIL_DOMINANCE:
        return "Forte"
    if er_m > core_q1.SEUIL_PACIFIQUE_E_R1:
        return "Vive"
    if er_m >= SEUIL_BAS_DISCRETE:
        return "Tranquille"
    return "Discrète"


def palier_plancher(er1_m: float, er3_m: float) -> dict:
    """R1/R2/R3 — palier plancher (max-niveau sur les DEUX faces que ce
    moteur porte) + seuils S1/S2. PLANCHER PARTIEL consigné (E-R2 absente
    — borne basse)."""
    niveaux = {"E-R1": niveau_face(er1_m), "E-R3": niveau_face(er3_m)}
    rangs = {f: RANG_NIVEAU[n] for f, n in niveaux.items()}
    rang_plancher = max(rangs.values())
    palier = PALIER_DE_RANG[rang_plancher]
    return {
        "niveaux": niveaux, "rangs": rangs,
        "rang_plancher": rang_plancher,
        "palier": palier, "palier_nom": PALIER_NOM[palier],
        "S1": palier == "🔴", "S2": palier == "🟠",
        "plancher_partiel": True,
    }


def palier_independant(s1: int, s3: int) -> dict:
    """COR2 — chemin de calcul INDÉPENDANT (entiers purs, zéro float).

    Rangs depuis les SOMMES brutes (moyenne = s/3, seuils entiers :
    Forte ⇔ s ≥ 11 car 3,5 × 3 = 10,5 ; Vive ⇔ 8 ≤ s ≤ 10 ; Tranquille
    ⇔ 5 ≤ s ≤ 7 ; Discrète ⇔ s ≤ 4). Doit converger EXACTEMENT avec
    palier_plancher() (VRAIS seuils du cœur).
    """
    def rang(s: int) -> int:
        if s >= 11:
            return 3
        if s >= 8:
            return 2
        if s >= 5:
            return 1
        return 0

    rangs = {"E-R1": rang(s1), "E-R3": rang(s3)}
    rang_plancher = max(rangs.values())
    return {"rangs": rangs, "rang_plancher": rang_plancher,
            "palier": PALIER_DE_RANG[rang_plancher],
            "S1": rang_plancher == 3, "S2": rang_plancher == 2}


# ─────────────────────────────────────────────────────────────────────────────
# R5/R6/R7/R8 — TEXTES ÉCRAN (templates réels cités mot pour mot)
# ─────────────────────────────────────────────────────────────────────────────
# F3 — exercices maison 🟢 (capitalisation par force réelle — la force
# retenue est le vrai sélecteur) :
_EXERCICE_FORCE = {
    "F-E1": "un moment d'écoute par jour : laisser l'autre finir, répéter "
            "ce que tu as entendu avant de répondre",
    "F-E2": "une détente provoquée par jour : baisser le ton une fois "
            "avant que ça ne monte",
    "F-E3": "une bonne nouvelle célébrée par jour : une question de plus "
            "(« raconte, c'était comment ? »)",
    "F-E4": "un besoin formulé clairement par jour : une phrase qui "
            "commence par « j'aimerais »",
    "F-E5": "une traversée notée par jour : la tempête passée, une ligne "
            "sur ce qui a tenu",
    "F-E6": "un don dans la devise de l'autre cette semaine : paroles, "
            "temps ou contact — le canal de l'autre, pas le tien",
}
_EXERCICE_SILENCIEUSE = (
    "🟢 À ta portée, seul·e : tenir le journal de ton cœur — une ligne par "
    "jour (ce que tu as donné, ce que tu as reçu, ce qui a tenu). La "
    "preuve vient en écrivant, elle ne s'invente pas.")


def _clause_exercice(forces_retenues: list, silencieuse: bool) -> str:
    """F3 — contenu du palier 🟢 (capitalisation par force réelle)."""
    if silencieuse or not forces_retenues:
        return _EXERCICE_SILENCIEUSE
    morceaux = []
    for f in forces_retenues:
        morceaux.append("🟢 À ta portée, seul·e : " + _EXERCICE_FORCE[f] + ".")
    return " ".join(morceaux)


def _clause_module(forces_retenues: list, silencieuse: bool) -> str:
    """F3 — contenu du palier 🟠 : module de couple par force dominante."""
    modules = {
        "F-E1": ("🟠 À deux : l'écoute en miroir — l'un partage, l'autre "
                 "répète avant de répondre. 15 minutes par semaine."),
        "F-E2": ("🟠 À deux : le signal d'apaisement — un mot convenu pour "
                 "poser une pause avant la montée."),
        "F-E3": ("🟠 À deux : le rituel des bonnes nouvelles — chaque soir, "
                 "une bonne nouvelle de l'un célébrée par l'autre."),
        "F-E4": ("🟠 À deux : le temps des demandes — ce qui est demandé "
                 "clairement peut être répondu clairement."),
        "F-E5": ("🟠 À deux : le débriefing des tempêtes — ce qui a tenu, "
                 "dit à voix haute, une fois par semaine."),
        "F-E6": ("🟠 À deux : le change croisé — chacun offre dans la "
                 "devise de l'autre, une fois par semaine."),
    }
    if silencieuse or not forces_retenues:
        return ("🟠 À deux : le temps du journal partagé — chacun lit une "
                "ligne de son carnet, sans commentaire. La preuve se "
                "construit à deux aussi.")
    return " ".join(modules[f] for f in forces_retenues)


def clause_orientation(pal: dict) -> str:
    return ("🔴 Avec un professionnel : ta météo héritée est lue Forte "
            "(plancher RIO-06 — une face de ton cœur est dominante). "
            + PHRASE_ORIENTATION[:1].upper() + PHRASE_ORIENTATION[1:] + ".")


def _clause_surveillance(pal: dict, silencieuse: bool) -> str:
    if silencieuse:
        return ("Ton cœur est discret pour l'instant — c'est un constat, "
                "pas un défaut. À surveiller doucement, re-test proposé à "
                "8 semaines.")
    return ("Seuil approché : ta météo héritée est lue Vive (plancher "
            "RIO-06) — active sans être dominante. À surveiller, re-test "
            "proposé à 8 semaines.")


def _clause_seuil_atteint(pal: dict) -> str:
    return ("Seuil atteint : ta météo héritée est lue Forte (plancher "
            "RIO-06) — l'orientation est proposée.")


def clause_aide_standing() -> str:
    return ("QUAND DEMANDER DE L'AIDE — seuils posés d'avance, les mêmes "
            "pour tout le monde : une face héritée de ta météo lue Forte "
            "(plancher RIO-06, borne basse) → parler à un professionnel "
            "est proposé ; une face lue Vive sans aucune Forte, ou un cœur "
            "encore silencieux → à surveiller, re-test proposé à 8 "
            "semaines ; le journal reste une information, jamais une "
            "sanction ; et ce que cette quête ne fabrique jamais : une "
            "force que les preuves ne montrent pas.")


def bloc_ecran(forces_result: dict, cap: str, statut_j: str,
               pal: dict) -> dict:
    """Assemble le bloc écran complet RIO-08 (toutes les clauses sont
    déterminées mécaniquement par les sorties du vrai moteur).

    R5 — les forces affichées sont EXACTEMENT celles retenues par le VRAI
    forces_emo ; SILENCIEUSE = exactement le statut du vrai moteur ; les
    exclues de densité sont tracées, jamais affichées comme forces.
    """
    forces = list(forces_result["forces"])
    silencieuse = bool(forces_result["silencieuse"])
    exclues = list(forces_result["exclues"])
    parties = [BANDEAU_DSIM]
    if silencieuse:
        parties.append("> " + core_q3.TEMPLATES["SILENCIEUSE"])
        parties.append("Terrain de travail, pas un verdict : ce que les "
                       "preuves ne montrent pas encore, la suite du "
                       "parcours servira aussi à le faire apparaître — "
                       "rien n'est fabriqué ici.")
    else:
        parties.append("Ce que ton cœur sait faire se lit — "
                       f"{len(forces)} force(s) retenue(s) sur les preuves "
                       "réelles :")
        for f in forces:
            parties.append("> " + core_q3.TEMPLATES[f])
        if exclues:
            parties.append("D'autres forces existent aussi — elles "
                           "s'afficheront au fil du parcours. (Tracées, "
                           "jamais perdues.)")
    parties.append(f"CE QUE TU PEUX CHANGER — palier {pal['palier']} "
                   f"({pal['palier_nom']}) :")
    parties.append(_clause_exercice(forces, silencieuse))
    if pal["palier"] == "🟠":
        parties.append(_clause_module(forces, silencieuse))
    if pal["S1"]:
        parties.append(_clause_seuil_atteint(pal))
        parties.append(clause_orientation(pal))
    if pal["S2"] and not pal["S1"]:
        parties.append(_clause_surveillance(pal, silencieuse))
    if silencieuse and not (pal["S1"] or pal["S2"]):
        parties.append(_clause_surveillance(pal, silencieuse))
    parties.append(NOTE_PLANCHER)
    parties.append(NOTE_JOURNAL)
    parties.append(clause_aide_standing())
    texte = "\n".join(parties)
    bas = texte.lower()
    return {
        "texte": texte,
        "md5": hashlib.md5(texte.encode("utf-8")).hexdigest(),
        "nb_mots_interdits": sum(1 for m in MOTS_INTERDITS if m in bas),
        "nb_templates_cites": texte.count("> "),
        "silencieuse": silencieuse,
        "cap": cap, "statut_journal": statut_j,
    }


# ─────────────────────────────────────────────────────────────────────────────
# R9 — BRANCHEMENT PAS (VRAI Q5, cap + forces MESURÉS) + COUPLE (VRAI Q4)
# ─────────────────────────────────────────────────────────────────────────────
def _tables_pas():
    """Tables pas_possibles par état MESURÉ de cette quête (cap × fe1 ×
    fe3 × fe6 — les forces RETENUES) — 4 × 8 = 32 tables ; chaque table
    balaye les héritages réels (zone Q2 3 × label 4 × er1 13 × er2 13 =
    2 028) via le VRAI selectionner_pas. Retour : {(cap, f1, f3, f6):
    {pas: source}}."""
    tables = {}
    for cap_i in (0, 1):
        for f1 in (True, False):
            for f3 in (True, False):
                for f6 in (True, False):
                    tab = {}
                    for zone in ZONES_Q2:
                        for label in LABELS_RC_Q2:
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
                    tables[(cap_i, f1, f3, f6)] = tab
    return tables


def _tables_couple():
    """Tables de configurations de couple par (classe er1 du cœur × zone
    Q2 mesurée par RIO-07) — héritages balayés sur valeurs réelles ;
    devises des deux partenaires (6³ × 6³), boucle des bids (RIO-09) et
    zone du partenaire balayés ; le VRAI co_regulation lit er1 ≥ 3,0
    (borne inclusive — 3,00 PILE atteignable par la somme cœur 9,
    consignée). Retour : {(classe_er1, zone_d): dict}."""
    patterns = list(core_q4.DEVISE_PATTERNS)
    reps = {"bas": 8 / 3.0, "pile": 9 / 3.0, "haut": 10 / 3.0}
    tables = {}
    for classe, er1_A in reps.items():
        for zone_d in ZONES_Q2:
            configs = set()
            for dA in patterns:
                for dB in patterns:
                    for dC in patterns:
                        dev_A = {"paroles": dA, "temps": dB, "contact": dC}
                        for dB1 in patterns:
                            for dB2 in patterns:
                                for dB3 in patterns:
                                    dev_B = {"paroles": dB1, "temps": dB2,
                                             "contact": dB3}
                                    for boucle in (True, False):
                                        for zone_B in ZONES_Q2:
                                            configs.add(
                                                core_q4.configuration_devises(
                                                    dev_A, dev_B, er1_A, 3.0,
                                                    boucle, zone_d, zone_B))
            configs = sorted(configs)
            tables[(classe, zone_d)] = {
                "er1_classe": classe,
                "zone_inval_donnee_A": zone_d,
                "configurations_atteignables": configs,
                "nb_configurations": len(configs),
                "configurations_total": len(core_q4.CONFIG_LABELS),
            }
    return tables


def classe_er1(er_m: float) -> str:
    """Classe de co-régulation de la face E-R1 (vrai seuil 3,0) :
    « bas » < 3,0 · « pile » = 3,00 exact (somme cœur 9 — consigné) ·
    « haut » > 3,0. Comparaison float EXACTE (les valeurs héritées sont
    les vraies moyennes du cœur — la grille donne 9/3 = 3,0 pile)."""
    if er_m < 3.0:
        return "bas"
    if er_m == 3.0:
        return "pile"
    return "haut"


# ─────────────────────────────────────────────────────────────────────────────
# F4 — FRAGMENT DE BILAN L8 (7 blocs) — junctions VRAIES q4/q5 + héritages
# ─────────────────────────────────────────────────────────────────────────────
def bilan_fragment(forces_result: dict, cap: str, statut_j: str, pal: dict,
                   cA: int, cB: int, cC: int, d_exp: int,
                   tables_pas: dict, tables_couple: dict,
                   cap_binaire: int) -> dict:
    """Contribution de RIO-08 au bilan d'ensemble (assemblage L8).

    7 blocs : position · forme · empreinte · couple · force · limites ·
    palier/pas. cap_binaire : le CAP RÉEL transmis à l'arbre Q5 tel quel
    ("AC" ⇔ 1), jamais déduit d'une condition composée. La table couple
    est intégrée en balayage complet (classe er1 × zone Q2 — les états
    hérités réels sélectionneront la ligne à l'exécution).
    """
    forces = list(forces_result["forces"])
    silencieuse = bool(forces_result["silencieuse"])
    exclues = list(forces_result["exclues"])
    trace = forces_result["trace"]
    cle_pas = (cap_binaire, "F-E1" in forces, "F-E3" in forces,
               "F-E6" in forces)
    pas_tab = tables_pas[cle_pas]
    coherence = core_q3.coherence_cap_forces(cap, forces)
    force_parties = (
        [core_q3.TEMPLATES[f] for f in forces] if forces
        else [core_q3.TEMPLATES["SILENCIEUSE"]])
    limites_parties = []
    if exclues:
        limites_parties.append(
            "forces actives non retenues (densité) : " + ", ".join(exclues)
            + " — tracées, jamais perdues")
    if statut_j in ("NON_RENSEIGNÉ", "PARTIEL", "SILENCIEUX"):
        limites_parties.append(
            f"journal {statut_j} — information, jamais une sanction")
    if not limites_parties:
        limites_parties.append("aucune limite signalée — preuves complètes")
    retest = core_q5.programmer_re_test("2026-01-01", semaines=8)
    fragment = {
        "bloc_1_position": {
            "forces_retenues": forces if forces else ["aucune — SILENCIEUSE"],
            "nombre": forces_result["nombre"],
            "silencieuse": silencieuse,
            "capitalisation": cap,
            "echelle_C": {"C-A": cA, "C-B": cB, "C-C": cC},
            "demande_explicite": d_exp,
            "statut_journal": statut_j,
        },
        "bloc_2_forme": {
            "trace_voies": {f: trace[f] for f in FORCES},
            "exclues_densite": exclues if exclues
                else ["aucune — au plus deux forces actives"],
            "coherence_cap_FE3": coherence,
        },
        "bloc_3_empreinte": {
            "source": ("RIO-06 — les VRAIS seuils du cœur sur les faces "
                       "héritées (balayage par rang, 13 valeurs réelles "
                       "compactées — prouvé)"),
            "niveaux_herites": pal["niveaux"],
            "rangs_herites": pal["rangs"],
            "plancher_partiel": True,
            "face_absente": "E-R2 (le mur) n'est pas portée par ce moteur "
                            "— la vraie gravité peut être plus haute, "
                            "jamais plus basse",
        },
        "bloc_4_couple": {
            "source": "RIO-09 — vrai moteur émo-q4 (configuration_devises)",
            "apport_heurite": ("classe er1 du cœur × zone d'invalidation "
                               "mesurée par RIO-07 — balayage complet ; "
                               "l'état réel mesuré sélectionnera la ligne"),
            "table_par_etat_heurite": {
                f"er1={c}/zone={z}": t for (c, z), t in tables_couple.items()},
        },
        "bloc_5_force": {
            "statut": "SILENCIEUSE" if silencieuse else "VISIBLE",
            "templates": force_parties,
            "banque_fermee": "le positif n'est jamais généré — sélectionné "
                             "dans la banque de 6 forces (fondation v1.1)",
        },
        "bloc_6_limites": {
            "signaux": limites_parties,
            "garde": ("F-E3 — le cœur qui célèbre — jamais active si CAP "
                      "≠ AC : la tiédeur ne fabrique pas de célébration "
                      "(garde du vrai moteur, vérifiée)"),
        },
        "bloc_7_palier_pas": {
            "palier": pal["palier"],
            "pas_possibles": pas_tab,
            "pas_labels": sorted({core_q5.PAS_LABELS[p] for p in pas_tab}),
            "heritages_mesures": {"cap": cap,
                                   "forces_retenues": forces},
            "suivi_14_jours_sans_sanction": True,
            "retest": ("re-test RIO-08 proposé à 8 semaines — vrai "
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
