/**
 * Onglet « Moments » (enrichissement Task 30) — aperçu des événements wairyu.
 *
 * Teaser interactif façon Badoo/Moments : cartes d'événements à venir avec
 * alerte « Me prévenir » (persistée localement — aucune API encore, la
 * fonctionnalité arrivera avec sa mise à jour). Rien n'est trompeur : le
 * bandeau annonce clairement l'aperçu, et l'inscription d'intérêt est un
 * réglage local en attendant l'activation serveur.
 */
import { useEffect, useState } from 'react';
import { toast } from '../lib/toast';

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

export function Moments() {
  const [notify, setNotify] = useState<Record<string, boolean>>({});
  const [flash, setFlash] = useState<string | null>(null);

  // Préférences locales (aucun serveur encore) — un réglage honnête.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setNotify(JSON.parse(raw) as Record<string, boolean>);
    } catch {
      /* stockage indisponible — tant pis, l'état reste en mémoire */
    }
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
        {activeCount > 0 && <span className="head-count">{activeCount}</span>}
      </header>

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
