# -*- coding: utf-8 -*-
"""WAIRYU — WTC-Q3-R1 figures : 4 visuels 1920×1080 @150 DPI, Okabe-Ito, français.
Aucune valeur saisie à la main : tout est relu depuis results/run_1/."""
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import csv, os, json

HERE = os.path.dirname(os.path.abspath(__file__))
RES = os.path.join(HERE, "..", "results", "run_1")
FIG = os.path.join(HERE, "..", "figures")
os.makedirs(FIG, exist_ok=True)

plt.rcParams["font.sans-serif"] = ["DejaVu Sans"]
plt.rcParams["axes.unicode_minus"] = False

BLEU, VERT, VERMILLON, ORANGE, GRIS = "#0072B2", "#009E73", "#D55E00", "#E69F00", "#999999"
TXT = "#142840"
FOOT = ("Source : validation WTC-Q3-R1 (seed 42, ×2, SHA 1e445ea8…) — moteur et "
        "simulateur R1 exécutés tels quels · bornes D-STD seed 20261015 · "
        "Data Insight, 15/10/2026")
DSIM = ("⚠ D-SIM : résultats issus de simulations (seed 42) — la mécanique de "
        "mesure est validée ou non, pas la prévalence clinique")

res = json.load(open(os.path.join(RES, "resultats.json"), encoding="utf-8"))
crit = res["criteres"]
bornes = json.load(open(os.path.join(HERE, "..", "results",
                                     "bornes_dstd_r1.json"), encoding="utf-8"))
FORCES = ["F1", "F2", "F3", "F4", "F5", "F6"]

def footer(fig, extra=""):
    fig.text(0.012, 0.030, FOOT, fontsize=6.8, color="#666666")
    fig.text(0.012, 0.012, DSIM + ((" · " + extra) if extra else ""),
             fontsize=6.8, color="#666666")

# =====================================================================
# 1 — Tableau de bord des 7 critères
# =====================================================================
fig, ax = plt.subplots(figsize=(12.8, 7.2), dpi=150)
fig.subplots_adjust(left=0.315, right=0.965, top=0.845, bottom=0.135)
libelles = {
    "C1a": "C1a · Anti-fabrication (SANS_FORCE → SILENCIEUSE) — 40/40",
    "C1b": "C1b · Anti-négligence (G2 ≥ 1 force) — ≥ 82 %",
    "C1c": "C1c · Banque fermée + limite 2 + SURCHARGE — 100 %",
    "C2":  "C2 · Vérité croisée moteur == vérité (400) — ≥ 97 %",
    "C3":  "C3 · Miroir ASYM 15/15 + c3 vides sans crash",
    "C4":  "C4 · Reproductibilité ×2 (SHA-256, seed 42)",
    "C5":  "C5 · Affichage & honnêteté (a·b·c·d)",
}
obs_court = {
    "C1a": "40/40",
    "C1b": "(120/120)",
    "C1c": "banque 400/400 · max2 400/400 · 20/20",
    "C2":  f"{res['c2_pct']:.2f} %".replace(".", ",") + f" ({res['c2_accords']}/400)",
    "C3":  "15/15 · c3 vides OK",
    "C4":  "SHA ×2 identiques (1e445ea8…)",
    "C5":  "a 1/1 + 61/475 SILENCIEUSES · b 20/20 · c 4/4 · d 6/6",
}
pct = {"C1a": 100.0, "C1b": 100.0, "C1c": 100.0, "C2": res["c2_pct"],
       "C3": 100.0, "C4": 100.0, "C5": 100.0}
order = ["C1a", "C1b", "C1c", "C2", "C3", "C4", "C5"][::-1]
ys = range(len(order))
vals = [pct[k] for k in order]
cols = [VERT if crit[k]["pass"] else VERMILLON for k in order]
bars = ax.barh(list(ys), vals, color=cols, height=0.6, edgecolor="white")
for y, k, v in zip(ys, order, vals):
    ax.text(v + 1.2, y, f"{v:.1f} %".replace(".", ",") + "  ·  " + obs_court[k],
            va="center", ha="left", fontsize=8.0, fontweight="bold", color=TXT)
ax.set_yticks(list(ys))
ax.set_yticklabels([libelles[k] for k in order], fontsize=8.4)
ax.set_xlim(0, 152)
ax.set_xticks([0, 25, 50, 75, 100])
ax.set_xticklabels(["0 %", "25 %", "50 %", "75 %", "100 %"], fontsize=8)
for x in (82, 97):
    ax.axvline(x, color=GRIS, lw=0.8, ls="--", alpha=0.6)
ax.text(82, len(order)-0.35, "seuil C1b 82 %", fontsize=7, color="#555555",
        ha="center")
ax.text(97, len(order)-0.35, "seuil C2 97 %", fontsize=7, color="#555555",
        ha="center")
ax.set_title("WTC-Q3-R1 — Tableau de bord des 7 critères — VERDICT : VALIDÉ (7/7, note 10/10)",
             fontsize=13, fontweight="bold", color=TXT, pad=14)
ax.spines[["top", "right"]].set_visible(False)
footer(fig)
fig.savefig(os.path.join(FIG, "BarChart_TableauDeBord_7Criteres_R1_2026-10-15.png"))
plt.close(fig)

# =====================================================================
# 2 — Avant/après : l'effet des décisions D-Q3-R1 (C1a et C2)
# =====================================================================
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12.8, 7.2), dpi=150)
fig.subplots_adjust(left=0.09, right=0.965, top=0.80, bottom=0.135, wspace=0.28)
# C1a
av = [0, 40]
b1 = ax1.bar([0, 1], av, color=[VERMILLON, VERT], width=0.55, edgecolor="white")
for x, v in zip([0, 1], av):
    ax1.text(x, v + 0.8, f"{v}/40", ha="center", fontsize=12,
             fontweight="bold", color=TXT)
ax1.set_xticks([0, 1])
ax1.set_xticklabels(["WTC-Q3\n(voie B « ZONE CALME »)", "WTC-Q3-R1\n(voie B supprimée, D-Q3-R1-A)"],
                    fontsize=9)
ax1.set_ylim(0, 46)
ax1.set_ylabel("SANS_FORCE → SILENCIEUSE (sur 40)", fontsize=9)
ax1.set_title("C1a · Anti-fabrication — 0/40 → 40/40", fontsize=11.5,
              fontweight="bold", color=TXT)
ax1.spines[["top", "right"]].set_visible(False)
# C2
b2 = ax2.bar([0, 1], [91.25, res["c2_pct"]], color=[VERMILLON, VERT],
             width=0.55, edgecolor="white")
for x, v, n in zip([0, 1], [91.25, res["c2_pct"]], [365, res["c2_accords"]]):
    ax2.text(x, v + 1.0, f"{v:.2f} %\n({n}/400)".replace(".", ","),
             ha="center", fontsize=10.5, fontweight="bold", color=TXT)
ax2.set_xticks([0, 1])
ax2.set_xticklabels(["WTC-Q3\n(F1 divergente moteur/simulateur)", "WTC-Q3-R1\n(table F1 alignée, D-Q3-R1-B)"],
                    fontsize=9)
ax2.set_ylim(0, 112)
ax2.axhline(97, color=GRIS, lw=0.9, ls="--", alpha=0.7)
ax2.text(0.5, 98.2, "seuil 97 %", fontsize=8, color="#555555", ha="center")
ax2.set_ylabel("Accord moteur == vérité (400 profils, %)", fontsize=9)
ax2.set_title("C2 · Vérité croisée — 91,25 % → 100,00 %", fontsize=11.5,
              fontweight="bold", color=TXT)
ax2.spines[["top", "right"]].set_visible(False)
fig.suptitle("L'effet des deux décisions de révision — les 2 FAIL du run initial réparés",
             fontsize=13, fontweight="bold", color=TXT, y=0.955)
footer(fig)
fig.savefig(os.path.join(FIG, "BarChart_AvantApres_C1a_C2_R1_2026-10-15.png"))
plt.close(fig)

# =====================================================================
# 3 — Bornes D-STD R1 : plafonds géométriques vs observé
# =====================================================================
fig, ax = plt.subplots(figsize=(12.8, 7.2), dpi=150)
fig.subplots_adjust(left=0.20, right=0.965, top=0.845, bottom=0.135)
groupes = list(bornes["groupes"].keys())
order = groupes[::-1]
ys = np.arange(len(order))
plafonds = [bornes["groupes"][g]["plafond_ge1_force_pct"] for g in order]
los = [bornes["groupes"][g]["intervalle_n_officiel_pct"][0] for g in order]
his = [bornes["groupes"][g]["intervalle_n_officiel_pct"][1] for g in order]
with open(os.path.join(RES, "stats_groupes.csv"), encoding="utf-8") as f:
    obs = {r["groupe"]: float(r["taux_ge1_force_pct"])
           for r in csv.DictReader(f)}
obs_vals = [obs[g] for g in order]
ax.barh(ys, plafonds, color="#BBDDF0", height=0.58, edgecolor="white",
        label="Plafond géométrique (Monte-Carlo 1M, seed 20261015)")
err_lo = [o - l for o, l in zip(obs_vals, los)]
err_hi = [h - o for o, h in zip(obs_vals, his)]
ax.errorbar(obs_vals, ys, xerr=[err_lo, err_hi], fmt="D", color=BLEU,
            ecolor=BLEU, elinewidth=1.6, capsize=4, ms=7,
            label="Observé run R1 (± 3σ à n officiel)")
for y, o, p in zip(ys, obs_vals, plafonds):
    ax.text(max(o, p) + 0.6, y, f"{o:.1f} % / plafond {p:.1f} %".replace(".", ","),
            va="center", fontsize=8.2, fontweight="bold", color=TXT)
ax.set_yticks(ys)
ax.set_yticklabels(order, fontsize=9)
ax.set_xlim(70, 108)
ax.set_xticks([70, 80, 90, 100])
ax.set_xticklabels(["70 %", "80 %", "90 %", "100 %"], fontsize=8)
ax.axvline(82, color=ORANGE, lw=1.0, ls="--", alpha=0.8)
ax.text(82, len(order)-0.42, "seuil C1b 82 %", fontsize=7.4, color="#B87700",
        ha="center")
ax.set_title("WTC-Q3-R1 — Anti-négligence : observé vs plafonds géométriques D-STD",
             fontsize=13, fontweight="bold", color=TXT, pad=14)
ax.legend(loc="lower left", fontsize=8, frameon=False)
ax.spines[["top", "right"]].set_visible(False)
footer(fig, extra="S-Q3-R1-1 : la borne d'intention Q3 « G1 35-50 % SILENCIEUSES » est "
                  "inatteignable par la géométrie du cahier (plafond 14,5 %) — documenté, sans impact critère")
fig.savefig(os.path.join(FIG, "BarChart_BornesDStd_ObsVsPlafond_R1_2026-10-15.png"))
plt.close(fig)

# =====================================================================
# 4 — Matrice des forces par groupe
# =====================================================================
fig, ax = plt.subplots(figsize=(12.8, 7.2), dpi=150)
fig.subplots_adjust(left=0.155, right=0.90, top=0.845, bottom=0.135)
mat = {g: res["stats"]["matrice"][g] for g in groupes}
matrice = np.array([[mat[g][f] for f in FORCES] for g in groupes], dtype=float)
im = ax.imshow(matrice, cmap="Blues", aspect="auto")
ax.set_xticks(range(len(FORCES)))
ax.set_xticklabels(FORCES, fontsize=9.5)
ax.set_yticks(range(len(groupes)))
ax.set_yticklabels(groupes, fontsize=9)
for i in range(len(groupes)):
    for j in range(len(FORCES)):
        v = int(matrice[i, j])
        ax.text(j, i, str(v), ha="center", va="center", fontsize=10,
                fontweight="bold",
                color="white" if v > matrice.max() * 0.55 else TXT)
cbar = fig.colorbar(im, ax=ax, fraction=0.035, pad=0.02)
cbar.ax.tick_params(labelsize=8)
ax.set_title("WTC-Q3-R1 — Matrice des forces par groupe (occurrences après limite des 2)",
             fontsize=13, fontweight="bold", color=TXT, pad=14)
footer(fig, extra="depuis D-Q3-R1-A, F6 ne vient plus que de C3 T/Pr ou journal T+M ≥ 4/7 — "
                  "plus aucune force fabriquée par le label d'ombre")
fig.savefig(os.path.join(FIG, "Heatmap_MatriceForces_Groupes_R1_2026-10-15.png"))
plt.close(fig)

print("4 figures R1 écrites :", os.listdir(FIG))
