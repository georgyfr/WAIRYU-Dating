/**
 * Archétypes de la quête 3.4 — Ton rapport à l'argent (Monde 4 « Ton terrain »).
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
 * quete-3-4.ts ; ces textes s'appuient sur le corps des cartes (cartes.yaml,
 * charte C1-C11) et les briques du 07-miroir.md (MR-34-ARG-DEP-SPONT « le
 * cœur qui paie » · MR-34-ARG-DEP-CALC « le collectionneur raisonné » ·
 * MR-34-ARG-ECO-SPONT « le flair du futé » · MR-34-ARG-ECO-CALC « la maison
 * bien tenue » · MR-34-ARG-CENTRAL « selon les mois ») — RÉÉCRITS, jamais
 * recopiés : aucun segment ≥ 60 caractères n'est repris tel quel du miroir
 * ni des cartes. ⚠ le miroir MR-34-ARG-DEP-CALC porte une phrase DUPLIQUÉE
 * (« Le compte de l'autre compte autant que ta propre raison. » clôt l'ombre
 * juste après le coût pour l'autre — artefact d'édition du livrable,
 * consigné à l'audit) : la duplication n'est PAS recopiée, la texture est
 * réécrite une seule fois. Doctrine du Livrable respectée : les cinq tempos
 * se valent (dépenser et épargner se valent, calculé et spontané se valent —
 * l'argent n'est jamais jugé, aucun palier moralisateur), l'ombre nomme une
 * conséquence du mouvement du type — jamais un défaut ni un jugement moral ;
 * registre probabiliste (« fréquemment », jamais le futur certain sur
 * l'autre). Zéro montant chiffré ; « impulsivité financière », « dangerosité »
 * et DGR restent moteur seul (C2/C3).
 *
 * Typo : apostrophe ASCII uniquement, phrases ≤ 22 mots.
 */
import type { ArchetypeCarte } from './quetes-plus';
import type { VarianteId34 } from './quete-3-4';

export const ARCHES_34: Record<VarianteId34, ArchetypeCarte> = {
  // CARTE-3.4-CŒUR-QUI-PAIE — Le·La Cœur qui paie : l'argent qui suit le cœur,
  // et le compte qui se découvre après coup (dépensier × spontané).
  'CARTE-3.4-CŒUR-QUI-PAIE': {
    intro:
      'Ton archétype révèle une personne dont l\'argent suit le cœur. Les coups de cœur se vivent vite et les décisions se prennent sur place. Une dépense, chez toi, est d\'abord une émotion vraie. Ton point de vigilance : le compte se découvre parfois après le coup de cœur, pas avant.',
    devise: 'Mon argent porte des moments — et ça vaut la dépense.',
    apportes:
      'Une chaleur qui se dépense : les sorties, les cadeaux, les détours imprévus qui deviennent des souvenirs. Avec toi, la vie à deux ne ressemble pas à un tableau de charges — elle célèbre encore.',
    freines:
      'Les comptes à lire après coup, les fins de mois qui se resserrent, la règle de compte à écrire à deux. Ce ne sont pas des défauts — juste ce qui émerge quand le cœur décide plus vite que le compte.',
    couple:
      'Tu apprécies un lien vivant où l\'argent circule sans se compter à chaque geste. À garder en tête : une règle de compte se dit à voix haute — elle se devine rarement, et l\'attente pèse sur l\'autre.',
    equilibre:
      'Nommer une seule règle de compte commun, avant le prochain coup de cœur. Non parce que dépenser serait un problème, mais parce qu\'un élan se vit mieux quand l\'autre peut le lire.',
  },

  // CARTE-3.4-RAISONNE — Le·La Collectionneur raisonné : dépenser par choix,
  // et la règle qui écrit toute seule (dépensier × calculé).
  'CARTE-3.4-RAISONNE': {
    intro:
      'Ton archétype révèle une personne qui dépense avec intention. Les envies te prennent — mais tes achats se comparent, se chiffrent, se décident à froid. Tes comptes se lisent au jour le jour. Ton point de vigilance : la règle écrit parfois toute seule, et l\'autre n\'y a plus de ligne.',
    devise: 'Je dépense par choix — pas par glissade.',
    apportes:
      'Une maison où les décisions se comprennent : les gros achats se préparent, les comptes se suivent, les surprises se réduisent. Avec toi, l\'avenir proche a des repères — et des envies assumées.',
    freines:
      'Les achats impulsifs des autres, les justifications à fournir, les dépenses sans raison nommée. Ce ne sont pas des défauts — juste ce qui émerge quand l\'intention porte toute la décision.',
    couple:
      'Tu apprécies un lien où l\'argent se parle sans drame : des raisons, des projets, des lignes claires. À garder en tête : ton argument convainc — et l\'autre a une raison qui vaut la tienne.',
    equilibre:
      'Laisser l\'autre écrire une ligne de la règle commune, dès le prochain achat. Non parce que tes raisons seraient mauvaises, mais parce qu\'une règle écrite à deux tient mieux qu\'une règle convaincue.',
  },

  // CARTE-3.4-FLAIR — Le·La Flair du futé : le non rapide, l'oui au bon
  // instant, et la raison qui suit (économe × spontané).
  'CARTE-3.4-FLAIR': {
    intro:
      'Ton archétype révèle une personne aux décisions rapides et à l\'argent posé. Tu sais dire non sur le moment, et oui au bon instant. Sans feuille de route — juste un flair qui garde la maison légère. Ton point de vigilance : ton non arrive avant ses raisons, et il se lit comme une porte.',
    devise: 'Je dis non vite — et oui au vrai moment.',
    apportes:
      'Un argent qui dort tranquille et une maison sans calculs lourds. Avec toi, les envies se tranchent vite — et les bonnes occasions ne passent pas deux fois.',
    freines:
      'Les décisions préparées, les comparaisons longues, les achats qui demandent la nuit. Ce ne sont pas des défauts — juste ce qui émerge quand le flair tranche avant d\'expliquer.',
    couple:
      'Tu apprécies un lien léger, où l\'argent ne pèse pas les gestes. À garder en tête : ton non rapide se lit d\'abord comme une porte fermée — la raison qui suit arrive souvent trop tard.',
    equilibre:
      'Dire ce que ton non protège, au moment où tu le dis. Non parce que ton flair serait à corriger, mais parce qu\'un verdict deviné blesse plus qu\'un non expliqué.',
  },

  // CARTE-3.4-BIEN-TENUE — Le·La Maison bien tenue : garder, lire, financer —
  // et le cadre qui peut fermer une porte (économe × calculé).
  'CARTE-3.4-BIEN-TENUE': {
    intro:
      'Ton archétype révèle une personne qui garde et qui lit. L\'euro non dépensé dort tranquille, tes achats passent à froid, tes comptes se lisent chaque jour. Ta maison tient — la sécurité se respire en entrant. Ton point de vigilance : le cadre protège, et il peut fermer une porte que l\'autre voulait ouvrir.',
    devise: 'Ce qui se garde dure — et ça se lit.',
    apportes:
      'Une sécurité réelle : les fins de mois tiennent, les projets se financent, l\'imprévu ne renverse rien. Avec toi, on construit sur du solide — et ça se sent dès le seuil franchi.',
    freines:
      'Les dépenses d\'envie non planifiées, les comptes qu\'on découvre au fil de l\'eau, les projets sans repères. Ce ne sont pas des défauts — juste ce qui émerge quand la tenue du cadre passe avant tout.',
    couple:
      'Tu apprécies un lien où demain se prépare : une épargne, des projets financés, des choses tenues. À garder en tête : une envie de l\'autre se reçoit comme une invitation — pas comme une demande de permission.',
    equilibre:
      'Ouvrir une enveloppe d\'envies à deux, où le désir a sa place réservée. Non parce que ton cadre serait trop serré, mais parce qu\'un désir qui passe pour une faute finit par se taire.',
  },

  // CARTE-3.4-SAISONS — Le·La Marée des mois : changer de tempo avec les
  // saisons, et la règle du mois qui s'annonce (central).
  'CARTE-3.4-SAISONS': {
    intro:
      'Ton archétype révèle une personne qui change de tempo avec les saisons. Selon les mois, tu laisses dormir ou tu craques, tu compares ou tu décides sur place. Ton argent ne vote ni cœur ni calcul. Ton point de vigilance : ta règle du mois se lit à l\'extérieur — elle se devine rarement.',
    devise: 'Mon tempo suit la saison — et je le dis.',
    apportes:
      'Une souplesse qui épouse les mois : la saison des envies comme la saison des économies. Avec toi, le budget respire entre deux rythmes, sans se déchirer.',
    freines:
      'Les règles qui ne bougent pas, les semaines identiques, les cases à remplir pareil chaque mois. Ce ne sont pas des défauts — juste ce qui émerge quand ta règle change plus vite qu\'elle ne s\'annonce.',
    couple:
      'Tu apprécies un lien qui suit les saisons sans les subir. À garder en tête : ta règle du mois se dit en trois mots — l\'autre ne la devine pas à ta place.',
    equilibre:
      'Donner un mot d\'avance sur ta règle du mois, dès qu\'elle change. Non parce que ta souplesse poserait problème, mais parce qu\'un tempo annoncé se partage sans devinettes.',
  },
};
