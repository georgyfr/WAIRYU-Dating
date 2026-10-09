import { useI18n } from '../i18n/I18nProvider';
import NotificationsCard from '../components/NotificationsCard';

export default function Welcome({ onStart }: { onStart: () => void }) {
  const { tx } = useI18n();
  return (
    <div className="app-shell">
      <main className="welcome">
        <img
          src="/icons/icon-192.png"
          alt={tx('Logo Wairyu — deux bulles de dialogue reliées par trois points')}
          className="welcome-logo"
        />
        <h1>
          Wai<span className="accent">ryu</span>
        </h1>
        <p className="tagline">
          {tx(
            'Des rencontres sincères, à votre rythme. Photos consenties, messages réels, matching explicable.',
          )}
        </p>
        <div className="promises">
          <span className="promise">
            <span className="dot" aria-hidden="true" /> {tx('Photos consenties, jamais volées')}
          </span>
          <span className="promise">
            <span className="dot" aria-hidden="true" /> {tx('Matching explicable, jamais opaque')}
          </span>
          <span className="promise">
            <span className="dot coral" aria-hidden="true" /> {tx("La rencontre n'est jamais payante")}
          </span>
        </div>
        <button className="btn btn-primary btn-block" onClick={onStart}>
          {tx('Commencer')}
        </button>
        <NotificationsCard />
      </main>
    </div>
  );
}
