import type { ApiErrorBody, ApiErrorCode } from '@wairyu/shared';

/** Erreur applicative avec code HTTP et code métier. */
export class AppError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: ApiErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const errors = {
  badRequest: (m = 'Requête invalide.') => new AppError(400, 'bad_request', m),
  unauthorized: (m = 'Authentification requise.') => new AppError(401, 'unauthorized', m),
  forbidden: (m = 'Accès refusé.') => new AppError(403, 'forbidden', m),
  notFound: (m = 'Ressource introuvable.') => new AppError(404, 'not_found', m),
  rateLimited: (m = 'Trop de requêtes, réessayez plus tard.') =>
    new AppError(429, 'rate_limited', m),
  internal: (m = 'Une erreur interne est survenue.') => new AppError(500, 'internal', m),
};

/** Génère un identifiant de requête court (corrélation logs). */
export function reqId(): string {
  const b = crypto.randomUUID().replace(/-/g, '');
  return b.slice(0, 12);
}

/** Corps d'erreur normalisé (contrat partagé avec le front). */
export function errorBody(code: ApiErrorCode, message: string, id: string): ApiErrorBody {
  return { error: { code, message, req_id: id } };
}
