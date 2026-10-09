/**
 * Le FOURNISSEUR i18n (langue + devise) — le seul endroit React qui décide.
 *
 *  - `tx(fr, vars?)` : traduit une chaîne du CHROME (clé = la chaîne FR
 *    exacte du code). Absente du dictionnaire EN → la FR s'affiche (repli
 *    silencieux). `{{cle}}` est remplacé par les variables.
 *  - `money(eur)` : le montant NARRATIF des quêtes (base EUR du Livrable)
 *    converti dans la devise de l'utilisateur, arrondi propre, formaté dans
 *    la langue (120 → « 78 500 FCFA », « $130 », « £105 »…).
 *  - `setLangue` : stocke puis RECHARGE la page — les contenus (données de
 *    modules) se reconstruisent dans la nouvelle langue (voir current.ts).
 *  - `setDevise` : réactif SANS rechargement — tout montant passe par
 *    money()/interpolerMontants au rendu.
 *
 * La devise est détectée au premier lancement depuis la région du navigateur
 * (fr-FR → EUR, en-CA → CAD, fr-CM → XAF…) et reste modifiable dans
 * l'écran Profil. Elle alimentera TELLE QUELLE la facturation premium
 * (i18n/currency.ts — PRIX_PREMIUM par devise).
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { EN_CHROME } from './tr';
import {
  detecterDevise,
  formaterMontantNarratif,
  type CurrencyCode,
} from './currency';
import { getLang, poserLang, type Lang } from './current';

const CLE_DEVISE = 'wairyu.devise';

function lireDevise(): CurrencyCode {
  try {
    const stocke = window.localStorage.getItem(CLE_DEVISE);
    if (stocke) return stocke as CurrencyCode;
  } catch {
    /* stockage indisponible */
  }
  return detecterDevise();
}

function poserDeviseStockage(code: CurrencyCode): void {
  try {
    window.localStorage.setItem(CLE_DEVISE, code);
  } catch {
    /* stockage indisponible */
  }
}

export interface I18n {
  lang: Lang;
  devise: CurrencyCode;
  /** Traduit une chaîne du chrome (clé = chaîne FR exacte) — repli FR. */
  tx: (fr: string, vars?: Record<string, string | number>) => string;
  /** Le montant narratif (base EUR du Livrable) dans la devise de l'utilisateur. */
  money: (eur: number) => string;
  setLangue: (l: Lang) => void;
  setDevise: (c: CurrencyCode) => void;
}

const Ctx = createContext<I18n | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang] = useState<Lang>(() => getLang());
  const [devise, setDeviseState] = useState<CurrencyCode>(() => lireDevise());

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const tx = useCallback(
    (fr: string, vars?: Record<string, string | number>): string => {
      let out = lang === 'en' ? (EN_CHROME[fr] ?? fr) : fr;
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          out = out.split(`{{${k}}}`).join(String(v));
        }
      }
      return out;
    },
    [lang],
  );

  const money = useCallback(
    (eur: number) => formaterMontantNarratif(eur, devise, lang),
    [devise, lang],
  );

  const setLangue = useCallback((l: Lang) => {
    if (l === getLang()) return;
    poserLang(l);
    // Les contenus des quêtes (données de modules) sont localisés au
    // chargement — le rechargement les reconstruit dans la nouvelle langue.
    window.location.reload();
  }, []);

  const setDevise = useCallback((c: CurrencyCode) => {
    poserDeviseStockage(c);
    setDeviseState(c);
  }, []);

  const valeur = useMemo<I18n>(
    () => ({ lang, devise, tx, money, setLangue, setDevise }),
    [lang, devise, tx, money, setLangue, setDevise],
  );

  return <Ctx.Provider value={valeur}>{children}</Ctx.Provider>;
}
/** Le crochet i18n — tx (chrome) + money (montants) + langue/devise. */
export function useI18n(): I18n {
  const v = useContext(Ctx);
  if (!v) throw new Error('useI18n hors I18nProvider');
  return v;
}
