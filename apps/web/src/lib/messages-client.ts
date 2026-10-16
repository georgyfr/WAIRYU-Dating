/**
 * Client RENCONTRE-E2 « Les conversations » (Task 107) — appels API depuis
 * le front. Même doctrine que auth-client : la session vit dans le cookie
 * httpOnly (same-origin), RIEN côté JS. Le temps réel passe par le WebSocket
 * du même origine (/api/rencontres/:id/ws) — jamais de port, jamais d'hôte
 * codé en dur (gateway-compatible).
 */
import { ApiError } from './auth-client';

export interface MessageE2 {
  id: string;
  deMoi: boolean;
  corps: string;
  lang: 'fr' | 'en';
  creeA: string;
}

export interface EtatReveal {
  seuilAtteint: boolean;
  messages: number;
  messagesRequis: number;
  jours: number;
  joursRequis: number;
  demandeMoi: boolean;
  demandeAutre: boolean;
  revele: boolean;
}

export interface Conversation {
  matchId: string;
  creeA: string;
  autre: { id: string; pseudo: string | null };
  total: number;
  nonLus: number;
  dernier: { corps: string; deMoi: boolean; creeA: string } | null;
  revele: boolean;
}

export interface FilConversation {
  ok: true;
  matchId: string;
  autre: { id: string; pseudo: string | null };
  bloque: boolean;
  messages: MessageE2[];
  plusAncien: string | null;
  reveal: EtatReveal;
}

async function appel<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    credentials: 'same-origin',
    ...init,
    headers: { 'content-type': 'application/json', ...(init?.headers ?? {}) },
  });
  const body = (await res.json().catch(() => null)) as
    | ({ ok?: boolean; error?: string } & Record<string, unknown>)
    | { error?: { code?: string; message?: string } }
    | null;
  if (!res.ok || (body && 'ok' in body && body.ok === false)) {
    // Deux formats d'erreur coexistent : {error:{code,message}} (Hono onError)
    // et {ok:false, error:'code'} (style rencontres). On les unifie.
    const codeDirect = (body as { error?: string } | null)?.error;
    const codeHono = (body as { error?: { code?: string; message?: string } } | null)?.error;
    const code = typeof codeDirect === 'string' ? codeDirect : codeHono?.code ?? 'internal';
    throw new ApiError(res.status, code, codeHono?.message ?? code);
  }
  return body as T;
}

/** La boîte de réception : matchs, dernier message, non-lus, badge. */
export function fetchConversations(): Promise<{ ok: true; conversations: Conversation[]; totalNonLus: number }> {
  return appel('/api/rencontres/conversations');
}

/** L'historique (100 derniers) + l'état révélation + la sécurité. */
export function fetchFil(matchId: string): Promise<FilConversation> {
  return appel(`/api/rencontres/${encodeURIComponent(matchId)}/messages`);
}

/** Envoi REST (fallback si le WS est fermé). Silencieux si blocage. */
export function envoyerMessage(matchId: string, corps: string, lang: 'fr' | 'en'): Promise<{ ok: true; message?: MessageE2; silencieux?: boolean }> {
  return appel(`/api/rencontres/${encodeURIComponent(matchId)}/messages`, {
    method: 'POST',
    body: JSON.stringify({ corps, lang }),
  });
}

/** Marque lu (à l'ouverture du fil / réception en vue). */
export function marquerLu(matchId: string): Promise<{ ok: true }> {
  return appel(`/api/rencontres/${encodeURIComponent(matchId)}/lu`, { method: 'POST', body: '{}' });
}

/** Révélation consentie — 403 reveal_seuil tant que les seuils ne sont pas réunis. */
export function demanderReveal(matchId: string): Promise<{ ok: true; etat: EtatReveal }> {
  return appel(`/api/rencontres/${encodeURIComponent(matchId)}/reveal`, { method: 'POST', body: '{}' });
}

/** Traduction manuelle (bouton) — 503 si l'IA n'est pas disponible. */
export function traduireMessage(matchId: string, messageId: string, vers: 'fr' | 'en'): Promise<{ ok: true; traduction: string }> {
  return appel(`/api/rencontres/${encodeURIComponent(matchId)}/traduire`, {
    method: 'POST',
    body: JSON.stringify({ messageId, vers }),
  });
}

/** Signalement (motifs fermés) — l'autre n'est jamais informé. */
export function signaler(signe: string, motif: string, details: string | null, matchId: string | null): Promise<{ ok: true }> {
  return appel('/api/rencontres/signalements', {
    method: 'POST',
    body: JSON.stringify({ signe, motif, details, matchId }),
  });
}

/** Blocage silencieux (survit à l'unmatch, messages conservés). */
export function bloquer(matchId: string): Promise<{ ok: true }> {
  return appel(`/api/rencontres/${encodeURIComponent(matchId)}/blocage`, { method: 'POST', body: '{}' });
}

/** Unmatch : efface messages/lus/reveals + le match ; les pas reviennent à « retiré ». */
export function unmatch(matchId: string): Promise<{ ok: true }> {
  return appel(`/api/rencontres/${encodeURIComponent(matchId)}/unmatch`, { method: 'POST', body: '{}' });
}

/** L'URL WebSocket du fil — MÊME origine (jamais de port/hôte codé en dur). */
export function urlWs(matchId: string): string {
  const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${proto}//${window.location.host}/api/rencontres/${encodeURIComponent(matchId)}/ws`;
}
