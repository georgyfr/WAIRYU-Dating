/**
 * Client RENCONTRE-E3 « Le Voyage à Deux » (Task 115-b) + sanction/appel
 * (MODÉRATION & APPEL, G-MA-3..5). Même doctrine que messages-client.ts :
 * la session vit dans le cookie httpOnly (same-origin), RIEN côté JS —
 * tous les fetch portent credentials:'same-origin' explicite (FE-008).
 *
 * Les types de contrat vivent dans @wairyu/shared (source unique front ↔
 * Worker) — jamais dupliqués ici. Les limites médias (A2_MEDIAS) aussi.
 */
import { ApiError } from './auth-client';
import type {
  A2Carte,
  A2EtatResponse,
  A2MediaInfo,
  MeSanctionResponse,
} from '@wairyu/shared';

export type { A2Carte, A2EtatResponse, A2MediaInfo, MeSanctionResponse };

/** Réponse du POST voile — 403 {error:'voile_porte', voiles} si porte fermée. */
export interface VoileResponse {
  ok: true;
  deja?: boolean;
}

/** Réponse du POST duo/:quete (l'ouverture à deux lignes). */
export interface DuoResponse {
  ok: true;
  ouvert: boolean;
  carteMoi: A2Carte | null;
  carteAutre: A2Carte | null;
  question: string | null;
}

/** Réponse du POST a2/activites (création de l'activité pilote). */
export interface ActiviteResponse {
  ok: true;
  id: string;
  deja?: boolean;
}

/** Réponse du POST media multipart. */
export interface MediaResponse {
  ok: true;
  media: A2MediaInfo;
}

/**
 * appel<T> — le même unificateur d'erreurs que messages-client (deux formats
 * coexistent : {error:{code,message}} (Hono onError) et {ok:false,error:'code'}
 * (style rencontres). Le sanctionMiddleware renvoie {ok:false,
 * error:'sanction_active', message: MESSAGE_SANCTION} — le message neutre
 * gravé remonte DANS l'ApiError (message), l'appelant l'affiche tel quel.
 */
async function appel<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    credentials: 'same-origin',
    ...init,
    // FormData : le navigateur pose LUI-MÊME le content-type multipart avec
    // sa frontière — on ne l'écrase jamais.
    headers:
      init?.body instanceof FormData
        ? (init?.headers ?? {})
        : { 'content-type': 'application/json', ...(init?.headers ?? {}) },
  });
  const body = (await res.json().catch(() => null)) as
    | ({ ok?: boolean; error?: string; message?: string } & Record<string, unknown>)
    | { error?: { code?: string; message?: string } }
    | null;
  if (!res.ok || (body && 'ok' in body && body.ok === false)) {
    const codeDirect = (body as { error?: string } | null)?.error;
    const codeHono = (body as { error?: { code?: string; message?: string } } | null)?.error;
    const code = typeof codeDirect === 'string' ? codeDirect : codeHono?.code ?? 'internal';
    // Le message gravé (sanction_active) est neutre côté serveur — il voyage
    // tel quel dans l'ApiError et se voit AFFICHÉ SANS RETOUCHE (G-MA-4).
    const messageGrave = (body as { message?: string } | null)?.message;
    throw new ApiError(res.status, code, messageGrave ?? codeHono?.message ?? code);
  }
  return body as T;
}

// ---------------------------------------------------------------------------
// A2 — l'état et les actions à deux
// ---------------------------------------------------------------------------

/** TOUT le Voyage à Deux d'une paire (voiles, duo, activité, rdv, médias). */
export function fetchA2Etat(matchId: string, lang: 'fr' | 'en'): Promise<A2EtatResponse> {
  return appel<A2EtatResponse>(
    `/api/rencontres/${encodeURIComponent(matchId)}/a2/etat?lang=${lang}`,
  );
}

/**
 * Lever un voile (niveaux 2 cartes · 3 voix · 4 photo) — la demande se voit,
 * le refus jamais (D-E3-3) : 403 voile_porte si la porte n'est pas réunie
 * (aucun statut « refusé » n'existe ni ne s'affiche).
 */
export function consentirVoile(matchId: string, niveau: 2 | 3 | 4): Promise<VoileResponse> {
  return appel<VoileResponse>(`/api/rencontres/${encodeURIComponent(matchId)}/voile`, {
    method: 'POST',
    body: JSON.stringify({ niveau }),
  });
}

/** Mettre en regard (Duo, par quête) — l'ouverture est le double oui. */
export function consentirDuo(matchId: string, quete: string): Promise<DuoResponse> {
  return appel<DuoResponse>(
    `/api/rencontres/${encodeURIComponent(matchId)}/duo/${encodeURIComponent(quete)}`,
    { method: 'POST', body: '{}' },
  );
}

/** Créer l'activité « Trois questions croisées » (une active par paire). */
export function creerActivite(matchId: string): Promise<ActiviteResponse> {
  return appel<ActiviteResponse>(`/api/rencontres/${encodeURIComponent(matchId)}/a2/activites`, {
    method: 'POST',
    body: '{}',
  });
}

/**
 * Répondre aux trois questions (1..1000 caractères CHACUNE, les trois
 * obligatoires) — répondre = consentir à l'échange ; le dévoilement est
 * structurel (côté serveur, quand les deux ont répondu).
 */
export function repondreActivite(
  matchId: string,
  activiteId: string,
  reponses: { q1: string; q2: string; q3: string },
): Promise<{ ok: true }> {
  return appel<{ ok: true }>(
    `/api/rencontres/${encodeURIComponent(matchId)}/a2/activites/${encodeURIComponent(activiteId)}/repondre`,
    { method: 'POST', body: JSON.stringify({ reponses }) },
  );
}

/**
 * Envoyer un média (voix | photo) en multipart PAR le Worker (G-E3-P2 :
 * jamais de bucket public, jamais d'URL signée partageable).
 * Erreurs honnêtes : 403 voile_ferme · 413 trop_lourd/trop_long ·
 * 415 type_refuse · 503 media_indisponible.
 */
export function envoyerMedia(
  matchId: string,
  type: 'voix' | 'photo',
  fichier: Blob,
  dureeS?: number,
): Promise<MediaResponse> {
  const forme = new FormData();
  forme.append('file', fichier, type === 'voix' ? 'voix.webm' : 'photo.jpg');
  forme.append('type', type);
  if (type === 'voix' && dureeS !== undefined) forme.append('dureeS', String(Math.trunc(dureeS)));
  return appel<MediaResponse>(`/api/rencontres/${encodeURIComponent(matchId)}/media`, {
    method: 'POST',
    body: forme,
  });
}

/**
 * L'URL du flux média — RELATIVE (same-origin) : posée comme src d'<img> ou
 * d'<audio>, le cookie de session part avec la requête et le Worker vérifie
 * session + membership + voile à CHAQUE lecture (D-E3-6). Jamais d'URL
 * absolue, jamais de port (gateway-compatible).
 */
export function urlMedia(matchId: string, mediaId: string): string {
  return `/api/rencontres/${encodeURIComponent(matchId)}/media/${encodeURIComponent(mediaId)}`;
}

/** Supprimer SON média — purge immédiate côté serveur (auteur seulement). */
export function supprimerMedia(matchId: string, mediaId: string): Promise<{ ok: true }> {
  return appel<{ ok: true }>(
    `/api/rencontres/${encodeURIComponent(matchId)}/media/${encodeURIComponent(mediaId)}`,
    { method: 'DELETE' },
  );
}

// ---------------------------------------------------------------------------
// Modération & appel — GET /api/me/sanction + POST /api/me/appel
// (ces deux routes restent ouvertes en N2 : une sanction sans chemin
//  d'appel n'existe pas dans ce produit — M-5 / G-MA-3).
// ---------------------------------------------------------------------------

/** L'état de sanction du compte — message neutre gravé, affiché tel quel. */
export function fetchMaSanction(): Promise<MeSanctionResponse> {
  return appel<MeSanctionResponse>('/api/me/sanction');
}

/** Demander une relecture (1..1000) — 409 si un appel est déjà posé. */
export function poserAppel(message: string): Promise<{ ok: true; appelId: string }> {
  return appel<{ ok: true; appelId: string }>('/api/me/appel', {
    method: 'POST',
    body: JSON.stringify({ message }),
  });
}
