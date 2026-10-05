const DEMO_PROFILES = [
  {
    id: 'demo-1',
    name: 'Aminata',
    age: 27,
    emoji: '🌿',
    bio: 'Passionnée de botanique et de marchés du dimanche. Je crois aux conversations lentes.',
  },
  {
    id: 'demo-2',
    name: 'Jonas',
    age: 31,
    emoji: '🎶',
    bio: 'Guitariste du week-end, cartographe de la semaine. Toujours partant pour un concert.',
  },
  {
    id: 'demo-3',
    name: 'Léa',
    age: 25,
    emoji: '📚',
    bio: 'Lectrice vorace et randonneuse occasionnelle. Le respect avant tout.',
  },
];

export default function Discover() {
  return (
    <main className="screen">
      <h1 className="screen-title">Découvrir</h1>
      <p className="screen-sub">Profils de démonstration — le moteur arrive.</p>
      {DEMO_PROFILES.map((p) => (
        <article className="card profile-card" key={p.id}>
          <div className="photo" role="img" aria-label={`Photo (démo) de ${p.name}`}>
            {p.emoji}
          </div>
          <div className="body">
            <div className="name-row">
              <span className="name">{p.name}</span>
              <span className="age">{p.age}</span>
            </div>
            <p className="bio">{p.bio}</p>
            <span className="demo-badge">Profil de démonstration</span>
          </div>
        </article>
      ))}
    </main>
  );
}
