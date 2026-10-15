/**
 * LE PORTAIL DE LA RENCONTRE (Task 99 — demande fondateur : « la plateforme
 * de rencontre doit être déclenchée quand l'utilisateur a fini les quêtes du
 * monde 1 avec ses récoltes méritées. Un choix d'accéder au site de rencontre
 * ou de continuer le voyage se présente. Il choisira ce qu'il souhaite. »)
 *
 * Le portail s'ouvre à la FERMETURE de la fête du Monde 1 (FeteMonde, Task 98)
 * — la célébration d'abord, le choix ensuite. Il montre les récoltes méritées
 * (les cartes du Miroir) et propose deux chemins : entrer sur WAIRYU
 * Rencontre, ou continuer le voyage.
 *
 * LE DRAPEAU (localStorage `wairyu.portail.rencontre`) garantit UN portail
 * par appareil : posé AVANT l'ouverture (un rechargement pendant le portail
 * ne le rejoue pas). Honnêteté (même doctrine que la fête, Task 98) : on ne
 * rouvre pas le seuil pour un jalon franchi avant l'arrivée de la fonction —
 * la tab « Rencontres » reste l'accès de toujours pour ces voyageurs.
 *
 * Le choix N'EST PAS un verrou : la tab « Rencontres » apparaît au jalon A
 * comme avant (Task 94), le voyage continue d'être accessible partout — les
 * deux chemins restent ouverts, le portail ne fait que marquer le seuil.
 *
 * Aucune donnée de quête n'est touchée : ordre, scoring et PASSATION restent
 * gelés — le portail est de la CHROME, hors structure.
 */

const CLE = 'wairyu.portail.rencontre';

/** Le portail a-t-il déjà été montré sur cet appareil ? */
export function portailDejaVu(): boolean {
  try {
    return window.localStorage.getItem(CLE) === '1';
  } catch {
    return false; // stockage indisponible → le portail pourra se montrer (session)
  }
}

/** Marque le portail comme montré — appelé AVANT l'ouverture (un
 *  rechargement pendant le portail ne le rejoue pas). */
export function marquerPortailVu(): void {
  try {
    window.localStorage.setItem(CLE, '1');
  } catch {
    /* stockage indisponible — le portail vit pour la session */
  }
}
