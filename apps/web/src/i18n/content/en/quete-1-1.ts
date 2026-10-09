/**
 * Monde 1 · quête 1.1 « Ta personnalité » — ITEMS (ordre figé, 50 entrées :
 * les 50 items carte ; les 8 trames Q1.1-T de la passation n'apparaissent
 * jamais dans ITEMS — 58 = positions de passation, pas longueur du tableau).
 *
 * MIROIR EN — structure parallèle au FR (fusion par INDEX/tableaux, par
 * CLÉ/objets). Une chaîne absente = repli FR silencieux (avecEN).
 * NE PAS recopier : les codes (Q…), ids de variantes, clés de dims,
 * orientations, booléens — ils restent côté FR.
 */
import type { L10n } from '../../apply';
import type { QueteItem } from '../../../lib/quete-1-1';

export const ITEMS: L10n<readonly QueteItem[]> = [
  { text: "I love conversations that drift into unexpected ideas." },
  { text: "A new cuisine, a new country, a new method: I say yes before asking any questions." },
  { text: "I prefer people who think like me — it avoids debates." },
  { text: "Art, music, or books sometimes change the way I see things." },
  { text: "I get bored quickly in routines that are too set." },
  { text: "Abstract ideas annoy me: I prefer what is concrete and useful." },
  { text: "I like imagining alternative versions of my life." },
  { text: "Rewatching a film I loved pleases me more than discovering something new." },
  { text: "I get interested in subjects nobody around me knows." },
  { text: "A slightly crazy idea is worth stopping for." },
  { text: "What I promise, I keep — even the small promises." },
  { text: "I often let things drift until the last minute." },
  { text: "My things have their place, and I like it that way." },
  { text: "I regularly forget things I had planned." },
  { text: "Before committing, I check that I have the time to do it well." },
  { text: "My space — bag, room, desk — says the opposite of my organization." },
  { text: "I finish what I start, even when the desire has passed." },
  { text: "Administrative details always slip past me." },
  { text: "I plan my days, at least vaguely." },
  { text: "I work better in my own kind of mess." },
  { text: "After a day surrounded by people, I feel recharged." },
  { text: "A one-on-one evening beats a big table." },
  { text: "I easily start conversations with strangers." },
  { text: "Events where I know nobody make me want to leave early." },
  { text: "In a group, I speak up without forcing it." },
  { text: "I need long stretches of silence to find myself again." },
  { text: "Boredom comes when nothing is happening around me." },
  { text: "I prefer watching to joining in when the group's energy rises." },
  { text: "I say what I think in front of a group, spontaneously." },
  { text: "Three days without seeing anyone: my paradise." },
  { text: "I sometimes wait before telling someone they hurt me — to spare them pain." },
  { text: "Let's be honest: many people are rather selfish." },
  { text: "I sincerely worry about how the people around me are doing." },
  { text: "When someone is wrong, saying it clearly matters more than sparing them." },
  { text: "I gladly do things for others without expecting anything back." },
  { text: "Excessive politeness often seems hypocritical to me." },
  { text: "I trust first, and check later." },
  { text: "I keep my distance: it avoids disappointments." },
  { text: "People describe me as easy to live with." },
  { text: "I can be tough when it's needed — and it's often useful." },
  { text: "A last-minute surprise doesn't unsettle me for long." },
  { text: "I often replay things said or done in my head." },
  { text: "Waiting periods — results, answers — gnaw at me." },
  { text: "I sleep fairly well even when not everything is fine." },
  { text: "My mood swings strongly within a single day." },
  { text: "I run worst-case scenarios in my head more often than necessary." },
  { text: "After an argument, I find my calm again fairly quickly." },
  { text: "A silly remark can occupy my mind for hours." },
  { text: "On the whole, I consider myself serene." },
  { text: "I often feel my heart racing without a clear reason." },
];
