# PROMPT A1 — MISSION DE RÉDACTION DE QUÊTE (v2.2)

> Prompt de la salle-prompts · versionné par FM-014 · **v2.2 : ajout du LIVRABLE 7 — Export fichiers**.
> Les deux options coexistent : session sans fichiers → P1 en étape séparée ; agent avec accès FS → écriture directe selon P1.

```
[CONSTITUTION v2.1 collée ci-dessus]

MISSION : rédiger l'intégralité des items de la quête [ID + titre —
ex : 2.1 Tes valeurs], rattachée au monde [M3 — La Boussole,
🆓 gratuit / 💎 premium], selon le cahier des charges suivant.

FICHE DE LA QUÊTE (je la fournis remplie — si une ligne manque,
demande-la au lieu d'inventer) :
• Position : monde / catégorie (Socle, Libre, Opt-in, Match,
  Passage) / phase
• Items attendus : [nombre total — décomposition carte + trame ▲]
• Dimensions mesurées : [liste + définition opératoire de chacune]
• Items de trame ▲ : [combien, quels signaux du glossaire [4],
  et le déguisement prévu (ex : « valeurs en creux », habitudes
  quotidiennes, situations de couple anodines)]
• Paires quasi-miroir : [requises ou typologie kit unique]
• Double balise par item : carte_id (ce que révèle la lecture
  carte) / signal_id (ce que nourrit la sécurité — ou null)

FORMAT DE SORTIE EXIGÉ (tableau, une ligne par item) :
| Code (Q[x.y]-[nn], gelé et définitif) | Énoncé (≤ 12 mots,
  1re personne, présent, concret, ni double négation ni termes de
  fréquence ambigus) | Orientation (D/I) | Dimension | Facette |
  Paire miroir | ▲ signal | Fiche de computation — 5 canaux :
  carte / signal / fiabilité / modulation / ancrage (ou « lecture
  unique » justifiée) |

CONTRAINTES DE RÉDACTION (les 6 principes) : unicité (un item =
une seule dimension, zéro contamination lexicale) · concrétude
(une situation reconnaissable, pas une abstraction) · brièveté
(≤ 2 lignes de mobile) · première personne · neutralité normative
(aucun énoncé qui suggère la bonne réponse) · fréquence claire
(ancre comportementale plutôt que « souvent »/« parfois »).
Les items de trame ▲ sont INDISCERNABLES des items de carte :
jamais édulcorés, jamais explicitement négatifs, jamais adjacents
à leur dimension hôte dans le plan de mélange.

LIVRE ÉGALEMENT, DANS CET ORDRE :
1. Le plan de mélange des blocs (jamais 2 items de même dimension
   consécutifs, trames réparties uniformément, contrainte
   d'interleaving, graine reproductible).
2. Les 2-4 SIGNATURES attendues de cette quête (format du registre :
   id, conditions exactes sur les variables, conséquence, source,
   fenêtre de fréquence cible).
3. Les SLOTS DE MIROIR que cette quête alimentera (percentiles,
   citations possibles en toutes lettres, degrés, écarts internes).
4. L'écran d'intro de la quête (2 phrases, ton de la Constitution,
   statut freemium respecté : jamais de présupposé sur un monde de
   l'autre statut).
5. La fiche de computation complète d'UN item au choix (modèle des
   5 canaux, format YAML).
6. (v2.2) LIVRABLE 7 — EXPORT FICHIERS : la liste des chemins et
   contenus balisés selon P1 (format ═══ FICHIER : <chemin> ═══ …
   ═══ FIN FICHIER ═══, intégral, sans ellipse). Un agent avec accès
   FS écrit directement aux chemins canoniques et livre la trace des
   écritures (chemin + hash + taille).

INTERDITS ABSOLUS : inventer des dimensions non listées ; ajouter
des items non demandés ; changer le format d'échelle ; introduire
un sigle hors glossaire [4] ; traiter les trois verrous humains de
[9] comme des décisions (les propositions vont marquées « À VALIDER
PAR LE COMITÉ »).

Commence par le RITUEL D'OUVERTURE [10].
```

## Journal des versions

| Version | Date | Changement |
|---|---|---|
| v2.1 | session initiale 2.1 | Format original de mission |
| v2.2 | 2026-09-28 | FM-014 : ajout du LIVRABLE 7 — Export fichiers (dual : P1 séparé / écriture FS directe) |
