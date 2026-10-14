# -*- coding: utf-8 -*-
"""
Visualisations de synthèse du programme WAIRYU Thérapie Couple
Source : « programme wairyu couple » (document de référence, 12 parties)
Sortie : PNG 1920x1080, 150 DPI, palette Okabe-Ito, libellés français
"""
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import os

plt.rcParams["font.sans-serif"] = ["DejaVu Sans", "Arial"]
plt.rcParams["font.family"] = "sans-serif"
plt.rcParams["axes.unicode_minus"] = False

OUT = "/home/z/my-project/download"
os.makedirs(OUT, exist_ok=True)

SOURCE = ("Source : « programme wairyu couple » — document de référence du programme WTC, "
          "14/10/2026")

# Palette Template 07 (famille bleu 215°) + Okabe-Ito pour les blocs
BLEU_F = "#1a4a7a"
ACCENT = "#2d7ab3"
LUMINEUX = "#4da8da"
MUTED = "#5a7a96"
BORDER = "#c0d0e2"
PALETTE6 = ["#0072B2", "#56B4E9", "#009E73", "#E69F00", "#CC79A7", "#D55E00"]


def ajouter_source(fig):
    fig.text(0.01, 0.012, SOURCE, fontsize=7.5, color="#777777", ha="left")


# ==================================================================
# GRAPHIQUE A — Les 26 dimensions par bloc (donut)
# ==================================================================
def chart_dimensions():
    data = [
        ("Héritage", 6, "Infantile, Parentale, Expérientielle,\nCulturelle, Sexuelle, Religieuse"),
        ("Psychologique", 4, "Personnalité, Attachement,\nÉmotionnelle, Santé mentale"),
        ("Relationnel", 4, "Communicationnelle, Pouvoir,\nRôles de genre, Attentes"),
        ("Social-matériel", 4, "Économique, Professionnelle,\nBelle-famille, Sociale"),
        ("Cycle de vie", 4, "Parentalité, Cycle de vie,\nGénérationnelle, Santé somatique"),
        ("Sociétal", 4, "Morale/éthique, Politique/idéologique,\nNumérique, Spatiale"),
    ]
    labels = [d[0] for d in data]
    vals = [d[1] for d in data]
    total = sum(vals)

    fig, (ax, ax_side) = plt.subplots(1, 2, figsize=(12.8, 7.2), dpi=150,
                                      gridspec_kw={"width_ratios": [1.05, 1.0]})
    wedges, _, autotexts = ax.pie(
        vals, colors=PALETTE6, startangle=90, counterclock=False,
        autopct=lambda p: f"{int(round(p * total / 100))}",
        pctdistance=0.78, wedgeprops=dict(width=0.42, edgecolor="white", linewidth=2))
    for t in autotexts:
        t.set_fontsize(13)
        t.set_fontweight("bold")
        t.set_color("white")
    ax.text(0, 0.08, "26", ha="center", va="center", fontsize=44,
            fontweight="bold", color=BLEU_F)
    ax.text(0, -0.22, "dimensions\nanalysées", ha="center", va="center",
            fontsize=12, color=MUTED)
    ax.set_title("Les 26 dimensions d'analyse, réparties en 6 blocs",
                 fontsize=15.5, fontweight="bold", pad=18, loc="left")

    # Légende détaillée à droite (noms des dimensions par bloc)
    ax_side.axis("off")
    y = 0.97
    for (label, v, detail), color in zip(data, PALETTE6):
        ax_side.scatter(0.02, y, s=140, color=color, marker="o", clip_on=False)
        ax_side.text(0.07, y, f"{label} — {v} dimension{'s' if v > 1 else ''}",
                     fontsize=12, fontweight="bold", color=BLEU_F, va="center")
        ax_side.text(0.07, y - 0.052, detail.replace("\n", " "),
                     fontsize=9.5, color=MUTED, va="center")
        y -= 0.155
    ax_side.set_xlim(0, 1)
    ax_side.set_ylim(0, 1)

    fig.subplots_adjust(left=0.02, right=0.98, top=0.86, bottom=0.10)
    ajouter_source(fig)
    fig.savefig(os.path.join(OUT, "DonutChart_26Dimensions_ParBloc_2026-10-14.png"),
                dpi=150, bbox_inches="tight", facecolor="white")
    plt.close(fig)


# ==================================================================
# GRAPHIQUE B — Architecture des quêtes (barres horizontales)
# ==================================================================
def chart_quetes():
    data = [
        ("Dimensions majeures", 16, 5, 80, "Q1 carte · Q2 ombre · Q3 lumière · Q4 croisement · Q5 pas"),
        ("Dimensions standard", 6, 4, 24, "4 quêtes par dimension (sans l'un des 5 volets)"),
        ("Extensions", 4, 3, 12, "3 quêtes par dimension d'extension"),
    ]
    labels = [d[0] for d in data]
    counts = [d[3] for d in data]
    colors = [BLEU_F, ACCENT, LUMINEUX]

    fig, ax = plt.subplots(figsize=(12.8, 7.2), dpi=150)
    y = np.arange(len(labels))[::-1]
    bars = ax.barh(y, counts, height=0.55, color=colors, zorder=3)

    for yi, (name, ndims, nq, total, detail) in zip(y, data):
        ax.text(total + 1.5, yi + 0.13, f"{total} quêtes",
                va="center", ha="left", fontsize=12.5, fontweight="bold", color="#333333")
        ax.text(total + 1.5, yi - 0.14, f"{ndims} dimensions × {nq} quêtes — {detail}",
                va="center", ha="left", fontsize=8.8, color=MUTED)

    ax.set_yticks(y)
    ax.set_yticklabels(labels, fontsize=12)
    ax.set_xlim(0, 132)
    ax.set_xlabel("Nombre de quêtes", fontsize=11.5)
    ax.set_title("Architecture des ≈ 110 quêtes du programme WTC",
                 fontsize=15.5, fontweight="bold", pad=42, loc="left")
    ax.text(0, 1.055, "Gabarit universel (résultat : zone d'ombre + zone de force, 3 paliers vert/ambre/rouge, "
                      "règle anti-fabrication) · 4 filtres par question",
            transform=ax.transAxes, fontsize=9.5, color="#555555")
    ax.text(81, -0.62, "Somme des formats : 116 quêtes déclarées — le document de référence annonce « Total ≈ 110 »",
            fontsize=8.2, color="#b05a2a", ha="left")

    ax.xaxis.grid(True, linestyle="--", linewidth=0.7, color="#D9D9D9", zorder=0)
    ax.set_axisbelow(True)
    for spine in ["top", "right", "left"]:
        ax.spines[spine].set_visible(False)
    ax.spines["bottom"].set_color("#BBBBBB")

    fig.subplots_adjust(left=0.19, right=0.97, top=0.85, bottom=0.14)
    ajouter_source(fig)
    fig.savefig(os.path.join(OUT, "BarChart_Quetes_Architecture_2026-10-14.png"),
                dpi=150, bbox_inches="tight", facecolor="white")
    plt.close(fig)


if __name__ == "__main__":
    chart_dimensions()
    print("Chart A OK — 26 dimensions par bloc")
    chart_quetes()
    print("Chart B OK — architecture des quêtes")
