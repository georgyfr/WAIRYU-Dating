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
 * COUCHE APP (demande fondateur, Task 31) : une section « Tes résultats »
 * liste les quêtes TERMINÉES (état réel wairyu.quete.{id}) pour qu'on puisse
 * RELIRE sa carte (#/quete/{id} — la vue carte d'origine, intacte) et
 * TÉLÉCHARGER le PDF des résultats — sans refaire la quête. Le PDF est régénéré
 * depuis les réponses stockées (scorer + variante déterministes : même carte,
 * mêmes barres que le jour de la passation). Le journal du bundle n'est PAS
 * modifié — les chaînes reconstituées restent verbatim (règle 11-b).
 *
 * Aucune prop (bundle : s.jsx(Uh, {})). Apostrophes U+0027 (audit Task 25).
 */

import { useCallback, useState } from 'react';
import { PROGRESS, TOTAL_STEPS, WORLDS } from '../lib/voyage';
import { QUETES, QUETE_IDS } from '../lib/quetes';
import type { IdQuete } from '../lib/quetes';
import { useEtatQuete } from '../lib/quete-state';
import type { EtatQuete } from '../lib/quete-state';
import VoyageIcon from '../components/VoyageIcons';
import type { VoyageIconName } from '../components/VoyageIcons';

/** Le monde des quêtes ouvertes (M1 — Le Miroir) pour la tuile et le libellé. */
const MONDE_QUETES = WORLDS.find((w) => w.code === 'M1');

interface QueteTerminee {
  id: IdQuete;
  etat: EtatQuete;
}

function dateCourte(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return '';
  }
}

export default function Parcourus() {
  // Ordre FIXE et inconditionnel (règles des hooks) — les 3 quêtes ouvertes.
  const etat11 = useEtatQuete('1.1');
  const etat12 = useEtatQuete('1.2');
  const etat13 = useEtatQuete('1.3');
  const etatsParId: Record<IdQuete, EtatQuete> = { '1.1': etat11, '1.2': etat12, '1.3': etat13 };
  const [pdfEnCours, setPdfEnCours] = useState<IdQuete | null>(null);

  /** Régénère le PDF depuis les réponses stockées — même carte, mêmes barres. */
  const telechargerPdf = useCallback(
    async (id: IdQuete): Promise<void> => {
      const quete = QUETES[id];
      const etat = etatsParId[id];
      const carte = etat?.carteId ? quete.cartes[etat.carteId] : undefined;
      if (!carte) return;
      setPdfEnCours(id);
      try {
        const { telechargerResultatsPdf } = await import('../lib/pdf-resultats');
        await telechargerResultatsPdf(quete, carte, etat.reponses);
      } finally {
        setPdfEnCours(null);
      }
    },
    // etatsParId est reconstruit à chaque rendu mais les hooks retournent des
    // snapshots stables par identité — les valeurs utilisées (carte, réponses)
    // viennent de l'état réactif du rendu courant.
    [etatsParId],
  );

  // Les quêtes réellement terminées, dans l'ordre de la chaîne du monde.
  const terminees: QueteTerminee[] = QUETE_IDS.filter((id) => {
    const e = etatsParId[id];
    return e.terminee && !!e.carteId && !!QUETES[id].cartes[e.carteId as string];
  }).map((id) => ({ id, etat: etatsParId[id] }));

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
      {terminees.length > 0 && (
        <section className="m-res" aria-label="Tes résultats de quêtes">
          <h2 className="m-res-titre">Tes résultats</h2>
          <p className="m-res-sub">
            Chaque quête franchie te laisse une carte. Relis-la quand tu veux, ou garde-la avec
            toi en PDF — elle t'attend ici, intacte.
          </p>
          <ol className="m-res-list">
            {terminees.map(({ id, etat }) => {
              const quete = QUETES[id];
              const carte = quete.cartes[etat.carteId as string];
              const date = etat.termineeA ? dateCourte(etat.termineeA) : '';
              return (
                <li key={id} className="m-res-item">
                  <small className="m-res-num">
                    Quête {quete.numero} sur {quete.totalDuMonde}
                    {MONDE_QUETES ? ` · ${MONDE_QUETES.name}` : ''}
                  </small>
                  <h3>{quete.titre}</h3>
                  <p className="m-res-carte">
                    Ta carte&nbsp;: <strong>{carte.nom}</strong>
                  </p>
                  {date && <p className="m-res-date">Carte obtenue le {date}</p>}
                  <div className="m-res-actions">
                    <a className="btn btn-accent" href={`#/quete/${id}`}>
                      Relire ma carte
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
                    <button
                      type="button"
                      className="btn btn-ghost"
                      onClick={() => void telechargerPdf(id)}
                      disabled={pdfEnCours !== null}
                      aria-busy={pdfEnCours === id}
                    >
                      {pdfEnCours === id ? 'Préparation…' : 'Télécharger le PDF'}
                    </button>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>
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
