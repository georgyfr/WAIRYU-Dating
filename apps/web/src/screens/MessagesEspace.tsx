/**
 * RENCONTRE-E2 « Les conversations » (#/messages — Task 107, reconstitution)
 * + RENCONTRE-E3 « Le Voyage à Deux » (Task 115-b).
 *
 * La porte s'ouvre UNIQUEMENT derrière un match (D-E2-1) : liste des
 * conversations, fil avec bulles, temps réel WebSocket (DO ChatRoom) avec
 * fallback REST, badge de non-lus remonté à la TabBar, traduction au BOUTON
 * MANUEL (D-E2-5), révélation consentie aux deux seuils REVEAL (D-E2-6) et
 * sécurité à un geste : signaler / bloquer (silencieux) / ne plus
 * correspondre (D-E2-7/8/9).
 *
 * E3 (Task 115-b) : le bandeau « Le Voyage à Deux » vit SOUS l'en-tête du
 * fil (P1 — la conversation EST le lieu de la paire) : les cartes (niveau 2),
 * la voix (3), la photo (4), les récoltes à deux et le rendez-vous préparé.
 * Doctrine gravée : la demande se voit, le refus jamais (D-E3-3 — AUCUN
 * statut « refusé » n'existe ni ne s'affiche) ; jamais une note de la
 * relation (D-E3-4 — le compteur est un chemin, pas un score) ; tout média
 * est privé-paire et voyage PAR le Worker (D-E3-6).
 *
 * Honnêteté produit : aucune gamification, aucune pression — la révélation
 * affiche la progression comme une porte, jamais comme une quête.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { useI18n } from '../i18n/I18nProvider';
import {
  bloquer as apiBloquer,
  demanderReveal,
  envoyerMessage,
  fetchConversations,
  fetchFil,
  marquerLu,
  signaler as apiSignaler,
  traduireMessage,
  unmatch as apiUnmatch,
  urlWs,
  type Conversation,
  type EtatReveal,
  type MessageE2,
} from '../lib/messages-client';
import {
  consentirDuo,
  consentirVoile,
  creerActivite,
  envoyerMedia,
  fetchA2Etat,
  repondreActivite,
  supprimerMedia,
  urlMedia,
  type A2EtatResponse,
  type A2MediaInfo,
} from '../lib/a2-client';
import { ApiError } from '../lib/auth-client';
import { A2_MEDIAS, A2_PILOTE } from '@wairyu/shared';
import { QUETES, type IdQuete } from '../lib/quetes';
import VoyageIcon from '../components/VoyageIcons';

const MOTIFS = ['escroquerie_ou_argent', 'harcelement', 'faux_profil', 'contenu_inapproprie', 'fetichisant', 'autre'] as const;

/** Le titre lisible d'une quête croisée (le registre existe déjà côté app). */
function titreQuete(quete: string): string {
  return QUETES[quete as IdQuete]?.titre ?? quete;
}

/** 78 s → « 1:18 » (durée des notes vocales). */
function formatTemps(s: number): string {
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
}

/**
 * E3-P5 / G-E3-P5 — la photo est RE-ENCODEE en canvas AVANT l'envoi
 * (échelle max 1080px, JPEG 0.85) : l'EXIF ne quitte jamais l'appareil,
 * l'original non plus. Simple, fiable, zéro dépendance.
 */
async function reEncoderPhoto(fichier: File): Promise<Blob> {
  const url = URL.createObjectURL(fichier);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const im = new Image();
      im.onload = () => resolve(im);
      im.onerror = () => reject(new Error('image illisible'));
      im.src = url;
    });
    const echelle = Math.min(1, 1080 / Math.max(img.naturalWidth, img.naturalHeight));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(img.naturalWidth * echelle));
    canvas.height = Math.max(1, Math.round(img.naturalHeight * echelle));
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('canvas indisponible');
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.85));
    if (!blob) throw new Error('encodage impossible');
    return blob;
  } finally {
    URL.revokeObjectURL(url);
  }
}

/* ==================================================================== */
/* LE BANDEAU « LE VOYAGE À DEUX » (E3) — une vue à deux, section par   */
/* section, jamais un score. Chaque niveau = SA porte + le double oui.  */
/* ==================================================================== */
function VoyageADeux({ matchId, autrePseudo }: { matchId: string; autrePseudo: string | null }) {
  const { tx, lang } = useI18n();
  /** Déplié ? Replié par défaut — le compteur suffit au repli (G-E3-P8). */
  const [deplie, setDeplie] = useState(false);
  const [etat, setEtat] = useState<A2EtatResponse | null>(null);
  const [charge, setCharge] = useState(true);
  /** L'action en cours (clé libre : 'voile:3', 'duo:1.1', 'voix', 'suppr:<id>'…). */
  const [action, setAction] = useState<string | null>(null);
  /** Les erreurs douces du Voyage — jamais un verdict, toujours une porte. */
  const [flash, setFlash] = useState<string | null>(null);

  // ---- L'activité « Trois questions croisées » (conservation locale) ----
  const [reps, setReps] = useState<{ q1: string; q2: string; q3: string }>({ q1: '', q2: '', q3: '' });

  // ---- L'enregistreur voix (niveau 3) ----
  const [enregistre, setEnregistre] = useState(false);
  const [secondes, setSecondes] = useState(0);
  const [apercu, setApercu] = useState<{ blob: Blob; url: string; dureeS: number } | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const fluxRef = useRef<MediaStream | null>(null);
  const morceauxRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const secondesRef = useRef(0);

  // ---- La photo (niveau 4) ----
  const photoRef = useRef<HTMLInputElement | null>(null);

  /** Les erreurs douces — le message gravé (sanction_active) passe TEL QUEL. */
  const messageDoux = useCallback(
    (e: unknown, contexte: 'voix' | 'photo' | null): string => {
      if (e instanceof ApiError) {
        if (e.code === 'sanction_active') return e.message; // G-MA-4 : neutre, sans retouche
        if (e.status === 403) return tx('La porte n\u2019est pas encore ouverte.');
        if (e.status === 413) return contexte === 'photo' ? tx('La photo dépasse 4 Mo.') : tx('La note dépasse 60 s ou 512 Ko.');
        if (e.status === 415) return tx('Ce format n\u2019est pas pris en charge — essaie un autre fichier.');
        if (e.status === 429) return tx('Tout doucement — réessaie dans un instant.');
        if (e.status === 503) return tx('Les médias sont indisponible pour l\u2019instant.');
      }
      return tx('Ça n\u2019a pas abouti — réessaie dans un instant.');
    },
    [tx],
  );

  /** L'état complet du Voyage à Deux (une requête, tout dérivé). Pas de
   *  polling : chaque action rafraîchit, le reste se voit à la réouverture. */
  const recharge = useCallback(async (): Promise<void> => {
    setCharge(true);
    try {
      const r = await fetchA2Etat(matchId, lang);
      setEtat(r);
      setFlash(null);
      // Les réponses déjà envoyées reviennent dans les champs (modifiables
      // tant que l'activité n'est pas dévoilée — répondre = consentir).
      if (r.activite && r.activite.statut !== 'devoilee') {
        const ma = (id: string) => r.activite?.questions.find((x) => x.id === id)?.maReponse ?? '';
        setReps({ q1: ma('q1'), q2: ma('q2'), q3: ma('q3') });
      }
    } catch {
      // Le bandeau reste titre seul — le Voyage n'est jamais bloquant.
    } finally {
      setCharge(false);
    }
  }, [matchId, lang]);

  useEffect(() => {
    void recharge();
  }, [recharge]);

  // Le départ du fil : timer coupé, micro rendu, aperçu révoqué.
  useEffect(
    () => () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      if (recorderRef.current?.state === 'recording') recorderRef.current.stop();
      fluxRef.current?.getTracks().forEach((t) => t.stop());
      fluxRef.current = null;
    },
    [],
  );

  /** Lever un voile (2 cartes · 3 voix · 4 photo) — la demande se voit. */
  const leveVoile = async (niveau: 2 | 3 | 4): Promise<void> => {
    if (action) return;
    setAction(`voile:${niveau}`);
    try {
      await consentirVoile(matchId, niveau);
      await recharge();
    } catch (e) {
      setFlash(messageDoux(e, null));
    } finally {
      setAction(null);
    }
  };

  /** Mettre en regard (Duo) — l'ouverture est le double oui. */
  const consentDuo = async (quete: string): Promise<void> => {
    if (action) return;
    setAction(`duo:${quete}`);
    try {
      await consentirDuo(matchId, quete);
      await recharge();
    } catch (e) {
      setFlash(messageDoux(e, null));
    } finally {
      setAction(null);
    }
  };

  /** L'enregistrement — webm/opus d'abord, repli mp4 (iOS), 60 s max. */
  const demarreRec = async (): Promise<void> => {
    if (enregistre || apercu || action) return;
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      setFlash(tx('L\u2019enregistrement n\u2019est pas disponible sur cet appareil.'));
      return;
    }
    try {
      const flux = await navigator.mediaDevices.getUserMedia({ audio: true });
      fluxRef.current = flux;
      const candidats = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4'];
      const mime = candidats.find((m) => MediaRecorder.isTypeSupported(m));
      const rec = new MediaRecorder(flux, mime ? { mimeType: mime } : undefined);
      morceauxRef.current = [];
      rec.ondataavailable = (ev: BlobEvent) => {
        if (ev.data.size > 0) morceauxRef.current.push(ev.data);
      };
      rec.onstop = () => {
        const blob = new Blob(morceauxRef.current, { type: rec.mimeType || 'audio/webm' });
        const dureeS = secondesRef.current;
        fluxRef.current?.getTracks().forEach((t) => t.stop());
        fluxRef.current = null;
        setEnregistre(false);
        if (dureeS < 1) {
          setFlash(tx('La note est trop courte — réessaie.'));
          return;
        }
        setApercu({ blob, url: URL.createObjectURL(blob), dureeS });
      };
      recorderRef.current = rec;
      secondesRef.current = 0;
      setSecondes(0);
      setEnregistre(true);
      rec.start();
      timerRef.current = window.setInterval(() => {
        secondesRef.current += 1;
        setSecondes(secondesRef.current);
        if (secondesRef.current >= A2_MEDIAS.voixMaxSecondes) arreteRec();
      }, 1000);
    } catch {
      setFlash(tx('Le micro n\u2019est pas accessible — vérifie les autorisations.'));
    }
  };

  const arreteRec = (): void => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (recorderRef.current?.state === 'recording') recorderRef.current.stop();
  };

  const annuleApercu = (): void => {
    if (apercu) URL.revokeObjectURL(apercu.url);
    setApercu(null);
  };

  /** L'envoi de la voix — les limites sont vérifiées AVANT (honnêteté : pas
   *  d'échec serveur évitable). */
  const envoieVoix = async (): Promise<void> => {
    if (!apercu || action) return;
    if (apercu.blob.size > A2_MEDIAS.voixMaxOctets) {
      setFlash(tx('La note dépasse 60 s ou 512 Ko.'));
      return;
    }
    setAction('voix');
    try {
      // Le chrono peut dépasser 60 s de quelques battements si l'onglet a été
      // en arrière-plan : la durée déclarée reste DANS la limite serveur.
      const dureeDeclaree = Math.min(apercu.dureeS, A2_MEDIAS.voixMaxSecondes);
      await envoyerMedia(matchId, 'voix', apercu.blob, dureeDeclaree);
      annuleApercu();
      await recharge();
    } catch (e) {
      setFlash(messageDoux(e, 'voix'));
    } finally {
      setAction(null);
    }
  };

  /** La photo — re-encodée canvas AVANT le départ (purge EXIF, G-E3-P5). */
  const choisisPhoto = async (fichier: File | undefined): Promise<void> => {
    if (!fichier || action) return;
    setAction('photo');
    try {
      const blob = await reEncoderPhoto(fichier);
      if (blob.size > A2_MEDIAS.photoMaxOctets) {
        setFlash(tx('La photo dépasse 4 Mo.'));
        return;
      }
      await envoyerMedia(matchId, 'photo', blob);
      await recharge();
    } catch (e) {
      setFlash(e instanceof ApiError ? messageDoux(e, 'photo') : tx('La photo n\u2019a pas pu partir — essaie un autre fichier.'));
    } finally {
      setAction(null);
      if (photoRef.current) photoRef.current.value = '';
    }
  };

  /** Supprimer SON média — purge immédiate côté serveur. */
  const supprime = async (m: A2MediaInfo): Promise<void> => {
    if (action) return;
    setAction(`suppr:${m.id}`);
    try {
      await supprimerMedia(matchId, m.id);
      await recharge();
    } catch (e) {
      setFlash(messageDoux(e, m.type));
    } finally {
      setAction(null);
    }
  };

  /** L'activité pilote — créer puis répondre (les TROIS, obligatoires). */
  const commenceActivite = async (): Promise<void> => {
    if (action) return;
    setAction('activite');
    try {
      await creerActivite(matchId);
      await recharge();
    } catch (e) {
      setFlash(messageDoux(e, null));
    } finally {
      setAction(null);
    }
  };

  const repondsActivite = async (): Promise<void> => {
    if (!etat?.activite || action) return;
    const vals = [reps.q1.trim(), reps.q2.trim(), reps.q3.trim()];
    if (vals.some((v) => v.length === 0)) {
      setFlash(tx('Les trois réponses sont nécessaires — à ton rythme.'));
      return;
    }
    setAction('repondre');
    try {
      await repondreActivite(matchId, etat.activite.id, { q1: vals[0], q2: vals[1], q3: vals[2] });
      await recharge();
    } catch (e) {
      setFlash(messageDoux(e, null));
    } finally {
      setAction(null);
    }
  };

  const pseudoAutre = autrePseudo ?? tx('Voyageur·euse');

  /* ---------- Le rendu du bandeau ---------- */
  return (
    <section className="a2-bandeau" aria-label={tx('Le Voyage à Deux')}>
      <button
        type="button"
        className="a2-bandeau-tete"
        aria-expanded={deplie}
        onClick={() => setDeplie((v) => !v)}
      >
        <span className="a2-bandeau-titre">{tx('Le Voyage à Deux')}</span>
        {etat && (
          <span className="a2-bandeau-compteur">
            {tx('Votre chemin à deux : {{n}} récoltes', { n: etat.fragments })}
          </span>
        )}
        <svg
          className={`a2-bandeau-chev${deplie ? ' a2-bandeau-chev-ouvert' : ''}`}
          viewBox="0 0 24 24"
          width={16}
          height={16}
          fill="none"
          stroke="currentColor"
          strokeWidth={2.4}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {deplie && (
        <div className="a2-corps">
          {/* Premier chargement seulement — les rafraîchissements ne font
              jamais clignoter la vue (le Voyage reste posé). */}
          {charge && !etat && <p className="a2-doux">…</p>}
          {!charge && !etat && <p className="a2-doux">{tx('Ça n\u2019a pas abouti — réessaie dans un instant.')}</p>}

          {etat && (
            <>
              {flash && <p className="a2-flash" role="status">{flash}</p>}

              {/* ---- a) LES CARTES (niveau 2) — le Duo, outil de dialogue ---- */}
              <section className="a2-section" aria-label={tx('Les cartes')}>
                <h3 className="a2-titre-section">{tx('Les cartes')}</h3>
                {etat.duo.length === 0 && (
                  <p className="a2-doux">
                    {tx('Les cartes se dévoileront quand vous aurez traversé la même quête, chacun pour soi.')}
                  </p>
                )}
                {etat.duo.map((d) => (
                  <article key={d.quete} className="a2-carte-duo">
                    <h4 className="a2-carte-titre">{titreQuete(d.quete)}</h4>
                    {d.ouvert && d.carteMoi && d.carteAutre ? (
                      <>
                        <div className="a2-duo-cols">
                          <div className="a2-duo-col">
                            <h5>{tx('Toi')}</h5>
                            {d.carteMoi.lignes.map((l, i) => (
                              <p key={i} className="a2-carte-ligne">{l}</p>
                            ))}
                          </div>
                          <div className="a2-duo-col">
                            <h5>{pseudoAutre}</h5>
                            {d.carteAutre.lignes.map((l, i) => (
                              <p key={i} className="a2-carte-ligne">{l}</p>
                            ))}
                          </div>
                        </div>
                        {d.question && <p className="a2-question">{d.question}</p>}
                      </>
                    ) : d.consentMoi ? (
                      <p className="a2-attente">{tx('Tu as proposé — la réponse de l\u2019autre ouvrira la vue.')}</p>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-accent a2-btn"
                        disabled={action !== null}
                        onClick={() => void consentDuo(d.quete)}
                      >
                        {action === `duo:${d.quete}`
                          ? tx('…')
                          : d.consentAutre
                            ? tx('{{pseudo}} propose de mettre en regard — dire oui', { pseudo: pseudoAutre })
                            : tx('Mettre en regard')}
                      </button>
                    )}
                  </article>
                ))}
              </section>

              {/* ---- b) LA VOIX (niveau 3) — porte : cartes ouverts + seuils E2 ---- */}
              <section className="a2-section" aria-label={tx('La voix')}>
                <h3 className="a2-titre-section">{tx('La voix')}</h3>
                {etat.voiles.voix.ouvert ? (
                  <>
                    {!apercu && !enregistre && (
                      <button type="button" className="btn btn-accent a2-btn" disabled={action !== null} onClick={() => void demarreRec()}>
                        {tx('Enregistrer une voix')}
                      </button>
                    )}
                    {enregistre && (
                      <div className="a2-rec" role="status">
                        <span className="a2-rec-point" aria-hidden="true" />
                        <span className="a2-rec-timer">{formatTemps(secondes)}</span>
                        <button type="button" className="btn a2-btn-fonce" onClick={arreteRec}>
                          {tx('Arrêter')}
                        </button>
                      </div>
                    )}
                    {apercu && (
                      <div className="a2-apercu">
                        <p className="a2-doux">{tx('Réécoute avant d\u2019envoyer :')}</p>
                        <audio controls src={apercu.url} preload="metadata" />
                        <div className="a2-actions">
                          <button type="button" className="btn btn-accent a2-btn" disabled={action !== null} onClick={() => void envoieVoix()}>
                            {action === 'voix' ? tx('…') : tx('Envoyer la voix')}
                          </button>
                          <button type="button" className="btn a2-btn-fonce" disabled={action !== null} onClick={annuleApercu}>
                            {tx('Annuler')}
                          </button>
                        </div>
                      </div>
                    )}
                    {etat.voix.length === 0 && !enregistre && !apercu && (
                      <p className="a2-doux">{tx('Des mots, puis une voix — chacun à son rythme.')}</p>
                    )}
                    {etat.voix.map((m) => (
                      <div key={m.id} className={m.deMoi ? 'a2-voix a2-voix-moi' : 'a2-voix'}>
                        <audio controls src={urlMedia(matchId, m.id)} preload="none" />
                        <span className="a2-voix-meta">
                          {m.dureeS ? `${formatTemps(m.dureeS)} · ` : ''}
                          {new Date(m.creeA).toLocaleDateString(lang === 'en' ? 'en-IE' : 'fr-FR', { day: 'numeric', month: 'short' })}
                        </span>
                        {m.deMoi && (
                          <button
                            type="button"
                            className="a2-suppr"
                            disabled={action !== null}
                            onClick={() => void supprime(m)}
                            aria-label={tx('Supprimer ma voix')}
                          >
                            {tx('Supprimer')}
                          </button>
                        )}
                      </div>
                    ))}
                  </>
                ) : etat.voiles.voix.porte === false ? (
                  <p className="a2-doux">
                    {tx('La conversation grandit — {{m}}/{{mm}} messages · {{j}}/{{jj}} jours.', {
                      m: etat.voiles.voix.seuils?.messages ?? 0,
                      mm: etat.voiles.voix.seuils?.messagesRequis ?? 0,
                      j: etat.voiles.voix.seuils?.jours ?? 0,
                      jj: etat.voiles.voix.seuils?.joursRequis ?? 0,
                    })}
                  </p>
                ) : etat.voiles.voix.moi ? (
                  <p className="a2-attente">{tx('Tu as proposé — la réponse de l\u2019autre ouvrira la vue.')}</p>
                ) : (
                  <button
                    type="button"
                    className="btn btn-accent a2-btn"
                    disabled={action !== null}
                    onClick={() => void leveVoile(3)}
                  >
                    {action === 'voile:3'
                      ? tx('…')
                      : etat.voiles.voix.autre
                        ? tx('{{pseudo}} propose de lever le voile de la voix — dire oui', { pseudo: pseudoAutre })
                        : tx('Lever le voile de la voix')}
                  </button>
                )}
              </section>

              {/* ---- c) LA PHOTO (niveau 4) — porte : Prêt·e des DEUX (jamais d'argent) ---- */}
              <section className="a2-section" aria-label={tx('La photo')}>
                <h3 className="a2-titre-section">{tx('La photo')}</h3>
                {etat.voiles.photo.ouvert ? (
                  <>
                    <div className="a2-photos">
                      <figure className="a2-photo">
                        {etat.mediaPhoto.moi ? (
                          <img src={urlMedia(matchId, etat.mediaPhoto.moi.id)} alt={tx('Ta photo partagée')} />
                        ) : (
                          <label className="a2-photo-ajout">
                            <input
                              ref={photoRef}
                              type="file"
                              accept="image/*"
                              onChange={(e) => void choisisPhoto(e.target.files?.[0])}
                              className="a2-photo-input"
                            />
                            {action === 'photo' ? tx('…') : tx('Choisir une photo')}
                          </label>
                        )}
                        <figcaption>{tx('Toi')}</figcaption>
                      </figure>
                      <figure className="a2-photo">
                        {etat.mediaPhoto.autre ? (
                          <img src={urlMedia(matchId, etat.mediaPhoto.autre.id)} alt={tx('La photo de {{pseudo}}', { pseudo: pseudoAutre })} />
                        ) : (
                          <div className="a2-photo-vide" aria-hidden="true">
                            <span>{tx('À son rythme.')}</span>
                          </div>
                        )}
                        <figcaption>{pseudoAutre}</figcaption>
                      </figure>
                    </div>
                    {etat.mediaPhoto.moi && (
                      <button
                        type="button"
                        className="a2-suppr"
                        disabled={action !== null}
                        onClick={() => void supprime(etat.mediaPhoto.moi!)}
                      >
                        {tx('Supprimer ma photo')}
                      </button>
                    )}
                  </>
                ) : !etat.pretes.moi || !etat.pretes.autre ? (
                  <p className="a2-doux">{tx('Le Statut Prêt·e s\u2019ouvre quand vous aurez franchi la quête 1.11.')}</p>
                ) : !etat.voiles.photo.porte ? (
                  <p className="a2-doux">{tx('La photo s\u2019ouvre après la voix — dans l\u2019ordre, toujours.')}</p>
                ) : etat.voiles.photo.moi ? (
                  <p className="a2-attente">{tx('Tu as proposé — la réponse de l\u2019autre ouvrira la vue.')}</p>
                ) : (
                  <button
                    type="button"
                    className="btn btn-accent a2-btn"
                    disabled={action !== null}
                    onClick={() => void leveVoile(4)}
                  >
                    {action === 'voile:4'
                      ? tx('…')
                      : etat.voiles.photo.autre
                        ? tx('{{pseudo}} propose de lever le voile de la photo — dire oui', { pseudo: pseudoAutre })
                        : tx('Lever le voile de la photo')}
                  </button>
                )}
              </section>

              {/* ---- d) TROIS QUESTIONS CROISÉES (récoltes à deux) — répondre = consentir ---- */}
              <section className="a2-section" aria-label={tx('Trois questions croisées')}>
                <h3 className="a2-titre-section">{tx('Trois questions croisées')}</h3>
                {!etat.activite ? (
                  <>
                    <p className="a2-doux">
                      {tx('Trois questions posées à vous deux — les réponses se dévoilent ensemble, quand vous y aurez tous les deux répondu.')}
                    </p>
                    <button type="button" className="btn btn-accent a2-btn" disabled={action !== null} onClick={() => void commenceActivite()}>
                      {action === 'activite' ? tx('…') : tx('Commencer l\u2019activité')}
                    </button>
                  </>
                ) : etat.activite.statut === 'devoilee' ? (
                  <>
                    {etat.activite.questions.map((q) => (
                      <article key={q.id} className="a2-qa">
                        <h4 className="a2-carte-titre">{q.texte}</h4>
                        <div className="a2-duo-cols">
                          <div className="a2-duo-col">
                            <h5>{tx('Toi')}</h5>
                            <p className="a2-carte-ligne">{q.maReponse ?? ''}</p>
                          </div>
                          <div className="a2-duo-col">
                            <h5>{pseudoAutre}</h5>
                            <p className="a2-carte-ligne">{q.reponseAutre ?? ''}</p>
                          </div>
                        </div>
                      </article>
                    ))}
                  </>
                ) : (
                  <>
                    <form
                      className="a2-form"
                      onSubmit={(e) => {
                        e.preventDefault();
                        void repondsActivite();
                      }}
                    >
                      {A2_PILOTE.questionsCroisees.map((q) => (
                        <label key={q.id} className="a2-champ">
                          <span>{lang === 'en' ? q.en : q.fr}</span>
                          <textarea
                            value={reps[q.id as 'q1' | 'q2' | 'q3']}
                            maxLength={1000}
                            rows={3}
                            onChange={(e) => setReps((prev) => ({ ...prev, [q.id]: e.target.value }))}
                            placeholder={tx('Ta réponse…')}
                            aria-label={lang === 'en' ? q.en : q.fr}
                          />
                        </label>
                      ))}
                      <button type="submit" className="btn btn-accent a2-btn" disabled={action !== null}>
                        {action === 'repondre' ? tx('…') : tx('Répondre aux trois')}
                      </button>
                    </form>
                    {etat.activite.completeMoi && (
                      <p className="a2-attente">{tx('En attente de l\u2019autre — vos réponses se dévoileront ensemble.')}</p>
                    )}
                  </>
                )}
              </section>

              {/* ---- e) LE RENDEZ-VOUS PRÉPARÉ — une proposition, pas un programme ---- */}
              {etat.rdv && (
                <section className="a2-section" aria-label={tx('Le rendez-vous préparé')}>
                  <h3 className="a2-titre-section">{tx('Le rendez-vous préparé')}</h3>
                  <ul className="a2-rdv-idees">
                    {A2_PILOTE.ideesRdv.map((idee, i) => (
                      <li key={i} className="a2-rdv-idee">
                        <strong>{lang === 'en' ? idee.en : idee.fr}</strong>
                        <span>{lang === 'en' ? idee.pourquoiEn : idee.pourquoiFr}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="a2-question">{tx(etat.rdv.question)}</p>
                  <p className="a2-note">{tx('Une proposition, pas un programme.')}</p>
                </section>
              )}
            </>
          )}
        </div>
      )}
    </section>
  );
}

export default function MessagesEspace({ onNonLus, monId }: { onNonLus: (n: number) => void; monId: string | null }) {
  const { tx, lang } = useI18n();
  const [conversations, setConversations] = useState<Conversation[] | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);
  /** Le fil ouvert : son matchId + son état (messages, reveal, blocage). */
  const [ouvert, setOuvert] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageE2[]>([]);
  const [filInfo, setFilInfo] = useState<{ autre: { id: string; pseudo: string | null }; bloque: boolean; reveal: EtatReveal | null } | null>(null);
  const [brouillon, setBrouillon] = useState('');
  const [envoiEnCours, setEnvoiEnCours] = useState(false);
  /** Traductions demandées : messageId → texte traduit. */
  const [traductions, setTraductions] = useState<Map<string, string>>(new Map());
  const [tradEnCours, setTradEnCours] = useState<string | null>(null);
  /** Panneau sécurité (D-E2-7/8/9). */
  const [securite, setSecurite] = useState(false);
  const [motif, setMotif] = useState<string>('harcelement');
  const [details, setDetails] = useState('');
  const [flash, setFlash] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const ouvertRef = useRef<string | null>(null);
  const monIdRef = useRef<string | null>(monId);
  const basRef = useRef<HTMLDivElement | null>(null);

  ouvertRef.current = ouvert;
  monIdRef.current = monId;

  /** Boîte de réception — aussi le canal du badge onglet (renvoyé à App). */
  const rechargeConversations = useCallback(async (): Promise<void> => {
    try {
      const r = await fetchConversations();
      setConversations(r.conversations);
      onNonLus(r.totalNonLus);
      setErreur(null);
    } catch {
      setConversations((prev) => prev ?? []);
      onNonLus(0);
      setErreur(tx('Les conversations ne sont pas disponibles pour le moment.'));
    }
  }, [onNonLus, tx]);

  /** Le WebSocket du fil — même origine, reconnexion douce (5 s). */
  const brancheWs = useCallback((matchId: string) => {
    wsRef.current?.close();
    wsRef.current = null;
    try {
      const ws = new WebSocket(urlWs(matchId));
      ws.onmessage = (ev: MessageEvent) => {
        try {
          const data = JSON.parse(String(ev.data)) as { type: string; id?: string; corps?: string; de?: string; lang?: string; creeA?: string; matchId?: string; code?: string };
          if (data.type === 'message' && data.id && data.corps && data.de && data.creeA) {
            const recu: MessageE2 = {
              id: data.id,
              deMoi: data.de === monIdRef.current,
              corps: data.corps,
              lang: data.lang === 'en' ? 'en' : 'fr',
              creeA: data.creeA,
            };
            if (ouvertRef.current === data.matchId) {
              // L'écho du DO sert de confirmation serveur (déduplication par id).
              setMessages((prev) => (prev.some((m) => m.id === recu.id) ? prev : [...prev, recu]));
              void marquerLu(data.matchId);
            } else {
              void rechargeConversations();
            }
          }
        } catch {
          /* frame non-JSON ignorée */
        }
      };
      ws.onclose = () => {
        if (ouvertRef.current === matchId) {
          window.setTimeout(() => {
            if (ouvertRef.current === matchId) brancheWs(matchId);
          }, 5000);
        }
      };
      wsRef.current = ws;
    } catch {
      /* pas de WS : le fallback REST suffit */
    }
  }, [rechargeConversations]);

  /** Ouvre un fil : historique + marque lu + temps réel. */
  const ouvreFil = useCallback(async (matchId: string): Promise<void> => {
    setOuvert(matchId);
    setMessages([]);
    setFilInfo(null);
    setTraductions(new Map());
    setSecurite(false);
    try {
      const fil = await fetchFil(matchId);
      setMessages(fil.messages);
      setFilInfo({ autre: fil.autre, bloque: fil.bloque, reveal: fil.reveal });
      void marquerLu(matchId);
      void rechargeConversations();
      brancheWs(matchId);
    } catch {
      setFilInfo({ autre: { id: '', pseudo: null }, bloque: false, reveal: null });
      setErreur(tx('Cette conversation est indisponible.'));
    }
  }, [brancheWs, rechargeConversations, tx]);

  /** Deep-link depuis #/matchs (« Ouvrir la conversation »). */
  useEffect(() => {
    void rechargeConversations();
    const aOuvrir = sessionStorage.getItem('wairyu.ouvrirConversation');
    if (aOuvrir) {
      sessionStorage.removeItem('wairyu.ouvrirConversation');
      void ouvreFil(aOuvrir);
    }
    return () => {
      wsRef.current?.close();
      wsRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Polling de secours : le badge reste vrai même sans WS (20 s). */
  useEffect(() => {
    if (ouvert) return;
    const t = window.setInterval(() => void rechargeConversations(), 20000);
    return () => window.clearInterval(t);
  }, [ouvert, rechargeConversations]);

  /** Le fil suit la dernière bulle. */
  useEffect(() => {
    basRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages.length]);

  /** Envoi : WS si vivant (l'écho du DO confirme), sinon REST. */
  const envoie = async (): Promise<void> => {
    const texte = brouillon.trim();
    if (texte.length === 0 || !ouvert || envoiEnCours) return;
    setEnvoiEnCours(true);
    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ corps: texte, lang }));
      setBrouillon('');
      setEnvoiEnCours(false);
      return;
    }
    try {
      const r = await envoyerMessage(ouvert, texte, lang);
      if (r.message) setMessages((prev) => (prev.some((m) => m.id === r.message!.id) ? prev : [...prev, r.message!]));
      setBrouillon('');
      void rechargeConversations();
    } catch {
      setFlash(tx('Le message n\u2019a pas pu partir. Réessaie.'));
    } finally {
      setEnvoiEnCours(false);
    }
  };

  /** Traduction manuelle (D-E2-5) — jamais automatique. */
  const traduit = async (m: MessageE2): Promise<void> => {
    if (!ouvert || traductions.has(m.id) || tradEnCours) return;
    setTradEnCours(m.id);
    try {
      const r = await traduireMessage(ouvert, m.id, lang);
      setTraductions((prev) => new Map(prev).set(m.id, r.traduction));
    } catch (e) {
      const code = (e as { code?: string }).code;
      setFlash(code === 'traduction_indisponible' ? tx('La traduction est indisponible pour le moment.') : tx('La traduction a échoué.'));
    } finally {
      setTradEnCours(null);
    }
  };

  /** D-E2-6 — demande de révélation (seuils vérifiés côté serveur). */
  const reveal = async (): Promise<void> => {
    if (!ouvert) return;
    try {
      const r = await demanderReveal(ouvert);
      setFilInfo((prev) => (prev ? { ...prev, reveal: r.etat } : prev));
      setFlash(r.etat.revele ? tx('Vous vous êtes révélés l\u2019un à l\u2019autre.') : tx('Ta demande est posée — en attendant l\u2019autre.'));
    } catch (e) {
      const code = (e as { code?: string }).code;
      if (code === 'reveal_seuil') setFlash(tx('La révélation demande plus de chemin ensemble : des mots et du temps.'));
      else setFlash(tx('La révélation n\u2019a pas pu être demandée.'));
    }
  };

  /** D-E2-7 — blocage silencieux. */
  const bloque = async (): Promise<void> => {
    if (!ouvert || !filInfo) return;
    await apiBloquer(ouvert);
    setFilInfo({ ...filInfo, bloque: true });
    setSecurite(false);
    wsRef.current?.close();
    wsRef.current = null;
    setFlash(tx('Cette personne ne peut plus t\u2019écrire. Elle n\u2019en est pas informée.'));
  };

  /** D-E2-8 — unmatch : tout s'efface, retour à la liste. */
  const rompt = async (): Promise<void> => {
    if (!ouvert) return;
    await apiUnmatch(ouvert);
    setSecurite(false);
    wsRef.current?.close();
    wsRef.current = null;
    setOuvert(null);
    setMessages([]);
    setFilInfo(null);
    void rechargeConversations();
  };

  /** D-E2-9 — signalement confidentiel. */
  const signale = async (): Promise<void> => {
    if (!ouvert || !filInfo) return;
    await apiSignaler(filInfo.autre.id, motif, details.trim().length > 0 ? details.trim() : null, ouvert);
    setDetails('');
    setSecurite(false);
    setFlash(tx('Ton signalement est envoyé. Personne ne saura qui l\u2019a fait.'));
  };

  const heure = (iso: string): string => {
    try {
      return new Date(iso).toLocaleTimeString(lang === 'en' ? 'en-GB' : 'fr-FR', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  /* ---------- Le fil ouvert ---------- */
  if (ouvert) {
    const r = filInfo?.reveal ?? null;
    return (
      <main className="screen msg-screen">
        <div className="msg-head">
          <button className="msg-retour" onClick={() => { setOuvert(null); wsRef.current?.close(); wsRef.current = null; }} aria-label={tx('Retour aux conversations')}>
            <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 12H5M11 18l-6-6 6-6" /></svg>
          </button>
          <div className="msg-head-nom">
            <span className="msg-head-titre">{filInfo?.autre.pseudo ?? tx('Conversation')}</span>
            {r?.revele && <span className="msg-reveal-badge">{tx('Révélés')} <VoyageIcon name="compass" size={13} strokeWidth={2} /></span>}
          </div>
          <button className="msg-securite" onClick={() => setSecurite(true)} aria-label={tx('Sécurité')}>
            <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="5" r="1.4" /><circle cx="12" cy="12" r="1.4" /><circle cx="12" cy="19" r="1.4" /></svg>
          </button>
        </div>

        {r && !r.revele && (
          <div className="msg-reveal-bar" role="status">
            {r.seuilAtteint ? (
              r.demandeMoi ? (
                <span>{tx('Révélation posée — en attendant l\u2019autre.')}</span>
              ) : r.demandeAutre ? (
                <button className="btn btn-accent msg-reveal-cta" onClick={() => void reveal()}>{tx('{{pseudo}} propose de se révéler — dire oui', { pseudo: filInfo?.autre.pseudo ?? '' })}</button>
              ) : (
                <button className="btn btn-accent msg-reveal-cta" onClick={() => void reveal()}>{tx('Se révéler l\u2019un à l\u2019autre')}</button>
              )
            ) : (
              <span className="msg-reveal-progress">
                {tx('Révélation : {{m}}/{{mm}} messages · {{j}}/{{jj}} jours', { m: r.messages, mm: r.messagesRequis, j: r.jours, jj: r.joursRequis })}
              </span>
            )}
          </div>
        )}

        {/* E3 — LE VOYAGE À DEUX : sous l'en-tête du fil (P1), JAMAIS sur un
            fil bloqué (D-E3-7 : le blocage gèle tout le Voyage à Deux). */}
        {filInfo && !filInfo.bloque && filInfo.autre.id && (
          <VoyageADeux key={ouvert} matchId={ouvert} autrePseudo={filInfo.autre.pseudo} />
        )}

        <div className="msg-fil" aria-live="polite">
          {messages.length === 0 && (
            <p className="msg-vide">{tx('Écrivez le premier mot — en toute simplicité.')}</p>
          )}
          {messages.map((m) => (
            <div key={m.id} className={m.deMoi ? 'msg-ligne msg-moi' : 'msg-ligne msg-autre'}>
              <div className="msg-bulle">
                <p className="msg-texte">{m.corps}</p>
                {traductions.has(m.id) && <p className="msg-trad">{traductions.get(m.id)}</p>}
                {!m.deMoi && (
                  <button className="msg-trad-btn" onClick={() => void traduit(m)} disabled={tradEnCours === m.id}>
                    {tradEnCours === m.id
                      ? tx('Traduction…')
                      : traductions.has(m.id)
                        ? tx('Traduit')
                        : tx(lang === 'en' ? 'Traduire en anglais' : 'Traduire en français')}
                  </button>
                )}
              </div>
              <span className="msg-heure">{heure(m.creeA)}</span>
            </div>
          ))}
          <div ref={basRef} />
        </div>

        {flash && <p className="msg-flash" role="status">{flash}</p>}

        {filInfo?.bloque ? (
          <p className="msg-bloque">{tx('La conversation est fermée. Vos messages passés restent lisibles.')}</p>
        ) : (
          <form
            className="msg-envoi"
            onSubmit={(e) => { e.preventDefault(); void envoie(); }}
          >
            <input
              className="msg-saisie"
              value={brouillon}
              onChange={(e) => setBrouillon(e.target.value)}
              placeholder={tx('Écrire un message…')}
              maxLength={2000}
              aria-label={tx('Écrire un message…')}
            />
            <button className="btn btn-accent msg-envoi-btn" type="submit" disabled={brouillon.trim().length === 0 || envoiEnCours}>
              {envoiEnCours ? tx('…') : tx('Envoyer')}
            </button>
          </form>
        )}

        {securite && (
          <div className="msg-modale" role="dialog" aria-modal="true" aria-label={tx('Sécurité')}>
            <div className="msg-modale-carte">
              <h2 className="msg-modale-titre">{tx('Sécurité')}</h2>
              <p className="msg-modale-p">{tx('Aucune de ces actions n\u2019est jamais visible de l\u2019autre personne.')}</p>

              <fieldset className="msg-sig">
                <legend>{tx('Signaler')}</legend>
                {MOTIFS.map((mo) => (
                  <label key={mo} className="msg-sig-opt">
                    <input type="radio" name="motif" checked={motif === mo} onChange={() => setMotif(mo)} />
                    {tx({
                      escroquerie_ou_argent: 'Escroquerie ou demande d\'argent',
                      harcelement: 'Harcèlement',
                      faux_profil: 'Faux profil',
                      contenu_inapproprie: 'Contenu inapproprié',
                      fetichisant: 'Comportement fétichisant',
                      autre: 'Autre',
                    }[mo])}
                  </label>
                ))}
                <textarea
                  className="msg-sig-details"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder={tx('Détails (facultatif)')}
                  maxLength={1000}
                  rows={3}
                />
                <button className="btn msg-btn-soft" onClick={() => void signale()}>{tx('Envoyer le signalement')}</button>
              </fieldset>

              <button className="btn msg-btn-soft" onClick={() => void bloque()}>{tx('Bloquer en silence')}</button>
              <button className="btn msg-btn-danger" onClick={() => void rompt()}>{tx('Ne plus correspondre (tout efface)')}</button>
              <button className="btn msg-btn-fermer" onClick={() => setSecurite(false)}>{tx('Fermer')}</button>
            </div>
          </div>
        )}
      </main>
    );
  }

  /* ---------- La liste des conversations ---------- */
  return (
    <main className="screen msg-screen">
      <h1 className="screen-title">{tx('Tes conversations')}</h1>
      {erreur && <p className="msg-erreur" role="alert">{erreur}</p>}
      {conversations === null && <p className="msg-vide">{tx('…')}</p>}
      {conversations !== null && conversations.length === 0 && (
        <article className="card msg-info">
          <p>{tx('Aucune conversation pour l\u2019instant — les conversations naissent d\u2019un match (deux pas réciproques).')}</p>
        </article>
      )}
      {conversations !== null && conversations.length > 0 && (
        <section aria-label={tx('Conversations')}>
          {conversations.map((c) => (
            <button key={c.matchId} className="card msg-conv" onClick={() => void ouvreFil(c.matchId)}>
              <span className="msg-conv-avatar" aria-hidden="true"><VoyageIcon name="compass" size={20} strokeWidth={1.8} /></span>
              <span className="msg-conv-corps">
                <span className="msg-conv-titre">{c.autre.pseudo ?? tx('Voyageur·euse')}{c.revele ? ' ✦' : ''}</span>
                <span className="msg-conv-apercu">
                  {c.dernier ? `${c.dernier.deMoi ? `${tx('Toi')} : ` : ''}${c.dernier.corps}` : tx('Conversation neuve')}
                </span>
              </span>
              {c.nonLus > 0 && <span className="msg-badge" aria-label={tx('{{n}} messages non lus', { n: c.nonLus })}>{c.nonLus}</span>}
            </button>
          ))}
        </section>
      )}
    </main>
  );
}
