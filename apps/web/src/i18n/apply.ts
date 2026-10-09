/**
 * Le moteur de LOCALISATION des contenus (profondeur, silencieux, sûr).
 *
 * PRINCIPE — « le français n'est jamais touché » : les fichiers de contenu
 * verbatim (quetes.ts, quete-X-Y.ts, voyage.ts…) restent EXACTEMENT comme
 * les a écrits le Livrable. La localisation vit dans des FICHIERS MIROIRS
 * (src/i18n/content/en/*.ts) qui ne portent que les chaînes AFFICHABLES.
 * `avecEN(fr, en)` fusionne au chargement : chaîne EN trouvée → EN, sinon →
 * la chaîne FR d'origine (repli silencieux — une traduction manquante ne
 * casse JAMAIS l'écran).
 *
 * RÈGLES DE FUSION :
 *  - objet  → fusion champ à champ (l'EN peut être partiel) ;
 *  - tableau → fusion par INDEX, à condition que les longueurs soient
 *    identiques (l'ordre du Livrable est gelé — l'EN le respecte) ;
 *  - chaîne → l'EN si fournie, sinon la FR ;
 *  - tout le reste (fonctions deck/scorer, nombres, booléens, codes) → FR
 *    tel quel, à l'identique.
 */

import { getLang } from './current';

/** La forme autorisée d'un miroir EN : les chaînes deviennent obligatoires
 *  quand fournies, tout champ peut manquer, les structures suivent la FR. */
export type L10n<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? L10n<U>[]
    : T extends object
      ? { [K in keyof T]?: L10n<T[K]> }
      : never;

/**
 * Fusionne le contenu FR (source de vérité) avec son miroir EN (partiel).
 * En langue française (ou miroir absent) : renvoie la FR INTACTE.
 */
export function avecEN<T>(fr: T, en: unknown): T {
  if (getLang() !== 'en' || en === undefined || en === null) return fr;
  return fusion(fr, en) as T;
}

function fusion(fr: unknown, en: unknown): unknown {
  if (typeof fr === 'string') {
    return typeof en === 'string' && en.length > 0 ? en : fr;
  }
  if (Array.isArray(fr)) {
    if (Array.isArray(en) && en.length === fr.length) {
      return fr.map((v, i) => fusion(v, en[i]));
    }
    return fr; // longueur divergente → repli FR intégral (ordre gelé)
  }
  if (fr && typeof fr === 'object') {
    if (!en || typeof en !== 'object' || Array.isArray(en)) return fr;
    const e = en as Record<string, unknown>;
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(fr as Record<string, unknown>)) {
      out[k] = k in e ? fusion(v, e[k]) : v;
    }
    return out;
  }
  return fr; // fonctions, nombres, booléens, null, undefined → FR tel quel
}

/**
 * Interpole les jetons de montant narratif « {m:120} » (base EUR du Livrable)
 * avec la devise de l'utilisateur — ex. « {m:120} » → « 78 500 FCFA ».
 * Les textes sans jeton passent à l'identique.
 */
export function interpolerMontants(texte: string, money: (eur: number) => string): string {
  if (!texte.includes('{m:')) return texte;
  return texte.replace(/\{m:(\d+(?:\.\d+)?)\}/g, (_, n: string) => money(parseFloat(n)));
}
