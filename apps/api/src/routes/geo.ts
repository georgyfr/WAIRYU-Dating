/**
 * Géocodage inverse (demande fondateur — « Où vis-tu ? »).
 * GET /api/geo/reverse?lat=..&lon=.. → pays, ville, quartier.
 *
 * Choix du fournisseur : Nominatim (OpenStreetMap) — gratuit, mondial, sans clé.
 * Le navigateur ne l'appelle JAMAIS directement : il passe par ce Worker pour
 * respecter la politique d'usage (User-Agent identifiable, 1 req/s max, pas de
 * requêtes en rafale) et pour ne pas exposer le fournisseur côté client.
 *
 * Confidentialité (garde-fou produit inchangé) :
 *  - le front envoie lat/lon arrondis au millième de degré (~110 m) — la
 *    position GPS exacte ne transite pas, et RIEN de précis n'est stocké ;
 *  - le stockage profil reste les libellés (pays/ville/quartier) + la zone
 *    grossière geo:lat,lon arrondie au dixième (~11 km) ;
 *  - cache KV à la granularité ~1,1 km (quotient de requêtes Nominatim, free tier).
 */
import { Hono } from 'hono';
import type { Context } from 'hono';
import type { AppEnv } from '../env';
import { errors } from '../lib/errors';
import { RATE_RULES, hitRateLimit, rateLimitedError } from '../lib/ratelimit';
import type { GeoReverseResponse } from '@wairyu/shared';

export const geoRoutes = new Hono<AppEnv>();

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/reverse';
/** TTL du cache KV (1,1 km de granularité) — les libellés bougent peu. */
const CACHE_TTL_SECONDS = 7 * 86400;
/** Contact politique Nominatim (obligatoire : UA identifiable + contact valide). */
const USER_AGENT = 'wairyu/0.1 (dating app; https://wairyu.wairyu.workers.dev; contact: wairyu26@gmail.com)';

interface NominatimAddress {
  country?: string;
  city?: string;
  town?: string;
  village?: string;
  municipality?: string;
  city_district?: string;
  suburb?: string;
  neighbourhood?: string;
  quarter?: string;
  hamlet?: string;
  state?: string;
}

interface NominatimResponse {
  display_name?: string;
  address?: NominatimAddress;
  error?: string;
}

/** Exige une session valide (le service n'est pas anonyme — anti-abus). */
async function requireUser(c: Context<AppEnv>) {
  const session = c.get('session');
  if (!session) throw errors.unauthorized();
  const user = await c.env.DB.prepare(`SELECT id, status FROM users WHERE id = ? LIMIT 1`)
    .bind(session.userId)
    .first<{ id: string; status: string }>();
  if (!user || user.status === 'deleted') throw errors.unauthorized();
  if (user.status === 'banned') throw errors.forbidden('Compte suspendu.');
  return user;
}

/** Extraction ville / quartier depuis l'adresse OSM (champs variables selon les pays). */
function extract(a: NominatimAddress): { city: string | null; neighborhood: string | null } {
  const city =
    a.city ??
    a.town ??
    a.village ??
    a.municipality ??
    // Grandes métropoles africaines : parfois city_district seul au niveau ville.
    (a.suburb && !a.city && !a.town && !a.village ? a.suburb : null) ??
    null;
  const neighborhood =
    a.neighbourhood ?? a.suburb ?? a.quarter ?? a.hamlet ?? a.city_district ?? null;
  return { city: city ?? null, neighborhood: neighborhood ?? null };
}

geoRoutes.get('/geo/reverse', async (c) => {
  const user = await requireUser(c);

  const rl = await hitRateLimit(c.env.DB, RATE_RULES.geoReverseUser, user.id);
  if (!rl.allowed) throw rateLimitedError(rl.retryAfterSeconds, RATE_RULES.geoReverseUser.scope);

  const lat = Number(c.req.query('lat'));
  const lon = Number(c.req.query('lon'));
  if (!Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) {
    throw errors.badRequest('Coordonnées invalides (lat/lon attendus).');
  }
  // Granularité du cache ~1,1 km — jamais la position exacte dans la clé.
  const lat1 = Math.round(lat * 100) / 100;
  const lon1 = Math.round(lon * 100) / 100;
  const cacheKey = `geo:rev:${lat1.toFixed(2)}:${lon1.toFixed(2)}`;

  const cached = await c.env.CONFIG.get<GeoReverseResponse>(cacheKey, 'json');
  if (cached) return c.json(cached);

  let res: Response;
  try {
    res = await fetch(
      `${NOMINATIM_URL}?format=jsonv2&lat=${lat1}&lon=${lon1}&zoom=16&addressdetails=1&accept-language=fr`,
      { headers: { 'User-Agent': USER_AGENT, 'Accept-Language': 'fr' } },
    );
  } catch {
    throw errors.internal('Service de géolocalisation momentanément indisponible.');
  }
  if (!res.ok) {
    throw errors.internal('Service de géolocalisation momentanément indisponible.');
  }
  const data = (await res.json().catch(() => null)) as NominatimResponse | null;
  if (!data || data.error) throw errors.notFound('Position introuvable — renseigne ta ville manuellement.');

  const { city, neighborhood } = extract(data.address ?? {});
  const body: GeoReverseResponse = {
    country: data.address?.country ?? null,
    city,
    neighborhood,
    label: data.display_name ?? null,
  };

  // Cache best-effort (le quota KV d'écritures reste protégé par le rate limit).
  await c.env.CONFIG.put(cacheKey, JSON.stringify(body), { expirationTtl: CACHE_TTL_SECONDS });

  return c.json(body);
});
