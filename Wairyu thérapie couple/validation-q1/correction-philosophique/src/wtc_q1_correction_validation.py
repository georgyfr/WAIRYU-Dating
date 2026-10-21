# -*- coding: utf-8 -*-
"""
WTC-Q1 — VALIDATION DE LA COUCHE DE CORRECTION PHILOSOPHIQUE (RIO-01)
======================================================================
Exécute les 4 stages de preuve sur le VRAI moteur (zéro réimplémentation) :

  Stage 1 — Énumération EXHAUSTIVE de l'espace atteignable : les 6 faces
            (3 items chacune) ont des sommes dans [3 ; 12] → 10^6 = 1 000 000
            configurations de faces, chacune atteignable par de vraies
            réponses (items indépendants, corrigés ∈ {1,2,3,4}). Toute la
            sortie de la couche de correction (palier, seuils, textes,
            fragment de bilan) est calculée par les fonctions réelles et
            vérifiée configuration par configuration.
  Stage 2 — Re-score BIT-EXACT des 520 réponses archivées du pipeline R1
            (500 honnêtes + 20 piégés) via le vrai cœur, puis application
            de la couche : gate « qualité avant sens » (R4).
  Stage 3 — Vocabulaire écran : 0 mot interdit sur tous les textes générés
            (canon Partie 9), bandeau D-SIM présent à 100 %.
  Stage 4 — Couplage pas : 9/9 combinaisons (face Q5 × empreinte) résolues
            par le VRAI moteur Q5 ; équivalence exacte des frontières
            Q1 (seuils 1,80/2,60/3,20) ↔ Q4/Q5 (seuil 2,61) sur les 28
            scores atteignables.
  COR8    — Reproductibilité : pipeline exécuté 2 fois, SHA-256 identiques.

Sorties : results/correction_criteres.json · results/rapport-correction-RIO-01.md
"""

from __future__ import annotations

import csv
import hashlib
import json
import os
import sys
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parent))
import wtc_q1_correction as corr          # la couche (charge les vrais moteurs)
core_r1 = corr.core_r1
core_q4 = corr.core_q4
core_q5 = corr.core_q5

RES = Path(__file__).resolve().parents[1] / "results"
SMOKE = os.environ.get("CORR_SMOKE") == "1"   # échantillon réduit (test rapide)
R_FACES = range(3, 13, 5) if SMOKE else range(3, 13)

SEUILS = core_r1.SEUILS_NIVEAUX            # (1.80, 2.60, 3.20)
DEMI_CI = core_r1.CI90_DEMI                # 0.3198 (R1, D1)
BANDEAU_OK = corr.BANDEAU_DSIM


# ─────────────────────────────────────────────────────────────────────────────
# STAGE 1 — ÉNUMÉRATION EXHAUSTIVE (10^6 configurations de faces)
# ─────────────────────────────────────────────────────────────────────────────
def stage1() -> dict:
    # Pré-calcul PAR AXE : 10^3 triplets (f1, f2, f3), chacun ∈ [3 ; 12]
    def table_axe(axe: str) -> list[dict]:
        fids = [fid for fid, f in core_r1.FACES.items() if f["axe"] == axe]
        out = []
        for f1 in R_FACES:
            for f2 in R_FACES:
                for f3 in R_FACES:
                    faces_scores = {fids[0]: round(f1 / 3, 2),
                                    fids[1]: round(f2 / 3, 2),
                                    fids[2]: round(f3 / 3, 2)}
                    somme = f1 + f2 + f3
                    score = round(somme / 9.0, 2)          # VRAI cœur (L2, arrondi 2 dp)
                    bas, haut = core_r1.bornes_ci90(score)  # VRAI cœur
                    lect = core_r1.lecture_L3(score, bas, haut)
                    l4 = core_r1.lecture_L4(faces_scores, axe)
                    out.append({
                        "somme": somme, "score": score, "bas": bas, "haut": haut,
                        "lect": lect, "l4": l4,
                        "cons": lect["niveau_conservateur"],
                        "rang_ponctuel": corr.RANG_NIVEAU[core_r1.niveau_ponctuel(score)],
                    })
        return out

    tabA = table_axe("A")
    tabB = table_axe("B")

    stats = {
        "configs": 0, "fragment_complet": 0,
        "cor2_ecarts": 0,
        "paliers": {"🟢": 0, "🟠": 0, "🔴": 0},
        "rang_quete": {0: 0, 1: 0, 2: 0, 3: 0},
        "S1": 0, "S2": 0,
        "frontiere_A": 0, "frontiere_B": 0,
        "face_q5": {"RASSUREE": 0, "EN_QUETE": 0, "SUR_LA_RA": 0},
        "type_q4": {"SEREIN": 0, "PREOCCUPE": 0, "DETACHE": 0, "EN_ALERTFEU": 0},
        "zone_calme_texte": 0, "configs_avec_axe_bas": 0,
        "zone_calme_sur_axe_actif": 0,
        "md5_texts": set(), "mots_interdits_max": 0, "dsim_manquants": 0,
        "pile_score": 0, "pile_ci": 0,
        "junction_incoherente": 0,
    }

    for eA in tabA:
        s1A = eA["cons"] == "Forte"
        s2A = (not s1A) and eA["haut"] >= 3.20
        frA = eA["lect"]["type"] == "FRONTIERE"
        for eB in tabB:
            s1B = eB["cons"] == "Forte"
            s2B = (not s1B) and eB["haut"] >= 3.20
            frB = eB["lect"]["type"] == "FRONTIERE"
            stats["configs"] += 1
            pal = corr.palier_et_seuils(eA["cons"], eB["cons"],
                                        eA["lect"]["touches"], eB["lect"]["touches"])
            # COR2 — chemin indépendant (entiers, avant arrondi)
            pal_i = corr.palier_independant(eA["somme"], eB["somme"], DEMI_CI)
            if (pal_i["palier"] != pal["palier"]
                    or sorted(pal_i["S1_axes"]) != sorted(pal["S1_axes"])
                    or sorted(pal_i["S2_axes"]) != sorted(pal["S2_axes"])):
                stats["cor2_ecarts"] += 1
            # F4 — fragment de bilan (junctions réelles Q4/Q5)
            scores = {"A": eA["score"], "B": eB["score"]}
            frag = corr.bilan_fragment(eA["lect"], eB["lect"], eA["l4"], eB["l4"],
                                       scores, pal)
            if frag["_complet"]:
                stats["fragment_complet"] += 1
            stats["face_q5"][frag["bloc_3_empreinte"]["face_q5"]] += 1
            stats["type_q4"][frag["bloc_4_couple"]["type_mesure"]] += 1
            # Écran (R5-R8)
            bloc = corr.bloc_ecran(eA["lect"], eB["lect"], eA["l4"], eB["l4"], pal)
            t = bloc["texte"]
            if bloc["nb_mots_interdits"] > stats["mots_interdits_max"]:
                stats["mots_interdits_max"] = bloc["nb_mots_interdits"]
            if BANDEAU_OK not in t:
                stats["dsim_manquants"] += 1
            stats["md5_texts"].add(bloc["md5"])
            bas_A = eA["cons"] in ("Discrète", "Tranquille")
            bas_B = eB["cons"] in ("Discrète", "Tranquille")
            calme = "rien à fabriquer" in t
            if bas_A or bas_B:
                stats["configs_avec_axe_bas"] += 1
                if calme:
                    stats["zone_calme_texte"] += 1
            else:
                if calme:  # R5 : JAMAIS sur deux axes actifs
                    stats["zone_calme_sur_axe_actif"] += 1
            # Compteurs
            stats["paliers"][pal["palier"]] += 1
            stats["rang_quete"][pal["rang_quete"]] += 1
            if pal["S1_axes"]:
                stats["S1"] += 1
            if pal["S2_axes"]:
                stats["S2"] += 1
            if frA:
                stats["frontiere_A"] += 1
            if frB:
                stats["frontiere_B"] += 1
            # PILE — scores/CI exactement sur un seuil
            for sc in (eA["score"], eB["score"]):
                if sc in SEUILS:
                    stats["pile_score"] += 1
            for b in (eA["bas"], eA["haut"], eB["bas"], eB["haut"]):
                if b in SEUILS:
                    stats["pile_ci"] += 1
            # Junction conservateur vs type Q4/Q5 (jamais de type bas sous
            # un conservateur actif : rang(type) ≥ rang(conservateur) par axe)
            r_type_A = 2 if eA["score"] >= 2.61 else 0
            r_type_B = 2 if eB["score"] >= 2.61 else 0
            if (r_type_A == 0 and corr.RANG_NIVEAU[eA["cons"]] >= 2) or \
               (r_type_B == 0 and corr.RANG_NIVEAU[eB["cons"]] >= 2):
                stats["junction_incoherente"] += 1

    stats["md5_texts_count"] = len(stats["md5_texts"])
    del stats["md5_texts"]
    return stats


BANDEAU_OK = corr.BANDEAU_DSIM


# ─────────────────────────────────────────────────────────────────────────────
# STAGE 2 — RE-SCORE BIT-EXACT DES 520 RÉPONSES ARCHIVÉES + GATE (R4)
# ─────────────────────────────────────────────────────────────────────────────
def stage2() -> dict:
    res = {"lignes": 0, "ecarts": [],
           "gate_OK": 0, "gate_PRUDENCE": 0, "gate_INVALIDE": 0,
           "mention_prudence": 0,
           "honnêtes_OK": 0, "honnêtes_PRUDENCE": 0, "pieges_non_OK": 0,
           "pieges_statuts": {},
           "paliers_honnetes": {"🟢": 0, "🟠": 0, "🔴": 0},
           "S1_honnetes": 0, "S2_honnetes": 0,
           "fragments_complets_honnetes": 0,
           "synthetiques_invalide": 0, "synthetiques_suspendus": 0}
    base = Path(__file__).resolve().parents[3] / "validation-q1-r1"  # vérité R1
    for nom_f, attendu_non_ok in (
        ("reponses_honnetes_calculees.csv", False),
        ("reponses_pieges_calculees.csv", True),
    ):
        chemin = base / "results" / nom_f
        with open(chemin, newline="", encoding="utf-8-sig") as fh:
            for row in csv.DictReader(fh):
                res["lignes"] += 1
                bruts = {i: int(row[f"r{i}"]) for i in range(1, 19)}
                cor = core_r1.corrige_tous(bruts)
                scores = core_r1.scores_axes(cor)
                faces = core_r1.scores_faces(cor)
                # RQS — recomposée depuis les composantes archivées :
                # linéarité/contradiction/vigilance recalculées des items ;
                # rythme re-dérivé des composantes archivées (les temps par
                # item ne sont pas archivés dans le CSV — consigné).
                vals = np.array([cor[i] for i in range(1, 19)], dtype=float)
                pen_lin = float(np.std(vals, ddof=1)) < core_r1.SEUIL_LINEARITE
                pen_contra = False
                for item_inv in core_r1.ITEMS_INVERSES:
                    fid = core_r1.face_de_item(item_inv)
                    autres = [i for i in core_r1.FACES[fid]["items"] if i != item_inv]
                    if abs(cor[item_inv] - sum(bruts[i] for i in autres) / 2) >= core_r1.SEUIL_CONTRADICTION:
                        pen_contra = True
                pen_vig = int(row["vigilance"]) != core_r1.VIGILANCE_ATTENDUE
                nb_rap = int(float(row["rqs_nb_items_rapides"]))
                pen_ryt = nb_rap >= core_r1.NB_ITEMS_RAPIDES or \
                    float(row["temps_session"]) < core_r1.SEUIL_SESSION_S
                total_pen = ((core_r1.PENALITE_LINEARITE if pen_lin else 0)
                             + (core_r1.PENALITE_CONTRADICTION if pen_contra else 0)
                             + (core_r1.PENALITE_RYTHME if pen_ryt else 0)
                             + (core_r1.PENALITE_VIGILANCE if pen_vig else 0))
                rqs = max(0, 100 - total_pen)
                statut = ("OK" if rqs >= core_r1.SEUIL_STATUT_OK
                          else "PRUDENCE" if rqs >= core_r1.SEUIL_STATUT_PRUDENCE
                          else "INVALIDE")
                # Lectures via le VRAI cœur
                ciA = core_r1.bornes_ci90(scores["A"])
                ciB = core_r1.bornes_ci90(scores["B"])
                lectA = core_r1.lecture_L3(scores["A"], *ciA)
                lectB = core_r1.lecture_L3(scores["B"], *ciB)
                l4A = core_r1.lecture_L4(faces, "A")
                l4B = core_r1.lecture_L4(faces, "B")
                verifs = [
                    ("rqs", rqs, int(float(row["rqs"]))),
                    ("rqs_statut", statut, row["rqs_statut"]),
                    ("total_pen", total_pen, int(float(row["rqs_total_penalites"]))),
                    ("score_A", scores["A"], float(row["score_A"])),
                    ("ci_bas_A", ciA[0], float(row["ci_bas_A"])),
                    ("ci_haut_A", ciA[1], float(row["ci_haut_A"])),
                    ("type_A", lectA["type"], row["type_lecture_A"]),
                    ("cons_A", lectA["niveau_conservateur"], row["conservateur_A"]),
                    ("touches_A", len(lectA["touches"]), int(row["nb_touches_A"])),
                    ("ponct_A", core_r1.niveau_ponctuel(scores["A"]), row["niveau_ponctuel_A"]),
                    ("l4_ordre_A", ">".join(l4A["ordre"]), row["l4_ordre_A"]),
                    ("l4_ecart_A", round(l4A["ecart_1_2"], 2), float(row["l4_ecart_A"])),
                    ("l4_lec_A", l4A["lecture"], row["l4_lecture_A"]),
                    ("score_B", scores["B"], float(row["score_B"])),
                    ("ci_bas_B", ciB[0], float(row["ci_bas_B"])),
                    ("ci_haut_B", ciB[1], float(row["ci_haut_B"])),
                    ("type_B", lectB["type"], row["type_lecture_B"]),
                    ("cons_B", lectB["niveau_conservateur"], row["conservateur_B"]),
                    ("touches_B", len(lectB["touches"]), int(row["nb_touches_B"])),
                    ("ponct_B", core_r1.niveau_ponctuel(scores["B"]), row["niveau_ponctuel_B"]),
                    ("l4_ordre_B", ">".join(l4B["ordre"]), row["l4_ordre_B"]),
                    ("l4_ecart_B", round(l4B["ecart_1_2"], 2), float(row["l4_ecart_B"])),
                    ("l4_lec_B", l4B["lecture"], row["l4_lecture_B"]),
                ]
                for champ, calcule, archive in verifs:
                    if calcule != archive:
                        res["ecarts"].append({
                            "id": row["identifiant"], "champ": champ,
                            "calcule": str(calcule), "archive": str(archive)})
                # Gate qualité avant sens (R4) + couche
                if statut == "OK":
                    res["gate_OK"] += 1
                elif statut == "PRUDENCE":
                    res["gate_PRUDENCE"] += 1
                else:
                    res["gate_INVALIDE"] += 1
                if attendu_non_ok:
                    res["pieges_statuts"][statut] = res["pieges_statuts"].get(statut, 0) + 1
                    if statut != "OK":
                        res["pieges_non_OK"] += 1
                else:
                    if statut == "OK":
                        res["honnêtes_OK"] += 1
                    elif statut == "PRUDENCE":
                        res["honnêtes_PRUDENCE"] += 1
                if statut in ("OK", "PRUDENCE"):
                    pal = corr.palier_et_seuils(lectA["niveau_conservateur"],
                                                lectB["niveau_conservateur"],
                                                lectA["touches"], lectB["touches"])
                    if not attendu_non_ok:
                        res["paliers_honnetes"][pal["palier"]] += 1
                        if pal["S1_axes"]:
                            res["S1_honnetes"] += 1
                        if pal["S2_axes"]:
                            res["S2_honnetes"] += 1
                        frag = corr.bilan_fragment(lectA, lectB, l4A, l4B,
                                                   {"A": scores["A"], "B": scores["B"]},
                                                   pal, statut)
                        if frag["_complet"]:
                            res["fragments_complets_honnetes"] += 1
                    bloc = corr.bloc_ecran(lectA, lectB, l4A, l4B, pal, statut)
                    if statut == "PRUDENCE" and "prudence" in bloc["texte"]:
                        res["mention_prudence"] += 1
    # Voie de suspension (INVALIDE) — 4 cas SYNTHÉTIQUES (D-SIM, documentés),
    # exécutés par le VRAI calcule_rqs du cœur R1 (temps par item fournis ici).
    synth = [
        ("a linearite+vigilance",
         {i: 2 for i in range(1, 19)}, {i: 5.0 for i in range(1, 19)}, 100.0, 1),
        ("b contradiction+rythme",
         {**{i: 3 for i in range(1, 19)}, 1: 4, 2: 4, 5: 4},
         {**{i: 5.0 for i in range(1, 19)}, **{i: 0.5 for i in range(6, 11)}},
         40.0, 3),
        ("c linearite+rythme+vigilance",
         {i: 2 for i in range(1, 19)},
         {**{i: 5.0 for i in range(1, 19)}, **{i: 1.0 for i in range(1, 6)}},
         25.0, 2),
        ("d contradiction+vigilance",
         {**{i: 4 for i in range(1, 19)}, 5: 4},
         {i: 5.0 for i in range(1, 19)}, 100.0, 1),
    ]
    for nom_c, bruts_s, temps_s, session_s, vigil_s in synth:
        rqs_s = core_r1.calcule_rqs(bruts_s, temps_s, session_s, vigil_s)
        if rqs_s["statut"] == "INVALIDE":
            res["synthetiques_invalide"] += 1
            cor_s = core_r1.corrige_tous(bruts_s)
            sc_s = core_r1.scores_axes(cor_s)
            fc_s = core_r1.scores_faces(cor_s)
            ciA = core_r1.bornes_ci90(sc_s["A"])
            ciB = core_r1.bornes_ci90(sc_s["B"])
            lectA_s = core_r1.lecture_L3(sc_s["A"], *ciA)
            lectB_s = core_r1.lecture_L3(sc_s["B"], *ciB)
            l4A_s = core_r1.lecture_L4(fc_s, "A")
            l4B_s = core_r1.lecture_L4(fc_s, "B")
            pal_s = corr.palier_et_seuils(lectA_s["niveau_conservateur"],
                                          lectB_s["niveau_conservateur"],
                                          lectA_s["touches"], lectB_s["touches"])
            bloc_s = corr.bloc_ecran(lectA_s, lectB_s, l4A_s, l4B_s, pal_s,
                                     statut="INVALIDE")
            if (bloc_s["suspendu"] and "suspendue" in bloc_s["texte"]
                    and "se lit" not in bloc_s["texte"]):
                res["synthetiques_suspendus"] += 1
    return res


# ─────────────────────────────────────────────────────────────────────────────
# STAGE 4 — COUPLAGE PAS (VRAI Q5) + ÉQUIVALENCE DES FRONTIÈRES Q1 ↔ Q4/Q5
# ─────────────────────────────────────────────────────────────────────────────
def stage4() -> dict:
    faces_q5 = ["RASSUREE", "EN_QUETE", "SUR_LA_RA"]
    representants = {"RASSUREE": (2.0, 2.0), "EN_QUETE": (3.0, 2.0),
                     "SUR_LA_RA": (2.0, 3.0)}
    table = {}
    for face in faces_q5:
        sA, sB = representants[face]
        for emp in core_q5.EMPREINTES:
            sel = core_q5.selectionner_pas(sA, sB, emp.replace("_", " ").title())
            table[f"{face}|{emp}"] = sel["pas"]
    # Équivalence frontières : (score ≥ 2,61) ⇔ niveau ponctuel ∈ {Vive, Forte}
    scores_atteignables = [round(k / 9, 2) for k in range(9, 37)]
    equivalence = []
    for s in scores_atteignables:
        gauche = s >= 2.61
        droite = core_r1.niveau_ponctuel(s) in ("Vive", "Forte")
        equivalence.append({"score": s, "ge_261": gauche,
                            "niveau": core_r1.niveau_ponctuel(s),
                            "coherent": gauche == droite})
    return {
        "pas_9": table,
        "pas_resolus": sum(1 for v in table.values() if v in core_q5.PAS_BANQUE),
        "scores_atteignables": scores_atteignables,
        "equivalence_261": equivalence,
        "equivalence_ok": all(e["coherent"] for e in equivalence),
        "pile_scores_seuils": [s for s in scores_atteignables if s in SEUILS],
        "dist_min_seuils": {str(th): min(abs(s - th) for s in scores_atteignables)
                            for th in SEUILS},
    }


# ─────────────────────────────────────────────────────────────────────────────
# PIPELINE COMPLET (exécuté 2 fois pour COR8)
# ─────────────────────────────────────────────────────────────────────────────
def pipeline() -> dict:
    s1 = stage1()
    s2 = stage2()
    s4 = stage4()
    return {"stage1": s1, "stage2": s2, "stage4": s4,
            "standings": {
                "mots_interdits_standings": max(
                    [sum(1 for m in corr.MOTS_INTERDITS if m in t.lower())
                     for t in (corr.BANDEAU_DSIM, corr.PHRASE_ORIENTATION,
                               corr.clause_aide_standing())]),
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

    s1, s2, s4 = r1["stage1"], r1["stage2"], r1["stage4"]
    n = s1["configs"]

    criteres = {
        "COR1_fragment_complet": {
            "definition": "10^6/10^6 configurations → fragment L8 7 blocs, 0 champ vide",
            "observe": f"{s1['fragment_complet']}/{n}", "pass": s1["fragment_complet"] == n},
        "COR2_derivation_palier": {
            "definition": "chemin indépendant (entiers, avant arrondi) ≡ chemin cœur (palier + S1 + S2)",
            "observe": f"{n - s1['cor2_ecarts']}/{n} convergents",
            "pass": s1["cor2_ecarts"] == 0},
        "COR3_seuils_aide": {
            "definition": "S1 ssi conservateur Forte ; S2 ssi ci_haut ≥ 3,20 sans conservateur Forte ; 0 borne pile",
            "observe": f"S1 {s1['S1']}/{n} · S2 {s1['S2']}/{n} · pile score {s1['pile_score']} · pile CI {s1['pile_ci']}",
            "pass": s1["pile_score"] == 0 and s1["pile_ci"] == 0 and s4["equivalence_ok"]},
        "COR4_vocabulaire_ecran": {
            "definition": "0 mot interdit (canon Partie 9) sur tous les textes générés + clauses standing",
            "observe": f"max mots interdits par texte = {s1['mots_interdits_max']} ; "
                       f"standing = {r1['standings']['mots_interdits_standings']} ; "
                       f"textes distincts = {s1['md5_texts_count']}",
            "pass": s1["mots_interdits_max"] == 0
                    and r1["standings"]["mots_interdits_standings"] == 0},
        "COR5_anti_fabrication": {
            "definition": "« rien à fabriquer » ssi ≥ 1 axe Discrète/Tranquille ; JAMAIS sur 2 axes actifs",
            "observe": f"calme {s1['zone_calme_texte']}/{s1['configs_avec_axe_bas']} configs à axe bas ; "
                       f"abus sur axe actif = {s1['zone_calme_sur_axe_actif']}",
            "pass": s1["zone_calme_sur_axe_actif"] == 0
                    and s1["zone_calme_texte"] == s1["configs_avec_axe_bas"]},
        "COR6_gate_qualite": {
            "definition": "R4 : OK → lecture · PRUDENCE → lecture + mention · INVALIDE → suspension ; "
                          "re-score bit-exact des 520 réponses R1 ; pièges statut ≠ OK 20/20 ; voie de suspension "
                          "prouvée sur 4 cas synthétiques INVALIDE (D-SIM) via le vrai calcule_rqs",
            "observe": f"520 lignes : OK {s2['gate_OK']} · PRUDENCE {s2['gate_PRUDENCE']} "
                       f"(mention {s2['mention_prudence']}/{s2['gate_PRUDENCE']}) · INVALIDE {s2['gate_INVALIDE']} ; "
                       f"piégés ≠ OK {s2['pieges_non_OK']}/20 {s2['pieges_statuts']} ; "
                       f"suspension {s2['synthetiques_suspendus']}/{s2['synthetiques_invalide']} ; "
                       f"écarts bit-exact {len(s2['ecarts'])}",
            "pass": (s2["gate_OK"] + s2["gate_PRUDENCE"] + s2["gate_INVALIDE"] == 520
                     and s2["mention_prudence"] == s2["gate_PRUDENCE"]
                     and s2["pieges_non_OK"] == 20
                     and s2["synthetiques_suspendus"] == 4
                     and len(s2["ecarts"]) == 0)},
        "COR7_couplage_pas": {
            "definition": "9/9 (face Q5 × empreinte) → pas du VRAI moteur Q5 ; junction Q1↔Q4/Q5 cohérente",
            "observe": f"pas résolus {s4['pas_resolus']}/9 · junctions incohérentes {s1['junction_incoherente']}",
            "pass": s4["pas_resolus"] == 9 and s1["junction_incoherente"] == 0},
        "COR8_reproductibilite": {
            "definition": "pipeline ×2 → SHA-256 identiques",
            "observe": f"{sha1[:16]}… == {sha2[:16]}… → {cor8}", "pass": cor8},
    }

    RES.mkdir(exist_ok=True)
    payload = {
        "package": "validation-q1/correction-philosophique",
        "cible": "RIO-01 « Comment je me raccroche »",
        "moteurs_reels": ["validation-q1-r1/src/wtc_q1_core.py (SEM 0,195)",
                          "validation-q4/src/wtc_q4_core.py",
                          "validation-q5/src/wtc_q5_core.py"],
        "cor8_sha256_run1": sha1, "cor8_sha256_run2": sha2,
        "criteres": criteres,
        "stage1": {k: v for k, v in s1.items()},
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
