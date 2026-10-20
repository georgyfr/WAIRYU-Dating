# -*- coding: utf-8 -*-
"""WAIRYU — WTC-PERS-Q2 : simulateur Quête 2 Personnalité
« La mécanique sous ma carte » — RIO-20.

Univers : 560 couples, 14 groupes × 40 (SPEC §6 verrouillée), seed 42 ×2.
Lois d'items (identiques à la calibration exacte du moteur) :
  cochés      : Bernoulli(pA/pJ) iid — 0/1
  fréquences  : clip(round(N(mu, 0,60)), 0, 3)
  héritage Q1 : clip(round(N(mu, 0,60)), 1, 4) — 6 items par axe (2 faces)
Entrées fixées (pattern Q1 « à items fixés ») : G06 (états de convergence),
G08 (voies du filet), G12 (pièges RQS).
La classification_vraie est ancrée sur les μ (rôles, pas les niveaux exacts) :
la conformité porte sur les DÉCISIONS du moteur (état, label, palier,
conservateurs, état de convergence, voie du filet, verdict RCI)."""
import hashlib
import math
import random

import wtc_pers_q2_core as core


def _graine(*parts):
    """Graine entière bien mélangée (sha256) — streams décorrélatés."""
    h = hashlib.sha256("/".join(str(x) for x in parts).encode()).digest()
    return int.from_bytes(h[:8], "big")

SEED = 42
SIGMA_ITEM = 0.60
CI90_DEMI = core.CI90_DEMI
NIVEAUX = core.NIVEAUX
SEUILS_NIVEAUX = core.SEUILS_NIVEAUX
GEOMETRIE = core.GEOMETRIE
DELTAS_VRAIS_G14 = core.DELTAS_VRAIS_G14

TRAP_CYCLE = (["linearite"] * 10 + ["coherence_n"] * 10
              + ["vigilance"] * 10 + ["invalide"] * 10)


# ═══════════════════ Lois d'items ═════════════════════════════════════════════
def _item_freq(mu, rng):
    return max(0, min(3, round(rng.gauss(mu, SIGMA_ITEM))))


def _item_her(mu, rng):
    return max(1, min(4, round(rng.gauss(mu, SIGMA_ITEM))))


def _item_coche(p, rng):
    return 1 if rng.random() < p else 0


def _mu_cle(mu):
    """Clé de dérivation des items par μ (pattern Q1 : séparateur dédié)."""
    return f"{mu:.4f}"


# ═══════════════════ Héritage Q1 (6 items par axe, patron contresigné) ═══════
def _gen_heritage(her_mu, rng, rqs=95.0, signal_fixe=None, items_fixes=None):
    items, faces = {}, {}
    for f in ("AO1", "AO2", "N1", "N2", "R1", "R2", "J1", "J2"):
        vals = [items_fixes[f]] * 3 if items_fixes else \
            [_item_her(her_mu[f], rng) for _ in range(3)]
        items[f] = vals
        faces[f] = sum(vals)
    axes = {}
    for axe in ("AO", "N", "R", "J"):
        s = (faces[axe + "1"] + faces[axe + "2"]) / 6.0
        bas = round(s - CI90_DEMI, 4)
        axes[axe] = {"score": round(s, 4),
                     "cons": _cons_local(bas)}
    signal = (faces["J2"] >= 11) if signal_fixe is None else signal_fixe
    return {"rqs": rqs, "signal": signal,
            "niveaux": {a: axes[a]["cons"] for a in axes},
            "scores": {a: axes[a]["score"] for a in axes}}


def _cons_local(bas):
    if bas < SEUILS_NIVEAUX[0]:
        return NIVEAUX[0]
    if bas < SEUILS_NIVEAUX[1]:
        return NIVEAUX[1]
    if bas < SEUILS_NIVEAUX[2]:
        return NIVEAUX[2]
    return NIVEAUX[3]


# ═══════════════════ Génération d'une rive ombre ══════════════════════════════
def _gen_profil(g, idx, rng):
    """Entrées Q2 d'une rive — loi iid par μ, entrées fixées par groupe."""
    trap = TRAP_CYCLE[idx] if g.get("piege") else None
    profil = {}
    # bloc A (cochés) — fixé pour G06/G12
    if g.get("cv_vrai") == "MIXTE":
        a_vals = [1, 1, 0, 0, 0, 0] if idx < 20 else [0, 0, 0, 0, 0, 0]
    elif trap:
        a_vals = [1, 0, 1, 0, 1, 0]
    else:
        a_vals = [_item_coche(g["pA"], rng) for _ in range(6)]
    for k, v in enumerate(a_vals):
        profil[f"PERS-Q2-A{k+1}"] = v
    # bloc N (fréq) — fixé pour G06 / pièges cohérence-linéarité-invalide
    if g.get("cv_vrai") == "MIXTE":
        n_raw = [0, 0, 0, 0]
    elif trap == "linearite" or trap == "invalide":
        n_raw = [2, 2, 2, 2]
    elif trap == "coherence_n":
        n_raw = [3, 3, 3, 3]
    elif trap == "vigilance":
        n_raw = [1, 2, 3, 3]
    elif g.get("re_test") and idx < 20:
        n_raw = [_item_freq(g["muN"][j], rng) for j in range(4)]
    else:
        n_raw = [_item_freq(g["muN"][j], rng) for j in range(4)]
    for k, v in enumerate(n_raw):
        profil[f"PERS-Q2-N{k+1}"] = v
    profil["PERS-Q2-N5"] = 2 if (g.get("filet") and idx >= 35) else 0
    # bloc R (fréq)
    if trap in ("linearite", "invalide", "coherence_n"):
        r_raw = [2, 2, 2, 2, 2, 2] if trap != "coherence_n" else \
            [1, 2, 3, 2, 1, 2]
    elif trap == "vigilance":
        r_raw = [1, 2, 3, 2, 1, 2]
    else:
        r_raw = [_item_freq(g["muR"][j], rng) for j in range(4)] + \
            [_item_freq(g["muR_geste"][j], rng) for j in range(2)]
    for k, v in enumerate(r_raw):
        profil[f"PERS-Q2-R{k+1}"] = v
    # bloc J (cochés) — fixé pour G06/G08-détectée
    if g.get("cv_vrai") == "MIXTE":
        j_vals = [0, 0, 0, 0, 0, 0]
    elif g.get("filet") and 25 <= idx < 35:
        j_vals = [1, 1, 1, 1, 1, 1]          # voie détectée : 6/6
    elif g.get("items_fixes"):
        j_vals = [1, 1, 1, 1, 1, 1]
        j_vals[idx % 6] = 0                  # 5/6 cochés, rotation — jamais 6/6
    elif trap:
        j_vals = [0, 1, 0, 1, 0, 1]
    else:
        j_vals = [_item_coche(g["pJ"], rng) for _ in range(6)]
    for k, v in enumerate(j_vals):
        profil[f"PERS-Q2-J{k+1}"] = v
    profil["PERS-Q2-VIG"] = 3 if trap == "vigilance" else 1
    # temps / session
    if trap == "invalide":
        profil["temps_items"] = {i: 1.0 for i in core.ENTREES}
        profil["temps_session"] = 30.0
    else:
        profil["temps_items"] = {i: 4.0 for i in core.ENTREES}
        profil["temps_session"] = 120.0
    # re-test (G14) : delta vrai injecté sur les items N (clippé 0-3)
    if g.get("re_test"):
        dv = DELTAS_VRAIS_G14[idx]
        re_test = {i: profil[i] for i in core.ENTREES}
        for j in range(4):
            re_test[f"PERS-Q2-N{j+1}"] = max(0.0, min(3.0,
                                                      n_raw[j] + dv))
        profil["re_test_entrees"] = re_test
        profil["delta_vrai"] = dv
        profil["re_test_actif"] = True
    return profil


def _heritage_pour(gname, g, idx):
    """Héritage Q1 d'une rive — fixations propres à G08/G13."""
    if g.get("heritage_invalide"):
        return _gen_heritage(g["her_mu"], random.Random(_graine("her", gname, idx)),
                             rqs=55.0)
    if g.get("filet"):
        if idx < 25:      # voie héritée : signal fixé True
            return _gen_heritage(g["her_mu"], random.Random(_graine("her", gname, idx)),
                                 signal_fixe=True)
        if idx < 35:      # voie détectée : signal fixé False, J saturé sans
                          # face J2 signalée (J1 4,0 / J2 3,0)
            her = dict(g["her_mu"]); her["J1"] = 4.0; her["J2"] = 3.0
            return _gen_heritage(her, random.Random(_graine("her", gname, idx)),
                                 signal_fixe=False)
        return _gen_heritage(g["her_mu"], random.Random(_graine("her", gname, idx)),
                             signal_fixe=False)   # voie N5
    return _gen_heritage(g["her_mu"], random.Random(_graine("her", gname, idx)))


# ═══════════════════ Vérité ancrée sur les μ (décisions) ══════════════════════
def _cons_coches_vrai(p_eff):
    k = round(p_eff * 6)
    return _cons_local(round(1.0 + 0.5 * k - CI90_DEMI, 4))


def _cons_freq_vrai(mu4, inverse_last=False):
    """Vérité CLIP-AWARE : E[item | mu] via l'énumération exacte du moteur
    (_freq_dist) — un mu 3,4 sur échelle 0-3 sature au plafond (items à 3) :
    le score attendu est celui des items réellement dessinés, pas le mu brut.
    inverse_last : le 4e item est inversé (N4 : E[corrigé] = 3 − E[raw])."""
    e = 0.0
    for j, mu in enumerate(mu4):
        e_raw = sum(k * pk for k, pk in enumerate(core._freq_dist(mu)))
        e += (3.0 - e_raw) if (inverse_last and j == 3) else e_raw
    return _cons_local(round(1.0 + e / 4.0 - CI90_DEMI, 4))


def _vrai_label(g):
    cv = g.get("cv_vrai", "OK")
    if cv == "SUPPRIMÉE":
        return "OMBRE_SUPPRIMÉE"
    if cv == "PRUDENTE":
        return "OMBRE_PRUDENTE"
    cons = {"A": _cons_coches_vrai(g["pA"]), "N": _cons_freq_vrai(g["muN"], inverse_last=True),
            "R": _cons_freq_vrai(g["muR"]), "J": _cons_coches_vrai(g["pJ"])}
    vives = [b for b in ("A", "N", "R", "J")
             if cons[b] in ("VIVE", "FORTE")]
    if not vives:
        return "ZONE_CALME"
    if len(vives) >= 2:
        return "DOUBLE_PENTE"
    return {"R": "MUR_DE_DÉFENSE", "N": "ORAGE_LENT", "J": "LENTILLE",
            "A": "PENCHANT_PROPRE"}[vives[0]]


def _vrai_palier(g):
    cons = [_cons_coches_vrai(g["pA"]),
            _cons_freq_vrai(g["muN"], inverse_last=True),
            _cons_freq_vrai(g["muR"]), _cons_coches_vrai(g["pJ"])]
    plus_haut = max(cons, key=NIVEAUX.index)
    return {NIVEAUX[3]: core.PALIER_ROUGE,
            NIVEAUX[2]: core.PALIER_ORANGE}.get(plus_haut, core.PALIER_VERT)


def _vrai_rci_verdict(dv):
    if abs(dv) >= core.SEUIL_FIABLE:
        return "FIABLE"
    if abs(dv) >= core.SEUIL_SUGGESTION:
        return "SUGGESTION"
    return "BRUIT"


def classification_vraie(couple):
    """Vérité par couple, ancrée sur les paramètres vrais (décisions)."""
    g = couple["geometrie"]
    idx = couple["idx"]
    vrai = {}
    if g.get("heritage_invalide"):
        vrai = {"etat": "QUÊTE_VERROUILLÉE", "label": None, "palier": None,
                "cons": None, "cv_etat": None, "voie": None, "rci": None,
                "rqs_statut": None}
    elif g.get("filet"):
        voie = "héritée" if idx < 25 else ("détectée" if idx < 35 else "N5")
        vrai = {"etat": "P-FILTRE", "label": None, "palier": core.PALIER_ROUGE,
                "cons": None, "cv_etat": None, "voie": voie, "rci": None,
                "rqs_statut": None}
    elif g.get("piege"):
        trap = TRAP_CYCLE[idx]
        statut = "INVALIDE" if trap == "invalide" else "PRUDENCE"
        etat = "AUCUN_RÉSULTAT" if trap == "invalide" else "OMBRE"
        # label non comparé sur les pièges : le piège teste la QUALITÉ (RQS),
        # pas le nommage — le nommage des pièges PRUDENCE reste bruité (items
        # fixés proches des seuils), il est prouvé exactement en D-TABLE.
        vrai = {"etat": etat, "label": None, "palier": None, "cons": None,
                "cv_etat": None, "voie": None, "rci": None,
                "rqs_statut": statut}
    elif g.get("cv_vrai") == "MIXTE":
        label = "OMBRE_PRUDENTE" if idx < 20 else "OMBRE_SUPPRIMÉE"
        vrai = {"etat": "OMBRE", "label": label, "palier": core.PALIER_VERT,
                "cons": None, "cv_etat": None, "voie": None, "rci": None,
                "rqs_statut": "OK"}
    else:
        rci = _vrai_rci_verdict(couple["rive_a"]["delta_vrai"]) \
            if g.get("re_test") else None
        vrai = {"etat": "OMBRE", "label": _vrai_label(g),
                "palier": _vrai_palier(g),
                "cons": {"A": _cons_coches_vrai(g["pA"]),
                         "N": _cons_freq_vrai(g["muN"], inverse_last=True),
                         "R": _cons_freq_vrai(g["muR"]),
                         "J": _cons_coches_vrai(g["pJ"])},
                "cv_etat": "OK" if g.get("cv_vrai", "OK") == "OK" else "N/A",
                "voie": None, "rci": rci, "rqs_statut": "OK"}
    return vrai


# ═══════════════════ Assemblage des couples ═══════════════════════════════════
def _gen_couple(gname, idx, rng):
    g = GEOMETRIE[gname]
    profil_a = _gen_profil(g, idx, rng)
    profil_b = _gen_profil(g, idx, rng)
    heritage_a = _heritage_pour(gname, g, idx)
    heritage_b = _heritage_pour(gname, g, idx)
    couple = {"groupe": gname, "idx": idx, "geometrie": g,
              "rive_a": profil_a, "rive_b": profil_b,
              "heritage_a": heritage_a, "heritage_b": heritage_b}
    couple["vrai_a"] = classification_vraie(
        {**couple, "rive_a": profil_a, "idx": idx})
    couple["vrai_b"] = classification_vraie(
        {**couple, "rive_a": profil_b, "idx": idx})
    return couple


_CACHES = {}


def tous_les_couples(run=1):
    """560 couples, seed 42 ×2 (run 1 : seed 42 ; run 2 : seed 42 re-dérivé —
    même graine, seconde exécution pour l'empreinte D-EMPREINTE)."""
    if run in _CACHES:
        return _CACHES[run]
    couples = []
    for gname in GEOMETRIE:
        g = GEOMETRIE[gname]
        for idx in range(g["n"]):
            rng = random.Random(_graine(SEED, gname, idx))
            couples.append(_gen_couple(gname, idx, rng))
    _CACHES[run] = couples
    return couples


def effectifs():
    return {g: GEOMETRIE[g]["n"] for g in GEOMETRIE}


# ═══════════════════ Conformité par couple (décisions) ════════════════════════
def conformite_couple(couple, m):
    """Vrai vs observé, par rive, sur les décisions (None-safe — leçon Q1 :
    un crash latent ne doit jamais être un crash)."""
    try:
        ok = True
        for rive, vrai in (("rive_a", couple["vrai_a"]),
                           ("rive_b", couple["vrai_b"])):
            o = m[rive]
            if o is None:
                return False
            if o.get("etat") != vrai["etat"]:
                return False
            if vrai.get("label") is not None and \
                    o.get("label") != vrai["label"]:
                return False
            if vrai.get("palier") is not None and \
                    o.get("palier") != vrai["palier"]:
                return False
            # NB : les conservateurs exacts ne sont PAS comparés (décisions
            # affichées — pattern Q1) ; leur exactitude passe par C1 D-TABLE
            # et par la borne stricte _p_label_vrai de la calibration.
            if vrai.get("rqs_statut") and \
                    o.get("rqs", {}).get("statut") != vrai["rqs_statut"]:
                return False
            if vrai.get("voie"):
                f = o.get("filet") or {}
                if f.get("voie") != vrai["voie"]:
                    return False
            if vrai.get("rci"):
                r = o.get("rci") or {}
                if (r.get("N") or {}).get("verdict") != vrai["rci"]:
                    return False
        return ok
    except Exception:
        return False
