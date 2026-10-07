/**
 * Barre d'onglets — 4 destinations (maquette fondateur 2026-10-07) :
 * Voyage · Découvrir · Messages · Profil. L'onglet actif est une pilule
 * turquoise dégradée contenant l'icône et le libellé (comme la maquette) ;
 * les icônes sont des SVG traits (zéro dépendance, lisibles partout).
 */
export type Tab = 'voyage' | 'discover' | 'messages' | 'profile';

function TabIcon({ id }: { id: Tab }) {
  const common = {
    viewBox: '0 0 24 24',
    width: 23,
    height: 23,
    fill: 'none' as const,
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };
  if (id === 'voyage') {
    // Carte pliée : le voyage se lit comme un itinéraire.
    return (
      <svg {...common}>
        <path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2z" />
        <path d="M9 4v14M15 6v14" />
      </svg>
    );
  }
  if (id === 'discover') {
    return (
      <svg {...common}>
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    );
  }
  if (id === 'messages') {
    // Bulle avec trois points : la conversation vivante.
    return (
      <svg {...common}>
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        <circle cx="8.5" cy="11.5" r="0.6" fill="currentColor" stroke="none" />
        <circle cx="12" cy="11.5" r="0.6" fill="currentColor" stroke="none" />
        <circle cx="15.5" cy="11.5" r="0.6" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

const TABS: { id: Tab; label: string }[] = [
  { id: 'voyage', label: 'Voyage' },
  { id: 'discover', label: 'Découvrir' },
  { id: 'messages', label: 'Messages' },
  { id: 'profile', label: 'Profil' },
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
          <span className="tab-ico" aria-hidden="true">
            <TabIcon id={t.id} />
          </span>
          {t.label}
        </button>
      ))}
    </nav>
  );
}
