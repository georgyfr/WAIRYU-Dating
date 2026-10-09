/**
 * Le dictionnaire EN du CHROME APP (couche interface, hors contenus de
 * quêtes) — clés = les chaînes FRANÇAISES exactes du code, valeurs = EN.
 * Une chaîne absente du dictionnaire s'affiche en FR (repli silencieux).
 *
 * Périmètre core : App.tsx (en-tête, cloche, compte RGPD), TabBar,
 * écran Quête (chrome de passation/carte/détails), écran Profil (+ sélecteurs
 * langue & devise), libellés partagés (boutons, helpers de quetes.ts, PDF).
 */

export const CORE: Record<string, string> = {
  // ---- en-tête (App.tsx)
  "Apprendre aujourd'hui,<br>explorer demain": "Learn today,<br>explore tomorrow",
  'Bonjour,': 'Hello,',
  Voyageur: 'Traveler',
  'Notifications ({{n}} nouvelles)': 'Notifications ({{n}} new)',
  Notifications: 'Notifications',
  'Fermer les notifications': 'Close notifications',
  'Notifications récentes': 'Recent notifications',
  'Rien pour le moment — tes notifications apparaîtront ici.':
    'Nothing yet — your notifications will appear here.',
  'Mon compte': 'My account',
  'Fermer mon compte': 'Close my account',
  'Exporter mes données (RGPD)': 'Export my data (GDPR)',
  'Se déconnecter': 'Log out',
  'Supprimer ton compte efface immédiatement tes données personnelles. Cette action est définitive.':
    'Deleting your account immediately erases your personal data. This action is permanent.',
  'Oui, supprimer définitivement': 'Yes, delete permanently',
  Annuler: 'Cancel',
  'Supprimer mon compte (RGPD)': 'Delete my account (GDPR)',
  'La déconnexion n’a pas abouti — réessaie.': 'Log out failed — try again.',
  'L’export n’a pas abouti — réessaie.': 'The export failed — try again.',
  'La suppression n’a pas abouti — réessaie.': 'The deletion failed — try again.',
  'Connexion réussie — bienvenue !': 'Signed in — welcome!',
  'La connexion sociale a été interrompue — réessayez, ou utilisez le code email.':
    'The social sign-in was interrupted — try again, or use the email code.',
  'Cet email n’est pas vérifié chez le fournisseur — utilisez le code email.':
    'This email is not verified with the provider — use the email code.',
  'Connexion annulée.': 'Sign-in cancelled.',
  'La connexion sociale a échoué — réessayez, ou utilisez le code email.':
    'Social sign-in failed — try again, or use the email code.',
  'Logo Wairyu — deux bulles de dialogue reliées': 'Wairyu logo — two connected speech bubbles',
  'Chargement…': 'Loading…',

  // ---- TabBar
  Voyage: 'Journey',
  Mondes: 'Worlds',
  Quête: 'Quest',
  Parcourus: 'Traveled',
  Récolte: 'Harvest',
  'Navigation principale': 'Main navigation',
  'Quête — une quête est en cours': 'Quest — a quest is in progress',

  // ---- écran Quête — briefing
  'Retour aux mondes': 'Back to the worlds',
  'Quête {{n}} sur {{total}}': 'Quest {{n}} of {{total}}',
  Gratuite: 'Free',
  'À quoi sert cette quête': 'What this quest is for',
  'Comment tu vas répondre': 'How you will answer',
  "Ce qu'on attend de toi": 'What is expected of you',
  'Ce qu’on attend de toi pendant la quête': 'What is expected of you during the quest',
  'Les résultats attendus': 'The expected results',
  'Les résultats attendus à la fin de la quête': 'The expected results at the end of the quest',
  'Voulez-vous commencer ?': 'Do you want to start?',
  'Revoir mon écran': 'See my screen again',
  'Revoir ma carte': 'See my card again',
  Commencer: 'Start',
  'Reprendre ({{n}} réponses)': 'Resume ({{n}} answers)',
  'Effacer mes réponses et recommencer': 'Erase my answers and start over',
  "L'échelle de réponse : 5 niveaux, de « Pas du tout moi » à « Tout à fait moi »":
    'The answer scale: 5 levels, from “Not at all me” to “Exactly me”',

  // ---- écran Quête — passation
  'Tu reprends là où tu t\'es arrêté — tes réponses sont conservées.':
    'You pick up where you left off — your answers are saved.',
  'Progression de la quête': 'Quest progress',
  'Alors, tu pars d\'où ?': 'So, where are you starting from?',
  'Je suis prêt·e': 'I am ready',
  'D\'abord une quête recommandée': 'First, a recommended quest',
  'Je commence quand même': 'I am starting anyway',
  'Aucun chemin n\'est le bon — et tu pourras changer d\'avis quand tu veux.':
    'No path is the right one — and you can change your mind whenever you like.',
  'Ton chemin — trois sorties, toutes dignes': 'Your path — three ways out, all worthy',
  'Aucune de tes réponses ne dessine encore un cap — et c\'est très bien ainsi.':
    'None of your answers draws a heading yet — and that is perfectly fine.',
  'Ton intention — un état, jamais une case': 'Your intention — a state, never a box',
  'Je découvre': 'I am finding out',
  'Tu peux aussi modifier tes réponses ci-dessous — tes trois réponses restent intactes et sans jugement.':
    'You can also change your answers below — your three answers stay intact and judgment-free.',
  'Coches tes lignes rouges — ou aucune.': 'Tick your red lines — or none.',
  'Tes lignes rouges — coches ce qui est rédhibitoire pour toi':
    'Your red lines — tick what is a deal-breaker for you',
  'Tes mots à toi — ils ne sont jamais reformulés.': 'Your own words — never reworded.',
  'Valider ma sélection': 'Confirm my selection',
  'Rien n\'est jugé ici : la liste vide est un cadre ouvert, une réponse complète.':
    'Nothing is judged here: an empty list is an open frame, a complete answer.',
  'Cent points. Cinq horizons.': 'One hundred points. Five horizons.',
  '{{n}} pts': '{{n}} pts',
  '{{n}} — points sur 100': '{{n}} — points out of 100',
  'Tes priorités — cent points à répartir sur cinq horizons':
    'Your priorities — one hundred points to spread across five horizons',
  'Les cent points sont posés.': 'All one hundred points are placed.',
  'Il reste {{n}} points à répartir.': '{{n}} points left to place.',
  'Valider ma répartition': 'Confirm my split',
  'Ta réponse — 5 niveaux': 'Your answer — 5 levels',
  'Ton choix — deux options, la même valeur': 'Your choice — two options, same value',
  Maintenant: 'Now',
  'Plus tard': 'Later',
  'Ta réponse — choisis autant d\'options que tu veux, ou aucune':
    'Your answer — choose as many options as you like, or none',
  'Ta réponse': 'Your answer',
  'Question précédente': 'Previous question',
  'Faire une pause — tes réponses restent': 'Take a break — your answers stay saved',

  // ---- écran Quête — carte
  'Ton écran': 'Your screen',
  'Ta carte': 'Your card',
  'Ton profil de voyage :': 'Your journey progress:',
  '{{n}} % complété': '{{n}}% complete',
  'Voir mes résultats en détail': 'See my results in detail',
  'Partager ma carte': 'Share my card',
  'Copié — ta carte est dans le presse-papiers.': 'Copied — your card is in the clipboard.',
  'Retour à mon voyage': 'Back to my journey',
  'Rien ne se remet à zéro : ta carte, tes réponses et tes résultats restent dans l\'onglet Quête — tu reviens\n          quand tu veux.':
    'Nothing resets: your card, your answers and your results stay in the Quest tab — come back\n          whenever you like.',
  'Rien ne se remet à zéro : ta carte, tes réponses et tes résultats restent dans l\'onglet Quête — tu reviens quand tu veux.':
    'Nothing resets: your card, your answers and your results stay in the Quest tab — come back whenever you like.',
  'Ta prochaine quête': 'Your next quest',
  'Attaquer la quête suivante': 'Start the next quest',
  'Et maintenant ?': 'And now?',
  'Le miroir — la suite de ton monde': 'The mirror — the next step of your world',
  'Continuer le voyage': 'Continue the journey',

  // ---- écran Quête — écran final (sans carte)
  'Tu préfères ne pas dire': 'You prefer not to say',
  'C\'est noté — le voyage continue sans le badge. Aucune trace, aucune relance.':
    'Noted — the journey continues without the badge. No trace, no follow-up.',
  'Tes réponses restent sur cet appareil — tu peux les modifier ou tout effacer depuis « Voulez-vous commencer ? ».':
    'Your answers stay on this device — you can change or erase everything from “Do you want to start?”.',
  "Tu n'as rien coché pour le moment — c'est une réponse complète.":
    'You have not ticked anything yet — that is a complete answer.',

  // ---- écran Quête — détails (gabarit fondateur)
  'Revenir à ma carte': 'Back to my card',
  '🎉 Ton profil :': '🎉 Your profile:',
  'Ton archétype': 'Your archetype',
  'En résumé :': 'In short:',
  'Ce que tu apportes': 'What you bring',
  'Ce qui peut te freiner': 'What can hold you back',
  'En couple': 'As a couple',
  'Ton équilibre': 'Your balance',
  "La suite de ton voyage": 'The next step of your journey',
  '🧭 La suite de ton voyage': '🧭 The next step of your journey',
  'Ton document se prépare…': 'Your document is being prepared…',
  'Télécharger mon document personnel': 'Download my personal document',
  'Le document reprend ton profil, tes tendances mesurées et la suite de ton voyage. Il reste sur ton\n          appareil — rien n\'est envoyé.':
    'The document carries your profile, your measured trends and the next step of your journey. It stays on your\n          device — nothing is sent.',
  'Le document reprend ton profil, tes tendances mesurées et la suite de ton voyage. Il reste sur ton appareil — rien n\'est envoyé.':
    'The document carries your profile, your measured trends and the next step of your journey. It stays on your device — nothing is sent.',

  // ---- écran Profil
  'Mon profil': 'My profile',
  'Votre espace — la personnalisation complète arrive à l\'Étape 3.':
    'Your space — full personalization arrives at Step 3.',
  'Votre photo (à venir)': 'Your photo (coming soon)',
  '@compte email': '@email account',
  Vous: 'You',
  'Compte classique — aucun email requis. Pensez à noter votre code de récupération.':
    'Classic account — no email required. Remember to save your recovery code.',
  'Email vérifié': 'Email verified',
  'Compte actif': 'Active account',
  'Compte & sécurité': 'Account & security',
  'Ajoutez un mot de passe pour vous connecter sans fouiller votre boîte email.':
    'Add a password to sign in without digging through your inbox.',
  'Nouveau mot de passe (8 caractères min.)': 'New password (8 characters min.)',
  'Activer le mot de passe': 'Activate password',
  'Mot de passe actif — identifiant :': 'Password active — login:',
  ' · code de récupération en place': ' · recovery code in place',
  'Le mot de passe doit contenir au moins 8 caractères.':
    'The password must contain at least 8 characters.',
  'Erreur réseau.': 'Network error.',
  'Langue et devise': 'Language & currency',
  'La langue de l\'interface et la monnaie des montants affichés.':
    'The interface language and the currency of displayed amounts.',
  Langue: 'Language',
  Devise: 'Currency',
  'Détectée d\'après votre région — changez-la si besoin.':
    'Detected from your region — change it if needed.',
  'Mot de passe activé — votre identifiant de connexion : {{n}}':
    'Password activated — your login: {{n}}',
  'Supprimer votre compte efface immédiatement vos données personnelles (trace anonyme purgée sous 30 jours). Cette action est définitive.':
    'Deleting your account immediately erases your personal data (anonymous trace purged within 30 days). This action is permanent.',

  "Tu as terminé les trois quêtes ouvertes du Miroir : ta personnalité, ta façon de t'attacher, tes émotions — trois cartes qui se répondent.":
    'You have completed the three open quests of the Mirror: your personality, the way you attach, your emotions —\n          three cards that speak to each other.',
  // ---- helpers de quetes.ts (libellés calculés)
  'très présente': 'very strong',
  'très présent': 'very strong',
  équilibrée: 'balanced',
  équilibré: 'balanced',
  'plus discrète': 'quieter',
  'plus discret': 'quieter',
  "Ta tendance (d'après tes réponses)": 'Your tendency (from your answers)',
  'Tes {{mot}} tendances (d\'après tes réponses)': 'Your {{mot}} trends (from your answers)',
  deux: 'two',
  trois: 'three',
  quatre: 'four',
  cinq: 'five',
  'Monde 1 — Le Miroir': 'World 1 — The Mirror',
  'Monde 2 — Le Volant': 'World 2 — The Wheel',
  'Monde 3 — La Boussole': 'World 3 — The Compass',

  // ---- PDF (pdf-resultats.ts)
  'Mon document personnel — « {{titre}} »': 'My personal document — “{{titre}}”',
  'Ta carte, ce que représente ton type de personnalité, ce que tes réponses dessinent — et ce que tu peux en faire. Généré depuis tes réponses, il reste le tien.':
    'Your card, what your personality type means, what your answers draw — and what you can do with it. Generated from your answers, it stays yours.',
  'Ma carte': 'My card',
  'Ton profil : {{nom}}': 'Your profile: {{nom}}',
  'La suite de ton voyage (pdf)': 'The next step of your journey',
  'Wairyu — document personnel, généré le {{date}}': 'Wairyu — personal document, generated on {{date}}',
  'Ce document vient de tes réponses à la quête « {{quete}} » du {{monde}}. Il reste le tien : rien n\'est publié sur Wairyu sans ton action. Les textes d\'accompagnement sont une lecture d\'app — ils ne remplacent ni un professionnel, ni une étiquette.':
    'This document comes from your answers to the quest “{{quete}}” in {{monde}}. It stays yours: nothing is published on Wairyu without your action. The accompanying texts are an app reading — they replace neither a professional, nor a label.',
};
