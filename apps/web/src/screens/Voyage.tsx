/**
 * LE VOYAGE — écran d'accueil de l'app connectée (demande fondateur).
 *
 * « Ce que l'on doit trouver à l'accueil, c'est le voyage : une brève
 * présentation, les objectifs, les résultats attendus, les différentes
 * étapes. » — la page s'appuie sur la doctrine du dépôt d'origine
 * (Constitution v2.1 + Livrable des mondes) : 11 mondes, 51 quêtes, une
 * destination — la rencontre.
 *
 * Esprit : ludique SANS jamais dire « jeu » — pas de score, pas de niveau,
 * pas de classement. Le vocabulaire est celui du voyage (mondes, étapes,
 * portraits). Les mondes premium (💎) sont marqués mais JAMAIS vendus ici.
 *
 * Les mondes s'ouvriront un à un (status 'open' quand les quêtes sont
 * jouables) ; aujourd'hui la page PRÉSENTE le voyage dans son ensemble.
 */
import { GAINS, OBJECTIVES, WORLDS } from '../lib/voyage';

interface Props {
  /** Ouvrir l'onglet Découvrir (en attendant l'ouverture du Monde 1). */
  onDiscover: () => void;
}

export default function Voyage({ onDiscover }: Props) {
  const freeCount = WORLDS.filter((w) => w.free).length;

  return (
    <div className="voyage">
      {/* ---------- Héros : la brève présentation ---------- */}
      <section className="voyage-hero" aria-labelledby="voyage-title">
        <span className="voyage-hero-kicker">Ton voyage commence ici</span>
        <h1 id="voyage-title" className="voyage-title">
          Le V<span className="accent">oyage</span>
        </h1>
        <p className="voyage-sub">
          11 mondes · 51 étapes · une destination&nbsp;: une rencontre qui te ressemble.
        </p>
        <p className="voyage-lede">
          Ici, personne ne te note et personne ne te classe. Tu réponds à ta façon — chaque
          réponse construit ton portrait, affine tes rencontres, et avance ton voyage. Ce que
          l’on découvre en chemin n’appartient qu’à toi&nbsp;: tu choisis ce qui se voit.
        </p>
        <a className="voyage-hero-cta" href="#voyage-monde-1">
          Voir la carte du voyage <span aria-hidden="true">↓</span>
        </a>
      </section>

      {/* ---------- Les objectifs ---------- */}
      <section className="voyage-section" aria-labelledby="voyage-objectifs">
        <h2 id="voyage-objectifs" className="voyage-h2">
          Ce que ce voyage fait pour toi
        </h2>
        <div className="voyage-grid">
          {OBJECTIVES.map((o) => (
            <article key={o.title} className="voyage-card voyage-card-objectif">
              <span className="voyage-card-emoji" aria-hidden="true">
                {o.emoji}
              </span>
              <h3>{o.title}</h3>
              <p>{o.text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ---------- Les gains (ce que tu récoltes) ---------- */}
      <section className="voyage-section" aria-labelledby="voyage-gains">
        <h2 id="voyage-gains" className="voyage-h2">
          Ce que tu récoltes en chemin
        </h2>
        <p className="voyage-section-sub">
          Le voyage transforme tes réponses en documents qui te ressemblent — étape après étape.
        </p>
        <ol className="voyage-gains">
          {GAINS.map((g) => (
            <li key={g.title} className="voyage-card voyage-gain">
              <span className="voyage-gain-emoji" aria-hidden="true">
                {g.emoji}
              </span>
              <div>
                <h3>
                  {g.title}
                  <small> — {g.when}</small>
                </h3>
                <p>{g.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ---------- Les étapes : la carte des 11 mondes ---------- */}
      <section className="voyage-section" aria-labelledby="voyage-etapes">
        <h2 id="voyage-etapes" className="voyage-h2">
          Les étapes du voyage
        </h2>
        <p className="voyage-section-sub">
          Ton territoire est gratuit sur {freeCount} mondes sur 11 — dont la destination. Tu
          avances à ton rythme, un monde à la fois.
        </p>
        <ol className="voyage-worlds">
          {WORLDS.map((w) => (
            <li
              key={w.code}
              id={w.num === 1 ? 'voyage-monde-1' : undefined}
              className={`voyage-world${w.num === 1 ? ' voyage-world-first' : ''}`}
            >
              <span className="voyage-world-node" aria-hidden="true">
                {w.emoji}
              </span>
              <div className="voyage-world-body">
                <h3>
                  <span className="voyage-world-num">Monde {w.num}</span> {w.name}
                  {!w.free && (
                    <span className="voyage-chip voyage-chip-premium" title="Monde premium">
                      💎 Premium
                    </span>
                  )}
                  {w.free && w.num === 11 && (
                    <span className="voyage-chip voyage-chip-free" title="Toujours gratuit">
                      Toujours gratuit
                    </span>
                  )}
                </h3>
                <p className="voyage-world-tagline">{w.tagline}</p>
                <p className="voyage-world-meta">
                  {w.quests} {w.quests > 1 ? 'étapes' : 'étape'}
                  {w.note ? ` · ${w.note}` : ''}
                  {w.status === 'soon' && w.num === 1 ? ' · Ouverture imminente' : ''}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ---------- Pied : en attendant l'ouverture du Monde 1 ---------- */}
      <section className="voyage-section voyage-outro" aria-label="Prochaine ouverture">
        <div className="voyage-card voyage-outro-card">
          <h3>Premier arrêt : Le Miroir 🪞</h3>
          <p>
            Le Monde 1 ouvre très bientôt. En attendant, explore les profils et prépare ta
            rencontre — ton voyage est déjà commencé.
          </p>
          <button className="btn btn-accent btn-block" onClick={onDiscover}>
            Explorer Découvrir en attendant
          </button>
        </div>
      </section>
    </div>
  );
}
