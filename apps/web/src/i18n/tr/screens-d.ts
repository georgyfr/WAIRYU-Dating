/**
 * Dictionnaire EN du chrome — périmètre D (l'espace Rencontre restauré :
 * onglet Découvrir, feuilles, filtres, profil complet, écran de match,
 * couche réelle Matchs). Clés = chaînes FR exactes du code (avec
 * échappements \u2019) · valeurs = EN · repli FR si absent.
 *
 * Les TEXTES des profils de démonstration (cartes, questions, raisons)
 * restent FR à ce stade — démonstration staging, miroir EN documenté pour
 * la suite (i18n/content/en/profils-demo.ts).
 */
export const SCREENS_D: Record<string, string> = {
  // ---- L'espace : en-tête, modes, onglets ----
  'Rencontres': 'Meetings',
  'Voyage': 'Journey',
  'Filtres — {{n}} profils': 'Filters — {{n}} profiles',
  'Filtres': 'Filters',
  'Mode de découverte': 'Discovery mode',
  'Classique': 'Classic',
  'Invisible': 'Invisible',
  'Interracial': 'Interracial',
  'BIENTÔT': 'SOON',
  'Espace Rencontres': 'Meeting space',
  'Découvrir': 'Discover',
  'Matchs': 'Matches',
  'Messages': 'Messages',
  'Profil': 'Profile',
  'Monde {{n}} en cours': 'World {{n}} in progress',
  '{{n}} nouvelles cartes à gagner': '{{n}} new cards to earn',
  '{{ageMin}}\u2013{{ageMax}} ans · {{km}} km autour de toi': '{{ageMin}}\u2013{{ageMax}} y.o. · {{km}} km around you',
  'profil': 'profile',
  'profils': 'profiles',

  // ---- La carte de profil ----
  'Profil de démonstration': 'DEMO PROFILE',
  'Membre du voyage': 'Fellow traveler',
  '1 en écho': '1 echo',
  '1 en écho avec toi': '1 card echoes yours',
  'Perle rare': 'Rare gem',
  'Perle rare (2+)': 'Rare gem (2+)',
  'Vérifié': 'Verified',
  'Cherche': 'Looking for',
  'Cherche : {{intention}}': 'Looking for: {{intention}}',
  'Pourquoi vous voit-on ?': 'Why are you shown to each other?',
  'Photo de {{prenom}}': 'Photo of {{prenom}}',
  '{{n}} monde(s) franchi(s)': '{{n}} world(s) crossed',
  '{{nom}} — en cours': '{{nom}} — in progress',
  '{{n}} km': '{{n}} km',
  'Ses cartes de personnalité apparaîtront quand son voyage les révélera — jamais de profil inventé.':
    'Their personality cards will appear as their Journey reveals them — never an invented profile.',
  '{{n}} cartes se révèlent en discutant': '{{n}} cards reveal themselves as you talk',
  'Demander à {{prenom}}': 'Ask {{prenom}}',
  'NON': 'NO',
  'OUI': 'YES',
  'Ce ne sont pas des notes — jamais de score, jamais de classement. La rencontre n\u2019est jamais payante.':
    'These are not ratings — no score, no ranking. Meeting people is never paid.',
  'sur': 'of',
  'aujourd\u2019hui': 'today',
  'retours arrière': 'undos',
  'Retour arrière': 'Undo',
  'Trop loin': 'Too far',
  'Pas la même intention': 'Not the same intention',
  'Autre chose': 'Something else',

  // ---- La barre d'actions ----
  'Passer': 'Skip',
  'Demander': 'Ask',
  'Aimer': 'Like',
  'Faire un pas': 'Take a step',

  // ---- La feuille « Demander à » ----
  'Question envoyée': 'Question sent',
  'Ta question part avec ton like': 'Your question goes with your like',
  '{{prenom}} la verra avec ta carte « {{carte}} ». Si elle répond, la conversation s\u2019ouvre.':
    '{{prenom}} will see it with your card \u201c{{carte}}\u201d. If they answer, the conversation opens.',
  'Démonstration : la question reste sur ton appareil — rien ne part vraiment.':
    'Demo: the question stays on your device — nothing is really sent.',
  'Continuer à découvrir': 'Keep discovering',
  'Des questions prêtes — touche-en une, ou écris la tienne': 'Ready-made questions — tap one, or write your own',
  'Pour mieux comprendre': 'To understand better',
  'Pour faire sourire': 'To bring a smile',
  'Pour avancer ensemble': 'To move forward together',
  'Ta question à {{prenom}}': 'Your question to {{prenom}}',
  'Écris ce que tu aimerais lui demander…': 'Write what you would like to ask\u2026',
  '{{n}} / 200': '{{n}} / 200',
  'Ce que {{prenom}} recevra': 'What {{prenom}} will receive',
  'avec le passage cité et sa carte « {{carte}} »': 'with the quoted passage and their card \u201c{{carte}}\u201d',
  'Ta question vaut un like — {{n}} restantes aujourd\u2019hui.':
    'Your question counts as a like — {{n}} left today.',
  'Une question par profil avant le match.': 'One question per profile before a match.',
  'Plus de questions aujourd\u2019hui': 'No more questions today',
  'Envoyer à {{prenom}}': 'Send to {{prenom}}',

  // ---- Les filtres ----
  'Âge': 'Age',
  'Âge minimum': 'Minimum age',
  'Âge maximum': 'Maximum age',
  'ans': 'y.o.',
  'Distance': 'Distance',
  'Distance maximum': 'Maximum distance',
  'Partout': 'Anywhere',
  'Intention': 'Intention',
  'Toutes les intentions': 'All intentions',
  'Relation sérieuse': 'Serious relationship',
  'Mariage': 'Marriage',
  'Rencontre': 'Dating',
  'Cartes en écho — au moins': 'Echoing cards — at least',
  'Peu importe': 'Any',
  'correspondent à ces filtres': 'match these filters',
  'Réinitialiser': 'Reset',
  'Appliquer': 'Apply',

  // ---- Le profil complet ----
  'Profil de {{prenom}}': '{{prenom}}\u2019s profile',
  'Retour au deck': 'Back to the deck',
  'Plus d\u2019actions — masquer, signaler': 'More actions — hide, report',
  'Le portrait': 'The portrait',
  'Ses cartes': 'Their cards',
  'Moi aussi': 'Me too',
  'Autrement que moi': 'Differently from me',
  'J\u2019aimerais en parler': 'I would like to talk about it',
  'À découvrir en discutant': 'To discover while talking',
  'Se révèle en discutant — sceau : {{sceau}}': 'Reveals while talking — seal: {{sceau}}',
  'Sa bio': 'Their bio',
  'À savoir': 'Good to know',
  'Où': 'Where',
  'Métier': 'Job',
  'Son voyage': 'Their Journey',
  'Aime': 'Loves',
  'Retour': 'Back',
  'Plus tard': 'Later',
  'Coup de cœur': 'Favorite',
  'Plus': 'More',

  // ---- L'écran de match ----
  'C\u2019est un match !': 'It\u2019s a match!',
  'Match de démonstration': 'DEMO MATCH',
  'Vous avez tous les deux fait un pas — la suite, c\u2019est à vous de l\u2019écrire.':
    'You both took a step — the rest is yours to write.',
  'Pour commencer, issues de vos cartes en écho': 'To start, drawn from your echoing cards',
  'Prenez le temps qu\u2019il faut — rien ne compte à rebours. Si personne n\u2019écrit dans 24 h, on vous le rappellera doucement.':
    'Take the time you need — nothing counts down. If no one writes within 24 h, we will gently remind you.',
  'Dire quelque chose': 'Say something',

  // ---- Les états vides ----
  'C\u2019est tout pour aujourd\u2019hui': 'That\u2019s all for today',
  'La pile se renouvelle vers {{heure}} — en attendant, ton voyage continue de gagner des cartes.':
    'The deck renews around {{heure}} — meanwhile, your Journey keeps earning cards.',
  'Rien avec ces filtres': 'Nothing with these filters',
  'Élargis un peu : chaque filtre en moins ramène environ {{n}} profils.':
    'Widen a little: each filter removed brings back about {{n}} profiles.',
  'C\u2019est tout pour l\u2019instant': 'That\u2019s all for now',
  'La pile se renouvelle vers {{heure}}. Jamais de profil inventé : les personnes arrivent en franchissant le Miroir, comme toi.':
    'The deck renews around {{heure}}. Never an invented profile: people arrive by crossing the Mirror, like you.',
  'Gagner des cartes dans le Voyage': 'Earn cards in the Journey',
  'Élargir mes filtres': 'Widen my filters',
  'Revoir les profils passés aujourd\u2019hui': 'Review the profiles skipped today',
  'Impossible de charger le deck — vérifie ta connexion.': 'Could not load the deck — check your connection.',

  // ---- L'onglet Profil in-espace ----
  'Tes critères : {{ageMin}}\u2013{{ageMax}} ans · {{km}} km autour de toi':
    'Your criteria: {{ageMin}}\u2013{{ageMax}} y.o. · {{km}} km around you',
  'Modifier': 'Edit',
  'À revoir ({{n}})': 'To revisit ({{n}})',
  'Les profils gardés pour plus tard attendront ici — remets-les dans la pile quand tu veux.':
    'Profiles kept for later will wait here — put them back in the deck whenever you want.',
  'remettre dans la pile': 'put back in the deck',
  'Tes questions ({{n}} aujourd\u2019hui)': 'Your questions ({{n}} today)',
  'Une question par profil avant le match — ta question vaut un like. Si la personne répond, la conversation s\u2019ouvre.':
    'One question per profile before a match — your question counts as a like. If they answer, the conversation opens.',
  'Ta vitrine': 'Your showcase',
  'Tes propres cartes restent à la deuxième personne — elles vivent dans ta récolte.':
    'Your own cards stay in the second person — they live in your harvest.',
  'Ouvrir ma récolte': 'Open my harvest',
  'Voir mon portrait': 'See my portrait',

  // ---- La couche réelle (Matchs) — reprises et nouvelles ----
  'Tes matchs': 'Your matches',
  'Certaines rencontres commencent ici.': 'Some encounters begin here.',
  'Le Miroir est derrière toi. Certaines rencontres commencent ici.':
    'The Mirror is behind you. Some encounters begin here.',
  'C\u2019est un match — deux pas, une réciprocité.': 'It\u2019s a match — two steps, one reciprocity.',
  '{{n}} personne a fait un pas vers toi': '{{n}} person took a step toward you',
  '{{n}} personnes ont fait un pas vers toi': '{{n}} people took a step toward you',
  'Fais ton pas — tu sauras qui, seulement si c\u2019est réciproque.':
    'Take your step — you will know who only if it is reciprocal.',
  'Ouvrir la conversation': 'Open the conversation',
  'Une conversation, c\u2019est du temps et des mots — la révélation se mérite (15 messages et 7 jours).':
    'A conversation takes time and words — revelation is earned (15 messages and 7 days).',
  'Les membres du voyage': 'Fellow travelers',
  'Des personnes réelles qui ont, comme toi, traversé le Miroir (1.1 → 1.3).':
    'Real people who, like you, crossed the Mirror (1.1 → 1.3).',
  'Personne dans le pool pour l\u2019instant': 'No one in the pool yet',
  'Dès qu\u2019un·e membre franchira le Miroir, il·elle apparaîtra ici — jamais de profil inventé.':
    'As soon as a member crosses the Mirror, they will appear here — never an invented profile.',
  'Ici depuis {{date}}': 'Here since {{date}}',
  'Mondes franchis : {{n}}': 'Worlds crossed: {{n}}',
  'Monde 1 — Le Miroir': 'World 1 — The Mirror',
  'Match avec {{pseudo}}': 'Match with {{pseudo}}',
  'Match': 'Match',
  'Annuler': 'Cancel',
  'Voyageur·se': 'Traveler',
  'Ta porte vers la rencontre': 'Your gate to meeting people',
  'Le Miroir — les quêtes terminées : {{faites}}/{{total}}': 'The Mirror — quests completed: {{faites}}/{{total}}',
  'La porte s\u2019ouvrira dès que le Miroir sera traversé (1.1 → 1.3).':
    'The gate will open once the Mirror is crossed (1.1 → 1.3).',
  'Comment ça commence\u00A0?': 'How does it start?',
  "Ton voyage construit ton portrait et tes affinités — la première personne compatible apparaîtra ici, et le Voyage à Deux s'ouvrira avec elle. La rencontre n'est jamais payante.":
    'Your Journey builds your portrait and your affinities — the first compatible person will appear here, and the Journey for Two will open with them. Meeting people is never paid.',
  'Voir ma carte du voyage': 'See my Journey card',
  'Impossible de charger tes rencontres — réessaie.': 'Could not load your meetings — try again.',
  'Chargement…': 'Loading\u2026',
};
