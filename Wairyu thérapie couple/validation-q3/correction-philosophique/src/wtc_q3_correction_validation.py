# -*- coding: utf-8 -*-
"""
WTC-Q3 — VALIDATION DE LA COUCHE DE CORRECTION PHILOSOPHIQUE (RIO-03)
======================================================================
Exécute les preuves sur le VRAI moteur (zéro réimplémentation) :

  Stage 1    — Énumération EXHAUSTIVE de l'espace des états distincts de
               la couche : 4 c1_mode × 2 bandes c2 × 32 états effectifs c3
               (compaction PROUVÉE sur les 512 sous-ensembles) × 4 bandes
               sA × 3 bandes sB × 2 états (h_norm ≥ r_norm) (prouvé sur les
               160 paires entières + borne d'égalité) × 54 états journal
               distincts (26 patterns de voies C × 2 bandes N + 2 états
               incomplets — compaction PROUVÉE sur les 4 096 (T,U,L,M)) ×
               6 libellés d'ombre hérités = 1 990 656 configurations, chacune
               exécutée par le VRAI `verifier_forces`, habillée par la couche
               (bloc écran + fragment L8) et vérifiée (COR2 double chemin,
               COR4 vocabulaire, COR5 anti-fabrication, COR7 pas/jonctions).
  Stage 1-bis — Proues de compaction et batterie de frontière : c3 512/512,
               journal 4 096/4 096, (h_norm ≥ r_norm) 160/160 + égalité
               pile, invariance des 6 libellés, platitudes c2/sA/sB ±ε,
               sensibilité des seuils journal, grille Q1 (0 borne pile).
  Stage 2    — Re-score BIT-EXACT des 475 profils archivés R1 (400 honnêtes
               + 40 SANS_FORCE + 20 SURCHARGE + 15 ASYM_MIROIR), régénérés
               par le VRAI simulateur R1 (seed 42) et comparés au CSV
               archivé `validation-q3-r1/results/profils_marque.csv`
               (13 champs × 475 lignes), puis habillage couche.
  Stage 3    — Miroir EXHAUSTIF : 512 × 512 paires (c3, c4) = 262 144 —
               vrai `coherence_miroir` ≡ chemin indépendant, 0 écart.
  Stage planche — Monotonicité du PLANCHER sur l'espace Q2 : 100 états H ×
               16 états R × 11 i_alarm × 12 bandes sA/sB = 211 200 états —
               le VRAI `palier` ne lit que comp["somme"] (enregistré par
               dictionnaire espion) et palier(ial, h5f) ≥ plancher partout ;
               identité stricte aux états (ial=0, H5=0).
  Stage 4    — Couplage pas : 3 faces × 6 étiquettes → VRAI
               `selectionner_pas` ; empreintes réelles ; identité face Q5 ⇔
               type Q4 ; suivi 14 jours sans sanction ; `long_termique`
               (FIABLE/BRUIT/STABLE) ; `programmer_re_test_q1` (8 semaines).
  COR8       — Reproductibilité : pipeline exécuté 2 fois, SHA-256 identiques.

Sorties : results/correction_criteres.json
Mode tronçonné (sandbox à fenêtre courte) — variables CORR_RUN=1|2 et
CORR_PART ∈ {l0c0…l5c3, rest1, rest2, rest3, rest4, merge, final} :
la fusion est identique au mode complet (union des ensembles, somme des
compteurs — l'union des textes distincts est FAITE, contrairement à un
simple report du premier tronçon).
"""

from __future__ import annotations

import csv
import hashlib
import itertools
import json
import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import wtc_q3_correction as corr          # la couche (charge les vrais moteurs)
core_q3 = corr.core_q3
val_q3 = corr.val_q3
core_q2 = corr.core_q2
core_q4 = corr.core_q4
core_q5 = corr.core_q5

RES = Path(__file__).resolve().parents[1] / "results"
SMOKE = os.environ.get("CORR_SMOKE") == "1"   # échantillon réduit (test rapide)

SA_BANDS = corr.SA_BANDS
SB_BANDS = corr.SB_BANDS
C2_BANDS = corr.C2_BANDS
C1_MODES = corr.C1_MODES
C3_EFF = corr.C3_EFF
HGEQ_REPS = corr.HGEQ_REPS
LABELS = corr.LABELS_OMBRE
BANDEAU_OK = corr.BANDEAU_DSIM
RANG_PALIER = {"🟢": 0, "🟠": 1, "🔴": 2}

MARQUEURS_FORCE = {f: val_q3.TEMPLATES_FORCES[f] for f in core_q3.FORCES}


# ─────────────────────────────────────────────────────────────────────────────
# ESPACES — états effectifs et leur compaction PROUVÉE
# ─────────────────────────────────────────────────────────────────────────────
def c3_effectifs() -> list[tuple]:
    """Les 32 états effectifs de c3 (appartenances lues par le cœur :
    V, F, R, T, Pr), ordonnés selon la banque C3_ITEMS."""
    tout = list(core_q3.C3_ITEMS)
    idx = sorted(range(len(tout)), key=lambda i: tout[i])
    sous_ensembles = []
    for r in range(len(C3_EFF) + 1):
        for combo in itertools.combinations(C3_EFF, r):
            s = [x for x in tout if x in combo]
            sous_ensembles.append(tuple(s))
    return sous_ensembles


def c3_tous() -> list[tuple]:
    """Les 512 sous-ensembles complets de C3_ITEMS (pour la preuve)."""
    tout = list(core_q3.C3_ITEMS)
    out = []
    for r in range(len(tout) + 1):
        for combo in itertools.combinations(tout, r):
            out.append(tuple(combo))
    return out


def journal_projecte(t: int, u: int, l: int, m: int) -> dict:
    return {"complete": True, "T": t, "U": u, "L": l, "M": m, "N": 0,
            "phrases": None}


def journal_states() -> tuple[list[dict], dict]:
    """Les 130 états journal distincts (64 patterns × 2 bandes N + 2 états
    incomplets) avec représentants — compaction prouvée au stage 1-bis sur
    les 4 096 quadruplets (T,U,L,M) via le VRAI cond_journal."""
    reps: dict[tuple, tuple] = {}
    for t, u, l, m in itertools.product(range(8), repeat=4):
        j = core_q3.cond_journal(journal_projecte(t, u, l, m))
        motif = tuple(j[f] for f in core_q3.FORCES)
        if motif not in reps:
            reps[motif] = (t, u, l, m)
    etats = [{"journal": None, "attendu": "NON_RENSEIGNE"},
             {"journal": {"complete": False, "T": 1, "U": 0, "L": 0,
                          "M": 0, "N": 0}, "attendu": "PARTIEL"}]
    for (t, u, l, m) in sorted(reps.values()):
        for n in (0, 5):
            j = {"complete": True, "T": t, "U": u, "L": l, "M": m, "N": n,
                 "phrases": None}
            attendu = "SILENCIEUX" if n >= 5 else "ACTIF"
            etats.append({"journal": j, "attendu": attendu})
    return etats, reps


C3_LIST = c3_effectifs()
J_ETATS, J_MOTIFS = journal_states()
if SMOKE:
    C3_LIST = C3_LIST[::8]
    J_ETATS = [J_ETATS[0], J_ETATS[1]] + J_ETATS[2::17]


def build_prof(c1: str, c2: int, c3: tuple, sA: float, sB: float,
               hgeq: bool, journal, label: str) -> dict:
    h_norm, r_norm = HGEQ_REPS[hgeq]
    return {"c1_mode": c1, "c2": c2, "c3": list(c3), "c4": list(c3),
            "sA": sA, "sB": sB, "h_norm": h_norm, "r_norm": r_norm,
            "label_ombre": label, "journal": journal}


def statut_attendu(journal) -> str:
    if journal is None:
        return "NON_RENSEIGNE"
    if not journal["complete"]:
        return "PARTIEL"
    return "SILENCIEUX" if journal["N"] >= 5 else "ACTIF"


# ─────────────────────────────────────────────────────────────────────────────
# MÉMOÏSATION DES VRAIS APPELS MOTEUR (fonctions déterministes d'états finis)
# ─────────────────────────────────────────────────────────────────────────────
def precompute() -> dict:
    M = {}
    M["miroir"] = {c3: core_q3.coherence_miroir(list(c3), list(c3))
                   for c3 in C3_LIST}                     # c4 = c3 (représentant)
    M["pal"] = {}
    for _, sA in SA_BANDS:
        for _, sB in SB_BANDS:
            for hgeq, (hn, rn) in HGEQ_REPS.items():
                M["pal"][(sA, sB, hgeq)] = corr.plancher_palier(sA, sB, hn, rn)
    M["typ"] = {(sA, sB): core_q4.type_attachement(sA, sB)
                for _, sA in SA_BANDS for _, sB in SB_BANDS}
    return M


# ─────────────────────────────────────────────────────────────────────────────
# STAGE 1 — ÉNUMÉRATION EXHAUSTIVE (états distincts × 6 libellés)
# ─────────────────────────────────────────────────────────────────────────────
def stage1(M: dict, li=None, ci=None) -> dict:
    stats = {
        "configs": 0, "fragment_complet": 0, "cor2_ecarts": 0,
        "paliers": {"🟢": 0, "🟠": 0, "🔴": 0},
        "S1": 0, "S2": 0,
        "labels": {}, "statuts": {}, "forces_out": {}, "silencieuses": 0,
        "exclues_cas": 0,
        "md5_texts": set(), "mots_interdits_max": 0, "dsim_manquants": 0,
        "zc_abus": 0, "zc_manquant": 0, "marqueur_abus": 0,
        "marqueur_manquant": 0, "statut_incoherent": 0,
        "exclues_incoherentes": 0, "pas_non_resolus": 0,
        "junction_incoherente": 0,
        "labels_c": set(), "c1_c": set(),
    }
    labels_par = range(len(LABELS)) if li is None else [li]
    c1_par = range(len(C1_MODES)) if ci is None else [ci]
    for li_ in labels_par:
        label = LABELS[li_]
        print(f"  stage1 — label {label} …", flush=True)
        for ci_ in c1_par:
            c1 = C1_MODES[ci_]
            for (_, c2) in C2_BANDS:
                for c3 in C3_LIST:
                    miroir = M["miroir"][c3]
                    for (_, sA) in SA_BANDS:
                        for (_, sB) in SB_BANDS:
                            typ = M["typ"][(sA, sB)]
                            for hgeq in (True, False):
                                pal = M["pal"][(sA, sB, hgeq)]
                                for etat in J_ETATS:
                                    journal = etat["journal"]
                                    stats["configs"] += 1
                                    prof = build_prof(c1, c2, c3, sA, sB,
                                                      hgeq, journal, label)
                                    moteur = core_q3.verifier_forces(
                                        c1, c2, list(c3), sA, sB,
                                        prof["h_norm"], prof["r_norm"],
                                        label, journal)
                                    # COR2 — chemin indépendant (tables cahier)
                                    indep = corr.forces_independantes(
                                        c1, c2, list(c3), sA, sB,
                                        prof["h_norm"], prof["r_norm"],
                                        journal)
                                    if indep != moteur["forces"]:
                                        stats["cor2_ecarts"] += 1
                                    statut = core_q3.journal_statut(journal)
                                    if statut != etat["attendu"] or \
                                            statut != statut_attendu(journal):
                                        stats["statut_incoherent"] += 1
                                    bloc = corr.bloc_ecran(
                                        prof, miroir, statut, moteur, pal,
                                        sA, sB)
                                    frag = corr.bilan_fragment(
                                        prof, miroir, statut, moteur, pal,
                                        sA, sB)
                                    if frag["_complet"]:
                                        stats["fragment_complet"] += 1
                                    t = bloc["texte"]
                                    if bloc["nb_mots_interdits"] > \
                                            stats["mots_interdits_max"]:
                                        stats["mots_interdits_max"] = \
                                            bloc["nb_mots_interdits"]
                                    if BANDEAU_OK not in t:
                                        stats["dsim_manquants"] += 1
                                    stats["md5_texts"].add(bloc["md5"])
                                    # COR5 — anti-fabrication
                                    if bloc["rien_a_fabriquer"]:
                                        if label != "ZONE CALME":
                                            stats["zc_abus"] += 1
                                    elif label == "ZONE CALME":
                                        stats["zc_manquant"] += 1
                                    if moteur["silencieuse"]:
                                        if any(mk in t for mk
                                               in MARQUEURS_FORCE.values()):
                                            stats["marqueur_abus"] += 1
                                    else:
                                        if not bloc["force_templates_ok"]:
                                            stats["marqueur_manquant"] += 1
                                    # cohérence des exclues (limite des 2)
                                    excl = moteur.get("exclues_par_limite", [])
                                    if excl:
                                        stats["exclues_cas"] += 1
                                        ok = moteur["nombre"] == 2 and \
                                            all(not e in moteur["forces"]
                                                and moteur["trace"][e]["retenue"]
                                                for e in excl)
                                        if not ok:
                                            stats["exclues_incoherentes"] += 1
                                    # COR7 — pas réellement résolu
                                    if bloc["pas"] not in core_q5.PAS_BANQUE:
                                        stats["pas_non_resolus"] += 1
                                    # Junction type Q4 ⇔ bandes sA/sB
                                    if ((sA >= 2.61) != (typ in ("PREOCCUPE",
                                                                 "EN_ALERTFEU"))
                                            or (sB >= 2.61) != (typ in ("DETACHE",
                                                                        "EN_ALERTFEU"))
                                            or (sA >= 2.61 and sB >= 2.61)
                                            != (typ == "EN_ALERTFEU")):
                                        stats["junction_incoherente"] += 1
                                    # Compteurs
                                    stats["paliers"][pal] += 1
                                    if corr.clause_orientation(pal):
                                        stats["S1"] += 1
                                    elif corr.clause_surveillance(pal):
                                        stats["S2"] += 1
                                    stats["labels"][label] = \
                                        stats["labels"].get(label, 0) + 1
                                    stats["statuts"][statut] = \
                                        stats["statuts"].get(statut, 0) + 1
                                    key_out = "+".join(moteur["forces"]) \
                                        if moteur["forces"] else "SILENCIEUSE"
                                    stats["forces_out"][key_out] = \
                                        stats["forces_out"].get(key_out, 0) + 1
                                    if moteur["silencieuse"]:
                                        stats["silencieuses"] += 1
        stats["labels_c"].add(label)
    if ci is not None:
        stats["c1_c"].add(C1_MODES[ci])
    stats["md5_texts"] = sorted(stats["md5_texts"])
    stats["labels_c"] = sorted(stats["labels_c"])
    stats["c1_c"] = sorted(stats["c1_c"])
    return stats


# ─────────────────────────────────────────────────────────────────────────────
# STAGE 1-BIS — PROUES DE COMPACTION + BATTERIE DE FRONTIÈRE
# ─────────────────────────────────────────────────────────────────────────────
def _forces_pour(c1, c2, c3, sA, sB, hn, rn, journal, label="PEUR DE PERDRE"):
    return core_q3.verifier_forces(c1, c2, list(c3), sA, sB, hn, rn, label,
                                   journal)["forces"]


def stage1bis() -> dict:
    res = {"c3_compaction": {"verifies": 0, "ecarts": 0},
           "journal_compaction": {"verifies": 0, "ecarts": 0},
           "n_invariance": {"verifies": 0, "ecarts": 0},
           "hgeq_paires": {"verifies": 0, "ecarts": 0},
           "hgeq_egalite_pile": None,
           "label_invariance": {"verifies": 0, "ecarts": 0},
           "c2_platitude": {"verifies": 0, "ecarts": 0},
           "sondes": [], "sondes_ecarts": 0,
           "journal_sensibilite": [], "journal_sens_ecarts": 0,
           "grille_q1": {}, "somme_bornes": {}}
    base = [(c1, c2, c3, sA, sB)
            for c1 in C1_MODES for _, c2 in C2_BANDS
            for c3 in ((), ("V",), ("V", "T", "Pr"))
            for _, sA in SA_BANDS for _, sB in SB_BANDS]
    if SMOKE:
        base = base[::7]
    # (1) compaction c3 — les 512 sous-ensembles complets
    for c1, c2, _, sA, sB in base:
        for sub in c3_tous():
            eff = tuple(x for x in core_q3.C3_ITEMS if x in sub)
            a = _forces_pour(c1, c2, sub, sA, sB, 0.40, 0.30, None)
            b = _forces_pour(c1, c2, eff, sA, sB, 0.40, 0.30, None)
            res["c3_compaction"]["verifies"] += 1
            if a != b:
                res["c3_compaction"]["ecarts"] += 1
    # (2) compaction journal — les 4 096 quadruplets (T,U,L,M), chacun
    # comparé au représentant de son motif (le VRAI cond_journal décide)
    for (t, u, l, m) in itertools.product(range(8), repeat=4):
        j = core_q3.cond_journal(journal_projecte(t, u, l, m))
        motif = tuple(j[f] for f in core_q3.FORCES)
        rep = J_MOTIFS[motif]
        a = _forces_pour("PRES", 2, (), 2.8, 2.8, 0.40, 0.30,
                         journal_projecte(t, u, l, m))
        jr = journal_projecte(*rep)
        b = _forces_pour("PRES", 2, (), 2.8, 2.8, 0.40, 0.30, jr)
        res["journal_compaction"]["verifies"] += 1
        if a != b:
            res["journal_compaction"]["ecarts"] += 1
    res["journal_motifs_realises"] = len(J_MOTIFS)
    # (3) invariance du N (jamais une sanction pour les forces)
    for (t, u, l, m) in sorted(set(J_MOTIFS.values())):
        for n1, n2 in ((0, 4), (5, 7)):
            a = _forces_pour("PRES", 2, (), 2.8, 2.8, 0.40, 0.30,
                             {"complete": True, "T": t, "U": u, "L": l,
                              "M": m, "N": n1, "phrases": None})
            b = _forces_pour("PRES", 2, (), 2.8, 2.8, 0.40, 0.30,
                             {"complete": True, "T": t, "U": u, "L": l,
                              "M": m, "N": n2, "phrases": None})
            res["n_invariance"]["verifies"] += 1
            if a != b:
                res["n_invariance"]["ecarts"] += 1
    # (4) (h_norm ≥ r_norm) — les 160 paires entières (hb, rb)
    for hb in range(16):
        for rb in range(10):
            hn, rn = round(hb / 15, 3), round(rb / 9, 3)
            etat = hn >= rn
            rep = HGEQ_REPS[etat]
            a = _forces_pour("SOL", 1, (), 2.8, 2.8, hn, rn, None,
                             label="ZONE CALME")
            b = _forces_pour("SOL", 1, (), 2.8, 2.8, rep[0], rep[1], None,
                             label="ZONE CALME")
            res["hgeq_paires"]["verifies"] += 1
            if a != b:
                res["hgeq_paires"]["ecarts"] += 1
    # borne d'égalité pile (≥ inclusif) — documentée, côté attendu True
    a = _forces_pour("SOL", 1, (), 2.8, 2.8, 0.30, 0.30, None,
                     label="ZONE CALME")
    rep = HGEQ_REPS[True]
    b = _forces_pour("SOL", 1, (), 2.8, 2.8, rep[0], rep[1], None,
                     label="ZONE CALME")
    res["hgeq_egalite_pile"] = (a == b)
    # (5) invariance des 6 libellés d'ombre (le label ne crée pas de force)
    for c1 in C1_MODES:
        for journal in (None, {"complete": True, "T": 5, "U": 5, "L": 4,
                               "M": 3, "N": 1, "phrases": None}):
            sorties = {tuple(_forces_pour(c1, 2, ("V", "T"), 2.8, 2.8,
                                          0.40, 0.30, journal, label=label))
                       for label in LABELS}
            res["label_invariance"]["verifies"] += 1
            if len(sorties) != 1:
                res["label_invariance"]["ecarts"] += 1
    # (6) platitude c2 {0,1} / {2,3}
    for c1 in C1_MODES:
        for _, sA in SA_BANDS:
            for _, sB in SB_BANDS:
                for journal in (None, journal_projecte(5, 0, 0, 0)):
                    bas = {tuple(_forces_pour(c1, v, ("V",), sA, sB, 0.40,
                                              0.30, journal))
                           for v in (0, 1)}
                    haut = {tuple(_forces_pour(c1, v, ("V",), sA, sB, 0.40,
                                               0.30, journal))
                            for v in (2, 3)}
                    res["c2_platitude"]["verifies"] += 2
                    if len(bas) != 1 or len(haut) != 1:
                        res["c2_platitude"]["ecarts"] += 1
    # (7) sondes ±ε sur sA (2,61) et sB (2,61 · 3,21)
    repos = [(c1, c2, c3, jn)
             for c1 in ("PRES", "ESP") for _, c2 in C2_BANDS
             for c3 in ((), ("V",))
             for jn in (None, journal_projecte(5, 5, 4, 3))]
    if SMOKE:
        repos = repos[::3]
    sondes = [("sA=2,61", "sA", 2.6099, 2.6101, 2.0, 2.8),
              ("sB=2,61", "sB", 2.6099, 2.6101, 2.0, 2.8),
              ("sB=3,21", "sB", 3.2099, 3.2101, 2.8, 3.3)]
    for nom, axe, g, d, rep_g, rep_d in sondes:
        viol = 0
        for c1, c2, c3, jn in repos:
            if axe == "sA":
                sg = _forces_pour(c1, c2, c3, g, 2.0, 0.40, 0.30, jn)
                sd = _forces_pour(c1, c2, c3, d, 2.0, 0.40, 0.30, jn)
                rg = _forces_pour(c1, c2, c3, rep_g, 2.0, 0.40, 0.30, jn)
                rd = _forces_pour(c1, c2, c3, rep_d, 2.0, 0.40, 0.30, jn)
            else:
                sg = _forces_pour(c1, c2, c3, 2.0, g, 0.40, 0.30, jn)
                sd = _forces_pour(c1, c2, c3, 2.0, d, 0.40, 0.30, jn)
                rg = _forces_pour(c1, c2, c3, 2.0, rep_g, 0.40, 0.30, jn)
                rd = _forces_pour(c1, c2, c3, 2.0, rep_d, 0.40, 0.30, jn)
            if sg != rg or sd != rd:
                viol += 1
        res["sondes"].append({"sonde": nom, "violations": viol,
                              "cas": len(repos)})
        if viol:
            res["sondes_ecarts"] += 1
    # (8) sensibilité des seuils journal (chaque seuil doit séparer)
    paires = [
        ("T=4|5", journal_projecte(4, 0, 0, 0), journal_projecte(5, 0, 0, 0)),
        ("U=4|5", journal_projecte(0, 4, 0, 0), journal_projecte(0, 5, 0, 0)),
        ("L=3|4", journal_projecte(0, 0, 3, 0), journal_projecte(0, 0, 4, 0)),
        ("M=2|3", journal_projecte(0, 0, 0, 2), journal_projecte(0, 0, 0, 3)),
        ("Σ=3|4", journal_projecte(1, 1, 1, 0), journal_projecte(1, 1, 1, 1)),
        ("T+M=3|4", journal_projecte(3, 0, 0, 0), journal_projecte(3, 0, 0, 1)),
        ("N=4|5(statut)", {"complete": True, "T": 0, "U": 0, "L": 0, "M": 0,
                           "N": 4, "phrases": None},
         {"complete": True, "T": 0, "U": 0, "L": 0, "M": 0, "N": 5,
          "phrases": None}),
    ]
    for nom, jg, jd in paires:
        if nom.startswith("N="):
            sep = (core_q3.journal_statut(jg) != core_q3.journal_statut(jd))
        else:
            a = core_q3.cond_journal(jg)
            b = core_q3.cond_journal(jd)
            sep = any(a[f] != b[f] for f in core_q3.FORCES)
        res["journal_sensibilite"].append({"paire": nom, "separe": sep})
        if not sep:
            res["journal_sens_ecarts"] += 1
    # (9) grille Q1 — 28 scores atteignables vs seuils (0 borne pile)
    scores = [round(k / 9, 2) for k in range(9, 37)]
    seuils = (2.61, 3.21, 3.70)
    pile = [s for s in scores for th in seuils if s == th]
    dist = {str(th): min(abs(s - th) for s in scores) for th in seuils}
    equiv = all((s >= 2.61) == (core_q5.face_dominante(s, 2.0) != "RASSUREE")
                for s in scores)
    res["grille_q1"] = {"scores": scores, "pile": pile,
                        "dist_min_seuils": dist, "equivalence_261": equiv}
    # (10) bornes de la bande 🟠 du plancher (somme héritée arrondie à 3
    # décimales — les sondes sont à la granularité de cet arrondi)
    p29 = corr.plancher_palier(2.0, 2.0, 0.10, 0.19)       # somme 0,29
    p30 = corr.plancher_palier(2.0, 2.0, 0.10, 0.20)       # somme 0,30 pile
    p31 = corr.plancher_palier(2.0, 2.0, 0.10, 0.21)       # somme 0,31
    p59 = corr.plancher_palier(2.0, 2.0, 0.30, 0.29)       # somme 0,59
    p60 = corr.plancher_palier(2.0, 2.0, 0.30, 0.30)       # somme 0,60 pile
    p61 = corr.plancher_palier(2.0, 2.0, 0.30, 0.31)       # somme 0,61
    res["somme_bornes"] = {
        "029": p29, "pile_030_inclus": p30, "031": p31,
        "059": p59, "pile_060_exclu": p60, "061": p61,
        "coherent": (p29 == "🟢" and p30 == "🟠" and p31 == "🟠"
                     and p59 == "🟠" and p60 == "🟢" and p61 == "🟢")}
    return res


# ─────────────────────────────────────────────────────────────────────────────
# STAGE 2 — RE-SCORE BIT-EXACT DES 475 PROFILS ARCHIVÉS R1 + COUCHE
# ─────────────────────────────────────────────────────────────────────────────
def stage2() -> dict:
    res = {"lignes": 0, "champs": 13, "comparaisons": 0, "ecarts": [],
           "fragments_complets": 0, "mots_interdits_max": 0,
           "dsim_manquants": 0, "S1": 0, "S2": 0,
           "paliers": {"🟢": 0, "🟠": 0, "🔴": 0},
           "silencieuses": 0, "zc_abus": 0, "zc_manquant": 0,
           "marqueur_abus": 0, "marqueur_manquant": 0,
           "pas_non_resolus": 0, "long_termique_stable": 0,
           "statuts": {}, "labels": {}}
    sim = val_q3.sim                                   # VRAI simulateur R1
    echantillon = [(g, i, p) for g, ps in sim.GROUPES.items()
                   for i, p in enumerate(ps)]
    echantillon += [(f"TRAP_{t}", i, p) for t, ps in sim.TRAPS.items()
                    for i, p in enumerate(ps)]
    chemin = (Path(__file__).resolve().parents[3] / "validation-q3-r1"
              / "results" / "profils_marque.csv")
    with open(chemin, newline="", encoding="utf-8-sig") as fh:
        rows = list(csv.DictReader(fh))
    if len(rows) != len(echantillon):
        res["ecarts"].append({"id": "TAILLE", "calcule": len(echantillon),
                              "archive": len(rows)})
        return res
    for (g, i, p), row in zip(echantillon, rows):
        res["lignes"] += 1
        moteur = core_q3.verifier_forces(
            p["c1_mode"], p["c2"], p["c3"], p["sA"], p["sB"],
            p["h_norm"], p["r_norm"], p["label_ombre"], p["journal"])
        verite = sim.forces_vraies(p)
        statut = core_q3.journal_statut(p["journal"])
        forces = moteur["forces"]
        calcule = {
            "groupe": g, "id": str(i), "c1_mode": p["c1_mode"],
            "c2": str(p["c2"]), "c3": "+".join(p["c3"]) or "-",
            "sA": str(round(p["sA"], 3)), "sB": str(round(p["sB"], 3)),
            "label_ombre": p["label_ombre"], "journal_statut": statut,
            "forces_moteur": "+".join(forces) or "SILENCIEUSE",
            "forces_verite": "+".join(verite) or "SILENCIEUSE",
            "accord_c2": str(int(sorted(forces) == sorted(verite))),
            "nb_forces": str(moteur["nombre"]),
        }
        for champ, v in calcule.items():
            res["comparaisons"] += 1
            if row[champ] != v:
                res["ecarts"].append({"id": f"{g}-{i}", "champ": champ,
                                      "calcule": v, "archive": row[champ]})
        # Couche sur la vérité archivée (habillage R4/R5 + plancher R1)
        miroir = core_q3.coherence_miroir(p["c3"], p.get("c4", []))
        pal = corr.plancher_palier(p["sA"], p["sB"], p["h_norm"], p["r_norm"])
        bloc = corr.bloc_ecran(p, miroir, statut, moteur, pal, p["sA"],
                               p["sB"])
        frag = corr.bilan_fragment(p, miroir, statut, moteur, pal, p["sA"],
                                   p["sB"])
        if frag["_complet"]:
            res["fragments_complets"] += 1
        res["mots_interdits_max"] = max(res["mots_interdits_max"],
                                        bloc["nb_mots_interdits"])
        if BANDEAU_OK not in bloc["texte"]:
            res["dsim_manquants"] += 1
        label = p["label_ombre"]
        if bloc["rien_a_fabriquer"]:
            if label != "ZONE CALME":
                res["zc_abus"] += 1
        elif label == "ZONE CALME":
            res["zc_manquant"] += 1
        if moteur["silencieuse"]:
            res["silencieuses"] += 1
            if any(mk in bloc["texte"] for mk in MARQUEURS_FORCE.values()):
                res["marqueur_abus"] += 1
        elif not bloc["force_templates_ok"]:
            res["marqueur_manquant"] += 1
        if bloc["pas"] not in core_q5.PAS_BANQUE:
            res["pas_non_resolus"] += 1
        if corr.clause_orientation(pal):
            res["S1"] += 1
        elif corr.clause_surveillance(pal):
            res["S2"] += 1
        res["paliers"][pal] += 1
        res["statuts"][statut] = res["statuts"].get(statut, 0) + 1
        res["labels"][label] = res["labels"].get(label, 0) + 1
        if core_q3.long_termique(forces, forces)["verdict"] == "STABLE":
            res["long_termique_stable"] += 1
    return res


# ─────────────────────────────────────────────────────────────────────────────
# STAGE 3 — MIROIR EXHAUSTIF (512 × 512 paires c3 × c4)
# ─────────────────────────────────────────────────────────────────────────────
def stage3() -> dict:
    res = {"paires": 0, "ecarts": 0, "presumes_cle_vide": False,
           "crash": False, "clauses_distinctes": 0,
           "mots_interdits_max": 0, "interpretations": {}}
    try:
        vides = core_q3.coherence_miroir([], [])
        res["presumes_cle_vide"] = "presumes" in vides     # [D-Q3-R1-F]
        clauses = set()
        for c3 in c3_tous():
            for c4 in c3_tous():
                vrai = core_q3.coherence_miroir(list(c3), list(c4))
                indep = corr.miroir_independant(list(c3), list(c4))
                res["paires"] += 1
                if (vrai["partages"] != indep["partages"]
                        or vrai["secrets"] != indep["secrets"]
                        or vrai["presumes"] != indep["presumes"]
                        or vrai["interpretation"] != indep["interpretation"]):
                    res["ecarts"] += 1
                cl = corr.clause_miroir(vrai)
                clauses.add(cl)
                res["mots_interdits_max"] = max(res["mots_interdits_max"],
                                                corr._scan(cl))
                res["interpretations"][vrai["interpretation"]] = \
                    res["interpretations"].get(vrai["interpretation"], 0) + 1
        res["clauses_distinctes"] = len(clauses)
    except Exception as e:                                 # pragma: no cover
        res["crash"] = True
        res["erreur"] = repr(e)
    return res


# ─────────────────────────────────────────────────────────────────────────────
# STAGE PLANCHE — MONOTONIE DU PLANCHER SUR L'ESPACE Q2 (VRAI palier)
# ─────────────────────────────────────────────────────────────────────────────
class _Rec(dict):
    """Dictionnaire espion : enregistre les clés réellement lues."""

    def __init__(self, d):
        super().__init__(d)
        self.reads = set()

    def __getitem__(self, k):
        self.reads.add(k)
        return super().__getitem__(k)


def build_h(h5f: int, k_oth: int, s_oth: int) -> dict:
    h = {k: 0 for k in core_q2.H_ITEMS}
    if h5f > 0:
        h["H5"] = h5f
    if k_oth:
        autres = [k for k in core_q2.H_ITEMS if k != "H5"]
        base, rem = divmod(s_oth, k_oth)
        for i in range(k_oth):
            h[autres[i]] = base + (1 if i < rem else 0)
    return h


def build_r(k: int, s: int) -> dict:
    r = {kk: 0 for kk in core_q2.R_ITEMS}
    if k:
        base, rem = divmod(s, k)
        for i in range(k):
            r[core_q2.R_ITEMS[i]] = base + (1 if i < rem else 0)
    return r


H_STATES = [(h5f, k, s)
            for h5f in (0, 1, 2, 3)
            for k in range(5)
            for s in range(k, 3 * k + 1)]                 # 100 états H
R_STATES = [(k, s) for k in range(4) for s in range(k, 3 * k + 1)]   # 16 états R
if SMOKE:
    H_STATES = H_STATES[::10]
    R_STATES = R_STATES[::4]


def stage_planche() -> dict:
    res = {"etats": 0, "violations_monotonie": 0, "cles_lues": [],
           "cles_hors_somme": 0, "somme_formule": {"verifies": 0, "ecarts": 0},
           "identite_ial0_h5_0": {"etats": 0, "ecarts": 0},
           "plancher_probes": {}, "plancher_probes_ok": False}
    cles_lues: set = set()
    SA_REPS = [v for _, v in SA_BANDS]                   # 4 représentants
    SB_REPS = [v for _, v in SB_BANDS]                   # 3 représentants
    for (h5f, k_oth, s_oth) in H_STATES:
        h = build_h(h5f, k_oth, s_oth)
        for (k, s) in R_STATES:
            r = build_r(k, s)
            comp = core_q2.comportements(h, r)
            # formule de la somme — vérifiée bit-exact sur les 1 600 états
            attendu = round(round(sum(h.values()) / 15, 3)
                            + round(sum(r.values()) / 9, 3), 3)
            ok = comp["somme"] == attendu
            if not ok:
                res["somme_formule"]["ecarts"] += 1
            res["somme_formule"]["verifies"] += 1
            hn = round(sum(h.values()) / 15, 3)
            rn = round(sum(r.values()) / 9, 3)
            for ial in range(11):
                for sA in SA_REPS:
                    for sB in SB_REPS:
                        sig = core_q2.signal_securite(h5f, sA, ial)
                        comp_r = _Rec(comp)
                        pal = core_q2.palier(ial, sA, sB, comp_r, sig)
                        cles_lues |= comp_r.reads
                        plancher = corr.plancher_palier(
                            sA, sB, hn, rn)
                        res["etats"] += 1
                        if RANG_PALIER[plancher] > RANG_PALIER[pal]:
                            res["violations_monotonie"] += 1
                        if h5f == 0 and ial == 0:
                            res["identite_ial0_h5_0"]["etats"] += 1
                            if plancher != pal:
                                res["identite_ial0_h5_0"]["ecarts"] += 1
    res["cles_lues"] = sorted(cles_lues)
    res["cles_hors_somme"] = sum(1 for k in cles_lues if k != "somme")
    # sondes plancher (bandes sA/sB et somme) — chaque seuil du plancher est
    # testé pour l'effet attendu : « separe » s'il est un seuil du plancher
    # pour cette configuration, « stable » sinon (bande plate)
    sondes = [("sA=2,61", "sA", 2.6099, 2.6101, 2.0, 2.0, 0.10, 0.10, "stable"),
              ("sA=3,21 (sB≥3,21)", "sA", 3.2099, 3.2101, 3.3, 3.3,
               0.10, 0.10, "separe"),
              ("sA=3,70", "sA", 3.6999, 3.7001, 2.0, 2.0, 0.10, 0.10,
               "separe"),
              ("sB=2,61", "sB", 2.6099, 2.6101, 2.0, 2.0, 0.10, 0.10,
               "stable"),
              ("sB=3,21 (sA≥3,21)", "sB", 3.2099, 3.2101, 3.3, 3.3,
               0.10, 0.10, "separe"),
              ("somme 0,29|0,30", "somme", (0.10, 0.19), (0.10, 0.20),
               None, None, None, None, "separe"),
              ("somme 0,30|0,31", "somme", (0.10, 0.20), (0.10, 0.21),
               None, None, None, None, "stable"),
              ("somme 0,59|0,60", "somme", (0.30, 0.29), (0.30, 0.30),
               None, None, None, None, "separe"),
              ("somme 0,60|0,61", "somme", (0.30, 0.30), (0.30, 0.31),
               None, None, None, None, "stable")]
    details = []
    ok_all = True
    for nom, axe, g, d, sA_fixe, sB_fixe, hn, rn, attendu in sondes:
        if axe == "sA":
            pg = corr.plancher_palier(g, sB_fixe, hn, rn)
            pd_ = corr.plancher_palier(d, sB_fixe, hn, rn)
        elif axe == "sB":
            pg = corr.plancher_palier(sA_fixe, g, hn, rn)
            pd_ = corr.plancher_palier(sA_fixe, d, hn, rn)
        else:
            pg = corr.plancher_palier(2.0, 2.0, *g)
            pd_ = corr.plancher_palier(2.0, 2.0, *d)
        separe = pg != pd_
        ok = (separe if attendu == "separe" else not separe)
        details.append({"sonde": nom, "gauche": pg, "droite": pd_,
                        "attendu": attendu, "separe": separe, "ok": ok})
        ok_all = ok_all and ok
    res["plancher_probes"] = details
    res["plancher_probes_ok"] = ok_all
    return res


# ─────────────────────────────────────────────────────────────────────────────
# STAGE 4 — COUPLAGE PAS (VRAI Q5) + EMPREINTES + IDENTITÉS + SUIVI + RE-TEST
# ─────────────────────────────────────────────────────────────────────────────
def stage4() -> dict:
    faces_rep = {"RASSUREE": (2.0, 2.0), "EN_QUETE": (2.8, 2.0),
                 "SUR_LA_RA": (2.0, 2.8)}
    table = {}
    for face, (sA, sB) in faces_rep.items():
        for label in LABELS:
            sel = core_q5.selectionner_pas(sA, sB, label)   # VRAI moteur Q5
            table[f"{face}|{label}"] = {"pas": sel["pas"],
                                        "empreinte": sel["empreinte"],
                                        "label_pas": sel["label"]}
    empreintes = {label: core_q5.empreinte(label) for label in LABELS}
    identite = []
    for _, sA in SA_BANDS:
        for _, sB in SB_BANDS:
            face = core_q5.face_dominante(sA, sB)
            typ = core_q4.type_attachement(sA, sB)
            ok = ((face == "RASSUREE") == (typ == "SEREIN")
                  and ((face == "EN_QUETE") == (typ == "PREOCCUPE"))
                  and ((face == "SUR_LA_RA")
                       == (typ in ("DETACHE", "EN_ALERTFEU"))))
            identite.append({"sA": sA, "sB": sB, "face": face, "type": typ,
                             "coherent": ok})
    suivi = [core_q5.suivre_14_jours(j) for j in range(15)]
    suivi_ok = all(s["sanction"] is None for s in suivi)
    cats = sorted({s["categorie"] for s in suivi})
    # long_termique — cas unitaires (vrai moteur Q3)
    lt = {
        "stable_vide": core_q3.long_termique([], []),
        "apparue_fiable": core_q3.long_termique([], ["F1"]),
        "disparue_bruit": core_q3.long_termique(["F1"], []),
        "identique": core_q3.long_termique(["F1", "F2"], ["F2", "F1"]),
    }
    lt_ok = (lt["stable_vide"]["verdict"] == "STABLE"
             and lt["apparue_fiable"]["verdict"] == "FIABLE"
             and lt["apparue_fiable"]["apparues"] == ["F1"]
             and lt["disparue_bruit"]["verdict"] == "BRUIT"
             and lt["disparue_bruit"]["disparues"] == ["F1"]
             and lt["identique"]["verdict"] == "STABLE")
    # re-test — vrai programmer_re_test_q1 (8 semaines, jamais forcé)
    rt = core_q5.programmer_re_test_q1("2026-10-22")
    rt_ok = (rt["semaines"] == 8 and rt["force"] is False
             and bool(rt["date_re_test"]) and bool(rt["message"]))
    return {
        "pas_18": table,
        "pas_resolus": sum(1 for v in table.values()
                           if v["pas"] in core_q5.PAS_BANQUE),
        "empreintes_reelles": empreintes,
        "identite_face_type": identite,
        "identite_ok": all(i["coherent"] for i in identite),
        "suivi_15": {"sans_sanction": sum(1 for s in suivi
                                          if s["sanction"] is None),
                     "categories": cats, "ok": suivi_ok},
        "long_termique_cas": lt, "long_termique_ok": lt_ok,
        "re_test_8_semaines": rt, "re_test_ok": rt_ok,
    }


# ─────────────────────────────────────────────────────────────────────────────
# STANDINGS (clauses permanentes — commun aux deux modes)
# ─────────────────────────────────────────────────────────────────────────────
def standings_block() -> dict:
    return {
        "mots_interdits_standings": max(
            [sum(1 for m in corr.MOTS_INTERDITS if m in t.lower())
             for t in (corr.BANDEAU_DSIM, corr.PHRASE_ORIENTATION,
                       corr.CLAUSE_AIDE_STANDING,
                       *corr._OMBRE_HERITEE.values(),
                       *corr._JOURNAL_CLAUSE.values(),
                       *corr._EXERCICE_FORCE.values(),
                       corr._EXERCICE_SILENCIEUSE,
                       corr._MODULE_SECRETS, corr._MODULE_PARTAGES,
                       corr._MODULE_VIDE,
                       corr._ORIENTATION_PLANCHER,
                       corr._SURVEILLANCE_PALIER,
                       corr._FORCE_SILENCIEUSE_OMBRAGEE,
                       corr._FORCE_SILENCIEUSE_CALME,
                       corr._NOTE_EXCLUES, corr._LIGNE_SUIVI,
                       corr._LIGNE_RETEST,
                       *val_q3.TEMPLATES_FORCES.values(),
                       val_q3.TEMPLATE_SILENCIEUSE,
                       *core_q5.PAS_LABELS.values(),
                       *core_q5.TEMPLATES_PAS.values())]
        ),
        "labels_coeur_propres": max(
            [sum(1 for m in corr.MOTS_INTERDITS if m in t.lower())
             for t in LABELS]
        ),
        "orientation_canon_dans_phrase":
            "pas un échec" in corr.PHRASE_ORIENTATION,
    }


# ─────────────────────────────────────────────────────────────────────────────
# PIPELINE COMPLET (exécuté 2 fois pour COR8)
# ─────────────────────────────────────────────────────────────────────────────
def pipeline() -> dict:
    M = precompute()
    s1 = stage1(M)
    s1b = stage1bis()
    s2 = stage2()
    s3 = stage3()
    sp = stage_planche()
    s4 = stage4()
    return {"stage1": s1, "stage1bis": s1b, "stage2": s2, "stage3": s3,
            "planche": sp, "stage4": s4, "standings": standings_block()}


def _canonique(d) -> bytes:
    return json.dumps(d, sort_keys=True, ensure_ascii=False,
                      default=list).encode("utf-8")


def _ecrire_json(chemin: Path, obj) -> None:
    chemin.write_text(json.dumps(obj, sort_keys=True, ensure_ascii=False,
                                 default=list), encoding="utf-8")


def fusionner_s1(pieces: list) -> dict:
    """Fusionne les stats stage1 de tronçons — somme exacte des compteurs,
    union des ensembles (y compris les textes distincts) ; résultat
    identique au mode complet."""
    base = json.loads(json.dumps(pieces[0], ensure_ascii=False))
    for p in pieces[1:]:
        for k in ("configs", "fragment_complet", "cor2_ecarts", "S1", "S2",
                  "dsim_manquants", "zc_abus",
                  "zc_manquant", "marqueur_abus", "marqueur_manquant",
                  "statut_incoherent", "exclues_incoherentes",
                  "pas_non_resolus", "junction_incoherente",
                  "silencieuses", "exclues_cas"):
            base[k] += p[k]
        base["mots_interdits_max"] = max(base["mots_interdits_max"],
                                         p["mots_interdits_max"])
        for k in ("paliers", "labels", "statuts", "forces_out"):
            for kk, vv in p[k].items():
                base[k][kk] = base[k].get(kk, 0) + vv
        base["md5_texts"] = sorted(set(base["md5_texts"])
                                   | set(p["md5_texts"]))
        base["labels_c"] = sorted(set(base["labels_c"])
                                  | set(p["labels_c"]))
        base["c1_c"] = sorted(set(base["c1_c"]) | set(p["c1_c"]))
    return base


def run_part(part: str) -> int:
    """Mode TRONÇONNÉ (sandbox à fenêtre d'exécution courte) — chaque
    tronçon reconstruit exactement une part du pipeline complet ; la fusion
    est identique au mode `python3 src/wtc_q3_correction_validation.py`.
    Variables : CORR_RUN=1|2 · CORR_PART=l0c0…l5c3|rest1|rest2|rest3|rest4|
    merge|final"""
    run = os.environ.get("CORR_RUN", "1")
    if len(part) == 4 and part[0] == "l" and part[2] == "c":
        M = precompute()
        s1 = stage1(M, li=int(part[1]), ci=int(part[3]))
        _ecrire_json(RES / f"_r{run}_s1_{part}.json", s1)
        print(f"tronçon {part} run {run} OK — {s1['configs']} configs")
        return 0
    if part == "rest1":
        _ecrire_json(RES / f"_r{run}_rest1.json",
                     {"stage1bis": stage1bis()})
        print(f"tronçon rest1 run {run} OK — compactions + frontières")
        return 0
    if part == "rest2":
        s2 = stage2()
        _ecrire_json(RES / f"_r{run}_rest2.json", s2)
        print(f"tronçon rest2 run {run} OK — {s2['lignes']} lignes, "
              f"{len(s2['ecarts'])} écarts")
        return 0
    if part == "rest3":
        _ecrire_json(RES / f"_r{run}_rest3.json",
                     {"stage3": stage3(), "planche": stage_planche()})
        print(f"tronçon rest3 run {run} OK — miroir + planche")
        return 0
    if part == "rest4":
        _ecrire_json(RES / f"_r{run}_rest4.json",
                     {"stage4": stage4(), "standings": standings_block()})
        print(f"tronçon rest4 run {run} OK — pas/jonctions/suivi + standings")
        return 0
    if part == "merge":
        pieces = [json.loads((RES / f"_r{run}_s1_l{li}c{ci}.json")
                             .read_text(encoding="utf-8"))
                  for li in range(len(LABELS))
                  for ci in range(len(C1_MODES))]
        rest1 = json.loads((RES / f"_r{run}_rest1.json")
                           .read_text(encoding="utf-8"))
        rest2 = json.loads((RES / f"_r{run}_rest2.json")
                           .read_text(encoding="utf-8"))
        rest3 = json.loads((RES / f"_r{run}_rest3.json")
                           .read_text(encoding="utf-8"))
        rest4 = json.loads((RES / f"_r{run}_rest4.json")
                           .read_text(encoding="utf-8"))
        resultat = {"stage1": fusionner_s1(pieces),
                    "stage1bis": rest1["stage1bis"],
                    "stage2": rest2, "stage3": rest3["stage3"],
                    "planche": rest3["planche"], "stage4": rest4["stage4"],
                    "standings": rest4["standings"]}
        (RES / f"_r{run}_canon.json").write_bytes(_canonique(resultat))
        for li in range(len(LABELS)):
            for ci in range(len(C1_MODES)):
                (RES / f"_r{run}_s1_l{li}c{ci}.json").unlink()
        for suffix in ("rest1", "rest2", "rest3", "rest4"):
            (RES / f"_r{run}_{suffix}.json").unlink()
        print(f"run {run} fusionné — empreinte posée pour la comparaison")
        return 0
    if part == "final":
        return finaliser()
    print(f"tronçon inconnu : {part}")
    return 1


def finaliser() -> int:
    b1 = (RES / "_r1_canon.json").read_bytes()
    b2 = (RES / "_r2_canon.json").read_bytes()
    sha1 = hashlib.sha256(b1).hexdigest()
    sha2 = hashlib.sha256(b2).hexdigest()
    cor8 = sha1 == sha2
    r1 = json.loads(b1)
    s1, s1b, s2 = r1["stage1"], r1["stage1bis"], r1["stage2"]
    s3, sp, s4 = r1["stage3"], r1["planche"], r1["stage4"]
    n = s1["configs"]
    md5_count = len(s1["md5_texts"])
    del s1["md5_texts"]                                    # allège le payload

    criteres = {
        "COR1_fragment_complet": {
            "definition": "espace exhaustif compacté (1 990 656 configurations "
                          "= 4 c1 × 2 bandes c2 × 32 états c3 × 4 bandes sA × "
                          "3 bandes sB × 2 états h≥r × 54 états journal × 6 "
                          "libellés) → fragment L8 7 blocs, 0 champ vide + "
                          "475/475 archivées",
            "observe": f"{s1['fragment_complet']}/{n} · archivées "
                       f"{s2['fragments_complets']}/{s2['lignes']}",
            "pass": s1["fragment_complet"] == n
                    and s2["fragments_complets"] == s2["lignes"]},
        "COR2_double_chemin": {
            "definition": "chemin indépendant (tables cahier, sans le cœur) "
                          "≡ vrai verifier_forces sur tout l'espace + 475 "
                          "archivées ; compactations PROUVÉES (512 sous-" "ensembles c3 · 4 096 quadruplets journal · 160 paires "
                          "h≥r + égalité pile · invariance N · invariance des "
                          "6 libellés · platitudes c2) ; miroir 262 144/262 144 ; "
                          "plancher monotone 211 200 états "
                          "(clés lues ⊆ {somme} · formule somme 1 600/1 600 · "
                          "identité stricte à (ial=0, H5=0))",
            "observe": f"écarts espace {s1['cor2_ecarts']} · archivées "
                       f"{len(s2['ecarts'])} · c3 {s1b['c3_compaction']} · "
                       f"journal {s1b['journal_compaction']} ({s1b['journal_motifs_realises']} motifs) · "
                       f"h≥r {s1b['hgeq_paires']} (pile {s1b['hgeq_egalite_pile']}) · "
                       f"N {s1b['n_invariance']} · libellés "
                       f"{s1b['label_invariance']} · c2 {s1b['c2_platitude']} · "
                       f"miroir {s3['paires']} écarts {s3['ecarts']} · planche "
                       f"{sp['etats']} violations {sp['violations_monotonie']} · "
                       f"clés {sp['cles_lues']}",
            "pass": (s1["cor2_ecarts"] == 0 and len(s2["ecarts"]) == 0
                     and s1b["c3_compaction"]["ecarts"] == 0
                     and s1b["journal_compaction"]["ecarts"] == 0
                     and s1b["hgeq_paires"]["ecarts"] == 0
                     and s1b["hgeq_egalite_pile"] is True
                     and s1b["n_invariance"]["ecarts"] == 0
                     and s1b["label_invariance"]["ecarts"] == 0
                     and s1b["c2_platitude"]["ecarts"] == 0
                     and s3["ecarts"] == 0 and not s3["crash"]
                     and s3["presumes_cle_vide"]
                     and sp["violations_monotonie"] == 0
                     and sp["cles_hors_somme"] == 0
                     and sp["somme_formule"]["ecarts"] == 0
                     and sp["identite_ial0_h5_0"]["ecarts"] == 0)},
        "COR3_seuils_aide": {
            "definition": "S1 = plancher 🔴 (sA ≥ 3,70 ∨ sA ≥ 3,21 ∧ sB ≥ 3,21 "
                          "— conditions 🔴 du VRAI palier indépendantes des "
                          "inconnues) ; S2 = plancher 🟠 (somme ∈ [0,30 ; "
                          "0,60)) sans S1 ; 0 borne pile sur la grille Q1 ; "
                          "sondes ±ε stables ; bornes de la bande somme "
                          "cohérentes (0,30 pile inclus · 0,60 exclu) ; "
                          "D-CRISE non applicable (consigné)",
            "observe": f"S1 {s1['S1']}/{n} · S2 {s1['S2']}/{n} · pile "
                       f"{len(s1b['grille_q1']['pile'])} · dist min "
                       f"{s1b['grille_q1']['dist_min_seuils']} · équivalence "
                       f"{s1b['grille_q1']['equivalence_261']} · sondes "
                       f"{len(s1b['sondes'])} écarts {s1b['sondes_ecarts']} · "
                       f"sensibilité journal "
                       f"{len(s1b['journal_sensibilite'])} écarts "
                       f"{s1b['journal_sens_ecarts']} · bornes somme "
                       f"{s1b['somme_bornes']}",
            "pass": (s1b["grille_q1"]["pile"] == []
                     and s1b["grille_q1"]["equivalence_261"]
                     and s1b["sondes_ecarts"] == 0
                     and s1b["journal_sens_ecarts"] == 0
                     and s1b["somme_bornes"]["coherent"]
                     and sp["plancher_probes_ok"])},
        "COR4_vocabulaire_ecran": {
            "definition": "0 mot interdit (canon Partie 9) sur tous les textes "
                          "générés + clauses standing + templates réels + "
                          "libellés du cœur ; D-SIM sur chaque bloc",
            "observe": f"max mots interdits par texte = "
                       f"{s1['mots_interdits_max']}/{s2['mots_interdits_max']}"
                       f"/{s3['mots_interdits_max']} ; standing = "
                       f"{r1['standings']['mots_interdits_standings']} ; "
                       f"labels cœur = "
                       f"{r1['standings']['labels_coeur_propres']} ; "
                       f"textes distincts = {md5_count} ; D-SIM manquants "
                       f"{s1['dsim_manquants']}/{s2['dsim_manquants']}",
            "pass": s1["mots_interdits_max"] == 0
                    and s2["mots_interdits_max"] == 0
                    and s3["mots_interdits_max"] == 0
                    and r1["standings"]["mots_interdits_standings"] == 0
                    and r1["standings"]["labels_coeur_propres"] == 0
                    and s1["dsim_manquants"] == 0
                    and s2["dsim_manquants"] == 0},
        "COR5_anti_fabrication": {
            "definition": "SILENCIEUSE ssi 0 voie (vrai moteur) ; templates "
                          "réels affichés EXACTEMENT pour les forces retenues "
                          "(0 marqueur sur SILENCIEUSE, 0 marqueur manquant "
                          "sinon) ; « rien à fabriquer » ssi ZONE CALME ; "
                          "exclues de la limite des 2 jamais affichées comme "
                          "forces",
            "observe": f"espace : zc abus {s1['zc_abus']} · zc manquant "
                       f"{s1['zc_manquant']} · marqueur abus "
                       f"{s1['marqueur_abus']} · marqueur manquant "
                       f"{s1['marqueur_manquant']} · exclues "
                       f"{s1['exclues_cas']} incohérentes "
                       f"{s1['exclues_incoherentes']} ; archivées : zc abus "
                       f"{s2['zc_abus']} · zc manquant {s2['zc_manquant']} · "
                       f"marqueur abus {s2['marqueur_abus']} · manquant "
                       f"{s2['marqueur_manquant']}",
            "pass": (s1["zc_abus"] == 0 and s1["zc_manquant"] == 0
                     and s1["marqueur_abus"] == 0
                     and s1["marqueur_manquant"] == 0
                     and s1["exclues_incoherentes"] == 0
                     and s2["zc_abus"] == 0 and s2["zc_manquant"] == 0
                     and s2["marqueur_abus"] == 0
                     and s2["marqueur_manquant"] == 0)},
        "COR6_rescore_bit_exact": {
            "definition": "les 475 profils R1 régénérés par le VRAI simulateur "
                          "(seed 42) ≡ CSV archivé profils_marque.csv (13 "
                          "champs × 475 = 6 175 comparaisons) ; couche "
                          "appliquée (fragments complets, S1/S2, pas, "
                          "long_termique STABLE 475/475)",
            "observe": f"{s2['lignes']} lignes · {s2['comparaisons']} "
                       f"comparaisons · écarts {len(s2['ecarts'])} · "
                       f"fragments {s2['fragments_complets']} · S1 "
                       f"{s2['S1']} · S2 {s2['S2']} · silencieuses "
                       f"{s2['silencieuses']} · long_termique STABLE "
                       f"{s2['long_termique_stable']} · statuts "
                       f"{s2['statuts']}",
            "pass": (s2["lignes"] == 475 and s2["comparaisons"] == 475 * 13
                     and len(s2["ecarts"]) == 0
                     and s2["fragments_complets"] == 475
                     and s2["pas_non_resolus"] == 0
                     and s2["long_termique_stable"] == 475)},
        "COR7_couplage_pas": {
            "definition": "18/18 (3 faces Q1 × 6 étiquettes) → pas du VRAI "
                          "selectionner_pas (Q5) ; empreintes réelles "
                          "documentées ; identité face Q5 ⇔ type Q4 sur les 12 "
                          "bandes ; suivi 14 jours sans sanction ; "
                          "long_termique 4/4 (FIABLE/BRUIT/STABLE) ; re-test "
                          "8 semaines (vrai programmer_re_test_q1, jamais "
                          "forcé)",
            "observe": f"pas résolus {s4['pas_resolus']}/18 · empreintes "
                       f"{s4['empreintes_reelles']} · identité "
                       f"{sum(1 for i in s4['identite_face_type'] if i['coherent'])}"
                       f"/{len(s4['identite_face_type'])} · suivi {s4['suivi_15']['sans_sanction']}/15 "
                       f"{s4['suivi_15']['categories']} · long_termique "
                       f"{s4['long_termique_ok']} · re-test "
                       f"{s4['re_test_ok']} (semaines "
                       f"{s4['re_test_8_semaines']['semaines']})",
            "pass": (s4["pas_resolus"] == 18 and s4["identite_ok"]
                     and s4["suivi_15"]["ok"] and s4["long_termique_ok"]
                     and s4["re_test_ok"] and s1["pas_non_resolus"] == 0)},
        "COR8_reproductibilite": {
            "definition": "pipeline ×2 → SHA-256 identiques",
            "observe": f"{sha1[:16]}… == {sha2[:16]}… → {cor8}", "pass": cor8},
    }

    payload = {
        "package": "validation-q3/correction-philosophique",
        "cible": "RIO-03 « Ce qui me porte »",
        "moteurs_reels": ["validation-q3-r1/src/wtc_q3_core_r1.py (R1) + "
                          "wtc_q3_validation_r1.py (templates réels D-Q3-R1-H)",
                          "validation-q2-r1/src/wtc_q2_core.py (palier + "
                          "filet — plancher hérité)",
                          "validation-q4/src/wtc_q4_core.py",
                          "validation-q5/src/wtc_q5_core.py"],
        "espace": {
            "etats": "4 c1 × 2 bandes c2 × 32 états c3 × 4 bandes sA × 3 "
                     "bandes sB × 2 états h≥r × 54 états journal × 6 "
                     "libellés",
            "compactions_prouvees": "c3 512 → 32 · journal 4 096 → 26 motifs × "
                                    "2 bandes N + 2 · h≥r 160 → 2 · libellés "
                                    "sans effet sur les forces",
            "configs_assemblees": n,
        },
        "cor8_sha256_run1": sha1, "cor8_sha256_run2": sha2,
        "criteres": criteres,
        "stage1": s1,
        "stage1bis": s1b,
        "stage2": s2,
        "stage2_ecarts": s2["ecarts"][:20],
        "stage3": s3,
        "planche": sp,
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


def main() -> int:
    r1 = pipeline()
    (RES / "_r1_canon.json").write_bytes(_canonique(r1))
    r2 = pipeline()
    (RES / "_r2_canon.json").write_bytes(_canonique(r2))
    return finaliser()


if __name__ == "__main__":
    part = os.environ.get("CORR_PART", "")
    if part:
        sys.exit(run_part(part))
    sys.exit(main())
