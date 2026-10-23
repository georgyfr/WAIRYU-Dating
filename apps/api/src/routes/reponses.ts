/**
 * Task 69-c — /api/reponses : LA SAUVEGARDE QUI TE SUIT PARTOUT (GO fondateur).
 *
 * Les réponses des quêtes quittent le localStorage seul : chaque membre porte
 * ses états de quêtes sur son COMPTE (D1). Contrat :
 *  - GET  /api/reponses        → { ok: true, reponses: [{ quete, etat, updatedAt }] }
 *    (toutes les quêtes du membre, etat = objet déjà parsé) ;
 *  - PUT  /api/reponses/:quete → corps { etat: {...} } — upsert, updated_at
 *    posé par le SERVEUR (last-write-wins) → { ok: true } ;
 *  - DELETE /api/reponses/:quete → { ok: true } (l'utilisateur a effacé sa
 *    quête sur cet appareil — la sauvegarde suit).
 *
 * La base ne stocke que l'état BRUT des réponses (même JSON que le local) :
 * aucun scoring, aucun sélecteur, aucune carte ne se calcule ici — le moteur
 * de quêtes reste côté navigateur. Session OBLIGATOIRE (le compte est le
 * point d'attache — c'est le sens même de « qui te suit partout »).
 *
 * Garde-fou (Task 169, audit app) : chaque voie est bornée par un compteur
 * D1 (RATE_RULES.reponses*User) — large pour ne JAMAIS couper la sauvegarde
 * d'une passation réelle, assez borné pour l'anti-abus.
 */
import { Hono } from 'hono';
import type { Context, Next } from 'hono';
import type { AppEnv } from '../env';
import { RATE_RULES, hitRateLimit } from '../lib/ratelimit';

export const reponsesRoutes = new Hono<AppEnv>();

/** Exige une session valide ; retourne {sessionId, userId}. */
function requireAuth(c: Context<AppEnv>): { sessionId: string; userId: string } {
  const session = c.get('session');
  if (!session) throw new Error('unauthorized');
  return session;
}

/** Identifiant de quête valide : '1.1' … '11.7' (deux segments courts). */
function estQuete(val: string): boolean {
  return /^\d{1,2}\.\d{1,2}$/.test(val) && val.length <= 6;
}

/** Audit de forme de l'état (le même JSON que le local — defensif, jamais
 *  inventé) : reponses (codes → nombre), terminee, carteId, termineeA,
 *  lectures (1|2|3), textes? (≤ 500), schema_version? (1-99, pont versionné
 *  front↔serveur — Task 169). Retourne null si la forme est fausse. */
function etatValide(brut: unknown): string | null {
  if (!brut || typeof brut !== 'object' || Array.isArray(brut)) return null;
  const o = brut as Record<string, unknown>;
  if (typeof o.terminee !== 'boolean') return null;
  if (o.carteId !== null && typeof o.carteId !== 'string') return null;
  if (o.termineeA !== null && typeof o.termineeA !== 'string') return null;
  if (!o.reponses || typeof o.reponses !== 'object' || Array.isArray(o.reponses)) return null;
  for (const [k, v] of Object.entries(o.reponses as Record<string, unknown>)) {
    if (typeof k !== 'string' || k.length === 0 || k.length > 32) return null;
    if (typeof v !== 'number' || !Number.isFinite(v)) return null;
  }
  if (o.lectures !== undefined) {
    if (typeof o.lectures !== 'object' || o.lectures === null || Array.isArray(o.lectures)) return null;
    for (const [k, v] of Object.entries(o.lectures as Record<string, unknown>)) {
      if (typeof k !== 'string' || k.length === 0 || k.length > 32) return null;
      if (v !== 1 && v !== 2 && v !== 3) return null;
    }
  }
  if (o.textes !== undefined) {
    if (typeof o.textes !== 'object' || o.textes === null || Array.isArray(o.textes)) return null;
    for (const [k, v] of Object.entries(o.textes as Record<string, unknown>)) {
      if (typeof k !== 'string' || k.length === 0 || k.length > 32) return null;
      if (typeof v !== 'string' || v.length > 500) return null;
    }
  }
  if (o.schema_version !== undefined) {
    if (
      typeof o.schema_version !== 'number' ||
      !Number.isInteger(o.schema_version) ||
      o.schema_version < 1 ||
      o.schema_version > 99
    ) {
      return null;
    }
  }
  // Les autres clés (majA…) sont tolérées mais sérialisées telles quelles.
  if (JSON.stringify(o).length > 32_000) return null;
  return JSON.stringify(o);
}

reponsesRoutes.get('/reponses', async (c) => {
  let session: { sessionId: string; userId: string };
  try {
    session = requireAuth(c);
  } catch {
    return c.json({ ok: false, error: 'unauthorized' }, 401);
  }
  try {
    const rl = await hitRateLimit(c.env.DB, RATE_RULES.reponsesGetUser, session.userId);
    if (!rl.allowed) {
      return c.json({ ok: false, error: 'rate_limited' }, 429, {
        'Retry-After': String(rl.retryAfterSeconds),
      });
    }
    const { results } = await c.env.DB.prepare(
      `SELECT quete, etat, updated_at FROM reponses WHERE user_id = ?1 ORDER BY updated_at DESC`,
    )
      .bind(session.userId)
      .all<{ quete: string; etat: string; updated_at: string }>();
    const reponses = (results ?? []).map((r) => {
      let etat: unknown = null;
      try {
        etat = JSON.parse(r.etat);
      } catch {
        etat = null;
      }
      return { quete: r.quete, etat, updatedAt: r.updated_at };
    });
    return c.json({ ok: true, reponses });
  } catch (e) {
    console.error('[reponses] GET failed', e);
    return c.json({ ok: false, error: 'store_unavailable' }, 500);
  }
});

reponsesRoutes.put('/reponses/:quete', async (c) => {
  let session: { sessionId: string; userId: string };
  try {
    session = requireAuth(c);
  } catch {
    return c.json({ ok: false, error: 'unauthorized' }, 401);
  }
  const quete = c.req.param('quete');
  if (!estQuete(quete)) return c.json({ ok: false, error: 'invalid_quete' }, 400);
  let corps: unknown;
  try {
    corps = await c.req.json();
  } catch {
    return c.json({ ok: false, error: 'invalid_body' }, 400);
  }
  const etatBrut = (corps as { etat?: unknown } | null)?.etat;
  const etatJson = etatValide(etatBrut);
  if (etatJson === null) return c.json({ ok: false, error: 'invalid_body' }, 400);
  const now = new Date().toISOString();
  try {
    const rl = await hitRateLimit(c.env.DB, RATE_RULES.reponsesPutUser, session.userId);
    if (!rl.allowed) {
      return c.json({ ok: false, error: 'rate_limited' }, 429, {
        'Retry-After': String(rl.retryAfterSeconds),
      });
    }
    await c.env.DB.prepare(
      `INSERT INTO reponses (user_id, quete, etat, updated_at, created_at)
       VALUES (?1, ?2, ?3, ?4, ?4)
       ON CONFLICT (user_id, quete)
       DO UPDATE SET etat = excluded.etat, updated_at = excluded.updated_at`,
    )
      .bind(session.userId, quete, etatJson, now)
      .run();
    return c.json({ ok: true, updatedAt: now });
  } catch (e) {
    console.error('[reponses] PUT failed', e);
    return c.json({ ok: false, error: 'store_unavailable' }, 500);
  }
});

reponsesRoutes.delete('/reponses/:quete', async (c) => {
  let session: { sessionId: string; userId: string };
  try {
    session = requireAuth(c);
  } catch {
    return c.json({ ok: false, error: 'unauthorized' }, 401);
  }
  const quete = c.req.param('quete');
  if (!estQuete(quete)) return c.json({ ok: false, error: 'invalid_quete' }, 400);
  try {
    const rl = await hitRateLimit(c.env.DB, RATE_RULES.reponsesDeleteUser, session.userId);
    if (!rl.allowed) {
      return c.json({ ok: false, error: 'rate_limited' }, 429, {
        'Retry-After': String(rl.retryAfterSeconds),
      });
    }
    await c.env.DB.prepare(`DELETE FROM reponses WHERE user_id = ?1 AND quete = ?2`)
      .bind(session.userId, quete)
      .run();
    return c.json({ ok: true });
  } catch (e) {
    console.error('[reponses] DELETE failed', e);
    return c.json({ ok: false, error: 'store_unavailable' }, 500);
  }
});
