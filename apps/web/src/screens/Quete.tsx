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
  type IdQuete,
  type ItemQuete,
  type QueteDef,
} from '../lib/quetes';
import { enregistrerReponse, marquerTerminee, reinitialiserQuete, useEtatQuete } from '../lib/quete-state';
import { marquerMondeEnCours } from '../lib/mondes-state';
import { PROGRESS, TOTAL_STEPS } from '../lib/voyage';
import PartageCarteModal from '../components/PartageCarteModal';

type Phase = 'briefing' | 'passation' | 'details' | 'carte';

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
function texteCarte(quete: QueteDef, carte: { nom: string; lumiere: string; ombre: string; tension: string }): string {
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

  const partager = async (carte: { nom: string; lumiere: string; ombre: string; tension: string }) => {
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

  const telechargerPdf = async (carte: { nom: string; lumiere: string; ombre: string; tension: string }) => {
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

  // ----------------------------------------------------------------- détails
  if (phase === 'details' && apercu) {
    const carte = etat.carteId && quete.cartes[etat.carteId] ? quete.cartes[etat.carteId] : quete.cartes[quete.choisirVariante(quete.scorer(etat.reponses))];
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
        <section className="q-sec" aria-label="Ton profil, tendance par tendance">
          <h3>Ton profil, tendance par tendance</h3>
          <p className="q-det-intro">{apercu.intro}</p>
          <div className="q-det-bars">
            {apercu.bars.map((b) => (
              <div key={b.key} className="q-det-dim">
                <div className="q-det-dim-head">
                  <span className="q-det-dim-nom">{b.nom}</span>
                  <span className="q-det-dim-pct" aria-label={`${b.pct} pour cent`}>
                    {b.pct} %
                  </span>
                </div>
                <p className="q-det-dim-sub">{b.sousLigne}</p>
                <div className="q-bar" role="img" aria-label={`${b.nom} : ${b.pct} pour cent`}>
                  <span className="q-bar-fill" data-palier={b.palier} style={{ width: `${Math.max(b.pct, 2)}%` }} />
                </div>
                <p className="q-det-dim-texte">{b.texte}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="q-sec" aria-label="Ta manière de répondre">
          <h3>Ta manière de répondre</h3>
          <div className="q-repart" role="list" aria-label="La répartition de tes réponses">
            {apercu.repartition.map((r) => (
              <span key={r.value} className="q-repart-chip" role="listitem">
                {r.label} <strong>× {r.n}</strong>
              </span>
            ))}
          </div>
          {apercu.signature && <p className="q-det-dim-texte">{apercu.signature}</p>}
        </section>
        <section className="q-sec" aria-label="Comment utiliser cette quête">
          <h3>Comment utiliser cette quête</h3>
          <ul className="q-conseils">
            {apercu.conseils.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </section>
        <div className="q-actions">
          <button type="button" className="btn btn-accent" onClick={() => void telechargerPdf(carte)} disabled={pdfEnCours}>
            <IcoTelecharger />
            {pdfEnCours ? 'Ton PDF se prépare…' : 'Télécharger mes résultats en PDF'}
          </button>
          <button type="button" className="btn btn-ghost" onClick={() => setPhase('carte')}>
            Revenir à ma carte
          </button>
        </div>
        <p className="q-carte-hint">
          Le PDF reprend exactement cette page : ta carte, tes tendances, tes conseils — il reste sur ton appareil, rien
          n'est envoyé.
        </p>
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
