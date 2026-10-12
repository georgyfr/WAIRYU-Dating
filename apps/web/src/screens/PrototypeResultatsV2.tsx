/**
 * PROTOTYPE V2 — « Résultats 2.0 : reprise à zéro » (validation fondateur).
 *
 * Portée : STAGING UNIQUEMENT (4ᵉ onglet de #/prototype-resultats, hors
 * navigation, sans compte) — la prod n'est pas concernée tant que le
 * fondateur n'a pas validé.
 *
 * Demande fondateur : « on peut faire mieux — je souhaite reprendre les
 * quêtes à zéro pour revoir les résultats sans effet Barnum, et sans créer
 * de bugs sur les tests ». Ce que fait cet écran :
 *
 *   1. LA REPRISE À ZÉRO — les affirmations se répondent ICI, à vide
 *      (aucune réponse pré-remplie au chargement) ; les résultats ne se
 *      construisent qu'une fois tout répondu, comme en production. Le
 *      bouton « Reprendre à zéro » vide tout, à tout moment.
 *
 *   2. L'OMBRE À PART ÉGALE — la carte verbatim est présentée en deux faces
 *      de même poids (lumière | ombre), et l'ombre reçoit son propre bloc
 *      ANCRÉ, proportionnel aux nombres réels :
 *        - ombre pleine : chiffre + réponses mot pour mot + texte du
 *          Livrable + le coût en clair ;
 *        - ombre courte : chiffre + texte du Livrable + le coût en clair ;
 *        - ombre d'équilibre : honnête — « ton ombre vivra dans l'excès de
 *          tes forces », avec la zone d'ombre de la carte (verbatim).
 *      La LUMIÈRE reçoit le même traitement ancré — même poids, symétrie.
 *
 *   3. LA RÈGLE DE PROPORTION EST DITE — « la longueur suit tes nombres, pas
 *      un texte fixe » ; anti-Barnum par construction.
 *
 * Où vit l'ombre (règle prototype, affichée à l'écran) :
 *   - 1.1 personnalité : dans la dimension la PLUS DISCRÈTE, si son palier
 *     est bas (le palier « doux » du Livrable porte déjà ce texte) ;
 *   - 1.2 attachement : dans le besoin le PLUS FORT des deux (réassurance ou
 *     espace), si son palier est haut (le palier « fort » porte le garde-fou).
 *   Sinon → ombre d'équilibre.
 *
 * Garde-fous : AUCUN item, scorer, sélecteur ou texte livrable modifié — les
 * moteurs produit sont appelés tels quels (scorer → choisirVariante → cartes ;
 * construireApercuResultats → barres, paliers, textes). Les seuls textes
 * nouveaux : les lignes « Le coût, en clair » et les cadrages — BADGÉS
 * « nouveau texte — à valider » à l'écran, pour que le fondateur voie ce qui
 * est verbatim et ce qui est proposé.
 *
 * FR inline (prototype ; l'internationalisation suivra la validation).
 */
import { useMemo, useState, type Dispatch, type SetStateAction } from 'react';
import { QUETES, construireApercuResultats } from '../lib/quetes';
import { ITEMS as ITEMS_11, LIKERT } from '../lib/quete-1-1';
import { ITEMS as ITEMS_12 } from '../lib/quete-1-2';

const Q11 = QUETES['1.1'];
const Q12 = QUETES['1.2'];

type QueteLikert = '1.1' | '1.2';
type ItemLikert = { code: string; text: string; orient: 'D' | 'I'; dim: string };
type Niveau = 1 | 2 | 3 | 4 | 5;
type Reps = Record<string, number>;

const ITEMS: Record<QueteLikert, readonly ItemLikert[]> = {
  '1.1': ITEMS_11,
  '1.2': ITEMS_12,
};

const QUETE: Record<QueteLikert, typeof Q11> = { '1.1': Q11, '1.2': Q12 };

const LABEL_NIVEAU: Record<number, string> = Object.fromEntries(
  LIKERT.map((l) => [l.value, l.label]),
);

/** La carte choisie par le MOTEUR RÉEL (scorer → choisirVariante → cartes). */
function cartePour(quete: typeof Q11, reponses: Reps) {
  return quete.cartes[quete.choisirVariante(quete.scorer(reponses))];
}

/** Presets Likert — par dimension, le niveau L visé (inversées recodées par le
 *  moteur : la moyenne vaut exactement (L−1)/4). « Point sensible » crée une
 *  dimension basse sans profil extrême — pour voir l'ombre pleine sur un
 *  profil ordinaire. */
function reponsesDeNiveaux(items: readonly ItemLikert[], niv: Record<string, Niveau>): Reps {
  const out: Reps = {};
  for (const it of items) {
    const L = niv[it.dim] ?? 3;
    out[it.code] = it.orient === 'D' ? L : ((6 - L) as Niveau);
  }
  return out;
}

const PRESETS_R0: Record<QueteLikert, { label: string; niv: Record<string, Niveau> }[]> = {
  '1.1': [
    { label: 'Explorateur chaleureux', niv: { O: 4, C: 3, E: 3, A: 4, S: 3 } },
    { label: 'Bâtisseur', niv: { O: 3, C: 4, E: 3, A: 3, S: 4 } },
    { label: 'Étoile sociale', niv: { O: 4, C: 3, E: 4, A: 3, S: 3 } },
    { label: 'Intense', niv: { O: 3, C: 3, E: 4, A: 3, S: 1 } },
    { label: 'Point sensible', niv: { O: 3, C: 2, E: 3, A: 3, S: 3 } },
    { label: 'Neutre partout', niv: { O: 3, C: 3, E: 3, A: 3, S: 3 } },
  ],
  '1.2': [
    { label: 'Ancrage (réserve)', niv: { A: 2, E: 2 } },
    { label: 'Vigie (cœur posé)', niv: { A: 4, E: 2 } },
    { label: 'Autonome (élan)', niv: { A: 2, E: 4 } },
    { label: 'Va-et-vient (deux moteurs)', niv: { A: 4, E: 4 } },
    { label: 'Neutre partout', niv: { A: 3, E: 3 } },
  ],
};

/** Titres produit des quêtes Likert (sans code interne). */
const VM_TITRES: Record<QueteLikert, string> = {
  '1.1': 'Ta personnalité',
  '1.2': 'Ta façon de t\u2019attacher',
};

/** Variante d'affichage d'un bloc :
 *  - 'labo' (défaut) : validation fondateur — sections numérotées, notes de
 *    méthode, badges « nouveau texte » ;
 *  - 'membre' : la page telle qu'un membre la vivra — épurée, sans numéros,
 *    sans notes, sans badges (demande fondateur Task 64).
 *  Les moteurs et les contenus du Livrable sont STRICTEMENT identiques. */
type Variante = 'labo' | 'membre';

/** Les lignes « Le coût, en clair » — SEULS textes nouveaux de l'ombre ancrée.
 *  1.1 : pole BAS de chaque dimension (l'ombre vit du côté discret) ;
 *  1.2 : pole HAUT de chaque besoin (l'ombre vit du besoin dominant).
 *  BADGÉS « nouveau texte — à valider » à l'écran. */
const COUTS: Record<QueteLikert, Record<string, string>> = {
  '1.1': {
    O: "Le coût, en clair : ce qui dure ne t'appelle pas. Les projets longs, les routines à deux, les choses qu'on refait ensemble te demanderont un effort que d'autres ne sentent jamais.",
    C: "Le coût, en clair : ce qui est étalé dans le temps glisse — une promesse non notée finit par faire attendre quelqu'un, et ça use doucement la confiance.",
    E: "Le coût, en clair : les grandes tables et les semaines pleines vident ta réserve plus vite que tu ne la remplis — et les tiens peuvent lire ce vide comme de la distance, alors que c'est de la fatigue.",
    A: "Le coût, en clair : celui qui donne vite peut vivre ta prudence comme un mur — des gens sincères resteront dehors faute de savoir comment entrer.",
    S: "Le coût, en clair : les vagues durent plus longtemps chez toi — une remarque du matin pèse encore le soir, et personne ne le voit de dehors.",
  },
  '1.2': {
    A: "Le coût, en clair : le silence de l'autre remplit plus vite qu'il ne parle — tu peux payer en vigilance ce qui se réglerait en une question posée.",
    E: "Le coût, en clair : l'air que tu prends ressemble à une fuite pour qui t'attend — dis ton rythme avant que l'autre ne l'invente.",
  },
};

/** Badges — pour que l'œil distingue verbatim et propositions. */
function BadgeNouveau() {
  return <span className="r0-badge">nouveau texte — à valider</span>;
}

/** Les affirmations rejouables — à ZÉRO au chargement (aucune réponse).
 *  Les puces passent par un UPDATER FONCTIONNEL : chaque clic part de
 *  l'état le plus récent — même à taps très rapides, aucune réponse ne se
 *  perd (robustesse test, demande fondateur). */
function Reprise({
  queteId,
  items,
  reps,
  setReps,
  variante = 'labo',
}: {
  queteId: QueteLikert;
  items: readonly ItemLikert[];
  reps: Reps;
  setReps: Dispatch<SetStateAction<Reps>>;
  variante?: Variante;
}) {
  const membre = variante === 'membre';
  const repondues = items.filter((it) => {
    const v = reps[it.code];
    return typeof v === 'number' && v >= 1 && v <= 5;
  }).length;
  const complet = repondues === items.length;
  return (
    <section className="proto-sec" aria-label={membre ? VM_TITRES[queteId] : 'Reprends les affirmations à zéro'}>
      <div className="r0-reprise-head">
        <h2 className="proto-h2">{membre ? VM_TITRES[queteId] : '1 · Reprends la quête à zéro'}</h2>
        <button
          type="button"
          className="btn btn-outline r0-reset"
          onClick={() => setReps({})}
          disabled={repondues === 0}
        >
          {membre ? 'Recommencer' : 'Reprendre à zéro'}
        </button>
      </div>
      <p className="proto-hint">
        {membre
          ? 'Réponds spontanément — il n\u2019y a ni bonne ni mauvaise réponse. Ta page de résultat se construit pendant que tu réponds.'
          : 'Aucune réponse n\u2019est pré-remplie : tu réponds, la page se construit. Les résultats arrivent quand tout est répondu — comme en production.'}
      </p>
      <p className="r0-progress" role="status">
        <span className="r0-progress-chiffre">
          {repondues} / {items.length}
        </span>{' '}
        affirmations répondues
        {!complet && ' — réponds à tout pour voir ta page de résultat'}
      </p>
      <div className="r0-progressbar" role="img" aria-label={`${repondues} sur ${items.length} répondues`}>
        <span className="r0-progressbar-fill" style={{ width: `${(repondues / items.length) * 100}%` }} />
      </div>
      <div className="proto-presets" role="group" aria-label="Profils d'exemple (pour la démonstration)">
        <span className="r0-presets-label">{membre ? 'Profils d\u2019exemple :' : 'Démonstration rapide :'}</span>
        {PRESETS_R0[queteId].map((p) => (
          <button
            key={p.label}
            type="button"
            className="btn btn-outline proto-preset"
            onClick={() => setReps(reponsesDeNiveaux(items, p.niv))}
          >
            {p.label}
          </button>
        ))}
      </div>
      <div className="proto-rep-liste" role="group" aria-label="Les affirmations et tes réponses">
        {items.map((it, idx) => (
          <div key={it.code} className="proto-rep">
            <p className="proto-rep-texte">
              <span className="proto-rep-num">{idx + 1}.</span> {it.text}
            </p>
            <div className="proto-rep-chips" role="radiogroup" aria-label={it.text}>
              {LIKERT.map((l) => (
                <button
                  key={l.value}
                  type="button"
                  className={`proto-chip${reps[it.code] === l.value ? ' proto-chip--on' : ''}`}
                  aria-pressed={reps[it.code] === l.value}
                  title={l.label}
                  onClick={() => setReps((prev) => ({ ...prev, [it.code]: l.value }))}
                >
                  {l.value}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="proto-hint">
        Échelle verbatim : 1 « {LABEL_NIVEAU[1]} » · 2 « {LABEL_NIVEAU[2]} » · 3 « {LABEL_NIVEAU[3]} »
        · 4 « {LABEL_NIVEAU[4]} » · 5 « {LABEL_NIVEAU[5]} ».
      </p>
    </section>
  );
}

/** Les barres du moteur — les nombres d'abord, avant toute prose.
 *  Variante membre : titre épuré + la ligne « Pourquoi cette carte » (le
 *  couple de barres le plus haut choisit la carte — anti-Barnum produit). */
function Nombres({
  queteId,
  reps,
  variante = 'labo',
}: {
  queteId: QueteLikert;
  reps: Reps;
  variante?: Variante;
}) {
  const membre = variante === 'membre';
  const apercu = useMemo(() => construireApercuResultats(QUETE[queteId], reps), [queteId, reps]);
  const top2 = [...apercu.bars].sort((a, b) => b.pct - a.pct).slice(0, 2);
  return (
    <section className="proto-sec" aria-label={membre ? 'Tes nombres' : 'Tes nombres d\'abord'}>
      <h2 className="proto-h2">{membre ? 'Tes nombres' : '2 · Tes nombres d\'abord'}</h2>
      {!membre && (
        <p className="proto-hint">
          Voici tout ce que tes réponses produisent — avant tout texte. La suite est la lecture de
          ces nombres, jamais l&apos;inverse.
        </p>
      )}
      <div className="proto-bars">
        {apercu.bars.map((b) => (
          <div key={b.key} className="proto-bar">
            <div className="proto-bar-head">
              <span className="proto-bar-nom">{b.nom}</span>
              <span className="proto-bar-niveau">
                — {b.pct}/100 ({b.palierLabel})
              </span>
            </div>
            <div className="proto-bar-track" role="img" aria-label={`${b.nom} : ${b.pct} sur 100`}>
              <span className="proto-bar-fill" style={{ width: `${Math.max(b.pct, 2)}%` }} />
            </div>
          </div>
        ))}
      </div>
      {membre && (
        <p className="vm-pourquoi">
          <strong>Pourquoi cette carte :</strong> tes barres les plus hautes sont «&nbsp;
          {top2[0].nom}&nbsp;» ({top2[0].pct}/100) et «&nbsp;{top2[1].nom}&nbsp;» ({top2[1].pct}/100)
          — c&apos;est ce profil de barres qui choisit ta carte.
        </p>
      )}
    </section>
  );
}

/** La carte verbatim — deux faces à part égale. */
function CarteDeuxFaces({
  queteId,
  reps,
  variante = 'labo',
}: {
  queteId: QueteLikert;
  reps: Reps;
  variante?: Variante;
}) {
  const membre = variante === 'membre';
  const carte = useMemo(() => cartePour(QUETE[queteId], reps), [queteId, reps]);
  return (
    <section className="proto-sec" aria-label={membre ? 'Ta carte' : 'Ta carte, deux faces à part égale'}>
      <h2 className="proto-h2">{membre ? 'Ta carte' : '3 · Ta carte — deux faces à part égale'}</h2>
      <p className="r0-nom">{carte.nom}</p>
      <div className="r0-faces">
        <div className="r0-face r0-face--lum" role="group" aria-label="Ta lumière">
          <p className="r0-face-kicker">Ta lumière</p>
          <p className="r0-face-texte">{carte.lumiere}</p>
        </div>
        <div className="r0-face r0-face--ombre" role="group" aria-label="Ton ombre">
          <p className="r0-face-kicker">Ton ombre</p>
          <p className="r0-face-texte">{carte.ombre}</p>
        </div>
      </div>
      <p className="r0-tension">
        <strong>Ta tension intérieure :</strong> {carte.tension}
      </p>
    </section>
  );
}

/** La liste mot pour mot — les réponses de l'utilisateur sur une dimension. */
function MotPourMot({ items, dim, reps }: { items: readonly ItemLikert[]; dim: string; reps: Reps }) {
  const liste = items.filter((it) => it.dim === dim);
  return (
    <ul className="proto-faits proto-faits-ecouts">
      {liste.map((it) => (
        <li key={it.code}>
          « {it.text} » — <strong>{LABEL_NIVEAU[reps[it.code]] ?? '—'}</strong>
        </li>
      ))}
    </ul>
  );
}

/** La lumière ancrée — même traitement que l'ombre (symétrie). */
function LumiereAncree({
  queteId,
  reps,
  top,
  variante = 'labo',
}: {
  queteId: QueteLikert;
  reps: Reps;
  top: Barre;
  variante?: Variante;
}) {
  const membre = variante === 'membre';
  const items = ITEMS[queteId];
  return (
    <section className="proto-sec" aria-label="Ce qui te porte">
      <h2 className="proto-h2">{membre ? 'Ce qui te porte' : '4 · Ce qui te porte'}</h2>
      {!membre && (
        <p className="proto-hint">
          Ta dimension la plus présente — avec tes réponses en preuve. Même traitement que
          l&apos;ombre : chiffre, mots, preuve.
        </p>
      )}
      <div className="r0-ancree r0-ancree--lum">
        <p className="r0-ancree-chiffre">
          <strong>{top.nom}</strong> à <strong>{top.pct}/100</strong> ({top.palierLabel})
        </p>
        <p className="r0-ancree-texte">{top.texte}</p>
        {top.palier === 'fort' && (
          <details className="r0-preuve">
            <summary>Ce que tes réponses disent, mot pour mot — « {top.nom} »</summary>
            <MotPourMot items={items} dim={top.key} reps={reps} />
          </details>
        )}
      </div>
    </section>
  );
}

type Barre = ReturnType<typeof construireApercuResultats>['bars'][number];

/** L'ombre ancrée proportionnelle — le cœur de la demande fondateur.
 *  Variante membre : titre épuré, sans note de méthode ni badge. */
function OmbreAncree({
  queteId,
  reps,
  top,
  bottom,
  carteOmbre,
  variante = 'labo',
}: {
  queteId: QueteLikert;
  reps: Reps;
  top: Barre;
  bottom: Barre;
  carteOmbre: string;
  variante?: Variante;
}) {
  const membre = variante === 'membre';
  const items = ITEMS[queteId];
  const ecart = top.pct - bottom.pct;
  // Où vit l'ombre (règle affichée en labo) : 1.1 → la dimension la plus
  // discrète, si son palier est bas ; 1.2 → le besoin le plus fort, si son
  // palier est haut.
  const cible = queteId === '1.1' ? bottom : top;
  const ancree = queteId === '1.1' ? cible.palier === 'doux' : cible.palier === 'fort';
  const pleine = ancree && ecart >= 25;
  const cout = COUTS[queteId][cible.key] ?? '';
  const ouVit =
    queteId === '1.1'
      ? `Ton ombre vit du côté le plus discret de ton profil — ici : « ${cible.nom} ».`
      : `Ton ombre vit du besoin qui domine — ici : « ${cible.nom} ».`;
  return (
    <section className="proto-sec" aria-label="Ce qui te coûte">
      <h2 className="proto-h2">
        {membre ? 'Ce qui te coûte' : '5 · Ce qui te coûte — ton ombre, proportionnée à tes nombres'}
      </h2>
      {!membre && (
        <p className="r0-regle" role="note">
          La règle de proportion : profil tranché → ombre détaillée ; profil peu tranché → ombre
          courte ; profil sans dimension marquée → ombre d&apos;équilibre. La longueur suit tes
          nombres, jamais un texte fixe.
        </p>
      )}
      {ancree ? (
        <div className={`r0-ancree r0-ancree--ombre${pleine ? '' : ' r0-ancree--courte'}`}>
          <p className="r0-ouvit">{ouVit}</p>
          <p className="r0-ancree-chiffre">
            <strong>{cible.nom}</strong> à <strong>{cible.pct}/100</strong> ({cible.palierLabel})
            — écart avec ta barre la plus haute : {ecart} points.
          </p>
          <p className="r0-ancree-texte">{cible.texte}</p>
          {pleine && (
            <details className="r0-preuve" open>
              <summary>Ce que tes réponses disent, mot pour mot — « {cible.nom} »</summary>
              <MotPourMot items={items} dim={cible.key} reps={reps} />
            </details>
          )}
          <p className="r0-cout">{cout}{!membre && <BadgeNouveau />}</p>
        </div>
      ) : (
        <div className="r0-ancree r0-ancree--equilibre">
          <p className="r0-ouvit">
            {queteId === '1.1'
              ? 'Aucun côté de ton profil n\u2019est assez discret pour porter une ombre.'
              : 'Aucun besoin ne domine assez pour porter une ombre.'}
          </p>
          <p className="r0-ancree-texte">
            Ton profil tient d&apos;une pièce : ton ombre vivra dans l&apos;excès de tes forces,
            pas dans un défaut. Ta carte te le dit : « {carteOmbre} »
          </p>
        </div>
      )}
      {!membre && (
        <p className="proto-hint">
          Tout ce bloc est déduit de tes réponses du jour — change-les, et l&apos;ombre suit.
          Aucun seuil interne n&apos;est affiché : la preuve, ce sont tes nombres et tes mots.
        </p>
      )}
    </section>
  );
}

/** La page complète d'une quête — réponses, puis résultats.
 *  variante 'labo' : reprise à zéro annotée (validation) ;
 *  variante 'membre' : la même mécanique, présentation épurée produit. */
function QueteFlow({ queteId, variante = 'labo' }: { queteId: QueteLikert; variante?: Variante }) {
  const membre = variante === 'membre';
  const items = ITEMS[queteId];
  const [reps, setReps] = useState<Reps>({});
  const complet = items.every((it) => {
    const v = reps[it.code];
    return typeof v === 'number' && v >= 1 && v <= 5;
  });

  const tri = useMemo(() => (complet ? [...construireApercuResultats(QUETE[queteId], reps).bars].sort((a, b) => b.pct - a.pct) : null), [queteId, reps, complet]);
  const carte = useMemo(() => (complet ? cartePour(QUETE[queteId], reps) : null), [queteId, reps, complet]);

  return (
    <>
      <Reprise queteId={queteId} items={items} reps={reps} setReps={setReps} variante={variante} />
      {!complet && (
        <section className="proto-sec" aria-label={membre ? 'Ta page de résultat arrive' : "Tes résultats t'attendent"}>
          <div className="r0-attente">
            <p>
              {membre ? (
                <>
                  Ta page de résultat arrive ici — réponds aux{' '}
                  <strong>{items.length} affirmations</strong> ci-dessus, ou choisis un profil
                  d&apos;exemple pour tout remplir d&apos;un coup.
                </>
              ) : (
                <>
                  Tes résultats se construisent ici — réponds aux{' '}
                  <strong>{items.length} affirmations</strong> ci-dessus, ou choisis un profil
                  d&apos;exemple pour voir la page se remplir.
                </>
              )}
            </p>
          </div>
        </section>
      )}
      {complet && tri && carte && (
        <>
          <Nombres queteId={queteId} reps={reps} variante={variante} />
          <CarteDeuxFaces queteId={queteId} reps={reps} variante={variante} />
          <LumiereAncree queteId={queteId} reps={reps} top={tri[0]} variante={variante} />
          <OmbreAncree queteId={queteId} reps={reps} top={tri[0]} bottom={tri[tri.length - 1]} carteOmbre={carte.ombre} variante={variante} />
          {!membre && (
          <section className="proto-sec" aria-label="Le contrat de cette page">
            <h2 className="proto-h2">6 · Le contrat de cette page</h2>
            <div className="proto-box proto-contrat">
              <p>
                <strong>Ce qu&apos;elle est :</strong> la lecture de TES réponses — tes nombres
                d&apos;abord, ta carte en deux faces égales, ta lumière et ton ombre ancrées et
                proportionnées à ce que tes réponses disent.
              </p>
              <p>
                <strong>Ce qu&apos;elle n&apos;est pas :</strong> un diagnostic, une étiquette, un
                verdict — et pas un texte générique : change une réponse, tout suit.
              </p>
              <p className="proto-contrat-fin">
                Lumière et ombre au même poids — c&apos;est la condition de la confiance.
              </p>
            </div>
          </section>
          )}
        </>
      )}
    </>
  );
}

/** Le 4ᵉ onglet du prototype — reprise à zéro des quêtes 1.1 et 1.2. */
export default function PrototypeResultatsV2() {
  const [queteId, setQueteId] = useState<QueteLikert>('1.1');
  return (
    <>
      <section className="proto-sec" aria-label="Reprise à zéro — le principe">
        <div className="proto-box r0-intro">
          <p>
            <strong>Reprise à zéro.</strong> Réponds aux affirmations comme si tu découvrais la
            quête — la page de résultats se construit sous tes yeux : tes nombres d&apos;abord, ta
            carte en deux faces <strong>à part égale</strong>, ta lumière et ton ombre ancrées dans
            tes réponses.
          </p>
          <p>
            L&apos;ombre n&apos;est plus une phrase en pied de carte : c&apos;est un bloc
            proportionné à tes nombres — détaillé si ton profil est tranché, court sinon,
            honnêtement équilibré si rien ne se détache.{' '}
            <BadgeNouveau />
          </p>
          <p className="r0-legende">
            Tout ce qui n&apos;est pas badgeé « nouveau » est <strong>verbatim du Livrable</strong>{' '}
            (items, échelle, cartes, barres, textes de palier) — les moteurs des tests ne sont pas
            touchés.
          </p>
        </div>
      </section>

      <div className="proto-onglets" role="tablist" aria-label="Choisis la quête de la reprise à zéro">
        {(['1.1', '1.2'] as QueteLikert[]).map((id) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={queteId === id}
            className={`btn proto-onglet${queteId === id ? ' proto-onglet--on' : ''}`}
            onClick={() => setQueteId(id)}
          >
            {id === '1.1' ? '1.1 · Ta personnalité' : '1.2 · Ta façon de t’attacher'}
          </button>
        ))}
      </div>

      <QueteFlow key={queteId} queteId={queteId} />
    </>
  );
}

/** =====================================================================
 *  LA VUE MEMBRE (Task 64 — demande fondateur : « la direction me convient,
 *  on passe à la vue membre épurée »).
 *  La page de résultat telle qu'un membre la vivra : pas de numéros de
 *  sections, pas de badges « nouveau texte », pas de notes de méthode, pas
 *  de contrat de lecture. Juste : je réponds → je vois ma carte → je
 *  comprends pourquoi (chiffres + preuves mot pour mot, direction validée).
 *  Même moteur, mêmes contenus du Livrable — strictement rien de changé
 *  côté items / scorer / sélecteur / textes.
 *  ===================================================================== */
export function PrototypeVueMembre() {
  const [queteId, setQueteId] = useState<QueteLikert>('1.1');
  return (
    <>
      <div
        className="vm-picker"
        role="tablist"
        aria-label="Choisis la quête (outil de démonstration, hors produit)"
      >
        <span className="vm-picker-label">Quête :</span>
        {(['1.1', '1.2'] as QueteLikert[]).map((id) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={queteId === id}
            className={`btn vm-picker-btn${queteId === id ? ' vm-picker-btn--on' : ''}`}
            onClick={() => setQueteId(id)}
          >
            {VM_TITRES[id]}
          </button>
        ))}
      </div>
      <QueteFlow key={queteId} queteId={queteId} variante="membre" />
    </>
  );
}
