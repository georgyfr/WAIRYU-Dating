/**
 * Onglet « Moments » (enrichissement Task 30) — aperçu des événements wairyu.
 *
 * Teaser interactif façon Badoo/Moments : cartes d'événements à venir avec
 * alerte « Me prévenir » (persistée localement — aucune API encore, la
 * fonctionnalité arrivera avec sa mise à jour). Rien n'est trompeur : le
 * bandeau annonce clairement l'aperçu, et l'inscription d'intérêt est un
 * réglage local en attendant l'activation serveur.
 *
 * Task 39 (demande fondateur — PROMPT « Wairyu Moments », mode événementiel) :
 * l'expérience Moments EXISTE désormais en aperçu — bannière d'entrée vers
 * le feed d'événements (#/events), stats locales réelles, section Souvenirs
 * (galeries de démonstration) avec Missed Connections. TOUT le contenu
 * historique du teaser est conservé ci-dessous (append-only).
 */
import { useEffect, useState } from 'react';
import { toast } from '../lib/toast';
import { EvMissed } from '../components/EvMissed';
import { useEventsNav } from '../lib/events-mode';
import { EV_MEMORIES, getCreated, getJoined } from '../lib/events';

const LS_KEY = 'wairyu.moments.notify';

interface MomentEvent {
  id: string;
  emoji: string;
  title: string;
  when: string;
  kind: string;
  desc: string;
  tint: string;
}

/** Aperçu d'événements — le calendrier officiel sera annoncé ici en premier. */
const EVENTS: MomentEvent[] = [
  {
    id: 'defi-photo',
    emoji: '📸',
    title: 'Défi photo de la semaine',
    when: 'Chaque lundi',
    kind: 'Défi communauté',
    desc: 'Un thème, mille regards : publie ta photo autour du thème de la semaine et vote pour les plus sincères. Le top 3 est mis en avant dans la Découverte.',
    tint: 'violet',
  },
  {
    id: 'speed-invisible',
    emoji: '🕯️',
    title: 'Speed-friending Invisible',
    when: 'Bientôt — sessions de 15 min',
    kind: 'Événement virtuel',
    desc: '5 discussions en Mode Invisible, 15 minutes chacune : la personnalité d’abord, les photos seulement à deux. Idéal pour briser la glace autrement.',
    tint: 'noir',
  },
  {
    id: 'soiree-douala',
    emoji: '🎉',
    title: 'Soirée rencontres wairyu',
    when: 'Bientôt — Douala & Yaoundé',
    kind: 'Événement IRL',
    desc: 'La première soirée wairyu en présentiel : icebreakers animés, badges de mode (Classique / Invisible / Interracial), et zéro pression — on vient discuter.',
    tint: 'rose',
  },
  {
    id: 'interculturel',
    emoji: '🌍',
    title: 'Rencontres interculturelles',
    when: 'Bientôt — en ligne',
    kind: 'Live thématique',
    desc: 'Un live mensuel pour les membres du Mode Interracial : témoignages de couples intercontinentaux, conseils visa/voyage, sécurité et questions ouvertes.',
    tint: 'soleil',
  },
];

interface MomentsProps {
  /** Task 39 — CTA de la bannière : ouvre le feed d'événements (#/events). */
  onExploreEvents?: () => void;
  /** Task 39 — badge d'en-tête (contexte Moments) : retour au mode rencontre. */
  onBackToDating?: () => void;
}

export function Moments({ onExploreEvents, onBackToDating }: MomentsProps = {}) {
  const [notify, setNotify] = useState<Record<string, boolean>>({});
  const [flash, setFlash] = useState<string | null>(null);
  const [missedOpen, setMissedOpen] = useState(false);
  const [localStats, setLocalStats] = useState({ billets: 0, crees: 0 });
  // Task 39 : en contexte événementiel, l'en-tête porte le badge de bascule
  // (même comportement que le badge du prototype : clic = basculer de mode).
  const inEvents = useEventsNav();

  // Préférences locales (aucun serveur encore) — un réglage honnête.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setNotify(JSON.parse(raw) as Record<string, boolean>);
    } catch {
      /* stockage indisponible — tant pis, l'état reste en mémoire */
    }
    // Task 39 : stats locales réelles (billets + créations de l'utilisateur).
    setLocalStats({ billets: getJoined().length, crees: getCreated().length });
  }, []);

  const toggleNotify = (id: string) => {
    setNotify((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem(LS_KEY, JSON.stringify(next));
      } catch {
        /* idem */
      }
      if (next[id]) {
        // Toast global (Task 31) — le flash historique reste déclarable/rendu
        // mais n'est plus alimenté (évite le double affichage).
        toast('✓ Rappel activé — tu seras prévenu·e dès l’ouverture des inscriptions.', 'success');
      }
      return next;
    });
  };

  const activeCount = Object.values(notify).filter(Boolean).length;

  return (
    <div className="app moments-page">
      <header className="wizard-head plain">
        <h1>🎬 Moments</h1>
        {inEvents && onBackToDating && (
          <button
            type="button"
            className="ev-mode-badge ev-mode-badge-head"
            onClick={onBackToDating}
            aria-label="Revenir au mode rencontre"
          >
            Moments · actif
          </button>
        )}
        {activeCount > 0 && <span className="head-count">{activeCount}</span>}
      </header>

      {/* ---- Task 39 : l'expérience Moments est là — entrée du mode événementiel ---- */}
      <section className="ev-entry">
        <div className="ev-entry-inner">
          <span className="ev-entry-kicker">Nouveau · mode événementiel</span>
          <h2>Les Moments sont arrivés 🎉</h2>
          <p>
            Afterworks, dîners, randos, speed-dating : découvre les événements
            autour de toi, réserve ta place, reçois ton billet QR — et crée
            même les tiens.
          </p>
          <div className="ev-stats" role="list">
            <div className="ev-stat" role="listitem">
              <strong>{localStats.billets + localStats.crees}</strong>
              <span>événement{localStats.billets + localStats.crees > 1 ? 's' : ''}</span>
            </div>
            <div className="ev-stat" role="listitem">
              <strong>{EV_MEMORIES.length}</strong>
              <span>souvenir{EV_MEMORIES.length > 1 ? 's' : ''}</span>
            </div>
            <div className="ev-stat" role="listitem">
              <strong>∞</strong>
              <span>rencontres</span>
            </div>
          </div>
          <button
            type="button"
            className="ev-btn ev-btn-solid wide"
            onClick={() => (onExploreEvents ? onExploreEvents() : toast('Bientôt disponible !', 'info'))}
          >
            📅 Découvrir les événements
          </button>
        </div>
      </section>

      {/* ---- Task 39 : Souvenirs (galeries de démonstration) ---- */}
      <section className="ev-memories">
        <h2 className="ev-section-title">📸 Souvenirs</h2>
        {EV_MEMORIES.map((m) => (
          <article key={m.id} className="ev-memory-card">
            <div className="ev-memory-cover">
              <img
                src={`https://picsum.photos/seed/${m.coverSeed}/800/400`}
                alt=""
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <span className="ev-memory-veil" aria-hidden="true" />
              <span className="ev-memory-title">
                <strong>{m.title}</strong>
                <em>{m.when}</em>
              </span>
            </div>
            <div className="ev-memory-body">
              <div className="ev-memory-photos">
                {m.seeds.map((s) => (
                  <img
                    key={s}
                    src={`https://picsum.photos/seed/${s}/120/120`}
                    alt=""
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.style.visibility = 'hidden';
                    }}
                  />
                ))}
                {m.extraPhotos > 0 && <span className="ev-memory-more">+{m.extraPhotos}</span>}
              </div>
              <div className="ev-memory-foot">
                <span className="ev-people-count">👥 {m.people} personnes</span>
                <button type="button" className="ev-btn ev-btn-ghost ev-btn-sm" onClick={() => setMissedOpen(true)}>
                  💫 Missed Connections
                </button>
              </div>
            </div>
          </article>
        ))}
        <p className="ev-preview-note">
          Galeries de démonstration — tes propres souvenirs se rempliront dès
          ton premier événement.
        </p>
      </section>

      {missedOpen && <EvMissed onClose={() => setMissedOpen(false)} />}

      <section className="moments-hero">
        <h2>Les Moments wairyu arrivent</h2>
        <p>
          Défis photo, speed-friending en Mode Invisible, soirées réelles, lives
          interculturels — tout ce qui fait la rencontre au-delà du swipe, réuni
          dans un seul onglet. Voici un aperçu de ce qui se prépare :
        </p>
        <div className="hero-chips">
          <span className="chip-hero">📸 Défis hebdo</span>
          <span className="chip-hero">🎉 Événements IRL</span>
          <span className="chip-hero">🕯️ Sessions Invisible</span>
          <span className="chip-hero">🌍 Lives interculturels</span>
        </div>
      </section>

      {flash && <p className="flash-msg">{flash}</p>}

      <div className="moments-grid">
        {EVENTS.map((ev) => (
          <article key={ev.id} className={`moment-card tint-${ev.tint}`}>
            <div className="moment-head">
              <span className="moment-emoji" aria-hidden="true">{ev.emoji}</span>
              <div>
                <h3>{ev.title}</h3>
                <p className="moment-when">
                  {ev.when} · {ev.kind}
                </p>
              </div>
            </div>
            <p className="moment-desc">{ev.desc}</p>
            <button
              type="button"
              className={`btn ${notify[ev.id] ? 'ghost' : 'primary'} small moment-notify`}
              onClick={() => toggleNotify(ev.id)}
              aria-pressed={!!notify[ev.id]}
            >
              {notify[ev.id] ? '✓ Rappel activé' : '🔔 Me prévenir'}
            </button>
          </article>
        ))}
      </div>

      <p className="hint">
        Aperçu de la prochaine mise à jour — les inscriptions réelles seront annoncées ici
        en premier. Les Moments sont inclus gratuitement, comme tout le reste sur wairyu.
      </p>
    </div>
  );
}
