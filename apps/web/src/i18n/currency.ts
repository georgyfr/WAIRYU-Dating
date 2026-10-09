/**
 * La DEVISE (i18n financier Wairyu) — un seul module pour :
 *  1. le catalogue des devises supportées (taux fixes éditoriaux, arrondis) ;
 *  2. la détection automatique depuis la langue/région du navigateur ;
 *  3. le formatage NARRATIF des montants des quêtes (base EUR — le Livrable
 *     écrit « 120 € » ; le rendu adapte devise + montant à l'utilisateur) ;
 *  4. le catalogue PRIX PREMIUM par devise — le contrat qui servira tel quel
 *     à l'intégration des paiements (mode premium) : `prixPremium(offre, code)`
 *     + `formaterPrixFacturation(montant, code, lang)`. Les prix sont des
 *     POINTS DE PRIX psychologiques par marché (9,99 € · $10.99 · 5 900 FCFA
 *     · 99 DH…), PAS une conversion mécanique — c'est eux qui feront foi
 *     chez le PSP (Stripe / Wave / Mobile Money), pas les taux narratifs.
 *
 * PRINCIPE NARRATIF : les contenus du Livrable restent VERBATIM en base EUR
 * (`{m:120}` dans les fichiers de quête) ; la conversion se fait AU RENDU :
 * 120 € → « 78 500 FCFA » · « $130 » · « £105 » — arrondis propres par devise
 * (jamais 78 714,63 FCFA dans une phrase). Les taux sont des constantes
 * ÉDITORIALES (stables, révisables à la main) — PAS un taux de change live.
 *
 * Aucune devise n'est jamais rendue pour ce qui n'est pas un montant : le
 * module ne touche à rien d'autre que l'affichage financier.
 */

export type CurrencyCode =
  | 'EUR'
  | 'USD'
  | 'GBP'
  | 'CHF'
  | 'CAD'
  | 'MAD'
  | 'DZD'
  | 'TND'
  | 'XAF'
  | 'XOF'
  | 'CDF'
  | 'GNF'
  | 'NGN'
  | 'AED';

export interface DeviseInfo {
  code: CurrencyCode;
  /** Taux fixe éditorial : 1 EUR = taux (devise). Révisable à la main. */
  taux: number;
  /** Arrondi narratif (à l'unité la plus proche) : 1 · 5 · 10 · 100 · 500 · 1000. */
  arrondi: number;
  /** Libellé natif pour le sélecteur de l'écran Profil. */
  label: { fr: string; en: string };
  /** Décimales de FACTURATION (premium) — 0 pour les devises à sous-unité
   *  non utilisée (FCFA, naira…), 2 sinon. */
  decimalesFacturation: 0 | 2;
}

/** Le catalogue — ordre d'affichage du sélecteur (EUR d'abord : marque FR). */
export const DEVISES: readonly DeviseInfo[] = [
  { code: 'EUR', taux: 1, arrondi: 1, label: { fr: 'Euro (€)', en: 'Euro (€)' }, decimalesFacturation: 2 },
  { code: 'USD', taux: 1.09, arrondi: 5, label: { fr: 'Dollar américain ($)', en: 'US Dollar ($)' }, decimalesFacturation: 2 },
  { code: 'GBP', taux: 0.86, arrondi: 5, label: { fr: 'Livre sterling (£)', en: 'British Pound (£)' }, decimalesFacturation: 2 },
  { code: 'CHF', taux: 0.94, arrondi: 5, label: { fr: 'Franc suisse (CHF)', en: 'Swiss Franc (CHF)' }, decimalesFacturation: 2 },
  { code: 'CAD', taux: 1.47, arrondi: 5, label: { fr: 'Dollar canadien ($ CA)', en: 'Canadian Dollar (CA$)' }, decimalesFacturation: 2 },
  { code: 'MAD', taux: 10.6, arrondi: 5, label: { fr: 'Dirham marocain (DH)', en: 'Moroccan Dirham (MAD)' }, decimalesFacturation: 2 },
  { code: 'DZD', taux: 146, arrondi: 100, label: { fr: 'Dinar algérien (DA)', en: 'Algerian Dinar (DZD)' }, decimalesFacturation: 2 },
  { code: 'TND', taux: 3.4, arrondi: 5, label: { fr: 'Dinar tunisien (DT)', en: 'Tunisian Dinar (TND)' }, decimalesFacturation: 2 },
  { code: 'XAF', taux: 655.957, arrondi: 500, label: { fr: 'Franc CFA (FCFA)', en: 'Central African CFA (FCFA)' }, decimalesFacturation: 0 },
  { code: 'XOF', taux: 655.957, arrondi: 500, label: { fr: 'Franc CFA (F CFA)', en: 'West African CFA (CFA)' }, decimalesFacturation: 0 },
  { code: 'CDF', taux: 3100, arrondi: 500, label: { fr: 'Franc congolais (FC)', en: 'Congolese Franc (CDF)' }, decimalesFacturation: 0 },
  { code: 'GNF', taux: 9350, arrondi: 1000, label: { fr: 'Franc guinéen (FG)', en: 'Guinean Franc (GNF)' }, decimalesFacturation: 0 },
  { code: 'NGN', taux: 1650, arrondi: 500, label: { fr: 'Naira (₦)', en: 'Nigerian Naira (₦)' }, decimalesFacturation: 0 },
  { code: 'AED', taux: 4.0, arrondi: 5, label: { fr: 'Dirham des Émirats (AED)', en: 'UAE Dirham (AED)' }, decimalesFacturation: 2 },
];

const PAR_CODE: Record<CurrencyCode, DeviseInfo> = Object.fromEntries(
  DEVISES.map((d) => [d.code, d]),
) as Record<CurrencyCode, DeviseInfo>;

/** Région → devise (détection au premier lancement). Par défaut : EUR. */
const REGION_DEVISE: Record<string, CurrencyCode> = {
  FR: 'EUR', BE: 'EUR', MC: 'EUR', LU: 'EUR',
  US: 'USD',
  GB: 'GBP',
  CH: 'CHF',
  CA: 'CAD',
  MA: 'MAD',
  DZ: 'DZD',
  TN: 'TND',
  CM: 'XAF', CF: 'XAF', TD: 'XAF', CG: 'XAF', GQ: 'XAF', GA: 'XAF',
  SN: 'XOF', CI: 'XOF', ML: 'XOF', BF: 'XOF', BJ: 'XOF', TG: 'XOF', NE: 'XOF', GW: 'XOF',
  CD: 'CDF',
  GN: 'GNF',
  NG: 'NGN',
  AE: 'AED',
};

/** Détecte la devise depuis la région du navigateur (fr-FR → EUR, en-CA → CAD…). */
export function detecterDevise(): CurrencyCode {
  try {
    const tag = navigator.language || 'fr';
    let region: string | undefined;
    const loc = new Intl.Locale(tag);
    region = loc.region ?? undefined;
    if (!region && tag.includes('-')) region = tag.split('-')[1];
    if (region && REGION_DEVISE[region.toUpperCase()]) return REGION_DEVISE[region.toUpperCase()];
  } catch {
    /* Intl.Locale indisponible — défaut ci-dessous */
  }
  return 'EUR';
}

/** Arrondi narratif propre : à l'unité d'arrondi de la devise. */
function arrondirNarratif(valeur: number, unite: number): number {
  if (unite <= 1) return Math.round(valeur);
  return Math.round(valeur / unite) * unite;
}

/** Locale de formatage par langue (le symbole suit la langue de l'app). */
export function localeDevise(lang: 'fr' | 'en'): string {
  return lang === 'en' ? 'en-IE' : 'fr-FR';
}

/**
 * Le MONTANT NARRATIF — convertit un montant de base EUR du Livrable vers la
 * devise de l'utilisateur avec un arrondi propre, formaté dans la langue.
 * Ex. : formaterMontantNarratif(120, 'XAF', 'fr') → « 78 500 FCFA »
 *       formaterMontantNarratif(120, 'USD', 'en') → « $130 »
 */
export function formaterMontantNarratif(eur: number, code: CurrencyCode, lang: 'fr' | 'en'): string {
  const d = PAR_CODE[code] ?? PAR_CODE.EUR;
  const valeur = arrondirNarratif(eur * d.taux, d.arrondi);
  try {
    return new Intl.NumberFormat(localeDevise(lang), {
      style: 'currency',
      currency: d.code,
      maximumFractionDigits: 0,
    }).format(valeur);
  } catch {
    return `${valeur} ${d.code}`;
  }
}

// --------------------------------------------------------------- prix premium
// Le contrat des paiements (mode premium — à venir). Aucun écran n'y touche
// encore (zéro teaser premium) ; l'intégration PSP lira PRIX_PREMIUM tel quel.

/** Les offres premium prévues par la doctrine (6 mondes gratuits / 5 premium). */
export type OffrePremium = 'mensuel' | 'annuel';

/**
 * Points de prix PSYCHOLOGIQUES par devise et par offre — la source de vérité
 * de la facturation future (PSP). Absence de devise → repli EUR.
 */
export const PRIX_PREMIUM: Record<OffrePremium, Partial<Record<CurrencyCode, number>>> = {
  mensuel: {
    EUR: 9.99, USD: 10.99, GBP: 8.99, CHF: 10.9, CAD: 13.99, AED: 39.9,
    MAD: 99, DZD: 1450, TND: 29.9, XAF: 5900, XOF: 5900, CDF: 28500, GNF: 89000, NGN: 14900,
  },
  annuel: {
    EUR: 79.9, USD: 89.9, GBP: 74.9, CHF: 84.9, CAD: 119.9, AED: 349,
    MAD: 790, DZD: 11500, TND: 239, XAF: 49900, XOF: 49900, CDF: 235000, GNF: 690000, NGN: 119000,
  },
};

/** Le prix de facturation d'une offre dans une devise (repli EUR documenté). */
export function prixPremium(offre: OffrePremium, code: CurrencyCode): number {
  const prix = PRIX_PREMIUM[offre][code] ?? PRIX_PREMIUM[offre].EUR;
  return prix ?? PRIX_PREMIUM[offre].EUR!;
}

/**
 * Le prix de FACTURATION formaté (premium — contraste avec le narratif :
 * décimales des marchés, jamais d'arrondi caché).
 * Ex. : formaterPrixFacturation('mensuel', 'EUR', 'fr') → « 9,99 € »
 *       formaterPrixFacturation('mensuel', 'XAF', 'fr') → « 5 900 FCFA »
 */
export function formaterPrixFacturation(offre: OffrePremium, code: CurrencyCode, lang: 'fr' | 'en'): string {
  const d = PAR_CODE[code] ?? PAR_CODE.EUR;
  const montant = prixPremium(offre, d.code);
  try {
    return new Intl.NumberFormat(localeDevise(lang), {
      style: 'currency',
      currency: d.code,
      minimumFractionDigits: d.decimalesFacturation,
      maximumFractionDigits: d.decimalesFacturation,
    }).format(montant);
  } catch {
    return `${montant} ${d.code}`;
  }
}
