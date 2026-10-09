/**
 * Couche accompagnement de la quête 2.6 « Tes priorités pour les 5 prochaines
 * années » (Monde 3 « La Boussole »).
 *
 * EntreeRegistre rédigée (couche app, ton Task 35 : tutoiement, simple et
 * littéral, phrases courtes, jamais un diagnostic, jamais culpabilisant).
 * Alimente l'entrée « 2.6 » du registre (assemblée par l'orchestrateur).
 *
 * SENS DES BARRES (à ne pas inverser) : chaque barre = la part de tes cent
 * points donnée à l'horizon (barre PLEINE = beaucoup de points, barre LÉGÈRE =
 * peu de points). Doctrine du Livrable (00-README) : neutralité normative
 * ABSOLUE — aucun horizon n'est « mûr » ou « égoïste », cent points sur la
 * famille valent cent points sur la carrière ; la contrainte fabrique
 * l'information, elle ne note pas les choix. AUCUN palier flatté ni blâmé.
 * Le couple n'est plus un axe nommé (mission V8.B) : il traverse les 5 et vit
 * dans l'ombre — l'axe sacrifié est souvent porté par le couple (où il
 * devient un sujet à aborder tôt, jamais une faute).
 *
 * NOTE DE TYPAGE : IdQuete (quetes.ts) ne connaît pas encore les codes du
 * Monde 3 (2.1 → 2.8) — le registre M3 est assemblé par l'orchestrateur.
 * `suivante` est contraint au littéral '2.7' : DEF_26 reste STRUCTURELLEMENT
 * assignable à EntreeRegistre dès que IdQuete inclut '2.7' (aucun cast).
 *
 * Typo : apostrophes ASCII uniquement, phrases ≤ 22 mots, aucun code/score
 * ni métadonnée moteur dans un texte rendu.
 */
import type { AccompagnementDim, EntreeRegistre } from './quetes';

/** Clés du scorer (quete-2-6.ts) — sans accent, accent au rendu uniquement. */
type CleAxe26 = 'carriere' | 'famille' | 'liberte' | 'stabilite' | 'projets';

/** Les 4 variantes de carte (quete-2-6.ts — cartes.yaml). */
type Id26 = 'CARTE-2.6-GRUE' | 'CARTE-2.6-NID' | 'CARTE-2.6-MAISON' | 'CARTE-2.6-COMPAS';

/** EntreeRegistre avec le code M3 de la quête suivante (voir note de typage). */
export type DefEntree26 = Omit<EntreeRegistre, 'suivante'> & { suivante: '2.7' };

export const DEF_26: DefEntree26 = {
  sousTitre: "La quête de la boussole : l'arbitrage de ta décennie.",

  dims: [
    {
      key: 'carriere',
      nom: 'Carrière / ambition',
      sousLigne: 'le travail qui avance',
      genre: 'm',
      lecture:
        "Cette barre dit la part que tu donnes au travail : les formations, les responsabilités, les années où il avance fort. Pleine : ta décennie est d'abord un chantier pro. Légère : l'ambition attend son tour — un arbitrage, jamais une faute.",
    },
    {
      key: 'famille',
      nom: 'Famille / projet parental',
      sousLigne: 'la place faite au lien',
      genre: 'f',
      lecture:
        'Cette barre dit la part que tu donnes à la famille — pour un enfant, ou pour ceux qui sont là. Pleine : le foyer mène la décennie, assumé. Légère : la place se fera plus tard — la décennie se relit.',
    },
    {
      key: 'liberte',
      nom: 'Liberté / aventures',
      sousLigne: 'partir, bouger, découvrir',
      genre: 'f',
      lecture:
        'Cette barre dit la part que tu donnes à la liberté : partir, bouger, découvrir sans tout planifier. Pleine : cinq années au sac léger. Légère : les routes attendent leur saison — le socle passe d\'abord.',
    },
    {
      key: 'stabilite',
      nom: 'Stabilité / sécurité',
      sousLigne: 'le socle qui tient',
      genre: 'f',
      lecture:
        "Cette barre dit la part que tu donnes au socle : l'épargne, le logement, la santé, les rythmes durables. Pleine : tu sécurises avant d'étendre. Légère : tu étends d'abord — un ordre, pas une erreur.",
    },
    {
      key: 'projets',
      nom: 'Projets personnels',
      sousLigne: 'ce qui est à toi',
      genre: 'm',
      lecture:
        "Cette barre dit la part que tu gardes pour tes projets à toi : créer, courir, t'engager. Pleine : ta fenêtre personnelle reste ouverte. Légère : tes projets attendent une année plus creuse — jamais une fermeture.",
    },
  ],

  accompagnement: {
    // SENS : fort = beaucoup de points sur l'axe · doux = peu de points — la
    // contrainte fabrique l'information, elle ne note pas les choix : AUCUN
    // palier flatté ni blâmé (neutralité normative du Livrable).
    carriere: {
      fort:
        "Tu as mis beaucoup de points sur le travail : ta décennie a un chantier, et il avance. La vigilance qui aide : garde un rendez-vous qui ne se déplace pas — la maison chauffe aussi.",
      equilibre:
        "Le travail reçoit sa part, sans tout emporter : un chantier qui avance à rythme humain. Garde l'œil sur les reports — un horizon repoussé deux fois s'efface doucement.",
      doux:
        "Peu de points sur le travail : ton énergie va ailleurs, c'est un choix d'arbitrage. La contrainte fabrique l'information — elle ne note pas les choix.",
    },
    famille: {
      fort:
        "Beaucoup de points sur la famille : tu fais de la place — pour un enfant, ou pour ceux qui sont là. La vigilance qui aide : garde une part à toi — le foyer y gagne deux personnes.",
      equilibre:
        "La famille reçoit sa part, sans absorber le reste : du lien, du quotidien, de l'espace. Un réglage qui tient — nomme-le à voix haute pour qu'il reste un choix.",
      doux:
        "Peu de points sur la famille : la place se fera plus tard, ou autrement. Ce n'est ni un retard ni un renoncement — la décennie se relit, et la vie redistribue.",
    },
    liberte: {
      fort:
        "Beaucoup de points sur la liberté : partir, bouger, découvrir sans tout planifier. La vigilance qui aide : laisse l'autre poser une étape du voyage — la route y gagne un témoin.",
      equilibre:
        "La liberté reçoit sa part, sans tout emporter : des ouvertures, des détours, des fenêtres. Garde une fenêtre vraiment ouverte — une date, un sac, un départ.",
      doux:
        "Peu de points sur la liberté : ton énergie est au socle ou au chantier. Les routes attendent leur saison — ce n'est pas une fermeture, c'est un arbitrage.",
    },
    stabilite: {
      fort:
        "Beaucoup de points sur le socle : épargne, logement, santé, rythmes durables. La vigilance qui aide : un socle solide porte des envies — donne-lui une à faire bouger.",
      equilibre:
        "Le socle reçoit sa part, sans tout verrouiller : tu sécurises l'essentiel et tu laisses du jeu. Vérifie juste qu'il reste une place pour l'imprévu choisi.",
      doux:
        "Peu de points sur le socle : tu étends d'abord, tu sécuriseras ensuite. C'est un ordre, pas une erreur — pose un seul appui durable cette année.",
    },
    projets: {
      fort:
        "Beaucoup de points pour tes projets à toi : créer, courir, t'engager. La vigilance qui aide : une fenêtre datée vaut mieux qu'une intention — choisis-la, puis protège-la.",
      equilibre:
        "Tes projets reçoivent leur part, sans monopoliser : une fenêtre ouverte au milieu des autres horizons. C'est un bon rythme de décennie — garde la fenêtre.",
      doux:
        "Peu de points pour tes projets à toi : ils attendent une année plus creuse. Ce n'est pas une fermeture — la plus petite fenêtre ouverte garde le feu.",
    },
  } as Record<CleAxe26, AccompagnementDim>,

  conseils: [
    'Ta répartition est une déclaration, pas un contrat : la vie la redistribuera, et la quête se relit.',
    "Regarde l'axe que tu as le moins doté : il est informatif, jamais coupable — donne-lui juste un rendez-vous.",
    "Aucun horizon n'est mûr ou égoïste : cent points sur la famille valent cent points sur la carrière.",
    'Garde une trace de ta répartition du jour : dans cinq ans, tu verras ce que la vie en a fait.',
  ],

  commentLire:
    "Tes cinq barres viennent de tes cent points : la part que tu donnes à un horizon, tu la retires aux autres. Aucune barre n'est une note : elle dit un arbitrage, pas une qualité. Ce qu'elles regardent et ce qu'elles disent de toi sont écrits dessous — relis-les comme un portrait, pas un bulletin.",

  ombreRelationnel: {
    // Le couple n'est plus un axe nommé : il traverse les 5 — l'axe sacrifié
    // se voit à deux quand c'est lui qui le porte (mission V8.B).
    'CARTE-2.6-GRUE':
      "En relation, ta zone d'ombre peut donner : un calendrier qui se règle sur les chantiers, et l'autre qui cherche sa place entre deux lancements. Ce qui aide : garder un rendez-vous qui ne se déplace pas pour le travail.",
    'CARTE-2.6-NID':
      "En relation, ta zone d'ombre peut donner : un foyer qui absorbe la vie, jusqu'à la part de couple qui ne relève pas de la gestion. Ce qui aide : garder un projet à toi — le foyer y gagne deux personnes.",
    'CARTE-2.6-MAISON':
      "En relation, ta zone d'ombre peut donner : une maison bien chauffée où rien ne décolle — ni explosion, ni horizon. Ce qui aide : choisir un cap qui déborde de l'année, à deux.",
    'CARTE-2.6-COMPAS':
      "En relation, ta zone d'ombre peut donner : des routes qui appellent, et quelqu'un qui attend au campement. Ce qui aide : laisser l'autre poser une étape du voyage — la liberté y gagne un témoin.",
  } as Record<Id26, string>,

  suivante: '2.7',

  suite: {
    titre: 'Ta décennie est déclarée.',
    intro:
      "Tu sais maintenant où va ton énergie pour les cinq prochaines années. La prochaine quête regarde un horizon précis : la famille — ce que tu en veux, à ta façon. C'est un sujet dont les couples parlent mieux tôt que tard.",
    questions: [
      'Quelle place voudrais-tu faire à la famille — pour un enfant, ou pour ceux qui sont déjà là ?',
      "Quel arbitrage de ta décennie mériterait d'être dit à voix haute, tôt ?",
    ],
    cta: 'Voir ma vision de la famille',
  },
};
