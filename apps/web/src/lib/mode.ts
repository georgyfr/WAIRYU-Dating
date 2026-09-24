/**
 * Store partagé du MODE de découverte courant (Task 35 — demande fondateur :
 * « la barre latérale gauche du mode classique doit être différente du mode
 * invisible »).
 *
 * Pourquoi un store module-level ? Historiquement, l'identité violette du
 * Mode Invisible vivait UNIQUEMENT dans Discover.tsx (effet posé/retiré au
 * montage/démontage) : dès que l'utilisateur ouvrait Messages, Likes ou
 * Profil, la classe partait et la barre latérale PC reprenait l'habillage
 * Classique — incohérent, car le mode est une propriété du PROFIL, pas de
 * la page. Le mode est désormais porté ici, à l'échelle de la session :
 * un seul écrivain (setSharedMode) bascule `body.mode-invisible`, quel que
 * soit l'écran qui connaît le mode.
 *
 * Pattern identique à lib/toast.tsx : pas de contexte React, pas de
 * dépendance supplémentaire — juste un store minimal et abonnable.
 * Couche 100 % additive : aucun écran existant n'est modifié dans son
 * comportement fonctionnel.
 */
import { useEffect, useState } from 'react';
import type { DiscoveryMode } from '@wairyu/shared';

let current: DiscoveryMode | null = null;
const subscribers = new Set<(m: DiscoveryMode | null) => void>();

/** Mode connu de la session (null = pas encore chargé — sidebar neutre). */
export function getSharedMode(): DiscoveryMode | null {
  return current;
}

/**
 * Pose le mode courant (serveur = vérité : chargement initial, rattrapage
 * loadPrefs, bascule switchMode) et synchronise l'identité violette du
 * body — UN SEUL endroit écrit la classe, plus de course entre écrans.
 */
export function setSharedMode(mode: DiscoveryMode): void {
  current = mode;
  document.body.classList.toggle('mode-invisible', mode === 'invisible');
  subscribers.forEach((fn) => fn(current));
}

/**
 * Fin de session (logout / suppression de compte) : le mode repart de null,
 * la classe violette est retirée — le compte suivant ne doit rien hériter.
 */
export function resetSharedMode(): void {
  current = null;
  document.body.classList.remove('mode-invisible');
  subscribers.forEach((fn) => fn(current));
}

/** S'abonner aux changements (retourne la fonction de désabonnement). */
export function subscribeMode(fn: (m: DiscoveryMode | null) => void): () => void {
  subscribers.add(fn);
  return () => subscribers.delete(fn);
}

/** Hook React — composants (ex. TabBar) qui affichent le mode courant. */
export function useSharedMode(): DiscoveryMode | null {
  const [mode, setMode] = useState<DiscoveryMode | null>(current);
  useEffect(() => {
    // Rattrapage : un setSharedMode posé entre le render et l'abonnement
    // (les effets des écrans s'exécutent AVANT celui du composant qui
    // s'abonne — ex. Discover avant TabBar dans l'arbre App) serait perdu
    // sans cette relecture ; on resynchronise puis on s'abonne.
    setMode(current);
    return subscribeMode(setMode);
  }, []);
  return mode;
}
