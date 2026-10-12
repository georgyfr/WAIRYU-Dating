/**
 * Archétypes de la quête 1.3 — Tes émotions (Task 65 — RÉÉCRITURE qualité
 * du résultat, demande fondateur : « les faits étaient faux, effet barnum
 * élevé, très faible zone d'ombre »).
 *
 * LA RÈGLE QUI GOUVRE CHAQUE PHRASE : un texte n'affirme QUE ce que son
 * sélecteur (quete-1-3.ts, VERBATIM, intouché) garantit —
 *   V1 : P≥0.65 et R≥0.65 → capte tôt ET redescend ; X libre.
 *   V2 : P≥0.60 et R<0.40 → capte tôt, redescente lente ; X libre.
 *   V3 : P<0.40 et X<0.40 → annonce après coup, peu se voit ; R libre.
 *   V4 : X≥0.65 seul → ça se voit et se dit ; P et R LIBRES (aucune
 *        supposition permise dessus).
 *   V5 : P≥0.55 et X<0.45 → capte correctement, montre peu ; R libre.
 *   V6 : fallback → aucune combinaison marquée ; « profil en cours ».
 * Toute anecdote non mesurée (lever les tables, excuses rapides, joie qui se
 * partage…) est supprimée. L'ombre est ASSUMÉE (coût concret, jamais
 * neutralisée par « ce ne sont pas des défauts ») et suivie d'un levier.
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
  // V1 — La Clarté intérieure (P haut + R haut) : capte tôt ET sait redescendre.
  V1: {
    intro:
      'Ton archétype révèle une double force que tes réponses affichent toutes les deux du même côté : ce qui se passe en toi s\'annonce tôt et clairement, et tu connais ton chemin de retour au calme. Savoir ce que tu ressens ET savoir le traverser — cette combinaison est rare, et elle se voit. Ton point de vigilance : l\'aisance. Tu gères tellement bien seul·e que l\'aide n\'a plus de place pour entrer — et certaines vagues se traversent mieux à deux qu\'avec de la méthode.',
    devise: 'Je sais ce que je ressens, et je sais en revenir.',
    apportes:
      'Un calme qui rassure : les tensions se nomment tôt, le drame recule. Dans un couple comme entre amis, tu deviens le point où les choses redeviennent claires.',
    freines:
      'Ta zone d\'ombre a une adresse précise : l\'autonomie. Tu règles les vagues en silence, sans témoin — certaines auraient besoin d\'en avoir un. Et nommer peut remplacer ressentir : tout ce que tu sais décrire n\'a pas toujours été traversé.',
    couple:
      'Tu apportes des mots posés, pas lancés, et des retours au calme qui ne dépendent de personne. À garder en tête : tu peux tellement bien te débrouiller seul·e que l\'autre cesse de proposer son aide — alors qu\'un coup de main pendant la vague raccourcit souvent le voyage.',
    equilibre:
      'Laisser quelqu\'un passer à ton côté pendant la vague. Non parce que ta clarté manquerait de fond, mais parce que demander de l\'aide peut se faire petit — un mot, un signe, une porte entrouverte.',
  },

  // V2 — Le Volcan tendre (P haut + R bas) : capte tôt, redescente lente.
  V2: {
    intro:
      'Ton archétype révèle un écart que tes réponses marquent net : tu captes tôt ce qui monte en toi — et le retour au calme, lui, est ton maillon lent. Tu vois la vague arriver ; tu ne la traverses pas encore aussi vite que tu la vois venir. C\'est cette combinaison — vue claire, redescente lente — qui fait ton intensité. Ton point de vigilance : entre la montée et la redescente, chaque émotion forte se vit en entier.',
    devise: 'Je vois la vague venir — c\'est la descente qui me prend.',
    apportes:
      'Tu sais ce que tu ressens, vite et précisément — c\'est une rareté. Beaucoup découvrent leurs états après coup ; toi, tu peux les nommer sur le moment. Ça fait des conversations vraies, tôt.',
    freines:
      'Le coût est mesuré, pas supposé : ton ressenti arrive vite, le calme arrive tard. Entre les deux, les mots de trop se glissent — pas parce que tu exagères, mais parce que le frein arrive après l\'accélérateur. Les regrets après les coups de chaud, tu les connais.',
    couple:
      'Tu vois tout tout de suite — l\'autre, pas toujours. Ton impatience n\'est pas de la domination : c\'est ton horloge interne. À garder en tête : ce qui monte chez toi en une minute peut prendre dix chez l\'autre — la marge, c\'est toi qui la donnes.',
    equilibre:
      'Prévenir plutôt que retenir. Ton premier signal physique — gorge, poings, ventre — arrive avant la vague. Le repérer, c\'est se reprendre trente secondes : souvent assez pour choisir le mot au lieu de le subir.',
  },

  // V3 — Le Réservoir (P bas + X bas) : s'annonce après coup, peu se voit.
  V3: {
    intro:
      'Ton archétype révèle une double discrétion : ce qui se passe en toi s\'annonce après coup, et peu sort dehors. Rien ici ne dit que tu ressens peu — ce que tes réponses dessinent, c\'est une vie intérieure qui ne passe ni par l\'affichage ni par l\'annonce immédiate. Ton point de vigilance : ce que tu ne nommes pas, l\'autre ne peut ni le deviner ni le compter.',
    devise: 'Ça vit fort en dedans — ça se déclare en retard, et peu.',
    apportes:
      'Une présence qui n\'encombre pas : pas de mise en scène, pas de tempête affichée. Ceux qui te connaissent bien savent lire tes petits signes — chez toi, ils valent des déclarations.',
    freines:
      'Le coût est le silence. Les attentes non dites s\'accumulent ; l\'autre peut croire à l\'indifférence là où tout est vivant — et l\'attente devient de la distance. Ce n\'est pas un défaut : c\'est ce que ta discrétion produit quand personne ne lui donne de langue.',
    couple:
      'Tu construis par degrés, loin des montagnes russes. À garder en tête : tu peux attendre d\'être lu pendant que l\'autre attend d\'être informé — deux attentes légitimes qui ne se croisent jamais seules. Un mot posé à voix haute les débloque.',
    equilibre:
      'Nommer après coup, une fois : « hier, j\'étais en colère — je n\'ai pas su le dire sur le moment ». La clarté en retard vaut mieux que le silence complet — et elle entraîne la suivante.',
  },

  // V4 — Le Radiateur (X haut seul) : ça se voit et se dit. P et R non garanties.
  V4: {
    intro:
      'Ton archétype révèle une chose simple et mesurée : chez toi, ça se voit et ça se dit. Tes réponses décrivent quelqu\'un qui exprime — féliciter, consoler, dire ce que les autres comptent. Ton point de vigilance est mécanique : quand la sortie est toujours occupée par les autres, le tour de ce qui est à toi arrive rarement.',
    devise: 'Ce que je vis se dit — et ça fait du bien autour.',
    apportes:
      'Une adresse où l\'on se tourne naturellement : une écoute qui se voit, des joies des autres fêtées comme les siennes, des émotions qui circulent parce que toi, tu les fais circuler.',
    freines:
      'Tes propres émotions à la file d\'attente. Rien ici ne dit que tu ne les ressens pas — ce que tes réponses marquent, c\'est que la sortie, elle, est prise. Un pilier qui ne se pose jamais s\'use en silence : c\'est ça, ton ombre.',
    couple:
      'Tu poses « et toi ? » et tu attends la vraie réponse. À garder en tête : l\'équilibre peut se déplacer sans que personne l\'ait décidé — tant ta générosité semble le permettre. Dire tes états une fois par semaine, c\'est l\'entretenir.',
    equilibre:
      'Répondre vrai quand on te demande comment tu vas — avec une personne choisie, une fois par semaine. Ton tour de vague mérite d\'arriver : c\'est ce qui rend le radiateur durable.',
  },

  // V5 — La Réserve (P correct + X bas) : capte correctement, montre peu.
  V5: {
    intro:
      'Ton archétype révèle un décalage précis : tu captes ce qui se vit en toi, et tu ne le montres pas. Ressenti clair, affichage discret — ce n\'est pas de la froideur : c\'est un accès réservé. Ton point de vigilance : ce que tu vis clairement, l\'autre ne le voit pas — et il ne devinera pas seul.',
    devise: 'Je sais ce que je ressens — je choisis qui le sait.',
    apportes:
      'Des ouvertures qui comptent : quand tu ouvres, c\'est choisi — et les personnes qui reçoivent le sentent. La confiance que tu accordes a une valeur qu\'aucune abondance n\'a.',
    freines:
      'Le malentendu est structurel : ton intérieur est clair pour toi, invisible pour l\'autre. La réserve peut être lue comme de la distance — et certaines portes attendent trop longtemps avant de s\'ouvrir.',
    couple:
      'Tu construis par degrés : des liens qui respectent ton rythme d\'ouverture, de la constance plutôt que des déclarations. À garder en tête : l\'écrit d\'abord, la voix ensuite — et dis que c\'est ton style : ce que tu ouvres, choisi, vaut de l\'or.',
    equilibre:
      'Laisser voir un bout de ce qui vit en dedans, un peu plus tôt que d\'habitude. Une seule ouverture suffit souvent pour que l\'autre comprenne le reste.',
  },

  // V6 — L'Apprenti·e (fallback) : aucune combinaison marquée — profil en cours.
  V6: {
    intro:
      'Ton archétype révèle un profil sans corde dominante : tes trois forces — percevoir, apaiser, exprimer — restent proches l\'une de l\'autre dans tes réponses. Ni très présente, ni très discrète : ta façon émotionnelle est en train de se préciser. Ton point de vigilance : le jour où ça monte fort, tu n\'as pas encore de réflexe signature — et on peut confondre l\'absence de boussole avec l\'absence de sentiment.',
    devise: 'Pas encore de muscle signature — je le construis, réponse après réponse.',
    apportes:
      'Du vrai, même quand c\'est flou : tes réponses disent un profil en mouvement, sans case toute faite — et c\'est le plus honnête des points de départ.',
    freines:
      'Sans corde dominante, pas de réflexe évident : les jours sans boussole arrivent, et l\'envie de conclure « je ne ressens rien » avec. La deuxième phrase est presque toujours fausse — le brouillard fait partie du chemin.',
    couple:
      'Tu apportes une sincérité valorisée même quand la réponse n\'est pas prête : des questions simples, pas des interrogatoires. À garder en tête : un « je ne sais pas encore » honnête peut être entendu comme un refus — dis-le comme une recherche en cours.',
    equilibre:
      'T\'accorder le droit d\'être en apprentissage : chaque émotion nommée une fois se reconnaît mieux la suivante. Le chemin paie en route.',
  },
};
