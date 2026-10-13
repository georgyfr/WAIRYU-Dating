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
 *  - UNE note (1-5) suffit — n'importe laquelle ouvre la suite ; la note ne
 *    change RIEN aux résultats (aucun scorer ne la lit — jamais).
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

/** Les cinq niveaux de la barre — libellés simples, non jugés. */
export const NIVEAUX_AVIS: readonly { valeur: 1 | 2 | 3 | 4 | 5; cle: string }[] = [
  { valeur: 1, cle: 'Pas du tout' },
  { valeur: 2, cle: 'Un peu' },
  { valeur: 3, cle: 'Moyennement' },
  { valeur: 4, cle: 'Oui' },
  { valeur: 5, cle: 'Tout à fait' },
];

/** Garde-fou de forme : 1|2|3|4|5 exactement (jamais « 0 truthy » ni texte). */
function estNote(val: unknown): val is AvisSatisfaction['note'] {
  return val === 1 || val === 2 || val === 3 || val === 4 || val === 5;
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
    const avis = entree as { note?: unknown; commentaire?: unknown; ts?: unknown };
    if (!estNote(avis.note)) return null;
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
    const tout: Record<string, AvisSatisfaction> =
      parse && typeof parse === 'object' && !Array.isArray(parse)
        ? { ...(parse as Record<string, AvisSatisfaction>) }
        : {};
    tout[queteId] = avis;
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
