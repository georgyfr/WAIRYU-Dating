# LIVRABLE 1 — LES 5 AXES DE LA QUÊTE 2.6 « TES PRIORITÉS POUR LES 5 PROCHAINES ANNÉES »

> **Format : JEU D'ARBITRAGE (NON-Likert)** — 100 points à répartir sur 5 curseurs, somme verrouillée.
> Pas d'échelle, pas d'orientation D/I, pas de dimension psychométrique (`dimension = null`,
> `orientation = null`). Un seul écran — les 5 axes ensemble.
> Légende de la fiche condensée — `C:` carte · `S:` signal · `F:` fiabilité · `M:` modulation · `A:` ancrage.
> ⚠ **Aucune trame ▲** : quête déclarative directe, déguisement impossible — aucune trame.

| Code (gelé) | Axe | Description exacte (2 phrases, à l'écran) | Fiche de computation — 5 canaux |
|---|---|---|---|
| Q2.6-01 | Carrière / ambition | Faire grandir ce que tu construis professionnellement. Formations, responsabilités, lancement : les années où ton travail avance fort. | C: répartition→profil de décennie · S: SIG-2.6-01 (écart > 40 ⚠) · F: somme verrouillée + relecture possible · M: distance pondérée (moteur) · A: rappel OK — « quand tu as mis tant de points sur la carrière » |
| Q2.6-02 | Famille / projet parental | Faire de la place pour un enfant — ou pour ceux qui sont là. Le temps, l'énergie et les arbitrages du quotidien tournés vers la famille. | C: répartition→profil · S: idem 01 · F: idem 01 · M: idem 01 · A: rappel OK — « quand tu as donné la priorité à la famille » |
| Q2.6-03 | Liberté / aventures | Partir, bouger, découvrir sans tout planifier. Les années où la légèreté du sac pèse plus que le socle. | C: répartition→profil · S: idem 01 · F: idem 01 · M: idem 01 · A: rappel OK — « quand tu as mis le paquet sur la liberté » |
| Q2.6-04 | Stabilité / sécurité | Bâtir un socle qui tient : épargne, logement, santé, rythmes durables. Les années où tu sécurises avant d'étendre. | C: répartition→profil · S: idem 01 · F: idem 01 · M: idem 01 · A: rappel OK — « quand tu as choisi de sécuriser d'abord » |
| Q2.6-05 | Projets personnels | Faire vivre ce qui est à toi : créer, courir, t'engager. Les années où tes projets personnels — créatifs, sportifs, associatifs — trouvent leur fenêtre. | C: répartition→profil · S: idem 01 · F: idem 01 · M: idem 01 · A: rappel OK — « quand tu as gardé des points pour tes projets à toi » |

## Mécanique (exacte — rendu écran)

| Règle | Mise en œuvre |
|---|---|
| 5 curseurs | un par axe, plage 0 → 100, pas de 1 |
| **Somme verrouillée à 100** | le compteur affiche le reste à répartir ; le bouton de validation reste inactif tant que Σ ≠ 100 — aucune sortie partielle |
| **Aucune valeur par défaut** | profil vierge au départ : chaque curseur exige un geste — l'équilibrage par défaut serait une suggestion de caractère (interdit) |
| Un seul écran | les 5 axes ensemble — l'arbitrage se voit d'un coup d'œil (c'est sa nature : une répartition, pas une série de réponses) |
| Relecture | modifiable jusqu'à la validation ; re-passage possible (quête Libre) — la décennie se relit |

## Décisions de composition documentées (domaine réservé [9] — propositions)

0. **Axe 05 « Projets personnels » (mission V8.B — RE-SPÉCIFICATION TRACÉE)** : la VAGUE 6 avait
   livré l'axe « Projets communs à deux » (« Construire avec quelqu'un, pierre après pierre… »).
   La mission V8.B nomme les 5 axes : « Carrière/Ambition · Projet familial · Liberté/Aventures ·
   Stabilité/Sécurité · **Projets personnels (créatif, sportif, associatif...)** » — l'axe 05 est
   réécrit en conséquence (production neuve déclarée — B.3 : aucun source gelé pour cette quête ;
   ancienne description archivée dans l'historique git, commit `307f33e`). Conséquence documentée :
   le couple n'est plus un axe NOMMÉ — il traverse les 5 (l'intro « pas comme tu voudrais
   paraître » et l'ombre « quand le couple porte l'axe sacrifié », mission V8.A/V8.B, restent le
   lieu relationnel de la quête).
1. **« ou pour ceux qui sont là » (Q2.6-02)** : l'axe famille accueille les parents déjà en place —
   la formulation évite de présupposer un projet parental à venir (neutralité, C4).
2. **Descriptions à 2 phrases** : chacune nomme le GESTE (faire grandir, faire de la place, partir,
   bâtir, faire vivre) puis le TEMPS (les années où…) — le format ancre l'horizon de 5 ans sans
   promettre de résultat (aucun futur certain).
3. **Aucun exemple de répartition à l'écran** : montrer une répartition exemplaire ferait une
   suggestion de caractère — la mécanique vierge est la consigne.
4. **L'ordre d'affichage des axes (01 → 05)** est canonique et fixe (voir 02) — l'arbitrage se
   lit d'un coup, l'ordre ne fait que structurer l'écran.

## Contrôles mécaniques passés

| Contrôle | Résultat |
|---|---|
| 5 axes exactement — descriptions de 2 phrases chacune | ✅ |
| Descriptions concrètes, zéro normativité, zéro futur certain | ✅ |
| Zéro valeur par défaut (documenté à la mécanique) | ✅ |
| Somme verrouillée à 100 (documentée, implémentable tel quel) | ✅ |
| Zéro double négation, zéro fréquence ambiguë | ✅ |
| Neutralité normative (aucun horizon « meilleur ») | ✅ |
| Aucun item de trame ▲, aucun énoncé réservé | ✅ |
