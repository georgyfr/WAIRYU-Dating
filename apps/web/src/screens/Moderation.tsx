/**
 * Console de MODÉRATION (Task 109) — #/admin, page hors navigation,
 * indépendante de la session utilisateur (comme #/prototype-resultats).
 *
 * Accès : jeton ADMIN_TOKEN saisi une fois par onglet (sessionStorage —
 * meurt à la fermeture). Outil interne du fondateur : libellés FR uniquement.
 *
 * Sections (Task 115-b) : aperçu (compteurs), signalements (filtre statut +
 * trancher + POSER UNE MESURE N1/N2 + accès média tracé), blocages, APPELS
 * (file des relectures — accepter = lever la sanction). Chaque décision est
 * tracée côté API dans audit_admin (M-2) ; aucune mesure n'est automatique
 * (M-4) : chaque pose/levée passe par une confirmation humaine ici.
 */
import { useCallback, useEffect, useState } from 'react';
import {
  ErreurAdmin,
  chargerApercu,
  chargerBlocages,
  chargerSignalements,
  fetchAppels,
  fetchMediaBlob,
  fetchMediasDuMatch,
  jetonAdmin,
  poserJetonAdmin,
  poserSanction,
  retirerJetonAdmin,
  trancherAppel,
  trancherSignalement,
  type AppelAdmin,
  type Apercu,
  type BlocageAdmin,
  type MediaAdmin,
  type SignalementAdmin,
} from '../lib/admin-client';

type FiltreStatut = 'ouvert' | 'traite' | 'rejete' | 'tous';

const MOTIFS: Record<string, string> = {
  escroquerie_ou_argent: 'Escroquerie ou demande d\u2019argent',
  harcelement: 'Harcèlement',
  faux_profil: 'Faux profil',
  contenu_inapproprie: 'Contenu inapproprié',
  fetichisant: 'Comportement fétichisant',
  autre: 'Autre',
};

const STATUTS_LIBELLES: Record<SignalementAdmin['statut'], string> = {
  ouvert: 'Ouvert',
  traite: 'Traité',
  rejete: 'Rejeté',
};

const APPEL_STATUTS: Record<AppelAdmin['statut'], string> = {
  ouvert: 'Ouvert',
  accepte: 'Accepté',
  rejete: 'Rejeté',
};

function dateFr(iso: string | null): string {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' });
  } catch {
    return iso;
  }
}

function idCourt(id: string): string {
  return id.length > 8 ? `${id.slice(0, 8)}…` : id;
}

function tailleFr(octets: number): string {
  return octets >= 1024 * 1024 ? `${(octets / (1024 * 1024)).toFixed(1)} Mo` : `${Math.max(1, Math.round(octets / 1024))} Ko`;
}

/** Petit compteur du tableau de bord. */
function Carte({ valeur, libelle, alerte }: { valeur: number; libelle: string; alerte?: boolean }) {
  return (
    <div className={`adm-carte${alerte && valeur > 0 ? ' adm-carte-alerte' : ''}`}>
      <span className="adm-carte-valeur">{valeur}</span>
      <span className="adm-carte-libelle">{libelle}</span>
    </div>
  );
}

/**
 * LES MÉDIAS D'UN MATCH SIGNALÉ (E3-P9 / G-MA-P6) — le seul cas d'accès
 * humain aux médias, tracé audit_admin côté serveur À CHAQUE ouverture.
 * Le flux passe par fetchMediaBlob (Bearer + createObjectURL) : un
 * <img src> direct ne porterait pas le jeton.
 */
function MediasDuMatch({ matchId }: { matchId: string }) {
  const [ouvert, setOuvert] = useState(false);
  const [charge, setCharge] = useState(false);
  const [err, setErr] = useState('');
  const [medias, setMedias] = useState<MediaAdmin[] | null>(null);
  /** médiaId → URL blob locale (révoquée à la fermeture de la liste). */
  const [urls, setUrls] = useState<Record<string, string>>({});
  const [lectureEnCours, setLectureEnCours] = useState<string | null>(null);

  const chargeMedias = async (): Promise<void> => {
    setCharge(true);
    setErr('');
    try {
      const r = await fetchMediasDuMatch(matchId);
      setMedias(r.medias);
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Erreur inconnue.');
    } finally {
      setCharge(false);
    }
  };

  const bascule = (): void => {
    if (ouvert) {
      for (const u of Object.values(urls)) URL.revokeObjectURL(u);
      setUrls({});
      setOuvert(false);
      return;
    }
    setOuvert(true);
    if (medias === null) void chargeMedias();
  };

  const lit = async (id: string): Promise<void> => {
    if (urls[id]) return;
    setLectureEnCours(id);
    setErr('');
    try {
      const url = await fetchMediaBlob(id);
      setUrls((prev) => ({ ...prev, [id]: url }));
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Erreur inconnue.');
    } finally {
      setLectureEnCours(null);
    }
  };

  return (
    <div className="adm-medias">
      <button className="adm-medias-toggle" onClick={bascule} aria-expanded={ouvert}>
        {ouvert ? 'Masquer les médias' : 'Voir les médias de la conversation'}
      </button>
      {ouvert && (
        <>
          <p className="adm-medias-avis">Accès média tracé (audit_admin)</p>
          {charge && <p className="adm-attente">Chargement…</p>}
          {err && <p className="adm-erreur" role="alert">{err}</p>}
          {medias !== null && medias.length === 0 && <p className="adm-vide">Aucun média dans ce match.</p>}
          {medias !== null && medias.length > 0 && (
            <ul className="adm-liste adm-liste-medias">
              {medias.map((m) => (
                <li key={m.id} className="adm-item adm-media">
                  <div className="adm-item-tete">
                    <span className={`adm-badge adm-badge-${m.type === 'voix' ? 'voix' : 'photo'}`}>
                      {m.type === 'voix' ? 'Voix' : 'Photo'}
                    </span>
                    <span className="adm-media-auteur">{m.auteur}</span>
                    <span className="adm-date">
                      {m.type === 'voix' && m.dureeS ? `${m.dureeS} s · ` : ''}
                      {tailleFr(m.octets)} · {dateFr(m.creeA)}
                    </span>
                  </div>
                  {!urls[m.id] && (
                    <button
                      className="btn btn-accent adm-media-btn"
                      disabled={lectureEnCours === m.id}
                      onClick={() => void lit(m.id)}
                    >
                      {lectureEnCours === m.id ? 'Ouverture…' : 'Ouvrir (tracé)'}
                    </button>
                  )}
                  {urls[m.id] &&
                    (m.type === 'voix' ? (
                      <audio controls src={urls[m.id]} preload="metadata" />
                    ) : (
                      <img className="adm-media-img" src={urls[m.id]} alt={`Média ${m.id}`} />
                    ))}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

export default function Moderation() {
  const [phase, setPhase] = useState<'verif' | 'saisie' | 'ok'>(jetonAdmin() ? 'verif' : 'saisie');
  const [jetonSaisi, setJetonSaisi] = useState('');
  const [err, setErr] = useState('');
  const [charge, setCharge] = useState(false);
  const [actionEnCours, setActionEnCours] = useState<string | null>(null);
  const [apercu, setApercu] = useState<Apercu | null>(null);
  const [vue, setVue] = useState<'signalements' | 'blocages' | 'appels'>('signalements');
  const [filtre, setFiltre] = useState<FiltreStatut>('ouvert');
  const [signalements, setSignalements] = useState<SignalementAdmin[]>([]);
  const [blocages, setBlocages] = useState<BlocageAdmin[]>([]);
  const [appels, setAppels] = useState<AppelAdmin[]>([]);
  /** Le signalement dont le choix de mesure est déplié (N1 / N2). */
  const [mesureOuverte, setMesureOuverte] = useState<string | null>(null);

  /** Charge l'aperçu + la liste courante. Retourne false si le jeton est refusé. */
  const chargerTout = useCallback(async (): Promise<boolean> => {
    setCharge(true);
    setErr('');
    try {
      const a = await chargerApercu();
      setApercu(a.apercu);
      if (vue === 'signalements') {
        const s = await chargerSignalements(filtre);
        setSignalements(s.signalements);
      } else if (vue === 'appels') {
        const al = await fetchAppels('ouvert');
        setAppels(al.appels);
      } else {
        const b = await chargerBlocages();
        setBlocages(b.blocages);
      }
      return true;
    } catch (e) {
      if (e instanceof ErreurAdmin && (e.statut === 401 || e.statut === 503 || e.statut === 0)) {
        retirerJetonAdmin();
        setPhase('saisie');
        setErr(e.statut === 503 ? 'ADMIN_TOKEN non configuré côté serveur.' : 'Jeton refusé ou réseau injoignable.');
      } else {
        setErr(e instanceof Error ? e.message : 'Erreur inconnue.');
      }
      return false;
    } finally {
      setCharge(false);
    }
  }, [vue, filtre]);

  // Vérification du jeton au montage (silencieuse).
  useEffect(() => {
    if (phase === 'verif') void chargerTout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Rechargement de la liste quand la vue ou le filtre changent.
  useEffect(() => {
    if (phase === 'ok') void chargerTout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vue, filtre]);

  const ouvrirConsole = async () => {
    if (!jetonSaisi.trim()) {
      setErr('Saisis le jeton admin.');
      return;
    }
    poserJetonAdmin(jetonSaisi);
    setJetonSaisi('');
    setPhase('verif');
    const ok = await chargerTout();
    if (ok) setPhase('ok');
  };

  const trancher = async (id: string, statut: 'traite' | 'rejete') => {
    setActionEnCours(id);
    setErr('');
    try {
      await trancherSignalement(id, statut);
      await chargerTout();
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Erreur inconnue.');
    } finally {
      setActionEnCours(null);
    }
  };

  /**
   * POSER UNE MESURE (G-MA-1) — décision humaine double : le choix N1/N2
   * puis la confirmation. Liée au signalement (traçabilité M-2). 409 = une
   * sanction est déjà active — le message serveur (neutre) est affiché.
   */
  const poserMesure = async (s: SignalementAdmin, niveau: 1 | 2) => {
    const texte = niveau === 1
      ? 'Poser N1 « Pause Rencontre » sur ce compte ? Il sort du pool et ne peut plus écrire — relecture possible de son côté.'
      : 'Poser N2 « Pause complète » sur ce compte ? Ses sessions seront refusées à la prochaine requête — réservé aux cas graves.';
    if (!window.confirm(texte)) return;
    setActionEnCours(s.id);
    setErr('');
    try {
      await poserSanction(s.contre, niveau, s.id, s.detail);
      setMesureOuverte(null);
      await chargerTout();
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Erreur inconnue.');
    } finally {
      setActionEnCours(null);
    }
  };

  /**
   * TRANCHER UN APPEL (G-MA-3) — « accepte » LÈVE la sanction (M-5 : toute
   * sanction est révocable, zéro trace pour les autres — G-MA-6).
   */
  const trancherAppelId = async (id: string, decision: 'accepte' | 'rejete') => {
    const texte = decision === 'accepte'
      ? 'Accepter cet appel ? La sanction est LEVÉE immédiatement (sans trace pour les autres).'
      : 'Rejeter cet appel ? La sanction reste en place.';
    if (!window.confirm(texte)) return;
    setActionEnCours(id);
    setErr('');
    try {
      await trancherAppel(id, decision);
      await chargerTout();
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Erreur inconnue.');
    } finally {
      setActionEnCours(null);
    }
  };

  const deconnecter = () => {
    retirerJetonAdmin();
    setApercu(null);
    setSignalements([]);
    setBlocages([]);
    setAppels([]);
    setPhase('saisie');
  };

  // ---- Porte : saisie du jeton ----
  if (phase !== 'ok') {
    return (
      <main className="adm-racine">
        <div className="adm-porte">
          <h1 className="adm-titre">WAIRYU · Modération</h1>
          <p className="adm-sous-titre">Console interne — accès par jeton administrateur.</p>
          {phase === 'verif' && <p className="adm-attente">Vérification du jeton…</p>}
          {phase === 'saisie' && (
            <form
              className="adm-form"
              onSubmit={(e) => {
                e.preventDefault();
                void ouvrirConsole();
              }}
            >
              <input
                className="adm-champ"
                type="password"
                autoComplete="off"
                placeholder="Jeton ADMIN_TOKEN"
                value={jetonSaisi}
                onChange={(e) => setJetonSaisi(e.target.value)}
                aria-label="Jeton administrateur"
              />
              <button className="btn btn-primary" type="submit" disabled={!jetonSaisi.trim()}>
                Ouvrir la console
              </button>
            </form>
          )}
          {err && <p className="adm-erreur" role="alert">{err}</p>}
        </div>
      </main>
    );
  }

  // ---- Console ----
  return (
    <main className="adm-racine">
      <header className="adm-entete">
        <div>
          <h1 className="adm-titre">WAIRYU · Modération</h1>
          <p className="adm-sous-titre">{charge ? 'Chargement…' : 'Outil interne — chaque décision est tracée.'}</p>
        </div>
        <div className="adm-entete-actions">
          <button className="btn" onClick={() => void chargerTout()} disabled={charge}>
            Actualiser
          </button>
          <button className="btn" onClick={deconnecter}>
            Fermer
          </button>
        </div>
      </header>

      {err && <p className="adm-erreur" role="alert">{err}</p>}

      {apercu && (
        <section className="adm-apercu" aria-label="Aperçu">
          <Carte valeur={apercu.signalementsOuverts} libelle="Signalements ouverts" alerte />
          <Carte valeur={apercu.signalementsTraités} libelle="Traités" />
          <Carte valeur={apercu.signalementsRejetés} libelle="Rejetés" />
          <Carte valeur={apercu.signalements7j} libelle="Signalements 7 j" />
          <Carte valeur={apercu.blocages7j} libelle="Blocages 7 j" />
          <Carte valeur={apercu.blocagesTotal} libelle="Blocages total" />
          <Carte valeur={apercu.messages24h} libelle="Messages 24 h" />
          <Carte valeur={apercu.matchsTotal} libelle="Matchs total" />
        </section>
      )}

      <nav className="adm-vues" aria-label="Sections">
        <button
          className={`adm-vue${vue === 'signalements' ? ' adm-vue-active' : ''}`}
          onClick={() => setVue('signalements')}
        >
          Signalements
        </button>
        <button className={`adm-vue${vue === 'appels' ? ' adm-vue-active' : ''}`} onClick={() => setVue('appels')}>
          Appels
        </button>
        <button className={`adm-vue${vue === 'blocages' ? ' adm-vue-active' : ''}`} onClick={() => setVue('blocages')}>
          Blocages
        </button>
      </nav>

      {vue === 'signalements' && (
        <>
          <div className="adm-filtres" role="group" aria-label="Filtrer par statut">
            {(['ouvert', 'traite', 'rejete', 'tous'] as FiltreStatut[]).map((s) => (
              <button
                key={s}
                className={`adm-filtre${filtre === s ? ' adm-filtre-active' : ''}`}
                onClick={() => setFiltre(s)}
              >
                {s === 'tous' ? 'Tous' : STATUTS_LIBELLES[s]}
              </button>
            ))}
          </div>

          {signalements.length === 0 && !charge && (
            <p className="adm-vide">Aucun signalement dans ce filtre — tout va bien.</p>
          )}

          <ul className="adm-liste">
            {signalements.map((s) => (
              <li key={s.id} className="adm-item">
                <div className="adm-item-tete">
                  <span className={`adm-badge adm-badge-${s.statut}`}>{MOTIFS[s.motif] ?? s.motif}</span>
                  <span className={`adm-statut adm-statut-${s.statut}`}>{STATUTS_LIBELLES[s.statut]}</span>
                  <span className="adm-date">{dateFr(s.creeA)}</span>
                </div>
                <p className="adm-ligne">
                  <strong>{s.pseudoContre ?? idCourt(s.contre)}</strong> est signalé par{' '}
                  {s.pseudoDe ?? idCourt(s.de)}
                </p>
                {s.detail && <p className="adm-detail">« {s.detail} »</p>}
                {s.matchId && <p className="adm-ctx">Conversation : {idCourt(s.matchId)}</p>}
                {s.statut === 'ouvert' && (
                  <>
                    <div className="adm-actions">
                      <button
                        className="btn btn-primary"
                        disabled={actionEnCours === s.id}
                        onClick={() => void trancher(s.id, 'traite')}
                      >
                        {actionEnCours === s.id ? '…' : 'Marquer traité'}
                      </button>
                      <button
                        className="btn btn-accent"
                        disabled={actionEnCours === s.id}
                        onClick={() => void trancher(s.id, 'rejete')}
                      >
                        {actionEnCours === s.id ? '…' : 'Rejeter'}
                      </button>
                      <button
                        className="btn"
                        aria-expanded={mesureOuverte === s.id}
                        onClick={() => setMesureOuverte((v) => (v === s.id ? null : s.id))}
                      >
                        Poser une mesure
                      </button>
                    </div>
                    {mesureOuverte === s.id && (
                      <div className="adm-mesures" role="group" aria-label="Choisir la mesure">
                        <p className="adm-ctx">
                          Aucune mesure automatique — la pose est manuelle, confirmée, révocable (appel du compte).
                        </p>
                        <div className="adm-actions">
                          <button
                            className="btn"
                            disabled={actionEnCours === s.id}
                            onClick={() => void poserMesure(s, 1)}
                          >
                            N1 · Pause Rencontre
                          </button>
                          <button
                            className="btn btn-danger-admin"
                            disabled={actionEnCours === s.id}
                            onClick={() => void poserMesure(s, 2)}
                          >
                            N2 · Pause complète
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
                {s.matchId && <MediasDuMatch matchId={s.matchId} />}
              </li>
            ))}
          </ul>
        </>
      )}

      {vue === 'appels' && (
        <>
          <p className="adm-note">
            Un appel accepté LÈVE la sanction (sans trace pour les autres — l’audit interne conserve le trajet).
            Un appel rejeté laisse la sanction en place.
          </p>
          {appels.length === 0 && !charge && (
            <p className="adm-vide">Aucun appel ouvert — rien à relire.</p>
          )}
          <ul className="adm-liste">
            {appels.map((a) => (
              <li key={a.id} className="adm-item">
                <div className="adm-item-tete">
                  <span className={`adm-badge adm-badge-n${a.sanctionNiveau}`}>
                    N{a.sanctionNiveau} · {a.sanctionNiveau === 1 ? 'Pause Rencontre' : 'Pause complète'}
                  </span>
                  <span className="adm-statut adm-statut-ouvert">{APPEL_STATUTS[a.statut]}</span>
                  <span className="adm-date">{dateFr(a.creeA)}</span>
                </div>
                <p className="adm-ligne">
                  <strong>{a.pseudo ?? idCourt(a.userId)}</strong> demande une relecture — sanction posée le{' '}
                  {dateFr(a.sanctionCreeA)}
                </p>
                <p className="adm-detail">« {a.message} »</p>
                <p className="adm-ctx">Sanction : {idCourt(a.sanctionId)}</p>
                <div className="adm-actions">
                  <button
                    className="btn btn-primary"
                    disabled={actionEnCours === a.id}
                    onClick={() => void trancherAppelId(a.id, 'accepte')}
                  >
                    {actionEnCours === a.id ? '…' : 'Lever la sanction'}
                  </button>
                  <button
                    className="btn btn-accent"
                    disabled={actionEnCours === a.id}
                    onClick={() => void trancherAppelId(a.id, 'rejete')}
                  >
                    {actionEnCours === a.id ? '…' : 'Rejeter'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      {vue === 'blocages' && (
        <>
          {blocages.length === 0 && !charge && <p className="adm-vide">Aucun blocage enregistré.</p>}
          <ul className="adm-liste">
            {blocages.map((b) => (
              <li key={b.id} className="adm-item adm-item-blocage">
                <p className="adm-ligne">
                  <strong>{b.pseudoPar ?? idCourt(b.par)}</strong> a bloqué{' '}
                  <strong>{b.pseudoContre ?? idCourt(b.contre)}</strong>
                </p>
                <p className="adm-date">{dateFr(b.creeA)}</p>
              </li>
            ))}
          </ul>
        </>
      )}
    </main>
  );
}
