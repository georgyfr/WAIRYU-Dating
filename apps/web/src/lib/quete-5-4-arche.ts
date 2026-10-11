/**
 * Archétypes de la quête 5.4 — Face aux désaccords (Monde 7 « Face aux
 * Tempêtes » · 💎 PREMIUM).
 *
 * Même gabarit que les quêtes 1.x-5.x : chaque type est écrit à la 2ᵉ
 * personne, SIMPLE ET LITTÉRAL, dans les 6 champs — intro (« Ton archétype
 * révèle une personne qui… » + point de vigilance), devise, « Ce que tu
 * apportes », « Ce qui peut te freiner » (refermé sur « Ce ne sont pas des
 * défauts — juste ce qui émerge quand… »), « En couple » (« À garder en
 * tête : … »), « Ton équilibre » (un geste + « Non parce que…, mais parce
 * que… »).
 *
 * Ancrage : les cartes VERBATIM (nom, lumière, ombre, tension) restent dans
 * quete-5-4.ts ; ces textes s'appuient sur le corps des cartes (cartes.yaml)
 * et les textures du 07-miroir.md (TA LUMIÈRE / TON OMBRE EN COUPLE / TA
 * TENSION / LE MINI-RES) — RÉÉCRITS, jamais recopiés : aucun segment ≥ 60
 * caractères n'est repris tel quel du miroir.
 *
 * NEUTRALITÉ STRICTE DES POSTURES (doctrine capitale du Livrable) : les
 * cinq façons de tenir un désaccord se valent — les profils mixte et
 * égalitaire sont des réponses complètes, pas des moyens-termes. OMBRE = le
 * COÛT EN COUPLE (pour soi ET pour l'autre), jamais la nature — aucune
 * posture dressée en idéal ou en défaut. Aucun vocabulaire clinique, aucune
 * étiquette. AUCUNE trame ici (les 8▲ ne touchent aucun archétype — règle
 * 11-b).
 *
 * Typo : apostrophe ASCII uniquement, phrases ≤ 22 mots.
 */
import type { ArchetypeCarte } from './quetes-plus';

export const ARCHES_54: Record<
  | 'CARTE-5.4-GOUVERNAIL'
  | 'CARTE-5.4-ATELIER'
  | 'CARTE-5.4-PASSERELLE'
  | 'CARTE-5.4-PAUSE'
  | 'CARTE-5.4-PASSAGE'
  | 'CARTE-5.4-DUO'
  | 'CARTE-5.4-EQUILIBRE',
  ArchetypeCarte
> = {
  // CARTE-5.4-GOUVERNAIL — le cap qui tient, et le duel à désamorcer.
  'CARTE-5.4-GOUVERNAIL': {
    intro:
      'Ton archétype révèle une personne qui tient son cap dans le désaccord : chez toi, les choses se disent enfin. Ton point de vigilance : la main ferme peut tourner au match, et l\'autre renonce avant sa phrase.',
    devise: 'Mon cap tient la maison : je nomme le problème, et la route se rouvre.',
    apportes:
      'Une décision claire dans le blocage : quand tout le monde tourne en rond, toi tu tranches. Les soirées qui s\'épuisent s\'arrêtent chez toi.',
    freines:
      'La position tenue peut écraser l\'échange : des accords de surface, une place qui rétrécit. Ce ne sont pas des défauts — juste ce qui émerge quand le duel prend tout l\'espace.',
    couple:
      'À garder en tête : une décision forcée ne tient que par la personne qui s\'y est pliée.',
    equilibre:
      'Demande un tour de parole avant de conclure — Non pour ta ligne, mais parce que deux voix tiennent mieux qu\'une.',
  },
  // CARTE-5.4-ATELIER — l'enquête à deux voix, et la table qui s'installe
  // partout.
  'CARTE-5.4-ATELIER': {
    intro:
      'Ton archétype révèle une personne qui mène le désaccord comme une enquête à deux voix : le vrai besoin sort. Ton point de vigilance : chaque friction peut devenir une table de négociation, même les petites.',
    devise:
      'Je cherche la version qui garde les deux : une dispute finit en compréhension, pas en dette.',
    apportes:
      'Une réparation qui tient : avec toi, les sujets se creusent et se règlent en profondeur. Les gens se sentent entendus jusque dans le désaccord.',
    freines:
      'La table permanente épuise : une vigilance qui te vide, des besoins à formuler sans force pour l\'autre. Ce ne sont pas des défauts — juste ce qui émerge quand tout se négocie.',
    couple:
      'À garder en tête : une décision rapide, sans audit — tout ne se négocie pas.',
    equilibre:
      'Choisis sans enquête sur un petit sujet — Non pour ton audit, mais parce que le lien a droit au repos.',
  },
  // CARTE-5.4-PASSERELLE — le milieu qui rouvre, et le besoin sous le deal.
  'CARTE-5.4-PASSERELLE': {
    intro:
      'Ton archétype révèle une personne qui débloque par le milieu : chacun lâche un peu, et la vie repart. Ton point de vigilance : le deal peut couvrir le vrai besoin, et le sujet revenir plus tôt que prévu.',
    devise: 'Je rouvre la porte par le milieu : chacun lâche un peu, les sujets avancent.',
    apportes:
      'Un désamorçage qui fait avancer : là où une position se fige, ton arrangement rouvre la conversation. Une maison qui avance dort mieux.',
    freines:
      'Le milieu se paie en silence : des accords tièdes, un besoin laissé sous le deal. Ce ne sont pas des défauts — juste ce qui émerge quand tout passe par la moitié.',
    couple:
      'À garder en tête : nomme ce qui ne se coupe pas — le vrai besoin a droit à mieux qu\'un deal.',
    equilibre:
      'Défends un sujet sans le couper — Non parce que le milieu est mauvais, mais parce que certains sujets valent un accord plein.',
  },
  // CARTE-5.4-PAUSE — le refroidissement outil, et le placard qui grossit.
  'CARTE-5.4-PAUSE': {
    intro:
      'Ton archétype révèle une personne qui sait laisser refroidir : la pause est un outil, et le sujet à chaud coûte plus cher. Ton point de vigilance : le sujet remis grossit de ce qui n\'a pas été dit autour.',
    devise: 'Je laisse passer l\'orage : à froid, la conversation coûte moins cher.',
    apportes:
      'Un calme qui fait respirer la maison : avec toi, les cris sont rares. Un soir de recul détend ce qu\'une heure de tension envenime.',
    freines:
      'La pause peut devenir un placard : une liste mentale qui s\'allonge, des sujets soulevés seule. Ce ne sont pas des défauts — juste ce qui émerge quand le silence dure.',
    couple:
      'À garder en tête : pose une date au lieu d\'un silence — le sujet attend sans enfler.',
    equilibre:
      'Annonce ta date de retour sur le sujet — Non parce que ta pause est à fuir, mais parce qu\'une date change l\'attente.',
  },
  // CARTE-5.4-PASSAGE — le climat choisi, et le compte de silence.
  'CARTE-5.4-PASSAGE': {
    intro:
      'Ton archétype révèle une personne qui choisit le climat : céder n\'est pas perdre, c\'est laisser la place au lien. Ton point de vigilance : les petits oui s\'accumulent en un compte de silence que personne ne voit.',
    devise: 'Je choisis la paix du foyer : la place que je laisse garde le lien entier.',
    apportes:
      'Une quiétude qui revient vite : avec toi, le foyer se détend. Ta place laissée est une vraie générosité de tous les jours.',
    freines:
      'La paix achetée se paie à terme : des déplaisirs mis en pile, un avis qui sort des décisions. Ce ne sont pas des défauts — juste ce qui émerge quand le oui part trop vite.',
    couple:
      'À garder en tête : un demi-oui se sent parfois comme un flouage — la paix vaut mieux sans dette.',
    equilibre:
      'Dis une préférence par jour, même petite — Non parce que ton oui est faux, mais parce qu\'il compte plus en clair.',
  },
  // CARTE-5.4-DUO — les deux mains, et la règle à dire.
  'CARTE-5.4-DUO': {
    intro:
      'Ton archétype révèle une personne aux deux mains : une main tranche, l\'autre compose — et le sujet décide. Ton point de vigilance : deux tempos sans règle dite se lisent en brouillard.',
    devise: 'Deux mains mènent chez moi : je sais tenir ma place, et la céder au bon moment.',
    apportes:
      'Une palette rare : savoir tenir et savoir composer se rencontre peu chez la même personne. Le désaccord a deux portes avec toi.',
    freines:
      'Le duo change de main sans prévenir : l\'autre ne sait plus quelle règle joue. Ce ne sont pas des défauts — juste ce qui émerge quand le duo ne se nomme pas.',
    couple:
      'À garder en tête : annonce ta main dès l\'entrée — le duo joue alors la même partition.',
    equilibre:
      'Dis la règle du jour avant la friction — Non pour ton duo, mais parce qu\'une règle dite protège les deux.',
  },
  // CARTE-5.4-EQUILIBRE — la palette entière, et la règle du jour.
  'CARTE-5.4-EQUILIBRE': {
    intro:
      'Ton archétype révèle une personne à cinq outils : aucune posture n\'a dominé, et le sujet appelle la main. Ton point de vigilance : une méthode qui change de forme se devine mal de l\'extérieur.',
    devise: 'Ma main change avec le sujet : le conflit est un problème, pas une identité.',
    apportes:
      'Une vraie souplesse : le désaccord reçoit la main qu\'il demande, et non l\'inverse. Les cinq postures vivent dans ta boîte.',
    freines:
      'La palette change de main, et la lecture suit difficilement : des clés que l\'autre n\'a pas. Ce ne sont pas des défauts — juste ce qui émerge quand la règle change de forme.',
    couple:
      'À garder en tête : un mot d\'entrée par désaccord — tranché, partagé, remis, composé, cédé.',
    equilibre:
      'Dis sous quelle règle le désaccord se joue — Non parce que ta palette est fautive, mais parce qu\'une règle dite rassure.',
  },
};
