/**
 * « Ma récolte » (#/recolte) — le coffre du voyageur.
 *
 * REFONTE (Task 43, prompt fondateur « REFONTE COMPLÈTE DE LA PAGE MA
 * RÉCOLTE ») — la page raconte ce que le voyage a construit : JE DÉCOUVRE →
 * JE COMPRENDS → JE CONSTRUIS → JE PEUX → JE RENCONTRE. Réorganisée SANS
 * rien supprimer (consigne fondateur : « ne supprime rien, ajoute ») :
 *  - le héros « Mon voyage » GARDE ses chiffres réels, sa barre, ses stats et
 *    son CTA, et gagne le CHEMIN des 11 mondes (11 arrêts colorés — pas une
 *    barre XP) et la PHRASE DYNAMIQUE (0 · 1-3 · 4-7 · 8-10 · 11 mondes) ;
 *  - « Mes cartes » (la section DOMINANTE) : la collection des 11 mondes —
 *    chaque monde montre ses découvertes RÉELLES (cartes des quêtes avec
 *    dates + lien vers les résultats détaillés) ou sa promesse douce (« À
 *    découvrir dans le Monde n » — jamais de cadenas agressif) ; note de
 *    cadrage : des tendances, jamais des étiquettes ; la Carte du voyage
 *    (#/voyage) est explicitement DISTINGUÉE des cartes-découvertes ;
 *  - « Les étapes de ta récolte » (l'échelle des 6 jalons, conservée) gagne
 *    ses marqueurs « Niveau 1..6 » — la hiérarchie des grandes récoltes ;
 *  - « Ton portrait prend forme » : les 11 fragments assemblés (mosaïque
 *    organique décalée — pièce pleine = monde traversé) ;
 *  - « Mes pass » / « Mes crédits » : l'ARCHITECTURE accueille ces familles —
 *    aucune récompense inventée (règle §16 du prompt) : états vides honnêtes,
 *    les crédits restent secondaires, un pass n'achète jamais un match ;
 *  - « Mes sceaux » : les sceaux DÉRIVÉS de la progression réelle (monde
 *    traversé = sceau posé, date de clôture) — médailles élégantes et
 *    symboliques, jamais des trophées dorés ;
 *  - « Mon histoire de voyage » : la TIMELINE — monde après monde, ce qui est
 *    apparu (cartes, fragment du portrait, sceau) + le prochain monde (« Ta
 *    prochaine découverte t'attend ici. ») ;
 *  - « Tes espaces » (les 3 portes) et « Tu gardes le contrôle. » conservés ;
 *  - la RÉVÉLATION (micro-interaction §15) : quand de nouvelles cartes sont
 *    apparues depuis la dernière visite — « Une nouvelle pièce de ton
 *    portrait vient d'apparaître. » + la carte — une lumière douce, PAS de
 *    confettis (une seule fois par nouvelle pièce, mémorisé localement).
 *
 * RÈGLE ABSOLUE (prompt §19) : aucune logique métier, donnée, résultat
 * psychométrique ou calcul modifié — la page lit l'état réel
 * (wairyu.quete.{id} via useEtatQuete + useProgressionDetail) et le
 * présente. Les écrans sans carte (1.7, 1.11, 2.8) restent hors collection
 * (ils ne produisent pas de carte — même filtre que le journal).
 * Détail typographique VERBATIM : la chaîne « Aucun monde traversé pour
 * l’instant — le premier ouvre bientôt. » garde son apostrophe typographique
 * U+2019 dans « l’instant » — ne pas « corriger ». Ailleurs : U+0027.
 */

import { useEffect, useRef, useState } from 'react';
import { MILESTONES, TOTAL_STEPS, WORLDS } from '../lib/voyage';
import type { VoyageWorld } from '../lib/voyage';
import { QUETES, QUETE_IDS, mondeDeQuete } from '../lib/quetes';
import type { IdQuete } from '../lib/quetes';
import { useEtatQuete } from '../lib/quete-state';
import type { EtatQuete } from '../lib/quete-state';
import { useProgressionDetail } from '../lib/progression';
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

/** La flèche des liens « Voir en détail ». */
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
  // Ordre FIXE et inconditionnel (règles des hooks) — les 18 quêtes ouvertes.
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
  };
  // La progression RÉELLE — les compteurs et les jalons suivent l'état des
  // quêtes, réactifs (même bus que l'atlas et le journal).
  const { worldsDone, stepsDone, recolte, parMonde } = useProgressionDetail();

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

  // La phrase DYNAMIQUE du prompt — elle suit les mondes traversés.
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

  return (
    <main className="screen">
      <h1 className="screen-title">{tx('Ma récolte')}</h1>
      <p className="screen-sub">{tx("Ce que ton voyage t'a déjà apporté.")}</p>

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

      {/* HÉROS « MON VOYAGE » — chiffres réels (conservés) + chemin + phrase. */}
      <section className="m-hero" aria-label={tx('Mon voyage')}>
        <span
          className="m-hero-ico"
          style={{ background: '#fff3d6', color: '#e8a312' }}
          aria-hidden="true"
        >
          <VoyageIcon name="gem" size={26} />
        </span>
        <div className="m-hero-body">
          <small className="m-hero-label">{tx('Mon voyage')}</small>
          <h2>
            {recolte > 0
              ? tx('{{n}} cartes récoltées', { n: recolte })
              : tx('Ta récolte commence avec ta première quête.')}
          </h2>
          {/* LE CHEMIN — 11 arrêts, pas une barre XP : chaque monde traversé
              allume sa couleur, l'arrêt actuel pulse doucement. */}
          <div
            className="r-chemin"
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
          <div className="m-hero-row">
            <div
              className="m-bar"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={TOTAL_STEPS}
              aria-valuenow={stepsDone}
              aria-label={tx('Progression du voyage')}
            >
              <div
                className="m-bar-fill"
                style={{ width: `${Math.round((stepsDone / TOTAL_STEPS) * 100)}%` }}
              />
            </div>
            <span className="m-hero-count">
              {tx('{{faites}}/{{total}} étapes', { faites: stepsDone, total: TOTAL_STEPS })}
            </span>
          </div>
          <div className="m-stats" role="list" aria-label={tx('Le voyage en chiffres')}>
            <span role="listitem">
              <strong>{worldsDone}/{WORLDS.length}</strong> {tx('mondes explorés')}
            </span>
            <span role="listitem">
              <strong>{stepsDone}/{TOTAL_STEPS}</strong> {tx('étapes')}
            </span>
            <span role="listitem">
              <strong>{recolte}</strong> {tx('cartes')}
            </span>
          </div>
          {/* LA PHRASE DYNAMIQUE — elle évolue avec la progression. */}
          <p className="r-phrase">{phrase}</p>
        </div>
        <a className="btn btn-accent m-hero-cta" href="#/mondes">
          {tx('Continuer le voyage')}
        </a>
      </section>

      {/* MES CARTES — la section dominante : la collection des 11 mondes. */}
      <section aria-labelledby="r-cartes-title">
        <h2 id="r-cartes-title" className="m-sec-title">
          {tx('Mes cartes')}
        </h2>
        <p className="r-sec-sub">{tx('Les découvertes que ton voyage a révélées sur toi.')}</p>
        {/* La note de cadrage reprend la sous-titre d'origine (rien n'est perdu) :
            des tendances mesurées, jamais un diagnostic absolu (prompt §4). */}
        <p className="r-note">
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
                      {tx('0{{num}} — Monde {{num}}', { num: w.num })}
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
                        <span className="r-cm-dec-ico" aria-hidden="true">
                          <VoyageIcon name="gem" size={14} />
                        </span>
                        <div className="r-cm-dec-body">
                          <strong>{c.nom}</strong>
                          <small>
                            {c.titre}
                            {c.date ? ` · ${dateCourte(c.date, lang)}` : ''}
                          </small>
                        </div>
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
        <p className="r-disamb">
          {tx('À ne pas confondre : la Carte du voyage trace ton chemin — tes cartes racontent ce que tu as découvert.')}
          <a href="#/voyage">
            {tx('Voir la Carte du voyage')}
            <Fleche />
          </a>
        </p>
      </section>

      {/* LES GRANDES RÉCOLTES — l'échelle des 6 jalons (conservée), désormais
          hiérarchisée « Niveau 1..6 » (prompt §6). */}
      <section aria-labelledby="rec-jalons-title">
        <h2 id="rec-jalons-title" className="m-sec-title">
          {tx('Les étapes de ta récolte')}
        </h2>
        <ol className="v-rec">
          {MILESTONES.map((jalon) => {
            const statut = jalon.num === 1
              ? recolte > 0
                ? 'atteint'
                : 'now'
              : jalon.num === 2
                ? worldsDone >= 1
                  ? 'atteint'
                  : (parMonde['M1']?.faites ?? 0) > 0
                    ? 'now'
                    : jalon.status
                : jalon.num === 3
                  ? worldsDone >= 1
                    ? 'now'
                    : jalon.status
                  : jalon.status;
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
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      {/* TON PORTRAIT PREND FORME — 11 fragments qui s'assemblent. */}
      <section aria-labelledby="r-portrait-title">
        <h2 id="r-portrait-title" className="m-sec-title">
          {tx('Ton portrait prend forme')}
        </h2>
        <p className="r-sec-sub">
          {tx('Onze mondes, onze fragments — chaque monde complété ajoute une pièce au portrait.')}
        </p>
        <div className="r-mosaic" role="img" aria-label={tx('Le portrait en construction — {{a}} pièce{{s}} sur {{b}} assemblée{{s2}}', { a: worldsDone, s: worldsDone > 1 ? 's' : '', b: WORLDS.length, s2: worldsDone > 1 ? 's' : '' })}>
          {worldsDone > 0 && (
            <span className="r-mosaic-spark" aria-hidden="true">
              {tx('✨')}
            </span>
          )}
          {recolteMondes.map((m) => (
            <span
              key={m.monde.code}
              className={`r-frag ${m.termine ? 'r-frag-done' : m.livree ? 'r-frag-now' : 'r-frag-off'}`}
              style={
                m.termine
                  ? { background: m.monde.tile.bg, color: m.monde.tile.fg }
                  : m.livree
                    ? { color: m.monde.tile.fg, borderColor: m.monde.tile.fg }
                    : undefined
              }
              title={m.monde.name}
              aria-hidden="true"
            >
              <VoyageIcon name={m.monde.icon as VoyageIconName} size={22} />
            </span>
          ))}
        </div>
        <p className="r-mosaic-count">
          {tx('{{a}} pièce{{s}} sur {{b}} assemblée{{s2}}', {
            a: worldsDone,
            s: worldsDone > 1 ? 's' : '',
            b: WORLDS.length,
            s2: worldsDone > 1 ? 's' : '',
          })}
        </p>
      </section>

      {/* MES PASS — la famille « Que permet mon parcours ? ». Aucun pass
          n'existe encore dans les données : l'architecture accueille, rien
          n'est inventé (prompt §16) ; jamais « acheter un meilleur match ». */}
      <section aria-labelledby="r-pass-title">
        <h2 id="r-pass-title" className="m-sec-title">
          {tx('Mes pass')}
        </h2>
        <p className="r-sec-sub">{tx('Des possibilités débloquées grâce à ton parcours.')}</p>
        <article className="card r-suche">
          <span
            className="r-suche-ico"
            style={{ background: '#e4f4e4', color: '#3e9d5b' }}
            aria-hidden="true"
          >
            <VoyageIcon name="signpost" size={20} />
          </span>
          <div className="r-suche-body">
            <h3>{tx('Aucun pass pour l\'instant')}</h3>
            <p>
              {tx('Ton parcours ouvrira des possibilités : explorer plus loin, être mieux vu, découvrir autrement. Chaque pass s\'affichera ici avec ce qu\'il permet et combien il en reste.')}
            </p>
            <p className="r-suche-note">
              {tx('Un pass facilite une action — il n\'achète jamais une meilleure compatibilité.')}
            </p>
          </div>
        </article>
      </section>

      {/* MES CRÉDITS — la famille « Que puis-je utiliser ? ». Secondaire par
          design (prompt §13) : compact, honnête, jamais le centre de la page. */}
      <section aria-labelledby="r-credits-title">
        <h2 id="r-credits-title" className="m-sec-title">
          {tx('Mes crédits')}
        </h2>
        <p className="r-sec-sub">{tx('Ce que tu peux utiliser au fil du voyage.')}</p>
        <article className="card r-suche">
          <span
            className="r-suche-ico"
            style={{ background: '#fff3d6', color: '#e8a312' }}
            aria-hidden="true"
          >
            <VoyageIcon name="star" size={20} />
          </span>
          <div className="r-suche-body">
            <h3>{tx('Comment obtenir des crédits ?')}</h3>
            <p>
              {tx('Ton solde s\'affichera ici dès tes premiers crédits — avec ce que tu as obtenu et ce que tu as utilisé. Les façons d\'en obtenir arriveront avec la suite du voyage.')}
            </p>
          </div>
        </article>
      </section>

      {/* MES SCEAUX — dérivés de la progression RÉELLE : monde traversé =
          sceau posé (avec sa date de clôture). Permanents, non consommables. */}
      <section aria-labelledby="r-sceaux-title">
        <h2 id="r-sceaux-title" className="m-sec-title">
          {tx('Mes sceaux')}
        </h2>
        <p className="r-sec-sub">{tx('Les étapes que tu as traversées.')}</p>
        <p className="r-note">
          {tx('Permanents et non consommables — chaque sceau marque un territoire que tu as traversé, et il reste à toi.')}
        </p>
        <div className="r-sceaux" role="list" aria-label={tx('Les sceaux de ton parcours')}>
          {recolteMondes.map((m) => {
            const cloture = parMonde[m.monde.code]?.derniereA ?? null;
            return (
              <div
                key={m.monde.code}
                role="listitem"
                className={`r-sceau ${m.termine ? 'r-sceau-done' : m.livree && m.faites > 0 ? 'r-sceau-now' : ''}`}
                aria-label={tx('Sceau — {{nom}} : {{etat}}', {
                  nom: m.monde.name,
                  etat: m.termine
                    ? tx('traversé')
                    : m.livree && m.faites > 0
                      ? tx('en cours')
                      : tx('à venir'),
                })}
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
              </div>
            );
          })}
        </div>
      </section>

      {/* MON HISTOIRE DE VOYAGE — la timeline : monde après monde, ce qui est
          apparu dans la récolte. Uniquement des faits réels (cartes posées,
          écrans de passage, fragment, sceau). */}
      <section aria-labelledby="r-tl-title">
        <h2 id="r-tl-title" className="m-sec-title">
          {tx('Mon histoire de voyage')}
        </h2>
        <p className="r-sec-sub">{tx('Comment ta récolte s\'est construite, monde après monde.')}</p>
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
                          <li key={c.id} className="r-tl-chip" title={c.titre}>
                            <VoyageIcon name="gem" size={12} />
                            {c.nom}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                  {m.ecrans.length > 0 && (
                    <ul className="r-tl-chips">
                      {m.ecrans.map((e) => (
                        <li key={e.id} className="r-tl-chip r-tl-chip-soft" title={e.titre}>
                          <VoyageIcon name="signpost" size={12} />
                          {tx('Écran de passage')}
                        </li>
                      ))}
                    </ul>
                  )}
                  {m.termine && (
                    <ul className="r-tl-chips">
                      <li className="r-tl-chip r-tl-chip-soft">
                        <VoyageIcon name="layers" size={12} />
                        {tx('Fragment du portrait')}
                      </li>
                      <li className="r-tl-chip r-tl-chip-soft">
                        <VoyageIcon name="star" size={12} />
                        {tx('Sceau du monde')}
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

      {/* TES ESPACES — les 3 portes (conservées : rien n'est supprimé). */}
      <h2 className="m-sec-title">{tx('Tes espaces')}</h2>
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

      <article className="card p-privacy">
        <span className="p-privacy-ico" aria-hidden="true">
          <VoyageIcon name="lock" size={16} strokeWidth={2.2} />
        </span>
        <div>
          <p>
            <strong>{tx('Tu gardes le contrôle.')}</strong>{' '}
            {tx("Ta récolte t'appartient : tu choisis ce que tu partages, quand tu le partages — et l'espace pour gérer ce que tu montres s'ouvrira plus tard dans ton voyage.")}
          </p>
        </div>
      </article>
    </main>
  );
}
