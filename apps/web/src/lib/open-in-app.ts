/**
 * Task 60-URL (demande fondateur : « assure-toi que l'URL ne soit plus
 * visible ») — bascule automatique navigateur → application Android.
 *
 * Principe : au premier chargement sur un Android (app PAS déjà standalone),
 * on remplace l'URL courante par un intent:// qui cible com.wairyu.app —
 * l'app installée s'ouvre SANS barre d'adresse. Si l'app n'est pas installée,
 * Android suit S.browser_fallback_url (l'URL d'origine) : zéro régression.
 *
 * Garde-fous (une seule tentative par session — un intent qui échoue en
 * boucle ferait une page fantôme) :
 *  - déjà standalone / minimal-ui / fullscreen → ne rien faire ;
 *  - pas Android → ne rien faire ;
 *  - ?noappopen=1 (n'importe où dans la query ou le hash) → ne rien faire
 *    (lien de secours pour les smokes E2E et le débogage) ;
 *  - page /app (la page d'installation elle-même) → ne rien faire ;
 *  - sessionStorage « wairyu_intent_tried » déjà posé → ne rien faire.
 */

const INTENT_TRIED_KEY = 'wairyu_intent_tried';
const ANDROID_PACKAGE = 'com.wairyu.app';

/** L'app s'exécute-t-elle DÉJÀ comme application installée (pas de barre) ? */
export function isStandalone(): boolean {
  try {
    if (
      window.matchMedia &&
      (window.matchMedia('(display-mode: standalone)').matches ||
        window.matchMedia('(display-mode: fullscreen)').matches ||
        window.matchMedia('(display-mode: minimal-ui)').matches)
    ) {
      return true;
    }
    // iOS Safari : champ non standard, true quand « ajoutée à l'écran d'accueil ».
    if ((navigator as Navigator & { standalone?: boolean }).standalone === true) return true;
  } catch {
    /* bénin */
  }
  return false;
}

/** User-Agent Android (et pas iOS déguisé) ? */
function isAndroid(): boolean {
  try {
    const ua = navigator.userAgent || '';
    return /Android/i.test(ua) && !/iPhone|iPad|iPod/i.test(ua);
  } catch {
    return false;
  }
}

/**
 * Tente la bascule intent:// — true si la navigation est PARTIE (la page
 * actuelle va être remplacée), false si rien n'a été tenté.
 * À appeler UNE fois au boot de la SPA, avant le premier rendu utile.
 */
export function openInAppIfEligible(): boolean {
  try {
    if (
      isStandalone() ||
      !isAndroid() ||
      /[?&]noappopen=1/.test(window.location.search) ||
      window.location.hash.includes('noappopen') ||
      window.location.pathname === '/app' ||
      window.location.pathname.endsWith('/app.html') ||
      sessionStorage.getItem(INTENT_TRIED_KEY) === '1'
    ) {
      return false;
    }
    sessionStorage.setItem(INTENT_TRIED_KEY, '1');
    const current = window.location.href;
    const withoutScheme = current.replace(/^https?:\/\//, '');
    const fallback = encodeURIComponent(current);
    const intent = `intent://${withoutScheme}#Intent;scheme=https;package=${ANDROID_PACKAGE};S.browser_fallback_url=${fallback};end`;
    window.location.replace(intent);
    return true;
  } catch {
    return false;
  }
}
