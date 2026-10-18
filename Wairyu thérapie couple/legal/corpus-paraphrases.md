# Corpus de paraphrases analystes — protocole lexical RIO (référence)

> **Déposé le 18/10/2026, exécution P4 de l'audit pont WTC-LEGAL-01**
> (recommandation P4 : « Déposer le corpus de paraphrases + le script de calcul
> Jaccard dans `legal/` pour rendre la recalculabilité réelle » — alerte A4).
>
> **Provenance et statut — à lire avant tout usage :**
> 1. Ce corpus est le **corpus de travail déposé par le pont**, POSTÉRIEUR à l'audit
>    publié (`D-audit-pi.md`, §5). La table §5 de l'audit a été produite avec le
>    corpus analyste ORIGINAL de son producteur, **non déposé dans le dépôt**.
> 2. Les scores d'un rejeu avec ce corpus **ne sont donc pas comparables
>    item-par-item à la table §5 historique** — ils valident l'exécution du
>    protocole (normalisation, Jaccard, seuils) et rendent la recalculabilité
>    réelle pour tout instrument à venir (RIO-17, RIO-18, …).
> 3. Les paraphrases sont des reformulations analystes du PROPOS des instruments
>    de référence, écrites côté référence uniquement. **Aucun item d'instrument
>    de référence n'est reproduit verbatim** (DAS : dimensions uniquement — items
>    protégés jamais touchés ; canon lignes 352-354).
> 4. Méthode d'appariement : `legal/protocole_jaccard.py` (normalisation §4 du
>    document PI — minuscules, suppression accents/ponctuation, stopwords
>    français y compris « partenaire », « besoin » · Jaccard mots et bigrammes,
>    max des deux · seuils : vigilance ≥ 0,40 · alerte ≥ 0,70).

---

## ECR-R — anxiété d'attachement (Fraley, Waller & Brennan, 2000)

- [ECR-A-01] Je crains souvent que l'autre ne tienne moins à moi que je ne tiens à lui.
- [ECR-A-02] Le manque de réponse de l'autre m'angoisse et je cherche à être rassuré(e).
- [ECR-A-03] Quand l'autre semble distant(e), je me demande si je compte vraiment pour lui ou elle.
- [ECR-A-04] J'ai peur que cette relation ne dure pas autant que je le voudrais.
- [ECR-A-05] Le besoin de proximité de l'autre me met en alerte sur ce qu'il ou elle ressent vraiment.
- [ECR-A-06] Je m'irrite quand l'autre me laisse seul(e) alors que j'ai besoin de lui ou d'elle.

## ECR-R — évitement d'attachement (Fraley, Waller & Brennan, 2000)

- [ECR-E-01] Je préfère ne pas trop compter sur les autres pour rester indépendant(e).
- [ECR-E-02] Je n'aime pas parler de mes sentiments les plus profonds à mon ou ma compagne ou compagnon de vie.
- [ECR-E-03] Je garde mes distances quand les choses deviennent trop intimes.
- [ECR-E-04] Se confier à l'autre me met mal à l'aise.
- [ECR-E-05] Je préfère régler mes soucis moi-même plutôt que d'en parler à l'autre.
- [ECR-E-06] Les moments de trop grande proximité me donnent envie de prendre de l'air.

## ERQ — réévaluation cognitive (Gross & John, 2003)

- [ERQ-RE-01] Pour aller mieux, je change ma façon de penser à la situation.
- [ERQ-RE-02] Je cherche un autre angle pour voir les choses autrement.
- [ERQ-RE-03] Je me remémore des expériences positives pour diminuer l'impact d'un moment négatif.
- [ERQ-RE-04] Je réinterprète ce qui m'arrive pour en réduire la charge émotionnelle.

## ERQ — suppression expressive (Gross & John, 2003)

- [ERQ-SU-01] Je garde mes émotions pour moi sans les montrer.
- [ERQ-SU-02] Quand je ressens quelque chose de fort, je m'arrange pour ne pas le laisser paraître.
- [ERQ-SU-03] Je contrôle l'expression de mes émotions sans les vivre moins fort.
- [ERQ-SU-04] Je préfère ne pas exprimer ce que je ressens sur le moment.

## Rumination (Nolen-Hoeksema — construit)

- [RUM-01] Je reviens sans cesse sur ce qui me contrarie et j'ai du mal à en sortir.
- [RUM-02] Je tourne en boucle autour de mes pensées tristes.
- [RUM-03] Je me demande longuement pourquoi je réagis si fort.
- [RUM-04] Je ressasse des situations passées que je n'arrive pas à tourner.
- [RUM-05] Quand je suis contrarié(e), je reste bloqué(e) sur cette contrariété.

## DAS — 4 dimensions uniquement (Spanier, 1976 — items protégés, jamais reproduits)

- [DAS-CON] Nous nous entendons sur les grandes décisions à prendre à deux.
- [DAS-SAT] Globalement, je suis satisfait(e) de notre relation telle qu'elle est.
- [DAS-COH] Nous faisons beaucoup d'activités ensemble, en vrai binôme.
- [DAS-EXP] Nous arrivons à exprimer nos affects l'un à l'autre sans crispation.

## CSI — satisfaction globale (Funk & Rogge, 2007)

- [CSI-01] Notre relation me convient dans l'ensemble.
- [CSI-02] Je me sens bien dans cette vie à deux.
- [CSI-03] Si je devais refaire le choix, je referais ce même choix.

## Capitalisation (Gable & Reis — typologie AC/PC/AD/PD)

- [GABLE-AC] Quand une bonne nouvelle m'arrive, l'autre la célèbre avec enthousiasme.
- [GABLE-PC] Quand une bonne nouvelle m'arrive, l'autre l'écoute distraitement et passe à autre chose.
- [GABLE-AD] Quand une bonne nouvelle m'arrive, l'autre pointe aussitôt le côté négatif.
- [GABLE-PD] Quand une bonne nouvelle m'arrive, l'autre ignore la nouvelle et change de sujet.

## Les 5 langages de l'amour (Chapman, 1992 — construits popularisés)

- [CHAP-MOTS] Se sentir aimé(e) passe surtout par des paroles valorisantes et encourageantes.
- [CHAP-TEMPS] Se sentir aimé(e) passe surtout par des moments d'attention partagés, sans distraction.
- [CHAP-SERV] Se sentir aimé(e) passe surtout par des gestes concrets qui soulagent le quotidien.
- [CHAP-CADEAUX] Se sentir aimé(e) passe surtout par des marques tangibles qui disent la pensée.
- [CHAP-TOUCH] Se sentir aimé(e) passe surtout par le contact physique et la tendresse corporelle.

---

*41 paraphrases · 7 instruments de référence · aucune reproduction verbatim d'item.
Corpus versionné par commit — toute modification est datée et motivée.*
