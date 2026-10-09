/**
 * FICHE D'UN MONDE — popup « Découvrir un monde » (demande fondateur, Task 22).
 *
 * role=dialog aria-modal : en-tête (icône tile du monde, « Monde N sur 11 »,
 * nom, bouton ×), meta chips (N quêtes + statut RÉEL Terminé / En cours /
 * Ouvert / À venir + 💎 Premium sobre si !free + « Toujours gratuit » si M11),
 * 5 sections (Ce monde · Son objectif · Ce que tu récoltes · Comment ça se
 * passe · Tes quêtes numérotées avec hints), pied :
 *  - monde ouvert → bouton « Commencer le monde » (déjà en cours → « Continuer
 *    le monde ») qui pose marquerMondeEnCours puis — si onEnterQuest est
 *    fourni (M1 seul monde à quête ouverte) — atterrit sur la quête ; sinon
 *    note de confirmation « Le Miroir est ouvert — bienvenue dans ton premier
 *    monde. » (les autres mondes ouverts : « {name} est ouvert. ») ;
 *  - monde terminé → « Tu as traversé ce monde — sa récolte est dans ton
 *    portrait. » ;
 *  - monde verrouillé → bloc w-lock (JAMAIS de faux bouton) : « Ce monde
 *    s'ouvrira quand tu auras terminé {monde précédent}. » (M11 : sa note
 *    « Se débloque à ton premier match… »).
 *
 * A11Y exacte : focus initial sur le bouton Fermer, piège Tab, Échap ferme,
 * clic sur le fond ferme, focus RESTITUÉ au déclencheur au démontage,
 * document.body 'no-scroll'. Le parent DOIT re-monter la popup par monde
 * (key={world.code}) — re-montage propre de l'état de confirmation.
 *
 * RECONSTITUTION (5ᵉ reset sandbox) — fidèle au bundle staging Task 27
 * (fonctions ah + lh, lignes 10650-10926 ; appel réel : écran Mondes,
 * lignes 11104-11110), en attendant ses retours d'amélioration.
 */

import { useEffect, useRef, useState } from 'react';
import { WORLDS, WORLD_DETAILS } from '../lib/voyage';
import type { VoyageWorld } from '../lib/voyage';
import { marquerMondeEnCours } from '../lib/mondes-state';
import VoyageIcon from './VoyageIcons';
import type { VoyageIconName } from './VoyageIcons';
import { useI18n } from '../i18n/I18nProvider';

interface Props {
  /** Le monde dont la fiche est ouverte. */
  world: VoyageWorld;
  /** Mondes franchis (useProgression().worldsDone) — world.num <= done ⇒ Terminé. */
  done: number;
  /** Le monde est déjà « en cours » (état réel posé par l'utilisateur). */
  started: boolean;
  /** Fermeture (bouton ×, Échap, clic fond). */
  onClose: () => void;
  /** Présent seulement pour le monde à quête ouverte (M1, M2 après M1) : après
   * marquerMondeEnCours, atterrir sur la première quête. */
  onEnterQuest?: () => void;
  /** L'accès aux mondes reste séquentiel : absent/true = jouable, false = le
   * monde précédent n'est pas fini (la fiche reste lisible, CTA verrouillé). */
  deverrouille?: boolean;
}

/** Flèche droite du bouton « Commencer/Continuer le monde ». */
function Fleche() {
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
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export default function WorldModal({ world, done, started, onClose, onEnterQuest, deverrouille }: Props) {
  const { tx } = useI18n();
  const refModal = useRef<HTMLDivElement | null>(null);
  const [confirme, setConfirme] = useState(false);

  useEffect(() => {
    const declencheur = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const modal = refModal.current;
    const fermer = modal?.querySelector<HTMLButtonElement>('.w-modal-close');
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

  const detail = WORLD_DETAILS[world.code];
  const termine = world.num <= done;
  // L'accès séquentiel : un monde 'open' reste lisible, mais son CTA ne s'active
  // que si le monde précédent est terminé (M2 attend la fin du Monde 1).
  const ouvert = !termine && world.status === 'open' && deverrouille !== false;
  const precedent = WORLDS.find((w) => w.num === world.num - 1);
  const texteVerrou =
    world.num === 11 && world.note
      ? world.note
      : tx("Ce monde s'ouvrira quand tu auras terminé {{nom}}.", {
          nom: precedent?.name ?? tx('le monde précédent'),
        });
  const commencer = () => {
    marquerMondeEnCours(world.code);
    if (onEnterQuest) {
      onEnterQuest();
      return;
    }
    setConfirme(true);
  };

  return (
    <div className="w-overlay" onClick={onClose} role="presentation">
      <div
        ref={refModal}
        className="w-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="w-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-modal-head">
          <span
            className="w-modal-ico"
            style={{ background: world.tile.bg, color: world.tile.fg }}
            aria-hidden="true"
          >
            <VoyageIcon name={world.icon as VoyageIconName} size={26} />
          </span>
          <div className="w-modal-title">
            <small>
              {tx('Monde {{n}} sur 11', { n: world.num })}
            </small>
            <h2 id="w-modal-title">{world.name}</h2>
          </div>
          <button
            type="button"
            className="w-modal-close"
            onClick={onClose}
            aria-label={tx('Fermer la fiche du monde {{nom}}', { nom: world.name })}
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

        <div className="w-modal-body">
          <div className="w-modal-meta">
            <span className="m-world-steps">
              {tx('{{n}} quête{{s}}', { n: world.quests, s: world.quests > 1 ? 's' : '' })}
            </span>
            {termine ? (
              <span className="v-chip v-chip-done">
                <svg
                  viewBox="0 0 24 24"
                  width="10"
                  height="10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M4 12.5l5 5L20 6.5" />
                </svg>
                {tx('Terminé')}
              </span>
            ) : started || confirme ? (
              <span className="v-chip v-chip-now">
                <span className="v-chip-dot" aria-hidden="true" />
                {tx('En cours')}
              </span>
            ) : ouvert ? (
              <span className="v-chip v-chip-now">
                <span className="v-chip-dot" aria-hidden="true" />
                {tx('Ouvert')}
              </span>
            ) : (
              <span className="v-chip v-chip-soon">{tx('À venir')}</span>
            )}
            {!world.free && (
              <span className="v-prem">
                <VoyageIcon name="gem" size={10} strokeWidth={2.2} />
                <em>Premium</em>
              </span>
            )}
            {world.free && world.num === 11 && <span className="v-free">{tx('Toujours gratuit')}</span>}
          </div>

          {detail ? (
            <>
              <section className="w-modal-sec" aria-label={tx('Présentation du monde')}>
                <h3>{tx('Ce monde')}</h3>
                <p>{detail.presentation}</p>
              </section>
              <section className="w-modal-sec" aria-label={tx('Objectif du monde')}>
                <h3>{tx('Son objectif')}</h3>
                <p>{detail.objectif}</p>
              </section>
              <section className="w-modal-sec" aria-label={tx('Résultats attendus du monde')}>
                <h3>{tx('Ce que tu récoltes')}</h3>
                <ul>
                  {detail.resultats.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
              <section className="w-modal-sec" aria-label={tx('Déroulement des évaluations du monde')}>
                <h3>{tx('Comment ça se passe')}</h3>
                <ul>
                  {detail.comment.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
              <section
                className="w-modal-sec"
                aria-label={tx('Les {{n}} quêtes du monde', { n: world.quests })}
              >
                <h3>{tx('Tes quêtes')}</h3>
                <ol className="w-modal-quests">
                  {detail.quetes.map((quete) => (
                    <li key={quete.title}>
                      <span className="w-modal-quest-text">
                        <strong>{quete.title}</strong>
                        {quete.hint && <em>{quete.hint}</em>}
                      </span>
                    </li>
                  ))}
                </ol>
              </section>
            </>
          ) : (
            <section className="w-modal-sec" aria-label={tx('Présentation du monde')}>
              <h3>{tx('Ce monde')}</h3>
              <p>{world.tagline}</p>
            </section>
          )}

          {world.note && world.num !== 11 && <p className="m-world-note">{world.note}</p>}
        </div>

        <div className="w-modal-foot">
          {termine ? (
            <p className="w-modal-footnote">{tx('Tu as traversé ce monde — sa récolte est dans ton portrait.')}</p>
          ) : ouvert ? (
            <>
              {confirme && (
                <p className="w-started-note" role="status">
                  {world.num === 1
                    ? tx('Le Miroir est ouvert — bienvenue dans ton premier monde.')
                    : tx('{{nom}} est ouvert.', { nom: world.name })}
                </p>
              )}
              <button type="button" className="btn w-modal-cta" onClick={commencer}>
                {started || confirme ? tx('Continuer le monde') : tx('Commencer le monde')}
                <Fleche />
              </button>
            </>
          ) : (
            <div className="w-lock">
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.1"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="4" y="11" width="16" height="10" rx="2.5" />
                <path d="M8 11V7a4 4 0 0 1 8 0v4" />
              </svg>
              <p>{texteVerrou}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
