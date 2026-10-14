# -*- coding: utf-8 -*-
"""WAIRYU — WTC-Q2-02 : simulateur à vérité cachée. seed = 42.

RÉVISION R1 (package WTC-Q2-R1, réponse au rapport commit 0c3aaab) :
  · D-Q2-A — gen() BRANCHE fqH/fqR (S-Q2-1 clos à la source) : les
    fréquences uniformes U{1,2,3} sont remplacées par
    freq ~ Normal(fq, 0,5) borné [1;3], arrondi entier
    (fqH pour H, fqR pour R — valeurs de la spécification inchangées :
    T1 2,3/1,5 · T2 1,5/2,3 · T3 2,2/2,2 · T4 1,4/1,4).
    Les probabilités pH/pR NE CHANGENT PAS.
  · D-Q2-C — vides() corrigé dans le canonique : la réparation mécanique
    d'exécuteur de Q2 (S-Q2-8) est absorbée, sémantique identique.
  · D-Q2-E — 6 profils O7-NLP ajoutés (4 classifiables confiance 0,80 →
    catégorie attendue ; 2 sous seuil 0,70 → NON-CLASSIFIABLE attendu +
    force SILENCIEUSE acceptée).
Les GROUPES (n, pD, pP, pH, pR, fqH, fqR, mu_i, sd_i, muA, muB, origines),
les PIÉGÉS et les 8 ARÊTES sont conservés tels quels du fichier fourni.
"""

import numpy as np
rng = np.random.default_rng(42)
from wtc_q2_core import D_ITEMS, P_ITEMS, H_ITEMS, R_ITEMS


def gen(n, pD, pP, pH, pR, fqH, fqR, mu_i, sd_i, muA, muB, origines):
    """D-Q2-A — branchement fqH/fqR. Pour chaque case cochée :
    freq ~ Normal(fq, 0,5) borné [1;3], arrondi entier (fqH côté H, fqR côté R).
    Structure de tirage conservée : la case est d'abord tirée (rng.random() < p),
    la fréquence ensuite — la probabilité de cocher ne change pas."""
    out = []
    for _ in range(n):
        d = {k: int(rng.random() < pD) for k in D_ITEMS}
        p = {k: int(rng.random() < pP) for k in P_ITEMS}
        h = {k: (int(round(float(np.clip(rng.normal(fqH, 0.5), 1.0, 3.0))))
                 if rng.random() < pH else 0)
             for k in H_ITEMS}
        r = {k: (int(round(float(np.clip(rng.normal(fqR, 0.5), 1.0, 3.0))))
                 if rng.random() < pR else 0)
             for k in R_ITEMS}
        o = rng.random(); cum, ori = 0.0, list(origines)[-1]
        for k, w in origines.items():
            cum += w
            if o < cum: ori = k; break
        out.append({"d": d, "p": p, "h": h, "r": r, "origine": ori,
                    "i_alarm": int(np.clip(round(rng.normal(mu_i, sd_i)), 0, 10)),
                    "sA": float(np.clip(rng.normal(muA, 0.25), 1.0, 4.0)),
                    "sB": float(np.clip(rng.normal(muB, 0.25), 1.0, 4.0))})
    return out


ORIG_T1 = {"O2":0.35,"O3":0.30,"O4":0.20,"O6":0.15}
ORIG_T2 = {"O5":0.60,"O6":0.25,"O2":0.15}
ORIG_T3 = {"O6":0.50,"O2":0.20,"O5":0.20,"O3":0.10}
ORIG_T4 = {"O1":0.55,"O6":0.25,"O2":0.10,"O3":0.10}

GROUPES = {   # groupe : (données, type_vrai) — paramètres inchangés, fqH/fqR désormais utilisés par gen()
 "T1_PERDRE":   (gen(150,0.75,0.10,0.65,0.15,2.3,1.5,6.5,1.5,3.1,2.1,ORIG_T1), "PEUR DE PERDRE"),
 "T2_ETOUFFEE": (gen(100,0.10,0.70,0.15,0.65,1.5,2.3,6.0,1.5,2.1,3.2,ORIG_T2), "PEUR D'ÊTRE ÉTOUFFÉE"),
 "T3_LESDEUX":  (gen(50, 0.55,0.45,0.50,0.45,2.2,2.2,7.0,1.5,3.1,3.1,ORIG_T3), "LES DEUX"),
 "T4_CALME":    (gen(100,0.06,0.05,0.04,0.04,1.4,1.4,2.3,1.1,2.0,2.1,ORIG_T4), "ZONE CALME"),
}


def vides():
    return ({k:0 for k in D_ITEMS}, {k:0 for k in P_ITEMS},
            {k:0 for k in H_ITEMS}, {k:0 for k in R_ITEMS})


PIEGES = []
# 6 incohérents simple-axe : Q1 A vive, Q2 vide → C1 échoue →
# index 0,00 → l'ombre doit être SUPPRIMÉE (jamais nommée)
for _ in range(6):
    d,p,h,r = vides()   # D, P, H, R tous vides (utilisés) — inchangé du fichier fourni
    PIEGES.append({"d":d,"p":p,"h":h,"r":r,"i_alarm":1,
                   "sA":3.2,"sB":2.0,"origine":"O1","type":"INC_SIMPLE"})
# 4 incohérents double-axe : Q1 A,B vives ; D remplis (C1 passe),
# P vides et H_norm > R_norm (C2 échoue) → index 0,50 → PRUDENCE
for _ in range(4):
    d = {"D1":1,"D2":1,"D3":1,"D4":0,"D5":0,"D6":0}
    h = {"H1":2,"H2":0,"H3":0,"H4":0,"H5":0}; r = {k:0 for k in R_ITEMS}
    PIEGES.append({"d":d,"p":{k:0 for k in P_ITEMS},"h":h,"r":r,
                   "i_alarm":5,"sA":3.1,"sB":3.1,"origine":"O2",
                   "type":"INC_DOUBLE"})
# 8 sécurité H5 : H5=2, i_alarm=8, sA=3,3 → signal ACTIF attendu
for _ in range(8):
    h = {k:0 for k in H_ITEMS}; h["H5"] = 2
    d,p,_h,r = vides()   # D-Q2-C — dépaquetage canonique (S-Q2-8 absorbé, sémantique identique)
    PIEGES.append({"d":d,"p":p,"h":h,"r":r,"i_alarm":8,
                   "sA":3.3,"sB":2.0,"origine":"O3","type":"SEC_H5"})
# 5 P-FILTRE : H5=3 (souvent), i_alarm=6, sA=3,8 → p_filtre attendu
for _ in range(5):
    h = {k:0 for k in H_ITEMS}; h["H5"] = 3
    d,p,_h,r = vides()   # D-Q2-C — dépaquetage canonique (S-Q2-8 absorbé, sémantique identique)
    PIEGES.append({"d":d,"p":p,"h":h,"r":r,"i_alarm":6,
                   "sA":3.8,"sB":2.0,"origine":"O3","type":"PFILTRE"})

# BATTERIE D'ARÊTES C1c (profils construits, déterministes — 8 cas)
EDGES = [
 {"nom":"E1_lesdeux_priorite", "sA":3.3,"sB":3.3,
  "d":{"D1":1,"D2":1,"D3":1,"D4":1,"D5":0,"D6":0},
  "p":{"P1":1,"P2":1,"P3":1,"P4":0},
  "h":{"H1":3,"H2":3,"H3":0,"H4":0,"H5":0},"r":{"R1":1,"R2":0,"R3":0},
  "i_alarm":7,"attendu":"LES DEUX"},
 {"nom":"E2_perdre_pur", "sA":2.8,"sB":2.0,
  "d":{"D1":1,"D2":1,"D3":1,"D4":1,"D5":0,"D6":0},
  "p":{k:0 for k in P_ITEMS},
  "h":{"H1":3,"H2":3,"H3":0,"H4":0,"H5":0},"r":{k:0 for k in R_ITEMS},
  "i_alarm":6,"attendu":"PEUR DE PERDRE"},
 {"nom":"E3_suppression", "sA":3.2,"sB":2.0, "d":vides()[0],
  "p":vides()[1],"h":vides()[2],"r":vides()[3],
  "i_alarm":2,"attendu":"SIGNAL LÉGER NON NOMMÉ"},
 {"nom":"E4_lesdeux_counts", "sA":2.8,"sB":2.8,
  "d":{"D1":1,"D2":1,"D3":1,"D4":0,"D5":0,"D6":0},
  "p":{"P1":1,"P2":1,"P3":1,"P4":0},
  "h":{"H1":3,"H2":2,"H3":0,"H4":0,"H5":0},"r":{"R1":2,"R2":1,"R3":0},
  "i_alarm":7,"attendu":"LES DEUX"},
 {"nom":"E5_alarme_sans_main", "sA":2.0,"sB":2.0,
  "d":{"D1":1,"D2":0,"D3":0,"D4":0,"D5":0,"D6":0},
  "p":{k:0 for k in P_ITEMS},
  "h":{k:0 for k in H_ITEMS},"r":{"R1":1,"R2":0,"R3":0},
  "i_alarm":5,"attendu":"ALARME SANS MAIN"},
 {"nom":"E6_zone_calme", "sA":2.0,"sB":2.0,
  "d":{"D1":1,"D2":0,"D3":0,"D4":0,"D5":0,"D6":0},
  "p":{k:0 for k in P_ITEMS},
  "h":{k:0 for k in H_ITEMS},"r":{"R1":1,"R2":0,"R3":0},
  "i_alarm":3,"attendu":"ZONE CALME"},
 {"nom":"E7_lesdeux_q1", "sA":2.9,"sB":2.7,
  "d":{"D1":1,"D2":1,"D3":0,"D4":0,"D5":0,"D6":0},
  "p":{"P1":1,"P2":1,"P3":0,"P4":0},
  "h":{"H1":3,"H2":2,"H3":0,"H4":0,"H5":0},"r":{"R1":1,"R2":0,"R3":0},
  "i_alarm":6,"attendu":"LES DEUX"},
 {"nom":"E8_palier_rouge", "sA":2.4,"sB":2.0,
  "d":vides()[0],"p":vides()[1],
  "h":{"H1":3,"H2":0,"H3":0,"H4":0,"H5":3},"r":vides()[3],
  "i_alarm":9,"attendu_palier":"🔴"},
]

# D-Q2-E — 6 profils O7-NLP (routage NLP local, seuil de confiance 0,70,
# cf. ORIGINE_MAP : « O7 : LIBRE → NLP local, seuil 0,70 »).
# 4 classifiables (confiance 0,80 ≥ 0,70 → catégorie attendue) ;
# 2 sous seuil (< 0,70 → NON-CLASSIFIABLE attendu + force SILENCIEUSE acceptée).
# Les réponses sont déterministes ; l'étiquette reste produite par le moteur
# (Q1×Q2), le routage O7 ne porte que sur l'origine et la force.
O7_PROFILES = [
 {"nom":"O7-N01", "sA":1.9,"sB":2.0,
  "d":{k:0 for k in D_ITEMS},"p":{k:0 for k in P_ITEMS},
  "h":{k:0 for k in H_ITEMS},"r":{k:0 for k in R_ITEMS},
  "i_alarm":2, "nlp_categorie":"SÉCURISANT","nlp_confiance":0.80,
  "attendu":"SÉCURISANT"},
 {"nom":"O7-N02", "sA":2.9,"sB":2.2,
  "d":{"D1":1,"D2":1,"D3":1,"D4":1,"D5":0,"D6":0},
  "p":{k:0 for k in P_ITEMS},
  "h":{"H1":3,"H2":2,"H3":0,"H4":0,"H5":0},"r":{k:0 for k in R_ITEMS},
  "i_alarm":6, "nlp_categorie":"INVALIDATION","nlp_confiance":0.80,
  "attendu":"INVALIDATION"},
 {"nom":"O7-N03", "sA":3.0,"sB":3.0,
  "d":{"D1":1,"D2":1,"D3":1,"D4":1,"D5":0,"D6":0},
  "p":{"P1":1,"P2":1,"P3":1,"P4":0},
  "h":{"H1":3,"H2":2,"H3":1,"H4":0,"H5":0},"r":{"R1":2,"R2":1,"R3":0},
  "i_alarm":7, "nlp_categorie":"MIXTE","nlp_confiance":0.80,
  "attendu":"MIXTE"},
 {"nom":"O7-N04", "sA":2.2,"sB":3.0,
  "d":{k:0 for k in D_ITEMS},
  "p":{"P1":1,"P2":1,"P3":1,"P4":0},
  "h":{k:0 for k in H_ITEMS},"r":{"R1":3,"R2":2,"R3":1},
  "i_alarm":6, "nlp_categorie":"COMPOSITE","nlp_confiance":0.80,
  "attendu":"COMPOSITE"},
 {"nom":"O7-N05", "sA":1.9,"sB":2.0,
  "d":{k:0 for k in D_ITEMS},"p":{k:0 for k in P_ITEMS},
  "h":{k:0 for k in H_ITEMS},"r":{k:0 for k in R_ITEMS},
  "i_alarm":5, "nlp_categorie":"INDÉTERMINÉ","nlp_confiance":0.62,
  "attendu":"NON-CLASSIFIABLE"},
 {"nom":"O7-N06", "sA":2.3,"sB":2.4,
  "d":{"D1":1,"D2":0,"D3":0,"D4":0,"D5":0,"D6":0},
  "p":{k:0 for k in P_ITEMS},
  "h":{"H1":2,"H2":0,"H3":0,"H4":0,"H5":0},"r":{k:0 for k in R_ITEMS},
  "i_alarm":6, "nlp_categorie":"AMBIGU","nlp_confiance":0.55,
  "attendu":"NON-CLASSIFIABLE"},
]
