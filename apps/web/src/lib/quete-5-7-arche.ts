/**
 * Archétypes de la quête 5.7 — Ton humour (Monde 6 « Mon Cœur » · 💎
 * PREMIUM).
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
 * quete-5-7.ts ; ces textes s'appuient sur le corps des cartes (cartes.yaml)
 * et les textures du 07-miroir.md (TA LUMIÈRE / TON OMBRE EN COUPLE / TA
 * TENSION / LE MINI-RES) — RÉÉCRITS, jamais recopiés : aucun segment ≥ 60
 * caractères n'est repris tel quel du miroir.
 *
 * NEUTRALITÉ TYPOLOGIQUE (doctrine capitale du Livrable) : les quatre
 * façons de faire rire se valent — aucun style supérieur, aucun classement,
 * aucune variante dressée en idéal. DOCTRINE DE L'OMBRE : l'ombre = le
 * COÛT (pour soi ET pour l'autre), pas la nature du style — « qui blesse »
 * et « qui s'auto-rabaisse » restent assumés avec leur coût nommé, pas
 * condamnés. Aucun vocabulaire clinique, aucune étiquette.
 *
 * Typo : apostrophe ASCII uniquement, phrases ≤ 22 mots.
 */
import type { ArchetypeCarte } from './quetes-plus';

export const ARCHES_57: Record<
  'CARTE-5.7-RAPPROCHE' | 'CARTE-5.7-LEGER' | 'CARTE-5.7-TRANCHANT' | 'CARTE-5.7-DESAMORCE',
  ArchetypeCarte
> = {
  // CARTE-5.7-RAPPROCHE — le rire qui ouvre la table, et le grave qui
  // attend son tour.
  'CARTE-5.7-RAPPROCHE': {
    intro:
      'Ton archétype révèle une personne dont le rire ouvre la table : les langues se délient et la gêne s\'en va. Ton point de vigilance : le moment grave part en plaisanterie avant d\'avoir eu lieu.',
    devise: 'Mon rire est une porte ouverte : la table se rallume quand j\'arrive.',
    apportes:
      'Un lien qui se fabrique en riant : chez toi, les nouveaux se retrouvent vite. Avec toi, une soirée se débloque — les gens se parlent, et ils reviennent.',
    freines:
      'Le rire qui lie repousse le grave : une inquiétude glisse en sketch sans réponse. Ce ne sont pas des défauts — juste ce qui émerge quand la table rit fort.',
    couple: 'À garder en tête : laisse un espace sans rire — le grave a besoin d\'un ton à lui.',
    equilibre:
      'Pose une question sérieuse sans la clore en blague — Non parce que le rire est de trop, mais parce que l\'essentiel attend.',
  },
  // CARTE-5.7-LEGER — le recul qui traverse, et la phrase claire qui
  // attend.
  'CARTE-5.7-LEGER': {
    intro:
      'Ton archétype révèle une personne qui traverse les coups durs en les rendant racontables. Une panne, un lundi noir, une déception deviennent des histoires qu\'on peut entendre. Ton point de vigilance : le rire posé trop tôt ferme la conversation nécessaire.',
    devise: 'Mon recul est un pont : les mauvais jours se racontent, et le poids se partage.',
    apportes:
      'Un calme qui se transmet : les gens repartent de tes mauvaises nouvelles plus légers. Avec toi, les périodes longues se traversent — le recul aide à tenir.',
    freines:
      'Le rire console vite : il dit parfois moins que ce qui pèse, et l\'autre croit le sujet réglé. Ce ne sont pas des défauts — juste ce qui émerge quand le sourire parle avant les mots.',
    couple: 'À garder en tête : nomme le poids une fois sans blague — le rire reprendra après.',
    equilibre:
      'Laisse passer le mot sérieux avant le sourire — Non parce que ton rire est faux, mais parce qu\'il console mieux après.',
  },
  // CARTE-5.7-TRANCHANT — le franc-parler qui voit le faux, et la cible à
  // ne pas prendre de vitesse.
  'CARTE-5.7-TRANCHANT': {
    intro:
      'Ton archétype révèle une personne au franc-parler vif : ton humour voit vite le faux. Chez toi, les gens savent où ils en sont. Ton point de vigilance : le mot part avant que sa cible ait choisi de l\'être.',
    devise: 'Mon mot dit vrai : pas de comédie, et chacun sait où il en est.',
    apportes:
      'Une franchise qui rassure : les gens lassés des discours se reposent chez toi. Ton mot juste arrive tôt — et il reste.',
    freines:
      'La pique ne prévient pas sa cible : elle rit avec le groupe, puis elle garde pour elle. Ce ne sont pas des défauts — juste ce qui émerge quand la vivacité parle en premier.',
    couple:
      'À garder en tête : une faille confiée mérite un cadre privé — la vivacité improvise en public, la douceur protège.',
    equilibre:
      'Demande à la cible ce qu\'elle a reçu — Non parce que ton mot est faux, mais parce qu\'elle seule décide de rire.',
  },
  // CARTE-5.7-DESAMORCE — la gêne désamorcée d'avance, et le costume qui
  // s'épuise.
  'CARTE-5.7-DESAMORCE': {
    intro:
      'Ton archétype révèle une personne qui désarme la gêne : avant qu\'elle ne s\'installe, tu l\'occupes déjà. Ton point de vigilance : la blague sur soi peut devenir la seule présentation.',
    devise: 'Mon rire ouvre la marche : je me moque de moi, et la gêne repart.',
    apportes:
      'Une générosité qui met à l\'aise : tu donnes l\'exemple en commençant par toi. Avec toi, les postures tombent — les débuts se détendent.',
    freines:
      'La faille racontée en riant finit par ne raconter qu\'elle : tes faiblesses se connaissent par cœur, tes forces se devinent. Ce ne sont pas des défauts — juste ce qui émerge quand le costume devient adresse.',
    couple:
      'À garder en tête : rassurer à l\'infini épuise — un partenaire ne rattrape pas chaque blague que tu fais sur toi.',
    equilibre:
      'Raconte une force sans rire, une seule — Non parce que tes blagues sont de trop, mais parce qu\'une adresse se complète.',
  },
};
