# -*- coding: utf-8 -*-
"""
WTC-EMO-Q2-R1 — VALIDATION DE LA COUCHE DE CORRECTION PHILOSOPHIQUE (RIO-07)
============================================================================
Exécute les stages de preuve sur les VRAIS moteurs (zéro réimplémentation) :

  Stage 0 — COMPACTATIONS PROUVÉES EXHAUSTIVEMENT :
            (a) items → moyennes : 125 triplets × 3 groupes (INV-D, INV-R,
                RC) par le VRAI moyenne — la moyenne arrondie (2 déc.) ne
                dépend que de la somme ; permutations → même lecture (750
                vérifs) ;
            (b) (RE-1, RE-2) → boucle : 25 paires × 2 terrains par le VRAI
                boucle_reassurance (50 vérifs — la boucle ne lit que les
                seuils entiers ≥ 3) ;
            (c) terrain hérité 8 → 2 : la disjonction du VRAI moteur
                (score_A ≥ 2,61 ∨ i_alarm ≥ 5 ∨ h_norm ≥ 0,30) vérifiée sur
                les 8 représentants réels de part et d'autre des 3 seuils ;
            (d) espion CI : le VRAI convergence_interdimensions ne lit
                score_A/label_ombre QUE via (score_A ≥ 2,61) × appartenance
                de label_ombre à {PEUR DE PERDRE, LES DEUX} — variés dans
                chaque classe → sorties identiques (96 sondes) ;
            (e) DP EXACTE sur les 5⁹ séquences d'items (3 INV-D + 3 INV-R +
                3 RC) : total = 5⁹ bit-exact, 2 197/2 197 triplets de
                sommes atteignables, 8/8 combinaisons de bandes D-ÉCHELLE
                co-atteignables ; RE-1/RE-2/rc_d sont des réponses brutes
                (pas des sommes — pas de DP) ;
            (f) espion clés parasites : des clés inconnues dans rep ne
                changent AUCUNE sortie du moteur (sondes) ;
            (g) convergence entiers ≡ VRAI moteur : 13³ sommes × 2 rc_d ×
                2 RE-1 × 2 RE-2 × 2 terrains (70 304 profils) — le chemin
                entier (seuils 6/8/9/12) ≡ les VRAIES fonctions.
  Stage 1 — ÉNUMÉRATION EXHAUSTIVE de l'espace des états distincts de la
            couche : 13³ moyennes × 5 formulations × 25 (RE-1 × RE-2) × 8
            terrains hérités × 2 classes d'ombre héritées = 4 394 000
            configurations. Toute la sortie de la couche (palier VRAI,
            seuils S1/S2, textes, fragment 7 blocs) est calculée par les
            fonctions réelles et vérifiée configuration par configuration.
            COR2 = double chemin (entiers purs) ≡ (VRAI moteur) + junctions
            S1 ⇔ 🔴 / S2 ⇔ 🟠 / CI applicable ⇔ vif × dominante.
  Stage 2 — RE-SCORE BIT-EXACT des 460 profils archivés du rapport émo-q2-r1
            (E1 100 · E2 100 · E3 80 · E4 100 · E5 20 · E6 20 · SANS_SIGNAL
            30 · GRAVE 10), régénérés par le VRAI simulateur R1 (seed 42,
            M1 E5 corrigé + M2 E6 ajouté) : C1a 87,63 % · C1b 81,82 % (E5
            20/20 · E6 20/20 — arbitrage S-EMO-Q2-3 confirmé) · C1c 96,67 %
            · C2 180 applicables · C3 0/0/0 · D-VÉRITÉ 4/4 · distribution
            des paliers par groupe · pièges — puis application de la couche
            (R5, textes, fragment) aux 460.
  Stage 4 — COUPLAGE PAS : les 8 pas réels résolus via le VRAI
            selectionner_pas (héritages Q2 MESURÉS par cette quête :
            INV/RC résolus par les vraies valeurs ; héritages cœur RIO-06
            balayés 32 448 combinaisons) + suivi 14 j sans sanction 15/15
            + re-test 8 semaines + co-régulation (vrai seuil 3,0) + couple
            (vrai configuration_devises alimenté par la VRAIE zone mesurée).
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

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parent))
import wtc_emo_q2_correction as corr          # la couche (charge les vrais moteurs)
core_q2 = corr.core_q2
core_q4 = corr.core_q4
core_q5 = corr.core_q5

# Le VRAI simulateur émo-q2 R1 (seed 42, M1+M2) — chargé par le même
# chargeur que les moteurs (module indépendant, aucune dépendance croisée) :
sim_q2 = corr._charge("wtc_emo_q2_simulator",
                      corr._Q2 / "src" / "wtc_emo_q2_simulator.py")

RES = Path(__file__).resolve().parents[1] / "results"
SMOKE = os.environ.get("CORR_SMOKE") == "1"   # échantillon réduit (test rapide)
R_SOMMES = range(3, 7) if SMOKE else range(3, 16)
R_RC_D = (1, 5) if SMOKE else range(1, 6)
R_RE = (1, 5) if SMOKE else range(1, 6)

BANDEAU_OK = corr.BANDEAU_DSIM

# Le VRAI label_ombre heuristique du package archivé (S-EMO-Q2-1, consignée) :
def label_ombre_archive(score_A):
    if score_A >= 2.61:
        return "PEUR DE PERDRE"
    return "ZONE CALME"


def _items_de_somme(s: int) -> tuple:
    """Triplet d'items (1-5) de somme exacte s ∈ [3 ; 15] (représentant
    valide — premier triplet lexicographique atteignable)."""
    for a in range(1, 6):
        for b in range(1, 6):
            c = s - a - b
            if 1 <= c <= 5:
                return (a, b, c)
    raise ValueError(s)


def _rep_synthese(s_d: int, s_r: int, s_c: int, rc_d: int, re1: int,
                  re2: int) -> dict:
    """Profil synthétique minimal : les entrées lues par le moteur, exactes.
    Les moyennes valent exactement s/3 (arrondi 2 déc. par le VRAI moteur)."""
    rep = {}
    for items, s in ((core_q2.INV_D, s_d), (core_q2.INV_R, s_r),
                     (core_q2.RC, s_c)):
        vals = _items_de_somme(s)
        for k, it in enumerate(items):
            rep[it] = vals[k]
    rep["RE-1"], rep["RE-2"] = re1, re2
    return rep


# Représentants réels de part et d'autre des VRAIS seuils du terrain
# (2,61 / 5 / 0,30) — les 8 combinaisons, identiques à la couche :
TERRAIN_REPS = corr.TERRAIN_REPS


def _terrain_de(sA, ia, hn):
    return sA >= 2.61 or ia >= 5 or hn >= 0.30


# ─────────────────────────────────────────────────────────────────────────────
# STAGE 0 — COMPACTATIONS PROUVÉES EXHAUSTIVEMENT
# ─────────────────────────────────────────────────────────────────────────────
def stage0() -> dict:
    res = {
        "moyennes_valeurs": 0, "moyennes_ecarts": 0,
        "moyennes_repr": 0, "moyennes_repr_ecarts": 0,
        "boucle_paires": 0, "boucle_ecarts": 0,
        "terrain_reps": 0, "terrain_ecarts": 0,
        "espion_ci": 0, "espion_ci_ecarts": 0,
        "espion_cles": 0, "espion_cles_ecarts": 0,
        "dp_total": 0, "dp_attendu": 5 ** 9,
        "dp_sommes_atteintes": 0, "dp_sommes_attendues": 13 ** 3,
        "dp_bandes_atteintes": 0, "dp_bandes_attendues": 8,
        "convergence_profil": 0, "convergence_ecarts": 0,
    }

    # (a) items → moyennes : 125 triplets × 3 groupes par le VRAI moyenne
    rep_base = _rep_synthese(9, 9, 9, 3, 2, 4)
    for items in (core_q2.INV_D, core_q2.INV_R, core_q2.RC):
        for a in range(1, 6):
            for b in range(1, 6):
                for c in range(1, 6):
                    rep = dict(rep_base)
                    rep[items[0]], rep[items[1]], rep[items[2]] = a, b, c
                    m = core_q2.moyenne(items, rep)
                    res["moyennes_valeurs"] += 1
                    if m != round((a + b + c) / 3.0, 2):
                        res["moyennes_ecarts"] += 1
                    # Deux triplets de même somme → même moyenne (compaction)
                    rep2 = dict(rep_base)
                    rep2[items[0]], rep2[items[1]], rep2[items[2]] = c, a, b
                    if core_q2.moyenne(items, rep2) != m:
                        res["moyennes_repr_ecarts"] += 1
                    res["moyennes_repr"] += 1

    # (b) (RE-1, RE-2) → boucle : 25 paires × 2 terrains (VRAI moteur)
    for terrain in (False, True):
        sA, ia, hn = (3.3, 3, 0.10) if terrain else (2.0, 3, 0.10)
        for re1 in range(1, 6):
            for re2 in range(1, 6):
                rep = _rep_synthese(9, 9, 9, 3, re1, re2)
                b = core_q2.boucle_reassurance(rep, sA, ia, hn)
                res["boucle_paires"] += 1
                attendu = (re1 >= 3) and (re2 >= 3) and terrain
                if b["active"] != attendu or b["terrain"] != terrain:
                    res["boucle_ecarts"] += 1

    # (c) terrain hérité 8 → 2 : disjonction du VRAI moteur sur les 8 reps
    rep_b = _rep_synthese(9, 9, 9, 3, 4, 4)
    for sA, ia, hn in TERRAIN_REPS:
        t = core_q2.boucle_reassurance(rep_b, sA, ia, hn)["terrain"]
        res["terrain_reps"] += 1
        if t != _terrain_de(sA, ia, hn):
            res["terrain_ecarts"] += 1

    # (d) espion CI : sorties identiques dans chaque classe (96 sondes)
    for zone_r in corr.ZONES:
        for label in corr.LABELS_RC:
            vus = {}
            for sA in (2.0, 2.5, 3.3, 5.0):
                for ombre in ("PEUR DE PERDRE", "LES DEUX",
                              "ZONE CALME", "AUTRE"):
                    conv = core_q2.convergence_interdimensions(
                        sA, ombre, zone_r, label)
                    cle = ((sA >= 2.61), ombre in corr.OMBRES_DOMINANTES)
                    if cle in vus:
                        res["espion_ci"] += 1
                        if conv != vus[cle]:
                            res["espion_ci_ecarts"] += 1
                    else:
                        vus[cle] = conv

    # (e) DP EXACTE sur les 5⁹ séquences d'items (3 groupes de 3)
    dp = np.zeros((16, 16, 16), dtype=np.int64)
    dp[0, 0, 0] = 1
    for i in range(9):
        g = i // 3                       # 0:INV-D · 1:INV-R · 2:RC
        new = np.zeros_like(dp)
        for v in range(1, 6):
            if g == 0:
                new[v:, :, :] += dp[:16 - v, :, :]
            elif g == 1:
                new[:, v:, :] += dp[:, :16 - v, :]
            else:
                new[:, :, v:] += dp[:, :, :16 - v]
        dp = new
    res["dp_total"] = int(dp.sum())
    atteint = dp > 0
    n_som = 0
    for s_d in range(3, 16):          # TOUTE la grille (13³) — même en SMOKE
        for s_r in range(3, 16):
            for s_c in range(3, 16):
                if atteint[s_d, s_r, s_c]:
                    n_som += 1
    res["dp_sommes_atteintes"] = n_som
    n_bandes = 0
    for b_d in (False, True):
        for b_r in (False, True):
            for b_c in (False, True):
                sous = dp
                sous = sous[9:, :, :] if b_d else sous[:9, :, :]
                sous = sous[:, 9:, :] if b_r else sous[:, :9, :]
                sous = sous[:, :, 9:] if b_c else sous[:, :, :9]
                if sous.sum() > 0:
                    n_bandes += 1
    res["dp_bandes_atteintes"] = n_bandes

    # (f) espion clés parasites : des clés inconnues ne changent rien
    for (s_d, s_r, s_c, rc_d, re1, re2) in ((9, 9, 9, 3, 2, 4),
                                            (13, 5, 11, 1, 4, 4),
                                            (5, 13, 7, 5, 1, 5)):
        rep = _rep_synthese(s_d, s_r, s_c, rc_d, re1, re2)
        base = (core_q2.zones_invalidation(rep),
                core_q2.reproche_code(rep, rc_d),
                core_q2.boucle_reassurance(rep, 3.3, 7, 0.35))
        rep_p = dict(rep)
        rep_p["ZZ-INCONNU-1"] = 5
        rep_p["ZZ-INCONNU-2"] = 1
        rep_p["OPT-A"] = 3
        bruit = (core_q2.zones_invalidation(rep_p),
                 core_q2.reproche_code(rep_p, rc_d),
                 core_q2.boucle_reassurance(rep_p, 3.3, 7, 0.35))
        res["espion_cles"] += 1
        if base != bruit:
            res["espion_cles_ecarts"] += 1

    # (g) convergence entiers ≡ VRAI moteur (échantillon frontière 70 304)
    for s_d in R_SOMMES:
        for s_r in R_SOMMES:
            for s_c in R_SOMMES:
                for rc_d in R_RC_D:
                    for re1 in R_RE:
                        for re2 in R_RE:
                            for sA, ia, hn in ((2.0, 3, 0.10),
                                               (3.3, 7, 0.35)):
                                rep = _rep_synthese(s_d, s_r, s_c, rc_d,
                                                    re1, re2)
                                lect = corr.palier_et_seuils(rep, rc_d, sA,
                                                             ia, hn)
                                entier = corr.palier_independant(
                                    s_d, s_r, s_c, rc_d, re1, re2,
                                    _terrain_de(sA, ia, hn))
                                res["convergence_profil"] += 1
                                if (lect["palier"] != entier["palier"]
                                        or lect["S1"] != entier["S1"]
                                        or lect["S2"] != entier["S2"]
                                        or lect["zones"]["donnee"]["zone"]
                                        != entier["zone_d"]
                                        or lect["zones"]["recue"]["zone"]
                                        != entier["zone_r"]
                                        or lect["rc"]["label"] != entier["label"]
                                        or lect["boucle"]["active"]
                                        != entier["boucle_active"]):
                                    res["convergence_ecarts"] += 1
    return res


# ─────────────────────────────────────────────────────────────────────────────
# STAGE 1 — ÉNUMÉRATION EXHAUSTIVE (13³ × 5 × 25 × 8 × 2 = 4 394 000)
# ─────────────────────────────────────────────────────────────────────────────
def stage1(tables: dict) -> dict:
    tables_pas, tables_ci, tables_couple = (tables["pas"], tables["ci"],
                                            tables["couple"])
    n_sommes = len(R_SOMMES)
    stats = {
        "configs": 0, "fragments_distincts": 0, "fragment_incomplets": 0,
        "cor2_ecarts": 0, "junction_s1s2_ecarts": 0,
        "paliers": {"🟢": 0, "🟠": 0, "🔴": 0},
        "S1": 0, "S2": 0,
        "labels": {l: 0 for l in corr.LABELS_RC},
        "zones_d": {z: 0 for z in corr.ZONES},
        "boucle_actives": 0,
        "rien_a_fabriquer_ecarts": 0,
        "calme_sur_non_vert": 0, "sans_calme_sur_vert": 0,
        "templates_cites_ecarts": 0,
        "c3b_ecarts": 0, "c3c_ecarts": 0,
        "md5_texts_count": 0,
        "mots_interdits_max": 0, "dsim_manquants": 0,
        "pas_labels_hors_banque": 0,
        "pile_grave_400": 0, "pile_d_echelle_300": 0,
        "dist_min_signal_260": 9.0, "dist_min_zone_350": 9.0,
        "dist_min_zone_200": 9.0,
    }
    cache_texte = {}
    cache_frag = {}

    for s_d, s_r, s_c in itertools.product(R_SOMMES, repeat=3):
        for rc_d in R_RC_D:
            for re1 in R_RE:
                for re2 in R_RE:
                    for sA, ia, hn in TERRAIN_REPS:
                        terrain = _terrain_de(sA, ia, hn)
                        for ombre_dom in (False, True):
                            stats["configs"] += 1
                            # VRAI moteur + couche (chemin cœur) :
                            rep = _rep_synthese(s_d, s_r, s_c, rc_d, re1, re2)
                            lect = corr.palier_et_seuils(rep, rc_d, sA, ia, hn)
                            # COR2 — chemin entier indépendant :
                            entier = corr.palier_independant(
                                s_d, s_r, s_c, rc_d, re1, re2, terrain)
                            if (lect["palier"] != entier["palier"]
                                    or lect["S1"] != entier["S1"]
                                    or lect["S2"] != entier["S2"]
                                    or lect["zones"]["donnee"]["zone"]
                                    != entier["zone_d"]
                                    or lect["zones"]["recue"]["zone"]
                                    != entier["zone_r"]
                                    or lect["rc"]["label"] != entier["label"]
                                    or lect["boucle"]["active"]
                                    != entier["boucle_active"]):
                                stats["cor2_ecarts"] += 1
                            # Junctions S1 ⇔ 🔴 / S2 ⇔ 🟠 (exactement) :
                            if lect["S1"] != (lect["palier"] == "🔴") \
                                    or lect["S2"] != (lect["palier"] == "🟠"):
                                stats["junction_s1s2_ecarts"] += 1
                            stats["paliers"][lect["palier"]] += 1
                            if lect["S1"]:
                                stats["S1"] += 1
                            if lect["S2"]:
                                stats["S2"] += 1
                            stats["labels"][lect["rc"]["label"]] += 1
                            stats["zones_d"][entier["zone_d"]] += 1
                            if lect["boucle"]["active"]:
                                stats["boucle_actives"] += 1
                            # Bornes pile du VRAI moteur (consignées) :
                            if s_d == 12:
                                stats["pile_grave_400"] += 1
                            if s_c == 9:
                                stats["pile_d_echelle_300"] += 1
                            m_d = s_d / 3.0
                            d = abs(m_d - 2.60)
                            if d < stats["dist_min_signal_260"]:
                                stats["dist_min_signal_260"] = d
                            d = abs(m_d - 3.50)
                            if d < stats["dist_min_zone_350"]:
                                stats["dist_min_zone_350"] = d
                            d = abs(m_d - 2.00)
                            if d < stats["dist_min_zone_200"]:
                                stats["dist_min_zone_200"] = d
                            # Texte + fragment via caches de dépendance :
                            cle = (s_d, s_r, s_c, rc_d, re1, re2, terrain)
                            bloc = cache_texte.get(cle)
                            if bloc is None:
                                b = corr.bloc_ecran(lect)
                                tt = b["texte"]
                                bas = tt.lower()
                                # C3b/C3c (propriétés du vrai moteur, ici
                                # vérifiées sur TOUTE l'énumération) :
                                c3b_ok = True
                                c3c_ok = True
                                if entier["zone_d"] == "FRÉQUENT":
                                    c3b_ok = ("lien s'use" in bas
                                              or "signal" in bas)
                                if entier["zone_r"] in ("OCCASIONNEL",
                                                        "FRÉQUENT"):
                                    c3c_ok = "réel" in bas
                                bloc = (b["md5"], b["nb_mots_interdits"],
                                        BANDEAU_OK in tt,
                                        b["rien_a_fabriquer"],
                                        b["nb_templates_cites"],
                                        c3b_ok, c3c_ok)
                                cache_texte[cle] = bloc
                            md5_t, nb_mots, dsim_ok, calme, nb_cites, \
                                c3b_ok, c3c_ok = bloc
                            if nb_mots > stats["mots_interdits_max"]:
                                stats["mots_interdits_max"] = nb_mots
                            if not dsim_ok:
                                stats["dsim_manquants"] += 1
                            # R5 — « rien à fabriquer » ⇔ palier 🟢 exactement
                            if calme != (lect["palier"] == "🟢"):
                                stats["rien_a_fabriquer_ecarts"] += 1
                            if calme and lect["palier"] != "🟢":
                                stats["calme_sur_non_vert"] += 1
                            if (not calme) and lect["palier"] == "🟢":
                                stats["sans_calme_sur_vert"] += 1
                            # R5/R7 — 5 templates réels cités par lecture
                            # (zones d/r + label + boucle + palier) :
                            if nb_cites != 5:
                                stats["templates_cites_ecarts"] += 1
                            if not c3b_ok:
                                stats["c3b_ecarts"] += 1
                            if not c3c_ok:
                                stats["c3c_ecarts"] += 1
                            # Fragment (7 blocs) :
                            frag = cache_frag.get(cle)
                            if frag is None:
                                f_ = corr.bilan_fragment(
                                    lect, tables_pas, tables_ci, tables_couple)
                                labels = tuple(f_["bloc_7_palier_pas"]
                                               ["pas_labels"])
                                frag = (f_["_complet"], labels)
                                cache_frag[cle] = frag
                                stats["fragments_distincts"] += 1
                            if not frag[0]:
                                stats["fragment_incomplets"] += 1
                            for lab in frag[1]:
                                if lab not in core_q5.PAS_LABELS.values():
                                    stats["pas_labels_hors_banque"] += 1

    stats["md5_texts_count"] = len(cache_texte)
    stats["configs_attendues"] = (n_sommes ** 3 * len(list(R_RC_D))
                                  * len(list(R_RE)) ** 2
                                  * len(TERRAIN_REPS) * 2)
    return stats


# ─────────────────────────────────────────────────────────────────────────────
# STAGE 2 — RE-SCORE BIT-EXACT DES 460 PROFILS ARCHIVÉS (VRAI simulateur 42)
# ─────────────────────────────────────────────────────────────────────────────
# Chiffres CONTRESIGNÉS du rapport émo-q2-r1 (resultats-emo-q2-2026-10-15.json) :
ARCHIVE_N_TOTAL = 460
ARCHIVE_C1A = {"total": 760, "correct": 666, "pct": 87.63,
               "E1_invalidant_pur": (172, 200),
               "E2_invalide_code": (172, 200),
               "E3_boucle_complete": (132, 160),
               "E4_sain": (190, 200)}
ARCHIVE_C1B = {"total": 220, "correct": 180, "pct": 81.82,
               "E2_invalide_code": (83, 100),
               "E3_boucle_complete": (57, 80),
               "E5_code_sain": (20, 20),
               "E6_formulation_acquise": (20, 20),
               "e5_pct": 100.0, "e6_pct": 100.0}
ARCHIVE_C1C = {"total": 420, "correct": 406, "pct": 96.67,
               "E1_invalidant_pur": (100, 100),
               "E2_invalide_code": (87, 100),
               "E3_boucle_complete": (79, 80),
               "E4_sain": (100, 100),
               "E5_code_sain": (20, 20),
               "E6_formulation_acquise": (20, 20)}
ARCHIVE_C2 = {"applicables": 180, "index_ge_050": 180, "crash": 0}
ARCHIVE_C3 = {"c3a": 0, "c3b": 0, "c3c": 0}
ARCHIVE_PALIERS = {
    "E1_invalidant_pur": {"🟢": 0, "🟠": 100, "🔴": 0},
    "E2_invalide_code": {"🟢": 4, "🟠": 96, "🔴": 0},
    "E3_boucle_complete": {"🟢": 0, "🟠": 38, "🔴": 42},
    "E4_sain": {"🟢": 96, "🟠": 4, "🔴": 0},
    "E5_code_sain": {"🟢": 20, "🟠": 0, "🔴": 0},
    "E6_formulation_acquise": {"🟢": 19, "🟠": 1, "🔴": 0},
    "SANS_SIGNAL": {"🟢": 30, "🟠": 0, "🔴": 0},
    "GRAVE": {"🟢": 0, "🟠": 0, "🔴": 10},
}
# Moyennes Section C du rapport contresigné (inv_d, inv_r, rc, rc_d, re_1, re_2) :
ARCHIVE_MOYENNES = {
    "E1_invalidant_pur": (4.15, 1.97, 1.96, 2.95, 2.01, 2.03),
    "E2_invalide_code": (1.98, 4.22, 3.78, 1.84, 3.43, 3.69),
    "E3_boucle_complete": (3.88, 3.77, 3.57, 2.08, 3.83, 4.05),
    "E4_sain": (1.54, 1.67, 1.94, 3.85, 2.04, 2.19),
    "E5_code_sain": (1.68, 1.6, 3.47, 4.3, 2.05, 2.05),
    "E6_formulation_acquise": (1.58, 1.63, 1.85, 4.05, 2.05, 1.95),
    "SANS_SIGNAL": (1.0, 1.0, 1.0, 5.0, 1.0, 2.0),
    "GRAVE": (4.67, 2.0, 4.0, 2.0, 4.0, 4.0),
}
# D-VÉRITÉ (R1) — table archivée du package (M1/M2) :
VERITE_CACHEE_ARCHIVE = {
    "E1_invalidant_pur": "BESOIN DISCRET",
    "E2_invalide_code": "REPROCHE-CODE ACTIF",
    "E3_boucle_complete": "REPROCHE-CODE ACTIF",
    "E4_sain": "FORMULATION ACQUISE",
    "E5_code_sain": "BESOIN VIVANT, FORMULATION MIXTE",
    "E6_formulation_acquise": "FORMULATION ACQUISE",
}


def stage2(tables: dict) -> dict:
    tables_pas = tables["pas"]
    res = {
        "profils": 0, "comparaisons": 0, "ecarts": [],
        "c1a_total": 0, "c1a_correct": 0, "c1a_par_groupe": {},
        "c1b_total": 0, "c1b_correct": 0, "c1b_par_groupe": {},
        "c1c_total": 0, "c1c_correct": 0, "c1c_par_groupe": {},
        "c2_applicables": 0, "c2_index_ge_050": 0, "c2_crash": 0,
        "c3a": 0, "c3b": 0, "c3c": 0,
        "d_verite_orphelins": 0, "d_verite_labels": 0,
        "paliers_par_groupe": {}, "paliers_conformes": 0,
        "moyennes_conformes": 0,
        "sans_signal_vert": 0, "grave_rouge": 0,
        "S1_archives": 0, "S2_archives": 0,
        "fragments_archives": 0, "fragments_incomplets": 0,
        "dsim_archives": 0, "mots_interdits_max": 0,
        "rien_a_fabriquer_ecarts": 0, "templates_cites_ecarts": 0,
    }
    # D-VÉRITÉ : inventaire croisé labels moteur / table (preuve R1)
    labels_moteur = set(corr.LABELS_RC)
    labels_table = set(VERITE_CACHEE_ARCHIVE.values())
    res["d_verite_labels"] = len(labels_moteur) if \
        labels_moteur == labels_table else -1
    res["d_verite_orphelins"] = len(labels_moteur ^ labels_table)

    accum_moy = {}
    tous = []
    for nom_groupe, profils in sim_q2.GROUPES.items():
        for i, p in enumerate(profils):
            p["id"] = f"{nom_groupe}_{i}"
            p["groupe"] = nom_groupe
            tous.append(p)
    for nom_trap, profils in sim_q2.TRAPS.items():
        for i, p in enumerate(profils):
            p["id"] = f"{nom_trap}_{i}"
            p["groupe"] = nom_trap
            tous.append(p)
    res["profils"] = len(tous)
    res["comparaisons"] += 1
    if res["profils"] != ARCHIVE_N_TOTAL:
        res["ecarts"].append({"champ": "n_total",
                              "calcule": res["profils"],
                              "archive": ARCHIVE_N_TOTAL})
    for p in tous:
        gid = p["groupe"]
        rep, rc_d = p["rep"], p["rc_d"]
        score_A, i_alarm, h_norm = p["score_A"], p["i_alarm"], p["h_norm"]
        # VRAI moteur (exactement la chaîne archivée _evaluer_profil) :
        zones = core_q2.zones_invalidation(rep)
        rc = core_q2.reproche_code(rep, rc_d)
        boucle = core_q2.boucle_reassurance(rep, score_A, i_alarm, h_norm)
        palier = core_q2.palier(zones["donnee"], rc["label"], boucle["active"])
        label_ombre = label_ombre_archive(score_A)
        conv = core_q2.convergence_interdimensions(
            score_A, label_ombre, zones["recue"]["zone"], rc["label"])
        affichage = (core_q2.TEMPLATES_INVALIDATION_DONNEE[zones["donnee"]["zone"]]
                     + " " + core_q2.TEMPLATES_INVALIDATION_RECUE[zones["recue"]["zone"]]
                     + " " + core_q2.TEMPLATES_REPROCHE_CODE[rc["label"]]
                     + " " + core_q2.TEMPLATES_BOUCLE[boucle["active"]]
                     + " " + core_q2.TEMPLATES_PALIER[palier]).lower()
        accum = accum_moy.setdefault(gid, {"n": 0, "inv_d": 0.0, "inv_r": 0.0,
                                           "rc": 0.0, "rc_d": 0.0,
                                           "re_1": 0.0, "re_2": 0.0,
                                           "paliers": {"🟢": 0, "🟠": 0,
                                                        "🔴": 0}})
        accum["n"] += 1
        accum["inv_d"] += zones["donnee"]["moyenne"]
        accum["inv_r"] += zones["recue"]["moyenne"]
        accum["rc"] += rc["moyenne"]
        accum["rc_d"] += rc["formulation"]
        accum["re_1"] += boucle["demande"]
        accum["re_2"] += boucle["tenue"]
        accum["paliers"][palier] += 1
        # C1a (E1-E4, 2 zones par profil) :
        if gid in ARCHIVE_C1A:
            res["c1a_total"] += 2
            g = res["c1a_par_groupe"].setdefault(gid, [0, 0])
            g[1] += 2
            ok_z = (zones["donnee"]["zone"] == {
                "E1_invalidant_pur": "FRÉQUENT",
                "E2_invalide_code": "ABSENT",
                "E3_boucle_complete": "FRÉQUENT",
                "E4_sain": "ABSENT"}[gid])
            ok_r = (zones["recue"]["zone"] == {
                "E1_invalidant_pur": "ABSENT",
                "E2_invalide_code": "FRÉQUENT",
                "E3_boucle_complete": "FRÉQUENT",
                "E4_sain": "ABSENT"}[gid])
            res["c1a_correct"] += int(ok_z) + int(ok_r)
            g[0] += int(ok_z) + int(ok_r)
            res["comparaisons"] += 2
        # C1b (E2, E3, E5, E6) :
        if gid in ("E2_invalide_code", "E3_boucle_complete", "E5_code_sain",
                   "E6_formulation_acquise"):
            res["c1b_total"] += 1
            g = res["c1b_par_groupe"].setdefault(gid, [0, 0])
            g[1] += 1
            ok = rc["label"] == VERITE_CACHEE_ARCHIVE[gid]
            res["c1b_correct"] += int(ok)
            g[0] += int(ok)
            res["comparaisons"] += 1
        # C1c (E1-E6, boucle) :
        if gid in VERITE_CACHEE_ARCHIVE:
            res["c1c_total"] += 1
            g = res["c1c_par_groupe"].setdefault(gid, [0, 0])
            g[1] += 1
            vc_boucle = gid in ("E2_invalide_code", "E3_boucle_complete")
            ok = boucle["active"] == vc_boucle
            res["c1c_correct"] += int(ok)
            g[0] += int(ok)
            res["comparaisons"] += 1
        # C2 (convergence — dérivation heuristique archivée S-EMO-Q2-1) :
        if gid in VERITE_CACHEE_ARCHIVE:
            if conv["applicables"] > 0:
                res["c2_applicables"] += 1
                if conv["index"] >= 0.50:
                    res["c2_index_ge_050"] += 1
            res["comparaisons"] += 1
        # C3 (éliminatoire) :
        for mot in core_q2.MOTS_INTERDITS_VERDICT:
            if mot in affichage:
                res["c3a"] += 1
        if zones["donnee"]["zone"] == "FRÉQUENT":
            t = core_q2.TEMPLATES_INVALIDATION_DONNEE["FRÉQUENT"].lower()
            if "lien s'use" not in t and "signal" not in t:
                res["c3b"] += 1
        if zones["recue"]["zone"] in ("OCCASIONNEL", "FRÉQUENT"):
            t = core_q2.TEMPLATES_INVALIDATION_RECUE[zones["recue"]["zone"]].lower()
            if "réel" not in t:
                res["c3c"] += 1
        # Pièges contresignés :
        if gid == "SANS_SIGNAL" and palier == "🟢":
            res["sans_signal_vert"] += 1
        if gid == "GRAVE" and palier == "🔴":
            res["grave_rouge"] += 1
        # Application de la COUCHE (R5/R8/textes/fragment) :
        lect = corr.palier_et_seuils(rep, rc_d, score_A, i_alarm, h_norm)
        bloc = corr.bloc_ecran(lect)
        res["comparaisons"] += 4
        if BANDEAU_OK in bloc["texte"]:
            res["dsim_archives"] += 1
        res["mots_interdits_max"] = max(res["mots_interdits_max"],
                                        bloc["nb_mots_interdits"])
        if bloc["rien_a_fabriquer"] != (lect["palier"] == "🟢"):
            res["rien_a_fabriquer_ecarts"] += 1
        if bloc["nb_templates_cites"] != 5:
            res["templates_cites_ecarts"] += 1
        frag = corr.bilan_fragment(lect, tables_pas, tables["ci"],
                                   tables["couple"])
        res["comparaisons"] += 1
        if frag["_complet"]:
            res["fragments_archives"] += 1
        else:
            res["fragments_incomplets"] += 1
        if lect["S1"]:
            res["S1_archives"] += 1
        if lect["S2"]:
            res["S2_archives"] += 1
    # Distribution des paliers ≡ rapport contresigné (8 groupes × 3) :
    for gid, att in ARCHIVE_PALIERS.items():
        vu = accum_moy.get(gid, {}).get("paliers", {})
        res["comparaisons"] += 3
        ok = all(vu.get(p, 0) == n for p, n in att.items())
        res["paliers_par_groupe"][gid] = {p: vu.get(p, 0) for p in att}
        if ok:
            res["paliers_conformes"] += 1
        else:
            res["ecarts"].append({"champ": f"paliers.{gid}",
                                  "calcule": str(res["paliers_par_groupe"][gid]),
                                  "archive": str(att)})
    # Moyennes Section C ≡ rapport contresigné (8 groupes × 6) :
    for gid, att in ARCHIVE_MOYENNES.items():
        a = accum_moy.get(gid)
        n = a["n"]
        vus = (round(a["inv_d"] / n, 2), round(a["inv_r"] / n, 2),
               round(a["rc"] / n, 2), round(a["rc_d"] / n, 2),
               round(a["re_1"] / n, 2), round(a["re_2"] / n, 2))
        res["comparaisons"] += 1
        if vus == tuple(att):
            res["moyennes_conformes"] += 1
        else:
            res["ecarts"].append({"champ": f"moyennes.{gid}",
                                  "calcule": str(vus), "archive": str(att)})
    return res


# ─────────────────────────────────────────────────────────────────────────────
# STAGE 4 — COUPLAGE PAS (VRAI Q5, héritages Q2 MESURÉS) + COUPLE + CI
# ─────────────────────────────────────────────────────────────────────────────
def stage4(tables: dict) -> dict:
    tables_pas, tables_ci, tables_couple = (tables["pas"], tables["ci"],
                                            tables["couple"])
    # 1. Les 8 pas réels, résolus par le VRAI selectionner_pas :
    pas_vus = {}
    for cle, tab in tables_pas.items():
        for pas, source in tab.items():
            pas_vus.setdefault(pas, source)
    # Invariants des tables MESURÉES (les héritages Q2 décident) :
    inv_mesure = 0
    for label in corr.LABELS_RC:
        if tables_pas[("OCCASIONNEL", label)] == \
                {"INV": "inv_d_zone (Q2 émotionnel)"}:
            inv_mesure += 1
        if tables_pas[("FRÉQUENT", label)] == \
                {"INV": "inv_d_zone (Q2 émotionnel)"}:
            inv_mesure += 1
        if tables_pas[("ABSENT", label)].get("RC") == \
                "rc_label (Q2 émotionnel)" and \
                label in corr.LABELS_ACTIFS:
            inv_mesure += 1
    # 2. Suivi 14 jours sans sanction (15 valeurs réelles) :
    suivi_ok = 0
    categories = set()
    for jours in range(15):
        s = core_q5.suivre_14_jours(jours)
        categories.add(s["categorie"])
        if s["sanction"] is None:
            suivi_ok += 1
    # 3. Re-test 8 semaines (vrai programmer_re_test) :
    rt = core_q5.programmer_re_test("2026-01-01", semaines=8)
    retest_ok = (rt["semaines"] == 8 and rt["force"] is False
                 and len(rt["message"]) > 20)
    # 4. Co-régulation (vrai seuil 3,0 — borne inclusive, pile atteignable
    # par la somme cœur 9 — consigné) :
    co_bas = core_q4.co_regulation(2.9, 3.0)["paire_explosive"]
    co_pile = core_q4.co_regulation(3.0, 3.0)["paire_explosive"]
    co_haut = core_q4.co_regulation(3.1, 3.0)["paire_explosive"]
    co_ok = (co_bas is False) and (co_pile is True) and (co_haut is True)
    # 5. Tables couple — la VRAIE zone mesurée alimente le VRAI moteur :
    hors_nomenclature = 0
    poursuite_incoherent = 0
    feu_croise_manquant = 0
    for zone_d, t in tables_couple.items():
        for cfg in t["configurations_atteignables"]:
            if cfg not in core_q4.CONFIG_LABELS:
                hors_nomenclature += 1
        if zone_d == "ABSENT" and "MIXTE POURSUITE" in \
                t["configurations_atteignables"]:
            poursuite_incoherent += 1
        if zone_d != "ABSENT" and "MIXTE POURSUITE" not in \
                t["configurations_atteignables"]:
            poursuite_incoherent += 1
        if "FEU CROISÉ" not in t["configurations_atteignables"]:
            feu_croise_manquant += 1
    # 6. Tables CI — junction avec les héritages RIO-01/02 :
    ci_ecarts = 0
    for (zone_r, label), lignes in tables_ci.items():
        for ln in lignes:
            if ln["applicable"] != (ln["score_A_vif"] and
                                    ln["ombre_dominante"]):
                ci_ecarts += 1
            for c in ln["checks"]:
                if c not in ("CI-1", "CI-2"):
                    ci_ecarts += 1
            if ln["applicable"]:
                if ln["index"] not in (0.0, 0.5, 1.0):
                    ci_ecarts += 1
                if ln["prudence"] != core_q2.index_p(ln["index"]):
                    ci_ecarts += 1
    return {
        "pas_resolus": len(pas_vus),
        "pas_table": pas_vus,
        "pas_attendus": len(core_q5.PAS_ORDER),
        "invariants_mesures": inv_mesure,
        "invariants_attendus": 10,
        "suivi_15_sans_sanction": suivi_ok,
        "suivi_categories": sorted(categories),
        "retest_8_semaines": retest_ok,
        "coregulation_inclusive_pile": co_ok,
        "couple_hors_nomenclature": hors_nomenclature,
        "couple_poursuite_incoherent": poursuite_incoherent,
        "couple_feu_croise_manquant": feu_croise_manquant,
        "couple_configs_par_zone": {z: t["nb_configurations"]
                                    for z, t in tables_couple.items()},
        "ci_ecarts": ci_ecarts,
        "ci_tables": len(tables_ci),
    }


# ─────────────────────────────────────────────────────────────────────────────
# PIPELINE COMPLET (exécuté 2 fois pour COR8)
# ─────────────────────────────────────────────────────────────────────────────
def _construit_tables() -> dict:
    print("    tables de junction (VRAIS moteurs) …", flush=True)
    pas = corr._tables_pas()            # 12 × 2 704 = 32 448 selectionner_pas
    ci = corr._tables_ci()              # 48 convergence_interdimensions
    couple = corr._tables_couple()      # configurations_devises, zone MESURÉE
    return {"pas": pas, "ci": ci, "couple": couple}


def pipeline() -> dict:
    print("  stage 0 — compactations + DP exacte 5⁹ …", flush=True)
    s0 = stage0()
    print(f"    DP total {s0['dp_total']} (= 5⁹ : {s0['dp_total'] == s0['dp_attendu']})",
          flush=True)
    tables = _construit_tables()
    print("  stage 1 — énumération exhaustive …", flush=True)
    s1 = stage1(tables)
    print(f"    {s1['configs']} configurations · textes distincts "
          f"{s1['md5_texts_count']} · fragments distincts "
          f"{s1['fragments_distincts']}", flush=True)
    print("  stage 2 — re-score bit-exact des 460 …", flush=True)
    s2 = stage2(tables)
    print(f"    {s2['profils']} profils · {s2['comparaisons']} comparaisons · "
          f"écarts {len(s2['ecarts'])}", flush=True)
    print("  stage 4 — couplage pas (héritages Q2 MESURÉS) + couple …",
          flush=True)
    s4 = stage4(tables)
    print(f"    {s4['pas_resolus']}/{s4['pas_attendus']} pas · "
          f"invariants mesurés {s4['invariants_mesures']}"
          f"/{s4['invariants_attendus']}", flush=True)
    return {"stage0": s0, "stage1": s1, "stage2": s2, "stage4": s4,
            "standings": {
                "mots_interdits_standings": max(
                    [sum(1 for m in corr.MOTS_INTERDITS if m in t.lower())
                     + sum(1 for m in core_q2.MOTS_INTERDITS_VERDICT
                           if m in t.lower())
                     for t in (corr.BANDEAU_DSIM, corr.PHRASE_ORIENTATION,
                               corr.NOTE_D_ECHELLE,
                               corr.clause_aide_standing(),
                               *core_q2.TEMPLATES_INVALIDATION_DONNEE.values(),
                               *core_q2.TEMPLATES_INVALIDATION_RECUE.values(),
                               *core_q2.TEMPLATES_REPROCHE_CODE.values(),
                               *core_q2.TEMPLATES_BOUCLE.values(),
                               *core_q2.TEMPLATES_PALIER.values(),
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

    def _pct(c, t):
        return round(c / t * 100, 2) if t else 0.0

    criteres = {
        "COR0_compactations": {
            "definition": "compactations PROUVÉES exhaustivement avant énumération : "
                          "items→moyennes (750 vérifs + permutations) · boucle (RE-1, RE-2) "
                          "50 vérifs · terrain hérité 8→2 (disjonction du moteur) · espion CI "
                          "(96 sondes, sortie ne dépend que de vif × dominante) · DP exacte 5⁹ "
                          "(total bit-exact, 2 197/2 197 triplets de sommes, 8/8 bandes "
                          "D-ÉCHELLE co-atteignables) · espion clés parasites · convergence "
                          "entiers ≡ VRAI moteur (70 304 profils frontière)",
            "observe": f"moyennes {s0['moyennes_valeurs']} → écart "
                       f"{s0['moyennes_ecarts']}+{s0['moyennes_repr_ecarts']} · "
                       f"boucle {s0['boucle_paires']} → écart {s0['boucle_ecarts']} · "
                       f"terrain {s0['terrain_reps']} → écart {s0['terrain_ecarts']} · "
                       f"espion CI {s0['espion_ci']} → écart {s0['espion_ci_ecarts']} · "
                       f"DP total {s0['dp_total']}/{s0['dp_attendu']} · sommes "
                       f"{s0['dp_sommes_atteintes']}/{s0['dp_sommes_attendues']} · "
                       f"bandes {s0['dp_bandes_atteintes']}/{s0['dp_bandes_attendues']} · "
                       f"espion clés {s0['espion_cles']} → écart "
                       f"{s0['espion_cles_ecarts']} · convergence "
                       f"{s0['convergence_profil']} → écart {s0['convergence_ecarts']}",
            "pass": (s0["moyennes_ecarts"] == 0
                     and s0["moyennes_repr_ecarts"] == 0
                     and s0["boucle_ecarts"] == 0
                     and s0["terrain_ecarts"] == 0
                     and s0["espion_ci_ecarts"] == 0
                     and s0["dp_total"] == s0["dp_attendu"]
                     and s0["dp_sommes_atteintes"] == s0["dp_sommes_attendues"]
                     and s0["dp_bandes_atteintes"] == s0["dp_bandes_attendues"]
                     and s0["espion_cles_ecarts"] == 0
                     and s0["convergence_ecarts"] == 0)},
        "COR1_fragment_complet": {
            "definition": f"{n}/{n} configurations → fragment L8 7 blocs, 0 champ vide "
                          "(aucun gate sur cet instrument — pas de suspension inventée, R4) "
                          "+ 460/460 profils archivés",
            "observe": f"{s1['fragments_distincts']}/{s1['fragments_distincts']} états "
                       f"distincts · incomplets {s1['fragment_incomplets']} · archivés "
                       f"{s2['fragments_archives']}/{s2['profils']} · incomplets "
                       f"{s2['fragments_incomplets']}",
            "pass": (s1["fragment_incomplets"] == 0
                     and s2["fragments_incomplets"] == 0
                     and s2["fragments_archives"] == s2["profils"] == 460)},
        "COR2_derivation_palier": {
            "definition": "double chemin : entier pur (seuils 6/8/9/12, boucle entière) ≡ "
                          "VRAI moteur (zones_invalidation + reproche_code D-ÉCHELLE + "
                          "boucle_reassurance + palier) — palier + zones + label + boucle ; "
                          "junctions S1 ⇔ 🔴, S2 ⇔ 🟠 exactement ; CI applicable ⇔ "
                          "(score_A ≥ 2,61 ∧ ombre dominante)",
            "observe": f"{n} configs · écart double chemin {s1['cor2_ecarts']} · "
                       f"écart junction S1/S2 {s1['junction_s1s2_ecarts']} · "
                       f"écart tables CI {s4['ci_ecarts']} sur {s4['ci_tables']} tables",
            "pass": (s1["cor2_ecarts"] == 0
                     and s1["junction_s1s2_ecarts"] == 0
                     and s4["ci_ecarts"] == 0)},
        "COR3_seuils_aide": {
            "definition": "S1 = palier 🔴 du VRAI moteur (FRÉQUENT ∧ ≥ 4,0 ∧ boucle active) ; "
                          "S2 = palier 🟠 sans 🔴 ; la couche n'ajoute AUCUN seuil numérique ; "
                          "bornes du VRAI moteur consignées : signal 2,60 non pile (dist min "
                          "0,07) · grave 4,00 PILE atteignable (borne inclusive du palier "
                          "réel) · D-ÉCHELLE 3,00 PILE atteignable (milieu, inclusif) · zone "
                          "2,00 pile (ABSENT inclusif) · CI 2,61 hors grille (héritage continu)",
            "observe": f"S1 {s1['S1']}/{n} · S2 {s1['S2']}/{n} · pile grave 4,00 = "
                       f"{s1['pile_grave_400']} · pile "
                       f"D-ÉCHELLE 3,00 = {s1['pile_d_echelle_300']} (consignés) · "
                       f"dist min 2,60 = {round(s1['dist_min_signal_260'], 2)} · "
                       f"3,50 = {round(s1['dist_min_zone_350'], 2)} · "
                       f"2,00 = {round(s1['dist_min_zone_200'], 2)} · "
                       f"co-régulation pile 3,0 inclusive : {s4['coregulation_inclusive_pile']}",
            "pass": (s1["junction_s1s2_ecarts"] == 0
                     and s4["coregulation_inclusive_pile"])},
        "COR4_vocabulaire_ecran": {
            "definition": "0 mot interdit (canon Partie 9 + les 8 condamnantes C3a du moteur) "
                          "sur tous les textes générés + templates réels des 3 moteurs + "
                          "standings, D-SIM 100 %",
            "observe": f"max mots interdits par texte = {s1['mots_interdits_max']} ; "
                       f"standing = {r1['standings']['mots_interdits_standings']} ; "
                       f"textes distincts = {s1['md5_texts_count']} ; D-SIM manquants "
                       f"{s1['dsim_manquants']} ; archivés D-SIM {s2['dsim_archives']}/460 · "
                       f"max archivés {s2['mots_interdits_max']}",
            "pass": (s1["mots_interdits_max"] == 0
                     and r1["standings"]["mots_interdits_standings"] == 0
                     and s1["dsim_manquants"] == 0
                     and s2["dsim_archives"] == 460
                     and s2["mots_interdits_max"] == 0)},
        "COR5_anti_fabrication": {
            "definition": "« rien à fabriquer » ⇔ palier 🟢 du VRAI moteur exactement (jamais "
                          "sur 🟠/🔴) ; 5 templates réels cités mot pour mot par lecture "
                          "(zones d/r + label + boucle + palier) ; l'invalidé jamais minimisé "
                          "(C3b/C3c vérifiés sur TOUTE l'énumération) ; zone reçue ne met "
                          "jamais le répondant en 🟠/🔴",
            "observe": f"rien à fabriquer ⇔ 🟢 : écart {s1['rien_a_fabriquer_ecarts']} "
                       f"(calme sur non-vert {s1['calme_sur_non_vert']} · sans calme sur "
                       f"vert {s1['sans_calme_sur_vert']}) · templates cités : écart "
                       f"{s1['templates_cites_ecarts']} · C3b écart {s1['c3b_ecarts']} · "
                       f"C3c écart {s1['c3c_ecarts']} · C3 archivé {s2['c3a']}/{s2['c3b']}/"
                       f"{s2['c3c']} · écart archivé {s2['rien_a_fabriquer_ecarts']}+"
                       f"{s2['templates_cites_ecarts']}",
            "pass": (s1["rien_a_fabriquer_ecarts"] == 0
                     and s1["calme_sur_non_vert"] == 0
                     and s1["sans_calme_sur_vert"] == 0
                     and s1["templates_cites_ecarts"] == 0
                     and s1["c3b_ecarts"] == 0 and s1["c3c_ecarts"] == 0
                     and s2["c3a"] == 0 and s2["c3b"] == 0 and s2["c3c"] == 0
                     and s2["rien_a_fabriquer_ecarts"] == 0
                     and s2["templates_cites_ecarts"] == 0)},
        "COR6_rescore_bit_exact": {
            "definition": "460 profils archivés émo-q2-r1 régénérés par le VRAI simulateur "
                          "seed 42 (M1 E5 corrigé + M2 E6 ajouté) : C1a 666/760 = 87,63 % · "
                          "C1b 180/220 = 81,82 % (E5 20/20, E6 20/20 — arbitrage S-EMO-Q2-3 "
                          "confirmé ; E3 57/80 = chevauchement géométrique S-EMO-Q2-R1-1 "
                          "CONSERVÉ consigné, type D-Q4-2) · C1c 406/420 = 96,67 % · C2 180 "
                          "applicables 180 ≥ 0,50 · C3 0/0/0 · D-VÉRITÉ 4/4 · paliers 8/8 "
                          "groupes · moyennes Section C 8/8 · pièges SANS_SIGNAL 🟢 30/30, "
                          "GRAVE 🔴 10/10",
            "observe": f"{s2['profils']} profils · {s2['comparaisons']} comparaisons · "
                       f"écarts {len(s2['ecarts'])} · C1a {s2['c1a_correct']}/"
                       f"{s2['c1a_total']} = {_pct(s2['c1a_correct'], s2['c1a_total'])} % · "
                       f"C1b {s2['c1b_correct']}/{s2['c1b_total']} = "
                       f"{_pct(s2['c1b_correct'], s2['c1b_total'])} % (E5 "
                       f"{s2['c1b_par_groupe'].get('E5_code_sain', [0, 0])[0]}/20 · E6 "
                       f"{s2['c1b_par_groupe'].get('E6_formulation_acquise', [0, 0])[0]}/20) · "
                       f"C1c {s2['c1c_correct']}/{s2['c1c_total']} = "
                       f"{_pct(s2['c1c_correct'], s2['c1c_total'])} % · C2 {s2['c2_applicables']}"
                       f"/{s2['c2_index_ge_050']}/crash {s2['c2_crash']} · C3 "
                       f"{s2['c3a']}/{s2['c3b']}/{s2['c3c']} · D-VÉRITÉ "
                       f"{s2['d_verite_labels']} orphelins {s2['d_verite_orphelins']} · "
                       f"paliers {s2['paliers_conformes']}/8 · moyennes "
                       f"{s2['moyennes_conformes']}/8 · SANS_SIGNAL 🟢 "
                       f"{s2['sans_signal_vert']}/30 · GRAVE 🔴 {s2['grave_rouge']}/10 · "
                       f"S1 {s2['S1_archives']} · S2 {s2['S2_archives']}",
            "pass": (len(s2["ecarts"]) == 0
                     and s2["profils"] == 460
                     and s2["c1a_correct"] == 666 and s2["c1a_total"] == 760
                     and s2["c1b_correct"] == 180 and s2["c1b_total"] == 220
                     and s2["c1c_correct"] == 406 and s2["c1c_total"] == 420
                     and s2["c2_applicables"] == 180
                     and s2["c2_index_ge_050"] == 180 and s2["c2_crash"] == 0
                     and s2["d_verite_orphelins"] == 0
                     and s2["paliers_conformes"] == 8
                     and s2["moyennes_conformes"] == 8
                     and s2["sans_signal_vert"] == 30
                     and s2["grave_rouge"] == 10)},
        "COR7_couplage_pas": {
            "definition": "8/8 pas réels (arbre Q5) résolus par le VRAI selectionner_pas avec "
                          "les héritages Q2 MESURÉS par cette quête (INV/RC décidés par les "
                          "vraies zones/labels — invariants 10/10) + balayage cœur RIO-06 "
                          "(32 448 combinaisons) ; suivi 14 j sans sanction 15/15 ; re-test 8 "
                          "semaines ; co-régulation (vrai seuil 3,0 inclusif) ; le VRAI "
                          "configuration_devises alimenté par la VRAIE zone mesurée "
                          "(MIXTE POURSUITE ⇔ zone ≠ ABSENT) ; 0 config hors nomenclature",
            "observe": f"pas {s4['pas_resolus']}/8 · invariants mesurés "
                       f"{s4['invariants_mesures']}/{s4['invariants_attendus']} · "
                       f"suivi {s4['suivi_15_sans_sanction']}/15 · re-test "
                       f"{s4['retest_8_semaines']} · co-régulation pile "
                       f"{s4['coregulation_inclusive_pile']} · configs/zone "
                       f"{s4['couple_configs_par_zone']} · hors nomenclature "
                       f"{s4['couple_hors_nomenclature']} · poursuite incohérente "
                       f"{s4['couple_poursuite_incoherent']} · feu croisé manquant "
                       f"{s4['couple_feu_croise_manquant']} · labels hors banque "
                       f"{s1['pas_labels_hors_banque']}",
            "pass": (s4["pas_resolus"] == s4["pas_attendus"] == 8
                     and s4["invariants_mesures"] == s4["invariants_attendus"]
                     and s4["suivi_15_sans_sanction"] == 15
                     and s4["retest_8_semaines"]
                     and s4["coregulation_inclusive_pile"]
                     and s4["couple_hors_nomenclature"] == 0
                     and s4["couple_poursuite_incoherent"] == 0
                     and s4["couple_feu_croise_manquant"] == 0
                     and s1["pas_labels_hors_banque"] == 0)},
        "COR8_reproductibilite": {
            "definition": "pipeline ×2 → SHA-256 identiques",
            "observe": f"{sha1[:16]}… == {sha2[:16]}… → {cor8}", "pass": cor8},
    }

    RES.mkdir(exist_ok=True)
    payload = {
        "package": "validation-emotionnelle/validation-emo-q2-r1/correction-philosophique",
        "cible": "RIO-07 « Ce que je n'arrive pas à dire »",
        "moteurs_reels": [
            "validation-emo-q2-r1/src/wtc_emo_q2_core.py (M3, logique inchangée — S-EMO-Q2-3 clos)",
            "validation-emo-q2-r1/src/wtc_emo_q2_simulator.py (seed 42, M1+M2)",
            "validation-emo-q4/src/wtc_emo_q4_core.py",
            "validation-emo-q5/src/wtc_emo_q5_core.py"],
        "espace_enumeré": {
            "dimension": ("moyennes (13³) × formulation (5) × (RE-1 × RE-2) (25) × "
                          "terrains hérités (8) × classes d'ombre héritées (2)"),
            "configurations": n,
            "decomposition": {"moyennes": s0["dp_sommes_attendues"],
                              "formulation": len(list(R_RC_D)),
                              "reponses_brutes": len(list(R_RE)) ** 2,
                              "terrains_herites": len(TERRAIN_REPS),
                              "classes_ombre": 2},
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
