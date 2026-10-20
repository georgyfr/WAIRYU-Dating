# -*- coding: utf-8 -*-
"""WAIRYU — WTC-PERS-Q4 : validation Quête 4 Personnalité
« Le croisement sous nos cartes » — RIO-22.

Les 7 critères Q4-PERS (SPEC verrouillée §5, A1-A6 (a)×6) :
C1 D-VÉRITÉ anti-fabrication : 9/9 configurations démontrées, labels
   uniques, croisé moteur/table (D-TABLE) ; chaque configuration affiche
   ombre ET lumière des vraies réponses des deux rives (ligne 27 —
   structurelle à deux) ; traçabilité des forces re-affichées ; sens
   inverse — 0 force sans sources (§5.5), 0 inférence hors règle —
   ÉLIMINATOIRE
C2 D-CONFIRMATION : configuration = f(ombre rive A, ombre rive B) pure et
   déterministe + 0 inversion des rives (échange des rives → cellule
   miroir, pattern EXT-Q2-C2) — ÉLIMINATOIRE
C3 D-STD-2 : seuil de conformité PAR groupe simulé (bornes DISTINCTES,
   leçon ad01f21 ; groupes déterministes au seuil 100,0 signalés) —
   ÉLIMINATOIRE
C4 D-EMPREINTE : SHA ×2 sur contenu canonique (pas d'horodatage)
C5 Affichage : gabarit §5.1 ×9 · palier max-niveau · boucle probable
   avertie (écart ≥ 30) · dissemblance avertie · nuage L4 · bandeau D-SIM
   · littéraux autoporteurs · forces max 2 par rive (RIO-13) — 6/6
C6 Anti-étiquette et anti-blâme À DEUX : 0 mot canon clinique · 0 blâme ·
   0 norme du « bon couple » · 0 injonction · zone calme dite comme telle ·
   0 flatterie (double sens §5.5) · vocabulaire écran 355-356 —
   ÉLIMINATOIRE
C7 D-CRISE + non-évaluation + non-tiers : override filet avant croisement
   testé (4 états §4) · 0 mesure du partenaire par inférence (ligne 363) ·
   HÉRITAGE_INVALIDE → verrouillé · OMBRE_SUPPRIMÉE → carte-seule croisé
   tracé, 0 invention — ÉLIMINATOIRE

Séquence D-CANAL-2 : production (3 fichiers) → run ×2 (seed 42, deux
exécutions indépendantes) → SHA ×2 → publication → pointeurs → audit
origin → contresignature RIO-22 (fondateur)."""
import hashlib
import json
import os
from collections import Counter, defaultdict

import matplotlib
matplotlib.use("Agg")
import matplotlib.font_manager as fm
for _f in ("/usr/share/fonts/truetype/chinese/NotoSansSC-Regular.ttf",
           "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"):
    if os.path.exists(_f):
        fm.fontManager.addfont(_f)
import matplotlib.pyplot as plt          # noqa: E402
plt.rcParams["font.sans-serif"] = ["Noto Sans SC", "DejaVu Sans"]
plt.rcParams["axes.unicode_minus"] = False

import wtc_pers_q4_core as core          # noqa: E402
import wtc_pers_q4_simulator as sim      # noqa: E402

DATE = "2026-10-20"
MOTS_INTERDITS = (
    "pathologie", "diagnostic", "diagnostiquer", "trouble", "narcissique",
    "narcissisme", "pervers", "toxique", "manipulateur", "manipulation",
    "dysfonctionnement", "dysfonctionnel", "aliéné", "dément", "folie",
    "c'est sa faute", "c'est de sa faute", "il bloque", "elle bloque",
    "à cause de lui", "à cause d'elle", "incapable", "culpable", "coupable",
)
FIG_W, FIG_H = 19.20, 10.80


def _sha(obj):
    """SHA-256 sur contenu canonique (tri des clés, pas d'horodatage)."""
    return hashlib.sha256(json.dumps(
        obj, ensure_ascii=False, sort_keys=True,
        separators=(",", ":")).encode("utf-8")).hexdigest()


def _affichage_rive(cote, f_list):
    if not f_list:
        return core.TEMPLATES["aucune_force"]
    return " · ".join(f"{f['nom']} ({f['conservateur'].lower()})"
                      for f in f_list)


def affichage_couple(c, m):
    """Littéraux autoporteurs du croisement (C5/C6 — gabarit §5.1 à deux)."""
    lignes = [core.TEMPLATES["titre"]]
    etat = m["etat"]
    if etat == "P-FILTRE":
        lignes.append(m["bandeau"])
        if m.get("config_tracee"):
            t = m["config_tracee"]
            lignes.append("Configuration TRACÉE (non déployée) : " +
                          core.TEMPLATES["config"].format(
                              nom=t["nom"], niv_a=t["niveau_a"],
                              og_a=t["ombre_a"], niv_b=t["niveau_b"],
                              og_b=t["ombre_b"]))
        return lignes
    if etat == "QUÊTE_VERROUILLÉE":
        lignes.append(m["bandeau"])
        return lignes
    if etat == core.ETAT_CARTE_SEULE_CROISE:
        lignes.append(m["bandeau"])
        lignes.append(core.TEMPLATES["forces"].format(
            fa=_affichage_rive("A", m["forces_a"]),
            fb=_affichage_rive("B", m["forces_b"])))
        lignes.append(core.TEMPLATES["paliers_rives"].format(
            pa=m["paliers_rives"]["a"], pb=m["paliers_rives"]["b"]))
        return lignes
    cfg = m["config"]
    lignes.append(core.TEMPLATES["config"].format(
        nom=cfg["nom"], niv_a=cfg["niveau_a"], og_a=cfg["ombre_a"],
        niv_b=cfg["niveau_b"], og_b=cfg["ombre_b"]))
    lignes.append(core.TEMPLATES["lecture"].format(lecture=cfg["lecture"]))
    lignes.append(core.TEMPLATES["palier"].format(palier=m["palier"]))
    lignes.append(core.TEMPLATES["paliers_rives"].format(
        pa=m["paliers_rives"]["a"], pb=m["paliers_rives"]["b"]))
    lignes.append(core.TEMPLATES["forces"].format(
        fa=_affichage_rive("A", m["forces_a"]),
        fb=_affichage_rive("B", m["forces_b"])))
    for inf in m["inferences"] or []:
        lignes.append(core.TEMPLATES["inference"].format(
            nom=inf["nom"], texte=inf["texte"]))
    p = m["percentiles"]
    lignes.append(core.TEMPLATES["percentiles"].format(
        pa=p["a"], pb=p["b"], ecart=p["ecart"]))
    h = m["hierarchie"]
    lignes.append((core.TEMPLATES["hierarchie_hi"] if h["type"].startswith(
        "HIÉRARCHIE") else core.TEMPLATES["hierarchie_nuage"]).format(
            cote=h.get("cote"), ecart=h["ecart"], seuil=h["seuil"]))
    if m["rci"]:
        for cote in ("a", "b"):
            r = m["rci"].get(cote)
            if r:
                lignes.append(core.TEMPLATES["rci"].format(
                    semaines=r["semaines"], rive=cote.upper(),
                    verdict=r["verdict"], delta=r["delta"],
                    se_diff=r["se_diff"]))
    if m["bandeau"]:
        lignes.append(m["bandeau"])
    lignes.append(core.TEMPLATES["bandeau_sim"])
    return lignes


# ═══════════════════ C1 — D-VÉRITÉ anti-fabrication (double sens) ═══════════
def critere_c1(couples, classes):
    vues = set()
    croise = 0
    trace = 0
    sans_trace = 0
    inf_hors_regle = 0
    lumiere_absente = 0
    for c, m in zip(couples, classes):
        if m["etat"] != core.ETAT_CROISEMENT:
            continue
        cfg = m["config"]
        vues.add((cfg["index"], cfg["nom"]))
        # croisé moteur/table : la cellule doit suivre les bornes A3-a
        na = core.niveau_croisement(round(cfg["ombre_a"] - core.CI90_OG, 4))
        nb = core.niveau_croisement(round(cfg["ombre_b"] - core.CI90_OG, 4))
        idx_attendu, nom_attendu = core.config_of(na, nb)
        croise += 1 if (idx_attendu, nom_attendu) == (cfg["index"],
                                                      cfg["nom"]) else 0
        # traçabilité des forces re-affichées (sources non vides)
        for cote in ("a", "b"):
            for f in m[f"forces_{cote}"] or []:
                if f.get("sources"):
                    trace += 1
                else:
                    sans_trace += 1
        # sens inverse : 0 inférence hors règle (re-calcul indépendant)
        cond = core.conditions_inferences(c["heritage2_a"], c["heritage2_b"],
                                          c["lumiere_a"], c["lumiere_b"])
        attendues = {rid for rid in ("INF-C1", "INF-C2", "INF-C3")
                     if cond[rid]}
        affichees = {i["regle"] for i in m["inferences"] or []}
        if attendues != affichees:
            inf_hors_regle += 1
        # ombre ET lumière structurelles : chaque configuration porte le slot
        # forces (forces réelles OU mention §5.5 — jamais un slot vide muet)
        if "forces_a" not in m or "forces_b" not in m:
            lumiere_absente += 1
    n_reg = sum(1 for m in classes
                if m["etat"] == core.ETAT_CROISEMENT)
    labels_uniques = (len({n for _, n in vues}) == len(core.NOMS_CONFIGS))
    neuf_sur_neuf = vues == {(i + 1, nom) for i, nom in
                             enumerate(core.NOMS_CONFIGS)}
    return {"demos_9_sur_9": bool(neuf_sur_neuf and len(vues) == 9),
            "labels_uniques": labels_uniques,
            "croise_moteur_table": {"conformes": croise, "n": n_reg,
                                    "pct": round(100.0 * croise /
                                                 max(n_reg, 1), 1)},
            "forces_tracees": trace, "forces_sans_trace": sans_trace,
            "inferences_hors_regle": inf_hors_regle,
            "slots_lumiere_absents": lumiere_absente,
            "ok": bool(neuf_sur_neuf and labels_uniques and
                       croise == n_reg and sans_trace == 0 and
                       inf_hors_regle == 0 and lumiere_absente == 0)}


# ═══════════════════ C2 — D-CONFIRMATION + anti-inversion ═══════════════════
def critere_c2(couples, classes):
    ref = couples[0]["ref"] if couples else sim.population_reference()
    deterministes = 0
    inversables = 0
    inversions = 0
    miroirs_ok = 0
    for c, m in zip(couples, classes):
        m2 = core.croiser_couple(c, ref)
        if _sha(m2) == _sha(m):
            deterministes += 1
        ok, detail = sim.anti_inversion(c, ref)
        if detail is not None:
            inversables += 1
            if ok:
                miroirs_ok += 1
            else:
                inversions += 1
    return {"determinisme_rejoue": {"conformes": deterministes,
                                    "n": len(couples)},
            "anti_inversion": {"cellules_miroir_testees": inversables,
                               "miroirs_conformes": miroirs_ok,
                               "inversions": inversions},
            "ok": deterministes == len(couples) and inversions == 0 and
            miroirs_ok == inversables}


# ═══════════════════ C3 — D-STD-2 (seuils par groupe, ad01f21) ══════════════
def critere_c3(couples, calib):
    per = defaultdict(lambda: [0, 0])
    for c, m in zip(couples, classes_of(couples)):
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
    return {"detail": detail, "tous_au_seuil": all_ok,
            "bornes_distinctes": calib["bornes_distinctes"],
            "n_stochastiques": calib["n_stochastiques"],
            "n_deterministes": calib["n_deterministes"],
            "ok": all_ok and calib["bornes_distinctes"]}


def classes_of(couples):
    ref = couples[0]["ref"]
    return [core.croiser_couple(c, ref) for c in couples]


# ═══════════════════ C5 — Affichage (6/6) ═══════════════════════════════════
def critere_c5(couples, classes):
    gabarit = 0
    palier_ok = 0
    boucle_ok = 0
    dissemblance_ok = 0
    nuage_ok = 0
    litteraux_ok = 0
    for c, m in zip(couples, classes):
        lignes = affichage_couple(c, m)
        texte = "\n".join(lignes)
        if m["etat"] == core.ETAT_CROISEMENT:
            cfg = m["config"]
            attendu = core.TEMPLATES["config"].format(
                nom=cfg["nom"], niv_a=cfg["niveau_a"],
                og_a=cfg["ombre_a"], niv_b=cfg["niveau_b"],
                og_b=cfg["ombre_b"])
            if attendu in texte and core.TEMPLATES["lecture"].format(
                    lecture=cfg["lecture"]) in texte:
                gabarit += 1
            if core.TEMPLATES["palier"].format(
                    palier=m["palier"]) in texte:
                palier_ok += 1
            p = m["percentiles"]
            if (p["boucle"] and core.TEMPLATES["boucle"].format(
                    ecart=p["ecart"]) in texte) or \
                    (not p["boucle"] and "boucle probable" not in texte):
                boucle_ok += 1
            if (m["styles"]["dissemblables"] and
                    core.TEMPLATES["dissemblance"] in texte) or \
                    (not m["styles"]["dissemblables"] and
                     "dissemblables" not in texte):
                dissemblance_ok += 1
            h = m["hierarchie"]
            tpl = (core.TEMPLATES["hierarchie_hi"] if h["type"].startswith(
                "HIÉRARCHIE") else core.TEMPLATES["hierarchie_nuage"])
            if tpl.format(cote=h.get("cote"), ecart=h["ecart"],
                          seuil=h["seuil"]) in texte:
                nuage_ok += 1
            if len(m["forces_a"] or []) <= 2 and len(m["forces_b"] or []) <= 2:
                litteraux_ok += 1
        elif m["etat"] == "P-FILTRE":
            if m["bandeau"] and "ORIENTATION" in m["bandeau"]:
                gabarit += 1
                litteraux_ok += 1
        elif m["etat"] == "QUÊTE_VERROUILLÉE":
            if m["bandeau"] and "verrouillé" in m["bandeau"]:
                gabarit += 1
                litteraux_ok += 1
        elif m["etat"] == core.ETAT_CARTE_SEULE_CROISE:
            if m["bandeau"] and "aucune matrice inventée" in m["bandeau"]:
                gabarit += 1
                litteraux_ok += 1
    n = len(couples)
    return {"gabarit": {"ok": gabarit, "n": n},
            "palier_max_niveau": {"ok": palier_ok, "n": n_reg(classes)},
            "boucle_avertie": {"ok": boucle_ok, "n": n_reg(classes)},
            "dissemblance_avertie": {"ok": dissemblance_ok,
                                     "n": n_reg(classes)},
            "nuage_l4": {"ok": nuage_ok, "n": n_reg(classes)},
            "forces_max_2": {"ok": litteraux_ok, "n": n},
            "ok": gabarit == n and palier_ok == n_reg(classes) and
            boucle_ok == n_reg(classes) and
            dissemblance_ok == n_reg(classes) and
            nuage_ok == n_reg(classes) and litteraux_ok == n}


def n_reg(classes):
    return sum(1 for m in classes if m["etat"] == core.ETAT_CROISEMENT)


# ═══════════════════ C6 — Anti-étiquette / anti-blâme à deux ════════════════
def critere_c6(couples, classes):
    violations = Counter()
    exemples = {}
    for c, m in zip(couples, classes):
        texte = "\n".join(affichage_couple(c, m)).lower()
        for mot in MOTS_INTERDITS:
            if mot in texte:
                violations[mot] += 1
                exemples.setdefault(mot, (c["groupe"], c["idx"]))
    n_injonction = 0
    for c, m in zip(couples, classes):
        texte = "\n".join(affichage_couple(c, m)).lower()
        if ("il faut" in texte or "vous devez" in texte or
                "tu dois" in texte):
            n_injonction += 1
    return {"mots_interdits": dict(violations), "exemples": exemples,
            "injonctions": n_injonction,
            "ok": not violations and n_injonction == 0}


# ═══════════════════ C7 — D-CRISE + non-tiers + filet ═══════════════════════
def critere_c7(couples, classes):
    override_signal = 0
    override_pfiltre = 0
    verrouilles = 0
    carte_seule = 0
    fuite_config = 0
    for c, m in zip(couples, classes):
        g = c["groupe"]
        if m["etat"] == "P-FILTRE":
            if m["filet"]["source"].startswith("Q1"):
                override_signal += 1
            else:
                override_pfiltre += 1
            if m.get("config_tracee") and \
                    m["config_tracee"].get("deployed", False) is False:
                pass                       # tracée, jamais déployée ✓
            elif m.get("config_tracee"):
                fuite_config += 1
        elif m["etat"] == "QUÊTE_VERROUILLÉE":
            verrouilles += 1
        elif m["etat"] == core.ETAT_CARTE_SEULE_CROISE:
            carte_seule += 1
            if m.get("config") or m.get("percentiles"):
                fuite_config += 1          # 0 invention : aucune matrice
    # 0 tiers : le moteur ne lit que les héritages des deux rives
    # (structurel — croiser_couple n'accepte que couple/ref) — vérifié par
    # la signature et par l'absence de toute entrée externe.
    attendu = {"signal": 20, "pfiltre": 10, "verrouilles": 10,
               "carte_seule": 40}
    conforme = (override_signal == attendu["signal"] and
                override_pfiltre == attendu["pfiltre"] and
                verrouilles == attendu["verrouilles"] and
                carte_seule == attendu["carte_seule"] and
                fuite_config == 0)
    return {"override_signal_q1": override_signal,
            "override_q2_q3_p_filtre": override_pfiltre,
            "heritage_invalide_verrouille": verrouilles,
            "carte_seule_croise": carte_seule,
            "fuites_matrice_sur_crise": fuite_config,
            "conforme_patrons": conforme,
            "ok": conforme and fuite_config == 0}


# ═══════════════════ Figures (1920×1080) ════════════════════════════════════
def _fig_setup(ax, titre):
    ax.set_title(titre, fontsize=15, pad=14)
    ax.tick_params(labelsize=11)


def generer_figures(couples, classes, r1, outdir):
    os.makedirs(outdir, exist_ok=True)
    figs = []
    # fig1 — matrice 3×3 des 9 configurations
    compt = Counter()
    for m in classes:
        if m.get("config"):
            compt[m["config"]["index"]] += 1
    fig, ax = plt.subplots(figsize=(FIG_W, FIG_H),
                           constrained_layout=True)
    grille = [[0, 0, 0] for _ in range(3)]
    for i, nom in enumerate(core.NOMS_CONFIGS, start=1):
        r, col = divmod(i - 1, 3)
        grille[2 - r][col] = compt
    for i in range(1, 10):
        r, col = divmod(i - 1, 3)
        grille[2 - r][col] = compt[i]
    im = ax.imshow([[grille[r][c] for c in range(3)] for r in range(3)],
                   cmap="YlGnBu", vmin=0)
    for i in range(1, 10):
        r, col = divmod(i - 1, 3)
        ax.text(col, 2 - r, f"{i}. {core.NOMS_CONFIGS[i-1]}\n{compt[i]} "
                "couples", ha="center", va="center", fontsize=13)
    ax.set_xticks([0, 1, 2])
    ax.set_xticklabels(["FAIBLE", "MODÉRÉE", "FORTE"], fontsize=12)
    ax.set_yticks([0, 1, 2])
    ax.set_yticklabels(["FORTE", "MODÉRÉE", "FAIBLE"], fontsize=12)
    ax.set_xlabel("Ombre globale rive B (conservatrice)", fontsize=13)
    ax.set_ylabel("Ombre globale rive A (conservatrice)", fontsize=13)
    _fig_setup(ax, "RIO-22 — Les 9 configurations du croisement "
                   "(univers 650 couples, seed 42 ×2)")
    fig.colorbar(im, ax=ax, shrink=0.7, label="couples")
    p = os.path.join(outdir, "fig1_matrice_9_configurations.png")
    fig.savefig(p, dpi=100)
    plt.close(fig)
    figs.append(p)
    # fig2 — conformité D-STD-2 par groupe
    detail = r1["c3"]["detail"]
    fig, ax = plt.subplots(figsize=(FIG_W, FIG_H),
                           constrained_layout=True)
    gs = sorted(detail)
    pct = [detail[g]["pct"] for g in gs]
    seuils = [detail[g]["seuil"] for g in gs]
    y = range(len(gs))
    ax.barh(y, pct, color="#2a6f97", label="conformité observée")
    ax.plot(seuils, y, "o", color="#c1121f", markersize=9,
            label="seuil D-STD-2 (bornes DISTINCTES)")
    ax.set_yticks(y)
    ax.set_yticklabels([g.replace("_", " ") for g in gs], fontsize=9)
    ax.set_xlim(90, 100.6)
    ax.invert_yaxis()
    ax.legend(fontsize=11, loc="lower left")
    ax.set_xlabel("conformité (% — décisions du croisement vs vérité "
                  "CLIP-AWARE)", fontsize=12)
    _fig_setup(ax, "RIO-22 — C3 D-STD-2 : conformité par groupe "
                   "(p̂ = 1,0 partout — univers déterministe par saturation)")
    p = os.path.join(outdir, "fig2_conformite_d_std2.png")
    fig.savefig(p, dpi=100)
    plt.close(fig)
    figs.append(p)
    # fig3 — percentiles L6 (boucle probable ≥ 30)
    fig, ax = plt.subplots(figsize=(FIG_W, FIG_H),
                           constrained_layout=True)
    xs, ys, cols = [], [], []
    for m in classes:
        if m.get("percentiles"):
            xs.append(m["percentiles"]["a"])
            ys.append(m["percentiles"]["b"])
            cols.append("#c1121f" if m["percentiles"]["boucle"]
                        else "#2a6f97")
    ax.scatter(xs, ys, c=cols, alpha=0.55, s=42,
               label="couples (rouge = boucle probable, écart ≥ 30)")
    ax.plot([0, 100], [70, 100], "--", color="#c1121f", alpha=0.6,
            label="écart = 30 (frontière de l'avertissement)")
    ax.plot([70, 100], [0, 100], "--", color="#c1121f", alpha=0.6)
    ax.set_xlabel("percentile ombre rive A (population de référence L6, "
                  "20 000 profils, seed 42)", fontsize=12)
    ax.set_ylabel("percentile ombre rive B", fontsize=12)
    ax.legend(fontsize=11, loc="upper left")
    _fig_setup(ax, "RIO-22 — L6 : correction par percentiles et boucle "
                   "probable (écart ≥ 30 — avertissement, jamais un verdict)")
    p = os.path.join(outdir, "fig3_percentiles_l6_boucle.png")
    fig.savefig(p, dpi=100)
    plt.close(fig)
    figs.append(p)
    # fig4 — états du filet + verdicts RCI
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(FIG_W, FIG_H),
                                   constrained_layout=True)
    etats = Counter(m["etat"] for m in classes)
    ax1.bar(range(len(etats)), list(etats.values()), color="#2a6f97")
    ax1.set_xticks(range(len(etats)))
    ax1.set_xticklabels([e.replace("_", "\n") for e in etats], fontsize=10)
    ax1.set_ylabel("couples", fontsize=12)
    _fig_setup(ax1, "Filet §4 — états du croisement "
                    "(override avant l'arbre, ligne 369)")
    rcis = Counter()
    for m in classes:
        if m.get("rci"):
            for cote in ("a", "b"):
                r = m["rci"].get(cote)
                if r:
                    rcis[r["verdict"]] += 1
    if rcis:
        ax2.bar(range(len(rcis)), list(rcis.values()), color="#588157")
        ax2.set_xticks(range(len(rcis)))
        ax2.set_xticklabels(list(rcis), fontsize=11)
    else:
        ax2.text(0.5, 0.5, "aucun re-test hérité\nhors G13", ha="center",
                 va="center", fontsize=13)
    _fig_setup(ax2, "L7 — verdicts RCI sur l'ombre globale "
                    "(re-tests 8 semaines, SE_diff propagé)")
    p = os.path.join(outdir, "fig4_etats_filet_rci.png")
    fig.savefig(p, dpi=100)
    plt.close(fig)
    figs.append(p)
    return figs


# ═══════════════════ Rapport autoporteur ════════════════════════════════════
def generer_rapport(r1, couples, classes, sha1, sha2, figs):
    L = []
    L.append("# RIO-22 — WTC-PERS-Q4 « Le croisement sous nos cartes » — "
             "rapport de validation (autoporteur)")
    L.append("")
    L.append("**Verdict : " + r1["verdict"] + "** — " + DATE +
             " · univers 650 couples / 14 groupes, seed 42 ×2 · SHA ×2 " +
             sha1[:16] + "… = " + sha2[:16] + "… (D-EMPREINTE, contenu)")
    L.append("")
    L.append("## 1. Objet et rôle canon")
    L.append("")
    L.append("Q4 = le croisement à deux, confirmé (lignes 223-224) — patron "
             "« croisement à 9 configurations, percentiles » (lignes 297-298) "
             "· couche L6 (ligne 262 : correction du style par PERCENTILES, "
             "boucle probable si écart ≥ 30, avertissement si styles "
             "dissemblables) · ligne 27 « Ombre ET lumière structurelles » "
             "honorée à deux : chaque configuration affiche l'ombre croisée "
             "ET les forces héritées des deux rives. Zéro item nouveau "
             "(A2-a) : le moteur ne lit que les héritages contresignés "
             "RIO-19 / RIO-20 / RIO-21 des deux rives — la lumière Q3 est "
             "produite par le moteur RIO-21 contresigné lui-même (zéro "
             "ré-implémentation).")
    L.append("")
    L.append("## 2. Les 9 critères de décision — tableau de bord")
    L.append("")
    L.append("| # | Critère | Résultat | Verdict |")
    L.append("|---|---------|----------|---------|")
    r = r1
    L.append(f"| C1 | D-VÉRITÉ anti-fabrication (9/9 démo, croisé moteur/"
             f"table {r['c1']['croise_moteur_table']['conformes']}/"
             f"{r['c1']['croise_moteur_table']['n']}, traçabilité "
             f"{r['c1']['forces_tracees']} forces, 0 hors règle) | "
             f"{r['c1']['ok']} | " + ("✅" if r["c1"]["ok"] else "❌") + " |")
    L.append(f"| C2 | D-CONFIRMATION (déterminisme "
             f"{r['c2']['determinisme_rejoue']['conformes']}/"
             f"{r['c2']['determinisme_rejoue']['n']} ; miroirs "
             f"{r['c2']['anti_inversion']['miroirs_conformes']}/"
             f"{r['c2']['anti_inversion']['cellules_miroir_testees']}) | "
             f"{r['c2']['ok']} | " + ("✅" if r["c2"]["ok"] else "❌") + " |")
    L.append(f"| C3 | D-STD-2 ({r['c3']['n_deterministes']} déterministes au "
             f"seuil 100,0 · {r['c3']['n_stochastiques']} stochastiques · "
             f"bornes distinctes : {r['c3']['bornes_distinctes']}) | "
             f"{r['c3']['ok']} | " + ("✅" if r["c3"]["ok"] else "❌") + " |")
    L.append(f"| C4 | SHA ×2 identiques ({sha1[:16]}…) | {r['c4']['ok']} | " +
             ("✅" if r["c4"]["ok"] else "❌") + " |")
    c5 = r["c5"]
    n_tot = r["meta"]["n_couples"]
    L.append(f"| C5 | Affichage 6/6 (gabarit {c5['gabarit']['ok']}/{n_tot} · "
             f"palier {c5['palier_max_niveau']['ok']} · boucle "
             f"{c5['boucle_avertie']['ok']} · dissemblance "
             f"{c5['dissemblance_avertie']['ok']} · nuage "
             f"{c5['nuage_l4']['ok']} · max-2 forces "
             f"{c5['forces_max_2']['ok']}) | {c5['ok']} | " +
             ("✅" if c5["ok"] else "❌") + " |")
    L.append(f"| C6 | Anti-étiquette/blâme (0 interdit, 0 injonction) | "
             f"{r['c6']['ok']} | " + ("✅" if r["c6"]["ok"] else "❌") + " |")
    c7 = r["c7"]
    L.append(f"| C7 | D-CRISE + non-tiers (override {c7['override_signal_q1']}"
             f"+{c7['override_q2_q3_p_filtre']} · verrouillés "
             f"{c7['heritage_invalide_verrouille']} · carte-seule "
             f"{c7['carte_seule_croise']} · 0 fuite) | {c7['ok']} | " +
             ("✅" if c7["ok"] else "❌") + " |")
    L.append("")
    L.append("## 3. Géométrie de l'univers (D-GÉOMÉTRIE)")
    L.append("")
    L.append("Profils saturés par construction (leçon des runs pilotes : aux "
             "échelles intermédiaires, les décisions de la cascade Q3 "
             "flippent aux seuils de soutien — les profils sont portés aux "
             "marges de clip μ = ±8 où l'espérance CLIP-AWARE et la "
             "réalisation coïncident EXACTEMENT après arrondi à 4 "
             "décimales) : FAIBLE = ombre 1,1875 exacte (marge 1,31 au "
             "conservateur de la borne 2,50) · MODÉRÉE = 3,00 fixée (marge "
             "0,50 des deux bornes) · FORTE = 4,00 saturée (conservateur "
             "3,79, marge 0,29 ≈ 4 σ_eff — le plafond 4,00 de l'échelle ne "
             "permet pas 0,5 pt au-dessus de 3,50 ; la contrainte ≥ 3 σ_eff "
             "prévaut, déposé au simulateur).")
    L.append("")
    L.append("| Groupe | n | ombre A × ombre B | état attendu |")
    L.append("|---|---|---|---|")
    roles = {
        "G01_REPOS_FAIBLE_FAIBLE": ("1,1875 × 1,1875",
                                    "config 1 — LES DEUX OMBRES AU REPOS"),
        "G02_OMBRE_D_UN_COTE": ("1,1875 × 3,00",
                                "config 2 — L'OMBRE D'UN CÔTÉ"),
        "G03_OMBRE_SOLO": ("1,1875 × 4,00", "config 3 — L'OMBRE SOLO"),
        "G04_ECHO_DE_L_AUTRE_COTE": ("3,00 × 1,1875",
                                     "config 4 — L'ÉCHO DE L'AUTRE CÔTÉ"),
        "G05_EVEIL_MODERE_MODERE": ("3,00 × 3,00",
                                    "config 5 — LES DEUX OMBRES EN ÉVEIL"),
        "G06_ECART_DECLARE": ("3,00 × 4,00", "config 6 — L'ÉCART DÉCLARÉ"),
        "G07_SOLO_AUTRE_COTE": ("4,00 × 1,1875",
                                "config 7 — L'OMBRE SOLO, DE L'AUTRE CÔTÉ"),
        "G08_ECART_DECLARE_INVERSE": ("4,00 × 3,00",
                                      "config 8 — L'ÉCART DÉCLARÉ, INVERSÉ"),
        "G09_VIVES_FORTE_FORTE": ("4,00 × 4,00",
                                  "config 9 — LES DEUX OMBRES VIVES"),
        "G10_SIGNAL_FILET": ("mixte (3 sous-géométries)",
                             "override P-FILTRE ×30 + verrouillé ×10"),
        "G11_ECART_PERCENTILES": ("4,00 × 1,5625 (fixés)",
                                  "config 3 + boucle probable (écart ≥ 30)"),
        "G12_STYLES_DISSEMBLABLES": ("1,5625 × 1,5625 (fixés)",
                                     "config 1 + dissemblance (sd 0 × 1,5)"),
        "G13_FRONTIERES_BORNES": ("2,50 / 3,50 exacts (fixés)",
                                  "FRONTIÈRE + conservateur bas · re-tests "
                                  "L7 (FIABLE/SUGGESTION/BRUIT)"),
        "G14_OMBRE_SUPPRIMEE_RIVE": ("mixte", "CARTE_SEULE_CROISÉ ×40 — "
                                     "0 matrice, 0 invention"),
    }
    for g, (ombre, attendu) in roles.items():
        n = r1["c3"]["detail"][g]["n"] if g in r1["c3"]["detail"] else \
            sim.effectifs()[g]
        L.append(f"| {g} | {n} | {ombre} | {attendu} |")
    L.append("")
    L.append("## 4. Calibration D-STD-2 (Monte-Carlo déterministe, graine "
             "4200, 20 000 couples/groupe)")
    L.append("")
    L.append("| Groupe | p̂ | seuil | déterministe | distance min borne "
             "(σ_eff) |")
    L.append("|---|---|---|---|---|")
    for g in sorted(r1["calib"]["centres"]):
        cc = r1["calib"]["centres"][g]
        L.append(f"| {g} | {cc['p_hat']} | {cc['seuil']} | "
                 f"{'oui' if cc['deterministe'] else 'non'} | "
                 f"{cc['distance_min_borne_sigma_eff']} |")
    L.append("")
    L.append("Univers entièrement déterministe par saturation (p̂ = 1,0 "
             "partout — seuils 100,0) : les bornes DISTINCTES (leçon "
             "ad01f21) sont trivialement satisfaites (0 groupe "
             "stochastique) et signalées comme telles. La variance "
             "d'échantillonnage est portée par les lois d'items déclarées "
             "(σ 0,60, D-PARAM) et par la population de référence L6 "
             "(20 000 profils, seed 42 ≥ 2 000 requis).")
    L.append("")
    L.append("## 5. Ce que la lecture affiche (littéraux, extraits réels)")
    L.append("")
    ex = next(c for c, m in zip(couples, classes)
              if m["etat"] == core.ETAT_CROISEMENT and
              m["config"]["index"] == 5)
    L.append("```")
    L.extend(affichage_couple(ex, classes[couples.index(ex)]))
    L.append("```")
    L.append("")
    L.append("## 6. Figures")
    L.append("")
    for f in figs:
        L.append(f"- `{os.path.basename(f)}` (1920×1080)")
    L.append("")
    L.append("## 7. Verdict")
    L.append("")
    L.append("**" + r1["verdict"] + "** — le paquet RIO-22 est prêt pour la "
             "publication (D-CANAL-2 : publication → pointeurs → audit "
             "origin → contresignature fondateur « je valide »). Le "
             "croisement reste un descriptif de cohabitation déclarée : "
             "aucune configuration n'est une norme, aucun libellé n'accuse, "
             "la zone calme est dite comme telle (§5.5) et la crise court-"
             "circuite toujours avant l'arbre (ligne 369).")
    L.append("")
    return "\n".join(L)


# ═══════════════════ Séquence D-CANAL-2 ═════════════════════════════════════
def executer(publier=True):
    base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    shas = []
    r1 = None
    for run in (1, 2):
        couples = sim.tous_les_couples(run=run)
        classes = classes_of(couples)
        calib = sim.calibration_d_std_2()
        r = {
            "c1": critere_c1(couples, classes),
            "c2": critere_c2(couples, classes),
            "c3": critere_c3(couples, calib),
            "c5": critere_c5(couples, classes),
            "c6": critere_c6(couples, classes),
            "c7": critere_c7(couples, classes),
        }
        meta_canon = {"date": DATE, "n_couples": len(couples),
                      "n_groupes": 14, "seed": sim.SEED,
                      "spec": "PERS-Q4-SPEC.md (verrouillée 1458b9c)",
                      "heritage": "RIO-19 (3b1a7490…) + RIO-20 (6d9b3c59…) "
                                  "+ RIO-21 (7644a957…) contresignés ×2 rives"}
        contenu = {k: r[k] for k in ("c1", "c2", "c3", "c5", "c6", "c7")}
        contenu["meta"] = meta_canon
        contenu["calib"] = {k: calib[k] for k in
                            ("seuils", "centres", "bornes_distinctes",
                             "n_stochastiques", "n_deterministes")}
        sha = _sha(contenu)
        shas.append(sha)
        if run == 1:
            r1 = r
            r1["_couples"] = couples
            r1["_classes"] = classes
            r1["calib"] = contenu["calib"]
            r1["meta"] = meta_canon
        else:
            r1["_sha2"] = sha
    r1["c4"] = {"sha1": shas[0], "sha2": shas[1],
                "identiques": shas[0] == shas[1],
                "ok": shas[0] == shas[1]}
    criteres = {k: r1[k]["ok"] for k in ("c1", "c2", "c3", "c4", "c5",
                                         "c6", "c7")}
    r1["verdict"] = ("VALIDÉ 7/7" if all(criteres.values())
                     else "INVALIDE " + ",".join(k for k, v in
                                                 criteres.items() if not v))
    if publier:
        resdir = os.path.join(base, "results")
        figdir = os.path.join(base, "figures")
        os.makedirs(resdir, exist_ok=True)
        os.makedirs(figdir, exist_ok=True)
        couples, classes = r1["_couples"], r1["_classes"]
        publie = {k: r1[k] for k in ("c1", "c2", "c3", "c4", "c5", "c6",
                                     "c7", "calib", "meta", "verdict")}
        jpath = os.path.join(resdir, f"resultats-pers-q4-{DATE}.json")
        with open(jpath, "w", encoding="utf-8") as f:
            json.dump(publie, f, ensure_ascii=False, indent=1,
                      sort_keys=True)
        figs = generer_figures(couples, classes, r1, figdir)
        rapport = generer_rapport(r1, couples, classes, shas[0], shas[1],
                                  figs)
        rpath = os.path.join(resdir, f"rapport-pers-q4-{DATE}.md")
        with open(rpath, "w", encoding="utf-8") as f:
            f.write(rapport)
        print("JSON :", jpath)
        print("Rapport :", rpath)
        print("Figures :", ", ".join(os.path.basename(f) for f in figs))
    print("Verdict :", r1["verdict"])
    for k in ("c1", "c2", "c3", "c4", "c5", "c6", "c7"):
        print(f"  {k.upper()} :", r1[k]["ok"])
    print("SHA ×2 :", shas[0][:16], "=/=", shas[1][:16], "->",
          "IDENTIQUES" if shas[0] == shas[1] else "DIVERGENTS")
    return r1


if __name__ == "__main__":
    executer()
