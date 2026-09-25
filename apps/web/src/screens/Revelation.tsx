/**
 * Écran « Révélation » (Task 37 — demande fondateur : menu Invisible
 * « explorer, révélation, chat, coach, profil »).
 *
 * Le CENTRE du rituel de révélation consentie (spec §4.6 / §5.6) : ici on
 * voit d'un coup d'œil toutes les conversations du Mode Invisible, l'état
 * de la photo (floutée = pas encore révélée), et le chemin du rituel —
 * 15 messages échangés, 7 jours de conversation, puis l'ACCORD DES DEUX.
 * La demande elle-même reste DANS le chat (bouton « Révéler » du chat,
 * revealEligible calculé serveur — Task 6) : cette page explique, liste
 * et ouvre le chat, elle ne remplace aucun mécanisme existant.
 *
 * Données : cache SWR partagé « matches » (même requête que la page
 * Matchs et le badge cloche — Task 28). Filtrage local sur les matchs de
 * mode CONVERSATION invisible. Éthique (spec §5.4) : le rappel « rien
 * n'est automatique » est TOUJOURS visible.
 */
import { useSwr } from '../lib/swr';
import type { MatchListResponse } from '@wairyu/shared';

interface Props {
  /** Ouvre le chat temps réel de la conversation (là où se joue le rituel). */
  onOpenChat: (conversationId: string) => void;
  /** Vers le deck Invisible quand il n'y a encore rien à révéler. */
  onExplore: () => void;
}

/** Libellés d'origine du match — vocabulaire produit réel. */
const ORIGIN_LABELS: Record<'like' | 'super' | 'invisible_request', { icon: string; label: string }> = {
  like: { icon: '♥', label: 'Match mutuel' },
  super: { icon: '✶', label: 'Super Like' },
  invisible_request: { icon: '💬', label: 'Demande « Discuter » acceptée' },
};

/** « 12 sept » — la date de naissance du match (privacy : pas d'heure). */
function dayLabel(epochSeconds: number): string {
  return new Date(epochSeconds * 1000).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
  });
}

export function Revelation({ onOpenChat, onExplore }: Props) {
  // Cache PARTAGÉ avec la page Matchs et la cloche de Découvrir (Task 28).
  const { data, loading, error } = useSwr<MatchListResponse>('matches', true, {
    ttlMs: 30_000,
  });

  const invisible = (data?.matches ?? []).filter((m) => m.conversationMode === 'invisible');
  const blurred = invisible.filter((m) => m.other.photoBlurred).length;

  return (
    <div className="app page-revelation">
      <header className="wizard-head plain">
        <h1>🔓 Révélation</h1>
        {invisible.length > 0 && <span className="head-count">{invisible.length}</span>}
      </header>

      {/* Le rituel, toujours expliqué (spec §4.6 — consentement d'abord) */}
      <section className="moments-hero rev-hero">
        <h2>La révélation consentie</h2>
        <p>
          Dans le Mode Invisible, les photos restent floutées tant que VOUS deux
          ne le décidez pas ensemble. Le rituel : échanger <strong>15 messages</strong>,
          partager <strong>7 jours</strong> de conversation, puis chacun donne son
          accord dans le chat. Rien n'est automatique, jamais forcé — et réversible
          en cas de doute.
        </p>
        <div className="hero-chips">
          <span className="chip-hero">💬 15 messages</span>
          <span className="chip-hero">⏳ 7 jours</span>
          <span className="chip-hero">🤝 Accord des deux</span>
          {blurred > 0 && <span className="chip-hero">🔒 {blurred} photo{blurred > 1 ? 's' : ''} encore floutée{blurred > 1 ? 's' : ''}</span>}
        </div>
      </section>

      {error && <p className="error">{error}</p>}
      {loading && (
        <p className="status">
          <span className="dot" /> Chargement de tes conversations Invisible…
        </p>
      )}

      {data && invisible.length === 0 && (
        <div className="empty-state">
          <span className="empty-icon" aria-hidden="true">🕯️</span>
          <strong>Aucune conversation Invisible pour l'instant</strong>
          <p className="hint">
            Explore en Mode Invisible, demande à discuter — quand un match se crée,
            il apparaîtra ici avec l'état de sa révélation.
          </p>
          <button type="button" className="btn primary" onClick={onExplore}>
            🧭 Explorer maintenant
          </button>
        </div>
      )}

      <div className="rev-list">
        {invisible.map((m) => {
          const origin = ORIGIN_LABELS[m.origin] ?? ORIGIN_LABELS.like;
          return (
            <div key={m.matchId} className="rev-row">
              {m.other.photoUrl ? (
                <img
                  src={m.other.photoUrl}
                  alt={m.other.displayName}
                  className={`conv-photo ${m.other.photoBlurred ? 'blurred' : ''}`}
                  loading="lazy"
                />
              ) : (
                <span className="conv-photo empty" aria-hidden="true">✨</span>
              )}
              <span className="rev-body">
                <span className="conv-head">
                  <strong className="conv-name">
                    {m.other.displayName}
                    {m.other.verified && (
                      <span className="chip chip-verified" title="Selfie reviewé par l'équipe wairyu">
                        {' '}✓
                      </span>
                    )}
                  </strong>
                  <time dateTime={new Date(m.createdAt * 1000).toISOString()}>
                    {dayLabel(m.createdAt)}
                  </time>
                </span>
                <span className="rev-meta">
                  <span className={`chip chip-conv invisible`}>
                    {origin.icon} {origin.label}
                  </span>
                  {m.other.photoBlurred ? (
                    <span className="rev-state">🔒 Photo floutée — rituel en cours</span>
                  ) : (
                    <span className="rev-state done">🔓 Photos révélées d'un commun accord</span>
                  )}
                </span>
              </span>
              <button
                type="button"
                className="btn ghost small"
                onClick={() => onOpenChat(m.conversationId)}
              >
                Ouvrir le chat
              </button>
            </div>
          );
        })}
      </div>

      {invisible.length > 0 && (
        <p className="hint">
          La demande de révélation se fait DANS le chat (bouton « Révéler ») —
          elle n'apparaît que lorsque les deux conditions du rituel sont réunies.
          Chacun peut dire non, ou changer d'avis : aucune photo n'est révélée
          sans l'accord des deux, jamais.
        </p>
      )}
    </div>
  );
}
