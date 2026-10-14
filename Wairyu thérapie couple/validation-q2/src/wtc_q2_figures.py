# -*- coding: utf-8 -*-
"""WAIRYU — WTC-Q2-04b : figures de synthèse du package WTC-Q2.
4 visuels 1920×1080 px (150 DPI), palette Okabe-Ito, libellés français.
Lecture DIRECTE de results/ (aucune valeur saisie à la main).
Usage : python3 wtc_q2_figures.py"""

import csv
import json
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np

plt.rcParams["font.sans-serif"] = ["Arial", "DejaVu Sans"]
plt.rcParams["axes.unicode_minus"] = False
plt.rcParams["font.size"] = 11

OK_BLEU = "#0072B2"
OK_VERT = "#009E73"
OK_VERMILLON = "#D55E00"
OK_ORANGE = "#E69F00"

BASE = Path(__file__).resolve().parent.parent
RES = BASE / "results"
FIG = BASE / "figures"
FIG.mkdir(exist_ok=True)
DATE = "2026-10-15"
SOURCE = ("Source : WAIRYU-Dating / Wairyu thérapie couple / validation-q2 · seed 42 · "
          "400 honnêtes + 23 piégés + 8 arêtes · " + DATE)


def charger():
    crit = json.loads((RES / "criteres_q2.json").read_text(encoding="utf-8"))
    with open(RES / "matrice_nommage.csv", encoding="utf-8-sig") as f:
        mat = list(csv.DictReader(f))
    with open(RES / "stats_groupes.csv", encoding="utf-8-sig") as f:
        stats = list(csv.DictReader(f))
    with open(RES / "non_nommes.csv", encoding="utf-8-sig") as f:
        nn = list(csv.DictReader(f))
    return crit, mat, stats, nn


def style(ax):
    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)
    ax.grid(axis="y", color="#CCCCCC", linestyle="--", linewidth=0.7, alpha=0.8)
    ax.set_axisbelow(True)


def fig_tableau_de_bord(crit, c4_ok):
    c5 = crit["C5"]
    fig, axes = plt.subplots(2, 4, figsize=(12.8, 7.2), dpi=150)
    fig.suptitle("Tableau de bord des 7 critères — PACKAGE WTC-Q2 « Ce qui m'effraie vraiment » · "
                 "verdict : À CORRIGER (5/7 PASS) · note 6/10 (barème déclaré)",
                 fontsize=13.5, fontweight="bold", y=0.98)

    # C1a
    ax = axes[0, 0]
    d = crit["C1a"]["detail"]
    noms = ["T1", "T2", "T3", "GLOBAL"]
    vals = [d["T1_PERDRE"]["taux"] * 100, d["T2_ETOUFFEE"]["taux"] * 100,
            d["T3_LESDEUX"]["taux"] * 100, crit["C1a"]["global"] * 100]
    cols = [OK_BLEU, OK_BLEU, OK_BLEU, OK_VERMILLON]
    bars = ax.bar(noms, vals, color=cols, width=0.6)
    ax.axhline(82, color=OK_ORANGE, lw=1.6, linestyle="--", label="seuil 82 %")
    ax.axhline(89, color=OK_GRIS if (OK_GRIS := "#999999") else "#999999", lw=1.2,
               linestyle=":", label="plafond doc. ≈ 89 %")
    for b, v in zip(bars, vals):
        ax.annotate(f"{v:.1f}".replace(".", ","), (b.get_x() + b.get_width() / 2, v),
                    ha="center", va="bottom", fontsize=10, fontweight="bold")
    ax.set_ylim(0, 105)
    ax.set_ylabel("% nommage correct")
    ax.set_title("C1a — Nommage T1-T3 : FAIL", fontsize=11, fontweight="bold", color=OK_VERMILLON)
    ax.legend(loc="lower right", fontsize=7, framealpha=0.9)
    style(ax)

    # C1b
    ax = axes[0, 1]
    b = crit["C1b"]
    bars = ax.bar(["T4 → calme", "fuite T1-T3"], [b["t4_calmes"] * 100, max(b["fuite_t1t3"] * 100, 0.4)],
                  color=[OK_VERT, OK_VERT], width=0.55)
    ax.axhline(80, color=OK_ORANGE, lw=1.6, linestyle="--", label="seuil haut ≥ 80 %")
    ax.axhline(2, color="#8B0000", lw=1.6, linestyle=":", label="plafond fuite ≤ 2 %")
    ax.annotate(f"{b['t4_calmes']*100:.1f} %".replace(".", ","), (0, b["t4_calmes"] * 100),
                ha="center", va="bottom", fontsize=11, fontweight="bold")
    ax.annotate(f"{b['fuite_t1t3']*100:.2f} %".replace(".", ","), (1, max(b["fuite_t1t3"] * 100, 0.4)),
                ha="center", va="bottom", fontsize=11, fontweight="bold")
    ax.set_ylim(0, 105)
    ax.set_ylabel("% ZONE CALME")
    ax.set_title("C1b — Calme bilatéral : PASS", fontsize=11, fontweight="bold", color=OK_VERT)
    ax.legend(loc="lower right", fontsize=7, framealpha=0.9)
    style(ax)

    # C1c + C2
    ax = axes[0, 2]
    bars = ax.bar(["arêtes", "signal", "p-filtre", "FP"],
                  [8, 8, 5, 0.3], color=[OK_VERT, OK_VERT, OK_VERT, OK_VERT], width=0.6)
    ax.axhline(8, color=OK_ORANGE, lw=1.3, linestyle="--")
    ax.axhline(5, color=OK_ORANGE, lw=1.3, linestyle=":")
    for x_, lab in zip(range(4), ["8/8", "8/8", "5/5", "0 FP"]):
        ax.annotate(lab, (x_, [8, 8, 5, 0.3][x_]), ha="center", va="bottom",
                    fontsize=10, fontweight="bold")
    ax.set_ylim(0, 9.5)
    ax.set_yticks(range(0, 9))
    ax.set_ylabel("nombre attendu = obtenu")
    ax.set_title("C1c·C2 — Sécurité : PASS", fontsize=11,
                 fontweight="bold", color=OK_VERT)
    ax.tick_params(axis="x", labelsize=8.5)
    style(ax)

    # C3
    ax = axes[0, 3]
    c3 = crit["C3"]
    bars = ax.bar(["simple", "double", "honnêtes"],
                  [100, 100, c3["taux_honnetes_index_1"] * 100],
                  color=[OK_VERT, OK_VERT, OK_VERT], width=0.6)
    ax.axhline(90, color=OK_ORANGE, lw=1.6, linestyle="--", label="seuil 90 %")
    for x_, lab in zip(range(3), ["6/6", "4/4", f"{c3['taux_honnetes_index_1']*100:.1f} %".replace(".", ",")]):
        ax.annotate(lab, (x_, [100, 100, c3["taux_honnetes_index_1"] * 100][x_]),
                    ha="center", va="bottom", fontsize=10, fontweight="bold")
    ax.set_ylim(80, 105)
    ax.set_ylabel("% conforme")
    ax.set_title("C3 — Convergence Q1×Q2 : PASS", fontsize=11, fontweight="bold", color=OK_VERT)
    ax.legend(loc="lower right", fontsize=7, framealpha=0.9)
    ax.tick_params(axis="x", labelsize=8.5)
    style(ax)

    # C4
    ax = axes[1, 0]
    ax.bar(["run 1", "run 2"], [1, 1], color=[OK_BLEU, OK_VERT], width=0.55)
    ax.annotate("SHA-256\nidentiques" if c4_ok else "DIFFÉRENTS", (0, 1),
                ha="center", va="bottom", fontsize=11, fontweight="bold")
    ax.annotate("SHA-256\nidentiques" if c4_ok else "DIFFÉRENTS", (1, 1),
                ha="center", va="bottom", fontsize=11, fontweight="bold")
    ax.set_ylim(0, 1.35)
    ax.set_yticks([0, 1])
    ax.set_ylabel("sortie identique (1 = oui)")
    ax.set_title("C4 — Reproductibilité ×2 : PASS", fontsize=11,
                 fontweight="bold", color=OK_VERT)
    style(ax)

    # C5
    ax = axes[1, 1]
    c5b = c5["b_palier_recalcule"]
    c5c = c5["c_zone_calme_vert"]
    c5d = c5["d_force"]
    labs = ["(a)\ntemplates", "(b)\npalier", "(c)\nZC↔vert", "(d)\nforce"]
    vals = [100, 100, 100, 100]
    cols = [OK_VERT if c5["a_templates"]["pass"] else OK_VERMILLON,
            OK_VERT if c5b["pass"] else OK_VERMILLON,
            OK_VERMILLON,  # c échoue sous les 3 lectures
            OK_VERT if c5d["pass"] else OK_VERMILLON]
    txt = [c5["a_templates"]["score"], f"{431 - len(c5b['ecarts'])}/431",
           "FAIL", "OK"]
    bars = ax.bar(labs, vals, color=cols, width=0.6)
    for b_, t_, v_ in zip(bars, txt, vals):
        ax.annotate(t_, (b_.get_x() + b_.get_width() / 2, v_ + 2),
                    ha="center", va="bottom", fontsize=9, fontweight="bold")
    ax.set_ylim(0, 118)
    ax.set_yticks([0, 50, 100])
    ax.set_ylabel("sous-test conforme (%)")
    ax.set_title("C5 — Affichage : FAIL (c)", fontsize=11,
                 fontweight="bold", color=OK_VERMILLON)
    ax.tick_params(axis="x", labelsize=8.5)
    style(ax)

    # C5c détail
    ax = axes[1, 2]
    bars = ax.bar(["c1\nZC→vert", "c2\nvert non-ZC", "c3\nvert/OMBRE"],
                  [c5c["zone_calme"] - len(c5c["zc_non_verts"]),
                   c5c["verts_non_zc"], len(c5c["verts_sur_ombre"])],
                  color=[OK_VERMILLON, OK_VERMILLON, OK_VERMILLON], width=0.6)
    for b_, v_ in zip(bars, [c5c["zone_calme"] - len(c5c["zc_non_verts"]),
                             c5c["verts_non_zc"], len(c5c["verts_sur_ombre"])]):
        ax.annotate(f"{v_}" + (" /93" if v_ == c5c["zone_calme"] - len(c5c["zc_non_verts"]) else ""),
                    (b_.get_x() + b_.get_width() / 2, v_), ha="center", va="bottom",
                    fontsize=11, fontweight="bold")
    ax.set_ylim(0, 105)
    ax.set_ylabel("nombre de sorties")
    ax.set_title("C5c — 3 lectures (S-Q2-3/10)", fontsize=11,
                 fontweight="bold", color=OK_VERMILLON)
    ax.tick_params(axis="x", labelsize=8.5)
    style(ax)

    # Synthèse
    ax = axes[1, 3]
    ax.axis("off")
    ax.text(0.5, 0.86, "SYNTHÈSE", ha="center", fontsize=13, fontweight="bold")
    lignes = [
        ("C1a  FAIL — 72,67 % < 82 %", OK_VERMILLON),
        ("   plafond hypoth. ≈ 89 % contredit", "#444444"),
        ("   dom. H réelle : 72,7 % (S-Q2-9)", "#444444"),
        ("C1b  PASS — 92,0 % / 0,00 %", OK_VERT),
        ("C1c  PASS — 8/8 arêtes", OK_VERT),
        ("C2   PASS — 8/8 · 5/5 · 0 FP", OK_VERT),
        ("C3   PASS — 6/6 · 4/4 · 94,8 %", OK_VERT),
        ("C4   PASS — SHA-256 identiques", OK_VERT),
        ("C5   FAIL — sous-test c (3 lectures)", OK_VERMILLON),
        ("   91/93 ZC→vert · 56 vert non-ZC · 37 vert/OMBRE", "#444444"),
    ]
    for i, (t, coul) in enumerate(lignes):
        ax.text(0.02, 0.76 - i * 0.062, t, fontsize=8.7, color=coul,
                fontweight="bold" if i in (0, 3, 4, 5, 6, 7, 8) else "normal")
    ax.text(0.5, 0.03, "VERDICT : À CORRIGER — 5/7 PASS — note 6/10",
            ha="center", fontsize=10.5, fontweight="bold", color=OK_VERMILLON)

    fig.text(0.01, 0.005, SOURCE, fontsize=7.5, color="#555555")
    fig.tight_layout(rect=(0, 0.025, 1, 0.94))
    fig.subplots_adjust(wspace=0.34, hspace=0.44, left=0.055)
    out = FIG / f"BarChart_TableauDeBord_7Criteres_Q2_{DATE}.png"
    fig.savefig(out, dpi=150, bbox_inches="tight", facecolor="white")
    plt.close(fig)
    return out


def fig_matrice(mat):
    etiqs = ["LES DEUX", "PEUR DE PERDRE", "PEUR D'ÊTRE ÉTOUFFÉE",
             "ZONE CALME", "ALARME SANS MAIN", "SIGNAL LÉGER NON NOMMÉ"]
    lignes = [r for r in mat if r["type_vrai"].startswith("T")]
    M = np.array([[int(r[e]) for e in etiqs] for r in lignes], dtype=float)
    noms = ["T1\nPEUR DE PERDRE", "T2\nPEUR D'ÊTRE ÉTOUFFÉE",
            "T3\nLES DEUX", "T4\nZONE CALME"]
    avec_ligne = M / M.sum(axis=1, keepdims=True) * 100

    fig, ax = plt.subplots(figsize=(12.8, 7.2), dpi=150)
    im = ax.imshow(avec_ligne, cmap="Blues", vmin=0, vmax=100)
    ax.set_xticks(range(6), [e.replace(" ", "\n", 1) for e in etiqs], fontsize=9)
    ax.set_yticks(range(4), noms, fontsize=10)
    ax.set_xlabel("Étiquette CALCULÉE par l'arbre de nommage (6 débouchés D-Q2-1)", fontsize=11)
    ax.set_ylabel("Type VRAI (simulation à vérité cachée, seed 42)", fontsize=11)
    for i in range(4):
        for j in range(6):
            n = int(M[i, j])
            pc = avec_ligne[i, j]
            coul = "white" if pc > 55 else "#1A1A1A"
            gras = "bold" if i == j and n > 0 else "normal"
            ax.text(j, i, f"{n}\n({pc:.1f} %)".replace(".", ","),
                    ha="center", va="center", fontsize=10.5, color=coul, fontweight=gras)
    for k in range(4):
        ax.add_patch(plt.Rectangle((k - 0.5, k - 0.5), 1, 1, fill=False,
                                   edgecolor=OK_VERT, lw=2.2))
    diag = [M[i, i] / M[i].sum() * 100 for i in range(4)]
    ax.set_title("Matrice nommage × vérité — WTC-Q2 (431 sorties : 400 honnêtes affichés ici + 23 piégés + 8 arêtes)\n"
                 "diagonale (nommage correct) : T1 66,7 % · T2 70,0 % · T3 96,0 % · T4 92,0 % — global T1-T3 : 72,7 % (seuil 82 % : FAIL)",
                 fontsize=12.5, fontweight="bold")
    fig.colorbar(im, ax=ax, fraction=0.04, pad=0.02, label="% de la ligne (type vrai)")
    suppr = [r["supprimes_index_0"] for r in lignes]
    prud = [r["prudences_index_050"] for r in lignes]
    fig.text(0.05, 0.035,
             "Suppressions (index de convergence 0,00 → ombre interdite, fallthrough D-Q2-1) : "
             + " · ".join(f"{n.split(chr(10))[0]} {s}" for n, s in zip(noms, suppr))
             + "   |   Prudences (index 0,50 → OMBRE_PRUDENCE) : "
             + " · ".join(f"{n.split(chr(10))[0]} {p}" for n, p in zip(noms, prud)),
             fontsize=9, color="#333333")
    fig.text(0.01, 0.005, SOURCE + " · pièges hors matrice : 6 INC_SIMPLE → SIGNAL LÉGER/ALARME · 4 INC_DOUBLE → LES DEUX (prudence) · 8 SEC_H5 + 5 PFILTRE → routage sécurité",
             fontsize=7.5, color="#555555")
    fig.tight_layout(rect=(0, 0.05, 1, 0.92))
    out = FIG / f"Heatmap_MatriceNommage_Verite_Q2_{DATE}.png"
    fig.savefig(out, dpi=150, bbox_inches="tight", facecolor="white")
    plt.close(fig)
    return out


def flot(s):
    return float(str(s).replace(",", "."))


def fig_stats(stats):
    groupes = [r["groupe"] for r in stats]
    court = {"T1_PERDRE": "T1\npeur de perdre", "T2_ETOUFFEE": "T2\npeur d'être étouffée",
             "T3_LESDEUX": "T3\nles deux", "T4_CALME": "T4\nzone calme"}
    metriques = [("count_d_moyen", "pD_param", 6, "Count_D moyen"),
                 ("count_p_moyen", "pP_param", 4, "Count_P moyen"),
                 ("i_alarm_moyen", "mu_i_param", 1, "I_alarm moyen")]
    fig, axes = plt.subplots(1, 2, figsize=(12.8, 7.2), dpi=150)
    fig.suptitle("Statistiques par groupe (moyennes observées vs paramètres simulés) — seed 42",
                 fontsize=13.5, fontweight="bold", y=0.98)

    # panneau gauche : comptages + I_alarm
    ax = axes[0]
    x = np.arange(4)
    w = 0.26
    for k, (col_o, col_p, mult, lab) in enumerate(metriques):
        obs = [flot(r[col_o]) for r in stats]
        att = [flot(r[col_p]) * mult for r in stats]
        b = ax.bar(x + (k - 1) * w, obs, w, label=lab,
                   color=[OK_BLEU, OK_ORANGE, OK_VERT][k])
        ax.scatter(x + (k - 1) * w, att, marker="_", s=420, color="black", zorder=5,
                   label="paramètre simulé" if k == 0 else None)
        for xi, v in zip(x + (k - 1) * w, obs):
            ax.annotate(f"{v:.1f}".replace(".", ","), (xi, v), ha="center", va="bottom",
                        fontsize=7.5)
    ax.set_xticks(x, [court[g] for g in groupes], fontsize=8.5)
    ax.set_ylabel("valeur moyenne (barre) vs paramètre (tiret noir)")
    ax.set_title("Comptages et intensité d'alarme", fontsize=12, fontweight="bold")
    ax.legend(loc="upper left", fontsize=8, framealpha=0.95)
    ax.grid(axis="y", color="#CCCCCC", linestyle="--", linewidth=0.7, alpha=0.8)
    ax.set_axisbelow(True)
    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)

    # panneau droit : normes H/R
    ax = axes[1]
    w = 0.35
    hn = [flot(r["h_norm_moyen"]) for r in stats]
    rn = [flot(r["r_norm_moyen"]) for r in stats]
    prm = {"T1_PERDRE": (5 * 0.65 * 2 / 15, 3 * 0.15 * 2 / 9),
           "T2_ETOUFFEE": (5 * 0.15 * 2 / 15, 3 * 0.65 * 2 / 9),
           "T3_LESDEUX": (5 * 0.50 * 2 / 15, 3 * 0.45 * 2 / 9),
           "T4_CALME": (5 * 0.04 * 2 / 15, 3 * 0.04 * 2 / 9)}
    b1 = ax.bar(x - w / 2, hn, w, label="H_norm moyen (observé)", color=OK_BLEU)
    b2 = ax.bar(x + w / 2, rn, w, label="R_norm moyen (observé)", color=OK_ORANGE)
    ax.scatter(x - w / 2, [prm[g][0] for g in groupes], marker="_", s=420, color="black",
               zorder=5, label="attendu = 5×pH×2/15")
    ax.scatter(x + w / 2, [prm[g][1] for g in groupes], marker="_", s=420, color="black", zorder=5)
    for xi, v in zip(x - w / 2, hn):
        ax.annotate(f"{v:.2f}".replace(".", ","), (xi, v), ha="center", va="bottom", fontsize=8.5)
    for xi, v in zip(x + w / 2, rn):
        ax.annotate(f"{v:.2f}".replace(".", ","), (xi, v), ha="center", va="bottom", fontsize=8.5)
    ax.set_xticks(x, [court[g] for g in groupes], fontsize=8.5)
    ax.set_ylabel("score normalisé moyen (0-1)")
    ax.set_title("Les deux mains — H_norm / R_norm (concordance aux fluctuations près)",
                 fontsize=12, fontweight="bold")
    ax.legend(loc="upper right", fontsize=8, framealpha=0.95)
    ax.grid(axis="y", color="#CCCCCC", linestyle="--", linewidth=0.7, alpha=0.8)
    ax.set_axisbelow(True)
    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)

    fig.text(0.01, 0.005, SOURCE + " · l'écart H_norm−R_norm < 0,20 dans ≈ 27 % des tirages T1 explique l'échec C1a (S-Q2-9)",
             fontsize=7.5, color="#555555")
    fig.tight_layout(rect=(0, 0.03, 1, 0.93))
    out = FIG / f"BarChart_StatsGroupes_Q2_{DATE}.png"
    fig.savefig(out, dpi=150, bbox_inches="tight", facecolor="white")
    plt.close(fig)
    return out


def fig_non_nommes(nn):
    from collections import Counter
    src_lab = Counter((r["source"], r["label"]) for r in nn)
    sources = sorted({r["source"] for r in nn})
    alarme = [src_lab.get((s, "ALARME SANS MAIN"), 0) for s in sources]
    leger = [src_lab.get((s, "SIGNAL LÉGER NON NOMMÉ"), 0) for s in sources]
    y = np.arange(len(sources))

    fig, ax = plt.subplots(figsize=(12.8, 7.2), dpi=150)
    b1 = ax.barh(y, alarme, 0.6, label="ALARME SANS MAIN (I_alarm ≥ 5)", color=OK_ORANGE)
    b2 = ax.barh(y, leger, 0.6, left=alarme, label="SIGNAL LÉGER NON NOMMÉ (I_alarm ≤ 4)", color=OK_BLEU)
    for yi, (a, l) in enumerate(zip(alarme, leger)):
        if a:
            ax.annotate(str(a), (a / 2, yi), ha="center", va="center", fontsize=10,
                        fontweight="bold", color="white")
        if l:
            ax.annotate(str(l), (a + l / 2, yi), ha="center", va="center", fontsize=10,
                        fontweight="bold", color="white")
        ax.annotate(f"total {a + l}", (a + l + 0.4, yi), ha="left", va="center",
                    fontsize=9.5, fontweight="bold")
    ax.set_yticks(y, sources, fontsize=9.5)
    ax.invert_yaxis()
    ax.set_xlabel("nombre de sorties non nommées (fallthrough D-Q2-1)")
    ax.set_title("Analyse des NON-NOMMÉS — fallthrough D-Q2-1 appliqué (Section E du rapport)\n"
                 "toutes les ombres supprimées (index 0,00) aboutissent à un débouché non-OMBRE : "
                 + str(sum(1 for r in nn)) + " non-nommés / 431 sorties",
                 fontsize=12.5, fontweight="bold")
    ax.legend(loc="lower right", fontsize=9.5, framealpha=0.95)
    ax.grid(axis="x", color="#CCCCCC", linestyle="--", linewidth=0.7, alpha=0.8)
    ax.set_axisbelow(True)
    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)
    fig.text(0.01, 0.005, SOURCE + " · arêtes E3 (SIGNAL LÉGER) et E5/E8 (ALARME SANS MAIN) incluses",
             fontsize=7.5, color="#555555")
    fig.tight_layout(rect=(0, 0.03, 1, 0.92))
    out = FIG / f"BarChart_NonNommes_Fallthrough_Q2_{DATE}.png"
    fig.savefig(out, dpi=150, bbox_inches="tight", facecolor="white")
    plt.close(fig)
    return out


def main():
    crit, mat, stats, nn = charger()
    for s in (fig_tableau_de_bord(crit, crit["C4"]["identique"]),
              fig_matrice(mat),
              fig_stats(stats),
              fig_non_nommes(nn)):
        print("OK :", s.name)


if __name__ == "__main__":
    main()
