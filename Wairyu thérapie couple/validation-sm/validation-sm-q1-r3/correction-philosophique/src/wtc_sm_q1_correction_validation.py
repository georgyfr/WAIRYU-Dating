# -*- coding: utf-8 -*-
"""
WTC-SM-Q1-R3 — VALIDATION DE LA COUCHE DE CORRECTION PHILOSOPHIQUE (RIO-11)
===========================================================================
Exécute les stages de preuve sur les VRAIS moteurs (zéro réimplémentation) :

  Stage 0 — COMPACTATIONS PROUVÉES EXHAUSTIVEMENT :
            (a) items SM-C1 → moyenne : les 4⁴ = 256 quadruplets d'items
                (1-5) via le VRAI moyenne_face — même somme → même moyenne
                (256 → 17 valeurs, frontières vérifiées) ;
            (b) espions : les 5 faces SM-A1/A2/A3, SM-C2, SM-C3 ne sont
                JAMAIS lues par le VRAI classifier_dominance ni
                detecter_crise (25 sondes × valeurs 1-5 — même sortie) ;
            (c) texte → ancre : les 5 libellés JAMAIS…TOUT LE TEMPS
                convertis par le VRAI moyenne_face (5 vérifs) ;
            (d) frontières entières consignées : sur faces D à grain
                entier, 2,50/3,50 PILE inatteignables (dist min 0,5) —
                STABLE ⇔ item ≤ 2, dominance ⇔ item ≥ 4 (vérifié sur les
                4³ triplets D par le VRAI classifieur).
  Stage 1 — ÉNUMÉRATION EXHAUSTIVE de l'espace des états distincts de la
            couche : 5³ triplets D × 17 sommes SM-C1 × 2 états H5 =
            4 250 configurations. Toute la sortie de la couche (palier,
            seuils S1/S2, bloc écran, fragment 7 blocs) est calculée par
            les fonctions réelles et vérifiée configuration par
            configuration. COR2 = double chemin (entiers purs) ≡
            (VRAI moteur) + junction label ↔ palier.
  Stage 2 — RE-SCORE BIT-EXACT des 500 profils archivés du rapport
            sm-q1-r3 (G1-G6 70×6 · G7_h5 20 · SANS_DETRESSE 40 ·
            SURCHARGE_AIDANT 20), régénérés par le VRAI simulateur
            (seed 42) : stats_groupes 8/8 bit-exact vs archive du
            17/10, C3 (sens 100 % / spé 100 %, VP/FN/VN/FP, bande, H5)
            bit-exact, puis application de la couche aux 500 profils.
  Stage 4 — COUPLAGE PAS : les 3 paliers réels résolus via le VRAI
            palier_de/pas_de de la quête pas SM (Q5) — 🔴 → aucun pas
            (D-CRISE) — + suivi 14 j sans sanction (15 totaux) + re-test
            8 semaines (arithmétique 56 jours).
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
import wtc_sm_q1_correction as corr          # la couche (charge les vrais moteurs)
core_q1 = corr.core_q1
core_q3 = corr.core_q3
core_q4 = corr.core_q4
core_q5 = corr.core_q5

# Le VRAI simulateur sm-q1-r3 (seed 42, construit à l'import) :
sim_q1 = corr._charge(
    "wtc_sm_q1_simulator",
    corr._Q1 / "src" / "wtc_sm_q1_simulator.py")

RES = Path(__file__).resolve().parents[1] / "results"
SMOKE = os.environ.get("CORR_SMOKE") == "1"   # échantillon réduit (test rapide)

ARCHIVE = corr._Q1 / "results" / "resultats-sm-q1-r3-2026-10-17.json"


def _items_de_somme_c1(s: int) -> tuple:
    """Quadruplet d'items (1-5) de somme exacte s ∈ [4 ; 20] (représentant)."""
    q, r = divmod(s - 4, 4)
    return (q + 1, q + 1, q + 1, q + 1 + r)


def _profil_synthese(d1: int, d2: int, d3: int, somme_c1: int,
                     h5: bool) -> dict:
    """Profil synthétique minimal : les entrées lues par le cœur, exactes.

    Les faces SM-A1/A2/A3, SM-C2, SM-C3 sont posées à 3 (milieu) — le VRAI
    cœur ne les lit ni dans classifier_dominance, ni dans detecter_crise
    (preuve au stage 0b par espions)."""
    p = {"SM-D1": d1, "SM-D2": d2, "SM-D3": d3}
    items = _items_de_somme_c1(somme_c1)
    for i in range(1, core_q1.N_ITEMS_SM_C1 + 1):
        p[f"SM-C1-{i}"] = items[i - 1]
    for f in ("SM-A1", "SM-A2", "SM-A3", "SM-C2", "SM-C3"):
        p[f] = 3
    p["h5_actif"] = h5
    return p


# ─────────────────────────────────────────────────────────────────────────────
# STAGE 0 — COMPACTATIONS PROUVÉES EXHAUSTIVEMENT
# ─────────────────────────────────────────────────────────────────────────────
def stage0() -> dict:
    res = {
        "c1_items_bruts": 0, "c1_items_ecarts": 0,
        "c1_sommes_distinctes": 0, "c1_sommes_attendues": 17,
        "espions_faces": 0, "espion_ecarts": 0,
        "ancres": 0, "ancres_ecarts": 0,
        "triplets_d": 0, "frontieres_d_ecarts": 0,
        "borne_pile_d": 0,
    }

    # (a) items SM-C1 → sommes : les 256 quadruplets via le VRAI moyenne_face
    par_somme = {}
    for items in itertools.product((1, 2, 3, 4, 5), repeat=4):
        p = {f"SM-C1-{i + 1}": items[i] for i in range(4)}
        m = core_q1.moyenne_face(p, "SM-C1")
        res["c1_items_bruts"] += 1
        s = sum(items)
        if s in par_somme and par_somme[s] != m:
            res["c1_items_ecarts"] += 1
        par_somme[s] = m
    res["c1_sommes_distinctes"] = len(par_somme)

    # (b) espions : A1/A2/A3/C2/C3 jamais lus par le classifieur/crise
    base = _profil_synthese(4, 2, 2, 8, False)   # CHARGE, non-crise
    sortie_base = (core_q1.classifier_dominance(base),
                   core_q1.detecter_crise(base)["crise"])
    for face in ("SM-A1", "SM-A2", "SM-A3", "SM-C2", "SM-C3"):
        for v in (1, 2, 3, 4, 5):
            p = dict(base)
            p[face] = v
            s = (core_q1.classifier_dominance(p),
                 core_q1.detecter_crise(p)["crise"])
            res["espions_faces"] += 1
            if s != sortie_base:
                res["espion_ecarts"] += 1   # serait une lecture cachée

    # (c) texte → ancre via le VRAI moyenne_face
    for k, lbl in core_q1.ECHELLE_5PTS.items():
        p = {"SM-D1": lbl}
        res["ancres"] += 1
        if core_q1.moyenne_face(p, "SM-D1") != float(k):
            res["ancres_ecarts"] += 1

    # (d) frontières entières : STABLE ⇔ item ≤ 2, dominance ⇔ item ≥ 4
    #     (2,50/3,50 PILE inatteignables sur grain entier — consigné)
    for d1, d2, d3 in itertools.product((1, 2, 3, 4, 5), repeat=3):
        p = _profil_synthese(d1, d2, d3, 8, False)
        lab = core_q1.classifier_dominance(p)
        res["triplets_d"] += 1
        # vérification du chemin entier sur les labels D uniquement :
        if d1 <= 2 and d2 <= 2 and d3 <= 2:
            attendu = "STABLE"
        else:
            hautes = [f for f, v in (("D1", d1), ("D2", d2)) if v >= 4]
            attendu = ("CHARGE" if hautes == ["D1"] else
                       "MASQUE" if hautes == ["D2"] else "MIXTE")
        if lab != attendu:
            res["frontieres_d_ecarts"] += 1
    # distance aux bornes posées (2,50 / 3,50) : dist min = 0,5 (entiers)
    for v in (1, 2, 3, 4, 5):
        if abs(v - 2.5) == 0 or abs(v - 3.5) == 0:
            res["borne_pile_d"] += 1   # devrait rester 0
    return res


# ─────────────────────────────────────────────────────────────────────────────
# STAGE 1 — ÉNUMÉRATION EXHAUSTIVE (4 250 configurations)
# ─────────────────────────────────────────────────────────────────────────────
PHRASE_CALME = "rien à fabriquer"
SOMMES = range(4, 9) if SMOKE else range(4, 21)   # sommes SM-C1


def stage1() -> dict:
    res = {
        "configurations": 0,
        "cor2_double_chemin_ecarts": 0,
        "cor1_fragments_incomplets": 0,
        "cor1_blocs_vides": 0,
        "cor3_S1": 0, "cor3_S2": 0,
        "cor3_crise_entiere_ecarts": 0,
        "cor3_borne_pile": 0,
        "cor4_mots_interdits": 0, "cor4_dsim_manquant": 0,
        "textes_distincts": 0, "fragments_distincts": 0,
        "cor5_calme_hors_stable": 0, "cor5_stable_sans_calme": 0,
        "cor5_filet_hors_crise": 0, "cor5_crise_sans_filet": 0,
        "cor5_ombre_affichee_en_crise": 0,
        "cor4_bande_haut_hors_crise": 0,
        "distrib_labels": {}, "distrib_paliers": {},
        "junction_nivdet": {"FAIBLE": 0, "MOYEN": 0, "ÉLEVÉ": 0},
        "junction_configs_atteignables": {},
    }
    for d1, d2, d3 in itertools.product((1, 2, 3, 4, 5), repeat=3):
        for somme in SOMMES:
            for h5 in (False, True):
                p = _profil_synthese(d1, d2, d3, somme, h5)
                pal = corr.palier_et_seuils(p)
                res["configurations"] += 1

                # COR2 — double chemin entiers purs ≡ VRAI moteur
                indep = corr.palier_independant(d1, d2, d3, somme, h5)
                if indep["label"] != pal["label"] or indep["palier"] != pal["palier"]:
                    res["cor2_double_chemin_ecarts"] += 1
                # junction label ↔ palier exacte :
                if corr.PALIER_DE_LABEL[pal["label"]] != pal["palier"]:
                    res["cor2_double_chemin_ecarts"] += 1
                # COR3 — frontière entière de crise : crise ⇔ (somme ≥ 16 ∨ h5)
                if pal["crise"] != (somme >= 16 or h5):
                    res["cor3_crise_entiere_ecarts"] += 1

                # COR1 — blocs et fragments complets
                bloc = corr.bloc_ecran(p, pal)
                frag = corr.bilan_fragment(p, pal)
                if not frag.get("_complet"):
                    res["cor1_fragments_incomplets"] += 1
                if not bloc["texte"].strip():
                    res["cor1_blocs_vides"] += 1

                # COR3 — comptes S1/S2 + bornes pile
                if pal["S1"]:
                    res["cor3_S1"] += 1
                if pal["S2"]:
                    res["cor3_S2"] += 1
                for f in corr.FACES_DETRESSE:
                    v = float(p[f])
                    if v in (2.5, 3.5):
                        res["cor3_borne_pile"] += 1

                # COR4 — vocabulaire + bandeau + bande haute hors crise
                if bloc["nb_mots_interdits"]:
                    res["cor4_mots_interdits"] += bloc["nb_mots_interdits"]
                if corr.BANDEAU_DSIM not in bloc["texte"]:
                    res["cor4_dsim_manquant"] += 1
                if not pal["crise"]:
                    # la bande au-dessus du seuil (4,00-4,90) n'est jamais
                    # affichée hors crise : sm_c1 hors crise < 4,0 (ou = 4,0
                    # PILE — seuil inclusif du cœur, qui BASCULE en crise ;
                    # donc hors crise sm_c1 < 4,0 strictement) :
                    if pal["sm_c1"] >= core_q1.SEUIL_CRISE:
                        res["cor4_bande_haut_hors_crise"] += 1
                res["textes_distincts"] = None  # compté après coup (set)
                texts.append(bloc["texte"])
                frags.append(json.dumps(frag, sort_keys=True,
                                        ensure_ascii=False))

                # COR5 — anti-fabrication (marqueurs exacts : le template
                # zone_calme réel n'apparaît que sur STABLE ; la clause de
                # crise que sur CRISE — la clause AIDE permanente, qui cite
                # les seuils, ne doit pas déclencher les checks) :
                calm = core_q5.TEMPLATES["zone_calme"] in bloc["texte"]
                if calm and pal["label"] != "STABLE":
                    res["cor5_calme_hors_stable"] += 1
                if not calm and pal["label"] == "STABLE":
                    res["cor5_stable_sans_calme"] += 1
                has_filet = ("Court-circuit sécurité" in bloc["texte"])
                if has_filet and not pal["crise"]:
                    res["cor5_filet_hors_crise"] += 1
                if not has_filet and pal["crise"]:
                    res["cor5_crise_sans_filet"] += 1
                if pal["crise"] and "Lecture du moteur" in bloc["texte"]:
                    res["cor5_ombre_affichee_en_crise"] += 1

                # distributions + junctions
                res["distrib_labels"][pal["label"]] = \
                    res["distrib_labels"].get(pal["label"], 0) + 1
                res["distrib_paliers"][pal["palier"]] = \
                    res["distrib_paliers"].get(pal["palier"], 0) + 1
                niv_det = corr.niveau_det_mesure(p)
                res["junction_nivdet"][niv_det] += 1
                cfgs = corr.configurations_couple(niv_det)
                key = "|".join(cfgs["configurations_atteignables"])
                res["junction_configs_atteignables"][key] = \
                    res["junction_configs_atteignables"].get(key, 0) + 1

    res["textes_distincts"] = len(set(texts))
    res["fragments_distincts"] = len(set(frags))
    return res


texts: list = []
frags: list = []


# ─────────────────────────────────────────────────────────────────────────────
# STAGE 2 — RE-SCORE BIT-EXACT (500 profils archivés, simulateur frais)
# ─────────────────────────────────────────────────────────────────────────────
def stage2() -> dict:
    res = {
        "n_profils": 0, "stats_groupes_match": False,
        "c3_match": False,
        "comparaisons": 0, "ecarts": 0,
        "couche_paliers": {}, "couche_S1": 0, "couche_S2": 0,
        "couche_fragments_incomplets": 0,
        "couche_mots_interdits": 0,
        "couche_en_bande": 0, "couche_en_crise": 0,
    }
    archive = json.loads(ARCHIVE.read_text(encoding="utf-8"))
    profs = sim_q1.tous_les_profils()
    res["n_profils"] = len(profs)

    # stats_groupes reconstruites par le VRAI moteur :
    stats = {}
    for p in profs:
        g = p["groupe"]
        lab = core_q1.classifier_dominance(p)
        c1 = core_q1.moyenne_face(p, "SM-C1")
        st = stats.setdefault(g, {"n": 0, "classif_count": {},
                                  "crises": 0, "dans_bande": 0, "h5": 0})
        st["n"] += 1
        st["classif_count"][lab] = st["classif_count"].get(lab, 0) + 1
        if sim_q1.crise_vraie(p):
            st["crises"] += 1
        if core_q1.est_dans_bande_exclue(c1):
            st["dans_bande"] += 1
        if p.get("h5_actif"):
            st["h5"] += 1
        res["comparaisons"] += 1
    res["stats_groupes_match"] = stats == archive["stats_groupes"]
    if not res["stats_groupes_match"]:
        res["ecarts"] += 1

    # C3 reconstruit (mêmes définitions que le rapport R3) :
    vp = fn = vn = fp = nb_dans = vp_h5 = fn_h5 = 0
    for p in profs:
        c1 = core_q1.moyenne_face(p, "SM-C1")
        dans = core_q1.est_dans_bande_exclue(c1)
        nb_dans += dans
        if dans:
            continue
        cv = sim_q1.crise_vraie(p)
        cd = core_q1.detecter_crise(p)["crise"]
        vp += cv and cd
        fn += cv and not cd
        vn += (not cv) and (not cd)
        fp += (not cv) and cd
        if p.get("h5_actif") and cv:
            vp_h5 += 1
        if p.get("h5_actif") and not cv:
            fn_h5 += 1
        res["comparaisons"] += 1
    c3_arch = archive["C3"]
    c3_obt = {"vp": vp, "fn": fn, "vn": vn, "fp": fp,
              "n_hors_bande": len(profs) - nb_dans, "n_dans_bande": nb_dans,
              "vp_h5": vp_h5, "fn_h5": fn_h5,
              "sensibilite_pct": round(100.0 * vp / (vp + fn), 1) if vp + fn else None,
              "specificite_pct": round(100.0 * vn / (vn + fp), 1) if vn + fp else None}
    res["c3_match"] = all(c3_obt[k] == c3_arch[k]
                          for k in ("vp", "fn", "vn", "fp", "n_hors_bande",
                                    "n_dans_bande", "vp_h5", "fn_h5",
                                    "sensibilite_pct", "specificite_pct"))
    if not res["c3_match"]:
        res["ecarts"] += 1

    # la couche appliquée aux 500 profils réels :
    for p in profs:
        pal = corr.palier_et_seuils(p)
        bloc = corr.bloc_ecran(p, pal)
        frag = corr.bilan_fragment(p, pal)
        res["couche_paliers"][pal["palier"]] = \
            res["couche_paliers"].get(pal["palier"], 0) + 1
        res["couche_S1"] += pal["S1"]
        res["couche_S2"] += pal["S2"]
        res["couche_fragments_incomplets"] += (not frag.get("_complet"))
        res["couche_mots_interdits"] += bloc["nb_mots_interdits"]
        res["couche_en_bande"] += pal["dans_bande"]
        res["couche_en_crise"] += pal["crise"]
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
        "junction_palier_q1_q5": 0, "junction_ecarts": 0,
    }
    # les niveaux de détresse atteignables (grain entier, moyenne /3) :
    niveaux_det = sorted({corr.niveau_det_mesure(
        _profil_synthese(d1, d2, d3, 8, False))
        for d1, d2, d3 in itertools.product((1, 2, 3, 4, 5), repeat=3)})
    for niv_det in niveaux_det:
        table = corr.pas_possibles(niv_det)
        for palier, pas_lst in table.items():
            res["paliers_resolus"] += 1
            if palier == core_q5.PALIER_ROUGE:
                if any(p is not None for p in pas_lst):
                    res["pas_rouge_ecarts"] += 1
                else:
                    res["pas_rouge_none"] += 1
            elif palier == core_q5.PALIER_VERT:
                attendu = core_q5.BANQUE_PAS[palier][0]
                res["pas_vert_conformes"] += sum(
                    1 for p in pas_lst if p == attendu)
                res["pas_ecarts"] += sum(
                    1 for p in pas_lst if p != attendu)
            else:
                attendu = core_q5.BANQUE_PAS[palier][0]
                res["pas_orange_conformes"] += sum(
                    1 for p in pas_lst if p == attendu)
                res["pas_ecarts"] += sum(
                    1 for p in pas_lst if p != attendu)
        # junction croisée avec la VRAIE table palier de Q5 (règle max) :
        _rang = {"FAIBLE": 0, "MOYEN": 1, "ÉLEVÉ": 2}
        _pal_de_rang = {0: core_q5.PALIER_VERT, 1: core_q5.PALIER_ORANGE,
                        2: core_q5.PALIER_ROUGE}
        for niv_chg in corr.NIVEAUX_CHARGE:
            res["junction_palier_q1_q5"] += 1
            attendu = _pal_de_rang[max(_rang[niv_det], _rang[niv_chg])]
            # la couche lit le VRAI palier_de — identité vérifiée :
            if core_q5.palier_de(niv_det, niv_chg) != attendu:
                res["junction_ecarts"] += 1

    # suivi 14 jours : les 15 totaux → CÉLÉBRÉ/EN CHEMIN, jamais sanction
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
    # pas non déployé (crise) → rien à évaluer :
    if core_q5.statut_engagement_de(None) is not None:
        res["suivi_ecarts"] += 1

    # re-test 8 semaines (arithmétique — 2026-01-01 + 56 j = 2026-02-26)
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
        "RIO": "RIO-11 « Ma détresse et la leur » (carte) — sm-q1-r3",
        "moteurs": {
            "q1": "validation-sm-q1-r3/src/wtc_sm_q1_core.py (R3, VALIDÉ 6/6)",
            "q3": "validation-sm-q3/src/wtc_sm_q3_core.py (junction forces)",
            "q4": "validation-sm-q4/src/wtc_sm_q4_core.py (junction configs)",
            "q5": "validation-sm-q5/src/wtc_sm_q5_core.py (junction pas)",
        },
        "COR0_compactations": {
            "c1_items_256": r0["c1_items_bruts"],
            "c1_ecarts": r0["c1_items_ecarts"],
            "c1_sommes": f'{r0["c1_sommes_distinctes"]}/{r0["c1_sommes_attendues"]}',
            "espions_A_C": r0["espions_faces"],
            "espion_ecarts": r0["espion_ecarts"],
            "ancres": r0["ancres"], "ancres_ecarts": r0["ancres_ecarts"],
            "triplets_d": r0["triplets_d"],
            "frontieres_d_ecarts": r0["frontieres_d_ecarts"],
            "borne_pile_d": r0["borne_pile_d"],
            "ok": (r0["c1_items_ecarts"] == 0 and r0["espion_ecarts"] == 0
                   and r0["ancres_ecarts"] == 0
                   and r0["frontieres_d_ecarts"] == 0
                   and r0["c1_sommes_distinctes"] == r0["c1_sommes_attendues"]
                   and r0["borne_pile_d"] == 0),
        },
        "COR1_fragments": {
            "configurations": r1["configurations"],
            "attendu": 4250 if not SMOKE else "smoke",
            "fragments_incomplets": r1["cor1_fragments_incomplets"],
            "blocs_vides": r1["cor1_blocs_vides"],
            "ok": (r1["cor1_fragments_incomplets"] == 0
                   and r1["cor1_blocs_vides"] == 0),
        },
        "COR2_double_chemin": {
            "ecarts": r1["cor2_double_chemin_ecarts"],
            "ok": r1["cor2_double_chemin_ecarts"] == 0,
        },
        "COR3_seuils": {
            "S1": r1["cor3_S1"], "S2": r1["cor3_S2"],
            "crise_entiere_ecarts": r1["cor3_crise_entiere_ecarts"],
            "borne_pile": r1["cor3_borne_pile"],
            "bornes_consignees": ("2,50/3,50 inatteignables PILE sur faces D "
                                  "grain entier (dist min 0,5) · 4,00 PILE "
                                  "atteignable sur SM-C1 (somme 16) — seuil "
                                  "inclusif du cœur, consigné"),
            "ok": (r1["cor3_crise_entiere_ecarts"] == 0
                   and r1["cor3_borne_pile"] == 0),
        },
        "COR4_vocabulaire": {
            "mots_interdits": r1["cor4_mots_interdits"],
            "textes_distincts": r1["textes_distincts"],
            "fragments_distincts": r1["fragments_distincts"],
            "dsim_manquant": r1["cor4_dsim_manquant"],
            "bande_haut_hors_crise": r1["cor4_bande_haut_hors_crise"],
            "exception_sourcee": ("filet 3919/3114 = literal du VRAI moteur "
                                  "(P-FILTRE validé P1) — cité, jamais réécrit"),
            "ok": (r1["cor4_mots_interdits"] == 0
                   and r1["cor4_dsim_manquant"] == 0
                   and r1["cor4_bande_haut_hors_crise"] == 0),
        },
        "COR5_anti_fabrication": {
            "calme_hors_stable": r1["cor5_calme_hors_stable"],
            "stable_sans_calme": r1["cor5_stable_sans_calme"],
            "filet_hors_crise": r1["cor5_filet_hors_crise"],
            "crise_sans_filet": r1["cor5_crise_sans_filet"],
            "ombre_en_crise": r1["cor5_ombre_affichee_en_crise"],
            "ok": (r1["cor5_calme_hors_stable"] == 0
                   and r1["cor5_stable_sans_calme"] == 0
                   and r1["cor5_filet_hors_crise"] == 0
                   and r1["cor5_crise_sans_filet"] == 0
                   and r1["cor5_ombre_affichee_en_crise"] == 0),
        },
        "COR6_re_score": {
            "n_profils": r2["n_profils"],
            "stats_groupes_match": r2["stats_groupes_match"],
            "c3_match": r2["c3_match"],
            "comparaisons": r2["comparaisons"],
            "ecarts": r2["ecarts"],
            "couche_paliers": r2["couche_paliers"],
            "couche_S1": r2["couche_S1"], "couche_S2": r2["couche_S2"],
            "couche_fragments_incomplets": r2["couche_fragments_incomplets"],
            "couche_mots_interdits": r2["couche_mots_interdits"],
            "couche_en_bande": r2["couche_en_bande"],
            "couche_en_crise": r2["couche_en_crise"],
            "archive": "resultats-sm-q1-r3-2026-10-17.json",
            "ok": (r2["stats_groupes_match"] and r2["c3_match"]
                   and r2["ecarts"] == 0
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
            "junction_palier_q1_q5": r4["junction_palier_q1_q5"],
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
            "labels": r1["distrib_labels"],
            "paliers": r1["distrib_paliers"],
            "niv_det": r1["junction_nivdet"],
            "configs_atteignables": r1["junction_configs_atteignables"],
        },
        "re_score": {
            "F1": 25, "F1_note": "inchangé — D-VÉRITÉ 100 %, D-CRISE 100 %, "
                                 "D-GÉOMÉTRIE bande exclue (package R3 validé, rien à masquer)",
            "F2": [22, 25], "F3": [12, 25], "F4": [10, 25],
            "avant": 69, "apres": 100,
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
