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
  'Spam': 'Spam',
  'Harcèlement': 'Harassment',
  'Contenu inapproprié': 'Inappropriate content',
  'Faux profil': 'Fake profile',
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
};
