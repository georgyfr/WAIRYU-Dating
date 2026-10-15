/**
 * LA FÊTE DU MONDE (Task 98 — demande fondateur : « lorsqu'un monde est
 * terminé avec succès, une page de célébration avec effets spéciaux et
 * d'animation apparaît »).
 *
 * Le DRAPEAU (localStorage `wairyu.fete.{code}`) garantit UNE célébration
 * par monde et par appareil : la fête s'affiche au moment où la personne
 * QUITTE l'écran final de la quête qui clôt son monde — jamais au
 * rechargement, jamais à la relecture, jamais pour un monde traversé
 * avant l'arrivée de la fonctionnalité (honnêteté : on ne célèbre que ce
 * qui vient de se passer).
 *
 * Le déclenchement VIVANT vit dans screens/Quete.tsx (complétion fraîche +
 * monde complet au bus de progression) ; l'overlay est rendu par App.tsx
 * (components/FeteMonde.tsx). Ce module ne porte que le drapeau.
 *
 * Aucune donnée de quête n'est touchée : ordre, scoring et PASSATION
 * restent gelés — la fête est de la CHROME, hors structure.
 */

const cle = (code: string): string => `wairyu.fete.${code}`;

/** La fête de ce monde a-t-elle déjà été montrée sur cet appareil ? */
export function feteDejaVue(code: string): boolean {
  try {
    return window.localStorage.getItem(cle(code)) === '1';
  } catch {
    return false; // stockage indisponible → la fête pourra se montrer (session)
  }
}

/** Marque la fête du monde comme montrée — appelé AVANT l'ouverture de
 *  l'overlay (un rechargement pendant la fête ne la rejoue pas). */
export function marquerFeteVue(code: string): void {
  try {
    window.localStorage.setItem(cle(code), '1');
  } catch {
    /* stockage indisponible — la fête vit pour la session */
  }
}
