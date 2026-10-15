/**
 * LE PORTAIL DE LA RENCONTRE (Task 99 — demande fondateur : « la plateforme
 * de rencontre doit être déclenchée quand l'utilisateur a fini les quêtes du
 * monde 1 avec ses récoltes méritées. Un choix d'accéder au site de rencontre
 * ou de continuer le voyage se présente. Il choisira ce qu'il souhaite. »)
 *
 * S'ouvre à la FERMETURE de la fête du Monde 1 (FeteMonde, Task 98) — la
 * célébration d'abord, le choix ensuite. C'est un SEUIL, pas une fête :
 * ambiance cérémoniale (rayons lents, lueurs qui montent, halo pulsant
 * autour des deux anneaux entrelacés — l'emblème de la Rencontre), bilan
 * honnête des récoltes méritées (les cartes du monde, état RÉEL), puis les
 * DEUX chemins côte à côte.
 *
 * LE CHOIX N'EST PAS UN VERROU : les deux boutons naviguent, la tab
 * « Rencontres » reste visible au jalon A (Task 94) et le voyage reste
 * accessible partout — « il choisira ce qu'il souhaite ».
 *
 * a11y : role=dialog aria-modal, Échap = continuer le voyage (le choix sûr),
 * focus sur le titre (aucun biais entre les deux chemins), décor aria-hidden,
 * `prefers-reduced-motion` éteint tout l'animationnel, cibles tactiles
 * ≥ 44px (classes btn existantes). 100 % CSS, zéro dépendance, zéro image.
 */
import './PortailRencontre.css';
import { useEffect, useMemo } from 'react';
import type { CSSProperties } from 'react';
import { useI18n } from '../i18n/I18nProvider';
import { WORLDS } from '../lib/voyage';
import { recoltesDuMonde } from '../lib/progression';

interface Props {
  /** Le code du monde au seuil duquel le portail s'ouvre ('M1'). */
  code: string;
  /** « Entrer sur WAIRYU Rencontre » — le premier chemin. */
  onEntrer: () => void;
  /** « Continuer le voyage » — le second chemin (Échap mène ici). */
  onContinuer: () => void;
}

/** Les lueurs qui montent — l'or des récoltes s'élève, sobre (pas de
 *  confettis : le portail n'est pas une fête, c'est un seuil). */
const LUEURS: readonly { left: string; delay: string; dur: string; size: string }[] = [
  { left: '6%', delay: '0s', dur: '7.5s', size: '7px' },
  { left: '15%', delay: '2.1s', dur: '8.6s', size: '5px' },
  { left: '24%', delay: '4.4s', dur: '7.9s', size: '9px' },
  { left: '34%', delay: '1.2s', dur: '9.4s', size: '6px' },
  { left: '44%', delay: '3.6s', dur: '8.2s', size: '8px' },
  { left: '55%', delay: '0.8s', dur: '7.7s', size: '5px' },
  { left: '65%', delay: '5.2s', dur: '9.1s', size: '8px' },
  { left: '74%', delay: '2.9s', dur: '8.8s', size: '6px' },
  { left: '83%', delay: '4.8s', dur: '7.4s', size: '9px' },
  { left: '92%', delay: '1.7s', dur: '8.4s', size: '7px' },
];

/** Les étincelles fixes autour de l'emblème. */
const ETINCELLES: readonly { top: string; left: string; delay: string }[] = [
  { top: '18%', left: '16%', delay: '0s' },
  { top: '24%', left: '82%', delay: '0.9s' },
  { top: '58%', left: '9%', delay: '1.6s' },
  { top: '66%', left: '89%', delay: '0.5s' },
  { top: '38%', left: '6%', delay: '2.2s' },
];

export default function PortailRencontre({ code, onEntrer, onContinuer }: Props) {
  const { tx } = useI18n();
  const monde = WORLDS.find((w) => w.code === code);
  const recoltes = useMemo(() => recoltesDuMonde(code), [code]);

  // Échap = continuer le voyage (le choix sûr — jamais de navigation forcée).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onContinuer();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onContinuer]);

  if (!monde) return null;

  const styleMonde = { '--pr-fg': monde.tile.fg, '--pr-bg': monde.tile.bg } as CSSProperties;

  return (
    <div className="pr-backdrop" role="dialog" aria-modal="true" aria-labelledby="pr-titre">
      <div className="pr-ciel" aria-hidden="true">
        <div className="pr-rayons" />
        {LUEURS.map((l, i) => (
          <i
            key={i}
            className="pr-lueur"
            style={{ left: l.left, width: l.size, height: l.size, animationDelay: l.delay, animationDuration: l.dur }}
          />
        ))}
        {ETINCELLES.map((s, i) => (
          <span key={i} className="pr-etincelle" style={{ top: s.top, left: s.left, animationDelay: s.delay }}>
            ✨
          </span>
        ))}
      </div>

      <div className="pr-carte" style={styleMonde}>
        {/* Les deux anneaux entrelacés — l'emblème de la Rencontre. */}
        <div className="pr-embleme" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="54" height="54" fill="none" stroke="currentColor" strokeWidth="1.7">
            <circle cx="9" cy="14" r="5.2" />
            <circle cx="15" cy="10" r="5.2" />
          </svg>
        </div>
        {/* Le nom du monde porte déjà son article (« Le Miroir » / « The Mirror »)
            — la clé ne reprend donc PAS d'article devant {{nom}}. */}
        <p className="pr-kicker">{tx('{{nom}} est traversé', { nom: monde.name })}</p>
        <h2 className="pr-titre" id="pr-titre" tabIndex={-1}>
          {tx('Un seuil s’ouvre devant toi')}
        </h2>
        <p className="pr-texte">
          {tx(
            'Tu as franchi les {{n}} pas de ce monde et tes récoltes t’accompagnent. Deux chemins s’offrent à toi — choisis celui que tu veux : tu pourras toujours passer de l’un à l’autre.',
            { n: monde.quests },
          )}
        </p>

        {/* Les récoltes méritées — les cartes RÉELLES du monde. */}
        {recoltes.length > 0 && (
          <>
            <p className="pr-recoltes-titre">{tx('Tes récoltes méritées')}</p>
            <ul className="pr-recoltes">
              {recoltes.map((r) => (
                <li key={r.queteId} className="pr-recolte">
                  <span className="pr-recolte-carte">{r.carteNom}</span>
                  <span className="pr-recolte-quete">{r.titre}</span>
                </li>
              ))}
            </ul>
          </>
        )}

        <div className="pr-choix">
          <button type="button" className="btn btn-primary btn-block pr-choix-btn" onClick={onEntrer}>
            {tx('Entrer sur WAIRYU Rencontre')}
            <span className="pr-choix-sous">{tx('Découvre ceux qui, comme toi, ont traversé leur Miroir.')}</span>
          </button>
          <button type="button" className="btn btn-outline btn-block pr-choix-btn" onClick={onContinuer}>
            {tx('Continuer le voyage')}
            <span className="pr-choix-sous">{tx('Ton portrait continue de se dessiner — d’autres mondes t’attendent.')}</span>
          </button>
        </div>
        <p className="pr-foot">{tx('La rencontre n’est jamais payante.')}</p>
      </div>
    </div>
  );
}
