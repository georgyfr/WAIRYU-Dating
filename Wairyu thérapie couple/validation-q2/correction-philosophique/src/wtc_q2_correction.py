# -*- coding: utf-8 -*-
"""
WTC-Q2 — COUCHE DE CORRECTION PHILOSOPHIQUE (fichier SUPPLÉMENTAIRE)
=====================================================================
RIO-02 « Ce qui m'effraie vraiment » — rattrapage au gabarit universel
§5.1-§5.4 du canon (demande fondateur, trace 1a15ed7ad00bc0fd ; même
gabarit que la correction RIO-01, Task 165, commit 2a7a2f9).

RÈGLE ABSOLUE : ce module NE MODIFIE AUCUN moteur existant.
- Le vrai cœur de la quête reste `validation-q2-r1/src/wtc_q2_core.py`
  (révision R1, D-Q2-A à D-Q2-F) — importé tel quel, jamais recopié.
- Les junctions utilisent les VRAIS moteurs `validation-q4/src/wtc_q4_core.py`
  (croisement à deux) et `validation-q5/src/wtc_q5_core.py` (pas + suivi).
- Cette couche ajoute ce que l'audit (Task 163) a trouvé manquant sur
  RIO-02 : F2 « QUAND DEMANDER DE L'AIDE » (seuils S1/S2) + zone d'ombre
  causale affichée (12/25) ; F3 contenu des 3 paliers + branchement quête
  « pas » (6/25) ; F4 fragment de bilan L8 à 7 blocs (10/25).

Particularité RIO-02 (consignée) : le VRAI cœur calcule DÉJÀ le palier
🟢🟠🔴 (fonction `palier`, validée P1 par C5b : 437/437 sans écart) et la
voie de sécurité H5 (fonction `signal_securite`). La couche les AFFICHE et
ajoute les seuils d'aide — elle n'invente aucune règle de sévérité.

Règles pré-enregistrées (écrites avant tout calcul, calquées sur R1-R9 de
la correction RIO-01) :
- R1 (palier) : le palier affiché est celui du VRAI moteur Q2
  `palier(i_alarm, sA, sB, comp, sig)` — 🟢/🟠/🔴, sévérité maximale
  entre filet et données. La couche n'ajoute aucun palier parallèle.
- R2 (seuil d'aide S1) : sig["signal"] OU sig["p_filtre"] OU palier 🔴
  → orientation chaleureuse affichée (phrase canon) ; la voie H5 est le
  court-circuit de cette quête (signal → écrans sécurité ; p_filtre →
  filtre du Cadran) — contrairement à RIO-01, D-CRISE est APPLICABLE ici
  via le vrai `signal_securite`.
- R3 (seuil d'aide S2) : palier 🟠 sans S1, OU étiquette de chute
  ALARME SANS MAIN (type NON_NOMMÉ avec i_alarm ≥ 5) sans S1
  → « à surveiller », re-test à 8 semaines proposé (seuils du vrai
  `longitudinal` : alarme ±2 · gestes ±0,15 — marqué NON TESTÉ D-Q2-F
  dans le package R1, consigné honnêtement).
- R4 (qualité avant sens) : le gate de qualité de RIO-02 est la
  CONVERGENCE Q1×Q2 (le vrai garde du cœur, D-Q2-2) — index 0,00
  → étiquette d'OMBRE masquée (jamais posée, note de suppression
  affichée, template SUPPRESSION_MASQUEE du cœur) ; index 0,50
  → OMBRE_PRUDENCE + mention de prudence ; index 1,00 → lecture.
- R5 (anti-fabrication §5.5) : la force affichée est EXACTEMENT celle du
  vrai `zone_force` (bijection valeur↔texte, vérifiée configuration par
  configuration) ; « rien à fabriquer » n'apparaît que sur ZONE CALME ;
  sur force SILENCIEUSE avec ombre active → « terrain de travail, pas un
  verdict » (canon §5.5) ; sur force SILENCIEUSE sans ombre → silence
  gardé, aucune force fabriquée.
- R6 (force silencieuse) : reprise du vocabulaire canon — voir R5.
- R7 (vocabulaire écran, canon Partie 9) : aucun mot de la liste interdite
  dans tout texte affiché ; les libellés du cœur (LES DEUX · PEUR DE
  PERDRE · PEUR D'ÊTRE ÉTOUFFÉE · ZONE CALME · ALARME SANS MAIN · SIGNAL
  LÉGER NON NOMMÉ) sont des noms maison descriptifs, repris tels quels.
- R8 (D-SIM) : bandeau simulation sur chaque bloc écran.
- R9 (couplage réel) : le pas annoncé provient du VRAI
  `selectionner_pas(sA, sB, label)` du cœur Q5 (face dominante Q1 ×
  empreinte Q2) ; suivi 14 jours par le vrai `suivre_14_jours`
  (seuils 9/7, sanction None) ; re-test Q1 à 8 semaines par le vrai
  `programmer_re_test_q1`.
"""

from __future__ import annotations

import hashlib
import importlib.util
import sys
from pathlib import Path

# ─────────────────────────────────────────────────────────────────────────────
# CHARGEMENT DES VRAIS MOTEURS (jamais recopiés, jamais modifiés)
# ─────────────────────────────────────────────────────────────────────────────
_PKG = Path(__file__).resolve().parents[1]           # …/validation-q2/correction-philosophique
_WTC = _PKG.parents[1]                               # …/Wairyu thérapie couple


def _charge(nom: str, chemin: Path):
    spec = importlib.util.spec_from_file_location(nom, chemin)
    mod = importlib.util.module_from_spec(spec)
    sys.modules[nom] = mod
    spec.loader.exec_module(mod)
    return mod


core_q2 = _charge("wtc_q2_core_r1", _WTC / "validation-q2-r1" / "src" / "wtc_q2_core.py")
core_q4 = _charge("wtc_q4_core", _WTC / "validation-q4" / "src" / "wtc_q4_core.py")
core_q5 = _charge("wtc_q5_core", _WTC / "validation-q5" / "src" / "wtc_q5_core.py")

# Vérification d'intégrité des moteurs chargés (ce sont bien les vrais) :
assert len(core_q2.D_ITEMS) == 6 and len(core_q2.P_ITEMS) == 4
assert len(core_q2.H_ITEMS) == 5 and len(core_q2.R_ITEMS) == 3
assert core_q2.verifier_templates() == []            # 35/35 (C5a du package R1)
assert len(core_q4.CONFIGS_9) == 9
assert core_q5.SEUIL_CELEBRE == 9 and len(core_q5.EMPREINTES) == 3

# ─────────────────────────────────────────────────────────────────────────────
# CONSTANTES DE LA COUCHE (R1-R9)
# ─────────────────────────────────────────────────────────────────────────────
PALIER_NOM = {"🟢": "Seul·e — exercice maison", "🟠": "À deux — module de couple",
              "🔴": "Avec un professionnel — orientation chaleureuse"}

LABELS_OMBRE = ("LES DEUX", "PEUR DE PERDRE", "PEUR D'ÊTRE ÉTOUFFÉE")

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

# Bandes exactes des entrées continues (sA/sB/i_alarm) — l'espace des états
# moteur distincts. Les seuils du cœur+couche sont : sA ∈ {2,61 · 3,21 ·
# 3,70} · sB ∈ {2,61 · 3,21} · i_alarm ∈ {4|5 · 5|6 · 6|7 · 7|8} (inventaire
# vérifié mot pour mot dans le code des moteurs) — chaque bande est plate
# pour TOUTES les comparaisons (batterie de frontière du pipeline).
SA_BANDS = [("A1", 2.0), ("A2", 2.8), ("A3", 3.3), ("A4", 3.8)]
SB_BANDS = [("B1", 2.0), ("B2", 2.8), ("B3", 3.3)]
IAL_BANDS = [("I1", 2), ("I2", 5), ("I3", 6), ("I4", 7), ("I5", 9)]


def bande_sA(s: float) -> int:
    return 0 if s < 2.61 else 1 if s < 3.21 else 2 if s < 3.70 else 3


def bande_sB(s: float) -> int:
    return 0 if s < 2.61 else 1 if s < 3.21 else 2


def bande_ial(v: int) -> int:
    return 0 if v <= 4 else 1 if v == 5 else 2 if v == 6 else 3 if v == 7 else 4


# ─────────────────────────────────────────────────────────────────────────────
# COR2 — CHEMIN INDÉPENDANT DU PALIER (entiers et bandes, sans le moteur)
# ─────────────────────────────────────────────────────────────────────────────
def palier_independant(cd: int, cp: int, hb: int, rb: int, h5f: int,
                       ial: int, sA: float, sB: float) -> dict:
    """Recalcule signal + palier depuis les quantités BRUTES (sommes d'items,
    comptages) sans appeler `signal_securite` ni `palier` du cœur.
    Doit converger EXACTEMENT avec les sorties du vrai moteur (COR2)."""
    hn = round(hb / 15, 3)
    rn = round(rb / 9, 3)
    somme = round(hn + rn, 3)
    signal = (h5f >= 1) and (sA >= 3.21 or ial >= 7)
    p_filtre = (h5f == 3) and (sA >= 3.70)
    if signal or ial >= 8 or sA >= 3.70 or (sA >= 3.21 and sB >= 3.21):
        palier = "🔴"
    elif ial >= 6 or 0.30 <= somme < 0.60:
        palier = "🟠"
    else:
        palier = "🟢"
    return {"signal": signal, "p_filtre": p_filtre, "palier": palier,
            "somme": somme}


# ─────────────────────────────────────────────────────────────────────────────
# R4/R5/R6/R7/R8 — TEXTES ÉCRAN (descriptif causal, sans étiquette clinique)
# ─────────────────────────────────────────────────────────────────────────────
_LECTURE_LABEL = {
    "LES DEUX":
        "Ce qui t'effraie se lit LES DEUX : les deux peurs parlent en même "
        "temps — perdre l'autre et être étouffé·e.",
    "PEUR DE PERDRE":
        "Ce qui t'effraie se lit PEUR DE PERDRE : c'est l'éloignement qui "
        "déclenche l'alarme.",
    "PEUR D'ÊTRE ÉTOUFFÉE":
        "Ce qui t'effraie se lit PEUR D'ÊTRE ÉTOUFFÉE : c'est le près qui "
        "déclenche l'envie d'air.",
    "ZONE CALME":
        "Ce qui t'effraie se lit ZONE CALME : peu de déclencheurs, peu de "
        "comportements — rien à fabriquer ici.",
    "ALARME SANS MAIN":
        "Ce qui t'effraie se lit ALARME SANS MAIN : une alarme sonne sans "
        "main pour la porter — le signal est tracé, il remontera s'il se "
        "confirme.",
    "SIGNAL LÉGER NON NOMMÉ":
        "Ce qui t'effraie se lit SIGNAL LÉGER NON NOMMÉ : un signal discret "
        "est passé — il est tracé sans être nommé, il remontera s'il se "
        "confirme.",
}

_NOTE_SUPPRESSION = (
    "Concordance en attente : ta mesure et tes réponses ne concordent pas "
    "encore — l'étiquette d'ombre n'est pas posée, aucun nommage fabriqué. "
    "Le profil reste consultable ; refais le test à tête reposée, la lecture "
    "reprendra quand tout concordera.")

_NOTE_PRUDENCE = (
    "Convergence partielle : ta mesure et tes réponses ne concordent qu'à "
    "moitié — cette lecture se prend avec recul ; le re-test à 8 semaines "
    "la confirmera.")

_CLAUSE_PROFIL = {
    "RARES":
        "Tes déclencheurs sont rares : peu de situations allument la peur.",
    "DISTANCE":
        "Tes déclencheurs vivent du côté de la distance : c'est quand "
        "l'autre s'éloigne que la peur s'allume.",
    "PROXIMITE":
        "Tes déclencheurs vivent du côté du près : c'est quand ça se "
        "resserre que la peur s'allume.",
    "DEUX_COTES":
        "Tes déclencheurs vivent des deux côtés : distance et près allument "
        "la peur.",
    "MIXTE_LEGERS":
        "Tes déclencheurs restent légers et mêlés : quelques situations des "
        "deux côtés, à bas bruit.",
}

_CLAUSE_COMP = {
    "H": "Côté gestes : tes mains s'accrochent — chercher le contact et les "
         "mots pour apaiser l'alarme.",
    "R": "Côté gestes : tes mains lâchent — prendre de l'air pour apaiser "
         "la pression.",
    "MIXTE": "Côté gestes : parfois s'accrocher, parfois lâcher — les deux "
             "gestes se répondent.",
    "LEGER": "Côté gestes : les gestes restent légers — la peur se vit plus "
             "qu'elle ne se joue.",
}

# Bijection force réelle ↔ texte (R5) — la force affichée EST celle du vrai
# zone_force ; SILENCIEUSE a deux variantes (ombre active / pas d'ombre).
_CLAUSE_FORCE = {
    "SECURISANT":
        "Ce qui te porte : une base sécurisante — elle t'a protégé·e là où "
        "tu as grandi, et elle tient encore debout.",
    "CALME_RICHE":
        "Ce qui te porte : un calme qui a de la substance — il se voit dans "
        "tes réponses, pas fabriqué.",
    "LUCIDITE":
        "Ce qui te porte : la lucidité — voir les deux peurs en face, c'est "
        "déjà un pas.",
    "MAINSLIBRES":
        "Ce qui te porte : des mains libres — les déclencheurs existent, "
        "mais ils ne saisissent plus.",
}
_FORCE_SILENCIEUSE_OMBRAGEE = (
    "Terrain de travail, pas un verdict : ce qui se mesure peut bouger — "
    "c'est exactement ce que montre cette lecture.")
_FORCE_SILENCIEUSE_CALME = (
    "Silence gardé : aucune force fabriquée quand les réponses n'en "
    "montrent pas — le positif se sélectionne, jamais inventé.")

_EXERCICE_LABEL = {
    "LES DEUX":
        "🟢 À ta portée, seul·e : tenir un petit journal des deux alarmes — "
        "laquelle a sonné, et ce qu'elle demandait. Le motif apparaît seul "
        "après une semaine.",
    "PEUR DE PERDRE":
        "🟢 À ta portée, seul·e : quand l'alarme sonne, noter le fait réel "
        "qui l'a lancée, puis une phrase qui commence par « je ». Un carnet, "
        "deux minutes.",
    "PEUR D'ÊTRE ÉTOUFFÉE":
        "🟢 À ta portée, seul·e : quand le près serre, te donner une sortie "
        "honorable — une marche, une pièce, dix minutes. Sans rupture.",
    "ZONE CALME":
        "🟢 À ta portée, seul·e : entretenir ce qui marche — noter une fois "
        "par semaine un moment où le lien a été simple. Trois minutes.",
    "ALARME SANS MAIN":
        "🟢 À ta portée, seul·e : noter les moments où l'alarme sonne sans "
        "raison claire — le trac prépare la conversation à venir.",
    "SIGNAL LÉGER NON NOMMÉ":
        "🟢 À ta portée, seul·e : noter le signal discret passé — le trac "
        "prépare la conversation à venir.",
}
_EXERCICE_SUPPRESSION = (
    "🟢 À ta portée, seul·e : refaire le test à tête reposée — la lecture "
    "reprendra quand les réponses et la mesure concorderont.")

_CLAUSE_MODULE = {
    "H": "🟠 À deux : un temps fixe de paroles sur ce qui fait peur quand "
         "l'autre s'éloigne — 15 minutes par semaine ; l'un parle, l'autre "
         "répète ce qu'il a entendu avant de répondre.",
    "R": "🟠 À deux : un rituel de près dosable — un moment rapproché choisi "
         "à deux, avec le droit pour chacun de dire « assez pour "
         "aujourd'hui » sans commentaire.",
    "MIXTE": "🟠 À deux : les deux rituels (paroles + près dosable), en "
             "commençant par celui qui pèse le plus — une seule chose à la "
             "fois.",
    "LEGER": "🟠 À deux : un temps de paroles hebdomadaire sur ce qui monte "
             "sans se dire — 15 minutes ; l'un parle, l'autre répète avant "
             "de répondre.",
}

_ORIENTATION_ROUGE = (
    "🔴 Avec un professionnel : la sévérité la plus haute est atteinte — "
    + PHRASE_ORIENTATION + ".")
_ORIENTATION_SIGNAL = (
    "🔴 Signal sécurité actif : la sécurité passe avant la lecture — "
    + PHRASE_ORIENTATION + ".")
_ORIENTATION_PFILTRE = (
    "🔴 Filtre de sécurité rejoint : la lecture s'efface derrière l'aide — "
    + PHRASE_ORIENTATION + ".")

_SURVEILLANCE_PALIER = (
    "À surveiller : le palier intermédiaire est atteint sans le plus haut — "
    "re-test proposé à 8 semaines (seuils du vrai re-test : alarme ±2 · "
    "gestes ±0,15).")
_SURVEILLANCE_ALARME = (
    "À surveiller : l'alarme sonne sans main pour la porter — le signal est "
    "tracé et remontera s'il se confirme ; re-test proposé à 8 semaines.")

CLAUSE_AIDE_STANDING = (
    "QUAND DEMANDER DE L'AIDE — seuils posés d'avance, les mêmes pour tout "
    "le monde : quand l'alarme sonne souvent et fort, la sécurité passe "
    "avant la lecture et un professionnel est proposé ; quand un profil "
    "rejoint le filtre de sécurité, la lecture s'efface derrière l'aide ; "
    "au palier intermédiaire, à surveiller avec un re-test proposé ; quand "
    "les réponses ne concordent pas avec la mesure, l'étiquette n'est pas "
    "posée — on reprend quand c'est calme.")

_LIGNE_SUIVI = (
    "Suivi 14 jours prévu : célébré dès 9 jours tenus, ajustement à 7-8, "
    "reprise en douceur en dessous — jamais de sanction.")
_LIGNE_RETEST = (
    "Re-test à 8 semaines : la mesure sera reprise (alarme ±2 · gestes "
    "±0,15) pour voir ce qui a bougé — programmé, jamais forcé.")


def clause_force(zf: str, label: str) -> str:
    """La clause de force EXACTEMENT liée au vrai zone_force (R5)."""
    if zf in _CLAUSE_FORCE:
        return _CLAUSE_FORCE[zf]
    if zf == "SILENCIEUSE":
        return (_FORCE_SILENCIEUSE_OMBRAGEE if label in LABELS_OMBRE
                else _FORCE_SILENCIEUSE_CALME)
    raise ValueError(f"zone_force inconnue : {zf!r}")


def clause_orientation(sig: dict, pal: str) -> str | None:
    """S1 (R2) — orientation affichée, une seule ligne, priorité sûreté."""
    if not (sig["signal"] or sig["p_filtre"] or pal == "🔴"):
        return None
    if sig["p_filtre"]:
        return _ORIENTATION_PFILTRE
    if sig["signal"]:
        return _ORIENTATION_SIGNAL
    return _ORIENTATION_ROUGE


def clause_surveillance(sig: dict, pal: str, nom: dict, i_alarm: int) -> str | None:
    """S2 (R3) — à surveiller, re-test proposé."""
    if clause_orientation(sig, pal) is not None:
        return None
    if pal == "🟠":
        return _SURVEILLANCE_PALIER
    if nom["type"] == "NON_NOMMÉ" and i_alarm >= 5:
        return _SURVEILLANCE_ALARME
    return None


def _scan(texte: str) -> int:
    t = texte.lower()
    return sum(1 for m in MOTS_INTERDITS if m in t)


# Mémoïsation des assemblages (les sorties sont déterministes et peu
# nombreuses au regard de l'espace) — même objet renvoyé, lecture seule.
_BLOC_CACHE: dict = {}
_FRAG_CACHE: dict = {}
_PAS_CACHE: dict = {}


def _pas(sA: float, sB: float, label: str) -> dict:
    """VRAI `selectionner_pas` du cœur Q5, mémoïsé (les paires de scores
    rencontrées sont finies : représentants de bandes et 437 archivées) —
    la fonction réelle est appelée à chaque nouvelle clé, jamais recopiée."""
    cle = (sA, sB, label)
    hit = _PAS_CACHE.get(cle)
    if hit is None:
        hit = core_q5.selectionner_pas(sA, sB, label)
        _PAS_CACHE[cle] = hit
    return hit


def bloc_ecran(prof: dict, comp: dict, nom: dict, conv: dict, sig: dict,
               pal: str, zf: str, sA: float, sB: float, i_alarm: int) -> dict:
    """Assemble le bloc écran complet RIO-02 — toutes les clauses sont
    déterminées par les sorties du VRAI cœur (profil, comportements,
    nommage, convergence, signal, palier, zone_force).

    R4 — qualité avant sens : convergence 0,00 → ombre masquée + note de
    suppression ; 0,50 → OMBRE_PRUDENCE + mention ; 1,00 → lecture.
    """
    label = nom["label"]
    parties = [BANDEAU_DSIM, _LECTURE_LABEL[label]]
    if conv["supprime"]:
        parties.append(_NOTE_SUPPRESSION)
    elif nom["type"] == "OMBRE_PRUDENCE":
        parties.append(_NOTE_PRUDENCE)
    parties.append(_CLAUSE_PROFIL[prof["profil"]])
    parties.append(_CLAUSE_COMP[comp["domination"]])
    parties.append(clause_force(zf, label))
    parties.append(f"CE QUE TU PEUX CHANGER — palier {pal} ({PALIER_NOM[pal]}) :")
    parties.append(_EXERCICE_SUPPRESSION if conv["supprime"]
                   else _EXERCICE_LABEL[label])
    if pal == "🟠":
        parties.append(_CLAUSE_MODULE[comp["domination"]])
    orient = clause_orientation(sig, pal)
    if orient:
        parties.append(orient)
    surveil = clause_surveillance(sig, pal, nom, i_alarm)
    if surveil:
        parties.append(surveil)
    parties.append(CLAUSE_AIDE_STANDING)
    pas = _pas(sA, sB, label)                         # VRAI moteur Q5 (mémoïsé)
    parties.append(f"Pas annoncé (vraie table Q5) : {pas['label']} — "
                   f"sélectionné par la face dominante ({pas['face']}) et "
                   f"l'empreinte de cette quête ({pas['empreinte']}).")
    parties.append(_LIGNE_SUIVI)
    parties.append(_LIGNE_RETEST)
    cle = tuple(parties)
    hit = _BLOC_CACHE.get(cle)
    if hit is not None:
        return hit
    texte = "\n".join(parties)
    out = {
        "texte": texte,
        "md5": hashlib.md5(texte.encode("utf-8")).hexdigest(),
        "nb_mots_interdits": sum(_scan(p) for p in parties),
        "supprime": bool(conv["supprime"]),
        "rien_a_fabriquer": "rien à fabriquer" in texte,
        "label": label,
        "type": nom["type"],
        "palier": pal,
        "zf": zf,
        "force_clause_ok": (parties[6] == clause_force(zf, label)),
        "pas": pas["pas"],
        "empreinte": pas["empreinte"],
        "face": pas["face"],
    }
    _BLOC_CACHE[cle] = out
    return out


# ─────────────────────────────────────────────────────────────────────────────
# F4 — FRAGMENT DE BILAN L8 (7 blocs) — junctions VRAIES q4/q5
# ─────────────────────────────────────────────────────────────────────────────
def bilan_fragment(prof: dict, comp: dict, nom: dict, conv: dict, sig: dict,
                   pal: str, zf: str, sA: float, sB: float,
                   i_alarm: int) -> dict:
    """Contribution de RIO-02 au bilan d'ensemble (assemblage L8 du canon).

    7 blocs : position · forme · empreinte · couple · force · limites ·
    palier/pas. Les blocs empreinte/couple pointent les VRAIES tables des
    moteurs Q5 (empreinte, pas) et Q4 (types, 9 configurations).
    """
    cle = (prof["profil"], prof["count_d"], prof["count_p"],
           comp["domination"], comp["h_norm"], comp["r_norm"], comp["somme"],
           nom["label"], nom["type"], conv["index"], conv["supprime"],
           conv["prudence"], sig["signal"], sig["p_filtre"], pal, zf,
           sA, sB, i_alarm)
    hit = _FRAG_CACHE.get(cle)
    if hit is not None:
        return hit
    label = nom["label"]
    type_q4 = core_q4.type_attachement(sA, sB)        # VRAI moteur Q4
    configs_possibles = sorted({
        config for (t1, _), config in core_q4._CONFIG_TABLE.items()
        if t1 == type_q4
    })
    pas = _pas(sA, sB, label)                         # VRAI moteur Q5 (mémoïsé)
    if label in LABELS_OMBRE:
        limites = [label]
    elif nom["type"] == "NON_NOMMÉ":
        limites = ["signal tracé, non nommé — à surveiller"]
    else:
        limites = ["aucune zone active — rien à fabriquer"]
    if sig["signal"]:
        limites = limites + ["signal sécurité actif — la sûreté passe avant la lecture"]
    elif sig["p_filtre"]:
        limites = limites + ["filtre de sécurité rejoint — la lecture s'efface derrière l'aide"]
    etat_conv = ("SUPPRIMÉ" if conv["supprime"]
                 else "PRUDENCE" if conv["prudence"] else "CONVERGENT")
    fragment = {
        "bloc_1_position": {
            "label": label, "type_sortie": nom["type"],
            "palier": pal, "i_alarm": i_alarm,
            "convergence": {"index": conv["index"], "etat": etat_conv},
            "scores_Q1": {"sA": sA, "sB": sB},
            "voie_securite": {"signal": sig["signal"], "p_filtre": sig["p_filtre"]},
        },
        "bloc_2_forme": {
            "profil_declencheurs": prof["profil"],
            "comptages": {"distance": prof["count_d"], "proximite": prof["count_p"]},
            "gestes": {"domination": comp["domination"],
                       "mains_accrochees": comp["h_norm"],
                       "mains_lachees": comp["r_norm"], "somme": comp["somme"]},
        },
        "bloc_3_empreinte": {
            "source": "RIO-02 — vraie table Q5 (EMPREINTES)",
            "empreinte": pas["empreinte"],
            "empreintes_existantes": sorted(core_q5.EMPREINTES),
        },
        "bloc_4_couple": {
            "source": "RIO-04 — vraie table Q4 (CONFIGS_9)",
            "type_mesure": type_q4,
            "configurations_atteignables": configs_possibles,
        },
        "bloc_5_force": [zf] if zf != "SILENCIEUSE"
                        else ["silence gardé — aucune force fabriquée"],
        "bloc_6_limites": limites,
        "bloc_7_palier_pas": {
            "palier": pal,
            "pas": pas["pas"],
            "pas_label": pas["label"],
            "suivi_14j": {"categories": ["CELEBRE ≥ 9", "AJUSTEMENT 7-8",
                                         "REPRISE ≤ 6"],
                          "sanction": "aucune — jamais (le vrai moteur "
                                      "renvoie None, vérifié 15/15)"},
            "retest": "re-test à 8 semaines — alarme ±2 · gestes ±0,15 "
                      "(vrai longitudinal du cœur, NON TESTÉ D-Q2-F, "
                      "consigné) + re-test Q1 à 8 semaines (vraie table Q5)",
        },
    }
    fragment["_complet"] = all(
        v not in (None, "", [], {}) for v in _valeurs_feuilles(fragment)
    )
    _FRAG_CACHE[cle] = fragment
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
