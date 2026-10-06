import NotificationsCard from '../components/NotificationsCard';

export default function Welcome({ onStart }: { onStart: () => void }) {
  return (
    <div className="app-shell">
      <main className="welcome">
        <img
          src="/icons/icon-192.png"
          alt="Logo Wairyu — deux bulles de dialogue reliées par trois points"
          className="welcome-logo"
        />
        <h1>
          Wai<span className="accent">ryu</span>
        </h1>
        <p className="tagline">
          Des rencontres sincères, à votre rythme. Photos consenties,
          messages réels, matching explicable.
        </p>
        <div className="promises">
          <span className="promise">
            <span className="dot" aria-hidden="true" /> Photos consenties,
            jamais volées
          </span>
          <span className="promise">
            <span className="dot" aria-hidden="true" /> Matching explicable,
            jamais opaque
          </span>
          <span className="promise">
            <span className="dot coral" aria-hidden="true" /> La rencontre
            n'est jamais payante
          </span>
        </div>
        <button className="btn btn-primary btn-block" onClick={onStart}>
          Commencer
        </button>
        <NotificationsCard />
      </main>
    </div>
  );
}
