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
 *  - DÉTAILS (Task 35 — gabarit fondateur) : la page répond EXACTEMENT de la
 *    même manière quel que soit l'archétype. Un GABARIT de 9 blocs, toujours
 *    rendu dans le même ordre : 🎉 Ton profil : {nom} → intro (« Ton archétype
 *    révèle une personne qui… » + point de vigilance) → En résumé : « devise »
 *    → Ce que tu apportes → Ce qui peut te freiner → En couple → Ton équilibre
 *    → 🪞 Tes N tendances (d'après tes réponses), score /100 + palier accordé
 *    → À noter — puis la suite (cliffhanger + CTA vers la quête suivante) et
 *    le PDF (lib/pdf-resultats.ts, import dynamique, même structure). Les
 *    mots viennent du registre ARCHE (quetes-plus.ts — 2ᵉ personne, simple
 *    et littérale, V3 1.1 écrite par le fondateur) ; les mesures du scorer
 *    du Livrable. La page doit donner envie d'aller jusqu'à la quête
 *    suivante, jamais décourager.
 *  - DEEP-LINK #/quete/{id}/resultats (demande fondateur) : une quête terminée
 *    s'ouvre DIRECTEMENT sur cette vue détails — depuis Parcourus (« Voir mes
 *    résultats en détail », au niveau du bouton PDF), les résultats sont à UN
 *    tap, sans repasser par la carte.
 *
 * RECONSTITUTION (5ᵉ reset sandbox) — base fidèle au bundle staging Task 27
 * (écran validé par le fondateur), révélations 32/33/35 selon ses retours.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  construireApercuResultats,
  COMMUN,
  mondeDeQuete,
  NOTA_BARRES,
  QUETES,
  QUETE_IDS,
  LIKERT,
  titreTendances,
  type IdQuete,
  type ItemPassation,
  type QueteDef,
} from '../lib/quetes';
import { ARCHE } from '../lib/quetes-plus';
import { ECRAN_17, decode17 } from '../lib/quete-1-7';
import { SORTIES_111, chemin111 } from '../lib/quete-1-11';
import {
  enregistrerReponse,
  marquerTerminee,
  reinitialiserQuete,
  useEtatQuete,
  type EtatQuete,
} from '../lib/quete-state';
import { marquerMondeEnCours } from '../lib/mondes-state';
import { PROGRESS, TOTAL_STEPS } from '../lib/voyage';
import PartageCarteModal from '../components/PartageCarteModal';
import type { CartePartageable } from '../components/CarteTypes';

type Phase = 'briefing' | 'passation' | 'details' | 'carte' | 'ecran';

/** Les textes « comment tu vas répondre » par format (couche app — les textes
 *  Likert verbatim restent dans COMMUN). */
const COMMENT_REPONDRE_FORMAT: Record<QueteDef['format'], readonly string[]> = {
  likert: COMMUN.commentRepondre,
  'likert-enigmes': [
    ...COMMUN.commentRepondre,
    'À la fin, trois petites énigmes. Elles ne sont pas une note : on regarde comment tu y vas, jamais si tu trouves.',
  ],
  choix: [
    "Six situations s'affichent une à une. À chaque fois, deux options : celle de maintenant, celle qui attend.",
    "Pas de bonne réponse — chaque option vaut la même. C'est ton rapport au temps qui se dessine, jamais une note.",
    'Réponds avec ta première impulsion, puis laisse la suivante arriver.',
  ],
  ecran: [
    "Des questions à options, rien à réussir : tu coches ce qui est juste pour toi — ou tu ne dis rien, c'est une réponse complète.",
    'Tes réponses restent modifiables et effaçables à tout moment, depuis cet écran.',
  ],
};

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
  /** Deep-link #/quete/{id}/resultats : une quête TERMINÉE s'ouvre DIRECTEMENT
   *  sur les résultats détaillés — les détails en un tap, au même endroit que
   *  le bouton PDF (demande fondateur). Sans effet si la quête n'est pas
   *  terminée (la page suit alors son cours normal). */
  resultatsInitiale?: boolean;
  /** Retour aux mondes (briefing / pause). */
  onExit: () => void;
  /** Retour au voyage (fin de chaîne). */
  onHome: () => void;
  /** Enchaîner sur la quête suivante (deep-link #/quete/{id}). */
  onAllerQuete: (id: IdQuete) => void;
}

export default function Quete({ queteId, resultatsInitiale = false, onExit, onHome, onAllerQuete }: Props) {
  const quete = QUETES[queteId];
  const etat = useEtatQuete(queteId);
  // Les terminaisons de TOUTES les quêtes ouvertes — le profil de voyage.
  const et11 = useEtatQuete('1.1');
  const et12 = useEtatQuete('1.2');
  const et13 = useEtatQuete('1.3');
  const et14 = useEtatQuete('1.4');
  const et15 = useEtatQuete('1.5');
  const et16 = useEtatQuete('1.6');
  const et17 = useEtatQuete('1.7');
  const et19 = useEtatQuete('1.9');
  const et110 = useEtatQuete('1.10');
  const et111 = useEtatQuete('1.11');
  const etatsTous: Record<IdQuete, EtatQuete> = {
    '1.1': et11,
    '1.2': et12,
    '1.3': et13,
    '1.4': et14,
    '1.5': et15,
    '1.6': et16,
    '1.7': et17,
    '1.9': et19,
    '1.10': et110,
    '1.11': et111,
  };
  const termineesTotal = QUETE_IDS.filter((id) => etatsTous[id].terminee).length;
  const monde = mondeDeQuete(queteId);

  const deck = useMemo<ItemPassation[]>(() => quete.deck(), [quete]);
  const repondues = deck.filter((it) => etat.reponses[it.code] !== undefined).length;
  const aDesReponses = Object.keys(etat.reponses).length > 0;

  // Phase initiale = état RÉEL (terminée → carte — ou DIRECTEMENT les détails
  // sur le deep-link #/quete/{id}/resultats ; engagée → passation directe ;
  // sinon briefing). Les quêtes SANS carte (1.7/1.11) ouvrent leur écran final.
  const [phase, setPhase] = useState<Phase>(() =>
    etat.terminee && quete.sansCarte
      ? 'ecran'
      : etat.terminee && resultatsInitiale
        ? 'details'
        : etat.terminee
          ? 'carte'
          : aDesReponses
            ? 'passation'
            : 'briefing',
  );
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
    if (reprise) marquerMondeEnCours(monde.code);
  }, [reprise, monde.code]);

  // Le bandeau de reprise s'efface seul (6 s).
  useEffect(() => {
    if (!montreReprise) return;
    const t = window.setTimeout(() => setMontreReprise(false), 6000);
    return () => window.clearTimeout(t);
  }, [montreReprise]);

  // Complétion : toutes les réponses posées → la carte (une seule fois).
  // Quêtes SANS carte (1.7/1.11) : aucun score, aucun choix de variante —
  // l'écran final (ECRAN_17 / SORTIES_111). 1.11 attend en plus le choix du
  // chemin (Q1.11-chemin), posé APRÈS les 3 questions (Livrable).
  useEffect(() => {
    if (phase === 'passation' && repondues === deck.length) {
      if (quete.sansCarte) {
        if (queteId === '1.11' && etat.reponses['Q1.11-chemin'] === undefined) return;
        marquerTerminee(queteId, null);
        setPhase('ecran');
        return;
      }
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
    marquerMondeEnCours(monde.code);
    const premiere = deck.findIndex((it) => etat.reponses[it.code] === undefined);
    setIdx(premiere === -1 ? deck.length - 1 : premiere);
    setPhase('passation');
  }, [deck, etat.reponses, monde.code]);

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
            {monde.nom}
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
          {COMMENT_REPONDRE_FORMAT[quete.format].map((p) => (
            <p key={p}>{p}</p>
          ))}
          {(quete.format === 'likert' || quete.format === 'likert-enigmes') && (
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
          )}
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
                <button
                  type="button"
                  className="btn btn-accent"
                  onClick={() => setPhase(quete.sansCarte ? 'ecran' : 'carte')}
                >
                  {quete.sansCarte ? 'Revoir mon écran' : 'Revoir ma carte'}
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
    // 1.11 : les 3 questions posées → le membre CHOISIT son chemin (Livrable :
    // trois chemins de sortie, tous dignes — jamais bloquant). Le choix est
    // enregistré puis l'effet de complétion bascule sur l'écran final.
    const choixChemin =
      queteId === '1.11' && repondues === deck.length && etat.reponses['Q1.11-chemin'] === undefined;
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
        {choixChemin ? (
          <div className="q-choix" role="group" aria-label="Ton chemin — trois sorties, toutes dignes">
            <h1 className="q-item" id="q-run-label" ref={questionRef} tabIndex={-1}>
              Alors, tu pars d'où ?
            </h1>
            <button
              type="button"
              className="q-choix-btn"
              onClick={() => enregistrerReponse(queteId, 'Q1.11-chemin', 1)}
            >
              Je suis prêt·e
            </button>
            <button
              type="button"
              className="q-choix-btn"
              onClick={() => enregistrerReponse(queteId, 'Q1.11-chemin', 2)}
            >
              D'abord une quête recommandée
            </button>
            <button
              type="button"
              className="q-choix-btn"
              onClick={() => enregistrerReponse(queteId, 'Q1.11-chemin', 3)}
            >
              Je commence quand même
            </button>
            <p className="q-ecran-note">Aucun chemin n'est le bon — et tu pourras changer d'avis quand tu veux.</p>
          </div>
        ) : (
          <>
            <h1 className="q-item" id="q-run-label" ref={questionRef} tabIndex={-1}>
              {item.text}
            </h1>
            {item.format === 'likert' && (
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
            )}
            {item.format === 'choix' && (
              <div className="q-choix" role="group" aria-label="Ton choix — deux options, la même valeur">
                <button
                  type="button"
                  className={valeur === 1 ? 'q-choix-btn q-choix-btn-on' : 'q-choix-btn'}
                  onClick={() => repondre(item.code, 1)}
                >
                  <span className="q-choix-tag">Maintenant</span>
                  {item.choixA}
                </button>
                <button
                  type="button"
                  className={valeur === 2 ? 'q-choix-btn q-choix-btn-on' : 'q-choix-btn'}
                  onClick={() => repondre(item.code, 2)}
                >
                  <span className="q-choix-tag">Plus tard</span>
                  {item.choixB}
                </button>
              </div>
            )}
            {item.format === 'question' && item.multi && (
              <div
                className="q-choix q-choix-multi"
                role="group"
                aria-label="Ta réponse — choisis autant d'options que tu veux, ou aucune"
              >
                {(item.options ?? []).map((opt, i) => {
                  const bit = 1 << i;
                  const on = ((valeur ?? 0) & bit) !== 0;
                  return (
                    <button
                      key={opt}
                      type="button"
                      className={on ? 'q-choix-btn q-choix-btn-on' : 'q-choix-btn'}
                      aria-pressed={on}
                      onClick={() => enregistrerReponse(queteId, item.code, (valeur ?? 0) ^ bit)}
                    >
                      {opt}
                    </button>
                  );
                })}
                <button
                  type="button"
                  className="btn btn-accent q-choix-valider"
                  onClick={() => setIdx((i) => Math.min(i + 1, deck.length - 1))}
                >
                  Valider ma sélection
                  <Fleche />
                </button>
              </div>
            )}
            {item.format === 'question' && !item.multi && (
              <div className="q-choix" role="group" aria-label="Ta réponse">
                {(item.options ?? []).map((opt, i) => (
                  <button
                    key={opt}
                    type="button"
                    className={valeur === i + 1 ? 'q-choix-btn q-choix-btn-on' : 'q-choix-btn'}
                    onClick={() => repondre(item.code, i + 1)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
        <div className="q-run-foot">
          {idx > 0 && !choixChemin && (
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

  // -------------------------------------- écran final — quêtes SANS carte
  // 1.7 « écran de confiance » (ECRAN_17) · 1.11 « écran de passage » (le
  // chemin choisi → SORTIES_111 — verbatim Livrable). Aucune carte, aucun
  // score, aucun PDF : la quête se clôt sur son écran, digne et modifiable.
  if (phase === 'ecran') {
    const ecran = queteId === '1.7' ? ECRAN_17 : SORTIES_111[chemin111(etat.reponses)];
    const laSuite = quete.suivante ? QUETES[quete.suivante] : null;
    return (
      <main className="screen q-screen" aria-labelledby="q-ecran-title">
        <div className="q-carte" role="region" aria-label="Ton écran">
          <p className="q-carte-entete">{quete.completion.entete}</p>
          <h1 className="q-carte-nom" id="q-ecran-title">
            {ecran.titre}
          </h1>
          <p className="q-carte-lumiere">{ecran.texte}</p>
          {queteId === '1.7' && (
            <div className="q-ecran-recap">
              {deck.map((it) => {
                const labels = decode17(it.code as 'Q1.7-01' | 'Q1.7-02', etat.reponses[it.code] ?? 0);
                return (
                  <p key={it.code} className="q-ecran-ligne">
                    <strong>{it.text}</strong>
                    <br />
                    {labels.length > 0
                      ? labels.join(' · ')
                      : "Tu n'as rien coché pour le moment — c'est une réponse complète."}
                  </p>
                );
              })}
            </div>
          )}
          <div className="q-carte-actions">
            {laSuite ? (
              <button type="button" className="btn btn-accent" onClick={() => onAllerQuete(laSuite.id)}>
                {quete.suite.cta ?? 'Continuer le voyage'}
                <Fleche />
              </button>
            ) : (
              <button type="button" className="btn btn-accent" onClick={onHome}>
                {quete.suite.cta ?? 'Retour à mon voyage'}
                <Fleche />
              </button>
            )}
            <button type="button" className="btn btn-ghost" onClick={onExit}>
              Retour aux mondes
            </button>
          </div>
          <p className="q-carte-hint">Tes réponses restent sur cet appareil — tu peux les modifier ou tout effacer depuis « Voulez-vous commencer ? ».</p>
        </div>
      </main>
    );
  }

  // ------------------------------------------- détails — le gabarit fondateur
  // Task 35 : la page répond EXACTEMENT de la même manière quel que soit
  // l'archétype — un gabarit unique (9 blocs, toujours le même ordre), les
  // mots du registre ARCHE (2ᵉ personne, simple et littérale), les mesures
  // du scorer du Livrable (0-100 → palier). Objectif : donner envie d'aller
  // jusqu'à la quête suivante, jamais décourager.
  if (phase === 'details' && apercu) {
    const carte = etat.carteId && quete.cartes[etat.carteId] ? quete.cartes[etat.carteId] : quete.cartes[quete.choisirVariante(quete.scorer(etat.reponses))];
    const arche = ARCHE[queteId][carte.id];
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
            {monde.nom}
          </span>
          <span className="v-chip v-chip-soon">
            Quête {quete.numero} sur {quete.totalDuMonde}
          </span>
        </div>
        <h1 className="screen-title" id="q-det-title">
          🎉 Ton profil : {carte.nom}
        </h1>
        <p className="screen-sub">{quete.titre}</p>

        <section className="q-sec q-profil" aria-label="Ton archétype">
          <p className="q-profil-intro">{arche.intro}</p>
          <p className="q-profil-devise">
            <strong>En résumé :</strong> « {arche.devise} »
          </p>
        </section>

        <section className="q-sec q-profil-bloc" aria-label="Ce que tu apportes">
          <h3>Ce que tu apportes</h3>
          <p>{arche.apportes}</p>
        </section>

        <section className="q-sec q-profil-bloc" aria-label="Ce qui peut te freiner">
          <h3>Ce qui peut te freiner</h3>
          <p>{arche.freines}</p>
        </section>

        <section className="q-sec q-profil-bloc" aria-label="En couple">
          <h3>En couple</h3>
          <p>{arche.couple}</p>
        </section>

        <section className="q-sec q-profil-bloc" aria-label="Ton équilibre">
          <h3>Ton équilibre</h3>
          <p>{arche.equilibre}</p>
        </section>

        <section className="q-sec q-profil-tendances" aria-label={titreTendances(apercu.bars.length)}>
          <h3>🪞 {titreTendances(apercu.bars.length)}</h3>
          <div className="q-det-bars">
            {apercu.bars.map((b) => (
              <div key={b.key} className="q-det-dim">
                <div className="q-det-dim-head">
                  <span className="q-det-dim-nom">{b.nom}</span>
                  <span className="q-det-dim-niveau" data-palier={b.palier}>
                    — {b.pct}/100 ({b.palierLabel})
                  </span>
                </div>
                <div className="q-bar" role="img" aria-label={`${b.nom} : ${b.pct} sur 100`}>
                  <span className="q-bar-fill" data-palier={b.palier} style={{ width: `${Math.max(b.pct, 2)}%` }} />
                </div>
                <p className="q-det-dim-texte">{b.texte}</p>
              </div>
            ))}
          </div>
          <p className="q-profil-nota">{NOTA_BARRES}</p>
        </section>

        <section className="q-sec q-rev" aria-label="La suite de ton voyage">
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
              Le document reprend ton profil, tes tendances mesurées et la suite de ton voyage. Il reste sur ton
              appareil — rien n'est envoyé.
            </p>
          </div>
        </section>
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
          Ton profil de voyage : <strong>{profilPct(termineesTotal)} %</strong> complété
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
