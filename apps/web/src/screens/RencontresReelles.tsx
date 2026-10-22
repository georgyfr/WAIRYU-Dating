/**
 * La couche RÉELLE de la rencontre — l'onglet « Matchs » de l'espace
 * (Rencontre-E1, Task 94, SPEC : docs/SPEC-RENONCONTRE-E1.v1.md).
 *
 * L'onglet Découvrir montre la pile (démonstrations en staging + membres
 * réels) ; ICI vivent les matchs réciproques, les pas reçus (aveugles, P4)
 * et la gestion du pas (« Annuler » tant que ce n'est pas un match — le
 * prompt fondateur renomme « Faire un pas » en « Aimer » et « Pas envoyé /
 * Retirer » en « Annuler »).
 *
 * D-R3 : jamais de rencontre inventée · D-R4 : aucun score · D-R2 : la
 * rencontre n'est jamais payante. Apostrophes U+2019.
 */

import { useCallback, useEffect, useState } from 'react';
import { useI18n } from '../i18n/I18nProvider';
import { WORLDS } from '../lib/voyage';
import {
  chargerPool,
  faireUnPas,
  retirerPas,
  type MembrePool,
  type ReponsePool,
} from '../lib/rencontres-client';

/** Le nom affiché d'un monde (les WORLDS sont déjà i18n via avecEN). */
function nomMondeReel(code: string): string {
  return WORLDS.find((w) => w.code === code)?.name ?? code;
}

export default function RencontresReelles() {
  const { tx, lang } = useI18n();
  const [data, setData] = useState<ReponsePool | null>(null);
  const [erreur, setErreur] = useState(false);
  const [occupé, setOccupé] = useState<string | null>(null);
  /** Le match tout frais (banner de réciprocité) — pseudo de l'autre. */
  const [matchFrais, setMatchFrais] = useState<string | null>(null);

  const charger = useCallback(async (): Promise<void> => {
    setErreur(false);
    try {
      const r = await chargerPool();
      setData(r);
    } catch {
      setErreur(true);
    }
  }, []);

  useEffect(() => {
    void charger();
  }, [charger]);

  /** Aimer — l'ancien « Faire un pas », aveugle pour l'autre (P4). */
  const aimerVers = async (m: MembrePool): Promise<void> => {
    if (occupé) return;
    setOccupé(m.id);
    try {
      const r = await faireUnPas(m.id);
      if (r.match) setMatchFrais(m.pseudo ?? tx('Voyageur·se'));
      await charger();
    } catch {
      setErreur(true);
    } finally {
      setOccupé(null);
    }
  };

  /** Annuler — l'ancien « Retirer », possible tant que ce n'est pas un match (P5). */
  const annuler = async (pasId: string): Promise<void> => {
    if (occupé) return;
    setOccupé(pasId);
    try {
      await retirerPas(pasId);
      await charger();
    } catch {
      setErreur(true);
    } finally {
      setOccupé(null);
    }
  };

  // ---- Chargement ----
  if (data === null) {
    return (
      <main className="screen">
        <h1 className="screen-title">{tx('Tes matchs')}</h1>
        <div className="empty">
          <span className="emoji" aria-hidden="true">
            💞
          </span>
          <h2>{tx('Chargement…')}</h2>
        </div>
        {erreur && (
          <article className="card match-info">
            <p>{tx('Impossible de charger tes rencontres — réessaie.')}</p>
            <button type="button" className="btn btn-accent match-info-cta" onClick={() => void charger()}>
              {tx('Réessayer')}
            </button>
          </article>
        )}
      </main>
    );
  }

  const miroir = data.moi.mondes.find((m) => m.code === 'M1') ?? { code: 'M1', faites: 0, total: 3, termine: false };

  // ---- La porte est FERMÉE (jalon A non atteint côté serveur) ----
  if (!data.jalonA) {
    return (
      <main className="screen">
        <h1 className="screen-title">{tx('Tes matchs')}</h1>
        <p className="screen-sub">{tx('Certaines rencontres commencent ici.')}</p>
        <article className="card match-info" aria-live="polite">
          <p>
            <strong>{tx('Ta porte vers la rencontre')}</strong>
          </p>
          <p>
            {tx('Le Miroir — les quêtes terminées : {{faites}}/{{total}}', {
              faites: miroir.faites,
              total: miroir.total,
            })}
          </p>
          <p>{tx('La porte s\u2019ouvrira dès que le Miroir sera traversé (1.1 → 1.3).')}</p>
        </article>
        <article className="card match-info">
          <p>
            {/* Verbatim bundle : espace insécable U+00A0 avant « ? ». */}
            <strong>{tx('Comment ça commence\u00A0?')}</strong>{' '}
            {tx(
              "Ton voyage construit ton portrait et tes affinités — la première personne compatible apparaîtra ici, et le Voyage à Deux s'ouvrira avec elle. La rencontre n'est jamais payante.",
            )}
          </p>
          <a className="btn btn-accent match-info-cta" href="#/voyage">
            {tx('Voir ma carte du voyage')}
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
      </main>
    );
  }

  // ---- La porte est OUVERTE (jalon A) : les matchs + le pas ----
  return (
    <main className="screen">
      <h1 className="screen-title">{tx('Tes matchs')}</h1>
      <p className="screen-sub">{tx('Le Miroir est derrière toi. Certaines rencontres commencent ici.')}</p>

      {matchFrais && (
        <article className="card ren-banner ren-banner-match" role="status" aria-live="polite">
          <p>
            <strong>💞 {tx('C\u2019est un match — deux pas, une réciprocité.')}</strong>
          </p>
        </article>
      )}

      {data.pasRecus > 0 && (
        <article className="card ren-banner">
          <p>
            {data.pasRecus === 1
              ? tx('{{n}} personne a fait un pas vers toi', { n: data.pasRecus })
              : tx('{{n}} personnes ont fait un pas vers toi', { n: data.pasRecus })}
          </p>
          <p className="ren-banner-sub">{tx('Fais ton pas — tu sauras qui, seulement si c\u2019est réciproque.')}</p>
        </article>
      )}

      {/* LES MATCHS — la réciprocité révèle les deux pseudos. La
          conversation naît du match (R.E2, Task 107). */}
      {data.matchs.length > 0 && (
        <section aria-labelledby="ren-matchs-t">
          <h2 id="ren-matchs-t" className="ren-section-title">
            {tx('Tes matchs')}
          </h2>
          <div className="ren-liste">
            {data.matchs.map((m) => (
              <article key={m.id} className="card ren-card">
                <span className="ren-avatar ren-avatar-match" aria-hidden="true">
                  💞
                </span>
                <span className="ren-body">
                  <span className="ren-nom">
                    {tx('Match avec {{pseudo}}', { pseudo: m.autre.pseudo ?? tx('Voyageur·se') })}
                  </span>
                  <span className="ren-depth">
                    {new Date(m.creeA).toLocaleDateString(lang === 'en' ? 'en-IE' : 'fr-FR', {
                      day: 'numeric',
                      month: 'long',
                    })}
                  </span>
                </span>
                <button
                  className="btn btn-accent ren-conv-btn"
                  onClick={() => {
                    sessionStorage.setItem('wairyu.ouvrirConversation', m.id);
                    window.location.hash = '#/messages';
                  }}
                >
                  {tx('Ouvrir la conversation')}
                </button>
              </article>
            ))}
          </div>
          <p className="ren-note">{tx('Une conversation, c\u2019est du temps et des mots — la révélation se mérite (15 messages et 7 jours).')}</p>
        </section>
      )}

      {/* LE PAS — la gestion honnête : aimer, annuler. La pile du
          Découvrir reste l'endroit de la découverte. */}
      <section aria-labelledby="ren-pool-t">
        <h2 id="ren-pool-t" className="ren-section-title">
          {tx('Les membres du voyage')}
        </h2>
        <p className="ren-section-sub">{tx('Des personnes réelles qui ont, comme toi, traversé le Miroir (1.1 → 1.3).')}</p>
        {data.total === 0 ? (
          <div className="empty">
            <span className="emoji" aria-hidden="true">
              🌱
            </span>
            <h2>{tx('Personne dans le pool pour l\u2019instant')}</h2>
            <p>
              {tx('Dès qu\u2019un·e membre franchira le Miroir, il·elle apparaîtra ici — jamais de profil inventé.')}
            </p>
          </div>
        ) : (
          <div className="ren-liste">
            {data.pool.map((m) => (
              <Membre
                key={m.id}
                m={m}
                occupé={occupé === m.id}
                onPas={() => void aimerVers(m)}
                onRetrait={() => m.pasId && void annuler(m.pasId)}
              />
            ))}
          </div>
        )}
      </section>

      <article className="card match-info">
        <p>
          {/* D-R2 + D-R4 — gravés, survivent à tout. */}
          {tx('Ce ne sont pas des notes — jamais de score, jamais de classement. La rencontre n\u2019est jamais payante.')}
        </p>
      </article>
    </main>
  );
}

/** Une personne du pool — pseudo + profondeur du voyage, RIEN d'autre (P3 :
 *  aucune carte exposée en E1, aucune donnée d'identité au-delà du pseudo,
 *  aucune photo — « la voix passe avant le visage », Monde 11). */
function Membre({
  m,
  occupé,
  onPas,
  onRetrait,
}: {
  m: MembrePool;
  occupé: boolean;
  onPas: () => void;
  onRetrait: () => void;
}) {
  const { tx, lang } = useI18n();
  const nom = m.pseudo ?? tx('Voyageur·se');
  const enCours = m.mondes.find((x) => !x.termine);
  const franchis = m.mondes.filter((x) => x.termine);
  return (
    <article className="card ren-card">
      <span className="ren-avatar" aria-hidden="true">
        {nom.charAt(0).toUpperCase()}
      </span>
      <span className="ren-body">
        <span className="ren-nom">{nom}</span>
        <span className="ren-depth">
          {m.mondesFranchis > 0
            ? tx('Mondes franchis : {{n}}', { n: m.mondesFranchis })
            : tx('Monde 1 — Le Miroir')}
          {enCours && (
            <>
              {' · '}
              {tx('{{nom}} — en cours', { nom: nomMondeReel(enCours.code) })}
            </>
          )}
        </span>
        {franchis.length > 0 && (
          <span className="ren-chips">
            {franchis.map((x) => (
              <span key={x.code} className="ren-chip ren-chip-ok">
                {nomMondeReel(x.code)}
              </span>
            ))}
          </span>
        )}
        <span className="ren-depuis">
          {tx('Ici depuis {{date}}', {
            date: new Date(m.depuisA).toLocaleDateString(lang === 'en' ? 'en-IE' : 'fr-FR', {
              month: 'long',
              year: 'numeric',
            }),
          })}
        </span>
      </span>
      <span className="ren-actions">
        {m.match ? (
          <span className="ren-chip ren-chip-match">💞 {tx('Match')}</span>
        ) : m.pasEnvoye ? (
          <button type="button" className="ren-retirer" onClick={onRetrait} disabled={occupé}>
            {tx('Annuler')}
          </button>
        ) : (
          <button type="button" className="ren-pas" onClick={onPas} disabled={occupé}>
            {tx('Aimer')}
          </button>
        )}
      </span>
    </article>
  );
}
