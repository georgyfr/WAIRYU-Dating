/**
 * Task 78 (demande fondateur : « la notification push arrive, mais elle ne
 * remplit pas automatiquement le code comme nous l'avions demandé »).
 *
 * Relais OTP page↔page : quand le push « Ton code de connexion : 123456 »
 * tombe ALORS qu'aucun écran de vérification n'est ouvert (l'utilisateur est
 * encore sur l'écran connexion, ou ailleurs dans l'application), le code est
 * mis de côté ICI (localStorage, lié à l'email, 10 minutes maximum) et
 * l'écran #/verify le consomme à son montage — l'utilisateur n'a PLUS RIEN à
 * saisir : le champ se remplit et la connexion se fait toute seule.
 *
 * Sécurité : le code est DÉJÀ affiché en clair dans le corps de la
 * notification système (Task 73) ; le stockage reste dans l'origine de
 * l'appareil de l'utilisateur, jamais transmis à un tiers. Consommation en
 * une fois (take = lecture + effacement) pour ne jamais ressoumettre un
 * vieux code.
 */

const KEY = 'wairyu-otp-relay';
const MAX_AGE_MS = 10 * 60 * 1000; // miroir de la validité du code (10 minutes)

interface OtpRelay {
  email: string;
  code: string;
  ts: number;
}

/** Met le code de côté (le plus récent gagne — un seul emplacement). */
export function stashOtpRelay(email: string, code: string): void {
  try {
    localStorage.setItem(KEY, JSON.stringify({ email, code, ts: Date.now() } satisfies OtpRelay));
  } catch {
    /* stockage indisponible — l'email reste le canal de référence */
  }
}

/**
 * Consomme le code mis de côté S'IL correspond à cet email et s'il est assez
 * frais — sinon il est effacé et ignoré. Lecture = effacement (une seule fois).
 */
export function takeOtpRelay(email: string): string | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    localStorage.removeItem(KEY);
    const r = JSON.parse(raw) as Partial<OtpRelay> | null;
    if (!r || r.email !== email) return null;
    if (typeof r.code !== 'string' || !/^\d{6}$/.test(r.code)) return null;
    if (typeof r.ts !== 'number' || Date.now() - r.ts > MAX_AGE_MS) return null;
    return r.code;
  } catch {
    return null;
  }
}

/** Efface le relais (code consommé par un autre chemin — jamais ressoumis). */
export function clearOtpRelay(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* bénin */
  }
}
