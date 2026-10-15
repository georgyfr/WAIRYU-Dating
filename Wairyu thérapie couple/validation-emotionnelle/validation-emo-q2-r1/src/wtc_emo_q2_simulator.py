# -*- coding: utf-8 -*-
"""WAIRYU — WTC-EMO-Q2-02 : simulateur à vérité cachée. seed = 42.
D-PARAM APPLIQUÉ : bruit item σ = 0,60 (spécifié — identique aux
bornes D-STD, écart structurel exclu).

WTC-EMO-Q2-R1 (révision post-validation) :
- M1 : label attendu E5 corrigé → "BESOIN VIVANT, FORMULATION MIXTE"
  (hypothèse 1 de l'arbitrage S-EMO-Q2-3 — la table avait un label
  orphelin, le code était juste)
- M2 : ajout du cas E6 (n=20) : mu_RC = 2,0 · rc_d_mean = 4,2 → label
  attendu "FORMULATION ACQUISE" (test du 4e débouché de l'arbre,
  D-VÉRITÉ vérifiée avant exécution)
"""
import numpy as np
rng = np.random.default_rng(42)

def gen(n, mu_invD, mu_invR, mu_RC, rc_d_mean, mu_re1, mu_re2,
        score_A, i_alarm, h_norm):
    out = []
    for _ in range(n):
        def it(mu):
            return int(np.clip(round(rng.normal(mu, 0.60)), 1, 5))
        rep = {k: it(mu_invD) for k in ["INV-D1","INV-D2","INV-D3"]}
        rep.update({k: it(mu_invR) for k in ["INV-R1","INV-R2","INV-R3"]})
        rep.update({k: it(mu_RC) for k in ["RC-1","RC-2","RC-3"]})
        rep["RE-1"] = it(mu_re1); rep["RE-2"] = it(mu_re2)
        out.append({"rep": rep,
                    "rc_d": int(np.clip(round(rng.normal(rc_d_mean, 0.7)), 1, 5)),
                    "score_A": score_A, "i_alarm": i_alarm,
                    "h_norm": h_norm})
    return out

GROUPES = {
  "E1_invalidant_pur":   gen(100, 4.2, 2.0, 2.0, 3.0, 2.0, 2.0, 2.0, 3, 0.15),
  "E2_invalide_code":    gen(100, 2.0, 4.2, 3.8, 2.0, 3.5, 3.8, 3.3, 6, 0.35),
  "E3_boucle_complete":  gen(80,  3.9, 3.7, 3.6, 2.0, 3.8, 4.0, 3.4, 7, 0.40),
  "E4_sain":             gen(100, 1.5, 1.6, 2.0, 4.0, 2.0, 2.2, 2.0, 3, 0.15),
  "E5_code_sain":        gen(20,  1.6, 1.6, 3.5, 4.2, 2.0, 2.0, 2.0, 3, 0.10),
  # M2 (R1) : E6 — besoin discret + formulation explicite → FORMULATION ACQUISE
  "E6_formulation_acquise": gen(20, 1.6, 1.6, 2.0, 4.2, 2.0, 2.0, 2.0, 3, 0.10),
}
# Vérité cachée (labels attendus — R1) :
#   E1 : inv-donnée FRÉQUENT · reproche discret · boucle inactive
#   E2 : inv-reçue FRÉQUENT · REPROCHE-CODE ACTIF · boucle ACTIVE
#   E3 : les deux présentes · REPROCHE-CODE ACTIF · boucle ACTIVE
#   E4 : tout ABSENT/DISCRET · formulation acquise (m<3, form≥3)
#   E5 : M1 corrigé → BESOIN VIVANT, FORMULATION MIXTE (m≥3, form≥3)
#        (le code mesuré haut + formulation explicite = besoin vivant,
#         pas reproche-code — le cas le plus commun des couples réels)
#   E6 : M2 ajouté → FORMULATION ACQUISE (m<3, form≥3)
#        (besoin discret + formulation explicite = le succès, le couple
#         a déjà résolu)
#
# D-VÉRITÉ (R1) : inventaire croisé vérifié AVANT exécution
#   {labels moteur} = {REPROCHE-CODE ACTIF, BESOIN VIVANT FORMULATION MIXTE,
#                      BESOIN DISCRET, FORMULATION ACQUISE}
#   {labels table}  = {BESOIN DISCRET (E1), REPROCHE-CODE ACTIF (E2,E3),
#                      FORMULATION ACQUISE (E4,E6),
#                      BESOIN VIVANT FORMULATION MIXTE (E5)}
#   → 4/4 = 4/4, aucun label orphelin. ✅

TRAPS = {
  "SANS_SIGNAL": [   # 30 profils : tout bas, sA bas → 🟢 attendu
      {"rep": {"INV-D1":1,"INV-D2":1,"INV-D3":1,"INV-R1":1,"INV-R2":1,
               "INV-R3":1,"RC-1":1,"RC-2":1,"RC-3":1,"RE-1":1,"RE-2":2},
       "rc_d": 5, "score_A": 2.0, "i_alarm": 3, "h_norm": 0.10}
      for _ in range(30)],
  "GRAVE": [         # 10 profils : inv-donnée ≥ 4,0 moyenne, boucle
      {"rep": {"INV-D1":5,"INV-D2":5,"INV-D3":4,"INV-R1":2,"INV-R2":2,
               "INV-R3":2,"RC-1":4,"RC-2":4,"RC-3":4,"RE-1":4,"RE-2":4},
       "rc_d": 2, "score_A": 3.3, "i_alarm": 7, "h_norm": 0.35}
      for _ in range(10)],
}
