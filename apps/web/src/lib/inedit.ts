/**
 * Les NOUVEAUTÉS PAR DESTINATION — les puces rouges de la navigation
 * (Task 68, demande fondateur : « les boutons tels que Voyage, Mondes,
 * Parcourus et Récolte aient des petites puces rouges qui montrent la
 * quantité de notifications qui apparaissent »).
 *
 * PRINCIPE (le même que partout dans l'app) :
 *  - AUCUN événement inventé : les compteurs dérivent de l'état RÉEL des
 *    quêtes (wairyu.quete.{id}) avec LES MÊMES RÈGLES que la progression
 *    (progression.ts) et le registre des gains (Recolte.tsx) — quête
 *    terminée → carte ou écran de passage ; monde traversé → fragment +
 *    sceau. Rien d'autre.
 *  - « Nouveau » = postérieur à la DERNIÈRE VISITE de la destination
 *    (horodatage par destination). La visite éteint la puce : c'est la
 *    sémantique « ce qu'il y a de nouveau pour TOI ici ».
 *  - AMORÇAGE (le même geste que notifs.ts v1) : au premier lancement,
 *    l'histoire existante est marquée vue — un ancien voyageur n'a pas dix
 *    badges d'un coup ; seules les acquisitions à venir s'allument.
 *
 * STOCKAGE : localStorage `wairyu.vu` = { destination: ISO 8601 } —
 * STOCKAGE INTERIMAIRE documenté (migrera avec le moteur serveur, comme
 * quete-state). Réactivité : le MÊME bus que quete-state (souscrireEtat) —
 * une quête terminée recalcule les compteurs partout, et marquerVu
 * re-publie (la puce s'éteint sans re-render forcé).
 */

import { useSyncExternalStore } from 'react';
import { QUETE_IDS, QUETES, mondeDeQuete } from './quetes';
import { etatDe, souscrireEtat } from './quete-state';

/** Les destinations suivies — les 4 onglets + les 5 onglets internes de la
 *  Récolte (`recolte.{onglet}`). La clé `recolte` couvre l'ONGLET de la
 *  barre ; les sous-clés, les sections internes. */
const DESTINATIONS: readonly string[] = [
  'voyage',
  'mondes',
  'parcourus',
  'recolte',
  'recolte.apercu',
  'recolte.cartes',
  'recolte.sceaux',
  'recolte.gains',
  'recolte.histoire',
];

const CLE_VU = 'wairyu.vu';
const CLE_AMORCE = 'wairyu.vu.v1';

function lireTout(): Record<string, string> {
  try {
    const brut = window.localStorage.getItem(CLE_VU);
    if (!brut) return {};
    const p = JSON.parse(brut) as unknown;
    if (!p || typeof p !== 'object' || Array.isArray(p)) return {};
    const vu: Record<string, string> = {};
    for (const [k, v] of Object.entries(p as Record<string, unknown>)) {
      if (typeof v === 'string' && v.length > 0) vu[k] = v;
    }
    return vu;
  } catch {
    return {};
  }
}

function ecrireTout(vu: Record<string, string>): void {
  try {
    window.localStorage.setItem(CLE_VU, JSON.stringify(vu));
  } catch {
    /* stockage indisponible — les puces vivent pour la session */
  }
}

/** AMORÇAGE : première exécution ⇒ l'histoire existante est « vue ». */
try {
  if (!window.localStorage.getItem(CLE_AMORCE)) {
    const maintenant = new Date().toISOString();
    const vu = lireTout();
    for (const d of DESTINATIONS) if (!vu[d]) vu[d] = maintenant;
    ecrireTout(vu);
    window.localStorage.setItem(CLE_AMORCE, '1');
  }
} catch {
  /* pas de stockage — rien à amorcer */
}

// ---------------------------------------------------------------- le bus

const abonnes = new Set<() => void>();

function publier(): void {
  abonnes.forEach((a) => a());
}

/** S'abonne aux changements (visites marquées + état des quêtes). */
export function souscrireInedits(abonner: () => void): () => void {
  abonnes.add(abonner);
  return () => {
    abonnes.delete(abonner);
  };
}

// Le bus des quêtes recalcule les compteurs (une quête terminée allume les
// puces Parcourus/Récolte/Voyage en direct). Enregistré après les déclarations
// de caches (il les invalide — le rappel ne court qu'après le chargement).
souscrireEtat(() => {
  cacheEvenements = null;
  cacheInedits = null;
  cacheVu = null;
  publier();
});

/** La visite d'une destination : pose l'horodatage et éteint sa puce. */
export function marquerVu(destination: string): void {
  const vu = lireTout();
  const maintenant = new Date().toISOString();
  if (vu[destination] === maintenant) return;
  vu[destination] = maintenant;
  ecrireTout(vu);
  cacheEvenements = null;
  cacheInedits = null;
  cacheVu = null;
  publier();
}

// ------------------------------------------------- les événements RÉELS

/** Un événement daté du voyage — jamais inventé, toujours dérivé de l'état. */
interface Evenement {
  key: string;
  date: string | null;
}

type TypeGain = 'carte' | 'ecran' | 'sceau' | 'fragment';

interface Evenements {
  /** Les quêtes TERMINÉES (key `quete:{id}`) — le journal de Parcourus. */
  quetes: Evenement[];
  /** Les mondes TRAVERSÉS (key `monde:{code}`) — la clôture réelle. */
  mondesFinis: Evenement[];
  /** Les mondes devenus JOUABLES par la clôture du précédent — la puce
   *  « ton monde suivant s'est ouvert » de Mondes (M1 : ouvert d'emblée,
   *  date null — jamais compté nouveau). */
  mondesOuverts: Evenement[];
  /** Le registre des GAINS (cartes, écrans, fragments, sceaux) — les mêmes
   *  entrées que l'onglet « Gains acquis » de la Récolte. */
  gains: { key: string; type: TypeGain; date: string | null }[];
}

let cacheEvenements: Evenements | null = null;
let cacheInedits: { sig: string; valeur: Inedits } | null = null;
let cacheVu: Record<string, string> | null = null;

function calculerEvenements(): Evenements {
  if (cacheEvenements) return cacheEvenements;
  const quetes: Evenement[] = [];
  const gains: Evenements['gains'] = [];
  const derniereParMonde = new Map<string, string | null>();
  const termineParMonde = new Map<string, number>();
  const totalParMonde = new Map<string, number>();
  for (const id of QUETE_IDS) {
    const code = mondeDeQuete(id).code;
    totalParMonde.set(code, (totalParMonde.get(code) ?? 0) + 1);
    const e = etatDe(id);
    if (!e.terminee) continue;
    const date = e.termineeA;
    quetes.push({ key: `quete:${id}`, date });
    termineParMonde.set(code, (termineParMonde.get(code) ?? 0) + 1);
    const d = derniereParMonde.get(code) ?? null;
    if (date && (!d || date > d)) derniereParMonde.set(code, date);
    const quete = QUETES[id];
    if (quete.sansCarte || !e.carteId || !quete.cartes[e.carteId]) {
      gains.push({ key: `ecran:${id}`, type: 'ecran', date });
    } else {
      gains.push({ key: `carte:${id}`, type: 'carte', date });
    }
  }
  const codes = [...totalParMonde.keys()];
  const mondesFinis: Evenement[] = [];
  const mondesOuverts: Evenement[] = [];
  codes.forEach((code, i) => {
    const fini = (termineParMonde.get(code) ?? 0) >= (totalParMonde.get(code) ?? Infinity);
    if (fini) {
      const cloture = derniereParMonde.get(code) ?? null;
      mondesFinis.push({ key: `monde:${code}`, date: cloture });
      gains.push({ key: `sceau:${code}`, type: 'sceau', date: cloture });
      gains.push({ key: `fragment:${code}`, type: 'fragment', date: cloture });
    }
    // Le monde SUIVANT de la chaîne s'ouvre à la clôture du précédent.
    const suivant = codes[i + 1];
    if (suivant && fini) {
      mondesOuverts.push({ key: `monde-ouvert:${suivant}`, date: derniereParMonde.get(code) ?? null });
    }
  });
  cacheEvenements = { quetes, mondesFinis, mondesOuverts, gains };
  return cacheEvenements;
}

/** Le nombre d'événements postérieurs à la dernière visite — sans horodatage
 *  connu (stockage effacé) : 0 (l'amorçage garantit une date en usage normal). */
function compterApres(destination: string, dates: (string | null)[]): number {
  const vu = lireTout();
  const seuil = vu[destination];
  if (!seuil) return 0;
  let n = 0;
  for (const d of dates) if (d && d > seuil) n++;
  return n;
}

// ------------------------------------------------------------ les hooks

export interface Inedits {
  /** Le voyage a avancé : quêtes terminées + mondes traversés non vus. */
  voyage: number;
  /** Les mondes ont bougé : monde traversé (chip Terminé) + monde ouvert. */
  mondes: number;
  /** Le journal s'est enrichi : quêtes terminées non vues. */
  parcourus: number;
  /** Le coffre s'est enrichi : gains non vus (cartes, écrans, fragments, sceaux). */
  recolte: number;
}

function signature(): string {
  const etat = QUETE_IDS.map((id) => (etatDe(id).terminee ? '1' : '0')).join('');
  return JSON.stringify(lireTout()) + '|' + etat;
}

function snapshotInedits(): Inedits {
  const sig = signature();
  if (cacheInedits === null || cacheInedits.sig !== sig) {
    const { quetes, mondesFinis, mondesOuverts, gains } = calculerEvenements();
    cacheInedits = {
      sig,
      valeur: {
        voyage: compterApres('voyage', [...quetes.map((q) => q.date), ...mondesFinis.map((m) => m.date)]),
        mondes: compterApres('mondes', [...mondesFinis.map((m) => m.date), ...mondesOuverts.map((m) => m.date)]),
        parcourus: compterApres('parcourus', quetes.map((q) => q.date)),
        recolte: compterApres('recolte', gains.map((g) => g.date)),
      },
    };
  }
  return cacheInedits.valeur;
}

/** Les compteurs de nouveautés des 4 onglets — réactifs (bus des quêtes). */
export function useInedits(): Inedits {
  return useSyncExternalStore(souscrireInedits, snapshotInedits, snapshotInedits);
}

/** L'horodatage par destination — pour les puces INTERNES (onglets de la
 *  Récolte) qui comparent leur propre registre. Réactif au marquerVu. */
export function useVuToutes(): Record<string, string> {
  return useSyncExternalStore(souscrireInedits, snapshotVu, snapshotVu);
}

function snapshotVu(): Record<string, string> {
  if (cacheVu === null) cacheVu = lireTout();
  return cacheVu;
}
