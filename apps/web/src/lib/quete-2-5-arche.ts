/**
 * Archétypes de la quête 2.5 — Ce que tu cherches (Monde 3 « La Boussole »).
 *
 * Même gabarit que la quête 1.4 (Task 35) : chaque type est écrit à la 2ᵉ
 * personne, SIMPLE ET LITTÉRAL, dans les 6 champs — intro (« Ton archétype
 * révèle une personne qui… » + point de vigilance), devise, « Ce que tu
 * apportes », « Ce qui peut te freiner » (refermé sur « Ce ne sont pas des
 * défauts — juste ce qui émerge quand… »), « En couple » (« À garder en
 * tête : … »), « Ton équilibre » (un geste + « Non parce que…, mais parce
 * que… »).
 *
 * Ancrage : les cartes VERBATIM (nom, lumière, ombre, tension) restent dans
 * quete-2-5.ts ; ces textes s'appuient sur le corps des 4 cartes (cartes.yaml
 * v2 — une carte par intention) et les briques du 07-miroir.md (TA LUMIÈRE /
 * TON OMBRE EN COUPLE / TA TENSION / MINI-RES, branches « exclusivité posée »
 * · « découverte » · « non-exclusivité assumée » · « en exploration » /
 * « intention à clarifier ») — RÉÉCRITS, jamais recopiés : aucun segment
 * ≥ 60 caractères n'est repris tel quel du miroir. Jamais un diagnostic,
 * jamais une étiquette clinique (« en exploration » est le libellé déclaratif
 * de l'app, C3), aucun palier flatté ni blâmé.
 *
 * Particularité 2.5 : les types décrivent un CAP DÉCLARÉ, daté (« aujourd'hui »),
 * jamais un trait permanent — chaque équilibre garde la porte de la mise à
 * jour ouverte. La carte JEDECOUVRE reçoit aussi les cas limites routés
 * (contradiction directe · « Non / Non / Non ») : son archétype reste celui
 * du brouillon assumé, sans jamais accuser ni juxtaposer de réponses (SIG-2.5-02
 * — miroir dégradé, jamais un blâme).
 *
 * Typo : apostrophe ASCII uniquement, phrases ≤ 22 mots, aucun code/score
 * ni sigle au rendu.
 */
import type { ArchetypeCarte } from './quetes-plus';
import type { VarianteId25 } from './quete-2-5';

export const ARCHES_2_5: Record<VarianteId25, ArchetypeCarte> = {
  // CARTE-2.5-EXPL — Le·La Cœur qui choisit : le cap exclusif assumé, et le tempo de l'autre.
  'CARTE-2.5-EXPL': {
    intro:
      'Ton archétype révèle une personne qui assume son cap. Tu sais ce que tu cherches : construire à deux, exclusivement — et tu l\'écris d\'entrée. Cette clarté n\'est pas de la précipitation : c\'est une direction choisie. Ton point de vigilance : un cap posé tôt presse parfois les étapes que l\'autre vivrait autrement.',
    devise: 'Je sais ce que je cherche, et je le dis tel quel.',
    apportes:
      'Une direction lisible : la personne qui te lit sait où tu en es, sans décodeur ni devinettes. Ton cap filtre pour toi — ce qui ne colle pas s\'écarte sans drame, et ce qui colle avance plus vite.',
    freines:
      'Le tempo imposé, l\'étape brûlée, la rencontre qu\'on presse vers un cap qui n\'est pas encore le sien. Ce ne sont pas des défauts — juste ce qui émerge quand la direction va plus vite que le chemin partagé.',
    couple:
      'Tu apprécies un lien sans détour : les intentions dites, les étapes assumées, la fidélité posée comme un socle. À garder en tête : ton cap demande de la place — laisse l\'autre dire le sien avant de le faire sien.',
    equilibre:
      'Demander le tempo de l\'autre avant de fixer le vôtre. Non parce que ton cap serait trop fort, mais parce qu\'un cap à deux se pose à deux voix.',
  },

  // CARTE-2.5-DECOU — Le·La Curieux·se sans carte : l'ouverture sans scénario, et le coût du flou.
  'CARTE-2.5-DECOU': {
    intro:
      'Ton archétype révèle une personne qui explore sans scénario. Tu cherches une rencontre, pas un plan : tu veux voir qui arrive, sans cadre imposé d\'avance. Cette ouverture est assumée, et elle se voit. Ton point de vigilance : sans plan annoncé, quelqu\'un peut s\'attacher pendant que tu explores encore.',
    devise: 'Je laisse venir, sans scénario imposé — et ça se sait.',
    apportes:
      'Une ouverture franche : avec toi, les rencontres démarrent sans casting ni checklist. Tu laisses la personne surprendre ce qu\'aucun plan n\'aurait deviné — et ça rend possibles des histoires qu\'un cadre serré écarte.',
    freines:
      'Le plan flou, le « on verra », l\'attachement qui grandit d\'un côté pendant que l\'autre garde ses portes ouvertes. Ce ne sont pas des défauts — juste ce qui émerge quand l\'ouverture n\'a pas encore trouvé ses mots.',
    couple:
      'Tu apprécies un lien qui garde de l\'air : de la place pour l\'imprévu, le droit de ne pas tout cadrer. À garder en tête : l\'ouverture s\'entretient à voix haute. Le cadre que tu ne nommes pas, l\'autre finit par le deviner — souvent de travers.',
    equilibre:
      'Nommer tôt ce que tu offres aujourd\'hui, sans promesse déguisée. Non parce que ton exploration poserait problème, mais parce qu\'un flou nommé tôt épargne des attachements mal calés.',
  },

  // CARTE-2.5-LIBRE — Le·La Libre honnête : la non-exclusivité dite, et l'espérance qui traîne.
  'CARTE-2.5-LIBRE': {
    intro:
      'Ton archétype révèle une personne qui affiche son rythme. L\'exclusivité n\'est pas ce que tu vises aujourd\'hui — et tu le dis, sans détour ni fausse promesse. Cette franchise change le départ des histoires. Ton point de vigilance : la liberté que tu poses, quelqu\'un peut continuer à l\'espérer malgré tout.',
    devise: 'Mon rythme se dit avant que les cœurs s\'attachent.',
    apportes:
      'Un départ sans malentendu : la personne qui te lit connaît le statut d\'entrée, et choisit en connaissance de cause. Ta franchise sur ce que tu ne proposes pas rend crédible ce que tu proposes.',
    freines:
      'L\'espérance qui traîne, le statut qu\'on relit entre les lignes, la personne qui croit changer le cadre en patientant. Ce ne sont pas des défauts — juste ce qui émerge quand la clarté attend d\'être répétée.',
    couple:
      'Tu apprécies une relation où chaque chose se dit : les attentes, les limites, le rythme de chacun. À garder en tête : ta liberté a un coût nommé — quelqu\'un peut s\'attacher pendant que tu vis ton tempo. Nomme-le tôt, et re-nomme-le quand il change.',
    equilibre:
      'Répéter le cadre aux étapes où il compte : premiers rendez-vous, premiers attachements. Non parce que l\'autre serait lent à comprendre, mais parce qu\'une intention se confirme en la redisant.',
  },

  // CARTE-2.5-JEDECOUVRE — Le·La Brouillon·ne de soi : le cap en mouvement, état assumé (y compris cas limites routés).
  'CARTE-2.5-JEDECOUVRE': {
    intro:
      'Ton archétype révèle une personne en train de s\'écrire. Tu ne prétends pas avoir fini de savoir ce que tu cherches. Ton cap est un brouillon — un état assumé, pas un défaut. Ton point de vigilance : ouvrir toutes les portes peut finir par tenir lieu de réponse.',
    devise: 'J\'explore mon cap en même temps que mes rencontres.',
    apportes:
      'Une honnêteté en mouvement : avec toi, personne n\'achète une version figée de toi. Tu avances en le disant — et ça autorise l\'autre à explorer le sien sans jouer un rôle.',
    freines:
      'Les versions successives, le cap redessiné, la patience que ça demande à qui t\'attend. Ce ne sont pas des défauts — juste ce qui émerge quand le brouillon tarde à trouver son encre.',
    couple:
      'Tu apprécies un lien qui laisse le droit au changement : ce que tu cherches peut s\'écrire à plusieurs mains. À garder en tête : même une réponse en cours se partage. Dis ta page en cours, pas seulement le brouillon entier.',
    equilibre:
      'Relire ton cap à date fixe — un mois, une saison — et le renommer dès qu\'il bouge. Non parce que ton brouillon serait à corriger, mais parce qu\'une intention relue reste une intention qui dit vrai.',
  },
};
