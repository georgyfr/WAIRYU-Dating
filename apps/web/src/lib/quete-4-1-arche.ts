/**
 * Archétypes de la quête 4.1 — Ton arbre relationnel (Monde 5
 * « Ton Héritage »).
 *
 * Même gabarit que les quêtes 1.x-3.x : chaque type est écrit à la 2ᵉ
 * personne, SIMPLE ET LITTÉRAL, dans les 6 champs — intro (« Ton archétype
 * révèle une personne qui… » + point de vigilance), devise, « Ce que tu
 * apportes », « Ce qui peut te freiner » (refermé sur « Ce ne sont pas des
 * défauts — juste ce qui émerge quand… »), « En couple » (« À garder en
 * tête : … »), « Ton équilibre » (un geste + « Non parce que…, mais parce
 * que… »).
 *
 * Ancrage : les cartes VERBATIM (nom, lumière, ombre, tension) restent dans
 * quete-4-1.ts ; ces textes s'appuient sur le corps des cartes (cartes.yaml)
 * et les textures du 07-miroir.md (TA LUMIÈRE / TON OMBRE EN COUPLE / TA
 * TENSION / LE MINI-RES) — RÉÉCRITS, jamais recopiés : aucun segment ≥ 60
 * caractères n'est repris tel quel du miroir.
 *
 * NEUTRALITÉ DES ORIGINES (doctrine capitale du Livrable) : les cinq façons
 * d'avoir grandi se valent — le climat deviné n'est pas un climat raté,
 * l'héritage pesant n'est pas une immaturité, la voix tenue n'est pas une
 * réparation. ZÉRO blâme parental (interdit V10) : aucun parent n'est jugé,
 * aucun énoncé n'accuse. Jamais un diagnostic, jamais une étiquette
 * clinique, aucun palier flatté ni blâmé.
 *
 * Typo : apostrophe ASCII uniquement, phrases ≤ 22 mots.
 */
import type { ArchetypeCarte } from './quetes-plus';

export const ARCHES_41: Record<
  | 'CARTE-4.1-TABLE-QUI-DIT'
  | 'CARTE-4.1-ROLE-LUMIERE'
  | 'CARTE-4.1-LECTEUR-SILENCES'
  | 'CARTE-4.1-PLACE-HERITEE'
  | 'CARTE-4.1-SELON-LA-TABLE',
  ArchetypeCarte
> = {
  // CARTE-4.1-TABLE-QUI-DIT — la table où les mots circulent, et la voix qui
  // tient sans casser la table.
  'CARTE-4.1-TABLE-QUI-DIT': {
    intro:
      'Ton archétype révèle une personne qui vient d\'une table où les mots circulaient — et qui tient sa voix sans casser la table. Tu dis ce que tu penses, et tu laisses la place aux autres. Ton point de vigilance : un silence n\'est pas un mur — il se demande sans le deviner.',
    devise: 'Ma place est une table : les mots y circulent, et chacun y tient sa voix.',
    apportes:
      'Une chaleur qui parle : chez toi, les malentendus se nomment vite et se réparent plus vite encore. Avec toi, on apprend que dire n\'est pas blesser — c\'est habiter.',
    freines:
      'L\'attente d\'une réponse immédiate peut peser : celui qui pèse ses mots n\'est pas celui qui se ferme. Ce ne sont pas des défauts — juste ce qui émerge quand la table a toujours répondu vite.',
    couple:
      'À garder en tête : laisse à l\'autre le temps du retour — le sujet résiste à la nuit.',
    equilibre:
      'Pose une question au lieu d\'une réponse — Non parce que ta lecture est fausse, mais parce que la réponse appartient à l\'autre.',
  },
  // CARTE-4.1-ROLE-LUMIERE — la fiabilité tenue tôt, et le repos du fiable.
  'CARTE-4.1-ROLE-LUMIERE': {
    intro:
      'Ton archétype révèle une personne fiable qui tient une place confiée très tôt. La table parlait chez toi, et tu as appris à porter une maison. Ton point de vigilance : le rôle confié n\'est pas une identité — il se repose aussi.',
    devise: 'Ma force est une maison : je la tiens, et je sais qui je suis quand on compte sur moi.',
    apportes:
      'Une fiabilité qui se voit : tu assumes, tu réponds présent, les tiens te font confiance. Avec toi, un projet tient debout — et la table est toujours mise.',
    freines:
      'Être fiable jusqu\'à s\'effacer de la liste : assumer tout et ne rien demander fatigue en silence. Ce ne sont pas des défauts — juste ce qui émerge quand le rôle a précédé le choix.',
    couple: 'À garder en tête : nomme une chose que tu ne portes plus — la table tient sans ça.',
    equilibre:
      'Demande de l\'aide avant la fatigue — Non parce que tu ne tiens pas, mais parce que tenir à deux pèse moins.',
  },
  // CARTE-4.1-LECTEUR-SILENCES — la boussole silencieuse, et la vérification.
  'CARTE-4.1-LECTEUR-SILENCES': {
    intro:
      'Ton archétype révèle une personne qui a appris à lire une maison où l\'essentiel se devinait — et qui sait où elle va, même sans qu\'on le nomme. Ton point de vigilance : ce qui se devine se vérifie — sinon il se vit seul.',
    devise: 'Ma boussole est silencieuse : je lis les maisons, et je tiens ma voix.',
    apportes:
      'Une attention rare : tu perçois ce que les autres ne disent pas. Avec toi, les non-dits deviennent lisibles — et personne n\'a à crier pour être entendu.',
    freines:
      'La lecture en avance : un regard devient un reproche, une pause devient une décision. Ce ne sont pas des défauts — juste ce qui émerge quand deviner a été plus sûr que demander.',
    couple:
      'À garder en tête : pose ta lecture en question, pas en verdict — la réponse appartient à l\'autre.',
    equilibre:
      'Vérifie avant de conclure — Non parce que ton intuition trompe, mais parce que la question ouvre ce que la certitude ferme.',
  },
  // CARTE-4.1-PLACE-HERITEE — la fidélité qui garde debout, et l'avis qui se
  // dit.
  'CARTE-4.1-PLACE-HERITEE': {
    intro:
      'Ton archétype révèle une personne fidèle qui a tenu très tôt la place qu\'il fallait tenir. Tu sais lire une maison et la porter à la fois. Ton point de vigilance : une place héritée se refuse aussi — la fatigue parle.',
    devise: 'Ma fidélité est une charpente : elle garde debout ce qui compte.',
    apportes:
      'Une fidélité rare : tu gardes debout ce qui compte, sans bruit et sans prix. Avec toi, la paix d\'une maison se sent — et les maux se devinent avant d\'exploser.',
    freines:
      'La paix du groupe passe avant ton avis : l\'attente se déplace, et l\'autre devient la table qu\'on ne veut pas troubler. Ce ne sont pas des défauts — juste ce qui émerge quand harmoniser a été ta première place.',
    couple:
      'À garder en tête : dis une chose que tu penses et que tu n\'as pas dite — la paix y gagne d\'être vraie.',
    equilibre:
      'Prends la parole pour toi — Non parce que la paix est fausse, mais parce qu\'elle est plus vraie quand chacun y figure.',
  },
  // CARTE-4.1-SELON-LA-TABLE — la souplesse qui navigue, et la règle qui se
  // raconte.
  'CARTE-4.1-SELON-LA-TABLE': {
    intro:
      'Ton archétype révèle une personne souple qui navigue entre les tables : tu dis quand c\'est juste, tu devines quand c\'est utile, tu tiens quand il faut. Ton point de vigilance : l\'adaptation n\'est pas une adresse — elle se raconte.',
    devise: 'Ma règle est une météo : elle s\'ajuste aux maisons, sans perdre le nord.',
    apportes:
      'Une aisance sociale réelle : tu t\'ajustes aux tables les plus diverses. Avec toi, les maisons différentes cohabitent — personne n\'a à choisir un camp.',
    freines:
      'La souplesse se lit mal de dehors : le partenaire cherche ta règle, elle se devine mal. Ce ne sont pas des défauts — juste ce qui émerge quand s\'adapter a été ton mode par défaut.',
    couple: 'À garder en tête : donne un mot de ta règle du moment — l\'autre y trouve la porte.',
    equilibre:
      'Explique ton mode d\'emploi — Non parce que tu dois te justifier, mais parce qu\'une règle dite rassure plus qu\'une règle devinée.',
  },
};
