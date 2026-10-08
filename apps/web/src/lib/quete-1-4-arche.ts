/**
 * Archétypes de la quête 1.4 — Ton contrôle sur toi-même (Monde 2 « Le Volant »).
 *
 * Même gabarit que la quête 1.1 (Task 35) : chaque type est écrit à la 2ᵉ
 * personne, SIMPLE ET LITTÉRAL, dans les 6 champs — intro (« Ton archétype
 * révèle une personne qui… » + point de vigilance), devise, « Ce que tu
 * apportes », « Ce qui peut te freiner » (refermé sur « Ce ne sont pas des
 * défauts — juste ce qui émerge quand… »), « En couple » (« À garder en
 * tête : … »), « Ton équilibre » (un geste + « Non parce que…, mais parce
 * que… »).
 *
 * Ancrage : les cartes VERBATIM (nom, lumière, ombre, tension) restent dans
 * quete-1-4.ts ; ces textes s'appuient sur le corps des cartes (cartes.yaml)
 * et les briques texture A du 07-miroir.md (TA LUMIÈRE / TON OMBRE EN COUPLE /
 * TA TENSION / MINI-RES) — RÉÉCRITS, jamais recopiés : aucun segment ≥ 60
 * caractères n'est repris tel quel du miroir. Jamais un diagnostic, jamais
 * une étiquette clinique, aucun palier flatté ni blâmé.
 *
 * Typo : apostrophe ASCII uniquement, phrases ≤ 22 mots.
 */
import type { ArchetypeCarte } from './quetes-plus';

export const ARCHES_1_4: Record<'V1' | 'V2' | 'V3' | 'V4' | 'V5', ArchetypeCarte> = {
  // V1 — L'Artisan·e : la promesse tenue envers soi-même, et le jour où ça glisse.
  V1: {
    intro:
      'Ton archétype révèle une personne qui tient ce qu\'elle décide. Tu es de celles et ceux qui transforment une décision en fait : la limite tient, la promesse se vérifie. Ce n\'est pas de la discipline militaire — c\'est une confiance que tu t\'accordes, jour après jour. Ton point de vigilance : le jour où tu glisses, tu peux te juger sans pitié.',
    devise: 'Je décide pour de vrai : ce que je choisis, ça tient.',
    apportes:
      'Un sol simple : ta parole se vérifie, ton oui est fiable, ton non est solide. Les autres peuvent poser leurs plans sur le tien — sans surveiller, sans deviner. Cette fiabilité tranquille les met en confiance.',
    freines:
      'L\'imprévu qui déborde le plan, l\'émotion sans raison datée, le désordre non prévu. Ce ne sont pas des défauts — juste ce qui émerge quand le solide rencontre ce qui ne rentre dans aucun plan.',
    couple:
      'Tu apprécies un lien qui tient dans la durée : des accords clairs, des habitudes partagées, un essentiel qui ne bouge pas. À garder en tête : ta fiabilité construit un sol — veille à ce qu\'elle ne devienne pas un plafond.',
    equilibre:
      'Laisser un imprévu entrer sans le remettre en ligne. Non parce que le plan serait mauvais, mais parce qu\'une vie se partage aussi là où il n\'y a rien à corriger.',
  },

  // V2 — Le Juste-Milieu assumé : la hiérarchie qui protège, et la frontière qui se brouille.
  V2: {
    intro:
      'Ton archétype révèle une personne qui sait hiérarchiser. Tu es de celles et ceux qui gardent l\'essentiel debout et laissent le reste négocier. Ton contrôle n\'est pas une armure : c\'est une hiérarchie. Ton point de vigilance : la frontière entre flexible et fatigué se brouille parfois.',
    devise: 'Je tiens ce qui compte, et je lâche ce qui ne compte pas.',
    apportes:
      'Une constance où ça compte : ce qui ne bouge pas chez toi est fiable pour tout le monde. Tu offres du réglage, pas de la rigidité — l\'essentiel protégé, le reste respirable.',
    freines:
      'Les promesses remises « à la prochaine », les jours où le fil lâche sous la tension. Ce ne sont pas des défauts — juste ce qui émerge quand l\'équilibre se règle seul, sans témoin.',
    couple:
      'Tu apprécies une relation où l\'essentiel ne se discute plus, et où le reste a de la place. À garder en tête : tes engagements peuvent se dédoubler — solides devant les autres, souples en privé. Dis la règle du jour plutôt que la laisser deviner.',
    equilibre:
      'Vérifier de quel côté tu es — flexible ou fatigué — avant de renoncer à une limite. Non parce que lâcher serait mal, mais parce qu\'une frontière claire protège aussi ta souplesse.',
  },

  // V3 — Le·La Vivant·e : l'essai sincère, et la rechute qui recommence.
  V3: {
    intro:
      'Ton archétype révèle une personne qui recommence. Tu es de celles et ceux dont les résolutions sont sincères — et dont les rechutes le sont aussi. Tu ajustes, tu retentes, tu recommences : une vie qui préfère l\'essai à la culpabilité. Ton point de vigilance : le « c\'est la dernière fois » perd son sens à force de se répéter.',
    devise: 'J\'avance par essais sincères — je rate, j\'ajuste, je recommence.',
    apportes:
      'Un esprit vivant : tu essaies, tu rates, tu retentes — et tu rends le changement moins effrayant pour tout le monde. Ta tolérance pour l\'échec dédramatise celle des autres.',
    freines:
      'Les promesses qui expirent au premier lundi, les rituels qui ne s\'installent pas. Ce ne sont pas des défauts — juste ce qui émerge quand le changement compte plus que la méthode qui le porterait.',
    couple:
      'Tu apprécies un lien qui te laisse retenter sans te noter : droit à l\'essai, droit à l\'erreur. À garder en tête : l\'autre peut s\'essouffler à croire aux « dernières fois ». Un repère répété rassure plus qu\'un grand soir.',
    equilibre:
      'Choisir un rituel plutôt qu\'une promesse. Non parce que tu manquerais de volonté, mais parce qu\'un repère répété tient mieux qu\'une décision héroïque.',
  },

  // V4 — Le·La Cédant·e de bonne foi : les intentions là, et le fil qui casse.
  V4: {
    intro:
      'Ton archétype révèle une personne de bonne foi. Tu es de celles et ceux dont les intentions sont là — c\'est le fil entre l\'intention et l\'élan qui casse. Tu le vis avec humour, parfois avec lassitude. Ton point de vigilance : « je suis comme ça » peut devenir une histoire que tu te racontes.',
    devise: 'Je crois en moi plus longtemps qu\'un lundi.',
    apportes:
      'Une présence sincère et sans calcul : tes envies se voient, tes pardons arrivent vite. Tu rends la vie légère autour de toi — et l\'échec moins tabou.',
    freines:
      'Les objectifs lointains, les plaisirs proches, les lundis sans témoin. Ce ne sont pas des défauts — juste ce qui émerge quand le fil entre l\'intention et l\'élan casse encore.',
    couple:
      'Tu apprécies la spontanéité partagée : des jours vivants, un lien sans gestion. À garder en tête : tes reprises se voient à deux — un départ prévu qui glisse, et l\'autre qui attend. Une promesse à la fois : petite, tenue, puis la suivante.',
    equilibre:
      'Une seule promesse en cours à la fois — petite, datée, terminée. Non parce que tes envies comptent moins, mais parce que chaque tenue recrée la confiance que tu t\'accordes.',
  },

  // V5 — L'Immédiat : le présent tendu, et le délai qu'on ne donne pas.
  V5: {
    intro:
      'Ton archétype révèle une personne qui vit au présent tendu. Tu es de celles et ceux qui répondent à l\'envie quand elle arrive — sincèrement, sans calcul, sans hypocrisie. C\'est une manière entière d\'exister. Ton point de vigilance : ce que tu veux vraiment — vraiment — demande parfois un délai.',
    devise: 'L\'envie arrive, je réponds — sans calcul.',
    apportes:
      'Une vivacité qui rend les jours habités : tu es là, tout entier, à ce qui arrive. Avec toi, les moments simples deviennent des moments vécus.',
    freines:
      'Les délais, les comptes à rendre, les promesses datées. Ce ne sont pas des défauts — juste ce qui émerge quand le présent porte tout le poids de la décision.',
    couple:
      'Tu apprécies la spontanéité à deux : des envies qui se disent, des jours qui s\'improvisent. À garder en tête : l\'autre a besoin de dates tenues pour s\'appuyer. L\'usure du crédit de parole se voit d\'abord autour de toi, pas en toi.',
    equilibre:
      'Donner à ce que tu veux vraiment le délai qu\'il demande. Non parce que le présent serait un problème, mais parce que ce qui attend devient parfois plus grand.',
  },
};
