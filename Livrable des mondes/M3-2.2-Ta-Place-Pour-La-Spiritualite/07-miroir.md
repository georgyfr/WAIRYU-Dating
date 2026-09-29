# LIVRABLE 7 — MIROIR DE QUÊTE (ÉTAGE 2) — QUÊTE 2.2 « TA PLACE POUR LA SPIRITUALITÉ »

> **Brique paramétrée — standard v2** · Miroir **LÉGER** (6 items → gabarit **80-150 mots/variante**,
> Constitution [7]) · **3 profils** : centrale / culturelle / absente — **chacun respecté, aucune
> norme**. Structure : **TA LUMIÈRE** · **→ TON OMBRE (en couple)** · **→ TA TENSION** ·
> **→ LE MINI-RES**. Ombre ≥ lumière · registre probabiliste · coût double nommé · rappels en
> toutes lettres · zéro métadonnée · zéro confession.

## 0 — Champ de saillance

Quête à brique unique : les 6 réponses produisent **une** brique, choisie par la centralité
spirituelle SPIRIT_D (moyenne recodée, normalisée) : **centrale** (> 0.65) · **culturelle**
(0.35-0.65) · **absente** (< 0.35) — bornes reprises FM-019, provisoire concepteur. L'ombre de la
centrale et celle de l'absente sont prévues par la mission ; la culturelle suit le même gabarit.

## 1 — Les 3 profils

### MR-22-SPI-CENTRALE — la place centrale

**TA LUMIÈRE**
Ta spiritualité occupe une vraie place : elle se vit dans la semaine, elle pèse dans tes décisions, elle compte dans un couple. C'est une architecture — elle organise, elle porte.

**→ TON OMBRE (en couple)**
La foi partagée rassure mais l'interprétation divise : deux personnes dans le même lieu n'y voient pas forcément le même paysage. La recherche documente que les couples à place forte vivent fréquemment des tensions d'interprétation plus vives que les écarts de pratique. Le coût pour toi : confondre partage et uniformité. Le coût pour l'autre : se sentir attendu·e à l'entrée d'une pièce vue de loin.

**→ TA TENSION**
Ta place est un centre — elle accueille mieux sans réclamer.

**→ LE MINI-RES**
- Lumière : ton architecture du sens porte tes jours et tes choix.
- Ombre : le même toit, deux regards — l'interprétation divise.
- Mode d'emploi : nomme le non-négociable et le discutable — le centre y gagne de l'accueil.

### MR-22-SPI-CULTURELLE — la place des grandes heures

**TA LUMIÈRE**
Ta spiritualité vit dans les grandes heures : les fêtes, les saisons, les gestes hérités. Elle rassemble — elle fait la culture du lien plus que la discipline.

**→ TON OMBRE (en couple)**
Les grandes célébrations rassemblent, mais le quotidien reste sans rite : la recherche documente que la spiritualité des grandes heures conduit fréquemment à des couples qui célèbrent ensemble et s'interrogent seuls. Le coût pour toi : la solitude des jours où ta place ne se voit pas. Le coût pour l'autre : ne pas savoir ce que la fête recouvre — la célébration dit l'appartenance, elle n'explique pas.

**→ TA TENSION**
Ta place donne rendez-vous — elle laisse les autres jours sans garde-fou.

**→ LE MINI-RES**
- Lumière : tes fêtes font du lien sans lourdeur.
- Ombre : la fête dit l'appartenance, pas le quotidien.
- Mode d'emploi : nomme ce que la fête recouvre — le reste des jours y gagne un mot.

### MR-22-SPI-ABSENTE — la place libre

**TA LUMIÈRE**
La spiritualité n'occupe pas de place chez toi — et ce n'est pas un vide : c'est une liberté. Tu cherches le sens sans autel, le lien sans rituel.

**→ TON OMBRE (en couple)**
La liberté totale a son coût à deux : moins de rituels communs, moins de jalons qui se partagent sans négociation. La recherche documente que l'absence de pratique partagée conduit fréquemment les couples à inventer leurs propres jalons — ça se construit à la main. Le coût pour toi : bâtir du sens sans calendrier déjà écrit. Le coût pour l'autre : ne pas se raccrocher à un rituel tout fait.

**→ TA TENSION**
Ta liberté est entière — des jalons que vous poserez vous-mêmes.

**→ LE MINI-RES**
- Lumière : ta place libre ouvre le champ sans dettes.
- Ombre : moins de rituels communs — le sens se bâtit, il ne se reçoit pas.
- Mode d'emploi : choisis un jalon à deux par saison — la liberté y gagne un rendez-vous.

## 2 — Gabarit paramétré (assemblage moteur)

**GAB-MR-22-SPI** :
- `texture_seed` → fixe (1 variante par profil) · `SPIRIT_D` → centrale (> 0.65) / culturelle
  (0.35-0.65) / absente (< 0.35) — bornes FM-019, provisoire concepteur.
- `citation_items` → rappel en toutes lettres d'UN direct et d'UN inversé réels, résolus verbatim
  contre `01-tableau-des-items.md` — JAMAIS les codes, jamais le score.
- Aucune mention de l'écart à l'autre (SIG-2.2-01 sans trace — verrou 04 n° 6) · zéro confession
  (verrou n° 5).

## 3 — Table d'ancrage (affirmation → items → vérification)

| Brique (ID moteur) | Affirmation rendue | Items (champ moteur) | Vérification |
|---|---|---|---|
| MR-22-SPI-CENTRALE | « une architecture — elle organise, elle porte » | Q2.2-01 → 06, SPIRIT_D > 0.65 | Citations résolues verbatim contre le tableau 01 ; aucun code rendu |
| MR-22-SPI-CULTURELLE | « les grandes heures — elle rassemble sans exiger » | SPIRIT_D 0.35-0.65 | idem |
| MR-22-SPI-ABSENTE | « ce n'est pas un vide : c'est une liberté » | SPIRIT_D < 0.35 | idem — l'absence respectée, jamais un manque |

## 4 — Signatures intégrées (registre 03 — aucune inventée)

| Signature | Intégration au miroir |
|---|---|
| **SIG-2.2-01 — L'homophilie graduée** | Aucun texte — le filtre enrichi module des scores côté moteur, il ne commente personne. Le miroir de chacun décrit SA place, jamais l'écart à l'autre. |

## 5 — Contrôles avant livraison (affichés)

| Contrôle | Résultat |
|---|---|
| Ombre ≥ lumière par variante | ✅ 3/3 |
| Conséquence probabiliste | ✅ 3/3 (« la recherche documente que ») |
| Coût double nommé | ✅ 3/3 |
| Rappels en toutes lettres (jamais un code) | ✅ |
| Zéro interdit lexical | ✅ |
| Zéro confession, zéro croyance nommée | ✅ |
| Neutralité absolue (les 3 profils respectés, aucune norme) | ✅ |
| Ouvertures non identiques entre profils | ✅ (architecture · grandes heures · liberté) |
| Volume 80-150 mots par variante | ✅ 3/3 (comptage machine) |
| SIG-2.2-01 sans trace (l'écart à l'autre ne se raconte pas) | ✅ |

## TABLE DE FICHIERS (format P1)

═══ FICHIER : Livrable des mondes/M3-2.2-Ta-Place-Pour-La-Spiritualite/07-miroir.md ═══
(écrit directement sur disque — accès FS ; la présente table consigne la livraison)
═══ FIN FICHIER ═══

> Fichiers touchés par la présente livraison : un seul — `07-miroir.md` (créé). Aucune signature
> inventée ; la distinction 2.2 (module) / 2.3-04 (élimine) est documentée aux fichiers 01, 03 et 04.
