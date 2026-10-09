/**
 * Monde 1 · quête 1.3 « Tes émotions » — ITEMS (20 entrées, ordre figé).
 *
 * MIROIR EN — structure parallèle au FR (fusion par INDEX/tableaux, par
 * CLÉ/objets). Une chaîne absente = repli FR silencieux (avecEN).
 * NE PAS recopier : les codes (Q…), ids de variantes, clés de dims,
 * orientations, booléens — ils restent côté FR.
 */
import type { L10n } from '../../apply';
import type { QueteItem13 } from '../../../lib/quete-1-3';

export const ITEMS: L10n<readonly QueteItem13[]> = [
  { text: "I can name what I feel, even when it's mixed." },
  { text: "My emotions often take me by surprise." },
  { text: "I notice quickly when my mood changes." },
  { text: "I sometimes realize I was angry — or sad — long after the fact." },
  { text: "The sensations of my body tell me about my inner state." },
  { text: "I can tell tiredness from sadness, nervousness from excitement." },
  { text: "I can calm myself down without anyone's help." },
  { text: "When a strong emotion arrives, it sweeps through me more than I steer it." },
  { text: "I can find words early enough to keep things from overflowing." },
  { text: "I do things I regret when I'm very angry or very hurt." },
  { text: "A walk, a breath, a pause: I know the gestures that soothe me." },
  { text: "I ruminate for hours before finding my calm again." },
  { text: "I can welcome a painful emotion without fleeing it right away." },
  { text: "I tell people what they mean to me." },
  { text: "I feel a lot, but it almost never shows." },
  { text: "People naturally turn to me for comfort." },
  { text: "Saying “you matter to me” makes me uncomfortable, even when it's sincere." },
  { text: "I genuinely care about what others feel inside." },
  { text: "I celebrate other people's good news as if it were mine." },
  { text: "Other people's tears mostly make me uncomfortable." },
];
