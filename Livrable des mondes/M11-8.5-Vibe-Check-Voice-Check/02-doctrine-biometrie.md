# LIVRABLE 2 — DOCTRINE BIOMÉTRIE : ZÉRO ANALYSE DE LA VOIX COMME TRAIT

> element : 8.5 « Vibe Check / Voice Check » · fiche : 02 — doctrine absolue (NORMATIVE)
> Fondement : Constitution v2.1 [2] — FRONTIÈRES SCIENTIFIQUES : « pas d'analyse de voix comme
> trait… Ces exclusions sont des refus de doctrine, pas des contraintes techniques. »
> Esprit [11-b] étendu : **l'audio brut n'est pas un input moteur** — ce qui s'écoute ne se
> calcule pas.

## La doctrine absolue

> **LA VOIX EST ÉCOUTÉE PAR L'AUTRE. LE MOTEUR NE LA SCANNE PAS.**
> La voix est un canal d'humain à humain : un orateur qui parle, un écouteur qui accepte
> d'écouter. Elle n'est pas une donnée à interpréter, un matériau à mesurer, une signature à
> comparer. Entre la voix et le moteur, il n'y a rien : pas d'extraction, pas de
> représentation, pas de dérivation. L'audio brut n'est pas un input moteur — extension de
> l'esprit [11-b] : comme les énoncés de trame vivent hors des dépôts, l'audio vit hors du
> moteur ; il n'entre dans aucun calcul, à aucun titre, sous aucune forme.

## La liste interdite (NORMATIVE — liste fermée)

> ⚠ Cette liste est **normative** : la spécification (01) n'implémente aucun scan. Chaque
> ligne est un interdit de doctrine, pas une limite technique. Ouvrir la liste = changer la
> doctrine (Constitution [2]) = Fiche de Mutation + verdict comité — rien de moins.

| # | Interdit | Ce que ça désigne |
|---|---|---|
| 1 | **Spectrogramme** | toute représentation fréquentielle calculée sur l'audio, à toute fin |
| 2 | **Empreinte vocale** (voiceprint) | toute signature identitaire dérivée de la voix (comparaison, identification, ré-identification) |
| 3 | **Embedding audio** | tout vecteur de représentation (projection, latence, features) calculé sur l'audio |
| 4 | **Détection d'émotion par la voix** | toute inférence d'état (émotion, humeur, stress, excitation, sincérité) |
| 5 | **Estimation d'âge par la voix** | toute inférence d'âge apparent ou d'âge réel |
| 6 | **Estimation de genre par la voix** | toute inférence de genre ou de sexo-représentation |
| 7 | **Estimation de santé par la voix** | toute inférence de santé, de fatigue ou d'état physiologique |
| 8 | **Toute dérivation de trait** | tout autre artefact calculé qui décrirait la personne — la liste se ferme sur le principe, pas sur les techniques |

**Conséquence commune aux huit lignes :** la voix ne nourrit **aucun score, aucun signal,
aucun profil** — aucune case du registre des signaux, aucune colonne du ledger, aucune
entrée du dictionnaire du moteur, aucune pondération de matching, aucune étiquette rendue.

## Les corollaires fermés

1. **Zéro transcription automatique** — la voix ne devient pas du texte exploitable par le
   moteur ; l'écoute est humaine (la spéc 01 §5 porte la règle).
2. **Zéro sous-titrage moteur** — aucune transformation du contenu de la voix n'existe.
3. **Zéro comparaison de voix** — aucune fonction « cette voix ressemble à », aucune
   similarité audio, aucune recherche par la voix.
4. **Zéro indexation** — l'audio n'entre dans aucun index, aucun cache analysable, aucun
   stockage dérivé.
5. **Zéro artefact calculé** — aucun produit du calcul sur l'audio ne survit à l'écoute ;
   en fait, aucun calcul de contenu n'a lieu : le transport et le décodage techniques
   (codec, streaming, correction de perte) sont du **pipe** — ils rendent l'écoute possible,
   ils ne produisent aucune donnée.
6. **Zéro métadonnée descriptive** — le moteur ne touche que des métadonnées de **cycle de
   vie** pures (existence, expiration, état de retrait : partagée / retirée / purgée) ; elles
   gèrent le consentement, elles ne décrivent pas la personne. La durée (30 s max) est une
   borne d'interface, pas une donnée d'analyse.

## Ce que le moteur touche (et rien d'autre)

| Touche | Ne touche pas |
|---|---|
| l'existence de la voix (partagée / retirée / purgée) | le contenu de la voix |
| l'horodatage de cycle de vie (création, expiration, purge) | toute mesure du contenu (durée réelle, volume, spectre : rien) |
| l'état du consentement (offre posée, écoute acceptée, fermeture) | toute inférence sur l'orateur ou l'écouteur |

## La gravure

- Cette frontière est gravée comme une **frontière biométrique interdite** — au même titre
  que la biométrie, la compatibilité génétique et le Rorschach digital (Constitution [2]).
- Le respect du corps vaut pour la voix : la voix EST le corps qui parle — la mesurer serait
  un prélèvement déguisé (esprit des 7 règles éthiques du bloc intime : la règle « pas de
  label » se transpose — la voix n'est pas une donnée à interpréter).
- **Zéro dérogation possible** : une « amélioration de qualité », un « filtre de bruit côté
  serveur », une « compression analysée », une « vérification d'authenticité » qui calculerait
  une représentation : toute fonction qui touche au contenu de l'audio au-delà du transport
  touche la frontière → Fiche de Mutation + verdict comité, avant tout code.
- La garde machine du projet (aiguilles interdits) contrôle le vocabulaire de cette doctrine
  dans les fichiers versionnés ; l'implémentation est contrôlée par la revue comité/juridique
  (03) — la doctrine ne se délègue pas.
