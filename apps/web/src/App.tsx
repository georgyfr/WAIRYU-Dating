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
import Voyage from './screens/Voyage';
import PushToast from './components/PushToast';
import CongratsOverlay from './components/CongratsOverlay';
import { autoArmWebPush, fetchEvents, getDeviceId, registerDeviceOpen } from './lib/push-client';
import { ApiError, fetchMe, linkDevice } from './lib/auth-client';
import type { MeResponse, PushEventRow } from '@wairyu/shared';

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
  /** Profil de la session (prénom pour le bonjour de l'en-tête). */
  const [me, setMe] = useState<MeResponse | null>(null);
  /** Journal in-app (cloche de l'en-tête). */
  const [events, setEvents] = useState<PushEventRow[]>([]);
  const [bellOpen, setBellOpen] = useState(false);

  // Boot : enregistre l'ouverture de l'appareil (première ouverture ⇒ événement
  // + push de bienvenue) puis arme le push ; vérifie la session (cookie signé).
  useEffect(() => {
    void registerDeviceOpen();
    void autoArmWebPush();

    void fetchMe()
      .then((u) => {
        setMe(u);
        setAuthenticated(true);
        // Session existante : (re)lie l'appareil au compte — cible des
        // notifications. Si une félicitations est EN ATTENTE (création dont
        // la liaison avait échoué — ex. 2ᵉ compte sur le même appareil avant
        // le correctif rebind), l'overlay s'affiche à cette ouverture ; la
        // bulle OS part par ailleurs (force:true côté serveur).
        void linkDevice(getDeviceId())
          .then((lr) => {
            if (lr.congrats) setCongrats(lr.congratsVia ?? 'email');
          })
          .catch(() => {});
      })
      .catch((e: unknown) => {
        if (e instanceof ApiError && e.status === 401) setAuthenticated(false);
        else setAuthenticated(false); // erreur réseau → écran d'auth, retentera
      });

    const onHash = () => setRoute(readRoute());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // Connecté : charge le journal in-app (badge + panneau de la cloche).
  useEffect(() => {
    if (authenticated !== true) return;
    void fetchEvents()
      .then((r) => setEvents(r?.events ?? []))
      .catch(() => setEvents([]));
  }, [authenticated]);

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
    // L'ACCUEIL EST LE VOYAGE : après une inscription/connexion, on repart
    // sur 'welcome' ⇒ la vue connectée résout vers le Voyage (jamais
    // Découvrir, même si le parcours passait par « Commencer »).
    setStage('welcome');
    setAuthenticated(true);
    // Recharge le profil pour le bonjour de l'en-tête (post-inscription, le
    // boot l'avait obtenu en 401 — me était resté null).
    void fetchMe()
      .then(setMe)
      .catch(() => {});
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

  // ---- Connecté : app — L'ACCUEIL EST LE VOYAGE (demande fondateur) ----
  const view: Tab = stage === 'welcome' ? 'voyage' : (stage as Tab);
  const rawName = (me?.displayName ?? '').trim() || (me?.username ?? '').trim();
  const firstName = (rawName.split(/\s+/)[0] || 'Voyageur').slice(0, 14);
  const initial = firstName.charAt(0).toUpperCase();
  const badge = Math.min(events.length, 9);
  return (
    <>
      <PushToast />
      {congratsOverlay}
      <div className="app-shell">
        <header className="app-header">
          <div className="ah-brand">
            <img
              src="/icons/favicon-48.png"
              alt="Logo Wairyu — deux bulles de dialogue reliées"
              width={38}
              height={38}
              className="ah-logo"
            />
            <div className="ah-brand-text">
              <span className="brand">
                Wai<span className="brand-accent">ryu</span>
              </span>
              <span className="ah-tagline">
                Apprendre aujourd’hui,
                <br />
                explorer demain
              </span>
            </div>
          </div>
          <div className="ah-right">
            <button
              type="button"
              className="ah-bell"
              aria-label={badge > 0 ? `Notifications (${badge} nouvelles)` : 'Notifications'}
              aria-expanded={bellOpen}
              aria-haspopup="dialog"
              onClick={() => setBellOpen((v) => !v)}
            >
              <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              {badge > 0 && <span className="ah-badge">{badge}</span>}
            </button>
            <button type="button" className="ah-user" onClick={() => setStage('profile')} aria-label="Ouvrir mon profil">
              <span className="ah-avatar" aria-hidden="true">
                {initial}
              </span>
              <span className="ah-hello">
                <small>Bonjour,</small>
                <strong>{firstName}</strong>
              </span>
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="ah-chev">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
          </div>
          {bellOpen && (
            <>
              <button
                type="button"
                className="ah-overlay"
                aria-label="Fermer les notifications"
                onClick={() => setBellOpen(false)}
              />
              <div className="ah-panel" role="dialog" aria-label="Notifications récentes">
                <h3>Notifications</h3>
                {events.length === 0 ? (
                  <p className="ah-empty">Rien pour le moment — tes notifications apparaîtront ici.</p>
                ) : (
                  events.slice(0, 8).map((ev) => (
                    <div key={ev.id} className="ah-ev">
                      <strong>{ev.title}</strong>
                      <p>{ev.body}</p>
                      <time dateTime={ev.createdAt}>
                        {new Date(ev.createdAt).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </time>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </header>
        {view === 'voyage' && <Voyage onDiscover={() => setStage('discover')} />}
        {view === 'discover' && <Discover />}
        {view === 'messages' && <Messages />}
        {view === 'profile' && <Profile />}
        <TabBar active={view} onSelect={setStage} />
      </div>
    </>
  );
}
