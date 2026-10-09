/**
 * « Les Mondes du Voyage » (#/mondes) — l'atlas des 11 mondes.
 *
 * RECONSTITUTION (5ᵉ reset sandbox) — fidèle au bundle staging (fonction `uh`,
 * lignes 10944-11112 de /tmp/staging-bundle-pretty.js ; petit composant flèche
 * `Di`, lignes 10927-10943, inclus localement) :
 *  - stats réelles (11 mondes / N offerts / 51 étapes / 1 destination) ;
 *  - cartes cliquables ENTIÈRES (li onClick + .m-world-click) — chaque monde
 *    ouvre sa fiche (WorldModal) ; le bouton ne fait qu'ouvrir la fiche aussi ;
 *  - statuts pilotés par useStatutsMondes() (monde en cours) + PROGRESS
 *    (mondes franchis) + WORLDS[].status (open/soon) : Terminé / En cours /
 *    Ouvert (bouton accent « Commencer/Continuer ») / À venir (chip + « Découvrir ») ;
 *  - gemmes 💎 Premium sobres (jamais vendues), note M11, footer « premier arrêt » ;
 *  - pendingWorld : la fiche du monde demandé s'ouvre automatiquement UNE fois
 *    puis onPendingConsumed() (flux App → Mondes) ;
 *  - le CTA « Commencer/Continuer le monde » vit DANS WorldModal : c'est lui
 *    qui pose marquerMondeEnCours puis onEnterQuest (bundle : Do() appelé dans
 *    `lh`, lignes 10704-10710) — Mondes transmet onEnterQuest POUR M1 SEUL.
 *
 * Apostrophes U+0027 (audit Task 25).
 */

import { useCallback, useEffect, useState } from 'react';
import WorldModal from '../components/WorldModal';
import { useStatutsMondes } from '../lib/mondes-state';
import { useEtatQuete } from '../lib/quete-state';
import { FREE_WORLDS, PROGRESS, TOTAL_STEPS, WORLDS } from '../lib/voyage';
import type { VoyageWorld } from '../lib/voyage';
import VoyageIcon from '../components/VoyageIcons';
import type { VoyageIconName } from '../components/VoyageIcons';

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

export default function Mondes({ pendingWorld, onPendingConsumed, onEnterQuest }: MondesProps) {
  const worldsDone = PROGRESS.worldsDone;
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
  const monde1Fini = useEtatQuete('1.1').terminee && useEtatQuete('1.2').terminee && et13.terminee;
  const monde2Fini = [et14, et15, et16, et17, et19, et110, et111].every((e) => e.terminee);
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

  return (
    <main className="screen">
      <h1 className="screen-title">Les Mondes du Voyage</h1>
      <p className="screen-sub">
        {WORLDS.length} mondes jalonnent ton chemin — chacun révèle un territoire de toi. Touche un
        monde pour découvrir son objectif, sa récolte et comment ça se passe.
      </p>
      <div className="m-stats" role="list" aria-label="Le voyage en chiffres">
        <span role="listitem">
          <strong>{WORLDS.length}</strong> mondes
        </span>
        <span role="listitem">
          <strong>{FREE_WORLDS}</strong> offerts
        </span>
        <span role="listitem">
          <strong>{TOTAL_STEPS}</strong> étapes
        </span>
        <span role="listitem">
          <strong>1</strong> destination
        </span>
      </div>
      <ol className="m-list" aria-label="Les 11 mondes du voyage — touche un monde pour le découvrir">
        {WORLDS.map((w) => {
          const franchi = w.num <= worldsDone;
          const enCours = estEnCours(statuts, w.code);
          const ouvert = !franchi && w.status === 'open';
          return (
            <li
              key={w.code}
              className={franchi ? 'm-world m-world-click m-world-done' : 'm-world m-world-click'}
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
                  Monde {w.num} sur {WORLDS.length}
                </small>
                <h2>{w.name}</h2>
                <p>{w.tagline}</p>
                <div className="m-world-meta">
                  <span className="m-world-steps">
                    {w.quests} étape{w.quests > 1 ? 's' : ''}
                  </span>
                  {franchi ? (
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
                  ) : enCours ? (
                    <span className="v-chip v-chip-now">
                      <span className="v-chip-dot" aria-hidden="true" />
                      En cours
                    </span>
                  ) : ouvert ? null : (
                    <span className="v-chip v-chip-soon">À venir</span>
                  )}
                  {!w.free && (
                    <span className="v-prem">
                      <VoyageIcon name="gem" size={10} strokeWidth={2.2} />
                      <em>Premium</em>
                    </span>
                  )}
                  {w.free && w.num === WORLDS.length && (
                    <span className="v-free">Toujours gratuit</span>
                  )}
                  {ouvert ? (
                    <button
                      type="button"
                      className="m-world-btn m-world-btn-accent"
                      onClick={() => ouvrirFiche(w)}
                      aria-label={`${enCours ? 'Continuer' : 'Commencer'} le monde ${w.name} — ouvrir sa fiche`}
                    >
                      {enCours ? 'Continuer' : 'Commencer'}
                      <Di />
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="m-world-btn"
                      onClick={() => ouvrirFiche(w)}
                      aria-label={`Découvrir le monde ${w.name}${franchi ? ' (traversé)' : ' (à venir)'}`}
                    >
                      {franchi ? 'Revoir' : 'Découvrir'}
                      <Di />
                    </button>
                  )}
                </div>
                {w.note && <p className="m-world-note">{w.note}</p>}
              </div>
            </li>
          );
        })}
      </ol>
      <article className="card m-foot">
        <span className="m-foot-ico" aria-hidden="true">
          <VoyageIcon name="signpost" size={20} />
        </span>
        <div>
          <h2>Le premier arrêt — Le Miroir — t'attend.</h2>
          <p>
            Les mondes s'ouvrent l'un après l'autre : chaque monde franchi éclaire le suivant. Tu ne
            peux commencer un monde qu'après avoir terminé le précédent.
          </p>
        </div>
      </article>
      <a className="btn btn-accent m-foot-cta" href="#/voyage">
        Voir ma carte du voyage
        <Di />
      </a>
      {openWorld && (
        <WorldModal
          key={openWorld.code}
          world={openWorld}
          done={worldsDone}
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
                  : false
          }
          onEnterQuest={
            openWorld.code === 'M1' ||
            (openWorld.code === 'M2' && monde1Fini) ||
            (openWorld.code === 'M3' && monde2Fini)
              ? onEnterQuest
              : undefined
          }
        />
      )}
    </main>
  );
}
