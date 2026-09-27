/**
 * Écran « Mon héritage culturel » (Task 52 — reste Task 38 : « Héritage
 * complet (7 sections éditables) = Phase 2 (champs API manquants) »).
 *
 * 7 sections de la spec (« Profil d'Héritage Enrichi ») : Langues, Origines,
 * Ouverture, Traditions, Valeurs, Projets, Affinités — TOUTES optionnelles
 * (« Aucun champ n'est obligatoire ») : la culture est une richesse, pas une
 * case. Les sections Valeurs (religion) et Projets (enfants) sont PRIVÉES :
 * elles ne sortent jamais dans le feed (RGPD art. 9 — le bandeau le dit).
 *
 * Écran 100 % additif : aucune modification du wizard d'onboarding ni des
 * écrans existants (accès depuis Mon profil + route #/heritage).
 * Enregistrement = PUT /api/profile { heritage } (objet complet, l'API
 * sanitise : whitelist, plafonds, échelles 1-5, énumérations strictes).
 */
import { useEffect, useMemo, useState } from 'react';
import { api, ApiError } from '../lib/api';
import { invalidateSwr } from '../lib/swr';
import { COUNTRY_NAMES } from '../lib/geo';
import {
  CUISINES,
  FETES,
  HERITAGE_LABELS,
  HERITAGE_SECTIONS,
  LANGUES,
  MUSIQUES,
  sectionFilled,
} from '../lib/heritage-data';
import type { HeritageLangLevel, HeritageLangSpoken, HeritageProfile } from '@wairyu/shared';

interface Props {
  onBack: () => void;
}

const EMPTY: HeritageProfile = {};

/** Liste de tags : suggestions cliquables + saisie libre, chips retirables. */
function TagsField({
  label,
  hint,
  values,
  suggestions,
  onChange,
  max = 12,
}: {
  label: string;
  hint?: string;
  values: string[] | undefined;
  suggestions: string[];
  onChange: (v: string[]) => void;
  max?: number;
}) {
  const [draft, setDraft] = useState('');
  const list = values ?? [];
  const add = (raw: string) => {
    const t = raw.trim().slice(0, 40);
    if (!t || list.some((x) => x.toLowerCase() === t.toLowerCase()) || list.length >= max) return;
    onChange([...list, t]);
    setDraft('');
  };
  const free = suggestions.filter((s) => !list.some((x) => x.toLowerCase() === s.toLowerCase()));
  return (
    <div className="hg-field">
      <span className="hg-label">{label}</span>
      {hint && <span className="hg-hint">{hint}</span>}
      {list.length > 0 && (
        <div className="hg-chips">
          {list.map((v) => (
            <button key={v} type="button" className="chip hg-chip" onClick={() => onChange(list.filter((x) => x !== v))}>
              {v} <span aria-hidden="true">×</span>
            </button>
          ))}
        </div>
      )}
      <div className="hg-addrow">
        <input
          type="text"
          value={draft}
          maxLength={40}
          placeholder="Ajouter…"
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              add(draft);
            }
          }}
        />
        <button type="button" className="btn ghost small" onClick={() => add(draft)} disabled={!draft.trim() || list.length >= max}>
          ＋
        </button>
      </div>
      {free.length > 0 && list.length < max && (
        <div className="hg-suggest">
          {free.slice(0, 10).map((s) => (
            <button key={s} type="button" className="chip" onClick={() => add(s)}>
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/** Échelle 1-5 (spec §3 — ouverture). */
function ScaleField({
  label,
  value,
  onChange,
  min = 'Pas du tout',
  max = 'Énormément',
}: {
  label: string;
  value: number | undefined;
  onChange: (n: number) => void;
  min?: string;
  max?: string;
}) {
  return (
    <div className="hg-field">
      <span className="hg-label">
        {label}
        {value !== undefined && <strong className="hg-scale-val"> · {value}/5</strong>}
      </span>
      <input
        type="range"
        min={1}
        max={5}
        step={1}
        value={value ?? 3}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-valuetext={value !== undefined ? `${value}/5` : undefined}
      />
      <span className="hg-hint hg-scale-ends">
        <span>{min}</span>
        <span>{max}</span>
      </span>
    </div>
  );
}

/** Choix unique (<select>) avec option vide « Non précisé ». */
function ChoiceField<T extends string>({
  label,
  hint,
  value,
  options,
  onChange,
}: {
  label: string;
  hint?: string;
  value: T | undefined;
  options: Record<string, string>;
  onChange: (v: T | undefined) => void;
}) {
  return (
    <div className="hg-field">
      <span className="hg-label">{label}</span>
      {hint && <span className="hg-hint">{hint}</span>}
      <select value={value ?? ''} onChange={(e) => onChange((e.target.value || undefined) as T | undefined)}>
        <option value="">Non précisé</option>
        {Object.entries(options).map(([k, v]) => (
          <option key={k} value={k}>
            {v}
          </option>
        ))}
      </select>
    </div>
  );
}

/** Texte court / paragraphe. */
function TextField({
  label,
  hint,
  value,
  onChange,
  maxLength = 300,
  multiline = false,
}: {
  label: string;
  hint?: string;
  value: string | undefined;
  onChange: (v: string) => void;
  maxLength?: number;
  multiline?: boolean;
}) {
  return (
    <div className="hg-field">
      <span className="hg-label">{label}</span>
      {hint && <span className="hg-hint">{hint}</span>}
      {multiline ? (
        <textarea
          value={value ?? ''}
          maxLength={maxLength}
          rows={3}
          placeholder="Quelques mots suffisent…"
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          type="text"
          value={value ?? ''}
          maxLength={maxLength}
          placeholder="Ton répondra ici…"
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  );
}

/** Langues parlées : paires (langue, niveau) — spec §2 « sélection multiple + niveau ». */
function LangSpokenField({
  values,
  onChange,
}: {
  values: HeritageLangSpoken[] | undefined;
  onChange: (v: HeritageLangSpoken[]) => void;
}) {
  const list = values ?? [];
  const setRow = (i: number, patch: Partial<HeritageLangSpoken>) => {
    onChange(list.map((r, j) => (j === i ? { ...r, ...patch } : r)));
  };
  return (
    <div className="hg-field">
      <span className="hg-label">Langues parlées</span>
      <span className="hg-hint">Langue + niveau auto-déclaré (maximum 8)</span>
      {list.map((row, i) => (
        <div key={i} className="hg-langrow">
          <select value={row.langue} onChange={(e) => setRow(i, { langue: e.target.value })}>
            <option value="">Langue…</option>
            {LANGUES.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
          <select
            value={row.niveau}
            onChange={(e) => setRow(i, { niveau: e.target.value as HeritageLangLevel })}
          >
            <option value="">Niveau…</option>
            {(Object.entries(HERITAGE_LABELS.langLevel) as [HeritageLangLevel, string][]).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
          <button type="button" className="btn ghost small" aria-label={`Retirer ${row.langue || 'la langue'}`} onClick={() => onChange(list.filter((_, j) => j !== i))}>
            ×
          </button>
        </div>
      ))}
      {list.length < 8 && (
        <button type="button" className="btn ghost small" onClick={() => onChange([...list, { langue: '', niveau: 'b1b2' }])}>
          ＋ Ajouter une langue
        </button>
      )}
    </div>
  );
}

export function Heritage({ onBack }: Props) {
  const [h, setH] = useState<HeritageProfile>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;
    void api<import('@wairyu/shared').ProfileResponse>('/api/profile')
      .then((p) => {
        if (!alive) return;
        setH(p.heritage ?? {});
        setUpdatedAt(p.heritageUpdatedAt ?? null);
      })
      .catch(() => undefined)
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  /** Écriture immuable d'une section (append-only côté état React aussi). */
  function patch<S extends keyof HeritageProfile>(section: S, key: keyof NonNullable<HeritageProfile[S]>, value: unknown) {
    setH((prev) => {
      const cur = (prev[section] ?? {}) as Record<string, unknown>;
      const next = { ...cur, [key]: value };
      // Champ remis à vide → clé déposée (objet compact, équivalent null).
      for (const k of Object.keys(next)) {
        const v = next[k];
        if (v === undefined || (Array.isArray(v) && v.length === 0)) delete next[k];
      }
      const sect = Object.keys(next).length > 0 ? next : undefined;
      const out = { ...prev } as Record<string, unknown>;
      if (sect) out[section] = sect;
      else delete out[section];
      return out as HeritageProfile;
    });
    setSaved(false);
  }

  const filled = useMemo(
    () => HERITAGE_SECTIONS.filter((s) => sectionFilled(h, s.key) > 0).length,
    [h],
  );

  async function save() {
    setBusy(true);
    setError(null);
    try {
      await api('/api/profile', { method: 'PUT', json: { heritage: Object.keys(h).length > 0 ? h : null } });
      invalidateSwr('profile');
      setSaved(true);
      setUpdatedAt(Math.floor(Date.now() / 1000));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Erreur inattendue.');
    } finally {
      setBusy(false);
    }
  }

  async function clearAll() {
    if (!window.confirm('Effacer tout ton héritage culturel ? (réversible — tu pourras le remplir à nouveau)')) return;
    setBusy(true);
    setError(null);
    try {
      await api('/api/profile', { method: 'PUT', json: { heritage: null } });
      invalidateSwr('profile');
      setH({});
      setSaved(true);
      setUpdatedAt(Math.floor(Date.now() / 1000));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Erreur inattendue.');
    } finally {
      setBusy(false);
    }
  }

  const langues = h.langues ?? {};
  const origines = h.origines ?? {};
  const ouverture = h.ouverture ?? {};
  const traditions = h.traditions ?? {};
  const valeurs = h.valeurs ?? {};
  const projets = h.projets ?? {};
  const affinites = h.affinites ?? {};

  if (loading) {
    return (
      <div className="app page-heritage">
        <header className="wizard-head plain">
          <h1>Mon héritage culturel</h1>
        </header>
        <p className="status"><span className="dot" /> Chargement…</p>
      </div>
    );
  }

  return (
    <div className="app page-heritage">
      <header className="wizard-head plain">
        <h1>🌍 Mon héritage culturel</h1>
      </header>

      <p className="hint mode-note">
        Facultatif de bout en bout : remplis ce qui te ressemble, laisse le reste. Dans l&apos;univers
        Cultures, ton résumé (langues, origines, fêtes, cuisine, musique) aide les autres à te
        rencontrer — les sections <strong>Valeurs</strong> et <strong>Projets</strong> restent
        {' '}<strong>privées</strong> (jamais affichées aux autres membres).
      </p>

      <div className="hg-progress" role="status">
        <span>
          {filled > 0 ? `${filled}/7 sections renseignées` : 'Aucune section renseignée'}
          {updatedAt !== null && filled > 0 && ' · enregistré'}
        </span>
        <div className="hg-progress-bar" aria-hidden="true">
          <span style={{ width: `${(filled / 7) * 100}%` }} />
        </div>
      </div>

      {/* --- §1 Langues --- */}
      <details className="hg-section" open={sectionFilled(h, 'langues') === 0}>
        <summary>
          <span className="hg-ico">🗣️</span>
          <span>
            <strong>1. Langues</strong>
            <small>Parler, comprendre, apprendre</small>
          </span>
          {sectionFilled(h, 'langues') > 0 && <span className="chip hg-done">rempli</span>}
        </summary>
        <div className="hg-body">
          <ChoiceField
            label="Langue maternelle"
            value={langues.maternelle}
            options={Object.fromEntries(LANGUES.map((l) => [l, l]))}
            onChange={(v) => patch('langues', 'maternelle', v)}
          />
          <LangSpokenField values={langues.parlees} onChange={(v) => patch('langues', 'parlees', v)} />
          <TagsField
            label="Langues comprises"
            hint="Compréhension orale, sans les parler couramment"
            values={langues.comprises}
            suggestions={LANGUES}
            onChange={(v) => patch('langues', 'comprises', v)}
          />
          <TagsField
            label="Langues souhaitées"
            hint="Celles que tu voudrais apprendre — une belle accroche en conversation"
            values={langues.souhaiteApprendre}
            suggestions={LANGUES}
            onChange={(v) => patch('langues', 'souhaiteApprendre', v)}
          />
          <ChoiceField
            label="Préférence de communication"
            value={langues.preference}
            options={HERITAGE_LABELS.preference}
            onChange={(v) => patch('langues', 'preference', v)}
          />
        </div>
      </details>

      {/* --- §2 Origines --- */}
      <details className="hg-section">
        <summary>
          <span className="hg-ico">🌍</span>
          <span>
            <strong>2. Origines</strong>
            <small>D&apos;où viennent toi et ta famille</small>
          </span>
          {sectionFilled(h, 'origines') > 0 && <span className="chip hg-done">rempli</span>}
        </summary>
        <div className="hg-body">
          <ChoiceField
            label="Pays de naissance"
            value={origines.paysNaissance}
            options={Object.fromEntries(COUNTRY_NAMES.map((p) => [p, p]))}
            onChange={(v) => patch('origines', 'paysNaissance', v)}
          />
          <ChoiceField
            label="Pays de résidence"
            value={origines.paysResidence}
            options={Object.fromEntries(COUNTRY_NAMES.map((p) => [p, p]))}
            onChange={(v) => patch('origines', 'paysResidence', v)}
          />
          <TagsField
            label="Origines familiales"
            hint="Un ou plusieurs pays — tes racines, telles que tu les vis"
            values={origines.originesFamiliales}
            suggestions={COUNTRY_NAMES}
            onChange={(v) => patch('origines', 'originesFamiliales', v)}
          />
          <TextField
            label="Diaspora"
            hint="Ex. : « diaspora africaine en Europe »"
            value={origines.diaspora}
            onChange={(v) => patch('origines', 'diaspora', v)}
          />
          <TextField
            label="Région ou peuple d'origine"
            hint="Ex. : « Bamiléké », « Kabylie », « Bretagne »"
            value={origines.regionOrigine}
            onChange={(v) => patch('origines', 'regionOrigine', v)}
          />
        </div>
      </details>

      {/* --- §3 Ouverture --- */}
      <details className="hg-section">
        <summary>
          <span className="hg-ico">✈️</span>
          <span>
            <strong>3. Ouverture</strong>
            <small>Envie d&apos;apprendre, de voyager, de s&apos;adapter</small>
          </span>
          {sectionFilled(h, 'ouverture') > 0 && <span className="chip hg-done">rempli</span>}
        </summary>
        <div className="hg-body">
          <ScaleField label="Envie d'apprendre une langue" value={ouverture.apprendre} onChange={(n) => patch('ouverture', 'apprendre', n)} min="Ça ne me dit rien" max="Passionné·e" />
          <ScaleField label="Envie de voyager" value={ouverture.voyager} onChange={(n) => patch('ouverture', 'voyager', n)} min="Rester chez moi" max="Partir demain" />
          <ScaleField label="Envie de m'adapter" value={ouverture.sAdapter} onChange={(n) => patch('ouverture', 'sAdapter', n)} min="Je reste moi-même" max="Curieux·se de tout" />
          <ScaleField label="Confort avec les différences" value={ouverture.confort} onChange={(n) => patch('ouverture', 'confort', n)} min="Je préfère le connu" max="Les différences m'enrichissent" />
          <ChoiceField
            label="Relation interculturelle"
            value={ouverture.relationInterculturelle}
            options={HERITAGE_LABELS.relationInterculturelle}
            onChange={(v) => patch('ouverture', 'relationInterculturelle', v)}
          />
          <ChoiceField
            label="Relation à distance"
            value={ouverture.relationDistance}
            options={HERITAGE_LABELS.relationDistance}
            onChange={(v) => patch('ouverture', 'relationDistance', v)}
          />
        </div>
      </details>

      {/* --- §4 Traditions --- */}
      <details className="hg-section">
        <summary>
          <span className="hg-ico">🎉</span>
          <span>
            <strong>4. Traditions</strong>
            <small>Fêtes, rituels, ce qui se transmet</small>
          </span>
          {sectionFilled(h, 'traditions') > 0 && <span className="chip hg-done">rempli</span>}
        </summary>
        <div className="hg-body">
          <TagsField
            label="Fêtes célébrées"
            values={traditions.fetes}
            suggestions={FETES}
            onChange={(v) => patch('traditions', 'fetes', v)}
          />
          <TextField
            label="Rituels importants"
            hint="Ex. : « bénédiction des aînés avant le mariage »"
            value={traditions.rituels}
            onChange={(v) => patch('traditions', 'rituels', v)}
          />
          <TextField
            label="Traditions familiales"
            hint="Ex. : « repas du dimanche chez la grand-mère »"
            value={traditions.familiales}
            onChange={(v) => patch('traditions', 'familiales', v)}
          />
          <ChoiceField
            label="Rapport à la tradition"
            value={traditions.rapport}
            options={HERITAGE_LABELS.rapportTradition}
            onChange={(v) => patch('traditions', 'rapport', v)}
          />
          <TextField
            label="Traditions à transmettre"
            hint="Ce que tu veux garder vivant — la langue, la cuisine, le respect des aînés…"
            value={traditions.aTransmettre}
            onChange={(v) => patch('traditions', 'aTransmettre', v)}
            multiline
          />
        </div>
      </details>

      {/* --- §5 Valeurs (PRIVÉ) --- */}
      <details className="hg-section hg-private">
        <summary>
          <span className="hg-ico">💛</span>
          <span>
            <strong>5. Valeurs</strong>
            <small>Privé — jamais affiché aux autres membres</small>
          </span>
          {sectionFilled(h, 'valeurs') > 0 && <span className="chip hg-done">rempli</span>}
        </summary>
        <div className="hg-body">
          <ChoiceField
            label="Place de la famille"
            value={valeurs.placeFamille}
            options={HERITAGE_LABELS.placeFamille}
            onChange={(v) => patch('valeurs', 'placeFamille', v)}
          />
          <ChoiceField
            label="Rapport à la religion"
            hint="Sensible : cette réponse reste STRICTEMENT privée (RGPD art. 9)"
            value={valeurs.rapportReligion}
            options={HERITAGE_LABELS.rapportReligion}
            onChange={(v) => patch('valeurs', 'rapportReligion', v)}
          />
          <ChoiceField
            label="Rôle des aînés"
            value={valeurs.roleAines}
            options={HERITAGE_LABELS.roleAines}
            onChange={(v) => patch('valeurs', 'roleAines', v)}
          />
          <ChoiceField
            label="Éducation des enfants"
            value={valeurs.educationEnfants}
            options={HERITAGE_LABELS.educationEnfants}
            onChange={(v) => patch('valeurs', 'educationEnfants', v)}
          />
          <ChoiceField
            label="Rôle dans le couple"
            value={valeurs.roleCouple}
            options={HERITAGE_LABELS.roleCouple}
            onChange={(v) => patch('valeurs', 'roleCouple', v)}
          />
        </div>
      </details>

      {/* --- §6 Projets (PRIVÉ) --- */}
      <details className="hg-section hg-private">
        <summary>
          <span className="hg-ico">🌱</span>
          <span>
            <strong>6. Projets</strong>
            <small>Privé — jamais affiché aux autres membres</small>
          </span>
          {sectionFilled(h, 'projets') > 0 && <span className="chip hg-done">rempli</span>}
        </summary>
        <div className="hg-body">
          <ChoiceField
            label="Souhaite des enfants"
            value={projets.enfants}
            options={HERITAGE_LABELS.enfants}
            onChange={(v) => patch('projets', 'enfants', v)}
          />
          <ChoiceField
            label="Éducation des enfants"
            hint="Si tu en veux : dans quelle culture ?"
            value={projets.educationBiculturelle}
            options={HERITAGE_LABELS.educationBiculturelle}
            onChange={(v) => patch('projets', 'educationBiculturelle', v)}
          />
          <ChoiceField
            label="Lieu de vie souhaité"
            value={projets.lieuDeVie}
            options={HERITAGE_LABELS.lieuDeVie}
            onChange={(v) => patch('projets', 'lieuDeVie', v)}
          />
          <ChoiceField
            label="Mobilité"
            value={projets.mobilite}
            options={HERITAGE_LABELS.mobilite}
            onChange={(v) => patch('projets', 'mobilite', v)}
          />
          <TextField
            label="Ton projet de couple"
            hint="Ex. : « construire une famille biculturelle »"
            value={projets.projetCouple}
            onChange={(v) => patch('projets', 'projetCouple', v)}
            multiline
          />
        </div>
      </details>

      {/* --- §7 Affinités --- */}
      <details className="hg-section">
        <summary>
          <span className="hg-ico">🍲</span>
          <span>
            <strong>7. Affinités culturelles</strong>
            <small>Cuisine, musique, arts — points communs</small>
          </span>
          {sectionFilled(h, 'affinites') > 0 && <span className="chip hg-done">rempli</span>}
        </summary>
        <div className="hg-body">
          <TagsField
            label="Cuisines préférées"
            values={affinites.cuisines}
            suggestions={CUISINES}
            onChange={(v) => patch('affinites', 'cuisines', v)}
          />
          <TextField
            label="Plat signature"
            hint="Ex. : « poulet DG », « thieboudienne », « ndolé »"
            value={affinites.platSignature}
            onChange={(v) => patch('affinites', 'platSignature', v)}
          />
          <TagsField
            label="Musiques"
            values={affinites.musiques}
            suggestions={MUSIQUES}
            onChange={(v) => patch('affinites', 'musiques', v)}
          />
          <TextField
            label="Artiste préféré"
            hint="Ex. : « Fela Kuti »"
            value={affinites.artiste}
            onChange={(v) => patch('affinites', 'artiste', v)}
          />
          <TextField
            label="Films / séries"
            value={affinites.filmsSeries}
            onChange={(v) => patch('affinites', 'filmsSeries', v)}
          />
        </div>
      </details>

      {error && <p className="error">{error}</p>}
      {saved && !error && <p className="status ok">✓ Héritage enregistré — visible dans ton univers Cultures.</p>}

      <div className="btn-col hg-actions">
        <button type="button" className="btn primary" onClick={save} disabled={busy}>
          {busy ? 'Enregistrement…' : 'Enregistrer mon héritage'}
        </button>
        <button type="button" className="btn ghost" onClick={onBack} disabled={busy}>
          Retour à mon profil
        </button>
        {filled > 0 && (
          <button type="button" className="btn ghost danger" onClick={clearAll} disabled={busy}>
            Effacer mon héritage
          </button>
        )}
      </div>
    </div>
  );
}
