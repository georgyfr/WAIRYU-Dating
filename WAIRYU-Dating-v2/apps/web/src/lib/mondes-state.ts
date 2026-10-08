/**
 * État « monde en cours » — localStorage `wairyu.mondes.statuts`.
 *
 * INTERIMAIRE (documenté) : migrera vers D1 avec le système de quêtes serveur.
 * L'état est posé par l'UTILISATEUR (il clique « Commencer le monde »), jamais
 * inventé par l'app — honnêteté §12-§13.
 *
 * RECONSTITUTION (5ᵉ reset sandbox) — fidèle au bundle staging Task 27.
 */

import { useSyncExternalStore } from 'react';

const CLE = 'wairyu.mondes.statuts';

/** Codes de mondes engagés (M1…) — le premier monde ouvert pose l'état. */
type StatutsMondes = Record<string, true>;

function lire(): StatutsMondes {
  try {
    const brut = window.localStorage.getItem(CLE);
    if (!brut) return {};
    const p = JSON.parse(brut) as unknown;
    if (p && typeof p === 'object' && !Array.isArray(p)) {
      const o = p as Record<string, unknown>;
      const statuts: StatutsMondes = {};
      for (const [k, v] of Object.entries(o)) if (v === true) statuts[k] = true;
      return statuts;
    }
    return {};
  } catch {
    return {};
  }
}

let statuts: StatutsMondes = lire();
const abonnes = new Set<() => void>();

function persiste(): void {
  try {
    window.localStorage.setItem(CLE, JSON.stringify(statuts));
  } catch {
    /* stockage indisponible */
  }
  abonnes.forEach((a) => a());
}

/** Pose l'état « monde en cours » (idempotent). */
export function marquerMondeEnCours(code: string): void {
  if (statuts[code]) return;
  statuts = { ...statuts, [code]: true };
  persiste();
}

export function useStatutsMondes(): StatutsMondes {
  return useSyncExternalStore(
    (abonner) => {
      abonnes.add(abonner);
      return () => {
        abonnes.delete(abonner);
      };
    },
    () => statuts,
    () => statuts,
  );
}
