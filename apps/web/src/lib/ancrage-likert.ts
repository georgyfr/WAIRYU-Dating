/**
 * L'ANCRAGE DES BARRES — « Tes réponses qui pèsent le plus » (Task 65,
 * demande fondateur : les résultats doivent prouver, pas affirmer).
 *
 * PRINCIPE : sous chaque barre de tendance, citer les réponses RÉELLES du
 * membre qui pèsent le plus dans le chiffre — l'énoncé verbatim de l'item +
 * le libellé exact de l'échelle choisi. Aucune reformulation, aucun texte
 * généré : le membre vérifie lui-même d'où vient sa barre.
 *
 * MÉTHODE (pure, sans effet de bord) : pour chaque item de la dimension, la
 * contribution du Livrable (recodage D/I, 0-1) est comparée à 0.5 — les plus
 * TRANCHÉES (|c − 0.5| max) sont citées en premier. Une réponse neutre (3)
 * pèse peu et n'est citée que faute de mieux.
 *
 * PÉRIMÈTRE : les quêtes Likert à items typés (orient/dim) — 1.1, 1.2, 1.3.
 * Les autres formats (choix, écrans, points) n'ont pas d'ancrage (renvoie
 * vide — la page ne rend rien). AUCUN item/scorer/sélecteur modifié : ce
 * module LIT seulement.
 */

import { LIKERT } from './quetes';
import * as Q11 from './quete-1-1';
import * as Q12 from './quete-1-2';
import * as Q13 from './quete-1-3';

/** La forme minimale lue par l'ancrage — tous les items Likert M1 la portent. */
export interface ItemAncrage {
  code: string;
  text: string;
  orient: 'D' | 'I';
  dim: string;
}

export interface LigneAncrage {
  code: string;
  /** L'énoncé verbatim de l'item (bilingue — le module Items porte avecEN). */
  enonce: string;
  /** Le libellé exact de l'échelle choisi par le membre (bilingue). */
  reponse: string;
  /** Le SENS de la contribution : 'haut' (≥ 0.75 — pousse la barre vers le
   *  haut), 'bas' (≤ 0.25 — pousse vers le bas), sinon null (milieu). Les
   *  items inversés répondus extrêmes apparaissent en 'bas'/'haut' — c'est la
   *  mécanique réelle, affichée telle quelle (transparence anti-barnum). */
  sens: 'haut' | 'bas' | null;
  /** La réponse la plus tranchée de la dimension est-elle vraiment tranchée ?
   *  faux → la dim n'a que des réponses proches du milieu (titre sobre). */
  tranche: boolean;
}

/** Les registres d'items typés, par identifiant de quête. */
const ITEMS_ANCRAGE: Record<string, readonly ItemAncrage[]> = {
  '1.1': Q11.ITEMS,
  '1.2': Q12.ITEMS,
  '1.3': Q13.ITEMS,
};

/** Les items typés de la quête — null si le format n'a pas d'ancrage. */
export function itemsAncrageDe(id: string): readonly ItemAncrage[] | null {
  return ITEMS_ANCRAGE[id] ?? null;
}

function libelleReponse(valeur: number): string {
  return LIKERT.find((l) => l.value === valeur)?.label ?? String(valeur);
}

/** Contribution du Livrable : D → (r−1)/4 · I → (5−r)/4, toujours en 0-1. */
function contribution(reponse: number, orient: 'D' | 'I'): number {
  return ((orient === 'D' ? reponse : 6 - reponse) - 1) / 4;
}

/** Les lignes d'ancrage d'une dimension — les `max` réponses les plus
 *  tranchées, de la plus informative à la moins informative. Le sens de
 *  chaque contribution est posé (haut/bas/milieu) et l'indicateur `tranche`
 *  dit si la dimension a au moins une réponse vraiment marquée. */
export function lignesAncrage(
  items: readonly ItemAncrage[],
  reponses: Record<string, number>,
  dimKey: string,
  max = 2,
): LigneAncrage[] {
  const candidates = items
    .filter((it) => it.dim === dimKey)
    .map((it) => {
      const r = reponses[it.code];
      const ok = typeof r === 'number' && r >= 1 && r <= 5;
      const c = ok ? contribution(r, it.orient) : 0.5;
      return { it, r: ok ? (r as number) : null, info: Math.abs(c - 0.5), c };
    })
    .filter((x) => x.r !== null)
    .sort((a, b) => b.info - a.info)
    .slice(0, max);
  const tranche = candidates.length > 0 && candidates[0].info >= 0.25;
  return candidates.map(({ it, r, c }) => ({
    code: it.code,
    enonce: it.text,
    reponse: libelleReponse(r as number),
    sens: c >= 0.75 ? 'haut' : c <= 0.25 ? 'bas' : null,
    tranche,
  }));
}

/** L'ancrage complet d'une quête : par clé de dimension, les lignes citées.
 *  Renvoie null pour les quêtes sans items typés (aucun bloc rendu). */
export function ancragesDeQuete(
  id: string,
  reponses: Record<string, number>,
): Record<string, LigneAncrage[]> | null {
  const items = itemsAncrageDe(id);
  if (!items) return null;
  const dims = new Set(items.map((it) => it.dim));
  const out: Record<string, LigneAncrage[]> = {};
  for (const dim of dims) out[dim] = lignesAncrage(items, reponses, dim);
  return out;
}
