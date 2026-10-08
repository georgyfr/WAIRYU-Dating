export default function Messages() {
  return (
    <main className="screen">
      <h1 className="screen-title">Messages</h1>
      <div className="empty">
        <span className="emoji" aria-hidden="true">
          💬
        </span>
        <h2>Aucun message pour l'instant</h2>
        <p>
          Quand quelqu'un vous répondra, la conversation apparaîtra ici.
          Messages réels, jamais automatisés.
        </p>
      </div>
    </main>
  );
}
