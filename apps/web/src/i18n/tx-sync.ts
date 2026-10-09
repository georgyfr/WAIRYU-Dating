/**
 * La traduction de chrome HORS React (fonction pure) — pour les couches qui
 * ne vivent pas dans l'arbre React : le PDF des résultats (lib/pdf-resultats,
 * jsPDF), les helpers de lib/quetes.ts. Lit la langue du singleton
 * (current.ts) — initialisée avant tout rendu, stable après rechargement.
 */

import { EN_CHROME } from './tr';
import { getLang } from './current';

/** Traduit une chaîne du chrome (clé = chaîne FR exacte) — repli FR. */
export function txSync(fr: string, vars?: Record<string, string | number>): string {
  let out = getLang() === 'en' ? (EN_CHROME[fr] ?? fr) : fr;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      out = out.split(`{{${k}}}`).join(String(v));
    }
  }
  return out;
}
