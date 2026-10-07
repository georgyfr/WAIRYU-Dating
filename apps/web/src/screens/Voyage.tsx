/**
 * LE VOYAGE — écran d'accueil de l'app connectée (demande fondateur).
 *
 * Maquette validée par le fondateur (2026-10-07) : héro illustré « Ton voyage
 * commence ici », 4 objectifs (« Ce que ce voyage fait pour toi »), récolte
 * en cours (anneau de progression + prochaine étape), les 6 étapes jalons,
 * les 11 thèmes en pastilles, bannière « Premier arrêt : Le Miroir ».
 *
 * Esprit : ludique SANS jamais dire « jeu » — pas de score, pas de niveau,
 * pas de classement. Le vocabulaire est celui du voyage (mondes, étapes,
 * portraits). Les thèmes premium (👑) sont marqués mais JAMAIS vendus ici.
 *
 * Les mondes s'ouvriront un à un (status 'open' quand les quêtes sont
 * jouables) ; aujourd'hui la page PRÉSENTE le voyage dans son ensemble et
 * renvoie vers Découvrir en attendant l'ouverture du Monde 1.
 */
import { FREE_WORLDS, MILESTONES, OBJECTIVES, TOTAL_QUESTS, WORLDS } from '../lib/voyage';
import type { VoyageObjective } from '../lib/voyage';

interface Props {
  /** Ouvrir l'onglet Découvrir (en attendant l'ouverture du Monde 1). */
  onDiscover: () => void;
}

/* ── Petites icônes SVG (traits, currentColor — zéro dépendance) ── */

function Icon({ d, filled = false }: { d: string; filled?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}

/** Icônes des objectifs : boussole, cœur, cible, étoile (maquette). */
function ObjectiveIcon({ name }: { name: VoyageObjective['icon'] }) {
  if (name === 'compass') {
    return (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <polygon points="15.2,8.8 13.2,13.2 8.8,15.2 10.8,10.8" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (name === 'heart') {
    return <Icon d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />;
  }
  if (name === 'target') {
    return (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="4.5" />
        <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2.5l2.6 6.3 6.9.5-5.2 4.4 1.6 6.7L12 16.8l-5.9 3.6 1.6-6.7L2.5 9.3l6.9-.5z" />
    </svg>
  );
}

/** Étoile 4 branches (en-tête de section objectifs). */
function SparkIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M12 2l2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2z" />
    </svg>
  );
}

export default function Voyage({ onDiscover }: Props) {
  const done = 0; // mondes franchis — remontera des quêtes quand le Monde 1 ouvre
  const total = WORLDS.length;
  const pct = Math.round((done / total) * 100);
  const ringC = 2 * Math.PI * 31; // anneau r=31

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="voyage">
      {/* ---------- Héro : la présentation brève ---------- */}
      <section className="v-hero" aria-labelledby="v-title">
        <img
          src="/img/voyage-hero.webp"
          alt=""
          className="v-hero-img"
          aria-hidden="true"
        />
        <div className="v-hero-body">
          <span className="v-hero-chip">
            <Icon d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z M16 8l-2.5 5.5L8 16l2.5-5.5z" />
            Ton voyage commence ici
          </span>
          <h1 id="v-title" className="v-hero-title">
            Le Voyage
          </h1>
          <p className="v-hero-sub">
            <strong>
              {total} mondes · {TOTAL_QUESTS} étapes
            </strong>
            <span> · une destination : une rencontre qui a du sens.</span>
          </p>
          <p className="v-hero-lede">
            Ici, personne ne te note, personne ne te classe. Tu réponds à ta façon —
            chaque réponse construit ton portrait, affine tes rencontres et fait
            avancer ton voyage. Ce que tu découvres en chemin t&apos;appartient : tu
            choisis ce qui se voit.
          </p>
          <button className="v-hero-cta" onClick={() => scrollTo('v-etapes')}>
            Voir la carte du voyage <span aria-hidden="true">→</span>
          </button>
        </div>
      </section>

      {/* ---------- Ce que ce voyage fait pour toi ---------- */}
      <section className="v-section" aria-labelledby="v-obj-title">
        <div className="v-section-head">
          <h2 id="v-obj-title" className="v-h2">
            <span className="v-h2-ico" style={{ color: '#e8a312' }}>
              <SparkIcon />
            </span>
            Ce que ce voyage fait pour toi
          </h2>
          <span className="v-note-script" aria-hidden="true">
            Simple, rapide, efficace !
          </span>
        </div>
        <div className="v-obj-grid">
          {OBJECTIVES.map((o) => (
            <article key={o.title} className="v-obj">
              <span className="v-obj-ico" style={{ background: o.tile.bg, color: o.tile.fg }}>
                <ObjectiveIcon name={o.icon} />
              </span>
              <h3>{o.title}</h3>
              <p>{o.text}</p>
              <div className="v-obj-foot">
                <span className="v-time">
                  <Icon d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M12 6v6l4 2" />
                  {o.time}
                </span>
                <span className="v-arrow" aria-hidden="true">
                  →
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ---------- Ta récolte en cours ---------- */}
      <section className="v-section" aria-labelledby="v-recolte-title">
        <div className="v-recolte">
          <div
            className="v-ring"
            role="img"
            aria-label={`${done} monde sur ${total} franchi`}
          >
            <svg viewBox="0 0 72 72" aria-hidden="true">
              <circle className="v-ring-track" cx="36" cy="36" r="31" />
              {pct > 0 && (
                <circle
                  className="v-ring-arc"
                  cx="36"
                  cy="36"
                  r="31"
                  strokeDasharray={`${(pct / 100) * ringC} ${ringC}`}
                />
              )}
            </svg>
            <div className="v-ring-center">
              <img src="/icons/favicon-48.png" alt="" width={20} height={20} />
              <strong>
                {done}/{total}
              </strong>
              <span>mondes</span>
            </div>
          </div>
          <div className="v-recolte-mid">
            <h2 id="v-recolte-title" className="v-recolte-title">
              <Icon d="M12 21v-7 M12 14c0-3.2-2.6-5.5-6-5.5 0 3.4 2.6 5.5 6 5.5z M12 14c0-3.2 2.6-5.5 6-5.5 0 3.4-2.6 5.5-6 5.5z" />
              Ta récolte en cours
            </h2>
            <p>Tu es au début de ton voyage. Continue, chaque étape te rapproche de ta destination.</p>
            <div
              className="v-bar"
              role="progressbar"
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Progression du voyage"
            >
              <span style={{ width: `${pct}%` }} />
            </div>
          </div>
          <button className="v-next" onClick={() => scrollTo('v-etapes')}>
            <span className="v-next-ico" aria-hidden="true">
              🏆
            </span>
            <span className="v-next-text">
              <small>Prochaine étape</small>
              <strong>{MILESTONES[0]?.name}</strong>
            </span>
            <span className="v-next-chev" aria-hidden="true">
              ›
            </span>
          </button>
        </div>
      </section>

      {/* ---------- Les étapes du voyage (les 6 jalons = les gains) ---------- */}
      <section className="v-section" id="v-etapes" aria-labelledby="v-etapes-title">
        <div className="v-section-head">
          <h2 id="v-etapes-title" className="v-h2">
            <span className="v-h2-ico" style={{ color: '#2a9aa0' }}>
              <Icon d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2z M9 4v14 M15 6v14" />
            </span>
            Les étapes du voyage
          </h2>
          <button className="v-link" onClick={() => scrollTo('v-themes')}>
            Voir tous les thèmes <span aria-hidden="true">→</span>
          </button>
        </div>
        <ol className="v-steps">
          {MILESTONES.map((m) => (
            <li key={m.num} className="v-step">
              <span className="v-step-num" aria-hidden="true">
                {m.num}
              </span>
              <span className="v-step-ico" style={{ background: m.tile.bg, color: m.tile.fg }} aria-hidden="true">
                {m.emoji}
              </span>
              <div className="v-step-body">
                <h3>
                  {m.name}
                  <span className={m.status === 'now' ? 'v-chip v-chip-now' : 'v-chip v-chip-soon'}>
                    {m.status === 'now' ? 'En cours' : 'À venir'}
                  </span>
                </h3>
                <p>{m.desc}</p>
              </div>
              <span className="v-step-chev" aria-hidden="true">
                ›
              </span>
            </li>
          ))}
        </ol>
      </section>

      {/* ---------- Les thèmes du voyage (les 11 mondes) ---------- */}
      <section className="v-section" id="v-themes" aria-labelledby="v-themes-title">
        <div className="v-section-head">
          <h2 id="v-themes-title" className="v-h2">
            <span className="v-h2-ico" style={{ color: '#33809e' }}>
              <Icon d="M22 9L12 4 2 9l10 5 10-5z M6 11.5V16c0 1.7 2.7 3 6 3s6-1.3 6-3v-4.5" />
            </span>
            Les thèmes du voyage
          </h2>
        </div>
        <p className="v-section-sub">
          Les {total} mondes qui composent ton voyage — {FREE_WORLDS} sont offerts, dont la
          destination.
        </p>
        <ul className="v-themes">
          {WORLDS.map((w) => (
            <li key={w.code} className="v-theme" title={w.note}>
              <span className="v-theme-ico" style={{ background: w.tile.bg, color: w.tile.fg }} aria-hidden="true">
                {w.emoji}
              </span>
              <div className="v-theme-body">
                <h3>
                  {w.shortName}{' '}
                  {!w.free && (
                    <span className="v-prem">
                      👑 <em>Premium</em>
                    </span>
                  )}
                  {w.free && w.num === total && <span className="v-free">Toujours gratuit</span>}
                </h3>
                <p>
                  {w.quests} étape{w.quests > 1 ? 's' : ''}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* ---------- Premier arrêt : Le Miroir ---------- */}
      <section className="v-section" aria-label="Premier arrêt">
        <div className="v-arret">
          <img
            src="/img/voyage-arret.webp"
            alt="Paysage turquoise — le premier monde s'ouvre bientôt"
            className="v-arret-img"
          />
          <div className="v-arret-body">
            <h3>Premier arrêt : Le Miroir</h3>
            <p>
              Le Monde 1 s&apos;ouvre très bientôt. En attendant, explore les profils et
              prépare ta rencontre — ton voyage est déjà commencé.
            </p>
            <div className="v-arret-row">
              <span className="v-arret-ico" aria-hidden="true">
                🧭
              </span>
              <button className="v-arret-btn" onClick={onDiscover}>
                Explorer le Miroir <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
