/**
 * PROTOTYPE — « Des résultats qui se prouvent » (validation fondateur).
 *
 * Portée : STAGING UNIQUEMENT (#/prototype-resultats, hors navigation, sans
 * compte) — la prod n'est pas concernée tant que le fondateur n'a pas validé.
 *
 * Ce que ce prototype montre : le pattern anti-Barnum appliqué à la quête 2.6.
 * Le CONTENU (cartes, archétypes, accompagnements, barres) reste VERBATIM du
 * Livrable ; ce qui change est la PRÉSENTATION de la lecture des résultats :
 *   1. la PREUVE — les nombres de l'utilisateur accompagnent chaque lecture
 *      (« pourquoi cette carte », en mots, sans code ni seuil interne) ;
 *   2. le CONTRE-FACTUEL — la sensibilité est montrée : quel déplacement de
 *      points changerait la carte (calculé en direct par le moteur réel) ;
 *   3. le CONTRAT DE LECTURE — ce que la lecture est et n'est pas.
 *
 * Garde-fous : AUCUN item, scorer, sélecteur ou texte livrable modifié — le
 * prototype appelle les mêmes moteurs que le produit (QUETES['2.6'] : scorer →
 * choisirVariante → cartes ; construireApercuResultats : paliers → textes).
 * Les nombres affichés sont CEUX DE L'UTILISATEUR ; les règles sont dites en
 * mots (charte Livrable : aucun code/sigle/seuil ne franchit le rendu — les
 * constantes ci-dessous ne servent qu'à CHOISIR LES MOTS, jamais affichées).
 *
 * Prototype en FRANÇAIS uniquement (chaînes inline — tx() restitue la clé en
 * l'absence de miroir EN ; l'internationalisation suivra la validation).
 */
import { useMemo, useState } from 'react';
import { useI18n } from '../i18n/I18nProvider';
import { QUETES, construireApercuResultats } from '../lib/quetes';
import { ARCHES_2_6 } from '../lib/quete-2-6-arche';
import type { CleAxe26 } from '../lib/quete-2-6';

const Q26 = QUETES['2.6'];

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
const PRESETS: { label: string; vals: Val26 }[] = [
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

/** La carte + le moteur, depuis l'état courant — le même appel que le produit. */
function cartePour(vals: Val26) {
  const rep: Record<string, number> = {};
  for (const k of CLES) rep[CODES[k]] = vals[k];
  const score = Q26.scorer(rep);
  const id = Q26.choisirVariante(score);
  return Q26.cartes[id];
}

/** Le contre-factuel : pour chaque autre carte, le plus petit déplacement de
 *  points (somme préservée) qui la fait choisir — calculé PAR LE MOTEUR RÉEL,
 *  jamais deviné. Au plus 3 exemples, du plus petit déplacement au plus grand. */
function contreFactuels(vals: Val26, carteActuelle: string) {
  const trouves: { nom: string; de: CleAxe26; vers: CleAxe26; points: number }[] = [];
  const vus = new Set<string>();
  for (let a = 1; a <= 99 && vus.size < 3; a += 1) {
    for (const de of CLES) {
      for (const vers of CLES) {
        if (de === vers) continue;
        if (vals[de] - a < 0 || vals[vers] + a > 100) continue;
        const essai = { ...vals, [de]: vals[de] - a, [vers]: vals[vers] + a } as Val26;
        const c = cartePour(essai);
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

export default function PrototypeResultats() {
  const { tx } = useI18n();
  const [vals, setVals] = useState<Val26>(PRESETS[0].vals);

  const carte = useMemo(() => cartePour(vals), [vals]);
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

  const cf = useMemo(() => contreFactuels(vals, carte.id), [vals, carte.id]);

  /** Les mots de « pourquoi cette carte » — les nombres sont ceux de
   *  l'utilisateur, la règle est dite en mots (charte : seuils jamais rendus). */
  const pourquoi =
    carte.id === 'CARTE-2.6-MAISON'
      ? dominance && (top.cle === 'stabilite' || top.cle === 'projets')
        ? `Ta barre la plus haute est « ${NOMS[top.cle]} » avec ${top.pts} points sur 100, ${ecart} d\u2019avance sur la suivante — et c\u2019est un horizon de socle. La répartition l\u2019accueille dans la carte équilibrée : une posture de fond, jamais un non-choix.`
        : `Ta barre la plus haute (« ${NOMS[top.cle]} ») porte ${top.pts} points sur 100, avec ${ecart} d\u2019avance sur la suivante : aucune dominance ne s\u2019y détache nettement. La répartition lit un socle ou un partage large — la carte en rend compte.`
      : `Ta barre « ${NOMS[top.cle]} » porte ${top.pts} points sur 100 et garde ${ecart} d\u2019avance sur la suivante : un écart net. La répartition lit une priorité assumée — la carte en rend compte.`;

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
          Prototype sur la quête 2.6 — le contenu (carte, archétype, textes, barres) reste{' '}
          <strong>verbatim</strong>. Ce qui change : chaque lecture est ancrée dans tes réponses,
          la sensibilité est montrée, les limites sont dites.
        </p>
      </div>

      {/* 1 · L'arbitrage rejouable */}
      <section className="proto-sec" aria-label="Joue ton arbitrage">
        <h2 className="proto-h2">1 · Joue ton arbitrage</h2>
        <p className="proto-hint">
          La somme reste à 100 : monter un curseur prend aux autres, baisser rend. Regarde la
          carte et les preuves suivre en direct.
        </p>
        <div className="proto-presets" role="group" aria-label="Répartitions d'exemple">
          {PRESETS.map((p) => (
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

      {/* 2 · Résultat bref — avant / après */}
      <section className="proto-sec" aria-label="Résultat bref, avant et après">
        <h2 className="proto-h2">2 · Le résultat bref — avant / après</h2>
        <div className="proto-duo">
          <div className="proto-box proto-avant" role="group" aria-label="Ce que tu lis aujourd'hui">
            <p className="proto-box-label">Aujourd&apos;hui — la carte seule</p>
            <h3 className="proto-carte-nom">{carte.nom}</h3>
            <p className="proto-carte-lum">{carte.lumiere}</p>
            <div className="proto-carte-sec">
              <h4>{tx(Q26.completion.labelOmbre)}</h4>
              <p>{carte.ombre}</p>
            </div>
            <div className="proto-carte-sec">
              <h4>{tx(Q26.completion.labelTension)}</h4>
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
                <li>
                  Tu as posé <strong>{top.pts} points</strong> sur « {NOMS[top.cle]} » —{' '}
                  {top.pts} % de ton énergie de cinq ans.
                </li>
                <li>
                  L&apos;horizon le moins doté : « {NOMS[min.cle]} » ({min.pts} points) — un
                  arbitrage, jamais un oubli.
                </li>
                <li>
                  La somme fait toujours 100 : donner à un horizon, c&apos;est le retirer à un
                  autre.
                </li>
              </ul>
            </div>
            <div className="proto-preuve">
              <h4>La carte est sensible à tes choix</h4>
              {cf.length > 0 ? (
                <ul className="proto-faits">
                  {cf.map((x) => (
                    <li key={`${x.de}-${x.vers}-${x.points}`}>
                      Déplace <strong>{x.points} point{x.points > 1 ? 's' : ''}</strong> de «{' '}
                      {NOMS[x.de]} » vers « {NOMS[x.vers]} » : ta carte devient « {x.nom} ».
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Change n&apos;importe quel curseur : la carte suivra.</p>
              )}
              <p className="proto-preuve-note">
                Ces seuils de bascule sont calculés en direct par le moteur de la quête — la
                preuve vit, elle n&apos;est pas décorative.
              </p>
            </div>
            <p className="proto-carte-lum">{carte.lumiere}</p>
            <div className="proto-carte-sec">
              <h4>{tx(Q26.completion.labelOmbre)}</h4>
              <p>{carte.ombre}</p>
            </div>
            <div className="proto-carte-sec">
              <h4>{tx(Q26.completion.labelTension)}</h4>
              <p>{carte.tension}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3 · Résultat détaillé — avant / après */}
      <section className="proto-sec" aria-label="Résultat détaillé, avant et après">
        <h2 className="proto-h2">3 · Le résultat détaillé — avant / après</h2>
        <div className="proto-duo">
          <div className="proto-box proto-avant" role="group" aria-label="Le détail d'aujourd'hui">
            <p className="proto-box-label">Aujourd&apos;hui — le portrait d&apos;abord</p>
            <p className="proto-arche-intro">{arche.intro}</p>
            <p className="proto-devise">
              <strong>En résumé :</strong> « {arche.devise} »
            </p>
            <p className="proto-box-note">
              Le gabarit (« Ton archétype révèle… ») est identique pour tous — seul le type
              change. L&apos;œil le lit comme un horoscope, même juste.
            </p>
          </div>
          <div className="proto-box proto-apres" role="group" aria-label="Le détail du prototype">
            <p className="proto-box-label proto-box-label--apres">Prototype — la preuve d&apos;abord</p>
            <p className="proto-cadrage">
              Ce portrait est construit depuis tes 100 points — voici d&apos;abord ce qu&apos;ils
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
                  <div
                    className="proto-bar-track"
                    role="img"
                    aria-label={`${b.nom} : ${b.pct} sur 100`}
                  >
                    <span className="proto-bar-fill" style={{ width: `${Math.max(b.pct, 2)}%` }} />
                  </div>
                  <p className="proto-bar-texte">{b.texte}</p>
                </div>
              ))}
            </div>
            <p className="proto-cadrage">Et le portrait qui en découle :</p>
            <p className="proto-arche-intro">{arche.intro}</p>
            <p className="proto-devise">
              <strong>En résumé :</strong> « {arche.devise} »
            </p>
            <p className="proto-box-note">
              Les quatre volets du gabarit (ce que tu apportes / ce qui peut te freiner / en
              couple / ton équilibre) restent inchangés — ils arrivent <em>après</em> la preuve,
              lus comme une compression de tes barres, plus comme une révélation.
            </p>
            <div className="proto-preuve">
              <h4>Comment lire</h4>
              <p>{Q26.commentLire}</p>
            </div>
          </div>
        </div>
      </section>

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
            Change ton arbitrage, et la carte change — la preuve vit au-dessus, rejouable autant
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
            <strong>Arbitrage (2.6)</strong> — la preuve : tes points et l&apos;écart vivant (ce
            prototype).
          </li>
          <li>
            <strong>Échelle d&apos;accord (1.1, 1.4, 2.1…)</strong> — la preuve : les affirmations
            qui ont pesé (« tu as répondu oui à 3 des 4 ») et ta barre.
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
          Pour valider : joue les curseurs, regarde la carte changer, lis les preuves suivre. Si
          le pattern te convient, il se déploie quête par quête — présentation seule, aucun item,
          scorer ni sélecteur touché.
        </p>
      </div>
    </main>
  );
}
