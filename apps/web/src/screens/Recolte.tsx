/**
 * « Ma récolte » (#/recolte) — le coffre du voyageur.
 *
 * REFONTE VISUELLE (mockup fondateur « Ma récolte — proposition » — Main.dc.html) :
 * la page passe en 5 ONGLETS (Aperçu / Cartes / Sceaux / Gains acquis / Histoire)
 * sur fond crème #F6F3EC, titres Fraunces, corps Figtree, héros teal #0F5C66 avec
 * ANNEAU DE PROGRESSION (conic-gradient), carte « En cours », dernières cartes en
 * carrousel, mosaïque 6 colonnes, grille des 11 mondes, duo pass/crédits, bandeau
 * vie privée.
 * Rien n'est supprimé (consigne fondateur historique) — l'existant est RELOGÉ :
 *  - Aperçu  : carte « En cours » (le jalon actif de l'échelle), Dernières cartes
 *    (carrousel), « Ton portrait prend forme » (mosaïque), « Les 11 mondes »
 *    (grille), duo Pass/Crédits compact, « Tes espaces », vie privée ;
 *  - Cartes  : la collection des 11 mondes (découvertes réelles + promesses) ;
 *  - Sceaux  : les sceaux dérivés de la progression réelle ;
 *  - Gains acquis (demande fondateur — « il n'y a pas d'onglet pour les gains
 *    acquis ») : l'inventaire consolidé de ce que le voyage a DÉJÀ donné —
 *    compteurs réels (cartes, écrans, fragments, sceaux, pass, crédits) et
 *    registre chronologique de chaque gain, clic → son explication ;
 *  - Histoire: l'échelle complète des 6 jalons, la timeline et le mois par mois.
 * La cloche de la maquette = la cloche GLOBALE de l'en-tête de l'app (App.tsx,
 * journal groupé par mois) — non dupliquée. La barre basse (Voyage/Mondes/Quête/
 * Parcours/Récolte) = la TabBar globale existante.
 *
 * RÈGLE ABSOLUE (inchangée, prompt §19) : aucune logique métier, donnée,
 * résultat psychométrique ou calcul modifié — la page lit l'état réel
 * (wairyu.quete.{id} via useEtatQuete + useProgressionDetail) et le présente.
 * Les écrans sans carte (1.7, 1.11, 2.8) restent hors collection (même filtre
 * que le journal).
 * Détail typographique VERBATIM : la chaîne « Aucun monde traversé pour
 * l’instant — le premier ouvre bientôt. » garde son apostrophe typographique
 * U+2019 dans « l’instant » — ne pas « corriger ». Ailleurs : U+0027.
 */

import { useEffect, useRef, useState } from 'react';
import { MILESTONES, TOTAL_STEPS, WORLDS, WORLD_DETAILS } from '../lib/voyage';
import type { VoyageWorld } from '../lib/voyage';
import { QUETES, QUETE_IDS, mondeDeQuete } from '../lib/quetes';
import type { IdQuete } from '../lib/quetes';
import { useEtatQuete } from '../lib/quete-state';
import type { EtatQuete } from '../lib/quete-state';
import { useProgressionDetail } from '../lib/progression';
import InfoRecolteModal from '../components/InfoRecolte';
import type { ItemRecolte } from '../components/InfoRecolte';
import VoyageIcon from '../components/VoyageIcons';
import type { VoyageIconName } from '../components/VoyageIcons';
import { useI18n } from '../i18n/I18nProvider';

/** Une carte-découverte RÉELLE obtenue (quête terminée avec carte posée). */
interface Decouverte {
  id: IdQuete;
  /** Le titre de la quête (« Ta personnalité »). */
  titre: string;
  /** Le nom VERBATIM de la carte (« L'Étoile sociale »). */
  nom: string;
  /** La date réelle d'obtention (termineeA, ISO). */
  date: string | null;
}

/** Un écran de passage RÉEL (1.7 / 1.11 / 2.8 — sans carte, jamais compté). */
interface EcranPassage {
  id: IdQuete;
  titre: string;
  date: string | null;
}

/** La récolte RÉELLE d'un monde — ce que le voyage y a produit. */
interface MondeRecolte {
  monde: VoyageWorld;
  /** Le monde est LIVRÉ (jouable — M1/M2/M3 aujourd'hui). */
  livree: boolean;
  faites: number;
  total: number;
  termine: boolean;
  cartes: Decouverte[];
  ecrans: EcranPassage[];
}

/** Les onglets de la refonte — les 4 de la maquette + « Gains acquis » (fondateur). */
type Onglet = 'apercu' | 'cartes' | 'sceaux' | 'gains' | 'histoire';

/** Une ligne du REGISTRE des gains acquis — un seul élément réellement obtenu. */
interface GainAcquis {
  key: string;
  type: 'carte' | 'ecran' | 'fragment' | 'sceau';
  /** Le nom verbatim (carte : « L'Étoile sociale ») ou le libellé du type. */
  nom: string;
  /** La provenance (« Monde 2 · Ta boussole intérieure »). */
  sous: string;
  /** La date réelle d'obtention (ISO — null = non daté, fin de liste). */
  date: string | null;
  /** Le payload COMPLET du pop-up explicatif (même contrat que partout). */
  item: ItemRecolte;
}

/** Couleur + icône de chaque type de gain — alignées sur le registre
 *  d'InfoRecolte (même langage visuel dans tout le coffre). */
const GAIN_STYLE: Record<GainAcquis['type'], { ico: VoyageIconName; bg: string; fg: string }> = {
  carte: { ico: 'gem', bg: '#fff3d6', fg: '#e8a312' },
  ecran: { ico: 'signpost', bg: '#e4f4e4', fg: '#3e9d5b' },
  fragment: { ico: 'layers', bg: '#dff3f4', fg: '#2a9aa0' },
  sceau: { ico: 'star', bg: '#f3e8f8', fg: '#9c4dd3' },
};

/** Le coche des chips « Découverte » (même dessin que les chips Terminé). */
function Coche() {
  return (
    <svg
      viewBox="0 0 24 24"
      width={10}
      height={10}
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 12.5l5 5L20 6.5" />
    </svg>
  );
}

/** La flèche des liens « Voir en détail » et des cartes « En cours ». */
function Fleche() {
  return (
    <svg
      viewBox="0 0 24 24"
      width={13}
      height={13}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function dateCourte(iso: string, lang: 'fr' | 'en'): string {
  try {
    return new Date(iso).toLocaleDateString(lang === 'en' ? 'en-IE' : 'fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return '';
  }
}

/** Le nombre de cartes obtenues, mémorisé localement — la révélation ne
 *  joue qu'une fois par NOUVELLE pièce (pas de confettis permanents). */
const CLE_VU = 'wairyu.recolte.vu';

function lireVu(): number {
  try {
    const v = Number(window.localStorage.getItem(CLE_VU) ?? '0');
    return Number.isFinite(v) && v > 0 ? Math.floor(v) : 0;
  } catch {
    return 0;
  }
}

function ecrireVu(n: number): void {
  try {
    window.localStorage.setItem(CLE_VU, String(n));
  } catch {
    /* stockage indisponible — la révélation vivra pour la session */
  }
}

export default function Recolte() {
  const { tx, lang } = useI18n();
  // Ordre FIXE et inconditionnel (règles des hooks) — les 25 quêtes ouvertes.
  const etat11 = useEtatQuete('1.1');
  const etat12 = useEtatQuete('1.2');
  const etat13 = useEtatQuete('1.3');
  const etat14 = useEtatQuete('1.4');
  const etat15 = useEtatQuete('1.5');
  const etat16 = useEtatQuete('1.6');
  const etat17 = useEtatQuete('1.7');
  const etat19 = useEtatQuete('1.9');
  const etat110 = useEtatQuete('1.10');
  const etat111 = useEtatQuete('1.11');
  const etat21 = useEtatQuete('2.1');
  const etat22 = useEtatQuete('2.2');
  const etat23 = useEtatQuete('2.3');
  const etat24 = useEtatQuete('2.4');
  const etat25 = useEtatQuete('2.5');
  const etat26 = useEtatQuete('2.6');
  const etat27 = useEtatQuete('2.7');
  const etat28 = useEtatQuete('2.8');
  const etat31 = useEtatQuete('3.1');
  const etat32 = useEtatQuete('3.2');
  const etat33 = useEtatQuete('3.3');
  const etat34 = useEtatQuete('3.4');
  const etat35 = useEtatQuete('3.5');
  const etat36 = useEtatQuete('3.6');
  const etat37 = useEtatQuete('3.7');
  const etat41 = useEtatQuete('4.1');
  const etat42 = useEtatQuete('4.2');
  const etat43 = useEtatQuete('4.3');
  const etat51 = useEtatQuete('5.1');
  const etat52 = useEtatQuete('5.2');
  const etat53 = useEtatQuete('5.3');
  const etat57 = useEtatQuete('5.7');
  const etatsParId: Record<IdQuete, EtatQuete> = {
    '1.1': etat11,
    '1.2': etat12,
    '1.3': etat13,
    '1.4': etat14,
    '1.5': etat15,
    '1.6': etat16,
    '1.7': etat17,
    '1.9': etat19,
    '1.10': etat110,
    '1.11': etat111,
    '2.1': etat21,
    '2.2': etat22,
    '2.3': etat23,
    '2.4': etat24,
    '2.5': etat25,
    '2.6': etat26,
    '2.7': etat27,
    '2.8': etat28,
    '3.1': etat31,
    '3.2': etat32,
    '3.3': etat33,
    '3.4': etat34,
    '3.5': etat35,
    '3.6': etat36,
    '3.7': etat37,
    '4.1': etat41,
    '4.2': etat42,
    '4.3': etat43,
    '5.1': etat51,
    '5.2': etat52,
    '5.3': etat53,
    '5.7': etat57,
  };
  // La progression RÉELLE — les compteurs et les jalons suivent l'état des
  // quêtes, réactifs (même bus que l'atlas et le journal).
  const { worldsDone, stepsDone, recolte, parMonde } = useProgressionDetail();

  // LE POP-UP EXPLICATIF (Task 45) : chaque récolte est cliquable et ouvre
  // son explication — « à quoi ça sert dans les rencontres ».
  const [info, setInfo] = useState<ItemRecolte | null>(null);
  const ouvrirInfo = (item: ItemRecolte): void => setInfo(item);

  // L'ONGLET ACTIF de la maquette (pur état d'interface — aucune donnée).
  const [onglet, setOnglet] = useState<Onglet>('apercu');

  // La récolte RÉELLE par monde — cartes et écrans de passage dérivés de
  // l'état des quêtes (même filtre que le journal : sansCarte et carteId
  // inconnu ne produisent PAS de carte).
  const recolteMondes: MondeRecolte[] = WORLDS.map((w) => {
    const p = parMonde[w.code] ?? null;
    const livree = !!p;
    const ids = QUETE_IDS.filter((id) => mondeDeQuete(id).code === w.code);
    const cartes: Decouverte[] = [];
    const ecrans: EcranPassage[] = [];
    for (const id of ids) {
      const e = etatsParId[id];
      if (!e.terminee) continue;
      const quete = QUETES[id];
      const carte = e.carteId ? quete.cartes[e.carteId] : undefined;
      if (quete.sansCarte || !carte) {
        ecrans.push({ id, titre: quete.titre, date: e.termineeA });
      } else {
        cartes.push({ id, titre: quete.titre, nom: carte.nom, date: e.termineeA });
      }
    }
    return {
      monde: w,
      livree,
      faites: p?.faites ?? 0,
      total: p?.total ?? w.quests,
      termine: !!p && p.faites >= p.total,
      cartes,
      ecrans,
    };
  });

  // Le chemin des 11 mondes — l'arrêt ACTUEL = premier monde livré non
  // traversé (la même frontière que l'atlas et le journal).
  const arret = recolteMondes.find((m) => m.livree && !m.termine) ?? null;

  // La phrase DYNAMIQUE — elle suit les mondes traversés (elle devient le
  // titre du héros, rôle du « Tu avances bien » de la maquette).
  const phrase =
    worldsDone <= 0
      ? tx('Ton voyage commence ici.')
      : worldsDone <= 3
        ? tx('Les premières pièces de ton portrait apparaissent.')
        : worldsDone <= 7
          ? tx('Ton portrait devient de plus en plus précis.')
          : worldsDone <= 10
            ? tx('Ton histoire prend forme.')
            : tx('Ton voyage est complet. Ton portrait peut maintenant raconter ton parcours.');

  // La RÉVÉLATION — une seule fois par nouvelle pièce (mémorisée) : quand la
  // récolte compte PLUS de cartes que la dernière visite, une lumière douce
  // annonce la pièce apparue. Pas de confettis.
  const [reveal, setReveal] = useState(false);
  const vuRef = useRef<number>(-1);
  useEffect(() => {
    if (vuRef.current < 0) vuRef.current = lireVu();
    if (recolte > vuRef.current) {
      vuRef.current = recolte;
      ecrireVu(recolte);
      setReveal(true);
    }
  }, [recolte]);
  // La pièce la plus récente — celle que la révélation met en lumière.
  let derniere: Decouverte | null = null;
  for (const m of recolteMondes) {
    for (const c of m.cartes) {
      if (c.date && (!derniere || !derniere.date || c.date > derniere.date)) derniere = c;
    }
  }

  // Le prochain monde de la timeline — la frontière, sinon le premier monde
  // non livré (tout fait : « bientôt » désigne la suite du voyage).
  const prochain =
    arret?.monde ??
    recolteMondes.find((m) => !m.livree)?.monde ??
    null;
  // Les mondes qui ont déjà une HISTOIRE réelle (quêtes posées ou terminées).
  const histoires = recolteMondes.filter((m) => m.termine || m.faites > 0);
  // Le teaser « ta prochaine découverte t'attend ici » ne s'affiche que si le
  // prochain monde n'a PAS encore d'entrée réelle (sinon doublon dans la liste).
  const teaser =
    prochain && !histoires.some((m) => m.monde.code === prochain.code) ? prochain : null;

  // Le statut RÉEL d'un jalon (même calcul pour la carte « En cours » et pour
  // l'échelle complète de l'onglet Histoire — une seule source de vérité).
  // Retourne 'atteint' | 'now' | le statut statique du jalon ('now' | 'soon').
  const statutJalon = (num: number, status: string): 'atteint' | 'now' | 'soon' =>
    num === 1
      ? recolte > 0
        ? 'atteint'
        : 'now'
      : num === 2
        ? worldsDone >= 1
          ? 'atteint'
          : (parMonde['M1']?.faites ?? 0) > 0
            ? 'now'
            : (status as 'now' | 'soon')
        : num === 3
          ? worldsDone >= 1
            ? 'now'
            : (status as 'now' | 'soon')
          : (status as 'now' | 'soon');

  // La carte « EN COURS » de l'Aperçu — le premier jalon non atteint.
  const jalonActif =
    MILESTONES.find((j) => statutJalon(j.num, j.status) === 'now') ??
    MILESTONES.find((j) => statutJalon(j.num, j.status) !== 'atteint') ??
    MILESTONES[MILESTONES.length - 1];

  // Les DERNIÈRES CARTES réelles (carrousel de l'Aperçu) — tri par date
  // décroissante, toutes provenances confondues.
  const dernieres: { c: Decouverte; m: MondeRecolte }[] = [];
  for (const m of recolteMondes) {
    for (const c of m.cartes) dernieres.push({ c, m });
  }
  dernieres.sort((a, b) => (b.c.date ?? '').localeCompare(a.c.date ?? ''));
  const recentes = dernieres.slice(0, 6);

  // LE REGISTRE DES GAINS ACQUIS (onglet « Gains acquis » — demande fondateur) :
  // chaque élément RÉELLEMENT obtenu, tous types confondus — cartes, écrans de
  // passage, fragment et sceau de chaque monde traversé. MÊME SOURCE que les
  // autres onglets (recolteMondes + parMonde) — aucune donnée nouvelle, aucun
  // calcul métier : la même réalité, présentée en un seul registre chronologique.
  const gains: GainAcquis[] = [];
  for (const m of recolteMondes) {
    const cloture = m.termine ? (parMonde[m.monde.code]?.derniereA ?? null) : null;
    for (const c of m.cartes) {
      gains.push({
        key: `carte-${c.id}`,
        type: 'carte',
        nom: c.nom,
        sous: tx('Monde {{n}} · {{titre}}', { n: m.monde.num, titre: c.titre }),
        date: c.date,
        item: {
          type: 'carte',
          nom: c.nom,
          titre: c.titre,
          date: c.date,
          mondeNum: m.monde.num,
          mondeCode: m.monde.code,
          queteId: c.id,
        },
      });
    }
    for (const e of m.ecrans) {
      gains.push({
        key: `ecran-${e.id}`,
        type: 'ecran',
        nom: tx('Écran de passage'),
        sous: tx('Monde {{n}} · {{titre}}', { n: m.monde.num, titre: e.titre }),
        date: e.date,
        item: {
          type: 'ecran',
          titre: e.titre,
          date: e.date,
          mondeNum: m.monde.num,
          mondeCode: m.monde.code,
        },
      });
    }
    if (m.termine) {
      gains.push({
        key: `fragment-${m.monde.code}`,
        type: 'fragment',
        nom: tx('Fragment du portrait'),
        sous: tx('Monde {{n}} · {{nom}}', { n: m.monde.num, nom: m.monde.name }),
        date: cloture,
        item: { type: 'fragment', mondeNum: m.monde.num, mondeCode: m.monde.code, date: cloture },
      });
      gains.push({
        key: `sceau-${m.monde.code}`,
        type: 'sceau',
        nom: tx('Sceau du monde'),
        sous: tx('Monde {{n}} · {{nom}}', { n: m.monde.num, nom: m.monde.name }),
        date: cloture,
        item: { type: 'sceau', mondeNum: m.monde.num, mondeCode: m.monde.code, date: cloture },
      });
    }
  }
  // Du plus récent au tout premier — les non datés ferment la liste.
  gains.sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''));

  // L'INVENTAIRE — les compteurs réels du coffre (mêmes chiffres que les
  // autres onglets) + pass/crédits à 0 honnête (rien n'est inventé, §16) :
  // chaque tuile ouvre l'explication « à quoi ça sert » de son type.
  const nbEcrans = recolteMondes.reduce((n, m) => n + m.ecrans.length, 0);
  const inventaire: {
    type: 'carte' | 'ecran' | 'fragment' | 'sceau' | 'pass' | 'credit';
    label: string;
    n: number;
  }[] = [
    { type: 'carte', label: tx('Cartes'), n: recolte },
    { type: 'ecran', label: tx('Écrans de passage'), n: nbEcrans },
    { type: 'fragment', label: tx('Fragments'), n: worldsDone },
    { type: 'sceau', label: tx('Sceaux'), n: worldsDone },
    { type: 'pass', label: tx('Pass'), n: 0 },
    { type: 'credit', label: tx('Crédits'), n: 0 },
  ];

  // Le contenu RÉEL de la fiche d'un mois (partagé par la grille des mondes
  // de l'Aperçu et par la vue « mois par mois » de l'Histoire).
  const infoMois = (m: MondeRecolte): ItemRecolte => ({
    type: 'mois',
    mondeNum: m.monde.num,
    mondeCode: m.monde.code,
    traverse: m.termine,
    date: m.termine ? (parMonde[m.monde.code]?.derniereA ?? null) : null,
    contenu: m.termine
      ? [
          ...m.cartes.map((c) => tx('🃏 {{nom}} — {{titre}}', { nom: c.nom, titre: c.titre })),
          ...m.ecrans.map(() => tx('🪧 Écran de passage')),
          tx('🧩 Fragment du portrait'),
          tx('🏅 Sceau du monde'),
        ]
      : (WORLD_DETAILS[m.monde.code]?.resultats.map((x) => x) ?? undefined),
  });

  return (
    <main className="screen rec2">
      {/* EN-TÊTE — la maquette : titre Fraunces + sous-titre doux. La cloche de
          la maquette est la cloche GLOBALE de l'en-tête de l'app (non dupliquée). */}
      <header className="rec2-head">
        <h1 className="rec2-title">{tx('Ma récolte')}</h1>
        <p className="rec2-sub">{tx('Ton voyage, étape après étape')}</p>
      </header>

      {/* RÉVÉLATION — une nouvelle pièce du portrait (lumière douce, une fois). */}
      {reveal && derniere && (
        <div className="r-reveal" role="status" aria-live="polite">
          <span className="r-reveal-ico" aria-hidden="true">
            <VoyageIcon name="gem" size={20} />
          </span>
          <div className="r-reveal-body">
            <p className="r-reveal-titre">{tx('Une nouvelle pièce de ton portrait vient d\'apparaître.')}</p>
            <p className="r-reveal-carte">
              {tx('🃏')} <strong>{derniere.nom}</strong>
              <span className="r-reveal-meta"> · {derniere.titre}</span>
            </p>
            <p className="r-reveal-suite">{tx('Cette découverte rejoint ta Récolte.')}</p>
          </div>
          <button
            type="button"
            className="r-reveal-fermer"
            onClick={() => setReveal(false)}
            aria-label={tx('Fermer la révélation')}
          >
            <svg
              viewBox="0 0 24 24"
              width={14}
              height={14}
              fill="none"
              stroke="currentColor"
              strokeWidth={2.4}
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
      )}

      {/* HÉROS TEAL — l'anneau de progression (conic-gradient) porte les
          étapes réelles, la phrase dynamique devient le titre, les chiffres
          réels restent, le CTA mène au voyage. */}
      <section className="rec2-hero" aria-label={tx('Mon voyage')}>
        <div className="rec2-hero-row">
          <div
            className="rec2-ring"
            role="img"
            aria-label={tx('Progression du voyage — {{a}} étapes sur {{b}}', {
              a: stepsDone,
              b: TOTAL_STEPS,
            })}
            style={{
              background: `conic-gradient(var(--r2-amber) 0 ${(stepsDone / TOTAL_STEPS) * 360}deg, rgba(255,255,255,.18) ${(stepsDone / TOTAL_STEPS) * 360}deg 360deg)`,
            }}
          >
            <div className="rec2-ring-in">
              <strong>{stepsDone}</strong>
              <span>/ {TOTAL_STEPS}</span>
            </div>
          </div>
          <div className="rec2-hero-body">
            <h2 className="rec2-hero-t">{phrase}</h2>
            <p className="rec2-hero-stats">
              <strong>{worldsDone}/{WORLDS.length}</strong> {tx('mondes explorés')}
              {' · '}
              <strong>{recolte}</strong> {recolte > 1 ? tx('cartes') : tx('carte')}
            </p>
          </div>
        </div>
        {/* LE CHEMIN — 11 arrêts, pas une barre XP (conservé, relogé dans le héros). */}
        <div
          className="r-chemin rec2-chemin"
          role="img"
          aria-label={tx('Le chemin du voyage — {{a}} monde{{s}} sur {{b}} traversé{{s2}}', {
            a: worldsDone,
            s: worldsDone > 1 ? 's' : '',
            b: WORLDS.length,
            s2: worldsDone > 1 ? 's' : '',
          })}
        >
          {recolteMondes.map((m, i) => {
            const etat = m.termine ? 'done' : m.monde.code === arret?.monde.code ? 'now' : 'off';
            return (
              <span key={m.monde.code} className="r-chemin-stop-wrap">
                {i > 0 && (
                  <i
                    className={etat === 'done' ? 'r-chemin-liaison r-chemin-liaison-done' : 'r-chemin-liaison'}
                    aria-hidden="true"
                  />
                )}
                <span
                  className={`r-chemin-stop r-chemin-${etat}`}
                  style={etat === 'done' ? { background: m.monde.tile.fg } : undefined}
                  title={m.monde.name}
                  aria-hidden="true"
                />
              </span>
            );
          })}
        </div>
        <a className="rec2-cta" href="#/mondes">
          {tx('Continuer le voyage')}
        </a>
      </section>

      {/* LES 5 ONGLETS — les 4 de la maquette + « Gains acquis » (fondateur). */}
      <div className="rec2-tabs" role="tablist" aria-label={tx('Sections de ta récolte')}>
        {(
          [
            ['apercu', tx('Aperçu')],
            ['cartes', tx('Cartes')],
            ['sceaux', tx('Sceaux')],
            ['gains', tx('Gains acquis')],
            ['histoire', tx('Histoire')],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            id={`rec2-tab-${id}`}
            aria-selected={onglet === id}
            aria-controls={`rec2-panel-${id}`}
            className={onglet === id ? 'rec2-tab rec2-tab-on' : 'rec2-tab'}
            onClick={() => setOnglet(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ============ APERÇU ============ */}
      <div
        role="tabpanel"
        id="rec2-panel-apercu"
        aria-labelledby="rec2-tab-apercu"
        className="rec2-panel"
        hidden={onglet !== 'apercu'}
      >
        {/* CARTE « EN COURS » — le jalon actif de l'échelle des grandes récoltes
            (maquette : « EN COURS · NIVEAU x SUR 6 »). Clic → son explication. */}
        {jalonActif && (
          <button
            type="button"
            className="rec2-next"
            onClick={() => ouvrirInfo({ type: 'jalon', jalonNum: jalonActif.num })}
            aria-label={tx('Niveau {{n}} — à quoi ça sert ?', { n: jalonActif.num })}
          >
            <span
              className="rec2-next-ico"
              style={{ background: jalonActif.tile.bg, color: jalonActif.tile.fg }}
              aria-hidden="true"
            >
              <VoyageIcon name={jalonActif.icon as VoyageIconName} size={24} />
            </span>
            <span className="rec2-next-body">
              <small>
                {/* Honnêteté : « En cours » seulement si le statut RÉEL du jalon
                    est 'now' ; sinon « Prochaine » (premier non atteint). */}
                {statutJalon(jalonActif.num, jalonActif.status) === 'now'
                  ? tx('En cours · Niveau {{n}} sur {{t}}', { n: jalonActif.num, t: MILESTONES.length })
                  : tx('Prochaine · Niveau {{n}} sur {{t}}', { n: jalonActif.num, t: MILESTONES.length })}
              </small>
              <strong>{jalonActif.name}</strong>
              <span className="rec2-next-sub">{jalonActif.desc}</span>
            </span>
            <span className="rec2-next-chev" aria-hidden="true">
              <Fleche />
            </span>
          </button>
        )}

        {/* DERNIÈRES CARTES — le carrousel réel (maquette), clic → explication,
            « Tout voir » bascule sur l'onglet Cartes. */}
        {recentes.length > 0 && (
          <section aria-labelledby="rec2-latest-title">
            <div className="rec2-sec-head">
              <h2 id="rec2-latest-title" className="rec2-h2">
                {tx('Dernières cartes')}
              </h2>
              <button type="button" className="rec2-link" onClick={() => setOnglet('cartes')}>
                {tx('Tout voir ({{n}})', { n: recolte })}
              </button>
            </div>
            <div className="rec2-latest" role="list" aria-label={tx('Dernières cartes')}>
              {recentes.map(({ c, m }) => (
                <button
                  key={c.id}
                  type="button"
                  role="listitem"
                  className="rec2-lc"
                  style={{ borderTopColor: m.monde.tile.fg }}
                  onClick={() =>
                    ouvrirInfo({
                      type: 'carte',
                      nom: c.nom,
                      titre: c.titre,
                      date: c.date,
                      mondeNum: m.monde.num,
                      mondeCode: m.monde.code,
                      queteId: c.id,
                    })
                  }
                  aria-label={tx('À quoi sert {{nom}} ?', { nom: c.nom })}
                >
                  <small style={{ color: m.monde.tile.fg }}>
                    {tx('Monde {{n}} · {{nom}}', { n: m.monde.num, nom: m.monde.name })}
                  </small>
                  <strong>{c.nom}</strong>
                  <span>{c.titre}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* TON PORTRAIT PREND FORME — la mosaïque 6 colonnes de la maquette :
            pièce pleine = monde traversé (couleur réelle), en cours = bordure
            pointillée teal, vide = tuile crème. Clic → explication fragment. */}
        <section aria-labelledby="rec2-mos-title">
          <div className="rec2-sec-head">
            <h2 id="rec2-mos-title" className="rec2-h2">
              {tx('Ton portrait prend forme')}
            </h2>
            <span className="rec2-count">
              {tx('{{a}} / {{b}}', { a: worldsDone, b: WORLDS.length })}
            </span>
          </div>
          <div
            className="rec2-mos"
            role="list"
            aria-label={tx('Le portrait en construction — {{a}} pièce{{s}} sur {{b}} assemblée{{s2}}', { a: worldsDone, s: worldsDone > 1 ? 's' : '', b: WORLDS.length, s2: worldsDone > 1 ? 's' : '' })}
          >
            {worldsDone > 0 && (
              <span className="rec2-mos-spark" aria-hidden="true">
                {tx('✨')}
              </span>
            )}
            {recolteMondes.map((m) => (
              <button
                key={m.monde.code}
                type="button"
                role="listitem"
                className={`rec2-tile ${m.termine ? 'rec2-tile-done' : m.livree ? 'rec2-tile-now' : ''}`}
                style={m.termine ? { background: m.monde.tile.bg, color: m.monde.tile.fg } : undefined}
                title={m.monde.name}
                onClick={() =>
                  ouvrirInfo({
                    type: 'fragment',
                    mondeNum: m.monde.num,
                    mondeCode: m.monde.code,
                    date: m.termine ? (parMonde[m.monde.code]?.derniereA ?? null) : null,
                  })
                }
                aria-label={tx('Fragment du portrait — {{nom}} : à quoi ça sert ?', { nom: m.monde.name })}
              >
                {m.termine && <VoyageIcon name={m.monde.icon as VoyageIconName} size={18} />}
              </button>
            ))}
          </div>
          <p className="rec2-caption">{tx('Chaque monde complété ajoute une pièce.')}</p>
        </section>

        {/* LES 11 MONDES — la grille de la maquette (TERMINÉ / EN COURS /
            À VENIR / PREMIUM). Clic → la fiche du mois (réelle ou promesse). */}
        <section aria-labelledby="rec2-worlds-title">
          <div className="rec2-sec-head">
            <h2 id="rec2-worlds-title" className="rec2-h2">
              {tx('Les {{n}} mondes', { n: WORLDS.length })}
            </h2>
            <span className="rec2-hint">{tx('Touche pour ouvrir')}</span>
          </div>
          <div className="rec2-worlds" role="list" aria-label={tx('La collection des 11 mondes')}>
            {recolteMondes.map((m) => {
              const w = m.monde;
              const prem = !w.free && !m.termine;
              const etat = m.termine
                ? tx('Terminé')
                : m.livree && m.faites > 0
                  ? tx('En cours')
                  : prem
                    ? 'Premium'
                    : tx('À venir');
              return (
                <button
                  key={w.code}
                  type="button"
                  role="listitem"
                  className={`rec2-w ${m.termine ? 'rec2-w-done' : m.livree && m.faites > 0 ? 'rec2-w-now' : prem ? 'rec2-w-prem' : 'rec2-w-soon'}`}
                  onClick={() => ouvrirInfo(infoMois(m))}
                  aria-label={tx('La récolte du mois {{n}} — {{nom}}', { n: w.num, nom: w.name })}
                >
                  <small>
                    {w.num} · {etat}
                  </small>
                  <span>{w.name}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* MES PASS / MES CRÉDITS — le duo compact de la maquette (0 honnête —
            rien n'est inventé, règle §16) ; l'explication complète vit dans le
            pop-up « à quoi ça sert ». */}
        <div className="rec2-duo">
          <button
            type="button"
            className="rec2-duo-card"
            onClick={() => ouvrirInfo({ type: 'pass' })}
            aria-label={tx('À quoi sert un pass ?')}
          >
            <small>{tx('Mes pass')}</small>
            <strong>0</strong>
            <span>{tx('À quoi ça sert ?')}</span>
          </button>
          <button
            type="button"
            className="rec2-duo-card"
            onClick={() => ouvrirInfo({ type: 'credit' })}
            aria-label={tx('À quoi servent les crédits ?')}
          >
            <small>{tx('Mes crédits')}</small>
            <strong>0</strong>
            <span>{tx('Comment en obtenir ?')}</span>
          </button>
        </div>

        {/* TES ESPACES — les 3 portes (conservées : rien n'est supprimé). */}
        <h2 className="rec2-h2 rec2-esp-t">{tx('Tes espaces')}</h2>
        <div className="rec-states">
          <a className="card rec-state" href="#/portrait">
            <span
              className="rec-state-ico"
              style={{ background: '#fde9e6', color: '#f56b53' }}
              aria-hidden="true"
            >
              <VoyageIcon name="mirror" size={20} />
            </span>
            <span className="rec-state-body">
              <h2>{tx('Ton Portrait')}</h2>
              <p>{tx('Dès tes premières réponses, ton portrait commence à se construire.')}</p>
            </span>
            <span className="p-chip">{tx('En construction')}</span>
          </a>
          <a className="card rec-state" href="#/parcourus">
            <span
              className="rec-state-ico"
              style={{ background: '#e4f4e4', color: '#3e9d5b' }}
              aria-hidden="true"
            >
              <VoyageIcon name="signpost" size={20} />
            </span>
            <span className="rec-state-body">
              <h2>{tx('Ton journal')}</h2>
              {/* Verbatim bundle (U+2019 dans « l’instant ») — tant qu'aucun monde
                  n'est franchi ; sinon la copie suit l'état réel. */}
              <p>
                {worldsDone > 0
                  ? tx("Ton journal se remplit — chaque monde franchi y rejoint ce qu'il t'a révélé.")
                  : tx('Aucun monde traversé pour l’instant — le premier ouvre bientôt.')}
              </p>
            </span>
            <span className="p-chip">
              {tx('{{a}} sur {{b}}', { a: worldsDone, b: WORLDS.length })}
            </span>
          </a>
          <a className="card rec-state" href="#/matchs">
            <span
              className="rec-state-ico"
              style={{ background: '#fde4ec', color: '#e2557b' }}
              aria-hidden="true"
            >
              <VoyageIcon name="rings" size={20} />
            </span>
            <span className="rec-state-body">
              <h2>{tx('Tes rencontres')}</h2>
              <p>{tx('Certaines rencontres commencent ici.')}</p>
            </span>
            <span className="p-chip">{tx("0 pour l'instant")}</span>
          </a>
        </div>

        {/* VIE PRIVÉE — le bandeau de la maquette (#EAF3F3). */}
        <article className="rec2-privacy">
          <span aria-hidden="true">
            <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <rect x="5" y="11" width="14" height="9" rx="2" />
              <path d="M8 11V8a4 4 0 018 0v3" />
            </svg>
          </span>
          <p>
            <strong>{tx('Tu gardes le contrôle.')}</strong>{' '}
            {tx("Ta récolte t'appartient : tu choisis ce que tu partages, quand tu le partages — et l'espace pour gérer ce que tu montres s'ouvrira plus tard dans ton voyage.")}
          </p>
        </article>
      </div>

      {/* ============ CARTES ============ */}
      <div
        role="tabpanel"
        id="rec2-panel-cartes"
        aria-labelledby="rec2-tab-cartes"
        className="rec2-panel"
        hidden={onglet !== 'cartes'}
      >
        <section aria-labelledby="r-cartes-title">
          <h2 id="r-cartes-title" className="rec2-h2">
            {tx('Mes cartes')}
          </h2>
          <p className="rec2-caption">
            {tx('Les découvertes que ton voyage a révélées sur toi.')}
          </p>
          {/* La note de cadrage reprend la sous-titre d'origine (rien n'est perdu) :
              des tendances mesurées, jamais un diagnostic absolu (prompt §4). */}
          <p className="rec2-note">
            {tx('Ce que ton voyage construit, étape après étape — chaque découverte reste à toi. Tes cartes décrivent des tendances, jamais des étiquettes : tu es toujours plus qu\'un profil.')}
          </p>
          <div className="r-cartes" role="list" aria-label={tx('La collection des 11 mondes')}>
            {recolteMondes.map((m) => {
              const w = m.monde;
              return (
                <article
                  key={w.code}
                  role="listitem"
                  className={`r-cm ${m.termine ? 'r-cm-done' : m.livree && m.faites > 0 ? 'r-cm-now' : ''}`}
                >
                  <header className="r-cm-head">
                    <span
                      className="r-cm-ico"
                      style={{ background: w.tile.bg, color: w.tile.fg }}
                      aria-hidden="true"
                    >
                      <VoyageIcon name={w.icon as VoyageIconName} size={21} />
                    </span>
                    <div className="r-cm-titre">
                      <small>
                        {tx('Mois {{num}} sur 11', { num: w.num })}
                      </small>
                      <h3>{w.name}</h3>
                    </div>
                    {m.termine ? (
                      <span className="v-chip v-chip-done">
                        <Coche />
                        {tx('Découverte')}
                      </span>
                    ) : m.livree && m.faites > 0 ? (
                      <span className="v-chip v-chip-now">
                        <span className="v-chip-dot" aria-hidden="true" />
                        {tx('En cours')}
                      </span>
                    ) : (
                      <span className="v-chip v-chip-soon">{tx('À découvrir')}</span>
                    )}
                  </header>
                  {m.cartes.length > 0 ? (
                    <ul className="r-cm-list">
                      {m.cartes.map((c) => (
                        <li key={c.id} className="r-cm-dec">
                          <button
                            type="button"
                            className="r-btn r-cm-dec-btn"
                            onClick={() =>
                              ouvrirInfo({
                                type: 'carte',
                                nom: c.nom,
                                titre: c.titre,
                                date: c.date,
                                mondeNum: w.num,
                                mondeCode: w.code,
                                queteId: c.id,
                              })
                            }
                            aria-label={tx('À quoi sert {{nom}} ?', { nom: c.nom })}
                          >
                            <span className="r-cm-dec-ico" aria-hidden="true">
                              <VoyageIcon name="gem" size={14} />
                            </span>
                            <span className="r-cm-dec-body">
                              <strong>{c.nom}</strong>
                              <small>
                                {c.titre}
                                {c.date ? ` · ${dateCourte(c.date, lang)}` : ''}
                              </small>
                            </span>
                          </button>
                          <a
                            className="r-cm-lien"
                            href={`#/quete/${c.id}/resultats`}
                            aria-label={tx('Voir mes résultats en détail — {{nom}}', { nom: c.nom })}
                          >
                            {tx('Voir en détail')}
                            <Fleche />
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="r-cm-soft">
                      {m.livree
                        ? tx('Les découvertes de ce monde apparaîtront au fil de tes quêtes.')
                        : tx('Cette pièce de ton portrait apparaîtra pendant ton voyage.')}
                    </p>
                  )}
                  {m.livree && m.faites > 0 && !m.termine && (
                    <p className="r-cm-meta">
                      {tx('{{faites}}/{{total}} étapes', { faites: m.faites, total: m.total })}
                    </p>
                  )}
                  {!m.livree && (
                    <p className="r-cm-meta">
                      {tx('À découvrir dans le Monde {{n}}', { n: w.num })}
                      {!w.free && (
                        <span className="v-prem" aria-label="Premium">
                          <VoyageIcon name="gem" size={10} strokeWidth={2.2} />
                          <em>Premium</em>
                        </span>
                      )}
                    </p>
                  )}
                </article>
              );
            })}
          </div>
          {/* La DISTINCTION demandée (prompt §6) : la Carte du voyage ≠ Mes cartes. */}
          <p className="rec2-note">
            {tx('À ne pas confondre : la Carte du voyage trace ton chemin — tes cartes racontent ce que tu as découvert.')}
            <a href="#/voyage">
              {tx('Voir la Carte du voyage')}
              <Fleche />
            </a>
          </p>
        </section>
      </div>

      {/* ============ SCEAUX ============ */}
      <div
        role="tabpanel"
        id="rec2-panel-sceaux"
        aria-labelledby="rec2-tab-sceaux"
        className="rec2-panel"
        hidden={onglet !== 'sceaux'}
      >
        <section aria-labelledby="r-sceaux-title">
          <h2 id="r-sceaux-title" className="rec2-h2">
            {tx('Mes sceaux')}
          </h2>
          <p className="rec2-caption">{tx('Les étapes que tu as traversées.')}</p>
          <p className="rec2-note">
            {tx('Permanents et non consommables — chaque sceau marque un territoire que tu as traversé, et il reste à toi.')}
          </p>
          <div className="r-sceaux" role="list" aria-label={tx('Les sceaux de ton parcours')}>
            {recolteMondes.map((m) => {
              const cloture = parMonde[m.monde.code]?.derniereA ?? null;
              return (
                <div key={m.monde.code} role="listitem">
                  <button
                    type="button"
                    className={`r-sceau ${m.termine ? 'r-sceau-done' : m.livree && m.faites > 0 ? 'r-sceau-now' : ''}`}
                    onClick={() =>
                      ouvrirInfo({
                        type: 'sceau',
                        mondeNum: m.monde.num,
                        mondeCode: m.monde.code,
                        date: m.termine ? cloture : null,
                      })
                    }
                    aria-label={tx('Sceau — {{nom}} : à quoi ça sert ?', { nom: m.monde.name })}
                  >
                    <span
                      className="r-sceau-medal"
                      style={
                        m.termine
                          ? { background: m.monde.tile.bg, color: m.monde.tile.fg, boxShadow: `0 0 0 4px ${m.monde.tile.bg}` }
                          : m.livree && m.faites > 0
                            ? { color: m.monde.tile.fg, borderColor: m.monde.tile.fg }
                            : undefined
                      }
                      aria-hidden="true"
                    >
                      <VoyageIcon name={m.monde.icon as VoyageIconName} size={22} />
                      {m.termine && (
                        <span className="r-sceau-check" aria-hidden="true">
                          <Coche />
                        </span>
                      )}
                    </span>
                    <span className="r-sceau-name">{m.monde.name}</span>
                    {m.termine && cloture ? (
                      <span className="r-sceau-date">{dateCourte(cloture, lang)}</span>
                    ) : m.livree && m.faites > 0 ? (
                      <span className="r-sceau-etat">{tx('en cours')}</span>
                    ) : (
                      <span className="r-sceau-etat">{tx('à venir')}</span>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* ============ GAINS ACQUIS (demande fondateur) ============
          L'inventaire consolidé de ce que le voyage a DÉJÀ donné : compteurs
          réels + registre chronologique de chaque gain — même source de
          vérité que les autres onglets, aucun chiffre inventé. */}
      <div
        role="tabpanel"
        id="rec2-panel-gains"
        aria-labelledby="rec2-tab-gains"
        className="rec2-panel"
        hidden={onglet !== 'gains'}
      >
        <section aria-labelledby="r-gains-title">
          <h2 id="r-gains-title" className="rec2-h2">
            {tx('Mes gains acquis')}
          </h2>
          <p className="rec2-caption">
            {tx('Tout ce que ton voyage a déjà mis dans ton coffre.')}
          </p>

          {/* TON INVENTAIRE — les compteurs réels (cartes, écrans, fragments,
              sceaux) + pass/crédits à 0 honnête (§16). Chaque tuile ouvre
              l'explication « à quoi ça sert dans les rencontres ». */}
          <h3 className="rec2-h3g">{tx('Ton inventaire')}</h3>
          <div className="r-inv" role="list" aria-label={tx('Ton inventaire de gains')}>
            {inventaire.map((it) => {
              const st =
                it.type === 'pass'
                  ? GAIN_STYLE.ecran
                  : it.type === 'credit'
                    ? GAIN_STYLE.carte
                    : GAIN_STYLE[it.type];
              return (
                <button
                  key={it.type}
                  type="button"
                  role="listitem"
                  className="r-inv-card"
                  onClick={() => ouvrirInfo({ type: it.type })}
                  aria-label={tx('{{label}} : {{n}} — à quoi ça sert ?', { label: it.label, n: it.n })}
                >
                  <span className="r-inv-top">
                    <span className="r-inv-ico" style={{ background: st.bg, color: st.fg }} aria-hidden="true">
                      <VoyageIcon name={st.ico} size={14} />
                    </span>
                    <strong>{it.n}</strong>
                  </span>
                  <small>{it.label}</small>
                </button>
              );
            })}
          </div>
        </section>

        {/* LE REGISTRE — chaque gain réellement obtenu, du plus récent au
            tout premier ; clic → son explication (même pop-up que partout). */}
        {gains.length > 0 ? (
          <section aria-labelledby="r-reg-title">
            <h2 id="r-reg-title" className="rec2-h2">
              {tx('Gain après gain')}
            </h2>
            <p className="rec2-caption">{tx('Du plus récent au tout premier.')}</p>
            <div className="r-gains" role="list" aria-label={tx('La chronologie de tes gains')}>
              {gains.map((g) => {
                const st = GAIN_STYLE[g.type];
                return (
                  <button
                    key={g.key}
                    type="button"
                    role="listitem"
                    className="r-gain"
                    onClick={() => ouvrirInfo(g.item)}
                    aria-label={tx('À quoi sert {{nom}} ?', { nom: g.nom })}
                  >
                    <span className="r-gain-ico" style={{ background: st.bg, color: st.fg }} aria-hidden="true">
                      <VoyageIcon name={st.ico} size={16} />
                    </span>
                    <span className="r-gain-body">
                      <small>{g.sous}</small>
                      <strong>{g.nom}</strong>
                    </span>
                    {g.date && <span className="r-gain-date">{dateCourte(g.date, lang)}</span>}
                  </button>
                );
              })}
            </div>
          </section>
        ) : (
          <section aria-labelledby="r-vide-title" className="r-vide">
            <span className="r-vide-ico" aria-hidden="true">
              <VoyageIcon name="scroll" size={22} />
            </span>
            <h2 id="r-vide-title">{tx('Ton coffre est encore vide.')}</h2>
            <p>{tx('Ta première découverte l\'ouvrira — elle rejoindra cet inventaire.')}</p>
            <a className="rec2-cta" href="#/mondes">
              {tx('Continuer le voyage')}
            </a>
          </section>
        )}

        {/* PASS & CRÉDITS — le raccord honnête : leur solde et leurs usages
            s'afficheront ici dès leur ouverture (promesse déjà écrite dans le
            pop-up Crédits — « Ton solde, tes gains et tes usages s'afficheront
            dans ta récolte »), gagnés en voyageant, jamais contre une
            meilleure compatibilité (§16). */}
        <p className="rec2-note">
          {tx('Pass et crédits : ton solde et tes usages s\'afficheront ici dès leur ouverture — gagnés en voyageant.')}
        </p>
      </div>

      {/* ============ HISTOIRE ============ */}
      <div
        role="tabpanel"
        id="rec2-panel-histoire"
        aria-labelledby="rec2-tab-histoire"
        className="rec2-panel"
        hidden={onglet !== 'histoire'}
      >
        {/* LES GRANDES RÉCOLTES — l'échelle des 6 jalons (relogée ici), hiérarchisée. */}
        <section aria-labelledby="rec-jalons-title">
          <h2 id="rec-jalons-title" className="rec2-h2">
            {tx('Les étapes de ta récolte')}
          </h2>
          <ol className="v-rec">
            {MILESTONES.map((jalon) => {
              const statut = statutJalon(jalon.num, jalon.status);
              return (
                <li
                  key={jalon.num}
                  className={
                    statut === 'atteint'
                      ? 'v-rec-item v-rec-done'
                      : statut === 'now'
                        ? 'v-rec-item v-rec-now'
                        : 'v-rec-item'
                  }
                >
                  <span
                    className="v-rec-ico"
                    style={{ background: jalon.tile.bg, color: jalon.tile.fg }}
                    aria-hidden="true"
                  >
                    <VoyageIcon name={jalon.icon as VoyageIconName} size={21} />
                  </span>
                  <div className="v-rec-body">
                    <small className="r-niveau">
                      {tx('Niveau {{n}} sur {{total}}', { n: jalon.num, total: MILESTONES.length })}
                    </small>
                    <h3>
                      {jalon.name}
                      {statut === 'atteint' ? (
                        <span className="v-chip v-chip-done">
                          <Coche />
                          {tx('Atteint')}
                        </span>
                      ) : statut === 'now' ? (
                        <span className="v-chip v-chip-now">
                          <span className="v-chip-dot" aria-hidden="true" />
                          {tx('En cours')}
                        </span>
                      ) : (
                        <span className="v-chip v-chip-soon">{tx('À venir')}</span>
                      )}
                    </h3>
                    <p>{jalon.desc}</p>
                    <button
                      type="button"
                      className="r-info-btn"
                      onClick={() => ouvrirInfo({ type: 'jalon', jalonNum: jalon.num })}
                      aria-label={tx('Niveau {{n}} — à quoi ça sert ?', { n: jalon.num })}
                    >
                      {tx('À quoi ça sert ?')}
                    </button>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        {/* MON HISTOIRE DE VOYAGE — la timeline : monde après monde, ce qui est
            apparu dans la récolte. Uniquement des faits réels (cartes posées,
            écrans de passage, fragment, sceau). */}
        <section aria-labelledby="r-tl-title">
          <h2 id="r-tl-title" className="rec2-h2">
            {tx('Mon histoire de voyage')}
          </h2>
          <p className="rec2-caption">{tx('Comment ta récolte s\'est construite, monde après monde.')}</p>
          <ol className="r-tl">
            {histoires.map((m) => (
              <li key={m.monde.code} className="r-tl-item">
                <span
                  className="r-tl-node"
                  style={{ background: m.monde.tile.bg, color: m.monde.tile.fg }}
                  aria-hidden="true"
                >
                  <VoyageIcon name={m.monde.icon as VoyageIconName} size={17} />
                </span>
                <div className="r-tl-body">
                  <small className="r-tl-etape">
                    {tx('Monde {{n}} sur {{total}}', { n: m.monde.num, total: WORLDS.length })} ·{' '}
                    {m.termine ? (
                      <strong className="r-tl-fait">{tx('terminé')}</strong>
                    ) : (
                      tx('{{faites}}/{{total}} étapes', { faites: m.faites, total: m.total })
                    )}
                  </small>
                  <h3>{m.monde.name}</h3>
                  {m.cartes.length > 0 && (
                    <>
                      <p className="r-tl-label">{tx('Tu as découvert :')}</p>
                      <ul className="r-tl-chips">
                        {m.cartes.map((c) => (
                          <li key={c.id}>
                            <button
                              type="button"
                              className="r-btn r-tl-chip"
                              title={c.titre}
                              onClick={() =>
                                ouvrirInfo({
                                  type: 'carte',
                                  nom: c.nom,
                                  titre: c.titre,
                                  date: c.date,
                                  mondeNum: m.monde.num,
                                  mondeCode: m.monde.code,
                                  queteId: c.id,
                                })
                              }
                              aria-label={tx('À quoi sert {{nom}} ?', { nom: c.nom })}
                            >
                              <VoyageIcon name="gem" size={12} />
                              {c.nom}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                  {m.ecrans.length > 0 && (
                    <ul className="r-tl-chips">
                      {m.ecrans.map((e) => (
                        <li key={e.id}>
                          <button
                            type="button"
                            className="r-btn r-tl-chip r-tl-chip-soft"
                            title={e.titre}
                            onClick={() =>
                              ouvrirInfo({
                                type: 'ecran',
                                titre: e.titre,
                                date: e.date,
                                mondeNum: m.monde.num,
                                mondeCode: m.monde.code,
                              })
                            }
                            aria-label={tx('Écran de passage — à quoi ça sert ?')}
                          >
                            <VoyageIcon name="signpost" size={12} />
                            {tx('Écran de passage')}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                  {m.termine && (
                    <ul className="r-tl-chips">
                      <li>
                        <button
                          type="button"
                          className="r-btn r-tl-chip r-tl-chip-soft"
                          onClick={() =>
                            ouvrirInfo({
                              type: 'fragment',
                              mondeNum: m.monde.num,
                              mondeCode: m.monde.code,
                              date: parMonde[m.monde.code]?.derniereA ?? null,
                            })
                          }
                          aria-label={tx('Fragment du portrait — {{nom}} : à quoi ça sert ?', { nom: m.monde.name })}
                        >
                          <VoyageIcon name="layers" size={12} />
                          {tx('Fragment du portrait')}
                        </button>
                      </li>
                      <li>
                        <button
                          type="button"
                          className="r-btn r-tl-chip r-tl-chip-soft"
                          onClick={() =>
                            ouvrirInfo({
                              type: 'sceau',
                              mondeNum: m.monde.num,
                              mondeCode: m.monde.code,
                              date: parMonde[m.monde.code]?.derniereA ?? null,
                            })
                          }
                          aria-label={tx('Sceau — {{nom}} : à quoi ça sert ?', { nom: m.monde.name })}
                        >
                          <VoyageIcon name="star" size={12} />
                          {tx('Sceau du monde')}
                        </button>
                      </li>
                    </ul>
                  )}
                </div>
              </li>
            ))}
            {teaser && (
              <li className="r-tl-item r-tl-next">
                <span className="r-tl-node r-tl-node-off" aria-hidden="true">
                  <VoyageIcon name="lock" size={15} strokeWidth={2.2} />
                </span>
                <div className="r-tl-body">
                  <small className="r-tl-etape">
                    {tx('Monde {{n}} sur {{total}}', { n: teaser.num, total: WORLDS.length })} ·{' '}
                    <strong>{tx('bientôt')}</strong>
                  </small>
                  <h3>{teaser.name}</h3>
                  <p className="r-tl-attente">{tx('Ta prochaine découverte t\'attend ici.')}</p>
                </div>
              </li>
            )}
          </ol>
        </section>

        {/* TA RÉCOLTE, MOIS PAR MOIS — la vue mensuelle (demande fondateur Task 45 :
            « organiser les récoltes par mois ») : un mois = un monde du voyage,
            sa récolte RÉELLE ou sa promesse (WORLD_DETAILS), et la fiche
            « récolte du mois » cliquable — avec le raccord premium honnête
            (PRIX_PREMIUM, i18n/currency.ts) pour les mois payants. */}
        <section aria-labelledby="r-mois-title">
          <h2 id="r-mois-title" className="rec2-h2">
            {tx('Ta récolte, mois par mois')}
          </h2>
          <p className="rec2-caption">
            {tx('Onze mois, onze récoltes — ce que chaque mois du voyage met dans ton coffre.')}
          </p>
          <ol className="r-mois" aria-label={tx('La récolte de chaque mois du voyage')}>
            {recolteMondes.map((m) => {
              const w = m.monde;
              const sousTitre = m.termine
                ? tx('{{x}} carte{{s}} · 1 fragment · 1 sceau', {
                    x: m.cartes.length,
                    s: m.cartes.length > 1 ? 's' : '',
                  })
                : m.livree && m.faites > 0
                  ? tx('{{faites}}/{{total}} étapes', { faites: m.faites, total: m.total })
                  : tx('{{n}} étapes à venir', { n: w.quests });
              return (
                <li
                  key={w.code}
                  className={
                    m.termine
                      ? 'r-mois-item r-mois-done'
                      : m.livree && m.faites > 0
                        ? 'r-mois-item r-mois-now'
                        : 'r-mois-item'
                  }
                >
                  <button
                    type="button"
                    className="r-mois-row"
                    onClick={() => ouvrirInfo(infoMois(m))}
                    aria-label={tx('La récolte du mois {{n}} — {{nom}}', { n: w.num, nom: w.name })}
                  >
                    <span
                      className="r-mois-ico"
                      style={{ background: w.tile.bg, color: w.tile.fg }}
                      aria-hidden="true"
                    >
                      <VoyageIcon name={w.icon as VoyageIconName} size={19} />
                    </span>
                    <span className="r-mois-body">
                      <small>{tx('Mois {{n}} sur 11', { n: w.num })}</small>
                      <strong>{w.name}</strong>
                      <span className="r-mois-sub">
                        {sousTitre}
                        {!w.free && (
                          <span className="v-prem" aria-label="Premium">
                            <VoyageIcon name="gem" size={10} strokeWidth={2.2} />
                            <em>Premium</em>
                          </span>
                        )}
                      </span>
                    </span>
                    <Fleche />
                  </button>
                </li>
              );
            })}
          </ol>
        </section>
      </div>

      {/* LE POP-UP EXPLICATIF — « à quoi ça sert dans les rencontres ». */}
      {info && <InfoRecolteModal item={info} onClose={() => setInfo(null)} />}
    </main>
  );
}
