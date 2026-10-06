/**
 * PushToast (fondateur, 2026) — relais visible des pushes quand la page est
 * au premier plan. Le Service Worker n'affiche PAS de bulle OS si la page est
 * visible (sauf payload.force) et relaie le payload à la page via
 * postMessage « wairyu-push » : ce composant consomme ce message et affiche
 * un toast (ex. code OTP à 6 chiffres pendant la connexion — l'utilisateur
 * n'a pas à quitter l'écran). Les payloads force (bienvenue/félicitations/
 * test) sont IGNORÉS ici : la bulle OS les affiche déjà.
 */
import { useEffect, useState } from 'react';

interface ToastItem {
  id: number;
  title: string;
  body: string;
}

export default function PushToast() {
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;
    let seq = 0;

    const onMessage = (event: MessageEvent) => {
      const msg = event.data as { type?: string; data?: { title?: string; body?: string; force?: boolean; kind?: string } } | null;
      if (!msg || msg.type !== 'wairyu-push' || !msg.data) return;
      if (msg.data.force) return; // bulle OS déjà affichée par le SW
      const title = typeof msg.data.title === 'string' ? msg.data.title : 'WAIRYU';
      const body = typeof msg.data.body === 'string' ? msg.data.body : '';
      if (!body) return;
      const id = ++seq;
      setItems((prev) => [...prev.slice(-2), { id, title, body }]);
      window.setTimeout(() => {
        setItems((prev) => prev.filter((t) => t.id !== id));
      }, 90_000); // le code OTP vit 10 min ; le toast s'efface après 1 min 30
    };

    navigator.serviceWorker.addEventListener('message', onMessage);
    return () => navigator.serviceWorker.removeEventListener('message', onMessage);
  }, []);

  if (items.length === 0) return null;
  return (
    <div className="push-toasts" role="status" aria-live="polite">
      {items.map((t) => (
        <div key={t.id} className="push-toast">
          <strong>{t.title}</strong>
          <p>{t.body}</p>
        </div>
      ))}
    </div>
  );
}
