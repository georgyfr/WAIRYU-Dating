# LIVRABLE 1 — LES 8 PAIRES DE LA QUÊTE 3.6 « LE CHOIX VISUEL »

> Format spécial : **8 paires d'images A/B — tâche comportementale** (pas de Likert, pas d'orientation D/I).
> Chaque paire : **description A + description B** (les assets graphiques sont produits par le design
> plus tard — la présente livraison porte les descriptions et le scoring) · **scène de référence** :
> note pour le design (ce que l'image montre, en une ligne).
> **Le pôle d'ancrage de chaque paire est documenté côté moteur** (score VISO_ANC) — les libellés
> A/B affichés ne portent JAMAIS de hiérarchie : les deux choix sont enviables (équivalence de
> valeur, précédent 1.5).
> **B.3 — sources par paire** : P1-P4 = **conversion verbatim** du source gelé (refonte § B,
> exemples d'origine) ; P5-P8 = **production neuve déclarée** (même logique, angles complémentaires
> — proposés par la production, cadrage mission V9.F).

| Code (gelé) | Thème | Choix A (description + scène de référence) | Choix B (description + scène de référence) | Pôle d'ancrage | Source B.3 | ▲ (signal_id) |
|---|---|---|---|---|---|---|
| Q3.6-P1 | Les intérieurs | **« Une vie qui se passe autour de la maison »** — salon chaleureux, lumière du soir, rideaux mi-clos | **« Une vie qui se passe dehors, à l'air libre »** — terrasse de rue, tabourets hauts, passants | **A** (le foyer) | **VERBATIM refonte** (« vie centrée maison vs vie ouverte dehors ») | — |
| Q3.6-P2 | Les paysages | **« La stabilité apaisante »** — prairie close, arbre centenaire, l'eau calme | **« Les horizons changeants »** — crête ouverte, sentier qui part, ciel de vent | **A** (la stabilité) | **VERBATIM refonte** (« stabilité apaisante vs horizons changeants ») | — |
| Q3.6-P3 | Les tables | **« Le festin partagé »** — grande table pleine, plats au centre, mains qui se servent | **« Le repas sobre à deux »** — table étroite, deux assiettes, une bougie | **B** (l'intimité) | **VERBATIM refonte** (« festin partagé vs repas sobre à deux ») | — |
| Q3.6-P4 | Les scènes | **« Le groupe animé »** — cour lumineuse, rires, gestes qui se croisent | **« Le tête-à-tête »** — deux chaises face à face, le monde au loin | **B** (le tête-à-tête) | **VERBATIM refonte** (« groupe animé vs tête-à-tête ») | — |
| Q3.6-P5 | Les deux matins | **« Le café lent, à la maison, sans programme »** — table de cuisine, vapeur du café, chaussettes | **« Le marché du quartier, à l'improviste »** — étals colorés, sac en toile, rue qui s'éveille | **A** (le café lent) | **production neuve** (angle complémentaire : le réveil choisi) | — |
| Q3.6-P6 | Les deux portes | **« La porte toujours ouverte — les visites entrent »** — porte entrouverte, chaussures au seuil, bruit de cuisine | **« La porte fermée sur le cocon »** — porte close, lumière douce qui filtre, silence | **B** (le cocon) | **production neuve** (angle complémentaire : l'hospitalité vs l'intimité) | ⚠ **CANAL SIGNAL : signal_id null** — lecture complémentaire faible éventuelle (contrôle/isolement), **code à arbitrer par le comité si requis** (Arbitrage 4 — voir 03) |
| Q3.6-P7 | Les deux dimanches | **« Le dimanche cadencé — les rituels »** — même café, même boulangerie, même table | **« Le dimanche sans programme — le jour qui se dessine en marchant »** — carrefour, pancake inversé, sans destination | **A** (le rituel) | **production neuve** (angle complémentaire : le cadre vs le libre) | — |
| Q3.6-P8 | Les deux fenêtres | **« La fenêtre sur la ville vivante »** — façades animées, cafés, bus qui passe | **« La fenêtre sur le calme »** — feuillage, toits discrets, oiseaux | **B** (le calme) | **production neuve** (angle complémentaire : le cadre de vie animé vs apaisé) | — |

## Le scoring (côté moteur — proposition [9])

- **VISO_ANC** = nombre de choix du pôle d'ancrage (0 à 8) : P1-A · P2-A · P3-B · P4-B · P5-A ·
  P6-B · P7-A · P8-B.
- **VISO_HOR** = 8 − VISO_ANC (le pôle d'horizon — complémentaire, jamais négatif).
- **SIG-3.6-01 « Le lecteur d'images »** : partition exclusive + exhaustive de 0 à 8 —
  **ancré-dominant (VISO_ANC ≥ 6) · équilibre (3-5) · horizon-dominant (≤ 2)** (bornes
  À VALIDER PAR LE COMITÉ).
- **L'ordre gauche-droite (A à gauche) est un paramètre de design** : si le design alterne la
  position des pôles à l'écran (anti-ancrage positionnel), la correspondance choix → pôle se fait
  sur l'ID du pôle (ancre/horizon), jamais sur le côté — documenté pour l'implémentation.
- **Les paires ne participent JAMAIS seules à un score de compatibilité** (mesure faible — refonte
  verbatim : « jamais seule, jamais clinique »).

## Les lectures conversationnelles (brise-glaces du Mode Invisible)

Chaque paire choisie devient un prompt de conversation naturel (refonte verbatim : « ton intérieur
choisi dit quelque chose... ») — les amorces vivent côté moteur et alimentent les brise-glaces
visuels du Mode Invisible :

| Paire | Amorce de conversation (exemple rendu) |
|---|---|
| P1 | « Ton intérieur choisi dit quelque chose — raconte. » |
| P2 | « Ton paysage choisi parle de ta façon d'avancer — ou de rester. » |
| P3 | « Ta table choisie raconte tes fêtes idéales. » |
| P4 | « Ta scène choisie dit ce qui te recharge — la tribu ou le duo. » |
| P5 | « Ton matin choisi dit comment ton week-end commence vraiment. » |
| P6 | « Ta porte choisie dit comment tu accueilles — et comment tu te protèges. » |
| P7 | « Ton dimanche choisi dit ce qu'un jour libre veut dire pour toi. » |
| P8 | « Ta fenêtre choisie dit la vue dont tu as besoin au réveil. » |

## Décisions de composition documentées (domaine réservé [9] — propositions)

1. **P5-P8 : la logique des 4 paires neuves** — même principe (deux images enviables, une
   orientation implicite), angles complémentaires des paires d'origine : le réveil (P5) complète
   le rythme (P1), la porte (P6) complète le foyer (P1/P3), le dimanche (P7) complète le cadre
   (P2), la fenêtre (P8) complète le paysage (P2) — zéro doublon d'angle, cadrage mission V9.F
   (« même logique, angles complémentaires — à proposer »).
2. **P6 — la seule paire à lecture sécurité éventuelle** : la porte fermée peut se lire en
   isolement SI systématique ET croisée d'autres signaux — le canal signal reste **null**
   (Arbitrage 4 : lecture complémentaire, code à arbitrer par le comité si requis) ; la paire ne
   se distingue PAS visuellement des autres (indiscernabilité du rendu).
3. **Descriptions ≤ 12 mots** (libellé affiché) : conformité au gabarit des options (précédent
   1.5) — la « scène de référence » (note design) vit côté documentation, jamais à l'écran.
4. **Aucun emoji ni symbole dans les libellés** : les pictogrammes (🏠 🌅 🍽️ 🎉...) sont des
   marqueurs de documentation — le design produit des images, pas des emojis (le refonte les
   utilise comme notes, conservés ici TELS QUELS dans les thèmes pour la traçabilité verbatim).
5. **Pas de « les deux » ni de « aucune »** : le choix binaire est assumé — la projection vit
   dans le choix, l'abstention casserait la tâche (précédent 1.5).

## Contrôles mécaniques passés

| Contrôle | Résultat |
|---|---|
| ≤ 12 mots / libellé (max constaté : 10) | ✅ |
| Équivalence de valeur (aucun choix « meilleur ») | ✅ 8/8 paires |
| Zéro image pathologique, zéro clinique | ✅ |
| Paires P1-P4 verbatim refonte (axes) | ✅ conversion, jamais réécriture |
| Paires P5-P8 production neuve déclarée | ✅ |
| Partition scoring exclusive + exhaustive (0-8) | ✅ |
| Canal signal : signal_id null partout + note Arbitrage 4 sur P6 | ✅ |
| Aucun item de trame ▲, aucun énoncé réservé | ✅ n_trames = 0 |
