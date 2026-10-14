/**
 * LES SOURCES DES CHAMPS — « D'après tes réponses » (Task 77, demande
 * fondateur : « dans chaque champ, tu ajoutes les sources des questions sur
 * lesquelles tu t'es appuyé pour donner de telles réponses » — anti-barnum).
 *
 * PRINCIPE : sous chaque champ du profil (Ta force, Là où ça peut se
 * compliquer, En couple, Ce que ce profil te souffle, Ta zone d'ombre en
 * relation), citer les réponses RÉELLES du membre — l'énoncé verbatim de
 * l'item + le libellé exact de l'échelle choisi — prises dans les AXES que le
 * champ lit. Aucune reformulation, aucun texte généré : le membre vérifie
 * lui-même d'où vient chaque phrase. AUCUN item/scorer/sélecteur modifié :
 * ce module LIT seulement (même discipline que ancrage-likert.ts).
 *
 * LE MAPPING (champ → axes) est éditorial mais VÉRIFIABLE : chaque axe listé
 * porte le contenu du champ — relis les items de l'axe (les énoncés cités à
 * l'écran le prouvent). Il suit la sémantique du moule fondateur :
 *  - 1.1 (O ouverture / C organisation / E énergie sociale / A franchise
 *    bienveillante / S stabilité émotionnelle) : la force = ce que tu rends
 *    possible autour de toi ; les freines = le revers, quand ça coince ;
 *    le couple = la dynamique à deux ; l'équilibre = le geste qui équilibre ;
 *    l'ombre = le risque relationnel.
 *  - 1.2 (A réassurance / E espace) : le profil ENTIER dérive du motif
 *    réassurance × espace (sélecteur verbatim) — tous les champs lisent les
 *    deux axes, c'est le même fondement, assumé.
 *
 * SÉLECTION DES LIGNES : mécanique, héritée de lignesAncrage (max 1 par axe)
 * — la réponse la plus TRANCHÉE de l'axe (|contribution − 0.5| max). Une
 * réponse neutre n'est citée que faute de mieux (discipline de l'ancrage).
 *
 * PÉRIMÈTRE : les quêtes à la NOUVELLE VOIX seulement (1.1, 1.2). Les autres
 * quêtes renvoient vide (rien de rendu) — leurs résultats garderont leurs
 * sources quand leur réécriture arrivera (décision fondateur Task 75).
 */

import { itemsAncrageDe, lignesAncrage, type LigneAncrage } from './ancrage-likert';

/** Les champs du profil qui portent des sources. */
export type ChampProfil = 'force' | 'freines' | 'couple' | 'equilibre' | 'ombre';

/** Une ligne de source : la ligne d'ancrage + l'axe dont elle vient. */
export interface LigneSource extends LigneAncrage {
  dim: string;
}

/** Le mapping champ → axes, par variante (clés = ids de cartes du Livrable). */
type MapChamps = Record<ChampProfil, readonly string[]>;

const DEUX_AXES: MapChamps = {
  force: ['A', 'E'],
  freines: ['A', 'E'],
  couple: ['A', 'E'],
  equilibre: ['A', 'E'],
  ombre: ['A', 'E'],
};

const MAPPING: Record<string, Record<string, MapChamps>> = {
  '1.1': {
    // V1 Élan chaleureux (O≥0.65 & A≥0.6) — l'élan ouvre (O) et embarque (E).
    V1: {
      force: ['O', 'E'],
      freines: ['O', 'C'],
      couple: ['O', 'E'],
      equilibre: ['C', 'S'],
      ombre: ['O', 'E'],
    },
    // V2 Bâtisseur (C≥0.65 & S≥0.6) — la parole qui tient (C) et son coût.
    V2: {
      force: ['C', 'A'],
      freines: ['C', 'S'],
      couple: ['C', 'A'],
      equilibre: ['C', 'S'],
      ombre: ['C', 'S'],
    },
    // V3 Étoile sociale (E≥0.65 & O≥0.6) — l'énergie qui anime, et le
    // silence qui attend (le frein parle d'écoute → A).
    V3: {
      force: ['E', 'O'],
      freines: ['E', 'A'],
      couple: ['E', 'O'],
      equilibre: ['E', 'S'],
      ombre: ['E', 'S'],
    },
    // V4 Ancre (S≥0.6 & A≥0.55) — le calme qui porte, et soi qui passe
    // en dernier : tout le profil vit sur S × A.
    V4: {
      force: ['S', 'A'],
      freines: ['S', 'A'],
      couple: ['S', 'A'],
      equilibre: ['S', 'A'],
      ombre: ['S', 'A'],
    },
    // V5 Intense (S<0.4 & E ou O) — le volume du ressenti (S) et son
    // expression (E) ; le geste qui aide l'autre (A).
    V5: {
      force: ['S', 'A'],
      freines: ['S', 'E'],
      couple: ['S', 'A'],
      equilibre: ['S', 'E'],
      ombre: ['S', 'A'],
    },
    // V6 Indépendant profond (E≤0.4 & O≥0.55) — le monde intérieur (O)
    // et la porte lente (E) : tout le profil vit sur E × O.
    V6: {
      force: ['E', 'O'],
      freines: ['E', 'O'],
      couple: ['E', 'O'],
      equilibre: ['E', 'O'],
      ombre: ['E', 'O'],
    },
    // V7 Équilibriste (fallback) — l'acceptation (A) porte le lien ; les
    // freines et l'équilibre parlent du centre à tenir (C).
    V7: {
      force: ['A', 'E'],
      freines: ['C', 'A'],
      couple: ['A', 'E'],
      equilibre: ['C', 'A'],
      ombre: ['A', 'E'],
    },
  },
  '1.2': {
    // Le profil entier dérive du motif réassurance × espace (sélecteur
    // verbatim) — tous les champs lisent les deux axes, assumé.
    V1: DEUX_AXES,
    V2: DEUX_AXES,
    V3: DEUX_AXES,
    V4: DEUX_AXES,
    V5: DEUX_AXES,
  },
};

/** Les axes mappés d'un champ — lus par les échos des tendances (Task 78 :
 *  la ligne « Et tes réponses le disent » de « Là où ça peut se compliquer »
 *  puise dans les mêmes axes, une seule source de vérité éditoriale). */
export function axesDeChamp(queteId: string, carteId: string, champ: ChampProfil): readonly string[] {
  return MAPPING[queteId]?.[carteId]?.[champ] ?? [];
}

/**
 * Les lignes de sources d'un champ du profil — la réponse la plus tranchée de
 * chaque axe mappé (dans l'ordre du mapping). Vide quand la quête/variante
 * n'a pas de mapping (quêtes hors nouvelle voix) ou sans réponse lisible.
 */
export function sourcesDeChamp(
  queteId: string,
  carteId: string,
  champ: ChampProfil,
  reponses: Record<string, number>,
): LigneSource[] {
  const mapVariante = MAPPING[queteId]?.[carteId];
  if (!mapVariante) return [];
  const items = itemsAncrageDe(queteId);
  if (!items) return [];
  const out: LigneSource[] = [];
  for (const dim of mapVariante[champ] ?? []) {
    for (const l of lignesAncrage(items, reponses, dim, 1)) {
      out.push({ ...l, dim });
    }
  }
  return out;
}

/** L'ensemble des champs d'une quête — ce que l'écran consomme en un appel. */
export function sourcesDeQuete(
  queteId: string,
  carteId: string,
  reponses: Record<string, number>,
): Record<ChampProfil, LigneSource[]> {
  return {
    force: sourcesDeChamp(queteId, carteId, 'force', reponses),
    freines: sourcesDeChamp(queteId, carteId, 'freines', reponses),
    couple: sourcesDeChamp(queteId, carteId, 'couple', reponses),
    equilibre: sourcesDeChamp(queteId, carteId, 'equilibre', reponses),
    ombre: sourcesDeChamp(queteId, carteId, 'ombre', reponses),
  };
}
