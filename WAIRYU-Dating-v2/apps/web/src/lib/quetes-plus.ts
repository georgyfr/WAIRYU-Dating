/**
 * L'ARCHÉTYPE d'une carte (Task 35 — demande fondateur, gabarit final).
 *
 * L'ALGORITHME (réponse à « comment répondre exactement de cette manière,
 * quel que soit le type d'archétype ? ») tient en trois pièces :
 *  1. Le GABARIT est du code (Quete.tsx / pdf-resultats.ts) : les 9 blocs —
 *     🎉 Ton profil : {nom} → intro → En résumé : « {devise} » → Ce que tu
 *     apportes → Ce qui peut te freiner → En couple → Ton équilibre →
 *     🪞 Tes N tendances (d'après tes réponses) → À noter — sont TOUJOURS
 *     rendus dans le même ordre, avec la même typographie ;
 *  2. Les MOTS sont des DONNÉES : chaque archétype = un objet de 6 champs
 *     ci-dessous, écrit à la 2ᵉ personne, littéral et chaleureux. Ajouter
 *     un archétype = remplir un objet — le gabarit garantit la forme exacte ;
 *  3. Les MESURES sont CALCULÉES : scorer du Livrable → 0-100 par tendance
 *     → palier déterministe → texte du registre dim × palier (quetes.ts).
 *
 * RÈGLES DE TON (non négociables) :
 *  - SIMPLE ET LITTÉRAL : « Tu es de celles et ceux qui… », pas de
 *    simulation de profondeur — l'archétype décrit le TYPE auquel les
 *    réponses rapprochent, et l'intro le dit (« Ton archétype révèle… ») ;
 *  - le point de vigilance clôt l'intro (« Ton point de vigilance : … ») —
 *    une conséquence du mouvement du type, pas un défaut ;
 *  - « Ce qui peut te freiner » se referme sur « Ce ne sont pas des
 *    défauts — juste ce qui émerge quand… » ;
 *  - « En couple » = ce que tu apprécies + « À garder en tête : … » — une
 *    dynamique possible, jamais une prédiction sur l'autre ;
 *  - « Ton équilibre » = un geste + « Non parce que…, mais parce que… ».
 */
export interface ArchetypeCarte {
  /** L'intro — « Ton archétype révèle une personne qui… » + le point de vigilance. */
  intro: string;
  /** La devise du type, à la première personne — « En résumé : « … » ». */
  devise: string;
  /** « Ce que tu apportes ». */
  apportes: string;
  /** « Ce qui peut te freiner » — pas des défauts, ce qui émerge quand la lumière déborde. */
  freines: string;
  /** « En couple » — ce que tu apprécies + « À garder en tête : … ». */
  couple: string;
  /** « Ton équilibre » — un geste, non normatif. */
  equilibre: string;
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
 *  Task 35 (gabarit final) : le résultat ne rend plus QUE le gabarit
 *  fondateur (archétype 2ᵉ personne + tendances mesurées). Les DONNÉES de ce
 *  module restent dans quete-1-*-plus.ts (non destructif) : le `langage`
 *  nourrira le moteur de matching, les `leviers` le carnet de bord. */
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
