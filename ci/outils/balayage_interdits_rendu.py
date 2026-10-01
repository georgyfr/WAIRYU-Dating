#!/usr/bin/env python3
# ═══════════════════════════════════════════════════════════════════
# BALAYAGE INTERDITS LEXICAUX AU RENDU — « toujours » / « jamais »
# finding D.4 (audit externe, corrections D.4a-e + balayage 3.6)
#
# Surface « rendue » balayée (la voix de l'application) :
#   · 07-miroir.md — prose de la section §1 (hors tableaux, blockquotes,
#     annotations, en-têtes de production) ;
#   · 05-ecran-d-intro.md — le texte d'écran (bloc de citation) ;
#   · cartes.yaml — les champs de texte rendus des cartes ;
#   · portraits/domaines/*.md — prose des sections §0 à §6
#     (le BLOC MOTEUR est hors surface).
#
# Exclusions de doctrine :
#   · les verbatims des réponses utilisateur cités entre « … » — ce sont
#     les mots de la personne, pas la voix de l'application
#     (convention « rappel verbatim », consignée D.4d) ;
#   · les sections moteur (§2+ des 07 : gabarits, tables d'ancrage,
#     signatures, contrôles — documentation, pas rendu).
#
# Exécution : python3 ci/outils/balayage_interdits_rendu.py   (racine)
# Sortie    : rapport · code 0 si zéro occurrence, 1 sinon
# ═══════════════════════════════════════════════════════════════════

import re
import sys
from pathlib import Path

RACINE = Path(__file__).resolve().parents[2]
MOTIF = re.compile(r"\b(toujours|jamais)\b", re.IGNORECASE)
CITATION = re.compile(r"«[^»]*»")


def sans_verbatims(ligne: str) -> str:
    """Retire les citations « … » (mots de l'utilisateur — hors voix applicative)."""
    return CITATION.sub(" «…» ", ligne)


def balayer_prose(lignes, section_rendue=None, exclure_entete=True):
    """Yield (numéro_ligne, texte_sans_verbatim) pour la prose rendue."""
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
    hits = []

    # 1 · Les 07-miroir — §1 uniquement
    for f in sorted((RACINE / "Livrable des mondes").glob("*/07-miroir.md")):
        lignes = f.read_text(encoding="utf-8").splitlines()
        def rendu(titre: str) -> bool:
            return bool(re.match(r"^1\s*[—-]", titre) or titre.startswith("§1"))
        for i, txt in balayer_prose(lignes, section_rendue=rendu):
            m = MOTIF.search(txt)
            if m:
                hits.append((str(f.relative_to(RACINE)), i, m.group(0), txt.strip()[:90]))

    # 2 · Les 05-ecran — texte d'écran uniquement
    for f in sorted((RACINE / "Livrable des mondes").glob("*/05-ecran-d-intro.md")):
        lignes = f.read_text(encoding="utf-8").splitlines()
        def rendu(titre: str) -> bool:
            return "texte de l'écran" in titre or "texte de production" in titre
        for i, txt in balayer_prose(lignes, section_rendue=rendu):
            m = MOTIF.search(txt)
            if m:
                hits.append((str(f.relative_to(RACINE)), i, m.group(0), txt.strip()[:90]))

    # 3 · Les cartes.yaml — champs de texte rendus (valeurs scalaires)
    for f in sorted((RACINE / "Livrable des mondes").glob("*/cartes.yaml")):
        for i, l in enumerate(f.read_text(encoding="utf-8").splitlines(), 1):
            if re.match(r"\s*(lumiere|ombre|tension_interieure|texte|narratif)\s*:", l):
                m = MOTIF.search(sans_verbatims(l))
                if m:
                    hits.append((str(f.relative_to(RACINE)), i, m.group(0), l.strip()[:90]))

    # 4 · Les portraits de domaine — §0 à §6 (BLOC MOTEUR exclu)
    for f in sorted((RACINE / "portraits" / "domaines").glob("*.md")):
        lignes = f.read_text(encoding="utf-8").splitlines()
        def rendu(titre: str) -> bool:
            return not ("moteur" in titre)
        for i, txt in balayer_prose(lignes, section_rendue=rendu):
            m = MOTIF.search(txt)
            if m:
                hits.append((str(f.relative_to(RACINE)), i, m.group(0), txt.strip()[:90]))

    print("═══ BALAYAGE INTERDITS LEXICAUX AU RENDU — « toujours »/« jamais » (finding D.4 · balayage 3.6) ═══")
    print("Surfaces : 07 §1 · 05 écran · cartes.yaml (champs rendus) · portraits §0-§6 — verbatims «…» exclus (doctrine)")
    print(f"Occurrences en voix d'application : {len(hits)}")
    for f, i, mot, ctx in hits:
        print(f"  🔴 {f}:{i} → «{mot}» · {ctx}")
    print()
    print("VERDICT BALAYAGE 3.6 : 🔴 ROUGE — interdit lexical au rendu." if hits
          else "VERDICT BALAYAGE 3.6 : 🟢 VERT — zéro « toujours/jamais » en voix d'application sur tout le corpus.")
    return 1 if hits else 0


if __name__ == "__main__":
    sys.exit(main())
