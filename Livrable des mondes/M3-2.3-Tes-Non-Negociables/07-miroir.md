# LIVRABLE 7 — MIROIR DE QUÊTE (ÉTAGE 2) — QUÊTE 2.3 « TES NON-NÉGOCIABLES »

> **Brique paramétrée — standard v2** · Miroir LÉGER (format checklist, non-Likert) → **80-150 mots/variante** (Constitution [7]).
> 1 brique (l'usage des non-négociables) × 2 variantes de texture : A « par l'exemple » · B « par le mécanisme ».
> Structure de chaque variante : **TA LUMIÈRE** · **→ TON OMBRE (en couple)** · **→ TA TENSION** · **→ LE MINI-RES**.
> Ombre ≥ lumière par variante (Constitution [2]) · registre probabiliste · coût double nommé.

## 0 — Champ de saillance

Quête à brique unique : la grille entière (9 items cochables + 1 champ libre) produit **une** brique. Le champ libre (Q2.3-10) n'a pas de brique : les mots de la personne ne sont jamais reformulés — rappel verbatim possible uniquement avec consentement (note 03-signatures).

## 1 — La brique (MR-23-NNC-A · MR-23-NNC-B)

### MR-23-NNC-A — variante A « par l'exemple »

**TA LUMIÈRE**
Tu as coché tes lignes rouges, sans détour : tu sais où tu ne négocies pas — ça filtre pour toi. La personne qui te lit n'a pas à deviner tes limites. Ton énergie va là où ça peut tenir.

**→ TON OMBRE (en couple)**
Le même stylo peut trop écrire. Une ligne de plus à chaque déception, et la liste devient une grille : personne ne passe plus entier. La recherche documente que des filtres excessifs produisent des pools vides. Le coût pour toi : des portes fermées avant d'avoir vu la pièce. Le coût pour l'autre : être écarté sur une case, sans avoir été rencontré.

**→ TA TENSION**
Tes lignes rouges te protègent — et chaque ligne de plus rétrécit le monde que tu veux habiter.

**→ LE MINI-RES**
- Lumière : tes limites claires trient pour toi.
- Ombre : trop de lignes, et le pool se vide.
- Mode d'emploi : relis ta liste chaque mois — garde ce qui te tient debout.

### MR-23-NNC-B — variante B « par le mécanisme »

**TA LUMIÈRE**
Le mécanisme d'abord : chaque coche déclare une limite qui travaille toute seule. Elle croise les réalités de tous, dans les deux sens. Tu sais où tu ne négocies pas : ça filtre pour toi.

**→ TON OMBRE (en couple)**
La mécanique ne juge pas — mais elle exécute sans nuance. Exemple : un profil plein d'atouts s'élimine sur un coche posé un soir de fatigue. Ton propre « oui » d'hier devient la ligne qui coupe aujourd'hui. La recherche documente que des filtres excessifs produisent des pools vides. Le coût pour toi : des rencontres qui n'arrivent jamais. Le coût pour l'autre : une élimination silencieuse, sur une case, jamais sur une personne.

**→ TA TENSION**
La limite honnête t'aligne — la limite à chaud te dépossède. Tu poses les règles, et c'est la règle qui reste.

**→ LE MINI-RES**
- Lumière : tes coches travaillent sans relance ni malaise.
- Ombre : la machine applique, sans discuter.
- Mode d'emploi : coche à froid — une limite née d'une déception attend une semaine.

## 2 — Gabarit paramétré (assemblage moteur)

**GAB-MR-23-BLOC** :
- `texture_seed` → variante A ou B · `n_coche` → nombre de coches (moteur).
- Branches : 1 coche ou plus → la brique §1 · **0 coche** (SIG-2.3-02 — la liste vide) → ligne alternative : « Tu n'as coché aucune ligne rouge : ton cadre est ouvert. La plupart des membres hésitent ici. C'est un choix assumé, pas un manque — et il se relit à tout moment. »
- `citation_items` → rappel en toutes lettres des énoncés cochés, s'il y en a — JAMAIS les codes.

## 3 — Table d'ancrage (affirmation → items → vérification)

| Brique (ID moteur) | Affirmation rendue | Items (champ moteur) | Vérification |
|---|---|---|---|
| MR-23-NNC-A/B | « tu sais où tu ne négocies pas » · « la liste qui filtre » | Q2.3-01 → Q2.3-09 (coches) | La citation d'un coche résout verbatim l'énoncé du tableau 01 ; aucun code rendu ; le champ libre (Q2.3-10) n'est jamais reformulé |
| Branche 0 coche | « ton cadre est ouvert » | Q2.3-01 → Q2.3-09 (aucun coché) | SIG-2.3-02 : le choix est documenté sans jugement ni pénalité |

## 4 — Signatures intégrées (registre 03 — aucune inventée)

| Signature | Intégration au miroir |
|---|---|
| **SIG-2.3-01 — Le filtre dur** | Aucun texte — l'élimination est déterministe, côté moteur, sans trace rendue chez l'un ni chez l'autre. La brique §1 documente l'USAGE de la liste, jamais son action en cours. |
| **SIG-2.3-02 — La liste vide** | Branche 0 coche du GAB-MR-23-BLOC : cadre ouvert documenté comme un choix assumé, sans jugement. |
| **SIG-2.3-03 — La ligne qui se retourne** | Aucun texte — signal QFI moteur seul : zéro trace UI, jamais au match, jamais dans les portraits. |

## 5 — Contrôles avant livraison (affichés)

| Contrôle | Résultat |
|---|---|
| Ombre ≥ lumière par variante | ✅ 2/2 |
| Conséquence probabiliste | ✅ (« la recherche documente que ») |
| Coût double nommé | ✅ 2/2 |
| Rappels en toutes lettres (jamais un code) | ✅ |
| Zéro interdit lexical | ✅ |
| Ouvertures non identiques entre variantes | ✅ (scène d'ouverture ≠ mécanisme d'ouverture) |

## TABLE DE FICHIERS (format P1)

═══ FICHIER : Livrable des mondes/M3-2.3-Tes-Non-Negociables/07-miroir.md ═══
(écrit directement sur disque — accès FS ; la présente table consigne la livraison)
═══ FIN FICHIER ═══

> Fichiers touchés par la présente livraison : **un seul** — `07-miroir.md` (créé). Aucun fichier 01-06 modifié, aucune signature inventée.
