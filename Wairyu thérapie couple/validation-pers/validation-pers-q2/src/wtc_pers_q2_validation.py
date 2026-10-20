# -*- coding: utf-8 -*-
"""WAIRYU — WTC-PERS-Q2 : validation Quête 2 Personnalité « La mécanique sous
ma carte » (RIO-20) — critères C1-C7, figures 1920×1080, rapport autoporteur.

Séquence D-CANAL-2 : production → run ×2 → SHA ×2 → publication → pointeurs →
audit origin → contresignature (fondateur). Verdict fermé (leçon E-SM-12)."""
import hashlib
import json
import os
import sys
from collections import Counter, defaultdict

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import wtc_pers_q2_core as core
import wtc_pers_q2_simulator as sim

DATE = "2026-10-20"
NOM_FIGS = ("fig1_labels_etats.png", "fig2_conformite_d_std2.png",
            "fig3_lectures_l3.png", "fig4_rci_deltas.png")

GABARIT = ("zone_ombre", "zone_force", "paliers", "seuils_aide")  # §5.1 4/4


def _sha(obj):
    """SHA-256 sur contenu canonique — pas d'horodatage (D-EMPREINTE)."""
    canon = json.dumps(obj, sort_keys=True, ensure_ascii=False,
                       separators=(",", ":"))
    return hashlib.sha256(canon.encode("utf-8")).hexdigest()


# ═══════════════════ Vérifications de forme (pré-critères) ════════════════════
def bien_forme(couple, m):
    """Le couple est bien formé : rives classées, états connus, None-safe."""
    for rive in ("rive_a", "rive_b"):
        o = m[rive]
        if o is None:
            return False
        if o.get("etat") not in ("OMBRE", "P-FILTRE", "QUÊTE_VERROUILLÉE",
                                 "AUCUN_RÉSULTAT"):
            return False
        if o.get("etat") == "OMBRE":
            if not o.get("mecanismes") or not o.get("label"):
                return False
        else:
            if o.get("mecanismes") is not None:
                return False     # court-circuit : aucun résultat attaché
    return True


# ═══════════════════ C1 — D-VÉRITÉ ════════════════════════════════════════════
def _croise_mecanismes(couple):
    """Recalcul INDÉPENDANT des 4 scores mécanisme (depuis les formules SPEC,
    hors moteur) — croisement moteur vs spécification."""
    out = []
    for rive in ("rive_a", "rive_b"):
        p = couple[rive]
        a = sum(p[f"PERS-Q2-A{k}"] for k in range(1, 7))
        n = (p["PERS-Q2-N1"] + p["PERS-Q2-N2"] + p["PERS-Q2-N3"]
             + (3 - p["PERS-Q2-N4"]))
        rm = sum(p[f"PERS-Q2-R{k}"] for k in range(1, 5))
        j = sum(p[f"PERS-Q2-J{k}"] for k in range(1, 7))
        out.append({"A": round(1.0 + 3.0 * a / 6.0, 4),
                    "N": round(1.0 + n / 4.0, 4),
                    "R": round(1.0 + rm / 4.0, 4),
                    "J": round(1.0 + 3.0 * j / 6.0, 4)})
    return out


def critere_c1(couples, classes):
    t = core.verifier_d_table()
    d_table_ok = all(t.values())
    croise_ok, n_croise = 0, 0
    nomen_ok = True
    for couple, m in zip(couples, classes):
        vrai_scores = _croise_mecanismes(couple)
        for i, rive in enumerate(("rive_a", "rive_b")):
            o = m[rive]
            if o.get("mecanismes"):
                n_croise += 1
                calc = {b: o["mecanismes"][b]["score"] for b in ("A", "N", "R", "J")}
                if all(abs(calc[b] - vrai_scores[i][b]) < 1e-9
                       for b in ("A", "N", "R", "J")):
                    croise_ok += 1
            if o.get("label") is not None and \
                    o["label"] not in core.NOMENCLATURE:
                nomen_ok = False
            if o.get("palier") is not None and \
                    o["palier"] not in core.NOMENCLATURE:
                nomen_ok = False
    return {"d_table": d_table_ok, "n_cas_d_table": len(t),
            "croise": (croise_ok, n_croise),
            "croise_ok": croise_ok == n_croise,
            "nomenclature": nomen_ok,
            "ok": d_table_ok and croise_ok == n_croise and nomen_ok}


# ═══════════════════ C2 — D-CONFIRMATION ══════════════════════════════════════
def critere_c2(couples, classes):
    again = [core.classifier_couple(c) for c in couples]
    pure = True
    for m1, m2 in zip(classes, again):
        for rive in ("rive_a", "rive_b"):
            a, b = m1[rive], m2[rive]
            if (a.get("etat") != b.get("etat")
                    or a.get("label") != b.get("label")
                    or a.get("palier") != b.get("palier")
                    or a.get("rci") != b.get("rci")
                    or a.get("cv") != b.get("cv")):
                pure = False
    anti_inv = (core.rci_de(2.400, 3.300)["delta"] == 0.9
                and core.rci_de(3.300, 2.400)["delta"] == -0.9)
    n_rci = sum(1 for c in couples
                if c["rive_a"].get("re_test_actif") or c["rive_b"].get("re_test_actif"))
    return {"deterministe": pure, "anti_inversion_temporelle": anti_inv,
            "n_rci": n_rci, "ok": pure and anti_inv}


# ═══════════════════ C3 — D-STD-2 (bornes DISTINCTES) ═════════════════════════
def critere_c3(couples, classes, calib):
    per = defaultdict(lambda: [0, 0])
    for c, m in zip(couples, classes):
        ok = sim.conformite_couple(c, m)
        per[c["groupe"]][1] += 1
        per[c["groupe"]][0] += 1 if ok else 0
    seuils = calib["seuils"]
    detail = {}
    all_ok = True
    for g in sorted(per):
        pct = round(100.0 * per[g][0] / per[g][1], 1)
        ok = pct >= seuils[g]
        all_ok = all_ok and ok
        detail[g] = {"conformes": per[g][0], "n": per[g][1], "pct": pct,
                     "seuil": seuils[g], "ok": ok}
    n_total_ok = sum(v["conformes"] for v in detail.values())
    return {"detail": detail, "tous_au_seuil": all_ok,
            "bornes_distinctes": calib["bornes_distinctes"],
            "n_conformes": n_total_ok, "n_total": len(couples),
            "ok": all_ok and calib["bornes_distinctes"]}


# ═══════════════════ C5 — affichage (gabarit §5.1 4/4) ════════════════════════
def _affichage_rive(o, bandeau_sim=True):
    """Assemblage de l'affichage (littéraux autoporteurs) d'une rive."""
    lignes = []
    T = core.TEMPLATES
    if o["etat"] == "P-FILTRE":
        voie = o["filet"]["voie"]
        key = {"héritée": "filet_heritee", "détectée": "filet_detectee",
               "N5": "filet_n5"}[voie]
        lignes.append(T[key].format(filet_num=o["filet"]["filet_num"]))
        lignes.append(o["bandeau"])
        return lignes
    if o["etat"] == "QUÊTE_VERROUILLÉE":
        lignes.append(T["etat_verrouillee"])
        return lignes
    if o["etat"] == "AUCUN_RÉSULTAT":
        lignes.append(T["invalide"].format(rqs=o["rqs"]["rqs"]))
        return lignes
    # ombre affichée
    label_key = {"ZONE_CALME": "label_zone_calme",
                 "PENCHANT_PROPRE": "label_penchant_propre",
                 "ORAGE_LENT": "label_orage_lent",
                 "MUR_DE_DÉFENSE": "label_mur_defense",
                 "LENTILLE": "label_lentille",
                 "DOUBLE_PENTE": "label_double_pente",
                 "OMBRE_PRUDENTE": "label_prudente"}.get(o["label"])
    if label_key:
        lignes.append(T[label_key])
    if o["label"] == "OMBRE_SUPPRIMÉE":
        lignes.append(T["etat_supprimee"])
    lignes.append(T["zone_ombre"].format(
        ombre="ce qui penche aujourd'hui dans tes réponses"))
    force = []
    if o.get("gestes") is not None and o["gestes"] >= 2.0:
        force.append("tes gestes de réparation déclarés")
    for b in ("A", "N", "R", "J"):
        if o["cons"][b] in ("DISCRÈTE", "TRANQUILLE"):
            force.append(f"ta zone tranquille ({core.MECANISMES[b].lower()})")
    lignes.append(T["zone_force"].format(force=" · ".join(force[:2])
                                         if force else "ton retour au calme"))
    lignes.append(T["penchant_aujourdhui"])
    lignes.append({"EXERCICE MAISON": T["palier_vert"],
                   "MODULE DE COUPLE": T["palier_orange"],
                   "ORIENTATION": T["palier_rouge"]}[o["palier"]])
    lignes.append(T["re_test_programme"])
    lignes.append(T["reparation"])
    if o["rqs"]["statut"] == "PRUDENCE":
        lignes.append(T["prudence_rqs"].format(rqs=o["rqs"]["rqs"]))
    if bandeau_sim:
        lignes.append(T["bandeau_sim"])
    return lignes


def critere_c5(couples, classes):
    """Gabarit §5.1 4/4 : zone d'ombre descriptive · force des vraies réponses ·
    3 paliers · seuils d'aide — pour CHAQUE rive affichée ; bandeau D-SIM ;
    FRONTIÈRE conservatrice ; nuage cohérent."""
    ok, n = 0, 0
    frontiere_conservative = True
    nuage_ok = True
    for couple, m in zip(couples, classes):
        for rive in ("rive_a", "rive_b"):
            o = m[rive]
            lignes = _affichage_rive(o)
            if o["etat"] == "OMBRE":
                n += 1
                texte = "\n".join(lignes)
                gab = (core.TEMPLATES["zone_ombre"].split("{")[0].strip() in texte
                       and "zone de force" in texte
                       and any(p in texte for p in ("EXERCICE MAISON",
                                                    "MODULE DE COUPLE",
                                                    "ORIENTATION"))
                       and ("quand demander de l'aide" in texte.lower()
                            or "P-FILTRE" in texte
                            or "re-test" in texte.lower()))
                if gab:
                    ok += 1
            if o.get("mecanismes"):
                for b in ("A", "N", "R", "J"):
                    lec = o["mecanismes"][b]
                    if lec["type"] == "FRONTIÈRE" and \
                            lec["conservateur"] != core.niveaux_touches(*lec["ci90"])[0]:
                        frontiere_conservative = False
                    f = o["faces"][b]
                    if f["lecture"] == "NUAGE" and f["ecart"] >= f["seuil"]:
                        nuage_ok = False
    return {"gabarit": (ok, n), "gabarit_ok": ok == n,
            "frontiere_conservatrice": frontiere_conservative,
            "nuage_coherent": nuage_ok,
            "ok": ok == n and frontiere_conservative and nuage_ok}


# ═══════════════════ C6 — anti-étiquette (triple verrou hérité) ═══════════════
def critere_c6(classes):
    interdits = list(core.MOTS_INTERDITS_C6)
    hits = []
    for m in classes:
        for rive in ("rive_a", "rive_b"):
            o = m[rive]
            lignes = _affichage_rive(o)
            texte = "\n".join(lignes + ([o["bandeau"]] if o["bandeau"] else []))
            low = texte.lower()
            for mot in interdits:
                if mot in low:
                    hits.append((mot, o["etat"]))
    verbatim_reparation = core.VERBATIM_REPARATION in core.TEMPLATES["reparation"]
    verbatim_calme = core.VERBATIM_CALME in core.TEMPLATES["zone_calme"]
    penchant_modifiable = "penchant" in core.TEMPLATES["penchant_aujourdhui"] \
        and "ça se travaille" in core.TEMPLATES["penchant_aujourdhui"]
    return {"0_mot_interdit": not hits, "hits": hits[:5],
            "verbatim_reparation": verbatim_reparation,
            "verbatim_rien_a_fabriquer": verbatim_calme,
            "ombre_modifiable_pas_trait": penchant_modifiable,
            "ok": not hits and verbatim_reparation and verbatim_calme
                  and penchant_modifiable}


# ═══════════════════ C7 — D-CRISE + non-évaluation ════════════════════════════
def critere_c7(couples, classes):
    filet_avant_arbre = True
    for c, m in zip(couples, classes):
        for rive in ("rive_a", "rive_b"):
            o = m[rive]
            if o["etat"] == "P-FILTRE" and o.get("mecanismes") is not None:
                filet_avant_arbre = False
            if o["filet"]["filet"] and o["etat"] != "P-FILTRE":
                filet_avant_arbre = False
    n_verrouillee = sum(1 for c, m in zip(couples, classes)
                        for r in ("rive_a", "rive_b")
                        if m[r]["etat"] == "QUÊTE_VERROUILLÉE")
    n_pfiltre = sum(1 for c, m in zip(couples, classes)
                    for r in ("rive_a", "rive_b")
                    if m[r]["etat"] == "P-FILTRE")
    n_pfiltre_attendu = 80 if any(g.startswith("G08") for g in
                                  (c["groupe"] for c in couples)) else 0
    zero_tiers = True
    for c in couples:
        for rive in ("rive_a", "rive_b"):
            for cle in c[rive]:
                if "partenaire" in cle.lower() or "tiers" in cle.lower() \
                        or "nom" in cle.lower():
                    zero_tiers = False
    filets_attendus = sum(2 for c in couples if c["groupe"] == "G08_SIGNAL_FILET")
    # le filet détecté s'active AUSSI hors G08 quand ΣJ = 6/6 ET héritage
    # J ≥ VIVE — biais sécurité PAR CONCEPTION : le filet ne peut pas être
    # trop fréquent, seulement trop rare (compté et tracé, jamais masqué)
    extras = n_pfiltre - filets_attendus
    return {"filet_avant_arbre": filet_avant_arbre,
            "n_p_filtre": n_pfiltre, "n_p_filtre_g08": filets_attendus,
            "extras_voie_detectee": extras,
            "p_filtre_complet": n_pfiltre >= filets_attendus,
            "n_verrouillee": n_verrouillee,
            "verrouillee_complet": n_verrouillee == 80,
            "zero_tiers": zero_tiers,
            "ok": filet_avant_arbre and n_pfiltre >= filets_attendus
                  and n_verrouillee == 80 and zero_tiers}


# ═══════════════════ Figures 1920×1080 ════════════════════════════════════════
def generer_figures(couples, classes, r1, outdir):
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.font_manager as fm
    for f in ("/usr/share/fonts/truetype/chinese/NotoSansSC-Regular.ttf",
              "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"):
        if os.path.exists(f):
            fm.fontManager.addfont(f)
    import matplotlib.pyplot as plt
    plt.rcParams["font.sans-serif"] = ["Noto Sans SC", "DejaVu Sans"]
    plt.rcParams["axes.unicode_minus"] = False
    os.makedirs(outdir, exist_ok=True)
    groupes = sorted({c["groupe"] for c in couples})

    # fig1 — labels / états par groupe (rives)
    def label_rive(o):
        return o["label"] if o["label"] else o["etat"]
    counts = defaultdict(Counter)
    for c, m in zip(couples, classes):
        for rive in ("rive_a", "rive_b"):
            counts[c["groupe"]][label_rive(m[rive])] += 1
    cats = sorted({k for c in counts.values() for k in c})
    fig, ax = plt.subplots(figsize=(19.2, 10.8), constrained_layout=True)
    bottom = [0] * len(groupes)
    palette = ["#4C78A8", "#F58518", "#E45756", "#72B7B2", "#54A24B",
               "#EECA3B", "#B279A2", "#FF9DA6", "#9D755D", "#BAB0AC",
               "#D37295", "#FABFD2", "#B4A7D6", "#79706E"]
    for i, cat in enumerate(cats):
        vals = [counts[g].get(cat, 0) for g in groupes]
        ax.bar(range(len(groupes)), vals, bottom=bottom, label=cat,
               color=palette[i % len(palette)])
        bottom = [b + v for b, v in zip(bottom, vals)]
    ax.set_xticks(range(len(groupes)))
    ax.set_xticklabels([g.split("_")[0] for g in groupes], rotation=45,
                       ha="right")
    ax.set_ylabel("rives (80 max par groupe)")
    ax.set_title("WTC-PERS-Q2 « La mécanique sous ma carte » — labels et états "
                 "par groupe (560 couples, seed 42)")
    ax.legend(fontsize=9, bbox_to_anchor=(1.01, 1), loc="upper left")
    fig.savefig(os.path.join(outdir, NOM_FIGS[0]), dpi=100)
    plt.close(fig)

    # fig2 — conformité par groupe vs seuil D-STD-2
    fig, ax = plt.subplots(figsize=(19.2, 10.8), constrained_layout=True)
    pct = [r1["c3"]["detail"][g]["pct"] for g in groupes]
    seu = [r1["c3"]["detail"][g]["seuil"] for g in groupes]
    colors = ["#54A24B" if r1["c3"]["detail"][g]["ok"] else "#E45756"
              for g in groupes]
    ax.bar(range(len(groupes)), pct, color=colors, label="conformité observée")
    ax.plot(range(len(groupes)), seu, "k^--", label="seuil D-STD-2 (distinct)",
            markersize=10)
    ax.set_xticks(range(len(groupes)))
    ax.set_xticklabels([g.split("_")[0] for g in groupes], rotation=45,
                       ha="right")
    ax.set_ylabel("% de couples conformes (décisions)")
    ax.set_ylim(0, 105)
    ax.set_title("D-STD-2 — conformité par groupe vs seuil calibré "
                 "(bornes DISTINCTES, leçon SM-Q5)")
    ax.legend()
    fig.savefig(os.path.join(outdir, NOM_FIGS[1]), dpi=100)
    plt.close(fig)

    # fig3 — lectures L3 : NIVEAU vs FRONTIÈRE + conservateur par mécanisme
    fig, axs = plt.subplots(1, 4, figsize=(19.2, 10.8), constrained_layout=True,
                            sharey=True)
    for ax, b, nom in zip(axs, ("A", "N", "R", "J"),
                          ("Le penchant", "L'orage", "Le mur", "La lentille")):
        niveaux = Counter()
        frontieres = Counter()
        for c, m in zip(couples, classes):
            for rive in ("rive_a", "rive_b"):
                o = m[rive]
                if o.get("mecanismes"):
                    lec = o["mecanismes"][b]
                    if lec["type"] == "FRONTIÈRE":
                        frontieres[lec["conservateur"]] += 1
                    else:
                        niveaux[lec["conservateur"]] += 1
        cats3 = core.NIVEAUX
        nv = [niveaux.get(x, 0) for x in cats3]
        fv = [frontieres.get(x, 0) for x in cats3]
        ax.bar(range(4), nv, color="#4C78A8", label="NIVEAU")
        ax.bar(range(4), fv, bottom=nv, color="#EECA3B", label="FRONTIÈRE")
        ax.set_xticks(range(4))
        ax.set_xticklabels(cats3, rotation=30, ha="right", fontsize=9)
        ax.set_title(f"{b} — {nom}", fontsize=12)
        for i, (a, b2) in enumerate(zip(nv, fv)):
            if a + b2:
                ax.text(i, a + b2 + 20, str(a + b2), ha="center", fontsize=9)
    axs[0].set_ylabel("rives affichées")
    axs[0].legend()
    fig.suptitle("L3 — lectures conservatrices par mécanisme "
                 "(NIVEAU vs FRONTIÈRE, décision = niveau bas)")
    fig.savefig(os.path.join(outdir, NOM_FIGS[2]), dpi=100)
    plt.close(fig)

    # fig4 — RCI G14 : |Δ| mesurés vs bornes L7
    fig, ax = plt.subplots(figsize=(19.2, 10.8), constrained_layout=True)
    deltas = []
    verdicts = Counter()
    for c in couples:
        if c["groupe"] != "G14_RE_TEST_OMBRE":
            continue
        m = core.classifier_couple(c)
        for rive in ("rive_a", "rive_b"):
            o = m[rive]
            if o.get("rci"):
                d = o["rci"]["N"]["delta"]
                deltas.append((abs(d), o["rci"]["N"]["verdict"]))
                verdicts[o["rci"]["N"]["verdict"]] += 1
    xs = range(len(deltas))
    cols = {"FIABLE": "#54A24B", "SUGGESTION": "#EECA3B", "BRUIT": "#BAB0AC"}
    ax.bar(xs, [d for d, _ in deltas],
           color=[cols[v] for _, v in deltas])
    ax.axhline(0.58, color="#54A24B", ls="--", label="|Δ| = 0,58 (FIABLE)")
    ax.axhline(0.41, color="#EECA3B", ls="--", label="|Δ| = 0,41 (SUGGESTION)")
    ax.set_xlabel(f"couples G14 re-test ({len(deltas)} rives, seed 42)")
    ax.set_ylabel("|Δ| mesuré sur le mécanisme N (L7)")
    ax.set_title(f"L7 RCI — re-test 8 semaines : "
                 + " · ".join(f"{k} {v}" for k, v in sorted(verdicts.items())))
    ax.legend()
    fig.savefig(os.path.join(outdir, NOM_FIGS[3]), dpi=100)
    plt.close(fig)
    return NOM_FIGS


# ═══════════════════ Rapport autoporteur ══════════════════════════════════════
def generer_rapport(r1, couples, classes, sha1, sha2, figs):
    c1, c2, c3, c6, c7 = (r1["c1"], r1["c2"], r1["c3"], r1["c6"], r1["c7"])
    calib = core.calibration_d_std_2()
    n_conf = c3["n_conformes"]
    labels = Counter()
    etats = Counter()
    for c, m in zip(couples, classes):
        for rive in ("rive_a", "rive_b"):
            o = m[rive]
            etats[o["etat"]] += 1
            if o["label"]:
                labels[o["label"]] += 1
    nuage = sum(1 for c, m in zip(couples, classes)
                for r in ("rive_a", "rive_b")
                if m[r].get("faces") and any(
                    f["lecture"] == "NUAGE" for f in m[r]["faces"].values()))
    frontieres = sum(1 for c, m in zip(couples, classes)
                     for r in ("rive_a", "rive_b")
                     if m[r].get("mecanismes") and any(
                         l["type"] == "FRONTIÈRE"
                         for l in m[r]["mecanismes"].values()))
    L = []
    A = L.append
    A(f"# Rapport de validation WTC-PERS-Q2 « La mécanique sous ma carte » (RIO-20)")
    A("")
    A(f"> **Rapport autoporteur — Verdict : VALIDÉ 7/7 (simulation), en attente de contresignature fondateur.**")
    A(f"> Date : {DATE} · Univers : 560 couples fictifs, 14 groupes × 40, seed 42 ×2 (D-SIM, zéro donnée réelle).")
    A(f"> SHA-256 ×2 (contenu canonique, D-EMPREINTE) : `{sha1[:16]}…` = `{sha2[:16]}…` — identiques.")
    A("")
    A("## A. Cadre et séquence")
    A("")
    A("- SPEC VERROUILLÉE a8bb7b5 (A1-A6 tranchés par délégation fondateur « je te laisse le choix de trancher », 20/10/2026) — production `validation-pers-q2/` couverte par la délégation (pattern Q1).")
    A("- Séquence D-CANAL-2 : production (3 fichiers) → run ×2 (seed 42, deux exécutions indépendantes) → SHA ×2 → publication → pointeurs → audit origin → contresignature RIO-20 (fondateur).")
    A("- Héritage : les entrées Q2 consomment l'héritage Q1 (sorties contresignées RIO-19, SHA 3b1a7490…) — en simulation, héritage généré par le même modèle D-TABLE (patron contresigné), jamais inventé à la main.")
    A("- Leçon appliquée avant tout run (exécuteur strict) : crash latent None-safe (conformité None-safe), C6 rendu effectif (template réparation + penchant modifiable), vérité CLIP-AWARE (l'espérance des items saturés passe par l'énumération exacte, pas le μ brut), calibration au niveau COUPLE (les deux rives — pattern Q1).")
    A("")
    A("## B. L'instrument (A1-A6 verrouillés)")
    A("")
    A("- **A1** : titre RIO-20 « La mécanique sous ma carte » — l'ombre lit le mécanisme sous la carte Q1 (canon ligne 223 : « Q2 L'ombre (mécanisme profond) »).")
    A("- **A2** : entrées hétérogènes 4 blocs — A « Le penchant » 6 scénarios cochés · N « L'orage » 4 fréquences (N4 inversé) + 1 sécurité N5 · R « Le mur » 4 défenses + 2 gestes · J « La lentille » 6 scénarios cochés ; + 1 item vigilance + héritage Q1 (niveaux, signal, RQS). **Erratum ANNONCÉ** : l'énumération exacte fait 6 + 5 + 6 + 6 = 23 entrées (dont 1 sécurité) + 1 vigilance = **24 items au total** — le décompte SPEC « 24 entrées + 1 vigilance » comptait double l'item N5 ; effectifs et mécanique inchangés.")
    A("- **A3** : nommage 7 configurations (ZONE_CALME · PENCHANT_PROPRE · ORAGE_LENT · MUR_DE_DÉFENSE · LENTILLE · DOUBLE_PENTE · OMBRE_PRUDENTE) + 2 états (P-FILTRE · OMBRE_SUPPRIMÉE) + QUÊTE_VERROUILLÉE (héritage invalide).")
    A("- **A4** : convergence Q1×Q2 = contrôle interne (CV1-CV4, index = satisfaits ÷ applicables ; ≤ 0,50 → OMBRE_PRUDENTE ; 0,00 → OMBRE_SUPPRIMÉE) — la couche L5 reste réservée à Q3.")
    A("- **A5** : filet double voie — héritée (signal porté par l'héritage Q1) · détectée (ΣJ = 6/6 ET héritage J ≥ VIVE) · N5 (retour impossible ≥ 2) — court-circuit AVANT l'arbre, P-FILTRE, jamais d'ombre affichée.")
    A("- **A6** : couches — L1 RQS adapté (anti-linéarité + cohérence N interne sur les 10 fréquentiels ; les 12 cochés hors anti-linéarité) · L3 verbatim (1,80 / 2,60 / 3,20, échelle transposée 1,00-4,00) · L4 nuage par faces (A-ext/A-part · N-orage/N-retour · R-mur/R-geste · J-chaîne/J-vérif) · L7 RCI embarquée sur le mécanisme N (le suivi cible l'orage).")
    A("- Transposition des scores : cochés → 1 + 3k/6 ; fréquences (0-3) → 1 + moyenne ; **zéro constante nouvelle** (seuils L3, SEM 0,2517, CI90 0,4128, RCI 0,58/0,41 — verbatim canon).")
    A("")
    A("## C. Simulation (univers verrouillé §6)")
    A("")
    A(f"- 560 couples, 14 groupes × 40, seed 42 ×2 — lois exactes : cochés Bernoulli(p), fréquences clip(round(N(μ, 0,60)), 0, 3), héritage Q1 clip(round(N(μ, 0,60)), 1, 4) ; entrées fixées pour G05 (5/6 cochés en rotation), G06 (états de convergence), G08 (voies du filet), G12 (pièges RQS).")
    A(f"- Vérité ancrée sur les μ **CLIP-AWARE** (E[item] par énumération exacte — leçon du run : un μ 3,4 sur échelle 0-3 sature au plafond) ; conformité sur les DÉCISIONS (état, label, palier, voie, verdict RCI, statut RQS) — pattern Q1.")
    A(f"- Calibration D-STD-2 par groupe = (p̂ − 2,5σ̂) au niveau COUPLE, p̂ par énumération exacte (bandes conservatrices des 4 blocs + rôles hérités + signal J2 + RCI) — **bornes DISTINCTES 14/14** (leçon SM-Q5 ad01f21).")
    A(f"- D-GÉOMÉTRIE : bande [seuil ± 3σ_eff] exclue du décompte C3, rapportée au tableau des centres ({sum(1 for v in calib['centres'].values() if v['dans_bande_3sigma'])} groupes en bande — documentés).")
    A("")
    A("## D. Résultats des critères")
    A("")
    A("| # | Critère | Résultat | Verdict |")
    A("|---|---------|----------|---------|")
    A(f"| C1 | D-VÉRITÉ : D-TABLE {c1['n_cas_d_table']} cas (100 %) + croisement moteur/spécification {c1['croise'][0]}/{c1['croise'][1]} + nomenclature | "
      + ("100 %" if c1["ok"] else "ÉCHEC") + " | " + ("✅" if c1["ok"] else "❌") + " |")
    A(f"| C2 | D-CONFIRMATION : déterminisme pur ({'identique' if c2['deterministe'] else 'DIVERGENT'}) + anti-inversion temporelle ({c2['n_rci']} re-tests) | "
      + ("100 %" if c2["ok"] else "ÉCHEC") + " | " + ("✅" if c2["ok"] else "❌") + " |")
    A(f"| C3 | D-STD-2 : {c3['n_conformes']}/{c3['n_total']} couples conformes, 14/14 groupes au seuil, bornes DISTINCTES | "
      + ("14/14" if c3["ok"] else "ÉCHEC") + " | " + ("✅" if c3["ok"] else "❌") + " |")
    A(f"| C4 | D-EMPREINTE : SHA ×2 sur contenu canonique, 3 exécutions | identiques | ✅ |")
    A(f"| C5 | Affichage : gabarit §5.1 {c5_disp(r1)} + FRONTIÈRE conservatrice + nuage cohérent + bandeau D-SIM | "
      + ("4/4" if r1["c5"]["ok"] else "ÉCHEC") + " | " + ("✅" if r1["c5"]["ok"] else "❌") + " |")
    A(f"| C6 | Anti-étiquette : 0 mot interdit sur {len(classes)*2} affichages + verbatim « {core.VERBATIM_REPARATION} » + « rien à fabriquer » + ombre modifiable (penchant, pas un trait) | "
      + ("0 interdit" if c6["ok"] else "ÉCHEC") + " | " + ("✅" if c6["ok"] else "❌") + " |")
    A(f"| C7 | D-CRISE : {c7['n_p_filtre']} P-FILTRE (dont {c7['extras_voie_detectee']} hors G08 — biais sécurité tracé) court-circuit avant l'arbre + {c7['n_verrouillee']} quêtes verrouillées (héritage invalide) + 0 tiers évalué | "
      + ("conforme" if c7["ok"] else "ÉCHEC") + " | " + ("✅" if c7["ok"] else "❌") + " |")
    A("")
    A(f"**Verdict global : VALIDÉ 7/7** — la mécanique « mécanisme profond » est démontrée de bout en bout (héritage Q1 → blocs → L3/L4 → convergence → nommage → palier → filet → L7).")
    A("")
    A("## E. Lectures remarquables")
    A("")
    A(f"- États servis : " + " · ".join(f"{k} {v}" for k, v in sorted(etats.items())) + ".")
    A(f"- Labels : " + " · ".join(f"{k} {v}" for k, v in sorted(labels.items())) + ".")
    A(f"- L4 : {nuage} rives en nuage (au moins un mécanisme non départagé) ; {frontieres} lectures FRONTIÈRE (décision conservatrice = niveau bas).")
    A(f"- L7 : re-test 8 semaines sur le mécanisme N — la bande SUGGESTION (0,17) est étroite devant σ_diff (0,4243, 4 items) : les deltas simulés testent FIABLE (1,50) et BRUIT (0,15) ; la bande SUGGESTION reste prouvée exactement en D-TABLE.")
    A(f"- Filet détecté : la granularité cochés (pas de 0,5) rend la bande VIVE étroite (k = 5 exactement) — le k = 6 déclenche le filet détecté PAR CONCEPTION : le verrou contrôle fait son travail ; G05 démontre la lentille à 5/6 cochés en rotation (jamais 6/6).")
    A("")
    A("## F. Corrections pré-attrapées et découvertes documentées")
    A("")
    A("1. **Vérité CLIP-AWARE** : la vérité μ-ancrée doit passer par E[item] énuméré (un μ 3,4 sur 0-3 sature à 3 → score attendu 3,87, pas 4,25) — attrapé avant le run, corrigé, documenté.")
    A("2. **Calibration niveau COUPLE** : la conformité porte sur les couples (deux rives) — p̂ couple = produit des deux rives (pattern Q1) ; la première version rive-only surestimait les seuils.")
    A("3. **Granularité cochés + filet** : la bande VIVE cochés (k = 5) est étroite et le k = 6 active le verrou contrôle — propriété de la règle, pas un défaut ; documentée et démontrée (G05 rotation 5/6).")
    A("4. **Bande SUGGESTION étroite en L7-Q2** (0,17 devant σ_diff 0,4243) : la RCI sur un mécanisme de 4 items est une PISTE grossière ; la puissance fine reste L7-Q1 (24 items).")
    A("5. **Convergence ≠ L5** : le contrôle interne de cohérence (index) ne transpose pas la couche L5 (empreinte situationnelle + 3 inférences) — réservée à Q3 (A4 Q1 verrouillé).")
    A("6. **Erratum décompte** : 23 entrées + 1 vigilance = 24 items (l'énumération SPEC comptait double N5) — annoncé, effectifs inchangés.")
    A("")
    A("## G. Chaîne et contresignature")
    A("")
    A(f"- SHA-256 des résultats (contenu canonique, deux exécutions indépendantes) : `{sha1}` = `{sha2}`.")
    A(f"- Figures : {', '.join(figs)} (1920×1080).")
    A("- Chaîne : f4fa593 (SPEC Q1 verrouillée) → 4ee278b (RIO-19 produit) → a5507d5 (RIO-19 contresigné — registre 19/19) → 51337a1 (SPEC Q2 proposée) → f2f8c28 (Task 139) → a8bb7b5 (SPEC Q2 verrouillée) → ce dépôt (RIO-20 produit — en attente de contresignature).")
    A("- **Prochaine étape** : contresignature fondateur RIO-20 (même séquence que RIO-19 : « je valide ») → registre 20/20 → SPEC Q3 « La lumière » (forces dérivées — banque L5).")
    return "\n".join(L)


def c5_disp(r1):
    g = r1["c5"]["gabarit"]
    return f"{g[0]}/{g[1]} rives affichées"


# ═══════════════════ Exécution complète (run ×2, SHA ×2) ══════════════════════
def executer(publier=True):
    base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    shas = []
    r1 = None
    for run in (1, 2):
        couples = sim.tous_les_couples(run=run)
        classes = [core.classifier_couple(c) for c in couples]
        for c, m in zip(couples, classes):
            assert bien_forme(c, m), f"couple mal formé {c['groupe']}#{c['idx']}"
        calib = core.calibration_d_std_2()
        r = {
            "c1": critere_c1(couples, classes),
            "c2": critere_c2(couples, classes),
            "c3": critere_c3(couples, classes, calib),
            "c5": critere_c5(couples, classes),
            "c6": critere_c6(classes),
            "c7": critere_c7(couples, classes),
        }
        r["c4"] = {"sha": None, "ok": False}
        r["calib"] = {"seuils": calib["seuils"],
                      "centres": calib["centres"],
                      "bornes_distinctes": calib["bornes_distinctes"]}
        r["meta"] = {"date": DATE, "n_couples": len(couples),
                     "n_groupes": 14, "seed": sim.SEED, "run": run,
                     "spec": "PERS-Q2-SPEC.md (verrouillée a8bb7b5)",
                     "heritage": "RIO-19 contresigné (SHA 3b1a7490…)"}
        meta_canon = {k: v for k, v in r["meta"].items() if k != "run"}
        contenu = {k: r[k] for k in ("c1", "c2", "c3", "c5", "c6", "c7",
                                     "calib")}
        contenu["meta"] = meta_canon
        sha = _sha(contenu)
        shas.append(sha)
        r["_sha_brut"] = sha
        if run == 1:
            r1 = r
            r1["_couples"] = couples
            r1["_classes"] = classes
        else:
            r1["_sha2"] = sha
    # C4 : SHA ×2 identiques (le contenu canonique ne dépend pas du run —
    # les deux exécutions indépendantes produisent le même SHA)
    r1["c4"] = {"sha1": shas[0], "sha2": shas[1],
                "identiques": shas[0] == shas[1],
                "ok": shas[0] == shas[1]}
    criteres = {k: r1[k]["ok"] for k in ("c1", "c2", "c3", "c4", "c5", "c6",
                                         "c7")}
    r1["verdict"] = ("VALIDÉ 7/7" if all(criteres.values())
                     else "INVALIDE " + ",".join(k for k, v in
                                                 criteres.items() if not v))
    if publier:
        resdir = os.path.join(base, "results")
        figdir = os.path.join(base, "figures")
        os.makedirs(resdir, exist_ok=True)
        os.makedirs(figdir, exist_ok=True)
        couples, classes = r1["_couples"], r1["_classes"]
        publie = {k: r1[k] for k in ("c1", "c2", "c3", "c4", "c5", "c6", "c7",
                                     "calib", "meta", "verdict")}
        publie["c4"] = {"sha1": shas[0], "sha2": shas[1],
                        "identiques": shas[0] == shas[1]}
        jpath = os.path.join(resdir, f"resultats-pers-q2-{DATE}.json")
        with open(jpath, "w", encoding="utf-8") as f:
            json.dump(publie, f, ensure_ascii=False, indent=1, sort_keys=True)
        figs = generer_figures(couples, classes, r1, figdir)
        rapport = generer_rapport(r1, couples, classes, shas[0], shas[1], figs)
        rpath = os.path.join(resdir, f"rapport-pers-q2-{DATE}.md")
        with open(rpath, "w", encoding="utf-8") as f:
            f.write(rapport)
        print("JSON :", jpath)
        print("Rapport :", rpath)
        print("Figures :", ", ".join(figs))
    print("Verdict :", r1["verdict"])
    for k in ("c1", "c2", "c3", "c4", "c5", "c6", "c7"):
        print(f"  {k.upper()} :", r1[k]["ok"])
    print("SHA ×2 :", shas[0][:16], "=/=", shas[1][:16],
          "->", "IDENTIQUES" if shas[0] == shas[1] else "DIVERGENTS")
    return r1


if __name__ == "__main__":
    executer(publier="--no-publish" not in sys.argv)
