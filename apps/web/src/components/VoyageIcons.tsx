/**
 * Bibliothèque d'icônes du Voyage — redesign 2026-10-08 (demande fondateur :
 * « repensez les icônes pour qu'elles soient plus mémorables / uniformes »).
 *
 * Un seul style : traits arrondis 2 px, viewBox 24, currentColor — zéro
 * dépendance, rendu IDENTIQUE sur tous les appareils (contrairement aux
 * emoji, qui varient selon Samsung/Apple/Google). Chaque monde et chaque
 * étape jalon possède SA propre silhouette, mémorable et distincte.
 */

export type VoyageIconName =
  | 'signpost' // héro : le départ du voyage
  | 'mirror' // M1 Le Miroir / jalon 2
  | 'wheel' // M2 Le Volant
  | 'compass' // M3 La Boussole / objectif
  | 'tent' // M4 Le Terrain
  | 'tree' // M5 Ton Héritage
  | 'heart' // M6 Mon Cœur / objectif
  | 'umbrella' // M7 Face aux Tempêtes
  | 'moon' // M8 L'Intime — L'Essentiel
  | 'lock' // M9 Les Profondeurs (chiffré) / état verrouillé
  | 'globe' // M10 Mon Monde
  | 'rings' // M11 Le Voyage à Deux / jalon 6 La Rencontre
  | 'map' // jalon 1 La Carte
  | 'mountain' // jalon 3 Le Portrait du Monde
  | 'layers' // jalon 4 Les Portraits de Domaine
  | 'scroll' // jalon 5 Le Portrait Intégral
  | 'target' // objectif « Rencontrer juste »
  | 'star' // objectif « Des matchs qui ont du sens »
  | 'gem'; // badge Premium (élégant, sobre)

const PATHS: Record<VoyageIconName, React.ReactNode> = {
  // Panneau directionnel : le départ, les deux chemins possibles.
  signpost: (
    <>
      <path d="M12 21V4.5" />
      <path d="M12 5H6L3.8 7.5 6 10h6z" />
      <path d="M12 10.5h6l2.2 2.5-2.2 2.5h-6z" />
    </>
  ),
  // Miroir ovale sur pied, avec reflet.
  mirror: (
    <>
      <ellipse cx="12" cy="9" rx="5.5" ry="7" />
      <path d="M10 6.8a3.6 3.6 0 0 1 2-1.6" />
      <path d="M9.2 20.5h5.6M12 16v4.5" />
    </>
  ),
  // Volant : cercle extérieur, moyeu, trois branches.
  wheel: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="2.6" />
      <path d="M12 14.6V20.5" />
      <path d="M9.7 10.7 3.9 8.4" />
      <path d="m14.3 10.7 5.8-2.3" />
    </>
  ),
  // Boussole : cadran + aiguille pleine.
  compass: (
    <>
      <circle cx="12" cy="12" r="9" />
      <polygon points="15.2,8.8 13.2,13.2 8.8,15.2 10.8,10.8" fill="currentColor" stroke="none" />
    </>
  ),
  // Tente de campagne : le quotidien réel.
  tent: (
    <>
      <path d="M12 4.5 3 20h18z" />
      <path d="M12 20v-5.6" />
      <path d="m12 14.4-3 5.6M12 14.4l3 5.6" />
    </>
  ),
  // Arbre : l'héritage, les racines.
  tree: (
    <>
      <path d="M12 21v-6" />
      <path d="M12 15a5.5 5.5 0 1 0-4.9-8 4.2 4.2 0 0 0-2.6 5.6A4.6 4.6 0 0 0 9 15z" />
      <path d="M9.5 21h5" />
    </>
  ),
  // Cœur : le style amoureux.
  heart: (
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  ),
  // Parapluie : traverser les tempêtes.
  umbrella: (
    <>
      <path d="M21.5 12.5a9.5 9.5 0 0 0-19 0z" />
      <path d="M12 12.5V18a2.2 2.2 0 0 0 4.4 0" />
      <path d="M12 2.5v1" />
    </>
  ),
  // Lune : l'intime, le secret doux.
  moon: <path d="M20.6 13.2A8.5 8.5 0 1 1 10.8 3.4a6.8 6.8 0 0 0 9.8 9.8z" />,
  // Cadenas : chiffré renforcé, jamais visible.
  lock: (
    <>
      <rect x="5" y="11" width="14" height="9.5" rx="2.2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
      <path d="M12 14.6v2" />
    </>
  ),
  // Globe : les racines et l'ouverture au monde.
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a13.5 13.5 0 0 1 0 18M12 3a13.5 13.5 0 0 0 0 18" />
    </>
  ),
  // Deux anneaux entrelacés : le voyage à deux.
  rings: (
    <>
      <circle cx="9.2" cy="12.8" r="5.4" />
      <circle cx="14.8" cy="10.8" r="5.4" />
    </>
  ),
  // Carte pliée : le premier gain.
  map: (
    <>
      <path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2z" />
      <path d="M9 4v14M15 6v14" />
    </>
  ),
  // Montagne : le portrait d'un territoire de soi.
  mountain: (
    <>
      <path d="m8 4 4.2 8.4L17 7.5l5 13H2z" />
      <path d="m8 4 .1 0" />
    </>
  ),
  // Strates superposées : les portraits de domaine (Le Soi, le Cœur…).
  layers: (
    <>
      <path d="m12 3.5 9 4.8-9 4.8-9-4.8z" />
      <path d="m3.5 13.2 8.5 4.5 8.5-4.5" />
      <path d="m3.5 17.4 8.5 4.5 8.5-4.5" opacity="0" />
    </>
  ),
  // Parchemin : le portrait intégral, téléchargeable.
  scroll: (
    <>
      <path d="M14 2.5H6.5a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V8z" />
      <path d="M14 2.5V8h5.5" />
      <path d="M8.5 13h7M8.5 17h4.5" />
    </>
  ),
  // Cible : rencontres alignées.
  target: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  // Étoile : matchs qui ont du sens (trait, comme les autres).
  star: <path d="m12 3 2.7 6.2 6.8.6-5.1 4.4 1.5 6.6L12 17.2l-5.9 3.6 1.5-6.6L2.5 9.8l6.8-.6z" />,
  // Gemme : Premium — sobre et élégant (remplace la couronne).
  gem: (
    <>
      <path d="M7 4h10l3.5 5L12 20.5 3.5 9z" />
      <path d="M3.5 9h17M9.5 4 8 9l4 11.5L16 9l-1.5-5" />
    </>
  ),
};

export default function VoyageIcon({
  name,
  size = 20,
  strokeWidth = 2,
}: {
  name: VoyageIconName;
  size?: number;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  );
}
