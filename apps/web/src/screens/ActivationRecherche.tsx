/**
 * Mission V18 (B.2) — séquence de recherche après « Oui, ouvrir la rencontre ».
 *
 * L'utilisateur a DÉCIDÉ (B.1) : la rencontre est déjà activée. Cette
 * séquence complète la configuration de recherche, dans l'ordre demandé :
 *   ① Qui cherches-tu (hommes / femmes / les deux — bi et gay sont des
 *      orientations pleinement légitimes : « les deux » n'est jamais un
 *      choix dégradé) + ton orientation + ton intention ;
 *   ② la fenêtre d'âge (curseurs) ;
 *   ③ la proximité (distance km) ;
 *   ④ le récapitulatif honnête de ce qui existe déjà : intention (quête 2.5),
 *      non-négociables (2.3), réalités (2.4) — réponses déjà posées dans le
 *      parcours, JAMAIS re-demandées ici, complétées dans le carnet.
 *
 * Rien n'est obligatoire pour finir : la décision « Oui » suffit — la
 * séquence affine, elle ne conditionne rien. Tous les écrans respectent les
 * cibles tactiles 44 px (a11y) et le ton non prescriptif de l'app.
 */
import { useCallback, useEffect, useState } from 'react';
import { api } from '../lib/api';
import { invalidateSwr } from '../lib/swr';
import { INTENTS, LABELS } from '@wairyu/shared';
import type {
  DoctrineBankState,
  Intent,
  Orientation,
  PreferencesDto,
  ProfileResponse,
  Raison,
} from '@wairyu/shared';

interface Props {
  onDone: () => void;
  /** Retour au carnet sans rien configurer — la rencontre reste ouverte. */
  onCancel: () => void;
}

/** Quêtes récapitulées à l'étape ④ (codes préfixe — banque doctrine). */
const RECAP_QUETES: { prefix: string; titre: string; monde: string }[] = [
  { prefix: 'Q2.5', titre: 'Ton intention affichée', monde: 'M3 · 2.5' },
  { prefix: 'Q2.3', titre: 'Tes non-négociables', monde: 'M3 · 2.3' },
  { prefix: 'Q2.4', titre: 'Tes réalités', monde: 'M3 · 2.4' },
];

export function ActivationRecherche({ onDone, onCancel }: Props) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wrongRaison, setWrongRaison] = useState(false);

  // --- préremplissage depuis le profil existant
  const [orientation, setOrientation] = useState<Orientation | ''>('');
  const [intent, setIntent] = useState<Intent | ''>('');
  const [prefGender, setPrefGender] = useState<PreferencesDto['prefGender']>('everyone');
  const [minAge, setMinAge] = useState(25);
  const [maxAge, setMaxAge] = useState(45);
  const [distanceKm, setDistanceKm] = useState(100);
  const [prefOrientation, setPrefOrientation] = useState<PreferencesDto['prefOrientation']>('everyone');

  // --- récap ④ : réponses doctrine déjà posées (2.5 / 2.3 / 2.4)
  const [recap, setRecap] = useState<{ titre: string; monde: string; n: number }[]>([]);

  const load = useCallback(async () => {
    try {
      const p = await api<ProfileResponse>('/api/profile');
      if (((p.raison as Raison) ?? 'indecis') !== 'rencontre') {
        // La séquence n'appartient qu'au bassin rencontre (verrou A.4) —
        // arrivé ici par URL forgée : retour silencieux.
        setWrongRaison(true);
        setLoading(false);
        return;
      }
      setOrientation((p.orientation as Orientation) ?? '');
      setIntent((p.intent as Intent) ?? '');
      if (p.preferences) {
        setPrefGender(p.preferences.prefGender);
        setPrefOrientation(p.preferences.prefOrientation);
        setMinAge(p.preferences.minAge);
        setMaxAge(p.preferences.maxAge);
        setDistanceKm(p.preferences.distanceKm);
        if (p.preferences.prefIntent) setIntent(p.preferences.prefIntent);
      }
      // Récap ④ — depuis la banque doctrine (AUCUN filtre par raison : D.2).
      try {
        const d = await api<DoctrineBankState>('/api/qd');
        setRecap(
          RECAP_QUETES.map((q) => ({
            titre: q.titre,
            monde: q.monde,
            n: Object.keys(d.myAnswers ?? {}).filter((code) => code.startsWith(`${q.prefix}-`)).length,
          })),
        );
      } catch {
        setRecap(RECAP_QUETES.map((q) => ({ titre: q.titre, monde: q.monde, n: 0 })));
      }
    } catch {
      setError('Impossible de charger ton profil — réessaie.');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  /** ① orientation + intention — écrits via PUT /api/profile (rencontre). */
  async function saveStep1(): Promise<boolean> {
    try {
      await api('/api/profile', {
        method: 'PUT',
        json: {
          ...(orientation ? { orientation } : {}),
          ...(intent ? { intent } : {}),
        },
      });
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inattendue.');
      return false;
    }
  }

  /** ②③ âges + distance (le mode est conservé tel quel) — préférences. */
  async function savePrefs(): Promise<boolean> {
    try {
      await api('/api/profile/preferences', {
        method: 'PUT',
        json: {
          modeDefault: 'classic',
          prefGender,
          prefOrientation,
          minAge,
          maxAge,
          distanceKm,
          prefIntent: null,
        },
      });
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inattendue.');
      return false;
    }
  }

  async function next() {
    setError(null);
    setBusy(true);
    let ok = true;
    if (step === 1) ok = await saveStep1();
    if (ok && step >= 2) ok = await savePrefs();
    if (ok) {
      if (step < 4) setStep((s) => s + 1);
      else {
        // La découverte est ouverte : le cache profil est périmé (raison, prefs).
        invalidateSwr('profile');
        onDone();
      }
    }
    setBusy(false);
  }

  if (loading) {
    return (
      <div className="app">
        <p className="status"><span className="dot" /> Préparation…</p>
      </div>
    );
  }

  if (wrongRaison) {
    return (
      <div className="app">
        <header className="wizard-head">
          <h1>Ouvrir la rencontre</h1>
        </header>
        <p className="hint">
          Cette séquence s&apos;ouvre quand la rencontre est activée — ce n&apos;est pas encore ton
          cas. Ton parcours continue inchangé.
        </p>
        <button type="button" className="btn primary" onClick={onCancel}>
          Retour à mon parcours
        </button>
      </div>
    );
  }

  const stepOk = step !== 1 || (orientation !== '' && intent !== '');

  return (
    <div className="app">
      <header className="wizard-head">
        {step > 1 && step < 4 ? (
          <button type="button" className="back" onClick={() => setStep((s) => Math.max(1, s - 1))} aria-label="Retour">‹</button>
        ) : (
          <button type="button" className="back" onClick={onCancel} aria-label="Quitter">‹</button>
        )}
        <h1>Ta recherche</h1>
      </header>
      <div className="q-progress">
        <div className="q-progress-bar">
          <div className="q-progress-fill" style={{ width: `${(step / 4) * 100}%` }} />
        </div>
        <span className="q-progress-label">Étape {step} sur 4 — la rencontre est déjà ouverte</span>
      </div>

      {error && <p className="error">{error}</p>}

      {step === 1 && (
        <div className="wizard-body">
          <div className="field">
            <span>Ton orientation</span>
            <div className="choice-row">
              {(['straight', 'gay', 'bi', 'other'] as const).map((o) => (
                <button
                  key={o}
                  type="button"
                  className={`choice ${orientation === o ? 'on' : ''}`}
                  aria-pressed={orientation === o}
                  onClick={() => setOrientation(o)}
                >
                  {LABELS.orientation[o]}
                </button>
              ))}
            </div>
            <p className="hint tiny">Chaque orientation compte pareil — « bisexuel·le » et « gay » sont des réponses entières, pas des entre-deux.</p>
          </div>
          <div className="field">
            <span>Tu cherches…</span>
            <div className="choice-row">
              {(['women', 'men', 'everyone'] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  className={`choice ${prefGender === g ? 'on' : ''}`}
                  aria-pressed={prefGender === g}
                  onClick={() => setPrefGender(g)}
                >
                  {LABELS.prefGender[g]}
                </button>
              ))}
            </div>
          </div>
          <div className="field">
            <span>Ton intention</span>
            <div className="choice-row">
              {INTENTS.map((i) => (
                <button
                  key={i}
                  type="button"
                  className={`choice ${intent === i ? 'on' : ''}`}
                  aria-pressed={intent === i}
                  onClick={() => setIntent(i)}
                >
                  {LABELS.intent[i]}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="wizard-body">
          <div className="field">
            <span>Fenêtre d'âge — de {minAge} à {maxAge} ans</span>
            <label className="raison-slider">
              <span>Âge minimum</span>
              <input
                type="range"
                min={18}
                max={99}
                value={minAge}
                onChange={(e) => setMinAge(Math.min(Number(e.target.value), maxAge))}
                aria-label="Âge minimum"
              />
            </label>
            <label className="raison-slider">
              <span>Âge maximum</span>
              <input
                type="range"
                min={18}
                max={99}
                value={maxAge}
                onChange={(e) => setMaxAge(Math.max(Number(e.target.value), minAge))}
                aria-label="Âge maximum"
              />
            </label>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="wizard-body">
          <div className="field">
            <span>Proximité — jusqu'à {distanceKm} km</span>
            <label className="raison-slider">
              <span>Distance</span>
              <input
                type="range"
                min={1}
                max={500}
                value={distanceKm}
                onChange={(e) => setDistanceKm(Number(e.target.value))}
                aria-label="Distance en kilomètres"
              />
            </label>
            <p className="hint tiny">
              Tu pourras aussi ouvrir le mode interracial : rencontres entre continents, portée mondiale.
            </p>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="wizard-body">
          <p className="hint">
            Ta recherche est prête. Voici ce que ton parcours a déjà recueilli — il l&apos;utilisera
            pour affiner qui tu rencontres. Tu peux le compléter à tout moment dans ton carnet.
          </p>
          <div className="raison-recap">
            {recap.map((r) => (
              <div key={r.monde} className="raison-recap-row">
                <span className="raison-recap-monde">{r.monde}</span>
                <strong>{r.titre}</strong>
                <span className={`chip ${r.n > 0 ? 'chip-pers' : ''}`}>
                  {r.n > 0 ? `${r.n} réponse${r.n > 1 ? 's' : ''}` : 'à venir dans ton parcours'}
                </span>
              </div>
            ))}
          </div>
          <p className="hint tiny">
            Ces réponses restent les tiennes — elles nourrissent la compatibilité, jamais le hasard.
          </p>
        </div>
      )}

      <div className="wizard-nav">
        {step < 4 ? (
          <button type="button" className="btn primary" onClick={next} disabled={busy || !stepOk}>
            {busy ? 'Enregistrement…' : 'Continuer'}
          </button>
        ) : (
          <button type="button" className="btn primary" onClick={next} disabled={busy}>
            {busy ? 'Enregistrement…' : 'Découvrir les profils'}
          </button>
        )}
        {step === 1 && (
          <button type="button" className="btn ghost" onClick={onCancel} disabled={busy}>
            Configurer plus tard
          </button>
        )}
      </div>
    </div>
  );
}
