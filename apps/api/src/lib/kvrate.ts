/**
 * Rate limiting léger via KV (CONFIG) — fenêtres fixes courtes.
 * Usage : gardes anti-spam des endpoints push device-based (sans session).
 * Cohérence KV éventuelle ⇒ garde SOFT : suffisant contre l'abus, sans
 * bloquer un usage légitime. À l'Étape 2, les endpoints authentifiés
 * repasseront sur rate_limits (D1) comme la v1.
 */

export interface KvRateResult {
  allowed: boolean;
  retryAfter: number;
}

export async function kvRateLimit(
  kv: KVNamespace,
  scope: string,
  key: string,
  limit: number,
  windowSec: number,
): Promise<KvRateResult> {
  const now = Math.floor(Date.now() / 1000);
  const window = Math.floor(now / windowSec);
  const k = `rl:${scope}:${key}:${window}`;
  try {
    const cur = Number((await kv.get(k)) ?? '0');
    if (cur >= limit) {
      return { allowed: false, retryAfter: (window + 1) * windowSec - now };
    }
    await kv.put(k, String(cur + 1), { expirationTtl: windowSec * 2 });
    return { allowed: true, retryAfter: 0 };
  } catch {
    // KV indisponible ⇒ on laisse passer (dégradation gracieuse).
    return { allowed: true, retryAfter: 0 };
  }
}
