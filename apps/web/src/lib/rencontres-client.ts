/**
 * Rencontre-E1 (Task 94) — le client de l'espace Rencontre (#/matchs).
 *
 * SPEC : docs/SPEC-RENONCONTRE-E1.v1.md. Le serveur (GET /api/rencontres/pool)
 * est la SOURCE DE VÉRITÉ du déblocage (jalon A = Miroir 3/3, dérivé de la
 * table `reponses`) — le local (progression.ts) ne décide que de la
 * VISIBILITÉ de l'onglet, jamais du contenu du pool.
 *
 * La session vit dans le cookie httpOnly `wairyu_s` (comme auth-client) :
 * `credentials: 'same-origin'`, AUCUN token en JS.
 *
 * Doctrine : D-R3 — jamais de rencontre inventée ; D-R4 — aucun score
 * (la profondeur TRIE côté serveur, elle ne note rien) ; le pas est
 * AVEUGLE côté destinataire (P4).
 */

export interface MondeMembre {
  /** Code interne du monde ('M1'…). */
  code: string;
  faites: number;
  total: number;
  termine: boolean;
}

export interface MembrePool {
  /** L'identifiant technique (cible de POST /api/rencontres/pas). */
  id: string;
  /** Le pseudo d'affichage (display_name, sinon @pseudo) — null = anonyme technique. */
  pseudo: string | null;
  /** La profondeur du voyage, par monde livré. */
  mondes: MondeMembre[];
  mondesFranchis: number;
  /** Jalon B — le bloc 1.x (le Volant) est complet. */
  jalonB: boolean;
  /** J'ai déjà fait un pas vers cette personne (actif ou consommé par un match). */
  pasEnvoye: boolean;
  /** L'id de MON pas actif (pour le retrait) — null sinon. */
  pasId: string | null;
  /** Match réciproque entre nous deux. */
  match: boolean;
  matchA: string | null;
  /** Membre depuis (ISO). */
  depuisA: string;
}

export interface MatchRencontre {
  id: string;
  creeA: string;
  autre: { id: string; pseudo: string | null };
}

export interface ReponsePool {
  ok: boolean;
  /** Jalon A — la porte est ouverte pour moi (Miroir 3/3 côté serveur). */
  jalonA: boolean;
  /** Jalon B — le Volant est complet. */
  jalonB: boolean;
  /** Les pas reçus, AVEUGLES : un compte, jamais un nom (P4). */
  pasRecus: number;
  total: number;
  pool: MembrePool[];
  matchs: MatchRencontre[];
  moi: { mondes: MondeMembre[]; mondesFranchis: number; jalonB: boolean };
}

async function lireCorps<T>(res: Response): Promise<T> {
  try {
    return (await res.json()) as T;
  } catch {
    throw new Error(`rencontres:réponse-illisible (${res.status})`);
  }
}

/** Charge le pool — porte fermée incluse (jalonA:false, pool vide). */
export async function chargerPool(): Promise<ReponsePool> {
  const res = await fetch('/api/rencontres/pool', { credentials: 'same-origin' });
  if (!res.ok) {
    const corps = await lireCorps<{ error?: string }>(res).catch(() => ({}) as { error?: string });
    throw new Error(corps.error ?? `pool_${res.status}`);
  }
  return lireCorps<ReponsePool>(res);
}

/** Faire le premier pas vers un membre du pool. `match:true` = réciprocité. */
export async function faireUnPas(vers: string): Promise<{ ok: boolean; match: boolean }> {
  const res = await fetch('/api/rencontres/pas', {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ vers }),
  });
  const corps = await lireCorps<{ ok: boolean; match?: boolean; error?: string }>(res);
  if (!res.ok || !corps.ok) throw new Error(corps.error ?? `pas_${res.status}`);
  return { ok: true, match: corps.match === true };
}

/** Retirer mon pas actif (tant qu'il n'est pas devenu un match). */
export async function retirerPas(id: string): Promise<void> {
  const res = await fetch(`/api/rencontres/pas/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    credentials: 'same-origin',
  });
  if (!res.ok) {
    const corps = await lireCorps<{ error?: string }>(res).catch(() => ({}) as { error?: string });
    throw new Error(corps.error ?? `retrait_${res.status}`);
  }
}
