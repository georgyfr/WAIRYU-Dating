# Proposition Action n°3 — Quête 1.1 « Ta personnalité » (EN DISCUSSION)

> **STATUT : PROPOSITION EN DISCUSSION avec le fondateur.** Rien de ce dossier n'est
> intégré à l'application. Aucun libellé, aucune image, aucun moteur modifié.

## Objet

Amorce concrète de l'**Action n°3** (libellés réels des 23 instruments), lancée par le
fondateur le 24/10/2026 : « je ne suis pas doué en psychothérapie… tu me proposes des
questions et on les améliore avant que tu les pousses ». Le fondateur demande aussi des
**choix illustratifs** : l'utilisateur coche une illustration qui renvoie à la question
principale.

## Le principe proposé — l'échelle illustrée

La quête 1.1 = 50 affirmations Likert 1-5 (« Pas du tout moi » → « Tout à fait moi »),
moteur `apps/web/src/lib/quete-1-1.ts` **scellé et validé** (50 items, 24 inversés,
ordre de passation gelé graine 211427, 7 cartes V1-V7 — 40/40 vérifications).

La proposition : **les 5 boutons de réponse deviennent 5 cartes illustrées**.
Cocher l'illustration *n* ⇔ répondre la valeur *n* de l'échelle — **le moteur ne voit
aucune différence** (même entier 1-5, même scoring bit-exact). C'est le mécanisme
éprouvé Task 74 : on change la PEAU (textes, images), jamais le squelette (codes,
orientations, dimensions, ordre).

- **Style A — « Le Miroir »** (`echelle-miroir/niveau-1…5.png`) : en écho au Monde 1
  « Le Miroir » — le reflet gagne en présence à mesure que l'affirmation résonne :
  dos tourné / reflet esquissé / reflet contour / reflet presque soi / reflet pleinement soi.
- **Style B — « Le Fleuve »** (`variante-style-fleuve.png`) : gouache plus picturale, en
  écho à la carte du fleuve (P05) — le reflet dans l'eau calme. Un seul niveau généré
  comme échantillon d'ambiance.

## Limite honnête des échantillons

Les 5 niveaux du style A présentent une **dérive de cohérence** (coiffe, cadre du
miroir, vêtements changent d'une image à l'autre) — inhérent à la génération IA sans
référence verrouillée. Plan de production si le style est retenu : figer UNE fiche
personnage + UN cadre validés, puis décliner les 5 niveaux en dérivation contrôlée
(génération contrainte ou retouche design), avec validation fondateur à chaque niveau.

## Ce qui est proposé en discussion (chat, même jour)

- Les **10 premières affirmations dans l'ordre de passation réel** (deck gelé), avec
  pour chacune : dimension mesurée (O/C/E/A/S), orientation (directe/inversée), type de
  réponse (échelle illustrée 1-5), et **pourquoi** cette question est construite ainsi.
- 2-3 candidats au **polissage** (ex. Q1.1-16, formulation opaque) pour illustrer la
  méthode d'amélioration : proposer → discuter → sceller.
- La règle d'or : tout libellé modifié ⇒ EN i18n synchronisé (`i18n/content/en/quete-1-1`),
  vérifications 9/9 relancées (`bun scripts/check-quete-1-1.ts`), re-score bit-exact,
  commit + push progressif.

## Prochaine étape

Retour du fondateur sur (1) le ton des questions, (2) le style d'illustration — puis
déploiement aux 40 affirmations restantes, quête par quête, toujours en discussion
avant push.
