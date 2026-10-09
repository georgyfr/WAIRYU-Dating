/**
 * Sélecteur de date de naissance moderne (retour fondateur) — remplace le
 * <input type="date"> natif dont la molette système n'est pas maniable et
 * ne permettait pas de faire défiler les jours librement.
 *
 * Popup « molettes » (style iOS) : TROIS colonnes indépendantes — Jour,
 * Mois, Année — chacune déroulante à volonté (glisser, molette PC, clic sur
 * une valeur), avec accrochage central (scroll-snap) et bande de sélection.
 * Sortie : ISO AAAA-MM-JJ — même contrat que l'ancien champ, validation 18+
 * conservée (birthDateError) AVANT fermeture du popup.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { birthDateError } from '../lib/auth-client';
import { useI18n } from '../i18n/I18nProvider';

const ITEM_H = 44; // hauteur d'une ligne de molette (px)

const MOIS = [
  'Janvier',
  'Février',
  'Mars',
  'Avril',
  'Mai',
  'Juin',
  'Juillet',
  'Août',
  'Septembre',
  'Octobre',
  'Novembre',
  'Décembre',
];

/** Noms de mois EN (générés une fois — même liste capitalisée que la FR). */
const MOIS_EN = Array.from({ length: 12 }, (_, i) =>
  new Date(Date.UTC(2024, i, 1)).toLocaleDateString('en-IE', { month: 'long', timeZone: 'UTC' }),
);

function daysInMonth(year: number, month0: number): number {
  return new Date(Date.UTC(year, month0 + 1, 0)).getUTCDate();
}

const pad2 = (n: number) => String(n).padStart(2, '0');

/** Formate un ISO AAAA-MM-JJ en « 12 Mars 1998 » (affichage du déclencheur). */
function formatFr(iso: string, mois: readonly string[]): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return '';
  return `${Number(m[3])} ${mois[Number(m[2]) - 1]} ${m[1]}`;
}

interface WheelProps {
  items: string[];
  index: number;
  onSelect: (index: number) => void;
  label: string;
}

/** Une colonne déroulante : liste à accrochage central, sélection = ligne du milieu. */
function Wheel({ items, index, onSelect, label }: WheelProps) {
  const ref = useRef<HTMLUListElement>(null);
  const timer = useRef<number | undefined>(undefined);

  // Positionne la valeur courante au centre (sans animation) — y compris quand
  // l'index change depuis l'extérieur (changement de mois → jours ajustés).
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const target = index * ITEM_H;
    if (Math.abs(el.scrollTop - target) > 2) el.scrollTo({ top: target });
  }, [index]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  // Fin de défilement (120 ms de silence) → la ligne centrale devient la sélection.
  const onScroll = useCallback(() => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      const el = ref.current;
      if (!el) return;
      const i = Math.max(0, Math.min(items.length - 1, Math.round(el.scrollTop / ITEM_H)));
      if (i !== index) onSelect(i);
    }, 120);
  }, [items.length, index, onSelect]);

  const centerOn = (i: number) => {
    ref.current?.scrollTo({ top: i * ITEM_H, behavior: 'smooth' });
  };

  return (
    <ul
      className="dp-wheel"
      ref={ref}
      onScroll={onScroll}
      role="listbox"
      aria-label={label}
      tabIndex={0}
    >
      {items.map((it, i) => (
        <li
          key={`${it}-${i}`}
          className={i === index ? 'sel' : ''}
          aria-selected={i === index}
          onClick={() => centerOn(i)}
        >
          {it}
        </li>
      ))}
    </ul>
  );
}

interface Props {
  /** ISO AAAA-MM-JJ, ou « » si non renseigné. */
  value: string;
  onChange: (iso: string) => void;
  label: string;
  /** Fourni ⇒ bouton « Effacer » dans le popup (champ facultatif). */
  onClear?: () => void;
}

export default function BirthDatePicker({ value, onChange, label, onClear }: Props) {
  const { tx, lang } = useI18n();
  // Mois affichés : liste FR en dur (inchangée) ou mois EN lang-aware.
  const MOIS_LOC = lang === 'en' ? MOIS_EN : MOIS;
  const [open, setOpen] = useState(false);
  const [err, setErr] = useState('');

  // Année max = 18 ans révolus aujourd'hui ; liste DESCENDANTE (les années
  // courantes d'abord — la majorité des inscrits y sont).
  const now = new Date();
  const yMax = now.getUTCFullYear() - 18;
  const YEARS = Array.from({ length: yMax - 1930 + 1 }, (_, i) => yMax - i);

  // Sélection de travail (modifiable dans le popup sans toucher la valeur validée).
  const [py, setPy] = useState<number>(() => (value ? Number(value.slice(0, 4)) : now.getUTCFullYear() - 25));
  const [pm, setPm] = useState<number>(() => (value ? Number(value.slice(5, 7)) - 1 : 0));
  const [pd, setPd] = useState<number>(() => (value ? Number(value.slice(8, 10)) : 1));

  const days = Array.from({ length: daysInMonth(py, pm) }, (_, i) => i + 1);

  const openAt = () => {
    // (Ré)initialise la sélection de travail depuis la valeur validée.
    if (value) {
      setPy(Number(value.slice(0, 4)));
      setPm(Number(value.slice(5, 7)) - 1);
      setPd(Number(value.slice(8, 10)));
    } else {
      setPy(now.getUTCFullYear() - 25);
      setPm(0);
      setPd(1);
    }
    setErr('');
    setOpen(true);
  };

  // Blocage du scroll de fond pendant le popup + fermeture Escape.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // Changement de mois/année → le jour est ramené dans le mois (31 → 30, fév…).
  const changeMonth = (i: number) => {
    setPm(i);
    setPd((d) => Math.min(d, daysInMonth(py, i)));
  };
  const changeYear = (i: number) => {
    const y = YEARS[i];
    setPy(y);
    setPd((d) => Math.min(d, daysInMonth(y, pm)));
  };

  const confirm = () => {
    const iso = `${py}-${pad2(pm + 1)}-${pad2(pd)}`;
    const problem = birthDateError(iso);
    if (problem) {
      setErr(tx(problem));
      return;
    }
    onChange(iso);
    setOpen(false);
  };

  return (
    <div className="field">
      <span>{label}</span>
      <button type="button" className="dp-trigger" onClick={openAt} aria-haspopup="dialog">
        {value ? (
          formatFr(value, MOIS_LOC)
        ) : (
          <em>{tx('Sélectionner — Jour · Mois · Année')}</em>
        )}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="3" y="5" width="18" height="16" rx="3" stroke="currentColor" strokeWidth="2" />
          <path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle cx="8.5" cy="14.5" r="1.4" fill="currentColor" />
          <circle cx="12" cy="14.5" r="1.4" fill="currentColor" />
        </svg>
      </button>

      {open && (
        <div className="dp-backdrop" role="dialog" aria-modal="true" aria-label={label}>
          <div className="dp-sheet">
            <div className="dp-head">
              <strong className="dp-title">{tx('Date de naissance')}</strong>
              <button type="button" className="dp-close" onClick={() => setOpen(false)} aria-label={tx('Fermer')}>
                ✕
              </button>
            </div>

            <div className="dp-cols">
              <div className="dp-band" aria-hidden="true" />
              <Wheel items={days.map(String)} index={pd - 1} onSelect={(i) => setPd(i + 1)} label={tx('Jour')} />
              <Wheel items={MOIS_LOC} index={pm} onSelect={changeMonth} label={tx('Mois')} />
              <Wheel items={YEARS.map(String)} index={YEARS.indexOf(py)} onSelect={changeYear} label={tx('Année')} />
            </div>

            {err && (
              <p className="dp-error" role="alert">
                {err}
              </p>
            )}

            <div className="dp-actions">
              {onClear && (
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => {
                    onClear();
                    setOpen(false);
                  }}
                >
                  {tx('Effacer')}
                </button>
              )}
              <button type="button" className="btn btn-primary" onClick={confirm}>
                {tx('Choisir cette date')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
