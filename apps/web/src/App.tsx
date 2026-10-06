import { useEffect } from 'react';
import { useState } from 'react';
import Welcome from './screens/Welcome';
import Discover from './screens/Discover';
import Messages from './screens/Messages';
import Profile from './screens/Profile';
import TabBar, { type Tab } from './components/TabBar';
import { autoArmWebPush, registerDeviceOpen } from './lib/push-client';

type Stage = 'welcome' | Tab;

export default function App() {
  const [stage, setStage] = useState<Stage>('welcome');

  // Boot notifications : enregistre l'ouverture de l'appareil (première
  // ouverture ⇒ événement + notification de bienvenue dès l'abonnement)
  // puis arme automatiquement le push (leçon v1 Task 62 — armement sur le
  // prochain geste utilisateur si la permission est encore « default »).
  useEffect(() => {
    void registerDeviceOpen();
    void autoArmWebPush();
  }, []);

  if (stage === 'welcome') {
    return <Welcome onStart={() => setStage('discover')} />;
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <img
          src="/icons/favicon-48.png"
          alt="Logo Wairyu — deux bulles de dialogue reliées"
          width={28}
          height={28}
        />
        <span className="brand">
          Wai<span className="brand-accent">ryu</span>
        </span>
      </header>
      {stage === 'discover' && <Discover />}
      {stage === 'messages' && <Messages />}
      {stage === 'profile' && <Profile />}
      <TabBar active={stage} onSelect={setStage} />
    </div>
  );
}
