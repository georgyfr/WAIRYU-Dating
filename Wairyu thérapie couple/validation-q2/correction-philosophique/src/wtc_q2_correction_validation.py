# -*- coding: utf-8 -*-
"""
WTC-Q2 — VALIDATION DE LA COUCHE DE CORRECTION PHILOSOPHIQUE (RIO-02)
======================================================================
Exécute les preuves sur le VRAI moteur (zéro réimplémentation) :

  Stage 1  — Énumération EXHAUSTIVE de l'espace des états moteur distincts.
             Le cœur Q2 lit ses entrées uniquement au travers de quantités
             dérivées : cd ∈ [0;6] · cp ∈ [0;4] · état H = (fréquence H5 ∈
             [0;3], cases H1-H4 cochées k ∈ [0;4], somme de ces cases ∈
             [k;3k]) · état R = (k ∈ [0;3], somme ∈ [k;3k]) · i_alarm ∈
             [0;10] · sA/sB (continus, lus au travers des seuils 2,61 /
             3,21 / 3,70 → 4×3 = 12 bandes exactes) · origine (8 catégories,
             lues uniquement par `zone_force`). Soit
             7×5×100×16×5×12 = 3 360 000 états structurels, chacun réalisé
             par de VRAIES réponses (dictionnaires d'items canoniques) et
             étendu aux 2 sorties zone_force réalisables (SÉCURISANT vs les
             7 autres origines — le code ne lit que `origine ==
             "SÉCURISANT"`) → 6 720 000 configurations assemblées.
  Stage 1-bis — Batterie de frontière : chaque seuil (sA 2,61/3,21/3,70 ·
             sB 2,61/3,21 · i_alarm 4|5·5|6·6|7·7|8) est sondé des deux
             côtés (±0,0001 pour les scores, ±1 pour i_alarm) sur une
             batterie d'états repos — la sortie doit être stable sur chaque
             côté et cohérente avec la bande du modèle.
  Stage 2  — Re-score BIT-EXACT des 437 sorties archivées du pipeline R1
             (400 honnêtes + 23 piégés + 8 arêtes + 6 O7-NLP) via le vrai
             cœur, puis application de la couche (gate convergence R4).
  Stage 4  — Couplage pas : 3 faces × 6 étiquettes → VRAI
             `selectionner_pas` (Q5) ; table d'empreintes réelle ;
             identité face Q5 ⇔ type Q4 ; suivi 14 jours sans sanction ;
             grille Q1 (28 scores) vs seuils (0 borne pile).
  COR8     — Reproductibilité : pipeline exécuté 2 fois, SHA-256 identiques.

Sorties : results/correction_criteres.json
"""

from __future__ import annotations

import csv
import hashlib
import json
import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import wtc_q2_correction as corr          # la couche (charge les vrais moteurs)
core_q2 = corr.core_q2
core_q4 = corr.core_q4
core_q5 = corr.core_q5

RES = Path(__file__).resolve().parents[1] / "results"
SMOKE = os.environ.get("CORR_SMOKE") == "1"   # échantillon réduit (test rapide)

SA_BANDS = corr.SA_BANDS
SB_BANDS = corr.SB_BANDS
IAL_BANDS = corr.IAL_BANDS
ORIGINES = list(core_q2.ORIGINES_VALIDES)         # 8 catégories
BANDEAU_OK = corr.BANDEAU_DSIM

# Marqueurs de force (COR5 — anti-fabrication, table indépendante du validateur)
MARQUEURS_FORCE = {"SECURISANT": "sécurisante", "CALME_RICHE": "de la substance",
                   "LUCIDITE": "lucidité", "MAINSLIBRES": "mains libres"}


# ─────────────────────────────────────────────────────────────────────────────
# Réalisations canoniques — chaque état dérivé est atteint par de VRAIES réponses
# ─────────────────────────────────────────────────────────────────────────────
def build_d(cd: int) -> dict:
    return {k: (1 if i < cd else 0) for i, k in enumerate(core_q2.D_ITEMS)}


def build_p(cp: int) -> dict:
    return {k: (1 if i < cp else 0) for i, k in enumerate(core_q2.P_ITEMS)}


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


def hb_kH(hi: int) -> tuple[int, int]:
    """(somme H totale, nb cases H cochées) pour l'état H d'indice hi."""
    h5f, k_oth, s_oth = H_STATES[hi]
    return s_oth + h5f, k_oth + (1 if h5f > 0 else 0)


def rb_kR(ri: int) -> tuple[int, int]:
    k, s = R_STATES[ri]
    return s, k


# ─────────────────────────────────────────────────────────────────────────────
# MÉMOÏSATION DES VRAIS APPELS MOTEUR (fonctions déterministes d'états finis)
# ─────────────────────────────────────────────────────────────────────────────
def precompute() -> dict:
    M = {}
    M["prof"] = {(cd, cp): core_q2.profil_declencheurs(build_d(cd), build_p(cp))
                 for cd in range(7) for cp in range(5)}              # 35
    M["comp"] = {(hi, ri): core_q2.comportements(build_h(*H_STATES[hi]),
                                                 build_r(*R_STATES[ri]))
                 for hi in range(len(H_STATES))
                 for ri in range(len(R_STATES))}                     # 1 600
    M["sig"] = {(H_STATES[hi][0], biA, ib):
                core_q2.signal_securite(H_STATES[hi][0], SA_BANDS[biA][1],
                                        IAL_BANDS[ib][1])
                for hi in range(len(H_STATES))
                for biA in range(4) for ib in range(5)}              # ≤ 2 000
    M["pal"] = {}
    for ib in range(5):
        for biA in range(4):
            for biB in range(3):
                for hi in range(len(H_STATES)):
                    for ri in range(len(R_STATES)):
                        key = (ib, biA, biB, hi, ri)
                        comp = M["comp"][(hi, ri)]
                        sig = M["sig"][(H_STATES[hi][0], biA, ib)]
                        M["pal"][key] = core_q2.palier(
                            IAL_BANDS[ib][1], SA_BANDS[biA][1],
                            SB_BANDS[biB][1], comp, sig)
    M["zf"] = {}

    def zf_values(prof: dict, comp: dict, label: str) -> list[tuple[str, str]]:
        key = (prof["profil"], comp["somme"], label)
        hit = M["zf"].get(key)
        if hit is None:
            out = []
            for origine in ORIGINES:                     # 8 origines évaluées
                zf = core_q2.zone_force(origine, prof, comp, label)
                if zf not in [z for z, _ in out]:
                    out.append((zf, origine))
            out.sort()
            hit = out
            M["zf"][key] = hit
        return hit

    M["zf_values"] = zf_values
    return M


# ─────────────────────────────────────────────────────────────────────────────
# STAGE 1 — ÉNUMÉRATION EXHAUSTIVE (états moteur distincts × zone_force)
# ─────────────────────────────────────────────────────────────────────────────
def stage1(M: dict, bandes=None) -> dict:
    stats = {
        "configs": 0, "fragment_complet": 0, "cor2_ecarts": 0,
        "paliers": {"🟢": 0, "🟠": 0, "🔴": 0},
        "S1": 0, "S2": 0,
        "labels": {}, "types": {}, "forces": {},
        "conv_index": {"1.0": 0, "0.5": 0, "0.0": 0},
        "md5_texts": set(), "mots_interdits_max": 0, "dsim_manquants": 0,
        "zc_abus": 0, "zc_manquant": 0, "force_fabrication_abus": 0,
        "suppression_incoherente": 0, "pas_non_resolus": 0,
        "junction_incoherente": 0, "zf_keys": set(),
    }
    for biA in (range(4) if bandes is None else bandes):
        sA = SA_BANDS[biA][1]
        print(f"  stage1 — bande sA {SA_BANDS[biA][0]} …", flush=True)
        for biB in range(3):
            sB = SB_BANDS[biB][1]
            for cd in range(7):
                for cp in range(5):
                    prof = M["prof"][(cd, cp)]
                    for hi in range(len(H_STATES)):
                        h5f = H_STATES[hi][0]          # fréquence H5 réelle
                        hb, kH = hb_kH(hi)             # somme H totale, cases cochées
                        for ri in range(len(R_STATES)):
                            rb, kR = rb_kR(ri)
                            comp = M["comp"][(hi, ri)]
                            conv = core_q2.convergence(
                                sA, sB, cd, cp, comp["n_checked"],
                                comp["h_norm"], comp["r_norm"])
                            for ib in range(5):
                                ial = IAL_BANDS[ib][1]
                                sig = M["sig"][(h5f, biA, ib)]
                                nom = core_q2.nommage(sA, sB, prof, comp,
                                                      ial, conv)
                                pal = M["pal"][(ib, biA, biB, hi, ri)]
                                # COR2 — chemin indépendant (entiers bruts)
                                pal_i = corr.palier_independant(
                                    cd, cp, hb, rb, h5f, ial, sA, sB)
                                if (pal_i["palier"] != pal
                                        or pal_i["signal"] != sig["signal"]
                                        or pal_i["p_filtre"] != sig["p_filtre"]):
                                    stats["cor2_ecarts"] += 1
                                zfs = M["zf_values"](prof, comp, nom["label"])
                                stats["zf_keys"].add(
                                    (prof["profil"], comp["somme"],
                                     nom["label"]))
                                for zf, origine_ex in zfs:
                                    stats["configs"] += 1
                                    bloc = corr.bloc_ecran(
                                        prof, comp, nom, conv, sig, pal,
                                        zf, sA, sB, ial)
                                    frag = corr.bilan_fragment(
                                        prof, comp, nom, conv, sig, pal,
                                        zf, sA, sB, ial)
                                    if frag["_complet"]:
                                        stats["fragment_complet"] += 1
                                    t = bloc["texte"]
                                    if bloc["nb_mots_interdits"] > stats["mots_interdits_max"]:
                                        stats["mots_interdits_max"] = bloc["nb_mots_interdits"]
                                    if BANDEAU_OK not in t:
                                        stats["dsim_manquants"] += 1
                                    stats["md5_texts"].add(bloc["md5"])
                                    # COR5 — anti-fabrication
                                    if bloc["rien_a_fabriquer"]:
                                        if bloc["label"] != "ZONE CALME":
                                            stats["zc_abus"] += 1
                                    elif bloc["label"] == "ZONE CALME":
                                        stats["zc_manquant"] += 1
                                    if zf == "SILENCIEUSE":
                                        if any(mk in t for mk in MARQUEURS_FORCE.values()):
                                            stats["force_fabrication_abus"] += 1
                                    else:
                                        if MARQUEURS_FORCE[zf] not in t:
                                            stats["force_fabrication_abus"] += 1
                                    # R4 — cohérence suppression
                                    if conv["supprime"]:
                                        if (nom["type"] != "NON_NOMMÉ"
                                                or "Concordance en attente" not in t):
                                            stats["suppression_incoherente"] += 1
                                    # COR7 — pas réellement résolu
                                    if bloc["pas"] not in core_q5.PAS_BANQUE:
                                        stats["pas_non_resolus"] += 1
                                    # Junction type Q4 ⇔ bandes sA/sB (identité)
                                    typ = frag["bloc_4_couple"]["type_mesure"]
                                    if ((sA >= 2.61) != (typ in ("PREOCCUPE", "EN_ALERTFEU"))
                                            or (sB >= 2.61) != (typ in ("DETACHE", "EN_ALERTFEU"))
                                            or (sA >= 2.61 and sB >= 2.61) != (typ == "EN_ALERTFEU")):
                                        stats["junction_incoherente"] += 1
                                    # Compteurs
                                    stats["paliers"][pal] += 1
                                    if corr.clause_orientation(sig, pal):
                                        stats["S1"] += 1
                                    elif corr.clause_surveillance(sig, pal, nom, ial):
                                        stats["S2"] += 1
                                    stats["labels"][nom["label"]] = \
                                        stats["labels"].get(nom["label"], 0) + 1
                                    stats["types"][nom["type"]] = \
                                        stats["types"].get(nom["type"], 0) + 1
                                    stats["forces"][zf] = \
                                        stats["forces"].get(zf, 0) + 1
                                    stats["conv_index"][str(conv["index"])] = \
                                        stats["conv_index"].get(str(conv["index"]), 0) + 1
    stats["md5_texts_count"] = len(stats["md5_texts"])
    del stats["md5_texts"]
    stats["zf_keys"] = sorted(stats["zf_keys"])
    stats["zf_cles"] = len(stats["zf_keys"])
    stats["zf_evaluations"] = stats["zf_cles"] * len(ORIGINES)
    return stats


# ─────────────────────────────────────────────────────────────────────────────
# STAGE 1-bis — BATTERIE DE FRONTIÈRE (±ε autour de chaque seuil)
# ─────────────────────────────────────────────────────────────────────────────
def _signature(sA, sB, cd, cp, h, r, ial, origine) -> tuple:
    prof = core_q2.profil_declencheurs(build_d(cd), build_p(cp))
    comp = core_q2.comportements(h, r)
    sig = core_q2.signal_securite(h.get("H5", 0), sA, ial)
    conv = core_q2.convergence(sA, sB, cd, cp, comp["n_checked"],
                               comp["h_norm"], comp["r_norm"])
    nom = core_q2.nommage(sA, sB, prof, comp, ial, conv)
    zf = core_q2.zone_force(origine, prof, comp, nom["label"])
    pal = core_q2.palier(ial, sA, sB, comp, sig)
    return (nom["label"], nom["type"], pal, zf,
            sig["signal"], sig["p_filtre"], conv["index"], conv["supprime"])


def stage1bis() -> dict:
    """Chaque sonde (±ε autour d'un seuil) doit produire, pour TOUT état
    repos de la batterie, la MÊME signature que le représentant de sa bande
    (stabilité latérale) — sinon le modèle de bandes est incomplet."""
    H_reps = [build_h(0, 0, 0), build_h(0, 2, 5), build_h(1, 1, 1),
              build_h(3, 0, 0)]
    R_reps = [build_r(0, 0), build_r(1, 1), build_r(2, 4)]
    repos = [(cd, cp, h, r, o)
             for (cd, cp) in ((0, 0), (3, 0), (0, 2), (3, 2))
             for h in H_reps for r in R_reps
             for o in ("SÉCURISANT", "INVALIDATION")]
    sondes = [
        ("sA=2,61", "sA", 2.6099, 2.6101, "A1", "A2"),
        ("sA=3,21", "sA", 3.2099, 3.2101, "A2", "A3"),
        ("sA=3,70", "sA", 3.6999, 3.7001, "A3", "A4"),
        ("sB=2,61", "sB", 2.6099, 2.6101, "B1", "B2"),
        ("sB=3,21", "sB", 3.2099, 3.2101, "B2", "B3"),
        ("ial=4|5", "ial", 4, 5, "I1", "I2"),
        ("ial=5|6", "ial", 5, 6, "I2", "I3"),
        ("ial=6|7", "ial", 6, 7, "I3", "I4"),
        ("ial=7|8", "ial", 7, 8, "I4", "I5"),
    ]
    rep_sA = {b: v for b, v in SA_BANDS}
    rep_sB = {b: v for b, v in SB_BANDS}
    rep_ial = {b: v for b, v in IAL_BANDS}
    resultats = []
    ecarts = 0
    for nom_s, axe, gauche, droite, band_g, band_d in sondes:
        viol = 0
        diff = 0
        for cd, cp, h, r, o in repos:
            if axe == "sA":
                sig_g = _signature(gauche, 2.0, cd, cp, h, r, 2, o)
                sig_d = _signature(droite, 2.0, cd, cp, h, r, 2, o)
                repg = _signature(rep_sA[band_g], 2.0, cd, cp, h, r, 2, o)
                repd = _signature(rep_sA[band_d], 2.0, cd, cp, h, r, 2, o)
            elif axe == "sB":
                sig_g = _signature(2.0, gauche, cd, cp, h, r, 2, o)
                sig_d = _signature(2.0, droite, cd, cp, h, r, 2, o)
                repg = _signature(2.0, rep_sB[band_g], cd, cp, h, r, 2, o)
                repd = _signature(2.0, rep_sB[band_d], cd, cp, h, r, 2, o)
            else:
                sig_g = _signature(2.0, 2.0, cd, cp, h, r, gauche, o)
                sig_d = _signature(2.0, 2.0, cd, cp, h, r, droite, o)
                repg = _signature(2.0, 2.0, cd, cp, h, r, rep_ial[band_g], o)
                repd = _signature(2.0, 2.0, cd, cp, h, r, rep_ial[band_d], o)
            if sig_g != repg or sig_d != repd:
                viol += 1
            if sig_g != sig_d:
                diff += 1
        resultats.append({"sonde": nom_s, "bandes": (band_g, band_d),
                          "violations_stabilite": viol,
                          "cas_différents_de_part_et_dautre": diff})
        if viol:
            ecarts += 1
    return {"sondes": resultats, "ecarts": ecarts, "cas_par_sonde": len(repos)}


# ─────────────────────────────────────────────────────────────────────────────
# STAGE 2 — RE-SCORE BIT-EXACT DES 437 SORTIES ARCHIVÉES + GATE (R4)
# ─────────────────────────────────────────────────────────────────────────────
def stage2() -> dict:
    res = {"lignes": 0, "ecarts": [],
           "supprime": 0, "prudence": 0, "convergent": 0,
           "note_suppression": 0, "note_prudence": 0,
           "fragments_complets": 0, "mots_interdits_max": 0,
           "dsim_manquants": 0, "S1": 0, "S2": 0,
           "paliers": {"🟢": 0, "🟠": 0, "🔴": 0},
           "pieges": {"P-INCS": {"n": 0, "supprime": 0},
                      "P-INCD": {"n": 0, "prudence": 0},
                      "P-SEC": {"n": 0, "signal": 0},
                      "P-FILT": {"n": 0, "p_filtre": 0}},
           "aretes": {}, "honetes_S1": 0, "honetes_S2": 0,
           "honetes_paliers": {"🟢": 0, "🟠": 0, "🔴": 0}}
    base = Path(__file__).resolve().parents[3] / "validation-q2-r1"  # vérité R1
    chemin = base / "results" / "profils_calcules.csv"
    attendu_aretes = {
        "E1_lesdeux_priorite": ("LES DEUX", "🔴"),
        "E2_perdre_pur": ("PEUR DE PERDRE", "🟠"),
        "E3_suppression": ("SIGNAL LÉGER NON NOMMÉ", "🟢"),
        "E4_lesdeux_counts": ("LES DEUX", "🟠"),
        "E5_alarme_sans_main": ("ALARME SANS MAIN", "🟢"),
        "E6_zone_calme": ("ZONE CALME", "🟢"),
        "E7_lesdeux_q1": ("LES DEUX", "🟠"),
        "E8_palier_rouge": ("ALARME SANS MAIN", "🔴"),
    }
    with open(chemin, newline="", encoding="utf-8-sig") as fh:
        for row in csv.DictReader(fh):
            res["lignes"] += 1
            d = json.loads(row["d"])
            p = json.loads(row["p"])
            h = json.loads(row["h"])
            r = json.loads(row["r"])
            sA, sB = float(row["sA"]), float(row["sB"])
            ial = int(row["i_alarm"])
            prof = core_q2.profil_declencheurs(d, p)
            comp = core_q2.comportements(h, r)
            h5f = h.get("H5", 0)
            sig = core_q2.signal_securite(h5f, sA, ial)
            conv = core_q2.convergence(sA, sB, prof["count_d"], prof["count_p"],
                                       comp["n_checked"], comp["h_norm"],
                                       comp["r_norm"])
            nom = core_q2.nommage(sA, sB, prof, comp, ial, conv)
            origine_cat = row["origine_map"] if row["origine_map"] != "LIBRE" \
                else row["route_nlp"]
            zf = core_q2.zone_force(origine_cat, prof, comp, nom["label"])
            pal = core_q2.palier(ial, sA, sB, comp, sig)
            verifs = [
                ("count_d", prof["count_d"], int(row["count_d"])),
                ("count_p", prof["count_p"], int(row["count_p"])),
                ("profil", prof["profil"], row["profil_declencheurs"]),
                ("h_norm", comp["h_norm"], float(row["h_norm"])),
                ("r_norm", comp["r_norm"], float(row["r_norm"])),
                ("n_checked", comp["n_checked"], int(row["n_checked"])),
                ("domination", comp["domination"], row["domination"]),
                ("somme", comp["somme"], float(row["somme"])),
                ("h5_freq", h5f, int(row["h5_freq"])),
                ("signal", "OUI" if sig["signal"] else "NON", row["signal"]),
                ("p_filtre", "OUI" if sig["p_filtre"] else "NON", row["p_filtre"]),
                ("conv_index", conv["index"], float(row["conv_index"])),
                ("conv_prudence", "OUI" if conv["prudence"] else "NON",
                 row["conv_prudence"]),
                ("conv_supprime", "OUI" if conv["supprime"] else "NON",
                 row["conv_supprime"]),
                ("conv_checks", json.dumps(conv["checks"]), row["conv_checks"]),
                ("label", nom["label"], row["label"]),
                ("type", nom["type"], row["type"]),
                ("force", zf, row["force"]),
                ("palier", pal, row["palier"]),
                ("palier_recalcule", pal, row["palier_recalcule"]),
            ]
            for champ, calcule, archive in verifs:
                if calcule != archive:
                    res["ecarts"].append({
                        "id": row["identifiant"], "champ": champ,
                        "calcule": str(calcule), "archive": str(archive)})
            # Couche sur la vérité archivée (gate convergence R4)
            bloc = corr.bloc_ecran(prof, comp, nom, conv, sig, pal, zf,
                                   sA, sB, ial)
            frag = corr.bilan_fragment(prof, comp, nom, conv, sig, pal, zf,
                                       sA, sB, ial)
            if frag["_complet"]:
                res["fragments_complets"] += 1
            res["mots_interdits_max"] = max(res["mots_interdits_max"],
                                            bloc["nb_mots_interdits"])
            if BANDEAU_OK not in bloc["texte"]:
                res["dsim_manquants"] += 1
            if conv["supprime"]:
                res["supprime"] += 1
                if "Concordance en attente" in bloc["texte"]:
                    res["note_suppression"] += 1
            elif conv["prudence"]:
                res["prudence"] += 1
                if "Convergence partielle" in bloc["texte"]:
                    res["note_prudence"] += 1
            else:
                res["convergent"] += 1
            if corr.clause_orientation(sig, pal):
                res["S1"] += 1
            elif corr.clause_surveillance(sig, pal, nom, ial):
                res["S2"] += 1
            res["paliers"][pal] += 1
            source = row["source"]
            ident = row["identifiant"]
            if source == "PIÉGÉ":
                # le type de piège se lit dans l'identifiant (P-INCS/P-INCD/
                # P-SEC/P-FILT — format archivé du package R1)
                for code in res["pieges"]:
                    if ident.startswith(code + "-"):
                        res["pieges"][code]["n"] += 1
                        if code == "P-INCS" and conv["supprime"]:
                            res["pieges"][code]["supprime"] += 1
                        if code == "P-INCD" and conv["prudence"]:
                            res["pieges"][code]["prudence"] += 1
                        if code == "P-SEC" and sig["signal"]:
                            res["pieges"][code]["signal"] += 1
                        if code == "P-FILT" and sig["p_filtre"]:
                            res["pieges"][code]["p_filtre"] += 1
                        break
            elif source == "ARÊTE":
                for code, attendu in attendu_aretes.items():
                    if code in ident:
                        ok = (nom["label"] == attendu[0]
                              and (pal == attendu[1]
                                   if code != "E8_palier_rouge"
                                   else pal == "🔴"))
                        res["aretes"][code] = "OK" if ok else \
                            f"ÉCART {nom['label']}/{pal}"
                        break
            elif source.startswith("GROUPE"):
                res["honetes_paliers"][pal] += 1
                if corr.clause_orientation(sig, pal):
                    res["honetes_S1"] += 1
                elif corr.clause_surveillance(sig, pal, nom, ial):
                    res["honetes_S2"] += 1
    return res


# ─────────────────────────────────────────────────────────────────────────────
# STAGE 4 — COUPLAGE PAS (VRAI Q5) + EMPREINTES + IDENTITÉS + SUIVI
# ─────────────────────────────────────────────────────────────────────────────
def stage4() -> dict:
    labels = ["LES DEUX", "PEUR DE PERDRE", "PEUR D'ÊTRE ÉTOUFFÉE",
              "ZONE CALME", "ALARME SANS MAIN", "SIGNAL LÉGER NON NOMMÉ"]
    faces_rep = {"RASSUREE": (2.0, 2.0), "EN_QUETE": (2.8, 2.0),
                 "SUR_LA_RA": (2.0, 2.8)}
    table = {}
    for face, (sA, sB) in faces_rep.items():
        for label in labels:
            sel = core_q5.selectionner_pas(sA, sB, label)   # VRAI moteur Q5
            table[f"{face}|{label}"] = {"pas": sel["pas"],
                                        "empreinte": sel["empreinte"]}
    empreintes = {label: core_q5.empreinte(label) for label in labels}
    # Identité face Q5 ⇔ type Q4 sur les 12 paires de bandes
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
    # Suivi 14 jours — jamais de sanction (vrai moteur Q5)
    suivi = [core_q5.suivre_14_jours(j) for j in range(15)]
    suivi_ok = all(s["sanction"] is None for s in suivi)
    cats = sorted({s["categorie"] for s in suivi})
    # Grille Q1 (28 scores atteignables) vs seuils — 0 borne pile
    scores_q1 = [round(k / 9, 2) for k in range(9, 37)]
    seuils = (2.61, 3.21, 3.70)
    pile = [s for s in scores_q1 for th in seuils if s == th]
    dist = {str(th): min(abs(s - th) for s in scores_q1) for th in seuils}
    # Équivalence (sA ≥ 2,61) ⇔ face ≠ RASSUREE sur la grille Q1
    equiv = all((s >= 2.61) == (core_q5.face_dominante(s, 2.0) != "RASSUREE")
                for s in scores_q1)
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
        "grille_q1": {"scores": scores_q1, "pile": pile,
                      "dist_min_seuils": dist, "equivalence_261": equiv},
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
                       *corr._LECTURE_LABEL.values(),
                       *corr._CLAUSE_PROFIL.values(),
                       *corr._CLAUSE_COMP.values(),
                       *corr._CLAUSE_FORCE.values(),
                       corr._FORCE_SILENCIEUSE_OMBRAGEE,
                       corr._FORCE_SILENCIEUSE_CALME,
                       *corr._EXERCICE_LABEL.values(),
                       corr._EXERCICE_SUPPRESSION,
                       *corr._CLAUSE_MODULE.values(),
                       corr._ORIENTATION_ROUGE, corr._ORIENTATION_SIGNAL,
                       corr._ORIENTATION_PFILTRE,
                       corr._SURVEILLANCE_PALIER, corr._SURVEILLANCE_ALARME,
                       corr._NOTE_SUPPRESSION, corr._NOTE_PRUDENCE,
                       *core_q2.TEMPLATES_SPECIAUX.values(),
                       *core_q5.PAS_LABELS.values())]
        ),
        "labels_coeur_propres": max(
            [sum(1 for m in corr.MOTS_INTERDITS if m in t.lower())
             for t in ("LES DEUX", "PEUR DE PERDRE", "PEUR D'ÊTRE ÉTOUFFÉE",
                       "ZONE CALME", "ALARME SANS MAIN",
                       "SIGNAL LÉGER NON NOMMÉ")]
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
    s4 = stage4()
    return {"stage1": s1, "stage1bis": s1b, "stage2": s2, "stage4": s4,
            "standings": standings_block()}


def _canonique(d) -> bytes:
    return json.dumps(d, sort_keys=True, ensure_ascii=False,
                      default=list).encode("utf-8")


def _ecrire_json(chemin: Path, obj) -> None:
    chemin.write_text(json.dumps(obj, sort_keys=True, ensure_ascii=False,
                                 default=list), encoding="utf-8")


def fusionner_s1(pieces: list) -> dict:
    """Fusionne les stats stage1 de tronçons de bandes — somme exacte des
    compteurs, union des ensembles ; résultat identique au mode complet."""
    base = json.loads(json.dumps(pieces[0], ensure_ascii=False))
    for p in pieces[1:]:
        for k in ("configs", "fragment_complet", "cor2_ecarts", "S1", "S2",
                  "mots_interdits_max", "dsim_manquants", "zc_abus",
                  "zc_manquant", "force_fabrication_abus",
                  "suppression_incoherente", "pas_non_resolus",
                  "junction_incoherente"):
            base[k] += p[k]
        for k in ("paliers", "labels", "types", "forces", "conv_index"):
            for kk, vv in p[k].items():
                base[k][kk] = base[k].get(kk, 0) + vv
        base["zf_keys"] = sorted(set(map(tuple, base["zf_keys"]))
                                 | set(map(tuple, p["zf_keys"])))
    base["zf_cles"] = len(base["zf_keys"])
    base["zf_evaluations"] = base["zf_cles"] * len(ORIGINES)
    del base["zf_keys"]
    return base


def run_part(part: str) -> int:
    """Mode TRONÇONNÉ (sandbox à fenêtre d'exécution courte) — chaque
    tronçon reconstruit exactement une part du pipeline complet ; la fusion
    est bit-identique au mode `python3 src/wtc_q2_correction_validation.py`.
    Variables : CORR_RUN=1|2 · CORR_PART=c1|c2|c3|c4|rest|merge|final"""
    run = os.environ.get("CORR_RUN", "1")
    if part in ("c1", "c2", "c3", "c4"):
        M = precompute()
        s1 = stage1(M, bandes=[int(part[1]) - 1])
        _ecrire_json(RES / f"_r{run}_s1_{part}.json", s1)
        print(f"tronçon {part} run {run} OK — {s1['configs']} configs")
        return 0
    if part == "rest":
        s1b = stage1bis()
        s2 = stage2()
        s4 = stage4()
        _ecrire_json(RES / f"_r{run}_rest.json", {
            "stage1bis": s1b,
            "stage2": {k: v for k, v in s2.items() if k != "ecarts"},
            "stage2_ecarts": s2["ecarts"],
            "stage4": s4, "standings": standings_block()})
        print(f"tronçon rest run {run} OK — {s2['lignes']} lignes, "
              f"{len(s2['ecarts'])} écarts")
        return 0
    if part == "merge":
        pieces = [json.loads((RES / f"_r{run}_s1_c{i}.json")
                             .read_text(encoding="utf-8")) for i in range(1, 5)]
        rest = json.loads((RES / f"_r{run}_rest.json")
                          .read_text(encoding="utf-8"))
        resultat = {"stage1": fusionner_s1(pieces),
                    "stage1bis": rest["stage1bis"],
                    "stage2": rest["stage2"],
                    "stage2_ecarts": rest["stage2_ecarts"],
                    "stage4": rest["stage4"],
                    "standings": rest["standings"]}
        (RES / f"_r{run}_canon.json").write_bytes(_canonique(resultat))
        for i in range(1, 5):
            (RES / f"_r{run}_s1_c{i}.json").unlink()
        (RES / f"_r{run}_rest.json").unlink()
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
    s1, s1b, s2, s4 = (r1["stage1"], r1["stage1bis"], r1["stage2"],
                       r1["stage4"])
    s2e = r1["stage2_ecarts"]
    n = s1["configs"]

    criteres = {
        "COR1_fragment_complet": {
            "definition": "espace exhaustif compacté (6 720 000 configurations "
                          "= états moteur distincts × zone_force réalisable) "
                          "→ fragment L8 7 blocs, 0 champ vide + 437/437 archivées",
            "observe": f"{s1['fragment_complet']}/{n} · archivées "
                       f"{s2['fragments_complets']}/{s2['lignes']}",
            "pass": s1["fragment_complet"] == n
                    and s2["fragments_complets"] == s2["lignes"]},
        "COR2_derivation_palier": {
            "definition": "chemin indépendant (entiers bruts, sans le moteur) "
                          "≡ vrai cœur (signal + p_filtre + palier) sur tout "
                          "l'espace ; 437/437 archivées = palier ET "
                          "palier_recalcule",
            "observe": f"{n - s1['cor2_ecarts']}/{n} convergents · écarts "
                       f"archivés {len(s2e)}",
            "pass": s1["cor2_ecarts"] == 0 and len(s2e) == 0},
        "COR3_seuils_aide": {
            "definition": "S1 = signal ∨ p_filtre ∨ palier 🔴 ; S2 = palier 🟠 "
                          "ou ALARME SANS MAIN, sans S1 ; 0 borne pile sur la "
                          "grille Q1 ; batterie de frontière ±ε stable des "
                          "deux côtés",
            "observe": f"S1 {s1['S1']}/{n} · S2 {s1['S2']}/{n} · pile "
                       f"{len(s4['grille_q1']['pile'])} · dist min "
                       f"{s4['grille_q1']['dist_min_seuils']} · sondes "
                       f"stables {9 - s1b['ecarts']}/9",
            "pass": s4["grille_q1"]["pile"] == []
                    and s4["grille_q1"]["equivalence_261"]
                    and s1b["ecarts"] == 0},
        "COR4_vocabulaire_ecran": {
            "definition": "0 mot interdit (canon Partie 9) sur tous les textes "
                          "générés + clauses standing + libellés du cœur",
            "observe": f"max mots interdits par texte = {s1['mots_interdits_max']}"
                       f"/{s2['mots_interdits_max']} ; standing = "
                       f"{r1['standings']['mots_interdits_standings']} ; "
                       f"labels cœur = "
                       f"{r1['standings']['labels_coeur_propres']} ; "
                       f"textes distincts = {s1['md5_texts_count']} ; "
                       f"D-SIM manquants {s1['dsim_manquants']}"
                       f"/{s2['dsim_manquants']}",
            "pass": s1["mots_interdits_max"] == 0
                    and s2["mots_interdits_max"] == 0
                    and r1["standings"]["mots_interdits_standings"] == 0
                    and r1["standings"]["labels_coeur_propres"] == 0
                    and s1["dsim_manquants"] == 0
                    and s2["dsim_manquants"] == 0},
        "COR5_anti_fabrication": {
            "definition": "« rien à fabriquer » ssi ZONE CALME ; force affichée "
                          "≡ vrai zone_force (0 marqueur de force inventé sur "
                          "SILENCIEUSE, 0 marqueur manquant sinon)",
            "observe": f"zc abus {s1['zc_abus']} · zc manquant "
                       f"{s1['zc_manquant']} · force abus "
                       f"{s1['force_fabrication_abus']}",
            "pass": s1["zc_abus"] == 0 and s1["zc_manquant"] == 0
                    and s1["force_fabrication_abus"] == 0},
        "COR6_gate_convergence": {
            "definition": "R4 : convergence 0,00 → ombre masquée + note "
                          "(jamais d'OMBRE) ; 0,50 → OMBRE_PRUDENCE + mention ; "
                          "re-score bit-exact des 437 sorties R1 (0 écart) ; "
                          "pièges (INC_SIMPLE 6/6 supprimés · INC_DOUBLE 4/4 "
                          "prudence · SEC_H5 8/8 signal · PFILTRE 5/5 "
                          "p_filtre) ; arêtes E1-E8 conformes",
            "observe": f"{s2['lignes']} lignes : supprimé {s2['supprime']} "
                       f"(note {s2['note_suppression']}) · prudence "
                       f"{s2['prudence']} (note {s2['note_prudence']}) · "
                       f"convergent {s2['convergent']} ; écarts bit-exact "
                       f"{len(s2e)} ; pièges {s2['pieges']} ; "
                       f"arêtes {s2['aretes']}",
            "pass": (len(s2e) == 0
                     and s2["note_suppression"] == s2["supprime"]
                     and s2["note_prudence"] == s2["prudence"]
                     and s2["pieges"]["P-INCS"]["n"] == 6
                     and s2["pieges"]["P-INCS"]["supprime"] == 6
                     and s2["pieges"]["P-INCD"]["n"] == 4
                     and s2["pieges"]["P-INCD"]["prudence"] == 4
                     and s2["pieges"]["P-SEC"]["n"] == 8
                     and s2["pieges"]["P-SEC"]["signal"] == 8
                     and s2["pieges"]["P-FILT"]["n"] == 5
                     and s2["pieges"]["P-FILT"]["p_filtre"] == 5
                     and all(v == "OK" for v in s2["aretes"].values()))},
        "COR7_couplage_pas": {
            "definition": "18/18 (3 faces Q1 × 6 étiquettes Q2) → pas du VRAI "
                          "selectionner_pas (Q5) ; empreintes réelles "
                          "documentées ; identité face Q5 ⇔ type Q4 sur les 12 "
                          "bandes ; suivi 14 jours sans sanction",
            "observe": f"pas résolus {s4['pas_resolus']}/18 · identité "
                       f"{sum(1 for i in s4['identite_face_type'] if i['coherent'])}"
                       f"/12 · suivi {s4['suivi_15']['sans_sanction']}/15 "
                       f"{s4['suivi_15']['categories']}",
            "pass": s4["pas_resolus"] == 18 and s4["identite_ok"]
                    and s4["suivi_15"]["ok"]},
        "COR8_reproductibilite": {
            "definition": "pipeline ×2 → SHA-256 identiques",
            "observe": f"{sha1[:16]}… == {sha2[:16]}… → {cor8}", "pass": cor8},
    }

    RES.mkdir(exist_ok=True)
    payload = {
        "package": "validation-q2/correction-philosophique",
        "cible": "RIO-02 « Ce qui m'effraie vraiment »",
        "moteurs_reels": ["validation-q2-r1/src/wtc_q2_core.py (R1, 35 templates)",
                          "validation-q4/src/wtc_q4_core.py",
                          "validation-q5/src/wtc_q5_core.py"],
        "espace": {
            "etats_structurels": "7 cd × 5 cp × 100 H × 16 R × 5 i_alarm × 12 bandes sA/sB",
            "plissement_origine": "8 origines → sorties zone_force distinctes (×2)",
            "configs_assemblees": n,
        },
        "cor8_sha256_run1": sha1, "cor8_sha256_run2": sha2,
        "criteres": criteres,
        "stage1": {k: v for k, v in s1.items()},
        "stage1bis": s1b,
        "stage2": s2,
        "stage2_ecarts": s2e[:20],
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
    part = os.environ.get("CORR_PART", "")
    if part:
        sys.exit(run_part(part))
    sys.exit(main())
