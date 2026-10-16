/**
 * Task 69-c — LA SAUVEGARDE QUI TE SUIT PARTOUT (GO fondateur).
 *
 * Chaque persiste() de quete-state.ts pousse l'état de la quête vers
 * /api/reponses (D1, rattaché au COMPTE) — fire-and-forget, jamais bloquant :
 * le localStorage reste la vérité de session, D1 est la sauvegarde qui suit
 * le membre sur tous ses appareils.
 *
 * RESTAURATION (restaurerReponses) — appelée à chaque session authentifiée
 * (boot + onAuthenticated, App.tsx) : GET /api/reponses, puis quête par
 * quête, le PLUS RÉCENT gagne :
 *  - D1 plus récent que le local (ou local vide) → importerEtatDistant
 *    (le bus quete-state prévient les écrans, qui se re-rendent) ;
 *  - local plus récent (ex. répondu hors ligne) → PUT pour rattraper D1.
 * Les états d'avant la Task 69-c (sans `majA`) : l'appareil ACTIF a raison —
 * son état réel est poussé au premier persiste qui suit.
 *
 * Sans session : rien ne part, rien ne se restaure — silencieux.
 */

import {
  surPersiste,
  etatDe,
  lireMajA,
  importerEtatDistant,
} from './quete-state';
import type { EtatQuete, Lecture } from './quete-state';
import { QUETE_IDS } from './quetes';

/** Débounce par quête (ms) : les réponses arrivent item par item — un PUT
 *  après la dernière frappe suffit (58 items de 1.1 ≠ 58 requêtes). */
const DEBOUNCE_MS = 1600;

/** La synchro n'est armée qu'une fois (registre module). */
let branche = false;

/** Le membre est-il authentifié ? Posé par App.tsx après fetchMe/login. */
let authentifie = false;

/** Les timers de debounce par quête. */
const retards = new Map<string, number>();

/** Parse défensif d'un état distant (la même forme que le local) — jamais
 *  inventé : ce qui ne passe pas est ignoré, pas corrigé. */
function parseEtatDistant(brut: unknown): EtatQuete | null {
  if (!brut || typeof brut !== 'object' || Array.isArray(brut)) return null;
  const o = brut as Record<string, unknown>;
  if (typeof o.terminee !== 'boolean') return null;
  const reponses: Record<string, number> = {};
  if (o.reponses && typeof o.reponses === 'object' && !Array.isArray(o.reponses)) {
    for (const [k, v] of Object.entries(o.reponses as Record<string, unknown>)) {
      if (typeof v === 'number' && Number.isFinite(v)) reponses[k] = v;
    }
  }
  const lectures: Record<string, Lecture> = {};
  if (o.lectures && typeof o.lectures === 'object' && !Array.isArray(o.lectures)) {
    for (const [k, v] of Object.entries(o.lectures as Record<string, unknown>)) {
      if (v === 1 || v === 2 || v === 3) lectures[k] = v;
    }
  }
  const textes: Record<string, string> = {};
  if (o.textes && typeof o.textes === 'object' && !Array.isArray(o.textes)) {
    for (const [k, v] of Object.entries(o.textes as Record<string, unknown>)) {
      if (typeof v === 'string' && v.length <= 500) textes[k] = v;
    }
  }
  return {
    reponses,
    terminee: o.terminee === true,
    carteId: typeof o.carteId === 'string' ? o.carteId : null,
    termineeA: typeof o.termineeA === 'string' ? o.termineeA : null,
    lectures,
    ...(Object.keys(textes).length > 0 ? { textes } : {}),
  };
}

function etatVide(e: EtatQuete): boolean {
  return Object.keys(e.reponses).length === 0 && !e.terminee;
}

function mettreEnQuete(id: string): void {
  const existant = retards.get(id);
  if (existant !== undefined) window.clearTimeout(existant);
  const t = window.setTimeout(() => {
    retards.delete(id);
    void pousser(id);
  }, DEBOUNCE_MS);
  retards.set(id, t);
}

/** Push (ou delete) de la quête vers D1 — fire-and-forget, silencieux. */
async function pousser(id: string): Promise<void> {
  if (!authentifie) return;
  const e = etatDe(id);
  try {
    if (etatVide(e)) {
      // L'utilisateur a tout effacé : la sauvegarde suit (DELETE).
      await fetch(`/api/reponses/${encodeURIComponent(id)}`, { method: 'DELETE' });
      return;
    }
    const majA = lireMajA(id) ?? new Date().toISOString();
    await fetch(`/api/reponses/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ etat: { ...e, majA } }),
    });
  } catch {
    /* réseau absent / session expirée — le local reste la vérité de session,
       le prochain persiste retentera. Jamais de bruit pour le membre. */
  }
}

/** Rattrape D1 depuis le local (état local plus récent ou jamais sauvegardé). */
async function pousserAvec(id: string, e: EtatQuete): Promise<void> {
  try {
    const majA = lireMajA(id) ?? new Date().toISOString();
    await fetch(`/api/reponses/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ etat: { ...e, majA } }),
    });
  } catch {
    /* silencieux — le prochain persiste retentera */
  }
}

/** Arme la synchro (une seule fois par chargement d'app) : chaque persiste
 *  de quête part en debounce vers D1. Sans session : no-op silencieux. */
export function brancherSynchroReponses(): void {
  if (branche) return;
  branche = true;
  surPersiste((id) => {
    if (!authentifie) return;
    mettreEnQuete(id);
  });
}

/** Marqueur local « une session a existé sur cet appareil » — survit au reload
 *  (hors ligne compris). Sert à NE PAS déconnecter l'utilisateur sur une
 *  simple erreur réseau au boot (audit FE-005) : 401 = vraie fin de session
 *  (marqueur purgé), erreur réseau = mode dégradé si le marqueur est présent. */
const CLE_SESSION_LOCALE = 'wairyu.session.presente';

/** App.tsx pose l'état d'authentification après fetchMe/login/logout.
 *  Le marqueur est PERSISTÉ (localStorage) en plus du drapeau mémoire. */
export function definirAuthentifie(v: boolean): void {
  authentifie = v;
  try {
    if (v) localStorage.setItem(CLE_SESSION_LOCALE, '1');
    else localStorage.removeItem(CLE_SESSION_LOCALE);
  } catch {
    /* localStorage indisponible (navigation privée) — drapeau mémoire seul */
  }
}

/** Y a-t-il eu une session sur cet appareil ? (lecture tolérante aux erreurs) */
export function sessionLocalePresente(): boolean {
  try {
    return localStorage.getItem(CLE_SESSION_LOCALE) === '1';
  } catch {
    return false;
  }
}

/** Restaure les réponses du COMPTE vers cet appareil (au login / au boot
 *  authentifié). Non-bloquant : les écrans se re-rendent via le bus à
 *  l'importation. Retourne le nombre de quêtes restaurées (diagnostic). */
export async function restaurerReponses(): Promise<number> {
  if (!authentifie) return 0;
  let nombre = 0;
  try {
    const res = await fetch('/api/reponses');
    if (!res.ok) return 0;
    const data = (await res.json()) as {
      ok?: boolean;
      reponses?: { quete: string; etat: unknown; updatedAt: string }[];
    };
    if (!data.ok || !Array.isArray(data.reponses)) return 0;
    const connues = new Set<string>();
    for (const distant of data.reponses) {
      const id = distant.quete;
      connues.add(id);
      const etat = parseEtatDistant(distant.etat);
      if (!etat) continue;
      const majADistant = typeof distant.updatedAt === 'string' ? distant.updatedAt : '';
      const majALocal = lireMajA(id);
      // Local VIDE (aucune réponse, jamais terminé) → D1 gagne, toujours.
      const localVide = etatVide(etatDe(id));
      // D1 plus récent QUE UN local horodaté → D1 gagne. Un local SANS majA
      // (état d'avant la Task 69-c, jamais persisté depuis) et NON VIDE :
      // l'appareil ACTIF a raison — son état réel part vers D1.
      const distantPlusRecent = majALocal !== null && majADistant >= majALocal;
      if (localVide || distantPlusRecent) {
        importerEtatDistant(id, etat, majADistant);
        nombre += 1;
      } else {
        // Le local est plus récent (répondu hors ligne) → rattrape D1.
        void pousserAvec(id, etatDe(id));
      }
    }
    // Rattrapage inverse : les quêtes RÉELLES de l'appareil (QUETE_IDS) qui
    // ne sont PAS encore sur le compte — les états d'avant la Task 69-c (un
    // voyageur existant qui vient de se connecter) — partent vers D1 une
    // fois pour toutes, sans attendre le prochain persiste.
    for (const id of QUETE_IDS) {
      if (connues.has(id)) continue;
      const e = etatDe(id);
      if (!etatVide(e)) {
        void pousserAvec(id, e);
      }
    }
  } catch {
    /* réseau absent — le local reste la vérité de session */
  }
  return nombre;
}
