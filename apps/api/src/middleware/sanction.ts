/**
 * MODÉRATION & APPEL (Task 115) — application des sanctions (SPEC v1.1,
 * décisions gravées M-1..7 + G-MA-1..6).
 *
 *  - N2 « Pause complète » : TOUT /api/* est refusé 403 « sanction_active »
 *    SAUF la liste blanche minimale (voir /me, /me/sanction, /me/appel,
 *    /auth/logout, health/version) — le membre garde le droit de se
 *    déconnecter, de voir SON écran de sanction et de DEMANDER UNE RELECTURE
 *    (G-MA-3 : une sanction sans chemin d'appel n'existe pas, M-5).
 *  - N1 « Pause Rencontre » : écritures /api/rencontres/* refusées 403
 *    (fils en LECTURE SEULE, G-MA-2) SAUF blocage/unmatch/lu (la protection
 *    à un geste reste TOUJOURS disponible — M-1). Le pool filtrera de son
 *    côté (le sanctionné n'apparaît plus, ne voit plus).
 *
 * Le message de sanction est NEUTRE et GRAVÉ (G-MA-4) : jamais le nom du
 * signalant, jamais le motif — « le signalant jamais » (M-6).
 */
import type { Context, Next } from 'hono';
import type { AppEnv } from '../env';

/** Le message neutre gravé — source unique (front et back l'affichent tel quel). */
export const MESSAGE_SANCTION =
  'Ton compte est en pause après un signalement. Une relecture humaine est possible — sans délai garanti.';

/** Les chemins qui restent OUVERTS en N2 (le minimum vital de la personne). */
const BLC_N2 = [
  '/api/health',
  '/api/version',
  '/api/auth/me',
  '/api/auth/logout',
  '/api/me/sanction',
  '/api/me/appel',
  '/api/account',
];

/** Les écritures Rencontre qui restent ouvertes en N1 (M-1 : se protéger). */
const ECRITURES_N1_OUVERTES = ['/blocage', '/unmatch', '/lu'];

export async function sanctionMiddleware(c: Context<AppEnv>, next: Next) {
  const niveau = c.get('sanction');
  if (niveau === 0) {
    await next();
    return;
  }
  const chemin = new URL(c.req.url).pathname;

  if (niveau === 2) {
    const ouvert = BLC_N2.some((p) => chemin === p || chemin.startsWith(`${p}/`));
    if (!ouvert) {
      return c.json({ ok: false, error: 'sanction_active', message: MESSAGE_SANCTION }, 403);
    }
    await next();
    return;
  }

  // N1 : uniquement les écritures Rencontre (et le WS ticket) sont touchées.
  if (chemin.startsWith('/api/rencontres/')) {
    const suffixe = chemin.slice('/api/rencontres/'.length);
    const methode = c.req.method;
    const estEcriture = methode !== 'GET' && methode !== 'HEAD';
    const estWs = chemin.endsWith('/ws');
    if ((estEcriture && !ECRITURES_N1_OUVERTES.some((s) => suffixe.endsWith(s))) || estWs) {
      return c.json({ ok: false, error: 'sanction_active', message: MESSAGE_SANCTION }, 403);
    }
  }
  await next();
}
