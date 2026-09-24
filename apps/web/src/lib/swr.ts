/**
 * Cache « stale-while-revalidate » minimal (Task 28 — performance).
 *
 * Problème : chaque écran re-fetch tout au remount → chaque clic d'onglet
 * affichait un spinner pendant l'aller-retour réseau complet, même 2 secondes
 * après avoir quitté la page.
 *
 * Solution : un store module-level partagé (la SPA vit dans un seul document)
 * — au retour sur un onglet, les données en cache s'affichent INSTANTANÉMENT,
 * puis une revalidation en arrière-plan rafraîchit silencieusement.
 *
 * Garanties :
 *  - déduplication : une seule requête réseau par clé même si 5 composants
 *    s'abonnent (le badge Messages et la page Messages partagent « conversations ») ;
 *  - synchronisation : toute écriture dans le store notifie les abonnés de la
 *    clé (le badge se met à jour quand la page revalide, et inversement) ;
 *  - refresh() dédupliqué ET bridé (5 s) : les appels rafouins (changement de
 *    route, visibilitychange) ne provoquent plus de tempête de requêtes ;
 *  - invalidate() après une mutation locale (édition de profil) pour forcer
 *    un fetch réel au prochain mount.
 *
 * Périmètre volontairement restreint : GET idempotents listés dans
 * SWR_PATHS. Le feed de découverte (état de swipe) reste hors cache.
 */
import { useCallback, useEffect, useRef, useState } from 'react';

interface Entry {
  data: unknown;
  at: number;
}

/** Clés canoniques → chemin API. Une seule source de vérité pour les abonnés. */
export const SWR_PATHS = {
  conversations: '/api/chat/conversations',
  matches: '/api/discover/matches',
  profile: '/api/profile',
  /** Likes reçus en attente (« Tu plais ! ») — badge onglet Likes + page. */
  'likes-me': '/api/discover/likes',
} as const;

export type SwrKey = keyof typeof SWR_PATHS;

const store = new Map<string, Entry>();
const inflight = new Map<string, Promise<unknown>>();
const listeners = new Map<string, Set<() => void>>();

/** Propagation : tout abonné d'une clé est notifié à chaque écriture. */
function emit(key: string): void {
  listeners.get(key)?.forEach((fn) => fn());
}

/** Lecture directe du cache (rendu initial sans état intermédiaire). */
export function peekSwr<T>(key: SwrKey): T | null {
  const e = store.get(key);
  return e ? (e.data as T) : null;
}

/** Écriture directe (mutation locale connue) + notification des abonnés. */
export function setSwr<T>(key: SwrKey, data: T): void {
  store.set(key, { data, at: Date.now() });
  emit(key);
}

/** Invalidation (post-mutation serveur) : le prochain mount re-fetch. */
export function invalidateSwr(key: SwrKey): void {
  store.delete(key);
  emit(key);
}

/** Vidage complet (déconnexion / changement de compte). */
export function clearSwr(): void {
  for (const key of Array.from(store.keys())) {
    store.delete(key);
    emit(key);
  }
  inflight.clear();
}

const REFRESH_MIN_INTERVAL = 5_000;

async function fetchPath<T>(key: SwrKey, path: string): Promise<T> {
  const running = inflight.get(key);
  if (running) return running as Promise<T>;
  const promise = (async () => {
    try {
      const res = await fetch(path, { credentials: 'same-origin' });
      const data: unknown = await res.json().catch(() => null);
      if (!res.ok) {
        const err = (data as { error?: { message?: string } } | null)?.error;
        throw new Error(err?.message ?? 'Une erreur est survenue. Réessaie.');
      }
      store.set(key, { data, at: Date.now() });
      emit(key);
      return data as T;
    } finally {
      inflight.delete(key);
    }
  })();
  inflight.set(key, promise);
  return promise as Promise<T>;
}

export interface SwrResult<T> {
  /** Données à afficher (cache ou fetch) — null si rien encore. */
  data: T | null;
  /** Vrai UNIQUEMENT s'il n'y a rien à afficher (pas de spinner sur cache frais). */
  loading: boolean;
  error: string | null;
  /** Revalidation réseau immédiate (dédupliquée). force=true passe le bridage anti-tempête de 5 s. */
  refresh: (force?: boolean) => void;
}

/**
 * Hook stale-while-revalidate :
 *  - mount avec cache → rendu immédiat, revalidation en arrière-plan si âge > ttlMs ;
 *  - mount sans cache → fetch (loading) ;
 *  - tous les abonnés d'une clé sont notifiés à chaque écriture.
 */
export function useSwr<T>(key: SwrKey, enabled: boolean, opts?: { ttlMs?: number }): SwrResult<T> {
  const ttlMs = opts?.ttlMs ?? 15_000;
  const [data, setData] = useState<T | null>(() => (enabled ? peekSwr<T>(key) : null));
  const [loading, setLoading] = useState<boolean>(() => enabled && peekSwr<T>(key) === null);
  const [error, setError] = useState<string | null>(null);
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  const refresh = useCallback(
    (force = false) => {
      if (!enabled) return;
      const at = store.get(key)?.at ?? 0;
      if (!force && Date.now() - at < REFRESH_MIN_INTERVAL) return; // frais — requête inutile
      fetchPath<T>(key, SWR_PATHS[key])
        .then((d) => {
          if (alive.current) {
            setData(d);
            setLoading(false);
            setError(null);
          }
        })
        .catch((e: unknown) => {
          if (alive.current) {
            setError(e instanceof Error ? e.message : 'Erreur inattendue.');
            setLoading(false);
          }
        });
    },
    [key, enabled],
  );

  // Mount / changement de clé : rendu instantané depuis le cache + revalidation.
  useEffect(() => {
    if (!enabled) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }
    const cached = peekSwr<T>(key);
    setData(cached);
    setLoading(cached === null);
    const at = store.get(key)?.at ?? 0;
    if (cached === null || Date.now() - at > ttlMs) refresh();
  }, [key, enabled, ttlMs, refresh]);

  // Abonnement : les écritures d'AUTRES composants (badge ↔ page) se propagent.
  useEffect(() => {
    if (!enabled) return;
    const onUpdate = () => {
      const e = store.get(key);
      if (e) {
        setData(e.data as T);
        setLoading(false);
      }
    };
    let set = listeners.get(key);
    if (!set) {
      set = new Set();
      listeners.set(key, set);
    }
    set.add(onUpdate);
    return () => {
      set?.delete(onUpdate);
    };
  }, [key, enabled]);

  return { data, loading, error, refresh };
}
