/**
 * Monde 2 · quête 1.4 « Ton contrôle sur toi-même » — ITEMS (9 entrées,
 * ordre figé : les 8 items carte + le doublon de fiabilité Q1.4-01.r,
 * jamais affiché — l'entrée existe pour garder la longueur du tableau FR).
 *
 * MIROIR EN — structure parallèle au FR (fusion par INDEX/tableaux, par
 * CLÉ/objets). Une chaîne absente = repli FR silencieux (avecEN).
 * NE PAS recopier : les codes (Q…), ids de variantes, clés de dims,
 * orientations, booléens — ils restent côté FR.
 */
import type { L10n } from '../../apply';
import type { QueteItem14 } from '../../../lib/quete-1-4';

export const ITEMS: L10n<readonly QueteItem14[]> = [
  { text: "When I decide on a limit — budget, screen, food — I hold it." },
  { text: "I sometimes pick back up things I had decided to stop." },
  { text: "I prefer to wait for the right moment rather than give in on the spot." },
  { text: "Small everyday temptations often win over my good resolutions." },
  { text: "What I say I'll do in a week, I really do." },
  { text: "I often pay back “later” for what I allow myself “now”." },
  { text: "Even tired or upset, I keep my habits of taking care of myself." },
  { text: "I'm the kind of person who drops everything for a sudden urge." },
  { text: "My decisions about limits hold over time." },
];
