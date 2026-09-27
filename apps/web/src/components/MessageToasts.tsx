/**
 * MessageToasts (Task 53 — demande fondateur : « sur PC, un message peut
 * apparaître sur le côté, comme WhatsApp Web »).
 *
 * Un nouveau message reçu pendant que l'utilisateur est AILLEURS dans l'app
 * (Découvrir, Profil, Messages…) apparaît en BAS À DROITE : avatar, nom,
 * extrait du message, badge d'univers — un clic ouvre la conversation.
 * Dans la conversation ouverte, les messages arrivent déjà par WebSocket :
 * aucune duplication (le toast ignore la conversation affichée).
 *
 * Détection — deux voies qui convergent vers la même comparaison :
 *   1. push reçu par le SW → postMessage « wairyu-push » → App force
 *      refreshConv() → la version fraîche arrive ICI en ~1 s (réactif) ;
 *   2. polling 30 s du badge (App) — filet de sécurité si le push a échoué.
 *
 * Anti-rémanence : au premier chargement de données, le snapshot est posé
 * SANS toasts (on ne rejoue pas l'historique des non-lus) ; seules les
 * AUGMENTATIONS d'unread (ou nouvelle conversation) après coup déclenchent.
 * Le composant est keyé par compte dans App : changement de compte → reset.
 */

import { useEffect, useRef, useState } from 'react';
import type { ConversationDto, ConversationListResponse } from '@wairyu/shared';

export interface MessageToastItem {
  conversationId: string;
  name: string;
  photoUrl: string | null;
  photoBlurred: boolean;
  originMode: ConversationDto['originMode'];
  excerpt: string;
}

interface Props {
  convData: ConversationListResponse | null;
  /** Route active — pour ignorer la conversation déjà affichée à l'écran. */
  route: { name: string; conversationId?: string };
  onOpenChat: (conversationId: string) => void;
}

const TOAST_LIFETIME_MS = 7_000;
const MAX_STACK = 3;

const ORIGIN_ICON: Record<ConversationDto['originMode'], string> = {
  classic: '🔥',
  invisible: '🕯️',
  interracial: '🌍',
};

export default function MessageToasts({ convData, route, onOpenChat }: Props) {
  const [items, setItems] = useState<MessageToastItem[]>([]);
  /** Snapshot précédent : conversationId → { unread, lastSeq } */
  const prev = useRef<Map<string, { unread: number; lastSeq: number }>>(new Map());
  const seeded = useRef(false);
  const timers = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    if (!convData) return;
    const list = convData.conversations ?? [];

    if (!seeded.current) {
      // Premier chargement : pose le snapshot en silence (jamais de toasts
      // pour l'historique — sinon chaque visite rejouerait les non-lus).
      prev.current = new Map(
        list.map((cv) => [cv.conversationId, { unread: cv.unread, lastSeq: cv.lastMessage?.seq ?? 0 }]),
      );
      seeded.current = true;
      return;
    }

    const fresh: MessageToastItem[] = [];
    for (const cv of list) {
      const before = prev.current.get(cv.conversationId);
      const nowSeq = cv.lastMessage?.seq ?? 0;
      const newIncoming =
        (!before && cv.unread > 0 && cv.lastMessage && !cv.lastMessage.fromMe) || // nouvelle conv
        (before !== undefined && cv.unread > before.unread && nowSeq > before.lastSeq) || // nouveaux messages
        (before === undefined && cv.lastMessage && !cv.lastMessage.fromMe && nowSeq > 0); // conv apparue
      prev.current.set(cv.conversationId, { unread: cv.unread, lastSeq: nowSeq });
      if (!newIncoming) continue;
      // Déjà affichée à l'écran ? (le WS live la montre déjà) → pas de toast.
      if (route.name === 'chat' && route.conversationId === cv.conversationId) continue;
      const excerpt =
        cv.lastMessage?.kind === 'voice'
          ? '🎤 Message vocal'
          : (cv.lastMessage?.excerpt ?? '').trim() || 'Message reçu';
      fresh.push({
        conversationId: cv.conversationId,
        name: cv.other.displayName ?? 'Quelqu\u2019un',
        photoUrl: cv.other.photoUrl,
        photoBlurred: cv.other.photoBlurred,
        originMode: cv.originMode,
        excerpt: excerpt.length > 90 ? excerpt.slice(0, 90) + '…' : excerpt,
      });
    }

    if (fresh.length > 0) {
      setItems((prevItems) => {
        const merged = [...prevItems];
        for (const f of fresh) {
          const i = merged.findIndex((m) => m.conversationId === f.conversationId);
          if (i >= 0) merged[i] = f; // replace (nouveaux messages de la même conv)
          else merged.push(f);
        }
        return merged.slice(-MAX_STACK);
      });
      for (const f of fresh) {
        const t = window.setTimeout(() => {
          setItems((cur) => cur.filter((m) => m.conversationId !== f.conversationId));
          timers.current.delete(f.conversationId);
        }, TOAST_LIFETIME_MS);
        timers.current.set(f.conversationId, t);
      }
    }
  }, [convData, route.name, route.conversationId]);

  // Nettoyage final des timers au démontage.
  useEffect(() => {
    const map = timers.current;
    return () => {
      for (const t of map.values()) window.clearTimeout(t);
      map.clear();
    };
  }, []);

  function open(cv: MessageToastItem) {
    const t = timers.current.get(cv.conversationId);
    if (t) window.clearTimeout(t);
    timers.current.delete(cv.conversationId);
    setItems((cur) => cur.filter((m) => m.conversationId !== cv.conversationId));
    onOpenChat(cv.conversationId);
  }

  if (items.length === 0) return null;

  return (
    <div className="msgtoasts" role="region" aria-label="Nouveaux messages">
      {items.map((cv) => (
        <button
          key={cv.conversationId}
          type="button"
          className="msgtoast"
          onClick={() => open(cv)}
          aria-label={`Nouveau message de ${cv.name} — ouvrir la conversation`}
        >
          {cv.photoUrl && !cv.photoBlurred ? (
            <img className="msgtoast-ava" src={cv.photoUrl} alt="" />
          ) : (
            <span className="msgtoast-ava msgtoast-ava-letter" aria-hidden="true">
              {cv.name[0]?.toUpperCase() ?? '?'}
            </span>
          )}
          <span className="msgtoast-body">
            <span className="msgtoast-head">
              <strong>{cv.name}</strong>
              <span className="msgtoast-origin" aria-label="Univers d'origine">
                {ORIGIN_ICON[cv.originMode] ?? ''}
              </span>
            </span>
            <span className="msgtoast-excerpt">{cv.excerpt}</span>
          </span>
        </button>
      ))}
    </div>
  );
}
