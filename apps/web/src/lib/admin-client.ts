/**
 * Client console admin (Task 109 — espace de modération).
 *
 * Doctrine sécurité : le jeton ADMIN_TOKEN ne vit QUE dans sessionStorage —
 * jamais localStorage (pas de persistance après fermeture de l'onglet),
 * jamais cookie, jamais envoyé ailleurs que sur /admin/* du même origine.
 * Aucun jeton codé en dur, aucun port, aucun hôte (gateway-compatible).
 */

const CLE_JETON = 'wairyu-admin-token';

export function jetonAdmin(): string {
  try {
    return sessionStorage.getItem(CLE_JETON) ?? '';
  } catch {
    return '';
  }
}

export function poserJetonAdmin(jeton: string): void {
  try {
    sessionStorage.setItem(CLE_JETON, jeton.trim());
  } catch {
    /* stockage indisponible — la console restera en erreur, jamais de crash */
  }
}

export function retirerJetonAdmin(): void {
  try {
    sessionStorage.removeItem(CLE_JETON);
  } catch {
    /* ignore */
  }
}

/** Erreur d'appel admin avec statut HTTP (401 ⇒ déconnexion de la console). */
export class ErreurAdmin extends Error {
  readonly statut: number;
  constructor(statut: number, message: string) {
    super(message);
    this.statut = statut;
  }
}

async function appel<T>(path: string, init?: RequestInit): Promise<T> {
  const jeton = jetonAdmin();
  const headers: Record<string, string> = {
    ...(init?.headers as Record<string, string> | undefined),
  };
  if (jeton) headers['authorization'] = `Bearer ${jeton}`;
  if (init?.body) headers['content-type'] = 'application/json';

  let res: Response;
  try {
    res = await fetch(path, { ...init, headers });
  } catch {
    throw new ErreurAdmin(0, 'Réseau injoignable.');
  }
  if (!res.ok) {
    let message = `Erreur ${res.status}`;
    try {
      const b = (await res.json()) as { error?: { message?: string } };
      if (b?.error?.message) message = b.error.message;
    } catch {
      /* corps non JSON — message par défaut */
    }
    throw new ErreurAdmin(res.status, message);
  }
  return (await res.json()) as T;
}

// ---- Types de réponse (camelCase, même convention que messages-client) ----

export interface Apercu {
  signalementsOuverts: number;
  signalementsTraités: number;
  signalementsRejetés: number;
  signalements7j: number;
  blocagesTotal: number;
  blocages7j: number;
  messages24h: number;
  matchsTotal: number;
}

export interface SignalementAdmin {
  id: string;
  de: string;
  contre: string;
  motif: string;
  detail: string | null;
  matchId: string | null;
  statut: 'ouvert' | 'traite' | 'rejete';
  creeA: string;
  pseudoDe: string | null;
  pseudoContre: string | null;
}

export interface BlocageAdmin {
  id: string;
  par: string;
  contre: string;
  creeA: string;
  pseudoPar: string | null;
  pseudoContre: string | null;
}

// ---- Appels ----

export function chargerApercu(): Promise<{ ok: true; apercu: Apercu }> {
  return appel('/admin/moderation/apercu');
}

export function chargerSignalements(
  statut: 'ouvert' | 'traite' | 'rejete' | 'tous',
  limite = 100,
): Promise<{ ok: true; signalements: SignalementAdmin[] }> {
  return appel(`/admin/moderation/signalements?statut=${encodeURIComponent(statut)}&limite=${limite}`);
}

export function chargerBlocages(limite = 100): Promise<{ ok: true; blocages: BlocageAdmin[] }> {
  return appel(`/admin/moderation/blocages?limite=${limite}`);
}

export function trancherSignalement(
  id: string,
  statut: 'traite' | 'rejete',
): Promise<{ ok: true; signalement: { id: string; statut: string } }> {
  return appel(`/admin/moderation/signalements/${encodeURIComponent(id)}`, {
    method: 'POST',
    body: JSON.stringify({ statut }),
  });
}
