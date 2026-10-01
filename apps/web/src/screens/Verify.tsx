/**
 * Écran de vérification du code OTP (Étape 2).
 * Saisie numérique unique (clavier mobile), auto-soumission à 6 chiffres,
 * minuteur de renvoi (60 s), affichage du code en mode dev (staging).
 */
import { useEffect, useRef, useState } from 'react';
import { api, ApiError } from '../lib/api';
import { takeOtpRelay, clearOtpRelay } from '../lib/otpRelay'; // Task 78 : relais du code quand l'écran n'était pas encore ouvert
import type { OtpRequestResponse, OtpVerifyResponse } from '@wairyu/shared';

const RESEND_SECONDS = 60;

interface Props {
  email: string;
  devCode?: string;
  /** Appelé quand la session est créée — le parent recharge /api/me puis navigue. */
  onAuthenticated: () => void;
  /**
   * Hook optionnel exécuté après la vérification OTP, avant la navigation
   * (ex : rattachement d'une identité Facebook en attente). S'il échoue,
   * l'erreur est affichée dans ce même écran et la navigation est bloquée.
   */
  onBeforeAuthenticated?: () => Promise<void>;
  /** Cible du bouton retour (défaut : #/login). */
  backTo?: string;
}

export function Verify({ email, devCode, onAuthenticated, onBeforeAuthenticated, backTo = '#/login' }: Props) {
  const [code, setCode] = useState(devCode ?? '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(devCode ? 0 : RESEND_SECONDS);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Task 73 (fondateur) — « le code s'active automatiquement, il n'a pas
  // besoin de l'insérer » : 1) le SW relait le payload push (kind 'otp')
  // à la page ouverte → on soumet le code immédiatement (zéro tap) ;
  // 2) le tap sur la notification ouvre #/verify?e=…&d=… → devCode prérempli
  // → auto-soumission au montage.
  const submittedRef = useRef(false);
  // Task 79 — dernier code réellement soumis : un code NOUVEAU (différent)
  // doit TOUJOURS être resoumis même après une première tentative — côté
  // serveur, le code actif est le DERNIER généré (l'utilisateur qui demande
  // un 2e code rend le 1er invalide ; la notif qui arrive porte le bon).
  const lastSubmittedRef = useRef<string | null>(null);
  useEffect(() => {
    if (!devCode || submittedRef.current) return;
    submittedRef.current = true;
    lastSubmittedRef.current = devCode; // Task 79 : anti double-soumission du même code
    void verify(devCode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Task 78 (fondateur : « la notification push arrive, mais elle ne remplit
  // pas automatiquement le code ») — deux rattrapages APPEND-ONLY :
  //  A. devCode arrivé APRÈS le montage — le SW ne peut pas naviguer
  //     same-document : c'est le relais 'wairyu-navigate' (App.tsx) qui change
  //     le hash → cet écran, DÉJÀ MONTÉ (l'utilisateur attend sur « Ton code
  //     à 6 chiffres »), ne se remonte PAS : ses props changent. L'effet de
  //     montage historique ci-dessus (deps []) ne se rejoue jamais — on
  //     réagit ici à devCode pour remplir + soumettre le champ.
  //  B. code relayé pendant que cet écran N'EXISTAIT PAS — l'utilisateur
  //     était encore sur « Recevoir mon code » (ou ailleurs dans l'app) :
  //     App.tsx a mis le code de côté (otpRelay) → consommé ici au montage
  //     (lié à l'email, frais de 10 minutes max, une seule fois).
  const lateDevRef = useRef<string | null>(null);
  useEffect(() => {
    if (!devCode) return;
    if (lateDevRef.current === devCode) return;
    lateDevRef.current = devCode;
    // Task 79 : un devCode ÉGAL au dernier soumi ne se soumet PAS deux fois
    // (montage direct ?d= : l'effet initial l'a déjà soumis) — seul un code
    // NOUVEAU (différent) resoumet, même après une première tentative.
    if (lastSubmittedRef.current === devCode) return;
    submittedRef.current = true;
    lastSubmittedRef.current = devCode;
    setCode(devCode);
    void verify(devCode);
  }, [devCode]);

  useEffect(() => {
    if (submittedRef.current) return;
    const relayed = takeOtpRelay(email);
    if (!relayed) return;
    submittedRef.current = true;
    lastSubmittedRef.current = relayed; // Task 79 : anti double-soumission du même code
    setCode(relayed);
    void verify(relayed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email]);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;
    const onMessage = (event: MessageEvent) => {
      const data = (event.data ?? {}) as { type?: string; data?: { kind?: string; code?: string } };
      if (data.type !== 'wairyu-push' || data.data?.kind !== 'otp' || !data.data.code) return;
      // Task 79 : un code NOUVEAU (différent du dernier soumi) resoumet même
      // après une première tentative — l'utilisateur qui a redemandé un code
      // rend le précédent invalide ; la notif qui arrive porte le BON.
      if (submittedRef.current && data.data.code === lastSubmittedRef.current) return;
      submittedRef.current = true;
      lastSubmittedRef.current = data.data.code;
      setCode(data.data.code); // Task 78 : le code devient VISIBLE pendant la vérification (l'utilisateur le VOIT se remplir)
      clearOtpRelay(); // Task 78 : un code consommé en direct ne doit pas survivre dans le relais
      void verify(data.data.code);
    };
    navigator.serviceWorker.addEventListener('message', onMessage);
    return () => navigator.serviceWorker.removeEventListener('message', onMessage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      if (onBeforeAuthenticated) await onBeforeAuthenticated();
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
      <button type="button" className="back" onClick={() => (window.location.hash = backTo)}>
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
