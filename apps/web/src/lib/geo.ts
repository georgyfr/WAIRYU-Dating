/**
 * Drapeaux & continents (mode Interracial — enrichissement « dating »).
 *
 * Le pays est un libellé libre (géocodage inverse OSM ou saisie manuelle) :
 * on normalise (minuscules, sans accents) puis on cherche dans la table.
 * Les noms FR **et** EN sont couverts (Nominatim peut répondre dans les deux).
 * Le drapeau est dérivé de l'indicatif ISO 3166-1 alpha-2 (emoji régionaux) —
 * zéro image, zéro requête réseau.
 *
 * Un pays absent de la table → drapeau 🌍 générique + continent inconnu
 * (l'UI n'affiche alors que le libellé du pays, jamais une mauvaise donnée).
 */

export interface CountryMeta {
  /** Code ISO 3166-1 alpha-2 (dérive du drapeau). */
  code: string;
  /** Continent en français. */
  continent: string;
  /** Noms normalisés connus (FR + EN). */
  names: string[];
}

export const CONTINENTS = [
  'Afrique',
  'Europe',
  'Amérique du Nord',
  'Amérique du Sud',
  'Asie',
  'Océanie',
] as const;

const C: CountryMeta[] = [
  // --- Afrique ---
  { code: 'CM', continent: 'Afrique', names: ['cameroun', 'cameroon'] },
  { code: 'CI', continent: 'Afrique', names: ["côte d'ivoire", "cote d'ivoire", 'ivory coast'] },
  { code: 'GA', continent: 'Afrique', names: ['gabon'] },
  { code: 'CG', continent: 'Afrique', names: ['congo', 'république du congo', 'republic of the congo'] },
  { code: 'CD', continent: 'Afrique', names: ['république démocratique du congo', 'democratic republic of the congo', 'rd congo', 'dr congo'] },
  { code: 'SN', continent: 'Afrique', names: ['sénégal', 'senegal'] },
  { code: 'NG', continent: 'Afrique', names: ['nigeria'] },
  { code: 'GH', continent: 'Afrique', names: ['ghana'] },
  { code: 'ML', continent: 'Afrique', names: ['mali'] },
  { code: 'BF', continent: 'Afrique', names: ['burkina faso'] },
  { code: 'BJ', continent: 'Afrique', names: ['bénin', 'benin'] },
  { code: 'TG', continent: 'Afrique', names: ['togo'] },
  { code: 'NE', continent: 'Afrique', names: ['niger'] },
  { code: 'TD', continent: 'Afrique', names: ['tchad', 'chad'] },
  { code: 'GN', continent: 'Afrique', names: ['guinée', 'guinea'] },
  { code: 'MA', continent: 'Afrique', names: ['maroc', 'morocco'] },
  { code: 'DZ', continent: 'Afrique', names: ['algérie', 'algeria'] },
  { code: 'TN', continent: 'Afrique', names: ['tunisie', 'tunisia'] },
  { code: 'EG', continent: 'Afrique', names: ['égypte', 'egypt'] },
  { code: 'ZA', continent: 'Afrique', names: ['afrique du sud', 'south africa'] },
  { code: 'KE', continent: 'Afrique', names: ['kenya'] },
  { code: 'ET', continent: 'Afrique', names: ['éthiopie', 'ethiopia'] },
  { code: 'MG', continent: 'Afrique', names: ['madagascar'] },
  { code: 'RW', continent: 'Afrique', names: ['rwanda'] },
  { code: 'AO', continent: 'Afrique', names: ['angola'] },
  { code: 'TZ', continent: 'Afrique', names: ['tanzanie', 'tanzania'] },
  { code: 'UG', continent: 'Afrique', names: ['ouganda', 'uganda'] },
  // --- Europe ---
  { code: 'FR', continent: 'Europe', names: ['france'] },
  { code: 'BE', continent: 'Europe', names: ['belgique', 'belgium'] },
  { code: 'CH', continent: 'Europe', names: ['suisse', 'switzerland'] },
  { code: 'LU', continent: 'Europe', names: ['luxembourg'] },
  { code: 'MC', continent: 'Europe', names: ['monaco'] },
  { code: 'DE', continent: 'Europe', names: ['allemagne', 'germany'] },
  { code: 'ES', continent: 'Europe', names: ['espagne', 'spain'] },
  { code: 'IT', continent: 'Europe', names: ['italie', 'italy'] },
  { code: 'PT', continent: 'Europe', names: ['portugal'] },
  { code: 'NL', continent: 'Europe', names: ['pays-bas', 'pays bas', 'netherlands'] },
  { code: 'GB', continent: 'Europe', names: ['royaume-uni', 'royaume uni', 'united kingdom', 'angleterre', 'england'] },
  { code: 'IE', continent: 'Europe', names: ['irlande', 'ireland'] },
  { code: 'AT', continent: 'Europe', names: ['autriche', 'austria'] },
  { code: 'PL', continent: 'Europe', names: ['pologne', 'poland'] },
  { code: 'RO', continent: 'Europe', names: ['roumanie', 'romania'] },
  { code: 'SE', continent: 'Europe', names: ['suède', 'suede', 'sweden'] },
  { code: 'NO', continent: 'Europe', names: ['norvège', 'norvege', 'norway'] },
  { code: 'DK', continent: 'Europe', names: ['danemark', 'denmark'] },
  { code: 'FI', continent: 'Europe', names: ['finlande', 'finland'] },
  { code: 'GR', continent: 'Europe', names: ['grèce', 'grece', 'greece'] },
  { code: 'RU', continent: 'Europe', names: ['russie', 'russia'] },
  { code: 'UA', continent: 'Europe', names: ['ukraine'] },
  // --- Amériques ---
  { code: 'CA', continent: 'Amérique du Nord', names: ['canada'] },
  { code: 'US', continent: 'Amérique du Nord', names: ['états-unis', 'etats-unis', 'united states', 'usa', 'usa'] },
  { code: 'MX', continent: 'Amérique du Nord', names: ['mexique', 'mexico', 'mexico (country)'] },
  { code: 'HT', continent: 'Amérique du Nord', names: ['haïti', 'haiti'] },
  { code: 'JM', continent: 'Amérique du Nord', names: ['jamaïque', 'jamaica'] },
  { code: 'CU', continent: 'Amérique du Nord', names: ['cuba'] },
  { code: 'DO', continent: 'Amérique du Nord', names: ['république dominicaine', 'dominican republic'] },
  { code: 'BR', continent: 'Amérique du Sud', names: ['brésil', 'bresil', 'brazil'] },
  { code: 'AR', continent: 'Amérique du Sud', names: ['argentine', 'argentina'] },
  { code: 'CO', continent: 'Amérique du Sud', names: ['colombie', 'colombia'] },
  { code: 'CL', continent: 'Amérique du Sud', names: ['chili', 'chile'] },
  { code: 'PE', continent: 'Amérique du Sud', names: ['pérou', 'perou', 'peru'] },
  { code: 'VE', continent: 'Amérique du Sud', names: ['venezuela'] },
  { code: 'UY', continent: 'Amérique du Sud', names: ['uruguay'] },
  { code: 'EC', continent: 'Amérique du Sud', names: ['équateur', 'equateur', 'ecuador'] },
  // --- Asie ---
  { code: 'TR', continent: 'Asie', names: ['turquie', 'turkey', 'türkiye'] },
  { code: 'LB', continent: 'Asie', names: ['liban', 'lebanon'] },
  { code: 'SA', continent: 'Asie', names: ['arabie saoudite', 'saudi arabia'] },
  { code: 'AE', continent: 'Asie', names: ['émirats arabes unis', 'emirats arabes unis', 'united arab emirates', 'uae', 'dubai'] },
  { code: 'IN', continent: 'Asie', names: ['inde', 'india'] },
  { code: 'CN', continent: 'Asie', names: ['chine', 'china'] },
  { code: 'JP', continent: 'Asie', names: ['japon', 'japan'] },
  { code: 'KR', continent: 'Asie', names: ['corée du sud', 'coree du sud', 'south korea', 'korea'] },
  { code: 'VN', continent: 'Asie', names: ['vietnam', 'viêt nam'] },
  { code: 'TH', continent: 'Asie', names: ['thaïlande', 'thailande', 'thailand'] },
  { code: 'PH', continent: 'Asie', names: ['philippines'] },
  { code: 'ID', continent: 'Asie', names: ['indonésie', 'indonesie', 'indonesia'] },
  { code: 'IL', continent: 'Asie', names: ['israël', 'israel'] },
  // --- Océanie ---
  { code: 'AU', continent: 'Océanie', names: ['australie', 'australia'] },
  { code: 'NZ', continent: 'Océanie', names: ['nouvelle-zélande', 'nouvelle zelande', 'new zealand'] },
];

/** Indicatif → emoji drapeau (regional indicator symbols). */
export function flagFromCode(code: string): string {
  if (!/^[A-Za-z]{2}$/.test(code)) return '🌍';
  return String.fromCodePoint(
    ...code
      .toUpperCase()
      .split('')
      .map((ch) => 0x1f1e6 + ch.charCodeAt(0) - 65),
  );
}

/** Normalise un libellé pays : minuscules, accents retirés, espaces compactés. */
function normalizeCountry(raw: string): string {
  return raw
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ');
}

const INDEX = new Map<string, CountryMeta>();
for (const meta of C) for (const n of meta.names) INDEX.set(n, meta);

/**
 * Méta d'un pays (libellé libre) : drapeau + continent — null si inconnu.
 * Tolère les préfixes (« Paris, France » → dernier segment).
 */
export function countryMeta(raw: string | null | undefined): { flag: string; continent: string; code: string } | null {
  if (!raw) return null;
  const label = normalizeCountry(raw);
  if (INDEX.has(label)) {
    const m = INDEX.get(label)!;
    return { flag: flagFromCode(m.code), continent: m.continent, code: m.code };
  }
  // Dernier segment après virgule (« Yaoundé, Cameroun »).
  const last = label.split(',').pop()?.trim() ?? '';
  if (last && INDEX.has(last)) {
    const m = INDEX.get(last)!;
    return { flag: flagFromCode(m.code), continent: m.continent, code: m.code };
  }
  return null;
}

/** « 5079 » → « 5 079 » (espace fine insécable comme séparateur de milliers). */
export function formatKm(km: number): string {
  return km.toLocaleString('fr-FR').replace(/\u202f|\u00a0/g, ' ');
}
