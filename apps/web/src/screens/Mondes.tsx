/**
 * « Les Mondes du Voyage » (#/mondes) — l'atlas des 11 mondes.
 *
 * RÉORGANISATION (Task 41, demande fondateur : « pas intuitive, ni
 * ergonomique, ni bien designée » + bug de déblocage) :
 *  - HÉROS « Tu es ici » : l'arrêt ACTUEL du voyageur (premier monde livré
 *    non traversé) — barre de progression réelle, compteurs vivants (x/11
 *    mondes · y/51 étapes · z cartes) et CTA « Commencer/Continuer » qui
 *    ouvre la fiche (le CTA d'entrée vit toujours DANS WorldModal) ;
 *  - « Ton chemin » : les mondes LIVRÉS (M1→M3) en colonne UNIQUE — la
 *    séquence se lit de haut en bas, plus de grille en zigzag ;
 *  - ÉTATS honnêtes par monde : Terminé (✓ + X/N) · En cours (chip + barre
 *    + Continuer) · Prêt (Commencer) · VERROUILLÉ (chip cadenas + « Ce monde
 *    s'ouvrira quand tu auras terminé {précédent}. » + Découvrir gris — LE
 *    FIX : la liste appliquait l'accès séquentiel au modal SEUL, la carte
 *    M3 affichait un accent « Commencer » alors que M2 n'était pas fini) ;
 *  - « La suite du voyage » (M4→M10) : cartes compactes dimmées — l'atlas
 *    ne enterre plus le jouable sous le bientôt ;
 *  - « La destination » (M11) : carte dédiée, note « premier match »,
 *    « Toujours gratuit » ;
 *  - PIED dynamique : « Le premier arrêt — Le Miroir — t'attend. » ne
 *    s'affiche plus aux voyageurs déjà passés (headline suit l'état réel).
 *
 * Statuts pilotés par useStatutsMondes() (monde en cours) + useProgressionDetail()
 * (mondes franchis ET progrès par monde — calculés depuis l'état réel des
 * quêtes) + WORLDS[].status (open/soon). Fiche = WorldModal (role=dialog),
 * accès séquentiel M2←M1, M3←M2, CTA d'entrée pour M1/M2/M3 déverrouillés.
 * pendingWorld : la fiche du monde demandé s'ouvre UNE fois (App → Mondes).
 *
 * Apostrophes U+0027 (audit Task 25).
 */

import { useCallback, useEffect, useState } from 'react';
import WorldModal from '../components/WorldModal';
import { useStatutsMondes } from '../lib/mondes-state';
import { useEtatQuete } from '../lib/quete-state';
import { useProgressionDetail } from '../lib/progression';
import { TOTAL_STEPS, WORLDS } from '../lib/voyage';
import type { VoyageWorld } from '../lib/voyage';
import VoyageIcon from '../components/VoyageIcons';
import type { VoyageIconName } from '../components/VoyageIcons';
import { useI18n } from '../i18n/I18nProvider';

/** Props fixées par App (bundle, lignes 13682-13685). */
export interface MondesProps {
  /** Monde à ouvrir automatiquement (code M1…), consommé une seule fois. */
  pendingWorld: string | null;
  /** Acquitte le pendingWorld (App remet l'état à null). */
  onPendingConsumed: () => void;
  /** Entrée dans la quête (transmis à WorldModal pour M1 seulement). */
  onEnterQuest: () => void;
}

/** Le bundle compare le statut à "en_cours" (lignes 10997/11107) ; la
 * reconstitution lib/mondes-state.ts pose `true` — les deux formes passent. */
function estEnCours(statuts: Record<string, true>, code: string): boolean {
  const valeur: unknown = statuts[code];
  return valeur === true || valeur === 'en_cours';
}

/** Les états RÉELS d'un monde dans l'atlas — dérivés de l'état des quêtes
 * (jamais inventés) et de l'accès séquentiel (un monde s'ouvre après le
 * précédent). */
type EtatMonde = 'termine' | 'en_cours' | 'a_commencer' | 'verrouille' | 'a_venir';

/** Flèche « suite » des boutons — composant `Di` du bundle (10927-10943). */
function Di() {
  return (
    <svg
      viewBox="0 0 24 24"
      width={15}
      height={15}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/** Petit cadenas des chips « Verrouillé » (même dessin que le bloc w-lock). */
function Cadenas() {
  return (
    <svg
      viewBox="0 0 24 24"
      width={10}
      height={10}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="4" y="11" width="16" height="10" rx="2.5" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}

/** Le coche des chips « Terminé ». */
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

export default function Mondes({ pendingWorld, onPendingConsumed, onEnterQuest }: MondesProps) {
  const { tx } = useI18n();
  // Les mondes franchis + le progrès RÉEL par monde (quêtes terminées) —
  // l'atlas reflète l'avancement DÈS LA PREMIÈRE quête posée.
  const { worldsDone, stepsDone, recolte, parMonde } = useProgressionDetail();
  const statuts = useStatutsMondes();
  // L'accès aux mondes reste SÉQUENTIEL : le Monde 2 « Le Volant » ne se
  // déverrouille qu'une fois les trois quêtes du Monde 1 terminées ; le Monde 3
  // « La Boussole » qu'une fois les sept quêtes du Monde 2 terminées.
  const et13 = useEtatQuete('1.3');
  const et14 = useEtatQuete('1.4');
  const et15 = useEtatQuete('1.5');
  const et16 = useEtatQuete('1.6');
  const et17 = useEtatQuete('1.7');
  const et19 = useEtatQuete('1.9');
  const et110 = useEtatQuete('1.10');
  const et111 = useEtatQuete('1.11');
  const et21 = useEtatQuete('2.1');
  const et22 = useEtatQuete('2.2');
  const et23 = useEtatQuete('2.3');
  const et24 = useEtatQuete('2.4');
  const et25 = useEtatQuete('2.5');
  const et26 = useEtatQuete('2.6');
  const et27 = useEtatQuete('2.7');
  const et28 = useEtatQuete('2.8');
  const monde1Fini = useEtatQuete('1.1').terminee && useEtatQuete('1.2').terminee && et13.terminee;
  const monde2Fini = [et14, et15, et16, et17, et19, et110, et111].every((e) => e.terminee);
  const monde3Fini = [et21, et22, et23, et24, et25, et26, et27, et28].every((e) => e.terminee);
  const [openCode, setOpenCode] = useState<string | null>(null);
  const openWorld = openCode ? (WORLDS.find((w) => w.code === openCode) ?? null) : null;
  const fermerFiche = useCallback(() => setOpenCode(null), []);

  // pendingWorld : la fiche demandée s'ouvre une fois, puis on l'acquitte.
  useEffect(() => {
    if (!pendingWorld) return;
    setOpenCode(pendingWorld);
    onPendingConsumed();
  }, [pendingWorld, onPendingConsumed]);

  const ouvrirFiche = (w: VoyageWorld) => setOpenCode(w.code);

  /** L'état RÉEL d'un monde — vérité de l'état des quêtes + accès séquentiel.
   *  C'est LE fix de la remontée fondateur : M3 « open » mais M2 non fini =
   *  VERROUILLÉ (la carte ne propose plus « Commencer »). */
  const etatDeMonde = (w: VoyageWorld): EtatMonde => {
    if (w.num <= worldsDone) return 'termine';
    const ouvrable =
      w.code === 'M1'
        ? true
        : w.code === 'M2'
          ? monde1Fini
          : w.code === 'M3'
            ? monde2Fini
            : w.code === 'M4'
              ? monde3Fini
              : false;
    if (w.status === 'open' && !ouvrable) return 'verrouille';
    const faites = parMonde[w.code]?.faites ?? 0;
    if (estEnCours(statuts, w.code) || faites > 0) return 'en_cours';
    if (w.status === 'open') return 'a_commencer';
    return 'a_venir';
  };

  // La géographie de l'atlas : mondes LIVRÉS (un progrès est possible),
  // mondes À VENIR (M5→M10, compact) et LA DESTINATION (M11, carte dédiée).
  const livrees = WORLDS.filter((w) => !!parMonde[w.code]);
  const destination = WORLDS[WORLDS.length - 1];
  const aVenir = WORLDS.filter((w) => w.status === 'soon' && w !== destination);
  // L'arrêt actuel : le premier monde livré non traversé (jamais verrouillé :
  // si le précédent est fini, le suivant est ouvrable).
  const frontiere = livrees.find((w) => etatDeMonde(w) !== 'termine') ?? null;
  const frontiereFaites = frontiere ? (parMonde[frontiere.code]?.faites ?? 0) : 0;
  const frontiereEngagee = frontiere ? etatDeMonde(frontiere) === 'en_cours' : false;

  /** La barre de progression réelle d'un monde engagé. */
  const barre = (w: VoyageWorld, faites: number, enCarte: boolean) => (
    <div
      className={enCarte ? 'm-bar m-bar-in-card' : 'm-bar'}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={w.quests}
      aria-valuenow={faites}
      aria-label={tx('Progression du monde {{nom}}', { nom: w.name })}
    >
      <div
        className="m-bar-fill"
        style={{ width: `${Math.round((faites / Math.max(1, w.quests)) * 100)}%` }}
      />
    </div>
  );

  return (
    <main className="screen">
      <h1 className="screen-title">{tx('Les Mondes du Voyage')}</h1>
      <p className="screen-sub">
        {tx('{{n}} mondes jalonnent ton chemin — chacun révèle un territoire de toi. Touche un monde pour découvrir son objectif, sa récolte et comment ça se passe.', { n: WORLDS.length })}
      </p>

      {/* HÉROS — l'arrêt actuel, impossible à manquer. */}
      <section className="m-hero" aria-label={tx('Ton arrêt actuel')}>
        {frontiere ? (
          <>
            <span
              className="m-hero-ico"
              style={{ background: frontiere.tile.bg, color: frontiere.tile.fg }}
              aria-hidden="true"
            >
              <VoyageIcon name={frontiere.icon as VoyageIconName} size={26} />
            </span>
            <div className="m-hero-body">
              <small className="m-hero-label">{tx('Tu es ici')}</small>
              <h2>{frontiere.name}</h2>
              {frontiereFaites > 0 && (
                <div className="m-hero-row">
                  {barre(frontiere, frontiereFaites, false)}
                  <span className="m-hero-count">
                    {tx('{{faites}}/{{total}} étapes', {
                      faites: frontiereFaites,
                      total: frontiere.quests,
                    })}
                  </span>
                </div>
              )}
              <div className="m-stats" role="list" aria-label={tx('Le voyage en chiffres')}>
                <span role="listitem">
                  <strong>{worldsDone}/{WORLDS.length}</strong> {tx('mondes traversés')}
                </span>
                <span role="listitem">
                  <strong>{stepsDone}/{TOTAL_STEPS}</strong> {tx('étapes')}
                </span>
                <span role="listitem">
                  <strong>{recolte}</strong> {recolte > 1 ? tx('cartes') : tx('carte')}
                </span>
              </div>
            </div>
            <button
              type="button"
              className="btn btn-accent m-hero-cta"
              onClick={() => ouvrirFiche(frontiere)}
              aria-label={
                frontiereEngagee
                  ? tx('Continuer le monde {{nom}} — ouvrir sa fiche', { nom: frontiere.name })
                  : tx('Commencer le monde {{nom}} — ouvrir sa fiche', { nom: frontiere.name })
              }
            >
              {frontiereEngagee ? tx('Continuer') : tx('Commencer')}
              <Di />
            </button>
          </>
        ) : (
          <>
            <span className="m-hero-ico m-hero-ico-end" aria-hidden="true">
              <VoyageIcon name="signpost" size={26} />
            </span>
            <div className="m-hero-body">
              <small className="m-hero-label">{tx('Tu es ici')}</small>
              <h2>{tx('Tous les mondes ouverts sont traversés')}</h2>
              <p className="m-hero-meta">
                {tx("La suite du voyage arrive — les prochains mondes s'ouvriront bientôt.")}
              </p>
              <div className="m-stats" role="list" aria-label={tx('Le voyage en chiffres')}>
                <span role="listitem">
                  <strong>{worldsDone}/{WORLDS.length}</strong> {tx('mondes traversés')}
                </span>
                <span role="listitem">
                  <strong>{stepsDone}/{TOTAL_STEPS}</strong> {tx('étapes')}
                </span>
                <span role="listitem">
                  <strong>{recolte}</strong> {recolte > 1 ? tx('cartes') : tx('carte')}
                </span>
              </div>
            </div>
          </>
        )}
      </section>

      {/* TON CHEMIN — les mondes livrés, en colonne, dans l'ordre du voyage. */}
      <h2 className="m-sec-title">{tx('Ton chemin')}</h2>
      <ol className="m-list" aria-label={tx('Les mondes du chemin — touche un monde pour le découvrir')}>
        {livrees.map((w) => {
          const etat = etatDeMonde(w);
          const faites = parMonde[w.code]?.faites ?? 0;
          const precedent = WORLDS.find((x) => x.num === w.num - 1);
          return (
            <li
              key={w.code}
              className={
                etat === 'termine'
                  ? 'm-world m-world-click m-world-done'
                  : etat === 'verrouille'
                    ? 'm-world m-world-click m-world-locked'
                    : 'm-world m-world-click'
              }
              onClick={() => ouvrirFiche(w)}
            >
              <span
                className="m-world-ico"
                style={{ background: w.tile.bg, color: w.tile.fg }}
                aria-hidden="true"
              >
                <VoyageIcon name={w.icon as VoyageIconName} size={24} />
              </span>
              <div className="m-world-body">
                <small className="m-world-num">
                  {tx('Monde {{n}} sur {{total}}', { n: w.num, total: WORLDS.length })}
                </small>
                <h2>{w.name}</h2>
                <p>{w.tagline}</p>
                <div className="m-world-meta">
                  <span className="m-world-steps">
                    {faites > 0
                      ? tx('{{faites}}/{{total}} étapes', { faites, total: w.quests })
                      : tx('{{n}} étape{{s}}', { n: w.quests, s: w.quests > 1 ? 's' : '' })}
                  </span>
                  {etat === 'termine' ? (
                    <span className="v-chip v-chip-done">
                      <Coche />
                      {tx('Terminé')}
                    </span>
                  ) : etat === 'en_cours' ? (
                    <span className="v-chip v-chip-now">
                      <span className="v-chip-dot" aria-hidden="true" />
                      {tx('En cours')}
                    </span>
                  ) : etat === 'verrouille' ? (
                    <span className="v-chip v-chip-lock">
                      <Cadenas />
                      {tx('Verrouillé')}
                    </span>
                  ) : etat === 'a_venir' ? (
                    <span className="v-chip v-chip-soon">{tx('À venir')}</span>
                  ) : null}
                  {!w.free && (
                    <span className="v-prem">
                      <VoyageIcon name="gem" size={10} strokeWidth={2.2} />
                      <em>Premium</em>
                    </span>
                  )}
                  {etat === 'en_cours' || etat === 'a_commencer' ? (
                    <button
                      type="button"
                      className="m-world-btn m-world-btn-accent"
                      onClick={() => ouvrirFiche(w)}
                      aria-label={
                        etat === 'en_cours'
                          ? tx('Continuer le monde {{nom}} — ouvrir sa fiche', { nom: w.name })
                          : tx('Commencer le monde {{nom}} — ouvrir sa fiche', { nom: w.name })
                      }
                    >
                      {etat === 'en_cours' ? tx('Continuer') : tx('Commencer')}
                      <Di />
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="m-world-btn"
                      onClick={() => ouvrirFiche(w)}
                      aria-label={
                        etat === 'termine'
                          ? tx('Découvrir le monde {{nom}} (traversé)', { nom: w.name })
                          : tx('Découvrir le monde {{nom}} (à venir)', { nom: w.name })
                      }
                    >
                      {etat === 'termine' ? tx('Revoir') : tx('Découvrir')}
                      <Di />
                    </button>
                  )}
                </div>
                {etat === 'en_cours' && faites > 0 && barre(w, faites, true)}
                {etat === 'verrouille' ? (
                  <p className="m-world-note">
                    {tx("Ce monde s'ouvrira quand tu auras terminé {{nom}}.", {
                      nom: precedent?.name ?? tx('le monde précédent'),
                    })}
                  </p>
                ) : (
                  w.note &&
                  w.num !== WORLDS.length && <p className="m-world-note">{w.note}</p>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      {/* LA SUITE DU VOYAGE — compacte : l'atlas n'enterre plus le jouable. */}
      <h2 className="m-sec-title">{tx('La suite du voyage')}</h2>
      <ul className="m-soon-grid">
        {aVenir.map((w) => (
          <li key={w.code}>
            <button
              type="button"
              className="m-soon"
              onClick={() => ouvrirFiche(w)}
              aria-label={tx('Découvrir le monde {{nom}} (à venir)', { nom: w.name })}
            >
              <span
                className="m-soon-ico"
                style={{ background: w.tile.bg, color: w.tile.fg }}
                aria-hidden="true"
              >
                <VoyageIcon name={w.icon as VoyageIconName} size={20} />
              </span>
              <span className="m-soon-body">
                <small>{tx('Monde {{n}} sur {{total}}', { n: w.num, total: WORLDS.length })}</small>
                <strong>{w.name}</strong>
                <span className="m-soon-meta">
                  {tx('{{n}} étape{{s}}', { n: w.quests, s: w.quests > 1 ? 's' : '' })}
                  <span className="v-chip v-chip-soon">{tx('À venir')}</span>
                  {!w.free && (
                    <span className="v-prem">
                      <VoyageIcon name="gem" size={10} strokeWidth={2.2} />
                      <em>Premium</em>
                    </span>
                  )}
                </span>
              </span>
              <Di />
            </button>
          </li>
        ))}
      </ul>

      {/* LA DESTINATION — M11, jamais payante, débloquée au premier match. */}
      <h2 className="m-sec-title">{tx('La destination')}</h2>
      <ol className="m-list" aria-label={tx('La destination du voyage')}>
        <li
          className="m-world m-world-click m-world-dest"
          onClick={() => ouvrirFiche(destination)}
        >
          <span
            className="m-world-ico"
            style={{ background: destination.tile.bg, color: destination.tile.fg }}
            aria-hidden="true"
          >
            <VoyageIcon name={destination.icon as VoyageIconName} size={24} />
          </span>
          <div className="m-world-body">
            <small className="m-world-num">
              {tx('Monde {{n}} sur {{total}}', {
                n: destination.num,
                total: WORLDS.length,
              })}
            </small>
            <h2>{destination.name}</h2>
            <p>{destination.tagline}</p>
            <div className="m-world-meta">
              <span className="m-world-steps">
                {tx('{{n}} étape{{s}}', {
                  n: destination.quests,
                  s: destination.quests > 1 ? 's' : '',
                })}
              </span>
              <span className="v-chip v-chip-soon">{tx('À venir')}</span>
              <span className="v-free">{tx('Toujours gratuit')}</span>
              <button
                type="button"
                className="m-world-btn"
                onClick={() => ouvrirFiche(destination)}
                aria-label={tx('Découvrir le monde {{nom}} (à venir)', { nom: destination.name })}
              >
                {tx('Découvrir')}
                <Di />
              </button>
            </div>
            {destination.note && <p className="m-world-note">{destination.note}</p>}
          </div>
        </li>
      </ol>

      {/* PIED — le headline suit l'état RÉEL (plus de « premier arrêt » aux
          voyageurs déjà passés). */}
      <article className="card m-foot">
        <span className="m-foot-ico" aria-hidden="true">
          <VoyageIcon name="signpost" size={20} />
        </span>
        <div>
          <h2>
            {worldsDone === 0
              ? tx("Le premier arrêt — Le Miroir — t'attend.")
              : frontiere
                ? tx("Le voyage continue — {{nom}} t'attend.", { nom: frontiere.name })
                : tx('Un monde à la fois — chaque monde franchi éclaire le suivant.')}
          </h2>
          <p>
            {tx("Les mondes s'ouvrent l'un après l'autre : chaque monde franchi éclaire le suivant. Tu ne peux commencer un monde qu'après avoir terminé le précédent.")}
          </p>
        </div>
      </article>
      <a className="btn btn-accent m-foot-cta" href="#/voyage">
        {tx('Voir ma carte du voyage')}
        <Di />
      </a>
      {openWorld && (
        <WorldModal
          key={openWorld.code}
          world={openWorld}
          done={worldsDone}
          progres={parMonde[openWorld.code] ?? null}
          started={estEnCours(statuts, openWorld.code)}
          onClose={fermerFiche}
          // M1 toujours jouable ; M2 jouable une fois le Monde 1 terminé ;
          // M3 jouable une fois le Monde 2 terminé.
          deverrouille={
            openWorld.code === 'M1'
              ? true
              : openWorld.code === 'M2'
                ? monde1Fini
                : openWorld.code === 'M3'
                  ? monde2Fini
                  : openWorld.code === 'M4'
                    ? monde3Fini
                    : false
          }
          onEnterQuest={
            openWorld.code === 'M1' ||
            (openWorld.code === 'M2' && monde1Fini) ||
            (openWorld.code === 'M3' && monde2Fini) ||
            (openWorld.code === 'M4' && monde3Fini)
              ? onEnterQuest
              : undefined
          }
        />
      )}
    </main>
  );
}
