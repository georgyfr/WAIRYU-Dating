/**
 * « Mes Mondes parcourus » (#/parcourus) — le journal de bord.
 *
 * RÉORGANISATION (Task 42, demande fondateur — même traitement que l'atlas
 * #/mondes en Task 41) :
 *  - HÉROS « Ton journal » : le % RÉEL du voyage parcouru (barre + chiffres
 *    vivants x/11 mondes · y/51 étapes · z cartes) + CTA « Continuer le
 *    voyage » → #/mondes ;
 *  - « Là où tu en es » : l'arrêt ACTUEL (premier monde livré non traversé)
 *    avec sa barre de progression — le journal restait silencieux sur le
 *    monde EN COURS (il ne montrait que les mondes FINIS) ;
 *  - le journal des mondes traversés gagne la DATE de clôture réelle
 *    (parMonde.derniereA — « Traversé le 5 octobre 2026 ») ;
 *  - « Tes résultats » est GROUPÉ PAR MONDE : un en-tête par monde (tuile,
 *    nom, compteur X/N quêtes) — les 18 quêtes ouvertes ne forment plus une
 *    liste plate qui répète « MONDE X » dans chaque carte ; la grille 2
 *    colonnes ≥760px est SUPPRIMÉE (la coque fait 480px — cartes écrasées,
 *    boutons sur 3 lignes) ;
 *  - les actions PDF / résultats détaillés / relecture restent sur chaque
 *    quête (Task 31/36 — inchangées).
 *
 * Session/état : useEtatQuete (18 quêtes ouvertes) + useProgressionDetail
 * (mondes franchis, étapes, cartes, parMonde). PDF régénéré depuis les
 * réponses stockées (scorer + variante déterministes).
 * Apostrophes U+0027 (audit Task 25).
 */

import { useCallback, useState } from 'react';
import { TOTAL_STEPS, WORLDS } from '../lib/voyage';
import type { VoyageWorld } from '../lib/voyage';
import { QUETES, QUETE_IDS, mondeDeQuete } from '../lib/quetes';
import type { IdQuete } from '../lib/quetes';
import { useEtatQuete } from '../lib/quete-state';
import type { EtatQuete } from '../lib/quete-state';
import { useProgressionDetail } from '../lib/progression';
import VoyageIcon from '../components/VoyageIcons';
import type { VoyageIconName } from '../components/VoyageIcons';
import { useI18n } from '../i18n/I18nProvider';

interface QueteTerminee {
  id: IdQuete;
  etat: EtatQuete;
}

/** Un groupe de résultats — toutes les quêtes terminées d'UN monde. */
interface GroupeResultats {
  monde: VoyageWorld;
  items: QueteTerminee[];
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
  // Ordre FIXE et inconditionnel (règles des hooks) — les 25 quêtes ouvertes
  // (Monde 1 + Monde 2 « Le Volant » + Monde 3 « La Boussole » + Monde 4
  // « Ton Terrain »).
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
  const etat31 = useEtatQuete('3.1');
  const etat32 = useEtatQuete('3.2');
  const etat33 = useEtatQuete('3.3');
  const etat34 = useEtatQuete('3.4');
  const etat35 = useEtatQuete('3.5');
  const etat36 = useEtatQuete('3.6');
  const etat37 = useEtatQuete('3.7');
  const etat41 = useEtatQuete('4.1');
  const etat42 = useEtatQuete('4.2');
  const etat43 = useEtatQuete('4.3');
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
    '3.1': etat31,
    '3.2': etat32,
    '3.3': etat33,
    '3.4': etat34,
    '3.5': etat35,
    '3.6': etat36,
    '3.7': etat37,
    '4.1': etat41,
    '4.2': etat42,
    '4.3': etat43,
  };
  const [pdfEnCours, setPdfEnCours] = useState<IdQuete | null>(null);
  // La progression RÉELLE + le détail par monde (dates de clôture, compteurs).
  const progression = useProgressionDetail();
  const { worldsDone, stepsDone, recolte, parMonde } = progression;

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

  // Les résultats GROUPÉS PAR MONDE (l'ordre de QUETE_IDS rend les groupes
  // contigus : 1.x traverse M1 puis M2, 2.x = M3).
  const groupes: GroupeResultats[] = [];
  for (const t of terminees) {
    const code = mondeDeQuete(t.id).code;
    const monde = WORLDS.find((w) => w.code === code);
    if (!monde) continue;
    const dernier = groupes[groupes.length - 1];
    if (dernier && dernier.monde.code === code) dernier.items.push(t);
    else groupes.push({ monde, items: [t] });
  }

  // Le journal : les mondes FRANCHIS (toutes leurs quêtes livrées terminées).
  const traverses = WORLDS.filter((w) => w.num <= worldsDone);

  // L'arrêt ACTUEL : le premier monde livré non traversé — le journal montre
  // aussi le monde EN COURS (il restait silencieux dessus).
  const livrees = WORLDS.filter((w) => !!parMonde[w.code]);
  const frontiere = livrees.find((w) => {
    const p = parMonde[w.code];
    return !p || p.faites < p.total;
  }) ?? null;
  const frontiereFaites = frontiere ? (parMonde[frontiere.code]?.faites ?? 0) : 0;

  // Le % réel du voyage (51 pas — le 51ᵉ est la Rencontre).
  const pourcent = Math.round((stepsDone / TOTAL_STEPS) * 100);

  return (
    <main className="screen">
      <h1 className="screen-title">{tx('Mes Mondes parcourus')}</h1>
      <p className="screen-sub">{tx("Ton journal de bord — les mondes traversés et ce qu'ils t'ont révélé.")}</p>

      {/* HÉROS — le voyage parcouru, en chiffres réels. */}
      <section className="m-hero" aria-label={tx('Ton journal')}>
        <span
          className="m-hero-ico"
          style={{ background: '#dff3f4', color: '#2a9aa0' }}
          aria-hidden="true"
        >
          <VoyageIcon name="signpost" size={26} />
        </span>
        <div className="m-hero-body">
          <small className="m-hero-label">{tx('Ton journal')}</small>
          <h2>{tx('{{p}} % de ton voyage parcouru', { p: pourcent })}</h2>
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
          <div className="m-stats" role="list" aria-label={tx('Ton parcours en chiffres')}>
            <span role="listitem">
              <strong>{worldsDone}/{WORLDS.length}</strong> {tx('mondes franchis')}
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

      {/* LÀ OÙ TU EN ES — l'arrêt actuel, même silhouette que l'atlas. */}
      {frontiere && (stepsDone > 0 || worldsDone > 0) && (
        <>
          <h2 className="m-sec-title">{tx('Là où tu en es')}</h2>
          <ol className="m-list" aria-label={tx('Là où tu en es')}>
            <li className="m-world">
              <span
                className="m-world-ico"
                style={{ background: frontiere.tile.bg, color: frontiere.tile.fg }}
                aria-hidden="true"
              >
                <VoyageIcon name={frontiere.icon as VoyageIconName} size={24} />
              </span>
              <div className="m-world-body">
                <small className="m-world-num">
                  {tx('Monde {{n}} sur {{total}}', { n: frontiere.num, total: WORLDS.length })}
                </small>
                <h2>{frontiere.name}</h2>
                <p>{frontiere.tagline}</p>
                <div className="m-world-meta">
                  <span className="m-world-steps">
                    {frontiereFaites > 0
                      ? tx('{{faites}}/{{total}} étapes', {
                          faites: frontiereFaites,
                          total: frontiere.quests,
                        })
                      : tx('{{n}} étape{{s}}', {
                          n: frontiere.quests,
                          s: frontiere.quests > 1 ? 's' : '',
                        })}
                  </span>
                  {frontiereFaites > 0 ? (
                    <span className="v-chip v-chip-now">
                      <span className="v-chip-dot" aria-hidden="true" />
                      {tx('En cours')}
                    </span>
                  ) : (
                    <span className="v-chip v-chip-soon">{tx('Prochain monde')}</span>
                  )}
                  <a className="m-world-btn m-world-btn-accent" href="#/mondes">
                    {frontiereFaites > 0 ? tx('Continuer') : tx('Commencer')}
                  </a>
                </div>
                {frontiereFaites > 0 && (
                  <div
                    className="m-bar m-bar-in-card"
                    role="progressbar"
                    aria-valuemin={0}
                    aria-valuemax={frontiere.quests}
                    aria-valuenow={frontiereFaites}
                    aria-label={tx('Progression du monde {{nom}}', { nom: frontiere.name })}
                  >
                    <div
                      className="m-bar-fill"
                      style={{
                        width: `${Math.round((frontiereFaites / Math.max(1, frontiere.quests)) * 100)}%`,
                      }}
                    />
                  </div>
                )}
              </div>
            </li>
          </ol>
        </>
      )}

      {/* LE JOURNAL — les mondes traversés, avec leur date de clôture réelle. */}
      {traverses.length === 0 ? (
        <div className="empty">
          <span className="emoji" aria-hidden="true">
            {stepsDone > 0 ? '🧭' : '🪞'}
          </span>
          {stepsDone > 0 ? (
            <>
              <h2>{tx("Ton premier monde n'est pas encore franchi")}</h2>
              <p>
                {tx("Chaque quête terminée t'en rapproche — et tes résultats t'attendent juste ici, plus bas.")}
              </p>
            </>
          ) : (
            <>
              <h2>{tx("Aucun monde traversé pour l'instant")}</h2>
              <p>
                {tx("Le Monde 1 — Le Miroir — ouvre bientôt le chemin. Dès qu'un monde est franchi, il rejoint ton journal avec ce que tu y as découvert.")}
              </p>
            </>
          )}
        </div>
      ) : (
        <ol className="m-list" aria-label={tx('Les mondes que tu as traversés')}>
          {traverses.map((w) => {
            const cloture = parMonde[w.code]?.derniereA ?? null;
            const date = cloture ? dateCourte(cloture, lang) : '';
            return (
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
                  {date && (
                    <p className="m-world-date">{tx('Traversé le {{date}}', { date })}</p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      )}

      {/* TES RÉSULTATS — groupés par monde : un en-tête par monde, puis ses
          quêtes (le monde n'est plus répété dans chaque carte). */}
      {terminees.length > 0 && (
        <section className="m-res" aria-label={tx('Tes résultats de quêtes')}>
          <h2 className="m-res-titre">{tx('Tes résultats')}</h2>
          <p className="m-res-sub">
            {tx("Chaque quête franchie te laisse une carte et tes résultats détaillés. Relis-les quand tu veux, ou garde-les avec toi en PDF — tout t'attend ici, intact.")}
          </p>
          {groupes.map(({ monde, items }) => {
            const faites = parMonde[monde.code]?.faites ?? items.length;
            return (
              <div key={monde.code} className="m-res-groupe">
                <h3 className="m-res-groupe-titre">
                  <span
                    className="m-res-groupe-ico"
                    style={{ background: monde.tile.bg, color: monde.tile.fg }}
                    aria-hidden="true"
                  >
                    <VoyageIcon name={monde.icon as VoyageIconName} size={19} />
                  </span>
                  <span className="m-res-groupe-body">
                    <small>
                      {tx('Monde {{n}} sur {{total}}', { n: monde.num, total: WORLDS.length })}
                    </small>
                    <strong>{monde.name}</strong>
                  </span>
                  <span className="m-res-groupe-count">
                    {tx('{{faites}}/{{total}} quêtes', {
                      faites,
                      total: parMonde[monde.code]?.total ?? monde.quests,
                    })}
                  </span>
                </h3>
                <ol className="m-res-list">
                  {items.map(({ id, etat }) => {
                    const quete = QUETES[id];
                    const sansCarte = !!quete.sansCarte;
                    const carte = etat.carteId ? quete.cartes[etat.carteId] : undefined;
                    const date = etat.termineeA ? dateCourte(etat.termineeA, lang) : '';
                    return (
                      <li key={id} className="m-res-item">
                        <small className="m-res-num">
                          {tx('Quête {{n}} sur {{total}}', {
                            n: quete.numero,
                            total: quete.totalDuMonde,
                          })}
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
              </div>
            );
          })}
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
