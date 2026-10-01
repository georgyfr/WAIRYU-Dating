#!/usr/bin/env python3
# ═══════════════════════════════════════════════════════════════════
# BALAYAGE CODES Q EN ZONE RENDUE — Constitution [3] (zéro métadonnée visible)
# finding D.3a (audit externe) · mission corrections P0 conception
#
# Balaye les 07-miroir des dossiers + portraits/domaines/*.md :
#   · zone RENDUE = prose de la section §1 (les textes que l'utilisateur
#     voit) — les codes d'items y sont INTERDITS ;
#   · hors zone : tableaux (|…), blockquotes (>), annotations (*…*)
#     et en-têtes de production — documentation moteur, codes autorisés ;
#   · les codes confinés aux sections moteur (§2+ : gabarits, tables
#     d'ancrage, signatures, contrôles) sont COMPTÉS (attendu : > 0 —
#     c'est la convention « codes côté moteur », précédent VAGUE 4).
#
# Trouvailles corrigées par cette mission :
#   · D.3a (audit) : M8-6.2/07 §1 — 3 codes (Q6.2-01/03/05) retirés ;
#   · D.3a-bis (balayage) : M9-6.5/07 §1 l.38-43 = table de substitutions
#     certifiées (documentation) et M3-2.3/07 §0 l.10 = note d'ancrage —
#     adjudiquées hors-rendu (tableau / note de production), non corrigées.
#
# Exécution : python3 ci/outils/balayage_codes_rendu.py   (racine)
# Sortie    : rapport · code 0 si zéro code en prose rendue, 1 sinon
# ═══════════════════════════════════════════════════════════════════

import re
import sys
from pathlib import Path

RACINE = Path(__file__).resolve().parents[2]
MOTIF = re.compile(r"Q\d+\.\d+")


def main() -> int:
    cibles = sorted((RACINE / "Livrable des mondes").glob("*/07-miroir.md")) \
        + sorted((RACINE / "portraits" / "domaines").glob("*.md"))
    fuites, fichiers_moteur = [], 0
    for f in cibles:
        lignes = f.read_text(encoding="utf-8").splitlines()
        sections, titre_cur, debut = [], "(en-tête)", 0
        for i, l in enumerate(lignes):
            if re.match(r"^#{1,2}\s+", l) and i > 0:
                sections.append((titre_cur, debut, i))
                titre_cur, debut = l.strip("# ").strip(), i
        sections.append((titre_cur, debut, len(lignes)))
        has_moteur = False
        for titre, d, fin in sections:
            t = titre.lower()
            if re.match(r"^1\s*[—-]", t) or t.startswith("§1"):
                for l in lignes[d:fin]:
                    s = l.strip()
                    if s.startswith(("|", ">", "*", "#", "_")):
                        continue            # documentation : tableau, note, annotation
                    codes = MOTIF.findall(s)
                    if codes:
                        fuites.append((str(f.relative_to(RACINE)), s[:90], codes))
            elif re.match(r"^(2|3|4|5|6)\s*[—-]|^§[2-6]|table d'ancrage|bloc moteur|partition", t):
                has_moteur = True
        if has_moteur:
            fichiers_moteur += 1
    print(f"═══ BALAYAGE CODES Q EN ZONE RENDUE — Constitution [3] (finding D.3a) ═══")
    print(f"Fichiers balayés : {len(cibles)} (07-miroir + portraits/domaines)")
    print(f"Fichiers avec codes confinés aux sections moteur : {fichiers_moteur} (convention « codes côté moteur »)")
    print(f"Codes Q en PROSE de zone rendue (§1) : {len(fuites)}")
    for f, ligne, codes in fuites:
        print(f"  🔴 {f} → {ligne} | {codes}")
    print()
    print("VERDICT BALAYAGE : 🔴 ROUGE — métadonnée visible en zone rendue." if fuites
          else "VERDICT BALAYAGE : 🟢 VERT — zéro code d'item dans la prose rendue.")
    return 1 if fuites else 0


if __name__ == "__main__":
    sys.exit(main())
