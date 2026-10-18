# -*- coding: utf-8 -*-
"""WAIRYU — WTC-EXT-Q1-02 : simulateur Extensions Q1 (Générationnelle).
520 couples · 12 groupes · seed 42 ×2 (D-SIM). σ_item = 0,60 (D-PARAM).
Classification VRAIE ancrée sur les paramètres vrais (μ sans bruit) —
ré-implémentation indépendante des règles (croisé, D-VÉRITÉ).
Pièges RQS (G09) DÉTERMINISTES (items constants, temps constants) :
  linéarité 80 PRUDENCE · contradiction 80 PRUDENCE · rythme 75 PRUDENCE
  (motif [3]×10+[2]×8 : SD 0,499 ≥ 0,45 — pas de linéarité) ·
  linéarité+rythme 55 INVALIDE · rythme+vigilance 55 INVALIDE.
Filet (G11) : voie héritée — court-circuit même sur items Forte (idx ≥ 35)."""
import numpy as np

rng = np.random.default_rng(42)

SEED = 42
SIGMA_ITEM = 0.60
ITEMS = [f"EXT-H1-{k}" for k in (1, 2, 3)] + [f"EXT-H2-{k}" for k in (1, 2, 3)] \
    + [f"EXT-L1-{k}" for k in (1, 2, 3)] + [f"EXT-L2-{k}" for k in (1, 2, 3)] \
    + [f"EXT-C1-{k}" for k in (1, 2, 3)] + [f"EXT-C2-{k}" for k in (1, 2, 3)]
INVERSES = {"EXT-H2-3", "EXT-C2-3"}
ITEM_VIGILANCE = "EXT-VIG"
SEUILS_NIVEAUX = (1.80, 2.60, 3.20)
CI90_DEMI = 0.4128
NIVEAUX = ["DISCRÈTE", "TRANQUILLE", "VIVE", "FORTE"]
PALIER_VERT, PALIER_ORANGE, PALIER_ROUGE = ("EXERCICE MAISON", "MODULE DE COUPLE",
                                            "ORIENTATION")
SEUIL_STYLES = 1.00
SEUIL_FIABLE, SEUIL_SUGGESTION = 0.58, 0.41
DELTAS_VRAIS_G12 = [0.70] * 15 + [0.50] * 10 + [0.15] * 15
GEOMETRIE = {
    "G01_HORLOGE_OUVERTE":       {"H1": 2.0, "H2": 3.0, "L1": 1.7, "L2": 2.5, "C1": 3.3, "C2": 1.7, "n": 50},
    "G02_HORIZON_FINI_SEREIN":   {"H1": 3.0, "H2": 2.4, "L1": 1.8, "L2": 2.5, "C1": 3.0, "C2": 1.9, "n": 50},
    "G03_TAXE_LOURDE":           {"H1": 2.0, "H2": 2.2, "L1": 4.0, "L2": 2.6, "C1": 2.4, "C2": 2.2, "n": 50},
    "G04_ZONE_CALME_GENERATION": {"H1": 2.5, "H2": 2.3, "L1": 2.2, "L2": 2.4, "C1": 2.5, "C2": 2.4, "n": 50},
    "G05_FRONTIERE_H":           {"H1": 2.75, "H2": 2.35, "L1": 1.7, "L2": 1.9, "C1": 2.0, "C2": 2.0, "n": 40},
    "G06_FRONTIERE_L":           {"H1": 2.0, "H2": 2.2, "L1": 2.7, "L2": 2.5, "C1": 1.9, "C2": 2.1, "n": 40},
    "G07_FRONTIERE_C":           {"H1": 2.1, "H2": 1.9, "L1": 1.8, "L2": 2.0, "C1": 2.75, "C2": 2.55, "n": 40},
    "G08_NUAGE":                 {"H1": 2.8, "H2": 2.6, "L1": 2.0, "L2": 2.2, "C1": 2.3, "C2": 2.5, "n": 40},
    "G09_PIEGES_RQS":            {"H1": 2.4, "H2": 2.4, "L1": 2.4, "L2": 2.4, "C1": 2.4, "C2": 2.4, "n": 40},
    "G10_RIVES_DISSEMBLABLES":   {"H1": 2.0, "H2": 2.0, "L1": 2.0, "L2": 2.0, "C1": 2.0, "C2": 2.0, "n": 40,
                                  "riveB": {"H1": 3.8, "H2": 3.8, "L1": 3.8, "L2": 3.8, "C1": 3.8, "C2": 3.8}},
    "G11_SIGNAL_FILET":          {"H1": 2.4, "H2": 2.4, "L1": 2.4, "L2": 2.4, "C1": 2.4, "C2": 2.4, "n": 40},
    "G12_RE_TEST":               {"H1": 2.4, "H2": 2.4, "L1": 2.4, "L2": 2.4, "C1": 2.4, "C2": 2.4, "n": 40},
}
FACES_NOMS = ("H1", "H2", "L1", "L2", "C1", "C2")

TRAP_CYCLE = (["linearite"] * 10 + ["contradiction"] * 10 + ["rythme"] * 10
              + ["invalide_rythme"] * 5 + ["vigilance"] * 5)
TRAP_STATUT_VRAI = {"linearite": "PRUDENCE", "contradiction": "PRUDENCE",
                    "rythme": "PRUDENCE", "invalide_rythme": "INVALIDE",
                    "vigilance": "INVALIDE"}
# Motif déterministe sans linéarité : SD = 0,499 ≥ 0,45
PATTERN_RYTHME = dict(zip(ITEMS, [3] * 10 + [2] * 8))


def _item_corr(mu):
    """Item corrigé ~ N(mu, σ) tronqué [1,4] arrondi."""
    return int(np.clip(round(rng.normal(mu, SIGMA_ITEM)), 1, 4))


def _face_de(item):
    return item.rsplit("-", 1)[0]


def _items_rive(mu_faces, trap=None):
    """Retourne (raws 18 items, vigilance) — pièges constants sinon échantillonnés."""
    if trap == "linearite":
        corr = {it: 3 for it in ITEMS}
        vig = 1
    elif trap == "invalide_rythme":
        corr = {it: 3 for it in ITEMS}
        vig = 1
    elif trap in ("rythme", "vigilance"):
        corr = dict(PATTERN_RYTHME)
        vig = 3 if trap == "vigilance" else 1
    elif trap == "contradiction":
        corr = {it: _item_corr(mu_faces[_face_de(it)[4:]]) for it in ITEMS}
        corr["EXT-H2-1"], corr["EXT-H2-2"], corr["EXT-H2-3"] = 1, 1, 4
        vig = 1
    else:
        corr = {it: _item_corr(mu_faces[_face_de(it)[4:]]) for it in ITEMS}
        vig = 1
    raws = {it: (5 - corr[it] if it in INVERSES else corr[it]) for it in ITEMS}
    return raws, vig


def _temps(trap=None):
    if trap in ("rythme", "invalide_rythme", "vigilance"):
        t = {it: 1.2 for it in ITEMS}
        t[ITEM_VIGILANCE] = 1.2
        return t, 40.0
    t = {it: float(np.clip(rng.normal(4.5, 1.2), 1.0, None)) for it in ITEMS}
    t[ITEM_VIGILANCE] = float(np.clip(rng.normal(4.5, 1.2), 1.0, None))
    return t, float(sum(t.values()) + rng.normal(10.0, 3.0))


def _rive(mu_faces, groupe, idx, rive, trap=None, delta_vrai=None, filet=False):
    raws, vig = _items_rive(mu_faces, trap=trap)
    temps, session = _temps(trap)
    p = {it: int(raws[it]) for it in ITEMS}
    p[ITEM_VIGILANCE] = int(vig)
    p["temps_items"] = temps
    p["temps_session"] = round(session, 1)
    p["signal_herite"] = bool(filet)
    p["id"] = f"{groupe}_{idx:03d}_{rive}"
    p["groupe"] = groupe
    p["_mu_faces"] = dict(mu_faces)
    p["_piege_vrai"] = TRAP_STATUT_VRAI[trap] if trap else None
    if delta_vrai is not None:
        mu_re = {f: mu + delta_vrai for f, mu in mu_faces.items()}
        raws_re, vig_re = _items_rive(mu_re)
        p["re_test_items"] = {it: int(raws_re[it]) for it in ITEMS}
        p["re_test_vig"] = int(vig_re)
        p["_delta_vrai"] = delta_vrai
    return p


def _gen_couple(gname, idx):
    g = GEOMETRIE[gname]
    mu_a = {f: g[f] for f in FACES_NOMS}
    mu_b = {f: g.get("riveB", mu_a)[f] for f in FACES_NOMS}
    trap = TRAP_CYCLE[idx] if gname == "G09_PIEGES_RQS" else None
    filet = gname == "G11_SIGNAL_FILET"
    if filet and idx >= 35:
        mu_a = {f: 3.8 for f in FACES_NOMS}
        mu_b = dict(mu_a)
    delta = DELTAS_VRAIS_G12[idx] if gname == "G12_RE_TEST" else None
    couple = {
        "id": f"{gname}_{idx:03d}", "groupe": gname,
        "rive_a": _rive(mu_a, gname, idx, "A", trap=trap, delta_vrai=delta, filet=filet),
        "rive_b": _rive(mu_b, gname, idx, "B", trap=trap, delta_vrai=delta, filet=filet),
        "re_test_actif": delta is not None,
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


# ═══════════ Classification VRAIE — ré-implémentation indépendante ═══════════
def _cons_local(mu):
    """Niveau conservateur d'un μ vrai — règle L3 ré-implémentée (croisé)."""
    bas = round(mu - CI90_DEMI, 2)
    haut = round(mu + CI90_DEMI, 2)
    t = []
    if bas < SEUILS_NIVEAUX[0]:
        t.append(NIVEAUX[0])
    if haut >= SEUILS_NIVEAUX[0] and bas < SEUILS_NIVEAUX[1]:
        t.append(NIVEAUX[1])
    if haut >= SEUILS_NIVEAUX[1] and bas < SEUILS_NIVEAUX[2]:
        t.append(NIVEAUX[2])
    if haut >= SEUILS_NIVEAUX[2]:
        t.append(NIVEAUX[3])
    return t[0]


def _palier_label(niveau_max):
    return {NIVEAUX[3]: PALIER_ROUGE, NIVEAUX[2]: PALIER_ORANGE}.get(niveau_max,
                                                                     PALIER_VERT)


def _palier_vrai_rive(rive):
    """Filet → ORIENTATION (carte non affichée) ; piège INVALIDE → None ;
    sinon max des niveaux conservateurs des 3 axes (μ vrais)."""
    if rive["signal_herite"]:
        return PALIER_ROUGE
    if rive["_piege_vrai"] == "INVALIDE":
        return None
    mu = rive["_mu_faces"]
    vals = [(mu["H1"] + mu["H2"]) / 2, (mu["L1"] + mu["L2"]) / 2,
            (mu["C1"] + mu["C2"]) / 2]
    return _palier_label(max((_cons_local(v) for v in vals), key=NIVEAUX.index))


def _rci_verdict_vrai(delta_vrai):
    d = abs(delta_vrai)
    return "FIABLE" if d >= SEUIL_FIABLE else ("SUGGESTION" if d >= SEUIL_SUGGESTION else "BRUIT")


def classification_vraie(couple):
    a, b = couple["rive_a"], couple["rive_b"]
    return {
        "palier_a": _palier_vrai_rive(a), "palier_b": _palier_vrai_rive(b),
        "filet_a": bool(a["signal_herite"]), "filet_b": bool(b["signal_herite"]),
        "statut_a": a["_piege_vrai"], "statut_b": b["_piege_vrai"],
        "avert": abs(sum(a["_mu_faces"].values()) / 6.0
                     - sum(b["_mu_faces"].values()) / 6.0) >= SEUIL_STYLES,
        "rci_a": _rci_verdict_vrai(a["_delta_vrai"]) if "_delta_vrai" in a else None,
        "rci_b": _rci_verdict_vrai(b["_delta_vrai"]) if "_delta_vrai" in b else None,
    }


def conformite_couple(couple, m):
    """Surface de décision : paliers, filets, statut RQS (pièges seulement),
    avertissement styles, verdict RCI. Les composants None ne sont pas exigés."""
    a, b = m["rive_a"], m["rive_b"]
    vrai = classification_vraie(couple)
    ok = (a["palier"] == vrai["palier_a"] and b["palier"] == vrai["palier_b"]
          and a["filet"]["filet"] == vrai["filet_a"]
          and b["filet"]["filet"] == vrai["filet_b"])
    if vrai["statut_a"] is not None:
        ok &= a["rqs"]["statut"] == vrai["statut_a"]
    if vrai["statut_b"] is not None:
        ok &= b["rqs"]["statut"] == vrai["statut_b"]
    if m["avertissement_styles"] is not None:
        ok &= (m["avertissement_styles"] == vrai["avert"])
    if vrai["rci_a"] is not None:
        ok &= (a["rci"]["verdict"] == vrai["rci_a"]
               and b["rci"]["verdict"] == vrai["rci_b"])
    return ok
