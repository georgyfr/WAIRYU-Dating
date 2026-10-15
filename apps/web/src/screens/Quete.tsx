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
 *  - DÉTAILS (Task 35 — gabarit fondateur ; voix Task 74) : la page répond
 *    EXACTEMENT de la même manière quel que soit l'archétype. Un GABARIT de
 *    9 blocs, toujours rendu dans le même ordre : 🎉 Ton profil : {nom} →
 *    « {titre}, d'après tes réponses » + intro (« Toi, … ») → En résumé :
 *    « devise » → Ta force → Là où ça peut se compliquer → En couple → Ce
 *    que ce profil te souffle → Tes N tendances (d'après tes réponses),
 *    « nom · score/100 · palier » + barre + « Petit pas : » + sous chaque
 *    barre « Ce qui pèse dans ce score » → note « photo / pas une note » —
 *    puis la zone d'ombre en relation, la barre de satisfaction, la suite
 *    (cliffhanger + CTA) et le PDF (lib/pdf-resultats.ts, même structure).
 *    Les mots viennent du registre ARCHE (V1 1.1 = texte verbatim du
 *    fondateur, Task 74) ; les mesures du scorer du Livrable. La page doit
 *    donner envie d'aller jusqu'à la quête suivante, jamais décourager.
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
  QUETES_FUSION_OMBRE,
  LIKERT,
  titreTendances,
  type IdQuete,
  type ItemPassation,
  type QueteDef,
} from '../lib/quetes';
import { ARCHE } from '../lib/quetes-plus';
// Task 65 — l'ancrage des barres : les réponses réelles citées sous chaque
// tendance (demande fondateur : les résultats doivent PROUVER, pas affirmer).
import { ancragesDeQuete } from '../lib/ancrage-likert';
// Task 77 — les sources des champs : sous chaque bloc du profil (Ta force,
// Là où ça peut se compliquer, En couple, Ce que ce profil te souffle, Ta zone
// d'ombre en relation), les questions RÉELLES qui portent le texte
// (demande fondateur : « les réponses sont avérées vraies, effet barnum
// minimisé ») — lecture seule du questionnaire, rien n'est modifié.
import { sourcesDeQuete, type LigneSource } from '../lib/sources-sections';
// Task 78 — les ÉCHOS des tendances : les cartes citent ce que la personne a
// VRAIMENT répondu (« ce que tu as répondu, ce que ça dit, un petit pas »), et
// « Là où ça peut se compliquer » gagne sa ligne « Et tes réponses le disent »
// — lecture seule, repli sur le texte de palier quand rien n'est tranché.
import { texteTendanceDe, echoFreinesDe } from '../lib/echoes-tendances';
// Task 66 — la barre de satisfaction : la réponse du membre ouvre la suite.
// Task 78 — « Passer » : la suite n'est plus bloquée sans réponse.
import {
  QUETES_AVEC_AVIS,
  lireAvis,
  lireAvisPasse,
  marquerAvisPasse,
  type AvisSatisfaction,
} from '../lib/satisfaction';
import SatBarAvis from '../components/SatBarAvis';
// Task 95 — les mots de 1.7 en clair : sous-titre technique + bouton « ? »
// + champ libre « Autre » (demande fondateur : phrases simples + pop-up).
import { ECRAN_17, decode17, EXPLIQUES_17, TEXTE_LIBRE_17 } from '../lib/quete-1-7';
import { SORTIES_111, chemin111 } from '../lib/quete-1-11';
import { LIBRE_CODE } from '../lib/quete-2-3';
import { INTENTION_CODE, intentionAffichee, MESSAGE_DOUX } from '../lib/quete-2-5';
import { AXES as AXES_26 } from '../lib/quete-2-6';
import { DISCLAIMER_28, PIED_ECRAN_28, titreBadge28, choisirVariante as choisirVariante28 } from '../lib/quete-2-8';
import { BADGES_31 } from '../lib/quete-3-1';
import { AMORCES } from '../lib/quete-3-6';
import { ECRAN_FINAL_37, compteSelections37, GARDE_MAX_37 } from '../lib/quete-3-7';
import { ARBRE_CODE, ARBRE, serialiserArbre, deserialiserArbre } from '../lib/quete-4-1';
import { OUVERTE_CODE, OUVERTE } from '../lib/quete-4-2';
import {
  OUVERTE_CODE as OUVERTE_43,
  RETRAIT as RETRAIT_43,
  ECRAN_ECRITE,
  ECRAN_FINAL_43,
} from '../lib/quete-4-3';
import {
  enregistrerReponse,
  enregistrerTexte,
  marquerTerminee,
  reinitialiserQuete,
  useEtatQuete,
} from '../lib/quete-state';
import { marquerMondeEnCours } from '../lib/mondes-state';
import { TOTAL_STEPS, WORLDS } from '../lib/voyage';
import { useProgressionDetail } from '../lib/progression';
import { feteDejaVue, marquerFeteVue } from '../lib/fete-monde';
import { useI18n } from '../i18n/I18nProvider';
import { interpolerMontants } from '../i18n/apply';
import PartageCarteModal from '../components/PartageCarteModal';
import InfoFonctionnement from '../components/InfoFonctionnement';
import type { CartePartageable } from '../components/CarteTypes';
import VoyageIcon from '../components/VoyageIcons';
import type { VoyageIconName } from '../components/VoyageIcons';

type Phase = 'briefing' | 'passation' | 'details' | 'carte' | 'ecran';

/* ============================================================
   2.6 — VERROU DE SOMME effectif (Livrable 04 n°1 : « somme verrouillée » ;
   briefing : « donner à un horizon, c'est le retirer à un autre »).
   PRÉSENTATION SEULE : traduit le geste d'un curseur en enregistrements de
   réponses — aucune valeur inventée, le scorer lit exactement les mêmes
   reponses et le gate Q2.6-valide (somme exacte) reste le seul validateur.
   - total < 100 : le geste puise dans les points non posés (remplissage) ;
   - total = 100 : monter un curseur PREND aux autres, baisser REND aux autres
     (répartition en rond, clampée) — la somme reste 100 à tout geste ;
   - total > 100 (états posés avant le verrou) : curseurs libres, l'écran
     nomme le dépassement ; dès que le total repasse ≤ 100, le verrou reprend.
   ============================================================ */

/** Répartit exactement `besoin` unités, en rond (i prend au plus capacites[i]),
 *  retour par index. Faisabilité garantie par les bornes des deux usages
 *  (prendre : Σ capacites = 100 − valeur du curseur ; rendre : Σ capacites =
 *  4×100 − Σ autres). Unitaire et conservatif — la somme ne peut pas dériver. */
function repartirEnRond(capacites: readonly number[], besoin: number): number[] {
  const res = capacites.map(() => 0);
  let reste = besoin;
  let progres = true;
  while (reste > 0 && progres) {
    progres = false;
    for (let i = 0; i < capacites.length && reste > 0; i += 1) {
      if (res[i] < capacites[i]) {
        res[i] += 1;
        reste -= 1;
        progres = true;
      }
    }
  }
  return res;
}

/** Le geste d'un curseur 2.6, verrouillé : enregistre la nouvelle valeur du
 *  curseur ET les ajustements des autres (si redistribution nécessaire). */
function gesteArbitrage26(
  queteId: string,
  code: string,
  demande: number,
  reponses: Record<string, number>,
): void {
  const codes = AXES_26.map((a) => a.code);
  const val = (c: string): number => reponses[c] ?? 0;
  const courant = val(code);
  const v = Math.max(0, Math.min(100, Math.round(demande)));
  if (v === courant) return;
  const delta = v - courant;
  const total = codes.reduce((s, c) => s + val(c), 0);

  // États posés avant le verrou (total > 100) : geste libre — l'écran nomme
  // le dépassement ; la reprise du verrou se fait dès total ≤ 100.
  if (total > 100) {
    enregistrerReponse(queteId, code, v);
    return;
  }
  // Remplissage (total < 100) : montée limitée au pool restant, baisse simple.
  if (total < 100) {
    enregistrerReponse(queteId, code, delta > 0 ? Math.min(v, courant + (100 - total)) : v);
    return;
  }
  // Somme pleine (total = 100) : le geste redistribue — la somme reste 100.
  const autres = codes.filter((c) => c !== code);
  if (delta > 0) {
    // Prendre `delta` aux autres — capacité de chacun = sa valeur (clamp 0).
    const prelev = repartirEnRond(autres.map((c) => val(c)), delta);
    enregistrerReponse(queteId, code, v);
    autres.forEach((c, i) => {
      if (prelev[i] > 0) enregistrerReponse(queteId, c, val(c) - prelev[i]);
    });
  } else {
    // Rendre `−delta` aux autres — capacité de chacun = 100 − sa valeur.
    const dons = repartirEnRond(autres.map((c) => 100 - val(c)), -delta);
    enregistrerReponse(queteId, code, v);
    autres.forEach((c, i) => {
      if (dons[i] > 0) enregistrerReponse(queteId, c, val(c) + dons[i]);
    });
  }
}

/** Les textes « comment tu vas répondre » par format — les littéraux passent
 *  par tx (chrome) ; les textes COMMUN viennent du registre localisé
 *  (data) et traversent tx sans effet de bord (repli à l'identique). */
function commentRepondreFormat(
  format: QueteDef['format'],
  tx: (fr: string, vars?: Record<string, string | number>) => string,
  queteId?: string,
): readonly string[] {
  // 3.7 « Tes attirances » — le déclaratif PRIVÉ a SA copie (le générique
  // 'ecran' dit « tu ne dis rien » : faux ici, la garde 1-3 s'applique).
  if (queteId === '3.7') {
    return [
      tx("Cinq déclarations s'affichent une à une : tu coches de une à trois options — jamais plus."),
      tx("Rien ne se déduit et rien ne se note : tes choix organisent tes découvertes, ils ne te classent pas."),
      tx("Personne ne voit tes déclarations : ni sur ton profil, ni ailleurs. Modifiable quand tu veux."),
    ];
  }
  // 4.3 « Ce que tes relations t'ont appris » — la tâche d'écriture a SA copie
  // (le générique 'ecran' parle de cases à cocher : faux ici, c'est une page
  // d'écoute — Livrable 4.3, facultative, jamais rendue).
  if (queteId === '4.3') {
    return [
      tx("Une page s'ouvre : une question, un champ libre — ou « Je préfère ne pas dire », et la route continue sans pénalité."),
      tx("Pas de longueur minimale, pas de piège : l'écoute n'est pas une évaluation."),
      tx('Ce que tu écris reste chez toi : jamais cité, jamais montré.'),
    ];
  }
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
    case 'images':
      return [
        tx("Huit paires s'affichent une à une : deux scènes, tu touches celle qui te parle. Pas d'abstention — on choisit toujours."),
        tx("Pas de bonne réponse : la scène choisie dit quelque chose de toi, jamais une note."),
        tx("Réponds avec ta première impulsion : l'image qui appelle est souvent la bonne."),
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

/** L'icône du monde pour le héros du briefing (données Voyage — pur affichage,
 *  même icône que l'écran Voyage ; repli boussole si code inconnu). */
function heroIconMonde(code: string): VoyageIconName {
  return (WORLDS.find((w) => w.code === code)?.icon as VoyageIconName) ?? 'compass';
}

/** La modalité du briefing (cellule centrale des statistiques) — PUR AFFICHAGE :
 *  le chiffre et le libellé décrivent la passation (5 niveaux, 1 écran…), jamais
 *  un score ni une donnée moteur. Dérivé du format de la quête uniquement. */
function modaliteFormat(
  format: QueteDef['format'],
  tx: (fr: string, vars?: Record<string, string | number>) => string,
): { n: number; label: string } {
  switch (format) {
    case 'likert':
    case 'likert-enigmes':
      return { n: LIKERT.length, label: tx('niveaux') };
    case 'checklist':
    case 'ecran':
      return { n: 1, label: tx('écran') };
    case 'choix':
      return { n: 2, label: tx('options') };
    case 'binaire':
    case 'jeu':
      return { n: 2, label: tx('choix') };
    case 'arbitrage':
      return { n: 100, label: tx('points') };
    case 'clic':
      return { n: 1, label: tx('touche') };
    case 'images':
      return { n: 2, label: tx('scènes') };
  }
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
  /** Task 98 — LA FÊTE DU MONDE : appelé quand une sortie de l'écran final
   *  clôt un monde fraîchement terminé (complétion de CETTE session, jamais
   *  fêtée sur cet appareil). App.tsx ouvre l'overlay FeteMonde et exécute
   *  `apres` à la fermeture (la navigation attend la fin de la fête). */
  onClotureMonde: (code: string, apres: () => void) => void;
}

export default function Quete({
  queteId,
  resultatsInitiale = false,
  onExit: onExitBrut,
  onHome: onHomeBrut,
  onAllerQuete: onAllerQueteBrut,
  onClotureMonde,
}: Props) {
  const { tx, money } = useI18n();
  const quete = QUETES[queteId];
  const etat = useEtatQuete(queteId);
  // Les étapes réellement franchies (quêtes terminées) — la progression RÉELLE
  // calculée depuis l'état, sur le même bus réactif que useEtatQuete.
  // Task 98 : le DÉTAIL par monde (parMonde) sert aussi à détecter la clôture
  // d'un monde (faites === total) au moment où elle arrive.
  const progression = useProgressionDetail();
  const monde = mondeDeQuete(queteId);

  // ------------------------------------------------------------------
  // Task 98 — LA FÊTE DU MONDE (demande fondateur : « lorsqu'un monde est
  // terminé avec succès, une page de célébration avec effet spéciaux et
  // d'animation apparaît »).
  //
  // DÉCLENCHEMENT HONNÊTE (trois conditions, toutes nécessaires) :
  //  1. `mondeFraisTermine` — la complétion VIENT de se produire dans cette
  //     session (posé par l'effet de complétion ci-dessous) — on ne célèbre
  //     jamais un monde traversé avant l'arrivée de la fête ni à la relecture ;
  //  2. `mondeComplet` — toutes les quêtes livrées du monde sont terminées
  //     (bus de progression RÉEL, jamais inventé) ;
  //  3. `!feteDejaVue(code)` — UNE fête par monde et par appareil (drapeau
  //     `wairyu.fete.{code}`, posé AVANT l'ouverture : un rechargement
  //     pendant la fête ne la rejoue pas).
  //
  // La fête s'ouvre quand la personne QUITTE l'écran final (carte ou écran de
  // clôture) — elle ne cache jamais la carte qu'elle vient de gagner. Les
  // trois sorties (onExit / onHome / onAllerQuete) passent par `sortieVers` :
  // la navigation est RETENUE et s'exécute à la fermeture de la fête (App.tsx).
  const mondeFraisTermine = useRef(false);
  const progresMonde = progression.parMonde[monde.code];
  const mondeComplet = !!progresMonde && progresMonde.total > 0 && progresMonde.faites === progresMonde.total;

  const sortieVers = (naviguer: () => void): void => {
    if (mondeFraisTermine.current && mondeComplet && !feteDejaVue(monde.code)) {
      mondeFraisTermine.current = false;
      marquerFeteVue(monde.code);
      onClotureMonde(monde.code, naviguer);
      return;
    }
    naviguer();
  };
  // Les MÊMES noms que les props : chaque site d'appel existant (boutons de
  // sortie de la carte, des écrans de clôture, actions différées de la gate
  // d'avis) est intercepté sans toucher une seule ligne de rendu.
  const onExit = (): void => sortieVers(onExitBrut);
  const onHome = (): void => sortieVers(onHomeBrut);
  const onAllerQuete = (id: IdQuete): void => sortieVers(() => onAllerQueteBrut(id));

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
  // Task 95 — le pop-up « mots en clair » de 1.7 : index d'option, 'tous'
  // (glossaire + pourquoi de la question), ou null (fermé).
  const [info17, setInfo17] = useState<number | 'tous' | null>(null);
  // Monde 5 · 4.1 — les figures libres de l'écran génogramme (modalité NON
  // COMPTEE du Livrable : local à cet écran, sérialisé dans les textes au
  // geste « Continuer » — jamais rendu hors de cet écran, jamais scoré).
  const [figures, setFigures] = useState<{ label: string; qualif: string }[]>(() =>
    deserialiserArbre(etat.textes?.[ARBRE_CODE] ?? ''),
  );
  const [labelDraft, setLabelDraft] = useState('');
  const [qualifDraft, setQualifDraft] = useState('');
  const [copieOk, setCopieOk] = useState<boolean>(false);
  const [pdfEnCours, setPdfEnCours] = useState<boolean>(false);
  // Task 66 — la satisfaction : l'avis (note 1-5) est la clé qui ouvre la
  // suite — n'importe laquelle, elle ne change rien aux résultats. La notice
  // (avisDemande) est une info-bulle EXPLICITE (Task 79 — retour fondateur :
  // la personne doit comprendre pourquoi elle est renvoyée ici) ; le
  // défilement (defilerAvis) amène le champ d'avis à l'écran quelle que
  // soit l'action bloquée (quête suivante, Revenir à ma carte, Retour à mon
  // voyage — retour fondateur v2).
  const [avis, setAvis] = useState<AvisSatisfaction | null>(() => lireAvis(queteId));
  const [avisDemande, setAvisDemande] = useState<boolean>(false);
  const [defilerAvis, setDefilerAvis] = useState<boolean>(false);
  // Task 78 — « Passer » : la quête peut être traversée sans réponse (marqueur
  // local) ; l'action bloquée est retenue pour être exécutée après le passage.
  const [avisPasse, setAvisPasse] = useState<boolean>(() => lireAvisPasse(queteId));
  const actionBloqueeRef = useRef<null | 'suite' | 'carte' | 'home'>(null);
  const ancreAvisRef = useRef<HTMLDivElement | null>(null);

  const apercu = useMemo(
    () => (phase === 'details' ? construireApercuResultats(quete, etat.reponses) : null),
    [phase, quete, etat.reponses],
  );
  /** L'ancrage complet (par dimension) — null si la quête n'a pas d'items typés. */
  const ancrages = useMemo(
    () => (phase === 'details' ? ancragesDeQuete(queteId, etat.reponses) : null),
    [phase, queteId, etat.reponses],
  );

  // Task 66 — la gate : pour les quêtes à avis, la suite ramène au champ —
  // Task 78 : SANS bloquer (le lien « Passer » du champ ouvre la suite ; le
  // marqueur local éteint la gate définitivement pour la quête). Jamais un
  // seuil, jamais un filtre : le degré de satisfaction n'est PAS une donnée
  // du moteur.
  const gateAvis = QUETES_AVEC_AVIS.has(queteId) && !avis && !avisPasse;

  /** Amène le champ de réponse à l'écran avec sa notice polie, en retenant
   *  l'action interrompue — « Passer » l'exécutera. */
  const bloquerPourAvis = useCallback((action: 'suite' | 'carte' | 'home') => {
    actionBloqueeRef.current = action;
    setAvisDemande(true);
    setDefilerAvis(true);
  }, []);

  // Le défilement attend la bonne phase : venant de la carte, le champ de
  // note (écran détails) n'existe pas encore au moment du clic.
  useEffect(() => {
    if (!defilerAvis || phase !== 'details') return;
    setDefilerAvis(false);
    ancreAvisRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [defilerAvis, phase]);

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
        // 4.3 : la page d'écoute attend son geste (« Envoyer » ou
        // « Je préfère ne pas dire » — deux sorties complètes, Livrable 4.3).
        if (queteId === '4.3' && etat.reponses[OUVERTE_43] === undefined) return;
        marquerTerminee(queteId, null);
        mondeFraisTermine.current = true; // Task 98 — la fête du monde s'arme ici
        setPhase('ecran');
        return;
      }
      if (queteId === '2.3' && etat.reponses['Q2.3-valide'] !== 1) return;
      if (queteId === '2.6' && etat.reponses['Q2.6-valide'] !== 1) return;
      // Monde 5 — les écrans propres attendent leur geste : 4.1 le génogramme
      // (modalité NON COMPTEE — « Continuer » ou « Passer », deux sorties
      // complètes), 4.2 la question ouverte hors mélange (« Envoyer ma page »
      // ou « Je préfère ne pas dire » — interdits V10 : jamais rendue).
      if (queteId === '4.1' && etat.reponses[ARBRE_CODE] === undefined) return;
      if (queteId === '4.2' && etat.reponses[OUVERTE_CODE] === undefined) return;
      if (
        queteId === '2.5' &&
        etat.reponses[INTENTION_CODE] === undefined &&
        intentionAffichee(etat.reponses) === 'aucune'
      )
        return;
      const carteId = etat.carteId ?? quete.choisirVariante(quete.scorer(etat.reponses));
      marquerTerminee(queteId, carteId);
      mondeFraisTermine.current = true; // Task 98 — la fête du monde s'arme ici
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
    const modalite = modaliteFormat(quete.format, tx);
    const labelItems =
      quete.format === 'likert' || quete.format === 'likert-enigmes'
        ? deck.length > 1
          ? tx('affirmations')
          : tx('affirmation')
        : deck.length > 1
          ? tx('énoncés')
          : tx('énoncé');
    return (
      <main className="screen q-screen qtv" aria-labelledby="q-title">
        <div className="qtv-top">
          <button type="button" className="q-back" onClick={onExit}>
            <Fleche dir="left" />
            {tx('Retour aux mondes')}
          </button>
          <span className="v-chip v-chip-done qtv-free">{tx('Gratuite')}</span>
        </div>
        <p className="qtv-eyebrow">{monde.nom.replace(' — ', ' · ').toUpperCase()}</p>
        <div
          className="qtv-seg"
          role="img"
          aria-label={tx('Quête {{n}} sur {{total}}', { n: quete.numero, total: quete.totalDuMonde })}
        >
          {Array.from({ length: quete.totalDuMonde }).map((_, i) => (
            <span key={i} className={i < quete.numero ? 'qtv-seg-on' : undefined} />
          ))}
        </div>
        <p className="qtv-quen" aria-hidden="true">
          {tx('Quête {{n}} sur {{total}}', { n: quete.numero, total: quete.totalDuMonde })}
        </p>
        <div className="qtv-hero">
          <span className="qtv-hero-ico" aria-hidden="true">
            <VoyageIcon name={heroIconMonde(monde.code)} size={38} strokeWidth={1.7} />
          </span>
          <div className="qtv-hero-txt">
            <h1 className="qtv-titre" id="q-title">
              {quete.titre}
            </h1>
            <p className="qtv-sub">{quete.sousTitre}</p>
          </div>
        </div>
        <blockquote className="q-annonce">
          <p>{quete.annonce}</p>
        </blockquote>
        <div className="qtv-stats" role="list" aria-label={tx('La quête en un coup d\'œil')}>
          <div className="qtv-stat" role="listitem">
            <strong>{deck.length}</strong>
            <span>{labelItems}</span>
          </div>
          <div className="qtv-stat" role="listitem">
            <strong>{modalite.n}</strong>
            <span>{modalite.label}</span>
          </div>
          <div className="qtv-stat" role="listitem">
            <strong>0</strong>
            <span>{tx('chronomètre')}</span>
          </div>
        </div>
        <section className="q-sec" aria-label="À quoi sert cette quête">
          <h3>{tx('À quoi sert cette quête')}</h3>
          {quete.briefing.aQuoiCaSert.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </section>
        <section className="q-sec" aria-label={tx('Comment tu vas répondre')}>
          <h3>{tx('Comment tu vas répondre')}</h3>
          {commentRepondreFormat(quete.format, tx, queteId).map((p) => (
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
        {/* Task 71 (demande fondateur A+B+C, briefing 1.1) : note discrète en
            bas du briefing — présente SEULEMENT quand la quête définit le champ. */}
        {quete.briefing.noteDiscrete && (
          <p className="q-brief-note">{quete.briefing.noteDiscrete}</p>
        )}
        {/* Bloc « Voulez-vous commencer ? » — actions en ANCRES <a> (demande fondateur) :
            mêmes styles et mêmes comportements que les boutons, mais de vraies balises
            d'ancre avec un href réel (lien partageable vers la quête / retour mondes).
            onClick + preventDefault ⇒ la logique existante est inchangée. */}
        <div className="q-ask" role="group" aria-label={tx('Voulez-vous commencer ?')}>
          <a className="q-ask-q" href={`#/quete/${queteId}`}>
            {tx('Voulez-vous commencer ?')}
          </a>
          <div className="q-actions">
            {etat.terminee ? (
              <>
                <a
                  className="btn btn-accent"
                  href={`#/quete/${queteId}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setPhase(quete.sansCarte ? 'ecran' : 'carte');
                  }}
                >
                  {quete.sansCarte ? tx('Revoir mon écran') : tx('Revoir ma carte')}
                  <Fleche />
                </a>
                <a
                  className="btn btn-ghost"
                  href="#/mondes"
                  onClick={(e) => {
                    e.preventDefault();
                    onExit();
                  }}
                >
                  {tx('Retour aux mondes')}
                </a>
              </>
            ) : (
              <>
                <a
                  className="btn btn-accent"
                  href={`#/quete/${queteId}`}
                  onClick={(e) => {
                    e.preventDefault();
                    reprendre();
                  }}
                >
                  {peutReprendre ? tx('Reprendre ({{n}} réponses)', { n: repondues }) : tx('Commencer')}
                  <Fleche />
                </a>
                <a
                  className="btn btn-ghost"
                  href="#/mondes"
                  onClick={(e) => {
                    e.preventDefault();
                    onExit();
                  }}
                >
                  {tx('Annuler')}
                </a>
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
    // Monde 5 — les écrans propres du M5 :
    // 4.1 — les 8 items posés → l'écran génogramme (modalité NON COMPTEE du
    // Livrable : structure libre, non scorée, retrait possible ; le code de
    // flux Q4.1-arbre n'entre dans AUCUN score — « Passer » est un chemin
    // complet).
    const ecranArbre41 =
      queteId === '4.1' && repondues === deck.length && etat.reponses[ARBRE_CODE] === undefined;
    // 4.2 — les 18 items posés → l'écran d'écoute (Q4.2-19, hors mélange :
    // facultatif, stockage appareil seul, JAMAIS rendue — interdits V10).
    const ecranOuverte42 =
      queteId === '4.2' && repondues === deck.length && etat.reponses[OUVERTE_CODE] === undefined;
    // 4.3 — la quête ENTIÈRE est la page d'écoute (tâche d'écriture : 1 item
    // ouvert, facultatif, jamais rendu).
    const ecranEcrite43 = queteId === '4.3';
    return (
      <main className="screen q-screen q-run qtv" aria-labelledby="q-run-label">
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
        ) : ecranArbre41 ? (
          // 4.1 — l'écran génogramme (Livrable 4.1 : modalité visuelle NON
          // COMPTEE) — des figures libres, des qualifications libres, aucun
          // nom imposé, retrait possible. Non scoré, jamais rendu hors de cet
          // écran, jamais un arbre « bien fait ». « Passer » est un chemin
          // complet.
          <div className="q-choix q-arbre" role="group" aria-label={tx('Ton arbre relationnel — une conversation, jamais un arbre bien fait')}>
            <h1 className="q-item" id="q-run-label" ref={questionRef} tabIndex={-1}>
              {ARBRE.titre}
            </h1>
            <p className="q-ecran-note">{ARBRE.note}</p>
            {figures.map((f, i) => (
              <div key={`fig-${i}`} className="q-arbre-fig">
                <span className="q-arbre-label">{f.label || tx('Une figure')}</span>
                {f.qualif && <span className="q-arbre-qualif">{f.qualif}</span>}
                <button
                  type="button"
                  className="q-arbre-retirer"
                  onClick={() => setFigures(figures.filter((_, j) => j !== i))}
                >
                  {ARBRE.retirer}
                </button>
              </div>
            ))}
            <label className="q-check-libre">
              <span>{ARBRE.champLabel}</span>
              <input
                type="text"
                value={labelDraft}
                maxLength={120}
                onChange={(e) => setLabelDraft(e.target.value)}
                placeholder={tx('Tes mots à toi — ils ne sortent jamais de cet appareil.')}
              />
            </label>
            <div className="q-arbre-quals" role="group" aria-label={tx('La qualification — un mot libre')}>
              {ARBRE.qualifications.map((q) => (
                <button
                  key={q}
                  type="button"
                  className={qualifDraft === q ? 'q-choix-btn q-choix-btn-on' : 'q-choix-btn'}
                  aria-pressed={qualifDraft === q}
                  onClick={() => setQualifDraft(qualifDraft === q ? '' : q)}
                >
                  {q}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="btn btn-ghost q-choix-valider"
              onClick={() => {
                if (labelDraft.trim().length > 0 || qualifDraft.trim().length > 0) {
                  setFigures([...figures, { label: labelDraft.trim(), qualif: qualifDraft.trim() }]);
                  setLabelDraft('');
                  setQualifDraft('');
                }
              }}
            >
              {ARBRE.ajouter}
            </button>
            <button
              type="button"
              className="btn btn-accent q-choix-valider"
              onClick={() => {
                const finales =
                  labelDraft.trim().length > 0 || qualifDraft.trim().length > 0
                    ? [...figures, { label: labelDraft.trim(), qualif: qualifDraft.trim() }]
                    : figures;
                enregistrerTexte(queteId, ARBRE_CODE, serialiserArbre(finales));
                enregistrerReponse(queteId, ARBRE_CODE, 1);
              }}
            >
              {ARBRE.continuer}
              <Fleche />
            </button>
            <button
              type="button"
              className="btn btn-ghost q-choix-valider"
              onClick={() => {
                enregistrerTexte(queteId, ARBRE_CODE, '');
                enregistrerReponse(queteId, ARBRE_CODE, 0);
              }}
            >
              {ARBRE.passer}
            </button>
            <p className="q-ecran-note">{ARBRE.noteFin}</p>
          </div>
        ) : ecranOuverte42 ? (
          // 4.2 — l'écran d'écoute (Q4.2-19, hors mélange : facultatif,
          // « Je préfère ne pas dire » = saut sans pénalité — interdits V10 :
          // la réponse n'est JAMAIS rendue, stockage appareil seul).
          <div className="q-choix q-ouverte" role="group" aria-label={tx("La page d'écoute — si tu veux")}>
            <h1 className="q-item" id="q-run-label" ref={questionRef} tabIndex={-1}>
              {OUVERTE.titre}
            </h1>
            <label className="q-check-libre">
              <textarea
                value={etat.textes?.[OUVERTE_CODE] ?? ''}
                maxLength={500}
                rows={4}
                onChange={(e) => enregistrerTexte(queteId, OUVERTE_CODE, e.target.value)}
                placeholder={tx('Tes mots à toi — ils ne sont jamais reformulés.')}
              />
            </label>
            <button
              type="button"
              className="btn btn-accent q-choix-valider"
              disabled={(etat.textes?.[OUVERTE_CODE] ?? '').trim().length === 0}
              onClick={() => enregistrerReponse(queteId, OUVERTE_CODE, 1)}
            >
              {OUVERTE.valider}
              <Fleche />
            </button>
            <button
              type="button"
              className="btn btn-ghost q-choix-valider"
              onClick={() => {
                enregistrerTexte(queteId, OUVERTE_CODE, '');
                enregistrerReponse(queteId, OUVERTE_CODE, 0);
              }}
            >
              {OUVERTE.retrait}
            </button>
            <p className="q-ecran-note">{OUVERTE.note}</p>
            <p className="q-ecran-note">{OUVERTE.noteRetrait}</p>
          </div>
        ) : ecranEcrite43 ? (
          // 4.3 — LA page d'écoute (la quête entière : tâche d'écriture,
          // 1 item ouvert, facultative — retrait sans pénalité, interdits
          // V10 : la réponse n'est JAMAIS rendue, stockage appareil seul,
          // aucune analyse à l'écran).
          <div className="q-choix q-ouverte" role="group" aria-label={tx("Ta page — une question, un champ libre")}>
            <h1 className="q-item" id="q-run-label" ref={questionRef} tabIndex={-1}>
              {item.text}
            </h1>
            <label className="q-check-libre">
              <textarea
                value={etat.textes?.[OUVERTE_43] ?? ''}
                maxLength={500}
                rows={5}
                onChange={(e) => enregistrerTexte(queteId, OUVERTE_43, e.target.value)}
                placeholder={tx('Tes mots à toi — ils ne sont jamais reformulés.')}
              />
            </label>
            <button
              type="button"
              className="btn btn-accent q-choix-valider"
              disabled={(etat.textes?.[OUVERTE_43] ?? '').trim().length === 0}
              onClick={() => enregistrerReponse(queteId, OUVERTE_43, 1)}
            >
              {ECRAN_ECRITE.valider}
              <Fleche />
            </button>
            <button
              type="button"
              className="btn btn-ghost q-choix-valider"
              onClick={() => {
                enregistrerTexte(queteId, OUVERTE_43, '');
                enregistrerReponse(queteId, OUVERTE_43, 0);
              }}
            >
              {RETRAIT_43}
            </button>
            <p className="q-ecran-note">{ECRAN_ECRITE.note}</p>
            <p className="q-ecran-note">{ECRAN_ECRITE.noteRetrait}</p>
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
              <span>{tx('Une autre ligne rouge, dans tes mots — ou laisse vide.')}</span>
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
          (() => {
            // 2.6 — UN écran (Livrable) : 5 curseurs 0-100, VERROU DE SOMME
            // effectif via gesteArbitrage26 (Livrable 04 n°1), AUCUNE valeur
            // par défaut (les curseurs s'enregistrent au geste).
            // « Valider » pose TOUTES les valeurs puis le gate Q2.6-valide —
            // aucune sortie partielle. Le statut nomme les trois états :
            // posés / reste N / dépassement (états hérités d'avant le verrou).
            const total26 = AXES_26.reduce((s, a) => s + (etat.reponses[a.code] ?? 0), 0);
            const reste26 = 100 - total26;
            return (
              <div className="q-choix q-arbitrage" role="group" aria-label={tx('Tes priorités — cent points à répartir sur cinq horizons')}>
                <h1 className="q-item" id="q-run-label" ref={questionRef} tabIndex={-1}>
                  {tx('Cent points. Cinq horizons.')}
                </h1>
                <p className="q-arb-hint">{tx('Quand tu montes un curseur, les autres descendent — la somme reste à 100.')}</p>
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
                        aria-label={a.nom}
                        aria-valuetext={`${pts} / 100`}
                        onChange={(e) => gesteArbitrage26(queteId, a.code, Number(e.target.value), etat.reponses)}
                      />
                    </div>
                  );
                })}
                <div className={reste26 < 0 ? 'q-arb-total q-arb-total--trop' : 'q-arb-total'} role="status">
                  {reste26 === 0
                    ? tx('Les cent points sont posés.')
                    : reste26 > 0
                      ? tx('Il reste {{n}} points à répartir.', { n: reste26 })
                      : tx('Tu as réparti {{n}} points — il en faut exactement 100 : baisse un ou plusieurs curseurs.', { n: total26 })}
                </div>
                <button
                  type="button"
                  className="btn btn-accent q-choix-valider"
                  disabled={reste26 !== 0}
                  onClick={() => {
                    AXES_26.forEach((a) => enregistrerReponse(queteId, a.code, etat.reponses[a.code] ?? 0));
                    enregistrerReponse(queteId, 'Q2.6-valide', 1);
                  }}
                >
                  {tx('Valider ma répartition')}
                  <Fleche />
                </button>
                {reste26 !== 0 && (
                  <p className="q-arb-aide">{tx("Le bouton Valider s'allume quand les cent points sont posés.")}</p>
                )}
              </div>
            );
          })()
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
            {item.format === 'images' && (
              <div className="q-img" role="group" aria-label={tx('Ton choix — deux scènes, la même valeur')}>
                {([
                  [1, item.choixA, item.images?.[0]] as const,
                  [2, item.choixB, item.images?.[1]] as const,
                ]).map(([reponse, label, visuel]) => (
                  <button
                    key={reponse}
                    type="button"
                    className={valeur === reponse ? 'q-img-btn q-img-btn-on' : 'q-img-btn'}
                    onClick={() => repondre(item.code, reponse)}
                  >
                    {visuel && (
                      <img src={visuel} alt="" aria-hidden="true" loading="lazy" className="q-img-visuel" />
                    )}
                    <span className="q-img-label">{interpolerMontants(label ?? '', money)}</span>
                  </button>
                ))}
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
                  // Garde 3.7 (1-3 options) : quand trois options sont posées,
                  // les autres se désactivent — le 4ᵉ toggle ne répond plus
                  // (jamais une validation punitive).
                  const plein =
                    queteId === '3.7' && !on && compteSelections37(valeur ?? 0) >= GARDE_MAX_37;
                  // Task 95 → 96 (demande fondateur) — 1.7 : la case affiche la
                  // phrase simple SEULE. AUCUN mot technique dans la liste (« les
                  // gens ne vont pas cocher ce qu'ils ne comprennent pas ») — le
                  // « ? » ouvre le pop-up qui nomme et décode le mot en clair.
                  // Structure GELÉE : 6 options, mêmes positions, bitmask inchangé.
                  const explic =
                    queteId === '1.7' && item.code === 'Q1.7-01' ? (EXPLIQUES_17[i] ?? null) : null;
                  const btn = (
                    <button
                      type="button"
                      className={on ? 'q-choix-btn q-choix-btn-on' : 'q-choix-btn'}
                      aria-pressed={on}
                      disabled={plein}
                      onClick={() => enregistrerReponse(queteId, item.code, (valeur ?? 0) ^ bit)}
                    >
                      {interpolerMontants(opt, money)}
                    </button>
                  );
                  if (!explic) return btn;
                  return (
                    <div className="q17-ligne" key={opt}>
                      {btn}
                      <button
                        type="button"
                        className="q17-info"
                        aria-label={tx('Expliquer cette phrase')}
                        onClick={() => setInfo17(i)}
                      >
                        ?
                      </button>
                    </div>
                  );
                })}
                {queteId === '1.7' && item.code === 'Q1.7-01' && (
                  <button type="button" className="q17-lien" onClick={() => setInfo17('tous')}>
                    {tx('Des mots pas clairs ? Voir les explications simples')}
                  </button>
                )}
                {queteId === '1.7' &&
                  item.code === 'Q1.7-01' &&
                  ((valeur ?? 0) & (1 << 4)) !== 0 && (
                    <label className="q-check-libre q17-libre">
                      <span>{tx('Tes mots, si les cases ne suffisent pas — tu peux aussi laisser vide.')}</span>
                      <textarea
                        value={etat.textes?.[TEXTE_LIBRE_17] ?? ''}
                        maxLength={500}
                        rows={3}
                        onChange={(e) => enregistrerTexte(queteId, TEXTE_LIBRE_17, e.target.value)}
                        placeholder={tx('Écris librement — tes mots ne sont jamais reformulés.')}
                      />
                    </label>
                  )}
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
        {info17 !== null && <InfoFonctionnement index={info17} onClose={() => setInfo17(null)} />}
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
        <main className="screen q-screen qtv" aria-labelledby="q-ecran-title">
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
    // 3.7 « Tes attirances » — l'écran final PRIVÉ (aucune restitution des
    // choix — contrairement à l'écran de confiance 1.7 ; doctrine gravée).
    if (queteId === '3.7') {
      const laSuite37 = quete.suivante ? QUETES[quete.suivante] : null;
      return (
        <main className="screen q-screen qtv" aria-labelledby="q-ecran-title">
          <div className="q-carte" role="region" aria-label={tx('Ton écran')}>
            <p className="q-carte-entete">{quete.completion.entete}</p>
            <h1 className="q-carte-nom" id="q-ecran-title">
              {ECRAN_FINAL_37.titre}
            </h1>
            <p className="q-carte-lumiere">{ECRAN_FINAL_37.texte}</p>
            <div className="q-carte-actions">
              {laSuite37 ? (
                <button type="button" className="btn btn-accent" onClick={() => onAllerQuete(laSuite37.id)}>
                  {quete.suite.cta ?? tx('Continuer le voyage')}
                  <Fleche />
                </button>
              ) : (
                <button type="button" className="btn btn-accent" onClick={onHome}>
                  {tx('Retour à mon voyage')}
                  <Fleche />
                </button>
              )}
              <button type="button" className="btn btn-ghost" onClick={onExit}>
                {tx('Retour aux mondes')}
              </button>
            </div>
            <p className="q-carte-hint">
              {tx('Tes déclarations restent sur cet appareil — tu peux les modifier ou tout effacer depuis « Voulez-vous commencer ? ».')}
            </p>
          </div>
        </main>
      );
    }
    // 4.3 « Ce que tes relations t'ont appris » — l'écran final simple et
    // bienveillant (Livrable 4.3 : exemption carte, écran de clôture sans
    // AUCUN rappel du contenu écrit).
    if (queteId === '4.3') {
      const laSuite43 = quete.suivante ? QUETES[quete.suivante] : null;
      return (
        <main className="screen q-screen qtv" aria-labelledby="q-ecran-title">
          <div className="q-carte" role="region" aria-label={tx('Ton écran')}>
            <p className="q-carte-entete">{quete.completion.entete}</p>
            <h1 className="q-carte-nom" id="q-ecran-title">
              {ECRAN_FINAL_43.titre}
            </h1>
            <p className="q-carte-lumiere">{ECRAN_FINAL_43.texte}</p>
            <div className="q-carte-actions">
              {laSuite43 ? (
                <button type="button" className="btn btn-accent" onClick={() => onAllerQuete(laSuite43.id)}>
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
              {tx('Ta page reste sur cet appareil — jamais citée, jamais montrée.')}
            </p>
          </div>
        </main>
      );
    }
    const ecran = queteId === '1.7' ? ECRAN_17 : SORTIES_111[chemin111(etat.reponses)];
    const laSuite = quete.suivante ? QUETES[quete.suivante] : null;
    return (
      <main className="screen q-screen qtv" aria-labelledby="q-ecran-title">
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
                // Task 95 — les mots de « Autre chose me décrit » voyagent avec
                // les cases cochées (les mots de la personne, jamais reformulés).
                const mots17 =
                  it.code === 'Q1.7-01' ? (etat.textes?.[TEXTE_LIBRE_17] ?? '').trim() : '';
                const contenu17 = [...labels, ...(mots17 ? [mots17] : [])];
                return (
                  <p key={it.code} className="q-ecran-ligne">
                    <strong>{it.text}</strong>
                    <br />
                    {contenu17.length > 0
                      ? contenu17.join(' · ')
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
    // Task 66 — la suite est gated : sans réponse, retour au champ avec sa
    // notice polie — Task 78 : l'action est RETENUE, « Passer » l'exécute.
    const allerLaSuite = () => {
      if (gateAvis) {
        bloquerPourAvis(suivante ? 'suite' : 'home');
        return;
      }
      if (suivante) onAllerQuete(suivante.id);
      else onHome();
    };
    // Task 66 v2 — « Revenir à ma carte » (haut et bas de page) fait partie
    // des actions bloquées : redirection vers le champ de réponse + notice.
    const revenirCarte = () => {
      if (gateAvis) {
        bloquerPourAvis('carte');
        return;
      }
      setPhase('carte');
    };
    // Task 78 — « Passer » : la réponse n'est plus obligatoire. Le marqueur
    // local éteint la gate et l'action interrompue s'exécute tout de suite.
    const passerAvis = () => {
      marquerAvisPasse(queteId);
      setAvisPasse(true);
      setAvisDemande(false);
      const action = actionBloqueeRef.current;
      actionBloqueeRef.current = null;
      if (action === 'suite' && suivante) onAllerQuete(suivante.id);
      else if (action === 'home') onHome();
      else if (action === 'carte') setPhase('carte');
    };
    // Task 77 — les sources des champs de ce profil (mécanique, lecture seule).
    const sources = sourcesDeQuete(queteId, carte.id, etat.reponses);
    // Task 78 — FUSION OMBRE → « EN COUPLE » : le « Ton risque / Ce qui aide »
    // arrive sous le paragraphe couple, la section séparée disparaît (les
    // sources des deux champs fusionnent, dédupliquées). L'écho des freines
    // (« Et tes réponses le disent : … ») complète « Là où ça peut se
    // compliquer » avec les réponses réelles.
    const fusionOmbre = QUETES_FUSION_OMBRE.has(queteId);
    const ombreParas = fusionOmbre
      ? (typeof quete.ombreRelationnel[carte.id] === 'string'
          ? (quete.ombreRelationnel[carte.id] as string).split('\n\n').filter((p) => p.trim().length > 0)
          : [])
      : [];
    const sourcesCoupleFusion = fusionOmbre
      ? [...sources.couple, ...sources.ombre.filter((l) => !sources.couple.some((c) => c.code === l.code))]
      : sources.couple;
    const echoFreines = echoFreinesDe(queteId, carte.id, etat.reponses);
    const nomDim = (k: string): string => quete.dims.find((d) => d.key === k)?.nom ?? k;
    const blocSources = (lignes: LigneSource[]) =>
      lignes.length === 0 ? null : (
        <div className="q-src">
          <p className="q-src-titre">{tx("D'après tes réponses :")}</p>
          <ul>
            {lignes.map((l) => (
              <li key={l.code}>
                <span className="q-src-dim">{nomDim(l.dim)}</span>
                {' — '}
                <span className="q-det-ancrage-enonce">« {l.enonce} »</span>
                {' · '}
                <strong>{l.reponse}</strong>
              </li>
            ))}
          </ul>
        </div>
      );

    return (
      <main className="screen q-screen q-det qtv" aria-labelledby="q-det-title">
        <button type="button" className="q-back" onClick={revenirCarte}>
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
        {/* Task 74 (demande fondateur) — le sous-titre du fondateur :
            « {titre}, d'après tes réponses ». */}
        <p className="screen-sub">
          {tx("{{titre}}, d'après tes réponses", { titre: quete.titre })}
        </p>

        <section className="q-sec q-profil" aria-label={tx('Ton portrait')}>
          <p className="q-profil-intro">{arche.intro}</p>
          <p className="q-profil-devise">
            <strong>{tx('En résumé :')}</strong> « {arche.devise} »
          </p>
        </section>

        <section className="q-sec q-profil-bloc" aria-label={tx('Ta force')}>
          <h3>{tx('Ta force')}</h3>
          <p>{arche.apportes}</p>
          {blocSources(sources.force)}
        </section>

        <section className="q-sec q-profil-bloc" aria-label={tx('Là où ça peut se compliquer')}>
          <h3>{tx('Là où ça peut se compliquer')}</h3>
          {/* Task 78 — l'écho des réponses (« Et tes réponses le disent : … »)
              s'ajoute au texte : la preuve intégrée au propos, pas à part. */}
          <p>
            {arche.freines}
            {echoFreines && <> {echoFreines}</>}
          </p>
          {blocSources(sources.freines)}
        </section>

        <section className="q-sec q-profil-bloc" aria-label={tx('En couple')}>
          <h3>{tx('En couple')}</h3>
          {/* Task 78 — FUSION : l'ouverture + « Ton risque : … » dans un
              premier paragraphe, « Ce qui aide : … » dans le second — le même
              risque n'est plus dit trois fois. */}
          <p>
            {arche.couple}
            {ombreParas[0] && <> {ombreParas[0]}</>}
          </p>
          {ombreParas[1] && <p>{ombreParas[1]}</p>}
          {blocSources(sourcesCoupleFusion)}
        </section>

        <section className="q-sec q-profil-bloc" aria-label={tx('Ce que ce profil te souffle')}>
          <h3>{tx('Ce que ce profil te souffle')}</h3>
          <p>{arche.equilibre}</p>
          {blocSources(sources.equilibre)}
        </section>

        <section className="q-sec q-profil-tendances" aria-label={titreTendances(apercu.bars.length)}>
          {/* Task 74 — le pictogramme miroir est un SVG (VoyageIcon) : l'emoji
              🪞 (Unicode 13) s'affiche en carré vide sur beaucoup d'appareils
              — retour fondateur « encore comme un carré vide ». */}
          <h3 className="q-tend-titre">
            <VoyageIcon name="mirror" size={19} strokeWidth={2.2} />
            {titreTendances(apercu.bars.length)}
          </h3>
          <div className="q-det-bars">
            {apercu.bars.map((b) => {
              // Task 78 — la carte cite ce que la personne a VRAIMENT répondu
              // (« ce que tu as répondu, ce que ça dit, un petit pas ») ; le
              // texte de palier reste le repli du cas tout-milieu.
              const texteTendance = texteTendanceDe(queteId, b.key, etat.reponses, b.texte) ?? b.texte;
              return (
              <div key={b.key} className="q-det-dim">
                <div className="q-det-dim-head">
                  <span className="q-det-dim-nom">{b.nom}</span>
                  {/* Task 74 (demande fondateur) — « nom · 75/100 · palier » :
                      la formulation du fondateur remplace « nom — 75/100
                      (palier) ». */}
                  <span className="q-det-dim-niveau" data-palier={b.palier}>
                    · {b.pct}/100 · {b.palierLabel}
                  </span>
                </div>
                <div className="q-bar" role="img" aria-label={`${b.nom} : ${b.pct} sur 100`}>
                  <span className="q-bar-fill" data-palier={b.palier} style={{ width: `${Math.max(b.pct, 2)}%` }} />
                </div>
                <p className="q-det-dim-texte">{texteTendance}</p>
                {/* Task 65 — les réponses RÉELLES qui pèsent le plus dans le
                    chiffre : le membre vérifie lui-même sa tendance.
                    Task 78 — repliées derrière « Voir mes réponses » : le bloc
                    ouvert recouvrait le texte de la carte au-dessus.
                    Task 79 (retour fondateur) — les mentions « fait monter /
                    baisser la barre » sont retirées : elles exposaient la
                    mécanique du score au lieu de la décrire. La ligne lit
                    simplement « énoncé · réponse ». */}
                {ancrages && (ancrages[b.key]?.length ?? 0) > 0 && (
                  <details className="q-det-reponses">
                    <summary>{tx('Voir mes réponses')}</summary>
                    <div className="q-det-ancrage">
                      <p className="q-det-ancrage-titre">
                        {tx('Ce qui pèse dans ce score')}
                      </p>
                      <ul>
                        {ancrages[b.key].map((a) => (
                          <li key={a.code}>
                            <span className="q-det-ancrage-enonce">« {a.enonce} »</span>
                            {' · '}
                            <strong>{a.reponse}</strong>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </details>
                )}
              </div>
              );
            })}
          </div>
          <p className="q-profil-nota">{NOTA_BARRES}</p>
        </section>

        {/* Task 65 — LA ZONE D'OMBRE EN RELATION : rendue seulement quand le
            texte existe ET que la quête n'est pas en fusion ombre → « En
            couple » (Task 78 : le risque vit déjà dans la section couple). */}
        {(() => {
          if (fusionOmbre) return null;
          const ombreRel = quete.ombreRelationnel[carte.id];
          if (typeof ombreRel !== 'string' || ombreRel.length === 0) return null;
          return (
            <section className="q-sec q-ombre-rel" aria-label={tx('Ta zone d\'ombre en relation')}>
              <h3>{tx('Ta zone d\'ombre en relation')}</h3>
              {/* Task 74 — le texte du fondateur (V1) arrive en DEUX
                  paragraphes (séparateur \n\n) : « le risque » puis « ce qui
                  aide ». Un seul <p> rendu quand il n'y a pas de séparation. */}
              {ombreRel
                .split('\n\n')
                .filter((p) => p.trim().length > 0)
                .map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              {blocSources(sources.ombre)}
            </section>
          );
        })()}

        {/* Task 66 — TON AVIS COMPTE : la barre de satisfaction. Task 78 —
            la suite n'est plus bloquée : le lien « Passer » du champ exécute
            l'action interrompue. Task 79 (retour fondateur) — quand une
            action est renvoyée ici, la notice devient une VRAIE info-bulle :
            elle dit ce qu'on attend (« Donne ton avis avant de continuer
            la quête ») et pointe le champ en dessous. */}
        {QUETES_AVEC_AVIS.has(queteId) && (
          <div className="q-sat-ancre" ref={ancreAvisRef}>
            {gateAvis && avisDemande && (
              <aside className="q-sat-notice" role="status">
                <strong>{tx('Donne ton avis avant de continuer la quête.')}</strong>
                <p>{tx('Choisis une réponse juste en dessous — ou passe. Tes résultats ne changent pas.')}</p>
              </aside>
            )}
            <SatBarAvis
              queteId={queteId}
              onAvis={(a) => {
                setAvis(a);
                setAvisDemande(false);
              }}
              onPasse={gateAvis ? passerAvis : undefined}
            />
          </div>
        )}

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
              <button type="button" className="btn btn-accent" onClick={allerLaSuite}>
                {quete.suite.cta ?? tx('Continuer le voyage')}
                <Fleche />
              </button>
            ) : (
              <button type="button" className="btn btn-accent" onClick={allerLaSuite}>
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
            <button type="button" className="btn btn-ghost" onClick={revenirCarte}>
              {tx('Revenir à ma carte')}
            </button>
            <p className="q-carte-hint">
              {tx("Ton document reste sur ton appareil. Rien n'est envoyé.")}
            </p>
          </div>
        </section>
      </main>
    );
  }

  // ------------------------------------------------------------------- carte
  const carte = etat.carteId && quete.cartes[etat.carteId] ? quete.cartes[etat.carteId] : quete.cartes[quete.choisirVariante(quete.scorer(etat.reponses))];
  const suivante = quete.suivante ? QUETES[quete.suivante] : null;
  // Task 66 v2 — depuis la carte aussi, la suite est gated (retour fondateur :
  // « Retour à mon voyage » comme « Attaquer la quête suivante » amènent au
  // champ de réponse, avec sa notice polie — Task 78 : « Passer » exécute
  // l'action retenue).
  const allerDetailsPourAvis = (action: 'suite' | 'home') => {
    setPhase('details');
    bloquerPourAvis(action);
  };
  const quitterCarte = () => {
    if (gateAvis) {
      allerDetailsPourAvis('home');
      return;
    }
    onHome();
  };
  const attaquerSuite = () => {
    if (gateAvis) {
      allerDetailsPourAvis('suite');
      return;
    }
    if (suivante) onAllerQuete(suivante.id);
  };
  return (
    <main className="screen q-screen qtv" aria-labelledby="q-carte-title">
      <div className="q-carte" role="region" aria-label={tx('Ta carte')}>
        <p className="q-carte-entete">{quete.completion.entete}</p>
        <h1 className="q-carte-nom" id="q-carte-title">
          {carte.nom}
        </h1>
        {queteId === '3.1' && (BADGES_31[carte.id as keyof typeof BADGES_31] ?? '') !== '' && (
          <p className="q-carte-badge" role="note" aria-label={tx('Badge de conversation')}>
            <span className="q-carte-badge-emo" aria-hidden="true">
              {BADGES_31[carte.id as keyof typeof BADGES_31]}
            </span>{' '}
            {tx('Ton badge de conversation — un pont pour en parler, jamais un grade.')}
          </p>
        )}
        <p className="q-carte-lumiere">{carte.lumiere}</p>
        <div className="q-carte-sec">
          <h3>{quete.completion.labelOmbre}</h3>
          <p>{carte.ombre}</p>
        </div>
        {queteId === '3.6' && (
          <div className="q-carte-sec q-amorces" role="region" aria-label={tx('Tes amorces de conversation')}>
            <h3>{tx('Tes amorces de conversation')}</h3>
            <ul className="q-amorces-liste">
              {AMORCES.map((a) => (
                <li key={a.id}>{a.texte}</li>
              ))}
            </ul>
            <p className="q-amorces-note">{tx('Des débuts de conversation, si tu veux — jamais un test.')}</p>
          </div>
        )}
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
          <button type="button" className="btn btn-ghost" onClick={quitterCarte}>
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
          <button type="button" className="btn btn-accent" onClick={attaquerSuite}>
            {tx('Attaquer la quête suivante')}
            <Fleche />
          </button>
        </div>
      ) : (
        <div className="q-next q-next-end" role="region" aria-label={tx('Et maintenant ?')}>
          <p className="q-next-kicker">{tx('Et maintenant ?')}</p>
          <h2 className="q-next-titre">
            {quete.id === '1.3'
              ? tx('Le miroir — la suite de ton monde')
              : tx(quete.suite.titre)}
          </h2>
          {quete.completion.miroirNote && <p className="q-next-note">{quete.completion.miroirNote}</p>}
          {quete.id === '1.3' ? (
            <p className="q-next-note">
              {tx("Tu as terminé les trois quêtes ouvertes du Miroir : ta personnalité, ta façon de t'attacher, tes émotions — trois cartes qui se répondent.")}
            </p>
          ) : (
            <p className="q-next-note">{quete.suite.intro}</p>
          )}
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
