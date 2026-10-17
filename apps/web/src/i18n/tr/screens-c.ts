/**
 * Dictionnaire EN du chrome — périmètre C (R.E2, Task 107) : l'écran
 * MessagesEspace (conversations, fil, révélation, sécurité) + le bouton
 * « Ouvrir la conversation » de Rencontres.
 * Clés = chaînes FR exactes du code · valeurs = EN · repli FR si absent.
 */
export const SCREENS_C: Record<string, string> = {
  // ---- MessagesEspace : la liste ----
  'Tes conversations': 'Your conversations',
  'Les conversations ne sont pas disponibles pour le moment.': 'Conversations are unavailable right now.',
  'Aucune conversation pour l\u2019instant — les conversations naissent d\u2019un match (deux pas réciproques).':
    'No conversations yet — conversations are born from a match (two reciprocal steps).',
  'Voyageur·euse': 'Traveler',
  'Conversation neuve': 'A brand-new conversation',
  '{{n}} messages non lus': '{{n}} unread messages',
  'Toi': 'You',

  // ---- Le fil ----
  'Retour aux conversations': 'Back to conversations',
  'Conversation': 'Conversation',
  'Révélés': 'Revealed',
  'Sécurité': 'Safety',
  'Écrivez le premier mot — en toute simplicité.': 'Write the first word — simply.',
  'Écrire un message…': 'Write a message…',
  'Envoyer': 'Send',
  '…': '…',
  'Cette conversation est indisponible.': 'This conversation is unavailable.',
  'La conversation est fermée. Vos messages passés restent lisibles.':
    'The conversation is closed. Past messages remain readable.',
  'Le message n\u2019a pas pu partir. Réessaie.': 'The message could not be sent. Try again.',
  'Traduction…': 'Translating…',
  'Traduit': 'Translated',
  'Traduire en anglais': 'Translate to English',
  'Traduire en français': 'Translate to French',
  'La traduction est indisponible pour le moment.': 'Translation is unavailable right now.',
  'La traduction a échoué.': 'Translation failed.',

  // ---- La révélation (D-E2-6) ----
  'Révélation posée — en attendant l\u2019autre.': 'Reveal requested — waiting for the other one.',
  '{{pseudo}} propose de se révéler — dire oui': '{{pseudo}} proposes to reveal — say yes',
  'Se révéler l\u2019un à l\u2019autre': 'Reveal to each other',
  'Révélation : {{m}}/{{mm}} messages · {{j}}/{{jj}} jours': 'Reveal: {{m}}/{{mm}} messages · {{j}}/{{jj}} days',
  'Vous vous êtes révélés l\u2019un à l\u2019autre.': 'You have revealed yourselves to each other.',
  'Ta demande est posée — en attendant l\u2019autre.': 'Your request is in — waiting for the other one.',
  'La révélation demande plus de chemin ensemble : des mots et du temps.':
    'Revealing asks for more of the path together: words and time.',
  'La révélation n\u2019a pas pu être demandée.': 'The reveal request could not be made.',

  // ---- La sécurité (D-E2-7/8/9) ----
  'Aucune de ces actions n\u2019est jamais visible de l\u2019autre personne.':
    'None of these actions is ever visible to the other person.',
  'Signaler': 'Report',
  'Escroquerie ou demande d\'argent': 'Scam or money requests',
  'Harcèlement': 'Harassment',
  'Contenu inapproprié': 'Inappropriate content',
  'Faux profil': 'Fake profile',
  'Comportement fétichisant': 'Fetishizing behaviour',
  'Autre': 'Other',
  'Détails (facultatif)': 'Details (optional)',
  'Envoyer le signalement': 'Send the report',
  'Bloquer en silence': 'Block silently',
  'Ne plus correspondre (tout efface)': 'Stop matching (erases everything)',
  'Fermer': 'Close',
  'Cette personne ne peut plus t\u2019écrire. Elle n\u2019en est pas informée.':
    'This person can no longer write to you. They are not told.',
  'Ton signalement est envoyé. Personne ne saura qui l\u2019a fait.':
    'Your report is sent. Nobody will know who sent it.',

  // ---- Rencontres : le bouton + la note ----
  'Ouvrir la conversation': 'Open the conversation',
  'Une conversation, c\u2019est du temps et des mots — la révélation se mérite (15 messages et 7 jours).':
    'A conversation is time and words — the reveal is earned (15 messages and 7 days).',

  // ---- RENCONTRE-E3 « Le Voyage à Deux » (Task 115-b) — le bandeau dans le fil
  'Le Voyage à Deux': 'The Journey for Two',
  'Votre chemin à deux : {{n}} récoltes': 'Your path for two: {{n}} harvests',
  'Les cartes': 'The cards',
  'Les cartes se dévoileront quand vous aurez traversé la même quête, chacun pour soi.':
    'The cards will open once you have both crossed the same quest, each on your own.',
  'Mettre en regard': 'Put side by side',
  '{{pseudo}} propose de mettre en regard — dire oui': '{{pseudo}} proposes to put them side by side — say yes',
  'Tu as proposé — la réponse de l\u2019autre ouvrira la vue.':
    'You proposed — the other\u2019s answer will open the view.',

  // E3 — la voix (niveau 3)
  'La voix': 'The voice',
  'Lever le voile de la voix': 'Lift the veil of the voice',
  '{{pseudo}} propose de lever le voile de la voix — dire oui':
    '{{pseudo}} proposes to lift the veil of the voice — say yes',
  'La conversation grandit — {{m}}/{{mm}} messages · {{j}}/{{jj}} jours.':
    'The conversation is growing — {{m}}/{{mm}} messages · {{j}}/{{jj}} days.',
  'Enregistrer une voix': 'Record a voice note',
  'Arrêter': 'Stop',
  'La note est trop courte — réessaie.': 'The note is too short — try again.',
  'Réécoute avant d\u2019envoyer :': 'Listen back before sending:',
  'Envoyer la voix': 'Send the voice note',
  'Supprimer': 'Delete',
  'Supprimer ma voix': 'Delete my voice note',
  'Des mots, puis une voix — chacun à son rythme.': 'Words first, then a voice — each at your own pace.',
  'Le micro n\u2019est pas accessible — vérifie les autorisations.':
    'The microphone isn\u2019t accessible — check the permissions.',
  'L\u2019enregistrement n\u2019est pas disponible sur cet appareil.':
    'Recording isn\u2019t available on this device.',
  'La note dépasse 60 s ou 512 Ko.': 'The note exceeds 60 s or 512 KB.',

  // E3 — la photo (niveau 4)
  'La photo': 'The photo',
  'Lever le voile de la photo': 'Lift the veil of the photo',
  '{{pseudo}} propose de lever le voile de la photo — dire oui':
    '{{pseudo}} proposes to lift the veil of the photo — say yes',
  'Le Statut Prêt·e s\u2019ouvre quand vous aurez franchi la quête 1.11.':
    'The Ready status opens once you have both crossed quest 1.11.',
  'La photo s\u2019ouvre après la voix — dans l\u2019ordre, toujours.':
    'The photo opens after the voice — in order, always.',
  'Choisir une photo': 'Choose a photo',
  'Ta photo partagée': 'Your shared photo',
  'La photo de {{pseudo}}': '{{pseudo}}\u2019s photo',
  'À son rythme.': 'At their own pace.',
  'Supprimer ma photo': 'Delete my photo',
  'La photo dépasse 4 Mo.': 'The photo exceeds 4 MB.',
  'La photo n\u2019a pas pu partir — essaie un autre fichier.':
    'The photo couldn\u2019t be sent — try another file.',

  // E3 — les récoltes à deux (activité pilote)
  'Trois questions croisées': 'Three crossed questions',
  'Trois questions posées à vous deux — les réponses se dévoilent ensemble, quand vous y aurez tous les deux répondu.':
    'Three questions asked to you both — the answers are revealed together, once you have both answered.',
  'Commencer l\u2019activité': 'Start the activity',
  'Ta réponse…': 'Your answer…',
  'Répondre aux trois': 'Answer the three',
  'Les trois réponses sont nécessaires — à ton rythme.': 'All three answers are needed — at your own pace.',
  'En attente de l\u2019autre — vos réponses se dévoileront ensemble.':
    'Waiting for the other — your answers will be revealed together.',
  'Le rendez-vous préparé': 'The prepared outing',
  'Une proposition, pas un programme.': 'A proposal, not a program.',
  'Qui choisit le lieu ? L\u2019autre choisit l\u2019heure.': 'Who picks the place? The other picks the time.',

  // E3 — erreurs douces (le message gravé « sanction_active » passe tel quel, hors dictionnaire)
  'La porte n\u2019est pas encore ouverte.': 'The door isn\u2019t open yet.',
  'Ce format n\u2019est pas pris en charge — essaie un autre fichier.':
    'This format isn\u2019t supported — try another file.',
  'Tout doucement — réessaie dans un instant.': 'Gently now — try again in a moment.',
  'Les médias sont indisponible pour l\u2019instant.': 'Media is unavailable right now.',
  'Ça n\u2019a pas abouti — réessaie dans un instant.': 'That didn\u2019t go through — try again in a moment.',
};
