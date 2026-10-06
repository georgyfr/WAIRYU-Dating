/**
 * Validation d'âge stricte (P0 runtime — volet sécurité/AUTH).
 *
 * UN SEUL validateur pour TOUTES les écritures de date de naissance :
 *  - inscription OTP email      (routes/auth.ts — POST /auth/otp/verify) ;
 *  - inscription OAuth Google/Facebook (routes/auth.ts — resolveOrCreateOAuthUser) ;
 *  - inscription pseudo+mdp     (routes/auth.ts — POST /auth/password/register) ;
 *  - mise à jour du profil      (routes/profiles.ts — PUT /profile).
 *
 * Garanties : ISO strict AAAA-MM-JJ, date réelle (bissextiles vérifiées),
 * 18 ans RÉVOLUS calculés contre aujourd'hui (UTC), birth_year ∈ [1930 ;
 * année courante − 18]. Le CHECK SQL de 0007 reste statique (1930-2100,
 * non-déterministe à la borne haute) : la borne DYNAMIQUE est garantie ici
 * + triggers 0023_safety_aggregate.sql (INSERT/UPDATE).
 */
import { AppError, errors } from './errors';

/**
 * Chemin MINEUR : la date est bien formée mais l'âge calculé est < 18 ans.
 * Erreur 403 GÉNÉRIQUE (aucune donnée personnelle dans le message). Les
 * routes d'inscription l'interceptent AVANT tout INSERT pour consigner une
 * ligne audit_admin « signup_minor_refused » (hash de l'identifiant) ;
 * profiles.ts l'intercepte pour « minor_ban » (ban + révocation sessions).
 */
export class MinorAgeError extends AppError {
  constructor() {
    super(403, 'forbidden', 'Les comptes wairyu sont réservés aux personnes majeures (18 ans révolus).');
    this.name = 'MinorAgeError';
  }
}

/** Borne basse historique (colonne users.birth_year, migration 0007). */
const BIRTH_YEAR_MIN = 1930;

/**
 * Valide une date de naissance ISO stricte et renvoie le couple à stocker.
 *  - format/date impossible → 400 (bad_request) ;
 *  - année < 1930 → 400 ;
 *  - âge < 18 ans (année trop récente OU anniversaire non encore passé) →
 *    MinorAgeError (403 générique — chemin mineur, décision route).
 */
export function validateBirthDateISO(iso: string): { birthYear: number; birthDate: string } {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) throw errors.badRequest('Date de naissance invalide (format attendu AAAA-MM-JJ).');
  const year = Number(m![1]);
  const month = Number(m![2]);
  const day = Number(m![3]);

  if (year < BIRTH_YEAR_MIN) {
    throw errors.badRequest(`Année de naissance invalide (année minimale ${BIRTH_YEAR_MIN}).`);
  }
  if (month < 1 || month > 12) throw errors.badRequest('Mois de naissance invalide.');
  // Dernier jour RÉEL du mois (gère les années bissextiles).
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  if (day < 1 || day > daysInMonth) {
    throw errors.badRequest('Jour de naissance invalide pour ce mois.');
  }

  // Âge exact (UTC) : 18 ans révolus = 18ᵉ anniversaire déjà passé aujourd'hui.
  const now = new Date();
  const maxYear = now.getUTCFullYear() - 18; // borne haute DYNAMIQUE
  if (year > maxYear) throw new MinorAgeError();
  const birth = Date.UTC(year, month - 1, day);
  const cutoff = Date.UTC(maxYear, now.getUTCMonth(), now.getUTCDate());
  if (birth > cutoff) throw new MinorAgeError();

  return { birthYear: year, birthDate: m![0]! };
}
