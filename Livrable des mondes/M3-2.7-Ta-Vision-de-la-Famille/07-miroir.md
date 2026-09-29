# LIVRABLE 7 — MIROIR DE QUÊTE (ÉTAGE 2) — QUÊTE 2.7 « TA VISION DE LA FAMILLE »

> **Brique paramétrée — standard v2** · Miroir **MOYEN** (8 items → gabarit **150-250 mots/variante**,
> Constitution [7]) · **3 profils** : parent-avide / indécis-serein / sans-enfant-choisi — **chaque
> profil respecté**, ombres prévues par la mission. Structure : **TA LUMIÈRE** · **→ TON OMBRE
> (en couple)** · **→ TA TENSION** · **→ LE MINI-RES**. Ombre ≥ lumière · registre probabiliste ·
> coût double nommé · rappels en toutes lettres · zéro métadonnée · **le dealbreaker ne se raconte jamais**.

## 0 — Champ de saillance

Quête à brique unique : les 8 réponses produisent **une** brique, choisie par le désir d'enfants
DESIR (moyenne recodée, normalisée) : **parent-avide** (> 0.65) · **indécis-serein** (0.35-0.65) ·
**sans-enfant-choisi** (< 0.35) — bornes reprises FM-019, provisoire concepteur. Les noms de profils
sont des ID moteur ; le rendu parle en images (le berceau qui attend, la porte entrouverte, la route
à deux), jamais en étiquette.

## 1 — Les 3 profils

### MR-27-FAM-AVIDE — parent-avide (ID moteur)

**TA LUMIÈRE**
Ton désir d'enfants est clair et il avance : c'est un projet qui s'annonce, pas une hypothèse lointaine. Tu poses les questions difficiles maintenant — c'est rare, et ça change tout.

**→ TON OMBRE (en couple)**
La clarté qui avance peut presser : l'autre n'a peut-être pas fini de répondre, et la question posée trop tôt devient un mur. La recherche documente que le désir pressant conduit fréquemment à des décisions prises par l'un, ressenties comme subies par l'autre. Le coût pour toi : une réponse arrachée qui ne tiendra pas debout. Le coût pour l'autre : choisir sous lampe torche, sans horizon pour respirer.

**→ TA TENSION**
Ton désir est une boussole — il devient carcan quand il compte les heures de l'autre.

**→ LE MINI-RES**
- Lumière : tu sais ce que tu veux, et ça évite des années de flou.
- Ombre : le flou de l'autre n'est pas un refus — c'est parfois un chantier.
- Mode d'emploi : pose ton désir en toutes lettres, puis laisse la question respirer.

### MR-27-FAM-SEREIN — indécis-serein (ID moteur)

**TA LUMIÈRE**
Ton désir est en équilibre ouvert : ni lancé d'un coup, ni fermé. Tu réponds « peut-être » parce que c'est vrai — et un peut-être honnête vaut mieux qu'un oui de circonstance ou un non de peur.

**→ TON OMBRE (en couple)**
L'équilibre ouvert porte une ombre discrète : quelqu'un finira par porter la décision. La recherche documente que l'ambivalence durable conduit fréquemment à laisser le temps trancher — et le temps tranche rarement seul. Le coût pour toi : une vie qui décide à ta place, par de petits défauts successifs. Le coût pour l'autre : attendre une réponse que tu n'écris pas — ou l'écrire seul·e.

**→ TA TENSION**
Ton peut-être est honnête — il lui faut une date posée, pas une réponse.

**→ LE MINI-RES**
- Lumière : ton ouverture est sincère, elle ne trompe personne.
- Ombre : sans date, le peut-être devient le choix des autres.
- Mode d'emploi : donne-toi une échéance intérieure — le flou y gagne un cadre.

### MR-27-FAM-ROUTE — sans-enfant-choisi (ID moteur)

**TA LUMIÈRE**
Ton projet ne passe pas par les enfants — c'est un choix, pas un manque. Tu construis une vie entière autrement, et tu as le droit de la vouloir pleine, à deux, sans parenthèse inutile.

**→ TON OMBRE (en couple)**
Le choix clair a son angle mort : la personne en face change, et l'incompatibilité se découvre parfois tard — quand les années ont déjà tissé. La recherche documente que les désirs d'enfants opposés finissent fréquemment par se dire, rarement par se rencontrer. Le coût pour toi : des attachements qui butent sur la même question. Le coût pour l'autre : renoncer à un désir profond — ou te renoncer.

**→ TA TENSION**
Ta route est choisie — elle gagne à se dire tôt, en toutes lettres.

**→ LE MINI-RES**
- Lumière : ta vie choisie se tient debout, sans justification.
- Ombre : dite tard, la route coûte des années tissées.
- Mode d'emploi : dis ton choix dès que ça compte — la franchise y gagne des ans.

## 2 — Gabarit paramétré (assemblage moteur)

**GAB-MR-27-FAM** :
- `texture_seed` → fixe (1 variante par profil) · `DESIR` → parent-avide (> 0.65) / indécis-serein
  (0.35-0.65) / sans-enfant-choisi (< 0.35) — bornes FM-019, provisoire concepteur.
- `citation_items` → rappel en toutes lettres d'UN direct et d'UN inversé réels, résolus verbatim
  contre `01-tableau-des-items.md` — JAMAIS les codes, jamais un score, jamais un chiffre d'années.
- **Le dealbreaker ne se raconte jamais** (verrou 04 n° 5) : aucun texte d'incompatibilité, aucune
  mention d'élimination — le slot S3 parle de la famille élargie comme une géographie, pas une
  doctrine (angle mission V8.C).

## 3 — Table d'ancrage (affirmation → items → vérification)

| Brique (ID moteur) | Affirmation rendue | Items (champ moteur) | Vérification |
|---|---|---|---|
| MR-27-FAM-AVIDE | « un projet qui s'annonce » | Q2.7-01 → 08, DESIR > 0.65 | Citations résolues verbatim contre le tableau 01 ; aucun code rendu |
| MR-27-FAM-SEREIN | « un équilibre ouvert » | DESIR 0.35-0.65 | idem |
| MR-27-FAM-ROUTE | « c'est un choix, pas un manque » | DESIR < 0.35 | idem — le choix sans enfant respecté en toutes lettres |

## 4 — Signatures intégrées (registre 03 — aucune inventée)

| Signature | Intégration au miroir |
|---|---|
| **SIG-2.7-01 — Le cap qui ne passe pas** | Aucun texte — le dealbreaker (divergence ≥ 2, SQL pré-filtrage) façonne le pool en silence ; aucune brique ne mentionne l'incompatibilité ni l'élimination. |
| **SIG-2.7-02 — L'horizon qui ne se croise pas** | Aucun texte — le signal « à aborder tôt » alimente les amorces de conversation, jamais le miroir individuel ; l'horizon est rendu en proximité relative (verrou 04 n° 6). |

## 5 — Contrôles avant livraison (affichés)

| Contrôle | Résultat |
|---|---|
| Ombre ≥ lumière par variante | ✅ 3/3 |
| Conséquence probabiliste | ✅ 3/3 (« la recherche documente que ») |
| Coût double nommé | ✅ 3/3 |
| Rappels en toutes lettres (jamais un code, jamais un chiffre d'années) | ✅ |
| Zéro interdit lexical | ✅ |
| Chaque profil respecté (aucun désir dressé en vertu, aucun choix traité en manque) | ✅ |
| Zéro mention du dealbreaker dans un texte rendu | ✅ vérifié machine |
| Ouvertures non identiques entre profils | ✅ (projet qui s'annonce · équilibre ouvert · projet sans enfants) |
| Volume 150-250 mots par variante | ✅ 3/3 (comptage machine) |

## TABLE DE FICHIERS (format P1)

═══ FICHIER : Livrable des mondes/M3-2.7-Ta-Vision-de-la-Famille/07-miroir.md ═══
(écrit directement sur disque — accès FS ; la présente table consigne la livraison)
═══ FIN FICHIER ═══

> Fichiers touchés par la présente livraison : un seul — `07-miroir.md` (créé). Aucune signature
> inventée : la règle du dealbreaker appartient au contrat, l'opération SQL est proposée (03).
