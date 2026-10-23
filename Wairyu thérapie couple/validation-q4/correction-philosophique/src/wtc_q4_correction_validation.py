# -*- coding: utf-8 -*-
"""
WTC-Q4 — VALIDATION DE LA COUCHE DE CORRECTION PHILOSOPHIQUE (RIO-04)
======================================================================
Exécute les 5 stages de preuve sur les VRAIS moteurs (zéro réimplémentation) :

  Stage 0 — Compactations PROUVÉES : écart/boucle déterministes par paire de
            types (16/16, dist min au seuil 30 consignée) · frontière 2,61
            jamais PILE sur l'ensemble atteignable · face ≡ type (7 056 paires
            de scores atteignables × 3 empreintes → pas constant par
            (type, empreinte) 12/12) · espions clés parasites · empreinte
            normalisée (6 variantes → 3 classes) · table indépendante ≡ VRAI
            _CONFIG_TABLE (16/16).
  Stage 1 — Énumération EXHAUSTIVE de l'espace des états distincts de la
            couche : 4 types p1 × 4 types p2 × 2 classes de styles (L6) ×
            3 empreintes p1 × 3 empreintes p2 × 22 jeux de forces p1 × 22
            jeux de forces p2 = 139 392 configurations, chacune atteignable
            par de vraies réponses corrigées. Toute la sortie de la couche
            (palier, S1/S2, textes, fragments, pas) est calculée par les
            fonctions réelles et vérifiée configuration par configuration.
            Complétude L6 : les 9 paires de styles × 16 paires de types
            (144 cellules) retombent toutes sur les types corrigés énumérés.
  Stage 2 — Re-score BIT-EXACT des 800 paires archivées du pipeline P1
            (simulateur seed 42 RE-EXÉCUTÉ FRAIS à chaque passage — D-REPRO),
            agrégats comparés au JSON archivé du 15/10 (resume_configs,
            config_obtenues_count, C1 par config, C2, boucles, C3, C5) — le
            FAIL strict C1 7/9 du package P1 est CONSERVÉ consigné (géométrie
            du style L6, zéro retouche au moteur).
  Stage 4 — Couplage pas : 12/12 (type × empreinte) par partenaire résolus
            par le VRAI selectionner_pas ; suivi 15/15 sans sanction ;
            re-test 8 semaines par le VRAI programmer_re_test_q1 (jamais
            forcé).
  COR8    — Reproductibilité : pipeline exécuté 2 fois, SHA-256 identiques.

Sorties : results/correction_criteres.json · results/rapport-correction-RIO-04.md
"""

from __future__ import annotations

import hashlib
import importlib.util
import itertools
import json
import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import wtc_q4_correction as corr          # la couche (charge les vrais moteurs)
core_q4 = corr.core_q4
core_q5 = corr.core_q5

# Le simulateur P1 fait `import wtc_q4_core` — le vrai core est déjà dans
# sys.modules (chargé par la couche) ; on ajoute aussi le chemin src :
_SRC_Q4 = str(corr._WTC / "validation-q4" / "src")
if _SRC_Q4 not in sys.path:
    sys.path.insert(0, _SRC_Q4)

RES = Path(__file__).resolve().parents[1] / "results"
SMOKE = os.environ.get("CORR_SMOKE") == "1"   # échantillon réduit (test rapide)

TYPES = core_q4.TYPES_ATTACH
EMPREINTES_LABELS = corr.LABELS_OMBRE
_FORCES_BANK = ["F1", "F2", "F3", "F4", "F5", "F6"]
if SMOKE:
    FORCE_SETS = [ [], ["F1"], ["F1", "F2"], ["F3"], ["F6"], ["F2", "F4"] ]
else:
    FORCE_SETS = [list(c) for k in (0, 1, 2)
                  for c in itertools.combinations(_FORCES_BANK, k)]  # 22
STYLE_PAIRS_CHECK = [("HAUT", "HAUT"), ("HAUT", "BAS"), ("HAUT", "MOYEN"),
                     ("BAS", "HAUT"), ("BAS", "BAS"), ("BAS", "MOYEN"),
                     ("MOYEN", "HAUT"), ("MOYEN", "BAS"), ("MOYEN", "MOYEN")]

_SHIFT = {"HAUT": -0.5, "BAS": 0.5, "MOYEN": 0.0}


def _prof(type_att: str, style: str, label: str, forces: list) -> dict:
    """Profil brut dont les scores corrigés L6 tombent pile sur les
    représentatifs du type (raw = corrigé − shift)."""
    sA, sB = corr.SCORES_REPRESENTATIFS[type_att]
    sh = _SHIFT[style]
    return {"sA": round(sA - sh, 4), "sB": round(sB - sh, 4), "style": style,
            "label_ombre": label, "forces": list(forces)}


def _sim_frais(pass_id: int):
    """D-REPRO — le VRAI simulateur P1 re-exécuté FRAIS (rng seed 42
    reconstruit à chaque chargement, jamais partagé entre passages)."""
    nom = f"wtc_q4_simulator_rio04_pass{pass_id}"
    chemin = corr._WTC / "validation-q4" / "src" / "wtc_q4_simulator.py"
    spec = importlib.util.spec_from_file_location(nom, chemin)
    mod = importlib.util.module_from_spec(spec)
    sys.modules[nom] = mod
    spec.loader.exec_module(mod)
    return mod


# ─────────────────────────────────────────────────────────────────────────────
# STAGE 0 — COMPACTATIONS PROUVÉES
# ─────────────────────────────────────────────────────────────────────────────
def stage0() -> dict:
    st = {}
    # (a) écart/boucle déterministes par paire de types — 16/16
    ecarts = {}
    for t1 in TYPES:
        for t2 in TYPES:
            pct1 = core_q4.NORMES_PERCENTILES[t1]
            pct2 = core_q4.NORMES_PERCENTILES[t2]
            b = core_q4.boucle_poursuite_retrait(pct1, pct2)
            ecarts[(t1, t2)] = (b["ecart"], b["boucle_probable"])
    valeurs = sorted({e for e, _ in ecarts.values()})
    st["ecart_valeurs"] = valeurs
    st["ecart_coherent"] = sum(1 for e, bl in ecarts.values()
                               if bl == (e >= 30))
    st["ecart_total"] = len(ecarts)
    st["pile_30"] = sum(1 for e, _ in ecarts.values() if e == 30)
    st["dist_min_30"] = min(abs(e - 30) for e, _ in ecarts.values())
    # (b) frontière 2,61 — jamais PILE sur l'ensemble atteignable
    atteignables = sorted({round(k / 9 + d, 6) for k in range(9, 37)
                           for d in (-0.5, 0.0, 0.5)})
    st["scores_atteignables"] = len(atteignables)
    st["pile_261"] = sum(1 for s in atteignables if abs(s - 2.61) < 1e-12)
    st["dist_min_261"] = round(min(abs(s - 2.61) for s in atteignables), 6)
    # (c) face ≡ type → pas ≡ (type, empreinte) sur la grille atteignable
    face_par_type = {t: set() for t in TYPES}
    pas_par_type = {}          # (type, empreinte) -> set de pas
    grid = atteignables
    for sA in grid:
        for sB in grid:
            t = core_q4.type_attachement(sA, sB)
            face = core_q5.face_dominante(sA, sB)
            face_par_type[t].add(face)
            for lab in EMPREINTES_LABELS:
                emp = core_q5.empreinte(lab)
                p = core_q5.selectionner_pas(sA, sB, lab)["pas"]
                pas_par_type.setdefault((t, emp), set()).add(p)
    st["face_valeurs_par_type"] = {t: sorted(v) for t, v in face_par_type.items()}
    st["face_ecarts"] = sum(1 for v in face_par_type.values() if len(v) != 1)
    st["pas_combinaisons"] = len(pas_par_type)
    st["pas_ecarts"] = sum(1 for v in pas_par_type.values() if len(v) != 1)
    # (d) espions — clés parasites ignorées par la couche ET le pas
    espion_ok = 0
    espion_total = 0
    for t1 in TYPES:
        for t2 in TYPES:
            espion_total += 1
            p1 = _prof(t1, "MOYEN", EMPREINTES_LABELS[0], ["F1"])
            p2 = _prof(t2, "MOYEN", EMPREINTES_LABELS[1], ["F2", "F3"])
            l1 = corr.lecture_croisement(p1, p2)
            b1 = corr.bloc_ecran(l1, p1["label_ombre"], p2["label_ombre"],
                                 p1["forces"], p2["forces"])
            f1 = corr.bilan_fragment(l1, p1["label_ombre"], p2["label_ombre"],
                                     p1["forces"], p2["forces"])
            p1x = {**p1, "h_norm": 0.9, "r_norm": 0.9, "jours": 14,
                   "date": "2026-01-01", "score_A": 99, "cle_fantome": "x"}
            p2x = {**p2, "h_norm": 0.1, "r_norm": 0.1, "jours": 0,
                   "date": "2027-12-31", "score_A": -5, "cle_fantome": "y"}
            l2 = corr.lecture_croisement(p1x, p2x)
            b2 = corr.bloc_ecran(l2, p1x["label_ombre"], p2x["label_ombre"],
                                 p1x["forces"], p2x["forces"])
            f2 = corr.bilan_fragment(l2, p1x["label_ombre"], p2x["label_ombre"],
                                     p1x["forces"], p2x["forces"])
            pas_avant = corr.pas_du_couple(t1, p1["label_ombre"], t2, p2["label_ombre"])
            pas_apres = corr.pas_du_couple(t1, p1x["label_ombre"], t2, p2x["label_ombre"])
            if (b1["md5"] == b2["md5"] and l1["palier"] == l2["palier"]
                    and json.dumps(f1, sort_keys=True, ensure_ascii=False)
                    == json.dumps(f2, sort_keys=True, ensure_ascii=False)
                    and pas_avant == pas_apres):
                espion_ok += 1
    st["espion_cles"] = espion_total
    st["espion_ecarts"] = espion_total - espion_ok
    # (e) empreinte normalisée — 6 variantes d'écriture → 3 classes
    variantes = ["zone calme", "ZONE CALME", "Peur de perdre",
                 "PEUR DE PERDRE", "peur d'être étouffée", "PEUR D'ÊTRE ÉTOUFFÉE"]
    classes = sorted({core_q5.empreinte(v) for v in variantes})
    st["empreinte_variantes"] = len(variantes)
    st["empreinte_classes"] = classes
    # (f) table indépendante ≡ VRAI _CONFIG_TABLE — 16/16
    table_ok = 0
    for t1 in TYPES:
        for t2 in TYPES:
            if corr.palier_independant(t1, t2)["config"] == \
                    core_q4.identifier_configuration(t1, t2):
                table_ok += 1
    st["table_16"] = table_ok
    # (g) complétude L6 — 16 paires de types × 9 paires de styles
    l6_total, l6_ok, l6_avert_ok = 0, 0, 0
    for t1 in TYPES:
        for t2 in TYPES:
            for s1, s2 in STYLE_PAIRS_CHECK:
                l6_total += 1
                p1 = _prof(t1, s1, EMPREINTES_LABELS[0], ["F1"])
                p2 = _prof(t2, s2, EMPREINTES_LABELS[1], ["F2"])
                lect = corr.lecture_croisement(p1, p2)
                if lect["type_p1"] == t1 and lect["type_p2"] == t2:
                    l6_ok += 1
                if lect["avert_style"] == core_q4.styles_dissimulables(s1, s2):
                    l6_avert_ok += 1
    st["l6_cellules"] = l6_total
    st["l6_ecarts"] = l6_total - l6_ok
    st["l6_avert_ecarts"] = l6_total - l6_avert_ok
    return st


# ─────────────────────────────────────────────────────────────────────────────
# STAGE 1 — ÉNUMÉRATION EXHAUSTIVE (139 392 configurations)
# ─────────────────────────────────────────────────────────────────────────────
def stage1() -> dict:
    stats = {
        "configs": 0, "fragment_complet": 0, "cor2_ecarts": 0,
        "paliers": {"🟢": 0, "🟠": 0, "🔴": 0},
        "S1": 0, "S2": 0,
        "causes": {"boucle": 0, "feu": 0, "silence": 0},
        "configs_par_palier": {"🟢": set(), "🟠": set(), "🔴": set()},
        "md5_texts": set(), "mots_interdits_max": 0, "dsim_manquants": 0,
        "calme_abus": 0, "calme_manques": 0, "direction_affichee": 0,
        "pct_non_null": 0, "phrase_boucle_tu": 0,
        "avert_presents": 0, "avert_attendus": 0,
        "pas_hors_banque": 0, "junction_incoherente": 0,
    }
    configs_avec_calme = 0
    for t1 in TYPES:
        for t2 in TYPES:
            for avert in (False, True):
                s1, s2 = ("HAUT", "BAS") if avert else ("MOYEN", "MOYEN")
                for i1, lab1 in enumerate(EMPREINTES_LABELS):
                    for i2, lab2 in enumerate(EMPREINTES_LABELS):
                        for f1 in FORCE_SETS:
                            for f2 in FORCE_SETS:
                                stats["configs"] += 1
                                p1 = _prof(t1, s1, lab1, f1)
                                p2 = _prof(t2, s2, lab2, f2)
                                lect = corr.lecture_croisement(p1, p2)
                                pal = lect["palier"]
                                # COR2 — chemin indépendant (table + règle ré-encodées)
                                pi = corr.palier_independant(t1, t2)
                                if (pi["config"] != lect["config"]
                                        or pi["boucle"] != lect["boucle_probable"]
                                        or pi["palier"] != pal["palier"]
                                        or pi["S1"] != pal["S1"]
                                        or pi["S2"] != pal["S2"]):
                                    stats["cor2_ecarts"] += 1
                                # junction R2/R3 : S1 ⇔ 🔴 / S2 ⇔ 🟠
                                if pal["S1"] != (pal["palier"] == "🔴") or \
                                   pal["S2"] != (pal["palier"] == "🟠"):
                                    stats["junction_incoherente"] += 1
                                # bloc écran (R4-R8)
                                bloc = corr.bloc_ecran(lect, lab1, lab2, f1, f2)
                                t = bloc["texte"]
                                if bloc["nb_mots_interdits"] > stats["mots_interdits_max"]:
                                    stats["mots_interdits_max"] = bloc["nb_mots_interdits"]
                                if corr.BANDEAU_DSIM not in t:
                                    stats["dsim_manquants"] += 1
                                stats["md5_texts"].add(bloc["md5"])
                                calme = bloc["calme_present"]
                                if lect["config"] == corr.CONFIG_CALME:
                                    configs_avec_calme += 1
                                    if calme:
                                        stats["calme_abus"] += 0  # légitime
                                else:
                                    if calme:
                                        stats["calme_abus"] += 1
                                if lect["config"] == corr.CONFIG_CALME and not calme:
                                    stats["calme_manques"] += 1
                                if bloc["direction_affichee"]:
                                    stats["direction_affichee"] += 1
                                if bloc["pct_compatibilite"] is not None:
                                    stats["pct_non_null"] += 1
                                if lect["boucle_probable"]:
                                    bp = core_q4.rendre_affichage(
                                        lect["config"], lect["boucle_dict"],
                                        lect["avert_style"], lab1, lab2, f1, f2
                                    )["boucle_nommee_ensemble"] or ""
                                    if "tu " in bp.lower() or "ton " in bp.lower():
                                        stats["phrase_boucle_tu"] += 1
                                if bloc["avert_present"]:
                                    stats["avert_presents"] += 1
                                if avert:
                                    stats["avert_attendus"] += 1
                                # F4 — fragment + pas de chacun
                                frag = corr.bilan_fragment(lect, lab1, lab2, f1, f2)
                                if frag["_complet"]:
                                    stats["fragment_complet"] += 1
                                if frag["bloc_7_palier_pas"]["pas_p1"] not in core_q5.PAS_BANQUE or \
                                   frag["bloc_7_palier_pas"]["pas_p2"] not in core_q5.PAS_BANQUE:
                                    stats["pas_hors_banque"] += 1
                                # compteurs
                                stats["paliers"][pal["palier"]] += 1
                                stats["configs_par_palier"][pal["palier"]].add(lect["config"])
                                if pal["S1"]:
                                    stats["S1"] += 1
                                if pal["S2"]:
                                    stats["S2"] += 1
                                for c in pal["causes_S2"]:
                                    stats["causes"][c] += 1
    stats["configs_avec_calme"] = configs_avec_calme
    stats["configs_par_palier"] = {k: sorted(v) for k, v in stats["configs_par_palier"].items()}
    stats["md5_texts_count"] = len(stats["md5_texts"])
    del stats["md5_texts"]
    return stats


# ─────────────────────────────────────────────────────────────────────────────
# STAGE 2 — RE-SCORE BIT-EXACT DES 800 PAIRES ARCHIVÉES (D-REPRO)
# ─────────────────────────────────────────────────────────────────────────────
def stage2(pass_id: int) -> dict:
    res = {
        "paires": 0, "comparaisons": 0, "ecarts": [],
        "config_obtenues": {c: 0 for c in core_q4.CONFIGS_9},
        "c1_correct_par_config": {c: 0 for c in core_q4.CONFIGS_9},
        "c2_desaccords": 0, "boucles": 0, "avertissements": 0,
        "c5_violations": 0, "c3_mot_pour_mot": 0, "c3_configs": set(),
        "paliers_archives": {"🟢": 0, "🟠": 0, "🔴": 0},
        "S1_archives": 0, "S2_archives": 0,
        "fragments_complets": 0, "pas_resolus": 0, "pas_repr_vs_reel": 0,
        "mots_interdits_max": 0, "direction_affichee": 0,
    }
    sim = _sim_frais(pass_id)                     # VRAI simulateur, frais
    arch_path = corr._PKG.parent / "results" / "resultats-q4-2026-10-15.json"
    arch = json.loads(arch_path.read_text(encoding="utf-8"))
    res["resume_configs_attendu"] = arch["resume_configs"]
    resume = {c: 0 for c in core_q4.CONFIGS_9}
    for paire in sim.PAIRES:
        res["paires"] += 1
        p1, p2 = paire["p1"], paire["p2"]
        # chemin moteur (identique au pipeline P1)
        t1 = core_q4.type_attachement(
            core_q4.corriger_style(p1["sA"], p1.get("style")),
            core_q4.corriger_style(p1["sB"], p1.get("style")))
        t2 = core_q4.type_attachement(
            core_q4.corriger_style(p2["sA"], p2.get("style")),
            core_q4.corriger_style(p2["sB"], p2.get("style")))
        config = core_q4.identifier_configuration(t1, t2)
        res["config_obtenues"][config] += 1
        resume[paire["config_attendue"]] += 1
        if config == paire["config_attendue"]:
            res["c1_correct_par_config"][config] += 1
        # C2 — vérité croisée par la ré-implémentation indépendante du simulateur
        cv = sim.configuration_vraie(p1, p2)
        res["comparaisons"] += 1
        if cv != config:
            res["c2_desaccords"] += 1
            res["ecarts"].append({"id": paire["id"], "champ": "config_vs_vraie",
                                  "moteur": config, "vraie": cv})
        # boucle + avertissement style
        pct1 = core_q4.convertir_percentile(p1["sA"], p1["sB"], p1.get("style"))
        pct2 = core_q4.convertir_percentile(p2["sA"], p2["sB"], p2.get("style"))
        b = core_q4.boucle_poursuite_retrait(pct1, pct2)
        avert = core_q4.styles_dissimulables(p1.get("style"), p2.get("style"))
        res["boucles"] += int(b["boucle_probable"])
        res["avertissements"] += int(avert)
        # C5 — affichage conforme (les 4 exigences du package P1)
        aff = core_q4.rendre_affichage(config, b, avert, p1["label_ombre"],
                                       p2["label_ombre"], p1["forces"], p2["forces"])
        res["comparaisons"] += 4
        if b["boucle_probable"]:
            bp = (aff["boucle_nommee_ensemble"] or "").lower()
            if "tu " in bp or "ton " in bp:
                res["c5_violations"] += 1
        if not aff["confirmation_p1"].startswith("Partenaire 1") or \
           not aff["confirmation_p2"].startswith("Partenaire 2"):
            res["c5_violations"] += 1
        if aff["pct_compatibilite"] is not None:
            res["c5_violations"] += 1
        if aff["template_config"] != core_q4.TEMPLATES_CONFIGS[config]:
            res["c5_violations"] += 1
        # C3 — template mot pour mot (vs chaîne archivée « attendu »)
        res["comparaisons"] += 1
        if aff["template_config"] == arch["C3"]["templates"][config]["attendu"]:
            res["c3_mot_pour_mot"] += 1
            res["c3_configs"].add(config)
        # couche appliquée sur la vraie paire
        lect = corr.lecture_croisement(p1, p2)
        pal = lect["palier"]
        res["comparaisons"] += 5
        if lect["config"] != config or lect["boucle_probable"] != b["boucle_probable"]:
            res["ecarts"].append({"id": paire["id"], "champ": "lecture_couche_vs_moteur"})
        if pal["S1"] != (pal["palier"] == "🔴") or pal["S2"] != (pal["palier"] == "🟠"):
            res["ecarts"].append({"id": paire["id"], "champ": "junction_S_palier"})
        res["paliers_archives"][pal["palier"]] += 1
        if pal["S1"]:
            res["S1_archives"] += 1
        if pal["S2"]:
            res["S2_archives"] += 1
        bloc = corr.bloc_ecran(lect, p1["label_ombre"], p2["label_ombre"],
                               p1["forces"], p2["forces"])
        if bloc["nb_mots_interdits"] > res["mots_interdits_max"]:
            res["mots_interdits_max"] = bloc["nb_mots_interdits"]
        if bloc["direction_affichee"]:
            res["direction_affichee"] += 1
        frag = corr.bilan_fragment(lect, p1["label_ombre"], p2["label_ombre"],
                                   p1["forces"], p2["forces"])
        if frag["_complet"]:
            res["fragments_complets"] += 1
        # pas : représentatifs (par type) ≡ scores réels corrigés — la
        # compactation validée sur les VRAIES paires archivées
        pc = corr.pas_du_couple(lect["type_p1"], p1["label_ombre"],
                                lect["type_p2"], p2["label_ombre"])
        pas1_reel = core_q5.selectionner_pas(
            core_q4.corriger_style(p1["sA"], p1.get("style")),
            core_q4.corriger_style(p1["sB"], p1.get("style")), p1["label_ombre"])
        pas2_reel = core_q5.selectionner_pas(
            core_q4.corriger_style(p2["sA"], p2.get("style")),
            core_q4.corriger_style(p2["sB"], p2.get("style")), p2["label_ombre"])
        res["comparaisons"] += 4
        if pc["pas_p1"]["pas"] in core_q5.PAS_BANQUE and pc["pas_p2"]["pas"] in core_q5.PAS_BANQUE:
            res["pas_resolus"] += 1
        if pc["pas_p1"]["pas"] == pas1_reel["pas"] and pc["pas_p2"]["pas"] == pas2_reel["pas"]:
            res["pas_repr_vs_reel"] += 1
        else:
            res["ecarts"].append({"id": paire["id"], "champ": "pas_repr_vs_reel"})
    # agrégats vs ARCHIVE du 15/10 — bit-exact
    agg = {
        "resume_configs": resume == arch["resume_configs"],
        "config_obtenues": res["config_obtenues"] == arch["config_obtenues_count"],
        "c1_par_config": res["c1_correct_par_config"] == {
            c: v["n_correct"] for c, v in arch["C1"]["par_config"].items()},
        "boucles": res["boucles"] == arch["stats_boucles"]["n_boucles_probables"],
        "avertissements": res["avertissements"] == arch["stats_boucles"]["n_avertissements_style"],
        "c2_desaccords": res["c2_desaccords"] == arch["C2"]["n_desaccords"],
        "c3_templates": len(res["c3_configs"]) == arch["C3"]["obtenu_mot_pour_mot"]
                        and res["c3_mot_pour_mot"] == arch["C2"]["n_total"],
        "c5_violations": res["c5_violations"] == arch["C5"]["n_violations"],
    }
    res["comparaisons"] += len(agg)
    res["agregats_vs_archive"] = agg
    res["c3_configs"] = sorted(res["c3_configs"])
    return res


# ─────────────────────────────────────────────────────────────────────────────
# STAGE 4 — COUPLAGE PAS (VRAI Q5) + SUIVI + RE-TEST
# ─────────────────────────────────────────────────────────────────────────────
def stage4() -> dict:
    table = {}
    resolus = 0
    for t in TYPES:
        for lab in EMPREINTES_LABELS:
            sel = corr.pas_du_couple(t, lab, t, lab)
            key = f"{t}|{core_q5.empreinte(lab)}"
            table[key] = sel["pas_p1"]["pas"]
            if sel["pas_p1"]["pas"] in core_q5.PAS_BANQUE and \
               sel["pas_p2"]["pas"] in core_q5.PAS_BANQUE:
                resolus += 1
    suivi = [core_q5.suivre_14_jours(j) for j in range(15)]
    cat = [s["categorie"] for s in suivi]
    suivi_ok = (cat[6] == "REPRISE" and cat[7] == "AJUSTEMENT"
                and cat[8] == "AJUSTEMENT" and cat[9] == "CELEBRE"
                and cat[0] == "REPRISE" and cat[14] == "CELEBRE")
    sanctions = sum(1 for s in suivi if s["sanction"] is not None)
    rt = core_q5.programmer_re_test_q1("2026-01-01")
    retest_ok = (rt["force"] is False and "jamais forcé" in rt["message"]
                 and rt["date_re_test"].startswith("2026-02-26"))
    return {
        "pas_12": table, "pas_resolus": resolus,
        "pas_labels_dans_banque": sorted({core_q5.PAS_LABELS[v] for v in table.values()}),
        "suivi_frontieres_ok": suivi_ok, "suivi_sanctions": sanctions,
        "re_test_force": rt["force"], "re_test_date": rt["date_re_test"],
        "re_test_ok": retest_ok,
        "templates_suivi": sorted(core_q5.TEMPLATES_SUIVI.keys()),
    }


# ─────────────────────────────────────────────────────────────────────────────
# PIPELINE COMPLET (exécuté 2 fois pour COR8)
# ─────────────────────────────────────────────────────────────────────────────
def pipeline(pass_id: int) -> dict:
    s0 = stage0()
    s1 = stage1()
    s2 = stage2(pass_id)
    s4 = stage4()
    return {"stage0": s0, "stage1": s1, "stage2": s2, "stage4": s4,
            "standings": {
                "mots_interdits_standings": max(
                    [sum(1 for m in corr.MOTS_INTERDITS if m in t.lower())
                     for t in (corr.BANDEAU_DSIM, corr.PHRASE_ORIENTATION,
                               corr.clause_aide_standing(),
                               corr.clause_orientation(),
                               corr.clause_surveillance(["boucle", "feu", "silence"]))]),
                "mots_blame_standings": max(
                    [sum(1 for m in corr.MOTS_BLAME if m in t.lower())
                     for t in (corr.BANDEAU_DSIM, corr.PHRASE_ORIENTATION,
                               corr.clause_aide_standing())]),
                "orientation_canon_dans_phrase":
                    "pas un échec" in corr.PHRASE_ORIENTATION,
            }}


def main() -> int:
    print("Exécution 1/2 …", flush=True)
    r1 = pipeline(1)
    print("Exécution 2/2 …", flush=True)
    r2 = pipeline(2)

    def canonique(d) -> bytes:
        return json.dumps(d, sort_keys=True, ensure_ascii=False,
                          default=list).encode("utf-8")

    sha1 = hashlib.sha256(canonique(r1)).hexdigest()
    sha2 = hashlib.sha256(canonique(r2)).hexdigest()
    cor8 = sha1 == sha2

    s0, s1, s2, s4 = r1["stage0"], r1["stage1"], r1["stage2"], r1["stage4"]
    n = s1["configs"]

    criteres = {
        "COR0_compactations": {
            "definition": "écart/boucle déterministes par paire de types (16/16, "
                          "7 valeurs d'écart, dist min au seuil 30 consignée) · "
                          "frontière 2,61 jamais PILE sur l'ensemble atteignable "
                          "(dist min consignée) · face ≡ type → pas ≡ (type, "
                          "empreinte) sur la grille atteignable · espions clés "
                          "parasites · empreinte 6 variantes → 3 classes · table "
                          "indépendante ≡ VRAI _CONFIG_TABLE · complétude L6 3×3",
            "observe": f"écart {s0['ecart_coherent']}/{s0['ecart_total']} · valeurs "
                       f"{s0['ecart_valeurs']} · pile 30 : {s0['pile_30']} (dist min "
                       f"{s0['dist_min_30']}) · pile 2,61 : {s0['pile_261']} (dist min "
                       f"{s0['dist_min_261']}) · face écarts {s0['face_ecarts']}/4 · pas "
                       f"écarts {s0['pas_ecarts']}/{s0['pas_combinaisons']} · espion "
                       f"{s0['espion_ecarts']} écart/{s0['espion_cles']} · empreinte "
                       f"{s0['empreinte_variantes']}→{len(s0['empreinte_classes'])} · table "
                       f"{s0['table_16']}/16 · L6 {s0['l6_ecarts']} écart/{s0['l6_cellules']} "
                       f"cellules (avert {s0['l6_avert_ecarts']})",
            "pass": (s0["ecart_coherent"] == s0["ecart_total"] and s0["pile_30"] == 0
                     and s0["pile_261"] == 0 and s0["face_ecarts"] == 0
                     and s0["pas_ecarts"] == 0 and s0["espion_ecarts"] == 0
                     and s0["empreinte_classes"] == ["PEUR_DE_PERDRE",
                                                     "PEUR_D_ETRE_ETOUFFEE",
                                                     "ZONE_CALME"]
                     and s0["table_16"] == 16 and s0["l6_ecarts"] == 0
                     and s0["l6_avert_ecarts"] == 0)},
        "COR1_fragment_complet": {
            "definition": "139 392/139 392 configurations → fragment L8 7 blocs "
                          "niveau couple, 0 champ vide + 800/800 paires archivées",
            "observe": f"{s1['fragment_complet']}/{n} énumérés · {s2['fragments_complets']}"
                       f"/{s2['paires']} archivés",
            "pass": s1["fragment_complet"] == n and s2["fragments_complets"] == s2["paires"]},
        "COR2_derivation_palier": {
            "definition": "chemin indépendant (table + règle ré-encodées, sans appeler "
                          "le moteur) ≡ chemin couche (VRAI moteur) : config + boucle + "
                          "palier + S1 + S2",
            "observe": f"{n - s1['cor2_ecarts']}/{n} convergents",
            "pass": s1["cor2_ecarts"] == 0},
        "COR3_seuils_aide": {
            "definition": "S1 ⇔ palier 🔴 (FEU_CROISE) exactement ; S2 ⇔ palier 🟠 "
                          "exactement (boucle VRAI ≥ 30 ∨ feu simple ∨ silence) ; "
                          "0 seuil numérique ajouté par la couche (2,61 · 30 · 9 · 7 "
                          "— tous du VRAI moteur ; bornes PILE consignées)",
            "observe": f"S1 {s1['S1']}/{n} · S2 {s1['S2']}/{n} · causes boucle "
                       f"{s1['causes']['boucle']} · feu {s1['causes']['feu']} · silence "
                       f"{s1['causes']['silence']} · junctions incohérentes "
                       f"{s1['junction_incoherente']} · S1 archivés {s2['S1_archives']}/{s2['paires']} · "
                       f"S2 archivés {s2['S2_archives']}/{s2['paires']}",
            "pass": s1["junction_incoherente"] == 0 and s1["S1"] == s1["paliers"]["🔴"]
                    and s1["S2"] == s1["paliers"]["🟠"]},
        "COR4_vocabulaire_ecran": {
            "definition": "0 mot interdit (canon Partie 9 + liste anti-blâme du VRAI "
                          "moteur) sur tous les textes générés ; D-SIM 100 % ; "
                          "direction de la boucle jamais affichée ; jamais de "
                          "« tu »/« ton » dans la phrase de boucle",
            "observe": f"max mots interdits par texte = {s1['mots_interdits_max']} ; "
                       f"textes distincts = {s1['md5_texts_count']} ; D-SIM manquants "
                       f"{s1['dsim_manquants']} ; direction affichée {s1['direction_affichee']} ; "
                       f"« tu » dans boucle {s1['phrase_boucle_tu']} ; standings "
                       f"{r1['standings']['mots_interdits_standings']}/"
                       f"{r1['standings']['mots_blame_standings']}",
            "pass": (s1["mots_interdits_max"] == 0 and s1["dsim_manquants"] == 0
                     and s1["direction_affichee"] == 0 and s1["phrase_boucle_tu"] == 0
                     and r1["standings"]["mots_interdits_standings"] == 0
                     and r1["standings"]["mots_blame_standings"] == 0)},
        "COR5_anti_fabrication": {
            "definition": "« rien à fabriquer » ssi BASE_SEREINE exactement (le calme "
                          "nommé seulement là où le VRAI moteur le nomme) ; jamais de "
                          "pourcentage de compatibilité (pct None partout) ; avertissement "
                          "de style présent ssi styles dissimulables (VRAI R4) ; 9 "
                          "templates réels du moteur reproduits mot pour mot",
            "observe": f"calme abus {s1['calme_abus']} · calme manqués {s1['calme_manques']} "
                       f"(configs avec calme légitime {s1['configs_avec_calme']}) · pct non null "
                       f"{s1['pct_non_null']} · avert présents {s1['avert_presents']}/"
                       f"attendus {s1['avert_attendus']} · C5 violations archivées {s2['c5_violations']}",
            "pass": (s1["calme_abus"] == 0 and s1["calme_manques"] == 0
                     and s1["pct_non_null"] == 0 and s2["c5_violations"] == 0
                     and s1["avert_presents"] == s1["avert_attendus"])},
        "COR6_re_score_bit_exact": {
            "definition": "D-REPRO : le VRAI simulateur P1 seed 42 re-exécuté FRAIS à "
                          "chaque passage — 800 paires — agrégats bit-exact vs JSON "
                          "archivé du 15/10 (resume_configs · config_obtenues_count · "
                          "C1 par config · C2 0 désaccord · boucles 370 · avertissements "
                          "28 · C3 9/9 · C5 0) ; FAIL strict C1 7/9 CONSERVÉ consigné "
                          "(géométrie du style L6, zéro retouche) ; couche appliquée sur "
                          "les 800 (junctions, textes, fragments, pas)",
            "observe": f"{s2['paires']} paires · {s2['comparaisons']} comparaisons · écarts "
                       f"{len(s2['ecarts'])} · agrégats {s2['agregats_vs_archive']} · C1 "
                       f"correct {sum(s2['c1_correct_par_config'].values())}/800 · boucles "
                       f"{s2['boucles']} · avert {s2['avertissements']} · paliers archivés "
                       f"{s2['paliers_archives']} · pas repr ≡ réel {s2['pas_repr_vs_reel']}/"
                       f"{s2['paires']}",
            "pass": (len(s2["ecarts"]) == 0 and all(s2["agregats_vs_archive"].values())
                     and s2["pas_repr_vs_reel"] == s2["paires"]
                     and sum(s2["c1_correct_par_config"].values()) == 621)},
        "COR7_couplage_pas": {
            "definition": "12/12 (type × empreinte) par partenaire → pas du VRAI moteur "
                          "Q5 (face × empreinte mesurées, jamais devinées) ; suivi 14 j "
                          "15/15 frontières exactes, 0 sanction ; re-test 8 semaines par "
                          "le VRAI programmer_re_test_q1 (jamais forcé)",
            "observe": f"pas résolus {s4['pas_resolus']}/12 · suivi frontières "
                       f"{s4['suivi_frontieres_ok']} · sanctions {s4['suivi_sanctions']} · "
                       f"re-test force {s4['re_test_force']} · date {s4['re_test_date'][:10]} "
                       f"· pas repr ≡ réel (800 paires) {s2['pas_repr_vs_reel']}/{s2['paires']}",
            "pass": (s4["pas_resolus"] == 12 and s4["suivi_frontieres_ok"]
                     and s4["suivi_sanctions"] == 0 and s4["re_test_ok"])},
        "COR8_reproductibilite": {
            "definition": "pipeline ×2 → SHA-256 identiques",
            "observe": f"{sha1[:16]}… == {sha2[:16]}… → {cor8}", "pass": cor8},
    }

    RES.mkdir(exist_ok=True)
    payload = {
        "package": "validation-q4/correction-philosophique",
        "cible": "RIO-04 « Notre danse » (croisement de couple)",
        "moteurs_reels": ["validation-q4/src/wtc_q4_core.py (9 configurations, "
                          "9 templates, boucle ≥ 30)",
                          "validation-q4/src/wtc_q4_simulator.py (seed 42, "
                          "800 paires — re-exécuté frais, D-REPRO)",
                          "validation-q5/src/wtc_q5_core.py (pas + suivi + re-test)"],
        "espace_enumeré": "4 types p1 × 4 types p2 × 2 classes de styles L6 × "
                          "3 empreintes p1 × 3 empreintes p2 × 22 jeux de forces "
                          "p1 × 22 jeux de forces p2 = 139 392 configurations",
        "cor8_sha256_run1": sha1, "cor8_sha256_run2": sha2,
        "criteres": criteres,
        "stage0": s0,
        "stage1": {k: v for k, v in s1.items()},
        "stage2": {k: v for k, v in s2.items() if k != "ecarts"},
        "stage2_ecarts": s2["ecarts"][:20],
        "stage4": s4,
        "standings": r1["standings"],
    }
    (RES / "correction_criteres.json").write_text(
        json.dumps(payload, indent=1, ensure_ascii=False, default=list),
        encoding="utf-8")
    print(json.dumps({k: v["observe"] for k, v in criteres.items()},
                     indent=1, ensure_ascii=False))
    print("Tous PASS :", all(c["pass"] for c in criteres.values()))
    return 0 if all(c["pass"] for c in criteres.values()) else 1


if __name__ == "__main__":
    sys.exit(main())
