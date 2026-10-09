/**
 * Le dictionnaire EN du chrome app — fusion des périmètres
 * (core · screens-a · screens-b). Les clés sont les chaînes FRANÇAISES
 * exactes du code ; une clé absente = la chaîne FR s'affiche (repli).
 */
import { CORE } from './core';
import { SCREENS_A } from './screens-a';
import { SCREENS_B } from './screens-b';

export const EN_CHROME: Record<string, string> = {
  ...CORE,
  ...SCREENS_A,
  ...SCREENS_B,
};
