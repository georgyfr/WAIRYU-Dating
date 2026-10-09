import { useI18n } from '../i18n/I18nProvider';

export default function Messages() {
  const { tx } = useI18n();
  return (
    <main className="screen">
      <h1 className="screen-title">{tx('Messages')}</h1>
      <div className="empty">
        <span className="emoji" aria-hidden="true">
          💬
        </span>
        <h2>{tx("Aucun message pour l'instant")}</h2>
        <p>
          {tx(
            "Quand quelqu'un vous répondra, la conversation apparaîtra ici. Messages réels, jamais automatisés.",
          )}
        </p>
      </div>
    </main>
  );
}
