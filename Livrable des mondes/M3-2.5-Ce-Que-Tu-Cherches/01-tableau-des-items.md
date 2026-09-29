# LIVRABLE 1 — LES 3 ITEMS BINAIRES + LA 4ᵉ RÉPONSE DE LA QUÊTE 2.5 « CE QUE TU CHERCHES »

> **Format : BINAIRE (NON-Likert) + 4ᵉ réponse globale.** 3 énoncés assumés, réponse oui / non,
> ≤ 8 mots, tutoiement, présent — plus une **4ᵉ réponse « Je découvre »** (décision comité, voir
> bloc dédié ci-dessous). Pas d'échelle, pas d'orientation D/I (`dimension = null`, `signal = null`).
> Source : « relation exclusive, découverte, non-exclusivité assumée » (TEST ET OUTILS l.207).
> Légende de la fiche condensée — `C:` carte · `S:` signal · `F:` fiabilité · `M:` modulation · `A:` ancrage.

| Code (gelé) | Énoncé | Format | Options | Croisement moteur | Fiche de computation — 5 canaux |
|---|---|---|---|---|---|
| Q2.5-01 | Tu cherches une relation exclusive. | binaire | Oui / Non | agrégat d'intention (avec 02, 03) × intention réelle 6.1 (à venir) | C: intention affichée (restituable) · S: dealbreaker binaire — moteur seul · F: « Oui » × « Oui » à Q2.5-03 → contradiction directe → QFI · M: réponse modifiée → intention recalculée ⚠ · A: rappel OK |
| Q2.5-02 | Tu cherches une rencontre, sans plan précis. | binaire | Oui / Non | agrégat d'intention (avec 01, 03) | C: intention affichée (restituable) · S: dealbreaker binaire — moteur seul · F: cohérence avec Q2.4-08 (tempo) · M: idem 01 · A: rappel OK |
| Q2.5-03 | L'exclusivité n'est pas ce que tu vises aujourd'hui. | binaire | Oui / Non | agrégat d'intention × Q2.3-08 des autres (bidirectionnel) | C: intention affichée (restituable) · S: dealbreaker binaire — moteur seul · F: « Oui » × « Oui » à Q2.5-01 → contradiction directe → QFI · M: idem 01 · A: rappel OK |

## La 4ᵉ réponse — « Je découvre » (décision comité, appliquée — FM-019)

La quête comporte une **4ᵉ réponse globale** : **« Je découvre »**. Elle exprime un état en cours :
la personne explore ce qu'elle cherche, sans le poser aujourd'hui. Décision comité tranchée
(décisions produit c) — le libellé « Je découvre » est exact et gelé.

| Propriété | Règle |
|---|---|
| **Compatibilité** | **Compatible avec tout** : aucun dealbreaker binaire, aucun drapeau QFI, aucun croisement dur — cette réponse ne bloque jamais un appariement et ne se combine avec aucune exclusion |
| **Moteur** | Intention affichée = « en exploration » — état déclaré au même titre que les autres (SIG-2.5-01), restituable en toutes lettres |
| **Interaction avec les 3 binaires** | Répondre « Je découvre » après les binaires : les réponses existantes restent modifiables, l'état d'exploration ne les efface pas et ne les juge pas |
| **Rendu** | Rappel en toutes lettres (« quand tu as répondu que tu découvres ce que tu cherches ») — aucun code, aucun sigle |
| **Carte** | Aucune variante de carte dédiée en v1 : un état d'exploration n'est pas un cap à exposer — le miroir (S1) le rappelle en toutes lettres |

## Les combinaisons (agrégat d'intention — mécanisme documenté)

| Q2.5-01 | Q2.5-02 | Q2.5-03 | Intention affichée |
|---|---|---|---|
| Oui | Oui / Non | Non | **Exclusivité posée** — la relation exclusive est le cap déclaré |
| Non | Oui | Non | **Découverte** — une rencontre, sans plan précis |
| Non / Oui | Oui / Non | Oui | **Non-exclusivité assumée** — l'exclusivité n'est pas le cap du jour |
| Oui | Oui / Non | Oui | **Contradiction logique directe** → drapeau QFI, miroir dégradé (SIG-2.5-02) |
| Non | Non | Non | **Aucune intention lisible** → **message doux** + la 4ᵉ réponse « Je découvre » proposée (voir ci-dessous) |
| — (4ᵉ réponse choisie) | — | — | **En exploration** — état déclaré « Je découvre », compatible avec tout (aucun dealbreaker, aucun drapeau) |

## Incomplétude assumée (documentée — le source le sait)

Trois items binaires ne couvrent pas toutes les intentions : la combinaison « Non / Non / Non » ne dit
rien de lisible, les intentions mixtes ou en cours de clarification ne tiennent pas dans un oui/non, et
rien ici ne mesure l'intention RÉELLE (comportementale). Le source l'assume explicitement : la
complétude vient du croisement avec **6.1 — l'intention réelle, mesurée plus tard, invisible** (M8,
opt-in). En conséquence :

- aucun texte produit ne prétend lire « toute » l'intention de la personne ;
- l'état « Non / Non / Non » est accueilli par un **message doux** (décision comité) : aucune
  relance, aucune insinuation de défaut — et la 4ᵉ réponse « Je découvre » lui offre une issue
  déclarée. Le miroir reste descriptif et le matching n'applique aucun dealbreaker binaire ;
  libellé du message — provisoire concepteur, proposition : « C'est bon de prendre le temps : tu
  peux revenir quand tu veux, ou choisir “Je découvre”. »
- la détection de tromperie (SIG-2.5-03) reste inactive tant que 6.1 n'est pas matérialisée.

## Décision de composition documentée (domaine réservé [9] — proposition)

Q2.5-03 est formulé comme un constat inversé (« L'exclusivité n'est pas ce que tu vises aujourd'hui »)
plutôt que « Tu cherches une relation non exclusive » : la formulation du cadrage place la personne en
position de constat, sans condition « tu cherches » qui forcerait une demande. La limite temporelle
(« aujourd'hui ») est conservée verbatim — l'intention est datée, pas figée.

## Contrôles mécaniques passés

| Contrôle | Résultat |
|---|---|
| ≤ 8 mots / énoncé (max constaté : 8, token par espaces) | ✅ |
| Tutoiement, 2e personne, présent | ✅ |
| Énoncés assumés : aucune porte de sortie (« ça dépend », « peut-être ») | ✅ |
| Zéro « toujours » / « jamais » en absolu dans les énoncés | ✅ |
| Neutralité : aucune intention formulée comme « meilleure » | ✅ |
| 4ᵉ réponse « Je découvre » compatible avec tout : aucun dealbreaker, aucun drapeau QFI, aucune relance | ✅ |
| Aucune orientation D/I, aucune dimension, aucun sigle au rendu (non-Likert déclaré) | ✅ |
