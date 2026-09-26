/**
 * Détection de nouvelle version déployée (Task 44 — changements immédiats).
 *
 * Le constat fondateur : après un déploiement, l'onglet ouvert continue de
 * tourner sur l'ancienne version jusqu'à un rechargement manuel. Les en-têtes
 * HTTP sont pourtant déjà corrects (_headers + Workers Assets : HTML
 * revalidé à chaque chargement, assets hashés immutables) — mais une SPA
 * ouverte ne relit JAMAIS le HTML d'elle-même, donc elle ignore qu'une
 * nouvelle version existe.
 *
 * Principe : le HTML servi référence toujours les noms hashés des bundles du
 * déploiement courant (index-XXXX.js / index-XXXX.css). On capture la
 * signature des bundles CHARGÉS (DOM), on relit périodiquement le HTML
 * DÉPLOYÉ (cache: no-store) et on compare. Différence → UpdateToast propose
 * « Recharger » : un clic, sans F5, sans cache-buster, sans fermer l'app.
 *
 * Volontairement léger et silencieux : 1 requête HTML minuscule au retour
 * d'onglet + 1 par minute maximum (uniquement onglet visible), aucune erreur
 * remontée (réseau absent, HTML non conforme → « pas de mise à jour »).
 * En dev Vite il n'y a pas d'/assets/ hashés → les deux signatures sont
 * vides → veille naturellement inactive.
 */

const CHECK_MIN_INTERVAL_MS = 30_000;
const FIRST_CHECK_DELAY_MS = 45_000;
const POLL_INTERVAL_MS = 60_000;

/** Noms des bundles hashés référencés (chemins relatifs /assets/…). */
const ASSET_RE = /\/assets\/[A-Za-z0-9_-]+\.(?:js|css)/g;

let lastCheck = 0;
let inFlight = false;

/** Signature des bundles actuellement chargés (script/link du DOM). */
export function loadedBundles(): string[] {
  const names = new Set<string>();
  document.querySelectorAll('script[src], link[href]').forEach((el) => {
    const url = el.getAttribute('src') || el.getAttribute('href') || '';
    const m = url.match(ASSET_RE);
    if (m) m.forEach((n) => names.add(n));
  });
  return [...names].sort();
}

/** Signature des bundles référencés par le HTML déployé en ce moment. */
export async function deployedBundles(): Promise<string[] | null> {
  try {
    const res = await fetch(`/?uv=${Date.now()}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const html = await res.text();
    return [...new Set(html.match(ASSET_RE) || [])].sort();
  } catch {
    return null;
  }
}

/**
 * Compare chargé vs déployé. Retourne true si un nouveau déploiement est
 * en ligne. force=true ignore le throttle (retour d'onglet / recette E2E).
 */
export async function checkForUpdate(force = false): Promise<boolean> {
  if (inFlight) return false;
  const now = Date.now();
  if (!force && now - lastCheck < CHECK_MIN_INTERVAL_MS) return false;
  lastCheck = now;
  inFlight = true;
  try {
    const loaded = loadedBundles();
    const deployed = await deployedBundles();
    if (!deployed || deployed.length === 0 || loaded.length === 0) return false;
    return loaded.join('|') !== deployed.join('|');
  } finally {
    inFlight = false;
  }
}

/**
 * Démarre la veille : premier contrôle après 45 s, puis à chaque retour
 * d'onglet / focus (forcé) et toutes les minutes (throttlé), onglet visible
 * uniquement. Retourne la fonction d'arrêt (pour le cleanup React).
 *
 * Un hook window.__wairyuCheckUpdate() (contrôle forcé) est exposé pour la
 * recette E2E — supprimé au nettoyage du polling.
 */
export function startUpdatePolling(onUpdate: () => void): () => void {
  let stopped = false;
  const run = (force = false) => {
    if (stopped || document.visibilityState !== 'visible') return;
    void checkForUpdate(force).then((up) => {
      if (up) onUpdate();
    });
  };
  const t1 = window.setTimeout(() => run(), FIRST_CHECK_DELAY_MS);
  const t2 = window.setInterval(() => run(), POLL_INTERVAL_MS);
  const onVis = () => {
    if (document.visibilityState === 'visible') run(true);
  };
  document.addEventListener('visibilitychange', onVis);
  window.addEventListener('focus', onVis);
  (window as unknown as Record<string, unknown>).__wairyuCheckUpdate = () => run(true);
  return () => {
    stopped = true;
    window.clearTimeout(t1);
    window.clearInterval(t2);
    document.removeEventListener('visibilitychange', onVis);
    window.removeEventListener('focus', onVis);
    delete (window as unknown as Record<string, unknown>).__wairyuCheckUpdate;
  };
}
