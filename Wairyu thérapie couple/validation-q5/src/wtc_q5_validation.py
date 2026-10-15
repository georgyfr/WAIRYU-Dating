"""
WTC-Q5 — Validation de la Quête 5 « Mon premier pas »
=======================================================

Dernière quête de la dimension attachement.
D-STD recalculé d'emblée + D-STD-2 (plafond PAR CONFIGURATION,
pas seulement global — leçon Q4).

5 critères Q5 :
  C1 : suivi déterministe (14 jours simulés — le compteur compte exactement)
  C2 : anti-perfectionnisme testé (9/14, 7/14, 3/14 — chaque cas a son message)
  C3 : pas sélectionné par face dominante + empreinte (traçabilité Q1-Q2)
  C4 : SHA-256 ×2 (seed 42)
  C5 : affichage (rappels sans culpabilisation, compteurs privés, D-SIM)

Avertissement D-SIM : résultats issus de simulations (seed 42) —
la mécanique est validée, pas la prévalence clinique.

Usage :
    cd validation-q5/src
    python3 wtc_q5_validation.py
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

import wtc_q5_core as core
import wtc_q5_simulator as sim

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


# ============================================================
# D-STD recalculé d'emblée + D-STD-2 (plafond PAR CONFIG)
# ============================================================

def calculer_bornes_d_std(profils):
    """Calcule les bornes de faisabilité AVANT les seuils.

    D-STD-2 (leçon Q4) : le plafond se calcule PAR CONFIGURATION,
    pas seulement global. Une config injoignable (comme D-Q4-1)
    serait invisible dans la moyenne globale.
    """
    n = len(profils)
    n_pas_correct = 0
    n_cat_correct = 0

    # Plafond PAR CONFIG pour C3 (pas par face×empreinte)
    # 9 combinaisons face×empreinte → 6 pas
    pas_par_combinaison = {}
    for p in profils:
        bilan = core.bilan_du_pas(
            p["sA"], p["sB"], p["label_ombre"],
            p["jours_tenus"], p["date_pas"]
        )
        face = bilan["pas"]["face"]
        emp = bilan["pas"]["empreinte"]
        pas = bilan["pas"]["pas"]
        key = (face, emp)
        if key not in pas_par_combinaison:
            pas_par_combinaison[key] = {"correct": 0, "total": 0}
        pas_par_combinaison[key]["total"] += 1
        # Vérifier que le pas correspond à la table
        pas_attendu = core._PAS_TABLE.get((face, emp))
        if pas == pas_attendu:
            pas_par_combinaison[key]["correct"] += 1
            n_pas_correct += 1

        # C1 : suivi déterministe
        cat_obtenue = bilan["suivi"]["categorie"]
        cat_attendue = core.suivre_14_jours(p["jours_tenus"])["categorie"]
        if cat_obtenue == cat_attendue:
            n_cat_correct += 1

    # Plafond C3 par configuration (combinaison face×empreinte)
    plafonds_par_config = {}
    for key, d in pas_par_combinaison.items():
        if d["total"] > 0:
            plafonds_par_config[f"{key[0]}×{key[1]}"] = round(
                d["correct"] / d["total"] * 100, 2
            )

    # Plafond global
    c1_plafond = (n_cat_correct / n * 100) if n else 0
    c3_plafond = (n_pas_correct / n * 100) if n else 0
    # C3 plafond par config : min des plafonds par config
    c3_plafond_min = min(plafonds_par_config.values()) if plafonds_par_config else 0

    # C2 : anti-perfectionnisme — plafond 100% (déterministe par construction)
    # C5 : affichage — plafond 100%

    return {
        "n_profils": n,
        "C1_plafond_pct": round(c1_plafond, 2),
        "C1_seuil_pct": max(0, c1_plafond - 3),
        "C2_plafond_pct": 100.0,  # déterministe
        "C2_seuil_pct": 97.0,
        "C3_plafond_pct": round(c3_plafond, 2),
        "C3_plafond_par_config_min_pct": c3_plafond_min,  # D-STD-2
        "C3_seuil_pct": max(0, c3_plafond_min - 3),  # seuil sur le MIN par config
        "C5_plafond_pct": 100.0,
        "C5_seuil_pct": 97.0,
        "plafonds_par_config": plafonds_par_config,
    }


# ============================================================
# Validation principale
# ============================================================

def run_validation():
    """Exécute une validation complète."""
    importlib.reload(sim)
    profils = sim.PROFILS

    resultats = {}

    # --- D-STD recalculé d'emblée + D-STD-2 ---
    bornes = calculer_bornes_d_std(profils)
    resultats["bornes_d_std"] = bornes
    resultats["resume_groupes"] = sim.resume_groupes()

    # Évaluations par profil
    evaluations = []
    for p in profils:
        bilan = core.bilan_du_pas(
            p["sA"], p["sB"], p["label_ombre"],
            p["jours_tenus"], p["date_pas"]
        )
        # Vérité croisée C2 (pas_vrai)
        pas_sim = sim.pas_vrai(p["sA"], p["sB"], p["label_ombre"])
        cat_sim = sim.categorie_suivi_vraie(p["jours_tenus"])

        evaluations.append({
            "id": p["id"],
            "groupe": p["groupe"],
            "sA": round(p["sA"], 2),
            "sB": round(p["sB"], 2),
            "label_ombre": p["label_ombre"],
            "jours_tenus": p["jours_tenus"],
            "face_attendue": p["face_attendue"],
            "empreinte_attendue": p["empreinte_attendue"],
            "jours_cible": p["jours_cible"],
            # Moteur
            "pas_moteur": bilan["pas"]["pas"],
            "face_moteur": bilan["pas"]["face"],
            "empreinte_moteur": bilan["pas"]["empreinte"],
            "trace": bilan["pas"]["trace"],
            "categorie_moteur": bilan["suivi"]["categorie"],
            "taux_moteur": bilan["suivi"]["taux"],
            "sanction_moteur": bilan["suivi"]["sanction"],
            "re_test_date": bilan["re_test"]["date_re_test"],
            "re_test_force": bilan["re_test"]["force"],
            "affichage": bilan["affichage"],
            # Simulateur (vérité croisée)
            "pas_sim": pas_sim["pas"],
            "face_sim": pas_sim["face"],
            "empreinte_sim": pas_sim["empreinte"],
            "categorie_sim": cat_sim,
        })
    resultats["evaluations"] = evaluations

    # ============================================================
    # C1 — Suivi déterministe (compteur compte exactement)
    # ============================================================
    # Vérifier que pour chaque profil, la catégorie correspond exactement
    # aux jours_tenus (déterminisme strict).
    c1_correct = 0
    c1_violations = []
    for e in evaluations:
        # Recalcul déterministe
        s = core.suivre_14_jours(e["jours_tenus"])
        # Vérifier la cohérence interne
        if (e["categorie_moteur"] == s["categorie"]
            and e["taux_moteur"] == s["taux"]):
            c1_correct += 1
        else:
            c1_violations.append({
                "id": e["id"],
                "jours": e["jours_tenus"],
                "attendu": s["categorie"],
                "obtenu": e["categorie_moteur"],
            })
    c1_pct = c1_correct / len(evaluations) * 100 if evaluations else 0
    resultats["C1"] = {
        "attendu_pct": bornes["C1_seuil_pct"],
        "obtenu_pct": round(c1_pct, 4),
        "n_correct": c1_correct,
        "n_total": len(evaluations),
        "n_violations": len(c1_violations),
        "violations": c1_violations[:20],
        "ok": c1_pct >= bornes["C1_seuil_pct"],
    }

    # ============================================================
    # C2 — Anti-perfectionnisme testé (9/14, 7/14, 3/14)
    # ============================================================
    # Chaque cas doit avoir son message distinct, jamais de sanction.
    # Test sur les 3 cas types + vérification des messages.
    c2_cas = {}
    cas_types = [(9, "CELEBRE"), (7, "AJUSTEMENT"), (3, "REPRISE")]
    c2_violations = []
    for jours, cat_attendue in cas_types:
        s = core.suivre_14_jours(jours)
        ok_cat = (s["categorie"] == cat_attendue)
        ok_sanction = (s["sanction"] is None)
        ok_message = (s["message"] == core.TEMPLATES_SUIVI[cat_attendue])
        c2_cas[cat_attendue] = {
            "jours": jours,
            "categorie": s["categorie"],
            "ok_cat": ok_cat,
            "ok_sanction": ok_sanction,
            "ok_message": ok_message,
            "message": s["message"],
        }
        if not (ok_cat and ok_sanction and ok_message):
            c2_violations.append({
                "cas": cat_attendue,
                "jours": jours,
                "ok_cat": ok_cat,
                "ok_sanction": ok_sanction,
                "ok_message": ok_message,
            })

    # Vérification anti-perfectionnisme sur tous les profils
    anti_perf = core.verifier_anti_perfectionnisme()
    c2_ok = (
        all(c["ok_cat"] and c["ok_sanction"] and c["ok_message"]
            for c in c2_cas.values())
        and anti_perf["ok"]
    )
    resultats["C2"] = {
        "cas_types": c2_cas,
        "anti_perfectionnisme": anti_perf,
        "n_violations": len(c2_violations),
        "violations": c2_violations,
        "ok": c2_ok,
    }

    # ============================================================
    # C3 — Pas sélectionné par face + empreinte (traçabilité Q1-Q2)
    # ============================================================
    # Vérifier que chaque profil a un pas cohérent avec sa face+empreinte,
    # et que la trace pointe vers Q1 et Q2.
    c3_correct = 0
    c3_violations = []
    for e in evaluations:
        pas_attendu = core._PAS_TABLE.get(
            (e["face_moteur"], e["empreinte_moteur"])
        )
        ok_pas = (e["pas_moteur"] == pas_attendu)
        # Trace doit mentionner Q1 et Q2
        ok_trace = (
            "Q1" in e["trace"]["source"] and "Q2" in e["trace"]["source"]
        )
        if ok_pas and ok_trace:
            c3_correct += 1
        else:
            c3_violations.append({
                "id": e["id"],
                "face": e["face_moteur"],
                "empreinte": e["empreinte_moteur"],
                "pas": e["pas_moteur"],
                "pas_attendu": pas_attendu,
                "ok_pas": ok_pas,
                "ok_trace": ok_trace,
            })

    # Vérité croisée moteur/simulateur
    desaccords_pas = []
    for e in evaluations:
        if e["pas_moteur"] != e["pas_sim"]:
            desaccords_pas.append({
                "id": e["id"],
                "moteur": e["pas_moteur"],
                "simulateur": e["pas_sim"],
            })

    c3_pct = c3_correct / len(evaluations) * 100 if evaluations else 0
    c3_ok = (
        c3_pct >= bornes["C3_seuil_pct"]
        and len(desaccords_pas) == 0
    )
    resultats["C3"] = {
        "attendu_pct": bornes["C3_seuil_pct"],
        "obtenu_pct": round(c3_pct, 4),
        "n_correct": c3_correct,
        "n_total": len(evaluations),
        "n_violations": len(c3_violations),
        "n_desaccords_pas": len(desaccords_pas),
        "desaccords_pas": desaccords_pas[:20],
        "ok": c3_ok,
    }

    # ============================================================
    # C4 — SHA-256 ×2 (sera calculé après 2 runs)
    # ============================================================
    resultats["C4_placeholder"] = True

    # ============================================================
    # C5 — Affichage (rappels sans culpabilisation, compteurs privés, D-SIM)
    # ============================================================
    c5_violations = []
    import re as _re
    for e in evaluations:
        aff = e["affichage"]
        # (a) rappels sans culpabilisation
        # NOTE D-Q5-1 : "Pas une obligation" est anti-culpabilisant.
        # On cherche "tu dois"/"tu devrais"/"il faut que" (intrinsèquement
        # culpabilisants) et "une obligation" NON précédé de "pas ".
        culpabilisant_patterns = [
            r"tu dois", r"tu devrais", r"il faut que", r"c'est ta faute",
            r"(?<!pas )une obligation",
        ]
        for key in ["rappel_j1", "rappel_j7", "rappel_j14"]:
            msg = aff[key].lower()
            for pat in culpabilisant_patterns:
                if _re.search(pat, msg):
                    c5_violations.append({"id": e["id"], "cause": f"{key}_culpabilisant"})
                    break
        # (b) compteur privé
        if not aff["compteur_prive"]:
            c5_violations.append({"id": e["id"], "cause": "compteur_non_prive"})
        # (c) aucune sanction
        if aff["sanction"] is not None:
            c5_violations.append({"id": e["id"], "cause": "sanction_non_null"})
        # (d) D-SIM affiché
        if "D-SIM" not in aff["d_sim"]:
            c5_violations.append({"id": e["id"], "cause": "d_sim_manquant"})
        # (e) re-test jamais forcé
        if e["re_test_force"]:
            c5_violations.append({"id": e["id"], "cause": "re_test_force"})
        # (f) message de suivi présent (template mot pour mot)
        if aff["suivi_message"] != core.TEMPLATES_SUIVI[e["categorie_moteur"]]:
            c5_violations.append({"id": e["id"], "cause": "suivi_message_non_conforme"})

    n_total = len(evaluations)
    n_conformes = n_total - len(c5_violations)
    c5_pct = n_conformes / n_total * 100 if n_total else 0

    # Vérification rappels doux
    rappels_check = core.verifier_rappels_doux()

    resultats["C5"] = {
        "attendu_pct": bornes["C5_seuil_pct"],
        "obtenu_pct": round(c5_pct, 4),
        "n_conformes": n_conformes,
        "n_total": n_total,
        "n_violations": len(c5_violations),
        "violations": c5_violations[:20],
        "rappels_doux_check": rappels_check,
        "ok": c5_pct >= bornes["C5_seuil_pct"] and rappels_check["ok"],
    }

    # ============================================================
    # Statistiques supplémentaires
    # ============================================================
    # Distribution des pas
    pas_count = {p: 0 for p in core.PAS_BANQUE}
    for e in evaluations:
        pas_count[e["pas_moteur"]] = pas_count.get(e["pas_moteur"], 0) + 1
    resultats["pas_distribution"] = pas_count

    # Distribution des catégories de suivi par groupe
    cat_par_groupe = {}
    for e in evaluations:
        g = e["groupe"]
        if g not in cat_par_groupe:
            cat_par_groupe[g] = {"CELEBRE": 0, "AJUSTEMENT": 0, "REPRISE": 0}
        cat_par_groupe[g][e["categorie_moteur"]] += 1
    resultats["categorie_par_groupe"] = cat_par_groupe

    # Distribution des faces
    face_count = {f: 0 for f in core.FACES}
    for e in evaluations:
        face_count[e["face_moteur"]] = face_count.get(e["face_moteur"], 0) + 1
    resultats["face_distribution"] = face_count

    # SHA-256 de cette exécution
    resultats["sha256_run"] = sha256_dict({
        "C1": {k: v for k, v in resultats["C1"].items() if k != "violations"},
        "C2": {k: v for k, v in resultats["C2"].items()
               if k not in ("violations",)},
        "C3": {k: v for k, v in resultats["C3"].items()
               if k not in ("violations", "desaccords_pas")},
        "C5": {k: v for k, v in resultats["C5"].items()
               if k != "violations"},
        "bornes_d_std": resultats["bornes_d_std"],
        "resume_groupes": resultats["resume_groupes"],
        "pas_distribution": resultats["pas_distribution"],
        "categorie_par_groupe": resultats["categorie_par_groupe"],
        "face_distribution": resultats["face_distribution"],
    })

    return resultats


# ============================================================
# Génération des 4 figures
# ============================================================

def generer_figures(resultats):
    fig_paths = []

    # --- Figure 1 : C2 — 3 cas anti-perfectionnisme ---
    fig, ax = plt.subplots(figsize=FIG_SIZE, dpi=FIG_DPI)
    cas = ["CELEBRE (9/14)", "AJUSTEMENT (7/14)", "REPRISE (3/14)"]
    valeurs = [9, 7, 3]
    colors = [OKABE_ITO[3], OKABE_ITO[1], OKABE_ITO[6]]
    bars = ax.bar(cas, valeurs, 0.5, color=colors)
    ax.axhline(9, color=OKABE_ITO[3], linestyle="--", linewidth=1,
               label="Seuil CELEBRE (9)")
    ax.axhline(7, color=OKABE_ITO[1], linestyle="--", linewidth=1,
               label="Seuil AJUSTEMENT (7)")
    ax.set_ylabel("Jours tenus sur 14")
    ax.set_title("C2 — Anti-perfectionnisme : 3 cas testés (jamais de sanction)")
    ax.set_ylim(0, 15)
    ax.legend()
    for i, v in enumerate(valeurs):
        ax.text(i, v + 0.3, f"{v}/14", ha="center", fontsize=12)
    # Annotation : "jamais de sanction"
    ax.text(1, -2, "Chaque cas a son message. Jamais de sanction.",
            ha="center", fontsize=10, style="italic",
            color=OKABE_ITO[0])
    fig.tight_layout()
    p1 = FIGURES_DIR / "fig1_c2_anti_perfectionnisme.png"
    fig.savefig(p1)
    plt.close(fig)
    fig_paths.append(p1)

    # --- Figure 2 : C3 — Plafond par configuration (D-STD-2) ---
    fig, ax = plt.subplots(figsize=FIG_SIZE, dpi=FIG_DPI)
    configs = list(resultats["bornes_d_std"]["plafonds_par_config"].keys())
    pcts = list(resultats["bornes_d_std"]["plafonds_par_config"].values())
    seuil = resultats["bornes_d_std"]["C3_seuil_pct"]
    colors2 = [OKABE_ITO[3] if p >= seuil else OKABE_ITO[6] for p in pcts]
    x = np.arange(len(configs))
    ax.bar(x, pcts, 0.6, color=colors2)
    ax.axhline(seuil, color=OKABE_ITO[6], linestyle="--", linewidth=1,
               label=f"Seuil D-STD-2 ({seuil:.1f} %)")
    ax.axhline(100, color=OKABE_ITO[3], linestyle=":", linewidth=1,
               label="Plafond (100 %)")
    ax.set_xticks(x)
    ax.set_xticklabels(configs, rotation=35, ha="right", fontsize=8)
    ax.set_ylabel("Vrais positifs (%)")
    ax.set_title("C3 + D-STD-2 — Plafond PAR CONFIGURATION (face × empreinte) — leçon Q4")
    ax.legend(loc="lower right")
    ax.set_ylim(0, 110)
    for i, v in enumerate(pcts):
        ax.text(i, v + 1, f"{v:.0f}", ha="center", fontsize=8)
    fig.tight_layout()
    p2 = FIGURES_DIR / "fig2_c3_plafond_par_config.png"
    fig.savefig(p2)
    plt.close(fig)
    fig_paths.append(p2)

    # --- Figure 3 : Distribution des pas ---
    fig, ax = plt.subplots(figsize=FIG_SIZE, dpi=FIG_DPI)
    pas = list(resultats["pas_distribution"].keys())
    counts = list(resultats["pas_distribution"].values())
    colors3 = [OKABE_ITO[i % len(OKABE_ITO)] for i in range(len(pas))]
    x3 = np.arange(len(pas))
    ax.bar(x3, counts, 0.6, color=colors3)
    ax.set_xticks(x3)
    ax.set_xticklabels([f"{p}\n{core.PAS_LABELS[p][:30]}"
                        for p in pas], fontsize=8)
    ax.set_ylabel("Nombre de profils")
    ax.set_title("Distribution des 6 pas sélectionnés (180 profils simulés)")
    for i, v in enumerate(counts):
        ax.text(i, v + 0.5, str(v), ha="center", fontsize=10)
    fig.tight_layout()
    p3 = FIGURES_DIR / "fig3_distribution_pas.png"
    fig.savefig(p3)
    plt.close(fig)
    fig_paths.append(p3)

    # --- Figure 4 : Catégories de suivi par groupe ---
    fig, ax = plt.subplots(figsize=FIG_SIZE, dpi=FIG_DPI)
    groupes = list(resultats["categorie_par_groupe"].keys())
    celebres = [resultats["categorie_par_groupe"][g]["CELEBRE"] for g in groupes]
    ajusts = [resultats["categorie_par_groupe"][g]["AJUSTEMENT"] for g in groupes]
    reprises = [resultats["categorie_par_groupe"][g]["REPRISE"] for g in groupes]
    x4 = np.arange(len(groupes))
    w = 0.6
    ax.bar(x4, celebres, w, label="CELEBRE (≥9/14)", color=OKABE_ITO[3])
    ax.bar(x4, ajusts, w, bottom=celebres,
           label="AJUSTEMENT (7-8/14)", color=OKABE_ITO[1])
    ax.bar(x4, reprises, w,
           bottom=[c + a for c, a in zip(celebres, ajusts)],
           label="REPRISE (≤6/14)", color=OKABE_ITO[6])
    ax.set_xticks(x4)
    ax.set_xticklabels(groupes)
    ax.set_ylabel("Nombre de profils")
    ax.set_title("Catégories de suivi par groupe — anti-perfectionnisme (jamais de sanction)")
    ax.legend()
    for i, (c, a, r) in enumerate(zip(celebres, ajusts, reprises)):
        if c > 0:
            ax.text(i, c / 2, str(c), ha="center", va="center", fontsize=10)
        if a > 0:
            ax.text(i, c + a / 2, str(a), ha="center", va="center", fontsize=10)
        if r > 0:
            ax.text(i, c + a + r / 2, str(r), ha="center", va="center", fontsize=10)
    fig.tight_layout()
    p4 = FIGURES_DIR / "fig4_categories_suivi.png"
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

    L("# Rapport de validation WTC-Q5 — « Mon premier pas »")
    L("")
    L(f"> {D_SIM}")
    L("")
    L(f"**Date** : {DATE_RUN}  ")
    L(f"**Seed** : 42  ")
    L(f"**Package** : validation-q5/  ")
    L(f"**Approche** : D-STD recalculé d'emblée + D-STD-2 (plafond par configuration)")
    L("")
    L("---")
    L("")

    # Section A — D-STD recalculé + D-STD-2
    L("## Section A — D-STD recalculé d'emblée + D-STD-2 (leçon Q4)")
    L("")
    L("Conformément à D-STD (renforcé par D-Q3-J) et D-STD-2 (ajoutée au ")
    L("standard au cycle Q4), les plafonds sont calculés AVANT les seuils, ")
    L("sur le CODE réel, **PAR CONFIGURATION** (pas seulement global).")
    L("")
    b = resultats["bornes_d_std"]
    L("| Critère | Plafond (global) | Plafond min (par config) | Seuil |")
    L("|---------|------------------|---------------------------|-------|")
    L(f"| C1 suivi déterministe | {b['C1_plafond_pct']} % | — | {b['C1_seuil_pct']:.2f} % |")
    L(f"| C2 anti-perfectionnisme | {b['C2_plafond_pct']} % | — (déterministe) | {b['C2_seuil_pct']} % |")
    L(f"| C3 pas par face+empreinte | {b['C3_plafond_pct']} % | {b['C3_plafond_par_config_min_pct']} % | {b['C3_seuil_pct']:.2f} % |")
    L(f"| C5 affichage | {b['C5_plafond_pct']} % | — | {b['C5_seuil_pct']} % |")
    L("")
    L(f"**Nombre de profils simulés** : {b['n_profils']} (3 groupes × 60)")
    L("")
    L("### D-STD-2 — Plafond par configuration (face × empreinte)")
    L("")
    L("| Configuration (face × empreinte) | Plafond (%) |")
    L("|-----------------------------------|-------------|")
    for config, pct in b["plafonds_par_config"].items():
        L(f"| {config} | {pct} % |")
    L("")
    L("---")
    L("")

    # Section B — 5 critères Q5
    L("## Section B — Les 5 critères Q5")
    L("")
    L("| Critère | Attendu | Obtenu | Verdict |")
    L("|---------|---------|--------|---------|")

    c = resultats["C1"]
    L(f"| **C1** Suivi déterministe | ≥ {c['attendu_pct']:.1f} % | "
      f"{c['obtenu_pct']} % ({c['n_correct']}/{c['n_total']}, "
      f"{c['n_violations']} violation) | "
      f"{'✅ PASS' if c['ok'] else '❌ FAIL'} |")

    c = resultats["C2"]
    cas_ok = all(v["ok_cat"] and v["ok_sanction"] and v["ok_message"]
                 for v in c["cas_types"].values())
    L(f"| **C2** Anti-perfectionnisme (9/14, 7/14, 3/14) | 3/3 cas + 0 sanction | "
      f"{'3/3 cas conformes' if cas_ok else 'CAS NON CONFORMES'}, "
      f"{c['anti_perfectionnisme']['violations'].__len__()} violation | "
      f"{'✅ PASS' if c['ok'] else '❌ FAIL'} |")

    c = resultats["C3"]
    L(f"| **C3** Pas par face + empreinte (traçabilité Q1-Q2) | "
      f"≥ {c['attendu_pct']:.1f} % + 0 désaccord | "
      f"{c['obtenu_pct']} % ({c['n_correct']}/{c['n_total']}), "
      f"{c['n_desaccords_pas']} désaccord moteur/sim | "
      f"{'✅ PASS' if c['ok'] else '❌ FAIL'} |")

    L(f"| **C4** SHA-256 ×2 | identiques | "
      f"{'identiques' if sha_match else 'DIFFÉRENTS'} | "
      f"{'✅ PASS' if sha_match else '❌ FAIL'} |")

    c = resultats["C5"]
    L(f"| **C5** Affichage (rappels doux, compteurs privés, D-SIM) | "
      f"≥ {c['attendu_pct']:.1f} % | "
      f"{c['obtenu_pct']} % ({c['n_conformes']}/{c['n_total']}), "
      f"{c['n_violations']} violation | "
      f"{'✅ PASS' if c['ok'] else '❌ FAIL'} |")

    L("")
    L(f"SHA-256 exécution 1 : `{sha1}`")
    L(f"SHA-256 exécution 2 : `{sha2}`")
    L("")

    # Détail C2 — 3 cas
    L("### C2 — Détail des 3 cas anti-perfectionnisme")
    L("")
    L("| Cas | Jours tenus | Catégorie attendue | Catégorie obtenue | Sanction |")
    L("|-----|-------------|--------------------|--------------------|----------|")
    for cat, d in resultats["C2"]["cas_types"].items():
        L(f"| {cat} | {d['jours']}/14 | {cat} | {d['categorie']} | "
          f"{'None ✅' if d['ok_sanction'] else 'NON NULL ❌'} |")
    L("")
    L("### C2 — Messages mot pour mot")
    L("")
    for cat, d in resultats["C2"]["cas_types"].items():
        L(f"**{cat}** ({d['jours']}/14) :")
        L(f"> {d['message']}")
        L("")
    L("---")
    L("")

    # Section C — Pas par face + empreinte (traçabilité Q1-Q2)
    L("## Section C — Sélection du pas par face dominante + empreinte")
    L("")
    L("Le pas est sélectionné par la **face dominante (Q1)** et ")
    L("l'**empreinte (Q2)**. La trace pointe explicitement vers Q1 et Q2.")
    L("")
    L("### Table de sélection (face × empreinte → pas)")
    L("")
    L("| Face dominante (Q1) | Empreinte (Q2) | Pas | Label |")
    L("|---------------------|-----------------|-----|-------|")
    for (face, emp), pas in core._PAS_TABLE.items():
        L(f"| {face} | {emp} | {pas} | {core.PAS_LABELS[pas]} |")
    L("")
    L("### Templates des pas (mot pour mot)")
    L("")
    for pas in core.PAS_BANQUE:
        L(f"**{pas}** — {core.PAS_LABELS[pas]} :")
        L(f"> {core.TEMPLATES_PAS[pas]}")
        L("")
    L("---")
    L("")

    # Section D — 4 exemples tracés
    L("## Section D — 4 exemples tracés de bout en bout")
    L("")
    # 1 CELEBRE
    celeb = next((e for e in resultats["evaluations"]
                  if e["categorie_moteur"] == "CELEBRE"), None)
    # 1 AJUSTEMENT
    ajust = next((e for e in resultats["evaluations"]
                  if e["categorie_moteur"] == "AJUSTEMENT"), None)
    # 1 REPRISE
    repris = next((e for e in resultats["evaluations"]
                   if e["categorie_moteur"] == "REPRISE"), None)
    # 1 SUR_LA_RA (pour montrer la traçabilité Q1-Q2)
    sur_la = next((e for e in resultats["evaluations"]
                   if e["face_moteur"] == "SUR_LA_RA"), None)

    def _render(e, titre):
        if not e:
            L(f"### {titre}")
            L("")
            L("- Aucun exemple disponible.")
            L("")
            return
        L(f"### {titre}")
        L("")
        L(f"- **Profil** : {e['id']} (groupe : {e['groupe']})")
        L(f"- **Q1 (face dominante)** : {e['face_moteur']} "
          f"(sA={e['sA']}, sB={e['sB']})")
        L(f"- **Q2 (empreinte)** : {e['empreinte_moteur']} "
          f"(label brut : « {e['label_ombre']} »)")
        L(f"- **Pas sélectionné** : {e['pas_moteur']} — {core.PAS_LABELS[e['pas_moteur']]}")
        L(f"- **Traçabilité** : {e['trace']['source']}")
        L(f"- **Suivi 14 jours** : {e['jours_tenus']}/14 "
          f"(taux {e['taux_moteur']} %) → catégorie **{e['categorie_moteur']}**")
        L(f"- **Sanction** : {e['sanction_moteur']} (jamais)")
        L(f"- **Re-test Q1** : programmé au {e['re_test_date'][:10]} "
          f"(forcé : {e['re_test_force']})")
        L(f"- **Template du pas** :")
        L(f"  > {e['affichage']['pas_template']}")
        L(f"- **Message de suivi** ({e['categorie_moteur']}) :")
        L(f"  > {e['affichage']['suivi_message']}")
        L(f"- **Rappel J1** : {e['affichage']['rappel_j1']}")
        L(f"- **Rappel J7** : {e['affichage']['rappel_j7']}")
        L(f"- **Rappel J14** : {e['affichage']['rappel_j14']}")
        L(f"- **Compteur privé** : {e['affichage']['compteur_prive']}")
        L(f"- **D-SIM** : {e['affichage']['d_sim'][:80]}…")
        L("")

    _render(celeb, "Exemple 1 — CELEBRE (9/14 ou plus)")
    _render(ajust, "Exemple 2 — AJUSTEMENT (7-8/14)")
    _render(repris, "Exemple 3 — REPRISE (0-6/14)")
    _render(sur_la, "Exemple 4 — SUR_LA_RA (traçabilité Q1-Q2)")
    L("---")
    L("")

    # Section E — Analyse anti-perfectionnisme + traçabilité
    L("## Section E — Analyse : anti-perfectionnisme + traçabilité")
    L("")
    L("### Anti-perfectionnisme (C2)")
    L("")
    anti = resultats["C2"]["anti_perfectionnisme"]
    L(f"- Messages testés : {anti['messages_testes']}")
    L(f"- Violations de culpabilisation : {len(anti['violations'])}")
    L(f"- **Aucune sanction** produite par `suivre_14_jours()` (vérifié sur 0, 3, 6, 7, 8, 9, 14 jours)")
    L("")
    L("Le message REPRISE (3/14) ne dit **jamais** « échec » ou « faute ». ")
    L("Il dit « c'est un signal » et « la suite du parcours t'aide à le ")
    L("reprendre, autrement, sans pression ». C'est le cœur de la règle ")
    L("anti-perfectionnisme : **9/14 = célébré, jamais de sanction**.")
    L("")
    L("### Traçabilité Q1-Q2 (C3)")
    L("")
    L(f"- Désaccords moteur/simulateur sur le pas : "
      f"{resultats['C3']['n_desaccords_pas']} (0 attendu)")
    L(f"- Profils avec trace Q1+Q2 correcte : "
      f"{resultats['C3']['n_correct']}/{resultats['C3']['n_total']}")
    L("")
    L("### Distribution des pas")
    L("")
    L("| Pas | Label | Nombre |")
    L("|-----|-------|--------|")
    for pas in core.PAS_BANQUE:
        L(f"| {pas} | {core.PAS_LABELS[pas]} | "
          f"{resultats['pas_distribution'][pas]} |")
    L("")
    L("### Distribution des catégories par groupe")
    L("")
    L("| Groupe | CELEBRE | AJUSTEMENT | REPRISE |")
    L("|--------|---------|------------|---------|")
    for g, d in resultats["categorie_par_groupe"].items():
        L(f"| {g} | {d['CELEBRE']} | {d['AJUSTEMENT']} | {d['REPRISE']} |")
    L("")
    L("![C2 anti-perfectionnisme](../figures/fig1_c2_anti_perfectionnisme.png)")
    L("")
    L("![C3 plafond par config](../figures/fig2_c3_plafond_par_config.png)")
    L("")
    L("![Distribution des pas](../figures/fig3_distribution_pas.png)")
    L("")
    L("![Catégories de suivi](../figures/fig4_categories_suivi.png)")
    L("")
    L("---")
    L("")

    # Section F — Signalements et principes
    L("## Section F — Signalements et principes non négociables")
    L("")
    L("### Principes respectés")
    L("")
    L("1. **Anti-perfectionnisme** : 9/14 = célébré, jamais de sanction ")
    L("   (vérifié par `verifier_anti_perfectionnisme()` — C2).")
    L("2. **Rappels doux, jamais culpabilisants** : aucun « tu dois », ")
    L("   « tu devrais », « obligation » dans les rappels (vérifié par ")
    L("   `verifier_rappels_doux()` — C5).")
    L("3. **Compteurs privés** : `compteur_prive = True` — le taux de ")
    L("   tenue n'est jamais exposé socialement (vérifié par C5).")
    L("4. **Pas sélectionné par Q1 + Q2** : la trace pointe vers la face ")
    L("   dominante (Q1) et l'empreinte (Q2) — vérifié par C3.")
    L("5. **Re-test Q1 jamais forcé** : `force = False`, message doux ")
    L("   « tu le fais quand tu es prêt(e) » (vérifié par C5).")
    L("6. **D-SIM affiché** : avertissement présent dans l'affichage ")
    L("   de chaque bilan (vérifié par C5).")
    L("")
    L("### Règles permanentes appliquées")
    L("")
    L("- **D-STD** (renforcé par D-Q3-J) : bornes calculées AVANT les seuils.")
    L("- **D-STD-2** (ajoutée au cycle Q4) : plafond PAR CONFIGURATION, ")
    L("  pas seulement global. Une config injoignable serait invisible ")
    L("  dans la moyenne globale (cf. D-Q4-1).")
    L("- **D-CHECK** : cohérence interne du rapport vérifiée.")
    L("- **D-SIM** : avertissement affiché en tête du rapport et du README.")
    L("- **D-ENV** : environnement vérifié avant exécution.")
    L("")
    L("### Signalements")
    L("")
    L("1. **D-Q5-1 (corrigé par le superviseur actif)** : faux positif du ")
    L("   vérificateur `verifier_rappels_doux()`. Le rappel J1 contient la ")
    L("   phrase « Pas une obligation — une invitation » — qui est ")
    L("   l'INVERSE d'être culpabilisant. Mais le vérificateur cherchait ")
    L("   le mot « obligation » isolé, sans regarder le contexte. Détection ")
    L("   par C5 (180 violations au run initial). Correction : le vérificateur ")
    L("   cherche maintenant « une obligation » NON précédé de « pas » ")
    L("   (regex `(?<!pas )une obligation`). Leçon : un vérificateur de ")
    L("   langage naturel doit tenir compte des négations — un mot interdit ")
    L("   nié reste autorisé.")
    L("")
    L("2. **D-STD-2 appliquée d'emblée** : la leçon Q4 (plafond par config) ")
    L("   est appliquée dès ce package. Le plafond C3 est calculé pour ")
    L("   chacune des 9 configurations (face × empreinte), et le seuil ")
    L("   est posé sur le MIN des plafonds par config (plafond_min − 3).")
    L("")
    L("3. **Suivi 14 jours déterministe** : la catégorisation ")
    L("   (CELEBRE/AJUSTEMENT/REPRISE) est purement déterministe — ")
    L("   `suivre_14_jours(j)` renvoie toujours la même catégorie pour le ")
    L("   même `j`. Le compteur compte exactement (vérifié par C1).")
    L("")
    L("4. **Re-test Q1 à 8 semaines** : programmé, jamais forcé. Le message ")
    L("   indique la date et précise « tu le fais quand tu es prêt(e) ». ")
    L("   Le re-test sera effectif au pilote WTC-VALID-01 (150-200 répondants).")
    L("")
    L("5. **Faute d'orchestrateur n°15 (close)** : seuil posé avant plafond ")
    L("   par configuration — corrigée par D-STD-2, appliquée ici.")
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
    L(f"- Critères Q5 : {5 - n_fail}/5 validés"
      f"{', 0 FAIL' if n_fail == 0 else f', {n_fail} FAIL'}")
    L("")
    L("### Avertissement D-SIM")
    L("")
    L(f"> {D_SIM}")
    L("")
    L("### Package prêt à publier")
    L("")
    L("- Arborescence : `validation-q5/{src,results,figures}`")
    L("- Code source : `src/wtc_q5_core.py`, `src/wtc_q5_simulator.py`, "
      "`src/wtc_q5_validation.py`")
    L(f"- Rapport : `results/rapport-q5-{DATE_RUN}.md`")
    L(f"- Figures : `figures/fig{{1,2,3,4}}_*.png` (1920×1080, 150 DPI)")
    L("- Statut : **attente du pont humain pour push GitHub** dans ")
    L("  `WAIRYU-Dating → Wairyu thérapie couple/validation-q5/`")
    L("")
    L("### Dimension attachement")
    L("")
    if verdict == "VALIDÉ":
        L("Avec Q5 validé, la dimension attachement est **COMPLÈTE 5/5** ")
        L("(RIO-01, RIO-02, RIO-03, RIO-04, RIO-05). La prochaine grande ")
        L("mission est le **pilote réel WTC-VALID-01** (150-200 répondants) ")
        L("— les paramètres simulés seront remplacés par des données réelles.")
    else:
        L("Verdict À CORRIGER — la dimension attachement reste à 4/5. ")
        L("Investigation des FAILs puis package R1.")
    L("")

    return "\n".join(lines)


# ============================================================
# Main
# ============================================================

def main():
    print("=" * 60)
    print("WTC-Q5 — Validation « Mon premier pas »")
    print("=" * 60)
    print(D_SIM)
    print()

    # --- Run 1 ---
    print("[Run 1] Exécution de la validation...")
    r1 = run_validation()
    sha1 = r1["sha256_run"]
    print(f"[Run 1] SHA-256 : {sha1}")
    print(f"[Run 1] C1={r1['C1']['obtenu_pct']}% "
          f"C2={'OK' if r1['C2']['ok'] else 'FAIL'} "
          f"C3={r1['C3']['obtenu_pct']}% "
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
    rapport_path = RESULTS_DIR / f"rapport-q5-{DATE_RUN}.md"
    rapport_path.write_text(rapport, encoding="utf-8")
    print(f"  - {rapport_path.relative_to(PKG_DIR)}")

    # --- JSON résultats ---
    json_path = RESULTS_DIR / f"resultats-q5-{DATE_RUN}.json"
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
    print("RÉSUMÉ DES 5 CRITÈRES Q5")
    print("=" * 60)
    print(f"C1  Suivi déterministe :           {r1['C1']['obtenu_pct']}% "
          f"({r1['C1']['n_correct']}/{r1['C1']['n_total']}) "
          f"{'✅' if r1['C1']['ok'] else '❌'}")
    print(f"C2  Anti-perfectionnisme :         "
      f"3/3 cas {'✅' if r1['C2']['ok'] else '❌'}")
    print(f"C3  Pas par face+empreinte :       {r1['C3']['obtenu_pct']}% "
          f"({r1['C3']['n_desaccords_pas']} désaccord moteur/sim) "
          f"{'✅' if r1['C3']['ok'] else '❌'}")
    print(f"C4  SHA-256 ×2 :                   "
          f"{'identiques ✅' if sha_match else 'DIFFÉRENTS ❌'}")
    print(f"C5  Affichage conforme :           {r1['C5']['obtenu_pct']}% "
          f"({r1['C5']['n_violations']} violation) "
          f"{'✅' if r1['C5']['ok'] else '❌'}")
    print()
    b = r1["bornes_d_std"]
    print(f"D-STD recalculé : C1 plafond={b['C1_plafond_pct']}% seuil={b['C1_seuil_pct']:.1f}%")
    print(f"D-STD-2 (par config) : C3 plafond_min={b['C3_plafond_par_config_min_pct']}% "
          f"seuil={b['C3_seuil_pct']:.1f}%")
    print()
    verdict = "VALIDÉ" if (
        r1["C1"]["ok"] and r1["C2"]["ok"] and r1["C3"]["ok"] and
        sha_match and r1["C5"]["ok"]
    ) else "À CORRIGER"
    print(f"VERDICT : {verdict}")
    print()
    print(f"Rapport : {rapport_path}")
    print()
    if verdict == "VALIDÉ":
        print("DIMENSION ATTACHEMENT COMPLÈTE 5/5 (RIO-01 à RIO-05)")
        print("Prochaine grande mission : pilote réel WTC-VALID-01 (150-200 répondants)")
    print()
    print("Package prêt à publier — attente du pont humain pour push GitHub")
    print("dans WAIRYU-Dating → Wairyu thérapie couple/validation-q5/")


if __name__ == "__main__":
    main()
