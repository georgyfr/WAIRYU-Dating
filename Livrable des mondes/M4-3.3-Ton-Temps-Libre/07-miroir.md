# LIVRABLE 7 — MIROIR DE QUÊTE (ÉTAGE 2) — QUÊTE 3.3 « TON TEMPS LIBRE »

> **Brique paramétrée — standard v2** · Miroir **MOYEN** (gabarit **150-250 mots/variante**,
> Constitution [7] — 12 items) · **3 profils** : centrifuge / mixte / centripète — **chacun
> respecté, aucune norme** (deux façons égales de se nourrir). Structure : **TA LUMIÈRE** ·
> **→ TON OMBRE (en couple)** · **→ TA TENSION** · **→ LE MINI-RES**. Ombre ≥ lumière ·
> registre probabiliste · coût double nommé · rappels en toutes lettres · zéro métadonnée.
> **Les 4 trames CSR n'alimentent AUCUN slot, AUCUNE citation, AUCUN rendu** (verrou 04 n° 5).

## 0 — Champ de saillance

Les 8 items carte produisent **une** brique, choisie par la centrifugie MODE_D (moyenne recodée,
normalisée) : **centrifuge** (> 0.65) · **mixte** (0.35-0.65) · **centripète** (< 0.35) — bornes
reprises FM-019, provisoire concepteur (SIG-3.3-01, À VALIDER PAR LE COMITÉ). Les noms de profils
sont des ID moteur ; le rendu parle en images (le grand air, l'entre-deux, le cocon), jamais en
étiquette. Le score FOND_D (le fond des loisirs) enrichit le croisement conversationnel côté
moteur (SIG-3.3-02) — il ne crée pas de brique.

## 1 — Les 3 profils

### MR-33-TL-CENTRIFUGE — le grand air

**TA LUMIÈRE**
Ton énergie vient du dehors, comme tu l'as répondu : après une semaine chargée, tu ressors pour recharger. Le monde est ta ressource — les rues, les terrasses, les gens.

**→ TON OMBRE (en couple)**
Le grand air nourrit, mais il emmène. La recherche documente que les profils centrifuges vivent fréquemment des partenaires qui se sentent délaissés. Le risque : une maison que tu traverses plus que tu ne l'habites. Quand ton mode croise un mode centripète, la friction se documente des deux côtés : l'un se sent délaissé, l'autre étouffé. Elle se traverse mieux annoncée tôt. Le coût pour toi : une énergie qui se dépense dehors, avant la maison. Le coût pour l'autre : attendre derrière la porte du monde.

**→ TA TENSION**
Ta ressource est dehors — elle revient rarement toute seule.

**→ LE MINI-RES**
- Lumière : ton dehors te recharge — tu reviens plus disponible.
- Ombre : le monde t'emporte parfois — la maison attend.
- Mode d'emploi : ramène une activité de fond à deux — la recherche documente sa valeur.

### MR-33-TL-MIXTE — l'entre-deux

**TA LUMIÈRE**
Ton énergie vient des deux rives, comme tes réponses le disent : tantôt le dehors te recharge, tantôt le chez-toi. Tu glisses entre les modes selon les semaines — une aisance discrète. Ni l'un ni l'autre ne te coûte. Ta flexibilité couvre les deux rives sans y perdre pied.

**→ TON OMBRE (en couple)**
L'entre-deux s'adapte, mais il se lit mal. La recherche documente que les profils mixtes vivent fréquemment des attentes floues. L'autre ne sait pas si le vendredi t'appelle dehors ou chez vous. La friction des modes se nomme tôt : dis ton mode de la semaine, il devient une convention. Le coût pour toi : passer pour changeant quand tu es souple. Le coût pour l'autre : préparer deux scénarios à chaque week-end.

**→ TA TENSION**
Ton mode bouge — il se lit dehors, pas dedans.

**→ LE MINI-RES**
- Lumière : ta souplesse épouse les saisons de ton énergie.
- Ombre : deux rives possibles — l'autre devine la tienne.
- Mode d'emploi : nomme ton mode du moment — l'entre-deux y gagne un langage.

### MR-33-TL-CENTRIPETE — le cocon

**TA LUMIÈRE**
Ton énergie se recharge chez toi, comme tu l'as répondu : après une semaine chargée, la maison te rend à toi. Le calme est ta ressource — c'est une façon entière de se nourrir, pas un rétrécissement.

**→ TON OMBRE (en couple)**
Le cocon nourrit, mais il ferme. La recherche documente que les profils centripètes vivent fréquemment des partenaires qui se sentent étouffés. Ou à l'inverse embarqués dans un dedans qu'ils n'ont pas choisi. Quand ton mode croise un mode centrifuge, la friction se documente des deux côtés : l'un se sent délaissé, l'autre étouffé. Elle se traverse mieux annoncée tôt. Le coût pour toi : un dedans que le dehors sollicite sans fin. Le coût pour l'autre : un monde qui s'arrête à la porte.

**→ TA TENSION**
Ta ressource est dedans — le dehors la réclame à sa porte.

**→ LE MINI-RES**
- Lumière : ton chez-toi recharge vraiment — le calme se partage.
- Ombre : le cocon referme parfois — le monde frappe.
- Mode d'emploi : accueille une activité de dehors à deux — le cocon y gagne une fenêtre.

## 2 — Gabarit paramétré (assemblage moteur)

**GAB-MR-33-TL** :
- `texture_seed` → fixe (1 variante par profil) · `MODE_D` → centrifuge (> 0.65) / mixte
  (0.35-0.65) / centripète (< 0.35) — bornes FM-019, provisoire concepteur (SIG-3.3-01,
  À VALIDER PAR LE COMITÉ).
- `citation_items` → rappel en toutes lettres d'UN direct et d'UN inversé réels, résolus verbatim
  contre `01-tableau-des-items.md` — JAMAIS les codes, jamais le score.
- `croisement_relationnel` (SIG-3.3-02) → la friction des modes opposés se documente en situation
  générique (le délaissé × l'étouffé — registre fréquentiel) + l'homogamie des loisirs (une
  activité de fond partagée — la recherche documente) ; l'écart CALCULÉ du couple reste moteur,
  jamais rendu.
- **Aucune trame au rendu** (verrou 04 n° 5) — le score CSR et le croisement 2.4 restent moteur.

## 3 — Table d'ancrage (affirmation → items → vérification)

| Brique (ID moteur) | Affirmation rendue | Items (champ moteur) | Vérification |
|---|---|---|---|
| MR-33-TL-CENTRIFUGE | « le monde est ta ressource » | Q3.3-01 → 08, MODE_D > 0.65 | Citations résolues verbatim contre le tableau 01 ; aucun code rendu |
| MR-33-TL-MIXTE | « tantôt le dehors, tantôt le chez-toi » | MODE_D 0.35-0.65 | idem |
| MR-33-TL-CENTRIPETE | « le calme est ta ressource, pas un rétrécissement » | MODE_D < 0.35 | idem — le mode dedans respecté, jamais un défaut |

## 4 — Signatures intégrées (registre 03 — aucune inventée)

| Signature | Intégration au miroir |
|---|---|
| **SIG-3.3-01 — Le mode** | Le champ de saillance (§0) applique les seuils blocs ; le rendu parle d'images (le grand air, l'entre-deux, le cocon), jamais d'étiquette ni de degré de sociabilité. |
| **SIG-3.3-02 — Le croisement des modes** | Aucun texte calculé — l'ombre documente la friction en situation GÉNÉRIQUE (le délaissé × l'étouffé) et l'homogamie au registre fréquentiel ; l'écart CALCULÉ à un membre ne se raconte jamais, jamais de pénalité, jamais d'élimination. |
| **SIG-3.3-03 — La vigilance des consommations (CSR)** | **Aucune intégration au rendu — par design** : les 4 trames n'apparaissent dans aucun slot, aucune citation, aucun texte ; le signal vit côté moteur seul (croisement 2.4, fiabilité du profil ajustée, demi-vie). Vérifié machine (aucun mot du champ trame dans les segments rendus). |

## 5 — Contrôles avant livraison (affichés)

| Contrôle | Résultat |
|---|---|
| Volume 150-250 mots par variante (markup inclus) | ✅ 3/3 (comptage machine — voir rapport de vague) |
| Ombre ≥ lumière par variante | ✅ 3/3 |
| Conséquence probabiliste | ✅ 3/3 (« la recherche documente que ») |
| Coût double nommé | ✅ 3/3 |
| Neutralité du mode (3 jugements interdits absents) | ✅ |
| AUCUNE trace des trames CSR dans les segments rendus | ✅ vérifié machine |
| L'homogamie en information (jamais une norme) | ✅ |
| Rappels en toutes lettres (jamais un code) | ✅ |
| Zéro interdit lexical | ✅ |
| Zéro vocabulaire clinique | ✅ |
| L'écart calculé à un membre jamais rendu (SIG-3.3-02 sans trace) | ✅ vérifié machine |
| Ouvertures non identiques entre profils | ✅ (le grand air · les deux rives · le cocon) |

## TABLE DE FICHIERS (format P1)

═══ FICHIER : Livrable des mondes/M4-3.3-Ton-Temps-Libre/07-miroir.md ═══
(écrit directement sur disque — accès FS ; la présente table consigne la livraison)
═══ FIN FICHIER ═══

> Fichier touché par la présente livraison : un seul — `07-miroir.md` (créé V9.C).
> Aucune signature inventée ; SIG-3.3-01/02/03 formalisent des bornes déjà cadrées par la mission
> et le registre signaux.json (CSR → quête 3.3, prévu dès la matérialisation du registre).
