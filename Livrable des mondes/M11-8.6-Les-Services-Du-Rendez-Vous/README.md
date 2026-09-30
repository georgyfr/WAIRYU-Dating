# 8.6 « LES SERVICES DU RENDEZ-VOUS » — DOSSIER DE SPÉCIFICATION FONCTIONNELLE

> **Monde** : M11 — LE VOYAGE À DEUX 🆓 **GRATUIT** (codes 8.x — le monde est une métadonnée, FM-011 v2)
> fiche : README — vue d'ensemble du livrable (lire en premier)
> **Phase** : P2 · **Accès** : match (les services accompagnent la conversation vers le rendez-vous)
> **Statut de dossier** : **SPÉCIFICATION FONCTIONNELLE — 0 item** (⚠️ le compteur d'items du
> projet ne bouge pas)
> **QUATRE services post-match** : le check-in sécurité avant date · le Coach de conversation ·
> les cartes de dialogue · le feedback post-date
> **Lecture signal** : feedback post-date → **North Star + calibration** (02)
> **L'engagement manifeste** (Constitution [6] : « la rencontre n'est jamais payante ») :
> le check-in sécurité et les services de sécurité sont **GRATUITS ET PERMANENTS** — gravé au 03.

## Le principe

Le voyage a une destination : le rendez-vous réel. Les services du rendez-vous accompagnent
le passage du match à la rencontre — et le retour de la rencontre vers le moteur
(calibration). Ils sont **tous gratuits** (M11 entier est gratuit — Constitution [5]/[6]) ;
le check-in sécurité avant date porte de surcroît l'engagement manifeste : **gratuit et
permanent, inconditionnel** (03).

FONCTIONNALITÉS produit — pas des quêtes, pas d'items, pas de passation : quatre mécaniques
d'app, inscrites au monde M11, hors compteur d'items (M11 : 46 items = 36 + 6 + 3 + 1 geste
— 8.6 pèse zéro).

## 📁 Contenu du livrable (5 fichiers)

| Fichier | Livrable |
|---|---|
| `00-README.md` | Guide 1 page : **la divergence de gabarit TOTALE** (spécification fonctionnelle, 0 item), cadrage, verrous |
| `01-specification-fonctionnelle.md` | **Les QUATRE services** : a) le check-in sécurité avant date (flux complet, alerte si pas de retour) · b) le Coach de conversation (amorces, pas des scripts) · c) les cartes de dialogue (tirées du voyage, étages respectés) · d) le feedback post-date (opt-in à chaque date) |
| `02-north-star-calibration.md` | **Comment le feedback apprend au moteur** : agrégats, boucle match → conversation → rendez-vous, zéro pression de performance, RGPD |
| `03-engagement-securite.md` | **L'engagement manifeste** : la sécurité est gratuite et permanente, inconditionnelle, hors premium, hors rétention |
| `README.md` | Le présent fichier |

## Les quatre services (résumé)

| Service | Objet | Règle d'or |
|---|---|---|
| **a) Le check-in sécurité avant date** | qui part où, quand, avec qui ; rappel avant le départ ; alerte si pas de retour | GRATUIT et PERMANENT — l'alerte part au moment défini si aucun « je suis bien » ; aucune alerte automatique vers des tiers sans consentement explicite à l'activation (01 §a · 03) |
| **b) Le Coach de conversation** | propositions douces pour démarrer/relancer (s'appuie sur 8.1) | des **amorces, pas des scripts** — désactivable (01 §b) |
| **c) Les cartes de dialogue** | des amorces tirées du voyage de chacun | rien qui révèle un contenu sans le consentement de son auteur — respect des étages de révélation, désactivables (01 §c) |
| **d) Le feedback post-date** | un court retour volontaire après un rendez-vous (s'est-il bien passé ? revoir ?) | opt-in à chaque date → North Star + calibration ; anonymisé côté moteur ; aucune restitution à l'autre comme un jugement (01 §d · 02) |

## ✅ Déclaration de conformité (interdits absolus V14-B)

| Interdit absolu | Statut |
|---|---|
| Compteur d'items | ✅ 8.6 = **0 item** — note explicite au README (ici) et au 00-README |
| Sécurité payante ou conditionnée | ✅ non — l'engagement manifeste est gravé au 03 (gratuit, permanent, inconditionnel, hors premium, hors rétention) |
| Alerte automatique vers des tiers sans consentement | ✅ non — le consentement explicite à l'activation gouverne tout flux d'alerte (01 §a) |
| Pression de performance (rendez-vous « réussi ») | ✅ non — aucun compteur, aucun bilan, aucune comparaison (02) |
| Feedback rendu à l'autre comme un jugement | ✅ non — agrégats et calibration seulement (01 §d · 02) |
| Scripts de séduction / messages prêts à copier | ✅ non — des amorces, pas des scripts (01 §b) |
| Label clinique / marque / nom d'auteur | ✅ zéro (vérifié machine) |
| Absolus hors citation de l'engagement | ✅ — les seules occurrences des mots d'absolu sont les citations constitutionnelles de l'engagement manifeste (README [ici] et 03) ; vérifié machine |

## ⚠️ Points en attente de validation comité (verrou [9])

- **Les formulations de sécurité et les flux d'alerte** (textes d'alerte, délais, signal à
  l'app, suivi humain) : verrou humain [9] — propositions de production, À VALIDER PAR LE
  COMITÉ (01 §a · 03), re-signature professionnelle avant bêta (FM-019, héritée).
- **Les seuils d'agrégation** de la calibration (effectif minimal avant toute lecture) :
  À VALIDER PAR LE COMITÉ (02).
- **La rétention du feedback** (délai de vie de la donnée nominative avant agrégation) :
  À VALIDER PAR LE COMITÉ/juridique (02).
- **Le cadrage d'éligibilité du check-in** (rendez-vous pris sur l'app ou ailleurs) :
  proposition large — À VALIDER PAR LE COMITÉ (01 §a).

## 🔁 Circuit restant

Spécification (fait) → **design produit** (écrans définitifs) → **implémentation** →
**revue comité/juridique** (flux de sécurité + RGPD). Aucun commit, aucun push de la
présente session (règle [11]).
