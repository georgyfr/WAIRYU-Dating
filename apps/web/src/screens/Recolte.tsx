/**
 * « Ma récolte » (#/recolte) — ce que ton voyage construit.
 *
 * RÉORGANISATION (Task 42, demande fondateur — même traitement que l'atlas
 * #/mondes en Task 41) :
 *  - HÉROS « Ton avancement » : les chiffres RÉELS de la récolte (x/11 mondes,
 *    y/51 étapes, z cartes) + la barre de progression du voyage + le CTA
 *    « Continuer le voyage » → #/mondes (la page n'avait AUCUN chemin de
 *    retour vers le jouable) ;
 *  - « Tes espaces » : les 3 portes (Portrait · Journal · Rencontres) — la
 *    grille 3 colonnes ≥760px est SUPPRIMÉE : la coque de l'app fait 480px,
 *    les cartes s'écrasaient (chips sur les titres, un mot par ligne) ;
 *  - L'échelle de restitution (6 jalons) : les chips sont DÉRIVÉES de la
 *    progression RÉELLE (plus de statuts figés) :
 *      · La Carte → Atteint dès la première carte récoltée ;
 *      · Le Miroir → Atteint quand le Monde 1 est traversé, En cours dès la
 *        première quête du Miroir ;
 *      · Le Portrait du Monde → En cours dès le premier monde traversé (les
 *        synthèses s'accumulent monde après monde) ;
 *      · les suivants restent À venir (rien n'existe encore — honnêteté).
 *  - Le bloc « Tu gardes le contrôle. » reste verbatim.
 *
 * Détail typographique VERBATIM du bundle (ligne 13009) : la chaîne
 * « Aucun monde traversé pour l’instant — le premier ouvre bientôt. » contient
 * une apostrophe typographique U+2019 dans « l’instant » — ne pas « corriger ».
 * Partout ailleurs : U+0027 (audit Task 25).
 */

import { MILESTONES, TOTAL_STEPS, WORLDS } from '../lib/voyage';
import { useProgressionDetail } from '../lib/progression';
import VoyageIcon from '../components/VoyageIcons';
import type { VoyageIconName } from '../components/VoyageIcons';
import { useI18n } from '../i18n/I18nProvider';

/** Les états RÉELS d'un jalon de la récolte — dérivés de la progression. */
type StatutJalon = 'atteint' | 'now' | 'soon';

/** Le coche des chips « Atteint » (même dessin que les chips Terminé). */
function Coche() {
  return (
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
  );
}

export default function Recolte() {
  const { tx } = useI18n();
  // La progression RÉELLE — les compteurs et les jalons suivent l'état des
  // quêtes, réactifs (même bus que l'atlas et le journal).
  const { worldsDone, stepsDone, recolte, parMonde } = useProgressionDetail();

  /** Le statut RÉEL d'un jalon — jamais inventé : on n'affiche « Atteint »
   *  que ce que le voyageur possède déjà (cartes, monde traversé). */
  const statutJalon = (num: number, base: 'now' | 'soon'): StatutJalon => {
    if (num === 1) return recolte > 0 ? 'atteint' : base;
    if (num === 2)
      return worldsDone >= 1
        ? 'atteint'
        : (parMonde['M1']?.faites ?? 0) > 0
          ? 'now'
          : base;
    if (num === 3) return worldsDone >= 1 ? 'now' : base;
    return base;
  };

  return (
    <main className="screen">
      <h1 className="screen-title">{tx('Ma récolte')}</h1>
      <p className="screen-sub">
        {tx('Ce que ton voyage construit, étape après étape — chaque découverte reste à toi.')}
      </p>

      {/* HÉROS — l'état réel de la récolte, chiffres vivants + retour au chemin. */}
      <section className="m-hero" aria-label={tx('Ton avancement')}>
        <span
          className="m-hero-ico"
          style={{ background: '#fff3d6', color: '#e8a312' }}
          aria-hidden="true"
        >
          <VoyageIcon name="gem" size={26} />
        </span>
        <div className="m-hero-body">
          <small className="m-hero-label">{tx('Ton avancement')}</small>
          <h2>
            {recolte > 0
              ? tx('{{n}} cartes récoltées', { n: recolte })
              : tx('Ta récolte commence avec ta première quête.')}
          </h2>
          <div className="m-hero-row">
            <div
              className="m-bar"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={TOTAL_STEPS}
              aria-valuenow={stepsDone}
              aria-label={tx('Progression du voyage')}
            >
              <div
                className="m-bar-fill"
                style={{ width: `${Math.round((stepsDone / TOTAL_STEPS) * 100)}%` }}
              />
            </div>
            <span className="m-hero-count">
              {tx('{{faites}}/{{total}} étapes', { faites: stepsDone, total: TOTAL_STEPS })}
            </span>
          </div>
          <div className="m-stats" role="list" aria-label={tx('Le voyage en chiffres')}>
            <span role="listitem">
              <strong>{worldsDone}/{WORLDS.length}</strong> {tx('mondes traversés')}
            </span>
            <span role="listitem">
              <strong>{stepsDone}/{TOTAL_STEPS}</strong> {tx('étapes')}
            </span>
            <span role="listitem">
              <strong>{recolte}</strong> {tx('cartes')}
            </span>
          </div>
        </div>
        <a className="btn btn-accent m-hero-cta" href="#/mondes">
          {tx('Continuer le voyage')}
        </a>
      </section>

      {/* TES ESPACES — les 3 portes, en colonne (la coque fait 480px). */}
      <h2 className="m-sec-title">{tx('Tes espaces')}</h2>
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
            {/* Verbatim bundle (U+2019 dans « l’instant ») — tant qu'aucun monde
                n'est franchi ; sinon la copie suit l'état réel. */}
            <p>
              {worldsDone > 0
                ? tx("Ton journal se remplit — chaque monde franchi y rejoint ce qu'il t'a révélé.")
                : tx('Aucun monde traversé pour l’instant — le premier ouvre bientôt.')}
            </p>
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

      {/* L'ÉCHELLE DE LA RÉCOLTE — chips dérivées de la progression réelle. */}
      <section aria-labelledby="rec-jalons-title">
        <h2 id="rec-jalons-title" className="p-h2">
          {tx('Les étapes de ta récolte')}
        </h2>
        <ol className="v-rec">
          {MILESTONES.map((jalon) => {
            const statut = statutJalon(jalon.num, jalon.status);
            return (
              <li
                key={jalon.num}
                className={
                  statut === 'atteint'
                    ? 'v-rec-item v-rec-done'
                    : statut === 'now'
                      ? 'v-rec-item v-rec-now'
                      : 'v-rec-item'
                }
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
                    {statut === 'atteint' ? (
                      <span className="v-chip v-chip-done">
                        <Coche />
                        {tx('Atteint')}
                      </span>
                    ) : statut === 'now' ? (
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
            );
          })}
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
