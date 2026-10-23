# -*- coding: utf-8 -*-
"""
WTC-SM-Q3 — COUCHE DE CORRECTION PHILOSOPHIQUE (fichier SUPPLÉMENTAIRE)
=======================================================================
RIO-13 « Ce que notre lien sait porter » — rattrapage au gabarit universel
§5.1-§5.4 du canon (demande fondateur, même ordre que RIO-01→04 et
RIO-06→12 : fichiers SUPPLÉMENTAIRES, zéro modification de l'existant,
exactitude des calculs).

RÈGLE ABSOLUE : ce module NE MODIFIE AUCUN moteur existant.
- Le vrai cœur de la quête reste `validation-sm/validation-sm-q3/src/
  wtc_sm_q3_core.py` (SPEC verrouillée 18/10 — A1 seuil 3,50 tel quel ·
  A2 faces seules · A3 override affichage en crise · A4 SILENCIEUSE mot
  pour mot · D-TABLE table=code · D-DENSITÉ ±0 · contresigné) — importé
  tel quel, jamais recopié.
- Les junctions utilisent les VRAIS moteurs `validation-sm-q4`
  (niveau_de — bornes 2,50/3,50, les MÊMES que le seuil d'activation :
  ÉLEVÉ ⇔ force active — PILE consigné), `validation-sm-q5` (palier_de,
  pas_de, BANQUE_PAS, TEMPLATES, LITTERAL_ORIENTATION) et les labels
  réels de Q1/Q2 (empreintes mesurées ailleurs — jamais devinées).
- Cette couche ajoute ce que l'audit (Task 163) a trouvé manquant sur
  RIO-13 : F2 palier 🟢🟠🔴 dérivé MÉCANIQUEMENT + QUAND DEMANDER DE
  L'AIDE (22/25) ; F3 contenu des 3 paliers PAR FORCE RÉELLE + branchement
  quête « pas » (14/25) ; F4 fragment de bilan L8 (7 blocs) (10/25).
  La lecture graduée F1 (25/25 — D-TABLE table=code, D-DENSITÉ ±0,
  frontière 3,50 prouvée) est PRÉSERVÉE telle quelle.

Règles pré-enregistrées :
- R1 (palier, 0 seuil ajouté) : 🔴 ssi le VRAI statut est CRISE_HÉRITÉE
  (override A3 réel — le court-circuit hérité passe avant tout) ·
  🟠 ssi SILENCIEUSE ∧ au moins une face MOYEN [2,50 ; 3,50[ — la force
  existe dans la banque, pas encore activée ici : « à portée, à deux » ·
  🟢 sinon — LUMIÈRE_UNIQUE / DEUX_LUMIÈRES (capitalisation par les
  forces réellement retenues) ou SILENCIEUSE tout-FAIBLE (zone calme
  honnête, texte réel). Junction prouvée : le VRAI seuil d'activation
  (≥ 3,50) et la borne ÉLEVÉ (≥ 3,50) sont LA MÊME frontière PILE —
  LUMIÈRE/DEUX_LUMIÈRES ⇔ max-rang = ÉLEVÉ, SILENCIEUSE ⇔ max-rang ≠
  ÉLEVÉ (monotonie vérifiée sur toute l'énumération).
- R2 (D-CRISE hérité, 0 voie nouvelle) : en CRISE_HÉRITÉE, l'écran
  affiche les voies héritées reçues en entrée (A2 ∨ SM-C1 ∨ H5 — mesurées
  par RIO-11/RIO-12 ou signalées par la sécurité, jamais recalculées ici)
  + l'orientation ; les forces calculées ne sont PAS affichées (le VRAI
  override A3 : forces_affichees = []) — JAMAIS de pas de couple en crise.
- R3 (lumière causale, sans étiquette) : chaque force de la VRAIE banque
  F-S1 à F-S6 est lue par son nom réel et son rôle documenté dans le
  dépôt (livrable « Les Deux Rives », programme lignes 128/133/134 +
  banque de pas réelle Q5). Active → capitalisation (ce que le lien sait
  déjà porter) ; non active → « pas encore en place ici » (constat, pas
  un défaut — la VRAIE TABLE_SILENCIEUSE porte cette honnêteté mot pour
  mot) ; jamais de force inventée.
- R4 (densité honnête) : au-delà de 2 forces actives, le VRAI
  appliquer_limite retient les 2 premières (ordre de banque) — les
  exclues sont TRACÉES (forces_actives vs forces_calculees, vraies
  clés du moteur) et affichées « elles s'afficheront au fil du
  parcours », jamais comme retenues.
- R5 (anti-fabrication §5.5) : les forces affichées sont EXACTEMENT le
  VRAI forces_affichees du cœur (post-limite, post-override) — l'écran
  ne fabrique aucune force ; SILENCIEUSE → le texte réel mot pour mot ;
  le positif n'est jamais généré (une force non active n'est jamais
  décrite comme active).
- R6 (vocabulaire écran) : 0 mot interdit ; EXCEPTION SOURCÉE : le
  literal canon « trouble / toi / désaccord » (nom de case de la F-S2,
  programme ligne 133) — vocabulaire de l'outil, jamais une étiquette.
- R7 (D-SIM) : bandeau simulation sur chaque bloc écran.
- R8 (couplage pas réel) : ni la détresse ni la charge ne se mesurent
  ICI (elles sont mesurées par RIO-11/RIO-12) — les pas possibles sont
  listés par le VRAI palier_de/pas_de de Q5 sur le balayage HONNÊTE des
  9 croix de niveaux réels ; le pas 🟢 de la banque (« pratiquer la
  force dérivée identifiée en Q3 ») pointe les forces MESURÉES ICI.
  🔴 → aucun pas (D-CRISE).
- R9 (re-test 8 semaines) : arithmétique +56 j ISO, jamais forcée.
"""

from __future__ import annotations

import hashlib
import importlib.util
import sys
from datetime import date, timedelta
from pathlib import Path

# ─────────────────────────────────────────────────────────────────────────────
# CHARGEMENT DES VRAIS MOTEURS (jamais recopiés, jamais modifiés)
# ─────────────────────────────────────────────────────────────────────────────
_PKG = Path(__file__).resolve().parents[1]           # …/validation-sm-q3/correction-philosophique
_Q3 = _PKG.parent                                    # …/validation-sm-q3
_SM = _Q3.parent                                     # …/validation-sm
_WTC = _SM.parent                                    # …/Wairyu thérapie couple


def _charge(nom: str, chemin: Path):
    spec = importlib.util.spec_from_file_location(nom, chemin)
    mod = importlib.util.module_from_spec(spec)
    sys.modules[nom] = mod
    spec.loader.exec_module(mod)
    return mod


core_q3 = _charge("wtc_sm_q3_core", _Q3 / "src" / "wtc_sm_q3_core.py")
core_q4 = _charge("wtc_sm_q4_core", _SM / "validation-sm-q4" / "src" / "wtc_sm_q4_core.py")
core_q5 = _charge("wtc_sm_q5_core", _SM / "validation-sm-q5" / "src" / "wtc_sm_q5_core.py")

# Vérification d'intégrité des moteurs chargés (ce sont bien les vrais) :
assert len(core_q3.FORCES_BANQUE) == 6 and core_q3.MAX_FORCES == 2
assert core_q3.SEUIL_ACTIVATION == 3.50
assert len(core_q3.FACES) == 6 and len(core_q3.LABELS) == 4
assert core_q3.VOIES_HERITEES == ("SM-C1", "A2", "H5")
assert len(core_q4.CONFIG_LABELS) == 9
assert core_q4.SEUIL_ELEVE == core_q3.SEUIL_ACTIVATION   # 3,50 PILE
assert core_q5.N_JOURS == 14 and core_q5.SEUIL_CELEBRE == 9
assert core_q5.pas_de(core_q5.PALIER_ROUGE) is None

# ─────────────────────────────────────────────────────────────────────────────
# CONSTANTES DE LA COUCHE (R1-R9)
# ─────────────────────────────────────────────────────────────────────────────
# Rôle documenté de chaque force — les NOMS sont la D-TABLE réelle ; les
# descriptions sont ancrées dépôt (livrable « Les Deux Rives », programme
# ligne 133 + banque de pas réelle de Q5) — jamais inventées (R3) :
ROLE_FORCE = {
    "F-S1": ("Le plan des jours durs",
             "le plan qui prépare les jours où ça pèse, avant qu'ils "
             "arrivent"),
    "F-S2": ("La frontière co-étiquetée",
             "les 3 cases du canon : trouble / toi / désaccord — nommer "
             "ensemble ce qui appartient à qui"),
    "F-S3": ("Les rituels de deux adultes",
             "des moments de deux adultes, pas d'aidant et d'aidé"),
    "F-S4": ("La revue mensuelle",
             "le rendez-vous où le lien se passe en revue, une fois par "
             "mois"),
    "F-S5": ("Ma rive, ta rive",
             "chaque nomme ce qu'il porte — les deux rives restent "
             "asymétriques et nommées"),
    "F-S6": ("Le soin qui ne dévore pas",
             "prendre soin sans prendre la place — le soin qui laisse "
             "l'autre décider"),
}
FORCE_DE_FACE = {f: fid for fid, _n, f in core_q3.FORCES_BANQUE}

NIVEAU_BAS, NIVEAU_MOYEN, NIVEAU_ELEVE = "FAIBLE", "MOYEN", "ÉLEVÉ"

PALIER_DE_STATUT = {
    "SILENCIEUSE": None,        # tranché par le max-rang des faces (R1)
    "LUMIÈRE_UNIQUE": "🟢",
    "DEUX_LUMIÈRES": "🟢",
    "CRISE_HÉRITÉE": "🔴",
}
PALIER_NOM = {"🟢": "Seul·e / à deux selon la force — exercice maison",
              "🟠": "À deux — la force est à portée",
              "🔴": "Avec un professionnel — orientation chaleureuse"}

MOTS_INTERDITS = (
    "pathologie", "diagnostic", "dépistage", "anxieux", "anxiété",
    "dépressif", "dépression", "trouble", "syndrome", "symptôme",
    "burn-out", "burnout", "addiction", "bipolaire", "borderline",
    "schizophrénie", "névrose", "psychose", "suicide", "médicament",
    "posologie", "chronique",
)

# Exception sourcée (même traitement que le filet) : le literal canon de la
# F-S2 — programme ligne 133, D-TABLE réelle — nomme une case « trouble ».
CANON_CASES = "trouble / toi / désaccord"


def _texte_pour_controle(texte: str) -> str:
    """R6 — copie de contrôle : neutralise les literals moteurs sourcés."""
    return texte.replace(CANON_CASES, " ")


BANDEAU_DSIM = ("[D-SIM] Lecture issue d'une simulation — la mécanique est "
                "validée, pas la prévalence clinique.")

PHRASE_ORIENTATION = core_q5.LITTERAL_ORIENTATION   # VRAI literal de la quête pas SM

CLAUSE_AIDE = (
    "QUAND DEMANDER DE L'AIDE — seuils posés d'avance, les mêmes pour tout "
    "le monde : une crise héritée (voie A2 mesurée en RIO-12, SM-C1 en "
    "RIO-11, ou signal de sécurité H5) → le palier passe au rouge : les "
    "forces du lien restent calculées mais ne s'affichent pas aujourd'hui, "
    "l'orientation est le pas ; aucune force activée avec des faces en "
    "zone MOYEN → la force est à portée : à deux, re-test proposé à 8 "
    "semaines ; des forces activées → capitaliser, rien à fabriquer de "
    "plus."
)

NIVEAUX_CROIX = ("FAIBLE", "MOYEN", "ÉLEVÉ")   # mesurés par RIO-11 (det) / RIO-12 (chg)

# ─────────────────────────────────────────────────────────────────────────────
# R1 — PALIER (purement mécanique, via les VRAIS statuts et niveaux)
# ─────────────────────────────────────────────────────────────────────────────
def rangs_faces(scores: dict) -> dict:
    """R1 — rang de chaque face via le VRAI niveau_de de Q4 (bornes
    2,50/3,50) — la MÊME frontière que le seuil d'activation (3,50 PILE)."""
    return {f: core_q4.niveau_de(s) for f, s in scores.items()}


def palier_de(statut: str, rangs: dict) -> str:
    """R1 — palier : 🔴 ssi CRISE_HÉRITÉE · 🟠 ssi SILENCIEUSE avec au
    moins une face MOYEN · 🟢 sinon (lumière active ou tout-FAIBLE)."""
    if statut == "CRISE_HÉRITÉE":
        return "🔴"
    if statut == "SILENCIEUSE" and NIVEAU_MOYEN in rangs.values():
        return "🟠"
    return "🟢"


def palier_et_seuils(reponses: dict, voies_heritees=()) -> dict:
    """R1/R2/R4/R5 — lecture complète via le VRAI classifier de Q3."""
    res = core_q3.classifier(reponses, voies_heritees)
    statut = res["statut"]
    rangs = rangs_faces(res["scores"])
    palier = palier_de(statut, rangs)
    exclues = [f for f in res["forces_actives"]
               if f not in res["forces_calculees"]]
    return {
        "statut": statut,
        "palier": palier,
        "palier_nom": PALIER_NOM[palier],
        "rangs": rangs,
        "scores": res["scores"],
        "forces_actives": list(res["forces_actives"]),
        "forces_calculees": list(res["forces_calculees"]),
        "forces_affichees": list(res["forces_affichees"]),
        "exclues_densite": exclues,
        "crise_heritee": res["crise_heritee"],
        "voies_heritees": tuple(voies_heritees),
        "S1": palier == "🔴",
        "S2": palier == "🟠",
    }


def palier_independant(scores_par_somme: dict, voies_heritees=()) -> dict:
    """COR2 — chemin de calcul INDÉPENDANT (entiers purs, zéro float).

    Recalcule statut et palier depuis les SOMMES brutes (4 items/face) :
    active ⇔ somme ≥ 14 (moyenne ≥ 3,5) ; n_actives → statut (crise si
    voies non vides) ; palier via la règle max-rang (MOYEN ⇔ 10 ≤ somme
    ≤ 13 ; ÉLEVÉ ⇔ somme ≥ 14 ; FAIBLE ⇔ somme ≤ 9). Doit converger
    EXACTEMENT avec palier_et_seuils()."""
    sommes = {f: sum(v) for f, v in scores_par_somme.items()}
    actives = [fid for fid, _n, f in core_q3.FORCES_BANQUE
               if sommes[f] >= 14]
    crise = any(v in core_q3.VOIES_HERITEES for v in voies_heritees)
    statut = ("CRISE_HÉRITÉE" if crise else
              "SILENCIEUSE" if not actives else
              "LUMIÈRE_UNIQUE" if len(actives) == 1 else "DEUX_LUMIÈRES")
    nivs = [core_q4.niveau_de(s / 4.0) for s in sommes.values()]
    palier = ("🔴" if crise else
              "🟠" if statut == "SILENCIEUSE" and "MOYEN" in nivs else
              "🟢")
    return {"statut": statut, "palier": palier}


# ─────────────────────────────────────────────────────────────────────────────
# R3/R4/R5/R6 — TEXTES ÉCRAN (lumière causale, sans étiquette)
# ─────────────────────────────────────────────────────────────────────────────
def _clause_force(fid: str, pal: dict) -> str:
    """R3/R4 — clause par force, fidèle aux VRAIS états du moteur :
    retenue (affichée) · active tracée (exclue de densité) · à portée
    (MOYEN) · pas encore en place (FAIBLE)."""
    nom, role = ROLE_FORCE[fid]
    if fid in pal["forces_affichees"]:
        return (f"Ce que votre lien sait déjà porter — {nom} : {role}. "
                "C'est une ressource réelle, pas un objectif à atteindre.")
    if fid in pal["forces_actives"]:
        # R4 — exclue de densité : ACTIVE au sens du moteur, tracée,
        # jamais affichée comme retenue (le vrai appliquer_limite) :
        return (f"{nom} est active aussi — la densité du moteur retient "
                "deux forces au plus (ordre de banque) : celle-ci est "
                "tracée et s'affichera au fil du parcours. Jamais perdue.")
    face = FACE_DE_FORCE[fid]
    if pal["rangs"][face] == NIVEAU_MOYEN:
        return (f"{nom} — à portée, pas encore activée ici : {role}. C'est "
                "un constat, pas un défaut : la suite du parcours servira "
                "aussi à ça.")
    return (f"{nom} — pas encore en place ici : {role}. C'est un constat, "
            "pas un défaut : la suite du parcours servira aussi à ça.")


FACE_DE_FORCE = {fid: f for fid, _n, f in core_q3.FORCES_BANQUE}


def _clause_exercice(pal: dict) -> str:
    """F3 — contenu du palier 🟢 : capitalisation PAR FORCE RÉELLE
    retenue (le pas 🟢 réel de la banque Q5 pointe ces forces)."""
    if pal["forces_affichees"]:
        fid = pal["forces_affichees"][0]
        nom, _role = ROLE_FORCE[fid]
        return (f"🟢 À ta portée, seul·e ou à deux : pratiquer {nom} une "
                "fois cette semaine — le pas réel 🟢 de la vraie banque "
                "de pas (« pratiquer la force dérivée identifiée en Q3 »). "
                "La force est déjà là : c'est une capitalisation, pas une "
                "réparation.")
    return ("🟢 À ta portée, seul·e : noter chaque soir un mot sur ce que "
            "votre lien a tenu aujourd'hui — une ligne, une fois par jour "
            "(le pas « météo intérieure » du vrai moteur pas). Le motif "
            "apparaît seul.")


def _clause_module(pal: dict) -> str:
    """F3 — contenu du palier 🟠 : la force à portée, à deux (les VRAIS
    pas 🟠 de la banque Q5)."""
    moyennes = [FORCE_DE_FACE[f] for f, niv in pal["rangs"].items()
                if niv == NIVEAU_MOYEN]
    fid = moyennes[0] if moyennes else "F-S2"
    _nom, role = ROLE_FORCE[fid]
    return (f"🟠 À deux : installer cette force ensemble — commencer par "
            "un seul des pas réels 🟠 de la vraie banque (co-étiqueter la "
            "frontière · tenir Les rituels de deux adultes · ouvrir Le "
            "plan des jours durs). Un seul, cette semaine.")


def clause_crise(voies: tuple) -> str:
    """R2 — override A3 affiché honnêtement : voies héritées reçues en
    entrée, forces calculées mais non affichées (le VRAI moteur)."""
    voies_txt = " ∨ ".join(voies) if voies else "voie héritée"
    return (f"Crise héritée ({voies_txt}) — mesurée par les quêtes amont "
            f"(RIO-11/RIO-12) ou signalée par la sécurité : le court-circuit "
            f"passe avant tout. Les forces de votre lien restent calculées "
            f"mais ne s'affichent pas aujourd'hui (override réel du moteur). "
            f"{PHRASE_ORIENTATION}")


def _clause_statut(pal: dict) -> str:
    """Ligne de statut — chaque force lue dans son VRAI état."""
    morceaux = []
    for fid, _n, _f in core_q3.FORCES_BANQUE:
        nom = ROLE_FORCE[fid][0]
        if fid in pal["forces_affichees"]:
            morceaux.append(f"{nom} activée")
        elif fid in pal["forces_actives"]:
            morceaux.append(f"{nom} active (tracée)")
        elif pal["rangs"][FACE_DE_FORCE[fid]] == NIVEAU_MOYEN:
            morceaux.append(f"{nom} à portée")
        else:
            morceaux.append(f"{nom} en place douce")
    return (f"Ce que votre lien sait porter se lit : statut "
            f"{pal['statut']} — " + " · ".join(morceaux) + ".")


def bloc_ecran(reponses: dict, pal: dict) -> dict:
    """Assemble le bloc écran complet RIO-13 (toutes les clauses sont
    déterminées mécaniquement par les sorties du vrai cœur).

    R2 — en CRISE_HÉRITÉE : override + orientation, AUCUNE force affichée
    (le VRAI forces_affichees = []). R5 — les forces affichées sont
    EXACTEMENT celles du vrai cœur ; les exclues de densité tracées.
    """
    if pal["crise_heritee"]:
        texte = "\n".join([BANDEAU_DSIM, clause_crise(pal["voies_heritees"]),
                           "Le court-circuit passe avant tout : JAMAIS de "
                           "pas de couple en crise. La mesure reste notée "
                           "pour la suite du parcours."])
        return {
            "texte": texte,
            "md5": hashlib.md5(texte.encode("utf-8")).hexdigest(),
            "nb_mots_interdits": sum(1 for m in MOTS_INTERDITS
                                     if m in _texte_pour_controle(
                                         texte).lower()),
            "crise": True,
        }
    statut = pal["statut"]
    parties = [BANDEAU_DSIM]
    parties.append(_clause_statut(pal))
    if statut == "SILENCIEUSE":
        # R5 — le texte réel du cœur, MOT POUR MOT :
        parties.append("> " + core_q3.TABLE_SILENCIEUSE)
    for fid, _n, _f in core_q3.FORCES_BANQUE:
        parties.append(_clause_force(fid, pal))
    if pal["exclues_densite"]:
        parties.append(
            "D'autres forces sont actives aussi — elles s'afficheront au "
            "fil du parcours (densité : deux forces retenues au plus). "
            "(Tracées, jamais perdues.)")
    if statut == "SILENCIEUSE" and pal["palier"] == "🟢":
        # R5 — phrase anti-fabrication : le VRAI template zone_calme de la
        # quête pas (mot pour mot), réservé à la zone calme (SILENCIEUSE
        # tout-FAIBLE) — jamais sur une lumière active :
        parties.append("> " + core_q5.TEMPLATES["zone_calme"])
    parties.append(clause_bande(pal))
    parties.append(f"CE QUE TU PEUX CHANGER — palier {pal['palier']} "
                   f"({pal['palier_nom']}) :")
    parties.append(_clause_exercice(pal))
    if pal["palier"] == "🟠":
        parties.append(_clause_module(pal))
    parties.append(CLAUSE_AIDE)
    texte = "\n".join(parties)
    return {
        "texte": texte,
        "md5": hashlib.md5(texte.encode("utf-8")).hexdigest(),
        "nb_mots_interdits": sum(1 for m in MOTS_INTERDITS
                                 if m in _texte_pour_controle(
                                     texte).lower()),
        "crise": False,
    }


def clause_bande(pal: dict) -> str:
    """R1 — la frontière 3,50 PILE affichée honnêtement (le VRAI seuil
    d'activation est inclusif)."""
    moyennes = [f for f, niv in pal["rangs"].items() if niv == NIVEAU_MOYEN]
    if not moyennes:
        return ("Aucune face du lien n'est dans la zone juste sous le "
                "seuil d'activation (3,50) : les forces activées le sont "
                "nettement.")
    return ("Des faces du lien sont dans la zone juste sous le seuil "
            "d'activation (3,50, borne inclusive du moteur) : la force "
            "correspondante est à portée, pas encore activée — le re-test "
            "est proposé à 8 semaines.")


# ─────────────────────────────────────────────────────────────────────────────
# R8 — BRANCHEMENT PAS (VRAI Q5) — balayage honnête des croix
# ─────────────────────────────────────────────────────────────────────────────
def pas_possibles() -> dict:
    """R8 — les pas possibles via le VRAI palier_de/pas_de sur les 9
    croix de niveaux réels (détresse RIO-11 × charge RIO-12 — mesurées
    ailleurs, jamais devinées ici)."""
    _rang = {NIVEAU_BAS: 0, NIVEAU_MOYEN: 1, NIVEAU_ELEVE: 2}
    table = {}
    for niv_det in NIVEAUX_CROIX:
        for niv_chg in NIVEAUX_CROIX:
            pal = core_q5.palier_de(niv_det, niv_chg)
            pas = core_q5.pas_de(pal)
            table.setdefault(pal, []).append(pas)
    return table


def configurations_couple() -> dict:
    """F4 bloc 4 — les 9 configurations réelles de Q4 (mesurées par
    RIO-11/RIO-12 ; cette quête les liste, ne les devine pas)."""
    configs = sorted(core_q4.CONFIG_LABELS)
    return {
        "configurations_totales": configs,
        "note": ("la configuration réelle du couple se mesure en RIO-14 "
                 "à partir de RIO-11 (détresse) et RIO-12 (charge) — "
                 "cette quête ne l'invente pas"),
    }


def re_test_huit_semaines(depuis: str = "2026-01-01") -> str:
    """R9 — arithmétique de dates (+56 jours), jamais forcée."""
    d = date.fromisoformat(depuis)
    return (d + timedelta(weeks=8)).isoformat()


# ─────────────────────────────────────────────────────────────────────────────
# F4 — FRAGMENT DE BILAN L8 (7 blocs)
# ─────────────────────────────────────────────────────────────────────────────
def bilan_fragment(reponses: dict, pal: dict) -> dict:
    """Contribution de RIO-13 au bilan d'ensemble (assemblage L8 du canon).

    7 blocs : position · forme · empreinte · couple · force · limites ·
    palier/pas. Le bloc force est MESURÉ ICI (les seules forces réelles
    de la dimension santé mentale) ; empreinte/couple pointent RIO-11/12
    (mesurées ailleurs) et RIO-14 (croisement).
    """
    scores = pal["scores"]
    actives = pal["forces_actives"]
    pas_tab = pas_possibles()
    configs = configurations_couple()
    en_veille = [FORCE_DE_FACE[f] for f, niv in pal["rangs"].items()
                 if niv == NIVEAU_MOYEN]
    fragment = {
        "bloc_1_position": {
            f: {"score": scores[f], "niveau": pal["rangs"][f]}
            for f in core_q3.FACES},
        "bloc_2_forme": {
            "statut_moteur": pal["statut"],
            "n_actives_avant_limite": len(pal["forces_actives"]),
            "n_affichees_apres_limite": len(pal["forces_affichees"]),
            "ordre_actives": ">".join(pal["forces_actives"])
            if pal["forces_actives"] else "aucune force active",
        },
        "bloc_3_empreinte": {
            "source": "RIO-11 / RIO-12 — vrais moteurs sm-q1-r3 et sm-q2",
            "labels_possibles_detresse": ["STABLE", "CHARGE", "MASQUE",
                                          "MIXTE", "CRISE"],
            "labels_possibles_aidant": ["STABLE", "ÉPUISÉ", "SURIMPLIQUÉ",
                                        "HOSTILE", "MIXTE"],
        },
        "bloc_4_couple": {
            "source": "RIO-14 — vrai moteur sm-q4 (les 9 configurations)",
            "configurations_totales": configs["configurations_totales"],
            "note": configs["note"],
        },
        "bloc_5_force": {
            "source": "MESURÉ ICI — vrai moteur sm-q3 (D-TABLE verrouillée)",
            "forces_affichees": [
                {"id": fid, "nom": ROLE_FORCE[fid][0]}
                for fid in pal["forces_affichees"]],
            "forces_calculees": list(pal["forces_calculees"]),
            "exclues_densite_tracees": pal["exclues_densite"],
            "regle_densite": "max 2 forces/profil, ordre de banque (VRAI "
                             "appliquer_limite)",
            "override_crise": ("forces calculées, non affichées (VRAI A3)"
                               if pal["crise_heritee"] else
                               "non concerné — pas de crise héritée"),
        },
        "bloc_6_limites": {
            "forces_en_veille": en_veille if en_veille
            else ["aucune force en veille"],
            "faces_sous_seuil": [f for f, niv in pal["rangs"].items()
                                 if niv == NIVEAU_BAS] or
            ["aucune face sous 2,50"],
        },
        "bloc_7_palier_pas": {
            "palier": pal["palier"],
            "pas_possibles": {k: sorted({p for p in v if p is not None})
                              for k, v in pas_tab.items()
                              if any(p is not None for p in v)},
            "pas_en_crise": ("aucun pas de couple — le VRAI pas_de retourne "
                             "None sur 🔴 (D-CRISE) : l'orientation EST le "
                             "pas") if core_q5.PALIER_ROUGE in pas_tab else
            "non concerné",
            "pas_labels": sorted({p for lst in pas_tab.values()
                                  for p in lst if p is not None}),
            "suivi_14_jours_sans_sanction": True,
            "retest": ("re-test RIO-13 proposé à 8 semaines — " +
                       re_test_huit_semaines()),
        },
    }
    fragment["_complet"] = all(
        v not in (None, "", [], {}) for v in _valeurs_feuilles(fragment)
    )
    return fragment


def _valeurs_feuilles(obj):
    if isinstance(obj, dict):
        for v in obj.values():
            yield from _valeurs_feuilles(v)
    elif isinstance(obj, (list, tuple)):
        for v in obj:
            yield from _valeurs_feuilles(v)
    else:
        yield obj
