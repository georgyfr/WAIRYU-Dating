# -*- coding: utf-8 -*-
"""
WTC-SM-Q5 — COUCHE DE CORRECTION PHILOSOPHIQUE (fichier SUPPLÉMENTAIRE)
=======================================================================
RIO-15 « Mon premier pas vers l'autre rive » — rattrapage au gabarit
universel §5.1-§5.4 du canon (demande fondateur, même ordre que RIO-01→04
et RIO-06→14 : fichiers SUPPLÉMENTAIRES, zéro modification de l'existant,
exactitude des calculs).

RÈGLE ABSOLUE : ce module NE MODIFIE AUCUN moteur existant.
- Le vrai cœur de la quête reste `validation-sm/validation-sm-q5/src/
  wtc_sm_q5_core.py` (SPEC verrouillée 18/10 — A1 check-in binaire 9/14 ·
  A2 banque de 6 pas ancrée + forces Q3 + champ libre · A3 table palier =
  max + override crise · A4 RCI L7 verbatim · A5 C6 = 0 sanction ·
  contresigné) — importé tel quel, jamais recopié.
- Les junctions utilisent les VRAIS moteurs `validation-sm-q3` (les 6
  forces — le pas 🟢 « pratiquer la force dérivée identifiée en Q3 »),
  `validation-sm-q4` (config_de, niveau_de, TEMPLATES_CONFIG — la config
  tracée et son template réel) et `validation-sm-q2` (FILET amont).
- Cette couche ajoute ce que l'audit (Task 163) a trouvé manquant sur
  RIO-15 : F2 palier AFFICHÉ + QUAND DEMANDER DE L'AIDE (23/25) ; F4
  fragment de bilan L8 (7 blocs) (18/25). F3 (25/25 — banque de pas +
  check-in binaire + re-test 8 semaines validés P1) est PRÉSERVÉ tel
  quel : les pas affichés sont les VRAIS de la banque, jamais réécrits.

Règles pré-enregistrées :
- R1 (palier AFFICHÉ, 0 seuil ajouté) : le palier EST la sortie du VRAI
  palier_de (EXERCICE MAISON / MODULE DE COUPLE / ORIENTATION) affichée
  avec son emoji (🟢/🟠/🔴) et la règle lisible : palier = max(niveau
  détresse, niveau charge) — mécanique pure, override crise en premier.
- R2 (D-CRISE, court-circuit AVANT le choix du pas) : en crise héritée,
  l'écran affiche ORIENTATION sans AUCUN pas (le VRAI pas_de retourne
  None — « JAMAIS de pas de couple en crise ») + le VRAI
  LITTERAL_ORIENTATION + le filet amont réel. La config reste TRACÉE.
- R3 (ombre héritée causale) : la configuration tracée (VRAI config_de)
  est affichée avec le VRAI template de Q4 (mot pour mot) — l'ombre du
  pas est l'ombre du croisement, jamais réinventée.
- R4 (doctrine du pas affichée) : le pas est CHOISI jamais prescrit
  (champ libre réel — PAS_LIBRE), célébré jamais sanctionné (VRAIS
  statuts CÉLÉBRÉ ≥ 9/14 / EN CHEMIN — aucun statut de sanction n'existe
  dans le moteur), le compteur est privé (le suivi binaire n'est lu que
  pour le statut — vérifié : le VRAI statut_engagement_de ne lit que la
  somme des 14 booléens).
- R5 (anti-fabrication §5.5) : les pas affichés sont EXACTEMENT ceux de
  la VRAIE banque (🟢 ×3 · 🟠 ×3 · 🔴 vide) ; CÉLÉBRÉ pile 9/14 → le
  VRAI template celebre_pile ; RCI → les VRAIS statuts L7 (FIABLE /
  SUGGESTION / BRUIT + ensemble max) ; le positif n'est jamais généré
  (BRUIT = « la mesure ne tranche pas encore » — template réel).
- R6 (vocabulaire écran) : 0 mot interdit ; EXCEPTION SOURCÉE : le filet
  amont (literal moteur P1) et la case « trouble » si la banque de pas
  est citée (ligne 133).
- R7 (D-SIM) : bandeau simulation sur chaque bloc écran.
- R8 (junction forces réelles) : le pas 🟢 « pratiquer la force dérivée
  identifiée en Q3 » pointe les forces MESURÉES par RIO-13 (banque
  F-S1 à F-S6 réelle) — la couche liste la banque, ne l'invente pas.
- R9 (re-test 8 semaines) : le VRAI RCI lit base/re-test (Δ = re-test −
  base, asymétrie temporelle réelle) ; la date de re-test est une
  arithmétique (+56 j), jamais forcée.
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
_PKG = Path(__file__).resolve().parents[1]           # …/validation-sm-q5/correction-philosophique
_Q5 = _PKG.parent                                    # …/validation-sm-q5
_SM = _Q5.parent                                     # …/validation-sm
_WTC = _SM.parent                                    # …/Wairyu thérapie couple


def _charge(nom: str, chemin: Path):
    spec = importlib.util.spec_from_file_location(nom, chemin)
    mod = importlib.util.module_from_spec(spec)
    sys.modules[nom] = mod
    spec.loader.exec_module(mod)
    return mod


core_q5 = _charge("wtc_sm_q5_core", _Q5 / "src" / "wtc_sm_q5_core.py")
core_q3 = _charge("wtc_sm_q3_core", _SM / "validation-sm-q3" / "src" / "wtc_sm_q3_core.py")
core_q4 = _charge("wtc_sm_q4_core", _SM / "validation-sm-q4" / "src" / "wtc_sm_q4_core.py")
core_q2 = _charge("wtc_sm_q2_core", _SM / "validation-sm-q2" / "src" / "wtc_sm_q2_core.py")

# Vérification d'intégrité des moteurs chargés (ce sont bien les vrais) :
assert core_q5.N_JOURS == 14 and core_q5.SEUIL_CELEBRE == 9
assert len(core_q5.BANQUE_PAS[core_q5.PALIER_VERT]) == 3
assert len(core_q5.BANQUE_PAS[core_q5.PALIER_ORANGE]) == 3
assert len(core_q5.BANQUE_PAS[core_q5.PALIER_ROUGE]) == 0
assert core_q5.pas_de(core_q5.PALIER_ROUGE) is None
assert core_q5.SE_DIFF == 0.356 and core_q5.SEUIL_FIABLE == 0.58
assert core_q5.SEUIL_SUGGESTION == 0.41
assert len(core_q5.TEMPLATES) == 9 and len(core_q5.NOMENCLATURE) == 11
assert len(core_q3.FORCES_BANQUE) == 6
assert len(core_q4.CONFIG_LABELS) == 9
assert "violences" in core_q2.FILET

# ─────────────────────────────────────────────────────────────────────────────
# CONSTANTES DE LA COUCHE (R1-R9)
# ─────────────────────────────────────────────────────────────────────────────
EMOJI_PALIER = {core_q5.PALIER_VERT: "🟢", core_q5.PALIER_ORANGE: "🟠",
                core_q5.PALIER_ROUGE: "🔴"}
RANG_NIVEAU = {"FAIBLE": 0, "MOYEN": 1, "ÉLEVÉ": 2}

MOTS_INTERDITS = (
    "pathologie", "diagnostic", "dépistage", "anxieux", "anxiété",
    "dépressif", "dépression", "trouble", "syndrome", "symptôme",
    "burn-out", "burnout", "addiction", "bipolaire", "borderline",
    "schizophrénie", "névrose", "psychose", "suicide", "médicament",
    "posologie", "chronique",
)

# Exception sourcée : case « trouble » du canon si la banque de pas est
# citée (ligne 133 — le pas 🟠 réel contient ce literal) :
CANON_CASES = "3 cases : trouble / toi / désaccord"


def _texte_pour_controle(texte: str) -> str:
    return texte.replace(CANON_CASES, " ")


BANDEAU_DSIM = ("[D-SIM] Lecture issue d'une simulation — la mécanique est "
                "validée, pas la prévalence clinique.")

CLAUSE_AIDE = (
    "QUAND DEMANDER DE L'AIDE — seuils posés d'avance, les mêmes pour tout "
    "le monde : une crise héritée (voie A2, SM-C1 ou H5 sur l'un des deux "
    "profils) → palier ORIENTATION sans AUCUN pas de couple (le moteur ne "
    "déploie jamais de pas en crise) — le filet des quêtes amont s'applique "
    f"({core_q2.FILET}) ; une rive à ÉLEVÉ → ORIENTATION ; une rive à "
    "MOYEN (sans ÉLEVÉ) → MODULE DE COUPLE, re-test proposé à 8 semaines ; "
    "les deux rives FAIBLES → EXERCICE MAISON, rien à fabriquer de plus. "
    "Le re-test à 8 semaines lit le VRAI RCI (|Δ| ≥ 0,58 fiable · "
    "[0,41 ; 0,58[ piste · < 0,41 bruit) — jamais un verdict de rémission."
)

# ─────────────────────────────────────────────────────────────────────────────
# R1 — PALIER AFFICHÉ (la sortie du VRAI palier_de, telle quelle)
# ─────────────────────────────────────────────────────────────────────────────
def palier_et_seuils(c: dict) -> dict:
    """R1/R2 — lecture complète via le VRAI classifier de Q5 (toute la
    mécanique du moteur : niveaux, config tracée, palier, pas, statut,
    RCI). La couche n'ajoute AUCUN calcul propre sur ces points."""
    cls = core_q5.classifier(c)
    return {
        "niv_det": cls["niv_det"], "niv_chg": cls["niv_chg"],
        "config_tracee": cls["config"],
        "palier": cls["palier"],
        "pas": cls["pas"],
        "statut": cls["statut"],
        "rci": cls["rci"],
        "crise": cls["crise"],
        "S1": cls["palier"] == core_q5.PALIER_ROUGE,
        "S2": cls["palier"] == core_q5.PALIER_ORANGE,
        "voies_p1": tuple(c.get("voies_p1", ())),
        "voies_p2": tuple(c.get("voies_p2", ())),
    }


def palier_independant(niv_det: str, niv_chg: str, crise: bool) -> str:
    """COR2 — chemin de calcul INDÉPENDANT (entiers purs, zéro float) :
    max-rang sur les rangs entiers des niveaux, override crise en premier.
    Doit converger EXACTEMENT avec le VRAI palier_de."""
    rang = max(RANG_NIVEAU[niv_det], RANG_NIVEAU[niv_chg])
    attendu = (core_q5.PALIER_ROUGE if crise else
               {0: core_q5.PALIER_VERT, 1: core_q5.PALIER_ORANGE,
                2: core_q5.PALIER_ROUGE}[rang])
    vrai = core_q5.palier_de(niv_det, niv_chg, crise)
    if attendu != vrai:
        raise AssertionError(
            f"junction palier rompue : {attendu} != VRAI {vrai}")
    return attendu


# ─────────────────────────────────────────────────────────────────────────────
# R2/R3/R4/R5/R6 — TEXTES ÉCRAN (doctrine du pas, sans prescription)
# ─────────────────────────────────────────────────────────────────────────────
def clause_crise(voies_p1, voies_p2) -> str:
    """R2 — override réel : ORIENTATION sans AUCUN pas + filet amont."""
    voies = sorted(set(voies_p1) | set(voies_p2))
    voies_txt = " ∨ ".join(voies) if voies else "voie héritée"
    return (f"Crise héritée ({voies_txt}) — mesurée par les quêtes amont "
            f"ou signalée par la sécurité : palier 🔴 ORIENTATION, "
            f"{core_q5.TEMPLATES['orientation']} Aucun pas de couple n'est "
            f"déployé (le VRAI pas_de retourne None). Le filet des quêtes "
            f"amont s'applique : {core_q2.FILET}.")


def clause_config_tracee(config: str) -> str:
    """R3 — la configuration tracée avec le VRAI template de Q4."""
    template = core_q4.TEMPLATES_CONFIG.get(config)
    if template is None:
        return f"Configuration tracée : {config}."
    return f"Configuration tracée — {config} : {template}"


def clause_pas(pas, palier: str, choix: str | None) -> str:
    """R4/R5 — le pas affiché : VRAIE banque, choisi jamais prescrit."""
    if palier == core_q5.PALIER_ROUGE:
        return ("Aucun pas de couple n'est déployé : l'orientation EST le "
                "pas (court-circuit réel).")
    if choix:
        return (f"Votre pas, choisi par vous : « {choix} » — le champ "
                f"libre réel ({core_q5.PAS_LIBRE}).")
    return (f"Le pas servi par la vraie banque : « {pas} » — vous pouvez "
            f"le choisir autrement ({core_q5.PAS_LIBRE}) : le pas est "
            "choisi, jamais prescrit.")


def clause_suivi(statut, serie) -> str:
    """R4/R5 — le suivi 14 jours, célébré jamais sanctionné (VRAIS
    templates du moteur)."""
    if statut is None:
        return ("Suivi : non déployé — aucun pas à évaluer (court-circuit "
                "réel).")
    n = sum(1 for j in serie if j) if serie is not None else 0
    if statut == core_q5.STATUT_CELEBRE:
        if n == core_q5.SEUIL_CELEBRE:
            return "> " + core_q5.TEMPLATES["celebre_pile"]   # 9/14 pile
        return "> " + core_q5.TEMPLATES["celebre"].format(n=n)
    return "> " + core_q5.TEMPLATES["en_chemin"].format(n=n)


def clause_rci(rci) -> str:
    """R5 — le VRAI RCI L7 : les statuts réels, jamais une rémission.
    Le VRAI signification_de retourne une chaîne vide quand aucune borne
    n'est traversée — affiché « niveau stable » (la donnée réelle, dite)."""
    if rci is None:
        return ("RCI : pas encore de re-test — la mesure lira le "
                "changement à 8 semaines (Δ = re-test − base, asymétrie "
                "temporelle réelle).")
    def _signif(s):
        return s if s else "niveau stable"
    lignes = [
        f"RCI rive détresse : {rci['statut_det']} (Δ {rci['delta_det']:+.2f}"
        + (f" — traversée {_signif(rci['signif_det'])}" if rci["traversee_det"]
           else "") + ")",
        f"RCI rive charge : {rci['statut_chg']} (Δ {rci['delta_chg']:+.2f}"
        + (f" — traversée {_signif(rci['signif_chg'])}" if rci["traversee_chg"]
           else "") + ")",
        f"Ensemble : {rci['ensemble']} — ",
    ]
    if rci["ensemble"] == core_q5.ENSEMBLE_FIABLE:
        lignes[-1] += core_q5.TEMPLATES["fiable"]
    elif rci["ensemble"] == core_q5.ENSEMBLE_SUGGESTION:
        lignes[-1] += core_q5.TEMPLATES["suggestion"]
    else:
        lignes[-1] += core_q5.TEMPLATES["bruit"]
    return "\n".join(lignes)


def bloc_ecran(c: dict, pal: dict) -> dict:
    """Assemble le bloc écran complet RIO-15 (toutes les clauses sont
    déterminées mécaniquement par les sorties du vrai cœur)."""
    parties = [BANDEAU_DSIM]
    emoji = EMOJI_PALIER[pal["palier"]]
    parties.append(
        f"Votre pas se prépare : détresse {pal['niv_det'].lower()} · charge "
        f"{pal['niv_chg'].lower()} — palier {emoji} {pal['palier']} "
        "(max des deux niveaux, règle réelle du moteur).")
    parties.append(clause_config_tracee(pal["config_tracee"]))
    if pal["crise"]:
        parties.append(clause_crise(pal["voies_p1"], pal["voies_p2"]))
    parties.append(clause_pas(pal["pas"], pal["palier"],
                              c.get("choix_pas")))
    serie = c.get("serie")
    parties.append(clause_suivi(pal["statut"], serie))
    parties.append(clause_rci(pal["rci"]))
    if pal["palier"] == core_q5.PALIER_VERT and not pal["crise"]:
        # R5 — le VRAI template zone_calme, réservé à la zone calme réelle
        # (palier vert = les deux rives FAIBLES) :
        parties.append("> " + core_q5.TEMPLATES["zone_calme"])
    elif pal["palier"] == core_q5.PALIER_ORANGE and not pal["crise"]:
        parties.append("> " + core_q5.TEMPLATES["module_couple"])
    parties.append(CLAUSE_AIDE)
    texte = "\n".join(parties)
    return {
        "texte": texte,
        "md5": hashlib.md5(texte.encode("utf-8")).hexdigest(),
        "nb_mots_interdits": sum(1 for m in MOTS_INTERDITS
                                 if m in _texte_pour_controle(
                                     texte).lower()),
        "crise": pal["crise"],
    }


def re_test_huit_semaines(depuis: str = "2026-01-01") -> str:
    """R9 — arithmétique de dates (+56 jours), jamais forcée."""
    d = date.fromisoformat(depuis)
    return (d + timedelta(weeks=8)).isoformat()


# ─────────────────────────────────────────────────────────────────────────────
# F4 — FRAGMENT DE BILAN L8 (7 blocs)
# ─────────────────────────────────────────────────────────────────────────────
def bilan_fragment(c: dict, pal: dict) -> dict:
    """Contribution de RIO-15 au bilan d'ensemble (assemblage L8 du canon).

    7 blocs : position · forme · empreintes · configuration · forces ·
    limites · palier/pas/suivi/RCI. Le pas et son suivi sont MESURÉS ICI ;
    la configuration vient du croisement RIO-14 ; les forces de RIO-13.
    """
    pas_tab = {}
    for niv_det in ("FAIBLE", "MOYEN", "ÉLEVÉ"):
        for niv_chg in ("FAIBLE", "MOYEN", "ÉLEVÉ"):
            p = core_q5.palier_de(niv_det, niv_chg)
            pas_tab.setdefault(p, set()).add(core_q5.pas_de(p))
    fragment = {
        "bloc_1_position": {
            "niv_det": pal["niv_det"], "niv_chg": pal["niv_chg"],
            "palier": pal["palier"],
            "pas_deploye": pal["pas"] if pal["pas"] is not None
            else "aucun — ORIENTATION (court-circuit réel)",
            "crise_heritee": pal["crise"],
        },
        "bloc_2_forme": {
            "statut_suivi": pal["statut"] or "NON_DÉPLOYÉ",
            "serie_14_jours": ("binaire privé — " + str(
                sum(1 for j in c.get("serie") or [] if j)) + " jours tentés")
            if c.get("serie") is not None else "non déployé (crise)",
            "seuil_reel": "CÉLÉBRÉ ≥ 9/14 · EN CHEMIN < 9/14 — jamais de "
                          "sanction (A1 verrouillé)",
        },
        "bloc_3_empreintes": {
            "voies_p1": list(pal["voies_p1"]) or ["aucune"],
            "voies_p2": list(pal["voies_p2"]) or ["aucune"],
            "source": "RIO-11 / RIO-12 — vrais moteurs amont",
        },
        "bloc_4_configuration": {
            "source": "RIO-14 — vrai moteur sm-q4 (croisement contresigné)",
            "config_tracee": pal["config_tracee"],
            "template_moteur": core_q4.TEMPLATES_CONFIG.get(
                pal["config_tracee"], "template amont (crise)"),
        },
        "bloc_5_forces": {
            "source": "RIO-13 — vrai moteur sm-q3 (les 6 forces F-S1 à "
                      "F-S6)",
            "forces_banque": [f[0] for f in core_q3.FORCES_BANQUE],
            "pas_lie": "le pas 🟢 « pratiquer la force dérivée identifiée "
                       "en Q3 » pointe ces forces MESURÉES — jamais "
                       "inventées",
        },
        "bloc_6_limites": {
            "rci": ({**pal["rci"], "signif_det": pal["rci"]["signif_det"]
                     or "aucune traversée de borne (niveau stable)",
                     "signif_chg": pal["rci"]["signif_chg"]
                     or "aucune traversée de borne (niveau stable)"}
                    if pal["rci"] is not None
                    else "pas encore de re-test — la mesure lira le "
                         "changement à 8 semaines (jamais un verdict de "
                         "rémission)"),
            "seuils_rci_reels": "|Δ| ≥ 0,58 FIABLE · [0,41 ; 0,58[ "
                                "SUGGESTION · < 0,41 BRUIT (L7 verbatim, "
                                "SE_diff ≈ 0,356)",
        },
        "bloc_7_palier_pas": {
            "palier": pal["palier"],
            "banque_pas_reelle": {p: sorted(x for x in v if x is not None)
                                  for p, v in pas_tab.items()
                                  if any(x is not None for x in v)},
            "pas_en_crise": "aucun pas de couple — le VRAI pas_de retourne "
                            "None sur ORIENTATION (D-CRISE)",
            "choix_libre_reel": core_q5.PAS_LIBRE,
            "suivi_14_jours_sans_sanction": True,
            "retest": ("re-test RIO-15 à 8 semaines — " +
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
