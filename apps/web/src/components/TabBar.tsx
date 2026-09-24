/**
 * Barre d'onglets permanente (expérience « dating app » classique —
 * demande fondateur, enrichie Task 30) :
 * Découvrir · Likes · Matchs · Messages · Moments · Profil.
 *
 * Les 2 nouveaux onglets reprennent les codes des apps populaires :
 * - Likes : la grille « Tu plais ! » (likes reçus en attente, gratuit) ;
 * - Moments : l'aperçu des événements wairyu (teaser).
 * Les fonctionnalités existantes sont toutes conservées.
 *
 * Visible UNIQUEMENT sur les pages principales ; les écrans secondaires
 * (chat temps réel, questionnaire, assistant profil, paramètres) gardent
 * leur navigation propre (bouton retour). Badges : non-lus sur Messages,
 * likes reçus sur Likes — alimentés par le polling léger de App.
 */

export type TabId = 'discover' | 'likes' | 'matches' | 'messages' | 'moments' | 'profile';

interface Props {
  active: TabId;
  /** Total des messages non lus (toutes conversations) — badge Messages. */
  unread: number;
  /** Likes/supers reçus en attente — badge Likes. */
  likes: number;
  onGo: (hash: string) => void;
}

const TABS: { id: TabId; hash: string; icon: string; label: string }[] = [
  { id: 'discover', hash: '#/discover', icon: '🔥', label: 'Découvrir' },
  { id: 'likes', hash: '#/likes', icon: '✨', label: 'Likes' },
  { id: 'matches', hash: '#/matches', icon: '⚡', label: 'Matchs' },
  { id: 'messages', hash: '#/messages', icon: '💬', label: 'Messages' },
  { id: 'moments', hash: '#/moments', icon: '🎬', label: 'Moments' },
  { id: 'profile', hash: '#/myprofile', icon: '👤', label: 'Profil' },
];

export function TabBar({ active, unread, likes, onGo }: Props) {
  return (
    <nav className="tabbar" aria-label="Navigation principale">
      {/* Marque — affichée uniquement en navigation latérale (≥ 1024 px,
          voir section « Design responsive » de styles.css). */}
      <div className="tabbar-brand" aria-hidden="true">
        <span className="tabbar-logo">w</span>
        <span className="tabbar-word">wairyu</span>
      </div>
      {TABS.map((t) => (
        <button
          key={t.id}
          type="button"
          className={`tabbar-item ${active === t.id ? 'active' : ''}`}
          aria-current={active === t.id ? 'page' : undefined}
          onClick={() => onGo(t.hash)}
        >
          <span className="tabbar-icon">
            {t.icon}
            {t.id === 'messages' && unread > 0 && (
              <span className="tabbar-badge">{unread > 9 ? '9+' : unread}</span>
            )}
            {t.id === 'likes' && likes > 0 && (
              <span className="tabbar-badge likes">{likes > 9 ? '9+' : likes}</span>
            )}
          </span>
          <span className="tabbar-label">{t.label}</span>
        </button>
      ))}
    </nav>
  );
}
