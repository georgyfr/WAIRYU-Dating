/**
 * Archétypes de la quête 1.5 — L'épreuve du temps (gabarit Task 35).
 * Chaque type est écrit à la 2ᵉ personne, SIMPLE ET LITTÉRAL, dans les 6
 * champs du gabarit : intro (« Ton archétype révèle une personne qui… » +
 * point de vigilance), devise (1ʳᵉ personne, rapport au temps), « Ce que tu
 * apportes », « Ce qui peut te freiner », « En couple », « Ton équilibre ».
 *
 * Ancrage : les 5 cartes VERBATIM (nom, lumière, ombre, tension) restent dans
 * quete-1-5.ts ; les profils du miroir (07-miroir.md — lumière, ombre en
 * couple, tension) sont RESUMÉS en toutes lettres, jamais recopiés : aucun
 * segment ≥ 60 caractères n'est repris d'un module ou du Livrable.
 *
 * Doctrine du Livrable : neutralité absolue entre les 5 types (aucun n'est
 * dressé en idéal — céder n'est pas faible, attendre n'est pas mûr), registre
 * probabiliste (« parfois », « peut »), zéro jugement, jamais une étiquette.
 *
 * Typo : apostrophe ASCII uniquement, écriture inclusive « celles et ceux »,
 * tutoiement constant, phrases courtes (≤ 22 mots).
 */
import type { ArchetypeCarte } from './quetes-plus';

export const ARCHES_1_5: Record<'V1' | 'V2' | 'V3' | 'V4' | 'V5', ArchetypeCarte> = {
  // V1 — Le·La Main qui cueille (c = 0, les six en A) : l'instant qui s'ouvre, et ce qui attend derrière.
  V1: {
    intro:
      'Ton archétype révèle une personne qui prend la vie au moment où elle tend la main. Tu es de celles et ceux qui cueillent tout de suite : l\'argent touché ce soir, le dîner chaud, la rencontre sans délai. Ton présent accueille, et ça se lit dès la première conversation. Ton point de vigilance : répété, le tout-de-suite laisse des chantiers ouverts. Des projets sans taille ni garde — et quelqu\'un qui attend encore le plan promis.',
    devise: 'Je prends la vie quand elle se présente, pas plus tard.',
    apportes:
      'De la spontanéité, une présence facile à lire, des jours qui bougent. Avec toi, une envie se dit et se vit sans détour — les gens savent où en est ta main.',
    freines:
      'Les délais longs, les dossiers qui traînent, les promesses de « plus tard ». Ce ne sont pas des défauts — juste ce qui pèse quand tout se décide sur le moment.',
    couple:
      'Tu rends les semaines vivantes : sortie décidée, dîner improvisé, affection directe. À garder en tête : à deux, certaines choses réclament un plan — la conversation repoussée au soir suivant, l\'épargne reportée. Nommer ce qui attend désamorce presque tout.',
    equilibre:
      'Garder une décision par semaine prise à froid. Non parce que cueillir serait un problème, mais parce qu\'un choix posé en connaissance de cause tient mieux le lendemain.',
  },

  // V2 — Le·La Vague qui frappe (c = 1-2, majorité immédiate) : l'élan qui commence, et la relecture à froid.
  V2: {
    intro:
      'Ton archétype révèle une personne dont l\'élan choisit vite et fort. Tu es de celles et ceux qui commencent tôt : la belle rencontre ce week-end, l\'appartement signé sans tarder. Tu as attendu une fois ou deux — quand l\'enjeu te parlait fort. Ton point de vigilance : la vague entraîne parfois des décisions à chaud, relues à froid le mois d\'après.',
    devise: 'Je me lance vite, et je vois ce que ça donne.',
    apportes:
      'Des commencements. Tu lances les histoires, tu oses le premier pas, tu engages là où d\'autres laissent attendre — et les lancers, ça compte.',
    freines:
      'Les délais imposés, les décisions qui doivent tout peser, les caps qui changent sous tes pieds. Ce ne sont pas des défauts — juste ce qui coince quand l\'élan n\'a plus la main.',
    couple:
      'Avec toi, les histoires démarrent tôt — ça sécurise celles et ceux qui aiment quand ça avance. À garder en tête : décider vite engage parfois l\'autre dans un cap qui change en une semaine.',
    equilibre:
      'Ajouter une nuit quand quelqu\'un d\'autre embarque. Non parce que ton élan serait faux, mais parce qu\'une décision partagée se prend à deux rythmes.',
  },

  // V3 — Le·La Funambule du temps (c = 3-4, équilibre des mains) : le tempo pièce par pièce, et le fil qui bouge.
  V3: {
    intro:
      'Ton archétype révèle une personne qui marche sur le fil entre cueillir et attendre. Tu es de celles et ceux qui lisent chaque pièce : un choix pour ce soir, un choix pour la semaine six. Ton tempo se règle au cas par cas, pas par principe — c\'est ta signature. Ton point de vigilance : ton tempo bouge avec l\'humeur du jour, et l\'autre ne peut pas le deviner.',
    devise: 'Je lis chaque situation, et je choisis son tempo.',
    apportes:
      'Une lecture fine des situations : tu n\'as pas de doctrine, tu adaptes le rythme à chaque pièce. Cette souplesse, à deux, rassure plus qu\'elle ne montre.',
    freines:
      'Les cadres rigides, les plannings figés, les gens qui veulent une règle unique. Ce ne sont pas des défauts — juste ce qui coince quand ta main veut rester libre.',
    couple:
      'Tu sais attendre quand ça vaut la peine, cueillir quand l\'occasion s\'ouvre. À garder en tête : l\'autre pose une question simple et reçoit une réponse qui dépend du jour. Dis ton tempo à voix haute — l\'équilibre se partage.',
    equilibre:
      'Annoncer où tu en es avant qu\'on te le demande. Non parce que ton fil serait bancal, mais parce qu\'un tempo dit à voix haute se marche à deux.',
  },

  // V4 — Le·La Jardinier·se des saisons (c = 5, une seule main immédiate) : la patience qui vise, et la fenêtre qui ferme.
  V4: {
    intro:
      'Ton archétype révèle une personne qui attend que la saison soit bonne. Tu es de celles et ceux qui calibrent : la somme qui double, la personne mieux lue, l\'histoire qui s\'installe. Ta patience ne fuit pas — elle vise, et ça se sent à l\'arrivée. Ton point de vigilance : attendu trop longtemps, certaines fenêtres se ferment avant la décision.',
    devise: 'Je laisse mûrir, et je vise juste.',
    apportes:
      'De la justesse : tu choisis peu, mais tu choisis bien. Ton attente calibre — chez toi, les gens se sentent choisis, pas juste pris.',
    freines:
      'L\'urgence imposée, les occasions à saisir sans réfléchir, les décisions dans la précipitation. Ce ne sont pas des défauts — juste ce qui heurte quand ta main veut d\'abord comprendre.',
    couple:
      'Tu offres une présence qui vise juste : ce qui commence chez toi avait de bonnes raisons de commencer. À garder en tête : l\'autre peut avoir l\'impression de devoir prouver qu\'il vaut le risque de ta main.',
    equilibre:
      'Garder une porte par mois où tu entres sans lire l\'étiquette. Non parce que ta patience serait fausse, mais parce que l\'imprévu réserve aussi de bonnes surprises.',
  },

  // V5 — Le·La Vin qui se garde (c = 6, les six en B) : le temps qui se lit, et la cave qui n'est pas la vie entière.
  V5: {
    intro:
      'Ton archétype révèle une personne qui sait ce qu\'elle veut — et qui accepte le délai qui va avec. Tu es de celles et ceux qui attendent quand il faut : avec toi, le temps se lit, il ne surprend pas, et ça construit du solide. Ton point de vigilance : certaines envies expirent en cave — l\'attente poussée à l\'extrême transforme des occasions en « et si ».',
    devise: 'Je sais attendre — ce que je veux mérite le délai.',
    apportes:
      'Une constance rare : un cadre temporel clair, des promesses qui mûrissent, une présence qui ne change pas de cap du jour au lendemain.',
    freines:
      'L\'immédiat imposé, les décisions prises à chaud, les gens qui veulent tout tout de suite. Ce ne sont pas des défauts — juste ce qui frotte quand ton temps à toi reste posé.',
    couple:
      'À tes côtés, le temps se lit : pas de cap qui bascule, pas de surprise qui blesse. À garder en tête : l\'autre attend sa part de maintenant — un « plus tard » répété peut se vivre comme un « pas toi ».',
    equilibre:
      'Nommer un plaisir « pour maintenant » chaque semaine. Non parce que l\'attente serait une règle à casser, mais parce qu\'elle garde du goût quand elle n\'est pas totale.',
  },
};
