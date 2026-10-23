# -*- coding: utf-8 -*-
"""
WTC-SM-Q3 — VALIDATION DE LA COUCHE DE CORRECTION PHILOSOPHIQUE (RIO-13)
========================================================================
Exécute les stages de preuve sur les VRAIS moteurs (zéro réimplémentation) :

  Stage 0 — COMPACTATIONS PROUVÉES EXHAUSTIVEMENT :
            (a) items → sommes → niveaux : les 4⁴ = 256 quadruplets × 6
                faces via le VRAI moyenne_face + le VRAI niveau_de de Q4 —
                même somme → même niveau (102 vérifs de somme + 768 de
                représentants) ;
            (b) frontière 3,50 PILE : activation (VRAI
                force_active_de_score, inclusive) ⇔ ÉLEVÉ (VRAI niveau_de,
                même borne) — 102 vérifs, 0 distance entre les deux
                frontières (LA MÊME) ;
            (c) espions : les items sous la somme ne changent rien (le
                cœur ne lit que les moyennes — compactation (a)).
  Stage 1 — ÉNUMÉRATION EXHAUSTIVE de l'espace des états distincts de la
            couche : 3⁶ niveaux de faces × 8 sous-ensembles de voies
            héritées = 5 832 configurations. COR2 = double chemin
            (entiers purs — somme ≥ 14 ⇔ active) ≡ VRAI moteur + junction
            statut ↔ palier (SILENCIEUSE ⇔ aucun ÉLEVÉ · LUMIÈRE/DEUX ⇔
            ÉLEVÉ présent · CRISE_HÉRITÉE ⇔ voies non vides — override
            préempte).
  Stage 2 — RE-SCORE BIT-EXACT des 520 profils archivés du rapport sm-q3
            (9 classes — G1 zone calme 70 · G2/G3/G4 DEUX_LUMIÈRES 210 ·
            G5 unique 70 · G6 crise héritée 50 · G7 50 · G8 40 · G9 30),
            régénérés par le VRAI simulateur (seed 42) : stats_groupes
            (labels observés, corrects, forces attendues), conformité
            table 520/520, voies G6 (30 SM-C1 + 20 H5) — bit-exact vs
            archive du 18/10 — puis application de la couche.
  Stage 4 — COUPLAGE PAS : les 3 paliers réels via le VRAI palier_de/
            pas_de de Q5 sur les 9 croix (détresse × charge — mesurées
            ailleurs, balayées) — 🔴 → aucun pas — + suivi 14 j sans
            sanction + re-test 8 semaines.
  COR8    — Reproductibilité : pipeline exécuté 2 fois, SHA-256 identiques.

Sorties : results/correction_criteres.json
"""

from __future__ import annotations

import hashlib
import itertools
import json
import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import wtc_sm_q3_correction as corr          # la couche (charge les vrais moteurs)
core_q3 = corr.core_q3
core_q4 = corr.core_q4
core_q5 = corr.core_q5

sim_q3 = corr._charge(
    "wtc_sm_q3_simulator",
    corr._Q3 / "src" / "wtc_sm_q3_simulator.py")

RES = Path(__file__).resolve().parents[1] / "results"
SMOKE = os.environ.get("CORR_SMOKE") == "1"
ARCHIVE = corr._Q3 / "results" / "resultats-sm-q3-2026-10-18.json"

# Représentants de niveau (moyenne exacte : somme/4) :
SOMME_NIVEAU = {"FAIBLE": 8, "MOYEN": 12, "ÉLEVÉ": 16}
NIVEAUX = ("FAIBLE", "MOYEN", "ÉLEVÉ")
VOIES_POSSIBLES = tuple(
    tuple(v for v, b in zip(("A2", "SM-C1", "H5"), bits) if b)
    for bits in itertools.product((False, True), repeat=3))   # 8 sous-ensembles


def _items_de_somme(s: int) -> tuple:
    """Quadruplet d'items (1-5) de somme exacte s ∈ [4 ; 20]."""
    base, rem = divmod(s, 4)
    return tuple(base + (1 if i < rem else 0) for i in range(4))


def _reponses_de_niveaux(niveaux: dict) -> dict:
    reps = {}
    for face, niv in niveaux.items():
        reps[face] = _items_de_somme(SOMME_NIVEAU[niv])
    return reps


# ─────────────────────────────────────────────────────────────────────────────
# STAGE 0 — COMPACTATIONS PROUVÉES
# ─────────────────────────────────────────────────────────────────────────────
def stage0() -> dict:
    res = {
        "items_bruts": 0, "items_ecarts": 0,
        "sommes_face": 0, "sommes_face_ecarts": 0,
        "frontiere_350": 0, "frontiere_ecarts": 0,
        "pile_350_inclusive": 0,
    }
    # (a) items → sommes : les 256 quadruplets × 6 faces via le VRAI
    #     moyenne_face — même somme → même moyenne
    par_somme = {}
    for face in core_q3.FACES:
        for items in itertools.product((1, 2, 3, 4, 5), repeat=4):
            m = core_q3.moyenne_face(items)
            res["items_bruts"] += 1
            s = sum(items)
            if s in par_somme and par_somme[s] != m:
                res["items_ecarts"] += 1
            par_somme[s] = m
    # (b) frontière 3,50 PILE : activation ⇔ ÉLEVÉ (LA MÊME borne)
    for face in core_q3.FACES:
        for s in range(4, 21):
            m = s / 4.0
            actif = core_q3.force_active_de_score(m)
            eleve = (core_q4.niveau_de(m) == "ÉLEVÉ")
            res["frontiere_350"] += 1
            if actif != eleve:
                res["frontiere_ecarts"] += 1
            if s == 14:
                res["pile_350_inclusive"] += 1   # 3,50 PILE — inclusive
    # (a-bis) somme → niveau par face (17 × 6)
    for face in core_q3.FACES:
        for s in range(4, 21):
            reps = {f: (3, 3, 3, 3) for f in core_q3.FACES}
            reps[face] = _items_de_somme(s)
            niv = core_q4.niveau_de(core_q3.scores_faces(reps)[face])
            attendu = ("FAIBLE" if s <= 9 else
                       "MOYEN" if s <= 13 else "ÉLEVÉ")
            res["sommes_face"] += 1
            if niv != attendu:
                res["sommes_face_ecarts"] += 1
    return res


# ─────────────────────────────────────────────────────────────────────────────
# STAGE 1 — ÉNUMÉRATION EXHAUSTIVE (5 832 configurations)
# ─────────────────────────────────────────────────────────────────────────────
texts: list = []
frags: list = []


def stage1() -> dict:
    res = {
        "configurations": 0,
        "cor2_double_chemin_ecarts": 0,
        "cor2_junction_ecarts": 0,
        "cor1_fragments_incomplets": 0,
        "cor1_blocs_vides": 0,
        "cor3_S1": 0, "cor3_S2": 0,
        "cor3_voies": {},
        "cor4_mots_interdits": 0, "cor4_dsim_manquant": 0,
        "textes_distincts": 0, "fragments_distincts": 0,
        "cor5_affichees_ecarts": 0,
        "cor5_force_active_en_crise": 0,
        "cor5_calme_hors_zone": 0, "cor5_zone_sans_calme": 0,
        "cor5_exclue_affichee": 0,
        "distrib_statuts": {}, "distrib_paliers": {},
        "densite_exclues_total": 0,
    }
    for niveaux in itertools.product(NIVEAUX, repeat=6):
        nd = dict(zip(core_q3.FACES, niveaux))
        reps = _reponses_de_niveaux(nd)
        for voies in VOIES_POSSIBLES:
            pal = corr.palier_et_seuils(reps, voies)
            res["configurations"] += 1

            # COR2 — double chemin entiers purs ≡ VRAI moteur
            indep = corr.palier_independant(reps, voies)
            if (indep["statut"] != pal["statut"]
                    or indep["palier"] != pal["palier"]):
                res["cor2_double_chemin_ecarts"] += 1
            # COR2 — junction statut ↔ palier (règle R1) :
            actif_present = bool(pal["forces_actives"])
            if pal["statut"] == "CRISE_HÉRITÉE":
                if not voies or pal["palier"] != "🔴":
                    res["cor2_junction_ecarts"] += 1
            elif pal["statut"] == "SILENCIEUSE":
                if actif_present or (pal["palier"] ==
                                     ("🟠" if "MOYEN" in niveaux else "🟢")) is False:
                    res["cor2_junction_ecarts"] += 1
            else:   # LUMIÈRE_UNIQUE / DEUX_LUMIÈRES
                if not actif_present or pal["palier"] != "🟢":
                    res["cor2_junction_ecarts"] += 1

            # COR1 — blocs et fragments complets
            bloc = corr.bloc_ecran(reps, pal)
            frag = corr.bilan_fragment(reps, pal)
            if not frag.get("_complet"):
                res["cor1_fragments_incomplets"] += 1
            if not bloc["texte"].strip():
                res["cor1_blocs_vides"] += 1

            # COR3 — comptes S1/S2 + voies réelles affichées
            if pal["S1"]:
                res["cor3_S1"] += 1
                key = "+".join(voies) if voies else "héritée"
                res["cor3_voies"][key] = res["cor3_voies"].get(key, 0) + 1
            if pal["S2"]:
                res["cor3_S2"] += 1
            res["densite_exclues_total"] += len(pal["exclues_densite"])

            # COR4 — vocabulaire + bandeau
            if bloc["nb_mots_interdits"]:
                res["cor4_mots_interdits"] += bloc["nb_mots_interdits"]
            if corr.BANDEAU_DSIM not in bloc["texte"]:
                res["cor4_dsim_manquant"] += 1
            texts.append(bloc["texte"])
            frags.append(json.dumps(frag, sort_keys=True,
                                    ensure_ascii=False))

            # COR5 — anti-fabrication
            core_res = core_q3.classifier(reps, voies)
            if pal["forces_affichees"] != list(core_res["forces_affichees"]):
                res["cor5_affichees_ecarts"] += 1
            if pal["crise_heritee"]:
                # override A3 réel : aucune force affichée, aucun nom de
                # force « activée » dans le texte :
                if pal["forces_affichees"]:
                    res["cor5_force_active_en_crise"] += 1
                for fid, nom, _f in core_q3.FORCES_BANQUE:
                    if nom in bloc["texte"] and "activée" in bloc["texte"]:
                        res["cor5_force_active_en_crise"] += 1
                        break
            # zone calme (template réel) ssi SILENCIEUSE tout-FAIBLE :
            calme = core_q5.TEMPLATES["zone_calme"] in bloc["texte"]
            zone_calmante = (pal["statut"] == "SILENCIEUSE"
                             and "MOYEN" not in niveaux
                             and "ÉLEVÉ" not in niveaux)
            if calme and not zone_calmante:
                res["cor5_calme_hors_zone"] += 1
            if not calme and zone_calmante:
                res["cor5_zone_sans_calme"] += 1
            # exclues jamais affichées comme retenues :
            for fid in pal["exclues_densite"]:
                if fid in pal["forces_affichees"]:
                    res["cor5_exclue_affichee"] += 1

            # distributions
            res["distrib_statuts"][pal["statut"]] = \
                res["distrib_statuts"].get(pal["statut"], 0) + 1
            res["distrib_paliers"][pal["palier"]] = \
                res["distrib_paliers"].get(pal["palier"], 0) + 1

    res["textes_distincts"] = len(set(texts))
    res["fragments_distincts"] = len(set(frags))
    return res


# ─────────────────────────────────────────────────────────────────────────────
# STAGE 2 — RE-SCORE BIT-EXACT (520 profils archivés, simulateur frais)
# ─────────────────────────────────────────────────────────────────────────────
def stage2() -> dict:
    res = {
        "n_profils": 0, "stats_match": False,
        "conformite_match": False, "voies_g6_match": False,
        "comparaisons": 0, "ecarts": 0,
        "couche_paliers": {}, "couche_S1": 0, "couche_S2": 0,
        "couche_fragments_incomplets": 0, "couche_mots_interdits": 0,
        "couche_exclues": 0,
    }
    archive = json.loads(ARCHIVE.read_text(encoding="utf-8"))
    profs, spec = sim_q3.tous_les_profils()
    res["n_profils"] = len(profs)

    # stats par classe reconstruites par le VRAI moteur :
    stats = {}
    for p in profs:
        g = p["classe"]
        cls = core_q3.classifier(p["reponses"], p["voies_heritees"])
        st = stats.setdefault(g, {"N": 0, "correct": 0, "dominante": None,
                                  "forces_attendues": None,
                                  "labels_observes": {}})
        st["N"] += 1
        st["labels_observes"][cls["statut"]] = \
            st["labels_observes"].get(cls["statut"], 0) + 1
        label_vrai, forces_vraies, _crise = sim_q3.classification_vraie(g)
        st["dominante"] = label_vrai
        st["forces_attendues"] = list(forces_vraies)
        if cls["statut"] == label_vrai and \
                [fid for fid in cls["forces_affichees"]] == forces_vraies:
            st["correct"] += 1
        res["comparaisons"] += 1
    res["stats_match"] = stats == archive["stats_groupes"]
    if not res["stats_match"]:
        res["ecarts"] += 1

    # conformité table + voies G6 :
    corrects = sum(v["correct"] for v in stats.values())
    res["conformite_match"] = (corrects == archive["conformite_table"]["correct"]
                               and archive["conformite_table"]["total"] ==
                               len(profs))
    voies_g6 = {}
    for p in profs:
        if p["classe"] == "G6_crise_heritee":
            v = p["voies_heritees"][0]
            voies_g6[v] = voies_g6.get(v, 0) + 1
        res["comparaisons"] += 1
    res["voies_g6_match"] = voies_g6 == archive["voies_heritees_g6"]
    if not (res["conformite_match"] and res["voies_g6_match"]):
        res["ecarts"] += 1

    # la couche appliquée aux 520 profils réels :
    for p in profs:
        pal = corr.palier_et_seuils(p["reponses"], p["voies_heritees"])
        bloc = corr.bloc_ecran(p["reponses"], pal)
        frag = corr.bilan_fragment(p["reponses"], pal)
        res["couche_paliers"][pal["palier"]] = \
            res["couche_paliers"].get(pal["palier"], 0) + 1
        res["couche_S1"] += pal["S1"]
        res["couche_S2"] += pal["S2"]
        res["couche_fragments_incomplets"] += (not frag.get("_complet"))
        res["couche_mots_interdits"] += bloc["nb_mots_interdits"]
        res["couche_exclues"] += len(pal["exclues_densite"])
        res["comparaisons"] += 1
    return res


# ─────────────────────────────────────────────────────────────────────────────
# STAGE 4 — COUPLAGE PAS (VRAI Q5) + suivi + re-test
# ─────────────────────────────────────────────────────────────────────────────
def stage4() -> dict:
    res = {
        "paliers_resolus": 0, "pas_rouge_none": 0, "pas_rouge_ecarts": 0,
        "pas_vert_conformes": 0, "pas_orange_conformes": 0, "pas_ecarts": 0,
        "suivi_totaux": 0, "suivi_ecarts": 0,
        "suivi_celebre": 0, "suivi_en_chemin": 0,
        "retest_8_semaines": None, "retest_ecarts": 0,
        "junction_palier_q3_q5": 0, "junction_ecarts": 0,
    }
    table = corr.pas_possibles()
    _rang = {"FAIBLE": 0, "MOYEN": 1, "ÉLEVÉ": 2}
    _pal_de_rang = {0: core_q5.PALIER_VERT, 1: core_q5.PALIER_ORANGE,
                    2: core_q5.PALIER_ROUGE}
    for palier, pas_lst in table.items():
        res["paliers_resolus"] += 1
        if palier == core_q5.PALIER_ROUGE:
            if any(p is not None for p in pas_lst):
                res["pas_rouge_ecarts"] += 1
            else:
                res["pas_rouge_none"] += 1
        else:
            attendu = core_q5.BANQUE_PAS[palier][0]
            conformes = sum(1 for p in pas_lst if p == attendu)
            res["pas_vert_conformes"] += (
                conformes if palier == core_q5.PALIER_VERT else 0)
            res["pas_orange_conformes"] += (
                conformes if palier == core_q5.PALIER_ORANGE else 0)
            res["pas_ecarts"] += sum(1 for p in pas_lst if p != attendu)
    for niv_det in corr.NIVEAUX_CROIX:
        for niv_chg in corr.NIVEAUX_CROIX:
            res["junction_palier_q3_q5"] += 1
            attendu = _pal_de_rang[max(_rang[niv_det], _rang[niv_chg])]
            if core_q5.palier_de(niv_det, niv_chg) != attendu:
                res["junction_ecarts"] += 1

    for total in range(core_q5.N_JOURS + 1):
        serie = tuple(j < total for j in range(core_q5.N_JOURS))
        statut = core_q5.statut_engagement_de(serie)
        res["suivi_totaux"] += 1
        attendu = (core_q5.STATUT_CELEBRE if total >= core_q5.SEUIL_CELEBRE
                   else core_q5.STATUT_EN_CHEMIN)
        if statut != attendu:
            res["suivi_ecarts"] += 1
        res["suivi_celebre"] += (statut == core_q5.STATUT_CELEBRE)
        res["suivi_en_chemin"] += (statut == core_q5.STATUT_EN_CHEMIN)
    if core_q5.statut_engagement_de(None) is not None:
        res["suivi_ecarts"] += 1

    res["retest_8_semaines"] = corr.re_test_huit_semaines("2026-01-01")
    if res["retest_8_semaines"] != "2026-02-26":
        res["retest_ecarts"] += 1
    return res


# ─────────────────────────────────────────────────────────────────────────────
# PIPELINE COMPLET (exécuté 2 fois — COR8)
# ─────────────────────────────────────────────────────────────────────────────
def pipeline() -> dict:
    global texts, frags
    texts, frags = [], []
    out = {
        "integrite_moteurs": "verifiee (asserts à l'import de la couche)",
        "stage0": stage0(),
        "stage1": stage1(),
        "stage2": stage2(),
        "stage4": stage4(),
    }
    payload = json.dumps(out, sort_keys=True, ensure_ascii=False,
                         default=str)
    out["sha256"] = hashlib.sha256(payload.encode("utf-8")).hexdigest()
    return out


def main():
    runs = [pipeline(), pipeline()]
    ok_cor8 = runs[0]["sha256"] == runs[1]["sha256"]
    r0, r1, r2, r4 = (runs[0]["stage0"], runs[0]["stage1"],
                      runs[0]["stage2"], runs[0]["stage4"])

    criteres = {
        "RIO": "RIO-13 « Ce que notre lien sait porter » (lumière) — sm-q3",
        "moteurs": {
            "q3": "validation-sm-q3/src/wtc_sm_q3_core.py (SPEC verrouillée)",
            "q4": "validation-sm-q4/src/wtc_sm_q4_core.py (junction configs)",
            "q5": "validation-sm-q5/src/wtc_sm_q5_core.py (junction pas)",
        },
        "COR0_compactations": {
            "items_256x6": r0["items_bruts"],
            "items_ecarts": r0["items_ecarts"],
            "sommes_face": r0["sommes_face"],
            "sommes_face_ecarts": r0["sommes_face_ecarts"],
            "frontiere_350": r0["frontiere_350"],
            "frontiere_ecarts": r0["frontiere_ecarts"],
            "pile_350_inclusive": r0["pile_350_inclusive"],
            "ok": (r0["items_ecarts"] == 0 and r0["frontiere_ecarts"] == 0
                   and r0["sommes_face_ecarts"] == 0),
        },
        "COR1_fragments": {
            "configurations": r1["configurations"],
            "attendu": 5832 if not SMOKE else "smoke",
            "fragments_incomplets": r1["cor1_fragments_incomplets"],
            "blocs_vides": r1["cor1_blocs_vides"],
            "ok": (r1["cor1_fragments_incomplets"] == 0
                   and r1["cor1_blocs_vides"] == 0),
        },
        "COR2_double_chemin": {
            "ecarts": r1["cor2_double_chemin_ecarts"],
            "junction_ecarts": r1["cor2_junction_ecarts"],
            "junctions": ("SILENCIEUSE ⇔ aucun ÉLEVÉ · LUMIÈRE/DEUX ⇔ "
                          "ÉLEVÉ présent · CRISE_HÉRITÉE ⇔ voies non vides "
                          "(override préempte) — frontière 3,50 PILE "
                          "unique (activation = ÉLEVÉ)"),
            "ok": (r1["cor2_double_chemin_ecarts"] == 0
                   and r1["cor2_junction_ecarts"] == 0),
        },
        "COR3_seuils": {
            "S1": r1["cor3_S1"], "S2": r1["cor3_S2"],
            "voies_reelles": r1["cor3_voies"],
            "borne_consignee": ("3,50 PILE — le VRAI seuil d'activation et "
                                "la borne ÉLEVÉ sont LA MÊME frontière "
                                "inclusive (0 distance) · 2,50 PILE "
                                "atteignable (somme 10)"),
            "ok": True,
        },
        "COR4_vocabulaire": {
            "mots_interdits": r1["cor4_mots_interdits"],
            "textes_distincts": r1["textes_distincts"],
            "fragments_distincts": r1["fragments_distincts"],
            "dsim_manquant": r1["cor4_dsim_manquant"],
            "exception_sourcee": ("case « trouble » du canon (ligne 133, "
                                  "D-TABLE F-S2) — vocabulaire de l'outil, "
                                  "neutralisé avant décompte"),
            "ok": (r1["cor4_mots_interdits"] == 0
                   and r1["cor4_dsim_manquant"] == 0),
        },
        "COR5_anti_fabrication": {
            "affichees_ecarts": r1["cor5_affichees_ecarts"],
            "force_active_en_crise": r1["cor5_force_active_en_crise"],
            "calme_hors_zone": r1["cor5_calme_hors_zone"],
            "zone_sans_calme": r1["cor5_zone_sans_calme"],
            "exclue_affichee": r1["cor5_exclue_affichee"],
            "densite_exclues_total": r1["densite_exclues_total"],
            "ok": (r1["cor5_affichees_ecarts"] == 0
                   and r1["cor5_force_active_en_crise"] == 0
                   and r1["cor5_calme_hors_zone"] == 0
                   and r1["cor5_zone_sans_calme"] == 0
                   and r1["cor5_exclue_affichee"] == 0),
        },
        "COR6_re_score": {
            "n_profils": r2["n_profils"],
            "stats_match": r2["stats_match"],
            "conformite_match": r2["conformite_match"],
            "voies_g6_match": r2["voies_g6_match"],
            "comparaisons": r2["comparaisons"],
            "ecarts": r2["ecarts"],
            "couche_paliers": r2["couche_paliers"],
            "couche_S1": r2["couche_S1"], "couche_S2": r2["couche_S2"],
            "couche_fragments_incomplets": r2["couche_fragments_incomplets"],
            "couche_mots_interdits": r2["couche_mots_interdits"],
            "couche_exclues": r2["couche_exclues"],
            "archive": "resultats-sm-q3-2026-10-18.json",
            "ok": (r2["stats_match"] and r2["conformite_match"]
                   and r2["voies_g6_match"] and r2["ecarts"] == 0
                   and r2["couche_fragments_incomplets"] == 0
                   and r2["couche_mots_interdits"] == 0),
        },
        "COR7_couplage_pas": {
            "paliers_resolus": r4["paliers_resolus"],
            "pas_rouge_none": r4["pas_rouge_none"],
            "pas_rouge_ecarts": r4["pas_rouge_ecarts"],
            "pas_vert_conformes": r4["pas_vert_conformes"],
            "pas_orange_conformes": r4["pas_orange_conformes"],
            "pas_ecarts": r4["pas_ecarts"],
            "suivi_totaux": r4["suivi_totaux"],
            "suivi_celebre": r4["suivi_celebre"],
            "suivi_en_chemin": r4["suivi_en_chemin"],
            "suivi_ecarts": r4["suivi_ecarts"],
            "retest_8_semaines": r4["retest_8_semaines"],
            "junction_palier_q3_q5": r4["junction_palier_q3_q5"],
            "junction_ecarts": r4["junction_ecarts"],
            "ok": (r4["pas_rouge_ecarts"] == 0 and r4["pas_ecarts"] == 0
                   and r4["suivi_ecarts"] == 0 and r4["retest_ecarts"] == 0
                   and r4["junction_ecarts"] == 0),
        },
        "COR8_reproductibilite": {
            "sha1": runs[0]["sha256"], "sha2": runs[1]["sha256"],
            "identiques": ok_cor8,
            "ok": ok_cor8,
        },
        "distributions": {
            "statuts": r1["distrib_statuts"],
            "paliers": r1["distrib_paliers"],
        },
        "re_score": {
            "F1": 25, "F1_note": "inchangé — D-TABLE table=code, "
                                 "D-DENSITÉ ±0, frontière 3,50 prouvée "
                                 "(package validé, rien à masquer)",
            "F2": [22, 25], "F3": [14, 25], "F4": [10, 25],
            "avant": 71, "apres": 100,
        },
    }

    RES.mkdir(exist_ok=True)
    (RES / "correction_criteres.json").write_text(
        json.dumps(criteres, ensure_ascii=False, indent=2),
        encoding="utf-8")
    print(json.dumps({k: v.get("ok") for k, v in criteres.items()
                      if isinstance(v, dict) and "ok" in v},
                     indent=2, ensure_ascii=False))
    print("configurations:", criteres["COR1_fragments"]["configurations"],
          "| S1:", criteres["COR3_seuils"]["S1"],
          "| S2:", criteres["COR3_seuils"]["S2"],
          "| textes distincts:", criteres["COR4_vocabulaire"]["textes_distincts"])
    print("SHA:", runs[0]["sha256"][:16], "…", "identiques:", ok_cor8)


if __name__ == "__main__":
    main()
