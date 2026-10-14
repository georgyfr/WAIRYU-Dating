/**
 * SatBarAvis — la barre de satisfaction d'une quête terminée (Task 66).
 *
 * Demande fondateur : « une barre de section lorsque une quête est terminée
 * pour que la personne évalue… son degré de satisfaction des réponses, tout
 * simplement ».
 *
 * Task 78 — la forme que le fondateur a PRÉFÉRÉE (suggestion qui corrige la
 * page) :
 *  - une seule question, avec les mots du moteur de résultats — « Ce profil
 *    te ressemble-t-il ? » (l'ancienne échelle 1-5 ne ressemblait pas aux
 *    réponses de la quête et « éclairé·e » gardait un point médian) ;
 *  - trois choix : « Oui, tout à fait / En partie / Pas vraiment » — le même
 *    vocabulaire que les cartes, pour savoir quels paragraphes ne conviennent
 *    pas ;
 *  - UNE seule phrase d'explication (les deux phrases quasi identiques
 *    d'avant sont fusionnées) : « Ta réponse nous aide à améliorer les
 *    textes. Elle ne change pas tes résultats. »
 *  - un lien « Passer » : la suite n'est plus bloquée tant que la personne
 *    n'a pas répondu.
 *
 * AUCUN lien avec le moteur : la réponse n'entre dans aucun score, aucun
 * sélecteur, aucune carte — elle sert uniquement à améliorer les textes.
 */

import { useState } from 'react';
import { enregistrerAvis, lireAvis, CHOIX_AVIS, type AvisSatisfaction } from '../lib/satisfaction';
import { useI18n } from '../i18n/I18nProvider';

interface Props {
  queteId: string;
  /** Appelé après l'enregistrement — la page en déduit que la suite s'ouvre. */
  onAvis?: (avis: AvisSatisfaction) => void;
  /** Présent tant que la gate est active — « Passer » ouvre la suite sans
   *  réponse (Task 78 : la page exécute l'action qui était en attente). */
  onPasse?: () => void;
}

export default function SatBarAvis({ queteId, onAvis, onPasse }: Props) {
  const { tx } = useI18n();
  const deja = lireAvis(queteId);
  const [note, setNote] = useState<AvisSatisfaction['note'] | null>(deja?.note ?? null);
  const [commentaire, setCommentaire] = useState(deja?.commentaire ?? '');
  const [envoye, setEnvoye] = useState(deja !== null);

  const envoyer = () => {
    if (note === null) return;
    const avis = enregistrerAvis(queteId, note, commentaire);
    setEnvoye(true);
    onAvis?.(avis);
  };

  return (
    <section className="q-sec sat-bar" aria-label={tx('Ton avis sur ces réponses')}>
      <p className="sat-kicker">{tx('Ton avis compte')}</p>
      <h3>{tx('Ce profil te ressemble-t-il ?')}</h3>
      <div className="sat-choix" role="group" aria-label={tx('Ce profil te ressemble-t-il ?')}>
        {CHOIX_AVIS.map((c) => (
          <button
            key={c.valeur}
            type="button"
            className="sat-choix-btn"
            aria-pressed={note === c.valeur}
            onClick={() => setNote(c.valeur)}
          >
            {tx(c.cle)}
          </button>
        ))}
      </div>
      <label className="sat-comment-label" htmlFor="sat-comment">
        {tx('Un mot à ajouter ? (facultatif)')}
      </label>
      <textarea
        id="sat-comment"
        className="sat-comment"
        rows={2}
        maxLength={500}
        value={commentaire}
        onChange={(e) => setCommentaire(e.target.value)}
        placeholder={tx("Ce qui t'a parlé, ou pas.")}
      />
      <div className="sat-actions">
        <button type="button" className="btn btn-accent" onClick={envoyer}>
          {tx(envoye ? 'Mettre à jour ma réponse' : 'Envoyer')}
        </button>
        {envoye && (
          <p className="sat-merci" role="status">
            {tx('Merci — ta réponse est enregistrée.')}
          </p>
        )}
      </div>
      <p className="sat-privacy">
        {tx('Ta réponse nous aide à améliorer les textes. Elle ne change pas tes résultats.')}
      </p>
      {onPasse && !envoye && (
        <button type="button" className="sat-passer" onClick={onPasse}>
          {tx('Passer')}
        </button>
      )}
    </section>
  );
}
