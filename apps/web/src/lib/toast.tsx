/**
 * Système de toasts global (enrichissement Task 31 — codes des apps populaires).
 *
 * Un mini-store module-level + un hôte <ToastHost /> monté une seule fois
 * dans App : n'importe quel écran peut appeler toast(msg, type) sans
 * prop-drilling. Les toasts apparaissent EN HAUT AU CENTRE (au-dessus des
 * cartes et modales — z-index 200), avec icône colorée selon le type et
 * sortie automatique — le feedback demandé par le fondateur pour chaque
 * bouton, sans voler l'espace du contenu (l'ancien flash-msg reste pour
 * les messages longs).
 *
 * Types : success (vert ✓) · error (rouge ✕) · info (bleu i).
 */

import { useEffect, useState } from 'react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastItem {
  id: number;
  msg: string;
  type: ToastType;
}

type Listener = (t: ToastItem) => void;

let listeners: Listener[] = [];
let seq = 0;

/** Affiche un toast en haut de l'écran — sortie auto après 2,4 s. */
export function toast(msg: string, type: ToastType = 'info'): void {
  const item: ToastItem = { id: ++seq, msg, type };
  for (const l of listeners) l(item);
}

/** Icônes SVG inline (aucune dépendance — cohérence avec la référence). */
function ToastIcon({ type }: { type: ToastType }) {
  if (type === 'success') {
    return (
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
        <circle cx="12" cy="12" r="11" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M7 12.5l3.2 3.2L17 9" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (type === 'error') {
    return (
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
        <circle cx="12" cy="12" r="11" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M8 8l8 8M16 8l-8 8" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <circle cx="12" cy="12" r="11" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M12 10.5v6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="12" cy="7" r="1.4" fill="currentColor" />
    </svg>
  );
}

/** Hôte unique — monte-le une fois dans App (rendu conditionnel inutile). */
export function ToastHost() {
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(() => {
    const onToast: Listener = (t) => {
      setItems((prev) => [...prev.slice(-2), t]); // 3 max à l'écran
      window.setTimeout(() => {
        setItems((prev) => prev.filter((x) => x.id !== t.id));
      }, 2400);
    };
    listeners.push(onToast);
    return () => {
      listeners = listeners.filter((l) => l !== onToast);
    };
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="toast-container" role="status" aria-live="polite">
      {items.map((t) => (
        <div key={t.id} className={`toast ${t.type}`}>
          <span className="toast-ico">
            <ToastIcon type={t.type} />
          </span>
          <span>{t.msg}</span>
        </div>
      ))}
    </div>
  );
}
