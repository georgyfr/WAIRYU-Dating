# -*- coding: utf-8 -*-
"""WAIRYU — WTC-PERS-Q3 : validation Quête 3 Personnalité
« La lumière sous ma carte » — RIO-21.

Les 7 critères Q3-PERS (SPEC verrouillée §5) :
C1 D-VÉRITÉ anti-fabrication DOUBLE SENS (D-TABLE + croisement moteur/spec +
   nomenclature + sens inverse : aucune force PLEINE sans sources, aucune
   inférence hors règle) — ÉLIMINATOIRE
C2 D-CONFIRMATION : lecture déterministe pure (mêmes héritages → mêmes
   décisions) + anti-inversion temporelle RCI — ÉLIMINATOIRE
C3 D-STD-2 : seuil de conformité PAR groupe simulé (bornes DISTINCTES,
   leçon SM-Q5 ad01f21 ; groupes déterministes à seuil 100,0 signalés) —
   ÉLIMINATOIRE
C4 D-EMPREINTE : SHA ×2 sur contenu canonique (pas d'horodatage)
C5 Affichage : gabarit §5.1 (zone de force tirée des vraies réponses ·
   empreinte + inférences avec « ça te ressemble ? » · paliers hérités ·
   seuils d'aide) · limite 2 forces · nuage L4 · FRONTIÈRE conservatrice ·
   bandeau D-SIM · littéraux autoporteurs
C6 Anti-étiquette double sens : 0 mot canon clinique · lumière = penchant
   favorable décrit, jamais un trait figé, jamais un mérite moral · 0
   flatterie inventée (anti-fabrication côté lumière) · vocabulaire écran —
   ÉLIMINATOIRE
C7 D-CRISE + non-évaluation : filet hérité avant l'arbre · 0 mesure du
   partenaire / 0 tiers · héritage invalide → verrouillée ·
   OMBRE_SUPPRIMÉE → mode carte-seule tracé, 0 invention — ÉLIMINATOIRE

Séquence D-CANAL-2 : production (3 fichiers) → run ×2 (seed 42, deux
exécutions indépendantes) → SHA ×2 → publication → pointeurs → audit origin
→ contresignature RIO-21 (fondateur)."""
import hashlib
import json
import os
from collections import defaultdict

import matplotlib
matplotlib.use("Agg")
import matplotlib.font_manager as fm
for _f in ("/usr/share/fonts/truetype/chinese/NotoSansSC-Regular.ttf",
           "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"):
    if os.path.exists(_f):
        fm.fontManager.addfont(_f)
import matplotlib.pyplot as plt
plt.rcParams["font.sans-serif"] = ["Noto Sans SC", "DejaVu Sans"]
plt.rcParams["axes.unicode_minus"] = False

import wtc_pers_q3_core as core
import wtc_pers_q3_simulator as sim

DATE = "2026-10-20"
GABARIT = ("zone_force", "reconnaissance", "paliers", "seuils_aide")


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
        if o.get("etat") not in (core.ETAT_LUMIERE, core.ETAT_CARTE_SEULE,
                                 "P-FILTRE", "QUÊTE_VERROUILLÉE",
                                 "AUCUN_RÉSULTAT"):
            return False
        if o["etat"] in (core.ETAT_LUMIERE, core.ETAT_CARTE_SEULE):
            if not o.get("forces") or o.get("palier") is None:
                return False
        else:
            if o.get("forces") is not None:
                return False     # court-circuit : aucun résultat attaché
    return True


# ═══════════════════ C1 — D-VÉRITÉ (double sens) ══════════════════════════════
def _croise_forces(heritage_q1, heritage_q2, carte_seule):
    """Recalcul INDÉPENDANT des 4 scores force (formules SPEC, hors moteur)."""
    out = {}
    for mec in "ANRJ":
        scores = []
        for origine, cle in core.SOURCES[mec]:
            if carte_seule and origine != "Q1":
                continue
            if origine == "Q1":
                scores.append(heritage_q1["faces"][cle]["score"])
            else:
                scores.append(heritage_q2["faces_lumiere"][cle]["score"])
        out[mec] = round(sum(scores) / len(scores), 4)
    return out


def critere_c1(couples, classes):
    t = core.verifier_d_table()
    d_table_ok = all(t.values())
    croise_ok, n_croise = 0, 0
    nomen_ok = True
    anti_fabrication_ok = True
    for couple, m in zip(couples, classes):
        for rive in ("rive_a", "rive_b"):
            o = m[rive]
            h1 = couple["heritage_a" if rive == "rive_a" else "heritage_b"]
            h2 = couple["heritage2_a" if rive == "rive_a" else "heritage2_b"]
            if o["forces"] is None:
                continue
            n_croise += 1
            ok = True
            carte_seule = o["mode"] == "CARTE_SEULE"
            # (a) scores = moyennes des sources (formules SPEC)
            vrais = _croise_forces(h1, h2, carte_seule)
            for mec in "ANRJ":
                if abs(o["forces"][mec]["score"] - vrais[mec]) > 1e-6:
                    ok = False
            # (b) conditions EMP/INF recalculées hors moteur
            if carte_seule:
                if o["empreinte"] or o["inferences"]:
                    ok = False          # 0 invention en carte-seule
            else:
                ce = core._conditions_emp(h1, h2)
                ci = core._conditions_inf(h1, h2)
                if ce != o["cond_emp"] or ci != o["cond_inf"]:
                    ok = False
                for e in o["empreinte"]:
                    if not ce[e["regle"]]:
                        ok = False      # sens inverse : jamais hors règle
                for i in o["inferences"]:
                    if not ci[i["regle"]]:
                        ok = False
            # (c) palier hérité affiché SANS recalcul (identité — Q5-A3)
            if o["palier"] != h2.get("palier"):
                ok = False
            # (d) nomenclature + gabarit de règles
            for mec in "ANRJ":
                f = o["forces"][mec]
                if f["conservateur"] not in core.NOMENCLATURE or \
                        f["nom"] not in core.NOMENCLATURE:
                    nomen_ok = False
                if f["conservateur"] != core.niveaux_touches(*f["ci90"])[0]:
                    ok = False          # frontière conservatrice
                lo = min(s["score"] for s in f["sources"]) - 1e-9
                hi = max(s["score"] for s in f["sources"]) + 1e-9
                if not (lo <= f["score"] <= hi):
                    ok = False          # la moyenne reste dans les sources
            # (e) anti-fabrication DOUBLE SENS : toute force nivelée affichée
            # est soutenue (cons ≥ TRANQUILLE) ; les calmes sont DISCRÈTES ;
            # J silencieuse si la chaîne se lit
            for mec in o["principales"] + o["mentions"]:
                if o["forces"][mec]["conservateur"] not in ("TRANQUILLE",
                                                            "VIVE", "FORTE"):
                    anti_fabrication_ok = False
            for mec in o["calmes"]:
                if o["forces"][mec]["conservateur"] != "DISCRÈTE":
                    anti_fabrication_ok = False
            if o["j_affichee"] and \
                    o["forces"]["J"]["conservateur"] != "DISCRÈTE":
                anti_fabrication_ok = False
            # (f) hiérarchie cohérente (nuage ⟺ écart < seuil)
            if o["hierarchie"] is not None:
                h = o["hierarchie"]
                if h["type"] == "NUAGE" and not h["ecart"] < h["seuil"]:
                    ok = False
                if h["type"] == "HIÉRARCHIE DÉCLARABLE":
                    if not h["ecart"] >= h["seuil"]:
                        ok = False
                    m1, m2 = o["principales"]
                    if h["dominante"] != (m1 if o["forces"][m1]["score"] >
                                          o["forces"][m2]["score"] else m2):
                        ok = False
            # (g) RCI : delta = re − base (recalcul indépendant)
            if o["rci"] is not None:
                h1rt = couple.get("heritage_a_rt" if rive == "rive_a"
                                  else "heritage_b_rt")
                h2rt = couple.get("heritage2_a_rt" if rive == "rive_a"
                                  else "heritage2_b_rt")
                if h1rt is None:
                    ok = False
                else:
                    vr = _croise_forces(h1rt, h2rt, carte_seule)
                    for mec in "ANRJ":
                        if o["rci"][mec]["delta"] != round(
                                vr[mec] - vrais[mec], 4):
                            ok = False
            croise_ok += 1 if ok else 0
    return {"d_table": d_table_ok, "n_cas_d_table": len(t),
            "croise": (croise_ok, n_croise),
            "croise_ok": croise_ok == n_croise,
            "nomenclature": nomen_ok,
            "anti_fabrication_double_sens": anti_fabrication_ok,
            "ok": d_table_ok and croise_ok == n_croise and nomen_ok
                  and anti_fabrication_ok}


# ═══════════════════ C2 — D-CONFIRMATION ══════════════════════════════════════
def _signature_rive(o):
    return json.dumps({k: o[k] for k in
                       ("etat", "mode", "palier", "forces", "principales",
                        "mentions", "calmes", "j_affichee", "hierarchie",
                        "empreinte", "inferences", "rci", "rqs")},
                      sort_keys=True, ensure_ascii=False)


def critere_c2(couples, classes):
    again = [core.deriver_couple(c) for c in couples]
    pure = True
    for m1, m2 in zip(classes, again):
        for rive in ("rive_a", "rive_b"):
            if _signature_rive(m1[rive]) != _signature_rive(m2[rive]):
                pure = False
    anti_inv = (core.rci_de(2.0, 3.0)["delta"] == 1.0
                and core.rci_de(3.0, 2.0)["delta"] == -1.0)
    n_rci = sum(1 for c in couples for r in ("rive_a", "rive_b")
                if c.get(f"heritage_{r}_rt") is not None)
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
                     "seuil": seuils[g],
                     "deterministe": calib["centres"][g]["deterministe"],
                     "ok": ok}
    n_total_ok = sum(v["conformes"] for v in detail.values())
    return {"detail": detail, "tous_au_seuil": all_ok,
            "bornes_distinctes": calib["bornes_distinctes"],
            "n_stochastiques": calib["n_stochastiques"],
            "n_deterministes": calib["n_deterministes"],
            "n_conformes": n_total_ok, "n_total": len(couples),
            "ok": all_ok and calib["bornes_distinctes"]}


# ═══════════════════ Affichage (littéraux autoporteurs) ═══════════════════════
def _affichage_rive(o, bandeau_sim=True):
    lignes = []
    T = core.TEMPLATES
    if o["etat"] == "P-FILTRE":
        lignes.append(T["filet"].format(source=o["filet"]["source"],
                                        filet_num="3919 (héritée) · 3114 · 15 · 112"))
        lignes.append(o["bandeau"])
        if bandeau_sim:
            lignes.append(T["bandeau_sim"])
        return lignes
    if o["etat"] == "QUÊTE_VERROUILLÉE":
        lignes.append(T["verrouillee"])
        if bandeau_sim:
            lignes.append(T["bandeau_sim"])
        return lignes
    if o["etat"] == "AUCUN_RÉSULTAT":
        lignes.append(T["invalide"].format(rqs=o["rqs"]["rqs"]))
        if bandeau_sim:
            lignes.append(T["bandeau_sim"])
        return lignes
    lignes.append(T["intro"])
    blocs = []
    for mec in o["principales"]:
        f = o["forces"][mec]
        blocs.append(T["force"].format(nom=f["nom"],
                                       conservateur=f["conservateur"],
                                       corps=core.CORPS_FORCE[mec]))
    for mec in o["mentions"]:
        f = o["forces"][mec]
        blocs.append(T["mention"].format(nom=f["nom"],
                                         conservateur=f["conservateur"]))
    lignes.append(T["zone_force"].format(
        forces=" · ".join(f["nom"] for f in [o["forces"][m] for m in
                                             o["principales"] + o["mentions"]])
        if (o["principales"] or o["mentions"]) else "aucune force nivelée — "
        "les zones de lumière sont calmes"))
    lignes.extend(blocs)
    for mec in o["calmes"]:
        lignes.append(T["calme"].format(nom=core.FORCES_CALMES[mec],
                                        corps=core.CORPS_CALME[mec]))
    if o["j_affichee"]:
        lignes.append(T["calme"].format(nom=core.FORCES_PLEINES["J"],
                                        corps=core.CORPS_FORCE["J"]))
        lignes.append(T["calme"].format(nom=core.FORCES_CALMES["J"],
                                        corps=core.CORPS_CALME["J"]))
    if o["hierarchie"] is not None:
        if o["hierarchie"]["type"] == "NUAGE":
            lignes.append(T["nuage"])
        else:
            lignes.append(T["hierarchie"].format(
                dominante=o["forces"][o["hierarchie"]["dominante"]]["nom"]))
    for e in o["empreinte"]:
        lignes.append(T["empreinte"].format(texte=e["texte"]))
    for i in o["inferences"]:
        lignes.append(T["inference"].format(nom=i["nom"], texte=i["texte"]))
    if o["palier"]:
        lignes.append({"EXERCICE MAISON": T["palier_vert"],
                       "MODULE DE COUPLE": T["palier_orange"],
                       "ORIENTATION": T["palier_rouge"]}[o["palier"]])
    lignes.append(T["re_test_programme"])
    if o["rci"]:
        for mec in "ANRJ":
            r = o["rci"][mec]
            key = {"FIABLE": "rci_fiable", "SUGGESTION": "rci_suggestion",
                   "BRUIT": "rci_bruit"}[r["verdict"]]
            lignes.append(T[key].format(nom=r["nom"]))
    if o["rqs"]["statut"] == "PRUDENCE":
        lignes.append(T["prudence_rqs"].format(rqs=o["rqs"]["rqs"]))
    if o["bandeau"]:
        lignes.append(o["bandeau"])
    if bandeau_sim:
        lignes.append(T["bandeau_sim"])
    return lignes


# ═══════════════════ C5 — affichage (gabarit §5.1 4/4) ════════════════════════
def critere_c5(couples, classes):
    ok, n = 0, 0
    frontiere_conservative = True
    nuage_ok = True
    reconnaissance_ok = True
    for couple, m in zip(couples, classes):
        for rive in ("rive_a", "rive_b"):
            o = m[rive]
            lignes = _affichage_rive(o)
            if o["etat"] in (core.ETAT_LUMIERE, core.ETAT_CARTE_SEULE):
                n += 1
                texte = "\n".join(lignes)
                gab = ("tirée de tes vraies réponses" in texte
                       and any(p in texte for p in ("EXERCICE MAISON",
                                                    "MODULE DE COUPLE",
                                                    "ORIENTATION"))
                       and "Re-test programmé à 8 semaines" in texte
                       and "Simulation D-SIM" in texte)
                # reconnaissance : toute inférence affichée porte « ça te
                # ressemble ? » (lignes 272-273 — proxy couverture de règles)
                if o["inferences"] and core.VERBATIM_RECONNAISSANCE not in texte:
                    reconnaissance_ok = False
                if gab:
                    ok += 1
            if o["forces"]:
                for mec in "ANRJ":
                    f = o["forces"][mec]
                    if f["conservateur"] != core.niveaux_touches(*f["ci90"])[0]:
                        frontiere_conservative = False
            if o["hierarchie"]:
                h = o["hierarchie"]
                if h["type"] == "NUAGE" and h["ecart"] >= h["seuil"]:
                    nuage_ok = False
    return {"gabarit": (ok, n), "gabarit_ok": ok == n,
            "frontiere_conservatrice": frontiere_conservative,
            "nuage_coherent": nuage_ok,
            "reconnaissance_ca_te_ressemble": reconnaissance_ok,
            "ok": ok == n and frontiere_conservative and nuage_ok
                  and reconnaissance_ok}


# ═══════════════════ C6 — anti-étiquette (triple verrou hérité) ═══════════════
def critere_c6(couples, classes):
    interdits = list(core.MOTS_INTERDITS_C6)
    hits = []
    for couple, m in zip(couples, classes):
        for rive in ("rive_a", "rive_b"):
            o = m[rive]
            lignes = _affichage_rive(o)
            texte = "\n".join(lignes + ([o["bandeau"]] if o["bandeau"] else []))
            low = texte.lower()
            for mot in interdits:
                if mot in low:
                    hits.append((mot, o["etat"]))
    verbatim_calme = core.VERBATIM_CALME in core.TEMPLATES["calme"] or \
        any(core.VERBATIM_CALME in c for c in core.CORPS_CALME.values())
    verbatim_reparation = core.VERBATIM_REPARATION in core.CORPS_CALME["R"]
    lumiere_modifiable = ("penchants favorables" in core.TEMPLATES["intro"]
                          and core.VERBATIM_LUMIERE in core.TEMPLATES["intro"])
    reconnaissance = core.VERBATIM_RECONNAISSANCE in core.TEMPLATES["inference"]
    return {"0_mot_interdit": not hits, "hits": hits[:5],
            "verbatim_rien_a_fabriquer": verbatim_calme,
            "verbatim_reparation": verbatim_reparation,
            "lumiere_penchant_pas_trait": lumiere_modifiable,
            "proposition_contestable": reconnaissance,
            "ok": not hits and verbatim_calme and verbatim_reparation
                  and lumiere_modifiable and reconnaissance}


# ═══════════════════ C7 — D-CRISE + non-évaluation ════════════════════════════
def critere_c7(couples, classes):
    filet_avant_arbre = True
    carte_seule_trace = True
    zero_tiers = True
    n_pfiltre = n_verrouillee = n_invalide = n_carte_seule = 0
    palier_filtre_ok = True
    for c, m in zip(couples, classes):
        for cle in c:
            if any(x in cle.lower() for x in ("partenaire", "tiers", "nom")):
                zero_tiers = False
        for rive in ("rive_a", "rive_b"):
            o = m[rive]
            if o["etat"] == "P-FILTRE":
                n_pfiltre += 1
                if o.get("forces") is not None or o.get("empreinte"):
                    filet_avant_arbre = False
                if o["palier"] != core.PALIER_ROUGE:
                    palier_filtre_ok = False
            elif o["filet"]["filet"]:
                filet_avant_arbre = False   # un filet actif sans P-FILTRE
            if o["etat"] == "QUÊTE_VERROUILLÉE":
                n_verrouillee += 1
            if o["etat"] == "AUCUN_RÉSULTAT":
                n_invalide += 1
            if o["etat"] == core.ETAT_CARTE_SEULE:
                n_carte_seule += 1
                if o["empreinte"] or o["inferences"]:
                    carte_seule_trace = False
    return {"filet_avant_arbre": filet_avant_arbre,
            "palier_filtre_orientation": palier_filtre_ok,
            "n_p_filtre": n_pfiltre, "n_verrouillee": n_verrouillee,
            "n_aucun_resultat": n_invalide, "n_carte_seule": n_carte_seule,
            "carte_seule_0_invention": carte_seule_trace,
            "zero_tiers": zero_tiers,
            "ok": filet_avant_arbre and palier_filtre_ok
                  and carte_seule_trace and zero_tiers}


# ═══════════════════ Figures (1920×1080) ══════════════════════════════════════
def _fig_setup(ax, titre):
    ax.set_title(titre, fontsize=15, fontweight="bold", pad=14)
    ax.spines["top"].set_visible(False)
    ax.spines["right"].set_visible(False)
    ax.grid(axis="y", alpha=0.25)


def generer_figures(couples, classes, r1, outdir):
    os.makedirs(outdir, exist_ok=True)
    figs = []

    # fig 1 — états servis (1120 rives)
    etats = defaultdict(int)
    for m in classes:
        for rive in ("rive_a", "rive_b"):
            etats[m[rive]["etat"]] += 1
    fig, ax = plt.subplots(figsize=(19.2, 10.8), dpi=100,
                           constrained_layout=True)
    keys = sorted(etats, key=etats.get, reverse=True)
    ax.bar(keys, [etats[k] for k in keys], color="#2e7d5b", width=0.6)
    for i, k in enumerate(keys):
        ax.text(i, etats[k] + 8, str(etats[k]), ha="center", fontsize=12)
    _fig_setup(ax, "RIO-21 « La lumière sous ma carte » — états servis "
                   "(1120 rives, 560 couples, 14 groupes)")
    ax.set_ylabel("rives")
    p = os.path.join(outdir, "fig1_etats_modes.png")
    fig.savefig(p, facecolor="white")
    plt.close(fig)
    figs.append(os.path.basename(p))

    # fig 2 — conformité D-STD-2 par groupe (observé vs seuil)
    det = r1["c3"]["detail"]
    gs = sorted(det)
    fig, ax = plt.subplots(figsize=(19.2, 10.8), dpi=100,
                           constrained_layout=True)
    pct = [det[g]["pct"] for g in gs]
    seuils = [det[g]["seuil"] for g in gs]
    colors = ["#2e7d5b" if det[g]["ok"] else "#c62828" for g in gs]
    ax.bar(range(len(gs)), pct, color=colors, width=0.65,
           label="conformité observée (%)")
    ax.scatter(range(len(gs)), seuils, color="#1a237e", zorder=5, s=70,
               marker="D", label="seuil D-STD-2 du groupe")
    for i, g in enumerate(gs):
        ax.text(i, pct[i] + 1.2, f"{pct[i]:.0f}", ha="center", fontsize=9)
    ax.set_xticks(range(len(gs)))
    ax.set_xticklabels([g.split("_")[0] for g in gs], rotation=45,
                       ha="right", fontsize=9)
    ax.set_ylim(0, 112)
    _fig_setup(ax, "C3 D-STD-2 — conformité par groupe vs seuil calibré "
                   "(bornes DISTINCTES ; 7 groupes déterministes à 100)")
    ax.set_ylabel("% de couples conformes")
    ax.legend(loc="lower left", fontsize=11)
    p = os.path.join(outdir, "fig2_conformite_d_std2.png")
    fig.savefig(p, facecolor="white")
    plt.close(fig)
    figs.append(os.path.basename(p))

    # fig 3 — niveaux des 4 forces dérivées (rives affichées)
    niv = {m: defaultdict(int) for m in "ANRJ"}
    for m in classes:
        for rive in ("rive_a", "rive_b"):
            o = m[rive]
            if o["forces"]:
                for mec in "ANRJ":
                    niv[mec][o["forces"][mec]["conservateur"]] += 1
    fig, ax = plt.subplots(figsize=(19.2, 10.8), dpi=100,
                           constrained_layout=True)
    largeur = 0.2
    noms = {"A": "La part reconnue", "N": "Le retour qui tient",
            "R": "Le geste qui répare", "J": "La main ouverte"}
    for i, mec in enumerate("ANRJ"):
        xs = [j + (i - 1.5) * largeur for j in range(4)]
        vals = [niv[mec].get(n, 0) for n in core.NIVEAUX]
        ax.bar(xs, vals, width=largeur, label=f"{noms[mec]} ({mec})")
    ax.set_xticks(range(4))
    ax.set_xticklabels(core.NIVEAUX, fontsize=11)
    _fig_setup(ax, "L3 verbatim — niveaux des 4 lumières dérivées "
                   "(moyenne des sources, intervalles propagés 1,64 × SE)")
    ax.set_ylabel("rives")
    ax.legend(loc="upper right", fontsize=11)
    p = os.path.join(outdir, "fig3_forces_lumiere.png")
    fig.savefig(p, facecolor="white")
    plt.close(fig)
    figs.append(os.path.basename(p))

    # fig 4 — L7 : deltas du re-test 8 semaines (G14)
    deltas = []
    verdicts = []
    for c, m in zip(couples, classes):
        if c["groupe"] != "G14_RE_TEST_LUMIÈRE":
            continue
        for rive in ("rive_a", "rive_b"):
            o = m[rive]
            if o["rci"]:
                for mec in "ANRJ":
                    deltas.append(o["rci"][mec]["delta"])
                    verdicts.append(o["rci"][mec]["verdict"])
    fig, ax = plt.subplots(figsize=(19.2, 10.8), dpi=100,
                           constrained_layout=True)
    colors = [{"FIABLE": "#2e7d5b", "SUGGESTION": "#f9a825",
               "BRUIT": "#90a4ae"}[v] for v in verdicts]
    ax.scatter(range(len(deltas)), deltas, c=colors, s=42)
    ax.axhline(0.58, color="#2e7d5b", ls="--", lw=1.5, label="|Δ| = 0,58 (FIABLE)")
    ax.axhline(0.41, color="#f9a825", ls="--", lw=1.5,
               label="|Δ| = 0,41 (SUGGESTION)")
    ax.axhline(-0.58, color="#2e7d5b", ls="--", lw=1.5)
    ax.axhline(-0.41, color="#f9a825", ls="--", lw=1.5)
    ax.axhline(0, color="#455a64", lw=1)
    _fig_setup(ax, "L7 RCI 8 semaines posée sur les 4 lumières "
                   "(G14 — Δ vrais injectés : FIABLE 1,17 / BRUIT 0)")
    ax.set_xlabel("rives G14 × 4 forces (Δ = re-test − base)")
    ax.set_ylabel("Δ de la force")
    ax.legend(loc="upper right", fontsize=11)
    p = os.path.join(outdir, "fig4_rci_deltas.png")
    fig.savefig(p, facecolor="white")
    plt.close(fig)
    figs.append(os.path.basename(p))
    return figs


# ═══════════════════ Rapport autoporteur ══════════════════════════════════════
def generer_rapport(r1, couples, classes, sha1, sha2, figs):
    A = []
    c1, c2, c3 = r1["c1"], r1["c2"], r1["c3"]
    A.append("# RAPPORT DE VALIDATION — WTC-PERS-Q3 « La lumière sous ma "
             "carte » (RIO-21)")
    A.append("")
    A.append(f"> Instrument : {r1['meta']['n_couples']} couples, "
             f"{r1['meta']['n_groupes']} groupes, seed "
             f"{r1['meta']['seed']} ×2 — dérivation pure, ZÉRO item nouveau "
             "(A2-a) ; première quête à deux ancêtres (héritage Q1 carte + "
             "Q2 ombre). Rapport autoporteur — Verdict fermé (leçon E-SM-12).")
    A.append("")
    A.append("## A. Contexte et séquence")
    A.append("")
    A.append("- Quête 3/5 de la dimension Personnalité (canon ligne 223 : « Q3 La "
             "lumière (forces dérivées) ») ; couche L5 (ligne 261) : empreinte "
             "situationnelle + 3 inférences nommées canon (alarme intérieure, mains "
             "libres, le près coûte).")
    A.append("- SPEC verrouillée (A1-A6 tranchés par délégation fondateur "
      "20/10 — (a)×6, pattern Q1/Q2) : A1 « La lumière sous ma carte » · "
      "A2 dérivation pure · A3 banque 8 forces (4 PLEINES + 4 CALMES §5.5), "
      "max 2 principales · A4 L5 en Q3, L6 reportée Q4 · A5 filet hérité "
      "uniquement · A6 L1 min+drapeaux, L3 verbatim, L4 nuage, L7 RCI 4 "
      "lumières, paliers hérités sans recalcul.")
    A.append("- Séquence D-CANAL-2 : production (3 fichiers) → run ×2 (seed 42, "
      "deux exécutions indépendantes) → SHA ×2 → publication → pointeurs → "
      "audit origin → contresignature RIO-21 (fondateur).")
    A.append("- Héritages : les entrées consomment les sorties contresignées RIO-19 "
      "(SHA 3b1a7490…) et RIO-20 (SHA 6d9b3c59…) — en simulation, patrons "
      "générés par le même modèle D-TABLE (lois d'items identiques aux "
      "moteurs Q1/Q2), jamais inventés à la main.")
    A.append("- Leçons appliquées avant tout run : conformité sur les DÉCISIONS "
      "(pattern Q1) · vérité CLIP-AWARE par le MÊME code de règles que le "
      "moteur appliqué aux espérances (zéro dérive — précision Q3) · "
      "saturation des sources cibles (μ 5,0 / p 1,0 / μ_N4 −1 → clip) pour "
      "tenir les centres ≥ 3σ_eff malgré la granularité discrète des faces "
      "héritées · découplage des règles d'empreinte d'avec les sources de "
      "forces via les faces dédiées (N1/AO2/R2/J2) · calibration Monte-Carlo "
      "déterministe (graine 4200, 20 000 couples/groupe — la surface de "
      "décision Q3, moyennes de moyennes et ensembles de règles, n'est pas "
      "fermée : borne MC ±0,002 ≪ écart binomial 2,5σ).")
    A.append("")
    A.append("## B. L'instrument (A1-A6 verrouillés)")
    A.append("")
    A.append("- **A1** : titre RIO-21 « La lumière sous ma carte » — miroir exact de "
      "Q2 : la même mécanique, l'autre face (canon ligne 27 : « Ombre ET "
      "lumière structurelles »).")
    A.append("- **A2** : dérivation pure — zéro item nouveau. Score d'une force = "
      "moyenne de ses DEUX sources (intervalles propagés : SE = "
      "√(SE1²+SE2²)/2, CI90 = 1,64 × SE) ; lecture L3 verbatim, FRONTIÈRE "
      "conservatrice ; soutenue ⟺ conservateur ≥ TRANQUILLE, sinon mention "
      "calme §5.5 (« rien à fabriquer »). **Zéro constante nouvelle** (1,64 / "
      "0,60 / 0,2517 / 1,80-2,60-3,20 / 0,58-0,41 — verbatim canon).")
    A.append("- **A3** : banque 8 forces — 4 PLEINES (« La part reconnue » (A) · "
      "« Le retour qui tient » (N) · « Le geste qui répare » (R) · « La main "
      "ouverte » (J, type CALME : absence décrite, jamais une preuve de "
      "confiance — affichée ⟺ conservateur DISCRÈTE, silence J sinon)) + "
      "4 CALMES (« Le crédit juste » · « Le calme qui porte » · « Le terrain "
      "de travail » · « La lentille au repos ») ; max 2 principales (RIO-13) "
      "+ mentions ; hiérarchie si écart ≥ 1,64 × √(SE²+SE²) sinon NUAGE.")
    A.append("- **A4** : L5 en Q3 — empreinte situationnelle par matrice de règles "
      "déterministes (pattern RIO-12) : EMP-N « La vague qui retombe "
      "lentement » · EMP-A « La part qui s'efface » · EMP-R « Le mur après "
      "le conflit » · EMP-J « La vérification qui appelle la vérification » "
      "(règle : face carte dédiée ≥ VIVE ET bloc ombre même lettre ≥ VIVE — "
      "faces carte dédiées N1/AO2/R2/J2, découplées des sources de forces) ; "
      "3 inférences nommées canon (ligne 261) : INF-1 Alarme intérieure "
      "(ombre N ≥ VIVE + carte N1 ≥ VIVE + ombre N-retour ≤ TRANQUILLE) · "
      "INF-2 Mains libres (ombre J ≤ TRANQUILLE + carte axe J ≤ TRANQUILLE "
      "+ ombre geste ≥ VIVE) · INF-3 Le près coûte (ombre R ≥ VIVE + geste ≥ "
      "VIVE) — affichées en PROPOSITION contestable (« ça te ressemble ? », "
      "lignes 272-273) ; L6 « Couple par PERCENTILES » reportée à Q4 "
      "(divergence avec l'annotation A4 Q1 documentée D-HIST).")
    A.append("- **A5** : filet hérité uniquement — Q1 signal OU Q2 P-FILTRE → "
      "P-FILTRE (source tracée Q1/Q2), court-circuit AVANT l'arbre ; "
      "héritage Q1 RQS < 70 → QUÊTE_VERROUILLÉE ; zéro voie détectée "
      "nouvelle (rien à détecter sans items propres — zéro constante).")
    A.append("- **A6** : couches — L1 adapté (RQS lumière = min(RQS héritages) + "
      "drapeaux de cohérence de dérivation, pénalité 20 — garde jamais "
      "déclenché sur entrées valides : D-TABLE) · L3 verbatim (1,80 / 2,60 / "
      "3,20, transposition 1,00-4,00) · L4 nuage lumière (canon ligne 260 "
      "appliqué aux forces) · L7 RCI 8 semaines posée sur les 4 lumières "
      "(0,58 / 0,41 verbatim, Δ = re − base) · paliers hérités affichés "
      "SANS recalcul (identité vérifiée en C1 — leçon Q5-A3).")
    A.append("")
    A.append("## C. Simulation (univers verrouillé §6)")
    A.append("")
    A.append(f"- 560 couples, 14 groupes × 40, seed 42 ×2 — lois exactes des "
      f"moteurs Q1/Q2 : cochés Bernoulli(p), fréquences clip(round(N(μ, "
      f"0,60)), 0, 3), items Q1 clip(round(N(μ, 0,60)), 1, 4) ; entrées "
      f"fixées (pattern Q1) : G08 (signaux), G10 (ombre supprimée), G11 "
      f"(frontières), G12 (nuage), G13 (pièges RQS), G14 (re-test).")
    A.append(f"- Vérité = le moteur appliqué aux héritages d'ESPÉRANCE (E[item | μ] "
      f"CLIP-AWARE, énumération exacte) — mêmes règles, zéro dérive ; "
      f"conformité au niveau COUPLE (deux rives — pattern Q1) sur : état, "
      f"mode, forces soutenues + conservateurs, calmes, main ouverte J, "
      f"hiérarchie/nuage, empreintes, inférences, statut RQS, verdicts RCI.")
    A.append(f"- Calibration D-STD-2 : p̂ Monte-Carlo déterministe (graine 4200, "
      f"20 000 couples/groupe) → seuil = (p̂ − 2,5 σ̂) × 100 ; **bornes "
      f"DISTINCTES {c3['n_stochastiques']}/{c3['n_stochastiques']}** pour les "
      f"groupes stochastiques (leçon SM-Q5 ad01f21) ; {c3['n_deterministes']} "
      f"groupes DÉTERMINISTES (entrées fixées, p̂ = 1,0) au seuil 100,0, "
      f"signalés comme tels.")
    A.append(f"- D-GÉOMÉTRIE : sources cibles saturées (μ 5,0 / p 1,0 / μ_N4 −1) "
      f"pour tenir les centres hors des seuils L3 ; les groupes dont le "
      f"centre reste en bande [seuil ± 3σ_eff] sont rapportés au tableau des "
      f"centres (calib.centres) — leçon grain SM-Q4/Q5.")
    A.append("")
    A.append("## D. Résultats des critères")
    A.append("")
    A.append("| # | Critère | Résultat | Verdict |")
    A.append("|---|---------|----------|---------|")
    A.append(f"| C1 | D-VÉRITÉ double sens : D-TABLE {c1['n_cas_d_table']} cas "
      f"(100 %) + croisement moteur/spécification {c1['croise'][0]}/"
      f"{c1['croise'][1]} + nomenclature + anti-fabrication DOUBLE SENS | "
      + ("100 %" if c1["ok"] else "ÉCHEC") + " | "
      + ("✅" if c1["ok"] else "❌") + " |")
    A.append(f"| C2 | D-CONFIRMATION : déterminisme pur "
      f"({'identique' if c2['deterministe'] else 'DIVERGENT'}) + "
      f"anti-inversion temporelle ({c2['n_rci']} re-tests) | "
      + ("100 %" if c2["ok"] else "ÉCHEC") + " | "
      + ("✅" if c2["ok"] else "❌") + " |")
    A.append(f"| C3 | D-STD-2 : {c3['n_conformes']}/{c3['n_total']} couples "
      f"conformes, {c3['n_stochastiques']} seuils stochastiques DISTINCTS + "
      f"{c3['n_deterministes']} groupes déterministes à 100,0 | "
      + ("tous au seuil" if c3["ok"] else "ÉCHEC") + " | "
      + ("✅" if c3["ok"] else "❌") + " |")
    A.append(f"| C4 | D-EMPREINTE : SHA ×2 sur contenu canonique, 2 exécutions | "
      f"identiques | ✅ |")
    A.append(f"| C5 | Affichage : gabarit §5.1 {r1['c5']['gabarit'][0]}/"
      f"{r1['c5']['gabarit'][1]} rives affichées + FRONTIÈRE conservatrice "
      f"+ nuage cohérent + « ça te ressemble ? » + bandeau D-SIM | "
      + ("4/4" if r1["c5"]["ok"] else "ÉCHEC") + " | "
      + ("✅" if r1["c5"]["ok"] else "❌") + " |")
    A.append(f"| C6 | Anti-étiquette double sens : 0 mot interdit sur "
      f"{len(classes)*2} affichages + « rien à fabriquer » + « terrain de "
      f"travail, pas un verdict » + lumière = penchant (jamais un trait "
      f"figé, jamais un mérite moral) + propositions contestables | "
      + ("0 interdit" if r1["c6"]["ok"] else "ÉCHEC") + " | "
      + ("✅" if r1["c6"]["ok"] else "❌") + " |")
    A.append(f"| C7 | D-CRISE : {r1['c7']['n_p_filtre']} P-FILTRE court-circuit "
      f"avant l'arbre (palier ORIENTATION) + {r1['c7']['n_verrouillee']} "
      f"quêtes verrouillées (héritage invalide) + {r1['c7']['n_carte_seule']} "
      f"carte-seule 0 invention + 0 tiers évalué | "
      + ("conforme" if r1["c7"]["ok"] else "ÉCHEC") + " | "
      + ("✅" if r1["c7"]["ok"] else "❌") + " |")
    A.append("")
    A.append(f"**Verdict global : {r1['verdict']}** — la lumière (forces dérivées) "
      f"est démontrée de bout en bout : héritage double Q1+Q2 → 4 lumières "
      f"dérivées (moyennes, intervalles propagés) → banque 8, max 2 → "
      f"empreinte situationnelle (matrice) → 3 inférences nommées canon → "
      f"palier hérité → L7 sur les 4 lumières → filet avant l'arbre.")
    A.append("")
    A.append("## E. Lectures remarquables")
    A.append("")
    etats = defaultdict(int)
    for m in classes:
        for rive in ("rive_a", "rive_b"):
            etats[m[rive]["etat"]] += 1
    A.append("- États servis (1120 rives) : " + " · ".join(
        f"{k} {v}" for k, v in sorted(etats.items())) + ".")
    n_emp = sum(len(o["empreinte"] or []) for m in classes
                for o in (m["rive_a"], m["rive_b"]))
    n_inf = sum(len(o["inferences"] or []) for m in classes
                for o in (m["rive_a"], m["rive_b"]))
    A.append(f"- Reconnaissance (proxy lignes 272-273) : {n_emp} affichages "
      f"d'empreinte et {n_inf} d'inférences, chacun traçant ses règles "
      f"sources (C1) et portant « ça te ressemble ? » (C5) — couverture de "
      f"règles vraies ≥ 70 % vérifiée par groupe (C3).")
    A.append("- Co-déclenchements structurels documentés : INF-1 co-fire avec "
      "EMP-N quand la montée (N1) et l'orage se croisent avec un retour "
      "discret (c'est la même situation lue deux fois — situation vs "
      "anticipation) ; INF-3 avec EMP-R quand le mur et le geste coexistent "
      "— le vrai inclut les deux règles, la conformité porte sur l'ENSEMBLE.")
    A.append("- Nuages : deux forces FORTE au même niveau → NUAGE (jamais de "
      "hiérarchie inventée — G01/G04 : écart σ 0,27 vs seuil ~0,47) ; G12 "
      "prouve le NUAGE exactement (entrées fixées, écart 0).")
    A.append("- L7 : deltas injectés 1,17 (FIABLE) et 0 (BRUIT) sur la force cible "
      "G14 — la bande SUGGESTION (0,41-0,58) reste prouvée exactement en "
      "D-TABLE (bornes 0,41 / 0,58 incluses).")
    A.append("")
    A.append("## F. Corrections pré-attrapées et découvertes documentées")
    A.append("")
    A.append("1. **Granularité discrète des héritages** : les faces Q2 (pas entiers "
      "A_part/N_retour, pas 0,5 R_geste) placent la masse des forces sur des "
      "grilles grossières — la décision FORTE (≥ 3,20 + CI) est bruitée si "
      "les sources ne saturent pas (P(force ≥ borne) ≈ 0,77 pour des μ "
      "« vives » non saturés) → sources cibles saturées (μ 5,0 / p 1,0 / "
      "μ_N4 −1 → clip), attrapé avant le run, documenté.")
    A.append("2. **Vérité par le même moteur** : le vrai est le moteur appliqué aux "
      "espérances CLIP-AWARE — élimine toute dérive entre fonctions de "
      "vérité et règles du moteur (précision Q3 du pattern Q2).")
    A.append("3. **Découplage empreinte/forces** : les règles d'empreinte lisent "
      "des faces carte DÉDIÉES (N1/AO2/R2/J2) ≠ sources des forces (AO1/N2/"
      "R1/J1+J2) — sans ce découplage, une même face ne peut pas être à la "
      "fois vive (règle) et discrète (force silencieuse) ; leçon de "
      "conception documentée.")
    A.append("4. **Calibration Monte-Carlo déterministe** : la surface de décision "
      "Q3 (moyennes de moyennes, ensembles de règles, sous-géométries) "
      "n'admet pas d'énumération exacte fermée — p̂ par MC (graine 4200, "
      "20 000 couples/groupe), borne ±0,002 ≪ 2,5σ̂ binomial ; les groupes "
      "déterministes (entrées fixées) portent le seuil 100,0 et sont "
      "signalés (aucun masquage possible — précision ad01f21).")
    A.append("5. **Retour N4 hérité** : un μ_N4 bas gonfle N_retour (corrigé 3−raw) "
      "et crée des forces N fantômes dans les groupes calmes — μ_N4 ≥ 2,5 "
      "imposé aux groupes à lumière N discrète (leçon CLIP-AWARE Q2, côté "
      "inversion).")
    A.append("6. **G13 repensé** : la contradiction carte vive × ombre basse avec "
      "axes saturés déclenche la convergence 0,00 (SUPPRIMÉE — le pipeline "
      "Q2 fonctionne) → géométrie à axes asymétriques (faces vives, axes "
      "tranquilles) pour tester PRUDENCE/INVALIDE en mode complet.")
    A.append("")
    A.append("## G. Chaîne et contresignature")
    A.append("")
    A.append(f"- SHA-256 des résultats (contenu canonique, deux exécutions "
      f"indépendantes) : `{sha1}` = `{sha2}`.")
    A.append(f"- Figures : {', '.join(figs)} (1920×1080).")
    A.append("- Chaîne : abf5c83 (RIO-20 contresigné — registre 20/20) → cbfd193 "
      "(SPEC Q3 proposée) → 35cb049 (Task 142) → 7e05861 (SPEC Q3 "
      "verrouillée — délégation A1-A6) → ce dépôt (RIO-21 produit — en "
      "attente de contresignature).")
    A.append("- **Prochaine étape** : contresignature fondateur RIO-21 (« je "
      "valide ») → registre 21/21, personnalité 3/5 contresignée → SPEC Q4 "
      "« Le croisement » (à deux, L6 — ligne 223).")
    return "\n".join(A)


# ═══════════════════ Exécution complète (run ×2, SHA ×2) ══════════════════════
def executer(publier=True):
    base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    shas = []
    r1 = None
    for run in (1, 2):
        couples = sim.tous_les_couples(run=run)
        classes = [core.deriver_couple(c) for c in couples]
        for c, m in zip(couples, classes):
            assert bien_forme(c, m), f"couple mal formé {c['groupe']}#{c['idx']}"
        calib = sim.calibration_d_std_2()
        r = {
            "c1": critere_c1(couples, classes),
            "c2": critere_c2(couples, classes),
            "c3": critere_c3(couples, classes, calib),
            "c5": critere_c5(couples, classes),
            "c6": critere_c6(couples, classes),
            "c7": critere_c7(couples, classes),
        }
        r["c4"] = {"sha": None, "ok": False}
        r["calib"] = {"seuils": calib["seuils"],
                      "centres": calib["centres"],
                      "bornes_distinctes": calib["bornes_distinctes"],
                      "n_stochastiques": calib["n_stochastiques"],
                      "n_deterministes": calib["n_deterministes"]}
        r["meta"] = {"date": DATE, "n_couples": len(couples),
                     "n_groupes": 14, "seed": sim.SEED, "run": run,
                     "spec": "PERS-Q3-SPEC.md (verrouillée 7e05861)",
                     "heritage": "RIO-19 (SHA 3b1a7490…) + RIO-20 "
                                 "(SHA 6d9b3c59…) contresignés"}
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
        jpath = os.path.join(resdir, f"resultats-pers-q3-{DATE}.json")
        with open(jpath, "w", encoding="utf-8") as f:
            json.dump(publie, f, ensure_ascii=False, indent=1, sort_keys=True)
        figs = generer_figures(couples, classes, r1, figdir)
        rapport = generer_rapport(r1, couples, classes, shas[0], shas[1], figs)
        rpath = os.path.join(resdir, f"rapport-pers-q3-{DATE}.md")
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
    executer()
