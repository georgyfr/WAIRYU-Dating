# -*- coding: utf-8 -*-
"""WAIRYU — WTC-PERS-Q1-02 : simulateur Personnalité Q1.
560 couples · 14 groupes · seed 42 ×2 (D-SIM). σ_item = 0,60 (D-PARAM).
Classification VRAIE ancrée sur les paramètres vrais (μ sans bruit) —
ré-implémentation indépendante des règles (croisé, D-VÉRITÉ).
Pièges RQS (G12) DÉTERMINISTES (items constants, temps constants) :
  linéarité 80 PRUDENCE · contradiction 80 PRUDENCE · rythme 75 PRUDENCE
  (motif [3]×16+[2]×8 : SD 0,4714 ≥ 0,45 — pas de linéarité) ·
  linéarité+rythme 45 INVALIDE · rythme+vigilance 45 INVALIDE.
Filet (G06) : 35 couples voie héritée (flag) + 5 couples voie détectée
(idx ≥ 35 : items fixés à 4 — somme J2 = 12 ≥ 11, borne basse 3,59 ≥ 3,20)
— court-circuit même sur items Forte (tous les axes à 4)."""
import numpy as np

rng = np.random.default_rng(42)

SEED = 42
SIGMA_ITEM = 0.60
FACES_NOMS = ("AO1", "AO2", "N1", "N2", "R1", "R2", "J1", "J2")
ITEMS = [f"PERS-{f}-{k}" for f in FACES_NOMS for k in (1, 2, 3)]
INVERSES = {"PERS-N2-3", "PERS-J2-3"}
ITEM_VIGILANCE = "PERS-VIG"
CI90_DEMI = 0.4128
SEUILS_NIVEAUX = (1.80, 2.60, 3.20)
NIVEAUX = ["DISCRÈTE", "TRANQUILLE", "VIVE", "FORTE"]
PALIER_VERT, PALIER_ORANGE, PALIER_ROUGE = ("EXERCICE MAISON", "MODULE DE COUPLE",
                                            "ORIENTATION")
SEUIL_STYLES = 1.00
SEUIL_FIABLE, SEUIL_SUGGESTION = 0.58, 0.41
DELTAS_VRAIS_G14 = [0.70] * 15 + [0.50] * 10 + [0.15] * 15
GEOMETRIE = {
    "G01_QUATRE_AXES_VIFS":        {"AO1": 3.1, "AO2": 3.2, "N1": 3.2, "N2": 3.2, "R1": 3.1, "R2": 3.1, "J1": 3.1, "J2": 3.2, "n": 40},
    "G02_ASYMETRIE_MARQUEE":       {"AO1": 4.0, "AO2": 4.0, "N1": 2.2, "N2": 2.2, "R1": 2.3, "R2": 2.3, "J1": 1.9, "J2": 1.9, "n": 40},
    "G03_REPARATION_ABSENTE":      {"AO1": 2.2, "AO2": 2.2, "N1": 2.4, "N2": 2.4, "R1": 4.0, "R2": 3.8, "J1": 2.2, "J2": 2.2, "n": 40},
    "G04_ZONE_CALME_PERSONNALITE": {"AO1": 2.2, "AO2": 2.2, "N1": 2.3, "N2": 2.3, "R1": 2.2, "R2": 2.2, "J1": 2.4, "J2": 2.4, "n": 40},
    "G05_JALOUSIE_CONTROLEE":      {"AO1": 2.1, "AO2": 2.1, "N1": 2.2, "N2": 2.2, "R1": 2.2, "R2": 2.2, "J1": 3.7, "J2": 2.9, "n": 40},
    "G06_SIGNAL_CONTROLE":         {"AO1": 2.4, "AO2": 2.4, "N1": 2.4, "N2": 2.4, "R1": 2.4, "R2": 2.4, "J1": 2.4, "J2": 2.4, "n": 40},
    "G07_FRONTIERE_AO":            {"AO1": 2.7, "AO2": 2.4, "N1": 2.1, "N2": 2.1, "R1": 2.0, "R2": 2.0, "J1": 2.0, "J2": 2.0, "n": 40},
    "G08_FRONTIERE_N":             {"AO1": 2.0, "AO2": 2.0, "N1": 2.7, "N2": 2.5, "R1": 2.1, "R2": 2.1, "J1": 2.0, "J2": 2.0, "n": 40},
    "G09_FRONTIERE_R":             {"AO1": 2.0, "AO2": 2.0, "N1": 2.1, "N2": 2.1, "R1": 2.8, "R2": 2.5, "J1": 2.1, "J2": 2.1, "n": 40},
    "G10_FRONTIERE_J":             {"AO1": 2.0, "AO2": 2.0, "N1": 2.2, "N2": 2.2, "R1": 2.0, "R2": 2.0, "J1": 2.8, "J2": 2.6, "n": 40},
    "G11_NUAGE":                   {"AO1": 2.3, "AO2": 1.7, "N1": 2.1, "N2": 2.1, "R1": 2.0, "R2": 2.0, "J1": 2.0, "J2": 2.0, "n": 40},
    "G12_PIEGES_RQS":              {"AO1": 2.4, "AO2": 2.4, "N1": 2.4, "N2": 2.4, "R1": 2.4, "R2": 2.4, "J1": 2.4, "J2": 2.4, "n": 40},
    "G13_RIVES_DISSEMBLABLES":     {"AO1": 2.0, "AO2": 2.0, "N1": 2.0, "N2": 2.0, "R1": 2.0, "R2": 2.0, "J1": 2.0, "J2": 2.0, "n": 40,
                                    "riveB": {"AO1": 3.9, "AO2": 3.9, "N1": 3.9, "N2": 3.9, "R1": 3.9, "R2": 3.9, "J1": 3.9, "J2": 2.5}},
    "G14_RE_TEST":                 {"AO1": 2.4, "AO2": 2.4, "N1": 2.4, "N2": 2.4, "R1": 2.4, "R2": 2.4, "J1": 2.4, "J2": 2.4, "n": 40},
}

TRAP_CYCLE = (["linearite"] * 8 + ["contradiction"] * 8 + ["rythme"] * 8
              + ["invalide_rythme"] * 8 + ["vigilance"] * 8)
TRAP_STATUT_VRAI = {"linearite": "PRUDENCE", "contradiction": "PRUDENCE",
                    "rythme": "PRUDENCE", "invalide_rythme": "INVALIDE",
                    "vigilance": "INVALIDE"}
# Motif déterministe sans linéarité : SD = 0,4714 ≥ 0,45
PATTERN_RYTHME = dict(zip(ITEMS, [3] * 16 + [2] * 8))


def _item_corr(mu):
    """Item corrigé ~ N(mu, σ) tronqué [1,4] arrondi."""
    return int(np.clip(round(rng.normal(mu, SIGMA_ITEM)), 1, 4))


def _mu_cle(item):
    """PERS-AO1-2 → AO1."""
    return item[5:].rsplit("-", 1)[0]


def _items_rive(mu_faces, trap=None, fixe_haut=False):
    """Retourne (raws 24 items, vigilance) — pièges/constants sinon échantillonnés."""
    if fixe_haut:
        corr = {it: 4 for it in ITEMS}
        vig = 1
    elif trap == "linearite":
        corr = {it: 3 for it in ITEMS}
        vig = 1
    elif trap == "invalide_rythme":
        corr = {it: 3 for it in ITEMS}
        vig = 1
    elif trap in ("rythme", "vigilance"):
        corr = dict(PATTERN_RYTHME)
        vig = 3 if trap == "vigilance" else 1
    elif trap == "contradiction":
        corr = {it: _item_corr(mu_faces[_mu_cle(it)]) for it in ITEMS}
        corr["PERS-N2-1"], corr["PERS-N2-2"], corr["PERS-N2-3"] = 1, 1, 4
        vig = 1
    else:
        corr = {it: _item_corr(mu_faces[_mu_cle(it)]) for it in ITEMS}
        vig = 1
    raws = {it: (5 - corr[it] if it in INVERSES else corr[it]) for it in ITEMS}
    return raws, vig


def _temps(trap=None, fixe=False):
    if trap in ("rythme", "invalide_rythme", "vigilance"):
        t = {it: 1.2 for it in ITEMS}
        t[ITEM_VIGILANCE] = 1.2
        return t, 40.0
    if fixe:
        t = {it: 4.5 for it in ITEMS}
        t[ITEM_VIGILANCE] = 4.5
        return t, 118.0
    t = {it: float(np.clip(rng.normal(4.5, 1.2), 1.0, None)) for it in ITEMS}
    t[ITEM_VIGILANCE] = float(np.clip(rng.normal(4.5, 1.2), 1.0, None))
    return t, float(sum(t.values()) + rng.normal(10.0, 3.0))


def _rive(mu_faces, groupe, idx, rive, trap=None, delta_vrai=None,
          filet=False, fixe_haut=False):
    raws, vig = _items_rive(mu_faces, trap=trap, fixe_haut=fixe_haut)
    temps, session = _temps(trap, fixe=fixe_haut)
    p = {it: int(raws[it]) for it in ITEMS}
    p[ITEM_VIGILANCE] = int(vig)
    p["temps_items"] = temps
    p["temps_session"] = round(session, 1)
    p["signal_herite"] = bool(filet) and not fixe_haut
    p["id"] = f"{groupe}_{idx:03d}_{rive}"
    p["groupe"] = groupe
    p["_mu_faces"] = dict(mu_faces)
    p["_piege_vrai"] = TRAP_STATUT_VRAI[trap] if trap else None
    p["_filet_detecte_vrai"] = bool(round(mu_faces["J2"] - CI90_DEMI, 2) >= 3.20)
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
    trap = TRAP_CYCLE[idx] if gname == "G12_PIEGES_RQS" else None
    filet = gname == "G06_SIGNAL_CONTROLE"
    fixe_haut = filet and idx >= 35
    if fixe_haut:
        mu_a = {f: 4.0 for f in FACES_NOMS}
        mu_b = dict(mu_a)
    delta = DELTAS_VRAIS_G14[idx] if gname == "G14_RE_TEST" else None
    couple = {
        "id": f"{gname}_{idx:03d}", "groupe": gname,
        "rive_a": _rive(mu_a, gname, idx, "A", trap=trap, delta_vrai=delta,
                        filet=filet, fixe_haut=fixe_haut),
        "rive_b": _rive(mu_b, gname, idx, "B", trap=trap, delta_vrai=delta,
                        filet=filet, fixe_haut=fixe_haut),
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
    """Filet (hérité OU détecté-sur-μ) → ORIENTATION (carte non affichée) ;
    piège INVALIDE → None ; sinon max des niveaux conservateurs des 4 axes."""
    if rive["signal_herite"] or rive["_filet_detecte_vrai"]:
        return PALIER_ROUGE
    if rive["_piege_vrai"] == "INVALIDE":
        return None
    mu = rive["_mu_faces"]
    vals = [(mu["AO1"] + mu["AO2"]) / 2, (mu["N1"] + mu["N2"]) / 2,
            (mu["R1"] + mu["R2"]) / 2, (mu["J1"] + mu["J2"]) / 2]
    return _palier_label(max((_cons_local(v) for v in vals), key=NIVEAUX.index))


def _rci_verdict_vrai(delta_vrai):
    d = abs(delta_vrai)
    return "FIABLE" if d >= SEUIL_FIABLE else ("SUGGESTION" if d >= SEUIL_SUGGESTION else "BRUIT")


def classification_vraie(couple):
    a, b = couple["rive_a"], couple["rive_b"]
    return {
        "palier_a": _palier_vrai_rive(a), "palier_b": _palier_vrai_rive(b),
        "filet_a": bool(a["signal_herite"] or a["_filet_detecte_vrai"]),
        "filet_b": bool(b["signal_herite"] or b["_filet_detecte_vrai"]),
        "statut_a": a["_piege_vrai"], "statut_b": b["_piege_vrai"],
        "avert": abs(sum(a["_mu_faces"].values()) / 8.0
                     - sum(b["_mu_faces"].values()) / 8.0) >= SEUIL_STYLES,
        "rci_a": _rci_verdict_vrai(a["_delta_vrai"]) if "_delta_vrai" in a else None,
        "rci_b": _rci_verdict_vrai(b["_delta_vrai"]) if "_delta_vrai" in b else None,
    }


def conformite_couple(couple, m):
    """Surface de décision : paliers, filets (les deux voies), statut RQS
    (pièges seulement), avertissement styles, verdict RCI. Les composants
    None ne sont pas exigés."""
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
        if a["rci"] is None or b["rci"] is None:
            # filet (faux positif voie détectée) sur une rive re-testée :
            # la carte n'est pas servie → non-conforme, jamais un crash
            ok = False
        else:
            ok &= (a["rci"]["verdict"] == vrai["rci_a"]
                   and b["rci"]["verdict"] == vrai["rci_b"])
    return ok
