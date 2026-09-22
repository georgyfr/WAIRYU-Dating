import { useEffect, useState } from 'react';
import type { HealthResponse } from '@wairyu/shared';

type Status = { state: 'loading' | 'ok' | 'err'; env?: string; version?: string };

export default function App() {
  const [status, setStatus] = useState<Status>({ state: 'loading' });

  useEffect(() => {
    fetch('/api/health')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((data: HealthResponse) =>
        setStatus({ state: 'ok', env: data.env, version: data.version }),
      )
      .catch(() => setStatus({ state: 'err' }));
  }, []);

  return (
    <main className="app">
      <div className="logo">
        <span>w</span>
      </div>
      <h1>wairyu</h1>
      <p className="tagline">
        Rencontres sincères. Photos consenties, messages réels, matching explicable.
      </p>

      <div className={`status ${status.state === 'ok' ? 'ok' : status.state === 'err' ? 'err' : ''}`}>
        <span className="dot" />
        {status.state === 'loading' && 'Connexion à l’API…'}
        {status.state === 'ok' && (
          <>
            API connectée <small>· env {status.env} · v{status.version}</small>
          </>
        )}
        {status.state === 'err' && 'API injoignable — réessayez plus tard'}
      </div>

      <footer>
        L’application arrive bientôt en beta fermée.
        <br />
        Mode Classique &amp; mode Invisible — vos photos restent sous votre contrôle.
      </footer>
    </main>
  );
}
