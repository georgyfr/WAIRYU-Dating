/**
 * MIROIR EN des ARCHÉTYPES (quetes-plus.ts — ARCHE) : par identifiant de
 * quête, par variante (V1, V2…), les 6 champs affichables du gabarit
 * fondateur : intro · devise · apportes · freines · couple · equilibre.
 * Ton : tutoiement → « you », simple et littéral, chaleureux, phrases courtes.
 * Les clés de variantes restent EXACTEMENT celles du FR.
 */
import { ARCHES_M1 } from './arches-m1';
import { ARCHES_M2 } from './arches-m2';
import { ARCHES_M3 } from './arches-m3';

export const ARCHE: {
  [quete: string]: {
    [variante: string]: {
      intro?: string;
      devise?: string;
      apportes?: string;
      freines?: string;
      couple?: string;
      equilibre?: string;
    };
  };
} = {
  ...ARCHES_M1,
  ...ARCHES_M2,
  ...ARCHES_M3,
};
