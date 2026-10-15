# -*- coding: utf-8 -*-
"""
Dashboard « État de la validation » — WAIRYU Thérapie Couple (v2 consolidée, Partie 13).
1920×1080 px exact (12,8×7,2 po @150 DPI), palette Okabe-Ito, français.
Toutes les valeurs proviennent du document de référence v2 (Partie 13)
et des worklogs des packages WTC-Q1 → Q2-R1 (aucune valeur saisie à la main hors source).
"""
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np

plt.rcParams["font.sans-serif"] = ["DejaVu Sans"]
plt.rcParams["axes.unicode_minus"] = False

# Okabe-Ito (colorblind-friendly)
BLEU, VERT, VERMILLON, GRIS = "#0072B2", "#009E73", "#D55E00", "#999999"
TXT = "#142840"

fig, axes = plt.subplots(2, 2, figsize=(12.8, 7.2), dpi=150)
fig.subplots_adjust(left=0.145, right=0.985, top=0.885, bottom=0.13,
                    hspace=0.42, wspace=0.24)
fig.suptitle("WAIRYU — L'état de la validation : quatre cycles, deux échelles validées",
             fontsize=13.5, fontweight="bold", color=TXT, y=0.972)

# =====================================================================
# A — Critères satisfaits par cycle (verdict publié)
# =====================================================================
ax = axes[0, 0]
cycles = ["WTC-Q1", "WTC-Q1-R1", "WTC-Q2", "WTC-Q2-R1", "Q2-R1 arbitré"]
pct = [2 / 4, 5 / 6, 5 / 7, 5 / 7, 7 / 7]
frac = ["2/4", "5/6", "5/7", "5/7", "7/7"]
cols = [BLEU, BLEU, BLEU, BLEU, VERT]
bars = ax.bar(range(5), [p * 100 for p in pct], color=cols, width=0.6, edgecolor="white")
for b, f in zip(bars, frac):
    ax.text(b.get_x() + b.get_width() / 2, b.get_height() + 2.0, f,
            ha="center", va="bottom", fontsize=8.2, fontweight="bold", color=TXT)
ax.set_xticks(range(5))
ax.set_xticklabels(cycles, fontsize=7.6)
ax.set_ylim(0, 116)
ax.set_yticks([0, 25, 50, 75, 100])
ax.set_ylabel("Critères satisfaits (%)", fontsize=8)
ax.set_title("A · Critères satisfaits par cycle (verdict publié)",
             fontsize=9.5, fontweight="bold", loc="left", color=TXT)
ax.text(0.02, 0.965, "Bleu = À CORRIGER · Vert = VALIDÉ (arbitrage D-Q2-G/H)",
        transform=ax.transAxes, fontsize=6.6, color="#555555", va="top")
ax.grid(axis="y", linestyle="--", linewidth=0.5, color="#cccccc", alpha=0.7)
ax.set_axisbelow(True)
for s in ("top", "right"):
    ax.spines[s].set_visible(False)

# =====================================================================
# B — Nommage correct (C1/C1a) : effet des corrections de spécification
# =====================================================================
ax = axes[0, 1]
x = np.arange(3)
y = [46.10, 72.67, 81.0]
ax.plot(x, y, "-o", color=BLEU, linewidth=1.8, markersize=6.5,
        markerfacecolor="white", markeredgewidth=1.8, zorder=3)
offs = [(8, -14), (0, 10), (-14, -18)]
hass = ["left", "center", "right"]
for xi, yi, lab, off, ha in zip(x, y, ["46,10 %", "72,67 %", "81,0 %"], offs, hass):
    ax.annotate(lab, (xi, yi), textcoords="offset points", xytext=off,
                ha=ha, fontsize=8, fontweight="bold", color=TXT)
ax.axhline(82.4, color=GRIS, linestyle=":", linewidth=1.2, zorder=1)
ax.axhline(82.0, color=VERMILLON, linestyle="--", linewidth=1.1, zorder=1)
ax.axhline(79.0, color=VERT, linestyle="--", linewidth=1.3, zorder=1)
refs = [("· plafond théorique ≈ 82,4 %", GRIS),
        ("· seuil R1 initial 82 % (0,4 pt du plafond)", VERMILLON),
        ("· seuil recalibré D-Q2-G 79 %", VERT)]
for k, (txt, col) in enumerate(refs):
    ax.text(0.03, 0.975 - k * 0.075, txt, transform=ax.transAxes, fontsize=6.4,
            color=col, va="top",
            bbox=dict(facecolor="white", alpha=0.85, edgecolor="none", pad=1.2))
ax.set_xticks(x)
ax.set_xticklabels(["WTC-Q1\n(RIO-01, C1)", "WTC-Q2\n(RIO-02, C1a)",
                    "WTC-Q2-R1\n(RIO-02, C1a)"], fontsize=7.0)
ax.set_ylim(40, 92)
ax.set_yticks([40, 50, 60, 70, 80, 90])
ax.set_ylabel("Nommage correct (%)", fontsize=8)
ax.set_title("B · Nommage correct (C1/C1a) — effet des corrections",
             fontsize=9.5, fontweight="bold", loc="left", color=TXT)
ax.grid(axis="y", linestyle="--", linewidth=0.5, color="#cccccc", alpha=0.7)
ax.set_axisbelow(True)
for s in ("top", "right"):
    ax.spines[s].set_visible(False)

# =====================================================================
# C — RIO-01 « Comment je me raccroche » — métriques finales
# =====================================================================
ax = axes[1, 0]
rows = [
    ("α (pool B)",                     90.82, "0,9082", None),
    ("α (pool A)",                     91.55, "0,9155", None),
    ("Couverture CI90 (C1a)",           89.90, "89,9 %", 90.0),
    ("Exactitude ponct. (C1b)",         79.70, "79,7 %", 80.5),
    ("Conservatrice (ii) (C1c)",        99.80, "99,8 %", 99.5),
    ("Conservatrice (i) (C1c)",        100.00, "100 %",  None),
    ("RQS piégés (C3)",                100.00, "20/20",  None),
]
labels = [r[0] for r in rows]
vals = [r[1] for r in rows]
labs = [r[2] for r in rows]
marks = [r[3] for r in rows]
yy = np.arange(len(rows))
ax.barh(yy, vals, color=BLEU, height=0.58, edgecolor="white")
for yi, v, lab, mk in zip(yy, vals, labs, marks):
    if v >= 85:  # étiquette à l'intérieur de la barre (blanc) pour libérer l'espace
        ax.text(v - 1.5, yi, lab, va="center", ha="right", fontsize=7.2,
                fontweight="bold", color="white")
    else:
        ax.text(v + 1.5, yi, lab, va="center", fontsize=7.2,
                fontweight="bold", color=TXT)
    if mk is not None:
        ax.plot([mk, mk], [yi - 0.32, yi + 0.32], color=VERMILLON,
                linewidth=2.0, zorder=4)
ax.set_yticks(yy)
ax.set_yticklabels(labels, fontsize=7.0)
ax.set_xlim(0, 118)
ax.set_xticks([0, 25, 50, 75, 100])
ax.set_title("C · RIO-01 « Comment je me raccroche » — VALIDÉE",
             fontsize=9.5, fontweight="bold", loc="left", color=TXT)
ax.grid(axis="x", linestyle="--", linewidth=0.5, color="#cccccc", alpha=0.7)
ax.set_axisbelow(True)
for s in ("top", "right"):
    ax.spines[s].set_visible(False)

# =====================================================================
# D — RIO-02 « Ce qui m'effraie vraiment » — critères R1 (valeurs corrigées)
# =====================================================================
ax = axes[1, 1]
rows = [
    ("Nommage correct (C1a)",              81.0, "81,0 % (seuil 79)"),
    ("Calme bilatéral — H (C1b)",          85.0, "85 % (≥ 80)"),
    ("Calme bilatéral — R (C1b)",           0.0, "0 % (≤ 2 %)"),
    ("Arêtes de frontière (C1c)",         100.0, "8/8"),
    ("Sécurité (C2)",                     100.0, "8/8 · 5/5"),
    ("Faux positifs (C2)",                  0.0, "0 FP (D-Q2-H)"),
    ("Convergence — O7-NLP (C3)",         100.0, "6/6"),
    ("Convergence — voies (C3)",          100.0, "4/4"),
    ("Convergence — double lecture (C3)",  94.0, "94,0 % (≥ 90)"),
    ("Affichage — templates (C5a)",       100.0, "35/35"),
    ("Déterminisme (C4)",                 100.0, "×2 SHA-256"),
]
labels = [r[0] for r in rows]
vals = [r[1] for r in rows]
labs = [r[2] for r in rows]
yy = np.arange(len(rows))[::-1]
for yi, v, lab in zip(yy, vals, labs):
    w = v if v > 0 else 1.6
    col = GRIS if v == 0 else BLEU
    ax.barh(yi, w, color=col, height=0.58, edgecolor="white")
    ax.text(w + 1.8, yi, lab, va="center", fontsize=6.9,
            fontweight="bold", color=TXT)
ax.set_yticks(yy)
ax.set_yticklabels(labels, fontsize=6.9)
ax.set_xlim(0, 132)
ax.set_xticks([0, 25, 50, 75, 100])
ax.set_title("D · RIO-02 « Ce qui m'effraie vraiment » — VALIDÉE",
             fontsize=9.5, fontweight="bold", loc="left", color=TXT)
ax.grid(axis="x", linestyle="--", linewidth=0.5, color="#cccccc", alpha=0.7)
ax.set_axisbelow(True)
for s in ("top", "right"):
    ax.spines[s].set_visible(False)

# =====================================================================
# Pied de figure : notes de lecture + source
# =====================================================================
fig.text(0.008, 0.058,
         "A : dénominateurs non comparables entre cycles (WTC-Q1 4 critères C1-C4 · Q1-R1 6 critères · Q2 et Q2-R1 7 critères) — valeurs publiées telles quelles."
         "      B : échelles distinctes (WTC-Q1 → RIO-01 ; WTC-Q2/-R1 → RIO-02) — trajectoire illustrative, pas une série homogène.",
         fontsize=6.2, color="#555555")
fig.text(0.008, 0.040,
         "C et D : valeurs en % — C : trait vermillon = référence (cible 90 % · plafond ~80,5 % · seuil 99,5 %) · α = α de Cronbach.      D : barres grises = zéro conforme (critère satisfait à 0).",
         fontsize=6.2, color="#555555")
fig.text(0.008, 0.016,
         "Source : « programme wairyu couple » v2 consolidée (Partie 13) · cycles WTC-Q1 3eb7399 → Q1-R1 1426f6e → Q2 0c3aaab → Q2-R1 78752d4 · exécutions seed 42 ×2 · Data Insight, 15/10/2026",
         fontsize=6.4, color="#666666")

OUT = "/home/z/my-project/download/Dashboard_EtatValidation_QuatreCycles_2026-10-15.png"
fig.savefig(OUT, dpi=150, facecolor="white")
print("PNG OK :", OUT)
import PIL.Image as I
im = I.open(OUT)
print("Dimensions :", im.size)
