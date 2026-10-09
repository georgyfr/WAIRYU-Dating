/**
 * Console de notifications (mission socle push) — visible sur l'écran d'accueil.
 * Permet de : activer les notifications (permission + abonnement), s'envoyer
 * un VRAI push de test (pipeline serveur complet), simuler une première
 * ouverture, et lire le journal in-app (canal universel 2016/2017).
 */
import { useCallback, useEffect, useState } from 'react';
import {
  PUSH_ARMED_EVENT,
  activateWebPushDetailed,
  fetchEvents,
  fetchPushConfig,
  getDeviceId,
  pushSupported,
  registerDeviceOpen,
  sendTestPush,
  showLocalTestNotification,
  simulateFirstOpen,
  unsubscribeWebPush,
} from '../lib/push-client';
import { useI18n } from '../i18n/I18nProvider';
import type { PushEventRow, PushOpenResponse } from '@wairyu/shared';

type Perm = 'granted' | 'default' | 'denied' | 'unsupported';

export default function NotificationsCard() {
  const { tx, lang } = useI18n();
  const [deviceId, setDeviceId] = useState<string>('');
  const [supported, setSupported] = useState(true);
  const [perm, setPerm] = useState<Perm>('default');
  const [subscribed, setSubscribed] = useState(false);
  const [pushServerOn, setPushServerOn] = useState<boolean | null>(null);
  const [openInfo, setOpenInfo] = useState<PushOpenResponse | null>(null);
  const [events, setEvents] = useState<PushEventRow[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState<string>('');

  const refreshEvents = useCallback(async () => {
    const r = await fetchEvents();
    if (r) setEvents(r.events);
  }, []);

  const boot = useCallback(async () => {
    const id = getDeviceId();
    setDeviceId(id);
    setSupported(pushSupported());
    if ('Notification' in window) setPerm(Notification.permission as Perm);
    else setPerm('unsupported');

    const cfg = await fetchPushConfig();
    setPushServerOn(cfg?.enabled === true);

    const open = await registerDeviceOpen();
    if (open) {
      setOpenInfo(open);
      setSubscribed(open.subscribed);
    }
    await refreshEvents();
  }, [refreshEvents]);

  useEffect(() => {
    void boot();
    const poll = window.setInterval(() => void refreshEvents(), 5000);
    const onArmed = () => {
      if ('Notification' in window) setPerm(Notification.permission as Perm);
      void boot();
    };
    window.addEventListener(PUSH_ARMED_EVENT, onArmed);
    return () => {
      window.clearInterval(poll);
      window.removeEventListener(PUSH_ARMED_EVENT, onArmed);
    };
  }, [boot, refreshEvents]);

  const onActivate = async () => {
    setBusy('activate');
    setMessage('');
    const r = await activateWebPushDetailed();
    setBusy(null);
    if (r.status === 'granted') {
      setPerm('granted');
      // Véridicité : on n'affiche « envoyé » que si le serveur le confirme.
      setMessage(
        r.welcomeSent || r.confirmSent
          ? tx('Notifications activées — le serveur a bien envoyé le push (la bulle du système devrait apparaître).')
          : tx('Notifications activées et enregistrées — l\u2019issue réelle de l\u2019envoi figure dans le journal ci-dessous.'),
      );
    } else if (r.status === 'denied') {
      setMessage(tx('Permission refusée. Débloquez le site dans les réglages du navigateur pour réessayer.'));
    } else if (r.status === 'server-off') {
      setMessage(tx('Le serveur n\u2019a pas encore ses clés VAPID — réessayez plus tard.'));
    } else if (r.status === 'unsupported') {
      setMessage(tx('Ce navigateur ne supporte pas le push — le journal in-app ci-dessous reste disponible.'));
    } else {
      setMessage(tx('Échec réseau — réessayez.'));
    }
    await boot();
  };

  const onTest = async () => {
    setBusy('test');
    setMessage('');
    const r = await sendTestPush();
    setBusy(null);
    if (r?.ok) {
      setMessage(tx('Push réel envoyé par le serveur — regardez la bulle du système (même page ouverte).'));
    } else if (r?.reason === 'no_subscription') {
      const local = await showLocalTestNotification();
      setMessage(
        local
          ? tx('Pas encore d\u2019abonnement push : notification LOCALE affichée via le Service Worker (repli).')
          : tx('Pas d\u2019abonnement push et Service Worker indisponible : activez d\u2019abord les notifications.'),
      );
    } else if (r?.reason === 'rate_limited') {
      setMessage(tx('Trop de tests rapprochés — patientez une minute.'));
    } else {
      setMessage(tx('Le serveur n\u2019a pas pu délivrer le push (voir le journal).'));
    }
    await refreshEvents();
  };

  const onUnsubscribe = async () => {
    setBusy('unsub');
    await unsubscribeWebPush();
    setBusy(null);
    setMessage(tx('Notifications désactivées sur cet appareil.'));
    await boot();
  };

  const permChip =
    perm === 'granted'
      ? ['ok', tx('Permission accordée')]
      : perm === 'denied'
        ? ['warn', tx('Permission refusée')]
        : perm === 'unsupported'
          ? ['warn', tx('Push non supporté (canal in-app seul)')]
          : ['', tx('Permission à accorder')];

  const serverChip =
    pushServerOn === null
      ? ['', tx('Serveur push : vérification…')]
      : pushServerOn
        ? ['ok', tx('Serveur push : prêt')]
        : ['warn', tx('Serveur push : clés absentes')];

  const subChip = subscribed ? ['ok', tx('Abonné')] : ['warn', tx('Non abonné')];

  return (
    <section className="push-card" aria-label={tx('Console de notifications')}>
      <h2 className="push-title">{tx('Notifications sur cet appareil')}</h2>
      <div className="push-status">
        <span className={`push-chip ${permChip[0]}`}>{permChip[1]}</span>
        <span className={`push-chip ${serverChip[0]}`}>{serverChip[1]}</span>
        <span className={`push-chip ${subChip[0]}`}>{subChip[1]}</span>
      </div>
      <p className="push-note">
        {tx('Appareil')} <code>{deviceId ? `${deviceId.slice(0, 8)}…` : '—'}</code>
        {openInfo
          ? openInfo.openCount > 1
            ? tx(' · {{n}} ouvertures', { n: openInfo.openCount })
            : tx(' · {{n}} ouverture', { n: openInfo.openCount })
          : ''}
        {openInfo?.welcomePending
          ? tx(' · notification de bienvenue en attente d\u2019activation')
          : tx(' · bienvenue envoyée')}
      </p>
      <div className="push-actions">
        <button className="btn btn-primary" onClick={onActivate} disabled={busy !== null || !supported}>
          {busy === 'activate' ? tx('Activation…') : tx('Activer les notifications')}
        </button>
        <button className="btn btn-ghost" onClick={onTest} disabled={busy !== null}>
          {busy === 'test' ? tx('Envoi…') : tx('Envoyer une notification de test')}
        </button>
        <button className="btn btn-ghost" onClick={simulateFirstOpen} disabled={busy !== null}>
          {tx('Simuler une première ouverture')}
        </button>
        {subscribed && (
          <button className="btn btn-ghost" onClick={onUnsubscribe} disabled={busy !== null}>
            {busy === 'unsub' ? '…' : tx('Se désabonner')}
          </button>
        )}
      </div>
      {message && (
        <p className="push-message" role="status">
          {message}
        </p>
      )}
      <p className="push-note">
        {tx(
          'Journal des notifications (canal in-app — fonctionne sur tous les appareils, y compris Android 6/7 et iOS 10/11 sans support push) :',
        )}
      </p>
      <div className="push-log" aria-live="polite">
        {events.length === 0 && <p className="push-log-empty">{tx('Aucune notification pour le moment.')}</p>}
        {events.map((e) => (
          <div key={e.id} className="push-log-item">
            <div className="push-log-head">
              <strong>{e.title}</strong>
              <span className={`push-chip ${e.channel === 'push' ? 'ok' : ''} push-chip-sm`}>
                {e.channel === 'push' ? 'push' : e.channel === 'local' ? tx('locale') : 'in-app'}
              </span>
              {!e.delivered && e.channel === 'push' && (
                <span className="push-chip warn push-chip-sm">{tx('échec')}</span>
              )}
            </div>
            {e.body && <p className="push-log-body">{e.body}</p>}
            <p className="push-log-meta">
              {new Date(e.createdAt).toLocaleString(lang === 'en' ? 'en-IE' : 'fr-FR')}
              {e.error ? ` — ${e.error}` : ''}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
