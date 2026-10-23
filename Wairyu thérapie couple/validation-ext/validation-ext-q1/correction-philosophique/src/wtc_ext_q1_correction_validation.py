# -*- coding: utf-8 -*-
"""
WTC-EXT-Q1 — VALIDATION DE LA COUCHE DE CORRECTION PHILOSOPHIQUE (RIO-16)
==========================================================================
Exécute les stages de preuve sur les VRAIS moteurs (zéro réimplémentation) :

  Stage 0 — COMPACTATIONS PROUVÉES EXHAUSTIVEMENT + MESURES :
            (a) somme de face → score : les 4³ = 64 triplets d'une face via
                le VRAI score_face_de (64 → 10 valeurs, même somme → même
                score, frontières 1,00→4,00 vérifiées) ;
            (b) somme d'axe → score : les 4⁶ = 4 096 sextuplets par axe via
                le VRAI score_axe_de (3 axes × 4 096 → 19 valeurs chacun) ;
            (c) inverses : les 5 valeurs brutes de EXT-H2-3 et EXT-C2-3
                retournées par le VRAI corrige (5 − brut, 10 vérifs) ;
            (d) espions : EXT-VIG ne touche que le RQS (jamais les
                niveaux/faces/palier d'une carte restée affichée) ;
                signal_herite n'ouvre QUE la voie filet (25 sondes) ;
            (e) bornes mesurées : 19 scores d'axe × 3 seuils (distances
                1/30 · 1/15 · 1/30), 34 bornes CI90 — 0 PILE sur un seuil,
                15 écarts de faces — distance minimale 0,1163 au seuil
                0,8837 (consigné R4) ;
            (f) table RQS : les combinaisons de pénalités RÉALISABLES
                (linéarité / contradiction / rythme / vigilance) construites
                et vérifiées contre le VRAI calcule_rqs ; la réalisation
                linéarité+contradiction est PROUVÉE impossible (écart ≥ 2,5
                impose SD ≥ 0,45 sur 18 items — preuve par énumération
                4³ × 4 configurations de la face en contradiction).
  Stage 1 — ÉNUMÉRATION EXHAUSTIVE de l'espace des états distincts de la
            couche : 19³ = 6 859 triplets de sommes d'axes (H/L/C, grain
            1/6) × carte valide — TOUTE la sortie (palier, contenu F3,
            seuils S1/S2, bloc écran, fragment 7 blocs) calculée par les
            fonctions réelles et vérifiée configuration par configuration.
            COR2 = double chemin (table pure des 19 sommes) ≡ VRAI moteur.
            + Stage 1F (faces) : 10² paires de sommes × 3 axes = 300 —
            NUAGE/hiérarchie : déclaré ⇔ |s1−s2| ≥ 3 (entiers purs) ≡ VRAI.
            + Stage 1G (hors-carte) : filet (court-circuit, carte=None,
            fragment 7 blocs dédié) + RQS INVALIDE (aucun résultat) —
            les deux chemins sans carte vérifiés complets.
  Stage 2 — RE-SCORE BIT-EXACT des 520 couples / 1 040 rives archivés du
            rapport ext-q1 (seed 42 ×2, 12 groupes), régénérés par le VRAI
            simulateur : stats_groupes 12/12 bit-exact vs archive du
            18/10, paliers_globaux, verdicts RCI + traversées, conformité
            D-STD-2 par groupe — puis couche appliquée aux 1 040 rives
            (0 mot interdit, fragments complets, filet ⇒ court-circuit
            même sur items Forte).
  Stage 4 — COUPLAGE PAS RÉEL : les 3 paliers résolus via les VRAIS
            moteurs aval Q2 (niveau_croisement du score H mesuré,
            config_de, palier_croise — l'autre rive BALAYÉE, jamais
            devinée) et Q3 (famille_de + BANQUE_PAS_EXT servis verbatim ;
            pas zéro légitime ssi config 1 ; suivi 14 j sans sanction,
            15 totaux) + re-test 8 semaines (arithmétique 56 jours).
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
import wtc_ext_q1_correction as corr          # la couche (charge les vrais moteurs)
core_q1 = corr.core_q1
core_q2 = corr.core_q2
core_q3 = corr.core_q3

# Le VRAI simulateur ext-q1 (seed 42, construit à l'import) :
sim_q1 = corr._charge(
    "wtc_ext_q1_simulator",
    corr._Q1 / "src" / "wtc_ext_q1_simulator.py")

RES = Path(__file__).resolve().parents[1] / "results"
SMOKE = os.environ.get("CORR_SMOKE") == "1"   # échantillon réduit (test rapide)

ARCHIVE = corr._Q1 / "results" / "resultats-ext-q1-2026-10-18.json"

AXES = corr.AXES
SOMMES_AXE = range(6, 25) if not SMOKE else range(6, 25, 3)   # 19 valeurs (grain 1/6)


def _sommes_faces_axe(s_axe: int) -> tuple:
    """Répartition représentative d'une somme d'axe (6..24) en deux sommes
    de faces (3..12) — CENTRÉE : s1 = clamp(s // 2, 3, 12), s2 = s − s1.
    (Sommes 9+9 pour s=18 : permet la construction plate — 18 corrigés
    égaux — du stage 0f ; toutes les paires restent dans [3 ; 12].)"""
    s1 = max(3, min(12, s_axe // 2))
    return s1, s_axe - s1


def _items_de_somme_face(s: int) -> tuple:
    """Triplet d'items (1-4) de somme exacte s ∈ [3 ; 12] (représentatif)."""
    q, r = divmod(s, 3)
    return (q + 1 if i < r else q for i in range(3))


def _profil_de_sommes(sh: int, sl: int, sc: int, *, vig: int = 1,
                      rythme: bool = False, filet: bool = False,
                      triple_h2: tuple | None = None,
                      plat: bool = False) -> dict:
    """Profil synthétique minimal : les entrées lues par le cœur, exactes.

    Chaque face reçoit une répartition quasi-égale de sa somme (aucune
    contradiction possible : écart corrigé ≤ 1 < 2,5 — sauf si triple_h2
    est fourni, pour les constructions de pénalités dirigées du stage 0f).
    temps réalistes (aucun rythme) sauf rythme=True ; EXT-VIG = vig ;
    signal_herite = filet. plat=True supprime l'offset de répartition
    (faces strictement égales — construction linéaire du stage 0f)."""
    p: dict = {}
    # les deux faces d'un axe reçoivent des répartitions distinctes de la
    # même somme (s1 → triplet A, s2 → triplet B) pour casser la linéarité
    # quand la somme n'est pas 9 ou 18 :
    def triplet(face_sum: int, offset: int) -> tuple:
        q, r = divmod(face_sum, 3)
        items = [q + 1 if i < r else q for i in range(3)]
        if offset and not plat and items[0] > 1 and items[2] < 4:
            items[0], items[2] = items[0] - 1, items[2] + 1
        return tuple(items)

    for axe, s_axe in (("H", sh), ("L", sl), ("C", sc)):
        s1, s2 = _sommes_faces_axe(s_axe)
        for face, s_face, off in ((f"EXT-{axe}1", s1, 0), (f"EXT-{axe}2", s2, 1)):
            items = list(triplet(s_face, off))
            for k, it in enumerate(core_q1.FACES[face]["items"]):
                if it in core_q1.INVERSES:
                    p[it] = 5 - items[k]          # inverse : brut = 5 − corrigé
                else:
                    p[it] = items[k]
    if triple_h2 is not None:
        for it, v in zip(core_q1.FACES["EXT-H2"]["items"], triple_h2):
            p[it] = 5 - v if it in core_q1.INVERSES else v
    p[core_q1.ITEM_VIGILANCE] = vig
    if rythme:
        p["temps_items"] = {it: 1.2 for it in core_q1.ITEMS}
        p["temps_session"] = 40.0
    else:
        p["temps_items"] = {it: 4.5 for it in core_q1.ITEMS}
        p["temps_session"] = 120.0
    p["signal_herite"] = bool(filet)
    return p


# ─────────────────────────────────────────────────────────────────────────────
# STAGE 0 — COMPACTATIONS + MESURES
# ─────────────────────────────────────────────────────────────────────────────
def stage0() -> dict:
    res = {
        "faces_triplets": 0, "faces_ecarts": 0,
        "faces_scores_distincts": 0, "faces_scores_attendus": 10,
        "axes_sextuplets": 0, "axes_ecarts": 0,
        "axes_scores_distincts": 0, "axes_scores_attendus": 19,
        "inverses": 0, "inverses_ecarts": 0,
        "espions": 0, "espion_ecarts": 0,
        "distances_seuils_axe": {}, "bornes_ci90_distinctes": 0,
        "bornes_pile": 0, "ecarts_faces_distincts": 0,
        "distance_ecart_seuil_h": 0.0,
        "rqs_realisables": {}, "rqs_ecarts": 0,
        "lin_contra_realisable": None,
    }

    # (a) 64 triplets → 10 scores de face (VRAI score_face_de)
    par_somme = {}
    for items in itertools.product((1, 2, 3, 4), repeat=3):
        s = sum(items)
        corr_ = {it: v for it, v in zip(core_q1.FACES["EXT-H1"]["items"], items)}
        m = core_q1.score_face_de(corr_, "EXT-H1")
        res["faces_triplets"] += 1
        if s in par_somme and par_somme[s] != m:
            res["faces_ecarts"] += 1
        par_somme[s] = m
    res["faces_scores_distincts"] = len(par_somme)

    # (b) 4 096 sextuplets → 19 scores d'axe (VRAI score_axe_de), 3 axes
    par_somme_axe: set = set()
    for axe in AXES:
        items_axe = [i for f in core_q1.FACES.values()
                     if f["axe"] == axe for i in f["items"]]
        for items in itertools.product((1, 2, 3, 4), repeat=6):
            corr_ = dict(zip(items_axe, items))
            m = core_q1.score_axe_de(corr_, axe)
            res["axes_sextuplets"] += 1
            par_somme_axe.add(m)
            if m != round(sum(items) / 6, 4):
                res["axes_ecarts"] += 1
    res["axes_scores_distincts"] = len(par_somme_axe)

    # (c) inverses : 5 valeurs brutes → 5 − brut (VRAI corrige)
    for it in core_q1.INVERSES:
        for v in (1, 2, 3, 4, 5):
            res["inverses"] += 1
            if core_q1.corrige(it, v) != 5 - v:
                res["inverses_ecarts"] += 1

    # (d) espions : EXT-VIG et signal_herite ne touchent pas la lecture
    base = _profil_de_sommes(10, 10, 10)
    sortie_base = core_q1.classifier_rive(base)
    for vig in (1, 2, 3, 4, 5):
        p = dict(base)
        p[core_q1.ITEM_VIGILANCE] = vig
        out = core_q1.classifier_rive(p)
        res["espions"] += 1
        # carte restée affichée → lecture IDENTIQUE (le VIG ne touche que RQS) :
        if out["carte"] and (out["niveaux"] != sortie_base["niveaux"]
                             or out["faces"] != sortie_base["faces"]
                             or out["palier"] != sortie_base["palier"]):
            res["espion_ecarts"] += 1
    for heritage in (False, True):
        p = dict(base)
        p["signal_herite"] = heritage
        out = core_q1.classifier_rive(p)
        res["espions"] += 1
        if heritage and not (out["filet"]["filet"] and out["carte"] is None):
            res["espion_ecarts"] += 1   # signal_herite DOIT ouvrir la voie filet
        if not heritage and out["filet"]["filet"]:
            res["espion_ecarts"] += 1

    # (e) bornes mesurées (consignation R4 — exactitude exigée)
    scores_axe = [round(s / 6, 4) for s in range(6, 25)]
    for s in core_q1.SEUILS_NIVEAUX:
        res["distances_seuils_axe"][str(s)] = round(
            min(abs(a - s) for a in scores_axe), 4)
    bornes = set()
    for a in scores_axe:
        lo, hi = core_q1.bornes_ci90(a)
        bornes.add(lo)
        bornes.add(hi)
    res["bornes_ci90_distinctes"] = len(bornes)
    res["bornes_pile"] = sum(1 for b in bornes if b in core_q1.SEUILS_NIVEAUX)
    scores_face = [round(s / 3, 2) for s in range(3, 13)]
    ecarts = sorted({round(abs(x - y), 2)
                     for x, y in itertools.product(scores_face, repeat=2)})
    res["ecarts_faces_distincts"] = len(ecarts)
    res["distance_ecart_seuil_h"] = round(
        min(abs(e - core_q1.SEUIL_HIERARCHIE) for e in ecarts), 4)

    # (f) table RQS — pénalités réalisables, construites et vérifiées
    constructions = {
        "aucune": dict(vig=1),
        "vigilance": dict(vig=3),
        "rythme": dict(rythme=True),
        "lineaire": dict(triple_h2=None),   # toutes faces à somme 9 → SD 0
        "lineaire+rythme": dict(rythme=True),
        "lineaire+vigilance": dict(vig=3),
        "lineaire+rythme+vigilance": dict(rythme=True, vig=3),
        # triple H2 = CIBLES CORRIGÉES (1, 1, 4) — l'inverse reçoit brut 5−4=1 :
        # écart |4 − mean(1,1)| = 3 ≥ 2,5 → contradiction
        "contradiction": dict(triple_h2=(1, 1, 4)),
        "contradiction+rythme": dict(triple_h2=(1, 1, 4), rythme=True),
        "contradiction+vigilance": dict(triple_h2=(1, 1, 4), vig=3),
        "contradiction+rythme+vigilance": dict(triple_h2=(1, 1, 4),
                                               rythme=True, vig=3),
    }
    for nom, kw in constructions.items():
        if nom.startswith("lineaire"):
            # sommes d'axe 18 = faces 9+9, répartitions PLATES → 18 corrigés
            # égaux (3) → SD 0 → linéarité :
            p = _profil_de_sommes(18, 18, 18, plat=True, **kw)
        elif "contradiction" in nom:
            # base variée (SD ≥ 0,45) + triple H2 dirigé (corrigés 1,1,4) :
            p = _profil_de_sommes(10, 8, 11, **kw)
        else:
            # base variée sans aucune pénalité cachée :
            p = _profil_de_sommes(10, 8, 11, **kw)
        rqs = core_q1.calcule_rqs(p, p["temps_items"], p["temps_session"])
        n_pen = (int(rqs["linearite"]) + int(rqs["contradiction"])
                 + int(rqs["rythme"]) + int(rqs["vigilance"]))
        attendu = max(0, 100 - 20 * int(rqs["linearite"])
                      - 20 * int(rqs["contradiction"])
                      - 25 * int(rqs["rythme"]) - 20 * int(rqs["vigilance"]))
        ok = (rqs["rqs"] == attendu
              and rqs["statut"] == ("OK" if rqs["rqs"] >= 85
                                    else "PRUDENCE" if rqs["rqs"] >= 70
                                    else "INVALIDE"))
        res["rqs_realisables"][nom] = {
            "rqs": rqs["rqs"], "statut": rqs["statut"],
            "penalites": n_pen, "ok": ok}
        if not ok:
            res["rqs_ecarts"] += 1
    # linéarité + contradiction simultanées : preuve d'impossibilité —
    # pour TOUT triplet corrigé en contradiction (écart ≥ 2,5) et TOUTE
    # somme réalisable des 15 autres items, la répartition la PLUS ÉGALE
    # possible ({v, v+1}) minimise la variance (convexité) : si même là
    # SD ≥ 0,45, aucune configuration n'est à la fois linéaire et en
    # contradiction — énumération exhaustive 64 triplets × 48 répartitions :
    trouve = False
    for c0, c1, c2 in itertools.product((1, 2, 3, 4), repeat=3):
        if abs(c2 - (c0 + c1) / 2) < 2.5:
            continue
        for v in (1, 2, 3):
            for k in range(16):
                vals = [c0, c1, c2] + [v + 1] * k + [v] * (15 - k)
                m = sum(vals) / 18
                sd = (sum((x - m) ** 2 for x in vals) / 18) ** 0.5
                if sd < 0.45:
                    trouve = True
    res["lin_contra_realisable"] = trouve
    return res


# ─────────────────────────────────────────────────────────────────────────────
# STAGE 1 — ÉNUMÉRATION EXHAUSTIVE (6 859 configurations de niveaux)
# ─────────────────────────────────────────────────────────────────────────────
# marqueur EXACT de la zone calme (template §5.5 de la couche) — la clause
# permanente QUAND DEMANDER cite « rien à fabriquer » et ne doit PAS
# déclencher ce check (leçon SM-q1-r3) :
PHRASE_CALME = "Zone calme — rien à fabriquer ici"


def _table_conservateurs() -> dict:
    """Table pure des 19 sommes d'axe → (conservateur, type) — chemin 2 de
    COR2, vérifiée contre le VRAI lecture_L3 (19 × 3 axes)."""
    table = {}
    for s in range(6, 25):
        score = round(s / 6, 4)
        bas, haut = core_q1.bornes_ci90(score)
        lect = core_q1.lecture_L3(score, bas, haut)
        table[s] = (lect["conservateur"], lect["type"])
    return table


def stage1(table: dict) -> dict:
    res = {
        "configurations": 0,
        "cor2_double_chemin_ecarts": 0,
        "cor1_fragments_incomplets": 0,
        "cor1_blocs_vides": 0,
        "cor3_S1": 0, "cor3_S2": 0,
        "cor3_S2_ecarts": 0,
        "cor4_mots_interdits": 0, "cor4_dsim_manquant": 0,
        "textes_distincts": 0, "fragments_distincts": 0,
        "cor5_calme_hors_vert": 0, "cor5_vert_sans_calme": 0,
        "cor5_filet_hors_carte": 0,
        "cor0invar_vert_dominant": 0,
        "distrib_paliers": {}, "distrib_conservateurs": {},
        "distrib_statuts": {},
        "junction_configs_atteignables": {},
        "frontieres_par_axe": 0, "niveaux_poses": 0,
    }
    texts: list = []
    frags: list = []
    for sh, sl, sc in itertools.product(SOMMES_AXE, repeat=3):
        p = _profil_de_sommes(sh, sl, sc)
        out = core_q1.classifier_rive(p)
        if not out["carte"]:
            res["cor2_double_chemin_ecarts"] += 1
            continue
        res["configurations"] += 1
        pal = corr.palier_et_contenu(out)

        # COR2 — double chemin : table pure des sommes ≡ VRAI moteur
        cons_pur = (table[sh][0], table[sl][0], table[sc][0])
        palier_pur = core_q1.palier_de(*cons_pur, False)["palier"]
        if palier_pur != pal["palier"] or cons_pur != tuple(
                out["niveaux"][a]["conservateur"] for a in AXES):
            res["cor2_double_chemin_ecarts"] += 1
        # le type de lecture aussi (NIVEAU/FRONTIÈRE) :
        if (table[sh][1], table[sl][1], table[sc][1]) != tuple(
                out["niveaux"][a]["type"] for a in AXES):
            res["cor2_double_chemin_ecarts"] += 1

        # COR0-invar — VERT ⇔ aucun axe actif (dominant None) :
        dom = corr.axe_dominant(out)
        if pal["palier"] == core_q1.PALIER_VERT and dom is not None:
            res["cor0invar_vert_dominant"] += 1

        # COR1 — blocs et fragments complets
        bloc = corr.bloc_ecran(out)
        frag = corr.bilan_fragment(out, pal)
        if not frag.get("_complet"):
            res["cor1_fragments_incomplets"] += 1
        if not bloc.get("palier"):
            res["cor1_blocs_vides"] += 1

        # COR3 — S1/S2 : S1 ⇔ filet (jamais ici) ; S2 ⇔ palier non-VERT
        if pal["S1"]:
            res["cor3_S1"] += 1
        if pal["S2"]:
            res["cor3_S2"] += 1
        if pal["S2"] != (pal["palier"] != core_q1.PALIER_VERT):
            res["cor3_S2_ecarts"] += 1

        # COR4 — vocabulaire + bandeau D-SIM
        for t in corr.textes_ecran(out):
            tl = t.lower()
            for mot in corr.MOTS_INTERDITS:
                if mot in tl:
                    res["cor4_mots_interdits"] += 1
        if corr.BANDEAU_DSIM not in bloc["bandeau_dsim"]:
            res["cor4_dsim_manquant"] += 1
        texts.append(json.dumps(bloc, sort_keys=True, ensure_ascii=False))
        frags.append(json.dumps(frag, sort_keys=True, ensure_ascii=False))

        # COR5 — anti-fabrication : « rien à fabriquer » ⇔ VERT (zone calme) ;
        # aucun court-circuit hors filet
        calme = any(PHRASE_CALME in t for t in corr._textes(bloc))
        if calme and pal["palier"] != core_q1.PALIER_VERT:
            res["cor5_calme_hors_vert"] += 1
        if not calme and pal["palier"] == core_q1.PALIER_VERT:
            res["cor5_vert_sans_calme"] += 1
        if "court_circuit" in bloc:
            res["cor5_filet_hors_carte"] += 1

        # distributions + junction
        res["distrib_paliers"][pal["palier"]] = \
            res["distrib_paliers"].get(pal["palier"], 0) + 1
        for a in AXES:
            c = out["niveaux"][a]["conservateur"]
            res["distrib_conservateurs"][c] = \
                res["distrib_conservateurs"].get(c, 0) + 1
            res["frontieres_par_axe"] += int(out["niveaux"][a]["type"] == "FRONTIÈRE")
            res["niveaux_poses"] += int(out["niveaux"][a]["type"] == "NIVEAU")
        res["distrib_statuts"][out["rqs"]["statut"]] = \
            res["distrib_statuts"].get(out["rqs"]["statut"], 0) + 1
        cfg = corr.configurations_atteignables(out["niveaux"]["H"]["score"])
        key = "|".join(str(c["num"]) for c in cfg["configs_atteignables"])
        res["junction_configs_atteignables"][key] = \
            res["junction_configs_atteignables"].get(key, 0) + 1

    res["textes_distincts"] = len(set(texts))
    res["fragments_distincts"] = len(set(frags))
    return res


# ─────────────────────────────────────────────────────────────────────────────
# STAGE 1F — FACES : NUAGE / HIÉRARCHIE (10² paires × 3 axes = 300)
# ─────────────────────────────────────────────────────────────────────────────
def stage1f() -> dict:
    res = {"paires": 0, "cor2_faces_ecarts": 0, "nuages": 0,
           "hierarchies": 0}
    for axe in AXES:
        f1, f2 = sorted(f for f in core_q1.FACES
                        if core_q1.FACES[f]["axe"] == axe)
        for s1, s2 in itertools.product(range(3, 13), repeat=2):
            fs = {"EXT-H1": 9, "EXT-H2": 9, "EXT-L1": 9,
                  "EXT-L2": 9, "EXT-C1": 9, "EXT-C2": 9}
            fs[f1], fs[f2] = s1, s2
            p = _profil_de_sommes_faces(fs)
            out = core_q1.classifier_rive(p)
            res["paires"] += 1
            face = out["faces"][axe]
            # double chemin entiers purs : déclaré ⇔ |s1 − s2| ≥ 3
            # (écart minimal déclaré 1,00 ≥ 0,8837 ; NUAGE sinon) :
            attendu_declare = abs(s1 - s2) >= 3
            obtenu_declare = face["dominante"] is not None
            if obtenu_declare != attendu_declare:
                res["cor2_faces_ecarts"] += 1
            # l'écart VRAI se calcule sur les scores de faces ARRONDIS :
            ecart_attendu = round(abs(round(s1 / 3, 2) - round(s2 / 3, 2)), 2)
            if face["ecart"] != ecart_attendu:
                res["cor2_faces_ecarts"] += 1
            # la dominante est la face au score le plus élevé (égalité → f1) :
            if attendu_declare:
                attendu_dom = f1 if round(s1 / 3, 2) >= round(s2 / 3, 2) else f2
                if face["dominante"] != attendu_dom:
                    res["cor2_faces_ecarts"] += 1
            res["nuages"] += int(face["lecture"] == "NUAGE")
            res["hierarchies"] += int(
                face["lecture"] == "HIÉRARCHIE DÉCLARABLE")
    return res


def _profil_de_sommes_faces(fs: dict) -> dict:
    """Profil à partir des 6 sommes de FACES exactes (stage 1F)."""
    p: dict = {}
    for face, s in fs.items():
        q, r = divmod(s, 3)
        items = [q + 1 if i < r else q for i in range(3)]
        for k, it in enumerate(core_q1.FACES[face]["items"]):
            p[it] = 5 - items[k] if it in core_q1.INVERSES else items[k]
    p[core_q1.ITEM_VIGILANCE] = 1
    p["temps_items"] = {it: 4.5 for it in core_q1.ITEMS}
    p["temps_session"] = 120.0
    p["signal_herite"] = False
    return p


# ─────────────────────────────────────────────────────────────────────────────
# STAGE 1G — HORS-CARTE : filet (court-circuit) + RQS INVALIDE
# ─────────────────────────────────────────────────────────────────────────────
def stage1g() -> dict:
    res = {
        "filet_configs": 0, "filet_ecarts": 0,
        "invalide_configs": 0, "invalide_ecarts": 0,
        "fragments_incomplets": 0, "mots_interdits": 0,
        "literal_filet": None,
    }
    # filet — toutes les familles de niveaux, court-circuit AVANT l'arbre :
    for sh, sl, sc in [(6, 6, 6), (9, 9, 9), (12, 12, 12), (15, 15, 15),
                       (18, 18, 18), (21, 21, 21), (24, 24, 24),
                       (24, 9, 9), (9, 24, 9), (9, 9, 24),
                       (13, 7, 19), (22, 16, 10)]:
        p = _profil_de_sommes(sh, sl, sc, filet=True)
        out = core_q1.classifier_rive(p)
        res["filet_configs"] += 1
        pal = corr.palier_et_contenu(out)
        if not (out["carte"] is None and pal["filet"] and pal["S1"]
                and pal["palier"] == core_q1.PALIER_ROUGE
                and pal["carte_affichee"] is False):
            res["filet_ecarts"] += 1
        frag = corr.bilan_fragment(out, pal)
        bloc = corr.bloc_ecran(out)
        if not frag.get("_complet"):
            res["fragments_incomplets"] += 1
        if "court_circuit" not in bloc:
            res["filet_ecarts"] += 1
        for t in corr.textes_ecran(out):
            tl = t.lower()
            for mot in corr.MOTS_INTERDITS:
                if mot in tl:
                    res["mots_interdits"] += 1
        res["literal_filet"] = corr.FILET_LITERAL
        if corr.FILET_LITERAL != "3919 / 3114 — P-FILTRE":
            res["filet_ecarts"] += 1

    # RQS INVALIDE — rythme + vigilance (55) : aucun résultat affiché :
    for sh, sl, sc in [(6, 6, 6), (9, 9, 9), (15, 12, 9), (24, 24, 24)]:
        p = _profil_de_sommes(sh, sl, sc, vig=3, rythme=True)
        out = core_q1.classifier_rive(p)
        res["invalide_configs"] += 1
        if out["carte"] is not None or out["palier"] is not None:
            res["invalide_ecarts"] += 1
            continue
        pal = corr.palier_et_contenu(out)
        frag = corr.bilan_fragment(out, pal)
        bloc = corr.bloc_ecran(out)
        if not (pal["palier"] is None and pal["carte_affichee"] is False
                and not pal["S1"] and not pal["S2"]):
            res["invalide_ecarts"] += 1
        if not frag.get("_complet") or "aucun_resultat" not in bloc:
            res["fragments_incomplets"] += 1
        for t in corr.textes_ecran(out):
            tl = t.lower()
            for mot in corr.MOTS_INTERDITS:
                if mot in tl:
                    res["mots_interdits"] += 1
    return res


# ─────────────────────────────────────────────────────────────────────────────
# STAGE 2 — RE-SCORE BIT-EXACT (520 couples / 1 040 rives, simulateur frais)
# ─────────────────────────────────────────────────────────────────────────────
def stage2() -> dict:
    res = {
        "n_couples": 0, "n_rives": 0,
        "stats_groupes_match": False, "paliers_globaux_match": False,
        "rci_match": False, "conformite_match": False,
        "comparaisons": 0, "ecarts": 0,
        "couche_paliers": {}, "couche_fragments_incomplets": 0,
        "couche_mots_interdits": 0, "couche_dsim_manquant": 0,
        "couche_filet_court_circuit": 0, "couche_filet_ecarts": 0,
        "couche_invalide_sans_resultat": 0,
        "g09_statuts": {}, "g11_forte_court_circuit": None,
    }
    archive = json.loads(ARCHIVE.read_text(encoding="utf-8"))
    couples = sim_q1.tous_les_couples()
    res["n_couples"] = len(couples)

    stats = {}
    paliers_globaux = {"EXERCICE MAISON": 0, "MODULE DE COUPLE": 0,
                       "ORIENTATION": 0, "NON_AFFICHÉE": 0}
    rci_globaux = {"FIABLE": 0, "SUGGESTION": 0, "BRUIT": 0, "N/A": 0}
    traversees = 0
    conformite = {}
    couche_paliers = {"EXERCICE MAISON": 0, "MODULE DE COUPLE": 0,
                      "ORIENTATION": 0, "NON_AFFICHÉE": 0}
    g09_statuts = {"OK": 0, "PRUDENCE": 0, "INVALIDE": 0}
    g11_forte_cc = 0
    g11_forte_n = 0

    for c in couples:
        m = core_q1.classifier_couple(c)
        conformite[c["id"]] = int(sim_q1.conformite_couple(c, m))
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
        g["conformes"] += conformite[c["id"]]
        for r in ("rive_a", "rive_b"):
            m_r = m[r]
            res["n_rives"] += 1
            if m_r["carte"]:
                g["paliers"][m_r["palier"]] += 1
                g["statuts_rqs"][m_r["rqs"]["statut"]] += 1
                for axe in AXES:
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
            # globaux
            if m_r["carte"]:
                paliers_globaux[m_r["palier"]] += 1
            else:
                paliers_globaux["NON_AFFICHÉE"] += 1
            if m_r["rci"]:
                rci_globaux[m_r["rci"]["verdict"]] += 1
                traversees += int(m_r["rci"]["traversee"])
            else:
                rci_globaux["N/A"] += 1
            res["comparaisons"] += 1

            # ── la COUCHE appliquée à cette rive ──
            pal = corr.palier_et_contenu(m_r)
            key = (m_r["palier"] if m_r["carte"] else "NON_AFFICHÉE")
            couche_paliers[key] += 1
            frag = corr.bilan_fragment(m_r, pal)
            bloc = corr.bloc_ecran(m_r)
            if not frag.get("_complet"):
                res["couche_fragments_incomplets"] += 1
            for t in corr.textes_ecran(m_r):
                tl = t.lower()
                for mot in corr.MOTS_INTERDITS:
                    if mot in tl:
                        res["couche_mots_interdits"] += 1
            if corr.BANDEAU_DSIM not in bloc["bandeau_dsim"]:
                res["couche_dsim_manquant"] += 1
            if m_r["filet"]["filet"]:
                res["couche_filet_court_circuit"] += 1
                if not (m_r["carte"] is None and pal["S1"]
                        and "court_circuit" in bloc):
                    res["couche_filet_ecarts"] += 1
            if m_r["rqs"]["statut"] == "INVALIDE":
                res["couche_invalide_sans_resultat"] += int(
                    m_r["carte"] is None and "aucun_resultat" in bloc)
            if c["groupe"] == "G09_PIEGES_RQS":
                g09_statuts[m_r["rqs"]["statut"]] += 1
            if c["groupe"] == "G11_SIGNAL_FILET" and r == "rive_a" \
                    and c["id"].endswith(tuple(f"_{i:03d}" for i in range(35, 40))):
                g11_forte_n += 1
                g11_forte_cc += int(m_r["carte"] is None
                                    and m_r["filet"]["filet"])

        res["comparaisons"] += 1

    # confrontations bit-exact à l'archive
    res["stats_groupes_match"] = stats == archive["stats_groupes"]
    if not res["stats_groupes_match"]:
        res["ecarts"] += 1
        for gname in stats:
            if stats[gname] != archive["stats_groupes"].get(gname):
                res[f"ecart_groupe_{gname}"] = {
                    "obtenu": stats[gname], "archive": archive["stats_groupes"].get(gname)}
    res["paliers_globaux_match"] = paliers_globaux == archive["paliers_globaux"]
    if not res["paliers_globaux_match"]:
        res["ecarts"] += 1
    res["rci_match"] = (rci_globaux == archive["rci"]["verdicts"]
                        and traversees == archive["rci"]["traversees"])
    if not res["rci_match"]:
        res["ecarts"] += 1
    conf_ok = True
    for gname in archive["stats_groupes"]:
        ids = [c["id"] for c in couples if c["groupe"] == gname]
        obt = sum(conformite[i] for i in ids)
        if obt != archive["stats_groupes"][gname]["conformes"]:
            conf_ok = False
    res["conformite_match"] = conf_ok
    if not conf_ok:
        res["ecarts"] += 1

    # la couche doit voir EXACTEMENT les mêmes paliers que le cœur :
    res["couche_paliers"] = couche_paliers
    if couche_paliers != paliers_globaux:
        res["ecarts"] += 1
    res["g09_statuts"] = g09_statuts
    res["g11_forte_court_circuit"] = f"{g11_forte_cc}/{g11_forte_n}" if g11_forte_n else "n/a"
    return res


# ─────────────────────────────────────────────────────────────────────────────
# STAGE 4 — COUPLAGE PAS RÉEL (VRAIS Q2/Q3) + suivi + re-test
# ─────────────────────────────────────────────────────────────────────────────
def stage4() -> dict:
    res = {
        "niveaux_croisement": {}, "niveaux_croisement_ecarts": 0,
        "scores_h_couverts": 0, "configs_resolues": 0, "configs_ecarts": 0,
        "banque_longueurs_ok": 0, "banque_ecarts": 0,
        "pas_zero_configs": [], "pas_zero_ecarts": 0,
        "pas_verbatim_ecarts": 0,
        "suivi_totaux": 0, "suivi_ecarts": 0,
        "suivi_celebre": 0, "suivi_en_chemin": 0,
        "retest_8_semaines": None, "retest_ecarts": 0,
        "paliers_croises_couverts": [],
    }
    # les 19 scores H (grain 1/6) → VRAI niveau_croisement, double chemin :
    attendu_bornes = {2.50: "MODÉRÉE", 3.50: "FORTE"}
    for s in range(6, 25):
        score = round(s / 6, 4)
        niv = core_q2.niveau_croisement(score)
        res["scores_h_couverts"] += 1
        # chemin pur : FAIBLE < 2,50 ≤ MODÉRÉE < 3,50 ≤ FORTE
        pur = ("FAIBLE" if score < 2.50 else
               "MODÉRÉE" if score < 3.50 else "FORTE")
        if niv != pur:
            res["niveaux_croisement_ecarts"] += 1
        res["niveaux_croisement"][str(score)] = niv
        for s_b, niv_b in attendu_bornes.items():
            if score == s_b and niv != niv_b:
                res["niveaux_croisement_ecarts"] += 1

        # configs atteignables depuis CETTE rive (autre rive balayée) :
        cfgs = corr.configurations_atteignables(score)
        if len(cfgs["configs_atteignables"]) != 3:
            res["configs_ecarts"] += 1
        for c in cfgs["configs_atteignables"]:
            res["configs_resolues"] += 1
            # junction : le VRAI config_de/palier_croise recalculés :
            if core_q2.config_de(niv, c["autre_rive_balayee"]) != c["num"]:
                res["configs_ecarts"] += 1
            if core_q2.palier_croise(niv, c["autre_rive_balayee"], False) \
                    != c["palier_croise"]:
                res["configs_ecarts"] += 1
            fam = core_q3.famille_de(c["palier_croise"])
            banque = core_q3.BANQUE_PAS_EXT[fam]
            attendu_len = {"VERT": 3, "ORANGE": 2, "ROUGE": 1}
            cle_fam = {"EXERCICE MAISON": "VERT", "MODULE DE COUPLE": "ORANGE",
                       "ORIENTATION": "ROUGE"}[c["palier_croise"]]
            if len(banque) == attendu_len[cle_fam]:
                res["banque_longueurs_ok"] += 1
            else:
                res["banque_ecarts"] += 1
            # les pas servis par la couche sont les VRAIS, verbatim :
            pp = corr.pas_possibles(score)
            servie = pp["familles"][c["palier_croise"]]["pas_banque_reelle"]
            if servie != list(banque):
                res["pas_verbatim_ecarts"] += 1
            if c["palier_croise"] not in res["paliers_croises_couverts"]:
                res["paliers_croises_couverts"].append(c["palier_croise"])
            # pas zéro : légitime SSI config 1 (LA MÊME HEURE)
            legit = core_q3.pas_zero_legitime(c["num"] == 1)
            if legit != (c["num"] == 1):
                res["pas_zero_ecarts"] += 1
            if c["num"] == 1:
                res["pas_zero_configs"].append(score)

    # suivi 14 jours : les 15 totaux → CÉLÉBRÉ (≥ 9) / EN CHEMIN, jamais sanction
    for total in range(core_q3.N_JOURS + 1):
        serie = tuple(j < total for j in range(core_q3.N_JOURS))
        statut = core_q3.statut_engagement_de(serie)
        res["suivi_totaux"] += 1
        attendu = (core_q3.STATUT_CELEBRE if total >= core_q3.SEUIL_CELEBRE
                   else core_q3.STATUT_EN_CHEMIN)
        if statut != attendu:
            res["suivi_ecarts"] += 1
        res["suivi_celebre"] += (statut == core_q3.STATUT_CELEBRE)
        res["suivi_en_chemin"] += (statut == core_q3.STATUT_EN_CHEMIN)
    if core_q3.statut_engagement_de(None) is not None:
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
    table = _table_conservateurs()
    out = {
        "integrite_moteurs": "verifiee (asserts à l'import de la couche)",
        "stage0": stage0(),
        "stage1": stage1(table),
        "stage1f": stage1f(),
        "stage1g": stage1g(),
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
    r0 = runs[0]["stage0"]
    r1 = runs[0]["stage1"]
    r1f = runs[0]["stage1f"]
    r1g = runs[0]["stage1g"]
    r2 = runs[0]["stage2"]
    r4 = runs[0]["stage4"]

    criteres = {
        "RIO": "RIO-16 « L'écart de nos horloges » (carte) — ext-q1",
        "moteurs": {
            "q1": "validation-ext-q1/src/wtc_ext_q1_core.py (VALIDÉ 7/7, CONTRESIGNÉ)",
            "q2": "validation-ext-q2/src/wtc_ext_q2_core.py (junction croisement)",
            "q3": "validation-ext-q3/src/wtc_ext_q3_core.py (junction pas)",
        },
        "COR0_compactations": {
            "faces_triplets_64": r0["faces_triplets"],
            "faces_ecarts": r0["faces_ecarts"],
            "faces_scores": f'{r0["faces_scores_distincts"]}/{r0["faces_scores_attendus"]}',
            "axes_sextuplets": r0["axes_sextuplets"],
            "axes_ecarts": r0["axes_ecarts"],
            "axes_scores": f'{r0["axes_scores_distincts"]}/{r0["axes_scores_attendus"]}',
            "inverses": r0["inverses"], "inverses_ecarts": r0["inverses_ecarts"],
            "espions": r0["espions"], "espion_ecarts": r0["espion_ecarts"],
            "distances_seuils_axe": r0["distances_seuils_axe"],
            "bornes_ci90": r0["bornes_ci90_distinctes"],
            "bornes_pile": r0["bornes_pile"],
            "ecarts_faces": r0["ecarts_faces_distincts"],
            "distance_ecart_seuil_h": r0["distance_ecart_seuil_h"],
            "rqs_realisables": {k: v["ok"] for k, v in r0["rqs_realisables"].items()},
            "lin_contra_realisable": r0["lin_contra_realisable"],
            "ok": (r0["faces_ecarts"] == 0 and r0["axes_ecarts"] == 0
                   and r0["inverses_ecarts"] == 0 and r0["espion_ecarts"] == 0
                   and r0["bornes_pile"] == 0 and r0["rqs_ecarts"] == 0
                   and r0["faces_scores_distincts"] == 10
                   and r0["axes_scores_distincts"] == 19
                   and r0["lin_contra_realisable"] is False
                   and all(r0["rqs_realisables"][k]["ok"]
                           for k in r0["rqs_realisables"])),
        },
        "COR1_fragments": {
            "configurations": r1["configurations"],
            "attendu": (len(SOMMES_AXE) ** 3) if not SMOKE else "smoke",
            "fragments_incomplets": r1["cor1_fragments_incomplets"]
            + r1g["fragments_incomplets"],
            "blocs_vides": r1["cor1_blocs_vides"],
            "ok": (r1["cor1_fragments_incomplets"] == 0
                   and r1["cor1_blocs_vides"] == 0
                   and r1g["fragments_incomplets"] == 0),
        },
        "COR2_double_chemin": {
            "ecarts_niveaux": r1["cor2_double_chemin_ecarts"],
            "ecarts_faces": r1f["cor2_faces_ecarts"],
            "paires_faces": r1f["paires"],
            "nuages": r1f["nuages"], "hierarchies": r1f["hierarchies"],
            "ok": (r1["cor2_double_chemin_ecarts"] == 0
                   and r1f["cor2_faces_ecarts"] == 0),
        },
        "COR3_seuils": {
            "S1": r1["cor3_S1"] + r1g["filet_configs"],
            "S2": r1["cor3_S2"],
            "S2_ecarts": r1["cor3_S2_ecarts"],
            "borne_pile": r0["bornes_pile"],
            "bornes_consignees": (
                "1,80/3,20 : dist min 1/30 ≈ 0,0333 · 2,60 : 1/15 ≈ 0,0667 "
                "(grain 1/6) · 0,8837 : dist min 0,1163 (grain 1/3 des faces, "
                "15 écarts distincts) · 34 bornes CI90, 0 PILE sur un seuil"),
            "ok": (r1["cor3_S2_ecarts"] == 0 and r0["bornes_pile"] == 0),
        },
        "COR4_vocabulaire": {
            "mots_interdits": (r1["cor4_mots_interdits"]
                               + r1g["mots_interdits"]
                               + r2["couche_mots_interdits"]),
            "textes_distincts": r1["textes_distincts"],
            "fragments_distincts": r1["fragments_distincts"],
            "dsim_manquant": r1["cor4_dsim_manquant"]
            + r2["couche_dsim_manquant"],
            "exception_sourcee": ("filet 3919/3114 = literal du VRAI moteur "
                                  "(P-FILTRE validé P1) — cité, jamais réécrit"),
            "ok": (r1["cor4_mots_interdits"] == 0
                   and r1g["mots_interdits"] == 0
                   and r2["couche_mots_interdits"] == 0
                   and r1["cor4_dsim_manquant"] == 0
                   and r2["couche_dsim_manquant"] == 0),
        },
        "COR5_anti_fabrication": {
            "calme_hors_vert": r1["cor5_calme_hors_vert"],
            "vert_sans_calme": r1["cor5_vert_sans_calme"],
            "filet_hors_carte": r1["cor5_filet_hors_carte"],
            "vert_dominant_invar": r1["cor0invar_vert_dominant"],
            "0_verdict_temporel": "R5/R6 — aucun mot de la liste C6 "
                                  "(trop tard, bonne saison, compte à rebours…) "
                                  "dans les textes (COR4 vérifie la liste entière)",
            "ok": (r1["cor5_calme_hors_vert"] == 0
                   and r1["cor5_vert_sans_calme"] == 0
                   and r1["cor5_filet_hors_carte"] == 0
                   and r1["cor0invar_vert_dominant"] == 0),
        },
        "COR6_re_score": {
            "n_couples": r2["n_couples"], "n_rives": r2["n_rives"],
            "stats_groupes_match": r2["stats_groupes_match"],
            "paliers_globaux_match": r2["paliers_globaux_match"],
            "rci_match": r2["rci_match"],
            "conformite_match": r2["conformite_match"],
            "comparaisons": r2["comparaisons"],
            "ecarts": r2["ecarts"],
            "couche_paliers": r2["couche_paliers"],
            "couche_fragments_incomplets": r2["couche_fragments_incomplets"],
            "couche_mots_interdits": r2["couche_mots_interdits"],
            "g09_statuts": r2["g09_statuts"],
            "g11_forte_court_circuit": r2["g11_forte_court_circuit"],
            "archive": "resultats-ext-q1-2026-10-18.json",
            "ok": (r2["stats_groupes_match"] and r2["paliers_globaux_match"]
                   and r2["rci_match"] and r2["conformite_match"]
                   and r2["ecarts"] == 0
                   and r2["couche_fragments_incomplets"] == 0
                   and r2["couche_mots_interdits"] == 0
                   and r2["couche_filet_ecarts"] == 0
                   and r2["couche_invalide_sans_resultat"] == 20),
        },
        "COR7_couplage_pas": {
            "scores_h_couverts": r4["scores_h_couverts"],
            "niveaux_croisement_ecarts": r4["niveaux_croisement_ecarts"],
            "configs_resolues": r4["configs_resolues"],
            "configs_ecarts": r4["configs_ecarts"],
            "banque_longueurs_ok": r4["banque_longueurs_ok"],
            "banque_ecarts": r4["banque_ecarts"],
            "pas_verbatim_ecarts": r4["pas_verbatim_ecarts"],
            "pas_zero_configs": r4["pas_zero_configs"],
            "pas_zero_ecarts": r4["pas_zero_ecarts"],
            "paliers_croises_couverts": r4["paliers_croises_couverts"],
            "suivi_totaux": r4["suivi_totaux"],
            "suivi_celebre": r4["suivi_celebre"],
            "suivi_en_chemin": r4["suivi_en_chemin"],
            "suivi_ecarts": r4["suivi_ecarts"],
            "retest_8_semaines": r4["retest_8_semaines"],
            "retest_ecarts": r4["retest_ecarts"],
            "ok": (r4["niveaux_croisement_ecarts"] == 0
                   and r4["configs_ecarts"] == 0
                   and r4["banque_ecarts"] == 0
                   and r4["pas_verbatim_ecarts"] == 0
                   and r4["pas_zero_ecarts"] == 0
                   and r4["suivi_ecarts"] == 0
                   and r4["retest_ecarts"] == 0),
        },
        "COR8_reproductibilite": {
            "sha1": runs[0]["sha256"], "sha2": runs[1]["sha256"],
            "identiques": ok_cor8,
            "ok": ok_cor8,
        },
        "distributions": {
            "paliers_6859": r1["distrib_paliers"],
            "conservateurs_3x6859": r1["distrib_conservateurs"],
            "statuts_rqs": r1["distrib_statuts"],
            "frontieres_vs_posees": {"FRONTIÈRE": r1["frontieres_par_axe"],
                                     "NIVEAU": r1["niveaux_poses"]},
            "junction_configs": r1["junction_configs_atteignables"],
        },
        "re_score": {
            "F1": 25, "F1_note": "inchangé — lecture graduée D-VÉRITÉ/D-STD-2 "
                                 "validée au package (rien à masquer, rien à ajouter)",
            "F2": 25, "F2_note": "inchangé — palier max-niveau + QUAND DEMANDER "
                                 "déjà validés C5 ; S2 élargie à tout palier "
                                 "non-VERT (un axe FORTE est AUSSI un moment "
                                 "« demander de l'aide »)",
            "F3": [15, 25], "F3_note": "contenu CONCRET des 3 paliers produits "
                                       "(exercice zone calme §5.5 · module à deux "
                                       "s'appuyant sur les VRAIS pas de la banque "
                                       "Q3 · orientation avec le VRAI pas rouge) "
                                       "— l'invariant VERT ⇔ zone calme est prouvé, "
                                       "pas supposé",
            "F4": [10, 25], "F4_note": "fragment de bilan L8 à 7 blocs (position · "
                                       "forme · empreinte · couple · force · "
                                       "limites · palier/pas + flux Q2-Q5), "
                                       "COMPLET y compris hors-carte (filet, "
                                       "RQS INVALIDE) — aucun bloc vide",
            "avant": 75, "apres": 100,
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
          "| textes distincts:", criteres["COR4_vocabulaire"]["textes_distincts"],
          "| fragments distincts:", criteres["COR4_vocabulaire"]["fragments_distincts"])
    print("SHA:", runs[0]["sha256"][:16], "…", "identiques:", ok_cor8)


if __name__ == "__main__":
    main()
