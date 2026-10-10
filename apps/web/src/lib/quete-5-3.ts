/**
 * Quête 5.3 « Comment tu exprimes ton affection » — Monde 6 « Mon Cœur ».
 *
 * Contenu FIDÈLE au Livrable M6-5.3-Comment-Tu-Exprimes-Ton-Affection :
 *  - ITEMS : les 10 items Likert (verbatim 01-tableau-des-items, ordre du
 *    tableau) — 5 canaux × 2 items, 5 paires R6 complètes (01×02 · 03×04 ·
 *    05×06 · 07×08 · 09×10), 5 D / 5 I (équilibré — option documentée du
 *    cadre gelé : chaque paire R6 porte un D et un I par construction) ;
 *  - PASSATION : l'ordre de passation GELÉ (mélange RÉEL graine 253427,
 *    outil générique melange.py, tentative 1, 5 passes identiques octet
 *    pour octet — 6/6 contraintes PASS, empreinte 59527dae… reproduisant
 *    l'enregistrement V11) : 07 · 10 · 01 · 06 · 08 · 09 · 04 · 05 · 02 ·
 *    03 — le 1ᵉʳ item vu est Q5.3-07, le dernier Q5.3-03 ; positions par
 *    canal : attentions {1,5} · contact {2,6} · mots {3,9} · gestes {4,8} ·
 *    temps {7,10}. AUCUNE trame hébergée — 5.3 est une quête 100 % carte ;
 *  - CARTES : les 6 variantes verbatim (cartes.yaml, charte C1-C11) ;
 *  - choisirVariante : la sélection VERBATIM du 07-miroir §0 (SIG-5.3-01
 *    « Le canal qui parle ») : dominant = max des 5 moyennes de canal ;
 *    écart max − min ≤ 0.25 → profil équilibré (6ᵉ variante) ; ex æquo
 *    strict sur le max → équilibré — partition exclusive + exhaustive, C6.
 *    Borne 0.25 provisoire concepteur (À VALIDER PAR LE COMITÉ [9]) —
 *    jamais rendue ;
 *  - BRIEFING : l'annonce est verbatim (05-ecran-d-intro), les puces sont
 *    la couche app rédigée (ton Task 35) — premium change zéro chose au
 *    contenu ([6]) : zéro teaser, aucune présupposition, aucune annonce de
 *    la suite ;
 *  - COMPLETION : entête, labels (moule 4.1) et fenêtre F1 verbatim
 *    (cartes.yaml), miroirNote en couche app.
 *
 * ═══ RÈGLE CAPITALE — GRAVÉE ICI ET AU 00-README + 03 ════════════════
 *   « JAMAIS DANS LE SCORE » — cette quête est CONVERSATIONNELLE
 *   uniquement : cartes de dialogue, mode d'emploi croisé à deux. Les 5
 *   moyennes de canal (CANAL_MOTS · CANAL_TEMPS · CANAL_GESTES ·
 *   CANAL_ATTENTIONS · CANAL_CONTACT) routent l'AFFICHAGE (carte, miroir,
 *   signature affichée) et ne traversent JAMAIS la frontière
 *   moteur/matching : aucune pondération, aucune agrégation au score de
 *   compatibilité, aucune signature de matching, aucun croisement de
 *   quête (exemption de domaine gravée au 03 — 5.3 exclue des liaisons
 *   5.1×5.4, 5.1×5.5, 5.2×5.4, 5.2×5.6, 5.7×5.4, 5.7×5.5).
 *   Dans CETTE app, il n'y a pas de moteur de matching branché : le
 *   scorer produit les 5 barres d'affichage, comme les autres quêtes —
 *   la règle est documentée en commentaire, rien à désactiver.
 * ═════════════════════════════════════════════════════════════════════
 *
 * SYMÉTRIE DES CANAUX (doctrine capitale du Livrable) : cinq façons
 * égales d'exprimer et de recevoir l'affection — aucun canal n'est
 * « supérieur », le canal discret n'est pas un défaut : il est l'adresse
 * des demandes non formulées. Formule signature gravée au 03 : « ton
 * canal dominant dit ce qui te remplit — ton canal le plus discret dit
 * ce que tu ne demanderas jamais » — le 07 l'indique : elle contient un
 * absolu interdit au texte affiché, elle s'exprime donc au rendu EN
 * REGISTRE PROBABILISTE (fenêtre F1 et cartouches : le discret = les
 * demandes non formulées) et ne se cite pas au texte affiché.
 *
 * MARQUE DÉPOSÉE — INTERDIT DE MARQUE (gravé au 00-README + 03) : le nom
 * de marque déposée du domaine des canaux d'expression affective — et
 * toute variante, française ou anglaise — est INTERDIT en toutes lettres
 * dans tout le dossier, UI et commentaires compris : zéro occurrence,
 * vérifié machine. Le concept est public ; les 5 libellés UI ci-dessous
 * sont les formulations neutres Wairyu ; les items sont 100 % originaux
 * Wairyu. Les noms scientifiques d'auteurs ne sortent pas au rendu.
 *
 * Typo : apostrophe ASCII uniquement, guillemets français. Règles : aucun
 * code, score, sigle ou seuil ne franchit le rendu ; phrases ≤ 22 mots.
 */

import { avecEN } from '../i18n/apply';
import * as EN_Q53 from '../i18n/content/en/quete-5-3';

export interface QueteItem53 {
  code: string;
  text: string;
  /** 'D' = directe, 'I' = inversée (recodée 6 − r). */
  orient: 'D' | 'I';
  /** Le canal verbatim du tableau 01 — clé sans accent (5 canaux). */
  dim: 'mots' | 'temps' | 'gestes' | 'attentions' | 'contact';
}

/** L'objet de passation affiché — code + énoncé (l'orientation reste côté moteur). */
export interface ItemsQuete53 {
  code: string;
  text: string;
}

/** Les canaux de la quête — clés du scorer, sans accent. */
export type Canal53 = 'mots' | 'temps' | 'gestes' | 'attentions' | 'contact';

/** Ordre canonique des 5 canaux (l'affichage reste symétrique — aucun tri
 *  de valeur ici, ce sont des clés de restitution). */
export const CANAUX_ORDRE: readonly Canal53[] = [
  'mots',
  'temps',
  'gestes',
  'attentions',
  'contact',
];

/** Les 5 libellés UI — formulations neutres Wairyu OBLIGATOIRES
 *  (00-README : noms génériques UI, la marque déposée du domaine n'existe
 *  pas pour ce dossier). Ces libellés routent l'affichage conversationnel
 *  (cartes de dialogue, mode d'emploi croisé à deux). */
export const CANAUX_UI: Record<Canal53, string> = {
  mots: 'mots valorisants',
  temps: 'temps partagé',
  gestes: 'gestes et services',
  attentions: 'attentions et cadeaux',
  contact: 'contact physique',
};

/** Les 10 items — verbatim (01-tableau-des-items, ordre du tableau). */
const ITEMS_FR: readonly QueteItem53[] = [
  {
    code: "Q5.3-01",
    text: "Un mot qui me valorise me porte toute la journée.",
    orient: "D",
    dim: "mots",
  },
  {
    code: "Q5.3-02",
    text: "Les compliments glissent sur moi sans y entrer.",
    orient: "I",
    dim: "mots",
  },
  {
    code: "Q5.3-03",
    text: "Du temps à deux, sans écran, me remplit.",
    orient: "D",
    dim: "temps",
  },
  {
    code: "Q5.3-04",
    text: "Une présence distraite me suffit largement.",
    orient: "I",
    dim: "temps",
  },
  {
    code: "Q5.3-05",
    text: "Qu'on me rende service me touche autant qu'un mot.",
    orient: "D",
    dim: "gestes",
  },
  {
    code: "Q5.3-06",
    text: "Un service rendu reste une tâche, pas un aveu.",
    orient: "I",
    dim: "gestes",
  },
  {
    code: "Q5.3-07",
    text: "Une petite attention choisie pour moi me marque.",
    orient: "D",
    dim: "attentions",
  },
  {
    code: "Q5.3-08",
    text: "Un cadeau, même choisi avec soin, me dit peu.",
    orient: "I",
    dim: "attentions",
  },
  {
    code: "Q5.3-09",
    text: "Un câlin fait passer les mots au second plan.",
    orient: "D",
    dim: "contact",
  },
  {
    code: "Q5.3-10",
    text: "Je me sens aimé·e sans avoir besoin de toucher.",
    orient: "I",
    dim: "contact",
  },
];
export const ITEMS = avecEN(ITEMS_FR, EN_Q53.ITEMS);

/** Ordre de passation GELÉ — mélange RÉEL graine 253427 (02-plan-de-melange ;
 *  le 1ᵉʳ item vu est Q5.3-07, le dernier Q5.3-03 — JAMAIS l'ordre des
 *  codes). Verdicts RÉELS : c1 PASS 0 adjacence · c2/c3 sans-objet (0
 *  trame hébergée) · c4 PASS 0 déficit · c5 PASS run max 2 · c6 PASS. */
export const PASSATION: readonly string[] = [
  "Q5.3-07",
  "Q5.3-10",
  "Q5.3-01",
  "Q5.3-06",
  "Q5.3-08",
  "Q5.3-09",
  "Q5.3-04",
  "Q5.3-05",
  "Q5.3-02",
  "Q5.3-03",
];

const PAR_CODE = new Map(ITEMS.map((i) => [i.code, i]));

/** Le deck réel : les 10 items dans l'ordre gelé — aucune trame n'existe
 *  pour 5.3 (quête 100 % carte, rien à sauter, rien à masquer). */
export function deckQuete(): ItemsQuete53[] {
  return PASSATION.flatMap((c) => {
    const it = PAR_CODE.get(c);
    return it ? [{ code: it.code, text: it.text }] : [];
  });
}

/** Likert 1-5 → 0-1 (inversées recodées 6 − r — Arbitrage 1). */
function contribution(reponse: number, orient: 'D' | 'I'): number {
  return ((orient === 'D' ? reponse : 6 - reponse) - 1) / 4;
}

export interface Score53 {
  /** Canal « mots valorisants » — moyenne des 2 items (I recodés), 0-1. */
  mots: number;
  /** Canal « temps partagé » — moyenne des 2 items (I recodés), 0-1. */
  temps: number;
  /** Canal « gestes et services » — moyenne des 2 items (I recodés), 0-1. */
  gestes: number;
  /** Canal « attentions et cadeaux » — moyenne des 2 items (I recodés), 0-1. */
  attentions: number;
  /** Canal « contact physique » — moyenne des 2 items (I recodés), 0-1. */
  contact: number;
  /** Signature d'index (contrat du registre : Record<string, number>) —
   *  les clés des canaux, sans accent. */
  [canal: string]: number;
}

/**
 * Scorer du Livrable : 5 moyennes de canal (2 items chacune, I recodés
 * 6 − r, normalisées 0-1) — elles routent l'AFFICHAGE SEUL (carte 6
 * variantes, miroir 6 profils, signature affichée dominant + secondaire).
 * RÈGLE CAPITALE — JAMAIS DANS LE SCORE : aucune de ces valeurs n'a
 * d'autre destination (gravé au 00-README + 03, verrou 04 n° 1) ; dans
 * cette app sans moteur de matching, elles produisent les barres
 * d'affichage comme les autres quêtes — rien à désactiver.
 */
export function scorer(reponses: Record<string, number>): Score53 {
  const parCanal = new Map<string, { total: number; n: number }>();
  for (const code of PASSATION) {
    const it = PAR_CODE.get(code);
    const r = it ? reponses[it.code] : undefined;
    if (it && typeof r === 'number' && r >= 1 && r <= 5) {
      const c = contribution(r, it.orient);
      const bloc = parCanal.get(it.dim) ?? { total: 0, n: 0 };
      bloc.total += c;
      bloc.n += 1;
      parCanal.set(it.dim, bloc);
    }
  }
  const canal = (dim: string): number => {
    const bloc = parCanal.get(dim);
    return bloc && bloc.n > 0 ? bloc.total / bloc.n : 0;
  };
  return {
    mots: canal('mots'),
    temps: canal('temps'),
    gestes: canal('gestes'),
    attentions: canal('attentions'),
    contact: canal('contact'),
  };
}

/** Les 6 variantes — ids VERBATIM (cartes.yaml). */
export type VarianteId53 =
  | 'CARTE-5.3-MOTS-QUI-DISENT'
  | 'CARTE-5.3-PRESENCE-PLEINE'
  | 'CARTE-5.3-GESTE-QUI-DIT'
  | 'CARTE-5.3-DETAIL-JUSTE'
  | 'CARTE-5.3-PEAU-QUI-PARLE'
  | 'CARTE-5.3-ECOUTE-LARGE';

/**
 * Sélecteur VERBATIM (07-miroir §0 + cartes.yaml — SIG-5.3-01 « Le canal
 * qui parle », partition exclusive + exhaustive des 5 moyennes, C6) :
 * dominant = max des 5 canaux ; écart max − min ≤ 0.25 → profil équilibré
 * (ECOUTE-LARGE) ; ex æquo strict sur le max → équilibré. Le secondaire
 * (2ᵉ du tri) s'affiche en conversation (triCaniaux). Borne 0.25
 * provisoire concepteur (À VALIDER PAR LE COMITÉ [9] — re-signature
 * professionnelle avant bêta) : métadonnée moteur, jamais affichée.
 * RÈGLE CAPITALE — JAMAIS DANS LE SCORE : routage d'affichage
 * conversationnel, aucune entrée moteur.
 */
export function choisirVariante(score: Score53): VarianteId53 {
  const val = (c: Canal53): number =>
    typeof score[c] === 'number' ? score[c] : 0;
  const canaux: ReadonlyArray<{ id: VarianteId53; val: number }> = [
    { id: 'CARTE-5.3-MOTS-QUI-DISENT', val: val('mots') },
    { id: 'CARTE-5.3-PRESENCE-PLEINE', val: val('temps') },
    { id: 'CARTE-5.3-GESTE-QUI-DIT', val: val('gestes') },
    { id: 'CARTE-5.3-DETAIL-JUSTE', val: val('attentions') },
    { id: 'CARTE-5.3-PEAU-QUI-PARLE', val: val('contact') },
  ];
  const max = Math.max(...canaux.map((c) => c.val));
  const min = Math.min(...canaux.map((c) => c.val));
  const nbMax = canaux.filter((c) => c.val === max).length;
  if (max - min <= 0.25 || nbMax > 1) return 'CARTE-5.3-ECOUTE-LARGE';
  const gagnant = canaux.find((c) => c.val === max);
  return gagnant ? gagnant.id : 'CARTE-5.3-ECOUTE-LARGE';
}

export interface CanalAffiche {
  canal: Canal53;
  libelle: string;
  valeur: number;
}

/**
 * Le tri des 5 canaux, du plus fort au plus discret — AFFICHAGE SEUL
 * (SIG-5.3-01 : le dominant et le secondaire s'affichent en libellés
 * conversationnels, mode d'emploi croisé à deux ; ils ne se calculent
 * jamais en entrée moteur — JAMAIS DANS LE SCORE).
 */
export function triCaniaux(score: Score53): CanalAffiche[] {
  const val = (c: Canal53): number =>
    typeof score[c] === 'number' ? score[c] : 0;
  return CANAUX_ORDRE.map((c) => ({
    canal: c,
    libelle: CANAUX_UI[c],
    valeur: val(c),
  })).sort((a, b) => b.valeur - a.valeur);
}

export interface Carte {
  id: VarianteId53;
  nom: string;
  lumiere: string;
  ombre: string;
  tension: string;
}

/** Les 6 variantes de carte — verbatim (cartes.yaml, ordre du YAML :
 *  portrait → lumiere, tension_interieure → tension). NEUTRALITÉ DES
 *  CANAUX : les cinq canaux se valent — le canal discret n'est jamais un
 *  déficit, il est l'adresse des demandes non formulées (C4 — aucun
 *  superlatif, aucun canal dressé en idéal). */
export const CARTES: Record<VarianteId53, Carte> = {
  "CARTE-5.3-MOTS-QUI-DISENT": {
    id: "CARTE-5.3-MOTS-QUI-DISENT",
    nom: "Le·La Mot qui porte",
    lumiere:
      "Les mots te remplissent — tu l'as répondu : un compliment sincère te porte, une phrase juste te rallume. En couple, tu répares vite par la parole, et tu relis les messages qui te font du bien.",
    ombre:
      "Quand les mots portent tout, un silence se lit comme une absence. Ton partenaire digère peut-être — toi, tu comptes les minutes.",
    tension: "demander le mot que tu attends, plutôt que de le mesurer dans le blanc.",
  },
  "CARTE-5.3-PRESENCE-PLEINE": {
    id: "CARTE-5.3-PRESENCE-PLEINE",
    nom: "Le·La Temps posé",
    lumiere:
      "Ce qui te remplit, c'est du temps à deux sans écran — tu l'as répondu. Une soirée posée, une marche, une table qui traîne : la présence entière te dit l'amour plus fort que les objets.",
    ombre:
      "La présence distraite compte à moitié pour toi — et une moitié nourrit mal. La solitude à deux arrive sans prévenir.",
    tension: "poser un créneau nommé, plutôt qu'un reproche diffus.",
  },
  "CARTE-5.3-GESTE-QUI-DIT": {
    id: "CARTE-5.3-GESTE-QUI-DIT",
    nom: "Le·La Geste qui dit",
    lumiere:
      "Chez toi, l'aide parle : tu l'as répondu, un service rendu te touche autant qu'un mot. La valise montée, le plein fait — tu lis l'amour dans ce qui se règle, et tu le rends de même.",
    ombre:
      "Donner pour être redevable installe une facture discrète. L'aide remplace parfois la présence — tu fais à la place d'un moment à deux.",
    tension: "dire ce qui t'aiderait, sans attendre l'échange exact.",
  },
  "CARTE-5.3-DETAIL-JUSTE": {
    id: "CARTE-5.3-DETAIL-JUSTE",
    nom: "Le·La Détail juste",
    lumiere:
      "Une attention choisie pour toi te marque — tu l'as répondu. L'objet pensé, pas acheté : la preuve que quelqu'un a écouté. Tu chasses le détail juste pour les autres, et tu le gardes pour toi.",
    ombre:
      "La preuve s'use quand elle se compte. Un anniversaire raté pèse plus lourd qu'une semaine entière de tendresse ordinaire.",
    tension: "nommer l'attention qui t'a marqué·e — la règle sort du tiroir.",
  },
  "CARTE-5.3-PEAU-QUI-PARLE": {
    id: "CARTE-5.3-PEAU-QUI-PARLE",
    nom: "Le·La Peau qui parle",
    lumiere:
      "Un câlin passe avant les mots — tu l'as répondu. Le contact dit vite ce qui prendrait une soirée : une main, une épaule, un au revoir complet. Ton corps résume, et tu te sens aimé·e.",
    ombre:
      "Quand le toucher est la seule langue, son absence sonne comme une alarme. Une pause de l'autre devient un message entier.",
    tension: "demander le contact par son nom — l'autre répond à une demande, pas à une alarme.",
  },
  "CARTE-5.3-ECOUTE-LARGE": {
    id: "CARTE-5.3-ECOUTE-LARGE",
    nom: "Le·La Écoute large",
    lumiere:
      "Tes canaux sont serrés : mots, temps, gestes, attentions, contact — rien ne domine nettement. Tu reçois l'affection sur plusieurs fréquences et tu en émets autant. Suivre le canal de l'autre te vient naturellement.",
    ombre:
      "Quand tout te remplit, rien ne crie. Ton besoin reste diffus — l'autre doit deviner quelle porte ouvrir, et vise parfois à côté.",
    tension: "classer tes trois dernières joies à deux — la tête de liste dit ton canal.",
  },
};

/** Textes du briefing — annonce VERBATIM (05-ecran-d-intro, 2 phrases),
 *  puces en couche app (ton Task 35). Premium change zéro chose au
 *  contenu ([6]) : zéro teaser, l'écran n'anticipe aucun autre contenu. */
export const BRIEFING = {
  annonce:
    "Tu exprimes ton affection par des canaux précis — certains à voix haute, d'autres en silence. Ici, tu les regardes, sans classement et sans juge.",
  aQuoiCaSert: [
    "C'est la quête de ton expression : ce qui te fait te sentir aimé, et ce que tu rends.",
    "Dix affirmations, cinq canaux : les mots, le temps, les gestes, les attentions, le contact.",
    "Aucun canal ne vaut plus qu'un autre : la barre décrit, elle ne classe pas.",
    "À la fin, une carte — et des mots à deux : un mode d'emploi croisé, pas un score.",
  ],
  resultats: [
    "Ta carte — ta lumière, ta zone d'ombre et ta tension du moment, en quelques mots.",
    "Cinq barres — tes cinq canaux d'affection, tels que tu les as décrits aujourd'hui.",
    "Ton canal qui parle le plus fort — et le discret, ta réserve de demandes non formulées.",
    "Des conversations à deux, si tu veux : ta carte se raconte, elle ne se compare pas.",
  ],
};

/** Textes de la fenêtre de complétion (carte) — entête, labels (moule 4.1)
 *  et fenêtre F1 verbatim (cartes.yaml : la formulation signature gravée
 *  au 03, exprimée en registre probabiliste — zéro absolu au texte
 *  affiché), miroirNote en couche app. */
export const COMPLETION = {
  entete: "💗 QUÊTE ACCOMPLIE — « Comment tu exprimes ton affection »",
  labelOmbre: "Ta zone d'ombre :",
  labelTension: "Ta tension intérieure :",
  fenetre:
    "Ton canal dominant dit ce qui te remplit — ton canal le plus discret garde tes demandes non formulées. À deux, ces deux lignes nourrissent des soirées entières.",
  miroirNote:
    "Ton miroir — la lecture complète de tes canaux — arrive à la prochaine étape du voyage.",
};
