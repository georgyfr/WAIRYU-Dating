/**
 * Écran de vérification du code OTP (Étape 2).
 * Saisie numérique unique (clavier mobile), auto-soumission à 6 chiffres,
 * minuteur de renvoi (60 s), affichage du code en mode dev (staging).
 */
import { useEffect, useRef, useState } from 'react';
import { api, ApiError } from '../lib/api';
import type { OtpRequestResponse, OtpVerifyResponse } from '@wairyu/shared';

const RESEND_SECONDS = 60;

interface Props {
  email: string;
  devCode?: string;
  /** Appelé quand la session est créée — le parent recharge /api/me puis navigue. */
  onAuthenticated: () => void;
}

export function Verify({ email, devCode, onAuthenticated }: Props) {
  const [code, setCode] = useState(devCode ?? '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(devCode ? 0 : RESEND_SECONDS);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  async function verify(value: string) {
    setBusy(true);
    setError(null);
    try {
      await api<OtpVerifyResponse>('/api/auth/otp/verify', {
        json: { email, code: value },
      });
      onAuthenticated();
    } catch (err) {
      if (err instanceof ApiError && (err.code === 'otp_invalid' || err.code === 'otp_expired' || err.code === 'otp_locked')) {
        setCode('');
        inputRef.current?.focus();
      }
      setError(err instanceof Error ? err.message : 'Erreur inattendue.');
      setBusy(false);
    }
  }

  async function resend() {
    setBusy(true);
    setError(null);
    try {
      const res = await api<OtpRequestResponse>('/api/auth/otp/request', {
        json: { email, turnstile_token: null },
      });
      if (res.devCode) setCode(res.devCode);
      setCooldown(RESEND_SECONDS);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inattendue.');
    }
    setBusy(false);
  }

  function onChange(value: string) {
    const digits = value.replace(/\D/g, '').slice(0, 6);
    setCode(digits);
    setError(null);
    if (digits.length === 6 && !busy) void verify(digits);
  }

  return (
    <section className="card">
      <button type="button" className="back" onClick={() => (window.location.hash = '#/login')}>
        ← Retour
      </button>
      <h2>Ton code à 6 chiffres</h2>
      <p className="hint">
        Envoyé à <strong>{email}</strong>. Il est valable 10 minutes.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (code.length === 6) void verify(code);
        }}
      >
        <input
          ref={inputRef}
          className="otp"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="[0-9]*"
          placeholder="••••••"
          value={code}
          onChange={(e) => onChange(e.target.value)}
          aria-label="Code à 6 chiffres"
        />

        {devCode && (
          <p className="devcode">
            Mode test (staging) — code : <strong>{devCode}</strong>
          </p>
        )}

        {error && <p className="error">{error}</p>}

        <button type="submit" className="btn primary" disabled={busy || code.length !== 6}>
          {busy ? 'Vérification…' : 'Vérifier'}
        </button>

        <button type="button" className="btn ghost" disabled={cooldown > 0 || busy} onClick={resend}>
          {cooldown > 0 ? `Nouveau code dans ${cooldown} s` : 'Renvoyer un code'}
        </button>
      </form>
    </section>
  );
}
