"""
═══════════════════════════════════════════════════════════════════════════════
WTC — BILANS DE DIMENSION (Action n°2 de l'audit 23-RIO) — MOTEUR D'ASSEMBLAGE
L8
═══════════════════════════════════════════════════════════════════════════════
Le « bilan de dimension » — assemblage L8 en 7 blocs — est la pièce exacte de
la demande fondateur « lorsque un monde est terminé » (audit §4 constat 4,
§5 action 2 ; canon §6.1 couche L8 : « position · forme · empreinte · couple ·
force · limites · palier/pas » + flux vers la suite).

CONCEPTION — zéro fabrication :
- Ce moteur N'EXÉCUTE AUCUN INSTRUMENT. Il reçoit les RÉSULTATS RÉELS des
  moteurs validés P1 de la dimension (importés par wtc_bilan_adapters avec
  asserts d'intégrité à l'import) et les ASSEMBLE.
- Chaque bloc est soit un contenu verbatim d'un moteur réel, soit une
  CONSIGNATION explicite (zone calme « rien à fabriquer », hors-jeu,
  non-entrée). Jamais de texte inventé pour remplir un bloc.
- Vocabulaire écran : doctrine confirmée (ADDENDUM du 21/10, trace
  1a15eca977dc8259) — déceler sans nommer. MOTS_INTERDITS = liste canonique
  portée telle quelle des packages de correction (D-Q5, génération 3).
- Tout fragment porte le bandeau D-SIM canonique (100 % des preuves sont des
  simulations — constat n°1 de l'audit, VALID-01 en attente).

7 BLOCS (canon §6.1 couche L8, portés au niveau dimension) :
  1. position   — les niveaux réellement mesurés par les quêtes de la dimension
  2. forme      — la configuration réelle nommée (croisement de la dimension)
  3. empreinte  — les inférences situationnelles réelles
  4. couple     — la lecture de couple réelle (percentiles / boucle / palier)
  5. force      — les forces réellement dérivées (banques réelles)
  6. limites    — les zones d'ombre réelles (descriptif causal sans étiquette)
  7. palier_pas — le palier réel + le pas réel de la banque + suivi/re-test
+ flux          — la consignation descriptive « monde terminé » (gabarit A6)
"""
from __future__ import annotations

import hashlib

BLOCS = ("position", "forme", "empreinte", "couple",
         "force", "limites", "palier_pas")

MOTS_INTERDITS = (
    "pathologie", "diagnostic", "dépistage", "anxieux", "anxiété",
    "évitement", "évitant", "évitante", "désorganisé", "trouble",
    "syndrome", "désordre", "symptôme", "névrosisme", "narcissisme",
    "jalousie",
)

# Exception SOURCÉE (portage fidèle de la convention RIO-12, cf. son COR4) :
# « trouble » = NOM DE CASE du canon (ligne 133, banque de pas réelle Q5 :
# « 3 cases : trouble / toi / désaccord ») — neutralisée avant décompte,
# jamais une étiquette du répondant. La neutralisation porte sur la
# séquence EXACTE de l'énumération de cases — jamais sur le mot seul.
EXCEPTIONS_SOURCEES = (
    "trouble / toi / désaccord",
)
EXCEPTIONS_PROVENANCE = (
    "« trouble » = nom de case du canon (ligne 133, banque de pas réelle "
    "Q5) — neutralisé avant décompte, jamais une étiquette du répondant "
    "(convention RIO-12, COR4)"
)

BANDEAU_DSIM = ("[D-SIM] Lecture issue d'une simulation — la mécanique est "
                "validée, aucun être humain n'a encore répondu (VALID-01).")

ZONE_CALME_CONSIG = ("Cette zone est calme chez toi — rien à fabriquer. "
                     "Terrain de travail, pas un verdict.")

HORS_JEU_CONSIG = "Aucun résultat affiché — consignation explicite, feuille jamais vide."


def scan_interdits(texte: str) -> int:
    """Nombre de mots interdits (vocabulaire écran — doctrine confirmée).
    Les exceptions SOURCÉES (noms de cases du canon, convention RIO-12)
    sont neutralisées avant décompte — sur leur séquence exacte seulement."""
    bas = texte.lower()
    for exc in EXCEPTIONS_SOURCEES:
        bas = bas.replace(exc.lower(), " ⟨case-canon⟩ ")
    return sum(1 for m in MOTS_INTERDITS if m in bas)


def consignation(raison: str) -> dict:
    """Consignation explicite — un bloc qui ne dit rien DIT qu'il ne dit rien."""
    return {"consignation": raison, "contenu": None}


def assembler(dimension: str, blocs: dict, flux: str,
              chemin: str) -> dict:
    """Assemble le fragment bilan L8 d'une dimension.

    dimension    : nom réel de la dimension (ex. « Attachement »)
    blocs        : dict {bloc: {"titre":…, "lignes": […]} | consignation()}
    flux         : consignation descriptive du monde (gabarit A6 — réel)
    chemin       : "mono" | "couple" | "non_entree" (chemin réel traité)
    """
    assert dimension and isinstance(dimension, str)
    assert chemin in ("mono", "couple", "non_entree"), chemin
    manquants = [b for b in BLOCS if b not in blocs]
    assert not manquants, f"blocs manquants {dimension}: {manquants}"
    for b in BLOCS:
        contenu = blocs[b]
        assert isinstance(contenu, dict)
        if "consignation" in contenu:
            assert contenu["contenu"] is None
            assert contenu["consignation"], f"consignation vide {b}"
        else:
            lignes = contenu.get("lignes", [])
            assert lignes, f"bloc vide sans consignation: {dimension}/{b}"
            for l in lignes:
                assert scan_interdits(l) == 0, f"mot interdit {dimension}/{b}: {l!r}"
    frag = {
        "dimension": dimension,
        "chemin": chemin,
        "bandeau": BANDEAU_DSIM,
        "blocs": {b: blocs[b] for b in BLOCS},
        "flux": flux,
    }
    frag["sha_texte"] = hashlib.sha256(
        texte_fragment(frag).encode("utf-8")).hexdigest()[:16]
    return frag


def texte_fragment(frag: dict) -> str:
    """Sérialisation canonique (déterministe) du fragment."""
    parts = [frag["dimension"], frag["chemin"], frag["bandeau"], frag["flux"]]
    for b in BLOCS:
        c = frag["blocs"][b]
        if "consignation" in c:
            parts.append(f"{b}::consignation::{c['consignation']}")
        else:
            parts.append(f"{b}::{c.get('titre','')}::" + " | ".join(c["lignes"]))
    return "\n".join(parts)
