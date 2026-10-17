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
    res = await fetch(path, {
      // FE-008 (audit) : credentials explicite (le jeton Bearer reste la voie
      // d'authentification admin ; le cookie sert aux routes de session).
      credentials: 'same-origin',
      ...init,
      headers,
    });
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

// ---------------------------------------------------------------------------
// MODÉRATION & APPEL (Task 115-b) — mesures (sanctions), recours (appels)
// et accès média tracé (E3-P9). Chaque pose/levée est tracée côté API dans
// audit_admin ; le front ne fait que porter la décision humaine (M-4).
// ---------------------------------------------------------------------------

/** Un appel in-app (« Demander une relecture ») dans la file de la console. */
export interface AppelAdmin {
  id: string;
  userId: string;
  pseudo: string | null;
  sanctionId: string;
  sanctionNiveau: number;
  message: string;
  statut: 'ouvert' | 'accepte' | 'rejete';
  creeA: string;
  sanctionCreeA: string | null;
}

/** Métadonnée d'un média d'un match signalé (les octets partent à part). */
export interface MediaAdmin {
  id: string;
  userId: string;
  type: 'voix' | 'photo';
  dureeS: number | null;
  octets: number;
  mime: string | null;
  creeA: string;
  auteur: string;
}

/** La file des appels (statut ouvert par défaut — le modérateur tranche). */
export function fetchAppels(
  statut: 'ouvert' | 'accepte' | 'rejete' = 'ouvert',
): Promise<{ ok: true; appels: AppelAdmin[] }> {
  return appel(`/admin/moderation/appels?statut=${encodeURIComponent(statut)}`);
}

/**
 * Trancher un appel — « accepte » LÈVE la sanction côté serveur
 * (G-MA-6 : zéro trace pour les autres, l'audit interne conserve le trajet).
 */
export function trancherAppel(
  id: string,
  decision: 'accepte' | 'rejete',
): Promise<{ ok: true; sanctionLevee: boolean }> {
  return appel(`/admin/moderation/appels/${encodeURIComponent(id)}`, {
    method: 'POST',
    body: JSON.stringify({ decision }),
  });
}

/**
 * Poser une mesure (N1 Pause Rencontre · N2 Pause complète) liée à un
 * signalement — 409 conflict si une sanction est déjà active pour le compte.
 */
export function poserSanction(
  userId: string,
  niveau: 1 | 2,
  signalementId?: string | null,
  details?: string | null,
): Promise<{ ok: true; sanctionId: string }> {
  return appel('/admin/moderation/sanctions', {
    method: 'POST',
    body: JSON.stringify({ userId, niveau, signalementId: signalementId ?? undefined, details: details ?? undefined }),
  });
}

/** Lever une sanction manuellement (M-5 : toute sanction est révocable). */
export function leverSanction(sanctionId: string): Promise<{ ok: true }> {
  return appel(`/admin/moderation/sanctions/${encodeURIComponent(sanctionId)}/lever`, {
    method: 'POST',
    body: '{}',
  });
}

/** Les métadonnées des médias d'un match signalé (100 max, plus récents d'abord). */
export function fetchMediasDuMatch(matchId: string): Promise<{ ok: true; medias: MediaAdmin[] }> {
  return appel(`/admin/moderation/medias?matchId=${encodeURIComponent(matchId)}`);
}

/**
 * Le FLUX d'un média (G-E3-P9 — unique cas d'accès humain, tracé audit_admin
 * côté serveur AVANT l'envoi). Un <img src> direct ne porterait pas le jeton
 * Bearer : fetch manuel + blob + URL.createObjectURL. L'URL locale ne vit
 * que dans l'onglet (jamais envoyée au réseau).
 */
export async function fetchMediaBlob(mediaId: string): Promise<string> {
  const jeton = jetonAdmin();
  let res: Response;
  try {
    res = await fetch(`/admin/moderation/medias/${encodeURIComponent(mediaId)}`, {
      credentials: 'same-origin',
      headers: jeton ? { authorization: `Bearer ${jeton}` } : {},
    });
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
  const blob = await res.blob();
  return URL.createObjectURL(blob);
}
