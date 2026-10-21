# -*- coding: utf-8 -*-
"""
WTC-Q1 — COUCHE DE CORRECTION PHILOSOPHIQUE (fichier SUPPLÉMENTAIRE)
=====================================================================
RIO-01 « Comment je me raccroche » — rattrapage au gabarit universel §5.1-§5.4
du canon (demande fondateur, trace 1a15ed7ad00bc0fd).

RÈGLE ABSOLUE : ce module NE MODIFIE AUCUN moteur existant.
- Le vrai cœur de la quête reste `validation-q1-r1/src/wtc_q1_core.py`
  (révision R1, SEM structurel 0,195) — importé tel quel, jamais recopié.
- Les junctions utilisent les VRAIS moteurs `validation-q4/src/wtc_q4_core.py`
  (croisement à deux) et `validation-q5/src/wtc_q5_core.py` (pas + suivi).
- Cette couche ajoute ce que l'audit (Task 163) a trouvé manquant sur RIO-01 :
  F2 palier 🟢🟠🔴 + QUAND DEMANDER DE L'AIDE (12/25) ;
  F3 contenu des 3 paliers + branchement quête « pas » (6/25) ;
  F4 fragment de bilan L8 (7 blocs) (10/25).

Chaque règle ci-dessous est PRÉ-ENREGISTRÉE (écrite avant tout calcul) et
dérivée MÉCANIQUEMENT des sorties du vrai cœur — zéro invention de mesure.

Règles pré-enregistrées :
- R1 (palier) : rang(niveau) Discrète=0, Tranquille=1, Vive=2, Forte=3 ;
  rang_quête = max(rang conservateur A, rang conservateur B) ;
  🟢 si rang_quête ≤ 1 · 🟠 si = 2 · 🔴 si = 3 (canon §5.4, max-niveau).
- R2 (seuil d'aide S1) : un axe conservateur = Forte → 🔴 + orientation
  chaleureuse affichée (« le chemin le plus court, pas un échec »).
- R3 (seuil d'aide S2) : lecture FRONTIÈRE dont l'intervalle touche Forte
  (ci_haut ≥ 3,20) sans conservateur Forte → « à surveiller » + re-test
  8 semaines + seuil d'aide affiché, palier restant celui de R1.
- R4 (qualité avant sens) : RQS INVALIDE → lecture suspendue (re-test
  d'abord) ; PRUDENCE → lecture affichée avec mention de prudence.
- R5 (anti-fabrication §5.5) : zone calme affichée « rien à fabriquer »
  ssi axe Discrète/Tranquille — JAMAIS sur Vive/Forte.
- R6 (force silencieuse) : sur axe actif → « terrain de travail, pas un
  verdict » (canon §5.5).
- R7 (vocabulaire écran, canon Partie 9) : aucun mot de la liste interdite
  dans tout texte affiché ; D-CRISE non applicable à cet instrument (aucun
  construit d'auto-danger mesuré) — consigné, remplacé par S1/S2.
- R8 (D-SIM) : bandeau simulation sur chaque bloc écran.
- R9 (couplage réel) : le pas annoncé est celui du VRAI moteur Q5
  (face dominante Q5 × empreinte) — pour RIO-01 (avant RIO-02), le fragment
  liste les 3 pas possibles de la face via la vraie table de Q5.
"""

from __future__ import annotations

import hashlib
import importlib.util
import sys
from pathlib import Path

# ─────────────────────────────────────────────────────────────────────────────
# CHARGEMENT DES VRAIS MOTEURS (jamais recopiés, jamais modifiés)
# ─────────────────────────────────────────────────────────────────────────────
_PKG = Path(__file__).resolve().parents[1]           # …/validation-q1/correction-philosophique
_WTC = _PKG.parents[1]                                # …/Wairyu thérapie couple


def _charge(nom: str, chemin: Path):
    spec = importlib.util.spec_from_file_location(nom, chemin)
    mod = importlib.util.module_from_spec(spec)
    sys.modules[nom] = mod
    spec.loader.exec_module(mod)
    return mod


core_r1 = _charge("wtc_q1_core_r1", _WTC / "validation-q1-r1" / "src" / "wtc_q1_core.py")
core_q4 = _charge("wtc_q4_core", _WTC / "validation-q4" / "src" / "wtc_q4_core.py")
core_q5 = _charge("wtc_q5_core", _WTC / "validation-q5" / "src" / "wtc_q5_core.py")

# Vérification d'intégrité des moteurs chargés (ce sont bien les vrais) :
assert core_r1.N_ITEMS == 18 and core_r1.SEM_AXE == 0.195
assert len(core_q4.CONFIGS_9) == 9
assert core_q5.SEUIL_CELEBRE == 9

# ─────────────────────────────────────────────────────────────────────────────
# CONSTANTES DE LA COUCHE (R1-R9)
# ─────────────────────────────────────────────────────────────────────────────
RANG_NIVEAU = {"Discrète": 0, "Tranquille": 1, "Vive": 2, "Forte": 3}
NIVEAU_DE_RANG = {v: k for k, v in RANG_NIVEAU.items()}
PALIER_DE_RANG = {0: "🟢", 1: "🟢", 2: "🟠", 3: "🔴"}
PALIER_NOM = {"🟢": "Seul·e — exercice maison", "🟠": "À deux — module de couple",
              "🔴": "Avec un professionnel — orientation chaleureuse"}

AXE_NOM_ECRAN = {"A": "peur de perdre", "B": "peur de dépendre"}

MOTS_INTERDITS = (
    "pathologie", "diagnostic", "dépistage", "anxieux", "anxiété",
    "évitement", "évitant", "évitante", "désorganisé", "trouble",
    "syndrome", "désordre", "symptôme", "névrosisme", "narcissisme",
    "jalousie",
)

BANDEAU_DSIM = ("[D-SIM] Lecture issue d'une simulation — la mécanique est "
                "validée, pas la prévalence clinique.")

PHRASE_ORIENTATION = ("le chemin le plus court est de ne pas la porter "
                      "seul·e — l'orientation vers un professionnel de la "
                      "relation n'est pas un échec, c'est le pas qui compte ici")

# ─────────────────────────────────────────────────────────────────────────────
# R1/R2/R3 — PALIER ET SEUILS D'AIDE (purement mécaniques)
# ─────────────────────────────────────────────────────────────────────────────
def palier_et_seuils(conservateur_A: str, conservateur_B: str,
                     touches_A: list[str], touches_B: list[str]) -> dict:
    """Dérive le palier (R1) et les seuils d'aide (R2 S1, R3 S2)."""
    rang_A, rang_B = RANG_NIVEAU[conservateur_A], RANG_NIVEAU[conservateur_B]
    rang_quete = max(rang_A, rang_B)
    palier = PALIER_DE_RANG[rang_quete]
    s1 = [a for a, c in (("A", conservateur_A), ("B", conservateur_B)) if c == "Forte"]
    s2 = [a for a, t in (("A", touches_A), ("B", touches_B))
          if "Forte" in t and a not in s1]
    return {
        "rang_A": rang_A, "rang_B": rang_B, "rang_quete": rang_quete,
        "palier": palier, "palier_nom": PALIER_NOM[palier],
        "S1_axes": s1, "S2_axes": s2,
        "orientation_affichee": bool(s1),
        "surveillance_affichee": bool(s2),
    }


def palier_independant(somme_A: int, somme_B: int, demi_ci: float) -> dict:
    """COR2 — chemin de calcul INDÉPENDANT (entiers, avant arrondi).

    Recalcule rang conservateur et palier depuis les sommes d'items brutes
    (k/9 exact ± demi-CI) sans passer par les scores arrondis du cœur.
    Doit converger EXACTEMENT avec palier_et_seuils().
    """
    def rang_conservateur(somme: int) -> int:
        score = somme / 9.0
        bas, haut = score - demi_ci, score + demi_ci
        touches = []
        if bas < 1.80:
            touches.append(0)
        if haut >= 1.80 and bas < 2.60:
            touches.append(1)
        if haut >= 2.60 and bas < 3.20:
            touches.append(2)
        if haut >= 3.20:
            touches.append(3)
        return min(touches)

    def touche_forte(somme: int) -> bool:
        return somme / 9.0 + demi_ci >= 3.20

    rang_A = rang_conservateur(somme_A)
    rang_B = rang_conservateur(somme_B)
    s1 = [a for a, r in (("A", rang_A), ("B", rang_B)) if r == 3]
    s2 = [a for a, s in (("A", somme_A), ("B", somme_B))
          if a not in s1 and touche_forte(s)]
    return {
        "rang_A": rang_A, "rang_B": rang_B,
        "rang_quete": max(rang_A, rang_B),
        "palier": PALIER_DE_RANG[max(rang_A, rang_B)],
        "S1_axes": s1, "S2_axes": s2,
    }


# ─────────────────────────────────────────────────────────────────────────────
# R5/R6/R7/R8 — TEXTES ÉCRAN (descriptif causal, sans étiquette)
# ─────────────────────────────────────────────────────────────────────────────
_CAUSAL_FACE = {
    "A1": "ta vigie tourne en permanence — tu guettes les signes qui annoncent "
          "un éloignement, même quand il n'y en a pas",
    "A2": "tout passe par les mots — sans eux tu ne sais pas où tu en es, "
          "et l'attente devient lourde",
    "A3": "une petite rumeur intérieure amplifie ce que tu entends ou ne lis "
          "pas — un silence devient un message",
    "B1": "le près vous chauffe — quand l'autre se rapproche trop, tu "
          "cherches de l'air sans savoir pourquoi",
    "B2": "debout-seul te tient — demander de l'aide donne l'impression de "
          "perdre ton assise",
    "B3": "ta porte intérieure reste fermée — tu partages le quotidien, "
          "pas l'intérieur",
}


def _clause_ombre(axe: str, niveau: str, l4: dict) -> str:
    """Zone d'ombre — descriptif causal SANS étiquette (R5/R6/R7)."""
    nom = AXE_NOM_ECRAN[axe]
    if niveau == "Discrète":
        return f"Zone calme : ta {nom} ne pèse pas sur ton lien. Cette zone " \
               "est calme chez toi — rien à fabriquer ici."
    if niveau == "Tranquille":
        return f"Ta {nom} existe à bas bruit : elle se fait sentir par " \
               "moments, sans te diriger. Cette zone est calme chez toi — " \
               "rien à fabriquer ici non plus."
    prefixe = (f"Ta {nom} prend beaucoup de place au quotidien : "
               if niveau == "Forte" else f"Ta {nom} est active au quotidien : ")
    if l4["hierarchie_declarable"]:
        return prefixe + _CAUSAL_FACE[l4["face1"]]
    return prefixe + ("plusieurs portes sonnent en même temps, sans qu'une "
                      "seule domine — le nuage rend la cause difficile à nommer")


def _clause_force(axe: str, niveau: str) -> str:
    nom = AXE_NOM_ECRAN[axe]
    if niveau == "Discrète":
        return f"Ce qui te porte : ta {nom} ne t'envahit pas — tu as de la " \
               "marge pour accueillir l'autre."
    if niveau == "Tranquille":
        return f"Ce qui te porte : ta {nom} reste légère la plupart du temps " \
               "— ton lien garde de l'air."
    return ("Terrain de travail, pas un verdict : ce qui se mesure peut "
            "bouger — c'est exactement ce que montre cette lecture.")


_EXERCICE_FACE = {
    "A1": "quand la vigie se déclenche, noter le fait réel qui l'a lancée, "
          "puis une phrase qui commence par « je » (pas « tu »). Un carnet, "
          "deux minutes",
    "A2": "formuler une demande précise (« j'aimerais un mot avant de "
          "dormir ») plutôt qu'attendre que l'autre devine. Une petite "
          "demande par jour",
    "A3": "avant d'interpréter un silence, le vérifier par une question "
          "ouverte — la rumeur aime le vide, remplis-le de mots réels",
    "B1": "repérer les moments où le près chauffe et te donner une sortie "
          "honorable (une marche, une pièce, dix minutes) — sans rupture",
    "B2": "accepter une petite aide par jour, choisie et minuscule — l'assise "
          "ne tombe pas pour un appui emprunté",
    "B3": "partager un détail d'intérieur par jour (une pensée, une fatigue, "
          "une joie) — un seul, choisi",
}


def _clause_exercice(axe: str, l4: dict) -> str:
    nom = AXE_NOM_ECRAN[axe]
    if l4["hierarchie_declarable"]:
        return "🟢 À ta portée, seul·e : " + _EXERCICE_FACE[l4["face1"]] + "."
    return ("🟢 À ta portée, seul·e : tenir un petit journal des moments où "
            f"ta {nom} se fait sentir, sans chercher la cause au début — le "
            "motif apparaît seul après une semaine.")


def _clause_module(axe_A_niveau: str, axe_B_niveau: str) -> str:
    a_vif = axe_A_niveau in ("Vive", "Forte")
    b_vif = axe_B_niveau in ("Vive", "Forte")
    if a_vif and not b_vif:
        return ("🟠 À deux : un temps fixe de paroles sur ta peur de perdre — "
                "15 minutes par semaine, l'un parle, l'autre répète ce "
                "qu'il a entendu avant de répondre.")
    if b_vif and not a_vif:
        return ("🟠 À deux : un rituel de près dosable — un moment rapproché "
                "choisi d'un commun accord, avec le droit pour chacun de "
                "dire « assez pour aujourd'hui » sans commentaire.")
    if a_vif and b_vif:
        return ("🟠 À deux : les deux modules (temps de paroles + rituel de "
                "près), en commençant par celui qui pèse le plus chez toi — "
                "une seule chose à la fois.")
    return ""  # palier 🟢 : pas de module de couple affiché


def clause_orientation(axe: str) -> str:
    nom = AXE_NOM_ECRAN[axe]
    return f"🔴 Avec un professionnel : ta {nom} est lue Forte. {PHRASE_ORIENTATION}."


def _clause_surveillance(axe: str) -> str:
    nom = AXE_NOM_ECRAN[axe]
    return (f"Seuil approché : ta lecture de la {nom} touche la zone la plus "
            "haute sans s'y installer — à surveiller, re-test proposé à "
            "8 semaines.")


def _clause_seuil_atteint(axe: str) -> str:
    nom = AXE_NOM_ECRAN[axe]
    return f"Seuil atteint : ta {nom} est lue Forte — l'orientation est proposée."


def clause_aide_standing() -> str:
    return ("QUAND DEMANDER DE L'AIDE — seuils posés d'avance, les mêmes "
            "pour tout le monde : un axe lu Forte → parler à un professionnel "
            "est proposé ; une lecture qui touche la zone la plus haute sans "
            "s'y installer → à surveiller, re-test proposé ; des réponses "
            "trop rapides ou contradictoires → d'abord refaire le test, on "
            "ne lit rien sur du bruit.")


def clause_prudence() -> str:
    return ("Qualité de réponse : prudence — quelques incohérences ou de la "
            "vitesse se sont glissés dans tes réponses. Cette lecture se "
            "prend avec recul ; tu peux la refaire quand tu veux.")


def clause_suspension() -> str:
    return ("Lecture suspendue : tes réponses portent trop de signes de "
            "vitesse ou de contradiction pour être lues. Refais le test "
            "quand tu es calme — on ne lit rien sur du bruit.")


def bloc_ecran(lecture_A: dict, lecture_B: dict, l4_A: dict, l4_B: dict,
               pal: dict, statut: str = "OK") -> dict:
    """Assemble le bloc écran complet RIO-01 (toutes les clauses sont
    déterminées mécaniquement par les sorties du vrai cœur).

    R4 — qualité avant sens : statut INVALIDE → bloc de suspension seul
    (aucune lecture) ; PRUDENCE → lecture + mention de prudence ; OK →
    lecture seule.
    """
    if statut == "INVALIDE":
        texte = "\n".join([BANDEAU_DSIM, clause_suspension()])
        return {
            "texte": texte,
            "md5": hashlib.md5(texte.encode("utf-8")).hexdigest(),
            "nb_mots_interdits": sum(1 for m in MOTS_INTERDITS if m in texte.lower()),
            "suspendu": True,
        }
    nivA, nivB = lecture_A["niveau_conservateur"], lecture_B["niveau_conservateur"]
    parties = [BANDEAU_DSIM]
    parties.append(f"Ta peur de perdre se lit {lecture_A['lecture']}, "
                   f"ta peur de dépendre se lit {lecture_B['lecture']}.")
    parties.append(_clause_ombre("A", nivA, l4_A))
    parties.append(_clause_ombre("B", nivB, l4_B))
    parties.append(_clause_force("A", nivA))
    parties.append(_clause_force("B", nivB))
    parties.append(f"CE QUE TU PEUX CHANGER — palier {pal['palier']} "
                   f"({pal['palier_nom']}) :")
    axe_dom = "A" if pal["rang_A"] >= pal["rang_B"] else "B"
    parties.append(_clause_exercice(axe_dom, l4_A if axe_dom == "A" else l4_B))
    module = _clause_module(nivA, nivB)
    if module:
        parties.append(module)
    for a in pal["S1_axes"]:
        parties.append(_clause_seuil_atteint(a))
        parties.append(clause_orientation(a))
    for a in pal["S2_axes"]:
        parties.append(_clause_surveillance(a))
    parties.append(clause_aide_standing())
    if statut == "PRUDENCE":
        parties.append(clause_prudence())
    texte = "\n".join(parties)
    return {
        "texte": texte,
        "md5": hashlib.md5(texte.encode("utf-8")).hexdigest(),
        "nb_mots_interdits": sum(1 for m in MOTS_INTERDITS if m in texte.lower()),
        "suspendu": False,
    }


# ─────────────────────────────────────────────────────────────────────────────
# F4 — FRAGMENT DE BILAN L8 (7 blocs) — junctions VRAIES q4/q5
# ─────────────────────────────────────────────────────────────────────────────
def bilan_fragment(lecture_A: dict, lecture_B: dict, l4_A: dict, l4_B: dict,
                   scores: dict, pal: dict, statut: str = "OK") -> dict:
    """Contribution de RIO-01 au bilan d'ensemble (assemblage L8 du canon).

    7 blocs : position · forme · empreinte · couple · force · limites ·
    palier/pas. Les blocs empreinte/couple pointent les VRAIES tables des
    moteurs Q5 (empreintes, pas) et Q4 (types, 9 configurations).
    """
    nivA, nivB = lecture_A["niveau_conservateur"], lecture_B["niveau_conservateur"]
    sA, sB = scores["A"], scores["B"]
    face_q5 = core_q5.face_dominante(sA, sB)          # VRAI moteur Q5
    type_q4 = core_q4.type_attachement(sA, sB)        # VRAI moteur Q4
    configs_possibles = [
        config for (t1, _), config in core_q4._CONFIG_TABLE.items() if t1 == type_q4
    ]
    pas_possibles = {
        emp: core_q5._PAS_TABLE[(face_q5, emp)] for emp in core_q5.EMPREINTES
    }
    force = [AXE_NOM_ECRAN[a] for a, n in (("A", nivA), ("B", nivB))
             if n in ("Discrète", "Tranquille")]
    limites = [AXE_NOM_ECRAN[a] for a, n in (("A", nivA), ("B", nivB))
               if n in ("Vive", "Forte")]
    fragment = {
        "bloc_1_position": {
            "A": {"score": sA, "conservateur": nivA,
                  "lecture": lecture_A["lecture"]},
            "B": {"score": sB, "conservateur": nivB,
                  "lecture": lecture_B["lecture"]},
            "qualite_reponse": statut,
        },
        "bloc_2_forme": {
            "A": {"hierarchie": l4_A["lecture"], "ordre": ">".join(l4_A["ordre"])},
            "B": {"hierarchie": l4_B["lecture"], "ordre": ">".join(l4_B["ordre"])},
        },
        "bloc_3_empreinte": {
            "source": "RIO-02 — vraie table Q5 (EMPREINTES)",
            "face_q5": face_q5,
            "empreintes_possibles": sorted(core_q5.EMPREINTES),
        },
        "bloc_4_couple": {
            "source": "RIO-04 — vraie table Q4 (CONFIGS_9)",
            "type_mesure": type_q4,
            "configurations_atteignables": sorted(configs_possibles),
        },
        "bloc_5_force": force if force else ["terrain de travail, pas un verdict"],
        "bloc_6_limites": limites if limites else ["aucune zone active — rien à fabriquer"],
        "bloc_7_palier_pas": {
            "palier": pal["palier"],
            "pas_possibles": pas_possibles,
            "pas_labels": sorted({core_q5.PAS_LABELS[p] for p in pas_possibles.values()}),
            "retest": "re-test RIO-01 proposé à 8 semaines (changement fiable "
                      "du vrai cœur : |Δ| ≥ 0,58381)",
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
