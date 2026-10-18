# -*- coding: utf-8 -*-
"""WAIRYU — WTC-SM-Q5 (RIO-15) : simulateur. 540 couples, 12 groupes, seed 42.

Univers (SPEC verrouillée §6) : 7 groupes de suivi (check-ins binaire, totaux
fixés) + ZONE_CALME + CRISE_HÉRITÉE (override) + 4 groupes RCI (re-test 8
semaines). Géométrie Q4 : items entiers 1-5, σ_item 0,60 — grain détresse 1/3
(3 faces × 1 item), grain charge 1/12 (3 faces × 4 items). Les re-tests des
groupes RCI sont bruités (nouvelle mesure) ; G12_RCI_FRONTIÈRE est un piège
déterministe : re-test = base avec k items exactement modifiés (k/12 = Δ pile
aux bornes atteignables : 7/12 ≈ 0,583 FIABLE · 6/12 = 0,50 et 5/12 ≈ 0,417
SUGGESTION · 4/12 ≈ 0,333 BRUIT). Classification vraie ancrée sur les
paramètres injectés (D-GÉOMÉTRIE). Déterministe (seed 42)."""
from __future__ import annotations

import random

from wtc_sm_q5_core import (
    BANQUE_PAS, PALIER_ORANGE, PALIER_ROUGE, PALIER_VERT,
    STATUT_BRUIT, STATUT_CELEBRE, STATUT_EN_CHEMIN, STATUT_FIABLE,
    STATUT_SUGGESTION, ENSEMBLE_BRUIT, ENSEMBLE_FIABLE, ENSEMBLE_SUGGESTION,
    N_JOURS, VOIES_HERITEES, SE_DIFF, niveau_de, config_de, palier_de,
    statut_engagement_de, statut_rci_de, statut_ensemble_de, pas_de,
    crise_heritee_de,
)

SEED = 42
SIGMA_ITEM = 0.60
SEM_L7 = SE_DIFF / (2 ** 0.5)   # ≈ 0,252 — SEM du programme (L7 verbatim)
PAS_LIBRE_LIBELLE = "Notre pas à nous — écrit par le couple (champ libre)"

GROUPES = (
    ("G1_REGULIERS_14", 50), ("G2_REGULIERS_13", 50),
    ("G3_LENTS_DEMARREURS", 50), ("G4_DECROCHEURS", 50),
    ("G5_FRONTIERE_EXACTE", 40), ("G6_TRES_FAIBLES", 50),
    ("G7_ZONE_CALME", 50), ("G8_CRISE_HERITEE", 50),
    ("G9_RCI_FIABLE", 40), ("G10_RCI_SUGGESTION", 40),
    ("G11_RCI_BRUIT", 30), ("G12_RCI_FRONTIERE", 40),
)


def _item(mu, rng):
    """Un item entier 1-5 (échelle Likert) — bruit σ_item 0,60 (géométrie Q4)."""
    return int(min(5, max(1, round(rng.gauss(mu, SIGMA_ITEM)))))


def _serie(totaux_par_indice, i, rng=None):
    """Série de 14 booléens avec le total exact du profil (déterministe)."""
    total = totaux_par_indice(i)
    jours = tuple(j < total for j in range(N_JOURS))
    return jours


def _profil_serie(groupe, i):
    """Totaux de check-ins par groupe (SPEC §6 — profils fixés)."""
    if groupe == "G1_REGULIERS_14":
        return 14
    if groupe == "G2_REGULIERS_13":
        return 13                       # j7 manqué (indice 6)
    if groupe == "G3_LENTS_DEMARREURS":
        return 11                       # j1-3 sans, j4-14 tenus
    if groupe == "G4_DECROCHEURS":
        return 10 if i % 2 == 0 else 8  # moitié CÉLÉBRÉ, moitié EN CHEMIN
    if groupe == "G5_FRONTIERE_EXACTE":
        return 9                        # pile sur le seuil → CÉLÉBRÉ
    if groupe == "G6_TRES_FAIBLES":
        return 1 + (i % 3)              # 1-3 tentés — jamais de sanction
    if groupe == "G7_ZONE_CALME":
        return 12                       # j3, j10 manqués
    if groupe in ("G9_RCI_FIABLE",):
        return 12                       # j2, j13 manqués
    if groupe in ("G10_RCI_SUGGESTION", "G12_RCI_FRONTIERE"):
        return 14
    if groupe == "G11_RCI_BRUIT":
        return 11                       # j4, j8, j12 manqués
    return None                         # G8 : pas non déployé — pas de suivi


def _base_items(rng, mu_det, mu_chg):
    """Items de base : détresse 3 × 1 item (grain 1/3), charge 3 × 4 (1/12)."""
    det = [_item(mu_det, rng) for _ in range(3)]
    chg = [_item(mu_chg, rng) for _ in range(12)]
    return det, chg


def _re_test_agn(rng, base_det, base_chg, d_det, d_chg):
    """Re-test à 8 semaines : NOUVELLE mesure de l'agrégat avec le SEM DU
    PROGRAMME (L7 verbatim : SEM ≈ 0,252 — cohérence du modèle d'erreur entre
    moteur et simulation). La base reste figée (contresignée)."""
    re_det = base_det + d_det + rng.gauss(0.0, SEM_L7)
    re_chg = base_chg + d_chg + rng.gauss(0.0, SEM_L7)
    return re_det, re_chg


def _voies_g8(i):
    """Voies héritées (0 voie nouvelle) — pattern Q4 : SM-C1 20 / A2 20 / H5 10."""
    if i < 20:
        return ("SM-C1",), ()
    if i < 40:
        return ("A2",), ()
    return (), ("H5",)


def classification_vraie(c):
    """Statuts vrais depuis les paramètres injectés (D-GÉOMÉTRIE)."""
    v = c["_vrai_params"]
    niv_det, niv_chg = niveau_de(v["mu_det"]), niveau_de(v["mu_chg"])
    crise = crise_heritee_de(c["voies_p1"], c["voies_p2"])
    palier = palier_de(niv_det, niv_chg, crise)
    pas = None if palier == PALIER_ROUGE else v.get("pas_choisi")
    statut = statut_engagement_de(c["serie"])
    ensemble = None
    if v.get("d_det") is not None:
        s_det = statut_rci_de(v["mu_det"], v["mu_det"] + v["d_det"])
        s_chg = statut_rci_de(v["mu_chg"], v["mu_chg"] + v["d_chg"])
        ensemble = statut_ensemble_de(s_det, s_chg)
    return {"statut": statut, "palier": palier, "pas": pas,
            "ensemble": ensemble, "crise": crise, "config": config_de(niv_det, niv_chg)}


def _conforme(c, moteur, vrai):
    """Conformité moteur/table de vérité (verdict couple Q5) :
    statut ∧ palier ∧ pas ∧ (ensemble RCI si re-test présent)."""
    ok = moteur["statut"] == vrai["statut"] and moteur["palier"] == vrai["palier"] \
        and moteur["pas"] == vrai["pas"]
    if c["re_det"] is not None:
        ok &= moteur["rci"]["ensemble"] == vrai["ensemble"]
    return ok


def tous_les_couples():
    """540 couples, 12 groupes — ordre déterministe (seed 42)."""
    rng = random.Random(SEED)
    couples = []
    for groupe, n in GROUPES:
        for i in range(n):
            cid = f"{groupe}_{i}"
            mu_det, mu_chg = (2.0, 2.0) if groupe == "G7_ZONE_CALME" \
                else (3.0, 3.25) if groupe == "G8_CRISE_HERITEE" else (3.0, 3.0)
            det, chg = _base_items(rng, mu_det, mu_chg)
            base_det = sum(det) / 3.0
            base_chg = sum(chg) / 12.0
            serie = None
            voies_p1, voies_p2 = (), ()
            choix = None
            d_det = d_chg = None
            if groupe != "G8_CRISE_HERITEE":
                # Le pas est un CHOIX du couple (A2) : dans la banque de son
                # palier (i % 3 — les 3 pas servis), ou champ libre (G1 i%10).
                palier_vrai = palier_de(niveau_de(mu_det), niveau_de(mu_chg))
                choix = PAS_LIBRE_LIBELLE if (groupe == "G1_REGULIERS_14"
                                              and i % 10 == 0) \
                    else BANQUE_PAS[palier_vrai][i % 3]
                total = _profil_serie(groupe, i)
                if groupe == "G2_REGULIERS_13":
                    serie = tuple(j != 6 for j in range(N_JOURS))
                elif groupe == "G3_LENTS_DEMARREURS":
                    serie = tuple(j >= 3 for j in range(N_JOURS))
                elif groupe == "G4_DECROCHEURS":
                    total = 10 if i % 2 == 0 else 8
                    serie = tuple(j < total for j in range(N_JOURS))
                elif groupe == "G5_FRONTIERE_EXACTE":
                    serie = tuple(j < 9 for j in range(N_JOURS))
                elif groupe == "G6_TRES_FAIBLES":
                    serie = tuple(j < total for j in range(N_JOURS))
                elif groupe == "G7_ZONE_CALME":
                    serie = tuple(j not in (2, 9) for j in range(N_JOURS))
                elif groupe == "G9_RCI_FIABLE":
                    serie = tuple(j not in (1, 12) for j in range(N_JOURS))
                elif groupe == "G11_RCI_BRUIT":
                    serie = tuple(j not in (3, 7, 11) for j in range(N_JOURS))
                else:
                    serie = tuple(True for _ in range(N_JOURS))
            else:
                voies_p1, voies_p2 = _voies_g8(i)
            if groupe == "G1_REGULIERS_14" and i % 10 == 0:
                choix = PAS_LIBRE_LIBELLE      # champ libre servi (A2)
            if groupe == "G9_RCI_FIABLE":
                d_det, d_chg = (-0.90, -0.90) if i < 20 else (-0.75, -0.15)
            elif groupe == "G10_RCI_SUGGESTION":
                d_det, d_chg = -0.10, -0.48
            elif groupe == "G11_RCI_BRUIT":
                d_det, d_chg = 0.15, -0.15
            elif groupe == "G12_RCI_FRONTIERE":
                d_det, d_chg = 0.0, -(7 - (i % 4)) / 12.0   # 7/12, 6/12, 5/12, 4/12
            if groupe in ("G9_RCI_FIABLE", "G10_RCI_SUGGESTION", "G11_RCI_BRUIT"):
                re_det, re_chg = _re_test_agn(rng, base_det, base_chg,
                                              d_det, d_chg)
            elif groupe == "G12_RCI_FRONTIERE":
                # Piège frontière déterministe (ε = 0) : le re-test est la
                # base + Δ pile (Δ = −k/12, grain 1/12 = 1 item de charge) —
                # Δ det = 0 pile (BRUIT exact).
                re_det = base_det
                re_chg = base_chg + d_chg
            else:
                re_det, re_chg = None, None
            c = {
                "id": cid, "groupe": groupe,
                "scores_det": det, "scores_chg": chg,
                "voies_p1": voies_p1, "voies_p2": voies_p2,
                "serie": serie, "choix_pas": choix,
                "base_det": base_det, "base_chg": base_chg,
                "re_det": re_det, "re_chg": re_chg,
                "_vrai_params": {"mu_det": mu_det, "mu_chg": mu_chg,
                                 "d_det": d_det, "d_chg": d_chg,
                                 "pas_choisi": choix,
                                 "indice_pas": i},
            }
            vrai = classification_vraie(c)
            c["vrai"] = vrai
            couples.append(c)
    return couples


def resume_groupes(couples):
    """Résumé par groupe : N, conformes, statuts, paliers, traversées, crises."""
    from wtc_sm_q5_core import classifier
    resume = {}
    for groupe, n in GROUPES:
        membres = [c for c in couples if c["groupe"] == groupe]
        conf = 0
        statuts = {STATUT_CELEBRE: 0, STATUT_EN_CHEMIN: 0, "NON_DÉPLOYÉ": 0}
        paliers = {PALIER_VERT: 0, PALIER_ORANGE: 0, PALIER_ROUGE: 0}
        traversee_det = traversee_chg = 0
        ensembles = {ENSEMBLE_FIABLE: 0, ENSEMBLE_SUGGESTION: 0,
                     ENSEMBLE_BRUIT: 0, "N/A": 0}
        crises = 0
        for c in membres:
            m = classifier(c)
            v = c["vrai"]
            if _conforme(c, m, v):
                conf += 1
            if m["statut"] is None:
                statuts["NON_DÉPLOYÉ"] += 1
            else:
                statuts[m["statut"]] += 1
            paliers[m["palier"]] += 1
            if m["rci"] is not None:
                ensembles[m["rci"]["ensemble"]] += 1
                traversee_det += 1 if m["rci"]["traversee_det"] else 0
                traversee_chg += 1 if m["rci"]["traversee_chg"] else 0
            else:
                ensembles["N/A"] += 1
            crises += 1 if m["crise"] else 0
        resume[groupe] = {
            "n": n, "conformes": conf, "statuts": statuts, "paliers": paliers,
            "ensembles": ensembles, "traversee_det": traversee_det,
            "traversee_chg": traversee_chg, "crises": crises,
        }
    return resume


def voies_heritees_g10(couples):
    """Répartition des voies héritées du groupe crise (traçabilité)."""
    compte = {v: 0 for v in VOIES_HERITEES}
    for c in couples:
        if c["groupe"] != "G8_CRISE_HERITEE":
            continue
        for v in set(c["voies_p1"]) | set(c["voies_p2"]):
            compte[v] += 1
    return compte
