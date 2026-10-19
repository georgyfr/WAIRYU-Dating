# -*- coding: utf-8 -*-
"""WAIRYU — WTC-PERS-Q1 : moteur Quête 1 Personnalité
« Manuel d'utilisation de moi » — RIO-19 cible.

SPEC VERROUILLÉE (f4fa593) — tranchages A1-A6 par délégation fondateur
20/10/2026 (« je te laisse le choix de trancher ») :
A1 titre canonique (ligne 98) · A2 4 axes mapping 1:1 (asymétrie
acteur-observateur, névrosisme, narcissisme/absence de réparation, jalousie
graduée) · A3 24 items (4 axes × 2 faces × 3 items), échelle 1-4, 2 inversés,
1 vigilance · A4 L1-L4 + L7 embarquée (L5-L6 réservées à Q3) · A5 C6 triple
verrou 0 diagnostic / 0 étiquette / 0 mot canon clinique · A6 5 quêtes
RIO-19→23.

Couches canon (programme wairyu couple.txt) :
L1 RQS (ligne 257) · L2 scores+intervalles (ligne 258, placeholders SD 0,65 /
α 0,85) · L3 4 niveaux + FRONTIÈRE conservatrice (ligne 259) · L4 faces
dominantes / nuage (ligne 260) · L7 RCI Jacobson & Truax (ligne 263) ·
re-test 8 semaines (ligne 274). Filet 9 signaux → P-FILTRE (ligne 369) +
voie détectée (fixée au verrouillage) : lecture conservatrice FORTE de la
face « Le contrôle » (J2) → court-circuit AVANT l'arbre (SPEC §4 — signal
sécurité contrôle, canon ligne 103 / verrou SM). Vocabulaire écran
(lignes 355-356) : les mots canon « névrosisme », « narcissisme »,
« jalousie » ne sont JAMAIS affichés (C6)."""
import math

SIGMA_ITEM = 0.60  # D-PARAM (hub)

# ── Instrument (A2/A3 : mapping 1:1 des 4 construits nommés ligne 98) ────────
FACES = {
    "PERS-AO1": {"axe": "AO", "affiche": "Ma part, sa part",
                 "items": ["PERS-AO1-1", "PERS-AO1-2", "PERS-AO1-3"]},
    "PERS-AO2": {"axe": "AO", "affiche": "Le caractère ou la situation",
                 "items": ["PERS-AO2-1", "PERS-AO2-2", "PERS-AO2-3"]},
    "PERS-N1": {"axe": "N", "affiche": "L'intensité",
                "items": ["PERS-N1-1", "PERS-N1-2", "PERS-N1-3"]},
    "PERS-N2": {"axe": "N", "affiche": "Le retour au calme",
                "items": ["PERS-N2-1", "PERS-N2-2", "PERS-N2-3"]},
    "PERS-R1": {"axe": "R", "affiche": "Après le conflit",
                "items": ["PERS-R1-1", "PERS-R1-2", "PERS-R1-3"]},
    "PERS-R2": {"axe": "R", "affiche": "Ma part reconnue",
                "items": ["PERS-R2-1", "PERS-R2-2", "PERS-R2-3"]},
    "PERS-J1": {"axe": "J", "affiche": "L'inquiétude",
                "items": ["PERS-J1-1", "PERS-J1-2", "PERS-J1-3"]},
    "PERS-J2": {"axe": "J", "affiche": "Le contrôle",
                "items": ["PERS-J2-1", "PERS-J2-2", "PERS-J2-3"]},
}
AXES = {"AO": "La balance", "N": "La météo", "R": "La réparation",
        "J": "La gradation"}
ITEMS = [i for f in FACES.values() for i in f["items"]]
N_ITEMS = len(ITEMS)  # 24
INVERSES = {"PERS-N2-3": ("PERS-N2-1", "PERS-N2-2"),
            "PERS-J2-3": ("PERS-J2-1", "PERS-J2-2")}
ITEM_VIGILANCE = "PERS-VIG"
ECHELLE_4PTS = {1: "PAS DU TOUT MOI", 2: "UN PEU MOI", 3: "BEAUCOUP MOI",
                4: "TOUT À FAIT MOI"}

# ── L2 — placeholders canon ligne 258 (à remplacer par le pilote) ────────────
SD_POP = 0.65
ALPHA = 0.85
SEM = round(SD_POP * math.sqrt(1.0 - ALPHA), 4)          # 0.2517
Z90 = 1.64
CI90_DEMI = round(Z90 * SEM, 4)                          # 0.4128
SE_FACE = round(0.72 * math.sqrt(1.0 - 0.72), 4)         # 0.3853 (patron Q1-R1)
SEUIL_HIERARCHIE = round(Z90 * math.sqrt(2.0 * SE_FACE ** 2), 4)  # 0.8937

# ── L3 — 4 niveaux (ligne 259 verbatim) ──────────────────────────────────────
NIVEAUX = ["DISCRÈTE", "TRANQUILLE", "VIVE", "FORTE"]
SEUILS_NIVEAUX = (1.80, 2.60, 3.20)

# ── Paliers §5.4 (lignes 227-231) — libellés verrouillés D-NOMENCLATURE ──────
PALIER_VERT = "EXERCICE MAISON"
PALIER_ORANGE = "MODULE DE COUPLE"
PALIER_ROUGE = "ORIENTATION"

# ── L7 RCI (ligne 263 verbatim) ──────────────────────────────────────────────
SE_DIFF = round(math.sqrt(2.0) * SEM, 4)                 # ≈ 0.356
SEUIL_FIABLE = 0.58
SEUIL_SUGGESTION = 0.41

# ── Avertissement styles dissemblables (L6, note de lecture — A4) ────────────
SEUIL_STYLES = 1.00

# ── L1 RQS (ligne 257 verbatim) ──────────────────────────────────────────────
SEUIL_LINEARITE = 0.45
PENALITE_LINEARITE = 20
SEUIL_CONTRADICTION = 2.5
PENALITE_CONTRADICTION = 20
SEUIL_ITEM_RAPIDE_S = 2.0
SEUIL_SESSION_S = 60.0
PENALITE_RYTHME = 25
PENALITE_VIGILANCE = 20
SEUIL_RQS_OK = 85
SEUIL_RQS_PRUDENCE = 70
STATUTS_RQS = ("OK", "PRUDENCE", "INVALIDE")

# ── D-STD-2 : transitions conservatrices dérivées (seuil + CI90_DEMI) ────────
TRANS_T_HAUT = round(SEUILS_NIVEAUX[1] + CI90_DEMI, 4)   # 3.0128
TRANS_V_HAUT = round(SEUILS_NIVEAUX[2] + CI90_DEMI, 4)   # 3.6128
SIGMA_EFF_AXE = round(SIGMA_ITEM / math.sqrt(6.0), 4)    # 0.2449 (6 items/axe)
SIGMA_DIFF_STYLES = round(SIGMA_ITEM * math.sqrt(2.0 / 24.0), 4)  # 0.1732
SIGMA_RCI = round(SIGMA_ITEM * math.sqrt(2.0 / 24.0), 4)          # 0.1732

# ── Sécurité contrôle (voie détectée, fixée au verrouillage) ─────────────────
# filet ⟺ borne basse de l'intervalle 90 % de la face « Le contrôle » ≥ 3,20
# (règle L3 réutilisée, zéro constante nouvelle) — SPEC §4.
SECU_BAS = SEUILS_NIVEAUX[2]                             # 3.20

NOMENCLATURE = (NIVEAUX + [PALIER_VERT, PALIER_ORANGE, PALIER_ROUGE,
                           "NUAGE", "HIÉRARCHIE DÉCLARABLE", "NIVEAU",
                           "FRONTIÈRE"] + list(STATUTS_RQS)
                + ["FIABLE", "SUGGESTION", "BRUIT", "P-FILTRE"])

# ── Géométrie des 14 groupes (face μ par rive — source unique simulateur +
#    calibration D-STD-2). Rives identiques sauf G13. 40 couples × 14 = 560. ──
GEOMETRIE = {
    "G01_QUATRE_AXES_VIFS":        {"AO1": 3.1, "AO2": 3.2, "N1": 3.2, "N2": 3.2, "R1": 3.1, "R2": 3.1, "J1": 3.1, "J2": 3.2, "n": 40},
    "G02_ASYMETRIE_MARQUEE":       {"AO1": 4.0, "AO2": 4.0, "N1": 2.2, "N2": 2.2, "R1": 2.3, "R2": 2.3, "J1": 1.9, "J2": 1.9, "n": 40},
    "G03_REPARATION_ABSENTE":      {"AO1": 2.2, "AO2": 2.2, "N1": 2.4, "N2": 2.4, "R1": 4.0, "R2": 3.8, "J1": 2.2, "J2": 2.2, "n": 40},
    "G04_ZONE_CALME_PERSONNALITE": {"AO1": 2.2, "AO2": 2.2, "N1": 2.3, "N2": 2.3, "R1": 2.2, "R2": 2.2, "J1": 2.4, "J2": 2.4, "n": 40},
    "G05_JALOUSIE_CONTROLEE":      {"AO1": 2.1, "AO2": 2.1, "N1": 2.2, "N2": 2.2, "R1": 2.2, "R2": 2.2, "J1": 3.7, "J2": 2.9, "n": 40},
    "G06_SIGNAL_CONTROLE":         {"AO1": 2.4, "AO2": 2.4, "N1": 2.4, "N2": 2.4, "R1": 2.4, "R2": 2.4, "J1": 2.4, "J2": 2.4, "n": 40, "filet": True},
    "G07_FRONTIERE_AO":            {"AO1": 2.7, "AO2": 2.4, "N1": 2.1, "N2": 2.1, "R1": 2.0, "R2": 2.0, "J1": 2.0, "J2": 2.0, "n": 40},
    "G08_FRONTIERE_N":             {"AO1": 2.0, "AO2": 2.0, "N1": 2.7, "N2": 2.5, "R1": 2.1, "R2": 2.1, "J1": 2.0, "J2": 2.0, "n": 40},
    "G09_FRONTIERE_R":             {"AO1": 2.0, "AO2": 2.0, "N1": 2.1, "N2": 2.1, "R1": 2.8, "R2": 2.5, "J1": 2.1, "J2": 2.1, "n": 40},
    "G10_FRONTIERE_J":             {"AO1": 2.0, "AO2": 2.0, "N1": 2.2, "N2": 2.2, "R1": 2.0, "R2": 2.0, "J1": 2.8, "J2": 2.6, "n": 40},
    "G11_NUAGE":                   {"AO1": 2.3, "AO2": 1.7, "N1": 2.1, "N2": 2.1, "R1": 2.0, "R2": 2.0, "J1": 2.0, "J2": 2.0, "n": 40},
    "G12_PIEGES_RQS":              {"AO1": 2.4, "AO2": 2.4, "N1": 2.4, "N2": 2.4, "R1": 2.4, "R2": 2.4, "J1": 2.4, "J2": 2.4, "n": 40, "piege": True},
    "G13_RIVES_DISSEMBLABLES":     {"AO1": 2.0, "AO2": 2.0, "N1": 2.0, "N2": 2.0, "R1": 2.0, "R2": 2.0, "J1": 2.0, "J2": 2.0, "n": 40,
                                    "riveB": {"AO1": 3.9, "AO2": 3.9, "N1": 3.9, "N2": 3.9, "R1": 3.9, "R2": 3.9, "J1": 3.9, "J2": 2.5}},
    "G14_RE_TEST":                 {"AO1": 2.4, "AO2": 2.4, "N1": 2.4, "N2": 2.4, "R1": 2.4, "R2": 2.4, "J1": 2.4, "J2": 2.4, "n": 40, "re_test": True},
}
# Δ vrais du re-test (G14) : 15 FIABLE 0,70 · 10 SUGGESTION 0,50 · 15 BRUIT 0,15
DELTAS_VRAIS_G14 = [0.70] * 15 + [0.50] * 10 + [0.15] * 15


# ═════════════════════════════ L1 — RQS ═══════════════════════════════════════
def corrige(item, raw):
    """Score corrigé : items inversés retournés (5 − raw)."""
    return round(5.0 - float(raw), 2) if item in INVERSES else round(float(raw), 2)


def scores_corriges(raws):
    return {i: corrige(i, raws[i]) for i in ITEMS}


def calcule_rqs(raws, temps_items, temps_session):
    """L1 verbatim : anti-linéarité (SD < 0,45 → −20) · anti-contradiction
    (|corrigé(inversé) − moyenne des 2 autres de sa face| ≥ 2,5 → −20) ·
    rythme (< 2 s sur ≥ 5 items ou session < 60 s → −25) · vigilance (raw > 1
    sur PERS-VIG → −20). Seuils : ≥ 85 OK · 70-84 PRUDENCE · < 70 INVALIDE."""
    corr = scores_corriges(raws)
    penalites, causes = [], []
    vals = [corr[i] for i in ITEMS]
    m = sum(vals) / len(vals)
    sd = (sum((v - m) ** 2 for v in vals) / len(vals)) ** 0.5
    lin = sd < SEUIL_LINEARITE
    if lin:
        penalites.append(PENALITE_LINEARITE)
        causes.append(f"linéarité : SD {sd:.2f} < {SEUIL_LINEARITE} → −{PENALITE_LINEARITE}")
    contra = False
    for inv, freres in INVERSES.items():
        moi = corr[inv]
        autres = [corr[f] for f in freres]
        ecart = abs(moi - sum(autres) / len(autres))
        if ecart >= SEUIL_CONTRADICTION:
            contra = True
            penalites.append(PENALITE_CONTRADICTION)
            causes.append(f"contradiction : {inv} vs {freres} écart {ecart:.2f} ≥ {SEUIL_CONTRADICTION} → −{PENALITE_CONTRADICTION}")
    rapides = sum(1 for t in temps_items.values() if t < SEUIL_ITEM_RAPIDE_S)
    session_courte = temps_session < SEUIL_SESSION_S
    rythme = rapides >= 5 or session_courte
    if rythme:
        penalites.append(PENALITE_RYTHME)
        causes.append(f"rythme : {rapides} items < {SEUIL_ITEM_RAPIDE_S} s, session {temps_session:.1f} s → −{PENALITE_RYTHME}")
    vigil = float(raws.get(ITEM_VIGILANCE, 1)) > 1
    if vigil:
        penalites.append(PENALITE_VIGILANCE)
        causes.append(f"vigilance : {ITEM_VIGILANCE} non conforme → −{PENALITE_VIGILANCE}")
    rqs = max(0, 100 - sum(penalites))
    statut = "OK" if rqs >= SEUIL_RQS_OK else ("PRUDENCE" if rqs >= SEUIL_RQS_PRUDENCE else "INVALIDE")
    return {"rqs": rqs, "statut": statut, "sd_items": round(sd, 4),
            "linearite": lin, "contradiction": contra, "rythme": rythme,
            "vigilance": vigil, "penalites": penalites, "causes": causes}


# ═══════════════════════ L2 — scores, intervalles ═════════════════════════════
def score_face_de(corr, face):
    vals = [corr[i] for i in FACES[face]["items"]]
    return round(sum(vals) / len(vals), 2)


def score_axe_de(corr, axe):
    faces = [f for f in FACES if FACES[f]["axe"] == axe]
    vals = [corr[i] for f in faces for i in FACES[f]["items"]]
    return round(sum(vals) / len(vals), 4)


def agregat_de(corr):
    return round(sum(corr[i] for i in ITEMS) / len(ITEMS), 3)


def bornes_ci90(score):
    return round(score - CI90_DEMI, 2), round(score + CI90_DEMI, 2)


# ═══════════════════════ L3 — niveaux + FRONTIÈRE ═════════════════════════════
def niveau_ponctuel(score):
    if score < SEUILS_NIVEAUX[0]:
        return NIVEAUX[0]
    if score < SEUILS_NIVEAUX[1]:
        return NIVEAUX[1]
    if score < SEUILS_NIVEAUX[2]:
        return NIVEAUX[2]
    return NIVEAUX[3]


def niveaux_touches(bas, haut):
    touches = []
    if bas < SEUILS_NIVEAUX[0]:
        touches.append(NIVEAUX[0])
    if haut >= SEUILS_NIVEAUX[0] and bas < SEUILS_NIVEAUX[1]:
        touches.append(NIVEAUX[1])
    if haut >= SEUILS_NIVEAUX[1] and bas < SEUILS_NIVEAUX[2]:
        touches.append(NIVEAUX[2])
    if haut >= SEUILS_NIVEAUX[2]:
        touches.append(NIVEAUX[3])
    return touches


def lecture_L3(score, bas, haut):
    """NIVEAU si l'intervalle ne chevauche aucun seuil ; sinon FRONTIÈRE nommée
    « entre X et Y » + décision conservatrice (niveau le plus bas touché)."""
    touches = niveaux_touches(bas, haut)
    if not touches:
        raise ValueError(f"Intervalle invalide : [{bas} ; {haut}]")
    if len(touches) == 1:
        return {"type": "NIVEAU", "lecture": touches[0],
                "touches": touches, "conservateur": touches[0]}
    return {"type": "FRONTIÈRE", "lecture": f"entre {touches[0]} et {touches[-1]}",
            "touches": touches, "conservateur": touches[0]}


# ═══════════════════════ L4 — faces dominantes / nuage ════════════════════════
def lecture_L4(corr, axe):
    f1, f2 = sorted([f for f in FACES if FACES[f]["axe"] == axe])
    ecart = round(abs(score_face_de(corr, f1) - score_face_de(corr, f2)), 2)
    declarable = ecart >= SEUIL_HIERARCHIE
    dom = f1 if score_face_de(corr, f1) >= score_face_de(corr, f2) else f2
    return {"faces": [f1, f2], "ecart": ecart, "seuil": SEUIL_HIERARCHIE,
            "dominante": dom if declarable else None,
            "lecture": "HIÉRARCHIE DÉCLARABLE" if declarable else "NUAGE"}


# ═══════════ Filet + palier (court-circuit AVANT l'arbre) ═════════════════════
def signal_filet_de(profil, corr):
    """Filet 9 signaux → P-FILTRE (ligne 369). Deux voies (SPEC §4, fixées au
    verrouillage) : (1) voie héritée — signal sécurité déclaré (flag) ;
    (2) voie détectée — lecture conservatrice de la face « Le contrôle »
    (PERS-J2) = FORTE, c'est-à-dire borne basse ≥ 3,20 (règle L3 réutilisée)."""
    if profil.get("signal_herite", False):
        return {"filet": True, "voie": "signal hérité (déclaration / dimension antérieure)",
                "filet_num": "3919 / 3114 — P-FILTRE"}
    j2 = score_face_de(corr, "PERS-J2")
    bas_j2 = round(j2 - CI90_DEMI, 2)
    if bas_j2 >= SECU_BAS:
        return {"filet": True,
                "voie": f"contrôle détecté (Le contrôle {j2} — borne basse {bas_j2} ≥ {SECU_BAS})",
                "filet_num": "3919 / 3114 — P-FILTRE"}
    return {"filet": False, "voie": None, "filet_num": None}


def palier_de(niv_ao, niv_n, niv_r, niv_j, filet):
    """Max des niveaux conservateurs des 4 axes (SPEC §3 — leçon Q5-A3
    mécanique pure) ; signal sécurité → 🔴 court-circuit AVANT l'arbre
    (carte non affichée)."""
    if filet:
        return {"palier": PALIER_ROUGE, "carte_affichee": False,
                "cause": "P-FILTRE — court-circuit avant l'arbre"}
    plus_haut = max(niv_ao, niv_n, niv_r, niv_j, key=NIVEAUX.index)
    if plus_haut == NIVEAUX[3]:
        p = PALIER_ROUGE
    elif plus_haut == NIVEAUX[2]:
        p = PALIER_ORANGE
    else:
        p = PALIER_VERT
    return {"palier": p, "carte_affichee": True,
            "cause": f"max des niveaux conservateurs = {plus_haut}"}


# ═══════════ Avertissement styles (L6 — note, sans verdict, A4) ═══════════════
def avertissement_de(corr_a, corr_b):
    ma = sum(corr_a[i] for i in ITEMS) / len(ITEMS)
    mb = sum(corr_b[i] for i in ITEMS) / len(ITEMS)
    return round(abs(ma - mb), 2) >= SEUIL_STYLES


# ═══════════════════════════ L7 — RCI (Jacobson & Truax) ══════════════════════
def rci_de(base, re_test):
    """Δ = re-test − base (asymétrie temporelle, jamais l'inverse) ;
    |Δ| ≥ 0,58 FIABLE · [0,41 ; 0,58[ SUGGESTION · < 0,41 BRUIT (L7 verbatim) ;
    signification clinique = traversée d'un seuil L3 par l'agrégat."""
    delta = round(round(re_test, 3) - round(base, 3), 3)
    d = abs(delta)
    verdict = "FIABLE" if d >= SEUIL_FIABLE else ("SUGGESTION" if d >= SEUIL_SUGGESTION else "BRUIT")
    lo, hi = sorted((round(base, 3), round(re_test, 3)))
    traversee = any(lo < s <= hi for s in SEUILS_NIVEAUX)
    return {"delta": delta, "abs_delta": d, "verdict": verdict,
            "traversee": traversee, "se_diff": SE_DIFF,
            "seuil_fiable": SEUIL_FIABLE, "seuil_suggestion": SEUIL_SUGGESTION}


# ═══════════════════════════ Classifier (par rive) ════════════════════════════
def classifier_rive(profil):
    """Carte d'une rive. Ordre : (1) filet — court-circuit AVANT l'arbre
    (voie héritée OU contrôle détecté) ; (2) RQS INVALIDE — aucun résultat ;
    (3) carte complète."""
    raws = {i: profil[i] for i in ITEMS}
    raws[ITEM_VIGILANCE] = profil.get(ITEM_VIGILANCE, 1)
    corr = scores_corriges(raws)
    filet = signal_filet_de(profil, corr)
    rqs = calcule_rqs(raws, profil.get("temps_items", {}),
                      profil.get("temps_session", 999.0))
    if filet["filet"]:
        return {"rqs": rqs, "filet": filet, "carte": None,
                "palier": PALIER_ROUGE, "niveaux": None, "faces": None,
                "aggregate": None, "rci": None,
                "bandeau": "D-CRISE : court-circuit AVANT l'arbre — P-FILTRE, carte non affichée."}
    if rqs["statut"] == "INVALIDE":
        return {"rqs": rqs, "filet": filet, "carte": None, "palier": None,
                "niveaux": None, "faces": None, "aggregate": None, "rci": None,
                "bandeau": "RQS < 70 — réponses de qualité insuffisante, aucun résultat affiché."}
    niveaux, faces = {}, {}
    for axe in AXES:
        s = score_axe_de(corr, axe)
        bas, haut = bornes_ci90(s)
        niveaux[axe] = {"score": s, "ci90": [bas, haut], **lecture_L3(s, bas, haut)}
        faces[axe] = lecture_L4(corr, axe)
    p = palier_de(niveaux["AO"]["conservateur"], niveaux["N"]["conservateur"],
                  niveaux["R"]["conservateur"], niveaux["J"]["conservateur"], False)
    agg = agregat_de(corr)
    rci = None
    if profil.get("re_test_items") is not None:
        corr_re = scores_corriges(profil["re_test_items"])
        rci = rci_de(agg, agregat_de(corr_re))
    return {"rqs": rqs, "filet": filet, "carte": True, "palier": p["palier"],
            "palier_cause": p["cause"], "niveaux": niveaux, "faces": faces,
            "aggregate": agg, "rci": rci, "bandeau": None}


def classifier_couple(couple):
    a = classifier_rive(couple["rive_a"])
    b = classifier_rive(couple["rive_b"])
    av = None
    if a["carte"] and b["carte"]:
        av = avertissement_de(scores_corriges({i: couple["rive_a"][i] for i in ITEMS}),
                              scores_corriges({i: couple["rive_b"][i] for i in ITEMS}))
    return {"rive_a": a, "rive_b": b, "avertissement_styles": av}


# ═══════════════════ Templates d'affichage (autoporteurs, C5/C6) ══════════════
TEMPLATES = {
    "zone_ombre": "Ce que l'on voit dans tes réponses : {ombre} — descriptif causal, sans étiquette.",
    "zone_force": "Ta zone de force, tirée de tes vraies réponses : {force}.",
    "nuage": "Vos deux facettes de {axe} sont au même niveau — nuage : la mesure ne départage pas (anti-surinterprétation).",
    "hierarchie": "Sur {axe}, {dominante} ressort de façon déclarable.",
    "frontiere": "Ta lecture de {axe} est une FRONTIÈRE ({lecture}) — décision conservatrice : {conservateur}.",
    "palier_vert": "Palier 🟢 EXERCICE MAISON : une petite pratique à soi — si la zone est calme, rien à fabriquer.",
    "palier_orange": "Palier 🟠 MODULE DE COUPLE : un temps à deux autour du manuel d'utilisation de moi.",
    "palier_rouge": "Palier 🔴 ORIENTATION : le chemin le plus court, pas un échec.",
    "filet": "Le filet de sécurité s'applique avant tout : P-FILTRE — {filet_num}. La carte n'est pas affichée.",
    "filet_controle": "Le contrôle déclaré atteint le seuil de sécurité — ce n'est plus une carte, c'est un signal : P-FILTRE — {filet_num}. Aucune étiquette, aucun verdict.",
    "reparation": "Ta façon de réparer est un terrain de travail, pas un verdict — et si la zone est calme, rien à fabriquer.",
    "avertissement": "Vos deux rives répondent avec des niveaux très différents — l'écart sera lu au croisement à deux (Q4). Aucun verdict ici.",
    "prudence": "Qualité de réponse PRUDENCE ({rqs}/100) — la carte reste lisible, avec prudence.",
    "invalide": "Réponses de qualité insuffisante (RQS {rqs}/100) — aucun résultat affiché.",
    "rci_fiable": "UN CHANGEMENT FIABLE depuis la base (re-test 8 semaines, |Δ| ≥ 0,58).",
    "rci_suggestion": "UNE PISTE À CONFIRMER (|Δ| entre 0,41 et 0,58).",
    "rci_bruit": "DANS LE BRUIT DE LA MESURE (|Δ| < 0,41) — rien à conclure.",
    "traversee": "L'agrégat a traversé un seuil de lecture entre base et re-test (signification clinique).",
    "re_test_programme": "Re-test programmé à 8 semaines (ligne 274).",
}


# ═══════════════ Calibration D-STD-2 (exacte par énumération) ═════════════════
def _phi(x):
    return 0.5 * (1.0 + math.erf(x / math.sqrt(2.0)))


def _face_sum_dist(mu_face):
    """Distribution EXACTE de la somme de 3 items (loi du simulateur :
    item = clip(round(N(mu, 0,60)), 1, 4)) — raffinement documenté du modèle
    normal EXT-Q1 (les faces au plafond 4,0 ne sont pas normales)."""
    p = [0.0] * 4
    p[0] = _phi((1.5 - mu_face) / SIGMA_ITEM)
    p[1] = _phi((2.5 - mu_face) / SIGMA_ITEM) - _phi((1.5 - mu_face) / SIGMA_ITEM)
    p[2] = _phi((3.5 - mu_face) / SIGMA_ITEM) - _phi((2.5 - mu_face) / SIGMA_ITEM)
    p[3] = 1.0 - _phi((3.5 - mu_face) / SIGMA_ITEM)
    dist = {}
    for a in (1, 2, 3, 4):
        for b in (1, 2, 3, 4):
            for c in (1, 2, 3, 4):
                s = a + b + c
                dist[s] = dist.get(s, 0.0) + p[a - 1] * p[b - 1] * p[c - 1]
    return dist


def _axis_sum_dist(mu_f1, mu_f2):
    """Distribution exacte de la somme des 6 items d'un axe (2 faces)."""
    d1, d2 = _face_sum_dist(mu_f1), _face_sum_dist(mu_f2)
    out = {}
    for s1, p1 in d1.items():
        for s2, p2 in d2.items():
            out[s1 + s2] = out.get(s1 + s2, 0.0) + p1 * p2
    return out


def _probs_cons_axe(dist):
    """P(lecture conservatrice de l'axe = niveau) — par somme d'items exacte :
    cons DISCRÈTE ⟺ bas < 1,80 ⟺ somme ≤ 13 · TRANQUILLE ⟺ 14-18 ·
    VIVE ⟺ 19-21 · FORTE ⟺ ≥ 22 (moyenne /6 vs seuils + CI90 — exact)."""
    pd = sum(p for s, p in dist.items() if s <= 13)
    pt = sum(p for s, p in dist.items() if 14 <= s <= 18)
    pv = sum(p for s, p in dist.items() if 19 <= s <= 21)
    pf = sum(p for s, p in dist.items() if s >= 22)
    return {"DISCRÈTE": pd, "TRANQUILLE": pt, "VIVE": pv, "FORTE": pf}


def _p_palier_rive(mu_faces, vrai_palier):
    """P(la carte de la rive affiche le palier vrai) — composition exacte du
    max sur les 4 axes (indépendance des items : loi du produit)."""
    probs = []
    for axe, (f1, f2) in (("AO", ("AO1", "AO2")), ("N", ("N1", "N2")),
                          ("R", ("R1", "R2")), ("J", ("J1", "J2"))):
        dist = _axis_sum_dist(mu_faces[f1], mu_faces[f2])
        probs.append(_probs_cons_axe(dist))
    q = [p["FORTE"] for p in probs]
    v = [p["VIVE"] for p in probs]
    p_pas_forte = math.prod(1.0 - x for x in q)
    p_pas_fv = math.prod(1.0 - x - y for x, y in zip(q, v))
    if vrai_palier == PALIER_ROUGE:
        return 1.0 - p_pas_forte
    if vrai_palier == PALIER_ORANGE:
        return p_pas_forte - p_pas_fv
    return p_pas_fv


def _p_filet_rive(mu_j2, vrai_filet):
    """P(état filet observé == vrai) — voie détectée ⟺ somme J2 ≥ 11
    (moyenne face ≥ 3,6128 ⟺ borne basse ≥ 3,20) ; voie héritée : 1."""
    dist = _face_sum_dist(mu_j2)
    p_det = sum(p for s, p in dist.items() if s >= 11)
    return p_det if vrai_filet else 1.0 - p_det


def _mu_faces(g, rive="A"):
    src = g if rive == "A" else g.get("riveB", g)
    return {f: src[f] for f in ("AO1", "AO2", "N1", "N2", "R1", "R2", "J1", "J2")}


def _palier_vrai_de_mu(mu_faces):
    """Palier vrai d'une rive à partir des μ (règle L3 sur les moyennes)."""
    def cons(mu):
        bas = round(mu - CI90_DEMI, 2)
        haut = round(mu + CI90_DEMI, 2)
        return niveaux_touches(bas, haut)[0]
    niveaux = [cons((mu_faces["AO1"] + mu_faces["AO2"]) / 2),
               cons((mu_faces["N1"] + mu_faces["N2"]) / 2),
               cons((mu_faces["R1"] + mu_faces["R2"]) / 2),
               cons((mu_faces["J1"] + mu_faces["J2"]) / 2)]
    plus_haut = max(niveaux, key=NIVEAUX.index)
    return {NIVEAUX[3]: PALIER_ROUGE, NIVEAUX[2]: PALIER_ORANGE}.get(plus_haut,
                                                                     PALIER_VERT)


def _filet_vrai_de_mu(mu_faces):
    return round(mu_faces["J2"] - CI90_DEMI, 2) >= SECU_BAS


def p_conformite_groupe(g):
    """p̂ théorique de conformité du groupe (surface de décision : paliers,
    filets — hérités OU détectés, avertissement styles, statuts RQS/pièges,
    verdicts RCI)."""
    if g.get("piege"):
        return 0.998
    if g.get("filet"):
        return 1.0  # voie héritée déterministe (35) + voie détectée à items fixés (5)
    mu_a, mu_b = _mu_faces(g, "A"), _mu_faces(g, "B")
    p = _p_palier_rive(mu_a, _palier_vrai_de_mu(mu_a))
    p *= _p_palier_rive(mu_b, _palier_vrai_de_mu(mu_b))
    p *= _p_filet_rive(mu_a["J2"], _filet_vrai_de_mu(mu_a))
    p *= _p_filet_rive(mu_b["J2"], _filet_vrai_de_mu(mu_b))
    if g.get("riveB"):
        ma = sum(mu_a.values()) / 8.0
        mb = sum(mu_b.values()) / 8.0
        p *= _phi((abs(mb - ma) - SEUIL_STYLES) / SIGMA_DIFF_STYLES)
    if g.get("re_test"):
        def p_rci(dv):
            if dv >= SEUIL_FIABLE:
                return 1.0 - _phi((SEUIL_FIABLE - dv) / SIGMA_RCI)
            if dv >= SEUIL_SUGGESTION:
                return (_phi((SEUIL_FIABLE - dv) / SIGMA_RCI)
                        - _phi((SEUIL_SUGGESTION - dv) / SIGMA_RCI))
            return _phi((SEUIL_SUGGESTION - dv) / SIGMA_RCI)
        p *= math.prod(min(1.0, p_rci(dv) ** 2) for dv in DELTAS_VRAIS_G14) ** (1.0 / len(DELTAS_VRAIS_G14))
    return p


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
        mu_a, mu_b = _mu_faces(g, "A"), _mu_faces(g, "B")
        mus = [round((mu_a[f1] + mu_a[f2]) / 2, 4) for f1, f2 in
               (("AO1", "AO2"), ("N1", "N2"), ("R1", "R2"), ("J1", "J2"))]
        mus += [round((mu_b[f1] + mu_b[f2]) / 2, 4) for f1, f2 in
                (("AO1", "AO2"), ("N1", "N2"), ("R1", "R2"), ("J1", "J2"))]
        dists = [min(abs(mu - s) for s in SEUILS_NIVEAUX) / SIGMA_EFF_AXE for mu in mus]
        centres[gname] = {"mu_axes_A": mus[:4], "mu_axes_B": mus[4:],
                          "distance_min_seuil_sigma": round(min(dists), 2),
                          "dans_bande_3sigma": min(dists) < 3.0}
    distinct = len({c["seuil"] for c in calib.values()}) == len(calib)
    return {"seuils": {k: v["seuil"] for k, v in calib.items()},
            "detail": calib, "centres": centres,
            "bornes_distinctes": distinct, "ok": distinct}


SEUILS_D_STD_2 = {k: v["seuil"] for k, v in calibration_d_std_2()["detail"].items()}


# ═══════════════════════════ D-TABLE (C1 — cas exhaustifs) ════════════════════
def verifier_d_table():
    """D-VÉRITÉ : cas de table exhaustifs — les RÈGLES prouvées exactement
    (leçon Q5 : C1 croisé sur cas de table, pas sur données bruitées)."""
    t = {}
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
                             and l1["lecture"] == "entre TRANQUILLE et VIVE"
                             and l1["conservateur"] == "TRANQUILLE")
    l2 = lecture_L3(1.30, 0.89, 1.71)
    t["l3_niveau_discrete"] = (l2["type"] == "NIVEAU" and l2["lecture"] == "DISCRÈTE")
    l3 = lecture_L3(2.60, 2.19, 3.01)
    t["l3_seuil_exact_2_60"] = (l3["type"] == "FRONTIÈRE"
                                and l3["conservateur"] == "TRANQUILLE")
    l4 = lecture_L3(3.70, 3.29, 4.11)
    t["l3_niveau_forte"] = (l4["type"] == "NIVEAU" and l4["lecture"] == "FORTE")
    l5 = lecture_L3(1.50, 1.09, 1.91)
    t["l3_frontiere_d_t_cons_discrete"] = (l5["conservateur"] == "DISCRÈTE")
    # palier (max mécanique pure sur 4 axes)
    t["palier_vert"] = palier_de("TRANQUILLE", "DISCRÈTE", "TRANQUILLE", "DISCRÈTE", False)["palier"] == PALIER_VERT
    t["palier_orange"] = palier_de("VIVE", "DISCRÈTE", "TRANQUILLE", "DISCRÈTE", False)["palier"] == PALIER_ORANGE
    t["palier_rouge"] = palier_de("FORTE", "DISCRÈTE", "TRANQUILLE", "DISCRÈTE", False)["palier"] == PALIER_ROUGE
    t["palier_max_4e_axe"] = palier_de("DISCRÈTE", "DISCRÈTE", "DISCRÈTE", "VIVE", False)["palier"] == PALIER_ORANGE
    pf = palier_de("FORTE", "FORTE", "FORTE", "FORTE", True)
    t["palier_filet_court_circuit"] = (pf["palier"] == PALIER_ROUGE
                                       and pf["carte_affichee"] is False)
    # nuage / hiérarchie (seuil 0,8937)
    corr = {i: 2.0 for i in ITEMS}
    for it in FACES["PERS-AO2"]["items"]:
        corr[it] = 2.5
    t["l4_nuage_0_5"] = lecture_L4(corr, "AO")["lecture"] == "NUAGE"
    for it in FACES["PERS-AO2"]["items"]:
        corr[it] = 3.0
    t["l4_hierarchie_1_0"] = (lecture_L4(corr, "AO")["lecture"] == "HIÉRARCHIE DÉCLARABLE"
                              and lecture_L4(corr, "AO")["dominante"] == "PERS-AO2")
    # filet : voie héritée + voie détectée (somme J2 ≥ 11 ⟺ borne basse ≥ 3,20)
    ok_sans = signal_filet_de({}, {i: 2.0 for i in ITEMS})["filet"] is False
    f1 = signal_filet_de({"signal_herite": True}, {i: 2.0 for i in ITEMS})
    t["filet_voie_heritee"] = ok_sans and f1["filet"] and f1["filet_num"].startswith("3919")
    corr_ctrl = {i: 2.0 for i in ITEMS}
    for it in FACES["PERS-J2"]["items"]:
        corr_ctrl[it] = 4.0
    f2 = signal_filet_de({}, corr_ctrl)
    t["filet_voie_detectee_j2_4"] = (f2["filet"] is True
                                     and "détecté" in f2["voie"])
    corr_moy = {i: 2.0 for i in ITEMS}
    for it in FACES["PERS-J2"]["items"]:
        corr_moy[it] = 2.9
    t["pas_de_filet_j2_2_9"] = signal_filet_de({}, corr_moy)["filet"] is False
    corr_lim = {i: 2.0 for i in ITEMS}
    for k, it in enumerate(FACES["PERS-J2"]["items"]):
        corr_lim[it] = 4.0 if k < 2 else 3.0  # somme 11 → borne basse 3,25 ≥ 3,20
    t["filet_seuil_somme_11"] = signal_filet_de({}, corr_lim)["filet"] is True
    # RCI : bornes exactes + traversée + signe
    t["rci_0_58_fiable"] = (rci_de(2.400, 2.980)["verdict"] == "FIABLE"
                            and rci_de(2.400, 2.981)["verdict"] == "FIABLE")
    t["rci_0_5799_suggestion"] = rci_de(2.400, 2.979)["verdict"] == "SUGGESTION"
    t["rci_0_41_suggestion"] = rci_de(2.400, 2.810)["verdict"] == "SUGGESTION"
    t["rci_0_4099_bruit"] = rci_de(2.400, 2.809)["verdict"] == "BRUIT"
    t["rci_traversee_vraie"] = rci_de(2.400, 3.300)["traversee"] is True
    t["rci_traversee_fausse"] = rci_de(2.400, 2.500)["traversee"] is False
    t["rci_signe_delta"] = rci_de(2.400, 3.300)["delta"] == 0.9
    # avertissement styles (L6 note)
    ca = {i: 2.0 for i in ITEMS}
    cb = {i: 3.0 for i in ITEMS}
    cb2 = {i: 2.9 for i in ITEMS}
    t["styles_ecart_1_0_vrai"] = avertissement_de(ca, cb) is True
    t["styles_ecart_0_9_faux"] = avertissement_de(ca, cb2) is False
    # asymétrie temporelle : Δ = re − base (jamais l'inverse)
    t["anti_inversion_delta_positif"] = rci_de(2.400, 3.300)["delta"] > 0
    # items inversés : corrigé = 5 − raw
    t["inverse_corrige"] = (corrige("PERS-N2-3", 1) == 4.0
                            and corrige("PERS-N2-3", 4) == 1.0
                            and corrige("PERS-J2-3", 1) == 4.0)
    # vigilance : raw > 1 pénalise (motif sans linéarité : SD 0,4714 ≥ 0,45)
    pat = dict(zip(ITEMS, [3] * 16 + [2] * 8))
    raws_ok = {}
    for it in ITEMS:
        c = pat[it]
        raws_ok[it] = 5 - c if it in INVERSES else c
    raws_ok[ITEM_VIGILANCE] = 1
    temps = {i: 4.0 for i in list(ITEMS) + [ITEM_VIGILANCE]}
    rq_ok = calcule_rqs(raws_ok, temps, 120.0)
    raws_vig = dict(raws_ok)
    raws_vig[ITEM_VIGILANCE] = 3
    rq_vig = calcule_rqs(raws_vig, temps, 120.0)
    t["vigilance_penalite"] = (rq_ok["rqs"] == 100 and rq_vig["rqs"] == 80
                               and rq_vig["statut"] == "PRUDENCE")
    # RQS pièges
    raws_lin = {i: 3 for i in ITEMS}
    raws_lin[ITEM_VIGILANCE] = 1
    t["rqs_linearite_prudence"] = calcule_rqs(raws_lin, temps, 120.0)["rqs"] == 80
    raws_con = {i: 2 for i in ITEMS}
    raws_con.update({"PERS-N2-1": 1, "PERS-N2-2": 1, "PERS-N2-3": 1})
    t["rqs_contradiction"] = calcule_rqs(raws_con, temps, 120.0)["contradiction"] is True
    t["rqs_rythme_penalite"] = calcule_rqs(raws_ok, {i: 1.0 for i in list(ITEMS) + [ITEM_VIGILANCE]}, 30.0)["rythme"] is True
    t["rqs_invalide"] = calcule_rqs(raws_lin, {i: 1.0 for i in list(ITEMS) + [ITEM_VIGILANCE]}, 30.0)["statut"] == "INVALIDE"
    return t


def verifier_d_confirmation(couples):
    """D-CONFIRMATION : déterminisme pur (re-classification identique) +
    anti-inversion temporelle (Δ = re − base) + comptage RCI."""
    first = [classifier_couple(c) for c in couples]
    again = [classifier_couple(c) for c in couples]
    pure = all(
        m1["rive_a"]["palier"] == m2["rive_a"]["palier"]
        and m1["rive_b"]["palier"] == m2["rive_b"]["palier"]
        and m1["rive_a"]["rci"] == m2["rive_a"]["rci"]
        and m1["avertissement_styles"] == m2["avertissement_styles"]
        for m1, m2 in zip(first, again))
    anti_inv = (rci_de(2.400, 3.300)["delta"] == 0.9
                and rci_de(3.300, 2.400)["delta"] == -0.9)
    n_rci = sum(1 for c in couples if c.get("re_test_actif"))
    return {"deterministe": pure, "anti_inversion_temporelle": anti_inv,
            "n_rci": n_rci}

