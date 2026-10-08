/**
 * Archétype de la quête 1.9 — Ton élan du moment (gabarit Task 35, adapté à un ÉTAT).
 *
 * PARTICULARITÉ : la carte 1.9 « La Météo du moment » est UNIQUE et NON SÉLECTIVE
 * (condition « toujours », cartes.yaml) — elle est la même pour les trois degrés
 * d'élan (haut / mixte / bas, miroir 07). Son gabarit ne décrit donc pas un type de
 * personnalité : il décrit L'INSTRUMENT — cette carte ne juge pas ton élan, elle le
 * photographie. L'intro dit explicitement que c'est la météo de ces derniers jours,
 * jamais un portrait de personnalité ; l'ombre nomme les pièges de lecture d'une
 * donnée datée ; le volet « en couple » reprend les trois saisons du miroir 07.
 *
 * Textes rédigés (couche app, ton Task 35) : 2ᵉ personne, SIMPLE ET LITTÉRAL,
 * phrases courtes, zéro normativité (aucun élan meilleur qu'un autre), zéro
 * vocabulaire clinique, ancre temporelle d'état, apostrophes ASCII.
 *
 * Ancrage : la carte VERBATIM (nom, lumière, ombre, tension) reste dans quete-1-9.ts ;
 * la lecture différenciée par degré d'élan vit au miroir, pas ici. Aucun segment
 * ≥ 60 caractères n'est recopié d'un module à l'autre.
 */
import type { ArchetypeCarte } from './quetes-plus';

export const ARCHES_1_9: Record<'V1', ArchetypeCarte> = {
  // V1 — La Météo du moment : l'instrument qui photographie, et la donnée qui date.
  V1: {
    intro:
      'Cette carte ne juge pas ton élan : elle le photographie. Tu viens de répondre à huit affirmations sur ces derniers jours. Ce que tu lis est ta météo intérieure du jour — la même lecture pour les trois degrés : élan haut, mixte ou bas. Ton point de vigilance : une météo date vite — ce que tu lis aujourd\'hui est une saison, jamais un portrait de personnalité.',
    devise: 'Ma météo se mesure, elle ne se juge pas.',
    apportes:
      'Un point de repère daté : où ton autonomie, ta compétence et ton affiliation se trouvent, ces derniers jours. Pas de note, pas de comparaison — un instantané que tu gardes pour toi.',
    freines:
      'Les pièges de lecture : relire une vieille météo comme si elle valait encore, ou prendre une météo basse pour un verdict. Aucun degré n\'est un mérite — haut, mixte ou bas, ce sont trois saisons, pas trois notes.',
    couple:
      'À deux, cette carte dit ce que ta semaine donne à voir : un élan haut qui entraîne, un élan mixte qui oscille. Un élan bas, lui, se replie — et l\'autre peut lire un désintérêt là où il n\'y en a pas. La nommer à voix haute suffit à dissiper le malentendu.',
    equilibre:
      'Relis ta carte comme une météo : datée, modifiable, re-prenable dans 30 jours. Ton élan a le droit de bouger — c\'est même sa seule certitude.',
  },
};
