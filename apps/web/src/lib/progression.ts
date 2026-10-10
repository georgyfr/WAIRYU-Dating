/**
 * La progression RÉELLE du voyageur — dérivée de l'état des quêtes
 * (`wairyu.quete.{id}`, lib/quete-state.ts).
 *
 * REMPLACE le constant PROGRESS de lib/voyage.ts (figé à zéro — son
 * commentaire « INTERIMAIRE » l'annonçait : « alimentera les écrans dès que
 * les mondes seront franchis »). C'est la correction du journal de bord
 * (#/parcourus) : malgré les quêtes terminées, les compteurs restaient à 0.
 *
 * Définitions (état RÉEL, jamais inventé) :
 *  - stepsDone  : les quêtes TERMINÉES (etat.terminee) parmi les quêtes
 *                 ouvertes (QUETE_IDS — 18 aujourd'hui, sur les 50 du
 *                 Livrable ; le 51ᵉ pas est la Rencontre).
 *  - worldsDone : les mondes FRANCHIS — toutes les quêtes livrées du monde
 *                 sont terminées (M1 : 1.1→1.3 · M2 : 1.4→1.11 · M3 : 2.1→2.8).
 *  - recolte    : les cartes OBTENUES — les écrans sans carte (1.7, 1.11,
 *                 2.8) ne produisent pas de carte.
 *  - parMonde   : le progrès RÉEL PAR MONDE livré ({faites, total,
 *                 derniereA}) — l'atlas (#/mondes) montre l'avancement
 *                 DÈS LA PREMIÈRE quête terminée, pas seulement à la
 *                 clôture complète du monde (remontée fondateur : un monde
 *                 engagé restait muet — aucun chip, bouton « Commencer »
 *                 comme vierge — tant que toutes ses quêtes n'étaient pas
 *                 posées).
 *
 * derniereA = la complétion la plus récente du monde (max des termineeA,
 * ISO 8601 ⇒ la comparaison lexicale est sûre) — la DATE de clôture réelle,
 * affichée sur la fiche du monde traversé.
 *
 * Réactivité : le MÊME bus d'abonnés que useEtatQuete — chaque réponse
 * enregistrée ou quête terminée recalcule la progression partout. Le
 * snapshot est MIS EN CACHE par une signature primitive (useSyncExternalStore
 * l'exige : un objet neuf à chaque lecture déclencherait une boucle de rendu).
 */

import { useSyncExternalStore } from 'react';
import { QUETE_IDS, QUETES } from './quetes';
import type { IdQuete } from './quetes';
import { etatDe, souscrireEtat } from './quete-state';
import type { Progression } from './voyage';

/** Les quêtes livrées par monde, dans l'ordre de la chaîne (la série 1.x
 *  traverse M1 puis M2 ; la 2.x = M3 ; la 3.x = M4 ; la 4.x = M5 — sans la
 *  quête invisible 4.4 ; 1.8 n'existe pas au Livrable). */
const QUIDS_PAR_MONDE: ReadonlyArray<readonly IdQuete[]> = [
  ['1.1', '1.2', '1.3'], // M1 « Le Miroir »
  ['1.4', '1.5', '1.6', '1.7', '1.9', '1.10', '1.11'], // M2 « Le Volant »
  ['2.1', '2.2', '2.3', '2.4', '2.5', '2.6', '2.7', '2.8'], // M3 « La Boussole »
  ['3.1', '3.2', '3.3', '3.4', '3.5', '3.6', '3.7'], // M4 « Ton Terrain »
  ['4.1', '4.2', '4.3'], // M5 « Ton Héritage » (4.4 invisible — tissée)
];

/** Les CODES de mondes livrés, alignés sur QUIDS_PAR_MONDE (M1, M2, M3, M4, M5). */
const CODES_PAR_MONDE: readonly string[] = ['M1', 'M2', 'M3', 'M4', 'M5'];

/** Le progrès RÉEL d'un monde livré — compté depuis l'état des quêtes. */
export interface ProgresMonde {
  /** Les quêtes TERMINÉES du monde. */
  faites: number;
  /** Les quêtes LIVRÉES du monde (la fiche du monde en affiche autant). */
  total: number;
  /** La complétion la plus récente (max des termineeA) — la date de clôture
   *  réelle du monde (affichée sur sa fiche quand TOUTES les quêtes y sont). */
  derniereA: string | null;
}

export interface ProgressionDetail extends Progression {
  /** Le progrès par monde livré, par CODE ('M1'…) — absent = monde non livré
   *  (M4-M11 : rien n'est jouable, aucun progrès possible). */
  parMonde: Record<string, ProgresMonde>;
  /** Une quête est ENGAGÉE (non terminée avec au moins une réponse) — le
   *  point corail de l'onglet Quête, couvrant LES 18 quêtes ouvertes
   *  (Task 45 : la détection ne couvrait que les 3 quêtes du Monde 1). */
  engagee: boolean;
}

function calculer(): ProgressionDetail {
  const terminees = QUETE_IDS.filter((id) => etatDe(id).terminee);
  const recolte = terminees.filter((id) => {
    const e = etatDe(id);
    return !QUETES[id].sansCarte && !!e.carteId && !!QUETES[id].cartes[e.carteId];
  }).length;
  const parMonde: Record<string, ProgresMonde> = {};
  QUIDS_PAR_MONDE.forEach((ids, i) => {
    const faites = ids.filter((id) => etatDe(id).terminee);
    let derniereA: string | null = null;
    for (const id of faites) {
      const a = etatDe(id).termineeA;
      if (a && (!derniereA || a > derniereA)) derniereA = a;
    }
    parMonde[CODES_PAR_MONDE[i]] = { faites: faites.length, total: ids.length, derniereA };
  });
  return {
    worldsDone: QUIDS_PAR_MONDE.filter((ids) => ids.every((id) => etatDe(id).terminee)).length,
    stepsDone: terminees.length,
    recolte,
    parMonde,
    engagee: QUETE_IDS.some((id) => {
      const e = etatDe(id);
      return !e.terminee && Object.keys(e.reponses).length > 0;
    }),
  };
}

/** Signature PRIMITIVE de l'état (stable par Object.is — exigence du store).
 *  '1' = terminée · 'r' = engagée (des réponses, pas encore terminée) ·
 *  '0' = vierge — le point « quête en cours » est réactif à la 1ʳᵉ réponse. */
function signature(): string {
  return QUETE_IDS.map((id) => {
    const e = etatDe(id);
    return e.terminee ? '1' : Object.keys(e.reponses).length > 0 ? 'r' : '0';
  }).join('');
}

let cache: { sig: string; valeur: ProgressionDetail } | null = null;

function snapshot(): ProgressionDetail {
  const sig = signature();
  if (cache === null || cache.sig !== sig) cache = { sig, valeur: calculer() };
  return cache.valeur;
}

/** La progression RÉELLE du voyageur — réactive, partagée par tous les écrans. */
export function useProgression(): Progression {
  return useSyncExternalStore(souscrireEtat, snapshot, snapshot);
}

/** La progression RÉELLE + le détail PAR MONDE (l'atlas #/mondes, la fiche
 *  WorldModal) — même bus, même cache que useProgression. */
export function useProgressionDetail(): ProgressionDetail {
  return useSyncExternalStore(souscrireEtat, snapshot, snapshot);
}
