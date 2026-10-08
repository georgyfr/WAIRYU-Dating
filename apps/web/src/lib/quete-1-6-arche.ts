/**
 * Archétypes de la quête 1.6 — Ta façon de penser (Task 37-c, gabarit Task 35).
 * Chaque type est écrit à la 2ᵉ personne, SIMPLE ET LITTÉRAL, dans les 6 champs
 * du gabarit : intro (« Ton archétype révèle une personne qui… » + point de
 * vigilance), devise, « Ce que tu apportes », « Ce qui peut te freiner »,
 * « En couple », « Ton équilibre ».
 *
 * Rédigé d'après les cartes VERBATIM (cartes.yaml) et l'angle miroir
 * (07-miroir.md) : le flair d'abord, la vérification d'abord, et le mixte au
 * centre — les deux pôles sont des forces, aucun n'est jugé (doctrine du
 * Livrable : le flair n'est pas superficiel, l'analytique n'est pas lent, et
 * les énigmes décrivent une manière, pas une note).
 *
 * Ancrage : les cartes VERBATIM (nom, lumière, ombre, tension) restent dans
 * quete-1-6.ts ; la couche accompagnement reste dans quete-1-6-def.ts. La
 * devise est à la 1ʳᵉ personne, sur la manière de traiter l'information.
 * Aucun segment ≥ 60 caractères n'est recopié d'un module à l'autre.
 *
 * Typo : apostrophe ASCII uniquement, écriture inclusive « celles et ceux »,
 * tutoiement constant, phrases ≤ 22 mots.
 */
import type { ArchetypeCarte } from './quetes-plus';

export const ARCHES_1_6: Record<'V1' | 'V2' | 'V3' | 'V4' | 'V5', ArchetypeCarte> = {
  // V1 — L'Horloger·ère : le démontage qui construit, et ce qui se ressent avant de se prouver.
  V1: {
    intro:
      'Ton archétype révèle une personne qui démonte les problèmes pièce par pièce, et dont les réponses tiennent debout. Tu es de celles et ceux qui construisent leur opinion au lieu de la recevoir — chez toi, réfléchir n\'est pas douter, c\'est bâtir. Ton point de vigilance : certaines choses — les gens, les envies, l\'amour — se ressentent d\'abord et se comprennent ensuite, pas l\'inverse.',
    devise: 'Je démonte avant de décider, et ce que je dis tient debout.',
    apportes:
      'Des décisions solides, des arguments clairs, une parole vérifiée. Quand tu te prononces, les autres savent que c\'est du construit — et ils s\'appuient dessus sans le dire.',
    freines:
      'L\'improvisation, les réponses attendues à chaud, les gens qui décident au flair. Ce ne sont pas des défauts — juste ce qui grippe quand tout doit passer par le démontage avant d\'exister.',
    couple:
      'Tu apportes une fiabilité de fond : les grandes décisions à deux tiennent, parce que tu les as pesées. À garder en tête : face à un partenaire qui pense ressenti, tes raisons peuvent sonner comme un examen — la même exigence se dit en question ouverte.',
    equilibre:
      'Accueillir le ressenti sans le faire passer à l\'examen. Non parce que la vérification serait fausse, mais parce que certaines vérités arrivent avant leurs preuves — et qu\'elles comptent autant.',
  },

  // V2 — Le Flair : la première impression qui conduit, et la seconde lecture qui manque.
  V2: {
    intro:
      'Ton archétype révèle une personne qui décide avec le ventre et avance avec le style. Ta première impression est ta boussole, et souvent elle a raison : là où d\'autres hésitent, tu as déjà ton idée. Ton point de vigilance : les situations qui demandent une seconde lecture te prennent parfois — parce que tu as déjà répondu.',
    devise: 'Je fais confiance à mon flair, et j\'y vais.',
    apportes:
      'De la vitesse, du style, une lecture directe des gens et des situations. Ton élan ouvre les conversations que l\'analyse aurait fait attendre.',
    freines:
      'Les longues analyses, les listes de pour et contre, les décisions qui traînent. Ce ne sont pas des défauts — juste ce qui s\'endort quand ta façon d\'avancer n\'a plus de vent.',
    couple:
      'Tu apportes un élan rare : décider vite, vivre vite, réparer vite aussi. À garder en tête : un partenaire qui vérifie peut te sembler lent — et se sentir dépassé quand tu tranches sans poser le pour et le contre.',
    equilibre:
      'Offrir à ta première impression une seconde lecture, parfois. Non parce que ton flair mentirait, mais parce que les pièges habiles ressemblent à ce que tu attendais — et que deux regards valent mieux qu\'un.',
  },

  // V3 — Le Flair qui vérifie : l'instinct suivi, la méthode cachée.
  V3: {
    intro:
      'Ton archétype révèle une personne qui suit son instinct — et qui, face aux pièges, a vérifié. Tu ressens vite et tu confirmes sans te l\'avouer : un flair qui ne se croit pas infaillible, c\'est la meilleure des combinaisons. Ton point de vigilance : tu te dis purement instinctif·ve — la part de méthode que tes résultats racontent mérite d\'être reconnue.',
    devise: 'Je ressens vite, et je vérifie en silence.',
    apportes:
      'Un flair rapide ET des conclusions qui tiennent. Tu sens la direction avant les autres et tu arrives rarement trompé·e — c\'est rare, et ça se remarque.',
    freines:
      'Les gens qui ne jurent que par les preuves, les décisions à justifier à chaud. Ce ne sont pas des défauts — juste ce qui irrite quand ta méthode reste invisible, même à toi.',
    couple:
      'Tu apportes les deux tempos : l\'enthousiasme du flair et la sécurité du vérifié. À garder en tête : ton partenaire peut croire que tout t\'arrive par chance — montre-lui, de temps en temps, le travail derrière l\'intuition.',
    equilibre:
      'Te l\'avouer : oui, tu vérifies. Non pour alourdir ta rapidité, mais parce qu\'une méthode reconnue se partage — et rend les décisions à deux plus solides.',
  },

  // V4 — Le·La Prudent·e : la vérification qui protège, et la complication qui coûte.
  V4: {
    intro:
      'Ton archétype révèle une personne qui pèse, qui vérifie et qui refuse de répondre trop vite — même aux questions qui en veulent. Ta prudence t\'a évité plus d\'erreurs qu\'elle t\'en a coûté de chances, et tes décisions le montrent. Ton point de vigilance : certaines réponses simples existent vraiment — l\'habitude de chercher la complication peut les faire passer inaperçues.',
    devise: 'Je pèse avant de trancher, sans douter de tout.',
    apportes:
      'Du sérieux dans les décisions, un œil sur les détails qui fuient, un non posé au bon moment. Les choix faits avec toi sont rarement regrettés — ils tiennent.',
    freines:
      'Les questions qui veulent une réponse immédiate, les paris du quotidien, les gens qui décident au mouvement. Ce ne sont pas des défauts — juste ce qui coince quand vérifier devient le ticket d\'entrée de tout.',
    couple:
      'Tu apportes une sécurité rare : rien d\'important ne se décide à chaud avec toi. À garder en tête : un partenaire rapide peut vivre tes délais comme un doute sur ses idées — nomme-les du soin, pas de la suspicion.',
    equilibre:
      'Te fier parfois à l\'évidence, sans la démonter. Non parce que la prudence serait un défaut, mais parce qu\'une réponse simple accueillie à temps économise des heures — et laisse de l\'énergie pour ce qui compte.',
  },

  // V5 — Les Deux Mains : l'outil choisi selon le terrain, et le geste qu'on ne forge plus.
  V5: {
    intro:
      'Ton archétype révèle une personne à deux mains : une qui sent, une qui mesure. Selon le terrain, tu changes d\'outil — et tu comprends les deux camps, l\'intuitif et l\'analyste. Ton point de vigilance : quand les deux outils marchent partout, aucun ne devient une spécialité — choisis parfois le même, pour le forger.',
    devise: 'Je choisis l\'outil selon le terrain : je sens, et je mesure.',
    apportes:
      'Une souplesse de pensée rare : tu comprends le rapide ET le méthodique, et tu fais le pont entre les deux sans te moquer d\'aucun.',
    freines:
      'Les terrains qui exigent de s\'engager dans UN seul mode, les choix à tenir dans la durée. Ce ne sont pas des défauts — juste ce qui coince quand ta flexibilité n\'a plus de terrain pour s\'exercer.',
    couple:
      'Tu es un traducteur précieux : le ressenti ET la structure parlent avec toi. À garder en tête : devenir le passage obligé de toutes les décisions fatigue — pose ta propre position avant de traduire celle des autres.',
    equilibre:
      'Choisir un outil — et parfois s\'y tenir. Non pour te brider, mais parce qu\'un geste répété devient une force : deux mains sûres battent deux mains occupées.',
  },
};
