/**
 * Quête 1.1 « Ta personnalité » — Monde 1 « Le Miroir ».
 *
 * Contenu FIDÈLE au Livrable M1-1.1-Ta-Personnalite (branche archive/v1-2026-10-05) :
 *  - ITEMS : les 50 items carte (verbatim 01-tableau-des-items, ordre du tableau) ;
 *  - PASSATION : l'ordre de passation GELÉ (mélange graine 211427, 02-plan-de-melange) ;
 *  - les 8 codes Q1.1-T… sont des trames de fiabilité (règle 11-b : AUCUN contenu au
 *    dépôt, le deck les saute — aucune formulation n'apparaît jamais à l'écran) ;
 *  - CARTES : les 7 variantes verbatim (cartes.yaml) ;
 *  - choisirVariante : les sélecteurs verbatim (FM-019), évalués dans l'ordre 1 → 7 ;
 *  - BRIEFING / COMPLETION : textes verbatim (05-ecran-d-intro).
 *
 * RECONSTITUTION (5ᵉ reset sandbox) : données extraites programmatiquement du bundle
 * staging index-BvGGhSXl.js (Task 27) — bundle audit octet par octet contre le Livrable.
 */

export interface QueteItem {
  code: string;
  text: string;
  /** 'D' = directe, 'I' = inversée (recodée 6 − r). */
  orient: 'D' | 'I';
  dim: 'O' | 'C' | 'E' | 'A' | 'S';
}

export interface LikertNiveau {
  value: 1 | 2 | 3 | 4 | 5;
  label: string;
}

/** Échelle de réponse — verbatim Livrable (05-ecran-d-intro). */
export const LIKERT: readonly LikertNiveau[] = [
  {
    value: 1,
    label: "Pas du tout moi",
  },
  {
    value: 2,
    label: "Pas vraiment moi",
  },
  {
    value: 3,
    label: "Neutre",
  },
  {
    value: 4,
    label: "Plutôt moi",
  },
  {
    value: 5,
    label: "Tout à fait moi",
  },
];

/** Les 50 items carte — verbatim (01-tableau-des-items, ordre du tableau). */
export const ITEMS: readonly QueteItem[] = [
  {
    code: "Q1.1-01",
    text: "J'aime les conversations qui partent dans des idées inattendues.",
    orient: "D",
    dim: "O",
  },
  {
    code: "Q1.1-02",
    text: "Une nouvelle cuisine, un nouveau pays, une nouvelle méthode : je dis oui avant de me poser de questions.",
    orient: "D",
    dim: "O",
  },
  {
    code: "Q1.1-03",
    text: "Je préfère les gens qui pensent comme moi — ça évite les débats.",
    orient: "I",
    dim: "O",
  },
  {
    code: "Q1.1-04",
    text: "L'art, la musique ou les livres changent parfois ma façon de voir les choses.",
    orient: "D",
    dim: "O",
  },
  {
    code: "Q1.1-05",
    text: "Je m'ennuie vite dans les routines trop calées.",
    orient: "D",
    dim: "O",
  },
  {
    code: "Q1.1-06",
    text: "Les idées abstraites m'agacent : je préfère ce qui est concret et utile.",
    orient: "I",
    dim: "O",
  },
  {
    code: "Q1.1-07",
    text: "J'aime imaginer des versions alternatives de ma vie.",
    orient: "D",
    dim: "O",
  },
  {
    code: "Q1.1-08",
    text: "Revoir un film que j'ai aimé me plaît plus que découvrir quelque chose de nouveau.",
    orient: "I",
    dim: "O",
  },
  {
    code: "Q1.1-09",
    text: "Je m'intéresse à des sujets que personne autour de moi ne connaît.",
    orient: "D",
    dim: "O",
  },
  {
    code: "Q1.1-10",
    text: "Une idée un peu folle vaut la peine qu'on s'y arrête.",
    orient: "D",
    dim: "O",
  },
  {
    code: "Q1.1-11",
    text: "Ce que je promets, je le tiens — même les petites promesses.",
    orient: "D",
    dim: "C",
  },
  {
    code: "Q1.1-12",
    text: "Il m'arrive souvent de laisser traîner jusqu'à la dernière minute.",
    orient: "I",
    dim: "C",
  },
  {
    code: "Q1.1-13",
    text: "Mes affaires ont leur place, et j'aime ça.",
    orient: "D",
    dim: "C",
  },
  {
    code: "Q1.1-14",
    text: "J'oublie régulièrement des choses que j'avais prévues.",
    orient: "I",
    dim: "C",
  },
  {
    code: "Q1.1-15",
    text: "Avant de m'engager, je vérifie que j'ai le temps de le faire bien.",
    orient: "D",
    dim: "C",
  },
  {
    code: "Q1.1-16",
    text: "Mon espace — sac, chambre, bureau — dit le contraire de mon organisation.",
    orient: "I",
    dim: "C",
  },
  {
    code: "Q1.1-17",
    text: "Je termine ce que je commence, même quand l'envie est passée.",
    orient: "D",
    dim: "C",
  },
  {
    code: "Q1.1-18",
    text: "Les détails administratifs m'échappent systématiquement.",
    orient: "I",
    dim: "C",
  },
  {
    code: "Q1.1-19",
    text: "Je prépare mes journées, au moins vaguement.",
    orient: "D",
    dim: "C",
  },
  {
    code: "Q1.1-20",
    text: "Je fonctionne mieux dans le désordre assumé.",
    orient: "I",
    dim: "C",
  },
  {
    code: "Q1.1-21",
    text: "Après une journée entouré(e) de gens, je me sens rechargé(e).",
    orient: "D",
    dim: "E",
  },
  {
    code: "Q1.1-22",
    text: "Une soirée en tête-à-tête vaut mieux qu'une grande table.",
    orient: "I",
    dim: "E",
  },
  {
    code: "Q1.1-23",
    text: "Je lance facilement la conversation avec des inconnus.",
    orient: "D",
    dim: "E",
  },
  {
    code: "Q1.1-24",
    text: "Les événements où je ne connais personne me donnent envie de partir tôt.",
    orient: "I",
    dim: "E",
  },
  {
    code: "Q1.1-25",
    text: "Dans un groupe, je prends la parole sans forcer.",
    orient: "D",
    dim: "E",
  },
  {
    code: "Q1.1-26",
    text: "J'ai besoin de longues plages de silence pour me retrouver.",
    orient: "I",
    dim: "E",
  },
  {
    code: "Q1.1-27",
    text: "L'ennui me vient quand il ne se passe rien autour de moi.",
    orient: "D",
    dim: "E",
  },
  {
    code: "Q1.1-28",
    text: "Je préfère observer que participer quand l'énergie du groupe monte.",
    orient: "I",
    dim: "E",
  },
  {
    code: "Q1.1-29",
    text: "Je dis spontanément ce que je pense devant un groupe.",
    orient: "D",
    dim: "E",
  },
  {
    code: "Q1.1-30",
    text: "Trois jours sans voir personne : mon paradis.",
    orient: "I",
    dim: "E",
  },
  {
    code: "Q1.1-31",
    text: "Il m'arrive d'attendre avant de dire à quelqu'un qu'il m'a contrarié — pour lui éviter du mal.",
    orient: "D",
    dim: "A",
  },
  {
    code: "Q1.1-32",
    text: "Il faut bien avouer que beaucoup de gens sont assez égoïstes.",
    orient: "I",
    dim: "A",
  },
  {
    code: "Q1.1-33",
    text: "Je m'inquiète sincèrement de comment vont les gens autour de moi.",
    orient: "D",
    dim: "A",
  },
  {
    code: "Q1.1-34",
    text: "Quand quelqu'un a tort, le dire clairement compte plus que le ménager.",
    orient: "I",
    dim: "A",
  },
  {
    code: "Q1.1-35",
    text: "Je fais volontiers des choses pour les autres sans rien attendre.",
    orient: "D",
    dim: "A",
  },
  {
    code: "Q1.1-36",
    text: "La politesse excessive me paraît souvent hypocrite.",
    orient: "I",
    dim: "A",
  },
  {
    code: "Q1.1-37",
    text: "Je fais confiance d'abord, je vérifie ensuite.",
    orient: "D",
    dim: "A",
  },
  {
    code: "Q1.1-38",
    text: "Je garde mes distances : ça évite les déceptions.",
    orient: "I",
    dim: "A",
  },
  {
    code: "Q1.1-39",
    text: "Les gens me décrivent comme quelqu'un de facile à vivre.",
    orient: "D",
    dim: "A",
  },
  {
    code: "Q1.1-40",
    text: "Je peux être dur(e) quand il faut l'être — et c'est souvent utile.",
    orient: "I",
    dim: "A",
  },
  {
    code: "Q1.1-41",
    text: "Un imprévu de dernière minute ne me déstabilise pas longtemps.",
    orient: "D",
    dim: "S",
  },
  {
    code: "Q1.1-42",
    text: "Je repasse souvent dans ma tête des choses dites ou faites.",
    orient: "I",
    dim: "S",
  },
  {
    code: "Q1.1-43",
    text: "Les périodes d'attente — résultats, réponses — me rongent.",
    orient: "I",
    dim: "S",
  },
  {
    code: "Q1.1-44",
    text: "Je dors assez bien même quand tout ne va pas.",
    orient: "D",
    dim: "S",
  },
  {
    code: "Q1.1-45",
    text: "Mon humeur varie fortement dans une même journée.",
    orient: "I",
    dim: "S",
  },
  {
    code: "Q1.1-46",
    text: "Je me fais des scénarios qui tournent mal plus souvent que nécessaire.",
    orient: "I",
    dim: "S",
  },
  {
    code: "Q1.1-47",
    text: "Face à une dispute, je retrouve mon calme assez vite.",
    orient: "D",
    dim: "S",
  },
  {
    code: "Q1.1-48",
    text: "Une remarque bête peut m'occuper l'esprit des heures.",
    orient: "I",
    dim: "S",
  },
  {
    code: "Q1.1-49",
    text: "Je me considère globalement serein(e).",
    orient: "D",
    dim: "S",
  },
  {
    code: "Q1.1-50",
    text: "Je sens souvent mon cœur s'accélérer sans raison claire.",
    orient: "I",
    dim: "S",
  },
];

/** Ordre de passation GELÉ — mélange graine 211427 (58 positions : 50 items + 8 trames). */
export const PASSATION: readonly string[] = [
  "Q1.1-17",
  "Q1.1-35",
  "Q1.1-08",
  "Q1.1-49",
  "Q1.1-25",
  "Q1.1-03",
  "Q1.1-T01",
  "Q1.1-50",
  "Q1.1-27",
  "Q1.1-10",
  "Q1.1-32",
  "Q1.1-29",
  "Q1.1-12",
  "Q1.1-T02",
  "Q1.1-30",
  "Q1.1-13",
  "Q1.1-48",
  "Q1.1-39",
  "Q1.1-19",
  "Q1.1-45",
  "Q1.1-T03",
  "Q1.1-07",
  "Q1.1-20",
  "Q1.1-44",
  "Q1.1-34",
  "Q1.1-09",
  "Q1.1-43",
  "Q1.1-T04",
  "Q1.1-11",
  "Q1.1-38",
  "Q1.1-26",
  "Q1.1-15",
  "Q1.1-37",
  "Q1.1-24",
  "Q1.1-T05",
  "Q1.1-42",
  "Q1.1-31",
  "Q1.1-05",
  "Q1.1-46",
  "Q1.1-33",
  "Q1.1-16",
  "Q1.1-T06",
  "Q1.1-06",
  "Q1.1-21",
  "Q1.1-14",
  "Q1.1-01",
  "Q1.1-36",
  "Q1.1-47",
  "Q1.1-22",
  "Q1.1-T07",
  "Q1.1-04",
  "Q1.1-18",
  "Q1.1-23",
  "Q1.1-40",
  "Q1.1-02",
  "Q1.1-28",
  "Q1.1-41",
  "Q1.1-T08",
];

/** Le deck réel : les items dans l'ordre gelé, les trames sautées (jamais affichées). */
export function deckQuete(): QueteItem[] {
  const parCode = new Map(ITEMS.map((i) => [i.code, i]));
  return PASSATION.flatMap((c) => {
    const it = parCode.get(c);
    return it ? [it] : [];
  });
}

/** Likert 1-5 → 0-1 (inversées recodées 6 − r), puis moyenne par dimension. */
function contribution(reponse: number, orient: 'D' | 'I'): number {
  return ((orient === 'D' ? reponse : 6 - reponse) - 1) / 4;
}

export interface Score11 { O: number; C: number; E: number; A: number; S: number; [k: string]: number }

/** Scorer du Livrable (06-computation) : moyenne 0-1 par dimension (O/C/E/A/S). */
export function scorer(reponses: Record<string, number>): Score11 {
  const acc: Record<'O' | 'C' | 'E' | 'A' | 'S', { total: number; n: number }> = {
    O: { total: 0, n: 0 },
    C: { total: 0, n: 0 },
    E: { total: 0, n: 0 },
    A: { total: 0, n: 0 },
    S: { total: 0, n: 0 },
  };
  for (const item of ITEMS) {
    const r = reponses[item.code];
    if (typeof r === 'number' && r >= 1 && r <= 5) {
      acc[item.dim].total += contribution(r, item.orient);
      acc[item.dim].n += 1;
    }
  }
  const moy = (k: keyof typeof acc): number => (acc[k].n > 0 ? acc[k].total / acc[k].n : 0);
  return { O: moy('O'), C: moy('C'), E: moy('E'), A: moy('A'), S: moy('S') };
}

export type VarianteId = 'V1' | 'V2' | 'V3' | 'V4' | 'V5' | 'V6' | 'V7';

/** Sélecteurs VERBATIM (cartes.yaml / FM-019), évalués dans l'ordre 1 → 7. */
export function choisirVariante(s: Score11): VarianteId {
  return s.S < 0.4 && (s.E >= 0.55 || s.O >= 0.55)
    ? 'V5'
    : s.C >= 0.65 && s.S >= 0.6
      ? 'V2'
      : s.O >= 0.65 && s.A >= 0.6
        ? 'V1'
        : s.E >= 0.65 && s.O >= 0.6
          ? 'V3'
          : s.E <= 0.4 && s.O >= 0.55
            ? 'V6'
            : s.S >= 0.6 && s.A >= 0.55
              ? 'V4'
              : 'V7';
}

export interface Carte {
  id: VarianteId;
  nom: string;
  lumiere: string;
  ombre: string;
  tension: string;
}

/** Les 7 variantes de carte — verbatim (cartes.yaml). */
export const CARTES: Record<VarianteId, Carte> = {
  V1: {
    id: "V1",
    nom: "L'Explorateur·rice chaleureux·se",
    lumiere: "Tu es de ceux qui rendent le monde plus grand. Une idée neuve, une cuisine inconnue, une conversation qui part de travers : tu dis oui, et tu entraînes les autres. Ta curiosité est chaleureuse — elle veut partager. Les gens se sentent bienvenus dans ton élan.",
    ombre: "Parfois, tu choisis le nouveau par peur que le même devienne l'ennui — et ce qui compte finit par attendre.",
    tension: "vivre tout, sans blesser personne.",
  },
  V2: {
    id: "V2",
    nom: "Le·La Bâtisseur·se",
    lumiere: "Tu es quelqu'un sur qui on peut compter — et ça se sait. Tu tiens tes promesses, tu prépares tes journées, tu finis ce que tu commences. Ce n'est pas de la rigidité : c'est du respect. Celui que tu portes aux choses, aux gens, à ta parole.",
    ombre: "Le contrôle a un coût — quand tout dérape, c'est toi que tu accuses en premier.",
    tension: "que tout soit solide, sans que ça devienne une prison.",
  },
  V3: {
    id: "V3",
    nom: "L'Étoile sociale",
    lumiere: "Tu entres dans une pièce et l'air change. Tu lances les conversations, tu connectes les gens entre eux, tu rends les soirées vivantes. Ta curiosité et ton énergie se renforcent : plus tu découvres, plus tu as envie de le raconter.",
    ombre: "Le silence peut te sembler un vide à remplir — et tu remplis parfois ce qui aurait mérité d'être écouté.",
    tension: "être aimé(e) pour ta lumière, pas seulement pour ton spectacle.",
  },
  V4: {
    id: "V4",
    nom: "L'Ancre",
    lumiere: "Il y a des gens autour de qui on respire mieux. Tu en fais partie. Le calme te traverse sans te casser ; les autres le sentent et s'y appuient. Tu ne cherches pas à briller : tu cherches à faire du bien, sobrement, durablement.",
    ombre: "Ta stabilité peut devenir une forteresse — tu accordes parfois trop de patience aux situations qui n'en méritent plus.",
    tension: "porter les autres sans t'oublier.",
  },
  V5: {
    id: "V5",
    nom: "L'Intense",
    lumiere: "Tu vis à volume maximum. Les joies te portent, les peines te traversent, rien ne te laisse neutre. Cette intensité que certains nomment \"trop\", c'est aussi ta profondeur : tu remarques ce que les autres passent à côté, tu aimes sans compter, tu te souviens de tout.",
    ombre: "Le monde est parfois bruyant pour toi — et tu gères la tempête sans mode d'emploi.",
    tension: "être tout entier dans ce que tu vis, sans que ça te submerge.",
  },
  V6: {
    id: "V6",
    nom: "L'Indépendant·e profond·e",
    lumiere: "Ton monde intérieur est vaste — c'est là que tu vis vraiment. Longues pensées, projets de fond, conversations à deux qui durent des heures : tu préfères la profondeur au bruit. Ceux qui te connaissent savent que ton calme cache un feu tranquille.",
    ombre: "Tu proposes rarement le premier contact — et certaines personnes que tu aurais aimées sont passées sans le savoir.",
    tension: "préserver ton monde sans en fermer la porte.",
  },
  V7: {
    id: "V7",
    nom: "L'Équilibriste",
    lumiere: "Ton profil ne rentre dans aucune case — et c'est une force déguisée. Tu possèdes un peu de tout : de la curiosité, de la constance, du cœur, du calme. Les gens te décrivent comme difficile à cerner et facile à aimer.",
    ombre: "Les profils complets changent lentement — vérifie que tu changes encore, et pas seulement que tu tiens.",
    tension: "être beaucoup de choses, sans te disperser en rien de tout.",
  },
};

/** Textes du briefing — verbatim (05-ecran-d-intro). */
export const BRIEFING = {
  annonce: "58 affirmations. Pas de bonne réponse — seulement ta réponse. Celle que tu crois être celle qu'on attend, c'est rarement la tienne.",
  aQuoiCaSert: [
    "C'est la première quête de ton voyage — la base de tout ce qui suit.",
    "58 affirmations décrivent ta façon d'être : ton ouverture, ton organisation, ton énergie sociale, ta bienveillance, ta stabilité émotionnelle.",
    "Il en sort ta première carte, ton premier miroir — et les premières pierres de ton portrait.",
    "Huit affirmations ressemblent aux autres et n'en sont pas : elles veillent sur la sécurité de l'app. Elles ne se voient jamais — ni dans ton portrait, ni dans tes rencontres.",
  ],
  resultats: [
    "Ta carte — ta lumière et ta zone d'ombre, en quelques mots.",
    "Ta tension intérieure — ce que tu cherches à tenir ensemble.",
    "Ton miroir — ton fonctionnement renvoyé en toutes lettres, avec un mode d'emploi concret.",
    "Les premières pierres de ton portrait — ce que tu découvres ici alimente toute la suite du voyage.",
  ],
};

/** Textes de la fenêtre de complétion (carte) — verbatim. */
export const COMPLETION = {
  entete: "🧭 QUÊTE ACCOMPLIE — « Ta personnalité »",
  labelOmbre: "Ta zone d'ombre :",
  labelTension: "Ta tension intérieure :",
  fenetre: "Quelque part, quelqu'un répond à ces mêmes questions. Le jour où vos cartes se croiseront, elles auront beaucoup à se dire.",
  miroirNote: "Ton miroir — la lecture complète de ton fonctionnement — arrive à la prochaine étape du voyage.",
};
