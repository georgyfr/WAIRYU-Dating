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

/** La validation d'une tendance par l'utilisateur (Task 33 — « Est-ce que ça
 *  te ressemble ? ») : 1 = ça me ressemble · 2 = parfois · 3 = pas. */
export type Lecture = 1 | 2 | 3;

export interface EtatQuete {
  /** Réponses par code d'item (1-5 — Likert verbatim ; index d'option pour les
   *  formats à options ; points pour le jeu d'arbitrage 2.6). */
  reponses: Record<string, number>;
  terminee: boolean;
  /** L'id de variante de carte obtenue ('V1'…), posé à la complétion. */
  carteId: string | null;
  termineeA: string | null;
  /** L'auto-validation par dimension (clé O/C/E/A/S…) — l'utilisateur devient
   *  acteur de la lecture de son profil. Rétrocompatible : absent = pas encore
   *  posé (l'utilisateur peut le laisser vide). */
  lectures: Record<string, Lecture>;
  /** Les textes libres par code d'item (Monde 3 — Q2.3-10 « Une autre ligne
   *  rouge, dans tes mots. ») : les mots de la personne, JAMAIS reformulés,
   *  hors computation (Livrable 2.3 — jamais parsé par les filtres).
   *  Rétrocompatible : absent = pas encore posé. */
  textes?: Record<string, string>;
}

const cle = (id: string): string => `wairyu.quete.${id}`;

function etatInitial(): EtatQuete {
  return { reponses: {}, terminee: false, carteId: null, termineeA: null, lectures: {} };
}

function lire(id: string): EtatQuete {
  const vide = etatInitial();
  try {
    const brut = window.localStorage.getItem(cle(id));
    if (!brut) return vide;
    const p = JSON.parse(brut) as unknown;
    if (p && typeof p === 'object' && !Array.isArray(p)) {
      const o = p as Record<string, unknown>;
      const lectures: Record<string, Lecture> = {};
      if (o.lectures && typeof o.lectures === 'object' && !Array.isArray(o.lectures)) {
        for (const [k, v] of Object.entries(o.lectures as Record<string, unknown>)) {
          if (v === 1 || v === 2 || v === 3) lectures[k] = v;
        }
      }
      const textes: Record<string, string> = {};
      if (o.textes && typeof o.textes === 'object' && !Array.isArray(o.textes)) {
        for (const [k, v] of Object.entries(o.textes as Record<string, unknown>)) {
          if (typeof v === 'string' && v.length <= 500) textes[k] = v;
        }
      }
      return {
        reponses: o.reponses && typeof o.reponses === 'object' ? (o.reponses as Record<string, number>) : {},
        terminee: o.terminee === true,
        carteId: typeof o.carteId === 'string' ? o.carteId : null,
        termineeA: typeof o.termineeA === 'string' ? o.termineeA : null,
        lectures,
        ...(Object.keys(textes).length > 0 ? { textes } : {}),
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

/** Enregistre (ou remplace) la validation d'une tendance (« ça me ressemble »). */
export function enregistrerLecture(id: string, dimKey: string, lecture: Lecture): void {
  const e = etatDe(id);
  etats.set(id, { ...e, lectures: { ...e.lectures, [dimKey]: lecture } });
  persiste(id);
}

/** Enregistre (ou remplace) un texte libre (Q2.3-10 — les mots de la personne,
 *  jamais reformulés, jamais parsés). Vide = retire la clé. */
export function enregistrerTexte(id: string, code: string, texte: string): void {
  const e = etatDe(id);
  const textes = { ...(e.textes ?? {}) };
  if (texte.trim().length > 0) {
    textes[code] = texte.slice(0, 500);
  } else {
    delete textes[code];
  }
  etats.set(id, { ...e, textes });
  persiste(id);
}

/** Marque la quête terminée (une seule fois — la carte obtenue ne bouge plus). */
export function marquerTerminee(id: string, carteId: string | null): void {
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
