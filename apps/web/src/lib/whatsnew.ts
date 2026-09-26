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
