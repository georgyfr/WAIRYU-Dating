# -*- coding: utf-8 -*-
"""WAIRYU — WTC-SM-Q5 « Mon premier pas vers l'autre rive » (RIO-15) : moteur.

SPEC SM-Q5-SPEC.md VERROUILLÉE (fondateur → pont par délégation, 18/10/2026 :
« je te délègues le tranchage comme en Q4. Puis verrouillage → production →
RIO-15 → santé mentale 5/5 ») :
- A1 : check-in binaire (le pas a-t-il été tenté aujourd'hui ?) — « tracking
       d'engagement » (ligne 427) ; statuts CÉLÉBRÉ (≥ 9/14) / EN CHEMIN
       (< 9/14), non-sanctionnants (lignes 297-298 : « 9/14 = célébré, jamais
       de sanction »)
- A2 : banque de 6 pas ancrée modules existants (lignes 128/133/134) + forces
       Q3 (F-S1 à F-S6) + champ libre — le choix reste au couple (§5.5)
- A3 : table palier = max(niveau détresse, niveau charge) — mécanique pure ;
       override crise héritée (A2 ∨ SM-C1 ∨ H5) → 🔴 ORIENTATION sans pas
       (D-CRISE hub : « JAMAIS de pas de couple en crise » — court-circuit
       AVANT le choix du pas)
- A4 : RCI L7 verbatim (Jacobson & Truax) : SE_diff = √2 × SEM ≈ 0,356 ·
       |Δ| ≥ 0,58 FIABLE · [0,41 ; 0,58[ SUGGESTION · < 0,41 BRUIT ·
       signification clinique = traversée des bornes A1 (2,50/3,50) ;
       Δ = re-test − base sans exception (asymétrie temporelle) ;
       agrégation d'ensemble = max des statuts (anti-surinterprétation L4)
- A5 : C6 = 0 sanction produite / 0 verdict de rémission
Déterministe. Entrées = sorties contresignées Q1 (RIO-11) / Q2 (RIO-12) /
Q4 (RIO-14). 0 invention de contenu thérapeutique."""
from __future__ import annotations

# --- Suivi 14 jours (A1) -------------------------------------------------------
N_JOURS = 14
SEUIL_CELEBRE = 9          # 9/14 = célébré, jamais de sanction (ligne 297-298)
STATUT_CELEBRE = "CÉLÉBRÉ"
STATUT_EN_CHEMIN = "EN CHEMIN"

# --- RCI longitudinal (A4 — L7 verbatim) ---------------------------------------
SE_DIFF = 0.356            # √2 × SEM ≈ 0,356 (ligne 263 — constante L7)
SEUIL_FIABLE = 0.58        # |Δ| ≥ 0,58 = FIABLE
SEUIL_SUGGESTION = 0.41    # 0,41-0,58 = SUGGESTION ; < 0,41 = BRUIT
STATUT_FIABLE = "FIABLE"
STATUT_SUGGESTION = "SUGGESTION"
STATUT_BRUIT = "BRUIT"
ENSEMBLE_FIABLE = "UN CHANGEMENT FIABLE"
ENSEMBLE_SUGGESTION = "UNE PISTE À CONFIRMER"
ENSEMBLE_BRUIT = "DANS LE BRUIT DE LA MESURE"

# --- Bornes A1 (héritées Q4 — une mesure, un rôle) -----------------------------
SEUIL_FAIBLE = 2.50
SEUIL_ELEVE = 3.50
NIVEAUX = ("FAIBLE", "MOYEN", "ÉLEVÉ")

# --- Les 9 configurations Q4 (entrées contresignées RIO-14) --------------------
TABLE_CONFIGS = (
    ("CALME DES DEUX RIVES", "FAIBLE", "FAIBLE"),
    ("VEILLE",               "FAIBLE", "MOYEN"),
    ("PORTE SEULE",          "FAIBLE", "ÉLEVÉ"),
    ("COURANT FORT",         "MOYEN",  "FAIBLE"),
    ("DEUX COURANTS",        "MOYEN",  "MOYEN"),
    ("RIVE QUI CÈDE",        "MOYEN",  "ÉLEVÉ"),
    ("TEMPÊTE",              "ÉLEVÉ",  "FAIBLE"),
    ("TEMPÊTE ET DIGUE",     "ÉLEVÉ",  "MOYEN"),
    ("DÉBORDEMENT",          "ÉLEVÉ",  "ÉLEVÉ"),
)
_LOOKUP_CONFIG = {(c[1], c[2]): c[0] for c in TABLE_CONFIGS}
CONFIG_LABELS = tuple(c[0] for c in TABLE_CONFIGS)

# --- Paliers §5.4 (A3 — table max-niveau, verbatim programme) ------------------
PALIER_VERT = "EXERCICE MAISON"      # 🟢 « ombre légère → exercice maison »
PALIER_ORANGE = "MODULE DE COUPLE"   # 🟠 « moyenne → module de couple »
PALIER_ROUGE = "ORIENTATION"         # 🔴 « élevée/signal → orientation chaleureuse »
_RANG = {"FAIBLE": 0, "MOYEN": 1, "ÉLEVÉ": 2}
_PALIER_PAR_RANG = {0: PALIER_VERT, 1: PALIER_ORANGE, 2: PALIER_ROUGE}

# --- D-CRISE (hub verbatim : « JAMAIS de pas de couple en crise ») -------------
VOIES_HERITEES = ("A2", "SM-C1", "H5")

# --- Banque de pas (A2 — modules existants, zéro invention) --------------------
BANQUE_PAS = {
    PALIER_VERT: (
        "Exercice maison : pratiquer la force dérivée identifiée en Q3 (banque F-S1 à F-S6)",
        "Exercice maison : noter chaque soir un mot sur sa rive, 7 jours (météo intérieure, ligne 128)",
        "Exercice maison : préparer sa question pour la Revue mensuelle",
    ),
    PALIER_ORANGE: (
        "À deux : co-étiqueter la frontière (3 cases : trouble / toi / désaccord)",
        "À deux : tenir Les rituels de deux adultes une fois cette semaine",
        "À deux : ouvrir Le plan des jours durs et l'ajuster ensemble",
    ),
    PALIER_ROUGE: (),   # 🔴 : aucun pas de couple — l'orientation EST le pas
}
PAS_LIBRE = "ou écrire votre propre pas"
LITTERAL_ORIENTATION = ("Le chemin le plus court, pas un échec — l'orientation "
                        "professionnelle est le pas qui compte ici.")


def niveau_de(score):
    """Niveau d'un agrégat — bornes A1 héritées Q4 :
    < 2,50 FAIBLE · [2,50 ; 3,50[ MOYEN · ≥ 3,50 ÉLEVÉ."""
    if score < SEUIL_FAIBLE:
        return "FAIBLE"
    if score < SEUIL_ELEVE:
        return "MOYEN"
    return "ÉLEVÉ"


def config_de(niv_det, niv_chg):
    """Configuration Q4 tracée (traçabilité) — croisé asymétrique hérité."""
    return _LOOKUP_CONFIG[(niv_det, niv_chg)]


def crise_heritee_de(voies_p1, voies_p2):
    """Flag crise héritée (A2 ∨ SM-C1 ∨ H5) sur l'un des deux profils."""
    v = set(voies_p1) | set(voies_p2)
    return any(x in v for x in VOIES_HERITEES)


def palier_de(niv_det, niv_chg, crise=False):
    """A3 : palier = max(niveau détresse, niveau charge) — mécanique pure.
    D-CRISE : le court-circuit passe AVANT (override 🔴 ORIENTATION)."""
    if crise:
        return PALIER_ROUGE
    return _PALIER_PAR_RANG[max(_RANG[niv_det], _RANG[niv_chg])]


def pas_de(palier, choix=None):
    """A2 : pas servi depuis la banque du palier (ou champ libre).
    🔴 ORIENTATION : AUCUN pas de couple déployé (D-CRISE) — None."""
    if palier == PALIER_ROUGE:
        return None
    if choix:
        return choix
    return BANQUE_PAS[palier][0]


def statut_engagement_de(serie):
    """A1 : statut d'engagement = f(série binaire de 14 check-ins).
    ≥ 9/14 CÉLÉBRÉ · < 9/14 EN CHEMIN — jamais de sanction."""
    if serie is None:
        return None            # pas non déployé (D-CRISE) — rien à évaluer
    if len(serie) != N_JOURS:
        raise ValueError("série de check-ins : 14 jours attendus")
    return STATUT_CELEBRE if sum(1 for j in serie if j) >= SEUIL_CELEBRE \
        else STATUT_EN_CHEMIN


def delta_de(base, re_test):
    """Δ = re-test − base — ASYMÉTRIE TEMPORRELLE sans exception
    (homologue de l'anti-inversion Q4)."""
    return re_test - base


def statut_rci_de(base, re_test):
    """A4 : statut L7 d'une rive — |Δ| ≥ 0,58 FIABLE · [0,41 ; 0,58[ SUGGESTION ·
    < 0,41 BRUIT (bornes en lecture directe de « 0,41-0,58 » et « < 0,41 »)."""
    d = abs(delta_de(base, re_test))
    if d >= SEUIL_FIABLE:
        return STATUT_FIABLE
    if d >= SEUIL_SUGGESTION:
        return STATUT_SUGGESTION
    return STATUT_BRUIT


_STATUT_RANG = {STATUT_BRUIT: 0, STATUT_SUGGESTION: 1, STATUT_FIABLE: 2}
_STATUT_PAR_RANG = {0: ENSEMBLE_BRUIT, 1: ENSEMBLE_SUGGESTION, 2: ENSEMBLE_FIABLE}


def statut_ensemble_de(s_det, s_chg):
    """A4 : agrégation d'ensemble = max des statuts des deux rives
    (BRUIT < SUGGESTION < FIABLE) — convention d'affichage explicite,
    anti-surinterprétation (L4)."""
    return _STATUT_PAR_RANG[max(_STATUT_RANG[s_det], _STATUT_RANG[s_chg])]


def traverse_borne_de(base, re_test):
    """Signification clinique (L7) : traversée d'une borne A1 (2,50/3,50)
    entre base et re-test — une mesure garde un seul rôle (bornes de Q4)."""
    return niveau_de(base) != niveau_de(re_test)


def signification_de(base, re_test):
    """Libellé de traversée (« Moyen → Faible ») ou chaîne vide."""
    n1, n2 = niveau_de(base), niveau_de(re_test)
    return f"{n1} → {n2}" if n1 != n2 else ""


def classifier(c):
    """Classement complet d'un couple Q5 — pure, déterministe.
    c : dict(scores_det=[3], scores_chg=[12], voies_p1, voies_p2,
             serie (14 bool | None), choix_pas (str | None),
             base_det, base_chg (agrégats contresignés | None),
             re_det, re_chg (agrégats re-test | None))."""
    det = sum(c["scores_det"]) / len(c["scores_det"])
    chg = sum(c["scores_chg"]) / len(c["scores_chg"])
    crise = crise_heritee_de(c["voies_p1"], c["voies_p2"])
    niv_det, niv_chg = niveau_de(det), niveau_de(chg)
    config = config_de(niv_det, niv_chg)          # tracée (traçabilité)
    palier = palier_de(niv_det, niv_chg, crise)   # A3 (override en premier)
    pas = pas_de(palier, c.get("choix_pas"))      # A2 — None sur 🔴
    serie = c.get("serie")
    statut = statut_engagement_de(serie)
    rci = None
    if c.get("re_det") is not None and c.get("re_chg") is not None \
            and c.get("base_det") is not None and c.get("base_chg") is not None:
        s_det = statut_rci_de(c["base_det"], c["re_det"])
        s_chg = statut_rci_de(c["base_chg"], c["re_chg"])
        rci = {
            "delta_det": round(delta_de(c["base_det"], c["re_det"]), 2),
            "delta_chg": round(delta_de(c["base_chg"], c["re_chg"]), 2),
            "statut_det": s_det,
            "statut_chg": s_chg,
            "ensemble": statut_ensemble_de(s_det, s_chg),
            "traversee_det": traverse_borne_de(c["base_det"], c["re_det"]),
            "traversee_chg": traverse_borne_de(c["base_chg"], c["re_chg"]),
            "signif_det": signification_de(c["base_det"], c["re_det"]),
            "signif_chg": signification_de(c["base_chg"], c["re_chg"]),
        }
    return {"niv_det": niv_det, "niv_chg": niv_chg, "config": config,
            "palier": palier, "pas": pas, "statut": statut, "rci": rci,
            "crise": crise}


# --- Littéraux d'affichage (autoporteurs — C5) ---------------------------------
TEMPLATES = {
    "celebre": "{n} jours sur 14 — c'est célébré. Le pas a tenu.",
    "celebre_pile": "9 jours sur 14 — c'est célébré pile sur le seuil. "
                    "Pas besoin de viser plus : le programme compte 9/14 "
                    "comme un pas tenu.",
    "en_chemin": "{n} jours sur 14 — le pas est en chemin. Rien n'est perdu, "
                 "rien n'est noté : le suivi continue, sans sanction.",
    "fiable": "Le changement est mesuré comme fiable (au-delà du bruit de la mesure).",
    "suggestion": "Une piste de changement se dessine — à confirmer au prochain re-test.",
    "bruit": "Dans le bruit de la mesure — ça ne dit ni réussite ni échec, "
             "ça dit que la mesure ne tranche pas encore.",
    "zone_calme": "Zone calme — rien à fabriquer ici. Un exercice maison, "
                  "pas une réparation.",
    "module_couple": "La zone de travail ordinaire : un module de couple, à deux.",
    "orientation": LITTERAL_ORIENTATION,
}
NOMENCLATURE = (STATUT_CELEBRE, STATUT_EN_CHEMIN, STATUT_FIABLE,
                STATUT_SUGGESTION, STATUT_BRUIT, ENSEMBLE_FIABLE,
                ENSEMBLE_SUGGESTION, ENSEMBLE_BRUIT, PALIER_VERT,
                PALIER_ORANGE, PALIER_ROUGE)


# --- D-TABLE (C1) : tables de vérité exhaustives -------------------------------
def verifier_d_table():
    """Grilles exhaustives : engagement (15 totaux), frontières RCI exactes,
    table palier (9 configs == règle max), banque injective, anti-inversion
    temporelle de delta_de. Retourne un dict de booléens."""
    # Engagement : chaque total 0..14 → statut attendu (grille complète)
    grille_ok = True
    for total in range(N_JOURS + 1):
        serie = tuple(j < total for j in range(N_JOURS))
        attendu = STATUT_CELEBRE if total >= SEUIL_CELEBRE else STATUT_EN_CHEMIN
        grille_ok &= statut_engagement_de(serie) == attendu
    # Frontières RCI exactes (bornes incluses, lecture verbatim L7)
    frontieres = {
        (3.0, 3.58): STATUT_FIABLE,      # |Δ| = 0,58 pile → FIABLE (incluse)
        (3.0, 2.42): STATUT_FIABLE,      # |Δ| = 0,58 à la baisse
        (3.0, 3.41): STATUT_SUGGESTION,  # |Δ| = 0,41 pile → SUGGESTION (incluse)
        (3.0, 2.59): STATUT_SUGGESTION,
        (3.0, 3.40): STATUT_BRUIT,       # |Δ| = 0,40 → BRUIT
        (3.0, 2.60): STATUT_BRUIT,
        (3.0, 3.59): STATUT_FIABLE,
        (3.0, 2.00): STATUT_FIABLE,      # |Δ| = 1,00
    }
    frontieres_ok = all(statut_rci_de(b, r) == s
                        for (b, r), s in frontieres.items())
    # Asymétrie temporelle : swap base/re-test → Δ signé inversé exactement
    inversion_ok = True
    for b, r in frontieres:
        inversion_ok &= (delta_de(r, b) == -delta_de(b, r))
    # Table palier : règle max == table verrouillée (croisé 9/9)
    palier_vrai = {
        "CALME DES DEUX RIVES": PALIER_VERT, "VEILLE": PALIER_ORANGE,
        "PORTE SEULE": PALIER_ROUGE, "COURANT FORT": PALIER_ORANGE,
        "DEUX COURANTS": PALIER_ORANGE, "RIVE QUI CÈDE": PALIER_ROUGE,
        "TEMPÊTE": PALIER_ROUGE, "TEMPÊTE ET DIGUE": PALIER_ROUGE,
        "DÉBORDEMENT": PALIER_ROUGE,
    }
    palier_ok = True
    for nom, nd, nc in TABLE_CONFIGS:
        palier_ok &= palier_de(nd, nc) == palier_vrai[nom]
    # Override : court-circuit avant l'arbre — même sur DÉBORDEMENT
    override_ok = palier_de("ÉLEVÉ", "ÉLEVÉ", True) == PALIER_ROUGE \
        and pas_de(PALIER_ROUGE) is None \
        and statut_engagement_de(None) is None
    # Banque injective : 6 pas uniques, 🟢 ×3, 🟠 ×3, 🔴 vide
    banque = BANQUE_PAS[PALIER_VERT] + BANQUE_PAS[PALIER_ORANGE]
    banque_ok = (len(banque) == 6 and len(set(banque)) == 6
                 and len(BANQUE_PAS[PALIER_VERT]) == 3
                 and len(BANQUE_PAS[PALIER_ORANGE]) == 3
                 and len(BANQUE_PAS[PALIER_ROUGE]) == 0)
    # Agrégation max : les 9 combinaisons de statuts → ensemble attendu
    agg_ok = True
    for s1 in NOMENCLATURE[2:5]:
        for s2 in NOMENCLATURE[2:5]:
            attendu = ENSEMBLE_FIABLE if STATUT_FIABLE in (s1, s2) else (
                ENSEMBLE_SUGGESTION if STATUT_SUGGESTION in (s1, s2)
                else ENSEMBLE_BRUIT)
            agg_ok &= statut_ensemble_de(s1, s2) == attendu
    # Traversée de borne : 3,0→2,10 Oui ; 3,0→3,0 Non ; 3,0→3,75 Oui (hausse)
    traversee_ok = (traverse_borne_de(3.0, 2.10)
                    and not traverse_borne_de(3.0, 3.0)
                    and traverse_borne_de(3.0, 3.75)
                    and not traverse_borne_de(2.49, 2.10))
    return {"grille_engagement": grille_ok, "frontieres_rci": frontieres_ok,
            "inversion_temporelle": inversion_ok, "palier_max": palier_ok,
            "override_court_circuit": override_ok, "banque_injective": banque_ok,
            "agregation_max": agg_ok, "traversee_borne": traversee_ok}


def verifier_d_confirmation(couples):
    """D-CONFIRMATION Q5 : pureté (même entrée → même classement, 2 passes),
    anti-inversion temporelle (swap base/re-test → Δ signé inversé, statut
    |Δ| identique). Retourne un dict de booléens."""
    det1 = [classifier(c) for c in couples]
    det2 = [classifier(c) for c in couples]
    pure = det1 == det2
    inv_ok = True
    n_rci = 0
    for c in couples:
        if c.get("re_det") is None:
            continue
        n_rci += 1
        b, r = c["base_det"], c["re_det"]
        d = round(delta_de(b, r), 9)
        d_inv = round(delta_de(r, b), 9)
        inv_ok &= (d == -d_inv)
        inv_ok &= statut_rci_de(r, b) == statut_rci_de(b, r)   # |Δ| symétrique
        c2 = dict(c)
        c2["base_det"], c2["re_det"] = r, b
        inv_ok &= (classifier(c2)["rci"]["delta_det"]
                   == -classifier(c)["rci"]["delta_det"])
    return {"pure": pure, "anti_inversion_temporelle": inv_ok, "n_rci": n_rci}


# --- D-STD-2 : seuils PAR groupe (12 valeurs distinctes) -----------------------
# Théorique (items base arrondis, σ_eff det ≈ 0,38 / chg ≈ 0,19 ; re-test SEM
# L7 0,252) : le palier max dérive par le HAUT dès qu'une rive mesurée ≥ 3,50
# (μ 3,0 → ≈ 8-10 % — discrétisation amplifie) · G7 (μ 2,0) : max FAIBLE exige
# les deux < 2,50 ≈ 90 % · G8 : override pur → 100 % · G9 : agrégation max
# FIABLE ≈ 85 % · G10 : fenêtre SUGGESTION étroite (0,17 pt) vs σ_Δ 0,252 →
# ≈ 35 % (structurel, documenté §B/E) · G11 : ≈ 70 % · G12 : ε = 0 → ensemble
# exact 100 %, conformité totale ≈ 90 % (palier). Marge ≥ 2,5σ binomiale
# (n = 50 : σ ≈ 4-5 pts · n = 40 : 7,7 · n = 30 : 8,3), comme émo-Q4/Q4.
SEUILS_D_STD_2 = {
    "G1_REGULIERS_14": 76, "G2_REGULIERS_13": 75, "G3_LENTS_DEMARREURS": 74,
    "G4_DECROCHEURS": 73, "G5_FRONTIERE_EXACTE": 77, "G6_TRES_FAIBLES": 72,
    "G7_ZONE_CALME": 78, "G8_CRISE_HERITEE": 98,
    "G9_RCI_FIABLE": 70, "G10_RCI_SUGGESTION": 15,
    "G11_RCI_BRUIT": 50, "G12_RCI_FRONTIERE": 71,
}
