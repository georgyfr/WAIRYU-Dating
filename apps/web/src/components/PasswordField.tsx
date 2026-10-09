/**
 * Champ mot de passe avec bascule d'affichage (œil) — demande fondateur :
 * « lors de la création des comptes avec pseudo, assure-toi que les mots de
 * passe aient la possibilité d'être vus ». L'utilisateur peut vérifier sa
 * saisie avant validation (surtout précieux sur clavier mobile).
 *
 * Réutilise la structure .field existante (label > span + input) pour une
 * intégration sans régression dans Auth (connexion/inscription), ResetPassword
 * et Profile. L'icône est un SVG inline (projet sans lib d'icônes).
 *
 * Accessibilité : bouton type="button" (jamais de submit accidentel),
 * aria-pressed + aria-label dynamiques, focus visible.
 */
import { useState } from 'react';
import { useI18n } from '../i18n/I18nProvider';

interface Props {
  value: string;
  onChange: (v: string) => void;
  /** current-password (connexion) ou new-password (création/réinitialisation). */
  autoComplete?: string;
  /** Intitulé du champ au-dessus de la saisie. */
  label?: string;
  placeholder?: string;
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c6.5 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3.5 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
  );
}

export default function PasswordField({
  value,
  onChange,
  autoComplete = 'current-password',
  label = 'Mot de passe',
  placeholder,
}: Props) {
  const [shown, setShown] = useState(false);
  const { tx } = useI18n();
  const toggleLabel = shown ? tx('Masquer le mot de passe') : tx('Afficher le mot de passe');
  return (
    <label className="field field-password">
      <span>{tx(label)}</span>
      <span className="pw-wrap">
        <input
          type={shown ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          placeholder={placeholder}
        />
        <button
          type="button"
          className="pw-toggle"
          onClick={() => setShown((s) => !s)}
          aria-pressed={shown}
          aria-label={toggleLabel}
          title={toggleLabel}
        >
          {shown ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </span>
    </label>
  );
}
