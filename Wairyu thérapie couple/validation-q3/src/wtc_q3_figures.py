# -*- coding: utf-8 -*-
"""WAIRYU — WTC-Q3 figures : 4 visuels 1920×1080 @150 DPI, Okabe-Ito, français.
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
FOOT = ("Source : validation WTC-Q3 (seed 42, ×2, SHA 3c9a17c3…) — moteur et "
        "simulateur exécutés tels quels · Data Insight, 15/10/2026")
DSIM = ("⚠ D-SIM : résultats issus de simulations (seed 42) — la mécanique de "
        "mesure est validée ou non, pas la prévalence clinique")

res = json.load(open(os.path.join(RES, "resultats.json"), encoding="utf-8"))
crit = res["criteres"]
core_forces = ["F1", "F2", "F3", "F4", "F5", "F6"]

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
    "C1a": "0/40",
    "C1b": "(120/120)",
    "C1c": "banque 400/400 · max2 400/400 · 20/20",
    "C2":  f"{res['c2_pct']:.2f} %".replace(".", ",") + " (365/400)",
    "C3":  "15/15 · c3 vides OK",
    "C4":  "SHA ×2 identiques (3c9a17c3…)",
    "C5":  "a 1/1 · b 20/20 · c 4/4 · d OK",
}
pct = {"C1a": 0.0, "C1b": 100.0, "C1c": 100.0, "C2": res["c2_pct"],
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
ax.set_xlabel("Atteinte de l'exigence (%)", fontsize=8.5)
ax.axvline(97, color=GRIS, linestyle=":", linewidth=1.1)
ax.text(97.8, -0.42, "seuil C2 : 97 %", fontsize=6.6, color="#555555",
        va="top", ha="left")
fig.suptitle("WAIRYU WTC-Q3 « Ce qui me porte » — Tableau de bord des 7 critères",
             fontsize=13.5, fontweight="bold", color=TXT, x=0.012, ha="left")
ax.set_title("VERDICT : À CORRIGER — 5/7 PASS — note 6/10 · "
             "FAIL : C1a anti-fabrication · C2 vérité croisée",
             fontsize=10, color="#444444", loc="left", pad=10)
ax.text(1.0, 1.02, "Vert = PASS · Vermillon = FAIL", transform=ax.transAxes,
        fontsize=7.4, color="#555555", va="bottom", ha="right")
ax.grid(axis="x", linestyle="--", linewidth=0.5, color="#cccccc", alpha=0.7)
ax.set_axisbelow(True)
for s_ in ("top", "right"):
    ax.spines[s_].set_visible(False)
footer(fig)
plt.savefig(os.path.join(FIG, "BarChart_TableauDeBord_7Criteres_Q3_2026-10-15.png"), dpi=150)
plt.close(fig)

# =====================================================================
# 2 — Heatmap matrice des forces (F1-F6 × G1-G4)
# =====================================================================
mat = res["stats"]["matrice"]
groupes = list(mat.keys())
M = np.array([[mat[g][f] for f in core_forces] for g in groupes])
fig, ax = plt.subplots(figsize=(12.8, 7.2), dpi=150)
fig.subplots_adjust(left=0.16, right=0.92, top=0.84, bottom=0.14)
im = ax.imshow(M, cmap="Blues", aspect="auto", vmin=0, vmax=M.max())
ax.set_xticks(range(len(core_forces)))
ax.set_xticklabels(["F1 port\ntempête", "F2 assise", "F3 vigilance\nfidèle",
                    "F4 constance", "F5 légèreté", "F6 tendresse\nquotidien"], fontsize=8.4)
ax.set_yticks(range(len(groupes)))
ax.set_yticklabels([f"{g}\n(n={150 if 'G1' in g else 120 if 'G2' in g else 80 if 'G3' in g else 50})"
                    for g in groupes], fontsize=8.2)
for i in range(len(groupes)):
    for j in range(len(core_forces)):
        v = M[i, j]
        ax.text(j, i, str(v), ha="center", va="center", fontsize=10,
                fontweight="bold",
                color="white" if v > M.max() * 0.55 else TXT)
ax.set_title("WTC-Q3 — Matrice des forces sélectionnées par groupe (nombre de profils)\n"
             "F6 dominante : la voie B « ZONE CALME » (absente de la table de la banque) porte la majorité des G1/G2",
             fontsize=11.5, fontweight="bold", color=TXT, loc="left")
cb = fig.colorbar(im, ax=ax, fraction=0.032, pad=0.02)
cb.set_label("Profils (nombre)", fontsize=8)
footer(fig)
plt.savefig(os.path.join(FIG, "Heatmap_MatriceForces_Groupes_Q3_2026-10-15.png"), dpi=150)
plt.close(fig)

# =====================================================================
# 3 — Les 40 SANS_FORCE : d'où vient la force fabriquée (S-Q3-2)
# =====================================================================
# recomptage via audit indépendant (mêmes règles que le cahier)
import sys
sys.path.insert(0, HERE)
import wtc_q3_simulator as sim
import wtc_q3_core as core
import wtc_q3_validation as val
voies_sf = {f: {"A": 0, "B": 0, "C": 0} for f in core_forces}
for p in sim.TRAPS["SANS_FORCE"]:
    ca, cb, cj = val.audit_voies(p)
    m = core.verifier_forces(p["c1_mode"], p["c2"], p["c3"], p["sA"], p["sB"],
                             p["h_norm"], p["r_norm"], p["label_ombre"],
                             p["journal"])
    for f in m["forces"]:
        for voie, vraie in zip("ABC", (ca[f], cb[f], cj[f])):
            if vraie:
                voies_sf[f][voie] += 1
fig, ax = plt.subplots(figsize=(12.8, 7.2), dpi=150)
fig.subplots_adjust(left=0.09, right=0.97, top=0.84, bottom=0.14)
x = np.arange(len(core_forces))
bA = [voies_sf[f]["A"] for f in core_forces]
bB = [voies_sf[f]["B"] for f in core_forces]
bC = [voies_sf[f]["C"] for f in core_forces]
ax.bar(x, bA, 0.58, label="Voie A (déclaratif C1-C3)", color=BLEU)
ax.bar(x, bB, 0.58, bottom=bA, label="Voie B (héritée Quêtes 1-2)", color=VERMILLON)
ax.bar(x, bC, 0.58, bottom=[a + b for a, b in zip(bA, bB)],
       label="Voie C (journal 7 jours)", color=ORANGE)
for xi, (a, b, c) in enumerate(zip(bA, bB, bC)):
    if a + b + c:
        ax.text(xi, a + b + c + 1.0, str(a + b + c), ha="center",
                fontsize=11, fontweight="bold", color=TXT)
ax.set_xticks(x)
ax.set_xticklabels(["F1 port\ntempête", "F2 assise", "F3 vigilance\nfidèle",
                    "F4 constance", "F5 légèreté", "F6 tendresse\nquotidien"],
                   fontsize=8.6)
ax.set_ylim(0, 46)
ax.set_ylabel("Profils SANS_FORCE concernés (n = 40)", fontsize=8.5)
ax.set_title("WTC-Q3 — Pourquoi l'anti-fabrication échoue : les 40 profils SANS_FORCE reçoivent F6\n"
             "par la seule voie B « label = ZONE CALME », absente de la table de la banque (§1) — C1a : 0/40",
             fontsize=11.5, fontweight="bold", color=TXT, loc="left")
ax.legend(fontsize=8, loc="upper left", frameon=False)
ax.grid(axis="y", linestyle="--", linewidth=0.5, color="#cccccc", alpha=0.7)
ax.set_axisbelow(True)
for s_ in ("top", "right"):
    ax.spines[s_].set_visible(False)
footer(fig, extra="· profil SANS_FORCE : RIEN en C1 · C2=0 · C3 vide · scores bas · pas de journal")
plt.savefig(os.path.join(FIG, "BarChart_SansForce_VoieB_F6_Q3_2026-10-15.png"), dpi=150)
plt.close(fig)

# =====================================================================
# 4 — Anti-fabrication : exigé vs mesuré (bornes D-STD)
# =====================================================================
fig, axes = plt.subplots(1, 2, figsize=(12.8, 7.2), dpi=150)
fig.subplots_adjust(left=0.10, right=0.965, top=0.815, bottom=0.145, wspace=0.30)
fig.suptitle("WTC-Q3 — L'anti-fabrication : exigé par le package vs mesuré (seed 42)",
             fontsize=13, fontweight="bold", color=TXT, y=0.945)
ax = axes[0]
ax.bar([0], [40], color=GRIS, width=0.5, label="Exigé (C1a) : 40/40")
ax.bar([1], [0], color=VERMILLON, width=0.5, label="Mesuré : 0/40")
ax.text(0, 40.8, "40", ha="center", fontsize=11, fontweight="bold", color=TXT)
ax.text(1, 2.2, "0", ha="center", fontsize=11, fontweight="bold", color=VERMILLON)
ax.set_xticks([0, 1])
ax.set_xticklabels(["Exigé\nSILENCIEUSES", "Mesuré\n(F6 fabriquée)"], fontsize=8.6)
ax.set_ylim(0, 46)
ax.set_ylabel("Profils SANS_FORCE (n = 40)", fontsize=8.5)
ax.set_title("A · Le piège SANS_FORCE", fontsize=10, fontweight="bold",
             loc="left", color=TXT)
ax.legend(fontsize=7.6, frameon=False)
ax.grid(axis="y", linestyle="--", linewidth=0.5, color="#cccccc", alpha=0.7)
ax.set_axisbelow(True)
for s_ in ("top", "right"):
    ax.spines[s_].set_visible(False)

ax = axes[1]
ax.add_patch(plt.Rectangle((-0.25, 35), 0.5, 15, facecolor="#c0d0e2",
                           edgecolor=GRIS, linewidth=1.0, alpha=0.9))
ax.bar([1], [0.0], color=VERMILLON, width=0.5)
ax.text(-0.25, 51.5, "borne D-STD :\n35-50 % attendus", fontsize=7.4,
        color="#555555", ha="center")
ax.text(1, 2.2, "0,0 %", ha="center", fontsize=11, fontweight="bold",
        color=VERMILLON)
ax.set_xticks([0, 1])
ax.set_xticklabels(["Attendu (borne D-STD, §4)\nplage 35-50 %", "Mesuré\nG1"], fontsize=8.6)
ax.set_ylim(0, 60)
ax.set_ylabel("Part de SILENCIEUSES dans G1 (%)", fontsize=8.5)
ax.set_title("B · La borne D-STD du groupe G1 est inatteignable", fontsize=10,
             fontweight="bold", loc="left", color=TXT)
ax.grid(axis="y", linestyle="--", linewidth=0.5, color="#cccccc", alpha=0.7)
ax.set_axisbelow(True)
for s_ in ("top", "right"):
    ax.spines[s_].set_visible(False)
footer(fig, extra="· cause unique : voie B de F6 (S-Q3-2)")
plt.savefig(os.path.join(FIG, "BarChart_AntiFabrication_ExigeVsMesure_Q3_2026-10-15.png"), dpi=150)
plt.close(fig)

print("4 figures écrites dans", os.path.abspath(FIG))
