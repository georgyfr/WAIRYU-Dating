# -*- coding: utf-8 -*-
"""WAIRYU — WTC-EXT-Q1 : moteur Quête 1 Extensions (Générationnelle)
« L'écart de nos horloges » — RIO-16 cible.

SPEC VERROUILLÉE (addf575) — tranchages A1-A5 :
A1 Générationnelle « L'Écart des horloges » (ligne 112) · A2 carte → croisement
→ pas · A3 18 items (3 axes × 2 faces × 3 items), échelle 1-4, 2 inversés,
1 vigilance · A4 L1-L4 + L7 embarquée, L5-L6 reportées à Q2 · A5 C6 = 0 verdict
sur le temps restant / 0 modèle de la bonne saison.

Couches canon (programme wairyu couple.txt) :
L1 RQS (ligne 257) · L2 scores+intervalles (ligne 258, placeholders SD 0,65 /
α 0,85) · L3 4 niveaux + FRONTIÈRE conservatrice (ligne 259) · L4 faces
dominantes / nuage (ligne 260) · L7 RCI Jacobson & Truax (ligne 263) ·
re-test 8 semaines (ligne 274). Filet 9 signaux → P-FILTRE (ligne 369),
court-circuit AVANT l'arbre. Avertissement styles dissemblables (L6) en note
de lecture sans verdict (A4)."""
import math

# ── Instrument (A3 : mapping 1:1 des construits nommés ligne 112) ────────────
FACES = {
    "EXT-H1": {"axe": "H", "nom": "L'horizon perçu",
               "items": ["EXT-H1-1", "EXT-H1-2", "EXT-H1-3"]},
    "EXT-H2": {"axe": "H", "nom": "La priorisation",
               "items": ["EXT-H2-1", "EXT-H2-2", "EXT-H2-3"]},
    "EXT-L1": {"axe": "L", "nom": "La taxe de justification",
               "items": ["EXT-L1-1", "EXT-L1-2", "EXT-L1-3"]},
    "EXT-L2": {"axe": "L", "nom": "La permission à deux",
               "items": ["EXT-L2-1", "EXT-L2-2", "EXT-L2-3"]},
    "EXT-C1": {"axe": "C", "nom": "L'ouverture",
               "items": ["EXT-C1-1", "EXT-C1-2", "EXT-C1-3"]},
    "EXT-C2": {"axe": "C", "nom": "L'évitement",
               "items": ["EXT-C2-1", "EXT-C2-2", "EXT-C2-3"]},
}
AXES = {"H": "L'horloge (Carstensen)", "L": "La légitimité",
        "C": "La conversation de l'horizon"}
ITEMS = [i for f in FACES.values() for i in f["items"]]
N_ITEMS = len(ITEMS)  # 18
INVERSES = {"EXT-H2-3": ("EXT-H2-1", "EXT-H2-2"),
            "EXT-C2-3": ("EXT-C2-1", "EXT-C2-2")}
ITEM_VIGILANCE = "EXT-VIG"
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
# Palier = max(niveaux conservateurs) ; conservateur V ⟺ bas ≥ 2,60 ∧ bas < 3,20
# → zone V = [2,60 + CI90 ; 3,20 + CI90[ ; F ⟺ bas ≥ 3,20 → s ≥ 3,20 + CI90.
TRANS_T_HAUT = round(SEUILS_NIVEAUX[1] + CI90_DEMI, 4)   # 3.0128
TRANS_V_HAUT = round(SEUILS_NIVEAUX[2] + CI90_DEMI, 4)   # 3.6128
SIGMA_EFF_AXE = round(0.60 / math.sqrt(6.0), 4)          # 0.2449 (D-PARAM σ 0,60)
SIGMA_DIFF_STYLES = round(0.60 * math.sqrt(2.0 / 18.0), 4)  # 0.2 (écart des moyennes)
SIGMA_RCI = round(0.60 * math.sqrt(2.0 / 18.0), 4)       # 0.2 (Δ sur agrégats)

NOMENCLATURE = (NIVEAUX + [PALIER_VERT, PALIER_ORANGE, PALIER_ROUGE,
                           "NUAGE", "HIÉRARCHIE DÉCLARABLE", "NIVEAU",
                           "FRONTIÈRE"] + list(STATUTS_RQS)
                + ["FIABLE", "SUGGESTION", "BRUIT", "P-FILTRE"])

# ── Géométrie des 12 groupes (face μ par rive — source unique simulateur +
#    calibration D-STD-2). Rives identiques sauf RIVES_DISSEMBLABLES. ─────────
GEOMETRIE = {
    "G01_HORLOGE_OUVERTE":        {"H1": 2.0, "H2": 3.0, "L1": 1.7, "L2": 2.5, "C1": 3.3, "C2": 1.7, "n": 50},
    "G02_HORIZON_FINI_SEREIN":    {"H1": 3.0, "H2": 2.4, "L1": 1.8, "L2": 2.5, "C1": 3.0, "C2": 1.9, "n": 50},
    "G03_TAXE_LOURDE":            {"H1": 2.0, "H2": 2.2, "L1": 4.0, "L2": 2.6, "C1": 2.4, "C2": 2.2, "n": 50},
    "G04_ZONE_CALME_GENERATION":  {"H1": 2.5, "H2": 2.3, "L1": 2.2, "L2": 2.4, "C1": 2.5, "C2": 2.4, "n": 50},
    "G05_FRONTIERE_H":            {"H1": 2.75, "H2": 2.35, "L1": 1.7, "L2": 1.9, "C1": 2.0, "C2": 2.0, "n": 40},
    "G06_FRONTIERE_L":            {"H1": 2.0, "H2": 2.2, "L1": 2.7, "L2": 2.5, "C1": 1.9, "C2": 2.1, "n": 40},
    "G07_FRONTIERE_C":            {"H1": 2.1, "H2": 1.9, "L1": 1.8, "L2": 2.0, "C1": 2.75, "C2": 2.55, "n": 40},
    "G08_NUAGE":                  {"H1": 2.8, "H2": 2.6, "L1": 2.0, "L2": 2.2, "C1": 2.3, "C2": 2.5, "n": 40},
    "G09_PIEGES_RQS":             {"H1": 2.4, "H2": 2.4, "L1": 2.4, "L2": 2.4, "C1": 2.4, "C2": 2.4, "n": 40, "piege": True},
    "G10_RIVES_DISSEMBLABLES":    {"H1": 2.0, "H2": 2.0, "L1": 2.0, "L2": 2.0, "C1": 2.0, "C2": 2.0, "n": 40,
                                   "riveB": {"H1": 3.8, "H2": 3.8, "L1": 3.8, "L2": 3.8, "C1": 3.8, "C2": 3.8}},
    "G11_SIGNAL_FILET":           {"H1": 2.4, "H2": 2.4, "L1": 2.4, "L2": 2.4, "C1": 2.4, "C2": 2.4, "n": 40, "filet": True},
    "G12_RE_TEST":                {"H1": 2.4, "H2": 2.4, "L1": 2.4, "L2": 2.4, "C1": 2.4, "C2": 2.4, "n": 40, "re_test": True},
}
# Δ vrais du re-test (G12) : 15 FIABLE 0,70 · 10 SUGGESTION 0,50 · 15 BRUIT 0,15
DELTAS_VRAIS_G12 = [0.70] * 15 + [0.50] * 10 + [0.15] * 15


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
    sur EXT-VIG → −20). Seuils : ≥ 85 OK · 70-84 PRUDENCE · < 70 INVALIDE."""
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


# ═══════════════════ Filet + palier (court-circuit AVANT l'arbre) ═════════════
def signal_filet_de(profil):
    """Filet 9 signaux → P-FILTRE (ligne 369). Voie in-sim : signal hérité
    d'une autre dimension (flag externe) — la Générationnelle n'a pas de
    signal nommé dans le canon (SPEC §4)."""
    if profil.get("signal_herite", False):
        return {"filet": True, "voie": "signal hérité (dimension antérieure)",
                "filet_num": "3919 / 3114 — P-FILTRE"}
    return {"filet": False, "voie": None, "filet_num": None}


def palier_de(nivH, nivL, nivC, filet):
    """Max des niveaux conservateurs (SPEC §3 — leçon Q5-A3 mécanique pure) ;
    signal sécurité → 🔴 court-circuit AVANT l'arbre (carte non affichée)."""
    if filet:
        return {"palier": PALIER_ROUGE, "carte_affichee": False,
                "cause": "P-FILTRE — court-circuit avant l'arbre"}
    plus_haut = max(nivH, nivL, nivC, key=NIVEAUX.index)
    if plus_haut == NIVEAUX[3]:
        p = PALIER_ROUGE
    elif plus_haut == NIVEAUX[2]:
        p = PALIER_ORANGE
    else:
        p = PALIER_VERT
    return {"palier": p, "carte_affichee": True, "cause": f"max des niveaux conservateurs = {plus_haut}"}


# ═══════════ Avertissement styles (L6 — note, sans verdict, A4) ═══════════════
def avertissement_de(corr_a, corr_b):
    ma = sum(corr_a[i] for i in ITEMS) / len(ITEMS)
    mb = sum(corr_b[i] for i in ITEMS) / len(ITEMS)
    return round(abs(ma - mb), 2) >= SEUIL_STYLES


# ═══════════════════════ L7 — RCI (Jacobson & Truax) ══════════════════════════
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
    """Carte d'une rive. Ordre : (1) filet — court-circuit AVANT l'arbre ;
    (2) RQS INVALIDE — aucun résultat ; (3) carte complète."""
    raws = {i: profil[i] for i in ITEMS}
    raws[ITEM_VIGILANCE] = profil.get(ITEM_VIGILANCE, 1)
    filet = signal_filet_de(profil)
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
    corr = scores_corriges(raws)
    niveaux, faces = {}, {}
    for axe in AXES:
        s = score_axe_de(corr, axe)
        bas, haut = bornes_ci90(s)
        niveaux[axe] = {"score": s, "ci90": [bas, haut], **lecture_L3(s, bas, haut)}
        faces[axe] = lecture_L4(corr, axe)
    p = palier_de(niveaux["H"]["conservateur"], niveaux["L"]["conservateur"],
                  niveaux["C"]["conservateur"], False)
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
    "palier_orange": "Palier 🟠 MODULE DE COUPLE : un temps à deux autour de la conversation de l'horizon.",
    "palier_rouge": "Palier 🔴 ORIENTATION : le chemin le plus court, pas un échec.",
    "filet": "Le filet de sécurité s'applique avant tout : P-FILTRE — {filet_num}. La carte n'est pas affichée.",
    "avertissement": "Vos deux rives répondent avec des niveaux très différents — l'écart sera lu au croisement à deux (Q2). Aucun verdict ici.",
    "prudence": "Qualité de réponse PRUDENCE ({rqs}/100) — la carte reste lisible, avec prudence.",
    "invalide": "Réponses de qualité insuffisante (RQS {rqs}/100) — aucun résultat affiché.",
    "rci_fiable": "UN CHANGEMENT FIABLE depuis la base (re-test 8 semaines, |Δ| ≥ 0,58).",
    "rci_suggestion": "UNE PISTE À CONFIRMER (|Δ| entre 0,41 et 0,58).",
    "rci_bruit": "DANS LE BRUIT DE LA MESURE (|Δ| < 0,41) — rien à conclure.",
    "traversee": "L'agrégat a traversé un seuil de lecture entre base et re-test (signification clinique).",
    "re_test_programme": "Re-test programmé à 8 semaines (ligne 274).",
}


# ═══════════════ Calibration D-STD-2 (théorique − 2,5σ, comme Q4/Q5) ══════════
def _phi(x):
    return 0.5 * (1.0 + math.erf(x / math.sqrt(2.0)))


def _p_rive_palier(mu_axes):
    """P(carte rive affiche le palier vrai) — modèle normal sur les axes
    (σ_eff axe, sans clipping : conservateur)."""
    niveaux_vrais = []
    for mu in mu_axes:
        bas = round(mu - CI90_DEMI, 2)
        haut = round(mu + CI90_DEMI, 2)
        niveaux_vrais.append(lecture_L3(mu, bas, haut)["conservateur"])
    vrai_max = max(niveaux_vrais, key=NIVEAUX.index)
    if vrai_max == NIVEAUX[3]:
        return 1.0 - math.prod(_phi((TRANS_V_HAUT - mu) / SIGMA_EFF_AXE) for mu in mu_axes)
    if vrai_max == NIVEAUX[2]:
        j = niveaux_vrais.index(NIVEAUX[2])
        pj = _phi((TRANS_V_HAUT - mu_axes[j]) / SIGMA_EFF_AXE) - _phi((TRANS_T_HAUT - mu_axes[j]) / SIGMA_EFF_AXE)
        return pj * math.prod(_phi((TRANS_V_HAUT - mu) / SIGMA_EFF_AXE)
                              for k, mu in enumerate(mu_axes) if k != j)
    return math.prod(_phi((TRANS_T_HAUT - mu) / SIGMA_EFF_AXE) for mu in mu_axes)


def _mu_axes(g, rive="A"):
    src = g if rive == "A" else g.get("riveB", g)
    return [round((src["H1"] + src["H2"]) / 2, 4),
            round((src["L1"] + src["L2"]) / 2, 4),
            round((src["C1"] + src["C2"]) / 2, 4)]


def p_conformite_groupe(g):
    """p̂ théorique de conformité du groupe (surface de décision : palier des
    deux rives + filet + avertissement + statut RQS/pièges + verdict RCI)."""
    if g.get("piege"):
        return 0.998
    if g.get("filet"):
        return 1.0
    p = _p_rive_palier(_mu_axes(g, "A")) * _p_rive_palier(_mu_axes(g, "B"))
    if g.get("riveB"):
        ma = sum(_mu_axes(g, "A")) / 3.0
        mb = sum(_mu_axes(g, "B")) / 3.0
        p *= _phi((abs(mb - ma) - SEUIL_STYLES) / SIGMA_DIFF_STYLES)
    if g.get("re_test"):
        # verdict RCI observé == vrai, par rive (Δ ~ N(Δvrai, σ_rci))
        def p_rci(dv):
            if dv >= SEUIL_FIABLE:
                return 1.0 - _phi((SEUIL_FIABLE - dv) / SIGMA_RCI)
            if dv >= SEUIL_SUGGESTION:
                return (_phi((SEUIL_FIABLE - dv) / SIGMA_RCI)
                        - _phi((SEUIL_SUGGESTION - dv) / SIGMA_RCI))
            return _phi((SEUIL_SUGGESTION - dv) / SIGMA_RCI)
        p *= math.prod(min(1.0, p_rci(dv) ** 2) for dv in DELTAS_VRAIS_G12) ** (1.0 / len(DELTAS_VRAIS_G12))
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
        mu_a, mu_b = _mu_axes(g, "A"), _mu_axes(g, "B")
        dists = [min(abs(mu - s) for s in SEUILS_NIVEAUX) / SIGMA_EFF_AXE for mu in mu_a + mu_b]
        centres[gname] = {"mu_axes_A": mu_a, "mu_axes_B": mu_b,
                          "distance_min_seuil_sigma": round(min(dists), 2),
                          "dans_bande_3sigma": min(dists) < 3.0}
    distinct = len({c["seuil"] for c in calib.values()}) == len(calib)
    return {"seuils": {k: v["seuil"] for k, v in calib.items()},
            "detail": calib, "centres": centres,
            "bornes_distinctes": distinct, "ok": distinct}


SEUILS_D_STD_2 = {k: v["seuil"] for k, v in calibration_d_std_2()["detail"].items()}


# ═══════════════════════ D-TABLE (C1 — cas exhaustifs) ════════════════════════
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
    # palier (max mécanique pure)
    t["palier_vert"] = palier_de("TRANQUILLE", "DISCRÈTE", "TRANQUILLE", False)["palier"] == PALIER_VERT
    t["palier_orange"] = palier_de("VIVE", "DISCRÈTE", "TRANQUILLE", False)["palier"] == PALIER_ORANGE
    t["palier_rouge"] = palier_de("FORTE", "DISCRÈTE", "TRANQUILLE", False)["palier"] == PALIER_ROUGE
    pf = palier_de("FORTE", "FORTE", "FORTE", True)
    t["palier_filet_court_circuit"] = (pf["palier"] == PALIER_ROUGE
                                       and pf["carte_affichee"] is False)
    # nuage / hiérarchie (seuil 0,8937)
    corr = {i: 2.0 for i in ITEMS}
    for it in FACES["EXT-H2"]["items"]:
        corr[it] = 2.5
    t["l4_nuage_0_5"] = lecture_L4(corr, "H")["lecture"] == "NUAGE"
    for it in FACES["EXT-H2"]["items"]:
        corr[it] = 3.0
    t["l4_hierarchie_1_0"] = (lecture_L4(corr, "H")["lecture"] == "HIÉRARCHIE DÉCLARABLE"
                              and lecture_L4(corr, "H")["dominante"] == "EXT-H2")
    # filet : voie héritée
    ok_fort = signal_filet_de({"signal_herite": False})["filet"] is False
    f2 = signal_filet_de({"signal_herite": True})
    t["filet_voie_heritee"] = ok_fort and f2["filet"] and f2["filet_num"].startswith("3919")
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
    t["inverse_corrige"] = corrige("EXT-H2-3", 1) == 4.0 and corrige("EXT-H2-3", 4) == 1.0
    # vigilance : raw > 1 pénalise (motif sans linéarité : SD 0,499 ≥ 0,45)
    pat = dict(zip(ITEMS, [3] * 10 + [2] * 8))
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
    raws_con.update({"EXT-H2-1": 1, "EXT-H2-2": 1, "EXT-H2-3": 1})
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
