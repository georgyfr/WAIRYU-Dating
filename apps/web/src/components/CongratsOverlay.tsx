/**
 * Overlay de FÉLICITATIONS (exigence fondateur Étape 2) — affiché à la
 * CRÉATION d'un compte, quel que soit le canal (email / Google / Facebook /
 * pseudo). Le push OS et le journal in-app restent envoyés côté serveur,
 * mais la bulle OS peut être refusée par le navigateur : CET overlay est
 * la garantie visuelle universelle — impossible à manquer, affiché juste
 * après la liaison de l'appareil (link-device → congrats_pending).
 */
import './CongratsOverlay.css';
import { useI18n } from '../i18n/I18nProvider';

interface Props {
  /** Canal d'inscription renvoyé par link-device (congratsVia) — pilote le texte. */
  via: string | null;
  onClose: () => void;
}

const TEXTES: Record<string, string> = {
  google: 'Ton compte a été créé via Google.',
  facebook: 'Ton compte a été créé via Facebook.',
  password: 'Ton compte a été créé avec ton pseudo.',
  email: 'Ton compte a été créé avec ton adresse email.',
};

/** Petits confettis (décoratifs, aria-hidden) — positions/délais variés. */
const CONFETTIS = [
  { left: '8%', delay: '0s', dur: '2.6s', emoji: '🎉' },
  { left: '20%', delay: '0.5s', dur: '3.1s', emoji: '💜' },
  { left: '33%', delay: '0.2s', dur: '2.8s', emoji: '✨' },
  { left: '47%', delay: '0.9s', dur: '3.3s', emoji: '🫧' },
  { left: '60%', delay: '0.4s', dur: '2.5s', emoji: '✨' },
  { left: '72%', delay: '0.7s', dur: '3s', emoji: '🎉' },
  { left: '84%', delay: '0.1s', dur: '2.9s', emoji: '💜' },
  { left: '93%', delay: '0.6s', dur: '2.7s', emoji: '🫧' },
];

export default function CongratsOverlay({ via, onClose }: Props) {
  const { tx } = useI18n();
  const texte = tx(TEXTES[via ?? 'email'] ?? TEXTES.email);

  return (
    <div className="cg-backdrop" role="dialog" aria-modal="true" aria-label={tx('Bienvenue sur wairyu')}>
      <div className="cg-confetti" aria-hidden="true">
        {CONFETTIS.map((c, i) => (
          <i key={i} style={{ left: c.left, animationDelay: c.delay, animationDuration: c.dur }}>
            {c.emoji}
          </i>
        ))}
      </div>

      <div className="cg-card">
        <img src="/icons/icon-192.png" alt="" width={72} height={72} className="cg-logo" />
        <h2 className="cg-title">
          {tx('Bienvenue sur WAIRYU')} <span aria-hidden="true">🎉</span>
        </h2>
        <p className="cg-text">{texte}</p>
        <p className="cg-text">
          {tx(
            'Ton inscription est enregistrée — ta session reste active, plus jamais besoin de te réinscrire. Retrouve cette annonce et tes notifications dans le journal (onglet Profil).',
          )}
        </p>
        <button type="button" className="btn btn-primary btn-block" onClick={onClose} autoFocus>
          {tx("C'est parti")} ✨
        </button>
      </div>
    </div>
  );
}
