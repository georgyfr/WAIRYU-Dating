# -*- coding: utf-8 -*-
"""WAIRYU — WTC-EMO-Q4-02 : simulateur croisé 2×400. seed = 42.
D-PARAM : bruit items devise σ = 0,60 (spécifié — identique aux
bornes D-STD). D-VÉRITÉ : config_vraie ré-implémente la logique
de configuration_devises indépendamment (inventaire croisé
9/9 = 9/9 avant exécution)."""
import numpy as np
rng = np.random.default_rng(42)

CANALS = ["paroles", "temps", "contact"]
CONFIG_LABELS = [
    "LANGUE COMMUNE", "DONNEUR NON CONVERTI (A)",
    "DONNEUR NON CONVERTI (B)", "LANGUE DORMANTE",
    "CROISÉE (À CONVERTIR)", "MIXTE POURSUITE", "MIXTE RETRAIT",
    "FEU CROISÉ", "ÉQUILIBRÉE MIXTE",
]

def gen_partenaire(n, donne_mu, recoit_mu, bid_d_mu, bid_r_mu,
                   er1_mu, inv_d_zone, score_A, label_ombre):
    out = []
    for _ in range(n):
        donne = {c: int(np.clip(round(rng.normal(donne_mu, 0.60)), 1, 5))
                 for c in CANALS}
        recoit = {c: int(np.clip(round(rng.normal(recoit_mu, 0.60)), 1, 5))
                  for c in CANALS}
        bid_d = int(np.clip(round(rng.normal(bid_d_mu, 0.7)), 1, 5))
        bid_r = int(np.clip(round(rng.normal(bid_r_mu, 0.7)), 1, 5))
        er1 = round(float(np.clip(rng.normal(er1_mu, 0.60), 1, 5)), 2)
        out.append({"donne": donne, "recoit": recoit,
                    "bid_d": bid_d, "bid_r": bid_r,
                    "er1_m": er1, "inv_d_zone": inv_d_zone,
                    "score_A": score_A, "label_ombre": label_ombre})
    return out

GROUPES_CROISES = {
    "LANGUE COMMUNE": (
        gen_partenaire(50, 4.0, 3.0, 4.0, 4.0, 2.0, "ABSENT", 2.0, "ZONE CALME"),
        gen_partenaire(50, 4.0, 3.0, 4.0, 4.0, 2.0, "ABSENT", 2.0, "ZONE CALME"),
    ),
    "DONNEUR NON CONVERTI (A)": (
        gen_partenaire(50, 4.5, 2.0, 4.0, 3.0, 2.0, "ABSENT", 2.0, "ZONE CALME"),
        gen_partenaire(50, 1.8, 4.5, 2.5, 4.0, 2.0, "ABSENT", 2.0, "ZONE CALME"),
    ),
    "DONNEUR NON CONVERTI (B)": (
        gen_partenaire(50, 1.8, 4.5, 2.5, 4.0, 2.0, "ABSENT", 2.0, "ZONE CALME"),
        gen_partenaire(50, 4.5, 2.0, 4.0, 3.0, 2.0, "ABSENT", 2.0, "ZONE CALME"),
    ),
    "LANGUE DORMANTE": (
        gen_partenaire(50, 1.5, 1.5, 2.0, 2.0, 2.0, "ABSENT", 2.0, "ZONE CALME"),
        gen_partenaire(50, 1.5, 1.5, 2.0, 2.0, 2.0, "ABSENT", 2.0, "ZONE CALME"),
    ),
    "CROISÉE (À CONVERTIR)": (
        gen_partenaire(50, 4.2, 2.2, 3.5, 2.5, 2.2, "ABSENT", 2.0, "ZONE CALME"),
        gen_partenaire(50, 2.0, 4.2, 2.5, 3.5, 2.2, "ABSENT", 2.0, "ZONE CALME"),
    ),
    "MIXTE POURSUITE": (
        gen_partenaire(50, 3.5, 3.5, 4.2, 2.0, 3.8, "FRÉQUENT", 3.4, "PEUR DE PERDRE"),
        gen_partenaire(50, 2.0, 2.5, 2.0, 4.0, 2.0, "ABSENT", 2.2, "ZONE CALME"),
    ),
    "MIXTE RETRAIT": (
        gen_partenaire(50, 2.0, 2.5, 2.0, 4.0, 2.0, "ABSENT", 2.2, "ZONE CALME"),
        gen_partenaire(50, 3.5, 3.5, 4.2, 2.0, 3.8, "FRÉQUENT", 3.4, "PEUR DE PERDRE"),
    ),
    "FEU CROISÉ": (
        gen_partenaire(50, 3.8, 3.8, 4.2, 2.0, 3.9, "FRÉQUENT", 3.5, "PEUR DE PERDRE"),
        gen_partenaire(50, 3.8, 3.8, 4.2, 2.0, 3.9, "FRÉQUENT", 3.5, "PEUR DE PERDRE"),
    ),
    "ÉQUILIBRÉE MIXTE": (
        gen_partenaire(50, 3.0, 3.0, 3.0, 3.0, 2.5, "OCCASIONNEL", 2.4, "PEUR DE PERDRE"),
        gen_partenaire(50, 3.0, 3.0, 3.0, 3.0, 2.5, "OCCASIONNEL", 2.4, "PEUR DE PERDRE"),
    ),
}

def config_vraie(donne_A, recoit_A, donne_B, recoit_B,
                 er1_A, er1_B, boucle_active, inv_A, inv_B):
    """M2 (R1) — D-VÉRITÉ : ré-implémentation INDÉPENDANTE de
    configuration_devises (logique canal dominant alignée).
    L'inventaire croisé attend 9/9 = 9/9."""
    vivacite = {c: donne_A[c] + donne_B[c] + recoit_A[c] + recoit_B[c]
                for c in CANALS}
    canal_dominant = max(CANALS, key=lambda c: vivacite[c])
    if er1_A >= 3.0 and er1_B >= 3.0 and boucle_active:
        return "FEU CROISÉ"
    if boucle_active and inv_A == "FRÉQUENT" and inv_B == "ABSENT":
        return "MIXTE POURSUITE"
    if boucle_active and inv_B == "FRÉQUENT" and inv_A == "ABSENT":
        return "MIXTE RETRAIT"
    dA = donne_A[canal_dominant]
    rA = recoit_A[canal_dominant]
    dB = donne_B[canal_dominant]
    rB = recoit_B[canal_dominant]
    if dA >= 3 and rA >= 3 and dB >= 3 and rB >= 3:
        return "LANGUE COMMUNE"
    if dA >= 4 and rB <= 2:
        return "DONNEUR NON CONVERTI (A)"
    if dB >= 4 and rA <= 2:
        return "DONNEUR NON CONVERTI (B)"
    if dA <= 2 and rA <= 2 and dB <= 2 and rB <= 2:
        return "LANGUE DORMANTE"
    canal_don_fort_A = max(CANALS, key=lambda c: donne_A[c])
    canal_don_fort_B = max(CANALS, key=lambda c: donne_B[c])
    if (donne_A[canal_don_fort_A] >= 4 and
            donne_B[canal_don_fort_B] >= 4 and
            canal_don_fort_A != canal_don_fort_B):
        return "CROISÉE (À CONVERTIR)"
    return "ÉQUILIBRÉE MIXTE"
