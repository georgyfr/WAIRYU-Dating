/**
 * Archétypes de la quête 5.5 — Quand la tension monte (Monde 7 « Face aux
 * Tempêtes » · 💎 PREMIUM).
 *
 * Même gabarit que les quêtes 1.x-5.x : chaque type est écrit à la 2ᵉ
 * personne, SIMPLE ET LITTÉRAL, dans les 6 champs — intro (« Ton archétype
 * révèle une personne qui… » + point de vigilance), devise, « Ce que tu
 * apportes », « Ce qui peut te freiner » (refermé sur « Ce ne sont pas des
 * défauts — juste ce qui émerge quand… »), « En couple » (« À garder en
 * tête : … »), « Ton équilibre » (un geste + « Non parce que…, mais parce
 * que… »).
 *
 * Ancrage : les cartes VERBATIM (nom, lumière, ombre, tension) restent dans
 * quete-5-5.ts ; ces textes s'appuient sur le corps des cartes (cartes.yaml)
 * et les textures du 07-miroir.md (TA LUMIÈRE / TON OMBRE EN COUPLE / TA
 * TENSION / LE MINI-RES) — RÉÉCRITS, jamais recopiés : aucun segment ≥ 60
 * caractères n'est repris tel quel du miroir.
 *
 * LA DOCTRINE DES TEMPÉRATURES (doctrine capitale du Livrable) : les quatre
 * façons dont la tension sort se valent — aucune température supérieure,
 * aucun classement, aucune variante dressée en idéal, la montée de tension
 * n'est jamais un défaut. L'ombre nomme un PRIX (pour soi ET pour l'autre),
 * jamais une nature défaillante : zéro pathologisation de l'explosif, le
 * silence est une garde (« passif », « évitant », « fuyant » : interdits),
 * le profil sombre se dit « le corps qui suit ». Aucun vocabulaire
 * clinique, aucune étiquette.
 *
 * Typo : apostrophe ASCII uniquement, phrases ≤ 22 mots.
 */
import type { ArchetypeCarte } from './quetes-plus';

export const ARCHES_5_5: Record<
  'CARTE-5.5-MOTS-VIFS' | 'CARTE-5.5-MUR' | 'CARTE-5.5-LE-RETOUR' | 'CARTE-5.5-LE-CORPS',
  ArchetypeCarte
> = {
  // CARTE-5.5-MOTS-VIFS — la montée qui parle, et le prix des mots qui
  // dépassent le différend.
  'CARTE-5.5-MOTS-VIFS': {
    intro:
      'Ton archétype révèle une personne dont la montée parle : les mots sortent, et on sait où tu en es. Ton point de vigilance : un mot qui dépasse le différend se paie en réparations.',
    devise: 'Ma tension parle fort : ça sort, ça se traverse, rien ne mijote dessous.',
    apportes:
      'Rien ne pourrit chez toi : ce qui te traverse se dit, et les malentendus meurent vite. Avec toi, on sait où en est l\'autre — la clarté arrive tôt.',
    freines:
      'Le volume emporte parfois le fond : la phrase de trop part, et le regret reste après. Ce ne sont pas des défauts — juste ce qui émerge quand la montée parle en premier.',
    couple: 'À garder en tête : nomme la montée avant le fond — le volume baisse quand il est dit.',
    equilibre:
      'Nomme la montée avant de répondre — Non parce que tes mots sont de trop, mais parce qu\'ils arrivent plus justes redescendus.',
  },
  // CARTE-5.5-MUR — la garde qui protège, et la devinette qu'elle laisse à
  // l'autre.
  'CARTE-5.5-MUR': {
    intro:
      'Ton archétype révèle une personne qui protège par le silence : sous tension, tu poses un mur. Ton point de vigilance : une pause se lit parfois comme une fin.',
    devise: 'Mon silence est une garde : je protège la discussion de l\'incendie.',
    apportes:
      'Ton calme évite les mots qui dépassent : rien n\'est dit dans le feu. Avec toi, les éclats refroidissent — la discussion retrouve sa main.',
    freines:
      'Un mur se dresse vite et se démonte sur la longueur : l\'autre devine, et la devinette file plus loin que le différend. Ce ne sont pas des défauts — juste ce qui émerge quand la garde prend tout l\'espace.',
    couple:
      'À garder en tête : donne au silence une date — « j\'y reviens » transforme le mur en délai.',
    equilibre:
      'Dis une chose avant de te taire — Non parce que ton mur est faux, mais parce que le délai s\'annonce.',
  },
  // CARTE-5.5-LE-RETOUR — le second tour, et la blessure qui attend entre
  // deux.
  'CARTE-5.5-LE-RETOUR': {
    intro:
      'Ton archétype révèle une personne qui revient : le calme revenu, tu reprends ce qui a blessé. Ton point de vigilance : entre la montée et le retour, la blessure s\'installe.',
    devise: 'Je parle quand le calme permet d\'entendre : les mots arrivent entiers.',
    apportes:
      'Tes mots justes arrivent sans le volume de la montée : ce qui se règle à froid tient longtemps. Avec toi, un différend se reparle sans réveiller l\'incendie.',
    freines:
      'Le temps du refroidissement laisse la blessure s\'asseoir : l\'autre compose avec une scène que tu as déjà traversée. Ce ne sont pas des défauts — juste ce qui émerge quand le second tour tarde.',
    couple:
      'À garder en tête : nomme l\'heure du retour — l\'attente devient un rendez-vous, plus un vide.',
    equilibre:
      'Donne une date au retour — Non parce que ton froid est faux, mais parce que l\'attente annoncée se porte à deux.',
  },
  // CARTE-5.5-LE-CORPS — la peine qui descend, et le nom qui l'allège.
  'CARTE-5.5-LE-CORPS': {
    intro:
      'Ton archétype révèle une personne qui porte : la peine occupe la place des mots, et le corps la raconte avant toi. Ton point de vigilance : ce qui ne se dit pas se paie deux fois.',
    devise: 'Mon corps parle avant moi : la peine a un langage avant les mots.',
    apportes:
      'Ta peine se lit sans détour : avec toi, personne ne fait semblant, et le vrai trouve une porte. Ton corps raconte ce que les mots n\'ont pas encore dit.',
    freines:
      'Le repli porte ce qu\'il ne dit pas : la nuit, le ventre, les épaules — et ce portage use. Ce ne sont pas des défauts — juste ce qui émerge quand la peine descend.',
    couple:
      'À garder en tête : mets une phrase courte sur la peine — nommée, elle se porte moins lourd.',
    equilibre:
      'Dis la peine en une phrase avant qu\'elle descende — Non parce que ton repli est de trop, mais parce qu\'un nom soulage.',
  },
};
