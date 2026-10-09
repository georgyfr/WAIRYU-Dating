/**
 * LE VOYAGE — la page d'accueil de l'app connectée, l'expérience du voyage en
 * 7 sections (Tasks 18-22, redesign 2026-10-08 + héro 2 sections) :
 *
 *  ① HÉRO — pastille « Ton voyage commence ici » (boussole), titre « Le
 *     Voyage », promesse en grand ({total} mondes • {TOTAL_STEPS} étapes • 1
 *     destination), illustration pleine largeur (voyage-panorama), puis LE
 *     SEUL bouton du héro : CTA « Voir la carte du voyage » (scroll ancre
 *     #v-etapes).
 *  ② LE SENS — manifeste en carte turquoise profond : « Ici, personne ne te
 *     note. / Personne ne te classe. », 4 piliers, bloc Tu gardes le contrôle.
 *  ③ TA PROGRESSION — 4 tuiles RÉELLES (useProgression) + barre 11 segments
 *     (role=progressbar) + prochaine étape (MILESTONES[0]).
 *  ④ TA CARTE DU VOYAGE — WorldMap : SVG serpentin 460×540, Départ → 11
 *     stations cliquables (<g role="button" tabIndex aria-pressed>) → La
 *     Rencontre dorée ; panneau de détail aria-live (tagline, N étapes,
 *     statut réel, note) avec « Commencer/Continuer » → onOpenWorld(code) :
 *     l'App ouvre la fiche WorldModal sur l'écran Mondes (la popup N'EST PAS
 *     rendue ici — flux exact du bundle).
 *  ⑤ CE QUE TON VOYAGE CONSTRUIT — les 4 portes BUILDS, cartes <a> (hrefs
 *     exacts #/portrait #/mondes #/parcourus #/matchs), mantra, états réels,
 *     SANS boutons — puis bandeau « Continuer mon Voyage » (lien #/voyage).
 *  ⑥ TA RÉCOLTE — les 6 jalons MILESTONES (chips En cours / À venir).
 *  ⑦ PREMIER ARRÊT — bandeau « Premier arrêt : Le Miroir » + CTA d'état
 *     (Commencer / Continuer le Miroir → onOpenWorld('M1') ; sinon
 *     Découvrir les Mondes → onExplore).
 *
 * Props EXACTES fixées par App (bundle lignes 13679-13681) : onExplore et
 * onOpenWorld. Les cartes des portes n'ont PLUS de boutons (retour Task 22).
 *
 * RECONSTITUTION (5ᵉ reset sandbox) — fidèle au bundle staging Task 27
 * (sh lignes 9937-10490 ; helpers eu 9700-9712, Gn 9713-9728, Me/oe/rt
 * 9729-9734, nh 9736-9754, rh 9755-9936), en attendant ses retours.
 */

import { useState } from 'react';
import type { CSSProperties } from 'react';
import { BUILDS, FREE_WORLDS, MILESTONES, TOTAL_STEPS, WORLDS } from '../lib/voyage';
import { useProgressionDetail } from '../lib/progression';
import type { VoyageBuild, VoyageWorld } from '../lib/voyage';
import { useStatutsMondes } from '../lib/mondes-state';
import VoyageIcon from '../components/VoyageIcons';
import type { VoyageIconName } from '../components/VoyageIcons';
import { useI18n } from '../i18n/I18nProvider';

interface Props {
  /** « Découvrir les Mondes » (Premier arrêt, si Le Miroir n'est pas ouvert). */
  onExplore: () => void;
  /** « Commencer/Continuer » d'un monde de la carte (ou du Premier arrêt) :
   * l'App navigue vers #/mondes et ouvre la fiche du monde. */
  onOpenWorld: (code: string) => void;
}

/* ── Petites icônes locales (traits, currentColor) ── */

/** Étincelle 4 branches (manifeste + en-tête « Ce que ton voyage construit »). */
function SparkIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M12 2l2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2z" />
    </svg>
  );
}

/** Flèche droite (CTA, pieds de cartes, boutons Commencer/Continuer). */
function Fleche() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="15"
      height="15"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/* ── Le sentier serpentin des 11 mondes (WorldMap) ── */

/** Colonnes et rangées de la grille du sentier (viewBox 460×540). */
const COLONNES = [56, 172, 288, 404];
const RANGEES = [64, 200, 336, 472];
/** La destination : La Rencontre (nœud or rayonnant). */
const RENCONTRE = { x: 230, y: 472 };

/** Positions des 11 stations en serpentin : 3 puis 4 (sens inverse) puis 4. */
function positionsMondes(): { x: number; y: number; world: VoyageWorld }[] {
  const noeuds: { x: number; y: number; world: VoyageWorld }[] = [];
  WORLDS.forEach((world, i) => {
    if (i < 3) noeuds.push({ x: COLONNES[i + 1], y: RANGEES[0], world });
    else if (i < 7) noeuds.push({ x: COLONNES[3 - (i - 3)], y: RANGEES[1], world });
    else noeuds.push({ x: COLONNES[i - 7], y: RANGEES[2], world });
  });
  return noeuds;
}

/** La carte interactive : Départ → 11 stations (clavier inclus) → La Rencontre. */
function WorldMap({
  selection,
  onSelect,
  franchis,
}: {
  selection: string;
  onSelect: (code: string) => void;
  franchis: number;
}) {
  const { tx } = useI18n();
  const noeuds = positionsMondes();
  const noms = WORLDS.map((w) => w.name).join(' · ');
  return (
    <svg
      className="v-map-svg"
      viewBox="0 0 460 540"
      role="group"
      aria-label={tx('Carte du voyage : départ, puis {{noms}}, puis la Rencontre. Sélectionne un monde pour voir ses détails.', { noms })}
    >
      <path
        className="v-map-path"
        d={`M ${COLONNES[0]} ${RANGEES[0]} L ${COLONNES[3]} ${RANGEES[0]} C 448 ${RANGEES[0]} 448 ${RANGEES[1]} ${COLONNES[3]} ${RANGEES[1]} L ${COLONNES[0]} ${RANGEES[1]} C 12 ${RANGEES[1]} 12 ${RANGEES[2]} ${COLONNES[0]} ${RANGEES[2]} L ${COLONNES[3]} ${RANGEES[2]} C 448 ${RANGEES[2]} 448 ${RANGEES[3]} ${COLONNES[3]} ${RANGEES[3]} L ${RENCONTRE.x} ${RENCONTRE.y}`}
        pathLength={1}
        fill="none"
        strokeLinecap="round"
        aria-hidden="true"
      />
      {/* Le départ : panneau turquoise */}
      <g className="v-map-station" style={{ animationDelay: '0ms' }} aria-hidden="true">
        <circle cx={COLONNES[0]} cy={RANGEES[0]} r="17" fill="#128078" />
        <g transform={`translate(${COLONNES[0] - 9}, ${RANGEES[0] - 9})`} style={{ color: '#ffffff' }}>
          <VoyageIcon name="signpost" size={18} />
        </g>
        <text x={COLONNES[0]} y={RANGEES[0] + 34} className="v-map-label">
          {tx('Départ')}
        </text>
      </g>
      {/* Les 11 stations des mondes */}
      {noeuds.map(({ x, y, world }, i) => {
        const franchi = world.num <= franchis;
        const estSelectionne = world.code === selection;
        const classes = [
          'v-map-station',
          'v-map-node',
          franchi ? 'v-map-done' : '',
          world.status === 'open' && !franchi ? 'v-map-now' : '',
          estSelectionne ? 'v-map-sel' : '',
        ]
          .filter(Boolean)
          .join(' ');
        return (
          <g
            key={world.code}
            className={classes}
            style={{ animationDelay: `${120 + i * 90}ms` }}
            role="button"
            tabIndex={0}
            aria-pressed={estSelectionne}
            aria-label={
              tx('Monde {{n}} sur {{total}} : {{nom}}. {{q}} étapes', {
                n: world.num,
                total: WORLDS.length,
                nom: world.name,
                q: world.quests,
              }) +
              (world.free ? '' : '. Premium') +
              '.' +
              (estSelectionne ? tx(' Sélectionné.') : '')
            }
            onClick={() => onSelect(world.code)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelect(world.code);
              }
            }}
          >
            {estSelectionne && <circle cx={x} cy={y} r="28" className="v-map-selbg" aria-hidden="true" />}
            {world.status === 'open' && !franchi && (
              <circle cx={x} cy={y} r="27" className="v-map-halo" aria-hidden="true" />
            )}
            <circle cx={x} cy={y} r="25" className="v-map-hit" aria-hidden="true" />
            <circle cx={x} cy={y} r="20" className="v-map-dot" style={{ fill: franchi ? '#0b6a72' : world.tile.bg }} />
            <g
              transform={`translate(${x - 9.5}, ${y - 9.5})`}
              style={{ color: franchi ? '#ffffff' : world.tile.fg }}
              aria-hidden="true"
            >
              <VoyageIcon name={world.icon as VoyageIconName} size={19} />
            </g>
            <circle cx={x + 15} cy={y - 15} r="8" className="v-map-numbg" aria-hidden="true" />
            <text x={x + 15} y={y - 15 + 3} className="v-map-num" aria-hidden="true">
              {world.num}
            </text>
            {!world.free && (
              <g aria-hidden="true">
                <circle cx={x - 15} cy={y - 15} r="7.5" className="v-map-prembg" />
                <g transform={`translate(${x - 19}, ${y - 19})`} style={{ color: '#b8912a' }}>
                  <VoyageIcon name="gem" size={8} />
                </g>
              </g>
            )}
            <text x={x} y={y + 36} className="v-map-label" aria-hidden="true">
              {world.shortName}
            </text>
          </g>
        );
      })}
      {/* La destination : La Rencontre, nœud or rayonnant */}
      <g
        className="v-map-station v-map-dest"
        style={{ animationDelay: `${120 + noeuds.length * 90}ms` }}
        aria-hidden="true"
      >
        <circle cx={RENCONTRE.x} cy={RENCONTRE.y} r="30" className="v-map-dest-halo" />
        <circle cx={RENCONTRE.x} cy={RENCONTRE.y} r="24" fill="#fff6dd" stroke="#c9a227" strokeWidth="2.4" />
        <g transform={`translate(${RENCONTRE.x - 11}, ${RENCONTRE.y - 11})`} style={{ color: '#b8912a' }}>
          <VoyageIcon name="rings" size={22} />
        </g>
        <text x={RENCONTRE.x} y={RENCONTRE.y + 42} className="v-map-label v-map-label-dest">
          {tx('La Rencontre')}
        </text>
      </g>
    </svg>
  );
}

/** `tile` est présent dans les DONNÉES BUILDS du bundle mais absent de
 * l'interface VoyageBuild de lib/voyage.ts (signalé à l'orchestrateur) —
 * lecture typée défensive : couleurs exactes du bundle si présentes. */
function styleTuile(b: VoyageBuild): CSSProperties {
  const tile = (b as VoyageBuild & { tile?: { bg: string; fg: string } }).tile;
  return { background: tile?.bg, color: tile?.fg };
}

export default function Voyage({ onExplore, onOpenWorld }: Props) {
  const { tx } = useI18n();
  // La progression RÉELLE — calculée depuis l'état des quêtes, réactive.
  const { worldsDone: franchis, stepsDone: etapes, recolte, parMonde } = useProgressionDetail();
  const total = WORLDS.length;
  const [selection, setSelection] = useState<string>(() => WORLDS[0].code);
  // État RÉEL « monde en cours » (localStorage ; le bundle stockait la chaîne
  // "en_cours", la reconstitution de lib/mondes-state.ts stocke true).
  const statuts = useStatutsMondes();
  const monde = WORLDS.find((w) => w.code === selection) ?? WORLDS[0];
  const mondeFranchi = monde.num <= franchis;
  const mondeOuvert = monde.status === 'open' && !mondeFranchi;
  const mondeEnCours = statuts[monde.code] === true;
  // Le progrès RÉEL du monde sélectionné — le panneau affiche le compteur
  // vivant dès la première quête posée (harmonisation Task 45 : le chip
  // « Ouvert/En cours » n'est plus muet).
  const pMonde = parMonde[monde.code] ?? null;
  const versAncre = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const miroir = WORLDS[0];
  const miroirOuvert = miroir.status === 'open';
  const miroirEnCours = statuts[miroir.code] === true;

  return (
    <div className="voyage">
      {/* ① Héro : pastille + titre + promesse, illustration, LE seul bouton */}
      <section className="v-hero" aria-labelledby="v-title">
        <div className="v-hero-head">
          <span className="v-hero-chip">
            <VoyageIcon name="compass" size={13} strokeWidth={2.2} />
            {tx('Ton voyage commence ici')}
          </span>
          <h1 id="v-title" className="v-hero-title">
            {tx('Le Voyage')}
          </h1>
          <p className="v-hero-promise">
            <strong>{tx('{{n}} mondes', { n: total })}</strong>
            <span className="v-promise-dot" aria-hidden="true">
              •
            </span>
            <strong>{tx('{{n}} étapes', { n: TOTAL_STEPS })}</strong>
            <span className="v-promise-dot" aria-hidden="true">
              •
            </span>
            <em>{tx('1 destination : une rencontre qui a du sens')}</em>
          </p>
        </div>
        <div className="v-hero-fig">
          <img
            src="/img/voyage-panorama.webp"
            alt={tx("Un voyageur au sac à dos s'engage sur un chemin lumineux qui serpente à travers une vallée jusqu'à des montagnes turquoise, jalonné d'étapes brillantes ; à l'horizon rayonnant, deux silhouettes se rencontrent")}
            className="v-hero-img"
            width={1440}
            height={720}
          />
        </div>
        <div className="v-hero-actions">
          <button type="button" className="v-hero-cta" onClick={() => versAncre('v-etapes')}>
            <VoyageIcon name="compass" size={15} strokeWidth={2.2} />
            {tx('Voir la carte du voyage')}
            <Fleche />
          </button>
        </div>
      </section>

      {/* ② Le sens : le manifeste, carte turquoise profond */}
      <section className="v-sens" aria-labelledby="v-sens-title">
        <span className="v-sens-spark" aria-hidden="true">
          <SparkIcon />
        </span>
        <h2 id="v-sens-title" className="v-sens-title">
          {tx('Ici, personne ne te note.')}
          <br />
          {tx('Personne ne te classe.')}
        </h2>
        <p className="v-sens-lead">{tx('Tu réponds à ta façon.')}</p>
        <p className="v-sens-p">
          {tx('Chaque réponse construit ton portrait, affine tes rencontres et fait avancer ton voyage.')}
        </p>
        <p className="v-sens-p">
          {tx("Ce que tu découvres en chemin t'appartient : ")}
          <strong>{tx('tu choisis ce qui se voit.')}</strong>
        </p>
        <ul className="v-sens-pillars" aria-label={tx('Ce que construisent tes réponses')}>
          <li>
            <span className="v-sens-pico" style={{ background: '#dff3f4', color: '#2a9aa0' }} aria-hidden="true">
              <VoyageIcon name="scroll" size={15} />
            </span>
            {tx('Ton portrait')}
          </li>
          <li>
            <span className="v-sens-pico" style={{ background: '#fde9e6', color: '#f56b53' }} aria-hidden="true">
              <VoyageIcon name="heart" size={15} />
            </span>
            {tx('Tes affinités')}
          </li>
          <li>
            <span className="v-sens-pico" style={{ background: '#e4f4e4', color: '#3e9d5b' }} aria-hidden="true">
              <VoyageIcon name="compass" size={15} />
            </span>
            {tx('Ton chemin')}
          </li>
          <li>
            <span className="v-sens-pico" style={{ background: '#ffebcf', color: '#d9932b' }} aria-hidden="true">
              <VoyageIcon name="rings" size={15} />
            </span>
            {tx('Tes rencontres')}
          </li>
        </ul>
        <div className="v-sens-privacy">
          <span className="v-sens-lock" aria-hidden="true">
            <VoyageIcon name="lock" size={15} strokeWidth={2.2} />
          </span>
          <p>
            <strong>{tx('Tu gardes le contrôle.')}</strong>{' '}
            {tx('Tes réponses servent à mieux comprendre tes affinités — tu choisis ce qui apparaît sur ton profil et ce que tu souhaites partager.')}
          </p>
        </div>
      </section>

      {/* ③ Ta progression : les chiffres RÉELS du voyage */}
      <section className="v-section" aria-labelledby="v-prog-title">
        <div className="v-section-head">
          <h2 id="v-prog-title" className="v-h2">
            <span className="v-h2-ico" style={{ color: '#2a9aa0' }}>
              <VoyageIcon name="signpost" size={19} />
            </span>
            {tx('Ta progression')}
          </h2>
        </div>
        <div className="v-prog">
          <div className="v-stats">
            <article className="v-stat">
              <strong>
                {franchis}
                <i>/{total}</i>
              </strong>
              <span>{tx('Mondes franchis')}</span>
            </article>
            <article className="v-stat">
              <strong>
                {etapes}
                <i>/{TOTAL_STEPS}</i>
              </strong>
              <span>{tx('Étapes parcourues')}</span>
            </article>
            <article className="v-stat">
              <strong>{recolte}</strong>
              <span>{tx('Éléments récoltés')}</span>
            </article>
            <article className="v-stat">
              <strong className="v-stat-txt">{tx('En construction')}</strong>
              <span>{tx('Tes affinités')}</span>
            </article>
          </div>
          <div
            className="v-bar"
            role="progressbar"
            aria-valuenow={Math.round((franchis / total) * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={tx('Progression du voyage : mondes franchis')}
          >
            {WORLDS.map((w, i) => (
              <span key={w.code} className={i < franchis ? 'v-seg v-seg-done' : 'v-seg'} aria-hidden="true" />
            ))}
          </div>
          <small className="v-bar-label">
            {tx("Chaque monde franchi allume un segment — {{a}} sur {{b}} pour l'instant.", { a: franchis, b: total })}
          </small>
          <div className="v-next">
            <span className="v-next-ico" aria-hidden="true">
              <VoyageIcon name="map" size={19} />
            </span>
            <span className="v-next-text">
              <small>{tx('Prochaine étape')}</small>
              <strong>{MILESTONES[0]?.name}</strong>
            </span>
          </div>
        </div>
      </section>

      {/* ④ Ta carte du voyage : le sentier + le panneau du monde sélectionné */}
      <section className="v-section" id="v-etapes" aria-labelledby="v-map-title">
        <div className="v-section-head">
          <h2 id="v-map-title" className="v-h2">
            <span className="v-h2-ico" style={{ color: '#2a9aa0' }}>
              <VoyageIcon name="map" size={19} />
            </span>
            {tx('Ta carte du voyage')}
          </h2>
        </div>
        <p className="v-section-sub">
          {tx('Du départ à la Rencontre, {{a}} mondes jalonnent ton chemin — {{b}} sont offerts, dont la destination. Touche un monde pour le découvrir.', { a: total, b: FREE_WORLDS })}
        </p>
        <div className="v-map">
          <WorldMap selection={selection} onSelect={setSelection} franchis={franchis} />
          <article className="v-map-panel" aria-live="polite">
            <div className="v-map-panel-head">
              <span
                className="v-map-panel-ico"
                style={{ background: monde.tile.bg, color: monde.tile.fg }}
                aria-hidden="true"
              >
                <VoyageIcon name={monde.icon as VoyageIconName} size={21} />
              </span>
              <div className="v-map-panel-title">
                <small>
                  {tx('Monde {{n}} sur {{total}}', { n: monde.num, total })}
                </small>
                <h3>{monde.name}</h3>
              </div>
            </div>
            <p className="v-map-panel-tag">{monde.tagline}</p>
            <div className="v-map-panel-meta">
              <span className="v-map-panel-steps">
                {pMonde && pMonde.faites > 0
                  ? tx('{{faites}}/{{total}} étapes', { faites: pMonde.faites, total: pMonde.total })
                  : tx('{{n}} étape{{s}}', { n: monde.quests, s: monde.quests > 1 ? 's' : '' })}
              </span>
              {mondeFranchi ? (
                <span className="v-chip v-chip-done">
                  <svg
                    viewBox="0 0 24 24"
                    width="10"
                    height="10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M4 12.5l5 5L20 6.5" />
                  </svg>
                  {tx('Terminé')}
                </span>
              ) : mondeOuvert ? (
                <span className="v-chip v-chip-now">
                  <span className="v-chip-dot" aria-hidden="true" />
                  {mondeEnCours ? tx('En cours') : tx('Ouvert')}
                </span>
              ) : (
                <span className="v-chip v-chip-soon">{tx('À venir')}</span>
              )}
              {!monde.free && (
                <span className="v-prem">
                  <VoyageIcon name="gem" size={10} strokeWidth={2.2} />
                  <em>Premium</em>
                </span>
              )}
              {monde.free && monde.num === total && <span className="v-free">{tx('Toujours gratuit')}</span>}
            </div>
            {monde.note && <p className="v-map-panel-note">{monde.note}</p>}
            {mondeOuvert && (
              <button type="button" className="v-map-start" onClick={() => onOpenWorld(monde.code)}>
                {mondeEnCours ? tx('Continuer') : tx('Commencer')}
                <Fleche />
              </button>
            )}
          </article>
        </div>
      </section>

      {/* ⑤ Ce que ton voyage construit : les 4 portes, SANS boutons */}
      <section className="v-section" aria-labelledby="v-build-title">
        <div className="v-section-head">
          <h2 id="v-build-title" className="v-h2">
            <span className="v-h2-ico" style={{ color: '#d68f06' }}>
              <SparkIcon />
            </span>
            {tx('Ce que ton voyage construit')}
          </h2>
        </div>
        <p className="v-section-sub">
          {tx('À chaque étape, tu découvres quelque chose sur toi. Ton voyage construit progressivement ton portrait, tes affinités et ta façon de rencontrer.')}
        </p>
        <ol className="v-build">
          {BUILDS.map((b) => {
            const estPortrait = b.href === '#/portrait';
            const estJournal = b.href === '#/parcourus';
            const cta = estPortrait ? tx('Commencer') : b.cta;
            const etat = estPortrait ? tx('En construction') : estJournal ? tx('{{a}} sur {{b}} franchi', { a: franchis, b: total }) : null;
            return (
              <li key={b.num} className="v-build-item">
                <a className="v-build-card" href={b.href} aria-label={`${b.title} — ${cta}`}>
                  <span className="v-build-top">
                    <span className="v-build-ico" style={styleTuile(b)} aria-hidden="true">
                      <VoyageIcon name={b.icon as VoyageIconName} size={22} />
                    </span>
                    <span className="v-build-num" aria-hidden="true">
                      {b.num}
                    </span>
                  </span>
                  <h3>{b.title}</h3>
                  <em className="v-build-mantra">{b.mantra}</em>
                  <p>{b.text}</p>
                  {etat && (
                    <span className="v-build-state">
                      <span className="v-build-state-dot" aria-hidden="true" />
                      {etat}
                    </span>
                  )}
                  <span className="v-build-foot">
                    {cta}
                    <Fleche />
                  </span>
                </a>
              </li>
            );
          })}
        </ol>
        <div className="v-continue">
          <span className="v-continue-ico" aria-hidden="true">
            <VoyageIcon name="map" size={21} />
          </span>
          <div className="v-continue-body">
            <h3>{tx('Continuer mon Voyage')}</h3>
            <p>
              {tx('{{a}} mondes. {{b}} étapes. Une histoire qui se construit à ton rythme.', { a: total, b: TOTAL_STEPS })}
            </p>
          </div>
          <a className="v-continue-cta" href="#/voyage" onClick={() => versAncre('v-etapes')}>
            {tx('Reprendre mon voyage')}
            <Fleche />
          </a>
        </div>
      </section>

      {/* ⑥ Ta récolte : les 6 jalons de l'échelle de restitution */}
      <section className="v-section" id="v-recolte" aria-labelledby="v-rec-title">
        <div className="v-section-head">
          <h2 id="v-rec-title" className="v-h2">
            <span className="v-h2-ico" style={{ color: '#3e9d5b' }}>
              <VoyageIcon name="layers" size={19} />
            </span>
            {tx('Ta récolte')}
          </h2>
        </div>
        <p className="v-section-sub">{tx('Ce que ton voyage construit, étape après étape — chaque découverte reste à toi.')}</p>
        <ol className="v-rec">
          {MILESTONES.map((jalon) => (
            <li key={jalon.num} className={jalon.status === 'now' ? 'v-rec-item v-rec-now' : 'v-rec-item'}>
              <span className="v-rec-ico" style={{ background: jalon.tile.bg, color: jalon.tile.fg }} aria-hidden="true">
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

      {/* ⑦ Premier arrêt : Le Miroir */}
      <section className="v-section" aria-label={tx('Premier arrêt')}>
        <div className="v-arret">
          <img
            src="/img/voyage-arret.webp"
            alt={tx("Paysage turquoise — le premier monde, Le Miroir, t'attend")}
            className="v-arret-img"
          />
          <div className="v-arret-body">
            <h3>{tx('Premier arrêt : Le Miroir')}</h3>
            <p>
              {tx("Le Monde 1 t'attend : découvre ce qu'il révèle de toi — personnalité, attachement, émotions — puis commence à ton rythme. Chaque monde franchi éclaire le suivant.")}
            </p>
            {/* Le bundle garde `e || g && t` (props tolérées indéfinies) ;
                ici les deux props sont requises et toujours fournies par App
                (bundle 13679-13681) ⇒ le bouton est rendu, point. */}
            <button
              type="button"
              className="v-arret-cta"
              onClick={miroirOuvert ? () => onOpenWorld(miroir.code) : onExplore}
            >
              {miroirOuvert ? (miroirEnCours ? tx('Continuer le Miroir') : tx('Commencer')) : tx('Découvrir les Mondes')}
              <Fleche />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
