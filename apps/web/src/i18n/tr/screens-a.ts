/**
 * Dictionnaire EN du chrome — périmètre A : écrans Voyage, Mondes,
 * WorldModal, Welcome, Parcourus, Recolte, Portrait.
 * Clés = chaînes FR exactes du code · valeurs = EN · repli FR si absent.
 *
 * Notes :
 *  - '\u00a0' = espace insécable présente dans la chaîne FR du code ;
 *  - la clé « l’instant » (Recolte) porte l’apostrophe typographique U+2019
 *    verbatim du bundle, la clé « l'instant » (Parcourus) l’ASCII U+0027 ;
 *  - clés déjà couvertes par CORE et réutilisées ici sans redéclaration :
 *    Commencer · Revoir mon écran · Voir mes résultats en détail ·
 *    Quête {{n}} sur {{total}}.
 */
export const SCREENS_A: Record<string, string> = {
  // ---- écran Voyage — héro + manifeste
  'Ton voyage commence ici': 'Your journey starts here',
  'Le Voyage': 'The Journey',
  '{{n}} mondes': '{{n}} worlds',
  '{{n}} étapes': '{{n}} steps',
  '1 destination\u00a0: une rencontre qui a du sens':
    '1 destination: an encounter that means something',
  "Un voyageur au sac à dos s'engage sur un chemin lumineux qui serpente à travers une vallée jusqu'à des montagnes turquoise, jalonné d'étapes brillantes ; à l'horizon rayonnant, deux silhouettes se rencontrent":
    'A backpacker sets off on a luminous path that winds through a valley toward turquoise mountains, dotted with bright milestones; on the glowing horizon, two silhouettes meet',
  'Voir la carte du voyage': 'See the journey map',
  'Ici, personne ne te note.': 'Here, no one scores you.',
  'Personne ne te classe.': 'No one ranks you.',
  'Tu réponds à ta façon.': 'You answer your way.',
  'Chaque réponse construit ton portrait, affine tes rencontres et fait avancer ton voyage.':
    'Every answer builds your portrait, sharpens your matches and moves your journey forward.',
  "Ce que tu découvres en chemin t'appartient\u00a0: ":
    'What you discover along the way belongs to you: ',
  'tu choisis ce qui se voit.': 'you choose what is visible.',
  'Ce que construisent tes réponses': 'What your answers build',
  'Ton portrait': 'Your portrait',
  'Tes affinités': 'Your affinities',
  'Ton chemin': 'Your path',
  'Tes rencontres': 'Your matches',
  'Tu gardes le contrôle.': 'You stay in control.',
  'Tes réponses servent à mieux comprendre tes affinités — tu choisis ce qui apparaît sur ton profil et ce que tu souhaites partager.':
    'Your answers help us understand your affinities better — you choose what appears on your profile and what you share.',

  // ---- écran Voyage — progression
  'Ta progression': 'Your progress',
  'Mondes franchis': 'Worlds crossed',
  'Étapes parcourues': 'Steps traveled',
  'Éléments récoltés': 'Items harvested',
  'En construction': 'Taking shape',
  'Progression du voyage : mondes franchis': 'Journey progress: worlds crossed',
  "Chaque monde franchi allume un segment — {{a}} sur {{b}} pour l'instant.":
    'Each world crossed lights up a segment — {{a}} of {{b}} so far.',
  'Prochaine étape': 'Next step',

  // ---- écran Voyage — carte du voyage
  'Ta carte du voyage': 'Your journey map',
  'Du départ à la Rencontre, {{a}} mondes jalonnent ton chemin — {{b}} sont offerts, dont la destination. Touche un monde pour le découvrir.':
    'From the start to the Encounter, {{a}} worlds line your path — {{b}} are free, including the destination. Touch a world to discover it.',
  'Monde {{n}} sur {{total}}': 'World {{n}} of {{total}}',
  '{{n}} étape{{s}}': '{{n}} step{{s}}',
  Terminé: 'Completed',
  'En cours': 'In progress',
  Ouvert: 'Open',
  'À venir': 'Coming soon',
  'Toujours gratuit': 'Free forever',
  Continuer: 'Continue',

  // ---- écran Voyage — ce que le voyage construit + récolte
  'Ce que ton voyage construit': 'What your journey builds',
  'À chaque étape, tu découvres quelque chose sur toi. Ton voyage construit progressivement ton portrait, tes affinités et ta façon de rencontrer.':
    'At every step, you learn something about yourself. Your journey gradually builds your portrait, your affinities and your way of meeting people.',
  '{{a}} sur {{b}} franchi': '{{a}} of {{b}} crossed',
  'Continuer mon Voyage': 'Continue my Journey',
  '{{a}} mondes. {{b}} étapes. Une histoire qui se construit à ton rythme.':
    '{{a}} worlds. {{b}} steps. A story that builds at your own pace.',
  'Reprendre mon voyage': 'Resume my journey',
  'Ta récolte': 'Your harvest',
  'Ce que ton voyage construit, étape après étape — chaque découverte reste à toi.':
    'What your journey builds, step after step — every discovery stays yours.',

  // ---- écran Voyage — premier arrêt
  'Premier arrêt': 'First stop',
  "Paysage turquoise — le premier monde, Le Miroir, t'attend":
    'A turquoise landscape — the first world, the Mirror, awaits you',
  'Premier arrêt : Le Miroir': 'First stop: The Mirror',
  "Le Monde 1 t'attend : découvre ce qu'il révèle de toi — personnalité, attachement, émotions — puis commence à ton rythme. Chaque monde franchi éclaire le suivant.":
    'World 1 awaits: discover what it reveals about you — personality, attachment, emotions — then start at your own pace. Each world crossed lights up the next.',
  'Continuer le Miroir': 'Continue the Mirror',
  'Découvrir les Mondes': 'Explore the Worlds',

  // ---- écran Voyage — carte SVG (WorldMap)
  'Carte du voyage : départ, puis {{noms}}, puis la Rencontre. Sélectionne un monde pour voir ses détails.':
    'Journey map: the start, then {{noms}}, then the Encounter. Select a world to see its details.',
  Départ: 'Start',
  'Monde {{n}} sur {{total}} : {{nom}}. {{q}} étapes':
    'World {{n}} of {{total}}: {{nom}}. {{q}} steps',
  ' Sélectionné.': ' Selected.',
  'La Rencontre': 'The Encounter',

  // ---- écran Mondes
  'Les Mondes du Voyage': 'The Worlds of the Journey',
  '{{n}} mondes jalonnent ton chemin — chacun révèle un territoire de toi. Touche un monde pour découvrir son objectif, sa récolte et comment ça se passe.':
    '{{n}} worlds line your path — each one reveals a territory of you. Touch a world to discover its purpose, its harvest and how it works.',
  'Le voyage en chiffres': 'The journey in numbers',
  'Tu es ici': 'You are here',
  'Ton arrêt actuel': 'Your current stop',
  'Progression du monde {{nom}}': 'Progress of the world {{nom}}',
  'Les mondes du chemin — touche un monde pour le découvrir':
    'The worlds of your path — touch a world to discover it',
  'La suite du voyage': 'The rest of the journey',
  'La destination': 'The destination',
  'La destination du voyage': 'The destination of the journey',
  Verrouillé: 'Locked',
  'Tous les mondes ouverts sont traversés': 'Every open world has been crossed',
  "La suite du voyage arrive — les prochains mondes s'ouvriront bientôt.":
    'The rest of the journey is coming — new worlds will open soon.',
  "Le voyage continue — {{nom}} t'attend.": 'The journey continues — {{nom}} awaits you.',
  'Un monde à la fois — chaque monde franchi éclaire le suivant.':
    'One world at a time — each world you cross lights up the next.',
  mondes: 'worlds',
  offerts: 'free',
  'mondes traversés': 'worlds crossed',
  cartes: 'cards',
  '{{faites}}/{{total}} étapes': '{{faites}}/{{total}} steps',
  étapes: 'steps',
  'Les 11 mondes du voyage — touche un monde pour le découvrir':
    'The 11 worlds of the journey — touch a world to discover it',
  'Continuer le monde {{nom}} — ouvrir sa fiche': 'Continue {{nom}} — open its card',
  'Commencer le monde {{nom}} — ouvrir sa fiche': 'Start {{nom}} — open its card',
  'Découvrir le monde {{nom}} (traversé)': 'See {{nom}} again (traveled)',
  'Découvrir le monde {{nom}} (à venir)': 'Discover {{nom}} (coming soon)',
  Revoir: 'See again',
  Découvrir: 'Discover',
  "Le premier arrêt — Le Miroir — t'attend.": 'The first stop — The Mirror — awaits you.',
  "Les mondes s'ouvrent l'un après l'autre : chaque monde franchi éclaire le suivant. Tu ne peux commencer un monde qu'après avoir terminé le précédent.":
    'The worlds open one after another: each world you cross lights up the next. You can only start a world once you have finished the previous one.',
  'Voir ma carte du voyage': 'See my journey map',

  // ---- composant WorldModal (fiche d'un monde)
  'Monde {{n}} sur 11': 'World {{n}} of 11',
  'Fermer la fiche du monde {{nom}}': 'Close the card of {{nom}}',
  '{{n}} quête{{s}}': '{{n}} quest{{s}}',
  '{{faites}}/{{total}} quêtes': '{{faites}}/{{total}} quests',
  'Tu as traversé ce monde le {{date}} — sa récolte est dans ton portrait.':
    'You traveled through this world on {{date}} — its harvest is in your portrait.',
  'Présentation du monde': 'World overview',
  'Ce monde': 'This world',
  'Objectif du monde': 'Purpose of the world',
  'Son objectif': 'Its purpose',
  'Résultats attendus du monde': 'Expected results of the world',
  'Ce que tu récoltes': 'What you harvest',
  'Déroulement des évaluations du monde': 'How the world assessments unfold',
  'Comment ça se passe': 'How it works',
  'Les {{n}} quêtes du monde': 'The {{n}} quests of the world',
  'Tes quêtes': 'Your quests',
  "Ce monde s'ouvrira quand tu auras terminé {{nom}}.":
    'This world will open once you have finished {{nom}}.',
  'le monde précédent': 'the previous world',
  'Tu as traversé ce monde — sa récolte est dans ton portrait.':
    'You have traveled through this world — its harvest is in your portrait.',
  'Le Miroir est ouvert — bienvenue dans ton premier monde.':
    'The Mirror is open — welcome to your first world.',
  '{{nom}} est ouvert.': '{{nom}} is open.',
  'Continuer le monde': 'Continue the world',
  'Commencer le monde': 'Start the world',

  // ---- écran Parcourus (journal de bord)
  'Mes Mondes parcourus': 'My Traveled Worlds',
  '{{p}} % de ton voyage parcouru': '{{p}}% of your journey traveled',
  'Progression du voyage': 'Journey progress',
  'Continuer le voyage': 'Continue the journey',
  'Là où tu en es': 'Where you stand',
  'Prochain monde': 'Next world',
  'Traversé le {{date}}': 'Traveled on {{date}}',
  "Ton journal de bord — les mondes traversés et ce qu'ils t'ont révélé.":
    'Your logbook — the worlds you have traveled and what they revealed about you.',
  'Ton parcours en chiffres': 'Your journey in numbers',
  'mondes franchis': 'worlds crossed',
  "Aucun monde traversé pour l'instant": 'No world traveled yet',
  "Le Monde 1 — Le Miroir — ouvre bientôt le chemin. Dès qu'un monde est franchi, il rejoint ton journal avec ce que tu y as découvert.":
    'World 1 — The Mirror — will open the path soon. As soon as a world is crossed, it joins your journal with what you discovered there.',
  "Ton premier monde n'est pas encore franchi": 'Your first world is not crossed yet',
  "Chaque quête terminée t'en rapproche — et tes résultats t'attendent juste ici, plus bas.":
    'Every quest completed brings you closer — and your results are waiting right here, below.',
  'Les mondes que tu as traversés': 'The worlds you have traveled',
  'Tes résultats de quêtes': 'Your quest results',
  'Tes résultats': 'Your results',
  "Chaque quête franchie te laisse une carte et tes résultats détaillés. Relis-les quand tu veux, ou garde-les avec toi en PDF — tout t'attend ici, intact.":
    'Each quest you complete leaves you a card and your detailed results. Reread them whenever you like, or keep them with you as a PDF — everything awaits you here, intact.',
  'Un écran de passage — rien à mesurer, tout reste modifiable.':
    'A passage screen — nothing to measure, everything stays editable.',
  'Ta carte\u00a0: ': 'Your card: ',
  'Fait le': 'Completed on',
  'Carte obtenue le': 'Card received on',
  'Relire ma carte': 'Read my card again',
  'Préparation…': 'Preparing…',
  'Télécharger le PDF': 'Download the PDF',

  // ---- écran Recolte
  'Ma récolte': 'My harvest',
  'Ton avancement': 'Your progress',
  '{{n}} cartes récoltées': '{{n}} cards gathered',
  'Ta récolte commence avec ta première quête.': 'Your harvest begins with your first quest.',
  'Tes espaces': 'Your spaces',
  Atteint: 'Unlocked',
  'Ton Portrait': 'Your portrait',
  'Dès tes premières réponses, ton portrait commence à se construire.':
    'From your first answers, your portrait begins to take shape.',
  'Ton journal': 'Your journal',
  // Apostrophe typographique U+2019 verbatim (bundle, ligne 13009).
  'Aucun monde traversé pour l’instant — le premier ouvre bientôt.':
    'No world traveled yet — the first one opens soon.',
  "Ton journal se remplit — chaque monde franchi y rejoint ce qu'il t'a révélé.":
    'Your journal is filling in — each world crossed joins what it revealed about you.',
  '{{a}} sur {{b}}': '{{a}} of {{b}}',
  'Certaines rencontres commencent ici.': 'Some matches begin here.',
  "0 pour l'instant": '0 for now',
  'Les étapes de ta récolte': 'The steps of your harvest',
  "Ta récolte t'appartient : tu choisis ce que tu partages, quand tu le partages — et l'espace pour gérer ce que tu montres s'ouvrira plus tard dans ton voyage.":
    'Your harvest is yours: you choose what you share, when you share it — and the space to manage what you show will open later in your journey.',
  // ---- Refonte « Ma récolte » (Task 43) — le coffre du voyageur
  "Ce que ton voyage t'a déjà apporté.": 'What your journey has already brought you.',
  'Mon voyage': 'My journey',
  'Le chemin du voyage — {{a}} mondes sur {{b}} traversés':
    'The journey path — {{a}} of {{b}} worlds crossed',
  'mondes explorés': 'worlds explored',
  'Ton voyage commence ici.': 'Your journey begins here.',
  'Les premières pièces de ton portrait apparaissent.':
    'The first pieces of your portrait are appearing.',
  'Ton portrait devient de plus en plus précis.':
    'Your portrait is becoming more and more precise.',
  'Ton histoire prend forme.': 'Your story is taking shape.',
  'Ton voyage est complet. Ton portrait peut maintenant raconter ton parcours.':
    'Your journey is complete. Your portrait can now tell your story.',
  "Une nouvelle pièce de ton portrait vient d'apparaître.":
    'A new piece of your portrait has just appeared.',
  '🃏': '🃏',
  'Cette découverte rejoint ta Récolte.': 'This discovery joins your Harvest.',
  'Fermer la révélation': 'Close the reveal',
  'Mes cartes': 'My cards',
  'Les découvertes que ton voyage a révélées sur toi.':
    'The discoveries your journey has revealed about you.',
  "Ce que ton voyage construit, étape après étape — chaque découverte reste à toi. Tes cartes décrivent des tendances, jamais des étiquettes : tu es toujours plus qu'un profil.":
    'What your journey builds, step after step — every discovery stays yours. Your cards describe tendencies, never labels: you are always more than a profile.',
  'La collection des 11 mondes': 'The collection of the 11 worlds',
  '0{{num}} — Monde {{num}}': '0{{num}} — World {{num}}',
  Découverte: 'Discovery',
  'À découvrir': 'Awaiting discovery',
  'Les découvertes de ce monde apparaîtront au fil de tes quêtes.':
    'The discoveries of this world will appear as you complete your quests.',
  'Cette pièce de ton portrait apparaîtra pendant ton voyage.':
    'This piece of your portrait will appear during your journey.',
  'À découvrir dans le Monde {{n}}': 'To be discovered in World {{n}}',
  'Voir mes résultats en détail — {{nom}}': 'See my detailed results — {{nom}}',
  'Voir en détail': 'See details',
  'À ne pas confondre : la Carte du voyage trace ton chemin — tes cartes racontent ce que tu as découvert.':
    'Not to be confused: the Journey Map traces your path — your cards tell what you have discovered.',
  'Voir la Carte du voyage': 'See the Journey Map',
  'Niveau {{n}} sur {{total}}': 'Level {{n}} of {{total}}',
  'Ton portrait prend forme': 'Your portrait is taking shape',
  'Onze mondes, onze fragments — chaque monde complété ajoute une pièce au portrait.':
    'Eleven worlds, eleven fragments — each completed world adds a piece to the portrait.',
  'Le portrait en construction — {{a}} pièces sur {{b}} assemblées':
    'The portrait in progress — {{a}} of {{b}} pieces assembled',
  '✨': '✨',
  '{{a}} pièce{{s}} sur {{b}} assemblée{{s2}}': '{{a}} piece{{s}} of {{b}} assembled{{s2}}',
  'Mes pass': 'My passes',
  'Des possibilités débloquées grâce à ton parcours.':
    'Possibilities unlocked thanks to your journey.',
  "Aucun pass pour l'instant": 'No pass for now',
  "Ton parcours ouvrira des possibilités : explorer plus loin, être mieux vu, découvrir autrement. Chaque pass s'affichera ici avec ce qu'il permet et combien il en reste.":
    'Your journey will open possibilities: explore further, be better seen, discover differently. Each pass will appear here with what it allows and how many uses remain.',
  "Un pass facilite une action — il n'achète jamais une meilleure compatibilité.":
    'A pass facilitates an action — it never buys better compatibility.',
  'Mes crédits': 'My credits',
  'Ce que tu peux utiliser au fil du voyage.': 'What you can use along the journey.',
  'Comment obtenir des crédits ?': 'How do you earn credits?',
  "Ton solde s'affichera ici dès tes premiers crédits — avec ce que tu as obtenu et ce que tu as utilisé. Les façons d'en obtenir arriveront avec la suite du voyage.":
    'Your balance will appear here as soon as you receive your first credits — with what you earned and what you used. Ways to earn them will arrive with the rest of the journey.',
  'Mes sceaux': 'My seals',
  'Les étapes que tu as traversées.': 'The stages you have crossed.',
  'Permanents et non consommables — chaque sceau marque un territoire que tu as traversé, et il reste à toi.':
    'Permanent and non-consumable — each seal marks a territory you have crossed, and it stays yours.',
  'Les sceaux de ton parcours': 'The seals of your journey',
  'Sceau — {{nom}} : {{etat}}': 'Seal — {{nom}}: {{etat}}',
  traversé: 'crossed',
  'en cours': 'in progress',
  'à venir': 'to come',
  'Mon histoire de voyage': 'My travel story',
  "Comment ta récolte s'est construite, monde après monde.":
    'How your harvest was built, world after world.',
  terminé: 'completed',
  'Tu as découvert :': 'You discovered:',
  'Écran de passage': 'Passage screen',
  'Fragment du portrait': 'Portrait fragment',
  'Sceau du monde': 'World seal',
  bientôt: 'soon',
  "Ta prochaine découverte t'attend ici.": 'Your next discovery awaits here.',

  // ---- écran Portrait
  'Ce que ton voyage révèle de toi, dimension après dimension.':
    'What your journey reveals about you, dimension after dimension.',
  'Ton portrait commencera à se construire dès tes premières réponses.':
    'Your portrait will start to take shape from your first answers.',
  '{{a}} monde{{s1}} franchi{{s2}} sur {{b}} · {{c}} étape{{s3}} sur {{d}}':
    '{{a}} world{{s1}} traveled of {{b}} · {{c}} step{{s3}} of {{d}}',
  'Ce qui construira ton portrait': 'What will build your portrait',
  "Ton portrait t'appartient.": 'Your portrait belongs to you.',
  "Tu choisis ce qui se voit : rien n'apparaît sur ton profil sans ta décision — et l'espace pour gérer ce que tu montres s'ouvrira plus tard dans ton voyage.":
    'You choose what is visible: nothing appears on your profile without your decision — and the space to manage what you show will open later in your journey.',
};
