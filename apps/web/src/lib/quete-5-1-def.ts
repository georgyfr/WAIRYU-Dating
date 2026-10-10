/**
 * Couche accompagnement de la quête 5.1 « Ton style amoureux »
 * (Monde 6 « Mon Cœur »).
 *
 * Rédigée (jamais verbatim du Livrable), ton Task 35 : tutoiement, simple et
 * littéral, phrases courtes, jamais un diagnostic, jamais culpabilisant.
 * Alimente l'entrée « 5.1 » du registre (quetes.ts).
 *
 * NEUTRALITÉ TYPOLOGIQUE STRICTE (doctrine capitale du Livrable — à ne pas
 * inverser) : les six façons d'aimer se valent — aucune n'est supérieure ou
 * inférieure, aucune n'est « plus mature ». Ici « fort » désigne le SENS DE
 * LA BARRE (la façon est marquée dans tes réponses) et « doux » son opposé
 * (elle reste discrète) : aucun palier n'est flatté ni blâmé. L'ombre =
 * l'EXCÈS en couple, jamais la nature — le mécanisme, un exemple de vie à
 * deux, et le coût pour soi ET pour l'autre, les deux nommés. Zéro
 * diagnostic, zéro étiquette clinique : l'intensité se décrit en
 * comportements quotidiens. Aucun nom d'atelier de la typologie ni de son
 * auteur — le nommage UI obligatoire s'applique (la passion, le jeu,
 * l'amitié devenue amour, le pragmatisme, l'intensité, le don de soi).
 *
 * Les clés des dims = les six façons du scorer (quete-5-1.ts).
 *
 * Typo : apostrophe ASCII uniquement, phrases ≤ 22 mots, aucun code/score
 * ni métadonnée moteur dans un texte rendu, « toujours »/« jamais » exclus
 * des textes rendus.
 */
import type { EntreeRegistre } from './quetes';

/** « 5.2 » est la quête suivante du Monde 6 — l'union IdQuete s'élargira au
 *  câblage du registre (quetes.ts, tâche d'intégration). Pont de typage en
 *  attendant l'extension du type (même convention que quete-3-6-def.ts). */
type IdSuivante51 = EntreeRegistre['suivante'];

export const DEF_51: EntreeRegistre = {
  sousTitre:
    'La première quête de ton cœur : les façons d\'aimer que tu habites, racontées sans classement.',

  dims: [
    {
      key: 'passion',
      nom: 'La passion',
      sousLigne: 'la flamme qui s\'empare, le reste qui attend',
      genre: 'f',
      lecture:
        'Cette barre dit la place de la passion dans tes réponses. Pleine : l\'attirance réorganise tout le reste, la flamme s\'installe vite. Légère : tu la laisses venir, sans qu\'elle commande. Les deux manières se valent — la barre décrit une intensité, elle ne note rien.',
    },
    {
      key: 'jeu',
      nom: 'Le jeu',
      sousLigne: 'la mise légère, l\'air qui détend',
      genre: 'm',
      lecture:
        'Cette barre dit la part de jeu dans ta façon d\'aimer. Pleine : la taquinerie et le pas de côté détendent l\'histoire. Légère : tu préfères le sol à l\'air, et la clarté tranche. Les deux se valent — une mise légère et un sol ferme se répondent.',
    },
    {
      key: 'amitie',
      nom: 'L\'amitié devenue amour',
      sousLigne: 'la lenteur qui assure, la pousse sans presse',
      genre: 'f',
      lecture:
        'Cette barre dit comment tes liens prennent. Pleine : la conversation d\'abord, la confiance ensuite, le reste après. Légère : tu peux aimer vite et bien, sans passer par l\'amitié. Les deux façons se valent — la durée et la flamme ne se hiérarchisent pas.',
    },
    {
      key: 'pragmatisme',
      nom: 'Le pragmatisme',
      sousLigne: 'le projet qui tient, la vie qui se bâtit',
      genre: 'm',
      lecture:
        'Cette barre dit le poids du concret dans ton amour. Pleine : les projets de vie collent, les décisions se prennent à deux. Légère : la rencontre passe avant la liste, le coup de cœur décide. Les deux se valent — bâtir et surprendre se valent.',
    },
    {
      key: 'intensite',
      nom: 'L\'intensité',
      sousLigne: 'le besoin de signes, la présence qui veille',
      genre: 'f',
      lecture:
        'Cette barre dit ton besoin de signes au quotidien. Pleine : les signes réguliers te mettent en paix, ton attention veille. Légère : le calme des silences te suffit. Les deux se valent — une vigilance et une sérénité se valent.',
    },
    {
      key: 'don',
      nom: 'Le don de soi',
      sousLigne: 'la main qui donne, le soin sans compte',
      genre: 'm',
      lecture:
        'Cette barre dit la place du soin dans tes réponses. Pleine : tu prends soin sans compter, tu devines les besoins avant les mots. Légère : tu reçois d\'abord, tu donnes ensuite. Les deux se valent — donner et recevoir se répondent.',
    },
  ],

  accompagnement: {
    // SENS : fort = la façon est marquée · doux = la façon reste discrète —
    // les six façons se valent, aucun palier n'est flatté ni blâmé (neutralité
    // typologique stricte) ; l'ombre = l'EXCÈS en couple, jamais la nature.
    passion: {
      fort:
        'La flamme prend vite chez toi : l\'attirance réorganise tout le reste. En couple, l\'excès ferait du calme une fin du feu — et l\'autre pourrait se sentir en dessous des sommets. Ce qui aide : nomme un mardi réussi, le feu y vit aussi.',
      equilibre:
        'Chez toi, la flamme monte et se pose : les sommets et les jours ordinaires cohabitent. C\'est un entre-deux fréquent, et rien à corriger. Ce qui aide : dis ce qui t\'embrase encore, pour que l\'autre sache où est le feu.',
      doux:
        'La passion reste chez toi une invitation : l\'attirance grandit sans s\'emparer de tout. Les histoires lentes ont leur feu à elles — il chauffe autrement. Ce qui aide : nomme ce qui t\'allume, même doucement — un feu dit se partage mieux.',
    },
    // SENS : fort = le jeu marqué · doux = le sol préféré à l'air — la
    // légèreté et le sérieux se valent (aucune hiérarchie des façons).
    jeu: {
      fort:
        'Le jeu est ta respiration à deux : la taquinerie détend, le pas de côté fait de l\'air. En couple, l\'excès ferait répondre une blague à une vraie question — et l\'autre finirait par ne plus demander. Ce qui aide : réponds à plat une fois, le jeu repart plus libre.',
      equilibre:
        'Chez toi, la plaisanterie et le sérieux se relaient selon la question. Ce qui aide : garde une réponse claire pour les vraies questions — la légèreté y gagne d\'être crue.',
      doux:
        'Le jeu reste chez toi en retrait : tu préfères parfois le sol à l\'air. Les partis pris sérieux ont leur grâce — la fiabilité se lit vite. Ce qui aide : ose un pas de côté sans enjeu — une part de jeu nourrit les histoires longues.',
    },
    // SENS : fort = la lenteur qui assure · doux = les commencements francs —
    // la durée et la flamme se valent, jamais une « maturité » attribuée.
    amitie: {
      fort:
        'Chez toi, l\'amour grandit sans se presser : la conversation d\'abord, la confiance ensuite. En couple, l\'excès ferait attendre le mot qui nomme — et l\'autre douterait de ce qui est déjà là. Ce qui aide : dis le mot qui attend — ce qui est là mérite d\'être entendu.',
      equilibre:
        'Chez toi, la lenteur et l\'évidence se partagent le terrain : certains liens s\'installent, d\'autres se déclarent. Ce qui aide : raconte ton tempo à l\'autre — la durée parle mieux quand elle s\'explique.',
      doux:
        'L\'amitié n\'est pas chez toi le vestibule de l\'amour : tu peux aimer vite et bien. Les commencements francs ont leur force — la flamme nomme tôt. Ce qui aide : garde la conversation longue même quand le reste va vite — elle nourrit la suite.',
    },
    // SENS : fort = le bâtisseur · doux = la rencontre sans liste — bâtir et
    // surprendre se valent (aucun profil dressé en idéal).
    pragmatisme: {
      fort:
        'Chez toi, l\'amour se bâtit : les projets de vie collent, les décisions se prennent à deux. En couple, l\'excès ferait passer la personne derrière la liste — examinée avant d\'être découverte. Ce qui aide : écoute une fois sans cocher — la surprise a aussi son adresse.',
      equilibre:
        'Chez toi, le concret et la spontanéité s\'équilibrent : tu bâtis, et tu laisses la place au coup de cœur. Ce qui aide : garde ta liste pour ce qui compte, et une page blanche pour le reste.',
      doux:
        'Les projets de vie ne pilotent pas ton amour : tu laisses la rencontre surprendre. Les histoires sans plan se bâtissent aussi — à leur rythme. Ce qui aide : dis tes choix de vie tôt, même sans liste — la clarté évite les malentendus.',
    },
    // SENS : fort = la vigilance qui veille · doux = la sérénité des
    // silences — la vigilance et le calme se valent (comportements
    // quotidiens, zéro étiquette clinique).
    intensite: {
      fort:
        'Tu veilles : les signes réguliers te mettent en paix, ton attention ne dort pas. En couple, l\'excès ferait de l\'autre le gardien de ton calme — et le gardien fatigue. Ce qui aide : garde un rituel d\'apaisement à toi — ta paix gagne à avoir plusieurs adresses.',
      equilibre:
        'Chez toi, le besoin de signes existe et se règle : l\'attente monte, puis se pose. Ce qui aide : nomme ton besoin à voix haute — un besoin dit se rencontre mieux qu\'un besoin deviné.',
      doux:
        'Les silences te reposent : le calme sans preuves ne te secoue pas. La sérénité est une vraie force — elle donne de l\'air. Ce qui aide : rappelle de temps en temps que ton calme n\'est pas une absence — il se dit.',
    },
    // SENS : fort = la main qui donne · doux = recevoir d'abord — donner et
    // recevoir se valent (le coût de l'excès se nomme des deux côtés).
    don: {
      fort:
        'Prendre soin est chez toi un réflexe de première seconde : tu devines les besoins avant les mots. En couple, l\'excès vide le compte en silence — et l\'autre peut se sentir redevable de ce qu\'il ne peut porter. Ce qui aide : demande une chose par semaine — recevoir est la moitié du chemin.',
      equilibre:
        'Chez toi, donner et recevoir se relaient : tu soignes, et tu laisses soigner. Ce qui aide : dis tes choses avant de les annuler — un don se raconte, il ne se subit pas.',
      doux:
        'Ton équilibre passe avant le soin des autres : tu reçois d\'abord. C\'est une adresse honnête — l\'aide qui dure se choisit. Ce qui aide : offre une attention discrète de temps en temps — le soin se muscle et rend léger.',
    },
  },

  conseils: [
    'Les six façons d\'aimer se valent : ta carte en raconte une, elle ne la note pas.',
    'Relis ta carte à tête reposée : une façon d\'aimer est une teinte du moment, elle bouge avec les saisons.',
    'L\'ombre décrit un excès en couple, pas une nature : nomme le coût des deux côtés, la nuance suit.',
    'Tes réponses ouvrent des conversations toutes prêtes : dis-les telles quelles, sans les traduire.',
  ],

  commentLire:
    'Six barres, et elles viennent de TES réponses : une par façon d\'aimer. La passion, le jeu, l\'amitié devenue amour, le pragmatisme, l\'intensité, le don de soi — six lectures, aucune note. Elles vont de 0 à 100 — ni une note, ni un verdict. Plus pleine ne veut pas dire mieux : les six façons se valent, une barre pleine dit une façon marquée, pas une supériorité. Ce qu\'elles regardent et ce qu\'elles disent de toi sont écrits dessous — relis-les comme un portrait, pas un tribunal.',

  ombreRelationnel: {
    'CARTE-5.1-FLAMME':
      'En relation, ta zone d\'ombre peut donner : des jours ordinaires lus comme des fins. Le partenaire peut se croire en dessous des sommets. Ce qui aide : célèbre un mardi à la fois — le feu y vit aussi.',
    'CARTE-5.1-PARTIE':
      'En relation, ta zone d\'ombre peut donner : une vraie question qui repart avec une blague. Quelqu\'un finit par ne plus demander. Ce qui aide : une réponse à plat de temps en temps — le jeu y gagne d\'être libre.',
    'CARTE-5.1-ROUTE-LONGUE':
      'En relation, ta zone d\'ombre peut donner : un attachement profond lu comme de l\'habitude, faute de mot. Ce qui aide : dis ce qui est déjà là — l\'autre attend ce mot plus qu\'un geste de plus.',
    'CARTE-5.1-BOUSSOLE':
      'En relation, ta zone d\'ombre peut donner : une personne sentie examinée plutôt que découverte. Ce qui aide : une écoute sans liste, de temps en temps — la surprise mérite une case vide.',
    'CARTE-5.1-VIGIE':
      'En relation, ta zone d\'ombre peut donner : un calme qui dépend d\'un horaire de réponse, et un gardien qui fatigue. Ce qui aide : plusieurs adresses pour ta paix — dont une qui t\'appartient.',
    'CARTE-5.1-PORT':
      'En relation, ta zone d\'ombre peut donner : un compte qui se vide en silence, et un autre qui n\'ose plus demander. Ce qui aide : une demande par semaine — recevoir détend le don.',
    'CARTE-5.1-PALETTE':
      'En relation, ta zone d\'ombre peut donner : des saisons que l\'autre ne prévoit pas, lues comme une inconstance. Ce qui aide : un mot de règle par saison — la souplesse se raconte en une phrase.',
  },

  // Pont de typage : voir note au-dessus — l'intégration M6 étendra IdQuete.
  suivante: '5.2' as unknown as IdSuivante51,

  suite: {
    titre: 'La suite de ton voyage',
    intro:
      'Ta façon d\'aimer est posée — les six façons se respectent, rien ne se juge. ' +
      'La prochaine quête reste dans ton cœur : ta vision de l\'amour, les attentes que tu portes sans les avoir choisies. ' +
      'Elle s\'ouvre avec tes réponses en poche.',
    questions: [
      'Qu\'est-ce qu\'aimer veut dire pour toi, au fond — et depuis quand ?',
      'Quelle image de l\'amour portes-tu sans l\'avoir choisie ?',
    ],
    cta: 'Explorer ta vision de l\'amour',
  },
};
