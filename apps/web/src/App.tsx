/**
 * wairyu — routeur SPA (Étape 2, étendu après l'Étape 7).
 * Routes hash : #/ (accueil) · #/signup · #/login · #/verify?e=… ·
 * #/discover · #/matches · #/messages · #/myprofile (pages principales,
 * barre d'onglets permanente — expérience dating classique) ·
 * #/profile (assistant) · #/questionnaire · #/chat/:id · #/app (paramètres).
 * La session est détectée au chargement via /api/me (cookie httpOnly signé).
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { api } from './lib/api';
import { useSwr, clearSwr } from './lib/swr';
import { Signup } from './screens/Signup';
import { Login } from './screens/Login';
import { Verify } from './screens/Verify';
import { FacebookComplete } from './screens/FacebookComplete';
import { Account } from './screens/Account';
import { Profile } from './screens/Profile';
import { Questionnaire } from './screens/Questionnaire';
import { Discover } from './screens/Discover';
import { Matches } from './screens/Matches';
import { Messages } from './screens/Messages';
import { MyProfile } from './screens/MyProfile';
import { Chat } from './screens/Chat';
import { TabBar, type TabId } from './components/TabBar';
import type {
  AuthConfigResponse,
  ConversationListResponse,
  HealthResponse,
  MeResponse,
} from '@wairyu/shared';

type Route =
  | { name: 'home'; notice?: string | null }
  | { name: 'signup' }
  | { name: 'login' }
  | { name: 'verify'; email: string; devCode?: string }
  | { name: 'fb-complete' }
  | { name: 'profile' }
  | { name: 'questionnaire' }
  | { name: 'discover' }
  | { name: 'matches' }
  | { name: 'messages' }
  | { name: 'myprofile' }
  | { name: 'chat'; conversationId: string }
  | { name: 'app' };

/** Pages principales = onglets de la barre permanente. */
const TAB_ROUTES: Record<string, TabId> = {
  discover: 'discover',
  matches: 'matches',
  messages: 'messages',
  myprofile: 'profile',
};

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
    case 'profile':
      // Étape 3 : assistant profil & photos protégées.
      return { name: 'profile' };
    case 'questionnaire':
      // Étape 4 : questionnaire progressif.
      return { name: 'questionnaire' };
    case 'discover':
      // Étape 5 : découverte dual-mode (pile Classique + Invisible + Top du jour).
      return { name: 'discover' };
    case 'matches':
      // Étape 5 : matchs + passerelle Classique → Invisible (onglet).
      return { name: 'matches' };
    case 'messages':
      // Boîte de réception (page Messages — expérience dating classique).
      return { name: 'messages' };
    case 'myprofile':
      // Mon profil consultable + accès modification/paramètres (onglet).
      return { name: 'myprofile' };
    case 'app':
      return { name: 'app' };
    default: {
      // Étape 6 : #/chat/:conversationId — chat temps réel d'une conversation.
      const chatMatch = (path ?? '').match(/^chat\/([0-9a-f-]{16,64})$/i);
      if (chatMatch) return { name: 'chat', conversationId: chatMatch[1]! };
      return { name: 'home', notice: parseNotice(params) };
    }
  }
}

export default function App() {
  const [route, setRoute] = useState<Route>(() => parseHash());
  const [config, setConfig] = useState<AuthConfigResponse | null>(null);
  const [me, setMe] = useState<MeResponse | null>(null);
  const [checking, setChecking] = useState(true);
  const [apiOk, setApiOk] = useState<boolean | null>(null);

  // Badge de l'onglet Messages : le cache SWR est PARTAGÉ avec la page
  // Messages — une seule requête réseau sert le badge ET la page, et les
  // revalidations de l'une mettent à jour l'autre instantanément (Task 28).
  const { data: convData, refresh: refreshConv } = useSwr<ConversationListResponse>(
    'conversations',
    !!me,
    { ttlMs: 30_000 },
  );
  const unread = useMemo(
    () => convData?.conversations.reduce((n, cv) => n + cv.unread, 0) ?? 0,
    [convData],
  );

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
    clearSwr(); // aucune donnée de l'ancien compte ne doit survivre (Task 28)
    setMe(null);
    go('#/');
  }, [go]);

  // Session créée (OTP vérifié) : profil incomplet → assistant ; sinon découverte
  // (l'accueil d'une app de rencontre, c'est la découverte — jamais les réglages).
  const onAuthenticated = useCallback(() => {
    api<MeResponse>('/api/me')
      .then((user) => {
        setMe(user);
        go(user.profileComplete ? '#/discover' : '#/profile');
      })
      .catch(() => go('#/'));
  }, [go]);

  // Les écrans compte ET profil exigent une session ; si /api/me échoue → accueil.
  useEffect(() => {
    if (!checking && (route.name === 'app' || route.name === 'profile') && !me) go('#/');
  }, [checking, route, me, go]);

  // Pages principales + chat : session requise également.
  useEffect(() => {
    if (
      !checking &&
      (route.name === 'discover' ||
        route.name === 'matches' ||
        route.name === 'messages' ||
        route.name === 'myprofile' ||
        route.name === 'chat') &&
      !me
    )
      go('#/');
  }, [checking, route, me, go]);

  // Badge : polling léger 30 s (onglet visible). Le refresh est dédupliqué
  // et bridé côté cache — plus de requête à chaque changement de page.
  useEffect(() => {
    if (!me) return;
    const id = window.setInterval(() => {
      if (document.visibilityState === 'visible') refreshConv();
    }, 30_000);
    return () => window.clearInterval(id);
  }, [me, refreshConv]);

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
  } else if (route.name === 'profile' && me) {
    content = <Profile onDone={() => go('#/myprofile')} />;
  } else if (route.name === 'questionnaire' && me) {
    content = (
      <Questionnaire
        onDone={() => go('#/myprofile')}
        onDiscover={() => go('#/discover')}
      />
    );
  } else if (route.name === 'discover' && me) {
    content = <Discover onMatches={() => go('#/matches')} />;
  } else if (route.name === 'matches' && me) {
    content = <Matches onOpenChat={(id) => go(`#/chat/${id}`)} />;
  } else if (route.name === 'messages' && me) {
    content = (
      <Messages onOpenChat={(id) => go(`#/chat/${id}`)} onDiscover={() => go('#/discover')} />
    );
  } else if (route.name === 'myprofile' && me) {
    content = (
      <MyProfile
        onEdit={() => go('#/profile')}
        onSettings={() => go('#/app')}
        onQuestionnaire={() => go('#/questionnaire')}
      />
    );
  } else if (route.name === 'chat' && me) {
    content = <Chat conversationId={route.conversationId} onBack={() => go('#/messages')} />;
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
          <button type="button" className="btn primary" onClick={() => go('#/discover')}>
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
          Modes Classique, Invisible &amp; Interracial — tes photos restent sous ton contrôle.
        </footer>
      </div>
    );
  }

  // Barre d'onglets permanente sur les 4 pages principales (session requise).
  const activeTab = TAB_ROUTES[route.name];
  return (
    <main className={`app-shell ${activeTab && me ? 'tabpage' : ''}`}>
      {content}
      {activeTab && me && <TabBar active={activeTab} unread={unread} onGo={go} />}
    </main>
  );
}

// Type utilitaire pour le DOM de santé (comme avant, conservé)
export type _Health = HealthResponse;
