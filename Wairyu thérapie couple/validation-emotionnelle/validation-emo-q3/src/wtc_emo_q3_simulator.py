# -*- coding: utf-8 -*-
"""WAIRYU — WTC-EMO-Q3-02 : simulateur à vérité cachée. seed = 42.
D-PARAM : bruit items échelle C et faces E-R σ = 0,60 (spécifié —
identique aux bornes D-STD).
D-VÉRITÉ : forces_vraies() ré-implémente les conditions
indépendamment — l'inventaire croisé {labels moteur} = {labels
simulateur} est fourni AVANT exécution (7/7 attendu)."""
import numpy as np
rng = np.random.default_rng(42)

FORCE_ORDER = ["F-E1", "F-E2", "F-E3", "F-E4", "F-E5", "F-E6"]
CAP_TYPES = ["AC", "PC", "AD", "PD"]

def _tirer_cap(dist):
    """Tirage d'un type de capitalisation selon la distribution
    {type: proba} du groupe."""
    r = rng.random()
    cum = 0.0
    for t in CAP_TYPES:
        cum += dist.get(t, 0.0)
        if r < cum:
            return t
    return CAP_TYPES[-1]

def gen(n, mu_er1, mu_er3, c_mean, cap_dist, j_rate, j_mean, dexp_p):
    """n profils : cA/cB/cC ~ Normal(c_mean, 0,60) borné [1;5] ;
    cap tiré selon cap_dist ; er1_m/er3_m ~ Normal(mu, 0,60) borné
    [1;5] ; journal présent avec proba j_rate (compteurs ~
    Normal(j_mean, 1,5) borné [0;7], N ~ [0;3), complete=True) ;
    d_exp ~ Bernoulli(dexp_p → 3, sinon [1;3])."""
    out = []
    for _ in range(n):
        c = {k: int(np.clip(round(rng.normal(c_mean, 0.60)), 1, 5))
             for k in ["C-A", "C-B", "C-C"]}
        cap = _tirer_cap(cap_dist)
        j = None
        if rng.random() < j_rate:
            j = {"t": int(np.clip(round(rng.normal(j_mean, 1.5)), 0, 7)),
                 "u": int(np.clip(round(rng.normal(j_mean, 1.5)), 0, 7)),
                 "l": int(np.clip(round(rng.normal(j_mean, 1.5)), 0, 7)),
                 "m": int(np.clip(round(rng.normal(j_mean, 1.5)), 0, 7)),
                 "n": int(rng.integers(0, 3)),
                 "complete": True}
        d_exp = 3 if rng.random() < dexp_p else int(rng.integers(1, 3))
        out.append({
            "cA": c["C-A"], "cB": c["C-B"], "cC": c["C-C"],
            "cap": cap,
            "er1_m": round(float(np.clip(
                rng.normal(mu_er1, 0.60), 1.0, 5.0)), 2),
            "er3_m": round(float(np.clip(
                rng.normal(mu_er3, 0.60), 1.0, 5.0)), 2),
            "journal": j,
            "d_exp": d_exp,
        })
    return out

GROUPES = {
    "H1_silencieux":   gen(120, 2.1, 2.1, 1.4,
                           {"PC": 0.70, "PD": 0.30}, 0.30, 1.5, 0.10),
    "H2_cap_ac":       gen(100, 2.3, 2.3, 2.2,
                           {"AC": 0.75, "PC": 0.25}, 0.60, 3.0, 0.40),
    "H3_ecoute_tient": gen(100, 2.2, 2.2, 3.6,
                           {"AC": 0.40, "PC": 0.35, "AD": 0.15,
                            "PD": 0.10}, 0.55, 3.5, 0.50),
    "H4_journal_actif": gen(80, 2.2, 2.2, 2.6,
                           {"AC": 0.50, "PC": 0.30, "AD": 0.10,
                            "PD": 0.10}, 0.85, 4.8, 0.45),
}

def sans_preuve(n):
    """Profils SANS aucune voie : C-A/B/C = 1 · D-EXP = 2 ·
    CAP = PC (tiède) · E-R bas · journal None → SILENCIEUSE
    obligatoire (40/40 — critère C1a éliminatoire)."""
    return [{"cA": 1, "cB": 1, "cC": 1, "cap": "PC",
             "er1_m": 2.0, "er3_m": 2.0,
             "journal": None, "d_exp": 2} for _ in range(n)]

def surcharge(n):
    """Profils SURCHARGÉS : ≥ 3 voies actives sur ≥ 3 forces →
    exactement 2 retenues par densité (C1c)."""
    return [{"cA": 4, "cB": 4, "cC": 4, "cap": "AC",
             "er1_m": 2.0, "er3_m": 2.0,
             "journal": {"t": 6, "u": 5, "l": 5, "m": 4, "n": 0,
                         "complete": True},
             "d_exp": 4} for _ in range(n)]

def cap_non_ac(n):
    """Profils CAP_NON_AC : CAP ∈ {PC, AD, PD} (jamais AC) et
    journal M = 3 (< 4) → F-E3 ne s'active par AUCUNE voie.
    Le test du cœur qui célèbre : la tiédeur ne fabrique pas de
    célébration (C3a — 15/15)."""
    out = []
    for _ in range(n):
        cap = ["PC", "AD", "PD"][int(rng.integers(0, 3))]
        out.append({"cA": 2, "cB": 2, "cC": 2, "cap": cap,
                    "er1_m": 2.2, "er3_m": 2.2,
                    "journal": {"t": 2, "u": 2, "l": 2, "m": 3,
                                "n": 1, "complete": True},
                    "d_exp": 3})
    return out

TRAPS = {
    "SANS_PREUVE": sans_preuve(40),
    "SURCHARGE": surcharge(20),
    "CAP_NON_AC": cap_non_ac(15),
}

# ─────────────────────────────────────────────────────────────
# D-VÉRITÉ — ré-implémentation INDÉPENDANTE des conditions
# (inventaire croisé fourni avant exécution : 7/7 attendu)
# ─────────────────────────────────────────────────────────────

def cond_journal_like(j):
    """Miroir indépendant de cond_journal (voies C)."""
    if j is None or not j.get("complete", False):
        return {f: False for f in FORCE_ORDER}
    t, u, l, m = j["t"], j["u"], j["l"], j["m"]
    return {"F-E1": l >= 4,
            "F-E2": u >= 4,
            "F-E3": m >= 4,
            "F-E4": m >= 4,
            "F-E5": (l >= 4 and m >= 3),
            "F-E6": u >= 3}

def forces_vraies(p):
    """Les forces vraies dérivées des MÊMES règles que le moteur,
    ré-implémentées indépendamment (audit croisé C2)."""
    ca = {}
    ca["F-E1"] = p["cA"] >= 2
    ca["F-E2"] = (p["er1_m"] <= 2.5 and p["cB"] >= 2) or p["cB"] >= 3
    ca["F-E3"] = p["cap"] == "AC"
    ca["F-E4"] = p["cC"] >= 2 or p["d_exp"] >= 3
    ca["F-E5"] = (p["er3_m"] <= 2.5 and p["cB"] >= 2) or p["cA"] >= 2
    ca["F-E6"] = p["cC"] >= 3
    cb = {}
    cb["F-E1"] = False   # pas de voie B pour F-E1 (fondation v1.1)
    cb["F-E2"] = False   # F-E2 : voie B supprimée (faute n°16)
    cb["F-E3"] = False
    cb["F-E4"] = False
    cb["F-E5"] = False
    cb["F-E6"] = False
    cj = cond_journal_like(p["journal"])
    cond = {f: (ca[f] or cb[f] or cj[f]) for f in FORCE_ORDER}
    actives = [f for f in FORCE_ORDER if cond[f]]
    if len(actives) <= 2:
        return sorted(actives)
    dens = {f: (int(ca[f]) + int(cb[f]) + int(cj[f])) for f in actives}
    tri = sorted(actives, key=lambda f: (-dens[f], FORCE_ORDER.index(f)))
    return sorted(tri[:2], key=lambda f: FORCE_ORDER.index(f))
