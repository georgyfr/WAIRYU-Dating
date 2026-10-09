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
 *  traverse M1 puis M2 ; la 2.x = M3 ; 1.8 n'existe pas au Livrable). */
const QUIDS_PAR_MONDE: ReadonlyArray<readonly IdQuete[]> = [
  ['1.1', '1.2', '1.3'], // M1 « Le Miroir »
  ['1.4', '1.5', '1.6', '1.7', '1.9', '1.10', '1.11'], // M2 « Le Volant »
  ['2.1', '2.2', '2.3', '2.4', '2.5', '2.6', '2.7', '2.8'], // M3 « La Boussole »
];

function calculer(): Progression {
  const terminees = QUETE_IDS.filter((id) => etatDe(id).terminee);
  const recolte = terminees.filter((id) => {
    const e = etatDe(id);
    return !QUETES[id].sansCarte && !!e.carteId && !!QUETES[id].cartes[e.carteId];
  }).length;
  return {
    worldsDone: QUIDS_PAR_MONDE.filter((ids) => ids.every((id) => etatDe(id).terminee)).length,
    stepsDone: terminees.length,
    recolte,
  };
}

/** Signature PRIMITIVE de l'état (stable par Object.is — exigence du store). */
function signature(): string {
  return QUETE_IDS.map((id) => (etatDe(id).terminee ? '1' : '0')).join('');
}

let cache: { sig: string; valeur: Progression } | null = null;

function snapshot(): Progression {
  const sig = signature();
  if (cache === null || cache.sig !== sig) cache = { sig, valeur: calculer() };
  return cache.valeur;
}

/** La progression RÉELLE du voyageur — réactive, partagée par tous les écrans. */
export function useProgression(): Progression {
  return useSyncExternalStore(souscrireEtat, snapshot, snapshot);
}
