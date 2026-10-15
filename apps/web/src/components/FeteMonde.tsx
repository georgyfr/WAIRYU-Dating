/**
 * LA FÊTE DU MONDE (Task 98 — demande fondateur : « une page de célébration
 * avec effets spéciaux et d'animation ») — l'overlay plein écran qui s'ouvre
 * quand la personne quitte l'écran final de la quête qui clôt son monde.
 *
 * EFFETS (100 % CSS, zéro dépendance, zéro image) :
 *  - pluie de confettis (rectangles qui culbotent + few emojis chaleureux) ;
 *  - gerbe de rayons qui tourne lentement derrière l'emblème du monde ;
 *  - emblème du monde qui flotte dans un halo pulsant (couleurs du monde) ;
 *  - étincelles qui scintillent ;
 *  - `prefers-reduced-motion` : tout l'animationnel s'éteint, reste une page
 *    calme qui apparaît en fondu (accessibilité — la fête ne doit jamais
 *    devenir un handicap).
 *
 * HONNÊTETÉ (doctrine) : pas de score, pas de jauge, pas de comparaison.
 * La fête dit ce qui s'est passé — le monde est traversé — et rien d'autre.
 * Le contenu du monde (nom, numéro, couleurs, emoji) vient de WORLDS
 * (lib/voyage.ts) : FR et EN se localisent par le miroir existant.
 *
 * a11y : role=dialog aria-modal, focus posé sur le bouton, Échap ferme,
 * décor aria-hidden, cible tactile ≥ 44px (classes btn existantes).
 */
import './FeteMonde.css';
import { useEffect } from 'react';
import type { CSSProperties } from 'react';
import { useI18n } from '../i18n/I18nProvider';
import { WORLDS } from '../lib/voyage';

interface Props {
  /** Le code du monde traversé ('M1'…) — trouve nom, emoji et couleurs. */
  code: string;
  onFermer: () => void;
}

/** Les confettis — rectangles colorés (les couleurs de l'app et de la fête)
 *  mêlés à quelques emojis. Positions/délais/durées variés. */
const CONFETTIS: readonly { left: string; delay: string; dur: string; couleur?: string; emoji?: string }[] = [
  { left: '4%', delay: '0s', dur: '3.1s', couleur: '#fa6249' },
  { left: '11%', delay: '0.7s', dur: '3.6s', emoji: '🎉' },
  { left: '18%', delay: '0.2s', dur: '2.9s', couleur: '#45c0c6' },
  { left: '26%', delay: '1.1s', dur: '3.4s', couleur: '#e8a312' },
  { left: '33%', delay: '0.4s', dur: '3.2s', emoji: '✨' },
  { left: '41%', delay: '0.9s', dur: '3.8s', couleur: '#f5d76e' },
  { left: '49%', delay: '0.1s', dur: '3.0s', couleur: '#fa6249' },
  { left: '57%', delay: '1.3s', dur: '3.5s', emoji: '💜' },
  { left: '64%', delay: '0.6s', dur: '3.1s', couleur: '#45c0c6' },
  { left: '72%', delay: '0.3s', dur: '3.7s', couleur: '#f56b53' },
  { left: '80%', delay: '1.0s', dur: '3.3s', emoji: '🎉' },
  { left: '87%', delay: '0.5s', dur: '3.0s', couleur: '#e8a312' },
  { left: '94%', delay: '0.8s', dur: '3.6s', couleur: '#9fe0d6' },
  { left: '8%', delay: '1.6s', dur: '3.4s', couleur: '#f5d76e' },
  { left: '23%', delay: '1.9s', dur: '3.2s', emoji: '🫧' },
  { left: '38%', delay: '1.4s', dur: '3.9s', couleur: '#fa6249' },
  { left: '54%', delay: '1.8s', dur: '3.1s', couleur: '#45c0c6' },
  { left: '69%', delay: '2.1s', dur: '3.5s', emoji: '✨' },
  { left: '84%', delay: '1.5s', dur: '3.3s', couleur: '#e8a312' },
  { left: '97%', delay: '1.7s', dur: '3.8s', couleur: '#f56b53' },
];

/** Les étincelles fixes qui scintillent autour de la carte. */
const ETINCELLES: readonly { top: string; left: string; delay: string }[] = [
  { top: '14%', left: '12%', delay: '0s' },
  { top: '22%', left: '84%', delay: '0.8s' },
  { top: '64%', left: '7%', delay: '1.5s' },
  { top: '72%', left: '90%', delay: '0.4s' },
  { top: '40%', left: '4%', delay: '2.1s' },
  { top: '52%', left: '95%', delay: '1.2s' },
];

export default function FeteMonde({ code, onFermer }: Props) {
  const { tx } = useI18n();
  const monde = WORLDS.find((w) => w.code === code);

  // Échap ferme la fête (au même titre que le bouton).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onFermer();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onFermer]);

  if (!monde) return null;

  const styleMonde = { '--fm-bg': monde.tile.bg, '--fm-fg': monde.tile.fg } as CSSProperties;

  return (
    <div className="fm-backdrop" role="dialog" aria-modal="true" aria-labelledby="fm-titre">
      <div className="fm-ciel" aria-hidden="true">
        <div className="fm-rayons" />
        {CONFETTIS.map((c, i) => (
          <i
            key={i}
            className={c.emoji ? 'fm-conf-emoji' : 'fm-conf'}
            style={{ left: c.left, animationDelay: c.delay, animationDuration: c.dur, ...(c.couleur ? { background: c.couleur } : {}) }}
          >
            {c.emoji ?? ''}
          </i>
        ))}
        {ETINCELLES.map((s, i) => (
          <span key={i} className="fm-etincelle" style={{ top: s.top, left: s.left, animationDelay: s.delay }}>
            ✨
          </span>
        ))}
      </div>

      <div className="fm-carte" style={styleMonde}>
        <div className="fm-embleme" aria-hidden="true">
          <span>{monde.emoji}</span>
        </div>
        <p className="fm-kicker">{tx('Monde {{n}}', { n: monde.num })}</p>
        <h2 className="fm-titre" id="fm-titre">
          {tx('Monde traversé !')} <span aria-hidden="true">🎉</span>
        </h2>
        <p className="fm-nom">{monde.name}</p>
        <p className="fm-texte">
          {tx('Les {{n}} pas de ce monde sont derrière toi — ce que tu y as récolté reste à toi.', { n: monde.quests })}
        </p>
        <button type="button" className="btn btn-primary btn-block" onClick={onFermer} autoFocus>
          {tx('Continuer le voyage')} ✨
        </button>
      </div>
    </div>
  );
}
