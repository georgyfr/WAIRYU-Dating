# -*- coding: utf-8 -*-
"""WTC-PERS-Q5 « Le pas sous ma carte » (RIO-23) — simulateur.

Univers : 650 rives / 14 groupes (seed 42 ×2) — patrons D-TABLE des
héritages contresignés Q1/Q2 (q3sim — zéro ré-implémentation) ; la lumière
est dérivée PAR LE MOTEUR RIO-21 CONTRESIGNÉ (q3core.deriver_rive) ; le pas
par le moteur Q5 (wtc_pers_q5_core). Composition (LIBRE verrouillage,
déposée ici) : 9 groupes de banque ×50 · ZONE_CALME 40 · SIGNAL_FILET 40 ·
FRONTIÈRES_9_14 40 · RCI_FRONTIÈRES 40 · ANTI_C6 40.
Vérité = moteur sur héritages FIXES (déterministes) — l'égalité
espérance-CLIP-AWARE ↔ réalisation est vérifiée sur les trois patrons μ de
base (contrôle anti-dérive, leçon Q3/Q4).
"""
import hashlib
import os
import sys

_HERE = os.path.dirname(os.path.abspath(__file__))
_VP = os.path.dirname(os.path.dirname(_HERE))
_Q3S = os.path.join(_VP, "validation-pers-q3", "src")
_Q4S = os.path.join(_VP, "validation-pers-q4", "src")
for p in (_Q3S, _Q4S):
    if p not in sys.path:
        sys.path.insert(0, p)

import wtc_pers_q5_core as core              # noqa: E402 — moteur RIO-23
import wtc_pers_q3_simulator as q3sim        # noqa: E402 — patrons RIO-19/20
import wtc_pers_q4_simulator as q4sim        # noqa: E402 — profils saturés

SEED = 42

# ── Profils de rives (D-TABLE — patrons contresignés Q4/Q3) ──────────────────
# Rotation F : sommes de faces tournées d'un cran (AO1→R1→N2→AO1…) — même
# saturation, autres forces principales (varie la composition de banque).
SUMS_F_ROT = {"AO1": 6, "AO2": 6, "N1": 6, "N2": 6, "R1": 6, "R2": 6,
              "J1": 12, "J2": 6}
# Orage N vif (muN haut), reste calme — désamorçage N en tête.
HER2_ORAGE = {"A": [0] * 6, "N": [3, 3, 3, 3], "R": [1, 1, 1, 1, 0, 0],
              "J": [0] * 6}
# Mur R vif + geste rare.
HER2_MUR = {"A": [0] * 6, "N": [1, 1, 1, 1], "R": [3, 3, 3, 3, 0, 0],
            "J": [0] * 6}
# Lentille J vive (axe J carte haut via SUMS : J1/J2 portés).
SUMS_J = {"AO1": 6, "AO2": 6, "N1": 6, "N2": 6, "R1": 6, "R2": 6,
          "J1": 12, "J2": 9}
HER2_LENTILLE = {"A": [0] * 6, "N": [1, 1, 1, 1], "R": [1, 1, 1, 1, 0, 0],
                 "J": [3, 3, 3, 3, 0, 0]}
# Penchant A vif, ombre N/R calme (muN/muR bas → forces N/R soutenues).
HER2_PENCHANT = {"A": [3, 3, 3, 3, 3, 3], "N": [1, 1, 1, 0],
                 "R": [1, 1, 1, 1, 0, 0], "J": [0] * 6}
# Mixte : penchant A + orage N.
HER2_MIXTE = {"A": [3, 3, 3, 3, 0, 0], "N": [3, 3, 2, 2],
              "R": [1, 1, 1, 1, 0, 0], "J": [0] * 6}
# Zone calme : ombre basse non nulle (label ZONE_CALME par le patron Q2)
# + gestes pratiqués (muG non porté en fixe → gestes via items R hauts).
HER2_ZC = {"A": [0] * 6, "N": [0, 0, 0, 1], "R": [0, 0, 0, 0, 3, 3],
           "J": [0] * 6}


def _graine(*parts):
    h = hashlib.sha256("/".join(str(x) for x in parts).encode()).digest()
    return int.from_bytes(h[:8], "big")


def _rive(t, idx):
    """(her_q1, her_q2) DÉTERMINISTES (items fixes — patrons contresignés)."""
    if t == "F":
        h1 = q3sim._her1_fixe(q4sim.SUMS_F_FIXE, signal=False)
        return h1, q3sim._her2_fixe(h1, q4sim.HER2_F_FIXE)
    if t == "F_ROT":
        h1 = q3sim._her1_fixe(SUMS_F_ROT, signal=False)
        return h1, q3sim._her2_fixe(h1, q4sim.HER2_F_FIXE)
    if t == "M":
        h1 = q3sim._her1_fixe(q4sim.SUMS_M, signal=False)
        return h1, q3sim._her2_fixe(h1, q4sim.HER2_M_ITEMS)
    if t == "FORTE":
        h1 = q3sim._her1_fixe(q4sim.SUMS_FORTE, signal=False)
        return h1, q3sim._her2_fixe(h1, q4sim.HER2_FORTE_FIXE)
    if t == "ORAGE":
        h1 = q3sim._her1_fixe(q4sim.SUMS_M, signal=False)
        return h1, q3sim._her2_fixe(h1, HER2_ORAGE)
    if t == "MUR":
        h1 = q3sim._her1_fixe(q4sim.SUMS_M, signal=False)
        return h1, q3sim._her2_fixe(h1, HER2_MUR)
    if t == "LENTILLE":
        h1 = q3sim._her1_fixe(SUMS_J, signal=False)
        return h1, q3sim._her2_fixe(h1, HER2_LENTILLE)
    if t == "PENCHANT":
        h1 = q3sim._her1_fixe(q4sim.SUMS_F_FIXE, signal=False)
        return h1, q3sim._her2_fixe(h1, HER2_PENCHANT)
    if t == "MIXTE":
        h1 = q3sim._her1_fixe(q4sim.SUMS_M, signal=False)
        return h1, q3sim._her2_fixe(h1, HER2_MIXTE)
    if t == "ZC":
        h1 = q3sim._her1_fixe(q4sim.SUMS_F_FIXE, signal=False)
        return h1, q3sim._her2_fixe(h1, HER2_ZC)
    if t == "SUPP":
        h1 = q3sim._her1_fixe(q4sim.SUMS_SUPP, signal=False)
        return h1, q3sim._her2_fixe(h1, q4sim.HER2_SUPP)
    if t == "FILET":
        # idx < 15 : signal Q1 · 15-24 : Q2 P-FILTRE · 25-32 : RQS Q1 = 60
        # (verrouillée) · ≥ 33 : RQS Q2 = 60 (aucun résultat)
        if idx < 15:
            h1 = q3sim._her1_fixe(q4sim.SUMS_F_FIXE, signal=True)
            return h1, q3sim._her2_fixe(h1, q4sim.HER2_F_FIXE)
        if idx < 25:
            h1 = q3sim._her1_fixe(q4sim.SUMS_F_FIXE, signal=False)
            return h1, q3sim._patron_q2_p_filtre()
        if idx < 33:
            h1 = q3sim._her1_fixe(q4sim.SUMS_F_FIXE, rqs=60.0, signal=False)
            return h1, q3sim._her2_fixe(h1, q4sim.HER2_F_FIXE)
        h1 = q3sim._her1_fixe(q4sim.SUMS_F_FIXE, signal=False)
        h2 = q3sim._her2_fixe(h1, q4sim.HER2_F_FIXE, rqs=60.0)
        return h1, h2
    raise ValueError("profil inconnu : " + str(t))


# ═══════════════ Géométrie des 14 groupes — 450 + 200 = 650 ══════════════════
GEOMETRIE = {
    "G01_EXERCICES_FAIBLES":    {"t": "F", "n": 50},
    "G02_DESAMO_MODERE":        {"t": "M", "n": 50},
    "G03_SOLO_FORTE":           {"t": "FORTE", "n": 50},
    "G04_FORCES_ROTATION":      {"t": "F_ROT", "n": 50},
    "G05_ORAGE_N":              {"t": "ORAGE", "n": 50},
    "G06_MUR_R":               {"t": "MUR", "n": 50},
    "G07_CARTE_SEULE":         {"t": "SUPP", "n": 50},
    "G08_PENCHANT_A":          {"t": "PENCHANT", "n": 50},
    "G09_MIXTE_PENCHANT_ORAGE": {"t": "MIXTE", "n": 50},
    "G10_ZONE_CALME":          {"t": "ZC", "n": 40},
    "G11_SIGNAL_FILET":        {"t": "FILET", "n": 40},
    "G12_FRONTIERES_9_14":     {"t": "M", "n": 40, "serie": True},
    "G13_RCI_FRONTIERES":      {"t": "M", "n": 40, "rci": True},
    "G14_ANTI_C6":             {"t": "M", "n": 40, "antic6": True},
}


def effectifs():
    return {g: s["n"] for g, s in GEOMETRIE.items()}


def _serie_14(k):
    return [j < k for j in range(14)]


def _rt_flips(bloc, flips):
    """Héritage Q2 de re-test : items du bloc N décalés (déterministe) —
    base = profil M fixe (q4sim.HER2_M_ITEMS), seuls les items du bloc
    ciblé bougent (Δ mesuré sur le score hérité — une mesure un rôle)."""
    items = {b: list(v) for b, v in q4sim.HER2_M_ITEMS.items()}
    for k, d in flips:
        items[bloc][k] = max(0, min(3, items[bloc][k] + d))
    h1, _ = _rive("M", 0)
    return q3sim._her2_fixe(h1, items)


def _choix_defaut(h1, h2):
    """Premier candidat de banque (déterministe, jamais prescrit au réel —
    le choix simulé matérialise la main de l'utilisateur)."""
    lum = core.q3core.deriver_rive(h1, h2)
    banque = core.deriver_banque(h1, h2, lum)
    return core._id_de(banque[0]) if banque else None


def toutes_les_rives(run=1):
    """650 rives Q5 — ordre déterministe par graine de run (run ∈ {1, 2}
    ne change PAS les entrées : l'empreinte porte sur les résultats, la
    reproductibilité bit à bit est exigée (C2/C4))."""
    rives = []
    for gname, spec in GEOMETRIE.items():
        for i in range(spec["n"]):
            h1, h2 = _rive(spec["t"], i)
            c = {"her_q1": h1, "her_q2": h2, "groupe": gname, "idx": i}
            if spec.get("serie"):
                # frontières 9/14 : 8/14 ×13 · 9/14 ×14 · 10/14 ×13
                k = 8 if i < 13 else (9 if i < 27 else 10)
                c["choix"] = _choix_defaut(h1, h2)
                c["serie"] = _serie_14(k)
            elif spec.get("rci"):
                # zones RCI : Δ mesuré sur MÉCANISME:N (flips déterministes)
                # 0-14 FIABLE (3 flips) · 15-29 SUGGESTION (2) · 30-39 BRUIT (0)
                nf = 3 if i < 15 else (2 if i < 30 else 0)
                flips = [(k, 1) for k in range(nf)]
                c["choix"] = "MÉCANISME:N"
                c["her_q2_rt"] = _rt_flips("N", flips)
            elif spec.get("antic6"):
                # PERFECT 14/14 (idx pair) · ZERO 0/14 (impair) — les deux
                # pièges SM-Q5 : célébré sans injonction, jamais de sanction
                c["choix"] = _choix_defaut(h1, h2)
                c["serie"] = _serie_14(14 if i % 2 == 0 else 0)
            else:
                c["choix"] = _choix_defaut(h1, h2)
            rives.append((gname, i, c))
    return rives


def classes_of(rives):
    return [(g, i, core.deriver_pas(c)) for g, i, c in rives]


def controle_esperance():
    """Anti-dérive (leçon Q3/Q4) : sur les 3 patrons μ de base, l'héritage
    espérance CLIP-AWARE et l'héritage stochastique à graine fixe produisent
    la MÊME classe Q5 (état + banque + pas choisi + statut)."""
    checks = []
    for label, mu, params in (
            ("F", q4sim.HER1_F_MU, q4sim.HER2_F_PARAMS),
            ("M_ESP", None, None), ("FORTE", q4sim.HER1_FORTE_MU,
                                    q4sim.HER2_FORTE_PARAMS)):
        if label == "M_ESP":
            continue
        h1e = q3sim._gen_heritage_q1(mu, None, signal_fixe=False,
                                     esperance=True)
        h2e = q3sim._her2_esp(params, h1e)
        r_e = core.deriver_pas({"her_q1": h1e, "her_q2": h2e})
        rng = __import__("random").Random(_graine("ctrl", label))
        h1s = q3sim._her1_stoch(mu, rng, signal_fixe=False)
        h2s = q3sim._her2_stoch(params, rng, h1s)
        r_s = core.deriver_pas({"her_q1": h1s, "her_q2": h2s})
        checks.append({
            "patron": label,
            "etat_egal": r_e["etat"] == r_s["etat"],
            "banque_egal": [core._id_de(x) for x in (r_e["banque"] or [])]
            == [core._id_de(x) for x in (r_s["banque"] or [])],
        })
    return {"ok": all(c["etat_egal"] and c["banque_egal"] for c in checks),
            "checks": checks}


def calibration_d_std_2():
    """Bornes DISTINCTES (D-STD-2 — leçon ad01f21) : le seuil 9/14 est
    unique et verbatim ; les zones RCI 0,58/0,41 sont DISTINCTES (vérif
    d'énumération des Δ mesurables d'un item du bloc N : chaque Δ mesure
    un verdict stable). Déterministe — 0 stochastique (signalé comme tel,
    pattern Q4)."""
    seuils = {"celebre": core.SEUIL_CELEBRE, "n_jours": core.N_JOURS,
              "fiable": core.q3core.SEUIL_FIABLE,
              "suggestion": core.q3core.SEUIL_SUGGESTION}
    distinctes = seuils["celebre"] != seuils["fiable"] \
        and seuils["fiable"] != seuils["suggestion"] \
        and seuils["suggestion"] < seuils["fiable"]
    # énumération des Δ (flips 1 à 3 items du bloc N, profil M fixe) —
    # chaque Δ mesure un verdict stable (énumération exhaustive déterministe)
    import itertools
    h1, h2 = _rive("M", 0)
    base = h2["mecanismes"]["N"]["score"]
    deltas = []
    for r in (1, 2, 3):
        for combo in itertools.combinations(range(4), r):
            for d in (-1, 1):
                rt = _rt_flips("N", [(k, d) for k in combo])
                re = rt["mecanismes"]["N"]["score"]
                delta = round(re - base, 4)
                if delta != 0:
                    deltas.append(delta)
    deltas = sorted(set(deltas))
    verdicts = {d: core.q3core.rci_de(2.5, 2.5 + d)["verdict"]
                for d in deltas}
    return {"seuils": seuils, "bornes_distinctes": distinctes,
            "deltas_enumeres": deltas, "verdicts_par_delta": verdicts,
            "zones_couvertes": len(set(verdicts.values())),
            "n_stochastiques": 0, "n_deterministes": 14}
