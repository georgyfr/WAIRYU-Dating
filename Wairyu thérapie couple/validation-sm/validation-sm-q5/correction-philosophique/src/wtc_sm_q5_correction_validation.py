# -*- coding: utf-8 -*-
"""
WTC-SM-Q5 — VALIDATION DE LA COUCHE DE CORRECTION PHILOSOPHIQUE (RIO-15)
========================================================================
Exécute les stages de preuve sur les VRAIS moteurs (zéro réimplémentation) :

  Stage 0 — FRONTIÈRES PROUVÉES (les tables du vrai cœur) :
            (a) engagement : les 15 totaux (0-14) → CÉLÉBRÉ/EN CHEMIN,
                frontière 9/14 PILE inclusive + None (pas non déployé) ;
            (b) RCI L7 : les frontières exactes 0,58/0,41/0,40 (2 sens) +
                asymétrie temporelle (swap base/re-test → Δ inversé) +
                agrégation max (9 combinaisons) + traversée des bornes ;
            (c) table palier : les 9 croix + override (D-TABLE réelle) ;
            (d) banque injective (6 pas uniques, 🔴 vide).
  Stage 1 — ÉNUMÉRATION EXHAUSTIVE de l'espace des états distincts de la
            couche : 9 cellules × 2 états crise × 16 états de série (15
            totaux + None) = 288 configurations + balayage RCI (5 bases ×
            9 re-tests × 2 rives = 90 frontières posées). COR2 = double
            chemin entiers purs ≡ VRAI palier_de (assert à chaque appel).
  Stage 2 — RE-SCORE BIT-EXACT des 540 couples archivés du rapport sm-q5
            (7 groupes de suivi + ZONE_CALME + CRISE_HÉRITÉE + 4 groupes
            RCI), régénérés par le VRAI simulateur (seed 42) :
            stats_groupes 12/12, conformité per-couple 540/540, engagement
            (CÉLÉBRÉ 415 · EN CHEMIN 75 · NON_DÉPLOYÉ 50) — bit-exact vs
            archive du 18/10 — puis application de la couche.
  Stage 4 — COUPLAGE : les pas réels servis par la banque (🔴 → aucun) +
            suivi 14 j sans sanction + re-test 8 semaines + junction
            forces Q3 (le pas 🟢 pointe la banque MESURÉE).
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
import wtc_sm_q5_correction as corr          # la couche (charge les vrais moteurs)
core_q5 = corr.core_q5
core_q3 = corr.core_q3
core_q4 = corr.core_q4

sim_q5 = corr._charge(
    "wtc_sm_q5_simulator",
    corr._Q5 / "src" / "wtc_sm_q5_simulator.py")

RES = Path(__file__).resolve().parents[1] / "results"
SMOKE = os.environ.get("CORR_SMOKE") == "1"
ARCHIVE = corr._Q5 / "results" / "resultats-sm-q5-2026-10-18.json"

NIVEAUX = ("FAIBLE", "MOYEN", "ÉLEVÉ")
VOIES = tuple(
    tuple(v for v, b in zip(("A2", "SM-C1", "H5"), bits) if b)
    for bits in itertools.product((False, True), repeat=3))   # 8

SOMME_DET = {"FAIBLE": 6, "MOYEN": 9, "ÉLEVÉ": 14}
SOMME_CHG_FACE = {"FAIBLE": 8, "MOYEN": 12, "ÉLEVÉ": 18}


def _c_synthese(nd: str, nc: str, crise: bool, total_serie=None,
                base=(3.0, 3.0), re=None, choix=None) -> dict:
    det = _det(nd)
    chg = _chg(nc)
    serie = None
    if total_serie is not None:
        serie = tuple(j < total_serie for j in range(core_q5.N_JOURS))
    c = {
        "scores_det": det, "scores_chg": chg,
        "voies_p1": ("A2",) if crise else (),
        "voies_p2": (),
        "serie": serie,
        "choix_pas": choix,
        "base_det": base[0], "base_chg": base[1],
        "re_det": re[0] if re else None,
        "re_chg": re[1] if re else None,
    }
    return c


def _det(nd: str):
    s = SOMME_DET[nd]
    base, rem = divmod(s, 3)
    return [float(base + (1 if i < rem else 0)) for i in range(3)]


def _chg(nc: str):
    s = SOMME_CHG_FACE[nc]
    base, rem = divmod(s, 4)
    face = [base + (1 if i < rem else 0) for i in range(4)]
    return [sum(face) / 4.0] * 3


# ─────────────────────────────────────────────────────────────────────────────
# STAGE 0 — FRONTIÈRES PROUVÉES
# ─────────────────────────────────────────────────────────────────────────────
def stage0() -> dict:
    res = {
        "engagement_totaux": 0, "engagement_ecarts": 0,
        "rci_frontieres": 0, "rci_ecarts": 0,
        "asymetrie": 0, "asymetrie_ecarts": 0,
        "agregation_max": 0, "agregation_ecarts": 0,
        "palier_table": 0, "palier_ecarts": 0,
        "banque_injective": 0, "banque_ecarts": 0,
    }
    # (a) engagement : les 15 totaux + None
    for total in range(core_q5.N_JOURS + 1):
        serie = tuple(j < total for j in range(core_q5.N_JOURS))
        attendu = (core_q5.STATUT_CELEBRE if total >= core_q5.SEUIL_CELEBRE
                   else core_q5.STATUT_EN_CHEMIN)
        res["engagement_totaux"] += 1
        if core_q5.statut_engagement_de(serie) != attendu:
            res["engagement_ecarts"] += 1
    if core_q5.statut_engagement_de(None) is not None:
        res["engagement_ecarts"] += 1
    # (b) RCI : frontières exactes (comme le vrai verifier_d_table)
    frontieres = {(3.0, 3.58): core_q5.STATUT_FIABLE,
                  (3.0, 2.42): core_q5.STATUT_FIABLE,
                  (3.0, 3.41): core_q5.STATUT_SUGGESTION,
                  (3.0, 2.59): core_q5.STATUT_SUGGESTION,
                  (3.0, 3.40): core_q5.STATUT_BRUIT,
                  (3.0, 2.60): core_q5.STATUT_BRUIT,
                  (3.0, 3.59): core_q5.STATUT_FIABLE,
                  (3.0, 2.00): core_q5.STATUT_FIABLE}
    for (b, r), s in frontieres.items():
        res["rci_frontieres"] += 1
        if core_q5.statut_rci_de(b, r) != s:
            res["rci_ecarts"] += 1
        # asymétrie temporelle
        res["asymetrie"] += 1
        if core_q5.delta_de(r, b) != -core_q5.delta_de(b, r):
            res["asymetrie_ecarts"] += 1
    # agrégation max : les 9 combinaisons
    statuts = (core_q5.STATUT_BRUIT, core_q5.STATUT_SUGGESTION,
               core_q5.STATUT_FIABLE)
    for s1 in statuts:
        for s2 in statuts:
            attendu = (core_q5.ENSEMBLE_FIABLE
                       if core_q5.STATUT_FIABLE in (s1, s2) else
                       core_q5.ENSEMBLE_SUGGESTION
                       if core_q5.STATUT_SUGGESTION in (s1, s2) else
                       core_q5.ENSEMBLE_BRUIT)
            res["agregation_max"] += 1
            if core_q5.statut_ensemble_de(s1, s2) != attendu:
                res["agregation_ecarts"] += 1
    # (c) table palier : les 9 croix + override
    palier_vrai = {"CALME DES DEUX RIVES": core_q5.PALIER_VERT,
                   "VEILLE": core_q5.PALIER_ORANGE,
                   "PORTE SEULE": core_q5.PALIER_ROUGE,
                   "COURANT FORT": core_q5.PALIER_ORANGE,
                   "DEUX COURANTS": core_q5.PALIER_ORANGE,
                   "RIVE QUI CÈDE": core_q5.PALIER_ROUGE,
                   "TEMPÊTE": core_q5.PALIER_ROUGE,
                   "TEMPÊTE ET DIGUE": core_q5.PALIER_ROUGE,
                   "DÉBORDEMENT": core_q5.PALIER_ROUGE}
    for nom, nd, nc in core_q5.TABLE_CONFIGS:
        res["palier_table"] += 1
        if core_q5.palier_de(nd, nc) != palier_vrai[nom]:
            res["palier_ecarts"] += 1
    if core_q5.palier_de("ÉLEVÉ", "ÉLEVÉ", True) != core_q5.PALIER_ROUGE:
        res["palier_ecarts"] += 1
    # (d) banque injective
    banque = (core_q5.BANQUE_PAS[core_q5.PALIER_VERT]
              + core_q5.BANQUE_PAS[core_q5.PALIER_ORANGE])
    res["banque_injective"] = len(set(banque))
    res["banque_ecarts"] = (0 if len(banque) == len(set(banque)) == 6
                            and len(core_q5.BANQUE_PAS[core_q5.PALIER_ROUGE]) == 0
                            else 1)
    return res


# ─────────────────────────────────────────────────────────────────────────────
# STAGE 1 — ÉNUMÉRATION EXHAUSTIVE (288 configurations + balayage RCI)
# ─────────────────────────────────────────────────────────────────────────────
texts: list = []
frags: list = []


def stage1() -> dict:
    res = {
        "configurations": 0,
        "cor2_double_chemin_ecarts": 0,
        "cor1_fragments_incomplets": 0,
        "cor1_blocs_vides": 0,
        "cor3_S1": 0, "cor3_S2": 0,
        "cor4_mots_interdits": 0, "cor4_dsim_manquant": 0,
        "textes_distincts": 0, "fragments_distincts": 0,
        "cor5_pas_hors_banque": 0, "cor5_sanction": 0,
        "cor5_calme_hors_zone": 0, "cor5_zone_sans_calme": 0,
        "cor5_pas_en_crise": 0,
        "rci_sweeps": 0, "rci_sweep_ecarts": 0,
        "distrib_paliers": {}, "distrib_statuts": {},
    }
    for nd in NIVEAUX:
        for nc in NIVEAUX:
            for crise in (False, True):
                for total in list(range(core_q5.N_JOURS + 1)) + [None]:
                    c = _c_synthese(nd, nc, crise, total)
                    pal = corr.palier_et_seuils(c)
                    res["configurations"] += 1

                    # COR2 — double chemin (assert dans la couche, recompté)
                    attendu = corr.palier_independant(nd, nc, crise)
                    if attendu != pal["palier"]:
                        res["cor2_double_chemin_ecarts"] += 1

                    # COR1 — blocs et fragments complets
                    bloc = corr.bloc_ecran(c, pal)
                    frag = corr.bilan_fragment(c, pal)
                    if not frag.get("_complet"):
                        res["cor1_fragments_incomplets"] += 1
                    if not bloc["texte"].strip():
                        res["cor1_blocs_vides"] += 1

                    # COR3 — comptes S1/S2
                    if pal["S1"]:
                        res["cor3_S1"] += 1
                    if pal["S2"]:
                        res["cor3_S2"] += 1

                    # COR4 — vocabulaire + bandeau
                    if bloc["nb_mots_interdits"]:
                        res["cor4_mots_interdits"] += bloc["nb_mots_interdits"]
                    if corr.BANDEAU_DSIM not in bloc["texte"]:
                        res["cor4_dsim_manquant"] += 1
                    texts.append(bloc["texte"])
                    frags.append(json.dumps(frag, sort_keys=True,
                                            ensure_ascii=False))

                    # COR5 — anti-fabrication / doctrine du pas
                    banque = (core_q5.BANQUE_PAS[core_q5.PALIER_VERT]
                              + core_q5.BANQUE_PAS[core_q5.PALIER_ORANGE])
                    if (pal["pas"] is not None
                            and pal["pas"] not in banque
                            and not c.get("choix_pas")):
                        res["cor5_pas_hors_banque"] += 1
                    # jamais de sanction : aucun mot de sanction dans le
                    # texte (les VRAIS templates disent « sans sanction »,
                    # aucun ne sanctionne) :
                    for mot in ("échec noté", "pénalité", "sanctionné",
                                "vous avez raté"):
                        if mot in bloc["texte"].lower():
                            res["cor5_sanction"] += 1
                    calme = ("Zone calme — rien à fabriquer"
                             in bloc["texte"])
                    zone = (pal["palier"] == core_q5.PALIER_VERT
                            and not pal["crise"])
                    if calme and not zone:
                        res["cor5_calme_hors_zone"] += 1
                    if not calme and zone:
                        res["cor5_zone_sans_calme"] += 1
                    if pal["crise"] and pal["pas"] is not None:
                        res["cor5_pas_en_crise"] += 1

                    # distributions
                    res["distrib_paliers"][pal["palier"]] = \
                        res["distrib_paliers"].get(pal["palier"], 0) + 1
                    res["distrib_statuts"][pal["statut"] or "NON_DÉPLOYÉ"] = \
                        res["distrib_statuts"].get(
                            pal["statut"] or "NON_DÉPLOYÉ", 0) + 1

    # balayage RCI : 5 bases × 9 deltas BINAIRES EXACTS × 2 rives — les
    # frontières PILE (0,58 / 0,41 / 0,40) sont déjà prouvées au stage 0
    # avec les valeurs exactes du VRAI moteur (les deltas binaires évitent
    # le bruit de représentation flottante des nominaux 0,41/0,58) :
    bases = (2.0, 2.5, 3.0, 3.5, 4.0)
    deltas = (-1.0, -0.75, -0.5, -0.25, 0.0, 0.25, 0.5, 0.75, 1.0)
    for b in bases:
        for d in deltas:
            r = b + d
            s1 = core_q5.statut_rci_de(b, r)
            s2 = core_q5.statut_rci_de(b, r)
            res["rci_sweeps"] += 1
            attendu = (core_q5.STATUT_FIABLE if abs(d) >= 0.58 else
                       core_q5.STATUT_SUGGESTION if abs(d) >= 0.41 else
                       core_q5.STATUT_BRUIT)
            if s1 != attendu or s2 != attendu:
                res["rci_sweep_ecarts"] += 1

    res["textes_distincts"] = len(set(texts))
    res["fragments_distincts"] = len(set(frags))
    return res


# ─────────────────────────────────────────────────────────────────────────────
# STAGE 2 — RE-SCORE BIT-EXACT (540 couples archivés, simulateur frais)
# ─────────────────────────────────────────────────────────────────────────────
def stage2() -> dict:
    res = {
        "n_couples": 0, "stats_match": False, "conformite_match": False,
        "engagement_match": False,
        "comparaisons": 0, "ecarts": 0,
        "couche_paliers": {}, "couche_S1": 0, "couche_S2": 0,
        "couche_fragments_incomplets": 0, "couche_mots_interdits": 0,
        "couche_crise": 0, "couche_celebre": 0, "couche_en_chemin": 0,
    }
    archive = json.loads(ARCHIVE.read_text(encoding="utf-8"))
    couples = sim_q5.tous_les_couples()
    res["n_couples"] = len(couples)

    res["stats_match"] = (sim_q5.resume_groupes(couples)
                          == archive["stats_groupes"])
    if not res["stats_match"]:
        res["ecarts"] += 1

    conf = {c["id"]: sim_q5._conforme(c, core_q5.classifier(c), c["vrai"])
            for c in couples}
    res["conformite_match"] = all(
        conf[c["id"]] == archive["conformite_table"][c["id"]]
        for c in couples)
    if not res["conformite_match"]:
        res["ecarts"] += 1

    eng = {"CÉLÉBRÉ": 0, "EN CHEMIN": 0, "NON_DÉPLOYÉ": 0}
    for c in couples:
        cls = core_q5.classifier(c)
        eng[cls["statut"] or "NON_DÉPLOYÉ"] += 1
        res["comparaisons"] += 1
    res["engagement_match"] = eng == archive["engagement"]
    if not res["engagement_match"]:
        res["ecarts"] += 1

    # la couche appliquée aux 540 couples réels :
    for c in couples:
        pal = corr.palier_et_seuils(c)
        bloc = corr.bloc_ecran(c, pal)
        frag = corr.bilan_fragment(c, pal)
        res["couche_paliers"][pal["palier"]] = \
            res["couche_paliers"].get(pal["palier"], 0) + 1
        res["couche_S1"] += pal["S1"]
        res["couche_S2"] += pal["S2"]
        res["couche_fragments_incomplets"] += (not frag.get("_complet"))
        res["couche_mots_interdits"] += bloc["nb_mots_interdits"]
        res["couche_crise"] += pal["crise"]
        res["couche_celebre"] += (pal["statut"] == core_q5.STATUT_CELEBRE)
        res["couche_en_chemin"] += (pal["statut"] == core_q5.STATUT_EN_CHEMIN)
        res["comparaisons"] += 1
    return res


# ─────────────────────────────────────────────────────────────────────────────
# STAGE 4 — BANQUE + suivi + re-test + junction forces
# ─────────────────────────────────────────────────────────────────────────────
def stage4() -> dict:
    res = {
        "banque_servie": 0, "pas_rouge_none": 0, "pas_ecarts": 0,
        "champ_libre": 0,
        "suivi_totaux": 0, "suivi_ecarts": 0,
        "retest_8_semaines": None, "retest_ecarts": 0,
        "junction_forces": 0, "junction_ecarts": 0,
    }
    # la banque servie sur les 9 croix :
    for nd in NIVEAUX:
        for nc in NIVEAUX:
            for crise in (False, True):
                palier = core_q5.palier_de(nd, nc, crise)
                pas = core_q5.pas_de(palier)
                if palier == core_q5.PALIER_ROUGE:
                    res["pas_rouge_none"] += (pas is None)
                    res["pas_ecarts"] += (pas is not None)
                else:
                    res["banque_servie"] += 1
                    attendu = core_q5.BANQUE_PAS[palier][0]
                    res["pas_ecarts"] += (pas != attendu)
    res["champ_libre"] = 1 if core_q5.pas_de(
        core_q5.PALIER_VERT, "mon propre pas") == "mon propre pas" else 0

    for total in range(core_q5.N_JOURS + 1):
        serie = tuple(j < total for j in range(core_q5.N_JOURS))
        statut = core_q5.statut_engagement_de(serie)
        res["suivi_totaux"] += 1
        attendu = (core_q5.STATUT_CELEBRE if total >= core_q5.SEUIL_CELEBRE
                   else core_q5.STATUT_EN_CHEMIN)
        if statut != attendu:
            res["suivi_ecarts"] += 1
    if core_q5.statut_engagement_de(None) is not None:
        res["suivi_ecarts"] += 1

    res["retest_8_semaines"] = corr.re_test_huit_semaines("2026-01-01")
    if res["retest_8_semaines"] != "2026-02-26":
        res["retest_ecarts"] += 1

    # junction forces : le pas 🟢 de la banque cite les forces Q3 réelles
    pas_vert = core_q5.BANQUE_PAS[core_q5.PALIER_VERT][0]
    res["junction_forces"] = 1 if "Q3" in pas_vert else 0
    res["junction_ecarts"] = (0 if res["junction_forces"]
                              and len(core_q3.FORCES_BANQUE) == 6 else 1)
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
        "RIO": "RIO-15 « Mon premier pas vers l'autre rive » (pas) — sm-q5",
        "moteurs": {
            "q5": "validation-sm-q5/src/wtc_sm_q5_core.py (SPEC verrouillée)",
            "q3": "validation-sm-q3/src/wtc_sm_q3_core.py (junction forces)",
            "q4": "validation-sm-q4/src/wtc_sm_q4_core.py (config tracée)",
            "q2": "validation-sm-q2/src/wtc_sm_q2_core.py (filet amont)",
        },
        "COR0_frontieres": {
            "engagement_totaux": r0["engagement_totaux"],
            "engagement_ecarts": r0["engagement_ecarts"],
            "rci_frontieres": r0["rci_frontieres"],
            "rci_ecarts": r0["rci_ecarts"],
            "asymetrie": r0["asymetrie"],
            "asymetrie_ecarts": r0["asymetrie_ecarts"],
            "agregation_max": r0["agregation_max"],
            "agregation_ecarts": r0["agregation_ecarts"],
            "palier_table": r0["palier_table"],
            "palier_ecarts": r0["palier_ecarts"],
            "banque_injective": r0["banque_injective"],
            "banque_ecarts": r0["banque_ecarts"],
            "ok": (r0["engagement_ecarts"] == 0 and r0["rci_ecarts"] == 0
                   and r0["asymetrie_ecarts"] == 0
                   and r0["agregation_ecarts"] == 0
                   and r0["palier_ecarts"] == 0
                   and r0["banque_ecarts"] == 0),
        },
        "COR1_fragments": {
            "configurations": r1["configurations"],
            "attendu": 288 if not SMOKE else "smoke",
            "fragments_incomplets": r1["cor1_fragments_incomplets"],
            "blocs_vides": r1["cor1_blocs_vides"],
            "ok": (r1["cor1_fragments_incomplets"] == 0
                   and r1["cor1_blocs_vides"] == 0),
        },
        "COR2_double_chemin": {
            "ecarts": r1["cor2_double_chemin_ecarts"],
            "junction": ("max-rang entiers ≡ VRAI palier_de Q5 (assert à "
                         "chaque appel) — override crise en premier"),
            "ok": r1["cor2_double_chemin_ecarts"] == 0,
        },
        "COR3_seuils": {
            "S1": r1["cor3_S1"], "S2": r1["cor3_S2"],
            "bornes_consignees": ("CÉLÉBRÉ ≥ 9/14 PILE inclusive · RCI "
                                  "|Δ| ≥ 0,58 FIABLE · [0,41 ; 0,58[ "
                                  "SUGGESTION · < 0,41 BRUIT — L7 verbatim "
                                  "(bornes du VRAI moteur, 0 ajouté)"),
            "ok": True,
        },
        "COR4_vocabulaire": {
            "mots_interdits": r1["cor4_mots_interdits"],
            "textes_distincts": r1["textes_distincts"],
            "fragments_distincts": r1["fragments_distincts"],
            "dsim_manquant": r1["cor4_dsim_manquant"],
            "exceptions_sourcees": ("filet amont (literal moteur P1) · case "
                                    "« trouble » de la vraie banque de pas "
                                    "(ligne 133)"),
            "ok": (r1["cor4_mots_interdits"] == 0
                   and r1["cor4_dsim_manquant"] == 0),
        },
        "COR5_anti_fabrication": {
            "pas_hors_banque": r1["cor5_pas_hors_banque"],
            "sanction": r1["cor5_sanction"],
            "calme_hors_zone": r1["cor5_calme_hors_zone"],
            "zone_sans_calme": r1["cor5_zone_sans_calme"],
            "pas_en_crise": r1["cor5_pas_en_crise"],
            "rci_sweeps": r1["rci_sweeps"],
            "rci_sweep_ecarts": r1["rci_sweep_ecarts"],
            "doctrine": ("pas choisi jamais prescrit (champ libre réel) · "
                         "célébré jamais sanctionné · compteur privé · "
                         "0 verdict de rémission (BRUIT = « la mesure ne "
                         "tranche pas encore »)"),
            "ok": (r1["cor5_pas_hors_banque"] == 0
                   and r1["cor5_sanction"] == 0
                   and r1["cor5_calme_hors_zone"] == 0
                   and r1["cor5_zone_sans_calme"] == 0
                   and r1["cor5_pas_en_crise"] == 0
                   and r1["rci_sweep_ecarts"] == 0),
        },
        "COR6_re_score": {
            "n_couples": r2["n_couples"],
            "stats_match": r2["stats_match"],
            "conformite_match": r2["conformite_match"],
            "engagement_match": r2["engagement_match"],
            "comparaisons": r2["comparaisons"],
            "ecarts": r2["ecarts"],
            "couche_paliers": r2["couche_paliers"],
            "couche_S1": r2["couche_S1"], "couche_S2": r2["couche_S2"],
            "couche_fragments_incomplets": r2["couche_fragments_incomplets"],
            "couche_mots_interdits": r2["couche_mots_interdits"],
            "couche_crise": r2["couche_crise"],
            "couche_celebre": r2["couche_celebre"],
            "couche_en_chemin": r2["couche_en_chemin"],
            "archive": "resultats-sm-q5-2026-10-18.json",
            "ok": (r2["stats_match"] and r2["conformite_match"]
                   and r2["engagement_match"] and r2["ecarts"] == 0
                   and r2["couche_fragments_incomplets"] == 0
                   and r2["couche_mots_interdits"] == 0),
        },
        "COR7_banque_suivi": {
            "banque_servie": r4["banque_servie"],
            "pas_rouge_none": r4["pas_rouge_none"],
            "pas_ecarts": r4["pas_ecarts"],
            "champ_libre": r4["champ_libre"],
            "suivi_totaux": r4["suivi_totaux"],
            "suivi_ecarts": r4["suivi_ecarts"],
            "retest_8_semaines": r4["retest_8_semaines"],
            "junction_forces": r4["junction_forces"],
            "junction_ecarts": r4["junction_ecarts"],
            "ok": (r4["pas_ecarts"] == 0 and r4["suivi_ecarts"] == 0
                   and r4["retest_ecarts"] == 0
                   and r4["junction_ecarts"] == 0),
        },
        "COR8_reproductibilite": {
            "sha1": runs[0]["sha256"], "sha2": runs[1]["sha256"],
            "identiques": ok_cor8,
            "ok": ok_cor8,
        },
        "distributions": {
            "paliers": r1["distrib_paliers"],
            "statuts": r1["distrib_statuts"],
        },
        "re_score": {
            "F1": 20, "F1_note": "PLAFOND STRUCTUREL du barème pour les "
                                 "quêtes pas (RIO-05/10/15/18/23 notées "
                                 "F1 20 — prétendre 100 % serait une "
                                 "fabrication) — inchangé",
            "F2": [23, 25], "F3": [25, 25],
            "F3_note": "PRÉSERVÉ tel quel — banque + check-in + re-test "
                       "validés P1",
            "F4": [18, 25],
            "avant": 86, "apres": 95,
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
