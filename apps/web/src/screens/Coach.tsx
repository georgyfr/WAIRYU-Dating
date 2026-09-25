/**
 * Écran « Coach » (Task 37 — demande fondateur : menu Invisible
 * « explorer, révélation, chat, coach, profil »).
 *
 * L'outillage d'ALCHIMIE CONVERSATIONNELLE (spec §1 : « coach de
 * conversation, cartes thématiques » ; §2.3 : combler le « trou
 * d'alchimie » des apps personality-first où les matchs meurent faute
 * d'aide). Comme pour Moments : APERÇU honnête — le coach IA arrive
 * avec sa Phase 2 (spec §9.5 : « Au lancement, Wairyu n'aura que le
 * chat et les voice notes ») ; rien n'est trompeur, aucun faux bouton.
 * Éthique (spec §5.6.7) : un coach IA peut être intrusif — le nôtre
 * suggère, ne montre jamais, se désactive.
 */
interface Props {
  /** Vers le deck Invisible (il faut des conversations avant du coaching). */
  onExplore: () => void;
  /** Vers la messagerie — là où le coach s'incrusterà, discrètement. */
  onMessages: () => void;
}

interface CoachCard {
  id: string;
  emoji: string;
  title: string;
  when: string;
  kind: string;
  desc: string;
  tint: string;
}

const FEATURES: CoachCard[] = [
  {
    id: 'relance',
    emoji: '💡',
    title: 'Suggestions de relance',
    when: 'Phase 2 — dans le chat',
    kind: 'Coach IA',
    desc: 'Conversation qui s’essouffle ? Le coach propose 2-3 relances piochées dans les centres d’intérêt que vous avez VRAIMENT en commun (matching explicable). Tu restes l’auteur — les suggestions se copient, se réécrivent, ou s’ignorent.',
    tint: 'violet',
  },
  {
    id: 'cartes',
    emoji: '🃏',
    title: 'Cartes thématiques',
    when: 'Phase 2 — dans le chat',
    kind: 'Jeux de découverte',
    desc: 'Des paquets de cartes pour apprendre l’autre sans interrogatoire : « enfance », « rêves fous », « tabous doux »… On pioche à deux, les réponses nourrissent la conversation — et le rituel de révélation avance naturellement.',
    tint: 'rose',
  },
  {
    id: 'defis',
    emoji: '🎲',
    title: 'Défis d’alchimie',
    when: 'Phase 2 — hebdomadaire',
    kind: 'Micro-défis',
    desc: 'Un mini-défi par semaine pour ta conversation (raconter une anecdote vocale, se décrire un parfum d’enfance…). Jamais de pression : un défi ignoré ne pénalise rien — c’est un tremplin, pas un devoir.',
    tint: 'soleil',
  },
  {
    id: 'ethique',
    emoji: '🛡️',
    title: 'Un coach qui sait se taire',
    when: 'Engagé dès le jour 1',
    kind: 'Notre promesse',
    desc: 'Un coach IA peut être maladroit, générique ou intrusif (spec §5.6.7). Le coach wairyu suggère sans jamais écrire à ta place, se désactive en un geste, et ne lit RIEN en dehors de la conversation où il t’aide. Gratuit, comme tout.',
    tint: 'noir',
  },
];

export function Coach({ onExplore, onMessages }: Props) {
  return (
    <div className="app coach-page">
      <header className="wizard-head plain">
        <h1>🎯 Coach</h1>
      </header>

      <section className="moments-hero">
        <h2>L’alchimie, c’est un art — on t’aide</h2>
        <p>
          Créer un match, c’est facile. Faire durer la conversation, c’est
          l’art. Le coach wairyu arrive pour ça : des relances qui sentent le
          vécu, des cartes qui ouvrent les cœurs, des défis qui font rire —
          jamais de scripts robots, jamais de pression.
        </p>
        <div className="hero-chips">
          <span className="chip-hero">💡 Relances perso</span>
          <span className="chip-hero">🃏 Cartes à deux</span>
          <span className="chip-hero">🎲 Défis doux</span>
          <span className="chip-hero">🛡️ Zéro intrusion</span>
        </div>
      </section>

      <div className="moments-grid">
        {FEATURES.map((f) => (
          <article key={f.id} className={`moment-card tint-${f.tint}`}>
            <div className="moment-head">
              <span className="moment-emoji" aria-hidden="true">{f.emoji}</span>
              <div>
                <h3>{f.title}</h3>
                <p className="moment-when">
                  {f.when} · {f.kind}
                </p>
              </div>
            </div>
            <p className="moment-desc">{f.desc}</p>
          </article>
        ))}
      </div>

      <div className="cta-row coach-cta">
        <button type="button" className="btn primary" onClick={onMessages}>
          💬 En attendant : tes conversations
        </button>
        <button type="button" className="btn ghost" onClick={onExplore}>
          🧭 Explorer en Invisible
        </button>
      </div>

      <p className="hint">
        Aperçu de la Phase 2 — le coach sera annoncé ici en premier, inclus
        gratuitement comme tout le reste sur wairyu. En attendant, le rituel de
        révélation (15 messages · 7 jours · accord des deux) fait déjà le
        meilleur des coachs : le temps.
      </p>
    </div>
  );
}
