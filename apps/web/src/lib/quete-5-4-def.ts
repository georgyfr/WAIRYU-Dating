/**
 * Couche accompagnement de la quête 5.4 « Face aux désaccords »
 * (Monde 7 « Face aux Tempêtes » · 💎 PREMIUM).
 *
 * Rédigée (jamais verbatim du Livrable), ton Task 35 : tutoiement, simple et
 * littéral, phrases courtes, jamais un diagnostic, jamais culpabilisant.
 * Alimente l'entrée « 5.4 » du registre (quetes.ts).
 *
 * NEUTRALITÉ STRICTE DES POSTURES (doctrine capitale du Livrable — à ne pas
 * inverser) : les cinq façons de tenir un désaccord se valent — aucune
 * posture supérieure ou inférieure, aucun classement, aucune « aptitude au
 * conflit » mesurée. DOCTRINE DE L'OMBRE : l'ombre = le COÛT EN COUPLE
 * (l'affirmeur qui écrase · le coopérateur qui s'oublie · le comprometteur
 * qui ne tranche jamais · l'éviteur qui enterre · le cédant qui accumule),
 * jamais la nature — le coût est nommé pour soi ET pour l'autre, en
 * situation de couple, au registre probabiliste. Lumière symétrique : qui
 * tranche le blocage · qui répare · qui désamorce · qui laisse refroidir ·
 * qui laisse la place. AUCUNE trame dans cette couche : les 8▲ (JR1/SD,
 * codes Q5.4-T43 → T50) ne touchent aucun texte ici (aucune restitution —
 * règle 11-b).
 *
 * Les clés des dims = les postures du scorer (quete-5-4.ts).
 *
 * Typo : apostrophe ASCII uniquement, phrases ≤ 22 mots, aucun code/score
 * ni métadonnée moteur dans un texte rendu.
 */
import type { EntreeRegistre } from './quetes';

export const DEF_54: EntreeRegistre = {
  sousTitre:
    'La quête de tes désaccords : cinq façons de tenir un désaccord, racontées sans classement.',

  dims: [
    {
      key: 'affirmation',
      nom: 'Affirmer',
      sousLigne: 'la position tenue jusqu\'au bout',
      genre: 'm',
      lecture:
        'Cette barre dit la place que ta position prend dans un désaccord. Pleine : tu tiens ta ligne jusqu\'au bout, et le dernier mot laissé d\'en face te pèse après coup. Légère : dès qu\'un échange frotte, ta position s\'efface vite. Les deux places se valent — la barre décrit une posture, elle ne note rien.',
    },
    {
      key: 'cooperation',
      nom: 'Coopérer',
      sousLigne: 'la solution qui garde les deux',
      genre: 'm',
      lecture:
        'Cette barre dit la place du besoin d\'en face dans tes désaccords. Pleine : tu creuses d\'abord ce qui compte vraiment chez chacun. Légère : tes besoins passent d\'abord, le reste attend. Les deux places se valent — la barre décrit une posture, elle ne note rien.',
    },
    {
      key: 'compromis',
      nom: 'Compromettre',
      sousLigne: 'le milieu qui débloque',
      genre: 'm',
      lecture:
        'Cette barre dit le milieu que tu cherches quand ça bloque. Pleine : tu proposes des arrangements où chacun lâche un peu. Légère : la moitié renoncée te laisse sur ta faim. Les deux places se valent — la barre décrit une posture, elle ne note rien.',
    },
    {
      key: 'evitement',
      nom: 'Éviter',
      sousLigne: 'le sujet remis à plus tard',
      genre: 'm',
      lecture:
        'Cette barre dit ce que tu fais quand le sujet fâche. Pleine : tu remets à plus tard, tu laisses refroidir avant de revenir. Légère : chez toi, le sujet fâcheux se règle mieux sur le champ. Les deux places se valent — la barre décrit une posture, elle ne note rien.',
    },
    {
      key: 'cession',
      nom: 'Céder',
      sousLigne: 'la place laissée à l\'autre',
      genre: 'm',
      lecture:
        'Cette barre dit la place que tu laisses à l\'autre. Pleine : pour la paix, tu acceptes des décisions qui te déplaisent. Légère : ton avis et ton non se disent, même quand cela déplaît. Les deux places se valent — la barre décrit une posture, elle ne note rien.',
    },
  ],

  accompagnement: {
    // SENS : fort = posture très présente · doux = posture discrète — les
    // cinq se valent, aucun palier flatté ni blâmé (neutralité stricte).
    // L'ombre y est le COÛT EN COUPLE nommé (pour toi / pour l'autre), pas
    // une faute.
    affirmation: {
      fort:
        'Ta position tenue débloque les impasses : tu nommes le problème et la maison repart. C\'est une fermeté utile. Son coût : l\'autre peut voir sa place rétrécir, et toi encaisser des accords de surface. Ce qui aide : offrir un tour de parole avant la décision — l\'autre y existera.',
      equilibre:
        'Ta fermeté vient par touches : tantôt tu tiens la barre, tantôt tu la partages. C\'est un entre-deux fréquent. Ce qui aide : repérer les désaccords où tu tranches — et ceux où tu écoutes d\'abord.',
      doux:
        'Dès qu\'un échange frotte, ta position s\'efface : tu laisses la place plutôt que le duel. C\'est un autre rapport à la force. Son coût : ton avis peut sortir de la décision. Ce qui aide : dire ta ligne une fois, même courte — elle compte dans la maison.',
    },
    cooperation: {
      fort:
        'Tu creuses ce qui compte pour chacun avant de proposer : tes disputes finissent en compréhension neuve. C\'est une vraie force de réparation. Son coût : porter la table à bout de bras te vide, et l\'autre doit formuler un besoin à chaque fois. Ce qui aide : une décision rapide, une fois par semaine — tout ne se négocie pas.',
      equilibre:
        'L\'enquête à deux voix alterne : des sujets se creusent, d\'autres se règlent vite. Les deux jours se valent. Ce qui aide : dire à l\'autre lequel des deux est là — le ton du désaccord s\'annonce.',
      doux:
        'Le point de vue d\'en face te paraît une perte de temps : tu règles d\'abord tes besoins. C\'est une autre entrée en matière. Son coût : la version qui garde les deux peut sortir de la table. Ce qui aide : poser une question sur le besoin d\'en face — elle ouvre des portes.',
    },
    compromis: {
      fort:
        'Tu proposes des arrangements où chacun lâche un peu : avec toi, les sujets avancent. C\'est un vrai pouvoir de désamorçage. Son coût : des accords tièdes s\'accumulent, et le vrai besoin reste sous le deal — pour toi comme pour l\'autre. Ce qui aide : dire ce qui ne se coupe pas — le milieu gardera alors sa place.',
      equilibre:
        'Le mi-chemin vient selon les sujets : tantôt l\'arrangement, tantôt la position tenue. Les deux jours se valent. Ce qui aide : repérer les désaccords qui méritaient mieux que la moitié.',
      doux:
        'Renoncer à la moitié de tes attentes te laisse sur ta faim : tu préfères les accords pleins. C\'est un autre rythme. Son coût : un blocage peut durer sans milieu proposé. Ce qui aide : proposer un petit arrangement d\'essai — il rouvre la porte.',
    },
    evitement: {
      fort:
        'Tu laisses refroidir avant de revenir : à froid, le même sujet coûte moins cher qu\'à chaud. C\'est un outil réel. Son coût : le sujet remis grossit en silence — une liste mentale pour toi, des sujets soulevés seule pour l\'autre. Ce qui aide : poser une date au lieu d\'un silence — le sujet s\'arrêtera de grossir.',
      equilibre:
        'La pause vient selon la charge du sujet : tantôt sur le champ, tantôt plus tard. Les deux rythmes se valent. Ce qui aide : dire quand tu reviendras — l\'attente change de nature.',
      doux:
        'Un sujet qui fâche se règle mieux sur le champ, chez toi : la conversation arrive vite. C\'est une autre façon de tenir la maison. Son coût : à chaud, les mots peuvent coûter plus cher. Ce qui aide : quelques respirations avant de répondre — le fond garde son temps.',
    },
    cession: {
      fort:
        'Pour la paix, tu acceptes des décisions qui te déplaisent : le foyer retrouve son calme vite. C\'est une vraie générosité. Son coût : un compte de silence se remplit pour toi, et l\'autre vit avec un demi-oui. Ce qui aide : dire une préférence chaque jour, même petite — la paix vaut mieux sans dette.',
      equilibre:
        'La place laissée varie selon les sujets : tantôt tu cèdes, tantôt tu poses ton avis. Les deux gestes se valent. Ce qui aide : remarquer les oui donnés facilement — et ceux qui pèsent.',
      doux:
        'Ton avis et ton non se disent, même quand cela déplaît : ta place est posée. C\'est une autre forme de paix. Son coût : le climat peut chauffer plus vite. Ce qui aide : garder un ton doux dans le non — il passe mieux et il reste.',
    },
  },

  conseils: [
    'Les cinq façons de tenir un désaccord se valent : ta posture se raconte, elle ne se classe pas.',
    'L\'ombre d\'une posture est un coût en couple, pas une faute — elle se nomme pour toi comme pour l\'autre.',
    'Au moment du désaccord, dis la règle du jour : tranché, partagé, remis, composé, cédé — un mot suffit.',
    'Ta carte se partage si tu veux : ta posture est une façon d\'être trouvé, pas une note.',
  ],

  commentLire:
    'Cinq barres, et elles viennent de TES réponses : une par façon de tenir un désaccord. ' +
    'Affirmer, coopérer, compromettre, éviter, céder. ' +
    'Elles vont de 0 à 100 — ni une note, ni un verdict. ' +
    'Plus pleine ne veut pas dire mieux : les cinq façons se valent. ' +
    'Chacune a sa grâce et son coût en couple — les deux sont écrits dessous. ' +
    'Relis-les comme un portrait, pas un tribunal.',

  ombreRelationnel: {
    'CARTE-5.4-GOUVERNAIL':
      'En relation, ta zone d\'ombre peut donner : le match où garder la main coûte plus cher que le sujet. Pour toi : des accords de surface, acceptés dehors et contestés dedans. Pour l\'autre : une place qui rétrécit, jusqu\'à ne plus proposer. Ce qui aide : offrir un tour de parole avant la décision — l\'autre y existera.',
    'CARTE-5.4-ATELIER':
      'En relation, ta zone d\'ombre peut donner : la table de négociation permanente. Pour toi : porter la relation à bout de bras, une vigilance qui te vide. Pour l\'autre : formuler un besoin à chaque fois, même sans force. Ce qui aide : une décision rapide, une fois par semaine — tout ne se négocie pas.',
    'CARTE-5.4-PASSERELLE':
      'En relation, ta zone d\'ombre peut donner : la pile d\'arrangements tièdes. Pour toi : l\'art de régler sans trancher ce qui compte. Pour l\'autre : un partenaire qui négocie tout, même ce qui méritait mieux. Ce qui aide : dire ce qui ne se coupe pas — le vrai besoin a droit à mieux qu\'un deal.',
    'CARTE-5.4-PAUSE':
      'En relation, ta zone d\'ombre peut donner : le sujet enterré, grossi de ce qui n\'a pas été dit. Pour toi : une tension diffuse que tu sens sans la nommer. Pour l\'autre : soulever les sujets seule, lire ton silence comme de l\'indifférence. Ce qui aide : poser une date au lieu d\'un silence — le sujet s\'arrêtera de grossir.',
    'CARTE-5.4-PASSAGE':
      'En relation, ta zone d\'ombre peut donner : le compte de silence qui se remplit sans être encaissé. Pour toi : le sentiment de ne pas compter à pleine mesure. Pour l\'autre : un demi-oui qui se sent parfois comme un flouage. Ce qui aide : dire une préférence chaque jour, même petite — la paix vaut mieux sans dette.',
    'CARTE-5.4-DUO':
      'En relation, ta zone d\'ombre peut donner : deux tempos sans règle dite. Pour toi : réexpliquer ta méthode à chaque friction. Pour l\'autre : ne plus savoir quand la décision se prend, ni avec qui. Ce qui aide : annoncer ta main dès l\'entrée — le duo joue alors la même partition.',
    'CARTE-5.4-EQUILIBRE':
      'En relation, ta zone d\'ombre peut donner : la méthode qui change de forme. Pour toi : donner des clés que l\'autre n\'a pas. Pour l\'autre : entrer dans chaque désaccord sans mode d\'emploi, et parfois y renoncer. Ce qui aide : un mot avant chaque désaccord — la règle du jour suffit.',
  },

  // La chaîne du Monde 7 continue vers 5.5 « Quand la tension monte » (cadre
  // gelé) — l'id est intégré à l'union IdQuete (Task 55, orchestrateur).
  suivante: '5.5',

  suite: {
    titre: 'La suite de ton voyage',
    intro:
      'Ta posture est posée — cinq façons de tenir un désaccord à égalité, chacune avec sa grâce et son coût. ' +
      'La suite du voyage regarde la montée : « Quand la tension monte », comment la tension s\'exprime et ce qu\'elle fait à deux. ' +
      'Ce qui frotte se dit, ce qui monte se traverse — à deux.',
    questions: [
      'Quand la tension monte chez toi, qu\'est-ce qui se passe d\'abord — et que veux-tu en garder ?',
      'Quel signe annonce, chez toi, qu\'un désaccord a besoin d\'air — un mot, un temps, un geste ?',
    ],
    // CTA générique : la quête suivante n'est pas construite au registre —
    // le texte ne présuppose rien de son contenu (zéro teaser).
    cta: 'Continuer le voyage',
  },
};
