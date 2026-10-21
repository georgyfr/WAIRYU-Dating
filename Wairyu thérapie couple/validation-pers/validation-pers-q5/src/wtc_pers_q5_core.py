# -*- coding: utf-8 -*-
"""WTC-PERS-Q5 « Le pas sous ma carte » (RIO-23) — moteur de dérivation.

SPEC : PERS-Q5-SPEC.md (VERROUILLÉE — arbitrages A1-A6 → (a)×6, délégation
fondateur, trace 1a15cefe32e51dc5). Canon : lignes 222-224 (« Q5 Le pas
(1 changement + suivi 14 jours) ») · 296-298 (« tracking 14 jours, seuils
anti-perfectionnisme : 9/14 = célébré, jamais de sanction ») · 274 (re-test
8 semaines) · 27/270 (ombre ET force affichées) · 355-356 (vocabulaire
écran) · 363 (jamais le partenaire, jamais les tiers) · 369 (filet — on ne
contractualise pas sous contrôle) · 370 (rive non synchronisée).

Héritages consommés (sorties CONTRESIGNÉES — zéro ré-implémentation) :
Q1 carte + Q2 ombre passent par le MOTEUR RIO-21 CONTRESIGNÉ lui-même
(wtc_pers_q3_core.deriver_rive) — Q5 ne recalcule JAMAIS la carte, l'ombre
ni la lumière (une mesure un rôle — A1-SM-Q4) ; le palier hérité est
affiché sans recalcul (leçon Q5-A3). Zéro item nouveau, zéro constante
nouvelle : le seul seuil propre à Q5 est le 9/14 verbatim canon (296-298).

Ordre du moteur (A5-a — filet AVANT l'arbre, pattern Q3/Q4) :
(1) filet hérité — pas non déployé, configuration tracée ;
(2) héritage invalide / aucun résultat lumière — quête verrouillée ;
(3) mode carte-seule — banque restreinte carte, bandeau prudence ;
(4) banque dérivée (forces Q3 + mécanismes Q2 + geste Q2 — cap 8,
    pattern banque RIO-13/Q3) ou zone calme (pas zéro dit comme tel) ;
(5) choix utilisateur DANS la banque (jamais prescrit — hors banque =
    refus anti-fabrication), check-in binaire 14 j (9/14 = CÉLÉBRÉ),
    RCI 8 semaines posé sur la cible du pas (A6-a — bornes L7 verbatim
    0,58/0,41 héritées du moteur Q3).
"""
import os
import sys

_HERE = os.path.dirname(os.path.abspath(__file__))
_Q3 = os.path.join(os.path.dirname(os.path.dirname(_HERE)),
                   "validation-pers-q3", "src")
if _Q3 not in sys.path:
    sys.path.insert(0, _Q3)

import wtc_pers_q3_core as q3core          # noqa: E402 — moteur RIO-21

# ── Constantes Q5 (zéro constante nouvelle hors 9/14 verbatim canon) ─────────
N_JOURS = 14
SEUIL_CELEBRE = 9            # verbatim lignes 296-298 — 9/14 = célébré
STATUT_CELEBRE = "CÉLÉBRÉ"
STATUT_EN_CHEMIN = "EN CHEMIN"
RE_TEST_SEMAINES = 8         # ligne 274 — hérité q3core (affichage)
BANQUE_MAX = 8               # pattern banque 8 (RIO-13 / Q3)

ETAT_PAS = "LE PAS"
ETAT_FILET = "PAS_NON_DÉPLOYÉ"
ETAT_VERROU = "QUÊTE_VERROUILLÉE"
ETAT_AUCUN = "AUCUN_RÉSULTAT"
ETAT_CARTE_SEULE = "CARTE_SEULE"
ETAT_ZONE_CALME = "ZONE_CALME"

FAMILLES = ("FORCE", "MÉCANISME", "GESTE", "CARTE", "ZONE")
SOUTIEN = ("TRANQUILLE", "VIVE", "FORTE")
LABEL_ZONE_CALME = "ZONE_CALME"   # état contresigné Q2 (patron RIO-20)
ID_PAS_ZERO = "ZONE:zero"
NOMENCLATURE = (STATUT_CELEBRE, STATUT_EN_CHEMIN, ETAT_PAS, ETAT_FILET,
                ETAT_VERROU, ETAT_AUCUN, ETAT_CARTE_SEULE, ETAT_ZONE_CALME,
                "pas zéro") + tuple(q3core.NIVEAUX)

# ── Banque de pas — libellés ex nihilo déposés au core (LIBRE verrouillage) ──
# Chaque candidat est TRAÇABLE vers ses héritages (C1) : source + cible.
PAS_FORCE = {
    "A": "Pratiquer la part reconnue — nommer à voix haute une chose exacte "
         "que tu as faite cette semaine, une fois, sans la minimiser.",
    "N": "Pratiquer le retour qui tient — renvoyer un message laissé en "
         "attente avant la fin de la journée, même en trois mots.",
    "R": "Pratiquer le geste qui répare — proposer un geste concret après "
         "une tension : une question suffit (« on reprend ? »).",
    "J": "Pratiquer la main ouverte — partager une information que tu "
         "gardais par prudence, en une phrase, sans détour.",
}
PAS_DESAMO = {
    "A": "Désamorcer le penchant — quand la pression monte, écrire la "
         "phrase avant de la dire, relire, puis choisir.",
    "N": "Désamorcer l'orage — nommer l'orage à voix haute (« ça monte ») "
         "et poser vingt minutes avant de continuer.",
    "R": "Désamorcer le mur — quand le mur monte, dire « je mets en pause, "
         "je reviens » et revenir au moment dit.",
    "J": "Désamorcer la lentille — vérifier avant d'interpréter : une "
         "question directe à la place d'une déduction.",
}
PAS_GESTE = ("Poser un geste de réparation — choisir un petit geste concret "
             "(le thé posé, le message envoyé, la tâche prise sans qu'on la "
             "demande) et le faire une fois aujourd'hui.")
PAS_CARTE = ("Pas carte-seule — reprendre ton axe le plus bas et lui donner "
             "un espace : une conversation, une note, une question.")
PAS_ZERO = ("Le pas zéro — ne rien changer pour l'instant : la zone calme "
            "se vit, elle ne se répare pas.")


# ── Banque dérivée (A3-a) ─────────────────────────────────────────────────────
def _candidats_force(lumiere):
    """Candidats famille FORCE — sources Q3 contresignées (traçabilité C1).
    Principales d'abord (max 2, pattern RIO-13), puis mentions. Les forces
    CALMES (absence décrite — §5.5) ne génèrent AUCUN candidat : rien à
    fabriquer, l'absence se décrit, elle ne se prescrit pas."""
    forces = lumière_forces(lumiere)
    if not forces:
        return []
    ordre = list(lumiere.get("principales") or []) + \
        list(lumiere.get("mentions") or [])
    return [{"famille": "FORCE", "source": "Q3 force " + m,
             "cible": ("FORCE", m), "libelle": PAS_FORCE[m]} for m in ordre]


def _candidats_mecanisme(her_q2):
    """Candidats famille MÉCANISME — blocs Q2 actifs (conservateur ≥
    TRANQUILLE, lecture héritée sans recalcul)."""
    cands = []
    for b in ("A", "N", "R", "J"):
        mec = (her_q2.get("mecanismes") or {}).get(b)
        if mec and mec.get("cons") in SOUTIEN:
            cands.append({"famille": "MÉCANISME", "source": "Q2 bloc " + b,
                          "cible": ("MÉCANISME", b), "libelle": PAS_DESAMO[b]})
    return cands


def _candidat_geste(her_q2):
    """Candidat famille GESTE — gestes de réparation Q2 rares (cons ≤
    DISCRÈTE) : le pas pose un geste, la quête Q2 en garde la mesure."""
    g = her_q2.get("gestes") or {}
    if g and g.get("cons") == "DISCRÈTE":
        return [{"famille": "GESTE", "source": "Q2 gestes (R_geste)",
                 "cible": ("GESTE", "R_geste"), "libelle": PAS_GESTE}]
    return []


def _candidat_carte():
    return [{"famille": "CARTE", "source": "Q1 carte (axes)",
             "cible": ("CARTE", "axes"), "libelle": PAS_CARTE}]


def lumière_forces(lumiere):
    return lumiere.get("forces") or {}


def lumière_calmes(lumiere):
    return list(lumiere.get("calmes") or [])


def _candidat_zero():
    return {"famille": "ZONE", "source": "canon §5.5 (zone calme héritée Q2)",
            "cible": ("ZONE", "zero"), "libelle": PAS_ZERO}


def deriver_banque(her_q1, her_q2, lumiere):
    """Banque de pas candidats (A3-a) — pure, déterministe, traçable.
    Restreinte carte en mode carte-seule ; vide si zone calme (aucune
    force soutenue — les calmes sont une absence décrite, jamais un
    candidat — aucun mécanisme actif, geste non rare) → pas zéro dit
    comme tel (§5.5). Cap BANQUE_MAX (pattern banque 8)."""
    if lumiere.get("mode") == "CARTE_SEULE":
        return _candidat_carte()[:BANQUE_MAX]
    cands = (_candidats_force(lumiere) + _candidats_mecanisme(her_q2)
             + _candidat_geste(her_q2))
    return cands[:BANQUE_MAX]


# ── Check-in 14 jours (A4-a — patron SM-Q5-A1, verbatim 296-298) ─────────────
def statut_engagement_de(serie):
    """≥ 9/14 → CÉLÉBRÉ · < 9/14 → EN CHEMIN — jamais de sanction.
    serie None → None (pas non déployé ou pas zéro : rien à évaluer)."""
    if serie is None:
        return None
    if len(serie) != N_JOURS:
        raise ValueError("série de check-ins : 14 jours attendus")
    return STATUT_CELEBRE if sum(1 for j in serie if j) >= SEUIL_CELEBRE \
        else STATUT_EN_CHEMIN


def coches_de(serie):
    return None if serie is None else sum(1 for j in serie if j)


# ── RCI 8 semaines (A6-a — bornes verbatim héritées q3core.rci_de) ───────────
def _cible_score_force(cible, lumiere):
    f = lumière_forces(lumiere) or {}
    return None if cible[1] not in f else f[cible[1]]["score"]


def _cible_score_q2(cible, her_q2):
    if cible[0] == "MÉCANISME":
        mec = (her_q2.get("mecanismes") or {}).get(cible[1])
        return None if mec is None else mec["score"]
    if cible[0] == "GESTE":
        g = her_q2.get("gestes") or {}
        return None if not g else g.get("score")
    return None


def rci_pas(c, lumiere, pas=None):
    """Δ = re − base sur la cible du pas choisi (A6-a — une mesure un
    rôle). FORCE : la lumière est re-dérivée PAR LE MOTEUR RIO-21 avec les
    héritages de re-test (zéro ré-implémentation). MÉCANISME/GESTE : score
    hérité Q2. Pas zéro, pas carte ou pas non choisi → None (rien à
    mesurer, dit comme tel). Bornes 0,58 / 0,41 verbatim (q3core.rci_de)."""
    pas = pas or c.get("pas")
    if not pas or pas["cible"][0] in ("CARTE", "ZONE"):
        return None
    cible = pas["cible"]
    fam = cible[0]
    base = _cible_score_force(cible, lumiere) if fam == "FORCE" \
        else _cible_score_q2(cible, c["her_q2"])
    if base is None:
        return None
    if fam == "FORCE":
        if c.get("her_q1_rt") is None or c.get("her_q2_rt") is None:
            return None
        lum_rt = q3core.deriver_rive(c["her_q1_rt"], c["her_q2_rt"])
        re = _cible_score_force(cible, lum_rt)
    else:
        h2rt = c.get("her_q2_rt")
        re = None if h2rt is None else _cible_score_q2(cible, h2rt)
    if re is None:
        return None
    r = q3core.rci_de(base, re)
    return {"delta": r["delta"], "verdict": r["verdict"],
            "traversee": r["traversee"], "famille": fam, "cible": cible[1],
            "base": round(base, 4), "re_test": round(re, 4),
            "semaines": RE_TEST_SEMAINES}


# ── Moteur principal — pure, déterministe ────────────────────────────────────
def deriver_pas(c):
    """Classement complet d'une rive Q5. c : dict(her_q1, her_q2,
    choix=None (id de candidat), serie=None (14 bool | None),
    her_q1_rt=None, her_q2_rt=None, eclairage_q4=None (affichage seul)).
    Ordre A5-a : filet → héritage invalide → aucun résultat → carte-seule
    → banque/zone calme → choix → check-in → RCI. JAMAIS l'inverse."""
    her_q1, her_q2 = c["her_q1"], c["her_q2"]
    lumiere = q3core.deriver_rive(her_q1, her_q2)   # moteur contresigné
    etat_l = lumiere.get("etat")
    palier = her_q2.get("palier")                    # hérité sans recalcul
    serie = c.get("serie")

    # (1) filet hérité — ligne 369, AVANT l'arbre (pattern Q3/Q4)
    if etat_l == "P-FILTRE":
        src = (lumiere.get("filet") or {}).get("source") or \
            ("Q1" if her_q1.get("signal") else "Q2")
        return {"etat": ETAT_FILET, "mode": None, "palier": palier,
                "banque": None, "pas": None, "pas_zero": False,
                "choix": c.get("choix"), "serie": serie, "coches": None,
                "statut": None, "rci": None,
                "filet": {"filet": True, "source": src},
                "eclairage": None,
                "bandeau": TEMPLATES["filet_pas"].format(source=src)}

    # (2) héritage invalide / aucun résultat — on ne dérive rien
    if etat_l in ("QUÊTE_VERROUILLÉE", "AUCUN_RÉSULTAT"):
        return {"etat": etat_l, "mode": None, "palier": palier,
                "banque": None, "pas": None, "pas_zero": False,
                "choix": c.get("choix"), "serie": serie, "coches": None,
                "statut": None, "rci": None,
                "filet": {"filet": False, "source": None},
                "eclairage": None,
                "bandeau": TEMPLATES["verrouillee"]
                if etat_l == "QUÊTE_VERROUILLÉE" else TEMPLATES["aucun"]}

    # (3) carte-seule — bandeau prudence, banque restreinte carte (0 invention)
    if etat_l == "CARTE_SEULE" or lumiere.get("mode") == "CARTE_SEULE":
        banque = deriver_banque(her_q1, her_q2, lumiere)
        pas = _choisir(banque, c.get("choix"))
        return {"etat": ETAT_CARTE_SEULE, "mode": "CARTE_SEULE",
                "palier": palier, "banque": banque, "pas": pas,
                "pas_zero": False, "choix": c.get("choix"), "serie": serie,
                "coches": coches_de(serie),
                "statut": statut_engagement_de(serie),
                "rci": rci_pas(c, lumiere, pas),
                "filet": {"filet": False, "source": None},
                "eclairage": _eclairage(c),
                "bandeau": TEMPLATES["carte_seule"]}

    # (4) lumière complète — zone calme héritée, banque dérivée, choix
    banque = deriver_banque(her_q1, her_q2, lumiere)
    if her_q2.get("label") == LABEL_ZONE_CALME:
        # zone calme CONTRESIGNÉE Q2 : pas zéro PRINCIPAL (§5.5 — rien à
        # fabriquer), exercices affichés en options ; choisir reste à toi.
        banque = [_candidat_zero()] + banque
        pas = _choisir(banque, c.get("choix")) if c.get("choix") \
            is not None else None
        zero = pas is None or pas["cible"][0] == "ZONE"
        serie = None if zero else serie          # pas zéro : rien à évaluer
        return {"etat": ETAT_ZONE_CALME, "mode": "COMPLET", "palier": palier,
                "banque": banque, "pas": pas, "pas_zero": zero,
                "choix": c.get("choix"), "serie": serie,
                "coches": coches_de(serie),
                "statut": statut_engagement_de(serie),
                "rci": None if zero else rci_pas(c, lumiere, pas),
                "filet": {"filet": False, "source": None},
                "eclairage": _eclairage(c),
                "bandeau": TEMPLATES["zone_calme"]}
    if not banque:
        # défensif : jamais atteint par construction contresignée (une ombre
        # calme soutient retour/geste ; une ombre vive offre un désamorçage)
        # — documenté D-HIST validation §leçon.
        return {"etat": ETAT_ZONE_CALME, "mode": "COMPLET", "palier": palier,
                "banque": [_candidat_zero()], "pas": None, "pas_zero": True,
                "choix": None, "serie": None, "coches": None,
                "statut": None, "rci": None,
                "filet": {"filet": False, "source": None},
                "eclairage": _eclairage(c),
                "bandeau": TEMPLATES["zone_calme"]}
    pas = _choisir(banque, c.get("choix"))
    return {"etat": ETAT_PAS, "mode": "COMPLET", "palier": palier,
            "banque": banque, "pas": pas, "pas_zero": False,
            "choix": c.get("choix"), "serie": serie,
            "coches": coches_de(serie),
            "statut": statut_engagement_de(serie),
            "rci": rci_pas(c, lumiere, pas),
            "filet": {"filet": False, "source": None},
            "eclairage": _eclairage(c),
            "bandeau": None}


def _choisir(banque, choix_id):
    """Choix DANS la banque (jamais prescrit — le moteur ne choisit pas à
    la place). choix None → pas encore choisi (en attente). Hors banque →
    ValueError (anti-fabrication DOUBLE SENS — C1)."""
    if choix_id is None:
        return None
    for cand in banque:
        if _id_de(cand) == choix_id:
            return cand
    raise ValueError("choix hors banque — anti-fabrication (C1)")


def _id_de(cand):
    return cand["famille"] + ":" + cand["cible"][1]


def _eclairage(c):
    """Éclairage croisement Q4 — AFFICHAGE SEUL, jamais une règle (A2-a :
    entrée optionnelle ; la rive non synchronisée n'est jamais bloquée)."""
    txt = c.get("eclairage_q4")
    return None if not txt else TEMPLATES["eclairage"].format(texte=txt)


# ── Littéraux d'affichage (autoporteurs — C5/C6, vocabulaire écran) ──────────
TEMPLATES = {
    "filet_pas": "Le pas n'est pas déployé : la sécurité passe d'abord "
                 "(filet hérité — {source}). Rien d'autre à faire ici, "
                 "et rien n'est noté.",
    "verrouillee": "Le pas n'est pas déployé : les lectures de départ ne "
                   "sont pas assez fiables pour accompagner un changement. "
                   "Reprends le re-test d'abord — rien d'autre à faire ici.",
    "aucun": "Aucun pas proposé : la mesure de départ ne le permet pas. "
             "Ce n'est pas une note, c'est une limite de la mesure — "
             "reprends la lecture plus tard.",
    "carte_seule": "Lecture carte seule — prudence : le pas se choisit "
                   "dans une liste restreinte, dérivée de ta carte "
                   "uniquement.",
    "zone_calme": "Zone calme — rien à fabriquer ici. Le pas zéro est "
                  "ouvert : ne rien changer pour l'instant, c'est dit "
                  "comme tel.",
    "banque": "Choisis ton pas — ou pas : le pas zéro reste ouvert, "
              "choisir est à toi, jamais au programme.",
    "celebre": "{n} jours sur 14 — c'est célébré. Le pas a tenu.",
    "celebre_pile": "9 jours sur 14 — célébré pile sur le seuil : le "
                    "programme compte 9/14 comme un pas tenu. Pas besoin "
                    "de viser plus.",
    "en_chemin": "{n} jours sur 14 — le pas est en chemin. Rien n'est "
                 "noté, rien n'est compté contre toi : le suivi continue, "
                 "sans rien d'autre à prouver.",
    "rci_fiable": "Le changement lié à ce pas est mesuré au-delà du bruit "
                  "de la mesure.",
    "rci_suggestion": "Une piste de changement se dessine — à relire au "
                      "re-test de 8 semaines.",
    "rci_bruit": "Dans le bruit de la mesure — ça ne dit ni plus ni moins : "
                 "la mesure ne tranche pas encore.",
    "eclairage": "Éclairage croisement (contexte, jamais une règle) : "
                 "{texte}",
}


def affichage_statut(res):
    """Texte autoporteur du statut d'engagement (C5) — jamais un score."""
    if res["statut"] is None:
        return None
    n = res.get("coches")
    if res["statut"] == STATUT_CELEBRE:
        return TEMPLATES["celebre_pile"] if n == SEUIL_CELEBRE \
            else TEMPLATES["celebre"].format(n=n)
    return TEMPLATES["en_chemin"].format(n=n)


def affichage_rci(res):
    if res["rci"] is None:
        return None
    v = res["rci"]["verdict"]
    if v == "FIABLE":
        return TEMPLATES["rci_fiable"]
    if v == "SUGGESTION":
        return TEMPLATES["rci_suggestion"]
    return TEMPLATES["rci_bruit"]
