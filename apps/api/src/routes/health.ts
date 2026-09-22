import { Hono } from 'hono';
import type { AppEnv } from '../env';
import { APP } from '@wairyu/shared';

export const healthRoutes = new Hono<AppEnv>();

healthRoutes.get('/health', (c) => {
  return c.json({
    ok: true,
    service: APP.name,
    version: APP.apiVersion,
    env: c.env.ENVIRONMENT,
    time: new Date().toISOString(),
  });
});

healthRoutes.get('/version', (c) => {
  return c.json({ service: APP.name, version: APP.apiVersion });
});
