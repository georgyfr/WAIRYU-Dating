/**
 * Task 47 — Badge « univers d'origine » d'une conversation.
 *
 * Depuis l'ouverture de la navigation multi-univers (Task 46 / 46 bis), un
 * match peut naître en Classique, en Invisible (handshake « Discuter » ou
 * like mutuel en contexte Invisible) ou en Interracial — mais la boîte de
 * réception est UNIQUE : toutes les conversations atterrissent dans la même
 * messagerie, où que l'on navigue (§4.8 : changer de mode ne déplace ni ne
 * duplique jamais une conversation).
 *
 * Deux notions distinctes :
 *   - conversationMode ('classic' | 'invisible') : le MODE DU CHAT — régit le
 *     flou des photos (§4.8), changeable via la passerelle à consentement
 *     mutuel (§4.4). PRIORITAIRE dans le badge : c'est lui qui protège.
 *   - originMode ('classic' | 'invisible' | 'interracial') : l'univers où le
 *     match est NÉ — purement descriptif (mémorisé en D1 depuis Task 47).
 *
 * Règle d'affichage : le mode du chat gagne (flou = information de
 * confidentialité) ; sinon on montre l'univers d'origine si ce n'est pas
 * Classique (Interracial), sinon le libellé Classique par défaut.
 */

export interface ConvChip {
  /** Classe CSS du chip (chip-conv.<cls>) : 'classic' | 'invisible' | 'interracial'. */
  cls: 'classic' | 'invisible' | 'interracial';
  /** Libellé court affiché dans le chip. */
  label: 'Classique' | 'Invisible' | 'Interracial';
  /** Infobulle pédagogique (title). */
  title: string;
}

export function convChip(
  conversationMode: 'classic' | 'invisible',
  originMode: 'classic' | 'invisible' | 'interracial',
): ConvChip {
  if (conversationMode === 'invisible') {
    return {
      cls: 'invisible',
      label: 'Invisible',
      title: 'Conversation Invisible — photos floutées jusqu’à la révélation mutuelle (§4.5).',
    };
  }
  if (originMode === 'interracial') {
    return {
      cls: 'interracial',
      label: 'Interracial',
      title: 'Match né dans l’univers Interracial — photos visibles ; le flou suit le mode de la conversation.',
    };
  }
  return {
    cls: 'classic',
    label: 'Classique',
    title: 'Match né dans l’univers Classique — photos visibles.',
  };
}
