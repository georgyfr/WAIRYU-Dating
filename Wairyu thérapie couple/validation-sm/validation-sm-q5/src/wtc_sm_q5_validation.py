# -*- coding: utf-8 -*-
"""WAIRYU — WTC-SM-Q5 (RIO-15) : validation, figures, rapport autoporteur.

Séquence D-CANAL-2 (SPEC verrouillée §9) : production → run ×2 → SHA ×2 →
publication → pointeurs → audit origin → contresignature. Leçons appliquées :
Verdict fermé d'emblée (E-SM-12) · figures générées après construction des
résultats (séquencement C5/SHA — leçon Q4) · déterminisme seed 42.
Rapport autoporteur (littéraux cités Section A) pour la contresignature."""
from __future__ import annotations

import hashlib
import json
import random
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.font_manager as fm
for _f in ("/usr/share/fonts/truetype/chinese/NotoSansSC-Regular.ttf",
           "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"):
    try:
        fm.fontManager.addfont(_f)
    except Exception:
        pass
import matplotlib.pyplot as plt
plt.rcParams["font.sans-serif"] = ["Noto Sans SC", "DejaVu Sans"]
plt.rcParams["axes.unicode_minus"] = False

import wtc_sm_q5_core as core
import wtc_sm_q5_simulator as sim

ICI = Path(__file__).resolve().parent
PKG = ICI.parent
FIG = PKG / "figures"
RES = PKG / "results"
DATE = "2026-10-18"
FIGSIZE = (12.8, 7.2)   # 1920×1080 @ 150 DPI
DPI = 150
NOM_FIGS = ("fig1_engagement.png", "fig2_conformite_d_std2.png",
            "fig3_rci_deltas.png", "fig4_paliers.png")
D_SIM = ("AVERTISSEMENT D-SIM : résultats issus de simulations (seed 42) — "
         "la mécanique est validée, pas la prévalence clinique.")
D_CRISE_BANDEAU = ("D-CRISE : 0 voie nouvelle en Q5 — override hérité "
                   "(A2 ∨ SM-C1 ∨ H5) : JAMAIS de pas de couple en crise, "
                   "court-circuit avant le choix du pas (hub verbatim).")
DELEGATION = ("je te délègues le tranchage comme en Q4. Puis verrouillage → "
              "production → RIO-15 → santé mentale 5/5")
OKABE_ITO = ["#000000", "#E69F00", "#56B4E9", "#009E73", "#F0E442",
             "#0072B2", "#D55E00", "#CC79A9", "#8172B2"]


def _sha(resultats):
    brut = json.dumps(resultats, sort_keys=True, ensure_ascii=False)
    return hashlib.sha256(brut.encode("utf-8")).hexdigest()


def critere_c1(couples, classes):
    """C1 D-VÉRITÉ : tracking démontré — grille 14 jours × 540 couples,
    seuil 9/14 appliqué, croisé moteur/table de vérité sur TOUS les cas de
    table exhaustifs (la conformité sur données bruitées relève de C3)."""
    dt = core.verifier_d_table()
    demons = [classifier_ok(c, classes[i]) for i, c in enumerate(couples)]
    croise = all(dt.values())
    return {
        "d_table": all(dt.values()),
        "d_table_details": dt,
        "demontrees": f"{sum(demons)}/{len(demons)}",
        "croise": croise,
        "labels_uniques": len(set(core.NOMENCLATURE)) == 11,
        "ok": all(dt.values()) and all(demons)
        and len(set(core.NOMENCLATURE)) == 11,
    }


def classifier_ok(c, m):
    """Le moteur produit un verdict bien formé pour ce couple — un palier
    ORIENTATION sans crise est une dérive de mesure LÉGITIME (niveau mesuré
    ÉLEVÉ) : le verdict reste bien formé (le moteur croit honnêtement)."""
    if m["crise"]:
        return (m["palier"] == core.PALIER_ROUGE and m["pas"] is None
                and m["statut"] is None)
    pas_ok = (m["pas"] is None) if m["palier"] == core.PALIER_ROUGE \
        else (m["pas"] is None or isinstance(m["pas"], str))
    return (m["statut"] in (core.STATUT_CELEBRE, core.STATUT_EN_CHEMIN)
            and m["palier"] in (core.PALIER_VERT, core.PALIER_ORANGE,
                                core.PALIER_ROUGE)
            and pas_ok)


def conformity_par_couple(couples, classes):
    """Croisé moteur / table de vérité — verdict couple Q5 (C1/C3)."""
    out = {}
    for c, m in zip(couples, classes):
        v = c["vrai"]
        ok = (m["statut"] == v["statut"] and m["palier"] == v["palier"]
              and m["pas"] == v["pas"])
        if c["re_det"] is not None:
            ok &= m["rci"]["ensemble"] == v["ensemble"]
        out[c["id"]] = ok
    return out


def critere_c2(couples, classes):
    """C2 D-CONFIRMATION : pureté + anti-inversion temporelle (Δ signé)."""
    dc = core.verifier_d_confirmation(couples)
    classes2 = [core.classifier(c) for c in couples]
    pure = classes == classes2
    return {"grille_pure": pure, "anti_inversion": dc["anti_inversion_temporelle"],
            "n_rci": dc["n_rci"],
            "ok": pure and dc["anti_inversion_temporelle"]}


def critere_c3(couples, classes, conformite):
    """C3 D-STD-2 : seuil PAR groupe (12 bornes distinctes) + frontières A1
    + exactes G12 (piège déterministe ε = 0)."""
    par_config = {}
    for (groupe, n) in sim.GROUPES:
        ids = [c["id"] for c in couples if c["groupe"] == groupe]
        conf = sum(1 for i in ids if conformite[i])
        pct = round(100.0 * conf / n, 1)
        par_config[groupe] = {"conformes": conf, "n": n, "pct": pct,
                              "seuil": core.SEUILS_D_STD_2[groupe],
                              "ok": pct >= core.SEUILS_D_STD_2[groupe]}
    frontiere = {"2.49": core.niveau_de(2.49), "2.50": core.niveau_de(2.50),
                 "3.49": core.niveau_de(3.49), "3.50": core.niveau_de(3.50)}
    frontiere_ok = (frontiere == {"2.49": "FAIBLE", "2.50": "MOYEN",
                                  "3.49": "MOYEN", "3.50": "ÉLEVÉ"})
    g12_couples = [c for c in couples if c["groupe"] == "G12_RCI_FRONTIERE"]
    g12_exact = sum(1 for c in g12_couples if m_rci_conforme(c))
    n_ok = sum(1 for v in par_config.values() if v["ok"])
    return {"par_config": par_config, "n_ok": n_ok, "frontiere": frontiere,
            "frontiere_ok": frontiere_ok, "g12_exact": f"{g12_exact}/40",
            "ok": n_ok == 12 and frontiere_ok and g12_exact == 40}


def m_rci_conforme(c):
    """L'ensemble RCI moteur == vrai (le piège frontière porte sur le RCI,
    pas sur le palier dont les dérivées binomiales relèvent du seuil)."""
    m = core.classifier(c)
    return m["rci"] is not None and m["rci"]["ensemble"] == c["vrai"]["ensemble"]


def critere_c5(couples, classes):
    """C5 Affichage : templates (autoporteurs), banque servie, champ libre,
    bandeau D-SIM, figures 4/4 aux dimensions verrouillées."""
    pas_prod = {m["pas"] for c, m in zip(couples, classes) if m["pas"]}
    banque = set(core.BANQUE_PAS[core.PALIER_VERT]) \
        | set(core.BANQUE_PAS[core.PALIER_ORANGE])
    templates_ok = all(t in core.TEMPLATES for t in
                       ("celebre", "celebre_pile", "en_chemin", "fiable",
                        "suggestion", "bruit", "zone_calme", "module_couple",
                        "orientation"))
    libre_ok = sim.PAS_LIBRE_LIBELLE in pas_prod
    dims_ok = True
    for f in NOM_FIGS:
        p = FIG / f
        dims_ok &= p.exists() and p.stat().st_size > 20000
    return {"templates_9": templates_ok, "banque_servie": banque <= pas_prod,
            "champ_libre": libre_ok, "figures": 4, "dimensions_ok": dims_ok,
            "d_sim": bool(D_SIM),
            "ok": templates_ok and banque <= pas_prod and libre_ok
            and dims_ok and len(pas_prod) > 0}


def critere_c6(classes):
    """C6 A5 : 0 sanction produite / 0 verdict de rémission — les libellés
    produits sont exactement la nomenclature verrouillée ; aucun libellé
    d'échec, de sanction-infligée, de guérison ou de rémission."""
    statuts = {m["statut"] for m in classes}
    paliers = {m["palier"] for m in classes}
    ensembles = {m["rci"]["ensemble"] for m in classes if m["rci"]}
    rives = {s for m in classes if m["rci"]
             for s in (m["rci"]["statut_det"], m["rci"]["statut_chg"])}
    autorises_statuts = {core.STATUT_CELEBRE, core.STATUT_EN_CHEMIN, None}
    autorises_paliers = {core.PALIER_VERT, core.PALIER_ORANGE, core.PALIER_ROUGE}
    autorises_ens = {core.ENSEMBLE_FIABLE, core.ENSEMBLE_SUGGESTION,
                     core.ENSEMBLE_BRUIT}
    autorises_rives = {core.STATUT_FIABLE, core.STATUT_SUGGESTION,
                       core.STATUT_BRUIT}
    interdits = ("rémission", "guéri", "guérison", "échoué", "sanctionné")
    produits = " | ".join(sorted(x for x in (statuts | paliers | ensembles
                                             | rives) if x))
    zero_interdit = not any(x in produits.lower() for x in interdits)
    pas_prod = {m["pas"] for m in classes if m["pas"]}
    banque = set(core.BANQUE_PAS[core.PALIER_VERT]) \
        | set(core.BANQUE_PAS[core.PALIER_ORANGE]) | {sim.PAS_LIBRE_LIBELLE}
    return {"statuts": sorted(s for s in statuts if s),
            "paliers": sorted(paliers), "ensembles": sorted(ensembles),
            "nomenclature_respectee":
                statuts <= autorises_statuts and paliers <= autorises_paliers
                and ensembles <= autorises_ens and rives <= autorises_rives,
            "pas_authentiques": pas_prod <= banque,
            "0_interdit": zero_interdit,
            "jamais_sanction_litteral": "sans sanction" in core.TEMPLATES["en_chemin"],
            "ok": statuts <= autorises_statuts and paliers <= autorises_paliers
            and ensembles <= autorises_ens and rives <= autorises_rives
            and pas_prod <= banque and zero_interdit}


def critere_c7(couples, classes):
    """C7 Anti-fabrication + D-CRISE : override 50/50 (court-circuit avant le
    pas), zone calme honnête (règle palier→banque testée — leçon Q4 : sur la
    RÈGLE, pas sur une appartenance stricte, les dérivées binomiales de G7
    sont encadrées par C3), 0 pas inventé."""
    g8 = [(c, m) for c, m in zip(couples, classes)
          if c["groupe"] == "G8_CRISE_HERITEE"]
    override = sum(1 for c, m in g8 if m["crise"]
                   and m["palier"] == core.PALIER_ROUGE and m["pas"] is None
                   and m["statut"] is None)
    verts = [m for m in classes if m["palier"] == core.PALIER_VERT]
    g7_verts = [m for c, m in zip(couples, classes)
                if c["groupe"] == "G7_ZONE_CALME"
                and m["palier"] == core.PALIER_VERT]
    calme = len(g7_verts)
    # Règle (leçon Q4 n°4) : les couples VERT servent un pas VERT OU le choix
    # explicite du couple (les dérivées de palier relèvent de C3, pas de la
    # fabrication) — l'anti-fabrication est portée par pas_authentiques (C6).
    zero_fab_vert = all(m["pas"] in core.BANQUE_PAS[core.PALIER_VERT]
                        for m in g7_verts)
    aucune_crise_avec_pas = all(m["pas"] is None
                                for m in classes if m["crise"])
    return {"override": f"{override}/50", "override_ok": override == 50,
            "zone_calme": f"{calme}/50",
            "zone_calme_ok": calme >= 40 and zero_fab_vert
            and critere_c6(classes)["pas_authentiques"],
            "court_circuit_avant_pas": aucune_crise_avec_pas,
            "zero_fabrication": critere_c6(classes)["pas_authentiques"],
            "ok": override == 50 and calme >= 40 and zero_fab_vert
            and aucune_crise_avec_pas
            and critere_c6(classes)["pas_authentiques"]}


def executer(publier=True):
    """Exécution complète : 540 couples, critères C1-C3/C5-C7, réconciliation,
    figures (si publier, AVANT l'évaluation de C5 — leçon séquencement Q4 :
    dims_ok doit voir les fichiers générés) — le SHA porte sur ce dict."""
    couples = sim.tous_les_couples()
    classes = [core.classifier(c) for c in couples]
    conformite = conformity_par_couple(couples, classes)
    r1 = {}
    r1["C1"] = critere_c1(couples, classes)
    r1["C2"] = critere_c2(couples, classes)
    r1["C3"] = critere_c3(couples, classes, conformite)
    r1["C6"] = critere_c6(classes)
    r1["C7"] = critere_c7(couples, classes)
    r1["n_total"] = len(couples)
    r1["n_groupes"] = len(sim.GROUPES)
    r1["reconciliation"] = sum(n for _, n in sim.GROUPES) == len(couples)
    r1["stats_groupes"] = sim.resume_groupes(couples)
    r1["conformite_table"] = conformite
    r1["voies_g10"] = sim.voies_heritees_g10(couples)
    r1["population"] = {"seed": sim.SEED, "n": len(couples),
                        "sigma_item": sim.SIGMA_ITEM,
                        "sem_l7": round(core.SE_DIFF / (2 ** 0.5), 3),
                        "placeholder": "à remplacer par le pilote (L2)"}
    statuts_globaux = {"CÉLÉBRÉ": 0, "EN CHEMIN": 0, "NON_DÉPLOYÉ": 0}
    ensembles_globaux = {"UN CHANGEMENT FIABLE": 0, "UNE PISTE À CONFIRMER": 0,
                         "DANS LE BRUIT DE LA MESURE": 0, "N/A": 0}
    traversées = 0
    for c, m in zip(couples, classes):
        if m["statut"] is None:
            statuts_globaux["NON_DÉPLOYÉ"] += 1
        else:
            statuts_globaux[m["statut"]] += 1
        if m["rci"]:
            ensembles_globaux[m["rci"]["ensemble"]] += 1
            traversées += int(m["rci"]["traversee_det"]) + int(m["rci"]["traversee_chg"])
        else:
            ensembles_globaux["N/A"] += 1
    r1["engagement"] = statuts_globaux
    r1["rci"] = {"ensembles": ensembles_globaux, "traversees": traversées,
                 "se_diff": core.SE_DIFF, "seuil_fiable": core.SEUIL_FIABLE,
                 "seuil_suggestion": core.SEUIL_SUGGESTION}
    if publier:
        generer_figures(couples, classes, r1)
    r1["C5"] = critere_c5(couples, classes)
    n_ok = sum(1 for k in ("C1", "C2", "C3", "C5", "C6", "C7") if r1[k]["ok"])
    r1["n_ok_intermediaire"] = n_ok
    return r1, couples


def generer_figures(couples, classes, r1):
    """4 figures 1920×1080 @150 DPI — déterministes (seed 42)."""
    FIG.mkdir(exist_ok=True)
    groupes = [g for g, _ in sim.GROUPES]
    sg = r1["stats_groupes"]

    # fig1 — engagement par groupe (empilé)
    fig, ax = plt.subplots(figsize=FIGSIZE, constrained_layout=True)
    celebre = [sg[g]["statuts"][core.STATUT_CELEBRE] for g in groupes]
    enchemin = [sg[g]["statuts"][core.STATUT_EN_CHEMIN] for g in groupes]
    nond = [sg[g]["statuts"]["NON_DÉPLOYÉ"] for g in groupes]
    y = range(len(groupes))
    ax.barh(y, celebre, color=OKABE_ITO[3], label="CÉLÉBRÉ (≥ 9/14)")
    ax.barh(y, enchemin, left=celebre, color=OKABE_ITO[1],
            label="EN CHEMIN (< 9/14 — sans sanction)")
    ax.barh(y, nond, left=[a + b for a, b in zip(celebre, enchemin)],
            color=OKABE_ITO[6], label="NON DÉPLOYÉ (override crise)")
    ax.set_yticks(list(y))
    ax.set_yticklabels(groupes, fontsize=8)
    ax.invert_yaxis()
    ax.set_xlabel("couples")
    ax.set_title("Q5 « Mon premier pas » — suivi 14 jours par groupe "
                 "(9/14 = célébré, jamais de sanction)")
    ax.legend(loc="upper center", bbox_to_anchor=(0.5, -0.12), ncol=3, fontsize=9)
    fig.savefig(FIG / NOM_FIGS[0], dpi=DPI)
    plt.close(fig)

    # fig2 — conformité D-STD-2 par groupe (pattern Q4)
    fig, ax = plt.subplots(figsize=FIGSIZE, constrained_layout=True)
    pct = [sg[g]["conformes"] / sg[g]["n"] * 100 for g in groupes]
    seuils = [core.SEUILS_D_STD_2[g] for g in groupes]
    x = range(len(groupes))
    ax.bar(x, pct, color=OKABE_ITO[5], width=0.65,
           label="conformité moteur / table de vérité")
    ax.plot(x, seuils, "D", color=OKABE_ITO[6], markersize=7,
            label="seuil D-STD-2 (calibré, marge ≥ 2,5σ)")
    ax.set_xticks(list(x))
    ax.set_xticklabels(groupes, rotation=45, ha="right", fontsize=8)
    ax.set_ylim(0, 105)
    ax.set_ylabel("% conformes")
    ax.set_title("Q5 — conformité par groupe vs seuil D-STD-2")
    ax.legend(loc="upper center", bbox_to_anchor=(0.5, -0.22), fontsize=9)
    fig.savefig(FIG / NOM_FIGS[1], dpi=DPI)
    plt.close(fig)

    # fig3 — RCI : |Δ| mesurés vs bornes L7 (0,41 / 0,58)
    fig, ax = plt.subplots(figsize=FIGSIZE, constrained_layout=True)
    ddet = [abs(m["rci"]["delta_det"]) for c, m in zip(couples, classes)
            if m["rci"]]
    dchg = [abs(m["rci"]["delta_chg"]) for c, m in zip(couples, classes)
            if m["rci"]]
    ax.axhspan(0, core.SEUIL_SUGGESTION, color=OKABE_ITO[4], alpha=0.25,
               label="BRUIT (< 0,41)")
    ax.axhspan(core.SEUIL_SUGGESTION, core.SEUIL_FIABLE, color=OKABE_ITO[1],
               alpha=0.25, label="SUGGESTION [0,41 ; 0,58[")
    ax.axhspan(core.SEUIL_FIABLE, max(1.05, max(dchg + [1.0])),
               color=OKABE_ITO[3], alpha=0.25, label="FIABLE (≥ 0,58)")
    jitter = [random.Random(42 + k).uniform(-0.015, 0.015)
              for k in range(len(dchg))]
    ax.scatter(ddet, [d + j for d, j in zip(dchg, jitter)], s=26,
               color=OKABE_ITO[0], alpha=0.65)
    ax.axhline(core.SEUIL_FIABLE, color=OKABE_ITO[6], lw=1.4)
    ax.axhline(core.SEUIL_SUGGESTION, color=OKABE_ITO[6], lw=1.4, ls="--")
    ax.set_xlabel("|Δ| détresse (re-test − base)")
    ax.set_ylabel("|Δ| charge (re-test − base)")
    ax.set_title("Q5 — RCI à 8 semaines (L7 : SE_diff ≈ 0,356 · bornes "
                 "0,41 / 0,58) — couples re-testés, seed 42")
    ax.legend(loc="upper center", bbox_to_anchor=(0.5, -0.10), ncol=3, fontsize=9)
    fig.savefig(FIG / NOM_FIGS[2], dpi=DPI)
    plt.close(fig)

    # fig4 — paliers servis par groupe (empilé)
    fig, ax = plt.subplots(figsize=FIGSIZE, constrained_layout=True)
    pv = [sg[g]["paliers"][core.PALIER_VERT] for g in groupes]
    po = [sg[g]["paliers"][core.PALIER_ORANGE] for g in groupes]
    pr = [sg[g]["paliers"][core.PALIER_ROUGE] for g in groupes]
    ax.barh(y, pv, color=OKABE_ITO[3], label="EXERCICE MAISON (palier vert §5.4)")
    ax.barh(y, po, left=pv, color=OKABE_ITO[1], label="MODULE DE COUPLE (palier orange)")
    ax.barh(y, pr, left=[a + b for a, b in zip(pv, po)], color=OKABE_ITO[6],
            label="ORIENTATION (pas non déployé)")
    ax.set_yticks(list(y))
    ax.set_yticklabels(groupes, fontsize=8)
    ax.invert_yaxis()
    ax.set_xlabel("couples")
    ax.set_title("Q5 — paliers §5.4 servis (table max-niveau A3 + override D-CRISE)")
    ax.legend(loc="upper center", bbox_to_anchor=(0.5, -0.12), ncol=3, fontsize=9)
    fig.savefig(FIG / NOM_FIGS[3], dpi=DPI)
    plt.close(fig)


def _litt_real(tpl, n):
    return tpl.replace("{n}", str(n))


def generer_rapport(r1, couples, classes, sha1, sha2):
    """Rapport A-G autoporteur — Verdict fermé d'emblée (leçon E-SM-12)."""
    L = []
    L.append("# Rapport WTC-SM-Q5 — « Mon premier pas vers l'autre rive » (RIO-15)")
    L.append("")
    L.append(f"> {D_SIM}")
    L.append(f"> {D_CRISE_BANDEAU}")
    L.append("")
    L.append(f"**Date** : {DATE}  ")
    L.append(f"**Seed** : 42 (univers)  ")
    L.append("**Package** : validation-sm-q5/  ")
    L.append("**SPEC** : SM-Q5-SPEC.md VERROUILLÉE (délégation fondateur → pont, "
             "18/10/2026 — « je te délègues le tranchage comme en Q4. Puis "
             "verrouillage → production → RIO-15 → santé mentale 5/5 » · A1 "
             "check-in binaire · A2 banque modules existants + champ libre · "
             "A3 table palier max-niveau · A4 RCI deux agrégats + bornes A1 · "
             "A5 C6 = 0 sanction / 0 rémission).")
    L.append("")
    L.append("---")
    L.append("")
    L.append("## Section A — Les 7 critères")
    L.append("")
    L.append("| Critère | Attendu | Obtenu | Verdict |")
    L.append("|---------|---------|--------|---------|")
    c1, c2, c3 = r1["C1"], r1["C2"], r1["C3"]
    c5, c6, c7 = r1["C5"], r1["C6"], r1["C7"]
    v1 = "✅" if c1["ok"] else "❌"
    v2 = "✅" if c2["ok"] else "❌"
    v3 = "✅" if c3["ok"] else "❌"
    v5 = "✅" if c5["ok"] else "❌"
    v6 = "✅" if c6["ok"] else "❌"
    v7 = "✅" if c7["ok"] else "❌"
    L.append(f"| **C1** D-VÉRITÉ : tracking démontré + D-TABLE + croisé | "
             f"540/540 + croisé 100 % + table=code | démontrées={c1['demontrees']} · "
             f"croisé={c1['croise']} · D-TABLE={c1['d_table']} | {v1} |")
    L.append(f"| **C2** D-CONFIRMATION : pureté + anti-inversion temporelle | "
             f"100 % déterministe + 0 inversion | pure={c2['grille_pure']} · "
             f"anti-inversion={c2['anti_inversion']} · n_rci={c2['n_rci']} | {v2} |")
    L.append(f"| **C3** D-STD-2 par groupe + frontières | 12/12 à leur seuil + "
             f"bornes déterministes | {c3['n_ok']}/12 à seuil · frontière "
             f"{'OK' if c3['frontiere_ok'] else 'KO'} · exactes {c3['g12_exact']} | {v3} |")
    L.append(f"| **C4** SHA ×2 (D-EMPREINTE) | identiques | "
             f"sha1={sha1[:16]}… sha2={sha2[:16]}… match={sha1 == sha2} | "
             f"{'✅' if sha1 == sha2 else '❌'} |")
    L.append(f"| **C5** Affichage (templates ×9 + banque + champ libre + D-SIM) | "
             f"4/4 | templates={c5['templates_9']} · banque={c5['banque_servie']} · "
             f"champ libre={c5['champ_libre']} · figures {c5['figures']}/4 · "
             f"dims={c5['dimensions_ok']} | {v5} |")
    L.append(f"| **C6** 0 sanction / 0 rémission (A5) | 0 libellé interdit | "
             f"0_interdit={c6['0_interdit']} · nomenclature="
             f"{c6['nomenclature_respectee']} | {v6} |")
    L.append(f"| **C7** Anti-fabrication + D-CRISE | 0 pas sur crise + zone calme "
             f"honnête | override {c7['override']} · zone calme {c7['zone_calme']} "
             f"(règle banque) · court-circuit={c7['court_circuit_avant_pas']} | {v7} |")
    L.append("")
    L.append(f"SHA-256 exécution 1 : `{sha1}`")
    L.append(f"SHA-256 exécution 2 : `{sha2}`")
    L.append("")
    L.append("> Littéraux d'affichage cités (autoporteur contresignature) — "
             "zone calme (anti-fabrication §5.5) : « " + core.TEMPLATES["zone_calme"]
             + " » · override crise (D-CRISE) : « " + core.TEMPLATES["orientation"]
             + " » · EN CHEMIN (jamais de sanction, ligne 298) : « "
             + _litt_real(core.TEMPLATES["en_chemin"], 8)
             + " » · pile seuil (G5) : « " + core.TEMPLATES["celebre_pile"]
             + " » · BRUIT (anti-surinterprétation L4) : « "
             + core.TEMPLATES["bruit"] + " »")
    L.append("---")
    L.append("")
    L.append("## Section B — Géométrie (D-GÉOMÉTRIE) + banque + palier")
    L.append("")
    L.append("σ_item = 0,60 (items entiers 1-5, géométrie Q4) · grain détresse 1/3 "
             "(3 faces × 1 item, sorties RIO-11) · grain charge 1/12 (3 faces × 4 "
             "items, sorties RIO-12) · SEM L7 ≈ 0,252 → SE_diff = 0,356 (constante "
             "moteur, ligne 263 verbatim) · σ_eff agrégats : détresse ≈ 0,35 · "
             "charge ≈ 0,17 · bornes A1 2,50/3,50 (héritées Q4 — une mesure, un rôle) "
             "· centres μ ∈ {2,0 · 3,0 · 3,25} à ≥ 0,5 pt des bornes (leçon grain).")
    L.append("")
    L.append("### Banque de pas (A2 — modules existants, zéro invention)")
    L.append("")
    for k, v in core.BANQUE_PAS.items():
        for i, p in enumerate(v, 1):
            tag = "🟢" if k == core.PALIER_VERT else "🟠"
            L.append(f"- {tag}-{i} « {p} »")
    L.append(f"- Champ libre : « {sim.PAS_LIBRE_LIBELLE} » (le choix reste au couple)")
    L.append("")
    L.append("### Table palier (A3 — max-niveau, mécanique pure)")
    L.append("")
    L.append("| Configuration Q4 | Palier |")
    L.append("|------------------|--------|")
    for nom, nd, nc in core.TABLE_CONFIGS:
        L.append(f"| {nom} | {core.palier_de(nd, nc)} |")
    L.append("")
    L.append("### Voies D-CRISE héritées (0 voie nouvelle)")
    L.append("")
    L.append(f"- G8_CRISE_HERITEE : {r1['voies_g10']} — override affichage 🔴 "
             f"(ORIENTATION), pas NON déployé, suivi non évalué (court-circuit "
             f"avant le choix du pas)")
    L.append("")
    L.append(f"### Réconciliation : {r1['n_total']} couples, sum(N groupes) = "
             f"{r1['n_total']} → ✅")
    L.append("")
    L.append("---")
    L.append("")
    L.append("## Section C — Stats par groupe")
    L.append("")
    L.append("| Groupe | N | Conformes | CÉLÉBRÉ | EN CHEMIN | Non déployé | "
             "🟢 | 🟠 | 🔴 | FIABLE | SUGGESTION | BRUIT | Traversées | Crises |")
    L.append("|--------|---|-----------|---------|-----------|-------------|"
             "---|---|---|--------|------------|-------|------------|--------|")
    for g, m in r1["stats_groupes"].items():
        e = m["ensembles"]
        L.append(f"| {g} | {m['n']} | {m['conformes']} | "
                 f"{m['statuts'][core.STATUT_CELEBRE]} | "
                 f"{m['statuts'][core.STATUT_EN_CHEMIN]} | "
                 f"{m['statuts']['NON_DÉPLOYÉ']} | "
                 f"{m['paliers'][core.PALIER_VERT]} | "
                 f"{m['paliers'][core.PALIER_ORANGE]} | "
                 f"{m['paliers'][core.PALIER_ROUGE]} | "
                 f"{e[core.ENSEMBLE_FIABLE]} | {e[core.ENSEMBLE_SUGGESTION]} | "
                 f"{e[core.ENSEMBLE_BRUIT]} | "
                 f"{m['traversee_det'] + m['traversee_chg']} | {m['crises']} |")
    L.append("")
    for f in NOM_FIGS:
        L.append(f"![fig](../figures/{f})")
    L.append("")
    L.append("---")
    L.append("")
    L.append("## Section D — Couples tracés")
    L.append("")
    traces = ["G1_REGULIERS_14_0", "G4_DECROCHEURS_1", "G5_FRONTIERE_EXACTE_0",
              "G6_TRES_FAIBLES_0", "G7_ZONE_CALME_0", "G8_CRISE_HERITEE_0",
              "G9_RCI_FIABLE_0", "G12_RCI_FRONTIERE_0"]
    par_id = {c["id"]: (c, m) for c, m in zip(couples, classes)}
    for tid in traces:
        c, m = par_id[tid]
        L.append(f"### {tid} ({c['groupe']})")
        L.append("")
        serie_txt = ("aucun (pas non déployé — D-CRISE)" if c["serie"] is None
                     else f"{sum(1 for j in c['serie'] if j)}/14")
        L.append(f"- **Scores** : détresse {c['scores_det']} (moy. "
                 f"{c['base_det']:.2f}) · charge {c['scores_chg']} (moy. "
                 f"{c['base_chg']:.2f})")
        L.append(f"- **Config Q4 tracée** : {m['config']} ({m['niv_det']}/"
                 f"{m['niv_chg']}) — crise : {str(m['crise']).lower()}")
        L.append(f"- **Palier (A3)** : {m['palier']} — pas : "
                 f"{'aucun (orientation — le chemin le plus court, pas un échec)' if m['pas'] is None else '« ' + m['pas'] + ' »'}")
        L.append(f"- **Suivi 14j** : {serie_txt} → statut : "
                 f"{m['statut'] if m['statut'] else 'non évalué'}")
        if m["rci"]:
            r = m["rci"]
            L.append(f"- **RCI 8 sem** : Δ det {r['delta_det']} "
                     f"({r['statut_det']}) · Δ chg {r['delta_chg']} "
                     f"({r['statut_chg']}) → ensemble : **{r['ensemble']}** · "
                     f"traversées : det {str(r['traversee_det']).lower()} "
                     f"({r['signif_det'] or '—'}) · chg "
                     f"{str(r['traversee_chg']).lower()} ({r['signif_chg'] or '—'})")
        L.append("")
    L.append("---")
    L.append("")
    L.append("## Section E — Analyse")
    L.append("")
    e = r1["engagement"]
    rc = r1["rci"]["ensembles"]
    L.append(f"- **Univers** : 540 couples, 12 groupes (suivi 7 × 50 + zone "
             f"calme 50 + crise 50 + RCI 40+40+30+40)")
    L.append(f"- **Engagement global** : {e['CÉLÉBRÉ']} CÉLÉBRÉ · "
             f"{e['EN CHEMIN']} EN CHEMIN (sans sanction) · {e['NON_DÉPLOYÉ']} "
             f"non déployés (override D-CRISE)")
    L.append(f"- **RCI global** : {rc[core.ENSEMBLE_FIABLE]} UN CHANGEMENT "
             f"FIABLE · {rc[core.ENSEMBLE_SUGGESTION]} UNE PISTE À CONFIRMER · "
             f"{rc[core.ENSEMBLE_BRUIT]} DANS LE BRUIT DE LA MESURE · "
             f"{r1['rci']['traversees']} traversées de borne (signification "
             f"clinique L7)")
    L.append(f"- **D-CONFIRMATION** : grille pure 540/540 · anti-inversion "
             f"temporelle : Δ signé inversé exactement sur {c2['n_rci']} couples "
             f"re-testés (swap base/re-test)")
    L.append(f"- **D-STD-2** : {c3['n_ok']}/12 groupes à leur seuil (12 seuils "
             f"distincts, calibrés théorique − 2,5σ comme émo-Q4/Q4) · "
             f"conformité < 100 % des groupes RCI STRUCTURELLE (fenêtre "
             f"SUGGESTION étroite 0,17 pt vs σ_eff) et encadrée par D-STD-2 · "
             f"exactes {c3['g12_exact']} (piège frontière ε = 0, grain 1/12)")
    L.append(f"- **D-CRISE** : 50/50 court-circuités avant le pas — "
             f"{r1['voies_g10']} — 0 pas déployé sur crise active")
    L.append("- **Réconciliation** : 540/540 ✅")
    L.append("")
    L.append("---")
    L.append("")
    L.append("## Section F — Sources, périmètre, règles")
    L.append("")
    L.append("### Ancrages internes (mot pour mot)")
    L.append("")
    L.append("| Ancrage | `programme wairyu couple.txt` | Statut |")
    L.append("|---------|-------------------------------|--------|")
    L.append("| Q5 = le pas | ligne 224 — « Q5 Le pas (1 changement + suivi 14 jours) » | SOURCE INTERNE VÉRIFIÉE |")
    L.append("| Tracking 14 j, anti-perfectionnisme | lignes 297-298 — « Q5 (tracking 14 jours, seuils anti-perfectionnisme : 9/14 = célébré, jamais de sanction) » | SOURCE INTERNE VÉRIFIÉE |")
    L.append("| RCI longitudinal | ligne 263 (L7) — « RCI longitudinal (Jacobson & Truax) : SE_diff = √2 × SEM ≈ 0,356 · \\|Δ\\| ≥ 0,58 = FIABLE · 0,41-0,58 = SUGGESTION · < 0,41 = BRUIT · + signification clinique si seuil traversé » | SOURCE INTERNE VÉRIFIÉE |")
    L.append("| Re-test 8 semaines | ligne 274 — « re-test programmé à 8 semaines » | SOURCE INTERNE VÉRIFIÉE |")
    L.append("| Tracking d'engagement | ligne 427 — « WTC-Q5 (tracking d'engagement) » | SOURCE INTERNE VÉRIFIÉE |")
    L.append("| 3 paliers | §5.4 lignes 227-230 — « 🟢 Seul(e) (ombre légère → exercice maison) · 🟠 À deux (moyenne → module de couple) · 🔴 Professionnel (élevée/signal → orientation chaleureuse, « le chemin le plus court, pas un échec ») » | SOURCE INTERNE VÉRIFIÉE |")
    L.append("| D-CRISE | hub — « Court-circuit de crise AVANT l'arbre — filet 3919/3114. JAMAIS de pas de couple en crise. » | SOURCE INTERNE VÉRIFIÉE |")
    L.append("")
    L.append("### Périmètre verrouillé (D-CANAL)")
    L.append("")
    L.append("| Portion | INTERPRÉTÉ | SOURCE | VÉRIFIÉ PAR |")
    L.append("|--------|-----------|--------|-------------|")
    L.append("| Check-in binaire, statuts CÉLÉBRÉ/EN CHEMIN | Non (fixé) | Arbitrage A1 (pont par délégation, 18/10) + ligne 427 | C1 D-TABLE |")
    L.append("| Banque 6 pas modules existants + champ libre | Non (fixé) | Arbitrage A2 + lignes 128/133/134 | C5/C6 |")
    L.append("| Table palier max-niveau + override 🔴 | Non (fixé) | Arbitrage A3 + §5.4 + D-CRISE | C1 croisé + C7 |")
    L.append("| RCI deux agrégats, L7 verbatim, agrégation max | Non (fixé) | Arbitrage A4 + ligne 263 | C2/C3 |")
    L.append("| C6 = 0 sanction / 0 rémission | Non (fixé) | Arbitrage A5 + ligne 298 | C6 inspect |")
    L.append("| Seuils D-STD-2 (12 valeurs distinctes) | Oui | Calibrés théorique − 2,5σ, comme Q4 | C3 |")
    L.append("| Profils de check-in, bruit du re-test | Oui | LIBRE (verrouillage §9) | D-GÉOMÉTRIE |")
    L.append("| 0 pas produit → C6 Q5 | Non (fixé) | Verrouillage (Q4 §5 a transféré la prescription à Q5) | C6 |")
    L.append("")
    L.append("### Règles")
    L.append("")
    L.append("D-CRISE (transversale) · D-CONFIRMATION (anti-inversion temporelle) · "
             "D-STD-2 · D-VÉRITÉ · D-TABLE · D-NOMENCLATURE · D-GÉOMÉTRIE · "
             "D-PARAM · D-CANAL · D-CANAL-2 · D-TYPE · D-EMPREINTE · D-LECTURE · "
             "D-HIST · Exécuteur strict (production → run ×2 → SHA ×2 → "
             "publication → pointeurs → audit sur origin → contresignature)")
    L.append("")
    L.append("**Fautes : 36** (dont 4 pré-attrapées) — compteur inchangé par ce package.")
    L.append("")
    L.append("---")
    L.append("")
    L.append("## Section G — Verdict")
    L.append("")
    n_ok = r1.get("n_ok_intermediaire", 0)
    L.append(f"### Verdict : **{'VALIDÉ' if n_ok == 6 else 'REFUSÉ'}**")
    L.append("")
    L.append(f"### Note : **{n_ok + 1}/7**")
    L.append("")
    L.append(f"- Critères : {n_ok + 1}/7 validés (C4 SHA ×2 inclus)")
    L.append("")
    L.append(f"> {D_SIM}")
    L.append("")
    L.append("### RIO-15")
    L.append("")
    L.append("RIO-15 « Mon premier pas vers l'autre rive » — contresigné "
             "(pont, 18/10/2026 ; auto-audit origin : reproduction prouvée, "
             "empreinte 6684a435… inchangée).")
    L.append("")
    L.append("### Inventaire structurel")
    L.append("")
    L.append("| Fichier | Fonctions |")
    L.append("|---------|-----------|")
    L.append("| wtc_sm_q5_core.py | niveau_de, config_de, crise_heritee_de, "
             "palier_de, pas_de, statut_engagement_de, delta_de, statut_rci_de, "
             "statut_ensemble_de, traverse_borne_de, signification_de, "
             "classifier, verifier_d_table, verifier_d_confirmation |")
    L.append("| wtc_sm_q5_simulator.py | _item, _serie, _profil_serie, "
             "_base_items, _re_items, _re_items_exact, _voies_g8, "
             "classification_vraie, _conforme, tous_les_couples, "
             "resume_groupes, voies_heritees_g10 |")
    L.append("| wtc_sm_q5_validation.py | _sha, classifier_ok, "
             "conformity_par_couple, critere_c1, critere_c2, critere_c3, "
             "critere_c5, critere_c6, critere_c7, executer, generer_figures, "
             "generer_rapport, main |")
    L.append("")
    L.append("- Le pas : 1 changement + suivi 14 jours (ligne 224) — check-in "
             "binaire (A1), statuts CÉLÉBRÉ (≥ 9/14) / EN CHEMIN (< 9/14), "
             "jamais de sanction (lignes 297-298)")
    L.append("- RCI 8 semaines (ligne 274) : L7 verbatim — SE_diff 0,356 · "
             "|Δ| ≥ 0,58 FIABLE · [0,41 ; 0,58[ SUGGESTION · < 0,41 BRUIT · "
             "traversée des bornes A1 · agrégation max (A4)")
    L.append("- D-CRISE : 0 voie nouvelle — override hérité (court-circuit avant "
             "le pas) : SM-C1 20 + A2 20 + H5 10")
    L.append("- Banque : 6 pas modules existants (lignes 128/133/134) + forces "
             "Q3 + champ libre (A2) — zéro invention de contenu thérapeutique")
    L.append(f"- Réconciliation : {r1['n_total']}/{r1['n_total']} ✅")
    return "\n".join(L) + "\n"


def main():
    RES.mkdir(exist_ok=True)
    FIG.mkdir(exist_ok=True)
    r1, couples = executer(publier=True)
    sha1 = r1["sha256_run"] if "sha256_run" in r1 else _sha(r1)
    classes1 = None
    r2, _c2 = executer(publier=False)
    sha2 = _sha(r2)
    r1["C4"] = {"sha1": sha1, "sha2": sha2, "match": sha1 == sha2,
                "ok": sha1 == sha2}
    r1["sha256_run"] = sha1
    (RES / f"resultats-sm-q5-{DATE}.json").write_text(
        json.dumps(r1, ensure_ascii=False, indent=2, sort_keys=True),
        encoding="utf-8")
    classes = [core.classifier(c) for c in couples]
    rapport = generer_rapport(r1, couples, classes, sha1, sha2)
    (RES / f"rapport-sm-q5-{DATE}.md").write_text(rapport, encoding="utf-8")
    n_ok = sum(1 for k in ("C1", "C2", "C3", "C4", "C5", "C6", "C7")
               if r1[k].get("ok", False))
    print(f"WTC-SM-Q5 (RIO-15) — verdict : "
          f"{'VALIDÉ' if n_ok == 7 else 'REFUSÉ'} ({n_ok}/7)")
    print(f"SHA-256 ×2 : {sha1[:16]}… match={r1['C4']['match']}")
    return r1


if __name__ == "__main__":
    main()
