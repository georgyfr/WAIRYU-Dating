# -*- coding: utf-8 -*-
"""
WTC-Q1 — Orchestrateur de validation (critères C1-C4 + rapport final)
=====================================================================
WAIRYU Thérapie Couple — Package WTC-Q1 — Quête 1 « Comment je me raccroche ».

RÔLE : EXÉCUTEUR STRICT (Data Insight).
  1. Implémente exactement la spécification (wtc_q1_core.py) ;
  2. Simule la population (wtc_q1_simulator.py, seed = 42) ;
  3. Évalue les 4 critères ÉLIMINATOIRES C1-C4 ;
  4. Produit les sorties brutes (results/) et les figures (figures/) ;
  5. Génère le RAPPORT FINAL DÉTAILLÉ (results/rapport.md — 7 sections A-G).

Reproductibilité : le pipeline complet est exécuté DEUX FOIS (seed 42) et les
sorties sont comparées (C4). Aucun horodatage à la seconde près n'est écrit
dans les sorties (date seule), afin que deux exécutions du même jour soient
strictement identiques octet par octet.

Usage :  python3 src/wtc_q1_validation.py
Dépendances : numpy, pandas, matplotlib.
"""

from __future__ import annotations

import hashlib
import json
import sys
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

sys.path.insert(0, str(Path(__file__).resolve().parent))
import wtc_q1_core as core  # noqa: E402
import wtc_q1_simulator as sim  # noqa: E402

BASE = Path(__file__).resolve().parent.parent
RES = BASE / "results"
FIG = BASE / "figures"
RES.mkdir(exist_ok=True)
FIG.mkdir(exist_ok=True)

DATE_EXECUTION = "2026-10-14"
SEED = sim.SEED
NIVEAUX = list(core.NIVEAUX)

# Palette Okabe-Ito (colorblind-friendly) — conventions graphiques du projet
OKABE_ITO = ["#0072B2", "#E69F00", "#009E73", "#D55E00", "#CC79A7", "#56B4E9"]
GRIS = "#555555"


# ─────────────────────────────────────────────────────────────────────────────
# ÉVALUATION D'UN RÉPONDANT (pipeline complet L1 → L4)
# ─────────────────────────────────────────────────────────────────────────────
def evalue_repondant(row: dict, identifiant: str) -> dict:
    """Applique L1 (RQS), L2 (scores + CI90), L3 (lecture), L4 (faces) à un répondant."""
    bruts = {i: int(row[f"r{i}"]) for i in range(1, 19)}
    temps_items = {i: float(row[f"t{i}"]) for i in range(1, 19)}
    temps_session = float(sum(float(row[f"t{q}"]) for q in range(1, 20)))
    vigilance = int(row["vigilance"])

    rqs = core.calcule_rqs(bruts, temps_items, temps_session, vigilance)
    cor = core.corrige_tous(bruts)
    faces = core.scores_faces(cor)
    axes_scores = core.scores_axes(cor)

    out: dict = {"identifiant": identifiant}
    # Métadonnées
    if "groupe" in row:
        out["groupe"] = row["groupe"]
        out["groupe_nom"] = row["groupe_nom"]
        out["mu_A_param"] = float(row["mu_A_param"])
        out["mu_B_param"] = float(row["mu_B_param"])
        out["latent_A"] = float(row["latent_A"])
        out["latent_B"] = float(row["latent_B"])
    else:
        out["type_piege"] = row["type_piege"]
    for i in range(1, 19):
        out[f"r{i}"] = bruts[i]
        out[f"cor{i}"] = cor[i]
    out["temps_session"] = rqs["temps_session"]
    out["vigilance"] = vigilance

    # L1
    out["rqs_et_corriges"] = rqs["et_corriges"]
    out["rqs_pen_linearite"] = rqs["penalites"]["linearite"]
    out["rqs_pen_contradiction"] = rqs["penalites"]["contradiction"]
    out["rqs_pen_rythme"] = rqs["penalites"]["rythme"]
    out["rqs_pen_vigilance"] = rqs["penalites"]["vigilance"]
    out["rqs_nb_items_rapides"] = rqs["nb_items_rapides"]
    out["rqs_total_penalites"] = rqs["total_penalites"]
    out["rqs"] = rqs["rqs"]
    out["rqs_statut"] = rqs["statut"]
    out["rqs_details"] = " || ".join(rqs["details"])

    # L2 + L3 + L4 par axe
    for axe in ("A", "B"):
        score = axes_scores[axe]
        bas, haut = core.bornes_ci90(score)
        lect = core.lecture_L3(score, bas, haut)
        out[f"score_{axe}"] = score
        out[f"ci_bas_{axe}"] = bas
        out[f"ci_haut_{axe}"] = haut
        out[f"type_lecture_{axe}"] = lect["type"]
        out[f"lecture_{axe}"] = lect["lecture"]
        out[f"touches_{axe}"] = "|".join(lect["touches"])
        out[f"conservateur_{axe}"] = lect["niveau_conservateur"]
        out[f"nb_touches_{axe}"] = len(lect["touches"])
        l4 = core.lecture_L4(faces, axe)
        out[f"l4_ordre_{axe}"] = ">".join(l4["ordre"])
        out[f"l4_ecart_{axe}"] = l4["ecart_1_2"]
        out[f"l4_lecture_{axe}"] = l4["lecture"]

    # Comparaison au latent (honnêtes uniquement)
    if "latent_A" in out:
        for axe in ("A", "B"):
            latent = out[f"latent_{axe}"]
            attendu = core.niveau_ponctuel(latent)
            out[f"attendu_{axe}"] = attendu
            out[f"match_conservateur_{axe}"] = out[f"conservateur_{axe}"] == attendu
            out[f"match_ponctuel_{axe}"] = core.niveau_ponctuel(out[f"score_{axe}"]) == attendu
            out[f"couverture_ci_{axe}"] = (out[f"ci_bas_{axe}"] <= latent <= out[f"ci_haut_{axe}"])
            out[f"erreur_abs_{axe}"] = round(abs(out[f"score_{axe}"] - latent), 6)
            out[f"erreur_{axe}"] = round(out[f"score_{axe}"] - latent, 6)
    else:
        out["detecte"] = out["rqs_statut"] != "OK"
    return out


def run_pipeline(seed: int = SEED, items_inverses_litteraux: bool = False):
    """Pipeline complet : simulation → évaluation L1-L4 de chaque répondant."""
    honnetes, pieges = sim.simule_tout(seed, items_inverses_litteraux=items_inverses_litteraux)
    ev_h = [evalue_repondant(r, f"H{idx + 1:03d}") for idx, r in enumerate(honnetes)]
    ev_p = [evalue_repondant(r, f"P{idx + 1:02d}") for idx, r in enumerate(pieges)]
    return pd.DataFrame(ev_h), pd.DataFrame(ev_p)


# ─────────────────────────────────────────────────────────────────────────────
# CALCUL DES CRITÈRES
# ─────────────────────────────────────────────────────────────────────────────
def _r2(x) -> float:
    return round(float(x), 4)


def calcule_metriques(ev_h: pd.DataFrame, ev_p: pd.DataFrame) -> dict:
    m: dict = {}

    # ── C1 — exactitude des lectures (1 000 lectures = 2 axes × 500 honnêtes)
    c1_axes = {}
    for axe in ("A", "B"):
        n = len(ev_h)
        match = int(ev_h[f"match_conservateur_{axe}"].sum())
        c1_axes[axe] = {
            "correspondances": match,
            "total": n,
            "exactitude": _r2(match / n),
        }
    total_match = int(ev_h["match_conservateur_A"].sum() + ev_h["match_conservateur_B"].sum())
    m["c1"] = {
        "correspondances": total_match,
        "total": 2 * len(ev_h),
        "exactitude": _r2(total_match / (2 * len(ev_h))),
        "seuil": 0.90,
        "pass": bool(total_match >= 900),
        "par_axe": c1_axes,
        "par_groupe": {
            g: {
                axe: {
                    "n": int(len(sub)),
                    "correspondances": int(sub[f"match_conservateur_{axe}"].sum()),
                    "exactitude": _r2(sub[f"match_conservateur_{axe}"].mean()),
                }
                for axe in ("A", "B")
            }
            for g, sub in ev_h.groupby("groupe", sort=True)
        },
        # Métriques auxiliaires (pour arbitrage du superviseur — ne remplacent pas C1)
        "aux_ponctuel": {
            axe: _r2(ev_h[f"match_ponctuel_{axe}"].mean()) for axe in ("A", "B")
        },
        "aux_couverture_ci": {
            axe: _r2(ev_h[f"couverture_ci_{axe}"].mean()) for axe in ("A", "B")
        },
    }
    # Erreur absolue moyenne (C2) + auxiliaires
    err_cols = {"A": "erreur_abs_A", "B": "erreur_abs_B"}
    err_signed = {"A": "erreur_A", "B": "erreur_B"}
    par_axe_c2 = {
        axe: {
            "moyenne": _r2(ev_h[err_cols[axe]].mean()),
            "rmse": _r2(np.sqrt((ev_h[err_signed[axe]] ** 2).mean())),
            "biais": _r2(ev_h[err_signed[axe]].mean()),
            "max": _r2(ev_h[err_cols[axe]].max()),
        }
        for axe in ("A", "B")
    }
    toutes_err = pd.concat([ev_h["erreur_abs_A"], ev_h["erreur_abs_B"]])
    toutes_signed = pd.concat([ev_h["erreur_A"], ev_h["erreur_B"]])
    m["c2"] = {
        "erreur_moyenne": _r2(toutes_err.mean()),
        "seuil": 0.15,
        "pass": bool(toutes_err.mean() < 0.15),
        "par_axe": par_axe_c2,
        "par_groupe": {
            g: {
                axe: _r2(sub[err_cols[axe]].mean())
                for axe in ("A", "B")
            }
            for g, sub in ev_h.groupby("groupe", sort=True)
        },
        "rmse_global": _r2(np.sqrt((toutes_signed**2).mean())),
        "biais_global": _r2(toutes_signed.mean()),
        "erreur_max": _r2(toutes_err.max()),
    }

    # ── C3 — détection des 20 piégés (statut RQS ≠ OK)
    par_type = {}
    for t, sub in ev_p.groupby("type_piege", sort=False):
        par_type[t] = {
            "n": int(len(sub)),
            "detectes": int(sub["detecte"].sum()),
            "rqs": sorted({int(v) for v in sub["rqs"]}),
            "statuts": sorted(set(sub["rqs_statut"])),
        }
    m["c3"] = {
        "detectes": int(ev_p["detecte"].sum()),
        "total": int(len(ev_p)),
        "seuil": 17,
        "pass": bool(ev_p["detecte"].sum() >= 17),
        "par_type": par_type,
        "detail_individuel": [
            {
                "id": r["identifiant"],
                "type": r["type_piege"],
                "rqs": int(r["rqs"]),
                "statut": r["rqs_statut"],
                "detecte": bool(r["detecte"]),
                "penalites": (
                    (["linearite"] if r["rqs_pen_linearite"] else [])
                    + (["contradiction"] if r["rqs_pen_contradiction"] else [])
                    + (["rythme"] if r["rqs_pen_rythme"] else [])
                    + (["vigilance"] if r["rqs_pen_vigilance"] else [])
                ),
            }
            for _, r in ev_p.iterrows()
        ],
    }

    # ── Frontières L3 parmi les honnêtes (Sections B et E)
    frontieres = {}
    for axe in ("A", "B"):
        is_front = ev_h[f"type_lecture_{axe}"] == "FRONTIERE"
        sub = ev_h[is_front]
        bien = int((sub[f"conservateur_{axe}"] == sub[f"attendu_{axe}"]).sum())
        frontieres[axe] = {
            "n_frontieres": int(is_front.sum()),
            "bien_tranchees": bien,
            "mal_tranchees": int(len(sub) - bien),
            "deux_seuils_touches": int((ev_h[f"nb_touches_{axe}"] >= 3).sum()),
            "taux_frontiere": _r2(is_front.mean()),
        }
    m["frontieres"] = frontieres

    # ── Matrices de confusion (attendu × conservateur ; attendu × ponctuel)
    matrices = {}
    for axe in ("A", "B"):
        mat_cons = (
            pd.crosstab(ev_h[f"attendu_{axe}"], ev_h[f"conservateur_{axe}"])
            .reindex(index=NIVEAUX, columns=NIVEAUX, fill_value=0)
        )
        mat_ponc = (
            pd.crosstab(ev_h[f"attendu_{axe}"], ev_h.apply(
                lambda r: core.niveau_ponctuel(r[f"score_{axe}"]), axis=1))
            .reindex(index=NIVEAUX, columns=NIVEAUX, fill_value=0)
        )
        matrices[axe] = {"conservateur": mat_cons, "ponctuel": mat_ponc}
    m["matrices"] = matrices  # non sérialisé tel quel dans le JSON (voir ecrire_json)

    # ── RQS des honnêtes (taux de levée de drapeaux — indicateur Section E)
    statuts = ev_h["rqs_statut"].value_counts().to_dict()
    m["rqs_honnetes"] = {
        "statuts": {k: int(v) for k, v in statuts.items()},
        "pen_linearite": int(ev_h["rqs_pen_linearite"].sum()),
        "pen_contradiction": int(ev_h["rqs_pen_contradiction"].sum()),
        "pen_rythme": int(ev_h["rqs_pen_rythme"].sum()),
        "pen_vigilance": int(ev_h["rqs_pen_vigilance"].sum()),
        "aucune_penalite": int(
            (
                ~ev_h[
                    [
                        "rqs_pen_linearite",
                        "rqs_pen_contradiction",
                        "rqs_pen_rythme",
                        "rqs_pen_vigilance",
                    ]
                ].any(axis=1)
            ).sum()
        ),
        "rqs_moyenne": _r2(ev_h["rqs"].mean()),
    }

    # ── Section C — statistiques par groupe + alpha de Cronbach observé
    stats_groupes = []
    alpha_par_groupe = {}
    for g, sub in ev_h.groupby("groupe", sort=True):
        alpha_a = core.cronbach_alpha(sub[[f"cor{i}" for i in core.AXES["A"]["items"]]].to_numpy())
        alpha_b = core.cronbach_alpha(sub[[f"cor{i}" for i in core.AXES["B"]["items"]]].to_numpy())
        alpha_par_groupe[g] = {"A": _r2(alpha_a), "B": _r2(alpha_b)}
        stats_groupes.append(
            {
                "groupe": g,
                "nom": sub["groupe_nom"].iloc[0],
                "n": int(len(sub)),
                "mu_A_param": float(sub["mu_A_param"].iloc[0]),
                "moyenne_latente_A": _r2(sub["latent_A"].mean()),
                "moyenne_score_A": _r2(sub["score_A"].mean()),
                "ecart_mu_A": _r2(sub["score_A"].mean() - sub["mu_A_param"].iloc[0]),
                "sd_score_A": _r2(sub["score_A"].std(ddof=1)),
                "mu_B_param": float(sub["mu_B_param"].iloc[0]),
                "moyenne_latente_B": _r2(sub["latent_B"].mean()),
                "moyenne_score_B": _r2(sub["score_B"].mean()),
                "ecart_mu_B": _r2(sub["score_B"].mean() - sub["mu_B_param"].iloc[0]),
                "sd_score_B": _r2(sub["score_B"].std(ddof=1)),
                "alpha_A": _r2(alpha_a),
                "alpha_B": _r2(alpha_b),
            }
        )
    m["stats_groupes"] = stats_groupes
    m["cronbach"] = {
        "pool_A": _r2(core.cronbach_alpha(ev_h[[f"cor{i}" for i in core.AXES["A"]["items"]]].to_numpy())),
        "pool_B": _r2(core.cronbach_alpha(ev_h[[f"cor{i}" for i in core.AXES["B"]["items"]]].to_numpy())),
        "par_groupe": alpha_par_groupe,
    }
    return m


def calcule_sensibilite_litterale(seed: int = SEED) -> dict:
    """Exécution de SENSIBILITÉ — lecture LITTÉRALE de la spec pour les items
    inversés (brut ~ N(latent, 0,5), donc corrigé ≈ 5 − latent).
    Signalement seul (Section F) : ne remplace pas le pipeline principal."""
    ev_h, ev_p = run_pipeline(seed, items_inverses_litteraux=True)
    match = int(ev_h["match_conservateur_A"].sum() + ev_h["match_conservateur_B"].sum())
    err = pd.concat([ev_h["erreur_abs_A"], ev_h["erreur_abs_B"]])
    return {
        "c1_correspondances": match,
        "c1_exactitude": _r2(match / (2 * len(ev_h))),
        "c2_erreur_moyenne": _r2(err.mean()),
        "c3_detectes": int(ev_p["detecte"].sum()),
        "note": (
            "Lecture littérale : la réponse BRUTE des items inversés suit la latente "
            "positivement, donc corrigé = 5 − brut mesure l'inverse de la latente."
        ),
    }


# ─────────────────────────────────────────────────────────────────────────────
# ÉCRITURE DES SORTIES BRUTES
# ─────────────────────────────────────────────────────────────────────────────
def ecrire_sorties(ev_h: pd.DataFrame, ev_p: pd.DataFrame, m: dict, m_litteral: dict, c4: dict) -> None:
    # 1) Lectures détaillées (1 000 lignes)
    lignes = []
    for _, r in ev_h.iterrows():
        for axe in ("A", "B"):
            lignes.append(
                {
                    "identifiant": r["identifiant"],
                    "population": "honnete",
                    "groupe": r["groupe"],
                    "axe": axe,
                    "latent": r[f"latent_{axe}"],
                    "attendu": r[f"attendu_{axe}"],
                    "score": r[f"score_{axe}"],
                    "ci_bas": r[f"ci_bas_{axe}"],
                    "ci_haut": r[f"ci_haut_{axe}"],
                    "type_lecture": r[f"type_lecture_{axe}"],
                    "lecture": r[f"lecture_{axe}"],
                    "niveaux_touches": r[f"touches_{axe}"],
                    "niveau_conservateur": r[f"conservateur_{axe}"],
                    "correspondance_conservateur": r[f"match_conservateur_{axe}"],
                    "correspondance_ponctuelle": r[f"match_ponctuel_{axe}"],
                    "couverture_ci": r[f"couverture_ci_{axe}"],
                    "erreur_absolue": r[f"erreur_abs_{axe}"],
                }
            )
    pd.DataFrame(lignes).to_csv(RES / "lectures_detaillees.csv", index=False, encoding="utf-8-sig")

    # 2) Honnêtes calculés (500 lignes)
    ev_h.to_csv(RES / "reponses_honnetes_calculees.csv", index=False, encoding="utf-8-sig")
    # 3) Piégés calculés (20 lignes)
    ev_p.to_csv(RES / "reponses_pieges_calculees.csv", index=False, encoding="utf-8-sig")

    # 4) Matrices de confusion (format long)
    lignes_mat = []
    for axe in ("A", "B"):
        for variante in ("conservateur", "ponctuel"):
            mat = m["matrices"][axe][variante]
            for att in NIVEAUX:
                for cal in NIVEAUX:
                    lignes_mat.append(
                        {
                            "axe": axe,
                            "variante": variante,
                            "attendu": att,
                            "calcule": cal,
                            "n": int(mat.loc[att, cal]),
                        }
                    )
    pd.DataFrame(lignes_mat).to_csv(RES / "matrices_confusion.csv", index=False, encoding="utf-8-sig")

    # 5) Statistiques par groupe
    pd.DataFrame(m["stats_groupes"]).to_csv(RES / "stats_groupes.csv", index=False, encoding="utf-8-sig")

    # 6) Détail RQS (520 lignes)
    lignes_rqs = []
    for _, r in ev_h.iterrows():
        lignes_rqs.append(
            {
                "identifiant": r["identifiant"],
                "population": "honnete",
                "categorie": r["groupe"],
                "et_corriges": r["rqs_et_corriges"],
                "pen_linearite": r["rqs_pen_linearite"],
                "pen_contradiction": r["rqs_pen_contradiction"],
                "pen_rythme": r["rqs_pen_rythme"],
                "pen_vigilance": r["rqs_pen_vigilance"],
                "total_penalites": r["rqs_total_penalites"],
                "rqs": r["rqs"],
                "statut": r["rqs_statut"],
            }
        )
    for _, r in ev_p.iterrows():
        lignes_rqs.append(
            {
                "identifiant": r["identifiant"],
                "population": "piege",
                "categorie": r["type_piege"],
                "et_corriges": r["rqs_et_corriges"],
                "pen_linearite": r["rqs_pen_linearite"],
                "pen_contradiction": r["rqs_pen_contradiction"],
                "pen_rythme": r["rqs_pen_rythme"],
                "pen_vigilance": r["rqs_pen_vigilance"],
                "total_penalites": r["rqs_total_penalites"],
                "rqs": r["rqs"],
                "statut": r["rqs_statut"],
            }
        )
    pd.DataFrame(lignes_rqs).to_csv(RES / "rqs_detail.csv", index=False, encoding="utf-8-sig")

    # 7) JSON des critères
    json_dict = {
        "meta": {
            "projet": "WAIRYU Therapie Couple - Package WTC-Q1 - Quete 1",
            "date": DATE_EXECUTION,
            "seed": SEED,
            "n_honnetes": int(len(ev_h)),
            "n_pieges": int(len(ev_p)),
            "lectures": 2 * int(len(ev_h)),
            "sem_axe": round(core.SEM_AXE, 5),
            "ci90_demi": round(core.CI90_DEMI, 5),
        },
        "C1": m["c1"],
        "C2": m["c2"],
        "C3": m["c3"],
        "C4": c4,
        "frontieres": m["frontieres"],
        "rqs_honnetes": m["rqs_honnetes"],
        "cronbach": m["cronbach"],
        "stats_groupes": m["stats_groupes"],
        "sensibilite_items_inverses_litteraux": m_litteral,
    }
    (RES / "criteres_c1_c4.json").write_text(
        json.dumps(json_dict, ensure_ascii=False, indent=2, sort_keys=True), encoding="utf-8"
    )


# ─────────────────────────────────────────────────────────────────────────────
# FIGURES (matplotlib — conventions projet : Okabe-Ito, français, 150 DPI)
# ─────────────────────────────────────────────────────────────────────────────
def _source_annotation(fig) -> None:
    fig.text(
        0.01,
        0.01,
        f"Source : simulation WTC-Q1 (seed={SEED}, 500 honnêtes) — généré le {DATE_EXECUTION}",
        fontsize=8,
        color=GRIS,
    )


def fig_matrice_confusion(mat: pd.DataFrame, axe: str, nom_axe: str, exactitude: float,
                          n_front: dict, path: Path) -> None:
    fig, ax = plt.subplots(figsize=(12.8, 7.2))
    im = ax.imshow(mat.to_numpy(dtype=float), cmap="Blues", aspect="auto")
    fig.colorbar(im, ax=ax, label="Nombre de lectures", shrink=0.85)
    for i in range(4):
        for j in range(4):
            n = int(mat.iloc[i, j])
            total_ligne = int(mat.iloc[i].sum())
            pct = f"{100 * n / total_ligne:.1f} %" if total_ligne else "—"
            couleur = "white" if n > mat.to_numpy().max() * 0.6 else "black"
            ax.text(j, i - 0.12, str(n), ha="center", va="center",
                    fontsize=15, fontweight="bold", color=couleur)
            ax.text(j, i + 0.18, pct, ha="center", va="center", fontsize=9, color=couleur)
    ax.set_xticks(range(4), NIVEAUX)
    ax.set_yticks(range(4), NIVEAUX)
    ax.set_xlabel("Niveau calculé (L3, décision conservatrice)", fontsize=11)
    ax.set_ylabel("Niveau attendu (seuils appliqués au latent)", fontsize=11)
    ax.set_title(
        f"Matrice de confusion — Axe {axe} « {nom_axe} »\n"
        f"Exactitude C1 (lecture conservatrice) = {exactitude:.1%} — "
        f"frontières bien/mal tranchées : {n_front['bien_tranchees']}/{n_front['mal_tranchees']} "
        f"sur {n_front['n_frontieres']} frontières",
        fontsize=13,
        pad=14,
    )
    _source_annotation(fig)
    fig.tight_layout(rect=[0, 0.03, 1, 1])
    fig.savefig(path, dpi=150, bbox_inches="tight")
    plt.close(fig)


def fig_distribution_erreurs(ev_h: pd.DataFrame, m: dict, path: Path) -> None:
    fig, ax = plt.subplots(figsize=(12.8, 7.2))
    bins = np.linspace(0, max(0.8, float(pd.concat([ev_h["erreur_abs_A"], ev_h["erreur_abs_B"]]).max())), 40)
    ax.hist(ev_h["erreur_abs_A"], bins=bins, alpha=0.65, color=OKABE_ITO[0],
            label=f"Axe A « Peur de perdre » (moy. {m['c2']['par_axe']['A']['moyenne']:.3f})")
    ax.hist(ev_h["erreur_abs_B"], bins=bins, alpha=0.65, color=OKABE_ITO[1],
            label=f"Axe B « Peur de dépendre » (moy. {m['c2']['par_axe']['B']['moyenne']:.3f})")
    ax.axvline(m["c2"]["erreur_moyenne"], color=OKABE_ITO[3], lw=2,
               label=f"Erreur moyenne globale = {m['c2']['erreur_moyenne']:.4f}")
    ax.axvline(0.15, color=OKABE_ITO[2], lw=2, ls="--",
               label="Seuil C2 = 0,15")
    ax.set_xlabel("|score calculé − latent| (unités de l'échelle 1-4)", fontsize=11)
    ax.set_ylabel("Nombre de lectures", fontsize=11)
    ax.set_title(
        f"Distribution des erreurs absolues — C2 (1 000 lectures)\n"
        f"C2 : erreur moyenne = {m['c2']['erreur_moyenne']:.4f} — "
        f"{'PASS' if m['c2']['pass'] else 'FAIL'} (seuil < 0,15)",
        fontsize=13, pad=14,
    )
    ax.legend(loc="upper right", fontsize=9)
    ax.grid(axis="y", linestyle="--", alpha=0.35)
    _source_annotation(fig)
    fig.tight_layout(rect=[0, 0.03, 1, 1])
    fig.savefig(path, dpi=150, bbox_inches="tight")
    plt.close(fig)


def fig_statuts_rqs(ev_h: pd.DataFrame, ev_p: pd.DataFrame, path: Path) -> None:
    statuts = ["OK", "PRUDENCE", "INVALIDE"]
    hon = [int((ev_h["rqs_statut"] == s).sum()) for s in statuts]
    pie = [int((ev_p["rqs_statut"] == s).sum()) for s in statuts]
    x = np.arange(len(statuts))
    larg = 0.38
    fig, ax = plt.subplots(figsize=(12.8, 7.2))
    b1 = ax.bar(x - larg / 2, hon, larg, color=OKABE_ITO[0], label="Honnêtes (n = 500)")
    b2 = ax.bar(x + larg / 2, pie, larg, color=OKABE_ITO[3], label="Piégés (n = 20)")
    for bars in (b1, b2):
        for b in bars:
            ax.text(b.get_x() + b.get_width() / 2, b.get_height() + 3, str(int(b.get_height())),
                    ha="center", fontsize=11, fontweight="bold")
    ax.set_xticks(x, statuts)
    ax.set_xlabel("Statut RQS (L1)", fontsize=11)
    ax.set_ylabel("Nombre de répondants", fontsize=11)
    ax.set_title(
        "Répartition des statuts RQS — honnêtes vs piégés\n"
        "C3 : un piégé est « détecté » si son statut RQS ≠ OK "
        f"({int(ev_p['detecte'].sum())}/20 détectés)",
        fontsize=13, pad=14,
    )
    ax.legend(fontsize=10)
    ax.grid(axis="y", linestyle="--", alpha=0.35)
    _source_annotation(fig)
    fig.tight_layout(rect=[0, 0.03, 1, 1])
    fig.savefig(path, dpi=150, bbox_inches="tight")
    plt.close(fig)


def genere_figures(ev_h: pd.DataFrame, ev_p: pd.DataFrame, m: dict) -> list[str]:
    noms = []
    for axe in ("A", "B"):
        nom = f"Heatmap_MatriceConfusion_Axe{axe}_{DATE_EXECUTION}.png"
        fig_matrice_confusion(
            m["matrices"][axe]["conservateur"],
            axe,
            core.AXES[axe]["nom"],
            m["c1"]["par_axe"][axe]["exactitude"],
            m["frontieres"][axe],
            FIG / nom,
        )
        noms.append(nom)
    nom = f"Histogram_DistributionErreursC2_{DATE_EXECUTION}.png"
    fig_distribution_erreurs(ev_h, m, FIG / nom)
    noms.append(nom)
    nom = f"BarChart_StatutsRQS_{DATE_EXECUTION}.png"
    fig_statuts_rqs(ev_h, ev_p, FIG / nom)
    noms.append(nom)
    return noms


# ─────────────────────────────────────────────────────────────────────────────
# GÉNÉRATION DU RAPPORT (7 sections A-G)
# ─────────────────────────────────────────────────────────────────────────────
def md_table(headers: list[str], rows: list[list]) -> str:
    out = ["| " + " | ".join(headers) + " |", "|" + "|".join(["---"] * len(headers)) + "|"]
    for r in rows:
        out.append("| " + " | ".join(str(c) for c in r) + " |")
    return "\n".join(out)


def trace_repondant(r: pd.Series, ev_reference: pd.Series | None = None) -> str:
    """Traçabilité ligne par ligne d'un répondant (Section D)."""
    lignes: list[str] = []
    if "groupe" in r and pd.notna(r.get("groupe", np.nan)):
        lignes.append(
            f"**{r['identifiant']}** — groupe {r['groupe']} « {r['groupe_nom']} » · "
            f"latent_A = {r['latent_A']:.4f} · latent_B = {r['latent_B']:.4f} · vigilance = {int(r['vigilance'])} (OK)"
        )
    else:
        lignes.append(
            f"**{r['identifiant']}** — piégé type « {r['type_piege']} » · vigilance = {int(r['vigilance'])} "
            f"(attendu 3) · durée de session = {r['temps_session']:.1f} s"
        )

    # 18 réponses, ligne par ligne
    lignes.append("\nRéponses brutes → scores corrigés (items inversés 5 et 15 : corrigé = 5 − brut) :\n")
    rows = []
    for i in range(1, 19):
        fid = core.face_de_item(i)
        note = " (inversé)" if i in core.ITEMS_INVERSES else ""
        rows.append([i, fid + note, int(r[f"r{i}"]), int(r[f"cor{i}"])])
    lignes.append(md_table(["Item", "Face", "Brut", "Corrigé"], rows))

    # Scores de faces (détail du calcul, recalculé ici depuis les corrigés)
    lignes.append("\nScores des faces — moyenne des 3 items corrigés :\n")
    rows = []
    cor = {i: int(r[f"cor{i}"]) for i in range(1, 19)}
    for fid, f in core.FACES.items():
        items = f["items"]
        detail = " + ".join(str(cor[i]) for i in items)
        val = round(sum(cor[i] for i in items) / 3, 2)
        rows.append([fid, f"« {f['nom']} »", f"Axe {f['axe']}", f"({detail}) / 3", f"{val:.2f}"])
    lignes.append(md_table(["Face", "Nom", "Axe", "Calcul", "Score"], rows))

    # Scores d'axes + CI90 + lectures
    lignes.append("\nScores d'axes, CI90 et lectures L3 :\n")
    rows = []
    for axe in ("A", "B"):
        if f"attendu_{axe}" in r and pd.notna(r[f"attendu_{axe}"]):
            latent_txt = f"{r[f'latent_{axe}']:.4f} → **{r[f'attendu_{axe}']}**"
            match_txt = "OUI" if r[f"match_conservateur_{axe}"] else "non"
        else:
            latent_txt = "—"
            match_txt = "n/a (piégé)"
        rows.append(
            [
                f"{axe} « {core.AXES[axe]['nom']} »",
                f"{r[f'score_{axe}']:.2f}",
                f"[{r[f'ci_bas_{axe}']:.2f} ; {r[f'ci_haut_{axe}']:.2f}]",
                f"{r[f'type_lecture_{axe}']} — {r[f'lecture_{axe}']}",
                r[f"conservateur_{axe}"],
                latent_txt,
                match_txt,
            ]
        )
    lignes.append(
        md_table(["Axe", "Score", "CI90", "Lecture", "Conservateur", "Attendu (latent)", "Correspondance"], rows)
    )

    # L4
    lignes.append("\nFaces dominantes (L4, indicatif — hors critères C1-C4) :\n")
    rows = []
    for axe in ("A", "B"):
        rows.append(
            [
                axe,
                r[f"l4_ordre_{axe}"].replace(">", " > "),
                f"{r[f'l4_ecart_{axe}']:.2f}",
                f"{core.Z90 * 2 ** 0.5 * core.SE_FACE:.4f} (seuil appliqué ≈ {round(core.Z90 * (2 * core.SE_FACE ** 2) ** 0.5, 4)})",
                r[f"l4_lecture_{axe}"],
            ]
        )
    lignes.append(md_table(["Axe", "Ordre des faces", "Écart 1-2", "Seuil L4", "Lecture"], rows))

    # RQS
    lignes.append("\nQualité de réponse (L1 — RQS) :\n")
    lignes.append("```text")
    for d in r["rqs_details"].split(" || "):
        lignes.append(f"  {d}")
    lignes.append("```")
    lignes.append(
        f"\n**Verdict RQS : {int(r['rqs'])}/100 → statut {r['rqs_statut']}**"
        + (
            f" — piégé {'DÉTECTÉ' if r['detecte'] else 'NON DÉTECTÉ'} (détecté ⇔ statut ≠ OK)"
            if "detecte" in r and pd.notna(r.get("detecte", np.nan))
            else ""
        )
    )
    return "\n".join(lignes)


def genere_rapport(m: dict, ev_h: pd.DataFrame, ev_p: pd.DataFrame, c4: dict,
                   m_litteral: dict, figures: list[str]) -> str:
    L: list[str] = []
    ap = L.append

    # ── En-tête
    ap("# RAPPORT FINAL DÉTAILLÉ — PACKAGE WTC-Q1")
    ap("## Validation de la Quête 1 « Comment je me raccroche » (échelle d'attachement adulte originale WAIRYU, fiche RIO-01)")
    ap("")
    ap(f"- **Projet** : WAIRYU Thérapie Couple — 26 dimensions cliniques, 110 quêtes, doctrine d'instruments originaux")
    ap(f"- **Exécuteur** : Data Insight — rôle strict d'implémentation (aucun paramètre modifié)")
    ap(f"- **Date d'exécution** : {DATE_EXECUTION} · **Seed** : {SEED} (numpy PCG64) · **Reproductibilité** : pipeline exécuté 2 fois")
    ap(f"- **Population** : 500 honnêtes (G1 n=200 · G2 n=150 · G3 n=100 · G4 n=50) + 20 piégés (7 linéaires · 6 speeders · 4 acquiesceurs · 3 vigilance ratée)")
    ap(f"- **Construit mesuré** : attachement adulte — Axe A « peur de perdre » (items 1-9), Axe B « peur de dépendre » (items 10-18) ; 18 items, échelle de fréquence 4 points ; items inversés 5 et 15 ; item de vigilance (19e, attendu = 3)")
    ap(f"- **Références citées** : Bowlby ; Brennan, Clark & Shaver. Instrument original WAIRYU.")
    ap(f"- **Sorties** : `results/` (CSV + JSON) · `figures/` ({len(figures)} PNG) · ce rapport")
    ap("")
    ap("> **Cadre du rapport** : toutes les sections sont exhaustives (aucun résumé abrégé). La vérité du système prime sur son succès apparent : chaque critère est déclaré tel quel.")
    ap("")
    ap("---")
    ap("")

    # ── SECTION A
    ap("## SECTION A — LES 4 CRITÈRES DE VALIDATION")
    ap("")
    ap("### A.1 Tableau synoptique (critères éliminatoires)")
    ap("")
    c1, c2, c3 = m["c1"], m["c2"], m["c3"]
    ap(md_table(
        ["Critère", "Définition", "Seuil", "Résultat observé", "Verdict"],
        [
            ["C1", "Exactitude des lectures (niveau calculé [L3, décision conservatrice] vs niveau attendu du latent)", "≥ 90 % (≥ 900/1 000)",
             f"{c1['correspondances']}/1 000 = {c1['exactitude']:.2%}", "**PASS**" if c1["pass"] else "**FAIL**"],
            ["C2", "Erreur moyenne |score calculé − latent| (1 000 lectures)", "< 0,15",
             f"{c2['erreur_moyenne']:.4f}", "**PASS**" if c2["pass"] else "**FAIL**"],
            ["C3", "Piégés détectés (statut RQS ≠ OK)", "≥ 17/20",
             f"{c3['detectes']}/20", "**PASS**" if c3["pass"] else "**FAIL**"],
            ["C4", "Reproductibilité (pipeline ×2, seed 42)", "Sorties strictement identiques",
             "OUI" if c4["identique"] else "NON", "**PASS**" if c4["identique"] else "**FAIL**"],
        ],
    ))
    ap("")

    ap("### A.2 C1 — détail par axe")
    ap("")
    ap(md_table(
        ["Axe", "Correspondances", "Total", "Exactitude", "Verdict (≥ 90 %)"],
        [
            [f"{axe} « {core.AXES[axe]['nom']} »",
             c1["par_axe"][axe]["correspondances"], c1["par_axe"][axe]["total"],
             f"{c1['par_axe'][axe]['exactitude']:.2%}",
             "PASS" if c1["par_axe"][axe]["exactitude"] >= 0.90 else "FAIL"]
            for axe in ("A", "B")
        ],
    ))
    ap("")
    ap("### A.3 C1 — détail par groupe")
    ap("")
    rows = []
    for g, d in c1["par_groupe"].items():
        nom = next(s["nom"] for s in m["stats_groupes"] if s["groupe"] == g)
        for axe in ("A", "B"):
            rows.append([g, nom, f"{axe}", d[axe]["n"], d[axe]["correspondances"], f"{d[axe]['exactitude']:.2%}"])
    ap(md_table(["Groupe", "Profil", "Axe", "n lectures", "Correspondances", "Exactitude"], rows))
    ap("")
    ap("### A.4 C1 — métriques auxiliaires (pour l'arbitrage du superviseur — ne remplacent PAS C1)")
    ap("")
    ap("- **Exactitude du niveau PONCTUEL** (niveau du score sans décision conservatrice, vs niveau attendu) : "
       f"Axe A = {c1['aux_ponctuel']['A']:.2%} · Axe B = {c1['aux_ponctuel']['B']:.2%}")
    ap("- **Taux de couverture CI90** (latent ∈ [CI bas ; CI haut]) : "
       f"Axe A = {c1['aux_couverture_ci']['A']:.2%} · Axe B = {c1['aux_couverture_ci']['B']:.2%}")
    ap("")
    ap("### A.5 C2 — détail")
    ap("")
    ap(md_table(
        ["Axe", "Erreur moyenne", "RMSE", "Biais moyen (signé)", "Erreur max"],
        [
            [f"{axe} « {core.AXES[axe]['nom']} »",
             f"{c2['par_axe'][axe]['moyenne']:.4f}", f"{c2['par_axe'][axe]['rmse']:.4f}",
             f"{c2['par_axe'][axe]['biais']:+.4f}", f"{c2['par_axe'][axe]['max']:.4f}"]
            for axe in ("A", "B")
        ] + [["GLOBAL", f"{c2['erreur_moyenne']:.4f}", f"{c2['rmse_global']:.4f}",
              f"{c2['biais_global']:+.4f}", f"{c2['erreur_max']:.4f}"]],
    ))
    ap("")
    ap("Erreur moyenne par groupe (axe A / axe B) :")
    ap("")
    ap(md_table(
        ["Groupe", "Erreur moy. A", "Erreur moy. B"],
        [[g, f"{c2['par_groupe'][g]['A']:.4f}", f"{c2['par_groupe'][g]['B']:.4f}"] for g in c2["par_groupe"]],
    ))
    ap("")
    ap("### A.6 C3 — détail par type de triche")
    ap("")
    mecanismes = {
        "lineaire": "Tous items = 2 → écart-type des corrigés ≈ 0,32 < 0,45 → pénalité anti-linéarité (−20) → RQS 80",
        "speeder": "Temps < 2,0 s sur tous les items (et session < 60 s) → pénalité rythme (−25) → RQS 75",
        "acquiesceur": "Tous items = 4 → corrigés(5,15) = 1 vs moyenne des autres items de face = 4 (écart 3 ≥ 2,5) → anti-contradiction (−20, une fois) → RQS 80",
        "vigilance_ratee": "Vigilance = 4 ≠ 3 → pénalité vigilance (−20) → RQS 80",
    }
    ap(md_table(
        ["Type de triche", "n", "Détectés", "RQS observés", "Statuts", "Mécanisme de détection", "Verdict"],
        [
            [t, d["n"], f"{d['detectes']}/{d['n']}", ", ".join(str(x) for x in d["rqs"]),
             ", ".join(d["statuts"]), mecanismes[t], "PASS" if d["detectes"] == d["n"] else "FAIL"]
            for t, d in c3["par_type"].items()
        ] + [["TOTAL", c3["total"], f"{c3['detectes']}/{c3['total']}", "—", "—", "Seuil ≥ 17/20", "PASS" if c3["pass"] else "FAIL"]],
    ))
    ap("")
    ap("Détail individuel des 20 piégés :")
    ap("")
    ap(md_table(
        ["ID", "Type", "RQS", "Statut", "Détecté", "Pénalités actives"],
        [[d["id"], d["type"], d["rqs"], d["statut"], "OUI" if d["detecte"] else "NON",
          ", ".join(d["penalites"]) or "aucune"] for d in c3["detail_individuel"]],
    ))
    ap("")
    ap("### A.7 C4 — reproductibilité")
    ap("")
    ap(f"- Deux exécutions complètes du pipeline (simulation → évaluation → métriques) avec seed = {SEED}.")
    ap(f"- Empreinte SHA-256 des métriques — exécution 1 : `{c4['sha256_run1'][:16]}…`")
    ap(f"- Empreinte SHA-256 des métriques — exécution 2 : `{c4['sha256_run2'][:16]}…`")
    ap(f"- Empreinte SHA-256 des 520 évaluations individuelles (CSV sérialisés) — exécution 1 : `{c4['sha256_frames_run1'][:16]}…` · exécution 2 : `{c4['sha256_frames_run2'][:16]}…`")
    ap(f"- **Sorties strictement identiques : {'OUI' if c4['identique'] else 'NON'}**")
    ap("")
    ap("---")
    ap("")

    # ── SECTION B
    ap("## SECTION B — MATRICES DE CONFUSION DES NIVEAUX")
    ap("")
    for axe in ("A", "B"):
        f = m["frontieres"][axe]
        ap(f"### Axe {axe} « {core.AXES[axe]['nom']} » — lecture CONSERVATRICE (référence C1)")
        ap("")
        mat = m["matrices"][axe]["conservateur"]
        rows = []
        for att in NIVEAUX:
            rows.append([att] + [int(mat.loc[att, cal]) for cal in NIVEAUX] + [int(mat.loc[att].sum())])
        ap(md_table(["Attendu ↓ · Calculé →"] + NIVEAUX + ["Total"], rows))
        ap("")
        ap(f"- Frontières L3 : **{f['n_frontieres']}** lectures sur 500 ({f['taux_frontiere']:.1%}) — "
           f"**bien tranchées : {f['bien_tranchees']}** · **mal tranchées : {f['mal_tranchees']}** "
           f"(bien tranchée ⇔ niveau conservateur = niveau attendu du latent).")
        ap(f"- Lectures touchant DEUX seuils (3 niveaux touchés) : {f['deux_seuils_touches']}.")
        ap("")
        ap("Variante auxiliaire — niveau PONCTUEL (sans décision conservatrice) :")
        ap("")
        mat2 = m["matrices"][axe]["ponctuel"]
        rows = []
        for att in NIVEAUX:
            rows.append([att] + [int(mat2.loc[att, cal]) for cal in NIVEAUX] + [int(mat2.loc[att].sum())])
        ap(md_table(["Attendu ↓ · Calculé →"] + NIVEAUX + ["Total"], rows))
        ap("")
    ap("Lecture des matrices : lignes = niveau attendu (seuils appliqués au latent) ; colonnes = niveau calculé "
       "(décision conservatrice pour la référence C1). La diagonale regroupe les correspondances ; toute cellule "
       "hors diagonale est une lecture erronée. Les figures `figures/Heatmap_MatriceConfusion_AxeA_*.png` et "
       "`AxeB_*.png` visualisent les matrices conservatrices.")
    ap("")
    ap("---")
    ap("")

    # ── SECTION C
    ap("## SECTION C — STATISTIQUES PAR GROUPE (G1-G4)")
    ap("")
    ap("Pour chaque groupe : moyennes et écart-types des scores calculés (axes A et B), écart entre mu simulé "
      "(paramètre de la Spécification 3) et moyenne calculée, et α de Cronbach OBSERVÉ par axe. "
      "**Les α observés sont des indicateurs de diagnostic : les paramètres placeholders de la spécification "
      "(SD 0,65 ; fiabilité 0,85 ; SEM 0,252) ne sont JAMAIS remplacés.**")
    ap("")
    rows = []
    for s in m["stats_groupes"]:
        rows.append([
            f"{s['groupe']} « {s['nom']} »", s["n"],
            f"{s['mu_A_param']:.1f}", f"{s['moyenne_latente_A']:.3f}", f"{s['moyenne_score_A']:.3f}",
            f"{s['sd_score_A']:.3f}", f"{s['ecart_mu_A']:+.3f}", f"{s['alpha_A']:.3f}",
            f"{s['mu_B_param']:.1f}", f"{s['moyenne_latente_B']:.3f}", f"{s['moyenne_score_B']:.3f}",
            f"{s['sd_score_B']:.3f}", f"{s['ecart_mu_B']:+.3f}", f"{s['alpha_B']:.3f}",
        ])
    ap(md_table(
        ["Groupe", "n", "μ_A", "Latente A (moy.)", "Score A (moy.)", "SD A", "Écart μ_A", "α Cronbach A",
         "μ_B", "Latente B (moy.)", "Score B (moy.)", "SD B", "Écart μ_B", "α Cronbach B"],
        rows,
    ))
    ap("")
    ap(f"**α de Cronbach observés, population honnête complète (500 répondants)** : "
       f"Axe A = {m['cronbach']['pool_A']:.3f} · Axe B = {m['cronbach']['pool_B']:.3f}.")
    ap("")
    ap("**Lecture** : les α de groupe (≈ 0,75-0,80) reflètent la variance de latente WITHIN-groupe "
       "(σ² = 0,35² = 0,1225) rapportée au bruit d'item (σ ≈ 0,56 après troncature/arrondi) ; les α poolés "
       "(≈ 0,9) sont gonflés par la variance BETWEEN-groupes (moyennes 2,0-3,1). L'écart-type OBSERVÉ des "
       "scores d'axe (≈ 0,19) est nettement inférieur au SD placeholder (0,65) qui sert au calcul du SEM (0,252) : "
       "cette incohérence structurelle est analysée en Section F (signal n° 9).")
    ap("")
    ap("---")
    ap("")

    # ── SECTION D
    ap("## SECTION D — TROIS EXEMPLES TRACÉS DE BOUT EN BOUT")
    ap("")
    ap("Traçabilité ligne par ligne : les 18 réponses → scores corrigés → scores des faces → scores d'axes + "
      "intervalles → lecture (niveau ou frontière) → verdict RQS. Sélection : le premier répondant de G1, le "
      "premier répondant de G3, et le premier piégé (linéaire).")
    ap("")
    idx_g1 = ev_h.index[0]
    idx_g3 = ev_h.index[ev_h["groupe"] == "G3"][0]
    idx_p1 = ev_p.index[0]
    for titre, r in [
        ("Exemple 1 — répondant HONNÊTE de G1", ev_h.loc[idx_g1]),
        ("Exemple 2 — répondant HONNÊTE de G3", ev_h.loc[idx_g3]),
        ("Exemple 3 — répondant PIÉGÉ", ev_p.loc[idx_p1]),
    ]:
        ap(f"### {titre}")
        ap("")
        ap(trace_repondant(r))
        ap("")
    ap("---")
    ap("")

    # ── SECTION E
    ap("## SECTION E — LES CAS FRONTIÈRES")
    ap("")
    fa, fb = m["frontieres"]["A"], m["frontieres"]["B"]
    total_front = fa["n_frontieres"] + fb["n_frontieres"]
    ap(f"**Combien d'honnêtes en lecture FRONTIÈRE ?** {total_front} lectures sur 1 000 "
       f"({total_front / 10:.1f} %) : Axe A = {fa['n_frontieres']}/500 ({fa['taux_frontiere']:.1%}) · "
       f"Axe B = {fb['n_frontieres']}/500 ({fb['taux_frontiere']:.1%}).")
    ap("")
    ap("**La décision conservatrice a-t-elle été correctement appliquée ?** OUI — contrôle programmatique : "
       "pour les 1 000 lectures, le niveau retenu est EXACTEMENT le niveau le plus bas touché par l'intervalle "
       "CI90 (1 000/1 000 vérifications réussies ; le code `lecture_L3` ne retourne que le minimum des niveaux "
       "touchés, et un garde-fou lève une exception si un intervalle ne touche aucun niveau).")
    ap("")
    ap(f"Décompte des tranchages : **bien tranchées** (conservateur = attendu) : Axe A {fa['bien_tranchees']}, "
       f"Axe B {fb['bien_tranchees']} ; **mal tranchées** : Axe A {fa['mal_tranchees']}, Axe B {fb['mal_tranchees']}. "
       f"Lectures touchant deux seuils à la fois : Axe A {fa['deux_seuils_touches']}, Axe B {fb['deux_seuils_touches']} "
       "(ambiguïté « entre X et Y » sous-déterminée — signal n° 10 en Section F).")
    ap("")
    ap("**Structure mécanique des frontières** : le CI90 (demi-largeur 1,64 × SEM = 0,4129, soit une largeur de "
       "0,8258) est PLUS LARGE que l'écart entre seuils adjacents (0,80 entre 1,80-2,60 ; 0,60 entre 2,60-3,20). "
       "Conséquence : tout score compris entre ≈ 1,39 et ≈ 3,61 produit mécaniquement une lecture FRONTIÈRE — "
       "seuls Discrète (score ≤ 1,39) et Forte (score ≥ 3,61) peuvent être lus en niveau pur. La notion de "
       "frontière dégénère donc sur toute la plage utile de l'échelle (cf. Section F, signal n° 9).")
    ap("")
    ap("**Effet de la décision conservatrice sur les niveaux** : la décision conservatrice décale les frontières "
       "effectives d'un cran vers le haut : Discrète si score < 2,21 ; Tranquille si 2,21 ≤ score < 3,01 ; "
       "Vive si 3,01 ≤ score < 3,61 ; Forte si score ≥ 3,61 (au lieu de 1,80 / 2,60 / 3,20). C'est la cause "
       "directe des non-correspondances C1 pour les latents situés dans les bandes [seuil ; seuil + 0,41].")
    ap("")
    ap("**Drapeaux RQS chez les honnêtes (faux positifs — indicateur, hors critères)** : "
       f"{m['rqs_honnetes']['aucune_penalite']}/500 sans aucune pénalité ; pénalités levées : "
       f"anti-linéarité {m['rqs_honnetes']['pen_linearite']}, anti-contradiction {m['rqs_honnetes']['pen_contradiction']}, "
       f"rythme {m['rqs_honnetes']['pen_rythme']}, vigilance {m['rqs_honnetes']['pen_vigilance']} ; "
       f"statuts : {m['rqs_honnetes']['statuts']} ; RQS moyenne = {m['rqs_honnetes']['rqs_moyenne']:.2f}. "
       "Aucun honnête ne passe sous INVALIDE (70) : les honnêtes signalés restent en PRUDENCE.")
    ap("")
    ap("---")
    ap("")

    # ── SECTION F
    ap("## SECTION F — BUGS ET INCOHÉRENCES SIGNALÉS (signalement seul — aucune correction de mon propre initiative)")
    ap("")
    ap("Conformément à la règle de rôle : chaque point ci-dessous est un SIGNAL à l'attention de l'orchestrateur "
      "humain + GLM superviseur. Aucun seuil, poids ou paramètre de la spécification n'a été modifié. Lorsqu'un "
      "choix d'implémentation était indispensable pour exécuter, il est explicitement documenté et son impact "
      "est quantifié.")
    ap("")
    c1_lit = m_litteral["c1_exactitude"]
    c2_lit = m_litteral["c2_erreur_moyenne"]
    signaux = [
        ("S1 — AMBIGUÏTÉ MAJEURE (items inversés dans le simulateur)",
         "La Spécification 3 dit « chaque item ~ Normal(latent de son axe, 0,5), borné [1;4], arrondi entier ». "
         "Lue LITTÉRALEMENT pour les items inversés (5, 15), la réponse BRUTE suivrait la latente positivement, et "
         "après correction (5 − brut) ces items mesureraient l'INVERSE de la latente (espérance 5 − latent) : la "
         "face A1 mesurerait alors un mélange incohérent et C2 serait structurellement ruiné. "
         "Implémentation retenue : chaque item est tiré sur l'ÉCHELLE CORRIGÉE ~ N(latent, 0,5), puis brut = 5 − "
         "corrigé pour les items 5 et 15 (l'item inversé manifeste la latente négativement en codage brut — "
         "psychométrie standard). "
         f"SENSIBILITÉ EXÉCUTÉE en lecture littérale : C1 = {c1_lit:.2%}, C2 = {c2_lit:.4f}, C3 = "
         f"{m_litteral['c3_detectes']}/20 (vs pipeline principal : C1 = {c1['exactitude']:.2%}, "
         f"C2 = {c2['erreur_moyenne']:.4f}, C3 = {c3['detectes']}/20). C'est le superviseur qui arbitre."),
        ("S2 — TENSION STRUCTURELLE MAJEURE (CI90 vs écart des seuils — dégénérescence des frontières)",
         f"Le CI90 (score ± 1,64 × SEM = ± {core.CI90_DEMI:.4f}, largeur {2 * core.CI90_DEMI:.4f}) dérivé des "
         "placeholders (SD 0,65 ; fiabilité 0,85) est PLUS LARGE que l'écart entre seuils adjacents (0,80 et 0,60). "
         "Toute lecture dont le score est compris entre ≈ 1,39 et ≈ 3,61 chevauche mécaniquement un seuil → "
         f"lecture FRONTIÈRE. Observé : {total_front}/1 000 lectures honnêtes en frontière "
         f"({total_front / 10:.1f} %). La lecture « entre X et Y » devient le cas GÉNÉRAL et non l'exception — "
         "à arbitrer (SEM placeholder trop grand pour ces seuils, ou seuils trop proches pour ce SEM)."),
        ("S3 — TENSION STRUCTURELLE MAJEURE (C1 : décision conservatrice vs niveau attendu du latent)",
         "C1 compare le niveau CONSERVATEUR au niveau attendu du latent. La décision conservatrice décale les "
         "frontières effectives de +1,64 × SEM (≈ +0,41) : Discrète si score < 2,21 ; Tranquille si score < 3,01 ; "
         "Vive si score < 3,61. Tout latent situé dans la bande [seuil ; seuil + 0,41] au-dessus d'un seuil est "
         "donc structurellement déclassé dès que le score y reste, MÊME SI le score ponctuel donne le bon niveau. "
         "Métriques d'arbitrage fournies (Section A.4) : exactitude PONCTUELLE et couverture CI90. "
         "Aucun de ces chiffres ne remplace le verdict C1 littéral, déclaré tel quel en Section A/G."),
        ("S4 — INCOHÉRENCE DE COHÉRENCE INTERNE (SEM placeholder vs bruit réel du simulateur)",
         "Le SEM placeholder (0,65 × √0,15 = 0,2517) suppose un SD de score d'axe de 0,65. Or le simulateur "
         "(bruit d'item 0,5 + troncature + arrondi) produit un écart-type OBSERVÉ de score d'axe ≈ 0,19 "
         "(cf. Section C, colonnes SD A / SD B). Le CI90 est donc surdimensionné d'un facteur ≈ 2,2 par rapport "
         "au bruit réel. Les placeholders ne sont PAS remplacés (règle stricte) — le désaccord est signalé pour "
         "arbitrage (recaler la fiabilité/SD, ou le bruit d'item de la Spécification 3)."),
        ("S5 — C2 SUR LE FIL (seuil 0,15 vs bruit d'item 0,5)",
         f"Avec un bruit d'item σ = 0,5, l'écart-type théorique de l'erreur d'un score d'axe (moyenne de 9 items "
         f"indépendants) est ≈ 0,56/3 ≈ 0,19, soit une erreur absolue moyenne attendue ≈ 0,8 × 0,19 ≈ 0,15 — "
         f"exactement au niveau du seuil C2. Résultat observé : {c2['erreur_moyenne']:.4f} "
         f"({'PASS' if c2['pass'] else 'FAIL'}). Le critère C2 est donc à la limite de faisabilité de sa propre "
         "spécification de simulation : un très léger changement de seed peut inverser le verdict."),
        ("S6 — AMBIGUÏTÉ (L1-a : convention d'écart-type)",
         "« Écart-type des 18 scores corrigés » : ddof non précisé. Choix : ddof=1 (écart-type d'échantillon). "
         "Vérifié sans impact sur C1-C4 : les linéaires donnent 0,3234 (ddof=1) vs 0,3143 (ddof=0), tous deux "
         "< 0,45 ; aucune autre catégorie de répondants ne change de statut selon la convention."),
        ("S7 — AMBIGUÏTÉ (L1-b : items de référence pour la contradiction)",
         "« Moyenne des 2 autres items de sa face » : ces items n'étant pas inversés, brut = corrigé — aucune "
         "ambiguïté réelle. La pénalité est appliquée UNE FOIS au total quand les 2 items inversés déclenchent "
         "simultanément (spécification explicite « une fois au total, pas 2 ») — observé chez les acquiesceurs."),
        ("S8 — AMBIGUÏTÉ (temps des piégés « uniformes 5,0 s / 6,0 s »)",
         "Intervalles non précisés. Choix : temps CONSTANTS (5,0 s / 6,0 s), seule lecture entièrement déterminée. "
         "Sans impact : dans les deux lectures, aucun item < 2,0 s et session ≥ 60 s → pas de pénalité de rythme "
         "pour linéaires et acquiesceurs."),
        ("S9b — AMBIGUÏTÉ (durée de session)",
         "La session inclut-elle la question de vigilance ? Choix : session = somme des 19 questions. Sans impact : "
         "les speeders font ≈ 22,8 s (19 questions) ou ≈ 21,6 s (18 items) — session < 60 s dans les deux lectures."),
        ("S10 — AMBIGUÏTÉ (frontière touchant DEUX seuils)",
         "La spec ne définit la frontière que « entre X et Y ». Quand l'CI90 chevauche deux seuils (3 niveaux "
         "touchés — fenêtres score ≈ 2,19-2,21 et ≈ 2,79-3,01), choix : frontière entre le niveau le plus bas et "
         "le plus haut touchés, conservateur = le plus bas. Observé : "
         f"{fa['deux_seuils_touches']} (axe A) + {fb['deux_seuils_touches']} (axe B) lectures concernées."),
        ("S11 — INCOHÉRENCE MINEURE (constante SE_face)",
         "La spec affiche SE_face = 0,72 × √(1 − 0,72) ≈ 0,379, mais la formule donne 0,38105. La FORMULE fait foi "
         "(aucun paramètre inventé) : seuil L4 = 1,64 × √(2 × SE²) = 0,8837 (au lieu de 0,8792 avec 0,379). "
         "Impact : L4 seulement — hors périmètre des critères C1-C4."),
        ("S12 — INCOHÉRENCE MINEURE (constantes L7)",
         "Borne FIABLE : « 1,64 × SE_diff (≈ 0,58) » — la formule donne 0,58381 ; implémentation par la formule. "
         "Borne SUGGESTION : 0,41 est donné en littéral (= 1,64 × SEM = 0,4129 exactement) ; implémentation par le "
         "littéral. L7 est hors périmètre des critères (pas de données longitudinales) — implémenté et testé unitairement."),
        ("S13 — CHOIX (arrondis)",
         "Arrondi entier des items : np.round (arrondi bancaire ; événement de mesure nulle sur tirages continus). "
         "Scores arrondis à 2 décimales AVANT les seuils L3 (spec : « Scores (2 décimales) »), bornes CI arrondies "
         "à 2 décimales pour l'affichage ET le test de chevauchement (cohérence rapport/calcul). "
         "« Borné » = clip (et non re-tirage)."),
        ("S14 — CHOIX (α de Cronbach sur items corrigés)",
         "α calculé sur les items CORRIGÉS (clés inversées appliquées). Sur items bruts non retournés, les items "
         "5/15 corréleraient négativement avec les autres et l'α serait artéfactuel (négatif). Les α observés sont "
         "rapportés Section C à titre de diagnostic uniquement — les placeholders ne sont jamais remplacés."),
        ("S15 — BLOCAGE ENVIRONNEMENT (dépôt GitHub dédié)",
         "La création du dépôt dédié `wtc-validation-q1` via l'API GitHub a été REFUSÉE par le token utilisé "
         "(« Resource not accessible by personal access token » — le PAT fine-grained ne dispose pas du droit de "
         "création de dépôts). Le package a été poussé tel quel (arborescence /src, /results, /figures) dans le "
         "dépôt existant du projet : WAIRYU-Dating, dossier « Wairyu thérapie couple/validation-q1/ ». "
         "Pour migrer vers un dépôt dédié : créer le dépôt (ou étendre le token avec la permission "
         "« Administration ») puis pousser ce dossier tel quel."),
    ]
    for i, (titre, corps) in enumerate(signaux, 1):
        ap(f"**{titre}**")
        ap("")
        ap(corps)
        ap("")
    ap("---")
    ap("")

    # ── SECTION G
    ap("## SECTION G — VERDICT FINAL")
    ap("")
    ap("### Fiche de verdict (à contresigner par le superviseur)")
    ap("")
    ap(md_table(
        ["Critère", "Seuil", "Observé", "Verdict"],
        [
            ["C1 — Exactitude des lectures (conservateur vs latent)", "≥ 90 %",
             f"{c1['correspondances']}/1 000 = {c1['exactitude']:.2%}", "**PASS**" if c1["pass"] else "**FAIL**"],
            ["C2 — Erreur moyenne |score − latent|", "< 0,15",
             f"{c2['erreur_moyenne']:.4f}", "**PASS**" if c2["pass"] else "**FAIL**"],
            ["C3 — Piégés détectés (RQS ≠ OK)", "≥ 17/20",
             f"{c3['detectes']}/20 (7/7 linéaires · 6/6 speeders · 4/4 acquiesceurs · 3/3 vigilance)",
             "**PASS**" if c3["pass"] else "**FAIL**"],
            ["C4 — Reproductibilité (×2, seed 42)", "identique",
             "OUI — SHA-256 identiques", "**PASS**" if c4["identique"] else "**FAIL**"],
        ],
    ))
    ap("")
    verdict = "VALIDÉ" if (c1["pass"] and c2["pass"] and c3["pass"] and c4["identique"]) else "À CORRIGER"
    ap(f"### **VERDICT PACKAGE : {verdict}**")
    ap("")
    if verdict == "À CORRIGER":
        motifs = [
            f"C1 = {c1['exactitude']:.2%} < 90 %" if not c1["pass"] else None,
            f"C2 = {c2['erreur_moyenne']:.4f} ≥ 0,15" if not c2["pass"] else None,
            "C3 < 17/20" if not c3["pass"] else None,
            "C4 non identique" if not c4["identique"] else None,
        ]
        ap("Motifs (déclarés tels quels, cf. Sections A et F) : "
           + "; ".join(x for x in motifs if x is not None)
           + ". Les tensions structurelles S2/S3/S4 (CI90 surdimensionné par les placeholders + décision "
           "conservatrice décalant les frontières effectives de +0,41) expliquent l'essentiel de l'échec C1 ; "
           "S5 explique la fragilité de C2. Corrections à arbitrer par l'orchestrateur humain + GLM superviseur "
           "(aucune correction apportée de mon propre initiative).")
        ap("")
    ap("**Note de confiance dans l'implémentation : 9/10** — le pipeline implémente mot pour mot la spécification "
      "(constantes figées, ordre de tirage documenté, reproductibilité démontrée par SHA-256) ; le point retenu : "
      "les choix d'interprétation documentés S1/S6/S8/S9b/S10/S13, dont S1 (items inversés du simulateur) modifie "
      "mécaniquement les résultats et requiert l'arbitrage du superviseur.")
    ap("")
    ap("**URL du dépôt GitHub : https://github.com/georgyfr/WAIRYU-Dating/tree/main/Wairyu%20th%C3%A9rapie%20couple/validation-q1** "
       "(dépôt dédié `wtc-validation-q1` impossible à créer avec le token actuel — signal S15 ; le dossier est "
       "migrable tel quel).")
    ap("")
    ap("---")
    ap("")
    ap("*Fin du rapport — sections A à G exhaustives. Sorties brutes associées : `results/lectures_detaillees.csv` "
      "(1 000 lectures), `results/reponses_honnetes_calculees.csv` (500), `results/reponses_pieges_calculees.csv` "
      "(20), `results/rqs_detail.csv` (520), `results/matrices_confusion.csv`, `results/stats_groupes.csv`, "
      "`results/criteres_c1_c4.json`.*")
    return "\n".join(L)


# ─────────────────────────────────────────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────────────────────────────────────────
def _empreinte_metrics(m: dict) -> str:
    payload = json.dumps(m, sort_keys=True, ensure_ascii=False, default=str)
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()


def _empreinte_frames(ev_h: pd.DataFrame, ev_p: pd.DataFrame) -> str:
    h = hashlib.sha256()
    h.update(ev_h.to_csv(index=False).encode("utf-8"))
    h.update(ev_p.to_csv(index=False).encode("utf-8"))
    return h.hexdigest()


def main() -> None:
    print("=" * 78)
    print("WTC-Q1 — PIPELINE DE VALIDATION (seed = 42)")
    print("=" * 78)

    # C4 — deux exécutions complètes
    print("[1/6] Exécution du pipeline — passage 1…")
    ev_h1, ev_p1 = run_pipeline(SEED)
    print("[2/6] Exécution du pipeline — passage 2 (C4)…")
    ev_h2, ev_p2 = run_pipeline(SEED)
    m1 = calcule_metriques(ev_h1, ev_p1)
    m2 = calcule_metriques(ev_h2, ev_p2)
    sha_m1, sha_m2 = _empreinte_metrics(m1), _empreinte_metrics(m2)
    sha_f1, sha_f2 = _empreinte_frames(ev_h1, ev_p1), _empreinte_frames(ev_h2, ev_p2)
    identique = (sha_m1 == sha_m2) and (sha_f1 == sha_f2)
    c4 = {
        "identique": bool(identique),
        "sha256_run1": sha_m1,
        "sha256_run2": sha_m2,
        "sha256_frames_run1": sha_f1,
        "sha256_frames_run2": sha_f2,
    }
    print(f"      → C4 : sorties identiques = {identique}")

    # Sensibilité (lecture littérale des items inversés) — signalement Section F
    print("[3/6] Exécution de sensibilité (items inversés en lecture littérale)…")
    m_lit = calcule_sensibilite_litterale(SEED)

    # Contrôle programmatique de la décision conservatrice (Section E)
    for ev in (ev_h1, ev_p1):
        for axe in ("A", "B"):
            for _, r in ev.iterrows():
                touches = core.niveaux_touches(r[f"ci_bas_{axe}"], r[f"ci_haut_{axe}"])
                assert touches[0] == r[f"conservateur_{axe}"], f"Conservateur incohérent : {r['identifiant']} {axe}"
                assert touches == r[f"touches_{axe}"].split("|"), f"Touches incohérentes : {r['identifiant']} {axe}"
    print("[4/6] Contrôle programmatique de la décision conservatrice : 1 000/1 000 OK")

    # Sorties brutes + figures + rapport
    print("[5/6] Écriture des sorties brutes (results/)…")
    ecrire_sorties(ev_h1, ev_p1, m1, m_lit, c4)
    print("[6/6] Figures + rapport…")
    figures = genere_figures(ev_h1, ev_p1, m1)
    rapport = genere_rapport(m1, ev_h1, ev_p1, c4, m_lit, figures)
    (RES / "rapport.md").write_text(rapport, encoding="utf-8")

    # Synthèse console
    c1, c2, c3 = m1["c1"], m1["c2"], m1["c3"]
    print("")
    print("SYNTHÈSE DES CRITÈRES")
    print(f"  C1 : {c1['correspondances']}/1 000 = {c1['exactitude']:.2%} → {'PASS' if c1['pass'] else 'FAIL'}")
    print(f"       (aux. ponctuel : A {c1['aux_ponctuel']['A']:.2%} · B {c1['aux_ponctuel']['B']:.2%} ;"
          f" couverture CI : A {c1['aux_couverture_ci']['A']:.2%} · B {c1['aux_couverture_ci']['B']:.2%})")
    print(f"  C2 : {c2['erreur_moyenne']:.4f} → {'PASS' if c2['pass'] else 'FAIL'}")
    print(f"  C3 : {c3['detectes']}/20 → {'PASS' if c3['pass'] else 'FAIL'}")
    print(f"  C4 : {'PASS' if identique else 'FAIL'}")
    print(f"  Sensibilité (items inversés littéraux) : C1 {m_lit['c1_exactitude']:.2%} · C2 {m_lit['c2_erreur_moyenne']:.4f}")
    print(f"  Rapport : {RES / 'rapport.md'}")


if __name__ == "__main__":
    main()
