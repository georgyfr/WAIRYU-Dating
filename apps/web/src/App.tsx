import { useState } from 'react';
import Welcome from './screens/Welcome';
import Discover from './screens/Discover';
import Messages from './screens/Messages';
import Profile from './screens/Profile';
import TabBar, { type Tab } from './components/TabBar';

type Stage = 'welcome' | Tab;

export default function App() {
  const [stage, setStage] = useState<Stage>('welcome');

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
