/**
 * Écran questionnaire progressif (Étape 4 — spec §5.2).
 * Une question à la fois, sauvegarde automatique À CHAQUE réponse (1 écriture),
 * reprise où on s'est arrêté, barre de progression par niveau, et récompense
 * immédiate « Ma personnalité » à la fin de chaque niveau (règles, pas d'IA).
 *
 * Navigation (Étape 4-ter — demande fondateur : « il n'y a même pas de bouton
 * retour si quelqu'un a fait une erreur », « pas de bouton pour sortir ») :
 *  - « ‹ Retour » → question PRÉCÉDENTE avec la réponse pré-remplie et
 *    modifiable (on peut corriger une erreur sans tout refaire) ;
 *  - « Sortir » → quitter à tout moment : tout est déjà enregistré, la reprise
 *    se fera à la première question sans réponse ;
 *  - après chaque réponse on avance automatiquement (les questions déjà
 *    répondues se re- répondent sans réafficher la récompense).
 *
 * P0 RUNTIME (33-c) — deux ajouts :
 *  - B.5b : CHRONOMÉTRAGE par item — performance.now() est relevé à
 *    l'affichage de chaque question (effet sur l'item courant) et la durée
 *    est envoyée en `responseMs` (entier ≥ 0) dans le body du PUT de
 *    sauvegarde. Tolérant : si l'API ignore le champ, rien ne casse.
 *  - BLOC 1 (contrat doctrine) : la banque `doctrine_v1` livrée par
 *    GET /api/qd prime quand elle est présente — formats `likert5` /
 *    `binaire_chronometre` rendus en boutons d'options (style existant),
 *    `ouverte` en zone de texte, tout autre format en carte non interactive
 *    « Passation guidée » (hors périmètre P0). Les items `isTrame` se
 *    rendent EXACTEMENT comme les autres : leur prompt porte le placeholder
 *    officiel (doctrine 11-b) — aucune difference d'affichage. Si la banque
 *    est absente (ou l'endpoint non livré), le flux legacy /api/q reste LA
 *    référence inchangée.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { api, ApiError } from '../lib/api';
import { PersonalityProposal } from './PersonalityProposal';
import {
  type QuestionnaireState,
  type QItem,
  type QAnswers,
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

// ---------------------------------------------------------------------------
// Contrat banque doctrine (BLOC 1 — P0 runtime, session 33-c). Types locaux :
// @wairyu/shared n'expose pas (encore) la banque doctrine — le contrat est
// recopié à l'identique de l'API et tolérant aux champs optionnels.
// ---------------------------------------------------------------------------
interface DoctrineOption {
  key: string;
  label: string;
}

interface DoctrineItem {
  code: string;
  monde: string;
  quete: string;
  position: number;
  format: string;
  prompt: string;
  options?: DoctrineOption[];
  maxSelect?: number;
  isTrame?: boolean;
}

interface DoctrineState {
  bank: 'doctrine_v1';
  items: DoctrineItem[];
  /** Réponses existantes par code (tolérant : champ omis si vide côté API). */
  myAnswers?: Record<string, string | string[]>;
  progress?: { done?: number; total?: number };
}

/** Libellés du gabarit de réponse, par format doctrine. */
const FORMAT_GUIDE: Record<string, string> = {
  likert5: 'Une réponse',
  binaire_chronometre: 'Choix binaire — chronométré',
  ouverte: 'Réponse libre',
};

/** Tri (niveau, position) — l'API renvoie déjà trié, on ne dépend pas de l'ordre. */
function byOrder(a: QItem, b: QItem): number {
  return a.level - b.level || a.position - b.position;
}

/** Tri doctrine : monde → quête → position (ordre numérique M2 < M10). */
function byDoctrine(a: DoctrineItem, b: DoctrineItem): number {
  return (
    a.monde.localeCompare(b.monde, 'fr', { numeric: true }) ||
    a.quete.localeCompare(b.quete, 'fr', { numeric: true }) ||
    a.position - b.position
  );
}

/** Sélection à afficher pour une question (réponse existante pré-remplie). */
function selectionFor(item: QItem, answers: QAnswers): string[] {
  const v = answers[item.id];
  if (item.kind === 'multi') return Array.isArray(v) ? [...v] : [];
  return typeof v === 'string' ? [v] : [];
}

/** Bascule d'une option multiple avec plafond doux (FIFO — même règle que legacy). */
function togglePlafonne(prev: string[], key: string, max?: number): string[] {
  if (prev.includes(key)) return prev.filter((k) => k !== key);
  const plafond = max ?? prev.length + 1;
  if (prev.length >= plafond) return [...prev.slice(1), key];
  return [...prev, key];
}

export function Questionnaire({ onDone, onDiscover }: Props) {
  const [state, setState] = useState<QuestionnaireState | null>(null);
  const [phase, setPhase] = useState<Phase>({ kind: 'loading' });
  /** Index de la question affichée dans la liste triée (navigation libre). */
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- banque doctrine (BLOC 1) : états parallèles, mutuellement exclusifs
  // avec `state` (dès que la doctrine est chargée, le flux legacy dort).
  const [doc, setDoc] = useState<DoctrineState | null>(null);
  const [docIdx, setDocIdx] = useState(0);
  const [docValue, setDocValue] = useState(''); // option simple / texte ouvert
  const [docMulti, setDocMulti] = useState<string[]>([]); // options multiples

  /**
   * B.5b — chrono par item : performance.now() relevé à l'AFFICHAGE de la
   * question courante (effet plus bas) ; la durée est relevée à la validation
   * (responseMsNow). Un seul chrono : les deux flux sont exclusifs.
   */
  const shownAtRef = useRef(0);

  function responseMsNow(): number {
    return shownAtRef.current > 0 ? Math.max(0, Math.round(performance.now() - shownAtRef.current)) : 0;
  }

  const items = useMemo(() => (state ? [...state.items].sort(byOrder) : []), [state]);
  const current = items[idx] ?? null;

  const docItems = useMemo(() => (doc ? [...doc.items].sort(byDoctrine) : []), [doc]);
  const docCurrent = docItems[docIdx] ?? null;

  // Chrono (B.5b) : à chaque AFFICHAGE d'une question (les deux flux).
  useEffect(() => {
    if (phase.kind !== 'question') return;
    if (doc ? !docCurrent : !current) return;
    shownAtRef.current = performance.now();
  }, [phase.kind, doc, docCurrent, current]);

  /** Affiche la question d'index i avec sa réponse pré-remplie. */
  const enterQuestion = useCallback((i: number, s: QuestionnaireState) => {
    const ordered = [...s.items].sort(byOrder);
    const item = ordered[i];
    if (!item) return;
    setIdx(i);
    setSelected(selectionFor(item, s.answers));
    setPhase({ kind: 'question' });
  }, []);

  /** Affiche l'item doctrine d'index i avec sa réponse pré-remplie. */
  const enterDoc = useCallback((i: number, d: DoctrineState, ordered: DoctrineItem[]) => {
    const item = ordered[i];
    if (!item) return;
    const v = d.myAnswers?.[item.code];
    setDocValue(typeof v === 'string' ? v : '');
    setDocMulti(Array.isArray(v) ? [...v] : []);
    setDocIdx(i);
    setPhase({ kind: 'question' });
  }, []);

  /** Premier point de reprise : 1re question sans réponse, sinon « terminé ». */
  const resume = useCallback((s: QuestionnaireState) => {
    const ordered = [...s.items].sort(byOrder);
    const nextIdx = ordered.findIndex((i) => s.answers[i.id] === undefined);
    if (nextIdx < 0) setPhase({ kind: 'finished' });
    else enterQuestion(nextIdx, s);
  }, [enterQuestion]);

  /** Reprise doctrine : 1er item sans réponse, sinon « terminé ». */
  const resumeDoc = useCallback(
    (d: DoctrineState) => {
      const ordered = [...d.items].sort(byDoctrine);
      const next = ordered.findIndex((i) => d.myAnswers?.[i.code] === undefined);
      if (next < 0) setPhase({ kind: 'finished' });
      else enterDoc(next, d, ordered);
    },
    [enterDoc],
  );

  const load = useCallback(async () => {
    // BLOC 1 (33-c) — la banque doctrine, quand l'API la livre, prime.
    // Toute absence (endpoint non livré, bank manquante, banque vide) →
    // le flux legacy /api/q reste inchangé.
    try {
      const d = await api<DoctrineState>('/api/qd');
      if (d && d.bank === 'doctrine_v1' && Array.isArray(d.items) && d.items.length > 0) {
        setDoc(d);
        resumeDoc(d);
        return;
      }
    } catch {
      /* pas de banque doctrine côté API → legacy */
    }
    try {
      const s = await api<QuestionnaireState>('/api/q');
      setState(s);
      resume(s);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Erreur inattendue.');
      setPhase({ kind: 'finished' });
    }
  }, [resume, resumeDoc]);

  useEffect(() => {
    void load();
  }, [load]);

  async function answer(itemId: string, value: string | string[]) {
    if (!state || !current) return;
    setBusy(true);
    setError(null);

    // Le niveau de CETTE question était-il déjà complet avant la réponse ?
    // (re-réponse après correction → pas de réaffichage de la récompense.)
    const lvlItems = items.filter((i) => i.level === current.level);
    const doneBefore = lvlItems.filter((i) => state.answers[i.id] !== undefined).length;
    const wasComplete = doneBefore >= lvlItems.length;

    try {
      const res = await api<{
        saved: true;
        progress: { n1: QProgress; n2: QProgress };
        levelCompleted: 1 | 2 | null;
        insights: LevelInsights | null;
      }>(`/api/q/answers/${encodeURIComponent(itemId)}`, {
        method: 'PUT',
        // B.5b : durée entre l'affichage de l'item et la validation (entier ms).
        json: { value, responseMs: responseMsNow() },
      });

      const merged: QuestionnaireState = {
        ...state,
        answers: { ...state.answers, [itemId]: value },
        progress: res.progress,
        insights: [
          ...state.insights.filter((b) => b.level !== res.insights?.level),
          ...(res.insights ? [res.insights] : []),
        ],
      };
      setState(merged);

      if (res.levelCompleted && !wasComplete) {
        // Première complétion du niveau → écran récompense « Ma personnalité ».
        setPhase({ kind: 'levelDone', insights: res.insights!, level: res.levelCompleted });
        setBusy(false);
        return;
      }
      // Sinon : question suivante (réponses pré-remplies) — ou fin si c'était la dernière.
      if (idx + 1 < items.length) enterQuestion(idx + 1, merged);
      else setPhase({ kind: 'finished' });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Erreur inattendue.');
    }
    setBusy(false);
  }

  /** PUT banque doctrine : { value, responseMs } — tolérant (si l'API ignore
   * responseMs, la réponse est sauvegardée pareil). */
  async function answerDoc(item: DoctrineItem, value: string | string[]) {
    if (!doc) return;
    setBusy(true);
    setError(null);
    try {
      await api<unknown>(`/api/qd/answers/${encodeURIComponent(item.code)}`, {
        method: 'PUT',
        json: { value, responseMs: responseMsNow() },
      });
      const merged: DoctrineState = {
        ...doc,
        myAnswers: { ...(doc.myAnswers ?? {}), [item.code]: value },
      };
      setDoc(merged);
      const ordered = [...merged.items].sort(byDoctrine);
      if (docIdx + 1 < ordered.length) enterDoc(docIdx + 1, merged, ordered);
      else setPhase({ kind: 'finished' });
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
    setSelected((prev) => togglePlafonne(prev, key, item.maxSelect));
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
  if (phase.kind === 'finished' && doc) {
    // Fin de banque doctrine — écran sobre (pas d'insights legacy).
    return (
      <div className="app">
        <header className="wizard-head">
          <button type="button" className="back" onClick={onDone} aria-label="Retour">‹</button>
          <h1>Mon questionnaire</h1>
        </header>
        <p className="q-done-note">
          Tu as répondu à tout ce qui t&apos;était proposé. Tes réponses restent enregistrées —
          tu peux les modifier quand tu veux.
        </p>
        <button type="button" className="btn primary" onClick={onDiscover}>
          Découvrir les profils
        </button>
        <button type="button" className="btn ghost" onClick={onDone}>
          Retour à mon compte
        </button>
      </div>
    );
  }

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
            if (state) resume(state);
            else setPhase({ kind: 'question' });
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

  // ------------------------------------------------------------------ question (banque doctrine — BLOC 1)
  if (doc && docCurrent) {
    const opts = docCurrent.options ?? [];
    const multi = !!docCurrent.maxSelect && docCurrent.maxSelect > 1;
    const boutons =
      (docCurrent.format === 'likert5' || docCurrent.format === 'binaire_chronometre') &&
      opts.length > 0;
    const ouverte = docCurrent.format === 'ouverte';
    const special = !boutons && !ouverte;
    const dejaRepondu = doc.myAnswers?.[docCurrent.code] !== undefined;
    // Progression : celle de l'API si elle est chiffrée, sinon comptage local.
    const doneApi = doc.progress?.done;
    const totalApi = doc.progress?.total;
    const done = typeof doneApi === 'number' ? doneApi : Object.keys(doc.myAnswers ?? {}).length;
    const total = typeof totalApi === 'number' ? totalApi : docItems.length;
    const pct = total === 0 ? 0 : Math.round((done / total) * 100);

    return (
      <div className="app">
        <header className="wizard-head q-head">
          {docIdx > 0 ? (
            <button
              type="button"
              className="back"
              onClick={() => enterDoc(docIdx - 1, doc, docItems)}
              aria-label="Question précédente"
            >
              ‹
            </button>
          ) : (
            <button type="button" className="back" onClick={onDone} aria-label="Quitter">‹</button>
          )}
          <h1>Questionnaire — {docCurrent.monde}</h1>
          <button type="button" className="q-exit" onClick={onDone}>
            Sortir
          </button>
        </header>

        <div className="q-progress">
          <div className="q-progress-bar">
            <div className="q-progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <span className="q-progress-label">
            {done}/{total} répondu · question {docIdx + 1}/{docItems.length}
          </span>
        </div>

        <div className="q-card">
          <span className="q-dim">
            {FORMAT_GUIDE[docCurrent.format] ?? 'Passation guidée'}
          </span>
          <h2 className="q-prompt">{docCurrent.prompt}</h2>

          {boutons && (
            <div className="q-options">
              {opts.map((o) => {
                const on = multi ? docMulti.includes(o.key) : docValue === o.key;
                return (
                  <button
                    key={o.key}
                    type="button"
                    disabled={busy}
                    className={`q-option ${on ? 'on' : ''}`}
                    aria-pressed={on}
                    onClick={() =>
                      multi
                        ? setDocMulti((prev) => togglePlafonne(prev, o.key, docCurrent.maxSelect))
                        : void answerDoc(docCurrent, o.key)
                    }
                  >
                    {o.label}
                  </button>
                );
              })}
            </div>
          )}

          {boutons && multi && (
            <button
              type="button"
              className="btn primary"
              disabled={busy || docMulti.length === 0}
              onClick={() => void answerDoc(docCurrent, [...docMulti])}
            >
              {busy ? 'Enregistrement…' : dejaRepondu ? 'Mettre à jour ma réponse' : 'Valider ma réponse'}
            </button>
          )}

          {ouverte && (
            <div className="q-opened">
              <textarea
                value={docValue}
                onChange={(e) => setDocValue(e.target.value)}
                placeholder="Écris librement — quelques mots suffisent…"
                rows={4}
                maxLength={600}
                aria-label="Ta réponse"
              />
              <button
                type="button"
                className="btn primary"
                disabled={busy || !docValue.trim()}
                onClick={() => void answerDoc(docCurrent, docValue.trim())}
              >
                {busy ? 'Enregistrement…' : dejaRepondu ? 'Mettre à jour ma réponse' : 'Valider ma réponse'}
              </button>
            </div>
          )}

          {special && (
            // Formats hors périmètre P0 (paire_images, arbre_familial,
            // double_croisee, scenario_refus, questions, declarations,
            // autre…) : carte NON interactive — passation guidée.
            <div className="q-special">
              <p className="q-special-title">Passation guidée — format spécial (hors périmètre P0)</p>
              <p className="hint">
                Cette étape est accompagnée lors d&apos;une passation guidée ; elle n&apos;est pas
                remplissable ici pour l&apos;instant. Tu peux revenir plus tard ou continuer.
              </p>
              <button
                type="button"
                className="btn ghost"
                disabled={busy}
                onClick={() => {
                  if (docIdx + 1 < docItems.length) enterDoc(docIdx + 1, doc, docItems);
                  else setPhase({ kind: 'finished' });
                }}
              >
                Continuer
              </button>
            </div>
          )}

          {error && <p className="error">{error}</p>}
          <p className="hint">
            Enregistré automatiquement — corrige une réponse avec « ‹ » ou sors et reprends quand
            tu veux.
          </p>
        </div>
      </div>
    );
  }

  // ------------------------------------------------------------------ question (flux legacy)
  if (!state || !current) {
    return (
      <div className="app">
        <p className="status"><span className="dot" /> Chargement…</p>
      </div>
    );
  }

  const pr = current.level === 1 ? state.progress.n1 : state.progress.n2;
  const answeredLabel = current.kind === 'multi' && selected.length > 0 ? `(${selected.length} choisi${selected.length > 1 ? 's' : ''})` : '';
  const alreadyAnswered = state.answers[current.id] !== undefined;

  return (
    <div className="app">
      <header className="wizard-head q-head">
        {idx > 0 ? (
          <button
            type="button"
            className="back"
            onClick={() => enterQuestion(idx - 1, state)}
            aria-label="Question précédente"
          >
            ‹
          </button>
        ) : (
          <button type="button" className="back" onClick={onDone} aria-label="Quitter">‹</button>
        )}
        <h1>Questionnaire — Niveau {current.level}</h1>
        <button type="button" className="q-exit" onClick={onDone}>
          Sortir
        </button>
      </header>

      <div className="q-progress">
        <div className="q-progress-bar">
          <div className="q-progress-fill" style={{ width: `${progressFor(pr)}%` }} />
        </div>
        <span className="q-progress-label">
          Niveau {pr.level} · {pr.done}/{pr.total} · question {idx + 1}/{items.length}
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
            {busy ? 'Enregistrement…' : alreadyAnswered ? 'Mettre à jour ma réponse' : 'Valider ma réponse'}
          </button>
        )}
        {error && <p className="error">{error}</p>}
        <p className="hint">
          Enregistré automatiquement — corrige une réponse avec « ‹ » ou sors et reprends quand
          tu veux.
        </p>
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
