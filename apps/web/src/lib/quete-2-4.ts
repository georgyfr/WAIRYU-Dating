/**
 * Quête 2.4 « Tes réalités » — Monde 3 « La Boussole » — FORMAT UN-CLIC (NON-Likert).
 *
 * Contenu FIDÈLE au Livrable M3-2.4-Tes-Realites (branche archive/v1-2026-10-05) :
 *  - ITEMS : les 8 auto-déclarations FACTUELLES verbatim (01-tableau-des-items, ordre du
 *    tableau, codes gelés Q2.4-01 → Q2.4-08) — énoncés ≤ 8 mots, cadre « Ma réalité : … »,
 *    options VERBATIM du source, y compris les « (e) » de Q2.4-04 et les « Jamais » prescrits
 *    par le source (dérogation documentée : étiquettes de fréquence déclaratives, pas des
 *    affirmations rédigées — 01-tableau « Dérogation documentée ») ;
 *  - PASSATION : l'ordre de passation GELÉ (mélange graine 24427, 02-plan-de-melange —
 *    Fisher-Yates seedé, re-tirage non nécessaire, rejeu diff nul ; c1-c5 sans-objet
 *    documentés — quête non-Likert, c6 vérifiée : le 1ᵉʳ item vu n'est pas Q2.4-01) ;
 *  - scorer : AUCUNE dimension psychométrique, AUCUN signal (dimension = null, signal = null
 *    au Livrable). Le score de sélection = la COMPLÉTUDE DÉCLARATIVE : { repondues } = nombre
 *    de déclarations posées (0 à 8). Les réalités ne se moyennent pas, ne se notent pas
 *    (06-fiche-computation : computation.carte: null — « une réalité ne se moyenne pas,
 *    ne se note pas — elle se croise ») ;
 *  - choisirVariante : les 2 plages TRANCHÉES par le fondateur (cartes.yaml v2, mission
 *    VAGUE 5 — la v1 « fréquence de déclenchement de filtres chez les autres » est remplacée),
 *    évaluées dans l'ordre_selecteur 1 → 2 : les 8 déclarées → CARTE-2.4-A (Le·La Franc·e-jeu)
 *    · au moins une manquante (≤ 7) → CARTE-2.4-B (L'Énigmatique). Partition totale 8 · ≤ 7
 *    (C6, vérifiée machine au YAML). La sélection se base sur les réponses elles-mêmes :
 *    AUCUNE option « Je préfère ne pas répondre » n'existe au tableau (vérifié) — une case
 *    non touchée reste simplement non déclarée, c'est elle qui porte la carte B ;
 *  - CARTES : les 2 cartes de clarté verbatim (cartes.yaml v2 — portrait → lumiere, ombre,
 *    tension_interieure → tension ; 40-70 mots, exception documentée) ;
 *  - COMPLETION : entete_ecran, labels et fenêtre rotative F1 verbatim (cartes.yaml).
 *
 * CODAGE DES RÉPONSES (couche app, jamais rendu) : la valeur stockée pour un item =
 * l'INDEX de l'option choisie + 1 (1-based ; convention 1.7-02 / 2.8-01 — l'ordre du
 * tableau `options` fait foi). Un seul toucher par item : l'utilisateur clique une option,
 * la réponse est enregistrée — l'orchestrateur gère le rendu un-à-un. Valeur absente ou
 * hors bornes = déclaration non posée (jamais une inférence).
 *
 * DOCTRINE (00-README — ÉCRAN DE CONFORMITÉ) :
 *  - les réalités sont FACTUELLES et JAMAIS jugées — aucune hiérarchie des vies, aucune
 *    option « idéale », aucun vocabulaire du défaut (ni fumeur, ni nomade, ni « zéro sport ») ;
 *  - SIG-2.4-01 « Le croisement qui élimine » (réalités × lignes rouges Q2.3 de tous,
 *    BIDIRECTIONNEL — « la plus haute valeur du système entier », l.598) : MOTEUR SEUL,
 *    sans trace rendue chez l'un ni chez l'autre — aucun texte de ce module ne documente
 *    l'action du filtre en cours (seul le mécanisme général, S3, est descriptible) ;
 *  - SIG-2.4-02 / SIG-2.4-03 (incohérences déclarées/mesurées · tension nomade × tempo)
 *    alimentent QFI : MOTEUR SEUL, jamais affiché, jamais dit, jamais au match ;
 *  - « J'ai arrêté » (Q2.4-01, décision comité FM-019) : NON-FUMEUR au filtre, « ex-fumeur »
 *    à l'affichage (chip) — la distinction filtre/affichage se joue côté app/moteur. Le rendu
 *    de chip de profil n'existe pas encore : la règle est posée ici en commentaire pour
 *    l'intégration future (le moteur filtre sur l'état, l'UI montre le parcours) ;
 *  - visibilité chips (FM-019) : items neutres visibles par défaut, choix privé par item pour
 *    les sensibles (proposition : 03 enfants · 04 spiritualité), matching actif même sur les
 *    privés — la privacité retire l'affichage, jamais la protection.
 *
 * Typo : apostrophe ASCII uniquement, pas d'insécable, guillemets français.
 * Règles : aucun code, score, sigle ou seuil ne franchit le rendu ; phrases ≤ 22 mots
 * dans les textes rédigés (l'annonce VERBATIM fait foi).
 */

/** Une auto-déclaration un-clic — l'énoncé + les options (verbatim, ordre du tableau). */
export interface QueteItem24 {
  code: string;
  text: string;
  options: readonly string[];
}

/** Les 8 déclarations — VERBATIM (01-tableau-des-items, ordre du tableau 01 → 08). */
export const ITEMS: readonly QueteItem24[] = [
  {
    code: "Q2.4-01",
    text: "Ma réalité : le tabac.",
    // FM-019 : « J'ai arrêté » = non-fumeur au filtre, « ex-fumeur » à l'affichage (chip).
    options: ["Je fume", "J'ai arrêté", "Non"],
  },
  {
    code: "Q2.4-02",
    text: "Ma réalité : l'alcool.",
    // « Jamais » : étiquette de fréquence prescrite verbatim par le source (l.571) —
    // déclarative, dérogation documentée au 01-tableau.
    options: ["Jamais", "Occasionnel", "Régulièrement"],
  },
  {
    code: "Q2.4-03",
    text: "Ma réalité : les enfants.",
    options: ["J'en ai", "J'en veux", "Pas maintenant", "Jamais"],
  },
  {
    code: "Q2.4-04",
    text: "Ma réalité : la spiritualité.",
    // Les « (e) » sont dans le source : conservés tels quels.
    options: ["Pratiquant(e)", "Culturelle", "Aucune"],
  },
  {
    code: "Q2.4-05",
    text: "Ma réalité : mon assiette.",
    options: ["Végétarien ou végétalien", "Carné", "Flexitarien"],
  },
  {
    code: "Q2.4-06",
    text: "Ma réalité : le sport.",
    options: ["Intensif", "Régulier", "Zéro"],
  },
  {
    // Item de complément (domaine réservé [9]) — À VALIDER PAR LE COMITÉ (inchangé).
    code: "Q2.4-07",
    text: "Ma réalité : où je vis.",
    options: ["Je vis ici", "Je déménage bientôt", "Je suis nomade"],
  },
  {
    // Item de complément (domaine réservé [9]) — À VALIDER PAR LE COMITÉ (inchangé).
    code: "Q2.4-08",
    text: "Ma réalité : mon tempo.",
    options: ["Je cherche à rencontrer rapidement", "Je préfère prendre mon temps"],
  },
];

/**
 * Ordre de passation GELÉ — plan de mélange graine 24427 (02-plan-de-melange, 8 positions ;
 * aucune trame dans la quête, c1-c5 sans-objet documentés, c6 vérifiée). Le tabac (sujet le
 * plus sensible) n'est ni le premier item vu ni le dernier.
 */
export const PASSATION: readonly string[] = [
  "Q2.4-02",
  "Q2.4-07",
  "Q2.4-05",
  "Q2.4-08",
  "Q2.4-01",
  "Q2.4-06",
  "Q2.4-04",
  "Q2.4-03",
];

const PAR_CODE = new Map(ITEMS.map((i) => [i.code, i]));

/** Le deck réel : les 8 déclarations dans l'ordre gelé — un énoncé, ses options ;
 *  l'orchestrateur gère le rendu un-à-un (un seul toucher par item). */
export function deckQuete(): { code: string; text: string; options: readonly string[] }[] {
  return PASSATION.flatMap((c) => {
    const it = PAR_CODE.get(c);
    return it ? [{ code: it.code, text: it.text, options: it.options }] : [];
  });
}

/** Le score de la quête : la COMPLÉTUDE DÉCLARATIVE — AUCUNE dimension psychométrique,
 *  AUCUN signal (dimension = null, signal = null au Livrable). L'index signature expose
 *  l'index d'option choisi sous chaque code (0 = non posée — signature standard
 *  Record<string, number>). */
export interface Score24 {
  /** Nombre de déclarations posées (0 à 8) — une option choisie = déclarée. */
  repondues: number;
  [k: string]: number;
}

/** Scorer un-clic : repondues = nombre de codes de la passation dont la valeur est un
 *  index d'option valide (1 … options.length). Valeur absente, 0 ou hors bornes = non
 *  posée. Les réponses brutes restent exposées sous chaque code (cf. Score24). */
export function scorer(reponses: Record<string, number>): Score24 {
  const score: Score24 = { repondues: 0 };
  for (const code of PASSATION) {
    const it = PAR_CODE.get(code);
    const v = reponses[code];
    const brut = typeof v === 'number' && Number.isFinite(v) ? v : 0;
    score[code] = brut;
    if (it && brut >= 1 && brut <= it.options.length) score.repondues += 1;
  }
  return score;
}

/** Les 2 ids de variantes — VERBATIM (cartes.yaml v2, champ id). */
export type VarianteId24 = 'CARTE-2.4-A' | 'CARTE-2.4-B';

/**
 * Sélection VERBATIM (cartes.yaml v2 — logique tranchée par le fondateur, mission VAGUE 5 ;
 * la v1 « fréquence de déclenchement de filtres chez les AUTRES » est remplacée), évaluée
 * dans l'ordre_selecteur 1 → 2 :
 *  1. les 8 réalités Q2.4-01 → Q2.4-08 déclarées (une option choisie sur chacune) → CARTE-2.4-A ;
 *  2. au moins une réalité non déclarée (7 ou moins sur les 8) → CARTE-2.4-B.
 * Partition totale 8 · ≤ 7 — chaque profil tombe dans exactement une variante (C6, YAML).
 * La complétude est INDÉPENDANTE de la visibilité (FM-019) : une réalité privée reste
 * déclarée — la privacité retire l'affichage, jamais la complétude. Conditions restent
 * côté moteur, jamais rendues.
 */
export function choisirVariante(score: Score24): VarianteId24 {
  const n = typeof score.repondues === 'number' ? score.repondues : 0;
  return n >= 8 ? 'CARTE-2.4-A' : 'CARTE-2.4-B';
}

export interface Carte {
  id: VarianteId24;
  nom: string;
  lumiere: string;
  ombre: string;
  tension: string;
}

/** Les 2 cartes de clarté — VERBATIM (cartes.yaml v2, ordre du YAML ; portrait → lumiere,
 *  ombre, tension_interieure → tension). Charte VAGUE 5 : 40-70 mots (exception documentée).
 *  Doctrine : l'ombre nomme des coûts de mécanisme (filtrage, invention par l'autre),
 *  jamais des défauts — aucune réalité n'est jugée. */
export const CARTES: Record<VarianteId24, Carte> = {
  'CARTE-2.4-A': {
    id: 'CARTE-2.4-A',
    nom: "Le·La Franc·e-jeu",
    lumiere:
      "Tu déclares ta vie telle qu'elle est : le tabac, l'alcool, les enfants, le tempo — tout est sur la table. Ceux qui te lisent savent à qui ils écrivent.",
    ombre:
      "Tes faits protègent le temps des deux — et ils filtrent aussi sans toi : certains s'écartent avant le premier mot, sans te le dire.",
    tension: "être lisible, sans devenir transparent(e).",
  },
  'CARTE-2.4-B': {
    id: 'CARTE-2.4-B',
    nom: "L'Énigmatique",
    lumiere:
      "Tu remplis ce qui va de soi et tu gardes le reste pour plus tard : ton profil dit l'essentiel, pas tout. L'indéfini, chez toi, est un choix.",
    ombre:
      "Ce que tu ne dis pas, l'autre l'invente — rarement en ta faveur : le vide se remplit avec les peurs du lecteur.",
    tension: "garder du mystère, sans semer le doute.",
  },
};

/** Textes du briefing — annonce VERBATIM (05-ecran-d-intro, 2 phrases : 15 + 13 mots),
 *  puces en couche app (ton Task 35). */
export const BRIEFING = {
  annonce:
    "Ici, aucune réponse n'est la bonne : ta vie se déclare, elle ne se note pas. Fumeur, parent, nomade, zéro sport : chaque réalité a sa place, aucune n'est jugée.",
  aQuoiCaSert: [
    "C'est la quête de la boussole — ce que tu es, déclaré tel quel, croisé avec les lignes rouges de tous.",
    "Huit déclarations factuelles, une seule touche chacune : tabac, alcool, enfants, spiritualité, assiette, sport, où tu vis, ton tempo.",
    "Pas de bonne réponse — fumeur, parent, nomade, zéro sport : des faits, pas des défauts.",
    "Il en sort une carte, et une pierre de plus dans ton portrait.",
  ],
  resultats: [
    "Ta carte — ta lumière et ta zone d'ombre, en quelques mots.",
    "Ton profil de vie — combien de réalités tu as posées, en une seule barre.",
    "Les pierres de ton portrait — ce que tu découvres ici alimente toute la suite du voyage.",
  ],
};

/** Textes de la fenêtre de complétion (carte) — entête, labels et fenêtre VERBATIM
 *  (cartes.yaml : entete_ecran, label_ombre, label_tension, fenêtre rotative F1). */
export const COMPLETION = {
  entete: "🧭 QUÊTE ACCOMPLIE — « Tes réalités »",
  labelOmbre: "Ta zone d'ombre :",
  labelTension: "Ta tension intérieure :",
  fenetre:
    "Quelque part, quelqu'un répond à ces mêmes questions. Le jour où vos cartes se croiseront, elles auront beaucoup à se dire.",
  miroirNote:
    "Ton miroir — la lecture complète de tes réalités — arrive à la prochaine étape du voyage.",
};
