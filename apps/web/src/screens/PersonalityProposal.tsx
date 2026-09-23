/**
 * « Ta personnalité » (Étape 4-bis — demande fondateur).
 *
 * Un seul composant réutilisable pour 3 écrans :
 *  - récompense fin de Niveau 1 (proposition + validation + alternatives) ;
 *  - récompense fin de Niveau 2 (version affinée, re-validation si changée) ;
 *  - Mon compte (badge + changement à tout moment).
 *
 * Le type n'est JAMAIS imposé : « C'est moi ✓ » le valide, « Plutôt ça ? »
 * bascule sur une alternative — et le changement reste possible pour toujours.
 */
import { useCallback, useEffect, useState } from 'react';
import { api, ApiError } from '../lib/api';
import {
  ARCHETYPES,
  type PersonalityState,
  type PersonalityUpdateResponse,
  type ArchetypeId,
} from '@wairyu/shared';

export function PersonalityProposal({ refine = false }: { refine?: boolean }) {
  const [state, setState] = useState<PersonalityState | null>(null);
  const [busy, setBusy] = useState<ArchetypeId | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setState(await api<PersonalityState>('/api/personality'));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Erreur inattendue.');
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function choose(id: ArchetypeId) {
    setBusy(id);
    setError(null);
    try {
      const res = await api<PersonalityUpdateResponse>('/api/personality', {
        method: 'PUT',
        json: { type: id },
      });
      setState((prev) => (prev ? { ...prev, current: res.current } : prev));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Erreur inattendue.');
    }
    setBusy(null);
  }

  if (!state) {
    return (
      <p className="status">
        <span className="dot" /> {error ?? 'Calcul de ta personnalité…'}
      </p>
    );
  }

  if (!state.ready) {
    return (
      <div className="pers-card pending">
        <p className="hint">
          Réponds au moins aux 10 premières questions du Niveau 1 — ta personnalité sera
          proposée ici, déduite de tes réponses.
        </p>
      </div>
    );
  }

  // Type affiché en grand :
  //  - écran normal : le type validé s'il existe, sinon la proposition du moteur ;
  //  - écran « affiné » : la NOUVELLE proposition (le but est de comparer) —
  //    avec un bouton « Garder » vers l'ancienne si différente.
  const current = state.current;
  const derived = state.suggestions[0]!.id;
  const mainType: ArchetypeId = !refine && current?.validated ? current.type : derived;
  // Robustesse : le type courant peut être un archétype hors ranking (choisi
  // depuis le compte) → vue synthétisée depuis le catalogue partagé.
  const mainView = state.suggestions.find((s) => s.id === mainType);
  const main =
    mainView ??
    (() => {
      const a = ARCHETYPES[mainType];
      return { id: a.id, score: 0, signals: [] as string[], name: a.name, tagline: a.tagline, description: a.description };
    })();
  const alternatives = state.suggestions.filter((s) => s.id !== mainType).slice(0, 2);
  const justConfirmed = current?.validated && current.type === mainType;
  const keepType = refine && current?.validated && current.type !== mainType ? current.type : null;

  return (
    <div className="pers-block">
      <div className="pers-head">
        <span className="pers-star">✨</span>
        <h2>{refine ? 'Ta personnalité affinée' : 'Ta personnalité'}</h2>
      </div>
      {refine && current?.validated && (
        <p className="hint">
          Le Niveau 2 affine le tableau : si la version affinée te ressemble mieux, valide-la —
          sinon garde la précédente, c&apos;est toi qui décides.
        </p>
      )}

      <div className="pers-card main">
        <div className="pers-top">
          <strong className="pers-name">{ARCHETYPES[main.id].name}</strong>
          {justConfirmed ? (
            <span className="pill ok">Ta personnalité ✓</span>
          ) : (
            <span className="pill">Proposée — à valider</span>
          )}
        </div>
        <p className="pers-tagline">{ARCHETYPES[main.id].tagline}</p>
        <p className="pers-desc">{ARCHETYPES[main.id].description}</p>
        {main.signals.length > 0 && (
          <p className="pers-signals">
            <strong>Pourquoi ?</strong> Tes réponses : {main.signals.join(' · ')}.
          </p>
        )}
        {!justConfirmed && (
          <button
            type="button"
            className="btn primary"
            disabled={busy !== null}
            onClick={() => choose(main.id)}
          >
            {busy === main.id ? 'Enregistrement…' : 'C\u2019est moi ✓'}
          </button>
        )}
        {keepType && (
          <button
            type="button"
            className="btn ghost"
            disabled={busy !== null}
            onClick={() => choose(keepType)}
          >
            Garder : {ARCHETYPES[keepType].name}
          </button>
        )}
      </div>

      {alternatives.length > 0 && (
        <div className="pers-alts">
          <p className="hint">
            {current?.validated ? 'Changer d\u2019avis ? Un clic — modifiable à tout moment.' : 'Pas tout à fait ?'}
          </p>
          {alternatives.map((alt) => (
            <button
              key={alt.id}
              type="button"
              className="pers-alt"
              disabled={busy !== null}
              onClick={() => choose(alt.id)}
            >
              <strong>{ARCHETYPES[alt.id].name}</strong>
              <span>{ARCHETYPES[alt.id].tagline}</span>
              <em>{busy === alt.id ? 'Enregistrement…' : 'Plutôt ça ?'}</em>
            </button>
          ))}
        </div>
      )}

      <p className="hint">{state.disclaimer}</p>
      {error && <p className="error">{error}</p>}
    </div>
  );
}

/** Badge compact (écran compte) — charge l'état et permet d'ouvrir le détail. */
export function PersonalityBadge({ onOpen }: { onOpen: () => void }) {
  const [state, setState] = useState<PersonalityState | null>(null);

  useEffect(() => {
    api<PersonalityState>('/api/personality')
      .then(setState)
      .catch(() => setState(null));
  }, []);

  if (!state) return null;
  if (!state.ready) {
    return (
      <div className="profile-cta">
        <div>
          <strong>Ma personnalité</strong>
          <p className="hint">
            Termine le Niveau 1 du questionnaire — ton archétype sera proposé ici, déduit de tes
            réponses et validé par toi.
          </p>
        </div>
        <button type="button" className="btn primary" onClick={onOpen}>
          Mon questionnaire
        </button>
      </div>
    );
  }

  const current = state.current;
  const type = current?.validated ? current.type : state.suggestions[0]!.id;
  const arch = ARCHETYPES[type];

  return (
    <div className="profile-cta">
      <div>
        <strong>
          Ma personnalité : {arch.name}{' '}
          {current?.validated ? (
            <span className="pill ok">validée ✓</span>
          ) : (
            <span className="pill">proposée</span>
          )}
        </strong>
        <p className="hint">{arch.tagline} — modifiable à tout moment.</p>
      </div>
      <button type="button" className="btn primary" onClick={onOpen}>
        {current?.validated ? 'Voir / changer' : 'Valider maintenant'}
      </button>
    </div>
  );
}
