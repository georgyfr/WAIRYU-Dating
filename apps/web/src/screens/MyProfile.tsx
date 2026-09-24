/**
 * Page Mon profil (expérience dating classique — demande fondateur).
 *
 * TON profil tel que les autres membres le voient : photos navigables,
 * identité + badge vérifié, bio, prompts, personnalité (badge + raffinement),
 * préférences de découverte — avec des accès rapides : modifier le profil
 * (assistant), mon questionnaire, paramètres & compte.
 *
 * La page ne duplique AUCUNE donnée : tout vient de GET /api/profile
 * (URLs signées côté Worker — le propriétaire voit ses photos nettes).
 */
import { useState } from 'react';
import { useSwr } from '../lib/swr';
import { PersonalityBadge, PersonalityProposal } from './PersonalityProposal';
import { LABELS, PROMPT_LIBRARY, type ProfileResponse } from '@wairyu/shared';

interface Props {
  onEdit: () => void;
  onSettings: () => void;
  onQuestionnaire: () => void;
}

/** Âge exact depuis la date de naissance ISO (null si absente/incohérente). */
function ageOf(birthDate: string | null): number | null {
  if (!birthDate) return null;
  const d = new Date(`${birthDate}T00:00:00`);
  if (Number.isNaN(d.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
  return age >= 18 ? age : null;
}

export function MyProfile({ onEdit, onSettings, onQuestionnaire }: Props) {
  // Cache SWR : le profil s'affiche instantanément au retour sur l'onglet,
  // revalidé en arrière-plan (TTL 30 s — les modifications passent par
  // l'assistant qui invalide la clé « profile » après sauvegarde).
  const { data: prof, loading, error } = useSwr<ProfileResponse>('profile', true, {
    ttlMs: 30_000,
  });
  const [photoIdx, setPhotoIdx] = useState(0);
  const [showPers, setShowPers] = useState(false);

  if (error) {
    return (
      <div className="app page-profile">
        <header className="wizard-head plain"><h1>Mon profil</h1></header>
        <p className="error">{error}</p>
      </div>
    );
  }

  if (!prof || loading) {
    return (
      <div className="app page-profile">
        <header className="wizard-head plain"><h1>Mon profil</h1></header>
        <p className="status"><span className="dot" /> Chargement de ton profil…</p>
      </div>
    );
  }

  const age = ageOf(prof.birthDate);
  const photos = prof.photos.filter((p) => p.urlThumb || p.urlFull);
  const main = photos[Math.min(photoIdx, photos.length - 1)] ?? null;
  const promptLabel = (key: string) => PROMPT_LIBRARY.find((p) => p.key === key)?.label ?? key;
  const prefs = prof.preferences;

  return (
    <div className="app page-profile">
      <header className="wizard-head plain"><h1>Mon profil</h1></header>

      {!prof.profileComplete && (
        <p className="hint mode-note">
          Ton profil est incomplet — complète-le (photos, prompts, préférences) pour apparaître
          dans la découverte.
        </p>
      )}

      {/* La carte telle que l'autre la voit */}
      <article className="profile-card">
        <div className={`profile-photo ${main ? '' : 'empty'}`}>
          {main ? (
            <img src={(main.urlFull ?? main.urlThumb)!} alt="Ma photo principale" />
          ) : (
            <span aria-hidden="true">✨</span>
          )}
          {prof.profileComplete && (
            <span className="chip chip-conv classic profile-complete-chip">Profil complet</span>
          )}
        </div>

        {photos.length > 1 && (
          <div className="profile-thumbs" role="tablist" aria-label="Mes photos">
            {photos.map((p, i) => (
              <button
                key={p.id}
                type="button"
                role="tab"
                aria-selected={i === photoIdx}
                className={`profile-thumb ${i === photoIdx ? 'active' : ''}`}
                onClick={() => setPhotoIdx(i)}
              >
                <img src={(p.urlThumb ?? p.urlFull)!} alt={`Ma photo ${i + 1}`} loading="lazy" />
              </button>
            ))}
          </div>
        )}

        <div className="profile-id">
          <h2>
            {prof.displayName ?? 'Ton nom'}
            {age != null && <span>, {age}</span>}
          </h2>
          {(prof.neighborhood || prof.city || prof.country) && (
            <p className="profile-loc">
              📍 {[prof.neighborhood, prof.city, prof.country].filter(Boolean).join(', ')}
            </p>
          )}
          {prof.intent && (
            <p className="profile-intent">
              <span className="chip chip-pers">🎯 {LABELS.intent[prof.intent] ?? prof.intent}</span>
            </p>
          )}
        </div>

        {prof.bio && <p className="profile-bio">{prof.bio}</p>}

        {prof.prompts.length > 0 && (
          <div className="profile-prompts">
            {prof.prompts.map((p) => (
              <div key={p.key} className="prompt-card">
                <p className="prompt-q">{promptLabel(p.key)}</p>
                <p className="prompt-a">{p.answer}</p>
              </div>
            ))}
          </div>
        )}
      </article>

      {/* Personnalité — même bloc que le compte (badge + raffinement/choix) */}
      <PersonalityBadge onOpen={() => setShowPers((v) => !v)} />
      {showPers && <PersonalityProposal refine />}

      {prefs && (
        <article className="card profile-prefs">
          <h3>Mes préférences de découverte</h3>
          <p className="hint">
            Mode par défaut : <strong>{LABELS.mode[prefs.modeDefault] ?? prefs.modeDefault}</strong>
            {' · '}Montre-moi : <strong>{LABELS.prefGender[prefs.prefGender] ?? prefs.prefGender}</strong>
            {' · '}Âge : <strong>{prefs.minAge}–{prefs.maxAge} ans</strong>
            {' · '}Distance : <strong>{prefs.distanceKm} km</strong>
            {prefs.prefIntent && (
              <>
                {' · '}Intention : <strong>{LABELS.intent[prefs.prefIntent] ?? prefs.prefIntent}</strong>
              </>
            )}
          </p>
        </article>
      )}

      <div className="btn-col profile-actions">
        <button type="button" className="btn primary" onClick={onEdit}>
          Modifier mon profil
        </button>
        <button type="button" className="btn ghost" onClick={onQuestionnaire}>
          Mon questionnaire
        </button>
        <button type="button" className="btn ghost" onClick={onSettings}>
          Paramètres &amp; compte
        </button>
      </div>
    </div>
  );
}
