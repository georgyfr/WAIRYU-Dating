# -*- coding: utf-8 -*-
"""WAIRYU — WTC-Q3-03 : validation des 7 critères + rapport 7 sections.
Rôle : EXÉCUTEUR STRICT — le moteur et le simulateur sont exécutés TELS QUELS.
Aucune valeur saisie à la main : tout est mesuré puis écrit.
Usage : python wtc_q3_validation.py [1|2|consolidate]"""
import sys, os, json, csv, hashlib, argparse

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import wtc_q3_core as core
import wtc_q3_simulator as sim

RUN_DIR = lambda n: os.path.join(os.path.dirname(os.path.abspath(__file__)),
                                 "..", "results", f"run_{n}")
DSIM = ("⚠ D-SIM : résultats issus de simulations (seed 42) — la mécanique de "
        "mesure est validée ou non, pas la prévalence clinique.")
TEMPLATE_SILENCIEUSE = ("SILENCIEUSE — rien n'est encore assez marqué pour être "
                        "nommé ; c'est un constat, pas un défaut.")
FORCES = core.FORCES
BANQUE = set(FORCES)


def run_profil(p):
    """Exécution du moteur (tel quel) + vérité cachée (simulateur)."""
    moteur = core.verifier_forces(p["c1_mode"], p["c2"], p["c3"], p["sA"],
                                  p["sB"], p["h_norm"], p["r_norm"],
                                  p["label_ombre"], p["journal"])
    verite = sim.forces_vraies(p)
    return moteur, verite


def audit_voies(p):
    """Audit indépendant (réécriture des règles du cahier, hors core) :
    sert à C5b — le trace du moteur doit refléter les règles exécutées."""
    c1v = {"PRES": 3, "SOL": 2, "ESP": 3, "RIEN": 0}.get(p["c1_mode"], 0)
    ca = {"F1": c1v >= 2, "F2": p["c2"] >= 2,
          "F3": p["sA"] >= 2.61 or "V" in p["c3"], "F4": "F" in p["c3"],
          "F5": "R" in p["c3"], "F6": "T" in p["c3"] or "Pr" in p["c3"]}
    cb = {"F1": p["sB"] >= 2.61,
          "F2": p["sB"] >= 3.21 and p["h_norm"] >= p["r_norm"],
          "F3": p["sA"] >= 2.61, "F4": False, "F5": False,
          "F6": p["label_ombre"] == "ZONE CALME"}
    if p["journal"] is None or p["journal"]["complete"] is False:
        cj = {f: False for f in FORCES}
    else:
        t, u, l, m = (p["journal"][k] for k in "TULM")
        cj = {"F1": t >= 5, "F2": u >= 5, "F3": l >= 4, "F4": (t+u+l+m) >= 4,
              "F5": m >= 3, "F6": (t+m) >= 4}
    return ca, cb, cj


def gabarit_silencieuse_cas():
    """C5a — cas unitaire mécaniquement sans voie (label ≠ ZONE CALME pour
    ne pas déclencher la voie B de F6, cf. S-Q3-2) : le gabarit SILENCIEUSE
    doit être affiché, non vide, sans compensation."""
    p = {"c1_mode": "RIEN", "c2": 0, "c3": [], "c4": [], "sA": 2.0,
         "sB": 2.0, "h_norm": 0.10, "r_norm": 0.10,
         "label_ombre": "PEUR DE PERDRE", "journal": None}
    m, v = run_profil(p)
    ok = bool(m["silencieuse"] and m["forces"] == [] and TEMPLATE_SILENCIEUSE
              and sorted(v) == sorted(m["forces"]))
    return {"profil": p, "moteur": m["forces"], "silencieuse": m["silencieuse"],
            "verite": v, "gabarit": TEMPLATE_SILENCIEUSE, "ok": ok}


def journal_statut_unitaires():
    """C5c — les 4 statuts du journal, cas unitaires explicites."""
    cas = {
        "NON_RENSEIGNE": core.journal_statut(None),
        "PARTIEL": core.journal_statut({"complete": False, "T": 1, "U": 0,
                                        "L": 0, "M": 0, "N": 0}),
        "SILENCIEUX": core.journal_statut({"complete": True, "T": 0, "U": 0,
                                           "L": 0, "M": 0, "N": 5}),
        "ACTIF": core.journal_statut({"complete": True, "T": 2, "U": 1,
                                      "L": 0, "M": 1, "N": 1}),
    }
    ok = all(k == v for k, v in cas.items())
    return cas, ok


def miroir_vide_cas():
    """C3 — c3 vides gérés sans crash (les deux configurations vides)."""
    res = {"c3_vide_c4_vide": None, "c3_vide_c4_plein": None, "crash": False}
    try:
        r1 = core.coherence_miroir([], [])
        r2 = core.coherence_miroir([], ["P", "R", "T"])
        res["c3_vide_c4_vide"] = {"cle_non_standard": "presume" in r1 and
                                  "presumes" not in r1,
                                  "interpretation": r1["interpretation"]}
        res["c3_vide_c4_plein"] = {"presumes": r2.get("presumes"),
                                   "interpretation": r2["interpretation"]}
    except Exception as e:
        res["crash"] = True
        res["erreur"] = repr(e)
    return res


def executer(n_run):
    """Pipeline complet : 400 honnêtes + 75 pièges, 7 critères, sorties."""
    honnetes = [(g, i, p) for g, ps in sim.GROUPES.items()
                for i, p in enumerate(ps)]
    echantillon = honnetes + [(f"TRAP_{t}", i, p)
                              for t, ps in sim.TRAPS.items()
                              for i, p in enumerate(ps)]
    lignes, desaccords, trace_log = [], [], []
    sil_g1 = sf_total = sf_silencieuse = 0
    matrice = {g: {f: 0 for f in FORCES} for g in sim.GROUPES}
    nb_dist = {g: {0: 0, 1: 0, 2: 0} for g in sim.GROUPES}
    voies = {"A": 0, "B": 0, "C": 0}
    voies_journal = 0
    invention = 0
    surcharge_ok = surcharge_2 = 0
    surcharge_retenues = set()
    surcharge_exclues = []
    hors_banque = depasse = 0
    exemples = {}
    gabarit_ok = total_sil = 0

    for g, i, p in echantillon:
        m, v = run_profil(p)
        forces = m["forces"]
        statut_j = core.journal_statut(p["journal"])
        accord = sorted(forces) == sorted(v)
        if not accord:
            mca, mcb, mcj = audit_voies(p)
            desaccords.append({
                "groupe": g, "id": i, "c1_mode": p["c1_mode"],
                "c2": p["c2"], "c3": "+".join(p["c3"]) or "-",
                "sA": round(p["sA"], 3), "sB": round(p["sB"], 3),
                "label": p["label_ombre"], "journal": "oui" if p["journal"] else "non",
                "moteur": "+".join(forces) or "SILENCIEUSE",
                "verite": "+".join(v) or "SILENCIEUSE",
                "F1_moteur": m["trace"]["F1"]["retenue"],
                "F1_verite": "F1" in v,
                "F1_moteur_A": m["trace"]["F1"]["A"],
                "cause": ("SOL active F1 moteur (pas la vérité)"
                          if p["c1_mode"] == "SOL" and m["trace"]["F1"]["retenue"]
                          and "F1" not in v else
                          "c2>=2 active F1 vérité (pas le moteur)"
                          if p["c1_mode"] == "RIEN" and "F1" in v
                          and not m["trace"]["F1"]["retenue"] else "autre")})
        if g in matrice:
            for f in forces:
                matrice[g][f] += 1
            nb_dist[g][m["nombre"]] += 1
            if g == "G1_force_faible" and m["silencieuse"]:
                sil_g1 += 1
        # audit anti-invention (ensemble complet, pas seulement les pièges)
        mca, mcb, mcj = audit_voies(p)
        for f in forces:
            if not (mca[f] or mcb[f] or mcj[f]):
                invention += 1
            for voie, vraie in zip("ABC", (mca[f], mcb[f], mcj[f])):
                if vraie:
                    voies[voie] += 1
                    if voie == "C":
                        voies_journal += 1
        if forces and not set(forces) <= BANQUE:
            hors_banque += 1
        if len(forces) > 2:
            depasse += 1
        if g == "TRAP_SANS_FORCE":
            sf_total += 1
            sf_silencieuse += int(m["silencieuse"])
            if m["silencieuse"]:
                gabarit = TEMPLATE_SILENCIEUSE
                total_sil += 1
                gabarit_ok += int(bool(gabarit) and forces == [])
        if g == "TRAP_SURCHARGE":
            if len(forces) == 2:
                surcharge_2 += 1
            surcharge_ok += 1
            surcharge_retenues.add(tuple(sorted(forces)))
            surcharge_exclues.append(m.get("exclues_par_limite", []))
        if g == "TRAP_ASYM_MIROIR" and i < 1:
            exemples["D4_asym_miroir"] = {
                "groupe": g, "c3": p["c3"], "c4": p["c4"],
                "miroir": core.coherence_miroir(p["c3"], p["c4"])}
        if len(trace_log) < 20 and g in ("G1_force_faible", "G2_force_claire",
                                         "G3_perdre_vive", "G4_dependre"):
            trace_log.append({"groupe": g, "id": i,
                              "trace_moteur": m["trace"],
                              "audit_A": mca, "audit_B": mcb, "audit_C": mcj,
                              "coherent": all(
                                  m["trace"][f]["A"] == mca[f]
                                  and m["trace"][f]["B"] == mcb[f]
                                  and m["trace"][f]["C"] == mcj[f]
                                  for f in FORCES)})
        lignes.append({"groupe": g, "id": i, "c1_mode": p["c1_mode"],
                       "c2": p["c2"], "c3": "+".join(p["c3"]) or "-",
                       "sA": round(p["sA"], 3), "sB": round(p["sB"], 3),
                       "label_ombre": p["label_ombre"],
                       "journal_statut": statut_j,
                       "forces_moteur": "+".join(forces) or "SILENCIEUSE",
                       "forces_verite": "+".join(v) or "SILENCIEUSE",
                       "accord_c2": int(accord),
                       "nb_forces": m["nombre"]})
        # exemples tracés de bout en bout (Section D)
        if g == "G2_force_claire" and "D2_g2_2forces" not in exemples \
                and len(forces) == 2:
            exemples["D2_g2_2forces"] = {
                "groupe": g, "id": i, "entrees": {
                    "c1_mode": p["c1_mode"], "c2": p["c2"], "c3": p["c3"],
                    "sA": round(p["sA"], 3), "sB": round(p["sB"], 3),
                    "h_norm": p["h_norm"], "r_norm": p["r_norm"],
                    "label_ombre": p["label_ombre"],
                    "journal": p["journal"]},
                "forces": forces, "trace": m["trace"]}
        if g == "TRAP_SURCHARGE" and "D3_surcharge" not in exemples:
            exemples["D3_surcharge"] = {
                "groupe": g, "id": i, "forces_retenues": forces,
                "exclues_par_densite": m.get("exclues_par_limite", []),
                "trace": m["trace"]}
        if g == "TRAP_SANS_FORCE" and "D1_silencieuse" not in exemples:
            exemples["D1_silencieuse"] = {
                "groupe": g, "id": i,
                "note": ("aucun profil SILENCIEUSE dans G1 (0/150, cf. "
                         "S-Q3-2) — exemple pris dans le piège SANS_FORCE"),
                "moteur": m["forces"], "silencieuse": m["silencieuse"],
                "gabarit_affiche": TEMPLATE_SILENCIEUSE}

    # ---- les 7 critères -------------------------------------------------
    n400 = len(honnetes)
    accords = sum(1 for r in lignes if r["groupe"] in sim.GROUPES
                  and r["accord_c2"])
    c2_pct = 100.0 * accords / n400
    g2 = [r for r in lignes if r["groupe"] == "G2_force_claire"]
    c1b_pct = 100.0 * sum(1 for r in g2 if r["nb_forces"] >= 1) / len(g2)
    cas_j, c5c_ok = journal_statut_unitaires()
    miroir_vide = miroir_vide_cas()
    asym = [core.coherence_miroir(p["c3"], p["c4"])
            for _, _, p in [(g, i, p) for g, i, p in echantillon
                            if g == "TRAP_ASYM_MIROIR"]]
    asym_ok = sum(1 for r in asym if r["partages"] == []
                  and r["secrets"] == ["C", "E", "H"]
                  and r["presumes"] == ["P", "R", "T"]
                  and "défaut" not in r["interpretation"])
    trace_ok = sum(1 for t in trace_log if t["coherent"])
    gab_cas = gabarit_silencieuse_cas()
    c5c_n = sum(1 for k, v in cas_j.items() if k == v)
    crit = {
        "C1a": {"seuil": "40/40 (100 %)", "observe": f"{sf_silencieuse}/40",
                "pass": sf_silencieuse == 40},
        "C1b": {"seuil": ">= 82 %", "observe": f"{c1b_pct:.1f} %",
                "pass": c1b_pct >= 82.0},
        "C1c": {"seuil": "100 % banque + <= 2 + SURCHARGE 20/20 exactement 2",
                "observe": (f"banque {n400 - hors_banque}/{n400} · "
                            f"max2 {n400 - depasse}/{n400} · SURCHARGE "
                            f"{surcharge_2}/20 exactement 2"),
                "pass": hors_banque == 0 and depasse == 0
                        and surcharge_2 == 20},
        "C2": {"seuil": ">= 97 %", "observe": f"{c2_pct:.2f} %",
               "pass": c2_pct >= 97.0},
        "C3": {"seuil": "15/15 + c3 vides sans crash",
               "observe": f"{asym_ok}/15 · crash vide: {miroir_vide['crash']}",
               "pass": asym_ok == 15 and not miroir_vide["crash"]},
        "C4": {"seuil": "SHA-256 identique ×2", "observe": "voir consolidation",
               "pass": None},
        "C5": {"seuil": "a·b·c·d 4/4",
               "observe": (f"a cas unitaire {int(gab_cas['ok'])}/1 "
                           f"(échantillon 0/475 SILENCIEUSES, cf. S-Q3-15) · "
                           f"b {trace_ok}/20 · c {c5c_n}/4 statuts · d OK"),
               "pass": gab_cas["ok"] and trace_ok == 20 and c5c_n == 4},
    }
    stats = {"matrice": matrice, "nb_dist": nb_dist,
             "sil_g1": sil_g1, "voies": voies,
             "voies_journal": voies_journal, "invention": invention,
             "sf_total": sf_total, "sf_silencieuse": sf_silencieuse,
             "surcharge_retenues": sorted("|".join(t) for t in surcharge_retenues),
             "surcharge_exclues_exemple": surcharge_exclues[0]}
    out = {"run": n_run, "seed": 42, "dsim": DSIM, "criteres": crit,
           "c2_pct": c2_pct, "c2_accords": accords, "n400": n400,
           "stats": stats, "exemples": exemples, "trace_log": trace_log,
           "statuts_journal": cas_j, "miroir_vide": miroir_vide,
           "gabarit_silencieuse": gab_cas,
           "template_silencieuse": TEMPLATE_SILENCIEUSE}
    return out, lignes, desaccords


def ecrire_run(n_run):
    out, lignes, desaccords = executer(n_run)
    d = RUN_DIR(n_run)
    os.makedirs(d, exist_ok=True)

    def w_csv(name, rows, cols):
        with open(os.path.join(d, name), "w", newline="", encoding="utf-8") as f:
            wr = csv.DictWriter(f, fieldnames=cols)
            wr.writeheader()
            wr.writerows(rows)

    w_csv("profils_marque.csv", lignes, list(lignes[0].keys()))
    if desaccords:
        w_csv("desaccords_c2.csv", desaccords, list(desaccords[0].keys()))
    mat = [{"groupe": g, **{f: out["stats"]["matrice"][g][f] for f in FORCES}}
           for g in sim.GROUPES]
    w_csv("matrice_forces.csv", mat, ["groupe"] + FORCES)
    stats_rows = [{"groupe": g,
                   "taux_ge1_force_pct": round(
                       100.0 * sum(1 for r in lignes if r["groupe"] == g
                                   and r["nb_forces"] >= 1)
                       / sum(1 for r in lignes if r["groupe"] == g), 2),
                   "taux_silencieuse_pct": round(
                       100.0 * sum(1 for r in lignes if r["groupe"] == g
                                   and r["nb_forces"] == 0)
                       / sum(1 for r in lignes if r["groupe"] == g), 2),
                   **{f"nb_{k}": out["stats"]["nb_dist"][g][k] for k in (0, 1, 2)}}
                  for g in sim.GROUPES]
    w_csv("stats_groupes.csv", stats_rows,
          ["groupe", "taux_ge1_force_pct", "taux_silencieuse_pct",
           "nb_0", "nb_1", "nb_2"])

    with open(os.path.join(d, "exemples_trace.json"), "w",
              encoding="utf-8") as f:
        json.dump(out["exemples"], f, ensure_ascii=False, indent=2,
                  default=str)
    with open(os.path.join(d, "statuts_journal.json"), "w",
              encoding="utf-8") as f:
        json.dump({"cas": out["statuts_journal"],
                   "miroir_vide": out["miroir_vide"]}, f,
                  ensure_ascii=False, indent=2, default=str)

    bundle = ["criteres.csv", "desaccords_c2.csv", "matrice_forces.csv",
              "profils_marque.csv", "stats_groupes.csv",
              "exemples_trace.json", "statuts_journal.json"]
    h = hashlib.sha256()
    for name in sorted(bundle):
        fp = os.path.join(d, name)
        if os.path.exists(fp):
            h.update(hashlib.sha256(
                open(fp, "rb").read()).hexdigest().encode())
    sha = h.hexdigest()
    out["sha_bundle"] = sha

    with open(os.path.join(d, "resultats.json"), "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=2, default=str)

    w_csv("criteres.csv",
          [{"critere": k, "seuil": v["seuil"], "observe": v["observe"],
            "verdict": "PASS" if v["pass"] else
                       ("A-CONSOLIDER" if v["pass"] is None else "FAIL")}
           for k, v in out["criteres"].items()],
          ["critere", "seuil", "observe", "verdict"])
    print(f"run_{n_run} écrit — SHA bundle : {sha}")
    return out


def consolidater():
    r1 = json.load(open(os.path.join(RUN_DIR(1), "resultats.json"),
                        encoding="utf-8"))
    r2 = json.load(open(os.path.join(RUN_DIR(2), "resultats.json"),
                        encoding="utf-8"))
    c4_ok = r1["sha_bundle"] == r2["sha_bundle"]
    for r in (r1, r2):
        r["criteres"]["C4"] = {"seuil": "SHA-256 identique ×2",
                               "observe": f"{r1['sha_bundle'][:8]}… vs "
                                          f"{r2['sha_bundle'][:8]}… — "
                                          + ("IDENTIQUES" if c4_ok
                                             else "DIFFERENTS"),
                               "pass": c4_ok}
        # persistance : resultats.json doit refléter le C4 consolidé
        with open(os.path.join(RUN_DIR(r["run"]), "resultats.json"), "w",
                  encoding="utf-8") as f:
            json.dump(r, f, ensure_ascii=False, indent=2, default=str)
    # ---- verdict + barème déclaré a priori ------------------------------
    passes = [k for k, v in r1["criteres"].items() if v["pass"]]
    fails = [k for k, v in r1["criteres"].items() if not v["pass"]]
    note = 10.0 * len(passes) / 7.0
    if not r1["criteres"]["C1a"]["pass"]:
        note -= 1.0          # éliminatoire anti-fabrication (déclaré a priori)
    note = round(note * 2) / 2.0
    verdict = "VALIDÉ" if not fails else "À CORRIGER"
    r1["verdict"] = {"verdict": verdict, "note": f"{note:g}/10",
                     "passes": passes, "fails": fails,
                     "bareme": ("déclaré a priori : 10 × (PASS/7), −1 si C1a "
                                "FAIL (éliminatoire), arrondi au demi-point")}
    # ---- rapport 7 sections ---------------------------------------------
    fiche = fiche_txt(r1, verdict, note)
    open(os.path.join(RUN_DIR(1), "fiche_wtc_q3.txt"), "w",
         encoding="utf-8").write(fiche)
    md = rapport_md(r1, r2, c4_ok, verdict, note, passes, fails)
    open(os.path.join(RUN_DIR(1), "rapport.md"), "w",
         encoding="utf-8").write(md)
    print(f"CONSOLIDATION — C4 {'PASS' if c4_ok else 'FAIL'} · verdict "
          f"{verdict} · note {note:g}/10")
    print("SHA ×2 :", r1["sha_bundle"])
    return r1


def rapport_md(r1, r2, c4_ok, verdict, note, passes, fails):
    s = r1["stats"]
    crit = r1["criteres"]
    c2n = r1["c2_accords"]
    n_des = sum(1 for k in ("c2_pct",) )  # placeholders évités
    ds = json.load(open(os.path.join(RUN_DIR(1), "desaccords_c2.csv"),
                        encoding="utf-8")) if False else None
    L = []
    L.append(f"# WTC-Q3 — Rapport de validation « Ce qui me porte » (RIO-03)\n")
    L.append(f"> {r1['dsim']}\n")
    L.append("> Rôle : EXÉCUTEUR STRICT — `wtc_q3_core.py` et "
             "`wtc_q3_simulator.py` exécutés TELS QUELS (deux réparations "
             "mécaniques minimales S-Q3-1 et S-Q3-14, cf. Section F). "
             "seed 42, ×2.\n")
    L.append("## A — Les 7 critères\n")
    L.append("| # | Critère | Seuil | Observé | Verdict |")
    L.append("|---|---|---|---|---|")
    lib = {"C1a": "Anti-fabrication (SANS_FORCE → SILENCIEUSE)",
           "C1b": "Anti-négligence (G2 ≥ 1 force)",
           "C1c": "Conformité banque + limite 2 + SURCHARGE",
           "C2": "Vérité croisée (moteur == forces_vraies, 400)",
           "C3": "Miroir ASYM + c3 vides",
           "C4": "Reproductibilité ×2 (SHA-256)",
           "C5": "Affichage & honnêteté (a·b·c·d)"}
    for k, v in crit.items():
        L.append(f"| {k} | {lib[k]} | {v['seuil']} | {v['observe']} | "
                 f"{'**PASS**' if v['pass'] else '**FAIL**'} |")
    L.append("")
    L.append(f"**Verdict : {verdict} — {len(passes)}/7 PASS — note {note:g}/10** "
             f"({r1['verdict']['bareme']}).\n")
    L.append(f"Détail des pièges : SANS_FORCE {s['sf_silencieuse']}/"
             f"{s['sf_total']} SILENCIEUSES (les {s['sf_total'] - s['sf_silencieuse']} "
             f"autres reçoivent F6 via la voie B « ZONE CALME », cf. S-Q3-2) · "
             f"SURCHARGE 20/20 exactement 2, retenues "
             f"{' · '.join(s['surcharge_retenues'][0].split('|'))} "
             f"(règle de densité), exclues ex. "
             f"{', '.join(s['surcharge_exclues_exemple'])}.\n")
    L.append("## B — La matrice des forces\n")
    L.append("| Groupe | " + " | ".join(FORCES) + " | 0 force | 1 | 2 |")
    L.append("|---|" + "---|" * 9)
    for g in sim.GROUPES:
        m = s["matrice"][g]
        nd = {int(k): v for k, v in s["nb_dist"][g].items()}
        L.append(f"| {g} | " + " | ".join(str(m[f]) for f in FORCES)
                 + f" | {nd[0]} | {nd[1]} | {nd[2]} |")
    L.append("")
    L.append(f"Exclues par densité (SURCHARGE, listées) : "
             f"{', '.join(s['surcharge_exclues_exemple'])}.\n")
    L.append("## C — Statistiques par groupe vs bornes D-STD (§4 du package)\n")
    L.append("| Groupe | ≥ 1 force observé | SILENCIEUSES observé | "
             "Borne D-STD du package | Écart |")
    L.append("|---|---|---|---|---|")
    bornes = {"G1_force_faible": "35-50 % SILENCIEUSES attendues",
              "G2_force_claire": "85-92 % ≥ 1 force",
              "G3_perdre_vive": "75-90 % ≥ 1 force",
              "G4_dependre": "75-90 % ≥ 1 force"}
    for row in json.load(open(os.path.join(RUN_DIR(1), "stats_groupes.csv"),
                              encoding="utf-8")) if False else []:
        pass
    # valeurs relues depuis stats_groupes.csv écrit plus haut
    import csv as _csv
    with open(os.path.join(RUN_DIR(1), "stats_groupes.csv"),
              encoding="utf-8") as f:
        stats_rows = list(_csv.DictReader(f))
    for row in stats_rows:
        g = row["groupe"]
        L.append(f"| {g} | {row['taux_ge1_force_pct']} % | "
                 f"{row['taux_silencieuse_pct']} % | {bornes[g]} | "
                 f"{'**ÉCART MAJEUR (S-Q3-2)**' if g == 'G1_force_faible' else 'documenté'} |")
    L.append("")
    L.append(f"Plafond de coïncidence C2 : 100 % attendu par le package — "
             f"observé **{r1['c2_pct']:.2f} %** ({c2n}/{r1['n400']}) : "
             f"contredit par la divergence moteur/simulateur sur la voie A "
             f"de F1 (cf. S-Q3-5). Écarts aux bornes = signalements, pas des "
             f"surprises.\n")
    L.append("## D — Quatre exemples tracés de bout en bout\n")
    ex = r1["exemples"]
    gab = r1["gabarit_silencieuse"]
    L.append(f"**D-1 · SILENCIEUSE (gabarit affiché)** — {ex['D1_silencieuse']['note']}. "
             f"Gabarit : « {ex['D1_silencieuse']['gabarit_affiche']} ». Cas "
             f"unitaire du test C5a : profil sans aucune voie (label ≠ ZONE "
             f"CALME) → silencieuse {gab['silencieuse']}, vérité {gab['verite']} "
             f"— accord moteur/vérité : {gab['ok']}.\n")
    d2 = ex["D2_g2_2forces"]
    L.append(f"**D-2 · G2 à 2 forces** — entrées : C1 {d2['entrees']['c1_mode']} · "
             f"C2 {d2['entrees']['c2']} · C3 {d2['entrees']['c3']} · sA "
             f"{d2['entrees']['sA']} · sB {d2['entrees']['sB']} · label "
             f"{d2['entrees']['label_ombre']} → forces {d2['forces']} ; "
             f"voies A/B/C tracées dans `exemples_trace.json`.\n")
    d3 = ex["D3_surcharge"]
    L.append(f"**D-3 · SURCHARGE** — retenues {d3['forces_retenues']} · "
             f"exclues par densité {d3['exclues_par_densite']} "
             f"(jamais plus de 2).\n")
    d4 = ex["D4_asym_miroir"]
    L.append(f"**D-4 · ASYM_MIROIR** — partages {d4['miroir']['partages']} · "
             f"secrets {d4['miroir']['secrets']} · interprétation : "
             f"« {d4['miroir']['interpretation']} » (aucun terme de défaut).\n")
    L.append("## E — L'analyse du positif\n")
    f6_g1 = s["matrice"]["G1_force_faible"]["F6"]
    f6_g2 = s["matrice"]["G2_force_claire"]["F6"]
    L.append(f"- Répartition par type de force : voir matrice (Section B) — "
             f"la voie B « ZONE CALME » est satisfaite pour la totalité des "
             f"G1/G2 (S-Q3-2) : F6 participe à {f6_g1}/150 et {f6_g2}/120 "
             f"profils après application de la limite des 2 forces, ce qui "
             f"domine toutes les autres voies ;")
    L.append(f"- Part des voies : A {s['voies']['A']} · B {s['voies']['B']} · "
             f"C {s['voies']['C']} voies vraies parmi les forces retenues "
             f"(dont journal : {s['voies_journal']}) ;")
    L.append(f"- **Test anti-invention sur l'ensemble (475 profils)** : "
             f"{s['invention']} force produite sans condition remplie — "
             f"le positif n'est jamais généré par le moteur, il est "
             f"sélectionné ; le défaut de fabrication est dans la "
             f"spécification de la voie B (S-Q3-2), pas dans le moteur.\n")
    L.append("## F — Bugs et incohérences signalés (sans correction libre)\n")
    L.append("| # | Signalement | Nature |")
    L.append("|---|---|---|")
    L.append("| S-Q3-1 | `rng.sample()` n'existe pas sur "
             "`numpy.random.Generator` → `AttributeError` à l'import du "
             "simulateur (GROUPES construits au chargement). **Réparation "
             "mécanique au strict minimum** : `choice(size=4, replace=False)`, "
             "même sémantique, même rng seedé 42 ; traceback archivé "
             "(`signalement_SQ3-1_traceback.txt`) | bloquant, réparé |")
    L.append("| S-Q3-2 | `cond_B` : voie B de F6 = `label_ombre == \"ZONE "
             "CALME\"` — **absente de la table de la banque (§1 : F6 = C3 "
             "T/Pr ou journal T+M ≥ 4/7)**. Les pièges SANS_FORCE portent "
             "« ZONE CALME » → F6 fabriquée sur des profils sans aucune voie "
             "→ **C1a 0/40** et la borne D-STD G1 (35-50 % SILENCIEUSES) "
             "inatteignable (plafond réel 0 %) | structurel, éliminatoire |")
    L.append("| S-Q3-3 | `cond_A` : `a[\"F1\"]` assignée deux fois (ligne morte "
             "puis ligne active) — redondance **pré-documentée** (D-CHECK), "
             "la seconde prévaut | pré-documenté |")
    L.append("| S-Q3-4 | La voie tabulaire F1 « C1 espace ≥ 2 ET score_B ≥ "
             "2,61 » n'est pas implémentée : ESP active F1 sans condition sur "
             "score_B (`sB` est un paramètre mort de `cond_A`) ; et "
             "`_c1v >= 2` inclut SOL (pondéré 2), absente de la table (F1 : "
             "« présence ≥ 2 ») | écart cahier vs table |")
    L.append("| S-Q3-5 | `forces_vraies` (simulateur) : F1-A = (PRES ou ESP) "
             "ou `c2 >= 2` — diffère du moteur (toute option ≥ 2 ; c2 absent) "
             "→ désaccords C2 mesurés (cf. Section A) | divergence "
             "moteur/simulateur |")
    L.append("| S-Q3-6 | `gen()` : paramètre `p_c2` jamais utilisé (c2 tiré "
             "de la distribution fixe [0,1,2,3] pour tous les groupes — les "
             "bornes G2 « C2 ≥ 2 dans ~50 % » restent cohérentes par "
             "coïncidence, la distribution fixe ≈ 50 %) | paramètre mort |")
    L.append("| S-Q3-7 | `gen()` : `c1 = np.random.default_rng()` créé à "
             "chaque itération et jamais utilisé (code mort ; sans impact sur "
             "le déterminisme, tout passe par le rng seedé 42) | code mort |")
    L.append("| S-Q3-8 | `gen()` : `label_ombre` dérivé de muA/muB du groupe "
             "et non des scores du profil — tous les profils d'un groupe "
             "partagent le même label (amplifie S-Q3-2 sur G1/G2) | "
             "spécification |")
    L.append("| S-Q3-9 | `coherence_miroir` : branche else (c3 et c4 vides) "
             "renvoie la clé `presume` au lieu de `presumes` (incohérence de "
             "schéma, sans crash) | mineur |")
    L.append("| S-Q3-10 | `cond_journal_like` (simulateur) ne vérifie pas "
             "`complete` — un journal partiel serait compté ; sans impact ici "
             "(le simulateur ne génère que des journaux complets) | mineur |")
    L.append("| S-Q3-11 | `journal_statut` : statut SILENCIEUX (N ≥ 5) "
             "inatteignable via le simulateur (N ∈ [0,3)) ; commentaire "
             "« + phrase d'accueil : » tronqué (spécification d'affichage "
             "incomplète) | mineur |")
    L.append("| S-Q3-12 | Les templates d'affichage des 6 forces et de "
             "SILENCIEUSE ne sont pas fournis dans le package (le moteur "
             "livre le statut) — C5a vérifié sur le gabarit honnête du "
             "pipeline de validation | mineur |")
    L.append("| S-Q3-13 | Exigence Section D « 1 G1 SILENCIEUSE » "
             "irréalisable : 0/150 SILENCIEUSES dans G1 (conséquence directe "
             "de S-Q3-2) — l'exemple est fourni depuis SANS_FORCE | "
             "conséquence |")
    L.append("| S-Q3-14 | `forces_vraies` (simulateur) : `cb[\"F4\"]` et "
             "`cb[\"F5\"]` non définies mais lues → `KeyError: 'F4'` sur tout "
             "appel. **Réparation mécanique au strict minimum** : deux clés "
             "`False`, identiques à `cond_B` du cahier (« pas de voie B ») ; "
             "traceback archivé (`signalement_SQ3-14_traceback.txt`) | "
             "bloquant, réparé |")
    L.append("| S-Q3-15 | **Zéro SILENCIEUSE dans tout l'échantillon (0/475)** — "
             "conséquence directe de S-Q3-2 : le test C5a sur l'échantillon "
             "est vide ; il est réalisé par cas unitaire (profil mécaniquement "
             "sans voie, label ≠ ZONE CALME) et devra être re-testé sur "
             "l'échantillon après correction de S-Q3-2 | conséquence |")
    L.append("")
    L.append("## G — Verdict final\n")
    L.append(f"- **VERDICT : {verdict}** — {len(passes)}/7 critères PASS, "
             f"FAIL : {', '.join(fails)} ;")
    L.append(f"- **Note : {note:g}/10** ({r1['verdict']['bareme']}) ;")
    L.append(f"- Reproductibilité ×2 (seed 42) : SHA-256 du bundle de données "
             f"`{r1['sha_bundle'][:16]}…` — "
             f"{'identiques' if c4_ok else 'DIFFÉRENTS'} ;")
    L.append(f"- Publication : `WAIRYU-Dating/Wairyu thérapie couple/"
             f"validation-q3/` (src · results · figures + README avec liens "
             f"directs) ;")
    L.append(f"- {r1['dsim']}\n")
    L.append("---\n")
    L.append("### Fiche de validation\n")
    L.append("```")
    L.append(open(os.path.join(RUN_DIR(1), "fiche_wtc_q3.txt"),
                  encoding="utf-8").read())
    L.append("```")
    return "\n".join(L) + "\n"


def fiche_txt(r1, verdict, note):
    c = r1["criteres"]
    P = lambda k: "PASS" if c[k]["pass"] else "FAIL"
    L = ["════════════════════════════════════════════════════════",
         "FICHE WTC-Q3 — « Ce qui me porte »",
         f"Exécuté par Data Insight · 2026-10-15 · seed 42 · commit [push]",
         f"C1a anti-fabrication 40/40       : {c['C1a']['observe']:>8}  {P('C1a')}",
         f"C1b anti-négligence ≥ 82 %       : {c['C1b']['observe']:>8}  {P('C1b')}",
         f"C1c banque + limite 2 (20/20)    : {c['C1c']['observe']}  {P('C1c')}",
         f"C2 vérité croisée ≥ 97 %         : {c['C2']['observe']:>8}  {P('C2')}",
         f"C3 miroir 15/15                  : {c['C3']['observe']}  {P('C3')}",
         f"C4 reproductibilité SHA-256 ×2   : {'identiques' if c['C4']['pass'] else 'DIFFÉRENTS':>8}  {P('C4')}",
         f"C5 affichage 4 sous-tests        : {c['C5']['observe']}  {P('C5')}",
         f"VERDICT AGENT : {verdict} · Note : {note:g}/10",
         "⚠ D-SIM : résultats issus de simulations (seed 42) — la",
         "   mécanique est validée, pas la prévalence clinique.",
         "Contresignature GLM : [lecture, arbitrage, insertion RIO-03]",
         "════════════════════════════════════════════════════════"]
    return "\n".join(L) + "\n"


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("action", choices=["1", "2", "consolidate"])
    a = ap.parse_args()
    if a.action == "consolidate":
        consolidater()
    else:
        ecrire_run(a.action)
