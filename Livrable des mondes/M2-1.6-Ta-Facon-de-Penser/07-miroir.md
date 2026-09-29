# LIVRABLE 7 — MIROIR DE QUÊTE (ÉTAGE 2) — QUÊTE 1.6 « TA FAÇON DE PENSER »

> **Brique paramétrée — standard v2** · Miroir **LÉGER** (mission V7.2 — tranchage explicite,
> 80-150 mots/variante) · **3 profils** : intuitif / mixte / analytique — **les deux pôles sont des
> forces** (gabarits distincts selon le pôle, mission V7.2), le mixte complète les degrés du slot
> S1. Structure : **TA LUMIÈRE** · **→ TON OMBRE (en couple)** · **→ TA TENSION** · **→ LE
> MINI-RES**. Ombre ≥ lumière · registre probabiliste · coût double nommé · rappels en toutes
> lettres · zéro métadonnée · **neutralité des deux pôles** (aucun n'est valorisé).
> **Angle ombre mission V7.2** : l'écart de pôle entre deux partenaires (« l'un pense structure,
> l'autre ressenti ») — conséquence fréquentielle sur la communication du couple. **Distinction
> documentée** : la friction est décrite en situation générique (registre fréquentiel) — la pénalité
> d'écart de pôle calculée (SIG_ECART_POLE, matching) reste JAMAIS dans le miroir (verrou 04 ; sa
> seule trace visible est le signal conversationnel symétrique, côté moteur).
> **Croisement autorisé** : le renvoi court vers 1.5 — ligne fixe du gabarit, RIEN d'autre.

## 0 — Champ de saillance

Les 7 items + 3 énigmes produisent **une** brique, choisie par le pôle POL (synthèse déclaratif ×
performance, normalisée) : **analytique** (> 0.65) · **mixte** (0.35-0.65) · **intuitif**
(< 0.35) — bornes reprises FM-019, provisoire concepteur. Les noms de profils sont des ID moteur ;
le rendu parle en images (le flair, les deux pieds, la vérification), jamais en étiquette.

## 1 — Les 3 briques-variantes

### MR-16-POL-INTUITIF — le flair d'abord

**TA LUMIÈRE**
Tu penses en ressenti — « ta première impression est souvent la bonne », comme tu l'as répondu. Ta lecture voit avant l'analyse : dans un couple, elle capte l'atmosphère d'une pièce avant les mots.

**→ TON OMBRE (en couple)**
Face à quelqu'un qui pense structure, vos vitesses diffèrent. La recherche documente que l'écart de style de pensée conduit fréquemment à des malentendus de tempo. Le coût pour toi : douter de ta lecture avant de la dire. Le coût pour l'autre : entendre « tu compliques » là où il offrait du soin.

**→ TA TENSION**
Ton flair voit vite — il lui faut des mots pour les horloges.

**→ LE MINI-RES**
- Lumière : ta lecture rapide capte ce que les listes ratent.
- Ombre : une impression dite tôt pèse — gardée, elle s'use.
- Mode d'emploi : dis ton ressenti en une phrase, sans preuve.
- Renvoi : la quête suivante observe ce tempo en action — dans tes choix.

### MR-16-POL-MIXTE — les deux pieds dans les deux camps

**TA LUMIÈRE**
Tu penses des deux pieds : le flair donne la direction, la vérification donne le sol. Dans un couple, ça fait un traducteur : le ressenti ET la structure.

**→ TON OMBRE (en couple)**
L'entremise a son prix : tu deviens le passage obligé des décisions. La recherche documente que la traduction permanente conduit fréquemment à une fatigue à deux langues. Le coût pour toi : épuiser ta réponse en éclairant celles des autres. Le coût pour l'autre : s'étonner de passer par toi pour se comprendre.

**→ TA TENSION**
Ta double lecture sert la maison — elle volera ton avis si tu ne le poses pas.

**→ LE MINI-RES**
- Lumière : tu saisis les deux logiques — une richesse de dialogue.
- Ombre : traduire les autres ne remplace pas te choisir.
- Mode d'emploi : avant de traduire, dis TA position.
- Renvoi : la quête suivante observe ce tempo en action — dans tes choix.

### MR-16-POL-ANALYTIQUE — la vérification d'abord

**TA LUMIÈRE**
Tu penses en structure — « vérifier trois fois avant de trancher », comme tu l'as répondu. Tes décisions tiennent debout — un appui pour les grandes décisions à deux.

**→ TON OMBRE (en couple)**
Face à quelqu'un qui pense ressenti, vos langages diffèrent. La recherche documente que l'écart de style conduit fréquemment à des discussions à deux vitesses. L'un réclame des raisons, l'autre de la place. Le coût pour toi : passer pour un examen quand tu cherches du sûr. Le coût pour l'autre : se sentir disséqué au lieu d'être écouté.

**→ TA TENSION**
Ta vérification bâtit du sûr — elle peut reconstruire ce que le ressenti posait.

**→ LE MINI-RES**
- Lumière : tes décisions tiennent — c'est un toit pour deux.
- Ombre : tout ressenti n'attend pas de preuve pour être vrai.
- Mode d'emploi : demande « qu'est-ce que tu vois ? » avant « pourquoi ? ».
- Renvoi : la quête suivante observe ce tempo en action — dans tes choix.

## 2 — Gabarit paramétré (assemblage moteur)

**GAB-MR-16-POL** :
- `texture_seed` → fixe (1 variante par pôle — mission V7.2 : **gabarits distincts selon le pôle**,
  les deux étant des forces ; le mixte suit son propre gabarit).
- `POL` → analytique (> 0.65) / mixte (0.35-0.65) / intuitif (< 0.35) — bornes FM-019, provisoire
  concepteur.
- `citation_items` → rappel en toutes lettres d'UN item réel (D ou I selon le pôle), résolu verbatim
  contre `01-tableau-des-items.md` — JAMAIS les codes, jamais un score, jamais le temps de réponse.
- `renvoi_court_1.5` → ligne fixe du MINI-RES (mission V7.2). **Distinction documentée** : ligne de
  navigation — aucune variable inter-quêtes consommée ; POL reste une variable intra-quête (le
  scoring propre de la quête est admissible au miroir — ambiguïté ① du 00-README), la pénalité
  d'écart de pôle entre deux matchs reste au matching (PASSE 5), jamais ici.
- **Les énigmes ne notent personne** : le rendu décrit la manière (S2) — pas de décompte, pas de
  secondes, pas de « bonne réponse » en ton de correction.

## 3 — Table d'ancrage (affirmation → items → vérification)

| Brique (ID moteur) | Affirmation rendue | Items (champ moteur) | Vérification |
|---|---|---|---|
| MR-16-POL-INTUITIF | « ta lecture voit avant l'analyse » | Q1.6-05 (rappel) · POL < 0.35 | Citations résolues verbatim contre le tableau 01 ; aucun code rendu |
| MR-16-POL-MIXTE | « le flair donne la direction, la vérification le sol » | synthèse S3 (items + énigmes) · 0.35-0.65 | idem — la manière aux énigmes décrite, jamais notée |
| MR-16-POL-ANALYTIQUE | « trancher sur du solide » | Q1.6-06 (rappel) · POL > 0.65 | idem |

## 4 — Signatures intégrées (registre 03 — aucune inventée)

| Signature | Intégration au miroir |
|---|---|
| **SIG_ECART_POLE (n° 26 — transversale matching)** | Aucun texte — la pénalité (seuil 0.70) vit à la PASSE 5 du moteur, entre deux profils ; sa seule trace visible est le signal conversationnel symétrique « vos styles de pensée diffèrent ». Le miroir décrit l'écart de pôle en situation générique (registre fréquentiel — angle mission V7.2), jamais comme un calcul ni un adressage à un membre précis. |
| **SIG_STANDARD_PROJETE (n° 13) · SIG_CALME_VERROU (n° 14)** | Aucun texte — elles consomment POL au Portrait (ÉTAGE 3+), jamais dans le miroir de la quête seule. |

## 5 — Contrôles avant livraison (affichés)

| Contrôle | Résultat |
|---|---|
| Volume 80-150 mots par variante (markup inclus — tranchage mission V7.2) | ✅ 3/3 (comptage machine — voir rapport de vague) |
| Ombre ≥ lumière par variante | ✅ 3/3 |
| Conséquence probabiliste (« la recherche documente que ») | ✅ 3/3 |
| Coût double nommé (pour toi ET pour l'autre) | ✅ 3/3 |
| Rappels en toutes lettres (résolus verbatim contre 01) | ✅ 3/3 |
| Gabarits distincts par pôle (les deux pôles en forces, aucun valorisé) | ✅ |
| Angle ombre mission (écart de pôle structure × ressenti, fréquentiel) | ✅ |
| Zéro pénalité, zéro décompte, zéro secondes, zéro « bonne réponse » | ✅ |
| Renvoi court vers 1.5 — ligne unique, zéro autre croisement | ✅ |
| Zéro code, score, sigle, chiffre dans un texte rendu | ✅ |
| Zéro interdit lexical (superlatifs, toujours/jamais inclus) | ✅ |
| Phrases ≤ 22 mots | ✅ (re-découpage machine) |
| Ouvertures distinctes entre profils | ✅ (ressenti · deux pieds · structure) |

## TABLE DE FICHIERS (format P1)

═══ FICHIER : Livrable des mondes/M2-1.6-Ta-Facon-de-Penser/07-miroir.md ═══
(écrit directement sur disque — accès FS ; la présente table consigne la livraison)
═══ FIN FICHIER ═══

> Fichier touché par la présente livraison : un seul — `07-miroir.md` (créé, mission V7.2 — le
> signalement de la mission Phases A/B/C/D est refermé). Le tranchage LÉGER (mission) remplace le
> MOYEN documenté au 04/00-README — note de tranchage gravée aux deux fichiers. Aucune signature
> inventée.
