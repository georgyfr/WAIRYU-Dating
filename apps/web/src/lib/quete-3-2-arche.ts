/**
 * Archétypes de la quête 3.2 — Ton quotidien (Monde 4 « Ton Terrain »).
 *
 * Même gabarit que la quête 2.1 (Task 35) : chaque type est écrit à la 2ᵉ
 * personne, SIMPLE ET LITTÉRAL, dans les 6 champs — intro (« Ton archétype
 * révèle une personne qui… » + point de vigilance), devise, « Ce que tu
 * apportes », « Ce qui peut te freiner » (refermé sur « Ce ne sont pas des
 * défauts — juste ce qui émerge quand… »), « En couple » (« À garder en
 * tête : … »), « Ton équilibre » (un geste + « Non parce que…, mais parce
 * que… »).
 *
 * Ancrage : les cartes VERBATIM (nom, lumière, ombre, tension) restent dans
 * quete-3-2.ts ; ces textes s'appuient sur le corps des cartes (cartes.yaml,
 * charte C1-C11) et les 5 briques du 07-miroir.md (MR-32-QUO-PLAN-ORDRE ·
 * -PLAN-DESORDRE · -IMPRO-ORDRE · -IMPRO-DESORDRE · -CENTRAL — TA LUMIÈRE /
 * TON OMBRE EN COUPLE / TA TENSION / MINI-RES) — RÉÉCRITS, jamais recopiés :
 * aucun segment ≥ 60 caractères n'est repris tel quel. Doctrine du Livrable
 * respectée : les 5 profils se valent (aucun quadrant dressé en idéal,
 * aucun palier blâmé), l'ombre nomme une conséquence du mouvement du type —
 * jamais un défaut ni un jugement moral ; registre probabiliste (« la
 * recherche documente que », jamais un futur certain sur l'autre) ; le mot
 * « bordel » et les cinq jugements interdits (rigide, léger, maniaque,
 * bordélique-paresseux, mou) n'apparaissent nulle part ; zéro vocabulaire
 * clinique ; aucun code, score ou sigle rendu (PLAN_D, ORDRE_D, les
 * quadrants restent moteur — le rendu parle du programme, du fil des
 * choses, de la place).
 *
 * Typo : apostrophe ASCII uniquement, phrases ≤ 22 mots.
 */
import type { ArchetypeCarte } from './quetes-plus';
import type { VarianteId32 } from './quete-3-2';

export const ARCHES_32: Record<VarianteId32, ArchetypeCarte> = {
  // CARTE-3.2-HORLOGE — Le·La Cadran bien réglé : une mécanique douce qui
  // rend la vie lisible, et une case vide qui se nomme à deux (quadrant
  // planificateur × ordonné).
  'CARTE-3.2-HORLOGE': {
    intro:
      'Ton archétype révèle une personne qui tient son quotidien comme une mécanique douce : les journées se lisent, la maison connaît ses places. Cette fiabilité se sent dès la porte. Ton point de vigilance : un programme qui tourne parfois sans l\'autre dedans.',
    devise: 'Je rends la vie lisible — et ça se sent dès la porte.',
    apportes:
      'Du lisible : des semaines qui se prévoient, des places qui se retrouvent, des promesses tenues. Avec toi, un chez-deux s\'installe vite — la sécurité se respire.',
    freines:
      'Les journées sans forme, les places qui bougent, les programmes écrits par d\'autres. Ce ne sont pas des défauts — juste ce qui émerge quand la mécanique porte toute la maison.',
    couple:
      'Tu apprécies un quotidien tenu : des rendez-vous qui arrivent, une maison qui se lit. À garder en tête : les foyers bien cadencés connaissent souvent cette friction-là — la case vide se nomme à deux, pas toute seule.',
    equilibre:
      'Laisser une case vide dans le programme, et la nommer ensemble. Non parce que ton cadran serait trop juste, mais parce qu\'un plan à deux tient quand l\'autre y écrit.',
  },

  // CARTE-3.2-CALEPIN — Le·La Calépin et le flot : deux systèmes distincts
  // qui fonctionnent, et un seuil de tolérance qui se nomme (quadrant
  // planificateur × désordonné).
  'CARTE-3.2-CALEPIN': {
    intro:
      'Ton archétype révèle une personne à deux systèmes : le dehors cadré — rendez-vous notés — et le dedans qui vit à son rythme. Les deux fonctionnent, chacun chez soi. Ton point de vigilance : ton seuil de tolérance n\'est pas une évidence pour tout le monde.',
    devise: 'Je planifie le monde — et ma maison respire à son rythme.',
    apportes:
      'Un agenda tenu, sans maison verrouillée : tu sais où tu vas, sans tout tenir. À deux, ça apaise — les grandes lignes se préparent, les petites choses peuvent vivre.',
    freines:
      'Les standards de rangement, les visites imprévues, les regards qui s\'attardent. Ce ne sont pas des défauts — juste ce qui émerge quand deux systèmes cohabitent sous un même toit.',
    couple:
      'Tu apprécies un lien qui respecte tes deux cadences : l\'agenda côté monde, le flot côté maison. À garder en tête : ce qui n\'est pas un problème chez toi peut se lire comme un signal. Nomme ton seuil à voix haute — il devient une convention à deux.',
    equilibre:
      'Choisir avec l\'autre ce qui se range et ce qui vit — et l\'écrire quelque part. Non parce que ton flot poserait problème, mais parce qu\'un seuil se pose, il ne se devine pas.',
  },

  // CARTE-3.2-SANS-BUSSOLE — Le·La Porte qui suit le vent : un calme sans
  // programme, et un oui qui se découvre en marchant (quadrant improvisateur
  // × ordonné — id historique sans accent, copié tel quel du cartes.yaml).
  'CARTE-3.2-SANS-BUSSOLE': {
    intro:
      'Ton archétype révèle une personne qui habite un calme sans programme : le fil des jours te porte, ta maison garde ses places. L\'imprévu passe chez toi sans rien renverser. Ton point de vigilance : ton oui se découvre en marchant.',
    devise: 'Je suis le fil — et ma maison tient debout.',
    apportes:
      'Une souplesse qui a de la tenue : l\'imprévu est reçu, le cadre reste debout. Avec toi, un foyer respire sans se diluer — la souplesse tient la maison, la maison tient la souplesse.',
    freines:
      'Les grandes lignes à poser d\'avance, les plans écrits loin, les dates qui attendent. Ce ne sont pas des défauts — juste ce qui émerge quand le fil décide au jour le jour.',
    couple:
      'Tu apprécies un lien qui ne t\'enferme pas dans un programme : la place est tenue, le temps est libre. À garder en tête : qui compte sur toi prépare parfois deux fois — un mot d\'avance sur les grandes lignes change tout.',
    equilibre:
      'Poser deux ou trois jalons que les autres peuvent lire — le reste improvise. Non parce que ton fil serait flou, mais parce qu\'un jalon posé tôt épargne des devinettes.',
  },

  // CARTE-3.2-VENT — Le·La Voile au vent : le présent pris large, et un
  // plancher à deux qui retient l'essentiel (quadrant improvisateur ×
  // désordonné).
  'CARTE-3.2-VENT': {
    intro:
      'Ton archétype révèle une personne qui prend le présent large : les jours se tracent en marchant, les choses gardent leur place. C\'est une façon entière d\'habiter le quotidien — elle désamorce bien des tempêtes. Ton point de vigilance : les charges invisibles s\'accumulent quand rien ne les retient.',
    devise: 'Je vis au fil — le présent a de la place chez moi.',
    apportes:
      'Une disponibilité au réel : rien de figé, donc peu de drames quand ça dévie. Avec toi, les plans manqués redeviennent des anecdotes — la vie passe avant le programme.',
    freines:
      'Le linge qui attend, le rendez-vous qui se devine, le frigo qui se vide. Ce ne sont pas des défauts — juste ce qui émerge quand le fil du jour porte tout le poids.',
    couple:
      'Tu apprécies un lien sans étiquette : la place des choses se crée, elle ne se décrète pas. À garder en tête : les foyers peu structurés vivent souvent des charges invisibles. Un plancher à deux évite que le fil les oublie.',
    equilibre:
      'Tenir un plancher à deux — une routine, une place — et laisser le reste au fil. Non parce que ta liberté serait un problème, mais parce qu\'un plancher tenu rend la liberté plus vaste.',
  },

  // CARTE-3.2-MAREE — Le·La Marée des jours : changer de mode sans le
  // payer, et un mode qui s'annonce (central — selon les jours).
  'CARTE-3.2-MAREE': {
    intro:
      'Ton archétype révèle une personne qui change de mode sans le payer : selon les saisons, le programme mène ou le fil décide. Cette aisance est plus rare qu\'elle n\'y paraît. Ton point de vigilance : ton mode du jour s\'annonce — il ne se devine pas.',
    devise: 'Je change de mode avec les saisons — et j\'assume les deux.',
    apportes:
      'Une aisance entre les deux rives : ni collée au programme, ni perdue sans fil. Avec toi, une vie à deux peut changer de forme sans crise — les saisons passent, tu suis.',
    freines:
      'Les questions qui supposent un mode fixe, les plannings annuels, les repères qui ne bougent jamais. Ce ne sont pas des défauts — juste ce qui émerge quand ton mode bouge plus vite que les attentes.',
    couple:
      'Tu apprécies un lien qui accepte tes deux versions : le matin programmé comme la semaine floue. À garder en tête : qui vit avec toi cherche ta règle du jour. Donne un mot d\'avance — la flexibilité y gagne un langage.',
    equilibre:
      'Annoncer ton mode du jour en trois mots — au réveil, ou avant la soirée. Non parce que ta souplesse faiblirait, mais parce qu\'un mode annoncé épargne bien des devinettes.',
  },
};
