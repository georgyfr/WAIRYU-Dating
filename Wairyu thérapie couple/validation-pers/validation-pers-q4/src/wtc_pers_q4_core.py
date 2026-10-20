# -*- coding: utf-8 -*-
"""WAIRYU — WTC-PERS-Q4 : moteur Quête 4 Personnalité
« Le croisement sous nos cartes » — RIO-22.

SPEC : PERS-Q4-SPEC.md (VERROUILLÉE 20/10/2026, délégation fondateur
A1-A6 → (a)×6). Canon : lignes 223-224 (« Q4 Le croisement (à deux,
confirmé) ») · 297-298 (« croisement à 9 configurations, percentiles ») ·
262 (L6 verbatim : percentiles, boucle ≥ 30, styles dissemblables) ·
27 (« Ombre ET lumière structurelles » — à deux : chaque configuration
affiche l'ombre croisée ET les forces des deux rives) · 227-231 (paliers
§5.4, max-niveau) · 257 (RQS INVALIDE) · 260 (L4 nuage) · 263 (L7 RCI) ·
271-273 (objectifs) · 363 (non-évaluation) · 369 (filet avant l'arbre) ·
355-356 (vocabulaire écran).

ZÉRO item nouveau (A2-a) : le moteur ne lit QUE les héritages contresignés
des deux rives — pour chacune : Q1 (patron RIO-19), Q2 (patron RIO-20),
Q3 (patron RIO-21 — produit par le moteur RIO-21 contresigné lui-même,
zéro ré-implémentation). Opérations déjà canoniques : moyenne (ombre
globale), propagation d'incertitude par quadrature (ligne 260), percentiles
sur population de référence (L6, ligne 262).

Machine à états (§4 de la SPEC — filet AVANT l'arbre, ligne 369) :
  1. P-FILTRE (override à deux) : signal Q1 OU P-FILTRE Q2/Q3 sur l'UNE des
     rives → routage ORIENTATION 100 % ; configuration TRACÉE si calculable,
     JAMAIS déployée (hub D-CRISE : jamais de croisement de couple en crise).
  2. QUÊTE_VERROUILLÉE : héritage invalide d'une rive (RQS < 70, ligne 257 —
     Q3 état QUÊTE_VERROUILLÉE / AUCUN_RÉSULTAT) → croisement verrouillé.
  3. CARTE_SEULE_CROISÉ : OMBRE_SUPPRIMÉE d'une rive (Q3 mode CARTE_SEULE) →
     cartes + forces affichées, 0 matrice, 0 invention (§5.5).
  4. CROISEMENT (régulier) : 9 configurations + L6 + palier + inférences.

Précisions de verrouillage déposées au core (pattern Q3) :
- Le niveau de croisement est lu sur l'ombre globale avec son intervalle
  (CI 90 % propagé : SE_og = SEM/2 — moyenne de 4 blocs) ; si l'intervalle
  chevauche une borne → FRONTIÈRE nommée + décision conservatrice (niveau
  bas), pattern L3 (canon ligne 259).
- Le palier de couple suit le max-niveau croisé, une règle zéro exception
  (leçon Q5-A3) ; les paliers individuels hérités restent l'affichage de
  chaque rive (jamais recalculés ici — une mesure un rôle).
- L6 : percentiles sur population de référence fournie par le simulateur
  (seed 42, ≥ 2 000 profils) ; boucle probable si écart de percentiles ≥ 30
  (verbatim ligne 262 — avertissement, jamais un verdict, jamais une
  attribution de rôle) ; styles dissemblables : machinerie L4 transposée aux
  dispersions des 8 faces Q1 (SE d'une dispersion de n = 8 valeurs ≈
  s/√(2(n−1)) — zéro constante nouvelle).
- L7 : RCI 8 semaines posé sur l'ombre globale — SE_diff propagé =
  √2 × SE_og (les deltas FIABLE/SUGGESTION/BRUIT 0,58/0,41 restent
  verbatim ligne 263, même échelle 1-4).
- RQS croisement = min(RQS Q3 des deux rives) − pénalités drapeaux ; le
  drapeau de croisement est la garde mathématique du moteur RIO-21
  (l'ombre globale moyenne de 4 blocs doit rester dans l'intervalle de ses
  blocs — transparence, impossible par construction)."""
import math

# ── Constantes verrouillées — mêmes sources que les moteurs Q1/Q2/Q3 ────────
SIGMA_ITEM = 0.60            # D-PARAM (hub)
SD_POP, ALPHA = 0.65, 0.85   # L2 placeholders canon (hérités Q1/Q2)
SEM = round(SD_POP * math.sqrt(1.0 - ALPHA), 4)          # 0,2517 (Q2)
Z90 = 1.64                    # canon ligne 260
SE_OG = round(SEM / 2.0, 4)   # ombre globale = moyenne de 4 blocs → SEM/2
CI90_OG = round(Z90 * SE_OG, 4)                          # 0,2064
SE_DIFF_OG = round(math.sqrt(2.0) * SE_OG, 4)            # L7 propagé (0,1781)
NIVEAUX = ["DISCRÈTE", "TRANQUILLE", "VIVE", "FORTE"]
SEUILS_NIVEAUX = (1.80, 2.60, 3.20)                      # ligne 259 verbatim
BORNES_CROISEMENT = (2.50, 3.50)                         # A3-a — bornes PROPRES
NIVEAUX_CROISEMENT = ("FAIBLE", "MODÉRÉE", "FORTE")
SEUIL_BOUCLE = 30             # L6 verbatim (ligne 262) — écart de percentiles
SEUIL_RQS_OK = 85
SEUIL_RQS_PRUDENCE = 70                                   # ligne 257 verbatim
PENALITE_DRAPEAU = 20                                     # aligné canon 257
PALIER_VERT = "EXERCICE MAISON"
PALIER_ORANGE = "MODULE DE COUPLE"
PALIER_ROUGE = "ORIENTATION"                              # §5.4 (227-231)
SEUIL_FIABLE = 0.58
SEUIL_SUGGESTION = 0.41     # L7 verbatim (ligne 263)
RE_TEST_SEMAINES = 8         # ligne 274

# ── Les 9 configurations (A5-a — table §2 de la SPEC, mot pour mot) ─────────
CONFIGS = (
    ("LES DEUX OMBRES AU REPOS", "FAIBLE", "FAIBLE",
     "les deux mécanismes discrets — zone calme dite comme telle (§5.5), "
     "rien à fabriquer"),
    ("L'OMBRE D'UN CÔTÉ", "FAIBLE", "MODÉRÉE",
     "le mécanisme profond se déclare d'une seule rive, à intensité modérée"),
    ("L'OMBRE SOLO", "FAIBLE", "FORTE",
     "tout le mécanisme profond porté par une rive — asymétrie affichée en "
     "avertissement, en lecture descriptive"),
    ("L'ÉCHO DE L'AUTRE CÔTÉ", "MODÉRÉE", "FAIBLE",
     "miroir de la 2 — le mot distinct prime sur la symétrie"),
    ("LES DEUX OMBRES EN ÉVEIL", "MODÉRÉE", "MODÉRÉE",
     "les deux mécanismes modérés — le terrain naturel du croisement"),
    ("L'ÉCART DÉCLARÉ", "MODÉRÉE", "FORTE",
     "un écart d'intensité déclaré entre les deux ombres — descriptif causal"),
    ("L'OMBRE SOLO, DE L'AUTRE CÔTÉ", "FORTE", "FAIBLE",
     "miroir de la 3 — unicité des labels prime sur la symétrie"),
    ("L'ÉCART DÉCLARÉ, INVERSÉ", "FORTE", "MODÉRÉE",
     "miroir de la 6"),
    ("LES DEUX OMBRES VIVES", "FORTE", "FORTE",
     "les deux mécanismes forts — palier ORIENTATION par max-niveau "
     "mécanique, vigilance maximale"),
)
NOMS_CONFIGS = tuple(c[0] for c in CONFIGS)
assert len(set(NOMS_CONFIGS)) == 9, "D-NOMENCLATURE : 9 labels uniques"
assert [(c[1], c[2]) for c in CONFIGS] == [
    ("FAIBLE", "FAIBLE"), ("FAIBLE", "MODÉRÉE"), ("FAIBLE", "FORTE"),
    ("MODÉRÉE", "FAIBLE"), ("MODÉRÉE", "MODÉRÉE"), ("MODÉRÉE", "FORTE"),
    ("FORTE", "FAIBLE"), ("FORTE", "MODÉRÉE"), ("FORTE", "FORTE"),
], "matrice 3×3 complète"

# ── Les 3 inférences croisées (A4-a — libellés VERROUILLÉS mot pour mot) ────
INF_CROISEES = {
    "INF-C1": {"nom": "L'orage à deux vitesses",
               "texte": "le conflit ne monte pas au même rythme déclaré des "
                        "deux côtés"},
    "INF-C2": {"nom": "Le mur face au mur",
               "texte": "la descente de garde attend deux gestes — personne "
                        "ne l'offre spontanément"},
    "INF-C3": {"nom": "Le geste qui ouvre",
               "texte": "le geste d'une rive ouvre la porte que l'autre "
                        "tient"},
}

ETAT_CROISEMENT = "CROISEMENT"
ETAT_CARTE_SEULE_CROISE = "CARTE_SEULE_CROISÉ"


# ── Lectures de croisement ───────────────────────────────────────────────────
def niveau_croisement(score):
    """FAIBLE < 2,50 ≤ MODÉRÉE < 3,50 ≤ FORTE (bornes PROPRES A3-a)."""
    if score < BORNES_CROISEMENT[0]:
        return "FAIBLE"
    if score < BORNES_CROISEMENT[1]:
        return "MODÉRÉE"
    return "FORTE"


def lecture_croisement(ombre, ci=CI90_OG):
    """Lecture avec intervalle : FRONTIÈRE nommée si l'intervalle chevauche
    une borne → décision conservatrice (niveau bas) — pattern L3 (ligne 259).
    Retour : (conservateur, frontière|None, bas, haut)."""
    bas = niveau_croisement(round(ombre - ci, 4))
    haut = niveau_croisement(round(ombre + ci, 4))
    if bas == haut:
        return bas, None, bas, haut
    return bas, "FRONTIÈRE", bas, haut


def ombre_globale(her_q2):
    """Moyenne des 4 mécanismes Q2 (A penchant / N orage / R mur / J
    lentille — scores transposés 1,00-4,00). SE propagé = SEM/2 (dépôt)."""
    mec = her_q2.get("mecanismes") if her_q2 else None
    if not mec:
        return None
    scores = [mec[b]["score"] for b in "ANRJ"]
    return round(sum(scores) / 4.0, 4)


def config_of(niv_a, niv_b):
    """Index + nom de la configuration (table §2 — mot pour mot)."""
    for i, (nom, na, nb, _) in enumerate(CONFIGS, start=1):
        if na == niv_a and nb == niv_b:
            return i, nom
    raise ValueError(f"cellule hors matrice : {niv_a} × {niv_b}")


def palier_croise(niv_a, niv_b):
    """Max-niveau croisé — une règle, zéro exception (leçon Q5-A3)."""
    plus_haut = max(niv_a, niv_b, key=NIVEAUX_CROISEMENT.index)
    return {"FAIBLE": PALIER_VERT, "MODÉRÉE": PALIER_ORANGE,
            "FORTE": PALIER_ROUGE}[plus_haut]


def percentile_de(score, ref_sorted):
    """Position percentielle dans la population de référence (L6 — ligne
    262). ref_sorted : liste triée des ombres globales de référence."""
    n = len(ref_sorted)
    lo, hi = 0, n
    while lo < hi:
        mid = (lo + hi) // 2
        if ref_sorted[mid] <= score:
            lo = mid + 1
        else:
            hi = mid
    return round(100.0 * lo / n, 1)


def _style_rive(her_q1):
    """Style de réponse hérité = dispersion des 8 scores de faces Q1
    (échelle 1-4). SE de la dispersion ≈ s/√(2(n−1)), n = 8 — machinerie
    L4 transposée, zéro constante nouvelle."""
    vals = [f["score"] for f in her_q1["faces"].values()]
    n = len(vals)
    mu = sum(vals) / n
    var = sum((v - mu) ** 2 for v in vals) / n
    s = math.sqrt(var)
    se = s / math.sqrt(2.0 * (n - 1)) if n > 1 else 0.0
    return round(s, 4), round(se, 4)


def styles_dissemblables(her_q1_a, her_q1_b):
    """Avertissement L6 (ligne 262) : écart des dispersions ≥
    1,64 × √(SE_a² + SE_b²) — zéro constante nouvelle (L4 transposée)."""
    s_a, se_a = _style_rive(her_q1_a)
    s_b, se_b = _style_rive(her_q1_b)
    seuil = round(Z90 * math.sqrt(se_a ** 2 + se_b ** 2), 4)
    ecart = round(abs(s_a - s_b), 4)
    return {"style_a": s_a, "style_b": s_b, "ecart": ecart, "seuil": seuil,
            "dissemblables": bool(ecart >= seuil and ecart > 0)}


def _bloc_vive(her_q2, bloc):
    mec = her_q2.get("mecanismes") if her_q2 else None
    if not mec:
        return False
    return mec[bloc]["cons"] in ("VIVE", "FORTE")


def _geste_present(her_q2, her_q3):
    """Geste de réparation présent : face R-geste Q2 ≥ VIVE — sinon lumière
    R soutenue (héritage Q3, banque) — sources héritées uniquement."""
    if her_q2.get("gestes") and her_q2["gestes"]["cons"] in ("VIVE", "FORTE"):
        return True
    if her_q3 and her_q3.get("forces") and her_q3["forces"].get("R"):
        return her_q3["forces"]["R"]["conservateur"] in (
            "TRANQUILLE", "VIVE", "FORTE")
    return False


def conditions_inferences(her2_a, her2_b, her3_a, her3_b):
    """Règles des 3 inférences croisées (A4-a — héritages uniquement)."""
    n_a, n_b = _bloc_vive(her2_a, "N"), _bloc_vive(her2_b, "N")
    r_a, r_b = _bloc_vive(her2_a, "R"), _bloc_vive(her2_b, "R")
    ecart_n = None
    if (her2_a.get("mecanismes") and her2_b.get("mecanismes")):
        ecart_n = round(abs(her2_a["mecanismes"]["N"]["score"] -
                            her2_b["mecanismes"]["N"]["score"]), 4)
    gestes_a = _geste_present(her2_a, her3_a)
    gestes_b = _geste_present(her2_b, her3_b)
    return {
        "INF-C1": bool(n_a and n_b and ecart_n is not None and
                       ecart_n >= 1.00),
        "INF-C2": bool(r_a and r_b),
        "INF-C3": bool((gestes_a and r_b) or (gestes_b and r_a)),
        "_ecart_n": ecart_n, "_geste_a": gestes_a, "_geste_b": gestes_b,
    }


def rci_ombre(ombre_base, ombre_rt):
    """L7 (ligne 263 verbatim) posé sur l'ombre globale — SE_diff propagé."""
    if ombre_base is None or ombre_rt is None:
        return None
    delta = round(ombre_rt - ombre_base, 4)
    adelta = abs(delta)
    verdict = ("FIABLE" if adelta >= SEUIL_FIABLE else
               "SUGGESTION" if adelta >= SEUIL_SUGGESTION else "BRUIT")
    return {"delta": delta, "se_diff": SE_DIFF_OG,
            "verdict": verdict, "semaines": RE_TEST_SEMAINES}


def _rqs_rive(h1, h3):
    """RQS effective d'une rive : la plus fine disponible (Q3, sinon Q1)."""
    if h3 and isinstance(h3.get("rqs"), dict) and \
            h3["rqs"].get("rqs") is not None:
        return h3["rqs"]["rqs"]
    return h1.get("rqs", 100.0)


def _sources_force_rive(her_q3):
    """Forces re-affichées d'une rive (héritage Q3 — max 2 principales,
    pattern RIO-13) avec traçabilité des sources (C1)."""
    if not her_q3 or not her_q3.get("forces") or not her_q3.get("principales"):
        return []
    out = []
    for m in her_q3["principales"]:
        f = her_q3["forces"][m]
        out.append({"mec": m, "nom": f["nom"],
                    "conservateur": f["conservateur"],
                    "sources": [(s["origine"], s["cle"])
                                for s in f["sources"]]})
    return out


# ── Croisement d'un couple (machine à états §4 — filet AVANT l'arbre) ───────
def croiser_couple(couple, ref_sorted=None):
    """Lit les héritages contresignés des deux rives (Q1+Q2+Q3 ×2) et
    retourne la lecture croisée. ref_sorted : population de référence
    L6 (percentiles) — fournie par le simulateur (seed 42)."""
    h1a, h2a, h3a = (couple["heritage_a"], couple["heritage2_a"],
                     couple.get("lumiere_a"))
    h1b, h2b, h3b = (couple["heritage_b"], couple["heritage2_b"],
                     couple.get("lumiere_b"))
    base = {"config": None, "config_tracee": None, "palier": None,
            "percentiles": None, "styles": None, "forces_a": None,
            "forces_b": None, "inferences": None, "hierarchie": None,
            "rci": None, "cond_inf": None, "drapeau": False,
            "frontiere": None, "bandeau": None, "paliers_rives": None,
            "mode": None}

    # (1) OVERRIDE filet à deux — signal Q1 OU P-FILTRE Q2/Q3 sur l'UNE des
    # rives (pattern SM-Q4-A4 / EXT-§4) — court-circuit AVANT tout (369)
    src = None
    if h1a.get("signal"):
        src = "Q1 rive A"
    elif h1b.get("signal"):
        src = "Q1 rive B"
    elif h2a.get("etat") == "P-FILTRE" or (h3a and
                                           h3a.get("etat") == "P-FILTRE"):
        src = "Q2/Q3 rive A"
    elif h2b.get("etat") == "P-FILTRE" or (h3b and
                                           h3b.get("etat") == "P-FILTRE"):
        src = "Q2/Q3 rive B"
    if src:
        og_a, og_b = ombre_globale(h2a), ombre_globale(h2b)
        tracee = None
        if og_a is not None and og_b is not None:
            na, _, _, _ = lecture_croisement(og_a)
            nb, _, _, _ = lecture_croisement(og_b)
            idx, nom = config_of(na, nb)
            tracee = {"index": idx, "nom": nom, "niveau_a": na,
                      "niveau_b": nb, "ombre_a": og_a, "ombre_b": og_b,
                      "deployed": False}
        return {**base, "rqs": None,
                "filet": {"filet": True, "voie": "héritée", "source": src},
                "etat": "P-FILTRE", "palier": PALIER_ROUGE,
                "config_tracee": tracee,
                "bandeau": TEMPLATES["filet"].format(
                    source=src, filet_num="3919 (héritée) · 3114 · 15 · 112")}

    # (2) HÉRITAGE_INVALIDE — RQS < 70 d'une rive (ligne 257 : aucun résultat)
    invalide = None
    for rive, h1, h3 in (("A", h1a, h3a), ("B", h1b, h3b)):
        if h1.get("rqs", 100.0) < SEUIL_RQS_PRUDENCE:
            invalide = f"Q1 rive {rive} (RQS {h1.get('rqs')})"
        elif h3 and h3.get("etat") in ("QUÊTE_VERROUILLÉE",
                                       "AUCUN_RÉSULTAT"):
            invalide = f"Q3 rive {rive} ({h3.get('etat')})"
    if invalide:
        return {**base, "rqs": None,
                "filet": {"filet": False, "voie": None, "source": invalide},
                "etat": "QUÊTE_VERROUILLÉE", "palier": None,
                "bandeau": TEMPLATES["verrouillee"]}

    # (3) CARTE_SEULE_CROISÉ — OMBRE_SUPPRIMÉE d'une rive (0 invention §5.5)
    sup_a = (h2a.get("label") == "OMBRE_SUPPRIMÉE" or
             (h3a and h3a.get("mode") == "CARTE_SEULE"))
    sup_b = (h2b.get("label") == "OMBRE_SUPPRIMÉE" or
             (h3b and h3b.get("mode") == "CARTE_SEULE"))
    if sup_a or sup_b:
        rive = "A+B" if (sup_a and sup_b) else ("A" if sup_a else "B")
        rqs_val = round(min(_rqs_rive(h1a, h3a), _rqs_rive(h1b, h3b)))
        return {**base, "rqs": {"rqs": rqs_val, "statut": "OK",
                                "drapeau": False},
                "filet": {"filet": False, "voie": None, "source": None},
                "etat": ETAT_CARTE_SEULE_CROISE,
                "mode": "CARTE_SEULE_CROISÉ", "palier": None,
                "forces_a": _sources_force_rive(h3a),
                "forces_b": _sources_force_rive(h3b),
                "paliers_rives": {"a": h2a.get("palier"),
                                  "b": h2b.get("palier")},
                "bandeau": TEMPLATES["carte_seule"].format(rive=rive)}

    # (4) CROISEMENT régulier — 9 configurations + L6 + palier + inférences
    og_a, og_b = ombre_globale(h2a), ombre_globale(h2b)
    if og_a is None or og_b is None:
        return {**base, "rqs": None,
                "filet": {"filet": False, "voie": None,
                          "source": "ombre indisponible"},
                "etat": "QUÊTE_VERROUILLÉE", "palier": None,
                "bandeau": TEMPLATES["verrouillee"]}
    niv_a, fr_a, bas_a, haut_a = lecture_croisement(og_a)
    niv_b, fr_b, bas_b, haut_b = lecture_croisement(og_b)
    idx, nom = config_of(niv_a, niv_b)
    palier = palier_croise(niv_a, niv_b)
    frontiere = ({"rive": "A", "bas": bas_a, "haut": haut_a} if fr_a else
                 {"rive": "B", "bas": bas_b, "haut": haut_b} if fr_b
                 else None)
    # L4 nuage sur l'écart des ombres (hiérarchie seulement si écart ≥ seuil)
    ecart = round(abs(og_a - og_b), 4)
    seuil_h = round(Z90 * math.sqrt(2.0) * SE_OG, 4)
    if ecart >= seuil_h:
        hierarchie = {"type": "HIÉRARCHIE DÉCLARABLE",
                      "cote": "A" if og_a > og_b else "B",
                      "ecart": ecart, "seuil": seuil_h}
    else:
        hierarchie = {"type": "NUAGE", "cote": None, "ecart": ecart,
                      "seuil": seuil_h}
    # L6 — percentiles + boucle + dissemblance
    percentiles = None
    if ref_sorted is not None:
        p_a = percentile_de(og_a, ref_sorted)
        p_b = percentile_de(og_b, ref_sorted)
        ecart_p = round(abs(p_a - p_b), 1)
        percentiles = {"a": p_a, "b": p_b, "ecart": ecart_p,
                       "boucle": bool(ecart_p >= SEUIL_BOUCLE),
                       "seuil_boucle": SEUIL_BOUCLE}
    styles = styles_dissemblables(h1a, h1b)
    cond = conditions_inferences(h2a, h2b, h3a, h3b)
    inferences = [{"regle": rid, "nom": INF_CROISEES[rid]["nom"],
                   "texte": INF_CROISEES[rid]["texte"]}
                  for rid in ("INF-C1", "INF-C2", "INF-C3") if cond[rid]]
    cond_pub = {k: v for k, v in cond.items() if not k.startswith("_")}
    # RCI 8 semaines sur l'ombre globale (re-tests hérités si présents)
    og_a_rt = ombre_globale(couple.get("heritage2_a_rt")) \
        if couple.get("heritage2_a_rt") else None
    og_b_rt = ombre_globale(couple.get("heritage2_b_rt")) \
        if couple.get("heritage2_b_rt") else None
    if og_a_rt is not None or og_b_rt is not None:
        rci = {"a": rci_ombre(og_a, og_a_rt) if og_a_rt is not None else None,
               "b": rci_ombre(og_b, og_b_rt) if og_b_rt is not None else None}
    else:
        rci = None
    # RQS croisement = min(RQS des deux rives) − pénalités drapeaux
    drapeau = False
    for og, h2 in ((og_a, h2a), (og_b, h2b)):
        scores = [h2["mecanismes"][b]["score"] for b in "ANRJ"]
        if not (min(scores) - 1e-9 <= og <= max(scores) + 1e-9 and
                1.0 - 1e-9 <= og <= 4.0 + 1e-9):
            drapeau = True          # garde mathématique (moyenne ⊆ blocs)
    rqs_val = round(min(_rqs_rive(h1a, h3a), _rqs_rive(h1b, h3b)) -
                    (PENALITE_DRAPEAU if drapeau else 0))
    statut = ("OK" if rqs_val >= SEUIL_RQS_OK else
              "PRUDENCE" if rqs_val >= SEUIL_RQS_PRUDENCE else "INVALIDE")
    out = {**base, "rqs": {"rqs": rqs_val, "statut": statut,
                           "drapeau": drapeau},
           "filet": {"filet": False, "voie": None, "source": None},
           "etat": ETAT_CROISEMENT, "mode": "COMPLET",
           "config": {"index": idx, "nom": nom, "niveau_a": niv_a,
                      "niveau_b": niv_b, "ombre_a": og_a, "ombre_b": og_b,
                      "lecture": CONFIGS[idx - 1][3]},
           "palier": palier, "frontiere": frontiere,
           "percentiles": percentiles, "styles": styles,
           "forces_a": _sources_force_rive(h3a),
           "forces_b": _sources_force_rive(h3b),
           "inferences": inferences, "cond_inf": cond_pub,
           "hierarchie": hierarchie, "rci": rci,
           "paliers_rives": {"a": h2a.get("palier"),
                             "b": h2b.get("palier")}}
    bandeau = None
    if statut == "PRUDENCE":
        bandeau = TEMPLATES["prudence"].format(rqs=rqs_val)
    warnings = []
    if percentiles and percentiles["boucle"]:
        warnings.append(TEMPLATES["boucle"].format(ecart=percentiles["ecart"]))
    if styles["dissemblables"]:
        warnings.append(TEMPLATES["dissemblance"])
    if frontiere:
        warnings.append(TEMPLATES["frontiere"].format(
            rive=frontiere["rive"], bas=frontiere["bas"]))
    if warnings:
        bandeau = (bandeau + " " if bandeau else "") + " ".join(warnings)
    out["bandeau"] = bandeau
    return out


# ── Templates d'affichage (autoporteurs, C5/C6 — vocabulaire écran 355-356) ──
TEMPLATES = {
    "titre": "Le croisement sous nos cartes — lecture à deux (déclarée)",
    "config": "Configuration du croisement : {nom} — ombre rive A {niv_a} "
              "({og_a}) · ombre rive B {niv_b} ({og_b})",
    "lecture": "{lecture}",
    "palier": "Palier de couple (max-niveau) : {palier}",
    "paliers_rives": "Paliers hérités (affichés sans recalcul) : rive A "
                     "{pa} · rive B {pb}",
    "forces": "Forces héritées — rive A : {fa} · rive B : {fb}",
    "aucune_force": "aucune force soutenue par les réponses — dite sans "
                    "invention (§5.5)",
    "inference": "Proposition (contestable — « ça te ressemble ? ») : "
                 "{nom} — {texte}",
    "frontiere": "FRONTIÈRE : l'intervalle de l'ombre rive {rive} chevauche "
                 "une borne — décision conservatrice ({bas})",
    "boucle": "L6 — boucle probable : écart de percentiles {ecart} ≥ 30 "
              "(avertissement, jamais un verdict, jamais une attribution)",
    "dissemblance": "L6 — styles de réponse dissemblables : la lecture "
                    "corrigée par percentiles s'affiche (avertissement)",
    "percentiles": "L6 — positions percentielles : rive A {pa} · rive B {pb} "
                   "— écart {ecart}",
    "hierarchie_nuage": "L4 — nuage : l'écart des ombres ({ecart}) ne permet "
                        "pas de hiérarchie (seuil {seuil})",
    "hierarchie_hi": "L4 — hiérarchie déclarable : ombre rive {cote} plus "
                     "forte (écart {ecart} ≥ {seuil}) — descriptif "
                     "déclaratif",
    "rci": "L7 — re-test à {semaines} semaines : rive {rive} {verdict} "
           "(Δ {delta}, SE_diff {se_diff})",
    "filet": "D-CRISE — signal de sécurité hérité ({source}) : croisement "
             "routé ORIENTATION (le chemin le plus court, pas un échec) — "
             "l'aide d'abord : {filet_num}",
    "verrouillee": "Croisement verrouillé : l'une des deux cartes n'est pas "
                   "valide (RQS < 70) — on ne croise pas une carte invalide.",
    "carte_seule": "Croisement limité : l'ombre de la rive {rive} est "
                   "supprimée (convergence 0,00) — cartes et forces "
                   "affichées, aucune matrice inventée.",
    "prudence": "Lecture en prudence (RQS croisement {rqs} < 85) — à lire "
                "avec précaution.",
    "bandeau_sim": "BANDEAU D-SIM — simulation (univers 650 couples, "
                   "14 groupes, seed 42 ×2) : lecture mécanique de patrons "
                   "simulés, jamais une observation réelle.",
}
