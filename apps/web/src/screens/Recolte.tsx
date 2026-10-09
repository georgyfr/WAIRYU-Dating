/**
 * « Ma récolte » (#/recolte) — ce que ton voyage construit.
 *
 * RECONSTITUTION (5ᵉ reset sandbox) — fidèle au bundle staging (fonction `Wh`,
 * lignes 12953-13101 de /tmp/staging-bundle-pretty.js) :
 *  - 3 états de synthèse RÉELS, cliquables : Ton Portrait (#/portrait, chip
 *    « En construction ») · Ton journal (#/parcourus, chip « X sur 11 ») ·
 *    Tes rencontres (#/matchs, chip « 0 pour l'instant ») ;
 *  - l'échelle de restitution : les 6 jalons MILESTONES (chip En cours/À venir) ;
 *  - le bloc « Tu gardes le contrôle. » (verbatim, lignes 13086-13099).
 *
 * Détail typographique VERBATIM du bundle (ligne 13009) : la chaîne
 * « Aucun monde traversé pour l’instant — le premier ouvre bientôt. » contient
 * une apostrophe typographique U+2019 dans « l’instant » — ne pas « corriger ».
 * Partout ailleurs : U+0027 (audit Task 25).
 *
 * Aucune prop (bundle : s.jsx(Wh, {})).
 */

import { MILESTONES, PROGRESS, WORLDS } from '../lib/voyage';
import VoyageIcon from '../components/VoyageIcons';
import type { VoyageIconName } from '../components/VoyageIcons';
import { useI18n } from '../i18n/I18nProvider';

export default function Recolte() {
  const { tx } = useI18n();
  const worldsDone = PROGRESS.worldsDone;
  return (
    <main className="screen">
      <h1 className="screen-title">{tx('Ma récolte')}</h1>
      <p className="screen-sub">
        {tx('Ce que ton voyage construit, étape après étape — chaque découverte reste à toi.')}
      </p>
      <div className="rec-states">
        <a className="card rec-state" href="#/portrait">
          <span
            className="rec-state-ico"
            style={{ background: '#fde9e6', color: '#f56b53' }}
            aria-hidden="true"
          >
            <VoyageIcon name="mirror" size={20} />
          </span>
          <span className="rec-state-body">
            <h2>{tx('Ton Portrait')}</h2>
            <p>{tx('Dès tes premières réponses, ton portrait commence à se construire.')}</p>
          </span>
          <span className="p-chip">{tx('En construction')}</span>
        </a>
        <a className="card rec-state" href="#/parcourus">
          <span
            className="rec-state-ico"
            style={{ background: '#e4f4e4', color: '#3e9d5b' }}
            aria-hidden="true"
          >
            <VoyageIcon name="signpost" size={20} />
          </span>
          <span className="rec-state-body">
            <h2>{tx('Ton journal')}</h2>
            {/* Verbatim bundle (U+2019 dans « l’instant »). */}
            <p>{tx('Aucun monde traversé pour l’instant — le premier ouvre bientôt.')}</p>
          </span>
          <span className="p-chip">
            {tx('{{a}} sur {{b}}', { a: worldsDone, b: WORLDS.length })}
          </span>
        </a>
        <a className="card rec-state" href="#/matchs">
          <span
            className="rec-state-ico"
            style={{ background: '#fde4ec', color: '#e2557b' }}
            aria-hidden="true"
          >
            <VoyageIcon name="rings" size={20} />
          </span>
          <span className="rec-state-body">
            <h2>{tx('Tes rencontres')}</h2>
            <p>{tx('Certaines rencontres commencent ici.')}</p>
          </span>
          <span className="p-chip">{tx("0 pour l'instant")}</span>
        </a>
      </div>
      <section aria-labelledby="rec-jalons-title">
        <h2 id="rec-jalons-title" className="p-h2">
          {tx('Les étapes de ta récolte')}
        </h2>
        <ol className="v-rec">
          {MILESTONES.map((jalon) => (
            <li
              key={jalon.num}
              className={jalon.status === 'now' ? 'v-rec-item v-rec-now' : 'v-rec-item'}
            >
              <span
                className="v-rec-ico"
                style={{ background: jalon.tile.bg, color: jalon.tile.fg }}
                aria-hidden="true"
              >
                <VoyageIcon name={jalon.icon as VoyageIconName} size={21} />
              </span>
              <div className="v-rec-body">
                <h3>
                  {jalon.name}
                  {jalon.status === 'now' ? (
                    <span className="v-chip v-chip-now">
                      <span className="v-chip-dot" aria-hidden="true" />
                      {tx('En cours')}
                    </span>
                  ) : (
                    <span className="v-chip v-chip-soon">{tx('À venir')}</span>
                  )}
                </h3>
                <p>{jalon.desc}</p>
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
            <strong>{tx('Tu gardes le contrôle.')}</strong>{' '}
            {tx("Ta récolte t'appartient : tu choisis ce que tu partages, quand tu le partages — et l'espace pour gérer ce que tu montres s'ouvrira plus tard dans ton voyage.")}
          </p>
        </div>
      </article>
    </main>
  );
}
