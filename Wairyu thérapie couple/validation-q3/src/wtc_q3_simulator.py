# -*- coding: utf-8 -*-
"""WAIRYU — WTC-Q3-02 : simulateur à vérité cachée. seed = 42.
Règle de vérité : chaque profil porte ses forces vraies dérivées
des conditions remplies au moment de la génération — le moteur
doit les retrouver EXACTEMENT (le positif est déterministe)."""
import numpy as np
rng = np.random.default_rng(42)

def gen(n, muA, muB, p_c1_pres, p_c2, p_c3_set, journal_rate):
    out = []
    for _ in range(n):
        c1 = np.random.default_rng() # tirage du mode C1 selon p_c1_pres
        c1_mode = "PRES" if rng.random() < p_c1_pres else (
                  "ESP" if rng.random() < 0.3 else
                  "SOL" if rng.random() < 0.5 else "RIEN")
        c2 = int(rng.choice([0,1,2,3], p=[0.2,0.3,0.3,0.2]))
        c3 = [k for k in ["P","V","F","E","C","H","Pr","R","T"]
              if rng.random() < p_c3_set]
        j = None
        if rng.random() < journal_rate:
            j = {"T": int(rng.integers(0,8)), "U": int(rng.integers(0,8)),
                 "L": int(rng.integers(0,8)), "M": int(rng.integers(0,8)),
                 "N": int(rng.integers(0,3)), "phrases": None,
                 "complete": True}
        out.append({"c1_mode": c1_mode, "c2": c2, "c3": c3,
                    # [S-Q3-1 · RÉPARATION MÉCANIQUE AU STRICT MINIMUM — cf.
                    #  Section F : rng.sample() n'existe pas sur
                    #  numpy.random.Generator (AttributeError à l'import).
                    #  Équivalent minimal : choice(size=4, replace=False),
                    #  même sémantique (sans remise), même rng seedé 42.]
                    "c4": sorted(set(c3) & set(rng.choice(
                        ["P","V","F","E","C","H","Pr","R","T"], size=4,
                        replace=False))),
                    "sA": float(np.clip(rng.normal(muA, 0.25), 1.0, 4.0)),
                    "sB": float(np.clip(rng.normal(muB, 0.25), 1.0, 4.0)),
                    "h_norm": round(rng.uniform(0.05, 0.55), 3),
                    "r_norm": round(rng.uniform(0.05, 0.55), 3),
                    "label_ombre": ("ZONE CALME" if (muA < 2.61 and
                        muB < 2.61) else "PEUR DE PERDRE"),
                    "journal": j})
    return out

def forces_vraies(p):
    """La vérité cachée : les forces dérivées des MÊMES règles que
    le moteur — ré-implémentées indépendamment pour l'audit croisé
    (deux implémentations qui doivent coïncider : c'est le test)."""
    ca = {}
    ca["F1"] = (p["c1_mode"] in ("PRES","ESP")) or p["c2"] >= 2
    ca["F2"] = p["c2"] >= 2
    ca["F3"] = p["sA"] >= 2.61 or "V" in p["c3"]
    ca["F4"] = "F" in p["c3"]
    ca["F5"] = "R" in p["c3"]
    ca["F6"] = ("T" in p["c3"]) or ("Pr" in p["c3"])
    cb = {}
    cb["F1"] = p["sB"] >= 2.61
    cb["F2"] = p["sB"] >= 3.21 and p["h_norm"] >= p["r_norm"]
    cb["F3"] = p["sA"] >= 2.61
    # [S-Q3-14 · RÉPARATION MÉCANIQUE AU STRICT MINIMUM — cf. Section F :
    #  cb["F4"]/cb["F5"] n'étaient pas définies mais lues plus bas
    #  (KeyError 'F4'). Valeurs False, identiques à cond_B du cahier
    #  (« pas de voie B (exige journal ou C3) »).]
    cb["F4"] = False
    cb["F5"] = False
    cb["F6"] = p["label_ombre"] == "ZONE CALME"
    cj = ({f: v for f, v in cond_journal_like(p["journal"]).items()}
          if p["journal"] else {f: False for f in
          ["F1","F2","F3","F4","F5","F6"]})
    cond = {f: (ca[f] or cb[f] or cj[f])
            for f in ["F1","F2","F3","F4","F5","F6"]}
    actives = [f for f in ["F1","F2","F3","F4","F5","F6"] if cond[f]]
    if len(actives) <= 2: return sorted(actives)
    dens = {f: int(ca[f])+int(cb[f])+int(cj[f]) for f in actives}
    tri = sorted(actives, key=lambda f: (-dens[f],
                 ["F1","F2","F3","F4","F5","F6"].index(f)))
    return sorted(tri[:2], key=lambda f: ["F1","F2","F3","F4","F5",
                                          "F6"].index(f))

def cond_journal_like(j):   # miroir indépendant de cond_journal
    t,u,l,m = j["T"], j["U"], j["L"], j["M"]
    return {"F1": t >= 5, "F2": u >= 5, "F3": l >= 4,
            "F4": (t+u+l+m) >= 4, "F5": m >= 3, "F6": (t+m) >= 4}

GROUPES = {
 "G1_force_faible":  gen(150, 2.0, 2.0, 0.20, 1.0, 0.15, 0.4),
 "G2_force_claire":  gen(120, 2.3, 2.3, 0.70, 2.5, 0.45, 0.7),
 "G3_perdre_vive":   gen(80,  3.2, 2.1, 0.60, 2.0, 0.30, 0.6),
 "G4_dependre":      gen(50,  2.1, 3.3, 0.50, 2.0, 0.20, 0.6),
}

def sans_force(n):
    """Profils construits SANS aucune voie : RIEN en C1, C2=0, C3
    vide, scores bas, pas de journal → SILENCIEUSE obligatoire."""
    out = []
    for _ in range(n):
        out.append({"c1_mode":"RIEN","c2":0,"c3":[],"c4":[],
                    "sA":2.0,"sB":2.0,"h_norm":0.10,"r_norm":0.10,
                    "label_ombre":"ZONE CALME","journal":None})
    return out

def surcharge(n):
    """Profils à 4+ voies actives → la LIMITE des 2 forces doit
    s'appliquer avec la règle de densité (jamais 3, 4 ou 6)."""
    out = []
    for _ in range(n):
        out.append({"c1_mode":"PRES","c2":3,
                    "c3":["V","F","R","T","Pr"],
                    "sA":3.3,"sB":2.3,"h_norm":0.50,"r_norm":0.20,
                    "label_ombre":"PEUR DE PERDRE",
                    "journal":{"T":6,"U":5,"L":5,"M":4,"N":0,
                               "phrases":None,"complete":True}})
    return out

def asym_miroir(n):
    """C3 rempli, C4 volontairement disjoint → l'indicateur de
    cohérence miroir doit classer tout en 'secrets'."""
    out = []
    for _ in range(n):
        out.append({"c1_mode":"PRES","c2":2,
                    "c3":["E","C","H"],"c4":["P","R","T"],
                    "sA":2.4,"sB":2.4,"h_norm":0.2,"r_norm":0.2,
                    "label_ombre":"ZONE CALME","journal":None})
    return out

TRAPS = {"SANS_FORCE": sans_force(40), "SURCHARGE": surcharge(20),
         "ASYM_MIROIR": asym_miroir(15)}
