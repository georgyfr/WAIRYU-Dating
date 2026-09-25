/**
 * Wairyu Moments — écran DÉCOUVRIR du mode événementiel (Task 39, demande
 * fondateur : PROMPT « Wairyu Moments »).
 *
 * Feed d'événements : héros aurora (turquoise→cyan→bleu), chips de
 * catégories, carte « À la une », liste complète avec badges date/prix/type,
 * rangées d'avatars participants et CTA Rejoindre → billet + QR de check-in.
 *
 * Modales de l'écran : détail d'événement (cover + grille infos + participants
 * + encart sécurité), chat de GROUPE (noms d'auteurs affichés + réponse auto),
 * filtres (distance, budget, type, date, 3 switches — filtrage RÉEL des
 * données), notifications, Missed Connections (composant partagé).
 *
 * Données : EV_EVENTS (lib/events.ts) — aperçu clairement libellé ; les
 * inscriptions/créations de l'utilisateur sont réelles côté local (persistées).
 * Aucun appel API — le bassin de rencontre et les préférences serveur ne
 * bougent pas (le mode Moments n'est PAS un DiscoveryMode).
 */
import { useMemo, useRef, useState } from 'react';
import { toast } from '../lib/toast';
import { EvCheckin } from '../components/EvCheckin';
import { EvMissed } from '../components/EvMissed';
import {
  EV_NOTIFS,
  evUpcoming,
  evDateLabel,
  evPriceLabel,
  evPriceShort,
  getJoined,
  initials,
  joinEvent,
  ticketCode,
  type EvEvent,
  type EvType,
} from '../lib/events';

type Cat = 'tous' | EvType;

interface EvFilters {
  distance: number;
  priceMax: number;
  type: 'tous' | EvType;
  when: 'tous' | 'weekend' | 'semaine' | 'mois';
  singles: boolean;
  verified: boolean;
  official: boolean;
}

const DEFAULT_FILTERS: EvFilters = {
  distance: 25,
  priceMax: 5000,
  type: 'tous',
  when: 'tous',
  singles: true,
  verified: true,
  official: false,
};

const CATS: { id: Cat; label: string }[] = [
  { id: 'tous', label: 'Tous' },
  { id: 'cocktail', label: '🍸 Cocktail' },
  { id: 'diner', label: '🍽️ Dîner' },
  { id: 'atelier', label: '🎨 Atelier' },
  { id: 'sport', label: '🏃 Sport' },
  { id: 'culture', label: '🎭 Culture' },
  { id: 'speed', label: '💫 Speed-dating' },
];

interface Msg {
  from: 'in' | 'me';
  author: string;
  text: string;
}

const REPLY_NAMES = ['Amina', 'Yasmine', 'Inès', 'Fatou', 'Sofia', 'Kévin', 'Awa', 'Serge'];
const REPLIES = [
  'On y sera !',
  'Super idée 😄',
  'Qui vient de Yaoundé ?',
  'Hâte de vous rencontrer !',
  'Je ramène des amis !',
  'Le lieu a l\'air top 🔥',
  'On se retrouve à l\'entrée ?',
  'Première fois pour moi — ça se passe comment ?',
  'Enregistré ✅',
];

/** Teinte d'avatar déterministe par prénom. */
function hueOf(name: string): number {
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) % 360;
  return h;
}

/** Filtre temporel : week-end (dans ≤ 7 j sam/dim), semaine (≤ 7 j), mois (≤ 31 j). */
function inWhen(dateISO: string, when: EvFilters['when']): boolean {
  if (when === 'tous') return true;
  const d = new Date(`${dateISO}T12:00:00`);
  const days = (d.getTime() - Date.now()) / 86_400_000;
  if (when === 'mois') return days <= 31;
  if (when === 'semaine') return days <= 7;
  const wd = d.getDay();
  return days <= 7 && (wd === 0 || wd === 6);
}

/** Avatar rond à initiales (pas de photos de démo — cercles prénoms). */
function Avatar({ name, size = 28 }: { name: string; size?: number }) {
  return (
    <span
      className="ev-avatar"
      style={{ width: size, height: size, background: `hsl(${hueOf(name)} 55% 30%)`, fontSize: size * 0.36 }}
    >
      {initials(name)}
    </span>
  );
}

/**
 * Couverture d'événement : photo picsum (seed stable) posée SUR un dégradé
 * + emoji — si la photo ne charge pas (hors-ligne…), le dégradé et l'emoji
 * prennent le relais, la carte n'est jamais cassée.
 */
function Cover({ event, className }: { event: EvEvent; className?: string }) {
  return (
    <div className={`ev-cover ${event.gradient} ${className ?? ''}`}>
      <span className="ev-cover-emoji" aria-hidden="true">{event.emoji}</span>
      <img
        src={`https://picsum.photos/seed/${event.coverSeed}/800/500`}
        alt=""
        loading="lazy"
        onError={(e) => {
          e.currentTarget.style.display = 'none';
        }}
      />
    </div>
  );
}

interface Props {
  /** CTA « Créer un événement » → #/events/creer. */
  onCreate: () => void;
  /** Badge d'en-tête « Moments » → retour au mode rencontre (bascule). */
  onBackToDating: () => void;
}

export function Events({ onCreate, onBackToDating }: Props) {
  const [joinedTick, setJoinedTick] = useState(0); // re-rendu après inscription
  const [cat, setCat] = useState<Cat>('tous');
  const [filters, setFilters] = useState<EvFilters>(DEFAULT_FILTERS);
  const [detail, setDetail] = useState<EvEvent | null>(null);
  const [checkin, setCheckin] = useState<{ event: EvEvent; code: string } | null>(null);
  const [chatEvent, setChatEvent] = useState<EvEvent | null>(null);
  const [chats, setChats] = useState<Record<string, Msg[]>>({});
  const [msgInput, setMsgInput] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [notifsOpen, setNotifsOpen] = useState(false);
  const [missedOpen, setMissedOpen] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  // Feed : à venir uniquement (les événements passés nourrissent les
  // souvenirs et l'onglet « Passés » — jamais le feed).
  const upcoming = useMemo(() => evUpcoming(), [joinedTick]);

  const joined = (id: string) => {
    void joinedTick;
    return joinState(id);
  };

  const featured = useMemo(
    () => upcoming.find((e) => e.featured) ?? null,
    [upcoming],
  );

  const list = useMemo(() => {
    const base = upcoming.filter((e) => !e.featured);
    return base.filter((e) => {
      if (cat !== 'tous' && e.type !== cat) return false;
      if (filters.type !== 'tous' && e.type !== filters.type) return false;
      if (e.price > filters.priceMax) return false;
      if (e.distanceKm > filters.distance) return false;
      if (!inWhen(e.dateISO, filters.when)) return false;
      if (filters.official && !e.official) return false;
      return true;
    });
  }, [upcoming, cat, filters]);

  const featuredVisible = !!featured && (cat === 'tous' || featured.type === cat) &&
    featured.price <= filters.priceMax &&
    (filters.type === 'tous' || featured.type === filters.type) &&
    featured.distanceKm <= filters.distance &&
    inWhen(featured.dateISO, filters.when) &&
    (!filters.official || featured.official);

  /** Rejoindre : inscription locale persistée + billet (QR) après 600 ms. */
  const doJoin = (event: EvEvent) => {
    const code = joinEvent(event.id);
    setJoinedTick((t) => t + 1);
    toast('✅ Réservation confirmée ! Ton billet t\'attend.', 'success');
    window.setTimeout(() => setCheckin({ event, code }), 600);
  };

  // ---- Chat de groupe (aperçu — messages de session, réponse auto) ----
  const openChat = (event: EvEvent) => {
    setChatEvent(event);
    setChats((prev) => {
      if (prev[event.id]) return prev;
      return {
        ...prev,
        [event.id]: [
          { from: 'in', author: 'Wairyu Officiel', text: 'Bienvenue dans le chat de l\'événement ! Présente-toi en une phrase 🙂' },
          { from: 'in', author: 'Amina', text: 'Salut tout le monde !' },
          { from: 'in', author: 'Yasmine', text: 'Hâte de vous rencontrer !' },
        ],
      };
    });
  };

  const sendMsg = () => {
    if (!chatEvent || !msgInput.trim()) return;
    const text = msgInput.trim();
    setMsgInput('');
    setChats((prev) => ({ ...prev, [chatEvent.id]: [...(prev[chatEvent.id] ?? []), { from: 'me', author: 'Toi', text }] }));
    // Réponse auto d'un participant aléatoire après 1,5 s (comme le prototype).
    window.setTimeout(() => {
      const author = REPLY_NAMES[Math.floor(Math.random() * REPLY_NAMES.length)] ?? 'Amina';
      const reply = REPLIES[Math.floor(Math.random() * REPLIES.length)] ?? 'On y sera !';
      setChats((prev2) => ({
        ...prev2,
        [chatEvent.id]: [...(prev2[chatEvent.id] ?? []), { from: 'in', author, text: reply }],
      }));
    }, 1500);
  };

  const scrollToEvents = () => {
    listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    toast(`📍 ${list.length + (featuredVisible ? 1 : 0)} événements autour de toi`, 'info');
  };

  return (
    <div className="app ev-page events-discover">
      {/* ---- En-tête Moments : logo, badge bascule, filtres, notifs ---- */}
      <header className="ev-head">
        <div className="ev-brand-row">
          <span className="ev-logo">📅 Wairyu</span>
          <button type="button" className="ev-mode-badge" onClick={onBackToDating}
            aria-label="Revenir au mode rencontre">
            Moments · actif
          </button>
          <span className="ev-head-spacer" />
          <button type="button" className="ev-head-btn" onClick={() => setFiltersOpen(true)}>
            ⚙️ Filtres
          </button>
          <button
            type="button"
            className="ev-head-btn ev-bell"
            onClick={() => setNotifsOpen(true)}
            aria-label="Notifications"
          >
            🔔
            <span className="ev-bell-dot" aria-hidden="true" />
          </button>
        </div>
      </header>

      {/* ---- Héros aurora ---- */}
      <section className="ev-hero">
        <h1>
          Rencontres réelles <span className="ev-hero-bolt">⚡</span>
        </h1>
        <p>
          Des événements pour se voir en vrai — créés par la communauté wairyu,
          autour de toi, ce week-end ou le mois prochain.
        </p>
        <div className="ev-hero-ctas">
          <button type="button" className="ev-btn ev-btn-white" onClick={onCreate}>
            Créer un événement
          </button>
          <button type="button" className="ev-btn ev-btn-outline" onClick={scrollToEvents}>
            Autour de moi
          </button>
        </div>
      </section>

      {/* ---- Catégories ---- */}
      <div className="ev-cats" role="tablist" aria-label="Catégories d'événements">
        {CATS.map((c) => (
          <button
            key={c.id}
            type="button"
            role="tab"
            aria-selected={cat === c.id}
            className={`ev-cat ${cat === c.id ? 'active' : ''}`}
            onClick={() => setCat(c.id)}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* ---- À la une ---- */}
      {featured && featuredVisible && (
        <section className="ev-section">
          <h2 className="ev-section-title">À la une</h2>
          <article className="ev-featured" onClick={() => setDetail(featured)}>
            <Cover event={featured} className="ev-featured-cover" />
            <span className="ev-featured-badge">À la une</span>
            <span className={`ev-price-badge ${featured.price === 0 ? 'free' : ''}`}>
              {evPriceShort(featured.price)}
            </span>
            <div className="ev-featured-body">
              <h3>{featured.title}</h3>
              <p className="ev-meta">
                {evDateLabel(featured.dateISO)} · {featured.time} — {featured.place}
              </p>
              <div className="ev-featured-foot">
                <div className="ev-people">
                  <span className="ev-people-stack">
                    {featured.attendees.slice(0, 4).map((n) => (
                      <Avatar key={n} name={n} />
                    ))}
                  </span>
                  <span className="ev-people-count">
                    {featured.count}/{featured.max} inscrits
                  </span>
                </div>
                <button
                  type="button"
                  className="ev-btn ev-btn-solid"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDetail(featured);
                  }}
                >
                  Voir
                </button>
              </div>
            </div>
          </article>
        </section>
      )}

      {/* ---- Tous les événements ---- */}
      <section className="ev-section" ref={listRef}>
        <h2 className="ev-section-title">Tous les événements</h2>
        {list.length === 0 && (
          <p className="ev-empty">
            Aucun événement ne matche ces filtres — élargis un peu 🙏
          </p>
        )}
        <div className="ev-grid">
          {list.map((e) => {
            const isIn = joined(e.id);
            return (
              <article key={e.id} className="ev-card" onClick={() => setDetail(e)}>
                <Cover event={e} className="ev-card-cover" />
                <span className="ev-date-badge">
                  <strong>{evDateLabel(e.dateISO).match(/\d+/)?.[0] ?? ''}</strong>
                  <em>{evDateLabel(e.dateISO).split(' ').pop()}</em>
                </span>
                <span className={`ev-price-badge ${e.price === 0 ? 'free' : ''}`}>
                  {evPriceShort(e.price)}
                </span>
                <span className="ev-type-badge">
                  {e.emoji} {e.typeLabel}
                </span>
                <div className="ev-card-body">
                  <h3>{e.title}</h3>
                  <p className="ev-meta">
                    {e.time} — {e.place}
                  </p>
                  <div className="ev-card-foot">
                    <span className="ev-people-stack">
                      {e.attendees.slice(0, 3).map((n) => (
                        <Avatar key={n} name={n} />
                      ))}
                      <span className="ev-people-count">{e.count}</span>
                    </span>
                    <button
                      type="button"
                      className={`ev-btn ev-btn-sm ${isIn ? 'ev-btn-joined' : 'ev-btn-solid'}`}
                      onClick={(ev) => {
                        ev.stopPropagation();
                        if (isIn) {
                          setCheckin({ event: e, code: ticketCode(e.id) });
                        } else {
                          doJoin(e);
                        }
                      }}
                    >
                      {isIn ? 'Inscrit ✓' : 'Rejoindre'}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <p className="ev-preview-note">
        Aperçu Wairyu Moments — les événements affichés sont une démonstration ;
        tes inscriptions et tes créations restent enregistrées sur cet appareil.
      </p>

      {/* ---- Modale détail ---- */}
      {detail && (
        <div className="modal-overlay ev-overlay" onClick={() => setDetail(null)}>
          <div
            className="modal-card ev-modal ev-detail"
            role="dialog"
            aria-modal="true"
            aria-label={detail.title}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="ev-detail-cover-wrap">
              <Cover event={detail} className="ev-detail-cover" />
              <button
                type="button"
                className="ev-back"
                onClick={() => setDetail(null)}
                aria-label="Retour"
              >
                ←
              </button>
              <span className="ev-type-badge">{detail.emoji} {detail.typeLabel}</span>
            </div>
            <div className="modal-body ev-modal-body">
              <h2 className="ev-detail-title">{detail.title}</h2>
              <p className="ev-organizer">
                <Avatar name={detail.organizer} size={34} />
                <span>
                  Organisé par <strong>{detail.organizer}</strong>
                  {detail.official && <em className="ev-org-official"> · officiel wairyu</em>}
                </span>
              </p>
              <div className="ev-info-grid">
                <div>
                  <small>Date</small>
                  <strong>{evDateLabel(detail.dateISO)}</strong>
                </div>
                <div>
                  <small>Heure</small>
                  <strong>{detail.time}</strong>
                </div>
                <div>
                  <small>Lieu</small>
                  <strong>{detail.place}</strong>
                </div>
                <div>
                  <small>Prix</small>
                  <strong>{evPriceLabel(detail.price)}</strong>
                </div>
              </div>
              <p className="ev-detail-desc">{detail.desc}</p>
              <div className="ev-detail-people">
                <span className="ev-people-stack">
                  {detail.attendees.slice(0, 6).map((n) => (
                    <Avatar key={n} name={n} size={30} />
                  ))}
                </span>
                <span className="ev-people-count">
                  {detail.count}/{detail.max} inscrits — {detail.max - detail.count} places restantes
                </span>
              </div>
              {detail.rules && (
                <div className="ev-safety">
                  🛡️ <span><strong>Bon à savoir :</strong> {detail.rules}</span>
                </div>
              )}
              <div className="ev-detail-ctas">
                {joined(detail.id) ? (
                  <>
                    <button
                      type="button"
                      className="ev-btn ev-btn-solid wide"
                      onClick={() => {
                        const ev = detail;
                        setDetail(null);
                        window.setTimeout(() => setCheckin({ event: ev, code: ticketCode(ev.id) }), 200);
                      }}
                    >
                      🎟️ Inscrit ✓ — Voir mon billet
                    </button>
                    <button
                      type="button"
                      className="ev-btn ev-btn-ghost wide"
                      onClick={() => {
                        const ev = detail;
                        setDetail(null);
                        window.setTimeout(() => openChat(ev), 200);
                      }}
                    >
                      💬 Chat de l'événement
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className="ev-btn ev-btn-solid wide"
                    onClick={() => doJoin(detail)}
                  >
                    {detail.price === 0
                      ? 'Participer — Gratuit'
                      : `Réserver ma place — ${evPriceLabel(detail.price)}`}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---- Modale filtres ---- */}
      {filtersOpen && (
        <div className="modal-overlay ev-overlay" onClick={() => setFiltersOpen(false)}>
          <div
            className="modal-card ev-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Filtres"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-head ev-modal-head">
              <h2>Filtres</h2>
              <button type="button" className="modal-close ev-close" onClick={() => setFiltersOpen(false)} aria-label="Fermer">
                ×
              </button>
            </div>
            <div className="modal-body ev-modal-body">
              <label className="ev-filter-block">
                <span>Distance — jusqu'à <strong>{filters.distance} km</strong></span>
                <input
                  type="range"
                  min={1}
                  max={100}
                  value={filters.distance}
                  onChange={(e) => setFilters({ ...filters, distance: Number(e.target.value) })}
                />
              </label>
              <label className="ev-filter-block">
                <span>
                  Budget max —{' '}
                  <strong>{filters.priceMax >= 10000 ? 'illimité' : evPriceLabel(filters.priceMax)}</strong>
                </span>
                <input
                  type="range"
                  min={0}
                  max={10000}
                  step={500}
                  value={filters.priceMax}
                  onChange={(e) => setFilters({ ...filters, priceMax: Number(e.target.value) })}
                />
              </label>
              <div className="ev-filter-block">
                <span>Type d'événement</span>
                <div className="ev-chip-row">
                  {(['tous', 'cocktail', 'diner', 'atelier', 'sport', 'culture'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      className={`ev-chip ${filters.type === t ? 'active' : ''}`}
                      onClick={() => setFilters({ ...filters, type: t })}
                    >
                      {t === 'tous' ? 'Tous' : CATS.find((c) => c.id === t)?.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="ev-filter-block">
                <span>Date</span>
                <div className="ev-chip-row">
                  {([['tous', 'Peu importe'], ['weekend', 'Ce week-end'], ['semaine', 'Cette semaine'], ['mois', 'Ce mois']] as const).map(
                    ([id, label]) => (
                      <button
                        key={id}
                        type="button"
                        className={`ev-chip ${filters.when === id ? 'active' : ''}`}
                        onClick={() => setFilters({ ...filters, when: id })}
                      >
                        {label}
                      </button>
                    ),
                  )}
                </div>
              </div>
              <div className="ev-switch-row">
                <span>Célibataires uniquement</span>
                <button
                  type="button"
                  className={`ev-switch ${filters.singles ? 'on' : ''}`}
                  role="switch"
                  aria-checked={filters.singles}
                  onClick={() => setFilters({ ...filters, singles: !filters.singles })}
                />
              </div>
              <div className="ev-switch-row">
                <span>Uniquement membres vérifiés</span>
                <button
                  type="button"
                  className={`ev-switch ${filters.verified ? 'on' : ''}`}
                  role="switch"
                  aria-checked={filters.verified}
                  onClick={() => setFilters({ ...filters, verified: !filters.verified })}
                />
              </div>
              <div className="ev-switch-row">
                <span>Événements wairyu officiels</span>
                <button
                  type="button"
                  className={`ev-switch ${filters.official ? 'on' : ''}`}
                  role="switch"
                  aria-checked={filters.official}
                  onClick={() => setFilters({ ...filters, official: !filters.official })}
                />
              </div>
              <button
                type="button"
                className="ev-btn ev-btn-ghost wide"
                onClick={() => setFilters(DEFAULT_FILTERS)}
              >
                Réinitialiser
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---- Modale notifications ---- */}
      {notifsOpen && (
        <div className="modal-overlay ev-overlay" onClick={() => setNotifsOpen(false)}>
          <div
            className="modal-card ev-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Notifications"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-head ev-modal-head">
              <h2>Notifications</h2>
              <button type="button" className="modal-close ev-close" onClick={() => setNotifsOpen(false)} aria-label="Fermer">
                ×
              </button>
            </div>
            <div className="modal-body ev-modal-body">
              <div className="ev-notif-list">
                {EV_NOTIFS.map((n) => (
                  <div key={n.id} className="ev-notif-row">
                    <span className={`ev-notif-ico kind-${n.kind}`}>
                      {n.kind === 'event' ? '📅' : n.kind === 'ticket' ? '🎟️' : n.kind === 'reminder' ? '⏰' : '💫'}
                    </span>
                    <span className="ev-notif-txt">
                      <strong>{n.title}</strong>
                      <p>{n.text}</p>
                      <small>{n.when}</small>
                    </span>
                  </div>
                ))}
              </div>
              <p className="ev-preview-note">Aperçu — les notifications réelles activeront avec la billetterie.</p>
            </div>
          </div>
        </div>
      )}

      {/* ---- Modale chat de groupe ---- */}
      {chatEvent && (
        <div className="modal-overlay ev-overlay" onClick={() => setChatEvent(null)}>
          <div
            className="modal-card ev-modal ev-chat"
            role="dialog"
            aria-modal="true"
            aria-label={`Chat — ${chatEvent.title}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-head ev-modal-head ev-chat-head">
              <span
                className="ev-avatar ev-chat-avatar"
                style={{ background: `hsl(${hueOf(chatEvent.id)} 55% 30%)`, fontSize: 20 }}
                aria-hidden="true"
              >
                {chatEvent.emoji}
              </span>
              <span className="ev-chat-title">
                <strong>{chatEvent.title}</strong>
                <small>📍 {chatEvent.count} participants</small>
              </span>
              <button type="button" className="modal-close ev-close" onClick={() => setChatEvent(null)} aria-label="Fermer">
                ×
              </button>
            </div>
            <div className="modal-body ev-modal-body ev-chat-body">
              {(chats[chatEvent.id] ?? []).map((m, i) => (
                <div key={i} className={`ev-msg ${m.from}`}>
                  {m.from === 'in' && <Avatar name={m.author} size={26} />}
                  <span className="ev-msg-bubble">
                    {m.from === 'in' && <em className="ev-msg-author">{m.author}</em>}
                    {m.text}
                  </span>
                </div>
              ))}
            </div>
            <div className="ev-chat-input">
              <input
                type="text"
                placeholder="Écris au groupe…"
                value={msgInput}
                onChange={(e) => setMsgInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') sendMsg();
                }}
              />
              <button type="button" className="ev-btn ev-btn-solid" onClick={sendMsg}>
                Envoyer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---- Billet / check-in ---- */}
      {checkin && (
        <EvCheckin event={checkin.event} code={checkin.code} onClose={() => setCheckin(null)} />
      )}

      {/* ---- Missed Connections ---- */}
      {missedOpen && <EvMissed onClose={() => setMissedOpen(false)} />}

      {/* Accès Missed Connections depuis le feed (bandeau discret) */}
      <button type="button" className="ev-missed-cta" onClick={() => setMissedOpen(true)}>
        💫 Tu as croisé quelqu'un à un événement ? <strong>Missed Connections</strong>
      </button>
    </div>
  );
}

/** Lecture directe de l'état d'inscription (re-rendu piloté par joinedTick). */
function joinState(id: string): boolean {
  return getJoined().includes(id);
}
