/**
 * wairyu — routeur SPA (Étape 2, étendu après l'Étape 7).
 * Routes hash : #/ (accueil) · #/signup · #/login · #/verify?e=… ·
 * #/discover · #/matches · #/messages · #/myprofile (pages principales,
 * barre d'onglets permanente — expérience dating classique) ·
 * #/profile (assistant) · #/questionnaire · #/chat/:id · #/app (paramètres).
 * La session est détectée au chargement via /api/me (cookie httpOnly signé).
 *
 * Task 36 (demande fondateur — « des URLs spécifiques pour toutes les
 * pages ou onglets ») : CHAQUE page ET chaque onglet interne est désormais
 * adressable individuellement (deep link partageable) —
 *   #/discover/classique · #/discover/interracial · #/discover/invisible
 *   #/likes/tous · #/likes/likes · #/likes/supers
 * Les slugs historiques (#/discover, #/likes) restent canoniques et valables :
 * ils ouvrent la page dans son état par défaut, RIEN n'est supprimé.
 * Basculer un onglet interne met l'URL à jour via history.replaceState
 * (pas d'entrée d'historique — le bouton retour reste réservé aux pages).
 * Carte complète : docs/URLS.md.
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
import { Likes } from './screens/Likes';
import { Moments } from './screens/Moments';
import { Events } from './screens/Events';
import { MyEvents, type EvMineTab } from './screens/MyEvents';
import { CreateEvent } from './screens/CreateEvent';
import { Chat } from './screens/Chat';
import { Revelation } from './screens/Revelation';
import { Coach } from './screens/Coach';
import { TabBar, type TabId } from './components/TabBar';
import type { DiscoveryMode } from '@wairyu/shared';
import { ToastHost } from './lib/toast';
import { UpdateToast } from './components/UpdateToast'; // Task 44 : « Nouvelle version » — changements immédiats sans actualiser
import { getSharedMode, setSharedMode, resetSharedMode } from './lib/mode';
import { useEventsNav, setEventsNav, resetEventsNav } from './lib/events-mode';
import type {
  AuthConfigResponse,
  ConversationListResponse,
  HealthResponse,
  LikesMeResponse,
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
  | { name: 'discover'; mode?: DiscoveryMode }
  | { name: 'likes'; filter?: 'all' | 'like' | 'super' }
  | { name: 'matches' }
  | { name: 'messages' }
  | { name: 'moments' }
  | { name: 'myprofile' }
  | { name: 'revelation' }
  | { name: 'coach' }
  // Task 39 — univers événementiel « Wairyu Moments » (deep-linkable).
  | { name: 'events' }
  | { name: 'events-mine'; tab?: EvMineTab }
  | { name: 'events-create' }
  | { name: 'chat'; conversationId: string }
  | { name: 'app' };

/** Pages principales = onglets de la barre permanente. */
const TAB_ROUTES: Record<string, TabId> = {
  discover: 'discover',
  likes: 'likes',
  matches: 'matches',
  messages: 'messages',
  moments: 'moments',
  myprofile: 'profile',
  // Task 37 (menu Invisible) : centre de révélation + coach de conversation.
  revelation: 'revelation',
  coach: 'coach',
  // Task 39 (mode événementiel) : feed, billetterie, création.
  events: 'events',
  'events-mine': 'events-mine',
  'events-create': 'events-create',
};

/**
 * Task 36 — slugs d'onglets internes. Entrée : slugs français CANONIQUES
 * (classique · interracial · invisible / tous · likes · supers) + alias
 * anglais tolérés (classic, all, like, super) pour robustesse de partage.
 */
const DISCOVER_MODE_SLUGS: Record<string, DiscoveryMode> = {
  classique: 'classic',
  classic: 'classic',
  interracial: 'interracial',
  invisible: 'invisible',
};
const DISCOVER_MODE_TO_SLUG: Record<DiscoveryMode, string> = {
  classic: 'classique',
  interracial: 'interracial',
  invisible: 'invisible',
};
const LIKES_FILTER_SLUGS: Record<string, 'all' | 'like' | 'super'> = {
  tous: 'all',
  all: 'all',
  like: 'like',
  likes: 'like',
  super: 'super',
  supers: 'super',
};
const LIKES_FILTER_TO_SLUG: Record<'all' | 'like' | 'super', string> = {
  all: 'tous',
  like: 'likes',
  super: 'supers',
};

/**
 * Task 39 — slugs des onglets internes de Mes événements (#/events/mes/:tab).
 * Canonique français (a-venir · organises · passes · billets) + alias
 * anglais (upcoming · organized · past · tickets) pour partage robuste.
 */
const EV_MINE_SLUGS: Record<string, EvMineTab> = {
  'a-venir': 'upcoming',
  avenir: 'upcoming',
  upcoming: 'upcoming',
  organises: 'organized',
  organised: 'organized',
  organized: 'organized',
  passes: 'past',
  past: 'past',
  billets: 'tickets',
  tickets: 'tickets',
};
const EV_MINE_TO_SLUG: Record<EvMineTab, string> = {
  upcoming: 'a-venir',
  organized: 'organises',
  past: 'passes',
  tickets: 'billets',
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
  // Task 36 : le switch porte sur le PREMIER segment du chemin — les deep
  // links à sous-segment (#/discover/invisible, #/likes/supers) arrivent ici
  // comme « discover/invisible » ; l'ancien switch sur le chemin complet les
  // envoyait au default (accueil). Comportement des routes historiques
  // inchangé (elles sont mono-segment) ; #/chat/:id reste géré par le
  // default avec sa regex de validation.
  const [seg0, seg1, seg2] = (path ?? '').split('/');
  switch (seg0) {
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
    case 'discover': {
      // Étape 5 : découverte dual-mode (pile Classique + Invisible + Top du jour).
      // Task 36 : #/discover/:mode — deep link direct d'un onglet de mode.
      // Slug inconnu → découverte neutre (dégradation gracieuse, jamais 404).
      const mode = seg1 ? DISCOVER_MODE_SLUGS[seg1] : undefined;
      return { name: 'discover', mode: seg1 && !mode ? undefined : mode };
    }
    case 'likes': {
      // « Tu plais ! » — grille des likes reçus (onglet, enrichissement).
      // Task 36 : #/likes/:filtre — deep link direct d'un filtre (tous/likes/supers).
      const filter = seg1 ? LIKES_FILTER_SLUGS[seg1] : undefined;
      return { name: 'likes', filter: seg1 && !filter ? undefined : filter };
    }
    case 'matches':
      // Étape 5 : matchs + passerelle Classique → Invisible (onglet).
      return { name: 'matches' };
    case 'moments':
      // Wairyu Moments — aperçu des événements (onglet, teaser).
      return { name: 'moments' };
    case 'messages':
      // Boîte de réception (page Messages — expérience dating classique).
      return { name: 'messages' };
    case 'myprofile':
      // Mon profil consultable + accès modification/paramètres (onglet).
      return { name: 'myprofile' };
    case 'revelation':
      // Task 37 (menu Invisible) : centre du rituel de révélation consentie
      // (15 messages / 7 jours / accord des deux — spec §4.6).
      return { name: 'revelation' };
    case 'coach':
      // Task 37 (menu Invisible) : coach de conversation (aperçu — Phase 2).
      return { name: 'coach' };
    case 'events': {
      // Task 39 — univers événementiel « Wairyu Moments » :
      //   #/events · #/events/mes/:tab · #/events/creer
      // (alias : mine → mes, create/nouveau → creer). Slug inconnu → feed
      // d'événements (dégradation gracieuse, jamais 404).
      if (seg1 === 'mes' || seg1 === 'mine') {
        const tab = seg2 ? EV_MINE_SLUGS[seg2] : undefined;
        return { name: 'events-mine', tab: seg2 && !tab ? undefined : tab };
      }
      if (seg1 === 'creer' || seg1 === 'create' || seg1 === 'nouveau') {
        return { name: 'events-create' };
      }
      return { name: 'events' };
    }
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
  // Task 39 : contexte événementiel (hook inconditionnel — règles des hooks).
  const eventsNav = useEventsNav();

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

  // Badge de l'onglet Likes : même mécanique que Messages — le cache est
  // PARTAGÉ avec la page Likes et la page Découvrir (une seule requête).
  const { data: likesData, refresh: refreshLikes } = useSwr<LikesMeResponse>(
    'likes-me',
    !!me,
    { ttlMs: 60_000 },
  );
  const likesCount = likesData?.count ?? 0;

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

  // Task 36 : synchronise l'URL avec un onglet INTERNE (mode de Découvrir,
  // filtre de Likes) via history.replaceState — l'URL reste partageable mais
  // n'empile PAS l'historique : le bouton retour continue de revenir à la
  // PAGE précédente, pas au mode/filtre d'avant (comportement tab-like).
  const syncHash = useCallback((hash: string) => {
    history.replaceState(null, '', hash);
    setRoute(parseHash());
  }, []);

  // Task 45 (demande fondateur : « les onglets de chaque mode n'ont pas d'URL
  // appropriées ») : les MODES de Découvrir ont maintenant de VRAIES URLs
  // navigables — pushState (au lieu du replaceState tab-like de Task 36) :
  // chaque bascule crée une entrée d'historique, le bouton retour revient au
  // mode précédent (l'effet URL Task 36 rejoue la bascule réelle), et l'URL
  // de chaque onglet est partageable telle quelle. Le dédoublonnage évite
  // les entrées jumelles quand onModeChange suit le clic sur la pastille.
  // syncHash (replaceState) reste en place pour les filtres/fils internes
  // (Likes, Mes events) — décision Task 36 documentée, hors périmètre.
  const pushHash = useCallback((hash: string) => {
    if (window.location.hash !== hash) window.history.pushState(null, '', hash);
    setRoute(parseHash());
  }, []);

  const onLoggedOut = useCallback(() => {
    clearSwr(); // aucune donnée de l'ancien compte ne doit survivre (Task 28)
    resetSharedMode(); // ni son mode — la sidebar repart neutre (Task 35)
    resetEventsNav(); // ni le contexte événementiel (Task 39)
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

  // Thème « dark premium » (Task 31 — référence fondateur) : les pages de
  // l'expérience dating (onglets + chat) basculent le body en thème sombre ;
  // les écrans utilitaires (accueil, inscription, questionnaire, paramètres)
  // conservent le thème clair historique.
  useEffect(() => {
    const dark =
      route.name === 'discover' ||
      route.name === 'likes' ||
      route.name === 'matches' ||
      route.name === 'messages' ||
      route.name === 'moments' ||
      route.name === 'myprofile' ||
      route.name === 'revelation' ||
      route.name === 'coach' ||
      route.name === 'chat' ||
      route.name === 'events' ||
      route.name === 'events-mine' ||
      route.name === 'events-create';
    document.body.classList.toggle('theme-dark', dark);
    return () => document.body.classList.remove('theme-dark');
  }, [route.name]);

  // Pages principales + chat : session requise également.
  useEffect(() => {
    if (
      !checking &&
      (route.name === 'discover' ||
        route.name === 'likes' ||
        route.name === 'matches' ||
        route.name === 'messages' ||
        route.name === 'moments' ||
        route.name === 'myprofile' ||
        route.name === 'revelation' ||
        route.name === 'coach' ||
        route.name === 'chat' ||
        route.name === 'events' ||
        route.name === 'events-mine' ||
        route.name === 'events-create') &&
      !me
    )
      go('#/');
  }, [checking, route, me, go]);

  // Task 39 : toute route événementielle active le CONTEXTE Moments
  // (navigation turquoise 4 onglets + « + », identité body.events-mode).
  // Le contexte SURVIT à la sortie de l'univers (Profil partagé…) jusqu'à
  // la bascule explicite « mode rencontre » (badge des écrans events) ou
  // la fin de session — comme le prototype (badge = basculer de mode).
  useEffect(() => {
    if (route.name === 'events' || route.name === 'events-mine' || route.name === 'events-create') {
      setEventsNav(true);
    }
  }, [route.name]);

  // Task 35 (demande fondateur — sidebar différenciée par mode) : le mode
  // est une propriété du PROFIL, pas de la page Discover. À l'ouverture de
  // session, si aucun écran ne l'a déjà posé (Discover monte en parallèle
  // et appelle aussi setSharedMode — premier arrivé gagne, mêmes données),
  // on le charge ici pour que la barre latérale porte la bonne identité
  // sur TOUS les onglets (Likes, Matchs, Messages, Moments, Profil, Chat).
  useEffect(() => {
    if (!me || getSharedMode() !== null) return;
    api<{ preferences: { modeDefault: 'classic' | 'invisible' | 'interracial' } | null }>(
      '/api/profile',
    )
      .then((prof) => setSharedMode(prof.preferences?.modeDefault ?? 'classic'))
      .catch(() => null); // échec réseau : Discover/Profil reposeront le mode
  }, [me]);

  // Badge : polling léger 30 s (onglet visible) — conversations ET likes.
  // Les refresh sont dédupliqués et bridés côté cache — plus de requête à
  // chaque changement de page.
  useEffect(() => {
    if (!me) return;
    const id = window.setInterval(() => {
      if (document.visibilityState === 'visible') {
        refreshConv();
        refreshLikes();
      }
    }, 30_000);
    return () => window.clearInterval(id);
  }, [me, refreshConv, refreshLikes]);

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
    content = (
      <Discover
        onMatches={() => go('#/matches')}
        initialMode={route.mode}
        onModeChange={(m) => pushHash(`#/discover/${DISCOVER_MODE_TO_SLUG[m]}`)}
        onMoments={() => go('#/events')}
      />
    );
  } else if (route.name === 'likes' && me) {
    content = (
      <Likes
        onOpenChat={(id) => go(`#/chat/${id}`)}
        initialFilter={route.filter}
        onFilterChange={(f) => syncHash(`#/likes/${LIKES_FILTER_TO_SLUG[f]}`)}
      />
    );
  } else if (route.name === 'matches' && me) {
    content = <Matches onOpenChat={(id) => go(`#/chat/${id}`)} />;
  } else if (route.name === 'moments' && me) {
    content = (
      <Moments
        onExploreEvents={() => go('#/events')}
        onBackToDating={() => {
          setEventsNav(false);
          go('#/discover');
        }}
        onDatingMode={(m) => {
          setEventsNav(false);
          go(`#/discover/${DISCOVER_MODE_TO_SLUG[m]}`);
        }}
      />
    );
  } else if (route.name === 'events' && me) {
    // Task 39 — feed d'événements « Wairyu Moments ».
    content = (
      <Events
        onCreate={() => go('#/events/creer')}
        onBackToDating={() => {
          setEventsNav(false);
          go('#/discover');
        }}
        onDatingMode={(m) => {
          setEventsNav(false);
          go(`#/discover/${DISCOVER_MODE_TO_SLUG[m]}`);
        }}
      />
    );
  } else if (route.name === 'events-mine' && me) {
    content = (
      <MyEvents
        initialTab={route.tab}
        onTabChange={(t) => syncHash(`#/events/mes/${EV_MINE_TO_SLUG[t]}`)}
        onDiscover={() => go('#/events')}
        onCreate={() => go('#/events/creer')}
        onBackToDating={() => {
          setEventsNav(false);
          go('#/discover');
        }}
        onDatingMode={(m) => {
          setEventsNav(false);
          go(`#/discover/${DISCOVER_MODE_TO_SLUG[m]}`);
        }}
      />
    );
  } else if (route.name === 'events-create' && me) {
    content = (
      <CreateEvent
        onPublished={() => go('#/events/mes/organises')}
        onBack={() => go('#/events')}
        onBackToDating={() => {
          setEventsNav(false);
          go('#/discover');
        }}
      />
    );
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
  } else if (route.name === 'revelation' && me) {
    // Task 37 (menu Invisible) : centre du rituel de révélation consentie.
    content = (
      <Revelation
        onOpenChat={(id) => go(`#/chat/${id}`)}
        onExplore={() => go('#/discover/invisible')}
      />
    );
  } else if (route.name === 'coach' && me) {
    // Task 37 (menu Invisible) : coach de conversation (aperçu).
    content = <Coach onExplore={() => go('#/discover/invisible')} onMessages={() => go('#/messages')} />;
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

  // Barre d'onglets permanente sur les pages principales (session requise).
  // Task 39 : sur #/moments, l'onglet actif dépend du contexte — « Moments »
  // de la nav dating OU « Moments » de la nav événementielle.
  let activeTab = TAB_ROUTES[route.name];
  if (route.name === 'moments' && eventsNav) activeTab = 'events-moments';
  return (
    <main className={`app-shell ${activeTab && me ? 'tabpage' : ''}`}>
      {content}
      {activeTab && me && (
        <TabBar active={activeTab} unread={unread} likes={likesCount} onGo={go} />
      )}
      <ToastHost />
      <UpdateToast />
    </main>
  );
}

// Type utilitaire pour le DOM de santé (comme avant, conservé)
export type _Health = HealthResponse;
