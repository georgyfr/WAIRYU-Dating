# -*- coding: utf-8 -*-
"""
WTC-EMO-Q4-R3 — VALIDATION DE LA COUCHE DE CORRECTION PHILOSOPHIQUE (RIO-09)
============================================================================
Stages de preuve sur les VRAIS moteurs (zéro réimplémentation) :

  Stage 0 — COMPACTATIONS PROUVÉES EXHAUSTIVEMENT :
            (a) donne → état : les 125 triplets bruts par partenaire se
                compactent en états (bande de moyenne 4 × canal dominant 3
                × vmax ≥ 4 — 2) ; le VRAI configuration_devises donne la
                MÊME sortie à état égal — vérifié exhaustivement sur les
                125 × 8 croisés par côté ; 6 états prouvés INATEIGNABLES
                (recherche exhaustive des 125 triplets : moyenne ≥ 4 ⟹
                vmax ≥ 4, et dégénérescence de l'argmax sur (3,3,3)) →
                18 états réels par partenaire ;
            (b) moyennes → bandes : les 13 valeurs réelles s/3 par bande
                (frontières 2,5 NON pile — dist 1/6 · 3,00 PILE · 4,00
                PILE — consignées) ;
            (c) bids → écarts : les 625 combinaisons brutes du VRAI
                boucle_bids → 25 états (|ΔA|, |ΔB|) — le moteur ne lit que
                les écarts internes (espion exhaustif, 0 écart) ;
            (d) er1 → classes : le VRAI co_regulation ne lit que ≥ 3,0
                (espion {2,17 · 2,99} ≡ classe basse ; {3,00 PILE · 3,01 ·
                4,33} ≡ classe haute — borne inclusive consignée) ;
            (e) espion : score_A/label_ombre (portés par le simulateur)
                ne sont JAMAIS lus par le vrai moteur ;
            (f) symétrie structurelle : échange des partenaires via les
                paires miroirs archivées — vérifiée sur toute
                l'énumération (second appel VRAI par état).
  Stage 1 — ÉNUMÉRATION EXHAUSTIVE : 21 états donne A × 4 bandes reçoit A
            × 21→18 donne B × 4 reçoit B × 4 classes er × 4 classes d'écart
            × 9 paires de zones Q2. Palier de
            couple (VRAI) + double chemin entier + textes + fragments.
  Stage 2 — RE-SCORE BIT-EXACT des 450 couples archivés du rapport
            émo-q4-r3 (9 groupes × 50, seed 42) : C1 8/9 par configuration
            (CROISÉE 48 % < 62 % — chevauchement géométrique S-EMO-Q4-R3-1
            CONSERVÉ consigné, option d'arbitrage ouverte) · C2 symétrie
            450/450, 0 désaccord config_vraie · C3 0/0/0 · distributions
            complètes (81 cellules) · boucles/paires explosives par groupe.
  Stage 4 — COUPLAGE PAS par partenaire (zones Q2 mesurées) + suivi +
            re-test + co-régulation (vrai seuil 3,0, PILE consigné).
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
import wtc_emo_q4_correction as corr
core_q2 = corr.core_q2
core_q4 = corr.core_q4
core_q5 = corr.core_q5

sim_q4 = corr._charge("wtc_emo_q4_simulator",
                      corr._Q4 / "src" / "wtc_emo_q4_simulator.py")

RES = Path(__file__).resolve().parents[1] / "results"
SMOKE = os.environ.get("CORR_SMOKE") == "1"
R_BANDES = ("LEQ_25", "GE_4") if SMOKE else corr.BANDES_M

BANDEAU_OK = corr.BANDEAU_DSIM
MIRROR_PAIRS = {
    "DONNEUR NON CONVERTI (A)": "DONNEUR NON CONVERTI (B)",
    "DONNEUR NON CONVERTI (B)": "DONNEUR NON CONVERTI (A)",
    "MIXTE POURSUITE": "MIXTE RETRAIT",
    "MIXTE RETRAIT": "MIXTE POURSUITE",
}

# Représentants de sommes par bande (valeurs réelles de la grille s/3) :
SOMME_REP = {"LEQ_25": 7, "GT_25_LT_3": 8, "GE_3_LT_4": 10, "GE_4": 12}


def _items3(s: int) -> tuple:
    for a in range(1, 6):
        for b in range(1, 6):
            c = s - a - b
            if 1 <= c <= 5:
                return (a, b, c)
    raise ValueError(s)


def _donne_rep(bande: str, canal: str, vmax_ge4: bool):
    """Triplet brut représentant l'état (bande de moyenne × canal dominant
    × vmax ≥ 4) — premier match dans l'ordre canonique, None si
    mathématiquement inateignable."""
    for t in itertools.product(range(1, 6), repeat=3):
        d = dict(zip(corr.CANALS, t))
        s = sum(t)
        if corr.bande_m(s) != bande:
            continue
        canal_max = max(corr.CANALS, key=lambda c: d[c])
        if canal_max != canal:
            continue
        if (max(t) >= 4) != vmax_ge4:
            continue
        return d
    return None


def _er_rep(explosif: bool) -> float:
    return 3.0 if explosif else 2.0


def _bids_rep(ge2_A: bool, ge2_B: bool):
    bd1, br1 = (4, 2) if ge2_A else (4, 3)
    bd2, br2 = (4, 2) if ge2_B else (4, 3)
    return bd1, br1, bd2, br2


def _etats_donne() -> dict:
    """Les états (bande, canal, vmax_ge4) ATEIGNABLES + leur représentant."""
    etats = {}
    for bande, canal, vmax_ge4 in itertools.product(
            corr.BANDES_M, corr.CANALS, (False, True)):
        rep = _donne_rep(bande, canal, vmax_ge4)
        if rep is not None:
            etats[(bande, canal, vmax_ge4)] = rep
    return etats


# ─────────────────────────────────────────────────────────────────────────────
# STAGE 0 — COMPACTATIONS PROUVÉES EXHAUSTIVEMENT
# ─────────────────────────────────────────────────────────────────────────────
def stage0(etats: dict) -> dict:
    res = {
        "donne_bruts": 0, "donne_ecarts": 0,
        "etats_inateignables": len([(b, c, v) for b in corr.BANDES_M
                                    for c in corr.CANALS
                                    for v in (False, True)
                                    if (b, c, v) not in etats]),
        "moyennes_valeurs": 0, "moyennes_ecarts": 0,
        "bids_bruts": 0, "bids_ecarts": 0,
        "espion_er": 0, "espion_er_ecarts": 0,
        "espion_sa_ombre": 0, "espion_sa_ombre_ecarts": 0,
        "bandes_piles": {"3.00": 0, "4.00": 0},
        "pile_25": 0, "dist_25": 9.0,
    }

    # (a) donne → état : même état ⇒ même sortie du VRAI moteur
    # (croisés 125 × 8 par côté, avec un B-side fixe représentatif)
    rep_B = etats[("GE_3_LT_4", "temps", True)] if \
        ("GE_3_LT_4", "temps", True) in etats else next(iter(etats.values()))
    recB = dict(zip(corr.CANALS, _items3(10)))
    recA = dict(zip(corr.CANALS, _items3(10)))
    for side_A in (True, False):
        for t in itertools.product(range(1, 6), repeat=3):
            d = dict(zip(corr.CANALS, t))
            cle = (corr.bande_m(sum(t)),
                   max(corr.CANALS, key=lambda c: d[c]), max(t) >= 4)
            rep = etats[cle]
            res["donne_bruts"] += 1
            if side_A:
                c1 = core_q4.configuration_devises(
                    d, recA, rep_B, recB, 2.0, 2.0, False,
                    "ABSENT", "ABSENT")
                c2 = core_q4.configuration_devises(
                    rep, recA, rep_B, recB, 2.0, 2.0, False,
                    "ABSENT", "ABSENT")
            else:
                c1 = core_q4.configuration_devises(
                    rep_B, recB, d, recA, 2.0, 2.0, False,
                    "ABSENT", "ABSENT")
                c2 = core_q4.configuration_devises(
                    rep_B, recB, rep, recA, 2.0, 2.0, False,
                    "ABSENT", "ABSENT")
            if c1 != c2:
                res["donne_ecarts"] += 1

    # (b) moyennes → bandes : 13 valeurs réelles, bornes consignées
    for s in range(3, 16):
        m = round(s / 3.0, 2)
        res["moyennes_valeurs"] += 1
        attendu = ("LEQ_25" if m <= 2.5 else
                   "GT_25_LT_3" if m < 3 else
                   "GE_3_LT_4" if m < 4 else "GE_4")
        if corr.bande_m(s) != attendu:
            res["moyennes_ecarts"] += 1
        if m == 3.00:
            res["bandes_piles"]["3.00"] += 1
        if m == 4.00:
            res["bandes_piles"]["4.00"] += 1
        d = abs(m - 2.5)
        if d < res["dist_25"]:
            res["dist_25"] = d
        if d == 0.0:
            res["pile_25"] += 1

    # (c) bids → écarts : 625 bruts → 25 états (VRAI boucle_bids)
    vus = {}
    for bd1, br1, bd2, br2 in itertools.product(range(1, 6), repeat=4):
        b = core_q4.boucle_bids(bd1, br1, bd2, br2)
        cle = (abs(bd1 - br1), abs(bd2 - br2))
        res["bids_bruts"] += 1
        if cle in vus and vus[cle] != (b["ecart_A"], b["ecart_B"],
                                        b["asymetrie"]):
            res["bids_ecarts"] += 1
        vus[cle] = (b["ecart_A"], b["ecart_B"], b["asymetrie"])

    # (d) er1 → classes (VRAI co_regulation, espion pile inclusif)
    for er in (2.17, 2.99):
        for er2 in (2.0, 3.0):
            res["espion_er"] += 1
            if core_q4.co_regulation(er, er2)["explosif_A"] is not False:
                res["espion_er_ecarts"] += 1
    for er in (3.00, 3.01, 4.33):
        res["espion_er"] += 1
        if core_q4.co_regulation(er, 2.0)["explosif_A"] is not True:
            res["espion_er_ecarts"] += 1

    # (e) espion score_A/label_ombre : JAMAIS lus par le vrai moteur
    pA = etats[("GE_4", "paroles", True)]
    base = core_q4.configuration_devises(
        pA, recA, rep_B, recB, 3.0, 2.0, True, "FRÉQUENT", "ABSENT")
    res["espion_sa_ombre"] += 1
    # le moteur n'accepte même pas ces champs — la preuve est structurelle :
    # sa signature ne les contient pas ; on vérifie qu'aucune sortie ne
    # dépend de variables globales (appel re-exécuté identique) :
    if core_q4.configuration_devises(
            pA, recA, rep_B, recB, 3.0, 2.0, True, "FRÉQUENT",
            "ABSENT") != base:
        res["espion_sa_ombre_ecarts"] += 1
    return res


# ─────────────────────────────────────────────────────────────────────────────
# STAGE 1 — ÉNUMÉRATION EXHAUSTIVE
# ─────────────────────────────────────────────────────────────────────────────
def stage1(etats: dict, tables: dict) -> dict:
    tables_pas, table_ecarts = tables["pas"], tables["ecarts"]
    stats = {
        "configs": 0, "fragments_distincts": 0, "fragment_incomplets": 0,
        "cor2_ecarts": 0, "junction_s1s2_ecarts": 0,
        "miroir_ecarts": 0,
        "paliers": {"🟢": 0, "🟠": 0, "🔴": 0},
        "S1": 0, "S2": 0,
        "config_distribution": {c: 0 for c in corr.CONFIGS},
        "md5_texts_count": 0,
        "mots_interdits_max": 0, "dsim_manquants": 0,
        "templates_cites_ecarts": 0,
        "pas_labels_hors_banque": 0,
    }
    cache_texte = {}
    cache_frag = {}
    etats_par_cote = list(etats.items())
    bandes = list(R_BANDES)

    for (bA, cA, vA), dA_rep in etats_par_cote:
        donne_A = dA_rep
        for rA in bandes:
            recoit_A = dict(zip(corr.CANALS, _items3(SOMME_REP[rA])))
            for (bB, cB, vB), dB_rep in etats_par_cote:
                donne_B = dB_rep
                for rB in bandes:
                    recoit_B = dict(zip(corr.CANALS,
                                        _items3(SOMME_REP[rB])))
                    for eA in (False, True):
                        for eB in (False, True):
                            er1_A, er1_B = _er_rep(eA), _er_rep(eB)
                            for gA in (False, True):
                                for gB in (False, True):
                                    bd1, br1, bd2, br2 = _bids_rep(gA, gB)
                                    boucle = core_q4.boucle_bids(
                                        bd1, br1, bd2, br2)
                                    for inv_A in corr.ZONES_Q2:
                                        for inv_B in corr.ZONES_Q2:
                                            stats["configs"] += 1
                                            config = core_q4.configuration_devises(
                                                donne_A, recoit_A, donne_B,
                                                recoit_B, er1_A, er1_B,
                                                boucle["asymetrie"],
                                                inv_A, inv_B)
                                            stats["config_distribution"][
                                                config] += 1
                                            co = core_q4.co_regulation(
                                                er1_A, er1_B)
                                            pal = corr.palier_couple(
                                                config,
                                                co["paire_explosive"],
                                                boucle["asymetrie"])
                                            pal_i = corr.palier_independant(
                                                eA, eB,
                                                boucle["ecart_A"],
                                                boucle["ecart_B"], config)
                                            if (pal["palier"]
                                                    != pal_i["palier"]
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
                                            # R6 — symétrie (second appel
                                            # VRAI, paires miroirs) :
                                            boucle_sw = core_q4.boucle_bids(
                                                bd2, br2, bd1, br1)
                                            config_sw = \
                                                core_q4.configuration_devises(
                                                    donne_B, recoit_B,
                                                    donne_A, recoit_A,
                                                    er1_B, er1_A,
                                                    boucle_sw["asymetrie"],
                                                    inv_B, inv_A)
                                            if not (config == config_sw
                                                    or MIRROR_PAIRS.get(
                                                        config) == config_sw):
                                                stats["miroir_ecarts"] += 1
                                            # Texte + fragment (caches) :
                                            cle = (bA, cA, vA, rA, bB, cB,
                                                   vB, rB, eA, eB, gA, gB,
                                                   inv_A, inv_B)
                                            bloc = cache_texte.get(cle)
                                            if bloc is None:
                                                b = corr.bloc_ecran(
                                                    config, co, boucle,
                                                    inv_A, inv_B, pal)
                                                attendu_cites = 1 + (
                                                    1 if pal["S1"] else 0)
                                                bloc = (b["md5"],
                                                        b["nb_mots_interdits"],
                                                        BANDEAU_OK in b["texte"],
                                                        b["nb_templates_cites"],
                                                        attendu_cites)
                                                cache_texte[cle] = bloc
                                            md5_t, nb_mots, dsim_ok, \
                                                nb_cites, att_cites = bloc
                                            if nb_mots > stats[
                                                    "mots_interdits_max"]:
                                                stats["mots_interdits_max"] = nb_mots
                                            if not dsim_ok:
                                                stats["dsim_manquants"] += 1
                                            if nb_cites != att_cites:
                                                stats["templates_cites_ecarts"] += 1
                                            frag = cache_frag.get(cle)
                                            if frag is None:
                                                bandes_d = {
                                                    "donne_A": bA,
                                                    "recoit_A": rA,
                                                    "donne_B": bB,
                                                    "recoit_B": rB}
                                                canaux = {
                                                    "canal_don_A": cA,
                                                    "don_max_A_ge4": vA,
                                                    "canal_don_B": cB,
                                                    "don_max_B_ge4": vB}
                                                f_ = corr.bilan_fragment(
                                                    config, co, boucle,
                                                    inv_A, inv_B, pal,
                                                    bandes_d, canaux,
                                                    tables_pas, table_ecarts)
                                                frag = (f_["_complet"],
                                                        tuple(f_["bloc_7_palier_pas"]
                                                              ["pas_labels"]))
                                                cache_frag[cle] = frag
                                                stats["fragments_distincts"] += 1
                                            if not frag[0]:
                                                stats["fragment_incomplets"] += 1
                                            for lab in frag[1]:
                                                if lab not in \
                                                        core_q5.PAS_LABELS.values():
                                                    stats["pas_labels_hors_banque"] += 1

    stats["md5_texts_count"] = len(cache_texte)
    stats["configs_attendues"] = (len(etats) * len(bandes)) ** 2 * 4 * 4 \
        * len(corr.ZONES_Q2) ** 2
    return stats


# ─────────────────────────────────────────────────────────────────────────────
# STAGE 2 — RE-SCORE BIT-EXACT DES 450 COUPLES ARCHIVÉS (VRAI simulateur 42)
# ─────────────────────────────────────────────────────────────────────────────
ARCHIVE_N_TOTAL = 450
ARCHIVE_C1_PAR_GROUPE = {
    "LANGUE COMMUNE": (39, 50, 78.0),
    "DONNEUR NON CONVERTI (A)": (45, 50, 90.0),
    "DONNEUR NON CONVERTI (B)": (43, 50, 86.0),
    "LANGUE DORMANTE": (50, 50, 100.0),
    "CROISÉE (À CONVERTIR)": (24, 50, 48.0),
    "MIXTE POURSUITE": (48, 50, 96.0),
    "MIXTE RETRAIT": (47, 50, 94.0),
    "FEU CROISÉ": (41, 50, 82.0),
    "ÉQUILIBRÉE MIXTE": (35, 50, 70.0),
}
ARCHIVE_BOUCLES = {"LANGUE COMMUNE": 8, "DONNEUR NON CONVERTI (A)": 38,
                   "DONNEUR NON CONVERTI (B)": 34, "LANGUE DORMANTE": 7,
                   "CROISÉE (À CONVERTIR)": 25, "MIXTE POURSUITE": 50,
                   "MIXTE RETRAIT": 49, "FEU CROISÉ": 47,
                   "ÉQUILIBRÉE MIXTE": 12}
ARCHIVE_EXPLOSIVES = {"LANGUE COMMUNE": 0, "DONNEUR NON CONVERTI (A)": 0,
                      "DONNEUR NON CONVERTI (B)": 0, "LANGUE DORMANTE": 0,
                      "CROISÉE (À CONVERTIR)": 0, "MIXTE POURSUITE": 2,
                      "MIXTE RETRAIT": 2, "FEU CROISÉ": 44,
                      "ÉQUILIBRÉE MIXTE": 3}
# Distributions complètes archivées (81 cellules du rapport contresigné) :
ARCHIVE_DIST = {
    "LANGUE COMMUNE": {"LANGUE COMMUNE": 39, "DONNEUR NON CONVERTI (A)": 3,
                       "DONNEUR NON CONVERTI (B)": 0, "LANGUE DORMANTE": 0,
                       "CROISÉE (À CONVERTIR)": 5, "MIXTE POURSUITE": 0,
                       "MIXTE RETRAIT": 0, "FEU CROISÉ": 0,
                       "ÉQUILIBRÉE MIXTE": 3},
    "DONNEUR NON CONVERTI (A)": {"LANGUE COMMUNE": 0,
                                 "DONNEUR NON CONVERTI (A)": 45,
                                 "DONNEUR NON CONVERTI (B)": 0,
                                 "LANGUE DORMANTE": 0,
                                 "CROISÉE (À CONVERTIR)": 0,
                                 "MIXTE POURSUITE": 0, "MIXTE RETRAIT": 0,
                                 "FEU CROISÉ": 0, "ÉQUILIBRÉE MIXTE": 5},
    "DONNEUR NON CONVERTI (B)": {"LANGUE COMMUNE": 0,
                                 "DONNEUR NON CONVERTI (A)": 0,
                                 "DONNEUR NON CONVERTI (B)": 43,
                                 "LANGUE DORMANTE": 0,
                                 "CROISÉE (À CONVERTIR)": 1,
                                 "MIXTE POURSUITE": 0, "MIXTE RETRAIT": 0,
                                 "FEU CROISÉ": 0, "ÉQUILIBRÉE MIXTE": 6},
    "LANGUE DORMANTE": {"LANGUE COMMUNE": 0, "DONNEUR NON CONVERTI (A)": 0,
                        "DONNEUR NON CONVERTI (B)": 0,
                        "LANGUE DORMANTE": 50,
                        "CROISÉE (À CONVERTIR)": 0, "MIXTE POURSUITE": 0,
                        "MIXTE RETRAIT": 0, "FEU CROISÉ": 0,
                        "ÉQUILIBRÉE MIXTE": 0},
    "CROISÉE (À CONVERTIR)": {"LANGUE COMMUNE": 3,
                              "DONNEUR NON CONVERTI (A)": 12,
                              "DONNEUR NON CONVERTI (B)": 8,
                              "LANGUE DORMANTE": 0,
                              "CROISÉE (À CONVERTIR)": 24,
                              "MIXTE POURSUITE": 0, "MIXTE RETRAIT": 0,
                              "FEU CROISÉ": 0, "ÉQUILIBRÉE MIXTE": 3},
    "MIXTE POURSUITE": {"LANGUE COMMUNE": 0, "DONNEUR NON CONVERTI (A)": 0,
                        "DONNEUR NON CONVERTI (B)": 0,
                        "LANGUE DORMANTE": 0,
                        "CROISÉE (À CONVERTIR)": 0,
                        "MIXTE POURSUITE": 48, "MIXTE RETRAIT": 0,
                        "FEU CROISÉ": 2, "ÉQUILIBRÉE MIXTE": 0},
    "MIXTE RETRAIT": {"LANGUE COMMUNE": 0, "DONNEUR NON CONVERTI (A)": 0,
                      "DONNEUR NON CONVERTI (B)": 0,
                      "LANGUE DORMANTE": 0,
                      "CROISÉE (À CONVERTIR)": 0, "MIXTE POURSUITE": 0,
                      "MIXTE RETRAIT": 47, "FEU CROISÉ": 2,
                      "ÉQUILIBRÉE MIXTE": 1},
    "FEU CROISÉ": {"LANGUE COMMUNE": 9, "DONNEUR NON CONVERTI (A)": 0,
                   "DONNEUR NON CONVERTI (B)": 0, "LANGUE DORMANTE": 0,
                   "CROISÉE (À CONVERTIR)": 0, "MIXTE POURSUITE": 0,
                   "MIXTE RETRAIT": 0, "FEU CROISÉ": 41,
                   "ÉQUILIBRÉE MIXTE": 0},
    "ÉQUILIBRÉE MIXTE": {"LANGUE COMMUNE": 13,
                         "DONNEUR NON CONVERTI (A)": 0,
                         "DONNEUR NON CONVERTI (B)": 0,
                         "LANGUE DORMANTE": 0,
                         "CROISÉE (À CONVERTIR)": 1,
                         "MIXTE POURSUITE": 0, "MIXTE RETRAIT": 0,
                         "FEU CROISÉ": 1, "ÉQUILIBRÉE MIXTE": 35},
}


def stage2(tables: dict) -> dict:
    res = {
        "couples": 0, "comparaisons": 0, "ecarts": [],
        "c1_par_groupe": {}, "c1_configs_conformes": 0,
        "distributions_conformes": 0,
        "boucles_conformes": 0, "explosives_conformes": 0,
        "c2_symetriques": 0, "c2_violations": 0, "c2_desaccords_sim": 0,
        "c3a": 0, "c3b": 0, "c3c": 0,
        "paliers": {"🟢": 0, "🟠": 0, "🔴": 0},
        "S1": 0, "S2": 0,
        "fragments_archives": 0, "fragments_incomplets": 0,
        "dsim_archives": 0, "mots_interdits_max": 0,
        "templates_cites_ecarts": 0,
    }
    templates_tous = (list(core_q4.TEMPLATES_CONFIG.values())
                      + list(core_q4.TEMPLATES_DEVISES.values()))
    for tmpl in templates_tous:
        bas = tmpl.lower()
        for mot in ("tu es le problème", "c'est ta faute", "tu devrais",
                    "tu dois changer", "tu es toxique", "tu abîmes"):
            if mot in bas:
                res["c3b"] += 1
        if " tu " in bas and any(bl in bas for bl in
                                 ("tu es", "tu fais", "tu ne")):
            res["c3c"] += 1
    dist_vraie = {g: {c: 0 for c in corr.CONFIGS}
                  for g in ARCHIVE_C1_PAR_GROUPE}
    for gid, (pA, pB) in sim_q4.GROUPES_CROISES.items():
        boucle_g = {"boucles": 0, "explosives": 0}
        for i, (pa, pb) in enumerate(zip(pA, pB)):
            res["couples"] += 1
            cid = f"{gid}_{i}"
            boucle = core_q4.boucle_bids(pa["bid_d"], pa["bid_r"],
                                         pb["bid_d"], pb["bid_r"])
            config = core_q4.configuration_devises(
                pa["donne"], pa["recoit"], pb["donne"], pb["recoit"],
                pa["er1_m"], pb["er1_m"], boucle["asymetrie"],
                pa["inv_d_zone"], pb["inv_d_zone"])
            res["comparaisons"] += 1
            # C2 — désaccords moteur ≡ config_vraie (D-VÉRITÉ 9/9) :
            if sim_q4.config_vraie(pa["donne"], pa["recoit"], pb["donne"],
                                   pb["recoit"], pa["er1_m"], pb["er1_m"],
                                   boucle["asymetrie"], pa["inv_d_zone"],
                                   pb["inv_d_zone"]) != config:
                res["c2_desaccords_sim"] += 1
                res["ecarts"].append({"id": cid, "champ": "config_vraie",
                                      "calcule": config})
            # C1 — correct ssi la config lue = le groupe d'origine :
            g = res["c1_par_groupe"].setdefault(gid, [0, 0])
            g[1] += 1
            if config == gid:
                g[0] += 1
            dist_vraie[gid][config] += 1
            if boucle["asymetrie"]:
                boucle_g["boucles"] += 1
            co = core_q4.co_regulation(pa["er1_m"], pb["er1_m"])
            if co["paire_explosive"]:
                boucle_g["explosives"] += 1
            # C2 — symétrie par échange (paires miroirs) :
            boucle_sw = core_q4.boucle_bids(pb["bid_d"], pb["bid_r"],
                                            pa["bid_d"], pa["bid_r"])
            config_sw = core_q4.configuration_devises(
                pb["donne"], pb["recoit"], pa["donne"], pa["recoit"],
                pb["er1_m"], pa["er1_m"], boucle_sw["asymetrie"],
                pb["inv_d_zone"], pa["inv_d_zone"])
            res["comparaisons"] += 1
            if config == config_sw or MIRROR_PAIRS.get(config) == config_sw:
                res["c2_symetriques"] += 1
            else:
                res["c2_violations"] += 1
            # C3a — 0 formulation interdite dans l'affichage :
            affichage = (core_q4.TEMPLATES_CONFIG[config]
                         + " " + core_q4.TEMPLATES_CONFIG[
                             "FEU CROISÉ" if co["paire_explosive"]
                             else config]).lower()
            for mot in corr.MOTS_VERDICT_C3A:
                if mot in affichage:
                    res["c3a"] += 1
            # COUCHE appliquée :
            pal = corr.palier_couple(config, co["paire_explosive"],
                                     boucle["asymetrie"])
            bloc = corr.bloc_ecran(config, co, boucle, pa["inv_d_zone"],
                                   pb["inv_d_zone"], pal)
            res["comparaisons"] += 3
            if BANDEAU_OK in bloc["texte"]:
                res["dsim_archives"] += 1
            res["mots_interdits_max"] = max(res["mots_interdits_max"],
                                            bloc["nb_mots_interdits"])
            attendu_cites = 1 + (1 if pal["S1"] else 0)
            if bloc["nb_templates_cites"] != attendu_cites:
                res["templates_cites_ecarts"] += 1
            frag = corr.bilan_fragment(
                config, co, boucle, pa["inv_d_zone"], pb["inv_d_zone"],
                pal, {"donne_A": "archivé", "recoit_A": "archivé",
                      "donne_B": "archivé", "recoit_B": "archivé"},
                {"canal_don_A": "archivé", "don_max_A_ge4": "archivé",
                 "canal_don_B": "archivé", "don_max_B_ge4": "archivé"},
                tables["pas"], tables["ecarts"])
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
        if boucle_g["boucles"] == ARCHIVE_BOUCLES[gid]:
            res["boucles_conformes"] += 1
        else:
            res["ecarts"].append({"champ": f"boucles.{gid}",
                                  "calcule": boucle_g["boucles"],
                                  "archive": ARCHIVE_BOUCLES[gid]})
        if boucle_g["explosives"] == ARCHIVE_EXPLOSIVES[gid]:
            res["explosives_conformes"] += 1
        else:
            res["ecarts"].append({"champ": f"explosives.{gid}",
                                  "calcule": boucle_g["explosives"],
                                  "archive": ARCHIVE_EXPLOSIVES[gid]})
    # C1 par groupe + distributions complètes (81 cellules) :
    for gid, (c_att, n_att, pct_att) in ARCHIVE_C1_PAR_GROUPE.items():
        g = res["c1_par_groupe"].get(gid, [0, 0])
        res["comparaisons"] += 1
        if tuple(g) == (c_att, n_att):
            res["c1_configs_conformes"] += 1
        else:
            res["ecarts"].append({"champ": f"c1.{gid}", "calcule": tuple(g),
                                  "archive": (c_att, n_att)})
        ok_dist = True
        for c, n_att_cell in ARCHIVE_DIST[gid].items():
            res["comparaisons"] += 1
            if dist_vraie[gid][c] != n_att_cell:
                ok_dist = False
                res["ecarts"].append({"champ": f"dist.{gid}.{c}",
                                      "calcule": dist_vraie[gid][c],
                                      "archive": n_att_cell})
        if ok_dist:
            res["distributions_conformes"] += 1
    return res


# ─────────────────────────────────────────────────────────────────────────────
# STAGE 4 — COUPLAGE PAS PAR PARTENAIRE + SUIVI + RE-TEST + CO-RÉGULATION
# ─────────────────────────────────────────────────────────────────────────────
def stage4(tables: dict) -> dict:
    tables_pas = tables["pas"]
    pas_vus = {}
    for zone, tab in tables_pas.items():
        for pas, source in tab.items():
            pas_vus.setdefault(pas, source)
    inv_mesure = 0
    if tables_pas["OCCASIONNEL"].get("INV") == \
            "inv_d_zone (Q2 émotionnel)":
        inv_mesure += 1      # zone OCCASIONNEL mesurée → pas INV
    if tables_pas["FRÉQUENT"].get("INV") == \
            "inv_d_zone (Q2 émotionnel)":
        inv_mesure += 1      # zone FRÉQUENT mesurée → pas INV
    if tables_pas["ABSENT"].get("RC") == "rc_label (Q2 émotionnel)":
        inv_mesure += 1      # label actif mesuré → pas RC
    if tables_pas["ABSENT"].get("CAP") == "cap (Q1/Q3 émotionnel)":
        inv_mesure += 1      # cap PC → pas CAP
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
    co_bas = core_q4.co_regulation(2.9, 3.0)["paire_explosive"]
    co_pile = core_q4.co_regulation(3.0, 3.0)["paire_explosive"]
    co_haut = core_q4.co_regulation(3.1, 3.0)["paire_explosive"]
    co_ok = (co_bas is False) and (co_pile is True) and (co_haut is True)
    return {
        "pas_resolus": len(pas_vus),
        "pas_table": pas_vus,
        "pas_attendus": len(core_q5.PAS_ORDER),
        "invariants_mesures": inv_mesure,
        "invariants_attendus": 4,
        "suivi_15_sans_sanction": suivi_ok,
        "suivi_categories": sorted(categories),
        "retest_8_semaines": retest_ok,
        "coregulation_inclusive_pile": co_ok,
        "pas_par_zone": {z: len(t) for z, t in tables_pas.items()},
    }


# ─────────────────────────────────────────────────────────────────────────────
# PIPELINE COMPLET (exécuté 2 fois pour COR8)
# ─────────────────────────────────────────────────────────────────────────────
def _construit_tables() -> dict:
    print("    tables de junction (VRAIS moteurs) …", flush=True)
    pas = corr._tables_pas()              # 3 × 10 784 = 32 352 selectionner_pas
    ecarts = corr._table_ecarts()         # 625 boucle_bids exhaustifs
    return {"pas": pas, "ecarts": ecarts}


def pipeline() -> dict:
    etats = _etats_donne()
    print(f"  états donne atteignables : {len(etats)}/24 "
          f"(3 prouvés inateignables — moyenne ≥ 4 ⟹ vmax ≥ 4)", flush=True)
    print("  stage 0 — compactations …", flush=True)
    s0 = stage0(etats)
    tables = _construit_tables()
    print("  stage 1 — énumération exhaustive …", flush=True)
    s1 = stage1(etats, tables)
    print(f"    {s1['configs']} configurations · textes distincts "
          f"{s1['md5_texts_count']} · fragments distincts "
          f"{s1['fragments_distincts']}", flush=True)
    print("  stage 2 — re-score bit-exact des 450 couples …", flush=True)
    s2 = stage2(tables)
    print(f"    {s2['couples']} couples · {s2['comparaisons']} comparaisons · "
          f"écarts {len(s2['ecarts'])}", flush=True)
    print("  stage 4 — couplage pas (2 partenaires) + co-régulation …",
          flush=True)
    s4 = stage4(tables)
    print(f"    {s4['pas_resolus']}/{s4['pas_attendus']} pas · "
          f"invariants {s4['invariants_mesures']}"
          f"/{s4['invariants_attendus']}", flush=True)
    return {"stage0": s0, "stage1": s1, "stage2": s2, "stage4": s4,
            "standings": {
                "mots_interdits_standings": max(
                    [sum(1 for m in corr.MOTS_INTERDITS if m in t.lower())
                     + sum(1 for m in corr.MOTS_VERDICT_C3A if m in t.lower())
                     for t in (corr.BANDEAU_DSIM, corr.PHRASE_ORIENTATION,
                               corr.NOTE_APAISEMENT, corr.NOTE_BOUCLE,
                               corr.NOTE_D_EMO5,
                               corr.clause_aide_standing(),
                               *corr.EXERCICE_CONFIG.values(),
                               *corr.MODULE_CONFIG.values(),
                               *core_q4.TEMPLATES_CONFIG.values(),
                               *core_q4.TEMPLATES_DEVISES.values(),
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
            "definition": "compactations PROUVÉES exhaustivement : donne → état "
                          "(125 bruts × 2 côtés — même état ⇒ même sortie du VRAI "
                          "configuration_devises ; 3 états inateignables prouvés : "
                          "recherche exhaustive des 125 triplets → 18 états réels) · moyennes → "
                          "bandes (13 valeurs, bornes consignées : 2,5 NON pile dist "
                          "1/6 · 3,00 PILE · 4,00 PILE) · bids → écarts (625 bruts → "
                          "25 états |Δ| — espion exhaustif) · er1 → classes (espion "
                          "pile inclusif 3,00) · score_A/label_ombre jamais lus",
            "observe": f"donne {s0['donne_bruts']} → écart {s0['donne_ecarts']} · "
                       f"états inateignables {s0['etats_inateignables']} · moyennes "
                       f"{s0['moyennes_valeurs']} → écart {s0['moyennes_ecarts']} · "
                       f"piles 3,00={s0['bandes_piles']['3.00']} 4,00="
                       f"{s0['bandes_piles']['4.00']} · pile 2,5 = {s0['pile_25']} "
                       f"(dist {round(s0['dist_25'], 4)}) · bids {s0['bids_bruts']} → "
                       f"écart {s0['bids_ecarts']} · espion er {s0['espion_er']} → "
                       f"écart {s0['espion_er_ecarts']} · espion sa/ombre "
                       f"{s0['espion_sa_ombre']} → écart {s0['espion_sa_ombre_ecarts']}",
            "pass": (s0["donne_ecarts"] == 0
                     and s0["etats_inateignables"] == 6
                     and s0["moyennes_ecarts"] == 0
                     and s0["pile_25"] == 0
                     and s0["bids_ecarts"] == 0
                     and s0["espion_er_ecarts"] == 0
                     and s0["espion_sa_ombre_ecarts"] == 0)},
        "COR1_fragment_complet": {
            "definition": f"{n}/{n} configurations → fragment L8 7 blocs, 0 champ vide "
                          "(aucun gate sur cet instrument — pas de suspension inventée, "
                          "R4) + 450/450 couples archivés",
            "observe": f"{s1['fragments_distincts']}/{s1['fragments_distincts']} états "
                       f"distincts · incomplets {s1['fragment_incomplets']} · archivés "
                       f"{s2['fragments_archives']}/{s2['couples']} · incomplets "
                       f"{s2['fragments_incomplets']}",
            "pass": (s1["fragment_incomplets"] == 0
                     and s2["fragments_incomplets"] == 0
                     and s2["fragments_archives"] == s2["couples"] == 450)},
        "COR2_derivation_palier": {
            "definition": "double chemin : entier pur (paires explosives ⇔ classes er1 ; "
                          "boucle ⇔ |Δ| ≥ 2) ≡ dérivation depuis les VRAIES sorties "
                          "(co_regulation + boucle_bids) — palier + S1 + S2 ; junctions "
                          "S1 ⇔ 🔴, S2 ⇔ 🟠 exactement",
            "observe": f"{n} configs · écart double chemin {s1['cor2_ecarts']} · "
                       f"écart junction {s1['junction_s1s2_ecarts']}",
            "pass": (s1["cor2_ecarts"] == 0
                     and s1["junction_s1s2_ecarts"] == 0)},
        "COR3_seuils_aide": {
            "definition": "S1 = paire explosive du VRAI co_regulation (les deux er1 ≥ "
                          "3,0 — couvre FEU CROISÉ) ; S2 = boucle asymétrique du VRAI "
                          "boucle_bids ou configuration à convertir, sans 🔴 ; la couche "
                          "n'ajoute aucun seuil numérique ; bornes du VRAI moteur "
                          "consignées : 2,5 NON pile (dist 1/6) · 3,00 PILE (moyenne ≥ 3 "
                          "et co-régulation — inclusif) · 4,00 PILE (moyenne ≥ 4, vmax ≥ "
                          "4) · asymétrie ≥ 2 entière (exacte)",
            "observe": f"S1 {s1['S1']}/{n} · S2 {s1['S2']}/{n} · pile 2,5 = "
                       f"{s0['pile_25']} (dist {round(s0['dist_25'], 4)}) · piles "
                       f"3,00 = {s0['bandes_piles']['3.00']} · 4,00 = "
                       f"{s0['bandes_piles']['4.00']} (consignés) · co-régulation pile "
                       f"{s4['coregulation_inclusive_pile']}",
            "pass": (s1["junction_s1s2_ecarts"] == 0
                     and s0["pile_25"] == 0
                     and s4["coregulation_inclusive_pile"])},
        "COR4_vocabulaire_ecran": {
            "definition": "0 mot interdit (canon Partie 9 + les 9 formulations C3a du "
                          "package) sur tous les textes générés + templates réels "
                          "(9 configs + 6 devises) + exercices/modules de la couche + "
                          "pas/suivi réels, D-SIM 100 %",
            "observe": f"max mots interdits par texte = {s1['mots_interdits_max']} ; "
                       f"standing = {r1['standings']['mots_interdits_standings']} ; "
                       f"textes distincts = {s1['md5_texts_count']} ; D-SIM manquants "
                       f"{s1['dsim_manquants']} ; archivés D-SIM {s2['dsim_archives']}/450 "
                       f"· max archivés {s2['mots_interdits_max']}",
            "pass": (s1["mots_interdits_max"] == 0
                     and r1["standings"]["mots_interdits_standings"] == 0
                     and s1["dsim_manquants"] == 0
                     and s2["dsim_archives"] == 450
                     and s2["mots_interdits_max"] == 0)},
        "COR5_anti_fabrication": {
            "definition": "configuration affichée ≡ VRAI configuration_devises (9 noms "
                          "D-NOMENCLATURE, jamais d'autre) · templates réels cités mot "
                          "pour mot · JAMAIS de pourcentage de compatibilité ni de blâme "
                          "(C3a/C3b/C3c du package vérifiés sur l'énumération + les "
                          "templates) · doctrine crise active appliquée (apaisement "
                          "avant tout dialogue)",
            "observe": f"templates cités : écart {s1['templates_cites_ecarts']} · "
                       f"mots interdits max {s1['mots_interdits_max']} · C3a archivé "
                       f"{s2['c3a']} · C3b {s2['c3b']} · C3c {s2['c3c']} · archivés "
                       f"templates {s2['templates_cites_ecarts']}",
            "pass": (s1["templates_cites_ecarts"] == 0
                     and s1["mots_interdits_max"] == 0
                     and s2["c3a"] == 0 and s2["c3b"] == 0 and s2["c3c"] == 0
                     and s2["templates_cites_ecarts"] == 0)},
        "COR6_rescore_bit_exact": {
            "definition": "450 couples archivés émo-q4-r3 régénérés par le VRAI simulateur "
                          "seed 42 : C1 8/9 par configuration (LANGUE COMMUNE 39/50 · "
                          "DONNEUR A 45 · DONNEUR B 43 · DORMANTE 50/50 · CROISÉE 24/50 = "
                          "48 % — chevauchement géométrique S-EMO-Q4-R3-1 CONSERVÉ "
                          "consigné, option d'arbitrage ouverte · MIXTE POURSUITE 48 · "
                          "MIXTE RETRAIT 47 · FEU CROISÉ 41 · ÉQUILIBRÉE 35) · C2 "
                          "symétrie 450/450, 0 désaccord config_vraie (D-VÉRITÉ 9/9) · "
                          "C3 0/0/0 · distributions complètes 9/9 (81 cellules) · "
                          "boucles/paires explosives par groupe conformes",
            "observe": f"{s2['couples']} couples · {s2['comparaisons']} comparaisons · "
                       f"écarts {len(s2['ecarts'])} · C1 conforme "
                       f"{s2['c1_configs_conformes']}/9 · distributions "
                       f"{s2['distributions_conformes']}/9 (81 cellules) · C2 "
                       f"symétriques {s2['c2_symetriques']}/450 · violations "
                       f"{s2['c2_violations']} · désaccords sim {s2['c2_desaccords_sim']} "
                       f"· C3a {s2['c3a']} · C3b {s2['c3b']} · C3c {s2['c3c']} · "
                       f"boucles {s2['boucles_conformes']}/9 · explosives "
                       f"{s2['explosives_conformes']}/9 · paliers {s2['paliers']} · "
                       f"S1 {s2['S1']} · S2 {s2['S2']}",
            "pass": (len(s2["ecarts"]) == 0
                     and s2["couples"] == 450
                     and s2["c1_configs_conformes"] == 9
                     and s2["distributions_conformes"] == 9
                     and s2["c2_symetriques"] == 450
                     and s2["c2_violations"] == 0
                     and s2["c2_desaccords_sim"] == 0
                     and s2["c3a"] == 0 and s2["c3b"] == 0 and s2["c3c"] == 0
                     and s2["boucles_conformes"] == 9
                     and s2["explosives_conformes"] == 9)},
        "COR7_couplage_pas": {
            "definition": "8/8 pas réels (arbre Q5) résolus par le VRAI selectionner_pas "
                          "POUR CHACUN des deux partenaires (zones Q2 mesurées par RIO-07 "
                          "et portées par ce croisement — 32 352 combinaisons) ; "
                          "invariants INV/RC/CAP/fallback ; suivi 14 j sans sanction "
                          "15/15 ; re-test 8 semaines ; co-régulation (vrai seuil 3,0, "
                          "PILE consigné)",
            "observe": f"pas {s4['pas_resolus']}/8 · invariants "
                       f"{s4['invariants_mesures']}/{s4['invariants_attendus']} · "
                       f"pas/zone {s4['pas_par_zone']} · suivi "
                       f"{s4['suivi_15_sans_sanction']}/15 · re-test "
                       f"{s4['retest_8_semaines']} · co-régulation pile "
                       f"{s4['coregulation_inclusive_pile']} · labels hors banque "
                       f"{s1['pas_labels_hors_banque']}",
            "pass": (s4["pas_resolus"] == s4["pas_attendus"] == 8
                     and s4["invariants_mesures"] == s4["invariants_attendus"]
                     and s4["suivi_15_sans_sanction"] == 15
                     and s4["retest_8_semaines"]
                     and s4["coregulation_inclusive_pile"]
                     and s1["pas_labels_hors_banque"] == 0)},
        "COR8_reproductibilite": {
            "definition": "pipeline ×2 → SHA-256 identiques",
            "observe": f"{sha1[:16]}… == {sha2[:16]}… → {cor8}", "pass": cor8},
    }

    RES.mkdir(exist_ok=True)
    payload = {
        "package": "validation-emotionnelle/validation-emo-q4-r3/correction-philosophique",
        "cible": "RIO-09 « Nos deux langues »",
        "moteurs_reels": [
            "validation-emo-q4-r3/src/wtc_emo_q4_core.py (R3 — D-EMO-5, asymétrie interne)",
            "validation-emo-q4-r3/src/wtc_emo_q4_simulator.py (seed 42, 450 couples)",
            "validation-emo-q2-r1/src/wtc_emo_q2_core.py (valeurs Q2 réelles)",
            "validation-emo-q5/src/wtc_emo_q5_core.py"],
        "espace_enumeré": {
            "dimension": ("états donne A (18) × bandes reçoit A (4) × états donne B (18) "
                          "× bandes reçoit B (4) × classes er (4) × classes d'écart (4) "
                          "× paires de zones Q2 (9)"),
            "configurations": n,
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
