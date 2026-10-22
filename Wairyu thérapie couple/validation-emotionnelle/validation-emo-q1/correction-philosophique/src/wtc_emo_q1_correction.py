# -*- coding: utf-8 -*-
"""
WTC-EMO-Q1 — COUCHE DE CORRECTION PHILOSOPHIQUE (fichier SUPPLÉMENTAIRE)
=========================================================================
RIO-06 « Ma météo intérieure » — rattrapage au gabarit universel §5.1-§5.4
du canon (demande fondateur, même ordre que RIO-01/02/03 : fichiers
SUPPLÉMENTAIRES, zéro modification de l'existant, exactitude des calculs).

RÈGLE ABSOLUE : ce module NE MODIFIE AUCUN moteur existant.
- Le vrai cœur de la quête reste `validation-emotionnelle/validation-emo-q1/
  src/wtc_emo_q1_core.py` (fondation v1.1, faute n°16 pré-attrapée) —
  importé tel quel, jamais recopié.
- Les junctions utilisent les VRAIS moteurs `validation-emo-q2`
  (zones de l'ombre émotionnelle — RIO-07), `validation-emo-q4`
  (croisement à deux, 9 configurations — RIO-09) et `validation-emo-q5`
  (le pas du cœur, arbre 8 pas + suivi 14 j + re-test 8 semaines — RIO-10).
- Cette couche ajoute ce que l'audit (Task 163) a trouvé manquant sur
  RIO-06 : F2 palier 🟢🟠🔴 + QUAND DEMANDER DE L'AIDE (12/25) ;
  F3 contenu des 3 paliers + branchement quête « pas » (6/25) ;
  F4 fragment de bilan L8 (7 blocs) (10/25). La zone de force (F-E1 à
  F-E7 affichés) était déjà validée P1 (critère C5) — elle est PRÉSERVÉE
  telle quelle : les templates cités ici sont les VRAIS du cœur.

Chaque règle ci-dessous est PRÉ-ENREGISTRÉE (écrite avant tout calcul) et
dérivée MÉCANIQUEMENT des sorties du vrai cœur — zéro invention de mesure.

Règles pré-enregistrées :
- R1 (palier) : niveau de face via les VRAIS seuils du cœur émotionnel —
  Forte = score ≥ 3,5 (SEUIL_DOMINANCE du cœur : « dominance nette ») ;
  Vive = 2,5 < score < 3,5 (au-dessus de la zone pacifique
  SEUIL_PACIFIQUE_E_R1 = 2,5) ; Tranquille = 1,5 ≤ score ≤ 2,5 (zone
  saine du cœur : ≤ 2,5) ; Discrète = score < 1,5 (borne basse posée
  D-STD, symétrique, consignée). rang ∈ {0,1,2,3} ;
  rang_quête = max(rang E-R1, rang E-R2, rang E-R3) — les 3 faces de la
  sous-échelle E-R, la MÉTÉO INTÉRIEURE elle-même (fondation v1.1 :
  « E-R “Ma météo intérieure” (régulation) ») et la seule lecture de
  gravité du VRAI classifieur (les 5 labels ne lisent que E-R) ;
  🟢 si rang_quête ≤ 1 · 🟠 si = 2 · 🔴 si = 3 (canon §5.4, max-niveau).
- R2 (seuil d'aide S1) : rang_quête = 3 (une face de la météo lue Forte
  = dominance nette du cœur) → 🔴 + orientation chaleureuse affichée
  (« le chemin le plus court, pas un échec »).
- R3 (seuil d'aide S2) : rang_quête = 2 (une face Vive sans aucune
  Forte) → « à surveiller » + re-test 8 semaines (le VRAI
  programmer_re_test de la quête pas), palier restant 🟠.
- R4 (qualité avant sens) : RQS KO du vrai cœur (calculer_rqs :
  linéarité ≥ 0,55 OU contradiction E-R1×E-R2 ≥ 3,5) → lecture
  suspendue (re-test d'abord) ; RQS OK → lecture affichée. Deux
  statuts, ni plus ni moins — le cœur émotionnel ne définit que
  rqs_ok (bool) ; aucune invention de statut intermédiaire.
- R5 (anti-fabrication §5.5) : zone calme affichée « rien à fabriquer »
  ssi les 3 faces de la météo sont Discrète/Tranquille — JAMAIS sur
  Vive/Forte ; le statut SILENCIEUSE est EXACTEMENT celui du vrai
  verifier_forces (0 des 6 conditions) — jamais fabriqué ; les forces
  affichées sont EXACTEMENT celles retenues par le vrai cœur (règle des
  2 max par densité, tie-break ordre de banque) — les exclues de
  densité sont tracées et jamais affichées.
- R6 (force silencieuse) : sur face active → « terrain de travail, pas
  un verdict » (canon §5.5).
- R7 (vocabulaire écran, canon Partie 9) : aucun mot de la liste
  interdite dans tout texte affiché ; D-CRISE non applicable à cet
  instrument (le cœur émotionnel ne mesure aucun construit
  d'auto-danger) — consigné, remplacé par S1/S2. Les textes utilisent
  les DÉFINITIONS descriptives de la fondation v1.1 (« l'émotion
  déborde vite et fort », « l'émotion est retenue, cachée », « l'émotion
  tourne en boucle ») — descriptif causal, sans étiquette.
- R8 (D-SIM) : bandeau simulation sur chaque bloc écran.
- R9 (couplage réel) : le pas annoncé est celui du VRAI moteur
  émotionnel Q5 (arbre INV > RC > CAP > FE1 > FE6 > ER1 > ER2 > FE3).
  Les héritages Q1/Q3 sont fournis par le vrai cœur (er1_moyenne,
  er2_moyenne, cap, fe1_active, fe3_active, fe6_active) ; les
  héritages Q2 (inv_d_zone, rc_label) ne sont pas encore mesurés à
  cette étape (RIO-07 est après RIO-06 dans la file) — le fragment
  liste donc les pas possibles en balayant les héritages Q2 par le
  VRAI selectionner_pas (même honnêteté que RIO-01 : pas possibles,
  jamais devinés).
"""

from __future__ import annotations

import hashlib
import importlib.util
import sys
from pathlib import Path

# ─────────────────────────────────────────────────────────────────────────────
# CHARGEMENT DES VRAIS MOTEURS (jamais recopiés, jamais modifiés)
# ─────────────────────────────────────────────────────────────────────────────
_PKG = Path(__file__).resolve().parents[1]           # …/validation-emo-q1/correction-philosophique
_Q1 = _PKG.parent                                    # …/validation-emo-q1
_EMO = _Q1.parent                                    # …/validation-emotionnelle
_WTC = _EMO.parent                                   # …/Wairyu thérapie couple


def _charge(nom: str, chemin: Path):
    spec = importlib.util.spec_from_file_location(nom, chemin)
    mod = importlib.util.module_from_spec(spec)
    sys.modules[nom] = mod
    spec.loader.exec_module(mod)
    return mod


# Le core émo-q1 DOIT porter son nom canonique dans sys.modules : le vrai
# simulateur (`wtc_emo_q1_simulator.py`) fait `import wtc_emo_q1_core as core`.
core_q1 = _charge("wtc_emo_q1_core", _Q1 / "src" / "wtc_emo_q1_core.py")
core_q2 = _charge("wtc_emo_q2_core", _EMO / "validation-emo-q2" / "src" / "wtc_emo_q2_core.py")
core_q4 = _charge("wtc_emo_q4_core", _EMO / "validation-emo-q4" / "src" / "wtc_emo_q4_core.py")
core_q5 = _charge("wtc_emo_q5_core", _EMO / "validation-emo-q5" / "src" / "wtc_emo_q5_core.py")

# Vérification d'intégrité des moteurs chargés (ce sont bien les vrais) :
assert len(core_q1.FORCES) == 6 and len(core_q1.TEMPLATES) == 7
assert core_q1.SEUIL_PACIFIQUE_E_R1 == 2.5 and core_q1.SEUIL_DOMINANCE == 3.5
assert core_q1.SEUIL_LINEARITE_RQS == 0.55
assert core_q1.SEUIL_CONTRADICTION_ER1_ER2 == 3.5
assert len(core_q1.FACES) == 9 and len(core_q1.ITEMS_PAR_FACE) == 9
assert len(core_q2.TEMPLATES_INVALIDATION_DONNEE) == 3
assert len(core_q2.TEMPLATES_REPROCHE_CODE) == 4
assert len(core_q4.CONFIG_LABELS) == 9 and len(core_q4.CANALS) == 3
assert len(core_q5.PAS_ORDER) == 8 and len(core_q5.TEMPLATES_PAS) == 8
assert core_q5.SEUIL_CELEBRE == 10 and core_q5.SEUIL_AJUSTEMENT == 6

# ─────────────────────────────────────────────────────────────────────────────
# CONSTANTES DE LA COUCHE (R1-R9)
# ─────────────────────────────────────────────────────────────────────────────
# Les 3 faces de la météo (sous-échelle E-R) — la lecture de gravité.
FACES_METEO = ("E-R1", "E-R2", "E-R3")

NOM_FACE_ECRAN = {
    "E-R1": "explosion",
    "E-R2": "mur",
    "E-R3": "boucle",
}

# DÉFINITIONS descriptives de la fondation v1.1 (MOT POUR MOT) —
# descriptif causal sans étiquette (R7) :
DEFINITION_FACE = {
    "E-R1": "l'émotion déborde vite et fort",
    "E-R2": "l'émotion est retenue, cachée",
    "E-R3": "l'émotion tourne en boucle",
}

# Conséquence relationnelle (canon : « comment il peut affecter la
# relation ») — dérivée des définitions de la fondation :
EFFET_RELATION = {
    "E-R1": "les échanges montent vite, même quand le sujet est petit — "
            "l'autre reçoit l'intensité avant le sens",
    "E-R2": "l'autre doit deviner ce que tu retiens — le silence se lit "
            "dehors comme une distance",
    "E-R3": "la conversation est finie mais la scène rejoue — la tension "
            "revient sans nouvelle matière",
}

RANG_NIVEAU = {"Discrète": 0, "Tranquille": 1, "Vive": 2, "Forte": 3}
NIVEAU_DE_RANG = {v: k for k, v in RANG_NIVEAU.items()}
PALIER_DE_RANG = {0: "🟢", 1: "🟢", 2: "🟠", 3: "🔴"}
PALIER_NOM = {"🟢": "Seul·e — exercice maison", "🟠": "À deux — module de couple",
              "🔴": "Avec un professionnel — orientation chaleureuse"}

# Borne basse D-STD (posée, symétrique du 2,5 du cœur — consignée au rapport) :
SEUIL_BAS_DISCRETE = 1.5

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

# ─────────────────────────────────────────────────────────────────────────────
# R1 — NIVEAU DE FACE ET PALIER (purement mécaniques, via les VRAIS seuils)
# ─────────────────────────────────────────────────────────────────────────────
def niveau_face(score: float) -> str:
    """R1 — niveau d'une face via les VRAIS seuils du cœur émotionnel.

    Forte ≥ 3,5 (SEUIL_DOMINANCE) · Vive > 2,5 (au-dessus de
    SEUIL_PACIFIQUE_E_R1) · Tranquille ≥ 1,5 (SEUIL_BAS_DISCRETE, D-STD) ·
    Discrète < 1,5.
    """
    if score >= core_q1.SEUIL_DOMINANCE:
        return "Forte"
    if score > core_q1.SEUIL_PACIFIQUE_E_R1:
        return "Vive"
    if score >= SEUIL_BAS_DISCRETE:
        return "Tranquille"
    return "Discrète"


def palier_et_seuils(scores_faces: dict) -> dict:
    """R1/R2/R3 — palier (max-niveau sur la météo E-R) + seuils S1/S2.

    Args:
        scores_faces : dict {face: score} avec au moins E-R1, E-R2, E-R3
                       (les scores viennent du VRAI score_face du cœur).

    Returns:
        dict rangs, palier, palier_nom, S1_faces, S2_faces, niveaux.
    """
    niveaux = {f: niveau_face(scores_faces[f]) for f in FACES_METEO}
    rangs = {f: RANG_NIVEAU[niveaux[f]] for f in FACES_METEO}
    rang_quete = max(rangs.values())
    palier = PALIER_DE_RANG[rang_quete]
    s1 = [f for f in FACES_METEO if rangs[f] == 3]
    s2 = [f for f in FACES_METEO if rangs[f] == 2] if rang_quete == 2 else []
    return {
        "niveaux": niveaux, "rangs": rangs, "rang_quete": rang_quete,
        "palier": palier, "palier_nom": PALIER_NOM[palier],
        "S1_faces": s1, "S2_faces": s2,
        "orientation_affichee": bool(s1),
        "surveillance_affichee": bool(s2),
    }


def palier_independant(s1: int, s2: int, s3: int) -> dict:
    """COR2 — chemin de calcul INDÉPENDANT (entiers purs, zéro float).

    Recalcule rangs et palier depuis les SOMMES brutes d'items (s/3 exact,
    seuils entiers : Forte ⇔ s ≥ 11 car 3,5 × 3 = 10,5 ; Vive ⇔ 8 ≤ s ≤ 10
    car 2,5 × 3 = 7,5 ; Tranquille ⇔ 5 ≤ s ≤ 7 car 1,5 × 3 = 4,5 ;
    Discrète ⇔ s ≤ 4) sans passer par aucun score flottant.
    Doit converger EXACTEMENT avec palier_et_seuils().
    """
    def rang(somme: int) -> int:
        if somme >= 11:
            return 3
        if somme >= 8:
            return 2
        if somme >= 5:
            return 1
        return 0

    rangs = {"E-R1": rang(s1), "E-R2": rang(s2), "E-R3": rang(s3)}
    rang_quete = max(rangs.values())
    s1_faces = [f for f in FACES_METEO if rangs[f] == 3]
    s2_faces = [f for f in FACES_METEO if rangs[f] == 2] if rang_quete == 2 else []
    return {
        "rangs": rangs, "rang_quete": rang_quete,
        "palier": PALIER_DE_RANG[rang_quete],
        "S1_faces": s1_faces, "S2_faces": s2_faces,
    }


# ─────────────────────────────────────────────────────────────────────────────
# R5/R6/R7/R8 — TEXTES ÉCRAN (descriptif causal, sans étiquette)
# ─────────────────────────────────────────────────────────────────────────────
def _clause_ombre(face: str, niveau: str) -> str:
    """Zone d'ombre — descriptif causal SANS étiquette (R5/R6/R7).

    Fondée sur la DÉFINITION de la face (fondation v1.1, mot pour mot)
    et son effet relationnel ; jamais de nom de constructeur clinique.
    """
    nom = NOM_FACE_ECRAN[face]
    if niveau == "Discrète":
        return (f"Zone calme : ton {nom} ne pèse pas sur ton lien. Cette "
                "zone est calme chez toi — rien à fabriquer ici.")
    if niveau == "Tranquille":
        return (f"Ton {nom} existe à bas bruit : {DEFINITION_FACE[face]} "
                "par moments, sans te diriger. Cette zone est calme chez "
                "toi — rien à fabriquer ici non plus.")
    if niveau == "Vive":
        return (f"Ton {nom} est active au quotidien : {DEFINITION_FACE[face]} "
                f"— {EFFET_RELATION[face]}.")
    return (f"Ton {nom} prend beaucoup de place : {DEFINITION_FACE[face]} "
            f"— {EFFET_RELATION[face]}. C'est un signal, pas un verdict.")


def _clause_force(face: str, niveau: str) -> str:
    nom = NOM_FACE_ECRAN[face]
    if niveau in ("Discrète", "Tranquille"):
        return (f"Ce qui te porte : ton {nom} reste léger la plupart du "
                "temps — ton lien garde de l'air.")
    return ("Terrain de travail, pas un verdict : ce qui se mesure peut "
            "bouger — c'est exactement ce que montre cette lecture.")


# F3 — exercices maison 🟢 (capitalisation émotionnelle), dérivés des
# définitions de fondation et des forces réelles :
_EXERCICE_FACE = {
    "E-R1": "la montée en direct : quand tu sens l'émotion grimper, dis "
            "tout haut « ça monte » et prends dix respirations avant de "
            "répondre. Un carnet, deux minutes, une fois par jour",
    "E-R2": "une chose retenue dite à voix haute une fois par jour — une "
            "seule, choisie, minuscule. Le mur baisse d'un rang, pas d'un "
            "coup",
    "E-R3": "la boucle sur papier : écrire ce qui tourne pendant cinq "
            "minutes, puis refermer le carnet. La boucle reste dedans, "
            "pas dans la conversation du soir",
}


def _clause_exercice(face_dom: str, forces: list) -> str:
    """F3 — contenu du palier 🟢 : exercice maison (face dominante si
    active, sinon capitalisation par la première force réelle, sinon
    journal de météo — fidèle au journal l/u/m du cœur)."""
    if face_dom is not None:
        return "🟢 À ta portée, seul·e : " + _EXERCICE_FACE[face_dom] + "."
    if forces:
        f = forces[0]
        exercices_forces = {
            "F-E1": "un moment d'écoute par jour : laisser l'autre finir, "
                    "répéter ce que tu as entendu avant de répondre",
            "F-E2": "une détente provoquée par jour : baisser le ton une "
                    "fois avant que ça ne monte",
            "F-E3": "une bonne nouvelle célébrée par jour : une question "
                    "de plus (« raconte, c'était comment ? »)",
            "F-E4": "un besoin formulé clairement par jour : une phrase "
                    "qui commence par « j'aimerais »",
            "F-E5": "une traversée notée par jour : la tempête passée, "
                    "une ligne sur ce qui a tenu",
            "F-E6": "un don dans la devise de l'autre cette semaine : "
                    "paroles, temps ou contact — le canal de l'autre, "
                    "pas le tien",
        }
        return "🟢 À ta portée, seul·e : " + exercices_forces[f] + "."
    return ("🟢 À ta portée, seul·e : tenir le journal de ta météo — une "
            "ligne par jour (ce qui est descendu, ce qui est monté, ce qui "
            "a tourné). Le motif apparaît seul après une semaine.")


def _clause_module(face_dom: str) -> str:
    """F3 — contenu du palier 🟠 : module de couple par face dominante."""
    modules = {
        "E-R1": ("🟠 À deux : le signal d'alerte à deux — chacun nomme le "
                 "moment où ça monte chez l'autre, avec un mot convenu "
                 "pour poser une pause. 15 minutes par semaine."),
        "E-R2": ("🟠 À deux : le décodeur du mur — un temps fixe où ce qui "
                 "est retenu peut être dit sans réponse immédiate. "
                 "L'un partage, l'autre écoute, sans réparer."),
        "E-R3": ("🟠 À deux : le débriefing de boucle — l'autre écoute la "
                 "scène qui rejoue, une seule fois, sans la résoudre. "
                 "Nommer suffit à la première séance."),
    }
    return modules.get(face_dom, "")


def clause_orientation(face: str) -> str:
    nom = NOM_FACE_ECRAN[face]
    return (f"🔴 Avec un professionnel : ton {nom} est lu Forte. "
            f"{PHRASE_ORIENTATION}.")


def _clause_surveillance(face: str) -> str:
    nom = NOM_FACE_ECRAN[face]
    return (f"Seuil approché : ton {nom} est lu Vive — actif sans être "
            "dominant. À surveiller, re-test proposé à 8 semaines.")


def _clause_seuil_atteint(face: str) -> str:
    nom = NOM_FACE_ECRAN[face]
    return (f"Seuil atteint : ton {nom} est lu Forte — l'orientation est "
            "proposée.")


def clause_aide_standing() -> str:
    return ("QUAND DEMANDER DE L'AIDE — seuils posés d'avance, les mêmes "
            "pour tout le monde : une face de la météo lue Forte → parler "
            "à un professionnel est proposé ; une face lue Vive sans aucune "
            "Forte → à surveiller, re-test proposé à 8 semaines ; des "
            "réponses trop uniformes ou contradictoires → d'abord refaire "
            "le test, on ne lit rien sur du bruit.")


def clause_prudence_suspension() -> str:
    return ("Lecture suspendue : tes réponses portent trop de signes "
            "d'uniformité ou de contradiction pour être lues. Refais le "
            "test quand tu es calme — on ne lit rien sur du bruit.")


def bloc_ecran(scores_faces: dict, forces_result: dict, rqs_ok: bool,
               pal: dict) -> dict:
    """Assemble le bloc écran complet RIO-06 (toutes les clauses sont
    déterminées mécaniquement par les sorties du vrai cœur).

    R4 — qualité avant sens : rqs_ok False → bloc de suspension seul
    (aucune lecture, aucune force, aucune zone calme).
    R5 — les forces affichées sont EXACTEMENT celles du vrai cœur
    (forces_result : dict retourné par le VRAI verifier_forces) ; le
    statut SILENCIEUSE est celui du vrai cœur.
    """
    if not rqs_ok:
        texte = "\n".join([BANDEAU_DSIM, clause_prudence_suspension()])
        return {
            "texte": texte,
            "md5": hashlib.md5(texte.encode("utf-8")).hexdigest(),
            "nb_mots_interdits": sum(1 for m in MOTS_INTERDITS if m in texte.lower()),
            "suspendu": True,
        }
    niveaux = pal["niveaux"]
    forces = list(forces_result["forces"])
    statut_forces = forces_result["statut"]
    parties = [BANDEAU_DSIM]
    parties.append(
        "Ta météo intérieure se lit : "
        + " · ".join(f"{NOM_FACE_ECRAN[f]} {niveaux[f].lower()}"
                     for f in FACES_METEO) + ".")
    for f in FACES_METEO:
        parties.append(_clause_ombre(f, niveaux[f]))
    for f in FACES_METEO:
        parties.append(_clause_force(f, niveaux[f]))
    if statut_forces == "SILENCIEUSE":
        parties.append("> " + core_q1.TEMPLATES["SILENCIEUSE"])
    else:
        for f in forces:
            parties.append("> " + core_q1.TEMPLATES[f])
        if forces_result["exclues_densite"]:
            parties.append(
                "D'autres forces existent aussi — elles s'afficheront au "
                "fil du parcours. (Tracées, jamais perdues.)")
    parties.append(f"CE QUE TU PEUX CHANGER — palier {pal['palier']} "
                   f"({pal['palier_nom']}) :")
    face_dom = None
    if pal["rang_quete"] >= 2:
        for f in FACES_METEO:
            if pal["rangs"][f] == pal["rang_quete"]:
                face_dom = f
                break
    parties.append(_clause_exercice(face_dom, forces))
    if pal["palier"] == "🟠" and face_dom is not None:
        module = _clause_module(face_dom)
        if module:
            parties.append(module)
    for f in pal["S1_faces"]:
        parties.append(_clause_seuil_atteint(f))
        parties.append(clause_orientation(f))
    for f in pal["S2_faces"]:
        parties.append(_clause_surveillance(f))
    parties.append(clause_aide_standing())
    texte = "\n".join(parties)
    return {
        "texte": texte,
        "md5": hashlib.md5(texte.encode("utf-8")).hexdigest(),
        "nb_mots_interdits": sum(1 for m in MOTS_INTERDITS if m in texte.lower()),
        "suspendu": False,
    }


# ─────────────────────────────────────────────────────────────────────────────
# R9 — BRANCHEMENT PAS (VRAI Q5) + COUPLE (VRAI Q4) — tables de junction
# ─────────────────────────────────────────────────────────────────────────────
# Héritages Q2 émotionnel (inv_d_zone, rc_label) — pas encore mesurés à
# l'étape RIO-06 (RIO-07 arrive après) : BALAYAGE EXPLICITE des valeurs
# réelles que le moteur Q5 accepte (sources : vrai selectionner_pas +
# vrai moteur Q2 : zones_invalidation → ABSENT/OCCASIONNEL/FRÉQUENT ;
# reproche_code → les 4 labels réels).
ZONES_INV_D = sorted(core_q2.TEMPLATES_INVALIDATION_DONNEE.keys())   # ABSENT · OCCASIONNEL · FRÉQUENT
LABELS_RC = sorted(core_q2.TEMPLATES_REPROCHE_CODE.keys())           # 4 labels réels

# CAP : la vraie lecture de la couche (CAP = 1 ⇔ active-constructive ;
# la quête Q5 reçoit le CHOIX : "AC" si CAP=1, sinon un type non-AC
# parmi PC/AD/PD — tous équivalents pour l'arbre : cap != "AC").
CAP_CHOIX = ("AC", "PC")


def pas_possibles(s1: int, s2: int, cap: int, fe1: bool, fe3: bool,
                  fe6: bool) -> dict:
    """R9 — les pas possibles du répondant via le VRAI selectionner_pas.

    Les héritages fournis par le vrai cœur Q1/Q3 sont FIXÉS (er1, er2,
    cap, fe1, fe3, fe6) ; les héritages Q2 sont balayés (3 zones × 4
    labels = 12 combinaisons réelles). Retour : {pas: source} — les pas
    atteignables en variant uniquement ce que RIO-07 mesurera.
    """
    er1 = s1 / 3.0
    er2 = s2 / 3.0
    table = {}
    for cap_choix in (CAP_CHOIX[cap] if cap in (0, 1) else "PC",):
        for zone in ZONES_INV_D:
            for label_rc in LABELS_RC:
                profil_heritage = {
                    "inv_d_zone": zone,
                    "rc_label": label_rc,
                    "cap": cap_choix,
                    "fe1_active": bool(fe1),
                    "fe6_active": bool(fe6),
                    "er1_moyenne": er1,
                    "er2_moyenne": er2,
                    "fe3_active": bool(fe3),
                }
                sel = core_q5.selectionner_pas(profil_heritage)
                table.setdefault(sel["pas"], sel["trace"]["source"])
    return table


def configurations_couple(s1: int) -> dict:
    """F4 bloc 4 — configurations de couple atteignables via le VRAI Q4.

    La co-régulation (vrai co_regulation) lit la face explosion E-R1 du
    répondant (seuil réel ≥ 3,0) ; les configurations (vrai
    configuration_devises) sont balayées sur les entrées de l'autre
    partenaire (devises 3 canaux × 4 patterns réels, boucle, zones).
    Retour : paire_explosive_possible + configurations atteignables.
    """
    er1 = s1 / 3.0
    co = core_q4.co_regulation(er1, 3.0)     # l'autre partenaire balayé ci-dessous
    co_bas = core_q4.co_regulation(er1, 2.0)
    paire_possible = co["paire_explosive"]   # er1 ≥ 3,0 suffit (vrai seuil)
    # Balayage EXACT des devises de l'autre partenaire (3 canaux, patterns
    # du vrai DEVISE_PATTERNS) + boucle on/off + zones de l'autre :
    patterns = list(core_q4.DEVISE_PATTERNS)
    configs_atteignables = set()
    for d1 in patterns:
        for d2 in patterns:
            for d3 in patterns:
                dev_B = {"paroles": d1, "temps": d2, "contact": d3}
                dev_A_aligne = {c: "ALIGNE" for c in core_q4.CANALS}
                for boucle in (True, False):
                    cfg = core_q4.configuration_devises(
                        dev_A_aligne, dev_B, er1, 2.0, boucle,
                        "ABSENT", "ABSENT")
                    configs_atteignables.add(cfg)
                    if paire_possible:
                        cfg2 = core_q4.configuration_devises(
                            dev_A_aligne, dev_B, er1, 4.0, boucle,
                            "OCCASIONNEL", "ABSENT")
                        configs_atteignables.add(cfg2)
    return {
        "er1_moyenne": er1,
        "paire_explosive_possible": bool(paire_possible),
        "explosif_repondant": bool(co["explosif_A"]),
        "configurations_atteignables": sorted(configs_atteignables),
        "nb_configurations": len(configs_atteignables),
    }


# ─────────────────────────────────────────────────────────────────────────────
# F4 — FRAGMENT DE BILAN L8 (7 blocs) — junctions VRAIES émo-q2/q4/q5
# ─────────────────────────────────────────────────────────────────────────────
def bilan_fragment(scores_faces: dict, classification: str,
                           forces_result: dict, rqs_ok: bool, pal: dict,
                           s1: int, s2: int, s3: int, cap_reel: int) -> dict:
    """Contribution de RIO-06 au bilan d'ensemble (assemblage L8 du canon).

    7 blocs : position · forme · empreinte · couple · force · limites ·
    palier/pas. Les blocs empreinte/couple/pas pointent les VRAIS moteurs
    émotionnels Q2 (zones de l'ombre), Q4 (9 configurations) et Q5 (8 pas).
    cap_reel : le CAP RÉEL du profil (0/1 — "AC" ⇔ 1) transmis à l'arbre
    Q5 tel quel, jamais déduit d'une condition composée.
    """
    conds = forces_result["conditions"]
    er1 = s1 / 3.0
    er2 = s2 / 3.0
    ordre_faces = tuple(sorted(FACES_METEO, key=lambda f: -scores_faces[f]))
    ecart_12 = scores_faces[ordre_faces[0]] - scores_faces[ordre_faces[1]]
    pas_tab = {}
    for zone in ZONES_INV_D:
        for label_rc in LABELS_RC:
            sel = core_q5.selectionner_pas({
                "inv_d_zone": zone, "rc_label": label_rc,
                "cap": CAP_CHOIX[1 if cap_reel == 1 else 0],
                "fe1_active": bool(conds["F-E1"]),
                "fe6_active": bool(conds["F-E6"]),
                "er1_moyenne": er1, "er2_moyenne": er2,
                "fe3_active": bool(conds["F-E3"]),
            })
            pas_tab.setdefault(sel["pas"], sel["trace"]["source"])
    configs = configurations_couple(s1)
    force = [f for f in FACES_METEO if pal["niveaux"][f] in ("Discrète", "Tranquille")]
    limites = [f for f in FACES_METEO if pal["niveaux"][f] in ("Vive", "Forte")]
    retest = core_q5.programmer_re_test("2026-01-01", semaines=8)
    fragment = {
        "bloc_1_position": {
            "E-R1": {"score": er1, "niveau": pal["niveaux"]["E-R1"]},
            "E-R2": {"score": er2, "niveau": pal["niveaux"]["E-R2"]},
            "E-R3": {"score": s3 / 3.0, "niveau": pal["niveaux"]["E-R3"]},
            "classification_moteur": classification,
            "qualite_reponse": "OK" if rqs_ok else "SUSPENDUE",
        },
        "bloc_2_forme": {
            "ordre_faces": ">".join(ordre_faces),
            "ecart_1_2": round(ecart_12, 2),
        },
        "bloc_3_empreinte": {
            "source": "RIO-07 — vrai moteur émo-q2 (zones de l'ombre)",
            "zones_invalidation_possibles": list(ZONES_INV_D),
            "labels_reproche_code_possibles": list(LABELS_RC),
        },
        "bloc_4_couple": {
            "source": "RIO-09 — vrai moteur émo-q4 (CONFIG_LABELS)",
            "er1_moyenne": configs["er1_moyenne"],
            "paire_explosive_possible": configs["paire_explosive_possible"],
            "configurations_atteignables": configs["configurations_atteignables"],
            "configurations_total": len(core_q4.CONFIG_LABELS),
        },
        "bloc_5_force": {
            "statut": forces_result["statut"],
            "forces_retenues": list(forces_result["forces"]),
            "templates": [core_q1.TEMPLATES[f] for f in forces_result["forces"]],
            "exclues_densite": list(forces_result["exclues_densite"]),
        },
        "bloc_6_limites": {
            "météo_calmée": force if force else ["aucune zone calme — terrain de travail, pas un verdict"],
            "météo_active": limites if limites else ["aucune zone active — rien à fabriquer"],
        },
        "bloc_7_palier_pas": {
            "palier": pal["palier"],
            "pas_possibles": pas_tab,
            "pas_labels": sorted({core_q5.PAS_LABELS[p] for p in pas_tab}),
            "suivi_14_jours_sans_sanction": True,
            "retest": ("re-test RIO-06 proposé à 8 semaines — vrai "
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
