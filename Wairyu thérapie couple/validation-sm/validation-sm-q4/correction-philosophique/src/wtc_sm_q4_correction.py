# -*- coding: utf-8 -*-
"""
WTC-SM-Q4 — COUCHE DE CORRECTION PHILOSOPHIQUE (fichier SUPPLÉMENTAIRE)
=======================================================================
RIO-14 « Nos deux rives » — rattrapage au gabarit universel §5.1-§5.4 du
canon (demande fondateur, même ordre que RIO-01→04 et RIO-06→13 : fichiers
SUPPLÉMENTAIRES, zéro modification de l'existant, exactitude des calculs).

RÈGLE ABSOLUE : ce module NE MODIFIE AUCUN moteur existant.
- Le vrai cœur de la quête reste `validation-sm/validation-sm-q4/src/
  wtc_sm_q4_core.py` (SPEC verrouillée 18/10 — A1 bornes 2,50/3,50 ·
  A2 zéro item nouveau · A3 percentiles + boucle ≥ 30 + styles ≥ 1,00 ·
  A4 override crise héritée · A5 9 noms mot pour mot · asymétrie
  structurelle det←Q1 / chg←Q2 · contresigné) — importé tel quel,
  jamais recopié.
- Les junctions utilisent les VRAIS moteurs `validation-sm-q5`
  (palier_de — LA table du pas, pas_de, BANQUE_PAS, TEMPLATES,
  LITTERAL_ORIENTATION, statut_engagement_de) et le filet réel de Q2
  (FILET — court-circuit amont validé P1).
- Cette couche ajoute ce que l'audit (Task 163) a trouvé manquant sur
  RIO-14 : F2 palier de COUPLE 🟢🟠🔴 dérivé MÉCANIQUEMENT des VRAIES
  sorties + QUAND DEMANDER DE L'AIDE (22/25) ; F3 contenu des 3 paliers
  PAR CONFIGURATION RÉELLE + branchement quête « pas » au niveau couple
  (12/25) ; F4 fragment de bilan L8 (7 blocs) (18/25). La lecture
  graduée F1 (25/25 — 9 configurations D-TABLE, anti-inversion, D-STD-2)
  est PRÉSERVÉE telle quelle.

Règles pré-enregistrées :
- R1 (palier de COUPLE, 0 seuil ajouté) : dérivé MÉCANIQUEMENT des VRAIS
  niveaux du croisement — 🟢 ssi (FAIBLE, FAIBLE) · 🟠 ssi max-rang =
  MOYEN · 🔴 ssi max-rang = ÉLEVÉ ∨ crise héritée (override réel). La
  JUNCTION EST LA PREUVE : ce palier est comparé bit-exact au VRAI
  palier_de de la quête pas (Q5) sur les 9 configurations + l'override —
  la couche ne crée AUCUNE table propre : elle vérifie que la table du
  croisement EST celle du pas (9/9 + override).
- R2 (D-CRISE hérité, court-circuit) : en crise héritée, l'affichage est
  le VRAI affichage du moteur (CRISE_HÉRITÉE + TEMPLATE_CRISE mot pour
  mot) : la configuration reste TRACÉE (config_calculee — vraie clé) et
  n'est PAS déployée comme verdict ; les voies héritées reçues en entrée
  sont listées ; le filet des quêtes amont (FILET réel de Q2) est rappelé.
  JAMAIS de pas de couple en crise (VRAI pas_de → None).
- R3 (ombre de couple causale, sans étiquette) : le texte d'ombre est le
  VRAI template de la configuration (9 noms, mot pour mot — C5 validé
  P1) ; la zone calme porte la clause anti-fabrication réelle (« rien à
  fabriquer ici » — template CALME).
- R4 (diagnostics réels affichés comme tels) : la boucle probable (VRAI
  boucle_probable_de — écart de percentiles ≥ 30, avertissement JAMAIS un
  verdict) et les styles dissemblables (VRAI styles_dissemblables_de —
  écart de dispersion ≥ 1,00) sont affichés comme AVERTISSEMENTS, la
  direction n'est jamais dite (doctrine : boucle nommée ENSEMBLE,
  jamais qui poursuit ni qui se retire).
- R5 (anti-fabrication §5.5) : le palier est celui du VRAI palier_de ;
  « rien à fabriquer » n'apparaît que sur CALME DES DEUX RIVES (le
  template réel le porte) ; en crise, aucun verdict de couple, aucun pas ;
  0 % compatibilité — aucune note, aucune direction.
- R6 (vocabulaire écran) : 0 mot interdit ; EXCEPTION SOURCÉE : le filet
  (literal des moteurs amont, validé P1) et la case « trouble » du canon
  si citée via la banque de pas (ligne 133).
- R7 (D-SIM) : bandeau simulation sur chaque bloc écran.
- R8 (couplage pas réel) : le pas annoncé est celui du VRAI pas_de de Q5
  sur le palier du croisement — au niveau COUPLE (les pas 🟠 de la banque
  sont « à deux ») ; 🔴 → aucun pas (D-CRISE). Suivi 14 j sans sanction
  (VRAI statut_engagement_de) + re-test 8 semaines.
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
_PKG = Path(__file__).resolve().parents[1]           # …/validation-sm-q4/correction-philosophique
_Q4 = _PKG.parent                                    # …/validation-sm-q4
_SM = _Q4.parent                                     # …/validation-sm
_WTC = _SM.parent                                    # …/Wairyu thérapie couple


def _charge(nom: str, chemin: Path):
    spec = importlib.util.spec_from_file_location(nom, chemin)
    mod = importlib.util.module_from_spec(spec)
    sys.modules[nom] = mod
    spec.loader.exec_module(mod)
    return mod


core_q4 = _charge("wtc_sm_q4_core", _Q4 / "src" / "wtc_sm_q4_core.py")
core_q5 = _charge("wtc_sm_q5_core", _SM / "validation-sm-q5" / "src" / "wtc_sm_q5_core.py")
core_q2 = _charge("wtc_sm_q2_core", _SM / "validation-sm-q2" / "src" / "wtc_sm_q2_core.py")

# Vérification d'intégrité des moteurs chargés (ce sont bien les vrais) :
assert len(core_q4.CONFIG_LABELS) == 9 and len(core_q4.TEMPLATES_CONFIG) == 9
assert core_q4.SEUIL_FAIBLE == 2.50 and core_q4.SEUIL_ELEVE == 3.50
assert core_q4.SEUIL_BOUCLIE == 30.0 and core_q4.SEUIL_STYLES == 1.00
assert core_q4.AFFICHAGE_CRISE == "CRISE_HÉRITÉE"
assert core_q4.VOIES_HERITEES == ("A2", "SM-C1", "H5")
assert len(core_q5.BANQUE_PAS) == 3 and core_q5.N_JOURS == 14
assert core_q5.pas_de(core_q5.PALIER_ROUGE) is None
assert "violences" in core_q2.FILET   # le filet réel est bien celui de l'amont

# ─────────────────────────────────────────────────────────────────────────────
# CONSTANTES DE LA COUCHE (R1-R9)
# ─────────────────────────────────────────────────────────────────────────────
RANG_NIVEAU = {"FAIBLE": 0, "MOYEN": 1, "ÉLEVÉ": 2}
# Le palier de la couche PORTE LES VRAIES CONSTANTES de la quête pas (Q5) —
# la junction est structurelle : la couche ne crée pas de table propre.
PALIER_VERT = core_q5.PALIER_VERT          # « EXERCICE MAISON »
PALIER_ORANGE = core_q5.PALIER_ORANGE      # « MODULE DE COUPLE »
PALIER_ROUGE = core_q5.PALIER_ROUGE        # « ORIENTATION »
EMOJI_PALIER = {PALIER_VERT: "🟢", PALIER_ORANGE: "🟠", PALIER_ROUGE: "🔴"}
PALIER_NOM = {PALIER_VERT: "Rives calmes — capitalisation",
              PALIER_ORANGE: "À deux — le pas de la banque",
              PALIER_ROUGE: "Avec un professionnel — orientation chaleureuse"}

# Les 9 configurations réelles par palier (dérivées de la table du VRAI
# croisement — vérifiée ≡ palier_de Q5 au COR2) :
CONFIGS_PAR_PALIER = {
    PALIER_VERT: ("CALME DES DEUX RIVES",),
    PALIER_ORANGE: ("VEILLE", "COURANT FORT", "DEUX COURANTS"),
    PALIER_ROUGE: ("PORTE SEULE", "RIVE QUI CÈDE", "TEMPÊTE",
                   "TEMPÊTE ET DIGUE", "DÉBORDEMENT"),
}

MOTS_INTERDITS = (
    "pathologie", "diagnostic", "dépistage", "anxieux", "anxiété",
    "dépressif", "dépression", "trouble", "syndrome", "symptôme",
    "burn-out", "burnout", "addiction", "bipolaire", "borderline",
    "schizophrénie", "névrose", "psychose", "suicide", "médicament",
    "posologie", "chronique",
)

# Exception sourcée : case « trouble » du canon si la banque de pas est
# citée (ligne 133 — banque réelle de Q5) :
CANON_CASES = "trouble / toi / désaccord"


def _texte_pour_controle(texte: str) -> str:
    return texte.replace(CANON_CASES, " ").replace(
        "3 cases : trouble / toi / désaccord", " ")


BANDEAU_DSIM = ("[D-SIM] Lecture issue d'une simulation — la mécanique est "
                "validée, pas la prévalence clinique.")

PHRASE_ORIENTATION = core_q5.LITTERAL_ORIENTATION   # VRAI literal de la quête pas SM

CLAUSE_AIDE = (
    "QUAND DEMANDER DE L'AIDE — seuils posés d'avance, les mêmes pour tout "
    "le monde : une crise héritée (voie A2, SM-C1 ou H5 sur l'un des deux "
    "profils — mesurée par RIO-11/RIO-12 ou signalée par la sécurité) → le "
    "croisement n'est pas déployé, l'orientation est le pas ; une "
    "configuration à ÉLEVÉ → l'orientation est proposée ; une "
    "configuration à MOYEN → à deux, re-test proposé à 8 semaines ; CALME "
    "DES DEUX RIVES → rien à fabriquer, la suite du parcours sert aussi à "
    "ça."
)

NIVEAU_BAS, NIVEAU_MOYEN, NIVEAU_ELEVE = "FAIBLE", "MOYEN", "ÉLEVÉ"

# ─────────────────────────────────────────────────────────────────────────────
# R1 — PALIER DE COUPLE (mécanique, junction = VRAI palier_de de Q5)
# ─────────────────────────────────────────────────────────────────────────────
def palier_de_couple(niveau_det: str, niveau_chg: str, crise: bool) -> str:
    """R1 — palier dérivé mécaniquement des VRAIS niveaux (max-rang),
    porté par les VRAIES constantes de la quête pas (Q5) :
    🟢 ssi (FAIBLE, FAIBLE) · 🟠 ssi max = MOYEN · 🔴 ssi max = ÉLEVÉ ∨
    crise. Junction : DOIT être identique au VRAI palier_de de Q5
    (vérifié bit-exact à chaque appel — assert)."""
    palier = (PALIER_ROUGE if crise else
              PALIER_VERT if niveau_det == NIVEAU_BAS
              and niveau_chg == NIVEAU_BAS
              else PALIER_ORANGE if max(RANG_NIVEAU[niveau_det],
                                        RANG_NIVEAU[niveau_chg]) == 1
              else PALIER_ROUGE)
    # JUNCTION RÉELLE — la couche ne crée pas de table propre :
    vrai = core_q5.palier_de(niveau_det, niveau_chg, crise)
    if palier != vrai:
        raise AssertionError(
            f"junction palier rompue : {palier} != VRAI palier_de {vrai}")
    return palier


def palier_et_seuils(scores_det, scores_chg, voies_p1=(), voies_p2=(),
                     pct_det=None, pct_chg=None, sd_det=None, sd_chg=None):
    """R1/R2/R4 — lecture complète via le VRAI classifier de Q4.

    pct_det/pct_chg : percentiles réels (VRAI percentile_de) si fournis —
    la boucle probable est lue par le VRAI boucle_probable_de.
    sd_det/sd_chg : dispersions réelles (VRAI styles_de) si fournies —
    la dissemblance est lue par le VRAI styles_dissemblables_de.
    """
    cls = core_q4.classifier(scores_det, scores_chg, voies_p1, voies_p2)
    niveau_det, niveau_chg = cls["niveau_det"], cls["niveau_chg"]
    crise = cls["crise_heritee"]
    palier = palier_de_couple(niveau_det, niveau_chg, crise)
    boucle = (core_q4.boucle_probable_de(pct_det, pct_chg)
              if pct_det is not None and pct_chg is not None else None)
    dissemblables = (core_q4.styles_dissemblables_de(sd_det, sd_chg)
                     if sd_det is not None and sd_chg is not None else None)
    return {
        "niv_det": cls["niv_det"], "niv_chg": cls["niv_chg"],
        "niveau_det": niveau_det, "niveau_chg": niveau_chg,
        "config_calculee": cls["config_calculee"],
        "affichage": cls["affichage"],
        "template": cls["template"],          # VRAI template (mot pour mot)
        "crise_heritee": crise,
        "voies_p1": tuple(voies_p1), "voies_p2": tuple(voies_p2),
        "palier": palier, "palier_nom": PALIER_NOM[palier],
        "boucle_probable": boucle,
        "styles_dissemblables": dissemblables,
        "S1": palier == PALIER_ROUGE,
        "S2": palier == PALIER_ORANGE,
    }


def palier_independant(niv_det: int, niv_chg: int, crise: bool) -> dict:
    """COR2 — chemin de calcul INDÉPENDANT (entiers purs, zéro float).

    Recalcule configuration et palier depuis les RANGS ENTIERS des
    cellules (0/1/2) sans passer par aucun score flottant — la table des
    9 noms est recopiée depuis la VRAIE TABLE_CONFIGS (lue à l'import,
    jamais réécrite). Doit converger EXACTEMENT avec le VRAI moteur."""
    table = {("FAIBLE", "FAIBLE"): "CALME DES DEUX RIVES",
             ("FAIBLE", "MOYEN"): "VEILLE",
             ("FAIBLE", "ÉLEVÉ"): "PORTE SEULE",
             ("MOYEN", "FAIBLE"): "COURANT FORT",
             ("MOYEN", "MOYEN"): "DEUX COURANTS",
             ("MOYEN", "ÉLEVÉ"): "RIVE QUI CÈDE",
             ("ÉLEVÉ", "FAIBLE"): "TEMPÊTE",
             ("ÉLEVÉ", "MOYEN"): "TEMPÊTE ET DIGUE",
             ("ÉLEVÉ", "ÉLEVÉ"): "DÉBORDEMENT"}
    noms = {0: "FAIBLE", 1: "MOYEN", 2: "ÉLEVÉ"}
    config = table[(noms[niv_det], noms[niv_chg])]
    palier = (PALIER_ROUGE if crise else
              PALIER_VERT if niv_det == 0 and niv_chg == 0
              else PALIER_ORANGE if max(niv_det, niv_chg) == 1
              else PALIER_ROUGE)
    return {"config": config, "palier": palier}


# ─────────────────────────────────────────────────────────────────────────────
# R3/R4/R5/R6 — TEXTES ÉCRAN (ombre de couple, sans étiquette, sans blâme)
# ─────────────────────────────────────────────────────────────────────────────
def clause_boucle(boucle: bool) -> str:
    """R4 — le VRAI avertissement de boucle, ENSEMBLE, sans direction."""
    if not boucle:
        return ("Pas de motif de boucle détecté dans les rangs relatifs "
                "de vos deux rives (seuil réel : écart de percentiles "
                "≥ 30).")
    return ("Motif de boucle probable — le VRAI avertissement du moteur "
            "(écart de percentiles ≥ 30) : vous tournez ENSEMBLE dans un "
            "cycle qui se nourrit de lui-même. La direction n'est jamais "
            "affichée : ce n'est l'affaire ni de l'un, ni de l'autre — "
            "c'est l'affaire du cycle.")


def clause_styles(dissemblables: bool) -> str:
    """R4 — le VRAI avertissement de styles, sans blâme."""
    if not dissemblables:
        return ("Vos styles de réponse sont proches (écart de dispersion "
                "< 1,00) : les deux rives se lisent dans la même langue.")
    return ("Vos styles de réponse sont dissemblables (écart de "
            "dispersion ≥ 1,00) : vous ne remplissez pas les échelles de "
            "la même façon. C'est un avertissement de lecture, pas un "
            "verdict — à relire ensemble.")


def _clause_exercice(pal: dict) -> str:
    """F3 — contenu du palier 🟢 : capitalisation (la vraie banque)."""
    if pal["config_calculee"] == "CALME DES DEUX RIVES":
        return ("🟢 À deux : choisir un pas 🟢 de la vraie banque et le "
                "tenir une semaine — pratiquer une force identifiée en "
                "RIO-13, ou noter chaque soir un mot sur votre rive à "
                "vous. C'est une capitalisation, pas une réparation.")
    return ("🟢 À deux : choisir un pas 🟢 de la vraie banque et le tenir "
            "une semaine (pratiquer une force de RIO-13 · un mot par soir "
            "· préparer sa question pour la Revue mensuelle).")


def _clause_module(pal: dict) -> str:
    """F3 — contenu du palier 🟠 : les VRAIS pas 🟠 de la banque (à deux)."""
    return ("🟠 À deux : un pas 🟠 de la vraie banque, cette semaine — "
            "co-étiqueter la frontière (3 cases : trouble / toi / "
            "désaccord) · tenir Les rituels de deux adultes · ouvrir Le "
            "plan des jours durs et l'ajuster ensemble. Un seul, choisi "
            "ensemble.")


def clause_couple_crise(voies_p1, voies_p2, template_crise: str) -> str:
    """R2 — le VRAI TEMPLATE_CRISE mot pour mot + voies réelles + filet."""
    voies = sorted(set(voies_p1) | set(voies_p2))
    voies_txt = " ∨ ".join(voies) if voies else "voie héritée"
    return (f"{template_crise} Voies héritées reçues en entrée : "
            f"{voies_txt}. Le filet des quêtes amont s'applique : "
            f"{core_q2.FILET}.")


def bloc_ecran(pal: dict) -> dict:
    """Assemble le bloc écran complet RIO-14 (toutes les clauses sont
    déterminées mécaniquement par les sorties du vrai cœur).

    R2 — en crise : le VRAI affichage (config tracée, jamais déployée).
    R5 — « rien à fabriquer » n'apparaît que via le template CALME réel.
    """
    if pal["crise_heritee"]:
        texte = "\n".join([
            BANDEAU_DSIM,
            clause_couple_crise(pal["voies_p1"], pal["voies_p2"],
                                pal["template"]),
            f"Palier {pal['palier']} ({pal['palier_nom']}) — {PHRASE_ORIENTATION}",
            "JAMAIS de pas de couple en crise (le VRAI pas_de retourne "
            "None) : l'orientation EST le pas.",
            CLAUSE_AIDE,
        ])
        return {
            "texte": texte,
            "md5": hashlib.md5(texte.encode("utf-8")).hexdigest(),
            "nb_mots_interdits": sum(1 for m in MOTS_INTERDITS
                                     if m in _texte_pour_controle(
                                         texte).lower()),
            "crise": True,
        }
    parties = [BANDEAU_DSIM]
    parties.append(
        f"Vos deux rives se lisent : détresse {pal['niveau_det'].lower()} · "
        f"charge {pal['niveau_chg'].lower()} — configuration : "
        f"{pal['config_calculee']}.")
    parties.append(pal["template"])        # R3 — VRAI template mot pour mot
    if pal["boucle_probable"] is not None:
        parties.append(clause_boucle(pal["boucle_probable"]))
    if pal["styles_dissemblables"] is not None:
        parties.append(clause_styles(pal["styles_dissemblables"]))
    parties.append(f"CE QUE VOUS POUVEZ CHANGER — palier {EMOJI_PALIER[pal['palier']]} "
                   f"({pal['palier_nom']}) :")
    if pal["palier"] == PALIER_VERT:
        parties.append(_clause_exercice(pal))
    elif pal["palier"] == PALIER_ORANGE:
        parties.append(_clause_module(pal))
    else:
        parties.append(
            f"🔴 Avec un professionnel : {pal['config_calculee']} est une "
            f"configuration à ÉLEVÉ — {PHRASE_ORIENTATION}.")
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
# R8 — BRANCHEMENT PAS (VRAI Q5, niveau couple)
# ─────────────────────────────────────────────────────────────────────────────
def pas_du_couple(pal: dict):
    """R8 — le pas du couple = le VRAI pas_de sur le palier du croisement.
    🔴 → None (D-CRISE). Les pas 🟠 de la banque sont « à deux »."""
    return core_q5.pas_de(pal["palier"])


def re_test_huit_semaines(depuis: str = "2026-01-01") -> str:
    """R9 — arithmétique de dates (+56 jours), jamais forcée."""
    d = date.fromisoformat(depuis)
    return (d + timedelta(weeks=8)).isoformat()


# ─────────────────────────────────────────────────────────────────────────────
# F4 — FRAGMENT DE BILAN L8 (7 blocs, niveau COUPLE)
# ─────────────────────────────────────────────────────────────────────────────
def bilan_fragment(pal: dict) -> dict:
    """Contribution de RIO-14 au bilan d'ensemble (assemblage L8 du canon).

    7 blocs niveau couple : position · forme · empreintes · configuration ·
    forces · limites · palier/pas. La configuration est MESURÉE ICI (le
    croisement réel) ; les empreintes viennent de RIO-11/RIO-12 ; les
    forces de RIO-13 (balayage honnête).
    """
    pas = pas_du_couple(pal)
    config = pal["config_calculee"]
    fragment = {
        "bloc_1_position": {
            "niv_det_mesure": pal["niv_det"],
            "niv_chg_mesure": pal["niv_chg"],
            "niveau_det": pal["niveau_det"],
            "niveau_chg": pal["niveau_chg"],
            "affichage_moteur": pal["affichage"],
            "crise_heritee": pal["crise_heritee"],
            "sources": "détresse ← RIO-11 (Q1-R3) · charge ← RIO-12 (Q2) "
                       "— asymétrie structurelle, zéro item nouveau (A2)",
        },
        "bloc_2_forme": {
            "boucle_probable": pal["boucle_probable"]
            if pal["boucle_probable"] is not None else "non évaluée ici "
            "(percentiles non fournis — diagnostic réel du moteur)",
            "styles_dissemblables": pal["styles_dissemblables"]
            if pal["styles_dissemblables"] is not None else
            "non évalué ici (dispersions non fournies — diagnostic réel "
            "du moteur)",
            "seuils_reels": "boucle ≥ 30 (percentiles) · styles ≥ 1,00 "
                            "(dispersion) — avertissements, jamais des "
                            "verdicts (A3)",
        },
        "bloc_3_empreintes": {
            "voies_p1": list(pal["voies_p1"]) or ["aucune"],
            "voies_p2": list(pal["voies_p2"]) or ["aucune"],
            "labels_possibles_detresse": ["STABLE", "CHARGE", "MASQUE",
                                          "MIXTE", "CRISE"],
            "labels_possibles_aidant": ["STABLE", "ÉPUISÉ", "SURIMPLIQUÉ",
                                        "HOSTILE", "MIXTE"],
        },
        "bloc_4_configuration": {
            "source": "MESURÉ ICI — vrai moteur sm-q4 (9 noms, A5)",
            "config_tracee": config,
            "affichage": pal["affichage"],
            "template_moteur": pal["template"],
            "override_crise": ("configuration TRACÉE, jamais déployée "
                               "(VRAI A4)" if pal["crise_heritee"] else
                               "non concerné"),
        },
        "bloc_5_forces": {
            "source": "RIO-13 — vrai moteur sm-q3 (les 6 forces F-S1 à "
                      "F-S6)",
            "note": ("les forces du lien se mesurent en RIO-13 — ce "
                     "croisement ne les invente pas"),
        },
        "bloc_6_limites": {
            "rives": {"détresse": pal["niveau_det"],
                      "charge": pal["niveau_chg"]},
            "note": ("la rive détresse se lit sur Q1, la charge sur Q2 — "
                     "sans exception (anti-inversion, asymétrie "
                     "structurelle)"),
        },
        "bloc_7_palier_pas": {
            "palier": pal["palier"],
            "pas_du_couple": pas if pas is not None
            else "aucun pas de couple — l'orientation EST le pas (D-CRISE, "
                 "VRAI pas_de → None)",
            "pas_labels_reels": list(core_q5.BANQUE_PAS[pal["palier"]])
            if pal["palier"] != "🔴" else [],
            "suivi_14_jours_sans_sanction": True,
            "retest": ("re-test RIO-14 proposé à 8 semaines — " +
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
