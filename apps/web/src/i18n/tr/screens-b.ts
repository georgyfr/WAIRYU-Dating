/**
 * Dictionnaire EN du chrome — périmètre B : écrans Auth, ResetPassword,
 * FbComplete, OAuthComplete, Messages, Rencontres, Masque, Discover +
 * composants (NotificationsCard, PartageCarteModal, PasswordField,
 * TurnstileWidget, BirthDatePicker, CongratsOverlay, PushToast).
 * Clés = chaînes FR exactes du code · valeurs = EN · repli FR si absent.
 *
 * Note : les libellés de birthDateError() (lib/auth-client.ts, non édité)
 * remontent via tx(variable) dans les écrans du périmètre — leurs clés
 * vivent ici pour que le flux d'inscription soit traduit de bout en bout.
 */
export const SCREENS_B: Record<string, string> = {
  // ---- Auth.tsx — messages (OTP, compte, récupération)
  'Mode test : le code est prérempli ci-dessous.': 'Test mode: the code is pre-filled below.',
  'Code envoyé par email ET en notification sur tes appareils wairyu — regarde tes notifications, pas besoin de fouiller ta boîte mail.':
    'Code sent by email AND as a notification on your wairyu devices — check your notifications, no need to dig through your inbox.',
  'Code envoyé par email — il est valable 10 minutes.': 'Code sent by email — it is valid for 10 minutes.',
  'Erreur réseau — réessayez.': 'Network error — try again.',
  'Dernière étape : votre date de naissance (jamais publiée, sert à vérifier que vous êtes majeur).':
    'Last step: your date of birth (never published, only used to check that you are of age).',
  'Compte créé ! Notez précieusement ce code de récupération — il ne sera plus jamais affiché.':
    'Account created! Save this recovery code carefully — it will never be shown again.',
  'Mode test : lien de réinitialisation disponible dans la réponse du serveur.':
    'Test mode: a reset link is available in the server response.',
  'Si cette adresse correspond à un compte, un email avec un lien de réinitialisation vient de partir.':
    'If this address matches an account, an email with a reset link has just been sent.',

  // ---- Auth.tsx — sous-titres par mode
  'Connectez-vous ou créez votre compte — c’est gratuit, sans carte.':
    "Sign in or create your account — it's free, no card needed.",
  'Recevez un code à 6 chiffres par email.': 'Get a 6-digit code by email.',
  'Code envoyé à {{n}}.': 'Code sent to {{n}}.',
  'Connexion avec votre pseudo ou votre email.': 'Sign in with your username or email.',
  'Créez votre compte classique (pseudo + mot de passe).': 'Create your classic account (username + password).',
  'Retrouver l’accès à votre compte.': 'Get back into your account.',
  'Récupération avec votre code wairyu.': 'Recovery with your wairyu code.',
  'Logo Wairyu': 'Wairyu logo',

  // ---- Auth.tsx — choix de la voie
  'Votre email': 'Your email',
  'vous@exemple.com': 'you@example.com',
  "Continuer avec l'email": 'Continue with email',
  ou: 'or',
  "J'ai un pseudo et un mot de passe": 'I have a username and a password',
  'Créer un compte avec un pseudo': 'Sign up with a username',
  'Continuer avec Google': 'Continue with Google',
  'Continuer avec Facebook': 'Continue with Facebook',
  'Date de naissance — 18 ans révolus requis': 'Date of birth — you must be 18 or older',
  'Date de naissance — seulement si vous créez un compte': 'Date of birth — only if you are creating an account',
  'Date de naissance — pour vérifier que vous êtes majeur': 'Date of birth — to check that you are of age',

  // ---- Auth.tsx — boutons & champs
  'Envoi…': 'Sending…',
  'Recevoir mon code': 'Get my code',
  Retour: 'Back',
  Email: 'Email',
  'Code à 6 chiffres': '6-digit code',
  'Vérification…': 'Verifying…',
  Valider: 'Confirm',
  'Renvoyer un code': 'Send a new code',
  'Pseudo ou email': 'Username or email',
  'Connexion…': 'Signing in…',
  'Se connecter': 'Sign in',
  'Mot de passe oublié ?': 'Forgot password?',
  "J'ai un code de récupération": 'I have a recovery code',
  'Pseudo (3-20 caractères, espaces et accents acceptés)': 'Username (3-20 characters, spaces and accents allowed)',
  'Création…': 'Creating…',
  'Créer mon compte': 'Create my account',
  'Email du compte': 'Account email',
  'Recevoir un lien de réinitialisation': 'Email me a reset link',
  'Écrivez ce code sur papier ou dans vos notes. Il permet de reprendre votre compte sans email.':
    'Write this code down on paper or in your notes. It lets you get back into your account without an email.',
  "C'est noté — continuer": 'Got it — continue',
  Pseudo: 'Username',
  'Code de récupération (12 caractères)': 'Recovery code (12 characters)',
  'Reprendre mon compte': 'Recover my account',
  "En continuant, vous acceptez d'avoir 18 ans révolus et nos règles : respect, consentement, zéro contenu non consenti. Vos données restent les vôtres — export et suppression à tout moment.":
    'By continuing, you confirm that you are 18 or older and accept our rules: respect, consent, zero non-consensual content. Your data stays yours — export it or delete it at any time.',

  // ---- PasswordField (labels passés par Auth / ResetPassword + défaut)
  'Mot de passe': 'Password',
  'Mot de passe (8 caractères minimum)': 'Password (8 characters minimum)',
  'Masquer le mot de passe': 'Hide password',
  'Afficher le mot de passe': 'Show password',

  // ---- ResetPassword.tsx
  'Le mot de passe doit contenir au moins 8 caractères.': 'The password must contain at least 8 characters.',
  'Choisissez un nouveau mot de passe.': 'Choose a new password.',
  'Nouveau mot de passe (8 caractères minimum)': 'New password (8 characters minimum)',
  'Enregistrement…': 'Saving…',
  Enregistrer: 'Save',

  // ---- birthDateError (lib/auth-client — remontés via tx(variable))
  'Format attendu : AAAA-MM-JJ.': 'Expected format: YYYY-MM-DD.',
  'Année de naissance invalide.': 'Invalid birth year.',
  'Date de naissance invalide.': 'Invalid date of birth.',
  'Les comptes wairyu sont réservés aux personnes majeures (18 ans révolus).':
    'wairyu accounts are reserved for adults (18 or older).',

  // ---- FbComplete.tsx
  'Rattachement Facebook impossible.': 'Could not link your Facebook account.',
  'Facebook n’a pas partagé votre email. Indiquez-le pour finaliser la connexion.':
    'Facebook did not share your email. Enter it below to finish signing in.',
  'Saisissez le code à 6 chiffres envoyé par email.': 'Enter the 6-digit code sent by email.',
  'Continuer sans email — via Facebook': 'Continue without email — via Facebook',
  'Boîte mail inaccessible\u00A0? Votre compte sera créé avec votre profil Facebook seul (la date de naissance ci-dessus est requise). Un email de récupération pourra être ajouté plus tard.':
    "Can't reach your inbox? Your account will be created with your Facebook profile alone (the date of birth above is required). A recovery email can be added later.",
  'Valider et relier mon compte Facebook': 'Confirm and link my Facebook account',
  'Ajoutez votre date de naissance ci-dessus pour créer votre compte sans email.':
    'Add your date of birth above to create your account without an email.',

  // ---- OAuthComplete.tsx (clés coupées autour de {providerLabel})
  "Cette étape a expiré (valable 10 minutes). Revenez à l'écran de connexion et recliquez sur « Continuer avec ":
    'This step has expired (valid for 10 minutes). Go back to the sign-in screen and tap “Continue with ',
  ' » — vous reverrez directement cette dernière étape.': '” — and you will land directly on this last step.',
  'Retour à la connexion': 'Back to sign-in',
  'Dernière étape pour créer votre compte avec ': 'Last step to create your account with ',
  " : votre date de naissance. Elle n'est jamais publiée — elle sert uniquement à vérifier que vous avez 18 ans révolus.":
    ': your date of birth. It is never published — it is only used to check that you are 18 or older.',
  Annuler: 'Cancel',

  // ---- Messages.tsx
  Messages: 'Messages',
  "Aucun message pour l'instant": 'No messages yet',
  "Quand quelqu'un vous répondra, la conversation apparaîtra ici. Messages réels, jamais automatisés.":
    'When someone replies to you, the conversation will appear here. Real messages, never automated.',

  // ---- Rencontres.tsx
  'Tes rencontres': 'Your matches',
  'Certaines rencontres commencent ici.': 'Some matches begin here.',
  "Aucune rencontre pour l'instant": 'No matches yet',
  'Quand ton voyage révèle des affinités, elles apparaîtront ici : personnes compatibles, connexions réciproques, recommandations.':
    'When your journey reveals affinities, they will appear here: compatible people, mutual connections, recommendations.',
  'Comment ça commence\u00A0?': 'How does it start?',
  "Ton voyage construit ton portrait et tes affinités — la première personne compatible apparaîtra ici, et le Voyage à Deux s'ouvrira avec elle. La rencontre n'est jamais payante.":
    'Your journey builds your portrait and your affinities — the first compatible person will appear here, and the Journey for Two will open with them. Meeting people is never paid.',
  'Voir ma carte du voyage': 'See my journey card',

  // ---- Masque.tsx
  "Cet espace n'est pas encore ouvert": 'This space is not open yet',
  "Wairyu avance par étages : certains espaces s'ouvriront plus tard dans ton voyage, quand les Mondes t'auront révélé l'essentiel.":
    'Wairyu opens floor by floor: some spaces will unlock later in your journey, once the Worlds have revealed what matters most.',
  'Chaque chose en son temps — ton voyage continue ici\u00A0:':
    'Everything in its own time — your journey continues here:',
  'Retour à mon voyage': 'Back to my journey',

  // ---- Discover.tsx
  Découvrir: 'Discover',
  'Profils de démonstration — le moteur arrive.': 'Demo profiles — the engine is on its way.',
  'Photo (démo) de {{n}}': 'Demo photo of {{n}}',
  'Profil de démonstration': 'Demo profile',
  'Passionnée de botanique et de marchés du dimanche. Je crois aux conversations lentes.':
    'Passionate about botany and Sunday markets. I believe in slow conversations.',
  'Guitariste du week-end, cartographe de la semaine. Toujours partant pour un concert.':
    'Weekend guitarist, weekday cartographer. Always up for a concert.',
  'Lectrice vorace et randonneuse occasionnelle. Le respect avant tout.':
    'Voracious reader and occasional hiker. Respect above all.',

  // ---- NotificationsCard.tsx — messages d'état
  'Notifications activées — le serveur a bien envoyé le push (la bulle du système devrait apparaître).':
    'Notifications activated — the server did send the push (the system bubble should appear).',
  'Notifications activées et enregistrées — l’issue réelle de l’envoi figure dans le journal ci-dessous.':
    'Notifications activated and saved — the actual outcome of the send is in the journal below.',
  'Permission refusée. Débloquez le site dans les réglages du navigateur pour réessayer.':
    'Permission denied. Unblock the site in your browser settings and try again.',
  'Le serveur n’a pas encore ses clés VAPID — réessayez plus tard.':
    'The server does not have its VAPID keys yet — try again later.',
  'Ce navigateur ne supporte pas le push — le journal in-app ci-dessous reste disponible.':
    'This browser does not support push — the in-app journal below stays available.',
  'Échec réseau — réessayez.': 'Network failure — try again.',
  'Push réel envoyé par le serveur — regardez la bulle du système (même page ouverte).':
    'Real push sent by the server — check the system bubble (page kept open).',
  'Pas encore d’abonnement push : notification LOCALE affichée via le Service Worker (repli).':
    'No push subscription yet: a LOCAL notification was shown via the Service Worker (fallback).',
  'Pas d’abonnement push et Service Worker indisponible : activez d’abord les notifications.':
    'No push subscription and the Service Worker is unavailable: turn on notifications first.',
  'Trop de tests rapprochés — patientez une minute.': 'Too many tests in a row — wait a minute.',
  'Le serveur n’a pas pu délivrer le push (voir le journal).': 'The server could not deliver the push (see the journal).',
  'Notifications désactivées sur cet appareil.': 'Notifications turned off on this device.',

  // ---- NotificationsCard.tsx — puces de statut
  'Permission accordée': 'Permission granted',
  'Permission refusée': 'Permission denied',
  'Push non supporté (canal in-app seul)': 'Push not supported (in-app channel only)',
  'Permission à accorder': 'Permission needed',
  'Serveur push : vérification…': 'Push server: checking…',
  'Serveur push : prêt': 'Push server: ready',
  'Serveur push : clés absentes': 'Push server: keys missing',
  Abonné: 'Subscribed',
  'Non abonné': 'Not subscribed',

  // ---- NotificationsCard.tsx — titre, note appareil, actions, journal
  'Console de notifications': 'Notification console',
  'Notifications sur cet appareil': 'Notifications on this device',
  Appareil: 'Device',
  ' · {{n}} ouvertures': ' · {{n}} opens',
  ' · {{n}} ouverture': ' · {{n}} open',
  ' · notification de bienvenue en attente d’activation': ' · welcome notification pending activation',
  ' · bienvenue envoyée': ' · welcome sent',
  'Activation…': 'Turning on…',
  'Activer les notifications': 'Turn on notifications',
  'Envoyer une notification de test': 'Send a test notification',
  'Simuler une première ouverture': 'Simulate a first open',
  'Se désabonner': 'Unsubscribe',
  'Journal des notifications (canal in-app — fonctionne sur tous les appareils, y compris Android 6/7 et iOS 10/11 sans support push) :':
    'Notification journal (in-app channel — works on every device, including Android 6/7 and iOS 10/11 without push support):',
  'Aucune notification pour le moment.': 'No notifications yet.',
  locale: 'local',
  échec: 'failed',

  // ---- PartageCarteModal.tsx (son chrome seulement — carte.nom = donnée)
  'Avant de partager': 'Before sharing',
  'Partager ta carte ?': 'Share your card?',
  'Ta carte complète —': 'Your full card —',
  ", ta lumière, ta zone d'ombre et ta tension intérieure — sera préparée en texte. Selon ton appareil, une feuille de partage s'ouvrira pour l'envoyer où tu veux (messagerie, email…), ou elle sera copiée dans le presse-papiers, prête à coller.":
    ', your light, your shadow side and your inner tension — will be prepared as text. Depending on your device, a share sheet will open so you can send it wherever you like (messaging, email…), or it will be copied to the clipboard, ready to paste.',
  "Wairyu ne publie rien : ta carte part uniquement si tu l'envoies toi-même. Qui la reçoit pourra la lire et la garder.":
    'Wairyu publishes nothing: your card is shared only if you send it yourself. Whoever receives it can read it and keep it.',
  'Oui, je partage ma carte': 'Yes, I share my card',
  'Non, je la garde pour moi': 'No, I keep it for myself',

  // ---- TurnstileWidget.tsx
  'Vérification anti-robot indisponible (connexion instable\u00A0?).':
    'Anti-bot check unavailable (unstable connection?).',
  'Réessayer la vérification': 'Retry the check',
  'Vérification anti-robot': 'Anti-bot check',

  // ---- BirthDatePicker.tsx
  'Date de naissance': 'Date of birth',
  'Sélectionner — Jour · Mois · Année': 'Select — Day · Month · Year',
  Fermer: 'Close',
  Jour: 'Day',
  Mois: 'Month',
  Année: 'Year',
  Effacer: 'Clear',
  'Choisir cette date': 'Choose this date',

  // ---- CongratsOverlay.tsx
  'Ton compte a été créé via Google.': 'Your account was created via Google.',
  'Ton compte a été créé via Facebook.': 'Your account was created via Facebook.',
  'Ton compte a été créé avec ton pseudo.': 'Your account was created with your username.',
  'Ton compte a été créé avec ton adresse email.': 'Your account was created with your email address.',
  'Bienvenue sur wairyu': 'Welcome to wairyu',
  'Bienvenue sur WAIRYU': 'Welcome to WAIRYU',
  'Ton inscription est enregistrée — ta session reste active, plus jamais besoin de te réinscrire. Retrouve cette annonce et tes notifications dans le journal (onglet Profil).':
    'Your sign-up is saved — your session stays active, you will never have to sign up again. Find this announcement and your notifications in the journal (Profile tab).',
  "C'est parti": "Let's go",
};
