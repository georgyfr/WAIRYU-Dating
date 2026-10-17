# -*- coding: utf-8 -*-
"""WTC-SM-Q3 — simulateur (520 profils, 9 classes, seed 42).

D-PARAM : bruit σ_item = 0,60 (σ_eff face = 0,30).
Leçon grain (Q2 Section F) : centres à ≥ 0,5 pt du seuil 3,50 pour des
stats par classe serrées -> centres hauts 4,60 (1,1 pt au-dessus),
bas 2,00 (1,5 pt en dessous), mid 2,40 (1,1 pt en dessous).
classification_vraie ancrée sur les paramètres VRAIS (D-GÉOMÉTRIE).
"""
import numpy as np

import wtc_sm_q3_core as core

SEED = 42
SIGMA_ITEM = 0.60

_H = {"SM-P1": 4.6, "SM-P2": 4.6, "SM-P3": 4.6,
      "SM-N1": 4.6, "SM-N2": 4.6, "SM-N3": 4.6}
_L = {f: 2.0 for f in core.FACES}


def _centres(**sur):
    """kwargs à underscores -> clés faces à tirets (SM_P1 -> SM-P1)."""
    d = dict(_L)
    d.update({k.replace("_", "-"): v for k, v in sur.items()})
    return d


# (classe, N, centres, voies_heritees par profil, label attendu, forces attendues)
CLASSES = (
    ("G1_zone_calme", 70, _centres(), (),
     "SILENCIEUSE", ()),
    ("G2_p_haut", 70, _centres(SM_P1=4.6, SM_P2=4.6, SM_P3=4.6), (),
     "DEUX_LUMIÈRES", ("F-S1", "F-S3")),          # 3 actives -> limite
    ("G3_n_haut", 70, _centres(SM_N1=4.6, SM_N2=4.6, SM_N3=4.6), (),
     "DEUX_LUMIÈRES", ("F-S2", "F-S5")),          # 3 actives -> limite
    ("G4_tout_haut", 70, _centres(SM_P1=4.6, SM_P2=4.6, SM_P3=4.6,
                                  SM_N1=4.6, SM_N2=4.6, SM_N3=4.6), (),
     "DEUX_LUMIÈRES", ("F-S1", "F-S2")),          # 6 actives -> tie-break
    ("G5_p1_unique", 70, _centres(SM_P1=4.6), (),
     "LUMIÈRE_UNIQUE", ("F-S1",)),
    ("G6_crise_heritee", 50, _centres(SM_P1=4.6, SM_P2=4.6, SM_P3=4.6,
                                      SM_N1=4.6, SM_N2=4.6, SM_N3=4.6),
     ("VOIES",),
     "CRISE_HÉRITÉE", ()),                        # override A3
    ("G7_deux_pratiques", 50, _centres(SM_P1=4.6, SM_P2=4.6), (),
     "DEUX_LUMIÈRES", ("F-S1", "F-S3")),          # 2 actives, limite non déclenchée
    ("G8_frontiere", 40, _centres(SM_P1=4.6, SM_P2=2.4), (),
     "LUMIÈRE_UNIQUE", ("F-S1",)),                # P2 mid honnête (inactif)
    ("G9_n2_unique", 30, _centres(SM_N2=4.6), (),
     "LUMIÈRE_UNIQUE", ("F-S5",)),
)

# Répartition des voies héritées de G6 (30 SM-C1 + 20 H5)
G6_VOIES = [("SM-C1",)] * 30 + [("H5",)] * 20


def _gen_face(rng, mu):
    items = np.rint(rng.normal(mu, SIGMA_ITEM, size=4))
    return tuple(int(min(5, max(1, v))) for v in items)


def _voies_de(classe, idx_profil):
    if classe == "G6_crise_heritee":
        return G6_VOIES[idx_profil]
    return ()


def tous_les_profils():
    """-> (profils, classes_spec). profil : dict complet pré-classifié."""
    rng = np.random.default_rng(SEED)
    profils, spec = [], []
    for nom, n, centres, _v, label, forces in CLASSES:
        spec.append((nom, n, centres, _v, label, forces))
        for i in range(n):
            reps = {f: _gen_face(rng, centres[f]) for f in core.FACES}
            profils.append({
                "id": f"{nom}_{i}",
                "classe": nom,
                "reponses": reps,
                "voies_heritees": _voies_de(nom, i),
            })
    return profils, spec


def classification_vraie(classe):
    """Table de vérité — ancrée sur les paramètres VRAIS (D-GÉOMÉTRIE).
    -> (label attendu, forces attendues affichées, crise vraie, voie vraie)."""
    for nom, _n, _c, _v, label, forces in CLASSES:
        if nom == classe:
            crise = nom == "G6_crise_heritee"
            return label, list(forces), crise
    raise KeyError(classe)


def voie_vraie_de(profil):
    """Voie héritée vraie (traçabilité G6) — SM-C1 pour les 30 premiers, H5 ensuite."""
    if profil["classe"] != "G6_crise_heritee":
        return None
    return profil["voies_heritees"][0]


def resume_groupes(profils):
    """Stats par classe : N, distribution des statuts observés, corrects."""
    stats = {}
    for nom, n, _c, _v, label, forces in CLASSES:
        sous = [p for p in profils if p["classe"] == nom]
        obs = {}
        corrects = 0
        for p in sous:
            obs[p["resultat"]["statut"]] = obs.get(p["resultat"]["statut"], 0) + 1
            lab_ok = p["resultat"]["statut"] == label
            f_ok = p["resultat"]["forces_affichees"] == list(forces)
            if lab_ok and f_ok:
                corrects += 1
        stats[nom] = {
            "N": n, "dominante": label,
            "correct": corrects,
            "labels_observes": obs,
            "forces_attendues": list(forces),
        }
    return stats
