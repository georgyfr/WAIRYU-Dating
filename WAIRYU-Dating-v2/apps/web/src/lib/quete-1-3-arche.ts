/**
 * Archétypes de la quête 1.3 — Tes émotions (Task 35, gabarit fondateur).
 * Même algorithme que les quêtes 1.1 et 1.2 : chaque type est écrit à la
 * 2ᵉ personne, simple et littéral, dans les 6 champs du gabarit (intro +
 * point de vigilance, devise, ce que tu apportes, ce qui peut te freiner,
 * en couple, ton équilibre). Le gabarit de référence (V3 de la quête 1.1)
 * vient du fondateur lui-même.
 *
 * SENSIBILITÉ ÉMOTIONS : les styles émotionnels ne sont pas des diagnostics.
 * « Ce qui peut te freiner » décrit des situations où la tendance déborde —
 * jamais des défauts ni des troubles. « En couple » reste une dynamique
 * possible (« À garder en tête »), jamais une promesse sur ce que l'autre
 * ressentira.
 *
 * Ancrage : les cartes VERBATIM restent dans quete-1-3.ts, la couche « plus »
 * (langage matching, leviers) dans quete-1-3-plus.ts. Aucun segment ≥ 60
 * caractères n'est recopié d'un module à l'autre.
 *
 * Typo : apostrophe ASCII uniquement, écriture inclusive, pas de mélange
 * tu/vous.
 */
import type { ArchetypeCarte } from './quetes-plus';

export const ARCHES_1_3: Record<string, ArchetypeCarte> = {
  // V1 — La Clarté intérieure : des mots tôt sur ce qui se vit en dedans.
  V1: {
    intro:
      'Ton archétype révèle une personne qui met des mots tôt sur ce qui se vit en dedans. Tu es de celles et ceux qui savent ce qu\'ils ressentent, même quand plusieurs émotions se mêlent — tu perçois les changements d\'humeur avant qu\'ils s\'installent et tu trouves des mots là où d\'autres restent flous. Ton point de vigilance : ta maîtrise peut devenir un mur — tu sais tellement bien te débrouiller seul·e que l\'aide n\'a plus de place pour entrer.',
    devise: 'Je nomme ce que je ressens, et ça change déjà la situation.',
    apportes:
      'Un calme qui rassure : les tensions se nomment tôt, le drame recule. Tu deviens souvent le point où les choses redeviennent claires, dans un couple comme entre amis.',
    freines:
      'Les émotions analysées plus que vécues, les vagues réglées en silence sans témoin, les moments où nommer remplace ressentir. Ce ne sont pas des défauts — juste tes forces vues du côté où elles débordent, quand la méthode remplace le partage.',
    couple:
      'Tu apportes des mots posés, pas lancés, et des solutions cherchées ensemble plutôt que des reproches. À garder en tête : tu peux tellement bien te débrouiller seul·e que l\'autre cesse de proposer son aide — alors qu\'un coup de main pendant la vague raccourcit souvent le voyage.',
    equilibre:
      'Laisser quelqu\'un passer à ton côté pendant la vague. Non parce que ta clarté manquerait de fond, mais parce que demander de l\'aide peut se faire petit — un mot, un signe, une porte entrouverte.',
  },

  // V2 — Le Volcan tendre : ressent tout fort, vite, sans détour.
  V2: {
    intro:
      'Ton archétype révèle une personne qui vit ses émotions comme des saisons rapides : tout arrive fort, tôt, et rien ne reste tiède. Tu es de celles et ceux dont la contrariété monte vite et retombe presque aussi vite, dont la bonne nouvelle fait lever les tables. Ton point de vigilance : la montée peut prendre tout le monde de vitesse — et parler plus fort que la raison qui l\'a déclenchée.',
    devise: 'Je ressens fort, je retombe vite, et ça reste toujours vrai.',
    apportes:
      'Une énergie qui entraîne et du vrai qui ne se joue pas : une joie qui se voit et se partage, des excuses rapides après un éclat, des émotions assumées à voix haute.',
    freines:
      'Les coups de chaud, les mots de trop en pleine montée, les regrets qui suivent l\'éclat. Ce ne sont pas des défauts — juste une intensité qui déborde parfois de son lit, et qui apprend, vague après vague, à prévenir.',
    couple:
      'Tu apportes une chaleur sincère, sans calcul, et des émotions partagées en direct, pas en différé. À garder en tête : l\'autre peut répondre au ton pendant que le fond, lui, attend encore son tour — de la marge le temps que la vague retombe change tout.',
    equilibre:
      'Savoir ce que tu veux protéger quand la vague monte. Non parce qu\'il faudrait ressentir moins, mais parce que repérer ton premier signal assez tôt te laisse choisir le mot, la pause ou la sortie — avant que la vague ne décide seule.',
  },

  // V3 — Le Réservoir : les vagues traversées en profondeur, sans bruit.
  V3: {
    intro:
      'Ton archétype révèle une personne qui vit ses émotions loin de la surface : elles travaillent en profondeur, sous une allure calme. Tu es de celles et ceux qui ne les dissèquent pas et ne les déclarent pas — elles traversent. Tu apportes une stabilité précieuse : pas de tempête, une présence qui dure. Ton point de vigilance : ton silence reste un choix tant qu\'il n\'est pas la seule langue parlée — ce qui ne se dit pas peut finir par créer une distance.',
    devise: 'Je vis mes émotions en profondeur, sans les afficher.',
    apportes:
      'Du calme sous pression : des mots rares mais pesés, qui comptent double, une loyauté tranquille aux personnes aimées — les grandes marées ne deviennent pas des spectacles.',
    freines:
      'Les émotions traversées en silence sans témoin, les attentes non dites qui s\'accumulent, les signes si discrets que personne ne les lit. Ce ne sont pas des défauts — juste une profondeur qui n\'a pas encore trouvé de langue commune avec la surface.',
    couple:
      'Tu apportes une stabilité à deux, loin des montagnes russes, et de la patience pour les confidences qui arrivent en retard. À garder en tête : tu peux attendre d\'être lu pendant que l\'autre attend d\'être informé — deux attentes légitimes qui se croisent rarement sans un mot posé à voix haute.',
    equilibre:
      'Dire assez tôt ce qui se passe, avant que ça passe. Non parce que chaque vague devrait être déclarée, mais parce que certaines gagnent simplement à être nommées une fois — même après coup.',
  },

  // V4 — Le Radiateur : réchauffe, console, célèbre.
  V4: {
    intro:
      'Ton archétype révèle une personne qui est un endroit où les autres vont mieux. Tu es de celles et ceux qui félicitent, consolent, célèbrent les bonnes nouvelles des autres comme si c\'étaient les leurs — une chaleur qui remet d\'aplomb et une écoute qu\'on n\'oublie pas. Ton point de vigilance : tu peux devenir le pilier qui ne se pose jamais — tes propres vagues attendent, en douce, à la file.',
    devise: 'Je prends soin des cœurs autour de moi, naturellement.',
    apportes:
      'Une adresse où l\'on se tourne naturellement quand ça ne va pas : une écoute rare et sans jugement, les joies des autres fêtées comme les siennes, le repérage précoce de ceux qui vont mal.',
    freines:
      'Les « ça va » prononcés trop vite, tes propres émotions laissées à la file d\'attente, l\'épuisement silencieux de l\'endroit où tout le monde dépose. Ce ne sont pas des défauts — juste une générosité qui a besoin, elle aussi, d\'un endroit où se poser.',
    couple:
      'Tu poses « et toi ? » et tu attends la vraie réponse — l\'autre se confie sans reprendre aussitôt le rôle du pilier. À garder en tête : tu peux devenir l\'endroit où l\'autre dépose tout — l\'équilibre peut se déplacer sans que personne l\'ait décidé, tant ta générosité semble le permettre.',
    equilibre:
      'Répondre vrai quand on te demande comment tu vas. Non parce que tenir serait un problème, mais parce que ton tour de vague mérite d\'arriver — avec une personne choisie, quand le moment s\'y prête.',
  },

  // V5 — La Réserve : ressent beaucoup, montre avec mesure.
  V5: {
    intro:
      'Ton archétype révèle une personne qui vit une vie émotionnelle riche, tenue, intime : dehors le calme, en dedans tout est vivant. Tu es de celles et ceux dont ce n\'est pas de la froideur mais de la pudeur — les ouvertures sont choisies, rares, précises. Ton point de vigilance : ta réserve peut être prise pour de l\'indifférence, alors qu\'en dedans tout vit — un mot qui annonce ton style évite bien des malentendus.',
    devise: 'Je ressens beaucoup, je montre peu — tout est vivant en dedans.',
    apportes:
      'Une fidélité profonde aux liens et des confiances qui marquent : quand tu ouvres une porte, c\'est choisi — et les personnes qui reçoivent le sentent.',
    freines:
      'Les émotions invisibles de l\'extérieur, la pudeur lue comme une distance, les ouvertures reportées trop longtemps. Ce ne sont pas des défauts — juste une pudeur qui se règle par un signe, pas par un discours.',
    couple:
      'Tu construis par degrés, pas d\'un coup : des liens qui respectent les rythmes d\'ouverture, de la constance plutôt que des grandes déclarations. À garder en tête : l\'écrit d\'abord, la voix ensuite — ce que tu ouvres en premier vaut de l\'or, dis simplement que c\'est ton style.',
    equilibre:
      'Laisser voir un bout de ce qui vit en dedans, un peu plus tôt que d\'habitude. Non parce que ta réserve serait à corriger, mais parce qu\'une seule ouverture suffit souvent pour que l\'autre comprenne le reste.',
  },

  // V6 — L'Apprenti·e : apprend à lire ce qui se passe en dedans.
  V6: {
    intro:
      'Ton archétype révèle une personne qui apprend à lire ce qui bouge en elle : tantôt clair, tantôt embrouillé — c\'est le rythme normal de l\'apprentissage. Tu es de celles et ceux qui répondent « je ne sais pas encore » et cherchent des indices : une boule au ventre, une irritabilité. Ta recherche est sincère, sans prétention. Ton point de vigilance : le découragement des jours où la progression paraît lente — ne pas savoir nommer n\'a jamais voulu dire ne pas ressentir.',
    devise: 'Je ne sais pas toujours — et j\'apprends, étape après étape.',
    apportes:
      'Du vrai, même quand c\'est flou : une recherche sincère sur soi, des progrès réels à chaque étape, une humilité qui donne le droit d\'apprendre.',
    freines:
      'Les conversations émotionnelles esquivées par prudence, les états reconnus bien après coup, les brouillards des jours sans boussole. Ce ne sont pas des limites de caractère — le brouillard fait partie du chemin.',
    couple:
      'Tu apportes une sincérité valorisée même quand la réponse n\'est pas prête : des questions simples, pas des interrogatoires. À garder en tête : un « je ne sais pas encore » honnête peut être entendu comme un refus — dis-le comme une recherche en cours, et l\'autre suivra le chantier avec toi.',
    equilibre:
      'T\'accorder le droit d\'être encore en apprentissage. Non parce qu\'il faudrait arriver vite, mais parce que chaque émotion nommée une fois se reconnaît mieux la suivante — le chemin paie en route.',
  },
};
