/**
 * L'ESPACE RENCONTRES (#/matchs) — l'espace restauré (première interface).
 *
 * Prompt fondateur : zone sombre marine, bouton Voyage, pastilles de mode
 * (Classique actif · Invisible/Interracial « BIENTÔT »), onglets de l'espace
 * (Découvrir · Matchs · Messages · Profil), bannière d'action du Voyage, la
 * pile de profils (démonstrations en staging, membres réels du pool), la
 * barre d'actions FIXE (Passer · Demander · Aimer) — puis la barre du bas
 * de l'application existante, « Rencontres » actif.
 *
 * Le contenu vivait ici en E1 ; il est réparti depuis la restauration :
 *  - ./Decouvrir.tsx        — l'espace (en-tête, modes, onglets, la pile) ;
 *  - ./RencontresReelles.tsx — la couche réelle E1 (l'onglet « Matchs »).
 *
 * La porte d'inscription (PortailRencontre, Task 99) reste en amont dans
 * App.tsx — l'accès à Découvrir reste conditionné au même seuil.
 */
import Decouvrir from './Decouvrir';

/** L'espace — `initiale` : la première lettre du prénom de la personne
 *  (l'écran de match affiche les deux visages). */
export default function Rencontres({ initiale }: { initiale?: string }) {
  return <Decouvrir initiale={initiale} />;
}
