/**
 * Les NOTIFICATIONS DE RÉCOLTE — le journal de ce que le voyage a rapporté.
 *
 * DEMANDE FONDATEUR (Task 45) : « ajouter les différents types de notifications
 * appropriés pour les différents types de récoltes » + « organiser les récoltes
 * par mois » + « lorsque une personne achète un mois, des notifications
 * apparaissent pour lui faire part de ce qu'il a eu à gagner comme récolte ».
 *
 * PRINCIPES (les mêmes que partout dans l'app) :
 *  - AUCUNE récompense inventée (règle §16) : une notification existe SEULEMENT
 *    si l'état RÉEL la justifie (quête terminée → carte/écran, monde engagé →
 *    mois ouvert, monde traversé → fragment + sceau + mois terminé). Les types
 *    `pass` et `credit` sont PRÊTS dans l'architecture mais ne se déclenchent
 *    pas tant qu'aucun pass/crédit n'existe dans les données.
 *  - UN MOIS = UN MONDE du voyage (Mois 1 — Le Miroir … Mois 11 — La Rencontre).
 *  - Le raccord PAIEMENT : `notifierMoisAchete(code)` est le point d'entrée
 *    unique que l'intégration PSP (contrat PRIX_PREMIUM, i18n/currency.ts)
 *    appellera quand un mois premium sera acheté — la notification « mois
 *    ouvert » partira alors avec la récolte du mois. Aucun faux achat n'est
 *    simulé aujourd'hui (l'ouverture des paiements n'a pas encore lieu).
 *
 * STOCKAGE INTERIMAIRE (documenté, comme quete-state) : localStorage
 * `wairyu.notifs` — migrera avec le moteur serveur. La PREMIÈRE synchronisation
 * amorce l'HISTOIRE existante en lu (un ancien voyageur n'a pas 15 badges
 * non lus d'un coup) ; ensuite, chaque nouvelle récolte arrive NON LUE.
 *
 * Réactivité : le MÊME bus que quete-state (souscrireEtat) — chaque quête
 * terminée re-synchronise le journal, idempotent par id déterministe.
 */

import { useSyncExternalStore } from 'react';
import { QUETE_IDS, QUETES, mondeDeQuete } from './quetes';
import { etatDe } from './quete-state';
import { statutsBruts } from './mondes-state';
import { WORLDS } from './voyage';

/** Les types de notifications de récolte — un type = une icône + une copie. */
export type TypeNotif =
  | 'carte' // 🃏 une carte-découverte obtenue
  | 'ecran' // 🪧 un écran de passage franchi (sans carte)
  | 'fragment' // 🧩 un fragment du portrait assemblé
  | 'sceau' // 🏅 un sceau du monde posé
  | 'mois_ouvert' // 🗓️ un mois du voyage s'est ouvert (début ou achat)
  | 'mois_fini' // ✅ un mois du voyage est terminé (sa récolte est complète)
  | 'pass' // 🎟️ prêt — aucun pass n'existe encore dans les données
  | 'credit'; // 🪙 prêt — aucun crédit n'existe encore dans les données

export interface NotifRecolte {
  /** Id déterministe ('carte:1.1', 'sceau:M1'…) — la déduplication est idempotente. */
  id: string;
  type: TypeNotif;
  /** Le mois du voyage d'origine (1-11 — un mois = un monde). */
  mois: number;
  /** Le nom verbatim de la carte (type 'carte' seulement). */
  nom?: string;
  /** La date réelle de l'événement (ISO). */
  date: string;
  lu: boolean;
}

const CLE = 'wairyu.notifs';
const CLE_INIT = 'wairyu.notifs.v1';
/** L'historique plafonné (les récoltes anciennes cèdent, les récentes restent). */
const PLAFOND = 60;

function lireStock(): NotifRecolte[] {
  try {
    const brut = window.localStorage.getItem(CLE);
    if (!brut) return [];
    const p = JSON.parse(brut) as unknown;
    if (!Array.isArray(p)) return [];
    const liste: NotifRecolte[] = [];
    for (const it of p) {
      if (!it || typeof it !== 'object') continue;
      const o = it as Record<string, unknown>;
      if (typeof o.id !== 'string' || typeof o.type !== 'string' || typeof o.date !== 'string') continue;
      if (typeof o.mois !== 'number' || o.mois < 1 || o.mois > 11) continue;
      liste.push({
        id: o.id,
        type: o.type as TypeNotif,
        mois: o.mois,
        ...(typeof o.nom === 'string' ? { nom: o.nom } : {}),
        date: o.date,
        lu: o.lu === true,
      });
    }
    return liste;
  } catch {
    return [];
  }
}

function ecrireStock(liste: NotifRecolte[]): void {
  try {
    window.localStorage.setItem(CLE, JSON.stringify(liste.slice(0, PLAFOND)));
  } catch {
    /* stockage indisponible — le journal vit pour la session */
  }
}

let notifs: NotifRecolte[] = lireStock();
const abonnes = new Set<() => void>();

function publier(): void {
  abonnes.forEach((a) => a());
}

/** S'abonne aux changements du journal (le bus partagé des écrans). */
export function souscrireNotifs(abonner: () => void): () => void {
  abonnes.add(abonner);
  return () => {
    abonnes.delete(abonner);
  };
}

/** La liste EN CACHE — identité stable tant que rien ne change (store externe). */
let cache: NotifRecolte[] = notifs;

function snapshot(): NotifRecolte[] {
  return cache;
}

/** Le hook réactif — la liste du journal + le nombre de non-lues. */
export function useNotifs(): { liste: NotifRecolte[]; nonLues: number } {
  const liste = useSyncExternalStore(souscrireNotifs, snapshot, snapshot);
  return { liste, nonLues: liste.filter((n) => !n.lu).length };
}

/** La synchronisation IDEMPOTENTE : dérive les notifications attendues de
 *  l'état RÉEL et comble les manquants (jamais de faux positifs, jamais de
 *  doublon — l'id est déterministe). Retourne true si quelque chose a changé. */
export function synchroniserNotifs(): boolean {
  const premiereFois = (() => {
    try {
      return window.localStorage.getItem(CLE_INIT) !== '1';
    } catch {
      return false;
    }
  })();

  const attendues = new Map<string, NotifRecolte>();

  // 1) Les quêtes terminées → carte (avec carteId valide) ou écran de passage.
  for (const id of QUETE_IDS) {
    const e = etatDe(id);
    if (!e.terminee) continue;
    const quete = QUETES[id];
    const mois = mondeDeQuete(id).code.startsWith('M') ? Number(mondeDeQuete(id).code.slice(1)) : 0;
    const date = e.termineeA ?? new Date().toISOString();
    const carte = e.carteId ? quete.cartes[e.carteId] : undefined;
    if (!quete.sansCarte && carte) {
      attendues.set(`carte:${id}`, { id: `carte:${id}`, type: 'carte', mois, nom: carte.nom, date, lu: true });
    } else {
      attendues.set(`ecran:${id}`, { id: `ecran:${id}`, type: 'ecran', mois, date, lu: true });
    }
  }

  // 2) Les mois (mondes) — ouvert au premier engagement, terminé à la clôture,
  //    qui posent fragment + sceau.
  const statuts = statutsBruts();
  for (const w of WORLDS) {
    const mois = w.num;
    if (statuts[w.code] === true) {
      attendues.set(`mois-ouvert:${w.code}`, {
        id: `mois-ouvert:${w.code}`,
        type: 'mois_ouvert',
        mois,
        date: new Date().toISOString(),
        lu: true,
      });
    }
    const ids = QUETE_IDS.filter((id) => mondeDeQuete(id).code === w.code);
    if (ids.length > 0 && ids.every((id) => etatDe(id).terminee)) {
      const dates = ids.map((id) => etatDe(id).termineeA ?? '').filter(Boolean);
      const cloture = dates.length > 0 ? dates.reduce((a, b) => (a > b ? a : b)) : new Date().toISOString();
      attendues.set(`fragment:${w.code}`, { id: `fragment:${w.code}`, type: 'fragment', mois, date: cloture, lu: true });
      attendues.set(`sceau:${w.code}`, { id: `sceau:${w.code}`, type: 'sceau', mois, date: cloture, lu: true });
      attendues.set(`mois-fini:${w.code}`, { id: `mois-fini:${w.code}`, type: 'mois_fini', mois, date: cloture, lu: true });
    }
  }

  // 3) La fusion : ce qui existe garde son état lu ; les manquants arrivent.
  //    Premier lancement : TOUTE l'histoire s'amorce en lu (pas de mur de badges).
  const ancienne = new Map(notifs.map((n) => [n.id, n]));
  const fusion: NotifRecolte[] = [];
  let change = premiereFois;
  for (const [id, attendue] of attendues) {
    const existante = ancienne.get(id);
    if (existante) {
      fusion.push(existante);
    } else {
      fusion.push({ ...attendue, lu: premiereFois ? true : false });
      change = true;
    }
  }
  // Les entrées orphelines (quête réinitialisée) restent dans l'historique —
  // l'événement a eu lieu ; la liste est triée par date décroissante.
  for (const n of notifs) {
    if (!attendues.has(n.id)) fusion.push(n);
  }
  fusion.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.id < b.id ? -1 : 1));

  if (!change) return false;
  notifs = fusion.slice(0, PLAFOND);
  cache = notifs;
  ecrireStock(notifs);
  if (premiereFois) {
    try {
      window.localStorage.setItem(CLE_INIT, '1');
    } catch {
      /* l'amorce rejouera — idempotent quand même */
    }
  }
  publier();
  return true;
}

/** Marque tout le journal comme lu (bouton du panneau). */
export function marquerToutLu(): void {
  if (notifs.every((n) => n.lu)) return;
  notifs = notifs.map((n) => (n.lu ? n : { ...n, lu: true }));
  cache = notifs;
  ecrireStock(notifs);
  publier();
}

/** Marque une notification comme lue (à l'ouverture de son explication). */
export function marquerLu(id: string): void {
  const n = notifs.find((x) => x.id === id);
  if (!n || n.lu) return;
  notifs = notifs.map((x) => (x.id === id ? { ...x, lu: true } : x));
  cache = notifs;
  ecrireStock(notifs);
  publier();
}

/**
 * LE RACCORD PAIEMENT (PSP à venir — contrat PRIX_PREMIUM) : l'achat d'un mois
 * premium appellera ceci, et la notification « mois ouvert » partira NON LUE
 * avec la récolte du mois. Aucun appel aujourd'hui — aucun achat simulé.
 */
export function notifierMoisAchete(code: string): void {
  const w = WORLDS.find((x) => x.code === code);
  if (!w) return;
  const id = `mois-ouvert:${code}`;
  if (notifs.some((n) => n.id === id)) return;
  notifs = [{ id, type: 'mois_ouvert', mois: w.num, date: new Date().toISOString(), lu: false }, ...notifs];
  cache = notifs;
  ecrireStock(notifs);
  publier();
}

/** La libellé FR d'un type (les autres langues passent par EN_CHROME au rendu). */
export function libelleNotif(n: NotifRecolte, tx: (fr: string, vars?: Record<string, string | number>) => string): string {
  switch (n.type) {
    case 'carte':
      return n.nom ? tx('Nouvelle découverte : {{nom}}', { nom: n.nom }) : tx('Nouvelle découverte');
    case 'ecran':
      return tx('Écran de passage franchi');
    case 'fragment':
      return tx('Fragment de portrait ajouté');
    case 'sceau':
      return tx('Sceau du monde posé');
    case 'mois_ouvert':
      return tx('Mois {{n}} ouvert', { n: n.mois });
    case 'mois_fini':
      return tx('Mois {{n}} terminé — ta récolte t\'attend');
    case 'pass':
      return tx('Nouveau pass');
    case 'credit':
      return tx('Nouveaux crédits');
  }
}
