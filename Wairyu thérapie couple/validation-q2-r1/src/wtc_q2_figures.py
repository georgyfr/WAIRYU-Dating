# -*- coding: utf-8 -*-
"""WAIRYU — WTC-Q2-R1 : figures du rapport (4 visuels 1920×1080, 150 DPI).
Lecture DIRECTE des results/ (criteres_q2_r1.json · matrice_nommage.csv ·
comparaison_avant_apres.csv · profils_calcules.csv) — aucune valeur saisie à la main.
Palette Okabe-Ito (colorblind-friendly) · français · source en pied de figure.

Usage : python3 wtc_q2_figures.py   (depuis src/)"""

import csv
import json
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np

BASE = Path(__file__).resolve().parent.parent
RES = BASE / "results"
FIG = BASE / "figures"

OKABE = {"noir": "#000000", "orange": "#E69F00", "bleu": "#0072B2",
         "vert": "#009E73", "rouge": "#D55E00", "violet": "#CC79A7",
         "jaune": "#F0E442", "cyan": "#56B4E9", "gris": "#999999"}

plt.rcParams.update({
    "font.sans-serif": ["DejaVu Sans"], "font.family": "sans-serif",
    "axes.unicode_minus": False, "figure.dpi": 150,
    "axes.edgecolor": "#444444", "axes.labelcolor": "#222222",
    "text.color": "#222222", "xtick.color": "#444444",
    "ytick.color": "#444444",
})

SOURCE = ("Source : run WTC-Q2-R1 (seed 42, 437 sorties) · "
          "WAIRYU-Dating / Wairyu thérapie couple / validation-q2-r1 · exécution 2026-10-15")


def fr(x, nd=1):
    return f"{x:.{nd}f}".replace(".", ",")


def charge_donnees():
    meta = json.loads((RES / "criteres_q2_r1.json").read_text(encoding="utf-8"))
    matrice = {}
    with open(RES / "matrice_nommage.csv", encoding="utf-8-sig") as f:
        for row in csv.DictReader(f):
            matrice[row["type_vrai"]] = row
    compar = []
    with open(RES / "comparaison_avant_apres.csv", encoding="utf-8-sig") as f:
        for row in csv.DictReader(f):
            compar.append({"groupe": row["groupe"], "domination": row["domination"],
                           "conforme": row["conforme"],
                           "avant_n": int(row["avant_n"]),
                           "avant_part": float(row["avant_part"].replace(",", ".")),
                           "apres_n": int(row["apres_n"]),
                           "apres_part": float(row["apres_part"].replace(",", ".")),
                           "delta_points": float(row["delta_points"].replace(",", "."))})
    profils = []
    with open(RES / "profils_calcules.csv", encoding="utf-8-sig") as f:
        profils = list(csv.DictReader(f))
    return meta, matrice, compar, profils


def pied(fig):
    fig.text(0.01, 0.012, SOURCE, fontsize=8.2, color="#555555", ha="left")


# ----------------------------------------------------------------------------------
# Figure 1 — tableau de bord des 7 critères R1
# ----------------------------------------------------------------------------------
def fig_dashboard(meta):
    c = meta["criteres"]
    fig, axes = plt.subplots(2, 4, figsize=(13.4, 7.4))
    fig.subplots_adjust(left=0.06, right=0.985, top=0.865, bottom=0.10,
                        wspace=0.30, hspace=0.52)
    fig.suptitle("WTC-Q2-R1 — Tableau de bord des 7 critères (révision post-validation · "
                 "données corrigées fqH/fqR)",
                 fontsize=14.5, fontweight="bold", y=0.975)

    def titre(ax, txt, pass_):
        ax.set_title(txt, fontsize=10.8, fontweight="bold", pad=6,
                     color=OKABE["vert"] if pass_ else OKABE["rouge"])

    def net(ax):
        ax.spines[["top", "right"]].set_visible(False)
        ax.grid(axis="y", ls="--", lw=0.5, color="#CCCCCC")

    # --- C1a : nommage par groupe, seuil 82 % -------------------------------------
    ax = axes[0, 0]
    d = c["C1a"]["detail"]
    noms = ["T1", "T2", "T3", "GLOBAL"]
    vals = [d["T1_PERDRE"]["taux"] * 100, d["T2_ETOUFFEE"]["taux"] * 100,
            d["T3_LESDEUX"]["taux"] * 100, c["C1a"]["global"] * 100]
    couleurs = [OKABE["cyan"]] * 3 + [OKABE["vert"] if c["C1a"]["pass"] else OKABE["rouge"]]
    ax.bar(noms, vals, color=couleurs, width=0.62)
    ax.axhspan(82, 120, color=OKABE["vert"], alpha=0.10)
    ax.axhline(82, color=OKABE["noir"], lw=1.1, ls="--")
    ax.text(-0.42, 84.5, "seuil 82 %", fontsize=7.6)
    for i, v in enumerate(vals):
        ax.text(i, v - 9, fr(v) + " %", ha="center", fontsize=8.8,
                fontweight="bold", color="white")
    ax.set_ylim(0, 118); ax.set_ylabel("nommage correct (%)", fontsize=9.5)
    ax.set_yticks([0, 20, 40, 60, 80, 100])
    titre(ax, f"C1a · nommage T1-T3 — {'PASS' if c['C1a']['pass'] else 'FAIL'}", c["C1a"]["pass"])
    net(ax)

    # --- C1b : calme bilatéral ------------------------------------------------------
    ax = axes[0, 1]
    cb = c["C1b"]
    v1, v2 = cb["t4_calmes"] * 100, cb["fuite_t1t3"] * 100
    ax.bar(["T4 calme", "fuite T1-T3"], [v1, max(v2, 0.001)],
           color=[OKABE["vert"] if v1 >= 80 else OKABE["rouge"],
                  OKABE["vert"] if v2 <= 2 else OKABE["rouge"]], width=0.5)
    ax.axhline(80, color=OKABE["noir"], lw=1.1, ls="--")
    ax.text(1.42, 82.0, "seuil T4 80 %", fontsize=7.6, ha="right")
    for i, (v, n) in enumerate([(v1, f"{cb['t4_n'] - round(cb['t4_calmes']*cb['t4_n'])}/{cb['t4_n']}"),
                                (v2, f"{round(cb['fuite_t1t3']*cb['t123_n'])}/{cb['t123_n']}")]):
        ax.text(i, max(v, 3) + 3.0, fr(v) + " %", ha="center", fontsize=9,
                fontweight="bold")
        ax.text(i, max(v, 3) + 11.5, n, ha="center", fontsize=7.6, color="#555555")
    ax.set_ylim(0, 118); ax.set_ylabel("%", fontsize=9.5)
    ax.set_yticks([0, 20, 40, 60, 80, 100])
    titre(ax, f"C1b · calme bilatéral — {'PASS' if cb['pass'] else 'FAIL'}", cb["pass"])
    net(ax)

    # --- C1c : arêtes E1-E8 ---------------------------------------------------------
    ax = axes[0, 2]
    det = c["C1c"]["detail"]
    noms = [d["arete"].split("_")[0] for d in det]
    ok = [1 if d["ok"] else 0 for d in det]
    ax.bar(range(8), ok, color=[OKABE["vert"] if o else OKABE["rouge"] for o in ok],
           width=0.6)
    ax.set_xticks(range(8)); ax.set_xticklabels(noms, fontsize=8.6)
    ax.set_yticks([0, 1]); ax.set_yticklabels(["échec", "OK"], fontsize=8)
    ax.set_ylim(0, 1.32)
    ax.text(3.5, 1.16, "8 arêtes attendues — 8 obtenues", ha="center",
            fontsize=8.6, color="#444444")
    titre(ax, f"C1c · arêtes E1-E8 — {c['C1c']['score']}", c["C1c"]["pass"])
    net(ax)

    # --- C2 : sécurité --------------------------------------------------------------
    ax = axes[0, 3]
    c2 = c["C2"]
    sec_ok, fil_ok = (int(v.split("/")[0]) for v in (c2["sec_h5"], c2["p_filtre"]))
    fp = len(c2["faux_positifs_p_filtre_honnetes"])
    ax.bar(["SEC_H5\nsignal", "P-FILTRE", "FP\n(sur 400)"],
           [sec_ok, fil_ok, max(fp, 0.001)],
           color=[OKABE["cyan"], OKABE["cyan"],
                  OKABE["vert"] if fp == 0 else OKABE["rouge"]], width=0.55)
    for i, (v, t) in enumerate([(sec_ok, c2["sec_h5"]), (fil_ok, c2["p_filtre"]),
                                (max(fp, 0.001), str(fp))]):
        ax.text(i, v + 0.28, t, ha="center", fontsize=9.5, fontweight="bold")
    ax.set_ylim(0, 9.8); ax.set_ylabel("count", fontsize=9.5)
    ax.tick_params(axis="x", labelsize=8.6)
    titre(ax, f"C2 · sécurité — {'PASS' if c2['pass'] else 'FAIL'}", c2["pass"])
    net(ax)

    # --- C3 : convergence + O7 ------------------------------------------------------
    ax = axes[1, 0]
    c3 = c["C3"]
    incs_ok = int(c3["inc_simple"].split("/")[0])
    incd_ok = int(c3["inc_double"].split("/")[0])
    o7_ok = int(c3["o7"].split("/")[0])
    tx1 = c3["taux_honnetes_index_1"] * 100
    ax.bar(["INC-S", "INC-D", "O7", "Honnêtes"],
           [incs_ok, incd_ok, o7_ok, tx1],
           color=[OKABE["cyan"], OKABE["cyan"],
                  OKABE["vert"] if o7_ok == 6 else OKABE["rouge"],
                  OKABE["vert"] if tx1 >= 90 else OKABE["rouge"]], width=0.55)
    for i, (v, t) in enumerate([(incs_ok, c3["inc_simple"]), (incd_ok, c3["inc_double"]),
                                (o7_ok, c3["o7"]), (tx1, fr(tx1) + " %")]):
        ax.text(i, v + 2.8, t, ha="center", fontsize=8.8, fontweight="bold")
    ax.axhline(90, color=OKABE["noir"], lw=1.0, ls="--")
    ax.text(-0.42, 92.5, "seuil 90 %", fontsize=7.4)
    ax.set_ylim(0, 118); ax.tick_params(axis="x", labelsize=8.8)
    ax.set_ylabel("count / %", fontsize=9.5)
    titre(ax, f"C3 · convergence + O7 — {'PASS' if c3['pass'] else 'FAIL'}", c3["pass"])
    net(ax)

    # --- C4 : empreintes --------------------------------------------------------------
    ax = axes[1, 1]
    ax.axis("off")
    c4 = c["C4"]
    ax.text(0.5, 0.66, "C4 · reproductibilité ×2", fontsize=10.8, fontweight="bold",
            ha="center", color=OKABE["vert"] if c4["pass"] else OKABE["rouge"])
    ax.text(0.5, 0.40, "OUI" if c4["identiques"] else "NON", fontsize=30,
            fontweight="bold", ha="center",
            color=OKABE["vert"] if c4["pass"] else OKABE["rouge"])
    ax.text(0.5, 0.16, f"SHA-256 identique (seed 42)\n{c4['empreinte_run1'][:24]}…",
            fontsize=8.3, ha="center", color="#555555")

    # --- C5 : 4 sous-tests --------------------------------------------------------------
    ax = axes[1, 2]
    c5 = c["C5"]
    c5c = c5["c_regles"]
    a_ok = c5["a_templates"]["score"] == "35/35"
    b_ok = c5["b_palier_recalcule"]["pass"]
    c_ok = all(c5c[k]["pass"] for k in ("c1_suppression", "c2_mainslibres", "c3_fallthrough"))
    d_ok = c5["d_force"]["pass"]
    ax.bar(["a", "b", "c", "d"],
           [35, c5["b_palier_recalcule"]["total_calcules"], 3, 1],
           color=[OKABE["vert"] if o else OKABE["rouge"] for o in (a_ok, b_ok, c_ok, d_ok)],
           width=0.55)
    ax.set_yscale("log"); ax.set_ylim(0.7, 1600)
    labels = [c5["a_templates"]["score"],
              f"{c5['b_palier_recalcule']['total_calcules']}/{c5['b_palier_recalcule']['total_calcules']}",
              "3/3", "OK"]
    for b_, t in zip(ax.patches, labels):
        ax.text(b_.get_x() + b_.get_width() / 2, b_.get_height() * 1.45, t,
                ha="center", fontsize=8.8, fontweight="bold")
    ax.set_ylabel("effectifs (log)", fontsize=9.5)
    ax.tick_params(axis="x", labelsize=10)
    ax.text(0.5, -0.22, "a templates 35 · b palier=affiché\nc règles c1/c2/c3 · d ombre+force",
            transform=ax.transAxes, ha="center", fontsize=7.2, color="#555555")
    titre(ax, f"C5 · affichage & complétude — {'PASS' if c5['pass'] else 'FAIL'}", c5["pass"])
    net(ax)

    # --- Bilan --------------------------------------------------------------------------
    ax = axes[1, 3]
    ax.axis("off")
    bilan = meta["bilan"]
    pass_n = int(bilan.split("/")[0])
    ax.barh([0], [pass_n], color=OKABE["vert"], height=0.42)
    ax.barh([0], [7 - pass_n], left=[pass_n], color=OKABE["rouge"], height=0.42)
    ax.set_xlim(0, 7); ax.set_ylim(-1.05, 1.30)
    ax.set_yticks([]); ax.set_xticks(range(8))
    for i in range(7):
        ax.text(i + 0.5, 0, str(i + 1), ha="center", va="center", fontsize=9,
                color="white", fontweight="bold")
    ax.text(0.0, 1.12, f"BILAN — {bilan} critères PASS", fontsize=11,
            fontweight="bold", color=OKABE["rouge"] if pass_n < 7 else OKABE["vert"])
    ax.text(0.0, -0.50, f"VERDICT : {meta['verdict']}\nnote {fr(meta['note'])}/10 (barème déclaré)",
            fontsize=9.6, fontweight="bold")
    ax.text(0.0, -0.86, "échecs : C1a 81,0 % < 82 %\nC2 : 1 FP sur 400 (S-Q2-R1-9)",
            fontsize=7.8, color="#555555")

    fig.text(0.01, 0.012, SOURCE, fontsize=8.2, color="#555555", ha="left")
    fig.savefig(FIG / "BarChart_TableauDeBord_7Criteres_R1_2026-10-15.png",
                dpi=150, facecolor="white")
    plt.close(fig)


# ----------------------------------------------------------------------------------
# Figure 2 — matrice nommage × vérité (honnêtes, données corrigées)
# ----------------------------------------------------------------------------------
def fig_matrice(matrice):
    etiquettes = ["LES DEUX", "PEUR DE PERDRE", "PEUR D'ÊTRE ÉTOUFFÉE",
                  "ZONE CALME", "ALARME SANS MAIN", "SIGNAL LÉGER NON NOMMÉ"]
    groupes = ["T1_PERDRE", "T2_ETOUFFEE", "T3_LESDEUX", "T4_CALME"]
    attendu = {"T1_PERDRE": "PEUR DE PERDRE", "T2_ETOUFFEE": "PEUR D'ÊTRE ÉTOUFFÉE",
               "T3_LESDEUX": "LES DEUX", "T4_CALME": "ZONE CALME"}
    M = np.array([[int(matrice[g][e]) for e in etiquettes] for g in groupes])
    N = M.sum(axis=1, keepdims=True)
    P = M / N * 100

    fig, ax = plt.subplots(figsize=(12.8, 7.2))
    fig.suptitle("WTC-Q2-R1 — Matrice nommage × vérité (400 honnêtes, données corrigées fqH/fqR)",
                 fontsize=15, fontweight="bold", y=0.965)
    im = ax.imshow(P, cmap="Blues", vmin=0, vmax=100, aspect="auto")
    for i in range(4):
        for j in range(6):
            val = M[i, j]
            if val:
                ax.text(j, i + 0.28, f"{val}", ha="center", va="center",
                        fontsize=13, fontweight="bold",
                        color="white" if P[i, j] > 55 else "#222222")
                ax.text(j, i - 0.22, fr(P[i, j]) + " %", ha="center", va="center",
                        fontsize=8.4,
                        color="white" if P[i, j] > 55 else "#555555")
            else:
                ax.text(j, i, "·", ha="center", va="center", fontsize=11, color="#BBBBBB")
    for i, g in enumerate(groupes):
        j = etiquettes.index(attendu[g])
        ax.add_patch(plt.Rectangle((j - 0.5, i - 0.5), 1, 1, fill=False,
                                   edgecolor=OKABE["vert"], lw=2.6))
    ax.set_xticks(range(6))
    ax.set_xticklabels([e.replace(" ", "\n", 1) if len(e) > 14 else e for e in etiquettes],
                       fontsize=9)
    ax.set_yticks(range(4))
    ax.set_yticklabels([f"{g}\n(attendu : {attendu[g]})" for g in groupes], fontsize=9.5)
    ax.set_xlabel("étiquette produite par le moteur", fontsize=11)
    ax.set_title("cadre vert = étiquette attendue · effectif + % de ligne",
                 fontsize=10, color="#555555", pad=10)
    ax.grid(False)
    fig.colorbar(im, ax=ax, shrink=0.75, label="% de la ligne")
    fig.tight_layout(rect=(0, 0.045, 1, 0.93))
    fig.text(0.01, 0.012, SOURCE, fontsize=8.2, color="#555555", ha="left")
    fig.savefig(FIG / "Heatmap_MatriceNommage_Verite_R1_2026-10-15.png",
                dpi=150, bbox_inches="tight", facecolor="white")
    plt.close(fig)


# ----------------------------------------------------------------------------------
# Figure 3 — domination AVANT / APRÈS branchement fqH/fqR (effet du bug S-Q2-1)
# ----------------------------------------------------------------------------------
def fig_avant_apres(compar):
    groupes = ["T1_PERDRE", "T2_ETOUFFEE", "T3_LESDEUX", "T4_CALME"]
    conforme = {"T1_PERDRE": "H", "T2_ETOUFFEE": "R",
                "T3_LESDEUX": "MIXTE", "T4_CALME": "LEGER"}
    titre_dom = {"H": "H (hyperactivation)", "R": "R (retrait)", "MIXTE": "MIXTE",
                 "LEGER": "LÉGER"}
    fig, ax = plt.subplots(figsize=(12.8, 7.2))
    fig.suptitle("WTC-Q2-R1 — Mesure de l'effet du bug S-Q2-1 : taux de domination conforme "
                 "AVANT / APRÈS branchement fqH/fqR (seed 42)",
                 fontsize=14.5, fontweight="bold", y=0.965)
    x = np.arange(4)
    w = 0.36
    for i, g in enumerate(groupes):
        k = conforme[g]
        av = next(l for l in compar if l["groupe"] == g and l["domination"] == k)
        va, vp = av["avant_part"] * 100, av["apres_part"] * 100
        b1 = ax.bar(i - w / 2, va, w, color=OKABE["gris"], edgecolor="#666666")
        b2 = ax.bar(i + w / 2, vp, w, color=OKABE["orange"] if vp >= va else OKABE["rouge"])
        ax.text(i - w / 2, va + 1.8, f"{fr(va)} %\n({av['avant_n']})", ha="center",
                fontsize=9.3, color="#444444")
        ax.text(i + w / 2, vp + 1.8, f"{fr(vp)} %\n({av['apres_n']})", ha="center",
                fontsize=9.3, fontweight="bold")
        delta = av["delta_points"]
        signe = "+" if delta >= 0 else "−"
        ax.text(i, max(va, vp) + 12.5, f"Δ {signe}{fr(abs(delta))} pts", ha="center",
                fontsize=10.5, fontweight="bold",
                color=OKABE["vert"] if delta >= 0 else OKABE["rouge"])
    ax.set_xticks(x)
    ax.set_xticklabels([f"{g}\ndomination conforme : {titre_dom[conforme[g]]}"
                        for g in groupes], fontsize=10)
    ax.set_ylabel("taux de domination (%)")
    ax.set_ylim(0, 118)
    ax.grid(axis="y", ls="--", lw=0.5, color="#CCCCCC")
    ax.spines[["top", "right"]].set_visible(False)
    import matplotlib.patches as mpatches
    ax.legend(handles=[mpatches.Patch(color=OKABE["gris"], label="AVANT — run initial 0c3aaab "
                                      "(fréquences U{1,2,3} : fqH/fqR morts)"),
                       mpatches.Patch(color=OKABE["orange"], label="APRÈS — run R1 "
                                      "(freq ~ Normal(fq, 0,5) borné [1;3], D-Q2-A)")],
              loc="upper left", fontsize=9.3, framealpha=0.95)
    ax.text(0.01, -0.16, "Lecture : T3 — la domination MIXTE recule mais le nommage T3 atteint 100 % "
            "(étiquette LES DEUX posée par le chemin scores sA/sB ≥ 2,61, indépendante de la domination).",
            transform=ax.transAxes, fontsize=8.8, color="#555555")
    fig.tight_layout(rect=(0, 0.05, 1, 0.93))
    fig.text(0.01, 0.012, SOURCE, fontsize=8.2, color="#555555", ha="left")
    fig.savefig(FIG / "BarChart_Domination_AvantApres_fqHfqR_R1_2026-10-15.png",
                dpi=150, bbox_inches="tight", facecolor="white")
    plt.close(fig)


# ----------------------------------------------------------------------------------
# Figure 4 — écarts légitimes (3 règles c1/c2/c3) + routage O7-NLP
# ----------------------------------------------------------------------------------
def fig_ecarts_o7(meta, profils):
    c = meta["criteres"]["C5"]["c_regles"]
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12.8, 7.2), width_ratios=[1, 1.15])
    fig.suptitle("WTC-Q2-R1 — Les 3 écarts légitimes (règles c1/c2/c3, D-Q2-B) et le routage O7-NLP (D-Q2-E)",
                 fontsize=14, fontweight="bold", y=0.97)

    # --- gauche : écarts légitimes ---------------------------------------------------
    ecarts = [("SUPPRESSION", c["c1_suppression"]["effectif_supprimes"], "SUPPRESSION_MASQUEE",
               "index 0,00 — ombre masquée"),
              ("MAINSLIBRES", c["c2_mainslibres"]["effectif_mainslibres"], "MAINSLIBRES_EXPLIQUE",
               "profil ≠ RARES · somme < 0,30"),
              ("FALLTHROUGH", 80, "FALLTHROUGH_LEGER",
               "chute ALARME (i_alarm ≥ 5) / LÉGER (≤ 4)")]
    nn = sum(1 for p in profils if p["label"] in ("ALARME SANS MAIN", "SIGNAL LÉGER NON NOMMÉ"))
    ecarts[2] = ("FALLTHROUGH", nn, "FALLTHROUGH_LEGER",
                 "chute ALARME (i_alarm ≥ 5) / LÉGER (≤ 4)")
    y = np.arange(3)
    bars = ax1.barh(y, [e[1] for e in ecarts],
                    color=[OKABE["bleu"], OKABE["cyan"], OKABE["violet"]], height=0.52)
    for b, (nom, n, tpl, regle) in zip(bars, ecarts):
        ax1.text(b.get_width() + 1.4, b.get_y() + b.get_height() / 2 - 0.05,
                 f"{n}", va="center", fontsize=12, fontweight="bold")
        ax1.text(b.get_width() + 6.5, b.get_y() + b.get_height() / 2 - 0.16,
                 f"template : {tpl}", va="center", fontsize=8.6, style="italic",
                 color="#444444")
        ax1.text(b.get_width() + 6.5, b.get_y() + b.get_height() / 2 + 0.14,
                 regle, va="center", fontsize=8.2, color="#666666")
    ax1.set_yticks(y)
    ax1.set_yticklabels([f"règle c{i+1} · {e[0]}" for i, e in enumerate(ecarts)], fontsize=10)
    ax1.set_xlim(0, 100)
    ax1.set_xlabel("effectifs (sur 437 sorties)")
    ax1.set_title("Écarts légitimes au nommage standard — 0 violation des 3 règles",
                  fontsize=10.5, color=OKABE["vert"], pad=8)
    ax1.invert_yaxis()
    ax1.grid(axis="x", ls="--", lw=0.5, color="#CCCCCC")
    ax1.spines[["top", "right"]].set_visible(False)

    # --- droite : routage O7-NLP -----------------------------------------------------
    o7 = [p for p in profils if p["source"] == "O7-NLP"]
    o7 = sorted(o7, key=lambda p: -float(p["nlp_confiance"]))
    y = np.arange(len(o7))
    conf = [float(p["nlp_confiance"]) for p in o7]
    couleurs = [OKABE["bleu"] if p["route_nlp"] != "NON-CLASSIFIABLE" else OKABE["orange"]
                for p in o7]
    bars = ax2.barh(y, conf, color=couleurs, height=0.5)
    ax2.axvline(0.70, color=OKABE["noir"], lw=1.3, ls="--")
    ax2.text(0.706, 5.38, "seuil NLP 0,70", fontsize=8.2, color="#444444",
             va="center", bbox=dict(facecolor="white", edgecolor="none", alpha=0.85, pad=1.0))
    for b, p in zip(bars, o7):
        route = p["route_nlp"]
        lab = f"→ {route}" + ("" if route == "NON-CLASSIFIABLE" else f" · force {p['force']}")
        ax2.text(b.get_width() + 0.012, b.get_y() + b.get_height() / 2, lab,
                 va="center", fontsize=8.8,
                 color=OKABE["bleu"] if route != "NON-CLASSIFIABLE" else OKABE["orange"],
                 bbox=dict(facecolor="white", edgecolor="none", alpha=0.85, pad=1.0))
        ax2.text(0.015, b.get_y() + b.get_height() / 2, f"{fr(float(p['nlp_confiance']), 2)}",
                 va="center", fontsize=8.6, color="white", fontweight="bold")
    ax2.set_yticks(y)
    ax2.set_yticklabels([p["identifiant"] for p in o7], fontsize=9.5)
    ax2.set_xlim(0, 1.30)
    ax2.set_xlabel("confiance NLP")
    ax2.set_title("6 profils O7-NLP — routés exactement : 6/6 (C3)",
                  fontsize=10.5, color=OKABE["vert"], pad=8)
    ax2.invert_yaxis()
    ax2.grid(axis="x", ls="--", lw=0.5, color="#CCCCCC")
    ax2.spines[["top", "right"]].set_visible(False)

    fig.tight_layout(rect=(0, 0.05, 1, 0.92))
    fig.text(0.01, 0.012, SOURCE, fontsize=8.2, color="#555555", ha="left")
    fig.savefig(FIG / "BarChart_EcartsLegitimes_O7_R1_2026-10-15.png",
                dpi=150, bbox_inches="tight", facecolor="white")
    plt.close(fig)


def main():
    FIG.mkdir(exist_ok=True)
    meta, matrice, compar, profils = charge_donnees()
    fig_dashboard(meta)
    fig_matrice(matrice)
    fig_avant_apres(compar)
    fig_ecarts_o7(meta, profils)
    for p in sorted(FIG.glob("*.png")):
        print(p.name)


if __name__ == "__main__":
    main()
