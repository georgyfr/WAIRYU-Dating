# -*- coding: utf-8 -*-
"""
WTC-SM-Q2 — COUCHE DE CORRECTION PHILOSOPHIQUE (fichier SUPPLÉMENTAIRE)
=======================================================================
RIO-12 « Ce que je porte pour toi » — rattrapage au gabarit universel
§5.1-§5.4 du canon (demande fondateur, même ordre que RIO-01→04 et
RIO-06→11 : fichiers SUPPLÉMENTAIRES, zéro modification de l'existant,
exactitude des calculs).

RÈGLE ABSOLUE : ce module NE MODIFIE AUCUN moteur existant.
- Le vrai cœur de la quête reste `validation-sm/validation-sm-q2/src/
  wtc_sm_q2_core.py` (portage verrouillé — 6 faces × 4 items, n_high sur
  les faces A ≥ 3,50, D-CRISE intégrale 3 voies, D-GÉOMÉTRIE bande
  [3,10 ; 4,90] sur les DEUX voies score, VALIDÉ contresigné) — importé
  tel quel, jamais recopié.
- Les junctions utilisent les VRAIS moteurs `validation-sm-q1-r3`
  (RIO-11 — la détresse), `validation-sm-q3` (la banque de forces),
  `validation-sm-q4` (RIO-14 — niveau_de, configuration_de) et
  `validation-sm-q5` (RIO-15 — palier_de, pas_de, BANQUE_PAS, TEMPLATES,
  LITTERAL_ORIENTATION).
- Cette couche ajoute ce que l'audit (Task 163) a trouvé manquant sur
  RIO-12 : F2 palier 🟢🟠🔴 dérivé MÉCANIQUEMENT du VRAI classifieur +
  QUAND DEMANDER DE L'AIDE (seuils S1/S2, voies réelles affichées)
  (22/25) ; F3 contenu des 3 paliers + branchement quête « pas »
  (12/25) ; F4 fragment de bilan L8 (7 blocs) (10/25). La lecture
  graduée F1 (25/25 — D-VÉRITÉ 24 items, D-CRISE 3 voies peuplées,
  D-GÉOMÉTRIE) est PRÉSERVÉE telle quelle.

Règles pré-enregistrées :
- R1 (palier, max-niveau, 0 seuil ajouté) : CRISE → 🔴 · STABLE → 🟢 ·
  ÉPUISÉ / SURIMPLIQUÉ / HOSTILE / MIXTE → 🟠. Image exacte du VRAI
  `classifier` (n_high sur les faces A ≥ 3,50 — SEUIL_CLASSIF réel).
- R2 (D-CRISE intégrale, court-circuit) : en CRISE l'écran affiche la
  cause MOT POUR MOT du VRAI `crise_de_scores` (voie A2 — surimplication
  sévère, contrôle coercitif potentiel — ou SM-C1 héritée, ou H5 hérité)
  + le filet 3919/3114, et RIEN d'autre (le vrai `classifier` court-
  circuite avant n_high). JAMAIS de pas de couple en crise.
- R3 (ombre causale, sans étiquette) : les 3 faces A lues avec leurs
  DÉFINITIONS réelles de la SPEC verrouillée §2 (A1 « L'épuisement » —
  la fatigue physique et émotionnelle du soutien (Zarit) · A2 « La
  surimplication » — quand je prends trop en charge, je décide pour
  l'autre · A3 « L'hostilité » — la critique qui s'installe (EE)) ;
  niveaux posés sur les VRAIS seuils (Basse ≤ 2,5 · En veille < 3,5 ·
  Active ≥ 3,5 — grain 0,25 : 2,50 et 3,50 PILE ATTEIGNABLES, bornes
  inclusives consignées).
- R4 (frontière descriptive) : les 3 faces B — « Le retrait », « La
  culpabilité », « La réparation » (définitions réelles SPEC §2) — sont
  affichées comme CE QU'ELLES SONT : descriptives, NON classifiantes
  (portage fidèle du verrouillage : « faces B descriptives, NON
  classifiantes en Q2 ») — elles ne mettent JAMAIS le répondant en
  🟠/🔴 et leur variation ne change ni label ni palier (prouvé).
- R5 (anti-fabrication §5.5) : « rien à fabriquer » = le VRAI template
  zone_calme de la quête pas, réservé à STABLE ; court-circuit ssi
  CRISE ; aucune invention de statut — le vrai moteur n'a que 5 labels
  + CRISE.
- R6 (vocabulaire écran) : 0 mot interdit ; EXCEPTION SOURCÉE : filet
  3919/3114 = literal du VRAI moteur (ressource d'urgence, validé P1).
- R7 (D-SIM) : bandeau simulation sur chaque bloc écran.
- R8 (couplage pas réel) : le pas annoncé = VRAI `palier_de`/`pas_de`
  de Q5 avec niv_chg MESURÉ ICI (VRAI `niveau_de` de Q4 sur la moyenne
  réelle des 3 faces A — la rive charge de « Nos deux rives », A1 du
  SPEC Q4 : la charge se lit sur Q2, sans exception) et niv_det BALAYÉ
  (RIO-11 l'a mesuré — le fragment liste les pas possibles en balayant
  ses niveaux réels, jamais devinés). 🔴 → aucun pas (D-CRISE).
- R9 (re-test 8 semaines) : arithmétique +56 j ISO, jamais forcée.
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
_PKG = Path(__file__).resolve().parents[1]           # …/validation-sm-q2/correction-philosophique
_Q2 = _PKG.parent                                    # …/validation-sm-q2
_SM = _Q2.parent                                     # …/validation-sm
_WTC = _SM.parent                                    # …/Wairyu thérapie couple


def _charge(nom: str, chemin: Path):
    spec = importlib.util.spec_from_file_location(nom, chemin)
    mod = importlib.util.module_from_spec(spec)
    sys.modules[nom] = mod
    spec.loader.exec_module(mod)
    return mod


core_q2 = _charge("wtc_sm_q2_core", _Q2 / "src" / "wtc_sm_q2_core.py")
core_q1 = _charge("wtc_sm_q1_core", _SM / "validation-sm-q1-r3" / "src" / "wtc_sm_q1_core.py")
core_q3 = _charge("wtc_sm_q3_core", _SM / "validation-sm-q3" / "src" / "wtc_sm_q3_core.py")
core_q4 = _charge("wtc_sm_q4_core", _SM / "validation-sm-q4" / "src" / "wtc_sm_q4_core.py")
core_q5 = _charge("wtc_sm_q5_core", _SM / "validation-sm-q5" / "src" / "wtc_sm_q5_core.py")

# Vérification d'intégrité des moteurs chargés (ce sont bien les vrais) :
assert len(core_q2.FACES) == 6 and len(core_q2.FACES_A) == 3
assert len(core_q2.FACES_B) == 3
assert core_q2.N_ITEMS_PAR_FACE == 4 and core_q2.ITEMS_TOTAL == 24
assert core_q2.SEUIL_CLASSIF == 3.50 and core_q2.SEUIL_CRISE == 4.00
assert core_q2.VOIE_HERITEE == "SM-C1"
assert len(core_q2.CLASSE_FACE) == 3 and len(core_q2.CLASSIFICATIONS) == 5
assert abs(core_q2.BANDE_MIN - 3.10) < 1e-12
assert abs(core_q2.BANDE_MAX - 4.90) < 1e-12
assert len(core_q1.FACES) == 9 and len(core_q4.CONFIG_LABELS) == 9
assert len(core_q3.FORCES_BANQUE) == 6 and core_q3.MAX_FORCES == 2
assert core_q5.N_JOURS == 14 and core_q5.SEUIL_CELEBRE == 9
assert core_q5.pas_de(core_q5.PALIER_ROUGE) is None

# ─────────────────────────────────────────────────────────────────────────────
# CONSTANTES DE LA COUCHE (R1-R9)
# ─────────────────────────────────────────────────────────────────────────────
FACES_A = core_q2.FACES_A
FACES_B = core_q2.FACES_B

# DÉFINITIONS réelles de la SPEC verrouillée §2 (mot pour mot, R3/R4) :
DEF_A = {
    "SM-A1": "la fatigue physique et émotionnelle du soutien",
    "SM-A2": "quand je prends trop en charge, je décide pour l'autre",
    "SM-A3": "la critique qui s'installe",
}
NOM_A = {"SM-A1": "L'épuisement", "SM-A2": "La surimplication",
         "SM-A3": "L'hostilité"}
DEF_B = {
    "SM-B1": "quand je me ferme pour me protéger",
    "SM-B2": "si tu vas mal, c'est ma faute",
    "SM-B3": "comment on se retrouve après une crise",
}
NOM_B = {"SM-B1": "Le retrait", "SM-B2": "La culpabilité",
         "SM-B3": "La réparation"}

EFFET_RELATION = {
    "SM-A1": ("l'aide donnée vide la rive qui la donne — dans le cycle de "
              "Coyne, la réponse ne suffit jamais et la fatigue s'installe"),
    "SM-A2": ("le soin glisse vers la décision à la place de l'autre — la "
              "frontière entre aider et décider bouge sans se dire"),
    "SM-A3": ("la critique devient le langage par défaut — l'autre reçoit "
              "l'attaque avant la demande"),
}

NIVEAU_BAS, NIVEAU_VEILLE, NIVEAU_ACTIF = "Basse", "En veille", "Active"

PALIER_DE_LABEL = {
    "STABLE": "🟢", "ÉPUISÉ": "🟠", "SURIMPLIQUÉ": "🟠", "HOSTILE": "🟠",
    "MIXTE": "🟠", "CRISE": "🔴",
}
PALIER_NOM = {"🟢": "Seul·e — exercice maison", "🟠": "À deux — module de couple",
              "🔴": "Avec un professionnel — orientation chaleureuse"}

OMBRE_LABEL = {
    "STABLE": ("La charge que tu portes reste tenable : rien qui déborde "
               "en ce moment sur ta rive d'aidant."),
    "ÉPUISÉ": ("Tu portes beaucoup et tu es fatigué·e — la présence tient, "
               "la rive s'use. Dans le cycle de Coyne, c'est le moment où "
               "l'aidant donne sans reprendre : le nommer évite le retrait."),
    "SURIMPLIQUÉ": ("Tu prends trop en charge — la frontière entre aider "
                    "et décider bouge. C'est le point de bascule où le "
                    "soin devient de la domination : ce que tu décides à "
                    "la place de l'autre lui reste à décider."),
    "HOSTILE": ("La critique s'est installée — l'émotion exprimée est "
                "montée. L'autre reçoit l'attaque avant la demande : "
                "nommer la critique, sans la condamner, est le premier "
                "pas pour la faire baisser."),
    "MIXTE": ("Plusieurs charges sont actives en même temps — épuisement, "
              "surimplication ou hostilité se tiennent ensemble. C'est la "
              "zone de travail ordinaire des aidants : à deux, pas seul·e."),
}

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

# Exception sourcée (même traitement que le filet) : le literal canon de la
# frontière co-étiquetée — programme ligne 133, repris MOT POUR MOT par la
# VRAIE banque de pas de Q5 — utilise « trouble » comme NOM DE CASE de
# l'outil (3 cases : trouble / toi / désaccord). Vocabulaire de l'outil,
# jamais une étiquette posée sur le répondant. La copie de contrôle du
# vocabulaire (R6) neutralise ce literal avant le décompte — consigné.
CANON_CASES = "3 cases : trouble / toi / désaccord"


def _texte_pour_controle(texte: str) -> str:
    """R6 — copie de contrôle : neutralise les literals moteurs sourcés."""
    return texte.replace(CANON_CASES, " ")

CLAUSE_AIDE = (
    "QUAND DEMANDER DE L'AIDE — seuils posés d'avance, les mêmes pour tout "
    "le monde : une voie de crise (SM-A2 ≥ 4,0 — surimplication sévère — "
    "ou SM-C1 héritée ≥ 4,0, ou signal de sécurité H5) → le court-circuit "
    "s'affiche avec le filet 3919/3114, l'entrée en couple attend ; une "
    "face A ≥ 3,5 (épuisement, surimplication ou hostilité dominante) ou "
    "une lecture MIXTE → à deux, et un re-test est proposé à 8 semaines ; "
    "une lecture STABLE → rien à fabriquer, la suite du parcours sert "
    "aussi à ça."
)

NIVEAUX_DETRESSE = ("FAIBLE", "MOYEN", "ÉLEVÉ")   # mesurés par RIO-11 (balayage)

# ─────────────────────────────────────────────────────────────────────────────
# R1/R3 — NIVEAU DE FACE ET PALIER (purement mécaniques, via le VRAI moteur)
# ─────────────────────────────────────────────────────────────────────────────
def niveau_face(score: float) -> str:
    """R3 — niveau d'une face via les VRAIS seuils du cœur :
    Active ≥ 3,5 (SEUIL_CLASSIF) · En veille > 2,5 (borne STABLE du
    verrouillage) · Basse ≤ 2,5. Grain 0,25 : 2,50/3,50 PILE atteignables
    (bornes inclusives — consigné)."""
    if score >= core_q2.SEUIL_CLASSIF:
        return NIVEAU_ACTIF
    if score > 2.5:
        return NIVEAU_VEILLE
    return NIVEAU_BAS


def palier_de_label(label: str) -> str:
    """R1 — image exacte du VRAI `classifier` (0 seuil ajouté)."""
    return PALIER_DE_LABEL[label]


def palier_et_seuils(profil: dict) -> dict:
    """R1/R2/R4 — lecture complète : label VRAI, palier, seuils S1/S2,
    voie de crise réelle, bande D-GÉOMÉTRIE."""
    crise = core_q2.detecter_crise(profil)
    label = core_q2.classifier(profil)
    palier = palier_de_label(label)
    niveaux_a = {f: niveau_face(core_q2.moyenne_face(profil, f))
                 for f in FACES_A}
    niveaux_b = {f: niveau_face(core_q2.moyenne_face(profil, f))
                 for f in FACES_B}
    a2 = crise["a2_score"]
    c1 = crise["sm_c1_score"]
    dans_bande = core_q2.est_dans_bande_exclue(c1, a2)
    return {
        "label": label,
        "palier": palier,
        "palier_nom": PALIER_NOM[palier],
        "niveaux_a": niveaux_a,
        "niveaux_b": niveaux_b,
        "scores_a": {f: core_q2.moyenne_face(profil, f) for f in FACES_A},
        "scores_b": {f: core_q2.moyenne_face(profil, f) for f in FACES_B},
        "a2": a2, "c1": c1,
        "dans_bande": bool(dans_bande),
        "crise": bool(crise["crise"]),
        "voie_crise": crise["voie"],
        "cause_crise": crise["cause"],
        "filet": crise["filet"],
        "S1": palier == "🔴",
        "S2": palier == "🟠",
    }


def palier_independant(s_a1: int, s_a2: int, s_a3: int, s_c1: int,
                       h5: bool) -> dict:
    """COR2 — chemin de calcul INDÉPENDANT (entiers purs, zéro float).

    Recalcule label et palier depuis les SOMMES brutes d'items (4 items
    par face) : crise ⇔ (s_a2 ≥ 16 ∨ s_c1 ≥ 16 ∨ h5) car moyenne ≥ 4,0 ⇔
    somme ≥ 16 ; face ≥ 3,5 ⇔ somme ≥ 14. STABLE ⇔ AUCUNE face A ≥ 3,5
    (le VRAI n_high_a : n = 0 → STABLE — une face entre 2,5 et 3,5 reste
    STABLE, la zone « En veille » est descriptive). Doit converger
    EXACTEMENT avec palier_et_seuils()."""
    if s_a2 >= 16 or s_c1 >= 16 or h5:
        label = "CRISE"
    elif s_a1 < 14 and s_a2 < 14 and s_a3 < 14:
        label = "STABLE"
    else:
        hautes = [(i, s) for i, s in (("SM-A1", s_a1), ("SM-A2", s_a2),
                                      ("SM-A3", s_a3)) if s >= 14]
        if len(hautes) == 1:
            label = core_q2.CLASSE_FACE[hautes[0][0]]
        else:
            label = "MIXTE"
    return {"label": label, "palier": PALIER_DE_LABEL[label]}


# ─────────────────────────────────────────────────────────────────────────────
# R3/R4/R5/R6 — TEXTES ÉCRAN (descriptif causal, sans étiquette)
# ─────────────────────────────────────────────────────────────────────────────
def _clause_ombre_a(face: str, niveau: str) -> str:
    nom, definition = NOM_A[face], DEF_A[face]
    if niveau == NIVEAU_BAS:
        return (f"Zone calme : {nom.lower()} — {definition} — ne pèse pas "
                "sur ta rive en ce moment.")
    if niveau == NIVEAU_VEILLE:
        return (f"{nom} existe à bas bruit — {definition} — par moments, "
                f"sans te diriger : {EFFET_RELATION[face]}.")
    return (f"{nom} est active — {definition} — : "
            f"{EFFET_RELATION[face]}. C'est un signal, pas un verdict.")


def _clause_frontiere_b(face: str, niveau: str) -> str:
    """R4 — les faces B, descriptives NON classifiantes : affichées comme
    ce qu'elles sont, jamais 🟠/🔴-drivantes."""
    nom, definition = NOM_B[face], DEF_B[face]
    if niveau == NIVEAU_BAS:
        return (f"{nom} — {definition} — reste discret en ce moment.")
    if niveau == NIVEAU_VEILLE:
        return (f"{nom} — {definition} — existe à bas bruit.")
    return (f"{nom} — {definition} — est présent : c'est un constat, pas "
            "un verdict — les faces frontière ne classent pas ici.")


def _clause_exercice(label: str, niveaux_a: dict) -> str:
    """F3 — contenu du palier 🟢 (exercice maison) — modules réels du
    livrable « Les Deux Rives » (programme ligne 133)."""
    if label == "STABLE":
        return ("🟢 À ta portée, seul·e : noter chaque soir un mot sur ta "
                "rive d'aidant — une ligne, une fois par jour (le pas "
                "« météo intérieure » du vrai moteur pas). Le motif "
                "apparaît seul.")
    actives = [f for f in FACES_A if niveaux_a[f] == NIVEAU_ACTIF]
    f = actives[0] if actives else next(
        (f for f in FACES_A if niveaux_a[f] == NIVEAU_VEILLE), "SM-A1")
    exercices = {
        "SM-A1": ("🟢 À ta portée, seul·e : tenir Les rituels de deux "
                  "adultes une fois cette semaine — un moment de deux "
                  "adultes, pas d'aidant et d'aidé."),
        "SM-A2": ("🟢 À ta portée, seul·e : noter ce que tu as décidé à "
                  "la place de l'autre cette semaine — une liste, sans "
                  "jugement. Ce qui revient est ta zone de frontière."),
        "SM-A3": ("🟢 À ta portée, seul·e : préparer ta question pour la "
                  "Revue mensuelle — ce qui a frotté cette semaine, dit "
                  "en demande, pas en critique."),
    }
    return exercices[f]


def _clause_module(label: str, niveaux_a: dict) -> str:
    """F3 — contenu du palier 🟠 (module de couple) — les VRAIS pas 🟠 de
    la banque de la quête pas (Q5), mot pour mot."""
    actives = [f for f in FACES_A if niveaux_a[f] == NIVEAU_ACTIF]
    f = actives[0] if actives else None
    if f == "SM-A2":
        return ("🟠 À deux : co-étiqueter la frontière (3 cases : trouble "
                "/ toi / désaccord) — le pas réel 🟠 de la vraie banque "
                "de pas.")
    if f == "SM-A1":
        return ("🟠 À deux : ouvrir Le plan des jours durs et l'ajuster "
                "ensemble — le pas réel 🟠 de la vraie banque de pas.")
    if f == "SM-A3":
        return ("🟠 À deux : un temps fixe où la critique peut être dite "
                "en demande — l'autre écoute sans réparer (le décodeur à "
                "deux).")
    return ("🟠 À deux : co-étiqueter la frontière (3 cases : trouble / "
            "toi / désaccord) — le pas réel 🟠 de la vraie banque de pas.")


def clause_crise(crise: dict) -> str:
    """R2 — court-circuit MOT POUR MOT depuis le VRAI `crise_de_scores`."""
    return (f"Court-circuit sécurité — voie {crise['voie']} : "
            f"{crise['cause']}. Filet immédiat : {crise['filet']}. "
            f"{PHRASE_ORIENTATION}")


def clause_bande(dans_bande: bool) -> str:
    """R4 — la VRAIE est_dans_bande_exclue (DEUX voies score) affichée."""
    if not dans_bande:
        return ("Tes deux mesures de crise (SM-A2 et le contrôle du soin "
                "hérité SM-C1) sont nettement hors de la bande "
                "d'incertitude — la lecture est posée.")
    return ("Au moins une de tes deux mesures de crise (SM-A2 ou le "
            "contrôle du soin hérité SM-C1) tombe dans la zone "
            "d'incertitude du seuil (bande 3σ du moteur, [3,10 ; 4,90]) : "
            "la lecture de crise n'est ni affirmée ni écartée — le "
            "re-test est proposé à 8 semaines.")


def bloc_ecran(profil: dict, pal: dict) -> dict:
    """Assemble le bloc écran complet RIO-12 (toutes les clauses sont
    déterminées mécaniquement par les sorties du vrai cœur).

    R2 — en CRISE : court-circuit seul. R4 — les faces B sont affichées
    comme descriptives, jamais classifiantes.
    """
    if pal["crise"]:
        texte = "\n".join([BANDEAU_DSIM, clause_crise({
            "voie": pal["voie_crise"], "cause": pal["cause_crise"],
            "filet": pal["filet"]}),
            "Les lectures détaillées ne sont pas déployées aujourd'hui — "
            "le court-circuit passe avant tout. La mesure reste notée "
            "pour la suite du parcours."])
        return {
            "texte": texte,
            "md5": hashlib.md5(texte.encode("utf-8")).hexdigest(),
            "nb_mots_interdits": sum(1 for m in MOTS_INTERDITS
                                     if m in _texte_pour_controle(
                                         texte).lower()),
            "crise": True,
        }
    niveaux_a, niveaux_b = pal["niveaux_a"], pal["niveaux_b"]
    label = pal["label"]
    parties = [BANDEAU_DSIM]
    parties.append(
        "Ta charge d'aidant se lit : "
        + " · ".join(f"{NOM_A[f].lower()} — {niveaux_a[f].lower()}"
                     for f in FACES_A)
        + f". Lecture du moteur : {label}.")
    for f in FACES_A:
        parties.append(_clause_ombre_a(f, niveaux_a[f]))
    parties.append(OMBRE_LABEL[label])
    parties.append("La frontière que tu gardes (descriptive — ne classe "
                   "pas) :")
    for f in FACES_B:
        parties.append(_clause_frontiere_b(f, niveaux_b[f]))
    if label == "STABLE":
        # R5 — phrase anti-fabrication : le VRAI template zone_calme de
        # la quête pas (mot pour mot), réservé à la lecture STABLE :
        parties.append("> " + core_q5.TEMPLATES["zone_calme"])
    parties.append(clause_bande(pal["dans_bande"]))
    parties.append(f"CE QUE TU PEUX CHANGER — palier {pal['palier']} "
                   f"({pal['palier_nom']}) :")
    parties.append(_clause_exercice(label, niveaux_a))
    if pal["palier"] == "🟠":
        parties.append(_clause_module(label, niveaux_a))
    parties.append(CLAUSE_AIDE)
    texte = "\n".join(parties)
    return {
        "texte": texte,
        "md5": hashlib.md5(texte.encode("utf-8")).hexdigest(),
        "nb_mots_interdits": sum(1 for m in MOTS_INTERDITS
                                 if m in _texte_pour_controle(
                                     texte).lower()),
        "crise": False,
    }


# ─────────────────────────────────────────────────────────────────────────────
# R8 — BRANCHEMENT PAS (VRAI Q5) + COUPLE (VRAI Q4) — tables de junction
# ─────────────────────────────────────────────────────────────────────────────
def niveau_charge_mesure(profil: dict) -> str:
    """R8 — le niveau de charge MESURÉ par cette quête : le VRAI
    `niveau_de` de Q4 (bornes 2,50/3,50) appliqué à la moyenne réelle des
    3 faces A — la rive charge de « Nos deux rives » (A1 du SPEC Q4 :
    la charge se lit sur Q2, sans exception)."""
    scores = [core_q2.moyenne_face(profil, f) for f in FACES_A]
    return core_q4.niveau_de(round(sum(scores) / len(scores), 2))


def pas_possibles(niv_chg: str) -> dict:
    """R8 — les pas possibles du couple via le VRAI palier_de/pas_de :
    niv_chg MESURÉ ici, niv_det BALAYÉ (mesuré par RIO-11)."""
    table = {}
    for niv_det in NIVEAUX_DETRESSE:
        pal = core_q5.palier_de(niv_det, niv_chg)
        pas = core_q5.pas_de(pal)
        table.setdefault(pal, []).append(pas)
    return table


def configurations_couple(niv_chg: str) -> dict:
    """F4 bloc 4 — configurations de couple atteignables via le VRAI Q4 :
    le VRAI configuration_de balayé sur les niveaux de détresse (RIO-11)."""
    configs = sorted({core_q4.configuration_de(niv_det, niv_chg)
                      for niv_det in NIVEAUX_DETRESSE})
    return {
        "niv_chg_mesure": niv_chg,
        "configurations_atteignables": configs,
        "configurations_total": len(core_q4.CONFIG_LABELS),
    }


def re_test_huit_semaines(depuis: str = "2026-01-01") -> str:
    """R9 — arithmétique de dates (+56 jours), jamais forcée."""
    d = date.fromisoformat(depuis)
    return (d + timedelta(weeks=8)).isoformat()


# ─────────────────────────────────────────────────────────────────────────────
# F4 — FRAGMENT DE BILAN L8 (7 blocs) — junctions VRAIES sm-q1/q4/q5
# ─────────────────────────────────────────────────────────────────────────────
def bilan_fragment(profil: dict, pal: dict) -> dict:
    """Contribution de RIO-12 au bilan d'ensemble (assemblage L8 du canon).

    7 blocs : position · forme · empreinte · couple · force · limites ·
    palier/pas. Les blocs couple/pas pointent les VRAIS moteurs Q4 et Q5.
    """
    scores_a = pal["scores_a"]
    ordre_faces = tuple(sorted(FACES_A, key=lambda f: -scores_a[f]))
    ecart_12 = scores_a[ordre_faces[0]] - scores_a[ordre_faces[1]]
    niv_chg = niveau_charge_mesure(profil)
    pas_tab = pas_possibles(niv_chg)
    configs = configurations_couple(niv_chg)
    actives = [f for f in FACES_A if pal["niveaux_a"][f] == NIVEAU_ACTIF]
    veille = [f for f in FACES_A if pal["niveaux_a"][f] == NIVEAU_VEILLE]
    basses = [f for f in FACES_A if pal["niveaux_a"][f] == NIVEAU_BAS]
    fragment = {
        "bloc_1_position": {
            "SM-A1": {"score": scores_a["SM-A1"],
                      "niveau": pal["niveaux_a"]["SM-A1"]},
            "SM-A2": {"score": scores_a["SM-A2"],
                      "niveau": pal["niveaux_a"]["SM-A2"]},
            "SM-A3": {"score": scores_a["SM-A3"],
                      "niveau": pal["niveaux_a"]["SM-A3"]},
            "SM-C1_heritee": pal["c1"],
            "dans_bande_exclue": pal["dans_bande"],
            "label_moteur": pal["label"],
            "voie_crise": pal["voie_crise"] if pal["crise"]
            else "aucune — hors crise",
            "qualite": "CRISE — court-circuit" if pal["crise"]
                       else "hors bande — lecture posée"
                       if not pal["dans_bande"]
                       else "dans bande — re-test proposé",
        },
        "bloc_2_forme": {
            "ordre_faces_a": ">".join(ordre_faces),
            "ecart_1_2": round(ecart_12, 2),
        },
        "bloc_3_empreinte": {
            "source": "RIO-11 — vrai moteur sm-q1-r3 (la détresse)",
            "labels_possibles": ["STABLE", "CHARGE", "MASQUE", "MIXTE",
                                 "CRISE"],
            "voies_crise_possibles": ["SM-C1", "H5"],
        },
        "bloc_4_couple": {
            "source": "RIO-14 — vrai moteur sm-q4 (les 9 configurations)",
            "niv_chg_mesure": configs["niv_chg_mesure"],
            "configurations_atteignables": configs["configurations_atteignables"],
            "configurations_total": configs["configurations_total"],
        },
        "bloc_5_force": {
            "source": "RIO-13 — vrai moteur sm-q3 (les 6 forces F-S1 à F-S6)",
            "note": ("les forces du lien se mesurent en RIO-13 — cette "
                     "quête ne les invente pas"),
            "forces_banque": [f[0] for f in core_q3.FORCES_BANQUE],
        },
        "bloc_6_limites": {
            "faces_a_actives": actives if actives
            else ["aucune face active — rien à fabriquer"],
            "faces_a_en_veille": veille if veille
            else ["aucune face en veille"],
            "faces_a_basses": basses if basses
            else ["aucune face basse"],
            "frontiere_b_descriptive": {f: pal["niveaux_b"][f]
                                        for f in FACES_B},
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
            "retest": ("re-test RIO-12 proposé à 8 semaines — " +
                       re_test_huit_semaines()),
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
