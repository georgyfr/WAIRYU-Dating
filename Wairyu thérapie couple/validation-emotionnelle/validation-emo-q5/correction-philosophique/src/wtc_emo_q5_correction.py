# -*- coding: utf-8 -*-
"""
WTC-EMO-Q5 — COUCHE DE CORRECTION PHILOSOPHIQUE (fichier SUPPLÉMENTAIRE)
========================================================================
RIO-10 « Mon premier geste du cœur » — rattrapage au gabarit universel
§5.1-§5.4 du canon (demande fondateur, même ordre que RIO-01→09 : fichiers
SUPPLÉMENTAIRES, zéro modification de l'existant, exactitude des calculs).

RÈGLE ABSOLUE : ce module NE MODIFIE AUCUN moteur existant.
- Le vrai moteur de la quête reste `validation-emotionnelle/
  validation-emo-q5/src/wtc_emo_q5_core.py` (arbre 8 pas INV > RC > CAP >
  FE1 > FE6 > ER1 > ER2 > FE3, suivi 14 j, rappels doux, re-test 8
  semaines, D-DENSITÉ pas de voie B) — importé tel quel, jamais recopié.
- Le vrai simulateur archivé est `wtc_emo_q5_simulator.py` (seed 42, 520
  profils : 6 groupes × 80 + pièges PERFECT 20 / ZERO 20, pas_vrai
  D-VÉRITÉ) — utilisé par le pipeline pour le re-score bit-exact.
- Les junctions utilisent les VRAIS moteurs `validation-emo-q1` (les
  VRAIS seuils du cœur 3,5/2,5 pour le plancher hérité — RIO-06) et
  `validation-emo-q4` (co-régulation, vrai seuil 3,0 — RIO-09). Les
  héritages Q2 (inv_d_zone, rc_label — RIO-07) et Q3 (cap, fe1/fe3/fe6 —
  RIO-08) sont balayés sur leurs valeurs réelles, jamais devinés.

CE QUE CETTE COUCHE AJOUTE (audit Task 163 : RIO-10 = 67 %, F1 20 ·
F2 12/25 · F3 20/25 · F4 15/25 — F3 part haut parce que le pas + le suivi
14 j + les messages anti-perfectionnisme sont déjà validés P1 par le
package : ils sont PRÉSERVÉS tels quels) :
- F2 : le palier 🟢🟠🔴 PLANCHER HÉRITÉ (le VRAI rang des faces E-R1/E-R2
  que ce moteur reçoit, via les VRAIS seuils du cœur 3,5/2,5 — PLANCHER
  PARTIEL consigné : E-R3 absente des héritages de ce moteur — borne
  basse, monotonie du max) + « QUAND DEMANDER DE L'AIDE » (S1 = plancher
  🔴 ; S2 = plancher 🟠 — re-test 8 semaines) + la doctrine du pas
  appliquée et affichée : le pas est une LECTURE DU PALIER — choisi
  jamais prescrit, célébré jamais sanctionné.
- F3 : le contenu existant (pas réel + suivi réel + rappels doux réels +
  re-test réel) est PRÉSERVÉ et complété par le contenu du palier
  (l'aide affichée selon le plancher, sans jamais prescrire).
- F4 : fragment de bilan L8 à 7 blocs avec junctions réelles.

Chaque règle est PRÉ-ENREGISTRÉE et dérivée mécaniquement des sorties du
vrai moteur — zéro invention de mesure.

Règles pré-enregistrées :
- R1 (palier plancher) : rang de face via les VRAIS seuils du cœur
  (Forte ≥ 3,5 · Vive > 2,5 · Tranquille ≥ 1,5 [D-STD] · Discrète < 1,5)
  sur les DEUX faces que ce moteur reçoit (E-R1, E-R2) ;
  rang_plancher = max des deux rangs ; 🟢 si ≤ 1 · 🟠 si 2 · 🔴 si 3.
  PLANCHER PARTIEL consigné (E-R3 absente — borne basse).
- R2 (S1) : plancher 🔴 → orientation chaleureuse proposée (« le chemin
  le plus court, pas un échec ») — le pas reste choisi, jamais prescrit.
- R3 (S2) : plancher 🟠 → à surveiller + re-test 8 semaines (le VRAI
  programmer_re_test).
- R4 (qualité avant sens) : le suivi est un COMPTEUR PRIVÉ (jamais
  exposé socialement — le vrai bilan_du_pas) ; les 3 catégories du VRAI
  suivre_14_jours (CELEBRE ≥ 10 · AJUSTEMENT 6-9 · REPRISE ≤ 5) sont des
  statuts-information — JAMAIS de sanction (sanction = None, structurel) ;
  aucun gate RQS sur cet instrument — aucune suspension inventée.
- R5 (anti-fabrication) : le pas affiché est EXACTEMENT celui du VRAI
  selectionner_pas (arbre 8 pas, trace de source réelle) ; le template
  cité est le VRAI TEMPLATES_PAS[pas] ; le fallback ER2 est tracé
  honnêtement (« aucun héritage actif ») ; JAMAIS de pas fabriqué.
- R6 (anti-perfectionnisme) : les 3 templates réels de suivi (CELEBRE /
  AJUSTEMENT / REPRISE) cités mot pour mot — « les jours manqués ne sont
  pas une faute » ; le rappel doux du vrai moteur (J1/J7/J14).
- R7 (vocabulaire écran, canon Partie 9) : aucun mot de la liste
  interdite ; D-CRISE non applicable à cet instrument (consigné — aucun
  construit d'auto-danger ; le filet de l'app reste porté par RIO-02).
- R8 (D-SIM) : bandeau simulation sur chaque bloc écran.
- R9 (couplage réel) : TOUS les héritages de l'arbre sont mesurés par les
  quêtes amont (RIO-06 cœur, RIO-07 ombre Q2, RIO-08 forces/cap) et
  balayés ici sur leurs valeurs réelles — l'énumération prouve que les 8
  pas sont résolus par le VRAI arbre sur l'espace complet des héritages.
"""

from __future__ import annotations

import hashlib
import importlib.util
import sys
from pathlib import Path

_PKG = Path(__file__).resolve().parents[1]           # …/validation-emo-q5/correction-philosophique
_Q5 = _PKG.parent                                    # …/validation-emo-q5
_EMO = _Q5.parent                                    # …/validation-emotionnelle
_WTC = _EMO.parent                                   # …/Wairyu thérapie couple


def _charge(nom: str, chemin: Path):
    spec = importlib.util.spec_from_file_location(nom, chemin)
    mod = importlib.util.module_from_spec(spec)
    sys.modules[nom] = mod
    spec.loader.exec_module(mod)
    return mod


core_q5 = _charge("wtc_emo_q5_core", _Q5 / "src" / "wtc_emo_q5_core.py")
core_q1 = _charge("wtc_emo_q1_core", _EMO / "validation-emo-q1" / "src" / "wtc_emo_q1_core.py")
core_q2 = _charge("wtc_emo_q2_core", _EMO / "validation-emo-q2-r1" / "src" / "wtc_emo_q2_core.py")
core_q4 = _charge("wtc_emo_q4_core", _EMO / "validation-emo-q4-r3" / "src" / "wtc_emo_q4_core.py")

assert len(core_q5.PAS_ORDER) == 8 and len(core_q5.TEMPLATES_PAS) == 8
assert len(core_q5.TEMPLATES_SUIVI) == 3 and len(core_q5.TEMPLATES_RAPPELS) == 3
assert core_q5.SEUIL_CELEBRE == 10 and core_q5.SEUIL_AJUSTEMENT == 6
assert core_q1.SEUIL_DOMINANCE == 3.5 and core_q1.SEUIL_PACIFIQUE_E_R1 == 2.5
assert len(core_q2.TEMPLATES_REPROCHE_CODE) == 4

# ─────────────────────────────────────────────────────────────────────────────
# CONSTANTES DE LA COUCHE (R1-R9)
# ─────────────────────────────────────────────────────────────────────────────
ZONES_Q2 = tuple(sorted(core_q2.TEMPLATES_INVALIDATION_DONNEE.keys()))
LABELS_RC_Q2 = tuple(sorted(core_q2.TEMPLATES_REPROCHE_CODE.keys()))
LABELS_ACTIFS_Q2 = ("REPROCHE-CODE ACTIF", "BESOIN VIVANT, FORMULATION MIXTE")
SOMMES_COEUR = tuple(range(3, 16))
CAP_CHOIX = ("PC", "AC")                # l'arbre lit cap != "AC" (2 classes)

RANG_NIVEAU = {"Discrète": 0, "Tranquille": 1, "Vive": 2, "Forte": 3}
NIVEAU_DE_RANG = {v: k for k, v in RANG_NIVEAU.items()}
PALIER_DE_RANG = {0: "🟢", 1: "🟢", 2: "🟠", 3: "🔴"}
PALIER_NOM = {"🟢": "Seul·e — le pas du cœur", "🟠": "À deux — guidé",
              "🔴": "Avec un professionnel — orientation chaleureuse"}
SEUIL_BAS_DISCRETE = 1.5

SEUIL_DISCRETE_ENTIER = 4     # s ≤ 4 → Discrète
SEUIL_TRANQUILLE_ENTIER = 7   # 5-7 → Tranquille (er ≤ 2,5 du cœur)
SEUIL_VIVE_ENTIER = 10        # 8-10 → Vive (er < 3,5)

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
NOTE_PLANCHER = ("Gravité lue en plancher hérité (RIO-06 — les faces de ta "
                 "météo que ce moteur reçoit, mêmes seuils du cœur) : c'est "
                 "une borne basse — la vraie gravité peut être plus haute, "
                 "jamais plus basse.")


# ─────────────────────────────────────────────────────────────────────────────
# R1/R2/R3 — PALIER PLANCHER HÉRITÉ (VRAIS seuils du cœur) + SEUILS D'AIDE
# ─────────────────────────────────────────────────────────────────────────────
def niveau_face(er_m: float) -> str:
    if er_m >= core_q1.SEUIL_DOMINANCE:
        return "Forte"
    if er_m > core_q1.SEUIL_PACIFIQUE_E_R1:
        return "Vive"
    if er_m >= SEUIL_BAS_DISCRETE:
        return "Tranquille"
    return "Discrète"


def palier_plancher(er1_m: float, er2_m: float) -> dict:
    """R1/R2/R3 — palier plancher sur les DEUX faces reçues par l'arbre."""
    niveaux = {"E-R1": niveau_face(er1_m), "E-R2": niveau_face(er2_m)}
    rangs = {f: RANG_NIVEAU[n] for f, n in niveaux.items()}
    rang_plancher = max(rangs.values())
    palier = PALIER_DE_RANG[rang_plancher]
    return {"niveaux": niveaux, "rangs": rangs,
            "rang_plancher": rang_plancher, "palier": palier,
            "palier_nom": PALIER_NOM[palier],
            "S1": palier == "🔴", "S2": palier == "🟠",
            "plancher_partiel": True}


def palier_independant(s1: int, s2: int) -> dict:
    """COR2 — chemin INDÉPENDANT (entiers purs : bandes 4/7/10)."""
    def rang(s: int) -> int:
        if s >= 11:
            return 3
        if s >= 8:
            return 2
        if s >= 5:
            return 1
        return 0

    rangs = {"E-R1": rang(s1), "E-R2": rang(s2)}
    rp = max(rangs.values())
    return {"rangs": rangs, "rang_plancher": rp,
            "palier": PALIER_DE_RANG[rp], "S1": rp == 3, "S2": rp == 2}


def clause_aide_standing() -> str:
    return ("QUAND DEMANDER DE L'AIDE — seuils posés d'avance, les mêmes "
            "pour tout le monde : une face héritée de ta météo lue Forte "
            "(plancher RIO-06, borne basse) → parler à un professionnel "
            "est proposé ; une face lue Vive sans aucune Forte → à "
            "surveiller, re-test proposé à 8 semaines ; et quoi qu'il en "
            "soit : ton pas reste choisi, jamais prescrit — célébré, "
            "jamais sanctionné.")


def bloc_ecran(pas_sel: dict, suivi: dict, pal: dict, retest_msg: str) -> dict:
    """Assemble le bloc écran complet RIO-10 — templates réels cités mot
    pour mot (pas, suivi, rappels), palier plancher affiché honnêtement."""
    parties = [BANDEAU_DSIM]
    parties.append("> " + pas_sel["template"])
    parties.append(f"Ton palier hérité se lit {pal['palier']} "
                   f"({pal['palier_nom']}).")
    if pal["S1"]:
        parties.append("Seuil atteint : ta météo héritée est lue Forte "
                       "(plancher RIO-06) — l'orientation est proposée. "
                       + PHRASE_ORIENTATION[:1].upper()
                       + PHRASE_ORIENTATION[1:] + ".")
    if pal["S2"]:
        parties.append("Seuil approché : ta météo héritée est lue Vive "
                       "(plancher RIO-06) — à surveiller, re-test proposé "
                       "à 8 semaines.")
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


def classe_er1(er_m: float) -> str:
    if er_m < 3.0:
        return "bas"
    if er_m == 3.0:
        return "pile"
    return "haut"


def _tables_couple():
    """Table de co-régulation par classe er1 (héritage RIO-06) — le vrai
    seuil 3,0, PILE atteignable (somme 9), inclusif, consigné."""
    reps = {"bas": 8 / 3.0, "pile": 9 / 3.0, "haut": 10 / 3.0}
    return {c: {"explosif": core_q4.co_regulation(er, 2.0)["explosif_A"],
                "note": "vrai seuil 3,0 — la co-régulation du croisement "
                        "RIO-09 lit la paire complète"}
            for c, er in reps.items()}


# ─────────────────────────────────────────────────────────────────────────────
# F4 — FRAGMENT DE BILAN L8 (7 blocs) — junctions VRAIES + héritages mesurés
# ─────────────────────────────────────────────────────────────────────────────
def bilan_fragment(pas_sel: dict, suivi: dict, pal: dict, retest: dict,
                   heritages: dict, table_couple: dict) -> dict:
    """Contribution de RIO-10 au bilan d'ensemble (assemblage L8)."""
    co = table_couple[classe_er1(heritages["er1_moyenne"])]
    pas_source = pas_sel["trace"]["source"]
    force_parties = (
        ["le pas du cœur est une force en action — choisi, jamais prescrit",
         "> " + pas_sel["template"]]
        if pas_sel["pas"] != "ER2" or pas_source != "fallback (aucun héritage actif)"
        else ["aucun héritage actif — le pas du mur est proposé par "
              "défaut (le plus commun), tracé honnêtement",
              "> " + pas_sel["template"]])
    limites = []
    if suivi["categorie"] == "REPRISE":
        limites.append("suivi en reprise — " + core_q5.TEMPLATES_SUIVI["REPRISE"])
    if pas_source == "fallback (aucun héritage actif)":
        limites.append("pas par défaut (fallback) — tracé honnêtement, "
                       "les héritages des quêtes amont le préciseront")
    if co["explosif"]:
        limites.append("cœur explosif (vrai seuil 3,0) — le croisement "
                       "RIO-09 lit la paire complète avant tout dialogue")
    if not limites:
        limites.append("aucun signal de limite — le pas tient sa place")
    fragment = {
        "bloc_1_position": {
            "pas": pas_sel["pas"], "label": pas_sel["label"],
            "source_heritage": pas_source,
            "arbre": pas_sel["trace"]["arbre"],
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
            "source": ("héritages MESURÉS par les quêtes amont — RIO-06 "
                       "(er1/er2), RIO-07 (zone Q2, label), RIO-08 (cap, "
                       "forces) — transmis au VRAI arbre tels quels"),
            "heritages": {k: heritages[k] for k in
                          ("inv_d_zone", "rc_label", "cap", "fe1_active",
                           "fe3_active", "fe6_active")},
            "faces_heritees": {"er1_moyenne": heritages["er1_moyenne"],
                                "er2_moyenne": heritages["er2_moyenne"]},
            "plancher_partiel": True,
            "face_absente": "E-R3 absente des héritages de ce moteur — "
                            "la vraie gravité peut être plus haute, "
                            "jamais plus basse",
        },
        "bloc_4_couple": {
            "source": "RIO-09 — vrai moteur émo-q4-r3 (co_regulation)",
            "classe_er1": classe_er1(heritages["er1_moyenne"]),
            "explosif_individuel": co["explosif"],
            **co,
        },
        "bloc_5_force": {
            "statut": "PAS EN ACTION",
            "assises": force_parties,
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
            "retest": ("re-test RIO-10 proposé à 8 semaines — vrai "
                       "programmer_re_test émo-q5 : " + retest["message"][:60]),
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
