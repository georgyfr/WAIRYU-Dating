/**
 * MOTEUR DE VIGILANCE — les 14 signaux (Constitution [4], registre
 * `contrat/registres/signaux.json` — finding F.2b / BLOC 2, P0 runtime).
 *
 * ⚠ CÔTÉ MOTEUR UNIQUEMENT — JAMAIS en UI, jamais dans le score de
 * compatibilité, jamais au Portrait public (statut de chaque code au
 * registre). Toute consommation au rendu est une adjudication comité.
 *
 * Conception (honnêteté machine) :
 *  - les SOURCES de chaque signal sont DÉRIVÉES DE LA BANQUE (items dont
 *    `signal_id == code`) — aucune liste figée de trames dans le code ;
 *  - les seuils vivent dans `PSYCHOMETRY.SIGNALS` (constants.ts) —
 *    À VALIDER PAR LE COMITÉ — surchargeables par env (B.5d) ;
 *  - COC = DOUBLE ASSURANCE 6.2 × 8.3 : le niveau élevé exige la
 *    cohérence des DEUX matrices (vécu du refus aux deux étages) ;
 *  - Q1.7 — modulation TDAH : relâche les seuils DTM_N/DTM_M ;
 *  - matrice des pièges SIG-4.4-06 (M5-4.4) : produit des cellules
 *    risque/protection — calculée moteur, consommation politique au
 *    comité (verrou [9]) ;
 *  - BLA (4.3 ouverte) et ECD/GEN (étages ultérieurs) : NON évaluables
 *    par règle au P0 → niveaux `en_attente_*` explicites (pas de faux
 *    chiffres) ;
 *  - QFI : agrège les détecteurs psychométriques (droite-ligne, motif
 *    aléatoire, réponses réflexes, incohérences R6 → dégradation S3).
 */

import { PSYCHOMETRY } from './constants';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Les 14 codes du registre signaux.json (13 gelés + DE). */
export type SignalCode =
  | 'DTM_N'
  | 'DTM_M'
  | 'DGR'
  | 'JR1'
  | 'CSR'
  | 'CMP'
  | 'COC'
  | 'RB1'
  | 'BLA'
  | 'RSQ'
  | 'QFI'
  | 'ECD'
  | 'GEN'
  | 'DE';

export const SIGNAL_CODES: SignalCode[] = [
  'DTM_N',
  'DTM_M',
  'DGR',
  'JR1',
  'CSR',
  'CMP',
  'COC',
  'RB1',
  'BLA',
  'RSQ',
  'QFI',
  'ECD',
  'GEN',
  'DE',
];

/** Niveau d'un signal — les `en_attente_*` sont explicites (pas de faux chiffre). */
export type SignalLevel =
  | 'aucun'
  | 'faible'
  | 'moyen'
  | 'eleve'
  | 'critique'
  | 'en_attente_comite'
  | 'en_attente_donnees';

export interface SignalThreshold {
  moyen: number;
  eleve: number;
  critique: number;
}

/** Item de banque vu par le moteur (projection de q_doctrine_items). */
export interface VigilanceBankItem {
  code: string;
  /** Signal alimenté (registre) — null si l'item n'alimente pas de signal. */
  signalId: string | null;
  isTrame: boolean;
  /** La formulation RÉELLE de la trame était disponible au runtime (env/DO) ? */
  trameDisponible: boolean;
  orientation: 'D' | 'I' | null;
  quete: string;
}

export interface VigilanceInput {
  items: VigilanceBankItem[];
  /** Réponses normalisées 1-5 (items I DÉJÀ recodés 6−r par l'API). */
  answers: Record<string, number>;
  /** Réponses ouvertes (BLA — 4.3) : texte brut, moteur seul. */
  openAnswers?: Record<string, string>;
  /** Stats psychométriques calculées par l'API depuis q_doctrine_answers. */
  stats?: PsychometryStats;
  /** Drapeau Q1.7 — modulation TDAH (quête 1.7). */
  q17TDAH?: boolean;
}

export interface PsychometryStats {
  /** Détectés par detectStraightLining / detectRandomPattern / temps. */
  straightLining: boolean;
  randomPattern: boolean;
  /** Part de réponses réflexes (< PSYCHOMETRY.MIN_RESPONSE_MS), 0-1. */
  fastResponseRatio: number;
  /** Paires R6 incohérentes (|D − (6−I)| ≥ R6_MAX_INCOHERENCE). */
  r6Incoherences: number;
}

export interface SignalResult {
  code: SignalCode;
  level: SignalLevel;
  /** Moyenne des items sources (null si non évaluable). */
  value: number | null;
  /** Nombre d'items sources réellement évalués. */
  sources: number;
  note: string;
}

// ---------------------------------------------------------------------------
// Surcharge env des seuils (B.5d — anti-hardcoding)
// ---------------------------------------------------------------------------

/**
 * Fusionne la surcharge `PSYCHOMETRY_OVERRIDE` (JSON plat) sur les seuils
 * de base — appliquée AU BOOT côté API. Clé inconnue → ignorée (sûr).
 * Jamais loggée, jamais persistée.
 */
export function mergePsychometryOverride<T extends Record<string, unknown>>(
  base: T,
  raw: string | undefined,
): T {
  if (!raw) return base;
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const out: Record<string, unknown> = { ...base };
    for (const [k, v] of Object.entries(parsed)) {
      if (k in base && (typeof v === 'number' || typeof v === 'boolean')) out[k] = v;
      if (k === 'SIGNALS' && typeof v === 'object' && v !== null) {
        out[k] = { ...(base.SIGNALS as object), ...(v as object) };
      }
    }
    return out as T;
  } catch {
    return base; // env corrompue → seuils par défaut (jamais de crash)
  }
}

// ---------------------------------------------------------------------------
// Détecteurs psychométriques (B.5c — finding « 0 détecteur »)
// ---------------------------------------------------------------------------

/** Droite-ligne : variance nulle (toutes réponses identiques) sur ≥ N items Likert. */
export function detectStraightLining(likertValues: number[]): boolean {
  if (likertValues.length < PSYCHOMETRY.STRAIGHTLINE_MIN_ANSWERS) return false;
  const first = likertValues[0];
  return likertValues.every((v) => v === first);
}

/**
 * Motif aléatoire : alternance mécanique sans plateau (zigzag complet
 * a-b-a-b… ou marche a-b-c-d-e-d-c…) — heuristique de remplissage au hasard.
 */
export function detectRandomPattern(likertValues: number[]): boolean {
  const n = likertValues.length;
  if (n < PSYCHOMETRY.STRAIGHTLINE_MIN_ANSWERS) return false;
  // Zigzag strict : |Δ| vaut alternativement le même écart > 0.
  const deltas = likertValues.slice(1).map((v, i) => v - (likertValues[i] ?? v));
  const abs = deltas.map((d) => Math.abs(d));
  const first = abs[0];
  if (
    first !== undefined &&
    abs.every((d) => d > 0) &&
    abs.every((d) => d === first) &&
    first >= 2
  )
    return true;
  // Triangle : montée constante puis descente constante (ou l'inverse).
  const peak = likertValues.indexOf(Math.max(...likertValues));
  const up = likertValues.slice(1, peak + 1).every((v, i) => {
    const prev = likertValues[i];
    return prev !== undefined && v > prev;
  });
  const down = likertValues.slice(peak + 1).every((v, i) => {
    const next = likertValues[i + peak];
    return next !== undefined && v < next;
  });
  if (peak > 0 && peak < n - 1 && up && down) return true;
  return false;
}

/** R6 — paires fiabilité : |D − (6−I)| ≥ seuil → incohérence (recodage I déjà appliqué). */
export function r6Incoherent(dDirect: number, dInverseRecode: number): boolean {
  return Math.abs(dDirect - dInverseRecode) >= PSYCHOMETRY.R6_MAX_INCOHERENCE;
}

// ---------------------------------------------------------------------------
// Moteur — évaluation des 14 signaux
// ---------------------------------------------------------------------------

function niveauPour(valeur: number, seuil: SignalThreshold): SignalLevel {
  if (valeur >= seuil.critique) return 'critique';
  if (valeur >= seuil.eleve) return 'eleve';
  if (valeur >= seuil.moyen) return 'moyen';
  return 'faible';
}

/** Relâchement Q1.7 (TDAH) : seuils décalés vers le haut — À VALIDER PAR LE COMITÉ. */
function seuilAvecQ17(code: SignalCode, seuil: SignalThreshold, q17TDAH: boolean): SignalThreshold {
  if (!q17TDAH || !PSYCHOMETRY.Q17_TDAH_DTM_RESET) return seuil;
  if (code !== 'DTM_N' && code !== 'DTM_M') return seuil;
  const d = PSYCHOMETRY.Q17_TDAH_THRESHOLD_SHIFT;
  return { moyen: seuil.moyen + d, eleve: seuil.eleve + d, critique: seuil.critique + d };
}

/** Note de modulation consignée pour traçabilité moteur. */
function noteQ17(code: SignalCode, q17TDAH: boolean): string {
  return q17TDAH && (code === 'DTM_N' || code === 'DTM_M')
    ? ' — seuils relâchés (modulation Q1.7/TDAH, comité [9])'
    : '';
}

/**
 * Évalue les 14 signaux à partir de la banque + des réponses normalisées.
 * Les items trames SANS formulation disponible (env/DE absent) sont EXCLUS
 * de la moyenne et comptés dans la note — zéro faux signal.
 */
export function evaluateVigilance(input: VigilanceInput): SignalResult[] {
  const seuils = PSYCHOMETRY.SIGNALS as Record<SignalCode, SignalThreshold>;
  const results: SignalResult[] = [];

  for (const code of SIGNAL_CODES) {
    // ---- Sources dérivées de la banque (aucune liste figée) ----
    const sourcesItems = input.items.filter((i) => i.signalId === code);
    const evalues = sourcesItems.filter(
      (i) =>
        input.answers[i.code] !== undefined &&
        (!i.isTrame || i.trameDisponible),
    );
    const tramesAbsentes = sourcesItems.filter((i) => i.isTrame && !i.trameDisponible).length;

    // ---- Signaux à moyenne d'items ----
    if (code !== 'QFI' && code !== 'BLA' && code !== 'ECD' && code !== 'GEN') {
      if (evalues.length === 0) {
        results.push({
          code,
          level: 'aucun',
          value: null,
          sources: 0,
          note:
            sourcesItems.length === 0
              ? 'aucune source dans la banque active'
              : `sources non répondues (${sourcesItems.length})${tramesAbsentes ? ` · ${tramesAbsentes} trame(s) sans formulation disponible` : ''}`,
        });
        continue;
      }
      const valeur = evalues.reduce((s, i) => s + (input.answers[i.code] ?? 0), 0) / evalues.length;

      // COC — double assurance 6.2 × 8.3 : les deux étages doivent converger
      // pour un niveau élevé/critique (une seule matrice = assurance simple).
      if (code === 'COC') {
        const quetesSources = new Set(evalues.map((i) => i.quete));
        const doubleAssurance = quetesSources.has('6.2') && quetesSources.has('8.3');
        let niveau = niveauPour(valeur, seuilAvecQ17(code, seuils[code], !!input.q17TDAH));
        let note =
          `moyenne ${evalues.length} item(s) source(s) — quêtes ${[...quetesSources].sort().join(' + ')}` +
          (doubleAssurance ? ' — double assurance 6.2×8.3 vérifiée' : ' — assurance simple (une seule source)') +
          noteQ17(code, !!input.q17TDAH);
        if (!doubleAssurance && (niveau === 'eleve' || niveau === 'critique')) {
          niveau = 'moyen';
          note += ' — plafonné à « moyen » sans la 2ᵉ assurance (comité [9])';
        }
        results.push({ code, level: niveau, value: Math.round(valeur * 100) / 100, sources: evalues.length, note });
        continue;
      }

      results.push({
        code,
        level: niveauPour(valeur, seuilAvecQ17(code, seuils[code], !!input.q17TDAH)),
        value: Math.round(valeur * 100) / 100,
        sources: evalues.length,
        note:
          `moyenne de ${evalues.length} item(s) source(s)` +
          (tramesAbsentes ? ` · ${tramesAbsentes} trame(s) sans formulation disponible — exclue(s)` : '') +
          noteQ17(code, !!input.q17TDAH),
      });
      continue;
    }

    // ---- QFI : agrégat des détecteurs psychométriques ----
    if (code === 'QFI') {
      const s = input.stats;
      if (!s) {
        results.push({ code, level: 'aucun', value: null, sources: 0, note: 'stats psychométriques non fournies' });
        continue;
      }
      let points = 0;
      const notes: string[] = [];
      if (s.straightLining) { points += 2; notes.push('droite-ligne'); }
      if (s.randomPattern) { points += 2; notes.push('motif aléatoire'); }
      if (s.fastResponseRatio > PSYCHOMETRY.FAST_RESPONSE_RATIO) {
        points += 1;
        notes.push(`réponses réflexes ${(s.fastResponseRatio * 100).toFixed(0)} %`);
      }
      if (s.r6Incoherences > 0) {
        points += Math.min(2, s.r6Incoherences);
        notes.push(`${s.r6Incoherences} incohérence(s) R6 → S3 dégradé`);
      }
      const level: SignalLevel = points === 0 ? 'aucun' : points <= 2 ? 'faible' : points <= 4 ? 'moyen' : 'eleve';
      results.push({
        code,
        level,
        value: points,
        sources: notes.length,
        note: notes.length ? notes.join(' · ') : 'aucun drapeau de fiabilité',
      });
      continue;
    }

    // ---- BLA : quête 4.3 ouverte — non évaluable par règle au P0 ----
    if (code === 'BLA') {
      results.push({
        code,
        level: 'en_attente_comite',
        value: null,
        sources: evalues.length,
        note: 'réponse ouverte : lexique de blâme externe requis — À VALIDER PAR LE COMITÉ (aucune heuristique sauvage)',
      });
      continue;
    }

    // ---- ECD / GEN : données des étages ultérieurs ----
    results.push({
      code,
      level: 'en_attente_donnees',
      value: null,
      sources: 0,
      note: 'comportements révélés / gestes mesurés — étages ultérieurs (registre signaux.json)',
    });
  }

  return results;
}

// ---------------------------------------------------------------------------
// Matrice des pièges — SIG-4.4-06 (M5-4.4, moteur seul)
// ---------------------------------------------------------------------------

export interface PitMatrixInput {
  /** Scores normalisés 0-1 des dimensions M5-4.4 + RSQ (null si absentes). */
  abandon: number | null;
  evitement: number | null;
  carence: number | null;
  narcissisme: number | null;
  mefiance: number | null;
  rsq: number | null;
  /** FIS — libellé source (matrice SIG-4.4-06), score normalisé 0-1. */
  fis: number | null;
}

export interface PitCell {
  /** Paire de la matrice — ex. « Abandon × Évitement ». */
  paire: string;
  type: 'risque' | 'protection';
  /** Intensité normalisée 0-1 (produit des deux scores) — null si sans objet. */
  intensite: number | null;
  note: string;
}

/**
 * SIG-4.4-06 — les cellules connues de la matrice des pièges :
 *  · Abandon × Évitement   → risque (boucle poursuite-retrait) ;
 *  · Carence × Narcissisme → risque (instrumentalisation) ;
 *  · Méfiance × RSQ        → PROTECTION (double vigilance = garde, pas piège) ;
 *  · FIS × Évitement       → risque (retrait avant la preuve).
 * Le score d'intensité = produit des deux scores normalisés ; une cellule
 * « risque » n'est signalée au moteur qu'au-delà de PIT_MATRIX_INTENSITY.
 * ⚠ Consommation politique (filtrage/ordonnancement du feed) = ARBITRAGE
 * COMITÉ — la matrice est calculée et disponible, AUCUNE règle de rendu
 * ou de score ne la consomme au P0 (verrou [9]).
 */
export function pitMatrix(input: PitMatrixInput): PitCell[] {
  const seuil = PSYCHOMETRY.PIT_MATRIX_INTENSITY;
  const produit = (a: number | null, b: number | null): number | null =>
    a === null || b === null ? null : Math.round(a * b * 100) / 100;

  const cellules: PitCell[] = [
    {
      paire: 'Abandon × Évitement',
      type: 'risque',
      intensite: produit(input.abandon, input.evitement),
      note: 'boucle poursuite-retrait — moteur seul',
    },
    {
      paire: 'Carence × Narcissisme',
      type: 'risque',
      intensite: produit(input.carence, input.narcissisme),
      note: 'instrumentalisation relationnelle — moteur seul',
    },
    {
      paire: 'Méfiance × RSQ',
      type: 'protection',
      intensite: produit(input.mefiance, input.rsq),
      note: 'double vigilance = garde, pas un piège — jamais pénalisée',
    },
    {
      paire: 'FIS × Évitement',
      type: 'risque',
      intensite: produit(input.fis, input.evitement),
      note: 'retrait avant la preuve — moteur seul',
    },
  ];

  return cellules.map((c) =>
    c.intensite !== null && c.type === 'risque' && c.intensite < seuil
      ? { ...c, intensite: c.intensite, note: `${c.note} — sous le seuil de signalement (${seuil})` }
      : c,
  );
}
