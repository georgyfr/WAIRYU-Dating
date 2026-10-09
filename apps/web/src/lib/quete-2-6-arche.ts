/**
 * Archétypes de la quête 2.6 — Tes priorités pour les 5 prochaines années
 * (Monde 3 « La Boussole »).
 *
 * Même gabarit que la quête 1.1 (Task 35) : chaque type est écrit à la 2ᵉ
 * personne, SIMPLE ET LITTÉRAL, dans les 6 champs — intro (« Ton archétype
 * révèle une personne qui… » + point de vigilance), devise, « Ce que tu
 * apportes », « Ce qui peut te freiner » (refermé sur « Ce ne sont pas des
 * défauts — juste ce qui émerge quand… »), « En couple » (« À garder en
 * tête : … »), « Ton équilibre » (un geste + « Non parce que…, mais parce
 * que… »).
 *
 * Ancrage : les cartes VERBATIM (nom, lumière, ombre, tension) restent dans
 * quete-2-6.ts ; ces textes s'appuient sur le corps des cartes (cartes.yaml)
 * et les 4 profils types du 07-miroir.md (MR-26-PRI-CAR / FAM / EQU / LIB —
 * dont la friction documentée n°1, carrière × famille, citée comme fait des
 * cinq premières années, JAMAIS prophétisée) — RÉÉCRITS, jamais recopiés :
 * aucun segment ≥ 60 caractères n'est repris tel quel du miroir.
 *
 * Doctrine (mission V8.B) : la partition des profils suit la dominance
 * marquée — les dominances d'ANCRAGE (stabilité, projets personnels) sont
 * une posture de socle, JAMAIS un non-choix : le gabarit équilibré les
 * accueille (« poser le socle sans en faire une bannière »). Aucun horizon
 * n'est « mûr » ou « égoïste » ; l'ombre nomme le coût EN COUPLE de ce que
 * la répartition écarte, en registre probabiliste, jamais un jugement du
 * choix. Aucune mention de l'écart à l'autre (SIG-2.6-01/02/03 sans trace).
 * Jamais un diagnostic, jamais une étiquette clinique, aucun palier flatté
 * ni blâmé.
 *
 * Typo : apostrophe ASCII uniquement, phrases ≤ 22 mots.
 */
import type { ArchetypeCarte } from './quetes-plus';
import type { VarianteId26 } from './quete-2-6';

export const ARCHES_2_6: Record<VarianteId26, ArchetypeCarte> = {
  // CARTE-2.6-GRUE — carrière-dominant : le chantier de décennie, et la maison qui attend.
  'CARTE-2.6-GRUE': {
    intro:
      "Ton archétype révèle une personne qui a un chantier pour sa décennie. Tu es de celles et ceux qui mettent leur énergie là où elle se double : le travail avance, et tu le sais. Ta répartition se lit comme une grue qui monte, charge après charge. Ton point de vigilance : le chantier qui monte laisse parfois la maison sans lumière.",
    devise: 'Je mets mes points là où ils se doublent : mon chantier avance.',
    apportes:
      "Un horizon nommé : la maison avance vers quelque chose de visible, et l'autre peut lire le cap. Ta déclaration de décennie rend les plans lisibles — on peut s'y appuyer, ou en débattre, mais personne ne devine dans le brouillard.",
    freines:
      "Les détours, l'imprévu, la place assise qui manque quand le chantier déborde. Ce ne sont pas des défauts — juste ce qui émerge quand l'énergie se règle sur les lancements.",
    couple:
      "Tu apprécies un lien qui avance vers quelque chose : des projets nommés, des étapes franchies à deux. À garder en tête : la friction entre ton chantier et un foyer dominant est documentée des cinq premières années — elle se parle mieux tôt que tard.",
    equilibre:
      "Garder un rendez-vous hebdomadaire qui ne se déplace pas pour le travail. Non parce que le chantier serait mauvais, mais parce qu'une réussite se raconte mieux à deux qu'en solo.",
  },

  // CARTE-2.6-NID — famille-dominant : la place faite au lien, et la part propre en veille.
  'CARTE-2.6-NID': {
    intro:
      "Ton archétype révèle une personne qui construit un nid. Tu es de celles et ceux qui font de la place — pour un enfant, ou pour ceux qui sont là. Un choix assumé, pas un repli : le foyer est ton chantier de décennie. Ton point de vigilance : le nid absorbe, y compris ta part propre.",
    devise: "Je fais de la place : c'est là que les vies grandissent.",
    apportes:
      "Des repères qui changent des vies : un nid, des rituels, des gens qui grandissent dedans. La place que tu donnes revient souvent multipliée — autour de toi, on sait qu'on a de la place.",
    freines:
      "Les soirées de gestion, la part propre mise en veille, l'épuisement qui arrive tard et sans prévenir. Ce ne sont pas des défauts — juste ce qui émerge quand le foyer absorbe tout le reste.",
    couple:
      "Tu apprécies un lien qui bâtit du quotidien : des arbitrages partagés, une vie qui se règle à deux. À garder en tête : l'autre peut devenir co-équipier avant d'être la personne choisie — garde une part qui ne relève pas de la gestion.",
    equilibre:
      'Garder un projet à toi, vivant et daté. Non parce que le foyer manquerait de quoi que ce soit, mais parce que le foyer y gagne deux personnes entières.',
  },

  // CARTE-2.6-MAISON — équilibré (répartition large OU ancrage) : la tenue, et le cap qui manque.
  'CARTE-2.6-MAISON': {
    intro:
      "Ton archétype révèle une personne qui tient la maison aux cinq pièces. Tu es de celles et ceux qui répartissent sans faire de course — ou qui posent le socle sans en faire une bannière. Ta décennie se règle sur la tenue : chacune des pièces est chauffée. Ton point de vigilance : rien n'explose, mais rien ne décolle.",
    devise: 'Je bâtis en tenant : ma décennie se règle sur la durée.',
    apportes:
      "Une tenue rare : rien ne déborde chez toi, et tout respire. Les gens s'appuient sur ta répartition comme sur un socle — elle tient les années, même chargées.",
    freines:
      "Les caps prononcés, l'audace qui demande un débordement, les chantiers qui s'élèvent. Ce ne sont pas des défauts — juste ce qui émerge quand l'équilibre protège aussi contre les courants d'air.",
    couple:
      "Tu apprécies un lien régulier, une vie qui ne siffle pas d'alerte. À garder en tête : l'autre peut s'ajuster à un plan qui garde ses distances avec l'audace — un horizon qui déborde de l'année donne un cap à la maison.",
    equilibre:
      "Choisir un horizon qui déborde de l'année, et lui donner une vraie fenêtre. Non parce que la tenue serait insuffisante, mais parce que l'équilibre y gagne un cap qui l'élève.",
  },

  // CARTE-2.6-COMPAS — liberté-dominant : le sac léger, et le campement qui attend.
  'CARTE-2.6-COMPAS': {
    intro:
      "Ton archétype révèle une personne qui pointe l'horizon. Tu es de celles et ceux qui préfèrent les histoires aux habitudes : partir, bouger, découvrir sans tout verrouiller. Ces cinq années sont celles du sac léger. Ton point de vigilance : la route qui appelle laisse parfois quelqu'un au campement.",
    devise: 'Je pars léger : les histoires pèsent moins que les habitudes.',
    apportes:
      "Une vie pleine de récits : avec toi, personne ne s'ennuie sur la route. Tu rends le mouvement désirable — et les années y gagnent des vues qu'aucun plan n'aurait offertes.",
    freines:
      "Les agendas posés, les projets qui s'ajournent, les témoins qui manquent aux beaux souvenirs. Ce ne sont pas des défauts — juste ce qui émerge quand le sac se pose rarement.",
    couple:
      "Tu apprécies un lien qui voyage : des étapes partagées, des récits communs. À garder en tête : les agendas parallèles s'installent fréquemment avant qu'on les ait nommés — laisse l'autre poser une étape du voyage.",
    equilibre:
      "Laisser l'autre choisir une étape, et la vivre à son rythme. Non parce que ta liberté serait un problème, mais parce qu'un témoin rend les routes plus grandes.",
  },
};
