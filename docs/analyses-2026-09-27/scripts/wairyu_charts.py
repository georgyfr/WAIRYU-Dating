# -*- coding: utf-8 -*-
"""
Visuels de synthèse — Document « TEST ET OUTILS POUR WAIRYU »
Scénario : Visual chart (matplotlib, PNG, 1920×1080 @ 150 DPI)
Palette colorblind-safe (Paul Tol) + gris neutres — style skill charts.
"""
import os
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.gridspec as gridspec
from matplotlib.patches import FancyBboxPatch, Circle, Patch
import numpy as np

# ─────────────────────────── Style global ───────────────────────────
plt.rcParams.update({
    'font.sans-serif': ['DejaVu Sans'],
    'font.family': 'sans-serif',
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
    'xtick.labelsize': 9,
    'ytick.labelsize': 9,
    'axes.labelsize': 10,
    'axes.titlesize': 13,
    'axes.titleweight': 'bold',
    'axes.titlepad': 12,
    'legend.frameon': False,
    'legend.fontsize': 8.5,
})

# Palette Paul Tol (colorblind-safe)
BLUE, CYAN, TEAL, ORANGE, RED, MAGENTA = '#0077BB', '#33BBEE', '#009988', '#EE7733', '#CC3311', '#EE3377'
G900, G700, G500, G400, G300, G200, G100, G50 = \
    '#111827', '#374151', '#6B7280', '#9CA3AF', '#D1D5DB', '#E5E7EB', '#F3F4F6', '#F9FAFB'

PILL = {  # piliers
    'P1': {'c': BLUE,    'bg': '#EFF6FF'},
    'P2': {'c': ORANGE,  'bg': '#FFF7ED'},
    'P3': {'c': TEAL,    'bg': '#F0FDF4'},
    'P4': {'c': MAGENTA, 'bg': '#F5F3FF'},
}

OUT = '/home/z/my-project/download'
os.makedirs(OUT, exist_ok=True)
DATE = '2026-09-27'
SRC = 'Source : « TEST ET OUTILS POUR WAIRYU.docx » — architecture de matching (analyse du 27/09/2026)'


def save(fig, name):
    path = os.path.join(OUT, name)
    fig.savefig(path, dpi=150, facecolor='white', bbox_inches='tight', pad_inches=0.22)
    plt.close(fig)
    print(f'OK {path} ({os.path.getsize(path)/1024:.0f} KB)')


# ═══════════════════════════ DONNÉES DU DOCUMENT ═══════════════════════════
PILIERS = [
    {'code': 'P1', 'nom': 'Profilage Émotionnel\n& Psychologique',
     'outils': [('ECR-RS · Styles d\u2019attachement', '9–12 items'),
                ('IPIP-50 · Big Five (OCEAN)', '50 items'),
                ('PVQ-RR · Valeurs (Schwartz)', '19–38 items'),
                ('SSEIT · Agilité émotionnelle', '33 items')],
     'total': '≈ 110 items · 12–15 min'},
    {'code': 'P2', 'nom': 'Alignement Rationnel\n& Projets de Vie',
     'outils': [('REI + CRT · Cognition', '15 items'),
                ('TKI · Styles de conflit', '15 paires'),
                ('PVA-Q · Projets de vie', '5+6 items'),
                ('rMEQ · Chronotype', '5 QCM'),
                ('IAS · Sociabilité', '12 items')],
     'total': '≈ 50–55 items · 13–15 min'},
    {'code': 'P3', 'nom': 'Analyse Historique\n& Systémique',
     'outils': [('DSI-R · Différenciation', '12 items'),
                ('YSQ-S3 · Schémas précoces', '15 items'),
                ('BRS / RoSE · Ruptures', '10 items'),
                ('FIS · Peur de l\u2019intimité', '10 items'),
                ('Habitus · Capital culturel', '12 QCM')],
     'total': '≈ 59 items · 12–13 min'},
    {'code': 'P4', 'nom': 'Diagnostic Sexologique\n& Intimité',
     'outils': [('SIS/SES · Accél. / freins', '14 items'),
                ('EAS + NISA · Styles érotiques', '10 items'),
                ('SDI-2 · Désir & libido', '8 items'),
                ('Y/N/M · Carte des pratiques', '15 catég.'),
                ('SCIS · Communication intime', '10 items')],
     'total': '≈ 57 items · 10–12 min'},
]

# Sous-domaines (nom, items, minutes, pilier)
SOUS_DOMAINES = [
    ('Big Five — IPIP-50',            50, 5.0, 'P1'),
    ('Agilité émotionnelle — SSEIT',  33, 4.0, 'P1'),
    ('Valeurs — PVQ-RR (Schwartz)',   29, 3.0, 'P1'),
    ('Attachement — ECR-RS',          12, 2.0, 'P1'),
    ('Cognition — REI + CRT',         15, 3.0, 'P2'),
    ('Conflits — TKI',                15, 4.0, 'P2'),
    ('Sociabilité — IAS',             12, 2.0, 'P2'),
    ('Projets de vie — PVA-Q',        11, 3.0, 'P2'),
    ('Chronotype — rMEQ',              5, 1.5, 'P2'),
    ('Schémas précoces — YSQ-S3',     15, 3.0, 'P3'),
    ('Différenciation — DSI-R',       12, 2.5, 'P3'),
    ('Habitus culturel',              12, 3.0, 'P3'),
    ('Ruptures — BRS / RoSE',         10, 2.0, 'P3'),
    ('Intimité — FIS',                10, 2.0, 'P3'),
    ('Pratiques — Yes/No/Maybe',      15, 3.0, 'P4'),
    ('Accélérateurs/freins — SIS/SES',14, 3.0, 'P4'),
    ('Communication intime — SCIS',   10, 2.0, 'P4'),
    ('Styles érotiques — EAS/NISA',   10, 2.0, 'P4'),
    ('Désir — SDI-2',                  8, 2.0, 'P4'),
]

# Pondérations Pilier 1 (config Python du document)
POIDS = [
    ('Valeurs Schwartz',      0.25, 'SIM'),
    ('Névrosisme',            0.15, 'COMPL'),
    ('Anxiété (attachement)', 0.15, 'COMPL'),
    ('Évitement (attachement)', 0.15, 'COMPL'),
    ('Ouverture',             0.10, 'SIM'),
    ('Agréabilité',           0.10, 'SIM'),
    ('Conscienciosité',       0.05, 'SIM'),
    ('Extraversion',          0.05, 'SIM'),
]

SECURITE = [
    'Chiffrement applicatif AES-256-GCM + Envelope Encryption (HKDF / KMS), clé dérivée par utilisateur',
    'Architecture Zero-Knowledge : déchiffrement éphémère en RAM, seul le score de compatibilité est partagé',
    'Blind Index HMAC-SHA256 + Row Level Security (Supabase) : recherche et filtres sans déchiffrement',
    'Consentement explicite Art. 9.2(a) RGPD : opt-in séparé, libre, granulaire, révocable à tout moment',
    'AIPD obligatoire (Art. 35) · registre des traitements (Art. 30) · notification CNIL sous 72 h (Art. 33)',
    'Droit à l\u2019oubli : suppression en cascade + purge automatique après 6 mois d\u2019inactivité',
]

STEPS = [
    ('1', 'VECTEUR PSYCHOLOGIQUE (17 dimensions)',
     'Profil normalisé 0–1 : Big Five (5) + Attachement ECR-R (2) + Valeurs Schwartz (10)', BLUE),
    ('2', 'RÈGLES D\u2019ATTRACTION',
     'SIMILAIRE (Valeurs, Ouverture) → cible $=V_{A,i}$ · COMPLÉMENTAIRE (Névrosisme, Anxiété, '
     'Évitement) → cible $=1-V_{A,i}$', BLUE),
    ('3', 'DISTANCE PONDÉRÉE',
     r'$d(A,B)=\sum_i w_i\cdot|\,f(V_{A,i})-V_{B,i}\,|$  avec  $\Sigma\,w_i=1$', BLUE),
    ('4', 'INDICE DE COMPATIBILITÉ',
     r'$Score=(1-d/d_{max})\times 100\,\%$ : 0 % incompatibilité → 100 % alignement parfait', TEAL),
]


# ═══════════════════════════ FIGURE 1 : DASHBOARD ═══════════════════════════
def fig_dashboard():
    fig = plt.figure(figsize=(12.8, 7.2), dpi=150)
    gs = gridspec.GridSpec(3, 8, figure=fig,
                           height_ratios=[0.40, 0.33, 0.31],
                           left=0.030, right=0.972, top=0.865, bottom=0.052,
                           wspace=0.42, hspace=0.62)

    fig.text(0.5, 0.962, 'WAIRYU — Système de matching de compatibilité en 4 piliers',
             ha='center', va='center', fontsize=17.5, fontweight='bold', color=G900)
    fig.text(0.5, 0.917, '≈ 279 items psychométriques validés · moteur de matching déterministe (sans IA) · '
             'chiffrement & RGPD by design',
             ha='center', va='center', fontsize=9.5, color=G500)

    # ── Rangée 1 : 4 cartes piliers ──
    for i, p in enumerate(PILIERS):
        ax = fig.add_subplot(gs[0, i*2:(i+1)*2])
        ax.set_xlim(0, 1); ax.set_ylim(0, 1); ax.axis('off')
        c, bg = PILL[p['code']]['c'], PILL[p['code']]['bg']
        ax.add_patch(FancyBboxPatch((0.005, 0.005), 0.99, 0.99,
                     boxstyle='round,pad=0.006,rounding_size=0.028',
                     lw=1.3, edgecolor=c, facecolor=bg, zorder=1))
        ax.text(0.5, 0.935, f"PILIER {p['code'][1]}", ha='center', va='center',
                fontsize=7.2, color=G500, zorder=2)
        ax.text(0.5, 0.825, p['nom'], ha='center', va='center', fontsize=9.6,
                fontweight='bold', color=c, linespacing=1.18, zorder=2)
        ax.plot([0.07, 0.93], [0.685, 0.685], color=c, lw=0.9, alpha=0.45, zorder=2)
        n = len(p['outils'])
        y0, y1 = 0.585, (0.155 if n == 5 else 0.265)
        step = (y0 - y1) / (n - 1)
        for k, (nom, meta) in enumerate(p['outils']):
            y = y0 - k * step
            ax.text(0.055, y, nom, fontsize=7.7, color=G900, va='center', zorder=2)
            ax.text(0.952, y, meta, fontsize=7.0, color=G500, ha='right', va='center', zorder=2)
        ax.add_patch(FancyBboxPatch((0.09, 0.028), 0.82, 0.105,
                     boxstyle='round,pad=0.004,rounding_size=0.02',
                     lw=0, facecolor=c, alpha=0.16, zorder=2))
        ax.text(0.5, 0.080, p['total'], ha='center', va='center',
                fontsize=8.4, fontweight='bold', color=c, zorder=3)

    # ── Rangée 2 gauche : barres par pilier ──
    axb = fig.add_subplot(gs[1, 0:4])
    items = [110, 53, 59, 57]
    labels = ['110 items · 12–15 min', '50–55 items · 13–15 min',
              '59 items · 12–13 min', '57 items · 10–12 min']
    names = ['P1 · Émotionnel\n& Psychologique', 'P2 · Rationnel\n& Projets de vie',
             'P3 · Historique\n& Systémique', 'P4 · Sexologique\n& Intimité']
    cols = [PILL[k]['c'] for k in ['P1', 'P2', 'P3', 'P4']]
    ypos = np.arange(4)[::-1]
    axb.barh(ypos, items, height=0.58, color=cols, edgecolor='white', lw=0.6, zorder=3)
    for y, v, lab in zip(ypos, items, labels):
        axb.text(v + 3.5, y, lab, va='center', fontsize=8.3, color=G700)
    axb.set_yticks(ypos); axb.set_yticklabels(names, fontsize=8.3, linespacing=1.15)
    axb.set_xlim(0, 182)
    axb.set_xlabel('Nombre d\u2019items', fontsize=9, color=G700)
    axb.xaxis.grid(True, linestyle='--', alpha=0.35, color=G300)
    axb.set_axisbelow(True)
    axb.set_title('Batteries de tests par pilier — ≈ 279 items · 47 à 55 min au total',
                  loc='left', fontsize=11.5)

    # ── Rangée 2 droite : pipeline sans IA ──
    axp = fig.add_subplot(gs[1, 4:8])
    axp.set_xlim(0, 1); axp.set_ylim(0, 1); axp.axis('off')
    axp.set_title('Moteur de matching sans IA — pipeline en 4 étapes',
                  loc='left', fontsize=11.5)
    ys = [0.865, 0.635, 0.405, 0.175]
    axp.plot([0.030, 0.030], [ys[-1], ys[0]], color=G200, lw=1.6, zorder=1)
    for (num, titre, desc, cc), y in zip(STEPS, ys):
        axp.add_patch(Circle((0.030, y), 0.021, facecolor=cc, edgecolor='white',
                             lw=1.2, zorder=3, transform=axp.transData))
        axp.text(0.030, y, num, ha='center', va='center', fontsize=7.6,
                 fontweight='bold', color='white', zorder=4)
        axp.text(0.072, y + 0.035, titre, fontsize=8.8, fontweight='bold', color=G900,
                 va='center', zorder=2)
        axp.text(0.072, y - 0.052, desc, fontsize=7.8, color=G500, va='center',
                 zorder=2, linespacing=1.25)

    # ── Rangée 3 gauche : pondérations ──
    axw = fig.add_subplot(gs[2, 0:4])
    pn = [x[0] for x in POIDS][::-1]
    pv = [x[1] for x in POIDS][::-1]
    pc = [BLUE if x[2] == 'SIM' else ORANGE for x in POIDS][::-1]
    ypos = np.arange(len(pn))
    axw.barh(ypos, pv, height=0.60, color=pc, edgecolor='white', lw=0.6, zorder=3)
    for y, v in zip(ypos, pv):
        axw.text(v + 0.006, y, f'{v:.2f}'.replace('.', ','), va='center',
                 fontsize=8.0, color=G700)
    axw.set_yticks(ypos); axw.set_yticklabels(pn, fontsize=8.2)
    axw.set_xlim(0, 0.325)
    axw.xaxis.grid(True, linestyle='--', alpha=0.35, color=G300)
    axw.set_axisbelow(True)
    axw.set_title('Pondération du score (Pilier 1) : les Valeurs dominent',
                  loc='left', fontsize=11.5)
    axw.legend(handles=[Patch(facecolor=BLUE, label='SIMILAIRE (proximité)'),
                        Patch(facecolor=ORANGE, label='COMPLÉMENTAIRE (compensation)')],
               loc='lower right', bbox_to_anchor=(0.995, 0.02), ncol=1, fontsize=7.6,
               handlelength=1.1, handleheight=0.9, labelspacing=0.9)

    # ── Rangée 3 droite : sécurité / RGPD ──
    axs = fig.add_subplot(gs[2, 4:8])
    axs.set_xlim(0, 1); axs.set_ylim(0, 1); axs.axis('off')
    axs.set_title('Sécurité & RGPD : données ultra-sensibles du Pilier 4',
                  loc='left', fontsize=11.5)
    yy = 0.855
    for line in SECURITE:
        axs.text(0.012, yy, '✓', fontsize=8.8, color=TEAL, fontweight='bold',
                 va='center', zorder=2)
        axs.text(0.050, yy, line, fontsize=7.75, color=G700, va='center', zorder=2)
        yy -= 0.152

    fig.text(0.030, 0.014, SRC, fontsize=7.3, color=G400)
    fig.text(0.972, 0.014, 'Généré le 27/09/2026', fontsize=7.3, color=G400, ha='right')
    save(fig, f'Dashboard_Piliers_Matching_WAIRYU_{DATE}.png')


# ═══════════════════════════ FIGURE 2 : BATTERIES ═══════════════════════════
def fig_batteries():
    fig = plt.figure(figsize=(12.8, 7.2), dpi=150)
    gs = gridspec.GridSpec(1, 2, figure=fig, width_ratios=[1.42, 1.0],
                           left=0.245, right=0.968, top=0.880, bottom=0.168,
                           wspace=0.52)

    # gauche : 19 sous-domaines
    ax = fig.add_subplot(gs[0])
    data = SOUS_DOMAINES[::-1]                       # du bas vers le haut
    names = [d[0] for d in data]
    vals = [d[1] for d in data]
    cols = [PILL[d[3]]['c'] for d in data]
    ypos = np.arange(len(data))
    ax.barh(ypos, vals, height=0.62, color=cols, edgecolor='white', lw=0.5, zorder=3)
    for y, v in zip(ypos, vals):
        ax.text(v + 0.9, y, str(v), va='center', fontsize=7.8, color=G700)
    ax.set_yticks(ypos); ax.set_yticklabels(names, fontsize=8.0)
    ax.set_xlim(0, 58)
    ax.set_xlabel('Nombre d\u2019items', fontsize=9.5, color=G700)
    ax.xaxis.grid(True, linestyle='--', alpha=0.35, color=G300)
    ax.set_axisbelow(True)
    ax.set_title('La Big Five (IPIP-50) concentre 50 des ≈ 279 items du système',
                 loc='left', fontsize=11.5, pad=30)
    ax.legend(handles=[Patch(facecolor=PILL[k]['c'],
                        label={'P1': 'Pilier 1 · Émotionnel', 'P2': 'Pilier 2 · Rationnel',
                               'P3': 'Pilier 3 · Systémique', 'P4': 'Pilier 4 · Intimité'}[k])
              for k in ['P1', 'P2', 'P3', 'P4']],
              loc='upper center', bbox_to_anchor=(0.5, -0.105), ncol=4, fontsize=8.2,
              handlelength=1.2, handleheight=0.9, columnspacing=1.4)

    # droite : temps par pilier
    ax2 = fig.add_subplot(gs[1])
    temps = [14.0, 14.0, 12.5, 11.0]
    labs = ['≈ 110 items · 12–15 min', '≈ 50–55 items · 13–15 min',
            '≈ 59 items · 12–13 min', '≈ 57 items · 10–12 min']
    names2 = ['P1 · Émotionnel &\nPsychologique', 'P2 · Rationnel &\nProjets de vie',
              'P3 · Historique &\nSystémique', 'P4 · Sexologique &\nIntimité']
    cols2 = [PILL[k]['c'] for k in ['P1', 'P2', 'P3', 'P4']]
    ypos2 = np.arange(4)[::-1]
    ax2.barh(ypos2, temps, height=0.55, color=cols2, edgecolor='white', lw=0.6, zorder=3)
    for y, v, lab in zip(ypos2, temps, labs):
        ax2.text(v + 0.28, y, lab, va='center', fontsize=8.2, color=G700)
    ax2.set_yticks(ypos2); ax2.set_yticklabels(names2, fontsize=8.4, linespacing=1.15)
    ax2.set_xlim(0, 21.5)
    ax2.set_xlabel('Temps de passation (minutes)', fontsize=9.5, color=G700)
    ax2.xaxis.grid(True, linestyle='--', alpha=0.35, color=G300)
    ax2.set_axisbelow(True)
    ax2.set_title('Un pilier coûte 10 à 15 min — parcours complet ≈ 47 à 55 min',
                  loc='left', fontsize=11.5, pad=30)

    fig.text(0.245, 0.012, SRC, fontsize=7.3, color=G400)
    fig.text(0.968, 0.012, 'Généré le 27/09/2026', fontsize=7.3, color=G400, ha='right')
    save(fig, f'BarChart_Batteries_Tests_WAIRYU_{DATE}.png')


# ═══════════════════════════ FIGURE 3 : INDEXATION ═══════════════════════════
def fig_indexation():
    fig = plt.figure(figsize=(12.8, 7.2), dpi=150)
    gs = gridspec.GridSpec(1, 2, figure=fig, width_ratios=[1.0, 1.18],
                           left=0.075, right=0.965, top=0.870, bottom=0.095,
                           wspace=0.35)

    # gauche : temps de recherche
    ax = fig.add_subplot(gs[0])
    vals = [2, 30]
    ax.bar([0, 1], vals, width=0.46, color=[TEAL, G400],
           edgecolor='white', lw=0.6, zorder=3)
    ax.text(0, 2 + 30*0.03, '< 2 ms', ha='center', va='bottom',
            fontsize=12, fontweight='bold', color=TEAL)
    ax.text(1, 30 + 30*0.03, '10–30 ms', ha='center', va='bottom',
            fontsize=12, fontweight='bold', color=G500)
    ax.set_xticks([0, 1])
    ax.set_xticklabels(['K-D Tree\n(in-memory, O(log N))', 'Index SQL B-Tree\n(PostgreSQL)'],
                       fontsize=9.5, linespacing=1.25)
    ax.set_ylim(0, 30 * 1.24)
    ax.set_ylabel('Temps de recherche (ms)', fontsize=9.5, color=G700)
    ax.yaxis.grid(True, linestyle='--', alpha=0.35, color=G300)
    ax.set_axisbelow(True)
    ax.set_title('Sur 100 000 profils, le K-D Tree est 5 à 15× plus rapide',
                 loc='left', fontsize=11.5)

    # droite : tableau comparatif
    ax2 = fig.add_subplot(gs[1]); ax2.axis('off')
    ax2.set_title('Comparaison des deux architectures d\u2019indexation',
                  loc='left', fontsize=11.5)
    rows = [
        ['Critère', 'K-D Tree (mémoire)', 'Index SQL B-Tree'],
        ['Complexité de recherche', 'O(log N)', 'O(K) après filtre B-Tree'],
        ['Mise à jour des données', 'Réinsertion dans l\u2019arbre', 'UPDATE SQL standard'],
        ['Scalabilité', 'Service dédié (RAM)', 'Native en base'],
        ['Pré-filtrage', '—', 'Hard constraints (âge, géo)'],
        ['Latence (100k profils)', '< 2 ms', '10–30 ms'],
    ]
    tab = ax2.table(cellText=rows[1:], colLabels=rows[0],
                    cellLoc='left', colLoc='left', loc='center',
                    colWidths=[0.36, 0.32, 0.32])
    tab.auto_set_font_size(False)
    tab.set_fontsize(8.8)
    tab.scale(1, 2.35)
    for (r, c), cell in tab.get_celld().items():
        cell.set_edgecolor(G200)
        cell.PAD = 0.03
        if r == 0:
            cell.set_facecolor('#E9EEF3')
            cell.set_text_props(fontweight='bold', color=G900)
        else:
            cell.set_facecolor('#F8FAFC' if r % 2 == 0 else '#FFFFFF')
            cell.set_text_props(color=G700)
            if c == 1 and r in (1, 5):
                cell.set_text_props(color=TEAL, fontweight='bold')
    ax2.text(0.0, 0.055,
             'Architecture recommandée : hybride — pré-filtrage SQL (B-Tree) puis raffinement en mémoire ; '
             'latence < 10 ms maintenue au-delà d\u2019un million de profils.',
             transform=ax2.transAxes, fontsize=8.4, color=G500, style='italic',
             wrap=True, va='top')

    fig.text(0.075, 0.016, SRC, fontsize=7.3, color=G400)
    fig.text(0.965, 0.016, 'Généré le 27/09/2026', fontsize=7.3, color=G400, ha='right')
    save(fig, f'BarChart_Indexation_Matching_WAIRYU_{DATE}.png')


if __name__ == '__main__':
    fig_dashboard()
    fig_batteries()
    fig_indexation()
    print('Terminé.')
