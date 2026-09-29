# LIVRABLE 7 — MIROIR DE QUÊTE (ÉTAGE 2) — QUÊTE 3.5 « TON ENTOURAGE »

> **Brique paramétrée — standard v2** · Miroir **LÉGER** (gabarit **80-150 mots/variante**,
> Constitution [7] — 6 items) · **3 profils** : fusionnel / équilibre / indépendant — **chacun
> respecté, aucune norme**. Structure : **TA LUMIÈRE** · **→ TON OMBRE (en couple)** ·
> **→ TA TENSION** · **→ LE MINI-RES**. Ombre ≥ lumière · registre probabiliste · coût double
> nommé · rappels en toutes lettres · zéro métadonnée · zéro personne nommée.

## 0 — Champ de saillance

Quête à brique unique : les 6 réponses produisent **une** brique, choisie par le poids de
l'entourage ENTOUR_D (moyenne recodée, normalisée) : **fusionnel** (> 0.65) · **équilibre**
(0.35-0.65) · **indépendant** (< 0.35) — bornes reprises FM-019, provisoire concepteur
(SIG-3.5-01, À VALIDER PAR LE COMITÉ). Les noms de profils sont des ID moteur ; le rendu parle
en images (la table élargie, le milieu du gué, le tête-à-tête gardé), jamais en étiquette.

## 1 — Les 3 profils

### MR-35-ENT-FUSIONNEL — la table élargie

**TA LUMIÈRE**
Ton entourage tient une vraie place, comme tu l'as répondu. Tes parents comptent dans tes décisions. Ta vie de couple se vit aussi dans ta famille. Ta table s'élargit, et tu y es bien.

**→ TON OMBRE (en couple)**
La table élargie nourrit, mais elle impose. La recherche documente que les profils fusionnels vivent fréquemment des partenaires qui doivent gagner leur chaise. Face à un profil indépendant, la friction se documente des deux côtés : les fêtes, les dimanches, les devoirs envers les familles. Elle se traverse mieux annoncée tôt. Le coût pour toi : arbitrer entre deux loyautés sans te couper. Le coût pour l'autre : entrer dans une famille qui déborde.

**→ TA TENSION**
Ta table déborde de vie — elle laisse peu de coins tranquilles.

**→ LE MINI-RES**
- Lumière : ton entourage est un filet — personne ne tombe.
- Ombre : la chaise de l'autre se gagne — prépare-la.
- Mode d'emploi : nomme tes rendez-vous familiaux tôt — la table y gagne une place pour deux.

### MR-35-ENT-EQUILIBRE — le milieu du gué

**TA LUMIÈRE**
Ton entourage tient sa place, ni plus ni moins : il compte et il n'envahit pas — comme tes réponses le disent. Tu connais la valeur des deux rives : la famille, le couple, les amis.

**→ TON OMBRE (en couple)**
L'équilibre se lit, mais il se lit mal. La recherche documente que les profils d'entre-deux vivent fréquemment des attentes floues. L'autre cherche ta règle des dimanches. Face à un profil extrême (fusionnel ou indépendant), ta souplesse devient le compromis du couple. Le coût pour toi : porter les négociations des deux côtés. Le coût pour l'autre : ne pas savoir quelle version arrive.

**→ TA TENSION**
Ton équilibre navigue — il se lit dehors, pas dedans.

**→ LE MINI-RES**
- Lumière : ta souplesse dénoue les loyautés bloquées.
- Ombre : le milieu du gué reçoit les vagues des deux rives.
- Mode d'emploi : dis ta règle des fêtes — l'équilibre y gagne un langage.

### MR-35-ENT-INDEPENDANT — le tête-à-tête gardé

**TA LUMIÈRE**
Ton couple et tes décisions se tiennent entre vous, comme tu l'as répondu. La famille et la vie de couple gardent chacun leur territoire. Tes week-ends se réservent. C'est une géographie choisie, pas une coupure.

**→ TON OMBRE (en couple)**
Le tête-à-tête protège, mais il se défend. La recherche documente que les profils indépendants vivent fréquemment des familles partenaires qui cherchent leur place. Face à un profil fusionnel, la friction se documente des deux côtés : les fêtes, les dimanches, les devoirs envers les familles. Le coût pour toi : expliquer une distance que tu vis comme une santé. Le coût pour l'autre : entrer chez toi sans y voir la famille.

**→ TA TENSION**
Ton territoire protège — il doit accueillir sans se défaire.

**→ LE MINI-RES**
- Lumière : ton couple se tient entre vous — la clarté est un don.
- Ombre : la place des autres se nomme — ou se devine mal.
- Mode d'emploi : nomme ta géographie — le territoire y gagne une porte.

## 2 — Gabarit paramétré (assemblage moteur)

**GAB-MR-35-ENT** :
- `texture_seed` → fixe (1 variante par profil) · `ENTOUR_D` → fusionnel (> 0.65) / équilibre
  (0.35-0.65) / indépendant (< 0.35) — bornes FM-019, provisoire concepteur (SIG-3.5-01,
  À VALIDER PAR LE COMITÉ).
- `citation_items` → rappel en toutes lettres d'UN direct et d'UN inversé réels, résolus verbatim
  contre `01-tableau-des-items.md` — JAMAIS les codes, jamais le score.
- `croisement_relationnel` (SIG-3.5-02) → la friction des profils extrêmes divergents se documente
  en situation générique (fêtes de Noël, dimanches, devoirs envers les familles — registre
  fréquentiel) ; l'écart CALCULÉ du couple reste moteur, jamais rendu.
- Zéro personne nommée (verrou 04 n° 5) · aucune maturité attribuée (verrou 04 n° 4).

## 3 — Table d'ancrage (affirmation → items → vérification)

| Brique (ID moteur) | Affirmation rendue | Items (champ moteur) | Vérification |
|---|---|---|---|
| MR-35-ENT-FUSIONNEL | « ta table s'élargit, et tu y es bien » | Q3.5-01 → 06, ENTOUR_D > 0.65 | Citations résolues verbatim contre le tableau 01 ; aucun code rendu |
| MR-35-ENT-EQUILIBRE | « tu connais la valeur des deux rives » | ENTOUR_D 0.35-0.65 | idem |
| MR-35-ENT-INDEPENDANT | « une géographie choisie, pas une coupure » | ENTOUR_D < 0.35 | idem — le territoire respecté, jamais une froideur |

## 4 — Signatures intégrées (registre 03 — aucune inventée)

| Signature | Intégration au miroir |
|---|---|
| **SIG-3.5-01 — Le profil** | Le champ de saillance (§0) applique les seuils blocs ; le rendu parle d'images (la table, le gué, le tête-à-tête), jamais d'étiquette ni de maturité. |
| **SIG-3.5-02 — La friction des entourages** | Aucun texte calculé — l'ombre de chaque profil extrême documente la friction en situation GÉNÉRIQUE (fêtes, dimanches, devoirs) au registre fréquentiel ; l'écart CALCULÉ à un membre ne se raconte jamais, jamais de pénalité, jamais d'élimination. |

## 5 — Contrôles avant livraison (affichés)

| Contrôle | Résultat |
|---|---|
| Volume 80-150 mots par variante (markup inclus) | ✅ 3/3 (comptage machine — voir rapport de vague) |
| Ombre ≥ lumière par variante | ✅ 3/3 |
| Conséquence probabiliste | ✅ 3/3 (« la recherche documente que ») |
| Coût double nommé | ✅ 3/3 |
| Neutralité absolue (3 jugements interdits absents) | ✅ |
| Zéro personne nommée (situations, jamais personnages) | ✅ |
| Rappels en toutes lettres (jamais un code) | ✅ |
| Zéro interdit lexical | ✅ |
| Zéro jargon (différenciation/homogamie côté moteur) | ✅ |
| L'écart calculé à un membre jamais rendu (SIG-3.5-02 sans trace) | ✅ vérifié machine |
| Ouvertures non identiques entre profils | ✅ (table élargie · deux rives · tête-à-tête) |

## TABLE DE FICHIERS (format P1)

═══ FICHIER : Livrable des mondes/M4-3.5-Ton-Entourage/07-miroir.md ═══
(écrit directement sur disque — accès FS ; la présente table consigne la livraison)
═══ FIN FICHIER ═══

> Fichier touché par la présente livraison : un seul — `07-miroir.md` (créé V9.E).
> Aucune signature inventée ; SIG-3.5-01/02 formalisent des bornes déjà cadrées par la mission.
