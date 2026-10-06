/**
 * Client d'authentification (Étape 2) — appels API depuis le front.
 * La session vit dans un cookie httpOnly SameSite=Lax posé par le Worker :
 * aucune donnée d'authentification n'est stockée côté JS.
 */
import type {
  AuthConfigResponse,
  LinkDeviceResponse,
  MeResponse,
  OtpRequestResponse,
  OtpVerifyResponse,
  PasswordForgotResponse,
  PasswordLoginResponse,
  PasswordRecoveryResponse,
  PasswordRegisterResponse,
  PasswordStatusResponse,
} from '@wairyu/shared';

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    credentials: 'same-origin',
    ...init,
    headers: { 'content-type': 'application/json', ...(init?.headers ?? {}) },
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: { code?: string; message?: string } } | null;
    throw new ApiError(
      res.status,
      body?.error?.code ?? 'internal',
      body?.error?.message ?? `Erreur ${res.status}`,
    );
  }
  return (await res.json()) as T;
}

export function fetchAuthConfig(): Promise<AuthConfigResponse> {
  return api<AuthConfigResponse>('/api/auth/config');
}

export function requestOtp(
  email: string,
  turnstileToken: string | null,
  deviceId?: string,
): Promise<OtpRequestResponse> {
  return api<OtpRequestResponse>('/api/auth/otp/request', {
    method: 'POST',
    body: JSON.stringify({ email, turnstile_token: turnstileToken, deviceId }),
  });
}

/**
 * Lie l'appareil courant au compte authentifié (cookie de session) — base du
 * ciblage des notifications et déclencheur de la notification de félicitations
 * à la création de compte (tous canaux). Échec gracieux côté appelant.
 */
export function linkDevice(deviceId: string): Promise<LinkDeviceResponse> {
  return api<LinkDeviceResponse>('/api/push/link-device', {
    method: 'POST',
    body: JSON.stringify({ deviceId }),
  });
}

export function verifyOtp(
  email: string,
  code: string,
  birthDate: string | null,
): Promise<OtpVerifyResponse> {
  return api<OtpVerifyResponse>('/api/auth/otp/verify', {
    method: 'POST',
    body: JSON.stringify({ email, code, birthDate }),
  });
}

export function fetchMe(): Promise<MeResponse> {
  return api<MeResponse>('/api/me');
}

export function logout(): Promise<{ ok: true }> {
  return api<{ ok: true }>('/api/auth/logout', { method: 'POST' });
}

export function passwordRegister(
  username: string,
  password: string,
  birthDate: string,
  turnstileToken: string | null,
): Promise<PasswordRegisterResponse> {
  return api<PasswordRegisterResponse>('/api/auth/password/register', {
    method: 'POST',
    body: JSON.stringify({ username, password, birthDate, turnstile_token: turnstileToken }),
  });
}

export function passwordLogin(username: string, password: string): Promise<PasswordLoginResponse> {
  return api<PasswordLoginResponse>('/api/auth/password/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

export function passwordRecovery(
  username: string,
  recoveryCode: string,
  newPassword: string | null,
): Promise<PasswordRecoveryResponse> {
  return api<PasswordRecoveryResponse>('/api/auth/password/recovery', {
    method: 'POST',
    body: JSON.stringify({ username, recovery_code: recoveryCode, new_password: newPassword }),
  });
}

export function passwordForgot(email: string, turnstileToken: string | null): Promise<PasswordForgotResponse> {
  return api<PasswordForgotResponse>('/api/auth/password/forgot', {
    method: 'POST',
    body: JSON.stringify({ email, turnstile_token: turnstileToken }),
  });
}

export function passwordReset(token: string, newPassword: string): Promise<{ ok: true }> {
  return api<{ ok: true }>('/api/auth/password/reset', {
    method: 'POST',
    body: JSON.stringify({ token, new_password: newPassword }),
  });
}

export function passwordSet(password: string): Promise<{ ok: true; username: string }> {
  return api<{ ok: true; username: string }>('/api/auth/password/set', {
    method: 'POST',
    body: JSON.stringify({ password }),
  });
}

export function fetchPasswordStatus(): Promise<PasswordStatusResponse> {
  return api<PasswordStatusResponse>('/api/auth/password/status');
}

export function deleteAccount(): Promise<{ deleted: true }> {
  return api<{ deleted: true }>('/api/account', {
    method: 'DELETE',
    body: JSON.stringify({ confirm: true }),
  });
}

export function exportAccount(): void {
  // Navigation directe : le serveur renvoie le JSON en pièce jointe.
  window.location.href = '/api/account/export';
}

/** Validation locale de la date de naissance (AAAA-MM-JJ, 18 ans révolus). */
export function birthDateError(iso: string): string | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return 'Format attendu : AAAA-MM-JJ.';
  const year = Number(m[1]);
  const month = Number(m[2]);
  const day = Number(m[3]);
  if (year < 1930) return 'Année de naissance invalide.';
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  if (month < 1 || month > 12 || day < 1 || day > daysInMonth) {
    return 'Date de naissance invalide.';
  }
  const now = new Date();
  const cutoff = new Date(Date.UTC(now.getUTCFullYear() - 18, now.getUTCMonth(), now.getUTCDate()));
  const birth = new Date(Date.UTC(year, month - 1, day));
  if (birth > cutoff) return 'Les comptes wairyu sont réservés aux personnes majeures (18 ans révolus).';
  return null;
}
