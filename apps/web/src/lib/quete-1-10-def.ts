/**
 * Couche accompagnement de la quête 1.10 « Ce que tu apportes » — Monde 2 « Le Volant ».
 *
 * EntreeRegistre rédigée (couche app, ton Task 35 : tutoiement, simple et littéral,
 * phrases courtes, jamais un diagnostic) — elle explique les barres réelles produites
 * par le scorer du Livrable (quete-1-10.ts). Paliers de lecture : doux < 0.40,
 * équilibré < 0.65, fort (communs quetes.ts).
 *
 * ANTI AUTO-FLATTERIE (règle de la quête) : la lecture parle de comportements —
 * ce que tu fais, pas ce que tu es. Aucun palier n'est jugé : chaque niveau est
 * un lieu d'où partir, avec un geste concret en levier. La quête regarde ce que
 * tu OFFRES, jamais ce que tu reçois — aucune dimension n'est « plus noble »
 * (doctrine du Livrable), la contribution n'est ni une note ni un mérite.
 *
 * Clés des dimensions (sans accent, mapping quete-1-10.ts) : 'presence' ↔
 * « fiabilité de présence » · 'reparation' ↔ « capacité de réparation » ·
 * 'compromis' ↔ « ouverture au compromis » · 'torts' ↔ « reconnaissance des
 * torts » · 'soutien' ↔ « soutien actif sans demande ».
 *
 * Typo : apostrophes ASCII uniquement, phrases ≤ 22 mots.
 */
import type { EntreeRegistre } from './quetes';

export const DEF_110: EntreeRegistre = {
  sousTitre: 'Ce que ta présence donne, vraiment.',

  dims: [
    {
      key: 'presence',
      nom: 'Ta fiabilité de présence',
      sousLigne: 'ce que tu dis, et ce que tu fais',
      genre: 'f',
      lecture:
        'Cette barre dit si ta présence tient : annoncer, arriver, donner des nouvelles. Pleine : quand tu dis que tu seras là, tu y es. Légère : des silences de quelques jours s\'installent parfois sans prévenir — à annoncer, ils pèsent moins.',
    },
    {
      key: 'reparation',
      nom: 'Ta réparation',
      sousLigne: 'le premier pas après la dispute',
      genre: 'f',
      lecture:
        'Cette barre dit qui reprend contact après une dispute : toi, l\'autre, ou personne. Pleine : tu fais le premier pas, et le froid raccourcit. Légère : tu attends le retour de l\'autre — et l\'attente peut durer des deux côtés.',
    },
    {
      key: 'compromis',
      nom: 'Ton compromis',
      sousLigne: 'ce qui arrange les deux',
      genre: 'm',
      lecture:
        'Cette barre dit ce que tu fais quand les envies divergent : chercher ce qui arrange les deux, ou tenir ta ligne. Pleine : le terrain commun se cherche tôt, et se trouve. Légère : ta ligne est claire — l\'accord attend parfois que tu poses la question de l\'autre.',
    },
    {
      key: 'torts',
      nom: 'Ta reconnaissance des torts',
      sousLigne: 'dire « j\'ai eu tort », sans détour',
      genre: 'f',
      lecture:
        'Cette barre dit comment tes torts sortent : le jour même et sans détour, ou surtout une fois prouvés. Pleine : l\'aveu sort tôt, et le conflit raccourcit. Légère : l\'aveu attend ses preuves — il coûte plus cher une fois monté.',
    },
    {
      key: 'soutien',
      nom: 'Ton soutien actif',
      sousLigne: 'l\'aide avant la demande',
      genre: 'm',
      lecture:
        'Cette barre dit quand ton aide arrive : avant qu\'on demande, ou sur demande. Pleine : tu remarques la fatigue avant le mot dit — et tu agis. Légère : tu aides quand on te demande — utile aussi ; ça attend juste une sonnette.',
    },
  ],

  accompagnement: {
    presence: {
      fort:
        'Quand tu dis que tu seras là, tu y es — et les gens le savent. Ta parole se vérifie, ça change une relation. Vigilance : la fiabilité n\'exige pas la disponibilité totale — un repos annoncé vaut mieux qu\'une disparition.',
      equilibre:
        'Tu tiens l\'essentiel : les grands rendez-vous, les moments qui comptent. Les petites nouvelles attendent — et l\'attente se lit parfois comme une distance. Ton levier : un message de deux lignes entre deux silences.',
      doux:
        'Des disparitions de quelques jours t\'arrivent, sans nouvelles. Elles ne disent rien de ton cœur — mais l\'autre ne peut pas le lire seul·e. Ton levier : annoncer le silence — « je recharge, je reviens jeudi » : la même distance, sans l\'inquiétude.',
    },
    reparation: {
      fort:
        'Après une dispute, tu reprends contact le premier. Les froids ne durent pas chez toi — c\'est rare, et ça sauve des liens. Vigilance : réparer vite ne veut pas dire avaler tout, seul·e.',
      equilibre:
        'Parfois tu fais le pas, parfois tu attends. Le froid monte alors des deux côtés, chacun persuadé que c\'est à l\'autre. Ton levier : un petit message neutre — « on en reparle ? » — suffit à rouvrir la porte.',
      doux:
        'Après une dispute, tu attends que l\'autre revienne. Ce n\'est pas de la froideur : c\'est souvent la peur de rejouer la scène. Ton levier : le premier pas en trois temps — un mot, un café, le fond. Les trois comptent comme un seul pas.',
    },
    compromis: {
      fort:
        'Quand les envies divergent, tu cherches ce qui arrange les deux. Les décisions se prennent à deux chez toi — ça sécurise. Vigilance : le compromis n\'est pas l\'effacement — un « non » clair vaut mieux qu\'un oui résigné.',
      equilibre:
        'Selon l\'enjeu, tu cherches l\'accord ou tu tiens ta ligne. C\'est sain — tant que la règle du jour se dit à voix haute. Ton levier : dire pourquoi tu tiens — « c\'est non négociable pour moi » évite l\'affront inutile.',
      doux:
        'Quand ça diverge, c\'est souvent toi qui tiens la ligne. Ta constance a de la valeur — et l\'autre peut se sentir invité·e à suivre plutôt qu\'à choisir. Ton levier : demander d\'abord ce qui arrange l\'autre, avant d\'annoncer ta ligne.',
    },
    torts: {
      fort:
        'Quand tu te trompes, tu le dis sans détour — le jour même. Un aveu tôt coûte dix fois moins qu\'un aveu prouvé. Vigilance : l\'aveu n\'est pas la pénitence — le geste qui répare compte plus que la culpabilité.',
      equilibre:
        'Tu avoues — quand les faits sont là, ou quand le moment est bon. L\'essentiel arrive, plus tard que tôt. Ton levier : avancer l\'aveu d\'une journée — dire « j\'ai eu tort » hier évite la démonstration d\'aujourd\'hui.',
      doux:
        'Tes torts sortent surtout quand on te les prouve. Ce n\'est pas du déni : c\'est une image de soi à protéger. Ton levier : séparer le fait du verdict — « j\'ai fait ça » se dit plus facilement que « j\'ai eu tort ».',
    },
    soutien: {
      fort:
        'Tu remarques la fatigue avant qu\'elle soit dite. L\'aide arrive avant la demande — les gens se sentent vus chez toi. Vigilance : repérer ne t\'oblige pas à tout porter — l\'antenne a besoin de repos aussi.',
      equilibre:
        'Tu aides quand on te demande — et ta demande à toi arrive, claire. L\'aide avant la demande reste un exercice. Ton levier : proposer une fois par semaine, sans qu\'on t\'ait rien demandé — « je passe te dépanner ? »',
      doux:
        'L\'aide arrive quand on te la demande, rarement avant. Ce n\'est pas de l\'indifférence — mais l\'autre peut avoir l\'impression de devoir réclamer. Ton levier : une question toute simple — « de quoi tu as besoin, là ? » — transforme l\'attente en attention.',
    },
  },

  conseils: [
    'Relis ta carte dans les deux sens : ce que tu donnes, et ce que tu reçois. Les deux lectures servent.',
    'Choisis UNE dimension et un geste concret cette semaine — un message entre deux silences vaut mieux qu\'une promesse de changement.',
    'Ce que tu apportes se voit dans des scènes, pas des adjectifs — quand tu racontes ta semaine, raconte les gestes.',
    'Garde tes réponses : le miroir de cette quête s\'appuiera dessus à la prochaine étape.',
  ],

  commentLire:
    'Cinq barres, cinq façons d\'apporter : être là, revenir, chercher l\'accord, avouer, aider. Chacune va de 0 à 100, tirée de tes réponses — plus elle est pleine, plus le comportement décrit est fréquent chez toi. Aucune n\'est une note : elles dessinent ce que tu mets sur la table, pas ce que tu vaux.',

  ombreRelationnel: {
    V1:
      'En relation, ta zone d\'ombre peut donner : un partenaire qui reçoit, et qui finit par ne plus regarder ce que tu portes. En face, tu ne dis plus quand ça plie. Ce qui aide : formuler UNE demande par semaine, et la laisser aboutir. La table redevient à deux quand tu y poses aussi ton assiette.',
    V2:
      'En relation, ta zone d\'ombre peut donner : un livre de comptes ouvert en permanence — chaque geste attend son retour. En face, l\'autre se sent en dette plutôt qu\'invité·e. Ce qui aide : un geste sans retour attendu, une fois par semaine. L\'équilibre y gagne de l\'air — et le lien cesse d\'être une addition.',
    V3:
      'En relation, ta zone d\'ombre peut donner : un partenaire qui donne plus qu\'il ne reçoit. À force, il peut emprunter un autre chemin — en silence. Ce qui aide : un premier pas par jour — le geste avant la demande. Poser la première pierre change la mécanique, et ça se voit vite.',
  },

  suivante: '1.11',

  suite: {
    titre: 'Le dernier réglage du monde.',
    intro:
      'Ton volant est réglé : ce que tu vis, ce que tu fais, ce que tu apportes. Reste une question : es-tu prêt·e à rencontrer ? Sans pression — trois questions, juste pour te poser la question.',
    questions: [
      'Ta dernière relation : finie, en cours d\'oubli, ou encore en toi ?',
      'Si la bonne personne arrivait demain : aurais-tu le temps et l\'espace pour elle ?',
    ],
    cta: 'Voir si je suis prêt·e',
  },
};
