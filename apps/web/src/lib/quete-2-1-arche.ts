/**
 * Archétypes de la quête 2.1 — Tes valeurs (Monde 3 « La Boussole »).
 *
 * Même gabarit que la quête 1.4 (Task 35) : chaque type est écrit à la 2ᵉ
 * personne, SIMPLE ET LITTÉRAL, dans les 6 champs — intro (« Ton archétype
 * révèle une personne qui… » + point de vigilance), devise, « Ce que tu
 * apportes », « Ce qui peut te freiner » (refermé sur « Ce ne sont pas des
 * défauts — juste ce qui émerge quand… »), « En couple » (« À garder en
 * tête : … »), « Ton équilibre » (un geste + « Non parce que…, mais parce
 * que… »).
 *
 * Ancrage : les cartes VERBATIM (nom, lumière, ombre, tension) restent dans
 * quete-2-1.ts ; ces textes s'appuient sur le corps des cartes (cartes.yaml,
 * charte C1-C11 — mission VAGUE 5) et les briques du 07-miroir.md (MR-21-OUV/
 * AFF/CON/DEP-A « par l'exemple » · -B « par le mécanisme » — TA LUMIÈRE /
 * TON OMBRE EN COUPLE / TA TENSION / MINI-RES) — RÉÉCRITS, jamais recopiés :
 * aucun segment ≥ 60 caractères n'est repris tel quel du miroir. Doctrine du
 * Livrable respectée : les 4 blocs se valent (structure circulaire — aucun
 * bloc dressé en idéal, aucune barre légère blâmée), l'ombre nomme une
 * conséquence du mouvement du type — jamais un défaut ni un jugement moral ;
 * registre probabiliste (jamais le futur certain sur l'autre). Les noms de
 * valeurs et le framework public restent moteur seul (C3, verrou de citation).
 *
 * Typo : apostrophe ASCII uniquement, phrases ≤ 22 mots.
 */
import type { ArchetypeCarte } from './quetes-plus';
import type { VarianteId21 } from './quete-2-1';

export const ARCHES_2_1: Record<VarianteId21, ArchetypeCarte> = {
  // CARTE-2.1-OUV-APA — Le·La Passeur·se d'horizons : le neuf appelé sans
  // urgence, et ce qui dure qui attend son tour (bloc ouverture, apaisée).
  'CARTE-2.1-OUV-APA': {
    intro:
      'Ton archétype révèle une personne qui avance vers ce qu\'elle ne connaît pas encore — et qui sait y emmener les autres. L\'inconnu t\'appelle sans te presser : tu goûtes le neuf sans y brûler ta vie. Ton point de vigilance : quand le neuf fait la loi, ce qui dure finit par attendre.',
    devise: 'J\'emmène la vie ailleurs — et les gens avec.',
    apportes:
      'Les premières fois : la route jamais prise, la ville jamais vue, la sortie jamais tentée. Avec toi, la vie à deux ne s\'encroûte pas — le renouveau arrive les samedis ordinaires, pas seulement les anniversaires.',
    freines:
      'Les habitudes qui durent, les choses à finir, les gens qui aiment rester. Ce ne sont pas des défauts — juste ce qui émerge quand l\'appel du neuf déplace ton attention.',
    couple:
      'Tu apprécies un lien qui bouge : des projets neufs, des lieux à découvrir, des idées à deux. À garder en tête : l\'ordinaire n\'est pas une faute — dis-le quand tu l\'aimes, sinon il devient ton ennui silencieux.',
    equilibre:
      'Garder un rituel et changer une chose dans le même mois — et nommer les deux à voix haute. Non parce que le neuf serait meilleur, mais parce qu\'un lien tient par ses deux moteurs.',
  },

  // CARTE-2.1-OUV-TEN — Le·La Collectionneur·se de commencements : la vie par
  // débuts, et les fins qui patientent (bloc ouverture, tendue).
  'CARTE-2.1-OUV-TEN': {
    intro:
      'Ton archétype révèle une personne qui vit par commencements. Le nouveau t\'appelle et tu réponds : sorties inconnues, occasions saisies à la volée, décisions tranchées par toi. Rester immobile, pour toi, ressemble à reculer. Ton point de vigilance : beaucoup de commencements finissent en moitié.',
    devise: 'Je commence beaucoup — et je veux que ça compte.',
    apportes:
      'Un élan qui déloge : rien ne s\'encroûte quand tu es là. Tu ouvres la marche — les autres suivent plus rassurés que s\'ils devaient décider seuls.',
    freines:
      'Ce qui demande de la durée, les fins de chantier, les comptes rendus. Ce ne sont pas des défauts — juste ce qui émerge quand commencer pèse plus que finir.',
    couple:
      'Tu apprécies une relation vivante, où rien ne se fige et tout se retente. À garder en tête : l\'autre a besoin de vous voir finir quelque chose ensemble — un projet achevé rassure plus que trois promis.',
    equilibre:
      'Choisir un commencement et lui donner une fin datée avant d\'ouvrir le suivant. Non parce que bouger serait un problème, mais parce qu\'une moitié laissée pèse plus lourd qu\'un début.',
  },

  // CARTE-2.1-AFF-APA — Le·La Bâtisseur·se de ponts : le cap visible, et les
  // autres à côté et pas derrière (bloc affirmation, apaisée).
  'CARTE-2.1-AFF-APA': {
    intro:
      'Ton archétype révèle une personne qui vise des résultats visibles — sans tourner au solo. Tu décides, tu construis, et tu laisses des ponts derrière toi : diriger, chez toi, ressemble à organiser. Ton point de vigilance : vérifie que les autres marchent à côté de toi, pas seulement derrière.',
    devise: 'Je mène pour faire ensemble — pas pour faire seul.',
    apportes:
      'Chez toi, ça se voit : les projets aboutissent, les décisions se prennent, les semaines avancent. Avec toi, l\'avenir se construit au présent — et personne n\'est relégué au rôle de spectateur.',
    freines:
      'Les projets qui n\'aboutissent pas, les groupes sans cap, les heures sans production. Ce ne sont pas des défauts — juste ce qui émerge quand le visible demande sa part à chaque instant.',
    couple:
      'Tu apprécies un lien où l\'on construit : des plans communs, des preuves, des jalons. À garder en tête : la place de l\'autre se négocie, elle ne se décrète pas — pose la question avant ta proposition.',
    equilibre:
      'Sur le prochain choix commun, poser ta question avant ta proposition. Non parce que ton cap serait mauvais, mais parce qu\'une décision qui se partage tient mieux qu\'une décision qui se livre.',
  },

  // CARTE-2.1-AFF-TEN — Le·La Ventouse à projets : l'énergie là où ça se
  // mesure, et les gens en arrière-plan (bloc affirmation, tendue).
  'CARTE-2.1-AFF-TEN': {
    intro:
      'Ton archétype révèle une personne qui vit par projets. Tu vises, tu décides, tu avances : ton énergie va là où ça se mesure, et le prochain objectif t\'attend déjà. Tu ne connais pas le temps mort. Ton point de vigilance : les gens peuvent devenir l\'arrière-plan du programme.',
    devise: 'J\'avance — et je veux que les miens avancent avec moi.',
    apportes:
      'Un moteur qui entraîne : là où tu passes, ça se décide et ça se fait. Ton cap protège le foyer des jours sans direction — beaucoup de vies s\'essoufflent faute de cela.',
    freines:
      'Les temps morts, la détente sans but, les gens qui n\'avancent pas. Ce ne sont pas des défauts — juste ce qui émerge quand le programme porte toute la valeur du jour.',
    couple:
      'Tu apprécies un lien qui avance avec toi : des objectifs partagés, des étapes célébrées. À garder en tête : ceux qui t\'aiment ne sont pas une salle d\'attente — l\'heure à deux se défend contre le prochain objectif.',
    equilibre:
      'Protéger une heure commune, bloquée avant que les objectifs ne la réservent. Non parce que tes projets comptent moins, mais parce que les gens ne rattrapent jamais le programme parti sans eux.',
  },

  // CARTE-2.1-CON-APA — L'Ancre qui regarde ailleurs : la stabilité choisie,
  // et l'inconnu accueilli sans panique (bloc conservation, apaisée).
  'CARTE-2.1-CON-APA': {
    intro:
      'Ton archétype révèle une personne qui choisit sa stabilité. Tu aimes ce qui règle la vie — les rythmes, les repères, les habitudes qui tiennent. Et l\'inconnu, quand il passe, te trouve debout. Ton point de vigilance : le socle peut devenir siège.',
    devise: 'Je reste posé — par choix, pas par défaut.',
    apportes:
      'Une prévisibilité tranquille : chez toi, la maison respire et les rendez-vous ont une date. Avec toi, on sait où poser les pieds — le calme est contagieux.',
    freines:
      'Les départs à improviser, les semaines qui changent de forme, le désordre assumé. Ce ne sont pas des défauts — juste ce qui émerge quand le repos aime ce qui reste en place.',
    couple:
      'Tu apprécies un lien posé : des habitudes à deux, des rendez-vous qui tiennent, une maison qui sent le repéré. À garder en tête : demande-toi parfois si tu restes par choix ou par habitude.',
    equilibre:
      'Accueillir un imprévu sans le ranger dans la case du désordre. Non parce que le cadre serait mauvais, mais parce qu\'un socle sert aussi à partir.',
  },

  // CARTE-2.1-CON-TEN — L'Enraciné·e vigilant·e : ce qui dure rassure, et la
  // garde du socle peut fermer (bloc conservation, tendue).
  'CARTE-2.1-CON-TEN': {
    intro:
      'Ton archétype révèle une personne qui entretient ce qu\'elle a reçu. Une vie réglée, des repères tenus, des héritages non reniés : ce que tu construis ressemble à du solide. Ton point de vigilance : ce que tu tiens trop fort finit par te tenir.',
    devise: 'Je garde ce qui compte — et je sais pourquoi.',
    apportes:
      'Une continuité qui tient : la maison parle la même langue d\'une saison à l\'autre. Le lien, chez toi, a une histoire sans trou — tu transmets un sol où bâtir.',
    freines:
      'Les épices qui changent la recette, les façons de faire neuves, les dates qui bougent. Ce ne sont pas des défauts — juste ce qui émerge quand la garde du socle devient une garde rapprochée.',
    couple:
      'Tu apprécies un lien où l\'essentiel ne se rediscute plus : des rituels, des repères, une histoire. À garder en tête : le changement se négocie mieux comme un droit que comme une exception.',
    equilibre:
      'Choisir un rituel que tu défends — et un que tu offres au changement. Non parce que tenir serait un problème, mais parce que garder tout finit par ne plus garder rien.',
  },

  // CARTE-2.1-DEP-APA — L'Aiguilleur·se du cœur : le soin en ligne droite, et
  // le don qui se choisit (bloc dépassement, apaisée).
  'CARTE-2.1-DEP-APA': {
    intro:
      'Ton archétype révèle une personne qui met les autres avant son programme. Prendre soin, chez toi, n\'est pas un détour : c\'est la ligne droite. Et devant une façon de vivre différente, tu cherches à comprendre avant de juger. Ton point de vigilance : vérifie que tu donnes par envie, et pas par devoir devenu habitude.',
    devise: 'Je vois la demande avant qu\'elle soit dite.',
    apportes:
      'Chez toi, la différence s\'accueille avant de se juger, et ton cercle s\'élargit sans se vider. Avec toi, personne n\'a besoin de crier pour être entendu.',
    freines:
      'Les programmes tenus, les repos revendiqués, les demandes formulées trop tard. Ce ne sont pas des défauts — juste ce qui émerge quand le soin occupe toute la place.',
    couple:
      'Tu apprécies un lien où s\'occuper l\'un de l\'autre est la norme : des besoins devinés, des différences accueillies. À garder en tête : un compte que l\'un tient et que l\'autre ignore finit par sortir — dis tes besoins à voix haute.',
    equilibre:
      'Formuler une demande pour toi, cette semaine — et l\'accueillir comme celles des autres. Non parce que les autres comptent moins, mais parce qu\'un don sans retour devient une dette.',
  },

  // CARTE-2.1-DEP-TEN — Le·La Phare qui s'oublie : éclairer large, et son
  // propre cap qui se brouille (bloc dépassement, tendue).
  'CARTE-2.1-DEP-TEN': {
    intro:
      'Ton archétype révèle une personne qui éclaire large. Les gens comptent avant les programmes, la différence ne te fait pas reculer. Ta loyauté va loin : il y a, chez toi, quelqu\'un à aider à chaque horizon. Ton point de vigilance : à force de passer après, ton propre cap se brouille.',
    devise: 'Je donne beaucoup — sans m\'effacer du rivage.',
    apportes:
      'Ton foyer n\'est pas une forteresse : c\'est une porte, et elle s\'ouvre grand. La culture de l\'autre, sa famille, ses habitudes : tout ça trouve de la place chez toi.',
    freines:
      'Ton programme du jour, tes propres caps, les heures sans personne à aider. Ce ne sont pas des défauts — juste ce qui émerge quand tout le monde passe avant toi.',
    couple:
      'Tu apprécies un lien généreux, ouvert sur les familles, les amis, les causes. À garder en tête : le temps à deux glisse dans les interstices — une heure protégée vaut tous les services rendus.',
    equilibre:
      'Bloquer une heure par semaine pour vous deux — et la tenir comme un rendez-vous d\'aide. Non parce que donner serait un problème, mais parce qu\'un phare, lui aussi, a besoin de rivage.',
  },
};
