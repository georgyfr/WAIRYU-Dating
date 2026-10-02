#!/usr/bin/env python3
# ═══════════════════════════════════════════════════════════════════
# BALAYAGE INTERDITS LEXICAUX AU RENDU — « toujours » / « jamais »
# v2 — D.4-FIX (re-audit V1.1 : angles morts structurels corrigés)
#
# Ce que le re-audit a prouvé de la v1 :
#   · clés scannées figées à 5 scalaires 1-ligne (lumiere|ombre|
#     tension_interieure|texte|narratif) → zone_ombre:, corps:,
#     fenetre_sur_l_autre: et toute clé de rendu absente étaient
#     INVISIBLES ;
#   · blocs multi-lignes (|- et |) et listes NON traités alors que
#     leur contenu EST rendu → faux VERT prouvé (M2-1.6:55,
#     M10-7.1:36, note contradictoire M1-1.1:118).
#
# Ce que la v2 garantit (structurellement complet) :
#   1. cartes.yaml parsés INTÉGRALEMENT (PyYAML) — chaque feuille
#      string est balayée : scalaires 1-ligne, BLOCS MULTI-LIGNES
#      (|-, |, >-, >) et LISTES ;
#   2. la surface scannée n'est PAS une liste figée : chaque chemin
#      de clé réel (audit machine des 41 cartes.yaml, M1-M11) doit
#      être classé RENDU ou MOTEUR dans CLASSEMENT ci-dessous —
#      TOUTE clé non classée = 🔴 ÉCHEC du balayage (un nouvel angle
#      mort devient structurellement impossible : il force la
#      classification au lieu d'être silencieusement ignoré) ;
#   3. cas gris : « presque toujours » / « pas toujours » (et
#      variantes directes) = CONSIGNÉS au rapport comme nuances à
#      arbitrer comité — pas de correction sauvage (règle D.4-FIX) ;
#   4. verbatims « … » exclus (doctrine D.4d — mots de la personne,
#      pas la voix de l'application).
#
# Surfaces « rendue » (la voix de l'application) :
#   · cartes.yaml — toutes les clés classées RENDU (cf. CLASSEMENT) ;
#   · 07-miroir.md — prose de la section §1 (hors tableaux, blockquotes,
#     annotations, en-têtes de production) ;
#   · 05-ecran-d-intro.md — le texte d'écran ;
#   · portraits/domaines/*.md — prose des sections §0 à §6 (BLOC
#     MOTEUR exclu).
#
# Exécution : python3 ci/outils/balayage_interdits_rendu.py   (racine)
# Sortie    : rapport complet · code 1 si hit rendu ou clé non classée,
#             0 sinon (les nuances consignées ne font pas échouer).
# ═══════════════════════════════════════════════════════════════════

import re
import sys
from pathlib import Path

import yaml

RACINE = Path(__file__).resolve().parents[2]
MOTIF = re.compile(r"\b(toujours|jamais)\b", re.IGNORECASE)
CITATION = re.compile(r"«[^»]*»")
# Cas gris — nuances à arbitrer comité (pas des interdits pleins)
NUANCES = re.compile(
    r"\b(presque toujours|pas toujours|quasiment toujours|presque jamais|pas jamais)\b",
    re.IGNORECASE,
)

# ───────────────────────────────────────────────────────────────────
# CLASSEMENT DES CLÉS RÉELLES (audit machine des 41 cartes.yaml, M1-M11)
# Toute feuille string dont le chemin ne matche aucune règle = 🔴 ÉCHEC.
# ───────────────────────────────────────────────────────────────────
# RENDU — la voix de l'application (affichée sur la carte / l'écran)
RENDU = [
    # corps des variantes : portrait, ombre, tension, cartes intégrales
    r"^variantes\[\]\.(nom|texte|corps|zone_ombre|lumiere|ombre|portrait|"
    r"tension_interieure|tension|badge|phrase_legere|intention|affichage_complet)$",
    # composition de carte M9-6.5 (amorce, substitutions certifiées — rendues)
    r"^variantes\[\]\.composition\.",
    # fenêtre rotative affichée au pied de carte
    r"^fenetre_sur_l_autre\[\]$",
    r"^pied_de_carte_commun\.(voyage|pool|boutons\[\]|fenetre_sur_autre)$",
    # écrans (entête, pied, libellés, disclaimer, écran final)
    r"^(titre|enonce_carte|entete_ecran|pied_ecran|label_ombre|label_tension|"
    r"label_disclaimer)$",
    r"^ecran_fin\.(titre|corps|boutons\[\])$",
]
# MOTEUR — métadonnées de production (documentation, sélection, conformité) :
# vivent dans le fichier mais ne franchissent JAMAIS le rendu
MOTEUR = [
    r"^(quete|monde|statut_freemium|format|charte|etage|etage_revelation|"
    r"exception_format|exception_longueur|mode|source|sortie|type|acces|"
    r"chiffrement|carte_recompense|domaine_variables|note_charte|note_verrou|"
    r"logique_de_selection)$",
    # sélection : variables, logiques, bornes, non-participants (moteur seul)
    r"^(variables|selection|absence)\.",
    # documentation de production / conformité / verrous / règles gravées
    # (prefixe : notes_conformite[] et notes_conformite.* ; verrous[] y compris
    #  les formes YAML « phrase-clé » — contenu moteur, jamais rendu)
    r"^conformite\[\]$",
    r"^notes_conformite",
    r"^regles_documentees\[\]$",
    r"^verrous\[\]",
    r"^selecteurs_verbatim\[\]",
    # identifiants, conditions de sélection, ancres, comptages, désignations
    r"^variantes\[\]\.(id|condition|ordre_selecteur|designation_moteur|"
    r"note_conformite|mots_lumiere_ombre|affichage_complet_mots|bloc_dominant|"
    r"exclusion_ombre|exclusion_score)$",
    r"^variantes\[\]\.ancre_item\[\]$",
]
RENDU_RE = [re.compile(p) for p in RENDU]
MOTEUR_RE = [re.compile(p) for p in MOTEUR]


def classer(chemin: str) -> str:
    """Classe un chemin de clé ; lève KeyError si non classé (anti angle mort)."""
    if any(r.search(chemin) for r in RENDU_RE):
        return "RENDU"
    if any(r.search(chemin) for r in MOTEUR_RE):
        return "MOTEUR"
    raise KeyError(chemin)


def sans_verbatims(texte: str) -> str:
    """Retire les citations « … » (mots de l'utilisateur — hors voix applicative)."""
    return CITATION.sub(" «…» ", texte)


def analyser(texte: str):
    """Classe un texte rendu : ('hit'|'nuance'|None, mot, contexte nettoyé).

    Les nuances (« presque toujours », « pas toujours »…) sont extraites
    AVANT le test d'interdit : elles sont consignées (comité), jamais
    comptées comme interdit plein — mais un interdit plein coexistant
    reste un hit.
    """
    nettoye = sans_verbatims(texte)
    reste = NUANCES.sub(" ⟨nuance⟩ ", nettoye)
    m = MOTIF.search(reste)
    if m:
        return "hit", m.group(0), reste
    mn = NUANCES.search(nettoye)
    if mn:
        return "nuance", mn.group(0), nettoye
    return None, None, nettoye


def feuilles_strings(node, chemin, out):
    """Collecte (chemin, valeur) de chaque feuille string — blocs et listes inclus."""
    if isinstance(node, dict):
        for k, v in node.items():
            feuilles_strings(v, f"{chemin}.{k}" if chemin else str(k), out)
    elif isinstance(node, list):
        for v in node:
            feuilles_strings(v, f"{chemin}[]", out)
    elif isinstance(node, str):
        out.append((chemin, node))


def balayer_prose(lignes, section_rendue=None, exclure_entete=True):
    """Yield (numéro_ligne, texte_sans_verbatim) pour la prose rendue (markdown)."""
    en_rendu = not exclure_entete
    for i, l in enumerate(lignes, 1):
        s = l.strip()
        if re.match(r"^#{1,3}\s+", s):
            titre = s.lstrip("# ").strip().lower()
            if section_rendue:
                en_rendu = bool(section_rendue(titre))
            else:
                en_rendu = True
            continue
        if not en_rendu:
            continue
        if s.startswith(("|", ">", "*", "_", "#", "```")):
            continue
        yield i, sans_verbatims(s)


def main() -> int:
    hits, nuances, cles_non_classees = [], [], []
    stats = {"cartes": 0, "feuilles": 0, "rendu": 0, "moteur": 0}

    # 1 · cartes.yaml — PARSE INTÉGRAL (blocs multi-lignes et listes inclus)
    for f in sorted((RACINE / "Livrable des mondes").glob("*/cartes.yaml")):
        doc = yaml.safe_load(f.read_text(encoding="utf-8"))
        leaves = []
        feuilles_strings(doc, "", leaves)
        stats["cartes"] += 1
        rel = str(f.relative_to(RACINE))
        for chemin, valeur in leaves:
            stats["feuilles"] += 1
            try:
                classe = classer(chemin)
            except KeyError:
                cles_non_classees.append((rel, chemin))
                continue
            stats["rendu" if classe == "RENDU" else "moteur"] += 1
            if classe != "RENDU":
                continue
            genre, mot, ctx = analyser(valeur)
            if genre == "hit":
                hits.append((rel, chemin, mot, ctx.strip()[:110]))
            elif genre == "nuance":
                nuances.append((rel, chemin, mot, ctx.strip()[:110]))

    # 2 · Les 07-miroir — §1 uniquement
    for f in sorted((RACINE / "Livrable des mondes").glob("*/07-miroir.md")):
        lignes = f.read_text(encoding="utf-8").splitlines()
        rel = str(f.relative_to(RACINE))

        def rendu(titre: str) -> bool:
            return bool(re.match(r"^1\s*[—-]", titre) or titre.startswith("§1"))

        for i, txt in balayer_prose(lignes, section_rendue=rendu):
            genre, mot, ctx = analyser(txt)
            if genre == "hit":
                hits.append((rel, "07 §1", mot, ctx.strip()[:110]))
            elif genre == "nuance":
                nuances.append((rel, "07 §1", mot, ctx.strip()[:110]))

    # 3 · Les 05-ecran — texte d'écran uniquement
    for f in sorted((RACINE / "Livrable des mondes").glob("*/05-ecran-d-intro.md")):
        lignes = f.read_text(encoding="utf-8").splitlines()
        rel = str(f.relative_to(RACINE))

        def rendu_ecran(titre: str) -> bool:
            return "texte de l'écran" in titre or "texte de production" in titre

        for i, txt in balayer_prose(lignes, section_rendue=rendu_ecran):
            genre, mot, ctx = analyser(txt)
            if genre == "hit":
                hits.append((rel, "05 écran", mot, ctx.strip()[:110]))
            elif genre == "nuance":
                nuances.append((rel, "05 écran", mot, ctx.strip()[:110]))

    # 4 · Les portraits de domaine — §0 à §6 (BLOC MOTEUR exclu)
    for f in sorted((RACINE / "portraits" / "domaines").glob("*.md")):
        lignes = f.read_text(encoding="utf-8").splitlines()
        rel = str(f.relative_to(RACINE))

        def rendu_portrait(titre: str) -> bool:
            return not ("moteur" in titre)

        for i, txt in balayer_prose(lignes, section_rendue=rendu_portrait):
            genre, mot, ctx = analyser(txt)
            if genre == "hit":
                hits.append((rel, "portrait", mot, ctx.strip()[:110]))
            elif genre == "nuance":
                nuances.append((rel, "portrait", mot, ctx.strip()[:110]))

    # ── RAPPORT COMPLET ────────────────────────────────────────────
    print("═══ BALAYAGE INTERDITS LEXICAUX AU RENDU v2 — « toujours »/« jamais » (D.4-FIX) ═══")
    print(f"Surfaces : cartes.yaml PARSE INTÉGRAL ({stats['cartes']} fichiers · "
          f"{stats['feuilles']} feuilles string : scalaires + blocs |-, | + listes) · "
          f"07 §1 · 05 écran · portraits §0-§6 — verbatims «…» exclus (doctrine)")
    print(f"Feuilles classées : {stats['rendu']} RENDU (balayées) · "
          f"{stats['moteur']} MOTEUR (exclusions déclarées) — toute clé NON classée = échec")
    print()
    if cles_non_classees:
        print(f"🔴 CLÉS NON CLASSÉES ({len(cles_non_classees)}) — classification obligatoire :")
        for rel, chemin in cles_non_classees:
            print(f"  🔴 {rel} · {chemin}")
        print()
    if hits:
        print(f"🔴 OCCURRENCES EN VOIX D'APPLICATION ({len(hits)}) :")
        for rel, chemin, mot, ctx in hits:
            print(f"  🔴 {rel} · {chemin} → «{mot}» · {ctx}")
        print()
    else:
        print("🔴 Occurrences en voix d'application : 0")
        print()
    if nuances:
        print(f"⚠ NUANCES À ARBITRER COMITÉ ({len(nuances)}) — cas gris consignés, "
              "pas de correction sauvage :")
        for rel, chemin, mot, ctx in nuances:
            print(f"  ⚠ {rel} · {chemin} → «{mot}» · {ctx}")
        print()
    else:
        print("⚠ Nuances à arbitrer comité : 0")
        print()

    echec = bool(hits or cles_non_classees)
    if echec:
        print("VERDICT BALAYAGE v2 : 🔴 ROUGE — hit rendu ou clé non classée.")
    elif nuances:
        print("VERDICT BALAYAGE v2 : 🟢 VERT (0 interdit lexical en voix d'application) — "
              "nuances consignées comité ci-dessus.")
    else:
        print("VERDICT BALAYAGE v2 : 🟢 VERT — zéro « toujours/jamais » en voix d'application "
              "sur tout le corpus (surfaces exhaustives, aucune clé non classée).")
    return 1 if echec else 0


if __name__ == "__main__":
    sys.exit(main())
