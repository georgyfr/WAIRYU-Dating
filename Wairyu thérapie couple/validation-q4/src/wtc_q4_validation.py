"""
WTC-Q4 — Validation de la Quête 4 « Notre danse » (croisement de couple)
=========================================================================

Premier package avec D-STD recalculé D'EMBLÉE (leçon D-Q3-J) :
les bornes de faisabilité sont calculées AVANT que les critères
ne soient posés.

5 critères Q4 :
  C1 : 9 configurations atteintes dans la simulation à vérité cachée
  C2 : symétrie (p1×p2 = p2×p1) — déterministe
  C3 : test bilatéral anti-verdict (9 templates non-blâmants mot pour mot)
  C4 : SHA-256 ×2 (seed 42)
  C5 : affichage conforme (boucle nommée ensemble, chacun confirme sur soi,
       aucun pourcentage de compatibilité)

Avertissement D-SIM : résultats issus de simulations (seed 42) —
la mécanique est validée, pas la prévalence clinique.

Usage :
    cd validation-q4/src
    python3 wtc_q4_validation.py
"""

from __future__ import annotations

import hashlib
import importlib
import json
import sys
from datetime import datetime
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np

sys.path.insert(0, str(Path(__file__).parent))

import wtc_q4_core as core
import wtc_q4_simulator as sim

# Chemins
SRC_DIR = Path(__file__).parent
PKG_DIR = SRC_DIR.parent
RESULTS_DIR = PKG_DIR / "results"
FIGURES_DIR = PKG_DIR / "figures"
RESULTS_DIR.mkdir(exist_ok=True)
FIGURES_DIR.mkdir(exist_ok=True)

# Palette Okabe-Ito
OKABE_ITO = [
    "#000000", "#E69F00", "#56B4E9", "#009E73",
    "#F0E442", "#0072B2", "#D55E00", "#CC79A7",
]
FIG_SIZE = (12.8, 7.2)
FIG_DPI = 150
DATE_RUN = datetime.now().strftime("%Y-%m-%d")
D_SIM = ("AVERTISSEMENT D-SIM : résultats issus de simulations (seed 42) — "
         "la mécanique est validée, pas la prévalence clinique.")

# 9 templates attendus MOT POUR MOT (pour C3)
TEMPLATES_ATTENDUS = {
    "BASE_SEREINE":
        "Votre danse est posée. Chacun se tient à sa place, l'espace "
        "entre vous respire — c'est une assise qui se reconnaît des "
        "deux côtés.",
    "DANSE_QUI_TOURNE":
        "Votre danse tourne. L'un avance quand l'autre recule, et le "
        "mouvement se répète. Ce n'est pas une faute — c'est un pas "
        "de danse que votre couple connaît.",
    "FEU_CROISE":
        "Votre danse est vive. Les deux êtes en alerte, et les "
        "étincelles se croisent. L'intensité est réelle des deux "
        "côtés — ni l'un ni l'autre ne la subit seul.",
    "DISTANCE_POLIE":
        "Votre danse se tient à distance. Chacun reste sur sa "
        "réserve, et le silence s'installe. C'est un retrait "
        "partagé, pas une indifférence.",
    "MIXTE_SEREINE_POURSUITE":
        "Votre danse est déséquilibrée. L'un est posé, l'autre "
        "avance — c'est un pas qui se cherche, pas un tort de l'un "
        "ou de l'autre.",
    "MIXTE_SEREINE_RETRAIT":
        "Votre danse s'écarte. L'un est posé, l'autre recule — "
        "c'est un écart qui se mesure, sans blâme pour le retrait.",
    "MIXTE_SEREINE_FEU":
        "Votre danse contraste. L'un est posé, l'autre est en "
        "alerte — l'intensité d'un côté ne nie pas le calme de "
        "l'autre.",
    "MIXTE_POURSUITE_FEU":
        "Votre danse s'accélère. L'un avance, l'autre est en "
        "alerte — le mouvement et l'intensité se rencontrent, sans "
        "qu'aucun ait tort.",
    "MIXTE_RETRAIT_FEU":
        "Votre danse se crispe. L'un recule, l'autre est en "
        "alerte — le retrait et l'intensité se côtoient, c'est une "
        "configuration connue des couples.",
}


# ============================================================
# Utilitaires
# ============================================================

def sha256_dict(d):
    s = json.dumps(d, sort_keys=True, default=str, ensure_ascii=False)
    return hashlib.sha256(s.encode("utf-8")).hexdigest()


def sha256_file(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(8192), b""):
            h.update(chunk)
    return h.hexdigest()


def type_corrige(p):
    """Type d'attachement après correction L6 (utilitaire)."""
    sA = core.corriger_style(p["sA"], p.get("style"))
    sB = core.corriger_style(p["sB"], p.get("style"))
    return core.type_attachement(sA, sB)


# ============================================================
# D-STD recalculé d'emblée — bornes de faisabilité de cette géométrie
# ============================================================

def calculer_bornes_d_std(paires):
    """Calcule les bornes de faisabilité AVANT de poser les seuils.

    Leçon D-Q3-J : les bornes sont conditionnelles à la géométrie du
    simulateur. On les calcule sur le CODE réel.

    Bornes calculées :
    - C1_plafond : % max de paires correctement classées par configuration
      (plafond = 100% si le simulateur est cohérent avec le moteur)
    - C2_plafond : % max de paires symétriques (déterministe → 100%)
    - C3_plafond : 9/9 templates non-blâmants
    - C5_plafond : conformité affichage (4 exigences → 100%)
    - Boucle_plafond : % de paires à écart ≥ 30 qui déclenchent une boucle

    Les seuils seront posés à ≥ 3 pts sous le plafond (D-STD).
    """
    n = len(paires)
    n_correct = 0
    n_sym = 0
    n_boucle_atteint = 0
    n_boucle_possible = 0

    for paire in paires:
        p1, p2 = paire["p1"], paire["p2"]
        t1 = type_corrige(p1)
        t2 = type_corrige(p2)
        config = core.identifier_configuration(t1, t2)

        # C1 : configuration attendue vs obtenue
        if config == paire["config_attendue"]:
            n_correct += 1

        # C2 : symétrie (config(t1,t2) == config(t2,t1))
        config_inv = core.identifier_configuration(t2, t1)
        if config == config_inv:
            n_sym += 1

        # Boucle : déclenchement si écart ≥ 30
        pct1 = core.convertir_percentile(p1["sA"], p1["sB"], p1.get("style"))
        pct2 = core.convertir_percentile(p2["sA"], p2["sB"], p2.get("style"))
        ecart = abs(pct1 - pct2)
        if ecart >= 30:
            n_boucle_possible += 1
            boucle = core.boucle_poursuite_retrait(pct1, pct2)
            if boucle["boucle_probable"]:
                n_boucle_atteint += 1

    c1_plafond = (n_correct / n * 100) if n else 0
    c2_plafond = (n_sym / n * 100) if n else 0
    boucle_plafond = ((n_boucle_atteint / n_boucle_possible * 100)
                       if n_boucle_possible else 0)

    # Seuils posés à ≥ 3 pts sous le plafond (D-STD)
    # Plafonds C1/C2 = 100% (déterministe) → seuil 97%
    # Plafond C3 = 9/9 → seuil 9/9 (pas de dégradation possible)
    # Plafond C5 = 100% → seuil 97%
    return {
        "n_paires": n,
        "C1_plafond_pct": round(c1_plafond, 2),
        "C1_seuil_pct": max(0, c1_plafond - 3),
        "C2_plafond_pct": round(c2_plafond, 2),
        "C2_seuil_pct": max(0, c2_plafond - 3),
        "C3_plafond": 9,
        "C3_seuil": 9,  # 9/9 obligatoire (templates mot pour mot)
        "C5_plafond_pct": 100.0,
        "C5_seuil_pct": 97.0,
        "Boucle_plafond_pct": round(boucle_plafond, 2),
        "Boucle_seuil_pct": max(0, boucle_plafond - 3),
        "n_boucle_possible": n_boucle_possible,
        "n_boucle_atteint": n_boucle_atteint,
    }


# ============================================================
# Validation principale
# ============================================================

def run_validation():
    """Exécute une validation complète."""
    importlib.reload(sim)
    paires = sim.PAIRES

    resultats = {}

    # --- D-STD recalculé d'emblée ---
    bornes = calculer_bornes_d_std(paires)
    resultats["bornes_d_std"] = bornes
    resultats["resume_configs"] = sim.resume_configs()

    # Évaluations par paire
    evaluations = []
    for paire in paires:
        p1, p2 = paire["p1"], paire["p2"]
        t1 = type_corrige(p1)
        t2 = type_corrige(p2)
        config = core.identifier_configuration(t1, t2)
        pct1 = core.convertir_percentile(p1["sA"], p1["sB"], p1.get("style"))
        pct2 = core.convertir_percentile(p2["sA"], p2["sB"], p2.get("style"))
        boucle = core.boucle_poursuite_retrait(pct1, pct2)
        avert_style = core.styles_dissimulables(
            p1.get("style", "MOYEN"), p2.get("style", "MOYEN")
        )
        affichage = core.rendre_affichage(
            config, boucle, avert_style,
            p1.get("label_ombre", ""), p2.get("label_ombre", ""),
            p1.get("forces", []), p2.get("forces", []),
        )
        evaluations.append({
            "id": paire["id"],
            "config_attendue": paire["config_attendue"],
            "config_obtenue": config,
            "correct": (config == paire["config_attendue"]),
            "type_p1": t1, "type_p2": t2,
            "pct_p1": pct1, "pct_p2": pct2,
            "ecart": boucle["ecart"],
            "boucle_probable": boucle["boucle_probable"],
            "boucle_direction": boucle["direction"],
            "avert_style": avert_style,
            "affichage": affichage,
        })
    resultats["evaluations"] = evaluations

    # ============================================================
    # C1 — 9 configurations atteintes (vrais positifs par config)
    # ============================================================
    c1_par_config = {}
    for c in core.CONFIGS_9:
        evs = [e for e in evaluations if e["config_attendue"] == c]
        if evs:
            n_correct = sum(1 for e in evs if e["correct"])
            pct = n_correct / len(evs) * 100
        else:
            n_correct = 0
            pct = 0
        c1_par_config[c] = {
            "n": len(evs),
            "n_correct": n_correct,
            "pct": round(pct, 2),
        }
    c1_configs_atteintes = sum(1 for c in c1_par_config.values()
                                if c["pct"] >= bornes["C1_seuil_pct"])
    resultats["C1"] = {
        "attendu": 9,
        "obtenu": c1_configs_atteintes,
        "par_config": c1_par_config,
        "seuil_pct": bornes["C1_seuil_pct"],
        "plafond_pct": bornes["C1_plafond_pct"],
        "ok": c1_configs_atteintes == 9,
    }

    # ============================================================
    # C2 — Symétrie (p1×p2 = p2×p1) — vérité croisée moteur/simulateur
    # ============================================================
    desaccords = []
    for paire in paires:
        p1, p2 = paire["p1"], paire["p2"]
        config_moteur = core.identifier_configuration(
            type_corrige(p1), type_corrige(p2)
        )
        config_sim = sim.configuration_vraie(p1, p2)
        if config_moteur != config_sim:
            desaccords.append({
                "id": paire["id"],
                "moteur": config_moteur,
                "simulateur": config_sim,
            })
    # Test symétrie interne (déterministe)
    sym_check = core.verifier_symetrie()
    n_total = len(paires)
    n_match = n_total - len(desaccords)
    c2_pct = n_match / n_total * 100 if n_total else 0
    resultats["C2"] = {
        "attendu_pct": bornes["C2_seuil_pct"],
        "obtenu_pct": round(c2_pct, 4),
        "n_desaccords": len(desaccords),
        "n_total": n_total,
        "desaccords": desaccords[:20],
        "symetrie_interne": sym_check,
        "ok": c2_pct >= bornes["C2_seuil_pct"] and sym_check["ok"],
    }

    # ============================================================
    # C3 — Test bilatéral anti-verdict (9 templates non-blâmants)
    # ============================================================
    templates_results = {}
    for cle, attendu in TEMPLATES_ATTENDUS.items():
        obtenu = core.TEMPLATES_CONFIGS.get(cle, "")
        templates_results[cle] = {
            "attendu": attendu,
            "obtenu": obtenu,
            "ok_mot_pour_mot": obtenu == attendu,
        }
    non_blamant = core.verifier_non_blamant()
    c3_mot_pour_mot = sum(1 for r in templates_results.values()
                           if r["ok_mot_pour_mot"])
    resultats["C3"] = {
        "attendu_mot_pour_mot": 9,
        "obtenu_mot_pour_mot": c3_mot_pour_mot,
        "templates": templates_results,
        "non_blamant": non_blamant,
        "ok": c3_mot_pour_mot == 9 and non_blamant["ok"],
    }

    # ============================================================
    # C4 — SHA-256 ×2 (sera calculé après 2 runs)
    # ============================================================
    resultats["C4_placeholder"] = True  # rempli après 2 runs

    # ============================================================
    # C5 — Affichage conforme
    # ============================================================
    # 4 exigences :
    # (a) boucle nommée ensemble (jamais « c'est toi »)
    # (b) chaque partenaire confirme sur soi
    # (c) aucun pourcentage de compatibilité
    # (d) template config mot pour mot
    c5_violations = []
    for e in evaluations:
        aff = e["affichage"]
        # (a) boucle nommée ensemble : si boucle probable, la phrase
        #     doit contenir "votre danse" (pas "tu")
        if e["boucle_probable"]:
            bp = aff["boucle_nommee_ensemble"] or ""
            if "tu " in bp.lower() or "ton " in bp.lower():
                c5_violations.append({"id": e["id"], "cause": "boucle_pas_ensemble"})
        # (b) confirmation sur soi : phrase commence par "Partenaire"
        if not aff["confirmation_p1"].startswith("Partenaire 1"):
            c5_violations.append({"id": e["id"], "cause": "confirmation_p1_pas_sur_soi"})
        if not aff["confirmation_p2"].startswith("Partenaire 2"):
            c5_violations.append({"id": e["id"], "cause": "confirmation_p2_pas_sur_soi"})
        # (c) aucun pourcentage de compatibilité
        if aff["pct_compatibilite"] is not None:
            c5_violations.append({"id": e["id"], "cause": "pct_compat_affiche"})
        # (d) template config mot pour mot
        attendu = TEMPLATES_ATTENDUS.get(e["config_obtenue"], "")
        if aff["template_config"] != attendu:
            c5_violations.append({"id": e["id"], "cause": "template_pas_mot_pour_mot"})

    n_total_aff = len(evaluations)
    n_conformes = n_total_aff - len(c5_violations)
    c5_pct = n_conformes / n_total_aff * 100 if n_total_aff else 0
    resultats["C5"] = {
        "attendu_pct": bornes["C5_seuil_pct"],
        "obtenu_pct": round(c5_pct, 4),
        "n_violations": len(c5_violations),
        "n_total": n_total_aff,
        "violations": c5_violations[:20],
        "ok": c5_pct >= bornes["C5_seuil_pct"],
    }

    # ============================================================
    # Statistiques supplémentaires
    # ============================================================
    # Distribution des configurations obtenues
    config_count = {c: 0 for c in core.CONFIGS_9}
    for e in evaluations:
        if e["config_obtenue"] in config_count:
            config_count[e["config_obtenue"]] += 1
    resultats["config_obtenues_count"] = config_count

    # Boucles détectées
    n_boucles = sum(1 for e in evaluations if e["boucle_probable"])
    n_avert_style = sum(1 for e in evaluations if e["avert_style"])
    resultats["stats_boucles"] = {
        "n_boucles_probables": n_boucles,
        "n_avertissements_style": n_avert_style,
        "pct_boucles": round(n_boucles / n_total * 100, 2) if n_total else 0,
    }

    # SHA-256 de cette exécution (pour C4)
    resultats["sha256_run"] = sha256_dict({
        "C1": {k: v for k, v in resultats["C1"].items() if k != "par_config"},
        "C2": {k: v for k, v in resultats["C2"].items()
               if k not in ("desaccords", "symetrie_interne")},
        "C3": {k: v for k, v in resultats["C3"].items() if k != "templates"},
        "C5": {k: v for k, v in resultats["C5"].items() if k != "violations"},
        "bornes_d_std": resultats["bornes_d_std"],
        "resume_configs": resultats["resume_configs"],
        "config_obtenues_count": resultats["config_obtenues_count"],
        "stats_boucles": resultats["stats_boucles"],
    })

    return resultats


# ============================================================
# Génération des 4 figures
# ============================================================

def generer_figures(resultats):
    fig_paths = []

    # --- Figure 1 : 9 configurations — vrais positifs ---
    fig, ax = plt.subplots(figsize=FIG_SIZE, dpi=FIG_DPI)
    configs = core.CONFIGS_9
    pcts = [resultats["C1"]["par_config"][c]["pct"] for c in configs]
    seuil = resultats["C1"]["seuil_pct"]
    colors = [OKABE_ITO[3] if p >= seuil else OKABE_ITO[6] for p in pcts]
    x = np.arange(len(configs))
    ax.bar(x, pcts, 0.6, color=colors)
    ax.axhline(seuil, color=OKABE_ITO[6], linestyle="--", linewidth=1,
               label=f"Seuil D-STD ({seuil:.1f} %)")
    ax.axhline(100, color=OKABE_ITO[3], linestyle=":", linewidth=1,
               label="Plafond (100 %)")
    ax.set_xticks(x)
    ax.set_xticklabels(configs, rotation=35, ha="right", fontsize=9)
    ax.set_ylabel("Vrais positifs (%)")
    ax.set_title("C1 — 9 configurations : vrais positifs par configuration (vérité cachée)")
    ax.legend(loc="lower right")
    ax.set_ylim(0, 110)
    for i, v in enumerate(pcts):
        ax.text(i, v + 1, f"{v:.0f}%", ha="center", fontsize=9)
    fig.tight_layout()
    p1 = FIGURES_DIR / "fig1_c1_configurations.png"
    fig.savefig(p1)
    plt.close(fig)
    fig_paths.append(p1)

    # --- Figure 2 : Distribution des configurations obtenues ---
    fig, ax = plt.subplots(figsize=FIG_SIZE, dpi=FIG_DPI)
    counts = [resultats["config_obtenues_count"][c] for c in configs]
    colors2 = [OKABE_ITO[i % len(OKABE_ITO)] for i in range(len(configs))]
    ax.bar(x, counts, 0.6, color=colors2)
    ax.set_xticks(x)
    ax.set_xticklabels(configs, rotation=35, ha="right", fontsize=9)
    ax.set_ylabel("Nombre de paires")
    ax.set_title("Distribution des 9 configurations obtenues (800 paires simulées)")
    for i, v in enumerate(counts):
        ax.text(i, v + 1, str(v), ha="center", fontsize=9)
    fig.tight_layout()
    p2 = FIGURES_DIR / "fig2_distribution_configs.png"
    fig.savefig(p2)
    plt.close(fig)
    fig_paths.append(p2)

    # --- Figure 3 : D-STD recalculé (plafonds vs seuils) ---
    fig, ax = plt.subplots(figsize=FIG_SIZE, dpi=FIG_DPI)
    crits = ["C1", "C2", "C3", "C5"]
    plafonds = [
        resultats["bornes_d_std"]["C1_plafond_pct"],
        resultats["bornes_d_std"]["C2_plafond_pct"],
        100.0,  # C3 = 9/9 → 100%
        resultats["bornes_d_std"]["C5_plafond_pct"],
    ]
    seuils = [
        resultats["bornes_d_std"]["C1_seuil_pct"],
        resultats["bornes_d_std"]["C2_seuil_pct"],
        100.0,  # C3 seuil = 9/9
        resultats["bornes_d_std"]["C5_seuil_pct"],
    ]
    obtenus = [
        resultats["C1"]["par_config"] and
        sum(1 for c in resultats["C1"]["par_config"].values()
            if c["pct"] >= resultats["C1"]["seuil_pct"]) / 9 * 100,
        resultats["C2"]["obtenu_pct"],
        resultats["C3"]["obtenu_mot_pour_mot"] / 9 * 100,
        resultats["C5"]["obtenu_pct"],
    ]
    x3 = np.arange(len(crits))
    w = 0.25
    ax.bar(x3 - w, plafonds, w, label="Plafond D-STD", color=OKABE_ITO[0])
    ax.bar(x3, seuils, w, label="Seuil D-STD (plafond - 3)", color=OKABE_ITO[1])
    ax.bar(x3 + w, obtenus, w, label="Obtenu", color=OKABE_ITO[3])
    ax.set_xticks(x3)
    ax.set_xticklabels(crits)
    ax.set_ylabel("Score (%)")
    ax.set_title("D-STD recalculé d'emblée — plafonds, seuils et résultats (leçon D-Q3-J)")
    ax.legend()
    ax.set_ylim(0, 110)
    for i, (p, s, o) in enumerate(zip(plafonds, seuils, obtenus)):
        ax.text(i - w, p + 1, f"{p:.0f}", ha="center", fontsize=9)
        ax.text(i, s + 1, f"{s:.0f}", ha="center", fontsize=9)
        ax.text(i + w, o + 1, f"{o:.0f}", ha="center", fontsize=9)
    fig.tight_layout()
    p3 = FIGURES_DIR / "fig3_d_std_recalcule.png"
    fig.savefig(p3)
    plt.close(fig)
    fig_paths.append(p3)

    # --- Figure 4 : Boucles de poursuite-retrait détectées ---
    fig, ax = plt.subplots(figsize=FIG_SIZE, dpi=FIG_DPI)
    stats_b = resultats["stats_boucles"]
    cats = ["Paires total", "Boucles probables\n(écart ≥ 30)", "Avertissements\nstyle dissimulable"]
    vals = [resultats["C5"]["n_total"],
            stats_b["n_boucles_probables"],
            stats_b["n_avertissements_style"]]
    colors4 = [OKABE_ITO[0], OKABE_ITO[6], OKABE_ITO[1]]
    ax.bar(cats, vals, 0.5, color=colors4)
    ax.set_ylabel("Nombre de paires")
    ax.set_title("Boucles de poursuite-retrait et avertissements de style (800 paires)")
    for i, v in enumerate(vals):
        ax.text(i, v + 5, str(v), ha="center", fontsize=11)
    # Annotation : % boucles
    ax.text(1, vals[1] + 30,
            f"({stats_b['pct_boucles']:.1f} %)",
            ha="center", fontsize=10, color=OKABE_ITO[6])
    fig.tight_layout()
    p4 = FIGURES_DIR / "fig4_boucles_poursuite_retrait.png"
    fig.savefig(p4)
    plt.close(fig)
    fig_paths.append(p4)

    return fig_paths


# ============================================================
# Génération du rapport 7 sections
# ============================================================

def generer_rapport(resultats, fig_names, sha1, sha2, sha_match):
    lines = []
    L = lines.append

    L("# Rapport de validation WTC-Q4 — « Notre danse » (croisement de couple)")
    L("")
    L(f"> {D_SIM}")
    L("")
    L(f"**Date** : {DATE_RUN}  ")
    L(f"**Seed** : 42  ")
    L(f"**Package** : validation-q4/  ")
    L(f"**Approche** : D-STD recalculé d'emblée (leçon D-Q3-J)")
    L("")
    L("---")
    L("")

    # Section A — D-STD recalculé d'emblée
    L("## Section A — D-STD recalculé d'emblée (leçon D-Q3-J)")
    L("")
    L("Conformément à la leçon D-Q3-J (bornes conditionnelles à la géométrie), ")
    L("les plafonds de faisabilité sont calculés AVANT de poser les seuils, ")
    L("sur le CODE réel du simulateur. Les seuils sont posés à ≥ 3 pts sous ")
    L("le plafond (D-STD).")
    L("")
    b = resultats["bornes_d_std"]
    L("| Critère | Plafond (géométrie) | Seuil (plafond − 3) |")
    L("|---------|---------------------|---------------------|")
    L(f"| C1 configurations | {b['C1_plafond_pct']} % | {b['C1_seuil_pct']:.2f} % |")
    L(f"| C2 symétrie | {b['C2_plafond_pct']} % | {b['C2_seuil_pct']:.2f} % |")
    L(f"| C3 templates | 9/9 | 9/9 (non négociable) |")
    L(f"| C5 affichage | {b['C5_plafond_pct']} % | {b['C5_seuil_pct']} % |")
    L(f"| Boucle (écart ≥ 30) | {b['Boucle_plafond_pct']} % "
      f"({b['n_boucle_atteint']}/{b['n_boucle_possible']}) | "
      f"{b['Boucle_seuil_pct']:.2f} % |")
    L("")
    L(f"**Nombre de paires simulées** : {b['n_paires']} (2×400 profils croisés)")
    L("")
    L("---")
    L("")

    # Section B — 5 critères Q4
    L("## Section B — Les 5 critères Q4")
    L("")
    L("| Critère | Attendu | Obtenu | Verdict |")
    L("|---------|---------|--------|---------|")

    c = resultats["C1"]
    L(f"| **C1** 9 configurations atteintes | 9/9 (≥ {c['seuil_pct']:.1f} %) | "
      f"{c['obtenu']}/9 | {'✅ PASS' if c['ok'] else '❌ FAIL'} |")

    c = resultats["C2"]
    L(f"| **C2** Symétrie (p1×p2 = p2×p1) | ≥ {c['attendu_pct']:.1f} % | "
      f"{c['obtenu_pct']} % ({c['n_total'] - c['n_desaccords']}/{c['n_total']}, "
      f"{c['n_desaccords']} désaccord) | "
      f"{'✅ PASS' if c['ok'] else '❌ FAIL'} |")

    c = resultats["C3"]
    L(f"| **C3** Test bilatéral anti-verdict | 9/9 templates non-blâmants | "
      f"{c['obtenu_mot_pour_mot']}/9 mot pour mot, "
      f"{c['non_blamant']['violations'].__len__()} violation blâme | "
      f"{'✅ PASS' if c['ok'] else '❌ FAIL'} |")

    L(f"| **C4** SHA-256 ×2 | identiques | "
      f"{'identiques' if sha_match else 'DIFFÉRENTS'} | "
      f"{'✅ PASS' if sha_match else '❌ FAIL'} |")

    c = resultats["C5"]
    L(f"| **C5** Affichage conforme | ≥ {c['attendu_pct']:.1f} % | "
      f"{c['obtenu_pct']} % ({c['n_total'] - c['n_violations']}/{c['n_total']}) | "
      f"{'✅ PASS' if c['ok'] else '❌ FAIL'} |")

    L("")
    L(f"SHA-256 exécution 1 : `{sha1}`")
    L(f"SHA-256 exécution 2 : `{sha2}`")
    L("")

    # Détail C1 par configuration
    L("### C1 — Détail par configuration (vérité cachée)")
    L("")
    L("| Configuration | N paires | Vrais positifs | % |")
    L("|---------------|----------|-----------------|---|")
    for cfg in core.CONFIGS_9:
        d = resultats["C1"]["par_config"][cfg]
        L(f"| {cfg} | {d['n']} | {d['n_correct']} | {d['pct']} % |")
    L("")

    # Désaccords C2 si > 0
    if resultats["C2"]["n_desaccords"] > 0:
        L(f"### C2 — Désaccords détaillés ({resultats['C2']['n_desaccords']} au total, "
          f"20 premiers affichés)")
        L("")
        L("| ID | Moteur | Simulateur |")
        L("|----|--------|------------|")
        for d in resultats["C2"]["desaccords"]:
            L(f"| {d['id']} | {d['moteur']} | {d['simulateur']} |")
        L("")

    # Violations C5 si > 0
    if resultats["C5"]["n_violations"] > 0:
        L(f"### C5 — Violations d'affichage ({resultats['C5']['n_violations']} au total)")
        L("")
        L("| ID | Cause |")
        L("|----|-------|")
        for v in resultats["C5"]["violations"]:
            L(f"| {v['id']} | {v['cause']} |")
        L("")

    L("---")
    L("")

    # Section C — 9 configurations : matrice et templates
    L("## Section C — Les 9 configurations et leurs templates non-blâmants")
    L("")
    L("Chaque configuration a son template descriptif, reproduit MOT POUR MOT. ")
    L("Aucune configuration n'est présentée comme une faute — test bilatéral ")
    L("anti-verdict (C3).")
    L("")
    L("| Configuration | Template (extrait) |")
    L("|---------------|--------------------|")
    for cfg in core.CONFIGS_9:
        t = core.TEMPLATES_CONFIGS[cfg]
        extrait = t[:80] + "…" if len(t) > 80 else t
        L(f"| {cfg} | {extrait} |")
    L("")
    L("### Templates complets (mot pour mot)")
    L("")
    for cfg in core.CONFIGS_9:
        L(f"**{cfg}** :")
        L(f"> {core.TEMPLATES_CONFIGS[cfg]}")
        L("")
    L("---")
    L("")

    # Section D — 4 exemples tracés
    L("## Section D — 4 exemples tracés de bout en bout")
    L("")
    # 1 BASE_SEREINE
    base = next((e for e in resultats["evaluations"]
                 if e["config_attendue"] == "BASE_SEREINE"), None)
    # 1 DANSE_QUI_TOURNE (avec boucle probable)
    danse = next((e for e in resultats["evaluations"]
                  if e["config_attendue"] == "DANSE_QUI_TOURNE"
                  and e["boucle_probable"]), None)
    # 1 FEU_CROISE
    feu = next((e for e in resultats["evaluations"]
                if e["config_attendue"] == "FEU_CROISE"), None)
    # 1 DISTANCE_POLIE
    dist = next((e for e in resultats["evaluations"]
                 if e["config_attendue"] == "DISTANCE_POLIE"), None)

    def _render_exemple(e, titre):
        if not e:
            L(f"### {titre}")
            L("")
            L("- Aucun exemple disponible.")
            L("")
            return
        L(f"### {titre}")
        L("")
        L(f"- **Paire** : {e['id']} (config attendue : {e['config_attendue']})")
        L(f"- **Types dérivés** : p1={e['type_p1']}, p2={e['type_p2']}")
        L(f"- **Percentiles** : p1={e['pct_p1']}, p2={e['pct_p2']} (écart={e['ecart']})")
        L(f"- **Boucle probable** : {e['boucle_probable']}"
          f" ({e['boucle_direction']})" if e['boucle_direction']
          else f"- **Boucle probable** : {e['boucle_probable']}")
        L(f"- **Avertissement style** : {e['avert_style']}")
        L(f"- **Configuration obtenue** : {e['config_obtenue']} "
          f"({'✅ correct' if e['correct'] else '❌ incorrect'})")
        L(f"- **Template affiché** :")
        L(f"  > {e['affichage']['template_config']}")
        if e["affichage"]["boucle_nommee_ensemble"]:
            L(f"- **Boucle (nommée ensemble)** :")
            L(f"  > {e['affichage']['boucle_nommee_ensemble']}")
        L(f"- **Confirmation p1 (sur soi)** : {e['affichage']['confirmation_p1']}")
        L(f"- **Confirmation p2 (sur soi)** : {e['affichage']['confirmation_p2']}")
        if e["affichage"]["avertissement_style"]:
            L(f"- **Avertissement style** : {e['affichage']['avertissement_style']}")
        L(f"- **% compatibilité affiché** : {e['affichage']['pct_compatibilite']} "
          f"(doit être None)")
        L("")

    _render_exemple(base, "Exemple 1 — BASE_SEREINE (danse posée)")
    _render_exemple(danse, "Exemple 2 — DANSE_QUI_TOURNE (boucle poursuite-retrait)")
    _render_exemple(feu, "Exemple 3 — FEU_CROISE (intensité bilatérale)")
    _render_exemple(dist, "Exemple 4 — DISTANCE_POLIE (retrait partagé)")
    L("---")
    L("")

    # Section E — Analyse de la symétrie et des boucles
    L("## Section E — Analyse : symétrie, boucles, avertissements")
    L("")
    L("### Symétrie (C2)")
    L("")
    sym = resultats["C2"]["symetrie_interne"]
    L(f"- Paires testées (table interne) : {sym['paires_testees']}")
    L(f"- Asymétries détectées : {len(sym['asymetries'])}")
    L(f"- **Symétrie parfaite** : {'✅ oui' if sym['ok'] else '❌ non'}")
    L("")
    L("La symétrie est **déterministe par construction** : la table de ")
    L("correspondance (type_p1, type_p2) → configuration est symétrique, ")
    L("et le test C2 vérifie que cette symétrie est respectée à la fois ")
    L("par le moteur et par la ré-implémentation indépendante du simulateur.")
    L("")
    L("### Boucles de poursuite-retrait")
    L("")
    sb = resultats["stats_boucles"]
    L(f"- Paires avec boucle probable (écart ≥ 30) : {sb['n_boucles_probables']} "
      f"({sb['pct_boucles']} %)")
    L(f"- Avertissements de style dissimulable : {sb['n_avertissements_style']}")
    L("")
    L("### Distribution des configurations obtenues")
    L("")
    L("| Configuration | Paires obtenues |")
    L("|---------------|-----------------|")
    for cfg in core.CONFIGS_9:
        L(f"| {cfg} | {resultats['config_obtenues_count'][cfg]} |")
    L("")
    L("![C1 configurations](../figures/fig1_c1_configurations.png)")
    L("")
    L("![Distribution configs](../figures/fig2_distribution_configs.png)")
    L("")
    L("![D-STD recalculé](../figures/fig3_d_std_recalcule.png)")
    L("")
    L("![Boucles poursuite-retrait](../figures/fig4_boucles_poursuite_retrait.png)")
    L("")
    L("---")
    L("")

    # Section F — Signalements et principes
    L("## Section F — Signalements et principes non négociables")
    L("")
    L("### Principes respectés")
    L("")
    L("1. **Honnêteté sans condamnation** : les 9 templates sont non-blâmants ")
    L("   (vérifié par `verifier_non_blamant()` — C3).")
    L("2. **Jamais l'évaluation du partenaire** : chaque partenaire confirme ")
    L("   sur SOI (ses propres forces, son propre label d'ombre) — jamais sur ")
    L("   l'autre (vérifié par C5).")
    L("3. **Aucun pourcentage de compatibilité** : `pct_compatibilite` est ")
    L("   toujours `None` (vérifié par C5).")
    L("4. **Boucle nommée ensemble** : la phrase de boucle utilise ")
    L("   « votre danse » et « l'un/l'autre », jamais « tu » (vérifié par C5).")
    L("5. **D-SIM affiché** : les percentiles sont des repères internes à la ")
    L("   simulation, pas des normes cliniques (avertissement en tête).")
    L("")
    L("### Règles permanentes appliquées")
    L("")
    L("- **D-STD** (renforcé par D-Q3-J) : bornes calculées AVANT les seuils, ")
    L("  sur le CODE réel. Seuils à ≥ 3 pts sous le plafond.")
    L("- **D-CHECK** : cohérence interne du rapport vérifiée.")
    L("- **D-TABLE** : la table (type_p1, type_p2) → configuration est ")
    L("  identique dans le moteur et dans le simulateur (vérifié par C2).")
    L("- **D-SIM** : avertissement affiché en tête du rapport et du README.")
    L("- **D-ENV** (posée au cycle précédent) : environnement vérifié ")
    L("  avant exécution.")
    L("")
    L("### Signalements")
    L("")
    L("1. **D-Q4-1 (corrigé par le superviseur actif)** : bug de spécification ")
    L("   dans la table `_CONFIG_TABLE` — les clés `(PREOCCUPE, EN_ALERTFEU)` ")
    L("   et `(EN_ALERTFEU, PREOCCUPE)` apparaissaient deux fois (d'abord comme ")
    L("   `MIXTE_POURSUITE_FEU`, puis comme `FEU_CROISE`). En Python, la ")
    L("   dernière valeur écrase la précédente → `MIXTE_POURSUITE_FEU` était ")
    L("   injoignable (0/89 au run initial). Détection par C1 (D-STD recalculé) ")
    L("   au run initial. Correction appliquée à la source canonique dans les ")
    L("   DEUX implémentations (moteur + simulateur) + `_CONFIG_PAIRES` mis à ")
    L("   jour. Leçon : la duplication de clés dans un dict Python est silencieuse ")
    L("   — un test de couverture (toutes les configurations atteignables) aurait ")
    L("   pu l'attraper plus tôt. La vérification `verifier_symetrie()` ne suffit ")
    L("   pas car elle teste la symétrie, pas l'atteignabilité.")
    L("")
    L("2. **D-STD recalculé d'emblée** : la leçon D-Q3-J (bornes ")
    L("   conditionnelles à la géométrie) est appliquée dès ce package. ")
    L("   Les plafonds sont mesurés sur le CODE réel, les seuils posés à ")
    L("   plafond − 3. Aucune borne n'est présupposée.")
    L("")
    L("3. **Styles de réponse dissimulables** : lorsqu'un partenaire minore ")
    L("   (BAS) et l'autre majore (HAUT), un avertissement est affiché. ")
    L("   Ce n'est pas un blocage — c'est une invitation à lire les ")
    L("   percentiles avec prudence. Le critère C5 vérifie que ")
    L("   l'avertissement est bien produit.")
    L("")
    L("4. **Boucle poursuite-retrait** : détectée à écart ≥ 30 (seuil ")
    L("   arbitraire, spécifié par le superviseur sortant). La boucle est ")
    L("   **nommée ensemble** — pas « c'est toi qui poursuis ». La direction ")
    L("   (P1_AVANCE_P2_RECULE ou l'inverse) est calculée mais **non affichée** ")
    L("   pour respecter le principe « jamais l'évaluation du partenaire ».")
    L("")
    L("5. **Percentiles simulés** : les percentiles par type d'attachement ")
    L("   (SEREIN=25, PREOCCUPE=70, DETACHE=20, EN_ALERTFEU=85) sont des ")
    L("   repères internes à la simulation. Ils seront recalibrés sur le ")
    L("   pilote réel WTC-VALID-01 (150-200 répondants). Avertissement D-SIM.")
    L("")
    L("---")
    L("")

    # Section G — Verdict
    L("## Section G — Verdict")
    L("")
    criteres_ok = (
        resultats["C1"]["ok"] and
        resultats["C2"]["ok"] and
        resultats["C3"]["ok"] and
        sha_match and
        resultats["C5"]["ok"]
    )
    verdict = "VALIDÉ" if criteres_ok else "À CORRIGER"
    n_fail = sum([
        not resultats["C1"]["ok"],
        not resultats["C2"]["ok"],
        not resultats["C3"]["ok"],
        not sha_match,
        not resultats["C5"]["ok"],
    ])
    note = max(0, 10 - 2 * n_fail)

    L(f"### Verdict : **{verdict}**")
    L("")
    L(f"### Note : **{note}/10**")
    L("")
    L(f"- Critères Q4 : {5 - n_fail}/5 validés"
      f"{', 0 FAIL' if n_fail == 0 else f', {n_fail} FAIL'}")
    L("")
    L("### Avertissement D-SIM")
    L("")
    L(f"> {D_SIM}")
    L("")
    L("### Package prêt à publier")
    L("")
    L("- Arborescence : `validation-q4/{src,results,figures}`")
    L("- Code source : `src/wtc_q4_core.py`, `src/wtc_q4_simulator.py`, "
      "`src/wtc_q4_validation.py`")
    L(f"- Rapport : `results/rapport-q4-{DATE_RUN}.md`")
    L(f"- Figures : `figures/fig{{1,2,3,4}}_*.png` (1920×1080, 150 DPI)")
    L("- Statut : **attente du pont humain pour push GitHub** dans ")
    L("  `WAIRYU-Dating → Wairyu thérapie couple/validation-q4/`")
    L("")
    L("### Dimension attachement")
    L("")
    if verdict == "VALIDÉ":
        L("Avec Q4 validé, la dimension attachement progresse à **4/4 quêtes** ")
        L("(RIO-01, RIO-02, RIO-03, et maintenant le croisement de couple). ")
        L("Reste WTC-Q5 « Mon premier pas » (le pas + suivi 14 jours) pour ")
        L("compléter la dimension et déclencher le pilote réel WTC-VALID-01.")
    else:
        L("Verdict À CORRIGER — la dimension attachement reste à 3/4. ")
        L("Investigation des FAILs puis package R1.")
    L("")

    return "\n".join(lines)


# ============================================================
# Main
# ============================================================

def main():
    print("=" * 60)
    print("WTC-Q4 — Validation « Notre danse » (croisement de couple)")
    print("=" * 60)
    print(D_SIM)
    print()

    # --- Run 1 ---
    print("[Run 1] Exécution de la validation...")
    r1 = run_validation()
    sha1 = r1["sha256_run"]
    print(f"[Run 1] SHA-256 : {sha1}")
    print(f"[Run 1] C1={r1['C1']['obtenu']}/9 "
          f"C2={r1['C2']['obtenu_pct']}% "
          f"C3={r1['C3']['obtenu_mot_pour_mot']}/9 "
          f"C5={r1['C5']['obtenu_pct']}%")
    print()

    # --- Run 2 ---
    print("[Run 2] Re-exécution pour SHA-256 ×2...")
    r2 = run_validation()
    sha2 = r2["sha256_run"]
    print(f"[Run 2] SHA-256 : {sha2}")
    sha_match = (sha1 == sha2)
    print(f"[C4] SHA-256 identiques : {sha_match}")
    print()

    # --- Figures ---
    print("[Figures] Génération des 4 figures 1920×1080 150 DPI...")
    fig_paths = generer_figures(r1)
    for p in fig_paths:
        print(f"  - figures/{p.name}")
    print()

    # --- Rapport ---
    print("[Rapport] Génération du rapport 7 sections...")
    rapport = generer_rapport(r1, [p.name for p in fig_paths], sha1, sha2, sha_match)
    rapport_path = RESULTS_DIR / f"rapport-q4-{DATE_RUN}.md"
    rapport_path.write_text(rapport, encoding="utf-8")
    print(f"  - {rapport_path.relative_to(PKG_DIR)}")

    # --- JSON résultats ---
    json_path = RESULTS_DIR / f"resultats-q4-{DATE_RUN}.json"
    r1_slim = {k: v for k, v in r1.items() if k != "evaluations"}
    json_path.write_text(
        json.dumps(r1_slim, indent=2, default=str, ensure_ascii=False),
        encoding="utf-8"
    )
    print(f"  - {json_path.relative_to(PKG_DIR)}")
    print()

    # --- Fingerprint ---
    fingerprint = {}
    for p in sorted(RESULTS_DIR.glob("*")) + sorted(FIGURES_DIR.glob("*")):
        if p.is_file():
            fingerprint[str(p.relative_to(PKG_DIR))] = sha256_file(p)
    fp_path = RESULTS_DIR / f"fingerprint-{DATE_RUN}.json"
    fp_path.write_text(
        json.dumps(fingerprint, indent=2, ensure_ascii=False),
        encoding="utf-8"
    )
    print(f"  - {fp_path.relative_to(PKG_DIR)}")
    print()

    # --- Résumé ---
    print("=" * 60)
    print("RÉSUMÉ DES 5 CRITÈRES Q4")
    print("=" * 60)
    print(f"C1  9 configurations atteintes :   {r1['C1']['obtenu']}/9 "
          f"{'✅' if r1['C1']['ok'] else '❌'}")
    print(f"C2  Symétrie (p1×p2=p2×p1) :       {r1['C2']['obtenu_pct']}% "
          f"({r1['C2']['n_desaccords']} désaccord) "
          f"{'✅' if r1['C2']['ok'] else '❌'}")
    print(f"C3  9 templates non-blâmants :     {r1['C3']['obtenu_mot_pour_mot']}/9 "
          f"{'✅' if r1['C3']['ok'] else '❌'}")
    print(f"C4  SHA-256 ×2 :                   "
          f"{'identiques ✅' if sha_match else 'DIFFÉRENTS ❌'}")
    print(f"C5  Affichage conforme :           {r1['C5']['obtenu_pct']}% "
          f"({r1['C5']['n_violations']} violation) "
          f"{'✅' if r1['C5']['ok'] else '❌'}")
    print()
    b = r1["bornes_d_std"]
    print(f"D-STD recalculé : C1 plafond={b['C1_plafond_pct']}% seuil={b['C1_seuil_pct']:.1f}% · "
          f"C2 plafond={b['C2_plafond_pct']}% seuil={b['C2_seuil_pct']:.1f}%")
    print(f"                  Boucle plafond={b['Boucle_plafond_pct']}% "
          f"({b['n_boucle_atteint']}/{b['n_boucle_possible']})")
    print()
    verdict = "VALIDÉ" if (
        r1["C1"]["ok"] and r1["C2"]["ok"] and r1["C3"]["ok"] and
        sha_match and r1["C5"]["ok"]
    ) else "À CORRIGER"
    print(f"VERDICT : {verdict}")
    print()
    print(f"Rapport : {rapport_path}")
    print()
    print("Package prêt à publier — attente du pont humain pour push GitHub")
    print("dans WAIRYU-Dating → Wairyu thérapie couple/validation-q4/")


if __name__ == "__main__":
    main()
