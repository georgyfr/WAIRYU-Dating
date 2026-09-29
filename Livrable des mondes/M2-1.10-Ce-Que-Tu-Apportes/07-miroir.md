# LIVRABLE 7 — MIROIR DE QUÊTE (ÉTAGE 2) — QUÊTE 1.10 « CE QUE TU APPORTES »

> **Brique paramétrée — standard v2** · Miroir **MOYEN** (10 items → gabarit **150-250 mots/variante**,
> Constitution [7]) · **3 profils** : contributeur fort / asymétrique (exige plus qu'il n'offre) /
> équilibré. Structure : **TA LUMIÈRE** · **→ TON OMBRE (en couple)** · **→ TA TENSION** ·
> **→ LE MINI-RES**. Ombre ≥ lumière · registre probabiliste · coût double nommé · rappels en
> toutes lettres · zéro métadonnée · anti auto-flatterie au rendu (des comportements, pas des qualités).

## 0 — Champ de saillance

Quête à brique unique : les 10 réponses produisent **une** brique, choisie par la contribution
déclarée CONTRIB_D (moyenne recodée, normalisée) : **fort** (> 0.65) · **équilibré** (0.35-0.65) ·
**asymétrique** (< 0.35 — exige plus qu'il n'offre) — bornes reprises FM-019, provisoire concepteur.
Le croisement avec M1 (SIG_CONTRIB) ne rend RIEN ici : il vit au Portrait (ÉTAGE 3, verrous 04).

## 1 — Les 3 profils

### MR-110-CON-FORT — contributeur fort

**TA LUMIÈRE**
Tes réponses dessinent quelqu'un qui revient : le premier pas après la dispute, l'aveu sans détour, la fatigue repérée avant le mot dit. Ce que tu apportes se vérifie — c'est rarement bruyant, et ça tient une table à deux.

**→ TON OMBRE (en couple)**
Donner fort fatigue à l'endroit où l'on ne regarde pas : toi. La balise qui éclaire pour les autres finit par lire peu son propre chemin, et la recherche documente que le donner systématique conduit fréquemment à un reçu qui s'atrophie — on te dit merci, on t'écoute moins. Le coût pour toi : être aimé·e comme pilier avant d'être aimé·e comme personne. Le coût pour l'autre : ignorer ce que tu portes, puisqu'il ne le voit pas tomber.

**→ TA TENSION**
Ta générosité d'actes construit — elle te demande juste de garder une chaise pour toi.

**→ LE MINI-RES**
- Lumière : ta table est mise avant que l'autre ne fringue.
- Ombre : le pilier ne dit pas quand il plie.
- Mode d'emploi : une demande par semaine, formulée — recevoir s'apprend en exerçant.

### MR-110-CON-ASY — asymétrique (exige plus qu'il n'offre)

**TA LUMIÈRE**
Tes réponses montrent quelqu'un qui sait ce qu'il attend des gens — et qui le demande sans détour. Tes besoins se lisent clairement : à une table, tu sais ce que tu veux y trouver. C'est une lucidité, et elle a de la valeur.

**→ TON OMBRE (en couple)**
Quand la demande occupe la place de l'offre, le lien tourne à la livraison : l'autre apporte, tu reçois — et la rocade évite le centre où l'on se donne. La recherche documente que l'asymétrie durable conduit fréquemment à l'épuisement de la partie qui donne, puis au départ silencieux. Le coût pour toi : des gens qui empruntent un autre chemin sans prévenir. Le coût pour l'autre : se sentir un service avant d'être une personne.

**→ TA TENSION**
Ta clarté sur ce que tu veux est une force — elle attend juste la même attention dans l'autre sens.

**→ LE MINI-RES**
- Lumière : tu sais demander, et la demande claire fait avancer.
- Ombre : une table où l'on ne sert que d'un côté finit par déserter.
- Mode d'emploi : offre un premier pas par jour — le geste avant la demande.

### MR-110-CON-EQU — équilibré

**TA LUMIÈRE**
Tes réponses tiennent la balance : tu cherches ce qui arrange les deux, tu admets tes torts quand ils sont là, tu aides — parfois avant, parfois sur demande. Rien de spectaculaire : un équilibre qui se vérifie en marchant, pas en s'annonçant à grands cris.

**→ TON OMBRE (en couple)**
L'équilibre tranquille glisse parfois vers le compte exact : rendre chaque effort, mesurer chaque geste — et la recherche documente que le donnant-donnant strict conduit fréquemment à un livre de comptes où l'on note plus qu'on ne s'offre. Le coût pour toi : des liens justes mais surveillés de près. Le coût pour l'autre : la sensation de devoir équilibrer, plutôt que d'habiter.

**→ TA TENSION**
Ta balance fait justice — elle lui faut des jours où personne ne pèse.

**→ LE MINI-RES**
- Lumière : ta balance tient les liens dans la durée.
- Ombre : tout peser, c'est déjà peser sur.
- Mode d'emploi : un geste sans retour attendu par semaine — l'équilibre y gagne de l'air.

## 2 — Gabarit paramétré (assemblage moteur)

**GAB-MR-110-CON** :
- `texture_seed` → fixe (1 variante par profil) · `CONTRIB_D` → fort (> 0.65) / équilibré (0.35-0.65) /
  asymétrique (< 0.35) — bornes FM-019, provisoire concepteur.
- `citation_items` → rappel en toutes lettres d'UN direct et d'UN inversé réels, résolus verbatim
  contre `01-tableau-des-items.md` — JAMAIS les codes, jamais le score.
- Profil asymétrique : la brique décrit une MÉCANIQUE de couple — zéro accusation, zéro label
  (« preneur », « égoïste » interdits au rendu comme partout).
- Aucune mention de confiance, d'écart ou de croisement M1 (verrou 04 n° 6).

## 3 — Table d'ancrage (affirmation → items → vérification)

| Brique (ID moteur) | Affirmation rendue | Items (champ moteur) | Vérification |
|---|---|---|---|
| MR-110-CON-FORT | « quelqu'un qui revient » | Q1.10-01 → 10, CONTRIB_D > 0.65 | Citations résolues verbatim contre le tableau 01 ; aucun code rendu |
| MR-110-CON-EQU | « quelqu'un qui tient la balance » | CONTRIB_D 0.35-0.65 | idem |
| MR-110-CON-ASY | « quelqu'un qui sait ce qu'il attend des gens » | CONTRIB_D < 0.35 | idem — mécanique décrite, jamais un procès |

## 4 — Signatures intégrées (registre 03 — aucune inventée)

| Signature | Intégration au miroir |
|---|---|
| **SIG_CONTRIB (registre M2)** | Aucun texte ici — le facteur de confiance module en silence côté moteur ; la lecture croisée déclarée × mesurée rend au Portrait de Monde M2 (ÉTAGE 3, slot « ta contribution », verrous 04). Le re-test ciblé (proposition) est une invitation douce, jamais une convocation rendue dans ce miroir. |

## 5 — Contrôles avant livraison (affichés)

| Contrôle | Résultat |
|---|---|
| Ombre ≥ lumière par variante | ✅ 3/3 |
| Conséquence probabiliste | ✅ 3/3 (« la recherche documente que ») |
| Coût double nommé | ✅ 3/3 |
| Rappels en toutes lettres (jamais un code) | ✅ |
| Zéro interdit lexical | ✅ |
| Zéro label accusateur (pas de « preneur », « égoïste »…) | ✅ |
| Zéro qualité prêtée au rendu (anti auto-flatterie) | ✅ |
| Ouvertures non identiques entre profils | ✅ (revient · sait ce qu'il attend · tient la balance) |
| Volume 150-250 mots par variante | ✅ 3/3 (comptage machine) |
| SIG_CONTRIB sans trace dans le miroir de quête | ✅ |

## TABLE DE FICHIERS (format P1)

═══ FICHIER : Livrable des mondes/M2-1.10-Ce-Que-Tu-Apportes/07-miroir.md ═══
(écrit directement sur disque — accès FS ; la présente table consigne la livraison)
═══ FIN FICHIER ═══

> Fichiers touchés par la présente livraison : un seul — `07-miroir.md` (créé). Aucune signature
> inventée : SIG_CONTRIB est alignée au registre M2 (verbatim), jamais réécrite.
