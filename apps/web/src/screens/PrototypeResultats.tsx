/**
 * PROTOTYPE — « Des résultats qui se prouvent » (validation fondateur).
 *
 * Portée : STAGING UNIQUEMENT (#/prototype-resultats, hors navigation, sans
 * compte) — la prod n'est pas concernée tant que le fondateur n'a pas validé.
 *
 * Ce que ce prototype montre : le pattern anti-Barnum sur TROIS quêtes (à la
 * demande du fondateur) — 2.6 « Cent points » (arbitrage, Monde 3), 1.1 « Ta
 * personnalité » et 1.2 « Ta façon de t'attacher » (Likert, Monde 1). Le
 * CONTENU (cartes, archétypes, accompagnements, barres, items, échelle) reste
 * VERBATIM du Livrable ; ce qui change est la PRÉSENTATION de la lecture :
 *   1. la PREUVE — les nombres/réponses de l'utilisateur accompagnent chaque
 *      lecture (« pourquoi cette carte », en mots, sans code ni seuil interne) ;
 *   2. le CONTRE-FACTUEL — la sensibilité est montrée : quel changement de
 *      réponse ferait basculer la carte (calculé en direct par le moteur réel) ;
 *   3. le CONTRAT DE LECTURE — ce que la lecture est et n'est pas.
 *
 * Garde-fous : AUCUN item, scorer, sélecteur ou texte livrable modifié — le
 * prototype appelle les mêmes moteurs que le produit (QUETES[id] : scorer →
 * choisirVariante → cartes ; construireApercuResultats : paliers → textes).
 * Les nombres affichés sont CEUX DE L'UTILISATEUR ; les règles sont dites en
 * mots (charte Livrable : aucun code/sigle/seuil ne franchit le rendu).
 *
 * Prototype en FRANÇAIS uniquement (chaînes inline — tx() restitue la clé en
 * l'absence de miroir EN ; l'internationalisation suivra la validation).
 */
import { useMemo, useState, type ReactNode } from 'react';
import { useI18n } from '../i18n/I18nProvider';
import { QUETES, construireApercuResultats, type QueteDef } from '../lib/quetes';
import { ARCHES_2_6 } from '../lib/quete-2-6-arche';
import { ARCHES_1_1 } from '../lib/quete-1-1-arche';
import { ARCHES_1_2 } from '../lib/quete-1-2-arche';
import { ITEMS as ITEMS_11, LIKERT } from '../lib/quete-1-1';
import { ITEMS as ITEMS_12 } from '../lib/quete-1-2';
import type { CleAxe26 } from '../lib/quete-2-6';

const Q26 = QUETES['2.6'];
const Q11 = QUETES['1.1'];
const Q12 = QUETES['1.2'];

type QueteProto = '2.6' | '1.1' | '1.2';

const ONGLETS: { id: QueteProto; label: string }[] = [
  { id: '2.6', label: '2.6 · Cent points — Monde 3' },
  { id: '1.1', label: '1.1 · Ta personnalité — Monde 1' },
  { id: '1.2', label: '1.2 · Ta façon de t\u2019attacher — Monde 1' },
];

/** La carte choisie par le MOTEUR RÉEL de la quête pour des réponses données. */
function cartePour(quete: QueteDef, reponses: Record<string, number>) {
  return quete.cartes[quete.choisirVariante(quete.scorer(reponses))];
}

/* =====================================================================
   QUÊTE 2.6 — l'arbitrage (100 points sur 5 curseurs)
   ===================================================================== */

/** Codes verbatim des 5 axes (01-tableau-des-axes, ordre canonique 01 → 05). */
const CODES: Record<CleAxe26, string> = {
  carriere: 'Q2.6-01',
  famille: 'Q2.6-02',
  liberte: 'Q2.6-03',
  stabilite: 'Q2.6-04',
  projets: 'Q2.6-05',
};

/** Clés des 5 axes, ordre canonique (PASSATION). */
const CLES: readonly CleAxe26[] = ['carriere', 'famille', 'liberte', 'stabilite', 'projets'];

type Val26 = Record<CleAxe26, number>;

/** Noms d'axes depuis la définition produit (jamais recopiés). */
const NOMS = CLES.reduce(
  (acc, cle) => {
    const dim = Q26.dims.find((d) => d.key === cle);
    acc[cle] = dim ? dim.nom : cle;
    return acc;
  },
  {} as Record<CleAxe26, string>,
);

/** Répartitions d'exemple (somme = 100) — la première sert d'accueil. */
const PRESETS_26: { label: string; vals: Val26 }[] = [
  { label: 'Carrière assumée', vals: { carriere: 45, famille: 15, liberte: 12, stabilite: 20, projets: 8 } },
  { label: 'Famille d\u2019abord', vals: { carriere: 12, famille: 48, liberte: 10, stabilite: 22, projets: 8 } },
  { label: 'Sac léger', vals: { carriere: 12, famille: 14, liberte: 46, stabilite: 20, projets: 8 } },
  { label: 'Socle posé', vals: { carriere: 18, famille: 16, liberte: 10, stabilite: 40, projets: 16 } },
  { label: 'Tout en équilibre', vals: { carriere: 20, famille: 20, liberte: 20, stabilite: 20, projets: 20 } },
];

/**
 * Le geste de répartition (même expérience que la quête 2.6 en production) :
 * monter un curseur PREND aux autres (rond unitaire), baisser REND aux autres —
 * la somme reste 100 à tout geste. Présentation seule.
 */
function geste(cur: Val26, cle: CleAxe26, next: number): Val26 {
  const out: Val26 = { ...cur };
  const autres = CLES.filter((k) => k !== cle);
  const cible = Math.max(0, Math.min(100, Math.round(next)));
  if (cible > cur[cle]) {
    let besoin = cible - cur[cle];
    out[cle] = cible;
    let garde = 0;
    while (besoin > 0 && garde < 300) {
      let progres = false;
      for (const j of autres) {
        if (besoin > 0 && out[j] > 0) {
          out[j] -= 1;
          besoin -= 1;
          progres = true;
        }
      }
      if (!progres) break;
      garde += 1;
    }
    out[cle] -= besoin; // pool vide — clamp conservatif
    return out;
  }
  if (cible < cur[cle]) {
    let rendu = cur[cle] - cible;
    out[cle] = cible;
    let garde = 0;
    while (rendu > 0 && garde < 300) {
      let progres = false;
      for (const j of autres) {
        if (rendu > 0 && out[j] < 100) {
          out[j] += 1;
          rendu -= 1;
          progres = true;
        }
      }
      if (!progres) break;
      garde += 1;
    }
  }
  return out;
}

/** Miroir PRÉSENTATION de la règle documentée (dominance marquée 40/10 —
 *  verrou [9], provisoire, À VALIDER PAR LE COMITÉ) : sert uniquement à choisir
 *  les mots du bloc « pourquoi cette carte ». Le MOTEUR reste seul juge. */
const DOMINANCE_PTS = 40;
const DOMINANCE_ECART = 10;

/** Le contre-factuel 2.6 : pour chaque autre carte, le plus petit déplacement
 *  de points (somme préservée) qui la fait choisir — calculé PAR LE MOTEUR
 *  RÉEL, jamais deviné. Au plus 3 exemples, du plus petit déplacement au plus
 *  grand. */
function contreFactuels26(vals: Val26, carteActuelle: string) {
  const trouves: { nom: string; de: CleAxe26; vers: CleAxe26; points: number }[] = [];
  const vus = new Set<string>();
  const rep: Record<string, number> = {};
  for (let a = 1; a <= 99 && vus.size < 3; a += 1) {
    for (const de of CLES) {
      for (const vers of CLES) {
        if (de === vers) continue;
        if (vals[de] - a < 0 || vals[vers] + a > 100) continue;
        const essai = { ...vals, [de]: vals[de] - a, [vers]: vals[vers] + a } as Val26;
        for (const k of CLES) rep[CODES[k]] = essai[k];
        const c = cartePour(Q26, rep);
        if (c.id !== carteActuelle && !vus.has(c.id)) {
          vus.add(c.id);
          trouves.push({ nom: c.nom, de, vers, points: a });
        }
        if (vus.size >= 3) break;
      }
      if (vus.size >= 3) break;
    }
  }
  return trouves;
}

function Proto26() {
  const [vals, setVals] = useState<Val26>(PRESETS_26[0].vals);

  const carte = useMemo(() => {
    const rep: Record<string, number> = {};
    for (const k of CLES) rep[CODES[k]] = vals[k];
    return cartePour(Q26, rep);
  }, [vals]);
  const apercu = useMemo(() => {
    const rep: Record<string, number> = {};
    for (const k of CLES) rep[CODES[k]] = vals[k];
    return construireApercuResultats(Q26, rep);
  }, [vals]);
  const arche = useMemo(() => ARCHES_2_6[carte.id as keyof typeof ARCHES_2_6], [carte.id]);

  const triees = useMemo(
    () => CLES.map((k) => ({ cle: k, pts: vals[k] })).sort((a, b) => b.pts - a.pts),
    [vals],
  );
  const top = triees[0];
  const second = triees[1];
  const min = triees[triees.length - 1];
  const ecart = top.pts - second.pts;
  const dominance = top.pts >= DOMINANCE_PTS && ecart >= DOMINANCE_ECART;

  const cf = useMemo(() => contreFactuels26(vals, carte.id), [vals, carte.id]);

  /** Les mots de « pourquoi cette carte » — les nombres sont ceux de
   *  l'utilisateur, la règle est dite en mots (charte : seuils jamais rendus). */
  const pourquoi =
    carte.id === 'CARTE-2.6-MAISON'
      ? dominance && (top.cle === 'stabilite' || top.cle === 'projets')
        ? `Ta barre la plus haute est « ${NOMS[top.cle]} » avec ${top.pts} points sur 100, ${ecart} d\u2019avance sur la suivante — et c\u2019est un horizon de socle. La répartition l\u2019accueille dans la carte équilibrée : une posture de fond, jamais un non-choix.`
        : `Ta barre la plus haute (« ${NOMS[top.cle]} ») porte ${top.pts} points sur 100, avec ${ecart} d\u2019avance sur la suivante : aucune dominance ne s\u2019y détache nettement. La répartition lit un socle ou un partage large — la carte en rend compte.`
      : `Ta barre « ${NOMS[top.cle]} » porte ${top.pts} points sur 100 et garde ${ecart} d\u2019avance sur la suivante : un écart net. La répartition lit une priorité assumée — la carte en rend compte.`;

  return (
    <>
      {/* 1 · L'arbitrage rejouable */}
      <section className="proto-sec" aria-label="Joue ton arbitrage">
        <h2 className="proto-h2">1 · Joue ton arbitrage</h2>
        <p className="proto-hint">
          La somme reste à 100 : monter un curseur prend aux autres, baisser rend. Regarde la
          carte et les preuves suivre en direct.
        </p>
        <div className="proto-presets" role="group" aria-label="Répartitions d'exemple">
          {PRESETS_26.map((p) => (
            <button
              key={p.label}
              type="button"
              className="btn btn-outline proto-preset"
              onClick={() => setVals(p.vals)}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className="proto-sliders">
          {CLES.map((k) => (
            <label key={k} className="proto-slider">
              <span className="proto-slider-nom">{NOMS[k]}</span>
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={vals[k]}
                aria-label={NOMS[k]}
                aria-valuetext={`${vals[k]} sur 100`}
                onChange={(e) => setVals(geste(vals, k, Number(e.target.value)))}
              />
              <span className="proto-slider-val">{vals[k]}</span>
            </label>
          ))}
        </div>
      </section>

      <Bref
        quete={Q26}
        carte={carte}
        pourquoi={pourquoi}
        cf={cf.map((x) => ({
          cle: `${x.de}-${x.vers}-${x.points}`,
          phrase: `Déplace ${x.points} point${x.points > 1 ? 's' : ''} de « ${NOMS[x.de]} » vers « ${NOMS[x.vers]} » : ta carte devient « ${x.nom} ».`,
        }))}
        cfVide="Aucun déplacement de points ne fait basculer ta carte ici : tes marges sont solides — la carte ne suit pas n'importe quel changement."
        faits={[
          `Tu as posé ${top.pts} points sur « ${NOMS[top.cle]} » — ${top.pts} % de ton énergie de cinq ans.`,
          `L'horizon le moins doté : « ${NOMS[min.cle]} » (${min.pts} points) — un arbitrage, jamais un oubli.`,
          'La somme fait toujours 100 : donner à un horizon, c\u2019est le retirer à un autre.',
        ]}
        noteMoteur="Ces seuils de bascule sont calculés en direct par le moteur de la quête — la preuve vit, elle n'est pas décorative."
      />

      <Detaille quete={Q26} apercu={apercu} archeIntro={arche.intro} archeDevise={arche.devise} />
    </>
  );
}

/* =====================================================================
   QUÊTES LIKERT (1.1, 1.2) — les affirmations qui ont pesé
   ===================================================================== */

type ItemLikert = { code: string; text: string; orient: 'D' | 'I'; dim: string };

const ITEMS_PAR_QUETE: Record<'1.1' | '1.2', readonly ItemLikert[]> = {
  '1.1': ITEMS_11,
  '1.2': ITEMS_12,
};

const ARCHE_PAR_QUETE: Record<'1.1' | '1.2', Record<string, { intro: string; devise: string }>> = {
  '1.1': ARCHES_1_1,
  '1.2': ARCHES_1_2,
};

type Niveau = 1 | 2 | 3 | 4 | 5;
type Reps = Record<string, number>;

/** Presets Likert : par dimension, le niveau L (1-5) visé — chaque réponse est
 *  calculée pour contribuer EXACTEMENT à ce niveau (inversées recodées par le
 *  moteur) : la moyenne de la dimension vaut (L−1)/4, sans approximation. */
function reponsesDeNiveaux(items: readonly ItemLikert[], niv: Record<string, Niveau>): Reps {
  const out: Reps = {};
  for (const it of items) {
    const L = niv[it.dim] ?? 3;
    out[it.code] = it.orient === 'D' ? L : ((6 - L) as Niveau);
  }
  return out;
}

const PRESETS_LIKERT: Record<'1.1' | '1.2', { label: string; niv: Record<string, Niveau> }[]> = {
  '1.1': [
    { label: 'Explorateur chaleureux', niv: { O: 4, C: 3, E: 3, A: 4, S: 3 } },
    { label: 'Bâtisseur', niv: { O: 3, C: 4, E: 3, A: 3, S: 4 } },
    { label: 'Étoile sociale', niv: { O: 4, C: 3, E: 4, A: 3, S: 3 } },
    { label: 'Intense', niv: { O: 3, C: 3, E: 4, A: 3, S: 1 } },
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

const LABEL_NIVEAU: Record<number, string> = Object.fromEntries(
  LIKERT.map((l) => [l.value, l.label]),
);

/** Le contre-factuel Likert : les réponses dont le changement ferait basculer
 *  la carte — D'ABORD à une réponse près, puis à deux. Chaque essai passe par
 *  le MOTEUR RÉEL (scorer → choisirVariante) ; les plus petits écarts d'abord. */
function contreFactuelsLikert(
  quete: QueteDef,
  items: readonly ItemLikert[],
  reps: Reps,
  carteActuelle: string,
) {
  type Un = { cle: string; phrase: string; delta: number };
  const un: Un[] = [];
  for (const it of items) {
    for (let v = 1; v <= 5; v += 1) {
      if (v === reps[it.code]) continue;
      const c = cartePour(quete, { ...reps, [it.code]: v });
      if (c.id !== carteActuelle) {
        un.push({
          cle: `${it.code}-${v}`,
          delta: Math.abs(v - reps[it.code]),
          phrase: `Réponds « ${LABEL_NIVEAU[v]} » à « ${tronquer(it.text, 72)} » : ta carte devient « ${c.nom} ».`,
        });
      }
    }
  }
  if (un.length > 0) {
    un.sort((a, b) => a.delta - b.delta);
    return { un: un.slice(0, 3), deux: [] as Un[] };
  }
  const deux: Un[] = [];
  for (let i = 0; i < items.length; i += 1) {
    for (let j = i + 1; j < items.length; j += 1) {
      for (let va = 1; va <= 5; va += 1) {
        if (va === reps[items[i].code]) continue;
        for (let vb = 1; vb <= 5; vb += 1) {
          if (vb === reps[items[j].code]) continue;
          const c = cartePour(quete, {
            ...reps,
            [items[i].code]: va,
            [items[j].code]: vb,
          });
          if (c.id !== carteActuelle) {
            deux.push({
              cle: `${items[i].code}-${va}-${items[j].code}-${vb}`,
              delta: Math.abs(va - reps[items[i].code]) + Math.abs(vb - reps[items[j].code]),
              phrase: `Deux réponses d'un coup — « ${tronquer(items[i].text, 48)} » → « ${LABEL_NIVEAU[va]} » et « ${tronquer(items[j].text, 48)} » → « ${LABEL_NIVEAU[vb]} » : ta carte devient « ${c.nom} ».`,
            });
          }
        }
      }
    }
  }
  deux.sort((a, b) => a.delta - b.delta);
  return { un: [] as Un[], deux: deux.slice(0, 2) };
}

function tronquer(t: string, n: number): string {
  return t.length > n ? `${t.slice(0, n).trimEnd()}…` : t;
}

function ProtoLikert({ queteId }: { queteId: '1.1' | '1.2' }) {
  const quete = queteId === '1.1' ? Q11 : Q12;
  const items = ITEMS_PAR_QUETE[queteId];
  const [reps, setReps] = useState<Reps>(() =>
    reponsesDeNiveaux(items, PRESETS_LIKERT[queteId][0].niv),
  );

  const carte = useMemo(() => cartePour(quete, reps), [quete, reps]);
  const apercu = useMemo(() => construireApercuResultats(quete, reps), [quete, reps]);
  const arche = useMemo(() => ARCHE_PAR_QUETE[queteId][carte.id], [queteId, carte.id]);

  /** La dimension la plus haute (les barres viennent du moteur produit). */
  const barreTop = useMemo(
    () => [...apercu.bars].sort((a, b) => b.pct - a.pct)[0],
    [apercu.bars],
  );
  const itemsTopDim = useMemo(
    () => items.filter((it) => it.dim === barreTop?.key),
    [items, barreTop],
  );
  const compteTopDim = useMemo(() => {
    const c = new Map<number, number>();
    for (const it of itemsTopDim) {
      const v = reps[it.code];
      if (typeof v === 'number') c.set(v, (c.get(v) ?? 0) + 1);
    }
    return [...c.entries()].sort((a, b) => b[1] - a[1]);
  }, [itemsTopDim, reps]);

  const cf = useMemo(
    () => contreFactuelsLikert(quete, items, reps, carte.id),
    [quete, items, reps, carte.id],
  );

  const deuxHautes = [...apercu.bars].sort((a, b) => b.pct - a.pct).slice(0, Math.min(2, apercu.bars.length));
  const pourquoi = `Tes barres les plus hautes : ${deuxHautes
    .map((b) => `${b.nom.toLowerCase()} à ${b.pct}/100`)
    .join(' et ')} — c'est ce profil de barres qui choisit « ${carte.nom} ».`;

  const cfPhrases = [
    ...cf.un.map((x) => ({ cle: x.cle, phrase: x.phrase })),
    ...cf.deux.map((x) => ({ cle: x.cle, phrase: x.phrase })),
  ];

  return (
    <>
      {/* 1 · Réponds aux affirmations */}
      <section className="proto-sec" aria-label="Réponds aux affirmations">
        <h2 className="proto-h2">1 · Réponds aux affirmations</h2>
        <p className="proto-hint">
          Choisis un profil d&apos;exemple, puis touche les réponses que tu veux changer — la
          carte et les preuves suivent en direct ({items.length} affirmations, comme en
          production).
        </p>
        <div className="proto-presets" role="group" aria-label="Profils d'exemple">
          {PRESETS_LIKERT[queteId].map((p) => (
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
                    onClick={() => setReps({ ...reps, [it.code]: l.value })}
                  >
                    {l.value}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="proto-hint">
          Échelle verbatim : 1 « {LABEL_NIVEAU[1]} » · 2 « {LABEL_NIVEAU[2]} » · 3 «{' '}
          {LABEL_NIVEAU[3]} » · 4 « {LABEL_NIVEAU[4]} » · 5 « {LABEL_NIVEAU[5]} ».
        </p>
      </section>

      <Bref
        quete={quete}
        carte={carte}
        pourquoi={pourquoi}
        cf={cfPhrases}
        cfVide="Aucune bascule à une ou deux réponses près : tes marges sont solides. La carte ne suit pas n'importe quel changement — elle suit la forme de tes réponses. Pour voir une bascule, élargis le contraste : mets plusieurs affirmations d'une même barre à « Pas du tout moi » (ou à « Tout à fait moi »)."
        faits={[
          `Sur les ${itemsTopDim.length} affirmations qui mesurent « ${barreTop?.nom ?? ''} », ta réponse la plus fréquente : « ${
            compteTopDim[0] ? LABEL_NIVEAU[compteTopDim[0][0]] : ''
          } » (${compteTopDim[0]?.[1] ?? 0} fois sur ${itemsTopDim.length}).`,
          `Ta barre « ${barreTop?.nom ?? ''} » est à ${barreTop?.pct ?? 0}/100 (${barreTop?.palierLabel ?? ''}).`,
          'Chaque affirmation pèse pareil dans sa barre — aucune question piège, aucune réponse qui « note ».',
        ]}
        noteMoteur="Ces bascules sont calculées en direct par le moteur de la quête — la preuve vit, elle n'est pas décorative."
      >
        <div className="proto-preuve">
          <h4>Ce que tes réponses disent, mot pour mot — « {barreTop?.nom ?? ''} »</h4>
          <ul className="proto-faits proto-faits-ecouts">
            {itemsTopDim.map((it) => (
              <li key={it.code}>
                « {it.text} » — <strong>{LABEL_NIVEAU[reps[it.code]] ?? '—'}</strong>
              </li>
            ))}
          </ul>
        </div>
      </Bref>

      <Detaille quete={quete} apercu={apercu} archeIntro={arche.intro} archeDevise={arche.devise} />
    </>
  );
}

/* =====================================================================
   BLOCS PARTAGÉS — résultat bref (avant/après) et détaillé (avant/après)
   ===================================================================== */

type CarteVue = { id: string; nom: string; lumiere: string; ombre: string; tension: string };

function Bref({
  quete,
  carte,
  pourquoi,
  cf,
  cfVide,
  faits,
  noteMoteur,
  children,
}: {
  quete: QueteDef;
  carte: CarteVue;
  pourquoi: string;
  cf: { cle: string; phrase: string }[];
  /** Dit la vérité quand la recherche ne trouve AUCUNE bascule : marges solides. */
  cfVide: string;
  faits: string[];
  noteMoteur: string;
  children?: ReactNode;
}) {
  const { tx } = useI18n();
  return (
    <section className="proto-sec" aria-label="Résultat bref, avant et après">
      <h2 className="proto-h2">2 · Le résultat bref — avant / après</h2>
      <div className="proto-duo">
        <div className="proto-box proto-avant" role="group" aria-label="Ce que tu lis aujourd'hui">
          <p className="proto-box-label">Aujourd&apos;hui — la carte seule</p>
          <h3 className="proto-carte-nom">{carte.nom}</h3>
          <p className="proto-carte-lum">{carte.lumiere}</p>
          <div className="proto-carte-sec">
            <h4>{tx(quete.completion.labelOmbre)}</h4>
            <p>{carte.ombre}</p>
          </div>
          <div className="proto-carte-sec">
            <h4>{tx(quete.completion.labelTension)}</h4>
            <p>{carte.tension}</p>
          </div>
          <p className="proto-box-note">
            Lecture universelle : rien ne relie le texte à tes réponses. C&apos;est ici que
            l&apos;effet Barnum peut s&apos;installer.
          </p>
        </div>
        <div className="proto-box proto-apres" role="group" aria-label="Ce que le prototype propose">
          <p className="proto-box-label proto-box-label--apres">Prototype — la même carte, ancrée</p>
          <h3 className="proto-carte-nom">{carte.nom}</h3>
          <div className="proto-preuve">
            <h4>Pourquoi cette carte</h4>
            <p>{pourquoi}</p>
          </div>
          <div className="proto-preuve">
            <h4>Ce que tes réponses disent, mot pour mot</h4>
            <ul className="proto-faits">
              {faits.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
          {children}
          <div className="proto-preuve">
            <h4>La carte est sensible à tes choix</h4>
            {cf.length > 0 ? (
              <ul className="proto-faits">
                {cf.map((x) => (
                  <li key={x.cle}>{x.phrase}</li>
                ))}
              </ul>
            ) : (
              <p>{cfVide}</p>
            )}
            <p className="proto-preuve-note">{noteMoteur}</p>
          </div>
          <p className="proto-carte-lum">{carte.lumiere}</p>
          <div className="proto-carte-sec">
            <h4>{tx(quete.completion.labelOmbre)}</h4>
            <p>{carte.ombre}</p>
          </div>
          <div className="proto-carte-sec">
            <h4>{tx(quete.completion.labelTension)}</h4>
            <p>{carte.tension}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Detaille({
  quete,
  apercu,
  archeIntro,
  archeDevise,
}: {
  quete: QueteDef;
  apercu: ReturnType<typeof construireApercuResultats>;
  archeIntro: string;
  archeDevise: string;
}) {
  return (
    <section className="proto-sec" aria-label="Résultat détaillé, avant et après">
      <h2 className="proto-h2">3 · Le résultat détaillé — avant / après</h2>
      <div className="proto-duo">
        <div className="proto-box proto-avant" role="group" aria-label="Le détail d'aujourd'hui">
          <p className="proto-box-label">Aujourd&apos;hui — le portrait d&apos;abord</p>
          <p className="proto-arche-intro">{archeIntro}</p>
          <p className="proto-devise">
            <strong>En résumé :</strong> « {archeDevise} »
          </p>
          <p className="proto-box-note">
            Le gabarit (« Ton archétype révèle… ») est identique pour tous — seul le type
            change. L&apos;œil le lit comme un horoscope, même juste.
          </p>
        </div>
        <div className="proto-box proto-apres" role="group" aria-label="Le détail du prototype">
          <p className="proto-box-label proto-box-label--apres">Prototype — la preuve d&apos;abord</p>
          <p className="proto-cadrage">
            Ce portrait est construit depuis tes réponses — voici d&apos;abord ce qu&apos;elles
            disent, barre par barre :
          </p>
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
                <p className="proto-bar-texte">{b.texte}</p>
              </div>
            ))}
          </div>
          <p className="proto-cadrage">Et le portrait qui en découle :</p>
          <p className="proto-arche-intro">{archeIntro}</p>
          <p className="proto-devise">
            <strong>En résumé :</strong> « {archeDevise} »
          </p>
          <p className="proto-box-note">
            Les quatre volets du gabarit (ce que tu apportes / ce qui peut te freiner / en
            couple / ton équilibre) restent inchangés — ils arrivent <em>après</em> la preuve,
            lus comme une compression de tes barres, plus comme une révélation.
          </p>
          <div className="proto-preuve">
            <h4>Comment lire</h4>
            <p>{quete.commentLire}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =====================================================================
   ÉCRAN — sélecteur de quête + sections globales
   ===================================================================== */

export default function PrototypeResultats() {
  const [queteActive, setQueteActive] = useState<QueteProto>('2.6');

  return (
    <main className="screen proto-wrap" aria-labelledby="proto-title">
      <div className="proto-head">
        <p className="proto-badge" role="note">
          PROTOTYPE — validation fondateur · staging uniquement
        </p>
        <h1 className="screen-title" id="proto-title">
          Des résultats qui se prouvent
        </h1>
        <p className="screen-sub">
          Prototype sur trois quêtes — le contenu (items, échelles, cartes, archétypes, textes,
          barres) reste <strong>verbatim</strong>. Ce qui change : chaque lecture est ancrée dans
          tes réponses, la sensibilité est montrée, les limites sont dites.
        </p>
      </div>

      <div className="proto-onglets" role="tablist" aria-label="Choisis la quête du prototype">
        {ONGLETS.map((o) => (
          <button
            key={o.id}
            type="button"
            role="tab"
            aria-selected={queteActive === o.id}
            className={`btn proto-onglet${queteActive === o.id ? ' proto-onglet--on' : ''}`}
            onClick={() => setQueteActive(o.id)}
          >
            {o.label}
          </button>
        ))}
      </div>

      {queteActive === '2.6' && <Proto26 />}
      {queteActive === '1.1' && <ProtoLikert queteId="1.1" />}
      {queteActive === '1.2' && <ProtoLikert queteId="1.2" />}

      {/* 4 · Le contrat de lecture */}
      <section className="proto-sec" aria-label="Le contrat de lecture">
        <h2 className="proto-h2">4 · Le contrat de lecture</h2>
        <div className="proto-box proto-contrat">
          <p>
            <strong>Ce que cette lecture n&apos;est pas :</strong> un diagnostic, une étiquette,
            une prédiction.
          </p>
          <p>
            <strong>Ce qu&apos;elle est :</strong> le miroir de ce que tu as déclaré aujourd&apos;hui.
            Change tes réponses, et la carte change — la preuve vit au-dessus, rejouable autant
            de fois que tu veux.
          </p>
          <p className="proto-contrat-fin">
            La vérité affichée est celle de tes réponses — jamais celle d&apos;un modèle qui
            prétendrait te deviner.
          </p>
        </div>
      </section>

      {/* 5 · Le pattern pour les 32 quêtes */}
      <section className="proto-sec" aria-label="Le pattern pour toutes les quêtes">
        <h2 className="proto-h2">5 · Le même pattern pour les 32 quêtes</h2>
        <p className="proto-hint">
          Trois blocs ajoutés autour des textes verbatim — preuve, contre-factuel, contrat —
          adaptés au format de chaque quête :
        </p>
        <ul className="proto-pattern">
          <li>
            <strong>Arbitrage (2.6)</strong> — la preuve : tes points et l&apos;écart vivant
            (rejoué ci-dessus).
          </li>
          <li>
            <strong>Échelle d&apos;accord (1.1, 1.2, 1.4, 2.1…)</strong> — la preuve : les
            affirmations qui ont pesé et ta barre (rejoué ci-dessus pour 1.1 et 1.2).
          </li>
          <li>
            <strong>Comptage (2.3, 2.4)</strong> — la preuve : ton nombre, dit en mots (« 7
            coches sur 9 »).
          </li>
          <li>
            <strong>Situations (5.x)</strong> — la preuve : tes choix de posture (« 4 fois sur
            6, tu as choisi… »).
          </li>
          <li>
            <strong>Production libre (1.9, 4.3)</strong> — pas de carte : ta production est le
            résultat, rien à prouver.
          </li>
        </ul>
        <p className="proto-hint">
          Aucun seuil interne n&apos;est affiché nulle part : la preuve, ce sont tes nombres et
          les mots — les codes et règles restent au moteur, comme le veut la charte du Livrable.
        </p>
      </section>

      <div className="proto-foot">
        <button type="button" className="btn btn-accent" onClick={() => (window.location.hash = '')}>
          Quitter le prototype
        </button>
        <p className="proto-foot-note">
          Pour valider : change de quête, joue les réponses ou les curseurs, regarde la carte
          changer, lis les preuves suivre. Si le pattern te convient, il se déploie quête par
          quête — présentation seule, aucun item, scorer ni sélecteur touché.
        </p>
      </div>
    </main>
  );
}
