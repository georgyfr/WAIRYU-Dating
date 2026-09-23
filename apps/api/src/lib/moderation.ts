/**
 * Modération automatique par règles (Étape 7, plan 7.2) — 0 neuron.
 *
 * Score de risque 0-100 calculé sur CHAQUE message texte AVANT livraison
 * (dans le DO ChatRoom) :
 *   - risque < SAFETY.flagRisk       → 'deliver' (livré, aucun flag) ;
 *   - flagRisk ≤ risque < blockRisk  → 'flag'    (livré MAIS file de modération) ;
 *   - risque ≥ SAFETY.blockRisk      → 'block'   (refusé, ni livré ni persisté).
 *
 * Familles de règles :
 *   - haine / insultes graves (FR + EN, listes de mots à frontières) ;
 *   - harcèlement / menaces (phrases) ;
 *   - drogues (vente) ;
 *   - patterns SCAM : liens externes, crypto/trading, demandes d'argent,
 *     contacts externes (WhatsApp/Telegram/Snap), numéros de téléphone.
 *
 * Normalisation : minuscules, accents retirés, leet inversé (@→a, 0→o, 1→i,
 * 3→e, $→s, 5→s, 7→t), répétitions de lettres réduites (heyyy→hey) — les
 * arnaqueurs écrivent « wh@tsapp », « bitc0in », « paypaaaal ».
 * Les faux positifs sont bornés : frontières de mots + phrases complètes
 * pour les demandes d'argent (le mot « argent » seul ne déclenche rien).
 */
import { SAFETY } from '@wairyu/shared';
import type { ModerationVerdict } from '@wairyu/shared';

/** Normalisation résistante au leet/accents/répétitions. */
function normalize(input: string): string {
  let s = input.toLowerCase();
  // Accents (NFD puis suppression des diacritiques)
  s = s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  // Leet le plus courant
  s = s
    .replace(/[@]/g, 'a')
    .replace(/\$/g, 's')
    .replace(/0/g, 'o')
    .replace(/1/g, 'i')
    .replace(/3/g, 'e')
    .replace(/5/g, 's')
    .replace(/7/g, 't');
  // Répétitions (paaaal → pal) — garde 2 lettres pour préserver les mots réels
  s = s.replace(/(.)\1{2,}/g, '$1$1');
  // Espaces multiples
  s = s.replace(/\s+/g, ' ').trim();
  return s;
}

/**
 * Insultes / haine (FR + EN) — liste volontairement courte et non ambiguë
 * (les insultes légères passent : la modération humaine tranche via flags).
 */
const HATE_WORDS = [
  // FR — insultes graves
  'encule', 'enculé', 'batard', 'bâtard', 'salope', 'pute', 'pd ', ' tpd', 'negre', 'nègre',
  'bougnoule', 'chinetoque', 'bamboula', 'mamelle', 'fils de pute', 'ntm', 'nique ta',
  'vas mourir', 'va mourir', 'creve', 'crève', 'gaze les', 'chambre a gaz',
  // EN
  'faggot', 'n1gger', 'nigger', 'nigga', 'retard ', 'whore', 'slut', 'kys',
];

/** Harcèlement / menaces — phrases complètes. */
const HARASSMENT_PHRASES = [
  'je sais ou tu habites', 'je sais où tu habites', 'je vais te trouver',
  'je vais te casser', 'je vais te frapper', 'tu vas regretter',
  'donne ton adresse', 'tu vas payer', 'i will find you', 'i know where you live',
];

/** Drogues (contexte vente — pas la consommation). */
const DRUG_WORDS = [
  'cocaine', 'coke a', 'heroine', 'héroïne', 'crack', 'meth', 'xanax', 'tramadol',
  'molly', 'mdma', 'ketamine', 'cannabis a vendre', 'weed a vendre', 'livraison weed',
  'vends weed', 'vends coco', 'dealer de',
];

/** Patterns SCAM — liens externes. */
const SCAM_LINK_PATTERNS: RegExp[] = [
  /https?:\/\//i,
  /\bwww\./i,
  /\bwa\.me\b/i,
  /\bt\.me\b/i,
  /\bbit\.ly\b/i,
  /\btinyurl\b/i,
  /\bIS\.gd\b/i,
  /\b\.xyz\b/i,
  /\b\.top\b/i,
  /\b\.click\b/i,
  /\blinktr\.ee\b/i,
  /\bof\.la\b/i,
  /\bonlyfans\b/i,
];

/** Patterns SCAM — crypto / « investissement ». */
const SCAM_CRYPTO_WORDS = [
  'bitcoin', 'ethereum', 'binance', 'coinbase', 'usdt', 'metamask', 'wallet',
  'trading', 'forex', 'investissement garanti', 'investis avec moi', 'rendement',
  'crypto nvest', 'double ton',
];

/** Patterns SCAM — demandes d'argent (phrases complètes, faibles faux positifs). */
const SCAM_MONEY_PHRASES = [
  'envoie moi de l argent', 'envoie-moi de l argent', 'envoie de l argent',
  'besoin urgent d argent', 'pret moi de l argent', 'prêt moi de l argent',
  'transfert western union', 'western union', 'moneygram', 'mandat cash',
  'carte cadeau', 'gift card', 'carte steam', 'carte google play', 'apple pay carte',
  'paiement par carte steam', 'rembourse moi apres', 'je te rembourse des que',
  'bloque a la douane', 'frais de douane', 'frais de transfert',
];

/** Patterns SCAM — contournement de la plateforme (contact externe). */
const SCAM_CONTACT_WORDS = [
  'whatsapp', 'watsap', 'watsapp', 'telegram', 'snapchat', 'snap ', ' monsnap',
  'insta ', 'instagram', 'discord', 'skype', 'kik', 'hangout', 'gmail point com',
  'donne ton numero', 'donne ton numéro', 'mon numero est', 'mon numéro est',
  'appel moi sur', 'appelle moi sur', 'echange de numero',
];

/** Numéro de téléphone : ≥ 8 chiffres après nettoyage des séparateurs. */
const PHONE_RE = /(?:^|[^\w@.])(?:\+?\d[\d\s().-]{6,}\d)(?:[^\w]|$)/;

export interface RuleHit {
  categories: string[];
  /** Poids cumulé. */
  risk: number;
}

function hitWords(text: string, words: string[], category: string, weight: number, hits: RuleHit): void {
  for (const w of words) {
    const needle = w.trim();
    if (!needle) continue;
    // Frontière de mot côté lettre uniquement (les phrases gardent leurs espaces)
    const re = new RegExp(`(^|[^a-z0-9])${escapeRe(needle)}([^a-z0-9]|$)`);
    if (re.test(text)) {
      if (!hits.categories.includes(category)) hits.categories.push(category);
      hits.risk += weight;
      return; // 1 seul ajout de poids par catégorie et liste
    }
  }
}

function hitPhrases(text: string, phrases: string[], category: string, weight: number, hits: RuleHit): void {
  for (const p of phrases) {
    if (text.includes(normalize(p))) {
      if (!hits.categories.includes(category)) hits.categories.push(category);
      hits.risk += weight;
      return;
    }
  }
}

function hitRegexes(text: string, patterns: RegExp[], category: string, weight: number, hits: RuleHit): void {
  for (const re of patterns) {
    if (re.test(text)) {
      if (!hits.categories.includes(category)) hits.categories.push(category);
      hits.risk += weight;
      return;
    }
  }
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Verdict de modération d'un message texte.
 * Sûr : aucune exception ne remonte (règles = best effort, jamais bloquantes
 * pour la conversation) — en cas de bug interne, le message est livré.
 */
export function moderateText(rawText: string): ModerationVerdict {
  try {
    const text = normalize(rawText);
    const hits: RuleHit = { categories: [], risk: 0 };

    hitWords(text, HATE_WORDS, 'hate', 65, hits);
    hitPhrases(text, HARASSMENT_PHRASES, 'harassment', 55, hits);
    hitWords(text, DRUG_WORDS, 'drugs', 25, hits);
    hitRegexes(text, SCAM_LINK_PATTERNS, 'scam_link', 40, hits);
    hitWords(text, SCAM_CRYPTO_WORDS, 'scam_crypto', 40, hits);
    hitPhrases(text, SCAM_MONEY_PHRASES, 'scam_money', 45, hits);
    hitWords(text, SCAM_CONTACT_WORDS, 'scam_contact', 30, hits);

    // Numéro de téléphone : séparateurs retirés, ≥ 8 chiffres consécutifs.
    const digits = rawText.replace(/[^\d]/g, '');
    const spacedDigits = rawText.replace(/(\d)[\s.-](\d)/g, '$1$2');
    const digitRuns = (spacedDigits.match(/\d{8,}/g) ?? []).length > 0 || digits.length >= 10;
    const tooManyDigits = digitRuns && PHONE_RE.test(rawText.replace(/(\d{3})[\s.-](\d{3})/g, '$1$2'));
    if (tooManyDigits || /\d{8,}/.test(spacedDigits)) {
      // Tolère les années/références courtes : exige ≥ 8 chiffres D'AFFILÉE
      // (après fusion des séparateurs) — les dates 2026-09-24 passent (4+4
      // séparés par un tiret fusionnés = 8… on exige alors ≥ 9 pour ce cas).
      const strict = digits.length >= 9;
      if (strict) {
        if (!hits.categories.includes('scam_phone')) hits.categories.push('scam_phone');
        hits.risk += 25;
      }
    }

    const risk = Math.min(100, Math.round(hits.risk));
    const action =
      risk >= SAFETY.blockRisk ? 'block' : risk >= SAFETY.flagRisk ? 'flag' : 'deliver';
    return { risk, categories: hits.categories, action };
  } catch {
    return { risk: 0, categories: [], action: 'deliver' };
  }
}
