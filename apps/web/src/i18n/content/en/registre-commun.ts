/**
 * Miroir EN des libellés COMMUNS du registre (quetes.ts) — la couche
 * accompagnement partagée par toutes les quêtes :
 *  - COMMUN (comment tu vas répondre / ce qu'on attend de toi) ;
 *  - les 5 labels de l'échelle Likert (verbatim FR dans quete-1-1) ;
 *  - NOTA_BARRES (« À noter » du gabarit fondateur) ;
 *  - les noms de mondes (mondeDeQuete) ;
 *  - les mots-nombre et l'intro de l'aperçu « résultats en détail ».
 *
 * Structure PARALLELE : chaque chaîne correspond à la FR de quetes.ts.
 * Repli FR garanti par avecEN si ce fichier est incomplet.
 */

/** Le libellé des mondes (mondeDeQuete — chip d'entête des écrans). */
export const MONDES_NOMS: Record<string, string> = {
  M1: 'World 1 — The Mirror',
  M2: 'World 2 — The Wheel',
  M3: 'World 3 — The Compass',
};

/** Les mots-nombre de titreTendances (2 → 5). */
export const MOTS_NOMBRE_EN: Record<number, string> = {
  2: 'two',
  3: 'three',
  4: 'four',
  5: 'five',
};

/** Le titre singulier de la section tendances. */
export const TITRE_TENDANCE_UNIQUE_EN = 'Your tendency (from your answers)';

/** Le gabarit pluriel — « {{mot}} » remplacé par le mot-nombre. */
export const TITRE_TENDANCES_PLURIEL_EN = 'Your {{mot}} trends (from your answers)';

/** Les libellés de palier du gabarit fondateur (l'anglais n'accorde pas). */
export const LABELS_PALIER_EN: Record<string, string> = {
  fort: 'very strong',
  equilibre: 'balanced',
  doux: 'quieter',
};

/** L'intro de l'aperçu « résultats en détail » (construireApercuResultats). */
export const INTRO_APERCU_EN =
  'Here is what your answers draw today. No bar reduces you: each one describes a tendency — a place to start from, not a box to stay in.';

/** L'échelle Likert — « Exactly me » : la version EN des 5 niveaux. */
export const LIKERT_EN: Record<number, string> = {
  1: 'Not at all me',
  2: 'Not really me',
  3: 'Neutral',
  4: 'Rather me',
  5: 'Exactly me',
};

/** Le miroir COMMUN (commentRepondre + comportement — même ordre que FR). */
export const COMMUN_EN = {
  commentRepondre: [
    'One statement at a time. You answer on 5 levels, from “Not at all me” to “Exactly me”.',
    'No right answer, no grade, no stopwatch — you move at your own pace.',
    'Answer spontaneously, with your first response. The one you think is expected of you is rarely yours.',
  ],
  comportement: [
    'Settle in for a few quiet minutes.',
    'Answer as you are today, not as you would like to be — that is what keeps the journey honest.',
    'You can pause whenever you like: your answers stay on this device, and you pick up where you left off.',
  ],
};

/** « À noter » — la passe d'honnêteté du gabarit fondateur. */
export const NOTA_BARRES_EN =
  'Please note: these bars are a snapshot of today’s answers, not grades or verdicts. Every tendency has its strength and its risk — what matters is consciously choosing where to place the cursor.';
