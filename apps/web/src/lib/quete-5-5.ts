/**
 * Quête 5.5 « Quand la tension monte » — Monde 7 « Face aux Tempêtes » ·
 * 💎 PREMIUM · P1.5 (accès libre au sein du territoire premium).
 *
 * Contenu FIDÈLE au Livrable M7-5.5-Quand-La-Tension-Monte (10 fichiers,
 * V12 1ʳᵉ génération — B.3 : production neuve déclarée, aucun texte
 * antérieur) :
 *  - ITEMS : les 8 items Likert (verbatim 01-tableau-des-items, ordre du
 *    tableau) — 4 profils d'expression de la tension × 2 items, 4 paires R6
 *    complètes (01×02 · 03×04 · 05×06 · 07×08 — une par profil),
 *    équilibre 4 D / 4 I ; AUCUNE trame dans cette quête (zéro signal ▲,
 *    zéro position réservée — le DGR est un CROISEMENT, pas une trame :
 *    c2/c3 du mélange sans-objet) ;
 *  - PASSATION : l'ordre de passation GELÉ — mélange RÉEL graine 255427
 *    (graine-mère 210427 + 1000 × ordinal 45, décade des quêtes 5.x = 40),
 *    outil GÉNÉRIQUE melange.py, 1 tentative, 5 passes rejouées identiques
 *    octet pour octet (empreinte 29b4741031f823ab3f2a03402838f44e),
 *    contraintes 6/6 PASS (run max 2 — la seule paire de même orientation
 *    adjacente est en positions 4-5, composante douce documentée au c5) ;
 *  - CARTES : les 4 variantes verbatim (cartes.yaml, étage 1, charte
 *    C1-C11) — une par température dominante, partition exclusive +
 *    exhaustive (C6). DOCTRINE DES TEMPÉRATURES : les quatre façons dont la
 *    tension sort se valent — aucune variante n'est un idéal, aucune n'est
 *    un défaut ; l'ombre nomme un PRIX (pour soi ET pour l'autre), jamais
 *    une nature défaillante ;
 *  - choisirVariante : la sélection VERBATIM du 07-miroir §0 (SIG-5.5-01 —
 *    voir sous le sélecteur) ;
 *  - BRIEFING : l'annonce est VERBATIM (05-ecran-d-intro, 2 phrases), les
 *    puces sont la couche app rédigée (ton Task 35). PREMIUM [6] : zéro
 *    teaser, zéro présupposition des mondes gratuits ;
 *  - COMPLETION : entête du gabarit mission (cartes.yaml porte 💎 — écart
 *    d'emoji consigné), labels et fenêtre F1 verbatim (cartes.yaml),
 *    miroirNote en couche app.
 *
 * LA DOCTRINE DES TEMPÉRATURES (gelée — gravée au 00 et au 04, à ne pas
 * inverser) : AUCUNE hiérarchie entre profils — l'explosif n'est pas
 * « pire » que le fermé : ce sont des températures différentes. La tension
 * monte chez tout le monde — la question n'est pas si, c'est comment et à
 * quel prix (tension commune gelée, ouverture probabiliste). Zéro
 * pathologisation de l'explosif ; le silence est décrit comme une garde,
 * jamais un défaut absolu ; le profil sombre se dit « le corps qui suit »
 * (le jargon clinique du refonte reste hors de cette app — ni rendu, ni
 * commentaire). Le rendu parle en images (les mots qui montent, le mur, le
 * retour au calme, le corps qui suit), jamais en étiquette.
 *
 * NOMMAGE (verrou — vérifié machine à chaque livraison) : le rendu emploie
 * les libellés UI obligatoires du Livrable (tu exploses · tu te fermes · tu
 * verbalises à froid · tu sombres) et le nommage Wairyu des images. Les
 * concepts de référence (typologies d'expression de la colère, pattern de
 * poursuite-retrait — nom français CI-DESSUS seul lieu moteur ; le nom
 * anglais du pattern n'existe NULLE PART, même en commentaire) restent hors
 * du rendu — ce commentaire d'en-tête est leur unique consignation dans
 * cette app. Aucun nom d'auteur, aucune source, aucun sigle d'instrument.
 * Rappels ancrés aux énoncés D de CETTE quête uniquement (Q5.5-01 · 03 ·
 * 05 · 07 — citer un énoncé I au score haut serait une fausse citation).
 *
 * MOTEUR (côté score, jamais rendu) : quatre moyennes de profil (2 items
 * chacune, I recodés 6 − r, normalisées 0-1) qui routent l'AFFICHAGE —
 * carte (4 variantes) et miroir (« Ta température »). Elles alimentent EN
 * OUTRE, côté moteur seul, deux croisements : SIG-5.5-02 (EXPLOSIF × FERME
 * côté matching — le plus destructeur documenté : l'un répare par la
 * parole dans la montée, l'autre protège par le retrait, la boucle
 * s'alimente elle-même) et SIG-5.5-03 (composante EXPLOSIVE × impulsivité
 * du Monde 1, quêtes 1.4/3.4 — DGR composée, trame tissée en 1.4, 1.5,
 * 3.4 et 5.5) : [MOTEUR SEUL] — JAMAIS au rendu, jamais en UI, jamais au
 * match affiché, AUCUNE exclusion. Ils ne sont PAS calculés dans cette app
 * (aucun croisement inter-personnes ni inter-quêtes consommé ici) ; seuils
 * et poids « À VALIDER PAR LE COMITÉ » (provisoires concepteur).
 *
 * Typo : apostrophe ASCII uniquement, guillemets français. Registre
 * probabiliste (zéro « toujours/jamais », zéro futur certain) ; zéro
 * verdict, zéro correction de réaction ; phrases ≤ 22 mots (verbatim
 * livrable exempté).
 */

import { avecEN } from '../i18n/apply';
import * as EN_Q55 from '../i18n/content/en/quete-5-5';
import type { ItemPassation } from './quetes';

export interface QueteItem55 {
  code: string;
  text: string;
  /** 'D' = directe, 'I' = inversée (recodée 6 − r — Arbitrage 1). */
  orient: 'D' | 'I';
  /** Le profil verbatim du tableau 01 (dimension du 02 — clé sans accent,
   *  cohérente partout : explosif · ferme · verbalise · sombre). Au rendu :
   *  tu exploses · tu te fermes · tu verbalises à froid · tu sombres. */
  dim: 'explosif' | 'ferme' | 'verbalise' | 'sombre';
}

/** Les 8 items — verbatim (01-tableau-des-items, ordre du tableau).
 *  4 paires R6 complètes : 01×02 (explosif) · 03×04 (ferme) · 05×06
 *  (verbalise) · 07×08 (sombre) — 4 D / 4 I, recodage 6 − r concordant. */
const ITEMS_FR: readonly QueteItem55[] = [
  {
    code: "Q5.5-01",
    text: "Quand la tension monte, les mots sortent plus fort que moi.",
    orient: "D",
    dim: "explosif",
  },
  {
    code: "Q5.5-02",
    text: "Quand la tension monte, je garde le volume de ma voix.",
    orient: "I",
    dim: "explosif",
  },
  {
    code: "Q5.5-03",
    text: "Quand la tension monte, je lève un mur et je me tais.",
    orient: "D",
    dim: "ferme",
  },
  {
    code: "Q5.5-04",
    text: "Quand la tension monte, je garde la porte de la discussion ouverte.",
    orient: "I",
    dim: "ferme",
  },
  {
    code: "Q5.5-05",
    text: "Une fois le calme revenu, je reviens sur ce qui a blessé.",
    orient: "D",
    dim: "verbalise",
  },
  {
    code: "Q5.5-06",
    text: "Quand un sujet fait mal, je préfère qu'il reste clos.",
    orient: "I",
    dim: "verbalise",
  },
  {
    code: "Q5.5-07",
    text: "Quand la tension monte, je me replie et le corps suit.",
    orient: "D",
    dim: "sombre",
  },
  {
    code: "Q5.5-08",
    text: "Quand la tension monte, elle traverse et repart sans s'installer.",
    orient: "I",
    dim: "sombre",
  },
];
export const ITEMS = avecEN(ITEMS_FR, EN_Q55.ITEMS);

/** Ordre de passation GELÉ — mélange RÉEL graine 255427 (02-plan-de-melange,
 *  course de contrôle sonde, FAIT FOI : le mélange ne dépend que des codes,
 *  orientations, dimensions et de la graine — finding de fidélité V11/V12).
 *  Le 1ᵉʳ item vu est Q5.5-01 (le volume qui monte), le dernier Q5.5-05 (le
 *  second tour) — JAMAIS l'ordre des codes. Positions par profil (réel) :
 *  explosif {1, 4} · ferme {2, 6} · verbalise {5, 8} · sombre {3, 7}.
 *  c1 PASS (0 adjacence) · c2/c3 sans-objet (0 trame — le DGR est un
 *  CROISEMENT) · c4 PASS (0 déficit : 1↔4 · 2↔6 · 5↔8 · 3↔7) · c5 PASS
 *  (run max 2, positions 4-5) · c6 PASS (séquence ≠ ordre des codes). */
export const PASSATION: readonly string[] = [
  "Q5.5-01",
  "Q5.5-04",
  "Q5.5-07",
  "Q5.5-02",
  "Q5.5-06",
  "Q5.5-03",
  "Q5.5-08",
  "Q5.5-05",
];

const PAR_CODE = new Map(ITEMS.map((i) => [i.code, i]));

/** Le deck réel : les 8 items dans l'ordre gelé — aucune trame hébergée
 *  (5.5 est une quête 100 % carte : rien à sauter, rien à masquer). */
export function deckQuete(): ItemPassation[] {
  return PASSATION.flatMap((c) => {
    const it = PAR_CODE.get(c);
    return it ? [{ code: it.code, text: it.text, format: 'likert' as const }] : [];
  });
}

/** Likert 1-5 → 0-1 (inversées recodées 6 − r — Arbitrage 1). */
function contribution(reponse: number, orient: 'D' | 'I'): number {
  return ((orient === 'D' ? reponse : 6 - reponse) - 1) / 4;
}

export interface Score55 {
  /** La température qui parle — moyenne des 2 items du profil (EXPLOSIF
   *  côté moteur), normalisée 0-1 (haut = les mots qui montent). */
  explosif: number;
  /** La température qui garde — moyenne des 2 items du profil (FERME côté
   *  moteur), normalisée 0-1 (haut = le mur qui se pose). */
  ferme: number;
  /** La température du second tour — moyenne des 2 items du profil
   *  (VERBALISE côté moteur), normalisée 0-1 (haut = le retour au calme). */
  verbalise: number;
  /** La température qui descend — moyenne des 2 items du profil (SOMBRE
   *  côté moteur), normalisée 0-1 (haut = le corps qui suit). */
  sombre: number;
  /** Signature d'index (contrat du registre : Record<string, number>) —
   *  aucun score supplémentaire n'y entre. */
  [dim: string]: number;
}

/**
 * Scorer du Livrable : quatre moyennes de profil (moyennes des contributions
 * recodées, 2 items par profil), normalisées 0-1. Elles alimentent la
 * sélection SIG-5.5-01 (choisirVariante) et la carte (canal carte).
 *
 * DUAL FACE — la face VISIBLE est « Ta température » (carte + miroir,
 * conversationnel) ; la face MOTEUR porte deux croisements qui ne
 * franchissent JAMAIS le rendu, l'UI ou le match affiché : SIG-5.5-02
 * (EXPLOSIF × FERME côté matching — accompagnement du cycle, écrit au
 * ledger, jamais une exclusion) et SIG-5.5-03 (EXPLOSIF × impulsivité du
 * Monde 1 — DGR composée, vigilance interne du ledger). AUCUN des deux
 * n'est calculé dans cette app : aucun score d'autrui ni du Monde 1 n'est
 * consommé ici (seuils et poids « À VALIDER PAR LE COMITÉ »). Le rendu ne
 * connaît ni l'autre personne ni les autres quêtes — la prudence y vit
 * sous forme de tension commune seulement.
 */
export function scorer(reponses: Record<string, number>): Score55 {
  const parProfil = new Map<string, { total: number; n: number }>();
  for (const code of PASSATION) {
    const it = PAR_CODE.get(code);
    const r = it ? reponses[it.code] : undefined;
    if (it && typeof r === 'number' && r >= 1 && r <= 5) {
      const c = contribution(r, it.orient);
      const bloc = parProfil.get(it.dim) ?? { total: 0, n: 0 };
      bloc.total += c;
      bloc.n += 1;
      parProfil.set(it.dim, bloc);
    }
  }
  const profil = (dim: string): number => {
    const bloc = parProfil.get(dim);
    return bloc && bloc.n > 0 ? bloc.total / bloc.n : 0;
  };
  return {
    explosif: profil('explosif'),
    ferme: profil('ferme'),
    verbalise: profil('verbalise'),
    sombre: profil('sombre'),
  };
}

/** Les 4 variantes — ids VERBATIM (cartes.yaml, ordre du sélecteur 1 → 4) :
 *  une par température dominante — partition exclusive + exhaustive (C6). */
export type VarianteId55 =
  | 'CARTE-5.5-MOTS-VIFS'
  | 'CARTE-5.5-MUR'
  | 'CARTE-5.5-LE-RETOUR'
  | 'CARTE-5.5-LE-CORPS';

/** Clé de température — sans accent, cohérente partout (items, score). */
export type CleTemp55 = 'explosif' | 'ferme' | 'verbalise' | 'sombre';

/** Le routage température → variante (cartes.yaml : un profil par
 *  température dominante). */
const VARIANTE_PAR_TEMP: Record<CleTemp55, VarianteId55> = {
  explosif: 'CARTE-5.5-MOTS-VIFS',
  ferme: 'CARTE-5.5-MUR',
  verbalise: 'CARTE-5.5-LE-RETOUR',
  sombre: 'CARTE-5.5-LE-CORPS',
};

/** La 1ʳᵉ position de passation de chaque température — dérivée du
 *  PASSATION gelé (explosif {1, 4} → 1 · ferme {2, 6} → 2 · sombre
 *  {3, 7} → 3 · verbalise {5, 8} → 5) : c'est le critère de départage
 *  verbatim (07 §0 / cartes.yaml — « ex æquo strict → départage à la 1ʳᵉ
 *  position de passation, conventions SIG-5.2-01 », proposition À VALIDER
 *  PAR LE COMITÉ). */
const PREMIERE_POSITION: Record<CleTemp55, number> = (() => {
  const pos: Record<CleTemp55, number> = {
    explosif: Number.POSITIVE_INFINITY,
    ferme: Number.POSITIVE_INFINITY,
    verbalise: Number.POSITIVE_INFINITY,
    sombre: Number.POSITIVE_INFINITY,
  };
  PASSATION.forEach((code, index) => {
    const it = PAR_CODE.get(code);
    if (it && index + 1 < pos[it.dim]) pos[it.dim] = index + 1;
  });
  return pos;
})();

/**
 * Sélecteur VERBATIM (07-miroir §0 + cartes.yaml — SIG-5.5-01, partition
 * exclusive + exhaustive, C6 ; ordre du sélecteur 1 → 4) : la température
 * dominante = max des 4 moyennes → la carte de ce profil — 4 sorties.
 * Départage en ex æquo strict : la température dont un item occupe la 1ʳᵉ
 * position de passation l'emporte (explosif 1ʳᵉ · ferme 2ᵉ · sombre 3ᵉ ·
 * verbalise 5ᵉ — plan 02 ; conventions SIG-5.2-01, proposition À VALIDER
 * PAR LE COMITÉ). Le secondaire (2ᵉ température) nuance en conversation,
 * il ne produit jamais un deuxième portrait. Le rendu est
 * conversationnel — jamais un verdict, jamais une correction de réaction.
 * Les croisements SIG-5.5-02 / SIG-5.5-03 ne participent JAMAIS à la
 * sélection ni au rendu (MOTEUR SEUL — verrou 04 n° 6). Aucun seuil :
 * SIG-5.5-01 n'en définit aucun au rendu.
 */
export function choisirVariante(score: Score55): VarianteId55 {
  const valeur = (dim: CleTemp55): number =>
    typeof score[dim] === 'number' ? (score[dim] as number) : 0;
  const temps = (Object.keys(VARIANTE_PAR_TEMP) as CleTemp55[]).filter(
    (t) => PREMIERE_POSITION[t] !== Number.POSITIVE_INFINITY,
  );
  let gagnant = temps[0];
  for (const t of temps) {
    const mieux =
      valeur(t) > valeur(gagnant) ||
      (valeur(t) === valeur(gagnant) &&
        PREMIERE_POSITION[t] < PREMIERE_POSITION[gagnant]);
    if (mieux) gagnant = t;
  }
  return VARIANTE_PAR_TEMP[gagnant];
}

export interface Carte {
  id: VarianteId55;
  nom: string;
  lumiere: string;
  ombre: string;
  tension: string;
}

/** Les 4 variantes de carte — verbatim (cartes.yaml, ordre du sélecteur ;
 *  portrait → lumiere, ombre → ombre, tension_interieure → tension).
 *  DOCTRINE DES TEMPÉRATURES : les quatre façons dont la tension sort se
 *  valent — aucune variante n'est un idéal, aucune n'est un défaut (C4) ;
 *  la tension commune (gelée) ouvre chaque tension, au registre
 *  probabiliste, sans absolu. DUAL FACE : la carte est partageable — le
 *  partage ne présuppose rien d'acheté ([6]). */
export const CARTES: Record<VarianteId55, Carte> = {
  "CARTE-5.5-MOTS-VIFS": {
    id: "CARTE-5.5-MOTS-VIFS",
    nom: "La tension qui parle fort",
    lumiere:
      "Quand la tension monte, les mots sortent plus fort que toi — tu l'as répondu. Ça sort, ça se voit : on sait où tu en es, et rien ne pourrit dessous.",
    ombre:
      "Les mots vifs coûtent deux fois — au départ, puis en réparations. L'autre retient le volume plus longtemps que le fond.",
    tension: "la tension monte chez tout le monde — la tienne parle fort ; la question est le prix des mots.",
  },
  "CARTE-5.5-MUR": {
    id: "CARTE-5.5-MUR",
    nom: "La tension qui se mure",
    lumiere:
      "Quand la tension monte, tu lèves un mur et tu te tais — tu l'as répondu. Ton silence protège la discussion de l'incendie : tu ne parles pas avant d'avoir retrouvé ta main.",
    ombre:
      "Le silence laisse l'autre deviner — et la devinette conduit plus loin que le différend : une pause se lit comme une fin.",
    tension: "la tension monte chez tout le monde — la tienne se mure ; la question est ce que le mur coûte à deux.",
  },
  "CARTE-5.5-LE-RETOUR": {
    id: "CARTE-5.5-LE-RETOUR",
    nom: "La tension qui attend son heure",
    lumiere:
      "Une fois le calme revenu, tu reviens sur ce qui a blessé — tu l'as répondu. Tu parles quand le calme permet d'entendre : les mots arrivent entiers, sans le volume de la montée.",
    ombre:
      "Entre la montée et le retour, la blessure s'installe — l'autre traverse la scène sans savoir qu'elle reviendra en mots.",
    tension: "la tension monte chez tout le monde — la tienne attend son heure ; la question est le temps qu'elle installe d'ici là.",
  },
  "CARTE-5.5-LE-CORPS": {
    id: "CARTE-5.5-LE-CORPS",
    nom: "La tension qui descend",
    lumiere:
      "Quand la tension monte, tu te replie et le corps suit — tu l'as répondu. La peine prend la place des mots : tu la portes sans la dire, et ça se lit.",
    ombre:
      "Ce qui ne se dit pas se paie deux fois — dedans, puis entre vous : une peine qu'on ne peut pas consoler.",
    tension: "la tension monte chez tout le monde — la tienne descend ; la question est le langage qu'on lui donne.",
  },
};

/** Textes du briefing — annonce VERBATIM (05-ecran-d-intro, 2 phrases),
 *  puces en couche app (ton Task 35, doctrine des températures). PREMIUM
 *  [6] : zéro teaser, zéro présupposition des mondes gratuits — les
 *  rappels s'ancrent aux réponses de CETTE quête, aux énoncés D
 *  uniquement. */
export const BRIEFING = {
  annonce:
    "La tension monte chez tout le monde — ici, tu regardes comment elle monte chez toi. Il n'y a pas de bonne température : il y a la tienne, et ce qu'elle coûte quand ça chauffe.",
  aQuoiCaSert: [
    "C'est la quête de ta température : quatre chemins pour la montée, posés à égalité — aucun n'est « le bon ».",
    "Huit affirmations, quatre lectures : tu exploses, tu te fermes, tu verbalises à froid, tu sombres.",
    "Ici, rien n'est jugé : une température décrit un chemin, elle n'en vaut pas une autre.",
    "À la fin, une carte à partager si tu veux : ta façon de traverser la montée, en quelques mots.",
  ],
  resultats: [
    "Ta carte — ta température racontée en quelques mots : elle se partage, ou se garde.",
    "Quatre barres — une par façon dont la tension sort, telles que tu les as décrites.",
    "Ton miroir à l'étape suivante — la lecture complète de ta température, sans classement.",
    "Une pierre de plus dans ton portrait — la suite du voyage s'en nourrit.",
  ],
};

/** Textes de la fenêtre de complétion (carte) — entête du gabarit mission
 *  (cartes.yaml porte 💎 — écart d'emoji consigné, précédent 5.4), labels
 *  et fenêtre F1 verbatim (cartes.yaml — le préfixe de slot « F1 : » reste
 *  au Livrable, précédents 4.1/4.2/5.x), miroirNote en couche app. */
export const COMPLETION = {
  entete: "🧭 QUÊTE ACCOMPLIE — « Quand la tension monte »",
  labelOmbre: "Ta zone d'ombre :",
  labelTension: "Ta tension intérieure :",
  fenetre:
    "Ta température dit comment la tension sort de toi — pas à quel point tu la gères.",
  miroirNote:
    "Ton miroir — la lecture complète de ta température — arrive à la prochaine étape du voyage.",
};
