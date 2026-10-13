/**
 * État des quêtes — réponses, complétion, carte obtenue.
 *
 * STOCKAGE : localStorage (`wairyu.quete.{id}`) +, DEPUIS LA TASK 69-c (GO
 * fondateur : « la vraie sauvegarde qui te suit partout »), MIROIR D1 rattaché
 * au COMPTE — chaque persiste() pousse vers /api/reponses (fire-and-forget,
 * via lib/sync-reponses.ts) et chaque connexion restaure les états plus
 * récents du compte. Le localStorage reste la vérité de session et le JSON
 * porte `majA` (ISO) qui arbitre les conflits — quête par quête, le plus
 * récent gagne.
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

/** Les écouteurs de persistance (Task 69-c) — lib/sync-reponses.ts s'y inscrit
 *  pour pousser chaque état vers D1 (fire-and-forget, jamais bloquant). */
const ecouteursPersiste = new Set<(id: string, etat: EtatQuete) => void>();

/** S'abonne aux persistes (localStorage + mémoire) — retourne la désinscription. */
export function surPersiste(ecouter: (id: string, etat: EtatQuete) => void): () => void {
  ecouteursPersiste.add(ecouter);
  return () => {
    ecouteursPersiste.delete(ecouter);
  };
}

/** S'abonne aux changements d'état — le bus partagé par tous les hooks de
 *  l'app (useEtatQuete, useProgression). Retourne la désinscription. */
export function souscrireEtat(abonner: () => void): () => void {
  abonnes.add(abonner);
  return () => {
    abonnes.delete(abonner);
  };
}

/** Lecture EN CACHE (identité stable par quête) — pour les lectures dérivées
 *  (useProgression) et le routage. */
export function etatDe(id: string): EtatQuete {
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
      // `majA` (ISO) voyage dans le JSON SANS entrer dans l'objet mémoire :
      // c'est l'arbitre « plus récent gagne » de la sauvegarde D1 (Task 69-c).
      window.localStorage.setItem(cle(id), JSON.stringify({ ...e, majA: new Date().toISOString() }));
    } catch {
      /* stockage indisponible — l'état vit pour la session */
    }
    abonnes.forEach((a) => a());
    ecouteursPersiste.forEach((ec) => ec(id, e));
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

/** Efface tout (bouton « Effacer mes réponses et recommencer »).
 *  L'état vide persisté pousse l'écouteur sync (PUT vide ou DELETE —
 *  lib/sync-reponses.ts décide) : la sauvegarde suit l'effacement. */
export function reinitialiserQuete(id: string): void {
  etats.set(id, etatInitial());
  persiste(id);
}

/** Le `majA` local (ISO) — l'horodatage de la dernière persistance, arbitre
 *  du conflit avec D1. Absent pour les états d'avant la Task 69-c. */
export function lireMajA(id: string): string | null {
  try {
    const brut = window.localStorage.getItem(cle(id));
    if (!brut) return null;
    const majA = (JSON.parse(brut) as { majA?: unknown }).majA;
    return typeof majA === 'string' ? majA : null;
  } catch {
    return null;
  }
}

/** Importe un état distant (restauration D1 — Task 69-c) : pose le cache, le
 *  localStorage (avec le majA DISTANT, pour que le prochain conflit arbitre
 *  bien) et prévient les abonnés. Le contenu distant a déjà été audité côté
 *  API ; on re-passe par la même lecture défensive que le local. */
export function importerEtatDistant(id: string, etat: EtatQuete, majADistant: string): void {
  etats.set(id, etat);
  try {
    window.localStorage.setItem(cle(id), JSON.stringify({ ...etat, majA: majADistant }));
  } catch {
    /* stockage indisponible — l'état vit pour la session */
  }
  abonnes.forEach((a) => a());
}

/** Hook réactif — snapshot par identité, re-rendu sur changement réel. */
export function useEtatQuete(id: string): EtatQuete {
  return useSyncExternalStore(souscrireEtat, () => etatDe(id), () => etatDe(id));
}
