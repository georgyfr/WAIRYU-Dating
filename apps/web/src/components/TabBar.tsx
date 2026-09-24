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
 *
 * Task 35 (demande fondateur — sidebar différenciée par mode) : un chip
 * sous la marque affiche le mode courant (🔥 Classique · 🌍 Interracial ·
 * 🕯️ Invisible) — le même store que l'identité violette du body, donc
 * toujours synchronisé avec les onglets de mode de Découvrir. Le chip vit
 * dans .tabbar-brand (masquée < 1024 px) : zéro impact sur la barre mobile.
 */
import { useSharedMode } from '../lib/mode';

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

/** Chip « mode courant » de la sidebar (Task 35) — libellés réels du produit. */
const MODE_CHIP: Record<'classic' | 'invisible' | 'interracial', { icon: string; label: string }> = {
  classic: { icon: '🔥', label: 'Classique' },
  interracial: { icon: '🌍', label: 'Interracial' },
  invisible: { icon: '🕯️', label: 'Invisible' },
};

export function TabBar({ active, unread, likes, onGo }: Props) {
  // Mode courant de la session (Task 35) — null tant que non chargé :
  // aucun chip inventé, la sidebar reste neutre en attendant les données.
  const mode = useSharedMode();
  const chip = mode ? MODE_CHIP[mode] : null;
  return (
    <nav className="tabbar" aria-label="Navigation principale">
      {/* Marque — affichée uniquement en navigation latérale (≥ 1024 px,
          voir section « Design responsive » de styles.css). */}
      <div className="tabbar-brand" aria-hidden="true">
        <span className="tabbar-logo">w</span>
        <span className="tabbar-word">wairyu</span>
      </div>
      {chip && (
        <div className={`tabbar-mode-chip mode-${mode}`} aria-hidden="true">
          <span className="tabbar-mode-ico">{chip.icon}</span>
          {chip.label}
        </div>
      )}
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
