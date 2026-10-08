/**
 * Couche accompagnement de la quête 1.6 « Ta façon de penser »
 * (Monde 2 « Le Volant » — Task 37-c).
 *
 * Rédigée par les agents quête (jamais verbatim du Livrable), ton Task 35 :
 * tutoiement, simple et littéral, phrases courtes (≤ 22 mots), jamais un
 * diagnostic. Alimente l'entrée « 1.6 » du registre (quetes.ts).
 *
 * SENS DE LA BARRE (à ne pas inverser) : la dimension `traitement` vient des
 * 7 items déclaratifs — barre PLEINE = la vérification conduit (pôle
 * déclaratif analytique), barre LÉGÈRE = le flair conduit. Doctrine du
 * Livrable : neutralité des deux pôles — le flair n'est pas superficiel,
 * l'analytique n'est pas lent, aucun palier n'est flatté ni blâmé. Les trois
 * petites énigmes ne notent personne : le rendu décrit la MANIÈRE (vérifier,
 * hésiter, répondre du premier mouvement), jamais un décompte ni une note
 * scolaire. Codes, seuils et variable moteur restent côté moteur : jamais
 * rendus à l'écran.
 *
 * Typo : apostrophe ASCII uniquement, phrases ≤ 22 mots.
 */
import type { EntreeRegistre } from './quetes';

export const DEF_16: EntreeRegistre = {
  sousTitre: 'La boussole du volant : ta tête, comment elle prend les décisions.',

  dims: [
    {
      key: 'traitement',
      nom: 'Ta façon de traiter',
      sousLigne: 'le flair ou la vérification',
      genre: 'f',
      lecture:
        'Cette barre dit comment l\'information entre chez toi et comment la décision sort : au flair, au ressenti, ou après vérification. Pleine : tu démontes et tu vérifies avant de trancher. Légère : ta première impression conduit, et elle avance vite — les deux styles pensent, à des vitesses différentes.',
    },
  ],

  accompagnement: {
    // SENS : fort = la vérification conduit (items déclaratifs) — aucun palier flatté ni blâmé.
    traitement: {
      fort:
        'Tu démontes les problèmes pièce par pièce : pour et contre, étapes, vérifications. Tes opinions tiennent debout, et les grandes décisions à deux gagnent un sol rare. Ta vigilance : le ressenti ne demande pas de preuve — certaines choses se savent avant de se démontrer.',
      equilibre:
        'Ton flair donne la direction, ta vérification donne le sol : tu ressens vite et tu confirmes quand ça compte. Pense juste à poser TA position avant de traduire celles des autres — ton avis a autant de valeur que tes ponts.',
      doux:
        'Ta première impression conduit, et souvent elle a raison : tu décides avec le ventre, tu vas vite, le vivant t\'appelle. Ta piste : les pièges habiles ressemblent à ce que tu attends — une seconde lecture, de temps en temps, évite de laisser ton flair seul face aux déguisements.',
    },
  },

  conseils: [
    'Relis ta carte à tête reposée : d\'autres phrases ressortiront.',
    'Devant la prochaine décision qui compte, repère quelle main travaille : celle qui sent, ou celle qui mesure.',
    'Si le flair conduit chez toi, teste-le sur un petit choix par jour : impression notée, verdict après coup.',
    'Aucune barre ne te définit : elle décrit ta réponse d\'aujourd\'hui, pas une case pour toujours.',
  ],

  commentLire:
    'La barre vient de tes sept réponses, à l\'instant : pleine, elles penchent vers la vérification ; légère, vers le flair. Aucun pôle ne vaut mieux que l\'autre — le flair va vite, la vérification va loin, et les deux pensent. Les trois petites énigmes n\'entrent pas dans cette barre : elles éclairent la manière, sans note.',

  ombreRelationnel: {
    V1:
      'À deux, face à un partenaire qui pense ressenti, vos vitesses diffèrent : il demande de la place, toi des raisons, et l\'échange part à deux allures. Ce qui aide : demander « qu\'est-ce que tu vois ? » avant « pourquoi ? ». Le ressenti de l\'autre n\'attend pas de preuve pour être vrai — l\'entendre tel quel rapproche les tempos.',
    V2:
      'À deux, une impression dite tôt et sûre arrive comme un verdict sans dossier — et l\'autre se ferme au lieu de corriger. Ce qui aide : dire ton ressenti en une phrase, sans preuve, comme une hypothèse ouverte : « voilà ce que je capte, corrige-moi si je me trompe ».',
    V3:
      'À deux, ton partenaire peut prendre tes réussites pour de la chance — sans voir la vérification discrète qui travaille derrière. Ce qui aide : montrer le travail, une fois de temps en temps. Une méthode assumée se partage — et l\'autre apprend à te faire confiance pour de vrai.',
    V4:
      'À deux, une évidence proposée par l\'autre peut se faire retourner dans tous les sens — la conversation s\'épuise, l\'autre se sent examiné. Ce qui aide : accueillir l\'évidence d\'abord, vérifier ensuite si besoin. Un « tu as raison, on y reviendra » coûte moins qu\'un démontage — et garde la porte ouverte.',
    V5:
      'À deux, traduire le ressenti en structure et la structure en ressenti fatigue — tu deviens le passage obligé de toutes les décisions. Ce qui aide : avant de traduire, dis TA position. L\'autre vient chercher ton avis, pas seulement ton pont.',
  },

  suivante: '1.7',

  suite: {
    titre: 'Ta boussole est posée — reste la porte.',
    intro:
      'Tu sais désormais comment ta tête décide : le flair, la vérification, ou les deux mains. Prochaine étape : ton fonctionnement — ce que tu partages, à qui tu ouvres ta porte.',
    questions: [
      'Que partages-tu d\'abord, et avec qui ?',
      'Comment décides-tu d\'ouvrir ta porte ?',
    ],
    cta: 'Régler mon fonctionnement',
  },
};
