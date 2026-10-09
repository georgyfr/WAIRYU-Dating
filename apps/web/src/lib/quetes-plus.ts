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
import { ARCHES_1_4 } from './quete-1-4-arche';
import { ARCHES_1_5 } from './quete-1-5-arche';
import { ARCHES_1_6 } from './quete-1-6-arche';
import { ARCHES_1_9 } from './quete-1-9-arche';
import { ARCHES_1_10 } from './quete-1-10-arche';
import { ARCHES_2_1 } from './quete-2-1-arche';
import { ARCHES_2_2 } from './quete-2-2-arche';
import { ARCHES_2_3 } from './quete-2-3-arche';
import { ARCHES_2_4 } from './quete-2-4-arche';
import { ARCHES_2_5 } from './quete-2-5-arche';
import { ARCHES_2_6 } from './quete-2-6-arche';
import { ARCHES_2_7 } from './quete-2-7-arche';
import { ARCHES_31 } from './quete-3-1-arche';
import { ARCHES_32 } from './quete-3-2-arche';
import { ARCHES_33 } from './quete-3-3-arche';
import { ARCHES_34 } from './quete-3-4-arche';
import { ARCHES_35 } from './quete-3-5-arche';
import { ARCHES_36 } from './quete-3-6-arche';
import type { IdQuete } from './quetes';
import { avecEN } from '../i18n/apply';
import * as EN_ARCHE from '../i18n/content/en/arches';

/** Le registre de la couche « plus », par identifiant de quête.
 *  Monde 2 et Monde 3 : données NON rédigées à ce stade (couches conservées
 *  pour le matching/carnet futurs — les écrans n'en rendent aucune, gabarit 35). */
export const PLUS: Record<IdQuete, CouchePlus> = {
  '1.1': PLUS_1_1,
  '1.2': PLUS_1_2,
  '1.3': PLUS_1_3,
  '1.4': { cartes: {}, leviers: {} },
  '1.5': { cartes: {}, leviers: {} },
  '1.6': { cartes: {}, leviers: {} },
  '1.7': { cartes: {}, leviers: {} },
  '1.9': { cartes: {}, leviers: {} },
  '1.10': { cartes: {}, leviers: {} },
  '1.11': { cartes: {}, leviers: {} },
  '2.1': { cartes: {}, leviers: {} },
  '2.2': { cartes: {}, leviers: {} },
  '2.3': { cartes: {}, leviers: {} },
  '2.4': { cartes: {}, leviers: {} },
  '2.5': { cartes: {}, leviers: {} },
  '2.6': { cartes: {}, leviers: {} },
  '2.7': { cartes: {}, leviers: {} },
  '2.8': { cartes: {}, leviers: {} },
  '3.1': { cartes: {}, leviers: {} },
  '3.2': { cartes: {}, leviers: {} },
  '3.3': { cartes: {}, leviers: {} },
  '3.4': { cartes: {}, leviers: {} },
  '3.5': { cartes: {}, leviers: {} },
  '3.6': { cartes: {}, leviers: {} },
  '3.7': { cartes: {}, leviers: {} },
};

/** Les archétypes GÉNÉRAUX (Task 33), par identifiant de quête, clés = variantes.
 *  1.7 et 1.11 n'ont AUCUNE carte (écrans spéciaux — Livrable) : registres vides.
 *  2.8 : le badge miniature est EXEMPT de charte (1 phrase légère, precedent 1.7)
 *  — registre vide, PAS de fichier arche. */
const ARCHE_FR: Record<IdQuete, Record<string, ArchetypeCarte>> = {
  '1.1': ARCHES_1_1,
  '1.2': ARCHES_1_2,
  '1.3': ARCHES_1_3,
  '1.4': ARCHES_1_4,
  '1.5': ARCHES_1_5,
  '1.6': ARCHES_1_6,
  '1.7': {},
  '1.9': ARCHES_1_9,
  '1.10': ARCHES_1_10,
  '1.11': {},
  '2.1': ARCHES_2_1,
  '2.2': ARCHES_2_2,
  '2.3': ARCHES_2_3,
  '2.4': ARCHES_2_4,
  '2.5': ARCHES_2_5,
  '2.6': ARCHES_2_6,
  '2.7': ARCHES_2_7,
  '2.8': {},
  '3.1': ARCHES_31,
  '3.2': ARCHES_32,
  '3.3': ARCHES_33,
  '3.4': ARCHES_34,
  '3.5': ARCHES_35,
  '3.6': ARCHES_36,
  '3.7': {},
};
export const ARCHE = avecEN(ARCHE_FR, EN_ARCHE.ARCHE);
