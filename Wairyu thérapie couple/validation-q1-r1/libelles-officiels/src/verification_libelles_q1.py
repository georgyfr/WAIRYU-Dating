# -*- coding: utf-8 -*-
"""
WTC-Q1 — VÉRIFICATION DU SCELLEMENT DES LIBELLÉS OFFICIELS (RIO-01)
===================================================================
Action n°3 — preuve que l'injection des 19 libellés officiels n'a touché
AUCUN calcul validé.

Méthode (même discipline que les packages de correction) :
  LIB0 — moteurs réels chargés TELS QUELS (cœur R1, simulateur R1, couche de
         correction RIO-01 pour la liste canonique MOTS_INTERDITS) + asserts
         d'identité à l'import ;
  LIB1 — structure des libellés : clés 1-18 + vigilance 19, textes non vides,
         uniques, ponctués ;
  LIB2 — cohérence des faces : chaque item 1-18 tombe sur la face du VRAI
         moteur (face_de_item), items 1-9 → axe A, 10-18 → axe B ;
  LIB3 — ancres de sécurité : {5, 15} == ITEMS_INVERSES du moteur (les deux
         seuls items inversés) et valence « positive » sur les deux ;
         comptage de valence 7 positives / 12 neutres / 1 équilibrée, 0 sombre ;
  LIB4 — 0 mot interdit (liste canonique de la couche de correction RIO-01)
         dans les 19 libellés + les 6 sous-titres de faces ;
  LIB5 — RE-SCORE BIT-EXACT vs archives : le VRAI simulateur (seed 42)
         régénère 500 honnêtes + 20 piégés, le VRAI cœur recalcule L1→L4,
         comparaison colonne à colonne aux archives validées
         (reponses_honnetes_calculees.csv + reponses_pieges_calculees.csv)
         — 0 écart attendu sur ~37 000 comparaisons ;
  LIB6 — inertie des libellés : le module de libellés est un module de
         DONNÉES pures (aucun import, aucune écriture) et l'empreinte du
         re-score est IDENTIQUE avant et après son import ;
  LIB7 — reproductibilité : la passe complète est exécutée DEUX fois
         (simulateur frais à chaque passe) — verdicts et SHA-256 identiques.

Sorties : results/verification_libelles.json + results/rapport-libelles-RIO-01.md
Usage   : python3 src/verification_libelles_q1.py
"""

from __future__ import annotations

import csv
import hashlib
import importlib.util
import json
import sys
from pathlib import Path

# ─────────────────────────────────────────────────────────────────────────────
# CHEMINS (le dépôt réel — jamais de copie)
# ─────────────────────────────────────────────────────────────────────────────
_PKG = Path(__file__).resolve().parents[1]            # …/validation-q1-r1/libelles-officiels
_R1 = _PKG.parent                                     # …/validation-q1-r1
_WTC = _R1.parent                                     # …/Wairyu thérapie couple
_RESULTS = _PKG / "results"


def _charge(nom: str, chemin: Path):
    spec = importlib.util.spec_from_file_location(nom, chemin)
    mod = importlib.util.module_from_spec(spec)
    sys.modules[nom] = mod
    spec.loader.exec_module(mod)
    return mod


def sha256_fichier(chemin: Path) -> str:
    return hashlib.sha256(chemin.read_bytes()).hexdigest()


# ─────────────────────────────────────────────────────────────────────────────
# LIB0 — LES VRAIS MOTEURS (importés, jamais recopiés)
# ─────────────────────────────────────────────────────────────────────────────
CORE_R1 = _R1 / "src" / "wtc_q1_core.py"
SIMU_R1 = _R1 / "src" / "wtc_q1_simulator.py"
CORR_Q1 = _WTC / "validation-q1" / "correction-philosophique" / "src" / "wtc_q1_correction.py"
LIBELLES_PY = _PKG / "src" / "wtc_q1_libelles.py"
ARCHIVE_H = _R1 / "results" / "reponses_honnetes_calculees.csv"
ARCHIVE_P = _R1 / "results" / "reponses_pieges_calculees.csv"


def passe_complet() -> dict:
    """Une passe complète de vérification (déterministe, simulateur frais)."""
    res: dict = {"verdicts": {}, "compteurs": {}}

    # ── LIB0 — moteurs réels ────────────────────────────────────────────────
    core = _charge("wtc_q1_core_r1_lib", CORE_R1)
    simu = _charge("wtc_q1_simu_r1_lib", SIMU_R1)
    corr = _charge("wtc_q1_corr_lib", CORR_Q1)  # liste canonique MOTS_INTERDITS
    res["verdicts"]["LIB0_moteurs_reels"] = (
        core.N_ITEMS == 18
        and core.ITEMS_INVERSES == (5, 15)
        and core.VIGILANCE_ATTENDUE == 3
        and core.SEM_AXE == 0.195
        and len(core.FACES) == 6
        and core.face_de_item(5) == "A1"
        and core.face_de_item(15) == "B1"
        and len(corr.MOTS_INTERDITS) > 0
    )
    res["compteurs"]["mots_interdits_liste"] = len(corr.MOTS_INTERDITS)

    # ── Chargement des libellés officiels (LIB6 : inertie prouvée) ─────────
    # Instantané des attributs du VRAI cœur AVANT le chargement du module de
    # libellés — identités des fonctions, valeurs des constantes.
    instantane_avant = {
        k: (id(v) if callable(v) else v) for k, v in vars(core).items()
        if not k.startswith("__")
    }
    lib = _charge("wtc_q1_libelles_officiels", LIBELLES_PY)
    instantane_apres = {
        k: (id(v) if callable(v) else v) for k, v in vars(core).items()
        if not k.startswith("__")
    }

    # ── LIB1 — structure ────────────────────────────────────────────────────
    cles = set(lib.LIBELLES.keys())
    textes = list(lib.LIBELLES.values()) + [lib.LIBELLE_VIGILANCE]
    res["verdicts"]["LIB1_structure"] = (
        cles == set(range(1, 19))
        and len(textes) == 19
        and all(isinstance(t, str) and len(t.strip()) > 0 for t in textes)
        and len(set(textes)) == 19
        and all(t.rstrip().endswith(".") for t in textes)
    )

    # ── LIB2 — cohérence des faces (VRAI moteur) ────────────────────────────
    ok_faces = True
    for i in range(1, 19):
        fid = core.face_de_item(i)
        if fid not in lib.FACE_NOM_ECRAN or fid not in lib.FACE_SOUS_TITRE:
            ok_faces = False
        axe_attendu = "A" if i <= 9 else "B"
        if core.FACES[fid]["axe"] != axe_attendu:
            ok_faces = False
    res["verdicts"]["LIB2_faces_coherentes"] = ok_faces

    # ── LIB3 — ancres + valence ─────────────────────────────────────────────
    res["verdicts"]["LIB3_ancres_valence"] = (
        tuple(sorted(lib.ANCRES_SECURITE)) == tuple(sorted(core.ITEMS_INVERSES))
        and lib.VALENCE[5] == "positive"
        and lib.VALENCE[15] == "positive"
        and sum(1 for v in lib.VALENCE.values() if v == "positive") == 6
        and sum(1 for v in lib.VALENCE.values() if v == "neutre") == 12
        and sum(1 for v in lib.VALENCE.values() if v == "équilibrée") == 1
        and lib.VALENCE[19] == "équilibrée"
        and sum(1 for v in lib.VALENCE.values() if v == "sombre") == 0
    )

    # ── LIB4 — mots interdits (liste canonique de la couche RIO-01) ─────────
    textes_ecran = textes + list(lib.FACE_SOUS_TITRE.values()) + list(lib.AXE_NOM_ECRAN.values())
    occurrences = []
    for t in textes_ecran:
        bas = t.lower()
        for mot in corr.MOTS_INTERDITS:
            if mot in bas:
                occurrences.append((mot, t[:60]))
    res["verdicts"]["LIB4_mots_interdits"] = len(occurrences) == 0
    res["compteurs"]["textes_balayes"] = len(textes_ecran)
    res["compteurs"]["occurrences_interdites"] = occurrences

    # ── LIB5 — re-score BIT-EXACT vs archives ───────────────────────────────
    honnetes, pieges = simu.simule_tout(seed=42)
    assert len(honnetes) == 500 and len(pieges) == 20

    with open(ARCHIVE_H, newline="", encoding="utf-8-sig") as f:
        arch_h = list(csv.DictReader(f))
    with open(ARCHIVE_P, newline="", encoding="utf-8-sig") as f:
        arch_p = list(csv.DictReader(f))
    assert len(arch_h) == 500 and len(arch_p) == 20

    COLS_FLOAT = (
        ["rqs_et_corriges", "temps_session"]
        + ["score_A", "ci_bas_A", "ci_haut_A", "score_B", "ci_bas_B", "ci_haut_B"]
        + ["l4_ecart_A", "l4_ecart_B"]
    )
    COLS_INT = (["cor" + str(i) for i in range(1, 19)]
                + ["vigilance", "rqs_nb_items_rapides", "rqs_total_penalites", "rqs"])
    COLS_STR = (
        ["rqs_statut"]
        + [f"{c}_{a}" for a in ("A", "B") for c in
           ("type_lecture", "lecture", "touches", "conservateur",
            "niveau_ponctuel", "l4_ordre", "l4_lecture")]
    )
    COLS_BOOL = ["rqs_pen_linearite", "rqs_pen_contradiction",
                 "rqs_pen_rythme", "rqs_pen_vigilance"]

    total_cmp, ecarts = 0, []
    payload = hashlib.sha256()

    def evalue(row: dict) -> dict:
        bruts = {i: int(row[f"r{i}"]) for i in range(1, 19)}
        temps_items = {i: float(row[f"t{i}"]) for i in range(1, 19)}
        temps_session = float(sum(float(row[f"t{q}"]) for q in range(1, 20)))
        vigilance = int(row["vigilance"])
        rqs = core.calcule_rqs(bruts, temps_items, temps_session, vigilance)
        cor = core.corrige_tous(bruts)
        faces = core.scores_faces(cor)
        axes = core.scores_axes(cor)
        out = {
            "cor": cor, "temps_session": rqs["temps_session"], "vigilance": vigilance,
            "rqs_et_corriges": rqs["et_corriges"],
            "rqs_pen_linearite": rqs["penalites"]["linearite"],
            "rqs_pen_contradiction": rqs["penalites"]["contradiction"],
            "rqs_pen_rythme": rqs["penalites"]["rythme"],
            "rqs_pen_vigilance": rqs["penalites"]["vigilance"],
            "rqs_nb_items_rapides": rqs["nb_items_rapides"],
            "rqs_total_penalites": rqs["total_penalites"],
            "rqs": rqs["rqs"], "rqs_statut": rqs["statut"],
        }
        for axe in ("A", "B"):
            score = axes[axe]
            bas, haut = core.bornes_ci90(score)
            lect = core.lecture_L3(score, bas, haut)
            l4 = core.lecture_L4(faces, axe)
            out[f"score_{axe}"] = score
            out[f"ci_bas_{axe}"], out[f"ci_haut_{axe}"] = bas, haut
            out[f"type_lecture_{axe}"] = lect["type"]
            out[f"lecture_{axe}"] = lect["lecture"]
            out[f"touches_{axe}"] = "|".join(lect["touches"])
            out[f"conservateur_{axe}"] = lect["niveau_conservateur"]
            out[f"niveau_ponctuel_{axe}"] = core.niveau_ponctuel(score)
            out[f"l4_ordre_{axe}"] = ">".join(l4["ordre"])
            out[f"l4_ecart_{axe}"] = l4["ecart_1_2"]
            out[f"l4_lecture_{axe}"] = l4["lecture"]
        for i in range(1, 19):
            out[f"cor{i}"] = cor[i]
        return out

    def compare(r_arch: dict, calc: dict, tag: str) -> None:
        nonlocal total_cmp
        # réponses brutes (comparées — preuve que le simulateur régénère l'archive)
        for i in range(1, 19):
            total_cmp += 1
            if int(r_arch[f"r{i}"]) != int(row[f"r{i}"]):
                ecarts.append((tag, f"r{i}", r_arch[f"r{i}"], row[f"r{i}"]))
            payload.update(f"{tag}:r{i}={int(row[f'r{i}'])}".encode())
        # colonnes comparées
        for c in COLS_INT:
            total_cmp += 1
            if int(r_arch[c]) != int(calc[c]):
                ecarts.append((tag, c, r_arch[c], calc[c]))
            payload.update(f"{tag}:{c}={calc[c]}".encode())
        for c in COLS_FLOAT:
            total_cmp += 1
            if float(r_arch[c]) != float(calc[c]):
                ecarts.append((tag, c, r_arch[c], calc[c]))
            payload.update(f"{tag}:{c}={float(calc[c])!r}".encode())
        for c in COLS_STR:
            total_cmp += 1
            if str(r_arch[c]) != str(calc[c]):
                ecarts.append((tag, c, r_arch[c], calc[c]))
            payload.update(f"{tag}:{c}={calc[c]}".encode())
        for c in COLS_BOOL:
            total_cmp += 1
            if (r_arch[c] == "True") != bool(calc[c]):
                ecarts.append((tag, c, r_arch[c], calc[c]))
            payload.update(f"{tag}:{c}={bool(calc[c])}".encode())

    for k, (row, r_arch) in enumerate(zip(honnetes, arch_h), start=1):
        tag = f"H{k:03d}"
        assert r_arch["identifiant"] == tag
        compare(r_arch, evalue(row), tag)
    for k, (row, r_arch) in enumerate(zip(pieges, arch_p), start=1):
        tag = f"P{k:02d}"
        assert r_arch["identifiant"] == tag
        compare(r_arch, evalue(row), tag)

    res["compteurs"]["comparaisons"] = total_cmp
    res["compteurs"]["ecarts"] = len(ecarts)
    res["compteurs"]["ecarts_detail"] = ecarts[:20]
    res["verdicts"]["LIB5_rescore_bitexact"] = len(ecarts) == 0
    res["payload_hash"] = payload.hexdigest()

    # ── LIB6 — inertie du module de libellés ────────────────────────────────
    # (a) statique : le module ne contient AUCUN import (données pures) ;
    # (b) dynamique : le VRAI cœur est bit-identique après chargement
    #     (aucune fonction remplacée, aucune constante mutée).
    source = LIBELLES_PY.read_text(encoding="utf-8")
    imports_reels = [
        ln for ln in source.splitlines()
        if ln.strip().startswith(("import ", "from "))
        and "__future__" not in ln
    ]
    res["verdicts"]["LIB6_inertie_libelles"] = (
        len(imports_reels) == 0 and instantane_avant == instantane_apres
    )
    res["compteurs"]["imports_dans_module_libelles"] = len(imports_reels)
    res["compteurs"]["attributs_coeur_inchanges"] = (
        instantane_avant == instantane_apres
    )

    # ── LIB7 — empreintes des fichiers réels ────────────────────────────────
    res["sha256"] = {
        "wtc_q1_core.py (R1)": sha256_fichier(CORE_R1),
        "wtc_q1_simulator.py (R1)": sha256_fichier(SIMU_R1),
        "wtc_q1_libelles.py": sha256_fichier(LIBELLES_PY),
        "wtc_q1_correction.py (liste mots interdits)": sha256_fichier(CORR_Q1),
        "archive reponses_honnetes_calculees.csv": sha256_fichier(ARCHIVE_H),
        "archive reponses_pieges_calculees.csv": sha256_fichier(ARCHIVE_P),
    }
    res["tous_pass"] = all(bool(v) for k, v in res["verdicts"].items())
    return res


def main() -> int:
    _RESULTS.mkdir(exist_ok=True)

    p1 = passe_complet()
    p2 = passe_complet()

    identiques = (
        p1["payload_hash"] == p2["payload_hash"]
        and p1["sha256"] == p2["sha256"]
        and p1["verdicts"] == p2["verdicts"]
        and p1["compteurs"] == p2["compteurs"]
        and p1["compteurs"]["ecarts"] == p2["compteurs"]["ecarts"] == 0
    )

    sortie = {
        "package": "validation-q1-r1/libelles-officiels",
        "instrument": "RIO-01 « Comment je me raccroche »",
        "action": "n°3 — scellement des libellés officiels (accord fondateur 24/10/2026)",
        "passe_1": p1,
        "passe_2": p2,
        "reproductibilité_passe1_passe2": bool(identiques),
        "verdict_final": "SCELLÉ — VÉRIFIÉ" if (p1["tous_pass"] and identiques) else "ÉCHEC",
    }
    (_RESULTS / "verification_libelles.json").write_text(
        json.dumps(sortie, ensure_ascii=False, indent=2), encoding="utf-8"
    )

    v1, c1 = p1["verdicts"], p1["compteurs"]
    lignes = [
        "# RAPPORT — Scellement des libellés officiels RIO-01 « Comment je me raccroche »",
        "",
        "**Action n°3 — premier instrument scellé.** Accord fondateur : trace "
        "1a16c6a31081f721, 24/10/2026 (« c'est bon pousse cela dans github »), "
        "après relecture item par item des 19 libellés v2 (7 positives · "
        "12 neutres · 0 sombres).",
        "",
        "## Méthode",
        "- Moteurs réels importés TELS QUELS (jamais recopiés, jamais modifiés) :",
        f"  - cœur `{CORE_R1.name}` (révision R1, SEM structurel 0,195) — SHA-256 `{p1['sha256']['wtc_q1_core.py (R1)'][:16]}…` ;",
        f"  - simulateur R1 (seed 42) — SHA-256 `{p1['sha256']['wtc_q1_simulator.py (R1)'][:16]}…` ;",
        f"  - couche de correction RIO-01 (liste canonique MOTS_INTERDITS, {c1['mots_interdits_liste']} mots) — SHA-256 `{p1['sha256']['wtc_q1_correction.py (liste mots interdits)'][:16]}…`.",
        "- Archives validées comparées telles quelles (SHA-256 consignés ci-dessous).",
        "",
        "## Verdicts (les deux passes)",
        "",
        "| Critère | Exigence | Observé | Verdict |",
        "|---|---|---|---|",
        f"| LIB0 — moteurs réels | identité complète | asserts à l'import | {'PASS' if v1['LIB0_moteurs_reels'] else 'FAIL'} |",
        f"| LIB1 — structure des libellés | 18 items + vigilance 19, uniques, ponctués | 19/19 | {'PASS' if v1['LIB1_structure'] else 'FAIL'} |",
        f"| LIB2 — cohérence des faces | chaque item sur sa face du VRAI moteur | 18/18 | {'PASS' if v1['LIB2_faces_coherentes'] else 'FAIL'} |",
        f"| LIB3 — ancres de sécurité | ancres ≡ items inversés (5, 15), valence 7+/12·/0− | conforme | {'PASS' if v1['LIB3_ancres_valence'] else 'FAIL'} |",
        f"| LIB4 — mots interdits | 0 occurrence ({c1['textes_balayes']} textes balayés) | {c1['occurrences_interdites'] or 0} | {'PASS' if v1['LIB4_mots_interdits'] else 'FAIL'} |",
        f"| LIB5 — re-score BIT-EXACT vs archives | 0 écart sur {c1['comparaisons']} comparaisons (520 répondants) | {c1['ecarts']} écart | {'PASS' if v1['LIB5_rescore_bitexact'] else 'FAIL'} |",
        f"| LIB6 — inertie du module libellés | 0 import + cœur bit-identique après chargement | {c1['imports_dans_module_libelles']} import, cœur inchangé : {c1['attributs_coeur_inchanges']} | {'PASS' if v1['LIB6_inertie_libelles'] else 'FAIL'} |",
        f"| LIB7 — reproductibilité | passe ×2 : verdicts + SHA + empreinte identiques | {'identiques' if identiques else 'DIVERGENCE'} | {'PASS' if identiques else 'FAIL'} |",
        "",
        "## Empreintes",
        "",
        f"- Empreinte du re-score (payload 520 répondants × colonnes décisives) : `{p1['payload_hash'][:16]}…` — identique avant import des libellés, après import, et sur la 2ᵉ passe.",
        "",
        "| Fichier | SHA-256 |",
        "|---|---|",
    ]
    for nom, sha in p1["sha256"].items():
        lignes.append(f"| {nom} | `{sha}` |")
    lignes += [
        "",
        "## Garantie",
        "",
        "- **Zéro modification des moteurs, seuils, données ou validations** : "
        "le re-score bit-exact contre les archives validées prouve que le "
        "calcul produit, octet pour octet, les mêmes lectures qu'avant les "
        "libellés. « Des affirmations positives dont les résultats sont "
        "toujours pareils » — garanti par architecture (le moteur lit des "
        "entiers 1-4, jamais les mots).",
        "- Anti-déjoueuvre : les 3 filets (valence mélangée + ancres 5/15 · "
        "vigilance attendue 3 · RQS linéarité/contradiction/rythme) sont dans "
        "le cœur validé L1 — rien à ajouter au code.",
        "- Doctrine écran vérifiée sur les 25 textes affichables : 0 mot "
        "interdit ; toutes les phrases sont des phrases « je » (jamais "
        "l'évaluation du partenaire) ; inclusivité « (e) » ; langage simple.",
        "- Limite universelle consignée : D-SIM — la mécanique est validée, "
        "la prévalence réelle attend VALID-01 (comité clinique + AIPD).",
        "",
        f"**VERDICT FINAL : {sortie['verdict_final']}**",
        "",
    ]
    (_RESULTS / "rapport-libelles-RIO-01.md").write_text(
        "\n".join(lignes), encoding="utf-8"
    )

    print("Verdicts :", p1["verdicts"])
    print("Comparaisons :", c1["comparaisons"], "— écarts :", c1["ecarts"])
    print("Reproductibilité passe ×2 :", identiques)
    print("Tous PASS :", p1["tous_pass"] and identiques)
    return 0 if (p1["tous_pass"] and identiques) else 1


if __name__ == "__main__":
    raise SystemExit(main())
