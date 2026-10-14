# -*- coding: utf-8 -*-
"""
WTC-Q1 — Simulateur (Spécification 3)
=====================================
Seed = 42, numpy (générateur PCG64 via np.random.default_rng).

Population :
  A) 500 répondants HONNÊTES en 4 groupes (latents connus) ;
  B) 20 PIÉGés en 4 types de triche connus.

ORDRE DE TIRAGE FIGÉ (exigence de reproductibilité C4) :
  Honnêtes : groupes G1 → G2 → G3 → G4 ; pour chaque répondant :
      latent_A, latent_B, puis items 1 → 18 (un tirage chacun),
      puis 19 temps de réponse (18 items + vigilance).
  Piégés : 7 linéaires → 6 speeders → 4 acquiesceurs → 3 vigilance ratée,
      dans cet ordre (les linéaires et acquiesceurs ne consomment pas d'aléa
      pour leurs items/temps, constants par construction).

RÉVISION R1 — MODIFICATION D4 (orchestrateur) :
  « Simulateur : items inversés — génération sur l'échelle CORRIGÉE puis
  stockage en brut (brut_inversé = 5 − valeur corrigée). Lecture
  psychométrique confirmée par l'orchestrateur. »
  C'est EXACTEMENT l'implémentation retenue au run initial (choix S1) :
  u_i ~ Normal(latent de son axe, 0,5), borné [1;4] (clip), arrondi entier,
  puis brut_i = u_i (items directs) ou brut_i = 5 − u_i (items inversés 5, 15).
  Le signal S1 du run initial est donc RÉSOLU : la lecture psychométrique est
  confirmée, l'exécution de sensibilité « littérale » n'est plus exécutée (le
  paramètre items_inverses_litteraux est conservé pour archivage/tracabilité,
  mais le pipeline R1 ne l'appelle plus).

Autres choix d'interprétation (sans impact sur les critères, signalés Section F) :
  - « borné » = troncature par clip (et non re-tirage) ;
  - arrondi entier = np.round (arrondi bancaire ; événement de mesure nulle
    sur des tirages continus) ;
  - « temps uniformes 5,0 s / 6,0 s » (linéaires, acquiesceurs) = temps
    CONSTANTS (intervalles non précisés dans la spec) ;
  - les 19 questions sont chronométrées (18 items + vigilance).
"""

from __future__ import annotations

import numpy as np

SEED = 42

# (id, nom, n, mu_A, mu_B)
GROUPES = [
    ("G1", "tranquille", 200, 2.0, 2.1),
    ("G2", "peur de perdre", 150, 3.1, 2.1),
    ("G3", "peur de dépendre", 100, 2.1, 3.2),
    ("G4", "ambivalent", 50, 3.1, 3.1),
]

# Types de piégés : (type, n) — 7 + 6 + 4 + 3 = 20
PIEGES = [
    ("lineaire", 7),
    ("speeder", 6),
    ("acquiesceur", 4),
    ("vigilance_ratee", 3),
]

# Paramètres de tirage (Spécification 3)
SD_LATENT = 0.35
MU_ITEM, SD_ITEM = 0.5, 0.5  # item ~ Normal(latent, 0,5) — mu du bruit inutilisé, gardé lisible
ITEM_BORNES = (1.0, 4.0)
TEMPS_MU, TEMPS_SD = 6.0, 2.0
TEMPS_BORNES = (2.5, 15.0)
VIGILANCE_OK = 3
VIGILANCE_RATEE = 4


def _tire_temps_honnetes(rng: np.random.Generator, n: int = 19) -> np.ndarray:
    """Temps de réponse honnêtes : Normal(6,0 s ; 2,0 s) borné [2,5 ; 15] (clip)."""
    return np.clip(rng.normal(TEMPS_MU, TEMPS_SD, n), TEMPS_BORNES[0], TEMPS_BORNES[1])


def _tire_item_corrige(rng: np.random.Generator, latent: float) -> int:
    """Un item tiré sur l'échelle corrigée : Normal(latent, 0,5), borné [1;4], arrondi."""
    u = float(np.clip(rng.normal(latent, SD_ITEM), ITEM_BORNES[0], ITEM_BORNES[1]))
    return int(np.round(u))


def simule_honnetes(rng: np.random.Generator, items_inverses_litteraux: bool = False) -> list[dict]:
    """Groupe A — 500 honnêtes, 4 groupes, latents connus."""
    rows: list[dict] = []
    for gid, gnom, n, mu_a, mu_b in GROUPES:
        for _ in range(n):
            latent_a = float(rng.normal(mu_a, SD_LATENT))
            latent_b = float(rng.normal(mu_b, SD_LATENT))
            bruts: dict[int, int] = {}
            for i in range(1, 19):
                latent = latent_a if i <= 9 else latent_b
                u = _tire_item_corrige(rng, latent)
                if i in (5, 15) and not items_inverses_litteraux:
                    bruts[i] = 5 - u  # item inversé : brut opposé à la latente
                else:
                    # Lecture littérale (sensibilité) OU item direct : brut = tirage.
                    bruts[i] = u
            temps = _tire_temps_honnetes(rng, 19)
            row = {
                "groupe": gid,
                "groupe_nom": gnom,
                "mu_A_param": mu_a,
                "mu_B_param": mu_b,
                "latent_A": round(latent_a, 6),
                "latent_B": round(latent_b, 6),
                "vigilance": VIGILANCE_OK,
            }
            for i in range(1, 19):
                row[f"r{i}"] = bruts[i]
            for q in range(1, 20):
                row[f"t{q}"] = round(float(temps[q - 1]), 4)
            rows.append(row)
    return rows


def simule_pieges(rng: np.random.Generator) -> list[dict]:
    """Groupe B — 20 piégés, types de triche connus."""
    rows: list[dict] = []
    for type_piege, n in PIEGES:
        for _ in range(n):
            row: dict = {"type_piege": type_piege, "vigilance": VIGILANCE_OK}
            if type_piege == "lineaire":
                # Tous items = 2 · temps constants 5,0 s · vigilance OK
                for i in range(1, 19):
                    row[f"r{i}"] = 2
                for q in range(1, 20):
                    row[f"t{q}"] = 5.0
            elif type_piege == "speeder":
                # Items aléatoires 1-4 · temps uniformes [1,0 ; 1,4] s · vigilance OK
                for i in range(1, 19):
                    row[f"r{i}"] = int(rng.integers(1, 5))
                temps = rng.uniform(1.0, 1.4, 19)
                for q in range(1, 20):
                    row[f"t{q}"] = round(float(temps[q - 1]), 4)
            elif type_piege == "acquiesceur":
                # Tous items = 4 · temps constants 6,0 s · vigilance OK
                for i in range(1, 19):
                    row[f"r{i}"] = 4
                for q in range(1, 20):
                    row[f"t{q}"] = 6.0
            elif type_piege == "vigilance_ratee":
                # Items aléatoires · temps 6,0 s · vigilance = 4 (ratée : attendu 3)
                for i in range(1, 19):
                    row[f"r{i}"] = int(rng.integers(1, 5))
                for q in range(1, 20):
                    row[f"t{q}"] = 6.0
                row["vigilance"] = VIGILANCE_RATEE
            else:
                raise ValueError(f"Type de piège inconnu : {type_piege}")
            rows.append(row)
    return rows


def simule_tout(seed: int = SEED, items_inverses_litteraux: bool = False):
    """Pipeline de simulation complet — déterministe pour un seed donné.

    Retour : (liste honnêtes, liste piégés)
    """
    rng = np.random.default_rng(seed)
    honnetes = simule_honnetes(rng, items_inverses_litteraux=items_inverses_litteraux)
    pieges = simule_pieges(rng)
    return honnetes, pieges
