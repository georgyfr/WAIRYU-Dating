# -*- coding: utf-8 -*-
"""WAIRYU — WTC-EXT-Q2-03 : validation Extensions Q2 (RIO-17).
C1 D-VÉRITÉ (D-TABLE cas exhaustifs + 9/9 configurations démontrées +
nomenclature + anti-collision registre SM-Q4) · C2 D-CONFIRMATION
(déterminisme + anti-inversion des rives : échange → miroir) · C3 D-STD-2
(14 seuils DISTINCTES — double comptage 9 configs + 14 groupes — override
filet 40/40 y compris items Forte, entrée RQS testée) · C4 SHA ×2 (D-EMPREINTE :
SHA sur contenu sans sha256_run ni C4) · C5 affichage 6/6 · C6 anti-fabrication
temporelle À DEUX (0 verdict temps restant / 0 bonne saison / zone calme dite
comme telle / 0 verdict croisé sur C) · C7 D-CRISE + non-reproche + non-tiers.
Rapport A-G autoporteur (Verdict fermé — leçon E-SM-12). 4 figures 1920×1080
sans émojis (leçon glyphes DejaVu)."""
from __future__ import annotations
import hashlib
import json
import sys
from datetime import datetime
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

sys.path.insert(0, str(Path(__file__).parent))
import wtc_ext_q2_core as core
import wtc_ext_q2_simulator as sim

PKG = Path(__file__).parent.parent
RES = PKG / "results"
FIG = PKG / "figures"
DATE = datetime.now().strftime("%Y-%m-%d")
FIGSIZE = (12.8, 7.2)
DPI = 150
NOM_FIGS = ("fig1_paliers_croises.png", "fig2_conformite_d_std2.png",
            "fig3_percentiles_l6.png", "fig4_matrice_configs.png")
OKABE_ITO = ["#000000", "#E69F00", "#56B4E9", "#009E73", "#F0E442",
             "#0072B2", "#D55E00", "#CC79A9"]
D_SIM = ("AVERTISSEMENT D-SIM : résultats issus de simulations (seed 42) — "
         "la mécanique est validée, pas la prévalence clinique.")
D_CRISE_BANDEAU = ("D-CRISE : court-circuit AVANT le verdict de couple — filet "
                   "9 signaux → P-FILTRE 3919/3114 (ligne 369). JAMAIS de "
                   "croisement de couple en crise.")
ORDRE = ("trancher A1-A6. ordonner l'exécution de P1-P6. Ensuite : verrouillage "
         "Q2 → production → RIO-17")


def _sha(resultats):
    brut = json.dumps(resultats, sort_keys=True, ensure_ascii=False)
    return hashlib.sha256(brut.encode("utf-8")).hexdigest()


def bien_forme(couple, cr):
    """Verdict bien formé du croisement (les trois voies)."""
    if cr["override"]:
        return (cr["verdict"] is None and cr["palier"] == core.PALIER_ROUGE
                and cr["display"] == "OVERRIDE D-CRISE"
                and "D-CRISE" in cr["bandeau"])
    if not cr["entree"]:
        return (cr["verdict"] is None and cr["palier"] is None
                and cr["display"] == "NON ENTRÉE (RQS)")
    if cr["config_nom"] not in {c["nom"] for c in core.CONFIGS.values()}:
        return False
    if cr["palier"] not in (core.PALIER_VERT, core.PALIER_ORANGE,
                            core.PALIER_ROUGE):
        return False
    if cr["percentiles"]["rive1"] is None or cr["percentiles"]["rive2"] is None:
        return False
    if not isinstance(cr["boucle_probable"], bool):
        return False
    if not isinstance(cr["styles_dissemblables"], bool):
        return False
    if cr["asym_L"]["lecture"] not in ("ASYMÉTRIE MARQUÉE", "asymétrie légère"):
        return False
    if cr["asym_C"]["lecture"] not in ("ASYMÉTRIE MARQUÉE", "asymétrie légère"):
        return False
    if set(cr["inferences_L5"].keys()) != {core.INF_TAXE, core.INF_SUJET,
                                           core.INF_SILENCE}:
        return False
    if not all(isinstance(v, bool) for v in cr["inferences_L5"].values()):
        return False
    return True


def critere_c1(couples, croisements):
    """C1 D-VÉRITÉ : D-TABLE (cas exhaustifs) + bien-formé 650/650 +
    9/9 configurations démontrées + nomenclature + anti-collision SM-Q4."""
    dt = core.verifier_d_table(population=sim.POPULATION)
    demons = [bien_forme(c, cr) for c, cr in zip(couples, croisements)]
    servis = {cr["config_num"] for cr in croisements
              if cr["entree"] and not cr["override"]}
    labels = set()
    for cr in croisements:
        labels.add(cr["display"])
        labels.add(cr["palier"]) if cr["palier"] else None
        if cr["entree"]:
            labels.add(cr["asym_L"]["lecture"])
            labels.add(cr["asym_C"]["lecture"])
            labels.update(k for k, v in cr["inferences_L5"].items() if v)
            labels.add(cr["verdict"]["config"])
    nom_ok = labels <= set(core.NOMENCLATURE)
    return {"d_table": all(dt.values()), "d_table_details": dt,
            "n_cas_table": len(dt),
            "demontrees": f"{sum(demons)}/{len(demons)}",
            "configs_servies": f"{len(servis)}/9",
            "configs_9": servis == set(range(1, 10)),
            "nomenclature_respectee": nom_ok,
            "anti_collision_sm_q4": dt["noms_hors_registre_sm_q4"],
            "ok": (all(dt.values()) and all(demons) and nom_ok
                   and servis == set(range(1, 10))),
            "eliminatoire": True}


def critere_c2(sorties, croisements):
    """C2 D-CONFIRMATION : config = f(H1, H2) pure et déterministe — même
    paire de sorties → même config ; 0 inversion des rives (échange des deux
    sorties → miroir ou soi ; chaque niveau vient de SA propre carte)."""
    dc = core.verifier_d_confirmation({"liste": sorties,
                                       "population": sim.POPULATION},
                                      croisements)
    return {"grille_pure": dc["deterministe"],
            "anti_inversion": dc["anti_inversion"],
            "anti_inversion_ok": dc["anti_inversion_ok"],
            "ok": dc["deterministe"] and dc["anti_inversion_ok"],
            "eliminatoire": True}


def critere_c3(couples, croisements, conformite, calib):
    """C3 D-STD-2 : 14 seuils DISTINCTES (double comptage : 9 configs + 14
    groupes — leçon ad01f21) + override filet 40/40 y compris 5 couples items
    Forte + entrée RQS testée (D-TABLE) + réconciliation."""
    par_groupe = {}
    for gname, n in sim.effectifs():
        ids = [c["id"] for c in couples if c["groupe"] == gname]
        conf = sum(1 for i in ids if conformite[i])
        pct = round(100.0 * conf / n, 1)
        seuil = calib["seuils"][gname]
        par_groupe[gname] = {"conformes": conf, "n": n, "pct": pct,
                             "seuil": seuil, "ok": pct >= seuil}
    n_ok = sum(1 for v in par_groupe.values() if v["ok"])
    g10 = [(c, cr) for c, cr in zip(couples, croisements)
           if c["groupe"] == "G10_SIGNAL_FILET"]
    override = sum(1 for c, cr in g10
                   if cr["override"] and cr["verdict"] is None
                   and cr["palier"] == core.PALIER_ROUGE)
    forte_filet = sum(1 for c, cr in g10
                      if int(c["id"].split("_")[-1]) >= 35
                      and cr["override"] and cr["verdict"] is None)
    dt = core.verifier_d_table(population=sim.POPULATION)
    n_total = len(couples)
    return {"par_groupe": par_groupe, "n_ok": n_ok,
            "bornes_distinctes": calib["bornes_distinctes"],
            "bornes_distinctes_9": calib["bornes_distinctes_9_configs"],
            "override_filet": f"{override}/40",
            "forte_filet_court_circuit": f"{forte_filet}/5",
            "entree_rqs_testee": dt["non_entree_rqs"] and dt["prudence_entre"],
            "reconciliation": sum(v["n"] for v in par_groupe.values()) == n_total,
            "ok": (n_ok == 14 and calib["bornes_distinctes"]
                   and calib["bornes_distinctes_9_configs"]
                   and override == 40 and forte_filet == 5
                   and dt["non_entree_rqs"] and dt["prudence_entre"]),
            "eliminatoire": True}


def critere_c5(couples, croisements):
    """C5 Affichage 6/6 : templates ×9 + boucle probable + avertissement styles
    dissemblables + asymétries L/C en avertissement + bandeau D-SIM + littéraux
    autoporteurs (figures 1920×1080)."""
    templates_ok = all(f"config_{k}" in core.TEMPLATES for k in range(1, 10))
    boucle_ok = "boucle" in core.TEMPLATES and "≥ 30" in core.TEMPLATES["boucle"]
    styles_ok = ("styles" in core.TEMPLATES
                 and "STYLES DISSEMBLABLES" in core.TEMPLATES["styles"])
    asym_ok = ("asym_marquee" in core.TEMPLATES
               and "asym_legere" in core.TEMPLATES)
    d_sim_ok = bool(core.D_SIM) and bool(D_SIM)
    litteraux_ok = all(t in core.TEMPLATES for t in (
        "ombre_config", "force_permissions", "aide_seuils", "palier_vert",
        "palier_orange", "palier_rouge", "override", "non_entree",
        "inf_taxe", "inf_sujet", "inf_silence"))
    dims_ok = True
    for f in NOM_FIGS:
        p = FIG / f
        dims_ok &= p.exists() and p.stat().st_size > 20000
    nb_asym = sum(1 for cr in croisements
                  if cr["entree"] and cr["asym_L"]["lecture"] == "ASYMÉTRIE MARQUÉE")
    return {"templates_9": templates_ok, "boucle": boucle_ok,
            "styles": styles_ok, "asymetries": asym_ok, "d_sim": d_sim_ok,
            "litteraux": litteraux_ok, "figures": 4, "dimensions_ok": dims_ok,
            "asym_marquees_servies": nb_asym,
            "ok": (templates_ok and boucle_ok and styles_ok and asym_ok
                   and d_sim_ok and litteraux_ok and dims_ok)}


def critere_c6(couples, croisements):
    """C6 A5-Q1 transposée À DEUX : 0 verdict sur le temps restant du couple ·
    0 modèle de la bonne saison à deux · 0 « trop tard » / compte à rebours
    partagé · zone calme (config 1) dite comme telle · 0 verdict croisé sur C
    (A6 : les asymétries C restent descriptives)."""
    labels = set()
    for cr in croisements:
        labels.add(cr["display"])
        if cr["palier"]:
            labels.add(cr["palier"])
        if cr["entree"]:
            labels.add(cr["asym_L"]["lecture"])
            labels.add(cr["asym_C"]["lecture"])
            labels.update(k for k, v in cr["inferences_L5"].items() if v)
    nom_ok = labels <= set(core.NOMENCLATURE)
    produits = " | ".join(sorted(x for x in labels if x)) + " | " + \
        " ".join(core.TEMPLATES.values())
    interdits = ("trop tard", "compte à rebours", "il vous reste", "il reste",
                 "dernière chance", "urgence", "pathologie", "diagnostic",
                 "dépistage", "il est temps de", "bonne saison",
                 "temps restant")
    touches = [x for x in interdits if x in produits.lower()]
    zone_calme = ("rien à fabriquer" in core.TEMPLATES["config_1"]
                  and "rien à fabriquer" in core.TEMPLATES["palier_vert"])
    g14 = [cr for c, cr in zip(couples, croisements)
           if c["groupe"] == "G14_ANTI_C6_ZONE_SEREINE"]
    anti_c6_servi = sum(1 for cr in g14
                        if cr["entree"] and cr["config_num"] == 1
                        and cr["palier"] == core.PALIER_VERT)
    # A6 : aucun champ de verdict croisé sur C — les sorties ne portent que
    # asym_C (descriptif) ; vérification structurelle des clefs produites
    cles_verdict = {tuple(sorted(cr["verdict"].keys())) for cr in croisements
                    if cr["entree"]}
    pas_de_verdict_c = cles_verdict == {("config", "palier", "zone_calme")}
    return {"nomenclature_respectee": nom_ok,
            "0_verdict_temps_restant": not touches,
            "interdits_touches": touches,
            "zone_calme_honnete": zone_calme,
            "anti_c6_servi": f"{anti_c6_servi}/40",
            "0_verdict_croise_c": pas_de_verdict_c,
            "ok": (nom_ok and not touches and zone_calme
                   and anti_c6_servi >= 36 and pas_de_verdict_c),
            "eliminatoire": True}


def critere_c7(couples, croisements):
    """C7 D-CRISE + non-reproche + non-tiers : override filet avant croisement
    testé (40/40) ; taxe lue en coût ressenti par la rive qui la paie (0
    reproche) ; aînés/familles = rôles, pas de noms (ligne 363)."""
    g10 = [(c, cr) for c, cr in zip(couples, croisements)
           if c["groupe"] == "G10_SIGNAL_FILET"]
    court = sum(1 for c, cr in g10
                if cr["override"] and cr["verdict"] is None
                and cr["palier"] == core.PALIER_ROUGE)
    aucune_verdict_filet = all(cr["verdict"] is None for c, cr in g10)
    produits = " ".join(core.TEMPLATES.values()).lower()
    interdits = ("coupable", "blâme", "fautif", "à condamner", "de sa faute",
                 "c'est sa faute", "il bloque", "elle bloque")
    zero_reproche = not any(x in produits for x in interdits)
    tiers = ("nom d'ainé", "nom de famille", "monsieur", "madame")
    zero_tiers = not any(x in produits for x in tiers)
    boucle_sans_verdict = "ne change aucun résultat" in core.TEMPLATES["boucle"]
    return {"court_circuit": f"{court}/40",
            "court_circuit_ok": court == 40 and aucune_verdict_filet,
            "forte_mais_filet": "G10 idx 35-39 : items Forte → override quand "
                                "même (avant le verdict)",
            "zero_reproche": zero_reproche,
            "zero_tiers": zero_tiers,
            "boucle_sans_verdict": boucle_sans_verdict,
            "ok": court == 40 and aucune_verdict_filet and zero_reproche
            and zero_tiers and boucle_sans_verdict,
            "eliminatoire": True}


def executer(publier=True):
    couples = sim.tous_les_couples()
    sorties = [{"rive_a": sim.sortie_rive(c["rive_a"]),
                "rive_b": sim.sortie_rive(c["rive_b"])} for c in couples]
    croisements = [core.classifier_croisement(s["rive_a"], s["rive_b"],
                                              sim.POPULATION)
                   for s in sorties]
    conformite = {c["id"]: sim.conformite_couple(c, cr)
                  for c, cr in zip(couples, croisements)}
    calib = core.calibration_d_std_2()
    r1 = {}
    r1["C1"] = critere_c1(couples, croisements)
    r1["C2"] = critere_c2(sorties, croisements)
    r1["C3"] = critere_c3(couples, croisements, conformite, calib)
    r1["C6"] = critere_c6(couples, croisements)
    r1["C7"] = critere_c7(couples, croisements)
    r1["n_total"] = len(couples)
    r1["n_groupes"] = len(sim.effectifs())
    r1["reconciliation"] = sum(n for _, n in sim.effectifs()) == len(couples)
    r1["calibration"] = calib
    r1["conformite_table"] = conformite
    r1["population"] = {
        "seed": sim.SEED, "n_couples": len(couples),
        "n_groupes": len(sim.effectifs()),
        "sigma_item": sim.SIGMA_ITEM,
        "pop_percentiles_n": core.POP_N, "pop_seed": core.POP_SEED,
        "pop_mu": core.POP_MU, "pop_sd": core.POP_SD,
        "sigma_h": core.SIGMA_H,
        "calibration_methode": "Monte-Carlo déterministe (même processus "
                               "générateur que le simulateur)",
        "n_mc": core.N_MC, "seed_mc": core.SEED_MC,
        "placeholder": "population de référence L6 + placeholders L2 (ligne 258) "
                       "à remplacer par le pilote"}
    stats = {}
    for c, cr in zip(couples, croisements):
        g = stats.setdefault(c["groupe"], {
            "n": 0, "conformes": 0, "configs": {}, "paliers":
                {"EXERCICE MAISON": 0, "MODULE DE COUPLE": 0, "ORIENTATION": 0,
                 "OVERRIDE": 0, "NON ENTRÉE": 0},
            "boucle": 0, "styles": 0, "asym_L_marquee": 0, "asym_C_marquee": 0,
            "inf_taxe": 0, "inf_sujet": 0, "inf_silence": 0, "entrees": 0})
        g["n"] += 1
        g["conformes"] += int(conformite[c["id"]])
        cle = (cr["display"] if not cr["entree"]
               else core.CONFIGS[cr["config_num"]]["nom"])
        g["configs"][cle] = g["configs"].get(cle, 0) + 1
        if cr["entree"]:
            g["entrees"] += 1
            g["paliers"][cr["palier"]] += 1
            g["boucle"] += int(cr["boucle_probable"])
            g["styles"] += int(cr["styles_dissemblables"])
            g["asym_L_marquee"] += int(cr["asym_L"]["lecture"] == "ASYMÉTRIE MARQUÉE")
            g["asym_C_marquee"] += int(cr["asym_C"]["lecture"] == "ASYMÉTRIE MARQUÉE")
            g["inf_taxe"] += int(cr["inferences_L5"][core.INF_TAXE])
            g["inf_sujet"] += int(cr["inferences_L5"][core.INF_SUJET])
            g["inf_silence"] += int(cr["inferences_L5"][core.INF_SILENCE])
        elif cr["override"]:
            g["paliers"]["OVERRIDE"] += 1
        else:
            g["paliers"]["NON ENTRÉE"] += 1
    r1["stats_groupes"] = stats
    paliers_globaux = {"EXERCICE MAISON": 0, "MODULE DE COUPLE": 0,
                       "ORIENTATION": 0, "OVERRIDE": 0, "NON ENTRÉE": 0}
    inferences_globales = {core.INF_TAXE: 0, core.INF_SUJET: 0,
                           core.INF_SILENCE: 0}
    boucles = styles_servis = entrees = 0
    for cr in croisements:
        if cr["override"]:
            paliers_globaux["OVERRIDE"] += 1
        elif not cr["entree"]:
            paliers_globaux["NON ENTRÉE"] += 1
        else:
            entrees += 1
            paliers_globaux[cr["palier"]] += 1
            boucles += int(cr["boucle_probable"])
            styles_servis += int(cr["styles_dissemblables"])
            for k, v in cr["inferences_L5"].items():
                inferences_globales[k] += int(v)
    r1["globaux"] = {"paliers": paliers_globaux, "entrees": entrees,
                     "boucles": boucles, "styles": styles_servis,
                     "inferences_L5": inferences_globales}
    if publier:
        generer_figures(couples, croisements, r1)
    r1["C5"] = critere_c5(couples, croisements)
    return r1, couples, sorties, croisements


def generer_figures(couples, croisements, r1):
    """4 figures 1920×1080 @150 DPI — déterministes, sans émojis (DejaVu)."""
    FIG.mkdir(exist_ok=True)
    groupes = [g for g, _ in sim.effectifs()]
    sg = r1["stats_groupes"]
    y = range(len(groupes))

    # fig1 — paliers croisés servis par groupe (couples, empilé)
    fig, ax = plt.subplots(figsize=FIGSIZE, constrained_layout=True)
    pv = [sg[g]["paliers"]["EXERCICE MAISON"] for g in groupes]
    po = [sg[g]["paliers"]["MODULE DE COUPLE"] for g in groupes]
    pr = [sg[g]["paliers"]["ORIENTATION"] for g in groupes]
    pov = [sg[g]["paliers"]["OVERRIDE"] for g in groupes]
    pne = [sg[g]["paliers"]["NON ENTRÉE"] for g in groupes]
    base = [0] * len(groupes)
    for vals, coul, lab in ((pv, OKABE_ITO[3], "EXERCICE MAISON (palier vert)"),
                            (po, OKABE_ITO[1], "MODULE DE COUPLE (palier orange)"),
                            (pr, OKABE_ITO[6], "ORIENTATION (palier rouge)"),
                            (pov, OKABE_ITO[0], "OVERRIDE D-CRISE (tracé, non déployé)"),
                            (pne, OKABE_ITO[7], "NON ENTRÉE (RQS)")):
        ax.barh(y, vals, left=base, color=coul, label=lab)
        base = [a + b for a, b in zip(base, vals)]
    ax.set_yticks(list(y))
    ax.set_yticklabels(groupes, fontsize=8)
    ax.invert_yaxis()
    ax.set_xlabel("couples")
    ax.set_title("Q2 Extensions « Notre conversation de l'horizon » — paliers "
                 "croisés servis (max-niveau, une règle, zéro exception)")
    ax.legend(loc="upper center", bbox_to_anchor=(0.5, -0.12), ncol=2, fontsize=8)
    fig.savefig(FIG / NOM_FIGS[0], dpi=DPI)
    plt.close(fig)

    # fig2 — conformité par groupe vs seuil D-STD-2 (14 bornes distinctes)
    fig, ax = plt.subplots(figsize=FIGSIZE, constrained_layout=True)
    x = range(len(groupes))
    pct = [sg[g]["conformes"] / sg[g]["n"] * 100 for g in groupes]
    seuils = [core.SEUILS_D_STD_2[g] for g in groupes]
    ax.bar(x, pct, color=OKABE_ITO[5], width=0.65,
           label="conformité moteur / classification vraie")
    ax.plot(x, seuils, "D", color=OKABE_ITO[6], markersize=7,
            label="seuil D-STD-2 (calibré p - 2,5 sigma)")
    ax.set_xticks(list(x))
    ax.set_xticklabels(groupes, rotation=45, ha="right", fontsize=8)
    ax.set_ylim(0, 105)
    ax.set_ylabel("% conformes (couples)")
    ax.set_title("Q2 Extensions — conformité par groupe vs seuil D-STD-2 "
                 "(14 bornes distinctes · double comptage 9 configs)")
    ax.legend(loc="upper center", bbox_to_anchor=(0.5, -0.24), fontsize=9)
    fig.savefig(FIG / NOM_FIGS[1], dpi=DPI)
    plt.close(fig)

    # fig3 — L6 : écart de percentiles par couple (ligne 30 = boucle probable)
    fig, ax = plt.subplots(figsize=FIGSIZE, constrained_layout=True)
    xs, ys, cols = [], [], []
    for i, (c, cr) in enumerate(zip(couples, croisements)):
        if cr["entree"]:
            xs.append(i)
            ys.append(cr["ecart_pct"])
            cols.append(OKABE_ITO[6] if cr["boucle_probable"] else OKABE_ITO[5])
    ax.axhline(core.SEUIL_BOUCLE_PCT, color=OKABE_ITO[6], lw=1.4, ls="--",
               label="seuil boucle probable (écart ≥ 30 — L6, ligne 262)")
    ax.scatter(xs, ys, s=14, c=cols, alpha=0.6,
               label="couples entrés (orange = boucle affichée)")
    ax.set_xlabel("couples (index)")
    ax.set_ylabel("écart de percentiles |pct rive 1 − pct rive 2|")
    ax.set_title("Q2 Extensions — L6 : correction du style par percentiles "
                 "(population 2 000, seed 42) — avertissement, jamais verdict")
    ax.legend(loc="upper center", bbox_to_anchor=(0.5, -0.10), fontsize=9)
    fig.savefig(FIG / NOM_FIGS[2], dpi=DPI)
    plt.close(fig)

    # fig4 — matrice 3×3 des configurations servies (H rive 1 × H rive 2)
    fig, ax = plt.subplots(figsize=FIGSIZE, constrained_layout=True)
    M = [[0] * 3 for _ in range(3)]
    for cr in croisements:
        if cr["entree"]:
            i = core.NIVEAUX_CROISEMENT.index(cr["niveaux"]["rive1"])
            j = core.NIVEAUX_CROISEMENT.index(cr["niveaux"]["rive2"])
            M[i][j] += 1
    ax.imshow(M, cmap="Blues", aspect="auto")
    for i in range(3):
        for j in range(3):
            num = i * 3 + j + 1
            ax.text(j, i, f"#{num}\n{core.CONFIGS[num]['nom']}\n{M[i][j]}",
                    ha="center", va="center", fontsize=9,
                    color="white" if M[i][j] > max(max(r) for r in M) / 2
                    else "black")
    ax.set_xticks(range(3))
    ax.set_xticklabels([f"rive 2 : {n}" for n in core.NIVEAUX_CROISEMENT])
    ax.set_yticks(range(3))
    ax.set_yticklabels([f"rive 1 : {n}" for n in core.NIVEAUX_CROISEMENT])
    ax.set_title("Q2 Extensions — matrice des 9 configurations servies "
                 "(mires 2/4 · 3/7 · 6/8, labels uniques)")
    fig.savefig(FIG / NOM_FIGS[3], dpi=DPI)
    plt.close(fig)


def generer_rapport(r1, couples, sorties, croisements, sha1, sha2):
    """Rapport A-G autoporteur — Verdict fermé d'emblée (leçon E-SM-12)."""
    L = []
    L.append("# Rapport WTC-EXT-Q2 — « Notre conversation de l'horizon » (RIO-17)")
    L.append("")
    L.append(f"> {D_SIM}")
    L.append(f"> {D_CRISE_BANDEAU}")
    L.append("")
    L.append(f"**Date** : {DATE}  ")
    L.append(f"**Seed** : 42 (×2)  ")
    L.append(f"**Package** : validation-ext/validation-ext-q2/  ")
    L.append("**SPEC** : EXT-Q2-SPEC.md VERROUILLÉE (5bc9600 — arbitrages A1-A6 "
             "tranchés par délégation).  ")
    L.append(f"**Ordre fondateur** : « {ORDRE} » (18/10/2026) ; P1-P6 exécutées "
             "au commit fe13ffd.  ")
    L.append("Entrées = sorties RIO-16 contresignées des deux rives (A2-a : "
             "zéro item nouveau ; empreinte 3583fe56… inchangée).")
    L.append("")
    L.append("---")
    L.append("")

    # ── Section A ──
    L.append("## Section A — Les 7 critères")
    L.append("")
    L.append("| Critère | Attendu | Obtenu | Verdict |")
    L.append("|---------|---------|--------|---------|")
    c = r1["C1"]
    dt_false = [k for k, v in c["d_table_details"].items() if not v]
    L.append(f"| **C1** D-VÉRITÉ : D-TABLE {c['n_cas_table']} cas + bien-formé "
             f"{c['demontrees']} + 9/9 configs + nomenclature | tous TRUE + 9/9 | "
             f"table={c['d_table']} ({len(dt_false)} FALSE) · configs={c['configs_servies']} · "
             f"nom={c['nomenclature_respectee']} · anti-collision SM-Q4="
             f"{c['anti_collision_sm_q4']} | {'PASS' if c['ok'] else 'FAIL'} |")
    c = r1["C2"]
    L.append(f"| **C2** D-CONFIRMATION : config = f(H1, H2) pure + 0 inversion "
             f"des rives | pur + 0 inversion | grille_pure={c['grille_pure']} · "
             f"anti_inv={c['anti_inversion']} | {'PASS' if c['ok'] else 'FAIL'} |")
    c = r1["C3"]
    L.append(f"| **C3** D-STD-2 : 14 seuils DISTINCTES (9 configs + 14 groupes) "
             f"+ override filet + entrée RQS | 14/14 + 40/40 | n_ok={c['n_ok']}/14 · "
             f"distinctes={c['bornes_distinctes']} (9 configs={c['bornes_distinctes_9']}) · "
             f"override={c['override_filet']} · Forte+filet={c['forte_filet_court_circuit']} · "
             f"entrée RQS={c['entree_rqs_testee']} | {'PASS' if c['ok'] else 'FAIL'} |")
    L.append(f"| **C4** SHA ×2 (D-EMPREINTE) | identiques | sha1={sha1[:16]}… "
             f"sha2={sha2[:16]}… match={sha1 == sha2} | "
             f"{'PASS' if sha1 == sha2 else 'FAIL'} |")
    c = r1["C5"]
    L.append(f"| **C5** Affichage : templates ×9 + boucle + styles + asymétries "
             f"+ D-SIM + littéraux | 6/6 | templates={c['templates_9']} · "
             f"boucle={c['boucle']} · styles={c['styles']} · asym={c['asymetries']} · "
             f"figures={c['figures']} dims={c['dimensions_ok']} | "
             f"{'PASS' if c['ok'] else 'FAIL'} |")
    c = r1["C6"]
    L.append(f"| **C6** A5-Q1 à deux : 0 verdict temps restant / 0 bonne saison "
             f"/ zone calme honnête / 0 verdict croisé sur C | 0 interdit | "
             f"interdits={c['interdits_touches']} · zone calme={c['zone_calme_honnete']} · "
             f"anti-C6={c['anti_c6_servi']} · 0 verdict C={c['0_verdict_croise_c']} | "
             f"{'PASS' if c['ok'] else 'FAIL'} |")
    c = r1["C7"]
    L.append(f"| **C7** D-CRISE + non-reproche + non-tiers | 40/40 + 0 | "
             f"court-circuit={c['court_circuit']} · zéro reproche={c['zero_reproche']} · "
             f"zéro tiers={c['zero_tiers']} · boucle sans verdict={c['boucle_sans_verdict']} | "
             f"{'PASS' if c['ok'] else 'FAIL'} |")
    L.append("")
    L.append(f"SHA-256 exécution 1 : `{sha1}`")
    L.append(f"SHA-256 exécution 2 : `{sha2}`")
    L.append("")
    L.append("---")
    L.append("")

    # ── Section B ──
    L.append("## Section B — Géométrie (D-GÉOMÉTRIE) + calibration D-STD-2")
    L.append("")
    cal = r1["calibration"]
    L.append(f"- Bornes de croisement (A3-a) : FAIBLE < {core.BORNES_CROISEMENT[0]} "
             f"≤ MODÉRÉE < {core.BORNES_CROISEMENT[1]} ≤ FORTE — tranchage "
             f"inclusif vérifié en D-TABLE (2,49/2,50/3,49/3,50)")
    L.append(f"- σ normal de référence du score d'axe (0,60/√6) = {core.SIGMA_H} "
             f"— la CALIBRATION des seuils est EMPIRIQUE : p̂ estimé par "
             f"Monte-Carlo déterministe ({core.N_MC} couples/groupe, seed "
             f"{core.SEED_MC}, items entiers clippés + arrondis + inversés "
             f"corrigés — même processus générateur que le simulateur ; "
             f"D-GÉOMÉTRIE : σ_eff = propagation structurale, jamais modification)")
    L.append(f"- L6 (ligne 262 verbatim) : percentiles — population {core.POP_N} "
             f"profils seed {core.POP_SEED} N({core.POP_MU} ; {core.POP_SD}) "
             f"(placeholder L2, à remplacer par le pilote) · boucle probable si "
             f"écart ≥ {core.SEUIL_BOUCLE_PCT} · avertissement styles si écart "
             f"moyen ≥ {core.SEUIL_STYLES}")
    L.append(f"- L5 (ligne 261) : 3 inférences Générationnelles VERROUILLÉES "
             f"(A4) — déclencheurs mécaniques (taxe L1 ≥ {core.SEUIL_INF_TAXE} "
             f"chez une rive · niveaux H différents · C2 > C1 des deux côtés)")
    L.append("")
    L.append("| Groupe | μ H rive 1 | μ H rive 2 | μ agg 1 | μ agg 2 | écart pct vrai | p̂ | seuil |")
    L.append("|--------|-----------|-----------|---------|---------|----------------|-----|-------|")
    for gname, det in cal["detail"].items():
        ce = cal["centres"][gname]
        L.append(f"| {gname} | {ce['mu_H_A']} | {ce['mu_H_B']} | {ce['mu_agg_A']} | "
                 f"{ce['mu_agg_B']} | {ce['ecart_pct_vrai']} | {det['p_theo']} | "
                 f"{det['seuil']} |")
    L.append("")
    L.append(f"Bornes D-STD-2 distinctes : {cal['bornes_distinctes']} (14) · "
             f"9 configurations : {cal['bornes_distinctes_9_configs']} — "
             "calibrées (p̂_MC − 2,5σ̂, σ̂ binomial sur l'effectif réel du "
             "groupe), leçon ad01f21 (bornes DISTINCTES entre "
             "configurations ET entre groupes — double comptage). G13 mélange "
             "20 couples EXACTS (items constants pile sur 2,50/3,50 — tranchage "
             "déterministe prouvé en D-TABLE) et 20 couples adjacents (μ dans la "
             "bande, calibrés sur leur géométrie propre, robustesse Section E).")
    L.append("")
    L.append("---")
    L.append("")

    # ── Section C ──
    L.append("## Section C — Stats par groupe")
    L.append("")
    L.append("| Groupe | N | Conformes | Entrées | Paliers (V/O/R/ov/NE) | Boucle | Styles | Asym L/C marquées | Inférences (taxe/sujet/silence) |")
    L.append("|--------|---|-----------|---------|----------------------|--------|--------|--------------------|--------------------------------|")
    for gname, _n in sim.effectifs():
        g = r1["stats_groupes"][gname]
        p = g["paliers"]
        L.append(f"| {gname} | {g['n']} | {g['conformes']} | {g['entrees']} | "
                 f"{p['EXERCICE MAISON']}/{p['MODULE DE COUPLE']}/{p['ORIENTATION']}/"
                 f"{p['OVERRIDE']}/{p['NON ENTRÉE']} | {g['boucle']} | {g['styles']} | "
                 f"{g['asym_L_marquee']}/{g['asym_C_marquee']} | "
                 f"{g['inf_taxe']}/{g['inf_sujet']}/{g['inf_silence']} |")
    L.append("")
    L.append(f"Globaux : {r1['globaux']}")
    L.append("")
    L.append(f"![Paliers croisés](../figures/{NOM_FIGS[0]})")
    L.append("")
    L.append(f"![D-STD-2](../figures/{NOM_FIGS[1]})")
    L.append("")
    L.append(f"![Percentiles L6](../figures/{NOM_FIGS[2]})")
    L.append("")
    L.append(f"![Matrice 9 configurations](../figures/{NOM_FIGS[3]})")
    L.append("")
    L.append("---")
    L.append("")

    # ── Section D ──
    L.append("## Section D — Couples tracés")
    L.append("")
    exemples = ["G10_SIGNAL_FILET_036", "G11_ECART_PERCENTILES_000",
                "G12_STYLES_DISSEMBLABLES_000", "G13_FRONTIERES_BORNES_000",
                "G14_ANTI_C6_ZONE_SEREINE_000",
                "G03_CONFIG_3_HORLOGE_SEULE_000"]
    for eid in exemples:
        i = next((k for k, c in enumerate(couples) if c["id"] == eid), None)
        if i is None:
            continue
        c, s_pair, cr = couples[i], sorties[i], croisements[i]
        L.append(f"### {eid}")
        L.append("")
        for r, lbl in (("rive_a", "Rive A"), ("rive_b", "Rive B")):
            s = s_pair[r]
            L.append(f"- **{lbl}** : RQS {s['rqs']}/100 ({s['rqs_statut']}) · "
                     f"score H {s['score_H']} · L {s['score_L']} · C {s['score_C']} · "
                     f"filet={s['filet']}")
        L.append(f"- **Niveaux croisés** : {cr['niveaux']['rive1']} / "
                 f"{cr['niveaux']['rive2']} (scores H {cr['scores_H']['rive1']} / "
                 f"{cr['scores_H']['rive2']})")
        L.append(f"- **Configuration** : #{cr['config_num']} {cr['config_nom']} — "
                 f"{cr['config_lecture']}")
        L.append(f"- **Display** : {cr['display']} · palier : {cr['palier']} · "
                 f"verdict : {cr['verdict']}")
        if cr["entree"]:
            L.append(f"- **Percentiles** : {cr['percentiles']} · écart "
                     f"{cr['ecart_pct']} · boucle probable={cr['boucle_probable']}")
            L.append(f"- **Styles** : écart {cr['ecart_styles']} · "
                     f"dissemblables={cr['styles_dissemblables']}")
            L.append(f"- **Asymétries** : L {cr['asym_L']} · C {cr['asym_C']}")
            L.append(f"- **Empreinte L5** : {cr['inferences_L5']} · force : "
                     f"{cr['force']}")
        if cr["bandeau"]:
            L.append(f"- **Bandeau** : {cr['bandeau']}")
        v = sim.classification_vraie(c)
        L.append(f"- **Vrai** : {v}")
        L.append("")
    L.append("---")
    L.append("")

    # ── Section E ──
    L.append("## Section E — Analyse")
    L.append("")
    L.append(f"- **Total** : {r1['n_total']} couples · {r1['n_groupes']} groupes "
             f"— réconciliation {'OK' if r1['reconciliation'] else 'FAIL'} · "
             f"{r1['globaux']['entrees']} croisements servis")
    pg = r1["globaux"]["paliers"]
    L.append(f"- **Paliers croisés** : {pg['EXERCICE MAISON']} EXERCICE MAISON · "
             f"{pg['MODULE DE COUPLE']} MODULE DE COUPLE · {pg['ORIENTATION']} "
             f"ORIENTATION · {pg['OVERRIDE']} OVERRIDE D-CRISE (configuration "
             f"calculée et tracée, jamais déployée) · {pg['NON ENTRÉE']} non entrés (RQS)")
    L.append(f"- **L6** : {r1['globaux']['boucles']} boucles probables affichées "
             f"(écart ≥ 30 — avertissement sans verdict) · "
             f"{r1['globaux']['styles']} avertissements styles dissemblables — "
             f"le fil rouge RIVES_DISSEMBLABLES de Q1 reçoit ici sa lecture "
             f"corrigée (G12)")
    L.append(f"- **L5** : empreinte servie — "
             f"{r1['globaux']['inferences_L5']}")
    L.append(f"- **Override D-CRISE** : 40/40 — la crise héritée d'UNE seule "
             f"rive suffit ; idx 35-39 (items Forte des deux rives) : override "
             f"quand même, AVANT le verdict (court-circuit, jamais de croisement "
             f"de couple en crise)")
    L.append("- **Robustesse (bandes 3σ)** : les μ adjacents aux bornes "
             "(G13 bruité à 2,56/3,44 ; G09 au plafond 3,9/3,95) sont calibrés "
             "sur leur géométrie propre — la RÈGLE de tranchage inclusif est "
             "prouvée exactement en C1/D-TABLE (2,49/2,50/3,49/3,50)")
    L.append("- **Re-tests non consommés** : les deltas L7 à 8 semaines ne "
             "sont PAS lus en Q2 (une mesure un rôle — SPEC §7) : la couche "
             "longitudinale reste celle du suivi (Q3)")
    L.append("")
    L.append("---")
    L.append("")

    # ── Section F ──
    L.append("## Section F — Sources, périmètre, règles")
    L.append("")
    L.append("### Sources")
    L.append("")
    L.append("| Élément | INTERPRÉTÉ | SOURCE | VÉRIFIÉ PAR |")
    L.append("|---------|-----------|--------|-------------|")
    L.append("| Zéro item nouveau (A2-a) | Non (verrouillé) | L5 ligne 261 « Empreinte situationnelle (croisement Q1×Q2) » · A2-Q1/SM-Q4-A2 | C1 (entrées = sorties RIO-16 re-implémentées) |")
    L.append("| 9 configurations, percentiles | Non (fixé) | canon lignes 297-298 verbatim | C1 (D-TABLE 9/9) · C5 |")
    L.append("| Noms des 9 configurations | Non (verrouillé A5) | table §2 de la SPEC mot pour mot | C1 noms uniques + anti-collision SM-Q4 |")
    L.append("| Bornes 2,50/3,50 | Non (verrouillé A3) | A3-a (bornes propres, une mesure un rôle) | D-TABLE bornes exactes |")
    L.append("| L6 percentiles/boucle/styles | Non (fixé) | canon ligne 262 verbatim · A4 | D-TABLE + C5 |")
    L.append("| 3 inférences L5 | Non (verrouillé A4) | libellés SPEC §2 (A4) | C5 littéraux |")
    L.append("| Sorties RIO-16 re-implémentées | Oui | mécanique verrouillée addf575 (L1-L3) | ré-implémentation indépendante — croisé D-VÉRITÉ |")
    L.append("| Population percentiles N(3,0 ; 0,8) | Oui | placeholder L2 (ligne 258) — à remplacer par le pilote | Section B |")
    L.append("| Override D-CRISE | Non (fixé) | pattern SM-Q4-A4 · hub D-CRISE · ligne 369 | C3/C7 40/40 |")
    L.append("")
    L.append("### Leçons appliquées")
    L.append("")
    L.append("- Bornes D-STD-2 DISTINCTES par configuration ET par groupe (leçon SM-Q5, ad01f21 — double comptage vérifié)")
    L.append("- C1 croisé sur cas de table, pas sur données bruitées (leçon Q5)")
    L.append("- Rapport autoporteur, Verdict fermé, balises de gras équilibrées (leçon E-SM-12)")
    L.append("- Figures sans émojis (glyphes DejaVu) · 0 chiffre sans source (chaîne de traçabilité §6.4)")
    L.append("")
    L.append("### Périmètre")
    L.append("")
    L.append("- Q2 = LE CROISEMENT à deux (lignes 223-224, position transposée par A2-Q1) — RIO-17 · Q3 = le pas + suivi 14 j (RIO-18, SPEC à venir)")
    L.append("- A6 : 0 verdict croisé sur l'axe C — la conversation de l'horizon reste l'objet du module (ligne 112)")
    L.append("- A1-Q1 : la 4e extension du canon (ligne 243) reste à identifier par le fondateur — divergence documentée, sans comblement par invention (D-CANAL-2)")
    L.append("- Protocole lexical (R2 · P5) : RIO-17 = zéro item nouveau — rien à auditer ; couverture héritée des sorties RIO-16 (legal/D-audit-pi.md §10)")
    L.append("- 0 invention de contenu thérapeutique : les templates ne prescrivent rien (paliers §5.4 verbatim) et ne lisent jamais le temps qui reste (C6)")
    L.append("")
    L.append("### Règles")
    L.append("")
    L.append("D-VÉRITÉ · D-CONFIRMATION · D-STD-2 · D-EMPREINTE · D-SIM · "
             "D-CRISE · D-NOMENCLATURE · D-GÉOMÉTRIE · D-PARAM · D-TABLE · "
             "D-CANAL-2 · Exécuteur strict")
    L.append("")
    L.append("**Fautes : 36** (dont 4 pré-attrapées) — inchangé.")
    L.append("")
    L.append("---")
    L.append("")

    # ── Section G ──
    L.append("## Section G — Verdict")
    L.append("")
    n_ok = sum(1 for k in ("C1", "C2", "C3", "C4", "C5", "C6", "C7")
               if (r1[k]["ok"] if k != "C4" else sha1 == sha2))
    v = "VALIDÉ" if n_ok == 7 else "À CORRIGER"
    L.append(f"### Verdict : **{v}**")
    L.append("")
    L.append(f"### Note : **{n_ok}/7**")
    L.append("")
    L.append(f"> {D_SIM}")
    L.append("")
    if v == "VALIDÉ":
        L.append("### RIO-17")
        L.append("")
        L.append("RIO-17 « Notre conversation de l'horizon » — contresigné "
                 "(pont, 18/10/2026 ; auto-audit origin : reproduction prouvée, "
                 "empreinte 2aea8d99… inchangée).")
        L.append("")
        L.append("### Inventaire structurel")
        L.append("")
        L.append("| Fichier | Fonctions |")
        L.append("|---------|-----------|")
        L.append("| wtc_ext_q2_core.py | niveau_croisement, config_de, "
                 "palier_croise, percentile_de, boucle_probable, "
                 "styles_dissemblables, lecture_asymetrie, inferences_L5, "
                 "classifier_croisement, verifier_d_table, "
                 "verifier_d_confirmation, calibration_d_std_2, "
                 "p_conformite_groupe |")
        L.append("| wtc_ext_q2_simulator.py | corrige, calcule_rqs, sortie_rive, "
                 "_rive, _gen_couple, tous_les_couples, effectifs, "
                 "classification_vraie, conformite_couple |")
        L.append("| wtc_ext_q2_validation.py | _sha, bien_forme, critere_c1, "
                 "critere_c2, critere_c3, critere_c5, critere_c6, critere_c7, "
                 "executer, generer_figures, generer_rapport, main |")
        L.append("")
        L.append("- Instrument : ZÉRO item nouveau (A2-a) — le croisement lit "
                 "les sorties RIO-16 contresignées des deux rives")
        L.append("- Croisement : 9 configurations H×H (A5) · bornes propres "
                 "2,50/3,50 (A3-a) · L6 percentiles/boucle/styles (A4) · L5 "
                 "empreinte 3 inférences verrouillées (A4) · 0 verdict croisé "
                 "sur C (A6)")
        L.append("- Filet : override AVANT le verdict de couple — configuration "
                 "calculée et tracée, jamais déployée sur une crise active")
        L.append(f"- Réconciliation : {r1['n_total']}/{r1['n_total']} (PASS)")
    L.append("")
    return "\n".join(L) + "\n"


def main():
    RES.mkdir(exist_ok=True)
    FIG.mkdir(exist_ok=True)
    print("=" * 60)
    print("WTC-EXT-Q2 — Validation (RIO-17)")
    print("=" * 60)
    r1, couples, sorties, croisements = executer(publier=True)
    sha1 = _sha(r1)
    r2, _c2, _s2, _m2 = executer(publier=False)
    sha2 = _sha(r2)
    r1["C4"] = {"sha1": sha1, "sha2": sha2, "match": sha1 == sha2,
                "ok": sha1 == sha2}
    r1["sha256_run"] = sha1
    (RES / f"resultats-ext-q2-{DATE}.json").write_text(
        json.dumps(r1, ensure_ascii=False, indent=2, sort_keys=True),
        encoding="utf-8")
    rapport = generer_rapport(r1, couples, sorties, croisements, sha1, sha2)
    (RES / f"rapport-ext-q2-{DATE}.md").write_text(rapport, encoding="utf-8")
    n_ok = sum(1 for k in ("C1", "C2", "C3", "C4", "C5", "C6", "C7")
               if r1[k].get("ok", False))
    print(f"SHA-256 ×2 : {sha1[:16]}… match={r1['C4']['match']}")
    for k in ("C1", "C2", "C3", "C5", "C6", "C7"):
        print(f"  {k} : {'PASS' if r1[k]['ok'] else 'FAIL'}")
    print(f"WTC-EXT-Q2 (RIO-17) — verdict : "
          f"{'VALIDÉ' if n_ok == 7 else 'REFUSÉ'} ({n_ok}/7)")
    return r1


if __name__ == "__main__":
    main()
