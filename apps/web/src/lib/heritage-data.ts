/**
 * Données du Profil d'Héritage (Task 52) — listes de SUGGESTIONS + libellés.
 *
 * Principes (identiques à Task 38 — Coach/Défis Cultures) :
 *  - Pédagogie produit : les chips de suggestion sont des PROPOSITIONS
 *    courantes, l'utilisateur peut toujours saisir une valeur libre
 *    (aucune case fermée, aucune culture « manquante de la liste ») ;
 *  - Les listes couvrent des univers larges et réels (langues, fêtes,
 *    cuisines, musiques) — rien d'inventé, rien d'exclusif ;
 *  - Tous les libellés FR des énumérations partagées vivent ICI (le seul
 *    endroit), comme LABELS pour les modes/intentions.
 */
import type { HeritageLangLevel, HeritageProfile } from '@wairyu/shared';

// ---------- Suggestions (valeurs libres toujours possibles) ----------

/** Langues les plus parlées par la communauté + langues mondiales majeures. */
export const LANGUES: string[] = [
  'Français', 'Anglais', 'Espagnol', 'Portugais', 'Arabe', 'Berbère',
  'Swahili', 'Lingala', 'Wolof', 'Bambara', 'Peul', 'Haoussa', 'Yorouba',
  'Igbo', 'Amharique', 'Zoulou', 'Créole', 'Malgache', 'Mandarin',
  'Cantonais', 'Hindi', 'Ourdou', 'Bengali', 'Turc', 'Russe', 'Polonais',
  'Roumain', 'Allemand', 'Néerlandais', 'Italien', 'Grec', 'Hébreu',
  'Persan', 'Vietnamien', 'Thaï', 'Indonésien', 'Tagalog', 'Japonais',
  'Coréen',
];

/** Fêtes et célébrations courantes (multi-traditions, aucun ordre implicite). */
export const FETES: string[] = [
  'Noël', 'Pâques', 'Aïd el-Fitr', 'Aïd el-Adha', 'Tabaski', 'Ramadan',
  'Nouvel An', 'Nouvel An chinois', 'Têt', 'Diwali', 'Hanoukka', 'Kwanzaa',
  'Toussaint', 'Fête des mères',
];

/** Cuisines du monde — suggestions larges (le plat signature reste libre). */
export const CUISINES: string[] = [
  'Africaine', 'Camerounaise', 'Sénégalaise', 'Ivoirienne', 'Nigérianne',
  'Maghrébine', 'Française', 'Italienne', 'Espagnole', 'Portugaise',
  'Créole', 'Caribéenne', 'Libanaise', 'Turque', 'Indienne', 'Chinoise',
  'Japonaise', 'Thaïlandaise', 'Vietnamienne', 'Mexicaine', 'Brésilienne',
  'Américaine', 'Fusion',
];

/** Musiques — des rythmes de la communauté aux grands courants mondiaux. */
export const MUSIQUES: string[] = [
  'Afrobeats', 'Amapiano', 'Coupé-décalé', 'Makossa', 'Bikutsi', 'Rumba',
  'Zouk', 'Kompa', 'Salsa', 'Bachata', 'Reggae', 'Dancehall', 'Raï',
  'Gospel', 'Jazz', 'Blues', 'Hip-hop', 'R&B', 'Pop', 'Rock', 'Funk',
  'Techno', 'Classique', 'Musique arabe', 'K-pop',
];

// ---------- Libellés FR des énumérations ----------

export const HERITAGE_LABELS = {
  langLevel: {
    a1a2: 'Débutant (A1-A2)',
    b1b2: 'Intermédiaire (B1-B2)',
    c1: 'Courant (C1)',
    c2: 'Bilingue / natif (C2)',
  } satisfies Record<HeritageLangLevel, string>,
  /** Titre court pour le résumé public (« Anglais (courant) » côté API). */
  langLevelShort: {
    a1a2: 'débutant',
    b1b2: 'intermédiaire',
    c1: 'courant',
    c2: 'natif',
  } satisfies Record<HeritageLangLevel, string>,
  preference: {
    peu_importe: 'Peu importe',
    ma_langue: 'Ma langue',
    langue_commune: 'Une langue commune',
    langue_autre: 'La langue de l\u2019autre',
  },
  relationInterculturelle: {
    activement: 'Oui, activement',
    si_affinites: 'Oui, si affinités',
    non: 'Non',
  },
  relationDistance: {
    oui: 'Oui',
    non: 'Non',
    peut_etre: 'Peut-être',
  },
  rapportTradition: {
    tres_important: 'Très important',
    important: 'Important',
    peu_important: 'Peu important',
    aucun: 'Aucun',
  },
  placeFamille: {
    centrale: 'Centrale',
    importante: 'Importante',
    secondaire: 'Secondaire',
  },
  rapportReligion: {
    croyant_pratiquant: 'Croyant pratiquant',
    croyant_non_pratiquant: 'Croyant non pratiquant',
    spirituel: 'Spirituel',
    athe: 'Athée',
    prefere_pas_dire: 'Préfère ne pas dire',
  },
  roleAines: {
    tres_important: 'Très important',
    important: 'Important',
    peu_important: 'Peu important',
  },
  educationEnfants: {
    stricte: 'Stricte',
    equilibree: 'Équilibrée',
    libre: 'Libre',
  },
  roleCouple: {
    traditionnel: 'Traditionnel',
    egalitaire: 'Égalitaire',
    flexible: 'Flexible',
  },
  enfants: {
    oui: 'Oui',
    non: 'Non',
    peut_etre: 'Peut-être',
  },
  educationBiculturelle: {
    biculturelle: 'Biculturelle',
    locale: 'Locale',
    internationale: 'Internationale',
  },
  lieuDeVie: {
    pays_origine: 'Pays d\u2019origine',
    pays_autre: 'Pays de l\u2019autre',
    pays_tiers: 'Un pays tiers',
    peu_importe: 'Peu importe',
  },
  mobilite: {
    pret_demenager: 'Prêt·e à déménager',
    enracine: 'Enraciné·e',
    flexible: 'Flexible',
  },
} as const;

// ---------- Sections (ordre + libellés de l'écran) ----------

/** Les 7 sections de la spec — « minimum 3, standard 5, complet 7 ». */
export const HERITAGE_SECTIONS: {
  key: keyof HeritageProfile;
  icon: string;
  title: string;
  sub: string;
}[] = [
  { key: 'langues', icon: '🗣️', title: 'Langues', sub: 'Parler, comprendre, apprendre' },
  { key: 'origines', icon: '🌍', title: 'Origines', sub: 'D\u2019où viennent toi et ta famille' },
  { key: 'ouverture', icon: '✈️', title: 'Ouverture', sub: 'Envie d\u2019apprendre, de voyager, de s\u2019adapter' },
  { key: 'traditions', icon: '🎉', title: 'Traditions', sub: 'Fêtes, rituels, ce qui se transmet' },
  { key: 'valeurs', icon: '💛', title: 'Valeurs', sub: 'Famille, spiritualité, équilibre — privé' },
  { key: 'projets', icon: '🌱', title: 'Projets', sub: 'La vie que tu imagines — privé' },
  { key: 'affinites', icon: '🍲', title: 'Affinités', sub: 'Cuisine, musique, arts — points communs' },
];

/** Nombre de champs RENSEIGNÉS d'une section (pour la progression honnête). */
export function sectionFilled(h: HeritageProfile, key: keyof HeritageProfile): number {
  const s = h[key] as Record<string, unknown> | undefined;
  if (!s) return 0;
  let n = 0;
  for (const v of Object.values(s)) {
    if (v === undefined || v === null) continue;
    if (Array.isArray(v)) {
      if (v.length > 0) n++;
    } else if (typeof v === 'string' && v.trim() === '') {
      // vide
    } else {
      n++;
    }
  }
  return n;
}
