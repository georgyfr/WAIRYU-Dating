/**
 * La couche « plus » des résultats — ce que la critique du fondateur appelle
 * la révélation personnelle et l'utilité relationnelle (Task 32).
 *
 * TROIS QUESTIONS que l'utilisateur se pose après la passation :
 *  « Qu'est-ce que cela dit vraiment de moi ? »        → preuves (§1)
 *  « Qu'est-ce que cela peut provoquer dans une relation ? » → ressenti, besoins (§5-6)
 *  « Qu'est-ce que je peux faire avec cette découverte ? »   → leviers, langage (§10-12)
 *
 * RÈGLES DE CONTENU (critique fondateur, non négociables) :
 *  - l'ombre ne dit pas « voici ton défaut » mais « voici ce qui arrive quand
 *    ta qualité va trop loin » (axe de progression, pas verdict) ;
 *  - la question à emporter est INTROSPECTIVE — jamais une vérité
 *    psychologique, jamais un diagnostic ;
 *  - le langage relationnel prépare le matching (tu donnes / tu recherches /
 *    tu surveilles / tu apprécierais) ;
 *  - tout est une LECTURE D'APP : « tu peux », jamais « tu es ».
 *
 * Les textes VERBATIM (lumiere, ombre, tension, trames) ne vivent PAS ici —
 * ils restent dans quete-1-*.ts (règle 11-b). Ce fichier ne porte que la
 * couche ajoutée autour.
 */

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

/** La couche enrichie d'UNE carte (critique §1, §3, §5, §6, §11, §12). */
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
import type { IdQuete } from './quetes';

/** Le registre de la couche « plus », par identifiant de quête. */
export const PLUS: Record<IdQuete, CouchePlus> = {
  '1.1': PLUS_1_1,
  '1.2': PLUS_1_2,
  '1.3': PLUS_1_3,
};
