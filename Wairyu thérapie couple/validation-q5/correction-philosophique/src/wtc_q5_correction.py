# -*- coding: utf-8 -*-
"""
WTC-Q5 — COUCHE DE CORRECTION PHILOSOPHIQUE (fichier SUPPLÉMENTAIRE)
====================================================================
RIO-05 « Mon premier pas » — rattrapage au gabarit universel §5.1-§5.4
du canon (demande fondateur, même ordre que RIO-01→04 et RIO-06→18 :
fichiers SUPPLÉMENTAIRES, zéro modification de l'existant, exactitude des
calculs).

RÈGLE ABSOLUE : ce module NE MODIFIE AUCUN moteur existant.
- Le vrai moteur de la quête reste `validation-q5/src/wtc_q5_core.py`
  (face dominante Q1 × empreinte Q2 → 6 pas, suivi 14 jours, rappels
  doux, re-test 8 semaines) — importé tel quel, jamais recopié.
- Le vrai simulateur archivé est `wtc_q5_simulator.py` (seed 42, 180
  profils : 3 groupes × 60, `pas_vrai` D-VÉRITÉ) — utilisé par le
  pipeline pour le re-score bit-exact.
- Les junctions utilisent les VRAIS moteurs `validation-q1-r1` (les
  VRAIS scores d'axes — moyennes de 9 items corrigés, grain 1/9 arrondi
  2 décimales — RIO-01), `validation-q2-r1` (les VRAIS labels d'ombre
  produits par le VRAI `nommage` — RIO-02) et `validation-q4` (le VRAI
  croisement de couple — RIO-04), plus le palier de couple de la VRAIE
  correction RIO-04 (importée telle quelle — cohérence bit-exact).

CE QUE CETTE COUCHE AJOUTE (audit Task 163 : RIO-05 = 67 %, F1 20 ·
F2 12/25 · F3 20/25 · F4 15/25 — F3 part haut parce que le pas + le suivi
14 j + les messages anti-perfectionnisme sont déjà validés P1 par le
package : ils sont PRÉSERVÉS tels quels) :
- F2 : le palier 🟢🟠🔴 PLANCHER HÉRITÉ (le VRAI seuil 2,61 du cœur, lu
  sur les DEUX axes sA/sB que ce moteur reçoit) + « QUAND DEMANDER DE
  L'AIDE » (S1 = les deux axes hauts ; S2 = exactement un axe haut —
  re-test 8 semaines) + la doctrine du pas appliquée et affichée : le
  pas est une LECTURE DU PALIER — choisi jamais prescrit, célébré jamais
  sanctionné, compteur privé.
- F3 : le contenu existant (pas réel + suivi réel + rappels doux réels +
  re-test réel) est PRÉSERVÉ et complété par le contenu du palier
  (l'aide affichée selon le plancher, sans jamais prescrire).
- F4 : fragment de bilan L8 à 7 blocs avec junctions réelles.

Chaque règle est PRÉ-ENREGISTRÉE et dérivée mécaniquement des sorties du
vrai moteur — zéro invention de mesure.

Règles pré-enregistrées :
- R1 (palier plancher individuel) : dérivé MÉCANIQUEMENT des sorties du
  VRAI cœur — ZÉRO seuil numérique ajouté : mapping catégoriel pur sur
  le VRAI seuil 2,61 (le littéral de `face_dominante` / `type_attachement`,
  épinglé à l'import par asserts sur le comportement réel des deux cœurs)
  lu sur les DEUX axes reçus (sA, sB) : 🔴 ssi sA ≥ 2,61 ET sB ≥ 2,61
  (les deux axes hauts — le « en alerte » de la correction RIO-04,
  cohérence consignée) · 🟠 ssi EXACTEMENT UN des deux axes ≥ 2,61 ·
  🟢 ssi aucun.
  NOTE D'EXACTITUDE consignée : la face seule (`face_dominante`) NE
  SUFFIT PAS — SUR_LA_RA couvre à la fois l'espace 🔴 (sA ≥ 2,61 aussi)
  et l'espace 🟠 (sA < 2,61, garde seule) ; la lecture palier est sur les
  axes bruts que le moteur reçoit (prouvé en validation : même face,
  paliers différents).
  PLANCHER consigné : le palier lit les axes Q1 reçus — la vraie gravité
  peut être plus haute (le filet de l'app reste porté par RIO-02), jamais
  plus basse (le moteur ne reçoit pas les construits aval).
- R2 (S1) : les deux axes ≥ 2,61 → orientation chaleureuse proposée
  (« le chemin le plus court est de ne pas le porter seul·e —
  l'orientation vers un professionnel de la relation n'est pas un échec,
  c'est le pas qui compte ici ») — le pas reste choisi, jamais prescrit.
- R3 (S2) : exactement un axe ≥ 2,61 → à surveiller + re-test Q1 à
  8 semaines (le VRAI `programmer_re_test_q1`, jamais forcé) — tout
  palier non-VERT est AUSSI un moment « demander de l'aide » (leçon
  RIO-16).
- R4 (qualité avant sens) : le suivi est un COMPTEUR PRIVÉ (jamais
  exposé socialement — le vrai `bilan_du_pas`) ; les 3 catégories du VRAI
  `suivre_14_jours` (CELEBRE ≥ 9 · AJUSTEMENT 7-8 · REPRISE ≤ 6) sont des
  statuts-information — JAMAIS de sanction (sanction = None, structurel) ;
  aucun gate RQS sur cet instrument — aucune suspension inventée
  (l'entrée RQS de l'app n'est pas branchée sur ce cœur de validation).
- R5 (anti-fabrication) : le pas affiché est EXACTEMENT celui du VRAI
  `selectionner_pas` (trace Q1_face/Q2_empreinte réelle) ; le template
  cité est le VRAI `TEMPLATES_PAS[pas]` ; le fallback P1 est prouvé
  INATTEIGNABLE via le flux normal (`empreinte()` normalise tout label —
  connu, inconnu ou None — vers les 3 empreintes, et la face est toujours
  l'une des 3 : les 9 paires sont toutes dans `_PAS_TABLE`) ; JAMAIS de
  pas fabriqué.
- R6 (anti-perfectionnisme) : les 3 templates réels de suivi (CELEBRE /
  AJUSTEMENT / REPRISE) cités mot pour mot — « les jours manqués ne sont
  pas une faute » ; les rappels doux du vrai moteur (J1/J7/J14) ; leçon
  D-Q5-1 respectée par le marqueur (« pas une obligation » est
  ANTI-culpabilisant — jamais compté comme interdit).
- R7 (vocabulaire écran, canon Partie 9 + liste anti-blâme de la
  correction RIO-04 étendue) : 0 mot interdit dans tout texte affiché ;
  les noms de code internes (RASSUREE/EN_QUETE/SUR_LA_RA) ne sont pas des
  textes écran — les libellés affichés sont français et sans mot interdit ;
  D-CRISE non applicable à cet instrument (consigné — aucun construit
  d'auto-danger mesuré par ce cœur ; le filet de l'app reste porté par
  RIO-02) — remplacé par S1/S2.
- R8 (D-SIM) : bandeau simulation sur chaque bloc écran.
- R9 (couplage réel) : TOUS les héritages sont mesurés par les quêtes
  amont (RIO-01 axes via q1-r1, RIO-02 ombre via q2-r1) et balayés ici
  sur leurs valeurs réelles, jamais devinés ; la junction couple lit le
  VRAI croisement RIO-04 — UNIQUEMENT quand les données de l'autre rive
  sont mesurées et passées (sinon consignation explicite, jamais une
  invention ni une feuille vide).
"""

from __future__ import annotations

import hashlib
import importlib.util
import sys
from pathlib import Path

_PKG = Path(__file__).resolve().parents[1]           # …/validation-q5/correction-philosophique
_Q5 = _PKG.parent                                    # …/validation-q5
_WTC = _Q5.parent                                    # …/Wairyu thérapie couple


def _charge(nom: str, chemin: Path):
    spec = importlib.util.spec_from_file_location(nom, chemin)
    mod = importlib.util.module_from_spec(spec)
    sys.modules[nom] = mod
    spec.loader.exec_module(mod)
    return mod


core_q5 = _charge("wtc_q5_core", _Q5 / "src" / "wtc_q5_core.py")
core_q1 = _charge("wtc_q1_core", _WTC / "validation-q1-r1" / "src" / "wtc_q1_core.py")
core_q2 = _charge("wtc_q2_core", _WTC / "validation-q2-r1" / "src" / "wtc_q2_core.py")
core_q4 = _charge("wtc_q4_core", _WTC / "validation-q4" / "src" / "wtc_q4_core.py")
corr_q4 = _charge("wtc_q4_correction",
                  _WTC / "validation-q4" / "correction-philosophique" / "src" / "wtc_q4_correction.py")

# Vérification d'intégrité des moteurs chargés (ce sont bien les vrais) :
assert len(core_q5.FACES) == 3 and len(core_q5.EMPREINTES) == 3
assert len(core_q5._PAS_TABLE) == 9 and len(core_q5.PAS_BANQUE) == 6
assert len(core_q5.TEMPLATES_PAS) == 6 and len(core_q5.TEMPLATES_SUIVI) == 3
assert len(core_q5.TEMPLATES_RAPPELS) == 3
assert core_q5.SEUIL_CELEBRE == 9 and core_q5.SEUIL_AJUSTEMENT == 7
assert core_q5.verifier_templates()["ok"]
assert core_q5.verifier_anti_perfectionnisme()["ok"]
assert core_q5.verifier_rappels_doux()["ok"]        # leçon D-Q5-1 intégrée au marqueur réel
assert core_q1.N_ITEMS == 18 and core_q1.ECHELLE_MIN == 1 and core_q1.ECHELLE_MAX == 4
assert core_q1.ITEMS_INVERSES == (5, 15)
assert len(core_q1.AXES["A"]["items"]) == 9 and len(core_q1.AXES["B"]["items"]) == 9
assert core_q2.verifier_templates() == []
assert len(core_q4.CONFIGS_9) == 9 and len(core_q4.TEMPLATES_CONFIGS) == 9
assert core_q4.verifier_templates()["ok"]
assert core_q4.verifier_symetrie()["ok"]
assert core_q4.verifier_non_blamant()["ok"]
# Junction au palier de couple de la VRAIE correction RIO-04 (importée
# telle quelle) — cohérence épinglée à l'import :
assert corr_q4.palier_couple("FEU_CROISE", False)["palier"] == "🔴"
assert corr_q4.palier_couple("BASE_SEREINE", False)["palier"] == "🟢"
# Toute paire de types réels donne une configuration nommée (jamais None) :
assert all(core_q4.identifier_configuration(t1, t2)
           for t1 in core_q4.TYPES_ATTACH for t2 in core_q4.TYPES_ATTACH)
# Épinglage du littéral 2,61 au COMPORTEMENT RÉEL des deux cœurs (aucun
# seuil nouveau — le même tranchage inclusif ≥ que le VRAI code) :
assert core_q5.face_dominante(2.61, 2.0) == "EN_QUETE"
assert core_q5.face_dominante(2.60, 2.0) == "RASSUREE"
assert core_q5.face_dominante(2.0, 2.61) == "SUR_LA_RA"
assert core_q5.face_dominante(2.0, 2.60) == "RASSUREE"
assert core_q4.type_attachement(2.61, 2.61) == "EN_ALERTFEU"
assert core_q4.type_attachement(2.60, 2.60) == "SEREIN"

# La source de traçabilité du VRAI flux (épinglée à une sortie réelle —
# jamais retapée à la main) :
_SOURCE_FLUX = core_q5.selectionner_pas(2.0, 2.0, "ZONE CALME")["trace"]["source"]

# ─────────────────────────────────────────────────────────────────────────────
# CONSTANTES DE LA COUCHE (R1-R9)
# ─────────────────────────────────────────────────────────────────────────────
SEUIL_AXES_COEUR = 2.61   # le littéral du VRAI cœur (face_dominante / type_attachement)

PALIER_NOM = {"🟢": "Seul·e — le pas du cœur", "🟠": "À deux — guidé",
              "🔴": "Avec un professionnel — orientation chaleureuse"}

# Libellés écran FRANÇAIS (les noms de code internes du cœur ne sont pas
# des textes écran — R7) :
FACE_LABELS = {"RASSUREE": "Rassurée", "EN_QUETE": "En quête",
               "SUR_LA_RA": "Sur la réserve"}
EMPREINTE_LABELS = {"ZONE_CALME": "Zone calme",
                    "PEUR_DE_PERDRE": "Peur de perdre",
                    "PEUR_D_ETRE_ETOUFFEE": "Peur d'être étouffée"}

MOTS_INTERDITS = (
    "pathologie", "diagnostic", "dépistage", "anxieux", "anxiété",
    "évitement", "évitant", "évitante", "désorganisé", "trouble",
    "syndrome", "désordre", "symptôme", "névrosisme", "narcissisme",
    "jalousie",
)

# Liste anti-blâme de la correction RIO-04 (verifier_non_blamant) —
# étendue à la couche entière (les mêmes interdits, le même esprit) :
MOTS_BLAME = (
    "ta faute", "ton tort", "c'est toi", "tu poursuis", "tu recules",
    "tu avances", "c'est lui", "c'est elle", "il poursuit", "elle poursuit",
    "%",
)

# Direction de boucle calculée par le VRAI moteur RIO-04 mais JAMAIS
# affichée (la danse est nommée ENSEMBLE) :
DIRECTIONS_CACHEES = ("P1_AVANCE_P2_RECULE", "P2_AVANCE_P1_RECULE")
DIRECTION_NOTE = ("calculée par le VRAI moteur, jamais affichée — la danse "
                  "est nommée ENSEMBLE")

MONO_MESURE = ("mono-partenaire — l'autre rive n'est pas encore mesurée — "
               "le croisement RIO-04 la lira quand elle sera mesurée")
BI_MESURE = "les deux rives mesurées"

BANDEAU_DSIM = ("[D-SIM] Lecture issue d'une simulation — la mécanique est "
                "validée, pas la prévalence clinique.")
PHRASE_ORIENTATION = ("le chemin le plus court est de ne pas le porter "
                      "seul·e — l'orientation vers un professionnel de la "
                      "relation n'est pas un échec, c'est le pas qui compte "
                      "ici")
NOTE_PAS = ("Ton pas est une lecture de ton palier — choisi, jamais "
            "prescrit ; célébré, jamais sanctionné. Le compteur est privé, "
            "jamais exposé socialement.")
NOTE_PLANCHER = ("Gravité lue en plancher hérité (RIO-01 — les deux axes de "
                 "ta carte que ce moteur reçoit, le même seuil 2,61 du "
                 "cœur) : c'est une borne basse — la vraie gravité peut "
                 "être plus haute (le filet de l'app reste porté par "
                 "RIO-02), jamais plus basse.")


# ─────────────────────────────────────────────────────────────────────────────
# R1/R2/R3 — PALIER PLANCHER HÉRITÉ (VRAI seuil 2,61 du cœur) + SEUILS D'AIDE
# ─────────────────────────────────────────────────────────────────────────────
def palier_axes(sA: float, sB: float) -> dict:
    """R1/R2/R3 — palier plancher sur les DEUX axes reçus (sA, sB).

    Mapping catégoriel pur sur le VRAI seuil 2,61 du cœur — ZÉRO seuil
    numérique ajouté. 🔴 ssi les DEUX axes ≥ 2,61 (le « en alerte » de la
    correction RIO-04) · 🟠 ssi EXACTEMENT UN ≥ 2,61 · 🟢 ssi aucun.
    La face seule ne suffit pas (consigné) — la lecture est sur les axes
    bruts ; PLANCHER : la vraie gravité peut être plus haute, jamais plus
    basse.
    """
    haut_a = sA >= SEUIL_AXES_COEUR
    haut_b = sB >= SEUIL_AXES_COEUR
    n_hauts = int(haut_a) + int(haut_b)
    if n_hauts == 2:
        palier = "🔴"
    elif n_hauts == 1:
        palier = "🟠"
    else:
        palier = "🟢"
    return {
        "hauts": {"A": haut_a, "B": haut_b}, "n_hauts": n_hauts,
        "palier": palier, "palier_nom": PALIER_NOM[palier],
        "S1": palier == "🔴", "S2": palier == "🟠",
        "face": core_q5.face_dominante(sA, sB),
        "plancher": True,
    }


def palier_independant(kA: int, kB: int) -> dict:
    """COR2 — chemin INDÉPENDANT (entiers purs : sommes d'items 9-36,
    grain 1/9). La frontière 2,61 tombe STRICTEMENT entre les sommes 23
    (2,56) et 24 (2,67) — prouvé en COR0 sur l'espace réel des moyennes
    du VRAI scores_axes — donc « axe haut » ⇔ somme ≥ 24. Aucun appel au
    moteur, aucun float."""
    haut_a = kA >= 24
    haut_b = kB >= 24
    n = int(haut_a) + int(haut_b)
    palier = "🔴" if n == 2 else ("🟠" if n == 1 else "🟢")
    return {"hauts": {"A": haut_a, "B": haut_b}, "n_hauts": n,
            "palier": palier, "S1": n == 2, "S2": palier == "🟠"}


def clause_orientation() -> str:
    """R2 — clause S1 : orientation chaleureuse (les deux axes hauts)."""
    return ("Seuil atteint : tes deux axes hérités (RIO-01) sont lus hauts "
            "(plancher, le même seuil 2,61 du cœur) — l'orientation est "
            "proposée. " + PHRASE_ORIENTATION[:1].upper()
            + PHRASE_ORIENTATION[1:] + ".")


def clause_surveillance() -> str:
    """R3 — clause S2 : à surveiller + re-test Q1 à 8 semaines (le VRAI
    `programmer_re_test_q1`, jamais forcé)."""
    return ("Seuil approché : un de tes deux axes hérités (RIO-01) est lu "
            "haut (plancher, le même seuil 2,61 du cœur) — à surveiller, "
            "re-test Q1 proposé à 8 semaines (programmée, jamais forcée).")


def clause_aide_standing() -> str:
    """QUAND DEMANDER DE L'AIDE — seuils posés d'avance, les mêmes pour
    tout le monde (leçon RIO-16 : tout palier non-VERT est AUSSI un moment
    « demander de l'aide »)."""
    return ("QUAND DEMANDER DE L'AIDE — seuils posés d'avance, les mêmes "
            "pour tout le monde : les deux axes ≥ 2,61 (RIO-01, plancher) "
            "→ parler à un professionnel de la relation est proposé ; "
            "exactement un axe ≥ 2,61 → à surveiller, re-test Q1 proposé à "
            "8 semaines ; et quoi qu'il en soit : le pas reste choisi, "
            "jamais prescrit — célébré, jamais sanctionné, compteur privé.")


def _texte_sain(texte: str) -> int:
    """Compte les violations vocabulaire (canon Partie 9 + anti-blâme
    RIO-04 + directions cachées). Leçon D-Q5-1 respectée : « pas une
    obligation » n'est pas dans les listes — c'est l'inverse d'un
    interdit."""
    bas = texte.lower()
    return (sum(1 for m in MOTS_INTERDITS if m in bas)
            + sum(1 for m in MOTS_BLAME if m in bas)
            + sum(1 for d in DIRECTIONS_CACHEES if d in texte))


def _label_affiche(label_ombre) -> str:
    """Le label réellement reçu, dit tel quel (jamais une feuille vide)."""
    if label_ombre is None:
        return "aucun label transmis (None) — normalisé par le VRAI empreinte()"
    if not str(label_ombre).strip():
        return "label vide — normalisé par le VRAI empreinte()"
    return str(label_ombre)


# ─────────────────────────────────────────────────────────────────────────────
# R9 — JUNCTION COUPLE (VRAI croisement RIO-04) — seulement si les deux
# rives sont MESURÉES et passées
# ─────────────────────────────────────────────────────────────────────────────
def lecture_couple(sA1: float, sB1: float, sA2: float, sB2: float) -> dict:
    """Lit le croisement EXCLUSIVEMENT par les fonctions réelles du cœur
    RIO-04 (types, percentiles, boucle, configuration) + le palier de
    couple de la VRAIE correction RIO-04. Les axes transmis sont les axes
    bruts mesurés de chaque rive — la correction L6 (styles) reste du
    ressort de la carte RIO-04 elle-même (consigné)."""
    t1 = core_q4.type_attachement(sA1, sB1)
    t2 = core_q4.type_attachement(sA2, sB2)
    pct1 = core_q4.convertir_percentile(sA1, sB1)
    pct2 = core_q4.convertir_percentile(sA2, sB2)
    boucle = core_q4.boucle_poursuite_retrait(pct1, pct2)
    config = core_q4.identifier_configuration(t1, t2)
    pal_c = corr_q4.palier_couple(config, boucle["boucle_probable"])
    return {
        "source": ("RIO-04 — vrai croisement q4 (type_attachement · "
                   "convertir_percentile · boucle_poursuite_retrait · "
                   "identifier_configuration) + palier de couple de la "
                   "correction RIO-04 (importée telle quelle)"),
        "mesure": BI_MESURE,
        "type_rive_1": t1, "type_rive_2": t2,
        "percentile_rive_1": pct1, "percentile_rive_2": pct2,
        "ecart_points": boucle["ecart"],
        "boucle_probable": boucle["boucle_probable"],
        "direction": DIRECTION_NOTE,
        "configuration": config,
        "template_mot_pour_mot": core_q4.TEMPLATES_CONFIGS[config],
        "palier_couple": pal_c["palier"],
        "palier_couple_nom": pal_c["palier_nom"],
    }


# ─────────────────────────────────────────────────────────────────────────────
# F3 — BLOC ÉCRAN — l'affichage RÉEL du moteur + les couches manquantes
# ─────────────────────────────────────────────────────────────────────────────
def bloc_ecran(pas_sel: dict, suivi: dict, pal: dict, retest_msg: str) -> dict:
    """Assemble le bloc écran complet RIO-05 — templates réels cités mot
    pour mot (pas, suivi, 3 rappels, re-test = 6 citations « > »), palier
    plancher affiché honnêtement, doctrine du pas + aide debout."""
    parties = [BANDEAU_DSIM]
    parties.append("> " + pas_sel["template"])
    parties.append(f"Ton palier hérité se lit {pal['palier']} "
                   f"({pal['palier_nom']}).")
    if pal["S1"]:
        parties.append(clause_orientation())
    if pal["S2"]:
        parties.append(clause_surveillance())
    parties.append("> " + suivi["message"])
    parties.append("> " + core_q5.rappel_doux(1, pas_sel["label"]))
    parties.append("> " + core_q5.rappel_doux(7, pas_sel["label"]))
    parties.append("> " + core_q5.rappel_doux(14, pas_sel["label"]))
    parties.append("> " + retest_msg)
    parties.append(NOTE_PAS)
    parties.append(NOTE_PLANCHER)
    parties.append(clause_aide_standing())
    texte = "\n".join(parties)
    return {
        "texte": texte,
        "md5": hashlib.md5(texte.encode("utf-8")).hexdigest(),
        "nb_mots_interdits": _texte_sain(texte),
        "nb_templates_cites": texte.count("> "),
        "pas": pas_sel["pas"], "sanction": suivi["sanction"],
    }


# ─────────────────────────────────────────────────────────────────────────────
# F4 — FRAGMENT DE BILAN L8 (7 blocs) — junctions VRAIES + héritages mesurés
# ─────────────────────────────────────────────────────────────────────────────
def bilan_fragment(pas_sel: dict, suivi: dict, pal: dict, retest: dict,
                   axes_recus: dict, couple=None) -> dict:
    """Contribution de RIO-05 au bilan d'ensemble (assemblage L8).

    Args:
        pas_sel, suivi, pal, retest : sorties des VRAIS fonctions (moteur
            + couche), jamais reconstruites à la main.
        axes_recus : {"sA", "sB", "label_ombre"} — les héritages MESURÉS
            (RIO-01 axes, RIO-02 ombre) transmis au VRAI moteur tels quels.
        couple : None → mono-partenaire (consignation explicite, SANS
            feuille vide) ; sinon le dict du VRAI `lecture_couple` (les
            deux rives mesurées).
    """
    sA = axes_recus["sA"]
    sB = axes_recus["sB"]
    label_ombre = axes_recus["label_ombre"]
    emp = pas_sel["empreinte"]
    pas_source = pas_sel["trace"]["source"]
    # bloc 5 — le pas en action (une force qui s'exerce, template réel cité)
    force_parties = [
        "le pas du cœur est une force qui s'exerce — choisi, jamais prescrit",
        "> " + pas_sel["template"],
    ]
    # bloc 6 — limites (REPRISE → signal ; fallback → tracé honnête ;
    # sinon aucun signal)
    limites = []
    if suivi["categorie"] == "REPRISE":
        limites.append("suivi en reprise — signal — "
                       + core_q5.TEMPLATES_SUIVI["REPRISE"])
    if pas_source != _SOURCE_FLUX:
        limites.append("pas par défaut (fallback) — tracé honnêtement, "
                       "les héritages des quêtes amont le préciseront")
    if not limites:
        limites.append("aucun signal de limite — le pas tient sa place")
    # bloc 4 — couple (junction VRAI RIO-04, deux chemins complets)
    if couple is None:
        bloc_4 = {
            "source": ("RIO-04 — vrai croisement q4, lu uniquement quand "
                       "les données de l'autre rive sont mesurées"),
            "mesure": MONO_MESURE,
            "statut": "en attente de la mesure de l'autre rive",
        }
    else:
        bloc_4 = dict(couple)
    fragment = {
        "bloc_1_position": {
            "pas": pas_sel["pas"], "label": pas_sel["label"],
            "face": pas_sel["face"],
            "face_label": FACE_LABELS[pas_sel["face"]],
            "empreinte": emp,
            "empreinte_label": EMPREINTE_LABELS[emp],
            "source_heritage": pas_source,
            "jours_tenus": suivi["jours_tenus"],
            "categorie_suivi": suivi["categorie"],
            "sanction": "aucune — jamais (structurel : le compteur est privé)",
            "palier": pal["palier"],
        },
        "bloc_2_forme": {
            "taux_suivi": suivi["taux"],
            "rappels_doux": [core_q5.rappel_doux(j, pas_sel["label"])
                             for j in (1, 7, 14)],
            "compteur_prive": True,
        },
        "bloc_3_empreinte": {
            "source": ("héritages MESURÉS par les quêtes amont — RIO-01 "
                       "(axes sA/sB, vraies moyennes d'items corrigés "
                       "q1-r1) et RIO-02 (label d'ombre q2-r1) — transmis "
                       "au VRAI moteur tels quels"),
            "axes_recus": {"sA": sA, "sB": sB},
            "empreinte": emp,
            "label_ombre_recu": _label_affiche(label_ombre),
            "normalisation": ("le VRAI empreinte() normalise tout label "
                              "inconnu ou None vers ZONE_CALME — consigné"),
            "plancher": ("borne basse — la vraie gravité peut être plus "
                         "haute, jamais plus basse (le filet de l'app "
                         "reste porté par RIO-02)"),
        },
        "bloc_4_couple": bloc_4,
        "bloc_5_force": {
            "statut": "PAS EN ACTION",
            "assises": force_parties,
        },
        "bloc_6_limites": {
            "signaux": limites,
            "jamais": ("jamais de sanction — le compteur est privé, les "
                       "jours manqués ne sont pas une faute"),
        },
        "bloc_7_palier_pas": {
            "palier": pal["palier"], "palier_nom": pal["palier_nom"],
            "pas_labels": [pas_sel["label"]],
            "suivi_14_jours_sans_sanction": True,
            "retest": ("re-test Q1 proposé à 8 semaines — vrai "
                       "programmer_re_test_q1 : " + retest["message"]),
            "retest_force": retest["force"],
            "S1": pal["S1"], "S2": pal["S2"],
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
