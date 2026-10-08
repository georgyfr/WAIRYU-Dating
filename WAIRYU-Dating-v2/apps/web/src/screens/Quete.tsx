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
 *  - DÉTAILS (Tasks 33/34 — réorientation fondateur) : FÉLICITATIONS + annonce
 *    de l'archétype (« ton archétype est … »), puis le TYPE présenté
 *    GÉNÉRALEMENT — définition (« {nom}, qu'est-ce que c'est ? »), à quoi il
 *    renvoie (accroche + devise), sa lumière, son ombre, en relation, son point
 *    d'équilibre — puis seulement le profil personnalisé tendance par tendance
 *    (« place à toi », scorer du Livrable) avec auto-validation « Est-ce que ça
 *    te ressemble ? », le langage relationnel, les conseils et l'export PDF
 *    (lib/pdf-resultats.ts, import dynamique). Chaque « Continuer » tease
 *    l'étape d'après : la lecture doit donner envie d'aller jusqu'à la quête
 *    suivante. L'écran n'affirme plus de vérités intimes que la passation ne
 *    mesure pas : il décrit un TYPE, l'utilisateur valide.
 *
 * RECONSTITUTION (5ᵉ reset sandbox) — base fidèle au bundle staging Task 27
 * (écran validé par le fondateur), révélations 32/33 selon ses retours.
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
import { ARCHE, PLUS } from '../lib/quetes-plus';
import {
  enregistrerLecture,
  enregistrerReponse,
  marquerTerminee,
  reinitialiserQuete,
  useEtatQuete,
  type Lecture,
} from '../lib/quete-state';
import { marquerMondeEnCours } from '../lib/mondes-state';
import { PROGRESS, TOTAL_STEPS } from '../lib/voyage';
import PartageCarteModal from '../components/PartageCarteModal';
import type { CartePartageable } from '../components/CarteTypes';

type Phase = 'briefing' | 'passation' | 'details' | 'carte';

/** La révélation (Task 33) : 6 pas, un à la fois — archétype d'abord, profil ensuite. */
const PAS_TOTAL = 6;

/** Les trois réponses de l'auto-validation (Task 33 — « Est-ce que ça te ressemble ? »). */
const VALEURS_LECTURE: readonly { valeur: Lecture; symbole: string; label: string }[] = [
  { valeur: 1, symbole: '✓', label: 'Ça me ressemble' },
  { valeur: 2, symbole: '≈', label: 'Ça me ressemble parfois' },
  { valeur: 3, symbole: '✕', label: 'Je ne me reconnais pas' },
];

/** L'accroche du pas d'après — chaque « Continuer » donne envie de la suite (Task 34). */
const TEASERS: readonly string[] = [
  '',
  'La suite : ce qui peut apparaître quand cette lumière déborde — son ombre.',
  'La suite : ton profil à toi, tendance par tendance, dessiné par tes réponses.',
  'La suite : ce que tu emportes dans tes rencontres.',
  'La suite : comment utiliser cette lecture sans te coller d\'étiquette.',
  'La suite : ce que cette quête ouvre — et ta prochaine étape.',
];

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

  // -------------------------------------------- détails — la révélation (6 pas)
  // Task 33 (réorientation fondateur) : l'ARCHÉTYPE GÉNÉRAL d'abord — ce que
  // ce type de personnalité peut généralement apporter, son ombre, en relation,
  // son point d'équilibre — puis seulement le profil personnalisé tendance par
  // tendance, avec auto-validation (« Est-ce que ça te ressemble ? »), le
  // langage relationnel, les conseils, la suite (cliffhanger) et le document
  // personnel en toute fin. L'écran n'affirme plus de vérités intimes que la
  // passation ne mesure pas : il décrit un TYPE, l'utilisateur valide.
  if (phase === 'details' && apercu) {
    const carte = etat.carteId && quete.cartes[etat.carteId] ? quete.cartes[etat.carteId] : quete.cartes[quete.choisirVariante(quete.scorer(etat.reponses))];
    const arche = ARCHE[queteId][carte.id];
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
          <section
            className="q-sec q-rev"
            data-pas="1"
            aria-label="Félicitations — ton archétype, sa définition et sa lumière"
          >
            <p className="q-rev-kicker">🎉 Félicitations — ta quête est accomplie</p>
            <p className="q-arch-annonce">Ton archétype :</p>
            <h3 className="q-arch-nom">{carte.nom}</h3>
            <div className="q-rev-bloc">
              <p className="q-rev-soustitre">{carte.nom}, qu'est-ce que c'est ?</p>
              <p className="q-rev-texte">{arche.presentation}</p>
            </div>
            <div className="q-rev-bloc">
              <p className="q-rev-soustitre">À quoi renvoie ce type de personnalité ?</p>
              <p className="q-arch-accroche">{arche.accroche}</p>
              <p className="q-arch-devise">« {arche.devise} »</p>
            </div>
            <div className="q-rev-bloc">
              <p className="q-rev-soustitre">Sa lumière — ce que ce type peut généralement apporter</p>
              <ul className="q-rev-puces">
                {arche.lumiere.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
              <p className="q-rev-note">{arche.lumiereNote}</p>
            </div>
            <p className="q-rev-note">
              Un archétype décrit une famille de tendances — pas une étiquette, pas un verdict. Regarde maintenant ce
              qui, dans ce portrait, te ressemble vraiment.
            </p>
          </section>
        )}

        {pas >= 2 && (
          <section className="q-sec q-rev" data-pas="2" aria-label="Son ombre, en relation, son point d'équilibre">
            <div className="q-rev-bloc">
              <p className="q-rev-soustitre">Son ombre — quand cette lumière déborde</p>
              <ul className="q-rev-puces">
                {arche.ombre.map((o) => (
                  <li key={o}>{o}</li>
                ))}
              </ul>
              <p className="q-rev-note">{arche.ombreNote}</p>
            </div>
            <div className="q-rev-bloc">
              <p className="q-rev-soustitre">En relation — ce que ce type peut généralement apprécier</p>
              <ul className="q-rev-puces">
                {arche.relation.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
              <p className="q-rev-note">{arche.relationNote}</p>
            </div>
            <div className="q-question">
              <p className="q-question-label">Son point d'équilibre</p>
              <p className="q-question-texte">{arche.equilibreQuestion}</p>
              <p className="q-question-note">{arche.equilibreNote}</p>
            </div>
          </section>
        )}

        {pas >= 3 && (
          <section className="q-sec q-rev" data-pas="3" aria-label="Ton profil, tendance par tendance">
            <p className="q-rev-kicker">🪞 Ton profil, tendance par tendance</p>
            <p className="q-det-intro">
              Et maintenant, place à toi : voici exactement ton profil de personnalité dans cet archétype — tendance
              par tendance, d'après ce que tes réponses ont montré. Aucune personne ne colle parfaitement à un type :
              regarde où tu te rapproches de ce portrait, et où tu t'en éloignes.
            </p>
            <p className="q-det-lire">{apercu.commentLire}</p>
            <div className="q-det-bars">
              {apercu.bars.map((b) => {
                const lev = plusLeviers[b.key];
                const lecture = etat.lectures[b.key];
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
                    <div className="q-val" role="group" aria-label={`Cette description te ressemble-t-elle — ${b.nom}`}>
                      <p className="q-val-q">Cela correspond-il à ton expérience ?</p>
                      <div className="q-val-btns">
                        {VALEURS_LECTURE.map((v) => (
                          <button
                            key={v.valeur}
                            type="button"
                            className={lecture === v.valeur ? 'q-val-btn q-val-btn-on' : 'q-val-btn'}
                            aria-pressed={lecture === v.valeur}
                            onClick={() => enregistrerLecture(queteId, b.key, v.valeur)}
                          >
                            <span className="q-val-symbole" aria-hidden="true">
                              {v.symbole}
                            </span>
                            {v.label}
                          </button>
                        ))}
                      </div>
                      <p className="q-val-note">Ton avis affine la lecture — aucune bonne réponse.</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {pas >= 4 && (
          <section className="q-sec q-rev" data-pas="4" aria-label="Ce que tu emportes">
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
          </section>
        )}

        {pas >= 5 && (
          <section className="q-sec q-rev" data-pas="5" aria-label="Comment utiliser cette quête">
            <p className="q-rev-kicker">🧭 Comment utiliser cette quête</p>
            <p className="q-det-lire">
              Pas comme une vérité sur toi — comme un outil. Si cette lecture t'aide, voici comment l'utiliser.
            </p>
            <ul className="q-conseils">
              {apercu.conseils.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </section>
        )}

        {pas >= 6 && (
          <section className="q-sec q-rev" data-pas="6" aria-label="La suite de ton voyage">
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
                Le document reprend ton archétype, ton profil tendance par tendance et ton langage relationnel. Il
                reste sur ton appareil — rien n'est envoyé.
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
            <p className="q-rev-teaser">{TEASERS[pas]}</p>
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
