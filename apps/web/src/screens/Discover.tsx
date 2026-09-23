/**
 * Découverte minimaliste (Étape 4) — liste paginée des candidats scorés.
 * Le swipe / les cartes / le dual-mode complet arrivent à l'Étape 5 : ici on
 * prouve la Gate 4 (score cohérent et explicable, « Pourquoi ce match ? »).
 * Éthique (spec §5.4) : l'avertissement d'indicativité est TOUJOURS visible.
 */
import { useCallback, useEffect, useState } from 'react';
import { api, ApiError } from '../lib/api';
import { ARCHETYPES, AFFINITY_LABELS, LABELS, type FeedResponse } from '@wairyu/shared';

interface Props {
  onBack: () => void;
}

export function Discover({ onBack }: Props) {
  const [data, setData] = useState<FeedResponse | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openWhy, setOpenWhy] = useState<string | null>(null);

  const load = useCallback(async (p: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api<FeedResponse>(`/api/feed?page=${p}`);
      setData((prev) => (p === 1 ? res : { ...res, items: [...(prev?.items ?? []), ...res.items] }));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Erreur inattendue.');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load(page);
    // Rechargement uniquement quand la page demandée change.
  }, [load, page]);

  return (
    <div className="app">
      <header className="wizard-head">
        <button type="button" className="back" onClick={onBack} aria-label="Retour">‹</button>
        <h1>Découvrir</h1>
      </header>

      {data === null && loading && (
        <p className="status"><span className="dot" /> Recherche de profils compatibles…</p>
      )}
      {error && <p className="error">{error}</p>}

      {data && data.items.length === 0 && !loading && (
        <p className="q-done-note">
          Aucun profil ne correspond à tes filtres pour l&apos;instant. Élargis ta distance, ta
          tranche d&apos;âge — ou passe en <strong>Mode interracial</strong> pour ouvrir ta
          découverte au monde entier (rencontres entre continents).
        </p>
      )}

      <div className="feed-list">
        {data?.items.map((p) => (
          <article key={p.userId} className="feed-card">
            {p.photoUrl && (
              <div className={`feed-photo ${p.photoBlurred ? 'blurred' : ''}`}>
                <img src={p.photoUrl} alt={p.displayName} loading="lazy" />
              </div>
            )}
            <div className="feed-body">
              <div className="feed-top">
                <h3>
                  {p.displayName}, {p.age}
                </h3>
                {p.score !== null && (
                  <span className="score-badge" title="Indicatif — jamais prédictif">
                    {p.score}
                    <small>/100</small>
                  </span>
                )}
              </div>
              <p className="feed-loc">
                {[p.city, p.country].filter(Boolean).join(', ') || 'Localisation non renseignée'}
                {p.photoBlurred ? ' · profil Invisible' : ''}
              </p>
              {p.personalityType && (
                <div className="pers-row">
                  <span
                    className={`chip chip-pers ${p.personalityValidated ? 'ok' : ''}`}
                    title={p.personalityValidated ? 'Personnalité validée par son auteur' : 'Personnalité proposée — pas encore validée'}
                  >
                    ✨ {ARCHETYPES[p.personalityType].name}
                    {p.personalityValidated ? ' ✓' : ''}
                  </span>
                  {p.personalityAffinity && (
                    <span
                      className={`chip chip-aff ${p.personalityAffinity}`}
                      title="Affinité de personnalité — indicatif, jamais prédictif"
                    >
                      {AFFINITY_LABELS[p.personalityAffinity]}
                    </span>
                  )}
                </div>
              )}
              {p.bio && <p className="feed-bio">{p.bio}</p>}
              <span className="chip">{LABELS.intent[p.intent] ?? 'Rencontres'}</span>

              {p.matchReasons && (
                <>
                  <button
                    type="button"
                    className="btn ghost why-toggle"
                    onClick={() => setOpenWhy((v) => (v === p.userId ? null : p.userId))}
                  >
                    {openWhy === p.userId ? 'Masquer' : 'Pourquoi ce match ?'}
                  </button>
                  {openWhy === p.userId && (
                    <div className="why-box">
                      <strong>Points forts</strong>
                      <ul>
                        {p.matchReasons.forces.map((f, i) => (
                          <li key={i}>{f}</li>
                        ))}
                      </ul>
                      <strong>À garder en tête</strong>
                      <p>{p.matchReasons.vigilance}</p>
                      <strong>Sujets de conversation</strong>
                      <ul>
                        {p.matchReasons.conversationStarters.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </div>
          </article>
        ))}
      </div>

      {data?.hasMore && (
        <button type="button" className="btn ghost" disabled={loading} onClick={() => setPage((p) => p + 1)}>
          {loading ? 'Chargement…' : 'Voir plus de profils'}
        </button>
      )}

      {data && data.items.length > 0 && (
        <p className="hint q-disclaimer">{data.disclaimer}</p>
      )}
    </div>
  );
}
