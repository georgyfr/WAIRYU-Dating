# 00 — GUIDE 1 PAGE : LA DIVERGENCE DE GABARIT TOTALE

> element : 8.6 « Les services du rendez-vous » · fiche : 00 — guide de cadrage (lire avant tout fichier du dossier)
> Source de vérité : Constitution v2.1 [5] (M11 — 6 quêtes · 46 items ; 8.6 = fonctionnalités,
> hors compteur) · [6] (la rencontre gratuite — M11, matching de base, conversation,
> sécurité : gratuits, engagés dans le manifeste) · [9] (verrous comité — formulations de sécurité) ·
> refonte gelée PARTIE 8 l. 2037 (« 8.6 · Les services du rendez-vous (check-in sécurité,
> Coach, cartes de dialogue, feedback post-date) · Fonctionnalités · — · Feedback post-date →
> North Star + calibration · P2 · Match ») + l. 1847 (« fonctionnalités de la spec, hors
> du voyage ») · mission V14.B.6 (Task 27-c).
> B.3 : **production neuve déclarée** — 1ʳᵉ génération V14-B (aucune génération antérieure).

## Restitution [10] (5 lignes)

- **Élément** : 8.6 « Les services du rendez-vous » — QUATRE fonctionnalités post-match : le
  check-in sécurité avant date · le Coach de conversation · les cartes de dialogue · le
  feedback post-date.
- **Monde** : M11 — LE VOYAGE À DEUX (la destination du voyage, débloquée au premier match).
- **Statut freemium** : 🆓 **gratuit** — les quatre services sont gratuits (Constitution
  [5]/[6]) ; le check-in sécurité porte l'engagement manifeste : **gratuit et permanent,
  inconditionnel** (03).
- **Contraintes principales** : **0 item** (le compteur d'items du projet ne bouge pas) ·
  sécurité = verrou humain [9] (formulations et flux : propositions, comité) · amorces, pas
  des scripts · consentement des étages dans les cartes · feedback = agrégats et calibration,
  aucune restitution à l'autre comme un jugement.
- **Ambiguïtés détectées** : ① le refonte écrit que les services sont des fonctionnalités de
  la spec, HORS DU VOYAGE — lecture retenue : les services EXISTENT dans l'app, ils n'entrent pas
  dans la série des quêtes (zéro écran de quête, zéro item, zéro récompense de quête) ;
  ② « signal à l'app » (alerte sans contact désigné) : le contenu exact du canal et le suivi
  humain restent à cadrer (comité, 01 §a) ; ③ l'éligibilité du check-in (rendez-vous pris
  sur l'app ou ailleurs) : proposition large, comité.

## ⚠️ NOTE 0 ITEM (grave ici et au README)

> **8.6 = 0 item — le compteur d'items du projet ne bouge pas.**
> Les quatre services entrent au contrat d'inventaire comme FONCTIONNALITÉS (lectures
> carte/signal vides, phase P2), pas comme quête d'items. M11 reste à 46 items
> (36 + 6 + 3 + 1 geste).

## La divergence de gabarit TOTALE (spécification fonctionnelle)

| Pièce du gabarit standard | Statut pour 8.6 | Fondement |
|---|---|---|
| Tableau d'items (01) | **SANS-OBJET** → remplacé par `01-specification-fonctionnelle.md` (quatre services) | des fonctionnalités n'ont pas d'énoncés : elles ont des flux, des interrupteurs et des garde-fous |
| Mélange + graine (02) | **SANS-OBJET** — rien à mélanger, aucune graine (0 item, aucune passation) | aucune série d'énoncés n'existe |
| Miroir de quête (07) | **SANS-OBJET** — aucun rendu analytique | le feedback se rend en agrégats et calibration (02) — pas en portrait d'une personne |
| Slots de miroir (04) | **SANS-OBJET** | aucun texte de quête n'existe à substituer |
| Cartes de variante | **SANS-OBJET** — les « cartes de dialogue » (service c) ne sont pas des cartes de restitution : ce sont des amorces de conversation, gouvernées par le consentement des étages | homonymie assumée et désamorcée au 01 §c |
| Yaml de computation (06) | **SANS-OBJET** — aucun item à compute | la spéc tient lieu de fiche (entrée CI `type: fonctionnalite` — proposition, comité) |
| Écran d'intro (05) | **SANS-OBJET comme fichier** — les écrans vivent dans la spéc (placeholders descriptifs) | chaque service a ses propres écrans (01) |

## Cadrage des quatre services

| Service | Nature | Frontière |
|---|---|---|
| a) Check-in sécurité avant date | un service de sécurité — l'engagement manifeste (03) | gratuit, permanent, inconditionnel ; aucune alerte automatique vers des tiers sans consentement explicite à l'activation |
| b) Coach de conversation | une aide à la parole | des amorces, pas des scripts ; s'appuie sur 8.1 ; désactivable |
| c) Cartes de dialogue | une aide à la rencontre des sujets | tirées du voyage EXPOSÉ des deux ; rien qui révèle un contenu sans le consentement de son auteur ; désactivables |
| d) Feedback post-date | un capteur de réalité pour le moteur | opt-in à chaque date ; anonymisé côté moteur ; agrégats et calibration (02) ; aucune restitution à l'autre comme un jugement |

## 🔒 VERROUS

- **Les formulations de sécurité = verrou humain [9]** : tout texte d'alerte, tout flux
  d'urgence, tout libellé du check-in est une PROPOSITION — À VALIDER PAR LE COMITÉ
  (re-signature professionnelle avant bêta, FM-019, héritée).
- **L'engagement manifeste est gravé** : la sécurité est gratuite et permanente — hors
  paiement, hors score, hors complétion, hors rétention (03).
- **Les services ne sont pas des quêtes** : hors série, hors compteur, hors récompense de
  quête (refonte l. 1847) — **8.6 = 0 item**.
- **Le rendez-vous raté n'est pas une perte affichée** : zéro pression de performance (02).

## 📖 Lecture des fichiers (ordre conseillé)

1. `01-specification-fonctionnelle.md` — les quatre services (flux, interrupteurs, garde-fous).
2. `02-north-star-calibration.md` — comment le feedback apprend au moteur.
3. `03-engagement-securite.md` — l'engagement manifeste (gratuit et permanent).
