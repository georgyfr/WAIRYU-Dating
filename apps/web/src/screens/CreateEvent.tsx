/**
 * Wairyu Moments — écran CRÉER (Task 39, demande fondateur : PROMPT
 * « Wairyu Moments ») — formulaire complet d'événement, accessible via le
 * bouton central « + » de la navigation (#/events/creer).
 *
 * 8 types d'événements en grille, titre, description, date+heure, lieu,
 * places+prix, audience (chips), règles optionnelles, check-in obligatoire
 * (switch) — puis publication : l'événement rejoint « Mes événements →
 * Organisés » (persistance locale) avec un statut « en attente de
 * validation wairyu » honnête (la modération réelle activera avec le
 * backend événementiel).
 */
import { useState } from 'react';
import { toast } from '../lib/toast';
import { addCreated, type EvEvent, type EvType } from '../lib/events';

const TYPES: { id: EvType; label: string; emoji: string }[] = [
  { id: 'cocktail', label: 'Cocktail', emoji: '🍸' },
  { id: 'diner', label: 'Dîner', emoji: '🍽️' },
  { id: 'atelier', label: 'Atelier', emoji: '🎨' },
  { id: 'sport', label: 'Sport', emoji: '🏃' },
  { id: 'culture', label: 'Culture', emoji: '🎭' },
  { id: 'speed', label: 'Speed', emoji: '💫' },
  { id: 'rando', label: 'Rando', emoji: '⛰️' },
  { id: 'soiree', label: 'Soirée', emoji: '🎉' },
];

const AUDIENCES = ['Célibataires', 'Tous', 'Interculturel', 'Femmes'] as const;

const GRADIENTS: Record<EvType, string> = {
  cocktail: 'ev-g1',
  diner: 'ev-g2',
  atelier: 'ev-g3',
  sport: 'ev-g4',
  culture: 'ev-g5',
  speed: 'ev-g6',
  rando: 'ev-g7',
  soiree: 'ev-g8',
};

/** Date ISO par défaut : dans 7 jours. */
function defaultDate(): string {
  return new Date(Date.now() + 7 * 86_400_000).toISOString().slice(0, 10);
}

interface Props {
  onPublished: () => void;
  onBack: () => void;
  onBackToDating: () => void;
}

export function CreateEvent({ onPublished, onBack, onBackToDating }: Props) {
  const [type, setType] = useState<EvType>('cocktail');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [date, setDate] = useState(defaultDate());
  const [time, setTime] = useState('19:00');
  const [place, setPlace] = useState('');
  const [max, setMax] = useState(20);
  const [price, setPrice] = useState(0);
  const [audience, setAudience] = useState<(typeof AUDIENCES)[number]>('Célibataires');
  const [rules, setRules] = useState('');
  const [checkinRequired, setCheckinRequired] = useState(true);

  const submit = () => {
    if (!title.trim()) {
      toast('Ajoute un titre à ton événement', 'error');
      return;
    }
    if (!place.trim()) {
      toast('Où se déroule ton événement ? Ajoute un lieu', 'error');
      return;
    }
    const ev: EvEvent = {
      id: `c${Date.now()}`,
      type,
      typeLabel: TYPES.find((t) => t.id === type)?.label ?? 'Soirée',
      emoji: TYPES.find((t) => t.id === type)?.emoji ?? '🎉',
      title: title.trim(),
      dateISO: date || defaultDate(),
      time: time || '19:00',
      place: place.trim(),
      distanceKm: 0,
      price: Math.max(0, Math.round(price)),
      desc:
        desc.trim() ||
        'Ton hôte n\'a pas encore écrit la description — surprends-toi : viens et découvre.',
      coverSeed: 'wairyu-user',
      gradient: GRADIENTS[type],
      attendees: [],
      count: 0,
      max: Math.max(2, Math.round(max)),
      organizer: 'Toi',
      rules: rules.trim() || undefined,
    };
    addCreated(ev);
    toast('🎉 Événement publié ! En attente de validation wairyu.', 'success');
    onPublished();
  };

  return (
    <div className="app ev-page events-create">
      <header className="ev-head">
        <div className="ev-brand-row">
          <span className="ev-logo">📅 Wairyu</span>
          <button type="button" className="ev-mode-badge" onClick={onBackToDating} aria-label="Revenir au mode rencontre">
            Moments · actif
          </button>
          <span className="ev-head-spacer" />
          <button type="button" className="ev-head-btn" onClick={onBack}>
            ← Découvrir
          </button>
        </div>
      </header>

      <header className="wizard-head plain">
        <h1>➕ Crée ton événement</h1>
        <p className="wizard-sub">
          Soirée, atelier, rando… les meilleurs événements sont ceux des
          membres. Publication gratuite, après validation de l'équipe.
        </p>
      </header>

      <div className="ev-form">
        {/* 1 — Type */}
        <section className="ev-form-sec">
          <h2>1 · Type d'événement</h2>
          <div className="ev-type-grid">
            {TYPES.map((t) => (
              <button
                key={t.id}
                type="button"
                className={`ev-type-btn ${type === t.id ? 'active' : ''}`}
                onClick={() => setType(t.id)}
                aria-pressed={type === t.id}
              >
                <span aria-hidden="true">{t.emoji}</span>
                {t.label}
              </button>
            ))}
          </div>
        </section>

        {/* 2 — Titre */}
        <section className="ev-form-sec">
          <h2>2 · Titre</h2>
          <input
            type="text"
            className="ev-input"
            placeholder="Ex. : Afterwork interculturel à Bonanjo"
            value={title}
            maxLength={80}
            onChange={(e) => setTitle(e.target.value)}
          />
        </section>

        {/* 3 — Description */}
        <section className="ev-form-sec">
          <h2>3 · Description</h2>
          <textarea
            className="ev-input ev-textarea"
            placeholder="Ambiance, déroulé, ce qui est inclus… donne envie de venir !"
            value={desc}
            rows={4}
            onChange={(e) => setDesc(e.target.value)}
          />
        </section>

        {/* 4 — Date + Heure */}
        <section className="ev-form-sec">
          <h2>4 · Quand ?</h2>
          <div className="ev-form-row">
            <input
              type="date"
              className="ev-input"
              value={date}
              min={defaultDate()}
              onChange={(e) => setDate(e.target.value)}
              aria-label="Date"
            />
            <input
              type="time"
              className="ev-input"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              aria-label="Heure"
            />
          </div>
        </section>

        {/* 5 — Lieu */}
        <section className="ev-form-sec">
          <h2>5 · Lieu</h2>
          <input
            type="text"
            className="ev-input"
            placeholder="Ville · quartier — nom du lieu"
            value={place}
            onChange={(e) => setPlace(e.target.value)}
          />
        </section>

        {/* 6 — Places + Prix */}
        <section className="ev-form-sec">
          <h2>6 · Places & prix</h2>
          <div className="ev-form-row">
            <label className="ev-field">
              <span>Places</span>
              <input
                type="number"
                className="ev-input"
                min={2}
                max={500}
                value={max}
                onChange={(e) => setMax(Number(e.target.value))}
              />
            </label>
            <label className="ev-field">
              <span>Prix (FCFA, 0 = gratuit)</span>
              <input
                type="number"
                className="ev-input"
                min={0}
                step={500}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
            </label>
          </div>
        </section>

        {/* 7 — Public */}
        <section className="ev-form-sec">
          <h2>7 · Public</h2>
          <div className="ev-chip-row">
            {AUDIENCES.map((a) => (
              <button
                key={a}
                type="button"
                className={`ev-chip ${audience === a ? 'active' : ''}`}
                onClick={() => setAudience(a)}
              >
                {a}
              </button>
            ))}
          </div>
        </section>

        {/* 8 — Règles (optionnel) */}
        <section className="ev-form-sec">
          <h2>8 · Règles (optionnel)</h2>
          <textarea
            className="ev-input ev-textarea"
            placeholder="Ex. : ponctualité, respect obligatoire, dress code…"
            value={rules}
            rows={2}
            onChange={(e) => setRules(e.target.value)}
          />
        </section>

        {/* 9 — Sécurité */}
        <section className="ev-form-sec">
          <h2>9 · Sécurité</h2>
          <div className="ev-switch-row">
            <span>Check-in QR obligatoire à l'entrée</span>
            <button
              type="button"
              className={`ev-switch ${checkinRequired ? 'on' : ''}`}
              role="switch"
              aria-checked={checkinRequired}
              onClick={() => setCheckinRequired(!checkinRequired)}
            />
          </div>
          <p className="ev-form-hint">
            Le check-in protège tout le monde : seuls les billets vérifiés
            entrent, et les Missed Connections ne s'ouvrent qu'entre
            participants confirmés.
          </p>
        </section>
      </div>

      {/* Bouton sticky de publication */}
      <div className="ev-publish-bar">
        <button type="button" className="ev-btn ev-btn-solid wide" onClick={submit}>
          🚀 Publier l'événement
        </button>
      </div>
    </div>
  );
}
