/**
 * P0 âge (33-c — coordination avec le volet sécurité 33-b) — aide front,
 * miroir d'apps/api/src/lib/age.ts. L'API exige désormais une date de
 * naissance ISO (18 ans révolus) sur les TROIS flux d'inscription (OTP
 * email, pseudo + mot de passe, OAuth /start) ; le front collecte la date
 * réelle (input type="date") et pré-valide pour un feedback immédiat.
 * La seule source de vérité reste le serveur (validateBirthDateISO) :
 * ce module ne reflète que les bornes (1930 → aujourd'hui − 18 ans, UTC).
 */

/** Borne basse historique (colonne users.birth_year, migration 0007). */
export const BIRTH_MIN = '1930-01-01';

/** Date de naissance maximale admissible = aujourd'hui − 18 ans (AAAA-MM-JJ). */
export function birthDateMax(): string {
  const now = new Date();
  const d = new Date(
    Date.UTC(now.getUTCFullYear() - 18, now.getUTCMonth(), now.getUTCDate()),
  );
  return d.toISOString().slice(0, 10);
}

/** La date (AAAA-MM-JJ de l'input) donne-t-elle 18 ans RÉVOLUS (UTC) ? */
export function estMajeur(birthDate: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) return false;
  const t = Date.parse(`${birthDate}T00:00:00Z`);
  if (Number.isNaN(t)) return false;
  const now = new Date();
  const cutoff = Date.UTC(now.getUTCFullYear() - 18, now.getUTCMonth(), now.getUTCDate());
  return t <= cutoff;
}
