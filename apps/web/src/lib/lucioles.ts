/* -------------------------------------------------------------------------- */
/* Les Lucioles — l'économie des crédits (portage Task 144, guide 143).        */
/*                                                                             */
/* Sources : SPEC-ECONOMIE-RECOLTES v1.5 §2.5 (montants verbatim — point de    */
/* départ à calibrer, D14) + doctrine v2 gravée au sandbox (Tasks 133→144) :   */
/*   · les Lucioles ne se vendent JAMAIS — aucun pack, à aucun moment (D6/D11);*/
/*   · au voyage, elles ne se GAGNENT que — jamais dépensées ;                 */
/*   · à la RENCONTRE, elles ouvrent des accès premium limités dans le temps ; */
/*   · les mondes payants s'ouvrent au forfait prépayé OU au parrainage —      */
/*     JAMAIS à la Luciole.                                                    */
/*                                                                             */
/* DÉCISIONS FONDATEUR (validées 2026-10-21 — guide 143 §5, items 2/3/4) :     */
/*   · paliers de parrainage : 3 filleuls actifs ouvrent le Monde 8,           */
/*     5 filleuls actifs ouvrent le Monde 10 (M6/M7/M9 restent au forfait) ;   */
/*   · le forfait de mondes ≠ le Fanal : le forfait ouvre des mondes,          */
/*     le Fanal allume des fonctions (D20) — jamais confondus dans l'UI ;      */
/*   · tension paywall cahier §5 tranchée : la chaîne « Ce mois s'ouvrira      */
/*     avec l'abonnement mensuel » devient la formulation D6 (deux portes) —   */
/*     le voyage de base reste gratuit en entier (D18).                        */
/*                                                                             */
/* RÈGLE DU MODULE : AUCUNE donnée démo. Le ledger se dérive UNIQUEMENT des    */
/* événements réels du voyage (quêtes terminées, cartes posées, écrans de      */
/* passage, mondes clôturés) — la même source que Recolte.tsx. Les règles      */
/* non encore actives (hebdo, duo, événement, parrainage) ne comptent PAS.     */
/* Garde-fou (D19) : les fonctions phares n'ont AUCUNE voie à la Luciole.      */
/* -------------------------------------------------------------------------- */

/** Une règle de gain (la table SPEC v1.5 §2.5 — affichée dans l'onglet). */
export interface GainLuciole {
  id: string;
  libelle: string;
  detail?: string;
  montant: number;
  /** La règle demandée explicitement par le fondateur (monde clôturé). */
  vedette?: boolean;
  /** Adopté par le fondateur — doctrine v2 (parrainage). */
  decision?: boolean;
  /** true = la règle CRÉDITE réellement le solde aujourd'hui. */
  actif: boolean;
}

export const GAGNES: GainLuciole[] = [
  {
    id: 'monde-cloture',
    libelle: 'Monde clôturé',
    detail: 'À chaque monde traversé, un gain marquant.',
    montant: 5,
    vedette: true,
    actif: true,
  },
  { id: 'quete-carte', libelle: 'Quête avec carte terminée', montant: 2, actif: true },
  { id: 'ecran-passage', libelle: 'Écran de passage franchi', montant: 1, actif: true },
  {
    id: 'jalon',
    libelle: 'Jalon atteint',
    detail: 'de +5 (La Carte) à +25 (Portrait Intégral, La Rencontre)',
    montant: 5,
    actif: true,
  },
  { id: 'recolte-mois', libelle: 'Récolte du mois complétée', montant: 5, actif: false },
  {
    id: 'retour-hebdo',
    libelle: 'Retour hebdomadaire',
    detail: 'doux, sans compte à rebours (D5)',
    montant: 2,
    actif: false,
  },
  { id: 'duo', libelle: 'Duo créé après un match', montant: 2, actif: false },
  { id: 'evenement', libelle: 'Participation à un événement', montant: 5, actif: false },
  {
    id: 'parrainage',
    libelle: 'Parrainage — ton lien, une inscription réelle',
    detail:
      'Le crédit tombe quand le filleul termine le monde 1 (activation réelle, pas une simple inscription) — lui-même reçoit un bonus de bienvenue.',
    montant: 8,
    decision: true,
    actif: false,
  },
];

/** Une dépense possible (le « goûter » premium — volet rencontre, D22). */
export interface DepenseLuciole {
  id: string;
  nom: string;
  description: string;
  cout: number;
  note?: string;
}

export const DEPENSES: DepenseLuciole[] = [
  { id: 'eclat', nom: 'L’Éclat', description: 'Réagir à une carte précise avec la phrase qu’elle inspire — le « super-like » WAIRYU.', cout: 3, note: '1 offert chaque jour, sans compte à rebours' },
  { id: 'coffret', nom: 'Le Coffret', description: 'Offrir une carte en chat.', cout: 2, note: '1/semaine gratuit' },
  { id: 'clairiere', nom: 'La Clairière', description: 'Boost de visibilité de 30 minutes.', cout: 4, note: 'la visibilité ne garantit jamais un match' },
  { id: 'echo', nom: 'L’Écho', description: 'Voir quelle carte de soi a fait réagir l’autre.', cout: 2 },
  { id: 'lot-jour', nom: 'Lot Découverte du jour supplémentaire', description: 'Au-delà du lot gratuit (2-3 suggestions avec leur raison).', cout: 2 },
  { id: 'activite-deux', nom: 'Activité guidée à deux', description: 'Pendant la rencontre — récompenses « récoltes à deux » consenties.', cout: 5, note: 'montant [À VALIDER]' },
];

export const PHARES_FANAL =
  'Les fonctions phares — voir qui t’a aimé, les filtres avancés, l’analyse approfondie — restent au Fanal, l’abonnement : jamais goûtables à la Luciole (D19).';

export const NOTE_DEPENSES =
  'Ces dépenses vivent dans le volet rencontre — des accès premium sur des laps de temps définis. Le voyage ne dépense jamais de Lucioles : il ne fait que les nourrir.';

export const DOCTRINE_LUCIOLES =
  'Les Lucioles se gagnent en voyageant — jamais vendues (D6). Aucun pack de crédits, à aucun moment.';

export const MONDES_PAYANTS_NOTE =
  'Les mondes payants s’ouvrent au forfait ou au parrainage — jamais à la Luciole. Paliers de parrainage (décision du fondateur) : 3 filleuls actifs ouvrent le Monde 8, 5 filleuls actifs ouvrent le Monde 10 — le site grandit par les personnes qu’il rassemble.';

export const NOTE_CALIBRAGE =
  'Montants = point de départ à calibrer avec des données réelles (D14). Plafond de sécurité : 120/mois. Pas d’expiration.';

export const NOTE_DECISION =
  'L’achat de crédits a été retiré sur ta décision : la doctrine « les Lucioles ne se vendent jamais » (D6/D11) est rétablie et gravée. Le parrainage, lui, est adopté — avec son double effet : Lucioles + déblocage des mondes du forfait.';

/* -------------------------------------------------------------------------- */
/* LE LEDGER — dérivé des événements RÉELS du voyage. Aucune entrée inventée.  */
/* -------------------------------------------------------------------------- */

/** Ce qu'un monde a produit (calculé par Recolte.tsx depuis recolteMondes —
 *  la MÊME source que tous les onglets : aucun double comptage possible). */
export interface EntreeMonde {
  code: string;
  num: number;
  nom: string;
  /** Le monde est clôturé (toutes ses quêtes terminées). */
  clos: boolean;
  /** La date réelle de clôture (derniereA). */
  dateCloture: string | null;
  nbCartes: number;
  nbEcrans: number;
}

/** Une ligne de Lucioles gagnées — lisible ligne à ligne. */
export interface LigneLucioles {
  id: string;
  genre: 'monde' | 'carte' | 'ecran' | 'jalon';
  libelle: string;
  detail?: string;
  montant: number;
  /** null = hors monde (les jalons). */
  mondeCode: string | null;
  /** ISO — null = non daté. */
  date: string | null;
}

/** Le jalon atteint (La Carte à la 1re carte, Le Miroir à la 3e — échelle
 *  réelle du voyage ; les suivants s'ouvriront avec les mondes à venir). */
function jalonsAtteints(cartes: number): LigneLucioles[] {
  const lignes: LigneLucioles[] = [];
  if (cartes >= 1) {
    lignes.push({
      id: 'jalon-1',
      genre: 'jalon',
      libelle: 'Jalon 1 · La Carte',
      detail: 'Ton voyage a produit ta première carte.',
      montant: 5,
      mondeCode: null,
      date: null,
    });
  }
  if (cartes >= 3) {
    lignes.push({
      id: 'jalon-2',
      genre: 'jalon',
      libelle: 'Jalon 2 · Le Miroir',
      detail: 'Ta vitrine de 3 cartes est prête, tes filtres forts sont actifs.',
      montant: 5,
      mondeCode: null,
      date: null,
    });
  }
  return lignes;
}

export interface Economie {
  /** LE SOLDE — la somme ligne à ligne de tout ce qui est actif. */
  solde: number;
  /** Les gains PAR MONDE (du monde 1 au dernier livré) — le registre groupé. */
  lignesParMonde: LigneLucioles[];
  /** Les jalons (hors monde). */
  jalons: LigneLucioles[];
  mondesClos: number;
  cartes: number;
  ecrans: number;
}

/** Le calcul COMPLET — appelé par Recolte.tsx avec la récolte réelle par
 *  monde. Chaque Luciole vient d'un événement daté du voyage : le registre
 *  est lisible ligne à ligne, comme un relevé. */
export function calculerEconomie(entrees: EntreeMonde[]): Economie {
  const lignes: LigneLucioles[] = [];
  for (const m of entrees) {
    if (m.clos) {
      lignes.push({
        id: `monde-${m.code}`,
        genre: 'monde',
        libelle: `Monde ${m.num} · ${m.nom} — clôturé`,
        detail: 'Le gain marquant du voyage : le sceau est posé, une pièce de plus dans ton portrait.',
        montant: 5,
        mondeCode: m.code,
        date: m.dateCloture,
      });
    }
    for (let i = 0; i < m.nbCartes; i++) {
      lignes.push({
        id: `cartes-${m.code}-${i}`,
        genre: 'carte',
        libelle: 'Quête avec carte terminée',
        detail: '+2 à chaque — elles s’accumulent sans bruit.',
        montant: 2,
        mondeCode: m.code,
        date: null,
      });
    }
    for (let i = 0; i < m.nbEcrans; i++) {
      lignes.push({
        id: `ecrans-${m.code}-${i}`,
        genre: 'ecran',
        libelle: 'Écran de passage franchi',
        detail: 'Des étapes sans carte — elles font avancer, et elles paient.',
        montant: 1,
        mondeCode: m.code,
        date: null,
      });
    }
  }
  const jalons = jalonsAtteints(entrees.reduce((n, m) => n + m.nbCartes, 0));
  const toutes = [...lignes, ...jalons];
  return {
    solde: toutes.reduce((total, l) => total + l.montant, 0),
    lignesParMonde: lignes,
    jalons,
    mondesClos: entrees.filter((m) => m.clos).length,
    cartes: entrees.reduce((n, m) => n + m.nbCartes, 0),
    ecrans: entrees.reduce((n, m) => n + m.nbEcrans, 0),
  };
}

/* -------------------------------------------------------------------------- */
/* LES DEUX PORTES à solde épuisé — doctrine v2 (l'achat est retiré sur       */
/* décision du fondateur : les Lucioles ne se vendent jamais). La porte        */
/* voyage pointe le VRAI voyage (#/mondes) ; la porte parrainage porte les     */
/* paliers validés (3 filleuls → M8, 5 filleuls → M10).                        */
/* -------------------------------------------------------------------------- */

export interface PorteZero {
  id: 'voyage' | 'parrainage';
  titre: string;
  description: string;
  cta: string;
  /** '#' pour la porte voyage (lien réel), null pour le parrainage (à brancher). */
  href: string | null;
  badge?: string;
}

export const PORTES_ZERO: PorteZero[] = [
  {
    id: 'voyage',
    titre: 'Tu continues le voyage',
    description:
      'Les gains reviennent naturellement : quêtes, écrans de passage, mondes clôturés, jalons. Le voyage paie toujours.',
    cta: 'Continuer le voyage',
    href: '#/mondes',
  },
  {
    id: 'parrainage',
    titre: 'Tu invites — le parrainage',
    description:
      'Ton lien amène une personne à s’inscrire : quand elle termine le monde 1, tu reçois des Lucioles (+8) — et elle démarre avec un bonus. Paliers (décision du fondateur) : 3 filleuls actifs ouvrent le Monde 8, 5 filleuls actifs ouvrent le Monde 10.',
    cta: 'Obtenir mon lien',
    href: null,
    badge: 'DÉCISION DU FONDATEUR',
  },
];
