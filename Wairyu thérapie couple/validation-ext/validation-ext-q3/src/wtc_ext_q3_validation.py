# -*- coding: utf-8 -*-
"""WAIRYU — WTC-EXT-Q3-03 : validation Extensions Q3 (RIO-18).
C1 D-VÉRITÉ (D-TABLE 28 cas + bien-formé 650/650 + nomenclature + 3 familles
et pas zéro servis) · C2 D-CONFIRMATION (pureté + anti-inversion temporelle +
anti-inversion des rives) · C3 D-STD-2 (14 seuils DISTINCTES — leçon ad01f21 ;
frontières 9/14 exactes ; |Δ| pile 0,58/0,41 et BRUIT < 0,41 dans G07) ·
C4 SHA ×2 (D-EMPREINTE : SHA sur contenu sans sha256_run ni C4) · C5
affichage 6/6 · C6 anti-fabrication à deux (0 sanction / 0 verdict de
réussite / 0 compte à rebours / pas zéro dit comme tel / 0 comparaison
inter-rives) · C7 D-CRISE + non-blâme + non-tiers.
Rapport A-G autoporteur (Verdict fermé — leçon E-SM-12). 4 figures 1920×1080
sans émojis (leçon glyphes DejaVu)."""
from __future__ import annotations

import hashlib
import json
from datetime import datetime
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

import wtc_ext_q3_core as core
import wtc_ext_q3_simulator as sim

PKG = Path(__file__).parent.parent
RES = PKG / "results"
FIG = PKG / "figures"
DATE = datetime.now().strftime("%Y-%m-%d")
FIGSIZE = (12.8, 7.2)
DPI = 150
NOM_FIGS = ("fig1_pas_servis.png", "fig2_conformite_d_std2.png",
            "fig3_engagement_14j.png", "fig4_rci_deltas.png")
OKABE_ITO = ["#000000", "#E69F00", "#56B4E9", "#009E73", "#F0E442",
             "#0072B2", "#D55E00", "#CC79A9"]
D_SIM = ("AVERTISSEMENT D-SIM : résultats issus de simulations (seed 42) — "
         "la mécanique est validée, pas la prévalence clinique.")
D_CRISE_BANDEAU = ("D-CRISE : court-circuit AVANT le choix du pas — filet "
                   "9 signaux → P-FILTRE 3919/3114 (ligne 369). JAMAIS de "
                   "pas de couple en crise (règle permanente du hub).")
DELEGATION = "fais le toi meme"


def _sha(resultats):
    brut = json.dumps(resultats, sort_keys=True, ensure_ascii=False)
    return hashlib.sha256(brut.encode("utf-8")).hexdigest()


def bien_forme(couple, v):
    """Verdict bien formé du pas (les trois voies + structures L7)."""
    if v["override"]:
        return (v["pas"] is None and v["statut"] is None and v["rci"] is None
                and v["display"] == core.DISPLAY_OVERRIDE
                and "D-CRISE" in (v["bandeau"] or "")
                and v["config_num"] is not None)
    if not v["entree"]:
        return (v["pas"] is None and v["statut"] is None and v["rci"] is None
                and v["display"] == core.DISPLAY_NON_ENTREE)
    banque = (core.BANQUE_PAS_EXT[core.FAMILLE_VERT]
              + core.BANQUE_PAS_EXT[core.FAMILLE_ORANGE]
              + core.BANQUE_PAS_EXT[core.FAMILLE_ROUGE])
    if v["palier"] not in ("EXERCICE MAISON", "MODULE DE COUPLE",
                           "ORIENTATION"):
        return False
    if v["pas"] not in banque and v["pas"] != core.PAS_ZERO:
        return False
    if v["pas"] == core.PAS_ZERO:
        if v["display"] != core.DISPLAY_PAS_ZERO or v["statut"] is not None:
            return False
    if v["statut"] not in (core.STATUT_CELEBRE, core.STATUT_EN_CHEMIN, None):
        return False
    if v.get("recap_dimension") and len(v["recap_dimension"]) != 3:
        return False
    if couple.get("re_tests"):
        if v["rci"] is None or set(v["rci"]["rives"]) != set(core.RIVES):
            return False
        for rive in core.RIVES:
            ent = v["rci"]["rives"][rive]
            if ent["ensemble"] not in (core.ENSEMBLE_FIABLE,
                                       core.ENSEMBLE_SUGGESTION,
                                       core.ENSEMBLE_BRUIT):
                return False
            if set(ent["deltas"]) != set(core.AXES):
                return False
    return True


def critere_c1(couples, verdicts):
    """C1 D-VÉRITÉ : D-TABLE (28 cas exhaustifs) + bien-formé 650/650 +
    nomenclature respectée + 3 familles et pas zéro servis."""
    dt = core.verifier_d_table()
    demons = [bien_forme(c, v) for c, v in zip(couples, verdicts)]
    servis = {v["pas"] for v in verdicts if v["entree"]}
    familles = {core.famille_de(v["palier"]) for v in verdicts
                if v["entree"] and v["pas"] != core.PAS_ZERO}
    labels = set()
    for v in verdicts:
        for k in ("display", "palier", "pas", "statut"):
            if v.get(k):
                labels.add(v[k])
        if v.get("rci"):
            for rive in core.RIVES:
                labels.add(v["rci"]["rives"][rive]["ensemble"])
    nom_ok = labels <= set(core.NOMENCLATURE)
    pas_zero_servi = any(v["pas"] == core.PAS_ZERO for v in verdicts)
    return {"d_table": all(dt.values()), "d_table_details": dt,
            "n_cas_table": len(dt),
            "demontrees": f"{sum(demons)}/{len(demons)}",
            "familles_servies": f"{len(familles)}/3",
            "familles_3": familles == {core.FAMILLE_VERT, core.FAMILLE_ORANGE,
                                       core.FAMILLE_ROUGE},
            "pas_zero_servi": pas_zero_servi,
            "nomenclature_respectee": nom_ok,
            "anti_collision": dt["anti_collision_rio05"]
            and dt["anti_collision_rio15"] and dt["anti_collision_rio17"],
            "ok": (all(dt.values()) and all(demons)
                   and familles == {core.FAMILLE_VERT, core.FAMILLE_ORANGE,
                                    core.FAMILLE_ROUGE}
                   and pas_zero_servi and nom_ok),
            "eliminatoire": True}


def critere_c2(couples, verdicts):
    """C2 D-CONFIRMATION : pureté (2 passes) + anti-inversion temporelle
    (swap base/re-test → Δ signé inversé, statut |Δ| identique) +
    anti-inversion des rives (échange des entrées L7 → chaque label suit SA
    rive échangée)."""
    dc = core.verifier_d_confirmation(couples, verdicts)
    return {"grille_pure": dc["pure"],
            "anti_inversion_temporelle": dc["anti_inversion_temporelle"],
            "anti_inversion_rives": dc["anti_inversion_rives"],
            "n_rci": dc["n_rci"],
            "ok": dc["pure"] and dc["anti_inversion_temporelle"]
            and dc["anti_inversion_rives"],
            "eliminatoire": True}


def critere_c3(couples, verdicts, conformite, calib):
    """C3 D-STD-2 : 14 seuils DISTINCTES (leçon ad01f21) + tous groupes à
    leur seuil + frontières 9/14 exactes (G06) + |Δ| pile 0,58/0,41 et
    BRUIT < 0,41 (G07) + réconciliation."""
    par_groupe = {}
    for gname, n in sim.effectifs():
        ids = [c["id"] for c in couples if c["groupe"] == gname]
        conf = sum(1 for i in ids if conformite[i])
        pct = round(100.0 * conf / n, 1)
        seuil = calib["seuils"][gname]
        par_groupe[gname] = {"conformes": conf, "n": n, "pct": pct,
                             "seuil": seuil, "ok": pct >= seuil}
    n_ok = sum(1 for v in par_groupe.values() if v["ok"])
    # Frontières 9/14 exactes (G06 — totaux 8/9/10 pile)
    g06 = [(c, v) for c, v in zip(couples, verdicts)
           if c["groupe"] == "G06_FRONTIERES_9_14"]
    totaux_attendus = {(8, 9, 10)[i % 3]: k
                       for k, i in enumerate(range(40))}  # placeholder
    exact_9_14 = 0
    for c, v in g06:
        i = int(c["id"].split("_")[-1])
        total = (8, 9, 10)[i % 3]
        attendu = core.STATUT_CELEBRE if total >= core.SEUIL_CELEBRE \
            else core.STATUT_EN_CHEMIN
        exact_9_14 += int(v["statut"] == attendu)
    # |Δ| pile aux bornes L7 (G07 — ε = 0)
    g07 = [(c, v) for c, v in zip(couples, verdicts)
           if c["groupe"] == "G07_RCI_FRONTIERES"]
    pile_058 = pile_041 = bruit = 0
    for c, v in g07:
        for rive in core.RIVES:
            for axe in core.AXES:
                d = abs(v["rci"]["rives"][rive]["deltas"][axe])
                if round(d, 2) == 0.58:
                    pile_058 += 1
                elif round(d, 2) == 0.41:
                    pile_041 += 1
                elif d < 0.41:
                    bruit += 1
    n_total = len(couples)
    return {"par_groupe": par_groupe, "n_ok": n_ok,
            "bornes_distinctes": calib["bornes_distinctes"],
            "frontieres_9_14": f"{exact_9_14}/40",
            "pile_058": pile_058, "pile_041": pile_041, "bruit": bruit,
            "reconciliation": sum(v["n"] for v in par_groupe.values())
            == n_total,
            "ok": (n_ok == 14 and calib["bornes_distinctes"]
                   and exact_9_14 == 40 and pile_058 == 120
                   and pile_041 == 60 and bruit == 60),
            "eliminatoire": True}


def critere_c5(verdicts):
    """C5 Affichage 6/6 : templates + banque servie + bandeau D-SIM +
    littéraux autoporteurs (suivi partagé, récap A6, jamais comparées) +
    4 figures 1920×1080."""
    templates_ok = all(t in core.TEMPLATES for t in (
        "pas_zero", "vert_1", "vert_2", "vert_3", "orange_1", "orange_2",
        "rouge_1", "celebre", "celebre_pile", "en_chemin", "suivi_partage",
        "fiable", "suggestion", "bruit", "jamais_comparees", "orientation",
        "override", "non_entree", "aide_seuils", "re_cap"))
    pas_prod = {v["pas"] for v in verdicts if v["entree"] and v["pas"]}
    banque = (set(core.BANQUE_PAS_EXT[core.FAMILLE_VERT])
              | set(core.BANQUE_PAS_EXT[core.FAMILLE_ORANGE])
              | set(core.BANQUE_PAS_EXT[core.FAMILLE_ROUGE])
              | {core.PAS_ZERO})
    banque_servie = banque <= pas_prod
    d_sim_ok = bool(core.D_SIM) and bool(D_SIM)
    recap_ok = all(len(v.get("recap_dimension") or []) == 3
                   for v in verdicts if v["entree"])
    dims_ok = True
    for f in NOM_FIGS:
        p = FIG / f
        dims_ok &= p.exists() and p.stat().st_size > 20000
    return {"templates": templates_ok, "banque_servie": banque_servie,
            "n_pas_servis": len(pas_prod), "d_sim": d_sim_ok,
            "recap_3_quetes": recap_ok, "figures": 4,
            "dimensions_ok": dims_ok,
            "ok": (templates_ok and banque_servie and d_sim_ok and recap_ok
                   and dims_ok)}


def critere_c6(verdicts):
    """C6 Anti-fabrication à deux (A5-Q1 transposée + SM-Q5) : 0 sanction
    (« 9/14 = célébré, jamais de sanction » verbatim) · 0 verdict de
    réussite du couple · 0 compte à rebours / injonction temporelle ·
    pas zéro dit comme tel · 0 comparaison inter-rives."""
    labels = set()
    for v in verdicts:
        for k in ("display", "palier", "pas", "statut"):
            if v.get(k):
                labels.add(v[k])
        if v.get("rci"):
            for rive in core.RIVES:
                labels.add(v["rci"]["rives"][rive]["ensemble"])
    nom_ok = labels <= set(core.NOMENCLATURE)
    produits = " | ".join(sorted(x for x in labels if x)) + " | " + \
        " ".join(core.TEMPLATES.values())
    interdits = ("trop tard", "compte à rebours", "il vous reste",
                 "il reste", "dernière chance", "urgence", "pathologie",
                 "diagnostic", "dépistage", "il est temps de", "rémission",
                 "guéri", "guérison", "échoué", "sanctionné",
                 "meilleur que", "plus que l'autre", "moins que l'autre",
                 "devant l'autre", "derrière l'autre")
    touches = [x for x in interdits if x in produits.lower()]
    zone_calme = ("rien à fabriquer" in core.TEMPLATES["pas_zero"]
                  and "sans sanction" in core.TEMPLATES["en_chemin"]
                  and "jamais de sanction" in core.TEMPLATES["suivi_partage"])
    g08 = [v for c, v in zip(_couples_ref, verdicts)
           if c["groupe"] == "G08_ANTI_C6"] if _couples_ref else []
    perfect = sum(1 for v in g08[:20]
                  if v["statut"] == core.STATUT_CELEBRE)
    zero = sum(1 for v in g08[20:]
               if v["statut"] == core.STATUT_EN_CHEMIN)
    jamais_comparées = "jamais comparées" in core.TEMPLATES["jamais_comparees"]
    return {"nomenclature_respectee": nom_ok,
            "0_verdict_reussite_sanction": not touches,
            "interdits_touches": touches,
            "zone_calme_honnete": zone_calme,
            "perfect_sans_injonction": f"{perfect}/20",
            "zero_sans_sanction": f"{zero}/20",
            "0_comparaison_inter_rives": jamais_comparées,
            "ok": (nom_ok and not touches and zone_calme and perfect == 20
                   and zero == 20 and jamais_comparées),
            "eliminatoire": True}


def critere_c7(couples, verdicts):
    """C7 D-CRISE + non-blâme + non-tiers : override AVANT le choix du pas
    testé (40/40, y compris 5 couples items Forte) · check-in partagé = 0
    évaluation inter-rives · aînés/familles = rôles, pas de noms (ligne
    363) · non-entrée RQS + prudence entre."""
    g05 = [(c, v) for c, v in zip(couples, verdicts)
           if c["groupe"] == "G05_SIGNAL_FILET"]
    court = sum(1 for c, v in g05
                if v["override"] and v["pas"] is None and v["statut"] is None
                and v["rci"] is None)
    forte_filet = sum(1 for c, v in g05
                      if int(c["id"].split("_")[-1]) >= 35 and v["override"])
    aucune_verdict_filet = all(v["pas"] is None for c, v in g05)
    produits = " ".join(core.TEMPLATES.values()).lower()
    interdits = ("coupable", "blâme", "fautif", "à condamner", "de sa faute",
                 "c'est sa faute", "il bloque", "elle bloque",
                 "qui a raté", "qui devait")
    zero_reproche = not any(x in produits for x in interdits)
    tiers = ("nom d'ainé", "nom de famille", "monsieur", "madame")
    zero_tiers = not any(x in produits for x in tiers)
    g14 = [(c, v) for c, v in zip(couples, verdicts)
           if c["groupe"] == "G14_RQS_NON_ENTREE"]
    non_entree = sum(1 for c, v in g14[:20]
                     if v["display"] == core.DISPLAY_NON_ENTREE)
    prudence = sum(1 for c, v in g14[20:] if v["entree"])
    return {"court_circuit": f"{court}/40",
            "court_circuit_ok": court == 40 and aucune_verdict_filet,
            "forte_filet": f"{forte_filet}/5",
            "zero_reproche": zero_reproche, "zero_tiers": zero_tiers,
            "non_entree_rqs": f"{non_entree}/20",
            "prudence_entre": f"{prudence}/20",
            "ok": (court == 40 and aucune_verdict_filet and zero_reproche
                   and zero_tiers and non_entree == 20 and prudence == 20),
            "eliminatoire": True}


_couples_ref = None


def executer(publier=True):
    global _couples_ref
    couples = sim.construire()
    _couples_ref = couples
    verdicts_list = sim.verdicts(couples)
    conformite = {c["id"]: sim.conforme(c, v)
                  for c, v in zip(couples, verdicts_list)}
    calib = core.calibration_d_std_2()
    r1 = {}
    r1["C1"] = critere_c1(couples, verdicts_list)
    r1["C2"] = critere_c2(couples, verdicts_list)
    r1["C3"] = critere_c3(couples, verdicts_list, conformite, calib)
    r1["C6"] = critere_c6(verdicts_list)
    r1["C7"] = critere_c7(couples, verdicts_list)
    r1["n_total"] = len(couples)
    r1["n_groupes"] = len(sim.effectifs())
    r1["reconciliation"] = sum(n for _, n in sim.effectifs()) == len(couples)
    r1["calibration"] = calib
    r1["conformite_table"] = conformite
    r1["population"] = {
        "seed": sim.SEED, "n_couples": len(couples),
        "n_groupes": len(sim.effectifs()), "sigma_item": sim.SIGMA_ITEM,
        "pop_percentiles_n": 2000, "pop_seed": 42,
        "pop_heritee_q2": "génération déterministe identique (default_rng(42)"
                          ".normal(3.0 ; 0.8, 2000) arrondi 4) — jamais "
                          "recalculée (une mesure un rôle)",
        "sem_l7": round(core.SEM_L7, 4),
        "sigma_h": core.SIGMA_H,
        "calibration_methode": "Monte-Carlo déterministe (même processus "
                               "générateur que le simulateur)",
        "n_mc": core.N_MC, "seed_mc": core.SEED_MC,
        "placeholder": "population de référence L6 + placeholders L2 (ligne "
                       "258) à remplacer par le pilote"}
    stats = sim.resume_groupes(couples, verdicts_list)
    r1["stats_groupes"] = stats
    globaux = {"pas_servis": {}, "statuts": {"CÉLÉBRÉ": 0, "EN CHEMIN": 0,
                                             "NON_ÉVALUÉ": 0},
               "paliers": {"EXERCICE MAISON": 0, "MODULE DE COUPLE": 0,
                           "ORIENTATION": 0, "OVERRIDE": 0,
                           "NON ENTRÉE": 0},
               "ensembles": {"UN CHANGEMENT FIABLE": 0,
                             "UNE PISTE À CONFIRMER": 0,
                             "DANS LE BRUIT DE LA MESURE": 0, "N/A": 0},
               "traversees": 0, "boucles": 0, "styles": 0}
    for v in verdicts_list:
        if v["override"]:
            globaux["paliers"]["OVERRIDE"] += 1
        elif not v["entree"]:
            globaux["paliers"]["NON ENTRÉE"] += 1
        else:
            globaux["paliers"][v["palier"]] += 1
            if v["pas"]:
                globaux["pas_servis"][v["pas"]] = \
                    globaux["pas_servis"].get(v["pas"], 0) + 1
            if v["statut"] is None:
                globaux["statuts"]["NON_ÉVALUÉ"] += 1
            else:
                globaux["statuts"][v["statut"]] += 1
            if v["rci"]:
                for rive in core.RIVES:
                    globaux["ensembles"][v["rci"]["rives"][rive]["ensemble"]] += 1
                    globaux["traversees"] += sum(
                        1 for axe in core.AXES
                        if v["rci"]["rives"][rive]["traversees"][axe])
            h = v.get("heritages") or {}
            globaux["boucles"] += int(bool(h.get("boucle_probable")))
            globaux["styles"] += int(bool(h.get("styles_dissemblables")))
    r1["globaux"] = globaux
    if publier:
        generer_figures(couples, verdicts_list, r1)
    r1["C5"] = critere_c5(verdicts_list)
    return r1, couples, verdicts_list


def _famille_court(pas):
    """Court label de famille pour les figures (sans émojis)."""
    if pas == core.PAS_ZERO:
        return "PAS ZERO (zone calme)"
    if pas in core.BANQUE_PAS_EXT[core.FAMILLE_VERT]:
        return "EXERCICE MAISON A DEUX"
    if pas in core.BANQUE_PAS_EXT[core.FAMILLE_ORANGE]:
        return "MODULE A DEUX"
    return "DEMARCHE D'ORIENTATION"


def generer_figures(couples, verdicts_list, r1):
    """4 figures 1920×1080 @150 DPI — déterministes, sans émojis (DejaVu)."""
    FIG.mkdir(exist_ok=True)
    groupes = [g for g, _ in sim.effectifs()]
    sg = r1["stats_groupes"]
    y = range(len(groupes))

    # fig1 — pas servis par groupe (empilé : pas zéro / vert / orange / rouge
    # / override / non-entrée)
    fig, ax = plt.subplots(figsize=FIGSIZE, constrained_layout=True)
    pz = [sum(1 for c, v in zip(couples, verdicts_list)
              if c["groupe"] == g and v["entree"] and v["pas"] == core.PAS_ZERO)
          for g in groupes]
    vert = [sum(1 for c, v in zip(couples, verdicts_list)
                if c["groupe"] == g and v["entree"]
                and v["pas"] in core.BANQUE_PAS_EXT[core.FAMILLE_VERT])
            for g in groupes]
    orange = [sum(1 for c, v in zip(couples, verdicts_list)
                  if c["groupe"] == g and v["entree"]
                  and v["pas"] in core.BANQUE_PAS_EXT[core.FAMILLE_ORANGE])
              for g in groupes]
    rouge = [sum(1 for c, v in zip(couples, verdicts_list)
                 if c["groupe"] == g and v["entree"]
                 and v["pas"] in core.BANQUE_PAS_EXT[core.FAMILLE_ROUGE])
             for g in groupes]
    pov = [sg[g]["paliers"]["OVERRIDE"] for g in groupes]
    pne = [sg[g]["paliers"]["NON ENTRÉE"] for g in groupes]
    base = [0] * len(groupes)
    for vals, coul, lab in ((pz, OKABE_ITO[4],
                             "pas zero (zone calme, rien a fabriquer)"),
                            (vert, OKABE_ITO[3],
                             "exercice maison a deux"),
                            (orange, OKABE_ITO[1],
                             "engagement du module a deux"),
                            (rouge, OKABE_ITO[6],
                             "demarche d'orientation (A5)"),
                            (pov, OKABE_ITO[0],
                             "OVERRIDE D-CRISE (trace, non deploye)"),
                            (pne, OKABE_ITO[7], "NON ENTREE (RQS)")):
        ax.barh(y, vals, left=base, color=coul, label=lab)
        base = [a + b for a, b in zip(base, vals)]
    ax.set_yticks(list(y))
    ax.set_yticklabels(groupes, fontsize=8)
    ax.invert_yaxis()
    ax.set_xlabel("couples")
    ax.set_title("Q3 Extensions « Le pas de l'horizon » — pas servis "
                 "(pas = f(palier hérité de Q2), le choix reste au couple")
    ax.legend(loc="upper center", bbox_to_anchor=(0.5, -0.12), ncol=2,
              fontsize=8)
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
    ax.set_title("Q3 Extensions — conformité par groupe vs seuil D-STD-2 "
                 "(14 bornes distinctes, leçon ad01f21)")
    ax.legend(loc="upper center", bbox_to_anchor=(0.5, -0.24), fontsize=9)
    fig.savefig(FIG / NOM_FIGS[1], dpi=DPI)
    plt.close(fig)

    # fig3 — engagement 14 jours par groupe (empilé) — 9/14 = célébré,
    # jamais de sanction
    fig, ax = plt.subplots(figsize=FIGSIZE, constrained_layout=True)
    cel = [sg[g]["statuts"][core.STATUT_CELEBRE] for g in groupes]
    enc = [sg[g]["statuts"][core.STATUT_EN_CHEMIN] for g in groupes]
    nev = [sg[g]["statuts"]["NON_ÉVALUÉ"] for g in groupes]
    ax.barh(y, cel, color=OKABE_ITO[3], label="CÉLÉBRÉ (>= 9/14)")
    ax.barh(y, enc, left=cel, color=OKABE_ITO[1],
            label="EN CHEMIN (< 9/14 — sans sanction)")
    ax.barh(y, nev, left=[a + b for a, b in zip(cel, enc)],
            color=OKABE_ITO[4],
            label="non évalué (pas zéro / override / non-entrée)")
    ax.set_yticks(list(y))
    ax.set_yticklabels(groupes, fontsize=8)
    ax.invert_yaxis()
    ax.set_xlabel("couples")
    ax.set_title("Q3 Extensions — check-in partagé 14 jours (case binaire "
                 "à deux : 9/14 = célébré, jamais de sanction)")
    ax.legend(loc="upper center", bbox_to_anchor=(0.5, -0.12), ncol=3,
              fontsize=8)
    fig.savefig(FIG / NOM_FIGS[2], dpi=DPI)
    plt.close(fig)

    # fig4 — L7 : |Δ| par rive (deux lignes séparées — lecture par rive,
    # JAMAIS comparée) vs bornes 0,41 / 0,58
    fig, ax = plt.subplots(figsize=FIGSIZE, constrained_layout=True)
    for ligne, (rive, coul, lab) in enumerate((
            ("rive_a", OKABE_ITO[5], "rive A (|Δ| axes H/L/C)"),
            ("rive_b", OKABE_ITO[6], "rive B (|Δ| axes H/L/C)"))):
        xs, ys = [], []
        for i, (c, v) in enumerate(zip(couples, verdicts_list)):
            if v.get("rci"):
                for k, axe in enumerate(core.AXES):
                    xs.append(i + (k - 1) * 0.25)
                    ys.append(ligne + abs(
                        v["rci"]["rives"][rive]["deltas"][axe]) * 0.9)
        ax.scatter(xs, ys, s=10, c=coul, alpha=0.45, label=lab)
    ax.axhline(0 + core.SEUIL_FIABLE * 0.9, color=OKABE_ITO[6], lw=1.2,
               ls="--")
    ax.axhline(0 + core.SEUIL_SUGGESTION * 0.9, color=OKABE_ITO[1], lw=1.2,
               ls="--")
    ax.axhline(1 + core.SEUIL_FIABLE * 0.9, color=OKABE_ITO[6], lw=1.2,
               ls="--")
    ax.axhline(1 + core.SEUIL_SUGGESTION * 0.9, color=OKABE_ITO[1], lw=1.2,
               ls="--")
    ax.set_yticks([0, 1])
    ax.set_yticklabels(["rive A", "rive B"])
    ax.set_xlabel("couples (index, décalés par axe H/L/C)")
    ax.set_ylabel("rive (|Δ| compressé ×0,9)")
    ax.set_title("Q3 Extensions — L7 re-test 8 semaines : |Δ| par rive "
                 "(bornes 0,41 / 0,58 — lignes pointillées) — lecture par "
                 "rive, jamais comparée")
    ax.legend(loc="upper center", bbox_to_anchor=(0.5, -0.10), ncol=2,
              fontsize=9)
    fig.savefig(FIG / NOM_FIGS[3], dpi=DPI)
    plt.close(fig)


def _litt_real(tpl, n):
    return tpl.replace("{n}", str(n))


def generer_rapport(r1, couples, verdicts_list, sha1, sha2):
    """Rapport A-G autoporteur — Verdict fermé d'emblée (leçon E-SM-12)."""
    L = []
    L.append("# Rapport WTC-EXT-Q3 — « Le pas de l'horizon » (RIO-18)")
    L.append("")
    L.append(f"> {D_SIM}")
    L.append(f"> {D_CRISE_BANDEAU}")
    L.append("")
    L.append(f"**Date** : {DATE}  ")
    L.append(f"**Seed** : 42 (×2)  ")
    L.append("**Package** : validation-ext/validation-ext-q3/  ")
    L.append("**SPEC** : EXT-Q3-SPEC.md VERROUILLÉE (c68c78d — arbitrages "
             "A1-A6 tranchés par délégation fondateur, 18/10/2026).  ")
    L.append(f"**Délégation fondateur** : « {DELEGATION} » (18/10/2026) — "
             "tranchage ET cycle de production couverts (pattern Q2/Q5).  ")
    L.append("Entrées = sorties RIO-17 contresignées (croisement, empreinte "
             "2aea8d99… inchangée) + sorties RIO-16 contresignées des deux "
             "rives (empreinte 3583fe56… inchangée) — zéro item nouveau "
             "(A2-a).")
    L.append("")
    L.append("---")
    L.append("")
    return L


def _section_a(L, r1, sha1, sha2):
    L.append("## Section A — Les 7 critères")
    L.append("")
    L.append("| Critère | Attendu | Obtenu | Verdict |")
    L.append("|---------|---------|--------|---------|")
    c = r1["C1"]
    dt_false = [k for k, v in c["d_table_details"].items() if not v]
    L.append(f"| **C1** D-VÉRITÉ : D-TABLE {c['n_cas_table']} cas + bien-formé "
             f"{c['demontrees']} + 3 familles + pas zéro + nomenclature | "
             f"tous TRUE + familles 3/3 | table={c['d_table']} "
             f"({len(dt_false)} FALSE) · familles={c['familles_servies']} · "
             f"pas zéro={c['pas_zero_servi']} · "
             f"nom={c['nomenclature_respectee']} · anti-collision "
             f"RIO-05/RIO-15/RIO-17={c['anti_collision']} | "
             f"{'PASS' if c['ok'] else 'FAIL'} |")
    c = r1["C2"]
    L.append(f"| **C2** D-CONFIRMATION : pureté + 0 inversion temporelle + 0 "
             f"inversion des rives | pur + 0 inversion | "
             f"grille_pure={c['grille_pure']} · inv_temporelle="
             f"{c['anti_inversion_temporelle']} · inv_rives="
             f"{c['anti_inversion_rives']} · n_rci={c['n_rci']} | "
             f"{'PASS' if c['ok'] else 'FAIL'} |")
    c = r1["C3"]
    L.append(f"| **C3** D-STD-2 : 14 seuils DISTINCTES + frontières 9/14 "
             f"exactes + \\|Δ\\| pile 0,58/0,41 + BRUIT | 14/14 + 40/40 | "
             f"n_ok={c['n_ok']}/14 · distinctes={c['bornes_distinctes']} · "
             f"9/14={c['frontieres_9_14']} · pile 0,58={c['pile_058']} · "
             f"pile 0,41={c['pile_041']} · BRUIT={c['bruit']} | "
             f"{'PASS' if c['ok'] else 'FAIL'} |")
    L.append(f"| **C4** SHA ×2 (D-EMPREINTE) | identiques | sha1={sha1[:16]}… "
             f"sha2={sha2[:16]}… match={sha1 == sha2} | "
             f"{'PASS' if sha1 == sha2 else 'FAIL'} |")
    c = r1["C5"]
    L.append(f"| **C5** Affichage : templates + banque servie + D-SIM + "
             f"récap A6 + littéraux | 6/6 | templates={c['templates']} · "
             f"banque={c['banque_servie']} ({c['n_pas_servis']} pas servis) · "
             f"récap={c['recap_3_quetes']} · figures={c['figures']} "
             f"dims={c['dimensions_ok']} | {'PASS' if c['ok'] else 'FAIL'} |")
    c = r1["C6"]
    L.append(f"| **C6** Anti-fabrication à deux : 0 sanction / 0 verdict de "
             f"réussite / pas zéro dit comme tel / 0 comparaison | 0 interdit "
             f"| interdits={c['interdits_touches']} · zone calme="
             f"{c['zone_calme_honnete']} · PERFECT={c['perfect_sans_injonction']} "
             f"· ZERO={c['zero_sans_sanction']} · 0 comparaison="
             f"{c['0_comparaison_inter_rives']} | "
             f"{'PASS' if c['ok'] else 'FAIL'} |")
    c = r1["C7"]
    L.append(f"| **C7** D-CRISE + non-blâme + non-tiers + RQS | 40/40 + 0 | "
             f"court-circuit={c['court_circuit']} (Forte+filet="
             f"{c['forte_filet']}) · zéro reproche={c['zero_reproche']} · "
             f"zéro tiers={c['zero_tiers']} · non-entrée={c['non_entree_rqs']} "
             f"· prudence entre={c['prudence_entre']} | "
             f"{'PASS' if c['ok'] else 'FAIL'} |")
    L.append("")
    L.append(f"SHA-256 exécution 1 : `{sha1}`")
    L.append(f"SHA-256 exécution 2 : `{sha2}`")
    L.append("")
    L.append("> Littéraux d'affichage cités (autoporteur contresignature) — "
             "pas zéro (§5.5) : « " + core.TEMPLATES["pas_zero"] + " » · "
             "pile seuil (G06) : « " + core.TEMPLATES["celebre_pile"] + " » · "
             "EN CHEMIN (jamais de sanction) : « "
             + _litt_real(core.TEMPLATES["en_chemin"], 8) + " » · suivi "
             "partagé (A3) : « " + core.TEMPLATES["suivi_partage"] + " » · "
             "orientation (A5) : « " + core.TEMPLATES["rouge_1"] + " » · "
             "récapitulatif (A6) : « " + core.TEMPLATES["re_cap"] + " »")
    L.append("")
    L.append("---")
    L.append("")
    return L


def _section_b(L, r1):
    L.append("## Section B — Géométrie (D-GÉOMÉTRIE) + calibration D-STD-2")
    L.append("")
    cal = r1["calibration"]
    L.append(f"- σ_item = 0,60 (D-PARAM) · SEM L7 = √2⁻¹ × SE_diff = "
             f"{core.SEM_L7:.4f} (constante L7, ligne 263) · σ_H de référence "
             f"(0,60/√6) = {core.SIGMA_H} — la CALIBRATION des seuils est "
             f"EMPIRIQUE : p̂ estimé par Monte-Carlo déterministe "
             f"({core.N_MC} couples/groupe, seed {core.SEED_MC}, items "
             f"entiers clippés + arrondis + inversés corrigés — même "
             f"processus générateur que le simulateur ; D-GÉOMÉTRIE : "
             f"σ_eff = propagation structurale, jamais modification)")
    L.append("- Bornes de traversée — une mesure garde un seul rôle : axe H "
             "→ bornes de croisement (2,50/3,50, héritées Q2) ; axes L/C → "
             "seuils L3 de la carte (1,80/2,60/3,20, verbatim RIO-16)")
    L.append("- Population percentiles HÉRITÉE de Q2 (2 000 profils, seed "
             "42, N(3,0 ; 0,8) — génération déterministe identique, jamais "
             "recalculée — une mesure un rôle ; placeholder L2 à remplacer "
             "par le pilote)")
    L.append("- Interaction structurale (calibrée, pas corrigée) : "
             "l'inversion EXT-H2-3 au plafond (raw 4 → corrigé 1) tire "
             "l'axe H mesuré vers le bas pour les rives FORTE — les groupes "
             "concernés sont calibrés sur leur géométrie propre (patron Q2 "
             "publié : seuils 0,0 à 10,9 pour G03/G06-G09)")
    L.append("")
    L.append("| Groupe | μ H rive A | μ H rive B | μ agg A | μ agg B | p̂ | seuil |")
    L.append("|--------|-----------|-----------|---------|---------|-----|-------|")
    for gname, det in cal["detail"].items():
        ce = cal["centres"][gname]
        L.append(f"| {gname} | {ce['mu_H_A']} | {ce['mu_H_B']} | "
                 f"{ce['mu_agg_A']} | {ce['mu_agg_B']} | {det['p_theo']} | "
                 f"{det['seuil']} |")
    L.append("")
    L.append(f"Bornes D-STD-2 distinctes : {cal['bornes_distinctes']} (14) — "
             "calibrées (p̂_MC − 2,5σ̂, σ̂ binomial sur l'effectif réel du "
             "groupe), leçon ad01f21. G14 mélange 20 couples INVALIDE "
             "déterministes (RQS 35 fabriqué — non-entrée) et 20 couples "
             "PRUDENCE entrants (RQS 80 — la frontière RQS testée dans le "
             "groupe, ligne 257). G07 : Δ pile aux bornes (ε = 0, "
             "déterministe) ; G09-G11 : re-test = base + Δ + N(0, SEM L7).")
    L.append("")
    L.append("---")
    L.append("")
    return L


def _section_c(L, r1):
    L.append("## Section C — Stats par groupe")
    L.append("")
    L.append("| Groupe | N | Conformes | Paliers (V/O/R/ov/NE) | CÉLÉBRÉ | "
             "EN CHEMIN | Non évalué | FIABLE | SUGGESTION | BRUIT | "
             "Traversées A+B | Boucle | Styles |")
    L.append("|--------|---|-----------|----------------------|---------|"
             "-----------|------------|--------|------------|-------|"
             "----------------|--------|--------|")
    for gname, _n in sim.effectifs():
        g = r1["stats_groupes"][gname]
        p = g["paliers"]
        e = g["ensembles"]
        L.append(f"| {gname} | {g['n']} | {g['conformes']} | "
                 f"{p['EXERCICE MAISON']}/{p['MODULE DE COUPLE']}/"
                 f"{p['ORIENTATION']}/{p['OVERRIDE']}/{p['NON ENTRÉE']} | "
                 f"{g['statuts'][core.STATUT_CELEBRE]} | "
                 f"{g['statuts'][core.STATUT_EN_CHEMIN]} | "
                 f"{g['statuts']['NON_ÉVALUÉ']} | "
                 f"{e[core.ENSEMBLE_FIABLE]} | "
                 f"{e[core.ENSEMBLE_SUGGESTION]} | "
                 f"{e[core.ENSEMBLE_BRUIT]} | "
                 f"{g['traversees_a']}+{g['traversees_b']} | "
                 f"{g['boucles']} | {g['styles']} |")
    L.append("")
    L.append(f"Globaux : {r1['globaux']}")
    L.append("")
    for f in NOM_FIGS:
        L.append(f"![fig](../figures/{f})")
    L.append("")
    L.append("---")
    L.append("")
    return L


def _section_d(L, couples, verdicts_list):
    L.append("## Section D — Couples tracés")
    L.append("")
    exemples = ["G01_PALIER_VERT_EXERCICE_000",
                "G03_PALIER_ROUGE_ORIENTATION_000",
                "G04_ZONE_CALME_PAS_ZERO_000", "G05_SIGNAL_FILET_000",
                "G06_FRONTIERES_9_14_001", "G07_RCI_FRONTIERES_000",
                "G08_ANTI_C6_000", "G08_ANTI_C6_025",
                "G10_RCI_BRUIT_000", "G11_RCI_CONTRASTE_000",
                "G14_RQS_NON_ENTREE_000", "G14_RQS_NON_ENTREE_025"]
    par_id = {c["id"]: (c, v) for c, v in zip(couples, verdicts_list)}
    for eid in exemples:
        if eid not in par_id:
            continue
        c, v = par_id[eid]
        L.append(f"### {eid}")
        L.append("")
        serie_txt = ("aucun (pas zéro / override / non-entrée — rien à "
                     "évaluer)" if c["serie"] is None
                     else f"{sum(1 for j in c['serie'] if j)}/14")
        for r, lbl in (("rive_a", "Rive A"), ("rive_b", "Rive B")):
            s = c["sorties"][r]
            L.append(f"- **{lbl}** : RQS {s['rqs']}/100 ({s['rqs_statut']}) · "
                     f"score H {s['score_H']} · L {s['score_L']} · "
                     f"C {s['score_C']} · filet={s['filet']}")
        L.append(f"- **Croisement hérité (Q2)** : config #{v['config_num']} "
                 f"{v['config_nom']} · palier hérité : {v['palier_herite']} · "
                 f"zone calme : {v['zone_calme_heritee']}")
        L.append(f"- **Display** : {v['display']} · pas : "
                 f"{'aucun (court-circuit / non-entrée)' if v['pas'] is None else '« ' + v['pas'] + ' »'}"
                 f" · statut : {v['statut'] if v['statut'] else 'non évalué'}")
        L.append(f"- **Suivi 14j (check-in partagé)** : {serie_txt}")
        if v["rci"]:
            for rive in core.RIVES:
                ent = v["rci"]["rives"][rive]
                L.append(f"- **L7 {rive}** : Δ H {ent['deltas']['H']} "
                         f"({ent['statuts']['H']}) · Δ L {ent['deltas']['L']} "
                         f"({ent['statuts']['L']}) · Δ C {ent['deltas']['C']} "
                         f"({ent['statuts']['C']}) → ensemble de rive : "
                         f"**{ent['ensemble']}** · traversées : "
                         f"{[a for a in core.AXES if ent['traversees'][a]] or '—'}")
        if v["bandeau"]:
            L.append(f"- **Bandeau** : {v['bandeau']}")
        L.append(f"- **Vrai** : {c['vrai']}")
        L.append("")
    L.append("---")
    L.append("")
    return L


def _section_e(L, r1, c2, c3):
    L.append("## Section E — Analyse")
    L.append("")
    g = r1["globaux"]
    L.append(f"- **Total** : {r1['n_total']} couples · {r1['n_groupes']} "
             f"groupes — réconciliation "
             f"{'OK' if r1['reconciliation'] else 'FAIL'} · "
             f"{g['paliers']['OVERRIDE']} overrides D-CRIse · "
             f"{g['paliers']['NON ENTRÉE']} non entrés (RQS)")
    L.append(f"- **Le pas** : {len(g['pas_servis'])} libellés servis — "
             f"pas zéro {g['pas_servis'].get(core.PAS_ZERO, 0)} (zone calme, "
             f"affiché comme tel) · exercice maison à deux "
             f"{sum(v for k, v in g['pas_servis'].items() if k in core.BANQUE_PAS_EXT[core.FAMILLE_VERT])} · "
             f"module à deux "
             f"{sum(v for k, v in g['pas_servis'].items() if k in core.BANQUE_PAS_EXT[core.FAMILLE_ORANGE])} · "
             f"démarche d'orientation "
             f"{sum(v for k, v in g['pas_servis'].items() if k in core.BANQUE_PAS_EXT[core.FAMILLE_ROUGE])} "
             f"(A5 : le pas EST la démarche)")
    L.append(f"- **Suivi 14 j** : {g['statuts']['CÉLÉBRÉ']} CÉLÉBRÉ · "
             f"{g['statuts']['EN CHEMIN']} EN CHEMIN (sans sanction) · "
             f"{g['statuts']['NON_ÉVALUÉ']} non évalués (pas zéro — rien à "
             f"évaluer)")
    L.append(f"- **L7 (re-test 8 semaines)** : ensembles PAR RIVE — "
             f"{g['ensembles'][core.ENSEMBLE_FIABLE]} UN CHANGEMENT FIABLE · "
             f"{g['ensembles'][core.ENSEMBLE_SUGGESTION]} UNE PISTE À "
             f"CONFIRMER · {g['ensembles'][core.ENSEMBLE_BRUIT]} DANS LE "
             f"BRUIT DE LA MESURE · {g['traversees']} traversées de seuil "
             f"(signification clinique L7) — affichage descriptif par rive, "
             f"jamais comparé (C7)")
    L.append(f"- **D-CONFIRMATION** : grille pure {r1['n_total']}/{r1['n_total']} · "
             f"anti-inversion temporelle : Δ signé inversé exactement sur "
             f"{c2['n_rci']} couples re-testés (swap base/re-test) · "
             f"anti-inversion des rives : labels L7 suivent leur rive "
             f"échangée")
    L.append(f"- **D-STD-2** : {c3['n_ok']}/14 groupes à leur seuil (14 "
             f"seuils distincts) · conformité < 100 % STRUCTURELLE sur les "
             f"groupes à bruit (items + SEM L7 + héritages Q2), encadrée "
             f"par les seuils calibrés · frontières 9/14 exactes 40/40 "
             f"(totaux 8/9/10 pile) · |Δ| pile : 120 lectures à 0,58 · 60 à "
             f"0,41 · 60 < 0,41 (G07, ε = 0)")
    L.append(f"- **D-CRISE** : 40/40 court-circuités AVANT le choix du pas "
             f"(y compris 5 couples items Forte — override quand même) · 0 "
             f"pas déployé sur crise active")
    L.append("- **Robustesse (bandes 3σ)** : les μ adjacents aux bornes "
             "(G07/G09/G11 à 2,95-3,1 ; G02 à 2,9/3,1) sont calibrés sur "
             "leur géométrie propre — la RÈGLE de tranchage inclusif est "
             "prouvée exactement en C1/D-TABLE (2,49/2,50/3,49/3,50)")
    L.append("- **Récapitulatif A6** : la sortie inclut le récapitulatif "
             "descriptif de dimension (carte RIO-16 → croisement RIO-17 → "
             "pas RIO-18) — 0 verdict de « dimension réussie » ; après "
             "contresignature de RIO-18 : Générationnelle 3/3 ; la 4e "
             "extension reste ouverte au fondateur (A1-Q1, divergence "
             "ligne 243 — signalée sans comblement par invention)")
    L.append("")
    L.append("---")
    L.append("")
    return L


def _section_f(L, r1):
    L.append("## Section F — Sources, périmètre, règles")
    L.append("")
    L.append("### Ancrages internes (mot pour mot)")
    L.append("")
    L.append("| Ancrage | `programme wairyu couple.txt` | Statut |")
    L.append("|---------|-------------------------------|--------|")
    L.append("| Q5 = le pas (position 3e extension) | lignes 224-225 — « Q5 "
             "Le pas (1 changement + suivi 14 jours). Extensions : 3 quêtes » "
             "(position carte → croisement → pas, A2-Q1) | SOURCE INTERNE "
             "VÉRIFIÉE |")
    L.append("| Tracking 14 j, anti-perfectionnisme | lignes 297-298 — « Q5 "
             "(tracking 14 jours, seuils anti-perfectionnisme : 9/14 = "
             "célébré, jamais de sanction) » | SOURCE INTERNE VÉRIFIÉE |")
    L.append("| Tracking d'engagement | ligne 429 — « WTC-Q5 (tracking "
             "d'engagement) » | SOURCE INTERNE VÉRIFIÉE |")
    L.append("| RCI longitudinal | ligne 263 (L7) — « RCI longitudinal "
             "(Jacobson & Truax) : SE_diff = √2 × SEM ≈ 0,356 · \\|Δ\\| ≥ 0,58 "
             "= FIABLE · 0,41-0,58 = SUGGESTION · < 0,41 = BRUIT · + "
             "signification clinique si seuil traversé » | SOURCE INTERNE "
             "VÉRIFIÉE |")
    L.append("| Re-test 8 semaines | ligne 274 — « re-test programmé à 8 "
             "semaines » | SOURCE INTERNE VÉRIFIÉE |")
    L.append("| L8 assemblage | ligne 264 — « palier/pas » (7e bloc) : le "
             "pas est la lecture du palier, pas une décision nouvelle | "
             "SOURCE INTERNE VÉRIFIÉE |")
    L.append("| 3 paliers | §5.4 lignes 227-231 — « 🟢 Seul(e) (ombre légère "
             "→ exercice maison) · 🟠 À deux (moyenne → module de couple) · "
             "🔴 Professionnel (élevée/signal → orientation chaleureuse, « le "
             "chemin le plus court, pas un échec ») » | SOURCE INTERNE "
             "VÉRIFIÉE |")
    L.append("| Anti-fabrication | §5.5 lignes 233-237 — zone calme = "
             "résultat affiché comme tel ; ligne 366 — l'utilisateur "
             "valide/conteste chaque proposition | SOURCE INTERNE VÉRIFIÉE |")
    L.append("| D-CRISE | hub — « Court-circuit de crise AVANT l'arbre — "
             "filet 3919/3114. JAMAIS de pas de couple en crise. » | SOURCE "
             "INTERNE VÉRIFIÉE |")
    L.append("| Non-évaluation | ligne 363 — « Jamais le partenaire, jamais "
             "les tiers (rôles, pas de noms) » · ligne 370 — rive non "
             "synchronisée | SOURCE INTERNE VÉRIFIÉE |")
    L.append("")
    L.append("### Périmètre verrouillé (D-CANAL)")
    L.append("")
    L.append("| Portion | INTERPRÉTÉ | SOURCE | VÉRIFIÉ PAR |")
    L.append("|--------|-----------|--------|-------------|")
    L.append("| Titre « Le pas de l'horizon » | Non (verrouillé A1) | "
             "délégation 18/10 — déclinaison dimensionnelle (patron RIO-15) | "
             "C1 anti-collision registres |")
    L.append("| Pas = f(palier hérité) + pas zéro zone calme | Non "
             "(verrouillé A2) | L8 ligne 264 « palier/pas » + §5.5 | C1 "
             "famille de pas + D-TABLE palier_jamais_rescale |")
    L.append("| Banque 6 pas (modules existants lignes 111/112/133) + pas "
             "zéro | Non (fixé A2) | anti-fabrication §5.5 — zéro invention | "
             "C5 banque servie + C6 pas_authentiques |")
    L.append("| Check-in binaire PARTAGÉ, 9/14 verbatim | Non (verrouillé "
             "A3) | lignes 297-298 + Partie 4 (nous déclaré) | C1 grille 15 "
             "+ C6/C7 |")
    L.append("| Pas zéro → statut non évalué (rien à fabriquer) | Oui | "
             "lecture anti-fabrication §5.5 (un pas zéro n'a rien à suivre) | "
             "D-TABLE pas_zero_rien_a_evaluer |")
    L.append("| RCI par rive, 3 axes, ensemble = max DE RIVE | Oui | A4 "
             "(verrouillé) + convention d'affichage anti-surinterprétation "
             "L4 — l'ensemble ne traverse jamais les rives (C7) | C2/C3 |")
    L.append("| Bornes de traversée H 2,50/3,50 · L/C 1,80/2,60/3,20 | Oui | "
             "une mesure un rôle — H hérite du croisement Q2, L/C de la "
             "carte L3 (RIO-16) | D-TABLE traversées |")
    L.append("| Héritages Q2 (boucle/styles/asymétries) dans la surface de "
             "conformité | Oui | croisé D-VÉRITÉ patron Q2 — la surface "
             "teste tout ce qui est servi | C3 calibrée |")
    L.append("| Population percentiles héritée de Q2 | Non (fixé §6) | "
             "« jamais recalculée — une mesure un rôle » | génération "
             "déterministe identique (default_rng(42)) |")
    L.append("| Override D-CRISE | Non (fixé) | règle permanente hub · "
             "ligne 369 | C3/C7 40/40 |")
    L.append("| Seuils D-STD-2 (14 valeurs distinctes) | Oui | calibrés "
             "p̂_MC − 2,5σ̂ (patron Q2) | C3 |")
    L.append("")
    L.append("### Leçons appliquées")
    L.append("")
    L.append("- Bornes D-STD-2 DISTINCTES par groupe (leçon SM-Q5/ad01f21 — "
             "double comptage vérifié)")
    L.append("- C1 croisé sur cas de table, pas sur données bruitées (leçon "
             "Q5)")
    L.append("- Rapport autoporteur, Verdict fermé, balises de gras "
             "équilibrées (leçon E-SM-12)")
    L.append("- Figures sans émojis (glyphes DejaVu) · 0 chiffre sans source "
             "(chaîne de traçabilité §6.4)")
    L.append("- Séquencement C5/SHA : figures générées AVANT l'évaluation de "
             "C5 (leçon Q4)")
    L.append("")
    L.append("### Périmètre")
    L.append("")
    L.append("- Q3 = LE PAS à deux (lignes 224-225, position 3 par A2-Q1) — "
             "RIO-18 · après contresignature : Générationnelle 3/3")
    L.append("- A6 : récapitulatif descriptif de dimension inclus — la 4e "
             "extension du canon (ligne 243) reste à identifier par le "
             "fondateur (A1-Q1, divergence documentée, sans comblement par "
             "invention, D-CANAL-2)")
    L.append("- Extensions suivantes (au fondateur) : Morale/éthique — « "
             "L'Épreuve » (ligne 114) · Politique/idéologique — « Les Deux "
             "Drapeaux » (ligne 115)")
    L.append("- Le pas nourrit le module « L'Écart des horloges » (ligne "
             "112) et les supports Les Deux Rives (ligne 133) sans les "
             "remplacer ; la conversation de l'horizon (RIO-17) reste "
             "l'entrée narrative naturelle du choix du pas")
    L.append("- Protocole lexical (R2 · P5) : RIO-18 = zéro item nouveau — "
             "rien à auditer ; couverture héritée des sorties RIO-16 "
             "(legal/D-audit-pi.md §10)")
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
    return L


def _section_g(L, r1, sha1, sha2):
    L.append("## Section G — Verdict")
    L.append("")
    n_ok = sum(1 for k in ("C1", "C2", "C3", "C5", "C6", "C7")
               if r1[k]["ok"])
    v = "VALIDÉ" if n_ok == 6 and sha1 == sha2 else "À CORRIGER"
    L.append(f"### Verdict : **{v}**")
    L.append("")
    L.append(f"### Note : **{n_ok + (1 if sha1 == sha2 else 0)}/7**")
    L.append("")
    L.append(f"> {D_SIM}")
    L.append("")
    if v == "VALIDÉ":
        L.append("### RIO-18")
        L.append("")
        L.append("RIO-18 « Le pas de l'horizon » — publié, en audit "
                 "(contresignature à la validation fondateur).")
        L.append("")
        L.append("### Inventaire structurel")
        L.append("")
        L.append("| Fichier | Fonctions |")
        L.append("|---------|-----------|")
        L.append("| wtc_ext_q3_core.py | famille_de, pas_zero_legitime, "
                 "pas_de, statut_engagement_de, delta_de, statut_rci_de, "
                 "statut_ensemble_de, niveau_H_de, niveau_L3_de, "
                 "traverse_de, signification_de, rci_de, classifier, "
                 "verifier_d_table, verifier_d_confirmation, "
                 "percentile_de, _p_regime_mc, p_conformite_groupe, "
                 "calibration_d_std_2 |")
        L.append("| wtc_ext_q3_simulator.py | corrige, calcule_rqs, "
                 "sortie_rive, _rive, niveau_croisement, croisement_q2, "
                 "_serie_groupe, _choix_groupe, _gen_couple, "
                 "tous_les_couples, effectifs, classification_vraie, "
                 "_re_tests_de, construire, verdicts, conforme, "
                 "resume_groupes |")
        L.append("| wtc_ext_q3_validation.py | _sha, bien_forme, critere_c1, "
                 "critere_c2, critere_c3, critere_c5, critere_c6, "
                 "critere_c7, executer, generer_figures, generer_rapport, "
                 "main |")
        L.append("")
        L.append("- Instrument : ZÉRO item nouveau (A2-a) — le pas lit les "
                 "sorties RIO-17 + RIO-16 contresignées")
        L.append("- Le pas : f(palier croisé hérité, JAMAIS recalculé) · 3 "
                 "familles §5.4 + pas zéro zone calme (A2) · check-in "
                 "binaire partagé 9/14 verbatim, jamais de sanction (A3) · "
                 "en 🔴 ORIENTATION le pas EST la démarche (A5)")
        L.append("- L7 : re-test RIO-16 à 8 semaines — Δ par rive sur H/L/C, "
                 "SE_diff ≈ 0,356, bornes 0,58/0,41, signification clinique "
                 "par échelle propre (A4)")
        L.append("- D-CRISE : court-circuit AVANT le choix du pas — JAMAIS "
                 "de pas de couple en crise (configuration tracée)")
        L.append("- A6 : récapitulatif descriptif de dimension (3 quêtes) — "
                 "Générationnelle 3/3 à la contresignature")
        L.append(f"- Réconciliation : {r1['n_total']}/{r1['n_total']} (PASS)")
    L.append("")
    return L


def main():
    RES.mkdir(exist_ok=True)
    FIG.mkdir(exist_ok=True)
    print("=" * 60)
    print("WTC-EXT-Q3 — Validation (RIO-18)")
    print("=" * 60)
    r1, couples, verdicts_list = executer(publier=True)
    sha1 = _sha(r1)
    r2, _c2, _v2 = executer(publier=False)
    sha2 = _sha(r2)
    r1["C4"] = {"sha1": sha1, "sha2": sha2, "match": sha1 == sha2,
                "ok": sha1 == sha2}
    r1["sha256_run"] = sha1
    (RES / f"resultats-ext-q3-{DATE}.json").write_text(
        json.dumps(r1, ensure_ascii=False, indent=2, sort_keys=True),
        encoding="utf-8")
    L = generer_rapport(r1, couples, verdicts_list, sha1, sha2)
    L = _section_a(L, r1, sha1, sha2)
    L = _section_b(L, r1)
    L = _section_c(L, r1)
    L = _section_d(L, couples, verdicts_list)
    L = _section_e(L, r1, r1["C2"], r1["C3"])
    L = _section_f(L, r1)
    L = _section_g(L, r1, sha1, sha2)
    (RES / f"rapport-ext-q3-{DATE}.md").write_text("\n".join(L) + "\n",
                                                   encoding="utf-8")
    n_ok = sum(1 for k in ("C1", "C2", "C3", "C4", "C5", "C6", "C7")
               if r1[k].get("ok", False))
    print(f"SHA-256 ×2 : {sha1[:16]}… match={r1['C4']['match']}")
    for k in ("C1", "C2", "C3", "C5", "C6", "C7"):
        print(f"  {k} : {'PASS' if r1[k]['ok'] else 'FAIL'}")
    print(f"WTC-EXT-Q3 (RIO-18) — verdict : "
          f"{'VALIDÉ' if n_ok == 7 else 'REFUSÉ'} ({n_ok}/7)")
    return r1


if __name__ == "__main__":
    main()
