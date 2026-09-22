# Registre des traitements — wairyu (v1)

> Registre simplifié au sens de l'article 30 du RGPD. Établi à l'Étape 0 (23
> septembre 2026), mis à jour à chaque nouvelle finalité. Responsable : l'Éditeur
> du Service.

## Traitement n°1 — Gestion des comptes utilisateurs

| Rubrique | Détail |
|----------|--------|
| Finalité | Créer, vérifier et gérer les comptes ; authentifier les utilisateurs |
| Catégories de personnes | Utilisateurs inscrits (18 ans et +) |
| Données traitées | Email (vérifié par OTP), pseudonyme, année de naissance, genre, orientation (optionnel), ville approximative, intention, bio, prompts, préférences de découverte, statut de compte |
| Base légale | Contrat (CGU) |
| Destinataires internes | Équipe technique (via accès administré à D1) |
| Sous-traitants | Cloudflare (D1, Workers — UE/monde), fournisseur email (Brevo/Resend) |
| Transfert hors UE | Clauses contractuelles types des hébergeurs |
| Durée de conservation | Vie du compte ; purge immédiate à la suppression (anti-retour haché 12 mois) |
| Sécurité | Sessions signées httpOnly, OTP TTL 10 min, rate limiting, Turnstile |
| Droits des personnes | Accès, rectification, effacement (bouton dédié), portabilité |

## Traitement n°2 — Photos et médias personnels

| Rubrique | Détail |
|----------|--------|
| Finalité | Héberger les photos de profil et notes vocales ; les délivrer **uniquement** selon les consentements (visibilité Classique / révélation mutuelle 15 messages + 7 jours + accord des deux) |
| Données traitées | Photos (1-6, compressées WebP côté client), notes vocales, public_ids et métadonnées techniques |
| Base légale | **Consentement** (visibilité et révélation distincts, révocables) |
| Destinataires | Autres membres du Service, uniquement selon les consentements |
| Sous-traitants | Cloudinary (stockage privé « authenticated », URLs signées serveur) |
| Transfert hors UE | Selon région du compte Cloudinary ; clauses types |
| Durée | Suppression à la demande ou à la suppression du compte (sauvegarde transitoire 30 j max) |
| Sécurité | Assets privés (404 sans signature), signatures serveur uniquement, contrôle d'autorisation par requête, public_ids non énumérables |
| Droits | Effacement immédiat, retrait de consentement, opposition |

## Traitement n°3 — Matching et questionnaire

| Rubrique | Détail |
|----------|--------|
| Finalité | Calculer des scores de compatibilité explicables ; ordonner les suggestions de profils |
| Données | Réponses questionnaire N1/N2, écarts de réponses, scores normalisés, historique de découverte (likes/passes pour éviter les doublons) |
| Base légale | Contrat + intérêt légitime (qualité du service) |
| Décision automatisée | **Non** : le score ordonne des suggestions et fournit toujours ses raisons ; aucune exclusion automatique d'une personne |
| Sous-traitants | Aucun (calcul dans le Worker, données en D1) |
| Durée | Vie du compte ; exportables (portabilité) |
| Droits | Accès, rectification des réponses, effacement |

## Traitement n°4 — Messagerie et révélation

| Rubrique | Détail |
|----------|--------|
| Finalité | Messagerie temps réel, voice notes, compteur 15 messages + 7 jours, enregistrement des accords de révélation |
| Données | Contenu des messages, notes vocales, horodatages, accords de révélation (qui/quand) |
| Base légale | Contrat + consentement (révélation) |
| Sous-traitants | Cloudflare Durable Objects (messages en transit + persistance), Cloudinary (audio) |
| Modération | Sur signalement ou motifs interdits détectés (cf. CGU Article 4) — accès humain documenté et tracé |
| Durée | 12 mois après fin de conversation |
| Droits | Effacement, limitation |

## Traitement n°5 — Sécurité et modération

| Rubrique | Détail |
|----------|--------|
| Finalité | Prévenir l'abus (spam, robots, multi-comptes), traiter les signalements, appliquer des sanctions |
| Données | Adresse IP hachée (anti-abus), empreinte Turnstile, compteurs de débit, signalements (auteur, cible, motif, description), décisions de modération |
| Base légale | Intérêt légitime (sécurité) + obligation légale (contenus illicites) |
| Sous-traitants | Cloudflare (Turnstile, KV) |
| Durée | Journaux 12 mois ; signalements 24 mois |
| Droits | Accès (sur demande, sous réserve de la protection des tiers), opposition |

## Traitement n°6 — Statistiques produit agrégées

| Rubrique | Détail |
|----------|--------|
| Finalité | Suivre les KPI (rétention J7, complétion N1, taux de révélation) pour améliorer le produit |
| Données | Compteurs agrégés journaliers **anonymes** (aucun identifiant individuel persistant) |
| Base légale | Intérêt légitime |
| Sous-traitants | Aucun (table D1 `metrics_daily`, agrégation à la volée) |
| Durée | 24 mois |
| Droits | Non applicable (données anonymes) |
