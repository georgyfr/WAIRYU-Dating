/**
 * ChatRoom — Durable Object SQLite, squelette Étape 1.
 * Une instance par conversation. Utilisé réellement en Étape 6 (WebSocket + messages),
 * mais provisionné dès maintenant : classe déployée, alarm() câblée, healthcheck OK.
 */
import { DurableObject } from 'cloudflare:workers';

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  kind: 'text' | 'voice';
  body: string; // texte ou public_id Cloudinary pour voice
  createdAt: number;
}

export class ChatRoom extends DurableObject {
  /** Healthcheck + init du schéma interne du DO. */
  override async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/health') {
      const storage = this.ctx.storage.sql ? 'sqlite' : 'kv';
      return Response.json({ ok: true, storage });
    }

    return Response.json({ error: { code: 'not_found', message: 'Unknown DO route' } }, { status: 404 });
  }

  /**
   * alarm() — filet de sécurité : réveil périodique pour les tâches différées
   * (expiration de conversations, relances de révélation — Étape 6).
   * Remarque architecture : remplace Cloudflare Queues (indisponible en free tier).
   */
  override async alarm(): Promise<void> {
    // Étape 6 : purge des états temporaires, relance des révélations éligibles.
    return;
  }
}
