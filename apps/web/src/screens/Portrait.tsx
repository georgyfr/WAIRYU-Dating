/**
 * « Ton portrait » (#/portrait) — la porte Portrait.
 *
 * RECONSTITUTION (5ᵉ reset sandbox) — fidèle au bundle staging (fonction `ih`,
 * lignes 10491-10601 de /tmp/staging-bundle-pretty.js) :
 *  - état RÉEL : p-state aria-live=polite, chip « En construction », meta
 *    « 0 monde franchi sur 11 · 0 étape sur 51 » (PROGRESS — la marque du
 *    pluriel apparaîtra dès que le compte > 1), CTA « Reprendre mon voyage » ;
 *  - les 11 mondes du Livrable avec gemmes 💎 Premium sobres (aria-label
 *    « Premium » sur la pastille v-prem, verbatim bundle ligne 10566) ;
 *  - bloc « Ton portrait t'appartient. » — le bundle N'A AUCUN lien vers
 *    #/profil (retiré en Task 21 : « l'espace pour gérer ce que tu montres
 *    s'ouvrira plus tard dans ton voyage »).
 *
 * Aucune prop (bundle : s.jsx(ih, {})). Apostrophes U+0027 (audit Task 25).
 */

import { PROGRESS, TOTAL_STEPS, WORLDS } from '../lib/voyage';
import VoyageIcon from '../components/VoyageIcons';
import type { VoyageIconName } from '../components/VoyageIcons';

export default function Portrait() {
  return (
    <main className="screen">
      <h1 className="screen-title">Ton portrait</h1>
      <p className="screen-sub">Ce que ton voyage révèle de toi, dimension après dimension.</p>
      <article className="card p-state" aria-live="polite">
        <div className="p-state-head">
          <span className="p-state-ico" aria-hidden="true">
            <VoyageIcon name="mirror" size={22} />
          </span>
          <span className="p-chip">En construction</span>
        </div>
        <p className="p-state-line">
          Ton portrait commencera à se construire dès tes premières réponses.
        </p>
        <p className="p-state-meta">
          {PROGRESS.worldsDone} monde{PROGRESS.worldsDone > 1 ? 's' : ''} franchi
          {PROGRESS.worldsDone > 1 ? 's' : ''} sur {WORLDS.length} · {PROGRESS.stepsDone} étape
          {PROGRESS.stepsDone > 1 ? 's' : ''} sur {TOTAL_STEPS}
        </p>
        <a className="btn btn-accent p-state-cta" href="#/voyage">
          Reprendre mon voyage
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
      </article>
      <section aria-labelledby="p-dims-title">
        <h2 id="p-dims-title" className="p-h2">
          Ce qui construira ton portrait
        </h2>
        <ol className="p-dims">
          {WORLDS.map((w) => (
            <li
              key={w.code}
              className={w.num <= PROGRESS.worldsDone ? 'p-dim p-dim-done' : 'p-dim'}
            >
              <span
                className="p-dim-ico"
                style={{ background: w.tile.bg, color: w.tile.fg }}
                aria-hidden="true"
              >
                <VoyageIcon name={w.icon as VoyageIconName} size={19} />
              </span>
              <div className="p-dim-body">
                <h3>
                  {w.name}
                  {!w.free && (
                    <span className="v-prem" aria-label="Premium">
                      <VoyageIcon name="gem" size={10} strokeWidth={2.2} />
                      <em>Premium</em>
                    </span>
                  )}
                </h3>
                <p>{w.tagline}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
      <article className="card p-privacy">
        <span className="p-privacy-ico" aria-hidden="true">
          <VoyageIcon name="lock" size={16} strokeWidth={2.2} />
        </span>
        <div>
          <p>
            <strong>Ton portrait t'appartient.</strong> Tu choisis ce qui se voit : rien n'apparaît
            sur ton profil sans ta décision — et l'espace pour gérer ce que tu montres s'ouvrira
            plus tard dans ton voyage.
          </p>
        </div>
      </article>
    </main>
  );
}
