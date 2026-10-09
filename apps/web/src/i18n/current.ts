/**
 * L'état de LANGUE — singleton module (HORS React).
 *
 * Pourquoi un singleton : les contenus des quêtes (quetes.ts, quete-X-Y.ts,
 * voyage.ts) sont des DONNÉES importées à la construction des modules — ils
 * se localisent UNE fois au chargement (voir apply.ts / avecEN). Le
 * changement de langue pose le choix dans localStorage puis RECHARGE la page :
 * tous les modules se reconstruisent dans la nouvelle langue. Simple,
 * robuste, zéro re-architecture des écrans.
 *
 * Détection au premier lancement (aucun choix stocké) :
 *  1. langue du navigateur — « fr* » → français, « en* » → anglais ;
 *  2. toute autre langue → français (la marque d'origine, repli naturel).
 */

export type Lang = 'fr' | 'en';

const CLE_LANG = 'wairyu.lang';

function detecterLang(): Lang {
  try {
    const stocke = window.localStorage.getItem(CLE_LANG);
    if (stocke === 'fr' || stocke === 'en') return stocke;
  } catch {
    /* stockage indisponible */
  }
  try {
    const nav = (navigator.language || 'fr').toLowerCase();
    if (nav.startsWith('en')) return 'en';
  } catch {
    /* navigator indisponible */
  }
  return 'fr';
}

let lang: Lang = detecterLang();

/** La langue courante (utilisée par les couches hors React : PDF, données). */
export const getLang = (): Lang => lang;

/** La langue détectée au tout premier lancement (avant tout stockage). */
export function langueInitialeDetectee(): Lang {
  try {
    const nav = (navigator.language || 'fr').toLowerCase();
    if (nav.startsWith('en')) return 'en';
  } catch {
    /* navigator indisponible */
  }
  return 'fr';
}

/** Pose la langue (stockage + singleton). Le rechargement est décidé par l'appelant. */
export function poserLang(l: Lang): void {
  lang = l;
  try {
    window.localStorage.setItem(CLE_LANG, l);
  } catch {
    /* stockage indisponible */
  }
  try {
    document.documentElement.lang = l;
  } catch {
    /* document indisponible */
  }
}
