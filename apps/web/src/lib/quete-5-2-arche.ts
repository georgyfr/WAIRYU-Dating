/**
 * Archétypes de la quête 5.2 — Ta vision de l'amour (Monde 6
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
 * quete-5-2.ts ; ces textes s'appuient sur le corps des cartes (cartes.yaml)
 * et les textures du 07-miroir.md (TA LUMIÈRE / TON OMBRE EN COUPLE / TA
 * TENSION / LE MINI-RES) — RÉÉCRITS, jamais recopiés : aucun segment ≥ 60
 * caractères n'est repris tel quel du miroir.
 *
 * NEUTRALITÉ AXIOLOGIQUE STRICTE (doctrine capitale du Livrable) : une
 * croyance n'est ni saine ni fragile — le destin n'est pas une passivité,
 * l'éclair n'est pas une légèreté, l'unique n'est pas un refus du réel, le
 * potentiel n'est pas une illusion à corriger. Chaque axe a sa lumière et
 * son ombre EN EXCÈS, jouée en couple, coût pour soi ET pour l'autre.
 * SLOT PROBABILISTE : le rendu raconte un rapport au temps — zéro verdict,
 * zéro prédiction, zéro correction de croyance, zéro hiérarchie. Jamais un
 * diagnostic, jamais une étiquette clinique, aucun palier flatté ni blâmé.
 *
 * Typo : apostrophe ASCII uniquement, phrases ≤ 22 mots.
 */
import type { ArchetypeCarte } from './quetes-plus';

export const ARCHES_52: Record<
  | 'CARTE-5.2-ECRIT-DAVANCE'
  | 'CARTE-5.2-ECLAIR'
  | 'CARTE-5.2-UNIQUE'
  | 'CARTE-5.2-VERSION-QUI-POURRAIT',
  ArchetypeCarte
> = {
  // CARTE-5.2-ECRIT-DAVANCE — l'évidence qui accueille, et la main qui
  // choisit en plus de lire.
  'CARTE-5.2-ECRIT-DAVANCE': {
    intro:
      'Ton archétype révèle une personne qui laisse la vie surprendre : une rencontre marquante a un goût d\'évidence, et l\'imprévu t\'intéresse. Ton point de vigilance : un désaccord se traverse — il ne se déchiffre pas comme un signe.',
    devise: 'Ma foi est une route ouverte : ce qui m\'appelle finit par me trouver — et je reste disponible.',
    apportes:
      'Une ouverture aux arrivées : tu laisses les choses te surprendre. Avec toi, une histoire garde de l\'air — l\'imprévu est un invité, pas une menace.',
    freines:
      'Lire chaque jour comme un texte à interpréter fatigue — et le signe attendu reporte l\'initiative sur l\'autre. Ce ne sont pas des défauts — juste ce qui émerge quand l\'évidence a souvent précédé le plan.',
    couple:
      'À garder en tête : dis ce que tu choisis, en plus de ce que tu lis.',
    equilibre:
      'Choisis une chose à construire cette semaine — Non parce que l\'évidence est fausse, mais parce que construire fait aussi partie du chemin.',
  },
  // CARTE-5.2-ECLAIR — le feu des commencements, et le temps qui repose les
  // étapes une par une.
  'CARTE-5.2-ECLAIR': {
    intro:
      'Ton archétype révèle une personne touchable : les débuts te traversent, et tu donnes du crédit au premier contact. Ton point de vigilance : la vitesse saute des étapes — repose-les une par une, le temps sait faire.',
    devise: 'Ma force est un éclair : je me laisse saisir — et je laisse au temps sa part.',
    apportes:
      'Une intensité qui se voit : les débuts te vivent grand. Avec toi, un commencement a du feu — personne ne reste spectateur.',
    freines:
      'T\'engager sur une première impression peut courir devant la confiance — et l\'autre hérite d\'un rôle qu\'il n\'a pas choisi. Ce ne sont pas des défauts — juste ce qui émerge quand l\'élan a souvent précédé le temps.',
    couple:
      'À garder en tête : laisse la deuxième rencontre être autre chose que la première.',
    equilibre:
      'Repose une étape sautée — Non parce que l\'éclair ment, mais parce que la confiance se bâtit après l\'élan.',
  },
  // CARTE-5.2-UNIQUE — la promesse entière, et le réel qui la renouvelle.
  'CARTE-5.2-UNIQUE': {
    intro:
      'Ton archétype révèle une personne fidèle à une promesse entière : collectionner ne t\'intéresse pas — tenir, oui. Ton point de vigilance : une histoire se mesure à ce qu\'elle tient, et le mythe éclaire comme il cache.',
    devise: 'Ma promesse est entière : ce que je construis reçoit de moi un poids rare.',
    apportes:
      'Une loyauté de longue haleine : tu prends une histoire au sérieux. Avec toi, rien n\'est jetable — une relation se prend pour tenir.',
    freines:
      'Mesurer chaque histoire contre une légende use le quotidien — et l\'autre finit par rivaliser avec un fantôme. Ce ne sont pas des défauts — juste ce qui émerge quand le grand amour a précédé les personnes.',
    couple:
      'À garder en tête : traite le grand amour comme une décision que tu renouvelles — elle tient mieux qu\'une évidence.',
    equilibre:
      'Nomme une qualité ordinaire de l\'autre — Non parce que le mythe tombe, mais parce que le quotidien a ses grandeurs.',
  },
  // CARTE-5.2-VERSION-QUI-POURRAIT — l'élévation qui se sent, et le présent
  // qui mérite ses mots.
  'CARTE-5.2-VERSION-QUI-POURRAIT': {
    intro:
      'Ton archétype révèle une personne qui voit le meilleur des gens — cette élévation se sent, et les gens grandissent près de toi. Ton point de vigilance : le potentiel ne signe rien — la personne présente, si.',
    devise: 'Mon regard est un projecteur : je nomme des forces que les gens n\'avaient pas nommées.',
    apportes:
      'Une élévation qui se sent : près de toi, on se découvre des forces. Avec toi, on ose plus — le meilleur se voit, et on s\'y essaie.',
    freines:
      'Aimer un potentiel fatigue : la personne réelle et la version imaginée divergent, et l\'écart se paie des deux côtés. Ce ne sont pas des défauts — juste ce qui émerge quand l\'image avance plus vite que le présent.',
    couple:
      'À garder en tête : nomme ce que tu vois déjà, avant ce que tu rêves.',
    equilibre:
      'Dis une qualité que tu vois — Non parce que le rêve est trop grand, mais parce que le réel mérite ses mots.',
  },
};
