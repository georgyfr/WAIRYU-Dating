/**
 * Archétypes de la quête 3.1 — Ton rythme de vie (Monde 4 « Ton terrain »).
 *
 * Même gabarit que les quêtes 1.4/2.1 (Task 35) : chaque type est écrit à la
 * 2ᵉ personne, SIMPLE ET LITTÉRAL, dans les 6 champs — intro (« Ton archétype
 * révèle une personne qui… » + point de vigilance), devise, « Ce que tu
 * apportes », « Ce qui peut te freiner » (refermé sur « Ce ne sont pas des
 * défauts — juste ce qui émerge quand… »), « En couple » (« À garder en
 * tête : … »), « Ton équilibre » (un geste + « Non parce que…, mais parce
 * que… »).
 *
 * Ancrage : les cartes VERBATIM (nom, lumière, ombre, tension) restent dans
 * quete-3-1.ts ; ces textes s'appuient sur le corps des cartes (cartes.yaml,
 * charte C1-C11 — mission VAGUE 5) et les briques du 07-miroir.md
 * (MR-31-RYT-MATINALE « l'heure du lever » · MR-31-RYT-ENTRE-DEUX « l'heure
 * qui glisse » · MR-31-RYT-NOCTURNE « l'heure des calmes » — TA LUMIÈRE /
 * TON OMBRE EN COUPLE / TA TENSION / MINI-RES) — RÉÉCRITS, jamais recopiés :
 * aucun segment ≥ 60 caractères n'est repris tel quel du miroir. Doctrine du
 * Livrable respectée : les trois rythmes se valent (le matinal n'est pas
 * « discipliné », le nocturne n'est pas « paresseux », l'entre-deux n'est pas
 * « mou » — interdits de rendu au 04, verrou 4), l'ombre nomme une
 * conséquence du mouvement du rythme — jamais un défaut ni un jugement moral ;
 * registre probabiliste (jamais le futur certain sur l'autre, jamais
 * « vos rythmes sont incompatibles », aucune asymétrie). Le badge 🌅/🦉 des
 * extrêmes est un pont de conversation, jamais un grade. Le concept public
 * (chronotype) et toute matinalité chiffrée restent moteur seul (C2/C3).
 *
 * Typo : apostrophe ASCII uniquement, phrases ≤ 22 mots.
 */
import type { ArchetypeCarte } from './quetes-plus';
import type { VarianteId31 } from './quete-3-1';

export const ARCHES_31: Record<VarianteId31, ArchetypeCarte> = {
  // CARTE-3.1-PREMIER-TRAIN — Le·La Premier train : les heures fortes avant
  // le bruit du monde, et un soir qui ferme plus tôt (matinal, badge 🌅).
  'CARTE-3.1-PREMIER-TRAIN': {
    intro:
      'Ton archétype révèle une personne qui vit ses meilleures heures avant le réveil du monde. Le matin t\'appartient : la tête claire, les idées en marche, la journée déjà commencée en toi. Ton point de vigilance : ta soirée peut fermer avant que quelqu\'un y entre.',
    devise: 'Je vis mes heures fortes au lever — et j\'aime ça.',
    apportes:
      'Des matinées pleines : là où d\'autres se réveillent à peine, toi tu avances. Avec toi, un projet du matin avance vite — et les journées commencent tôt, calmement.',
    freines:
      'Les dîners qui s\'étirent, les soirées spontanées, les lendemains de veillée. Ce ne sont pas des défauts — juste ce qui émerge quand ta journée démarre avant celle de tout le monde.',
    couple:
      'Tu apprécies un quotidien qui commence tôt : des réveils partagés, des matinées à deux, du calme avant le bruit. À garder en tête : le soir de l\'autre peut durer plus longtemps que le tien — laisse-lui sa porte ouverte.',
    equilibre:
      'Protéger ton créneau du matin — et offrir une vraie place à un moment du soir, même court. Non parce que ton matin compterait moins, mais parce qu\'une journée à deux se partage des deux bouts.',
  },

  // CARTE-3.1-MAREE — Le·La Marée entre deux heures : l'énergie qui suit les
  // jours et les saisons, et une heure à soi qui se défend mal (entre-deux,
  // sans badge — décision de production).
  'CARTE-3.1-MAREE': {
    intro:
      'Ton archétype révèle une personne qui s\'ajuste : ton énergie se lève avec le jour et se pose avec le soir. Pas de vote, pas de camp — les deux moments te valent. Les horloges rigides se cassent — la tienne respire. Ton point de vigilance : une horloge souple peut finir sans heure à soi.',
    devise: 'Je glisse — et je sais où me poser.',
    apportes:
      'La disponibilité : là où les agendas rigides se bloquent, toi tu trouves l\'heure qui marche. Avec toi, les imprévus se vivent sans drame — et les compromis se trouvent plus vite.',
    freines:
      'Les heures à défendre, les créneaux à protéger, les envies à déclarer. Ce ne sont pas des défauts — juste ce qui émerge quand s\'adapter est devenu ton réflexe premier.',
    couple:
      'Tu apprécies un lien qui se règle sans longue négociation : tes horaires composent, ils n\'imposent pas. À garder en tête : quelqu\'un doit connaître ton heure à toi — dis-la, elle ne se lit pas toute seule.',
    equilibre:
      'Choisir un créneau fixe qui n\'appartient qu\'à toi — et le garder comme on garde un rendez-vous. Non parce que composer serait mauvais, mais parce qu\'une horloge sans ancre finit par suivre toutes les autres.',
  },

  // CARTE-3.1-LAMPE-MINUITEME — Le·La Lampe de minuit : l'énergie qui se lève
  // avec le calme, et un matin du monde qui démarre tôt (nocturne, badge 🦉).
  'CARTE-3.1-LAMPE-MINUITEME': {
    intro:
      'Ton archétype révèle une personne que la nuit rend à elle-même : quand le monde se calme, ton énergie se met debout. Les idées s\'éclaircissent, les mots se libèrent, les soirées portent. Ton point de vigilance : les agendas du matin ont une longueur d\'avance sur ton horloge.',
    devise: 'Je vis la nuit — et le matin viendra.',
    apportes:
      'Des soirées qui comptent : conversations, projets, tendresse — ce que les journées n\'ont pas eu le temps de donner. Avec toi, la fin de journée ne s\'effondre pas : elle s\'ouvre.',
    freines:
      'Les réveils tôt, les débuts de journée à horaire imposé, les échanges qui tombent avant ton premier café. Ce ne sont pas des défauts — juste ce qui émerge quand ton horloge commence là où celle du monde s\'arrête.',
    couple:
      'Tu apprécies un lien qui respecte ta montée en énergie : des soirées à deux, des fins de journée qui se parlent. À garder en tête : le matin du couple peut se jouer sans toi — demande ta part, même courte.',
    equilibre:
      'Nommer l\'heure où ta journée commence vraiment — et défendre un morceau de matin à ton rythme, même bref. Non parce que la nuit serait meilleure, mais parce qu\'un décalage se vit mieux quand il se dit.',
  },
};
