/**
 * Assistant de création/édition de profil (Étape 3) — 6 étapes guidées :
 *  1. Identité (prénom, année de naissance, genre)
 *  2. Orientation + intention + CONSENTEMENT EXPLICITE dédié
 *  3. Ville + géolocalisation approximative (≈11 km, jamais de GPS précis) + bio
 *  4. 3 prompts de personnalité (bibliothèque partagée)
 *  5. Photos — pipeline client (recadrage 4:5 + WebP) → Worker → Cloudinary
 *  6. Préférences de découverte + choix du mode (écran explicatif)
 *
 * Sauvegarde à chaque étape (reprise possible en cas d'abandon — /api/profile
 * est rechargé au montage et pré-remplit tout).
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { api, apiForm, ApiError } from '../lib/api';
import { processPhoto, PhotoError } from '../lib/photo';
import {
  LABELS,
  ORIENTATIONS,
  PROFILE_LIMITS,
  PROMPT_LIBRARY,
  PROMPT_KEYS,
} from '@wairyu/shared';
import type {
  DiscoveryMode,
  Gender,
  Intent,
  Orientation as OrientationType,
  PreferencesDto,
  ProfileResponse,
  PromptInput,
} from '@wairyu/shared';

interface Props {
  onDone: () => void;
}

const CURRENT_YEAR = new Date().getFullYear();
const MIN_BIRTH_YEAR = CURRENT_YEAR - 99;
const MAX_BIRTH_YEAR = CURRENT_YEAR - 18;

function ageFrom(year: number): number {
  return CURRENT_YEAR - year;
}

export function Profile({ onDone }: Props) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- Étapes 1-3 : basics
  const [displayName, setDisplayName] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [gender, setGender] = useState<Gender | ''>('');
  const [orientation, setOrientation] = useState<OrientationType | ''>('');
  const [intent, setIntent] = useState<Intent | ''>('');
  const [consent, setConsent] = useState(false);
  const [consentAlreadyGiven, setConsentAlreadyGiven] = useState(false);
  const [city, setCity] = useState('');
  const [geoRegion, setGeoRegion] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);
  const [bio, setBio] = useState('');

  // --- Étape 4 : prompts
  const [prompts, setPrompts] = useState<PromptInput[]>([
    { key: '', answer: '' },
    { key: '', answer: '' },
    { key: '', answer: '' },
  ]);

  // --- Étape 5 : photos (source de vérité = GET /api/profile)
  const [photos, setPhotos] = useState<ProfileResponse['photos']>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Étape 6 : préférences
  const [modeDefault, setModeDefault] = useState<DiscoveryMode>('classic');
  const [prefGender, setPrefGender] = useState<PreferencesDto['prefGender']>('everyone');
  const [minAge, setMinAge] = useState(25);
  const [maxAge, setMaxAge] = useState(45);
  const [distanceKm, setDistanceKm] = useState(100);
  const [prefIntent, setPrefIntent] = useState<Intent | ''>('');

  const reload = useCallback(async () => {
    const p = await api<ProfileResponse>('/api/profile').catch(() => null);
    if (p) {
      setDisplayName(p.displayName ?? '');
      setBirthYear(p.birthYear ? String(p.birthYear) : '');
      setGender((p.gender as Gender) ?? '');
      setOrientation((p.orientation as OrientationType) ?? '');
      setIntent((p.intent as Intent) ?? '');
      setConsentAlreadyGiven(p.profileConsentAt !== null);
      setConsent(p.profileConsentAt !== null);
      setCity(p.city ?? '');
      setGeoRegion(p.geoRegion);
      setBio(p.bio ?? '');
      if (p.prompts.length > 0) {
        const filled = [...p.prompts];
        while (filled.length < 3) filled.push({ key: '', answer: '' });
        setPrompts(filled.slice(0, 3));
      }
      setPhotos(p.photos);
      if (p.preferences) {
        setModeDefault(p.preferences.modeDefault);
        setPrefGender(p.preferences.prefGender);
        setMinAge(p.preferences.minAge);
        setMaxAge(p.preferences.maxAge);
        setDistanceKm(p.preferences.distanceKm);
        setPrefIntent(p.preferences.prefIntent ?? '');
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  async function save(json: unknown): Promise<boolean> {
    try {
      await api('/api/profile', { method: 'PUT', json });
      return true;
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Erreur inattendue.');
      return false;
    }
  }

  async function next() {
    setError(null);
    setBusy(true);
    let ok = false;

    if (step === 1) {
      const year = Number(birthYear);
      ok = await save({
        displayName,
        birthYear: year,
        gender,
      });
    } else if (step === 2) {
      ok = await save({ orientation, intent, consentAccepted: consent });
    } else if (step === 3) {
      ok = await save({ city, geoRegion, bio });
    } else if (step === 4) {
      const filled = prompts.filter((p) => p.key && p.answer.trim());
      ok = await save({ prompts: filled });
    } else if (step === 5) {
      ok = photos.length >= 1; // photos déjà committées une à une
    }
    // Étape 6 → finish()

    if (ok) setStep((s) => Math.min(6, s + 1));
    setBusy(false);
  }

  async function finish() {
    setError(null);
    setBusy(true);
    try {
      await api('/api/profile/preferences', {
        method: 'PUT',
        json: {
          modeDefault,
          prefGender,
          minAge,
          maxAge,
          distanceKm,
          prefIntent: prefIntent || null,
        },
      });
      onDone();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Erreur inattendue.');
      setBusy(false);
    }
  }

  function useMyLocation() {
    if (!navigator.geolocation) {
      setError('Géolocalisation indisponible — indique ta ville manuellement.');
      return;
    }
    setLocating(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        // Arrondi au dixième de degré ≈ 11 km — JAMAIS de position précise.
        const lat = Math.round(pos.coords.latitude * 10) / 10;
        const lon = Math.round(pos.coords.longitude * 10) / 10;
        setGeoRegion(`geo:${lat.toFixed(1)},${lon.toFixed(1)}`);
        setLocating(false);
      },
      () => {
        setError('Position refusée — indique ta ville manuellement.');
        setLocating(false);
      },
      { timeout: 8000 },
    );
  }

  async function addPhoto(file: File) {
    setError(null);
    setUploading(true);
    try {
      const processed = await processPhoto(file);
      const form = new FormData();
      form.append('photo', processed.blob, 'photo');
      form.append('width', String(processed.width));
      form.append('height', String(processed.height));
      const res = await apiForm<{ photo: ProfileResponse['photos'][number] }>('/api/profile/photos', form);
      setPhotos((prev) => [...prev, res.photo]);
    } catch (err) {
      if (err instanceof PhotoError || err instanceof ApiError) setError(err.message);
      else setError('Erreur pendant le traitement de la photo.');
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function movePhoto(index: number, delta: number) {
    const next = [...photos];
    const target = index + delta;
    if (target < 0 || target >= next.length) return;
    const a = next[index];
    const b = next[target];
    if (!a || !b) return;
    next[index] = b;
    next[target] = a;
    setPhotos(next);
    try {
      await api('/api/profile/photos/reorder', { json: { order: next.map((p) => p.id) } });
    } catch {
      void reload();
    }
  }

  async function removePhoto(id: string) {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
    try {
      await api(`/api/profile/photos/${id}`, { method: 'DELETE', json: {} });
    } catch {
      void reload();
    }
  }

  function setPromptSlot(index: number, patch: Partial<PromptInput>) {
    setPrompts((prev) => prev.map((p, i) => (i === index ? { ...p, ...patch } : p)));
  }

  // ---------- Validations locales ----------
  const year = Number(birthYear);
  const ageOk = Number.isInteger(year) && year >= MIN_BIRTH_YEAR && year <= MAX_BIRTH_YEAR;
  const step1Ok = displayName.trim().length >= PROFILE_LIMITS.displayNameMin && ageOk && gender !== '';
  const step2Ok = orientation !== '' && intent !== '' && (consent || consentAlreadyGiven);
  const step3Ok = city.trim().length >= PROFILE_LIMITS.cityMin && bio.trim().length > 0 && bio.length <= PROFILE_LIMITS.bioMax;
  const usedKeys = prompts.map((p) => p.key);
  const step4Ok = prompts.every((p) => p.key && p.answer.trim().length > 0) && new Set(usedKeys).size === 3;
  const step5Ok = photos.length >= 1;
  const step6Ok = maxAge >= minAge;

  if (loading) {
    return (
      <section className="card wide">
        <div className="status">
          <span className="dot" /> Chargement du profil…
        </div>
      </section>
    );
  }

  return (
    <section className="card wide">
      <div className="wizard-head">
        <div className="wizard-steps" aria-label={`Étape ${step} sur 6`}>
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <span key={n} className={`wizard-dot ${n === step ? 'on' : ''} ${n < step ? 'done' : ''}`} />
          ))}
        </div>
        <h2>
          {step === 1 && 'Qui es-tu ?'}
          {step === 2 && 'Tes recherches'}
          {step === 3 && 'Où vis-tu ?'}
          {step === 4 && 'Ta personnalité'}
          {step === 5 && 'Tes photos'}
          {step === 6 && 'Ton mode de découverte'}
        </h2>
        <p className="hint">Étape {step} sur 6 — sauvegarde automatique.</p>
      </div>

      {error && <p className="error">{error}</p>}

      {/* ---------------- Étape 1 : identité ---------------- */}
      {step === 1 && (
        <div className="wizard-body">
          <label className="field">
            <span>Prénom</span>
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Ton prénom, tel que tu veux être appelé·e"
              maxLength={PROFILE_LIMITS.displayNameMax}
              autoComplete="given-name"
            />
          </label>
          <label className="field">
            <span>Année de naissance (18 ans minimum)</span>
            <input
              value={birthYear}
              onChange={(e) => setBirthYear(e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder={`Ex. ${MAX_BIRTH_YEAR - 10}`}
              inputMode="numeric"
            />
            {birthYear.length === 4 && !ageOk && (
              <small className="hint">Tu dois avoir 18 ans révolus.</small>
            )}
          </label>
          <div className="field">
            <span>Genre</span>
            <div className="choice-row">
              {(['woman', 'man', 'non_binary'] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  className={`choice ${gender === g ? 'on' : ''}`}
                  onClick={() => setGender(g)}
                >
                  {LABELS.gender[g]}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ---------------- Étape 2 : orientation + consentement ---------------- */}
      {step === 2 && (
        <div className="wizard-body">
          <div className="field">
            <span>Orientation</span>
            <div className="choice-row">
              {ORIENTATIONS.map((o) => (
                <button
                  key={o}
                  type="button"
                  className={`choice ${orientation === o ? 'on' : ''}`}
                  onClick={() => setOrientation(o)}
                >
                  {LABELS.orientation[o]}
                </button>
              ))}
            </div>
          </div>
          <div className="field">
            <span>Tu cherches…</span>
            <div className="choice-row">
              {(['serious', 'open', 'friends_first'] as const).map((i) => (
                <button
                  key={i}
                  type="button"
                  className={`choice ${intent === i ? 'on' : ''}`}
                  onClick={() => setIntent(i)}
                >
                  {LABELS.intent[i]}
                </button>
              ))}
            </div>
          </div>
          <label className="consent">
            <input
              type="checkbox"
              checked={consent || consentAlreadyGiven}
              onChange={(e) => setConsent(e.target.checked)}
              disabled={consentAlreadyGiven}
            />
            <span>
              J'accepte que mon orientation, mon intention, ma ville et ma position approximative
              soient utilisées pour la découverte et le matching, conformément à la{' '}
              <a href="/legal/politique.md" target="_blank" rel="noreferrer">
                politique de confidentialité
              </a>
              . Je peux retirer mon accord à tout moment en supprimant mon compte.
            </span>
          </label>
        </div>
      )}

      {/* ---------------- Étape 3 : ville + bio ---------------- */}
      {step === 3 && (
        <div className="wizard-body">
          <label className="field">
            <span>Ville</span>
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Ex. Lyon, Bruxelles, Genève…"
              maxLength={PROFILE_LIMITS.cityMax}
            />
          </label>
          <div className="field">
            <span>Position approximative (optionnel — arrondie à ~10 km)</span>
            <button type="button" className="btn ghost" onClick={useMyLocation} disabled={locating}>
              {locating ? 'Localisation…' : 'Utiliser ma position'}
            </button>
            {geoRegion && (
              <p className="hint">
                Zone enregistrée : {geoRegion.replace('geo:', '')} (≈11 km autour de toi — ta position
                précise n'est jamais stockée).
              </p>
            )}
          </div>
          <label className="field">
            <span>Bio courte ({bio.length}/{PROFILE_LIMITS.bioMax})</span>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value.slice(0, PROFILE_LIMITS.bioMax))}
              placeholder="Deux phrases qui te ressemblent."
              rows={3}
              maxLength={PROFILE_LIMITS.bioMax}
            />
          </label>
        </div>
      )}

      {/* ---------------- Étape 4 : prompts ---------------- */}
      {step === 4 && (
        <div className="wizard-body">
          <p className="hint">
            Choisis 3 questions et réponds en une ou deux phrases — c'est ce qui donne envie de te
            parler.
          </p>
          {prompts.map((p, i) => {
            const takenByOther = usedKeys.some((k, j) => k === p.key && j !== i);
            return (
              <div key={i} className="field">
                <span>Prompt {i + 1}</span>
                <select value={p.key} onChange={(e) => setPromptSlot(i, { key: e.target.value })}>
                  <option value="">— Choisir une question —</option>
                  {PROMPT_LIBRARY.filter((q) => !usedKeys.includes(q.key) || q.key === p.key).map((q) => (
                    <option key={q.key} value={q.key}>
                      {q.label}
                    </option>
                  ))}
                </select>
                {p.key && (
                  <>
                    <p className="prompt-label">{PROMPT_LIBRARY.find((q) => q.key === p.key)?.label}</p>
                    <textarea
                      value={p.answer}
                      onChange={(e) =>
                        setPromptSlot(i, { answer: e.target.value.slice(0, PROFILE_LIMITS.promptAnswerMax) })
                      }
                      placeholder="Ta réponse…"
                      rows={2}
                      maxLength={PROFILE_LIMITS.promptAnswerMax}
                    />
                    {takenByOther && <small className="hint">Question déjà choisie plus haut.</small>}
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ---------------- Étape 5 : photos ---------------- */}
      {step === 5 && (
        <div className="wizard-body">
          <p className="hint">
            1 photo minimum, 6 maximum. Tes photos sont recadrées en 4:5 et compressées sur ton
            téléphone avant l'envoi. Elles restent privées : personne ne peut y accéder sans
            autorisation — et en Mode Invisible, elles ne se dévoilent qu'avec ton accord.
          </p>
          <div className="photo-grid">
            {photos.map((photo, i) => (
              <div key={photo.id} className="photo-cell">
                <img src={photo.urlThumb ?? photo.urlFull ?? ''} alt={`Photo ${i + 1}`} loading="lazy" />
                {i === 0 && <span className="photo-main">Principale</span>}
                <div className="photo-actions">
                  <button type="button" onClick={() => movePhoto(i, -1)} disabled={i === 0} aria-label="Monter">
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={() => movePhoto(i, 1)}
                    disabled={i === photos.length - 1}
                    aria-label="Descendre"
                  >
                    →
                  </button>
                  <button
                    type="button"
                    className="danger"
                    onClick={() => removePhoto(photo.id)}
                    aria-label="Supprimer"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
            {photos.length < 6 && (
              <button
                type="button"
                className="photo-add"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? '…' : '+'}
                <span>{uploading ? 'Compression…' : 'Ajouter'}</span>
              </button>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void addPhoto(f);
            }}
          />
        </div>
      )}

      {/* ---------------- Étape 6 : mode + préférences ---------------- */}
      {step === 6 && (
        <div className="wizard-body">
          <div className="mode-cards">
            <button
              type="button"
              className={`mode-card ${modeDefault === 'classic' ? 'on' : ''}`}
              onClick={() => setModeDefault('classic')}
            >
              <strong>Mode Classique</strong>
              <span>Tes photos sont visibles dès la découverte. Swipe, match, discussion.</span>
            </button>
            <button
              type="button"
              className={`mode-card ${modeDefault === 'invisible' ? 'on' : ''}`}
              onClick={() => setModeDefault('invisible')}
            >
              <strong>Mode Invisible</strong>
              <span>
                Ton profil est flouté : on découvre d'abord ta personnalité et ton score. Tes photos
                ne se dévoilent qu'après 15 messages échangés sur 7 jours, si toi ET l'autre
                l'acceptez.
              </span>
            </button>
          </div>
          <p className="hint">Tu pourras changer de mode à tout moment.</p>

          <div className="field">
            <span>Je veux voir des…</span>
            <div className="choice-row">
              {(['women', 'men', 'everyone'] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  className={`choice ${prefGender === g ? 'on' : ''}`}
                  onClick={() => setPrefGender(g)}
                >
                  {LABELS.prefGender[g]}
                </button>
              ))}
            </div>
          </div>
          <div className="field two-col">
            <label>
              <span>Âge min.</span>
              <input
                type="number"
                min={18}
                max={99}
                value={minAge}
                onChange={(e) => setMinAge(Number(e.target.value))}
              />
            </label>
            <label>
              <span>Âge max.</span>
              <input
                type="number"
                min={18}
                max={99}
                value={maxAge}
                onChange={(e) => setMaxAge(Number(e.target.value))}
              />
            </label>
            <label>
              <span>Distance (km)</span>
              <input
                type="number"
                min={1}
                max={500}
                value={distanceKm}
                onChange={(e) => setDistanceKm(Number(e.target.value))}
              />
            </label>
          </div>
          <div className="field">
            <span>Intention recherchée (optionnel)</span>
            <div className="choice-row">
              <button
                type="button"
                className={`choice ${prefIntent === '' ? 'on' : ''}`}
                onClick={() => setPrefIntent('')}
              >
                Toutes
              </button>
              {(['serious', 'open', 'friends_first'] as const).map((i) => (
                <button
                  key={i}
                  type="button"
                  className={`choice ${prefIntent === i ? 'on' : ''}`}
                  onClick={() => setPrefIntent(i)}
                >
                  {LABELS.intent[i]}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ---------------- Navigation ---------------- */}
      <div className="wizard-nav">
        {step > 1 && (
          <button type="button" className="btn ghost" onClick={() => setStep((s) => s - 1)} disabled={busy}>
            Retour
          </button>
        )}
        {step < 6 ? (
          <button
            type="button"
            className="btn primary"
            onClick={next}
            disabled={
              busy ||
              (step === 1 && !step1Ok) ||
              (step === 2 && !step2Ok) ||
              (step === 3 && !step3Ok) ||
              (step === 4 && !step4Ok) ||
              (step === 5 && !step5Ok)
            }
          >
            {busy ? 'Enregistrement…' : 'Continuer'}
          </button>
        ) : (
          <button type="button" className="btn primary" onClick={finish} disabled={busy || !step6Ok}>
            {busy ? 'Enregistrement…' : 'Terminer mon profil'}
          </button>
        )}
      </div>
    </section>
  );
}

// Garde le type vivant pour d'éventuels imports de PROMPT_KEYS (lint friendly).
void PROMPT_KEYS;
