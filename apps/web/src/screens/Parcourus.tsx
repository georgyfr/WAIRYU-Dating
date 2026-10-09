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
 * relire ses résultats et TÉLÉCHARGER le PDF des résultats — sans refaire la
 * quête. Le PDF est régénéré depuis les réponses stockées (scorer + variante
 * déterministes : même carte, mêmes barres que le jour de la passation).
 * Task 36 : chaque quête porte AUSSI « Voir mes résultats en détail » (action
 * principale, deep-link #/quete/{id}/resultats) — les détails complets sont à
 * UN tap, au même endroit que le bouton PDF ; « Relire ma carte » reste là.
 * Le journal du bundle n'est PAS modifié — les chaînes reconstituées restent
 * verbatim (règle 11-b).
 *
 * Aucune prop (bundle : s.jsx(Uh, {})). Apostrophes U+0027 (audit Task 25).
 */

import { useCallback, useState } from 'react';
import { PROGRESS, TOTAL_STEPS, WORLDS } from '../lib/voyage';
import { QUETES, QUETE_IDS, mondeDeQuete } from '../lib/quetes';
import type { IdQuete } from '../lib/quetes';
import { useEtatQuete } from '../lib/quete-state';
import type { EtatQuete } from '../lib/quete-state';
import VoyageIcon from '../components/VoyageIcons';
import type { VoyageIconName } from '../components/VoyageIcons';
import { useI18n } from '../i18n/I18nProvider';

/** Le libellé du monde d'une quête (la série 1.x traverse M1/M2). */
const nomMonde = (id: IdQuete): string => mondeDeQuete(id).nom;

interface QueteTerminee {
  id: IdQuete;
  etat: EtatQuete;
}

function dateCourte(iso: string, lang: 'fr' | 'en'): string {
  try {
    return new Date(iso).toLocaleDateString(lang === 'en' ? 'en-IE' : 'fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return '';
  }
}

export default function Parcourus() {
  const { tx, lang } = useI18n();
  // Ordre FIXE et inconditionnel (règles des hooks) — les 18 quêtes ouvertes
  // (Monde 1 + Monde 2 « Le Volant » + Monde 3 « La Boussole »).
  const etat11 = useEtatQuete('1.1');
  const etat12 = useEtatQuete('1.2');
  const etat13 = useEtatQuete('1.3');
  const etat14 = useEtatQuete('1.4');
  const etat15 = useEtatQuete('1.5');
  const etat16 = useEtatQuete('1.6');
  const etat17 = useEtatQuete('1.7');
  const etat19 = useEtatQuete('1.9');
  const etat110 = useEtatQuete('1.10');
  const etat111 = useEtatQuete('1.11');
  const etat21 = useEtatQuete('2.1');
  const etat22 = useEtatQuete('2.2');
  const etat23 = useEtatQuete('2.3');
  const etat24 = useEtatQuete('2.4');
  const etat25 = useEtatQuete('2.5');
  const etat26 = useEtatQuete('2.6');
  const etat27 = useEtatQuete('2.7');
  const etat28 = useEtatQuete('2.8');
  const etatsParId: Record<IdQuete, EtatQuete> = {
    '1.1': etat11,
    '1.2': etat12,
    '1.3': etat13,
    '1.4': etat14,
    '1.5': etat15,
    '1.6': etat16,
    '1.7': etat17,
    '1.9': etat19,
    '1.10': etat110,
    '1.11': etat111,
    '2.1': etat21,
    '2.2': etat22,
    '2.3': etat23,
    '2.4': etat24,
    '2.5': etat25,
    '2.6': etat26,
    '2.7': etat27,
    '2.8': etat28,
  };
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

  // Les quêtes réellement terminées, dans l'ordre de la chaîne — y compris les
  // écrans SANS carte (1.7 « écran de confiance », 1.11 « écran de passage »,
  // 2.8 « badge miniature »).
  const terminees: QueteTerminee[] = QUETE_IDS.filter((id) => {
    const e = etatsParId[id];
    if (!e.terminee) return false;
    if (QUETES[id].sansCarte) return true;
    return !!e.carteId && !!QUETES[id].cartes[e.carteId as string];
  }).map((id) => ({ id, etat: etatsParId[id] }));

  const worldsDone = PROGRESS.worldsDone;
  const traverses = WORLDS.filter((w) => w.num <= worldsDone);
  return (
    <main className="screen">
      <h1 className="screen-title">{tx('Mes Mondes parcourus')}</h1>
      <p className="screen-sub">{tx("Ton journal de bord — les mondes traversés et ce qu'ils t'ont révélé.")}</p>
      <div className="m-stats" role="list" aria-label={tx('Ton parcours en chiffres')}>
        <span role="listitem">
          <strong>
            {worldsDone}/{WORLDS.length}
          </strong>{' '}
          {tx('mondes franchis')}
        </span>
        <span role="listitem">
          <strong>
            {PROGRESS.stepsDone}/{TOTAL_STEPS}
          </strong>{' '}
          {tx('étapes')}
        </span>
      </div>
      {traverses.length === 0 ? (
        <div className="empty">
          <span className="emoji" aria-hidden="true">
            🪞
          </span>
          <h2>{tx("Aucun monde traversé pour l'instant")}</h2>
          <p>
            {tx("Le Monde 1 — Le Miroir — ouvre bientôt le chemin. Dès qu'un monde est franchi, il rejoint ton journal avec ce que tu y as découvert.")}
          </p>
        </div>
      ) : (
        <ol className="m-list" aria-label={tx('Les mondes que tu as traversés')}>
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
                  {tx('Monde {{n}} sur {{total}}', { n: w.num, total: WORLDS.length })}
                </small>
                <h2>{w.name}</h2>
                <p>{w.tagline}</p>
                <div className="m-world-meta">
                  <span className="m-world-steps">
                    {tx('{{n}} étape{{s}}', { n: w.quests, s: w.quests > 1 ? 's' : '' })}
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
                    {tx('Terminé')}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}
      {terminees.length > 0 && (
        <section className="m-res" aria-label={tx('Tes résultats de quêtes')}>
          <h2 className="m-res-titre">{tx('Tes résultats')}</h2>
          <p className="m-res-sub">
            {tx("Chaque quête franchie te laisse une carte et tes résultats détaillés. Relis-les quand tu veux, ou garde-les avec toi en PDF — tout t'attend ici, intact.")}
          </p>
          <ol className="m-res-list">
            {terminees.map(({ id, etat }) => {
              const quete = QUETES[id];
              const sansCarte = !!quete.sansCarte;
              const carte = etat.carteId ? quete.cartes[etat.carteId] : undefined;
              const date = etat.termineeA ? dateCourte(etat.termineeA, lang) : '';
              return (
                <li key={id} className="m-res-item">
                  <small className="m-res-num">
                    {tx('Quête {{n}} sur {{total}}', { n: quete.numero, total: quete.totalDuMonde })}
                    {' · '}
                    {nomMonde(id)}
                  </small>
                  <h3>{quete.titre}</h3>
                  {sansCarte ? (
                    <p className="m-res-carte">{tx('Un écran de passage — rien à mesurer, tout reste modifiable.')}</p>
                  ) : carte ? (
                    <p className="m-res-carte">
                      {tx('Ta carte\u00a0: ')}
                      <strong>{carte.nom}</strong>
                    </p>
                  ) : null}
                  {date && (
                    <p className="m-res-date">
                      {sansCarte ? tx('Fait le') : tx('Carte obtenue le')} {date}
                    </p>
                  )}
                  <div className="m-res-actions">
                    {sansCarte ? (
                      <a className="btn btn-accent" href={`#/quete/${id}`}>
                        {tx('Revoir mon écran')}
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
                    ) : (
                      <>
                        <a className="btn btn-accent" href={`#/quete/${id}/resultats`}>
                          {tx('Voir mes résultats en détail')}
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
                        <a className="btn btn-ghost" href={`#/quete/${id}`}>
                          {tx('Relire ma carte')}
                        </a>
                        <button
                          type="button"
                          className="btn btn-ghost"
                          onClick={() => void telechargerPdf(id)}
                          disabled={pdfEnCours !== null}
                          aria-busy={pdfEnCours === id}
                        >
                          {pdfEnCours === id ? tx('Préparation…') : tx('Télécharger le PDF')}
                        </button>
                      </>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </section>
      )}
      <div className="parc-actions">
        <a className="btn btn-accent" href="#/mondes">
          {tx('Découvrir les Mondes')}
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
          {tx('Voir ma carte du voyage')}
        </a>
      </div>
    </main>
  );
}
