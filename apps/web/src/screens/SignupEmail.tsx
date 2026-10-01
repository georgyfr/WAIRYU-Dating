/**
 * Task 58 (fondateur) — inscription « classique » : pseudo + mot de passe,
 * SANS email ni code à attendre. Après création (session auto-établie côté
 * serveur), l'écran identifiants affiche UNE fois :
 *   - le @pseudo de connexion (+ conseil d'enregistrement du mot de passe
 *     dans le gestionnaire du téléphone — c'est lui qui se remplira tout seul) ;
 *   - le CODE DE RÉCUPÉRATION 12 caractères (copie/partage/notepad) — la clé
 *     pour retrouver le compte SANS email ;
 *   - un champ email de récupération FACULTATIF (Task 58) ;
 *   - la carte notification de bienvenue (Task 59) : active les push et
 *     reçois les félicitations — la preuve vivante que ça marche.
 * Le pseudo accepte espaces/accents/tirets/apostrophes (Task 61) : la forme
 * canonique côté serveur fait que « Marie Claire » ≡ « marie claire ».
 */

import { useState } from 'react';
import { api } from '../lib/api';
import { Turnstile } from '../lib/turnstile';
import { SocialButtons } from '../lib/social';
import { AuthAlt } from '../components/AuthAlt'; // t71 : bloc « autres voies » doux et lisible
import { pushSupported } from '../lib/push-client';
import { BIRTH_MIN, birthDateMax, estMajeur } from '../lib/age';
import type { AuthConfigResponse } from '@wairyu/shared';

interface RegisterResponse {
  userId: string;
  username: string;
  recoveryCode: string;
  created: true;
}

interface Props {
  config: AuthConfigResponse | null;
}

/** Pseudo AFFICHÉ : lettres/chiffres/espaces/point/virgule/apostrophes/tirets, 3..20. */
const USERNAME_DISPLAY_RE = /^[\p{L}\p{N} .,'’_-]{3,20}$/u;

/** Copie silencieuse (fallback du partage) — feedback via l'état retourné. */
async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Task 59 — carte « notification de bienvenue » (félicitations).
// ---------------------------------------------------------------------------
export function WelcomePush() {
  const [state, setState] = useState<'idle' | 'busy' | 'sent' | 'denied' | 'unsupported' | 'server-off' | 'error'>(
    'idle',
  );

  async function arm() {
    setState('busy');
    try {
      // 1. Permission navigateur (mobile : le prompt OS suit l'appui).
      const perm = await Notification.requestPermission();
      if (perm !== 'granted') {
        // 'default' encore (prompt jeté) → traité comme refus doux.
        setState('denied');
        return;
      }
      // 2. Abonnement + enregistrement serveur (pipeline Task 53).
      const { activateWebPush } = await import('../lib/push-client');
      const res = await activateWebPush();
      if (res !== 'granted') {
        setState(res === 'server-off' ? 'server-off' : 'denied');
        return;
      }
      // 3. La notification de félicitations (VRAI push, même app fermée).
      try {
        await api('/api/push/welcome', { method: 'POST' });
      } catch {
        /* l'abonnement reste actif même si le push de félicitations échoue */
      }
      setState('sent');
    } catch {
      setState('error');
    }
  }

  return (
    <div className="welcome-push" role="region" aria-label="Notification de bienvenue">
      <p className="cred-title">🔔 Ta notification de bienvenue</p>
      {state === 'idle' && (
        <>
          <p className="cred-note">
            Dernière étape : <strong>active les notifications</strong> pour recevoir les messages et les matchs
            même quand l'application est fermée — comme un SMS. Tu recevras tout de suite une notification de
            bienvenue, et tu vérifieras d'un coup d'œil que tout fonctionne sur ton téléphone.
          </p>
          <button type="button" className="btn primary" onClick={() => void arm()}>
            🔔 Activer et recevoir mes félicitations
          </button>
        </>
      )}
      {state === 'busy' && (
        <p className="cred-note">Activation en cours… si ton téléphone affiche « Autoriser les notifications », accepte !</p>
      )}
      {state === 'sent' && (
        <p className="cred-note success">
          🎉 <strong>C'est envoyé !</strong> Regarde ton écran : la notification « WAIRYU » vient d'arriver avec
          tes félicitations. Messages et matchs t'annonceront comme ça, même app fermée.
        </p>
      )}
      {state === 'denied' && (
        <p className="cred-note">
          Les notifications sont restées désactivées. Tu pourras les activer plus tard dans les réglages de ton
          téléphone (ou depuis Paramètres dans l'application). Tu peux continuer, rien n'est bloqué.
        </p>
      )}
      {state === 'unsupported' && (
        <p className="cred-note">
          Ce navigateur ne gère pas encore les notifications. Sur iPhone, installe l'application sur l'écran
          d'accueil (Partager → « Sur l'écran d'accueil ») pour les débloquer.
        </p>
      )}
      {state === 'server-off' && (
        <p className="cred-note">
          Les notifications ne sont pas encore disponibles sur ce serveur. Tu peux continuer — tu pourras les
          activer plus tard.
        </p>
      )}
      {state === 'error' && (
        <>
          <p className="cred-note">
            L'envoi n'a pas abouti (réseau ?). Tu peux réessayer, ou simplement continuer — tu pourras activer
            les notifications depuis Paramètres.
          </p>
          <button type="button" className="btn ghost small" onClick={() => void arm()}>
            Réessayer
          </button>
        </>
      )}
      {!pushSupported() && state === 'idle' && (
        <p className="hint tiny">Un seul appui — la demande du téléphone peut suivre.</p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Écran identifiants (après création de compte).
// ---------------------------------------------------------------------------
function Credentials({ data }: { data: RegisterResponse }) {
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  async function copy(value: string, tag: string) {
    if (await copyText(value)) {
      setCopied(tag);
      setTimeout(() => setCopied(null), 2200);
    }
  }

  async function share() {
    const text = `Mes identifiants wairyu :\nPseudo : @${data.username}\nCode de récupération : ${data.recoveryCode}\nÀ noter précieusement.`;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Mes identifiants wairyu', text });
      } else {
        await copy(text, 'partage');
      }
    } catch {
      /* partage annulé — bénin */
    }
  }

  async function submitEmail(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setError('Cette adresse email semble invalide.');
      return;
    }
    setSaving(true);
    try {
      await api('/api/auth/account/recovery-email', { json: { email: email.trim() } });
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inattendue.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="card">
      <h2>C'est fait, bienvenue !</h2>
      <p className="hint">
        Ton compte est créé et tu es connecté·e. Prends 30 secondes pour noter tes identifiants — c'est la clé
        pour toujours retrouver ton compte.
      </p>

      <div className="cred-block">
        <p className="cred-title">Ton identifiant de connexion</p>
        <p className="cred-username">@{data.username}</p>
        <p className="cred-note">
          Ton navigateur t'a peut-être proposé <strong>d'enregistrer ton mot de passe</strong> : accepte ! Il
          sera gardé dans le gestionnaire de mots de passe de ton téléphone (protégé par ton schéma/empreinte)
          et se remplira tout seul la prochaine fois. Tu pourras le consulter à tout moment dans les paramètres
          de ton téléphone, rubrique « Gestionnaire de mots de passe ».
        </p>
      </div>

      <div className="cred-block">
        <p className="cred-title">Ton code de récupération</p>
        <p className="recovery-code" aria-label="Code de récupération">
          {data.recoveryCode}
        </p>
        <p className="cred-note">
          <strong>Note ce code dans ton cahier ou ton téléphone.</strong> Si tu oublies ton mot de passe, ce
          code te permettra de reprendre ton compte — même sans email. Il ne s'affichera plus jamais après cet
          écran.
        </p>
        <div className="cred-actions">
          <button type="button" className="btn ghost small" onClick={() => void copy(data.recoveryCode, 'code')}>
            {copied === 'code' ? '✓ Copié' : 'Copier le code'}
          </button>
          <button type="button" className="btn ghost small" onClick={() => void share()}>
            {copied === 'partage' ? '✓ Enregistré' : 'Partager / enregistrer'}
          </button>
        </div>
      </div>

      <div className="cred-block">
        <p className="cred-title">Email de récupération (recommandé, facultatif)</p>
        {saved ? (
          <p className="cred-note success">
            Email enregistré ✓ — il servira uniquement à retrouver ton mot de passe en cas de perte. Il
            n'apparaîtra jamais sur ton profil.
          </p>
        ) : (
          <form onSubmit={submitEmail} noValidate>
            <p className="cred-note">
              Il servira <strong>uniquement à retrouver ton mot de passe</strong> en cas de perte. Il
              n'apparaîtra jamais sur ton profil, et tu peux aussi tout à fait l'ignorer — ton code de
              récupération suffit.
            </p>
            <label className="field">
              <span>Ton email (facultatif)</span>
              <input
                type="email"
                name="email"
                autoComplete="email"
                inputMode="email"
                placeholder="toi@exemple.com"
                value={email}
                onChange={(e2) => setEmail(e2.target.value)}
              />
            </label>
            {error && <p className="error">{error}</p>}
            <button type="submit" className="btn ghost small" disabled={saving}>
              {saving ? 'Enregistrement…' : 'Enregistrer mon email'}
            </button>
          </form>
        )}
      </div>

      <WelcomePush />

      <button
        type="button"
        className="btn primary"
        onClick={() => {
          window.location.hash = '#/discover';
          window.location.reload();
        }}
      >
        Découvrir wairyu →
      </button>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Formulaire d'inscription classique.
// ---------------------------------------------------------------------------
export function SignupEmail({ config }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [birthDate, setBirthDate] = useState('');
  const [adult, setAdult] = useState(false);
  const [terms, setTerms] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientError, setClientError] = useState<string | null>(null);
  const [created, setCreated] = useState<RegisterResponse | null>(null);

  if (created) return <Credentials data={created} />;

  function validate(): string | null {
    const u = username.trim().replace(/\s+/g, ' ');
    if (!USERNAME_DISPLAY_RE.test(u)) {
      return 'Le pseudo doit contenir entre 3 et 20 caractères : lettres (accents acceptés), chiffres, espaces, tirets ou apostrophes.';
    }
    if (password.length < 8) return 'Le mot de passe doit contenir au moins 8 caractères.';
    if (password !== confirm) return 'Les deux mots de passe ne sont pas identiques.';
    // P0 âge (33-c) : la date de naissance est exigée par l'API — pré-validation.
    if (!birthDate) return 'Indique ta date de naissance.';
    if (!estMajeur(birthDate)) return 'Tu dois avoir 18 ans révolus pour créer un compte wairyu.';
    if (!adult) return 'Tu dois avoir 18 ans ou plus pour créer un compte wairyu.';
    if (!terms) return 'Les CGU et la politique de confidentialité doivent être acceptées.';
    return null;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setClientError(null);
    const problem = validate();
    if (problem) {
      setClientError(problem);
      return;
    }
    setBusy(true);
    try {
      const res = await api<RegisterResponse>('/api/auth/password/register', {
        // P0 âge (33-c) : la birthDate (validée ci-dessus) est exigée par
        // l'API AVANT tout INSERT users (mineur → 403, aucun compte).
        json: {
          username: username.trim(),
          password,
          birthDate,
          turnstile_token: token,
        },
      });
      setCreated(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inattendue.');
      setBusy(false);
    }
  }

  return (
    <section className="card">
      <button type="button" className="back" onClick={() => (window.location.hash = '#/')}>
        ← Retour
      </button>
      <h2>Crée ton compte</h2>
      <p className="hint">
        Choisis un pseudo et un mot de passe — rien d'autre. Pas d'email obligatoire, pas de code à attendre.
      </p>

      <form onSubmit={submit} noValidate>
        <label className="field">
          <span>Ton pseudo de connexion</span>
          <input
            type="text"
            name="username"
            autoComplete="username"
            inputMode="text"
            placeholder="ex : marie23, joe_douala"
            value={username}
            onChange={(e2) => setUsername(e2.target.value)}
            autoFocus
            maxLength={20}
          />
        </label>
        <p className="hint tiny">
          3 à 20 caractères : lettres, chiffres, espaces, tirets ou apostrophes (ex. « Marie Claire », «
          Jean-Paul »). C'est le nom que tu utiliseras à chaque connexion — à l'ouverture, les espaces et
          majuscules ne comptent pas, impossible de te tromper.
        </p>

        <label className="field">
          <span>Mot de passe</span>
          <div className="pw-wrap">
            <input
              type={showPw ? 'text' : 'password'}
              name="new-password"
              autoComplete="new-password"
              placeholder="au moins 8 caractères"
              value={password}
              onChange={(e2) => setPassword(e2.target.value)}
              maxLength={128}
            />
            <button
              type="button"
              className="pw-toggle"
              onClick={() => setShowPw((v) => !v)}
              aria-label={showPw ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
            >
              {showPw ? 'Masquer' : 'Afficher'}
            </button>
          </div>
        </label>

        <label className="field">
          <span>Confirmer le mot de passe</span>
          <input
            type={showPw ? 'text' : 'password'}
            name="confirm-new-password"
            autoComplete="new-password"
            placeholder="retape le même mot de passe"
            value={confirm}
            onChange={(e2) => setConfirm(e2.target.value)}
            maxLength={128}
          />
        </label>

        <label className="field">
          <span>Date de naissance</span>
          <input
            type="date"
            name="birthDate"
            autoComplete="bday"
            required
            min={BIRTH_MIN}
            max={birthDateMax()}
            value={birthDate}
            onChange={(e2) => {
              setBirthDate(e2.target.value);
              setClientError(null);
            }}
          />
        </label>
        <p className="hint tiny">wairyu est réservée aux personnes majeures (18 ans révolus).</p>

        <label className="check">
          <input type="checkbox" checked={adult} onChange={(e2) => setAdult(e2.target.checked)} />
          <span>
            J'ai <strong>18 ans ou plus</strong> — wairyu est réservée aux adultes.
          </span>
        </label>

        <label className="check">
          <input type="checkbox" checked={terms} onChange={(e2) => setTerms(e2.target.checked)} />
          <span>
            J'accepte les{' '}
            <a href="/legal/cgu.md" target="_blank" rel="noreferrer">
              CGU
            </a>{' '}
            et la{' '}
            <a href="/legal/politique.md" target="_blank" rel="noreferrer">
              politique de confidentialité
            </a>
            .
          </span>
        </label>

        {config?.turnstileSiteKey && <Turnstile siteKey={config.turnstileSiteKey} onToken={setToken} />}

        {clientError && <p className="error">{clientError}</p>}
        {error && <p className="error">{error}</p>}

        <button type="submit" className="btn primary" disabled={busy}>
          {busy ? 'Création du compte…' : 'Créer mon compte'}
        </button>
      </form>

      <SocialButtons
        config={config}
        birthDate={estMajeur(birthDate) ? birthDate : undefined}
        requireConsent={!adult || !terms || !estMajeur(birthDate)}
        onConsentBlocked={() =>
          setError(
            'Indique ta date de naissance (18 ans révolus) puis coche les deux cases ci-dessus : 18 ans ou plus et acceptation des CGU.',
          )
        }
      />

      <AuthAlt
        items={[
          { to: '#/login-email', icon: '🔑', label: 'Se connecter avec un pseudo', accent: true },
          { to: '#/signup', icon: '📧', label: "S'inscrire avec un email" },
          { to: '#/login', icon: '📧', label: 'Déjà un compte ? Connexion par email' },
        ]}
      />
    </section>
  );
}
