# -*- coding: utf-8 -*-
"""
Comparaison du marché des applications de rencontre (2024)
Panneau A : carte de positionnement (intention de relation x mode de découverte)
Panneau B : revenus annuels estimés 2023 (M$ USD)
"""
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np

# ---------- Paramètres globaux ----------
plt.rcParams["font.sans-serif"] = ["DejaVu Sans", "Arial"]
plt.rcParams["axes.unicode_minus"] = False
sns.set_style("whitegrid")
plt.rcParams["grid.color"] = "#DDDDDD"
plt.rcParams["grid.linestyle"] = "--"
plt.rcParams["grid.linewidth"] = 0.6

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(19.2, 9.0), dpi=150,
                               constrained_layout=True)

# =========================================================
# PANNEAU A — Carte de positionnement qualitative
# =========================================================
apps = {
    # nom : (x = intention (0 casual -> 10 sérieuse), y = mode de découverte
    #        (0 swipe/quantité -> 10 affinités/qualité), taille = revenus M$)
    "Tinder":   (1.8, 2.0, 1900),
    "Badoo":    (2.6, 1.6, 200),
    "Grindr":   (1.5, 3.2, 265),
    "Fruitz":   (5.0, 4.2, 8),
    "Bumble":   (5.2, 3.2, 848),
    "Happn":    (4.4, 2.2, 25),
    "Hinge":    (7.6, 7.2, 250),
    "Meetic":   (8.6, 6.2, 130),
    "Once":     (7.9, 8.6, 10),
}

x = np.array([v[0] for v in apps.values()])
y = np.array([v[1] for v in apps.values()])
s = np.array([v[2] for v in apps.values()], dtype=float)
sizes = 150 + (s / s.max()) * 4200  # taille des bulles = revenus

palette = sns.color_palette("colorblind", len(apps))
colors = sns.color_palette("colorblind", 4)
bubble_colors = {
    "Tinder": colors[0], "Badoo": colors[1], "Grindr": colors[2],
    "Fruitz": colors[3], "Bumble": colors[0], "Happn": colors[1],
    "Hinge": colors[2], "Meetic": colors[3], "Once": colors[0],
}

ax1.axhline(5, color="#999999", lw=1.0, ls="-", alpha=0.6, zorder=1)
ax1.axvline(5, color="#999999", lw=1.0, ls="-", alpha=0.6, zorder=1)

for (name, (px, py, rev)), size in zip(apps.items(), sizes):
    ax1.scatter(px, py, s=size, color=bubble_colors[name], alpha=0.75,
                edgecolor="white", linewidth=1.5, zorder=3)
    offset = 0.42 + (size / 15000)
    if name == "Once":  # évite le chevauchement avec le texte du quadrant
        ax1.annotate(name, (px, py - offset), ha="center", va="top",
                     fontsize=11.5, fontweight="bold", color="#333333", zorder=4)
    else:
        ax1.annotate(name, (px, py + offset), ha="center", va="bottom",
                     fontsize=11.5, fontweight="bold", color="#333333", zorder=4)

# Étiquettes des quadrants
qstyle = dict(fontsize=12, color="#888888", style="italic", zorder=2)
ax1.text(0.6, 9.4, "Relation sérieuse\n+ Match de qualité", ha="left", va="top", **qstyle)
ax1.text(9.4, 9.4, "Relation sérieuse\n+ Volume / recherche", ha="right", va="top", **qstyle)
ax1.text(0.6, 0.6, "Dating léger\n+ Swipe rapide", ha="left", va="bottom", **qstyle)
ax1.text(9.4, 0.6, "Dating léger\n+ Découverte libre", ha="right", va="bottom", **qstyle)

ax1.set_xlim(0, 10); ax1.set_ylim(0, 10)
ax1.set_xlabel("Intention de relation  (casual  \u2192  sérieuse)", fontsize=12.5)
ax1.set_ylabel("Mode de découverte  (swipe/quantité  \u2192  affinités/qualité)", fontsize=12.5)
ax1.set_title("Carte de positionnement des applications de rencontre",
              fontsize=14.5, fontweight="bold", pad=12)
ax1.text(0.5, -0.13, "Taille des bulles = revenus 2023 estimés (M$ USD)",
         transform=ax1.transAxes, ha="center", fontsize=10.5, color="#666666")

# =========================================================
# PANNEAU B — Revenus annuels estimés 2023 (M$ USD)
# =========================================================
rev_data = [
    ("Tinder*", 1900, True),
    ("Bumble*", 848, True),
    ("Grindr", 265, False),
    ("Hinge*", 250, True),
    ("Spark Networks**", 173, False),
    ("Meetic*", 130, True),
    ("Happn*", 25, True),
    ("Fruitz*", 8, True),
]
names = [d[0] for d in rev_data][::-1]
vals = [d[1] for d in rev_data][::-1]
est_flags = [d[2] for d in rev_data][::-1]

bar_colors = ["#4C72B0" if not f else "#8FB3DE" for f in est_flags]
bars = ax2.barh(names, vals, color=bar_colors, edgecolor="white", height=0.62)

for bar, v in zip(bars, vals):
    ax2.text(bar.get_width() + 28, bar.get_y() + bar.get_height() / 2,
             f"{v:,} M$".replace(",", " "), va="center", ha="left",
             fontsize=11, fontweight="bold", color="#333333")

ax2.set_xlim(0, 2150)
ax2.set_xlabel("Revenus annuels 2023 (millions de dollars)", fontsize=12.5)
ax2.set_title("Revenus des principaux acteurs (2023)", fontsize=14.5,
              fontweight="bold", pad=12)
ax2.tick_params(axis="y", labelsize=11.5)
ax2.grid(axis="y", visible=False)

from matplotlib.lines import Line2D
legend_elems = [
    Line2D([0], [0], marker="s", color="none", markerfacecolor="#4C72B0",
           markersize=12, label="Figure publique (rapport annuel)"),
    Line2D([0], [0], marker="s", color="none", markerfacecolor="#8FB3DE",
           markersize=12, label="* Estimation / filiale non isolée"),
]
ax2.legend(handles=legend_elems, loc="lower right", fontsize=10, frameon=True)

# ---------- Titre général + source ----------
fig.suptitle("Paysage concurrentiel des applications de rencontre \u2014 2024",
             fontsize=19, fontweight="bold")
fig.text(0.01, -0.03,
         "Sources : rapports annuels 2023 Match Group, Bumble Inc., Grindr Inc. ; "
         "* estimations d'après données publiques pour acteurs privés / filiales. "
         "Positionnement : évaluation qualitative des fonctionnalités connues (échelle 0\u201310).",
         fontsize=9.5, color="#777777", ha="left")

out = "/home/z/my-project/download/Positionnement_Apps_Rencontre_2026-09-27.png"
plt.savefig(out, dpi=150, bbox_inches="tight", facecolor="white")
print("OK ->", out)
