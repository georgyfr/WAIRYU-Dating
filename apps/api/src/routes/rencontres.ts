/**
 * Rencontre-E1 (Task 94) — GET /api/rencontres/pool · POST /api/rencontres/pas ·
 * DELETE /api/rencontres/pas/:id.
 *
 * SPEC : docs/SPEC-RENONCONTRE-E1.v1.md — D-R1 (déblocage en deux jalons),
 * D-R2 (« la rencontre n'est jamais payante » — rien de payant ici),
 * D-R3 (jamais de rencontre inventée : le pool ne contient que des personnes
 * RÉELLES qui ont franchi le jalon A), D-R4 (anti-score : aucun note,
 * classement ni pourcentage — la progression TRIE, elle n'exclut pas).
 *
 * Jalon A « La porte s'ouvre » = Miroir 3/3 (1.1, 1.2, 1.3 terminées) —
 * dérivé de la table `reponses` (json_extract sur etat.terminee), AUCUN
 * nouveau stockage de progression. Jalon B « La pleine profondeur » = bloc
 * 1.x complet (le Volant : 1.4→1.11, la 1.8 n'existe pas au Livrable).
 *
 * Pool (P2) : deux membres se voient si et seulement si chacun a atteint le
 * jalon A. La progression au-delà trie (territoires communs d'abord), elle
 * n'exclut pas. Le premier pas (P4) est AVEUGLE : le destinataire voit « n
 * pas reçus », jamais qui — la réciprocité (deux pas) crée le match et
 * seule l'identité des DEUX consentants est révélée.
 *
 * Style d'erreurs aligné sur routes/reponses.ts ({ ok:false, error }) ;
 * session OBLIGATOIRE (cookie signé → sessionMiddleware).
 */
import { Hono } from 'hono';
import type { Context } from 'hono';
import type { AppEnv } from '../env';
import { RATE_RULES, hitRateLimit, rateLimitedError } from '../lib/ratelimit';

export const rencontresRoutes = new Hono<AppEnv>();

/** Exige une session valide ; retourne {sessionId, userId}. */
function requireAuth(c: Context<AppEnv>): { sessionId: string; userId: string } {
  const session = c.get('session');
  if (!session) throw new Error('unauthorized');
  return session;
}

/**
 * Les quêtes livrées par monde — MIROIR de QUIDS_PAR_MONDE
 * (apps/web/src/lib/progression.ts, gelé). ⚠️ Tenir les deux fichiers
 * alignés : le serveur dérive la profondeur de voyage de chaque membre de
 * cette liste. Toute nouvelle quête livrée côté front DOIT être ajoutée ici
 * (garde-fou : le bloc M2 n'a pas de 1.8 — elle n'existe pas au Livrable).
 */
const MONDES_QUIDS: ReadonlyArray<readonly [code: string, quids: readonly string[]]> = [
  ['M1', ['1.1', '1.2', '1.3']], // « Le Miroir »
  ['M2', ['1.4', '1.5', '1.6', '1.7', '1.9', '1.10', '1.11']], // « Le Volant »
  ['M3', ['2.1', '2.2', '2.3', '2.4', '2.5', '2.6', '2.7', '2.8']], // « La Boussole »
  ['M4', ['3.1', '3.2', '3.3', '3.4', '3.5', '3.6', '3.7']], // « Ton Terrain »
  ['M5', ['4.1', '4.2', '4.3']], // « Ton Héritage »
  ['M6', ['5.1', '5.2', '5.3', '5.7']], // « Mon Cœur »
  ['M7', ['5.4', '5.5', '5.6']], // « Face aux Tempêtes »
];

const JALON_A: readonly string[] = ['1.1', '1.2', '1.3']; // le Miroir (= M1)
const JALON_B: readonly string[] = ['1.4', '1.5', '1.6', '1.7', '1.9', '1.10', '1.11']; // le Volant (= M2)

/** La profondeur dérivée d'un membre : par monde (faites/total/termine). */
interface Profondeur {
  mondes: { code: string; faites: number; total: number; termine: boolean }[];
  mondesFranchis: number;
  jalonB: boolean;
}

function profondeurDe(terminees: Set<string>): Profondeur {
  const mondes = MONDES_QUIDS.map(([code, ids]) => {
    const faites = ids.filter((id) => terminees.has(id)).length;
    return { code, faites, total: ids.length, termine: faites === ids.length };
  });
  return {
    mondes,
    mondesFranchis: mondes.filter((m) => m.termine).length,
    jalonB: JALON_B.every((id) => terminees.has(id)),
  };
}

/** Jalon A d'un utilisateur précis (3 lignes terminee dans `reponses`). */
async function jalonAAtteint(db: D1Database, userId: string): Promise<boolean> {
  const { results } = await db
    .prepare(
      `SELECT quete FROM reponses
       WHERE user_id = ?1 AND quete IN ('1.1','1.2','1.3')
         AND json_extract(etat,'$.terminee') = 1`,
    )
    .bind(userId)
    .all<{ quete: string }>();
  const got = new Set((results ?? []).map((r) => r.quete));
  return JALON_A.every((q) => got.has(q));
}

/** L'état de MES pas vers chaque membre (statut le plus récent par paire). */
async function mesPas(db: D1Database, userId: string): Promise<Map<string, { id: string; statut: string }>> {
  const { results } = await db
    .prepare(`SELECT id, vers, statut FROM rencontre_pas WHERE de = ?1`)
    .bind(userId)
    .all<{ id: string; vers: string; statut: string }>();
  const map = new Map<string, { id: string; statut: string }>();
  for (const r of results ?? []) map.set(r.vers, { id: r.id, statut: r.statut });
  return map;
}

rencontresRoutes.get('/rencontres/pool', async (c) => {
  let session: { sessionId: string; userId: string };
  try {
    session = requireAuth(c);
  } catch {
    return c.json({ ok: false, error: 'unauthorized' }, 401);
  }
  // Anti-abus : le pool est léger mais reste borné (120 lectures / heure).
  const rl = await hitRateLimit(c.env.DB, RATE_RULES.rencontrePoolUser, session.userId);
  if (!rl.allowed) throw rateLimitedError(rl.retryAfterSeconds, RATE_RULES.rencontrePoolUser.scope);

  try {
    // Mon propre état de quêtes (jalon A / jalon B).
    const { results: miennes } = await c.env.DB.prepare(
      `SELECT quete FROM reponses WHERE user_id = ?1 AND json_extract(etat,'$.terminee') = 1`,
    )
      .bind(session.userId)
      .all<{ quete: string }>();
    const mesTerminees = new Set((miennes ?? []).map((r) => r.quete));
    const jalonA = JALON_A.every((q) => mesTerminees.has(q));
    const maProfondeur = profondeurDe(mesTerminees);

    // Porte fermée : AUCUNE donnée d'autrui ne sort (plancher mutuel).
    if (!jalonA) {
      return c.json({
        ok: true,
        jalonA: false,
        jalonB: false,
        pasRecus: 0,
        total: 0,
        pool: [],
        matchs: [],
        moi: maProfondeur,
      });
    }

    // Toutes les quêtes TERMINÉES des membres actifs (hors moi) — une seule
    // lecture, regroupée en JS. E1 : pool petit ; la pagination par requêtes
    // par candidat viendra avec la montée en charge (E2).
    const { results: lignes } = await c.env.DB.prepare(
      `SELECT r.user_id AS uid, r.quete, u.created_at AS cree, u.display_name AS dn,
              ap.username AS un
       FROM reponses r
       JOIN users u ON u.id = r.user_id AND u.status = 'active' AND u.id != ?1
       LEFT JOIN auth_password ap ON ap.user_id = u.id
       WHERE json_extract(r.etat,'$.terminee') = 1`,
    )
      .bind(session.userId)
      .all<{ uid: string; quete: string; cree: number; dn: string | null; un: string | null }>();

    // Regroupement par membre — seuls ceux qui ont le jalon A ENTIER entrent.
    const parMembre = new Map<string, { terminees: Set<string>; cree: number; dn: string | null; un: string | null }>();
    for (const l of lignes ?? []) {
      let m = parMembre.get(l.uid);
      if (!m) {
        m = { terminees: new Set(), cree: l.cree, dn: l.dn, un: l.un };
        parMembre.set(l.uid, m);
      }
      m.terminees.add(l.quete);
    }

    // MES pas (par destinataire) + les pas reçus (AVEUGLES : un compte, un nom)
    // + MES matchs.
    const [mesPasMap, pasRecusRows, matchsRows] = await Promise.all([
      mesPas(c.env.DB, session.userId),
      c.env.DB.prepare(
        `SELECT COUNT(*) AS n FROM rencontre_pas rp
         JOIN users u ON u.id = rp.de AND u.status = 'active'
         WHERE rp.vers = ?1 AND rp.statut = 'actif'`,
      )
        .bind(session.userId)
        .first<{ n: number }>(),
      c.env.DB.prepare(
        `SELECT id, a, b, cree_a FROM rencontre_matchs WHERE a = ?1 OR b = ?1 ORDER BY cree_a DESC`,
      )
        .bind(session.userId)
        .all<{ id: string; a: string; b: string; cree_a: string }>()
        .then((r) => r.results ?? []),
    ]);

    const partenairesMatch = new Map<string, { id: string; creeA: string }>();
    for (const m of matchsRows) {
      const autre = m.a === session.userId ? m.b : m.a;
      partenairesMatch.set(autre, { id: m.id, creeA: m.cree_a });
    }

    // Construction du pool — tri P2 : territoires communs d'abord (mondes
    // franchis identiques aux miens), puis profondeur, puis ancienneté.
    // AUCUN score : ce tri n'est pas une note (D-R4), il n'est jamais affiché.
    type Membre = {
      uid: string; terminees: Set<string>; cree: number; dn: string | null; un: string | null;
      communs: number; franchis: number;
    };
    const communsDe = (terminees: Set<string>): number =>
      profondeurDe(terminees).mondes.filter(
        (x) => x.termine && maProfondeur.mondes.find((y) => y.code === x.code)?.termine,
      ).length;
    const candidats: Membre[] = [];
    for (const [uid, m] of parMembre) {
      if (!JALON_A.every((q) => m.terminees.has(q))) continue; // plancher mutuel
      const p = profondeurDe(m.terminees);
      candidats.push({ ...m, uid, communs: communsDe(m.terminees), franchis: p.mondesFranchis });
    }
    candidats.sort((x, y) => {
      if (y.communs !== x.communs) return y.communs - x.communs;
      if (y.franchis !== x.franchis) return y.franchis - x.franchis;
      return x.cree - y.cree;
    });

    const total = candidats.length;
    const pool = candidats.slice(0, 100).map((m) => {
      const p = profondeurDe(m.terminees);
      const statutPas = mesPasMap.get(m.uid);
      const match = partenairesMatch.get(m.uid);
      return {
        id: m.uid,
        pseudo: (m.dn ?? '').trim() || m.un || null,
        mondes: p.mondes,
        mondesFranchis: p.mondesFranchis,
        jalonB: p.jalonB,
        pasEnvoye: statutPas === undefined ? false : statutPas.statut === 'actif' || statutPas.statut === 'match',
        pasId: statutPas !== undefined && statutPas.statut === 'actif' ? statutPas.id : null,
        match: match !== undefined,
        matchA: match?.creeA ?? null,
        depuisA: new Date(m.cree * 1000).toISOString(),
      };
    });

    // Les matchs, avec l'identité de l'autre (les DEUX ont fait un pas).
    const matchs = matchsRows.map((m) => {
      const autreId = m.a === session.userId ? m.b : m.a;
      const membre = parMembre.get(autreId);
      return {
        id: m.id,
        creeA: m.cree_a,
        autre: {
          id: autreId,
          pseudo: membre ? ((membre.dn ?? '').trim() || membre.un || null) : null,
        },
      };
    });

    return c.json({
      ok: true,
      jalonA: true,
      jalonB: maProfondeur.jalonB,
      pasRecus: pasRecusRows?.n ?? 0,
      total,
      pool,
      matchs,
      moi: maProfondeur,
    });
  } catch (e) {
    console.error('[rencontres] pool failed', e);
    return c.json({ ok: false, error: 'store_unavailable' }, 500);
  }
});

rencontresRoutes.post('/rencontres/pas', async (c) => {
  let session: { sessionId: string; userId: string };
  try {
    session = requireAuth(c);
  } catch {
    return c.json({ ok: false, error: 'unauthorized' }, 401);
  }
  // Anti-abus : 30 pas / heure par membre (large — un pas par personne et
  // par destinataire, P5 ; la borne mécanique reste).
  const rl = await hitRateLimit(c.env.DB, RATE_RULES.rencontrePasUser, session.userId);
  if (!rl.allowed) throw rateLimitedError(rl.retryAfterSeconds, RATE_RULES.rencontrePasUser.scope);

  let corps: unknown;
  try {
    corps = await c.req.json();
  } catch {
    return c.json({ ok: false, error: 'invalid_body' }, 400);
  }
  const vers = (corps as { vers?: unknown } | null)?.vers;
  if (typeof vers !== 'string' || vers.length === 0 || vers.length > 64) {
    return c.json({ ok: false, error: 'invalid_body' }, 400);
  }
  if (vers === session.userId) return c.json({ ok: false, error: 'invalid_target' }, 400);

  try {
    // Le plancher est MUTUEL : moi ET l'autre devons avoir le jalon A,
    // l'autre doit exister et être actif.
    const [moiA, cible] = await Promise.all([
      jalonAAtteint(c.env.DB, session.userId),
      c.env.DB.prepare(`SELECT status FROM users WHERE id = ?1 LIMIT 1`).bind(vers).first<{ status: string }>(),
    ]);
    if (!cible || cible.status !== 'active') return c.json({ ok: false, error: 'invalid_target' }, 400);
    if (!moiA || !(await jalonAAtteint(c.env.DB, vers))) {
      return c.json({ ok: false, error: 'target_not_ready' }, 403);
    }

    // Un match existe déjà entre nous ? Le pas n'a plus de sens.
    const [x, y] = [session.userId, vers].sort();
    const dejaMatch = await c.env.DB.prepare(
      `SELECT id FROM rencontre_matchs WHERE a = ?1 AND b = ?2 LIMIT 1`,
    )
      .bind(x, y)
      .first<{ id: string }>();
    if (dejaMatch) return c.json({ ok: false, error: 'deja_match' }, 409);

    const existant = await c.env.DB.prepare(
      `SELECT id, statut FROM rencontre_pas WHERE de = ?1 AND vers = ?2 LIMIT 1`,
    )
      .bind(session.userId, vers)
      .first<{ id: string; statut: string }>();
    if (existant?.statut === 'match') return c.json({ ok: false, error: 'deja_match' }, 409);

    const now = new Date().toISOString();
    if (existant) {
      // Retiré puis re-fait : le pas se réactive (UNIQUE de,vers — upsert).
      if (existant.statut === 'actif') return c.json({ ok: true, match: false });
      await c.env.DB.prepare(`UPDATE rencontre_pas SET statut = 'actif', cree_a = ?3 WHERE id = ?1 AND de = ?2`)
        .bind(existant.id, session.userId, now)
        .run();
    } else {
      await c.env.DB.prepare(
        `INSERT INTO rencontre_pas (id, de, vers, statut, cree_a) VALUES (?1, ?2, ?3, 'actif', ?4)`,
      )
        .bind(crypto.randomUUID(), session.userId, vers, now)
        .run();
    }

    // LA RÉCIPROCITÉ (P4) : l'autre avait fait un pas vers moi (aveugle) —
    // deux pas = un match. Les deux pas passent à 'match'.
    const reciproque = await c.env.DB.prepare(
      `SELECT id FROM rencontre_pas WHERE de = ?1 AND vers = ?2 AND statut = 'actif' LIMIT 1`,
    )
      .bind(vers, session.userId)
      .first<{ id: string }>();
    if (reciproque) {
      const matchId = crypto.randomUUID();
      await c.env.DB.batch([
        c.env.DB.prepare(
          `INSERT INTO rencontre_matchs (id, a, b, cree_a) VALUES (?1, ?2, ?3, ?4)`,
        ).bind(matchId, x, y, now),
        c.env.DB.prepare(`UPDATE rencontre_pas SET statut = 'match' WHERE de = ?1 AND vers = ?2`).bind(session.userId, vers),
        c.env.DB.prepare(`UPDATE rencontre_pas SET statut = 'match' WHERE de = ?1 AND vers = ?2`).bind(vers, session.userId),
      ]);
      return c.json({ ok: true, match: true, matchId });
    }
    return c.json({ ok: true, match: false });
  } catch (e) {
    console.error('[rencontres] pas failed', e);
    return c.json({ ok: false, error: 'store_unavailable' }, 500);
  }
});

rencontresRoutes.delete('/rencontres/pas/:id', async (c) => {
  let session: { sessionId: string; userId: string };
  try {
    session = requireAuth(c);
  } catch {
    return c.json({ ok: false, error: 'unauthorized' }, 401);
  }
  const id = c.req.param('id');
  if (!/^[0-9a-f-]{16,64}$/i.test(id)) return c.json({ ok: false, error: 'invalid_body' }, 400);
  try {
    // Retrait possible à tout moment (P5) — tant que ce n'est pas devenu un
    // match (unmatch : E2, filet = check-in sécurité du Monde 11).
    await c.env.DB.prepare(
      `UPDATE rencontre_pas SET statut = 'retire' WHERE id = ?1 AND de = ?2 AND statut = 'actif'`,
    )
      .bind(id, session.userId)
      .run();
    return c.json({ ok: true });
  } catch (e) {
    console.error('[rencontres] retrait failed', e);
    return c.json({ ok: false, error: 'store_unavailable' }, 500);
  }
});
