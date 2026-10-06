export type Tab = 'voyage' | 'discover' | 'messages' | 'profile';

const TABS: { id: Tab; icon: string; label: string }[] = [
  { id: 'voyage', icon: '🗺️', label: 'Voyage' },
  { id: 'discover', icon: '🧭', label: 'Découvrir' },
  { id: 'messages', icon: '💬', label: 'Messages' },
  { id: 'profile', icon: '👤', label: 'Profil' },
];

export default function TabBar({
  active,
  onSelect,
}: {
  active: Tab;
  onSelect: (t: Tab) => void;
}) {
  return (
    <nav className="tabbar" aria-label="Navigation principale">
      {TABS.map((t) => (
        <button
          key={t.id}
          className={active === t.id ? 'active' : undefined}
          onClick={() => onSelect(t.id)}
          aria-current={active === t.id ? 'page' : undefined}
        >
          <span className="tab-icon" aria-hidden="true">
            {t.icon}
          </span>
          {t.label}
        </button>
      ))}
    </nav>
  );
}
