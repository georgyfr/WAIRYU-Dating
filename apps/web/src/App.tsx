import { useEffect, useState } from 'react';
import Welcome from './screens/Welcome';
import Voyage from './screens/Voyage';
import Mondes from './screens/Mondes';
import Parcourus from './screens/Parcourus';
import Recolte from './screens/Recolte';
import Portrait from './screens/Portrait';
import Rencontres from './screens/Rencontres';
import Masque from './screens/Masque';
import Quete from './screens/Quete';
import Auth from './screens/Auth';
import FbComplete from './screens/FbComplete';
import OAuthComplete from './screens/OAuthComplete';
import ResetPassword from './screens/ResetPassword';
import TabBar, { type Tab } from './components/TabBar';
import PushToast from './components/PushToast';
import CongratsOverlay from './components/CongratsOverlay';
import { autoArmWebPush, fetchEvents, getDeviceId, registerDeviceOpen } from './lib/push-client';
import {
  ApiError,
  deleteAccount,
  exportAccount,
  fetchMe,
  linkDevice,
  logout,
} from './lib/auth-client';
import { lireEtatQuete, useEtatQuete, type EtatQuete } from './lib/quete-state';
import { QUETE_IDS, type IdQuete } from './lib/quetes';
import { useI18n } from './i18n/I18nProvider';
import { DEVISES, type CurrencyCode } from './i18n/currency';
import type { Lang } from './i18n/current';
import type { MeResponse, PushEventRow } from '@wairyu/shared';

/**
 * L'app À CE NIVEAU est 100 % Voyage : les 5 onglets Voyage · Mondes · Quête ·
 * Parcourus · Récolte ; les espaces dating (#/decouvrir, #/messages, #/profil)
 * sont MASQUÉS — la page d'attente les remplace, les anciens écrans restent
 * dans le dépôt prêts à rouvrir (demande fondateur, réversible).
 *
 * La navigation est HASH-driven : l'URL est synchronisée avec la vue et les
 * routes sont deep-linkables au chargement (#/quete/1.1, #/reset?t=…, etc.).
 *
 * RECONSTITUTION (5ᵉ reset sandbox) — fidèle au bundle staging Task 27
 * (readRoute `au`, Tn → lireEtatQuete, App `Xh`).
 */

type Stage = 'welcome' | Tab | 'portrait' | 'matchs' | 'masked';

/** Destinations de go() — l'onglet Quête ne passe PAS par DEST_HASH : #/quete est une Route dédiée. */
type Dest = Tab | 'portrait' | 'matchs' | 'masked';

/** Les vues adressables par le hash des tabs (les dating → 'masked'). */
type TabRoute = 'voyage' | 'mondes' | 'parcourus' | 'recolte' | 'portrait' | 'matchs' | 'masked';

/** Hash → vue (l'onglet Quête n'y figure pas : #/quete a SA route). */
const TAB_HASHES: Record<string, TabRoute> = {
  '#/voyage': 'voyage',
  '#/mondes': 'mondes',
  '#/parcourus': 'parcourus',
  '#/recolte': 'recolte',
  '#/portrait': 'portrait',
  '#/matchs': 'matchs',
  '#/decouvrir': 'masked',
  '#/messages': 'masked',
  '#/profil': 'masked',
};

/** Vue → hash (inverse, destinations réellement adressables par go()). */
const DEST_HASH: Record<Exclude<TabRoute, 'masked'>, string> = {
  voyage: '#/voyage',
  mondes: '#/mondes',
  parcourus: '#/parcourus',
  recolte: '#/recolte',
  portrait: '#/portrait',
  matchs: '#/matchs',
};

/** Routes spéciales portées par le hash (tabs, quête, OAuth, reset email, Meta). */
type Route =
  | { name: 'tab'; tab: TabRoute }
  | { name: 'quete'; id: IdQuete; /** #/quete/{id}/resultats — quête terminée ouverte DIRECTEMENT sur les résultats détaillés. */ resultats: boolean }
  | { name: 'reset'; token: string }
  | { name: 'fb-complete' }
  | { name: 'oauth-complete'; via: 'google' | 'facebook' | null }
  | { name: 'default' };

/** Une quête engagée = non terminée avec au moins une réponse (bundle Mh). */
function queteEngagee(e: EtatQuete): boolean {
  return !e.terminee && Object.keys(e.reponses).length > 0;
}

/**
 * La prochaine quête (bundle Io) : première non terminée AYANT des réponses
 * (là où l'on s'est arrêté), sinon première non terminée, sinon la dernière.
 */
function prochaineQuete(): IdQuete {
  const engagee = QUETE_IDS.find((id) => queteEngagee(lireEtatQuete(id)));
  if (engagee) return engagee;
  const libre = QUETE_IDS.find((id) => !lireEtatQuete(id).terminee);
  return libre ?? QUETE_IDS[QUETE_IDS.length - 1];
}

/** Lit le hash de navigation : #/quete[/id], #/reset?t=…, #/fb-complete, #/oauth-complete?via=…, tabs, ou l'app. */
function readRoute(): Route {
  const hash = window.location.hash;
  if (hash.startsWith('#/reset')) {
    const token = new URLSearchParams(hash.split('?')[1] ?? '').get('t') ?? '';
    if (/^[0-9a-f]{64}$/.test(token)) return { name: 'reset', token };
  }
  if (hash.startsWith('#/fb-complete')) return { name: 'fb-complete' };
  if (hash === '#/quete' || hash.startsWith('#/quete/')) {
    const reste = hash.slice(8); // '' | '{id}' | '{id}/resultats'
    const [idBrut, suffixe] = reste.split('/');
    const idValide = (QUETE_IDS as readonly string[]).includes(idBrut) ? (idBrut as IdQuete) : null;
    return {
      name: 'quete',
      id: idValide ?? prochaineQuete(),
      resultats: idValide !== null && suffixe === 'resultats',
    };
  }
  if (hash.startsWith('#/oauth-complete')) {
    const via = new URLSearchParams(hash.split('?')[1] ?? '').get('via');
    return {
      name: 'oauth-complete',
      via: via === 'facebook' ? 'facebook' : via === 'google' ? 'google' : null,
    };
  }
  const tab = TAB_HASHES[hash];
  return tab ? { name: 'tab', tab } : { name: 'default' };
}

export default function App() {
  const { tx, lang, devise, setLangue, setDevise } = useI18n();
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
  /** Menu « MON COMPTE » (avatar) — l'essentiel RGPD reste accessible SANS le Profil masqué. */
  const [accountOpen, setAccountOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  /** Monde demandé depuis la carte du Voyage ⇒ fiche auto-ouverte dans Mondes (consommée une fois). */
  const [pendingWorld, setPendingWorld] = useState<string | null>(null);

  // L'état de CHACUNE des 3 quêtes est relu au rendu (hooks du store) : le
  // point corail s'allume dès qu'une quête est engagée, depuis n'importe quel
  // onglet, et s'éteint seul à la complétion.
  const etat11 = useEtatQuete('1.1');
  const etat12 = useEtatQuete('1.2');
  const etat13 = useEtatQuete('1.3');
  const queteEnCours = QUETE_IDS.some((id) =>
    queteEngagee(id === '1.1' ? etat11 : id === '1.2' ? etat12 : etat13),
  );

  // La quête que l'onglet Quête affiche (reprise immédiate au point d'arrêt).
  const [queteCourante, setQueteCourante] = useState<IdQuete>(() => prochaineQuete());
  /** Deep-link #/quete/{id}/resultats : la page s'ouvre DIRECTEMENT sur les
   *  résultats détaillés (quête terminée) — au niveau du bouton PDF, sans
   *  repasser par la carte (demande fondateur : les détails en un tap). */
  const [queteResultats, setQueteResultats] = useState<boolean>(false);

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

  // La route résout vers la vue : tab → onglet, quête → page Quête (id posé).
  useEffect(() => {
    if (route.name === 'tab') setStage(route.tab);
    if (route.name === 'quete') {
      setStage('quete');
      setQueteCourante(route.id);
      setQueteResultats(route.resultats);
    }
  }, [route]);

  // Chaque changement de vue repart du haut de page.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [stage]);

  // Retour OAuth (#/?google=ok, #/?facebook=retry…) → message + nettoyage du hash.
  useEffect(() => {
    if (!window.location.hash.startsWith('#/?')) return;
    const params = new URLSearchParams(window.location.hash.split('?')[1] ?? '');
    const google = params.get('google');
    const facebook = params.get('facebook');
    const isOk = google === 'ok' || facebook === 'ok';
    const notice = isOk
      ? tx('Connexion réussie — bienvenue !')
      : google === 'retry' || facebook === 'retry'
        ? tx('La connexion sociale a été interrompue — réessayez, ou utilisez le code email.')
        : google === 'unverified'
          ? tx('Cet email n\u2019est pas vérifié chez le fournisseur — utilisez le code email.')
          : google === 'cancelled' || facebook === 'cancelled'
            ? tx('Connexion annulée.')
            : google === 'error' || facebook === 'error'
              ? params.get('msg') || tx('La connexion sociale a échoué — réessayez, ou utilisez le code email.')
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

  /** Synchronise l'URL ↔ l'état : l'onglet Quête calcule SA quête à retrouver. */
  const go = (dest: Exclude<Dest, 'masked'>): void => {
    if (dest === 'quete') {
      const id = prochaineQuete();
      const hash = `#/quete/${id}`;
      if (window.location.hash === hash) {
        setStage('quete');
        setQueteCourante(id);
        setQueteResultats(false); // l'onglet Quête reprend au point d'arrêt, pas sur les détails
      } else {
        window.location.hash = hash; // le hashchange relira la route
      }
      return;
    }
    const h = DEST_HASH[dest];
    if (window.location.hash === h) setStage(dest);
    else window.location.hash = h;
  };

  /** Monde demandé depuis la carte du Voyage ⇒ pendingWorld + ouverture des Mondes. */
  const openWorld = (code: string): void => {
    setPendingWorld(code);
    go('mondes');
  };

  /** « Commencer/Continuer le monde » ⇒ les Mondes s'effacent, la quête atterrit. */
  const enterQuest = (): void => {
    setPendingWorld(null);
    go('quete');
  };

  const handleLogout = (): void => {
    void (async () => {
      setBusy(true);
      try {
        await logout();
        window.location.hash = '';
        window.location.reload();
      } catch {
        window.alert(tx('La déconnexion n’a pas abouti — réessaie.'));
        setBusy(false);
      }
    })();
  };

  const handleExport = (): void => {
    try {
      exportAccount();
    } catch {
      window.alert(tx('L’export n’a pas abouti — réessaie.'));
    }
  };

  const handleDelete = (): void => {
    void (async () => {
      setBusy(true);
      try {
        await deleteAccount();
        window.location.hash = '';
        window.location.reload();
      } catch {
        window.alert(tx('La suppression n’a pas abouti — réessaie.'));
        setBusy(false);
      }
    })();
  };

  const onAuthenticated = (congratsVia?: string | null) => {
    // L'ACCUEIL EST LE VOYAGE : après une inscription/connexion, on repart
    // sur 'welcome' ⇒ la vue connectée résout vers le Voyage.
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
          <p className="tagline">{tx('Chargement…')}</p>
        </main>
      </div>
    );
  }

  // ---- Déconnecté : écran d'accueil OU authentification ----
  if (!authenticated) {
    if (stage === 'welcome') {
      // L'atterrissage après inscription = LES MONDES (plus 'discover').
      return <Welcome onStart={() => setStage('mondes')} />;
    }
    return (
      <>
        <PushToast />
        <Auth onAuthenticated={onAuthenticated} />
      </>
    );
  }

  // ---- Connecté : app — L'ACCUEIL EST LE VOYAGE (demande fondateur) ----
  const view: Exclude<Stage, 'welcome'> = stage === 'welcome' ? 'voyage' : stage;
  const rawName = (me?.displayName ?? '').trim() || (me?.username ?? '').trim();
  const firstName = (rawName.split(/\s+/)[0] || tx('Voyageur')).slice(0, 14);
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
              width={46}
              height={46}
              className="ah-logo"
            />
            <div className="ah-brand-text">
              <span className="brand">
                Wai<span className="brand-accent">ryu</span>
              </span>
              <span
                className="ah-tagline"
                dangerouslySetInnerHTML={{ __html: tx("Apprendre aujourd'hui,<br>explorer demain") }}
              />
            </div>
          </div>
          <div className="ah-right">
            <button
              type="button"
              className="ah-bell"
              aria-label={
                badge > 0
                  ? tx('Notifications ({{n}} nouvelles)', { n: badge })
                  : tx('Notifications')
              }
              aria-expanded={bellOpen}
              aria-haspopup="dialog"
              onClick={() => {
                setBellOpen((v) => !v);
                setAccountOpen(false);
              }}
            >
              <svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              {badge > 0 && <span className="ah-badge">{badge}</span>}
            </button>
            <button
              type="button"
              className="ah-user"
              onClick={() => {
                setAccountOpen((v) => !v);
                setBellOpen(false);
              }}
              aria-label={tx('Mon compte')}
              aria-expanded={accountOpen}
              aria-haspopup="dialog"
            >
              <span className="ah-avatar" aria-hidden="true">
                {initial}
              </span>
              <span className="ah-hello">
                <small>{tx('Bonjour,')}</small>
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
                aria-label={tx('Fermer les notifications')}
                onClick={() => setBellOpen(false)}
              />
              <div className="ah-panel" role="dialog" aria-label={tx('Notifications récentes')}>
                <h3>{tx('Notifications')}</h3>
                {events.length === 0 ? (
                  <p className="ah-empty">{tx('Rien pour le moment — tes notifications apparaîtront ici.')}</p>
                ) : (
                  events.slice(0, 8).map((ev) => (
                    <div key={ev.id} className="ah-ev">
                      <strong>{ev.title}</strong>
                      <p>{ev.body}</p>
                      <time dateTime={ev.createdAt}>
                        {new Date(ev.createdAt).toLocaleDateString(lang === 'en' ? 'en-IE' : 'fr-FR', {
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
          {accountOpen && (
            <>
              <button
                type="button"
                className="ah-overlay"
                aria-label={tx('Fermer mon compte')}
                onClick={() => {
                  setAccountOpen(false);
                  setDeleteConfirm(false);
                }}
              />
              <div className="ah-panel ah-account" role="dialog" aria-label={tx('Mon compte')}>
                <div className="ah-account-head">
                  <span className="ah-avatar ah-avatar-lg" aria-hidden="true">
                    {initial}
                  </span>
                  <span className="ah-account-name">
                    <small>{tx('Mon compte')}</small>
                    <strong>{firstName}</strong>
                  </span>
                </div>
                {/* Langue & devise — accessibles depuis TOUT l'app (le Profil
                    est derrière la porte Étape 3) : la langue recharge la page
                    (les contenus se reconstruisent), la devise s'applique à chaud. */}
                <div className="ah-i18n">
                  <label className="ah-i18n-field">
                    <span>{tx('Langue')}</span>
                    <select value={lang} onChange={(e) => setLangue(e.target.value as Lang)} aria-label={tx('Langue')}>
                      <option value="fr">Français</option>
                      <option value="en">English</option>
                    </select>
                  </label>
                  <label className="ah-i18n-field">
                    <span>{tx('Devise')}</span>
                    <select
                      value={devise}
                      onChange={(e) => setDevise(e.target.value as CurrencyCode)}
                      aria-label={tx('Devise')}
                    >
                      {DEVISES.map((d) => (
                        <option key={d.code} value={d.code}>
                          {lang === 'en' ? d.label.en : d.label.fr}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <button type="button" className="ah-account-item" onClick={handleExport} disabled={busy}>
                  {tx('Exporter mes données (RGPD)')}
                </button>
                <button type="button" className="ah-account-item" onClick={handleLogout} disabled={busy}>
                  {tx('Se déconnecter')}
                </button>
                {deleteConfirm ? (
                  <div className="ah-account-danger">
                    <p>{tx('Supprimer ton compte efface immédiatement tes données personnelles. Cette action est définitive.')}</p>
                    <button type="button" className="ah-account-item danger-text" onClick={handleDelete} disabled={busy}>
                      {tx('Oui, supprimer définitivement')}
                    </button>
                    <button
                      type="button"
                      className="ah-account-item"
                      onClick={() => setDeleteConfirm(false)}
                      disabled={busy}
                    >
                      {tx('Annuler')}
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="ah-account-item danger-text"
                    onClick={() => setDeleteConfirm(true)}
                    disabled={busy}
                  >
                    {tx('Supprimer mon compte (RGPD)')}
                  </button>
                )}
              </div>
            </>
          )}
        </header>
        {view === 'voyage' && <Voyage onExplore={() => go('mondes')} onOpenWorld={openWorld} />}
        {view === 'mondes' && (
          <Mondes
            pendingWorld={pendingWorld}
            onPendingConsumed={() => setPendingWorld(null)}
            onEnterQuest={enterQuest}
          />
        )}
        {view === 'parcourus' && <Parcourus />}
        {view === 'recolte' && <Recolte />}
        {view === 'portrait' && <Portrait />}
        {view === 'matchs' && <Rencontres />}
        {view === 'masked' && <Masque />}
        {view === 'quete' && (
          <Quete
            key={queteResultats ? `${queteCourante}-resultats` : queteCourante}
            queteId={queteCourante}
            resultatsInitiale={queteResultats}
            onExit={() => go('mondes')}
            onHome={() => go('voyage')}
            onAllerQuete={(id) => {
              window.location.hash = `#/quete/${id}`;
            }}
          />
        )}
        <TabBar active={view} onSelect={go} queteEnCours={queteEnCours} />
      </div>
    </>
  );
}
