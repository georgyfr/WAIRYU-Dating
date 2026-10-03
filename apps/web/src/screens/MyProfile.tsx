/**
 * Page Mon profil (expérience dating classique — demande fondateur).
 *
 * TON profil tel que les autres membres le voient : photos navigables,
 * identité + badge vérifié, bio, prompts, personnalité (badge + raffinement),
 * préférences de découverte — avec des accès rapides : modifier le profil
 * (assistant), mon questionnaire, paramètres & compte.
 *
 * La page ne duplique AUCUNE donnée : tout vient de GET /api/profile
 * (URLs signées côté Worker — le propriétaire voit ses photos nettes).
 */
import { useState, type CSSProperties } from 'react';
import { api } from '../lib/api';
import { useSwr, invalidateSwr } from '../lib/swr';
import { PersonalityBadge, PersonalityProposal } from './PersonalityProposal';
import { LABELS, PROMPT_LIBRARY, type LikesMeResponse, type MatchListResponse, type ProfileResponse, type HeritageProfile, type Raison } from '@wairyu/shared';
import { HERITAGE_LABELS, HERITAGE_SECTIONS, sectionFilled } from '../lib/heritage-data';

interface Props {
  onEdit: () => void;
  onSettings: () => void;
  onQuestionnaire: () => void;
  /** Task 52 : ouvrir l'écran « Mon héritage culturel » (#/heritage). */
  onHeritage: () => void;
  /** Mission V18 (B.4) — ouvrir la séquence de recherche (#/activer-rencontre)
   * quand la réactivation a besoin de la configuration B.2. */
  onActivate: () => void;
}

/**
 * Task 52 : chips de PRÉVIEW du profil d'héritage (vue propriétaire) —
 * public (langues, origines, fêtes, cuisine, musique) ; les sections
 * privées (Valeurs, Projets) ne sont PAS listées en chips (elles restent
 * consultables/editables via l'écran #/heritage).
 */
function heritageChips(h: HeritageProfile): string[] {
  const chips: string[] = [];
  if (h.langues?.maternelle) chips.push(`🗣️ ${h.langues.maternelle} (maternelle)`);
  for (const l of (h.langues?.parlees ?? []).slice(0, 3)) {
    chips.push(`🗣️ ${l.langue} (${HERITAGE_LABELS.langLevelShort[l.niveau]})`);
  }
  for (const o of (h.origines?.originesFamiliales ?? []).slice(0, 3)) chips.push(`🌍 ${o}`);
  for (const f of (h.traditions?.fetes ?? []).slice(0, 2)) chips.push(`🎉 ${f}`);
  for (const c of (h.affinites?.cuisines ?? []).slice(0, 2)) chips.push(`🍲 ${c}`);
  for (const m of (h.affinites?.musiques ?? []).slice(0, 2)) chips.push(`🎵 ${m}`);
  return chips.slice(0, 8);
}

/** Âge exact depuis la date de naissance ISO (null si absente/incohérente). */
function ageOf(birthDate: string | null): number | null {
  if (!birthDate) return null;
  const d = new Date(`${birthDate}T00:00:00`);
  if (Number.isNaN(d.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
  return age >= 18 ? age : null;
}

/** Mission V18 (B.6) — pictogrammes de « Ta raison d'être ici » (même trio que l'assistant). */
const RAISON_ICONS: Record<Raison, string> = {
  voyage: '🪞',
  rencontre: '💞',
  indecis: '⏸️',
};

const RAISON_DETAIL: Record<Raison, string> = {
  voyage: 'Tu n’apparaîs dans aucune découverte — ton parcours est complet, rien ne te manque.',
  rencontre: 'La découverte des profils est active. Tu peux la mettre en pause à tout moment.',
  indecis: 'Ton parcours avance ; la rencontre reste une porte fermée jusqu’à ta décision.',
};

export function MyProfile({ onEdit, onSettings, onQuestionnaire, onHeritage, onActivate }: Props) {
  // Cache SWR : le profil s'affiche instantanément au retour sur l'onglet,
  // revalidé en arrière-plan (TTL 30 s — les modifications passent par
  // l'assistant qui invalide la clé « profile » après sauvegarde).
  const { data: prof, loading, error } = useSwr<ProfileResponse>('profile', true, {
    ttlMs: 30_000,
  });
  const [photoIdx, setPhotoIdx] = useState(0);
  const [showPers, setShowPers] = useState(false);

  // --- Mission V18 (B.6) — « Ta raison d'être ici » : la carte reste VISIBLE
  // en permanence ; la bascule est réversible à l'infini dans les deux sens.
  const [raisonBusy, setRaisonBusy] = useState(false);
  const [raisonErreur, setRaisonErreur] = useState<string | null>(null);
  const [pauseOuverte, setPauseOuverte] = useState(false);
  const [pauseMotif, setPauseMotif] = useState('');

  // Stats réelles (Task 31 — référence §4.7) : mêmes caches SWR que les
  // pages Likes / Matchs — aucune requête supplémentaire (dédup du cache).
  const { data: likesData } = useSwr<LikesMeResponse>('likes-me', true, { ttlMs: 30_000 });
  const { data: matchesData } = useSwr<MatchListResponse>('matches', true, { ttlMs: 60_000 });

  if (error) {
    return (
      <div className="app page-profile">
        <header className="wizard-head plain"><h1>Mon profil</h1></header>
        <p className="error">{error}</p>
      </div>
    );
  }

  if (!prof || loading) {
    return (
      <div className="app page-profile">
        <header className="wizard-head plain"><h1>Mon profil</h1></header>
        <p className="status"><span className="dot" /> Chargement de ton profil…</p>
      </div>
    );
  }

  const age = ageOf(prof.birthDate);
  const photos = prof.photos.filter((p) => p.urlThumb || p.urlFull);
  const main = photos[Math.min(photoIdx, photos.length - 1)] ?? null;
  const promptLabel = (key: string) => PROMPT_LIBRARY.find((p) => p.key === key)?.label ?? key;
  const prefs = prof.preferences;
  /** Mission V18 (B.4) — la recherche a-t-elle déjà une configuration (B.2 faite) ? */
  const rechercheDejaConfiguree = Boolean(prof.orientation && prefs);

  /**
   * Mission V18 (B.4/B.6) — la bascule de raison. RÉVERSIBLE À L'INFINI,
   * dans les DEUX sens, sans jamais rien supprimer : conversations, matchs
   * et messages sont conservés pendant la pause (B.3). La réactivation est
   * un clic si la configuration de recherche existe déjà ; sinon elle passe
   * par la séquence B.2 (#/activer-rencontre).
   */
  async function changerRaison(nouvelle: Raison, motif?: string) {
    setRaisonBusy(true);
    setRaisonErreur(null);
    try {
      await api('/api/profile', {
        method: 'PUT',
        json: { raison: nouvelle, ...(nouvelle !== 'rencontre' && motif ? { raisonPauseReason: motif } : {}) },
      });
      invalidateSwr('profile');
      setPauseOuverte(false);
      setPauseMotif('');
    } catch (err) {
      setRaisonErreur(err instanceof Error ? err.message : 'Erreur inattendue.');
    }
    setRaisonBusy(false);
  }

  /** B.4 — réactivation : un clic si la recherche est déjà configurée, sinon B.2. */
  function reactiverRencontre() {
    if (rechercheDejaConfiguree) {
      void changerRaison('rencontre');
    } else {
      onActivate();
    }
  }

  // Complétion du profil (%, calcul local honnête sur les champs réels) :
  // photo 30 · bio 20 · prompts 20 · date de naissance 10 · lieu 10 · intention 10.
  const completion =
    (photos.length > 0 ? 30 : 0) +
    (prof.bio ? 20 : 0) +
    (prof.prompts.length > 0 ? 20 : 0) +
    (prof.birthDate ? 10 : 0) +
    (prof.city || prof.country ? 10 : 0) +
    (prof.intent ? 10 : 0);
  const likesReceived = likesData?.count ?? 0;
  const matchCount = matchesData?.matches.length ?? 0;
  // Task 52 : sections d'héritage renseignées (progression honnête, 0 si vide).
  const hg = prof.heritage;
  const hgFilled = hg ? HERITAGE_SECTIONS.filter((s) => sectionFilled(hg, s.key) > 0).length : 0;

  return (
    <div className="app page-profile">
      <header className="wizard-head plain"><h1>Mon profil</h1></header>

      {/* Mission V18 (B.6) — « Ta raison d'être ici » : TOUJOURS visible,
          en tête de profil. Bascule bidirectionnelle réversible à l'infini. */}
      <article className="card raison-card-profile">
        <h3>Ta raison d&apos;être ici</h3>
        <div className={`raison-now raison-now-${prof.raison}`}>
          <span className="raison-ico" aria-hidden="true">{RAISON_ICONS[prof.raison]}</span>
          <div>
            <strong>{LABELS.raison[prof.raison] ?? prof.raison}</strong>
            <p className="hint">{RAISON_DETAIL[prof.raison]}</p>
          </div>
        </div>
        {prof.raison === 'voyage' && prof.raisonPauseReason && (
          <p className="raison-motif">
            <span className="hint">Ton motif de pause :</span> « {prof.raisonPauseReason} »
          </p>
        )}
        {raisonErreur && <p className="error">{raisonErreur}</p>}

        {prof.raison === 'rencontre' && (
          <>
            {!pauseOuverte ? (
              <button type="button" className="btn ghost" onClick={() => setPauseOuverte(true)} disabled={raisonBusy}>
                Mettre la rencontre en pause
              </button>
            ) : (
              <div className="raison-pause-form">
                <label className="field">
                  <span>Motif (optionnel — restera dans ton profil)</span>
                  <textarea
                    value={pauseMotif}
                    onChange={(e) => setPauseMotif(e.target.value.slice(0, 300))}
                    placeholder="Ex. : je me concentre sur mon parcours, rien d'autre."
                    rows={2}
                    maxLength={300}
                  />
                </label>
                <p className="hint tiny">
                  Tes conversations, tes matchs et tes messages sont TOUTES conservées — la pause
                  te rend seulement invisible dans la découverte. Tu pourras réactiver en un clic.
                </p>
                <div className="raison-pause-actions">
                  <button
                    type="button"
                    className="btn primary"
                    disabled={raisonBusy}
                    onClick={() => void changerRaison('voyage', pauseMotif.trim() || undefined)}
                  >
                    {raisonBusy ? 'Enregistrement…' : 'Confirmer la pause'}
                  </button>
                  <button type="button" className="btn ghost" onClick={() => setPauseOuverte(false)} disabled={raisonBusy}>
                    Annuler
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {prof.raison === 'voyage' && (
          <button type="button" className="btn primary" onClick={reactiverRencontre} disabled={raisonBusy}>
            Réactiver la rencontre
          </button>
        )}

        {prof.raison === 'indecis' && (
          <div className="raison-pause-actions">
            <button type="button" className="btn ghost" onClick={() => void changerRaison('voyage')} disabled={raisonBusy}>
              🪞 Voyager en moi
            </button>
            <button type="button" className="btn primary" onClick={reactiverRencontre} disabled={raisonBusy}>
              💞 Ouvrir la rencontre
            </button>
          </div>
        )}
      </article>

      {!prof.profileComplete && (
        <p className="hint mode-note">
          Ton profil est incomplet — complète-le (photos, prompts, préférences) pour apparaître
          dans la découverte.
        </p>
      )}

      {/* Complétion + stats (Task 31) — données réelles, jamais gonflées */}
      <div className="prof-complete">
        <div
          className={`prof-ring ${prefs?.modeDefault === 'invisible' ? 'inv' : ''}`}
          style={{ '--p': completion } as CSSProperties}
          role="img"
          aria-label={`Profil complété à ${completion} %`}
        >
          <span>{completion}%</span>
        </div>
        <div className="prof-complete-txt">
          <strong>Profil complété à {completion} %</strong>
          {/* Task 32 (réf. Invisible §4.6) : badge « Mode Invisible actif »
              quand le mode par défaut est Invisible — anneau violet assorti. */}
          {prefs?.modeDefault === 'invisible' && (
            <span className="chip-inv-active" title="Tes photos sont servies floutées aux autres membres — toi, tu vois tout.">
              🕯️ Mode Invisible actif
            </span>
          )}
          <span>
            {completion >= 100
              ? 'Parfait — tu apparaisses dans les meilleures conditions.'
              : 'Ajoute photos, bio et prompts pour briller dans la Découverte.'}
          </span>
        </div>
      </div>

      <div className="prof-stats">
        <div className="prof-stat">
          <strong>{likesReceived}</strong>
          <span>♥ Likes reçus</span>
        </div>
        <div className="prof-stat">
          <strong>{matchCount}</strong>
          <span>⚡ Matchs</span>
        </div>
        <div className="prof-stat">
          <strong>{photos.length}</strong>
          <span>📸 Photos</span>
        </div>
      </div>

      {/* La carte telle que l'autre la voit */}
      <article className="profile-card">
        <div className={`profile-photo ${main ? '' : 'empty'}`}>
          {main ? (
            <img src={(main.urlFull ?? main.urlThumb)!} alt="Ma photo principale" />
          ) : (
            <span aria-hidden="true">✨</span>
          )}
          {prof.profileComplete && (
            <span className="chip chip-conv classic profile-complete-chip">Profil complet</span>
          )}
        </div>

        {photos.length > 1 && (
          <div className="profile-thumbs" role="tablist" aria-label="Mes photos">
            {photos.map((p, i) => (
              <button
                key={p.id}
                type="button"
                role="tab"
                aria-selected={i === photoIdx}
                className={`profile-thumb ${i === photoIdx ? 'active' : ''}`}
                onClick={() => setPhotoIdx(i)}
              >
                <img src={(p.urlThumb ?? p.urlFull)!} alt={`Ma photo ${i + 1}`} loading="lazy" />
              </button>
            ))}
          </div>
        )}

        <div className="profile-id">
          <h2>
            {prof.displayName ?? 'Ton nom'}
            {age != null && <span>, {age}</span>}
          </h2>
          {(prof.neighborhood || prof.city || prof.country) && (
            <p className="profile-loc">
              📍 {[prof.neighborhood, prof.city, prof.country].filter(Boolean).join(', ')}
            </p>
          )}
          {prof.intent && (
            <p className="profile-intent">
              <span className="chip chip-pers">🎯 {LABELS.intent[prof.intent] ?? prof.intent}</span>
            </p>
          )}
        </div>

        {prof.bio && <p className="profile-bio">{prof.bio}</p>}

        {prof.prompts.length > 0 && (
          <div className="profile-prompts">
            {prof.prompts.map((p) => (
              <div key={p.key} className="prompt-card">
                <p className="prompt-q">{promptLabel(p.key)}</p>
                <p className="prompt-a">{p.answer}</p>
              </div>
            ))}
          </div>
        )}
      </article>

      {/* Personnalité — même bloc que le compte (badge + raffinement/choix) */}
      <PersonalityBadge onOpen={() => setShowPers((v) => !v)} />
      {showPers && <PersonalityProposal refine />}

      {/* Task 52 — Héritage culturel : aperçu + accès à l'écran #/heritage.
          100 % additif : la carte n'apparaît QUE si le membre a ouvert
          l'héritage (sinon un simple appel à remplir). */}
      <article className="card profile-heritage">
        <h3>🌍 Mon héritage culturel</h3>
        {prof.heritage ? (
          <>
            <div className="hg-chips hg-preview">
              {heritageChips(prof.heritage).map((c) => (
                <span key={c} className="chip hg-chip">
                  {c}
                </span>
              ))}
            </div>
            <p className="hint">
              {hgFilled}/7 sections renseignées — les sections Valeurs et Projets restent privées.
            </p>
          </>
        ) : (
          <p className="hint">
            Partage tes langues, origines, traditions et goûts — la richesse des différences, mise en valeur dans l&apos;univers Cultures. Facultatif, modifiable, effaçable.
          </p>
        )}
        <button type="button" className="btn ghost small" onClick={onHeritage}>
          {prof.heritage ? 'Modifier mon héritage' : 'Remplir mon héritage'}
        </button>
      </article>

      {prof.raison === 'rencontre' && prefs && (
        <article className="card profile-prefs">
          <h3>Mes préférences de découverte</h3>
          <p className="hint">
            Mode par défaut : <strong>{LABELS.mode[prefs.modeDefault] ?? prefs.modeDefault}</strong>
            {' · '}Montre-moi : <strong>{LABELS.prefGender[prefs.prefGender] ?? prefs.prefGender}</strong>
            {' · '}Âge : <strong>{prefs.minAge}–{prefs.maxAge} ans</strong>
            {' · '}Distance : <strong>{prefs.distanceKm} km</strong>
            {prefs.prefIntent && (
              <>
                {' · '}Intention : <strong>{LABELS.intent[prefs.prefIntent] ?? prefs.prefIntent}</strong>
              </>
            )}
          </p>
        </article>
      )}

      <div className="btn-col profile-actions">
        <button type="button" className="btn primary" onClick={onEdit}>
          Modifier mon profil
        </button>
        <button type="button" className="btn ghost" onClick={onQuestionnaire}>
          Mon questionnaire
        </button>
        <button type="button" className="btn ghost" onClick={onSettings}>
          Paramètres &amp; compte
        </button>
      </div>
    </div>
  );
}
