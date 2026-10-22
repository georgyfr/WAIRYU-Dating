# -*- coding: utf-8 -*-
"""
WTC-EMO-Q3-R1 — VALIDATION DE LA COUCHE DE CORRECTION PHILOSOPHIQUE (RIO-08)
============================================================================
Exécute les stages de preuve sur les VRAIS moteurs (zéro réimplémentation) :

  Stage 0 — COMPACTATIONS PROUVÉES EXHAUSTIVEMENT :
            (a) faces héritées → rangs : les 13 sommes réelles du cœur par
                face (E-R1, E-R3) donnent les MÊMES sorties du VRAI
                forces_emo et le MÊME palier à rang égal — vérifié sur les
                13 valeurs × 2 faces ; convergence float ≡ entiers :
                niveau_face (VRAIS seuils 3,5/2,5/1,5) ≡ bandes entières
                4/7/10 — 26 + 26 vérifs ;
            (b) journal → voies : complete=False et None compacts (espions),
                n JAMAIS lu par forces_emo (espion 8 valeurs), frontières
                des voies journal (jL ≥ 4 · jU ≥ 4 · jM ≥ 4 · jM ≥ 3 ·
                jL ≥ 4 ∧ jM ≥ 3) vérifiées par batterie de bord 9/9 ;
            (c) les 4 statuts du VRAI statut_journal (NON_RENSEIGNÉ ·
                PARTIEL · ACTIF · SILENCIEUX N ≥ 5) résolus par appels
                directs — le statut SILENCIEUX existe dans le moteur, le
                simulateur ne l'échantillonne pas (n < 3) : prévalence =
                objet VALID-01, consigné ;
            (d) garde anti-fabrication : F-E3 jamais active si CAP ≠ AC —
                vérifié par le VRAI moteur sur les 4 caps ;
            (e) classe de co-régulation er1 (bas < 3,0 · PILE = 3,00
                [somme 9] · haut > 3,0) vérifiée sur les 13 sommes réelles ;
            (f) l'espace MESURÉ (cA, cB, cC, cap, d_exp = 5³ × 4 × 5 =
                2 500 états) est énuméré DIRECTEMENT et exhaustivement —
                aucune compaction nécessaire (réponses brutes, pas des
                sommes) — consigné.
  Stage 1 — ÉNUMÉRATION EXHAUSTIVE de l'espace des états distincts de la
            couche : 5³ échelle C × 4 caps × 5 demandes explicites × 4 rangs
            E-R1 × 4 rangs E-R3 × 14 états journal = 560 000 configurations
            (les rangs hérités couvrent les 13 valeurs réelles chacune —
            compactation prouvée au stage 0a). Toute la sortie de la couche
            (forces VRAIES, palier plancher, S1/S2, textes, fragment) est
            calculée par les fonctions réelles et vérifiée configuration par
            configuration. COR2 = double chemin (entiers purs) ≡ (VRAIS
            seuils du cœur) + junctions S1 ⇔ 🔴 / S2 ⇔ 🟠 + garde F-E3/CAP.
  Stage 2 — RE-SCORE BIT-EXACT des 475 profils archivés du rapport émo-q3-r1
            (H1 120 · H2 100 · H3 100 · H4 80 · SANS_PREUVE 40 · SURCHARGE
            20 · CAP_NON_AC 15), régénérés par le VRAI simulateur (seed 42)
            : C1a 40/40 SILENCIEUSE · C1b 20/20 deux retenues par densité ·
            C1c 87,5 % ACTIF · C2 475/475 moteur ≡ simulateur (0 désaccord)
            · C3a 15/15 · C3b 0 · cap_global {AC 161, PC 226, AD 37, PD 51}
            · indice 0,577 · observation géométrique H1 15,83 % (borne
            D-Q3-J 25-45 % — SOUS de 9,17 pts, consignée) — puis application
            de la couche aux 475.
  Stage 4 — COUPLAGE PAS : les 8 pas réels résolus via le VRAI
            selectionner_pas (cap et forces retenues MESURÉS par cette
            quête — 32 448 combinaisons avec héritages Q2/Q1 balayés) +
            suivi 14 j sans sanction 15/15 + re-test 8 semaines +
            co-régulation (vrai seuil 3,0, pile consigné) + couple (vrai
            configuration_devises, table 9 entrées classe er1 × zone Q2).
  COR8    — Reproductibilité : pipeline exécuté 2 fois, SHA-256 identiques.

Sorties : results/correction_criteres.json
"""

from __future__ import annotations

import hashlib
import itertools
import json
import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import wtc_emo_q3_correction as corr          # la couche (charge les vrais moteurs)
core_q1 = corr.core_q1
core_q2 = corr.core_q2
core_q3 = corr.core_q3
core_q4 = corr.core_q4
core_q5 = corr.core_q5

# Le VRAI simulateur émo-q3 R1 (seed 42, construit à l'import) :
sim_q3 = corr._charge("wtc_emo_q3_simulator",
                      corr._Q3 / "src" / "wtc_emo_q3_simulator.py")

RES = Path(__file__).resolve().parents[1] / "results"
SMOKE = os.environ.get("CORR_SMOKE") == "1"   # échantillon réduit (test rapide)
R_C = (1, 5) if SMOKE else range(1, 6)
R_DEXP = (1, 5) if SMOKE else range(1, 6)

BANDEAU_OK = corr.BANDEAU_DSIM

# Représentants réels des rangs (les 13 sommes du cœur / 3) :
RANG_REPS = {0: 4, 1: 6, 2: 9, 3: 12}         # s → m = 1,33 · 2,00 · 3,00 · 4,00

# États journal (14) : None · partiel · 12 complets (l 2 × u 2 × m 3) —
# n fixé ACTIF (le statut SILENCIEUX N ≥ 5 est prouvé au stage 0c) :
JOURNAL_ETATS = (
    ("NON_RENSEIGNÉ", None),
    ("PARTIEL", {"complete": False, "t": 0, "u": 0, "l": 0, "m": 0, "n": 0}),
    ("ACTIF", {"complete": True, "t": 0, "u": 0, "l": 0, "m": 0, "n": 0}),
    ("ACTIF", {"complete": True, "t": 0, "u": 0, "l": 0, "m": 3, "n": 0}),
    ("ACTIF", {"complete": True, "t": 0, "u": 0, "l": 0, "m": 4, "n": 0}),
    ("ACTIF", {"complete": True, "t": 0, "u": 0, "l": 4, "m": 0, "n": 0}),
    ("ACTIF", {"complete": True, "t": 0, "u": 0, "l": 4, "m": 3, "n": 0}),
    ("ACTIF", {"complete": True, "t": 0, "u": 0, "l": 4, "m": 4, "n": 0}),
    ("ACTIF", {"complete": True, "t": 0, "u": 4, "l": 0, "m": 0, "n": 0}),
    ("ACTIF", {"complete": True, "t": 0, "u": 4, "l": 0, "m": 3, "n": 0}),
    ("ACTIF", {"complete": True, "t": 0, "u": 4, "l": 0, "m": 4, "n": 0}),
    ("ACTIF", {"complete": True, "t": 0, "u": 4, "l": 4, "m": 0, "n": 0}),
    ("ACTIF", {"complete": True, "t": 0, "u": 4, "l": 4, "m": 3, "n": 0}),
    ("ACTIF", {"complete": True, "t": 0, "u": 4, "l": 4, "m": 4, "n": 0}),
)


def rang_de_somme(s: int) -> int:
    """Rang entier d'une face héritée depuis la somme (bandes 4/7/10)."""
    if s >= 11:
        return 3
    if s >= 8:
        return 2
    if s >= 5:
        return 1
    return 0


# ─────────────────────────────────────────────────────────────────────────────
# STAGE 0 — COMPACTATIONS PROUVÉES EXHAUSTIVEMENT
# ─────────────────────────────────────────────────────────────────────────────
def stage0() -> dict:
    res = {
        "rang_valeurs": 0, "rang_ecarts": 0,
        "convergence_niveaux": 0, "convergence_ecarts": 0,
        "journal_frontieres": 0, "journal_ecarts": 0,
        "espion_journal": 0, "espion_journal_ecarts": 0,
        "espion_n": 0, "espion_n_ecarts": 0,
        "statuts_resolus": 0, "statuts_ecarts": 0,
        "garde_caps": 0, "garde_violations": 0,
        "garde_voie_journal": 0,
        "classe_er1_valeurs": 0, "classe_er1_ecarts": 0,
    }

    # (a) rangs compacts : sorties VRAIES identiques à rang égal (2 faces)
    def sorties(er1, er3):
        f = core_q3.forces_emo(3, 3, 3, "AC", er1, er3,
                               {"complete": True, "t": 0, "u": 0, "l": 4,
                                "m": 4, "n": 0}, 4)
        p = corr.palier_plancher(er1, er3)
        return (tuple(f["forces"]), f["silencieuse"], f["nombre"],
                tuple(f["exclues"]), p["palier"], p["rang_plancher"])

    for face_i, face_nom in ((0, "E-R1"), (1, "E-R3")):
        base = sorties(2.0, 2.0)
        for s in range(3, 16):
            vals = [2.0, 2.0]
            vals[face_i] = s / 3.0
            rep = RANG_REPS[rang_de_somme(s)] / 3.0
            vals_rep = list(vals)
            vals_rep[face_i] = rep
            res["rang_valeurs"] += 1
            if sorties(*vals) != sorties(*vals_rep):
                res["rang_ecarts"] += 1
            # (a-bis) convergence float ≡ entiers :
            res["convergence_niveaux"] += 1
            nv = corr.niveau_face(s / 3.0)
            if nv != corr.NIVEAU_DE_RANG[rang_de_somme(s)]:
                res["convergence_ecarts"] += 1

    # (b) frontières des voies journal (batterie de bord via le VRAI moteur)
    def forces_journal(jl, ju, jm):
        j = {"complete": True, "t": 0, "u": ju, "l": jl, "m": jm, "n": 0}
        return tuple(core_q3.forces_emo(1, 1, 1, "PC", 4.0, 4.0, j, 1)["forces"])
    frontieres = [
        ("jL>=4", [(3, 0, 0), (4, 0, 0)]),
        ("jU>=4", [(0, 3, 0), (0, 4, 0)]),
        ("jU>=3(F-E6)", [(0, 2, 0), (0, 3, 0)]),
        ("jM>=4", [(0, 0, 3), (0, 0, 4)]),
        ("jM>=3(F-E5 voie C)", [(4, 0, 2), (4, 0, 3)]),
        ("jL>=4 et jM>=3", [(4, 0, 3), (3, 0, 3)]),
        ("cA>=2", None), ("cB>=3", None), ("cC>=3", None), ("dexp>=3", None),
    ]
    for nom, paire in frontieres[:6]:
        bas, haut = paire
        f_bas = forces_journal(*bas)
        f_haut = forces_journal(*haut)
        res["journal_frontieres"] += 1
        if f_bas == f_haut:
            res["journal_ecarts"] += 1   # la frontière ne fait pas basculer
    # Échelle C / d_exp (frontières entières directes) :
    for nom, args in (("cA", (1, 2)), ("cB", (2, 3)), ("cC", (2, 3)),
                      ("dexp", (2, 3))):
        if nom == "cA":
            f_bas = tuple(core_q3.forces_emo(args[0], 1, 1, "PC", 4.0, 4.0,
                                             None, 1)["forces"])
            f_haut = tuple(core_q3.forces_emo(args[1], 1, 1, "PC", 4.0, 4.0,
                                              None, 1)["forces"])
        elif nom == "cB":
            f_bas = tuple(core_q3.forces_emo(1, args[0], 1, "PC", 4.0, 4.0,
                                             None, 1)["forces"])
            f_haut = tuple(core_q3.forces_emo(1, args[1], 1, "PC", 4.0, 4.0,
                                              None, 1)["forces"])
        elif nom == "cC":
            f_bas = tuple(core_q3.forces_emo(1, 1, args[0], "PC", 4.0, 4.0,
                                             None, 1)["forces"])
            f_haut = tuple(core_q3.forces_emo(1, 1, args[1], "PC", 4.0, 4.0,
                                              None, 1)["forces"])
        else:
            f_bas = tuple(core_q3.forces_emo(1, 1, 1, "PC", 4.0, 4.0, None,
                                             args[0])["forces"])
            f_haut = tuple(core_q3.forces_emo(1, 1, 1, "PC", 4.0, 4.0, None,
                                              args[1])["forces"])
        res["journal_frontieres"] += 1
        if f_bas == f_haut:
            res["journal_ecarts"] += 1

    # (b-bis) espion journal : complete=False et None compacts
    f_partiel_ref = core_q3.forces_emo(2, 2, 2, "AC", 2.0, 2.0,
                                       {"complete": False, "t": 7, "u": 7,
                                        "l": 7, "m": 7, "n": 7}, 4)
    for j in ({"complete": False, "t": 0, "u": 0, "l": 0, "m": 0, "n": 0},
              None):
        res["espion_journal"] += 1
        if core_q3.forces_emo(2, 2, 2, "AC", 2.0, 2.0, j, 4) != f_partiel_ref:
            res["espion_journal_ecarts"] += 1
    # (b-ter) espion n : JAMAIS lu par forces_emo (8 valeurs)
    f_n_ref = core_q3.forces_emo(2, 2, 2, "AC", 2.0, 2.0,
                                 {"complete": True, "t": 0, "u": 0, "l": 4,
                                  "m": 4, "n": 0}, 4)
    for n in range(8):
        j = {"complete": True, "t": 0, "u": 0, "l": 4, "m": 4, "n": n}
        res["espion_n"] += 1
        if core_q3.forces_emo(2, 2, 2, "AC", 2.0, 2.0, j, 4) != f_n_ref:
            res["espion_n_ecarts"] += 1

    # (c) les 4 statuts du VRAI statut_journal (appels directs)
    statuts = [
        (None, "NON_RENSEIGNÉ"),
        ({"complete": False, "n": 0}, "PARTIEL"),
        ({"complete": True, "n": 0}, "ACTIF"),
        ({"complete": True, "n": 5}, "SILENCIEUX"),
        ({"complete": True, "n": 6}, "SILENCIEUX"),
        ({"complete": True, "n": 7}, "SILENCIEUX"),
    ]
    for j, attendu in statuts:
        res["statuts_resolus"] += 1
        if core_q3.statut_journal(j) != attendu:
            res["statuts_ecarts"] += 1

    # (d) garde anti-fabrication F-E3/CAP — sémantique RÉELLE du moteur :
    # la voie CAP (cap == "AC") ET la voie JOURNAL (m ≥ 4) activent F-E3 ;
    # la garde coherence_cap_forces (outil du critère C3a, trap CAP_NON_AC
    # conçu avec journal M < 4) retourne False si F-E3 est retenue avec
    # CAP ≠ AC — y compris par la voie journal : OBSERVATION CONSIGNÉE
    # D-Q3-G (la docstring « JAMAIS » est plus forte que le code, qui
    # mesure la voie CAP ; les célébrations consignées au journal sont des
    # preuves réelles — zéro retouche au moteur, prévalence = VALID-01).
    for cap in corr.CAP_TYPES:
        f_sans_j = core_q3.forces_emo(1, 1, 1, cap, 4.0, 4.0,
                                      {"complete": True, "t": 0, "u": 0,
                                       "l": 0, "m": 0, "n": 0}, 1)
        res["garde_caps"] += 1
        # voie CAP seule : F-E3 active ssi cap == "AC" (jamais sinon) :
        if ("F-E3" in f_sans_j["forces"]) != (cap == "AC"):
            res["garde_violations"] += 1
        # trap-faithful (C3a) : la garde est cohérente sur son cas d'usage
        if cap != "AC" and not core_q3.coherence_cap_forces(
                cap, f_sans_j["forces"]):
            res["garde_violations"] += 1
        # voie JOURNAL (m ≥ 4) : le vrai moteur active F-E3 même avec
        # CAP ≠ AC (les célébrations consignées sont des preuves) —
        # documenté, compté à part :
        f_avec_j = core_q3.forces_emo(1, 1, 1, cap, 4.0, 4.0,
                                      {"complete": True, "t": 0, "u": 0,
                                       "l": 0, "m": 4, "n": 0}, 1)
        if cap != "AC" and "F-E3" in f_avec_j["forces"]:
            res["garde_voie_journal"] += 1
        if cap != "AC" and core_q3.coherence_cap_forces(
                cap, f_avec_j["forces"]):
            res["garde_violations"] += 1   # la garde DOIT signaler ici

    # (e) classe de co-régulation er1 (13 sommes réelles — float exact)
    for s in range(3, 16):
        res["classe_er1_valeurs"] += 1
        attendu = ("bas" if s < 9 else "pile" if s == 9 else "haut")
        if corr.classe_er1(s / 3.0) != attendu:
            res["classe_er1_ecarts"] += 1
    return res


# ─────────────────────────────────────────────────────────────────────────────
# STAGE 1 — ÉNUMÉRATION EXHAUSTIVE (5³ × 4 × 5 × 4 × 4 × 14 = 560 000)
# ─────────────────────────────────────────────────────────────────────────────
def stage1(tables: dict) -> dict:
    tables_pas, tables_couple = tables["pas"], tables["couple"]
    stats = {
        "configs": 0, "fragments_distincts": 0, "fragment_incomplets": 0,
        "cor2_ecarts": 0, "junction_s1s2_ecarts": 0,
        "garde_violations": 0,
        "paliers": {"🟢": 0, "🟠": 0, "🔴": 0},
        "S1": 0, "S2": 0,
        "silencieuses": 0, "visibles": 0,
        "deux_forces": 0, "exclues_non_traces": 0,
        "forces_hors_banque": 0,
        "fe3_voie_journal": 0,
        "md5_texts_count": 0,
        "mots_interdits_max": 0, "dsim_manquants": 0,
        "templates_cites_ecarts": 0,
        "pas_labels_hors_banque": 0,
        "pile_seuil_niveaux": 0, "dist_min_niveaux": 9.0,
    }
    cache_texte = {}
    cache_frag = {}

    for cA, cB, cC in itertools.product(R_C, repeat=3):
        for cap in corr.CAP_TYPES:
            cap_bin = 1 if cap == "AC" else 0
            for d_exp in R_DEXP:
                for r1, s1_rep in RANG_REPS.items():
                    for r3, s3_rep in RANG_REPS.items():
                        er1_rep, er3_rep = s1_rep / 3.0, s3_rep / 3.0
                        for j_i, (statut_j, journal) in enumerate(JOURNAL_ETATS):
                            stats["configs"] += 1
                            # VRAI moteur :
                            fr = core_q3.forces_emo(cA, cB, cC, cap, er1_rep,
                                                    er3_rep, journal, d_exp)
                            forces_t = tuple(fr["forces"])
                            # COR2 — double chemin (entiers ≡ VRAIS seuils) :
                            pal = corr.palier_plancher(er1_rep, er3_rep)
                            pal_i = corr.palier_independant(s1_rep, s3_rep)
                            if (pal["palier"] != pal_i["palier"]
                                    or pal["S1"] != pal_i["S1"]
                                    or pal["S2"] != pal_i["S2"]):
                                stats["cor2_ecarts"] += 1
                            if pal["S1"] != (pal["palier"] == "🔴") \
                                    or pal["S2"] != (pal["palier"] == "🟠"):
                                stats["junction_s1s2_ecarts"] += 1
                            # R5 — garde F-E3/CAP : toute activation avec
                            # CAP ≠ AC doit être expliquée par la voie
                            # JOURNAL (trace réelle du moteur) — cas
                            # documenté D-Q3-G, compté à part :
                            if "F-E3" in fr["forces"] and cap != "AC":
                                if fr["trace"]["F-E3"][1]:
                                    stats["fe3_voie_journal"] += 1
                                else:
                                    stats["garde_violations"] += 1
                            stats["paliers"][pal["palier"]] += 1
                            if pal["S1"]:
                                stats["S1"] += 1
                            if pal["S2"]:
                                stats["S2"] += 1
                            if fr["silencieuse"]:
                                stats["silencieuses"] += 1
                            else:
                                stats["visibles"] += 1
                            if len(fr["forces"]) == 2:
                                stats["deux_forces"] += 1
                            # R6 — exclues toujours tracées (existantes) :
                            if fr["exclues"]:
                                if not set(fr["exclues"]) <= set(corr.FORCES):
                                    stats["exclues_non_traces"] += 1
                            for f in fr["forces"]:
                                if f not in corr.FORCES:
                                    stats["forces_hors_banque"] += 1
                            # Bornes pile (1,5/2,5/3,5 hors grille — COR3) :
                            for s in (s1_rep, s3_rep):
                                sc = s / 3.0
                                for th in (corr.SEUIL_BAS_DISCRETE,
                                           core_q1.SEUIL_PACIFIQUE_E_R1,
                                           core_q1.SEUIL_DOMINANCE):
                                    d = abs(sc - th)
                                    if d < stats["dist_min_niveaux"]:
                                        stats["dist_min_niveaux"] = d
                                    if d == 0.0:
                                        stats["pile_seuil_niveaux"] += 1
                            # Texte + fragment (caches) :
                            cle = (cA, cB, cC, cap, d_exp, r1, r3, j_i)
                            bloc = cache_texte.get(cle)
                            if bloc is None:
                                b = corr.bloc_ecran(fr, cap, statut_j, pal)
                                tt = b["texte"]
                                attendu_cites = (1 if fr["silencieuse"]
                                                 else len(fr["forces"]))
                                bloc = (b["md5"], b["nb_mots_interdits"],
                                        BANDEAU_OK in tt,
                                        b["nb_templates_cites"],
                                        attendu_cites)
                                cache_texte[cle] = bloc
                            md5_t, nb_mots, dsim_ok, nb_cites, att_cites = bloc
                            if nb_mots > stats["mots_interdits_max"]:
                                stats["mots_interdits_max"] = nb_mots
                            if not dsim_ok:
                                stats["dsim_manquants"] += 1
                            # R5 — templates cités ≡ forces retenues
                            # (SILENCIEUSE → 1 citation, sinon len(forces)) :
                            if nb_cites != att_cites:
                                stats["templates_cites_ecarts"] += 1
                            frag = cache_frag.get(cle)
                            if frag is None:
                                f_ = corr.bilan_fragment(
                                    fr, cap, statut_j, pal, cA, cB, cC,
                                    d_exp, tables_pas, tables_couple,
                                    cap_bin)
                                frag = (f_["_complet"],
                                        tuple(f_["bloc_7_palier_pas"]
                                              ["pas_labels"]))
                                cache_frag[cle] = frag
                                stats["fragments_distincts"] += 1
                            if not frag[0]:
                                stats["fragment_incomplets"] += 1
                            for lab in frag[1]:
                                if lab not in core_q5.PAS_LABELS.values():
                                    stats["pas_labels_hors_banque"] += 1

    stats["md5_texts_count"] = len(cache_texte)
    n_c = len(list(R_C))
    stats["configs_attendues"] = (n_c ** 3 * len(corr.CAP_TYPES)
                                  * len(list(R_DEXP)) * len(RANG_REPS) ** 2
                                  * len(JOURNAL_ETATS))
    return stats


# ─────────────────────────────────────────────────────────────────────────────
# STAGE 2 — RE-SCORE BIT-EXACT DES 475 PROFILS ARCHIVÉS (VRAI simulateur 42)
# ─────────────────────────────────────────────────────────────────────────────
ARCHIVE_N_TOTAL = 475
ARCHIVE_C1A = {"attendu": 40, "obtenu": 40}
ARCHIVE_C1B = {"attendu": 20, "obtenu": 20}
ARCHIVE_C1C = {"attendu_pct": 50.0, "obtenu_pct": 87.5, "n_actif": 70,
               "n_total": 80}
ARCHIVE_C2 = {"attendu_pct": 99.0, "obtenu_pct": 100.0, "n_match": 475,
              "n_desaccords": 0}
ARCHIVE_C3A = {"attendu": 15, "obtenu": 15, "all_violations": 0}
ARCHIVE_C3B = {"attendu": 0, "obtenu": 0}
ARCHIVE_CAP_GLOBAL = {"AC": 161, "PC": 226, "AD": 37, "PD": 51}
ARCHIVE_INDICE = 0.577
ARCHIVE_H1_SILENCIEUX_PCT = 15.83
ATTENDU_RESUME = {"H1_silencieux": 120, "H2_cap_ac": 100,
                  "H3_ecoute_tient": 100, "H4_journal_actif": 80,
                  "SANS_PREUVE": 40, "SURCHARGE": 20, "CAP_NON_AC": 15}


def stage2(tables: dict) -> dict:
    tables_pas = tables["pas"]
    res = {
        "profils": 0, "comparaisons": 0, "ecarts": [],
        "c2_match": 0, "c2_desaccords": 0,
        "c1a_sans_preuve_silencieuse": 0, "c1b_surcharge_2_retenues": 0,
        "c1c_h4_actif": 0, "c1c_h4_total": 0,
        "c3a_cap_non_ac_ok": 0, "c3a_violations": 0,
        "c3b_inventions": 0,
        "cap_global": {"AC": 0, "PC": 0, "AD": 0, "PD": 0},
        "indice_capitalisation": 0.0,
        "h1_silencieuses": 0, "h1_total": 0,
        "silencieuses_reelles": 0,
        "S1_archives": 0, "S2_archives": 0,
        "fragments_archives": 0, "fragments_incomplets": 0,
        "dsim_archives": 0, "mots_interdits_max": 0,
        "templates_cites_ecarts": 0, "garde_violations": 0,
        "garde_voie_journal": 0,
    }
    profils = []
    for nom_groupe in ("H1_silencieux", "H2_cap_ac", "H3_ecoute_tient",
                       "H4_journal_actif"):
        for i, p in enumerate(sim_q3.GROUPES[nom_groupe]):
            p["id"] = f"{nom_groupe}_{i}"
            p["groupe"] = nom_groupe
            profils.append(p)
    for nom_trap in ("SANS_PREUVE", "SURCHARGE", "CAP_NON_AC"):
        for i, p in enumerate(sim_q3.TRAPS[nom_trap]):
            p["id"] = f"{nom_trap}_{i}"
            p["groupe"] = nom_trap
            profils.append(p)
    res["profils"] = len(profils)
    res["comparaisons"] += 1
    if res["profils"] != ARCHIVE_N_TOTAL:
        res["ecarts"].append({"champ": "n_total", "calcule": res["profils"],
                              "archive": ARCHIVE_N_TOTAL})
    for p in profils:
        gid = p["groupe"]
        # VRAI moteur sur les champs réels du profil :
        fr = core_q3.forces_emo(p["cA"], p["cB"], p["cC"], p["cap"],
                                p["er1_m"], p["er3_m"], p["journal"],
                                p["d_exp"])
        statut_j = core_q3.statut_journal(p["journal"])
        res["comparaisons"] += 1
        # C2 — moteur ≡ simulateur (ré-implémentation indépendante archivée)
        if sim_q3.forces_vraies(p) == fr["forces"]:
            res["c2_match"] += 1
        else:
            res["c2_desaccords"] += 1
            res["ecarts"].append({"id": p["id"], "champ": "c2_forces",
                                  "calcule": str(fr["forces"]),
                                  "archive": str(sim_q3.forces_vraies(p))})
        # C1a — SANS_PREUVE → SILENCIEUSE obligatoire (éliminatoire)
        if gid == "SANS_PREUVE":
            if fr["silencieuse"] and len(fr["forces"]) == 0:
                res["c1a_sans_preuve_silencieuse"] += 1
        # C1b — SURCHARGE → exactement 2 retenues par densité
        if gid == "SURCHARGE":
            if len(fr["forces"]) == 2 and fr["exclues"]:
                res["c1b_surcharge_2_retenues"] += 1
        # C1c — H4 journal ACTIF
        if gid == "H4_journal_actif":
            res["c1c_h4_total"] += 1
            if statut_j == "ACTIF":
                res["c1c_h4_actif"] += 1
        # C3a — CAP_NON_AC : F-E3 jamais (éliminatoire)
        if gid == "CAP_NON_AC":
            if p["cap"] != "AC" and "F-E3" not in fr["forces"] \
                    and core_q3.coherence_cap_forces(p["cap"], fr["forces"]):
                res["c3a_cap_non_ac_ok"] += 1
            else:
                res["c3a_violations"] += 1
        # C3b — anti-invention : forces ⊆ banque fermée
        if not set(fr["forces"]) <= set(corr.FORCES):
            res["c3b_inventions"] += 1
        # cap_global + indice
        res["cap_global"][p["cap"]] += 1
        if gid == "H1_silencieux":
            res["h1_total"] += 1
            if fr["silencieuse"]:
                res["h1_silencieuses"] += 1
        if fr["silencieuse"]:
            res["silencieuses_reelles"] += 1
        # COUCHE appliquée :
        pal = corr.palier_plancher(p["er1_m"], p["er3_m"])
        s1 = int(round(p["er1_m"] * 3))
        s3 = int(round(p["er3_m"] * 3))
        pal_i = corr.palier_independant(s1, s3)
        # NOTE : les er des profils sont continus (2 déc., D-PARAM σ 0,60) —
        # le chemin float (VRAIS seuils) est celui appliqué ; le chemin
        # entier est prouvé sur la grille au stage 1. Junction only :
        res["comparaisons"] += 1
        if pal["S1"] != (pal["palier"] == "🔴") \
                or pal["S2"] != (pal["palier"] == "🟠"):
            res["ecarts"].append({"id": p["id"], "champ": "junction_s1s2"})
        bloc = corr.bloc_ecran(fr, p["cap"], statut_j, pal)
        res["comparaisons"] += 3
        if BANDEAU_OK in bloc["texte"]:
            res["dsim_archives"] += 1
        res["mots_interdits_max"] = max(res["mots_interdits_max"],
                                        bloc["nb_mots_interdits"])
        attendu_cites = 1 if fr["silencieuse"] else len(fr["forces"])
        if bloc["nb_templates_cites"] != attendu_cites:
            res["templates_cites_ecarts"] += 1
        frag = corr.bilan_fragment(fr, p["cap"], statut_j, pal, p["cA"],
                                   p["cB"], p["cC"], p["d_exp"], tables_pas,
                                   tables["couple"],
                                   1 if p["cap"] == "AC" else 0)
        res["comparaisons"] += 1
        if frag["_complet"]:
            res["fragments_archives"] += 1
        else:
            res["fragments_incomplets"] += 1
        if not core_q3.coherence_cap_forces(p["cap"], fr["forces"]):
            # cas documenté D-Q3-G : F-E3 retenue avec CAP ≠ AC — doit être
            # expliquée par la voie JOURNAL (trace réelle du moteur) :
            if not ("F-E3" in fr["forces"] and fr["trace"]["F-E3"][1]):
                res["garde_violations"] += 1
            else:
                res["garde_voie_journal"] += 1
        if pal["S1"]:
            res["S1_archives"] += 1
        if pal["S2"]:
            res["S2_archives"] += 1
    # cap_global ≡ archivé (4 types) :
    res["comparaisons"] += 4
    if res["cap_global"] != ARCHIVE_CAP_GLOBAL:
        res["ecarts"].append({"champ": "cap_global",
                              "calcule": str(res["cap_global"]),
                              "archive": str(ARCHIVE_CAP_GLOBAL)})
    # indice de capitalisation ≡ archivé (métrique Section E — JAMAIS un
    # verdict individuel, jamais affichée à l'écran) :
    res["indice_capitalisation"] = core_q3.indice_capitalisation(
        res["cap_global"])
    res["comparaisons"] += 1
    if res["indice_capitalisation"] != ARCHIVE_INDICE:
        res["ecarts"].append({"champ": "indice_capitalisation",
                              "calcule": res["indice_capitalisation"],
                              "archive": ARCHIVE_INDICE})
    # observation géométrique H1 (D-Q3-J) :
    res["h1_silencieux_pct"] = round(res["h1_silencieuses"]
                                     / res["h1_total"] * 100, 2) \
        if res["h1_total"] else 0.0
    res["comparaisons"] += 1
    if res["h1_silencieux_pct"] != ARCHIVE_H1_SILENCIEUX_PCT:
        res["ecarts"].append({"champ": "h1_silencieux_pct",
                              "calcule": res["h1_silencieux_pct"],
                              "archive": ARCHIVE_H1_SILENCIEUX_PCT})
    return res


# ─────────────────────────────────────────────────────────────────────────────
# STAGE 4 — COUPLAGE PAS (cap + forces MESURÉS) + COUPLE + SUIVI
# ─────────────────────────────────────────────────────────────────────────────
def stage4(tables: dict) -> dict:
    tables_pas, tables_couple = tables["pas"], tables["couple"]
    # 1. Les 8 pas réels, résolus par le VRAI selectionner_pas :
    pas_vus = {}
    for cle, tab in tables_pas.items():
        for pas, source in tab.items():
            pas_vus.setdefault(pas, source)
    # Invariants : INV/RC décidés par les héritages Q2 (RIO-07), CAP par le
    # cap MESURÉ (PC), fallback ER2 :
    inv_mesure = 0
    for cle in ((0, False, False, False), (1, False, False, False)):
        tab = tables_pas[cle]
        if tab.get("CAP") == "cap (Q1/Q3 émotionnel)":
            inv_mesure += 1     # cap PC mesuré → CAP (quand Q2 silencieux)
        if tab.get("ER2") == "fallback (aucun héritage actif)":
            inv_mesure += 1     # AC sans forces ni héritages → fallback
    tab_pc = tables_pas[(0, False, False, False)]
    tab_ac = tables_pas[(1, False, False, False)]
    # 2. Suivi 14 jours sans sanction :
    suivi_ok = 0
    categories = set()
    for jours in range(15):
        s = core_q5.suivre_14_jours(jours)
        categories.add(s["categorie"])
        if s["sanction"] is None:
            suivi_ok += 1
    # 3. Re-test 8 semaines :
    rt = core_q5.programmer_re_test("2026-01-01", semaines=8)
    retest_ok = (rt["semaines"] == 8 and rt["force"] is False
                 and len(rt["message"]) > 20)
    # 4. Co-régulation (vrai seuil 3,0 — pile consigné) :
    co_bas = core_q4.co_regulation(8 / 3.0, 3.0)["paire_explosive"]
    co_pile = core_q4.co_regulation(9 / 3.0, 3.0)["paire_explosive"]
    co_haut = core_q4.co_regulation(10 / 3.0, 3.0)["paire_explosive"]
    co_ok = (co_bas is False) and (co_pile is True) and (co_haut is True)
    # 5. Tables couple — 9 entrées (classe er1 × zone Q2) — invariants
    # structurels PAR CLASSE : la paire explosive (er1 ≥ 3,0) préempte la
    # boucle MIXTE (FEU CROISÉ d'abord) — les configurations MIXTE ne sont
    # atteignables que pour un er1 hérité non-explosif (classe « bas ») :
    # junction à trois sens CONSIGNÉE (D-Q3-G bis).
    hors_nomenclature = 0
    poursuite_incoherent = 0
    feu_croise_incoherent = 0
    for (classe, zone_d), t in tables_couple.items():
        cfgs = t["configurations_atteignables"]
        for cfg in cfgs:
            if cfg not in core_q4.CONFIG_LABELS:
                hors_nomenclature += 1
        if classe == "bas":
            if "FEU CROISÉ" in cfgs:
                feu_croise_incoherent += 1   # paire non explosive → absent
            if (zone_d != "ABSENT") != ("MIXTE POURSUITE" in cfgs):
                poursuite_incoherent += 1
            if (zone_d == "ABSENT") != ("MIXTE RETRAIT" in cfgs):
                poursuite_incoherent += 1
        else:
            if "FEU CROISÉ" not in cfgs:
                feu_croise_incoherent += 1   # paire explosive + boucle → présent
            if "MIXTE POURSUITE" in cfgs or "MIXTE RETRAIT" in cfgs:
                poursuite_incoherent += 1    # préemption FEU CROISÉ
    return {
        "pas_resolus": len(pas_vus),
        "pas_table": pas_vus,
        "pas_attendus": len(core_q5.PAS_ORDER),
        "invariants_mesures": inv_mesure,
        "invariants_attendus": 2,
        "cap_pc_donne_CAP": tab_pc.get("CAP") == "cap (Q1/Q3 émotionnel)",
        "cap_ac_sans_rien_donne_fallback": tab_ac.get("ER2")
            == "fallback (aucun héritage actif)",
        "suivi_15_sans_sanction": suivi_ok,
        "suivi_categories": sorted(categories),
        "retest_8_semaines": retest_ok,
        "coregulation_inclusive_pile": co_ok,
        "couple_hors_nomenclature": hors_nomenclature,
        "couple_poursuite_incoherent": poursuite_incoherent,
        "couple_feu_croise_incoherent": feu_croise_incoherent,
        "couple_configs_par_entree": {f"{c}/{z}": t["nb_configurations"]
                                      for (c, z), t in tables_couple.items()},
    }


# ─────────────────────────────────────────────────────────────────────────────
# PIPELINE COMPLET (exécuté 2 fois pour COR8)
# ─────────────────────────────────────────────────────────────────────────────
def _construit_tables() -> dict:
    print("    tables de junction (VRAIS moteurs) …", flush=True)
    pas = corr._tables_pas()            # 16 × 2 028 = 32 448 selectionner_pas
    couple = corr._tables_couple()      # 9 entrées × configurations_devises
    return {"pas": pas, "couple": couple}


def pipeline() -> dict:
    print("  stage 0 — compactations + frontières …", flush=True)
    s0 = stage0()
    tables = _construit_tables()
    print("  stage 1 — énumération exhaustive …", flush=True)
    s1 = stage1(tables)
    print(f"    {s1['configs']} configurations · textes distincts "
          f"{s1['md5_texts_count']} · fragments distincts "
          f"{s1['fragments_distincts']}", flush=True)
    print("  stage 2 — re-score bit-exact des 475 …", flush=True)
    s2 = stage2(tables)
    print(f"    {s2['profils']} profils · {s2['comparaisons']} comparaisons · "
          f"écarts {len(s2['ecarts'])}", flush=True)
    print("  stage 4 — couplage pas (cap + forces MESURÉS) + couple …",
          flush=True)
    s4 = stage4(tables)
    print(f"    {s4['pas_resolus']}/{s4['pas_attendus']} pas · "
          f"invariants {s4['invariants_mesures']}"
          f"/{s4['invariants_attendus']}", flush=True)
    return {"stage0": s0, "stage1": s1, "stage2": s2, "stage4": s4,
            "standings": {
                "mots_interdits_standings": max(
                    [sum(1 for m in corr.MOTS_INTERDITS if m in t.lower())
                     for t in (corr.BANDEAU_DSIM, corr.PHRASE_ORIENTATION,
                               corr.NOTE_PLANCHER, corr.NOTE_JOURNAL,
                               corr.clause_aide_standing(),
                               *corr._EXERCICE_FORCE.values(),
                               corr._EXERCICE_SILENCIEUSE,
                               *core_q3.TEMPLATES.values(),
                               *core_q2.TEMPLATES_INVALIDATION_DONNEE.values(),
                               *core_q2.TEMPLATES_INVALIDATION_RECUE.values(),
                               *core_q2.TEMPLATES_REPROCHE_CODE.values(),
                               *core_q4.TEMPLATES_DEVISES.values(),
                               *core_q4.TEMPLATES_CONFIG.values(),
                               *core_q5.PAS_LABELS.values(),
                               *core_q5.TEMPLATES_PAS.values(),
                               *core_q5.TEMPLATES_SUIVI.values(),
                               *core_q5.TEMPLATES_RAPPELS.values())]),
                "orientation_canon_dans_phrase":
                    "pas un échec" in corr.PHRASE_ORIENTATION,
            }}


def main() -> int:
    print("Exécution 1/2 …", flush=True)
    r1 = pipeline()
    print("Exécution 2/2 …", flush=True)
    r2 = pipeline()

    def canonique(d) -> bytes:
        return json.dumps(d, sort_keys=True, ensure_ascii=False,
                          default=list).encode("utf-8")

    sha1 = hashlib.sha256(canonique(r1)).hexdigest()
    sha2 = hashlib.sha256(canonique(r2)).hexdigest()
    cor8 = sha1 == sha2

    s0, s1, s2, s4 = r1["stage0"], r1["stage1"], r1["stage2"], r1["stage4"]
    n = s1["configs"]

    criteres = {
        "COR0_compactations": {
            "definition": "compactations PROUVÉES exhaustivement avant énumération : "
                          "faces héritées → rangs (13 valeurs réelles × 2 faces — mêmes "
                          "sorties du VRAI forces_emo et même palier à rang égal) · "
                          "convergence float ≡ entiers (26) · frontières des voies "
                          "(journal 6 + échelle C/d_exp 4) · espions journal (complete/"
                          "None compacts) et n jamais lu (8) · 4 statuts du VRAI "
                          "statut_journal résolus par appels directs (SILENCIEUX N ≥ 5 — "
                          "prévalence = VALID-01, consigné) · garde F-E3/CAP sur les 4 "
                          "caps · classe er1 exacte sur les 13 sommes · l'espace mesuré "
                          "(5³ × 4 × 5 = 2 500) énuméré DIRECTEMENT (réponses brutes)",
            "observe": f"rang {s0['rang_valeurs']} → écart {s0['rang_ecarts']} · "
                       f"convergence {s0['convergence_niveaux']} → écart "
                       f"{s0['convergence_ecarts']} · frontières "
                       f"{s0['journal_frontieres']} → écart {s0['journal_ecarts']} · "
                       f"espion journal {s0['espion_journal']} → écart "
                       f"{s0['espion_journal_ecarts']} · espion n {s0['espion_n']} → "
                       f"écart {s0['espion_n_ecarts']} · statuts {s0['statuts_resolus']} "
                       f"→ écart {s0['statuts_ecarts']} · garde {s0['garde_caps']} → "
                       f"violations {s0['garde_violations']} · classe er1 "
                       f"{s0['classe_er1_valeurs']} → écart {s0['classe_er1_ecarts']}",
            "pass": (s0["rang_ecarts"] == 0
                     and s0["convergence_ecarts"] == 0
                     and s0["journal_ecarts"] == 0
                     and s0["espion_journal_ecarts"] == 0
                     and s0["espion_n_ecarts"] == 0
                     and s0["statuts_ecarts"] == 0
                     and s0["garde_violations"] == 0
                     and s0["classe_er1_ecarts"] == 0)},
        "COR1_fragment_complet": {
            "definition": f"{n}/{n} configurations → fragment L8 7 blocs, 0 champ vide "
                          "(aucun gate sur cet instrument — pas de suspension inventée, "
                          "R4) + 475/475 profils archivés",
            "observe": f"{s1['fragments_distincts']}/{s1['fragments_distincts']} états "
                       f"distincts · incomplets {s1['fragment_incomplets']} · archivés "
                       f"{s2['fragments_archives']}/{s2['profils']} · incomplets "
                       f"{s2['fragments_incomplets']}",
            "pass": (s1["fragment_incomplets"] == 0
                     and s2["fragments_incomplets"] == 0
                     and s2["fragments_archives"] == s2["profils"] == 475)},
        "COR2_derivation_palier": {
            "definition": "double chemin : entier pur (bandes 4/7/10) ≡ VRAIS seuils du "
                          "cœur (3,5/2,5/1,5 — imports réels émo-q1) — palier plancher + "
                          "S1 + S2 ; junctions S1 ⇔ 🔴, S2 ⇔ 🟠 exactement ; note : les er "
                          "des profils sont continus (D-PARAM σ 0,60) — le chemin float "
                          "(VRAIS seuils) est celui appliqué aux profils, le chemin "
                          "entier est prouvé sur la grille",
            "observe": f"{n} configs · écart double chemin {s1['cor2_ecarts']} · "
                       f"écart junction {s1['junction_s1s2_ecarts']} · 475 profils : "
                       f"junction conformes (0 écart archivé)",
            "pass": (s1["cor2_ecarts"] == 0
                     and s1["junction_s1s2_ecarts"] == 0
                     and len(s2["ecarts"]) == 0)},
        "COR3_seuils_aide": {
            "definition": "S1 = plancher 🔴 (une face héritée ≥ 3,5, VRAI SEUIL_DOMINANCE) ; "
                          "S2 = plancher 🟠 ou cœur SILENCIEUSE (re-test 8 semaines) ; "
                          "PLANCHER PARTIEL consigné (E-R2 absente du moteur — borne "
                          "basse, monotonie du max) ; 0 borne pile (1,5/2,5/3,5 hors "
                          "grille s/3, dist min 1/6) ; co-régulation 3,0 PILE atteignable "
                          "(somme 9 — inclusive, consignée)",
            "observe": f"S1 {s1['S1']}/{n} · S2 {s1['S2']}/{n} · plancher partiel "
                       f"consigné · pile seuils {s1['pile_seuil_niveaux']} · dist min "
                       f"{round(s1['dist_min_niveaux'], 4)} · co-régulation pile "
                       f"{s4['coregulation_inclusive_pile']}",
            "pass": (s1["junction_s1s2_ecarts"] == 0
                     and s1["pile_seuil_niveaux"] == 0
                     and s4["coregulation_inclusive_pile"])},
        "COR4_vocabulaire_ecran": {
            "definition": "0 mot interdit (canon Partie 9) sur tous les textes générés + "
                          "templates réels du moteur (7) + moteurs de la chaîne "
                          "(q2/q4/q5) + exercices et standings de la couche, D-SIM 100 %",
            "observe": f"max mots interdits par texte = {s1['mots_interdits_max']} ; "
                       f"standing = {r1['standings']['mots_interdits_standings']} ; "
                       f"textes distincts = {s1['md5_texts_count']} ; D-SIM manquants "
                       f"{s1['dsim_manquants']} ; archivés D-SIM {s2['dsim_archives']}/475 "
                       f"· max archivés {s2['mots_interdits_max']}",
            "pass": (s1["mots_interdits_max"] == 0
                     and r1["standings"]["mots_interdits_standings"] == 0
                     and s1["dsim_manquants"] == 0
                     and s2["dsim_archives"] == 475
                     and s2["mots_interdits_max"] == 0)},
        "COR5_anti_fabrication": {
            "definition": "le positif n'est JAMAIS généré : forces affichées ≡ forces "
                          "retenues du VRAI forces_emo (SILENCIEUSE ≡ 0 force — statut "
                          "du vrai moteur) ; templates cités ≡ retenues (exclues de "
                          "densité jamais affichées, toujours tracées) ; F-E3 jamais "
                          "retenue avec CAP ≠ AC sauf par la voie JOURNAL du vrai moteur "
                          "(célébrations consignées = preuves réelles — observation "
                          "D-Q3-G consignée : la docstring de la garde dépasse son code, "
                          "zéro retouche, prévalence = VALID-01) ; forces ⊆ banque fermée",
            "observe": f"templates ≠ retenues : {s1['templates_cites_ecarts']} · "
                       f"exclues non tracées {s1['exclues_non_traces']} · forces hors "
                       f"banque {s1['forces_hors_banque']} · garde inexpliquée "
                       f"{s1['garde_violations']} (énum) + {s2['garde_violations']} "
                       f"(archivés) · F-E3 voie journal documentée {s1['fe3_voie_journal']} "
                       f"+ {s2['garde_voie_journal']} · C3b inventions "
                       f"{s2['c3b_inventions']} · archivés templates "
                       f"{s2['templates_cites_ecarts']}",
            "pass": (s1["templates_cites_ecarts"] == 0
                     and s1["exclues_non_traces"] == 0
                     and s1["forces_hors_banque"] == 0
                     and s1["garde_violations"] == 0
                     and s2["garde_violations"] == 0
                     and s2["c3b_inventions"] == 0
                     and s2["templates_cites_ecarts"] == 0)},
        "COR6_rescore_bit_exact": {
            "definition": "475 profils archivés émo-q3-r1 régénérés par le VRAI simulateur "
                          "seed 42 : C1a 40/40 SILENCIEUSE (SANS_PREUVE) · C1b 20/20 deux "
                          "retenues (SURCHARGE) · C1c 70/80 = 87,5 % ACTIF (H4) · C2 "
                          "475/475 moteur ≡ simulateur, 0 désaccord (S-EMO-Q3-2 CLOS par "
                          "l'arbitrage R1 D-DENSITÉ) · C3a 15/15 (CAP_NON_AC) · C3b 0 · "
                          "cap_global {AC 161, PC 226, AD 37, PD 51} · indice 0,577 · "
                          "observation géométrique H1 15,83 % (borne D-Q3-J 25-45 % — "
                          "SOUS de 9,17 pts, consignée VALID-01)",
            "observe": f"{s2['profils']} profils · {s2['comparaisons']} comparaisons · "
                       f"écarts {len(s2['ecarts'])} · C2 {s2['c2_match']}/475 "
                       f"(désaccords {s2['c2_desaccords']}) · C1a "
                       f"{s2['c1a_sans_preuve_silencieuse']}/40 · C1b "
                       f"{s2['c1b_surcharge_2_retenues']}/20 · C1c "
                       f"{s2['c1c_h4_actif']}/{s2['c1c_h4_total']} · C3a "
                       f"{s2['c3a_cap_non_ac_ok']}/15 (violations {s2['c3a_violations']}) "
                       f"· C3b {s2['c3b_inventions']} · cap_global "
                       f"{json.dumps(s2['cap_global'], sort_keys=True)} · indice "
                       f"{s2['indice_capitalisation']} · H1 silencieux "
                       f"{s2['h1_silencieux_pct']} % ({s2['h1_silencieuses']}/"
                       f"{s2['h1_total']}) · SILENCIEUSES réelles "
                       f"{s2['silencieuses_reelles']} · S1 {s2['S1_archives']} · S2 "
                       f"{s2['S2_archives']}",
            "pass": (len(s2["ecarts"]) == 0
                     and s2["profils"] == 475
                     and s2["c2_match"] == 475 and s2["c2_desaccords"] == 0
                     and s2["c1a_sans_preuve_silencieuse"] == 40
                     and s2["c1b_surcharge_2_retenues"] == 20
                     and s2["c1c_h4_actif"] == 70 and s2["c1c_h4_total"] == 80
                     and s2["c3a_cap_non_ac_ok"] == 15
                     and s2["c3a_violations"] == 0
                     and s2["c3b_inventions"] == 0
                     and s2["cap_global"] == ARCHIVE_CAP_GLOBAL
                     and s2["indice_capitalisation"] == ARCHIVE_INDICE
                     and s2["h1_silencieux_pct"] == ARCHIVE_H1_SILENCIEUX_PCT)},
        "COR7_couplage_pas": {
            "definition": "8/8 pas réels (arbre Q5) résolus par le VRAI selectionner_pas "
                          "avec le cap et les forces retenues MESURÉS par cette quête "
                          "(32 448 combinaisons, héritages Q2 RIO-07 / cœur RIO-06 "
                          "balayés) ; invariants CAP (cap PC mesuré) et fallback (AC sans "
                          "preuves) ; suivi 14 j sans sanction 15/15 ; re-test 8 semaines "
                          "; co-régulation (vrai seuil 3,0, pile consigné) ; couple : "
                          "table 9 entrées (classe er1 × zone Q2) sans hors-nomenclature, "
                          "MIXTE POURSUITE ⇔ zone ≠ ABSENT, FEU CROISÉ présent",
            "observe": f"pas {s4['pas_resolus']}/8 · invariants "
                       f"{s4['invariants_mesures']}/{s4['invariants_attendus']} · "
                       f"cap PC → CAP {s4['cap_pc_donne_CAP']} · fallback "
                       f"{s4['cap_ac_sans_rien_donne_fallback']} · suivi "
                       f"{s4['suivi_15_sans_sanction']}/15 · re-test "
                       f"{s4['retest_8_semaines']} · co-régulation pile "
                       f"{s4['coregulation_inclusive_pile']} · hors nomenclature "
                       f"{s4['couple_hors_nomenclature']} · poursuite incohérente "
                       f"{s4['couple_poursuite_incoherent']} · feu croisé incohérent "
                       f"{s4['couple_feu_croise_incoherent']} · labels hors banque "
                       f"{s1['pas_labels_hors_banque']}",
            "pass": (s4["pas_resolus"] == s4["pas_attendus"] == 8
                     and s4["invariants_mesures"] == s4["invariants_attendus"]
                     and s4["cap_pc_donne_CAP"]
                     and s4["cap_ac_sans_rien_donne_fallback"]
                     and s4["suivi_15_sans_sanction"] == 15
                     and s4["retest_8_semaines"]
                     and s4["coregulation_inclusive_pile"]
                     and s4["couple_hors_nomenclature"] == 0
                     and s4["couple_poursuite_incoherent"] == 0
                     and s4["couple_feu_croise_incoherent"] == 0
                     and s1["pas_labels_hors_banque"] == 0)},
        "COR8_reproductibilite": {
            "definition": "pipeline ×2 → SHA-256 identiques",
            "observe": f"{sha1[:16]}… == {sha2[:16]}… → {cor8}", "pass": cor8},
    }

    RES.mkdir(exist_ok=True)
    payload = {
        "package": "validation-emotionnelle/validation-emo-q3-r1/correction-philosophique",
        "cible": "RIO-08 « Ce que mon cœur sait faire »",
        "moteurs_reels": [
            "validation-emo-q3-r1/src/wtc_emo_q3_core.py (M1 — D-DENSITÉ uniformisée, C2 100 %)",
            "validation-emo-q3-r1/src/wtc_emo_q3_simulator.py (seed 42, 475 profils)",
            "validation-emo-q1/src/wtc_emo_q1_core.py (VRAIS seuils du plancher)",
            "validation-emo-q2-r1/src/wtc_emo_q2_core.py (valeurs Q2 réelles)",
            "validation-emo-q4/src/wtc_emo_q4_core.py",
            "validation-emo-q5/src/wtc_emo_q5_core.py"],
        "espace_enumeré": {
            "dimension": ("échelle C (5³) × cap (4) × demande explicite (5) × "
                          "rang E-R1 (4) × rang E-R3 (4) × états journal (14)"),
            "configurations": n,
            "decomposition": {"echelle_c": len(list(R_C)) ** 3,
                              "cap": len(corr.CAP_TYPES),
                              "demande_explicite": len(list(R_DEXP)),
                              "rangs_er1": len(RANG_REPS),
                              "rangs_er3": len(RANG_REPS),
                              "etats_journal": len(JOURNAL_ETATS)},
        },
        "cor8_sha256_run1": sha1, "cor8_sha256_run2": sha2,
        "criteres": criteres,
        "stage0": s0,
        "stage1": s1,
        "stage2": {k: v for k, v in s2.items() if k != "ecarts"},
        "stage2_ecarts": s2["ecarts"][:20],
        "stage4": {k: v for k, v in s4.items() if k != "pas_table"},
        "stage4_pas_table": s4["pas_table"],
        "standings": r1["standings"],
    }
    (RES / "correction_criteres.json").write_text(
        json.dumps(payload, indent=1, ensure_ascii=False, default=list),
        encoding="utf-8")
    print(json.dumps({k: v["observe"] for k, v in criteres.items()},
                     indent=1, ensure_ascii=False))
    print("Tous PASS :", all(c["pass"] for c in criteres.values()))
    return 0 if all(c["pass"] for c in criteres.values()) else 1


if __name__ == "__main__":
    sys.exit(main())
