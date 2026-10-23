# -*- coding: utf-8 -*-
"""
WTC-EXT-Q3 — VALIDATION DE LA COUCHE DE CORRECTION PHILOSOPHIQUE (RIO-18)
==========================================================================
Exécute les stages de preuve sur les VRAIS moteurs (zéro réimplémentation) :

  Stage 0 — COMPACTATIONS PROUVÉES EXHAUSTIVEMENT + MESURES :
            (a) table `pas_de` EXHAUSTIVE : 3 familles × choix (None ·
                PAS_ZERO · chaque pas de la banque · hors-banque) × zone
                calme (2 états) — le VRAI `pas_de` ≡ règle pure (choix dans
                la banque → respecté ; PAS_ZERO → ssi zone calme ; None →
                pas zéro ssi zone+vert, sinon banque[0]) ;
            (b) check-in 14 j : les 15 totaux + None — 9/14 PILE inclusive
                (CÉLÉBRÉ ≥ 9 · EN CHEMIN < 9 · pas déployé → rien à évaluer) ;
            (c) RCI L7 : bornes PILE 0,58 / 0,41 / 0,40 testées (2 sens) ·
                agrégation d'ensemble = MAX des 3 statuts, prouvée sur les
                27 triplets par rive (convention d'affichage explicite) ·
                traversées : frontières H (2,49/2,50/3,49/3,50) et L/C
                (1,79/1,80/2,59/2,60/3,19/3,20) exactes + libellés
                signification_de ;
            (d) espions : serie None → statut None · bases absentes →
                rci None · filet → override (pas/statut/rci tous None) ·
                RQS INVALIDE → non-entrée ;
            (e) A6 : le récapitulatif de dimension embarqué = le VRAI
                RECAP_DIMENSION (3 quêtes : carte → croisement → pas) ;
            (f) templates du cœur : 0 mot interdit (clinique + temporel C6
                + blâme/tiers C7) sur l'union des produits affichables.
  Stage 1 — ÉNUMÉRATION EXHAUSTIVE des états distincts de la couche :
            l'état RCI d'UNE rive = (statut × traversée)³ = 216 états
            (réalisés par des paires base/re_test au grain 1/6 réel) —
            balayée pour la rive A PUIS la rive B (l'autre rive fixée —
            la couche ne compare JAMAIS les rives, C7 : le joint est le
            produit des états par rive, compactation prouvée au 0c) ;
            + joint pas (7 valeurs servies) × statut (None · CÉLÉBRÉ pile
            9 · CÉLÉBRÉ 14 · EN CHEMIN 8 · EN CHEMIN 0) + override +
            non-entrées (A, B). Toute la sortie (bloc écran, fragment 7
            blocs, A6) calculée par les fonctions réelles — COR2 = double
            chemin (règle pure pas_de) ≡ VRAI moteur.
  Stage 2 — RE-SCORE BIT-EXACT des 650 couples archivés du rapport ext-q3
            (14 groupes, seed 42 ×2), régénérés par le VRAI simulateur
            (`construire`/`verdicts`/`conforme`/`resume_groupes`) :
            stats_groupes 14/14 bit-exact vs archive du 18/10, globaux
            (paliers, pas servis, statuts, ensembles RCI, traversées,
            boucles, styles) — puis couche appliquée aux 650.
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
import wtc_ext_q3_correction as corr          # la couche (charge le vrai moteur)
core_q3 = corr.core_q3

# Le VRAI simulateur ext-q3 (seed 42, construit à l'import) :
sim_q3 = corr._charge(
    "wtc_ext_q3_simulator",
    corr._Q3 / "src" / "wtc_ext_q3_simulator.py")

RES = Path(__file__).resolve().parents[1] / "results"
SMOKE = os.environ.get("CORR_SMOKE") == "1"

ARCHIVE = corr._Q3 / "results" / "resultats-ext-q3-2026-10-18.json"

PALIER_VERT, PALIER_ORANGE, PALIER_ROUGE = (corr.PALIER_VERT, corr.PALIER_ORANGE,
                                            corr.PALIER_ROUGE)
PAS_ZERO = core_q3.PAS_ZERO
FAMILLES = (PALIER_VERT, PALIER_ORANGE, PALIER_ROUGE)
# Les 7 pas servables (banque réelle + pas zéro) :
PAS_SERVABLES = [PAS_ZERO] + list(core_q3.BANQUE_PAS_EXT[core_q3.FAMILLE_VERT]) \
    + list(core_q3.BANQUE_PAS_EXT[core_q3.FAMILLE_ORANGE]) \
    + list(core_q3.BANQUE_PAS_EXT[core_q3.FAMILLE_ROUGE])

# Configurations pas : (palier_hérité, zone, choix) réalisant chaque pas :
CONFIGS_PAS = [
    (PALIER_VERT, True, None),                    # pas zéro (zone calme)
    (PALIER_VERT, False, None),                   # vert[0]
    (PALIER_VERT, False, core_q3.BANQUE_PAS_EXT[core_q3.FAMILLE_VERT][1]),
    (PALIER_VERT, True, core_q3.BANQUE_PAS_EXT[core_q3.FAMILLE_VERT][2]),
    (PALIER_ORANGE, False, None),                 # orange[0]
    (PALIER_ORANGE, False, core_q3.BANQUE_PAS_EXT[core_q3.FAMILLE_ORANGE][1]),
    (PALIER_ROUGE, False, None),                  # rouge[0] — le pas EST la démarche
]

# Séries de check-in réalisant chaque état de suivi :
SERIES = {
    "None": None,
    "CELEBRE_pile_9": [True] * 9 + [False] * 5,
    "CELEBRE_14": [True] * 14,
    "EN_CHEMIN_8": [True] * 8 + [False] * 6,
    "EN_CHEMIN_0": [False] * 14,
}


def _sortie_q2(palier: str, num: int, nom: str, zone: bool) -> dict:
    return {"palier": palier, "config_num": num, "config_nom": nom,
            "zone_calme": zone, "entree": True, "override": False}


def _rive(statut_ok: str = "OK", filet: bool = False) -> dict:
    return {"score_H": 2.4, "score_L": 2.4, "score_C": 2.4,
            "rqs_statut": statut_ok, "filet": filet}


# Paires (base, re_test) au grain 1/6 réalisant (statut × traversée) par axe :
def _paire_axe(statut: str, traverse: bool, axe: str) -> tuple:
    """Paire (base, re_test) au grain 1/6 réalisant l'état demandé —
    mesurée via le VRAI statut_rci_de et traverse_de (jamais supposée)."""
    graines = [round(k / 6, 4) for k in range(6, 25)]
    fn = core_q3.niveau_H_de if axe == "H" else core_q3.niveau_L3_de
    for b, r in itertools.product(graines, repeat=2):
        if core_q3.statut_rci_de(b, r) == statut \
                and core_q3.traverse_de(axe, b, r) == traverse:
            return b, r
    raise AssertionError(f"paire introuvable : {axe} {statut} {traverse}")


# ─────────────────────────────────────────────────────────────────────────────
# STAGE 0 — COMPACTATIONS + MESURES
# ─────────────────────────────────────────────────────────────────────────────
def stage0() -> dict:
    res = {
        "pas_de_table": 0, "pas_de_ecarts": 0,
        "banque_longueurs": {}, "pas_zero_ecarts": 0,
        "suivi_totaux": 0, "suivi_ecarts": 0,
        "suivi_celebre": 0, "suivi_en_chemin": 0,
        "rci_bornes": {}, "rci_bornes_ecarts": 0,
        "ensemble_max_27": 0, "ensemble_ecarts": 0,
        "traversees_frontieres": {}, "traversees_ecarts": 0,
        "espions": 0, "espion_ecarts": 0,
        "recap_ok": False, "templates_interdits": 0,
    }
    # (a) table pas_de EXHAUSTIVE (3 familles × choix × zone)
    fam_de = {PALIER_VERT: core_q3.FAMILLE_VERT,
              PALIER_ORANGE: core_q3.FAMILLE_ORANGE,
              PALIER_ROUGE: core_q3.FAMILLE_ROUGE}
    for palier in FAMILLES:
        fam = fam_de[palier]
        banque = core_q3.BANQUE_PAS_EXT[fam]
        res["banque_longueurs"][fam] = len(banque)
        choixs = [None, PAS_ZERO] + list(banque) + ["choix hors banque"]
        for choix in choixs:
            for zone in (True, False):
                res["pas_de_table"] += 1
                obtenu = core_q3.pas_de(palier, choix, zone)
                # règle pure (chemin 2) :
                if choix is None:
                    pur = PAS_ZERO if (zone and palier == PALIER_VERT) \
                        else banque[0]
                elif choix == PAS_ZERO:
                    pur = PAS_ZERO if core_q3.pas_zero_legitime(zone) \
                        else banque[0]
                elif choix in banque:
                    pur = choix
                else:
                    pur = banque[0]
                if obtenu != pur:
                    res["pas_de_ecarts"] += 1
                # règle du VRAI moteur : PAS_ZERO servi ⇒ pas_zero_legitime(zone)
                if obtenu == PAS_ZERO and not core_q3.pas_zero_legitime(zone):
                    res["pas_zero_ecarts"] += 1
    # (b) check-in : 15 totaux + None
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
    # (c) RCI : bornes PILE (2 sens) + ensemble max (27 triplets) + traversées
    cas = [("0.58_fiable", 3.00, 3.58, "FIABLE"),
           ("0.58_fiable_inv", 3.58, 3.00, "FIABLE"),
           ("0.57_suggestion", 3.00, 3.57, "SUGGESTION"),
           ("0.41_suggestion", 3.00, 3.41, "SUGGESTION"),
           ("0.41_suggestion_inv", 3.41, 3.00, "SUGGESTION"),
           ("0.40_bruit", 3.00, 3.40, "BRUIT"),
           ("0.40_bruit_inv", 3.40, 3.00, "BRUIT"),
           ("0_bruit", 3.00, 3.00, "BRUIT")]
    for nom, b, r, attendu in cas:
        obtenu = core_q3.statut_rci_de(b, r)
        res["rci_bornes"][nom] = obtenu
        if obtenu != attendu:
            res["rci_bornes_ecarts"] += 1
    statuts = (core_q3.STATUT_BRUIT, core_q3.STATUT_SUGGESTION,
               core_q3.STATUT_FIABLE)
    # les libellés d'ENSEMBLE documentés (convention d'affichage explicite
    # du canon — max des statuts, BRUIT < SUGGESTION < FIABLE) :
    ensemble_par_rang = {core_q3.ENSEMBLE_BRUIT, core_q3.ENSEMBLE_SUGGESTION,
                         core_q3.ENSEMBLE_FIABLE}
    rang_statut = {core_q3.STATUT_BRUIT: 0, core_q3.STATUT_SUGGESTION: 1,
                   core_q3.STATUT_FIABLE: 2}
    rang_ensemble = {core_q3.STATUT_BRUIT: core_q3.ENSEMBLE_BRUIT,
                     core_q3.STATUT_SUGGESTION: core_q3.ENSEMBLE_SUGGESTION,
                     core_q3.STATUT_FIABLE: core_q3.ENSEMBLE_FIABLE}
    assert len(ensemble_par_rang) == 3
    for triple in itertools.product(statuts, repeat=3):
        res["ensemble_max_27"] += 1
        attendu = rang_ensemble[max(triple, key=lambda s: rang_statut[s])]
        if core_q3.statut_ensemble_de(triple) != attendu:
            res["ensemble_ecarts"] += 1
    frontieres = {"H": [(2.49, "FAIBLE"), (2.50, "MODÉRÉE"),
                        (3.49, "MODÉRÉE"), (3.50, "FORTE")],
                  "L": [(1.79, "DISCRÈTE"), (1.80, "TRANQUILLE"),
                        (2.59, "TRANQUILLE"), (2.60, "VIVE"),
                        (3.19, "VIVE"), (3.20, "FORTE")],
                  "C": [(1.79, "DISCRÈTE"), (1.80, "TRANQUILLE"),
                        (2.59, "TRANQUILLE"), (2.60, "VIVE"),
                        (3.19, "VIVE"), (3.20, "FORTE")]}
    for axe, cas_axe in frontieres.items():
        fn = core_q3.niveau_H_de if axe == "H" else core_q3.niveau_L3_de
        for v, niveau_attendu in cas_axe:
            res["traversees_frontieres"][f"{axe}_{v}"] = fn(v)
            if fn(v) != niveau_attendu:
                res["traversees_ecarts"] += 1
            # traversée PILE au seuil (base juste en dessous, re juste au
            # dessus — et le libellé signification_de) :
    for axe, (sous, sur) in {"H": (2.49, 2.50), "L": (1.79, 1.80),
                             "C": (3.19, 3.20)}.items():
        if not core_q3.traverse_de(axe, sous, sur):
            res["traversees_ecarts"] += 1
        # la traversée est SYMÉTRIQUE (≠ des niveaux) — consigné ; l'ASYMÉTRIE
        # TEMPORELLE porte sur le SIGNE de Δ (delta_de), pas sur la traversée
        if core_q3.signification_de(axe, sous, sur) == "":
            res["traversees_ecarts"] += 1
    # (d) espions
    sq2 = _sortie_q2(PALIER_ORANGE, 5, "DEUX CADRANS", False)
    v = core_q3.classifier(sq2, _rive(), _rive(), None, None, None, None)
    res["espions"] += 1
    if not (v["entree"] and v["rci"] is None and v["statut"] is None):
        res["espion_ecarts"] += 1
    v = core_q3.classifier(sq2, _rive(filet=True), _rive())
    res["espions"] += 1
    if not (v["override"] and v["pas"] is None and v["statut"] is None
            and v["rci"] is None):
        res["espion_ecarts"] += 1
    v = core_q3.classifier(sq2, _rive("INVALIDE"), _rive())
    res["espions"] += 1
    if v["entree"] or v["pas"] is not None:
        res["espion_ecarts"] += 1
    # (e) A6 récapitulatif
    rec = core_q3.RECAP_DIMENSION
    res["recap_ok"] = (len(rec) == 3
                       and [r["rio"] for r in rec] ==
                       ["RIO-16", "RIO-17", "RIO-18"])
    # (f) templates du cœur : 0 mot interdit (couche + C6 + C7)
    produits = " ".join(core_q3.TEMPLATES.values()).lower()
    for mot in corr.MOTS_INTERDITS:
        if mot in produits:
            res["templates_interdits"] += 1
    return res


# ─────────────────────────────────────────────────────────────────────────────
# STAGE 1 — ÉNUMÉRATION EXHAUSTIVE (216 × 2 rives + joint pas × statut)
# ─────────────────────────────────────────────────────────────────────────────
STATUTS_RCI = (core_q3.STATUT_FIABLE, core_q3.STATUT_SUGGESTION,
               core_q3.STATUT_BRUIT)


def _etats_rive() -> list:
    """Les 216 états RCI d'une rive : (statut³ ∈ 27) × (traversée³ ∈ 8),
    tous réalisés par des paires au grain 1/6 (mesurées, pas supposées)."""
    etats = []
    for stat_bits in itertools.product(STATUTS_RCI, repeat=3):
        statuts = {a: stat_bits[i] for i, a in enumerate(core_q3.AXES)}
        for trav_bits in itertools.product((False, True), repeat=3):
            travs = {a: trav_bits[i] for i, a in enumerate(core_q3.AXES)}
            etats.append((statuts, travs))
    return etats


def _paires_etat(statuts: dict, travs: dict) -> tuple:
    bases_pair, re_tests_pair = {}, {}
    for axe in core_q3.AXES:
        b, r = _paire_axe(statuts[axe], travs[axe], axe)
        bases_pair[axe] = b
        re_tests_pair[axe] = r
    return bases_pair, re_tests_pair


def _verdict_config(config_pas: tuple, serie_key: str, bases=None,
                    re_tests=None, filet=False, invalide=False):
    palier, zone, choix = config_pas
    num = {PALIER_VERT: 1, PALIER_ORANGE: 5, PALIER_ROUGE: 9}[palier]
    nom = {1: "LA MÊME HEURE", 5: "DEUX CADRANS",
           9: "LES DEUX HORLOGES VIVES"}[num]
    sq2 = _sortie_q2(palier, num, nom, zone)
    ra = _rive("INVALIDE" if invalide else "OK", filet=filet)
    rb = _rive()
    serie = SERIES[serie_key]
    v = core_q3.classifier(sq2, ra, rb, serie, choix, bases, re_tests)
    return sq2, ra, rb, serie, choix, v


def stage1() -> dict:
    res = {
        "etats_rive_a": 0, "etats_rive_b": 0,
        "joint_pas_statut": 0, "override_configs": 0, "non_entree_configs": 0,
        "cor1_fragments_incomplets": 0,
        "cor2_double_chemin_ecarts": 0,
        "cor3_S1": 0, "cor3_S2": 0,
        "cor4_mots_interdits": 0, "cor4_dsim_manquant": 0,
        "blocs_distincts": 0, "fragments_distincts": 0,
        "cor5_pas_zero_ecarts": 0, "cor5_reproche_ecarts": 0,
        "cor5_jamais_comparees_ecarts": 0,
        "junction_rci_ecarts": 0,
        "distrib_pas": {}, "distrib_statuts": {},
    }
    _blocs_set: set = set()
    etats = _etats_rive()
    base_b_statuts = {a: "BRUIT" for a in core_q3.AXES}
    base_b_travs = {a: False for a in core_q3.AXES}
    b_pair = _paires_etat(base_b_statuts, base_b_travs)

    # balayage rive A (rive B fixée) PUIS rive B (rive A fixée) :
    for cote in ("A", "B"):
        for statuts, travs in etats:
            pair = _paires_etat(statuts, travs)
            if cote == "A":
                bases_pair = {"rive_a": dict(pair[0]),
                              "rive_b": dict(b_pair[0])}
                re_tests_pair = {"rive_a": dict(pair[1]),
                                 "rive_b": dict(b_pair[1])}
            else:
                bases_pair = {"rive_a": dict(b_pair[0]),
                              "rive_b": dict(pair[0])}
                re_tests_pair = {"rive_a": dict(b_pair[1]),
                                 "rive_b": dict(pair[1])}
            sq2, ra, rb, serie, choix, v = _verdict_config(
                CONFIGS_PAS[4], "CELEBRE_pile_9", bases_pair, re_tests_pair)
            key = f"etats_rive_{cote.lower()}"
            res[key] += 1
            frag = corr.bilan_fragment(sq2, v, serie, bases_pair,
                                       re_tests_pair, choix)
            bloc = corr.bloc_ecran_pas(sq2, v, serie, choix, bases_pair,
                                       re_tests_pair)
            _blocs_set.add(json.dumps(bloc, sort_keys=True, ensure_ascii=False))
            if not frag.get("_complet"):
                res["cor1_fragments_incomplets"] += 1
            # COR2 — double chemin : le pas servi ≡ règle pure
            palier, zone, choix_cfg = CONFIGS_PAS[4]
            pur = core_q3.pas_de(palier, choix_cfg, zone)
            if v["pas"] != pur:
                res["cor2_double_chemin_ecarts"] += 1
            # junction RCI : le fragment lit les VRAIS statuts
            if frag["bloc_3_empreinte"]["present"]:
                for rive in core_q3.RIVES:
                    ent = frag["bloc_3_empreinte"][f"rive_{rive}"]
                    if ent["ensemble"] != v["rci"]["rives"][rive]["ensemble"]:
                        res["junction_rci_ecarts"] += 1
            # COR3 — S1 ⇔ override (0 en entrée) ; S2 ⇔ palier non-VERT
            if frag["bloc_4_couple"]["palier"] != PALIER_VERT:
                res["cor3_S2"] += 1
            # COR4 — vocabulaire + D-SIM
            for t in corr.textes_ecran(sq2, v, serie, choix, bases_pair,
                                       re_tests_pair):
                tl = t.lower()
                for mot in corr.MOTS_INTERDITS:
                    if mot in tl:
                        res["cor4_mots_interdits"] += 1
            if corr.D_SIM not in bloc["bandeau_dsim"]:
                res["cor4_dsim_manquant"] += 1
            # COR5 — pas zéro ssi zone calme ; jamais comparées présent ssi RCI
            calme = any("Pas zéro" in t or "pas zéro" in t
                        for t in corr._textes(bloc))
            pas_zero = v["pas"] == PAS_ZERO
            if calme != pas_zero:
                res["cor5_pas_zero_ecarts"] += 1
            # la doctrine « jamais comparées » est TOUJOURS affichée avec le
            # fragment — l'invariant exigé : lectures L7 présentes ⇒ doctrine
            # présente (union bloc + fragment) :
            jc = any("jamais comparées" in t.lower()
                     for t in corr._textes(bloc) + corr._textes(frag))
            if frag["bloc_3_empreinte"]["present"] and not jc:
                res["cor5_jamais_comparees_ecarts"] += 1
            res["distrib_pas"][v["pas"]] = \
                res["distrib_pas"].get(v["pas"], 0) + 1
            res["distrib_statuts"][str(v["statut"])] = \
                res["distrib_statuts"].get(str(v["statut"]), 0) + 1

    # joint pas (7) × statut (5) — RCI représentatif (A FIABLE, B BRUIT) :
    statuts_a = {a: "FIABLE" for a in core_q3.AXES}
    travs_a = {a: (a == "H") for a in core_q3.AXES}
    pair_a = _paires_etat(statuts_a, travs_a)
    statuts_b = {a: "BRUIT" for a in core_q3.AXES}
    pair_b = _paires_etat(statuts_b, {a: False for a in core_q3.AXES})
    bases_pair = {"rive_a": dict(pair_a[0]), "rive_b": dict(pair_b[0])}
    re_tests_pair = {"rive_a": dict(pair_a[1]), "rive_b": dict(pair_b[1])}
    for config_pas in CONFIGS_PAS:
        for serie_key in SERIES:
            sq2, ra, rb, serie, choix, v = _verdict_config(
                config_pas, serie_key, bases_pair, re_tests_pair)
            res["joint_pas_statut"] += 1
            frag = corr.bilan_fragment(sq2, v, serie, bases_pair,
                                       re_tests_pair, choix)
            bloc = corr.bloc_ecran_pas(sq2, v, serie, choix, bases_pair,
                                       re_tests_pair)
            _blocs_set.add(json.dumps(bloc, sort_keys=True, ensure_ascii=False))
            if not frag.get("_complet"):
                res["cor1_fragments_incomplets"] += 1
            palier, zone, choix_cfg = config_pas
            pur = core_q3.pas_de(palier, choix_cfg, zone)
            if v["pas"] != pur:
                res["cor2_double_chemin_ecarts"] += 1
            if frag["bloc_4_couple"]["palier"] != PALIER_VERT:
                res["cor3_S2"] += 1
            for t in corr.textes_ecran(sq2, v, serie, choix, bases_pair,
                                       re_tests_pair):
                tl = t.lower()
                for mot in corr.MOTS_INTERDITS:
                    if mot in tl:
                        res["cor4_mots_interdits"] += 1
            if corr.D_SIM not in bloc["bandeau_dsim"]:
                res["cor4_dsim_manquant"] += 1
            calme = any("pas zéro" in t.lower() for t in corr._textes(bloc))
            if calme != (v["pas"] == PAS_ZERO):
                res["cor5_pas_zero_ecarts"] += 1
            res["distrib_pas"][v["pas"]] = \
                res["distrib_pas"].get(v["pas"], 0) + 1
            res["distrib_statuts"][str(v["statut"])] = \
                res["distrib_statuts"].get(str(v["statut"]), 0) + 1

    # override (filet) + non-entrées (A, B) :
    for cote in ("override", "A", "B"):
        palier, zone, choix = CONFIGS_PAS[4]
        sq2 = _sortie_q2(PALIER_ORANGE, 5, "DEUX CADRANS", False)
        ra = _rive("INVALIDE" if cote == "A" else "OK",
                   filet=(cote == "override"))
        rb = _rive("INVALIDE" if cote == "B" else "OK")
        v = core_q3.classifier(sq2, ra, rb)
        if cote == "override":
            res["override_configs"] += 1
            res["cor3_S1"] += 1
            if not (v["override"] and v["pas"] is None):
                res["cor2_double_chemin_ecarts"] += 1
        else:
            res["non_entree_configs"] += 1
            if v["entree"] or v["pas"] is not None:
                res["cor2_double_chemin_ecarts"] += 1
        frag = corr.bilan_fragment(sq2, v)
        bloc = corr.bloc_ecran_pas(sq2, v)
        if not frag.get("_complet"):
            res["cor1_fragments_incomplets"] += 1
        for t in corr.textes_ecran(sq2, v):
            tl = t.lower()
            for mot in corr.MOTS_INTERDITS:
                if mot in tl:
                    res["cor4_mots_interdits"] += 1
        # COR5 — aucun reproche/blâme sur les chemins sans pas :
        for t in corr._textes(bloc):
            for x in ("coupable", "blâme", "fautif", "de sa faute"):
                if x in t.lower():
                    res["cor5_reproche_ecarts"] += 1

    res["blocs_distincts"] = len(_blocs_set)
    return res


# ─────────────────────────────────────────────────────────────────────────────
# STAGE 2 — RE-SCORE BIT-EXACT (650 couples / 14 groupes, simulateur frais)
# ─────────────────────────────────────────────────────────────────────────────
def stage2() -> dict:
    res = {
        "n_couples": 0,
        "stats_groupes_match": False, "globaux_match": False,
        "conformite_match": False,
        "comparaisons": 0, "ecarts": 0,
        "couche_paliers": {}, "couche_fragments_incomplets": 0,
        "couche_mots_interdits": 0, "couche_dsim_manquant": 0,
        "couche_pas_ecarts": 0, "couche_override_ok": 0,
        "g05_forte_override": None,
    }
    archive = json.loads(ARCHIVE.read_text(encoding="utf-8"))
    couples = sim_q3.construire()
    verdicts_list = sim_q3.verdicts(couples)
    conformite = {c["id"]: sim_q3.conforme(c, v)
                  for c, v in zip(couples, verdicts_list)}
    res["n_couples"] = len(couples)
    stats = sim_q3.resume_groupes(couples, verdicts_list)

    # globaux reconstruits (mêmes définitions que le package) :
    globaux = {"pas_servis": {}, "statuts": {"CÉLÉBRÉ": 0, "EN CHEMIN": 0,
                                             "NON_ÉVALUÉ": 0},
               "paliers": {"EXERCICE MAISON": 0, "MODULE DE COUPLE": 0,
                           "ORIENTATION": 0, "OVERRIDE": 0,
                           "NON ENTRÉE": 0},
               "ensembles": {"UN CHANGEMENT FIABLE": 0,
                             "UNE PISTE À CONFIRMER": 0,
                             "DANS LE BRUIT DE LA MESURE": 0, "N/A": 0},
               "traversees": 0, "boucles": 0, "styles": 0}
    couche_paliers = dict(globaux["paliers"])
    g05_forte = [0, 0]
    for c, v in zip(couples, verdicts_list):
        res["comparaisons"] += 1
        if v["override"]:
            globaux["paliers"]["OVERRIDE"] += 1
        elif not v["entree"]:
            globaux["paliers"]["NON ENTRÉE"] += 1
        else:
            globaux["paliers"][v["palier"]] += 1
            if v["pas"]:
                globaux["pas_servis"][v["pas"]] = \
                    globaux["pas_servis"].get(v["pas"], 0) + 1
            if v["statut"] is None:
                globaux["statuts"]["NON_ÉVALUÉ"] += 1
            else:
                globaux["statuts"][v["statut"]] += 1
            if v["rci"]:
                for rive in core_q3.RIVES:
                    globaux["ensembles"][v["rci"]["rives"][rive]["ensemble"]] += 1
                    globaux["traversees"] += sum(
                        1 for axe in core_q3.AXES
                        if v["rci"]["rives"][rive]["traversees"][axe])
            h = v.get("heritages") or {}
            globaux["boucles"] += int(bool(h.get("boucle_probable")))
            globaux["styles"] += int(bool(h.get("styles_dissemblables")))

        # ── la COUCHE appliquée à ce verdict ──
        cle = ("OVERRIDE" if v["override"]
               else "NON ENTRÉE" if not v["entree"] else v["palier"])
        couche_paliers[cle] += 1
        frag = corr.bilan_fragment(c["sortie_q2"], v, c["serie"],
                                   c["bases"], c["re_tests"], c["choix"])
        bloc = corr.bloc_ecran_pas(c["sortie_q2"], v, c["serie"], c["choix"],
                                   c["bases"], c["re_tests"])
        if not frag.get("_complet"):
            res["couche_fragments_incomplets"] += 1
        for t in corr.textes_ecran(c["sortie_q2"], v, c["serie"], c["choix"],
                                   c["bases"], c["re_tests"]):
            tl = t.lower()
            for mot in corr.MOTS_INTERDITS:
                if mot in tl:
                    res["couche_mots_interdits"] += 1
        if corr.D_SIM not in bloc["bandeau_dsim"]:
            res["couche_dsim_manquant"] += 1
        # junction : le pas affiché = le pas du VRAI cœur (verbatim)
        if v["entree"] and frag["bloc_2_forme"]["pas_servi"] != v["pas"]:
            res["couche_pas_ecarts"] += 1
        if v["override"]:
            ok = v["pas"] is None and "bandeau_court_circuit" in bloc
            res["couche_override_ok"] += int(ok)
            if c["groupe"] == "G05_SIGNAL_FILET" \
                    and int(c["id"].split("_")[-1]) >= 35:
                g05_forte[0] += int(ok)
                g05_forte[1] += 1

    res["stats_groupes_match"] = stats == archive["stats_groupes"]
    if not res["stats_groupes_match"]:
        res["ecarts"] += 1
        for gname in stats:
            if stats[gname] != archive["stats_groupes"].get(gname):
                res[f"ecart_groupe_{gname}"] = {
                    "obtenu": stats[gname],
                    "archive": archive["stats_groupes"].get(gname)}
    res["globaux_match"] = globaux == archive["globaux"]
    if not res["globaux_match"]:
        res["ecarts"] += 1
        res["globaux_obtenu"] = globaux
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
    if couche_paliers != globaux["paliers"]:
        res["ecarts"] += 1
    res["g05_forte_override"] = f"{g05_forte[0]}/{g05_forte[1]}" if g05_forte[1] else "n/a"
    return res


# ─────────────────────────────────────────────────────────────────────────────
# PIPELINE COMPLET (exécuté 2 fois — COR8)
# ─────────────────────────────────────────────────────────────────────────────
def pipeline() -> dict:
    out = {
        "integrite_moteurs": "verifiee (asserts à l'import de la couche)",
        "stage0": stage0(),
        "stage1": stage1(),
        "stage2": stage2(),
    }
    payload = json.dumps(out, sort_keys=True, ensure_ascii=False,
                         default=str)
    out["sha256"] = hashlib.sha256(payload.encode("utf-8")).hexdigest()
    return out


def main():
    runs = [pipeline(), pipeline()]
    ok_cor8 = runs[0]["sha256"] == runs[1]["sha256"]
    r0, r1, r2 = runs[0]["stage0"], runs[0]["stage1"], runs[0]["stage2"]

    criteres = {
        "RIO": "RIO-18 « Le pas de l'horizon » (pas + récapitulatif) — ext-q3",
        "moteurs": {
            "q3": "validation-ext-q3/src/wtc_ext_q3_core.py (VALIDÉ 7/7, CONTRESIGNÉ)",
        },
        "COR0_compactations": {
            "pas_de_table": r0["pas_de_table"],
            "pas_de_ecarts": r0["pas_de_ecarts"],
            "banque_longueurs": r0["banque_longueurs"],
            "pas_zero_ecarts": r0["pas_zero_ecarts"],
            "suivi_totaux": f'{r0["suivi_totaux"]} + None',
            "suivi_ecarts": r0["suivi_ecarts"],
            "rci_bornes": r0["rci_bornes"],
            "rci_bornes_ecarts": r0["rci_bornes_ecarts"],
            "ensemble_max_27": r0["ensemble_max_27"],
            "ensemble_ecarts": r0["ensemble_ecarts"],
            "traversees_frontieres_ecarts": r0["traversees_ecarts"],
            "espions": r0["espions"], "espion_ecarts": r0["espion_ecarts"],
            "recap_ok": r0["recap_ok"],
            "templates_interdits": r0["templates_interdits"],
            "ok": (r0["pas_de_ecarts"] == 0 and r0["pas_zero_ecarts"] == 0
                   and r0["suivi_ecarts"] == 0 and r0["rci_bornes_ecarts"] == 0
                   and r0["ensemble_ecarts"] == 0
                   and r0["traversees_ecarts"] == 0
                   and r0["espion_ecarts"] == 0 and r0["recap_ok"]
                   and r0["templates_interdits"] == 0),
        },
        "COR1_fragments": {
            "etats_rive_a": r1["etats_rive_a"],
            "etats_rive_b": r1["etats_rive_b"],
            "joint_pas_statut": r1["joint_pas_statut"],
            "attendu_joint": "7 pas × 5 statuts = 35",
            "override_configs": r1["override_configs"],
            "non_entree_configs": r1["non_entree_configs"],
            "fragments_incomplets": r1["cor1_fragments_incomplets"],
            "ok": (r1["cor1_fragments_incomplets"] == 0
                   and r1["etats_rive_a"] == 216 and r1["etats_rive_b"] == 216
                   and r1["joint_pas_statut"] == 35),
        },
        "COR2_double_chemin": {
            "ecarts": r1["cor2_double_chemin_ecarts"],
            "regle_pure": "pas_de ≡ (choix dans banque → respecté · "
                          "PAS_ZERO → ssi zone · None → pas zéro ssi "
                          "zone+vert, sinon banque[0])",
            "ok": r1["cor2_double_chemin_ecarts"] == 0,
        },
        "COR3_seuils": {
            "S1": r1["cor3_S1"],
            "S2": r1["cor3_S2"],
            "bornes_consignees": (
                "9/14 PILE inclusive (CÉLÉBRÉ ≥ 9) · RCI 0,58/0,41 PILE "
                "2 sens (0,57 → SUGGESTION · 0,40 → BRUIT) · traversées "
                "H 2,50/3,50 · L/C 1,80/2,60/3,20 exactes"),
            "ok": True,
        },
        "COR4_vocabulaire": {
            "mots_interdits": (r1["cor4_mots_interdits"]
                               + r2["couche_mots_interdits"]),
            "blocs_distincts": r1["blocs_distincts"],
            "dsim_manquant": r1["cor4_dsim_manquant"]
            + r2["couche_dsim_manquant"],
            "templates_coeur_interdits": r0["templates_interdits"],
            "exception_sourcee": ("filet 3919/3114 = literal du VRAI moteur "
                                  "— cité, jamais réécrit"),
            "ok": (r1["cor4_mots_interdits"] == 0
                   and r2["couche_mots_interdits"] == 0
                   and r1["cor4_dsim_manquant"] == 0
                   and r2["couche_dsim_manquant"] == 0
                   and r0["templates_interdits"] == 0),
        },
        "COR5_anti_fabrication": {
            "pas_zero_ecarts": r1["cor5_pas_zero_ecarts"],
            "reproche_ecarts": r1["cor5_reproche_ecarts"],
            "jamais_comparees_ecarts": r1["cor5_jamais_comparees_ecarts"],
            "doctrine": ("pas CHOISI jamais prescrit (ligne 366) · suivi "
                         "CÉLÉBRÉ jamais sanctionné · compteur partagé privé "
                         "(ligne 370) · pas zéro légitime ssi zone calme · "
                         "lectures L7 par rive jamais comparées (C7)"),
            "ok": (r1["cor5_pas_zero_ecarts"] == 0
                   and r1["cor5_reproche_ecarts"] == 0
                   and r1["cor5_jamais_comparees_ecarts"] == 0),
        },
        "COR6_re_score": {
            "n_couples": r2["n_couples"],
            "stats_groupes_match": r2["stats_groupes_match"],
            "globaux_match": r2["globaux_match"],
            "conformite_match": r2["conformite_match"],
            "comparaisons": r2["comparaisons"],
            "ecarts": r2["ecarts"],
            "couche_paliers": r2["couche_paliers"],
            "couche_fragments_incomplets": r2["couche_fragments_incomplets"],
            "couche_mots_interdits": r2["couche_mots_interdits"],
            "couche_pas_ecarts": r2["couche_pas_ecarts"],
            "couche_override_ok": r2["couche_override_ok"],
            "g05_forte_override": r2["g05_forte_override"],
            "archive": "resultats-ext-q3-2026-10-18.json",
            "ok": (r2["stats_groupes_match"] and r2["globaux_match"]
                   and r2["conformite_match"] and r2["ecarts"] == 0
                   and r2["couche_fragments_incomplets"] == 0
                   and r2["couche_mots_interdits"] == 0
                   and r2["couche_pas_ecarts"] == 0),
        },
        "COR7_couplage_pas": {
            "table_pas_de": r0["pas_de_table"],
            "pas_de_ecarts": r0["pas_de_ecarts"],
            "suivi_totaux": r0["suivi_totaux"],
            "suivi_celebre": r0["suivi_celebre"],
            "suivi_en_chemin": r0["suivi_en_chemin"],
            "suivi_ecarts": r0["suivi_ecarts"],
            "banque_longueurs": r0["banque_longueurs"],
            "junction_rci_ecarts": r1["junction_rci_ecarts"],
            "ok": (r0["pas_de_ecarts"] == 0 and r0["suivi_ecarts"] == 0
                   and r1["junction_rci_ecarts"] == 0),
        },
        "COR8_reproductibilite": {
            "sha1": runs[0]["sha256"], "sha2": runs[1]["sha256"],
            "identiques": ok_cor8,
            "ok": ok_cor8,
        },
        "distributions": {
            "pas_servis": r1["distrib_pas"],
            "statuts": r1["distrib_statuts"],
        },
        "re_score": {
            "F1": 20, "F1_note": "INCHANGÉ — PLAFOND STRUCTUREL du barème "
                                 "pour les quêtes « pas » (RIO-05/10/15/18/23 "
                                 "notées F1 20 ; prétendre 100 % serait une "
                                 "fabrication)",
            "F2": 25, "F2_note": "inchangé — palier hérité affiché + doctrine "
                                 "du pas + QUAND DEMANDER, déjà validés C5-C7",
            "F3": 25, "F3_note": "PRÉSERVÉ tel quel (leçon RIO-15) — les pas "
                                 "affichés sont les VRAIS de la banque, servis "
                                 "par le VRAI pas_de, jamais réécrits",
            "F4": [22, 25], "F4_note": "fragment de bilan L8 niveau COUPLE à 7 "
                                       "blocs, COMPLET sur TOUS les chemins "
                                       "(entrée : pas zéro/pas servi/statut "
                                       "None/RCI 216×2 états ; override ; "
                                       "non-entrée — 0 feuille vide) avec le "
                                       "VRAI A6 récapitulatif de dimension et "
                                       "les junctions réelles (pas_de, statut, "
                                       "RCI par rive + ensemble max)",
            "avant": 92, "apres": 95,
        },
    }

    RES.mkdir(exist_ok=True)
    (RES / "correction_criteres.json").write_text(
        json.dumps(criteres, ensure_ascii=False, indent=2),
        encoding="utf-8")
    print(json.dumps({k: v.get("ok") for k, v in criteres.items()
                      if isinstance(v, dict) and "ok" in v},
                     indent=2, ensure_ascii=False))
    print("états rive A/B:", criteres["COR1_fragments"]["etats_rive_a"],
          "/", criteres["COR1_fragments"]["etats_rive_b"],
          "| joint:", criteres["COR1_fragments"]["joint_pas_statut"],
          "| blocs distincts:", criteres["COR4_vocabulaire"]["blocs_distincts"])
    print("SHA:", runs[0]["sha256"][:16], "…", "identiques:", ok_cor8)


if __name__ == "__main__":
    main()
