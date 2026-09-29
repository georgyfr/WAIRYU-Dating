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
