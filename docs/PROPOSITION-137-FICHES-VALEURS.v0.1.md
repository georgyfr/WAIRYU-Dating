# PROPOSITION 137 — Fiches « à quoi ça sert » & les 20 affirmations du monde 3

**Version :** v0.1 — mise en démo dans la refonte (Next.js). Rien de déployé, prod inchangée.
**Sources :** CAHIER-CONTENU-RECOMPENSES §1/§2/§3.1 (grille des 3 réponses, gabarit carte-découverte, exemple « L'Apprenti·e »), maquette « Wairyu — Tes valeurs, refonte.html » (métadonnées verbatim), wairyu-engine.mjs (moteur réel, inchangé).

---

## 1. La fiche « à quoi ça sert » des cartes (cahier §3.1 — branchée)

Ce qui est maintenant en place dans l'onglet **Cartes** de Ma récolte :

1. **Chaque carte de la galerie** (les 8 de la maquette) ouvre sa **fiche complète** — plus le toast « s'ouvrira ici ». Les mêmes fiches s'ouvrent depuis les **Dernières cartes** de l'Aperçu.
2. La fiche suit **mot pour mot le gabarit §3.1** : *Ce que c'est.* / *Ta carte en entier* (repliable — lumière, ombre, tension) / *À quoi ça sert dans les rencontres* (3 puces) / *Comment l'utiliser.* / footer anti-score conservé : « Ce n'est ni un score, ni un diagnostic… ».
3. **L'exemple réel « L'Apprenti·e »** (quête « Tes émotions », verbatim fondateur du cahier) est exposé en vitrine sous la galerie, badge **« EXEMPLE RÉEL DU CAHIER §3.1 »** — sa fiche est complète à 100 %, avec le verbatim intégral cité, jamais réécrit.
4. **Ligne rouge respectée :** les 8 cartes de la maquette n'ont PAS de verbatim lumière/ombre/tension en local. Leurs fiches portent les 3 réponses (couche app — différenciante par carte, c'est la règle §1) et la section « Ta carte en entier » affiche l'honnêteté : *« le verbatim intégral vit dans les données de l'app réelle — la maquette ne l'invente pas »*. **[À VALIDER]** : fournir les verbatims réels (ou valider que la prod les possède déjà) pour compléter ces 8 fiches.

## 2. Les 20 affirmations de « Tes valeurs » — PROPOSITION à valider

État réel : la maquette donne le **cadre verbatim** (20 affirmations · 5 niveaux · 0 chronomètre ; « 4 familles de valeurs, en 4 barres » ; intro ; « à quoi sert cette quête ? ») mais **aucun texte d'affirmation**. Voici une proposition complète, **au format du moteur réel** (EngineQuest) — la démo est jouable depuis l'écran Quête (bannière or « CONTENU PROPOSÉ — À VALIDER » pendant toute la démo). Chaque affirmation est éditable 1:1 dans `src/lib/quete-valeurs.ts`.

### Famille 1 — Ton besoin d'ancrage *(pôles : le mouvement ↔ l'ancrage)*
1. Avant de dire oui à un projet, j'aime savoir où j'en serai dans six mois.
2. Mes habitudes me rassurent : je les choisis, et je m'y tiens.
3. Je m'engage sur la durée quand quelque chose compte pour moi.
4. Un imprévu qui bouscule mes plans me pèse plus longtemps qu'il ne m'amuse.
5. *(inverse)* Quand tout est trop calme, je cherche vite un nouveau départ.

### Famille 2 — Ta façon d'avancer *(pôles : profiter du présent ↔ construire la suite)*
6. Je choisis souvent ce qui me construit sur le long terme, même si c'est plus lent.
7. J'aime fixer un cap et mesurer le chemin déjà fait.
8. *(inverse)* Mon temps et mon argent partent d'abord aux moments qui comptent aujourd'hui.
9. Quand je veux quelque chose d'ambitieux, j'y travaille sans attendre que ce soit facile.
10. *(inverse)* Préparer demain me fatigue : je préfère laisser la vie venir.

### Famille 3 — Toi et les autres *(pôles : ton espace ↔ le partage)*
11. Les grandes décisions se prennent avec les personnes qui comptent, pas seul(e) dans mon coin.
12. Je raconte mes bonnes comme mes mauvaises nouvelles à mes proches, sans filtrer longtemps.
13. *(inverse)* J'ai besoin de moments à moi, même quand tout va bien autour de moi.
14. Être disponible pour les miens passe avant mes propres envies du moment.
15. *(inverse)* Garder mon indépendance, même en couple, n'est pas négociable pour moi.

### Famille 4 — Ce qui te décide *(pôles : la raison ↔ le cœur)*
16. Mes meilleurs choix sont venus d'une intuition que je ne sais pas toujours expliquer.
17. *(inverse)* Avant de choisir, je liste le pour et le contre — calmement, par écrit si besoin.
18. Une décision juste, ça se sent dans le corps avant de se prouver.
19. *(inverse)* Je suis mes principes même quand mon envie dit autre chose.
20. Sur les grandes questions, je fais confiance à mon premier mouvement.

### Combos et lectures (propositions aussi)
- **Combo 1** : ancrage *bas* + construire *haut* → « Tu construis loin, en gardant tes fenêtres ouvertes ».
- **Combo 2** : ce-qui-te-décide *haut (cœur)* + partage *haut* → « Tu décides avec le cœur, entouré des tiens ».
- Chaque famille a ses lectures bas/milieu/haut, sa ligne « dans ta rencontre » et 2 pas concrets — tout dans `quete-valeurs.ts`, tout modifiable.

### Vérifications faites
- 4 personas passés au moteur réel en ligne de commande (tout-4, tout-1, tout-5, mélange) : 0 erreur, titres/combos/ambivalences corrects.
- Démo jouable en navigateur : 20 réponses → résultat (titre, réponses, lecture, tension, relation, pas, 4 barres) ; bannière proposition visible aux deux étapes ; « Rejouer » et « Pause » fonctionnels.
- Non-régression : la démo « Famille » (contenu réel) marche toujours ; coquille `ancre`→`ancrage` corrigée (c'était le crash `reading 'high' of undefined`).
- ESLint src = 0 erreur (9 préexistantes audit-m1/upload). Erreurs console : 0 (capturées par hook sur le parcours doré complet).

## 3. [À VALIDER] par le fondateur
1. Les 20 affirmations — valider, corriger ou réécrire (le doc ci-dessus est la liste de relecture).
2. Les noms des 4 familles et leurs pôles.
3. Les combos et toutes les lectures (le moteur les affichera tels quels une fois validés).
4. Fournir les verbatims lumière/ombre/tension des 8 cartes maquette pour compléter leurs fiches.
5. La vitrine des sceaux au même gabarit (cahier §3.4) — chantier suivant possible.

---

## VALIDATION (2026-10-21 — chat staging, trace fondée sur l'ordre fondateur)

**« Valider les 20 affirmations "Tes valeurs" »** — le fondateur a validé le contenu proposé en §2.

Conséquences gravées :
1. Le contenu vit désormais dans la vraie app : `apps/web/src/lib/quete-valeurs-20.ts` (verbatim intégral, types locaux, NOTE_VALEURS_VALIDEES).
2. **Confrontation documentée** : la vraie app possède DÉJÀ la quête 2.1 « Tes valeurs » (Schwartz — 10 dimensions, 4 blocs, 8 variantes, contresignée RIO). Les 20 affirmations validées = grille COMPLÉMENTAIRE (4 familles / 4 barres). Elles NE remplacent PAS 2.1.
3. Branchement différé, au choix du fondateur : (a) quête bonus hors progression (sans toucher l'anneau ni la clôture M3), ou (b) refonte visuelle « 4 barres » de l'écran 2.1. Rien ne se perd — la source est gravée.
4. Les 8 fiches « à quoi ça sert » de la maquette (§1.4 [À VALIDER]) : sans objet — la vraie app lit les verbatims RÉELS de ses cartes (InfoRecolte + carte.lumiere/ombre/tension).
