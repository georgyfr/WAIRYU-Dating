# -*- coding: utf-8 -*-
"""WAIRYU — WTC-EXT-Q2-02 : simulateur Extensions Q2 (croisement à deux).
650 couples · 14 groupes · seed 42 ×2 (D-SIM) · σ_item = 0,60 (D-PARAM).
Entrées = sorties RIO-16 des deux rives (A2-a : zéro item nouveau) — la
mécanique RIO-16 verrouillée (addf575 : L1-L3) est ré-implémentée ici pour
produire les sorties consommées par le croisement (ré-implémentation
indépendante = croisé D-VÉRITÉ). Classification VRAIE ancrée sur les μ vrais.
Population de référence percentiles : 2 000 profils, seed 42, N(3,0 ; 0,8)
(placeholder L2 — à remplacer par le pilote).
Groupes : 9 configurations × 50 (G01-G09) · SIGNAL_FILET 40 (crise héritée
d'UNE rive — override avant verdict, idx ≥ 35 : items Forte) ·
ÉCART_PERCENTILES 40 (boucle probable ≥ 30 — avertissement sans verdict) ·
STYLES_DISSEMBLABLES 40 (fil rouge RIVES_DISSEMBLABLES de Q1) ·
FRONTIÈRES_BORNES 40 (20 exactes pile sur 2,50/3,50 + 20 adjacentes) ·
ANTI_C6 40 (zone sereine affichée comme telle — rien à fabriquer)."""
import numpy as np
import wtc_ext_q2_core as _core

rng = np.random.default_rng(42)

SEED = 42
SIGMA_ITEM = 0.60
N_ITEMS = 18
ITEMS = [f"EXT-H1-{k}" for k in (1, 2, 3)] + [f"EXT-H2-{k}" for k in (1, 2, 3)] \
    + [f"EXT-L1-{k}" for k in (1, 2, 3)] + [f"EXT-L2-{k}" for k in (1, 2, 3)] \
    + [f"EXT-C1-{k}" for k in (1, 2, 3)] + [f"EXT-C2-{k}" for k in (1, 2, 3)]
INVERSES = {"EXT-H2-3", "EXT-C2-3"}
ITEM_VIGILANCE = "EXT-VIG"
FACES_NOMS = ("H1", "H2", "L1", "L2", "C1", "C2")

BORNES_CROISEMENT = (2.50, 3.50)
NIVEAUX_CROISEMENT = ["FAIBLE", "MODÉRÉE", "FORTE"]
PALIER_VERT, PALIER_ORANGE, PALIER_ROUGE = ("EXERCICE MAISON",
                                            "MODULE DE COUPLE", "ORIENTATION")
SEUIL_BOUCLE_PCT = 30.0
SEUIL_STYLES = 1.00
SEUIL_ASYM = 1.00

# Population de référence percentiles (L6, seed 42 — déterministe)
# Source unique : le core (calibration de l'instrument) — le simulateur consomme.
POPULATION = _core.POPULATION

# ── Géométrie (μ par face, source unique + calibration D-STD-2) ──────────────
GEOMETRIE = {
    "G01_CONFIG_1_MEME_HEURE":     {"A": {"H1": 1.8, "H2": 2.0, "L1": 2.4, "L2": 2.5, "C1": 2.3, "C2": 2.2},
                                    "B": {"H1": 1.8, "H2": 2.0, "L1": 2.4, "L2": 2.5, "C1": 2.3, "C2": 2.2}, "n": 50},
    "G02_CONFIG_2_CADRAN_EVEILLE": {"A": {"H1": 1.8, "H2": 1.9, "L1": 2.4, "L2": 2.4, "C1": 2.4, "C2": 2.4},
                                    "B": {"H1": 2.9, "H2": 3.1, "L1": 2.5, "L2": 2.5, "C1": 2.5, "C2": 2.5}, "n": 50},
    "G03_CONFIG_3_HORLOGE_SEULE":  {"A": {"H1": 1.8, "H2": 1.9, "L1": 2.4, "L2": 2.4, "C1": 2.4, "C2": 2.4},
                                    "B": {"H1": 3.8, "H2": 4.0, "L1": 2.0, "L2": 2.0, "C1": 2.0, "C2": 2.0}, "n": 50},
    "G04_CONFIG_4_ECHO_ATTEND":    {"A": {"H1": 2.9, "H2": 3.0, "L1": 2.5, "L2": 2.5, "C1": 2.5, "C2": 2.5},
                                    "B": {"H1": 1.8, "H2": 1.8, "L1": 2.4, "L2": 2.4, "C1": 2.4, "C2": 2.4}, "n": 50},
    "G05_CONFIG_5_DEUX_CADRANS":   {"A": {"H1": 2.9, "H2": 3.1, "L1": 2.5, "L2": 2.5, "C1": 2.5, "C2": 2.5},
                                    "B": {"H1": 3.0, "H2": 3.1, "L1": 2.55, "L2": 2.55, "C1": 2.55, "C2": 2.55}, "n": 50},
    "G06_CONFIG_6_HORLOGE_DEVANCE": {"A": {"H1": 2.9, "H2": 3.1, "L1": 2.5, "L2": 2.5, "C1": 2.5, "C2": 2.5},
                                     "B": {"H1": 3.8, "H2": 4.0, "L1": 2.45, "L2": 2.45, "C1": 2.45, "C2": 2.45}, "n": 50},
    "G07_CONFIG_7_SEULE_AUTRE_COTE": {"A": {"H1": 3.7, "H2": 4.0, "L1": 2.0, "L2": 2.0, "C1": 2.0, "C2": 2.0},
                                      "B": {"H1": 1.8, "H2": 1.8, "L1": 2.4, "L2": 2.4, "C1": 2.4, "C2": 2.4}, "n": 50},
    "G08_CONFIG_8_AUTRE_DEVANCE":  {"A": {"H1": 3.7, "H2": 4.0, "L1": 2.5, "L2": 2.5, "C1": 2.5, "C2": 2.5},
                                    "B": {"H1": 3.0, "H2": 3.1, "L1": 2.5, "L2": 2.5, "C1": 2.5, "C2": 2.5}, "n": 50},
    "G09_CONFIG_9_DEUX_VIVES":     {"A": {"H1": 3.8, "H2": 4.0, "L1": 2.2, "L2": 2.2, "C1": 2.2, "C2": 2.2},
                                    "B": {"H1": 3.9, "H2": 4.0, "L1": 2.2, "L2": 2.2, "C1": 2.2, "C2": 2.2}, "n": 50},
    "G10_SIGNAL_FILET":            {"A": {"H1": 2.4, "H2": 2.4, "L1": 2.4, "L2": 2.4, "C1": 2.4, "C2": 2.4},
                                    "B": {"H1": 2.4, "H2": 2.4, "L1": 2.4, "L2": 2.4, "C1": 2.4, "C2": 2.4},
                                    "n": 40, "filet": True},
    "G11_ECART_PERCENTILES":       {"A": {"H1": 1.9, "H2": 2.1, "L1": 2.3, "L2": 2.3, "C1": 2.3, "C2": 2.3},
                                    "B": {"H1": 2.9, "H2": 3.1, "L1": 3.8, "L2": 3.8, "C1": 3.8, "C2": 3.8},
                                    "n": 40, "boucle": True},
    "G12_STYLES_DISSEMBLABLES":    {"A": {"H1": 1.8, "H2": 1.8, "L1": 1.9, "L2": 1.9, "C1": 1.9, "C2": 1.9},
                                    "B": {"H1": 2.9, "H2": 3.0, "L1": 3.3, "L2": 3.3, "C1": 3.3, "C2": 3.3},
                                    "n": 40, "styles": True},
    "G13_FRONTIERES_BORNES":       {"A": {"H1": 2.5, "H2": 2.5, "L1": 2.5, "L2": 2.5, "C1": 2.5, "C2": 2.5},
                                    "B": {"H1": 3.5, "H2": 3.5, "L1": 2.5, "L2": 2.5, "C1": 2.5, "C2": 2.5},
                                    "n": 40, "frontieres": True,
                                    "bruite": {"A": {"H1": 2.5, "H2": 2.62, "L1": 2.4, "L2": 2.4, "C1": 2.4, "C2": 2.4},
                                               "B": {"H1": 3.4, "H2": 3.48, "L1": 2.4, "L2": 2.4, "C1": 2.4, "C2": 2.4}}},
    "G14_ANTI_C6_ZONE_SEREINE":    {"A": {"H1": 1.8, "H2": 1.9, "L1": 2.4, "L2": 2.5, "C1": 2.3, "C2": 2.2},
                                    "B": {"H1": 1.8, "H2": 1.9, "L1": 2.4, "L2": 2.5, "C1": 2.3, "C2": 2.2},
                                    "n": 40, "anti_c6": True},
}
N_CONFIG_GROUPS = 9

# Motifs EXACTS de FRONTIÈRES_BORNES (idx 0-19) — valeurs CORRIGÉES :
# rive A : H pile 2,50 · rive B : H pile 3,50 (tranchage inclusif vérifié)
PATTERN_EXACT_A = {"H": [2, 3, 2, 3, 2, 3], "L": [2, 3, 2, 3, 2, 3],
                   "C": [2, 3, 2, 3, 2, 3]}
PATTERN_EXACT_B = {"H": [3, 4, 3, 4, 3, 4], "L": [2, 3, 2, 3, 2, 3],
                   "C": [2, 3, 2, 3, 2, 3]}


def _item_corr(mu):
    """Item corrigé ~ N(mu, σ) tronqué [1,4] arrondi."""
    return int(np.clip(round(rng.normal(mu, SIGMA_ITEM)), 1, 4))


def _corr_from_mu(mu_faces):
    """18 valeurs corrigées depuis les μ de faces."""
    out = []
    for face in FACES_NOMS:
        for _ in range(3):
            out.append(int(np.clip(round(rng.normal(mu_faces[face], SIGMA_ITEM)), 1, 4)))
    return out


def _exact_corr(pattern):
    """18 valeurs corrigées depuis un motif exact par axe."""
    out = []
    for axe in ("H", "L", "C"):
        out.extend(pattern[axe])
    return out


def _corr_to_raws(corr):
    """Convertit les valeurs corrigées en réponses brutes (inversés : 5 − c)."""
    raws = {}
    for it, c in zip(ITEMS, corr):
        raws[it] = int(5 - c) if it in INVERSES else int(c)
    return raws


def _temps():
    t = {it: float(np.clip(rng.normal(4.5, 1.2), 1.0, None)) for it in ITEMS}
    t[ITEM_VIGILANCE] = float(np.clip(rng.normal(4.5, 1.2), 1.0, None))
    return t, float(sum(t.values()) + rng.normal(10.0, 3.0))


# ═══════ Ré-implémentation des sorties RIO-16 (mécanique verrouillée) ════════
def corrige(item, raw):
    return round(5.0 - float(raw), 2) if item in INVERSES else round(float(raw), 2)


def calcule_rqs(raws, temps_items, temps_session):
    """L1 verbatim (ligne 257) — mêmes règles que RIO-16 (addf575)."""
    corr = {i: corrige(i, raws[i]) for i in ITEMS}
    penalites = []
    vals = [corr[i] for i in ITEMS]
    m = sum(vals) / len(vals)
    sd = (sum((v - m) ** 2 for v in vals) / len(vals)) ** 0.5
    if sd < 0.45:
        penalites.append(20)
    for inv in sorted(INVERSES):
        face = inv.rsplit("-", 1)[0]
        freres = [f for f in ITEMS if f.startswith(face) and f != inv]
        moi = corr[inv]
        autres = [corr[f] for f in freres]
        if abs(moi - sum(autres) / len(autres)) >= 2.5:
            penalites.append(20)
    rapides = sum(1 for t in temps_items.values() if t < 2.0)
    if rapides >= 5 or temps_session < 60.0:
        penalites.append(25)
    if float(raws.get(ITEM_VIGILANCE, 1)) > 1:
        penalites.append(20)
    rqs = max(0, 100 - sum(penalites))
    statut = "OK" if rqs >= 85 else ("PRUDENCE" if rqs >= 70 else "INVALIDE")
    return {"rqs": rqs, "statut": statut, "sd_items": round(sd, 4)}


def sortie_rive(profil):
    """Sortie RIO-16 d'une rive (ce que le croisement consomme) : statut RQS,
    filet, scores d'axes H/L/C, scores de faces, agrégat, moyenne."""
    raws = {i: profil[i] for i in ITEMS}
    raws[ITEM_VIGILANCE] = profil.get(ITEM_VIGILANCE, 1)
    rqs = calcule_rqs(raws, profil.get("temps_items", {}),
                      profil.get("temps_session", 999.0))
    corr = {i: corrige(i, raws[i]) for i in ITEMS}
    faces = {}
    for face in FACES_NOMS:
        items_face = [i for i in ITEMS if i.startswith(f"EXT-{face}-")]
        faces[face] = round(sum(corr[i] for i in items_face) / 3, 2)
    axes = {}
    for axe in ("H", "L", "C"):
        items_axe = [i for i in ITEMS if f"EXT-{axe}" in i]
        axes[axe] = round(sum(corr[i] for i in items_axe) / 6, 4)
    aggregate = round(sum(corr[i] for i in ITEMS) / N_ITEMS, 3)
    return {"rqs_statut": rqs["statut"], "rqs": rqs["rqs"],
            "filet": bool(profil.get("signal_herite", False)),
            "score_H": axes["H"], "score_L": axes["L"], "score_C": axes["C"],
            "faces": faces, "aggregate": aggregate, "moyenne": aggregate}


def _rive(mu_faces, groupe, idx, rive, filet=False, exact_pattern=None):
    if exact_pattern is not None:
        corr = _exact_corr(exact_pattern)
    else:
        corr = _corr_from_mu(mu_faces)
    raws = _corr_to_raws(corr)
    temps, session = _temps()
    p = {it: int(raws[it]) for it in ITEMS}
    p[ITEM_VIGILANCE] = 1
    p["temps_items"] = temps
    p["temps_session"] = round(session, 1)
    p["signal_herite"] = bool(filet)
    p["id"] = f"{groupe}_{idx:03d}_{rive}"
    p["groupe"] = groupe
    p["_mu_faces"] = dict(mu_faces)
    return p


def _gen_couple(gname, idx):
    g = GEOMETRIE[gname]
    mu_a, mu_b = dict(g["A"]), dict(g["B"])
    filet_a = filet_b = False
    exact_a = exact_b = None
    if g.get("filet"):
        filet_a = True  # crise héritée d'UNE rive (rive A) — suffisant (override)
        if idx >= 35:
            mu_a = {f: 3.8 for f in FACES_NOMS}  # items Forte : override quand même
    if g.get("frontieres") and idx < 20:
        exact_a, exact_b = PATTERN_EXACT_A, PATTERN_EXACT_B
    elif g.get("frontieres"):
        mu_a, mu_b = dict(g["bruite"]["A"]), dict(g["bruite"]["B"])
    couple = {
        "id": f"{gname}_{idx:03d}", "groupe": gname,
        "rive_a": _rive(mu_a, gname, idx, "A", filet=filet_a, exact_pattern=exact_a),
        "rive_b": _rive(mu_b, gname, idx, "B", filet=filet_b, exact_pattern=exact_b),
    }
    return couple


_COUPLES = None


def tous_les_couples():
    global _COUPLES
    if _COUPLES is None:
        out = []
        for gname, meta in GEOMETRIE.items():
            for i in range(meta["n"]):
                out.append(_gen_couple(gname, i))
        _COUPLES = out
    return _COUPLES


def effectifs():
    return [(name, meta["n"]) for name, meta in GEOMETRIE.items()]


# ═════════════ Classification VRAIE — ancrée sur les μ vrais ═════════════════
def _mu_H(mu_faces):
    return round((mu_faces["H1"] + mu_faces["H2"]) / 2, 4)


def _mu_axe(mu_faces, axe):
    return round((mu_faces[f"{axe}1"] + mu_faces[f"{axe}2"]) / 2, 4)


def _mu_agg(mu_faces):
    return round(sum(mu_faces.values()) / 6.0, 4)


def _niveau_vrai(mu):
    if mu < BORNES_CROISEMENT[0]:
        return NIVEAUX_CROISEMENT[0]
    if mu < BORNES_CROISEMENT[1]:
        return NIVEAUX_CROISEMENT[1]
    return NIVEAUX_CROISEMENT[2]


def _pct_vrai(mu_agg):
    import wtc_ext_q2_core as core
    return core.percentile_de(mu_agg, POPULATION)


def classification_vraie(couple):
    a, b = couple["rive_a"], couple["rive_b"]
    if a.get("signal_herite") or b.get("signal_herite"):
        return {"override": True}
    nA = _niveau_vrai(_mu_H(a["_mu_faces"]))
    nB = _niveau_vrai(_mu_H(b["_mu_faces"]))
    i, j = NIVEAUX_CROISEMENT.index(nA), NIVEAUX_CROISEMENT.index(nB)
    agg_a, agg_b = _mu_agg(a["_mu_faces"]), _mu_agg(b["_mu_faces"])
    pa, pb = _pct_vrai(agg_a), _pct_vrai(agg_b)
    return {
        "override": False, "config_num": i * 3 + j + 1,
        "boucle": abs(pa - pb) >= SEUIL_BOUCLE_PCT,
        "styles": round(abs(agg_a - agg_b), 2) >= SEUIL_STYLES,
        "asym_L": round(abs(_mu_axe(a["_mu_faces"], "L")
                            - _mu_axe(b["_mu_faces"], "L")), 2) >= SEUIL_ASYM,
        "asym_C": round(abs(_mu_axe(a["_mu_faces"], "C")
                            - _mu_axe(b["_mu_faces"], "C")), 2) >= SEUIL_ASYM,
    }


def conformite_couple(couple, cr):
    """Surface de décision : override (filet) OU (entrée + config + boucle +
    styles + asymétries L/C)."""
    vrai = classification_vraie(couple)
    if vrai["override"]:
        return cr["override"] is True
    if not cr["entree"] or cr["override"]:
        return False
    ok = (cr["config_num"] == vrai["config_num"]
          and cr["boucle_probable"] == vrai["boucle"]
          and cr["styles_dissemblables"] == vrai["styles"]
          and cr["asym_L"]["lecture"] == ("ASYMÉTRIE MARQUÉE" if vrai["asym_L"]
                                          else "asymétrie légère")
          and cr["asym_C"]["lecture"] == ("ASYMÉTRIE MARQUÉE" if vrai["asym_C"]
                                          else "asymétrie légère"))
    return ok
