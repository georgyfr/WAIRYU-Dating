# -*- coding: utf-8 -*-
"""
WTC-Q5 — VALIDATION DE LA COUCHE DE CORRECTION PHILOSOPHIQUE (RIO-05)
=====================================================================
Stages de preuve sur les VRAIS moteurs (zéro réimplémentation) :

  Stage 0 — COMPACTATIONS PROUVÉES EXHAUSTIVEMENT :
            (a) l'espace RÉEL des axes sA/sB, déterminé par le VRAI code
                q1-r1 (9 items corrigés par axe, échelle 1-4, items 5/15
                inversés → corrigé ∈ 1-4 ; moyenne = somme/9, grain 1/9,
                arrondi 2 décimales — le VRAI `scores_axes` vérifie
                chaque somme) — 28 valeurs (1,0 … 4,0), sans trou ;
            (b) frontière 2,61 sur l'espace RÉEL — tranchage lu dans le
                VRAI `face_dominante` des DEUX côtés : NON PILE atteignable
                (consigné honnêtement — dist min mesurée) mais SANS
                AMBIGUÏTÉ (2,56 < 2,61 ≤ 2,67) ;
            (c) table pas 9/9 ≡ règle pure (double chemin — table
                ré-encodée sans le moteur) ;
            (d) compactation pas ≡ (face, empreinte) — 784 paires × 3
                empreintes réelles, constant par cellule ;
            (e) suivi 15 valeurs (0-14) — frontières 6/7 et 8/9, 0
                sanction, sanction None structurelle (bords non entiers
                consignés : le cœur traite le non-entier comme 0) ;
            (f) espions : variantes de labels (casse/espaces/accents),
                jours jamais lus par le pas, la face seule NE SUFFIT PAS
                (même face, paliers différents — consigné) ;
            (g) empreinte : normalisation des 8 labels du flux (6 réels
                du VRAI nommage q2-r1 + None + inconnu) vers les 3
                valeurs — inconnus/None → ZONE_CALME (consigné) ;
            (h) type ≡ classe (hautA, hautB) sur 784 paires (junction
                couple compactée) — écarts de boucle mesurés sur
                l'espace réel, frontière 30 du VRAI
                `boucle_poursuite_retrait` testée des deux côtés ;
            (i) les 6 labels d'ombre RÉELS produits par le VRAI nommage
                q2-r1 (junction « libellés réels » — action n°3) ;
            (j) fallback P1 : atteignable HORS flux uniquement (appel
                direct de `_PAS_TABLE` avec clés arbitraires — consigné) ;
            (k) re-test 8 semaines (VRAI `programmer_re_test_q1`) :
                date exacte, jamais forcé.
  Stage 1 — ÉNUMÉRATION EXHAUSTIVE : 784 paires d'axes réelles (28 × 28)
            × 8 labels du flux × 15 jours (0-14) × 5 chemins couple (mono
            + 4 classes réelles de l'autre rive) = 470 400 configurations.
            Palier (VRAI seuil 2,61) + double chemin entiers purs + textes
            + fragments. COR2 = convergence exacte + junctions S1 ⇔ 🔴 /
            S2 ⇔ 🟠. COR5 = fallback P1 inatteignable via le flux (prouvé)
            + 6 templates réels cités par écran + trace réelle.
  Stage 2 — RE-SCORE BIT-EXACT des 180 profils archivés du VRAI simulateur
            (3 groupes × 60, seed 42, re-exécuté FRAIS à chaque passage —
            D-REPRO) : C1 180/180 pas ≡ `pas_vrai` (D-VÉRITÉ, éliminatoire)
            · C2 180/180 catégories ≡ `categorie_suivi_vraie` + groupe ·
            C3 CELEBRE 60/60 · AJUSTEMENT 60/60 · REPRISE 60/60, 0
            sanction, anti-perfectionnisme ok · C6 re-test 8 semaines
            180/180 — puis application de la couche aux 180.
  Stage 4 — SUIVI 15/15 sans sanction + re-test jamais forcé (2 dates) +
            rappels doux J1/J7/J14 réels + table couple (9 configurations
            nommées, toutes avec template).
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
import wtc_q5_correction as corr
core_q1 = corr.core_q1
core_q2 = corr.core_q2
core_q4 = corr.core_q4
core_q5 = corr.core_q5
corr_q4 = corr.corr_q4

RES = Path(__file__).resolve().parents[1] / "results"
SMOKE = os.environ.get("CORR_SMOKE") == "1"

SEUIL = corr.SEUIL_AXES_COEUR          # le VRAI littéral 2,61 (épinglé à l'import)
SOMMES = tuple(range(9, 37))           # 28 sommes d'items atteignables par axe
R_KA = (9, 24, 36) if SMOKE else SOMMES
R_KB = (9, 24, 36) if SMOKE else SOMMES
R_JOURS = (0, 9, 14) if SMOKE else range(15)

BANDEAU_OK = corr.BANDEAU_DSIM

_SIM_N = [0]


def _sim_frais():
    """Re-exécute le VRAI simulateur (rng seed 42 frais) — D-REPRO."""
    _SIM_N[0] += 1
    return corr._charge(f"wtc_q5_simulator_r{_SIM_N[0]}",
                        corr._Q5 / "src" / "wtc_q5_simulator.py")


# ─────────────────────────────────────────────────────────────────────────────
# LABELS RÉELS — les 6 issues du VRAI nommage q2-r1 (junction « libellés
# réels », action n°3) + None + un label arbitraire passé au flux.
# ─────────────────────────────────────────────────────────────────────────────
def _labels_reels() -> dict:
    def issue(sA, sB, d, p, h, r, i_alarm):
        prof = core_q2.profil_declencheurs(d, p)
        comp = core_q2.comportements(h, r)
        conv = core_q2.convergence(sA, sB, prof["count_d"], prof["count_p"],
                                   comp["n_checked"], comp["h_norm"],
                                   comp["r_norm"])
        return core_q2.nommage(sA, sB, prof, comp, i_alarm, conv)["label"]

    return {
        "ZONE CALME": issue(2.0, 2.0, {}, {}, {}, {}, 0),
        "PEUR DE PERDRE": issue(3.0, 2.0, {"D1": 1, "D2": 1}, {},
                                {"H1": 1, "H2": 1, "H3": 1, "H4": 1, "H5": 1},
                                {}, 0),
        "PEUR D'ÊTRE ÉTOUFFÉE": issue(2.0, 3.0, {}, {}, {},
                                      {"R1": 1, "R2": 1, "R3": 1}, 0),
        "LES DEUX": issue(3.0, 3.0, {"D1": 1, "D2": 1, "D3": 1},
                          {"P1": 1, "P2": 1}, {}, {}, 0),
        "ALARME SANS MAIN": issue(3.0, 2.0, {}, {}, {}, {}, 5),
        "SIGNAL LÉGER NON NOMMÉ": issue(2.0, 2.0, {}, {},
                                        {"H1": 1, "H2": 1}, {}, 2),
    }


ATTENDU_LABELS = ["ZONE CALME", "PEUR DE PERDRE", "PEUR D'ÊTRE ÉTOUFFÉE",
                  "LES DEUX", "ALARME SANS MAIN", "SIGNAL LÉGER NON NOMMÉ"]
LABELS_EMP_CANON = (("ZONE CALME", "ZONE_CALME"),
                    ("PEUR DE PERDRE", "PEUR_DE_PERDRE"),
                    ("PEUR D'ÊTRE ÉTOUFFÉE", "PEUR_D_ETRE_ETOUFFEE"))

# Les 8 labels passés au VRAI flux (6 réels produits par le VRAI nommage
# q2-r1 + None + un label arbitraire) — l'empreinte les normalise tous
# vers les 3 valeurs (mesuré au stage 0, exploité au stage 1).
LABELS_FLUX = list(_labels_reels().values()) + [None, "LABEL INCONNU"]

# Les 4 classes réelles de l'autre rive (représentants — la compactation
# type ≡ classe est prouvée en stage 0) : sommes 10 → 1,11 · 27 → 3,00.
RIVES_2 = ((1.11, 1.11), (3.0, 1.11), (1.11, 3.0), (3.0, 3.0))
ATTENDU_RIVE_2 = ("SEREIN", "PREOCCUPE", "DETACHE", "EN_ALERTFEU")
ATTENDU_PCT_2 = (25, 70, 20, 85)

ATTENDU_GROUPE = {"CELEBRE": "CELEBRE", "AJUSTEMENT": "AJUSTEMENT",
                  "REPRISE": "REPRISE"}


# ─────────────────────────────────────────────────────────────────────────────
# STAGE 0 — COMPACTATIONS PROUVÉES EXHAUSTIVEMENT
# ─────────────────────────────────────────────────────────────────────────────
def stage0() -> dict:
    res = {
        "axes_sommes": 0, "axes_sans_trou": False, "axes_valeurs": 0,
        "scores_axes_ecarts": 0,
        "frontiere_bas_max": None, "frontiere_haut_min": None,
        "pile_261": 0, "dist_min_261": None,
        "dist_bas": None, "dist_haut": None, "tranchage_ecarts": 0,
        "table_pas": 0, "table_pas_ecarts": 0,
        "compaction_pas": 0, "compaction_pas_ecarts": 0,
        "pas_par_cellule": {},
        "suivi_jours": 0, "suivi_ecarts": 0, "suivi_sanctions": 0,
        "suivi_bords_ecarts": 0,
        "espion_labels": 0, "espion_labels_ecarts": 0,
        "espion_jours": 0, "espion_jours_ecarts": 0,
        "face_vs_palier": 0, "face_vs_palier_ecarts": 0,
        "empreinte_map": {},
        "type_compaction": 0, "type_compaction_ecarts": 0,
        "pct_valeurs": [], "boucle_ecarts_reels": [],
        "boucle_frontiere_bas": None, "boucle_frontiere_haut": None,
        "labels_reels_ecarts": 0,
        "fallback_hors_flux": None,
        "retest_ok": False,
    }

    # (a) l'espace RÉEL des axes — déterminé par le VRAI code q1-r1
    sommes = set()
    for t in itertools.product(range(1, 5), repeat=9):
        sommes.add(sum(t))
    res["axes_sommes"] = len(sommes)
    res["axes_sans_trou"] = sommes == set(range(9, 37))
    AXES_VALS = tuple(sorted(round(s / 9.0, 2) for s in sommes))
    res["axes_valeurs"] = len(AXES_VALS)
    ecarts_scores = 0
    for k in sorted(sommes):
        base, rem = divmod(k, 9)
        cor9 = [base + 1] * rem + [base] * (9 - rem)
        bruts = {i: cor9[i - 1] for i in range(1, 10)}
        bruts[5] = 5 - cor9[4]                       # item 5 inversé
        corriges = {i: core_q1.corrige(i, bruts[i]) for i in range(1, 10)}
        for i in range(10, 19):
            corriges[i] = 1
        if core_q1.scores_axes(corriges)["A"] != round(k / 9.0, 2):
            ecarts_scores += 1
    res["scores_axes_ecarts"] = ecarts_scores

    # (b) frontière 2,61 sur l'espace RÉEL — tranchage lu dans le VRAI
    # face_dominante, les DEUX côtés testés
    hauts = [v for v in AXES_VALS if core_q5.face_dominante(v, 1.0) == "EN_QUETE"]
    hauts_b = [v for v in AXES_VALS if core_q5.face_dominante(1.0, v) == "SUR_LA_RA"]
    res["tranchage_ecarts"] = int(hauts != hauts_b)
    basses = [v for v in AXES_VALS if v not in hauts]
    res["frontiere_bas_max"] = max(basses)
    res["frontiere_haut_min"] = min(hauts)
    res["pile_261"] = sum(1 for v in AXES_VALS if v == SEUIL)
    res["dist_min_261"] = round(min(abs(v - SEUIL) for v in AXES_VALS), 4)
    res["dist_bas"] = round(SEUIL - max(basses), 4)
    res["dist_haut"] = round(min(hauts) - SEUIL, 4)
    # les deux côtés, via la couche (le palier suit le tranchage du cœur) :
    if (corr.palier_axes(max(basses), 1.0)["palier"] != "🟢"
            or corr.palier_axes(min(hauts), 1.0)["palier"] != "🟠"):
        res["tranchage_ecarts"] += 1

    # (c) table pas 9/9 ≡ règle pure (double chemin — table ré-encodée)
    table_indep = {
        ("RASSUREE", "ZONE_CALME"): "P1",
        ("RASSUREE", "PEUR_DE_PERDRE"): "P2",
        ("RASSUREE", "PEUR_D_ETRE_ETOUFFEE"): "P3",
        ("EN_QUETE", "ZONE_CALME"): "P2",
        ("EN_QUETE", "PEUR_DE_PERDRE"): "P4",
        ("EN_QUETE", "PEUR_D_ETRE_ETOUFFEE"): "P5",
        ("SUR_LA_RA", "ZONE_CALME"): "P3",
        ("SUR_LA_RA", "PEUR_DE_PERDRE"): "P5",
        ("SUR_LA_RA", "PEUR_D_ETRE_ETOUFFEE"): "P6",
    }
    reps = {"RASSUREE": (2.0, 2.0), "EN_QUETE": (3.0, 2.0),
            "SUR_LA_RA": (2.0, 3.0)}
    labels_reels = _labels_reels()
    for lab_attendu, lab_reel in zip(ATTENDU_LABELS, labels_reels.values()):
        if lab_reel != lab_attendu:
            res["labels_reels_ecarts"] += 1
    for face, (ra, rb) in reps.items():
        if core_q5.face_dominante(ra, rb) != face:
            res["table_pas_ecarts"] += 1
        for lab, emp in LABELS_EMP_CANON:
            sel = core_q5.selectionner_pas(ra, rb, lab)
            res["table_pas"] += 1
            if sel["pas"] != table_indep[(face, emp)] or sel["empreinte"] != emp:
                res["table_pas_ecarts"] += 1

    # (d) compactation pas ≡ (face, empreinte) — 784 paires × 3 empreintes
    cellules = {}
    for kA in SOMMES:
        sA = round(kA / 9.0, 2)
        for kB in SOMMES:
            sB = round(kB / 9.0, 2)
            face = core_q5.face_dominante(sA, sB)
            for lab, emp in LABELS_EMP_CANON:
                pas = core_q5.selectionner_pas(sA, sB, lab)["pas"]
                cle = (face, emp)
                if cle in cellules and cellules[cle] != pas:
                    res["compaction_pas_ecarts"] += 1
                cellules[cle] = pas
                res["compaction_pas"] += 1
    res["pas_par_cellule"] = {f"{f}×{e}": p for (f, e), p in sorted(cellules.items())}

    # (e) suivi 15 valeurs — frontières 6/7 et 8/9, 0 sanction
    def cat_attendue(j):
        if j >= core_q5.SEUIL_CELEBRE:
            return "CELEBRE"
        if j >= core_q5.SEUIL_AJUSTEMENT:
            return "AJUSTEMENT"
        return "REPRISE"

    for j in range(15):
        s = core_q5.suivre_14_jours(j)
        res["suivi_jours"] += 1
        if s["categorie"] != cat_attendue(j):
            res["suivi_ecarts"] += 1
        if s["sanction"] is not None:
            res["suivi_sanctions"] += 1
    if not (core_q5.suivre_14_jours(6)["categorie"] == "REPRISE"
            and core_q5.suivre_14_jours(7)["categorie"] == "AJUSTEMENT"
            and core_q5.suivre_14_jours(8)["categorie"] == "AJUSTEMENT"
            and core_q5.suivre_14_jours(9)["categorie"] == "CELEBRE"):
        res["suivi_ecarts"] += 1
    # bords non entiers — comportement RÉEL du cœur, consigné (le cœur
    # traite le non-entier/négatif comme 0 et clampe à 14) :
    bords = [core_q5.suivre_14_jours(None)["categorie"] == "REPRISE",
             core_q5.suivre_14_jours(-3)["categorie"] == "REPRISE",
             core_q5.suivre_14_jours(20)["categorie"] == "CELEBRE",
             core_q5.suivre_14_jours(7.5)["categorie"] == "REPRISE"]
    res["suivi_bords_ecarts"] = bords.count(False)

    # (f) espions — variantes de labels · jours jamais lus par le pas ·
    # la face seule NE SUFFIT PAS
    variantes = {
        "ZONE CALME": ["zone calme", "ZONE  CALME", "  Zone Calme  ",
                       "ZONE_CALME"],
        "PEUR DE PERDRE": ["peur de perdre", "PEUR  DE  PERDRE",
                           "Peur De Perdre"],
        "PEUR D'ÊTRE ÉTOUFFÉE": ["peur d'être étouffée", "PEUR D'ETRE ETOUFFEE",
                                 "Peur d'être étouffée"],
    }
    for base, vs in variantes.items():
        ref = core_q5.empreinte(base)
        for v in vs:
            res["espion_labels"] += 1
            if core_q5.empreinte(v) != ref:
                res["espion_labels_ecarts"] += 1
    sel_ref = core_q5.selectionner_pas(3.0, 2.0, "PEUR DE PERDRE")
    for j in (0, 7, 14):
        res["espion_jours"] += 1
        if core_q5.selectionner_pas(3.0, 2.0, "PEUR DE PERDRE")["pas"] \
                != sel_ref["pas"]:
            res["espion_jours_ecarts"] += 1
    # même face (SUR_LA_RA — sB ≥ 2,61), paliers différents : la face seule
    # NE SUFFIT PAS — la lecture palier est sur les axes bruts (consigné)
    f1 = core_q5.face_dominante(2.0, 2.7)
    f2 = core_q5.face_dominante(3.0, 2.7)
    p1 = corr.palier_axes(2.0, 2.7)["palier"]
    p2 = corr.palier_axes(3.0, 2.7)["palier"]
    res["face_vs_palier"] += 1
    if not (f1 == f2 == "SUR_LA_RA" and p1 == "🟠" and p2 == "🔴"):
        res["face_vs_palier_ecarts"] += 1

    # (g) empreinte — les 8 labels du flux vers les 3 valeurs (mesuré)
    for lab in LABELS_FLUX:
        res["empreinte_map"][repr(lab)] = core_q5.empreinte(lab)

    # (h) type ≡ classe (hautA, hautB) sur 784 paires — junction couple
    # compactée ; écarts de boucle réalisables sur l'espace réel
    pcts = set()
    for kA in SOMMES:
        sA = round(kA / 9.0, 2)
        hautA = core_q5.face_dominante(sA, 1.0) == "EN_QUETE"
        for kB in SOMMES:
            sB = round(kB / 9.0, 2)
            hautB = core_q5.face_dominante(1.0, sB) == "SUR_LA_RA"
            t = core_q4.type_attachement(sA, sB)
            attendu = ("EN_ALERTFEU" if (hautA and hautB)
                       else "PREOCCUPE" if hautA
                       else "DETACHE" if hautB else "SEREIN")
            res["type_compaction"] += 1
            if t != attendu:
                res["type_compaction_ecarts"] += 1
            pcts.add(core_q4.convertir_percentile(sA, sB))
    res["pct_valeurs"] = sorted(pcts)
    ecarts_boucle = set()
    for a in sorted(pcts):
        for b in sorted(pcts):
            ecarts_boucle.add(abs(a - b))
    res["boucle_ecarts_reels"] = sorted(ecarts_boucle)
    res["boucle_frontiere_bas"] = core_q4.boucle_poursuite_retrait(54.9, 25)["boucle_probable"]
    res["boucle_frontiere_haut"] = core_q4.boucle_poursuite_retrait(55.0, 25)["boucle_probable"]

    # (j) fallback P1 — atteignable HORS flux uniquement (appel direct de
    # la table avec clés arbitraires — consigné ; le flux est prouvé
    # propre au stage 1)
    res["fallback_hors_flux"] = core_q5._PAS_TABLE.get(("INCONNU", "INCONNU"), "P1")

    # (k) re-test 8 semaines — date exacte, jamais forcé
    rt = core_q5.programmer_re_test_q1("2026-01-01", semaines=8)
    res["retest_ok"] = (rt["date_re_test"].startswith("2026-02-26")
                        and rt["force"] is False and rt["semaines"] == 8)
    return res


# ─────────────────────────────────────────────────────────────────────────────
# STAGE 1 — ÉNUMÉRATION EXHAUSTIVE (784 × 8 × 15 × 5 = 470 400)
# ─────────────────────────────────────────────────────────────────────────────
def stage1() -> dict:
    stats = {
        "configs": 0,
        "fragments": 0, "fragment_incomplets": 0,
        "cor2_ecarts": 0, "junction_s1s2_ecarts": 0,
        "paliers": {"🟢": 0, "🟠": 0, "🔴": 0},
        "S1": 0, "S2": 0,
        "pas_distribution": {p: 0 for p in core_q5.PAS_BANQUE},
        "categories": {"CELEBRE": 0, "AJUSTEMENT": 0, "REPRISE": 0},
        "sanctions_non_nulles": 0,
        "fallback_flux": 0, "pas_hors_banque": 0, "trace_ecarts": 0,
        "textes_distincts": 0, "mots_interdits_max": 0,
        "dsim_manquants": 0, "templates_cites_ecarts": 0,
        "templates_verbatim_ecarts": 0,
        "blocs_couple": 0, "blocs_couple_interdits": 0,
        "chemins_couple_mono": 0, "chemins_couple_bi": 0,
        "junctions_couple_non_nommees": 0,
    }
    cache_texte = {}
    retest = core_q5.programmer_re_test_q1("2026-01-01", semaines=8)

    for kA in R_KA:
        sA = round(kA / 9.0, 2)
        for kB in R_KB:
            sB = round(kB / 9.0, 2)
            pal = corr.palier_axes(sA, sB)
            pal_i = corr.palier_independant(kA, kB)
            if (pal["palier"] != pal_i["palier"] or pal["S1"] != pal_i["S1"]
                    or pal["S2"] != pal_i["S2"]):
                stats["cor2_ecarts"] += 1
            # junctions couple : les 4 classes réelles de l'autre rive
            couples = [None] + [
                corr.lecture_couple(sA, sB, ra2, rb2)
                for ra2, rb2 in RIVES_2]
            for couple in couples:
                if couple is not None:
                    if couple["configuration"] not in core_q4.CONFIGS_9:
                        stats["junctions_couple_non_nommees"] += 1
                for label in LABELS_FLUX:
                    pas_sel = core_q5.selectionner_pas(sA, sB, label)
                    pas = pas_sel["pas"]
                    if pas not in core_q5.PAS_BANQUE:
                        stats["pas_hors_banque"] += 1
                    # fallback : la paire (face, empreinte) produite par le
                    # flux est ABSENTE de la VRAIE table → le cœur sert P1
                    # par défaut. Doit rester 0 sur tout le flux.
                    if (pas_sel["face"], pas_sel["empreinte"]) \
                            not in core_q5._PAS_TABLE:
                        stats["fallback_flux"] += 1
                    if (pas_sel["trace"]["Q1_face"]
                            != core_q5.face_dominante(sA, sB)
                            or pas_sel["trace"]["Q2_empreinte"]
                            != core_q5.empreinte(label)):
                        stats["trace_ecarts"] += 1
                    for jours in R_JOURS:
                        suivi = core_q5.suivre_14_jours(jours)
                        stats["configs"] += 1
                        stats["categories"][suivi["categorie"]] += 1
                        if suivi["sanction"] is not None:
                            stats["sanctions_non_nulles"] += 1
                        if pal["S1"] != (pal["palier"] == "🔴") \
                                or pal["S2"] != (pal["palier"] == "🟠"):
                            stats["junction_s1s2_ecarts"] += 1
                        stats["paliers"][pal["palier"]] += 1
                        if pal["S1"]:
                            stats["S1"] += 1
                        if pal["S2"]:
                            stats["S2"] += 1
                        stats["pas_distribution"][pas] += 1
                        if couple is None:
                            stats["chemins_couple_mono"] += 1
                        else:
                            stats["chemins_couple_bi"] += 1
                        # texte (cache palier × pas × catégorie — le texte
                        # est une fonction pure de ces 3 variables)
                        cle_t = (pal["palier"], pas, suivi["categorie"])
                        bloc = cache_texte.get(cle_t)
                        if bloc is None:
                            b = corr.bloc_ecran(pas_sel, suivi, pal,
                                                retest["message"])
                            verbatim_ok = all((
                                ("> " + core_q5.TEMPLATES_PAS[pas]) in b["texte"],
                                ("> " + core_q5.TEMPLATES_SUIVI[
                                    suivi["categorie"]]) in b["texte"],
                                all(("> " + core_q5.rappel_doux(
                                    j, pas_sel["label"])) in b["texte"]
                                    for j in (1, 7, 14)),
                                ("> " + retest["message"]) in b["texte"],
                            ))
                            bloc = (b["md5"], b["nb_mots_interdits"],
                                    BANDEAU_OK in b["texte"],
                                    b["nb_templates_cites"], verbatim_ok)
                            cache_texte[cle_t] = bloc
                        _, nb_mots, dsim_ok, nb_cites, verbatim_ok = bloc
                        if nb_mots > stats["mots_interdits_max"]:
                            stats["mots_interdits_max"] = nb_mots
                        if not dsim_ok:
                            stats["dsim_manquants"] += 1
                        if nb_cites != 6:
                            stats["templates_cites_ecarts"] += 1
                        if not verbatim_ok:
                            stats["templates_verbatim_ecarts"] += 1
                        # fragment (complet sur les DEUX chemins couple)
                        frag = corr.bilan_fragment(
                            pas_sel, suivi, pal, retest,
                            {"sA": sA, "sB": sB, "label_ombre": label},
                            couple=couple)
                        stats["fragments"] += 1
                        if not frag["_complet"]:
                            stats["fragment_incomplets"] += 1

    # blocs couple distincts (fonction pure de (classe rive 1, classe rive 2)
    # — compactation prouvée au stage 0) : balayage complet 4 × 4
    reps_classe = [(1.11, 1.11), (3.0, 1.11), (1.11, 3.0), (3.0, 3.0)]
    for sa1, sb1 in reps_classe:
        for sa2, sb2 in reps_classe:
            c = corr.lecture_couple(sa1, sb1, sa2, sb2)
            stats["blocs_couple"] += 1
            if corr._texte_sain(json.dumps(c, ensure_ascii=False)) > 0:
                stats["blocs_couple_interdits"] += 1
            if c["direction"] != corr.DIRECTION_NOTE \
                    or any(d in json.dumps(c) for d in corr.DIRECTIONS_CACHEES):
                stats["blocs_couple_interdits"] += 1

    stats["textes_distincts"] = len(cache_texte)
    stats["configs_attendues"] = (len(list(R_KA)) * len(list(R_KB))
                                  * len(LABELS_FLUX) * len(list(R_JOURS))
                                  * (1 + len(RIVES_2)))
    return stats


# ─────────────────────────────────────────────────────────────────────────────
# STAGE 2 — RE-SCORE BIT-EXACT DES 180 PROFILS ARCHIVÉS (VRAI simulateur 42)
# ─────────────────────────────────────────────────────────────────────────────
ARCHIVE_N_TOTAL = 180
ATTENDU_RESUME = {"CELEBRE": 60, "AJUSTEMENT": 60, "REPRISE": 60}


def stage2() -> dict:
    sim = _sim_frais()          # D-REPRO — re-exécution FRAISE à chaque passage
    res = {
        "profils": 0, "comparaisons": 0, "ecarts": [],
        "c1_match": 0, "c2_match": 0, "c2_groupe_match": 0,
        "c3_celebre": 0, "c3_ajustement": 0, "c3_reprise": 0,
        "c3_sanctions": 0, "anti_ok": None,
        "c6_programmed": 0,
        "paliers": {"🟢": 0, "🟠": 0, "🔴": 0}, "S1": 0, "S2": 0,
        "fragments_archives": 0, "fragments_incomplets": 0,
        "dsim_archives": 0, "mots_interdits_max": 0,
        "templates_cites_ecarts": 0,
        "resume": {},
    }
    profils = sim.tous_les_profils()
    res["profils"] = len(profils)
    res["comparaisons"] += 1
    if res["profils"] != ARCHIVE_N_TOTAL:
        res["ecarts"].append({"champ": "n_total", "calcule": res["profils"],
                              "archive": ARCHIVE_N_TOTAL})
    for p in profils:
        gid = p["groupe"]
        res["resume"][gid] = res["resume"].get(gid, 0) + 1
        # VRAI moteur :
        pas_sel = core_q5.selectionner_pas(p["sA"], p["sB"], p["label_ombre"])
        suivi = core_q5.suivre_14_jours(p["jours_tenus"])
        retest = core_q5.programmer_re_test_q1(p["date_pas"])
        # C1 — pas ≡ pas_vrai (D-VÉRITÉ, éliminatoire — pas, face, empreinte) :
        pv = sim.pas_vrai(p["sA"], p["sB"], p["label_ombre"])
        res["comparaisons"] += 3
        if (pas_sel["pas"] == pv["pas"] and pas_sel["face"] == pv["face"]
                and pas_sel["empreinte"] == pv["empreinte"]):
            res["c1_match"] += 1
        else:
            res["ecarts"].append({"id": p["id"], "champ": "c1_pas",
                                  "calcule": pas_sel["pas"]})
        # C2 — catégorie ≡ categorie_suivi_vraie (D-VÉRITÉ) ≡ groupe :
        res["comparaisons"] += 2
        if suivi["categorie"] == sim.categorie_suivi_vraie(p["jours_tenus"]):
            res["c2_match"] += 1
        else:
            res["ecarts"].append({"id": p["id"], "champ": "c2_categorie",
                                  "calcule": suivi["categorie"]})
        if suivi["categorie"] == ATTENDU_GROUPE[gid]:
            res["c2_groupe_match"] += 1
            if gid == "CELEBRE":
                res["c3_celebre"] += 1
            elif gid == "AJUSTEMENT":
                res["c3_ajustement"] += 1
            else:
                res["c3_reprise"] += 1
        if suivi["sanction"] is not None:
            res["c3_sanctions"] += 1
        # C6 — re-test 8 semaines :
        res["comparaisons"] += 1
        if retest["semaines"] == 8 and retest["force"] is False:
            res["c6_programmed"] += 1
        # COUCHE appliquée (axes continus du simulateur — le chemin float) :
        pal = corr.palier_axes(p["sA"], p["sB"])
        bloc = corr.bloc_ecran(pas_sel, suivi, pal, retest["message"])
        res["comparaisons"] += 3
        if BANDEAU_OK in bloc["texte"]:
            res["dsim_archives"] += 1
        res["mots_interdits_max"] = max(res["mots_interdits_max"],
                                        bloc["nb_mots_interdits"])
        if bloc["nb_templates_cites"] != 6:
            res["templates_cites_ecarts"] += 1
        frag = corr.bilan_fragment(pas_sel, suivi, pal, retest,
                                   {"sA": p["sA"], "sB": p["sB"],
                                    "label_ombre": p["label_ombre"]},
                                   couple=None)
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
    res["comparaisons"] += len(ATTENDU_RESUME) + 1
    if res["resume"] != ATTENDU_RESUME:
        res["ecarts"].append({"champ": "resume", "calcule": str(res["resume"]),
                              "archive": str(ATTENDU_RESUME)})
    res["anti_ok"] = bool(core_q5.verifier_anti_perfectionnisme()["ok"])
    return res


# ─────────────────────────────────────────────────────────────────────────────
# STAGE 4 — SUIVI + RE-TEST JAMAIS FORCÉ + RAPPELS + TABLE COUPLE
# ─────────────────────────────────────────────────────────────────────────────
def stage4() -> dict:
    suivi_ok = 0
    categories = set()
    for jours in range(15):
        s = core_q5.suivre_14_jours(jours)
        categories.add(s["categorie"])
        if s["sanction"] is None:
            suivi_ok += 1
    rt = core_q5.programmer_re_test_q1("2026-01-01", semaines=8)
    rt2 = core_q5.programmer_re_test_q1("2026-03-15", semaines=8)
    retest_ok = (rt["semaines"] == 8 and rt["force"] is False
                 and len(rt["message"]) > 20)
    retest_jamais_force = (rt["force"] is False and rt2["force"] is False)
    label_reel = core_q5.PAS_LABELS["P4"]
    rappels = {j: core_q5.rappel_doux(j, label_reel) for j in (1, 7, 14)}
    rappels_ok = all(label_reel in r for r in rappels.values()) \
        and len(rappels) == 3
    # la leçon D-Q5-1 est respectée par le VRAI marqueur (re-run) :
    rappels_doux_ok = bool(core_q5.verifier_rappels_doux()["ok"])
    configs_ok = all(core_q4.TEMPLATES_CONFIGS.get(c)
                     for c in core_q4.CONFIGS_9)
    return {
        "suivi_15_sans_sanction": suivi_ok,
        "suivi_categories": sorted(categories),
        "retest_8_semaines": retest_ok,
        "retest_jamais_force": retest_jamais_force,
        "rappels_doux_3": rappels_ok,
        "rappels_doux_marqueur_reel": rappels_doux_ok,
        "table_couple_9_configurations": configs_ok,
    }


# ─────────────────────────────────────────────────────────────────────────────
# STANDINGS — tous les textes fixes affichables (0 mot interdit)
# ─────────────────────────────────────────────────────────────────────────────
def standings() -> dict:
    textes = [corr.BANDEAU_DSIM, corr.PHRASE_ORIENTATION, corr.NOTE_PAS,
              corr.NOTE_PLANCHER, corr.clause_aide_standing(),
              corr.clause_orientation(), corr.clause_surveillance(),
              corr.MONO_MESURE, corr.BI_MESURE, corr.DIRECTION_NOTE,
              *corr.PALIER_NOM.values(), *corr.FACE_LABELS.values(),
              *corr.EMPREINTE_LABELS.values(),
              *core_q5.PAS_LABELS.values(), *core_q5.TEMPLATES_PAS.values(),
              *core_q5.TEMPLATES_SUIVI.values(),
              *core_q5.TEMPLATES_RAPPELS.values(),
              core_q5.programmer_re_test_q1("2026-01-01")["message"]]
    max_interdits = max(corr._texte_sain(t) for t in textes)
    return {
        "textes_fixes": len(textes),
        "mots_interdits_max": max_interdits,
        "orientation_canon_dans_phrase": "pas un échec" in corr.PHRASE_ORIENTATION,
        "seuil_epingle": (core_q5.face_dominante(2.61, 2.0) == "EN_QUETE"
                          and core_q5.face_dominante(2.60, 2.0) == "RASSUREE"),
    }


# ─────────────────────────────────────────────────────────────────────────────
# PIPELINE COMPLET (exécuté 2 fois pour COR8)
# ─────────────────────────────────────────────────────────────────────────────
def pipeline() -> dict:
    print("  stage 0 — compactations …", flush=True)
    s0 = stage0()
    print("  stage 1 — énumération exhaustive …", flush=True)
    s1 = stage1()
    print(f"    {s1['configs']} configurations · textes distincts "
          f"{s1['textes_distincts']} · fragments {s1['fragments']}", flush=True)
    print("  stage 2 — re-score bit-exact des 180 …", flush=True)
    s2 = stage2()
    print(f"    {s2['profils']} profils · {s2['comparaisons']} comparaisons "
          f"· écarts {len(s2['ecarts'])}", flush=True)
    print("  stage 4 — suivi + re-test + rappels + table couple …", flush=True)
    s4 = stage4()
    print(f"    suivi {s4['suivi_15_sans_sanction']}/15 · re-test "
          f"{s4['retest_8_semaines']}", flush=True)
    return {"stage0": s0, "stage1": s1, "stage2": s2, "stage4": s4,
            "standings": standings()}


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
    pas_atteints = sum(1 for v in s1["pas_distribution"].values() if v)

    criteres = {
        "COR0_compactations": {
            "definition": "compactations PROUVÉES exhaustivement : espace RÉEL des "
                          "axes déterminé par le VRAI code q1-r1 (4⁹ répartitions → "
                          "28 sommes sans trou 9-36, chaque somme vérifiée par le "
                          "VRAI scores_axes) · frontière 2,61 tranchée par le VRAI "
                          "face_dominante des DEUX côtés (NON PILE atteignable — "
                          "consigné, dist min mesurée — mais sans ambiguïté : "
                          "2,56 < 2,61 ≤ 2,67) · table pas 9/9 ≡ règle pure · "
                          "compaction pas ≡ (face, empreinte) 2 352 · suivi 15 "
                          "valeurs (frontières 6/7 et 8/9, 0 sanction, bords non "
                          "entiers consignés) · espions labels/jours · la face "
                          "seule NE SUFFIT PAS (consigné) · type ≡ classe sur 784 "
                          "· labels réels du VRAI nommage q2-r1 6/6 · fallback "
                          "hors flux consigné · re-test 2026-02-26 jamais forcé",
            "observe": f"sommes {s0['axes_sommes']} sans trou "
                       f"{s0['axes_sans_trou']} · valeurs axes {s0['axes_valeurs']} → "
                       f"écart scores_axes {s0['scores_axes_ecarts']} · bas max "
                       f"{s0['frontiere_bas_max']} < 2,61 ≤ haut min "
                       f"{s0['frontiere_haut_min']} · PILE 2,61 : "
                       f"{s0['pile_261']} (dist min {s0['dist_min_261']} — bas "
                       f"{s0['dist_bas']} / haut {s0['dist_haut']}) · tranchage "
                       f"écart {s0['tranchage_ecarts']} · table pas "
                       f"{s0['table_pas']} → écart {s0['table_pas_ecarts']} · "
                       f"compaction {s0['compaction_pas']} → écart "
                       f"{s0['compaction_pas_ecarts']} · suivi {s0['suivi_jours']} → "
                       f"écart {s0['suivi_ecarts']} · sanctions "
                       f"{s0['suivi_sanctions']} · bords écart "
                       f"{s0['suivi_bords_ecarts']} · espion labels "
                       f"{s0['espion_labels']} → écart {s0['espion_labels_ecarts']} · "
                       f"espion jours {s0['espion_jours']} → écart "
                       f"{s0['espion_jours_ecarts']} · face vs palier "
                       f"{s0['face_vs_palier']} → écart {s0['face_vs_palier_ecarts']} · "
                       f"type compaction {s0['type_compaction']} → écart "
                       f"{s0['type_compaction_ecarts']} · labels réels écart "
                       f"{s0['labels_reels_ecarts']} · boucle frontière "
                       f"{s0['boucle_frontiere_bas']}/"
                       f"{s0['boucle_frontiere_haut']} (écarts réels "
                       f"{s0['boucle_ecarts_reels']}) · fallback hors flux "
                       f"'{s0['fallback_hors_flux']}' · re-test {s0['retest_ok']}",
            "pass": (s0["axes_sans_trou"] is True
                     and s0["scores_axes_ecarts"] == 0
                     and s0["frontiere_bas_max"] < SEUIL <= s0["frontiere_haut_min"]
                     and s0["tranchage_ecarts"] == 0
                     and s0["table_pas_ecarts"] == 0
                     and s0["compaction_pas_ecarts"] == 0
                     and s0["suivi_ecarts"] == 0
                     and s0["suivi_sanctions"] == 0
                     and s0["suivi_bords_ecarts"] == 0
                     and s0["espion_labels_ecarts"] == 0
                     and s0["espion_jours_ecarts"] == 0
                     and s0["face_vs_palier_ecarts"] == 0
                     and s0["type_compaction_ecarts"] == 0
                     and s0["labels_reels_ecarts"] == 0
                     and s0["retest_ok"] is True)},
        "COR1_fragment_complet": {
            "definition": f"{n}/{n} configurations (784 paires d'axes réelles × 8 "
                          "labels du flux × 15 jours × 5 chemins couple) → fragment "
                          "L8 7 blocs, 0 feuille vide sur les DEUX chemins (mono → "
                          "consignation explicite sans invention ; bi → VRAI "
                          "croisement RIO-04) + 180/180 profils archivés",
            "observe": f"{s1['fragments']}/{s1['fragments']} fragments · incomplets "
                       f"{s1['fragment_incomplets']} · mono {s1['chemins_couple_mono']} "
                       f"· bi {s1['chemins_couple_bi']} · configurations non nommées "
                       f"{s1['junctions_couple_non_nommees']} · archivés "
                       f"{s2['fragments_archives']}/{s2['profils']} · incomplets "
                       f"{s2['fragments_incomplets']}",
            "pass": (s1["fragment_incomplets"] == 0
                     and s1["configs"] == s1["configs_attendues"]
                     and s1["junctions_couple_non_nommees"] == 0
                     and s2["fragments_incomplets"] == 0
                     and s2["fragments_archives"] == s2["profils"] == 180)},
        "COR2_derivation_palier": {
            "definition": "double chemin : entiers purs (sommes ≥ 24 — la frontière "
                          "2,61 tombe STRICTEMENT entre les sommes 23 (2,56) et 24 "
                          "(2,67), prouvé au COR0) ≡ VRAI seuil 2,61 du cœur — "
                          "palier + S1 + S2 ; junctions S1 ⇔ 🔴, S2 ⇔ 🟠 exactement ; "
                          "PLANCHER consigné (axes reçus seuls — la vraie gravité "
                          "peut être plus haute, jamais plus basse) ; note : les sA/"
                          "sB des profils simulateur sont continus (D-PARAM σ 0,4) — "
                          "le chemin float est celui appliqué aux profils",
            "observe": f"{n} configs · écart double chemin {s1['cor2_ecarts']} · "
                       f"écart junction {s1['junction_s1s2_ecarts']}",
            "pass": (s1["cor2_ecarts"] == 0
                     and s1["junction_s1s2_ecarts"] == 0)},
        "COR3_seuils_aide": {
            "definition": "S1 = les DEUX axes ≥ 2,61 (VRAI littéral du cœur, le « en "
                          "alerte » de RIO-04) ; S2 = exactement UN axe ≥ 2,61 (tout "
                          "palier non-VERT est AUSSI un moment « demander de l'aide » "
                          "— leçon RIO-16) ; la couche n'ajoute aucun seuil numérique "
                          "(littéral épinglé au comportement réel à l'import) ; borne "
                          "2,61 NON PILE sur le grain réel (grain 1/9, arrondi 2 "
                          "décimales — dist min consignée) — tranchage sans ambiguïté",
            "observe": f"S1 {s1['S1']}/{n} · S2 {s1['S2']}/{n} · 🟢 "
                       f"{s1['paliers']['🟢']}/{n} · PILE 2,61 {s0['pile_261']} "
                       f"(dist min {s0['dist_min_261']} : {s0['frontiere_bas_max']} / "
                       f"{s0['frontiere_haut_min']}) · suivi seuils entiers exacts "
                       f"(≥ 9 CELEBRE · 7-8 AJUSTEMENT · ≤ 6 REPRISE) · frontière "
                       f"boucle 30,0 PILE inclusive testée "
                       f"({s0['boucle_frontiere_bas']}/"
                       f"{s0['boucle_frontiere_haut']})",
            "pass": (s1["junction_s1s2_ecarts"] == 0
                     and s1["S1"] + s1["S2"] + s1["paliers"]["🟢"] == n
                     and s0["pile_261"] == 0
                     and s0["boucle_frontiere_bas"] is False
                     and s0["boucle_frontiere_haut"] is True)},
        "COR4_vocabulaire_ecran": {
            "definition": "0 mot interdit (canon Partie 9 + liste anti-blâme RIO-04 + "
                          "directions cachées) sur tous les textes distincts + blocs "
                          "couple distincts + textes fixes, leçon D-Q5-1 respectée "
                          "(« pas une obligation » = anti-culpabilisant, jamais "
                          "compté), D-SIM 100 %",
            "observe": f"max mots interdits par texte = {s1['mots_interdits_max']} ; "
                       f"textes distincts = {s1['textes_distincts']} · blocs couple "
                       f"distincts {s1['blocs_couple']} → interdits "
                       f"{s1['blocs_couple_interdits']} · standings "
                       f"{r1['standings']['mots_interdits_max']}/"
                       f"{r1['standings']['textes_fixes']} textes fixes · D-SIM "
                       f"manquants {s1['dsim_manquants']} · archivés D-SIM "
                       f"{s2['dsim_archives']}/180 · max archivés "
                       f"{s2['mots_interdits_max']}",
            "pass": (s1["mots_interdits_max"] == 0
                     and s1["blocs_couple_interdits"] == 0
                     and r1["standings"]["mots_interdits_max"] == 0
                     and r1["standings"]["orientation_canon_dans_phrase"] is True
                     and s1["dsim_manquants"] == 0
                     and s2["dsim_archives"] == 180
                     and s2["mots_interdits_max"] == 0)},
        "COR5_anti_fabrication": {
            "definition": "le pas affiché ≡ VRAI selectionner_pas (trace Q1_face/"
                          "Q2_empreinte réelle) ; 6 templates réels cités par écran "
                          "(pas + suivi + 3 rappels + re-test), présence verbatim "
                          "vérifiée ; fallback P1 INATTEIGNABLE via le flux normal "
                          "(empreinte() normalise tout label vers les 3 valeurs, "
                          "face toujours ∈ 3 — les 9 paires sont dans _PAS_TABLE ; "
                          "atteignable HORS flux uniquement — appel direct de table, "
                          "consigné) ; JAMAIS de sanction (structurel)",
            "observe": f"templates cités : écart {s1['templates_cites_ecarts']} · "
                       f"verbatim écart {s1['templates_verbatim_ecarts']} · trace "
                       f"écart {s1['trace_ecarts']} · fallback flux "
                       f"{s1['fallback_flux']} (hors flux : "
                       f"'{s0['fallback_hors_flux']}') · pas hors banque "
                       f"{s1['pas_hors_banque']} · sanctions non nulles "
                       f"{s1['sanctions_non_nulles']} (énum) + {s2['c3_sanctions']} "
                       f"(archivés)",
            "pass": (s1["templates_cites_ecarts"] == 0
                     and s1["templates_verbatim_ecarts"] == 0
                     and s1["trace_ecarts"] == 0
                     and s1["fallback_flux"] == 0
                     and s1["pas_hors_banque"] == 0
                     and s1["sanctions_non_nulles"] == 0
                     and s2["c3_sanctions"] == 0
                     and s2["templates_cites_ecarts"] == 0)},
        "COR6_rescore_bit_exact": {
            "definition": "180 profils archivés q5 régénérés par le VRAI simulateur "
                          "seed 42 (3 groupes × 60 — CELEBRE 9-14 · AJUSTEMENT 7-8 · "
                          "REPRISE 0-6), re-exécuté FRAIS à chaque passage (D-REPRO) : "
                          "C1 180/180 pas ≡ pas_vrai (D-VÉRITÉ, éliminatoire — pas + "
                          "face + empreinte) · C2 180/180 catégories ≡ "
                          "categorie_suivi_vraie ≡ groupe · C3 60/60/60, 0 sanction, "
                          "anti-perfectionnisme ok · C6 re-test 8 semaines 180/180 — "
                          "puis couche appliquée aux 180 (chemin float)",
            "observe": f"{s2['profils']} profils · {s2['comparaisons']} comparaisons · "
                       f"écarts {len(s2['ecarts'])} · C1 {s2['c1_match']}/180 · C2 "
                       f"{s2['c2_match']}/180 ≡ groupe {s2['c2_groupe_match']}/180 · "
                       f"C3 CELEBRE {s2['c3_celebre']}/60 · AJUSTEMENT "
                       f"{s2['c3_ajustement']}/60 · REPRISE {s2['c3_reprise']}/60 · "
                       f"sanctions {s2['c3_sanctions']} · anti {s2['anti_ok']} · C6 "
                       f"{s2['c6_programmed']}/180 · paliers {s2['paliers']} · S1 "
                       f"{s2['S1']} · S2 {s2['S2']}",
            "pass": (len(s2["ecarts"]) == 0
                     and s2["profils"] == 180
                     and s2["c1_match"] == 180
                     and s2["c2_match"] == 180
                     and s2["c2_groupe_match"] == 180
                     and s2["c3_celebre"] == 60 and s2["c3_ajustement"] == 60
                     and s2["c3_reprise"] == 60
                     and s2["c3_sanctions"] == 0
                     and s2["anti_ok"] is True
                     and s2["c6_programmed"] == 180)},
        "COR7_couplage_pas": {
            "definition": "les 6 pas réels résolus par le VRAI selectionner_pas sur "
                          "l'espace complet des héritages (784 paires d'axes réelles "
                          "q1-r1 × 8 labels du flux q2-r1 — tous les héritages sont "
                          "mesurés par les quêtes amont RIO-01/RIO-02, jamais "
                          "devinés) ; suivi 14 j sans sanction 15/15 ; re-test 8 "
                          "semaines jamais forcé (2 dates) ; rappels doux J1/J7/J14 "
                          "réels + marqueur D-Q5-1 réel ; table couple 9 "
                          "configurations nommées",
            "observe": f"pas résolus {pas_atteints}/6 · distribution "
                       f"{json.dumps(s1['pas_distribution'], sort_keys=True)} · "
                       f"suivi {s4['suivi_15_sans_sanction']}/15 · re-test "
                       f"{s4['retest_8_semaines']} · jamais forcé "
                       f"{s4['retest_jamais_force']} · rappels "
                       f"{s4['rappels_doux_3']} · marqueur D-Q5-1 "
                       f"{s4['rappels_doux_marqueur_reel']} · table couple "
                       f"{s4['table_couple_9_configurations']}",
            "pass": (pas_atteints == 6
                     and s4["suivi_15_sans_sanction"] == 15
                     and s4["retest_8_semaines"] is True
                     and s4["retest_jamais_force"] is True
                     and s4["rappels_doux_3"] is True
                     and s4["rappels_doux_marqueur_reel"] is True
                     and s4["table_couple_9_configurations"] is True)},
        "COR8_reproductibilite": {
            "definition": "pipeline ×2 → SHA-256 identiques (simulateur re-exécuté "
                          "frais à chaque passage — D-REPRO)",
            "observe": f"{sha1[:16]}… == {sha2[:16]}… → {cor8}", "pass": cor8},
    }

    RES.mkdir(exist_ok=True)
    payload = {
        "package": "validation-q5/correction-philosophique",
        "cible": "RIO-05 « Mon premier pas »",
        "moteurs_reels": [
            "validation-q5/src/wtc_q5_core.py (pas + suivi 14 j + rappels + re-test)",
            "validation-q5/src/wtc_q5_simulator.py (seed 42, 180 profils, pas_vrai D-VÉRITÉ)",
            "validation-q1-r1/src/wtc_q1_core.py (VRAIS scores d'axes — grain 1/9)",
            "validation-q2-r1/src/wtc_q2_core.py (VRAIS labels d'ombre — nommage réel)",
            "validation-q4/src/wtc_q4_core.py (VRAI croisement de couple)",
            "validation-q4/correction-philosophique/src/wtc_q4_correction.py "
            "(palier de couple RIO-04, importé tel quel)"],
        "espace_enumeré": {
            "dimension": ("paires d'axes réelles q1-r1 (28 × 28 = 784) × labels du "
                          "flux q2-r1 (6 réels + None + inconnu = 8) × jours tenus "
                          "(15) × chemins couple (mono + 4 classes réelles de "
                          "l'autre rive = 5)"),
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
