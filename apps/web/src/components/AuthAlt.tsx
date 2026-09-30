/**
 * Task 71 — Bloc « autres voies » des pages inscription / connexion.
 *
 * Demande fondateur : « que se connecter avec un pseudo soit aussi présent
 * sur les pages d'inscription afin de donner la liberté à l'utilisateur de
 * choisir ce qui l'intéresse » + « convivial, ergonomique, bien designé,
 * fluide / soft, ne pas se perdre ».
 *
 * Remplace visuellement les anciens <p class="switch"> des 4 écrans d'auth
 * (les règles CSS .switch paragraphes restent dans styles.css, rien n'est
 * supprimé). Chaque page liste UNIQUEMENT les voies pertinentes qui ne sont
 * pas déjà la page courante — jamais de boucle sur soi-même.
 */
interface AuthAltItem {
  to: string;
  icon: string;
  label: string;
  /** Mise en avant douce (voie la plus proche de la page courante). */
  accent?: boolean;
}

interface Props {
  items: AuthAltItem[];
  title?: string;
}

function go(e: React.MouseEvent<HTMLAnchorElement>, to: string) {
  e.preventDefault();
  window.location.hash = to;
}

export function AuthAlt({ items, title = 'Choisis ce qui t\u2019arrange' }: Props) {
  return (
    <nav className="auth-alt" aria-label="Autres options">
      <p className="auth-alt-title">{title}</p>
      <div className="auth-alt-list">
        {items.map((it) => (
          <a
            key={it.to + it.label}
            href={it.to}
            className={'auth-alt-item' + (it.accent ? ' aa-accent' : '')}
            onClick={(e) => go(e, it.to)}
          >
            <span className="aa-icon" aria-hidden="true">
              {it.icon}
            </span>
            <span className="aa-label">{it.label}</span>
            <span className="aa-chev" aria-hidden="true">
              ›
            </span>
          </a>
        ))}
      </div>
    </nav>
  );
}
