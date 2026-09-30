/**
 * « Quoi de neuf » (Task 48-c — demande fondateur : journal des nouveautés
 * à chaque mise à jour).
 *
 * Principe : le détecteur Task 44 compare les SIGNATURES de bundles (aucun
 * numéro de version produit n'existe). Au boot, App compare la signature des
 * bundles chargés avec celle mémorisée au boot PRÉCÉDENT (localStorage) :
 * différence ⇒ une mise à jour a été livrée entre-temps ⇒ la modale affiche
 * les entrées récentes de ce journal.
 *
 * Règles de rédaction :
 *   - Entrées ORDONNÉES de la plus récente à la plus ancienne (on affiche
 *     les premières d'abord).
 *   - Une entrée = UN déploiement utilisateur-visible (pas de bruit interne :
 *     smokes, refactors, correctifs invisibles n'ont rien à faire ici).
 *   - items = phrases COURTES tournées bénéfice utilisateur, sans jargon.
 *
 * La modale ne s'ouvre que lorsqu'une différence est constatée (jamais au
 * premier arrivant : pas de signature mémorisée ⇒ on mémorise en silence).
 */

export interface WhatsNewEntry {
  /** Identifiant stable (utilisable comme clé React). */
  id: string;
  /** Date d'affichage (lisible, FR). */
  date: string;
  /** Titre court de l'entrée. */
  title: string;
  /** 2 à 4 points, bénéfice utilisateur. */
  items: string[];
}

export const WHATS_NEW: WhatsNewEntry[] = [
  {
    id: '2026-09-30-barre-adresse-app',
    date: '30 septembre 2026',
    title: 'La barre d’adresse ? Elle s’en va avec l’application',
    items: [
      'wairyu ouvert depuis un lien (mail, WhatsApp…) reste dans le navigateur, avec sa barre d’adresse — aucun site ne peut la masquer, c’est le navigateur lui-même qui l’affiche.',
      'L’application installée, elle, s’ouvre plein écran sans aucune barre d’adresse : quand wairyu détecte que l’app n’est pas encore installée, il te le dit maintenant clairement et t’emmène à la page d’installation en un appui.',
      'Via Chrome, l’installation est signée par Google : jamais signalée par Play Protect, et les notifications passent en « géré par l’application ».',
    ],
  },
  {
    id: '2026-09-30-autorisations-normales',
    date: '30 septembre 2026',
    title: '« Aucune autorisation » ? C’est normal — le guide s’adapte',
    items: [
      'Le guide de déblocage des notifications commence maintenant par le plus rapide : l’icône 🔒 à côté de l’adresse dans Chrome → Autorisations → Notifications.',
      'Si wairyu est listé « Non autorisé » et que rien ne se propose, le guide donne le remède réel : Tous les sites → wairyu → Effacer et réinitialiser.',
      'Tu as ouvert Réglages → Applications → wairyu et tu vois « Aucune autorisation » ? Le guide t’explique désormais que c’est normal pour une appli installée via Chrome — cet écran vide ne bloque rien, tout se règle dans Chrome.',
    ],
  },
  {
    id: '2026-09-30-notifications-badoo',
    date: '30 septembre 2026',
    title: 'Tes notifications, gérées comme Badoo',
    items: [
      'Quand les notifications sont bloquées par le téléphone, wairyu ne se tait plus : une carte t’explique exactement où débloquer — le même écran Chrome que celui de ta capture (« Non autorisé » → wairyu → Autoriser).',
      'La voie recommandée, celle de Badoo : installer l’application — les notifications passent alors sous « Géré par l’application » dans Chrome et ne peuvent plus être bloquées par la liste des sites.',
      'Dès ton retour après le déblocage, wairyu s’en aperçoit tout seul et réactive tes notifications sans aucun appui.',
      'Réglages → Notifications affiche désormais l’état réel du téléphone (Activées / Pas encore demandées / Bloquées) avec le guide de réparation intégré.',
    ],
  },
  {
    id: '2026-09-30-geoloc-guide',
    date: '30 septembre 2026',
    title: 'Ta position se débloque, pas à pas',
    items: [
      '« Détecter ma position » n’échoue plus en silence : wairyu reconnaît maintenant POURQUOI le téléphone refuse (position bloquée dans les autorisations, GPS coupé, détection trop longue).',
      'Pour chaque cause, le remède exact s’affiche — par exemple : Réglages Android → Applications → wairyu → Autorisations → Position → Autoriser, puis re-tap sur « Détecter ma position ».',
      'Si la position est déjà bloquée, le guide apparaît dès l’arrivée sur l’étape — plus besoin de taper à l’aveugle.',
    ],
  },
  {
    id: '2026-09-30-play-protect',
    date: '30 septembre 2026',
    title: 'Plus jamais bloquée par Google Play Protect',
    items: [
      'Google Play Protect bloque parfois les apps installées hors Play Store — wairyu s’installe désormais VIA CHROME : l’application créée est signée par Google, elle ne peut plus être bloquée.',
      'Sur la page d’installation, la voie Chrome est maintenant recommandée ; l’APK direct reste disponible, avec le guide pour débloquer si Play Protect s’en mêle (« Plus de détails » → « Installer quand même »).',
      'Si ton wairyu a été désactivée par Play Protect, les notifications reviennent dès qu’elle est réinstallée via Chrome (ou débloquée).',
    ],
  },
  {
    id: '2026-09-30-notifs-auto-reglages',
    date: '30 septembre 2026',
    title: 'Notifications automatiques et réglables à ta main',
    items: [
      'Les notifications s’activent désormais automatiquement — plus besoin de chercher le bouton : la demande arrive naturellement au premier contact avec l’app.',
      'Dans Réglages → Notifications, tu décides de tout : tout couper, ou choisir exactement ce que tu veux recevoir (messages, matchs, sécurité, infos wairyu).',
      'Ton téléphone refuse la demande ? wairyu t’explique exactement quoi faire (les applis qui affichent par-dessus l’écran bloquent tout) — plus jamais de blocage mystérieux.',
    ],
  },
  {
    id: '2026-09-29-pseudo-espaces',
    date: '29 septembre 2026',
    title: 'Des pseudos avec espaces, comme dans la vraie vie',
    items: [
      'Choisis le pseudo qui te ressemble : « Marie Claire », « Jean-Paul » ou « N’Guessan » — les espaces sont les bienvenus.',
      'À la connexion, plus de piège : majuscules, accents et espaces ne comptent plus, impossible de te tromper.',
      'Les pseudos déjà créés continuent de fonctionner exactement comme avant.',
    ],
  },
  {
    id: '2026-09-29-app-sans-url',
    date: '29 septembre 2026',
    title: 'wairyu comme une vraie appli — sans barre d’adresse',
    items: [
      'Sur Android avec l’application installée, tout lien ouvert dans le navigateur bascule automatiquement dans l’appli : plein écran, aucune URL.',
      'Pas encore installée ? Une bulle te propose l’installation en un appui — après, la barre d’adresse disparaît pour toujours.',
      'Sur iPhone : Partager → « Sur l’écran d’accueil », et wairyu s’ouvre comme une appli.',
    ],
  },
  {
    id: '2026-09-29-ouverture-directe',
    date: '29 septembre 2026',
    title: 'L’appli s’ouvre directement sur ton compte',
    items: [
      'Plus d’écran intermédiaire : quand tu reviens, ta découverte s’ouvre toute seule — aucun appui inutile.',
      'Après une déconnexion, « Continuer en tant que » affiche ton pseudo, et ta connexion se remplit en un appui.',
      'Ta recherche s’applique vraiment : tu ne vois que les profils qui correspondent à ton genre, ton orientation et ton âge.',
    ],
  },
  {
    id: '2026-09-29-inscription-simple',
    date: '29 septembre 2026',
    title: 'Inscription simplifiée + notification de bienvenue',
    items: [
      'Créer un compte est devenu plus simple : choisis un pseudo et un mot de passe, c’est tout — plus besoin d’attendre un code par email.',
      'Dès l’inscription, une notification de félicitations arrive sur ton téléphone : la preuve que tu recevras messages et matchs même app fermée.',
    ],
  },
  {
    id: '2026-09-29-google-popup',
    date: '29 septembre 2026',
    title: 'Connexion Google plus fiable dans l’application',
    items: [
      'La connexion avec Google s’ouvre maintenant dans une petite fenêtre, sans jamais quitter l’app : fini les fermetures inattendues sur certains téléphones.',
      'Un lien de secours « via le navigateur » reste disponible si la fenêtre Google ne s’ouvre pas.',
    ],
  },
  {
    id: '2026-09-29-app-mobile',
    date: '29 septembre 2026',
    title: 'wairyu s’installe sur ton téléphone',
    items: [
      'L’application Android arrive : télécharge l’APK officiel en 1 clic et retrouve wairyu comme une vraie app, avec notifications.',
      'Une nouvelle page d’installation avec QR code te guide pas à pas — accessible depuis Paramètres.',
      'iPhone : l’installation sur l’écran d’accueil est expliquée écran par écran (exigence iOS pour les notifications).',
    ],
  },
  {
    id: '2026-09-29-ergonomie-deck',
    date: '29 septembre 2026',
    title: 'Découvrir plus grand, plus vivant',
    items: [
      'La bannière du haut se replie d’un tap : tes profils occupent tout l’écran, surtout sur téléphone.',
      'Tes quotas affichent maintenant une jauge chacun — tu vois toujours ce qu’il te reste, jour après jour.',
      'Fin de pile ? Un radar t’annonce qui est en ligne et qui rejoint ton univers — tu n’es jamais seul·e.',
      'Sur Android, tes gestes deviennent tangibles : une légère vibration confirme chaque swipe et chaque match.',
    ],
  },
  {
    id: '2026-09-28-simulation-notif',
    date: '28 septembre 2026',
    title: 'Teste tes notifications en 1 clic',
    items: [
      'Un bouton « Tester la notification » arrive dans Paramètres : une vraie alerte s’affiche sur ton écran en quelques secondes.',
      'Active tes notifications et une simulation part tout de suite — tu vois exactement ce que verront tes matchs.',
      'Sur téléphone comme sur ordinateur, l’alerte porte le nom de WAIRYU, comme un SMS ou WhatsApp.',
    ],
  },
  {
    id: '2026-09-28-notifications',
    date: '28 septembre 2026',
    title: 'Les notifications qui apparaissent vraiment',
    items: [
      'Reçois tes messages, matchs et demandes comme un SMS — même app fermée, sur téléphone et ordinateur.',
      'Sur ordinateur, un nouveau message apparaît en bas à droite, comme WhatsApp Web : un clic ouvre la conversation.',
      'Active-les en un tap depuis la bannière (ou Paramètres) — on ne te le demandera qu’une fois.',
      'Sur iPhone, un nouveau guide t’accompagne : iOS n’affiche les alertes que pour l’app installée sur l’écran d’accueil.',
    ],
  },
  {
    id: '2026-09-26-univers-chat',
    date: '26 septembre 2026',
    title: 'Ton chat prend les couleurs de tes univers',
    items: [
      'Chaque conversation affiche l’univers où votre match est né : Classique, Invisible ou Interracial.',
      'Un filtre par univers arrive dans ta boîte Messages : tes conversations restent rangées, où que tu navigues.',
      'La carte « C’est un match ! » annonce désormais l’univers de votre rencontre.',
    ],
  },
  {
    id: '2026-09-26-selecteur-univers',
    date: '26 septembre 2026',
    title: 'Change d’univers en un tap, partout',
    items: [
      'Nouveau sélecteur d’univers dans le menu latéral — depuis Messages, Likes, Profil ou Moments.',
      'Sur mobile, une bande de couleur au-dessus des onglets montre ton univers actif et ouvre le même menu.',
      'Tes conversations et tes matchs te suivent quand tu changes d’univers — rien n’est jamais perdu.',
    ],
  },
  {
    id: '2026-09-26-confidentialite-urls',
    date: '26 septembre 2026',
    title: 'Confidentialité Invisible renforcée + liens propres',
    items: [
      'En Mode Invisible, les photos se floutent immédiatement — dès l’ouverture de l’onglet.',
      'Chaque univers a maintenant sa propre adresse (exemple : #/discover/interracial) — le bouton retour fonctionne naturellement.',
      'Une pilule « Recharger » te propose la nouvelle version dès qu’elle est en ligne, sans forcer rien.',
    ],
  },
];

/** Nombre d'entrées affichées dans la modale (les plus récentes d'abord). */
export const WHATS_NEW_SHOW = 3;
