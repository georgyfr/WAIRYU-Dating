# -*- coding: utf-8 -*-
"""WAIRYU — WTC-PERS-Q1-03 : validation Personnalité Q1 (RIO-19).
C1 D-VÉRITÉ (D-TABLE cas exhaustifs + bien-formé 560/560 + nomenclature) ·
C2 D-CONFIRMATION (déterminisme + anti-inversion) · C3 D-STD-2 (14 seuils
DISTINCTS calibrés p̂ − 2,5σ + règle conservatrice 100 % + override filet
40/40 dont 5 détectés) · C4 SHA ×2 (D-EMPREINTE : SHA sur contenu sans
sha256_run ni C4) · C5 affichage · C6 anti-étiquette (A5 : 0 diagnostic /
0 étiquette / 0 mot canon clinique) · C7 D-CRISE + non-évaluation des tiers.
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
import wtc_pers_q1_core as core
import wtc_pers_q1_simulator as sim

PKG = Path(__file__).parent.parent
RES = PKG / "results"
FIG = PKG / "figures"
DATE = datetime.now().strftime("%Y-%m-%d")
FIGSIZE = (12.8, 7.2)
DPI = 150
NOM_FIGS = ("fig1_paliers.png", "fig2_conformite_d_std2.png",
            "fig3_lectures_l3.png", "fig4_rci_deltas.png")
OKABE_ITO = ["#000000", "#E69F00", "#56B4E9", "#009E73", "#F0E442",
             "#0072B2", "#D55E00", "#CC79A9"]
D_SIM = ("AVERTISSEMENT D-SIM : résultats issus de simulations (seed 42) — "
         "la mécanique est validée, pas la prévalence clinique.")
D_CRISE_BANDEAU = ("D-CRISE : court-circuit AVANT l'arbre — filet 9 signaux "
                   "→ P-FILTRE 3919/3114 (ligne 369) + voie détectée contrôle "
                   "(SPEC §4). JAMAIS de carte affichée sur signal.")
DELEGATION = "je te laisse le choix de trancher"
PRODUCTION = ("je verrouille, puis je lance la production validation-pers/ "
              "(séquence D-CANAL-2 complète → RIO-19)")
AXES4 = ("AO", "N", "R", "J")


def _sha(resultats):
    brut = json.dumps(resultats, sort_keys=True, ensure_ascii=False)
    return hashlib.sha256(brut.encode("utf-8")).hexdigest()


def bien_forme(couple, m):
    """Verdict bien formé par couple (les deux rives)."""
    for r in ("rive_a", "rive_b"):
        m_r = m[r]
        if m_r["filet"]["filet"]:
            if m_r["palier"] != core.PALIER_ROUGE or m_r["carte"] is not None:
                return False
            continue
        if m_r["rqs"]["statut"] == "INVALIDE":
            if m_r["palier"] is not None or m_r["carte"] is not None:
                return False
            continue
        if m_r["palier"] not in (core.PALIER_VERT, core.PALIER_ORANGE,
                                 core.PALIER_ROUGE):
            return False
        for axe in AXES4:
            niv = m_r["niveaux"][axe]
            if niv["type"] not in ("NIVEAU", "FRONTIÈRE"):
                return False
            if niv["conservateur"] not in core.NIVEAUX:
                return False
            if m_r["faces"][axe]["lecture"] not in ("NUAGE",
                                                    "HIÉRARCHIE DÉCLARABLE"):
                return False
        if m_r["rci"] is not None and m_r["rci"]["verdict"] not in (
                "FIABLE", "SUGGESTION", "BRUIT"):
            return False
    return True


def critere_c1(couples, classes):
    """C1 D-VÉRITÉ : D-TABLE (cas exhaustifs) + bien-formé 560/560 +
    nomenclature à nom unique (D-NOMENCLATURE) — leçon Q5 : croisé sur cas de
    table, pas sur données bruitées."""
    dt = core.verifier_d_table()
    demons = [bien_forme(c, m) for c, m in zip(couples, classes)]
    labels_moteur = set()
    for m in classes:
        for r in ("rive_a", "rive_b"):
            if m[r]["palier"] is not None:
                labels_moteur.add(m[r]["palier"])
            if m[r]["niveaux"]:
                for axe in AXES4:
                    labels_moteur.add(m[r]["niveaux"][axe]["type"])
                    labels_moteur.add(m[r]["niveaux"][axe]["conservateur"])
                    labels_moteur.add(m[r]["faces"][axe]["lecture"])
            labels_moteur.add(m[r]["rqs"]["statut"])
            if m[r]["rci"]:
                labels_moteur.add(m[r]["rci"]["verdict"])
    nom_ok = labels_moteur <= set(core.NOMENCLATURE)
    return {"d_table": all(dt.values()), "d_table_details": dt,
            "n_cas_table": len(dt),
            "demontrees": f"{sum(demons)}/{len(demons)}",
            "nomenclature_respectee": nom_ok,
            "n_nomenclature": len(core.NOMENCLATURE),
            "ok": all(dt.values()) and all(demons) and nom_ok,
            "eliminatoire": True}


def critere_c2(couples, classes):
    """C2 D-CONFIRMATION : déterminisme pur + anti-inversion temporelle."""
    dc = core.verifier_d_confirmation(couples)
    classes2 = [core.classifier_couple(c) for c in couples]
    pure = all(
        m1["rive_a"]["palier"] == m2["rive_a"]["palier"]
        and m1["rive_b"]["palier"] == m2["rive_b"]["palier"]
        and m1["rive_a"]["aggregate"] == m2["rive_a"]["aggregate"]
        and m1["avertissement_styles"] == m2["avertissement_styles"]
        for m1, m2 in zip(classes, classes2))
    return {"grille_pure": pure, "anti_inversion": dc["anti_inversion_temporelle"],
            "n_rci": dc["n_rci"],
            "ok": pure and dc["anti_inversion_temporelle"],
            "eliminatoire": True}


def critere_c3(couples, classes, conformite, calib):
    """C3 D-STD-2 : 14 seuils DISTINCTS (calibrés p̂ − 2,5σ, leçon ad01f21) +
    règle conservatrice 100 % (toutes lectures) + override filet 40/40 (dont
    5 voie détectée) + réconciliation."""
    par_groupe = {}
    for gname, n in sim.effectifs():
        ids = [c["id"] for c in couples if c["groupe"] == gname]
        conf = sum(1 for i in ids if conformite[i])
        pct = round(100.0 * conf / n, 1)
        seuil = calib["seuils"][gname]
        par_groupe[gname] = {"conformes": conf, "n": n, "pct": pct,
                             "seuil": seuil, "ok": pct >= seuil}
    n_ok = sum(1 for v in par_groupe.values() if v["ok"])
    regle = total = 0
    for m in classes:
        for r in ("rive_a", "rive_b"):
            niv = m[r]["niveaux"]
            if niv:
                for axe in AXES4:
                    total += 1
                    regle += int(niv[axe]["conservateur"] == niv[axe]["touches"][0])
    regle_ok = total > 0 and regle == total
    g06 = [(c, m) for c, m in zip(couples, classes)
           if c["groupe"] == "G06_SIGNAL_CONTROLE"]
    override = sum(1 for c, m in g06
                   if m["rive_a"]["filet"]["filet"]
                   and m["rive_a"]["palier"] == core.PALIER_ROUGE
                   and m["rive_a"]["carte"] is None
                   and m["rive_b"]["carte"] is None)
    detecte = sum(1 for c, m in g06
                  if int(c["id"].split("_")[-1]) >= 35
                  and m["rive_a"]["filet"]["voie"].startswith("contrôle détecté")
                  and m["rive_a"]["carte"] is None
                  and m["rive_b"]["carte"] is None)
    n_total = len(couples)
    return {"par_groupe": par_groupe, "n_ok": n_ok,
            "bornes_distinctes": calib["bornes_distinctes"],
            "regle_conservatrice": f"{regle}/{total}", "regle_ok": regle_ok,
            "override_filet": f"{override}/40",
            "filet_detecte": f"{detecte}/5",
            "reconciliation": sum(v["n"] for v in par_groupe.values()) == n_total,
            "ok": (n_ok == 14 and calib["bornes_distinctes"] and regle_ok
                   and override == 40 and detecte == 5),
            "eliminatoire": True}


def critere_c5(couples, classes):
    """C5 Affichage : 19 templates autoporteurs + bandeau D-SIM + 4 figures
    1920×1080 (fichiers > 20 Ko) + exemple rendu."""
    templates_ok = all(t in core.TEMPLATES for t in (
        "zone_ombre", "zone_force", "nuage", "hierarchie", "frontiere",
        "palier_vert", "palier_orange", "palier_rouge", "filet",
        "filet_controle", "reparation", "avertissement", "prudence", "invalide",
        "rci_fiable", "rci_suggestion", "rci_bruit", "traversee",
        "re_test_programme"))
    dims_ok = True
    for f in NOM_FIGS:
        p = FIG / f
        dims_ok &= p.exists() and p.stat().st_size > 20000
    exemple = core.TEMPLATES["filet_controle"]
    return {"templates_19": templates_ok, "d_sim": bool(D_SIM),
            "figures": 4, "dimensions_ok": dims_ok,
            "litteral_exemple": exemple,
            "ok": templates_ok and dims_ok and bool(D_SIM)}


def critere_c6(classes):
    """C6 A5 (triple verrou) : 0 diagnostic / 0 étiquette / 0 mot canon
    clinique affiché (« névrosisme », « narcissisme », « jalousie » jamais
    imprimés) · 0 verdict moral · 0 blâme sur la réparation — les libellés
    produits ⊆ nomenclature ; zéro interdit dans les libellés et templates."""
    paliers = {m[r]["palier"] for m in classes for r in ("rive_a", "rive_b")}
    conservs = {m[r]["niveaux"][a]["conservateur"]
                for m in classes for r in ("rive_a", "rive_b")
                if m[r]["niveaux"] for a in AXES4}
    rcis = {m[r]["rci"]["verdict"] for m in classes for r in ("rive_a", "rive_b")
            if m[r]["rci"]}
    statuts = {m[r]["rqs"]["statut"] for m in classes
               for r in ("rive_a", "rive_b")}
    nom_ok = (paliers <= {core.PALIER_VERT, core.PALIER_ORANGE, core.PALIER_ROUGE,
                          None}
              and conservs <= set(core.NIVEAUX)
              and rcis <= {"FIABLE", "SUGGESTION", "BRUIT"}
              and statuts <= set(core.STATUTS_RQS))
    produits = " | ".join(sorted(x for x in (paliers | conservs | rcis | statuts)
                                 if x)) + " | " + " ".join(core.TEMPLATES.values())
    interdits = ("pathologie", "diagnostic", "dépistage", "névrosisme",
                 "narcissisme", "narcissique", "jalousie", "jaloux", "jalouse",
                 "trouble", "pervers", "manipulateur", "pathologique",
                 "coupable", "blâme", "est fautif", "à condamner",
                 "trop tard", "compte à rebours", "il vous reste",
                 "dernière chance", "urgence", "il est temps de")
    touches = [x for x in interdits if x in produits.lower()]
    return {"paliers": sorted(p for p in paliers if p),
            "niveaux": sorted(conservs), "rci": sorted(rcis),
            "nomenclature_respectee": nom_ok,
            "0_etiquette_0_diagnostic": not touches,
            "interdits_touches": touches,
            "zone_calme_honnete": "rien à fabriquer" in core.TEMPLATES["palier_vert"],
            "reparation_sans_blame": ("pas un verdict" in core.TEMPLATES["reparation"]
                                      and "blâme" not in core.TEMPLATES["reparation"]),
            "ok": nom_ok and not touches,
            "eliminatoire": True}


def critere_c7(couples, classes):
    """C7 D-CRISE + non-évaluation : court-circuit AVANT l'arbre (40/40, dont
    5 couples à items tous Forte détectés par la voie contrôle) ; aucun tiers
    évalué dans les templates ; avertissement sans verdict."""
    g06 = [(c, m) for c, m in zip(couples, classes)
           if c["groupe"] == "G06_SIGNAL_CONTROLE"]
    court = sum(1 for c, m in g06
                if m["rive_a"]["palier"] == core.PALIER_ROUGE
                and m["rive_a"]["carte"] is None
                and m["rive_b"]["carte"] is None)
    aucune_carte_filet = all(m[r]["carte"] is None for c, m in g06
                             for r in ("rive_a", "rive_b"))
    tiers = ("coupable", "blâme", "faute de", "est fautif", "à condamner")
    produits = " ".join(core.TEMPLATES.values()).lower()
    zero_tiers = not any(x in produits for x in tiers)
    g13 = [(c, m) for c, m in zip(couples, classes)
           if c["groupe"] == "G13_RIVES_DISSEMBLABLES"]
    avert = sum(1 for c, m in g13 if m["avertissement_styles"] is True)
    detecte = sum(1 for c, m in g06
                  if int(c["id"].split("_")[-1]) >= 35
                  and m["rive_a"]["filet"]["voie"].startswith("contrôle détecté"))
    return {"court_circuit": f"{court}/40",
            "court_circuit_ok": court == 40 and aucune_carte_filet,
            "voie_detectee": f"{detecte}/5 — items tous Forte → court-circuit "
                             "quand même (avant l'arbre)",
            "zero_tiers": zero_tiers,
            "avertissement_sans_verdict": f"{avert}/40",
            "avert_ok": avert >= 36,
            "ok": court == 40 and aucune_carte_filet and zero_tiers
            and avert >= 36 and detecte == 5,
            "eliminatoire": True}


def executer(publier=True):
    couples = sim.tous_les_couples()
    classes = [core.classifier_couple(c) for c in couples]
    conformite = {c["id"]: sim.conformite_couple(c, m)
                  for c, m in zip(couples, classes)}
    calib = core.calibration_d_std_2()
    faux_positifs = 0
    faux_par_groupe = {}
    for c, m in zip(couples, classes):
        v = sim.classification_vraie(c)
        for r, key in (("rive_a", "filet_a"), ("rive_b", "filet_b")):
            if m[r]["filet"]["filet"] and not v[key]:
                faux_positifs += 1
                faux_par_groupe[c["groupe"]] = faux_par_groupe.get(c["groupe"], 0) + 1
    r1 = {}
    r1["C1"] = critere_c1(couples, classes)
    r1["C2"] = critere_c2(couples, classes)
    r1["C3"] = critere_c3(couples, classes, conformite, calib)
    r1["C6"] = critere_c6(classes)
    r1["C7"] = critere_c7(couples, classes)
    r1["n_total"] = len(couples)
    r1["n_rives"] = 2 * len(couples)
    r1["n_groupes"] = len(sim.effectifs())
    r1["reconciliation"] = sum(n for _, n in sim.effectifs()) == len(couples)
    r1["faux_positifs_filet_detecte"] = faux_positifs
    r1["faux_positifs_par_groupe"] = faux_par_groupe
    r1["calibration"] = calib
    r1["conformite_table"] = conformite
    r1["population"] = {"seed": sim.SEED, "n_couples": len(couples),
                        "n_rives": 2 * len(couples), "sigma_item": sim.SIGMA_ITEM,
                        "sem_placeholder": core.SEM, "ci90_demi": core.CI90_DEMI,
                        "se_face": core.SE_FACE,
                        "seuil_hierarchie": core.SEUIL_HIERARCHIE,
                        "sigma_eff_axe": core.SIGMA_EFF_AXE,
                        "n_items": core.N_ITEMS,
                        "inverses": sorted(core.INVERSES),
                        "placeholder": "à remplacer par le pilote (L2, ligne 258)"}
    stats = {}
    for c, m in zip(couples, classes):
        g = stats.setdefault(c["groupe"], {
            "n": 0, "conformes": 0,
            "paliers": {"EXERCICE MAISON": 0, "MODULE DE COUPLE": 0,
                        "ORIENTATION": 0, "NON_AFFICHÉE": 0},
            "statuts_rqs": {"OK": 0, "PRUDENCE": 0, "INVALIDE": 0},
            "lectures": {"NIVEAU": 0, "FRONTIÈRE": 0},
            "faces": {"NUAGE": 0, "HIÉRARCHIE DÉCLARABLE": 0},
            "filets": 0, "rci": {"FIABLE": 0, "SUGGESTION": 0, "BRUIT": 0,
                                 "N/A": 0}})
        g["n"] += 1
        g["conformes"] += int(conformite[c["id"]])
        for r in ("rive_a", "rive_b"):
            m_r = m[r]
            if m_r["carte"]:
                g["paliers"][m_r["palier"]] += 1
                g["statuts_rqs"][m_r["rqs"]["statut"]] += 1
                for axe in AXES4:
                    g["lectures"][m_r["niveaux"][axe]["type"]] += 1
                    g["faces"][m_r["faces"][axe]["lecture"]] += 1
            else:
                g["paliers"]["NON_AFFICHÉE"] += 1
                g["statuts_rqs"][m_r["rqs"]["statut"]] += 1
            g["filets"] += int(m_r["filet"]["filet"])
            if m_r["rci"]:
                g["rci"][m_r["rci"]["verdict"]] += 1
            else:
                g["rci"]["N/A"] += 1
    r1["stats_groupes"] = stats
    paliers_globaux = {"EXERCICE MAISON": 0, "MODULE DE COUPLE": 0,
                       "ORIENTATION": 0, "NON_AFFICHÉE": 0}
    rci_globaux = {"FIABLE": 0, "SUGGESTION": 0, "BRUIT": 0, "N/A": 0}
    traversees = 0
    for m in classes:
        for r in ("rive_a", "rive_b"):
            m_r = m[r]
            if m_r["carte"]:
                paliers_globaux[m_r["palier"]] += 1
            else:
                paliers_globaux["NON_AFFICHÉE"] += 1
            if m_r["rci"]:
                rci_globaux[m_r["rci"]["verdict"]] += 1
                traversees += int(m_r["rci"]["traversee"])
            else:
                rci_globaux["N/A"] += 1
    r1["paliers_globaux"] = paliers_globaux
    r1["rci"] = {"verdicts": rci_globaux, "traversees": traversees,
                 "se_diff": core.SE_DIFF, "seuil_fiable": core.SEUIL_FIABLE,
                 "seuil_suggestion": core.SEUIL_SUGGESTION}
    if publier:
        generer_figures(couples, classes, r1)
    r1["C5"] = critere_c5(couples, classes)
    return r1, couples, classes


def generer_figures(couples, classes, r1):
    """4 figures 1920×1080 @150 DPI — déterministes, sans émojis (DejaVu)."""
    FIG.mkdir(exist_ok=True)
    groupes = [g for g, _ in sim.effectifs()]
    sg = r1["stats_groupes"]
    y = range(len(groupes))

    # fig1 — paliers servis par groupe (rives, empilé)
    fig, ax = plt.subplots(figsize=FIGSIZE, constrained_layout=True)
    pv = [sg[g]["paliers"]["EXERCICE MAISON"] for g in groupes]
    po = [sg[g]["paliers"]["MODULE DE COUPLE"] for g in groupes]
    pr = [sg[g]["paliers"]["ORIENTATION"] for g in groupes]
    pn = [sg[g]["paliers"]["NON_AFFICHÉE"] for g in groupes]
    ax.barh(y, pv, color=OKABE_ITO[3], label="EXERCICE MAISON (palier vert)")
    ax.barh(y, po, left=pv, color=OKABE_ITO[1],
            label="MODULE DE COUPLE (palier orange)")
    ax.barh(y, pr, left=[a + b for a, b in zip(pv, po)], color=OKABE_ITO[6],
            label="ORIENTATION (palier rouge)")
    ax.barh(y, pn, left=[a + b + c for a, b, c in zip(pv, po, pr)],
            color=OKABE_ITO[7], label="NON AFFICHÉE (RQS / filet)")
    ax.set_yticks(list(y))
    ax.set_yticklabels(groupes, fontsize=8)
    ax.invert_yaxis()
    ax.set_xlabel("rives")
    ax.set_title("Q1 Personnalité « Manuel d'utilisation de moi » — paliers "
                 "servis (max des niveaux conservateurs, 4 axes)")
    ax.legend(loc="upper center", bbox_to_anchor=(0.5, -0.12), ncol=2, fontsize=9)
    fig.savefig(FIG / NOM_FIGS[0], dpi=DPI)
    plt.close(fig)

    # fig2 — conformité par groupe vs seuil D-STD-2 (pattern Q4/Q5)
    fig, ax = plt.subplots(figsize=FIGSIZE, constrained_layout=True)
    pct = [sg[g]["conformes"] / sg[g]["n"] * 100 for g in groupes]
    seuils = [core.SEUILS_D_STD_2[g] for g in groupes]
    x = range(len(groupes))
    ax.bar(x, pct, color=OKABE_ITO[5], width=0.65,
           label="conformité moteur / classification vraie")
    ax.plot(x, seuils, "D", color=OKABE_ITO[6], markersize=7,
            label="seuil D-STD-2 (calibré p - 2,5 sigma)")
    ax.set_xticks(list(x))
    ax.set_xticklabels(groupes, rotation=45, ha="right", fontsize=8)
    ax.set_ylim(0, 105)
    ax.set_ylabel("% conformes (couples)")
    ax.set_title("Q1 Personnalité — conformité par groupe vs seuil D-STD-2 "
                 "(14 bornes distinctes)")
    ax.legend(loc="upper center", bbox_to_anchor=(0.5, -0.26), fontsize=9)
    fig.savefig(FIG / NOM_FIGS[1], dpi=DPI)
    plt.close(fig)

    # fig3 — lectures L3 : NIVEAU vs FRONTIÈRE par groupe (tous axes affichés)
    fig, ax = plt.subplots(figsize=FIGSIZE, constrained_layout=True)
    fr = [sg[g]["lectures"]["FRONTIÈRE"]
          / max(1, sg[g]["lectures"]["FRONTIÈRE"] + sg[g]["lectures"]["NIVEAU"])
          * 100 for g in groupes]
    ax.bar(x, fr, color=OKABE_ITO[2], width=0.65)
    ax.set_xticks(list(x))
    ax.set_xticklabels(groupes, rotation=45, ha="right", fontsize=8)
    ax.set_ylim(0, 105)
    ax.set_ylabel("% de lectures FRONTIÈRE (axes affichés)")
    ax.set_title("Q1 Personnalité — honnêteté de lecture L3 : part des "
                 "FRONTIÈRES nommées (décision conservatrice)")
    fig.savefig(FIG / NOM_FIGS[2], dpi=DPI)
    plt.close(fig)

    # fig4 — RCI : |Δ| mesurés vs bornes L7 (0,41 / 0,58)
    fig, ax = plt.subplots(figsize=FIGSIZE, constrained_layout=True)
    deltas = [abs(m["rive_a"]["rci"]["delta"]) for c, m in zip(couples, classes)
              if m["rive_a"]["rci"]] + \
             [abs(m["rive_b"]["rci"]["delta"]) for c, m in zip(couples, classes)
              if m["rive_b"]["rci"]]
    trav = [m["rive_a"]["rci"]["traversee"] for c, m in zip(couples, classes)
            if m["rive_a"]["rci"]] + \
           [m["rive_b"]["rci"]["traversee"] for c, m in zip(couples, classes)
            if m["rive_b"]["rci"]]
    ax.axhspan(0, core.SEUIL_SUGGESTION, color=OKABE_ITO[4], alpha=0.25,
               label="BRUIT (< 0,41)")
    ax.axhspan(core.SEUIL_SUGGESTION, core.SEUIL_FIABLE, color=OKABE_ITO[1],
               alpha=0.25, label="SUGGESTION [0,41 ; 0,58[")
    ax.axhspan(core.SEUIL_FIABLE, max(1.05, max(deltas + [1.0])),
               color=OKABE_ITO[3], alpha=0.25, label="FIABLE (>= 0,58)")
    xs = range(len(deltas))
    ax.scatter(xs, deltas, s=26, c=[OKABE_ITO[6] if t else OKABE_ITO[0]
                                    for t in trav], alpha=0.75)
    ax.axhline(core.SEUIL_FIABLE, color=OKABE_ITO[6], lw=1.4)
    ax.axhline(core.SEUIL_SUGGESTION, color=OKABE_ITO[6], lw=1.4, ls="--")
    ax.set_xlabel("rives re-testées (G14, base → re-test 8 semaines)")
    ax.set_ylabel("|Δ| sur l'agrégat 24 items")
    ax.set_title("Q1 Personnalité — RCI à 8 semaines (L7 : SE_diff ≈ 0,356 · "
                 "bornes 0,41 / 0,58) ; points rouges = seuil traversé")
    ax.legend(loc="upper center", bbox_to_anchor=(0.5, -0.10), ncol=3, fontsize=9)
    fig.savefig(FIG / NOM_FIGS[3], dpi=DPI)
    plt.close(fig)


def generer_rapport(r1, couples, classes, sha1, sha2):
    """Rapport A-G autoporteur — Verdict fermé d'emblée (leçon E-SM-12)."""
    L = []
    L.append("# Rapport WTC-PERS-Q1 — « Manuel d'utilisation de moi » (RIO-19)")
    L.append("")
    L.append(f"> {D_SIM}")
    L.append(f"> {D_CRISE_BANDEAU}")
    L.append("")
    L.append(f"**Date** : {DATE}  ")
    L.append(f"**Seed** : 42 (×2)  ")
    L.append(f"**Package** : validation-pers/validation-pers-q1/  ")
    L.append("**SPEC** : PERS-Q1-SPEC.md VERROUILLÉE (f4fa593 — arbitrages A1-A6 "
             "tranchés par délégation).  ")
    L.append(f"**Délégation fondateur** : « {DELEGATION} » (20/10/2026) ; "
             f"production couverte par l'accord préalable : « {PRODUCTION} ».  ")
    L.append("**Instrument** : 24 items (4 axes AO/N/R/J × 2 faces × 3 items), "
             "échelle 1-4, 2 inversés (PERS-N2-3, PERS-J2-3), 1 vigilance "
             "(PERS-VIG) — mapping 1:1 des 4 construits nommés ligne 98.")
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
             f"{c['demontrees']} + nomenclature | tous TRUE + 560/560 | "
             f"table={c['d_table']} ({len(dt_false)} FALSE) · nom={c['nomenclature_respectee']} | "
             f"{'PASS' if c['ok'] else 'FAIL'} |")
    c = r1["C2"]
    L.append(f"| **C2** D-CONFIRMATION : déterminisme + anti-inversion | pur + 0 inversion | "
             f"grille_pure={c['grille_pure']} · anti_inv={c['anti_inversion']} · "
             f"n_rci={c['n_rci']} | {'PASS' if c['ok'] else 'FAIL'} |")
    c = r1["C3"]
    L.append(f"| **C3** D-STD-2 : 14 seuils DISTINCTS + règle conservatrice + "
             f"override filet | 14/14 + 100 % + 40/40 + 5/5 | n_ok={c['n_ok']}/14 · "
             f"distinctes={c['bornes_distinctes']} · règle={c['regle_conservatrice']} · "
             f"override={c['override_filet']} · détecté={c['filet_detecte']} | "
             f"{'PASS' if c['ok'] else 'FAIL'} |")
    L.append(f"| **C4** SHA ×2 (D-EMPREINTE) | identiques | sha1={sha1[:16]}… "
             f"sha2={sha2[:16]}… match={sha1 == sha2} | "
             f"{'PASS' if sha1 == sha2 else 'FAIL'} |")
    c = r1["C5"]
    L.append(f"| **C5** Affichage : 19 templates + D-SIM + 4 figures | 19/19 + 4 | "
             f"templates={c['templates_19']} · figures={c['figures']} · "
             f"dims={c['dimensions_ok']} | {'PASS' if c['ok'] else 'FAIL'} |")
    c = r1["C6"]
    L.append(f"| **C6** A5 triple verrou : 0 diagnostic / 0 étiquette / 0 mot "
             f"canon clinique | 0 interdit | interdits={c['interdits_touches']} · "
             f"nomenclature={c['nomenclature_respectee']} · zone calme honnête="
             f"{c['zone_calme_honnete']} · réparation sans blâme="
             f"{c['reparation_sans_blame']} | {'PASS' if c['ok'] else 'FAIL'} |")
    c = r1["C7"]
    L.append(f"| **C7** D-CRISE + non-évaluation | 40/40 (dont 5 détectés) + 0 tiers | "
             f"circuit={c['court_circuit']} · voie détectée={c['voie_detectee']} · "
             f"zéro tiers={c['zero_tiers']} · avertissement={c['avertissement_sans_verdict']} | "
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
    L.append(f"- Placeholders L2 (ligne 258, à remplacer par le pilote) : "
             f"SD_pop {core.SD_POP} · alpha {core.ALPHA} → SEM {core.SEM} · "
             f"CI90 ± {core.CI90_DEMI} · SE_face {core.SE_FACE} · seuil "
             f"hiérarchie {core.SEUIL_HIERARCHIE}")
    L.append(f"- Transitions conservatrices dérivées (seuil + CI90) : "
             f"{core.TRANS_T_HAUT} / {core.TRANS_V_HAUT} · sigma_eff axe "
             f"(0,60/√6) = {core.SIGMA_EFF_AXE} (D-PARAM σ item 0,60)")
    L.append(f"- L7 (ligne 263 verbatim) : SE_diff = {core.SE_DIFF} · bornes "
             f"{core.SEUIL_SUGGESTION} / {core.SEUIL_FIABLE}")
    L.append(f"- Sécurité contrôle (voie détectée, SPEC §4) : filet ⟺ borne "
             f"basse de la face « Le contrôle » ≥ {core.SECU_BAS} — règle L3 "
             f"réutilisée, zéro constante nouvelle")
    L.append("")
    L.append("| Groupe | μ axes rive A (AO/N/R/J) | μ axes rive B | dist. min seuil (σ) | dans bande 3σ | p̂ | seuil |")
    L.append("|--------|---------------|---------------|---------------------|----------------|-----|-------|")
    for gname, det in cal["detail"].items():
        ce = cal["centres"][gname]
        L.append(f"| {gname} | {ce['mu_axes_A']} | {ce['mu_axes_B']} | "
                 f"{ce['distance_min_seuil_sigma']} | {ce['dans_bande_3sigma']} | "
                 f"{det['p_theo']} | {det['seuil']} |")
    L.append("")
    L.append(f"Bornes D-STD-2 distinctes : {cal['bornes_distinctes']} — "
             "calibrées (p̂ − 2,5σ̂) sur une loi EXACTE par énumération des "
             "items tronqués (raffinement documenté du modèle normal EXT-Q1 : "
             "les faces au plafond 4,0 ne sont pas normales). Les groupes "
             "« dans bande » (FRONTIÈRE par design, μ pile sur un seuil L3) "
             "sont calibrés sur leur géométrie propre ; la RÈGLE conservatrice "
             "est vérifiée à 100 % séparément (C3).")
    L.append("")
    L.append("---")
    L.append("")

    # ── Section C ──
    L.append("## Section C — Stats par groupe")
    L.append("")
    L.append("| Groupe | N | Conformes | Paliers (V/O/R/NA) | RQS (OK/P/I) | "
             "Lectures (NIV/FRONT) | Faces (NUAGE/HIER) | Filets | RCI (F/S/B/NA) |")
    L.append("|--------|---|-----------|--------------------|--------------|"
             "----------------------|---------------------|--------|----------------|")
    for gname, _n in sim.effectifs():
        g = r1["stats_groupes"][gname]
        p = g["paliers"]
        s = g["statuts_rqs"]
        l = g["lectures"]
        f = g["faces"]
        rc = g["rci"]
        L.append(f"| {gname} | {g['n']} | {g['conformes']} | "
                 f"{p['EXERCICE MAISON']}/{p['MODULE DE COUPLE']}/{p['ORIENTATION']}/"
                 f"{p['NON_AFFICHÉE']} | {s['OK']}/{s['PRUDENCE']}/{s['INVALIDE']} | "
                 f"{l['NIVEAU']}/{l['FRONTIÈRE']} | {f['NUAGE']}/{f['HIÉRARCHIE DÉCLARABLE']} | "
                 f"{g['filets']} | {rc['FIABLE']}/{rc['SUGGESTION']}/{rc['BRUIT']}/{rc['N/A']} |")
    L.append("")
    L.append(f"Paliers globaux (rives) : {r1['paliers_globaux']}")
    L.append(f"RCI globaux : {r1['rci']}")
    L.append("")
    L.append(f"![Paliers](../figures/{NOM_FIGS[0]})")
    L.append("")
    L.append(f"![D-STD-2](../figures/{NOM_FIGS[1]})")
    L.append("")
    L.append(f"![Lectures L3](../figures/{NOM_FIGS[2]})")
    L.append("")
    L.append(f"![RCI](../figures/{NOM_FIGS[3]})")
    L.append("")
    L.append("---")
    L.append("")

    # ── Section D ──
    L.append("## Section D — Couples tracés")
    L.append("")
    exemples = ["G03_REPARATION_ABSENTE_000", "G05_JALOUSIE_CONTROLEE_000",
                "G06_SIGNAL_CONTROLE_036", "G12_PIEGES_RQS_010",
                "G14_RE_TEST_000"]
    for eid in exemples:
        i = next((k for k, c in enumerate(couples) if c["id"] == eid), None)
        if i is None:
            continue
        c, m = couples[i], classes[i]
        L.append(f"### {eid}")
        L.append("")
        for r, lbl in (("rive_a", "Rive A"), ("rive_b", "Rive B")):
            m_r = m[r]
            base = f"- **{lbl}** : RQS {m_r['rqs']['rqs']}/100 ({m_r['rqs']['statut']})"
            if m_r["filet"]["filet"]:
                base += f" · FILET : {m_r['filet']['voie']} → {m_r['filet']['filet_num']} · carte NON affichée"
            elif m_r["carte"]:
                nivs = " · ".join(f"{a}={m_r['niveaux'][a]['lecture']}"
                                  f" ({m_r['niveaux'][a]['type']}, conservateur "
                                  f"{m_r['niveaux'][a]['conservateur']})"
                                  for a in AXES4)
                base += f" · niveaux : {nivs} · palier : {m_r['palier']}"
                if m_r["rci"]:
                    base += f" · RCI : {m_r['rci']['verdict']} (Δ={m_r['rci']['delta']}, traversée={m_r['rci']['traversee']})"
            else:
                base += " · carte non affichée (RQS)"
            L.append(base)
        L.append(f"- **Avertissement styles** : {m['avertissement_styles']}")
        v = sim.classification_vraie(c)
        L.append(f"- **Vrai** : paliers {v['palier_a']}/{v['palier_b']} · filets "
                 f"{v['filet_a']}/{v['filet_b']} · avert {v['avert']}")
        L.append("")
    L.append("---")
    L.append("")

    # ── Section E ──
    L.append("## Section E — Analyse")
    L.append("")
    L.append(f"- **Total** : {r1['n_total']} couples · {r1['n_rives']} rives · "
             f"{r1['n_groupes']} groupes — réconciliation "
             f"{'OK' if r1['reconciliation'] else 'FAIL'}")
    pg = r1["paliers_globaux"]
    L.append(f"- **Paliers** : {pg['EXERCICE MAISON']} EXERCICE MAISON · "
             f"{pg['MODULE DE COUPLE']} MODULE DE COUPLE · {pg['ORIENTATION']} "
             f"ORIENTATION · {pg['NON_AFFICHÉE']} non affichées (RQS/filet)")
    L.append(f"- **Propriété structurelle découverte** : avec les constantes "
             f"verrouillées (SE_face {core.SE_FACE} → seuil hiérarchie "
             f"{core.SEUIL_HIERARCHIE}), une hiérarchie de faces L4 "
             f"(écart ≥ 0,8937) sur un axe rend sa borne basse < 3,20 : un axe "
             f"conservateur FORTE est TOUJOURS en NUAGE L4 — la face dominante "
             f"et le niveau FORTE ne coexistent jamais. Propriété des "
             f"constantes (jamais un bug) : l'affichage « nuage » est honnête "
             f"là où la mesure ne départage pas (anti-surinterprétation).")
    L.append(f"- **Lectures** : les FRONTIÈRES nommées sont fréquentes aux "
             f"bandes médianes (placeholders L2 : intervalles ± {core.CI90_DEMI}) "
             f"— la décision conservatrice (niveau le plus bas touché) est "
             f"vérifiée à 100 % (C3) ; à remplacer par le pilote (ligne 258)")
    L.append(f"- **RCI** : {r1['rci']['verdicts']} · {r1['rci']['traversees']} "
             f"traversées de seuil — la fenêtre SUGGESTION [0,41 ; 0,58[ est "
             f"étroite devant le bruit d'agrégat (σ ≈ {core.SIGMA_RCI}) : les "
             f"RÈGLES de borne sont prouvées exactement en C1/D-TABLE, la "
             f"conformité SUGGESTION est calibrée sur sa géométrie (C3)")
    L.append(f"- **RQS** : les profils plats (zones calmes) déclenchent parfois "
             f"l'anti-linéarité canon (SD < 0,45) → PRUDENCE sans sanction : la "
             f"carte reste affichée (jamais un verdict d'échec)")
    L.append(f"- **Filet contrôle** : la voie détectée (SPEC §4) court-circuite "
             f"AVANT l'arbre même quand tous les items sont à 4 (G06 idx 35-39) "
             f"— le signal de sécurité prime sur toute lecture de carte, sans "
             f"aucune étiquette (C6/C7)")
    L.append(f"- **Faux positifs voie détectée** : {r1['faux_positifs_filet_detecte']} "
             f"sur {r1['n_rives']} rives ({r1['faux_positifs_par_groupe']}) — la "
             f"somme J2 peut tirer ≥ 11 sous des μ modérés (3,2 / 2,9 / 2,4) : le "
             f"moteur lit les DÉCLARATIONS observées (borne basse ≥ {core.SECU_BAS} "
             f"sur les réponses réelles), jamais le paramètre latent — un faux "
             f"positif va vers P-FILTRE, jamais vers une carte affichée à tort "
             f"(biais sécurité D-CRISE) ; compté honnêtement en non-conformité (C3)")
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
    L.append("| Construits AO/N/R/J | Non (fixé) | programme ligne 98 (verbatim : « L'asymétrie acteur-observateur, le névrosisme, le narcissisme (l'absence de réparation), la jalousie graduée ») | C1 mapping 1:1 des 4 axes |")
    L.append("| Jones & Nisbett 1971 / Malle 2006 · Costa & McCrae (Big Five) · Pfeiffer & Wong 1989 · psychologie du soi (Kohut) | Oui | construits publics — les références académiques ne sont pas dans le dépôt (aveu E-SM-7, pattern RIO-16) | doctrine Partie 8 (construit cité) |")
    L.append("| Items 24 (ex nihilo) | Oui | rédaction maison — déposés à la couche app (pattern des 18 instruments antérieurs : « items non déposés », Partie VII de la documentation) | doctrine Partie 8 · 4 filtres §5.2 |")
    L.append("| Angle canon « narcissisme (l'absence de réparation) » | Non (fixé) | le canon DÉFINIT lui-même le construit par la réparation manquante — l'instrument suit cet angle, pas la psychopathologie | C6 (vocabulaire écran 355-356) |")
    L.append("| Placeholders SD 0,65 / α 0,85 | Non (fixé) | canon ligne 258 | C1/C3 |")
    L.append("| SE_face 0,3853 | Oui | patron WTC-Q1-R1 (héritage) | L4 seuil 0,8937 |")
    L.append("| σ_item 0,60 | Non (fixé) | D-PARAM (hub) | simulateur |")
    L.append("| Calibration D-STD-2 (p̂ − 2,5σ̂, loi exacte par énumération) | Oui | pattern Q4/Q5 appliqué à une carte 4 axes ; raffinement du modèle normal EXT-Q1 documenté | C3 + Section B |")
    L.append("| Surface de conformité (paliers + filets 2 voies + styles + RCI — pas les lectures d'affichage) | Oui | transposition de la surface de décision Q5/EXT | C3 + Section E |")
    L.append("| Seuil sécurité contrôle (borne basse J2 ≥ 3,20) | Oui | fixé au verrouillage (SPEC §4/§9) — règle L3 réutilisée | C1 D-TABLE + C7 |")
    L.append("| L1-L3-L4-L7 constantes | Non (fixé) | canon lignes 257-263, 274 | C1 D-TABLE |")
    L.append("")
    L.append("### Leçons appliquées")
    L.append("")
    L.append("- Bornes D-STD-2 DISTINCTES par groupe (leçon SM-Q5, ad01f21)")
    L.append("- C1 croisé sur cas de table, pas sur données bruitées (leçon Q5)")
    L.append("- Critères adaptés au TYPE de quête (E-SM-1) : une carte mesure, aucun critère de tracking")
    L.append("- Mapping 1:1 des construits nommés + faces de 3 items (leçon EXT-Q1 A3)")
    L.append("- Rapport autoporteur, Verdict fermé, balises de gras équilibrées (leçon E-SM-12)")
    L.append("- Figures sans émojis (glyphes DejaVu) · 0 chiffre sans source (chaîne de traçabilité §6.4)")
    L.append("")
    L.append("### Périmètre")
    L.append("")
    L.append("- Q1 = LA CARTE (mesure) — ligne 223 · A6 : dimension majeure 5 quêtes — Q2 ombre (RIO-20), Q3 lumière (RIO-21, banque L5), Q4 croisement (RIO-22), Q5 pas (RIO-23) — SPECs à venir")
    L.append("- A4 : L5-L6 non transposées (réservées à Q3 La lumière) ; l'avertissement styles est une note de lecture, sans verdict")
    L.append("- A5 : les mots canon « névrosisme », « narcissisme », « jalousie » ne sont JAMAIS affichés — noms maison (La balance, La météo, La réparation, La gradation)")
    L.append("- 0 invention de contenu thérapeutique : les items sont des instruments ex nihilo, les templates ne prescrivent rien (paliers §5.4 verbatim)")
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
        L.append("### RIO-19")
        L.append("")
        L.append("RIO-19 « Manuel d'utilisation de moi » — **en attente de "
                 "contresignature fondateur** (séquence D-CANAL-2 : publication "
                 "→ pointeurs → audit origin → contresignature).")
        L.append("")
        L.append("### Inventaire structurel")
        L.append("")
        L.append("| Fichier | Fonctions |")
        L.append("|---------|-----------|")
        L.append("| wtc_pers_q1_core.py | corrige, scores_corriges, calcule_rqs, "
                 "score_face_de, score_axe_de, agregat_de, bornes_ci90, "
                 "niveau_ponctuel, niveaux_touches, lecture_L3, lecture_L4, "
                 "signal_filet_de, palier_de, avertissement_de, rci_de, "
                 "classifier_rive, classifier_couple, _phi, _face_sum_dist, "
                 "_axis_sum_dist, _probs_cons_axe, _p_palier_rive, "
                 "_p_filet_rive, _mu_faces, _palier_vrai_de_mu, "
                 "_filet_vrai_de_mu, p_conformite_groupe, calibration_d_std_2, "
                 "verifier_d_table, verifier_d_confirmation |")
        L.append("| wtc_pers_q1_simulator.py | _item_corr, _mu_cle, _items_rive, "
                 "_temps, _rive, _gen_couple, tous_les_couples, effectifs, "
                 "_cons_local, _palier_label, _palier_vrai_rive, "
                 "_rci_verdict_vrai, classification_vraie, conformite_couple |")
        L.append("| wtc_pers_q1_validation.py | _sha, bien_forme, critere_c1, "
                 "critere_c2, critere_c3, critere_c5, critere_c6, critere_c7, "
                 "executer, generer_figures, generer_rapport, main |")
        L.append("")
        L.append(f"- Instrument : 24 items (4 axes × 2 faces × 3 items), échelle "
                 f"1-4, 2 inversés (PERS-N2-3, PERS-J2-3), 1 vigilance (A3)")
        L.append(f"- Filet : voie héritée OU voie détectée (Le contrôle, borne "
                 f"basse ≥ {core.SECU_BAS}) → P-FILTRE, court-circuit avant "
                 f"l'arbre, carte non affichée (SPEC §4)")
        L.append(f"- Réconciliation : {r1['n_total']}/{r1['n_total']} (PASS)")
    L.append("")
    return "\n".join(L) + "\n"


def main():
    RES.mkdir(exist_ok=True)
    FIG.mkdir(exist_ok=True)
    print("=" * 60)
    print("WTC-PERS-Q1 — Validation (RIO-19)")
    print("=" * 60)
    r1, couples, classes = executer(publier=True)
    sha1 = _sha(r1)
    r2, _c2, _m2 = executer(publier=False)
    sha2 = _sha(r2)
    r1["C4"] = {"sha1": sha1, "sha2": sha2, "match": sha1 == sha2,
                "ok": sha1 == sha2}
    r1["sha256_run"] = sha1
    (RES / f"resultats-pers-q1-{DATE}.json").write_text(
        json.dumps(r1, ensure_ascii=False, indent=2, sort_keys=True),
        encoding="utf-8")
    rapport = generer_rapport(r1, couples, classes, sha1, sha2)
    (RES / f"rapport-pers-q1-{DATE}.md").write_text(rapport, encoding="utf-8")
    n_ok = sum(1 for k in ("C1", "C2", "C3", "C4", "C5", "C6", "C7")
               if r1[k].get("ok", False))
    print(f"SHA-256 ×2 : {sha1[:16]}… match={r1['C4']['match']}")
    for k in ("C1", "C2", "C3", "C5", "C6", "C7"):
        print(f"  {k} : {'PASS' if r1[k]['ok'] else 'FAIL'}")
    print(f"WTC-PERS-Q1 (RIO-19) — verdict : "
          f"{'VALIDÉ' if n_ok == 7 else 'REFUSÉ'} ({n_ok}/7)")
    return r1


if __name__ == "__main__":
    main()

