/**
 * Archétypes de la quête 5.3 — Comment tu exprimes ton affection (Monde 6
 * « Mon Cœur »).
 *
 * Même gabarit que les quêtes 1.x-4.x : chaque type est écrit à la 2ᵉ
 * personne, SIMPLE ET LITTÉRAL, dans les 6 champs — intro (« Ton archétype
 * révèle une personne qui… » + point de vigilance), devise, « Ce que tu
 * apportes », « Ce qui peut te freiner » (refermé sur « Ce ne sont pas des
 * défauts — juste ce qui émerge quand… »), « En couple » (« À garder en
 * tête : … »), « Ton équilibre » (un geste + « Non parce que…, mais parce
 * que… »).
 *
 * Ancrage : les cartes VERBATIM (nom, lumière, ombre, tension) restent dans
 * quete-5-3.ts ; ces textes s'appuient sur le corps des cartes (cartes.yaml)
 * et les textures du 07-miroir.md (TA LUMIÈRE / TON OMBRE EN COUPLE / TA
 * TENSION / LE MINI-RES) — RÉÉCRITS, jamais recopiés : aucun segment ≥ 60
 * caractères n'est repris tel quel du miroir.
 *
 * SYMÉTRIE DES CANAUX (doctrine capitale du Livrable) : les six variantes
 * se valent — le canal discret n'est pas une carence, il est l'adresse des
 * demandes non formulées ; l'équilibré n'est pas une absence de choix.
 * Registre probabiliste : zéro « toujours/jamais » au texte rendu, aucun
 * futur certain, aucun vocabulaire clinique.
 *
 * CONVERSATIONNELLE UNIQUEMENT (règle JAMAIS DANS LE SCORE, gravée au
 * module) : ces textes nourrissent la conversation à deux, ils ne
 * rejoignent aucun moteur.
 *
 * Typo : apostrophe ASCII uniquement, phrases ≤ 22 mots.
 */
import type { ArchetypeCarte } from './quetes-plus';

export const ARCHES_53: Record<
  | 'CARTE-5.3-MOTS-QUI-DISENT'
  | 'CARTE-5.3-PRESENCE-PLEINE'
  | 'CARTE-5.3-GESTE-QUI-DIT'
  | 'CARTE-5.3-DETAIL-JUSTE'
  | 'CARTE-5.3-PEAU-QUI-PARLE'
  | 'CARTE-5.3-ECOUTE-LARGE',
  ArchetypeCarte
> = {
  // CARTE-5.3-MOTS-QUI-DISENT — la parole qui remplit, et le silence qui se
  // demande.
  'CARTE-5.3-MOTS-QUI-DISENT': {
    intro:
      'Ton archétype révèle une personne que la parole remplit : un mot juste te porte toute une journée. Tu sais nommer ce que l\'autre fait de bien. Ton point de vigilance : un silence se demande — il ne se lit pas tout seul.',
    devise: 'Ma langue, c\'est la phrase juste : elle rallume ma journée, et je la rends.',
    apportes:
      'Des mots qui réparent : tu sais dire l\'attention, et tes phrases laissent des traces claires. Avec toi, on apprend qu\'un compliment sincère vaut une présence entière.',
    freines:
      'Le blanc qui s\'allonge peut peser : tu comptes les minutes d\'un silence que l\'autre habite paisiblement. Ce ne sont pas des défauts — juste ce qui émerge quand les mots portent tout.',
    couple:
      'À garder en tête : nomme le mot que tu attends — l\'autre l\'apprend, au lieu de deviner.',
    equilibre:
      'Demande la phrase que tu attends — Non parce que l\'autre se tait contre toi, mais parce qu\'une demande s\'apprend à voix haute.',
  },
  // CARTE-5.3-PRESENCE-PLEINE — la soirée posée, et l'habitude qui se
  // renomme.
  'CARTE-5.3-PRESENCE-PLEINE': {
    intro:
      'Ton archétype révèle une personne que la présence pleine remplit : une soirée sans écran, et tu te sens aimé. Ton point de vigilance : une présence distraite ne nourrit qu\'à moitié — elle se renomme, elle ne se juge pas.',
    devise: 'Mon canal est un rendez-vous : posé à deux, sans écran, la table mise.',
    apportes:
      'Une présence entière : avec toi, une soirée prend le ton d\'une maison. Tu donnes le calme que tu aimes recevoir.',
    freines:
      'La solitude à deux peut s\'installer : l\'autre est là, l\'écran aussi, et la moitié manque. Ce ne sont pas des défauts — juste ce qui émerge quand le temps partagé est ton remplissage.',
    couple:
      'À garder en tête : pose un créneau nommé plutôt qu\'un reproche diffus — la demande se planifie.',
    equilibre:
      'Nomme la soirée que tu veux — Non parce que l\'autre ne pense pas à toi, mais parce qu\'un créneau dit apaise.',
  },
  // CARTE-5.3-GESTE-QUI-DIT — l'aide qui parle, et la facture qui ne se
  // compte pas.
  'CARTE-5.3-GESTE-QUI-DIT': {
    intro:
      'Ton archétype révèle une personne que l\'aide remplit : la valise montée parle autant qu\'une déclaration. Ton point de vigilance : donner pour être redevable installe une facture — le service se donne, il ne se compte pas.',
    devise: 'Mon amour est utilitaire : il allège les journées, une main utile à la fois.',
    apportes:
      'Des journées allégées : tes mains voient ce qui pèse, et ça se sent. Avec toi, les charges se partagent sans discours.',
    freines:
      'L\'aide peut remplacer la présence : tu fais à la place d\'un moment à deux. Ce ne sont pas des défauts — juste ce qui émerge quand le geste a été ta première langue.',
    couple: 'À garder en tête : dis ce qui t\'aiderait — sans attendre l\'échange exact.',
    equilibre:
      'Reçois sans garder le compte — Non parce que le don perd sa valeur, mais parce qu\'une facture silencieuse use les deux.',
  },
  // CARTE-5.3-DETAIL-JUSTE — l'objet qui pense à toi, et la règle qui sort
  // du tiroir.
  'CARTE-5.3-DETAIL-JUSTE': {
    intro:
      'Ton archétype révèle une personne que l\'attention choisie remplit : l\'objet pensé prouve qu\'on a écouté. Ton point de vigilance : la preuve s\'use quand elle se compte — les occasions se fêtent, elles ne s\'examinent pas.',
    devise: 'Mon canal est un détail : chassé pour les autres, gardé en mémoire.',
    apportes:
      'Un œil qui attrape : tu fêtes les gens avec ce que d\'autres manquent. Avec toi, les moments ordinaires deviennent des souvenirs datés.',
    freines:
      'Compter les preuves fatigue : un anniversaire raté pèse plus lourd qu\'une semaine de tendresse. Ce ne sont pas des défauts — juste ce qui émerge quand la règle reste dans le tiroir.',
    couple:
      'À garder en tête : raconte l\'attention qui t\'a marqué — la règle sort du tiroir.',
    equilibre:
      'Dis la règle avant l\'occasion — Non parce que l\'autre est distrait, mais parce qu\'une règle dite se fête mieux.',
  },
  // CARTE-5.3-PEAU-QUI-PARLE — le contact qui résume, et la pause qui n'est
  // pas un refus.
  'CARTE-5.3-PEAU-QUI-PARLE': {
    intro:
      'Ton archétype révèle une personne que le contact remplit : une main, une épaule, et le corps résume une soirée. Ton point de vigilance : une pause n\'est pas un désamour — le repos de l\'autre reste du repos.',
    devise: 'Ma langue est le contact : elle dit vite ce qui prendrait une soirée.',
    apportes:
      'Une présence qui apaise : ta main referme les journées douloureuses. Avec toi, les retrouvailles se sentent avant de se dire.',
    freines:
      'L\'éloignement peut sonner l\'alarme : un partenaire fatigué devient un message entier. Ce ne sont pas des défauts — juste ce qui émerge quand le toucher dit tout.',
    couple:
      'À garder en tête : nomme le contact attendu — une demande claire parle mieux qu\'une alarme.',
    equilibre:
      'Traduis le geste avant d\'en conclure — Non parce que ton ressenti se trompe, mais parce qu\'une pause a ses propres raisons.',
  },
  // CARTE-5.3-ECOUTE-LARGE — plusieurs fréquences, et un besoin qui se
  // nomme.
  'CARTE-5.3-ECOUTE-LARGE': {
    intro:
      'Ton archétype révèle une personne à l\'écoute large : tes cinq canaux se tiennent dans un mouchoir, aucun ne crie plus fort. Ton point de vigilance : un besoin diffus attend un nom — sans lui, il reste plié sur lui-même.',
    devise: 'Ma largeur est une antenne : plusieurs fréquences, aucune préférée.',
    apportes:
      'Une réception sans vide : tu reçois l\'affection sur toutes ses fréquences. Avec toi, l\'autre tombe rarement à côté — tous ses canaux passent.',
    freines:
      'Quand tout te remplit, rien ne crie : ton besoin reste difficile à formuler. Ce ne sont pas des défauts — juste ce qui émerge quand chaque canal vaut autant.',
    couple:
      'À garder en tête : classe tes trois dernières joies à deux — la tête de liste dit ton canal.',
    equilibre:
      'Choisis une joie et nomme-la — Non parce que les autres comptent moins, mais parce qu\'une demande précise guide l\'autre.',
  },
};
