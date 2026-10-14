# -*- coding: utf-8 -*-
"""
Visualisations du projet « Application de thérapie de couple »
Source : OUTILS DE TERAPIE DU COUPLE.txt (analyse documentaire)
Sortie : PNG 1920x1080, 150 DPI, palette colorblind-friendly
"""
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import matplotlib.ticker
import numpy as np
import os

# ------------------------------------------------------------------
# Configuration globale (police : DejaVu Sans = accents français OK)
# ------------------------------------------------------------------
plt.rcParams["font.sans-serif"] = ["DejaVu Sans", "Arial", "Helvetica"]
plt.rcParams["font.family"] = "sans-serif"
plt.rcParams["axes.unicode_minus"] = False

OUT = "/home/z/my-project/download"
os.makedirs(OUT, exist_ok=True)

SOURCE = "Source : analyse documentaire « OUTILS DE THERAPIE DU COUPLE » (extraits de recherche clinique) — 14/10/2026"

# Palette Okabe-Ito (colorblind-friendly)
BLEU   = "#0072B2"
BLEU_C = "#56B4E9"
ORANGE = "#E69F00"
VERT   = "#009E73"
ROUGE  = "#D55E00"
ROSE   = "#CC79A7"
GRIS   = "#8C8C8C"
GRIS_C = "#D9D9D9"


def styliser_ax(ax):
    """Grille claire pointillée (verticale pour barh) + spines épurées."""
    ax.xaxis.grid(True, linestyle="--", linewidth=0.7, color=GRIS_C, zorder=0)
    ax.set_axisbelow(True)
    for spine in ["top", "right", "left"]:
        ax.spines[spine].set_visible(False)
    ax.spines["bottom"].set_color("#BBBBBB")


def ajouter_source(fig):
    fig.text(0.01, 0.012, SOURCE, fontsize=7.5, color="#777777", ha="left")


# ==================================================================
# GRAPHIQUE 1 — Taux de succès comparés par modalité
# ==================================================================
def chart1():
    data = [
        ("Thérapie EFT / IBCT\n(conditions expérimentales)", 80, 80, 80, "therapie"),
        ("Thérapie de couple avec psychologue\n(les 2 partenaires)", 75, 70, 80, "therapie"),
        ("Thérapie EFT — taux de récupération", 71.5, 70, 73, "therapie"),
        ("Application + coach humain (modèle hybride)", 60, 55, 65, "hybride"),
        ("Thérapie individuelle avec psychologue\n(1 seul partenaire)", 51, 51, 51, "therapie"),
        ("Application seule (auto-assistance)", 40, 35, 45, "app"),
        ("Pratique clinique réelle\n(Allemagne / Suisse)", 40, 40, 40, "app"),
    ]
    labels = [d[0] for d in data]
    vals   = [d[1] for d in data]
    lows   = [d[2] for d in data]
    highs  = [d[3] for d in data]
    cats   = [d[4] for d in data]
    colors = {"therapie": BLEU, "hybride": VERT, "app": ORANGE}
    bar_colors = [colors[c] for c in cats]

    fig, ax = plt.subplots(figsize=(12.8, 7.2), dpi=150)
    y = np.arange(len(labels))[::-1]
    ax.barh(y, vals, height=0.62, color=bar_colors, zorder=3)

    # Barres d'intervalle (min-max) pour les données de plage
    for yi, v, lo, hi in zip(y, vals, lows, highs):
        if hi > lo:
            ax.plot([lo, hi], [yi, yi], color="#333333", linewidth=1.6, zorder=4)
            ax.plot([lo, lo], [yi - 0.16, yi + 0.16], color="#333333", linewidth=1.6, zorder=4)
            ax.plot([hi, hi], [yi - 0.16, yi + 0.16], color="#333333", linewidth=1.6, zorder=4)

    # Étiquettes de valeurs
    for yi, v, lo, hi in zip(y, vals, lows, highs):
        if hi > lo:
            txt = f"{int(lo)}–{int(hi)} %"
        else:
            txt = f"≈ {int(v)} %"
        ax.text(hi + 1.2, yi, txt, va="center", ha="left", fontsize=10.5,
                fontweight="bold", color="#333333")

    ax.set_yticks(y)
    ax.set_yticklabels(labels, fontsize=10)
    ax.set_xlim(0, 97)
    ax.set_xlabel("Taux d'amélioration cliniquement significative (%)", fontsize=11)
    ax.set_title("Efficacité comparée des modalités d'aide au couple",
                 fontsize=16, fontweight="bold", pad=42, loc="left")
    ax.text(0, 1.055, "La présence d'un professionnel reste le facteur différenciant — "
                      "taille d'effet : d ≈ 0,8 (thérapie) vs Hedges' g = 0,42 (application seule)",
            transform=ax.transAxes, fontsize=10, color="#555555")

    # Repère : abandon précoce
    ax.axvline(50, color=ROUGE, linestyle=":", linewidth=1.4, zorder=2)
    ax.text(50.7, y.min() - 0.75, "≈ 50 % d'abandon précoce en pratique réelle",
            fontsize=8.5, color=ROUGE, ha="left")

    handles = [mpatches.Patch(color=BLEU, label="Thérapie avec professionnel"),
               mpatches.Patch(color=VERT, label="Modèle hybride (app + coach)"),
               mpatches.Patch(color=ORANGE, label="Application seule")]
    ax.legend(handles=handles, loc="lower right", fontsize=9.5, frameon=False)

    styliser_ax(ax)
    fig.subplots_adjust(left=0.30, right=0.97, top=0.86, bottom=0.13)
    ajouter_source(fig)
    fig.savefig(os.path.join(OUT, "BarChart_TauxSucces_Modalites_2026-10-14.png"),
                dpi=150, bbox_inches="tight", facecolor="white")
    plt.close(fig)


# ==================================================================
# GRAPHIQUE 2 — Inventaire des outils validés par domaine
# ==================================================================
def chart2():
    data = [
        ("Enfants & parentalité", 10, "SDQ, CBCL, CAPES, CPIC, CRS-C, PSI, PSI-SF, PSQ, PQ-Y, BSQ"),
        ("Violence & dangerosité", 8, "DA, HITS, WAST, PVS, Violentomètre, C-CAS, CAS, CTS-2"),
        ("Perception du partenaire & schémas", 7, "Couple's Grid, PSI, MAS, HARRT, ENRICH-IDS, Truth & Bias"),
        ("Satisfaction & ajustement global", 6, "CSI-16, RDAS, Gottman Checkup, C-SCORE-26, RAS, KMSS"),
        ("Risque de rupture & divorce", 6, "MSI, MII, DPS, OHRS-R, Éch. instabilité, Burnout conjugal"),
        ("Santé mentale", 5, "BDI, PHQ-9, C-SSRS, SPS, SCL-90-R"),
        ("Addictions & conduites", 5, "AUDIT, DAST, CAGE-DETA, SOGS, TAPS"),
        ("Coparentage", 5, "CRS, CECOP, PAM, Échelle McHale, CI-PP"),
        ("Attachement & régulation émotionnelle", 4, "RSQ, ECR, DERS-D, SIERC"),
        ("Communication & conflits", 4, "CPQ, GSRHQ-CM, RPCS, Patterns of Problem Solving"),
        ("Intimité & sexualité", 3, "PAIR, HISC, ISS"),
        ("Maintenance & pardon", 3, "RMSM, Maintenance Behavior, MOFS"),
        ("Finances du couple", 1, "CFCS"),
    ]
    labels = [d[0] for d in data]
    vals   = [d[1] for d in data]
    details = [d[2] for d in data]

    fig, ax = plt.subplots(figsize=(12.8, 7.2), dpi=150)
    y = np.arange(len(labels))[::-1]
    max_v = max(vals)
    for yi, v in zip(y, vals):
        ax.barh(yi, v, height=0.62, color=BLEU, alpha=0.55 + 0.45 * v / max_v, zorder=3)

    for yi, v, det in zip(y, vals, details):
        ax.text(v + 0.12, yi, f"{v}  ·  {det}", va="center", ha="left",
                fontsize=7.8, color="#444444")

    ax.set_yticks(y)
    ax.set_yticklabels(labels, fontsize=9.8)
    ax.set_xlim(0, 21)
    ax.set_xticks(range(0, 21, 2))
    ax.set_xlabel("Nombre d'instruments validés recensés", fontsize=11)
    ax.set_title("Inventaire des outils et tests validés — 67 instruments au total",
                 fontsize=16, fontweight="bold", pad=40, loc="left")
    ax.text(0, 1.06, "Couverture « à 360° » du couple : après chaque barre, les instruments recensés dans le document",
            transform=ax.transAxes, fontsize=10, color="#555555")

    styliser_ax(ax)
    fig.subplots_adjust(left=0.26, right=0.98, top=0.85, bottom=0.12)
    ajouter_source(fig)
    fig.savefig(os.path.join(OUT, "BarChart_InventaireOutils_Domaines_2026-10-14.png"),
                dpi=150, bbox_inches="tight", facecolor="white")
    plt.close(fig)


# ==================================================================
# GRAPHIQUE 3 — Nombre d'items des principaux tests
# ==================================================================
def chart3():
    data = [  # (nom, items, domaine)
        ("Gottman Relationship Checkup", 337, "Global"),
        ("GSRHQ-CM (conflits, Gottman)", 113, "Communication"),
        ("SCL-90-R (symptômes psy.)", 90, "Santé mentale"),
        ("ECR (attachement adulte)", 40, "Attachement"),
        ("PAIR (intimité relationnelle)", 36, "Intimité"),
        ("CRS (coparentage)", 35, "Coparentage"),
        ("DAS (ajustement dyadique)", 32, "Global"),
        ("C-CAS (contrôle coercitif)", 30, "Violence"),
        ("C-SCORE-26 (profil relationnel)", 26, "Global"),
        ("Marital Burnout (Pines)", 21, "Rupture"),
        ("CSI-16 (satisfaction)", 16, "Global"),
        ("RDAS (ajustement abrégé)", 14, "Global"),
        ("RAS (satisfaction brève)", 7, "Global"),
        ("KMSS (satisfaction ultra-brève)", 3, "Global"),
    ]
    dom_colors = {"Global": BLEU, "Communication": BLEU_C, "Santé mentale": ROSE,
                  "Attachement": ROUGE, "Intimité": ORANGE, "Coparentage": VERT,
                  "Violence": "#955196", "Rupture": GRIS}
    labels = [d[0] for d in data]
    vals   = [d[1] for d in data]
    cols   = [dom_colors[d[2]] for d in data]

    fig, ax = plt.subplots(figsize=(12.8, 7.2), dpi=150)
    y = np.arange(len(labels))[::-1]
    ax.barh(y, vals, height=0.62, color=cols, zorder=3)

    for yi, v in zip(y, vals):
        ax.text(v * 1.08, yi, str(v), va="center", ha="left",
                fontsize=10, fontweight="bold", color="#333333")

    ax.set_yticks(y)
    ax.set_yticklabels(labels, fontsize=9.6)
    ax.set_xscale("log")
    ax.set_xlim(2, 700)
    ax.set_xticks([3, 7, 14, 30, 90, 337])
    ax.get_xaxis().set_major_formatter(matplotlib.ticker.ScalarFormatter())
    ax.set_xlabel("Nombre d'items du questionnaire (échelle logarithmique)", fontsize=11)
    ax.set_title("Longueur des principaux questionnaires validés — de l'ultra-bref à l'approfondi",
                 fontsize=15.5, fontweight="bold", pad=40, loc="left")
    ax.text(0, 1.06, "Un parcours en 3 temps : dépistage court (KMSS/RAS/RDAS) → profil multidimensionnel (C-SCORE-26) → évaluation approfondie (Gottman 337)",
            transform=ax.transAxes, fontsize=9.5, color="#555555")

    handles = [mpatches.Patch(color=c, label=d) for d, c in dom_colors.items()]
    ax.legend(handles=handles, loc="lower right", fontsize=9, frameon=False, ncol=2)

    styliser_ax(ax)
    fig.subplots_adjust(left=0.28, right=0.97, top=0.85, bottom=0.13)
    ajouter_source(fig)
    fig.savefig(os.path.join(OUT, "BarChart_TestsValides_NbItems_2026-10-14.png"),
                dpi=150, bbox_inches="tight", facecolor="white")
    plt.close(fig)


# ==================================================================
# GRAPHIQUE 4 — Parcours de reconstruction : 17 modules
# ==================================================================
def chart4():
    data = [  # (n°, thème, durée moyenne en semaines, libellé, priorité)
        (1,  "Stabilisation émotionnelle",   2.0, "2 sem.",       "Fondamentale"),
        (2,  "Blessures d'attachement",      3.0, "3 sem.",       "Fondamentale"),
        (3,  "Restructuration cognitive",    2.0, "2 sem.",       "Fondamentale"),
        (4,  "Compétences relationnelles",   3.0, "3 sem.",       "Fondamentale"),
        (5,  "Reconstruction identitaire",   2.0, "2 sem.",       "Fondamentale"),
        (6,  "Deuil et acceptation",         2.0, "2 sem.",       "Essentielle"),
        (7,  "Sexualité et intimité",        3.0, "3 sem.",       "Essentielle"),
        (8,  "Désescalade avancée",          4.0, "4 sem.",       "Essentielle"),
        (9,  "Confiance et trahison",        7.0, "6–8 sem.",     "Essentielle"),
        (10, "Résilience et sens",           2.0, "2 sem.",       "Essentielle"),
        (11, "Trauma complexe",             10.0, "8–12 sem.",    "Critique"),
        (12, "Anxiété et dépression",        5.0, "4–6 sem.",     "Critique"),
        (13, "Addictions",                   7.0, "6–8 sem.",     "Critique"),
        (14, "Colère et agressivité",        4.0, "4 sem.",       "Critique"),
        (15, "Parentalité et famille",       3.5, "3–4 sem.",     "Importante"),
        (16, "Argent et finances",           2.5, "2–3 sem.",     "Importante"),
        (17, "Prévention de la rechute",     2.0, "2 sem.",       "Importante"),
    ]
    prio_colors = {"Fondamentale": BLEU, "Essentielle": BLEU_C,
                   "Critique": ROUGE, "Importante": VERT}
    labels = [f"M{n:02d} — {th}" for n, th, *_ in data]
    vals   = [d[2] for d in data]
    libs   = [d[3] for d in data]
    cols   = [prio_colors[d[4]] for d in data]

    fig, ax = plt.subplots(figsize=(12.8, 7.2), dpi=150)
    y = np.arange(len(labels))[::-1]
    ax.barh(y, vals, height=0.64, color=cols, zorder=3)

    for yi, v, lib in zip(y, vals, libs):
        ax.text(v + 0.12, yi, lib, va="center", ha="left",
                fontsize=9, color="#333333", fontweight="bold")

    ax.set_yticks(y)
    ax.set_yticklabels(labels, fontsize=8.8)
    ax.set_xlim(0, 12.4)
    ax.set_xticks(range(0, 13, 2))
    ax.set_xlabel("Durée estimée du module (semaines — valeurs médianes des fourchettes)", fontsize=11)
    ax.set_title("Parcours de reconstruction en 17 modules — 12 à 18 mois au rythme flexible",
                 fontsize=15.5, fontweight="bold", pad=40, loc="left")
    ax.text(0, 1.06, "Architecture : socle M01–M05 (obligatoire) → personnalisés M06–M10 → spécialisés M11–M14 (si signal clinique) → contextuels M15–M16 → clôture M17",
            transform=ax.transAxes, fontsize=9, color="#555555")

    handles = [mpatches.Patch(color=c, label=p) for p, c in prio_colors.items()]
    ax.legend(handles=handles, loc="lower right", fontsize=9.5, frameon=False,
              title="Niveau de priorité", title_fontsize=9.5)

    styliser_ax(ax)
    fig.subplots_adjust(left=0.24, right=0.97, top=0.85, bottom=0.13)
    ajouter_source(fig)
    fig.savefig(os.path.join(OUT, "BarChart_Parcours17Modules_2026-10-14.png"),
                dpi=150, bbox_inches="tight", facecolor="white")
    plt.close(fig)


# ==================================================================
# GRAPHIQUE 5 — Tarification du marché (équivalent mensuel)
# ==================================================================
def chart5():
    data = [  # (nom, €/mois équivalent, lo, hi, type)
        ("Zenlove (39,99 €/an)",                3.3,  3.3,  3.3,  "concurrent"),
        ("Offre Premium — projet\n(app seule, 40–60 €/an)", 4.2, 3.3, 5.0, "projet"),
        ("Pragma (IA seule, 19,99 $/mois)",    18.4, 18.4, 18.4, "concurrent"),
        ("Offre Hybride — projet\n(app + thérapeute, 150–300 €/mois)", 225, 150, 300, "projet"),
        ("OurRitual (240–310 $/mois)",         253, 220, 285, "concurrent"),
        ("Regain (70–100 $/semaine)",          348, 287, 410, "concurrent"),
    ]
    labels = [d[0] for d in data]
    vals   = [d[1] for d in data]
    lows   = [d[2] for d in data]
    highs  = [d[3] for d in data]
    cols   = [ORANGE if d[4] == "projet" else BLEU for d in data]

    fig, ax = plt.subplots(figsize=(12.8, 7.2), dpi=150)
    y = np.arange(len(labels))[::-1]
    ax.barh(y, vals, height=0.6, color=cols, zorder=3)

    for yi, v, lo, hi in zip(y, vals, lows, highs):
        if hi > lo:
            ax.plot([lo, hi], [yi, yi], color="#333333", linewidth=1.6, zorder=4)
            ax.plot([lo, lo], [yi - 0.15, yi + 0.15], color="#333333", linewidth=1.6, zorder=4)
            ax.plot([hi, hi], [yi - 0.15, yi + 0.15], color="#333333", linewidth=1.6, zorder=4)
            txt = f"{lo:.0f}–{hi:.0f} €/mois"
        else:
            txt = f"≈ {v:.1f} €/mois" if v < 10 else f"≈ {v:.0f} €/mois"
        ax.text(hi + 7, yi, txt, va="center", ha="left", fontsize=9.6,
                fontweight="bold", color="#333333")

    ax.set_yticks(y)
    ax.set_yticklabels(labels, fontsize=9.6)
    ax.set_xlim(0, 500)
    ax.set_xlabel("Prix équivalent mensuel (€, ordre de grandeur — conversion 1 $ ≈ 0,92 €)", fontsize=11)
    ax.set_title("Positionnement tarifaire : concurrents existants vs offre du projet",
                 fontsize=15.5, fontweight="bold", pad=40, loc="left")
    ax.text(0, 1.06, "Segmentation en 4 niveaux : Gratuit (acquisition) → Premium app seule → Hybride avec thérapeute → B2B/employeurs (sur devis, non représenté)",
            transform=ax.transAxes, fontsize=9.3, color="#555555")

    handles = [mpatches.Patch(color=BLEU, label="Concurrents existants"),
               mpatches.Patch(color=ORANGE, label="Offre du projet (proposition)")]
    ax.legend(handles=handles, loc="upper right", fontsize=9.5, frameon=False,
              bbox_to_anchor=(0.98, 0.97))

    styliser_ax(ax)
    fig.subplots_adjust(left=0.30, right=0.96, top=0.85, bottom=0.13)
    ajouter_source(fig)
    fig.savefig(os.path.join(OUT, "BarChart_Tarification_Marche_2026-10-14.png"),
                dpi=150, bbox_inches="tight", facecolor="white")
    plt.close(fig)


if __name__ == "__main__":
    chart1(); print("Chart 1 OK")
    chart2(); print("Chart 2 OK")
    chart3(); print("Chart 3 OK")
    chart4(); print("Chart 4 OK")
    chart5(); print("Chart 5 OK")
    print("Terminé.")
