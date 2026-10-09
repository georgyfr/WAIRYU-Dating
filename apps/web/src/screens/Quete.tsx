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
  LIKERT,
  titreTendances,
  type IdQuete,
  type ItemPassation,
  type QueteDef,
} from '../lib/quetes';
import { ARCHE } from '../lib/quetes-plus';
import { ECRAN_17, decode17 } from '../lib/quete-1-7';
import { SORTIES_111, chemin111 } from '../lib/quete-1-11';
import { LIBRE_CODE } from '../lib/quete-2-3';
import { INTENTION_CODE, intentionAffichee, MESSAGE_DOUX } from '../lib/quete-2-5';
import { AXES as AXES_26 } from '../lib/quete-2-6';
import { DISCLAIMER_28, PIED_ECRAN_28, titreBadge28, choisirVariante as choisirVariante28 } from '../lib/quete-2-8';
import {
  enregistrerReponse,
  enregistrerTexte,
  marquerTerminee,
  reinitialiserQuete,
  useEtatQuete,
} from '../lib/quete-state';
import { marquerMondeEnCours } from '../lib/mondes-state';
import { TOTAL_STEPS } from '../lib/voyage';
import { useProgression } from '../lib/progression';
import { useI18n } from '../i18n/I18nProvider';
import { interpolerMontants } from '../i18n/apply';
import PartageCarteModal from '../components/PartageCarteModal';
import type { CartePartageable } from '../components/CarteTypes';

type Phase = 'briefing' | 'passation' | 'details' | 'carte' | 'ecran';

/** Les textes « comment tu vas répondre » par format — les littéraux passent
 *  par tx (chrome) ; les textes COMMUN viennent du registre localisé
 *  (data) et traversent tx sans effet de bord (repli à l'identique). */
function commentRepondreFormat(
  format: QueteDef['format'],
  tx: (fr: string, vars?: Record<string, string | number>) => string,
): readonly string[] {
  switch (format) {
    case 'likert':
      return COMMUN.commentRepondre.map((p) => tx(p));
    case 'likert-enigmes':
      return [
        ...COMMUN.commentRepondre.map((p) => tx(p)),
        tx('À la fin, trois petites énigmes. Elles ne sont pas une note : on regarde comment tu y vas, jamais si tu trouves.'),
      ];
    case 'choix':
      return [
        tx("Six situations s'affichent une à une. À chaque fois, deux options : celle de maintenant, celle qui attend."),
        tx("Pas de bonne réponse — chaque option vaut la même. C'est ton rapport au temps qui se dessine, jamais une note."),
        tx('Réponds avec ta première impulsion, puis laisse la suivante arriver.'),
      ];
    case 'ecran':
      return [
        tx("Des questions à options, rien à réussir : tu coches ce qui est juste pour toi — ou tu ne dis rien, c'est une réponse complète."),
        tx('Tes réponses restent modifiables et effaçables à tout moment, depuis cet écran.'),
      ];
    case 'checklist':
      return [
        tx("Une liste s'affiche : des lignes rouges possibles. Tu coches celles qui sont rédhibitoires pour toi — tu peux tout laisser vide, c'est une réponse complète."),
        tx("Une ligne rouge, c'est ce que tu ne peux pas construire chez l'autre. Cocher n'est jamais « mieux » que ne pas cocher."),
        tx('À la fin, tu peux ajouter une ligne rouge dans tes mots — ou ne rien écrire.'),
      ];
    case 'clic':
      return [
        tx("Huit réalités s'affichent une à une : le tabac, l'alcool, les enfants, où tu vis… Tu touches LA déclaration qui est vraie pour toi."),
        tx("Ce sont des faits, jamais des notes : aucune réalité n'est « meilleure » qu'une autre."),
        tx('Une touche par réalité — tu peux revenir en arrière pour changer.'),
      ];
    case 'binaire':
      return [
        tx("Trois énoncés s'affichent, un à un. Tu réponds Oui ou Non — c'est ton cap d'aujourd'hui, pas un engagement à vie."),
        tx('Si aucune réponse ne te ressemble encore, tu pourras choisir « Je découvre » — un état, jamais une case.'),
        tx('Réponds spontanément : les énoncés sont assumés, il n\'y a pas de piège.'),
      ];
    case 'arbitrage':
      return [
        tx("Un seul écran : cinq horizons pour les cinq prochaines années. Cent points à répartir — donner à un horizon, c'est le retirer à un autre."),
        tx("Aucune répartition n'est proposée : les curseurs partent de zéro, c'est ton arbitrage, pas une suggestion."),
        tx("Le bouton Valider s'allume quand les cent points sont posés."),
      ];
    case 'jeu':
      return [
        tx("Une question, une sélection : ton signe, si tu veux le jouer — ou « Je préfère ne pas dire », et la route continue sans le demander."),
        tx("Le zodiaque ne dit rien de toi : ici, c'est un badge pour la conversation, jamais un profil."),
      ];
  }
}

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
function profilPct(stepsDone: number): number {
  return Math.min(100, Math.round((stepsDone / TOTAL_STEPS) * 100));
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
  const { tx, money } = useI18n();
  const quete = QUETES[queteId];
  const etat = useEtatQuete(queteId);
  // Les étapes réellement franchies (quêtes terminées) — la progression RÉELLE
  // calculée depuis l'état, sur le même bus réactif que useEtatQuete.
  const progression = useProgression();
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
  // Quêtes SANS carte (1.7/1.11/2.8) : aucun score, aucun choix de variante —
  // l'écran final (ECRAN_17 / SORTIES_111 / badge 2.8). 1.11 attend en plus le
  // choix du chemin (Q1.11-chemin), posé APRÈS les 3 questions (Livrable).
  // Monde 3 — les formats à validation explicite attendent leur geste :
  // 2.3 le « Valider » de la checklist (Q2.3-valide), 2.6 la répartition
  // complète à 100 points (Q2.6-valide), 2.5 la 4ᵉ réponse « Je découvre »
  // (Q2.5-intention) quand la combinaison des 3 binaires ne dit rien
  // (Non/Non/Non — message doux du Livrable).
  useEffect(() => {
    if (phase === 'passation' && repondues === deck.length) {
      if (quete.sansCarte) {
        if (queteId === '1.11' && etat.reponses['Q1.11-chemin'] === undefined) return;
        marquerTerminee(queteId, null);
        setPhase('ecran');
        return;
      }
      if (queteId === '2.3' && etat.reponses['Q2.3-valide'] !== 1) return;
      if (queteId === '2.6' && etat.reponses['Q2.6-valide'] !== 1) return;
      if (
        queteId === '2.5' &&
        etat.reponses[INTENTION_CODE] === undefined &&
        intentionAffichee(etat.reponses) === 'aucune'
      )
        return;
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
          {tx('Retour aux mondes')}
        </button>
        <div className="q-head">
          <span className="v-chip v-chip-now">
            <span className="v-chip-dot" aria-hidden="true" />
            {monde.nom}
          </span>
          <span className="v-chip v-chip-soon">
            {tx('Quête {{n}} sur {{total}}', { n: quete.numero, total: quete.totalDuMonde })}
          </span>
          <span className="v-chip v-chip-done">{tx('Gratuite')}</span>
        </div>
        <h1 className="screen-title" id="q-title">
          {quete.titre}
        </h1>
        <p className="screen-sub">{quete.sousTitre}</p>
        <blockquote className="q-annonce">
          <p>{quete.annonce}</p>
        </blockquote>
        <section className="q-sec" aria-label="À quoi sert cette quête">
          <h3>{tx('À quoi sert cette quête')}</h3>
          {quete.briefing.aQuoiCaSert.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </section>
        <section className="q-sec" aria-label={tx('Comment tu vas répondre')}>
          <h3>{tx('Comment tu vas répondre')}</h3>
          {commentRepondreFormat(quete.format, tx).map((p) => (
            <p key={p}>{p}</p>
          ))}
          {(quete.format === 'likert' || quete.format === 'likert-enigmes') && (
            <div
              className="q-scale"
              role="img"
              aria-label={tx(
                "L'échelle de réponse : 5 niveaux, de « Pas du tout moi » à « Tout à fait moi »",
              )}
            >
              {LIKERT.map((n, i) => (
                <span key={n.value} className="q-scale-step" data-level={i + 1}>
                  {n.label}
                </span>
              ))}
            </div>
          )}
        </section>
        <section className="q-sec" aria-label={tx("Ce qu'on attend de toi")}>
          <h3>{tx("Ce qu'on attend de toi")}</h3>
          {COMMUN.comportement.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </section>
        <section className="q-sec" aria-label={tx('Les résultats attendus')}>
          <h3>{tx('Les résultats attendus')}</h3>
          <ul className="q-list">
            {quete.briefing.resultats.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </section>
        <div className="q-ask" role="group" aria-label={tx('Voulez-vous commencer ?')}>
          <p className="q-ask-q">{tx('Voulez-vous commencer ?')}</p>
          <div className="q-actions">
            {etat.terminee ? (
              <>
                <button
                  type="button"
                  className="btn btn-accent"
                  onClick={() => setPhase(quete.sansCarte ? 'ecran' : 'carte')}
                >
                  {quete.sansCarte ? tx('Revoir mon écran') : tx('Revoir ma carte')}
                  <Fleche />
                </button>
                <button type="button" className="btn btn-ghost" onClick={onExit}>
                  {tx('Retour aux mondes')}
                </button>
              </>
            ) : (
              <>
                <button type="button" className="btn btn-accent" onClick={reprendre}>
                  {peutReprendre ? tx('Reprendre ({{n}} réponses)', { n: repondues }) : tx('Commencer')}
                  <Fleche />
                </button>
                <button type="button" className="btn btn-ghost" onClick={onExit}>
                  {tx('Annuler')}
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
              {tx('Effacer mes réponses et recommencer')}
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
    // 2.5 : les 3 binaires posés mais la combinaison (Non/Non/Non) ne dit rien
    // (Livrable — « Incomplétude assumée ») : le MESSAGE DOUX accueille l'état
    // et la 4ᵉ réponse « Je découvre » offre une issue déclarée — ni relance,
    // ni insinuation de défaut. Les réponses restent modifiables.
    const choixIntention =
      queteId === '2.5' &&
      repondues === deck.length &&
      etat.reponses[INTENTION_CODE] === undefined &&
      intentionAffichee(etat.reponses) === 'aucune';
    return (
      <main className="screen q-screen q-run" aria-labelledby="q-run-label">
        {montreReprise && (
          <p className="q-resume" role="status">
            {tx("Tu reprends là où tu t'es arrêté — tes réponses sont conservées.")}
          </p>
        )}
        <div
          className="q-progress"
          role="progressbar"
          aria-label={tx('Progression de la quête')}
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
          <div className="q-choix" role="group" aria-label={tx('Ton chemin — trois sorties, toutes dignes')}>
            <h1 className="q-item" id="q-run-label" ref={questionRef} tabIndex={-1}>
              {tx("Alors, tu pars d'où ?")}
            </h1>
            <button
              type="button"
              className="q-choix-btn"
              onClick={() => enregistrerReponse(queteId, 'Q1.11-chemin', 1)}
            >
              {tx('Je suis prêt·e')}
            </button>
            <button
              type="button"
              className="q-choix-btn"
              onClick={() => enregistrerReponse(queteId, 'Q1.11-chemin', 2)}
            >
              {tx("D'abord une quête recommandée")}
            </button>
            <button
              type="button"
              className="q-choix-btn"
              onClick={() => enregistrerReponse(queteId, 'Q1.11-chemin', 3)}
            >
              {tx('Je commence quand même')}
            </button>
            <p className="q-ecran-note">{tx("Aucun chemin n'est le bon — et tu pourras changer d'avis quand tu veux.")}</p>
          </div>
        ) : choixIntention ? (
          <div className="q-choix" role="group" aria-label={tx('Ton intention — un état, jamais une case')}>
            <h1 className="q-item" id="q-run-label" ref={questionRef} tabIndex={-1}>
              {tx("Aucune de tes réponses ne dessine encore un cap — et c'est très bien ainsi.")}
            </h1>
            <p className="q-ecran-note q-ecran-note-doux">{MESSAGE_DOUX}</p>
            <button
              type="button"
              className="q-choix-btn"
              onClick={() => enregistrerReponse(queteId, INTENTION_CODE, 1)}
            >
              {tx('Je découvre')}
            </button>
            <p className="q-ecran-note">
              {tx('Tu peux aussi modifier tes réponses ci-dessous — tes trois réponses restent intactes et sans jugement.')}
            </p>
          </div>
        ) : quete.format === 'checklist' ? (
          // 2.3 — UN écran (Livrable) : les 9 lignes rouges cochables + le champ
          // libre Q2.3-10 (les mots de la personne, jamais reformulés, hors
          // computation). « Valider » pose TOUTES les valeurs (0 ou 1 — la liste
          // vide est un cadre ouvert assumé, jamais une absence de réponse) puis
          // le gate Q2.3-valide déclenche la complétion.
          <div className="q-choix q-checklist" role="group" aria-label={tx('Tes lignes rouges — coches ce qui est rédhibitoire pour toi')}>
            <h1 className="q-item" id="q-run-label" ref={questionRef} tabIndex={-1}>
              {tx('Coches tes lignes rouges — ou aucune.')}
            </h1>
            {deck.map((it) => {
              const on = etat.reponses[it.code] === 1;
              return (
                <button
                  key={it.code}
                  type="button"
                  className={on ? 'q-choix-btn q-choix-btn-on' : 'q-choix-btn'}
                  aria-pressed={on}
                  onClick={() => enregistrerReponse(queteId, it.code, on ? 0 : 1)}
                >
                  <span className="q-check-mark" aria-hidden="true">
                    {on ? '✓' : ''}
                  </span>
                  {it.text}
                </button>
              );
            })}
            <label className="q-check-libre">
              <span>Une autre ligne rouge, dans tes mots — ou laisse vide.</span>
              <textarea
                value={etat.textes?.[LIBRE_CODE] ?? ''}
                maxLength={500}
                rows={3}
                onChange={(e) => enregistrerTexte(queteId, LIBRE_CODE, e.target.value)}
                placeholder={tx('Tes mots à toi — ils ne sont jamais reformulés.')}
              />
            </label>
            <button
              type="button"
              className="btn btn-accent q-choix-valider"
              onClick={() => {
                deck.forEach((it) => enregistrerReponse(queteId, it.code, etat.reponses[it.code] === 1 ? 1 : 0));
                enregistrerReponse(queteId, 'Q2.3-valide', 1);
              }}
            >
              {tx('Valider ma sélection')}
              <Fleche />
            </button>
            <p className="q-ecran-note">{tx("Rien n'est jugé ici : la liste vide est un cadre ouvert, une réponse complète.")}</p>
          </div>
        ) : quete.format === 'arbitrage' ? (
          // 2.6 — UN écran (Livrable) : 5 curseurs 0-100, somme verrouillée à
          // 100, AUCUNE valeur par défaut (les curseurs s'enregistrent au geste).
          // « Valider » pose TOUTES les valeurs puis le gate Q2.6-valide —
          // aucune sortie partielle.
          <div className="q-choix q-arbitrage" role="group" aria-label={tx('Tes priorités — cent points à répartir sur cinq horizons')}>
            <h1 className="q-item" id="q-run-label" ref={questionRef} tabIndex={-1}>
              {tx('Cent points. Cinq horizons.')}
            </h1>
            {AXES_26.map((a) => {
              const pts = etat.reponses[a.code] ?? 0;
              return (
                <div key={a.code} className="q-arb-axe">
                  <div className="q-arb-head">
                    <span className="q-arb-nom">{a.nom}</span>
                    <span className="q-arb-pts">{tx('{{n}} pts', { n: pts })}</span>
                  </div>
                  <p className="q-arb-desc">{a.description}</p>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={pts}
                    aria-label={`${a.nom} — ${tx('{{n}} — points sur 100', { n: 100 })}`}
                    onChange={(e) => enregistrerReponse(queteId, a.code, Number(e.target.value))}
                  />
                </div>
              );
            })}
            <div className="q-arb-total" role="status">
              {(() => {
                const reste = 100 - AXES_26.reduce((s, a) => s + (etat.reponses[a.code] ?? 0), 0);
                return reste === 0 ? tx('Les cent points sont posés.') : tx('Il reste {{n}} points à répartir.', { n: reste });
              })()}
            </div>
            <button
              type="button"
              className="btn btn-accent q-choix-valider"
              disabled={100 - AXES_26.reduce((s, a) => s + (etat.reponses[a.code] ?? 0), 0) !== 0}
              onClick={() => {
                AXES_26.forEach((a) => enregistrerReponse(queteId, a.code, etat.reponses[a.code] ?? 0));
                enregistrerReponse(queteId, 'Q2.6-valide', 1);
              }}
            >
              {tx('Valider ma répartition')}
              <Fleche />
            </button>
          </div>
        ) : (
          <>
            <h1 className="q-item" id="q-run-label" ref={questionRef} tabIndex={-1}>
              {interpolerMontants(item.text, money)}
            </h1>
            {item.format === 'likert' && (
              <div className="q-likert" role="group" aria-label={tx('Ta réponse — 5 niveaux')}>
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
              <div className="q-choix" role="group" aria-label={tx('Ton choix — deux options, la même valeur')}>
                <button
                  type="button"
                  className={valeur === 1 ? 'q-choix-btn q-choix-btn-on' : 'q-choix-btn'}
                  onClick={() => repondre(item.code, 1)}
                >
                  <span className="q-choix-tag">{tx('Maintenant')}</span>
                  {interpolerMontants(item.choixA ?? '', money)}
                </button>
                <button
                  type="button"
                  className={valeur === 2 ? 'q-choix-btn q-choix-btn-on' : 'q-choix-btn'}
                  onClick={() => repondre(item.code, 2)}
                >
                  <span className="q-choix-tag">{tx('Plus tard')}</span>
                  {interpolerMontants(item.choixB ?? '', money)}
                </button>
              </div>
            )}
            {item.format === 'question' && item.multi && (
              <div
                className="q-choix q-choix-multi"
                role="group"
                aria-label={tx("Ta réponse — choisis autant d'options que tu veux, ou aucune")}
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
                      {interpolerMontants(opt, money)}
                    </button>
                  );
                })}
                <button
                  type="button"
                  className="btn btn-accent q-choix-valider"
                  onClick={() => setIdx((i) => Math.min(i + 1, deck.length - 1))}
                >
                  {tx('Valider ma sélection')}
                  <Fleche />
                </button>
              </div>
            )}
            {item.format === 'question' && !item.multi && (
              <div className="q-choix" role="group" aria-label={tx('Ta réponse')}>
                {(item.options ?? []).map((opt, i) => (
                  <button
                    key={opt}
                    type="button"
                    className={valeur === i + 1 ? 'q-choix-btn q-choix-btn-on' : 'q-choix-btn'}
                    onClick={() => repondre(item.code, i + 1)}
                  >
                    {interpolerMontants(opt, money)}
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
              {tx('Question précédente')}
            </button>
          )}
          <button type="button" className="q-run-pause" onClick={() => setPhase('briefing')}>
            {tx('Faire une pause — tes réponses restent')}
          </button>
        </div>
      </main>
    );
  }

  // -------------------------------------- écran final — quêtes SANS carte
  // 1.7 « écran de confiance » (ECRAN_17) · 1.11 « écran de passage » (le
  // chemin choisi → SORTIES_111 — verbatim Livrable) · 2.8 « badge miniature »
  // (le signe choisi → titre verbatim + phrase légère + DISCLAIMER gravé ;
  // « Je préfère ne pas dire » → AUCUN badge, aucune trace — retour silencieux).
  // Aucune carte, aucun score, aucun PDF : la quête se clôt sur son écran.
  if (phase === 'ecran') {
    if (queteId === '2.8') {
      const idBadge = choisirVariante28(etat.reponses);
      const badge = quete.cartes[idBadge];
      const badgeTitre = titreBadge28(idBadge);
      const silence = badgeTitre === '';
      const laSuite2 = quete.suivante ? QUETES[quete.suivante] : null;
      return (
        <main className="screen q-screen" aria-labelledby="q-ecran-title">
          <div className="q-carte" role="region" aria-label={tx('Ton écran')}>
            <p className="q-carte-entete">{quete.completion.entete}</p>
            {silence ? (
              <>
                <h1 className="q-carte-nom" id="q-ecran-title">
                  {tx('Tu préfères ne pas dire')}
                </h1>
                <p className="q-carte-lumiere">
                  {tx("C'est noté — le voyage continue sans le badge. Aucune trace, aucune relance.")}
                </p>
              </>
            ) : (
              <>
                <h1 className="q-carte-nom" id="q-ecran-title">
                  {badgeTitre}
                </h1>
                <p className="q-carte-lumiere">{badge.lumiere}</p>
                <p className="q-ecran-note">{DISCLAIMER_28}</p>
                <p className="q-carte-hint">{PIED_ECRAN_28.split(' · ')[0]}</p>
              </>
            )}
            <div className="q-carte-actions">
              {laSuite2 ? (
                <button type="button" className="btn btn-accent" onClick={() => onAllerQuete(laSuite2.id)}>
                  {quete.suite.cta ?? tx('Continuer le voyage')}
                  <Fleche />
                </button>
              ) : (
                <button type="button" className="btn btn-accent" onClick={onHome}>
                  {quete.suite.cta ?? tx('Retour à mon voyage')}
                  <Fleche />
                </button>
              )}
              <button type="button" className="btn btn-ghost" onClick={onExit}>
                {tx('Retour aux mondes')}
              </button>
            </div>
            <p className="q-carte-hint">
              {tx('Tes réponses restent sur cet appareil — tu peux les modifier ou tout effacer depuis « Voulez-vous commencer ? ».')}            </p>
          </div>
        </main>
      );
    }
    const ecran = queteId === '1.7' ? ECRAN_17 : SORTIES_111[chemin111(etat.reponses)];
    const laSuite = quete.suivante ? QUETES[quete.suivante] : null;
    return (
      <main className="screen q-screen" aria-labelledby="q-ecran-title">
        <div className="q-carte" role="region" aria-label={tx('Ton écran')}>
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
                      : tx("Tu n'as rien coché pour le moment — c'est une réponse complète.")}
                  </p>
                );
              })}
            </div>
          )}
          <div className="q-carte-actions">
            {laSuite ? (
              <button type="button" className="btn btn-accent" onClick={() => onAllerQuete(laSuite.id)}>
                {quete.suite.cta ?? tx('Continuer le voyage')}
                <Fleche />
              </button>
            ) : (
              <button type="button" className="btn btn-accent" onClick={onHome}>
                {quete.suite.cta ?? tx('Retour à mon voyage')}
                <Fleche />
              </button>
            )}
            <button type="button" className="btn btn-ghost" onClick={onExit}>
              {tx('Retour aux mondes')}
            </button>
          </div>
          <p className="q-carte-hint">{tx('Tes réponses restent sur cet appareil — tu peux les modifier ou tout effacer depuis « Voulez-vous commencer ? ».')}</p>
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
          {tx('Revenir à ma carte')}
        </button>
        <div className="q-head">
          <span className="v-chip v-chip-now">
            <span className="v-chip-dot" aria-hidden="true" />
            {monde.nom}
          </span>
          <span className="v-chip v-chip-soon">
            {tx('Quête {{n}} sur {{total}}', { n: quete.numero, total: quete.totalDuMonde })}
          </span>
        </div>
        <h1 className="screen-title" id="q-det-title">
          {tx('🎉 Ton profil :')} {carte.nom}
        </h1>
        <p className="screen-sub">{quete.titre}</p>

        <section className="q-sec q-profil" aria-label={tx('Ton archétype')}>
          <p className="q-profil-intro">{arche.intro}</p>
          <p className="q-profil-devise">
            <strong>{tx('En résumé :')}</strong> « {arche.devise} »
          </p>
        </section>

        <section className="q-sec q-profil-bloc" aria-label={tx('Ce que tu apportes')}>
          <h3>{tx('Ce que tu apportes')}</h3>
          <p>{arche.apportes}</p>
        </section>

        <section className="q-sec q-profil-bloc" aria-label={tx('Ce qui peut te freiner')}>
          <h3>{tx('Ce qui peut te freiner')}</h3>
          <p>{arche.freines}</p>
        </section>

        <section className="q-sec q-profil-bloc" aria-label={tx('En couple')}>
          <h3>{tx('En couple')}</h3>
          <p>{arche.couple}</p>
        </section>

        <section className="q-sec q-profil-bloc" aria-label={tx('Ton équilibre')}>
          <h3>{tx('Ton équilibre')}</h3>
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

        <section className="q-sec q-rev" aria-label={tx('La suite de ton voyage')}>
          <p className="q-rev-kicker">{tx('🧭 La suite de ton voyage')}</p>
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
                {quete.suite.cta ?? tx('Continuer le voyage')}
                <Fleche />
              </button>
            ) : (
              <button type="button" className="btn btn-accent" onClick={onHome}>
                {tx('Retour à mon voyage')}
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
              {pdfEnCours ? tx('Ton document se prépare…') : tx('Télécharger mon document personnel')}
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => setPhase('carte')}>
              {tx('Revenir à ma carte')}
            </button>
            <p className="q-carte-hint">
              {tx("Le document reprend ton profil, tes tendances mesurées et la suite de ton voyage. Il reste sur ton appareil — rien n'est envoyé.")}
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
      <div className="q-carte" role="region" aria-label={tx('Ta carte')}>
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
          {tx('Ton profil de voyage :')} <strong>{tx('{{n}} % complété', { n: profilPct(progression.stepsDone) })}</strong>
        </p>
        <div className="q-carte-actions">
          <button type="button" className="btn btn-accent" onClick={() => setPhase('details')}>
            {tx('Voir mes résultats en détail')}
            <Fleche />
          </button>
          <button type="button" className="btn btn-outline" onClick={() => setPartageOuvert(true)}>
            {tx('Partager ma carte')}
          </button>
          {copieOk && (
            <p className="q-shared" role="status">
              {tx('Copié — ta carte est dans le presse-papiers.')}
            </p>
          )}
          <button type="button" className="btn btn-ghost" onClick={onHome}>
            {tx('Retour à mon voyage')}
          </button>
        </div>
        <p className="q-carte-hint">
          {tx("Rien ne se remet à zéro : ta carte, tes réponses et tes résultats restent dans l'onglet Quête — tu reviens quand tu veux.")}
        </p>
        <p className="q-fenetre">{quete.completion.fenetre}</p>
      </div>
      {suivante ? (
        <div className="q-next" role="region" aria-label={tx('Ta prochaine quête')}>
          <p className="q-next-kicker">{tx('Ta prochaine quête')}</p>
          <h2 className="q-next-titre">{suivante.titre}</h2>
          <blockquote className="q-next-annonce">
            <p>{suivante.annonce}</p>
          </blockquote>
          <button type="button" className="btn btn-accent" onClick={() => onAllerQuete(suivante.id)}>
            {tx('Attaquer la quête suivante')}
            <Fleche />
          </button>
        </div>
      ) : (
        <div className="q-next q-next-end" role="region" aria-label={tx('Et maintenant ?')}>
          <p className="q-next-kicker">{tx('Et maintenant ?')}</p>
          <h2 className="q-next-titre">{tx('Le miroir — la suite de ton monde')}</h2>
          <p className="q-next-note">{quete.completion.miroirNote}</p>
          <p className="q-next-note">
            {tx("Tu as terminé les trois quêtes ouvertes du Miroir : ta personnalité, ta façon de t'attacher, tes émotions — trois cartes qui se répondent.")}
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
