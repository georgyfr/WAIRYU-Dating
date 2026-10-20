# -*- coding: utf-8 -*-
"""WAIRYU — WTC-PERS-Q3 : moteur Quête 3 Personnalité
« La lumière sous ma carte » — RIO-21 cible (forces dérivées).

SPEC VERROUILLÉE (présent dépôt) — tranchages A1-A6 par délégation fondateur
20/10/2026 (« je te laisse le choix de trancher mais j'espere qutu pousse tout
progressivement sur github ») — pattern Q1/Q2, choix (a)×6 :
A1 titre « La lumière sous ma carte » · A2 dérivation pure — ZÉRO item nouveau
(héritage double Q1+Q2, opérations déjà canoniques : moyenne de scores
hérités, inversion 3 − raw, propagation 1,64 × √(SE²+SE²)) · A3 banque 8
forces (4 PLEINES + 4 CALMES §5.5), max 2 principales (pattern RIO-13) ·
A4 L5 en Q3 (empreinte par matrice de règles déterministes + 3 inférences
nommées canon), L6 « Couple par PERCENTILES » reportée à Q4 (objet couple —
divergence avec l'annotation A4 Q1 documentée D-HIST) · A5 filet hérité
uniquement (zéro voie détectée nouvelle) · A6 L1 adapté (RQS lumière =
min(RQS héritages) + drapeaux de cohérence de dérivation), L3 verbatim,
L4 nuage lumière, L7 RCI 8 semaines posée sur les 4 lumières, paliers
hérités affichés SANS recalcul (leçon Q5-A3).

Canon (programme wairyu couple.txt) : ligne 223 « Q3 La lumière (forces
dérivées) » · ligne 27 « Ombre ET lumière structurelles : chaque résultat
contient les deux — tirés des vraies réponses, jamais fabriqués » · ligne 261
L5 « Empreinte situationnelle (croisement Q1×Q2) + 3 inférences non-évidentes
(alarme intérieure, mains libres, le près coûte) » · ligne 262 L6 (reportée
Q4) · ligne 270 « chacune avec ombre ET force affichées » · §5.5 anti-
fabrication DOUBLE SENS (233-237 : « force silencieuse = dit sans invention »)
· L3 ligne 259 verbatim (Discrète < 1,80 ≤ Tranquille < 2,60 ≤ Vive < 3,20 ≤
Forte) · L4 ligne 260 (hiérarchie si écart ≥ 1,64 × √(SE²+SE²) — sinon nuage)
· L7 ligne 263 · re-test 8 semaines ligne 274 · « effet de reconnaissance ≥
70 % (« ça te ressemble ? ») » lignes 272-273 · filet ligne 369 · vocabulaire
écran 355-356 · jamais le partenaire ni les tiers (ligne 363). Héritages =
sorties contresignées RIO-19 (SHA 3b1a7490…) et RIO-20 (SHA 6d9b3c59…).
Les mots canon « névrosisme », « narcissisme », « jalousie » ne sont JAMAIS
affichés (C6, hérité de Q1/Q2) ; la lumière est un penchant favorable décrit —
jamais un trait figé, jamais un mérite moral (C6 double sens).

Règles de dérivation VERROUILLÉES (précision d'implémentation, LIBRE §9) :
- Force = moyenne des scores de ses DEUX sources (intervalles propagés :
  SE_force = √(SE1²+SE2²)/2, CI90 = 1,64 × SE_force) ; lecture L3 verbatim,
  FRONTIÈRE conservatrice (niveau bas) ; soutenue ⟺ conservateur ≥ TRANQUILLE
  (sinon mention calme §5.5 — « rien à fabriquer »).
- J (type CALME) : « La main ouverte » affichée ⟺ conservateur == DISCRÈTE
  (absence décrite — jamais une preuve de confiance) ; chaîne J lisible
  (≥ TRANQUILLE) → silence J (zéro lumière réclamée, §5.5).
- Empreinte (matrice nommée — pattern RIO-12) : règle EMP-x feu ⟺ face carte
  dédiée ≥ VIVE ET bloc ombre même lettre ≥ VIVE (croisement des VRAIES
  réponses, bande exclue du décompte — tableau de robustesse). Faces carte
  dédiées : N1 (la montée) pour EMP-N · AO2 (vers l'autre) pour EMP-A ·
  R2 (l'autre face réparation) pour EMP-R · J2 (la vérification) pour EMP-J —
  découplage d'avec les sources des forces (granularité fine des faces).
- Inférences (noms canon verbatim, ligne 261) : INF-1 « Alarme intérieure » ⟺
  ombre N ≥ VIVE ET carte face N1 (la montée) ≥ VIVE ET ombre N-retour ≤
  TRANQUILLE (l'alerte monte avant les faits) · INF-2 « Mains libres » ⟺ ombre
  J ≤ TRANQUILLE ET carte axe J ≤ TRANQUILLE ET ombre R-geste ≥ VIVE ·
  INF-3 « Le près coûte » ⟺ ombre R ≥ VIVE ET ombre R-geste ≥ VIVE. Affichage
  en PROPOSITION contestable : « ça te ressemble ? » (lignes 272-273).
- Mode CARTE_SEULE (héritage OMBRE_SUPPRIMÉE) : dérivation des sources Q1
  seule (SE face Q1), bandeau « dérivation limitée », 0 empreinte, 0
  inférence — jamais d'invention pour combler (§5.5).
- Palier hérité affiché tel quel (identité vérifiée C1) ; P-FILTRE →
  ORIENTATION (pattern Q2)."""
import math

# ── Constantes verrouillées — ZÉRO constante nouvelle ────────────────────────
SIGMA_ITEM = 0.60            # D-PARAM (hub) — bruit items (Q1/Q2)
SD_POP, ALPHA = 0.65, 0.85   # L2 placeholders canon (hérités Q1/Q2)
SEM = round(SD_POP * math.sqrt(1.0 - ALPHA), 4)          # 0.2517 (Q2)
Z90 = 1.64                    # canon ligne 260
CI90_Q2 = round(Z90 * SEM, 4)                            # 0.4128 (Q2 blocs)
NIVEAUX = ["DISCRÈTE", "TRANQUILLE", "VIVE", "FORTE"]
SEUILS_NIVEAUX = (1.80, 2.60, 3.20)                      # ligne 259 verbatim
SEUIL_RQS_OK = 85
SEUIL_RQS_PRUDENCE = 70                                   # ligne 257 verbatim
STATUTS_RQS = ("OK", "PRUDENCE", "INVALIDE")
INDEX_PRUDENCE = 0.50        # convergence CV (héritage Q2 verrouillé)
PENALITE_DRAPEAU = 20        # A6-a drapeaux (aligné pénalités canon 257)
PALIER_VERT = "EXERCICE MAISON"
PALIER_ORANGE = "MODULE DE COUPLE"
PALIER_ROUGE = "ORIENTATION"                              # §5.4 (227-231)
SEUIL_FIABLE = 0.58
SEUIL_SUGGESTION = 0.41     # L7 verbatim (ligne 263, RCI)
RE_TEST_SEMAINES = 8         # ligne 274

# SE des sources héritées (patrons contresignés — modèles Q1/Q2 verrouillés)
SE_Q1_FACE = round(SIGMA_ITEM / math.sqrt(3.0), 4)        # 0,3464 (3 items)
SE_Q1_AXIS = round(SIGMA_ITEM / math.sqrt(6.0), 4)        # 0,2449 (6 items)
CI_Q1_AXIS = round(Z90 * SE_Q1_AXIS, 4)                   # 0,4017
SE_Q2_FACE = {"A_part": round(SEM / math.sqrt(3.0), 4),   # 0,1453 (3 cochés)
              "N_retour": round(SEM, 4),                  # 0,2517 (1 item)
              "R_geste": round(SEM / math.sqrt(2.0), 4)}  # 0,1780 (2 items)

# ── Banque de forces (A3-a — 4 PLEINES + 4 CALMES, 2 par mécanisme) ──────────
FORCES_PLEINES = {"A": "La part reconnue", "N": "Le retour qui tient",
                  "R": "Le geste qui répare", "J": "La main ouverte"}
FORCES_CALMES = {"A": "Le crédit juste", "N": "Le calme qui porte",
                 "R": "Le terrain de travail", "J": "La lentille au repos"}
SOURCES = {  # (origine, clé) — « tirés des vraies réponses » (traçabilité C1)
    "A": [("Q1", "AO1"), ("Q2", "A_part")],
    "N": [("Q1", "N2"), ("Q2", "N_retour")],
    "R": [("Q1", "R1"), ("Q2", "R_geste")],
    "J": [("Q1", "J1"), ("Q1", "J2")],   # type CALME — absence décrite (§5.5)
}
CORPS_FORCE = {
    "A": "quand ça coince, ta part dans l'histoire se voit et se dit — elle est reconnue, pas devinée",
    "N": "ça monte, et ça redescend — ton retour au calme est là, il tient",
    "R": "après le conflit, le geste de réparation arrive — il porte",
    "J": "la vérification ne tourne pas en boucle chez toi — absence décrite, jamais une preuve de confiance",
}
CORPS_CALME = {
    "A": "ta part reste tranquille en ce moment — rien à fabriquer",
    "N": "ton retour au calme est tranquille en ce moment — rien à fabriquer",
    "R": "terrain de travail, pas un verdict — et si la zone est calme, rien à fabriquer",
    "J": "la lentille est au repos — rien à fabriquer",
}


def se_force(mec):
    """SE d'une force = √(SE1²+SE2²)/2 (moyenne de 2 sources indépendantes)."""
    ses = [SE_Q1_FACE if o == "Q1" else SE_Q2_FACE[k] for o, k in SOURCES[mec]]
    return round(math.sqrt(sum(s * s for s in ses)) / len(ses), 4)


SE_FORCE = {m: se_force(m) for m in "ANRJ"}
CI_FORCE = {m: round(Z90 * SE_FORCE[m], 4) for m in "ANRJ"}
SEUIL_HIERARCHIE = {   # canon ligne 260 verbatim, appliqué aux forces
    "".join(sorted(p)): round(Z90 * math.sqrt(SE_FORCE[p[0]] ** 2 + SE_FORCE[p[1]] ** 2), 4)
    for p in (("A", "N"), ("A", "R"), ("A", "J"), ("N", "R"), ("N", "J"),
              ("R", "J"))
}

# ── Matrice d'empreinte situationnelle (A4-a — pattern RIO-12) ───────────────
EMPREINTE_REGLES = {
    "EMP-N": {"nom": "La vague qui retombe lentement",
              "texte": "quand ça monte chez toi, ça monte vite et retombe lentement — voilà ce qui t'arrive quand un conflit arrive",
              "carte_face": "N1", "ombre_bloc": "N"},
    "EMP-A": {"nom": "La part qui s'efface",
              "texte": "quand ça coince, l'explication se cherche d'abord dehors — ta part passe sous silence sans que tu t'en rendes compte",
              "carte_face": "AO2", "ombre_bloc": "A"},
    "EMP-R": {"nom": "Le mur après le conflit",
              "texte": "après le conflit, le mur se dresse avant la réparation — voilà ce qui se passe chez toi",
              "carte_face": "R2", "ombre_bloc": "R"},
    "EMP-J": {"nom": "La vérification qui appelle la vérification",
              "texte": "l'ambiguïté te met en alerte et la vérification appelle la vérification — voilà le cercle",
              "carte_face": "J1", "ombre_bloc": "J"},
}
# ── Les 3 inférences non-évidentes (noms canon verbatim, ligne 261) ──────────
INFERENCES_REGLES = {
    "INF-1": {"nom": "Alarme intérieure",
              "texte": "l'alerte monte avant les faits — ce n'est pas la situation, c'est l'anticipation",
              "sources": ["ombre N ≥ VIVE", "carte face N1 (la montée) ≥ VIVE",
                          "ombre N-retour ≤ TRANQUILLE"]},
    "INF-2": {"nom": "Mains libres",
              "texte": "ce que tu laisses libre à l'autre te revient",
              "sources": ["ombre J ≤ TRANQUILLE", "carte axe J ≤ TRANQUILLE",
                          "ombre geste de réparation ≥ VIVE"]},
    "INF-3": {"nom": "Le près coûte",
              "texte": "la proximité te coûte et tu la payes quand même",
              "sources": ["ombre R ≥ VIVE", "ombre geste de réparation ≥ VIVE"]},
}

# ── États / nomenclature (D-NOMENCLATURE — libellés DISTINCTS) ───────────────
ETAT_LUMIERE = "LUMIÈRE"
ETAT_CARTE_SEULE = "CARTE_SEULE"
NOMENCLATURE = (NIVEAUX + [PALIER_VERT, PALIER_ORANGE, PALIER_ROUGE,
                           "NUAGE", "HIÉRARCHIE DÉCLARABLE", "NIVEAU",
                           "FRONTIÈRE"] + list(STATUTS_RQS)
                + ["FIABLE", "SUGGESTION", "BRUIT", "P-FILTRE",
                   "PLEINE", "CALME", "COMPLET", "CARTE_SEULE",
                   ETAT_LUMIERE, ETAT_CARTE_SEULE, "QUÊTE_VERROUILLÉE",
                   "AUCUN_RÉSULTAT"]
                + list(FORCES_PLEINES.values())
                + list(FORCES_CALMES.values())
                + [r["nom"] for r in EMPREINTE_REGLES.values()]
                + [r["nom"] for r in INFERENCES_REGLES.values()]
                + list(EMPREINTE_REGLES) + list(INFERENCES_REGLES))


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


# ═══════════════════ Lecture des héritages (patrons contresignés) ═════════════
def _face_q1(her_q1, cle):
    f = her_q1["faces"][cle]
    return round(float(f["score"]), 4), f["cons"]


def _face_q2(her_q2, cle):
    f = her_q2["faces_lumiere"][cle]
    return round(float(f["score"]), 4), f["cons"]


def _sources_force(her_q1, her_q2, mec, carte_seule=False):
    """Scores des sources d'une force — (origine, clé, score, cons).
    Mode carte-seule : seules les sources Q1 sont lues (dérivation limitée)."""
    out = []
    for origine, cle in SOURCES[mec]:
        if carte_seule and origine != "Q1":
            continue
        if origine == "Q1":
            s, c = _face_q1(her_q1, cle)
        else:
            s, c = _face_q2(her_q2, cle)
        out.append({"origine": origine, "cle": cle, "score": s, "cons": c})
    return out


def _lecture_force(mec, sources):
    """Score = moyenne des sources ; CI propagé (quadrature, ligne 260) ;
    lecture L3 verbatim, FRONTIÈRE conservatrice."""
    se = SE_FORCE[mec] if len(sources) == 2 else SE_Q1_FACE
    score = round(sum(s["score"] for s in sources) / len(sources), 4)
    ci = round(Z90 * se, 4)
    bas, haut = round(score - ci, 4), round(score + ci, 4)
    return {"score": score, "ci90": [bas, haut],
            **lecture_L3(score, bas, haut)}


def _conditions_emp(her_q1, her_q2):
    """État observé des conditions d'empreinte : face carte ≥ VIVE ET
    bloc ombre même lettre ≥ VIVE (matrice nommée — pattern RIO-12)."""
    cond = {}
    for rid, r in EMPREINTE_REGLES.items():
        _, cons_face = _face_q1(her_q1, r["carte_face"])
        bloc = her_q2["mecanismes"][r["ombre_bloc"]]["cons"]
        cond[rid] = (cons_face in ("VIVE", "FORTE")
                     and bloc in ("VIVE", "FORTE"))
    return cond


def _conditions_inf(her_q1, her_q2):
    """État observé des conditions des 3 inférences (règles verrouillées)."""
    n_retour = her_q2["faces_lumiere"]["N_retour"]["cons"]
    geste = her_q2["gestes"]["cons"]
    return {
        "INF-1": (her_q2["mecanismes"]["N"]["cons"] in ("VIVE", "FORTE")
                  and her_q1["faces"]["N1"]["cons"] in ("VIVE", "FORTE")
                  and n_retour in ("DISCRÈTE", "TRANQUILLE")),
        "INF-2": (her_q2["mecanismes"]["J"]["cons"] in ("DISCRÈTE", "TRANQUILLE")
                  and her_q1["axes"]["J"]["cons"] in ("DISCRÈTE", "TRANQUILLE")
                  and geste in ("VIVE", "FORTE")),
        "INF-3": (her_q2["mecanismes"]["R"]["cons"] in ("VIVE", "FORTE")
                  and geste in ("VIVE", "FORTE")),
    }


def _derive_forces(her_q1, her_q2, carte_seule):
    """Les 4 lumières dérivées (banque A3-a) + drapeau de cohérence (A6-a)."""
    forces, drapeau = {}, False
    for m in "ANRJ":
        sources = _sources_force(her_q1, her_q2, m, carte_seule)
        lec = _lecture_force(m, sources)
        forces[m] = {**lec, "sources": sources,
                     "nom": FORCES_PLEINES[m],
                     "type_force": "CALME" if m == "J" else "PLEINE"}
        lo = min(s["score"] for s in sources) - 1e-9
        hi = max(s["score"] for s in sources) + 1e-9
        if not (lo <= lec["score"] <= hi):     # garde — mathématiquement
            drapeau = True                     # impossible (moyenne ⊆ sources)
    return forces, drapeau


# ═══════════════════ Dérivation d'une rive (A2-a : zéro item nouveau) ════════
def deriver_rive(her_q1, her_q2, her_q1_rt=None, her_q2_rt=None):
    """Lumière d'une rive. Ordre : (1) filet hérité — court-circuit AVANT tout
    (A5-a, ligne 369) ; (2) héritage Q1 invalide — quête verrouillée (C7) ;
    (3) RQS lumière INVALIDE — aucun résultat ; (4) mode (complet /
    carte-seule) ; (5) forces (banque 8, max 2 principales), empreinte,
    inférences, RCI sur les 4 lumières, palier hérité sans recalcul."""
    # (1) filet hérité — Q1 signal OU Q2 P-FILTRE
    if her_q1.get("signal") or her_q2.get("etat") == "P-FILTRE":
        source = "Q1" if her_q1.get("signal") else "Q2"
        return {"rqs": None, "filet": {"filet": True, "voie": "héritée",
                                       "source": source},
                "etat": "P-FILTRE", "mode": None, "palier": PALIER_ROUGE,
                "forces": None, "principales": None, "mentions": None,
                "calmes": None, "j_affichee": None, "hierarchie": None,
                "empreinte": None, "inferences": None, "rci": None,
                "cond_emp": None, "cond_inf": None,
                "bandeau": TEMPLATES["filet"].format(
                    source=source,
                    filet_num="3919 (héritée) · 3114 · 15 · 112")}
    # (2) héritage Q1 invalide — on ne dérive rien d'une carte invalide
    if her_q1.get("rqs", 100.0) < SEUIL_RQS_PRUDENCE:
        return {"rqs": None,
                "filet": {"filet": False, "voie": None, "source": None},
                "etat": "QUÊTE_VERROUILLÉE", "mode": None, "palier": None,
                "forces": None, "principales": None, "mentions": None,
                "calmes": None, "j_affichee": None, "hierarchie": None,
                "empreinte": None, "inferences": None, "rci": None,
                "cond_emp": None, "cond_inf": None,
                "bandeau": TEMPLATES["verrouillee"]}
    # (3) RQS lumière = min(RQS héritages) + drapeaux (A6-a)
    carte_seule = her_q2.get("label") == "OMBRE_SUPPRIMÉE"
    forces, drapeau = _derive_forces(her_q1, her_q2, carte_seule)
    rqs_val = min(her_q1.get("rqs", 100.0), her_q2.get("rqs", 100.0))
    if drapeau:
        rqs_val -= PENALITE_DRAPEAU
    rqs_val = round(rqs_val)
    statut = "OK" if rqs_val >= SEUIL_RQS_OK else (
        "PRUDENCE" if rqs_val >= SEUIL_RQS_PRUDENCE else "INVALIDE")
    if statut == "INVALIDE":
        return {"rqs": {"rqs": rqs_val, "statut": statut, "drapeau": drapeau},
                "filet": {"filet": False, "voie": None, "source": None},
                "etat": "AUCUN_RÉSULTAT", "mode": None, "palier": None,
                "forces": None, "principales": None, "mentions": None,
                "calmes": None, "j_affichee": None, "hierarchie": None,
                "empreinte": None, "inferences": None, "rci": None,
                "cond_emp": None, "cond_inf": None,
                "bandeau": TEMPLATES["invalide"].format(rqs=rqs_val)}
    # (4) affichage : principales (max 2, pattern RIO-13), mentions, calmes
    etat = ETAT_CARTE_SEULE if carte_seule else ETAT_LUMIERE
    mode = "CARTE_SEULE" if carte_seule else "COMPLET"
    soutien = [m for m in "ANRJ" if forces[m]["conservateur"]
               in ("TRANQUILLE", "VIVE", "FORTE")]
    ordre = sorted(soutien, key=lambda m: (-forces[m]["score"], m))
    principales, mentions = ordre[:2], ordre[2:]
    calmes = [m for m in "ANR" if m not in soutien]
    j_force = forces["J"]
    j_affichee = j_force["conservateur"] == "DISCRÈTE"
    # absence décrite (§5.5) si DISCRÈTE ; chaîne lisible → silence J
    hierarchie = None
    if len(principales) == 2:
        m1, m2 = principales
        ecart = round(abs(forces[m1]["score"] - forces[m2]["score"]), 4)
        seuil = SEUIL_HIERARCHIE["".join(sorted((m1, m2)))]
        if ecart >= seuil:
            dom = m1 if forces[m1]["score"] > forces[m2]["score"] else m2
            hierarchie = {"type": "HIÉRARCHIE DÉCLARABLE", "dominante": dom,
                          "ecart": ecart, "seuil": seuil}
        else:
            hierarchie = {"type": "NUAGE", "dominante": None,
                          "ecart": ecart, "seuil": seuil}
    # (5) empreinte + inférences — mode complet uniquement (0 invention)
    if carte_seule:
        empreinte, inferences, cond_e, cond_i = [], [], {}, {}
    else:
        cond_e = _conditions_emp(her_q1, her_q2)
        cond_i = _conditions_inf(her_q1, her_q2)
        empreinte = [{"regle": rid, "nom": EMPREINTE_REGLES[rid]["nom"],
                      "texte": EMPREINTE_REGLES[rid]["texte"]}
                     for rid in ("EMP-N", "EMP-A", "EMP-R", "EMP-J")
                     if cond_e[rid]]
        inferences = [{"regle": rid, "nom": INFERENCES_REGLES[rid]["nom"],
                       "texte": INFERENCES_REGLES[rid]["texte"]}
                      for rid in ("INF-1", "INF-2", "INF-3") if cond_i[rid]]
    # RCI 8 semaines posé sur les 4 lumières (A6-a)
    rci = None
    if her_q1_rt is not None and her_q2_rt is not None:
        forces_rt, _ = _derive_forces(her_q1_rt, her_q2_rt, carte_seule)
        rci = {}
        for m in "ANRJ":
            r = rci_de(forces[m]["score"], forces_rt[m]["score"])
            rci[m] = {**r, "base_niveau": forces[m]["conservateur"],
                      "re_niveau": forces_rt[m]["conservateur"],
                      "nom": FORCES_PLEINES[m]}
    return {"rqs": {"rqs": rqs_val, "statut": statut, "drapeau": drapeau},
            "filet": {"filet": False, "voie": None, "source": None},
            "etat": etat, "mode": mode,
            "palier": her_q2.get("palier"),       # hérité, sans recalcul
            "forces": forces, "principales": principales,
            "mentions": mentions, "calmes": calmes,
            "j_affichee": j_affichee, "hierarchie": hierarchie,
            "empreinte": empreinte, "inferences": inferences,
            "rci": rci, "cond_emp": cond_e, "cond_inf": cond_i,
            "bandeau": (TEMPLATES["carte_seule"] if carte_seule else None)}


def deriver_couple(couple):
    """Lumière des deux rives d'un couple (pattern Q2)."""
    a = deriver_rive(couple["heritage_a"], couple["heritage2_a"],
                     couple.get("heritage_a_rt"), couple.get("heritage2_a_rt"))
    b = deriver_rive(couple["heritage_b"], couple["heritage2_b"],
                     couple.get("heritage_b_rt"), couple.get("heritage2_b_rt"))
    return {"rive_a": a, "rive_b": b}


# ═══════════════════ Templates d'affichage (autoporteurs, C5/C6) ══════════════
TEMPLATES = {
    "intro": "Ce qui te porte, tiré de tes vraies réponses — des penchants favorables, décrits : jamais un trait figé, jamais un mérite moral.",
    "zone_force": "Ta zone de force, tirée de tes vraies réponses : {forces}.",
    "force": "{nom} ({conservateur}) — {corps}",
    "mention": "{nom} ({conservateur}) — en mention, sans hiérarchie réclamée",
    "calme": "{nom} : {corps}",
    "empreinte": "Quand tes réponses se croisent : {texte} — descriptif causal, sans étiquette.",
    "inference": "{nom} — {texte}. Ça te ressemble ? À toi de valider ou de contester : une proposition, jamais un fait.",
    "nuage": "Tes deux forces principales sont au même niveau — nuage : la mesure ne départage pas (anti-surinterprétation).",
    "hierarchie": "{dominante} ressort de façon déclarable — les deux se tiennent.",
    "palier_vert": "Palier 🟢 EXERCICE MAISON : une petite pratique à soi — si la zone est calme, rien à fabriquer.",
    "palier_orange": "Palier 🟠 MODULE DE COUPLE : un temps à deux sous la mécanique.",
    "palier_rouge": "Palier 🔴 ORIENTATION : le chemin le plus court, pas un échec.",
    "carte_seule": "Dérivation limitée : ton ombre ne soutient pas la lecture — la lumière se dérive de ta carte seule (jamais d'invention pour combler).",
    "prudence_rqs": "Qualité de réponse PRUDENCE ({rqs}/100) — la lumière reste lisible, avec prudence.",
    "invalide": "Réponses de qualité insuffisante (RQS {rqs}/100) — aucun résultat affiché.",
    "verrouillee": "Aucune lumière ne se dérive sans carte valide : reprends d'abord ta carte.",
    "filet": "Un signal de sécurité est présent dans tes réponses héritées ({source}) — le filet s'ouvre avant tout : P-FILTRE — {filet_num}. La lumière n'est pas affichée.",
    "rci_fiable": "UN CHANGEMENT FIABLE depuis la base (re-test 8 semaines, |Δ| ≥ 0,58) : {nom}.",
    "rci_suggestion": "UNE PISTE À CONFIRMER (|Δ| entre 0,41 et 0,58) : {nom}.",
    "rci_bruit": "DANS LE BRUIT DE LA MESURE (|Δ| < 0,41) — rien à conclure : {nom}.",
    "re_test_programme": "Re-test programmé à 8 semaines (ligne 274).",
    "bandeau_sim": "Simulation D-SIM — couples fictifs, zéro donnée réelle.",
}

MOTS_INTERDITS_C6 = ("névrosisme", "narcissisme", "jalousie", "diagnostic",
                     "dépistage", "pathologie", "fautif", "coupable",
                     "anormal", "toxique", "pervers", "déséquilibré")
VERBATIM_CALME = "rien à fabriquer"
VERBATIM_REPARATION = "terrain de travail, pas un verdict"
VERBATIM_LUMIERE = "jamais un trait figé, jamais un mérite moral"
VERBATIM_RECONNAISSANCE = "Ça te ressemble ?"


# ═══════════════════ D-TABLE (C1 — cas exhaustifs, règles prouvées) ═══════════
def _dt_h1(faces, rqs=95.0, signal=False):
    """Héritage Q1 de table — cons par la convention patron (niveau bas)."""
    f = {k: {"score": s, "cons": niveau_ponctuel(round(s - SE_Q1_FACE, 4))}
         for k, s in faces.items()}
    axes = {}
    for axe in ("AO", "N", "R", "J"):
        s = round((f[axe + "1"]["score"] + f[axe + "2"]["score"]) / 2.0, 4)
        axes[axe] = {"score": s, "cons": niveau_ponctuel(round(s - CI_Q1_AXIS, 4))}
    return {"rqs": rqs, "signal": signal, "axes": axes, "faces": f}


def _dt_h2(mec=None, part=1.0, retour=1.0, geste=1.0, axe_j=1.0, rqs=95.0,
           label=None, palier=PALIER_VERT, etat="OMBRE"):
    """Héritage Q2 de table — mecanismes : dict bloc → score ; faces lumière
    et gestes par score ; axe_j : score de l'axe J carte (INF-2)."""
    mec = mec or {"A": 1.0, "N": 1.0, "R": 1.0, "J": 1.0}
    m = {b: {"score": s, "cons": niveau_ponctuel(round(s - CI90_Q2, 4))}
         for b, s in mec.items()}
    fl = {"A_part": {"score": part, "cons": niveau_ponctuel(round(part - SE_Q2_FACE["A_part"], 4))},
          "N_retour": {"score": retour, "cons": niveau_ponctuel(round(retour - SE_Q2_FACE["N_retour"], 4))},
          "R_geste": {"score": geste, "cons": niveau_ponctuel(round(geste - SE_Q2_FACE["R_geste"], 4))}}
    h2 = {"rqs": rqs, "etat": etat, "label": label, "palier": palier,
          "mecanismes": m, "faces_lumiere": fl,
          "gestes": {"score": geste, "cons": fl["R_geste"]["cons"]},
          "cv": {"index": None, "etat": "N/A"}}
    if axe_j is not None:
        h2["_axe_j"] = niveau_ponctuel(round(axe_j - CI_Q1_AXIS, 4))
    return h2


def _dt_inf2_axe_j(h1, h2):
    """INF-2 lit l'axe J de la carte — injecté via _dt_h2._axe_j pour les cas
    de table (le patron du simulateur le porte dans her_q1.axes)."""
    return h2.pop("_axe_j", h1["axes"]["J"]["cons"])


def verifier_d_table():
    """D-VÉRITÉ : cas de table exhaustifs — les RÈGLES prouvées exactement
    (leçon Q5 : C1 croisé sur cas de table, pas sur données bruitées).
    CI propagés : A 0,308 · N 0,351 · R 0,3193 · J 0,4017 · carte-seule
    0,5681 (1,64 × SE). Seuils hiérarchie : AN 0,4667 · AR 0,4438 ·
    NR 0,4745 · AJ 0,5062 · NJ 0,5334 · RJ 0,5131."""
    t = {}

    def h1_std(n1=1.0, n2=1.0, ao1=1.0, ao2=1.0, r1=1.0, r2=1.0, j1=1.0,
               j2=1.0, rqs=95.0, signal=False):
        return _dt_h1({"AO1": ao1, "AO2": ao2, "N1": n1, "N2": n2, "R1": r1,
                       "R2": r2, "J1": j1, "J2": j2}, rqs=rqs, signal=signal)

    def h2_std(**kw):
        return _dt_h2(**kw)

    def forcé_axe_j(h1, h2, val):
        h1["axes"]["J"]["cons"] = val
        return h1

    # ── moyennes + lecture L3 des forces (verbatim, frontière conservatrice)
    o = deriver_rive(h1_std(), h2_std(part=1.0))
    f = o["forces"]["A"]
    t["forceA_moyenne_plancher"] = (f["score"] == 1.0 and f["conservateur"] == "DISCRÈTE"
                                    and f["ci90"] == [0.692, 1.308])
    o = deriver_rive(h1_std(ao1=3.0), h2_std(part=2.0))
    f = o["forces"]["A"]
    t["forceA_moyenne_tranquille"] = (f["score"] == 2.5 and f["type"] == "FRONTIÈRE"
                                      and f["conservateur"] == "TRANQUILLE"
                                      and f["ci90"] == [2.192, 2.808]
                                      and o["principales"] == ["A"])
    o = deriver_rive(h1_std(ao1=3.0, ao2=3.0), h2_std(part=3.0))
    f = o["forces"]["A"]
    t["forceA_frontiere_vive"] = (f["type"] == "FRONTIÈRE"
                                  and f["conservateur"] == "VIVE"
                                  and f["ci90"] == [2.692, 3.308])
    o = deriver_rive(h1_std(ao1=4.0, ao2=4.0), h2_std(part=4.0))
    f = o["forces"]["A"]
    t["forceA_forte"] = (f["conservateur"] == "FORTE" and f["ci90"] == [3.692, 4.308])
    o = deriver_rive(h1_std(n2=1.0), h2_std(retour=1.0))
    f = o["forces"]["N"]
    t["forceN_moyenne_discrete"] = (f["score"] == 1.0
                                    and f["ci90"] == [0.6489, 1.3511]
                                    and f["conservateur"] == "DISCRÈTE")
    o = deriver_rive(h1_std(n2=4.0), h2_std(retour=4.0))
    t["forceN_forte"] = o["forces"]["N"]["conservateur"] == "FORTE"
    o = deriver_rive(h1_std(r1=2.0), h2_std(geste=1.5))
    f = o["forces"]["R"]
    t["forceR_frontiere_discrete"] = (f["score"] == 1.75
                                      and f["ci90"] == [1.4307, 2.0693]
                                      and f["type"] == "FRONTIÈRE"
                                      and f["conservateur"] == "DISCRÈTE"
                                      and "R" in o["calmes"])
    o = deriver_rive(h1_std(j1=4.0, j2=4.0), h2_std())
    t["forceJ_forte_silence"] = o["j_affichee"] is False and \
        o["forces"]["J"]["conservateur"] == "FORTE"

    # ── règle J (absence décrite §5.5 — jamais une preuve de confiance)
    o = deriver_rive(h1_std(), h2_std())
    t["regleJ_discrete_affichee"] = o["j_affichee"] is True
    o = deriver_rive(h1_std(j1=2.0, j2=2.0), h2_std())
    t["regleJ_frontiere_discrete_affichee"] = (
        o["j_affichee"] is True
        and o["forces"]["J"]["ci90"] == [1.5984, 2.4016]
        and o["forces"]["J"]["conservateur"] == "DISCRÈTE")
    o = deriver_rive(h1_std(j1=3.0, j2=3.0), h2_std())
    t["regleJ_vive_silence"] = o["j_affichee"] is False

    # ── hiérarchie / nuage (ligne 260 verbatim)
    o = deriver_rive(h1_std(ao1=4.0, ao2=4.0, n2=3.0),
                     h2_std(part=4.0, retour=3.0))
    h = o["hierarchie"]
    t["hierarchie_declarable"] = (h["type"] == "HIÉRARCHIE DÉCLARABLE"
                                  and h["dominante"] == "A"
                                  and h["ecart"] == 1.0
                                  and h["seuil"] == 0.4671)
    o = deriver_rive(h1_std(ao1=3.0, ao2=3.0, n2=3.0),
                     h2_std(part=3.0, retour=3.0))
    t["nuage_ecart_nul"] = o["hierarchie"]["type"] == "NUAGE"
    o = deriver_rive(h1_std(ao1=3.0, ao2=3.0, r1=2.5),
                     h2_std(part=3.0, geste=3.0))
    t["nuage_sous_seuil"] = (o["hierarchie"]["type"] == "NUAGE"
                             and o["hierarchie"]["seuil"] == 0.4436)

    # ── limite 2 forces principales + mentions (pattern RIO-13)
    o = deriver_rive(h1_std(ao1=4.0, ao2=4.0, n2=4.0, r1=3.0),
                     h2_std(part=4.0, retour=4.0, geste=2.0))
    t["limite_deux_principales"] = (o["principales"] == ["A", "N"]
                                    and o["mentions"] == ["R"]
                                    and len(o["principales"]) == 2)

    # ── empreinte (matrice nommée — pattern RIO-12)
    o = deriver_rive(h1_std(n1=4.0), h2_std(mec={"A": 1.0, "N": 4.0, "R": 1.0, "J": 1.0}))
    t["empN_feu"] = [e["regle"] for e in o["empreinte"]] == ["EMP-N"]
    o = deriver_rive(h1_std(n1=2.0), h2_std(mec={"A": 1.0, "N": 4.0, "R": 1.0, "J": 1.0}))
    t["empN_carte_bas"] = o["empreinte"] == []
    o = deriver_rive(h1_std(n1=4.0), h2_std(mec={"A": 1.0, "N": 2.0, "R": 1.0, "J": 1.0}))
    t["empN_ombre_bas"] = o["empreinte"] == []
    o = deriver_rive(h1_std(ao2=4.0), h2_std(mec={"A": 4.0, "N": 1.0, "R": 1.0, "J": 1.0}))
    t["empA_feu"] = [e["regle"] for e in o["empreinte"]] == ["EMP-A"]
    o = deriver_rive(h1_std(r2=4.0), h2_std(mec={"A": 1.0, "N": 1.0, "R": 4.0, "J": 1.0}))
    t["empR_feu"] = [e["regle"] for e in o["empreinte"]] == ["EMP-R"]
    o = deriver_rive(h1_std(j1=4.0), h2_std(mec={"A": 1.0, "N": 1.0, "R": 1.0, "J": 4.0}))
    t["empJ_feu"] = [e["regle"] for e in o["empreinte"]] == ["EMP-J"]

    # ── inférences (règles verrouillées, noms canon ligne 261)
    o = deriver_rive(h1_std(n1=4.0), h2_std(mec={"A": 1.0, "N": 4.0, "R": 1.0, "J": 1.0},
                                            retour=1.0))
    t["inf1_feu"] = [i["regle"] for i in o["inferences"]] == ["INF-1"]
    o = deriver_rive(h1_std(n1=4.0), h2_std(mec={"A": 1.0, "N": 4.0, "R": 1.0, "J": 1.0},
                                            retour=4.0))
    t["inf1_retour_vive_non"] = o["inferences"] == []
    o = deriver_rive(h1_std(n1=4.0), h2_std(mec={"A": 1.0, "N": 2.0, "R": 1.0, "J": 1.0}))
    t["inf1_orage_bas_non"] = o["inferences"] == []
    o = deriver_rive(h1_std(j1=1.0, j2=1.0), h2_std(geste=4.0))
    h1, h2 = h1_std(j1=1.0, j2=1.0), h2_std(geste=4.0)
    h1["axes"]["J"]["cons"] = "DISCRÈTE"
    o = deriver_rive(h1, h2)
    t["inf2_feu"] = [i["regle"] for i in o["inferences"]] == ["INF-2"]
    h1, h2 = h1_std(j1=1.0, j2=1.0), h2_std(geste=1.0)
    h1["axes"]["J"]["cons"] = "DISCRÈTE"
    o = deriver_rive(h1, h2)
    t["inf2_geste_bas_non"] = o["inferences"] == []
    h1, h2 = h1_std(j1=4.0, j2=4.0), h2_std(geste=4.0)
    h1["axes"]["J"]["cons"] = "FORTE"
    o = deriver_rive(h1, h2)
    t["inf2_carte_j_vive_non"] = o["inferences"] == []
    o = deriver_rive(h1_std(r1=1.0, j1=4.0, j2=4.0),
                     h2_std(mec={"A": 1.0, "N": 1.0, "R": 4.0, "J": 1.0},
                            geste=4.0))
    t["inf3_feu"] = [i["regle"] for i in o["inferences"]] == ["INF-3"]
    o = deriver_rive(h1_std(r1=1.0, j1=4.0, j2=4.0),
                     h2_std(mec={"A": 1.0, "N": 1.0, "R": 2.0, "J": 1.0},
                            geste=4.0))
    t["inf3_mur_bas_non"] = o["inferences"] == []

    # ── états et court-circuits (ordre : filet → invalide → RQS → lecture)
    o = deriver_rive(h1_std(signal=True), h2_std())
    t["filet_source_q1"] = (o["etat"] == "P-FILTRE" and o["filet"]["source"] == "Q1"
                            and o["palier"] == PALIER_ROUGE and o["forces"] is None)
    o = deriver_rive(h1_std(), _patron_p_filtre_table())
    t["filet_source_q2"] = (o["etat"] == "P-FILTRE" and o["filet"]["source"] == "Q2")
    o = deriver_rive(h1_std(rqs=55.0), h2_std())
    t["heritage_invalide_verrouillee"] = o["etat"] == "QUÊTE_VERROUILLÉE"
    o = deriver_rive(h1_std(rqs=95.0), h2_std(rqs=75.0))
    t["rqs_min_prudence"] = (o["rqs"]["rqs"] == 75 and o["rqs"]["statut"] == "PRUDENCE"
                             and o["forces"] is not None)
    o = deriver_rive(h1_std(rqs=95.0), h2_std(rqs=60.0))
    t["rqs_min_invalide"] = (o["etat"] == "AUCUN_RÉSULTAT" and o["forces"] is None)

    # ── mode carte-seule (OMBRE_SUPPRIMÉE héritée — zéro invention)
    o = deriver_rive(h1_std(ao1=4.0, n2=4.0, n1=4.0),
                     _h2_supprimee_table(part=4.0, retour=4.0))
    f = o["forces"]["A"]
    t["carte_seule_mode"] = (o["etat"] == "CARTE_SEULE" and o["mode"] == "CARTE_SEULE"
                             and o["empreinte"] == [] and o["inferences"] == [])
    t["carte_seule_source_q1_seule"] = (f["score"] == 4.0
                                        and f["ci90"] == [3.4319, 4.5681]
                                        and f["conservateur"] == "FORTE"
                                        and len(f["sources"]) == 1
                                        and f["sources"][0]["origine"] == "Q1")
    t["carte_seule_palier_herite"] = o["palier"] == PALIER_VERT

    # ── RCI (L7 — verbatim 0,58 / 0,41 ; Δ = re − base, jamais l'inverse)
    t["rci_fiable"] = rci_de(2.0, 3.0)["verdict"] == "FIABLE" and rci_de(2.0, 3.0)["delta"] == 1.0
    t["rci_anti_inversion"] = rci_de(3.0, 2.0)["delta"] == -1.0
    t["rci_suggestion"] = rci_de(2.0, 2.5)["verdict"] == "SUGGESTION"
    t["rci_bruit"] = rci_de(2.0, 2.3)["verdict"] == "BRUIT"
    t["rci_borne_fiable"] = rci_de(2.0, 2.58)["verdict"] == "FIABLE"
    t["rci_borne_suggestion"] = rci_de(2.0, 2.41)["verdict"] == "SUGGESTION"
    t["rci_traversee"] = rci_de(1.5, 2.9)["traversee"] is True

    # ── RQS lumière = min (A6-a) + statuts verbatim (ligne 257)
    o = deriver_rive(h1_std(rqs=85.0), h2_std(rqs=95.0))
    t["rqs_min_borne_ok"] = o["rqs"]["statut"] == "OK" and o["rqs"]["rqs"] == 85
    o = deriver_rive(h1_std(rqs=84.0), h2_std(rqs=95.0))
    t["rqs_min_borne_prudence"] = o["rqs"]["statut"] == "PRUDENCE"

    # ── garde drapeau : la moyenne reste dans les sources (jamais de drapeau
    # sur entrées valides) — le drapeau est un garde d'implémentation
    o = deriver_rive(h1_std(ao1=1.0, ao2=4.0), h2_std(part=2.0))
    t["drapeau_jamais_sur_moyenne"] = o["rqs"]["drapeau"] is False
    return t


def _patron_p_filtre_table():
    return {"rqs": 95.0, "etat": "P-FILTRE", "label": None,
            "palier": PALIER_ROUGE, "mecanismes": None,
            "faces_lumiere": None, "gestes": None, "cv": None}


def _h2_supprimee_table(part=1.0, retour=1.0, geste=1.0):
    """Héritage Q2 de table en OMBRE_SUPPRIMÉE (convergence 0,00)."""
    h = _dt_h2(part=part, retour=retour, geste=geste, label="OMBRE_SUPPRIMÉE")
    return h
