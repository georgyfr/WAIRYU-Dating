/**
 * Barre de navigation permanente (expérience « dating app » classique —
 * demande fondateur, enrichie Task 30).
 *
 * TASK 37 (demande fondateur : « je ne veux plus d'onglet au niveau de la
 * barre latérale… pour le mode invisible je veux essentiellement explorer,
 * révélation, chat, coach, profil ») :
 * · la navigation n'est plus une liste d'ONGLETS mais un MENU latéral
 *   (bloc .tabbar-nav + libellé de section, look menu Task 37 en CSS) ;
 * · les entrées dépendent du MODE COURANT (store partagé lib/mode.ts,
 *   Task 35) :
 *    – Classique / Interracial : Découvrir · Likes · Matchs · Messages ·
 *      Moments · Profil (l'historique, inchangé) ;
 *    – Invisible : 🧭 Explorer (deck Invisible) · 🔓 Révélation (rituel
 *      15 messages / 7 jours / accord mutuel) · 💬 Chat · 🎯 Coach ·
 *      👤 Profil — cinq entrées, l'essentiel du parcours personnalité
 *      d'abord. En mobile la même liste pilote la barre du bas (5 entrées).
 * · Les 2 nouveaux écrans (Révélation, Coach) s'ouvrent via #/revelation
 *   et #/coach ; les fonctionnalités existantes sont TOUTES conservées
 *   (100 % additif) — en Classique, la sidebar reste celle d'avant.
 *
 * TASK 39 (demande fondateur — PROMPT « Wairyu Moments », mode événementiel) :
 * le contexte Moments (lib/events-mode.ts — route #/events* rejointe) bascule
 * la navigation sur l'univers ÉVÉNEMENTIEL : Découvrir · Mes events ·
 * [+] Créer (bouton CENTRAL surélevé en mobile) · Moments · Profil — 4
 * onglets + bouton central, comme le prototype. Le badge « bascule » de
 * retour vers le mode rencontre vit dans les écrans événementiels ; la fin
 * de session réinitialise le contexte (App.onLoggedOut). TOUTES les entrées
 * historiques restent là pour le mode dating — rien n'est supprimé.
 *
 * Visible UNIQUEMENT sur les pages principales ; les écrans secondaires
 * (chat temps réel, questionnaire, assistant profil, paramètres) gardent
 * leur navigation propre (bouton retour). Badges : non-lus sur Messages /
 * Chat, likes reçus sur Likes — alimentés par le polling léger de App.
 *
 * Task 35 (conservé) : le chip sous la marque affiche le mode courant
 * (🔥 Classique · 🌍 Interracial · 🕯️ Invisible).
 */
import { useSharedMode } from '../lib/mode';
import { useEventsNav } from '../lib/events-mode';

export type TabId =
  | 'discover'
  | 'likes'
  | 'matches'
  | 'messages'
  | 'moments'
  | 'profile'
  | 'revelation'
  | 'coach'
  // Task 39 — univers événementiel (contexte Moments).
  | 'events'
  | 'events-mine'
  | 'events-create'
  | 'events-moments';

interface Props {
  active: TabId;
  /** Total des messages non lus (toutes conversations) — badge Messages/Chat. */
  unread: number;
  /** Likes/supers reçus en attente — badge Likes. */
  likes: number;
  onGo: (hash: string) => void;
}

interface NavItem {
  id: TabId;
  hash: string;
  icon: string;
  label: string;
  /** Badge alimenté par App : unread = messages non lus, likes = likes reçus. */
  badge?: 'unread' | 'likes';
  /** Task 39 — entrée « Créer » : bouton central surélevé (mobile) / tuile dégradée (PC). */
  create?: boolean;
}

/** Entrées Classique / Interracial — l'historique de l'app, inchangé. */
const NAV_CLASSIC: NavItem[] = [
  { id: 'discover', hash: '#/discover', icon: '🔥', label: 'Découvrir' },
  { id: 'likes', hash: '#/likes', icon: '✨', label: 'Likes', badge: 'likes' },
  { id: 'matches', hash: '#/matches', icon: '⚡', label: 'Matchs' },
  { id: 'messages', hash: '#/messages', icon: '💬', label: 'Messages', badge: 'unread' },
  { id: 'moments', hash: '#/moments', icon: '🎬', label: 'Moments' },
  { id: 'profile', hash: '#/myprofile', icon: '👤', label: 'Profil' },
];

/**
 * Entrées Mode Invisible (Task 37 — demande fondateur) : le parcours
 * personnalité d'abord. Explorer = deck Invisible (Task 36 : deep link
 * du mode), Révélation = centre du rituel de révélation consentie,
 * Chat = messagerie (même page Messages, libellé du mode), Coach =
 * alchimie conversationnelle (aperçu), Profil.
 */
const NAV_INVISIBLE: NavItem[] = [
  { id: 'discover', hash: '#/discover/invisible', icon: '🧭', label: 'Explorer' },
  { id: 'revelation', hash: '#/revelation', icon: '🔓', label: 'Révélation' },
  { id: 'messages', hash: '#/messages', icon: '💬', label: 'Chat', badge: 'unread' },
  { id: 'coach', hash: '#/coach', icon: '🎯', label: 'Coach' },
  { id: 'profile', hash: '#/myprofile', icon: '👤', label: 'Profil' },
];

/**
 * Entrées MOMENTS (Task 39 — mode événementiel) : 4 onglets + le bouton
 * central « + » (Créer). Découvrir = feed d'événements, Mes events =
 * billetterie, Moments = souvenirs (l'onglet historique), Profil = le
 * profil partagé. L'ordre place le « + » au centre (3e sur 5).
 */
const NAV_MOMENTS: NavItem[] = [
  { id: 'events', hash: '#/events', icon: '🔎', label: 'Découvrir' },
  { id: 'events-mine', hash: '#/events/mes', icon: '🎟️', label: 'Mes events' },
  { id: 'events-create', hash: '#/events/creer', icon: '+', label: 'Créer', create: true },
  { id: 'events-moments', hash: '#/moments', icon: '📸', label: 'Moments' },
  { id: 'profile', hash: '#/myprofile', icon: '👤', label: 'Profil' },
];

/** Chip « mode courant » de la sidebar (Task 35) — libellés réels du produit. */
const MODE_CHIP: Record<'classic' | 'invisible' | 'interracial', { icon: string; label: string }> = {
  classic: { icon: '🔥', label: 'Classique' },
  interracial: { icon: '🌍', label: 'Interracial' },
  invisible: { icon: '🕯️', label: 'Invisible' },
};

export function TabBar({ active, unread, likes, onGo }: Props) {
  // Mode courant de la session (Task 35/37) — null tant que non chargé :
  // aucun chip inventé, la sidebar reste NEUTRE (entrées Classique) en
  // attendant les données, puis bascule vers le menu du mode.
  const mode = useSharedMode();
  // Task 39 : contexte événementiel actif ? (route #/events* ou badge) —
  // il PRIME sur le mode dating : tant qu'on parcourt les événements, la
  // navigation reste celle du prototype Moments (4 onglets + « + »).
  const eventsNav = useEventsNav();
  const chip = eventsNav ? { icon: '📅', label: 'Moments' } : mode ? MODE_CHIP[mode] : null;
  const items = eventsNav ? NAV_MOMENTS : mode === 'invisible' ? NAV_INVISIBLE : NAV_CLASSIC;
  const badgeValue = (b?: NavItem['badge']) =>
    b === 'unread' ? unread : b === 'likes' ? likes : 0;
  return (
    <nav className="tabbar" aria-label="Navigation principale">
      {/* Marque — affichée uniquement en navigation latérale (≥ 1024 px,
          voir section « Design responsive » de styles.css). */}
      <div className="tabbar-brand" aria-hidden="true">
        <span className="tabbar-logo">w</span>
        <span className="tabbar-word">wairyu</span>
      </div>
      {chip && (
        <div
          className={`tabbar-mode-chip ${eventsNav ? 'mode-moments' : `mode-${mode}`}`}
          aria-hidden="true"
        >
          <span className="tabbar-mode-ico">{chip.icon}</span>
          {chip.label}
        </div>
      )}
      {/* Task 37 : bloc MENU (le wrapper ne change rien en mobile —
          display:contents — et structure la colonne du menu en PC). */}
      <div className={`tabbar-nav ${eventsNav ? 'tabbar-nav-events' : ''}`}>
        <span className="tabbar-section" aria-hidden="true">
          Menu
        </span>
        {items.map((t) => {
          const n = badgeValue(t.badge);
          return (
            <button
              key={t.id}
              type="button"
              className={`tabbar-item ${active === t.id ? 'active' : ''} ${t.create ? 'tabbar-create' : ''}`}
              aria-current={active === t.id ? 'page' : undefined}
              aria-label={t.create ? `Créer un événement` : undefined}
              onClick={() => onGo(t.hash)}
            >
              <span className="tabbar-icon">
                {t.create ? (
                  <span className="tabbar-create-btn" aria-hidden="true">
                    +
                  </span>
                ) : (
                  t.icon
                )}
                {n > 0 && (
                  <span className={`tabbar-badge ${t.badge === 'likes' ? 'likes' : ''}`}>
                    {n > 9 ? '9+' : n}
                  </span>
                )}
              </span>
              <span className="tabbar-label">{t.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
