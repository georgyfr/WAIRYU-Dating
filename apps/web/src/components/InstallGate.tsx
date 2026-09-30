/**
 * InstallGate (Task 60-URL + Task 63) — bannière « installer l'application ».
 *
 * Phases :
 *  - hidden        : rien (desktop, déjà installé, congédié cette session) ;
 *  - android-link  : Android, pas d'événement d'installation natif dispo →
 *                    CTA vers la page /app (voie Chrome RECOMMANDÉE Task 63) ;
 *  - android-ready : beforeinstallprompt capté → bouton « 📲 Installer »
 *                    natif (WebAPK signé par Google — jamais bloqué par
 *                    Play Protect, c'est TOUT l'intérêt de la voie Chrome) ;
 *  - ios           : guide 4 gestes « Partager → Sur l'écran d'accueil » ;
 *  - installed     : confirmation + conseil d'ouverture via l'icône.
 *
 * Task 63 (fondateur : « Google Play Protect bloque à nouveau l'application »)
 * : le message Android insiste sur la VOIE CHROME — l'installation via Chrome
 * produit un WebAPK signé par Google que Play Protect ne signale JAMAIS,
 * contrairement à l'APK sideloadé (installé par fichier, hors Play Store).
 *
 * Congédié jusqu'à la fin de session (sessionStorage) — pas un vapp en
 * permanent : la bannière reste UTILE si l'utilisateur change d'avis.
 */

import { useEffect, useState } from 'react';
import { isStandalone, intentAlreadyFailed } from '../lib/open-in-app';

type Phase =
  | 'hidden'
  | 'android-ready'
  | 'android-link'
  | 'android-fallback' // Task 74 — intent déjà tenté et échoué : app non installée
  | 'ios'
  | 'installed';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISS_KEY = 'wairyu_installgate_dismissed';

/** Plateforme grossière (iOS inclut iPad en mode desktop). */
function platform(): 'ios' | 'android' | 'desktop' {
  try {
    const ua = navigator.userAgent || '';
    if (/iPhone|iPad|iPod/i.test(ua) || (/Macintosh/i.test(ua) && (navigator.maxTouchPoints ?? 0) > 1)) {
      return 'ios';
    }
    if (/Android/i.test(ua)) return 'android';
  } catch {
    /* bénin */
  }
  return 'desktop';
}

export default function InstallGate() {
  const [phase, setPhase] = useState<Phase>('hidden');
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [showSteps, setShowSteps] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (isStandalone()) return;
    const pf = platform();
    if (pf === 'desktop') return;
    try {
      if (sessionStorage.getItem(DISMISS_KEY) === '1') return;
    } catch {
      /* privacy mode — la bannière reste (bénin) */
    }
    // Task 74 : si l'ouverture application (intent:// Task 60-URL) a déjà été
    // tentée cette session et que la page s'exécute ENCORE ici, c'est que
    // l'application n'est PAS installée — on nomme alors la barre d'adresse
    // explicitement au lieu du message générique (le fondateur, utilisateur
    // réel, n'avait pas fait le lien bannière ↔ barre d'adresse visible).
    if (pf === 'android' && intentAlreadyFailed()) {
      setPhase('android-fallback');
    } else {
      setPhase(pf === 'ios' ? 'ios' : 'android-link');
    }

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setPhase('android-ready');
    };
    const onInstalled = () => {
      setDeferred(null);
      setPhase('installed');
      try {
        sessionStorage.setItem(DISMISS_KEY, '1');
      } catch {
        /* bénin */
      }
    };
    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', onInstalled);
    const mq = window.matchMedia ? window.matchMedia('(display-mode: standalone)') : null;
    const onMode = () => {
      if (isStandalone()) setPhase('hidden');
    };
    mq?.addEventListener?.('change', onMode);
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt);
      window.removeEventListener('appinstalled', onInstalled);
      mq?.removeEventListener?.('change', onMode);
    };
  }, []);

  if (phase === 'hidden') return null;

  function dismiss() {
    setPhase('hidden');
    setShowSteps(false);
    try {
      sessionStorage.setItem(DISMISS_KEY, '1');
    } catch {
      /* bénin */
    }
  }

  async function install() {
    if (!deferred) return;
    setBusy(true);
    try {
      await deferred.prompt();
      const choice = await deferred.userChoice;
      if (choice.outcome === 'accepted') setPhase('installed');
      else dismiss();
    } catch {
      setPhase('android-link');
    } finally {
      setBusy(false);
      setDeferred(null);
    }
  }

  let title = '';
  let text = '';
  if (phase === 'installed') {
    title = '🎉 Application installée !';
    text =
      'Ouvre wairyu depuis l’icône de ton écran d’accueil — elle s’ouvrira plein écran, sans aucune barre d’adresse.';
  } else if (phase === 'android-fallback') {
    // Task 74 — la capture du fondateur (barre d'adresse visible au-dessus de
    // l'onboarding) est le cas exact : lien ouvert dans une Custom Tab, app
    // non installée, intent échoué. Le message NOMME la barre d'adresse.
    title = 'Cette barre d’adresse ? Elle disparaît avec l’application';
    text =
      'wairyu est ouvert dans le navigateur : aucun site ne peut masquer la barre d’adresse, seul le téléphone le peut — en ouvrant l’application installée. L’installation prend 2 minutes.';
  } else {
    title = 'Ouvre wairyu comme une vraie application';
    text =
      'Installe-la sur ton écran d’accueil : plus jamais de barre d’adresse, wairyu s’ouvrira plein écran comme une app.';
  }
  // Task 63 — explicite sur la voie Chrome (WebAPK signé Google, pas Play Protect).
  const chromeWayHint =
    phase === 'android-ready'
      ? 'Via Chrome : application signée par Google — jamais bloquée par Play Protect.'
      : phase === 'android-link' || phase === 'android-fallback'
        ? 'Installation via Chrome : signée par Google, sans blocage Play Protect.'
        : null;

  return (
    <div
      className={'installgate' + (phase === 'android-fallback' ? ' fallback' : '')}
      role="region"
      aria-label="Installer l'application wairyu"
      data-testid="installgate"
      data-phase={phase}
    >
      <span className="installgate-ico" aria-hidden="true">
        📲
      </span>
      <div className="installgate-txt">
        <strong>{title}</strong>
        <small>{text}</small>
        {chromeWayHint && <small className="installgate-chrome-way">{chromeWayHint}</small>}
        {/* Task 75 (fondateur : la barre d'adresse revient « depuis l'app ») —
            le chemin le plus fréquent vers le navigateur = re-ouvrir un lien
            reçu par EMAIL au lieu de passer par l'icône. On nomme ce piège
            explicitement sur les deux phases Android où l'app n'est pas (encore)
            installée. */}
        {(phase === 'android-fallback' || phase === 'android-link') && (
          <small className="installgate-already">
            Déjà installée&nbsp;? Ouvre wairyu depuis l’icône de ton écran d’accueil — jamais depuis un email ni un lien.
          </small>
        )}
        {phase === 'ios' && showSteps && (
          <ol className="installgate-steps">
            <li>
              Touche le bouton <b>Partager</b> (le carré avec la flèche ↑) en bas de Safari.
            </li>
            <li>
              Choisis <b>« Sur l’écran d’accueil »</b>.
            </li>
            <li>
              Appuie sur <b>Ajouter</b> — l’icône wairyu apparaît.
            </li>
            <li>
              Ouvre wairyu depuis cette icône : <b>plus de barre d’adresse</b>.
            </li>
          </ol>
        )}
      </div>
      <div className="installgate-actions">
        {phase === 'android-ready' && (
          <button type="button" className="btn primary" onClick={() => void install()} disabled={busy}>
            {busy ? 'Installation…' : '📲 Installer'}
          </button>
        )}
        {phase === 'android-link' && (
          <a className="btn primary" href="/app">
            📲 Obtenir l’app
          </a>
        )}
        {phase === 'android-fallback' && (
          <a className="btn primary" href="/app" data-testid="installgate-fallback-cta">
            📲 Installer l’application
          </a>
        )}
        {phase === 'ios' && (
          <button type="button" className="btn primary" onClick={() => setShowSteps((s) => !s)}>
            {showSteps ? 'Masquer' : 'Comment faire ?'}
          </button>
        )}
        {phase !== 'installed' && (
          <button type="button" className="installgate-x" aria-label="Ne plus afficher" onClick={dismiss}>
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
