/**
 * Client API minimal (Étape 2) — cookies same-origin, contrat d'erreur normalisé.
 */
import type { ApiErrorBody } from '@wairyu/shared';

export class ApiError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function api<T>(
  path: string,
  options?: { method?: 'GET' | 'POST' | 'DELETE'; json?: unknown },
): Promise<T> {
  const res = await fetch(path, {
    method: options?.method ?? (options?.json !== undefined ? 'POST' : 'GET'),
    headers: options?.json !== undefined ? { 'content-type': 'application/json' } : undefined,
    body: options?.json !== undefined ? JSON.stringify(options.json) : undefined,
    credentials: 'same-origin',
  });
  const data: unknown = await res.json().catch(() => null);
  if (!res.ok) {
    const err = (data as ApiErrorBody | null)?.error;
    throw new ApiError(
      err?.code ?? 'internal',
      err?.message ?? 'Une erreur est survenue. Réessaie.',
      res.status,
    );
  }
  return data as T;
}
