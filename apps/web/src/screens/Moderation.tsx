/**
 * Console de MODÉRATION (Task 109) — #/admin, page hors navigation,
 * indépendante de la session utilisateur (comme #/prototype-resultats).
 *
 * Accès : jeton ADMIN_TOKEN saisi une fois par onglet (sessionStorage —
 * meurt à la fermeture). Outil interne du fondateur : libellés FR uniquement.
 *
 * Sections : aperçu (compteurs), signalements (filtre statut + trancher),
 * blocages. Chaque décision est tracée côté API dans audit_admin.
 */
import { useCallback, useEffect, useState } from 'react';
import {
  ErreurAdmin,
  chargerApercu,
  chargerBlocages,
  chargerSignalements,
  jetonAdmin,
  poserJetonAdmin,
  retirerJetonAdmin,
  trancherSignalement,
  type Apercu,
  type BlocageAdmin,
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

function dateFr(iso: string): string {
  try {
    return new Date(iso).toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short' });
  } catch {
    return iso;
  }
}

function idCourt(id: string): string {
  return id.length > 8 ? `${id.slice(0, 8)}…` : id;
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

export default function Moderation() {
  const [phase, setPhase] = useState<'verif' | 'saisie' | 'ok'>(jetonAdmin() ? 'verif' : 'saisie');
  const [jetonSaisi, setJetonSaisi] = useState('');
  const [err, setErr] = useState('');
  const [charge, setCharge] = useState(false);
  const [actionEnCours, setActionEnCours] = useState<string | null>(null);
  const [apercu, setApercu] = useState<Apercu | null>(null);
  const [vue, setVue] = useState<'signalements' | 'blocages'>('signalements');
  const [filtre, setFiltre] = useState<FiltreStatut>('ouvert');
  const [signalements, setSignalements] = useState<SignalementAdmin[]>([]);
  const [blocages, setBlocages] = useState<BlocageAdmin[]>([]);

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

  const deconnecter = () => {
    retirerJetonAdmin();
    setApercu(null);
    setSignalements([]);
    setBlocages([]);
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
                  </div>
                )}
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
