# Guide fondateur — Activation des 3 clés (Brevo · Google · Facebook)

> Dernière mise à jour : 2026-09-23. Temps total : ~35 min. Coût : 0 €, aucune carte bancaire.
>
> Tout le code est déjà livré et déployé (Étapes 2 et 2-bis). Les boutons
> « Continuer avec Google / Facebook » s'activeront automatiquement dès la pose
> des secrets — aucun redéploiement n'est nécessaire.

## Les 6 valeurs à collecter

| # | Fournisseur | Valeur | À quoi elle sert |
|---|---|---|---|
| 1 | Brevo | `BREVO_API_KEY` (commence par `xkeysib-`) | Envoyer les emails de code à 6 chiffres |
| 2 | Brevo | `EMAIL_FROM` (adresse expéditrice validée) | Adresse d'expédition des emails |
| 3 | Google | `GOOGLE_CLIENT_ID` (finit par `.apps.googleusercontent.com`) | Bouton « Continuer avec Google » |
| 4 | Google | `GOOGLE_CLIENT_SECRET` (commence par `GOCSPX-`) | Idem (échange sécurisé côté serveur) |
| 5 | Meta | `FACEBOOK_APP_ID` (~15 chiffres) | Bouton « Continuer avec Facebook » |
| 6 | Meta | `FACEBOOK_APP_SECRET` (32 caractères) | Idem (échange sécurisé côté serveur) |

URLs officielles du projet (ne JAMAIS taper à la main — copier-coller) :

- Production : `https://wairyu.wairyu.workers.dev`
- Staging : `https://wairyu-staging.wairyu.workers.dev`
- Callback Google : `https://wairyu.wairyu.workers.dev/api/auth/google/callback`
- Callback Facebook : `https://wairyu.wairyu.workers.dev/api/auth/facebook/callback`
- Suppression des données (Meta) : `https://wairyu.wairyu.workers.dev/api/auth/facebook/data-deletion`
- Politique de confidentialité : `https://wairyu.wairyu.workers.dev/legal/politique.md`

---

## BLOC A — Brevo : emails OTP (~10 min)

**Objectif : obtenir la clé API + valider l'adresse expéditrice.**

1. Ouvrir https://app.brevo.com/account/register — plan gratuit (300 emails/jour, sans carte bancaire).
2. Inscription : email `wairyu26@gmail.com` + mot de passe fort.
3. Informations société (obligatoires chez Brevo) : organisation `Wairyu`,
   site web `https://wairyu.wairyu.workers.dev`, adresse postale, téléphone.
4. Confirmer l'adresse email du compte Brevo (lien reçu sur Gmail).
5. Questionnaire d'onboarding : choisir « emails transactionnels » (codes de
   vérification) ; le reste peut être ignoré.
6. **Valider l'expéditeur** (crucial — sans ça, aucun email ne part) :
   - Avatar en haut à droite → « Senders, Domains & Dedicated IPs »
     (ou ⚙ Paramètres → Senders & IP) → onglet Senders → « Add a sender » ;
   - Nom : `wairyu` — Email : `wairyu26@gmail.com` → Enregistrer ;
   - Brevo envoie un email de validation → cliquer « Valider l'expéditeur ».
   - Une adresse Gmail est OK pour démarrer (pas de domaine disponible sans
     budget). Prévenir les premiers testeurs de vérifier leurs spams. Un vrai
     domaine (`noreply@wairyu.app`, ~8 €/an) améliorera la délivrabilité plus tard.
7. **Créer la clé API** : avatar → « SMTP & API » → onglet « API Keys » →
   « Generate your new API key » → nom `wairyu-prod` → Generate.
   ⚠️ La clé (`xkeysib-...`) n'est affichée qu'une seule fois : la copier
   immédiatement dans un brouillon privé.

## BLOC B — Google : bouton « Continuer avec Google » (~10 min)

1. Ouvrir https://console.cloud.google.com (compte Google du fondateur).
2. Sélecteur de projet (barre du haut) → « Nouveau projet » → nom `wairyu`
   → Créer → sélectionner le projet.
3. Menu ☰ → « API et services » → « Écran de consentement OAuth »
   (nouvelle UI : « Google Auth Platform ») :
   - Type d'utilisateur : **Externe** → Créer ;
   - Nom de l'application : `wairyu` ; email d'assistance et de contact : le tien ;
   - Page d'accueil : `https://wairyu.wairyu.workers.dev` ;
   - **Domaines autorisés** : si Google refuse `wairyu.workers.dev` (domaine
     appartenant à Cloudflare), laisser le champ VIDE — non bloquant ;
   - **Utilisateurs testeurs** : ajouter le fondateur + les bêta-testeurs.
     ⚠️ En mode « Test », seuls ces comptes peuvent se connecter via Google.
     Ouvrir à tous plus tard : « Publier l'application » (gratuit — les
     permissions email + profil sont standards, pas d'audit Google).
4. « API et services » → « Identifiants » → « + Créer des identifiants » →
   « ID client OAuth » → type « **Application Web** » :
   - Nom : `wairyu-web` ;
   - Origines JavaScript autorisées :
     `https://wairyu.wairyu.workers.dev` et `https://wairyu-staging.wairyu.workers.dev` ;
   - URI de redirection autorisées (copier-coller exactement) :
     `https://wairyu.wairyu.workers.dev/api/auth/google/callback` et
     `https://wairyu-staging.wairyu.workers.dev/api/auth/google/callback` ;
   - Créer → copier l'**ID client** ET le **secret client** (fenêtre popup).

## BLOC C — Meta : bouton « Continuer avec Facebook » (~15 min)

**Prérequis** : compte Facebook « sérieux » (ancien de préférence) + numéro de
portable pour la vérification développeur.

1. Ouvrir https://developers.facebook.com → connexion Facebook ; accepter les
   conditions développeur ; vérifier le portable si demandé.
2. « Mes applications » → « Créer une application » : cas d'usage «
   **Authentification et création de compte** » (ou type « Consommateur »),
   nom `wairyu`, email de contact → Créer (re-saisie du mot de passe Facebook).
3. Ajouter le produit « **Facebook Login** » → « Configurer ».
4. Paramètres Facebook Login → « **URI de redirection OAuth valides** » :
   `https://wairyu.wairyu.workers.dev/api/auth/facebook/callback` et
   `https://wairyu-staging.wairyu.workers.dev/api/auth/facebook/callback` → Enregistrer.
5. Paramètres → Général (Basic) :
   - **App ID** : visible en clair — le copier ;
   - **App Secret** : « Afficher » → mot de passe Facebook → copier ;
   - Domaine de l'app : `wairyu.workers.dev` ;
   - **URL de la politique de confidentialité** :
     `https://wairyu.wairyu.workers.dev/legal/politique.md` (déjà en ligne) ;
   - **Catégorie** : conseillé « Lifestyle » pour démarrer (Meta applique des
     règles renforcées aux apps de rencontre ; la conformité complète se fera
     à l'échelle — la catégorie se modifie en 1 clic) ;
   - **Suppression des données** (« Data deletion request URL ») — choisir le
     mode **callback** si Meta propose le choix :
     `https://wairyu.wairyu.workers.dev/api/auth/facebook/data-deletion`
     (callback RGPD déjà implémenté, il répondra dès que les secrets sont posés) ;
   - Enregistrer les modifications.
6. **Qui peut se connecter** : en mode « Développement », seuls les rôles de
   l'app (admin + testeurs ajoutés dans Rôles → Rôles) peuvent se connecter.
   Pour ouvrir au public : basculer l'app en « **En direct** » (Live) — pour
   `public_profile` + `email` (permissions standard), pas d'audit de contenu.

## BLOC D — Branchement des 6 valeurs

**Option A (recommandée)** : communiquer les 6 valeurs à l'assistant dans le
chat → pose des secrets en production + staging (`wrangler secret put`),
vérification `/api/auth/config` (`googleEnabled`/`facebookEnabled` → true),
tests de bout en bout des 3 parcours, mise à jour docs + commit GitHub.

**Option B (PC avec Node.js)** — dans `apps/api` :

```bash
export CLOUDFLARE_API_TOKEN=<token cfut_...>   # Windows : set CLOUDFLARE_API_TOKEN=...
npx wrangler secret put BREVO_API_KEY           # production
npx wrangler secret put EMAIL_FROM
npx wrangler secret put GOOGLE_CLIENT_ID
npx wrangler secret put GOOGLE_CLIENT_SECRET
npx wrangler secret put FACEBOOK_APP_ID
npx wrangler secret put FACEBOOK_APP_SECRET
# puis répéter les 6 commandes avec --env staging
```

## Tests finaux (après branchement)

1. **Email OTP** : https://wairyu.wairyu.workers.dev → inscription avec une
   vraie adresse → code reçu en < 1 min (vérifier les spams).
2. **Google** : « Continuer avec Google » → choix du compte → retour connecté.
3. **Facebook** : « Continuer avec Facebook » (compte admin de l'app) →
   retour connecté. Erreur « URL bloquée » = URI de redirection mal copiée.
4. **Gate 2** : parcours complet sur téléphone (Chrome Android + Safari iOS).

## Sécurité

- Activer la 2FA sur Brevo, Google et Facebook.
- Ne jamais committer les clés dans le dépôt (elles sont posées en secrets
  chiffrés Cloudflare, hors code).
- Conserver le brouillon des clés dans un gestionnaire de mots de passe.
