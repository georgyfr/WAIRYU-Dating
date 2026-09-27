/**
 * Héritage culturel — validation + projection (Task 52).
 *
 * Rôle unique de ce module :
 *  1. SANITISER l'objet reçu par PUT /api/profile (`heritage`) : whitelist
 *     stricte par section (7 sections de la spec), plafonds (listes ≤ 12,
 *     chaînes ≤ 300), échelles 1-5, énumérations validées. Toute clé
 *     inconnue, tout type inattendu est DÉPOSÉ (jamais stocké) — l'objet
 *     ne peut pas servir de canal d'injection (JSON stocké tel quel mais
 *     ressorti uniquement via ce même saniteur à la lecture).
 *  2. PROJETER le résumé PUBLIC (`HeritageSummary`) pour le feed Cultures :
 *     sections 1-4 + 7 seulement — les sections 5 (Valeurs/religion) et 6
 *     (Projets/enfants) restent PRIVÉES (RGPD art. 9, spec « masquable »).
 *
 * Tout est optionnel (spec : « Aucun champ n'est obligatoire ») ; un objet
 * sans aucun champ significatif vaut null (= pas d'héritage).
 */
import type { HeritageLangLevel, HeritageLangSpoken, HeritageProfile, HeritageSummary } from '@wairyu/shared';

// --- Plafonds (gardes-fous anti-blob, cf. 0016_heritage_profile.sql) ---
const MAX_TAGS = 12;
const MAX_TAG_LEN = 40;
const MAX_TEXT_LEN = 300;
const MAX_LANG_SPOKEN = 8;

/** Tronque/nettoie un tag (une ligne, sans NUL — pas d'inventaire binaire). */
function tag(v: unknown): string | null {
  if (typeof v !== 'string') return null;
  const s = v.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\n\r]/g, ' ').trim();
  if (!s) return null;
  return s.slice(0, MAX_TAG_LEN);
}

/** Liste de tags : dédoublonnée (insensible à la casse), ≤ MAX_TAGS. */
function tagList(v: unknown): string[] | undefined {
  if (!Array.isArray(v)) return undefined;
  const out: string[] = [];
  const seen = new Set<string>();
  for (const raw of v) {
    const t = tag(raw);
    if (!t) continue;
    const key = t.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(t);
    if (out.length >= MAX_TAGS) break;
  }
  return out.length > 0 ? out : undefined;
}

/** Texte libre court (rituels, traditions, projets…) — plafond 300, PAS 40. */
function txt(v: unknown): string | undefined {
  if (typeof v !== 'string') return undefined;
  const s = v.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\n\r]/g, ' ').trim();
  if (!s) return undefined;
  return s.slice(0, MAX_TEXT_LEN);
}

/** Échelle 1-5 (entier, bornée — rien d'autre n'est accepté). */
function scale(v: unknown): number | undefined {
  if (typeof v !== 'number' || !Number.isFinite(v)) return undefined;
  return Math.min(5, Math.max(1, Math.round(v)));
}

/** Enum stricte : valeur hors liste = champ déposé (pas d'erreur globale). */
function one<T extends string>(v: unknown, allowed: readonly T[]): T | undefined {
  return typeof v === 'string' && (allowed as readonly string[]).includes(v) ? (v as T) : undefined;
}

function obj(v: unknown): Record<string, unknown> {
  return v !== null && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : {};
}

const LANG_LEVELS = ['a1a2', 'b1b2', 'c1', 'c2'] as const;

/** Section 1 — Langues. */
function sanitizeLangues(v: unknown): HeritageProfile['langues'] | undefined {
  const s = obj(v);
  const out: NonNullable<HeritageProfile['langues']> = {};
  const maternelle = tag(s.maternelle);
  if (maternelle) out.maternelle = maternelle;
  if (Array.isArray(s.parlees)) {
    const parlees: HeritageLangSpoken[] = [];
    const seen = new Set<string>();
    for (const raw of s.parlees.slice(0, MAX_LANG_SPOKEN * 2)) {
      const p = obj(raw);
      const langue = tag(p.langue);
      const niveau = one(p.niveau, LANG_LEVELS);
      if (!langue || !niveau) continue;
      const key = langue.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      parlees.push({ langue, niveau });
      if (parlees.length >= MAX_LANG_SPOKEN) break;
    }
    if (parlees.length > 0) out.parlees = parlees;
  }
  const comprises = tagList(s.comprises);
  if (comprises) out.comprises = comprises;
  const souhaite = tagList(s.souhaiteApprendre);
  if (souhaite) out.souhaiteApprendre = souhaite;
  const preference = one(s.preference, ['peu_importe', 'ma_langue', 'langue_commune', 'langue_autre'] as const);
  if (preference) out.preference = preference;
  return Object.keys(out).length > 0 ? out : undefined;
}

/** Section 2 — Origines. */
function sanitizeOrigines(v: unknown): HeritageProfile['origines'] | undefined {
  const s = obj(v);
  const out: NonNullable<HeritageProfile['origines']> = {};
  const paysNaissance = tag(s.paysNaissance);
  if (paysNaissance) out.paysNaissance = paysNaissance;
  const paysResidence = tag(s.paysResidence);
  if (paysResidence) out.paysResidence = paysResidence;
  const originesFamiliales = tagList(s.originesFamiliales);
  if (originesFamiliales) out.originesFamiliales = originesFamiliales;
  const diaspora = txt(s.diaspora);
  if (diaspora) out.diaspora = diaspora;
  const regionOrigine = tag(s.regionOrigine);
  if (regionOrigine) out.regionOrigine = regionOrigine;
  return Object.keys(out).length > 0 ? out : undefined;
}

/** Section 3 — Ouverture (échelles + 2 choix). */
function sanitizeOuverture(v: unknown): HeritageProfile['ouverture'] | undefined {
  const s = obj(v);
  const out: NonNullable<HeritageProfile['ouverture']> = {};
  const apprendre = scale(s.apprendre);
  if (apprendre !== undefined) out.apprendre = apprendre;
  const voyager = scale(s.voyager);
  if (voyager !== undefined) out.voyager = voyager;
  const sAdapter = scale(s.sAdapter);
  if (sAdapter !== undefined) out.sAdapter = sAdapter;
  const confort = scale(s.confort);
  if (confort !== undefined) out.confort = confort;
  const ri = one(s.relationInterculturelle, ['activement', 'si_affinites', 'non'] as const);
  if (ri) out.relationInterculturelle = ri;
  const rd = one(s.relationDistance, ['oui', 'non', 'peut_etre'] as const);
  if (rd) out.relationDistance = rd;
  return Object.keys(out).length > 0 ? out : undefined;
}

/** Section 4 — Traditions. */
function sanitizeTraditions(v: unknown): HeritageProfile['traditions'] | undefined {
  const s = obj(v);
  const out: NonNullable<HeritageProfile['traditions']> = {};
  const fetes = tagList(s.fetes);
  if (fetes) out.fetes = fetes;
  const rituels = txt(s.rituels);
  if (rituels) out.rituels = rituels;
  const familiales = txt(s.familiales);
  if (familiales) out.familiales = familiales;
  const rapport = one(s.rapport, ['tres_important', 'important', 'peu_important', 'aucun'] as const);
  if (rapport) out.rapport = rapport;
  const aTransmettre = txt(s.aTransmettre);
  if (aTransmettre) out.aTransmettre = aTransmettre;
  return Object.keys(out).length > 0 ? out : undefined;
}

/** Section 5 — Valeurs (stockée mais PRIVÉE — jamais projetée au feed). */
function sanitizeValeurs(v: unknown): HeritageProfile['valeurs'] | undefined {
  const s = obj(v);
  const out: NonNullable<HeritageProfile['valeurs']> = {};
  const placeFamille = one(s.placeFamille, ['centrale', 'importante', 'secondaire'] as const);
  if (placeFamille) out.placeFamille = placeFamille;
  const rr = one(
    s.rapportReligion,
    ['croyant_pratiquant', 'croyant_non_pratiquant', 'spirituel', 'athe', 'prefere_pas_dire'] as const,
  );
  if (rr) out.rapportReligion = rr;
  const roleAines = one(s.roleAines, ['tres_important', 'important', 'peu_important'] as const);
  if (roleAines) out.roleAines = roleAines;
  const ee = one(s.educationEnfants, ['stricte', 'equilibree', 'libre'] as const);
  if (ee) out.educationEnfants = ee;
  const rc = one(s.roleCouple, ['traditionnel', 'egalitaire', 'flexible'] as const);
  if (rc) out.roleCouple = rc;
  return Object.keys(out).length > 0 ? out : undefined;
}

/** Section 6 — Projets interculturels (PRIVÉE — jamais projetée au feed). */
function sanitizeProjets(v: unknown): HeritageProfile['projets'] | undefined {
  const s = obj(v);
  const out: NonNullable<HeritageProfile['projets']> = {};
  const enfants = one(s.enfants, ['oui', 'non', 'peut_etre'] as const);
  if (enfants) out.enfants = enfants;
  const eb = one(s.educationBiculturelle, ['biculturelle', 'locale', 'internationale'] as const);
  if (eb) out.educationBiculturelle = eb;
  const lv = one(s.lieuDeVie, ['pays_origine', 'pays_autre', 'pays_tiers', 'peu_importe'] as const);
  if (lv) out.lieuDeVie = lv;
  const mobilite = one(s.mobilite, ['pret_demenager', 'enracine', 'flexible'] as const);
  if (mobilite) out.mobilite = mobilite;
  const projetCouple = txt(s.projetCouple);
  if (projetCouple) out.projetCouple = projetCouple;
  return Object.keys(out).length > 0 ? out : undefined;
}

/** Section 7 — Affinités culturelles. */
function sanitizeAffinites(v: unknown): HeritageProfile['affinites'] | undefined {
  const s = obj(v);
  const out: NonNullable<HeritageProfile['affinites']> = {};
  const cuisines = tagList(s.cuisines);
  if (cuisines) out.cuisines = cuisines;
  const platSignature = txt(s.platSignature);
  if (platSignature) out.platSignature = platSignature;
  const musiques = tagList(s.musiques);
  if (musiques) out.musiques = musiques;
  const artiste = txt(s.artiste);
  if (artiste) out.artiste = artiste;
  const filmsSeries = txt(s.filmsSeries);
  if (filmsSeries) out.filmsSeries = filmsSeries;
  return Object.keys(out).length > 0 ? out : undefined;
}

/**
 * Sanitise l'entrée PUT (`heritage` : objet arbitraire du client).
 * Retourne null si l'objet est vide/absent/illisible (= effacement ou rien).
 */
export function sanitizeHeritage(input: unknown): HeritageProfile | null {
  if (input === null || input === undefined) return null;
  const s = obj(input);
  const out: HeritageProfile = {};
  const langues = sanitizeLangues(s.langues);
  if (langues) out.langues = langues;
  const origines = sanitizeOrigines(s.origines);
  if (origines) out.origines = origines;
  const ouverture = sanitizeOuverture(s.ouverture);
  if (ouverture) out.ouverture = ouverture;
  const traditions = sanitizeTraditions(s.traditions);
  if (traditions) out.traditions = traditions;
  const valeurs = sanitizeValeurs(s.valeurs);
  if (valeurs) out.valeurs = valeurs;
  const projets = sanitizeProjets(s.projets);
  if (projets) out.projets = projets;
  const affinites = sanitizeAffinites(s.affinites);
  if (affinites) out.affinites = affinites;
  return Object.keys(out).length > 0 ? out : null;
}

/** Parse la colonne users.heritage (JSON) — jamais d'exception, null si vide. */
export function parseHeritage(raw: string | null | undefined): HeritageProfile | null {
  if (!raw) return null;
  try {
    return sanitizeHeritage(JSON.parse(raw));
  } catch {
    return null;
  }
}

/** Libellé de niveau court pour le résumé public (« Anglais (courant) »). */
const LEVEL_SHORT: Record<HeritageLangLevel, string> = {
  a1a2: 'débutant',
  b1b2: 'intermédiaire',
  c1: 'courant',
  c2: 'natif',
};

/**
 * Projette le résumé PUBLIC du feed Cultures (sections 1-4 + 7 — JAMAIS
 * Valeurs ni Projets). null si l'héritage est vide : pas de payload fantôme.
 */
export function summarizeHeritage(h: HeritageProfile | null): HeritageSummary | null {
  if (!h) return null;
  const langues: string[] = (h.langues?.parlees ?? [])
    .slice(0, 6)
    .map((p) => `${p.langue} (${LEVEL_SHORT[p.niveau]})`);
  const scales = [
    h.ouverture?.apprendre,
    h.ouverture?.voyager,
    h.ouverture?.sAdapter,
    h.ouverture?.confort,
  ].filter((n): n is number => typeof n === 'number');
  const summary: HeritageSummary = {
    maternelle: h.langues?.maternelle ?? null,
    langues,
    origines: [...(h.origines?.originesFamiliales ?? []), ...(h.origines?.regionOrigine ? [h.origines.regionOrigine] : [])].slice(0, 6),
    fetes: (h.traditions?.fetes ?? []).slice(0, 6),
    aTransmettre: h.traditions?.aTransmettre ?? null,
    cuisines: (h.affinites?.cuisines ?? []).slice(0, 6),
    musiques: (h.affinites?.musiques ?? []).slice(0, 6),
    ouverture:
      scales.length > 0
        ? Math.round(scales.reduce((a, b) => a + b, 0) / scales.length)
        : null,
  };
  const empty =
    summary.maternelle === null &&
    summary.langues.length === 0 &&
    summary.origines.length === 0 &&
    summary.fetes.length === 0 &&
    summary.aTransmettre === null &&
    summary.cuisines.length === 0 &&
    summary.musiques.length === 0 &&
    summary.ouverture === null;
  return empty ? null : summary;
}
