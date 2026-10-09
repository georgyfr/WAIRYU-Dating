/**
 * LE PONT VERS LES PUSH OS des notifications de récolte (Task 47).
 *
 * Demande fondateur : « quand je parlais de notifications dans #/recolte,
 * il s'agissait des notifications push sur web et mobile ». Les récoltes
 * (carte, écran de passage, fragment, sceau, mois ouvert/fini — Task 45)
 * ne doivent pas seulement remplir la cloche : elles doivent arrivées en
 * BULLE SYSTÈME sur tous les appareils du compte (web arrière-plan, PWA,
 * TWA Android — même canal VAPID).
 *
 * ARCHITECTURE (cohérente avec l'état réel du produit) :
 *  - l'état des quêtes vit en localStorage : le serveur ne peut pas deviner
 *    une complétion — c'est CE appareil, au moment où le journal récolte
 *    grandit, qui prévient le serveur (POST /api/push/notify-recolte,
 *    session requise) ;
 *  - le serveur dédoublonne (push_recolte_dedup — le même id ne part JAMAIS
 *    deux fois, même posté par un autre appareil) puis pousse à tous les
 *    appareils liés au compte ;
 *  - le SW (public/sw.js) décide : page visible ⇒ toast in-app (pas de
 *    bulle pendant l'usage actif), arrière-plan ⇒ bulle OS ; clic ⇒ #/recolte.
 *
 * GARDES CÔTÉ CLIENT :
 *  - seules les récoltes NON LUES et pas encore poussées partent (un ancien
 *    voyageur n'amorce jamais 15 bulles d'un coup) ;
 *  - échec silencieux systématique : le push ne casse JAMAIS le voyage —
 *    la cloche in-app reste la source de vérité ;
 *  - 401 (session absente) → rien, sans mémorisation : les récoltes non
 *    poussées partiront après connexion (à la prochaine synchronisation).
 */

import type { PushRecolteResponse, RecoltePushItem } from '@wairyu/shared';
import type { NotifRecolte } from './notifs';
import { getLang } from '../i18n/current';

/** Les récoltes déjà confirmées poussées (garde locale, le serveur fait foi). */
const CLE_PUSHE = 'wairyu.notifs.pushe';
/** Plafond de la garde locale (les ids anciens cèdent — le serveur dédoublonne aussi). */
const PLAFOND_PUSHE = 200;
/** Maximum de récoltes poussées par synchronisation (un monde fini = 3-4 pièces). */
const MAX_PAR_SYNC = 6;

function lirePushe(): Set<string> {
  try {
    const brut = window.localStorage.getItem(CLE_PUSHE);
    if (!brut) return new Set();
    const p = JSON.parse(brut) as unknown;
    return Array.isArray(p) ? new Set(p.filter((x): x is string => typeof x === 'string')) : new Set();
  } catch {
    return new Set();
  }
}

function ecrirePushe(ids: Iterable<string>): void {
  try {
    const liste = Array.from(ids).slice(-PLAFOND_PUSHE);
    window.localStorage.setItem(CLE_PUSHE, JSON.stringify(liste));
  } catch {
    /* stockage indisponible — le serveur dédoublonne quand même */
  }
}

/** Le type NotifRecolte → le contrat de l'API (pass/credit exclus : dormants). */
function itemDeApi(n: NotifRecolte): RecoltePushItem | null {
  if (n.type === 'pass' || n.type === 'credit') return null; // jamais déclenchés à ce jour
  return { id: n.id, type: n.type, mois: n.mois, ...(n.nom ? { nom: n.nom } : {}) };
}

/**
 * Pousse les récoltes NOUVELLES et NON LUES vers les appareils du compte.
 * Fire-and-forget : appelé par synchroniserNotifs (bus des quêtes), ne lève
 * jamais, ne bloque jamais le rendu.
 */
export async function pousserRecoltes(nouveautes: NotifRecolte[]): Promise<void> {
  try {
    if (nouveautes.length === 0) return;
    const pushe = lirePushe();
    const candidats: RecoltePushItem[] = [];
    for (const n of nouveautes) {
      if (n.lu) continue; // amorce d'historique / déjà vue → pas de bulle
      if (pushe.has(n.id)) continue; // déjà confirmé poussé
      const item = itemDeApi(n);
      if (item) candidats.push(item);
      if (candidats.length >= MAX_PAR_SYNC) break;
    }
    if (candidats.length === 0) return;

    const res = await fetch('/api/push/notify-recolte', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ items: candidats, lang: getLang() }),
    });
    if (!res.ok) return; // 401 (pas encore de compte) / 429 / erreur → prochaine sync
    const r = (await res.json()) as PushRecolteResponse;
    if (r?.ok) {
      const confirmation = new Set([...pushe, ...candidats.map((c) => c.id)]);
      ecrirePushe(confirmation);
    }
  } catch {
    /* hors-ligne / SW indisponible — la prochaine synchronisation refera */
  }
}
