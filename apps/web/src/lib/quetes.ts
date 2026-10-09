/**
 * Le registre des quêtes du voyage (Monde 1 pour l'instant) + la couche
 * d'accompagnement de la vue « résultats en détail ».
 *
 * ARCHITECTURE :
 *  - QUETES[id] = la définition complète de la quête (deck, scorer, sélecteurs,
 *    cartes, briefing, complétion, dims, accompagnement, conseils) — le contenu
 *    VERBATIM vit dans les modules quete-1-1.ts / quete-1-2.ts / quete-1-3.ts ;
 *  - dims + accompagnement + conseils = la COUCHE ACCOMPAGNEMENT (lecture d'app,
 *    distincte des contenus verrouillés du Livrable) : elle explique les barres
 *    réelles produites par le scorer du Livrable. Paliers : doux < 0.40,
 *    équilibré < 0.65, fort — des paliers de lecture, distincts des verrous [9].
 *
 * RECONSTITUTION (5ᵉ reset sandbox) : extrait programmatiquement du bundle
 * staging index-BvGGhSXl.js (Task 27), fidèle à ce qui a été validé par le
 * fondateur sur staging.
 */

import * as Q11 from './quete-1-1';
import * as Q12 from './quete-1-2';
import * as Q13 from './quete-1-3';
import * as Q14 from './quete-1-4';
import * as Q15 from './quete-1-5';
import * as Q16 from './quete-1-6';
import * as Q17 from './quete-1-7';
import * as Q19 from './quete-1-9';
import * as Q110 from './quete-1-10';
import * as Q111 from './quete-1-11';
import * as Q21 from './quete-2-1';
import * as Q22 from './quete-2-2';
import * as Q23 from './quete-2-3';
import * as Q24 from './quete-2-4';
import * as Q25 from './quete-2-5';
import * as Q26 from './quete-2-6';
import * as Q27 from './quete-2-7';
import * as Q28 from './quete-2-8';
import { DEF_14 } from './quete-1-4-def';
import { DEF_15 } from './quete-1-5-def';
import { DEF_16 } from './quete-1-6-def';
import { DEF_17 } from './quete-1-7-def';
import { DEF_19 } from './quete-1-9-def';
import { DEF_110 } from './quete-1-10-def';
import { DEF_111 } from './quete-1-11-def';
import { DEF_21 } from './quete-2-1-def';
import { DEF_22 } from './quete-2-2-def';
import { DEF_23 } from './quete-2-3-def';
import { DEF_24 } from './quete-2-4-def';
import { DEF_25 } from './quete-2-5-def';
import { DEF_26 } from './quete-2-6-def';
import { DEF_27 } from './quete-2-7-def';
import { DEF_28 } from './quete-2-8-def';
import type { LikertNiveau } from './quete-1-1';
import { avecEN } from '../i18n/apply';
import { getLang } from '../i18n/current';
import {
  COMMUN_EN,
  INTRO_APERCU_EN,
  LABELS_PALIER_EN,
  LIKERT_EN,
  MONDES_NOMS,
  MOTS_NOMBRE_EN,
  NOTA_BARRES_EN,
  TITRE_TENDANCE_UNIQUE_EN,
  TITRE_TENDANCES_PLURIEL_EN,
} from '../i18n/content/en/registre-commun';
import { REGISTRE_EN } from '../i18n/content/en/registre';

/** Un item de passation Likert (les trames n'y figurent jamais — règle 11-b). */
export type ItemQuete = Q11.QueteItem | Q12.QueteItem12 | Q13.QueteItem13;

/**
 * Un item de passation UNIFIÉ (Monde 2 — formats variés du Livrable) :
 *  - 'likert'   : énoncé + échelle 5 (Monde 1 + 1.4/1.6/1.9/1.10) ;
 *  - 'choix'    : tâche comportementale 1.5 — phrase-cadre + 2 options A/B ;
 *  - 'question' : écrans spéciaux 1.7/1.11 — question + options (multi possible).
 */
export interface ItemPassation {
  code: string;
  /** Likert : l'énoncé · choix : la phrase-cadre · question : la question. */
  text: string;
  format: 'likert' | 'choix' | 'question';
  /** Choix binaire 1.5 — option A (immédiat) puis B (différé). */
  choixA?: string;
  choixB?: string;
  /** Écran spécial (1.7/1.11) — les options, dans l'ordre du Livrable. */
  options?: readonly string[];
  /** Sélection multiple autorisée (checklist 1.7-01). */
  multi?: boolean;
}

/** Adapte un item Likert des modules M1/M2 au contrat unifié. */
export function itemLikert(it: { code: string; text: string }): ItemPassation {
  return { code: it.code, text: it.text, format: 'likert' };
}

export type IdQuete =
  | '1.1'
  | '1.2'
  | '1.3'
  | '1.4'
  | '1.5'
  | '1.6'
  | '1.7'
  | '1.9'
  | '1.10'
  | '1.11'
  | '2.1'
  | '2.2'
  | '2.3'
  | '2.4'
  | '2.5'
  | '2.6'
  | '2.7'
  | '2.8';

export interface DimDef {
  /** Clé de dimension dans le score du scorer de la quête. */
  key: string;
  nom: string;
  sousLigne: string;
  /** Genre grammatical du nom — pour l'accord des libellés de palier
   *  (« très présente » / « très présent », gabarit fondateur Task 35). */
  genre: 'f' | 'm';
  /** Ce que cette barre regarde — l'explication de la tendance (couche app,
   *  demande fondateur : « apporte plus d'explication des résultats »).
   *  Donnée conservée (carnet de bord futur) — non rendue au gabarit 35. */
  lecture: string;
}

export interface AccompagnementDim {
  fort: string;
  equilibre: string;
  doux: string;
}

export interface Completion {
  entete: string;
  labelOmbre: string;
  labelTension: string;
  fenetre: string;
  miroirNote: string;
}

/** Définition d'une quête — structure commune aux trois quêtes du Monde 1. */
export interface QueteDef {
  id: IdQuete;
  numero: number;
  totalDuMonde: number;
  titre: string;
  sousTitre: string;
  annonce: string;
  briefing: {
    aQuoiCaSert: readonly string[];
    resultats: readonly string[];
  };
  /** Le deck réel de passation (trames sautées, jamais affichées). */
  deck: () => ItemPassation[];
  /** Le format de passation. Les formats du Livrable :
   *  - 'likert'         : énoncé + échelle 5 (M1 + 1.4/1.6/1.9/1.10 + 2.1/2.2/2.7) ;
   *  - 'choix'          : tâche comportementale 1.5 — phrase-cadre + 2 options A/B ;
   *  - 'question'       : écran spécial 1.7/1.11 — question + options (multi possible) ;
   *  - 'likert-enigmes' : 1.6 — Likert puis 3 énigmes hors mélange ;
   *  - 'checklist'      : 2.3 — UN écran, 9 lignes rouges à cocher + champ libre ;
   *  - 'clic'           : 2.4 — 8 déclarations à un toucher (options) ;
   *  - 'binaire'        : 2.5 — 3 binaires Oui/Non + 4ᵉ réponse « Je découvre » ;
   *  - 'arbitrage'      : 2.6 — UN écran, 100 points sur 5 curseurs, somme verrouillée ;
   *  - 'jeu'            : 2.8 — 1 sélection opt-in, badge miniature (hors score). */
  format:
    | 'likert'
    | 'choix'
    | 'ecran'
    | 'likert-enigmes'
    | 'checklist'
    | 'clic'
    | 'binaire'
    | 'arbitrage'
    | 'jeu';
  scorer: (reponses: Record<string, number>) => Record<string, number>;
  choisirVariante: (score: Record<string, number>) => string;
  cartes: Record<string, { id: string; nom: string; lumiere: string; ombre: string; tension: string }>;
  /** Quêtes SANS carte (1.7 « écran de confiance », 1.11 « écran de passage ») —
   *  la complétion rend l'écran spécial verbatim, jamais une carte. */
  sansCarte?: boolean;
  completion: Completion;
  dims: readonly DimDef[];
  accompagnement: Record<string, AccompagnementDim>;
  conseils: readonly string[];
  /** Comment lire les barres — la passe d'explication globale (couche app, demande fondateur). */
  commentLire: string;
  /** Le volet ombre en relation : par VARIANTE de carte, ce que la zone d'ombre
   *  peut donner avec les gens qu'on aime + le geste qui aide (couche app,
   *  demande fondateur — « le volet ombre avec ses conséquences sur le plan
   *  relationnel »). Lecture d'app : jamais une étiquette, jamais un diagnostic. */
  ombreRelationnel: Record<string, string>;
  /** La quête suivante de la chaîne du monde (null = dernière quête ouverte). */
  suivante: IdQuete | null;
  /** La fin émotionnelle (critique §13) — le cliffhanger qui donne envie de
   *  découvrir la suite. questions vide = dernière quête du monde. */
  suite: {
    titre: string;
    intro: string;
    questions: readonly string[];
    /** Le CTA du cliffhanger (absent pour la dernière quête du monde). */
    cta?: string;
  };
}

/** Les textes communs du briefing (verbatim 05-ecran-d-intro — miroir EN
 *  dans i18n/content/en/registre-commun, fusion au chargement). */
export const COMMUN = avecEN(
  {
  commentRepondre: [
    'Une affirmation s\'affiche à la fois. Tu réponds sur 5 niveaux, de « Pas du tout moi » à « Tout à fait moi ».',
    'Pas de bonne réponse, pas de note, pas de chronomètre — tu avances à ton rythme.',
    'Réponds spontanément, avec ta première réponse. Celle que tu crois être celle qu\'on attend, c\'est rarement la tienne.',
  ],
  comportement: [
    'Installe-toi quelques minutes au calme.',
    'Réponds comme tu es aujourd\'hui, pas comme tu voudrais être — c\'est ce qui rend le voyage juste.',
    'Tu peux mettre en pause quand tu veux : tes réponses restent sur cet appareil, tu reprends là où tu t\'es arrêté.',
  ],
  },
  COMMUN_EN,
);

/** La chaîne des quêtes ouvertes du voyage (Monde 1 + Monde 2 « Le Volant »
 *  + Monde 3 « La Boussole »). 1.8 n'existe pas au Livrable (série 1.x : la
 *  numérotation traverse M1/M2) ; la série 2.x traverse M3. */
export const QUETE_IDS: readonly IdQuete[] = [
  '1.1', '1.2', '1.3', '1.4', '1.5', '1.6', '1.7', '1.9', '1.10', '1.11',
  '2.1', '2.2', '2.3', '2.4', '2.5', '2.6', '2.7', '2.8',
];

/** Les couches APP d'une entrée de registre — rédigées (jamais verbatim du
 *  Livrable), ton Task 35 : tutoiement, simple et littéral, phrases courtes,
 *  jamais un diagnostic. Écrites par les agents quête, assemblées ici. */
export type EntreeRegistre = Pick<
  QueteDef,
  | 'dims'
  | 'accompagnement'
  | 'conseils'
  | 'commentLire'
  | 'ombreRelationnel'
  | 'suivante'
  | 'suite'
  | 'sousTitre'
>;

/** Le registre — les trois quêtes ouvertes du Monde 1 « Le Miroir » (FR
 *  verbatim ; le miroir EN vit dans i18n/content/en/registre-*.ts). */
const REGISTRE_FR: Record<IdQuete, QueteDef> = {
  '1.1': {
    id: '1.1',
    numero: 1,
    totalDuMonde: 3,
    titre: 'Ta personnalité',
    sousTitre: 'La première quête du voyage.',
    annonce: Q11.BRIEFING.annonce,
    briefing: {
      aQuoiCaSert: Q11.BRIEFING.aQuoiCaSert,
      resultats: Q11.BRIEFING.resultats,
    },
    deck: () => Q11.deckQuete().map(itemLikert),
    format: 'likert',
    scorer: Q11.scorer,
    choisirVariante: (s) => Q11.choisirVariante(s as Q11.Score11),
    cartes: Q11.CARTES,
    completion: Q11.COMPLETION,
    dims: [
      {
        key: 'O',
        nom: 'Ton ouverture',
        sousLigne: 'le nouveau, les idées, la curiosité',
        genre: 'f',
        lecture:
          'Cette barre dit combien le nouveau t\'appelle : idées inattendues, lieux inconnus, gens qui pensent autrement. Pleine : tu explores et tu entraînes les autres dans ton élan. Légère : tu aimes ce qui dure, et ta constance est une force pour ceux qui t\'entourent.',
      },
      {
        key: 'C',
        nom: 'Ton organisation',
        sousLigne: 'ce que tu promets, ce que tu finis',
        genre: 'f',
        lecture:
          'Cette barre dit ce que tu tiens : promesses gardées, choses finies, plans suivis. Pleine : les gens peuvent compter sur toi, et ils le savent. Légère : tu improvises, et ta souplesse a juste besoin d\'une colonne vertébrale les semaines où tout arrive en même temps.',
      },
      {
        key: 'E',
        nom: 'Ton énergie sociale',
        sousLigne: 'les gens, le bruit, le silence',
        genre: 'f',
        lecture:
          'Cette barre dit d\'où vient ton énergie : la foule ou le calme. Pleine : les gens te rechargent et tu rayonnes en groupe. Légère : le silence te reconstruit, avec peu de gens mais des vrais. Ni l\'un ni l\'autre n\'est mieux — ce sont deux moteurs différents.',
      },
      {
        key: 'A',
        // Task 32 (critique fondateur §8) : « bienveillance » à 38 % se lit
        // « peu bienveillant » — l'axe réel est la confiance accordée (la
        // lecture dit déjà « la confiance se mérite chez toi »).
        nom: 'Ta confiance',
        sousLigne: 'le lien, la confiance, la franchise',
        genre: 'f',
        lecture:
          'Cette barre dit comment tu donnes : confiance rapide ou prudence attentive. Pleine : le lien passe avant la victoire, tu écoutes et tu donnes sans compter. Légère : la confiance se mérite chez toi — et ta franchise, bien dosée, protège tes relations.',
      },
      {
        key: 'S',
        nom: 'Ta stabilité émotionnelle',
        sousLigne: 'les vagues, le calme, le retour',
        genre: 'f',
        lecture:
          'Cette barre dit comment tu traverses les vagues : retombé·e vite ou porté·e longtemps. Pleine : les autres s\'appuient sur ton calme, souvent sans le dire. Légère : tu ressens fort et longtemps — une antenne fine, pas une faiblesse.',
      },
    ],
    accompagnement: {
      // Task 35 : les 5 textes aux paliers atteints par le gabarit fondateur
      // (O-fort, C-équilibre, E-fort, A-doux, S-fort) viennent du fondateur
      // LUI-MÊME — reprise verbatim, coquilles corrigées. Les autres paliers
      // gardent la même voix.
      O: {
        fort: 'Le nouveau t\'attire : idées, lieux, rencontres différentes. Tu explores et tu adaptes facilement ton point de vue. Ton garde-fou : garder au moins un repère stable pour ne pas te disperser.',
        equilibre: 'Tu peux aimer le nouveau sans courir après lui : tu explores quand ça vaut la peine, tu restes quand ça compte. C\'est un équilibre qui se règle au cas par cas — de temps en temps, ose l\'inconnu juste pour voir ce qu\'il fait en toi.',
        doux: 'Tu aimes ce qui dure : les mêmes visages, les mêmes repères, les choses qu\'on connaît par cœur. Ce n\'est pas de la fermeture — c\'est de la constance. Une petite nouveauté par mois, choisie par toi, suffit à garder la porte entrouverte.',
      },
      C: {
        fort: 'Ce que tu promets, tu le tiens. Tu aimes quand les choses sont en ordre, prévues, finies — et les gens le savent : ils te confient ce qui compte. Ta vigilance : quand l\'imprévu arrive, lui laisser une place sans te le vivre comme un manquement.',
        equilibre: 'Tu structures l\'essentiel et laisses le reste vivre. Tes journées ont une colonne vertébrale, pas de carcan. Attention juste aux grosses échéances, qui méritent parfois plus de cadre.',
        doux: 'Tu préfères improviser : tu t\'organises quand c\'est obligatoire, pas par plaisir. Ça marche, jusqu\'au jour où tout arrive en même temps. Un seul rendez-vous avec toi-même par semaine — dix minutes, une liste — change la tension du reste.',
      },
      E: {
        fort: 'Les gens te rechargent. Tu lances les conversations et animes naturellement. Vigilance : préserve des temps calmes pour toi — c\'est ce qui rend ton énergie tenable sur la durée.',
        equilibre: 'Tu es sociable quand ça a du sens et silencieux quand il le faut. Les grands groupes t\'amusent, les tête-à-tête te nourrissent. Tu n\'as rien à corriger — juste à repérer ce dont tu as besoin après une longue journée de monde.',
        doux: 'Le calme te reconstruit : peu de gens, mais des vrais. Tu préfères écouter que remplir le silence — et ceux qui te connaissent savent la valeur de ce que tu dis. Un petit pas spontané de temps en temps ouvre des portes que l\'attente ne verrait pas.',
      },
      A: {
        fort: 'Tu fais passer le lien avant la victoire : tu écoutes, tu attends avant de juger, tu donnes sans compter. Ta vigilance : la franchise a aussi un cadeau à offrir — dire un non clair rend tes oui plus vrais.',
        equilibre: 'Tu es chaleureux·se mais tu ne te laisses pas marcher dessus : tu donnes beaucoup et tu sais poser des limites. C\'est un équilibre sain — garde juste l\'œil sur les personnes avec qui tu te forces à être doux·ce.',
        doux: 'La confiance se mérite chez toi, et tu as de bonnes raisons d\'avoir appris ça. Ta piste : tester la confiance par petites touches plutôt que d\'attendre une certitude totale, et oser dire non clairement.',
      },
      S: {
        fort: 'Les vagues passent et tu restes debout. Tu retrouves ton calme rapidement et les autres s\'appuient sur toi, souvent sans le dire. Vigilance : que ta stabilité ne devienne pas une armure — accueillir ce qui remue fait aussi partie de l\'équilibre.',
        equilibre: 'Tu as des jours calmes et des jours de tempête — c\'est humain et c\'est ton rythme. Tu connais déjà ce qui t\'apaise ; le jeu, c\'est de le faire assez tôt, avant que la fatigue ne décide pour toi.',
        doux: 'Tu ressens fort et longtemps — les remarques, les attentes, les scénarios. Ce n\'est pas une faiblesse : c\'est une antenne fine. Ton levier : des gestes simples et répétables — un souffle, une marche, une note écrite — qui raccourcissent le retour au calme.',
      },
    },
    conseils: [
      'Relis ta carte à tête reposée — demain matin ou après une vraie journée : tu verras d\'autres phrases ressortir.',
      'Choisis UNE phrase qui te surprend et garde-la en poche quelques jours : observe où elle se vérifie.',
      'Aucune barre ne te définit : elles décrivent ta réponse d\'aujourd\'hui, pas une case pour toujours.',
      'Ne te colle pas une étiquette — les profils complets changent lentement : vérifie que tu changes encore.',
      'Garde tes réponses sur cet appareil : la quête suivante s\'appuiera sur ce que tu viens de découvrir.',
    ],
    commentLire:
      'Les cinq barres viennent de TES réponses, à l\'instant. Chacune va de 0 à 100 : plus la barre est pleine, plus tes réponses penchent de ce côté — et rien d\'autre. Ce ne sont ni des notes, ni des cases : c\'est un instantané, celui de la personne qui a répondu aujourd\'hui. Chaque barre est suivie de ce qu\'elle regarde et de ce qu\'elle dit de toi — relis-les comme un portrait qui parle, pas comme un bulletin.',
    ombreRelationnel: {
      V1:
        'En relation, ta zone d\'ombre peut donner : des projets lancés à deux puis remplacés par le suivant — et l\'autre qui se demande s\'il comptait vraiment dans l\'élan. Ce qui aide : dire quand une chose continue de compter même après que tu as bougé. Un retour, un rappel, une promesse tenue : l\'autre cesse de suivre tes envies et se met à te suivre, toi.',
      V2:
        'En relation, ta zone d\'ombre peut donner : une maison impeccable et l\'autre qui se sent noté·e à chaque chose mal posée — ou toi, accablé·e par un imprévu que tu vis comme ta faute. Ce qui aide : annoncer tes standards au lieu de les faire deviner, et laisser l\'autre faire à SA façon de temps en temps — sans garder la note.',
      V3:
        'En relation, ta zone d\'ombre peut donner : des soirées brillantes et des silences mal supportés — l\'autre peut confondre ta vitesse avec une indisponibilité à ce qui est lent. Ce qui aide : choisir une personne ET un moment où tu restes sans remplir. C\'est là, dans ce silence choisi, que le lien descend d\'un étage.',
      V4:
        'En relation, ta zone d\'ombre peut donner : ta patience qui devient une demeure — tu restes là où d\'autres seraient déjà partis, et le temps investi finit par peser plus lourd que la réalité. Ce qui aide : un point régulier avec toi-même : « est-ce que je reste parce que c\'est bon, ou parce que je sais rester ? » La réponse, honnête, protège ton bien le plus précieux : ta présence.',
      V5:
        'En relation, ta zone d\'ombre peut donner : des hauts magnifiques et des bas qui emportent la conversation — l\'autre peut avoir peur de la tempête sans savoir qu\'elle passe. Ce qui aide : prévenir quand tu la sens monter : « ce n\'est pas toi, c\'est la vague » — quatre mots qui changent tout, et un retour au calme que l\'autre apprend à ne plus redouter.',
      V6:
        'En relation, ta zone d\'ombre peut donner : ton monde intérieur si confortable que l\'autre frappe longtemps sans savoir s\'il est invité. Ce qui aide : ouvrir par petites portes — partager un morceau de ton monde EN PREMIER, même maladroitement. Pour qui t\'aime, c\'est une invitation que cette personne attend peut-être depuis longtemps.',
      V7:
        'En relation, ta zone d\'ombre peut donner : une adaptabilité si large que l\'autre ne sait parfois plus ce que TU veux, toi. Ce qui aide : prendre position à voix haute une fois par jour — un choix, une envie, un refus. Ta polyvalence devient un don quand elle part d\'un centre visible : on aime les personnes difficiles à cerner, personne n\'aime deviner à l\'aveugle.',
    },
    suivante: '1.2',
    suite: {
      titre: 'Ton premier miroir est posé.',
      intro:
        'Tu viens de découvrir une partie de toi. Mais ta personnalité n\'est pas toute ton histoire — le cœur a ses propres questions.',
      questions: [
        'Comment aimes-tu ?',
        'Comment t\'attaches-tu ?',
        'Que se passe-t-il lorsque tes émotions prennent le dessus ?',
      ],
      cta: 'Découvrir ma façon de m\'attacher',
    },
  },
  '1.2': {
    id: '1.2',
    numero: 2,
    totalDuMonde: 3,
    titre: 'Ta façon de t\'attacher',
    sousTitre: 'La deuxième quête du voyage.',
    annonce: Q12.BRIEFING.annonce,
    briefing: {
      aQuoiCaSert: Q12.BRIEFING.aQuoiCaSert,
      resultats: [
        'Ta carte — ta lumière et ta zone d\'ombre, en quelques mots.',
        'Ta tension intérieure — ce que tu cherches à tenir ensemble.',
        'Ton miroir — la lecture complète de ta façon d\'aimer, à la prochaine étape du voyage.',
        'Les pierres suivantes de ton portrait — ta façon d\'aimer nourrit tout ce qui vient.',
      ],
    },
    deck: () => Q12.deckQuete().map(itemLikert),
    format: 'likert',
    scorer: Q12.scorer,
    choisirVariante: (s) => Q12.choisirVariante(s as Q12.Score12),
    cartes: Q12.CARTES,
    completion: Q12.COMPLETION,
    dims: [
      {
        key: 'A',
        nom: 'Ton besoin de réassurance',
        sousLigne: 'ce que ton cœur cherche quand quelqu\'un compte',
        genre: 'm',
        lecture:
          'Cette barre dit ce que ton cœur demande quand quelqu\'un compte pour toi : des preuves fréquentes et tôt (pleine), ou une tranquillité qui vient de toi (légère). Aucun point n\'est plus solide que l\'autre — ce qui compte, c\'est de connaître le tien pour pouvoir le dire.',
      },
      {
        key: 'E',
        nom: 'Ton besoin d\'espace',
        sousLigne: 'ton air, ton rythme, ton monde intérieur',
        genre: 'm',
        lecture:
          'Cette barre dit combien d\'air tu as besoin dans la proximité : beaucoup (pleine), ou le contact qui te nourrit sans peser (légère). Connaître ton rythme t\'évite de le vivre comme un défaut — et de le faire deviner à l\'autre.',
      },
    ],
    accompagnement: {
      A: {
        fort: 'Quand quelqu\'un compte, ton cœur surveille : un silence, un mot plus court, et tu cherches à comprendre. Ce besoin de preuves n\'est pas un défaut — c\'est ton système d\'alarme du lien. Ce qui t\'aide : demander clairement, au bon moment, plutôt que décoder seul·e.',
        equilibre: 'Tu aimes savoir où tu en es, sans vivre dans l\'attente de signes. Les preuves te rassurent, l\'absence ne t\'effondre pas. Ton point d\'équilibre : dire ce qui t\'apaise avant que le doute s\'installe.',
        doux: 'Tu es tranquille dans le lien : un message qui tarde ne raconte pas une fin de monde. Tu donnes de la place naturellement. Vigilance : l\'autre, lui, peut avoir besoin de plus de signes — ta sérénité ne doit pas ressembler à de l\'indifférence.',
      },
      E: {
        fort: 'Tu as besoin de ton air : gérer seul·e, respirer entre deux moments, revenir quand tu as fini ton cycle intérieur. C\'est ta manière de rester bien. Vigilance : annonce tes pauses — un départ expliqué rassure, un départ silencieux inquiète.',
        equilibre: 'Tu sais être proche et prendre l\'air, selon la personne et le moment. La proximité ne t\'étouffe pas dès qu\'elle peut s\'arrêter de temps en temps. Ton repère : dire le mouvement avant que l\'autre ne l\'interprète.',
        doux: 'La proximité te nourrit : passer du temps, tout partager, être ensemble sans détour. C\'est une force de disponibilité. Vigilance : garde un coin rien qu\'à toi — c\'est ce qui rend ta présence un choix et non une habitude.',
      },
    },
    conseils: [
      'Relis ta carte à tête reposée, de préférence après un moment réel avec quelqu\'un qui compte : tu verras où elle se vérifie.',
      'Repense à ta dernière incompréhension en proche : relis ta zone d\'ombre — elle y ressemblait ?',
      'Nomme ta façon à l\'autre UNE fois — « quand je suis silencieux·se, ce n\'est pas toi » ou « quand je demande, c\'est juste me rassurer » : une phrase suffit à changer beaucoup.',
      'Aucune façon d\'aimer n\'est la bonne : la tienne s\'observe, elle ne se juge pas.',
      'Garde tes réponses : le miroir de cette quête s\'appuiera dessus à la prochaine étape.',
    ],
    commentLire:
      'Deux barres, deux mouvements de ton cœur : le besoin de réassurance et le besoin d\'espace. Chacune va de 0 à 100, tirée de tes réponses d\'aujourd\'hui — plus elle est pleine, plus tes réponses penchent de ce côté. Elles ne s\'opposent pas : elles dansent ensemble, et c\'est leur équilibre qui dessine ta façon d\'aimer. Chaque barre est suivie de ce qu\'elle regarde et de ce qu\'elle dit de toi.',
    ombreRelationnel: {
      V1:
        'En relation, ta zone d\'ombre peut donner : ta sérénité lue comme de la distance — l\'autre a peut-être besoin de plus de preuves que tu n\'en produis naturellement. Ce qui aide : dire ta stabilité à voix haute (« je suis bien, je reste »). Ce que toi tu vis tranquillement, l\'autre a besoin de l\'entendre pour le vivre pareil.',
      V2:
        'En relation, ta zone d\'ombre peut donner : une antenne si tendue vers l\'autre que son silence devient un événement — tu interroges, tu vérifies, tu attends un signe qui n\'arrive pas. Ce qui aide : demander clairement plutôt que décoder : « j\'ai besoin d\'entendre que tout va bien » est une force. C\'est la demande qui apaise, pas la réponse devinée.',
      V3:
        'En relation, ta zone d\'ombre peut donner : des pauses prises en silence que l\'autre vit comme un départ — ton besoin d\'air est légitime, son incertitude aussi. Ce qui aide : annoncer le mouvement avant de le faire : « je prends l\'air, je reviens. » La porte reste ouverte pendant que tu respires — et l\'autre cesse de compter les minutes.',
      V4:
        'En relation, ta zone d\'ombre peut donner : des signaux contradictoires — tout, puis de l\'air, puis tout — que l\'autre peut vivre comme de l\'instabilité alors que c\'est ta façon d\'avoir appris à aimer. Ce qui aide : nommer ta vitesse UNE fois : « quand je m\'éloigne, ce n\'est pas la fin — c\'est mon rythme. » La moitié du chemin est faite.',
      V5:
        'En relation, ta zone d\'ombre peut donner : une adaptation si fluide que tes propres besoins passent derrière ceux de l\'autre — et toi, tu finis par ne plus savoir ce que toi tu voulais. Ce qui aide : choisir à voix haute de temps en temps — le restau, le week-end, le film. Ta souplesse vaut encore plus quand elle part d\'un centre.',
    },
    suivante: '1.3',
    suite: {
      titre: 'Ta façon d\'aimer est posée.',
      intro:
        'Tu sais maintenant comment ton cœur s\'attache — et de quel air il a besoin. Reste le plus vivant de tous : ce que tu ressens, et ce que tu en fais.',
      questions: [
        'Que fais-tu quand une émotion monte en toi ?',
        'Comment nommes-tu ce que tu ressens ?',
        'Ce qui se passe en toi, cela se voit-il de dehors ?',
      ],
      cta: 'Découvrir ma façon de ressentir',
    },
  },
  '1.3': {
    id: '1.3',
    numero: 3,
    totalDuMonde: 3,
    titre: 'Tes émotions',
    sousTitre: 'La troisième quête du voyage.',
    annonce: Q13.BRIEFING.annonce,
    briefing: {
      aQuoiCaSert: Q13.BRIEFING.aQuoiCaSert,
      resultats: [
        'Ta carte — ta lumière et ta zone d\'ombre, en quelques mots.',
        'Ta tension intérieure — ce que tu cherches à tenir ensemble.',
        'Ton miroir — la lecture complète de ta vie émotionnelle, à la prochaine étape du voyage.',
        'Les pierres suivantes de ton portrait — ta vie émotionnelle nourrit tout ce qui vient.',
      ],
    },
    deck: () => Q13.deckQuete().map(itemLikert),
    format: 'likert',
    scorer: Q13.scorer,
    choisirVariante: (s) => Q13.choisirVariante(s as Q13.Score13),
    cartes: Q13.CARTES,
    completion: Q13.COMPLETION,
    dims: [
      {
        key: 'P',
        nom: 'Ta perception',
        sousLigne: 'savoir ce que tu ressens, même mêlé',
        genre: 'f',
        lecture:
          'Cette barre dit si ce qui se passe en toi s\'annonce tôt et clairement (pleine) ou se découvre après coup, par le corps ou les réactions (légère). C\'est la première marche : on ne peut nommer que ce qu\'on remarque — et tout le reste s\'appuie dessus.',
      },
      {
        key: 'R',
        nom: 'Ta régulation',
        sousLigne: 'ce que tu fais quand ça monte',
        genre: 'f',
        lecture:
          'Cette barre dit comment ça redescend quand ça monte : tu connais ton chemin de retour (pleine), ou la vague te porte plus vite que tu ne la portes (légère). Bonne nouvelle : c\'est la plus entraînable des trois — un geste répété dans le calme devient disponible dans la tempête.',
      },
      {
        key: 'X',
        nom: 'Ton expression',
        sousLigne: 'ce qui se voit et se dit de toi',
        genre: 'f',
        lecture:
          'Cette barre dit ce qui se voit de toi : les émotions se lisent dehors (pleine), ou tout travaille en dedans (légère). Les deux sont des styles — le bon, c\'est celui que tu sais expliquer à l\'autre : « je ressens beaucoup, je montre peu » est une information précieuse à donner.',
      },
    ],
    accompagnement: {
      P: {
        fort: 'Tu sais ce que tu ressens, souvent avant les mots. Tu repères les mélanges : un peu de joie, un fond de tristesse, une pointe de peur. Un seul conseil : l\'émotion comprise n\'est pas l\'émotion réglée — les deux se travaillent ensemble.',
        equilibre: 'Tes états intérieurs te parlent par moments : clairs certains jours, embrouillés d\'autres. C\'est le rythme de la plupart des gens. Ton levier : nommer tôt — « je suis agacé·e » dit à 15 h évite l\'explosion à 20 h.',
        doux: 'Ce qui se passe en toi t\'arrive plutôt qu\'il ne s\'annonce. Tu le découvres parfois après coup, par le corps ou par les réactions. Ce n\'est pas un mur : c\'est une langue qu\'on apprend — une question simple par jour (« qu\'est-ce que je ressens, maintenant ? ») suffit à l\'installer.',
      },
      R: {
        fort: 'Quand ça monte, tu sais faire redescendre : gestes, mots, temps. Tu n\'es pas à l\'abri des coups de chaud, mais tu connais ton chemin de retour. Vigilance : te calmer seul·e ne doit pas devenir ne jamais demander d\'aide.',
        equilibre: 'Parfois tu traverses tes émotions, parfois elles te traversent. Tu connais certains gestes qui apaisent, et d\'autres moments où la rumination gagne. Ton levier : repérer TON premier signal physique — c\'est lui qui te donne le plus de temps.',
        doux: 'Les émotions fortes te portent plus vite que tu ne les portes. Les regrets après les coups de chaud te connaissent peut-être. Bonne nouvelle : la régulation s\'apprend très bien — un geste, répété dans le calme, devient disponible dans la tempête.',
      },
      X: {
        fort: 'Chez toi, ça se voit et ça se dit : tu félicites, tu consoles, tu dis ce que les gens représentent. Ça fait du bien autour de toi. Vigilance : tes propres émotions méritent la même sortie — elles aussi ont droit à la file d\'attente courte.',
        equilibre: 'Tu partages ce que tu vis quand c\'est le bon moment et la bonne personne. Tu peux taire ce qui est intime sans que ça pèse. Ton levier : une phrase sincère de plus par semaine — à voix haute, elle change les relations.',
        doux: 'Tu ressens beaucoup en dedans, et peu se voit dehors. Ce n\'est pas de la froideur : c\'est ta pudeur ou ta prudence. Ton levier : commencer par l\'écrit — un message long dit ce que la voix bloque encore.',
      },
    },
    conseils: [
      'Relis ta carte à tête reposée — les émotions se lisent mieux hors de la tempête.',
      'Choisis UNE émotion de la semaine et exerce-toi à la nommer tôt : c\'est l\'exercice qui rapporte le plus.',
      'Repère ton premier signal physique quand ça monte : c\'est ton meilleur prévenu.',
      'Ta perception, ta régulation, ton expression : trois muscles, pas trois destins — chaque semaine, un petit pas sur l\'un d\'eux.',
      'Garde tes réponses : le miroir de cette quête s\'appuiera dessus à la prochaine étape.',
    ],
    commentLire:
      'Trois barres, trois muscles de ta vie émotionnelle : percevoir, apaiser, exprimer. Chacune va de 0 à 100, tirée de tes réponses d\'aujourd\'hui — plus elle est pleine, plus tes réponses penchent de ce côté. Un muscle léger n\'est pas une condamnation : c\'est simplement le prochain à entraîner. Chaque barre est suivie de ce qu\'elle regarde et de ce qu\'elle dit de toi.',
    ombreRelationnel: {
      V1:
        'En relation, ta zone d\'ombre peut donner : l\'impression que tu gères toujours seul·e — ton aisance peut masquer que toi aussi tu as besoin d\'aide sur certaines vagues. Ce qui aide : laisser entrer quelqu\'un sur UNE émotion que tu maîtrises mal. La clarté se renforce quand elle accepte un regard.',
      V2:
        'En relation, ta zone d\'ombre peut donner : des éclats qui effraient plus qu\'ils ne disent — l\'autre retient le ton et peut manquer le fond. Ce qui aide : prévenir tôt (« ça monte, ce n\'est pas toi ») et revenir après : une réparation rapide vaut mille préventions parfaites.',
      V3:
        'En relation, ta zone d\'ombre peut donner : une profondeur silencieuse que l\'autre ne sait pas lire — il peut croire à de l\'indifférence là où tout est vivant. Ce qui aide : convenir d\'un petit signe extérieur (un mot, un geste) qui dit « tout va bien en dedans ». Ta profondeur devient partageable sans que tu changes.',
      V4:
        'En relation, ta zone d\'ombre peut donner : un entourage qui s\'appuie tant sur toi que tes propres vagues n\'ont plus de place pour se montrer. Ce qui aide : choisir UNE personne à qui dire tes vrais états, une fois par semaine. Renverser le sens du radiateur — c\'est ce qui le rend durable.',
      V5:
        'En relation, ta zone d\'ombre peut donner : une pudeur lue comme de la froideur — l\'autre imagine mal tout ce qui vit derrière. Ce qui aide : l\'écrit d\'abord : un message long, une carte — la voix viendra. Et dis à l\'autre que c\'est ton style : ce que tu ouvres, choisi, vaut de l\'or.',
      V6:
        'En relation, ta zone d\'ombre peut donner : des moments où tu dis « je ne sais pas ce que je ressens » et l\'autre le vit comme un mur — alors que c\'est un chantier en cours. Ce qui aide : partager la recherche à voix haute : « je ne sais pas encore, mais je creuse. » C\'est une présence, pas une absence.',
    },
    suivante: null,
    suite: {
      titre: 'Ton premier monde est complet.',
      intro:
        'Ta personnalité, ton attachement, tes émotions — trois miroirs, trois éclairages. C\'est déjà une carte rare : la tienne.',
      questions: [],
    },
  },

  // ------------------------------------------------- Monde 2 « Le Volant »
  // Quêtes 1.4 → 1.11 (la série 1.x traverse M1/M2 — le code reste la clé).
  // Contenu VERBATIM des Livrables M2 (branche archive/v1-2026-10-05) ;
  // couches APP (dims/accompagnement/conseils/suite) rédigées ton Task 35.
  '1.4': {
    id: '1.4',
    numero: 1,
    totalDuMonde: 7,
    titre: 'Ton contrôle sur toi-même',
    ...DEF_14,
    annonce: Q14.BRIEFING.annonce,
    briefing: {
      aQuoiCaSert: Q14.BRIEFING.aQuoiCaSert,
      resultats: Q14.BRIEFING.resultats,
    },
    deck: () => Q14.deckQuete().map(itemLikert),
    format: 'likert',
    scorer: Q14.scorer,
    choisirVariante: (s) => Q14.choisirVariante(s as Q14.Score14),
    cartes: Q14.CARTES,
    completion: Q14.COMPLETION,
  },
  '1.5': {
    id: '1.5',
    numero: 2,
    totalDuMonde: 7,
    titre: "L'épreuve du temps",
    ...DEF_15,
    annonce: Q15.BRIEFING.annonce,
    briefing: {
      aQuoiCaSert: Q15.BRIEFING.aQuoiCaSert,
      resultats: Q15.BRIEFING.resultats,
    },
    deck: Q15.deckChoix,
    format: 'choix',
    scorer: Q15.scorer,
    choisirVariante: (s) => Q15.choisirVariante(s as Q15.Score15),
    cartes: Q15.CARTES,
    completion: Q15.COMPLETION,
  },
  '1.6': {
    id: '1.6',
    numero: 3,
    totalDuMonde: 7,
    titre: 'Ta façon de penser',
    ...DEF_16,
    annonce: Q16.BRIEFING.annonce,
    briefing: {
      aQuoiCaSert: Q16.BRIEFING.aQuoiCaSert,
      resultats: Q16.BRIEFING.resultats,
    },
    // Le deck mêle les 7 items Likert (mélange graine 216427) ET les 3 énigmes
    // (hors mélange, ordre source É1 → É2 → É3 — contrat du Livrable).
    deck: () => [...Q16.deckQuete().map(itemLikert), ...Q16.deckEnigmes()],
    format: 'likert-enigmes',
    scorer: Q16.scorer,
    choisirVariante: (s) => Q16.choisirVariante(s as Q16.Score16),
    cartes: Q16.CARTES,
    completion: Q16.COMPLETION,
  },
  '1.7': {
    id: '1.7',
    numero: 4,
    totalDuMonde: 7,
    titre: 'Ton fonctionnement (optionnel)',
    ...DEF_17,
    annonce: Q17.BRIEFING.annonce,
    briefing: {
      aQuoiCaSert: Q17.BRIEFING.aQuoiCaSert,
      resultats: Q17.BRIEFING.resultats,
    },
    deck: Q17.deck17,
    format: 'ecran',
    scorer: Q17.scorerNul,
    choisirVariante: Q17.choisirVariante,
    cartes: {},
    sansCarte: true,
    completion: Q17.COMPLETION,
  },
  '1.9': {
    id: '1.9',
    numero: 5,
    totalDuMonde: 7,
    titre: 'Ton élan du moment',
    ...DEF_19,
    annonce: Q19.BRIEFING.annonce,
    briefing: {
      aQuoiCaSert: Q19.BRIEFING.aQuoiCaSert,
      resultats: Q19.BRIEFING.resultats,
    },
    deck: () => Q19.deckQuete().map(itemLikert),
    format: 'likert',
    scorer: Q19.scorer,
    choisirVariante: (s) => Q19.choisirVariante(s as Q19.Score19),
    cartes: Q19.CARTES,
    completion: Q19.COMPLETION,
  },
  '1.10': {
    id: '1.10',
    numero: 6,
    totalDuMonde: 7,
    titre: 'Ce que tu apportes',
    ...DEF_110,
    annonce: Q110.BRIEFING.annonce,
    briefing: {
      aQuoiCaSert: Q110.BRIEFING.aQuoiCaSert,
      resultats: Q110.BRIEFING.resultats,
    },
    deck: () => Q110.deckQuete().map(itemLikert),
    format: 'likert',
    scorer: Q110.scorer,
    choisirVariante: (s) => Q110.choisirVariante(s as unknown as Q110.Score110),
    cartes: Q110.CARTES,
    completion: Q110.COMPLETION,
  },
  '1.11': {
    id: '1.11',
    numero: 7,
    totalDuMonde: 7,
    titre: 'Es-tu prêt·e à rencontrer ?',
    ...DEF_111,
    annonce: Q111.BRIEFING.annonce,
    briefing: {
      aQuoiCaSert: Q111.BRIEFING.aQuoiCaSert,
      resultats: Q111.BRIEFING.resultats,
    },
    deck: Q111.deck111,
    format: 'ecran',
    scorer: Q111.scorerNul111,
    choisirVariante: Q111.choisirVariante,
    cartes: {},
    sansCarte: true,
    completion: Q111.COMPLETION,
  },
  // ─── Monde 3 « La Boussole » — les 8 quêtes 2.1 → 2.8 (Livrable verbatim) ───
  '2.1': {
    id: '2.1',
    numero: 1,
    totalDuMonde: 8,
    titre: 'Tes valeurs',
    ...DEF_21,
    annonce: Q21.BRIEFING.annonce,
    briefing: {
      aQuoiCaSert: Q21.BRIEFING.aQuoiCaSert,
      resultats: Q21.BRIEFING.resultats,
    },
    deck: () => Q21.deckQuete().map(itemLikert),
    format: 'likert',
    scorer: Q21.scorer,
    choisirVariante: (s) => Q21.choisirVariante(s as Q21.Score21),
    cartes: Q21.CARTES,
    completion: Q21.COMPLETION,
  },
  '2.2': {
    id: '2.2',
    numero: 2,
    totalDuMonde: 8,
    titre: 'Ta place pour la spiritualité',
    ...DEF_22,
    annonce: Q22.BRIEFING.annonce,
    briefing: {
      aQuoiCaSert: Q22.BRIEFING.aQuoiCaSert,
      resultats: Q22.BRIEFING.resultats,
    },
    deck: () => Q22.deckQuete().map(itemLikert),
    format: 'likert',
    scorer: Q22.scorer,
    choisirVariante: (s) => Q22.choisirVariante(s as Q22.Score22),
    cartes: Q22.CARTES,
    completion: Q22.COMPLETION,
  },
  '2.3': {
    id: '2.3',
    numero: 3,
    totalDuMonde: 8,
    titre: 'Tes non-négociables',
    ...DEF_23,
    annonce: Q23.BRIEFING.annonce,
    briefing: {
      aQuoiCaSert: Q23.BRIEFING.aQuoiCaSert,
      resultats: Q23.BRIEFING.resultats,
    },
    // UN écran : les 9 lignes rouges cochables (ordre gelé graine 23427) +
    // le champ libre Q2.3-10 (hors deck, hors computation). La complétion est
    // posée par « Valider » (gate Q2.3-valide, voir Quete.tsx).
    deck: () => Q23.deckQuete().map(itemLikert),
    format: 'checklist',
    scorer: Q23.scorer,
    choisirVariante: (s) => Q23.choisirVariante(s as Q23.Score23),
    cartes: Q23.CARTES,
    completion: Q23.COMPLETION,
  },
  '2.4': {
    id: '2.4',
    numero: 4,
    totalDuMonde: 8,
    titre: 'Tes réalités',
    ...DEF_24,
    annonce: Q24.BRIEFING.annonce,
    briefing: {
      aQuoiCaSert: Q24.BRIEFING.aQuoiCaSert,
      resultats: Q24.BRIEFING.resultats,
    },
    // UN-CLIC : chaque déclaration porte ses options verbatim (un toucher).
    deck: () => Q24.deckQuete().map((it) => ({ code: it.code, text: it.text, format: 'question' as const, options: it.options })),
    format: 'clic',
    scorer: Q24.scorer,
    choisirVariante: (s) => Q24.choisirVariante(s as Q24.Score24),
    cartes: Q24.CARTES,
    completion: Q24.COMPLETION,
  },
  '2.5': {
    id: '2.5',
    numero: 5,
    totalDuMonde: 8,
    titre: 'Ce que tu cherches',
    ...DEF_25,
    annonce: Q25.BRIEFING.annonce,
    briefing: {
      aQuoiCaSert: Q25.BRIEFING.aQuoiCaSert,
      resultats: Q25.BRIEFING.resultats,
    },
    // BINAIRE : 3 énoncés (Oui / Non) + la 4ᵉ réponse globale « Je découvre »
    // (gate Q2.5-intention — voir Quete.tsx : le message doux n'arrive que sur
    // la combinaison Non/Non/Non).
    deck: () => Q25.deckQuete().map((it) => ({ code: it.code, text: it.text, format: 'question' as const, options: ['Oui', 'Non'] })),
    format: 'binaire',
    // Score25 porte l'intention (chaîne) — cast de pont vers le contrat app ;
    // la lecture des barres n'utilise que la clé numérique « cap ».
    scorer: (r) => Q25.scorer(r) as unknown as Record<string, number>,
    choisirVariante: (s) => Q25.choisirVariante(s as Q25.Score25),
    cartes: Q25.CARTES,
    completion: Q25.COMPLETION,
  },
  '2.6': {
    id: '2.6',
    numero: 6,
    totalDuMonde: 8,
    titre: 'Tes priorités pour les 5 prochaines années',
    ...DEF_26,
    annonce: Q26.BRIEFING.annonce,
    briefing: {
      aQuoiCaSert: Q26.BRIEFING.aQuoiCaSert,
      resultats: Q26.BRIEFING.resultats,
    },
    // JEU D'ARBITRAGE : UN écran — 100 points sur 5 curseurs, somme verrouillée
    // (gate Q2.6-valide). Les libellés du deck = les noms d'axes ; les
    // descriptions verbatim vivent dans Q26.AXES (rendu arbitrage).
    deck: () => Q26.deckQuete().map((a) => ({ code: a.code, text: a.nom, format: 'question' as const, options: [] })),
    format: 'arbitrage',
    scorer: Q26.scorer,
    choisirVariante: (s) => Q26.choisirVariante(s as Q26.Score26),
    cartes: Q26.CARTES,
    completion: Q26.COMPLETION,
  },
  '2.7': {
    id: '2.7',
    numero: 7,
    totalDuMonde: 8,
    titre: 'Ta vision de la famille',
    ...DEF_27,
    annonce: Q27.BRIEFING.annonce,
    briefing: {
      aQuoiCaSert: Q27.BRIEFING.aQuoiCaSert,
      resultats: Q27.BRIEFING.resultats,
    },
    deck: () => Q27.deckQuete().map(itemLikert),
    format: 'likert',
    scorer: Q27.scorer,
    choisirVariante: (s) => Q27.choisirVariante(s as Q27.Score27),
    cartes: Q27.CARTES,
    completion: Q27.COMPLETION,
  },
  '2.8': {
    id: '2.8',
    numero: 8,
    totalDuMonde: 8,
    titre: 'Ton signe (juste pour le jeu)',
    ...DEF_28,
    annonce: Q28.BRIEFING.annonce,
    briefing: {
      aQuoiCaSert: Q28.BRIEFING.aQuoiCaSert,
      resultats: Q28.BRIEFING.resultats,
    },
    deck: Q28.deck28,
    format: 'jeu',
    scorer: Q28.scorerNul28,
    choisirVariante: (s) => Q28.choisirVariante(s),
    cartes: Q28.CARTES,
    sansCarte: true,
    completion: Q28.COMPLETION,
  },
};

/** Le registre LOCALISÉ — fusion FR × miroir EN au chargement (repli FR
 *  champ à champ : une traduction manquante ne casse jamais l'écran). */
export const QUETES: Record<IdQuete, QueteDef> = avecEN(REGISTRE_FR, REGISTRE_EN);

/** Le monde d'une quête (les séries 1.x et 2.x traversent les mondes — le
 *  code reste la clé). Utilisé par les écrans : chip d'entête,
 *  marquerMondeEnCours, libellés. */
export function mondeDeQuete(id: IdQuete): { code: 'M1' | 'M2' | 'M3'; nom: string } {
  if (id === '1.1' || id === '1.2' || id === '1.3')
    return { code: 'M1', nom: getLang() === 'en' ? MONDES_NOMS.M1 : 'Monde 1 — Le Miroir' };
  if (id.startsWith('1.'))
    return { code: 'M2', nom: getLang() === 'en' ? MONDES_NOMS.M2 : 'Monde 2 — Le Volant' };
  return { code: 'M3', nom: getLang() === 'en' ? MONDES_NOMS.M3 : 'Monde 3 — La Boussole' };
}

/** Le niveau Likert (labels verbatim FR — miroir EN dans registre-commun). */
export const LIKERT: readonly LikertNiveau[] = avecEN(
  Q11.LIKERT,
  Object.entries(LIKERT_EN).map(([v, label]) => ({ value: Number(v), label })),
);

// ------------------------------------------------------------- couche accompagnement

/** Paliers de lecture des barres (couche app — distincts des verrous [9]). */
export type Palier = 'fort' | 'equilibre' | 'doux';

export function palierDe(pct: number): Palier {
  return pct >= 0.65 ? 'fort' : pct >= 0.4 ? 'equilibre' : 'doux';
}

/** Le libellé de palier, accordé au genre du nom de la tendance — format
 *  fondateur Task 35 : « Ton ouverture — 78/100 (très présente) ». Le
 *  qualitatif reste premier, le chiffre secondaire (leçon Task 32 : pas de
 *  « 78 % » qui pousse score → comparaison → classement). */
export function labelPalier(palier: Palier, genre: 'f' | 'm'): string {
  if (getLang() === 'en') return LABELS_PALIER_EN[palier] ?? palier;
  if (palier === 'fort') return genre === 'f' ? 'très présente' : 'très présent';
  if (palier === 'equilibre') return genre === 'f' ? 'équilibrée' : 'équilibré';
  return genre === 'f' ? 'plus discrète' : 'plus discret';
}

/** « À noter » — la passe d'honnêteté du gabarit fondateur (Task 35),
 *  refermée après les tendances (écran + PDF, texte identique). */
export const NOTA_BARRES = getLang() === 'en' ? NOTA_BARRES_EN :
  'À noter : ces barres sont un instantané de tes réponses du jour, pas des notes ni des verdicts. Chaque tendance a sa force et son risque — l\'important est de choisir consciemment où placer le curseur.';

const MOTS_NOMBRE: Record<number, string> = { 2: 'deux', 3: 'trois', 4: 'quatre', 5: 'cinq' };

/** Le titre de la section tendances, pluriel justement accordé —
 *  « 🪞 Tes cinq tendances (d'après tes réponses) » (5 dims en 1.1) ;
 *  singulier accordé pour les quêtes mono-dimension (« Ta tendance »). */
export function titreTendances(nb: number): string {
  if (getLang() === 'en') {
    if (nb === 1) return TITRE_TENDANCE_UNIQUE_EN;
    return TITRE_TENDANCES_PLURIEL_EN.split('{{mot}}').join(MOTS_NOMBRE_EN[nb] ?? String(nb));
  }
  if (nb === 1) return "Ta tendance (d'après tes réponses)";
  return `Tes ${MOTS_NOMBRE[nb] ?? String(nb)} tendances (d'après tes réponses)`;
}

export interface RepartitionLigne {
  value: 1 | 2 | 3 | 4 | 5;
  label: string;
  n: number;
}

export interface BarreDetail {
  key: string;
  nom: string;
  sousLigne: string;
  /** 0-100 — la valeur RÉELLE produite par le scorer du Livrable. */
  pct: number;
  palier: Palier;
  /** Le libellé du palier, accordé au genre (gabarit fondateur Task 35). */
  palierLabel: string;
  texte: string;
  /** Ce que cette barre regarde — l'explication de la tendance (demande fondateur).
   *  Donnée conservée — non rendue au gabarit 35. */
  lecture: string;
}

export interface ApercuResultats {
  titre: string;
  intro: string;
  /** Comment lire ces barres — la passe d'explication globale (demande fondateur). */
  commentLire: string;
  bars: BarreDetail[];
  conseils: readonly string[];
}

/** Construit l'aperçu « résultats en détail » à partir des réponses réelles.
 *  (Task 28 — demande fondateur : plus d'explications [commentLire + lecture]
 *  et suppression du chapitre « Ta manière de répondre ».) */
export function construireApercuResultats(quete: QueteDef, reponses: Record<string, number>): ApercuResultats {
  const score = quete.scorer(reponses);
  const bars: BarreDetail[] = quete.dims.map((d) => {
    const valeur = score[d.key] ?? 0;
    const palier = palierDe(valeur);
    return {
      key: d.key,
      nom: d.nom,
      sousLigne: d.sousLigne,
      pct: Math.round(valeur * 100),
      palier,
      palierLabel: labelPalier(palier, d.genre),
      texte: quete.accompagnement[d.key]?.[palier] ?? '',
      lecture: d.lecture,
    };
  });
  return {
    titre: getLang() === 'en' ? `${quete.titre} — your results in detail` : `${quete.titre} — tes résultats en détail`,
    intro:
      getLang() === 'en'
        ? INTRO_APERCU_EN
        : 'Voici ce que tes réponses dessinent aujourd\'hui. Aucune barre ne te réduit : chacune décrit une tendance — un lieu d\'où tu pars, pas une case où tu restes.',
    commentLire: quete.commentLire,
    bars,
    conseils: quete.conseils,
  };
}

/** Le nom de fichier du PDF des résultats. */
export function nomFichierPdf(quete: QueteDef): string {
  return `wairyu-resultats-${quete.titre
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')}.pdf`;
}
