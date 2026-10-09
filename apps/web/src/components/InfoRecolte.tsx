/**
 * LE POP-UP EXPLICATIF D'UNE RÉCOLTE — « à quoi ça sert dans les rencontres ».
 *
 * DEMANDE FONDATEUR (Task 45) : « chaque récolte devra constituer un élément
 * cliquable dans lequel, lorsqu'on clique dessus, un pop-up apparaît pour
 * expliquer à quoi servira l'élément qui a été récolté, le gain récolté.
 * Si c'est un badge, si c'est un crédit ou si c'est une carte, etc., cela
 * devra expliquer à quoi cela va servir lorsqu'il sera dans la plateforme
 * de rencontre. »
 *
 * Un SEUL composant pour TOUS les types (carte, écran de passage, fragment,
 * sceau, pass, crédits, récolte du mois, niveau du voyage) : l'enregistrement
 * REGISTRE porte l'icône, la couleur, l'intitulé et la copie de chaque type —
 * intro (ce que c'est) · points (ce que ça fait sur la plateforme de
 * rencontre) · garde (ce que ce n'est PAS — jamais un score, jamais un
 * achat de compatibilité, règle §16).
 *
 * A11Y : même contrat que WorldModal (role=dialog, focus initial sur ×, piège
 * Tab, Échap, clic fond, focus restitué, body no-scroll).
 *
 * Apostrophes U+0027 (audit Task 25).
 */

import { useEffect, useRef } from 'react';
import VoyageIcon from './VoyageIcons';
import type { VoyageIconName } from './VoyageIcons';
import { useI18n } from '../i18n/I18nProvider';
import { formaterPrixFacturation } from '../i18n/currency';

/** Les types de récolte expliquables — alignés sur lib/notifs.ts. */
export type TypeRecolte =
  | 'carte'
  | 'ecran'
  | 'fragment'
  | 'sceau'
  | 'pass'
  | 'credit'
  | 'mois'
  | 'jalon';

/** L'élément de récolte à expliquer — le même objet partout dans l'app. */
export interface ItemRecolte {
  type: TypeRecolte;
  /** Le nom verbatim (carte : « L'Étoile sociale »). */
  nom?: string;
  /** Le titre de la quête d'origine (carte). */
  titre?: string;
  /** La date réelle d'obtention (ISO). */
  date?: string | null;
  /** Le mois du voyage d'origine (1-11). */
  mondeNum?: number;
  mondeCode?: string;
  /** Le lien résultats (cartes — quête d'origine). */
  queteId?: string;
  /** Le niveau du voyage (type 'jalon' — 1-6). */
  jalonNum?: number;
  /** Le contenu RÉEL du mois (lignes préparées par l'écran appelant). */
  contenu?: string[];
  /** Le mois est traversé (type 'mois' — copie passée vs promesse). */
  traverse?: boolean;
}

interface RegistreEntree {
  ico: VoyageIconName;
  bg: string;
  fg: string;
  /** L'intitulé du type (clé i18n FR). */
  label: string;
  /** L'intro (ce que c'est) — clé i18n FR. */
  intro: string;
  /** Ce que ça fait sur la plateforme de rencontre — clés i18n FR. */
  points: readonly string[];
  /** Ce que ce n'est PAS — la garde honnête. */
  garde: string;
}

/** Le registre des explications — LA copie « plateforme de rencontre ». */
const REGISTRE: Record<TypeRecolte, RegistreEntree> = {
  carte: {
    ico: 'gem',
    bg: '#fff3d6',
    fg: '#e8a312',
    label: 'Carte-découverte',
    intro: 'La réponse de ton voyage à une question sur toi — ta lumière, ton ombre, ta tension.',
    points: [
      'Elle nourrit ton Portrait : c\u2019est lui qui travaille tes compatibilités — de façon expliquée, jamais notée.',
      'Elle donne à l\u2019autre un vrai point de départ pour t\u2019aborder : une tendance à te ressembler, pas une étiquette.',
      'Tu décides de ce qui est visible et du moment — rien n\u2019apparaît sans toi.',
    ],
    garde: 'Ce n\u2019est ni un score, ni un diagnostic : une tendance mesurée sur tes réponses.',
  },
  ecran: {
    ico: 'signpost',
    bg: '#e4f4e4',
    fg: '#3e9d5b',
    label: 'Écran de passage',
    intro: 'Une étape du parcours qui ne produit pas de carte — elle produit de la confiance.',
    points: [
      'Ces écrans jalonnent le chemin entre deux découvertes.',
      'Ce que tu y poses prépare la suite de ton portrait — et reste à toi.',
    ],
    garde: 'Un écran de passage ne juge rien : il te fait avancer.',
  },
  fragment: {
    ico: 'layers',
    bg: '#dff3f4',
    fg: '#2a9aa0',
    label: 'Fragment de portrait',
    intro: 'La pièce du portrait que ce mois du voyage t\u2019a donnée.',
    points: [
      'Assemblés, tes fragments composent ton Portrait — ce que voient en premier les personnes compatibles avec toi.',
      'Chaque mois traversé ajoute une pièce : plus tu avances, plus ton portrait te ressemble.',
    ],
    garde: 'Ton portrait se lit comme une histoire — jamais comme une fiche à cocher.',
  },
  sceau: {
    ico: 'star',
    bg: '#f3e8f8',
    fg: '#9c4dd3',
    label: 'Sceau du monde',
    intro: 'La marque du mois que tu as traversé.',
    points: [
      'Permanent et non consommable : il reste à toi, sans jamais révéler tes réponses.',
      'Sur la plateforme, il témoigne de ton parcours — un profil qui voyage inspire confiance.',
    ],
    garde: 'Un sceau ne s\u2019achète pas et ne se perd pas : il se traverse.',
  },
  pass: {
    ico: 'signpost',
    bg: '#e4f4e4',
    fg: '#3e9d5b',
    label: 'Pass',
    intro: 'Un pass facilite une action précise de la plateforme.',
    points: [
      'Exemple : explorer une possibilité supplémentaire dans Découvrir.',
      'Chaque pass affichera ce qu\u2019il permet et combien il en reste.',
    ],
    garde: 'Un pass n\u2019achète jamais une meilleure compatibilité — les rencontres se construisent par le voyage.',
  },
  credit: {
    ico: 'star',
    bg: '#fff3d6',
    fg: '#e8a312',
    label: 'Crédits',
    intro: 'Une réserve d\u2019actions pour la plateforme.',
    points: [
      'Certaines interactions se paieront en crédits — gagnés en voyageant.',
      'Ton solde, tes gains et tes usages s\u2019afficheront dans ta récolte.',
    ],
    garde: 'Les crédits ne s\u2019échangent jamais contre une meilleure compatibilité.',
  },
  mois: {
    ico: 'map',
    bg: '#dff3f4',
    fg: '#2a9aa0',
    label: 'Récolte du mois',
    intro: 'Un mois du voyage — ses découvertes, son fragment, son sceau.',
    points: [
      'Chaque mois construit une pièce de ton portrait — la vraie monnaie de tes rencontres.',
      'Traversé, un mois te laisse des cartes, un fragment et un sceau.',
    ],
    garde: 'Un mois s\u2019ouvre après l\u2019autre : le voyage reste la clé de tout.',
  },
  jalon: {
    ico: 'star',
    bg: '#fde9e6',
    fg: '#f56b53',
    label: 'Niveau du voyage',
    intro: 'Un niveau de ta récolte — ce qu\u2019il débloque pour toi.',
    points: [],
    garde: 'Un niveau se franchit en voyageant — il ne s\u2019achète pas.',
  },
};

/** Les intros par niveau (1-6) — la hiérarchie des grandes récoltes. */
const JALON_INTRO: Record<number, string> = {
  1: 'Ta Carte du voyage — le tableau de bord de ton parcours.',
  2: 'Ton premier portrait : ton fonctionnement renvoyé en toutes lettres.',
  3: 'La synthèse d\u2019un mois entier de découvertes.',
  4: 'Les grandes zones de ta vie relationnelle, domaine par domaine.',
  5: 'Le portrait complet — celui qui travaille pour toi dans les rencontres.',
  6: 'La destination : rencontrer des personnes avec qui ça a du sens.',
};

const JALON_POINT: Record<number, string> = {
  1: 'Elle te montre où tu en es et ce que chaque mois t\u2019a donné.',
  2: 'C\u2019est la base que le reste du voyage vient préciser.',
  3: 'Le portrait d\u2019un territoire de toi, lisible d\u2019un coup d\u2019œil.',
  4: 'Chaque domaine approfondit ce que le matching peut comprendre de toi.',
  5: 'La pièce maîtresse : ton parcours entier, assemblé.',
  6: 'La Rencontre n\u2019est jamais payante — elle se franchit en voyageant.',
};

/** Traduit une notification du journal en élément expliquable (panneau cloche). */
export function itemDeNotif(n: { type: string; mois: number; nom?: string; date: string }): ItemRecolte {
  const type = (['carte', 'ecran', 'fragment', 'sceau'] as const).includes(n.type as 'carte')
    ? (n.type as 'carte' | 'ecran' | 'fragment' | 'sceau')
    : 'mois';
  return {
    type,
    ...(n.nom ? { nom: n.nom } : {}),
    date: n.date,
    mondeNum: n.mois,
  };
}

export default function InfoRecolteModal({ item, onClose }: { item: ItemRecolte; onClose: () => void }) {
  const { tx, lang, devise } = useI18n();
  const refModal = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const declencheur = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const modal = refModal.current;
    const fermer = modal?.querySelector<HTMLButtonElement>('.ri-fermer');
    fermer?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === 'Tab' && modal) {
        const focusables = Array.from(
          modal.querySelectorAll<HTMLElement>(
            'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
          ),
        );
        if (focusables.length === 0) return;
        const premier = focusables[0];
        const dernier = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === premier) {
          e.preventDefault();
          dernier.focus();
        } else if (!e.shiftKey && document.activeElement === dernier) {
          e.preventDefault();
          premier.focus();
        }
      }
    };

    document.addEventListener('keydown', onKey);
    document.body.classList.add('no-scroll');
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.classList.remove('no-scroll');
      declencheur?.focus();
    };
  }, [onClose]);

  const r = REGISTRE[item.type];
  const dateCourte = (() => {
    if (!item.date) return null;
    try {
      return new Date(item.date).toLocaleDateString(lang === 'en' ? 'en-IE' : 'fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return null;
    }
  })();

  const titre =
    item.type === 'mois'
      ? tx('Récolte du mois {{n}}', { n: item.mondeNum ?? 1 })
      : item.type === 'jalon'
        ? tx('Niveau {{n}} du voyage', { n: item.jalonNum ?? 1 })
        : item.nom
          ? item.nom
          : tx(r.label);

  const intro =
    item.type === 'jalon'
      ? tx(JALON_INTRO[Math.min(6, Math.max(1, item.jalonNum ?? 1))])
      : tx(r.intro);

  const points =
    item.type === 'jalon'
      ? [tx(JALON_POINT[Math.min(6, Math.max(1, item.jalonNum ?? 1))])]
      : r.points;

  const premium = item.type === 'mois' && item.mondeCode ? !item.traverse : false;

  return (
    <div className="w-overlay" onClick={onClose} role="presentation">
      <div
        ref={refModal}
        className="w-modal ri-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ri-titre"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-modal-head">
          <span
            className="w-modal-ico"
            style={{ background: r.bg, color: r.fg }}
            aria-hidden="true"
          >
            <VoyageIcon name={r.ico} size={24} />
          </span>
          <div className="w-modal-title">
            <small>{tx(r.label)}</small>
            <h2 id="ri-titre">{titre}</h2>
          </div>
          <button
            type="button"
            className="w-modal-close ri-fermer"
            onClick={onClose}
            aria-label={tx('Fermer l\u2019explication')}
          >
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="w-modal-body ri-body">
          {(dateCourte || item.mondeNum) && (
            <p className="ri-meta">
              {item.mondeNum && (
                <span className="ri-meta-mois">{tx('Mois {{n}} sur 11', { n: item.mondeNum })}</span>
              )}
              {dateCourte && <span>{tx('Obtenu le {{date}}', { date: dateCourte })}</span>}
            </p>
          )}

          {item.titre && <p className="ri-sources">{item.titre}</p>}
          <p className="ri-intro">{intro}</p>

          <h3 className="ri-h3">{tx('À quoi ça sert dans les rencontres')}</h3>
          <ul className="ri-points">
            {points.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>

          {item.type === 'mois' && item.contenu && item.contenu.length > 0 && (
            <>
              <h3 className="ri-h3">
                {item.traverse
                  ? tx('Ce que ce mois t\u2019a donné :')
                  : tx('Ce que ce mois te réserve :')}
              </h3>
              <ul className="ri-points ri-points-contenu">
                {item.contenu.map((ligne) => (
                  <li key={ligne}>{ligne}</li>
                ))}
              </ul>
            </>
          )}

          {item.type === 'mois' && premium && (
            <div className="ri-premium">
              <span className="v-prem" aria-label="Premium">
                <VoyageIcon name="gem" size={11} strokeWidth={2.2} />
                <em>Premium</em>
              </span>
              <p>
                {tx('Ce mois s\u2019ouvrira avec l\u2019abonnement mensuel — {{prix}}/mois.', {
                  prix: formaterPrixFacturation('mensuel', devise, lang),
                })}
              </p>
              <p className="ri-premium-note">
                {tx('L\u2019ouverture des paiements arrive bientôt : quand tu ouvriras un mois, sa récolte sera annoncée ici, par notification.')}
              </p>
            </div>
          )}

          <p className="ri-garde">{tx(r.garde)}</p>

          {item.queteId && (
            <a className="ri-lien" href={`#/quete/${item.queteId}/resultats`}>
              {tx('Voir mes résultats en détail')}
              <svg
                viewBox="0 0 24 24"
                width="13"
                height="13"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
