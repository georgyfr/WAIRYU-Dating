/**
 * Les feuilles et écrans de l'onglet Découvrir — la feuille « Demander à
 * [prénom] », les filtres (résultats en direct), le profil complet et
 * l'écran de match.
 *
 * Prompt fondateur (§4-§8 + design de référence) : passages cités, questions
 * PRÉ-RÉDIGÉES par intention (jamais générées), champ 200 caractères avec
 * compteur, aperçu, « ta question vaut un like », profil complet à la
 * TROISIÈME personne avec lignes « Avec elle / Avec lui », cartes cachées
 * verrouillées avec leurs sceaux, écran de match avec raison EN MOTS et
 * 3 phrases suggérées — jamais de score (D-R4).
 *
 * Accessibilité : role=dialog aria-modal, Échap ferme, focus visible,
 * cibles ≥ 44 px, prefers-reduced-motion (CSS).
 */
import './Decouvrir.css';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { useI18n } from '../i18n/I18nProvider';
import { WORLDS } from '../lib/voyage';
import {
  BANDES_MONDES,
  ETIQUETTES_INTENTION,
  ligneAvec,
  questionsDe,
  reponsesRapides,
  type CarteRencontre,
  type Intention,
} from '../lib/profils-demo';

/** Le sujet d'une carte de la pile — profil de démonstration OU membre réel. */
export interface Sujet {
  id: string;
  prenom: string;
  photo: string | null;
  /** L'initiale neutre (membre réel sans photo — jamais d'identifiant). */
  initiale: string | null;
  age: number | null;
  ville: string | null;
  distanceKm: number | null;
  intention: string | null;
  verifie: boolean;
  metier: string | null;
  bio: string | null;
  interets: string[];
  echo: number;
  cartes: CarteRencontre[];
  cartesCachees: { monde: string; titre: string; sceau: string }[];
  raison: string | null;
  phrasePortrait: string | null;
  raisonMatch: string | null;
  phrasesMatch: string[];
  demo: boolean;
  reel: boolean;
  /** Cette personne t'a déjà liké (démos — aimer en retour = match). */
  likeRecu: boolean;
  mondeFranchisN: number;
  mondeEnCoursNom: string | null;
  pasEnvoye: boolean;
  pasId: string | null;
}

/** Le nom d'un monde affichable. */
export function nomMonde(code: string): string {
  return WORLDS.find((w) => w.code === code)?.name ?? code;
}

function useEchap(onFerme: () => void): void {
  useEffect(() => {
    const h = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') onFerme();
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onFerme]);
}

/** L'icône bulle (Demander). */
function IcoBulle({ s = 18 }: { s?: number }): React.ReactElement {
  return (
    <svg viewBox="0 0 24 24" width={s} height={s} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9 9 0 0 1-3.8-.8L3 20l1-4.9a8.4 8.4 0 1 1 17-3.6z" />
    </svg>
  );
}

/* ===================================================================== */
/* 5. LA FEUILLE « Demander à [prénom] »                                  */
/* ===================================================================== */

export function FeuilleDemander({
  sujet,
  carte,
  phrase,
  restantes,
  onClose,
  onEnvoye,
}: {
  sujet: Sujet;
  carte: CarteRencontre;
  /** La phrase touchée (passage cité) — sinon le résumé de la carte. */
  phrase: string | null;
  /** Les questions restantes aujourd'hui (5/jour avant match). */
  restantes: number;
  onClose: () => void;
  onEnvoye: (texte: string, carte: CarteRencontre) => void;
}) {
  const { tx } = useI18n();
  const [texte, setTexte] = useState('');
  const [envoye, setEnvoye] = useState(false);
  useEchap(onClose);
  const questions = useMemo(() => questionsDe(carte.titre), [carte.titre]);
  const citation = phrase ?? carte.resume;
  const pret = texte.trim().length >= 4;

  if (envoye) {
    return (
      <div className="dc-feuille" role="dialog" aria-modal="true" aria-label={tx('Question envoyée')}>
        <div className="dc-feuille-prise" aria-hidden="true" />
        <div className="dc-confirmation">
          <strong>{tx('Ta question part avec ton like')}</strong>
          <p>
            {tx(
              '{{prenom}} la verra avec ta carte « {{carte}} ». Si elle répond, la conversation s\u2019ouvre.',
              { prenom: sujet.prenom, carte: carte.titre },
            )}
          </p>
          {sujet.demo && (
            <p style={{ color: 'var(--ren-second)', fontSize: 13 }}>
              {tx('Démonstration : la question reste sur ton appareil — rien ne part vraiment.')}
            </p>
          )}
          <div className="dc-filtres-pied">
            <button type="button" className="dc-btn-plein" onClick={onClose}>
              {tx('Continuer à découvrir')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dc-feuille" role="dialog" aria-modal="true" aria-label={tx('Demander à {{prenom}}', { prenom: sujet.prenom })}>
      <div className="dc-feuille-prise" aria-hidden="true" />
      <h3 className="dc-feuille-titre">{tx('Demander à {{prenom}}', { prenom: sujet.prenom })}</h3>

      <blockquote className="dc-citation">
        « {citation} »
        <small>
          {nomMonde(carte.monde)} · {carte.titre}
        </small>
      </blockquote>

      <p className="dc-feuille-sous">{tx('Des questions prêtes — touche-en une, ou écris la tienne')}</p>
      {(['comprendre', 'sourire', 'avancer'] as Intention[]).map((it) => (
        <div key={it}>
          <p className="dc-ton">{tx(ETIQUETTES_INTENTION[it])}</p>
          {questions[it].map((q) => (
            <button
              key={q}
              type="button"
              className="dc-q-sug"
              aria-pressed={texte === q}
              onClick={() => setTexte(q.slice(0, 200))}
            >
              {q}
            </button>
          ))}
        </div>
      ))}

      <p className="dc-feuille-sous">{tx('Ta question à {{prenom}}', { prenom: sujet.prenom })}</p>
      <textarea
        className="dc-champ"
        value={texte}
        maxLength={200}
        rows={3}
        placeholder={tx('Écris ce que tu aimerais lui demander…')}
        onChange={(e) => setTexte(e.target.value)}
        aria-label={tx('Ta question à {{prenom}}', { prenom: sujet.prenom })}
      />
      <div className="dc-compte" aria-live="polite">
        {tx('{{n}} / 200', { n: texte.length })}
      </div>

      {texte.trim().length >= 4 && (
        <div className="dc-apercu">
          <small>{tx('Ce que {{prenom}} recevra', { prenom: sujet.prenom })}</small>
          « {texte.trim()} » — {tx('avec le passage cité et sa carte « {{carte}} »', { carte: carte.titre })}
        </div>
      )}

      <div className="dc-feuille-envoi">
        <p className="dc-feuille-note">
          {tx('Ta question vaut un like — {{n}} restantes aujourd\u2019hui.', { n: Math.max(0, restantes) })}
          <br />
          {tx('Une question par profil avant le match.')}
        </p>
        <button
          type="button"
          className="dc-envoyer"
          disabled={!pret || restantes <= 0}
          onClick={() => {
            setEnvoye(true);
            onEnvoye(texte.trim(), carte);
          }}
        >
          {restantes <= 0 ? tx('Plus de questions aujourd\u2019hui') : tx('Envoyer à {{prenom}}', { prenom: sujet.prenom })}
        </button>
      </div>
    </div>
  );
}

/* ===================================================================== */
/* 6. LES FILTRES — résultats en direct                                   */
/* ===================================================================== */

export interface Filtres {
  ageMin: number;
  ageMax: number;
  distanceMax: number;
  intention: string;
  echoMin: number;
}

export const FILTRES_DEFAUT: Filtres = { ageMin: 18, ageMax: 60, distanceMax: 100, intention: '', echoMin: 0 };

export function FeuilleFiltres({
  filtres,
  nbResultats,
  onChange,
  onReinitialiser,
  onAppliquer,
  onClose,
}: {
  filtres: Filtres;
  nbResultats: number;
  onChange: (f: Filtres) => void;
  onReinitialiser: () => void;
  onAppliquer: () => void;
  onClose: () => void;
}) {
  const { tx } = useI18n();
  useEchap(onClose);
  return (
    <div className="dc-feuille" role="dialog" aria-modal="true" aria-label={tx('Filtres')}>
      <div className="dc-feuille-prise" aria-hidden="true" />
      <h3 className="dc-feuille-titre">{tx('Filtres')}</h3>

      <div className="dc-filtre-ligne">
        <label htmlFor="dc-age">
          {tx('Âge')}
          <output>
            {filtres.ageMin}–{filtres.ageMax} {tx('ans')}
          </output>
        </label>
        <input
          id="dc-age"
          className="dc-range"
          type="range"
          min={18}
          max={60}
          value={filtres.ageMin}
          aria-label={tx('Âge minimum')}
          onChange={(e) => onChange({ ...filtres, ageMin: Math.min(Number(e.target.value), filtres.ageMax) })}
        />
        <input
          className="dc-range"
          type="range"
          min={18}
          max={60}
          value={filtres.ageMax}
          aria-label={tx('Âge maximum')}
          onChange={(e) => onChange({ ...filtres, ageMax: Math.max(Number(e.target.value), filtres.ageMin) })}
        />
      </div>

      <div className="dc-filtre-ligne">
        <label htmlFor="dc-dist">
          {tx('Distance')}
          <output>
            {filtres.distanceMax < 100 ? tx('{{n}} km', { n: filtres.distanceMax }) : tx('Partout')}
          </output>
        </label>
        <input
          id="dc-dist"
          className="dc-range"
          type="range"
          min={5}
          max={100}
          step={5}
          value={filtres.distanceMax}
          aria-label={tx('Distance maximum')}
          onChange={(e) => onChange({ ...filtres, distanceMax: Number(e.target.value) })}
        />
      </div>

      <div className="dc-filtre-ligne">
        <label htmlFor="dc-intention">{tx('Intention')}</label>
        <select
          id="dc-intention"
          className="dc-filtre-select"
          value={filtres.intention}
          onChange={(e) => onChange({ ...filtres, intention: e.target.value })}
        >
          <option value="">{tx('Toutes les intentions')}</option>
          <option value="relation sérieuse">{tx('Relation sérieuse')}</option>
          <option value="mariage">{tx('Mariage')}</option>
          <option value="rencontre">{tx('Rencontre')}</option>
        </select>
      </div>

      <div className="dc-filtre-ligne">
        <label>{tx('Cartes en écho — au moins')}</label>
        <div className="dc-filtre-chips">
          {[0, 1, 2].map((n) => (
            <button
              key={n}
              type="button"
              className={`dc-chip ${filtres.echoMin === n ? 'dc-chip-or' : ''}`}
              aria-pressed={filtres.echoMin === n}
              onClick={() => onChange({ ...filtres, echoMin: n })}
            >
              {n === 0 ? tx('Peu importe') : n === 1 ? tx('1 en écho') : tx('Perle rare (2+)')}
            </button>
          ))}
        </div>
      </div>

      <p className="dc-resultats" aria-live="polite">
        <strong>{nbResultats}</strong> {nbResultats === 1 ? tx('profil') : tx('profils')} {tx('correspondent à ces filtres')}
      </p>

      <div className="dc-filtres-pied">
        <button type="button" className="dc-btn-fantome" onClick={onReinitialiser}>
          {tx('Réinitialiser')}
        </button>
        <button type="button" className="dc-btn-plein" onClick={onAppliquer}>
          {tx('Appliquer')}
        </button>
      </div>
    </div>
  );
}

/* ===================================================================== */
/* 4. LE PROFIL COMPLET (réf. 3)                                          */
/* ===================================================================== */

export function ProfilComplet({
  sujet,
  onClose,
  onDemander,
  onAimer,
  onPasser,
  onGarder,
  onMenu,
  aDejaLike,
}: {
  sujet: Sujet;
  onClose: () => void;
  onDemander: (carte: CarteRencontre, phrase: string | null) => void;
  onAimer: () => void;
  onPasser: () => void;
  onGarder: () => void;
  onMenu: () => void;
  aDejaLike: boolean;
}) {
  const { tx } = useI18n();
  const [phraseSur, setPhraseSur] = useState<string | null>(null);
  const [photoI, setPhotoI] = useState(0);
  useEchap(onClose);
  const nbPhotos = sujet.photo ? 2 : 1;

  return (
    <div className="dc-plein" role="dialog" aria-modal="true" aria-label={tx('Profil de {{prenom}}', { prenom: sujet.prenom })}>
      <div className="dc-plein-head">
        <button type="button" className="dc-rond-mini" onClick={onClose} aria-label={tx('Retour au deck')}>
          <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>
        <h2 className="dc-plein-titre">{tx('Profil de {{prenom}}', { prenom: sujet.prenom })}</h2>
        <button type="button" className="dc-rond-mini" onClick={onMenu} aria-label={tx('Plus d\u2019actions — masquer, signaler')}>
          ⋯
        </button>
      </div>

      {/* La galerie — photo(s) ou silhouette/initiale neutre. */}
      <div className="dc-galerie">
        {sujet.photo ? (
          <img src={sujet.photo} alt={tx('Photo de {{prenom}}', { prenom: sujet.prenom })} loading="lazy" onClick={() => setPhotoI((i) => (i + 1) % nbPhotos)} />
        ) : (
          <div className="dc-silhouette" aria-hidden="true" />
        )}
        {!sujet.photo && sujet.initiale && <span className="dc-initiale">{sujet.initiale}</span>}
        {nbPhotos > 1 && (
          <div className="dc-galerie-pts" aria-hidden="true">
            {Array.from({ length: nbPhotos }, (_, i) => (
              <span key={i} className={`dc-pt ${i === photoI ? 'dc-pt-on' : ''}`} />
            ))}
          </div>
        )}
      </div>

      {sujet.phrasePortrait && (
        <p className="dc-portrait">
          <small>{tx('Le portrait')}</small>
          {sujet.phrasePortrait}
        </p>
      )}

      {/* SES CARTES — en grand, phrases touchables, ligne or, chips. */}
      {sujet.cartes.length > 0 && <p className="dc-section-label">{tx('Ses cartes')}</p>}
      {sujet.cartes.map((c) => (
        <article key={c.titre} className="dc-carte-grande" style={{ ['--bande' as string]: BANDES_MONDES[c.monde] ?? '#2BA9A9' }}>
          <p className="dc-carte-monde">
            {nomMonde(c.monde).toUpperCase()}
          </p>
          <h4 className="dc-carte-titre">{c.titre}</h4>
          <p className="dc-carte-soustitre">{c.sousTitre}</p>
          <p className="dc-carte-resume">
            {c.phrases.map((p) => (
              <Fragment key={p}>
              <span
                className={`dc-phrase ${phraseSur === p ? 'dc-phrase-sur' : ''}`}
                role="button"
                tabIndex={0}
                onClick={() => {
                  setPhraseSur(p);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setPhraseSur(p);
                  }
                }}
              >
                {p}
              </span>
              {' '}
              </Fragment>
            ))}
          </p>
          {(phraseSur || c.phrases.length === 1) && (
            <div className="dc-carte-cta">
              <button
                type="button"
                className="dc-demander-mini"
                onClick={() => onDemander(c, phraseSur ?? c.phrases[0] ?? null)}
              >
                <IcoBulle s={16} />
                {tx('Demander à {{prenom}}', { prenom: sujet.prenom })}
              </button>
            </div>
          )}
          <p className="dc-carte-avec">{ligneAvec(sujet.prenom, c.titre)}</p>
          <div className="dc-carte-chips">
            <button type="button" className="dc-chip dc-chip-or">
              {tx('Moi aussi')}
            </button>
            <button type="button" className="dc-chip">
              {tx('Autrement que moi')}
            </button>
            <button type="button" className="dc-chip">
              {tx('J\u2019aimerais en parler')}
            </button>
          </div>
        </article>
      ))}

      {/* Les cartes cachées — verrouillées avec leurs sceaux. */}
      {sujet.cartesCachees.length > 0 && <p className="dc-section-label">{tx('À découvrir en discutant')}</p>}
      {sujet.cartesCachees.map((c) => (
        <div key={c.titre} className="dc-cachee">
          <span className="dc-cachee-lock" aria-hidden="true">
            <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
              <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
              <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
            </svg>
          </span>
          <span>
            <span className="dc-cachee-titre">{c.titre}</span>
            <br />
            <span className="dc-cachee-sceau">
              {tx('Se révèle en discutant — sceau : {{sceau}}', { sceau: c.sceau })}
            </span>
          </span>
        </div>
      ))}

      {/* Bio + infos honnêtes. */}
      {sujet.bio && <p className="dc-section-label">{tx('Sa bio')}</p>}
      {sujet.bio && <p className="dc-bio-bloc">{sujet.bio}</p>}
      <p className="dc-section-label">{tx('À savoir')}</p>
      <div className="dc-infos-liste">
        {sujet.age !== null && (
          <div className="dc-info-ligne">
            <span>{tx('Âge')}</span>
            <span>
              {sujet.age} {tx('ans')}
            </span>
          </div>
        )}
        {sujet.metier && (
          <div className="dc-info-ligne">
            <span>{tx('Métier')}</span>
            <span>{sujet.metier}</span>
          </div>
        )}
        {sujet.ville && (
          <div className="dc-info-ligne">
            <span>{tx('Où')}</span>
            <span>
              {sujet.ville}
              {sujet.distanceKm !== null ? ` · ${tx('{{n}} km', { n: sujet.distanceKm })}` : ''}
            </span>
          </div>
        )}
        {sujet.intention && (
          <div className="dc-info-ligne">
            <span>{tx('Cherche')}</span>
            <span>{sujet.intention}</span>
          </div>
        )}
        {sujet.reel && (
          <div className="dc-info-ligne">
            <span>{tx('Son voyage')}</span>
            <span>
              {tx('{{n}} monde(s) franchi(s)', { n: sujet.mondeFranchisN })}
              {sujet.mondeEnCoursNom ? ` · ${sujet.mondeEnCoursNom}` : ''}
            </span>
          </div>
        )}
        {sujet.interets.length > 0 && (
          <div className="dc-info-ligne">
            <span>{tx('Aime')}</span>
            <span>{sujet.interets.join(' · ')}</span>
          </div>
        )}
      </div>

      {/* La barre d'actions du profil complet (réf. 2). */}
      <div className="dc-actions" style={{ marginTop: 22 }}>
        <div className="dc-actions-sec">
          <button type="button" className="dc-sec-item" onClick={onClose}>
            <span className="dc-sec-rond">
              <svg viewBox="0 0 24 24" width={19} height={19} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 14L4 9l5-5" />
                <path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" />
              </svg>
            </span>
            {tx('Retour')}
          </button>
          <button type="button" className="dc-sec-item" onClick={onGarder}>
            <span className="dc-sec-rond">
              <svg viewBox="0 0 24 24" width={19} height={19} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M6.5 4h11a1 1 0 0 1 1 1v16l-6.5-4-6.5 4V5a1 1 0 0 1 1-1z" />
              </svg>
            </span>
            {tx('Plus tard')}
          </button>
          <button type="button" className="dc-sec-item" onClick={onAimer}>
            <span className="dc-sec-rond dc-sec-rond-or">
              <svg viewBox="0 0 24 24" width={19} height={19} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 3.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8-5.3-2.8-5.3 2.8 1-5.8L3.5 9.7l5.9-.9L12 3.5z" />
              </svg>
            </span>
            {tx('Coup de cœur')}
          </button>
          <button type="button" className="dc-sec-item" onClick={onMenu}>
            <span className="dc-sec-rond">⋯</span>
            {tx('Plus')}
          </button>
        </div>
        <div className="dc-actions-rangee">
          <button type="button" className="dc-btn-rond dc-passer" onClick={onPasser} aria-label={tx('Passer')}>
            <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
          <button
            type="button"
            className="dc-demander"
            onClick={() => {
              const c = sujet.cartes[0];
              if (c) onDemander(c, phraseSur ?? c.phrases[0] ?? null);
            }}
          >
            <IcoBulle s={20} />
            {tx('Demander')}
          </button>
          <button type="button" className="dc-btn-rond dc-aimer" onClick={onAimer} aria-label={tx('Aimer')} disabled={aDejaLike}>
            <svg viewBox="0 0 24 24" width={23} height={23} fill="currentColor" aria-hidden="true">
              <path d="M12 21s-7.5-4.7-9.8-9.2C.7 8.6 2.6 5 6 5c2 0 3.4 1.1 4.2 2.3L12 9l1.8-1.7C14.6 6.1 16 5 18 5c3.4 0 5.3 3.6 3.8 6.8C19.5 16.3 12 21 12 21z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ===================================================================== */
/* 8. L'ÉCRAN DE MATCH — raison en mots, jamais de score                  */
/* ===================================================================== */

export function EcranMatch({
  sujet,
  phrases,
  raison,
  demo,
  initialeToi,
  photoToi,
  onDire,
  onPlusTard,
}: {
  sujet: Sujet;
  phrases: string[];
  raison: string | null;
  demo: boolean;
  initialeToi: string;
  photoToi: string | null;
  onDire: (phrase: string) => void;
  onPlusTard: () => void;
}) {
  const { tx } = useI18n();
  useEchap(onPlusTard);
  return (
    <div className="dc-match" role="dialog" aria-modal="true" aria-label={tx('C\u2019est un match !')}>
      <div className="dc-match-boite">
        {demo && <span className="dc-match-badge-demo">{tx('Match de démonstration')}</span>}
        <div className="dc-match-duo">
          <span className="dc-match-rond">
            {photoToi ? <img src={photoToi} alt="" /> : initialeToi}
          </span>
          <span className="dc-match-coeur" aria-hidden="true">
            💞
          </span>
          <span className="dc-match-rond">
            {sujet.photo ? <img src={sujet.photo} alt={sujet.prenom} /> : (sujet.initiale ?? sujet.prenom.charAt(0))}
          </span>
        </div>
        <h3 className="dc-match-titre">{tx('C\u2019est un match !')}</h3>
        <p className="dc-match-raison">{raison ?? tx('Vous avez tous les deux fait un pas — la suite, c\u2019est à vous de l\u2019écrire.')}</p>
        {phrases.length > 0 && (
          <>
            <p className="dc-feuille-sous">{tx('Pour commencer, issues de vos cartes en écho')}</p>
            <div className="dc-match-phrases">
              {phrases.slice(0, 3).map((p) => (
                <button key={p} type="button" onClick={() => onDire(p)}>
                  {p}
                </button>
              ))}
            </div>
          </>
        )}
        <p className="dc-match-pied">{tx('Prenez le temps qu\u2019il faut — rien ne compte à rebours. Si personne n\u2019écrit dans 24 h, on vous le rappellera doucement.')}</p>
        <div className="dc-match-btns">
          <button type="button" className="dc-btn-plein" onClick={() => onDire(phrases[0] ?? '')}>
            <IcoBulle s={17} /> {tx('Dire quelque chose')}
          </button>
          <button type="button" className="dc-btn-fantome" onClick={onPlusTard}>
            {tx('Plus tard')}
          </button>
        </div>
      </div>
    </div>
  );
}

/** Les réponses rapides exportées pour une future boîte de réception. */
export { reponsesRapides };
