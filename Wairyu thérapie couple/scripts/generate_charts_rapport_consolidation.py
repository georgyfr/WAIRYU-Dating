# -*- coding: utf-8 -*-
"""
Figure du rapport de consolidation v2 — WAIRYU Thérapie Couple.
1920×1080 px exact (12,8×7,2 po @150 DPI), palette Okabe-Ito, français.
Toutes les valeurs proviennent de la Partie 13.2 du document de référence v2
(« programme wairyu couple v2.txt ») : verdicts par cycle et fautes de
spécification d'orchestrateur listées. Aucune valeur saisie hors source.
"""
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

plt.rcParams["font.sans-serif"] = ["DejaVu Sans"]
plt.rcParams["axes.unicode_minus"] = False

# Okabe-Ito (colorblind-friendly)
BLEU, VERT, VERMILLON, GRIS = "#0072B2", "#009E73", "#D55E00", "#999999"
TXT = "#142840"

fig, axes = plt.subplots(1, 2, figsize=(12.8, 7.2), dpi=150)
fig.subplots_adjust(left=0.215, right=0.965, top=0.845, bottom=0.115,
                    wspace=0.34)
fig.suptitle("WAIRYU — Rapport de consolidation v2 : du verdict initial aux échelles validées",
             fontsize=14, fontweight="bold", color=TXT, y=0.955)

# =====================================================================
# A — Critères satisfaits, du verdict initial à l'arbitrage final
# =====================================================================
ax = axes[0]
etapes = [
    "WTC-Q1 · RIO-01\n(verdict initial)",
    "WTC-Q1-R1 · RIO-01\n(révision D1-D5)",
    "Arbitrage D6/D7\nRIO-01 VALIDÉE",
    "WTC-Q2 · RIO-02\n(verdict initial)",
    "WTC-Q2-R1 · RIO-02\n(révision D-Q2-A à F)",
    "Arbitrage D-Q2-G/H\nRIO-02 VALIDÉE",
]
frac = ["2/4", "5/6", "6/6", "5/7", "5/7", "7/7"]
pct = [2/4, 5/6, 6/6, 5/7, 5/7, 7/7]
cols = [BLEU, BLEU, VERT, BLEU, BLEU, VERT]
ypos = range(len(etapes))[::-1]
bars = ax.barh(list(ypos), [p * 100 for p in pct], color=cols,
               height=0.62, edgecolor="white")
for y, f, p in zip(ypos, frac, pct):
    ax.text(p * 100 + 1.8, y, f, va="center", ha="left",
            fontsize=9.5, fontweight="bold", color=TXT)
ax.set_yticks(list(ypos))
ax.set_yticklabels(etapes, fontsize=8.2)
ax.set_xlim(0, 118)
ax.set_xticks([0, 25, 50, 75, 100])
ax.set_xlabel("Critères satisfaits (%)", fontsize=8.5)
ax.set_title("A · Critères satisfaits, du verdict initial à l'arbitrage final",
             fontsize=10, fontweight="bold", loc="left", color=TXT)
ax.text(0.0, 1.045, "Bleu = verdict À CORRIGER · Vert = VALIDÉE (arbitrage orchestrateur)",
        transform=ax.transAxes, fontsize=7.0, color="#555555", va="bottom")
ax.grid(axis="x", linestyle="--", linewidth=0.5, color="#cccccc", alpha=0.7)
ax.set_axisbelow(True)
for s in ("top", "right"):
    ax.spines[s].set_visible(False)

# =====================================================================
# B — Fautes de spécification d'orchestrateur révélées par cycle
# =====================================================================
ax = axes[1]
cycles_b = ["WTC-Q1", "WTC-Q1-R1", "WTC-Q2", "WTC-Q2-R1"]
fautes = [3, 3, 4, 2]
bars = ax.bar(range(4), fautes, color=VERMILLON, width=0.58, edgecolor="white")
for b, n in zip(bars, fautes):
    ax.text(b.get_x() + b.get_width() / 2, b.get_height() + 0.09, str(n),
            ha="center", va="bottom", fontsize=10.5, fontweight="bold", color=TXT)
ax.set_xticks(range(4))
ax.set_xticklabels(cycles_b, fontsize=8.6)
ax.set_ylim(0, 5.2)
ax.set_yticks([0, 1, 2, 3, 4, 5])
ax.set_ylabel("Fautes listées en Partie 13.2 (nombre)", fontsize=8.5)
ax.set_title("B · Fautes de spécification révélées par cycle",
             fontsize=10, fontweight="bold", loc="left", color=TXT)
ax.text(0.02, 0.965,
        "12 fautes listées au total — toutes dans la spécification,\n"
        "aucune dans l'implémentation de Data Insight",
        transform=ax.transAxes, fontsize=7.2, color="#555555", va="top")
ax.grid(axis="y", linestyle="--", linewidth=0.5, color="#cccccc", alpha=0.7)
ax.set_axisbelow(True)
for s in ("top", "right"):
    ax.spines[s].set_visible(False)

# Source (bas gauche, petite police)
fig.text(0.012, 0.018,
         "Source : « programme wairyu couple » v2 consolidée, Partie 13.2 (cycles WTC-Q1 → Q2-R1, "
         "commits 3eb7399 · 1426f6e · 0c3aaab · 78752d4) — Data Insight, 15/10/2026",
         fontsize=6.8, color="#666666")

out = "visualisations/BarChart_RapportConsolidation_2026-10-15.png"
plt.savefig(out, dpi=150)
print("OK ->", out)
