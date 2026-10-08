/**
 * « Mes Mondes parcourus » (#/parcourus) — le journal de bord.
 *
 * RECONSTITUTION (5ᵉ reset sandbox) — fidèle au bundle staging (fonction `Uh`,
 * lignes 12838-12952 de /tmp/staging-bundle-pretty.js) :
 *  - stats réelles : X/11 mondes franchis (PROGRESS.worldsDone / WORLDS.length)
 *    et X/51 étapes (PROGRESS.stepsDone / TOTAL_STEPS) ;
 *  - état vide HONNÊTE tant qu'aucun monde n'est franchi (🪞) ;
 *  - sinon la liste .m-list des mondes traversés (chip « Terminé »), prête
 *    dès que PROGRESS.worldsDone > 0 ;
 *  - actions : #/mondes (accent) + #/voyage (ghost).
 *
 * Aucune prop (bundle : s.jsx(Uh, {})). Apostrophes U+0027 (audit Task 25).
 */

import { PROGRESS, TOTAL_STEPS, WORLDS } from '../lib/voyage';
import VoyageIcon from '../components/VoyageIcons';
import type { VoyageIconName } from '../components/VoyageIcons';

export default function Parcourus() {
  const worldsDone = PROGRESS.worldsDone;
  const traverses = WORLDS.filter((w) => w.num <= worldsDone);
  return (
    <main className="screen">
      <h1 className="screen-title">Mes Mondes parcourus</h1>
      <p className="screen-sub">Ton journal de bord — les mondes traversés et ce qu'ils t'ont révélé.</p>
      <div className="m-stats" role="list" aria-label="Ton parcours en chiffres">
        <span role="listitem">
          <strong>
            {worldsDone}/{WORLDS.length}
          </strong>{' '}
          mondes franchis
        </span>
        <span role="listitem">
          <strong>
            {PROGRESS.stepsDone}/{TOTAL_STEPS}
          </strong>{' '}
          étapes
        </span>
      </div>
      {traverses.length === 0 ? (
        <div className="empty">
          <span className="emoji" aria-hidden="true">
            🪞
          </span>
          <h2>Aucun monde traversé pour l'instant</h2>
          <p>
            Le Monde 1 — Le Miroir — ouvre bientôt le chemin. Dès qu'un monde est franchi, il
            rejoint ton journal avec ce que tu y as découvert.
          </p>
        </div>
      ) : (
        <ol className="m-list" aria-label="Les mondes que tu as traversés">
          {traverses.map((w) => (
            <li key={w.code} className="m-world m-world-done">
              <span
                className="m-world-ico"
                style={{ background: w.tile.bg, color: w.tile.fg }}
                aria-hidden="true"
              >
                <VoyageIcon name={w.icon as VoyageIconName} size={24} />
              </span>
              <div className="m-world-body">
                <small className="m-world-num">
                  Monde {w.num} sur {WORLDS.length}
                </small>
                <h2>{w.name}</h2>
                <p>{w.tagline}</p>
                <div className="m-world-meta">
                  <span className="m-world-steps">
                    {w.quests} étape{w.quests > 1 ? 's' : ''}
                  </span>
                  <span className="v-chip v-chip-done">
                    <svg
                      viewBox="0 0 24 24"
                      width={10}
                      height={10}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={3}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M4 12.5l5 5L20 6.5" />
                    </svg>
                    Terminé
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}
      <div className="parc-actions">
        <a className="btn btn-accent" href="#/mondes">
          Découvrir les Mondes
          <svg
            viewBox="0 0 24 24"
            width={16}
            height={16}
            fill="none"
            stroke="currentColor"
            strokeWidth={2.4}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </a>
        <a className="btn btn-ghost" href="#/voyage">
          Voir ma carte du voyage
        </a>
      </div>
    </main>
  );
}
