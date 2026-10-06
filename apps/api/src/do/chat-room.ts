/**
 * Durable Object ChatRoom — STUB Étape 1 (le DO complet arrive à l'Étape 6 :
 * WebSocket hibernation, 1 conversation = 1 DO SQLite, révélations…).
 */
import type { AppEnv, Env } from '../env';
import { errorBody } from '../lib/errors';

export class ChatRoom implements DurableObject {
  constructor(
    private readonly state: DurableObjectState,
    private readonly env: Env,
  ) {
    void this.state;
    void this.env;
  }

  async fetch(): Promise<Response> {
    return new Response(
      JSON.stringify(errorBody('not_found', 'ChatRoom — livrée à l\u2019Étape 6 (chat temps réel).', 'do-stub')),
      {
        status: 501,
        headers: { 'content-type': 'application/json; charset=utf-8' },
      },
    );
  }

  async alarm(): Promise<void> {
    /* no-op Étape 1 */
  }
}

export type { AppEnv };
