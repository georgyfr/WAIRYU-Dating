/**
 * Task 66 — POST /api/satisfaction : réception de la note de satisfaction
 * d'une quête (la barre « Ton avis compte »).
 *
 * Contrat vérifié sur le rendu :
 *  - corps { quete: string (1-24), note: 1|2|3|4|5, commentaire?: string } ;
 *  - commentaire tronqué à 500 caractères (le front limite déjà) ;
 *  - 200 { ok: true } | 400 { ok: false, error: 'invalid_body' }.
 *
 * Le front appelle en fire-and-forget (credentials same-origin) : la note ne
 * doit JAMAIS bloquer ni casser le parcours. La session est optionnelle — le
 * membre peut noter avant toute connexion ; on la joint quand elle existe
 * (rapprochement ultérieur, sans jamais exposer l'identité ici).
 *
 * Usage des notes : améliorer les quêtes, une par une. Elles n'entrent dans
 * AUCUN score, AUCUN sélecteur, AUCUNE carte — jamais.
 */
import { Hono } from 'hono';
import type { AppEnv } from '../env';

export const satisfactionRoutes = new Hono<AppEnv>();

/** Note valide : exactement un entier 1..5 (jamais « 0 truthy », jamais texte). */
function estNote(val: unknown): val is 1 | 2 | 3 | 4 | 5 {
  return val === 1 || val === 2 || val === 3 || val === 4 || val === 5;
}

satisfactionRoutes.post('/satisfaction', async (c) => {
  let corps: unknown;
  try {
    corps = await c.req.json();
  } catch {
    return c.json({ ok: false, error: 'invalid_body' }, 400);
  }
  if (!corps || typeof corps !== 'object' || Array.isArray(corps)) {
    return c.json({ ok: false, error: 'invalid_body' }, 400);
  }
  const donnees = corps as { quete?: unknown; note?: unknown; commentaire?: unknown };
  const quete = typeof donnees.quete === 'string' ? donnees.quete.trim() : '';
  if (quete.length === 0 || quete.length > 24 || !estNote(donnees.note)) {
    return c.json({ ok: false, error: 'invalid_body' }, 400);
  }
  const commentaire =
    typeof donnees.commentaire === 'string' ? donnees.commentaire.trim().slice(0, 500) : '';

  // Stockage D1 — une note par ligne, horodatée ; l'échec de stockage ne
  // renverse pas la requête du membre (log serveur + 500 sobre).
  try {
    const session = c.get('session');
    await c.env.DB.prepare(
      `INSERT INTO satisfaction (quete, note, commentaire, session_id, created_at)
       VALUES (?1, ?2, ?3, ?4, ?5)`,
    )
      .bind(
        quete,
        donnees.note,
        commentaire,
        session?.sessionId ?? null,
        new Date().toISOString(),
      )
      .run();
  } catch (err) {
    console.error(
      JSON.stringify({ level: 'error', route: 'POST /api/satisfaction', err: String(err) }),
    );
    return c.json({ ok: false, error: 'store_unavailable' }, 500);
  }
  return c.json({ ok: true });
});
