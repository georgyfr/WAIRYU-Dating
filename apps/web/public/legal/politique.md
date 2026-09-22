# Politique de confidentialité — wairyu (v1)

> Version 1 — 23 septembre 2026. Document de travail pour la beta fermée ; relecture
> professionnelle avant lancement public. Conforme au RGPD (UE 2016/679) dans sa
> structure et ses engagements. Responsable de traitement : l'Éditeur du Service
> (contact via le formulaire « Aide & contact »).

---

## 1. Données que nous traitons

| Catégorie | Données | Source |
|-----------|---------|--------|
| **Compte** | Adresse email, date de création, statut de vérification | Vous (inscription) |
| **Profil** | Pseudonyme, année de naissance, genre, orientation, ville/géolocalisation approximative, intention, bio, 3 prompts, préférences de découverte | Vous |
| **Photos** | 1 à 6 photos de profil, compressées côté appareil avant envoi | Vous |
| **Questionnaire** | Réponses aux questionnaires Niveau 1 et Niveau 2, scores et écarts calculés | Vous + calcul automatique |
| **Interactions** | Likes, passes, matches, messages, notes vocales, demandes/raccords de révélation | Vous |
| **Sécurité** | Journaux techniques (horodatage, adresse IP hachée à des fins anti-abus), empreintes anti-robot Turnstile, compteurs de taux de requête | Automatique |
| **Modération** | Signalements (motif, description), mesures prises | Vous + modération |

Nous ne traitons **pas** : numéro de téléphone, données de paiement (service
gratuit), données de localisation GPS précise (ville approximative ou département),
données de santé, ni données sensibles au sens de l'article 9 du RGPD. L'option
« orientation » est volontaire, librement choisie et jamais obligatoire.

## 2. Finalités et bases légales

| Finalité | Base légale |
|----------|-------------|
| Créer et gérer votre compte, vérifier votre email | Contrat (CGU) |
| Vous présenter des profils compatibles (score de matching explicable) | Contrat + intérêt légitime (amélioration du service) |
| Afficher vos photos selon vos consentements (mode Classique / révélation mutuelle) | **Consentement** (retrait possible à tout moment) |
| Messagerie, voice notes, révélation après 15 messages + 7 jours | Contrat + consentement |
| Sécurité, anti-spam, anti-robot, modération | Intérêt légitime + obligation légale |
| Statistiques agrégées et anonymisées d'usage (KPI produit) | Intérêt légitime |
| Information sur l'évolution du Service | Consentement (désinscription en un clic) |

Aucune décision automatisée produisant un effet juridique ou significatif n'est
prise : le score de matching **explique toujours** ses raisons (« Pourquoi ce
match ? ») et ne vous exclut d'aucune possibilité fondamentale — il ordonne
simplement des suggestions de profils.

## 3. Consentements spécifiques (le cœur de wairyu)

1. **Consentement de visibilité** : vous choisissez si vos photos sont visibles
   immédiatement (mode Classique) ou masquées jusqu'à révélation mutuelle (mode
   Invisible). Ce choix est modifiable et chaque changement est journalisé.
2. **Consentement de révélation** : vos photos nettes ne sont délivrées à un
   autre membre que si les trois conditions sont réunies : 15 messages échangés,
   7 jours de conversation, accord explicite des deux parties. Chaque accord est
   enregistré avec horodatage.
3. **Retrait** : le retrait du consentement de révélation est possible à tout
   moment ; il empêche toute nouvelle délivrance (les liens déjà délivrés cessent
   d'être re-issus et l'asset peut être ré-émis sous forme masquée).

## 4. Durées de conservation

| Donnée | Durée |
|--------|-------|
| Compte actif | Toute la durée du compte |
| Compte supprimé | Purge immédiate des données identifiables ; identifiant haché d'anti-retour pendant 12 mois |
| Photos et voice notes | Effacées du stockage à la suppression du compte ou du contenu (30 jours maximum pour les sauvegardes techniques transitoires) |
| Messages | 12 mois après la fin de la conversation, puis purgés |
| Journaux de sécurité | 12 mois maximum |
| Signalements | 24 mois (nécessaire en cas de récidive ou de réquisition) |

## 5. Sous-traitants et transferts

Le Service repose sur des fournisseurs gratuits qui agissent en qualité de
sous-traitants :

| Fournisseur | Rôle | Hébergement |
|-------------|------|-------------|
| Cloudflare (Workers, D1, KV, Durable Objects, Turnstile) | Application, base de données, protection anti-abus | Monde (UE inclus), Cloudflare Europe |
| Cloudinary | Stockage et livraison privée des photos/audios | UE (centre par défaut selon configuration du compte) |
| Fournisseur d'email (Brevo ou Resend, à partir de l'Étape 2) | Envoi des codes de vérification | UE |

Aucun transfert hors UE autre que ceux intégrés à ces infrastructures (qui
bénéficient de clauses contractuelles types) n'est effectué. Aucune donnée n'est
vendue, louée ou échangée. **Aucune publicité.**

## 6. Vos droits

Vous disposez des droits d'**accès**, de **rectification**, d'**effacement**, de
**portabilité**, de **limitation** et d'**opposition**, ainsi que du droit de
retrayer votre consentement à tout moment et de saisir la **CNIL**
(cnil.fr) en cas de désaccord.

- **Droit à l'oubli** : bouton « Supprimer mon compte » dans les réglages — effet
  immédiat sur les contenus (cf. durées §4), sans justification requise.
- **Portabilité** : export de vos données (profil, réponses au questionnaire,
  liste de matches) au format JSON lisible, généré à la demande.
- **Exercice** : via le formulaire « Aide & contact » ; réponse sous 30 jours
  maximum.

## 7. Sécurité

Mesures mises en œuvre : sessions par cookies `httpOnly` signés (HMAC) et
révocables ; contrôle d'accès serveur sur chaque média (photos jamais publiques,
URLs signées délivrées uniquement après vérification des consentements) ;
protection anti-robot (Turnstile) ; limitation de débit anti-spam ; chiffrement
en transit (HTTPS) ; minimisation stricte (pas de GPS précis, pas de numéro) ;
purge automatique des sessions expirées. En cas de violation de données
susceptible d'engendrer un risque élevé, notification à la CNIL dans les 72 heures
et information des personnes concernées.

## 8. Mineurs

Le Service est interdit aux moins de 18 ans (CGU Article 2.1). Si un compte de
mineur est identifié, il est supprimé et ses données effacées.

## 9. Modifications

Toute modification substantielle de la présente politique vous sera notifiée
in-app au moins 15 jours avant son entrée en vigueur, avec possibilité de refuser
et supprimer votre compte.
