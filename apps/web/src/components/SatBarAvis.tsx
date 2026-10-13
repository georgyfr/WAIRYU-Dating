/**
 * SatBarAvis — la barre de satisfaction d'une quête terminée (Task 66).
 *
 * Demande fondateur : « une barre de section lorsque une quête est terminée
 * pour que la personne évale… son degré de satisfaction des réponses, tout
 * simplement ». Une note (1-5) suffit, n'importe laquelle ouvre la suite ; le
 * commentaire est facultatif ; la note ne change rien aux résultats.
 *
 * Retour fondateur (v2) : quand une action est bloquée (Revenir à ma carte,
 * Retour à mon voyage, quête suivante), le membre est ramené ICI avec une
 * notice polie — elle est rendue PAR la page (Quete.tsx) juste au-dessus de
 * cette barre, pour que le champ de note et l'explication arrivent ensemble.
 *
 * AUCUN lien avec le moteur : la note n'entre dans aucun score, aucun
 * sélecteur, aucune carte — elle sert uniquement à améliorer les quêtes.
 */

import { useState } from 'react';
import { enregistrerAvis, lireAvis, NIVEAUX_AVIS, type AvisSatisfaction } from '../lib/satisfaction';
import { useI18n } from '../i18n/I18nProvider';

interface Props {
  queteId: string;
  /** Appelé après l'enregistrement — la page en déduit que la suite s'ouvre. */
  onAvis?: (avis: AvisSatisfaction) => void;
}

export default function SatBarAvis({ queteId, onAvis }: Props) {
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
      <h3>{tx('Ces réponses t\'ont-elles éclairé·e ?')}</h3>
      <p className="sat-sub">
        {tx('Une note suffit — n\'importe laquelle ouvre la suite. Ta note ne change rien à tes résultats.')}
      </p>
      <div className="sat-notes" role="group" aria-label={tx('Ton degré de satisfaction')}>
        {NIVEAUX_AVIS.map((n) => (
          <button
            key={n.valeur}
            type="button"
            className="sat-note"
            aria-pressed={note === n.valeur}
            onClick={() => setNote(n.valeur)}
          >
            <span className="sat-note-valeur">{n.valeur}</span>
            <span className="sat-note-label">{tx(n.cle)}</span>
          </button>
        ))}
      </div>
      <label className="sat-comment-label" htmlFor="sat-comment">
        {tx('Un commentaire ? (facultatif)')}
      </label>
      <textarea
        id="sat-comment"
        className="sat-comment"
        rows={2}
        maxLength={500}
        value={commentaire}
        onChange={(e) => setCommentaire(e.target.value)}
        placeholder={tx('Ce qui t\'a parlé — ou pas.')}
      />
      <div className="sat-actions">
        <button type="button" className="btn btn-accent" onClick={envoyer}>
          {tx(envoye ? 'Mettre à jour ma note' : 'Envoyer ma note')}
        </button>
        {envoye && (
          <p className="sat-merci" role="status">
            {tx('Merci — ta note est enregistrée. N\'importe quelle note ouvre la suite.')}
          </p>
        )}
      </div>
      <p className="sat-privacy">{tx('Ta note sert uniquement à améliorer les quêtes.')}</p>
    </section>
  );
}
