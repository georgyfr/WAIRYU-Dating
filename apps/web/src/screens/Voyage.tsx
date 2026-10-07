/**
 * LE VOYAGE — écran d'accueil de l'app connectée (demande fondateur).
 *
 * Maquette validée par le fondateur (2026-10-07) : héro illustré « Ton voyage
 * commence ici », 4 objectifs (« Ce que ce voyage fait pour toi »), récolte
 * en cours (anneau de progression + prochaine étape), les 6 étapes jalons,
 * les 11 thèmes en pastilles, bannière « Premier arrêt : Le Miroir ».
 *
 * Redesign 2026-10-08 (retour fondateur) : hiérarchie et interlignage du
 * héro, icône voyageur (panneau directionnel), CTA plus visible, icônes
 * uniformisées (bibliothèque SVG dédiée), cartes objectifs centrées avec
 * VRAIS boutons (fini la flèche décorative), barre de récolte segmentée en
 * 11 mondes, « Prochaine étape » attrayante, étapes en cartes espacées avec
 * labels « En cours / Verrouillé », thèmes avec icônes mémorables distinctes
 * et badge Premium élégant (gemme, plus de couronne).
 *
 * Esprit : ludique SANS jamais dire « jeu » — pas de score, pas de niveau,
 * pas de classement. Le vocabulaire est celui du voyage (mondes, étapes,
 * portraits). Les thèmes premium (gemme) sont marqués mais JAMAIS vendus ici.
 *
 * Les mondes s'ouvriront un à un (status 'open' quand les quêtes sont
 * jouables) ; aujourd'hui la page PRÉSENTE le voyage dans son ensemble et
 * renvoie vers Découvrir en attendant l'ouverture du Monde 1.
 */
import { FREE_WORLDS, MILESTONES, OBJECTIVES, TOTAL_QUESTS, WORLDS } from '../lib/voyage';
import type { VoyageObjective } from '../lib/voyage';
import VoyageIcon from '../components/VoyageIcons';
import type { VoyageIconName } from '../components/VoyageIcons';

interface Props {
  /** Ouvrir l'onglet Découvrir (en attendant l'ouverture du Monde 1). */
  onDiscover: () => void;
}

/* ── Petites icônes utilitaires (traits, currentColor) ── */

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  );
}

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

  const runAction = (target: VoyageObjective['action']['target']) => {
    if (target === 'discover') {
      onDiscover();
      return;
    }
    scrollTo(target === 'etapes' ? 'v-etapes' : target === 'themes' ? 'v-themes' : 'v-recolte');
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
            <VoyageIcon name="signpost" size={13} strokeWidth={2.2} />
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
            Voir la carte du voyage
            <span className="v-hero-cta-arrow" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
          </button>
        </div>
      </section>

      {/* ---------- Ce que ce voyage fait pour toi ---------- */}
      <section className="v-section" aria-labelledby="v-obj-title">
        <div className="v-section-head">
          <h2 id="v-obj-title" className="v-h2">
            <span className="v-h2-ico" style={{ color: '#d68f06' }}>
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
                <VoyageIcon name={o.icon as VoyageIconName} size={22} />
              </span>
              <h3>{o.title}</h3>
              <p>{o.text}</p>
              <div className="v-obj-foot">
                <span className="v-time">
                  <ClockIcon />
                  {o.time}
                </span>
                <button className="v-obj-btn" onClick={() => runAction(o.action.target)}>
                  {o.action.label}
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ---------- Ta récolte en cours ---------- */}
      <section className="v-section" id="v-recolte" aria-labelledby="v-recolte-title">
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
              <img src="/icons/favicon-48.png" alt="" width={22} height={22} />
              <strong>
                {done}/{total}
              </strong>
              <span>mondes</span>
            </div>
          </div>
          <div className="v-recolte-mid">
            <h2 id="v-recolte-title" className="v-recolte-title">
              Ta récolte en cours
            </h2>
            <p>Tu es au début de ton voyage. Continue, chaque étape te rapproche de ta destination.</p>
            <div
              className="v-bar"
              role="progressbar"
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Progression du voyage : mondes franchis"
            >
              {WORLDS.map((w, i) => (
                <span key={w.code} className={i < done ? 'v-seg v-seg-done' : 'v-seg'} aria-hidden="true" />
              ))}
            </div>
            <small className="v-bar-label">
              {done} monde{done > 1 ? 's' : ''} franchi{done > 1 ? 's' : ''} sur {total}
            </small>
          </div>
          <button className="v-next" onClick={() => scrollTo('v-etapes')}>
            <span className="v-next-ico" aria-hidden="true">
              <VoyageIcon name="map" size={19} />
            </span>
            <span className="v-next-text">
              <small>Prochaine étape</small>
              <strong>{MILESTONES[0]?.name}</strong>
            </span>
            <span className="v-next-chev" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 5 7 7-7 7" />
              </svg>
            </span>
          </button>
        </div>
      </section>

      {/* ---------- Les étapes du voyage (les 6 jalons = les gains) ---------- */}
      <section className="v-section" id="v-etapes" aria-labelledby="v-etapes-title">
        <div className="v-section-head">
          <h2 id="v-etapes-title" className="v-h2">
            <span className="v-h2-ico" style={{ color: '#2a9aa0' }}>
              <VoyageIcon name="map" size={19} />
            </span>
            Les étapes du voyage
          </h2>
          <button className="v-link" onClick={() => scrollTo('v-themes')}>
            Voir tous les thèmes <span aria-hidden="true">→</span>
          </button>
        </div>
        <ol className="v-steps">
          {MILESTONES.map((m) => (
            <li key={m.num} className={m.status === 'now' ? 'v-step v-step-now' : 'v-step'}>
              <span className="v-step-num" aria-hidden="true">
                {m.num}
              </span>
              <span className="v-step-ico" style={{ background: m.tile.bg, color: m.tile.fg }} aria-hidden="true">
                <VoyageIcon name={m.icon as VoyageIconName} size={22} />
              </span>
              <div className="v-step-body">
                <h3>
                  {m.name}
                  {m.status === 'now' ? (
                    <span className="v-chip v-chip-now">
                      <span className="v-chip-dot" aria-hidden="true" />
                      En cours
                    </span>
                  ) : (
                    <span className="v-chip v-chip-locked">
                      <VoyageIcon name="lock" size={10} strokeWidth={2.4} />
                      Verrouillé
                    </span>
                  )}
                </h3>
                <p>{m.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ---------- Les thèmes du voyage (les 11 mondes) ---------- */}
      <section className="v-section" id="v-themes" aria-labelledby="v-themes-title">
        <div className="v-section-head">
          <h2 id="v-themes-title" className="v-h2">
            <span className="v-h2-ico" style={{ color: '#33809e' }}>
              <VoyageIcon name="globe" size={19} />
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
                <VoyageIcon name={w.icon as VoyageIconName} size={18} />
              </span>
              <div className="v-theme-body">
                <h3>
                  {w.shortName}{' '}
                  {!w.free && (
                    <span className="v-prem">
                      <VoyageIcon name="gem" size={10} strokeWidth={2.2} />
                      <em>Premium</em>
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
                <VoyageIcon name="mirror" size={17} />
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
