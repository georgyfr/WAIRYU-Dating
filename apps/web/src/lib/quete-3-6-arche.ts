/**
 * Archétypes de la quête 3.6 — Le choix visuel (Monde 4 « Ton Terrain »).
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
 * quete-3-6.ts ; ces textes s'appuient sur le corps des cartes (cartes.yaml,
 * format etage_1_carte_briseglace) et les briques du 07-miroir.md (MR-36-VIS-
 * ANCRE / EQUILIBRE / HORIZON — TA LUMIÈRE / TON OMBRE EN COUPLE / TA TENSION /
 * MINI-RES) — RÉÉCRITS, jamais recopiés : aucun segment ≥ 60 caractères n'est
 * repris tel quel du miroir. Doctrine du Livrable respectée : l'ancre et
 * l'horizon sont égaux en dignité (trois teintes, aucune normée — aucun pôle
 * dressé en idéal), l'ombre nomme une conséquence du mouvement du type —
 * jamais un défaut ni un jugement moral ; registre probabiliste (suggère,
 * oriente souvent — jamais « révèle que tu es », jamais le futur certain sur
 * l'autre). MESURE FAIBLE : ces archétypes restent des teintes d'images
 * choisies — jamais une lecture psychologique, jamais un trait. AUCUNE trace
 * de la lecture complémentaire P6 (Arbitrage 4 — signal_id null). Les codes,
 * sigles et seuils (VISO_ANC, SIG-3.6-01/02) restent moteur seul (C3).
 *
 * Typo : apostrophe ASCII uniquement, phrases ≤ 22 mots.
 */
import type { ArchetypeCarte } from './quetes-plus';
import type { VarianteId36 } from './quete-3-6';

export const ARCHES_36: Record<VarianteId36, ArchetypeCarte> = {
  // CARTE-3.6-ANCRE — Le·La Portefeuille d'images posées : des lieux qui te
  // portent, et une fenêtre qui mérite du vent (lecteur ancré-dominant).
  'CARTE-3.6-ANCRE': {
    intro:
      'Ton archétype révèle une personne qui choisit des lieux qui te portent : la maison, la stabilité, le café lent, le dimanche cadencé. Tes images penchent au repos, et ça se lit d\'emblée. Ton point de vigilance : une ancre qui ne bouge plus peut peser — garde une image dehors.',
    devise: 'Je choisis ce qui me porte — et je sais pourquoi.',
    apportes:
      'Un socle qui se voit : chez toi, les rituels tiennent et la maison respire. Avec toi, on sait où est la base — les départs sont plus faciles quand un retour existe.',
    freines:
      'Les programmes qui changent sans prévenir, les déménagements annoncés, les semaines sans point fixe. Ce ne sont pas des défauts — juste ce qui émerge quand le repos aime ce qui reste en place.',
    couple:
      'Tu apprécies un lien qui a une adresse : des habitudes à deux, des rituels tenus, une table qui t\'attend. À garder en tête : laisse la fenêtre entrouverte — l\'autre a besoin de vent, parfois.',
    equilibre:
      'Garder ton rituel — et en ouvrir un dehors, une fois par mois, choisi ensemble. Non parce que l\'ancre serait un problème, mais parce qu\'un chez-soi sert aussi à partir.',
  },

  // CARTE-3.6-EQUILIBRE — Le·La Trousse d'images variées : deux couleurs de
  // semaines, et une teinte qui gagne à être dite (lecteur équilibre).
  'CARTE-3.6-EQUILIBRE': {
    intro:
      'Ton archétype révèle une personne qui navigue entre le calme et l\'air libre sans y perdre son fil. Tes images se partagent — tantôt la maison, tantôt le dehors — et la teinte change avec la semaine. Ton point de vigilance : ta variété se lit mal — dis l\'image du moment.',
    devise: 'Je change de paysage — sans changer de cap.',
    apportes:
      'Deux couleurs de week-ends : le festin et le repas sobre, la tribu et le tête-à-tête. Avec toi, la vie à deux ne s\'installe pas dans un seul décor — et ça protège des routines.',
    freines:
      'Les projets qui demandent une seule ligne, les gens qui aiment prévoir, les semaines trop remplies pour varier. Ce ne sont pas des défauts — juste ce qui émerge quand deux envies tirent sur la même journée.',
    couple:
      'Tu apprécies un lien qui accepte tes deux vitesses : rester et bouger. À garder en tête : l\'autre ne devine pas — dis si tu veux rester, ou si le dehors t\'appelle aujourd\'hui.',
    equilibre:
      'Annoncer ton image de la semaine dès le dimanche — rester ou sortir, un mot suffit. Non parce que varier serait un problème, mais parce qu\'une teinte dite se partage mieux.',
  },

  // CARTE-3.6-HORIZON — Le·La Portefeuille d'images ouvertes : des lieux où
  // le monde entre, et un retour qui se choisit aussi (lecteur horizon).
  'CARTE-3.6-HORIZON': {
    intro:
      'Ton archétype révèle une personne qui choisit des lieux où le monde entre. La terrasse, le festin, le groupe, la ville qui bouge. Tes images penchent dehors, et ça se raconte tout seul. Ton point de vigilance : l\'horizon dépense — garde une image dedans pour le retour.',
    devise: 'Je sors au-devant du monde — et je le ramène.',
    apportes:
      'Des sorties qui s\'improvisent et des tables qui s\'élargissent : le monde entre chez toi. Avec toi, une semaine plate redevient une histoire — tu sais où passent les bons moments.',
    freines:
      'Les soirées dedans, les dimanches sans programme, les gens qui rentrent tôt. Ce ne sont pas des défauts — juste ce qui émerge quand l\'appel du dehors oriente tes journées.',
    couple:
      'Tu apprécies un lien qui bouge : des lieux à découvrir, des invités à table, des matins qui partent. À garder en tête : quelqu\'un a besoin de rentrer — laisse exister un cocon à deux.',
    equilibre:
      'Poser une soirée dedans, à date fixe, et la tenir comme un rendez-vous. Non parce que le dehors serait un problème, mais parce qu\'un retour se prépare — il ne se subit pas.',
  },
};
