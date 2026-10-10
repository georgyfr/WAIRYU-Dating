/**
 * Le miroir EN complet du REGISTRE des quêtes — fusion des mondes.
 * Consumé par lib/quetes.ts (avecEN(REGISTRE_FR, REGISTRE_EN)) : les
 * chaînes affichables passent en EN, tout champ absent reste FR.
 */
import type { L10n } from '../../apply';
import type { QueteDef } from '../../../lib/quetes';
import { REGISTRE_M1 } from './registre-m1';
import { REGISTRE_M2 } from './registre-m2';
import { REGISTRE_M3 } from './registre-m3';
import { REGISTRE_M4 } from './registre-m4';
import { REGISTRE_M5 } from './registre-m5';

export type MiroirQuete = L10n<QueteDef>;

export const REGISTRE_EN: Record<string, MiroirQuete> = {
  ...REGISTRE_M1,
  ...REGISTRE_M2,
  ...REGISTRE_M3,
  ...REGISTRE_M4,
  ...REGISTRE_M5,
};
