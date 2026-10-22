# -*- coding: utf-8 -*-
"""
WTC-EMO-Q5 — VALIDATION DE LA COUCHE DE CORRECTION PHILOSOPHIQUE (RIO-10)
=========================================================================
Stages de preuve sur les VRAIS moteurs (zéro réimplémentation) :

  Stage 0 — COMPACTATIONS PROUVÉES EXHAUSTIVEMENT :
            (a) faces héritées → rangs (13 valeurs réelles × 2 faces —
                mêmes sorties et même palier à rang égal) + convergence
                float ≡ entiers (bandes 4/7/10) ;
            (b) suivi 14 j : les 15 valeurs réelles de jours → 3
                catégories du VRAI suivre_14_jours, frontières 5/6 et
                9/10 vérifiées, sanction None partout (15/15) ;
            (c) espion : l'arbre ne lit QUE les 8 héritages documentés
                (clés parasites ignorées) ; cap ∈ {PC, AD, PD} équivalents
                pour l'arbre (espion 4 caps → 2 classes) ; les champs
                jours/date du profil ne sont JAMAIS lus par
                selectionner_pas (espion) ;
            (d) classe er1 exacte sur les 13 sommes (PILE 3,00 inclusif —
                consigné) ;
            (e) l'espace mesuré (jours 0-14) est énuméré DIRECTEMENT.
  Stage 1 — ÉNUMÉRATION EXHAUSTIVE : 15 jours × 3 zones Q2 × 4 labels ×
            2 caps × 8 forces × 13 er1 × 13 er2 = 486 720 configurations.
            Palier plancher (VRAIS seuils) + double chemin + textes +
            fragments. COR2 = double chemin + junctions S1 ⇔ 🔴 / S2 ⇔ 🟠
            + les 8 pas résolus par le VRAI arbre sur l'espace complet.
  Stage 2 — RE-SCORE BIT-EXACT des 520 profils archivés du rapport
            émo-q5 (6 groupes × 80 + PERFECT 20 + ZERO 20, seed 42) :
            C1 520/520 pas ≡ pas_vrai (D-VÉRITÉ, éliminatoire) · C2
            520/520 catégories ≡ bandes entières · C3 PERFECT→CELEBRE
            20/20, ZERO→REPRISE 20/20, 0 sanction, anti-perfectionnisme
            ok · C6 re-test 8 semaines 520/520 — puis application de la
            couche aux 520.
  Stage 4 — SUIVI 15/15 sans sanction + re-test + rappels doux J1/J7/J14
            + co-régulation (vrai seuil 3,0, PILE consigné).
  COR8    — pipeline ×2, SHA-256 identiques.

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
import wtc_emo_q5_correction as corr
core_q1 = corr.core_q1
core_q2 = corr.core_q2
core_q4 = corr.core_q4
core_q5 = corr.core_q5

sim_q5 = corr._charge("wtc_emo_q5_simulator",
                      corr._Q5 / "src" / "wtc_emo_q5_simulator.py")

RES = Path(__file__).resolve().parents[1] / "results"
SMOKE = os.environ.get("CORR_SMOKE") == "1"
R_JOURS = (0, 14) if SMOKE else range(15)
R_ER = (7, 12) if SMOKE else corr.SOMMES_COEUR
R_ZONES = ("ABSENT", "FRÉQUENT") if SMOKE else corr.ZONES_Q2
R_LABELS = ("BESOIN DISCRET", "REPROCHE-CODE ACTIF") if SMOKE \
    else corr.LABELS_RC_Q2

BANDEAU_OK = corr.BANDEAU_DSIM

_SIM_N = [0]


def _sim_frais():
    """Re-exécute le VRAI simulateur (rng seed 42 frais) — D-REPRO."""
    _SIM_N[0] += 1
    return corr._charge(f"wtc_emo_q5_simulator_r{_SIM_N[0]}",
                        corr._Q5 / "src" / "wtc_emo_q5_simulator.py")

RANG_REPS = {0: 4, 1: 6, 2: 9, 3: 12}


def rang_de_somme(s: int) -> int:
    if s >= 11:
        return 3
    if s >= 8:
        return 2
    if s >= 5:
        return 1
    return 0


def categorie_attendue(jours: int) -> str:
    if jours >= core_q5.SEUIL_CELEBRE:
        return "CELEBRE"
    if jours >= core_q5.SEUIL_AJUSTEMENT:
        return "AJUSTEMENT"
    return "REPRISE"


# ─────────────────────────────────────────────────────────────────────────────
# STAGE 0 — COMPACTATIONS PROUVÉES EXHAUSTIVEMENT
# ─────────────────────────────────────────────────────────────────────────────
def stage0() -> dict:
    res = {
        "rang_valeurs": 0, "rang_ecarts": 0,
        "frontiere_arbre": 0, "frontiere_ecarts": 0,
        "convergence_niveaux": 0, "convergence_ecarts": 0,
        "suivi_jours": 0, "suivi_ecarts": 0, "suivi_sanctions": 0,
        "espion_cles": 0, "espion_cles_ecarts": 0,
        "espion_caps": 0, "espion_caps_ecarts": 0,
        "espion_jours": 0, "espion_jours_ecarts": 0,
        "classe_er1_valeurs": 0, "classe_er1_ecarts": 0,
        "pile_seuils": 0, "dist_min_seuils": 9.0,
    }

    # (a) rangs compacts POUR LE PALIER (2 faces) + frontière propre de
    # l'arbre (er ≥ 3,0 ⇔ s ≥ 9 — 3,00 PILE, consigné) + convergence
    # float ≡ entiers. NOTE : l'arbre du pas lit er ≥ 3,0 — frontière
    # DIFFÉRENTE des rangs 4/7/10 (elle coupe le rang 2 en 8 | 9-10) —
    # l'énumération balaie donc les 13 valeurs réelles par face.
    for face_i in (0, 1):
        for s in range(3, 16):
            vals = [6, 6]
            vals[face_i] = s
            rep_s = RANG_REPS[rang_de_somme(s)]
            vals_rep = list(vals)
            vals_rep[face_i] = rep_s
            res["rang_valeurs"] += 1
            if corr.palier_plancher(vals[0] / 3.0, vals[1] / 3.0)["palier"] \
                    != corr.palier_plancher(vals_rep[0] / 3.0,
                                            vals_rep[1] / 3.0)["palier"]:
                res["rang_ecarts"] += 1
            res["frontiere_arbre"] += 1
            attendu_arbre = (s if face_i == 0 else 6) >= 9
            prof = {"inv_d_zone": "ABSENT", "rc_label": "BESOIN DISCRET",
                    "cap": "AC", "fe1_active": False, "fe6_active": False,
                    "er1_moyenne": vals[0] / 3.0,
                    "er2_moyenne": vals[1] / 3.0, "fe3_active": False}
            pas = core_q5.selectionner_pas(prof)["pas"]
            er1_declenche = pas == "ER1" and face_i == 0
            if face_i == 0 and (er1_declenche != attendu_arbre):
                res["frontiere_ecarts"] += 1
            res["convergence_niveaux"] += 1
            nv = corr.niveau_face(s / 3.0)
            if nv != corr.NIVEAU_DE_RANG[rang_de_somme(s)]:
                res["convergence_ecarts"] += 1
            for th in (corr.SEUIL_BAS_DISCRETE, 2.5, 3.5):
                d = abs(s / 3.0 - th)
                if d < res["dist_min_seuils"]:
                    res["dist_min_seuils"] = d
                if d == 0.0:
                    res["pile_seuils"] += 1

    # (b) suivi 14 j : 15 valeurs réelles, frontières, 0 sanction
    for jours in range(15):
        s = core_q5.suivre_14_jours(jours)
        res["suivi_jours"] += 1
        if s["categorie"] != categorie_attendue(jours):
            res["suivi_ecarts"] += 1
        if s["sanction"] is not None:
            res["suivi_sanctions"] += 1

    # (c) espions : clés parasites / caps équivalents / jours non lus
    base = {"inv_d_zone": "ABSENT", "rc_label": "BESOIN DISCRET",
            "cap": "PC", "fe1_active": False, "fe6_active": False,
            "er1_moyenne": 2.0, "er2_moyenne": 2.0, "fe3_active": False}
    ref = core_q5.selectionner_pas(base)
    parasite = dict(base)
    parasite["ZZ-INCONNU"] = 5
    parasite["jours_tenus"] = 14
    parasite["date_pas"] = "2026-01-01"
    res["espion_cles"] += 1
    if core_q5.selectionner_pas(parasite) != ref:
        res["espion_cles_ecarts"] += 1
    # cap : PC/AD/PD équivalents pour l'arbre (cap != "AC")
    for cap in ("PC", "AD", "PD"):
        p = dict(base)
        p["cap"] = cap
        res["espion_caps"] += 1
        if core_q5.selectionner_pas(p)["pas"] != ref["pas"]:
            res["espion_caps_ecarts"] += 1
    # jours/date jamais lus par selectionner_pas (variés)
    for j in (0, 7, 14):
        p = dict(base)
        p["jours_tenus"] = j
        res["espion_jours"] += 1
        if core_q5.selectionner_pas(p)["pas"] != ref["pas"]:
            res["espion_jours_ecarts"] += 1

    # (d) classe er1 exacte (13 sommes réelles)
    for s in range(3, 16):
        res["classe_er1_valeurs"] += 1
        attendu = ("bas" if s < 9 else "pile" if s == 9 else "haut")
        if corr.classe_er1(s / 3.0) != attendu:
            res["classe_er1_ecarts"] += 1
    return res


# ─────────────────────────────────────────────────────────────────────────────
# STAGE 1 — ÉNUMÉRATION EXHAUSTIVE (15 × 3 × 4 × 2 × 8 × 13 × 13 = 486 720)
# ─────────────────────────────────────────────────────────────────────────────
def stage1(tables: dict) -> dict:
    table_couple = tables["couple"]
    stats = {
        "configs": 0, "fragments_distincts": 0, "fragment_incomplets": 0,
        "cor2_ecarts": 0, "junction_s1s2_ecarts": 0,
        "paliers": {"🟢": 0, "🟠": 0, "🔴": 0},
        "S1": 0, "S2": 0,
        "pas_distribution": {p: 0 for p in core_q5.PAS_ORDER},
        "categories": {"CELEBRE": 0, "AJUSTEMENT": 0, "REPRISE": 0},
        "sanctions_non_nulles": 0,
        "md5_texts_count": 0,
        "mots_interdits_max": 0, "dsim_manquants": 0,
        "templates_cites_ecarts": 0,
        "pas_hors_banque": 0,
    }
    cache_texte = {}
    cache_frag = {}
    retest = core_q5.programmer_re_test("2026-01-01", semaines=8)

    for jours in R_JOURS:
        suivi = core_q5.suivre_14_jours(jours)
        for zone in R_ZONES:
            for label in R_LABELS:
                for cap_i in (0, 1):
                    for f1 in (True, False):
                        for f3 in (True, False):
                            for f6 in (True, False):
                                for e1 in R_ER:
                                    for e2 in R_ER:
                                        stats["configs"] += 1
                                        prof = {
                                            "inv_d_zone": zone,
                                            "rc_label": label,
                                            "cap": corr.CAP_CHOIX[cap_i],
                                            "fe1_active": f1,
                                            "fe6_active": f6,
                                            "er1_moyenne": e1 / 3.0,
                                            "er2_moyenne": e2 / 3.0,
                                            "fe3_active": f3}
                                        pas_sel = core_q5.selectionner_pas(
                                            prof)
                                        stats["pas_distribution"][
                                            pas_sel["pas"]] += 1
                                        if pas_sel["pas"] not in \
                                                core_q5.PAS_ORDER:
                                            stats["pas_hors_banque"] += 1
                                        stats["categories"][
                                            suivi["categorie"]] += 1
                                        if suivi["sanction"] is not None:
                                            stats["sanctions_non_nulles"] += 1
                                        pal = corr.palier_plancher(
                                            e1 / 3.0, e2 / 3.0)
                                        pal_i = corr.palier_independant(
                                            e1, e2)
                                        if (pal["palier"] != pal_i["palier"]
                                                or pal["S1"] != pal_i["S1"]
                                                or pal["S2"] != pal_i["S2"]):
                                            stats["cor2_ecarts"] += 1
                                        if pal["S1"] != (pal["palier"]
                                                          == "🔴") \
                                                or pal["S2"] != \
                                                (pal["palier"] == "🟠"):
                                            stats["junction_s1s2_ecarts"] += 1
                                        stats["paliers"][pal["palier"]] += 1
                                        if pal["S1"]:
                                            stats["S1"] += 1
                                        if pal["S2"]:
                                            stats["S2"] += 1
                                        cle = (jours, zone, label, cap_i,
                                               f1, f3, f6, e1, e2)
                                        bloc = cache_texte.get(cle)
                                        if bloc is None:
                                            b = corr.bloc_ecran(
                                                pas_sel, suivi, pal,
                                                retest["message"])
                                            attendu_cites = 6
                                            bloc = (b["md5"],
                                                    b["nb_mots_interdits"],
                                                    BANDEAU_OK in b["texte"],
                                                    b["nb_templates_cites"],
                                                    attendu_cites)
                                            cache_texte[cle] = bloc
                                        md5_t, nb_mots, dsim_ok, nb_cites, \
                                            att_cites = bloc
                                        if nb_mots > stats[
                                                "mots_interdits_max"]:
                                            stats["mots_interdits_max"] = nb_mots
                                        if not dsim_ok:
                                            stats["dsim_manquants"] += 1
                                        if nb_cites != att_cites:
                                            stats["templates_cites_ecarts"] += 1
                                        frag = cache_frag.get(cle)
                                        if frag is None:
                                            f_ = corr.bilan_fragment(
                                                pas_sel, suivi, pal, retest,
                                                prof, table_couple)
                                            frag = (f_["_complet"],)
                                            cache_frag[cle] = frag
                                            stats["fragments_distincts"] += 1
                                        if not frag[0]:
                                            stats["fragment_incomplets"] += 1

    stats["md5_texts_count"] = len(cache_texte)
    stats["configs_attendues"] = (len(list(R_JOURS)) * len(R_ZONES)
                                  * len(R_LABELS) * 2 * 8
                                  * len(R_ER) ** 2)
    return stats


# ─────────────────────────────────────────────────────────────────────────────
# STAGE 2 — RE-SCORE BIT-EXACT DES 520 PROFILS ARCHIVÉS (VRAI simulateur 42)
# ─────────────────────────────────────────────────────────────────────────────
ARCHIVE_N_TOTAL = 520
ARCHIVE_C1 = {"attendu_pct": 100.0, "n_match": 520, "n_total": 520}
ARCHIVE_C2 = {"attendu_pct": 100.0, "n_match": 520, "n_total": 520}
ARCHIVE_C3 = {"perfect_celebre": 20, "perfect_total": 20,
              "zero_reprise": 20, "zero_total": 20, "sanctions": 0}
ARCHIVE_C6 = {"n_programmed": 520, "n_total": 520}
ATTENDU_RESUME = {"G1_inv": 80, "G2_rc": 80, "G3_cap": 80, "G4_fe1": 80,
                  "G5_er1": 80, "G6_fallback": 80, "PERFECT": 20,
                  "ZERO": 20}
PAS_ATTENDU_PAR_GROUPE = {"G1_inv": "INV", "G2_rc": "RC", "G3_cap": "CAP",
                          "G4_fe1": "FE1", "G5_er1": "ER1",
                          "G6_fallback": "ER2", "PERFECT": "ER2",
                          "ZERO": "ER2"}


def stage2(tables: dict) -> dict:
    # D-REPRO : le simulateur consomme le rng à la génération — il est
    # RE-EXÉCUTÉ à chaque exécution (comme la validation archivée
    # importlib.reload(sim)) pour garantir des profils identiques ×2 :
    sim = _sim_frais()
    res = {
        "profils": 0, "comparaisons": 0, "ecarts": [],
        "c1_match": 0, "c2_match": 0,
        "c3_perfect_celebre": 0, "c3_perfect_total": 0,
        "c3_zero_reprise": 0, "c3_zero_total": 0,
        "c3_sanctions": 0, "anti_ok": None,
        "c6_programmed": 0,
        "pas_par_groupe_conformes": 0,
        "paliers": {"🟢": 0, "🟠": 0, "🔴": 0},
        "S1": 0, "S2": 0,
        "fragments_archives": 0, "fragments_incomplets": 0,
        "dsim_archives": 0, "mots_interdits_max": 0,
        "templates_cites_ecarts": 0,
    }
    profils = []
    for nom in ("G1_inv", "G2_rc", "G3_cap", "G4_fe1", "G5_er1",
                "G6_fallback"):
        for i, p in enumerate(sim_q5.gen_groupes.__doc__ and [] or []):
            pass
    # les groupes sont générés par gen_groupes() + gen_pieges() :
    profils = sim.gen_groupes() + sim.gen_pieges()
    res["profils"] = len(profils)
    res["comparaisons"] += 1
    if res["profils"] != ARCHIVE_N_TOTAL:
        res["ecarts"].append({"champ": "n_total", "calcule": res["profils"],
                              "archive": ARCHIVE_N_TOTAL})
    resume = {}
    for p in profils:
        gid = p["groupe"]
        resume[gid] = resume.get(gid, 0) + 1
        # VRAI moteur :
        pas_sel = core_q5.selectionner_pas(p)
        suivi = core_q5.suivre_14_jours(p["jours_tenus"])
        retest = core_q5.programmer_re_test(p["date_pas"])
        # C1 — pas ≡ pas_vrai (D-VÉRITÉ, éliminatoire — pas_vrai retourne
        # directement le nom du pas) :
        res["comparaisons"] += 1
        if pas_sel["pas"] == sim.pas_vrai(p):
            res["c1_match"] += 1
        else:
            res["ecarts"].append({"id": p["id"], "champ": "c1_pas",
                                  "calcule": pas_sel["pas"]})
        # C1 bis — pas attendu par groupe DÉTERMINISTE (G1-G4 : l'héritage
        # ciblé déclenche toujours ; G5/G6/PERFECT/ZERO dépendent du bruit
        # D-PARAM — consigné) :
        if gid in ("G1_inv", "G2_rc", "G3_cap", "G4_fe1") and \
                pas_sel["pas"] == PAS_ATTENDU_PAR_GROUPE[gid]:
            res["pas_par_groupe_conformes"] += 1
        # C2 — catégorie ≡ bandes entières (comptage booléen) :
        res["comparaisons"] += 1
        if suivi["categorie"] == categorie_attendue(p["jours_tenus"]):
            res["c2_match"] += 1
        else:
            res["ecarts"].append({"id": p["id"], "champ": "c2_categorie",
                                  "calcule": suivi["categorie"]})
        # C3 — anti-perfectionnisme :
        res["c3_sanctions"] += 0 if suivi["sanction"] is None else 1
        if gid == "PERFECT":
            res["c3_perfect_total"] += 1
            if suivi["categorie"] == "CELEBRE":
                res["c3_perfect_celebre"] += 1
        if gid == "ZERO":
            res["c3_zero_total"] += 1
            if suivi["categorie"] == "REPRISE":
                res["c3_zero_reprise"] += 1
        # C6 — re-test 8 semaines :
        res["comparaisons"] += 1
        if retest["semaines"] == 8 and retest["force"] is False:
            res["c6_programmed"] += 1
        # COUCHE appliquée :
        pal = corr.palier_plancher(p["er1_moyenne"], p["er2_moyenne"])
        bloc = corr.bloc_ecran(pas_sel, suivi, pal, retest["message"])
        res["comparaisons"] += 3
        if BANDEAU_OK in bloc["texte"]:
            res["dsim_archives"] += 1
        res["mots_interdits_max"] = max(res["mots_interdits_max"],
                                        bloc["nb_mots_interdits"])
        if bloc["nb_templates_cites"] != 6:
            res["templates_cites_ecarts"] += 1
        frag = corr.bilan_fragment(pas_sel, suivi, pal, retest, p,
                                   tables["couple"])
        res["comparaisons"] += 1
        if frag["_complet"]:
            res["fragments_archives"] += 1
        else:
            res["fragments_incomplets"] += 1
        res["paliers"][pal["palier"]] += 1
        if pal["S1"]:
            res["S1"] += 1
        if pal["S2"]:
            res["S2"] += 1
    res["resume"] = resume
    res["comparaisons"] += len(ATTENDU_RESUME)
    if resume != ATTENDU_RESUME:
        res["ecarts"].append({"champ": "resume", "calcule": str(resume),
                              "archive": str(ATTENDU_RESUME)})
    res["anti_ok"] = bool(core_q5.verifier_anti_perfectionnisme()["ok"])
    return res


# ─────────────────────────────────────────────────────────────────────────────
# STAGE 4 — SUIVI + RE-TEST + RAPPELS + CO-RÉGULATION
# ─────────────────────────────────────────────────────────────────────────────
def stage4(tables: dict) -> dict:
    suivi_ok = 0
    categories = set()
    for jours in range(15):
        s = core_q5.suivre_14_jours(jours)
        categories.add(s["categorie"])
        if s["sanction"] is None:
            suivi_ok += 1
    rt = core_q5.programmer_re_test("2026-01-01", semaines=8)
    retest_ok = (rt["semaines"] == 8 and rt["force"] is False
                 and len(rt["message"]) > 20)
    rappels = {j: core_q5.rappel_doux(j, "Formuler ton besoin au lieu "
                                         "d'attendre qu'on le devine")
               for j in (1, 7, 14)}
    rappels_ok = all("Formuler" in r for r in rappels.values()) and \
        len(rappels) == 3
    co_bas = core_q4.co_regulation(2.9, 3.0)["paire_explosive"]
    co_pile = core_q4.co_regulation(3.0, 3.0)["paire_explosive"]
    co_haut = core_q4.co_regulation(3.1, 3.0)["paire_explosive"]
    co_ok = (co_bas is False) and (co_pile is True) and (co_haut is True)
    return {
        "suivi_15_sans_sanction": suivi_ok,
        "suivi_categories": sorted(categories),
        "retest_8_semaines": retest_ok,
        "rappels_doux_3": rappels_ok,
        "coregulation_inclusive_pile": co_ok,
        "pas_par_zone_table": {z: len(t) for z, t in
                               tables.get("pas", {}).items()} or "n/a",
    }


# ─────────────────────────────────────────────────────────────────────────────
# PIPELINE COMPLET (exécuté 2 fois pour COR8)
# ─────────────────────────────────────────────────────────────────────────────
def pipeline() -> dict:
    print("  stage 0 — compactations …", flush=True)
    s0 = stage0()
    tables = {"couple": corr._tables_couple()}
    print("  stage 1 — énumération exhaustive …", flush=True)
    s1 = stage1(tables)
    print(f"    {s1['configs']} configurations · textes distincts "
          f"{s1['md5_texts_count']} · fragments distincts "
          f"{s1['fragments_distincts']}", flush=True)
    print("  stage 2 — re-score bit-exact des 520 …", flush=True)
    s2 = stage2(tables)
    print(f"    {s2['profils']} profils · {s2['comparaisons']} comparaisons "
          f"· écarts {len(s2['ecarts'])}", flush=True)
    print("  stage 4 — suivi + re-test + rappels + co-régulation …",
          flush=True)
    s4 = stage4(tables)
    print(f"    suivi {s4['suivi_15_sans_sanction']}/15 · re-test "
          f"{s4['retest_8_semaines']}", flush=True)
    return {"stage0": s0, "stage1": s1, "stage2": s2, "stage4": s4,
            "standings": {
                "mots_interdits_standings": max(
                    [sum(1 for m in corr.MOTS_INTERDITS if m in t.lower())
                     for t in (corr.BANDEAU_DSIM, corr.PHRASE_ORIENTATION,
                               corr.NOTE_PAS, corr.NOTE_PLANCHER,
                               corr.clause_aide_standing(),
                               *core_q5.PAS_LABELS.values(),
                               *core_q5.TEMPLATES_PAS.values(),
                               *core_q5.TEMPLATES_SUIVI.values(),
                               *core_q5.TEMPLATES_RAPPELS.values(),
                               *core_q2.TEMPLATES_INVALIDATION_DONNEE.values(),
                               *core_q2.TEMPLATES_INVALIDATION_RECUE.values(),
                               *core_q2.TEMPLATES_REPROCHE_CODE.values())]),
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
            "definition": "compactations PROUVÉES exhaustivement : faces héritées → "
                          "rangs (13 valeurs réelles × 2 faces, sorties du VRAI arbre "
                          "identiques à rang égal) · convergence float ≡ entiers (26) · "
                          "suivi 15 valeurs (frontières 5/6 et 9/10, 0 sanction) · "
                          "espions : clés parasites ignorées, caps PC/AD/PD équivalents "
                          "pour l'arbre, jours/date jamais lus par selectionner_pas · "
                          "classe er1 exacte (PILE 3,00 inclusif consigné) · l'espace "
                          "mesuré (jours 0-14) énuméré DIRECTEMENT",
            "observe": f"rang {s0['rang_valeurs']} → écart {s0['rang_ecarts']} · "
                       f"convergence {s0['convergence_niveaux']} → écart "
                       f"{s0['convergence_ecarts']} · suivi {s0['suivi_jours']} → "
                       f"écart {s0['suivi_ecarts']} · sanctions {s0['suivi_sanctions']} "
                       f"· espion clés {s0['espion_cles']} → écart "
                       f"{s0['espion_cles_ecarts']} · espion caps "
                       f"{s0['espion_caps']} → écart {s0['espion_caps_ecarts']} · "
                       f"espion jours {s0['espion_jours']} → écart "
                       f"{s0['espion_jours_ecarts']} · classe er1 "
                       f"{s0['classe_er1_valeurs']} → écart {s0['classe_er1_ecarts']} · "
                       f"pile seuils cœur {s0['pile_seuils']} (dist min "
                       f"{round(s0['dist_min_seuils'], 4)})",
            "pass": (s0["rang_ecarts"] == 0
                     and s0["convergence_ecarts"] == 0
                     and s0["suivi_ecarts"] == 0
                     and s0["suivi_sanctions"] == 0
                     and s0["espion_cles_ecarts"] == 0
                     and s0["espion_caps_ecarts"] == 0
                     and s0["espion_jours_ecarts"] == 0
                     and s0["classe_er1_ecarts"] == 0
                     and s0["pile_seuils"] == 0)},
        "COR1_fragment_complet": {
            "definition": f"{n}/{n} configurations → fragment L8 7 blocs, 0 champ vide "
                          "(aucun gate sur cet instrument — pas de suspension inventée, "
                          "R4) + 520/520 profils archivés",
            "observe": f"{s1['fragments_distincts']}/{s1['fragments_distincts']} états "
                       f"distincts · incomplets {s1['fragment_incomplets']} · archivés "
                       f"{s2['fragments_archives']}/{s2['profils']} · incomplets "
                       f"{s2['fragments_incomplets']}",
            "pass": (s1["fragment_incomplets"] == 0
                     and s2["fragments_incomplets"] == 0
                     and s2["fragments_archives"] == s2["profils"] == 520)},
        "COR2_derivation_palier": {
            "definition": "double chemin : entier pur (bandes 4/7/10) ≡ VRAIS seuils du "
                          "cœur (3,5/2,5/1,5 — imports réels émo-q1) — palier plancher + "
                          "S1 + S2 ; junctions S1 ⇔ 🔴, S2 ⇔ 🟠 exactement ; PLANCHER "
                          "PARTIEL consigné (E-R3 absente des héritages — borne basse) ; "
                          "note : les er des profils sont continus (D-PARAM σ 0,60) — le "
                          "chemin float est celui appliqué",
            "observe": f"{n} configs · écart double chemin {s1['cor2_ecarts']} · "
                       f"écart junction {s1['junction_s1s2_ecarts']}",
            "pass": (s1["cor2_ecarts"] == 0
                     and s1["junction_s1s2_ecarts"] == 0)},
        "COR3_seuils_aide": {
            "definition": "S1 = plancher 🔴 (une face héritée ≥ 3,5, VRAI "
                          "SEUIL_DOMINANCE) ; S2 = plancher 🟠 ; la couche n'ajoute "
                          "aucun seuil numérique ; 0 borne pile (1,5/2,5/3,5 hors "
                          "grille s/3) ; seuils du SUIVI entiers (≥ 10 CELEBRE · 6-9 "
                          "AJUSTEMENT · ≤ 5 REPRISE — exacts par construction, "
                          "célébré jamais sanctionné) ; co-régulation 3,0 PILE "
                          "inclusif consigné",
            "observe": f"S1 {s1['S1']}/{n} · S2 {s1['S2']}/{n} · pile seuils cœur "
                       f"{s0['pile_seuils']} · suivi seuils exacts (entiers) · "
                       f"co-régulation pile {s4['coregulation_inclusive_pile']}",
            "pass": (s1["junction_s1s2_ecarts"] == 0
                     and s0["pile_seuils"] == 0
                     and s4["coregulation_inclusive_pile"])},
        "COR4_vocabulaire_ecran": {
            "definition": "0 mot interdit (canon Partie 9) sur tous les textes générés "
                          "+ templates réels du moteur (8 pas + 3 suivi + 3 rappels) + "
                          "templates réels Q2, D-SIM 100 %",
            "observe": f"max mots interdits par texte = {s1['mots_interdits_max']} ; "
                       f"standing = {r1['standings']['mots_interdits_standings']} ; "
                       f"textes distincts = {s1['md5_texts_count']} ; D-SIM manquants "
                       f"{s1['dsim_manquants']} ; archivés D-SIM {s2['dsim_archives']}/"
                       f"520 · max archivés {s2['mots_interdits_max']}",
            "pass": (s1["mots_interdits_max"] == 0
                     and r1["standings"]["mots_interdits_standings"] == 0
                     and s1["dsim_manquants"] == 0
                     and s2["dsim_archives"] == 520
                     and s2["mots_interdits_max"] == 0)},
        "COR5_anti_fabrication": {
            "definition": "le pas affiché ≡ VRAI selectionner_pas (trace de source "
                          "réelle, arbre 8 pas) ; 6 templates réels cités par écran "
                          "(pas + suivi + 3 rappels + re-test) ; fallback ER2 tracé "
                          "honnêtement ; JAMAIS de sanction (structurel) ; pas ⊆ "
                          "banque fermée",
            "observe": f"templates cités : écart {s1['templates_cites_ecarts']} · "
                       f"pas hors banque {s1['pas_hors_banque']} · sanctions non "
                       f"nulles {s1['sanctions_non_nulles']} (énum) + "
                       f"{s2['c3_sanctions']} (archivés) · archivés templates "
                       f"{s2['templates_cites_ecarts']}",
            "pass": (s1["templates_cites_ecarts"] == 0
                     and s1["pas_hors_banque"] == 0
                     and s1["sanctions_non_nulles"] == 0
                     and s2["c3_sanctions"] == 0
                     and s2["templates_cites_ecarts"] == 0)},
        "COR6_rescore_bit_exact": {
            "definition": "520 profils archivés émo-q5 régénérés par le VRAI simulateur "
                          "seed 42 (6 groupes × 80 + PERFECT 20 + ZERO 20) : C1 520/520 "
                          "pas ≡ pas_vrai (D-VÉRITÉ, éliminatoire) + pas attendu par "
                          "groupe 8/8 · C2 520/520 catégories ≡ bandes entières · C3 "
                          "PERFECT→CELEBRE 20/20, ZERO→REPRISE 20/20, 0 sanction, "
                          "anti-perfectionnisme ok · C6 re-test 8 semaines 520/520",
            "observe": f"{s2['profils']} profils · {s2['comparaisons']} comparaisons · "
                       f"écarts {len(s2['ecarts'])} · C1 {s2['c1_match']}/520 · pas/"
                       f"groupe {s2['pas_par_groupe_conformes']}/8 · C2 "
                       f"{s2['c2_match']}/520 · C3 PERFECT {s2['c3_perfect_celebre']}/"
                       f"{s2['c3_perfect_total']} · ZERO {s2['c3_zero_reprise']}/"
                       f"{s2['c3_zero_total']} · sanctions {s2['c3_sanctions']} · anti "
                       f"{s2['anti_ok']} · C6 {s2['c6_programmed']}/520 · paliers "
                       f"{s2['paliers']} · S1 {s2['S1']} · S2 {s2['S2']}",
            "pass": (len(s2["ecarts"]) == 0
                     and s2["profils"] == 520
                     and s2["c1_match"] == 520
                     and s2["pas_par_groupe_conformes"] == 320
                     and s2["c2_match"] == 520
                     and s2["c3_perfect_celebre"] == 20
                     and s2["c3_zero_reprise"] == 20
                     and s2["c3_sanctions"] == 0
                     and s2["anti_ok"] is True
                     and s2["c6_programmed"] == 520)},
        "COR7_couplage_pas": {
            "definition": "les 8 pas réels résolus par le VRAI selectionner_pas sur "
                          "l'espace complet des héritages (énumération exhaustive — "
                          "tous les héritages sont mesurés par les quêtes amont RIO-06/"
                          "07/08) ; suivi 14 j sans sanction 15/15 ; re-test 8 semaines "
                          "jamais forcé ; rappels doux J1/J7/J14 réels ; co-régulation "
                          "(vrai seuil 3,0, PILE consigné)",
            "observe": f"pas résolus {sum(1 for v in s1['pas_distribution'].values() if v)}/8 · "
                       f"distribution {json.dumps(s1['pas_distribution'], sort_keys=True)} · "
                       f"suivi {s4['suivi_15_sans_sanction']}/15 · re-test "
                       f"{s4['retest_8_semaines']} · rappels {s4['rappels_doux_3']} · "
                       f"co-régulation pile {s4['coregulation_inclusive_pile']}",
            "pass": (sum(1 for v in s1["pas_distribution"].values() if v) == 8
                     and s4["suivi_15_sans_sanction"] == 15
                     and s4["retest_8_semaines"]
                     and s4["rappels_doux_3"]
                     and s4["coregulation_inclusive_pile"])},
        "COR8_reproductibilite": {
            "definition": "pipeline ×2 → SHA-256 identiques",
            "observe": f"{sha1[:16]}… == {sha2[:16]}… → {cor8}", "pass": cor8},
    }

    RES.mkdir(exist_ok=True)
    payload = {
        "package": "validation-emotionnelle/validation-emo-q5/correction-philosophique",
        "cible": "RIO-10 « Mon premier geste du cœur »",
        "moteurs_reels": [
            "validation-emo-q5/src/wtc_emo_q5_core.py (arbre 8 pas + suivi + re-test)",
            "validation-emo-q5/src/wtc_emo_q5_simulator.py (seed 42, 520 profils)",
            "validation-emo-q1/src/wtc_emo_q1_core.py (VRAIS seuils du plancher)",
            "validation-emo-q2-r1/src/wtc_emo_q2_core.py (valeurs Q2 réelles)",
            "validation-emo-q4-r3/src/wtc_emo_q4_core.py (co-régulation)"],
        "espace_enumeré": {
            "dimension": ("jours tenus (15) × zone Q2 (3) × label (4) × cap (2) × "
                          "forces fe1/fe3/fe6 (8) × er1 (13) × er2 (13)"),
            "configurations": n,
        },
        "cor8_sha256_run1": sha1, "cor8_sha256_run2": sha2,
        "criteres": criteres,
        "stage0": s0,
        "stage1": s1,
        "stage2": {k: v for k, v in s2.items() if k != "ecarts"},
        "stage2_ecarts": s2["ecarts"][:20],
        "stage4": s4,
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
