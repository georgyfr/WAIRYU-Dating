/**
 * RENCONTRE-E2 « Les conversations » (#/messages — Task 107, reconstitution).
 *
 * La porte s'ouvre UNIQUEMENT derrière un match (D-E2-1) : liste des
 * conversations, fil avec bulles, temps réel WebSocket (DO ChatRoom) avec
 * fallback REST, badge de non-lus remonté à la TabBar, traduction au BOUTON
 * MANUEL (D-E2-5), révélation consentie aux deux seuils REVEAL (D-E2-6) et
 * sécurité à un geste : signaler / bloquer (silencieux) / ne plus
 * correspondre (D-E2-7/8/9).
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
import VoyageIcon from '../components/VoyageIcons';

const MOTIFS = ['escroquerie_ou_argent', 'harcelement', 'faux_profil', 'contenu_inapproprie', 'fetichisant', 'autre'] as const;

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
