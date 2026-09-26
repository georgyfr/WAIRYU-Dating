# -*- coding: utf-8 -*-
"""
Wairyu (hypothèse, si implémentée) vs applications de rencontre établies
Panneau A : radar comparatif (6 axes) — Wairyu vs Tinder, Bumble, Hinge
Panneau B : heatmap 10 apps x 6 critères (scores 0-10)
"""
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns
from matplotlib.patches import Rectangle

plt.rcParams["font.sans-serif"] = ["DejaVu Sans", "Arial"]
plt.rcParams["axes.unicode_minus"] = False
plt.rcParams["grid.color"] = "#DDDDDD"
plt.rcParams["grid.linestyle"] = "--"

# ---------------- Données (évaluation qualitative 0-10) ----------------
CRITERES = ["Relation sérieuse", "Originalité du concept",
            "Base d'utilisateurs", "Notoriété",
            "Monétisation éprouvée", "Ancrage Afrique francophone"]

scores = {
    "Tinder":   [3, 4, 10, 10, 9, 6],
    "Badoo":    [3, 4,  6,  6, 6, 5],
    "Grindr":   [3, 6,  5,  7, 6, 4],
    "Fruitz":   [6, 9,  3,  5, 3, 5],
    "Bumble":   [5, 7,  7,  8, 7, 5],
    "Happn":    [4, 7,  5,  7, 5, 5],
    "Hinge":    [8, 8,  5,  7, 7, 3],
    "Meetic":   [8, 4,  4,  6, 7, 2],
    "Once":     [8, 7,  2,  3, 3, 2],
    # Profil hypothétique d'un nouvel entrant différencié (à valider)
    "Wairyu*":  [7, 8,  0,  0, 0, 8],
}

df = pd.DataFrame(scores, index=CRITERES).T  # apps en lignes

fig = plt.figure(figsize=(19.2, 9.2), dpi=150, constrained_layout=True)
gs = fig.add_gridspec(1, 2, width_ratios=[1.0, 1.45])

# =========================================================
# PANNEAU A — Radar : Wairyu (hypothèse) vs 3 références
# =========================================================
ax1 = fig.add_subplot(gs[0, 0], projection="polar")

labels_radar = ["Relation\nsérieuse", "Originalité\ndu concept",
                "Base\nd'utilisateurs", "Notoriété",
                "Monétisation\néprouvée", "Ancrage Afrique\nfrancophone"]

n = len(CRITERES)
angles = np.linspace(0, 2 * np.pi, n, endpoint=False).tolist()
angles += angles[:1]

radar_apps = {
    "Wairyu*": ("#111111", 3.2, "--"),   # hypothèse : trait noir pointillé
    "Tinder":  ("#4C72B0", 2.0, "-"),
    "Bumble":  ("#DD8452", 2.0, "-"),
    "Hinge":   ("#55A868", 2.0, "-"),
}

for name, (color, lw, ls) in radar_apps.items():
    vals = scores[name] + scores[name][:1]
    ax1.plot(angles, vals, color=color, linewidth=lw, linestyle=ls,
             label=name, zorder=3 if name == "Wairyu*" else 2)
    ax1.fill(angles, vals, color=color, alpha=0.10 if name == "Wairyu*" else 0.06)

ax1.set_xticks(angles[:-1])
ax1.set_xticklabels(labels_radar, fontsize=11.5)
ax1.set_ylim(0, 10)
ax1.set_yticks([2, 4, 6, 8, 10])
ax1.set_yticklabels(["2", "4", "6", "8", "10"], fontsize=9, color="#888888")
ax1.grid(True, linestyle="--", alpha=0.6)
ax1.spines["polar"].set_color("#CCCCCC")

ax1.set_title("Wairyu (profil hypothétique*) vs les références du marché",
              fontsize=14.5, fontweight="bold", pad=26)
ax1.legend(loc="upper right", bbox_to_anchor=(1.32, 1.12), fontsize=10.5,
           frameon=True)

# =========================================================
# PANNEAU B — Heatmap : 10 apps x 6 critères
# =========================================================
ax2 = fig.add_subplot(gs[0, 1])

sns.heatmap(df, ax=ax2, cmap="YlGnBu", vmin=0, vmax=10, annot=True,
            fmt="d", annot_kws={"fontsize": 11, "fontweight": "bold"},
            linewidths=1.2, linecolor="white",
            cbar_kws={"label": "Score (0 = absent / inexistant, 10 = leader)",
                      "shrink": 0.85})

# Couleur du texte adaptée au fond (blanc sur cellules foncées)
for text_obj, val in zip(ax2.texts, df.values.flatten()):
    text_obj.set_color("white" if val >= 6 else "#222222")

# Cadre pointillé autour de la ligne Wairyu (dernière ligne)
ax2.add_patch(Rectangle((0, df.index.get_loc("Wairyu*")), len(CRITERES), 1,
                        fill=False, edgecolor="#111111", lw=2.4, ls="--",
                        clip_on=False))

# Mise en gras de l'étiquette Wairyu
for lbl in ax2.get_yticklabels():
    if "Wairyu" in lbl.get_text():
        lbl.set_fontweight("bold")
        lbl.set_color("#111111")
ax2.tick_params(axis="y", labelsize=11.5, rotation=0)
ax2.tick_params(axis="x", labelsize=11)
plt.setp(ax2.get_xticklabels(), rotation=20, ha="right")

ax2.set_title("Grille comparative complète (scores 0-10)",
              fontsize=14.5, fontweight="bold", pad=12)
ax2.set_xlabel("")
ax2.set_ylabel("")

# ---------------- Titre + note de source ----------------
fig.suptitle("Wairyu vs applications de rencontre établies — projection \u00ab si implémentée \u00bb",
             fontsize=19, fontweight="bold")
fig.supxlabel("Scores : évaluation qualitative d'après les positionnements publics des applications (2024). "
              "* Wairyu : profil HYPOTHÉTIQUE d'un nouvel entrant différencié visant le marché francophone "
              "(scores à valider avec le concept détaillé \u2014 documents projet non reçus).",
              fontsize=10, color="#777777")

out = "/home/z/my-project/download/RadarHeatmap_Wairyu_vs_Apps_Rencontre_2026-09-27.png"
plt.savefig(out, dpi=150, bbox_inches="tight", facecolor="white")
print("OK ->", out)
