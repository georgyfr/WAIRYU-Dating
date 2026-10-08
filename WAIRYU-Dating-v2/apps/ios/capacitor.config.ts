/**
 * Configuration Capacitor — WAIRYU Dating (application iOS).
 *
 * ATTENTION — webDir :
 * Le répertoire www/ doit contenir le build statique de la PWA (sortie de
 * `vite build` du workspace apps/web), copié AVANT tout `npx cap sync ios`.
 * Capacitor embarque ces fichiers dans le bundle iOS (WebView locale) :
 * une webDir vide ou périmée produit une app blanche ou dépassée.
 *
 * Séquence de build (macOS uniquement, voir README.md du même dossier) :
 *   1. cd apps/web && npm run build                 -> apps/web/dist
 *   2. rm -rf www && mkdir -p www && cp -r ../web/dist/* www/
 *   3. npx cap sync ios
 *   4. npx cap open ios
 *
 * Le projet Xcode natif (ios/App) est généré par `npx cap add ios` sur
 * macOS ; il ne peut pas être produit sous Linux.
 */
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  // Même identifiant que la TWA Android : un seul produit « WAIRYU » par store.
  appId: 'com.wairyu.app',
  appName: 'WAIRYU',
  webDir: 'www',
  ios: {
    // Capacitor 6 : iOS 13 minimum. iOS 10-12 restent servis par la PWA web
    // (notifications in-app + email) — voir docs/compatibilite-anciens-appareils.md.
    minimumVersion: '13.0',
  },
  plugins: {
    PushNotifications: {
      // Affichage des notifications en premier plan (badge, son, bannière).
      presentationOptions: ['badge', 'sound', 'alert'],
    },
  },
  server: {
    // Aucun trafic en clair : tout passe en HTTPS (cohérent avec l'ATS Apple,
    // actif par défaut). Le Worker de prod est en HTTPS :
    // https://wairyu.wairyu.workers.dev
    cleartext: false,
  },
};

export default config;
