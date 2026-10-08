/**
 * L'ARCHÉTYPE d'une carte (Task 33 — demande fondateur, réorientation
 * éditoriale) : la présentation GÉNÉRALE du type de personnalité, qui vient
 * AVANT le profil personnalisé à l'écran.
 *
 * POURQUOI (le malaise fondateur) : la révélation Task 32 affirmait des
 * vérités personnelles (« Tu entres dans une pièce et l'air change ») que la
 * première quête ne peut pas mesurer — et l'utilisateur n'y reconnaissait
 * pas toujours. La correction : parler du TYPE d'abord (« ce type de
 * personnalité peut généralement… »), puis laisser le profil tendance par
 * tendance porter le personnalisé — avec auto-validation par l'utilisateur
 * (« Est-ce que ça te ressemble ? »).
 *
 * RÈGLES DE TON (non négociables) :
 *  - GÉNÉRAL : « ce type », « ces personnes », « peut généralement », « souvent »
 *    — JAMAIS « tu es », jamais une vérité intime ; l'équilibre se pose comme
 *    une question que le type peut se poser, pas une prescription ;
 *  - l'ombre reste « ce qui peut apparaître quand la lumière déborde », pas
 *    un défaut ;
 *  - la note relation est une « possibilité à garder en tête » — une
 *    dynamique possible, jamais « ton partenaire ressentira ».
 */
export interface ArchetypeCarte {
  /** L'accroche sous le nom — une ligne qui résume le mouvement du type. */
  accroche: string;
  /** La devise du type, à la première personne — « Je découvre, je partage… ». */
  devise: string;
  /** La présentation générale (3-4 phrases) — sans répéter le nom de la carte. */
  presentation: string;
  /** ☀️ Sa lumière — ce que ce type peut généralement apporter (5-7 items courts). */
  lumiere: readonly string[];
  /** La phrase qui referme la liste lumière. */
  lumiereNote: string;
  /** 🌘 Son ombre — ce qui peut apparaître quand la tendance déborde (4-6 items courts). */
  ombre: readonly string[];
  /** La phrase qui referme la liste ombre (l'ombre n'est pas un défaut). */
  ombreNote: string;
  /** ❤️ En relation — ce que ce type peut généralement rechercher ou apprécier (4-6 items courts). */
  relation: readonly string[];
  /** « Une possibilité à garder en tête » — la dynamique relationnelle possible, neutre. */
  relationNote: string;
  /** 🌱 Son point d'équilibre — la question que le type peut se poser (première personne). */
  equilibreQuestion: string;
  /** La note d'équilibre — pourquoi cette question, non normative. */
  equilibreNote: string;
}

/** « Ton levier de progression » — par dimension (critique §10). */
export interface LevierDim {
  /** Ta force — ce que cette tendance t'apporte. */
  force: string;
  /** Ton risque — ce qui peut arriver quand elle déborde. */
  risque: string;
  /** Ton levier — la piste concrète pour évoluer. */
  levier: string;
}

/** « Ton langage relationnel » — le moteur de matching (critique §12). */
export interface LangageRelationnel {
  /** Tu donnes : énergie + curiosité + spontanéité. */
  donnes: string;
  /** Tu recherches probablement : échange + stimulation + ouverture. */
  recherches: string;
  /** Tu dois surveiller : rythme + écoute + silence. */
  surveilles: string;
  /** Tu pourrais particulièrement apprécier : une personne qui… */
  apprecierais: string;
}

/** La couche enrichie d'UNE carte (critique §1, §3, §5, §6, §11, §12).
 *
 *  Task 33 (réorientation fondateur) : les champs PERSONNELS (preuves,
 *  ressenti, besoins, question) ne sont PLUS rendus à l'écran ni dans le PDF
 *  — ils affirmaient des vérités intimes que la passation ne mesure pas.
 *  Les DONNÉES restent dans les modules quete-1-*-plus.ts (non destructif) :
 *  elles nourriront le matching et le carnet de bord plus tard. Seuls
 *  `langage` (base du moteur de matching) et les `leviers` restent rendus,
 *  après l'archétype général et le profil tendance par tendance. */
export interface CartePlus {
  /** « Ce que cela peut donner chez toi » — preuves comportementales (~5). */
  preuves: readonly string[];
  /** « ❤️ Dans une relation, tu peux avoir besoin de… » (~3). */
  besoins: readonly string[];
  /** « 👀 Ce que l'autre peut parfois ressentir » — double lecture :
   *  [la voix qui admire, la voix qui exprime son besoin]. */
  ressenti: readonly [string, string];
  /** « ✨ Ce que tu peux apporter » (~5, items courts). */
  apportes: readonly string[];
  /** « 🌱 Ce que tu peux apprendre » (~4, infinitifs). */
  apprendre: readonly string[];
  /** « Une question à emporter » — introspective, jamais un diagnostic. */
  question: string;
  /** « 🧩 Ton langage relationnel ». */
  langage: LangageRelationnel;
}

/** La couche enrichie d'UNE quête : ses cartes + le levier de ses dimensions. */
export interface CouchePlus {
  cartes: Record<string, CartePlus>;
  /** Par clé de dimension (O, C, E, A, S… — cf. dims de la quête). */
  leviers: Record<string, LevierDim>;
}

import { PLUS_1_1 } from './quete-1-1-plus';
import { PLUS_1_2 } from './quete-1-2-plus';
import { PLUS_1_3 } from './quete-1-3-plus';
import { ARCHES_1_1 } from './quete-1-1-arche';
import { ARCHES_1_2 } from './quete-1-2-arche';
import { ARCHES_1_3 } from './quete-1-3-arche';
import type { IdQuete } from './quetes';

/** Le registre de la couche « plus », par identifiant de quête. */
export const PLUS: Record<IdQuete, CouchePlus> = {
  '1.1': PLUS_1_1,
  '1.2': PLUS_1_2,
  '1.3': PLUS_1_3,
};

/** Les archétypes GÉNÉRAUX (Task 33), par identifiant de quête, clés = variantes. */
export const ARCHE: Record<IdQuete, Record<string, ArchetypeCarte>> = {
  '1.1': ARCHES_1_1,
  '1.2': ARCHES_1_2,
  '1.3': ARCHES_1_3,
};
