# -*- coding: utf-8 -*-
"""
WTC-Q5 — COUCHE DE CORRECTION PHILOSOPHIQUE (fichier SUPPLÉMENTAIRE)
====================================================================
RIO-05 « Mon premier pas » — rattrapage au gabarit universel §5.1-§5.4
du canon (demande fondateur trace 1a15ed7ad00bc0fd, exécution Task 177 ;
même gabarit que les corrections RIO-01 (Task 165, commit 2a7a2f9),
RIO-02 (Task 167, commit 717f08d), RIO-03 (Task 168, commit 2ec1a8a),
RIO-06→RIO-10 (Tasks 170-174) et RIO-04 (Task 176, commit e3c7c06)).

RÈGLE ABSOLUE : ce module NE MODIFIE AUCUN moteur existant.
- Le vrai moteur de la quête reste `validation-q5/src/wtc_q5_core.py`
  (6 pas, table 9 (face, empreinte), suivi 14 j CELEBRE ≥ 9 / AJUSTEMENT
  7-8 / REPRISE ≤ 6, rappels doux J1/J7/J14, re-test Q1 à 8 semaines
  jamais forcé) — importé tel quel, jamais recopié.
- Le vrai simulateur archivé est `wtc_q5_simulator.py` (seed 42, 180
  profils : 3 groupes × 60 — CELEBRE / AJUSTEMENT / REPRISE, pas_vrai
  D-VÉRITÉ) — utilisé par le pipeline pour le re-score bit-exact vs
  l'archive `validation-q5/results/resultats-q5-2026-10-15.json`.
- Les junctions utilisent les VRAIS moteurs `validation-q1-r1`
  (SEUILS_NIVEAUX 1,80/2,60/3,20 — la lecture graduée validée P1 de la
  carte, RIO-01) et `validation-q4` (type_attachement — le croisement
  RIO-04). Le label d'ombre est celui de la VRAIE quête ombre RIO-02.

CE QUE CETTE COUCHE AJOUTE (audit Task 163 : RIO-05 = 67 %, F1 20 ·
F2 12/25 · F3 20/25 · F4 15/25 — F1 et F3 partent hauts parce que la
lecture graduée est validée P1 côté carte et que le pas + le suivi 14 j +
les messages anti-perfectionnisme sont déjà validés P1 par le package :
ils sont PRÉSERVÉS tels quels) :
- F2 : le palier 🟢🟠🔴 LECTURE HÉRITÉE DE LA CARTE (le VRAI rang des
  axes A/B que ce moteur reçoit, via les VRAIS seuils SEUILS_NIVEAUX
  1,80/2,60/3,20 du cœur q1-r1 — règle R1 pré-enregistrée de RIO-01 :
  max des rangs, 🟢 si ≤ 1 · 🟠 si 2 · 🔴 si 3) + « QUAND DEMANDER DE
  L'AIDE » (S1 = un axe Forte · S2 = un axe Vive sans Forte — re-test
  8 semaines) + PLANCHER PARTIEL consigné (l'alarme i_alarm et les mains
  somme H+R, lues par le palier de l'ombre RIO-02, sont absentes des
  héritages de ce pas) + la doctrine du pas appliquée et affichée : le
  pas est une LECTURE DU PALIER — choisi jamais prescrit, célébré jamais
  sanctionné. D-CRISE non applicable (consigné — aucun construit
  d'auto-danger mesuré par cet instrument, comme RIO-01/RIO-03).
- F3 : le contenu existant (pas réel + suivi réel + rappels doux réels +
  re-test réel) est PRÉSERVÉ et complété par le contenu du palier (l'aide
  affichée selon la lecture héritée, sans jamais prescrire).
- F4 : fragment de bilan L8 à 7 blocs avec junctions réelles (carte
  RIO-01, ombre RIO-02, croisement RIO-04).

Particularité consignée (différence avec RIO-03) : RIO-03 recevait la
somme des mains (h_norm/r_norm) et posait son plancher sur le VRAI palier
Q2 (monotonicité prouvée) ; RIO-05 ne reçoit que (sA, sB, label_ombre,
jours_tenus, date_pas) — la lecture héritée est donc celle de la CARTE
(mêmes axes, mêmes seuils validés, même règle R1 que RIO-01), jamais une
réinterprétation du palier d'ombre. Le label reçu est affiché mot pour
mot ; la normalisation (LES DEUX / ALARME SANS MAIN / SIGNAL LÉGER NON
NOMMÉ / vide → ZONE_CALME par défaut) est le comportement RÉEL du moteur,
tracé et consigné — jamais masqué.

Chaque règle est PRÉ-ENREGISTRÉE et dérivée mécaniquement des sorties du
vrai moteur — zéro invention de mesure, zéro seuil numérique ajouté.

Règles pré-enregistrées :
- R1 (palier) : rang(niveau) Discrète=0, Tranquille=1, Vive=2, Forte=3
  via le VRAI `niveau_ponctuel` du cœur q1-r1 (seuils 1,80/2,60/3,20,
  PILE inclusifs côté haut) ; rang_quête = max(rang_A, rang_B) ;
  🟢 si rang_quête ≤ 1 · 🟠 si = 2 · 🔴 si = 3 — LA MÊME règle que la
  correction RIO-01 (cohérence de la dimension : le pas reçoit les mêmes
  scores que la carte).
- R2 (seuil d'aide S1) : un axe lu Forte → 🔴 + orientation chaleureuse
  affichée (phrase canon). D-CRISE non applicable (consigné).
- R3 (seuil d'aide S2) : un axe lu Vive sans aucune Forte → « à
  surveiller », re-test à 8 semaines proposé (vrai `programmer_re_test_q1`,
  jamais forcé). Lecture PONCTUELLE consignée : le pas reçoit des scores,
  pas d'intervalle de confiance — la frontière RQS de la carte (S2 de
  RIO-01) reste l'instrument de la carte.
- R4 (qualité avant sens) : le suivi est un COMPTEUR PRIVÉ (jamais exposé
  socialement — le vrai bilan_du_pas) ; les 3 catégories du VRAI
  suivre_14_jours (CELEBRE ≥ 9 · AJUSTEMENT 7-8 · REPRISE ≤ 6) sont des
  statuts-information — JAMAIS de sanction (sanction = None, structurel) ;
  aucun gate RQS sur cet instrument — aucune suspension inventée.
- R5 (anti-fabrication §5.5) : le pas affiché est EXACTEMENT celui du
  VRAI selectionner_pas (table 9 (face, empreinte), trace de source
  réelle) ; le template cité est le VRAI TEMPLATES_PAS[pas] ; le label
  d'ombre reçu est affiché mot pour mot, sa normalisation tracée
  honnêtement ; JAMAIS de pas fabriqué, JAMAIS de force inventée.
- R6 (anti-perfectionnisme) : les 3 templates réels de suivi (CELEBRE /
  AJUSTEMENT / REPRISE) cités mot pour mot — « les jours manqués ne sont
  pas une faute » ; les rappels doux du vrai moteur (J1/J7/J14).
- R7 (vocabulaire écran, canon Partie 9) : aucun mot de la liste interdite
  dans tout texte affiché ; les libellés maison (faces, empreintes,
  labels d'ombre, pas P1-P6) sont repris tels quels.
- R8 (D-SIM) : bandeau simulation sur chaque bloc écran.
- R9 (couplage réel) : TOUS les héritages de ce moteur sont mesurés par
  les quêtes amont (RIO-01 carte sA/sB, RIO-02 ombre label) et balayés
  ici sur leurs valeurs réelles ; la junction aval (le pas affiché par le
  croisement RIO-04 pour chaque partenaire) pointe le VRAI moteur q4
  (type_attachement lu quand la donnée de la personne est là).
"""

from __future__ import annotations

import hashlib
import importlib.util
import sys
from pathlib import Path

_PKG = Path(__file__).resolve().parents[1]           # …/validation-q5/correction-philosophique
_Q5 = _PKG.parent                                    # …/validation-q5
_WTC = _Q5.parent                                    # …/Wairyu thérapie couple

# Le simulateur q5 importe son voisin par sys.path — le dossier src est
# garanti avant tout chargement (même méthode que la couche RIO-03).
sys.path.insert(0, str(_Q5 / "src"))


def _charge(nom: str, chemin: Path):
    spec = importlib.util.spec_from_file_location(nom, chemin)
    mod = importlib.util.module_from_spec(spec)
    sys.modules[nom] = mod
    spec.loader.exec_module(mod)
    return mod


core_q5 = _charge("wtc_q5_core", _Q5 / "src" / "wtc_q5_core.py")
core_q1 = _charge("wtc_q1_core_r1",
                  _WTC / "validation-q1-r1" / "src" / "wtc_q1_core.py")
core_q4 = _charge("wtc_q4_core",
                  _WTC / "validation-q4" / "src" / "wtc_q4_core.py")

# Vérification d'intégrité des moteurs chargés (ce sont bien les vrais) :
assert core_q5.SEUIL_CELEBRE == 9 and core_q5.SEUIL_AJUSTEMENT == 7
assert len(core_q5.PAS_BANQUE) == 6 and len(core_q5.EMPREINTES) == 3
assert len(core_q5.TEMPLATES_PAS) == 6
assert len(core_q5.TEMPLATES_SUIVI) == 3 and len(core_q5.TEMPLATES_RAPPELS) == 3
assert core_q5.verifier_templates()["ok"]
assert core_q5.verifier_anti_perfectionnisme()["ok"]
assert core_q5.verifier_rappels_doux()["ok"]
assert core_q1.N_ITEMS == 18
assert core_q1.SEUILS_NIVEAUX == (1.80, 2.60, 3.20)
assert core_q1.NIVEAUX == ("Discrète", "Tranquille", "Vive", "Forte")
assert len(core_q4.CONFIGS_9) == 9
# Spots moteurs (intégrité comportementale) :
assert core_q5.selectionner_pas(2.0, 2.0, "ZONE CALME")["pas"] == "P1"
assert core_q5.selectionner_pas(3.3, 2.0, "PEUR DE PERDRE")["pas"] == "P4"
assert core_q5.selectionner_pas(2.0, 3.3, "PEUR D'ÊTRE ÉTOUFFÉE")["pas"] == "P6"
assert core_q5.face_dominante(2.61, 2.0) == "EN_QUETE"      # PILE 2,61 inclusif
assert core_q5.face_dominante(2.0, 2.61) == "SUR_LA_RA"     # priorité sB
assert core_q5.face_dominante(2.60, 2.60) == "RASSUREE"     # sous les seuils

# ─────────────────────────────────────────────────────────────────────────────
# CONSTANTES DE LA COUCHE (R1-R9)
# ─────────────────────────────────────────────────────────────────────────────
RANG_NIVEAU = {"Discrète": 0, "Tranquille": 1, "Vive": 2, "Forte": 3}
NIVEAU_DE_RANG = {v: k for k, v in RANG_NIVEAU.items()}
PALIER_DE_RANG = {0: "🟢", 1: "🟢", 2: "🟠", 3: "🔴"}
PALIER_NOM = {"🟢": "Seul·e — le pas tient sa place",
              "🟠": "À deux — à surveiller",
              "🔴": "Avec un professionnel — orientation chaleureuse"}

AXE_NOM_ECRAN = {"A": "peur de perdre", "B": "peur de dépendre"}

# Les 6 libellés RÉELS de la quête ombre (RIO-02 — nommage du moteur q2)
# + l'absence de label. L'espace réel des héritages de ce pas.
LABELS_OMBRE_REELS = ("LES DEUX", "PEUR DE PERDRE", "PEUR D'ÊTRE ÉTOUFFÉE",
                      "ZONE CALME", "ALARME SANS MAIN",
                      "SIGNAL LÉGER NON NOMMÉ", "")

MOTS_INTERDITS = (
    "pathologie", "diagnostic", "dépistage", "anxieux", "anxiété",
    "évitement", "évitant", "évitante", "désorganisé", "trouble",
    "syndrome", "désordre", "symptôme", "névrosisme", "narcissisme",
    "jalousie",
)
BANDEAU_DSIM = ("[D-SIM] Lecture issue d'une simulation — la mécanique est "
                "validée, pas la prévalence clinique.")
PHRASE_ORIENTATION = ("le chemin le plus court est de ne pas le porter "
                      "seul·e — l'orientation vers un professionnel de la "
                      "relation n'est pas un échec, c'est le pas qui compte "
                      "ici")
NOTE_PAS = ("Ton pas est une lecture de ton palier — choisi, jamais "
            "prescrit ; célébré, jamais sanctionné. Le compteur est privé, "
            "jamais exposé socialement.")
NOTE_PLANCHER = ("Gravité lue en héritage de ta carte (RIO-01 — mêmes "
                 "scores, mêmes seuils validés, lecture importée du vrai "
                 "moteur) : c'est une lecture partielle — ta quête ombre "
                 "(RIO-02) mesure en plus l'alarme et les mains, absentes "
                 "d'ici, et peut préciser la gravité à partir de ses "
                 "propres variables.")


# ─────────────────────────────────────────────────────────────────────────────
# R1/R2/R3 — PALIER LECTURE HÉRITÉE DE LA CARTE (VRAIS seuils q1-r1) + AIDE
# ─────────────────────────────────────────────────────────────────────────────
def plancher_carte(sA: float, sB: float) -> dict:
    """R1/R2/R3 — palier plancher sur les DEUX axes que le pas reçoit.

    Le VRAI `niveau_ponctuel` du cœur q1-r1 (seuils 1,80/2,60/3,20) est
    appliqué tel quel — la même lecture graduée validée P1 de la carte,
    la même règle R1 que la correction RIO-01. PLANCHER PARTIEL consigné :
    i_alarm et la somme des mains (lues par le palier de l'ombre RIO-02)
    sont absentes des héritages de ce pas."""
    niveaux = {"A": core_q1.niveau_ponctuel(sA),
               "B": core_q1.niveau_ponctuel(sB)}
    rangs = {a: RANG_NIVEAU[n] for a, n in niveaux.items()}
    rang_quete = max(rangs.values())
    palier = PALIER_DE_RANG[rang_quete]
    s1_axes = [a for a in ("A", "B") if rangs[a] == 3]
    s2_axes = ([a for a in ("A", "B") if rangs[a] == 2]
               if rang_quete == 2 else [])
    return {"niveaux": niveaux, "rangs": rangs,
            "rang_quete": rang_quete, "palier": palier,
            "palier_nom": PALIER_NOM[palier],
            "S1_axes": s1_axes, "S2_axes": s2_axes,
            "S1": palier == "🔴", "S2": palier == "🟠",
            "plancher_partiel": True}


def palier_independant(sA: float, sB: float) -> dict:
    """COR2 — chemin INDÉPENDANT de la lecture (structure de comptage au
    lieu de l'if-chaîne du cœur ; mêmes VRAIS seuils importés, jamais
    restatés). Doit converger EXACTEMENT avec plancher_carte()."""
    def rang(s: float) -> int:
        return sum(1 for t in core_q1.SEUILS_NIVEAUX if s >= t)

    rangs = {"A": rang(sA), "B": rang(sB)}
    rq = max(rangs.values())
    palier = PALIER_DE_RANG[rq]
    s1_axes = [a for a in ("A", "B") if rangs[a] == 3]
    s2_axes = ([a for a in ("A", "B") if rangs[a] == 2]
               if rq == 2 else [])
    return {"rangs": rangs, "rang_quete": rq, "palier": palier,
            "S1_axes": s1_axes, "S2_axes": s2_axes,
            "S1": palier == "🔴", "S2": palier == "🟠"}


def clause_aide_standing() -> str:
    return ("QUAND DEMANDER DE L'AIDE — seuils posés d'avance, les mêmes "
            "pour tout le monde : un axe lu Forte (lecture héritée de ta "
            "carte) → parler à un professionnel est proposé ; un axe lu "
            "Vive sans aucune Forte → à surveiller, re-test proposé à 8 "
            "semaines ; et quoi qu'il en soit : ton pas reste choisi, "
            "jamais prescrit — célébré, jamais sanctionné.")


def note_ombre(label_recu: str, empreinte_norm: str) -> str:
    """R5 — le label reçu affiché mot pour mot, sa normalisation tracée
    honnêtement (comportement réel du VRAI empreinte(), consigné)."""
    if label_recu == "":
        return ("Aucun label d'ombre transmis — l'empreinte par défaut du "
                f"moteur s'applique ({empreinte_norm}) : tracé honnêtement, "
                "jamais masqué.")
    return (f"Ombre héritée reçue : « {label_recu} » — le pas la normalise "
            f"en empreinte {empreinte_norm} (comportement réel du moteur, "
            "consigné).")


def bloc_ecran(pas_sel: dict, suivi: dict, pal: dict, label_recu: str,
               retest_msg: str) -> dict:
    """Assemble le bloc écran complet RIO-05 — templates réels cités mot
    pour mot (pas, suivi, 3 rappels, re-test), palier hérité affiché
    honnêtement."""
    parties = [BANDEAU_DSIM]
    parties.append("> " + pas_sel["template"])
    parties.append(f"Ta gravité héritée de la carte se lit {pal['palier']} "
                   f"({pal['palier_nom']}).")
    if pal["S1"]:
        axes = " et ".join(AXE_NOM_ECRAN[a] for a in pal["S1_axes"])
        parties.append("Seuil atteint : ton axe " + axes + " se lit Forte "
                       "(lecture héritée de la carte) — l'orientation est "
                       "proposée. " + PHRASE_ORIENTATION[:1].upper()
                       + PHRASE_ORIENTATION[1:] + ".")
    if pal["S2"]:
        axes = " et ".join(AXE_NOM_ECRAN[a] for a in pal["S2_axes"])
        parties.append("Seuil approché : ton axe " + axes + " se lit Vive "
                       "(lecture héritée de la carte) — à surveiller, "
                       "re-test proposé à 8 semaines.")
    parties.append(note_ombre(label_recu, pas_sel["empreinte"]))
    parties.append("> " + suivi["message"])
    parties.append("> " + core_q5.rappel_doux(1, pas_sel["label"]))
    parties.append("> " + core_q5.rappel_doux(7, pas_sel["label"]))
    parties.append("> " + core_q5.rappel_doux(14, pas_sel["label"]))
    parties.append("> " + retest_msg)
    parties.append(NOTE_PAS)
    parties.append(NOTE_PLANCHER)
    parties.append(clause_aide_standing())
    texte = "\n".join(parties)
    bas = texte.lower()
    return {
        "texte": texte,
        "md5": hashlib.md5(texte.encode("utf-8")).hexdigest(),
        "nb_mots_interdits": sum(1 for m in MOTS_INTERDITS if m in bas),
        "nb_templates_cites": texte.count("> "),
        "pas": pas_sel["pas"], "sanction": suivi["sanction"],
    }


def type_couple(sA: float, sB: float) -> str:
    """Junction RIO-04 — le VRAI type_attachement du croisement (lu sur
    les scores que cette quête reçoit ; la configuration nommée complète
    nécessite les données du partenaire — consigné)."""
    return core_q4.type_attachement(sA, sB)


# ─────────────────────────────────────────────────────────────────────────────
# F4 — FRAGMENT DE BILAN L8 (7 blocs) — junctions VRAIES + héritages mesurés
# ─────────────────────────────────────────────────────────────────────────────
def bilan_fragment(pas_sel: dict, suivi: dict, pal: dict, label_recu: str,
                   retest: dict, sA: float, sB: float) -> dict:
    """Contribution de RIO-05 au bilan d'ensemble (assemblage L8)."""
    type_c = type_couple(sA, sB)
    limites = []
    if suivi["categorie"] == "REPRISE":
        limites.append("suivi en reprise — "
                       + core_q5.TEMPLATES_SUIVI["REPRISE"])
    if pal["S1"]:
        limites.append("un axe se lit Forte — l'orientation est proposée "
                       "(le chemin le plus court, pas un échec)")
    if pal["S2"]:
        limites.append("un axe se lit Vive — à surveiller, re-test proposé "
                       "à 8 semaines")
    if not limites:
        limites.append("aucun signal de limite — le pas tient sa place")
    fragment = {
        "bloc_1_position": {
            "pas": pas_sel["pas"], "label": pas_sel["label"],
            "face": pas_sel["face"], "empreinte": pas_sel["empreinte"],
            "source_heritage": pas_sel["trace"]["source"],
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
                       "carte : sA/sB (niveaux lus par le VRAI cœur q1-r1) "
                       "· RIO-02 ombre : label reçu tel quel (mot pour mot "
                       "quand transmis, absence tracée sinon) → empreinte "
                       "normalisée par le VRAI moteur — transmis au VRAI "
                       "selectionner_pas tels quels"),
            "axes": {"A": {"score": sA, "niveau": pal["niveaux"]["A"]},
                     "B": {"score": sB, "niveau": pal["niveaux"]["B"]}},
            "label_recu": (label_recu if label_recu != ""
                           else "AUCUN_LABEL_TRANSMIS — tracé honnêtement "
                                "(empreinte par défaut du moteur)"),
            "note_normalisation": note_ombre(label_recu,
                                             pas_sel["empreinte"]),
            "plancher_partiel": True,
            "variables_absentes": ("alarme (i_alarm) et mains (somme H+R) "
                                   "— mesurées par la quête ombre RIO-02, "
                                   "absentes des héritages de ce pas ; la "
                                   "gravité réelle peut être précisée "
                                   "différemment là-bas"),
        },
        "bloc_4_couple": {
            "source": "RIO-04 — vrai moteur q4 (type_attachement)",
            "type_individuel": type_c,
            "jonction": ("le croisement RIO-04 lit les DEUX types → "
                         "configuration nommée ; la configuration complète "
                         "nécessite les données du partenaire — consigné"),
        },
        "bloc_5_force": {
            "statut": "PAS EN ACTION",
            "assises": ["le pas choisi est une force en action — choisi, "
                        "jamais prescrit", "> " + pas_sel["template"]],
        },
        "bloc_6_limites": {
            "signaux": limites,
            "jamais": "jamais de sanction — le compteur est privé, les "
                      "jours manqués ne sont pas une faute",
        },
        "bloc_7_palier_pas": {
            "palier": pal["palier"],
            "pas_labels": [pas_sel["label"]],
            "suivi_14_jours_sans_sanction": True,
            "retest": ("re-test RIO-01 proposé à 8 semaines — vrai "
                       "programmer_re_test_q1 : " + retest["message"][:60]),
            "retest_force": retest["force"],
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
