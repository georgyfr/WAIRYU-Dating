/**
 * « Tes rencontres » (#/matchs) — la porte Rencontre.
 *
 * RECONSTITUTION (5ᵉ reset sandbox) — fidèle au bundle staging (fonction `oh`,
 * lignes 10602-10649 de /tmp/staging-bundle-pretty.js) :
 *  - « Certaines rencontres commencent ici. » (verbatim) ;
 *  - état vide HONNÊTE (💞), JAMAIS de rencontre inventée ;
 *  - « la rencontre n'est jamais payante » (verbatim) ;
 *  - CTA « Voir ma carte du voyage » → #/voyage (plus aucun renvoi vers un
 *    espace masqué — Task 21).
 *
 * Détail typographique VERBATIM du bundle (ligne 10626) : « Comment ça
 * commence ? » contient une espace insécable U+00A0 avant le point
 * d'interrogation — ne pas « corriger ».
 *
 * Aucune prop (bundle : s.jsx(oh, {})). Apostrophes U+0027 (audit Task 25).
 */

export default function Rencontres() {
  return (
    <main className="screen">
      <h1 className="screen-title">Tes rencontres</h1>
      <p className="screen-sub">Certaines rencontres commencent ici.</p>
      <div className="empty">
        <span className="emoji" aria-hidden="true">
          💞
        </span>
        <h2>Aucune rencontre pour l'instant</h2>
        <p>
          Quand ton voyage révèle des affinités, elles apparaîtront ici : personnes compatibles,
          connexions réciproques, recommandations.
        </p>
      </div>
      <article className="card match-info">
        <p>
          {/* Verbatim bundle : espace insécable U+00A0 avant « ? ». */}
          <strong>{'Comment ça commence\u00A0?'}</strong> Ton voyage construit ton portrait et tes
          affinités — la première personne compatible apparaîtra ici, et le Voyage à Deux
          s'ouvrira avec elle. La rencontre n'est jamais payante.
        </p>
        <a className="btn btn-accent match-info-cta" href="#/voyage">
          Voir ma carte du voyage
          <svg
            viewBox="0 0 24 24"
            width={16}
            height={16}
            fill="none"
            stroke="currentColor"
            strokeWidth={2.4}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </a>
      </article>
    </main>
  );
}
