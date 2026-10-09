/**
 * Archétypes de la quête 3.3 — Ton temps libre (Monde 4 « Ton Terrain »).
 *
 * Même gabarit fondateur que les quêtes 1.x/2.x (Task 35) : chaque type est
 * écrit à la 2ᵉ personne, SIMPLE ET LITTÉRAL, dans les 6 champs — intro
 * (« Ton archétype révèle une personne qui… » + point de vigilance), devise,
 * « Ce que tu apportes », « Ce qui peut te freiner » (refermé sur « Ce ne
 * sont pas des défauts — juste ce qui émerge quand… »), « En couple »
 * (« À garder en tête : … »), « Ton équilibre » (un geste + « Non parce
 * que…, mais parce que… »).
 *
 * Ancrage : les cartes VERBATIM (nom, lumière, ombre, tension) restent dans
 * quete-3-3.ts ; ces textes s'appuient sur le corps des cartes (cartes.yaml)
 * et les briques du 07-miroir.md (MR-33-TL-CENTRIFUGE · MR-33-TL-MIXTE ·
 * MR-33-TL-CENTRIPETE — TA LUMIÈRE / TON OMBRE EN COUPLE / TA TENSION /
 * LE MINI-RES, gabarit GAB-MR-33-TL) — RÉÉCRITS, jamais recopiés : aucun
 * segment ≥ 60 caractères n'est repris tel quel.
 *
 * NEUTRALITÉ DU MODE (doctrine capitale du Livrable) : les trois façons de
 * se nourrir se valent — le grand air n'est pas « instable », le cocon
 * n'est pas « casanier-rétréci », l'entre-deux n'est pas « indécis » (trois
 * jugements interdits au rendu). L'ombre nomme une conséquence du mouvement
 * du type — jamais un défaut ni un jugement moral ; registre probabiliste
 * (jamais le futur certain sur l'autre). L'homogamie se dit en information
 * (une activité de fond à deux proposée, jamais exigée). AUCUNE trace des
 * trames CSR (moteur seul — verrou 04 n° 5) ; le mot « consommations » et
 * le sigle CSR ne figurent nulle part au rendu.
 *
 * Typo : apostrophe ASCII uniquement, phrases ≤ 22 mots.
 */
import type { ArchetypeCarte } from './quetes-plus';
import type { VarianteId33 } from './quete-3-3';

export const ARCHES_33: Record<VarianteId33, ArchetypeCarte> = {
  // CARTE-3.3-GRAND-AIR — la ressource dehors, et quelqu'un qui attend que
  // tu rentres (MODE_D haut : nourri dehors).
  'CARTE-3.3-GRAND-AIR': {
    intro:
      'Ton archétype révèle une personne qui se ressource dehors. Après une semaine chargée, tu ressors : les rues, les terrasses, les gens — le monde te remplit. Ton point de vigilance : le dehors emmène parfois, et quelqu\'un attend que tu rentres.',
    devise: 'Je me ressource dehors — et j\'en reviens plus disponible.',
    apportes:
      'Une énergie qui rentre avec toi : les sorties que tu proposes, les lieux que tu fais découvrir, les envies qui bougent. Avec toi, la semaine chargée se termine dehors — et la maison retrouve quelqu\'un de disponible.',
    freines:
      'Les soirées qui s\'installent à la maison, les week-ends entiers au calme, les plans sans destination. Ce ne sont pas des défauts — juste ce qui émerge quand ta ressource vit ailleurs.',
    couple:
      'Tu apprécies un lien qui sort : des terrasses, des chemins, des gens à croiser. À garder en tête : un loisir de fond partagé à deux ramène la ressource à la maison — propose-le.',
    equilibre:
      'Choisir une sortie à deux et la tenir comme un rendez-vous de la semaine. Non parce que rester serait un problème, mais parce qu\'une ressource se raconte mieux quand elle se partage.',
  },

  // CARTE-3.3-ENTRE-DEUX-RIVES — les deux rives, et un mode à nommer pour
  // être lisible (MODE_D central : mixte).
  'CARTE-3.3-ENTRE-DEUX-RIVES': {
    intro:
      'Ton archétype révèle une personne aux deux rives. Tantôt le dehors te recharge, tantôt le chez-toi — tu glisses selon les semaines, et la souplesse épouse tes envies. Ton point de vigilance : ton mode se lit mal de l\'extérieur — dis-le avant que l\'autre ne devine.',
    devise: 'Je change de rive quand la semaine le demande.',
    apportes:
      'Une souplesse qui suit les saisons de l\'autre : dehors quand ça appelle, dedans quand ça repose. Avec toi, deux rythmes trouvent leur place — personne ne subit le programme de l\'autre.',
    freines:
      'Les questions sans réponse : dehors ou chez vous, ce week-end ? Les plans à double scénario. Ce ne sont pas des défauts — juste ce qui émerge quand ta rive bouge au fil des semaines.',
    couple:
      'Tu apprécies un lien qui respire : tantôt des sorties, tantôt du calme, sans doctrine. À garder en tête : nommer ta rive de la semaine en trois mots — l\'autre prépare un scénario au lieu de deux.',
    equilibre:
      'Dire en trois mots ta rive du moment — au début de la semaine, avant les plans. Non parce que ta souplesse serait un défaut, mais parce qu\'un mode dit tôt devient une convention douce.',
  },

  // CARTE-3.3-CHEMINEE — la ressource dedans, une façon entière de se
  // nourrir, et une fenêtre à ouvrir (MODE_D bas : nourri chez soi).
  'CARTE-3.3-CHEMINEE': {
    intro:
      'Ton archétype révèle une personne qui se ressource chez elle. Derrière ta porte, la maison te rend à toi : le calme est ta vraie ressource, et elle tient la distance. Ton point de vigilance : le cocon ferme parfois — quelqu\'un voudrait sortir avec toi.',
    devise: 'Ma recharge commence derrière ma porte — et elle tient.',
    apportes:
      'Un calme qui se partage : chez toi, la maison respire et les semaines retrouvent un rythme. Avec toi, le repos redevient une ressource — il porte les deux.',
    freines:
      'Les sorties proposées tard, les semaines qui s\'annoncent bien remplies, le dehors qui réclame sa part. Ce ne sont pas des défauts — juste ce qui émerge quand ta ressource vit à l\'intérieur.',
    couple:
      'Tu apprécies un lien qui rentre : des soirées simples, une maison qui pose, du temps qui ne se dévore pas. À garder en tête : ouvrir une fenêtre de dehors à deux — le dedans s\'ouvre sans se vider.',
    equilibre:
      'Accueillir une sortie à deux, même courte — et la traiter comme une vraie fenêtre. Non parce que ton chez-toi manquerait de rien, mais parce qu\'une fenêtre éclaire la pièce.',
  },
};
