import type { DiscoveryMode } from '@wairyu/shared';

/**
 * Task 41 — Sélecteur de modes DANS l'univers événementiel (append-only).
 *
 * Demande fondateur : « Lorsqu'on clique sur Moment, il est impossible
 * d'avoir accès aux autres modes. » — jusqu'ici la seule sortie de l'univers
 * Moments était le badge discret « Moments · actif ». Cette rangée reprend
 * les 4 pastilles du sélecteur de Découvrir (Task 40) : 🔥 🕯️ 🌍 y mènent
 * RÉELLEMENT (App navigate vers #/discover/:mode — la bascule serveur
 * Task 36 s'applique), 📅 Moments est affiché ACTIF (on y est).
 * Le mode dating de l'utilisateur n'est JAMAIS écrasé par la navigation :
 * c'est Discover (Task 36) qui décide d'un éventuel PUT en fonction du slug.
 */
const DATING_MODES: { id: DiscoveryMode; label: string; icon: string }[] = [
  { id: 'classic', label: 'Classique', icon: '🔥' },
  { id: 'invisible', label: 'Invisible', icon: '🕯️' },
  { id: 'interracial', label: 'Interracial', icon: '🌍' },
];

export function EvModeSwitch({ onMode }: { onMode: (m: DiscoveryMode) => void }) {
  return (
    <nav className="ev-mode-switch" aria-label="Changer de mode">
      {DATING_MODES.map((m) => (
        <button
          key={m.id}
          type="button"
          className="ev-mode-pill"
          onClick={() => onMode(m.id)}
          title={`Passer en mode ${m.label}`}
        >
          <span className="ev-mode-pill-icon" aria-hidden="true">
            {m.icon}
          </span>
          {m.label}
        </button>
      ))}
      <span className="ev-mode-pill active" aria-current="true" title="Tu es dans l'univers Moments">
        <span className="ev-mode-pill-icon" aria-hidden="true">
          📅
        </span>
        Moments
      </span>
    </nav>
  );
}
