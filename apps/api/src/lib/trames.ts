/**
 * CHARGEMENT DES TRAMES SÉCURITÉ — règle 11-b (finding G.1a, P0 runtime).
 *
 * Les formulations réelles des trames ▲ (T01-T60) ne vivent JAMAIS dans le
 * dépôt : brûlées, seul le placeholder officiel est au dépôt (sha256
 * 0d90aef535aca2cfbbeed2b1e7796930825fc102f27040fc1be628e9f111f8cb —
 * aiguille A2 de la garde étendue). Au runtime, elles sont injectées par
 * variables d'environnement `TRAME_*` (canal privé — document trames) ; un
 * Durable Object chiffré peut remplacer l'env en déploiement ultérieur.
 *
 * Garde-fous :
 *  - zéro log, zéro cache partagé, zéro persistance — la formulation ne
 *    traverse la mémoire que le temps de servir l'item au membre concerné ;
 *  - si la variable est absente, l'item est servi avec le placeholder et
 *    marqué indisponible : le moteur de vigilance EXCLUT ses réponses des
 *    moyennes de signal (zéro faux signal — voir vigilance.ts).
 */

/** Clé env canonique d'une trame — « Q6.2-T53 » → « TRAME_Q6_2_T53 ». */
export function trameEnvKey(code: string): string {
  return `TRAME_${code.replace(/[^A-Za-z0-9]/g, '_').toUpperCase()}`;
}

/**
 * Lit la formulation réelle d'une trame depuis l'environnement Workers.
 * Retourne null si absente (l'appelant sert le placeholder officiel).
 * Chaîne vide → null (une trame vide n'existe pas).
 */
export function loadTrame(env: Record<string, unknown>, code: string): string | null {
  const raw = env[trameEnvKey(code)];
  if (typeof raw !== 'string') return null;
  const t = raw.trim();
  return t.length > 0 ? t : null;
}

/**
 * Charge toutes les trames disponibles pour une liste de codes — une seule
 * passe d'env. Les codes absents sont simplement omis (l'appelant connaît
 * la liste complète et sait ce qui manque).
 */
export function loadTrames(env: Record<string, unknown>, codes: string[]): Map<string, string> {
  const out = new Map<string, string>();
  for (const code of codes) {
    const t = loadTrame(env, code);
    if (t !== null) out.set(code, t);
  }
  return out;
}
