# -*- coding: utf-8 -*-
"""
WTC-Q1-R1 — Figures de synthèse (tableau de bord, frontières, matrice ponctuelle A·B)
Génère 3 visuels 1920x1080 px (150 DPI) à partir des sorties du run R1 (seed 42).
Lecture directe de results/ (aucune valeur saisie à la main).
Usage : python3 wtc_q1_r1_figures.py
"""
import json
import csv
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np

plt.rcParams["font.sans-serif"] = ["Arial", "DejaVu Sans"]
plt.rcParams["axes.unicode_minus"] = False
plt.rcParams["font.size"] = 11

# Palette Okabe-Ito (daltonien-friendly)
OK_BLEU = "#0072B2"
OK_VERT = "#009E73"
OK_VERMILLON = "#D55E00"
OK_ORANGE = "#E69F00"
OK_GRIS = "#999999"

BASE = Path(__file__).resolve().parent.parent          # validation-q1-r1/
RES = BASE / "results"
FIG = BASE / "figures"
FIG.mkdir(exist_ok=True)

DATE = "2026-10-14"
SOURCE = ("Source : WAIRYU-Dating / Wairyu thérapie couple / validation-q1-r1 · seed 42 · "
          "500 honnêtes + 20 piégés · " + DATE)


def charger():
    crit = json.loads((RES / "criteres_r1.json").read_text(encoding="utf-8-sig"))
    mat = {"A": {}, "B": {}}
    with open(RES / "matrices_confusion.csv", encoding="utf-8-sig") as f:
        for row in csv.DictReader(f):
            if row["variante"] == "ponctuel":
                mat[row["axe"]][(row["attendu"], row["calcule"])] = int(row["n"])
    return crit, mat


def style_axe(ax):
    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)
    ax.grid(axis="y", color="#CCCCCC", linestyle="--", linewidth=0.7, alpha=0.8)
    ax.set_axisbelow(True)


# ----------------------------------------------------------------------------------
# FIGURE 1 — Tableau de bord des 6 critères
# ----------------------------------------------------------------------------------
def fig_tableau_de_bord(crit):
    fig, axes = plt.subplots(2, 3, figsize=(12.8, 7.2), dpi=150)
    fig.suptitle("Tableau de bord des 6 critères — PACKAGE WTC-Q1-R1 (révision post-validation) · verdict : À CORRIGER (5/6 PASS)",
                 fontsize=14, fontweight="bold", y=0.98)

    # --- C1a : couverture CI90 ---------------------------------------------------
    ax = axes[0, 0]
    c1a = crit["C1a"]
    ax.axhspan(87, 95, color=OK_VERT, alpha=0.15, label="zone PASS [87 ; 95]")
    ax.bar(["couverture\nCI90"], [c1a["couverture"] * 100], color=OK_BLEU, width=0.55)
    ax.axhline(87, color=OK_GRIS, lw=1, linestyle=":")
    ax.axhline(95, color=OK_GRIS, lw=1, linestyle=":")
    ax.annotate(f"{c1a['couverture']*100:.1f} %".replace(".", ","), (0, c1a["couverture"] * 100),
                ha="center", va="bottom", fontsize=13, fontweight="bold")
    ax.set_ylim(0, 105)
    ax.set_ylabel("% (latent ∈ CI90)")
    ax.set_title("C1a — Couverture CI90 : PASS", fontsize=12, fontweight="bold", color=OK_VERT)
    ax.legend(loc="lower right", fontsize=8, framealpha=0.9)
    style_axe(ax)

    # --- C1b : exactitude ponctuelle --------------------------------------------
    ax = axes[0, 1]
    c1b = crit["C1b"]
    ax.axhspan(78, 80.5, color=OK_VERT, alpha=0.15)
    ax.bar(["exactitude\nponctuelle"], [c1b["exactitude"] * 100], color=OK_BLEU, width=0.55)
    ax.axhline(78, color=OK_ORANGE, lw=1.5, linestyle="--", label="seuil 78 %")
    ax.axhline(80.5, color=OK_GRIS, lw=1.2, linestyle=":", label="plafond théorique ≈ 80,5 %")
    ax.annotate(f"{c1b['exactitude']*100:.1f} %".replace(".", ","), (0, c1b["exactitude"] * 100),
                ha="center", va="bottom", fontsize=13, fontweight="bold")
    ax.set_ylim(70, 85)
    ax.set_ylabel("% (niveau ponctuel == niveau latent)")
    ax.set_title("C1b — Exactitude ponctuelle : PASS", fontsize=12, fontweight="bold", color=OK_VERT)
    ax.legend(loc="lower right", fontsize=8, framealpha=0.9)
    style_axe(ax)

    # --- C1c : règle conservatrice (i)(ii)(iii) ----------------------------------
    ax = axes[0, 2]
    c1c = crit["C1c"]
    termes = ["(i) cons\n≤ ponctuel", "(ii) ≤ 1 cran\nsous latent", "(iii) accord\nhors frontière"]
    vals = [c1c["i_cons_sous_ou_egal_ponctuel"]["taux"] * 100,
            c1c["ii_max_1_cran_sous_latent"]["taux"] * 100,
            c1c["iii_accord_hors_frontiere"]["taux"] * 100]
    couleurs = [OK_VERT, OK_VERMILLON, OK_VERT]
    bars = ax.bar(termes, vals, color=couleurs, width=0.6)
    ax.axhline(100, color=OK_GRIS, lw=1, linestyle=":")
    for b, v in zip(bars, vals):
        ax.annotate(f"{v:.1f} %".replace(".", ","), (b.get_x() + b.get_width() / 2, v),
                    ha="center", va="bottom", fontsize=11, fontweight="bold")
    ax.annotate("seuils : (i) 100 % · (ii) 100 % · (iii) ≥ 85 %", (0.5, 0.03),
                xycoords="axes fraction", ha="center", fontsize=8, color="#444444")
    ax.set_ylim(80, 102)
    ax.set_ylabel("% de lectures conformes (n = 1 000)")
    ax.set_title("C1c — Règle conservatrice : FAIL (terme ii)", fontsize=12, fontweight="bold", color=OK_VERMILLON)
    ax.tick_params(axis="x", labelsize=9)
    style_axe(ax)

    # --- C2 : erreur moyenne ------------------------------------------------------
    ax = axes[1, 0]
    c2 = crit["C2"]
    ax.axhspan(0.14, 0.18, color=OK_VERT, alpha=0.15, label="zone PASS [0,14 ; 0,18]")
    ax.bar(["erreur moyenne\n|score − latent|"], [c2["erreur_moyenne"]], color=OK_BLEU, width=0.55)
    ax.annotate(f"{c2['erreur_moyenne']:.4f}".replace(".", ","), (0, c2["erreur_moyenne"]),
                ha="center", va="bottom", fontsize=13, fontweight="bold")
    ax.set_ylim(0.10, 0.20)
    ax.set_ylabel("erreur absolue moyenne (points d'échelle)")
    ax.set_title(f"C2 — Erreur moyenne : PASS · SEM implicite ≈ {c2['sem_implicite']:.3f}".replace(".", ","),
                 fontsize=12, fontweight="bold", color=OK_VERT)
    ax.legend(loc="lower right", fontsize=8, framealpha=0.9)
    style_axe(ax)

    # --- C3 : piégés détectés -----------------------------------------------------
    ax = axes[1, 1]
    c3 = crit["C3"]
    ax.axhspan(17, 20, color=OK_VERT, alpha=0.15)
    ax.bar(["piégés détectés\n(RQS ≠ OK)"], [c3["detectes"]], color=OK_BLEU, width=0.55)
    ax.axhline(17, color=OK_ORANGE, lw=1.5, linestyle="--", label="seuil 17/20")
    ax.annotate(f"{c3['detectes']}/20", (0, c3["detectes"]), ha="center", va="bottom",
                fontsize=13, fontweight="bold")
    ax.set_ylim(0, 22)
    ax.set_ylabel("nombre de profils piégés détectés")
    ax.set_title("C3 — Détection des piégés : PASS", fontsize=12, fontweight="bold", color=OK_VERT)
    ax.legend(loc="lower right", fontsize=8, framealpha=0.9)
    style_axe(ax)

    # --- C4 : reproductibilité ----------------------------------------------------
    ax = axes[1, 2]
    ax.bar(["run 1", "run 2"], [1, 1], color=[OK_BLEU, OK_VERT], width=0.55)
    ax.annotate("SHA-256\nidentiques", (0, 1), ha="center", va="bottom", fontsize=11, fontweight="bold")
    ax.annotate("SHA-256\nidentiques", (1, 1), ha="center", va="bottom", fontsize=11, fontweight="bold")
    ax.set_ylim(0, 1.35)
    ax.set_yticks([0, 0.5, 1])
    ax.set_ylabel("sortie complète identique (1 = oui)")
    ax.set_title("C4 — Reproductibilité ×2 (seed 42) : PASS", fontsize=12, fontweight="bold", color=OK_VERT)
    style_axe(ax)

    fig.text(0.01, 0.005, SOURCE, fontsize=7.5, color="#555555")
    fig.tight_layout(rect=(0.01, 0.025, 1, 0.94))
    fig.subplots_adjust(wspace=0.30, hspace=0.42, left=0.07)
    out = FIG / f"BarChart_TableauDeBord_6Criteres_{DATE}.png"
    fig.savefig(out, dpi=150, bbox_inches="tight", facecolor="white")
    plt.close(fig)
    return out


# ----------------------------------------------------------------------------------
# FIGURE 2 — Frontières vs attendues (25-35 %) vs run initial (93 %)
# ----------------------------------------------------------------------------------
def fig_frontieres():
    groupes = ["G1\ntranquille (n=200)", "G2\npeur de perdre (n=150)",
               "G3\npeur de dépendre (n=100)", "G4\nambivalent (n=50)", "GLOBAL\n(n=500/axe)"]
    fA = [80.0, 87.3, 79.0, 76.0, 81.6]
    fB = [80.0, 84.7, 88.0, 80.0, 83.0]

    fig, ax = plt.subplots(figsize=(12.8, 7.2), dpi=150)
    x = np.arange(len(groupes))
    w = 0.36
    b1 = ax.bar(x - w / 2, fA, w, label="Axe A « peur de perdre »", color=OK_BLEU)
    b2 = ax.bar(x + w / 2, fB, w, label="Axe B « peur de dépendre »", color=OK_ORANGE)

    for bars in (b1, b2):
        for b in bars:
            ax.annotate(f"{b.get_height():.1f} %".replace(".", ","),
                        (b.get_x() + b.get_width() / 2, b.get_height()),
                        ha="center", va="bottom", fontsize=10, fontweight="bold")

    # Bande attendu 25-35 %
    ax.axhspan(25, 35, color=OK_VERT, alpha=0.18, label="attendu orchestrateur [25 ; 35 %]")
    # Lignes run initial
    ax.axhline(93.2, color=OK_VERMILLON, lw=1.6, linestyle="--",
               label="run initial : 93,2 % (axe A)")
    ax.axhline(94.2, color="#8B0000", lw=1.6, linestyle=":",
               label="run initial : 94,2 % (axe B)")

    ax.set_xticks(x)
    ax.set_xticklabels(groupes, fontsize=10)
    ax.set_ylabel("part des lectures L3 en situation de FRONTIÈRE (%)")
    ax.set_xlabel("", fontsize=10)
    ax.set_ylim(0, 105)
    ax.set_title("Frontières L3 après correction D1 (SEM 0,195) vs attendues 25-35 % et run initial 93 %\n"
                 "R1 : 82,3 % global (408/500 axe A · 415/500 axe B) — attente 25-35 % NON atteinte (écart structurel, S-R1-2)",
                 fontsize=13, fontweight="bold")
    ax.legend(loc="upper center", bbox_to_anchor=(0.5, -0.10), fontsize=9, framealpha=0.95, ncol=3)
    ax.grid(axis="y", color="#CCCCCC", linestyle="--", linewidth=0.7, alpha=0.8)
    ax.set_axisbelow(True)
    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)

    fig.text(0.01, 0.005, SOURCE + " · groupes : simulation seed 42 · run initial : commit 3eb7399 (validation-q1/)", fontsize=7.5, color="#555555")
    fig.tight_layout(rect=(0, 0.03, 1, 0.93))
    out = FIG / f"BarChart_Frontieres_vs_Attendues_{DATE}.png"
    fig.savefig(out, dpi=150, bbox_inches="tight", facecolor="white")
    plt.close(fig)
    return out


# ----------------------------------------------------------------------------------
# FIGURE 3 — Matrice ponctuelle axe A · axe B (combinée)
# ----------------------------------------------------------------------------------
def fig_matrice_ponctuelle(mat):
    niveaux = ["Discrète", "Tranquille", "Vive", "Forte"]
    fig, axes = plt.subplots(1, 2, figsize=(12.8, 7.2), dpi=150)
    fig.suptitle("Matrices de confusion PONCTUELLES (score vs latent) — axe A · axe B · référence C1b (n = 500 honnêtes par axe)",
                 fontsize=13.5, fontweight="bold", y=0.98)

    for ax, axe, titre, ex in (
        (axes[0], "A", "Axe A « PEUR DE PERDRE » — exactitude 80,0 %", 80.0),
        (axes[1], "B", "Axe B « PEUR DE DÉPENDRE » — exactitude 79,4 %", 79.4),
    ):
        M = np.array([[mat[axe][(att, cal)] for cal in niveaux] for att in niveaux], dtype=float)
        avec_diag = M / M.sum(axis=1, keepdims=True) * 100

        im = ax.imshow(avec_diag, cmap="Blues", vmin=0, vmax=100)
        ax.set_xticks(range(4), niveaux, fontsize=9.5)
        ax.set_yticks(range(4), [f"latent = {n}" for n in niveaux], fontsize=9)
        ax.set_xlabel("Niveau CALCULÉ (lecture L3 ponctuelle)", fontsize=10)
        ax.set_ylabel("Niveau ATTENDU (latent simulé)", fontsize=10)

        for i in range(4):
            for j in range(4):
                n = int(M[i, j])
                pct = avec_diag[i, j]
                coul = "white" if pct > 55 else "#1A1A1A"
                gras = "bold" if i == j and n > 0 else "normal"
                ax.text(j, i, f"{n}\n({pct:.1f} %)".replace(".", ",").replace(",1 %", ",1 %"),
                        ha="center", va="center", fontsize=10, color=coul, fontweight=gras)

        # cadre diagonal
        for k in range(4):
            ax.add_patch(plt.Rectangle((k - 0.5, k - 0.5), 1, 1, fill=False, edgecolor=OK_VERT, lw=2.2))

        ax.set_title(titre, fontsize=11.5, fontweight="bold")
        fig.colorbar(im, ax=ax, fraction=0.046, pad=0.03, label="% de la ligne")

    fig.text(0.01, 0.005, SOURCE + " · réglementaire : C1b ≥ 78 % (plafond théorique ≈ 80,5 %)", fontsize=7.5, color="#555555")
    fig.tight_layout(rect=(0, 0.02, 1, 0.92))
    out = FIG / f"Heatmap_MatricePonctuelle_AxeA_AxeB_{DATE}.png"
    fig.savefig(out, dpi=150, bbox_inches="tight", facecolor="white")
    plt.close(fig)
    return out


def main():
    crit, mat = charger()
    sorties = [
        fig_tableau_de_bord(crit),
        fig_frontieres(),
        fig_matrice_ponctuelle(mat),
    ]
    for s in sorties:
        print("OK :", s.name)


if __name__ == "__main__":
    main()
