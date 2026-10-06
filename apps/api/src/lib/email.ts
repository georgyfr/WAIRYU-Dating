/**
 * Envoi d'emails OTP (Étape 2).
 * Fournisseur : Brevo (plan gratuit 300 emails/jour, sans carte bancaire).
 * Si BREVO_API_KEY n'est pas posée :
 *   - staging → mode « dev » : le code est renvoyé dans la réponse API
 *     (canal 'dev') pour permettre les tests du parcours complet ;
 *   - production → erreur not_configured (l'email n'est JAMAIS exposé en prod).
 */

import type { Env } from '../env';
import { errors, AppError } from './errors';

const BREVO_URL = 'https://api.brevo.com/v3/smtp/email';

export interface SendOtpResult {
  channel: 'email' | 'dev';
  /** Code en clair — uniquement en mode dev (staging). */
  devCode?: string;
}

export type EmailEnv = Env & { BREVO_API_KEY: string; EMAIL_FROM: string };

export function emailProviderConfigured(env: Env): env is EmailEnv {
  return Boolean(env.BREVO_API_KEY && env.EMAIL_FROM);
}

/** Template email OTP — sobre, mobile-first, sans tracking (aucun pixel). */
export function otpEmailHtml(code: string, minutes: number, created: boolean): string {
  const title = created ? 'Bienvenue sur wairyu' : 'Votre code de connexion wairyu';
  return `<!doctype html><html lang="fr"><body style="margin:0;padding:0;background:#f6f4f1;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:520px;margin:0 auto;padding:32px 24px;">
    <p style="font-size:22px;font-weight:bold;color:#1f2a44;margin:0 0 4px;">w<span style="color:#e0693c;">a</span>iryu</p>
    <h1 style="font-size:18px;color:#1f2a44;margin:16px 0 8px;">${title}</h1>
    <p style="font-size:14px;color:#4a4a4a;line-height:1.6;margin:0 0 20px;">
      Voici votre code à 6 chiffres. Il est valable ${minutes} minutes.
    </p>
    <div style="background:#ffffff;border:1px solid #e5e0da;border-radius:12px;padding:24px;text-align:center;">
      <span style="font-size:34px;letter-spacing:10px;font-weight:bold;color:#1f2a44;">${code}</span>
    </div>
    <p style="font-size:13px;color:#4a4a4a;line-height:1.6;margin:20px 0 0;">
      Vous n'avez pas demandé ce code ? Ignorez cet email — rien ne sera créé sans lui.
      Ne partagez jamais ce code, un membre de l'équipe wairyu ne vous le demandera jamais.
    </p>
  </div></body></html>`;
}

export function otpEmailText(code: string, minutes: number): string {
  return `Votre code wairyu : ${code} (valable ${minutes} minutes).\nNe partagez jamais ce code.\nVous n'avez pas demandé ce code ? Ignorez cet email.`;
}

/**
 * Envoie le code OTP au destinataire.
 * @param created true si le compte sera créé (copie « bienvenue »), false sinon.
 */
export async function sendOtpEmail(
  env: Env,
  to: string,
  code: string,
  created: boolean,
): Promise<SendOtpResult> {
  const minutes = 10;

  // --- Mode dev (staging sans clé) : code renvoyé à l'écran ---
  if (!emailProviderConfigured(env)) {
    if (env.ENVIRONMENT === 'staging') {
      console.log(
        JSON.stringify({ level: 'warn', dev_otp: true, to_domain: to.split('@')[1], code }),
      );
      return { channel: 'dev', devCode: code };
    }
    throw new AppError(
      503,
      'not_configured',
      "L'envoi d'emails n'est pas encore configuré. Revenez très bientôt.",
    );
  }

  // --- Brevo HTTP API (plan gratuit) ---
  const res = await fetch(BREVO_URL, {
    method: 'POST',
    headers: {
      'api-key': env.BREVO_API_KEY,
      'content-type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify({
      sender: { name: 'wairyu', email: env.EMAIL_FROM },
      to: [{ email: to }],
      subject: created
        ? `${code} — confirmez votre inscription wairyu`
        : `${code} — votre code de connexion wairyu`,
      htmlContent: otpEmailHtml(code, minutes, created),
      textContent: otpEmailText(code, minutes),
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    console.error(
      JSON.stringify({
        level: 'error',
        brevo_status: res.status,
        detail: detail.slice(0, 300),
      }),
    );
    throw errors.internal("L'envoi de l'email a échoué. Réessayez dans quelques minutes.");
  }
  return { channel: 'email' };
}

// ---------------------------------------------------------------------------
// Task 58 — « mot de passe oublié » : lien de réinitialisation (1 h)
// ---------------------------------------------------------------------------

/** gabarit HTML — même gabarit que l'OTP (marque, bouton + lien brut). */
function resetEmailHtml(username: string, resetUrl: string, minutes: number): string {
  return `<!doctype html><html lang="fr"><body style="margin:0;padding:0;background:#f6f4f1;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:520px;margin:0 auto;padding:32px 24px;">
    <p style="font-size:22px;font-weight:bold;color:#1f2a44;margin:0 0 4px;">w<span style="color:#e0693c;">a</span>iryu</p>
    <h1 style="font-size:18px;color:#1f2a44;margin:16px 0 8px;">Nouveau mot de passe</h1>
    <p style="font-size:14px;color:#4a4a4a;line-height:1.6;margin:0 0 20px;">
      Bonjour @${username}, vous avez demandé à retrouver l'accès à votre compte.
      Cliquez sur le bouton ci-dessous pour choisir un nouveau mot de passe.
      Ce lien est valable ${minutes} minutes.
    </p>
    <div style="text-align:center;margin:0 0 20px;">
      <a href="${resetUrl}" style="display:inline-block;background:#6c4ab6;color:#ffffff;text-decoration:none;font-size:15px;font-weight:bold;padding:14px 28px;border-radius:999px;">Choisir un nouveau mot de passe</a>
    </div>
    <p style="font-size:13px;color:#4a4a4a;line-height:1.6;margin:0 0 8px;">
      Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :<br>
      <span style="color:#6c4ab6;word-break:break-all;">${resetUrl}</span>
    </p>
    <p style="font-size:13px;color:#4a4a4a;line-height:1.6;margin:20px 0 0;">
      Vous n'avez pas demandé ce changement ? Ignorez cet email — votre mot de passe reste inchangé.
      Astuce : notez votre code de récupération wairyu, il fonctionne même sans email.
    </p>
  </div></body></html>`;
}

function resetEmailText(username: string, resetUrl: string, minutes: number): string {
  return `Bonjour @${username},

Pour choisir un nouveau mot de passe wairyu, ouvrez ce lien (valable ${minutes} minutes) :
${resetUrl}

Vous n'avez pas demandé ce changement ? Ignorez cet email — votre mot de passe reste inchangé.
Astuce : votre code de récupération wairyu fonctionne même sans email.`;
}

export interface SendResetResult {
  channel: 'email' | 'dev';
  /** Lien en clair — uniquement en mode dev (staging). */
  devResetUrl?: string;
}

/** Envoie le lien de reset (60 min). Le jeton brut n'existe qu'à l'envoi. */
export async function sendPasswordResetEmail(
  env: Env,
  to: string,
  username: string,
  token: string,
): Promise<SendResetResult> {
  const minutes = 60;
  const origin =
    env.ENVIRONMENT === 'production'
      ? 'https://wairyu.wairyu.workers.dev'
      : 'https://wairyu-staging.wairyu.workers.dev';
  const resetUrl = `${origin}/#/reset?t=${encodeURIComponent(token)}`;
  if (!emailProviderConfigured(env)) {
    if (env.ENVIRONMENT === 'staging') {
      console.log(JSON.stringify({ level: 'warn', dev_reset: true, to_domain: to.split('@')[1], resetUrl }));
      return { channel: 'dev', devResetUrl: resetUrl };
    }
    throw new AppError(
      503,
      'not_configured',
      "L'envoi d'emails n'est pas encore configuré. Revenez très bientôt.",
    );
  }
  const res = await fetch(BREVO_URL, {
    method: 'POST',
    headers: {
      'api-key': env.BREVO_API_KEY ?? '',
      'content-type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify({
      sender: { name: 'wairyu', email: env.EMAIL_FROM },
      to: [{ email: to }],
      subject: 'Retrouvez l’accès à votre compte wairyu',
      htmlContent: resetEmailHtml(username, resetUrl, minutes),
      textContent: resetEmailText(username, resetUrl, minutes),
    }),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    console.error(JSON.stringify({ level: 'error', brevo_status: res.status, detail: detail.slice(0, 300) }));
    throw errors.internal("L'envoi de l'email a échoué. Réessayez dans quelques minutes.");
  }
  return { channel: 'email' };
}
