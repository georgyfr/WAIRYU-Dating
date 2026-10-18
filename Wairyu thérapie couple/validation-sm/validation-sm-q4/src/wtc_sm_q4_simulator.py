# -*- coding: utf-8 -*-
"""WTC-SM-Q4 — simulateur (600 couples, 13 groupes, seed 42).

SPEC Q4 §6 verrouillée : 450 couples (9 configurations × 50, comme émo-Q4)
+ pièges CRISE_HÉRITÉE (50) · ÉCART_PERCENTILES (30) · STYLES_DISSEMBLABLES (30)
· FRONTIÈRES (40) — total 600, réconciliation sum(N) = 600.

Instruments d'entrée (A2 : zéro item nouveau — sorties Q1 × Q2) :
- rive détresse = Q1-R3 (RIO-11) : faces SM-D1/D2/D3 à 1 item (grain entier,
  moyenne en pas de 1/3 — les bornes 2,50/3,50 sont STRUCTURELLEMENT
  inatteignables côté détresse, documenté Section F)
- rive charge = Q2 (RIO-12) : faces SM-A1/A2/A3 à 4 items (grain 0,25,
  moyenne en pas de 1/12 — bornes atteignables exactement : piège FRONTIÈRES)

D-PARAM : bruit σ_item = 0,60 (σ_eff face 4 items = 0,30 ; σ_eff agrégat
détresse = 0,60/√3 ≈ 0,35 ; agrégat charge = 0,30/√3 ≈ 0,17).
Leçon grain (Q2 Section F) : centres des groupes principaux à ≥ 0,5 pt des
bornes 2,50/3,50 (2,00 / 3,00 / 4,50).
classification_vraie ancrée sur les paramètres VRAIS (D-GÉOMÉTRIE).

Population de référence percentiles (A3) : 2 000 couples, seed 42,
μ rive ~ N(3,0 ; 0,8) (placeholder — à remplacer par le pilote, cf. L2 :
« placeholders à remplacer par le pilote ») + bruit item σ 0,60.
"""
import numpy as np

import wtc_sm_q4_core as core

SEED = 42
SIGMA_ITEM = 0.60
POP_N = 2000

# μ des 9 cellules (leçon grain : ≥ 0,5 pt des bornes 2,50/3,50)
MU_FAIBLE = (2.0, 2.0, 2.0)
MU_MOYEN = (3.0, 3.0, 3.0)
MU_ELEVE = (4.5, 4.5, 4.5)
MU_CELL = {"FAIBLE": MU_FAIBLE, "MOYEN": MU_MOYEN, "ÉLEVÉ": MU_ELEVE}

# G10 — voies héritées par profil (override A4) : 20 SM-C1 (p1) + 20 A2 (p2)
# + 10 H5 (p2). Pour A2 (voie = face A2 ≥ 4,0 côté Q2) : la face A2 est à
# niveau crise (μ 4,5) et les deux autres faces abaissées (μ 2,25) pour que la
# charge agrégée reste dans la cellule Moyen (cohérence voie/cellule).
G10_VOIES = ([(("SM-C1",), ())] * 20 + [((), ("A2",))] * 20
             + [((), ("H5",))] * 10)
MU_CHG_A2 = (2.25, 4.5, 2.25)

# G12 — styles dissemblables : détresse à items FIXES (3,3,3) -> σ_det = 0 ;
# charge à faces étalées (μ 1,75 / 3,0 / 4,25, moyenne 3,0) -> σ_chg ≈ 1,25
DET_FIXE_333 = (3, 3, 3)
MU_CHG_ETALE = (1.75, 3.0, 4.25)

# G13 — frontières : charge EXACTE (items fixes, grain 0,25)
_ITEMS_350 = (3, 3, 4, 4)   # face = 3,50 -> ÉLEVÉ (borne inclusive)
_ITEMS_250 = (2, 2, 3, 3)   # face = 2,50 -> MOYEN (borne basse inclusive)


def _gen_item(rng, mu):
    """Un item 1-5 : N(μ, σ_item) arrondi et borné (D-PARAM)."""
    return int(min(5, max(1, round(float(rng.normal(mu, SIGMA_ITEM))))))


def _gen_det(rng, mus):
    """Rive détresse (Q1) : 3 faces à 1 item."""
    return tuple(_gen_item(rng, m) for m in mus)


def _gen_chg(rng, mus):
    """Rive charge (Q2) : 3 faces × 4 items -> tuple de 3 moyennes (0,25)."""
    faces = []
    for m in mus:
        items = [int(min(5, max(1, float(np.rint(rng.normal(m, SIGMA_ITEM)))))
                     ) for _ in range(4)]
        faces.append(round(sum(items) / 4.0, 2))
    return tuple(faces)


def _gen_chg_exact(rng, items_par_face):
    """Rive charge EXACTE (piège FRONTIÈRES) : items fixes, zéro bruit."""
    return tuple(round(sum(it) / 4.0, 2) for it in items_par_face)


# (groupe, N, cellule (det, chg), type) — les 9 principaux d'abord (§6)
_GROUPES_PRINCIPAUX = (
    ("G1_calme", 50, ("FAIBLE", "FAIBLE")),
    ("G2_veille", 50, ("FAIBLE", "MOYEN")),
    ("G3_porte_seule", 50, ("FAIBLE", "ÉLEVÉ")),
    ("G4_courant_fort", 50, ("MOYEN", "FAIBLE")),
    ("G5_deux_courants", 50, ("MOYEN", "MOYEN")),
    ("G6_rive_qui_cede", 50, ("MOYEN", "ÉLEVÉ")),
    ("G7_tempete", 50, ("ÉLEVÉ", "FAIBLE")),
    ("G8_tempete_digue", 50, ("ÉLEVÉ", "MOYEN")),
    ("G9_debordement", 50, ("ÉLEVÉ", "ÉLEVÉ")),
)

GROUPES = _GROUPES_PRINCIPAUX + (
    ("G10_crise_heritee", 50, ("MOYEN", "MOYEN")),      # override A4
    ("G11_ecart_percentiles", 30, ("FAIBLE", "ÉLEVÉ")),  # boucle garantie
    ("G12_styles_dissemblables", 30, ("MOYEN", "MOYEN")),
    ("G13_frontieres", 40, ("MOYEN", "EXACT")),
)


def classification_vraie(groupe):
    """Label attendu ancré sur les paramètres vrais (D-GÉOMÉTRIE).
    Retourne (config_attendue, affichage_attendu)."""
    if groupe == "G10_crise_heritee":
        return ("DEUX COURANTS", core.AFFICHAGE_CRISE)   # override 🔴
    if groupe == "G11_ecart_percentiles":
        return ("PORTE SEULE", "PORTE SEULE")
    if groupe == "G12_styles_dissemblables":
        return ("DEUX COURANTS", "DEUX COURANTS")
    if groupe == "G13_frontieres":
        return ("RIVE QUI CÈDE", "RIVE QUI CÈDE")  # 3,50 exact -> Élevé (20/40)
    cell = dict((g[0], g[2]) for g in GROUPES)[groupe]
    cfg = core.configuration_de(cell[0], cell[1])
    return (cfg, cfg)


def population_norme():
    """Population de référence percentiles (A3) : 2 000 couples, seed 42.
    μ rive ~ N(3,0 ; 0,8) + bruit item σ 0,60 (placeholder L2).
    -> (pop_det, pop_chg) : deux tableaux de 2 000 scores agrégés."""
    rng = np.random.default_rng(SEED)
    det, chg = [], []
    for _ in range(POP_N):
        mu_d = float(min(5.0, max(1.0, rng.normal(3.0, 0.8))))
        mu_c = float(min(5.0, max(1.0, rng.normal(3.0, 0.8))))
        det.append(sum(_gen_item(rng, mu_d) for _ in range(3)) / 3.0)
        faces = [round(sum(_gen_item(rng, mu_c) for _ in range(4)) / 4.0, 2)
                 for _ in range(3)]
        chg.append(sum(faces) / 3.0)
    return det, chg


def _voies_de(groupe, i):
    if groupe == "G10_crise_heritee":
        return G10_VOIES[i]
    return ((), ())   # (voies_p1, voies_p2) — aucune voie héritée


def tous_les_couples():
    """-> (couples, classes_spec). Couple : dict complet pré-annoté.
    Déterministe : rng principal seed 42, groupes dans l'ordre §6."""
    rng = np.random.default_rng(SEED)
    couples = []
    classes_spec = {}
    for groupe, n, cell in GROUPES:
        for i in range(n):
            if groupe == "G12_styles_dissemblables":
                scores_det = DET_FIXE_333
                scores_chg = _gen_chg(rng, MU_CHG_ETALE)
                voies = ((), ())
            elif groupe == "G13_frontieres":
                scores_det = DET_FIXE_333   # fixe : le piège porte sur la CHARGE
                if i < n // 2:
                    scores_chg = _gen_chg_exact(rng, [_ITEMS_350] * 3)
                else:
                    scores_chg = _gen_chg_exact(rng, [_ITEMS_250] * 3)
                voies = ((), ())
            else:
                mu_det = MU_CELL[cell[0]]
                if groupe == "G10_crise_heritee":
                    mu_chg = (MU_CHG_A2 if i >= 20 and i < 40
                              else MU_CELL["MOYEN"])
                else:
                    mu_chg = MU_CELL[cell[1]]
                scores_det = _gen_det(rng, mu_det)
                scores_chg = _gen_chg(rng, mu_chg)
                voies = _voies_de(groupe, i)
            cfg_att, aff_att = classification_vraie(groupe)
            if groupe == "G13_frontieres" and i >= n // 2:
                cfg_att, aff_att = ("DEUX COURANTS", "DEUX COURANTS")
            couples.append({
                "id": f"{groupe}_{i}",
                "groupe": groupe,
                "scores_det": scores_det,
                "scores_chg": scores_chg,
                "voies_p1": voies[0],
                "voies_p2": voies[1],
                "classification_vraie": cfg_att,
                "affichage_attendu": aff_att,
            })
        classes_spec[groupe] = n
    return couples, classes_spec


def resume_groupes(couples):
    """Stats par groupe : N, conformité config/affichage, warnings."""
    stats = {}
    for groupe, n, _cell in GROUPES:
        rows = [c for c in couples if c["groupe"] == groupe]
        stats[groupe] = {"N": n, "rows": rows}
    return stats
