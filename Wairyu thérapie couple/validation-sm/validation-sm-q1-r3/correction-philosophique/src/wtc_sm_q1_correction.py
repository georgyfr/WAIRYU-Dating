# -*- coding: utf-8 -*-
"""
WTC-SM-Q1-R3 — COUCHE DE CORRECTION PHILOSOPHIQUE (fichier SUPPLÉMENTAIRE)
==========================================================================
RIO-11 « Ma détresse et la leur » — rattrapage au gabarit universel §5.1-§5.4
du canon (demande fondateur, même ordre que RIO-01/02/03/06/07/08/09/10 :
fichiers SUPPLÉMENTAIRES, zéro modification de l'existant, exactitude des
calculs).

RÈGLE ABSOLUE : ce module NE MODIFIE AUCUN moteur existant.
- Le vrai cœur de la quête reste `validation-sm/validation-sm-q1-r3/src/
  wtc_sm_q1_core.py` (R3 — D-GÉOMÉTRIE σ_eff 0,30, bande [3,10 ; 4,90],
  voie H5 peuplée, VALIDÉ 6/6 contresigné) — importé tel quel, jamais
  recopié.
- Les junctions utilisent les VRAIS moteurs `validation-sm-q4`
  (croisement « Nos deux rives » — RIO-14 : niveau_de, configuration_de,
  TEMPLATES_CONFIG, SEUIL_FAIBLE/SEUIL_ELEVE) et `validation-sm-q5`
  (le pas « Mon premier pas vers l'autre rive » — RIO-15 : palier_de,
  pas_de, BANQUE_PAS, statut_engagement_de, TEMPLATES, LITTERAL_ORIENTATION).
- Cette couche ajoute ce que l'audit (Task 163) a trouvé manquant sur
  RIO-11 : F2 palier 🟢🟠🔴 dérivé MÉCANIQUEMENT du VRAI classifieur +
  QUAND DEMANDER DE L'AIDE (seuils S1/S2) (22/25) ; F3 contenu des 3
  paliers + branchement quête « pas » (12/25) ; F4 fragment de bilan L8
  (7 blocs) (10/25). La lecture graduée F1 (25/25 — D-VÉRITÉ 100 %,
  D-CRISE sens/spé 100 %, D-GÉOMÉTRIE bande exclue) est PRÉSERVÉE telle
  quelle : le classifieur, la crise et la bande restent ceux du cœur.

Chaque règle ci-dessous est PRÉ-ENREGISTRÉE (écrite avant tout calcul) et
dérivée MÉCANIQUEMENT des sorties du vrai cœur — zéro invention de mesure.

Règles pré-enregistrées :
- R1 (palier, max-niveau, 0 seuil ajouté) : le palier est l'image exacte du
  VRAI classifier_dominance — CRISE → 🔴 · STABLE → 🟢 · CHARGE / MASQUE /
  MIXTE → 🟠. Aucun seuil numérique n'est ajouté : la lecture graduée
  reste celle du cœur (STABLE : les 3 faces D ≤ 2,5 — SEUIL réel ;
  dominance : face D ≥ 3,5 — SEUIL_DOMINANCE réel ; crise : SM-C1 ≥ 4,0
  — SEUIL_CRISE réel — ou H5 hérité).
- R2 (D-CRISE primordial, court-circuit) : en CRISE, l'écran affiche le
  court-circuit du VRAI moteur MOT POUR MOT (cause + filet 3919/3114)
  et RIEN d'autre — les lectures de dominance ne sont pas déployées car
  le vrai classifier_dominance court-circuite AVANT de lire les faces D :
  afficher une ombre détaillée serait une fabrication. JAMAIS de pas de
  couple en crise (hub D-CRISE) — l'orientation EST le pas (VRAI
  LITTERAL_ORIENTATION de la quête pas SM).
- R3 (ombre causale, sans étiquette) : les 5 labels du VRAI classifieur
  sont lus avec leur sémantique documentée DANS LE DÉPÔT (gitbook
  04-sante-mentale + SPEC SM-Q2 §3 le cycle de Coyne + template PORTE
  SEULE du VRAI Q4 : « le masquage est une possibilité à vérifier, pas
  un constat établi »). Descriptif causal — aucun nom de pathologie.
  Niveau d'une face D : Basse ≤ 2,5 (borne STABLE du cœur) · En veille
  entre 2,5 et 3,5 · Active ≥ 3,5 (SEUIL_DOMINANCE). Sur faces D à
  grain entier (1 item), 2,50 et 3,50 sont structurellement
  inatteignables PILE (documenté Section F du rapport SM-Q4 côté
  détresse) — consigné.
- R4 (qualité de mesure, D-GÉOMÉTRIE) : le VRAI est_dans_bande_exclue
  ([3,10 ; 4,90], σ_eff 0,30 — 3σ) est affiché honnêtement : dans la
  bande → la lecture de crise n'est ni affirmée ni écartée, le re-test
  est proposé. La bande au-dessus du seuil (4,00-4,90) n'est JAMAIS
  affichée hors crise (le court-circuit prime — vérifié sur toute
  l'énumération).
- R5 (anti-fabrication §5.5) : « rien à fabriquer » affiché ssi le VRAI
  label est STABLE — jamais sur CHARGE/MASQUE/MIXTE/CRISE ; le filet
  (3919/3114) affiché ssi CRISE exactement ; les faces A (aidant) et
  C2/C3 (contrat de soin), mesurées par l'instrument mais NON
  classifiantes en Q1 (VRAI cœur : classifier_dominance ne les lit
  pas), sont TRACÉES et jamais affichées comme lecture de gravité —
  elles reviennent avec RIO-12 (faces A) et la suite du parcours.
- R6 (vocabulaire écran, canon Partie 9) : aucun mot de la liste
  interdite dans tout texte affiché. EXCEPTION SOURCÉE consignée : le
  filet « 3919 (violences conjugales) / 3114 (détresse psychiatrique) »
  est le literal du VRAI moteur (ressource d'urgence, court-circuit
  P-FILTRE validé P1 à l'audit) — cité tel quel, jamais réécrit.
- R7 (D-SIM) : bandeau simulation sur chaque bloc écran.
- R8 (couplage pas réel) : le pas annoncé est celui du VRAI moteur pas
  SM (Q5) — palier_de(niv_det, niv_chg) avec niv_det MESURÉ ici (VRAI
  niveau_de de Q4 appliqué à la moyenne réelle des 3 faces D) et
  niv_chg BALAYÉ (FAIBLE/MOYEN/ÉLEVÉ — mesuré par RIO-12, jamais
  deviné). 🔴 → pas None (JAMAIS de pas de couple en crise, VRAI
  pas_de). Suivi 14 j sans sanction (VRAI statut_engagement_de) +
  re-test 8 semaines (arithmétique de dates, même sémantique que le
  vrai programmer_re_test émotionnel — consigné : arithmétique, pas une
  mesure).
- R9 (re-test 8 semaines) : S2 affiche un re-test proposé à 8 semaines ;
  la date est calculée (+56 jours ISO), jamais forcée.
"""

from __future__ import annotations

import hashlib
import importlib.util
import sys
from datetime import date, timedelta
from pathlib import Path

# ─────────────────────────────────────────────────────────────────────────────
# CHARGEMENT DES VRAIS MOTEURS (jamais recopiés, jamais modifiés)
# ─────────────────────────────────────────────────────────────────────────────
_PKG = Path(__file__).resolve().parents[1]           # …/validation-sm-q1-r3/correction-philosophique
_Q1 = _PKG.parent                                    # …/validation-sm-q1-r3
_SM = _Q1.parent                                     # …/validation-sm
_WTC = _SM.parent                                    # …/Wairyu thérapie couple


def _charge(nom: str, chemin: Path):
    spec = importlib.util.spec_from_file_location(nom, chemin)
    mod = importlib.util.module_from_spec(spec)
    sys.modules[nom] = mod
    spec.loader.exec_module(mod)
    return mod


# Le core sm-q1-r3 DOIT porter son nom canonique dans sys.modules (les
# fichiers de validation du package font `import wtc_sm_q1_core`).
core_q1 = _charge("wtc_sm_q1_core", _Q1 / "src" / "wtc_sm_q1_core.py")
core_q3 = _charge("wtc_sm_q3_core", _SM / "validation-sm-q3" / "src" / "wtc_sm_q3_core.py")
core_q4 = _charge("wtc_sm_q4_core", _SM / "validation-sm-q4" / "src" / "wtc_sm_q4_core.py")
core_q5 = _charge("wtc_sm_q5_core", _SM / "validation-sm-q5" / "src" / "wtc_sm_q5_core.py")

assert len(core_q3.FORCES_BANQUE) == 6 and core_q3.MAX_FORCES == 2
assert core_q3.SEUIL_ACTIVATION == 3.50 and len(core_q3.LABELS) == 4

# Vérification d'intégrité des moteurs chargés (ce sont bien les vrais) :
assert len(core_q1.FACES) == 9
assert len(core_q1.SOUS_ECHELLES) == 3
assert core_q1.SEUIL_DOMINANCE == 3.5 and core_q1.SEUIL_CRISE == 4.0
assert core_q1.SEUIL_MID == 3.00
assert core_q1.N_ITEMS_SM_C1 == 4 and core_q1.SIGMA_EFF_SM_C1 == 0.30
assert abs(core_q1.BANDE_EXCLUE_MIN - 3.10) < 1e-12
assert abs(core_q1.BANDE_EXCLUE_MAX - 4.90) < 1e-12
assert len(core_q1.CLASSIFICATIONS) == 5
assert len(core_q4.CONFIG_LABELS) == 9 and len(core_q4.TEMPLATES_CONFIG) == 9
assert core_q4.SEUIL_FAIBLE == 2.50 and core_q4.SEUIL_ELEVE == 3.50
assert core_q5.N_JOURS == 14 and core_q5.SEUIL_CELEBRE == 9
assert core_q5.pas_de(core_q5.PALIER_ROUGE) is None
assert len(core_q5.BANQUE_PAS[core_q5.PALIER_VERT]) == 3
assert len(core_q5.BANQUE_PAS[core_q5.PALIER_ORANGE]) == 3

# ─────────────────────────────────────────────────────────────────────────────
# CONSTANTES DE LA COUCHE (R1-R9)
# ─────────────────────────────────────────────────────────────────────────────
FACES_DETRESSE = ("SM-D1", "SM-D2", "SM-D3")

# Noms écran des faces D — sémantique du classifieur RÉEL (le cœur lit
# CHARGE quand SM-D1 domine, MASQUE quand SM-D2 domine — gitbook 04) :
NOM_FACE_ECRAN = {
    "SM-D1": "la rive qui se déclare",
    "SM-D2": "la rive tenue sous le masque",
    "SM-D3": "la troisième rive",
}

# Lecture d'une face D — niveaux posés sur les VRAIS seuils du cœur
# (2,5 = borne STABLE · 3,5 = SEUIL_DOMINANCE) — R3 :
NIVEAU_BAS, NIVEAU_VEILLE, NIVEAU_ACTIF = "Basse", "En veille", "Active"
RANG_NIVEAU = {NIVEAU_BAS: 0, NIVEAU_VEILLE: 1, NIVEAU_ACTIF: 2}

# Sémantique des labels du VRAI classifieur — descriptive, causale,
# ancrée dépôt (SPEC SM-Q2 §3 cycle de Coyne · template PORTE SEULE du
# VRAI Q4 mot pour mot) — R3 :
OMBRE_LABEL = {
    "STABLE": ("Les trois rives de la détresse restent basses : rien qui "
               "pèse en ce moment sur ta rive."),
    "CHARGE": ("La charge se déclare — elle se voit dehors, dans les "
               "journées et les échanges. Dans le cycle de Coyne, c'est le "
               "moment où le soutien demandé ne suffit jamais tout à fait : "
               "le nommer à deux évite que la rive s'use en silence."),
    "MASQUE": ("La détresse est tenue en silence — elle se lit dehors "
               "comme une distance, pas comme une demande. Le masquage est "
               "une possibilité à vérifier, pas un constat établi : ce que "
               "tu retiens pèse aussi sur l'autre, qui doit deviner."),
    "MIXTE": ("Plusieurs rives sont actives en même temps — la détresse ne "
              "se tient pas sur une seule face. C'est la zone de travail "
              "ordinaire : à deux, le plan des jours durs existe pour ça."),
}

EFFET_RELATION = {
    "SM-D1": ("l'autre reçoit l'intensité avant le sens — dans le cycle de "
              "Coyne, sa réponse ne suffit jamais tout à fait, et la rive "
              "de l'aidant s'use"),
    "SM-D2": ("l'autre doit deviner ce que tu retiens — le silence se lit "
              "dehors comme une distance"),
    "SM-D3": ("la tension se répartit sans se nommer — les échanges "
              "portent plus que ce qui est dit"),
}

RANG_LABEL = {"STABLE": 0, "CHARGE": 1, "MASQUE": 1, "MIXTE": 1, "CRISE": 2}
PALIER_DE_LABEL = {
    "STABLE": "🟢", "CHARGE": "🟠", "MASQUE": "🟠", "MIXTE": "🟠", "CRISE": "🔴",
}
PALIER_NOM = {"🟢": "Seul·e — exercice maison", "🟠": "À deux — module de couple",
              "🔴": "Avec un professionnel — orientation chaleureuse"}

MOTS_INTERDITS = (
    "pathologie", "diagnostic", "dépistage", "anxieux", "anxiété",
    "dépressif", "dépression", "trouble", "syndrome", "symptôme",
    "burn-out", "burnout", "addiction", "bipolaire", "borderline",
    "schizophrénie", "névrose", "psychose", "suicide", "médicament",
    "posologie", "chronique",
)

BANDEAU_DSIM = ("[D-SIM] Lecture issue d'une simulation — la mécanique est "
                "validée, pas la prévalence clinique.")

PHRASE_ORIENTATION = core_q5.LITTERAL_ORIENTATION   # VRAI literal de la quête pas SM

CLAUSE_AIDE = (
    "QUAND DEMANDER DE L'AIDE — seuils posés d'avance, les mêmes pour tout "
    "le monde : une lecture CRISE (SM-C1 ≥ 4,0 ou signal de sécurité H5 "
    "hérité) → le court-circuit s'affiche avec le filet 3919/3114, l'entrée "
    "en couple attend ; une lecture CHARGE, MASQUE ou MIXTE (hors crise) → "
    "à deux, et un re-test est proposé à 8 semaines ; une lecture STABLE → "
    "rien à fabriquer, la suite du parcours sert aussi à ça."
)

# Bandes de balayage de la charge de l'autre rive (mesurée par RIO-12) —
# les VRAIS niveaux de Q4/Q5, jamais devinés :
NIVEAUX_CHARGE = ("FAIBLE", "MOYEN", "ÉLEVÉ")

# ─────────────────────────────────────────────────────────────────────────────
# R1/R3 — NIVEAU DE FACE ET PALIER (purement mécaniques, via le VRAI moteur)
# ─────────────────────────────────────────────────────────────────────────────
def niveau_face_d(score: float) -> str:
    """R3 — niveau d'une face D via les VRAIS seuils du cœur :
    Active ≥ 3,5 (SEUIL_DOMINANCE) · En veille > 2,5 (borne STABLE) ·
    Basse ≤ 2,5. Sur grain entier, 2,50/3,50 PILE inatteignables (R3)."""
    if score >= core_q1.SEUIL_DOMINANCE:
        return NIVEAU_ACTIF
    if score > 2.5:
        return NIVEAU_VEILLE
    return NIVEAU_BAS


def palier_de_label(label: str) -> str:
    """R1 — image exacte du VRAI classifier_dominance (0 seuil ajouté)."""
    return PALIER_DE_LABEL[label]


def palier_et_seuils(profil: dict) -> dict:
    """R1/R2/R4 — lecture complète : label VRAI, palier, seuils S1/S2, bande.

    Args:
        profil : dict de réponses (entrées du VRAI cœur : faces D items
                 1-5, SM-C1-1..4, h5_actif).

    Returns:
        dict label, palier, palier_nom, niveaux, S1, S2, bande, crise.
    """
    crise = core_q1.detecter_crise(profil)
    label = core_q1.classifier_dominance(profil)
    palier = palier_de_label(label)
    niveaux = {f: niveau_face_d(float(profil[f])) for f in FACES_DETRESSE}
    sm_c1 = crise["sm_c1_score"]
    dans_bande = core_q1.est_dans_bande_exclue(sm_c1)
    return {
        "label": label,
        "palier": palier,
        "palier_nom": PALIER_NOM[palier],
        "niveaux": niveaux,
        "sm_c1": sm_c1,
        "dans_bande": bool(dans_bande),
        "crise": bool(crise["crise"]),
        "cause_crise": crise["cause"],
        "filet": crise["filet"],
        "S1": palier == "🔴",
        "S2": palier == "🟠",
    }


def palier_independant(d1: int, d2: int, d3: int, somme_c1: int,
                       h5: bool) -> dict:
    """COR2 — chemin de calcul INDÉPENDANT (entiers purs, zéro float).

    Recalcule label et palier depuis les items bruts sans passer par
    moyenne_face (SM-C1 : crise ⇔ moyenne ≥ 4,0 ⇔ somme des 4 items ≥ 16 ;
    dominance : face ≥ 3,5 ⇔ item ≥ 4 ; STABLE : toutes faces ≤ 2,5 ⇔
    item ≤ 2). Doit converger EXACTEMENT avec palier_et_seuils().
    """
    if somme_c1 >= 16 or h5:
        label = "CRISE"
    elif d1 <= 2 and d2 <= 2 and d3 <= 2:
        label = "STABLE"
    else:
        hautes = [f for f, v in ((1, d1), (2, d2)) if v >= 4]
        label = ("CHARGE" if hautes == [1] else
                 "MASQUE" if hautes == [2] else "MIXTE")
    return {"label": label, "palier": PALIER_DE_LABEL[label]}


# ─────────────────────────────────────────────────────────────────────────────
# R3/R5/R6 — TEXTES ÉCRAN (descriptif causal, sans étiquette)
# ─────────────────────────────────────────────────────────────────────────────
def _clause_ombre(face: str, niveau: str) -> str:
    nom = NOM_FACE_ECRAN[face]
    if niveau == NIVEAU_BAS:
        return (f"Zone calme : {nom} ne pèse pas sur ta rive en ce "
                "moment.")
    if niveau == NIVEAU_VEILLE:
        return (f"{nom.capitalize()} existe à bas bruit — présente sans se "
                f"déclarer : {EFFET_RELATION[face]}.")
    return (f"{nom.capitalize()} est active : {EFFET_RELATION[face]}. "
            "C'est un signal, pas un verdict.")


def _clause_exercice(label: str, niveaux: dict) -> str:
    """F3 — contenu du palier 🟢 (exercice maison), dérivé du module réel
    « Les Deux Rives » (programme ligne 133) et des lectures du cœur."""
    if label == "STABLE":
        return ("🟢 À ta portée, seul·e : noter chaque soir un mot sur ta "
                "rive — une ligne, une fois par jour (le pas « météo "
                "intérieure » du vrai moteur pas). Le motif apparaît seul.")
    actives = [f for f in FACES_DETRESSE if niveaux[f] == NIVEAU_ACTIF]
    f = actives[0] if actives else next(
        (f for f in FACES_DETRESSE if niveaux[f] == NIVEAU_VEILLE), "SM-D1")
    exercices = {
        "SM-D1": ("🟢 À ta portée, seul·e : préparer ta question pour la "
                  "Revue mensuelle — une ligne de ce qui a pesé cette "
                  "semaine, prête à être dite."),
        "SM-D2": ("🟢 À ta portée, seul·e : une chose retenue dite à voix "
                  "haute une fois par jour — une seule, choisie, "
                  "minuscule. Le masque baisse d'un rang, pas d'un coup."),
        "SM-D3": ("🟢 À ta portée, seul·e : le plan des jours durs sous les "
                  "yeux — relire ce qui est convenu pour les jours où ça "
                  "pèse, avant que le jour dur arrive."),
    }
    return exercices[f]


def _clause_module(label: str, niveaux: dict) -> str:
    """F3 — contenu du palier 🟠 (module de couple) — modules RÉELS du
    livrable « Les Deux Rives » (programme ligne 133) et de la vraie
    banque de pas 🟠 de Q5."""
    actives = [f for f in FACES_DETRESSE if niveaux[f] == NIVEAU_ACTIF]
    f = actives[0] if actives else None
    if f == "SM-D2":
        return ("🟠 À deux : le décodeur du masque — un temps fixe où ce "
                "qui est retenu peut être dit sans réponse immédiate. "
                "L'un partage, l'autre écoute, sans réparer.")
    if f == "SM-D1":
        return ("🟠 À deux : le signal d'alerte à deux — chacun nomme le "
                "moment où ça pèse chez l'autre, avec un mot convenu pour "
                "poser une pause. 15 minutes par semaine.")
    if f == "SM-D3":
        return ("🟠 À deux : ouvrir Le plan des jours durs et l'ajuster "
                "ensemble (pas réel 🟠 de la vraie banque de pas).")
    return ("🟠 À deux : tenir Les rituels de deux adultes une fois cette "
            "semaine (pas réel 🟠 de la vraie banque de pas).")


def clause_crise(crise: dict) -> str:
    """R2 — court-circuit MOT POUR MOT depuis le VRAI moteur."""
    return (f"Court-circuit sécurité — {crise['cause']}. Filet immédiat : "
            f"{crise['filet']}. {PHRASE_ORIENTATION}")


def clause_bande(dans_bande: bool, sm_c1: float) -> str:
    """R4 — le VRAI est_dans_bande_exclue affiché honnêtement."""
    if not dans_bande:
        return ("Ta mesure de contrôle du soin est nettement sous le seuil "
                "de crise — la lecture est posée.")
    return ("Ta mesure de contrôle du soin tombe dans la zone d'incertitude "
            "du seuil (bande 3σ du moteur, [3,10 ; 4,90]) : la lecture de "
            "crise n'est ni affirmée ni écartée — le re-test est proposé à "
            "8 semaines.")


def bloc_ecran(profil: dict, pal: dict) -> dict:
    """Assemble le bloc écran complet RIO-11 (toutes les clauses sont
    déterminées mécaniquement par les sorties du vrai cœur).

    R2 — en CRISE : court-circuit seul (le VRAI classifier_dominance ne
    lit pas les faces D en crise — afficher l'ombre serait fabriquer).
    R5 — les faces A et C2/C3, non classifiantes en Q1, sont TRACÉES et
    jamais affichées comme lecture.
    """
    if pal["crise"]:
        texte = "\n".join([BANDEAU_DSIM, clause_crise({
            "cause": pal["cause_crise"], "filet": pal["filet"]}),
            "Les lectures détaillées ne sont pas déployées aujourd'hui — "
            "le court-circuit passe avant tout. La mesure reste notée pour "
            "la suite du parcours."])
        return {
            "texte": texte,
            "md5": hashlib.md5(texte.encode("utf-8")).hexdigest(),
            "nb_mots_interdits": sum(1 for m in MOTS_INTERDITS
                                     if m in texte.lower()),
            "suspendu": False, "crise": True,
        }
    niveaux = pal["niveaux"]
    label = pal["label"]
    parties = [BANDEAU_DSIM]
    parties.append(
        "Ta rive se lit : "
        + " · ".join(f"{NOM_FACE_ECRAN[f]} — {niveaux[f].lower()}"
                     for f in FACES_DETRESSE)
        + f". Lecture du moteur : {label}.")
    for f in FACES_DETRESSE:
        parties.append(_clause_ombre(f, niveaux[f]))
    parties.append(OMBRE_LABEL[label])
    if label == "STABLE":
        # R5 — phrase anti-fabrication : le VRAI template zone_calme de la
        # quête pas (mot pour mot), réservé à la lecture STABLE :
        parties.append("> " + core_q5.TEMPLATES["zone_calme"])
    parties.append(clause_bande(pal["dans_bande"], pal["sm_c1"]))
    parties.append(f"CE QUE TU PEUX CHANGER — palier {pal['palier']} "
                   f"({pal['palier_nom']}) :")
    parties.append(_clause_exercice(label, niveaux))
    if pal["palier"] == "🟠":
        parties.append(_clause_module(label, niveaux))
    parties.append(CLAUSE_AIDE)
    texte = "\n".join(parties)
    return {
        "texte": texte,
        "md5": hashlib.md5(texte.encode("utf-8")).hexdigest(),
        "nb_mots_interdits": sum(1 for m in MOTS_INTERDITS
                                 if m in texte.lower()),
        "suspendu": False, "crise": False,
    }


# ─────────────────────────────────────────────────────────────────────────────
# R8 — BRANCHEMENT PAS (VRAI Q5) + COUPLE (VRAI Q4) — tables de junction
# ─────────────────────────────────────────────────────────────────────────────
def pas_possibles(niv_det: str) -> dict:
    """R8 — les pas possibles du répondant via le VRAI palier_de/pas_de.

    niv_det est MESURÉ ici (VRAI niveau_de sur la moyenne réelle des 3
    faces D) ; niv_chg est BALAYÉ (RIO-12 le mesurera, jamais deviné).
    Retour : {palier: [pas]} — le pas par défaut de la VRAIE banque pour
    chaque palier atteignable en variant uniquement la charge de l'autre.
    """
    table = {}
    for niv_chg in NIVEAUX_CHARGE:
        pal = core_q5.palier_de(niv_det, niv_chg)
        pas = core_q5.pas_de(pal)
        table.setdefault(pal, []).append(pas)
    return table


def configurations_couple(niv_det: str) -> dict:
    """F4 bloc 4 — configurations de couple atteignables via le VRAI Q4.

    Le VRAI configuration_de est balayé sur les niveaux de charge de
    l'autre rive (RIO-12). Retour : les configs nommées atteignables
    depuis la détresse MESURÉE ici.
    """
    configs = sorted({core_q4.configuration_de(niv_det, niv_chg)
                      for niv_chg in NIVEAUX_CHARGE})
    return {
        "niv_det_mesure": niv_det,
        "configurations_atteignables": configs,
        "configurations_total": len(core_q4.CONFIG_LABELS),
    }


def niveau_det_mesure(profil: dict) -> str:
    """R8 — le niveau de détresse MESURÉ par cette quête : le VRAI
    niveau_de de Q4 (bornes 2,50/3,50 — les mêmes que Q5) appliqué à la
    moyenne réelle des 3 faces D — la rive détresse de « Nos deux
    rives » (A1 du SPEC Q4 : la détresse se lit sur Q1, sans exception)."""
    moyenne = sum(float(profil[f]) for f in FACES_DETRESSE) / 3.0
    return core_q4.niveau_de(round(moyenne, 2))


def re_test_huit_semaines(depuis: str = "2026-01-01") -> str:
    """R9 — arithmétique de dates (+56 jours), même sémantique que le vrai
    programmer_re_test émotionnel (8 semaines). Arithmétique, pas une
    mesure — consigné."""
    d = date.fromisoformat(depuis)
    return (d + timedelta(weeks=8)).isoformat()


# ─────────────────────────────────────────────────────────────────────────────
# F4 — FRAGMENT DE BILAN L8 (7 blocs) — junctions VRAIES sm-q4/q5
# ─────────────────────────────────────────────────────────────────────────────
def bilan_fragment(profil: dict, pal: dict) -> dict:
    """Contribution de RIO-11 au bilan d'ensemble (assemblage L8 du canon).

    7 blocs : position · forme · empreinte · couple · force · limites ·
    palier/pas. Les blocs couple/pas pointent les VRAIS moteurs Q4
    (9 configurations) et Q5 (paliers + banque de pas + suivi).
    """
    scores_d = {f: float(profil[f]) for f in FACES_DETRESSE}
    ordre_faces = tuple(sorted(FACES_DETRESSE, key=lambda f: -scores_d[f]))
    ecart_12 = scores_d[ordre_faces[0]] - scores_d[ordre_faces[1]]
    niv_det = niveau_det_mesure(profil)
    pas_tab = pas_possibles(niv_det)
    configs = configurations_couple(niv_det)
    actives = [f for f in FACES_DETRESSE
               if pal["niveaux"][f] == NIVEAU_ACTIF]
    veille = [f for f in FACES_DETRESSE
              if pal["niveaux"][f] == NIVEAU_VEILLE]
    basses = [f for f in FACES_DETRESSE
              if pal["niveaux"][f] == NIVEAU_BAS]
    fragment = {
        "bloc_1_position": {
            "SM-D1": {"item": scores_d["SM-D1"],
                      "niveau": pal["niveaux"]["SM-D1"]},
            "SM-D2": {"item": scores_d["SM-D2"],
                      "niveau": pal["niveaux"]["SM-D2"]},
            "SM-D3": {"item": scores_d["SM-D3"],
                      "niveau": pal["niveaux"]["SM-D3"]},
            "SM-C1_moyenne": pal["sm_c1"],
            "dans_bande_exclue": pal["dans_bande"],
            "label_moteur": pal["label"],
            "qualite": "CRISE — court-circuit" if pal["crise"]
                       else "hors bande — lecture posée"
                       if not pal["dans_bande"]
                       else "dans bande — re-test proposé",
        },
        "bloc_2_forme": {
            "ordre_faces": ">".join(ordre_faces),
            "ecart_1_2": round(ecart_12, 2),
        },
        "bloc_3_empreinte": {
            "source": "RIO-12 — vrai moteur sm-q2 (l'aidant, faces A)",
            "labels_possibles": list(core_q2_labels_possibles()),
            "voies_crise_possibles": ["A2", "SM-C1", "H5"],
        },
        "bloc_4_couple": {
            "source": "RIO-14 — vrai moteur sm-q4 (les 9 configurations)",
            "niv_det_mesure": configs["niv_det_mesure"],
            "configurations_atteignables": configs["configurations_atteignables"],
            "configurations_total": configs["configurations_total"],
        },
        "bloc_5_force": {
            "source": "RIO-13 — vrai moteur sm-q3 (les 6 forces F-S1 à F-S6)",
            "note": ("les forces du lien se mesurent en RIO-13 — cette "
                     "quête ne les invente pas"),
            "forces_banque": [f[0] for f in core_q3_forces_banque()],
        },
        "bloc_6_limites": {
            "rives_actives": actives if actives
            else ["aucune face active — rien à fabriquer"],
            "rives_en_veille": veille if veille
            else ["aucune face en veille"],
            "rives_basses": basses if basses
            else ["aucune face basse"],
        },
        "bloc_7_palier_pas": {
            "palier": pal["palier"],
            "pas_possibles": {k: sorted({p for p in v if p is not None})
                              for k, v in pas_tab.items()
                              if any(p is not None for p in v)},
            "pas_en_crise": ("aucun pas de couple — le VRAI pas_de retourne "
                             "None sur 🔴 (D-CRISE) : l'orientation EST le "
                             "pas") if core_q5.PALIER_ROUGE in pas_tab else
            "non concerné — aucun palier 🔴 atteignable depuis cette lecture",
            "pas_labels": sorted({p for lst in pas_tab.values()
                                  for p in lst if p is not None}),
            "suivi_14_jours_sans_sanction": True,
            "retest": ("re-test RIO-11 proposé à 8 semaines — " +
                       re_test_huit_semaines()),
        },
    }
    fragment["_complet"] = all(
        v not in (None, "", [], {}) for v in _valeurs_feuilles(fragment)
    )
    return fragment


def core_q2_labels_possibles():
    """Les 5 labels réels de l'aidant (constante du VRAI moteur sm-q2)."""
    return ("STABLE", "ÉPUISÉ", "SURIMPLIQUÉ", "HOSTILE", "MIXTE")


def core_q3_forces_banque():
    """La VRAIE banque de forces du moteur sm-q3 (D-TABLE verrouillée)."""
    return core_q3.FORCES_BANQUE


def _valeurs_feuilles(obj):
    if isinstance(obj, dict):
        for v in obj.values():
            yield from _valeurs_feuilles(v)
    elif isinstance(obj, (list, tuple)):
        for v in obj:
            yield from _valeurs_feuilles(v)
    else:
        yield obj
