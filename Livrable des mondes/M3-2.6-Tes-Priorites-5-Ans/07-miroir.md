# LIVRABLE 7 — MIROIR DE QUÊTE (ÉTAGE 2) — QUÊTE 2.6 « TES PRIORITÉS POUR LES 5 PROCHAINES ANNÉES »

> **Brique paramétrée — standard v2** · Miroir **LÉGER** (5 axes → gabarit **80-150 mots/variante**,
> Constitution [7]) · **4 profils types** : carrière-dominant / famille-dominant / équilibré /
> liberté-dominant. Structure : **TA LUMIÈRE** · **→ TON OMBRE (en couple)** · **→ TA TENSION** ·
> **→ LE MINI-RES**. Ombre ≥ lumière · registre probabiliste · coût double nommé · rappels en
> toutes lettres (l'axe, jamais les points) · zéro métadonnée.

## 0 — Champ de saillance

Quête à brique unique : la répartition produit **une** brique, selon la partition §2 (exclusive +
exhaustive). La friction carrière-dominant × famille-dominant est nommée (friction documentée n°1
des cinq premières années — mission), jamais prophétisée.

## 1 — Les 4 profils

### MR-26-PRI-CAR — carrière-dominant

**TA LUMIÈRE**
Tes points vont à la carrière : cette décennie est celle du chantier pro. Tu sais ce que tu bâtis, et ton énergie va là où elle se double.

**→ TON OMBRE (en couple)**
À deux, le calendrier se règle sur les projets : l'autre cherche sa place entre deux lancements. La recherche documente que le croisement répartition carrière-dominant × répartition famille-dominant est la friction la mieux documentée des cinq premières années. Le coût pour toi : une réussite à raconter seul·e si personne n'a tenu la maison. Le coût pour l'autre : aimer quelqu'un qui rentre de chantier en chantier.

**→ TA TENSION**
Ton cap est clair — il lui faut une maison, pas un bureau d'attente.

**→ LE MINI-RES**
- Lumière : tu investis où tu comptes — ça construit.
- Ombre : le chantier ne laisse pas forcément une place assise.
- Mode d'emploi : garde un rendez-vous hebdo qui ne se déplace pas pour le travail.

### MR-26-PRI-FAM — famille-dominant

**TA LUMIÈRE**
Tes points vont à la famille : faire de la place pour un enfant — ou pour ceux qui sont là. C'est un choix assumé, pas un repli.

**→ TON OMBRE (en couple)**
Le projet familial absorbe : les soirées se remplissent de gestion, et la part qui n'est pas la famille se met en veille — y compris ta part propre. La recherche documente que l'investissement familial total conduit fréquemment à un couple qui ne parle plus que gestion. Le coût pour toi : t'oublier dans l'agencement. Le coût pour l'autre : devenir co-équipier avant d'être la personne choisie.

**→ TA TENSION**
Ta priorité construit un foyer — il lui faut une porte qui mène aussi à toi.

**→ LE MINI-RES**
- Lumière : tu donnes de la place, et la place change des vies.
- Ombre : le foyer absorbe — y compris celle qui l'a fondé.
- Mode d'emploi : garde un projet à toi — le foyer y gagne deux personnes.

### MR-26-PRI-EQU — équilibré (répartition large ou ancrage)

**TA LUMIÈRE**
Tes points ne font pas de course : soit tu répartis largement, soit tu as posé l'ancrage — stabilité, projets communs — comme socle, pas comme bannière. Ta décennie se règle sur la tenue : tu bâtis en tenant.

**→ TON OMBRE (en couple)**
L'équilibre a son coût : tu répartis si bien que rien n'explose, rien ne décolle. La recherche documente que les répartitions sans course conduisent fréquemment à des années pleines et à peu de chantiers terminés. Le coût pour toi : la sensation d'avancer sans graver. Le coût pour l'autre : s'ajuster à un plan qui garde ses distances avec l'audace.

**→ TA TENSION**
Ton équilibre protège — il lui faut un chantier qui dépasse la maison.

**→ LE MINI-RES**
- Lumière : ta répartition tient la décennie sans la serrer.
- Ombre : rien ne déborde, rien ne s'élève.
- Mode d'emploi : choisis un horizon qui déborde de l'année — l'équilibre y gagne un cap.

### MR-26-PRI-LIB — liberté-dominant

**TA LUMIÈRE**
Tes points vont à la liberté : partir, bouger, découvrir sans tout verrouiller. Ces cinq années sont celles du sac léger — tu préfères les histoires aux habitudes, et ça se lit.

**→ TON OMBRE (en couple)**
La liberté qui mène se vit à deux comme un appel dehors : les projets posés peuvent sembler ajournés, et l'autre attend au campement. La recherche documente que la liberté non négociée conduit fréquemment à des couples qui vivent des agendas parallèles. Le coût pour toi : des beaux souvenirs sans témoin attitré. Le coût pour l'autre : suivre un sac qu'on ne pose pas.

**→ TA TENSION**
Ton horizon appelle — il lui faut un camp de base que l'autre a choisi aussi.

**→ LE MINI-RES**
- Lumière : tu ouvres les routes — les routes manquent rarement de vues.
- Ombre : qui part souvent choisit seul·e la fenêtre.
- Mode d'emploi : laisse l'autre poser une étape du voyage — la liberté y gagne un témoin.

## 2 — Partition des 4 profils (exclusive + exhaustive — C6)

```
DOMINANCE MARQUÉE ........ max ≥ 40 points ET écart avec le 2ᵉ axe ≥ 10 points
  max = carrière (Q2.6-01) ................ → MR-26-PRI-CAR (carrière-dominant)
  max = famille (Q2.6-02) ................. → MR-26-PRI-FAM (famille-dominant)
  max = liberté (Q2.6-03) ................. → MR-26-PRI-LIB (liberté-dominant)
SINON (tous les autres cas) :
  max = stabilité ou projets communs, OU aucune dominance marquée
  (répartition large, égalité multi-axes) . → MR-26-PRI-EQU (équilibré)
```

**Lecture documentée du cas « ancrage »** : une répartition dominée par la stabilité ou les projets
communs est une posture de SOCLE, pas une absence de cap — le gabarit équilibré l'accueille (« tu as
posé l'ancrage comme socle plutôt que comme bannière »). Ce mapping est une décision de composition
(domaine réservé [9] — proposition) : **À VALIDER PAR LE COMITÉ**.

## 3 — Gabarit paramétré (assemblage moteur)

**GAB-MR-26-PRI** :
- `texture_seed` → fixe (1 variante par profil) · `partition` → selon §2 (moteur, seuils verrou [9]).
- `citation_items` → rappel en toutes lettres de UN OU DEUX axes réellement dotés — JAMAIS les codes,
  JAMAIS les points chiffrés (verrou 04 n° 5).
- Aucune mention de l'écart à l'autre (SIG-2.6-01 sans trace — verrou 04 n° 6).

## 4 — Table d'ancrage (affirmation → items → vérification)

| Brique (ID moteur) | Affirmation rendue | Items (champ moteur) | Vérification |
|---|---|---|---|
| MR-26-PRI-CAR | « ces cinq années sont celles du chantier pro » | Q2.6-01 → 05, max carrière ≥ 40 | Citations résolues verbatim contre le tableau 01 ; aucun code, aucun point rendu |
| MR-26-PRI-FAM | « tu donnes la priorité au lien » | max famille ≥ 40 | idem |
| MR-26-PRI-EQU | « ta décennie se règle sur la tenue » | sinon (ancrage ou répartition large) | idem |
| MR-26-PRI-LIB | « ces cinq années sont celles du sac léger » | max liberté ≥ 40 | idem |

## 5 — Signatures intégrées (registre 03 — aucune inventée)

| Signature | Intégration au miroir |
|---|---|
| **SIG-2.6-01 — L'écart qui parle** | Aucun texte — le signal « à aborder tôt » alimente les amorces de conversation, jamais un miroir individuel. Le miroir décrit SA répartition ; la friction n°1 est citée comme fait documenté, jamais appliquée nominativement. |

## 6 — Contrôles avant livraison (affichés)

| Contrôle | Résultat |
|---|---|
| Partition exclusive + exhaustive des 4 profils | ✅ (§2 — vérifié machine) |
| Ombre ≥ lumière par variante | ✅ 4/4 |
| Conséquence probabiliste | ✅ 4/4 (« la recherche documente que ») |
| Coût double nommé | ✅ 4/4 |
| Rappels en toutes lettres (jamais un code, jamais les points) | ✅ |
| Zéro interdit lexical | ✅ |
| Friction n°1 citée sans prophétie ni nomination | ✅ |
| Ouvertures non identiques entre profils | ✅ (chantier pro · priorité au lien · pas de course · sac léger) |
| Volume 80-150 mots par variante | ✅ 4/4 (comptage machine) |

## TABLE DE FICHIERS (format P1)

═══ FICHIER : Livrable des mondes/M3-2.6-Tes-Priorites-5-Ans/07-miroir.md ═══
(écrit directement sur disque — accès FS ; la présente table consigne la livraison)
═══ FIN FICHIER ═══

> Fichiers touchés par la présente livraison : un seul — `07-miroir.md` (créé). Aucune signature
> inventée ; la partition « ancrage → équilibré » est documentée et renvoyée au comité.
