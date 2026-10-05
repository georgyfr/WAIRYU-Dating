export default function Profile() {
  return (
    <main className="screen">
      <h1 className="screen-title">Mon profil</h1>
      <p className="screen-sub">Votre espace — à personnaliser prochainement.</p>
      <article className="card profile-card">
        <div className="photo" role="img" aria-label="Votre photo (démo)">
          🙂
        </div>
        <div className="body">
          <div className="name-row">
            <span className="name">Vous</span>
          </div>
          <p className="bio">
            La création de compte et la personnalisation arrivent dans la
            prochaine vague de construction.
          </p>
          <span className="demo-badge">Socle de démonstration</span>
        </div>
      </article>
    </main>
  );
}
