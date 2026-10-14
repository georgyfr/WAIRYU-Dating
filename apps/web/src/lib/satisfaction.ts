/**
 * Task 66 — la barre de satisfaction (« Ton avis compte »).
 *
 * Demande fondateur : « je souhaiterais que tu crées une barre de section
 * lorsque une quête est terminée pour que la personne évalue… son degré de
 * satisfaction des réponses, tout simplement. Peu importe le degré de
 * satisfaction qu'il mettra, c'est ça qui permettra d'ouvrir une nouvelle
 * quête. »
 *
 * Contrat :
 *  - UNE réponse aux trois choix (mappée 5/3/1) — la note ne change RIEN aux
 *    résultats (aucun scorer ne la lit — jamais).
 *  - Task 78 : la suite n'est plus bloquée — un lien « Passer » ouvre la
 *    suite sans note (marqueur local, jamais envoyé au serveur).
 *  - Un commentaire facultatif (500 caractères max).
 *  - Stockée localement (localStorage « wairyu.satisfaction ») ET copiée vers
 *    POST /api/satisfaction (fire-and-forget : l'avis ne doit jamais bloquer
 *    ni casser le parcours si l'API est indisponible).
 *  - La gate d'ouverture de la quête suivante vit dans Quete.tsx (affichage) —
 *    ce module ne fait que lire/écrire l'avis.
 *
 * Périmètre — Task 73 (retour fondateur « je ne vois pas la barre
 * d'évaluation obligatoire ») : TOUTES les quêtes demandent l'avis —
 * l'intention d'origine. La forme avait d'abord été validée sur 1.3 en
 * vitrine (Task 66). Chaque quête a sa note propre (clé par quêteId).
 *
 * Task 80 — VERSION DE LA QUESTION : la question a changé de forme en Task 78
 * (échelle 1-5 « degré de satisfaction » → « Ce profil te ressemble-t-il ? »,
 * trois choix). Un avis posé sous l'ancienne forme répond à une AUTRE
 * question : il ne doit ni préremplir le formulaire actuel ni éteindre la
 * gate — sinon un membre (ou le fondateur) qui n'avait répondu qu'à
 * l'ancienne échelle ne verrait JAMAIS la nouvelle question ni l'info-bulle
 * du renvoi. La marque de version v règle le cas : entrée sans v:2 = avis de
 * l'ancienne question, ignoré pour l'affichage (les lignes D1 restent
 * l'historique), la nouvelle question est posée une seule fois, proprement.
 */
import { QUETE_IDS } from './quetes';

/** Un avis envoyé : la note (1-5), le commentaire facultatif, l'horodatage. */
export interface AvisSatisfaction {
  note: 1 | 2 | 3 | 4 | 5;
  commentaire: string;
  /** ISO 8601 — informatif (quelle itération de la quête a convaincu). */
  ts: string;
}

/** Clé localStorage — un objet { [queteId]: AvisSatisfaction }. */
const CLE_STOCKAGE = 'wairyu.satisfaction';

/** Les quêtes qui demandent l'avis (gate d'ouverture de la suite) —
 *  TOUTES les quêtes (Task 73, retour fondateur). */
export const QUETES_AVEC_AVIS: ReadonlySet<string> = new Set(QUETE_IDS);

/** Les trois choix de la barre — Task 78 (le fondateur a préféré la
 *  suggestion qui corrige la page) : l'échelle à 5 niveaux ne ressemblait pas
 *  aux réponses de la quête ; les trois choix reprennent les mêmes mots que
 *  le moteur de résultats, ce qui permet de savoir quels paragraphes ne
 *  conviennent pas. Mappés sur les valeurs 5/3/1 de l'échelle 1-5 (la table
 *  D1 et les avis déjà envoyés restent compatibles). */
export const CHOIX_AVIS: readonly { valeur: AvisSatisfaction['note']; cle: string }[] = [
  { valeur: 5, cle: 'Oui, tout à fait' },
  { valeur: 3, cle: 'En partie' },
  { valeur: 1, cle: 'Pas vraiment' },
];

/** Marque de version de la QUESTION posée (Task 80 — voir l'entête).
 *  v2 = « Ce profil te ressemble-t-il ? » (Task 78, forme du fondateur).
 *  Toute entrée sans v:2 date de l'ancienne échelle 1-5 (Task 66-75). */
const VERSION_QUESTION = 2;

/** Garde-fou de forme : 1|2|3|4|5 exactement (jamais « 0 truthy » ni texte). */
function estNote(val: unknown): val is AvisSatisfaction['note'] {
  return val === 1 || val === 2 || val === 3 || val === 4 || val === 5;
}

/** Clé localStorage du marqueur « passé » — un objet { [queteId]: true }. */
const CLE_PASSE = 'wairyu.satisfaction.passe';

/** Task 78 — la suite n'est plus BLOQUÉE par l'avis (suggestion préférée du
 *  fondateur : « ne pas bloquer la suite du voyage tant que la personne n'a
 *  pas répondu : un lien Passer suffit »). Le marqueur est local uniquement —
 *  rien n'est envoyé au serveur (une absence d'avis n'est pas un avis). */
export function lireAvisPasse(queteId: string): boolean {
  try {
    const brut = window.localStorage.getItem(CLE_PASSE);
    if (!brut) return false;
    const tout = JSON.parse(brut) as unknown;
    if (!tout || typeof tout !== 'object' || Array.isArray(tout)) return false;
    return Boolean((tout as Record<string, unknown>)[queteId]);
  } catch {
    return false;
  }
}

/** Marque la quête « passée » (la gate cesse de ramener au champ d'avis). */
export function marquerAvisPasse(queteId: string): void {
  try {
    const brut = window.localStorage.getItem(CLE_PASSE);
    const parse = brut ? (JSON.parse(brut) as unknown) : null;
    const tout: Record<string, boolean> =
      parse && typeof parse === 'object' && !Array.isArray(parse)
        ? { ...(parse as Record<string, boolean>) }
        : {};
    tout[queteId] = true;
    window.localStorage.setItem(CLE_PASSE, JSON.stringify(tout));
  } catch {
    /* stockage indisponible — la gate se rouvrira à la prochaine visite */
  }
}

/** Lit l'avis d'une quête — null si absent ou corrompu (jamais d'exception). */
export function lireAvis(queteId: string): AvisSatisfaction | null {
  try {
    const brut = window.localStorage.getItem(CLE_STOCKAGE);
    if (!brut) return null;
    const tout = JSON.parse(brut) as unknown;
    if (!tout || typeof tout !== 'object' || Array.isArray(tout)) return null;
    const entree = (tout as Record<string, unknown>)[queteId];
    if (!entree || typeof entree !== 'object' || Array.isArray(entree)) return null;
    const avis = entree as { note?: unknown; commentaire?: unknown; ts?: unknown; v?: unknown };
    if (!estNote(avis.note)) return null;
    // Task 80 — une entrée sans la marque de version répond à l'ANCIENNE
    // question : elle n'éteint ni la gate ni le formulaire actuel.
    if (avis.v !== VERSION_QUESTION) return null;
    return {
      note: avis.note,
      commentaire: typeof avis.commentaire === 'string' ? avis.commentaire.slice(0, 500) : '',
      ts: typeof avis.ts === 'string' ? avis.ts : '',
    };
  } catch {
    return null;
  }
}

/** Enregistre l'avis (local d'abord, copie API fire-and-forget ensuite) et le
 *  retourne — l'appelant met à jour son état avec la même valeur. */
export function enregistrerAvis(queteId: string, note: AvisSatisfaction['note'], commentaire: string): AvisSatisfaction {
  const avis: AvisSatisfaction = {
    note,
    commentaire: commentaire.trim().slice(0, 500),
    ts: new Date().toISOString(),
  };
  try {
    const brut = window.localStorage.getItem(CLE_STOCKAGE);
    const parse = brut ? (JSON.parse(brut) as unknown) : null;
    const tout: Record<string, AvisSatisfaction & { v: number }> =
      parse && typeof parse === 'object' && !Array.isArray(parse)
        ? { ...(parse as Record<string, AvisSatisfaction & { v: number }>) }
        : {};
    tout[queteId] = { ...avis, v: VERSION_QUESTION };
    window.localStorage.setItem(CLE_STOCKAGE, JSON.stringify(tout));
  } catch {
    /* stockage indisponible (navigation privée…) — l'API reste tentée */
  }
  // Copie serveur — best effort, silencieuse : l'avis sert à améliorer les
  // quêtes, jamais à déranger le membre.
  void fetch('/api/satisfaction', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    body: JSON.stringify({ quete: queteId, note: avis.note, commentaire: avis.commentaire }),
  }).catch(() => {});
  return avis;
}
