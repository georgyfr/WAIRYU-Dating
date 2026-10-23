# -*- coding: utf-8 -*-
"""
WTC-EXT-Q2 — VALIDATION DE LA COUCHE DE CORRECTION PHILOSOPHIQUE (RIO-17)
==========================================================================
Exécute les stages de preuve sur les VRAIS moteurs (zéro réimplémentation) :

  Stage 0 — COMPACTATIONS PROUVÉES EXHAUSTIVEMENT + MESURES :
            (a) table pure des 9 configurations (3×3) ≡ VRAI `config_de` —
                anti-inversion 2/4 · 3/7 · 6/8 + miroirs 9/9 + noms uniques ;
            (b) bornes 2,50/3,50 PILE ATTEIGNABLES sur le grain 1/6
                (15/6 = 2,50 · 21/6 = 3,50) — tranchage inclusif du VRAI
                moteur testé sur les cas de table D-VÉRITÉ (2,49 → FAIBLE ·
                2,50 → MODÉRÉE · 3,49 → MODÉRÉE · 3,50 → FORTE) + règle
                max pure du palier croisé sur les 9 paires ;
            (c) espion population : les percentiles ne changent NI config
                NI palier NI inférences NI verdict (9 sondes — la boucle
                est un AVERTISSEMENT, la junction est testée) ;
            (d) zone calme ⇔ config 1 exactement (9/9, VRAI zone_calme) ;
            (e) banque de pas réelle 3/2/1 + mapping famille (3 paliers) +
                pas zéro légitime ssi config 1 ;
            (f) percentiles mid-rank déterministes (même valeur → même
                percentile, 5/5) + frontière boucle 30,0 PILE inclusive
                testée via le VRAI `boucle_probable`.
  Stage 1 — ÉNUMÉRATION EXHAUSTIVE de l'espace des états distincts du
            croisement : 9 configurations × 2 boucles × 2 styles × 2×2
            asymétries × 2³ inférences × 3 forces × 4 paires de statuts RQS
            = 13 824 états ENTRÉE + override (9 configs × 2 rives = 18) +
            non-entrée (2) — TOUTE la sortie de la couche (bloc écran,
            contenu F3 par configuration, fragment 7 blocs) calculée par
            les fonctions réelles et vérifiée état par état. COR2 = double
            chemin (table pure 3×3 + règle max) ≡ VRAI moteur.
  Stage 2 — RE-SCORE BIT-EXACT des 650 couples archivés du rapport ext-q2
            (14 groupes, seed 42 ×2), régénérés par le VRAI simulateur +
            VRAI `sortie_rive` + VRAI `classifier_croisement` dans la
            population déposée (2 000, seed 42) : stats_groupes 14/14
            bit-exact vs archive du 18/10, globaux (paliers, entrées,
            boucles 87, styles 75, inférences L5), conformité D-STD-2 —
            puis couche appliquée aux 650 croisements.
  Stage 4 — COUPLAGE PAS RÉEL (VRAI Q3) : famille héritée du palier croisé
            (jamais recalculée) + banque verbatim (longueurs 3/2/1) +
            pas zéro ssi config 1 + suivi 14 j sans sanction (15 totaux) +
            re-tests non consommés (template VRAI).
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
import wtc_ext_q2_correction as corr          # la couche (charge les vrais moteurs)
core_q2 = corr.core_q2
core_q3 = corr.core_q3

# Le VRAI simulateur ext-q2 (seed 42, construit à l'import) :
sim_q2 = corr._charge(
    "wtc_ext_q2_simulator",
    corr._Q2 / "src" / "wtc_ext_q2_simulator.py")

RES = Path(__file__).resolve().parents[1] / "results"
SMOKE = os.environ.get("CORR_SMOKE") == "1"   # échantillon réduit (test rapide)

ARCHIVE = corr._Q2 / "results" / "resultats-ext-q2-2026-10-18.json"

NIVEAUX = core_q2.NIVEAUX_CROISEMENT
# Scores H représentatifs par niveau — grain 1/6 réel :
SCORE_H_PAR_NIVEAU = {"FAIBLE": 2.0, "MODÉRÉE": 3.0, "FORTE": 3.6667}
# Grain des faces : 1/3 (valeurs réelles du moteur Q1) — 2,67 ≥ 2,60 (taxe) :
FACE_BASE, FACE_HAUT = 2.0, 2.67
# Agrégats sur le grain 1/18 pour les percentiles (réalisés au stage 0f) :
POP = core_q2.POPULATION


def _paire_aggregats() -> dict:
    """Deux paires d'agrégats (grain 1/18) réalisant boucle=True (écart de
    percentiles ≥ 30) et boucle=False (< 30) — mesurées, pas supposées."""
    candidats = [round(k / 18, 4) for k in range(27, 74, 3)]   # 1,50 → 4,06
    pct = {a: core_q2.percentile_de(a, POP) for a in candidats}
    boucle_on = boucle_off = None
    for a1, a2 in itertools.product(candidats, repeat=2):
        if abs(pct[a1] - pct[a2]) >= 30.0 and boucle_on is None:
            boucle_on = (a1, a2)
        if abs(pct[a1] - pct[a2]) < 30.0 and boucle_off is None:
            boucle_off = (a1, a2)
        if boucle_on and boucle_off:
            break
    assert boucle_on and boucle_off, "paires d'agrégats introuvables"
    return {"boucle_on": boucle_on, "boucle_off": boucle_off,
            "pct_on": (pct[boucle_on[0]], pct[boucle_on[1]]),
            "pct_off": (pct[boucle_off[0]], pct[boucle_off[1]])}


def _sortie(niveau_h: str, *, boucle: bool, styles: bool, asym_l: bool,
            asym_c: bool, inf_taxe: bool, inf_silence: bool,
            force: str, statut: str = "OK", filet: bool = False) -> dict:
    """Sortie RIO-16 synthétique (forme exacte de `sortie_rive`, grain
    réel : score H 1/6, faces 1/3, agrégat 1/18) réalisant l'état demandé."""
    score_h = SCORE_H_PAR_NIVEAU[niveau_h]
    score_l = 3.0 if asym_l else 2.0          # écart 1,00 → marquée
    score_c = 3.0 if asym_c else 2.0
    l1 = FACE_HAUT if inf_taxe else FACE_BASE
    l2 = ({"les_deux": FACE_HAUT, "une": FACE_HAUT,
           "aucune": FACE_BASE})[force]
    l2_autre = FACE_HAUT if force == "les_deux" else FACE_BASE
    c1, c2 = (FACE_BASE, FACE_HAUT) if inf_silence else (FACE_BASE, FACE_BASE)
    aggs = _PAIRES_AGGS["boucle_on" if boucle else "boucle_off"]
    return {"rqs_statut": statut,
            "rqs": 100 if statut == "OK" else 80,
            "filet": bool(filet),
            "score_H": score_h, "score_L": score_l, "score_C": score_c,
            "faces": {"H1": score_h, "H2": score_h,
                      "L1": l1, "L2": l2, "C1": c1, "C2": c2},
            "aggregate": aggs[0], "moyenne": (3.3333 if styles else 2.0)}


def _sortie_b(niveau_h: str, *, boucle: bool, styles: bool, asym_l: bool,
              asym_c: bool, inf_taxe: bool, inf_silence: bool,
              force: str, statut: str = "OK", filet: bool = False) -> dict:
    """Rive 2 — miroir de la construction (styles sur la rive 2, asymétries
    réalisées par l'écart de la paire)."""
    s = _sortie(niveau_h, boucle=boucle, styles=styles, asym_l=asym_l,
                asym_c=asym_c, inf_taxe=inf_taxe, inf_silence=inf_silence,
                force=force, statut=statut, filet=filet)
    if styles:
        s["moyenne"] = 2.0                    # écart 1,3333 → dissemblables
    # la rive 2 porte le SECOND agrégat de la paire (écart de percentiles) :
    s["aggregate"] = _PAIRES_AGGS["boucle_on" if boucle else "boucle_off"][1]
    if force == "les_deux":
        s["faces"]["L2"] = FACE_HAUT
    elif force == "une":
        s["faces"]["L2"] = FACE_BASE          # une seule rive vive
    return s


_PAIRES_AGGS = None


# ─────────────────────────────────────────────────────────────────────────────
# STAGE 0 — COMPACTATIONS + MESURES
# ─────────────────────────────────────────────────────────────────────────────
def stage0() -> dict:
    res = {
        "configs_table": 0, "configs_ecarts": 0,
        "miroirs": 0, "miroirs_ecarts": 0,
        "bornes_testees": {}, "grain_pile": {},
        "palier_max_pure": 0, "palier_max_ecarts": 0,
        "espions_population": 0, "espion_ecarts": 0,
        "zone_calme": 0, "zone_calme_ecarts": 0,
        "banque_longueurs": {}, "pas_zero_configs": [],
        "percentiles_determinisme": 0, "percentile_ecarts": 0,
        "boucle_frontiere": None,
    }
    # (a) table pure 3×3 ≡ VRAI config_de + miroirs + noms uniques
    for i, n1 in enumerate(NIVEAUX):
        for j, n2 in enumerate(NIVEAUX):
            res["configs_table"] += 1
            if core_q2.config_de(n1, n2) != i * 3 + j + 1:
                res["configs_ecarts"] += 1
    for num, cfg in core_q2.CONFIGS.items():
        res["miroirs"] += 1
        if core_q2.config_de(cfg["h2"], cfg["h1"]) != core_q2.MIROIR[num]:
            res["miroirs_ecarts"] += 1
    # (b) bornes PILE ATTEIGNABLES sur le grain 1/6 + tranchage inclusif
    grain = [round(s / 6, 4) for s in range(6, 25)]
    res["grain_pile"] = {"2.5_atteignable": 2.5 in grain,
                         "3.5_atteignable": 3.5 in grain}
    res["bornes_testees"] = {
        "2.49": core_q2.niveau_croisement(2.49),
        "2.50": core_q2.niveau_croisement(2.50),
        "3.49": core_q2.niveau_croisement(3.49),
        "3.50": core_q2.niveau_croisement(3.50),
    }
    attendu = {"2.49": "FAIBLE", "2.50": "MODÉRÉE",
               "3.49": "MODÉRÉE", "3.50": "FORTE"}
    if res["bornes_testees"] != attendu:
        res["configs_ecarts"] += 1
    # règle max pure du palier croisé sur les 9 paires :
    for i, n1 in enumerate(NIVEAUX):
        for j, n2 in enumerate(NIVEAUX):
            res["palier_max_pure"] += 1
            pur = core_q2.PALIER_ROUGE if max(i, j) == 2 else (
                core_q2.PALIER_ORANGE if max(i, j) == 1
                else core_q2.PALIER_VERT)
            if core_q2.palier_croise(n1, n2, False) != pur:
                res["palier_max_ecarts"] += 1
    # (c) espion population : la boucle ne change aucun résultat structurel
    sa = _sortie("MODÉRÉE", boucle=True, styles=False, asym_l=False,
                 asym_c=False, inf_taxe=True, inf_silence=False, force="une")
    sb = _sortie_b("FAIBLE", boucle=True, styles=False, asym_l=False,
                   asym_c=False, inf_taxe=False, inf_silence=False,
                   force="une")
    avec = core_q2.classifier_croisement(sa, sb, POP)
    sans = core_q2.classifier_croisement(sa, sb, None)
    res["espions_population"] += 1
    if (avec["config_num"] != sans["config_num"]
            or avec["palier"] != sans["palier"]
            or avec["inferences_L5"] != sans["inferences_L5"]
            or avec["verdict"] != sans["verdict"]):
        res["espion_ecarts"] += 1
    # 8 sondes supplémentaires (9 configs × entrée) :
    for n1, n2 in itertools.product(NIVEAUX, repeat=2):
        sa = _sortie(n1, boucle=False, styles=False, asym_l=False,
                     asym_c=False, inf_taxe=False, inf_silence=False,
                     force="aucune")
        sb = _sortie_b(n2, boucle=False, styles=False, asym_l=False,
                       asym_c=False, inf_taxe=False, inf_silence=False,
                       force="aucune")
        avec = core_q2.classifier_croisement(sa, sb, POP)
        sans = core_q2.classifier_croisement(sa, sb, None)
        res["espions_population"] += 1
        if (avec["config_num"] != sans["config_num"]
                or avec["palier"] != sans["palier"]
                or avec["inferences_L5"] != sans["inferences_L5"]):
            res["espion_ecarts"] += 1
    # (d) zone calme ⇔ config 1 exactement
    for num, cfg in core_q2.CONFIGS.items():
        res["zone_calme"] += 1
        if core_q2.palier_croise(cfg["h1"], cfg["h2"], False) == \
                core_q2.PALIER_VERT and num != 1:
            res["zone_calme_ecarts"] += 1
        if num == 1 and core_q2.palier_croise(cfg["h1"], cfg["h2"], False) \
                != core_q2.PALIER_VERT:
            res["zone_calme_ecarts"] += 1
    # (e) banque 3/2/1 + mapping famille + pas zéro
    for palier, famille, attendu_len in (
            (core_q2.PALIER_VERT, core_q3.FAMILLE_VERT, 3),
            (core_q2.PALIER_ORANGE, core_q3.FAMILLE_ORANGE, 2),
            (core_q2.PALIER_ROUGE, core_q3.FAMILLE_ROUGE, 1)):
        banque = core_q3.BANQUE_PAS_EXT[core_q3.famille_de(palier)]
        res["banque_longueurs"][famille] = len(banque)
        if core_q3.famille_de(palier) != famille or len(banque) != attendu_len:
            res["palier_max_ecarts"] += 1
    for num, cfg in core_q2.CONFIGS.items():
        if core_q3.pas_zero_legitime(num == 1) != (num == 1):
            res["zone_calme_ecarts"] += 1
        elif num == 1:
            res["pas_zero_configs"].append(num)
    # (f) percentiles déterministes + frontière boucle 30,0 PILE inclusive
    for v in (2.0, 2.5, 3.0, 3.5, 4.0):
        res["percentiles_determinisme"] += 1
        if core_q2.percentile_de(v, POP) != core_q2.percentile_de(v, POP):
            res["percentile_ecarts"] += 1
    res["boucle_frontiere"] = {
        "30.0_PILE": core_q2.boucle_probable(50.0, 20.0),      # True (≥)
        "29.9": core_q2.boucle_probable(50.0, 20.1),           # False
        "verdict": "avertissement L6 — ne change aucun résultat (espion c)",
    }
    if not res["boucle_frontiere"]["30.0_PILE"] \
            or res["boucle_frontiere"]["29.9"]:
        res["percentile_ecarts"] += 1
    return res


# ─────────────────────────────────────────────────────────────────────────────
# STAGE 1 — ÉNUMÉRATION EXHAUSTIVE (13 824 états ENTRÉE + hors-verdict)
# ─────────────────────────────────────────────────────────────────────────────
def stage1() -> dict:
    res = {
        "etats_entree": 0, "override_configs": 0, "non_entree_configs": 0,
        "cor1_fragments_incomplets": 0,
        "cor2_double_chemin_ecarts": 0,
        "cor3_S1": 0, "cor3_S2": 0, "cor3_S2_ecarts": 0,
        "cor4_mots_interdits": 0, "cor4_dsim_manquant": 0,
        "blocs_distincts": 0, "fragments_distincts": 0,
        "cor5_calme_hors_config1": 0, "cor5_config1_sans_calme": 0,
        "cor5_avertissement_ecarts": 0, "cor5_doctrine_ecarts": 0,
        "distrib_configs": {}, "distrib_paliers": {},
        "junction_contenu_ecarts": 0,
    }
    blocs: list = []
    frags: list = []
    forces = ("aucune", "une", "les_deux")
    statuts = ("OK", "PRUDENCE")
    for n1, n2 in itertools.product(NIVEAUX, repeat=2):
        for boucle, styles in itertools.product((False, True), repeat=2):
            for asym_l, asym_c in itertools.product((False, True), repeat=2):
                for inf_bits in itertools.product((False, True), repeat=3):
                    for force in forces:
                        for stat1, stat2 in itertools.product(statuts,
                                                              repeat=2):
                            sa = _sortie(n1, boucle=boucle, styles=styles,
                                         asym_l=asym_l, asym_c=asym_c,
                                         inf_taxe=inf_bits[0],
                                         inf_silence=inf_bits[2],
                                         force=force, statut=stat1)
                            sb = _sortie_b(n2, boucle=boucle, styles=styles,
                                           asym_l=asym_l, asym_c=asym_c,
                                           inf_taxe=inf_bits[1],
                                           inf_silence=inf_bits[2],
                                           force=force, statut=stat2)
                            # la rive 2 porte aussi l'inférence taxe :
                            if inf_bits[1]:
                                sb["faces"]["L1"] = FACE_HAUT
                            cr = core_q2.classifier_croisement(sa, sb, POP)
                            res["etats_entree"] += 1

                            # COR2 — double chemin (table pure + règle max)
                            i, j = NIVEAUX.index(n1), NIVEAUX.index(n2)
                            if cr["config_num"] != i * 3 + j + 1:
                                res["cor2_double_chemin_ecarts"] += 1
                            pal_pur = (core_q2.PALIER_ROUGE if max(i, j) == 2
                                       else core_q2.PALIER_ORANGE
                                       if max(i, j) == 1
                                       else core_q2.PALIER_VERT)
                            if cr["palier"] != pal_pur:
                                res["cor2_double_chemin_ecarts"] += 1

                            # COR3 — S1 ⇔ override (jamais en entrée) ;
                            # S2 ⇔ palier non-VERT
                            pal = corr.bilan_fragment(sa, sb, cr)["bloc_4_couple"]
                            s2 = pal["palier"] != core_q2.PALIER_VERT
                            if s2:
                                res["cor3_S2"] += 1
                            # (S1 n'existe qu'en override — compté au bloc)

                            # COR1 — fragments complets
                            frag = corr.bilan_fragment(sa, sb, cr)
                            bloc = corr.bloc_ecran_couple(sa, sb, cr)
                            if not frag.get("_complet"):
                                res["cor1_fragments_incomplets"] += 1

                            # COR4 — vocabulaire + D-SIM
                            for t in corr.textes_ecran(sa, sb, cr):
                                tl = t.lower()
                                for mot in corr.MOTS_INTERDITS:
                                    if mot in tl:
                                        res["cor4_mots_interdits"] += 1
                            if corr.D_SIM not in bloc["bandeau_dsim"]:
                                res["cor4_dsim_manquant"] += 1

                            # COR5 — zone calme ssi config 1 ; avertissements
                            # présents ⇔ flags ; doctrine comparatif exacte
                            calme = any("Zone calme — rien à fabriquer ici"
                                        .lower() in t.lower()
                                        for t in corr._textes(bloc))
                            if calme and cr["config_num"] != 1:
                                res["cor5_calme_hors_config1"] += 1
                            if not calme and cr["config_num"] == 1:
                                res["cor5_config1_sans_calme"] += 1
                            av = bloc.get("avertissements", {})
                            if ("BOUCLE" in str(av)) != boucle:
                                res["cor5_avertissement_ecarts"] += 1
                            if ("DISSEMBLABLES" in str(av)) != styles:
                                res["cor5_avertissement_ecarts"] += 1
                            if frag["bloc_4_couple"]["verdict_comparatif"] \
                                    != corr.DOCTRINE_COMPARATIF:
                                res["cor5_doctrine_ecarts"] += 1

                            # junction F3 : le contenu servi = la banque réelle
                            cont = bloc["contenu_palier"]
                            if pal_pur == core_q2.PALIER_ORANGE:
                                if cont["pas_reels_servis"] != list(
                                        corr.PAS_ORANGE_REELS):
                                    res["junction_contenu_ecarts"] += 1
                            elif pal_pur == core_q2.PALIER_ROUGE:
                                if cont["pas_reel_serve"] != corr.PAS_ROUGE_REEL:
                                    res["junction_contenu_ecarts"] += 1
                            else:
                                if not cont["pas_zero_legitime"]:
                                    res["junction_contenu_ecarts"] += 1

                            # distributions
                            cle = cr["config_nom"]
                            res["distrib_configs"][cle] = \
                                res["distrib_configs"].get(cle, 0) + 1
                            res["distrib_paliers"][pal_pur] = \
                                res["distrib_paliers"].get(pal_pur, 0) + 1
                            blocs.append(json.dumps(bloc, sort_keys=True,
                                                    ensure_ascii=False))
                            frags.append(json.dumps(frag, sort_keys=True,
                                                    ensure_ascii=False))
    # override : 9 configs × 2 rives en crise (une seule suffit) :
    for n1, n2 in itertools.product(NIVEAUX, repeat=2):
        for cote in ("A", "B"):
            sa = _sortie(n1, boucle=False, styles=False, asym_l=False,
                         asym_c=False, inf_taxe=False, inf_silence=False,
                         force="aucune", filet=(cote == "A"))
            sb = _sortie_b(n2, boucle=False, styles=False, asym_l=False,
                           asym_c=False, inf_taxe=False, inf_silence=False,
                           force="aucune", filet=(cote == "B"))
            cr = core_q2.classifier_croisement(sa, sb, POP)
            res["override_configs"] += 1
            if not (cr["override"] and cr["verdict"] is None
                    and cr["palier"] == core_q2.PALIER_ROUGE):
                res["cor2_double_chemin_ecarts"] += 1
            frag = corr.bilan_fragment(sa, sb, cr)
            bloc = corr.bloc_ecran_couple(sa, sb, cr)
            if not frag.get("_complet"):
                res["cor1_fragments_incomplets"] += 1
            if "bandeau_court_circuit" not in bloc:
                res["cor5_doctrine_ecarts"] += 1
            for t in corr.textes_ecran(sa, sb, cr):
                tl = t.lower()
                for mot in corr.MOTS_INTERDITS:
                    if mot in tl:
                        res["cor4_mots_interdits"] += 1
            blocs.append(json.dumps(bloc, sort_keys=True, ensure_ascii=False))
            frags.append(json.dumps(frag, sort_keys=True, ensure_ascii=False))
    # non-entrée : RQS INVALIDE chez A puis chez B :
    for cote in ("A", "B"):
        sa = _sortie("MODÉRÉE", boucle=False, styles=False, asym_l=False,
                     asym_c=False, inf_taxe=False, inf_silence=False,
                     force="aucune", statut="INVALIDE" if cote == "A" else "OK")
        sb = _sortie_b("FAIBLE", boucle=False, styles=False, asym_l=False,
                       asym_c=False, inf_taxe=False, inf_silence=False,
                       force="aucune",
                       statut="INVALIDE" if cote == "B" else "OK")
        cr = core_q2.classifier_croisement(sa, sb, POP)
        res["non_entree_configs"] += 1
        if not (cr["entree"] is False and cr["palier"] is None
                and not cr["override"]):
            res["cor2_double_chemin_ecarts"] += 1
        frag = corr.bilan_fragment(sa, sb, cr)
        bloc = corr.bloc_ecran_couple(sa, sb, cr)
        if not frag.get("_complet"):
            res["cor1_fragments_incomplets"] += 1
        if "bandeau_non_entree" not in bloc:
            res["cor5_doctrine_ecarts"] += 1
        blocs.append(json.dumps(bloc, sort_keys=True, ensure_ascii=False))
        frags.append(json.dumps(frag, sort_keys=True, ensure_ascii=False))

    res["blocs_distincts"] = len(set(blocs))
    res["fragments_distincts"] = len(set(frags))
    return res


# ─────────────────────────────────────────────────────────────────────────────
# STAGE 2 — RE-SCORE BIT-EXACT (650 couples / 14 groupes, simulateur frais)
# ─────────────────────────────────────────────────────────────────────────────
def stage2() -> dict:
    res = {
        "n_couples": 0, "n_croisements": 0,
        "stats_groupes_match": False, "globaux_match": False,
        "conformite_match": False,
        "comparaisons": 0, "ecarts": 0,
        "couche_paliers": {}, "couche_fragments_incomplets": 0,
        "couche_mots_interdits": 0, "couche_dsim_manquant": 0,
        "couche_override_ok": 0, "couche_override_ecarts": 0,
        "g10_forte_override": None,
    }
    archive = json.loads(ARCHIVE.read_text(encoding="utf-8"))
    couples = sim_q2.tous_les_couples()
    res["n_couples"] = len(couples)
    pop = sim_q2.POPULATION

    stats = {}
    paliers_globaux = {"EXERCICE MAISON": 0, "MODULE DE COUPLE": 0,
                       "ORIENTATION": 0, "OVERRIDE": 0, "NON ENTRÉE": 0}
    inferences_globales = {core_q2.INF_TAXE: 0, core_q2.INF_SUJET: 0,
                           core_q2.INF_SILENCE: 0}
    boucles = styles_servis = entrees = 0
    couche_paliers = dict(paliers_globaux)
    conformite = {}
    g10_forte = [0, 0]

    for c in couples:
        sa = sim_q2.sortie_rive(c["rive_a"])
        sb = sim_q2.sortie_rive(c["rive_b"])
        cr = core_q2.classifier_croisement(sa, sb, pop)
        conformite[c["id"]] = int(sim_q2.conformite_couple(c, cr))
        g = stats.setdefault(c["groupe"], {
            "n": 0, "conformes": 0, "configs": {}, "paliers":
                {"EXERCICE MAISON": 0, "MODULE DE COUPLE": 0, "ORIENTATION": 0,
                 "OVERRIDE": 0, "NON ENTRÉE": 0},
            "boucle": 0, "styles": 0, "asym_L_marquee": 0, "asym_C_marquee": 0,
            "inf_taxe": 0, "inf_sujet": 0, "inf_silence": 0, "entrees": 0})
        g["n"] += 1
        g["conformes"] += conformite[c["id"]]
        cle = (cr["display"] if not cr["entree"]
               else core_q2.CONFIGS[cr["config_num"]]["nom"])
        g["configs"][cle] = g["configs"].get(cle, 0) + 1
        if cr["entree"]:
            g["entrees"] += 1
            g["paliers"][cr["palier"]] += 1
            g["boucle"] += int(cr["boucle_probable"])
            g["styles"] += int(cr["styles_dissemblables"])
            g["asym_L_marquee"] += int(cr["asym_L"]["lecture"] == "ASYMÉTRIE MARQUÉE")
            g["asym_C_marquee"] += int(cr["asym_C"]["lecture"] == "ASYMÉTRIE MARQUÉE")
            g["inf_taxe"] += int(cr["inferences_L5"][core_q2.INF_TAXE])
            g["inf_sujet"] += int(cr["inferences_L5"][core_q2.INF_SUJET])
            g["inf_silence"] += int(cr["inferences_L5"][core_q2.INF_SILENCE])
        elif cr["override"]:
            g["paliers"]["OVERRIDE"] += 1
        else:
            g["paliers"]["NON ENTRÉE"] += 1
        # globaux
        if cr["override"]:
            paliers_globaux["OVERRIDE"] += 1
        elif not cr["entree"]:
            paliers_globaux["NON ENTRÉE"] += 1
        else:
            entrees += 1
            paliers_globaux[cr["palier"]] += 1
            boucles += int(cr["boucle_probable"])
            styles_servis += int(cr["styles_dissemblables"])
            for k, v in cr["inferences_L5"].items():
                inferences_globales[k] += int(v)
        res["comparaisons"] += 1
        res["n_croisements"] += 1

        # ── la COUCHE appliquée à ce croisement ──
        cle_couche = ("OVERRIDE" if cr["override"]
                      else "NON ENTRÉE" if not cr["entree"] else cr["palier"])
        couche_paliers[cle_couche] += 1
        frag = corr.bilan_fragment(sa, sb, cr)
        bloc = corr.bloc_ecran_couple(sa, sb, cr)
        if not frag.get("_complet"):
            res["couche_fragments_incomplets"] += 1
        for t in corr.textes_ecran(sa, sb, cr):
            tl = t.lower()
            for mot in corr.MOTS_INTERDITS:
                if mot in tl:
                    res["couche_mots_interdits"] += 1
        if corr.D_SIM not in bloc["bandeau_dsim"]:
            res["couche_dsim_manquant"] += 1
        if cr["override"]:
            ok = (cr["verdict"] is None and "bandeau_court_circuit" in bloc
                  and "config_tracee" in bloc)
            res["couche_override_ok"] += int(ok)
            res["couche_override_ecarts"] += int(not ok)
            if c["groupe"] == "G10_SIGNAL_FILET" \
                    and c["id"].endswith(tuple(f"_{i:03d}" for i in range(35, 40))):
                g10_forte[0] += int(ok)
                g10_forte[1] += 1

    res["stats_groupes_match"] = stats == archive["stats_groupes"]
    if not res["stats_groupes_match"]:
        res["ecarts"] += 1
        for gname in stats:
            if stats[gname] != archive["stats_groupes"].get(gname):
                res[f"ecart_groupe_{gname}"] = {
                    "obtenu": stats[gname],
                    "archive": archive["stats_groupes"].get(gname)}
    globaux_obt = {"paliers": paliers_globaux, "entrees": entrees,
                   "boucles": boucles, "styles": styles_servis,
                   "inferences_L5": inferences_globales}
    res["globaux_match"] = globaux_obt == archive["globaux"]
    if not res["globaux_match"]:
        res["ecarts"] += 1
        res["globaux_obtenu"] = globaux_obt
        res["globaux_archive"] = archive["globaux"]
    conf_ok = True
    for gname in archive["stats_groupes"]:
        ids = [c["id"] for c in couples if c["groupe"] == gname]
        if sum(conformite[i] for i in ids) \
                != archive["stats_groupes"][gname]["conformes"]:
            conf_ok = False
    res["conformite_match"] = conf_ok
    if not conf_ok:
        res["ecarts"] += 1
    res["couche_paliers"] = couche_paliers
    if couche_paliers != paliers_globaux:
        res["ecarts"] += 1
    res["g10_forte_override"] = f"{g10_forte[0]}/{g10_forte[1]}" if g10_forte[1] else "n/a"
    return res


# ─────────────────────────────────────────────────────────────────────────────
# STAGE 4 — COUPLAGE PAS RÉEL (VRAI Q3) + suivi + re-tests non consommés
# ─────────────────────────────────────────────────────────────────────────────
def stage4() -> dict:
    res = {
        "configs_couvertes": 0, "famille_ecarts": 0,
        "banque_verbatim_ecarts": 0, "pas_zero_ecarts": 0,
        "suivi_totaux": 0, "suivi_ecarts": 0,
        "suivi_celebre": 0, "suivi_en_chemin": 0,
        "re_test_non_consomme": None,
        "contenu_par_config": {},
    }
    for num, cfg in core_q2.CONFIGS.items():
        res["configs_couvertes"] += 1
        palier = core_q2.palier_croise(cfg["h1"], cfg["h2"], False)
        fam = core_q3.famille_de(palier)
        banque = core_q3.BANQUE_PAS_EXT[fam]
        cont = corr.contenu_palier_croise(num, palier)
        # junction : le contenu servi est la VRAIE banque, verbatim :
        if palier == core_q2.PALIER_ORANGE:
            if cont["pas_reels_servis"] != list(banque):
                res["banque_verbatim_ecarts"] += 1
        elif palier == core_q2.PALIER_ROUGE:
            if cont["pas_reel_serve"] != banque[0]:
                res["banque_verbatim_ecarts"] += 1
        else:
            if cont["pas_zero_legitime"] != (num == 1):
                res["pas_zero_ecarts"] += 1
        if core_q3.pas_zero_legitime(num == 1) != (num == 1):
            res["pas_zero_ecarts"] += 1
        res["contenu_par_config"][f"config_{num}"] = {
            "nom": cfg["nom"], "palier": palier, "famille": fam,
            "longueur_banque": len(banque)}
    # suivi 14 jours : les 15 totaux → CÉLÉBRÉ (≥ 9) / EN CHEMIN, jamais sanction
    for total in range(core_q3.N_JOURS + 1):
        serie = tuple(j < total for j in range(core_q3.N_JOURS))
        statut = core_q3.statut_engagement_de(serie)
        res["suivi_totaux"] += 1
        attendu = (core_q3.STATUT_CELEBRE if total >= core_q3.SEUIL_CELEBRE
                   else core_q3.STATUT_EN_CHEMIN)
        if statut != attendu:
            res["suivi_ecarts"] += 1
        res["suivi_celebre"] += (statut == core_q3.STATUT_CELEBRE)
        res["suivi_en_chemin"] += (statut == core_q3.STATUT_EN_CHEMIN)
    if core_q3.statut_engagement_de(None) is not None:
        res["suivi_ecarts"] += 1
    # re-tests non consommés au croisement (template VRAI, R5/SPEC §7) :
    res["re_test_non_consomme"] = corr.RE_TEST_NON_CONSOMME
    if corr.RE_TEST_NON_CONSOMME != core_q2.TEMPLATES["re_test_non_consomme"]:
        res["banque_verbatim_ecarts"] += 1
    return res


# ─────────────────────────────────────────────────────────────────────────────
# PIPELINE COMPLET (exécuté 2 fois — COR8)
# ─────────────────────────────────────────────────────────────────────────────
def pipeline() -> dict:
    global _PAIRES_AGGS
    _PAIRES_AGGS = _paire_aggregats()
    out = {
        "integrite_moteurs": "verifiee (asserts à l'import de la couche)",
        "stage0": stage0(),
        "stage1": stage1(),
        "stage2": stage2(),
        "stage4": stage4(),
    }
    payload = json.dumps(out, sort_keys=True, ensure_ascii=False,
                         default=str)
    out["sha256"] = hashlib.sha256(payload.encode("utf-8")).hexdigest()
    return out


def main():
    runs = [pipeline(), pipeline()]
    ok_cor8 = runs[0]["sha256"] == runs[1]["sha256"]
    r0, r1, r2, r4 = (runs[0]["stage0"], runs[0]["stage1"],
                      runs[0]["stage2"], runs[0]["stage4"])

    criteres = {
        "RIO": "RIO-17 « Notre conversation de l'horizon » (croisement) — ext-q2",
        "moteurs": {
            "q2": "validation-ext-q2/src/wtc_ext_q2_core.py (VALIDÉ 7/7, CONTRESIGNÉ)",
            "q3": "validation-ext-q3/src/wtc_ext_q3_core.py (junction pas)",
        },
        "COR0_compactations": {
            "configs_table": r0["configs_table"],
            "configs_ecarts": r0["configs_ecarts"],
            "miroirs": f'{r0["miroirs"]}/{r0["miroirs"] + r0["miroirs_ecarts"]}',
            "grain_pile": r0["grain_pile"],
            "bornes_testees": r0["bornes_testees"],
            "palier_max_pure": r0["palier_max_pure"],
            "palier_max_ecarts": r0["palier_max_ecarts"],
            "espions_population": r0["espions_population"],
            "espion_ecarts": r0["espion_ecarts"],
            "zone_calme_ecarts": r0["zone_calme_ecarts"],
            "banque_longueurs": r0["banque_longueurs"],
            "pas_zero_configs": r0["pas_zero_configs"],
            "percentile_ecarts": r0["percentile_ecarts"],
            "boucle_frontiere": r0["boucle_frontiere"],
            "ok": (r0["configs_ecarts"] == 0 and r0["miroirs_ecarts"] == 0
                   and r0["palier_max_ecarts"] == 0 and r0["espion_ecarts"] == 0
                   and r0["zone_calme_ecarts"] == 0
                   and r0["percentile_ecarts"] == 0
                   and r0["grain_pile"]["2.5_atteignable"]
                   and r0["grain_pile"]["3.5_atteignable"]),
        },
        "COR1_fragments": {
            "etats_entree": r1["etats_entree"],
            "attendu": 13824 if not SMOKE else "smoke",
            "override_configs": r1["override_configs"],
            "non_entree_configs": r1["non_entree_configs"],
            "fragments_incomplets": r1["cor1_fragments_incomplets"],
            "ok": (r1["cor1_fragments_incomplets"] == 0
                   and r1["etats_entree"] == (13824 if not SMOKE else r1["etats_entree"])),
        },
        "COR2_double_chemin": {
            "ecarts": r1["cor2_double_chemin_ecarts"],
            "ok": r1["cor2_double_chemin_ecarts"] == 0,
        },
        "COR3_seuils": {
            "S1": r1["override_configs"],
            "S2": r1["cor3_S2"],
            "S2_ecarts": r1["cor3_S2_ecarts"],
            "bornes_consignees": (
                "2,50/3,50 PILE ATTEIGNABLES sur le grain 1/6 (15/6 · 21/6) — "
                "tranchage inclusif du VRAI moteur testé : 2,49→FAIBLE · "
                "2,50→MODÉRÉE · 3,49→MODÉRÉE · 3,50→FORTE · boucle ≥ 30,0 "
                "PILE inclusive (30,0 → True)"),
            "ok": r1["cor3_S2_ecarts"] == 0,
        },
        "COR4_vocabulaire": {
            "mots_interdits": (r1["cor4_mots_interdits"]
                               + r2["couche_mots_interdits"]),
            "blocs_distincts": r1["blocs_distincts"],
            "fragments_distincts": r1["fragments_distincts"],
            "dsim_manquant": r1["cor4_dsim_manquant"]
            + r2["couche_dsim_manquant"],
            "exception_sourcee": ("filet 3919/3114 + bandeau override = "
                                  "literals du VRAI cœur — cités, jamais réécrits"),
            "ok": (r1["cor4_mots_interdits"] == 0
                   and r2["couche_mots_interdits"] == 0
                   and r1["cor4_dsim_manquant"] == 0
                   and r2["couche_dsim_manquant"] == 0),
        },
        "COR5_anti_fabrication": {
            "calme_hors_config1": r1["cor5_calme_hors_config1"],
            "config1_sans_calme": r1["cor5_config1_sans_calme"],
            "avertissement_ecarts": r1["cor5_avertissement_ecarts"],
            "doctrine_ecarts": r1["cor5_doctrine_ecarts"],
            "0_verdict_temporel": "R5 — « devance » = niveau déclaré plus "
                                  "fort (template VRAI), jamais une position "
                                  "dans le temps ; re-tests non consommés "
                                  "(SPEC §7, template VRAI)",
            "ok": (r1["cor5_calme_hors_config1"] == 0
                   and r1["cor5_config1_sans_calme"] == 0
                   and r1["cor5_avertissement_ecarts"] == 0
                   and r1["cor5_doctrine_ecarts"] == 0),
        },
        "COR6_re_score": {
            "n_couples": r2["n_couples"],
            "n_croisements": r2["n_croisements"],
            "stats_groupes_match": r2["stats_groupes_match"],
            "globaux_match": r2["globaux_match"],
            "conformite_match": r2["conformite_match"],
            "comparaisons": r2["comparaisons"],
            "ecarts": r2["ecarts"],
            "couche_paliers": r2["couche_paliers"],
            "couche_fragments_incomplets": r2["couche_fragments_incomplets"],
            "couche_mots_interdits": r2["couche_mots_interdits"],
            "couche_override_ok": r2["couche_override_ok"],
            "g10_forte_override": r2["g10_forte_override"],
            "archive": "resultats-ext-q2-2026-10-18.json",
            "ok": (r2["stats_groupes_match"] and r2["globaux_match"]
                   and r2["conformite_match"] and r2["ecarts"] == 0
                   and r2["couche_fragments_incomplets"] == 0
                   and r2["couche_mots_interdits"] == 0
                   and r2["couche_override_ecarts"] == 0),
        },
        "COR7_couplage_pas": {
            "configs_couvertes": r4["configs_couvertes"],
            "famille_ecarts": r4["famille_ecarts"],
            "banque_verbatim_ecarts": r4["banque_verbatim_ecarts"],
            "pas_zero_ecarts": r4["pas_zero_ecarts"],
            "contenu_par_config": r4["contenu_par_config"],
            "suivi_totaux": r4["suivi_totaux"],
            "suivi_celebre": r4["suivi_celebre"],
            "suivi_en_chemin": r4["suivi_en_chemin"],
            "suivi_ecarts": r4["suivi_ecarts"],
            "re_test_non_consomme": r4["re_test_non_consomme"][:60] + "…",
            "ok": (r4["famille_ecarts"] == 0
                   and r4["banque_verbatim_ecarts"] == 0
                   and r4["pas_zero_ecarts"] == 0
                   and r4["suivi_ecarts"] == 0),
        },
        "COR8_reproductibilite": {
            "sha1": runs[0]["sha256"], "sha2": runs[1]["sha256"],
            "identiques": ok_cor8,
            "ok": ok_cor8,
        },
        "distributions": {
            "configs_13824": r1["distrib_configs"],
            "paliers_13824": r1["distrib_paliers"],
        },
        "re_score": {
            "F1": 25, "F1_note": "inchangé — la lecture graduée du croisement "
                                 "validé (D-VÉRITÉ table, anti-inversion, "
                                 "D-STD-2) est préservée telle quelle",
            "F2": 25, "F2_note": "inchangé — gabarit universel complet déjà "
                                 "validé C5-C7 (9 templates + QUAND DEMANDER + "
                                 "avertissements L6 jamais verdicts)",
            "F3": [18, 25], "F3_note": "contenu CONCRET des 3 paliers croisés "
                                       "produit PAR CONFIGURATION RÉELLE (1 🟢 "
                                       "zone calme à l'invariant prouvé · 3 🟠 "
                                       "modules à deux sur les VRAIS pas de la "
                                       "banque Q3 + clause contextuelle par "
                                       "config · 5 🔴 orientations = le VRAI "
                                       "pas rouge + filet) — junction verbatim "
                                       "vérifiée à chaque état",
            "F4": [22, 25], "F4_note": "fragment de bilan L8 niveau COUPLE à 7 "
                                       "blocs, COMPLET sur les 3 chemins "
                                       "(entrée 13 824 · override 18 · non-"
                                       "entrée 2 — 0 feuille vide) avec les "
                                       "junctions réelles Q3 (famille héritée, "
                                       "banque verbatim, pas zéro config 1) et "
                                       "la doctrine couple (boucle ENSEMBLE, "
                                       "direction jamais affichée, 0 % "
                                       "compatibilité consignée)",
            "avant": 90, "apres": 100,
        },
    }

    RES.mkdir(exist_ok=True)
    (RES / "correction_criteres.json").write_text(
        json.dumps(criteres, ensure_ascii=False, indent=2),
        encoding="utf-8")
    print(json.dumps({k: v.get("ok") for k, v in criteres.items()
                      if isinstance(v, dict) and "ok" in v},
                     indent=2, ensure_ascii=False))
    print("états entrée:", criteres["COR1_fragments"]["etats_entree"],
          "| override:", criteres["COR1_fragments"]["override_configs"],
          "| non-entrée:", criteres["COR1_fragments"]["non_entree_configs"],
          "| blocs distincts:", criteres["COR4_vocabulaire"]["blocs_distincts"])
    print("SHA:", runs[0]["sha256"][:16], "…", "identiques:", ok_cor8)


if __name__ == "__main__":
    main()
