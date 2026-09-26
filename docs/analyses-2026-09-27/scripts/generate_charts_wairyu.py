# -*- coding: utf-8 -*-
"""
Génération des visualisations — PROJET WAIRYU — Spécification Produit v0.1
7 graphiques PNG (16:9, 1920x1080, 150 DPI, palette daltonien-friendly Okabe-Ito)
Sortie : /home/z/my-project/download/
"""
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np
import os

OUT = '/home/z/my-project/download'
os.makedirs(OUT, exist_ok=True)

plt.rcParams.update({
    'font.family': 'sans-serif',
    'font.sans-serif': ['DejaVu Sans', 'Arial'],
    'axes.unicode_minus': False,
    'axes.edgecolor': '#555555',
    'axes.labelcolor': '#1a1a1a',
    'text.color': '#1a1a1a',
    'xtick.color': '#333333',
    'ytick.color': '#333333',
    'axes.titleweight': 'bold',
})

# Palette Okabe-Ito (accessible daltoniens)
C_BLUE, C_ORANGE, C_GREEN, C_VERM = '#0072B2', '#E69F00', '#009E73', '#D55E00'
C_PINK, C_SKY, C_GREY, C_PURPLE = '#CC79A7', '#56B4E9', '#9A9A9A', '#6A51A3'

SRC = "Source : PROJET WAIRYU — Spécification Produit v0.1 (version réaliste)"
DATE = "2026-09-27"
DPI, FIGSIZE = 150, (12.8, 7.2)


def clean_ax(ax, grid_axis='x'):
    ax.set_axisbelow(True)
    ax.grid(axis=grid_axis, linestyle='--', linewidth=0.7, color='#DDDDDD')
    for s in ('top', 'right'):
        ax.spines[s].set_visible(False)


def add_src(fig):
    fig.text(0.01, 0.005, SRC, fontsize=8, color='#777777', ha='left')


# ============================================================
# 1) Le paradoxe du marché : fatigue & insatisfaction
# ============================================================
fig, axes = plt.subplots(1, 2, figsize=FIGSIZE, gridspec_kw={'width_ratios': [1.25, 1]})
fig.suptitle("Le paradoxe du marché de la rencontre en ligne : audience croissante, satisfaction en baisse",
             fontsize=15, y=0.97)

labels1 = ["Burnout émotionnel/mental", "Pause prise sur 12 mois",
           "Désinstallation sous 1 mois", "Envie d'arrêter (temps investi)",
           "Annulation de dernière minute", "1er rendez-vous sans suite"]
vals1 = [78, 75, 69, 61, 45, 27]
order = np.argsort(vals1)
ax = axes[0]
ax.barh([labels1[i] for i in order], [vals1[i] for i in order], color=C_BLUE, height=0.62)
for y, v in enumerate([vals1[i] for i in order]):
    ax.text(v + 1.2, y, f"{v} %", va='center', fontsize=10, fontweight='bold', color=C_BLUE)
ax.set_xlim(0, 92)
ax.set_xlabel("% des utilisateurs interrogés")
ax.set_title("Indicateurs de fatigue du modèle « swipe » (2024-2025)", fontsize=11.5)
clean_ax(ax)

labels2 = ["Manque de connexions\nsignificatives", "Déception", "Rejet", "Répétition des\nconversations"]
vals2 = [40, 35, 27, 24]
ax = axes[1]
bars = ax.barh(labels2[::-1], vals2[::-1], color=[C_ORANGE, C_ORANGE, C_ORANGE, C_ORANGE], height=0.55)
for y, v in enumerate(vals2[::-1]):
    ax.text(v + 0.8, y, f"{v} %", va='center', fontsize=10, fontweight='bold', color=C_VERM)
ax.set_xlim(0, 48)
ax.set_xlabel("% des utilisateurs")
ax.set_title("Causes citées de l'insatisfaction", fontsize=11.5)
clean_ax(ax)

fig.text(0.5, 0.075, "Ghosting moyen : 4 fois/an (5 pour les femmes) · 40 swipes nécessaires pour 1 match "
                     "(34 en Gen Z) · 60 % des Français exposés au catfishing (Kaspersky)",
         ha='center', fontsize=9.5, style='italic', color='#444444')
add_src(fig)
fig.tight_layout(rect=[0, 0.10, 1, 0.94])
fig.savefig(f'{OUT}/BarChart_MarcheRencontre_{DATE}.png', dpi=DPI, facecolor='white', bbox_inches=None)
plt.close(fig)
print("OK 1/7 Marché")

# ============================================================
# 2) Projections économiques sur 3 ans
# ============================================================
fig, axes = plt.subplots(1, 2, figsize=FIGSIZE, gridspec_kw={'width_ratios': [1.25, 1]})
fig.suptitle("Trajectoire économique de Wairyu sur 3 ans : rentabilité attendue en Année 2", fontsize=15, y=0.97)

years = ["Année 1", "Année 2", "Année 3"]
users_lbl = ["100 000\nutilisateurs", "500 000\nutilisateurs", "1 500 000\nutilisateurs"]
x = np.arange(3)
rev, cost = [540, 2700, 8100], [900, 2000, 5000]
ax = axes[0]
ax.bar(x - 0.2, rev, width=0.38, color=C_BLUE, label="Revenus estimés")
ax.bar(x + 0.2, cost, width=0.38, color=C_GREY, label="Coûts estimés")
for i in range(3):
    ax.text(x[i] - 0.2, rev[i] + 120, f"{rev[i]:,}".replace(',', ' '), ha='center', fontsize=9.5, fontweight='bold', color=C_BLUE)
    ax.text(x[i] + 0.2, cost[i] + 120, f"{cost[i]:,}".replace(',', ' '), ha='center', fontsize=9.5, fontweight='bold', color='#555555')
ax.set_xticks(x, [f"{a}\n({b})" for a, b in zip(years, users_lbl)])
ax.set_ylabel("Milliers d'euros (k€/an)")
ax.set_ylim(0, 9200)
ax.legend(frameon=False, loc='upper left')
ax.set_title("Revenus vs coûts par année (3 % de payants)", fontsize=11.5)
clean_ax(ax, 'y')

profit = [-360, 700, 3100]
ax = axes[1]
colors = [C_VERM if p < 0 else C_GREEN for p in profit]
ax.bar(years, profit, color=colors, width=0.55)
ax.axhline(0, color='#333333', linewidth=0.9)
for i, p in enumerate(profit):
    off = 140 if p > 0 else -360
    ax.text(i, p + off, f"{'+' if p > 0 else ''}{p:,}".replace(',', ' ') + " k€",
            ha='center', fontsize=11, fontweight='bold', color=colors[i])
ax.set_ylabel("Bénéfice net estimé (k€/an)")
ax.set_ylim(-900, 3900)
ax.set_title("Bénéfice annuel : déficit la 1re année, rentable ensuite", fontsize=11.5)
clean_ax(ax, 'y')

fig.text(0.5, 0.075, "Hypothèses : conversion freemium → Wairyu+ de 3 % · ARPU 1,50 €/mois · "
                     "LTV 45 € · dépendance aux investisseurs en Année 1",
         ha='center', fontsize=9.5, style='italic', color='#444444')
add_src(fig)
fig.tight_layout(rect=[0, 0.10, 1, 0.94])
fig.savefig(f'{OUT}/BarChart_Projections3Ans_{DATE}.png', dpi=DPI, facecolor='white')
plt.close(fig)
print("OK 2/7 Projections")

# ============================================================
# 3) Répartition des sources de revenus (donut)
# ============================================================
fig = plt.figure(figsize=FIGSIZE)
ax = fig.add_axes([0.03, 0.06, 0.52, 0.80])
sources = ["Wairyu+ (abonnements)", "Wairyu Elite", "Achats à l'unité (IAP)",
           "Pass Alchimie", "Certification de profil", "Événements"]
parts = [50, 20, 15, 5, 5, 5]
cols = [C_BLUE, C_VERM, C_ORANGE, C_GREEN, C_PINK, C_SKY]
wedges, _, autotexts = ax.pie(parts, colors=cols, startangle=90, counterclock=False,
                              autopct=lambda p: f"{p:.0f} %" if p >= 10 else '',
                              pctdistance=0.79, wedgeprops=dict(width=0.42, edgecolor='white', linewidth=2))
for t in autotexts:
    t.set_color('white'); t.set_fontweight('bold'); t.set_fontsize(12)
for w, p in zip(wedges, parts):
    if p < 10:
        a = np.deg2rad((w.theta1 + w.theta2) / 2)
        ax.text(0.87 * np.cos(a), 0.87 * np.sin(a), f"{p} %", ha='center', va='center',
                fontsize=9, fontweight='bold', color='#333333')
ax.text(0, 0.07, "Revenus cibles", ha='center', fontsize=12, fontweight='bold')
ax.text(0, -0.10, "maturité (phases 2-3)", ha='center', fontsize=9.5, color='#555555')
ax.set_title("Répartition estimée des sources de revenus de Wairyu", fontsize=15, pad=14)

leg_labels = [f"{s} — {p} %" for s, p in zip(sources, parts)]
fig.legend(wedges, leg_labels, loc='center left', bbox_to_anchor=(0.56, 0.5),
           fontsize=11, frameon=False, title="Source de revenus", title_fontsize=12)
fig.text(0.56, 0.17, "Le freemium éthique repose sur les abonnements (70 %),\n"
                     "complétés par les micro-achats et les services (30 %).",
         fontsize=10, color='#444444')
add_src(fig)
fig.savefig(f'{OUT}/DonutChart_SourcesRevenus_{DATE}.png', dpi=DPI, facecolor='white')
plt.close(fig)
print("OK 3/7 Revenus")

# ============================================================
# 4) Structure des coûts — Année 1
# ============================================================
fig, ax = plt.subplots(figsize=FIGSIZE)
fig.suptitle("Structure des coûts mensuels — Année 1 (couverts par les investisseurs)", fontsize=15, y=0.97)
posts = ["Personnel (8 personnes)", "Marketing & acquisition", "Tokens IA (matching, modération)",
         "Infrastructure cloud", "Juridique & conformité", "Vérification d'identité"]
vals = [60, 30, 8, 5, 5, 4]
order = np.argsort(vals)
ax.barh([posts[i] for i in order], [vals[i] for i in order],
        color=[C_BLUE if vals[i] >= 30 else C_SKY for i in order], height=0.6)
for y, v in enumerate([vals[i] for i in order]):
    ax.text(v + 0.7, y, f"{v} k€", va='center', fontsize=11, fontweight='bold', color=C_BLUE)
ax.set_xlabel("Coût mensuel estimé (k€)")
ax.set_xlim(0, 70)
ax.set_title("Total : 112 000 €/mois — Revenus estimés Année 1 : 45 000 €/mois — Déficit : 67 000 €/mois",
             fontsize=11.5)
clean_ax(ax)
fig.text(0.5, 0.075, "La masse salariale et le marketing représentent 80 % des coûts ; "
                     "l'IA (8 k€) et la vérification d'identité (4 k€) financent l'éthique produit.",
         ha='center', fontsize=9.5, style='italic', color='#444444')
add_src(fig)
fig.tight_layout(rect=[0, 0.10, 1, 0.94])
fig.savefig(f'{OUT}/BarChart_CoutsAnnee1_{DATE}.png', dpi=DPI, facecolor='white')
plt.close(fig)
print("OK 4/7 Coûts")

# ============================================================
# 5) Parcours Mode Invisible — objectifs par étape
# ============================================================
fig, ax = plt.subplots(figsize=FIGSIZE)
fig.suptitle("Parcours utilisateur en Mode Invisible : objectifs réalistes à chaque étape", fontsize=15, y=0.97)
steps = ["Complétion de l'inscription", "Vérification selfie réussie", "Complétion questionnaire Niveau 1",
         "Conversation après match", "Choix du Mode Invisible", "Complétion questionnaire Niveau 2",
         "Révélation mutuelle", "Rendez-vous IRL"]
vals = [70, 85, 60, 50, 30, 30, 20, 15]
grad = plt.cm.Blues(np.linspace(0.85, 0.35, len(steps)))
order = np.argsort(vals)
ax.barh([steps[i] for i in order], [vals[i] for i in order], color=grad[order], height=0.62)
for y, v in enumerate([vals[i] for i in order]):
    ax.text(v + 1.2, y, f"objectif > {v} %", va='center', fontsize=10, fontweight='bold', color='#1a4f7a')
ax.set_xlabel("Taux cible (%) — objectifs par étape, non cumulés")
ax.set_xlim(0, 100)
clean_ax(ax)
fig.text(0.5, 0.075, "Points critiques : complétion du Niveau 1 (porte d'entrée du Mode Invisible) et "
                     "taux de révélation mutuelle (> 20 %) — la métrique reine : relations mutuellement satisfaisantes créées.",
         ha='center', fontsize=9.5, style='italic', color='#444444')
add_src(fig)
fig.tight_layout(rect=[0, 0.10, 1, 0.94])
fig.savefig(f'{OUT}/FunnelChart_ParcoursModeInvisible_{DATE}.png', dpi=DPI, facecolor='white')
plt.close(fig)
print("OK 5/7 Parcours")

# ============================================================
# 6) Tarification des abonnements
# ============================================================
fig, ax = plt.subplots(figsize=FIGSIZE)
fig.suptitle("Tarification des abonnements premium : mensuel vs équivalent mensuel", fontsize=15, y=0.97)
x = np.arange(3)
wp = [19.99, 16.66, 12.50]
el = [49.99, 43.33, 33.33]
labels_x = ["Mensuel", "Trimestriel\n(-17 % Wairyu+ / -13 % Elite)", "Annuel\n(-37 % Wairyu+ / -33 % Elite)"]
ax.bar(x - 0.2, wp, width=0.38, color=C_BLUE, label="Wairyu+ (MVP)")
ax.bar(x + 0.2, el, width=0.38, color=C_ORANGE, label="Wairyu Elite (Phase 3, limité à 5 %)")
for i in range(3):
    ax.text(x[i] - 0.2, wp[i] + 1.2, f"{wp[i]:.2f} €", ha='center', fontsize=10.5, fontweight='bold', color=C_BLUE)
    ax.text(x[i] + 0.2, el[i] + 1.2, f"{el[i]:.2f} €", ha='center', fontsize=10.5, fontweight='bold', color=C_VERM)
ax.set_xticks(x, labels_x)
ax.set_ylabel("Prix en € / mois")
ax.set_ylim(0, 60)
ax.legend(frameon=False, loc='upper right')
ax.set_title("Rentabilité : Wairyu+ rentable dès ~400 abonnés (marge 92 %) — Elite dès ~100 abonnés (marge 70 %)",
             fontsize=11.5)
clean_ax(ax, 'y')
fig.text(0.5, 0.075, "Offres spéciales : étudiants -30 % · premier mois à 9,99 € · parrainage 1 mois offert · "
                     "IAP 0,99-9,99 € (~5 000 €/mois pour 10 000 utilisateurs)",
         ha='center', fontsize=9.5, style='italic', color='#444444')
add_src(fig)
fig.tight_layout(rect=[0, 0.10, 1, 0.94])
fig.savefig(f'{OUT}/BarChart_TarificationAbonnements_{DATE}.png', dpi=DPI, facecolor='white')
plt.close(fig)
print("OK 6/7 Tarification")

# ============================================================
# 7) Radar de différenciation concurrentielle
# ============================================================
fig = plt.figure(figsize=FIGSIZE)
ax = fig.add_axes([0.08, 0.10, 0.52, 0.74], polar=True)
axes_lbl = ["Choix du mode", "Matching\nexplicable", "Score de\ncompatibilité", "Révélation\nconsentie",
            "Outils\nd'alchimie", "Vérification\nobligatoire", "Monétisation\néthique"]
data = {
    "Wairyu": ([1, 1, 1, 1, 1, 1, 1], C_BLUE, '-'),
    "Hinge": ([0, 0.5, 0.5, 0, 0.5, 0, 0], C_GREEN, '--'),
    "Once": ([0, 0, 0, 0.5, 0, 0.5, 0.5], C_ORANGE, '--'),
}
ang = np.linspace(0, 2 * np.pi, len(axes_lbl), endpoint=False).tolist()
ang += ang[:1]
for name, (vals, col, ls) in data.items():
    v = vals + vals[:1]
    ax.plot(ang, v, color=col, linewidth=2, linestyle=ls, label=name)
    if name == "Wairyu":
        ax.fill(ang, v, color=col, alpha=0.25)
ax.set_xticks(ang[:-1], axes_lbl, fontsize=10.5)
ax.set_yticks([0.25, 0.5, 0.75, 1.0], ["0,25", "0,50", "0,75", "1,00"], fontsize=8.5, color='#777777')
ax.set_ylim(0, 1.05)
ax.grid(color='#DDDDDD', linestyle='--', linewidth=0.7)
ax.spines['polar'].set_color('#BBBBBB')
fig.suptitle("Différenciation concurrentielle : Wairyu couvre 14/14 critères, les géants restent sous 15 %",
             fontsize=14.5, y=0.965, x=0.55)
fig.text(0.63, 0.60, "Lecture : score 1 = « Oui », 0,5 = « Partiel », 0 = « Non »\n"
                     "sur les critères de la spécification (section 3.6.1).\n\n"
                     "Tinder et Bumble : 0/1 sur les 7 axes affichés\n"
                     "(exclues du graphique pour lisibilité).\n\n"
                     "Couverture des 14 critères de différenciation :\n"
                     "Wairyu 100 % · Hinge ~14 % · Once ~11 % ·\nTinder 0 % · Bumble 0 %",
         fontsize=10.5, color='#333333',
         bbox=dict(boxstyle='round,pad=0.6', facecolor='#F5F7FA', edgecolor='#CCCCCC'))
fig.legend(loc='lower left', bbox_to_anchor=(0.10, 0.06), fontsize=11, frameon=False)
add_src(fig)
fig.savefig(f'{OUT}/RadarChart_Differentiation_{DATE}.png', dpi=DPI, facecolor='white')
plt.close(fig)
print("OK 7/7 Différenciation")

print("\nTous les fichiers générés dans", OUT)
