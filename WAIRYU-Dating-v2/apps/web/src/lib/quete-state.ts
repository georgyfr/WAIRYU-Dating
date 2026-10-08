/**
 * État des quêtes — réponses, complétion, carte obtenue.
 *
 * STOCKAGE INTERIMAIRE : localStorage (`wairyu.quete.{id}`) — migrera vers D1
 * quand le moteur de quêtes serveur sera branché (documenté, assumé : aucune
 * donnée inventée, l'état est posé par les réponses réelles de l'utilisateur).
 *
 * La clé de la quête 1.1 (`wairyu.quete.1.1`) est CONSERVÉE à l'identique de la
 * version d'origine : les données existantes des voyageurs restent intactes.
 *
 * RECONSTITUTION (5ᵉ reset sandbox) — fidèle au bundle staging Task 27.
 */

import { useSyncExternalStore } from 'react';

export interface EtatQuete {
  /** Réponses par code d'item (1-5 — Likert verbatim). */
  reponses: Record<string, number>;
  terminee: boolean;
  /** L'id de variante de carte obtenue ('V1'…), posé à la complétion. */
  carteId: string | null;
  termineeA: string | null;
}

const cle = (id: string): string => `wairyu.quete.${id}`;

function etatInitial(): EtatQuete {
  return { reponses: {}, terminee: false, carteId: null, termineeA: null };
}

function lire(id: string): EtatQuete {
  const vide = etatInitial();
  try {
    const brut = window.localStorage.getItem(cle(id));
    if (!brut) return vide;
    const p = JSON.parse(brut) as unknown;
    if (p && typeof p === 'object' && !Array.isArray(p)) {
      const o = p as Record<string, unknown>;
      return {
        reponses: o.reponses && typeof o.reponses === 'object' ? (o.reponses as Record<string, number>) : {},
        terminee: o.terminee === true,
        carteId: typeof o.carteId === 'string' ? o.carteId : null,
        termineeA: typeof o.termineeA === 'string' ? o.termineeA : null,
      };
    }
    return vide;
  } catch {
    return vide;
  }
}

const etats = new Map<string, EtatQuete>();
const abonnes = new Set<() => void>();

function etatDe(id: string): EtatQuete {
  let e = etats.get(id);
  if (!e) {
    e = lire(id);
    etats.set(id, e);
  }
  return e;
}

/** Lecture BRUTE (sans cache) — pour le routage au démarrage (deep-links). */
export function lireEtatQuete(id: string): EtatQuete {
  return lire(id);
}

function persiste(id: string): void {
  const e = etats.get(id);
  if (e) {
    try {
      window.localStorage.setItem(cle(id), JSON.stringify(e));
    } catch {
      /* stockage indisponible — l'état vit pour la session */
    }
    abonnes.forEach((a) => a());
  }
}

/** Enregistre (ou remplace) la réponse à un item. */
export function enregistrerReponse(id: string, code: string, valeur: number): void {
  const e = etatDe(id);
  etats.set(id, { ...e, reponses: { ...e.reponses, [code]: valeur } });
  persiste(id);
}

/** Marque la quête terminée (une seule fois — la carte obtenue ne bouge plus). */
export function marquerTerminee(id: string, carteId: string): void {
  const e = etatDe(id);
  if (e.terminee) return;
  etats.set(id, { ...e, terminee: true, carteId, termineeA: new Date().toISOString() });
  persiste(id);
}

/** Efface tout (bouton « Effacer mes réponses et recommencer »). */
export function reinitialiserQuete(id: string): void {
  etats.set(id, etatInitial());
  persiste(id);
}

/** Hook réactif — snapshot par identité, re-rendu sur changement réel. */
export function useEtatQuete(id: string): EtatQuete {
  return useSyncExternalStore(
    (abonner) => {
      abonnes.add(abonner);
      return () => {
        abonnes.delete(abonner);
      };
    },
    () => etatDe(id),
    () => etatDe(id),
  );
}
