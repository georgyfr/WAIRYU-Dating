# -*- coding: utf-8 -*-
"""WAIRYU — WTC-PERS-Q2 : moteur Quête 2 Personnalité
« La mécanique sous ma carte » — RIO-20 cible (l'ombre, mécanisme profond).

SPEC VERROUILLÉE (a8bb7b5) — tranchages A1-A6 par délégation fondateur
20/10/2026 (« je te laisse le choix de trancher ») :
A1 titre « La mécanique sous ma carte » · A2 entrées hétérogènes 4 blocs
(24 entrées + héritage Q1) · A3 nommage 7 configurations + 2 états ·
A4 convergence Q1×Q2 = contrôle interne index (L5 réservée à Q3) ·
A5 filet double voie (héritée + détectée) + N5 · A6 L1 adapté + L3 verbatim
+ L4 nuage + L7 embarquée.

Canon (programme wairyu couple.txt) : ligne 223 « Q2 L'ombre (mécanisme
profond) » · ligne 208 « ta zone d'ombre [descriptif causal, sans étiquette] »
· ligne 29 « ombre ET lumière structurelles » · §5.4 paliers en langage
d'ombre (227-231) · §5.5 anti-fabrication (233-237) · L3 ligne 259 verbatim ·
L4 ligne 260 · L7 ligne 263 · re-test 8 semaines ligne 274 · filet ligne 369 ·
vocabulaire écran 355-356. Héritage Q1 = sorties contresignées RIO-19
(SHA 3b1a7490…). Les mots canon « névrosisme », « narcissisme », « jalousie »
ne sont JAMAIS affichés (C6, hérité de Q1)."""
import math

SIGMA_ITEM = 0.60  # D-PARAM (hub)

# ── Instrument (A2 : 4 blocs mécanisme, entrées hétérogènes) ─────────────────
# Bloc A « Le penchant » : 6 scénarios cochés 0/1 (A1-A3 attribution externe,
# A4-A6 part de soi évitée) · Bloc N « L'orage » : N1-N3 fréquences 0-3 +
# N4 retour au calme (INVERSÉ : corrigé = 3 − raw) · N5 = item sécurité
# (hors score) · Bloc R « Le mur » : R1-R4 défenses 0-3, R5-R6 gestes de
# réparation 0-3 (force, hors mécanisme) · Bloc J « La lentille » : 6 scénarios
# cochés 0/1 (J1-J3 chaîne d'interprétation, J4-J6 vérification).
COCHES_A = [f"PERS-Q2-A{k}" for k in range(1, 7)]
FREQ_N = [f"PERS-Q2-N{k}" for k in range(1, 5)]      # N4 inversé
ITEM_SECURITE_N5 = "PERS-Q2-N5"
FREQ_R = [f"PERS-Q2-R{k}" for k in range(1, 7)]      # R1-R4 mur, R5-R6 geste
COCHES_J = [f"PERS-Q2-J{k}" for k in range(1, 7)]
ITEM_VIGILANCE = "PERS-Q2-VIG"                        # échelle 1-4, raw ≥ 2 → pén.
ITEMS_FREQ = FREQ_N + FREQ_R                          # 10 entrées fréquentielles
ITEMS_COCHES = COCHES_A + COCHES_J                    # 12 scénarios cochés
ENTREES = ITEMS_FREQ + ITEMS_COCHES                   # 22 déclarées + 1 vigilance
INVERSE_N4 = "PERS-Q2-N4"                             # corrigé = 3 − raw

MECANISMES = {"A": "Le penchant", "N": "L'orage", "R": "Le mur",
              "J": "La lentille"}

FACES_Q2 = {
    "A": [("A_ext", COCHES_A[:3], "coches"), ("A_part", COCHES_A[3:], "coches")],
    "N": [("N_orage", FREQ_N[:3], "freq"), ("N_retour", [INVERSE_N4], "freq")],
    "R": [("R_mur", FREQ_R[:4], "freq"), ("R_geste", FREQ_R[4:], "freq")],
    "J": [("J_chaine", COCHES_J[:3], "coches"), ("J_verif", COCHES_J[3:], "coches")],
}

# ── L2 — placeholders canon ligne 258 (à remplacer par le pilote) ────────────
SD_POP = 0.65
ALPHA = 0.85
SEM = round(SD_POP * math.sqrt(1.0 - ALPHA), 4)          # 0.2517
Z90 = 1.64
CI90_DEMI = round(Z90 * SEM, 4)                          # 0.4128

def _se_face(n_items):
    """SE d'une face de n items — SEM/√n (placeholders canon, LIBRE)."""
    return round(SEM / math.sqrt(n_items), 4)

SE_F = {b: {nom: _se_face(len(items)) for nom, items, _ in fs}
        for b, fs in FACES_Q2.items()}
SEUIL_HIERARCHIE = {b: round(Z90 * math.sqrt(sum(SE_F[b][nom] ** 2
                                                 for nom, _, _ in fs)), 4)
                    for b, fs in FACES_Q2.items()}

# ── L3 — 4 niveaux (ligne 259 verbatim, échelle transposée 1,00-4,00) ────────
NIVEAUX = ["DISCRÈTE", "TRANQUILLE", "VIVE", "FORTE"]
SEUILS_NIVEAUX = (1.80, 2.60, 3.20)

PALIER_VERT = "EXERCICE MAISON"
PALIER_ORANGE = "MODULE DE COUPLE"
PALIER_ROUGE = "ORIENTATION"

# ── L7 RCI (ligne 263 verbatim) ──────────────────────────────────────────────
SE_DIFF = round(math.sqrt(2.0) * SEM, 4)                 # ≈ 0.356
SEUIL_FIABLE = 0.58
SEUIL_SUGGESTION = 0.41

# ── L1 RQS adapté (A6 : sur les 10 entrées fréquentielles) ───────────────────
SEUIL_LINEARITE = 0.45
PENALITE_LINEARITE = 20
SEUIL_ITEM_RAPIDE_S = 2.0
SEUIL_SESSION_S = 60.0
PENALITE_RYTHME = 25
PENALITE_VIGILANCE = 20
PENALITE_COHERENCE_N = 20
SEUIL_RQS_OK = 85
SEUIL_RQS_PRUDENCE = 70
STATUTS_RQS = ("OK", "PRUDENCE", "INVALIDE")

# ── Sécurité (A5 : double voie + N5) ─────────────────────────────────────────
# Voie héritée : signal porté par l'héritage Q1 (déterministe).
# Voie détectée : ΣJ = 6/6 ET héritage J ≥ VIVE (lecture conservatrice).
# N5 : retour impossible déclaré ≥ 2 (souvent) → signal.
SECU_J_SUM = 6
SECU_N5 = 2

# ── Convergence (A4 : index pattern RIO-02 étape 4) ──────────────────────────
INDEX_PRUDENCE = 0.50

SIGMA_EFF_BLOC = round(SIGMA_ITEM / math.sqrt(4.0), 4)   # 0.30 (blocs fréq.)
SIGMA_RCI_Q2 = round(SIGMA_ITEM * math.sqrt(2.0 / 4.0), 4)  # 0.4243 (4 items)

NOMENCLATURE = (NIVEAUX + [PALIER_VERT, PALIER_ORANGE, PALIER_ROUGE,
                           "NUAGE", "HIÉRARCHIE DÉCLARABLE", "NIVEAU",
                           "FRONTIÈRE"] + list(STATUTS_RQS)
                + ["FIABLE", "SUGGESTION", "BRUIT", "P-FILTRE",
                   "ZONE_CALME", "PENCHANT_PROPRE", "ORAGE_LENT",
                   "MUR_DE_DÉFENSE", "LENTILLE", "DOUBLE_PENTE",
                   "OMBRE_PRUDENTE", "OMBRE_SUPPRIMÉE", "QUÊTE_VERROUILLÉE"])


# ═══════════════════ Transposition des entrées → scores mécanisme ════════════
def corrige(item, raw):
    """N4 inversé (3 − raw) ; toutes les autres entrées passent telles quelles."""
    x = float(raw)
    return 3.0 - x if item == INVERSE_N4 else x


def scores_corriges(raws):
    return {i: corrige(i, raws[i]) for i in raws}


def score_A_de(corr):
    return round(1.0 + 3.0 * sum(corr[i] for i in COCHES_A) / 6.0, 4)


def score_N_de(corr):
    return round(1.0 + sum(corr[i] for i in FREQ_N) / 4.0, 4)


def score_R_mur_de(corr):
    return round(1.0 + sum(corr[i] for i in FREQ_R[:4]) / 4.0, 4)


def score_R_geste_de(corr):
    return round(1.0 + sum(corr[i] for i in FREQ_R[4:]) / 2.0, 4)


def score_J_de(corr):
    return round(1.0 + 3.0 * sum(corr[i] for i in COCHES_J) / 6.0, 4)


def scores_mecanismes(corr):
    return {"A": score_A_de(corr), "N": score_N_de(corr),
            "R": score_R_mur_de(corr), "J": score_J_de(corr)}


def score_face_de(corr, bloc, nom_face):
    for nom, items, fmt in FACES_Q2[bloc]:
        if nom == nom_face:
            if fmt == "coches":
                return round(1.0 + 3.0 * sum(corr[i] for i in items) / len(items), 4)
            return round(1.0 + sum(corr[i] for i in items) / len(items), 4)
    raise KeyError(nom_face)


# ═══════════════════════════════ L1 — RQS adapté ══════════════════════════════
def calcule_rqs(raws, temps_items, temps_session):
    """RQS adapté (A6) : anti-linéarité + cohérence N interne sur les 10
    entrées fréquentielles ; les 12 cochés hors anti-linéarité (A6 verbatim) ;
    rythme et vigilance inchangés (canon ligne 257).
    Cohérence N : décharge maximale déclarée (N1-N3 = 3) ET retour immédiat
    déclaré (N4 raw = 3) — orage et apaisement simultanés."""
    freq = {i: float(raws[i]) for i in ITEMS_FREQ if i in raws}
    vals = list(freq.values())
    sd = (sum((v - sum(vals) / len(vals)) ** 2 for v in vals) / len(vals)) ** 0.5 \
        if vals else 0.0
    linearite = sd < SEUIL_LINEARITE and len(vals) >= 2
    orage_max = all(raws.get(i) == 3 for i in FREQ_N[:3])
    apaisement_max = raws.get(INVERSE_N4, 0) == 3
    coherence_n = orage_max and apaisement_max
    rythme = (sum(1 for i in ITEMS_FREQ
                  if temps_items.get(i, 99.0) < SEUIL_ITEM_RAPIDE_S) >= 5
              or temps_session < SEUIL_SESSION_S)
    vigilance = raws.get(ITEM_VIGILANCE, 1) >= 2
    rqs = 100.0
    if linearite:
        rqs -= PENALITE_LINEARITE
    if coherence_n:
        rqs -= PENALITE_COHERENCE_N
    if rythme:
        rqs -= PENALITE_RYTHME
    if vigilance:
        rqs -= PENALITE_VIGILANCE
    statut = "OK" if rqs >= SEUIL_RQS_OK else (
        "PRUDENCE" if rqs >= SEUIL_RQS_PRUDENCE else "INVALIDE")
    return {"rqs": round(rqs), "statut": statut, "linearite": linearite,
            "coherence_n": coherence_n, "rythme": rythme, "vigilance": vigilance}


# ═════════════════════ L3 — niveaux, intervalles, frontières ══════════════════
def bornes_ci90(score):
    return (round(score - CI90_DEMI, 4), round(score + CI90_DEMI, 4))


def niveau_ponctuel(score):
    if score < SEUILS_NIVEAUX[0]:
        return NIVEAUX[0]
    if score < SEUILS_NIVEAUX[1]:
        return NIVEAUX[1]
    if score < SEUILS_NIVEAUX[2]:
        return NIVEAUX[2]
    return NIVEAUX[3]


def niveaux_touches(bas, haut):
    """Niveaux couverts par l'intervalle [bas ; haut] (ordre croissant)."""
    touches = []
    if bas < SEUILS_NIVEAUX[0]:
        touches.append(NIVEAUX[0])
    if bas < SEUILS_NIVEAUX[1] and haut >= SEUILS_NIVEAUX[0]:
        touches.append(NIVEAUX[1])
    if bas < SEUILS_NIVEAUX[2] and haut >= SEUILS_NIVEAUX[1]:
        touches.append(NIVEAUX[2])
    if haut >= SEUILS_NIVEAUX[2]:
        touches.append(NIVEAUX[3])
    return touches or [NIVEAUX[0]]


def lecture_L3(score, bas, haut):
    touches = niveaux_touches(bas, haut)
    if len(touches) == 1:
        return {"type": "NIVEAU", "lecture": touches[0],
                "conservateur": touches[0]}
    return {"type": "FRONTIÈRE",
            "lecture": "entre " + " et ".join(touches),
            "conservateur": touches[0]}


# ═════════════════════ L4 — faces / nuage par mécanisme ═══════════════════════
def lecture_L4(corr, bloc):
    s1 = score_face_de(corr, bloc, FACES_Q2[bloc][0][0])
    s2 = score_face_de(corr, bloc, FACES_Q2[bloc][1][0])
    ecart = abs(s1 - s2)
    seuil = SEUIL_HIERARCHIE[bloc]
    if ecart < seuil:
        return {"lecture": "NUAGE", "ecart": round(ecart, 4),
                "seuil": seuil, "dominante": None, "scores": [s1, s2]}
    dom = FACES_Q2[bloc][0][0] if s1 > s2 else FACES_Q2[bloc][1][0]
    return {"lecture": "HIÉRARCHIE DÉCLARABLE", "ecart": round(ecart, 4),
            "seuil": seuil, "dominante": dom, "scores": [s1, s2]}


# ═════════════════════ Filet de sécurité (A5 — double voie + N5) ═════════════
def signal_filet_de(profil, corr, heritage):
    """Court-circuit AVANT l'arbre : (1) voie héritée — signal porté par
    l'héritage Q1 ; (2) voie détectée — ΣJ = 6/6 ET héritage J ≥ VIVE
    (conservateur) ; (3) item sécurité N5 ≥ 2."""
    if heritage.get("signal"):
        return {"filet": True, "voie": "héritée",
                "filet_num": "3919 (héritée) · 3114 · 15 · 112"}
    niv_j_herite = heritage.get("niveaux", {}).get("J")
    if sum(corr[i] for i in COCHES_J) >= SECU_J_SUM and \
            niv_j_herite in ("VIVE", "FORTE"):
        return {"filet": True, "voie": "détectée",
                "filet_num": "3919 (détectée) · 3114 · 15 · 112"}
    if profil.get(ITEM_SECURITE_N5, 0) >= SECU_N5:
        return {"filet": True, "voie": "N5",
                "filet_num": "3919 (N5) · 3114 · 15 · 112"}
    return {"filet": False, "voie": None, "filet_num": None}


# ═════════════════════ Convergence Q1×Q2 (A4 — index interne) ═════════════════
def convergence_de(heritage, corr, s_mec):
    """Couplages attendus carte ↔ ombre (SPEC §3). CV1 : héritage AO ≥ VIVE →
    ΣA ≥ 2 · CV2 : héritage N ≥ VIVE → mécanisme N ≥ 2,60 · CV3 : héritage
    FORTE sur R → mur ≥ 2,60 · CV4 : héritage J ≥ VIVE → ΣJ ≥ 2.
    index = satisfaits ÷ applicables ; n/a si aucun applicable.
    0,00 → SUPPRIMÉE · ≤ 0,50 → PRUDENTE."""
    niveaux = heritage.get("niveaux", {})
    cvs = []
    if niveaux.get("AO") in ("VIVE", "FORTE"):
        cvs.append(("CV1", sum(corr[i] for i in COCHES_A) >= 2))
    if niveaux.get("N") in ("VIVE", "FORTE"):
        cvs.append(("CV2", s_mec["N"] >= SEUILS_NIVEAUX[1]))
    if niveaux.get("R") == "FORTE":
        cvs.append(("CV3", s_mec["R"] >= SEUILS_NIVEAUX[1]))
    if niveaux.get("J") in ("VIVE", "FORTE"):
        cvs.append(("CV4", sum(corr[i] for i in COCHES_J) >= 2))
    if not cvs:
        return {"index": None, "etat": "N/A", "applicables": 0,
                "satisfaits": 0, "detail": []}
    sat = sum(1 for _, ok in cvs if ok)
    index = round(sat / len(cvs), 4)
    if sat == 0:
        etat = "SUPPRIMÉE"
    elif index <= INDEX_PRUDENCE:
        etat = "PRUDENTE"
    else:
        etat = "OK"
    return {"index": index, "etat": etat, "applicables": len(cvs),
            "satisfaits": sat, "detail": cvs}


# ═════════════════════ Nommage (A3 — 7 configurations + 2 états) ══════════════
def nommage_de(cons_niveaux, cv):
    """Priorité verrouillée : (états) P-FILTRE et QUÊTE_VERROUILLÉE traités
    en amont (classifier) · OMBRE_SUPPRIMÉE (index 0,00) · OMBRE_PRUDENTE
    (index ≤ 0,50) · ZONE_CALME (4 × ≤ TRANQUILLE) · DOUBLE_PENTE (≥ 2 ×
    ≥ VIVE) · dominante unique : MUR_DE_DÉFENSE (R) · ORAGE_LENT (N) ·
    LENTILLE (J) · PENCHANT_PROPRE (A)."""
    if cv["etat"] == "SUPPRIMÉE":
        return {"label": "OMBRE_SUPPRIMÉE", "type": "état"}
    if cv["etat"] == "PRUDENTE":
        return {"label": "OMBRE_PRUDENTE", "type": "configuration"}
    vives = [b for b in ("A", "N", "R", "J") if cons_niveaux[b] in ("VIVE", "FORTE")]
    if not vives:
        return {"label": "ZONE_CALME", "type": "configuration"}
    if len(vives) >= 2:
        return {"label": "DOUBLE_PENTE", "type": "configuration"}
    b = vives[0]
    label = {"R": "MUR_DE_DÉFENSE", "N": "ORAGE_LENT", "J": "LENTILLE",
             "A": "PENCHANT_PROPRE"}[b]
    return {"label": label, "type": "configuration"}


# ═════════════════════ Palier (max — leçon Q5-A3) ═════════════════════════════
def palier_de(niv_a, niv_n, niv_r, niv_j, filet):
    if filet:
        return {"palier": PALIER_ROUGE, "cause": "signal sécurité",
                "ombre_affichee": False}
    niveaux = {"A": niv_a, "N": niv_n, "R": niv_r, "J": niv_j}
    plus_haut = max(niveaux.values(), key=NIVEAUX.index)
    if plus_haut == "FORTE":
        p, cause = PALIER_ROUGE, max(niveaux, key=lambda b: NIVEAUX.index(niveaux[b]))
    elif plus_haut == "VIVE":
        p, cause = PALIER_ORANGE, max(niveaux, key=lambda b: NIVEAUX.index(niveaux[b]))
    else:
        p, cause = PALIER_VERT, None
    return {"palier": p, "cause": cause, "ombre_affichee": True}


# ═════════════════════ L7 — RCI (mécanismes, ligne 263 verbatim) ══════════════
def rci_de(base, re_test):
    delta = round(re_test - base, 4)          # Δ = re − base (jamais l'inverse)
    ad = abs(delta)
    if ad >= SEUIL_FIABLE:
        verdict = "FIABLE"
    elif ad >= SEUIL_SUGGESTION:
        verdict = "SUGGESTION"
    else:
        verdict = "BRUIT"
    traversee = any(base < s <= re_test for s in SEUILS_NIVEAUX) or \
        any(re_test < s <= base for s in SEUILS_NIVEAUX)
    return {"delta": delta, "verdict": verdict, "traversee": traversee}


# ═════════════════════ Classification d'une rive ══════════════════════════════
def classifier_rive(profil, heritage):
    """Ombre d'une rive. Ordre : (1) filet — court-circuit AVANT l'arbre ;
    (2) héritage invalide — quête verrouillée (C7) ; (3) RQS propre INVALIDE —
    aucun résultat ; (4) lecture complète (mécanismes, L3, L4, convergence,
    nommage, palier, L7 sur le mécanisme N)."""
    raws = {i: profil[i] for i in ENTREES if i in profil}
    raws[ITEM_VIGILANCE] = profil.get(ITEM_VIGILANCE, 1)
    corr = scores_corriges(raws)
    filet = signal_filet_de(profil, corr, heritage)
    rqs = calcule_rqs(raws, profil.get("temps_items", {}),
                      profil.get("temps_session", 999.0))
    if filet["filet"]:
        return {"rqs": rqs, "filet": filet, "ombre": None,
                "palier": PALIER_ROUGE, "etat": "P-FILTRE", "label": None,
                "mecanismes": None, "faces": None, "cv": None, "rci": None,
                "bandeau": "D-CRISE : court-circuit AVANT l'arbre — P-FILTRE, "
                           "ombre non affichée."}
    if heritage.get("rqs", 100.0) < SEUIL_RQS_PRUDENCE:
        return {"rqs": rqs, "filet": filet, "ombre": None, "palier": None,
                "etat": "QUÊTE_VERROUILLÉE", "label": None,
                "mecanismes": None, "faces": None, "cv": None, "rci": None,
                "bandeau": TEMPLATES["etat_verrouillee"]}
    if rqs["statut"] == "INVALIDE":
        return {"rqs": rqs, "filet": filet, "ombre": None, "palier": None,
                "etat": "AUCUN_RÉSULTAT", "label": None,
                "mecanismes": None, "faces": None, "cv": None, "rci": None,
                "bandeau": TEMPLATES["invalide"].format(rqs=rqs["rqs"])}
    s_mec = scores_mecanismes(corr)
    niveaux, faces = {}, {}
    for bloc in ("A", "N", "R", "J"):
        s = s_mec[bloc]
        bas, haut = bornes_ci90(s)
        niveaux[bloc] = {"score": s, "ci90": [bas, haut],
                         **lecture_L3(s, bas, haut)}
        faces[bloc] = lecture_L4(corr, bloc)
    cons = {b: niveaux[b]["conservateur"] for b in niveaux}
    cv = convergence_de(heritage, corr, s_mec)
    nom = nommage_de(cons, cv)
    p = palier_de(cons["A"], cons["N"], cons["R"], cons["J"], False)
    gestes = score_R_geste_de(corr)
    rci = None
    if profil.get("re_test_entrees") is not None:
        corr_re = scores_corriges(profil["re_test_entrees"])
        s_re = scores_mecanismes(corr_re)
        rci = {"N": rci_de(s_mec["N"], s_re["N"])}   # L7 sur le mécanisme N (le suivi cible l'orage)
    return {"rqs": rqs, "filet": filet, "ombre": True,
            "etat": "OMBRE", "palier": p["palier"], "palier_cause": p["cause"],
            "label": nom["label"], "label_type": nom["type"],
            "mecanismes": niveaux, "faces": faces, "cv": cv,
            "gestes": gestes, "cons": cons, "rci": rci, "bandeau": None}


def classifier_couple(couple):
    a = classifier_rive(couple["rive_a"], couple["heritage_a"])
    b = classifier_rive(couple["rive_b"], couple["heritage_b"])
    return {"rive_a": a, "rive_b": b}


# ═══════════════════ Templates d'affichage (autoporteurs, C5/C6) ══════════════
TEMPLATES = {
    "zone_ombre": "Ce que l'on voit dans tes réponses : {ombre} — descriptif causal, sans étiquette.",
    "zone_force": "Ta zone de force, tirée de tes vraies réponses : {force}.",
    "penchant_aujourdhui": "Ce qui penche aujourd'hui — ce n'est pas une nature, c'est un penchant : ça se travaille.",
    "zone_calme": "Cette zone est calme chez toi — rien à fabriquer.",
    "label_zone_calme": "Ombre éparpillée en détente : rien qui penche fort en ce moment — rien à fabriquer.",
    "label_penchant_propre": "Le penchant : quand ça coince, la cause se cherche d'abord ailleurs — ta part reste à découvrir, en douceur.",
    "label_orage_lent": "L'orage lent : ça monte vite et ça redescend doucement — le retour au calme est un terrain de travail.",
    "label_mur_defense": "Le mur de défense : après le conflit, se défendre vient avant de réparer — terrain de travail, pas un verdict.",
    "label_lentille": "La lentille : l'ambiguïté devient vite menaçante, la vérification appelle la vérification — jamais une histoire de qui, toujours une mécanique.",
    "label_double_pente": "Deux mécaniques penchent ensemble : la carte se lit à deux, un pas à la fois.",
    "label_prudente": "Ta carte et tes réponses du jour divergent — mécanique en lecture prudente : à reprendre à deux, sans conclure.",
    "etat_supprimee": "Tes réponses ne soutiennent pas de mécanique — rien à fabriquer (anti-fabrication).",
    "etat_verrouillee": "Aucune mécanique ne se lit sans carte valide : reprends d'abord ta carte.",
    "frontiere": "Ta lecture de {bloc} est une FRONTIÈRE ({lecture}) — décision conservatrice : {conservateur}.",
    "nuage": "Tes deux facettes de {bloc} sont au même niveau — nuage : la mesure ne départage pas (anti-surinterprétation).",
    "hierarchie": "Dans {bloc}, {dominante} ressort de façon déclarable.",
    "palier_vert": "Palier 🟢 EXERCICE MAISON : une petite pratique à soi — si la zone est calme, rien à fabriquer.",
    "palier_orange": "Palier 🟠 MODULE DE COUPLE : un temps à deux sous la mécanique.",
    "palier_rouge": "Palier 🔴 ORIENTATION : le chemin le plus court, pas un échec.",
    "filet_heritee": "Un signal de sécurité est présent dans ta carte — le filet s'ouvre avant tout : P-FILTRE — {filet_num}. L'ombre n'est pas affichée.",
    "filet_detectee": "Le contrôle déclaré atteint le seuil de sécurité — ce n'est plus une mécanique à lire, c'est un signal : P-FILTRE — {filet_num}. Aucune étiquette, aucun verdict.",
    "filet_n5": "Tu déclares un retour au calme qui ne vient pas — ce signal passe avant la mécanique : P-FILTRE — {filet_num}. Renvoi chaleureux, pas un verdict.",
    "prudence_rqs": "Qualité de réponse PRUDENCE ({rqs}/100) — la mécanique reste lisible, avec prudence.",
    "invalide": "Réponses de qualité insuffisante (RQS {rqs}/100) — aucun résultat affiché.",
    "reparation": "Ta façon de réparer est un terrain de travail, pas un verdict — et si la zone est calme, rien à fabriquer.",
    "convergence_ok": "Carte et mécanique se tiennent : ce que la carte mesure, ce que tes réponses montrent.",
    "convergence_prudente": "Carte et mécanique divergent en partie — lecture prudente, sans conclure.",
    "rci_fiable": "UN CHANGEMENT FIABLE depuis la base (re-test 8 semaines, |Δ| ≥ 0,58).",
    "rci_suggestion": "UNE PISTE À CONFIRMER (|Δ| entre 0,41 et 0,58).",
    "rci_bruit": "DANS LE BRUIT DE LA MESURE (|Δ| < 0,41) — rien à conclure.",
    "re_test_programme": "Re-test programmé à 8 semaines (ligne 274).",
    "bandeau_sim": "Simulation D-SIM — couples fictifs, zéro donnée réelle.",
}

MOTS_INTERDITS_C6 = ("névrosisme", "narcissisme", "jalousie", "diagnostic",
                     "dépistage", "pathologie", "fautif", "coupable",
                     "anormal", "toxique", "pervers", "déséquilibré")
VERBATIM_REPARATION = "terrain de travail, pas un verdict"
VERBATIM_CALME = "rien à fabriquer"


# ═══════════════ Calibration D-STD-2 (exacte par énumération) ═════════════════
def _phi(x):
    return 0.5 * (1.0 + math.erf(x / math.sqrt(2.0)))


def _freq_dist(mu):
    """Distribution exacte d'un item fréquentiel (loi du simulateur :
    item = clip(round(N(mu, 0,60)), 0, 3)) — 4 masses 0-3."""
    p = [0.0] * 4
    p[0] = _phi((0.5 - mu) / SIGMA_ITEM)
    p[1] = _phi((1.5 - mu) / SIGMA_ITEM) - _phi((0.5 - mu) / SIGMA_ITEM)
    p[2] = _phi((2.5 - mu) / SIGMA_ITEM) - _phi((1.5 - mu) / SIGMA_ITEM)
    p[3] = 1.0 - _phi((2.5 - mu) / SIGMA_ITEM)
    return p


def _sum_dist_4(mu4):
    """Distribution exacte de la somme de 4 items fréquentiels (256 états)."""
    d = {0: 1.0}
    for mu in mu4:
        p = _freq_dist(mu)
        nd = {}
        for s, q in d.items():
            for v, pv in enumerate(p):
                nd[s + v] = nd.get(s + v, 0.0) + q * pv
        d = nd
    return d


def _binom_dist_6(p_eff):
    """Distribution exacte du nombre de cochés sur 6 scénarios (binomiale
    à p effectif — items indépendants de probabilité p_eff = moyenne des p)."""
    d = {}
    for k in range(7):
        c = math.comb(6, k)
        d[k] = c * p_eff ** k * (1.0 - p_eff) ** (6 - k)
    return d


def _cons_band_4items(dist):
    """P(conservateur = niveau) pour un bloc de 4 items 0-3 : score = 1+S/4 ;
    bas < 1,80 ⟺ S ≤ 4 · bas < 2,60 ⟺ S ≤ 8 · bas < 3,20 ⟺ S ≤ 10."""
    pd = sum(q for s, q in dist.items() if s <= 4)
    pt = sum(q for s, q in dist.items() if s <= 8) - pd
    pv = sum(q for s, q in dist.items() if s <= 10) - pd - pt
    pf = 1.0 - pd - pt - pv
    return {"DISCRÈTE": pd, "TRANQUILLE": pt, "VIVE": pv, "FORTE": pf}


def _cons_band_6coches(dist):
    """P(conservateur = niveau) pour un bloc cochés : score = 1+3k/6 ;
    DISCRÈTE k ≤ 2 · TRANQUILLE k ≤ 4 · VIVE k ≤ 5 · FORTE k = 6."""
    pd = sum(q for k, q in dist.items() if k <= 2)
    pt = sum(q for k, q in dist.items() if k <= 4) - pd
    pv = dist.get(5, 0.0)
    pf = dist.get(6, 0.0)
    return {"DISCRÈTE": pd, "TRANQUILLE": pt, "VIVE": pv, "FORTE": pf}


def _heritage_axis_dist(mu_f1, mu_f2):
    """Distribution exacte de la somme des 6 items d'un axe Q1 (héritage,
    échelle 1-4, item = clip(round(N(mu, 0,60)), 1, 4)) — patron Q1."""
    def face_dist(mu):
        p = [0.0] * 4
        p[0] = _phi((1.5 - mu) / SIGMA_ITEM)
        p[1] = _phi((2.5 - mu) / SIGMA_ITEM) - _phi((1.5 - mu) / SIGMA_ITEM)
        p[2] = _phi((3.5 - mu) / SIGMA_ITEM) - _phi((2.5 - mu) / SIGMA_ITEM)
        p[3] = 1.0 - _phi((3.5 - mu) / SIGMA_ITEM)
        return p
    p1, p2 = face_dist(mu_f1), face_dist(mu_f2)
    # (somme de 6 items = 2 faces de 3)
    d1, d2 = {}, {}
    for a in (1, 2, 3, 4):
        for b in (1, 2, 3, 4):
            for c in (1, 2, 3, 4):
                s1 = a + b + c
                d1[s1] = d1.get(s1, 0.0) + p1[a - 1] * p1[b - 1] * p1[c - 1]
                d2[s1] = d2.get(s1, 0.0) + p2[a - 1] * p2[b - 1] * p2[c - 1]
    out = {}
    for s1, q1 in d1.items():
        for s2, q2 in d2.items():
            out[s1 + s2] = out.get(s1 + s2, 0.0) + q1 * q2
    return out


def _heritage_band(dist):
    """P(conservateur = niveau) d'un axe hérité (6 items, échelle 1-4) :
    moyenne /6 vs seuils + CI90 — bornes exactes (patron Q1) :
    DISCRÈTE ≤ 13 · TRANQUILLE 14-18 · VIVE 19-21 · FORTE ≥ 22."""
    pd = sum(q for s, q in dist.items() if s <= 13)
    pt = sum(q for s, q in dist.items() if 14 <= s <= 18)
    pv = sum(q for s, q in dist.items() if 19 <= s <= 21)
    pf = sum(q for s, q in dist.items() if s >= 22)
    return {"DISCRÈTE": pd, "TRANQUILLE": pt, "VIVE": pv, "FORTE": pf}


def _params_blocs(g):
    """Paramètres vrais des blocs ombre : p_eff cochés A/J, μ fréq N/R."""
    return {"pA": g["pA"], "pJ": g["pJ"], "muN": g["muN"], "muR": g["muR"]}


def _p_palier_rive(g, vrai_palier):
    """P(palier affiché == vrai) — produit exact des 4 blocs (indépendance)."""
    dA = _cons_band_6coches(_binom_dist_6(g["pA"]))
    dN = _cons_band_4items(_sum_dist_4(g["muN"]))
    dR = _cons_band_4items(_sum_dist_4(g["muR"]))
    dJ = _cons_band_6coches(_binom_dist_6(g["pJ"]))
    bands = [dA, dN, dR, dJ]
    q = [b["FORTE"] for b in bands]
    v = [b["VIVE"] for b in bands]
    p_pas_forte = math.prod(1.0 - x for x in q)
    p_pas_fv = math.prod(1.0 - x - y for x, y in zip(q, v))
    if vrai_palier == PALIER_ROUGE:
        return 1.0 - p_pas_forte
    if vrai_palier == PALIER_ORANGE:
        return p_pas_forte - p_pas_fv
    return p_pas_fv


def _vrai_label_de_mu(g):
    """Label vrai de la configuration (règle du moteur sur les μ)."""
    def cons_coches(p_eff):
        k = round(p_eff * 6)
        s = 1.0 + 0.5 * k
        return niveau_ponctuel(round(s - CI90_DEMI, 4))
    def cons_freq(mu4):
        s = round(1.0 + sum(mu4) / 4.0, 4)
        return niveau_ponctuel(round(s - CI90_DEMI, 4))
    cons = {"A": cons_coches(g["pA"]), "N": cons_freq(g["muN"]),
            "R": cons_freq(g["muR"]), "J": cons_coches(g["pJ"])}
    cv = g.get("cv_vrai", "OK")
    if cv == "SUPPRIMÉE":
        return "OMBRE_SUPPRIMÉE"
    if cv == "PRUDENTE":
        return "OMBRE_PRUDENTE"
    vives = [b for b in ("A", "N", "R", "J") if cons[b] in ("VIVE", "FORTE")]
    if not vives:
        return "ZONE_CALME"
    if len(vives) >= 2:
        return "DOUBLE_PENTE"
    return {"R": "MUR_DE_DÉFENSE", "N": "ORAGE_LENT", "J": "LENTILLE",
            "A": "PENCHANT_PROPRE"}[vives[0]]


def _vrai_palier_de_mu(g):
    def cons_coches(p_eff):
        return niveau_ponctuel(round(1.0 + 0.5 * round(p_eff * 6) - CI90_DEMI, 4))
    def cons_freq(mu4):
        return niveau_ponctuel(round(1.0 + sum(mu4) / 4.0 - CI90_DEMI, 4))
    cons = [cons_coches(g["pA"]), cons_freq(g["muN"]),
            cons_freq(g["muR"]), cons_coches(g["pJ"])]
    plus_haut = max(cons, key=NIVEAUX.index)
    return {NIVEAUX[3]: PALIER_ROUGE, NIVEAUX[2]: PALIER_ORANGE}.get(plus_haut,
                                                                     PALIER_VERT)


def _p_label_vrai(g):
    """P(label affiché == vrai) — probabilité EXACTE de l'événement-label via
    les bandes conservatrices des 4 blocs (énumération exacte) :
    ZONE_CALME ⟺ aucun ≥ VIVE · DOUBLE_PENTE ⟺ ≥ 2 ≥ VIVE · dominante unique
    ⟺ exactement un ≥ VIVE. (Borne stricte du label : la config exacte des
    conservateurs n'est PAS comparée — pattern Q1, décisions affichées.)"""
    dA = _cons_band_6coches(_binom_dist_6(g["pA"]))
    dN = _cons_band_4items(_sum_dist_4(g["muN"]))
    dR = _cons_band_4items(_sum_dist_4(g["muR"]))
    dJ = _cons_band_6coches(_binom_dist_6(g["pJ"]))
    v = [dA["VIVE"] + dA["FORTE"], dN["VIVE"] + dN["FORTE"],
         dR["VIVE"] + dR["FORTE"], dJ["VIVE"] + dJ["FORTE"]]
    vives = g.get("vives_vrai")
    label = g.get("label_vrai")
    if label == "ZONE_CALME":
        return math.prod(1.0 - x for x in v)
    if label == "DOUBLE_PENTE":
        p0 = math.prod(1.0 - x for x in v)
        p1 = sum(v[i] * math.prod(1.0 - x for j, x in enumerate(v) if j != i)
                 for i in range(4))
        return 1.0 - p0 - p1
    # dominante unique sur le bloc cible
    idx = {"A": 0, "N": 1, "R": 2, "J": 3}[vives]
    autres = [v[i] for i in range(4) if i != idx]
    return v[idx] * math.prod(1.0 - x for x in autres)


def _p_heritage_role(g):
    """P(niveaux hérités dans leur bande-role vraie) — produit exact des axes
    Q1 simulés (6 items, patron Q1). Rôles : "≥VIVE", "FORTE", "≤TRANQUILLE"."""
    p = 1.0
    for axe, role in g["heritage_roles"].items():
        dist = _heritage_axis_dist(g["her_mu"][axe + "1"], g["her_mu"][axe + "2"])
        band = _heritage_band(dist)
        if role == "≥VIVE":
            p *= band["VIVE"] + band["FORTE"]
        elif role == "FORTE":
            p *= band["FORTE"]
        else:
            p *= band["DISCRÈTE"] + band["TRANQUILLE"]
    return p


def _face3_dist(mu):
    """Distribution exacte de la somme d'une face Q1 de 3 items (héritage)."""
    p = [0.0] * 4
    p[0] = _phi((1.5 - mu) / SIGMA_ITEM)
    p[1] = _phi((2.5 - mu) / SIGMA_ITEM) - _phi((1.5 - mu) / SIGMA_ITEM)
    p[2] = _phi((3.5 - mu) / SIGMA_ITEM) - _phi((2.5 - mu) / SIGMA_ITEM)
    p[3] = 1.0 - _phi((3.5 - mu) / SIGMA_ITEM)
    d = {}
    for a in (1, 2, 3, 4):
        for b in (1, 2, 3, 4):
            for c in (1, 2, 3, 4):
                s = a + b + c
                d[s] = d.get(s, 0.0) + p[a - 1] * p[b - 1] * p[c - 1]
    return d


def _p_signal_rive(mu_j2, vrai_signal):
    """P(état signal observé == vrai) — signal héritage ⟺ somme face J2 ≥ 11
    (borne basse ≥ 3,20, patron Q1) — énumération exacte."""
    d = _face3_dist(mu_j2)
    p_sig = sum(q for s, q in d.items() if s >= 11)
    return p_sig if vrai_signal else 1.0 - p_sig


def p_conformite_groupe(g):
    """p̂ théorique de conformité du groupe (surface de décision : labels,
    paliers, états de convergence, filets double voie, pièges RQS, héritage
    invalide, verdicts RCI). Facteurs indépendants — pattern Q1."""
    if g.get("piege"):
        return 0.998
    if g.get("heritage_invalide"):
        return 1.0     # état déterministe (rqs héritage fixé < 70)
    if g.get("filet"):
        return g.get("p_filet", 1.0)  # voies déterministes par construction ;
        # G08 : 2,6 % de risque de signal héritage parasite par rive (J2 μ 3,0)
        # — niveau couple : (25 + 10×0,974² + 5) / 40
    if g.get("cv_vrai") in ("SUPPRIMÉE", "PRUDENTE", "MIXTE"):
        # G06 : entrées fixées (états déterministes) — le bruit porte sur les
        # rôles hérités seuls (applicabilité des CV), aux DEUX rives
        pr = _p_heritage_role(g)
        return pr * pr
    if g.get("items_fixes"):
        # G05 : bloc J fixé (5/6 cochés, rotation par couple) — le label est
        # déterministe ; le bruit porte sur les rôles hérités + signal
        pr = _p_heritage_role(g) * _p_signal_rive(g["her_mu"]["J2"], False)
        return pr * pr
    # niveau COUPLE (pattern Q1 : les deux rives, produits indépendants)
    p_rive = (_p_label_vrai(g) * _p_heritage_role(g)
              * _p_signal_rive(g["her_mu"]["J2"], False))
    p = p_rive * p_rive
    if g.get("re_test"):
        def p_rci(dv):
            if dv >= SEUIL_FIABLE:
                return 1.0 - _phi((SEUIL_FIABLE - dv) / SIGMA_RCI_Q2)
            if dv >= SEUIL_SUGGESTION:
                return (_phi((SEUIL_FIABLE - dv) / SIGMA_RCI_Q2)
                        - _phi((SEUIL_SUGGESTION - dv) / SIGMA_RCI_Q2))
            return _phi((SEUIL_SUGGESTION - dv) / SIGMA_RCI_Q2)
        p *= math.prod(min(1.0, p_rci(dv) ** 2) for dv in DELTAS_VRAIS_G14) \
            ** (1.0 / len(DELTAS_VRAIS_G14))
    return min(p, 0.99)   # plafond de surface — une borne n'est jamais 1


DELTAS_VRAIS_G14 = [1.50] * 20 + [0.15] * 20  # FIABLE / BRUIT —
# la bande SUGGESTION (0,17) est trop étroite devant σ_diff 0,4243 (4 items)
# pour un groupe simulé robuste : elle reste prouvée exactement en D-TABLE


# ── Géométrie des 14 groupes (paramètres vrais par rive) — 40 × 14 = 560 ─────
# pA/pJ : probabilité de cocher chaque scénario (0-1) · muN : μ des 4 items N
# (N1-N3 orage, N4 retour — raw 0-3) · muR : μ des 4 items mur (0-3) ·
# muR_geste : μ des 2 items geste · her_mu : μ des faces Q1 héritées
# (échelle 1-4 ; μ 5,0 = saturation au plafond 4) · heritage_roles : bandes-
# rôles vraies des axes hérités · cv_vrai : état de convergence vrai.
GEOMETRIE = {
    "G01_CONVERGENCE_PLEINE":   {"pA": 0.70, "pJ": 0.55, "muN": [2.8, 2.8, 2.8, 0.4], "muR": [2.9, 2.9, 2.9, 2.9], "muR_geste": [0.5, 0.5], "label_vrai": "DOUBLE_PENTE", "n": 40,
                                 "her_mu": {"AO1": 3.6, "AO2": 3.6, "N1": 3.6, "N2": 3.6, "R1": 3.6, "R2": 3.6, "J1": 4.0, "J2": 3.0},
                                 "heritage_roles": {"AO": "≥VIVE", "N": "≥VIVE", "R": "≥VIVE", "J": "≥VIVE"}, "cv_vrai": "OK"},
    "G02_PENCHANT_PROPRE":      {"pA": 1.00, "pJ": 0.10, "muN": [1.6, 1.6, 1.6, 1.6], "muR": [1.5, 1.5, 1.5, 1.5], "muR_geste": [0.5, 0.5], "label_vrai": "PENCHANT_PROPRE", "vives_vrai": "A", "n": 40,
                                 "her_mu": {"AO1": 3.6, "AO2": 3.6, "N1": 2.0, "N2": 2.0, "R1": 2.0, "R2": 2.0, "J1": 2.0, "J2": 2.0},
                                 "heritage_roles": {"AO": "≥VIVE", "N": "≤TRANQUILLE", "R": "≤TRANQUILLE", "J": "≤TRANQUILLE"}, "cv_vrai": "OK"},
    "G03_ORAGE_LENT":           {"pA": 0.10, "pJ": 0.10, "muN": [3.4, 3.4, 3.4, 0.2], "muR": [1.5, 1.5, 1.5, 1.5], "muR_geste": [0.5, 0.5], "label_vrai": "ORAGE_LENT", "vives_vrai": "N", "n": 40,
                                 "her_mu": {"AO1": 2.0, "AO2": 2.0, "N1": 3.6, "N2": 3.6, "R1": 2.0, "R2": 2.0, "J1": 2.0, "J2": 2.0},
                                 "heritage_roles": {"AO": "≤TRANQUILLE", "N": "≥VIVE", "R": "≤TRANQUILLE", "J": "≤TRANQUILLE"}, "cv_vrai": "OK"},
    "G04_MUR_DEFENSE":          {"pA": 0.10, "pJ": 0.10, "muN": [1.6, 1.6, 1.6, 1.6], "muR": [4.0, 4.0, 4.0, 4.0], "muR_geste": [0.2, 0.2], "label_vrai": "MUR_DE_DÉFENSE", "vives_vrai": "R", "n": 40,
                                 "her_mu": {"AO1": 2.0, "AO2": 2.0, "N1": 2.0, "N2": 2.0, "R1": 5.0, "R2": 5.0, "J1": 2.0, "J2": 2.0},
                                 "heritage_roles": {"AO": "≤TRANQUILLE", "N": "≤TRANQUILLE", "R": "FORTE", "J": "≤TRANQUILLE"}, "cv_vrai": "OK"},
    "G05_LENTILLE_JALOUSE":     {"pA": 0.10, "pJ": 0.80, "items_fixes": True, "muN": [1.6, 1.6, 1.6, 1.6], "muR": [1.5, 1.5, 1.5, 1.5], "muR_geste": [0.5, 0.5], "label_vrai": "LENTILLE", "vives_vrai": "J", "n": 40,
                                 "her_mu": {"AO1": 2.0, "AO2": 2.0, "N1": 2.0, "N2": 2.0, "R1": 2.0, "R2": 2.0, "J1": 3.9, "J2": 3.1},
                                 "heritage_roles": {"AO": "≤TRANQUILLE", "N": "≤TRANQUILLE", "R": "≤TRANQUILLE", "J": "≥VIVE"}, "cv_vrai": "OK"},
    "G06_DIVERGENCE_CARTE_OMBRE": {"pA": 0.08, "pJ": 0.08, "muN": [1.4, 1.4, 1.4, 1.4], "muR": [1.4, 1.4, 1.4, 1.4], "muR_geste": [0.2, 0.2], "n": 40,
                                 "her_mu": {"AO1": 3.6, "AO2": 3.6, "N1": 3.6, "N2": 3.6, "R1": 2.0, "R2": 2.0, "J1": 2.0, "J2": 2.0},
                                 "heritage_roles": {"AO": "≥VIVE", "N": "≥VIVE", "R": "≤TRANQUILLE", "J": "≤TRANQUILLE"},
                                 "cv_vrai": "MIXTE"},  # 20 index 0,50 PRUDENTE + 20 index 0,00 SUPPRIMÉE (entrées fixées)
    "G07_ZONE_CALME_OMBRE":     {"pA": 0.10, "pJ": 0.10, "muN": [1.5, 1.5, 1.5, 1.5], "muR": [1.4, 1.4, 1.4, 1.4], "muR_geste": [0.2, 0.2], "label_vrai": "ZONE_CALME", "n": 40,
                                 "her_mu": {"AO1": 2.0, "AO2": 2.0, "N1": 2.0, "N2": 2.0, "R1": 2.0, "R2": 2.0, "J1": 2.0, "J2": 2.0},
                                 "heritage_roles": {"AO": "≤TRANQUILLE", "N": "≤TRANQUILLE", "R": "≤TRANQUILLE", "J": "≤TRANQUILLE"}, "cv_vrai": "N/A"},
    "G08_SIGNAL_FILET":         {"pA": 0.10, "pJ": 0.10, "muN": [1.5, 1.5, 1.5, 1.5], "muR": [1.4, 1.4, 1.4, 1.4], "muR_geste": [0.2, 0.2], "n": 40,
                                 "her_mu": {"AO1": 2.0, "AO2": 2.0, "N1": 2.0, "N2": 2.0, "R1": 2.0, "R2": 2.0, "J1": 2.0, "J2": 2.0},
                                 "heritage_roles": {"AO": "≤TRANQUILLE", "N": "≤TRANQUILLE", "R": "≤TRANQUILLE", "J": "≤TRANQUILLE"},
                                 "filet": True, "p_filet": 0.987},  # 25 héritée · 10 détectée (J2 héritage μ 4,0/3,0) · 5 N5
    "G09_DOUBLE_PENTE":         {"pA": 0.10, "pJ": 0.10, "muN": [3.0, 3.0, 3.0, 0.4], "muR": [3.0, 3.0, 3.0, 3.0], "muR_geste": [0.5, 0.5], "label_vrai": "DOUBLE_PENTE", "n": 40,
                                 "her_mu": {"AO1": 2.0, "AO2": 2.0, "N1": 3.6, "N2": 3.6, "R1": 3.6, "R2": 3.6, "J1": 2.0, "J2": 2.0},
                                 "heritage_roles": {"AO": "≤TRANQUILLE", "N": "≥VIVE", "R": "≥VIVE", "J": "≤TRANQUILLE"}, "cv_vrai": "OK"},
    "G10_FRONTIERE_OMBRE":      {"pA": 0.10, "pJ": 0.10, "muN": [2.0, 2.0, 2.0, 2.0], "muR": [2.0, 2.0, 2.0, 2.0], "muR_geste": [0.5, 0.5], "label_vrai": "ZONE_CALME", "n": 40,
                                 "her_mu": {"AO1": 2.0, "AO2": 2.0, "N1": 2.0, "N2": 2.0, "R1": 2.0, "R2": 2.0, "J1": 2.0, "J2": 2.0},
                                 "heritage_roles": {"AO": "≤TRANQUILLE", "N": "≤TRANQUILLE", "R": "≤TRANQUILLE", "J": "≤TRANQUILLE"}, "cv_vrai": "N/A"},
    "G11_NUAGE_MECANISMES":     {"pA": 0.35, "pJ": 0.35, "muN": [1.6, 1.6, 1.6, 1.6], "muR": [1.6, 1.6, 1.6, 1.6], "muR_geste": [1.6, 1.6], "label_vrai": "ZONE_CALME", "n": 40,
                                 "her_mu": {"AO1": 2.0, "AO2": 2.0, "N1": 2.0, "N2": 2.0, "R1": 2.0, "R2": 2.0, "J1": 2.0, "J2": 2.0},
                                 "heritage_roles": {"AO": "≤TRANQUILLE", "N": "≤TRANQUILLE", "R": "≤TRANQUILLE", "J": "≤TRANQUILLE"}, "cv_vrai": "N/A"},
    "G12_PIEGES_RQS":           {"pA": 0.50, "pJ": 0.50, "muN": [2.0, 2.0, 2.0, 2.0], "muR": [2.0, 2.0, 2.0, 2.0], "muR_geste": [1.0, 1.0], "n": 40,
                                 "her_mu": {"AO1": 2.0, "AO2": 2.0, "N1": 2.0, "N2": 2.0, "R1": 2.0, "R2": 2.0, "J1": 2.0, "J2": 2.0},
                                 "heritage_roles": {"AO": "≤TRANQUILLE", "N": "≤TRANQUILLE", "R": "≤TRANQUILLE", "J": "≤TRANQUILLE"},
                                 "piege": True},
    "G13_HERITAGE_INVALIDE":    {"pA": 0.50, "pJ": 0.50, "muN": [2.0, 2.0, 2.0, 2.0], "muR": [2.0, 2.0, 2.0, 2.0], "muR_geste": [1.0, 1.0], "n": 40,
                                 "her_mu": {"AO1": 2.0, "AO2": 2.0, "N1": 2.0, "N2": 2.0, "R1": 2.0, "R2": 2.0, "J1": 2.0, "J2": 2.0},
                                 "heritage_roles": {"AO": "≤TRANQUILLE", "N": "≤TRANQUILLE", "R": "≤TRANQUILLE", "J": "≤TRANQUILLE"},
                                 "heritage_invalide": True},
    "G14_RE_TEST_OMBRE":        {"pA": 0.10, "pJ": 0.10, "muN": [0.8, 0.8, 0.8, 0.8], "muR": [1.4, 1.4, 1.4, 1.4], "muR_geste": [0.5, 0.5], "label_vrai": "ZONE_CALME", "n": 40,
                                 "her_mu": {"AO1": 2.0, "AO2": 2.0, "N1": 2.0, "N2": 2.0, "R1": 2.0, "R2": 2.0, "J1": 2.0, "J2": 2.0},
                                 "heritage_roles": {"AO": "≤TRANQUILLE", "N": "≤TRANQUILLE", "R": "≤TRANQUILLE", "J": "≤TRANQUILLE"},
                                 "re_test": True},  # Δ vrais injectés sur les items N (clippés 0-3)
}


def calibration_d_std_2():
    """Seuil PAR groupe = (p̂ − 2,5σ̂) — calibré binomial, bornes DISTINCTES
    (leçon SM-Q5 : G1=G5 attrapé). Retourne aussi le tableau des centres."""
    calib, centres = {}, {}
    for gname, g in GEOMETRIE.items():
        n = g["n"]
        p = p_conformite_groupe(g)
        sigma = (p * (1.0 - p) / n) ** 0.5
        seuil = round(max(0.0, (p - 2.5 * sigma)) * 100.0, 1)
        calib[gname] = {"p_theo": round(p, 4), "sigma": round(sigma, 4),
                        "seuil": seuil, "n": n}
        # centres : distance des μ scores aux seuils L3, en σ_eff (0,30)
        def cons_vrai(mu4):
            return round(1.0 + sum(mu4) / 4.0, 4)
        mus = [round(1.0 + 0.5 * round(g["pA"] * 6), 4),
               cons_vrai(g["muN"]), cons_vrai(g["muR"]),
               round(1.0 + 0.5 * round(g["pJ"] * 6), 4)]
        dists = [abs(mu - s) / SIGMA_EFF_BLOC for mu in mus for s in SEUILS_NIVEAUX]
        centres[gname] = {"mu_scores_A": mus,
                          "distance_min_seuil_sigma": round(min(dists), 2),
                          "dans_bande_3sigma": min(dists) < 3.0}
    distinct = len({c["seuil"] for c in calib.values()}) == len(calib)
    return {"seuils": {k: v["seuil"] for k, v in calib.items()},
            "detail": calib, "centres": centres,
            "bornes_distinctes": distinct, "ok": distinct}


SEUILS_D_STD_2 = {k: v["seuil"]
                  for k, v in calibration_d_std_2()["detail"].items()}


# ═══════════════════════════ D-TABLE (C1 — cas exhaustifs) ════════════════════
def verifier_d_table():
    """D-VÉRITÉ : cas de table exhaustifs — les RÈGLES prouvées exactement
    (leçon Q5 : C1 croisé sur cas de table, pas sur données bruitées)."""
    t = {}
    # transposition cochés : s = 1 + 3k/6
    corr0 = {i: 0 for i in ENTREES}
    corr0[ITEM_VIGILANCE] = 1
    corr2 = dict(corr0); corr2.update({COCHES_A[0]: 1, COCHES_A[1]: 1})
    corr6 = dict(corr0); corr6.update({i: 1 for i in COCHES_A})
    t["transposition_A_0_coches"] = score_A_de(corr0) == 1.0
    t["transposition_A_2_coches"] = score_A_de(corr2) == 2.0
    t["transposition_A_6_coches"] = score_A_de(corr6) == 4.0
    # N4 inversé : corrigé = 3 − raw
    cn = dict(corr0); cn.update({"PERS-Q2-N1": 1, "PERS-Q2-N2": 1,
                                 "PERS-Q2-N3": 1, INVERSE_N4: 0})
    t["n4_inverse_0"] = score_N_de(cn) == 1.75
    cn[INVERSE_N4] = 3
    t["n4_inverse_3"] = score_N_de(cn) == 2.5
    # mur / geste
    cr = dict(corr0); cr.update({FREQ_R[0]: 3, FREQ_R[1]: 3,
                                 FREQ_R[2]: 3, FREQ_R[3]: 3})
    t["mur_3_moyenne"] = score_R_mur_de(cr) == 4.0
    t["geste_0"] = score_R_geste_de(cr) == 1.0
    # niveaux ponctuels (6 bornes exactes)
    t["niveau_1_79_discrete"] = niveau_ponctuel(1.79) == "DISCRÈTE"
    t["niveau_1_80_tranquille"] = niveau_ponctuel(1.80) == "TRANQUILLE"
    t["niveau_2_59_tranquille"] = niveau_ponctuel(2.59) == "TRANQUILLE"
    t["niveau_2_60_vive"] = niveau_ponctuel(2.60) == "VIVE"
    t["niveau_3_19_vive"] = niveau_ponctuel(3.19) == "VIVE"
    t["niveau_3_20_forte"] = niveau_ponctuel(3.20) == "FORTE"
    # lecture L3 : frontières + conservateur
    l1 = lecture_L3(2.40, 1.99, 2.81)
    t["l3_frontiere_t_v"] = (l1["type"] == "FRONTIÈRE"
                             and l1["conservateur"] == "TRANQUILLE")
    l2 = lecture_L3(1.30, 0.89, 1.71)
    t["l3_niveau_discrete"] = (l2["type"] == "NIVEAU"
                               and l2["lecture"] == "DISCRÈTE")
    l3 = lecture_L3(3.00, 2.59, 3.41)
    t["l3_frontiere_t_v_f"] = (l3["type"] == "FRONTIÈRE"
                               and l3["conservateur"] == "TRANQUILLE")
    l4 = lecture_L3(3.70, 3.29, 4.11)
    t["l3_niveau_forte"] = (l4["type"] == "NIVEAU"
                            and l4["lecture"] == "FORTE")
    # nuage / hiérarchie : A (cochés, seuil 0,3379 — granularité 1,0)
    t["l4_nuage_tie_A"] = lecture_L4(corr0, "A")["lecture"] == "NUAGE"
    cA = dict(corr0); cA.update({COCHES_A[0]: 1})
    t["l4_hierarchie_1_pas_A"] = (lecture_L4(cA, "A")["lecture"]
                                  == "HIÉRARCHIE DÉCLARABLE"
                                  and lecture_L4(cA, "A")["dominante"] == "A_ext")
    # nuage R (fréq., seuil 0,3583) : mur = geste = 2,0 → NUAGE
    cR = dict(corr0)
    cR.update({FREQ_R[k]: 1 for k in range(6)})  # mur 2,0 = geste 2,0 → NUAGE
    t["l4_nuage_R_tie"] = lecture_L4(cR, "R")["lecture"] == "NUAGE"
    cR2 = dict(corr0); cR2.update({FREQ_R[0]: 3, FREQ_R[1]: 3,
                                   FREQ_R[2]: 3, FREQ_R[3]: 3})
    t["l4_hierarchie_R_mur"] = (lecture_L4(cR2, "R")["lecture"]
                                == "HIÉRARCHIE DÉCLARABLE"
                                and lecture_L4(cR2, "R")["dominante"] == "R_mur")
    # filet : 3 voies
    her_sain = {"rqs": 95.0, "signal": False,
                "niveaux": {"AO": "TRANQUILLE", "N": "TRANQUILLE",
                            "R": "TRANQUILLE", "J": "TRANQUILLE"}}
    t["pas_de_filet_sain"] = signal_filet_de({}, corr0, her_sain)["filet"] is False
    f1 = signal_filet_de({}, corr0, {**her_sain, "signal": True})
    t["filet_voie_heritee"] = (f1["filet"] and f1["voie"] == "héritée"
                               and f1["filet_num"].startswith("3919"))
    her_vive = {"rqs": 95.0, "signal": False,
                "niveaux": {"AO": "TRANQUILLE", "N": "TRANQUILLE",
                            "R": "TRANQUILLE", "J": "VIVE"}}
    cj = dict(corr0); cj.update({i: 1 for i in COCHES_J})
    f2 = signal_filet_de({}, cj, her_vive)
    t["filet_voie_detectee"] = (f2["filet"] and f2["voie"] == "détectée")
    cj5 = dict(corr0); cj5.update({COCHES_J[k]: 1 for k in range(5)})
    t["pas_de_filet_5_coches"] = signal_filet_de({}, cj5, her_vive)["filet"] is False
    f3 = signal_filet_de({ITEM_SECURITE_N5: 2}, corr0, her_sain)
    t["filet_n5_2"] = (f3["filet"] and f3["voie"] == "N5")
    f3b = signal_filet_de({ITEM_SECURITE_N5: 1}, corr0, her_sain)
    t["pas_de_filet_n5_1"] = f3b["filet"] is False
    # convergence : index exacts
    her_2cv = {"rqs": 95.0, "signal": False,
               "niveaux": {"AO": "VIVE", "N": "VIVE", "R": "TRANQUILLE",
                           "J": "TRANQUILLE"}}
    cv1 = convergence_de(her_2cv, corr0, scores_mecanismes(corr0))
    t["cv_index_0_supprimee"] = (cv1["etat"] == "SUPPRIMÉE"
                                 and cv1["index"] == 0.0
                                 and cv1["applicables"] == 2)
    cA2 = dict(corr0); cA2.update({COCHES_A[0]: 1, COCHES_A[1]: 1})
    cv2 = convergence_de(her_2cv, cA2, scores_mecanismes(cA2))
    t["cv_index_0_5_prudente"] = (cv2["etat"] == "PRUDENTE"
                                  and cv2["index"] == 0.5)
    cA4 = dict(corr2)
    cA4.update({COCHES_A[2]: 1, COCHES_A[3]: 1,
                "PERS-Q2-N1": 3, "PERS-Q2-N2": 3, "PERS-Q2-N3": 3,
                INVERSE_N4: 0})            # ΣA = 4 ET sN = 3,25 → 2/2
    cv3 = convergence_de(her_2cv, cA4, scores_mecanismes(cA4))
    t["cv_index_1_ok"] = (cv3["etat"] == "OK" and cv3["index"] == 1.0)
    cvna = convergence_de(her_sain, corr0, scores_mecanismes(corr0))
    t["cv_na_sans_applicable"] = (cvna["etat"] == "N/A"
                                  and cvna["index"] is None)
    her_4cv = {"rqs": 95.0, "signal": False,
               "niveaux": {"AO": "VIVE", "N": "VIVE", "R": "FORTE",
                           "J": "VIVE"}}
    cA2 = dict(corr0); cA2.update({COCHES_A[0]: 1, COCHES_A[1]: 1})
    cvq = convergence_de(her_4cv, cA2, scores_mecanismes(cA2))
    t["cv_index_0_25_prudente"] = (cvq["etat"] == "PRUDENTE"
                                   and cvq["index"] == 0.25)
    # nommage : priorité
    t["nommage_supprimee"] = nommage_de({}, cv1)["label"] == "OMBRE_SUPPRIMÉE"
    cons_calme = {"A": "TRANQUILLE", "N": "DISCRÈTE", "R": "DISCRÈTE",
                  "J": "DISCRÈTE"}
    t["nommage_zone_calme"] = nommage_de(
        cons_calme, {"etat": "N/A"})["label"] == "ZONE_CALME"
    cons_double = {"A": "VIVE", "N": "VIVE", "R": "DISCRÈTE", "J": "DISCRÈTE"}
    t["nommage_double_pente"] = nommage_de(
        cons_double, {"etat": "OK"})["label"] == "DOUBLE_PENTE"
    t["nommage_mur"] = nommage_de(
        {"A": "DISCRÈTE", "N": "DISCRÈTE", "R": "FORTE", "J": "DISCRÈTE"},
        {"etat": "OK"})["label"] == "MUR_DE_DÉFENSE"
    t["nommage_orage"] = nommage_de(
        {"A": "DISCRÈTE", "N": "VIVE", "R": "DISCRÈTE", "J": "DISCRÈTE"},
        {"etat": "OK"})["label"] == "ORAGE_LENT"
    t["nommage_lentille"] = nommage_de(
        {"A": "DISCRÈTE", "N": "DISCRÈTE", "R": "DISCRÈTE", "J": "VIVE"},
        {"etat": "OK"})["label"] == "LENTILLE"
    t["nommage_penchant"] = nommage_de(
        {"A": "VIVE", "N": "DISCRÈTE", "R": "DISCRÈTE", "J": "DISCRÈTE"},
        {"etat": "OK"})["label"] == "PENCHANT_PROPRE"
    t["nommage_prudente_passe_avant"] = nommage_de(
        cons_double, {"etat": "PRUDENTE"})["label"] == "OMBRE_PRUDENTE"
    # palier (max mécanique pure sur 4 mécanismes)
    t["palier_vert"] = palier_de("TRANQUILLE", "DISCRÈTE", "TRANQUILLE",
                                 "DISCRÈTE", False)["palier"] == PALIER_VERT
    t["palier_orange"] = palier_de("VIVE", "DISCRÈTE", "TRANQUILLE",
                                   "DISCRÈTE", False)["palier"] == PALIER_ORANGE
    t["palier_rouge"] = palier_de("FORTE", "DISCRÈTE", "TRANQUILLE",
                                  "DISCRÈTE", False)["palier"] == PALIER_ROUGE
    t["palier_max_4e"] = palier_de("DISCRÈTE", "DISCRÈTE", "DISCRÈTE",
                                   "VIVE", False)["palier"] == PALIER_ORANGE
    pf = palier_de("FORTE", "FORTE", "FORTE", "FORTE", True)
    t["palier_filet_court_circuit"] = (pf["palier"] == PALIER_ROUGE
                                       and pf["ombre_affichee"] is False)
    # RCI : bornes exactes + traversée + signe
    t["rci_0_58_fiable"] = (rci_de(2.400, 2.980)["verdict"] == "FIABLE"
                            and rci_de(2.400, 2.981)["verdict"] == "FIABLE")
    t["rci_0_5799_suggestion"] = rci_de(2.400, 2.979)["verdict"] == "SUGGESTION"
    t["rci_0_41_suggestion"] = rci_de(2.400, 2.810)["verdict"] == "SUGGESTION"
    t["rci_0_4099_bruit"] = rci_de(2.400, 2.809)["verdict"] == "BRUIT"
    t["rci_traversee_vraie"] = rci_de(2.400, 3.300)["traversee"] is True
    t["rci_traversee_fausse"] = rci_de(2.400, 2.500)["traversee"] is False
    t["anti_inversion_delta"] = (rci_de(2.400, 3.300)["delta"] == 0.9
                                 and rci_de(3.300, 2.400)["delta"] == -0.9)
    # RQS adapté : pièges
    temps_ok = {i: 4.0 for i in ENTREES + [ITEM_VIGILANCE]}
    base_ok = dict(corr0)
    base_ok.update({FREQ_N[0]: 1, FREQ_N[1]: 2, FREQ_N[2]: 3, INVERSE_N4: 3,
                    FREQ_R[0]: 1, FREQ_R[1]: 2, FREQ_R[2]: 3, FREQ_R[3]: 2,
                    FREQ_R[4]: 1, FREQ_R[5]: 2})
    t["rqs_sain_100"] = calcule_rqs(base_ok, temps_ok, 120.0)["rqs"] == 100
    raws_lin = {i: 2 for i in ITEMS_FREQ}
    raws_lin.update({i: 0 for i in ITEMS_COCHES})
    raws_lin[ITEM_VIGILANCE] = 1
    t["rqs_linearite_prudence"] = calcule_rqs(raws_lin, temps_ok, 120.0)["rqs"] == 80
    raws_coh = dict(base_ok)
    raws_coh.update({FREQ_N[0]: 3, FREQ_N[1]: 3, FREQ_N[2]: 3, INVERSE_N4: 3})
    t["rqs_coherence_n_penalite"] = (calcule_rqs(raws_coh, temps_ok, 120.0)["rqs"]
                                     == 80
                                     and calcule_rqs(raws_coh, temps_ok, 120.0)
                                     ["coherence_n"] is True)
    t["rqs_rythme_penalite"] = calcule_rqs(base_ok, {i: 1.0 for i in ENTREES},
                                           120.0)["rythme"] is True
    t["rqs_session_courte"] = calcule_rqs(base_ok, temps_ok, 30.0)["rythme"] is True
    raws_vig = dict(base_ok); raws_vig[ITEM_VIGILANCE] = 3
    t["rqs_vigilance_penalite"] = calcule_rqs(raws_vig, temps_ok, 120.0)["rqs"] == 80
    t["rqs_invalide"] = calcule_rqs(raws_lin, {i: 1.0 for i in ENTREES},
                                    30.0)["statut"] == "INVALIDE"
    # C6 : verbatims dans les templates
    t["c6_verbatim_reparation"] = VERBATIM_REPARATION in TEMPLATES["reparation"]
    t["c6_verbatim_calme"] = VERBATIM_CALME in TEMPLATES["zone_calme"]
    joined = " ".join(v for v in TEMPLATES.values())
    t["c6_zero_mot_interdit"] = not any(m in joined for m in MOTS_INTERDITS_C6)
    return t


def verifier_d_confirmation(couples_classes, classifier):
    """D-CONFIRMATION : déterminisme pur (re-classification identique) +
    anti-inversion temporelle (Δ = re − base)."""
    again = [classifier(c) for c in couples_classes[0]]
    pure = True
    for (m1, c), m2 in zip(couples_classes, again):
        for rive in ("rive_a", "rive_b"):
            if m1[rive].get("etat") != m2[rive].get("etat") \
                    or m1[rive].get("label") != m2[rive].get("label") \
                    or m1[rive].get("palier") != m2[rive].get("palier"):
                pure = False
            if m1[rive].get("rci") != m2[rive].get("rci"):
                pure = False
    anti_inv = (rci_de(2.400, 3.300)["delta"] == 0.9
                and rci_de(3.300, 2.400)["delta"] == -0.9)
    return {"deterministe": pure, "anti_inversion_temporelle": anti_inv}
