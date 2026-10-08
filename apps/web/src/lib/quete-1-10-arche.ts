/**
 * Archétypes de la quête 1.10 — Ce que tu apportes (gabarit Task 35).
 * Chaque variante est écrite à la 2ᵉ personne, SIMPLE ET LITTÉRAL, dans les 6
 * champs du gabarit : intro (« Ton archétype révèle une personne qui… » +
 * point de vigilance), devise, « Ce que tu apportes », « Ce qui peut te
 * freiner », « En couple », « Ton équilibre ». Rédigé d'après les cartes
 * (cartes.yaml) et le miroir de quête (07-miroir.md) des 3 profils :
 * contributeur fort / équilibré / asymétrique.
 *
 * ANTI AUTO-FLATTERIE (règle de la quête, valable au rendu aussi) : des
 * comportements et des scènes, jamais des qualités — ce que tu FAIS, pas ce
 * que tu ES. L'asymétrique (V3) est une mécanique de couple, jamais un
 * procès : zéro label accusateur, zéro vocabulaire clinique, aucun futur
 * certain. Aucun segment ≥ 60 caractères n'est recopié d'un module à
 * l'autre ; la carte VERBATIM (nom, lumière, ombre, tension) reste dans
 * quete-1-10.ts.
 *
 * Typo : apostrophe ASCII uniquement, écriture inclusive « celles et ceux »,
 * pas de mélange tu/vous.
 */
import type { ArchetypeCarte } from './quetes-plus';

export const ARCHES_1_10: Record<'V1' | 'V2' | 'V3', ArchetypeCarte> = {
  // V1 — La Balise : la présence qui revient, et le pilier qui ne dit pas quand il plie.
  V1: {
    intro:
      'Ton archétype révèle une personne qui revient : premier contact après la dispute, réponse arrivée avant la demande, tort reconnu le jour même. Ce que tu offres se vérifie — et ça tient une table à deux. Ton point de vigilance : le pilier ne dit pas quand il plie — et donner peut devenir ta seule façon de recevoir.',
    devise: 'Je dis que je serai là, et j\'y suis.',
    apportes:
      'Une présence qui se vérifie : le premier contact après la dispute, la fatigue repérée avant le mot dit, l\'aveu sans détour. Les gens savent ce qu\'ils recevront de toi — et ça arrive avant la demande.',
    freines:
      'Demander, recevoir, dire ce qui te pèse. Ce ne sont pas des défauts — juste les gestes qui s\'effacent quand donner occupe toute la place.',
    couple:
      'Tu construis une sécurité concrète : les gestes arrivent avant les demandes, les excuses sortent le jour même. À garder en tête : l\'autre peut cesser de voir ce que tu portes — formule une demande par semaine, et laisse-la aboutir.',
    equilibre:
      'Formuler une demande par semaine, et la laisser aboutir. Non parce que donner serait un problème, mais parce que recevoir s\'exerce — et qu\'une balise qui reçoit éclaire plus longtemps.',
  },

  // V2 — L'Échelle : l'appui des deux côtés, et le livre de comptes qui guette.
  V2: {
    intro:
      'Ton archétype révèle une personne qui tient la balance. Tu cherches ce qui arrange les deux, tu admets tes torts, tu aides selon le jour. Rien de spectaculaire — un équilibre qui se vérifie en marchant. Ton point de vigilance : le compte exact — rendre chaque effort peut transformer le lien en livre de comptes.',
    devise: 'Je cherche ce qui nous arrange, et je tiens la balance.',
    apportes:
      'Un équilibre qui se marche : des accords cherchés, des torts admis, une aide qui arrive — parfois avant, parfois sur demande. Les liens tiennent la durée avec toi, sans drame ni surprise.',
    freines:
      'Les gestes qui ne reviennent pas, les jours où la balance ne trouve pas son équilibre. Ce ne sont pas des défauts — juste ce qui gratte quand le lien ressemble à un livre de comptes.',
    couple:
      'Tu apportes des décisions qui arrangent les deux, des excuses sincères, une régularité sans drame. À garder en tête : tout peser fatigue les deux plateaux — un geste sans retour attendu redonne de l\'air au lien.',
    equilibre:
      'Offrir un geste par semaine sans le noter dans la colonne des retours. Non parce que l\'équilibre serait faux, mais parce qu\'un lien n\'est pas une addition.',
  },

  // V3 — La Rocade : la clarté de la demande, et le centre du don à reprendre.
  V3: {
    intro:
      'Ton archétype révèle une personne qui sait ce qu\'elle attend des gens — et qui le demande sans détour. Ton côté du chemin est bien entretenu : tu sais où tu veux aller, et ça se lit. Ton point de vigilance : quand la demande occupe toute la place, l\'offre s\'efface — et l\'autre finit par passer ailleurs.',
    devise: 'Je demande sans détour — et je pose la première pierre.',
    apportes:
      'De la clarté : tes besoins se lisent, tes demandes font avancer, personne ne doit deviner à ta place. Une table où l\'on sait ce qu\'on vient chercher — ça évite bien des malentendus.',
    freines:
      'Le premier pas, l\'offre sans demande, le geste qui ne rapporte rien tout de suite. Ce ne sont pas des défauts — juste les muscles au repos quand la demande suffit.',
    couple:
      'Tu apportes une direction lisible : ce que tu veux se sait, les malentendus tombent. À garder en tête : l\'autre peut se sentir un service avant d\'être une personne — un premier pas par jour rééquilibre, sans bouleverser.',
    equilibre:
      'Faire un premier pas par jour — le geste avant la demande. Non parce que demander serait faux, mais parce qu\'un chemin se parcourt à deux quand les deux le pavent.',
  },
};
