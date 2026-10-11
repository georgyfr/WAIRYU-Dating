/**
 * PushToast (fondateur, 2026) — relais visible des pushes quand la page est
 * au premier plan. Le Service Worker n'affiche PAS de bulle OS si la page est
 * visible (sauf payload.force) et relaie le payload à la page via
 * postMessage « wairyu-push » : ce composant consomme ce message et affiche
 * un toast (ex. code OTP à 6 chiffres pendant la connexion — l'utilisateur
 * n'a pas à quitter l'écran). Les payloads force (bienvenue/félicitations/
 * test) sont IGNORÉS ici : la bulle OS les affiche déjà.
 *
 * Retour fondateur (staging) : « cette notification se présente très mal et
 * met beaucoup de temps à disparaître. L'utilisateur doit pouvoir la
 * supprimer. » → trois correctifs UX, sans toucher au canal push :
 *  1. le toast est CADRÉ dans le cadre de l'app (480 px max, centré) —
 *     il ne s'étale plus sur toute la fenêtre du navigateur ;
 *  2. durée courte par défaut (10 s) — les 90 s ne se justifie que pour un
 *     futur code OTP (kind === 'otp', aucun push de ce type à ce jour) ;
 *  3. bouton × de fermeture immédiate + clic sur le toast = ouverture de la
 *     destination du push (ex. #/recolte — « Ouvre ton coffre du voyageur »).
 */
import { useEffect, useState } from 'react';
import { getLang } from '../i18n/current';

interface ToastItem {
  id: number;
  title: string;
  body: string;
  url?: string;
}

/** Le code OTP vit 10 min ; le toast le laisse lisible 1 min 30. */
const DUREE_OTP_MS = 90_000;
/** Récoltes et infos : un toast se lit d'un coup d'œil puis s'efface. */
const DUREE_DEFAUT_MS = 10_000;

export default function PushToast() {
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;
    let seq = 0;

    const onMessage = (event: MessageEvent) => {
      const msg = event.data as {
        type?: string;
        data?: { title?: string; body?: string; force?: boolean; kind?: string; url?: string };
      } | null;
      if (!msg || msg.type !== 'wairyu-push' || !msg.data) return;
      if (msg.data.force) return; // bulle OS déjà affichée par le SW
      const title = typeof msg.data.title === 'string' ? msg.data.title : 'WAIRYU';
      const body = typeof msg.data.body === 'string' ? msg.data.body : '';
      if (!body) return;
      const url =
        typeof msg.data.url === 'string' && msg.data.url.startsWith('#/') ? msg.data.url : undefined;
      const id = ++seq;
      setItems((prev) => [...prev.slice(-2), { id, title, body, url }]);
      const duree = msg.data.kind === 'otp' ? DUREE_OTP_MS : DUREE_DEFAUT_MS;
      window.setTimeout(() => {
        setItems((prev) => prev.filter((t) => t.id !== id));
      }, duree);
    };

    navigator.serviceWorker.addEventListener('message', onMessage);
    return () => navigator.serviceWorker.removeEventListener('message', onMessage);
  }, []);

  const fermer = (id: number) => setItems((prev) => prev.filter((t) => t.id !== id));

  const ouvrir = (t: ToastItem) => {
    fermer(t.id);
    if (t.url) window.location.hash = t.url;
  };

  if (items.length === 0) return null;
  const libelleFermer = getLang() === 'en' ? 'Dismiss notification' : 'Fermer la notification';
  const libelleOuvrir = getLang() === 'en' ? 'Open' : 'Ouvrir';
  return (
    <div className="push-toasts" role="status" aria-live="polite">
      {items.map((t) => (
        <div
          key={t.id}
          className={t.url ? 'push-toast cliquable' : 'push-toast'}
          role={t.url ? 'button' : undefined}
          tabIndex={t.url ? 0 : undefined}
          aria-label={t.url ? `${libelleOuvrir} : ${t.title}` : undefined}
          onClick={t.url ? () => ouvrir(t) : undefined}
          onKeyDown={
            t.url
              ? (e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    ouvrir(t);
                  }
                }
              : undefined
          }
        >
          <button
            type="button"
            className="push-toast-close"
            aria-label={libelleFermer}
            onClick={(e) => {
              e.stopPropagation();
              fermer(t.id);
            }}
          >
            ×
          </button>
          <strong>{t.title}</strong>
          <p>{t.body}</p>
        </div>
      ))}
    </div>
  );
}
