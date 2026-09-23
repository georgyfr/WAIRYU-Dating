/**
 * wairyu — routeur SPA minimal (Étape 2).
 * Routes hash : #/ (accueil) · #/signup · #/login · #/verify?e=… · #/app (compte).
 * La session est détectée au chargement via /api/me (cookie httpOnly signé).
 */
import { useCallback, useEffect, useState } from 'react';
import { api } from './lib/api';
import { Signup } from './screens/Signup';
import { Login } from './screens/Login';
import { Verify } from './screens/Verify';
import { FacebookComplete } from './screens/FacebookComplete';
import { Account } from './screens/Account';
import type { AuthConfigResponse, HealthResponse, MeResponse } from '@wairyu/shared';

type Route =
  | { name: 'home'; notice?: string | null }
  | { name: 'signup' }
  | { name: 'login' }
  | { name: 'verify'; email: string; devCode?: string }
  | { name: 'fb-complete' }
  | { name: 'app' };

/** Message de retour après un parcours social (callback ?google= / ?facebook=). */
function parseNotice(params: URLSearchParams): string | null {
  if (params.get('google') === 'cancelled' || params.get('facebook') === 'cancelled') {
    return 'Connexion annulée — réessaie, ou utilise le code email.';
  }
  if (params.get('google') === 'unverified') {
    return "L'email de ce compte Google n'est pas vérifié chez Google — utilise le code email.";
  }
  if (params.get('facebook') === 'noemail') {
    return "Ce compte Facebook n'a pas d'email vérifié — utilise la méthode email.";
  }
  return null;
}

function parseHash(): Route {
  const hash = window.location.hash.replace(/^#\/?/, '');
  const [path, query] = hash.split('?');
  const params = new URLSearchParams(query ?? '');
  switch (path) {
    case 'signup':
      return { name: 'signup' };
    case 'login':
      return { name: 'login' };
    case 'verify': {
      const email = params.get('e') ?? '';
      if (!email) return { name: 'login' };
      const devCode = params.get('d') ?? undefined;
      return { name: 'verify', email, devCode };
    }
    case 'fb-complete':
      // Retour OAuth Facebook sans email exposé (callback → #/fb-complete) :
      // complétion email + rattachement de l'identité (FacebookComplete).
      return { name: 'fb-complete' };
    case 'app':
      return { name: 'app' };
    default:
      return { name: 'home', notice: parseNotice(params) };
  }
}

export default function App() {
  const [route, setRoute] = useState<Route>(() => parseHash());
  const [config, setConfig] = useState<AuthConfigResponse | null>(null);
  const [me, setMe] = useState<MeResponse | null>(null);
  const [checking, setChecking] = useState(true);
  const [apiOk, setApiOk] = useState<boolean | null>(null);

  useEffect(() => {
    const onHash = () => setRoute(parseHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    fetch('/api/health')
      .then((r) => setApiOk(r.ok))
      .catch(() => setApiOk(false));

    api<AuthConfigResponse>('/api/auth/config').then(setConfig).catch(() => null);

    // Session existante ? (cookie httpOnly — invisible au JS, seul l'API décide)
    api<MeResponse>('/api/me')
      .then((user) => setMe(user))
      .catch(() => setMe(null))
      .finally(() => setChecking(false));
  }, []);

  const go = useCallback((hash: string) => {
    window.location.hash = hash;
    setRoute(parseHash());
  }, []);

  const onLoggedOut = useCallback(() => {
    setMe(null);
    go('#/');
  }, [go]);

  // Session créée (OTP vérifié) : on recharge le profil puis on entre.
  const onAuthenticated = useCallback(() => {
    api<MeResponse>('/api/me')
      .then((user) => {
        setMe(user);
        go('#/app');
      })
      .catch(() => go('#/'));
  }, [go]);

  // L'écran compte exige une session ; si /api/me échoue → retour accueil.
  useEffect(() => {
    if (!checking && route.name === 'app' && !me) go('#/');
  }, [checking, route, me, go]);

  // ---- Rendu ----
  let content: JSX.Element;

  if (route.name === 'signup') {
    content = <Signup config={config} />;
  } else if (route.name === 'login') {
    content = <Login config={config} />;
  } else if (route.name === 'verify') {
    content = <Verify email={route.email} devCode={route.devCode} onAuthenticated={onAuthenticated} />;
  } else if (route.name === 'fb-complete') {
    content = <FacebookComplete config={config} onAuthenticated={onAuthenticated} />;
  } else if (route.name === 'app' && me) {
    content = <Account me={me} onLoggedOut={onLoggedOut} />;
  } else {
    // Accueil
    content = (
      <div className="app">
        <div className="logo">
          <span>w</span>
        </div>
        <h1>wairyu</h1>
        <p className="tagline">
          Rencontres sincères. Photos consenties, messages réels, matching explicable.
        </p>

        {route.name === 'home' && route.notice && <p className="error">{route.notice}</p>}

        {checking ? (
          <div className="status">
            <span className="dot" /> Chargement…
          </div>
        ) : me ? (
          <button type="button" className="btn primary" onClick={() => go('#/app')}>
            Continuer en tant que {me.displayName ?? me.email.split('@')[0]}
          </button>
        ) : (
          <div className="cta-row">
            <button type="button" className="btn primary" onClick={() => go('#/signup')}>
              Créer mon compte
            </button>
            <button type="button" className="btn ghost" onClick={() => go('#/login')}>
              J'ai déjà un compte
            </button>
          </div>
        )}

        {apiOk !== null && (
          <div className={`status ${apiOk ? 'ok' : 'err'}`}>
            <span className="dot" />
            {apiOk ? 'API connectée' : 'API injoignable — réessaie plus tard'}
          </div>
        )}

        <footer>
          Réservé aux 18 ans et plus.
          <br />
          Mode Classique &amp; mode Invisible — tes photos restent sous ton contrôle.
        </footer>
      </div>
    );
  }

  return <main className="app-shell">{content}</main>;
}

// Type utilitaire pour le DOM de santé (comme avant, conservé)
export type _Health = HealthResponse;
