/**
 * Barre d'onglets — 5 destinations (Task 24, ordre fondateur) :
 * Voyage · Mondes · QUÊTE · Parcourus · Récolte.
 *
 * L'onglet Quête est l'ENDROIT où l'on se retrouve : quand une quête est
 * engagée (des réponses, pas encore terminée), un point corail s'allume sur
 * son icône et l'aria-label l'annonce — il s'éteint seul à la complétion.
 * Les icônes sont des SVG traits inline (zéro dépendance).
 *
 * RECONSTITUTION (5ᵉ reset sandbox) — fidèle au bundle staging (fonctions
 * Hf/Jf/Kf), classes CSS du CSS servi exact (.tabbar button.active, .tab-dot).
 */
export type Tab = 'voyage' | 'mondes' | 'quete' | 'parcourus' | 'recolte';

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
  if (id === 'mondes') {
    // Globe : les 11 mondes du voyage.
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18" />
        <path d="M12 3a14.2 14.2 0 0 1 0 18M12 3a14.2 14.2 0 0 0 0 18" />
      </svg>
    );
  }
  if (id === 'quete') {
    // Drapeau planté : la quête en cours, le point où l'on se retrouve.
    return (
      <svg {...common}>
        <path d="M6 21V3.5" />
        <path d="M6 4.5h11l-2.6 3.5L17 11.5H6" />
      </svg>
    );
  }
  if (id === 'parcourus') {
    // Itinéraire franchi : deux jalons reliés par la route.
    return (
      <svg {...common}>
        <circle cx="6" cy="19" r="3" />
        <circle cx="18" cy="5" r="3" />
        <path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" />
      </svg>
    );
  }
  // Panier de récolte : ce que le voyage construit.
  return (
    <svg {...common}>
      <path d="M4.5 9.5h15l-1.4 8.3a2 2 0 0 1-2 1.7H7.9a2 2 0 0 1-2-1.7L4.5 9.5z" />
      <path d="M8.5 9.5 12 4l3.5 5.5" />
      <path d="M9.8 13.2v2.6M14.2 13.2v2.6" />
    </svg>
  );
}

const TABS: { id: Tab; label: string }[] = [
  { id: 'voyage', label: 'Voyage' },
  { id: 'mondes', label: 'Mondes' },
  { id: 'quete', label: 'Quête' },
  { id: 'parcourus', label: 'Parcourus' },
  { id: 'recolte', label: 'Récolte' },
];

export default function TabBar({
  active,
  onSelect,
  queteEnCours = false,
}: {
  /** L'onglet allumé — ou une vue hors tabs (portes/masquées : aucun onglet allumé). */
  active: Tab | 'portrait' | 'matchs' | 'masked' | 'quete';
  onSelect: (t: Tab) => void;
  /** Une quête est engagée ⇒ point corail + aria-label sur l'onglet Quête. */
  queteEnCours: boolean;
}) {
  return (
    <nav className="tabbar" aria-label="Navigation principale">
      {TABS.map((t) => (
        <button
          key={t.id}
          className={active === t.id ? 'active' : undefined}
          onClick={() => onSelect(t.id)}
          aria-current={active === t.id ? 'page' : undefined}
          aria-label={t.id === 'quete' && queteEnCours ? 'Quête — une quête est en cours' : undefined}
        >
          <span className="tab-ico" aria-hidden="true">
            <TabIcon id={t.id} />
            {t.id === 'quete' && queteEnCours && <span className="tab-dot" />}
          </span>
          {t.label}
        </button>
      ))}
    </nav>
  );
}
