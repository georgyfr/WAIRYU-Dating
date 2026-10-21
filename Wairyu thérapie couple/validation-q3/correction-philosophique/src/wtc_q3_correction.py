# -*- coding: utf-8 -*-
"""
WTC-Q3 — COUCHE DE CORRECTION PHILOSOPHIQUE (fichier SUPPLÉMENTAIRE)
=====================================================================
RIO-03 « Ce qui me porte » — rattrapage au gabarit universel §5.1-§5.4
du canon (demande fondateur trace 1a15ed7ad00bc0fd, exécution trace
1a15fdebd4c235a1 ; même gabarit que les corrections RIO-01, Task 165,
commit 2a7a2f9 et RIO-02, Task 167, commit 717f08d).

RÈGLE ABSOLUE : ce module NE MODIFIE AUCUN moteur existant.
- Le vrai cœur de la quête reste `validation-q3-r1/src/wtc_q3_core_r1.py`
  (révision R1, D-Q3-R1-A à H) — importé tel quel, jamais recopié.
- Les junctions utilisent les VRAIS moteurs `validation-q4/src/wtc_q4_core.py`
  (croisement à deux), `validation-q5/src/wtc_q5_core.py` (pas + suivi) et
  `validation-q2-r1/src/wtc_q2_core.py` (palier + filet — pour la dérivation
  conservatrice de la sévérité héritée).
- Les templates d'affichage des 6 forces et de la SILENCIEUSE sont les
  TEMPLATES RÉELS du package R1 (`wtc_q3_validation_r1.py`, D-Q3-R1-H) —
  importés, jamais réécrits.
- Cette couche ajoute ce que l'audit (Task 163) a trouvé manquant sur
  RIO-03 : F2 « QUAND DEMANDER DE L'AIDE » (seuils S1/S2) + ombre héritée
  causale affichée (12/25) ; F3 contenu des 3 paliers + branchement quête
  « pas » (6/25) ; F4 fragment de bilan L8 à 7 blocs (10/25).

Particularité RIO-03 (consignée) : le VRAI cœur ne calcule AUCUN palier —
c'est la quête du positif (banque fermée, 0 voie → SILENCIEUSE). La
sévérité affichée est donc un PLANCHER HÉRITÉ : le VRAI palier Q2
(`palier`, validée P1 par la correction RIO-02 sur 6 720 000 états)
appelé avec les inconnues de RIO-03 posées à leur valeur la plus sûre
(i_alarm = 0, H5 = 0). La monotonicité palier(ial, h5f) ≥ plancher est
PROUVÉE dans le pipeline (stage planche, 211 200 états Q2) : le plancher
n'exagère jamais la sévérité — il peut seulement la sous-estimer, jamais
la surévaluer. Aucune règle de sévérité n'est inventée.

Règles pré-enregistrées (écrites avant tout calcul, calquées sur R1-R9
des corrections RIO-01/RIO-02) :
- R1 (palier) : le palier affiché est le PLANCHER HÉRITÉ — le VRAI
  `palier` Q2 appelé avec (i_alarm=0, H5=0, comp={"somme": …}) ; le
  pipeline prouve que ce palier ne lit que comp["somme"] et que le
  plancher est une borne basse valide sur tout l'espace Q2.
- R2 (seuil d'aide S1) : plancher 🔴 — c'est-à-dire (sA ≥ 3,70) OU
  (sA ≥ 3,21 ET sB ≥ 3,21), les seules conditions 🔴 du vrai palier qui
  ne dépendent pas des inconnues — → orientation chaleureuse affichée
  (phrase canon). D-CRISE est NON APPLICABLE à cet instrument (aucun
  i_alarm ni H5 dans ses entrées — consigné, comme RIO-01).
- R3 (seuil d'aide S2) : plancher 🟠 (somme héritée ∈ [0,30 ; 0,60))
  sans S1 → « à surveiller », re-test à 8 semaines proposé (vrai
  `programmer_re_test_q1` ; vrai `long_termique` du cœur pour les forces :
  apparue = FIABLE, disparue = re-vérifiée, jamais affichée d'emblée).
- R4 (qualité avant sens) : la garde de RIO-03 est la BANQUE FERMÉE
  (canon §5.5) — une force est affichée ssi le VRAI `verifier_forces` la
  retient (au moins une voie A/B/C réellement remplie, max 2 par
  densité, ordre de banque) ; 0 voie → SILENCIEUSE (template réel, jamais
  de compensation, jamais de force fabriquée).
- R5 (anti-fabrication §5.5) : la force affichée est EXACTEMENT celle du
  vrai moteur (templates réels mot pour mot, bijection valeur↔texte
  vérifiée configuration par configuration) ; « rien à fabriquer »
  n'apparaît que sur ZONE CALME ; SILENCIEUSE avec ombre active →
  « terrain de travail, pas un verdict » ; SILENCIEUSE sans ombre →
  silence gardé.
- R6 (journal) : le N n'est JAMAIS une sanction — les 4 statuts sont des
  informations affichées comme telles ; les voies journal ne sont comptées
  que sur journal complet (vrai `cond_journal`), sans pénalité sinon.
- R7 (vocabulaire écran, canon Partie 9) : aucun mot de la liste interdite
  dans tout texte affiché ; les libellés du cœur (LES DEUX · PEUR DE
  PERDRE · PEUR D'ÊTRE ÉTOUFFÉE · ZONE CALME · ALARME SANS MAIN · SIGNAL
  LÉGER NON NOMMÉ) sont des noms maison descriptifs, repris tels quels.
- R8 (D-SIM) : bandeau simulation sur chaque bloc écran.
- R9 (couplage réel) : le pas annoncé provient du VRAI
  `selectionner_pas(sA, sB, label)` du cœur Q5 (face dominante Q1 ×
  empreinte Q2) ; le type de couple du VRAI `type_attachement` (Q4) ;
  suivi 14 jours par le vrai `suivre_14_jours` (seuils 9/7, sanction
  None) ; re-test par le vrai `programmer_re_test_q1` + `long_termique`.
"""

from __future__ import annotations

import hashlib
import importlib.util
import sys
from pathlib import Path

# ─────────────────────────────────────────────────────────────────────────────
# CHARGEMENT DES VRAIS MOTEURS (jamais recopiés, jamais modifiés)
# ─────────────────────────────────────────────────────────────────────────────
_PKG = Path(__file__).resolve().parents[1]           # …/validation-q3/correction-philosophique
_WTC = _PKG.parents[1]                               # …/Wairyu thérapie couple


def _charge(nom: str, chemin: Path):
    spec = importlib.util.spec_from_file_location(nom, chemin)
    mod = importlib.util.module_from_spec(spec)
    sys.modules[nom] = mod
    spec.loader.exec_module(mod)
    return mod


# Le package R1 importe ses voisins par sys.path — son dossier est ajouté
# par son propre code (sys.path.insert) ; on le garantit avant chargement.
sys.path.insert(0, str(_WTC / "validation-q3-r1" / "src"))

core_q3 = _charge("wtc_q3_core_r1",
                  _WTC / "validation-q3-r1" / "src" / "wtc_q3_core_r1.py")
val_q3 = _charge("wtc_q3_validation_r1",
                 _WTC / "validation-q3-r1" / "src" / "wtc_q3_validation_r1.py")
core_q2 = _charge("wtc_q2_core_r1",
                  _WTC / "validation-q2-r1" / "src" / "wtc_q2_core.py")
core_q4 = _charge("wtc_q4_core",
                  _WTC / "validation-q4" / "src" / "wtc_q4_core.py")
core_q5 = _charge("wtc_q5_core",
                  _WTC / "validation-q5" / "src" / "wtc_q5_core.py")

# Vérification d'intégrité des moteurs chargés (ce sont bien les vrais) :
assert len(core_q3.C3_ITEMS) == 9 and core_q3.FORCES == ["F1", "F2", "F3",
                                                         "F4", "F5", "F6"]
assert core_q3.cond_journal(None) == {f: False for f in core_q3.FORCES}
assert core_q3.journal_statut(None) == "NON_RENSEIGNE"
assert core_q3.journal_statut({"complete": False, "T": 1, "U": 0, "L": 0,
                               "M": 0, "N": 0}) == "PARTIEL"
assert core_q3.journal_statut({"complete": True, "T": 0, "U": 0, "L": 0,
                               "M": 0, "N": 5}) == "SILENCIEUX"
assert core_q3.journal_statut({"complete": True, "T": 2, "U": 1, "L": 0,
                               "M": 1, "N": 1}) == "ACTIF"
assert set(core_q3.coherence_miroir([], [])) == {
    "partages", "secrets", "presumes", "interpretation"}   # [D-Q3-R1-F]
assert core_q3.verifier_forces("PRES", 3, ["V", "F", "R", "T", "Pr"], 3.3,
                               2.3, 0.50, 0.20, "PEUR DE PERDRE",
                               {"T": 6, "U": 5, "L": 5, "M": 4, "N": 0,
                                "phrases": None, "complete": True}
                               )["nombre"] == 2          # limite des 2 (SURCHARGE réelle)
assert sorted(val_q3.TEMPLATES_FORCES) == core_q3.FORCES \
    and val_q3.TEMPLATE_SILENCIEUSE                      # templates réels présents
assert len(core_q2.D_ITEMS) == 6 and len(core_q2.P_ITEMS) == 4
assert len(core_q2.H_ITEMS) == 5 and len(core_q2.R_ITEMS) == 3
assert core_q2.verifier_templates() == []               # 35/35 (C5a du package R1)
assert len(core_q4.CONFIGS_9) == 9
assert core_q5.SEUIL_CELEBRE == 9 and len(core_q5.EMPREINTES) == 3
assert len(core_q5.PAS_BANQUE) == 6

FORCES = list(core_q3.FORCES)

# ─────────────────────────────────────────────────────────────────────────────
# CONSTANTES DE LA COUCHE (R1-R9)
# ─────────────────────────────────────────────────────────────────────────────
PALIER_NOM = {"🟢": "Seul·e — exercice maison", "🟠": "À deux — module de couple",
              "🔴": "Avec un professionnel — orientation chaleureuse"}

LABELS_OMBRE = ("LES DEUX", "PEUR DE PERDRE", "PEUR D'ÊTRE ÉTOUFFÉE",
                "ZONE CALME", "ALARME SANS MAIN", "SIGNAL LÉGER NON NOMMÉ")

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

# Bandes exactes des entrées continues (sA/sB) et de c2 — l'espace des états
# distincts de la COUCHE. Le cœur Q3 lit : c1_mode ∈ {PRES, SOL, ESP, RIEN} ·
# (c2 ≥ 2) · c3 au travers des appartenances {V, F, R, T, Pr} · (sA ≥ 2,61) ·
# (sB ≥ 2,61) · (sB ≥ 3,21) · (h_norm ≥ r_norm) · journal (complete, T, U, L,
# M — jamais N pour les forces ; N ≥ 5 pour le statut uniquement). Le
# PLANCHER (R1) lit en plus (sA ≥ 3,21) · (sA ≥ 3,70) · (sB ≥ 3,21) — les
# bandes de la couche sont donc celles du plancher : 4 sA × 3 sB. Chaque
# bande est plate pour TOUTES les comparaisons (batterie de frontière du
# pipeline) ; la compaction c3 (32 états effectifs) et journal (130 états
# distincts) est PROUVÉE exhaustivement (512 sous-ensembles ; 4 096 (T,U,L,M)).
SA_BANDS = [("A1", 2.0), ("A2", 2.8), ("A3", 3.3), ("A4", 3.8)]
SB_BANDS = [("B1", 2.0), ("B2", 2.8), ("B3", 3.3)]      # seuils sB 2,61 · 3,21
C2_BANDS = [("C2b1", 1), ("C2b2", 2)]                   # seuil c2 2 (basses 0-1 / hautes 2-3)
C1_MODES = ("PRES", "SOL", "ESP", "RIEN")
C3_EFF = ("V", "F", "R", "T", "Pr")                     # appartenances lues (5 sur 9)
HGEQ_REPS = {True: (0.35, 0.05), False: (0.30, 0.40)}
# Représentants (h_norm, r_norm) des 2 états de la comparaison h ≥ r —
# choisis pour couvrir AUSSI la bande 🟠 du plancher (somme 0,40) et la
# bande haute (somme 0,70) ; la bande < 0,30 est couverte par la planche
# (160 paires entières × 12 bandes) et par les sondes somme (0,29/0,30).


def somme_heritee(h_norm: float, r_norm: float) -> float:
    """La somme lue par le VRAI palier Q2 — formule du vrai `comportements`
    (round(hb/15, 3) + round(rb/9, 3) arrondi à 3 ; vérifiée bit-exact sur
    les 1 600 états H×R du cœur par le pipeline)."""
    return round(round(h_norm, 3) + round(r_norm, 3), 3)


def plancher_palier(sA: float, sB: float, h_norm: float, r_norm: float) -> str:
    """R1 — PLANCHER HÉRITÉ : le VRAI `palier` du cœur Q2 appelé avec les
    inconnues de RIO-03 posées à leur valeur la plus sûre (i_alarm = 0,
    H5 = 0). Le pipeline prouve (i) que ce palier ne lit que comp["somme"],
    (ii) que palier(ial, h5f) ≥ plancher sur tout l'espace Q2 (211 200
    états) — le plancher est une borne basse, jamais une exagération."""
    sig = core_q2.signal_securite(0, sA, 0)             # vrai filet, H5 = 0
    return core_q2.palier(0, sA, sB, {"somme": somme_heritee(h_norm, r_norm)},
                          sig)


# ─────────────────────────────────────────────────────────────────────────────
# COR2 — CHEMIN INDÉPENDANT DE LA SÉLECTION (tables du cahier, sans le cœur)
# ─────────────────────────────────────────────────────────────────────────────
def forces_independantes(c1_mode, c2, c3, sA, sB, h_norm, r_norm, journal):
    """Recalcule la sélection depuis les tables §1 du cahier (mot pour mot)
    sans appeler cond_A/cond_B/cond_journal/verifier_forces.
    Doit converger EXACTEMENT avec le vrai `verifier_forces` (COR2)."""
    ca = {"F1": (c1_mode == "PRES") or (c1_mode == "ESP" and sB >= 2.61),
          "F2": c2 >= 2,
          "F3": sA >= 2.61 or ("V" in c3),
          "F4": ("F" in c3),
          "F5": ("R" in c3),
          "F6": ("T" in c3) or ("Pr" in c3)}
    cb = {"F1": sB >= 2.61,
          "F2": (sB >= 3.21 and h_norm >= r_norm),
          "F3": sA >= 2.61,
          "F4": False, "F5": False, "F6": False}        # [D-Q3-R1-A] pas de voie B
    if journal is None or journal["complete"] is False:
        cj = {f: False for f in FORCES}
    else:
        t, u, l, m = journal["T"], journal["U"], journal["L"], journal["M"]
        cj = {"F1": t >= 5, "F2": u >= 5, "F3": l >= 4,
              "F4": (t + u + l + m) >= 4, "F5": m >= 3, "F6": (t + m) >= 4}
    cond = {f: bool(ca[f] or cb[f] or cj[f]) for f in FORCES}
    actives = [f for f in FORCES if cond[f]]
    if len(actives) <= 2:
        return actives
    densite = {f: int(ca[f]) + int(cb[f]) + int(cj[f]) for f in actives}
    tri = sorted(actives, key=lambda f: (-densite[f], FORCES.index(f)))
    return sorted(tri[:2], key=lambda f: FORCES.index(f))


def miroir_independant(c3, c4):
    """Chemin indépendant du VRAI `coherence_miroir` (COR2 — stage miroir).
    Doit converger EXACTEMENT avec le vrai moteur sur 512 × 512 paires."""
    if not (c3 or c4):
        return {"partages": [], "secrets": [], "presumes": [],
                "interpretation": "aucune force déclarée"}
    partages = sorted(set(c3) & set(c4))
    secrets = sorted(set(c3) - set(c4))
    presume = sorted(set(c4) - set(c3))
    interp = ("tes forces sont visibles de l'autre"
              if len(partages) >= len(c3 or []) and c3 else
              "certaines de tes forces restent invisibles à tes yeux")
    return {"partages": partages, "secrets": secrets, "presumes": presume,
            "interpretation": interp}


# ─────────────────────────────────────────────────────────────────────────────
# R4/R5/R6/R7/R8 — TEXTES ÉCRAN (descriptif causal, sans étiquette clinique)
# ─────────────────────────────────────────────────────────────────────────────
_OMBRE_HERITEE = {
    "LES DEUX":
        "En face de ce qui te porte, l'ombre héritée des deux quêtes "
        "précédentes se lit LES DEUX : les deux peurs parlent en même "
        "temps — perdre l'autre et être étouffé·e.",
    "PEUR DE PERDRE":
        "En face de ce qui te porte, l'ombre héritée se lit PEUR DE "
        "PERDRE : c'est l'éloignement qui déclenche l'alarme — et c'est "
        "aussi là que tes forces de présence travaillent.",
    "PEUR D'ÊTRE ÉTOUFFÉE":
        "En face de ce qui te porte, l'ombre héritée se lit PEUR D'ÊTRE "
        "ÉTOUFFÉE : c'est le près qui déclenche l'envie d'air — et c'est "
        "aussi là que savoir prendre l'air devient une force.",
    "ZONE CALME":
        "Aucune ombre active dans l'héritage : rien à fabriquer ici — les "
        "forces affichées viennent de tes réponses, pas d'un besoin de "
        "rassurer.",
    "ALARME SANS MAIN":
        "L'héritage porte un signal non nommé (alarme sans main) : il est "
        "tracé, il remontera s'il se confirme — en attendant, ce qui te "
        "porte est affiché tel quel.",
    "SIGNAL LÉGER NON NOMMÉ":
        "L'héritage porte un signal discret non nommé : il est tracé sans "
        "être nommé — ce qui te porte est affiché tel quel.",
}

_JOURNAL_CLAUSE = {
    "NON_RENSEIGNE":
        "Journal non renseigné : les voies journal ne sont pas comptées — "
        "rien n'est exigé, rien n'est pénalisé.",
    "PARTIEL":
        "Journal partiel : les voies journal ne sont pas comptées tant "
        "qu'il n'est pas complet — sans pénalité.",
    "SILENCIEUX":
        "Le silence du journal est une information, pas une faute : les "
        "voies journal ne sont pas comptées cette semaine.",
    "ACTIF":
        "Ton journal t'éclaire — il n'est jamais noté, jamais jugé : les "
        "voies journal sont comptées telles quelles.",
}

_EXERCICE_FORCE = {
    "F1": "🟢 À ta portée, seul·e : une fois par semaine, refais "
          "volontairement ce qui te ressource — un lieu, une activité, un "
          "moment ; note-le après coup, sans note de performance.",
    "F2": "🟢 À ta portée, seul·e : chaque jour, repérer un geste concret "
          "de l'autre qui t'a aidé·e et le dire en une phrase — la "
          "reconnaissance se travaille comme un geste.",
    "F3": "🟢 À ta portée, seul·e : garder une trace de ce qui te porte "
          "(trois mots par jour suffisent) — l'élan se voit mieux quand "
          "il est noté.",
    "F4": "🟢 À ta portée, seul·e : célébrer une bonne nouvelle de l'autre "
          "au moins une fois par jour, même petite — la joie partagée se "
          "travaille à deux voix.",
    "F5": "🟢 À ta portée, seul·e : poser une vraie pause dans la semaine "
          "— un temps sans tâche, sans écran, sans justification.",
    "F6": "🟢 À ta portée, seul·e : un petit geste tendre par jour (un "
          "mot, un verre d'eau, une main posée) — le quotidien répare "
          "plus que les grands discours.",
}
_EXERCICE_SILENCIEUSE = (
    "🟢 À ta portée, seul·e : refaire le parcours à tête reposée dans une "
    "semaine — les forces se sélectionnent sur des réponses fraîches, "
    "jamais inventées sur des réponses vides.")

_MODULE_SECRETS = (
    "🟠 À deux : nommer à voix haute une force que tu gardais pour toi — "
    "une par semaine ; l'autre écoute, répète ce qu'il a entendu, sans "
    "corriger.")
_MODULE_PARTAGES = (
    "🟠 À deux : célébrer à voix haute une force que vous voyez tous les "
    "deux — une fois par semaine, au moment qui vous convient.")
_MODULE_VIDE = (
    "🟠 À deux : un temps hebdomadaire pour dire ce qui aide, sans "
    "obligation d'en trouver — cinq minutes suffisent.")

_ORIENTATION_PLANCHER = (
    "🔴 Avec un professionnel : l'héritage des deux quêtes précédentes "
    "atteint à lui seul le plus haut palier — " + PHRASE_ORIENTATION + ".")

_SURVEILLANCE_PALIER = (
    "À surveiller : le palier intermédiaire est atteint par l'héritage "
    "seul — re-test proposé à 8 semaines ; l'héritage est un plancher, la "
    "vraie sévérité peut être plus haute.")

_FORCE_SILENCIEUSE_OMBRAGEE = (
    "Terrain de travail, pas un verdict : ce qui se mesure peut bouger — "
    "c'est exactement ce que montre cette lecture.")
_FORCE_SILENCIEUSE_CALME = (
    "Silence gardé : aucune force fabriquée quand les réponses n'en "
    "montrent pas — le positif se sélectionne, jamais inventé.")

_NOTE_EXCLUES = (
    "Deux forces au maximum par profil : les autres conditions remplies "
    "restent tracées dans le bilan, non affichées comme forces.")

CLAUSE_AIDE_STANDING = (
    "QUAND DEMANDER DE L'AIDE — seuils posés d'avance, les mêmes pour tout "
    "le monde : quand l'héritage des deux quêtes précédentes atteint à lui "
    "seul le plus haut palier, un professionnel est proposé ; au palier "
    "intermédiaire, à surveiller avec un re-test proposé ; le positif "
    "n'est jamais généré — quand les réponses n'en montrent pas, rien "
    "n'est affiché ; le silence du journal est une information, jamais "
    "une faute ; ce palier est un plancher prudent — la vraie sévérité "
    "peut être plus haute, jamais plus basse.")

_LIGNE_SUIVI = (
    "Suivi 14 jours prévu : célébré dès 9 jours tenus, ajustement à 7-8, "
    "reprise en douceur en dessous — jamais de sanction.")
_LIGNE_RETEST = (
    "Re-test à 8 semaines : les forces seront re-sélectionnées sur des "
    "réponses fraîches (force apparue = fiable, force disparue = "
    "re-vérifiée avant tout affichage) — programmé, jamais forcé.")


def clause_miroir(mir: dict) -> str:
    """Le miroir affiché comme information (jamais un défaut) —
    l'interprétation est celle du VRAI moteur, mot pour mot."""
    n_p, n_s, n_pr = (len(mir["partages"]), len(mir["secrets"]),
                      len(mir["presumes"]))
    if not (n_p or n_s or n_pr):
        return ("Miroir : aucune force déclarée ni présumée — information "
                "gardée telle quelle, jamais un défaut.")
    return (f"Miroir : {n_p} force(s) partagée(s) avec l'autre, {n_s} "
            f"gardée(s) pour toi, {n_pr} supposée(s) à tort chez toi — "
            f"« {mir['interpretation']} » (information, jamais un défaut).")


def clause_module(mir: dict) -> str:
    """Module 🟠 mécanique : secrets d'abord, sinon partages, sinon vide."""
    if mir["secrets"]:
        return _MODULE_SECRETS
    if mir["partages"]:
        return _MODULE_PARTAGES
    return _MODULE_VIDE


def clause_orientation(pal: str) -> str | None:
    """S1 (R2) — orientation affichée ssi plancher 🔴."""
    return _ORIENTATION_PLANCHER if pal == "🔴" else None


def clause_surveillance(pal: str) -> str | None:
    """S2 (R3) — à surveiller ssi plancher 🟠 sans S1."""
    if pal == "🔴":
        return None
    return _SURVEILLANCE_PALIER if pal == "🟠" else None


def _scan(texte: str) -> int:
    t = texte.lower()
    return sum(1 for m in MOTS_INTERDITS if m in t)


# Mémoïsation des assemblages (les sorties sont déterministes et peu
# nombreuses au regard de l'espace) — même objet renvoyé, lecture seule.
_BLOC_CACHE: dict = {}
_FRAG_CACHE: dict = {}
_PAS_CACHE: dict = {}


def _pas(sA: float, sB: float, label: str) -> dict:
    """VRAI `selectionner_pas` du cœur Q5, mémoïsé — la fonction réelle
    est appelée à chaque nouvelle clé, jamais recopiée."""
    cle = (sA, sB, label)
    hit = _PAS_CACHE.get(cle)
    if hit is None:
        hit = core_q5.selectionner_pas(sA, sB, label)
        _PAS_CACHE[cle] = hit
    return hit


def bloc_ecran(prof: dict, miroir: dict, statut: str, moteur: dict,
               pal: str, sA: float, sB: float) -> dict:
    """Assemble le bloc écran complet RIO-03 — toutes les clauses sont
    déterminées par les sorties du VRAI cœur (forces, trace, silencieuse)
    et de l'héritage (label d'ombre Q2, statut journal, miroir, plancher).

    R4/R5 — banque fermée : les templates affichés sont EXACTEMENT ceux
    des forces retenues par le vrai moteur ; 0 voie → SILENCIEUSE.
    """
    label = prof["label_ombre"]
    forces = moteur["forces"]
    parties = [BANDEAU_DSIM, "Ce qui te porte — sélection déterministe, "
               "jamais fabrication :"]
    if moteur["silencieuse"]:
        parties.append(val_q3.TEMPLATE_SILENCIEUSE)
        parties.append(_FORCE_SILENCIEUSE_OMBRAGEE
                       if label != "ZONE CALME"
                       else _FORCE_SILENCIEUSE_CALME)
    else:
        for f in forces:
            parties.append(val_q3.TEMPLATES_FORCES[f])
        if moteur.get("exclues_par_limite"):
            parties.append(_NOTE_EXCLUES)
    parties.append(_OMBRE_HERITEE[label])
    parties.append(_JOURNAL_CLAUSE[statut])
    parties.append(clause_miroir(miroir))
    parties.append(f"CE QUE TU PEUX CHANGER — palier {pal} ({PALIER_NOM[pal]}) :")
    parties.append(_EXERCICE_FORCE[forces[0]] if forces
                   else _EXERCICE_SILENCIEUSE)
    if pal == "🟠":
        parties.append(clause_module(miroir))
    orient = clause_orientation(pal)
    if orient:
        parties.append(orient)
    surveil = clause_surveillance(pal)
    if surveil:
        parties.append(surveil)
    parties.append(CLAUSE_AIDE_STANDING)
    pas = _pas(sA, sB, label)                         # VRAI moteur Q5 (mémoïsé)
    parties.append(f"Pas annoncé (vraie table Q5) : {pas['label']} — "
                   f"sélectionné par la face dominante ({pas['face']}) et "
                   f"l'empreinte de cette quête ({pas['empreinte']}).")
    parties.append(_LIGNE_SUIVI)
    parties.append(_LIGNE_RETEST)
    cle = tuple(parties)
    hit = _BLOC_CACHE.get(cle)
    if hit is not None:
        return hit
    texte = "\n".join(parties)
    out = {
        "texte": texte,
        "md5": hashlib.md5(texte.encode("utf-8")).hexdigest(),
        "nb_mots_interdits": sum(_scan(p) for p in parties),
        "rien_a_fabriquer": "rien à fabriquer" in texte,
        "silencieuse": bool(moteur["silencieuse"]),
        "forces": list(forces),
        "exclues": list(moteur.get("exclues_par_limite", [])),
        "label": label,
        "statut": statut,
        "palier": pal,
        "force_templates_ok": all(val_q3.TEMPLATES_FORCES[f] in texte
                                  for f in forces),
        "pas": pas["pas"],
        "empreinte": pas["empreinte"],
        "face": pas["face"],
    }
    _BLOC_CACHE[cle] = out
    return out


# ─────────────────────────────────────────────────────────────────────────────
# F4 — FRAGMENT DE BILAN L8 (7 blocs) — junctions VRAIES q4/q5 + trace réelle
# ─────────────────────────────────────────────────────────────────────────────
def bilan_fragment(prof: dict, miroir: dict, statut: str, moteur: dict,
                   pal: str, sA: float, sB: float) -> dict:
    """Contribution de RIO-03 au bilan d'ensemble (assemblage L8 du canon).

    7 blocs : position · forme · empreinte · couple · force · limites ·
    palier/pas. Les blocs empreinte/couple pointent les VRAIES tables des
    moteurs Q5 (empreinte, pas) et Q4 (types, 9 configurations) ; le bloc
    forme porte la trace A/B/C RÉELLE du cœur (traçabilité des voies).
    """
    j = prof["journal"]
    jkey = None if j is None else (bool(j.get("complete")), j.get("T", -1),
                                   j.get("U", -1), j.get("L", -1),
                                   j.get("M", -1), j.get("N", -1))
    cle = (prof["c1_mode"], prof["c2"], tuple(prof["c3"]),
           tuple(prof.get("c4", [])),
           round(prof["sA"], 6), round(prof["sB"], 6), round(prof["h_norm"], 6),
           round(prof["r_norm"], 6), prof["label_ombre"], jkey,
           miroir["interpretation"], len(miroir["partages"]),
           len(miroir["secrets"]), len(miroir["presumes"]),
           statut, tuple(moteur["forces"]), moteur["silencieuse"],
           moteur["nombre"], tuple(moteur.get("exclues_par_limite", [])),
           pal, sA, sB)
    hit = _FRAG_CACHE.get(cle)
    if hit is not None:
        return hit
    label = prof["label_ombre"]
    forces = moteur["forces"]
    type_q4 = core_q4.type_attachement(sA, sB)        # VRAI moteur Q4
    configs_possibles = sorted({
        config for (t1, _), config in core_q4._CONFIG_TABLE.items()
        if t1 == type_q4
    })
    pas = _pas(sA, sB, label)                         # VRAI moteur Q5 (mémoïsé)
    if label != "ZONE CALME":
        limites = [f"ombre héritée : {label} — descriptif causal, sans étiquette"]
    else:
        limites = ["aucune ombre active — rien à fabriquer"]
    limites = limites + [
        f"miroir : {len(miroir['secrets'])} force(s) gardée(s) pour toi, "
        f"{len(miroir['presumes'])} supposée(s) à tort — information"]
    limites = limites + [
        "sévérité = plancher hérité (monotonicité prouvée) : la vraie "
        "sévérité peut être plus haute, jamais plus basse"]
    if statut == "SILENCIEUX":
        limites = limites + ["journal silencieux (N ≥ 5) : information, "
                             "jamais une faute"]
    trace = moteur["trace"]
    fragment = {
        "bloc_1_position": {
            "quete": "RIO-03 « Ce qui me porte »",
            "forces": forces,
            "silencieuse": moteur["silencieuse"],
            "label_ombre_herite": label,
            "palier_plancher": pal,
            "scores_Q1": {"sA": sA, "sB": sB},
            "somme_heritee": somme_heritee(prof["h_norm"], prof["r_norm"]),
            "journal_statut": statut,
        },
        "bloc_2_forme": {
            "voies_par_force": {f: {"A": trace[f]["A"], "B": trace[f]["B"],
                                    "C": trace[f]["C"],
                                    "retenue": trace[f]["retenue"]}
                                for f in FORCES},
            "nb_voies": {"A": sum(1 for f in FORCES if trace[f]["A"]),
                         "B": sum(1 for f in FORCES if trace[f]["B"]),
                         "C": sum(1 for f in FORCES if trace[f]["C"])},
            "exclues_par_limite": moteur.get("exclues_par_limite", []),
            "c1_mode": prof["c1_mode"], "c2": prof["c2"],
            "c3": sorted(prof["c3"]), "c4": sorted(prof.get("c4", [])),
        },
        "bloc_3_empreinte": {
            "source": "RIO-03 — vraie table Q5 (EMPREINTES)",
            "empreinte": pas["empreinte"],
            "empreintes_existantes": sorted(core_q5.EMPREINTES),
        },
        "bloc_4_couple": {
            "source": "RIO-04 — vraie table Q4 (CONFIGS_9)",
            "type_mesure": type_q4,
            "configurations_atteignables": configs_possibles,
        },
        "bloc_5_force": [{f: val_q3.TEMPLATES_FORCES[f]} for f in forces]
                        if forces else
                        ["silence gardé — aucune force fabriquée"],
        "bloc_6_limites": limites,
        "bloc_7_palier_pas": {
            "palier": pal,
            "pas": pas["pas"],
            "pas_label": pas["label"],
            "suivi_14j": {"categories": ["CELEBRE ≥ 9", "AJUSTEMENT 7-8",
                                         "REPRISE ≤ 6"],
                          "sanction": "aucune — jamais (le vrai moteur "
                                      "renvoie None, vérifié 15/15)"},
            "retest": "re-test à 8 semaines (vrai programmer_re_test_q1) + "
                      "long_termique du cœur (force apparue = FIABLE, "
                      "force disparue = re-vérifiée avant tout affichage)",
        },
    }
    fragment["_complet"] = all(
        v not in (None, "", [], {}) for v in _valeurs_feuilles(fragment)
    )
    _FRAG_CACHE[cle] = fragment
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
