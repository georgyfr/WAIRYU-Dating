/**
 * Page d'attente « Cet espace n'est pas encore ouvert » (#/decouvrir,
 * #/messages, #/profil — espaces dating masqués à ce niveau du voyage).
 *
 * RECONSTITUTION (5ᵉ reset sandbox) — fidèle au bundle staging (fonction `Bh`,
 * lignes 13102-13145 de /tmp/staging-bundle-pretty.js) : page d'attente
 * élégante, JAMAIS de cul-de-sac (CTA retour au voyage), JAMAIS de teaser.
 *
 * Détail typographique VERBATIM du bundle (ligne 13123) : la chaîne
 * « Chaque chose en son temps — ton voyage continue ici : » contient une
 * espace insécable U+00A0 avant les deux-points — ne pas « corriger ».
 *
 * Aucune prop (bundle : s.jsx(Bh, {})). Apostrophes U+0027 (audit Task 25).
 */

import VoyageIcon from '../components/VoyageIcons';

export default function Masque() {
  return (
    <main className="screen masked">
      <div className="masked-box">
        <span className="masked-ico" aria-hidden="true">
          <VoyageIcon name="signpost" size={26} strokeWidth={1.8} />
        </span>
        <h1 className="screen-title">Cet espace n'est pas encore ouvert</h1>
        <p className="masked-p">
          Wairyu avance par étages : certains espaces s'ouvriront plus tard dans ton voyage, quand
          les Mondes t'auront révélé l'essentiel.
        </p>
        {/* Verbatim bundle : espace insécable U+00A0 avant « : ». */}
        <p className="masked-p">{'Chaque chose en son temps — ton voyage continue ici\u00A0:'}</p>
        <a className="btn btn-accent masked-cta" href="#/voyage">
          Retour à mon voyage
          <svg
            viewBox="0 0 24 24"
            width={16}
            height={16}
            fill="none"
            stroke="currentColor"
            strokeWidth={2.4}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </a>
      </div>
    </main>
  );
}
