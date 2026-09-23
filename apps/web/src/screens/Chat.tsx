/**
 * Chat temps réel (Étape 6) — canvas commun aux deux modes (spécification §4.9).
 *
 *  - WebSocket via ticket (same-origin, cookies inclus aussi — le ticket
 *    unifie navigateur/PA/tests) vers le Durable Object de la conversation ;
 *  - messages texte (optimistes + accusé « vu »), voice notes (MediaRecorder
 *    → Opus/WebM → upload signé → lecture par URL authentifiée) ;
 *  - présence + « est en train d'écrire… » + reconnexion automatique ;
 *  - RÉVÉLATION (§4.5) : carte d'éligibilité (≥ 15 messages ET ≥ 7 jours),
 *    double confirmation avant demande, consentement de l'autre, écran de
 *    feedback post-révélation (Continuer / Ami / Pas pour moi) ;
 *  - anti-capture honnête (plan 6.6) : filigrane prénom + date sur les photos
 *    révélées + rappel éducatif — sans promettre l'impossible ;
 *  - unmatch propre (+ blocage optionnel) : sortie des DEUX côtés, re-floutage
 *    immédiat côté API (§4.5.4), la conversation disparaît pour chacun.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { api, apiForm, ApiError } from '../lib/api';
import { CHAT, REPORT_CATEGORIES, REPORT_LABELS } from '@wairyu/shared';
import type {
  ChatHistoryResponse,
  ChatMessageDto,
  ChatStateResponse,
  RevealFeedbackResponse,
  RevealResponse,
  ReportResponse,
  ReportCategory,
  CheckinCreateResponse,
  UnmatchResponse,
  WsTicketResponse,
} from '@wairyu/shared';

interface Props {
  conversationId: string;
  onBack: () => void;
}

type WsEvent = {
  type: string;
  [k: string]: unknown;
};

const EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '🙏'];

const FEEDBACK_LABELS: Record<string, string> = {
  continue: 'On continue ✨',
  friend: 'Ami·e 🤝',
  not_for_me: 'Pas pour moi 🌱',
};

export function Chat({ conversationId, onBack }: Props) {
  const [state, setState] = useState<ChatStateResponse | null>(null);
  const [messages, setMessages] = useState<ChatMessageDto[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [flash, setFlash] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const [otherTyping, setOtherTyping] = useState(false);
  const [online, setOnline] = useState(false);
  const [otherReadSeq, setOtherReadSeq] = useState(0);
  const [confirmReveal, setConfirmReveal] = useState(false);
  const [confirmUnmatch, setConfirmUnmatch] = useState(false);
  const [blockToo, setBlockToo] = useState(false);
  // Étape 7 — sécurité : signalement + check-in « je vois X le … »
  const [showSafety, setShowSafety] = useState<'none' | 'report' | 'checkin'>('none');
  const [reportCategory, setReportCategory] = useState<ReportCategory>('behavior');
  const [reportDetails, setReportDetails] = useState('');
  const [checkinDate, setCheckinDate] = useState('');
  const [recording, setRecording] = useState(false);
  const [recSeconds, setRecSeconds] = useState(0);
  const [connState, setConnState] = useState<'connecting' | 'open' | 'closed'>('connecting');

  const seen = useRef<Set<number>>(new Set());
  const wsRef = useRef<WebSocket | null>(null);
  const meRef = useRef<string>('');
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recTimerRef = useRef<number | null>(null);
  const typingSentAt = useRef<number>(0);

  const showFlash = useCallback((msg: string) => {
    setFlash(msg);
    window.setTimeout(() => setFlash(null), 4000);
  }, []);

  const addMessage = useCallback((m: ChatMessageDto) => {
    if (seen.current.has(m.seq)) return;
    seen.current.add(m.seq);
    setMessages((prev) => [...prev, m]);
  }, []);

  // ------------------------------------------------------------------
  // Chargement initial (état + historique)
  // ------------------------------------------------------------------

  const loadState = useCallback(async () => {
    try {
      const s = await api<ChatStateResponse>(`/api/chat/${conversationId}/state`);
      setState(s);
      return s;
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Erreur inattendue.');
      return null;
    }
  }, [conversationId]);

  const loadHistory = useCallback(
    async (before?: number) => {
      try {
        const q = before ? `?before=${before}` : '';
        const h = await api<ChatHistoryResponse>(`/api/chat/${conversationId}/history${q}`);
        for (const m of h.messages) {
          if (!seen.current.has(m.seq)) {
            seen.current.add(m.seq);
            setMessages((prev) => [m, ...prev]);
          }
        }
        setHasMore(h.hasMore);
        setOtherReadSeq(h.otherReadSeq);
        return h;
      } catch (err) {
        setError(err instanceof ApiError ? err.message : 'Erreur inattendue.');
        return null;
      }
    },
    [conversationId],
  );

  useEffect(() => {
    void loadState();
    void loadHistory();
  }, [loadState, loadHistory]);

  // ------------------------------------------------------------------
  // WebSocket (ticket) + reconnexion
  // ------------------------------------------------------------------

  useEffect(() => {
    let closedByUs = false;
    let attempts = 0;
    let reconnectTimer: number | null = null;

    const connect = async () => {
      setConnState('connecting');
      try {
        const t = await api<WsTicketResponse>(`/api/chat/${conversationId}/ws-ticket`);
        const ws = new WebSocket(t.url);
        wsRef.current = ws;

        ws.onopen = () => {
          attempts = 0;
          setConnState('open');
          // Protocole : hello → ready (les envois pendant l'upgrade sont perdus).
          ws.send(JSON.stringify({ type: 'hello' }));
        };
        ws.onmessage = (ev) => {
          let data: WsEvent;
          try {
            data = JSON.parse(ev.data as string);
          } catch {
            return;
          }
          if (data.type === 'ready' && typeof data.you === 'string') {
            meRef.current = data.you;
          }
          handle(data);
        };
        ws.onclose = () => {
          setConnState('closed');
          wsRef.current = null;
          if (!closedByUs && attempts < 5) {
            attempts++;
            reconnectTimer = window.setTimeout(() => void connect(), 1500 * attempts);
          }
        };
        ws.onerror = () => ws.close();
      } catch {
        // Ticket refusé (conversation fermée…) — pas de reconnexion en boucle.
        setError('Conversation indisponible.');
      }
    };

    const handle = (data: WsEvent) => {
      switch (data.type) {
        case 'ready': {
          setOnline(data.otherOnline === true);
          setOtherReadSeq(Number(data.otherReadSeq) || 0);
          return;
        }
        case 'msg': {
          const m = data.message as ChatMessageDto | undefined;
          if (m) {
            addMessage(m);
            // Conversation ouverte = lecture immédiate → accusé « vu ».
            if (m.senderId !== meRef.current) {
              wsRef.current?.send(JSON.stringify({ type: 'read', upto: m.seq }));
            }
          }
          return;
        }
        case 'typing': {
          setOtherTyping(data.on === true);
          if (data.on === true) {
            window.setTimeout(() => setOtherTyping(false), 4000);
          }
          return;
        }
        case 'read': {
          if (data.by !== meRef.current) setOtherReadSeq(Number(data.upto) || 0);
          return;
        }
        case 'presence': {
          setOnline(data.online === true);
          return;
        }
        case 'system': {
          const event = String(data.event ?? '');
          if (event === 'reveal_requested') {
            showFlash('Révélation demandée — décision à prendre ci-dessous.');
            void loadState();
          } else if (event === 'reveal_accepted') {
            showFlash('Photos révélées — vous sautez le pas ensemble ✨');
            void loadState();
          } else if (event === 'reveal_declined') {
            showFlash('Révélation refusée — la conversation continue en Invisible.');
            void loadState();
          } else if (event === 'unmatched') {
            showFlash('Conversation fermée par l’autre — retour aux matchs.');
            window.setTimeout(onBack, 1600);
          }
          return;
        }
        default:
          return;
      }
    };

    void connect();

    return () => {
      closedByUs = true;
      if (reconnectTimer) window.clearTimeout(reconnectTimer);
      wsRef.current?.close(1000, 'unmount');
      wsRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  // Marque lu au chargement d'une nouvelle page d'historique.
  useEffect(() => {
    const last = messages.at(-1);
    if (last) {
      wsRef.current?.send(JSON.stringify({ type: 'read', upto: last.seq }));
    }
  }, [messages.length]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-scroll en bas.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages.length, otherTyping]);

  // ------------------------------------------------------------------
  // Envoi
  // ------------------------------------------------------------------

  const sendDraft = useCallback(() => {
    const text = draft.trim();
    if (!text) return;
    setDraft('');
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      // L'écho du DO (même message + seq) remplacera le vide local.
      wsRef.current.send(JSON.stringify({ type: 'msg', body: text }));
    } else {
      void api<{ ok: true; message: ChatMessageDto }>(`/api/chat/${conversationId}/messages`, {
        json: { text },
      })
        .then((r) => addMessage(r.message))
        .catch((err) => {
          setError(err instanceof ApiError ? err.message : 'Envoi impossible.');
          setDraft(text);
        });
    }
  }, [draft, conversationId, addMessage]);

  const onDraftChange = useCallback((v: string) => {
    setDraft(v);
    // Indicateur de saisie (throttlé : 1/2 s max).
    const now = Date.now();
    if (v && now - typingSentAt.current > 2000) {
      typingSentAt.current = now;
      wsRef.current?.send(JSON.stringify({ type: 'typing', on: true }));
    }
  }, []);

  const sendEmoji = useCallback((e: string) => {
    setDraft((d) => (d + e).slice(0, CHAT.maxTextLength));
  }, []);

  // ------------------------------------------------------------------
  // Voice notes
  // ------------------------------------------------------------------

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      chunksRef.current = [];
      rec.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      rec.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        if (recTimerRef.current) window.clearInterval(recTimerRef.current);
        setRecording(false);
        const durationMs = Date.now() - recStart;
        if (chunksRef.current.length === 0) return;
        const blob = new Blob(chunksRef.current, { type: rec.mimeType || 'audio/webm' });
        if (blob.size > CHAT.voiceMaxBytes) {
          setError('Voice note trop longue — reste sous 60 secondes.');
          return;
        }
        const form = new FormData();
        form.append('file', blob, 'note.webm');
        form.append('durationMs', String(Math.round(durationMs)));
        try {
          const r = await apiForm<{ ok: true; message: ChatMessageDto }>(
            `/api/chat/${conversationId}/voice`,
            form,
          );
          addMessage(r.message);
        } catch (err) {
          setError(err instanceof ApiError ? err.message : 'Envoi impossible.');
        }
      };
      const recStart = Date.now();
      rec.start();
      recorderRef.current = rec;
      setRecording(true);
      setRecSeconds(0);
      recTimerRef.current = window.setInterval(() => {
        setRecSeconds((s) => {
          if (s + 1 >= CHAT.voiceMaxSeconds) {
            rec.stop();
          }
          return s + 1;
        });
      }, 1000);
    } catch {
      setError('Micro inaccessible — autorise l’enregistrement dans ton navigateur.');
    }
  }, [conversationId, addMessage]);

  const stopRecording = useCallback((send: boolean) => {
    const rec = recorderRef.current;
    if (!rec) return;
    if (!send) {
      // Annulation : jette les chunks.
      rec.onstop = null;
      chunksRef.current = [];
      streamCleanup(rec);
      setRecording(false);
      if (recTimerRef.current) window.clearInterval(recTimerRef.current);
      try {
        rec.stop();
      } catch {
        /* déjà arrêté */
      }
      recorderRef.current = null;
      return;
    }
    recorderRef.current = null;
    rec.stop();
  }, []);

  const streamCleanup = (rec: MediaRecorder) => {
    try {
      rec.stream.getTracks().forEach((t) => t.stop());
    } catch {
      /* ignore */
    }
  };

  // ------------------------------------------------------------------
  // Révélation / feedback / unmatch
  // ------------------------------------------------------------------

  const requestReveal = useCallback(async () => {
    setConfirmReveal(false);
    try {
      const r = await api<RevealResponse>(`/api/chat/${conversationId}/reveal`, { json: {} });
      showFlash(r.note);
      await loadState();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Erreur inattendue.');
    }
  }, [conversationId, loadState, showFlash]);

  const respondReveal = useCallback(
    async (accept: boolean) => {
      try {
        const r = await api<RevealResponse>(`/api/chat/${conversationId}/reveal/respond`, {
          json: { accept },
        });
        showFlash(r.note);
        await loadState();
      } catch (err) {
        setError(err instanceof ApiError ? err.message : 'Erreur inattendue.');
      }
    },
    [conversationId, loadState, showFlash],
  );

  const sendFeedback = useCallback(
    async (feedback: string) => {
      try {
        const r = await api<RevealFeedbackResponse>(`/api/chat/${conversationId}/reveal/feedback`, {
          json: { feedback },
        });
        showFlash(r.note);
        await loadState();
      } catch (err) {
        setError(err instanceof ApiError ? err.message : 'Erreur inattendue.');
      }
    },
    [conversationId, loadState, showFlash],
  );

  const unmatch = useCallback(async () => {
    try {
      const r = await api<UnmatchResponse>(`/api/chat/${conversationId}/unmatch`, {
        json: { block: blockToo },
      });
      setConfirmUnmatch(false);
      showFlash(r.note);
      window.setTimeout(onBack, 1400);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Erreur inattendue.');
    }
  }, [conversationId, blockToo, onBack, showFlash]);

  // ------------------------------------------------------------------
  // Sécurité (Étape 7) — signalement (blocage + unmatch immédiats) et
  // check-in « je vois X le [date] » (rappel push après la date, cron).
  // ------------------------------------------------------------------

  const doReport = useCallback(async () => {
    try {
      const r = await api<ReportResponse>('/api/reports', {
        json: {
          targetUserId: state?.other.userId,
          category: reportCategory,
          details: reportDetails || undefined,
          conversationId,
        },
      });
      setShowSafety('none');
      setReportDetails('');
      showFlash(r.note);
      window.setTimeout(onBack, 1600);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Erreur inattendue.');
    }
  }, [state?.other.userId, reportCategory, reportDetails, conversationId, showFlash, onBack]);

  const doCheckin = useCallback(async () => {
    if (!checkinDate) return;
    try {
      const whenTs = Math.floor(new Date(`${checkinDate}T20:00:00`).getTime() / 1000);
      const r = await api<CheckinCreateResponse>('/api/safety/checkins', {
        json: { conversationId, whenTs },
      });
      setShowSafety('none');
      setCheckinDate('');
      showFlash(r.note);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Erreur inattendue.');
    }
  }, [checkinDate, conversationId, showFlash]);

  // ------------------------------------------------------------------
  // Rendu
  // ------------------------------------------------------------------

  const sorted = useMemo(() => [...messages].sort((a, b) => a.seq - b.seq), [messages]);

  return (
    <div className="app chat">
      <header className="chat-head">
        <button type="button" className="back" onClick={onBack} aria-label="Retour">‹</button>
        {state?.other.photoUrl ? (
          <span className="chat-avatar-wrap">
            <img
              src={state.other.photoUrl}
              alt={state.other.displayName}
              className={`chat-avatar ${state.other.photoBlurred ? 'blurred' : ''}`}
            />
            {state.revealed && (
              <span
                className="wm wm-avatar"
                data-wm={`${state.other.displayName} · ${new Date().toLocaleDateString('fr-FR')}`}
              />
            )}
          </span>
        ) : (
          <span className="chat-avatar empty">✨</span>
        )}
        <div className="chat-head-body">
          <strong>
            {state?.other.displayName ?? '…'}
            {state?.other.verified && (
              <span className="chip chip-verified" title="Selfie reviewé par l'équipe wairyu">
                {' '}✓
              </span>
            )}
          </strong>
          <span className="chat-presence">
            <span className={`dot ${online ? 'ok' : ''}`} />
            {otherTyping ? 'est en train d’écrire…' : online ? 'en ligne' : 'hors ligne'}
          </span>
        </div>
        <span className={`chip chip-conv ${state?.conversationMode ?? 'classic'}`}>
          {state?.conversationMode === 'invisible' ? 'Invisible' : 'Classique'}
        </span>
      </header>

      {/* ---- Sécurité (Étape 7) : check-in + signalement ---- */}
      <div className="safety-row">
        <button
          type="button"
          className="btn ghost safety-btn"
          onClick={() => setShowSafety((v) => (v === 'checkin' ? 'none' : 'checkin'))}
        >
          🛡 Check-in sécurité
        </button>
        <button
          type="button"
          className="btn ghost danger-ghost safety-btn"
          onClick={() => setShowSafety((v) => (v === 'report' ? 'none' : 'report'))}
        >
          ⚠ Signaler
        </button>
      </div>
      {showSafety === 'checkin' && (
        <div className="safety-panel">
          <strong>Je vois {state?.other.displayName ?? 'cette personne'} le…</strong>
          <p className="hint">
            wairyu te contactera après la date : « ça s’est bien passé ? ». En cas de
            problème, tu pourras nous le dire en 1 clic.
          </p>
          <div className="btn-row">
            <input
              type="date"
              value={checkinDate}
              min={new Date().toISOString().slice(0, 10)}
              max={new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10)}
              onChange={(e) => setCheckinDate(e.target.value)}
            />
            <button type="button" className="btn primary" disabled={!checkinDate} onClick={() => void doCheckin()}>
              Enregistrer
            </button>
          </div>
        </div>
      )}
      {showSafety === 'report' && (
        <div className="safety-panel">
          <strong>Signaler {state?.other.displayName ?? 'ce profil'}</strong>
          <p className="hint">
            Le signalement ferme immédiatement la conversation et bloque le profil
            dans les deux sens. Notre équipe review sous 24 h.
          </p>
          <select value={reportCategory} onChange={(e) => setReportCategory(e.target.value as ReportCategory)}>
            {REPORT_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {REPORT_LABELS[cat]}
              </option>
            ))}
          </select>
          <textarea
            placeholder="Détails (facultatif — 500 caractères max)"
            maxLength={500}
            value={reportDetails}
            onChange={(e) => setReportDetails(e.target.value)}
          />
          <div className="btn-row">
            <button type="button" className="btn danger" onClick={() => void doReport()}>
              Signaler et bloquer
            </button>
            <button type="button" className="btn ghost" onClick={() => setShowSafety('none')}>
              Annuler
            </button>
          </div>
        </div>
      )}

      {error && <p className="error">{error}</p>}
      {flash && <p className="flash-msg">{flash}</p>}

      {/* ---- Révélation (§4.5) ---- */}
      {state?.conversationMode === 'invisible' && !state.revealed && state.pendingReveal && (
        <div className="reveal-card pending">
          {state.pendingReveal.fromMe ? (
            <>
              <p>Demande envoyée — {state.other.displayName} peut accepter ou refuser.</p>
              <p className="hint">La révélation n’aura lieu qu’avec son accord explicite.</p>
            </>
          ) : (
            <>
              <p>
                <strong>{state.other.displayName}</strong> est prêt·e à se révéler et te propose la
                même chose.
              </p>
              <p className="hint">
                Accepter débloque vos photos pour vous deux. Refuser ne change rien à la
                conversation.
              </p>
              <div className="btn-row">
                <button type="button" className="btn primary" onClick={() => void respondReveal(true)}>
                  Me révéler aussi
                </button>
                <button type="button" className="btn ghost" onClick={() => void respondReveal(false)}>
                  Pas maintenant
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {state?.conversationMode === 'invisible' && !state.revealed && !state.pendingReveal && (
        <div className="reveal-card">
          {state.revealEligible ? (
            confirmReveal ? (
              <div className="reveal-confirm">
                <p>
                  <strong>Confirmer ?</strong> Vos photos seront visibles l’un pour l’autre. Une
                  capture d’écran reste techniquement possible — ne révèle que ce que tu veux voir
                  circuler.
                </p>
                <div className="btn-row">
                  <button type="button" className="btn primary" onClick={() => void requestReveal()}>
                    Oui, je me révèle
                  </button>
                  <button type="button" className="btn ghost" onClick={() => setConfirmReveal(false)}>
                    Annuler
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="reveal-progress">
                  {state.messagesCount}/{CHAT.revealMinMessages} messages · {state.days}/
                  {CHAT.revealMinDays} jours
                </p>
                <button
                  type="button"
                  className="btn primary"
                  onClick={() => setConfirmReveal(true)}
                >
                  Je suis prêt·e à me révéler
                </button>
              </>
            )
          ) : (
            <p className="hint reveal-progress">
              Révélation à {state.messagesCount}/{CHAT.revealMinMessages} messages et {state.days}/
              {CHAT.revealMinDays} jours — prenez le temps de faire connaissance.
            </p>
          )}
        </div>
      )}

      {state?.revealed && (
        <div className="reveal-card revealed">
          <p className="wm-note">
            Photos révélées le{' '}
            {state.revealedAt
              ? new Date(state.revealedAt * 1000).toLocaleDateString('fr-FR')
              : ''}{' '}
            — les captures d’écran restent possibles, protégez-vous mutuellement.
          </p>
          {!state.myFeedback ? (
            <div className="btn-row">
              {Object.entries(FEEDBACK_LABELS).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  className="btn ghost"
                  onClick={() => void sendFeedback(key)}
                >
                  {label}
                </button>
              ))}
            </div>
          ) : (
            <p className="hint">Ton ressenti est enregistré : {FEEDBACK_LABELS[state.myFeedback]}</p>
          )}
        </div>
      )}

      {/* ---- Messages ---- */}
      <div className="chat-scroll" ref={scrollRef}>
        {hasMore && (
          <button
            type="button"
            className="btn ghost chat-more"
            onClick={() => sorted.length > 0 && void loadHistory(sorted[0]!.seq)}
          >
            Charger les messages plus anciens
          </button>
        )}
        {sorted.length === 0 && (
          <p className="q-done-note">
            Aucun message — écris le premier ! Les photos se révèlent avec le temps (§4.5), jamais
            avant.
          </p>
        )}
        {sorted.map((m) => {
          if (m.kind === 'system') {
            return (
              <p key={m.seq} className="chat-system">
                {m.body}
              </p>
            );
          }
          const mine = meRef.current
            ? m.senderId === meRef.current
            : m.senderId !== state?.other.userId;
          const read = mine && m.seq <= otherReadSeq;
          return (
            <div key={m.seq} className={`chat-row ${mine ? 'mine' : 'theirs'}`}>
              <div className={`bubble ${mine ? 'mine' : 'theirs'}`}>
                {m.kind === 'voice' ? (
                  m.url ? (
                    <audio controls preload="none" src={m.url} />
                  ) : (
                    <span className="hint">Note vocale indisponible</span>
                  )
                ) : (
                  <span className="bubble-text">{m.body}</span>
                )}
                <span className="bubble-meta">
                  {new Date(m.createdAt * 1000).toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                  {mine && <b className={read ? 'seen' : ''}>{read ? ' ✓✓' : ' ✓'}</b>}
                </span>
              </div>
            </div>
          );
        })}
        {otherTyping && (
          <div className="chat-row theirs">
            <div className="bubble theirs typing">
              <span className="dotty" /> <span className="dotty" /> <span className="dotty" />
            </div>
          </div>
        )}
      </div>

      {/* ---- Composer ---- */}
      {recording ? (
        <div className="composer rec">
          <span className="rec-dot" />
          <span>{recSeconds}s — enregistrement…</span>
          <button type="button" className="btn ghost" onClick={() => stopRecording(false)}>
            Annuler
          </button>
          <button type="button" className="btn primary" onClick={() => stopRecording(true)}>
            Envoyer 🎤
          </button>
        </div>
      ) : (
        <div className="composer">
          <div className="emoji-row">
            {EMOJIS.map((e) => (
              <button key={e} type="button" onClick={() => sendEmoji(e)} className="emoji">
                {e}
              </button>
            ))}
          </div>
          <div className="composer-row">
            <button
              type="button"
              className="mic"
              aria-label="Note vocale"
              onClick={() => void startRecording()}
              title="Note vocale (60 s max)"
            >
              🎤
            </button>
            <textarea
              value={draft}
              onChange={(e) => onDraftChange(e.target.value.slice(0, CHAT.maxTextLength))}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendDraft();
                }
              }}
              placeholder="Écris quelque chose de sincère…"
              rows={1}
            />
            <button
              type="button"
              className="btn primary send"
              onClick={sendDraft}
              disabled={!draft.trim() || connState !== 'open'}
              title={connState !== 'open' ? 'Reconnexion…' : 'Envoyer'}
            >
              ➤
            </button>
          </div>
        </div>
      )}

      {/* ---- Zone de danger : unmatch ---- */}
      <div className="chat-danger">
        {confirmUnmatch ? (
          <div className="unmatch-confirm">
            <p>
              <strong>Unmatch ?</strong> La conversation est supprimée des deux côtés et les photos
              re-floutées. C’est définitif.
            </p>
            <label className="check">
              <input
                type="checkbox"
                checked={blockToo}
                onChange={(e) => setBlockToo(e.target.checked)}
              />
              Bloquer aussi ce profil (ne plus jamais le revoir dans la découverte)
            </label>
            <div className="btn-row">
              <button type="button" className="btn danger" onClick={() => void unmatch()}>
                Confirmer l’unmatch
              </button>
              <button type="button" className="btn ghost" onClick={() => setConfirmUnmatch(false)}>
                Annuler
              </button>
            </div>
          </div>
        ) : (
          <button type="button" className="btn ghost danger-link" onClick={() => setConfirmUnmatch(true)}>
            Se dématcher…
          </button>
        )}
      </div>
    </div>
  );
}
