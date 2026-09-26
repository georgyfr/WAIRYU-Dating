# -*- coding: utf-8 -*-
"""
Charts WAIRYU — Round 2 (deux nouveaux documents) :
  Doc A : « Analyse du document WAIRYU — Inventaire complet des Tests et Outils »
  Doc B : « Les Profils à Risque dans les Applications de Rencontre — Taxonomie Complète et Détection Éthique »

Sortie : 5 PNG en français, 1920×1080 @150 DPI (donut carré), palette colorblind-safe Paul Tol,
grilles horizontales pointillées, zéro chevauchement, source annotée en bas à gauche.
"""
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import os

# ═══ Style global (template skill charts) ═══
plt.rcParams.update({
    'font.sans-serif': ['DejaVu Sans', 'SimHei', 'Arial'],
    'axes.unicode_minus': False,
    'figure.facecolor': '#FFFFFF',
    'axes.facecolor': '#FFFFFF',
    'axes.edgecolor': '#E5E7EB',
    'axes.linewidth': 0.8,
    'axes.spines.top': False,
    'axes.spines.right': False,
    'axes.grid': False,
    'xtick.major.size': 0,
    'ytick.major.size': 0,
    'xtick.labelsize': 9.5,
    'ytick.labelsize': 10,
    'axes.labelsize': 11,
    'legend.frameon': False,
    'legend.fontsize': 10,
})

# Palette Paul Tol (colorblind-safe)
CB_BLUE, CB_CYAN, CB_TEAL, CB_ORANGE, CB_RED, CB_PINK = \
    '#0077BB', '#33BBEE', '#009988', '#EE7733', '#CC3311', '#EE3377'
G900, G700, G500, G400, G300, G200 = '#111827', '#374151', '#6B7280', '#9CA3AF', '#D1D5DB', '#E5E7EB'

OUT = "/home/z/my-project/download"
os.makedirs(OUT, exist_ok=True)
D = "2026-09-27"
FIG = (12.8, 7.2)  # 1920×1080 @150 DPI

SRC_A = "Source : doc. « Analyse du document WAIRYU — Inventaire complet des Tests et Outils », sept. 2026"
SRC_B = "Source : doc. « Les Profils à Risque dans les Applications de Rencontre — Taxonomie et Détection Éthique », Wairyu, sept. 2026"


def save(fig, path):
    fig.savefig(path, dpi=150, facecolor='white', bbox_inches='tight', pad_inches=0.35)
    plt.close(fig)
    print(f"OK  {path}  ({os.path.getsize(path)//1024} Ko)")


def titles(ax, main, sub):
    ax.set_title(main, loc='left', fontsize=16, fontweight='bold', color=G900, pad=34)
    ax.text(0, 1.015, sub, transform=ax.transAxes, fontsize=11, color=G500, va='bottom')


def source(fig, txt):
    fig.text(0.01, 0.004, txt, fontsize=8.5, color=G400, ha='left', va='bottom')


def fr(x, dec=1):
    s = f"{x:.{dec}f}" if dec else f"{x:.0f}"
    return s.replace('.', ',')


# ════════════════════════════════════════════════════════════════════
# 1. BarH — Les 53 outils par bloc fonctionnel (Doc A)
# ════════════════════════════════════════════════════════════════════
def chart1():
    blocs = ["1 · Cœur Psychologique", "2 · Compas des Valeurs", "3 · Moteur Pragmatique",
             "4 · Mémoire Relationnelle", "5 · Styles d'Amour", "6 · Intimité et Désir",
             "7 · Garde-Fous UX", "8 · Fiabilité (métacouche)", "9 · Générateurs de Connexion"]
    vals = [8, 5, 9, 9, 2, 7, 4, 3, 6]

    fig, ax = plt.subplots(figsize=FIG)
    y = np.arange(len(blocs))[::-1]
    colors = [G200] * 9
    colors[2] = colors[3] = CB_BLUE  # les 2 blocs les plus fournis (9 outils)

    ax.barh(y, vals, color=colors, height=0.62, zorder=3, edgecolor='white', linewidth=0.5)
    for yy, v in zip(y, vals):
        hl = v >= 9
        ax.text(v + 0.15, yy, f"{v} outil{'s' if v > 1 else ''}", va='center',
                fontsize=10.5, fontweight='bold' if hl else 'normal',
                color=G900 if hl else G500)

    ax.set_yticks(y)
    ax.set_yticklabels(blocs, fontsize=11)
    ax.set_xlim(0, 10.8)
    ax.xaxis.set_visible(False)
    ax.spines['bottom'].set_visible(False)

    titles(ax, "53 outils de compatibilité répartis en 9 blocs fonctionnels",
           "Inventaire consolidé Wairyu — 17 outils au MVP, le reste en débloquage progressif (Phase 2-3)")
    source(fig, SRC_A)
    save(fig, f"{OUT}/BarChart_Outils_ParBloc_WAIRYU_{D}.png")


# ════════════════════════════════════════════════════════════════════
# 2. Barres groupées — Temps de passation MVP vs Complet (Doc A)
# ════════════════════════════════════════════════════════════════════
def chart2():
    short = ["B1\nCœur Psy", "B2\nValeurs", "B3\nPragmatique", "B4\nMémoire",
             "B5\nStyles d'amour", "B6\nIntimité", "B7\nGarde-fous",
             "B8\nFiabilité", "B9\nConnexion"]
    mvp = [8, 3, 6, 5, 0, 3, 3, 2, 6]
    complet = [18, 15, 20, 25, 10, 22, 15, 2, 6]

    fig, ax = plt.subplots(figsize=FIG)
    x = np.arange(9)
    w = 0.38
    b1 = ax.bar(x - w / 2, mvp, w, color=CB_BLUE, zorder=3, edgecolor='white',
                linewidth=0.4, label="MVP — inscription Jour 1 (Σ ≈ 36 min)")
    b2 = ax.bar(x + w / 2, complet, w, color=CB_ORANGE, zorder=3, edgecolor='white',
                linewidth=0.4, label="Complet — étalé sur 3 mois (Σ ≈ 2 h)")

    for bars, vals in ((b1, mvp), (b2, complet)):
        for bar, v in zip(bars, vals):
            lab = "—" if v == 0 else str(v)
            ax.text(bar.get_x() + bar.get_width() / 2, bar.get_height() + 0.45, lab,
                    ha='center', va='bottom', fontsize=9.5, color=G700)

    ax.set_xticks(x)
    ax.set_xticklabels(short, fontsize=9.5)
    ax.set_ylabel("Temps de passation (minutes)")
    ax.set_ylim(0, 30)
    ax.yaxis.grid(True, linestyle='--', alpha=0.3, color=G300)
    ax.set_axisbelow(True)
    ax.legend(loc='upper left', fontsize=10)

    titles(ax, "Temps de passation par bloc : 36 min au MVP, ≈ 2 h pour le parcours complet",
           "Règle 3-7-15 : valeurs + dealbreakers à 3 min, score crédible à ~10 min, le reste débloqué par récompenses gamifiées")
    source(fig, SRC_A)
    save(fig, f"{OUT}/GroupedBar_TempsPassation_Blocs_WAIRYU_{D}.png")


# ════════════════════════════════════════════════════════════════════
# 3. Donut — 24 profils à risque en 3 zones (Doc B)
# ════════════════════════════════════════════════════════════════════
def chart3():
    vals = [5, 9, 10]
    cols = [CB_RED, CB_ORANGE, '#F0E442']
    legend_labels = [
        "Zone Rouge (5) — bannissement / signalement :\n"
        "escroc sentimental, prédateur sexuel, catfisher,\n"
        "violent / menaçant, stalker",
        "Zone Orange (9) — surveillance / neutralisation :\n"
        "narcissique subclinique, machiavélique, psychopathe,\n"
        "gaslighteur, love bomber, contrôlant jaloux…",
        "Zone Jaune (10) — adaptation (pas d'exclusion) :\n"
        "dépendant affectif, co-dépendant, rebound chronique,\n"
        "évitant extrême, désorganisé, addict actif…",
    ]

    fig, ax = plt.subplots(figsize=(8, 8))
    pct_iter = iter(vals)

    def _fmt(p):
        v = next(pct_iter)
        return f"{v} profils\n{fr(p)} %"

    wedges, _, autotexts = ax.pie(
        vals, colors=cols, autopct=_fmt, startangle=90, pctdistance=0.80,
        wedgeprops=dict(width=0.38, edgecolor='white', linewidth=2))
    for t, c in zip(autotexts, ['white', 'white', '#4B4A45']):
        t.set_fontsize(11.5)
        t.set_fontweight('bold')
        t.set_color(c)

    ax.text(0, 0.07, "24", ha='center', va='center', fontsize=32, fontweight='bold', color=G900)
    ax.text(0, -0.13, "profils à risque", ha='center', va='center', fontsize=11.5, color=G500)

    ax.legend(wedges, legend_labels, loc='center left', bbox_to_anchor=(1.02, 0.5),
              fontsize=10, frameon=False, labelspacing=1.4)
    ax.set_title("Les 24 profils à risque en 3 zones d'action graduées",
                 loc='center', pad=22, fontsize=16, fontweight='bold', color=G900)
    source(fig, SRC_B)
    save(fig, f"{OUT}/Donut_ProfilesRisque_Zones_{D}.png")


# ════════════════════════════════════════════════════════════════════
# 4. Barres — Distribution cible des niveaux 0-5 (Doc B)
# ════════════════════════════════════════════════════════════════════
def chart4():
    niveaux = ["N0 · Calibration\nDéflation douce", "N1 · Correction\nVisibilité −30 %",
               "N2 · Adaptation\nGatekeeping", "N3 · Neutralisation\nVisibilité −70/80 %",
               "N4 · Hors circuit\nVisibilité −95 %", "N5 · Élimination\nBannissement"]
    mid = [92.5, 4.0, 2.0, 0.5, 0.05, 0.05]
    ranges = ["90–95 %", "3–5 %", "1–3 %", "< 1 %", "< 0,1 %", "< 0,1 %"]
    cols = [CB_TEAL, CB_BLUE, CB_CYAN, CB_ORANGE, CB_RED, CB_RED]

    fig, ax = plt.subplots(figsize=FIG)
    x = np.arange(6)
    bars = ax.bar(x, mid, color=cols, width=0.58, zorder=3, edgecolor='white', linewidth=0.5)
    for bar, r in zip(bars, ranges):
        ax.text(bar.get_x() + bar.get_width() / 2, bar.get_height() + 1.6, r,
                ha='center', va='bottom', fontsize=11, fontweight='bold', color=G700)

    ax.set_xticks(x)
    ax.set_xticklabels(niveaux, fontsize=9.5)
    ax.set_ylabel("% de la population active (cible)")
    ax.set_ylim(0, 112)
    ax.yaxis.grid(True, linestyle='--', alpha=0.3, color=G300)
    ax.set_axisbelow(True)

    titles(ax, "Distribution cible des niveaux de sécurité : 90-95 % de la population au Niveau 0",
           "Échelle graduée N0→N5 — plus la sanction est grave, plus la preuve doit être forte · alerte de gouvernance si N0 < 85 %")
    source(fig, SRC_B)
    save(fig, f"{OUT}/BarChart_DistributionCible_Niveaux_{D}.png")


# ════════════════════════════════════════════════════════════════════
# 5. Barres groupées ×3 — Simulateur de dérive à 36 mois (Doc B)
# ════════════════════════════════════════════════════════════════════
def chart5():
    scen = ["S0 Témoin\n(sans verrous)", "S1 Punitif", "S2 Standard", "S3 Clément", "S4 Adaptatif"]
    sains = [44.7, 68.9, 91.6, 95.8, 93.2]
    infl = [55.3, 31.1, 8.4, 3.9, 6.3]
    fpx = [21.9, 9.8, 1.8, 0.5, 0.9]

    fig, ax = plt.subplots(figsize=FIG)
    x = np.arange(5)
    w = 0.26
    series = [
        (sains, CB_TEAL, "Population saine (Niveau 0)"),
        (infl, CB_RED, "Inflation Niveau 1+ (profils flaggés)"),
        (fpx, G400, "Faux positifs Niveau 2+"),
    ]
    for i, (vals, col, lab) in enumerate(series):
        offset = (i - 1) * w
        bars = ax.bar(x + offset, vals, w, color=col, zorder=3,
                      edgecolor='white', linewidth=0.4, label=lab)
        for bar, v in zip(bars, vals):
            ax.text(bar.get_x() + bar.get_width() / 2, bar.get_height() + 1.6,
                    fr(v), ha='center', va='bottom', fontsize=8.8, color=G700)

    ax.set_xticks(x)
    ax.set_xticklabels(scen, fontsize=10.5)
    ax.set_ylabel("% de la population à 36 mois")
    ax.set_ylim(0, 117)
    ax.yaxis.grid(True, linestyle='--', alpha=0.3, color=G300)
    ax.set_axisbelow(True)
    ax.legend(loc='upper left', bbox_to_anchor=(0.02, 0.98), fontsize=10)

    titles(ax, "Simulateur de dérive sur 36 mois : les 8 verrous anti-inflation tiennent",
           "Monte-Carlo, 100 000 agents — S4 « Adaptatif » retenu pour la production : 93,2 % sains · 6,3 % d'inflation · 0,9 % de faux positifs")
    source(fig, SRC_B + " — partie « Simulateur de dérive » (scénarios S0-S4)")
    save(fig, f"{OUT}/GroupedBar_SimulateurDerive_36Mois_{D}.png")


if __name__ == "__main__":
    chart1()
    chart2()
    chart3()
    chart4()
    chart5()
    print("Terminé : 5 graphiques générés.")
