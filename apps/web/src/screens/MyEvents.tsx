/**
 * Wairyu Moments — écran MES ÉVÉNEMENTS (Task 39, demande fondateur :
 * PROMPT « Wairyu Moments »).
 *
 * 4 onglets deep-linkables (Task 36 : chaque onglet a son URL) :
 *   #/events/mes/a-venir · #/events/mes/organises · #/events/mes/passes
 *   #/events/mes/billets (+ alias anglais upcoming/organized/past/tickets)
 *
 * Contenu mixte et honnête :
 *  · À venir = tes inscriptions RÉELLES locales (joinEvent) + entrées d'aperçu ;
 *  · Organisés = tes créations RÉELLES locales (formulaire Créer) + aperçu ;
 *  · Passés = souvenirs d'aperçu ;
 *  · Mes billets = un billet (code WRYU-XXXX + QR) par inscription réelle.
 */
import { useMemo, useState } from 'react';
import { EvCheckin } from '../components/EvCheckin';
import {
  EV_MINE_SEED,
  createdAsMine,
  evAll,
  evDateLabel,
  getJoined,
  ticketCode,
  type EvEvent,
  type EvMineEntry,
} from '../lib/events';

export type EvMineTab = 'upcoming' | 'organized' | 'past' | 'tickets';

const TABS: { id: EvMineTab; label: string }[] = [
  { id: 'upcoming', label: 'À venir' },
  { id: 'organized', label: 'Organisés' },
  { id: 'past', label: 'Passés' },
  { id: 'tickets', label: 'Mes billets' },
];

interface Props {
  initialTab?: EvMineTab;
  onTabChange: (tab: EvMineTab) => void;
  onDiscover: () => void;
  onCreate: () => void;
  onBackToDating: () => void;
}

export function MyEvents({ initialTab, onTabChange, onDiscover, onCreate, onBackToDating }: Props) {
  const [tab, setTab] = useState<EvMineTab>(initialTab ?? 'upcoming');
  const [checkin, setCheckin] = useState<{ event: EvEvent; code: string } | null>(null);
  const [tick, setTick] = useState(0);

  const selectTab = (t: EvMineTab) => {
    setTab(t);
    onTabChange(t);
  };

  const joinedIds = useMemo(() => getJoined(), [tick]);

  const entries = useMemo<Record<EvMineTab, EvMineEntry[]>>(() => {
    const seedUp = EV_MINE_SEED.filter((m) => m.status === 'upcoming');
    const seedOrg = EV_MINE_SEED.filter((m) => m.status === 'organized');
    const seedPast = EV_MINE_SEED.filter((m) => m.status === 'past');
    const joinedReal = evAll()
      .filter((e) => joinedIds.includes(e.id) && !e.id.startsWith('evp'))
      .map((e) => ({
        id: e.id,
        status: 'upcoming' as const,
        statusLabel: 'À venir',
        dateISO: e.dateISO,
        title: e.title,
        meta: `${evDateLabel(e.dateISO)} · ${e.time} · ${e.place}`,
      }));
    // Inscriptions réelles d'abord, puis l'aperçu — sans doublon.
    const seen = new Set(joinedReal.map((j) => j.title));
    // Organisés = créations RÉELLES (formulaire Créer) puis aperçu.
    const mineCreated = createdAsMine();
    return {
      upcoming: [...joinedReal, ...seedUp.filter((s) => !seen.has(s.title))],
      organized: [...mineCreated, ...seedOrg.filter((s) => !mineCreated.some((m) => m.title === s.title))],
      past: seedPast,
      tickets: [],
    };
  }, [joinedIds, tick]);

  const tickets = useMemo(
    () =>
      evAll()
        .filter((e) => joinedIds.includes(e.id) && !e.id.startsWith('evp'))
        .sort((a, b) => a.dateISO.localeCompare(b.dateISO)),
    [joinedIds],
  );

  return (
    <div className="app ev-page events-mine">
      <header className="ev-head">
        <div className="ev-brand-row">
          <span className="ev-logo">📅 Wairyu</span>
          <button type="button" className="ev-mode-badge" onClick={onBackToDating} aria-label="Revenir au mode rencontre">
            Moments · actif
          </button>
          <span className="ev-head-spacer" />
          <button type="button" className="ev-head-btn" onClick={onDiscover}>
            ← Découvrir
          </button>
        </div>
      </header>

      <header className="wizard-head plain">
        <h1>🎟️ Mes événements</h1>
      </header>

      <div className="ev-mine-tabs" role="tablist" aria-label="Mes événements">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            className={`ev-mine-tab ${tab === t.id ? 'active' : ''}`}
            onClick={() => selectTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab !== 'tickets' && (
        <div className="ev-mine-list">
          {entries[tab].length === 0 && (
            <p className="ev-empty">
              Rien ici pour l'instant —{' '}
              <button type="button" className="ev-link" onClick={onDiscover}>
                découvre les événements
              </button>{' '}
              ou{' '}
              <button type="button" className="ev-link" onClick={onCreate}>
                crée le tien
              </button>
              .
            </p>
          )}
          {entries[tab].map((m) => (
            <article key={m.id} className={`ev-mine-card st-${m.status}`}>
              <span className="ev-mine-date">
                <strong>{evDateLabel(m.dateISO).match(/\d+/)?.[0] ?? ''}</strong>
                <em>{evDateLabel(m.dateISO).split(' ').pop()}</em>
              </span>
              <span className="ev-mine-info">
                <h3>{m.title}</h3>
                <p>{m.meta}</p>
              </span>
              <span className="ev-status-badge">{m.statusLabel}</span>
            </article>
          ))}
          {tab === 'upcoming' && entries.upcoming.length > 0 && (
            <p className="ev-preview-note">Les entrées non liées à une de tes inscriptions font partie de l'aperçu.</p>
          )}
        </div>
      )}

      {tab === 'tickets' && (
        <div className="ev-mine-list">
          {tickets.length === 0 && (
            <div className="ev-empty-block">
              <p className="ev-empty">Aucun billet pour l'instant.</p>
              <button type="button" className="ev-btn ev-btn-solid" onClick={onDiscover}>
                Découvrir des événements
              </button>
            </div>
          )}
          {tickets.map((e) => (
            <article key={e.id} className="ev-ticket-card">
              <span className="ev-ticket-side" aria-hidden="true" />
              <span className="ev-ticket-body">
                <h3>
                  {e.emoji} {e.title}
                </h3>
                <p>
                  {evDateLabel(e.dateISO)} · {e.time} — {e.place}
                </p>
                <span className="ev-ticket-code">{ticketCode(e.id)}</span>
              </span>
              <button
                type="button"
                className="ev-btn ev-btn-solid ev-btn-sm"
                onClick={() => setCheckin({ event: e, code: ticketCode(e.id) })}
              >
                Voir le QR
              </button>
            </article>
          ))}
          {tickets.length > 0 && (
            <p className="ev-preview-note">
              Tes billets réels (aperçu) — le QR scannable sur place activera avec la billetterie.
            </p>
          )}
        </div>
      )}

      {checkin && <EvCheckin event={checkin.event} code={checkin.code} onClose={() => setCheckin(null)} />}
    </div>
  );
}
