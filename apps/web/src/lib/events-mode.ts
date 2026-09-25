/**
 * Contexte de navigation « Wairyu Moments » (Task 39 — mode événementiel).
 *
 * Le mode événementiel N'EST PAS un DiscoveryMode : il ne change ni le
 * profil, ni les bassins de découverte, ni les préférences serveur — c'est
 * un UNIVERS PARALLÈLE de l'app (événements au lieu de profils), avec sa
 * propre navigation : Découvrir · Mes events · [+] Créer · Moments · Profil.
 *
 * Comme le mode de découverte (lib/mode.ts), le contexte est porté à
 * l'échelle de la SESSION par un store module-level : UN SEUL écrivain
 * (setEventsNav) bascule `body.events-mode` (identité turquoise/cyan) où
 * que soit l'utilisateur — Discover en mode Interracial + contexte Moments
 * = sidebar turquoise, aucune course entre écrans.
 *
 * Entrée : toute route #/events* (effet de App) ou le CTA de l'onglet
 * Moments. Sortie : le badge « Mode rencontre » des écrans événementiels,
 * ou la fin de session (resetEventsNav via onLoggedOut).
 *
 * Pattern identique à lib/mode.ts / lib/toast.tsx : pas de contexte React,
 * store minimal et abonnable. Couche 100 % additive.
 */
import { useEffect, useState } from 'react';

let current = false;
const subscribers = new Set<(v: boolean) => void>();

/** Contexte Moments actif ? (navigation événementielle + identité turquoise) */
export function getEventsNav(): boolean {
  return current;
}

/**
 * Pose le contexte (route événementielle rejointe / badge « mode rencontre »)
 * et synchronise l'identité turquoise du body — UN SEUL endroit écrit.
 */
export function setEventsNav(on: boolean): void {
  current = on;
  document.body.classList.toggle('events-mode', on);
  subscribers.forEach((fn) => fn(current));
}

/** Fin de session (logout / suppression de compte) : repart en navigation dating. */
export function resetEventsNav(): void {
  setEventsNav(false);
}

/** S'abonner aux changements (retourne la fonction de désabonnement). */
export function subscribeEventsNav(fn: (v: boolean) => void): () => void {
  subscribers.add(fn);
  return () => subscribers.delete(fn);
}

/** Hook React — TabBar (choix des entrées) et App (onglet actif #/moments). */
export function useEventsNav(): boolean {
  const [on, setOn] = useState<boolean>(current);
  useEffect(() => {
    // Rattrapage render → subscribe (même mécanique que useSharedMode —
    // l'effet d'un écran peut poser le contexte avant cet abonnement).
    setOn(current);
    return subscribeEventsNav(setOn);
  }, []);
  return on;
}
