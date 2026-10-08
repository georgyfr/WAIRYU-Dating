/**
 * La QUÊTE — 4 phases : briefing → passation → carte → résultats en détail.
 *
 *  - BRIEFING : à quoi ça sert / comment tu vas répondre (aperçu de l'échelle) /
 *    ce qu'on attend de toi / les résultats attendus → « Voulez-vous commencer ? »
 *    [Commencer]/[Annuler]. Écran de PAUSE aussi : Reprendre (n réponses) + Effacer.
 *  - PASSATION : une affirmation à la fois, 5 boutons Likert (verbatim), avance
 *    automatique, « Question précédente », « Faire une pause — tes réponses
 *    restent ». L'interface n'affiche JAMAIS de compteur total (l'annonce
 *    verbatim « 58 affirmations » ne doit pas être contredite) — la barre de
 *    progression seule, en pourcentage. Les trames sautent sans formulation
 *    (règle 11-b).
 *  - CARTE : entête verbatim, nom de la variante (sélecteurs gelés), lumière /
 *    zone d'ombre / tension intérieure, profil de voyage (%), [Voir mes résultats
 *    en détail] · [Partager ma carte] (avertissement PartageCarteModal) ·
 *    [Retour à mon voyage], fenêtre sur l'autre, puis la PROCHAINE QUÊTE
 *    (chaîne du Monde 1 : on enchaîne, rien ne se remet à zéro).
 *  - DÉTAILS : le profil RÉEL tendance par tendance (scorer du Livrable) avec
 *    textes d'accompagnement, la manière de répondre, les conseils, et
 *    l'export PDF (lib/pdf-resultats.ts, import dynamique).
 *
 * RECONSTITUTION (5ᵉ reset sandbox) — fidèle au bundle staging Task 27
 * (écran validé par le fondateur), en attendant ses retours d'amélioration.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  construireApercuResultats,
  COMMUN,
  QUETES,
  LIKERT,
  PALIER_LABELS,
  type IdQuete,
  type ItemQuete,
  type QueteDef,
} from '../lib/quetes';
import { PLUS } from '../lib/quetes-plus';
import { enregistrerReponse, marquerTerminee, reinitialiserQuete, useEtatQuete } from '../lib/quete-state';
import { marquerMondeEnCours } from '../lib/mondes-state';
import { PROGRESS, TOTAL_STEPS } from '../lib/voyage';
import PartageCarteModal from '../components/PartageCarteModal';
import type { CartePartageable } from '../components/CarteTypes';

type Phase = 'briefing' | 'passation' | 'details' | 'carte';

/** La révélation (Task 32) : 8 pas, un à la fois — l'écran n'est pas un PDF condensé. */
const PAS_TOTAL = 8;

/** Flèche droite (icône locale de la quête). */
function Fleche({ dir = 'right' }: { dir?: 'right' | 'left' }) {
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
      style={dir === 'left' ? { transform: 'rotate(180deg)' } : undefined}
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/** Icône de téléchargement (bouton PDF). */
function IcoTelecharger() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="15"
      height="15"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 4v11M7 11l5 5 5-5" />
      <path d="M5 19.5h14" />
    </svg>
  );
}

/** Profil de voyage : étapes réellement franchies (quêtes terminées) sur 51. */
function profilPct(queteTerminees: number): number {
  return Math.min(100, Math.round(((PROGRESS.stepsDone + queteTerminees) / TOTAL_STEPS) * 100));
}

/** Le texte de partage de la carte (Web Share OU presse-papiers). */
function texteCarte(quete: QueteDef, carte: CartePartageable): string {
  return `${carte.nom}\n\n${carte.lumiere}\n\n${quete.completion.labelOmbre} ${carte.ombre}\n\n${quete.completion.labelTension} ${carte.tension}`;
}

interface Props {
  queteId: IdQuete;
  /** Retour aux mondes (briefing / pause). */
  onExit: () => void;
  /** Retour au voyage (fin de chaîne). */
  onHome: () => void;
  /** Enchaîner sur la quête suivante (deep-link #/quete/{id}). */
  onAllerQuete: (id: IdQuete) => void;
}

export default function Quete({ queteId, onExit, onHome, onAllerQuete }: Props) {
  const quete = QUETES[queteId];
  const etat = useEtatQuete(queteId);
  // Les terminaisons des trois quêtes du monde — le profil de voyage de la carte.
  const e11 = useEtatQuete('1.1');
  const e12 = useEtatQuete('1.2');
  const e13 = useEtatQuete('1.3');
  const termineesDuMonde = [e11, e12, e13].filter((e) => e.terminee).length;

  const deck = useMemo<ItemQuete[]>(() => quete.deck(), [quete]);
  const repondues = deck.filter((it) => etat.reponses[it.code] !== undefined).length;
  const aDesReponses = Object.keys(etat.reponses).length > 0;

  // Phase initiale = état RÉEL (terminée → carte ; engagée → passation directe ;
  // sinon briefing). Jamais de remise à zéro d'un travail existant.
  const [phase, setPhase] = useState<Phase>(() => (etat.terminee ? 'carte' : aDesReponses ? 'passation' : 'briefing'));
  const [idx, setIdx] = useState<number>(() => {
    const premiere = deck.findIndex((it) => etat.reponses[it.code] === undefined);
    return premiere === -1 ? 0 : premiere;
  });
  const [reprise] = useState<boolean>(() => !etat.terminee && aDesReponses);
  const [montreReprise, setMontreReprise] = useState<boolean>(reprise);
  const [partageOuvert, setPartageOuvert] = useState<boolean>(false);
  const [copieOk, setCopieOk] = useState<boolean>(false);
  const [pdfEnCours, setPdfEnCours] = useState<boolean>(false);
  // La révélation (Task 32 — critique fondateur) : les pas s'ouvrent un à un.
  const [pas, setPas] = useState<number>(1);

  const apercu = useMemo(
    () => (phase === 'details' ? construireApercuResultats(quete, etat.reponses) : null),
    [phase, quete, etat.reponses],
  );

  const questionRef = useRef<HTMLHeadingElement | null>(null);
  const pauseTimer = useRef<number | null>(null);

  // La reprise re-marque le monde en cours (idempotent) — le point corail suit.
  useEffect(() => {
    if (reprise) marquerMondeEnCours('M1');
  }, [reprise]);

  // Le bandeau de reprise s'efface seul (6 s).
  useEffect(() => {
    if (!montreReprise) return;
    const t = window.setTimeout(() => setMontreReprise(false), 6000);
    return () => window.clearTimeout(t);
  }, [montreReprise]);

  // Chaque entrée en détails relance la révélation depuis le premier pas.
  useEffect(() => {
    if (phase === 'details') setPas(1);
  }, [phase]);

  // Le pas nouvellement révélé arrive à l'écran (doux).
  useEffect(() => {
    if (phase === 'details' && pas > 1) {
      document.querySelector(`[data-pas="${pas}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [pas, phase]);

  // Complétion : toutes les réponses posées → la carte (une seule fois).
  useEffect(() => {
    if (phase === 'passation' && repondues === deck.length) {
      const carteId = etat.carteId ?? quete.choisirVariante(quete.scorer(etat.reponses));
      marquerTerminee(queteId, carteId);
      setPhase('carte');
    }
  }, [phase, repondues, deck.length, etat.carteId, etat.reponses, quete, queteId]);

  // Le timer d'avance automatique ne survit pas au démontage.
  useEffect(
    () => () => {
      if (pauseTimer.current !== null) window.clearTimeout(pauseTimer.current);
    },
    [],
  );

  const reprendre = useCallback(() => {
    marquerMondeEnCours('M1');
    const premiere = deck.findIndex((it) => etat.reponses[it.code] === undefined);
    setIdx(premiere === -1 ? deck.length - 1 : premiere);
    setPhase('passation');
  }, [deck, etat.reponses]);

  const repondre = (code: string, valeur: number) => {
    enregistrerReponse(queteId, code, valeur);
    if (idx < deck.length - 1) {
      if (pauseTimer.current !== null) window.clearTimeout(pauseTimer.current);
      pauseTimer.current = window.setTimeout(() => setIdx((i) => Math.min(i + 1, deck.length - 1)), 340);
    }
  };

  // Focus de la question à chaque pas de passation (a11y).
  useEffect(() => {
    if (phase === 'passation') questionRef.current?.focus();
  }, [idx, phase]);

  const partager = async (carte: CartePartageable) => {
    const texte = texteCarte(quete, carte);
    try {
      if (typeof navigator.share === 'function') {
        await navigator.share({ title: 'Ma carte Wairyu', text: texte });
      } else {
        await navigator.clipboard.writeText(texte);
        setCopieOk(true);
      }
    } catch {
      /* annulation utilisateur — silencieux */
    }
  };

  const telechargerPdf = async (carte: CartePartageable) => {
    setPdfEnCours(true);
    try {
      const { telechargerResultatsPdf } = await import('../lib/pdf-resultats');
      await telechargerResultatsPdf(quete, carte, etat.reponses);
    } catch {
      /* le PDF ne bloque jamais la quête */
    } finally {
      setPdfEnCours(false);
    }
  };

  // ---------------------------------------------------------------- briefing
  if (phase === 'briefing') {
    const peutReprendre = repondues > 0 && !etat.terminee;
    return (
      <main className="screen q-screen" aria-labelledby="q-title">
        <button type="button" className="q-back" onClick={onExit}>
          <Fleche dir="left" />
          Retour aux mondes
        </button>
        <div className="q-head">
          <span className="v-chip v-chip-now">
            <span className="v-chip-dot" aria-hidden="true" />
            Monde 1 — Le Miroir
          </span>
          <span className="v-chip v-chip-soon">
            Quête {quete.numero} sur {quete.totalDuMonde}
          </span>
          <span className="v-chip v-chip-done">Gratuite</span>
        </div>
        <h1 className="screen-title" id="q-title">
          {quete.titre}
        </h1>
        <p className="screen-sub">{quete.sousTitre}</p>
        <blockquote className="q-annonce">
          <p>{quete.annonce}</p>
        </blockquote>
        <section className="q-sec" aria-label="À quoi sert cette quête">
          <h3>À quoi sert cette quête</h3>
          {quete.briefing.aQuoiCaSert.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </section>
        <section className="q-sec" aria-label="Comment tu vas répondre">
          <h3>Comment tu vas répondre</h3>
          {COMMUN.commentRepondre.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <div
            className="q-scale"
            role="img"
            aria-label="L'échelle de réponse : 5 niveaux, de « Pas du tout moi » à « Tout à fait moi »"
          >
            {LIKERT.map((n, i) => (
              <span key={n.value} className="q-scale-step" data-level={i + 1}>
                {n.label}
              </span>
            ))}
          </div>
        </section>
        <section className="q-sec" aria-label="Ce qu'on attend de toi pendant la quête">
          <h3>Ce qu'on attend de toi</h3>
          {COMMUN.comportement.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </section>
        <section className="q-sec" aria-label="Les résultats attendus à la fin de la quête">
          <h3>Les résultats attendus</h3>
          <ul className="q-list">
            {quete.briefing.resultats.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </section>
        <div className="q-ask" role="group" aria-label="Voulez-vous commencer ?">
          <p className="q-ask-q">Voulez-vous commencer ?</p>
          <div className="q-actions">
            {etat.terminee ? (
              <>
                <button type="button" className="btn btn-accent" onClick={() => setPhase('carte')}>
                  Revoir ma carte
                  <Fleche />
                </button>
                <button type="button" className="btn btn-ghost" onClick={onExit}>
                  Retour aux mondes
                </button>
              </>
            ) : (
              <>
                <button type="button" className="btn btn-accent" onClick={reprendre}>
                  {peutReprendre ? `Reprendre (${repondues} réponses)` : 'Commencer'}
                  <Fleche />
                </button>
                <button type="button" className="btn btn-ghost" onClick={onExit}>
                  Annuler
                </button>
              </>
            )}
          </div>
          {(peutReprendre || etat.terminee) && (
            <button
              type="button"
              className="q-reset"
              onClick={() => {
                reinitialiserQuete(queteId);
                setIdx(0);
              }}
            >
              Effacer mes réponses et recommencer
            </button>
          )}
        </div>
      </main>
    );
  }

  // --------------------------------------------------------------- passation
  if (phase === 'passation') {
    const item = deck[Math.min(idx, deck.length - 1)];
    const valeur = etat.reponses[item.code];
    return (
      <main className="screen q-screen q-run" aria-labelledby="q-run-label">
        {montreReprise && (
          <p className="q-resume" role="status">
            Tu reprends là où tu t'es arrêté — tes réponses sont conservées.
          </p>
        )}
        <div
          className="q-progress"
          role="progressbar"
          aria-label="Progression de la quête"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round((repondues / deck.length) * 100)}
        >
          <span className="q-progress-bar" style={{ width: `${(repondues / deck.length) * 100}%` }} />
        </div>
        <p className="q-run-count" aria-hidden="true">
          {quete.titre}
        </p>
        <h1 className="q-item" id="q-run-label" ref={questionRef} tabIndex={-1}>
          {item.text}
        </h1>
        <div className="q-likert" role="group" aria-label="Ta réponse — 5 niveaux">
          {LIKERT.map((n) => (
            <button
              key={n.value}
              type="button"
              className={valeur === n.value ? 'q-likert-btn q-likert-btn-on' : 'q-likert-btn'}
              data-level={n.value}
              onClick={() => repondre(item.code, n.value)}
            >
              {n.label}
            </button>
          ))}
        </div>
        <div className="q-run-foot">
          {idx > 0 && (
            <button type="button" className="q-run-prev" onClick={() => setIdx((i) => Math.max(0, i - 1))}>
              <Fleche dir="left" />
              Question précédente
            </button>
          )}
          <button type="button" className="q-run-pause" onClick={() => setPhase('briefing')}>
            Faire une pause — tes réponses restent
          </button>
        </div>
      </main>
    );
  }

  // -------------------------------------------- détails — la révélation (8 pas)
  // Task 32 (critique fondateur) : l'écran n'est PAS un PDF condensé — c'est
  // une révélation interactive, un pas à la fois, dans l'ordre émotionnel :
  // lumière (+ preuves) → ombre (quand ta lumière déborde + côté relation) →
  // tension + question à emporter → ce que l'autre ressent → dans une relation
  // (besoin / apporter / apprendre) → profil qualitatif + leviers → ce que tu
  // emportes (langage relationnel) → la suite (cliffhanger). Le document
  // personnel ne vient qu'à la toute fin.
  if (phase === 'details' && apercu) {
    const carte = etat.carteId && quete.cartes[etat.carteId] ? quete.cartes[etat.carteId] : quete.cartes[quete.choisirVariante(quete.scorer(etat.reponses))];
    const plusCarte = PLUS[queteId].cartes[carte.id];
    const plusLeviers = PLUS[queteId].leviers;
    const suivante = quete.suivante ? QUETES[quete.suivante] : null;
    return (
      <main className="screen q-screen q-det" aria-labelledby="q-det-title">
        <button type="button" className="q-back" onClick={() => setPhase('carte')}>
          <Fleche dir="left" />
          Revenir à ma carte
        </button>
        <div className="q-head">
          <span className="v-chip v-chip-now">
            <span className="v-chip-dot" aria-hidden="true" />
            Monde 1 — Le Miroir
          </span>
          <span className="v-chip v-chip-soon">
            Quête {quete.numero} sur {quete.totalDuMonde}
          </span>
        </div>
        <h1 className="screen-title" id="q-det-title">
          Tes résultats en détail
        </h1>
        <p className="screen-sub">{quete.titre}</p>

        {pas >= 1 && (
          <section className="q-sec q-rev" data-pas="1" aria-label="Ta lumière — ce que tu apportes">
            <p className="q-rev-kicker">✨ Ta lumière</p>
            <h3>Ce que tu apportes</h3>
            <p className="q-rev-texte">{carte.lumiere}</p>
            <div className="q-rev-bloc">
              <p className="q-rev-soustitre">Ce que cela peut donner chez toi</p>
              <ul className="q-rev-liste">
                {plusCarte.preuves.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              <p className="q-rev-note">
                Repère ce qui te ressemble — c'est souvent la troisième phrase qui fait « oui, c'est moi ».
              </p>
            </div>
          </section>
        )}

        {pas >= 2 && (
          <section className="q-sec q-rev" data-pas="2" aria-label="Ton ombre — quand ta lumière déborde">
            <p className="q-rev-kicker">🌘 Ton ombre</p>
            <h3>Quand ta lumière déborde</h3>
            <p className="q-rev-intro">
              Ton ombre n'est pas un défaut : c'est ce qui peut arriver quand ta force va trop loin. C'est là que se
              joue ta marge de progression.
            </p>
            <div className="q-ombre-bloc">
              <p className="q-ombre-label">{quete.completion.labelOmbre}</p>
              <p className="q-ombre-texte">{carte.ombre}</p>
              <p className="q-ombre-rel-label">Côté relation</p>
              <p className="q-ombre-texte">{quete.ombreRelationnel[carte.id]}</p>
              <p className="q-ombre-note">
                Une lecture d'app pour t'aider à cogiter ta carte — pas une étiquette, pas un diagnostic. Le miroir de
                ce monde reprendra tout cela en toutes lettres.
              </p>
            </div>
          </section>
        )}

        {pas >= 3 && (
          <section className="q-sec q-rev" data-pas="3" aria-label="Ta tension intérieure — et une question à emporter">
            <p className="q-rev-kicker">⚡ Ta tension intérieure</p>
            <h3>Le paradoxe qui t'habite</h3>
            <p className="q-rev-texte q-ombre-tension">{carte.tension}</p>
            <div className="q-question">
              <p className="q-question-label">Une question à emporter</p>
              <p className="q-question-texte">{plusCarte.question}</p>
              <p className="q-question-note">
                Pas un test, pas un verdict — une question à cogiter, aujourd'hui ou dans six mois.
              </p>
            </div>
          </section>
        )}

        {pas >= 4 && (
          <section className="q-sec q-rev" data-pas="4" aria-label="Ce que l'autre peut parfois ressentir">
            <p className="q-rev-kicker">👀 Ce que l'autre peut parfois ressentir</p>
            <h3>Deux voix, dans la même pièce</h3>
            <blockquote className="q-ressenti">{plusCarte.ressenti[0]}</blockquote>
            <blockquote className="q-ressenti q-ressenti-besoin">{plusCarte.ressenti[1]}</blockquote>
            <p className="q-rev-note">
              Ce que tu vis comme une force peut être vécu autrement par quelqu'un — pas un verdict : un éclairage,
              pour mieux se parler.
            </p>
          </section>
        )}

        {pas >= 5 && (
          <section className="q-sec q-rev" data-pas="5" aria-label="Dans une relation">
            <p className="q-rev-kicker">❤️ Dans une relation</p>
            <h3>Ce dont tu as besoin</h3>
            <ul className="q-rev-liste">
              {plusCarte.besoins.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
            <div className="q-rev-deux">
              <div className="q-rev-bloc">
                <p className="q-rev-soustitre">Ce que tu peux apporter</p>
                <ul className="q-rev-puces">
                  {plusCarte.apportes.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>
              </div>
              <div className="q-rev-bloc">
                <p className="q-rev-soustitre">Ce que tu peux apprendre</p>
                <ul className="q-rev-puces">
                  {plusCarte.apprendre.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}

        {pas >= 6 && (
          <section className="q-sec q-rev" data-pas="6" aria-label="Ton profil, tendance par tendance">
            <p className="q-rev-kicker">🌱 Ton profil, tendance par tendance</p>
            <p className="q-det-intro">{apercu.intro}</p>
            <p className="q-det-lire">{apercu.commentLire}</p>
            <div className="q-det-bars">
              {apercu.bars.map((b) => {
                const lev = plusLeviers[b.key];
                return (
                  <div key={b.key} className="q-det-dim">
                    <div className="q-det-dim-head">
                      <span className="q-det-dim-nom">{b.nom}</span>
                      <span className="q-det-dim-niveau" data-palier={b.palier}>
                        {PALIER_LABELS[b.palier]}
                      </span>
                    </div>
                    <p className="q-det-dim-sub">{b.sousLigne}</p>
                    <div className="q-bar" role="img" aria-label={`${b.nom} : ${b.pct} sur 100`}>
                      <span className="q-bar-fill" data-palier={b.palier} style={{ width: `${Math.max(b.pct, 2)}%` }} />
                    </div>
                    <p className="q-det-dim-pct">{b.pct}/100 — tendance actuelle</p>
                    <p className="q-det-dim-lecture">{b.lecture}</p>
                    <p className="q-det-dim-texte">{b.texte}</p>
                    {lev && (
                      <div className="q-levier">
                        <p className="q-levier-titre">Ton levier de progression</p>
                        <p className="q-levier-ligne">
                          <strong>Ta force.</strong> {lev.force}
                        </p>
                        <p className="q-levier-ligne">
                          <strong>Ton risque.</strong> {lev.risque}
                        </p>
                        <p className="q-levier-ligne">
                          <strong>Ton levier.</strong> {lev.levier}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {pas >= 7 && (
          <section className="q-sec q-rev" data-pas="7" aria-label="Ce que tu emportes">
            <p className="q-rev-kicker">🧩 Ce que tu emportes</p>
            <h3>Ton langage relationnel</h3>
            <p className="q-rev-intro">
              C'est ce que Wairyu retiendra pour te proposer des personnes qui parlent la même langue que toi.
            </p>
            <div className="q-langage">
              <p className="q-langage-ligne">
                <span className="q-langage-cle">Tu donnes</span>
                {plusCarte.langage.donnes}
              </p>
              <p className="q-langage-ligne">
                <span className="q-langage-cle">Tu recherches probablement</span>
                {plusCarte.langage.recherches}
              </p>
              <p className="q-langage-ligne">
                <span className="q-langage-cle">Tu dois surveiller</span>
                {plusCarte.langage.surveilles}
              </p>
              <p className="q-langage-ligne">
                <span className="q-langage-cle">Tu pourrais particulièrement apprécier</span>
                {plusCarte.langage.apprecierais}
              </p>
            </div>
            <h3 className="q-rev-h3-2">Comment utiliser cette quête</h3>
            <ul className="q-conseils">
              {apercu.conseils.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </section>
        )}

        {pas >= 8 && (
          <section className="q-sec q-rev" data-pas="8" aria-label="La suite de ton voyage">
            <p className="q-rev-kicker">🧭 La suite de ton voyage</p>
            <h3>{quete.suite.titre}</h3>
            <p className="q-rev-texte">{quete.suite.intro}</p>
            {quete.suite.questions.length > 0 && (
              <ul className="q-suite-questions">
                {quete.suite.questions.map((q) => (
                  <li key={q}>{q}</li>
                ))}
              </ul>
            )}
            <div className="q-actions">
              {suivante ? (
                <button type="button" className="btn btn-accent" onClick={() => onAllerQuete(suivante.id)}>
                  {quete.suite.cta ?? 'Continuer le voyage'}
                  <Fleche />
                </button>
              ) : (
                <button type="button" className="btn btn-accent" onClick={onHome}>
                  Retour à mon voyage
                  <Fleche />
                </button>
              )}
            </div>
            <div className="q-rev-pdf">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => void telechargerPdf(carte)}
                disabled={pdfEnCours}
              >
                <IcoTelecharger />
                {pdfEnCours ? 'Ton document se prépare…' : 'Télécharger mon document personnel'}
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => setPhase('carte')}>
                Revenir à ma carte
              </button>
              <p className="q-carte-hint">
                Le document reprend toute ta révélation : ta carte, ta lumière, ton ombre, ta tension, ta question à
                emporter, ta vie relationnelle, tes leviers. Il reste sur ton appareil — rien n'est envoyé.
              </p>
            </div>
          </section>
        )}

        {pas < PAS_TOTAL && (
          <div className="q-rev-next">
            <button type="button" className="btn btn-accent" onClick={() => setPas((p) => Math.min(PAS_TOTAL, p + 1))}>
              Continuer
              <Fleche />
            </button>
            <button type="button" className="q-rev-tout" onClick={() => setPas(PAS_TOTAL)}>
              Tout afficher
            </button>
          </div>
        )}
      </main>
    );
  }

  // ------------------------------------------------------------------- carte
  const carte = etat.carteId && quete.cartes[etat.carteId] ? quete.cartes[etat.carteId] : quete.cartes[quete.choisirVariante(quete.scorer(etat.reponses))];
  const suivante = quete.suivante ? QUETES[quete.suivante] : null;
  return (
    <main className="screen q-screen" aria-labelledby="q-carte-title">
      <div className="q-carte" role="region" aria-label="Ta carte">
        <p className="q-carte-entete">{quete.completion.entete}</p>
        <h1 className="q-carte-nom" id="q-carte-title">
          {carte.nom}
        </h1>
        <p className="q-carte-lumiere">{carte.lumiere}</p>
        <div className="q-carte-sec">
          <h3>{quete.completion.labelOmbre}</h3>
          <p>{carte.ombre}</p>
        </div>
        <div className="q-carte-sec">
          <h3>{quete.completion.labelTension}</h3>
          <p>{carte.tension}</p>
        </div>
        <p className="q-carte-pied">
          Ton profil de voyage : <strong>{profilPct(termineesDuMonde)} %</strong> complété
        </p>
        <div className="q-carte-actions">
          <button type="button" className="btn btn-accent" onClick={() => setPhase('details')}>
            Voir mes résultats en détail
            <Fleche />
          </button>
          <button type="button" className="btn btn-outline" onClick={() => setPartageOuvert(true)}>
            Partager ma carte
          </button>
          {copieOk && (
            <p className="q-shared" role="status">
              Copié — ta carte est dans le presse-papiers.
            </p>
          )}
          <button type="button" className="btn btn-ghost" onClick={onHome}>
            Retour à mon voyage
          </button>
        </div>
        <p className="q-carte-hint">
          Rien ne se remet à zéro : ta carte, tes réponses et tes résultats restent dans l'onglet Quête — tu reviens
          quand tu veux.
        </p>
        <p className="q-fenetre">{quete.completion.fenetre}</p>
      </div>
      {suivante ? (
        <div className="q-next" role="region" aria-label="Ta prochaine quête">
          <p className="q-next-kicker">Ta prochaine quête</p>
          <h2 className="q-next-titre">{suivante.titre}</h2>
          <blockquote className="q-next-annonce">
            <p>{suivante.annonce}</p>
          </blockquote>
          <button type="button" className="btn btn-accent" onClick={() => onAllerQuete(suivante.id)}>
            Attaquer la quête suivante
            <Fleche />
          </button>
        </div>
      ) : (
        <div className="q-next q-next-end" role="region" aria-label="Et maintenant ?">
          <p className="q-next-kicker">Et maintenant ?</p>
          <h2 className="q-next-titre">Le miroir — la suite de ton monde</h2>
          <p className="q-next-note">{quete.completion.miroirNote}</p>
          <p className="q-next-note">
            Tu as terminé les trois quêtes ouvertes du Miroir : ta personnalité, ta façon de t'attacher, tes émotions —
            trois cartes qui se répondent.
          </p>
        </div>
      )}
      {partageOuvert && (
        <PartageCarteModal
          carte={carte}
          onConfirm={() => {
            setPartageOuvert(false);
            void partager(carte);
          }}
          onClose={() => setPartageOuvert(false)}
        />
      )}
    </main>
  );
}
