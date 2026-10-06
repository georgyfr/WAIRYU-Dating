import { useEffect, useState } from 'react';
import Welcome from './screens/Welcome';
import Discover from './screens/Discover';
import Messages from './screens/Messages';
import Profile from './screens/Profile';
import Auth from './screens/Auth';
import FbComplete from './screens/FbComplete';
import OAuthComplete from './screens/OAuthComplete';
import ResetPassword from './screens/ResetPassword';
import TabBar, { type Tab } from './components/TabBar';
import PushToast from './components/PushToast';
import CongratsOverlay from './components/CongratsOverlay';
import { autoArmWebPush, getDeviceId, registerDeviceOpen } from './lib/push-client';
import { ApiError, fetchMe, linkDevice } from './lib/auth-client';

type Stage = 'welcome' | Tab;
/** Routes spéciales portées par le hash (OAuth, reset email, Meta). */
type Route =
  | { name: 'reset'; token: string }
  | { name: 'fb-complete' }
  | { name: 'oauth-complete'; via: 'google' | 'facebook' | null }
  | { name: 'default' };

/** Lit le hash de navigation : #/reset?t=…, #/fb-complete, #/oauth-complete?via=…, ou l'app. */
function readRoute(): Route {
  const hash = window.location.hash;
  if (hash.startsWith('#/reset')) {
    const token = new URLSearchParams(hash.split('?')[1] ?? '').get('t') ?? '';
    if (/^[0-9a-f]{64}$/.test(token)) return { name: 'reset', token };
  }
  if (hash.startsWith('#/fb-complete')) return { name: 'fb-complete' };
  if (hash.startsWith('#/oauth-complete')) {
    const via = new URLSearchParams(hash.split('?')[1] ?? '').get('via');
    return {
      name: 'oauth-complete',
      via: via === 'facebook' ? 'facebook' : via === 'google' ? 'google' : null,
    };
  }
  return { name: 'default' };
}

export default function App() {
  const [stage, setStage] = useState<Stage>('welcome');
  const [route, setRoute] = useState<Route>(() => readRoute());
  /** État de session : null = vérification en cours, false = déconnecté, true = connecté. */
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  /** Canal de la création de compte en cours ⇒ overlay félicitations (tous canaux). */
  const [congrats, setCongrats] = useState<string | null>(null);

  // Boot : enregistre l'ouverture de l'appareil (première ouverture ⇒ événement
  // + push de bienvenue) puis arme le push ; vérifie la session (cookie signé).
  useEffect(() => {
    void registerDeviceOpen();
    void autoArmWebPush();

    void fetchMe()
      .then(() => {
        setAuthenticated(true);
        // Session existante : (re)lie l'appareil au compte — cible des
        // notifications + félicitations en attente éventuelle.
        void linkDevice(getDeviceId()).catch(() => {});
      })
      .catch((e: unknown) => {
        if (e instanceof ApiError && e.status === 401) setAuthenticated(false);
        else setAuthenticated(false); // erreur réseau → écran d'auth, retentera
      });

    const onHash = () => setRoute(readRoute());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // Retour OAuth (#/?google=ok, #/?facebook=retry…) → message + nettoyage du hash.
  useEffect(() => {
    if (!window.location.hash.startsWith('#/?')) return;
    const params = new URLSearchParams(window.location.hash.split('?')[1] ?? '');
    const google = params.get('google');
    const facebook = params.get('facebook');
    const isOk = google === 'ok' || facebook === 'ok';
    const notice = isOk
      ? 'Connexion réussie — bienvenue !'
      : google === 'retry' || facebook === 'retry'
        ? 'La connexion sociale a été interrompue — réessayez, ou utilisez le code email.'
        : google === 'unverified'
          ? 'Cet email n\u2019est pas vérifié chez le fournisseur — utilisez le code email.'
          : google === 'cancelled' || facebook === 'cancelled'
            ? 'Connexion annulée.'
            : google === 'error' || facebook === 'error'
              ? params.get('msg') || 'La connexion sociale a échoué — réessayez, ou utilisez le code email.'
              : null;
    // Retour OAuth réussi : lie l'appareil au compte. Si le compte vient
    // d'être CRÉÉ (congrats_pending), l'overlay félicitations s'affiche —
    // sinon simple message de connexion.
    if (isOk) {
      void (async () => {
        try {
          const lr = await linkDevice(getDeviceId());
          if (lr.congrats) setCongrats(lr.congratsVia ?? 'email');
          else window.alert(notice);
        } catch {
          window.alert(notice);
        }
      })();
    } else if (notice) {
      window.alert(notice);
    }
    window.location.hash = '';
  }, []);

  const onAuthenticated = (congratsVia?: string | null) => {
    setAuthenticated(true);
    if (congratsVia) setCongrats(congratsVia);
    if (window.location.hash) window.location.hash = '';
  };

  /** Overlay félicitations — rendu au-dessus de TOUTES les vues authentifiées. */
  const congratsOverlay = congrats ? (
    <CongratsOverlay via={congrats} onClose={() => setCongrats(null)} />
  ) : null;

  // ---- Routes spéciales (hash) — indépendantes de la session ----
  if (route.name === 'reset') {
    return <ResetPassword token={route.token} onDone={onAuthenticated} />;
  }
  if (route.name === 'fb-complete') {
    return (
      <>
        <PushToast />
        <FbComplete onDone={onAuthenticated} />
        {congratsOverlay}
      </>
    );
  }
  if (route.name === 'oauth-complete') {
    return (
      <>
        <PushToast />
        <OAuthComplete via={route.via} onDone={onAuthenticated} />
        {congratsOverlay}
      </>
    );
  }

  // ---- Session en cours de vérification : écran d'accueil statique ----
  if (authenticated === null) {
    return (
      <div className="app-shell">
        <main className="welcome">
          <img src="/icons/icon-192.png" alt="Logo Wairyu" className="welcome-logo" />
          <h1>
            Wai<span className="accent">ryu</span>
          </h1>
          <p className="tagline">Chargement…</p>
        </main>
      </div>
    );
  }

  // ---- Déconnecté : écran d'accueil OU authentification ----
  if (!authenticated) {
    if (stage === 'welcome') {
      return <Welcome onStart={() => setStage('discover')} />;
    }
    return (
      <>
        <PushToast />
        <Auth onAuthenticated={onAuthenticated} />
      </>
    );
  }

  // ---- Connecté : app ----
  return (
    <>
      <PushToast />
      {congratsOverlay}
      <div className="app-shell">
        <header className="app-header">
          <img
            src="/icons/favicon-48.png"
            alt="Logo Wairyu — deux bulles de dialogue reliées"
            width={28}
            height={28}
          />
          <span className="brand">
            Wai<span className="brand-accent">ryu</span>
          </span>
        </header>
        {stage === 'discover' && <Discover />}
        {stage === 'messages' && <Messages />}
        {stage === 'profile' && <Profile />}
        <TabBar active={stage as Tab} onSelect={setStage} />
      </div>
    </>
  );
}
