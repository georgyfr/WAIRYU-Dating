/**
 * Écran questionnaire progressif (Étape 4 — spec §5.2).
 * Une question à la fois, sauvegarde automatique À CHAQUE réponse (1 écriture),
 * reprise où on s'est arrêté, barre de progression par niveau, et récompense
 * immédiate « Ma personnalité » à la fin de chaque niveau (règles, pas d'IA).
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { api, ApiError } from '../lib/api';
import { PersonalityProposal } from './PersonalityProposal';
import {
  type QuestionnaireState,
  type QItem,
  type QProgress,
  type LevelInsights,
} from '@wairyu/shared';

interface Props {
  onDone: () => void;
  /** Navigation vers la découverte une fois le questionnaire terminé. */
  onDiscover: () => void;
}

type Phase =
  | { kind: 'loading' }
  | { kind: 'question' }
  | { kind: 'levelDone'; insights: LevelInsights; level: 1 | 2 }
  | { kind: 'finished' };

/** Tri (niveau, position) — l'API renvoie déjà trié, on ne dépend pas de l'ordre. */
function byOrder(a: QItem, b: QItem): number {
  return a.level - b.level || a.position - b.position;
}

export function Questionnaire({ onDone, onDiscover }: Props) {
  const [state, setState] = useState<QuestionnaireState | null>(null);
  const [phase, setPhase] = useState<Phase>({ kind: 'loading' });
  const [selected, setSelected] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const items = useMemo(() => (state ? [...state.items].sort(byOrder) : []), [state]);
  const current = useMemo(
    () => (state ? items.find((i) => state.answers[i.id] === undefined) ?? null : null),
    [items, state],
  );

  const load = useCallback(async () => {
    try {
      const s = await api<QuestionnaireState>('/api/q');
      setState(s);
      const ordered = [...s.items].sort(byOrder);
      const next = ordered.find((i) => s.answers[i.id] === undefined);
      if (!next) setPhase({ kind: 'finished' });
      else setPhase({ kind: 'question' });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Erreur inattendue.');
      setPhase({ kind: 'finished' });
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function answer(itemId: string, value: string | string[]) {
    setBusy(true);
    setError(null);
    try {
      const res = await api<{
        saved: true;
        progress: { n1: QProgress; n2: QProgress };
        levelCompleted: 1 | 2 | null;
        insights: LevelInsights | null;
      }>(`/api/q/answers/${encodeURIComponent(itemId)}`, { method: 'PUT', json: { value } });

      setState((prev) =>
        prev
          ? {
              ...prev,
              answers: { ...prev.answers, [itemId]: value },
              progress: res.progress,
              insights: [
                ...prev.insights.filter((b) => b.level !== res.insights?.level),
                ...(res.insights ? [res.insights] : []),
              ],
            }
          : prev,
      );

      if (res.levelCompleted && res.insights) {
        setPhase({ kind: 'levelDone', insights: res.insights, level: res.levelCompleted });
      }
      // Sinon : le composant re-render automatiquement sur la question suivante.
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Erreur inattendue.');
    }
    setBusy(false);
  }

  function submitSingle(item: QItem, key: string) {
    if (busy) return;
    setSelected([key]);
    void answer(item.id, key);
  }

  function submitMulti(item: QItem) {
    if (busy || selected.length === 0) return;
    void answer(item.id, [...selected]);
  }

  function toggleMulti(item: QItem, key: string) {
    setSelected((prev) => {
      if (prev.includes(key)) return prev.filter((k) => k !== key);
      const max = item.maxSelect ?? prev.length + 1;
      if (prev.length >= max) return [...prev.slice(1), key]; // FIFO doux
      return [...prev, key];
    });
  }

  if (phase.kind === 'loading') {
    return (
      <div className="app">
        <p className="status"><span className="dot" /> Chargement du questionnaire…</p>
      </div>
    );
  }

  const progressFor = (p: QProgress): number =>
    p.total === 0 ? 0 : Math.round((p.done / p.total) * 100);

  // ------------------------------------------------------------------ états
  if (phase.kind === 'finished') {
    const insights = state?.insights ?? [];
    return (
      <div className="app">
        <header className="wizard-head">
          <button type="button" className="back" onClick={onDone} aria-label="Retour">‹</button>
          <h1>Mon questionnaire</h1>
        </header>
        <p className="q-done-note">
          Tu as répondu à toutes les questions actives. Tes réponses affinent ton score de
          compatibilité à chaque mise à jour — tu peux les modifier quand tu veux.
        </p>
        {insights.map((block) => (
          <InsightsCard key={block.level} block={block} />
        ))}
        <PersonalityProposal refine />
        <button type="button" className="btn primary" onClick={onDiscover}>
          Découvrir les profils
        </button>
        <button type="button" className="btn ghost" onClick={onDone}>
          Retour à mon compte
        </button>
      </div>
    );
  }

  if (phase.kind === 'levelDone') {
    return (
      <div className="app">
        <div className="q-reward">
          <div className="q-reward-star">✦</div>
          <h1>{phase.insights.title}</h1>
          <p className="q-reward-note">
            Niveau {phase.level} complété — {phase.level === 1
              ? 'ton matching de base est activé.'
              : 'ton score de compatibilité est maintenant détaillé.'}
          </p>
        </div>
        <InsightsCard block={phase.insights} />
        <PersonalityProposal refine={phase.level === 2} />
        <p className="hint">Le score est indicatif : il t&apos;aide à prioriser, il ne décide pas à ta place.</p>
        <button
          type="button"
          className="btn primary"
          onClick={() => {
            setSelected([]);
            setPhase({ kind: 'question' });
          }}
        >
          {phase.level === 1 ? 'Continuer le niveau 2' : 'Découvrir les profils'}
        </button>
        {phase.level === 1 ? (
          <button type="button" className="btn ghost" onClick={onDiscover}>
            Voir les profils membres
          </button>
        ) : (
          <button type="button" className="btn ghost" onClick={onDone}>
            Plus tard
          </button>
        )}
      </div>
    );
  }

  // ------------------------------------------------------------------ question
  if (!state || !current) {
    return (
      <div className="app">
        <p className="status"><span className="dot" /> Chargement…</p>
      </div>
    );
  }

  const pr = current.level === 1 ? state.progress.n1 : state.progress.n2;
  const answeredLabel = current.kind === 'multi' && selected.length > 0 ? `(${selected.length} choisi${selected.length > 1 ? 's' : ''})` : '';

  return (
    <div className="app">
      <header className="wizard-head">
        <button type="button" className="back" onClick={onDone} aria-label="Retour">‹</button>
        <h1>Questionnaire — Niveau {current.level}</h1>
      </header>

      <div className="q-progress">
        <div className="q-progress-bar">
          <div className="q-progress-fill" style={{ width: `${progressFor(pr)}%` }} />
        </div>
        <span className="q-progress-label">
          Niveau {pr.level} · {pr.done}/{pr.total}
        </span>
      </div>

      <div className="q-card">
        <span className="q-dim">{current.kind === 'multi' ? `Plusieurs choix ${answeredLabel}` : 'Une réponse'}</span>
        <h2 className="q-prompt">{current.prompt}</h2>
        <div className="q-options">
          {current.options.map((o) => {
            const on = selected.includes(o.key);
            return (
              <button
                key={o.key}
                type="button"
                disabled={busy}
                className={`q-option ${on ? 'on' : ''}`}
                onClick={() => (current.kind === 'multi' ? toggleMulti(current, o.key) : submitSingle(current, o.key))}
              >
                {o.label}
              </button>
            );
          })}
        </div>
        {current.kind === 'multi' && (
          <button
            type="button"
            className="btn primary"
            disabled={busy || selected.length === 0}
            onClick={() => submitMulti(current)}
          >
            {busy ? 'Enregistrement…' : 'Valider ma réponse'}
          </button>
        )}
        {error && <p className="error">{error}</p>}
        <p className="hint">Enregistré automatiquement — tu peux quitter et reprendre quand tu veux.</p>
      </div>
    </div>
  );
}

function InsightsCard({ block }: { block: LevelInsights }) {
  return (
    <div className="q-insights">
      <h3>{block.title}</h3>
      {block.lines.length === 0 ? (
        <p className="hint">Tes réponses dessinent ton profil — continue pour en voir plus.</p>
      ) : (
        <ul>
          {block.lines.map((l, i) => (
            <li key={i}>{l}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
