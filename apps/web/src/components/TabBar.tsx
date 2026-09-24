/**
 * Barre d'onglets permanente (expérience « dating app » classique —
 * demande fondateur) : Découverte · Matchs · Messages · Profil.
 *
 * Visible UNIQUEMENT sur les 4 pages principales ; les écrans secondaires
 * (chat temps réel, questionnaire, assistant profil, paramètres) gardent
 * leur navigation propre (bouton retour). Badge de non-lus sur Messages,
 * alimenté par le polling léger de /api/chat/conversations dans App.
 */

export type TabId = 'discover' | 'matches' | 'messages' | 'profile';

interface Props {
  active: TabId;
  /** Total des messages non lus (toutes conversations) — badge Messages. */
  unread: number;
  onGo: (hash: string) => void;
}

const TABS: { id: TabId; hash: string; icon: string; label: string }[] = [
  { id: 'discover', hash: '#/discover', icon: '🔥', label: 'Découverte' },
  { id: 'matches', hash: '#/matches', icon: '⚡', label: 'Matchs' },
  { id: 'messages', hash: '#/messages', icon: '💬', label: 'Messages' },
  { id: 'profile', hash: '#/myprofile', icon: '👤', label: 'Profil' },
];

export function TabBar({ active, unread, onGo }: Props) {
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
          </span>
          <span className="tabbar-label">{t.label}</span>
        </button>
      ))}
    </nav>
  );
}
