/**
 * L'onglet DÉCOUVRIR — le cœur de l'espace Rencontre (prompt fondateur
 * « RESTAURER L'ESPACE RENCONTRES — PREMIÈRE INTERFACE », design de
 * référence : ref1-ref4).
 *
 * La pile : profils de démonstration (STAGING UNIQUEMENT, étiquetés) puis
 * les membres RÉELS du pool (même format, honnêteté D-R3 : jamais de
 * donnée inventée — ce que le serveur ne livre pas ne s'affiche pas).
 *
 * Règles gravées : aucun score/note/pourcentage (D-R4 — les échos sont un
 * COMPTE de cartes en résonance), rien de payant, tout faisable aux
 * boutons (les gestes sont un bonus, jamais une obligation), prénom en
 * GRAND entièrement visible, une SEULE barre d'actions (Passer · Demander ·
 * Aimer), compteur quotidien 10, retour arrière 3/j, questions 5/j.
 */
import './Decouvrir.css';
import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useI18n } from '../i18n/I18nProvider';
import RencontresReelles from './RencontresReelles';
import { chargerPool, faireUnPas, type MembrePool, type ReponsePool } from '../lib/rencontres-client';
import { useProgressionDetail } from '../lib/progression';
import { PROFILS_DEMO, BANDES_MONDES, type CarteRencontre, type ProfilDemo } from '../lib/profils-demo';
import {
  EcranMatch,
  FeuilleDemander,
  FeuilleFiltres,
  FILTRES_DEFAUT,
  ProfilComplet,
  nomMonde,
  type Filtres,
  type Sujet,
} from './DecouvrirFeuilles';

/** Le maximum du jour (paramétrable plus tard — défaut du prompt : 10). */
const QUOTA_JOUR = 10;
const REWIND_JOUR = 3;
const QUESTIONS_JOUR = 5;

type Decision = 'like' | 'pass' | 'garde' | 'cache';
interface DecisionsJour {
  date: string;
  par: Record<string, { t: Decision; p?: string }>;
}
interface CompteurJour {
  date: string;
  a: number;
  p: number;
}

function aujourdhui(): string {
  return new Date().toISOString().slice(0, 10);
}

function lireJSON<T>(cle: string, defaut: T): T {
  try {
    const v = localStorage.getItem(cle);
    return v ? (JSON.parse(v) as T) : defaut;
  } catch {
    return defaut;
  }
}
function ecrireJSON(cle: string, v: unknown): void {
  try {
    localStorage.setItem(cle, JSON.stringify(v));
  } catch {
    /* stockage plein — silencieux, le deck reste utilisable */
  }
}

/** Le passage en staging se reconnaît à l'hôte (wairyu-staging.workers.dev). */
const EST_STAGING = typeof window !== 'undefined' && window.location.host.includes('staging');

function demoVersSujet(d: ProfilDemo): Sujet {
  return {
    id: d.id,
    prenom: d.prenom,
    photo: d.photo,
    initiale: null,
    age: d.age,
    ville: d.ville,
    distanceKm: d.distanceKm,
    intention: d.intention,
    verifie: d.verifie,
    metier: d.metier,
    bio: d.bio,
    interets: d.interets,
    echo: d.echo,
    cartes: d.cartes,
    cartesCachees: d.cartesCachees,
    raison: d.raison,
    phrasePortrait: d.phrasePortrait,
    raisonMatch: d.raisonMatch,
    phrasesMatch: d.phrasesMatch,
    demo: true,
    reel: false,
    likeRecu: d.likeRecu,
    mondeFranchisN: 0,
    mondeEnCoursNom: null,
    pasEnvoye: false,
    pasId: null,
  };
}

function reelVersSujet(m: MembrePool, tx: (s: string, p?: Record<string, string | number>) => string): Sujet {
  const nom = m.pseudo ?? tx('Voyageur·se');
  const enCours = m.mondes.find((x) => !x.termine);
  return {
    id: m.id,
    prenom: nom.split(' ')[0] ?? nom,
    photo: null,
    initiale: nom.charAt(0).toUpperCase(),
    age: null,
    ville: null,
    distanceKm: null,
    intention: null,
    verifie: false,
    metier: null,
    bio: null,
    interets: [],
    echo: 0,
    cartes: [],
    cartesCachees: [],
    raison: null,
    phrasePortrait: null,
    raisonMatch: null,
    phrasesMatch: [],
    demo: false,
    reel: true,
    likeRecu: false,
    mondeFranchisN: m.mondesFranchis,
    mondeEnCoursNom: enCours ? tx('{{nom}} — en cours', { nom: nomMonde(enCours.code) }) : null,
    pasEnvoye: m.pasEnvoye,
    pasId: m.pasId,
  };
}

export default function Decouvrir({ initiale: initialeToi }: { initiale?: string }) {
  const { tx } = useI18n();
  const [data, setData] = useState<ReponsePool | null>(null);
  const [erreur, setErreur] = useState(false);
  const [occupes, setOccupes] = useState<Set<string>>(new Set());
  const progres = useProgressionDetail();

  // ---- Onglets in-espace ----
  const [tab, setTab] = useState<'decouvrir' | 'matchs' | 'profil'>('decouvrir');

  // ---- État du deck ----
  const [decisions, setDecisions] = useState<DecisionsJour>(() => {
    const d = lireJSON<DecisionsJour>('wairyu.ren.decisions', { date: aujourdhui(), par: {} });
    return d.date === aujourdhui() ? d : { date: aujourdhui(), par: {} };
  });
  const [compteur, setCompteur] = useState<CompteurJour>(() => {
    const c = lireJSON<CompteurJour>('wairyu.ren.compteur', { date: aujourdhui(), a: 0, p: 0 });
    return c.date === aujourdhui() ? c : { date: aujourdhui(), a: 0, p: 0 };
  });
  const [rewinds, setRewinds] = useState<number>(() => {
    const r = lireJSON<{ date: string; n: number }>('wairyu.ren.rewinds', { date: aujourdhui(), n: 0 });
    return r.date === aujourdhui() ? r.n : 0;
  });
  const [questions, setQuestions] = useState<{ date: string; n: number; cibles: string[] }>(() => {
    const q = lireJSON<{ date: string; n: number; cibles: string[] }>('wairyu.ren.questions', {
      date: aujourdhui(),
      n: 0,
      cibles: [],
    });
    return q.date === aujourdhui() ? q : { date: aujourdhui(), n: 0, cibles: [] };
  });
  const [filtres, setFiltres] = useState<Filtres>(() => lireJSON<Filtres>('wairyu.ren.filtres', FILTRES_DEFAUT));

  const [feuilleFiltres, setFeuilleFiltres] = useState(false);
  const [feuille, setFeuille] = useState<{ sujet: Sujet; carte: CarteRencontre; phrase: string | null } | null>(null);
  const [plein, setPlein] = useState<Sujet | null>(null);
  const [match, setMatch] = useState<{ sujet: Sujet; demo: boolean; raison: string | null; phrases: string[] } | null>(null);
  const [menu, setMenu] = useState(false);
  const [refus, setRefus] = useState(false);
  const [sortie, setSortie] = useState<'g' | 'd' | null>(null);
  const [bat, setBat] = useState(false);
  /** La dernière décision (pour le retour arrière — 3/jour). */
  const [dernier, setDernier] = useState<{ id: string; t: Decision } | null>(null);

  // ---- Persistance ----
  useEffect(() => {
    ecrireJSON('wairyu.ren.decisions', decisions);
  }, [decisions]);
  useEffect(() => {
    ecrireJSON('wairyu.ren.compteur', compteur);
  }, [compteur]);
  useEffect(() => {
    ecrireJSON('wairyu.ren.rewinds', { date: aujourdhui(), n: rewinds });
  }, [rewinds]);
  useEffect(() => {
    ecrireJSON('wairyu.ren.questions', questions);
  }, [questions]);
  useEffect(() => {
    ecrireJSON('wairyu.ren.filtres', filtres);
  }, [filtres]);

  // ---- Le pool réel ----
  const charger = useCallback(async (): Promise<void> => {
    setErreur(false);
    try {
      const r = await chargerPool();
      setData(r);
    } catch {
      setErreur(true);
    }
  }, []);
  useEffect(() => {
    void charger();
  }, [charger]);

  // ---- La pile : démos (staging) puis membres réels, filtrés ----
  const tousLesDemos = useMemo(() => PROFILS_DEMO.map(demoVersSujet), []);
  const demosVisibles = useMemo(() => {
    if (!EST_STAGING) return [];
    return tousLesDemos.filter((s) => {
      if (decisions.par[s.id]) return false;
      if (s.age !== null && (s.age < filtres.ageMin || s.age > filtres.ageMax)) return false;
      if (s.distanceKm !== null && s.distanceKm > filtres.distanceMax) return false;
      if (filtres.intention && s.intention !== filtres.intention) return false;
      if (s.echo < filtres.echoMin) return false;
      return true;
    });
  }, [tousLesDemos, decisions, filtres]);

  const reels = useMemo(() => {
    const pool = data?.pool ?? [];
    return pool.filter((m) => !m.match && !decisions.par[m.id]).map((m) => reelVersSujet(m, tx));
  }, [data, decisions, tx]);

  /** Le nombre total proposé (compteur du bouton Filtres — nombre réel). */
  const nbProfils = useMemo(() => {
    const demosTotal = EST_STAGING
      ? tousLesDemos.filter((s) => {
          if (s.age !== null && (s.age < filtres.ageMin || s.age > filtres.ageMax)) return false;
          if (s.distanceKm !== null && s.distanceKm > filtres.distanceMax) return false;
          if (filtres.intention && s.intention !== filtres.intention) return false;
          if (s.echo < filtres.echoMin) return false;
          return true;
        }).length
      : 0;
    return demosTotal + (data?.pool.filter((m) => !m.match).length ?? 0);
  }, [tousLesDemos, data, filtres]);

  const pile = useMemo(() => [...demosVisibles, ...reels], [demosVisibles, reels]);
  const courant = pile[0] ?? null;
  const suivant = pile[1] ?? null;
  const quotaAtteint = compteur.a + compteur.p >= QUOTA_JOUR;

  // ---- Actions ----
  const vibre = (ms = 15): void => {
    try {
      navigator.vibrate?.(ms);
    } catch {
      /* pas de vibreur — silencieux */
    }
  };

  const avancer = useCallback((id: string, t: Decision, pastille?: string): void => {
    setDernier({ id, t });
    setSortie(t === 'like' ? 'd' : 'g');
    window.setTimeout(() => {
      setSortie(null);
      setDecisions((d) => {
        const par = { ...d.par };
        if (pastille) par[id] = { t, p: pastille };
        else par[id] = { t };
        return { date: aujourdhui(), par };
      });
      if (t === 'like' || t === 'pass') {
        setCompteur((c) => ({ date: aujourdhui(), a: c.a + (t === 'like' ? 1 : 0), p: c.p + (t === 'pass' ? 1 : 0) }));
      }
    }, 210);
  }, []);

  const aimer = useCallback(
    async (s: Sujet): Promise<void> => {
      if (occupes.has(s.id) || sortie) return;
      if (s.demo) {
        if (quotaAtteint) return;
        vibre(18);
        setBat(true);
        window.setTimeout(() => setBat(false), 320);
        if (s.likeRecu) {
          setMatch({ sujet: s, demo: true, raison: s.raisonMatch, phrases: s.phrasesMatch });
        }
        avancer(s.id, 'like');
        return;
      }
      // Membre RÉEL — le pas est l'action vraie (réversibles jusqu'au match).
      setOccupes((o) => new Set(o).add(s.id));
      try {
        const r = await faireUnPas(s.id);
        vibre(20);
        if (r.match) {
          setMatch({ sujet: s, demo: false, raison: null, phrases: [] });
        }
        avancer(s.id, 'like');
        await charger();
      } catch {
        setErreur(true);
      } finally {
        setOccupes((o) => {
          const n = new Set(o);
          n.delete(s.id);
          return n;
        });
      }
    },
    [occupes, sortie, quotaAtteint, avancer, charger],
  );

  const passer = useCallback(
    (s: Sujet, pastille?: string): void => {
      if (sortie) return;
      if (s.demo && quotaAtteint) return;
      avancer(s.id, 'pass', pastille);
      if (!pastille) {
        setRefus(true);
        window.setTimeout(() => setRefus(false), 6000);
      }
    },
    [sortie, quotaAtteint, avancer],
  );

  const retourArriere = useCallback((): void => {
    if (rewinds >= REWIND_JOUR || !dernier) return;
    const { id, t } = dernier;
    setDecisions((d) => {
      const par = { ...d.par };
      delete par[id];
      return { date: aujourdhui(), par };
    });
    setCompteur((c) => ({
      date: aujourdhui(),
      a: t === 'like' ? Math.max(0, c.a - 1) : c.a,
      p: t === 'pass' ? Math.max(0, c.p - 1) : c.p,
    }));
    setRewinds((n) => n + 1);
    setDernier(null);
  }, [rewinds, dernier]);

  const garder = useCallback((s: Sujet): void => {
    setDecisions((d) => ({ date: aujourdhui(), par: { ...d.par, [s.id]: { t: 'garde' } } }));
    setPlein(null);
  }, []);

  const envoyerQuestion = useCallback(
    async (s: Sujet, texte: string, carte: CarteRencontre): Promise<void> => {
      setQuestions((q) => ({
        date: aujourdhui(),
        n: q.n + 1,
        cibles: [...q.cibles, s.id],
      }));
      const liste = lireJSON<{ cible: string; carte: string; texte: string; dateA: string }[]>(
        'wairyu.ren.questionsListe',
        [],
      );
      ecrireJSON('wairyu.ren.questionsListe', [
        ...liste,
        { cible: s.id, carte: carte.titre, texte, dateA: new Date().toISOString() },
      ]);
      // « Ta question vaut un like » — membre réel : le pas part vraiment.
      if (!s.demo && !s.pasEnvoye) {
        try {
          await faireUnPas(s.id);
          await charger();
        } catch {
          setErreur(true);
        }
      }
      avancer(s.id, 'like');
    },
    [avancer, charger],
  );

  // ---- Le geste : glisser gauche/droite, tap = profil complet ----
  const [glisse, setGlisse] = useState(0);
  const depart = useRef<{ x: number; y: number; bouge: boolean } | null>(null);

  const onPointerDown = (e: React.PointerEvent): void => {
    if (sortie) return;
    // Les BOUTONS/liens/champs gèrent leurs propres gestes ; le texte et
    // les phrases restent des points de départ valides pour le glisser.
    if ((e.target as HTMLElement).closest('button, a, input, textarea')) {
      depart.current = null;
      return;
    }
    depart.current = { x: e.clientX, y: e.clientY, bouge: false };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent): void => {
    if (!depart.current || sortie) return;
    const dx = e.clientX - depart.current.x;
    const dy = e.clientY - depart.current.y;
    if (Math.abs(dx) > 8 || Math.abs(dy) > 8) depart.current.bouge = true;
    if (Math.abs(dx) > 8) setGlisse(dx);
    if (dy < -80 && depart.current.bouge && courant) {
      // Glisser vers le haut = profil complet.
      depart.current = null;
      setGlisse(0);
      setPlein(courant);
    }
  };
  const onPointerUp = (e: React.PointerEvent): void => {
    const d = depart.current;
    depart.current = null;
    const dx = e.clientX - (d?.x ?? e.clientX);
    setGlisse(0);
    if (!courant || sortie) return;
    if (d && !d.bouge) {
      // Un tap ouvre le profil complet — SAUF sur une phrase, un bouton ou
      // un lien : ces éléments gèrent leur propre geste.
      if (!(e.target as HTMLElement).closest('.dc-phrase, .dc-carte-resume, button, a, input, textarea, [role=button]')) {
        setPlein(courant);
      }
      return;
    }
    if (dx > 90) void aimer(courant);
    else if (dx < -90) passer(courant);
  };

  // ---- La bannière du Voyage (progression RÉELLE) ----
  const mondeEnCours = useMemo(() => {
    const entrees = Object.entries(progres.parMonde);
    for (const [code, p] of entrees) {
      if (p.total > 0 && p.faites < p.total) {
        return { code, restantes: Math.max(0, p.total - p.faites), num: Number(code.slice(1)) };
      }
    }
    return null;
  }, [progres.parMonde]);

  // Les phrases touchées sur les cartes ouvrent la feuille « Demander ».
  useEffect(() => {
    const h = (e: Event): void => {
      const detail = (e as CustomEvent<{ sujet: string; carte: string; phrase: string }>).detail;
      const s = [...tousLesDemos, ...(data?.pool.map((m) => reelVersSujet(m, tx)) ?? [])].find((x) => x.id === detail.sujet);
      const c = s?.cartes.find((x) => x.titre === detail.carte);
      if (s && c) setFeuille({ sujet: s, carte: c, phrase: detail.phrase });
    };
    window.addEventListener('wairyu.demander', h);
    return () => window.removeEventListener('wairyu.demander', h);
  }, [tousLesDemos, data, tx]);

  // ---- Chargement / erreur ----
  // En PRODUCTION, la porte jalon A reste la condition d'entrée : un compte
  // qui n'a pas traversé le Miroir voit l'écran honnête de la porte, pas la
  // pile (les démonstrations n'existent qu'en staging).
  if (!EST_STAGING && data !== null && !data.jalonA) {
    return <RencontresReelles />;
  }
  if (data === null && !erreur) {
    return (
      <div className="dc-zone">
        <EnTete nbProfils={0} onVoyage={() => (window.location.hash = '#/voyage')} onFiltres={() => {}} tx={tx} />
        <div className="dc-skel" aria-hidden="true">
          <div className="dc-skel-photo" />
          <div className="dc-skel-corps">
            <div className="dc-skel-ligne dc-skel-ligne-c" />
            <div className="dc-skel-ligne" />
            <div className="dc-skel-ligne" />
          </div>
        </div>
      </div>
    );
  }
  if (erreur) {
    return (
      <div className="dc-zone">
        <EnTete nbProfils={0} onVoyage={() => (window.location.hash = '#/voyage')} onFiltres={() => setFeuilleFiltres(true)} tx={tx} />
        <div className="dc-erreur" role="alert">
          {tx('Impossible de charger le deck — vérifie ta connexion.')}
          <br />
          <button type="button" className="dc-btn-plein" onClick={() => void charger()}>
            {tx('Réessayer')}
          </button>
        </div>
      </div>
    );
  }

  const garde = Object.entries(decisions.par)
    .filter(([, v]) => v.t === 'garde')
    .map(([id]) => tousLesDemos.find((d) => d.id === id))
    .filter((s): s is Sujet => !!s);

  return (
    <div className="dc-zone">
      <EnTete
        nbProfils={nbProfils}
        onVoyage={() => (window.location.hash = '#/voyage')}
        onFiltres={() => setFeuilleFiltres(true)}
        tx={tx}
      />

      {/* Les modes — Classique actif ; les autres « BIENTÔT », honnêtes. */}
      <div className="dc-modes" role="group" aria-label={tx('Mode de découverte')}>
        <button type="button" className="dc-mode dc-mode-actif" aria-pressed="true">
          {tx('Classique')}
        </button>
        <button type="button" className="dc-mode" disabled>
          {tx('Invisible')} <span className="dc-bientot">{tx('BIENTÔT')}</span>
        </button>
        <button type="button" className="dc-mode" disabled>
          {tx('Interracial')} <span className="dc-bientot">{tx('BIENTÔT')}</span>
        </button>
      </div>

      {/* Les onglets de l'espace — même style, sans soulignement isolé. */}
      <div className="dc-tabs" role="tablist" aria-label={tx('Espace Rencontres')}>
        <button type="button" role="tab" className="dc-tab" aria-selected={tab === 'decouvrir'} onClick={() => setTab('decouvrir')}>
          {tx('Découvrir')}
        </button>
        <button type="button" role="tab" className="dc-tab" aria-selected={tab === 'matchs'} onClick={() => setTab('matchs')}>
          {tx('Matchs')}
        </button>
        <button
          type="button"
          role="tab"
          className="dc-tab"
          aria-selected={false}
          onClick={() => (window.location.hash = '#/messages')}
        >
          {tx('Messages')}
        </button>
        <button type="button" role="tab" className="dc-tab" aria-selected={tab === 'profil'} onClick={() => setTab('profil')}>
          {tx('Profil')}
        </button>
      </div>

      {tab === 'decouvrir' && (
        <div className="dc-pane">
          {/* La bannière d'action — progression réelle du Voyage. */}
          {mondeEnCours && (
            <div className="dc-banner">
              <span>
                <strong>{tx('Monde {{n}} en cours', { n: mondeEnCours.num })}</strong>
                {' · '}
                {tx('{{n}} nouvelles cartes à gagner', { n: mondeEnCours.restantes })}
              </span>
              <button type="button" className="dc-banner-lien" onClick={() => (window.location.hash = '#/voyage')}>
                {tx('Voyage')} →
              </button>
            </div>
          )}

          {/* Le rappel des critères — cliquable, mène aux filtres. */}
          <button type="button" className="dc-compteur" style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => setFeuilleFiltres(true)}>
            {tx('{{ageMin}}–{{ageMax}} ans · {{km}} km autour de toi', { ageMin: filtres.ageMin, ageMax: filtres.ageMax, km: filtres.distanceMax })} · {' '}
            <strong>{nbProfils}</strong> {nbProfils === 1 ? tx('profil') : tx('profils')}
          </button>

          {courant === null ? (
            <EtatVide
              quotaAtteint={quotaAtteint}
              filtresActifs={
                filtres.ageMin !== 18 ||
                filtres.ageMax !== 60 ||
                filtres.distanceMax !== 100 ||
                filtres.intention !== '' ||
                filtres.echoMin !== 0
              }
              nbTotal={nbProfils}
              onVoyage={() => (window.location.hash = '#/voyage')}
              onFiltres={() => setFeuilleFiltres(true)}
              onRevoir={() => {
                setDecisions({ date: aujourdhui(), par: {} });
              }}
              tx={tx}
            />
          ) : (
            <>
              <div className="dc-scene">
                {suivant && (
                  <div className="dc-card" style={{ position: 'absolute', inset: '10px 14px 0', transform: 'scale(0.95) translateY(12px)', opacity: 0.6 }} aria-hidden="true">
                    <ApercuCarte sujet={suivant} tx={tx} />
                  </div>
                )}
                <div
                  className={`dc-card ${sortie === 'd' ? 'dc-card-sortie-d' : ''} ${sortie === 'g' ? 'dc-card-sortie-g' : ''}`}
                  style={glisse !== 0 ? { transform: `translateX(${glisse}px) rotate(${glisse / 28}deg)` } : undefined}
                  onPointerDown={onPointerDown}
                  onPointerMove={onPointerMove}
                  onPointerUp={onPointerUp}
                  role="article"
                  aria-label={`${courant.prenom}${courant.age !== null ? `, ${courant.age}` : ''}`}
                >
                  <span className="dc-tampon dc-tampon-non" style={{ opacity: glisse < -60 ? 1 : 0 }}>
                    {tx('NON')}
                  </span>
                  <span className="dc-tampon dc-tampon-oui" style={{ opacity: glisse > 60 ? 1 : 0 }}>
                    {tx('OUI')}
                  </span>
                  <ApercuCarte sujet={courant} tx={tx} demo={EST_STAGING} />
                </div>
              </div>

              {/* La devise — gravée sous la pile, jamais payante. */}
              <p className="dc-devise">{tx('Ce ne sont pas des notes — jamais de score, jamais de classement. La rencontre n\u2019est jamais payante.')}</p>
              {EST_STAGING && (
                <p className="dc-compteur">
                  <strong>{Math.min(compteur.a + compteur.p, QUOTA_JOUR)}</strong> {tx('sur')} {QUOTA_JOUR} {tx('aujourd\u2019hui')} ·{' '}
                  {rewinds}/{REWIND_JOUR} {tx('retours arrière')}
                  {dernier && rewinds < REWIND_JOUR && (
                    <button type="button" className="dc-banner-lien" onClick={retourArriere} style={{ marginLeft: 8 }}>
                      ↺ {tx('Retour arrière')}
                    </button>
                  )}
                </p>
              )}

              {refus && (
                <div className="dc-refus">
                  <button type="button" onClick={() => courant && passer(courant, tx('Trop loin'))}>
                    {tx('Trop loin')}
                  </button>
                  <button type="button" onClick={() => courant && passer(courant, tx('Pas la même intention'))}>
                    {tx('Pas la même intention')}
                  </button>
                  <button type="button" onClick={() => courant && passer(courant, tx('Autre chose'))}>
                    {tx('Autre chose')}
                  </button>
                </div>
              )}
            </>
          )}

          {/* La barre d'actions FIXE — UNE seule paire (réf. 2). */}
          <div className="dc-actions" style={courant === null ? { position: 'static' } : undefined}>
            <div className="dc-actions-rangee">
              <button
                type="button"
                className="dc-btn-rond dc-passer"
                aria-label={tx('Passer')}
                disabled={courant === null || (courant.demo && quotaAtteint)}
                onClick={() => courant && passer(courant)}
              >
                <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
              <button
                type="button"
                className="dc-demander"
                disabled={courant === null}
                onClick={() => {
                  if (!courant) return;
                  const c =
                    courant.cartes[0] ??
                    // Membre réel sans cartes encore révélées : la feuille
                    // cite son voyage (honnête — D-R3, rien d'inventé).
                    {
                      monde: 'M1',
                      titre: tx('Son voyage'),
                      sousTitre: '',
                      resume:
                        tx('{{n}} monde(s) franchi(s)', { n: courant.mondeFranchisN }) +
                        (courant.mondeEnCoursNom ? ' · ' + courant.mondeEnCoursNom : ''),
                      phrases: [],
                    };
                  setFeuille({ sujet: courant, carte: c, phrase: null });
                }}
              >
                <svg viewBox="0 0 24 24" width={20} height={20} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9 9 0 0 1-3.8-.8L3 20l1-4.9a8.4 8.4 0 1 1 17-3.6z" />
                </svg>
                {tx('Demander')}
              </button>
              <button
                type="button"
                className={`dc-btn-rond dc-aimer ${bat ? 'bat' : ''}`}
                aria-label={tx('Aimer')}
                disabled={courant === null || (courant.demo && quotaAtteint) || courant.pasEnvoye}
                onClick={() => courant && void aimer(courant)}
              >
                <svg viewBox="0 0 24 24" width={23} height={23} fill="currentColor" aria-hidden="true">
                  <path d="M12 21s-7.5-4.7-9.8-9.2C.7 8.6 2.6 5 6 5c2 0 3.4 1.1 4.2 2.3L12 9l1.8-1.7C14.6 6.1 16 5 18 5c3.4 0 5.3 3.6 3.8 6.8C19.5 16.3 12 21 12 21z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {tab === 'matchs' && <RencontresReelles />}

      {tab === 'profil' && (
        <div className="dc-pane">
          <ProfilPane garde={garde} questions={questions.n} filtres={filtres} onFiltres={() => setFeuilleFiltres(true)} onRemettre={(id) => setDecisions((d) => {
            const par = { ...d.par };
            delete par[id];
            return { date: aujourdhui(), par };
          })} tx={tx} />
        </div>
      )}

      {/* ---- Les feuilles et écrans ---- */}
      {feuilleFiltres && (
        <FeuilleFiltres
          filtres={filtres}
          nbResultats={nbProfils}
          onChange={setFiltres}
          onReinitialiser={() => setFiltres(FILTRES_DEFAUT)}
          onAppliquer={() => setFeuilleFiltres(false)}
          onClose={() => setFeuilleFiltres(false)}
        />
      )}
      {feuille && (
        <FeuilleDemander
          sujet={feuille.sujet}
          carte={feuille.carte}
          phrase={feuille.phrase}
          restantes={QUESTIONS_JOUR - questions.n}
          onClose={() => setFeuille(null)}
          onEnvoye={(texte, carte) => void envoyerQuestion(feuille.sujet, texte, carte)}
        />
      )}
      {plein && (
        <ProfilComplet
          sujet={plein}
          onClose={() => setPlein(null)}
          onDemander={(carte, phrase) => {
            setFeuille({ sujet: plein, carte, phrase });
            setPlein(null);
          }}
          onAimer={() => {
            const s = plein;
            setPlein(null);
            if (s) void aimer(s);
          }}
          onPasser={() => {
            const s = plein;
            setPlein(null);
            if (s) passer(s);
          }}
          onGarder={() => garder(plein)}
          onMenu={() => setMenu(true)}
          aDejaLike={plein.pasEnvoye}
        />
      )}
      {menu && plein && (
        <div className="dc-menu" style={{ position: 'fixed', top: 70, right: 16, maxWidth: 460 }}>
          <button type="button" onClick={() => { garder(plein); setMenu(false); }}>
            {tx('Garder pour plus tard')}
          </button>
          <button type="button" onClick={() => { avancer(plein.id, 'cache'); setPlein(null); setMenu(false); }}>
            {tx('Masquer ce profil')}
          </button>
          <button
            type="button"
            className="danger"
            onClick={() => { avancer(plein.id, 'cache'); setPlein(null); setMenu(false); }}
          >
            {tx('Signaler — tu ne verras plus ce profil')}
          </button>
        </div>
      )}
      {match && (
        <EcranMatch
          sujet={match.sujet}
          demo={match.demo}
          raison={match.raison}
          phrases={match.phrases}
          initialeToi={initialeToi ?? '·'}
          photoToi={null}
          onDire={() => {
            setMatch(null);
            window.location.hash = '#/messages';
          }}
          onPlusTard={() => setMatch(null)}
        />
      )}
    </div>
  );
}

/* ===================================================================== */
/* L'en-tête de l'espace : Voyage · Rencontres · Filtres (réf. 4)         */
/* ===================================================================== */
type Tx = (s: string, p?: Record<string, string | number>) => string;

function EnTete({ nbProfils, onVoyage, onFiltres, tx }: { nbProfils: number; onVoyage: () => void; onFiltres: () => void; tx: Tx }) {
  return (
    <div className="dc-header">
      <button type="button" className="dc-voyage-btn" onClick={onVoyage}>
        <svg viewBox="0 0 24 24" width={17} height={17} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2z" />
          <path d="M9 4v14M15 6v14" />
        </svg>
        {tx('Voyage')}
      </button>
      <h1 className="dc-titre-espace">{tx('Rencontres')}</h1>
      <button type="button" className="dc-filtres-btn" onClick={onFiltres} aria-label={tx('Filtres — {{n}} profils', { n: nbProfils })}>
        <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" aria-hidden="true">
          <path d="M4 7h10M18 7h2M4 17h2M10 17h10" />
          <circle cx="16" cy="7" r="2.2" />
          <circle cx="8" cy="17" r="2.2" />
        </svg>
        {nbProfils > 0 && (
          <span className="dc-filtres-n">
            {nbProfils} {tx('profils')}
          </span>
        )}
      </button>
    </div>
  );
}

/* ===================================================================== */
/* L'aperçu carte — photo + corps clair + 3 cartes (réf. 4)               */
/* ===================================================================== */
function ApercuCarte({ sujet, tx, demo = false }: { sujet: Sujet; tx: Tx; demo?: boolean }) {
  const [photoKo, setPhotoKo] = useState(false);
  return (
    <>
      <div className="dc-photo">
        {sujet.photo && !photoKo ? (
          <img
            src={sujet.photo}
            alt={tx('Photo de {{prenom}}', { prenom: sujet.prenom })}
            onError={() => setPhotoKo(true)}
          />
        ) : (
          <div className="dc-silhouette" aria-hidden="true" />
        )}
        {!sujet.photo && sujet.initiale && <span className="dc-initiale">{sujet.initiale}</span>}
        <div className="dc-photo-pills">
          {demo && sujet.demo && <span className="dc-pill dc-pill-demo">{tx('Profil de démonstration')}</span>}
          {!sujet.demo && <span className="dc-pill dc-pill-demo">{tx('Membre du voyage')}</span>}
          {sujet.echo >= 2 ? (
            <span className="dc-pill dc-pill-perle">{tx('Perle rare')}</span>
          ) : sujet.echo === 1 ? (
            <span className="dc-pill dc-pill-echo">{tx('1 en écho avec toi')}</span>
          ) : null}
        </div>
      </div>

      <div className="dc-corps">
        <div className="dc-nom-ligne">
          <span className="dc-nom">{sujet.prenom}</span>
          {sujet.age !== null && <span className="dc-age">{sujet.age}</span>}
          {sujet.verifie && (
            <span className="dc-verifie">
              <svg viewBox="0 0 24 24" width={15} height={15} fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20 6L9 17l-5-5" />
              </svg>
              {tx('Vérifié')}
            </span>
          )}
        </div>
        <div className="dc-meta">
          {sujet.ville && (
            <span>
              {sujet.ville}
              {sujet.distanceKm !== null ? ` · ${tx('{{n}} km', { n: sujet.distanceKm })}` : ''}
            </span>
          )}
          {sujet.metier && <span>{sujet.metier}</span>}
          {sujet.reel && (
            <span>
              {tx('{{n}} monde(s) franchi(s)', { n: sujet.mondeFranchisN })}
              {sujet.mondeEnCoursNom ? ` · ${sujet.mondeEnCoursNom}` : ''}
            </span>
          )}
        </div>
        {sujet.intention && <span className="dc-intention">{tx('Cherche : {{intention}}', { intention: sujet.intention })}</span>}

        {sujet.raison && (
          <p className="dc-raison">
            <span className="dc-raison-titre">{tx('Pourquoi vous voit-on ?')}</span>
            {sujet.raison}
          </p>
        )}

        {/* Les 3 cartes — monde en petites majuscules teal, titre serif,
            résumé à la TROISIÈME personne, bande colorée du monde. */}
        {sujet.cartes.length > 0 && (
          <div className="dc-cartes">
            {sujet.cartes.map((c) => (
              <CarteDeck key={c.titre} sujet={sujet} carte={c} tx={tx} />
            ))}
            <div className="dc-verrou">
              <span className="dc-verrou-ico" aria-hidden="true">
                <svg viewBox="0 0 24 24" width={14} height={14} fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
                  <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
                </svg>
              </span>
              {tx('{{n}} cartes se révèlent en discutant', { n: sujet.cartesCachees.length })}
            </div>
          </div>
        )}

        {/* Membre réel : l'honnêteté du voyage — ce que le serveur ne
            livre pas ne s'invente pas (D-R3). */}
        {sujet.reel && sujet.cartes.length === 0 && (
          <p className="dc-raison">
            <span className="dc-raison-titre">{tx('Son voyage')}</span>
            {tx('Ses cartes de personnalité apparaîtront quand son voyage les révélera — jamais de profil inventé.')}
          </p>
        )}
      </div>
    </>
  );
}

/** Une carte de la carte — phrases touchables + bouton Demander. */
function CarteDeck({ sujet, carte, tx }: { sujet: Sujet; carte: CarteRencontre; tx: Tx }) {
  const [phraseSur, setPhraseSur] = useState<string | null>(null);
  return (
    <article className="dc-carte" style={{ ['--bande' as string]: BANDES_MONDES[carte.monde] ?? '#2BA9A9' }}>
      <p className="dc-carte-monde">{nomMonde(carte.monde).toUpperCase()}</p>
      <h4 className="dc-carte-titre">{carte.titre}</h4>
      <p className="dc-carte-resume">
        {carte.phrases.map((p) => (
          <Fragment key={p}>
          <span
            className={`dc-phrase ${phraseSur === p ? 'dc-phrase-sur' : ''}`}
            role="button"
            tabIndex={0}
            aria-pressed={phraseSur === p}
            onClick={(e) => {
              e.stopPropagation();
              setPhraseSur(p);
              try {
                navigator.vibrate?.(8);
              } catch {
                /* silencieux */
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setPhraseSur(p);
              }
            }}
          >
            {p}
          </span>
          {' '}
          </Fragment>
        ))}
      </p>
      {phraseSur && (
        <div className="dc-carte-cta">
          <button
            type="button"
            className="dc-demander-mini"
            onClick={(e) => {
              e.stopPropagation();
              window.dispatchEvent(new CustomEvent('wairyu.demander', { detail: { sujet: sujet.id, carte: carte.titre, phrase: phraseSur } }));
            }}
          >
            <svg viewBox="0 0 24 24" width={16} height={16} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9 9 0 0 1-3.8-.8L3 20l1-4.9a8.4 8.4 0 1 1 17-3.6z" />
            </svg>
            {tx('Demander à {{prenom}}', { prenom: sujet.prenom })}
          </button>
        </div>
      )}
    </article>
  );
}

/* ===================================================================== */
/* Les états vides — honnêtes, jamais de faux profil (§7)                 */
/* ===================================================================== */
function EtatVide({
  quotaAtteint,
  filtresActifs,
  nbTotal,
  onVoyage,
  onFiltres,
  onRevoir,
  tx,
}: {
  quotaAtteint: boolean;
  filtresActifs: boolean;
  nbTotal: number;
  onVoyage: () => void;
  onFiltres: () => void;
  onRevoir: () => void;
  tx: Tx;
}) {
  const heureRenouvellement = '20 h';
  return (
    <div className="dc-vide">
      <span className="dc-vide-emoji" aria-hidden="true">
        🌱
      </span>
      {quotaAtteint ? (
        <>
          <h3>{tx('C\u2019est tout pour aujourd\u2019hui')}</h3>
          <p>{tx('La pile se renouvelle vers {{heure}} — en attendant, ton voyage continue de gagner des cartes.', { heure: heureRenouvellement })}</p>
        </>
      ) : filtresActifs ? (
        <>
          <h3>{tx('Rien avec ces filtres')}</h3>
          <p>{tx('Élargis un peu : chaque filtre en moins ramène environ {{n}} profils.', { n: nbTotal })}</p>
        </>
      ) : (
        <>
          <h3>{tx('C\u2019est tout pour l\u2019instant')}</h3>
          <p>{tx('La pile se renouvelle vers {{heure}}. Jamais de profil inventé : les personnes arrivent en franchissant le Miroir, comme toi.', { heure: heureRenouvellement })}</p>
        </>
      )}
      <div className="dc-vide-actions">
        <button type="button" className="dc-btn-plein" onClick={onVoyage}>
          {tx('Gagner des cartes dans le Voyage')}
        </button>
        {filtresActifs && (
          <button type="button" className="dc-btn-fantome" onClick={onFiltres}>
            {tx('Élargir mes filtres')}
          </button>
        )}
        {!quotaAtteint && !filtresActifs && (
          <button type="button" className="dc-btn-fantome" onClick={onRevoir}>
            {tx('Revoir les profils passés aujourd\u2019hui')}
          </button>
        )}
      </div>
    </div>
  );
}

/* ===================================================================== */
/* L'onglet Profil in-espace — ton profil, à revoir, tes questions        */
/* ===================================================================== */
function ProfilPane({
  garde,
  questions,
  filtres,
  onFiltres,
  onRemettre,
  tx,
}: {
  garde: Sujet[];
  questions: number;
  filtres: Filtres;
  onFiltres: () => void;
  onRemettre: (id: string) => void;
  tx: Tx;
}) {
  return (
    <div>
      <div className="dc-banner" style={{ marginTop: 12 }}>
        <span>
          {tx('Tes critères : {{ageMin}}–{{ageMax}} ans · {{km}} km autour de toi', {
            ageMin: filtres.ageMin,
            ageMax: filtres.ageMax,
            km: filtres.distanceMax,
          })}
        </span>
        <button type="button" className="dc-banner-lien" onClick={onFiltres}>
          {tx('Modifier')}
        </button>
      </div>
      <div className="dc-vide">
        <h3>{tx('À revoir ({{n}})', { n: garde.length })}</h3>
        {garde.length === 0 ? (
          <p>{tx('Les profils gardés pour plus tard attendront ici — remets-les dans la pile quand tu veux.')}</p>
        ) : (
          <div className="dc-vide-actions">
            {garde.map((s) => (
              <button key={s.id} type="button" className="dc-btn-fantome" onClick={() => onRemettre(s.id)}>
                {s.prenom} — {tx('remettre dans la pile')}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="dc-vide">
        <h3>{tx('Tes questions ({{n}} aujourd\u2019hui)', { n: questions })}</h3>
        <p>{tx('Une question par profil avant le match — ta question vaut un like. Si la personne répond, la conversation s\u2019ouvre.')}</p>
      </div>
      <div className="dc-vide">
        <h3>{tx('Ta vitrine')}</h3>
        <p>{tx('Tes propres cartes restent à la deuxième personne — elles vivent dans ta récolte.')}</p>
        <div className="dc-vide-actions">
          <a className="dc-btn-plein" style={{ textDecoration: 'none' }} href="#/recolte">
            {tx('Ouvrir ma récolte')}
          </a>
          <a className="dc-btn-fantome" style={{ textDecoration: 'none' }} href="#/portrait">
            {tx('Voir mon portrait')}
          </a>
        </div>
      </div>
    </div>
  );
}
