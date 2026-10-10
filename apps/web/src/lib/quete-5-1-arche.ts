/**
 * Archétypes de la quête 5.1 — Ton style amoureux (Monde 6 « Mon Cœur »).
 *
 * Même gabarit que les quêtes 1.x-4.x : chaque type est écrit à la 2ᵉ
 * personne, SIMPLE ET LITTÉRAL, dans les 6 champs — intro (« Ton archétype
 * révèle une personne qui… » + point de vigilance), devise, « Ce que tu
 * apportes », « Ce qui peut te freiner » (refermé sur « Ce ne sont pas des
 * défauts — juste ce qui émerge quand… »), « En couple » (« À garder en
 * tête : … »), « Ton équilibre » (un geste + « Non parce que…, mais parce
 * que… »).
 *
 * Ancrage : les cartes VERBATIM (nom, lumière, ombre, tension) restent dans
 * quete-5-1.ts ; ces textes s'appuient sur le corps des cartes (cartes.yaml)
 * et les textures du 07-miroir.md (TA LUMIÈRE / TON OMBRE EN COUPLE / TA
 * TENSION / LE MINI-RES) — RÉÉCRITS, jamais recopiés : aucun segment ≥ 60
 * caractères n'est repris tel quel du miroir.
 *
 * NEUTRALITÉ TYPOLOGIQUE STRICTE (doctrine capitale du Livrable) : les six
 * façons d'aimer se valent — la façon discrète n'est pas une façon ratée,
 * la façon marquée n'est pas un idéal, l'excès se joue exclusivement en
 * couple. Aucune hiérarchie, aucun diagnostic, aucune étiquette clinique :
 * l'intensité se décrit en comportements quotidiens. Aucun nom d'atelier de
 * la typologie ni de son auteur — le nommage UI obligatoire s'applique.
 *
 * Typo : apostrophe ASCII uniquement, phrases ≤ 22 mots, « toujours »/
 * « jamais » exclus des textes rendus.
 */
import type { ArchetypeCarte } from './quetes-plus';
import type { VarianteId51 } from './quete-5-1';

export const ARCHES_51: Record<VarianteId51, ArchetypeCarte> = {
  // CARTE-5.1-FLAMME — la flamme qui réorganise, et les mardis qui comptent.
  'CARTE-5.1-FLAMME': {
    intro:
      'Ton archétype révèle une personne qui donne le tempo d\'une histoire entière quand la flamme prend — et qui l\'assume. Ton point de vigilance : un mardi plat n\'est pas la fin du feu — c\'est un jour qui lui ressemble.',
    devise: 'Ma façon d\'aimer est une flamme : quand elle prend, l\'histoire entière s\'éclaire.',
    apportes:
      'Une ardeur qui se sent dès la porte : tu embrases une histoire entière, et l\'autre se sait choisi. Avec toi, les commencements ont le goût des vrais départs — grandioses et vivants.',
    freines:
      'Les jours plats demandent un effort : le calme peut se lire comme une fin du feu. Et l\'autre peut croire qu\'un jour ordinaire ne suffit plus. Ce ne sont pas des défauts — juste ce qui émerge quand on vit en sommets.',
    couple:
      'À garder en tête : nomme un mardi réussi — le feu vit aussi dans les jours ordinaires.',
    equilibre:
      'Habite un jour ordinaire comme un sommet — Non parce que la flamme faiblit, mais parce qu\'un feu qui dure se pose.',
  },
  // CARTE-5.1-PARTIE — l'air qui détend, et la réponse qui reste une réponse.
  'CARTE-5.1-PARTIE': {
    intro:
      'Ton archétype révèle une personne qui met de l\'air à deux : la taquinerie chez toi fait respirer, elle ne fuit pas. Ton point de vigilance : une vraie question appelle une vraie réponse — la blague peut attendre.',
    devise: 'Mon amour est une partie : je joue pour que l\'histoire respire, pas pour gagner.',
    apportes:
      'Une aisance qui détend une pièce entière : avec toi, les premières heures pèsent moins lourd. Les maisons calmes reconnaissent ta façon de faire descendre une tension d\'un ton.',
    freines:
      'La légèreté se lit mal quand l\'autre est sérieux : il peut chercher du sol là où tu mets de l\'air. Et une vraie question repart parfois sans réponse. Ce ne sont pas des défauts — juste ce qui émerge quand le jeu a si bien détendu.',
    couple:
      'À garder en tête : réponds à plat une fois — la question reçue rend la partie plus libre.',
    equilibre:
      'Accueille une question sérieuse sans plaisanter — Non parce que ton jeu trahit, mais parce qu\'une réponse claire sécurise le terrain de jeu.',
  },
  // CARTE-5.1-ROUTE-LONGUE — la durée qui parle, et le mot qui se dit.
  'CARTE-5.1-ROUTE-LONGUE': {
    intro:
      'Ton archétype révèle une personne qui bâtit l\'amour comme un chemin : la conversation d\'abord, la confiance ensuite. Ton point de vigilance : un amour qui tarde à se nommer se vit parfois seul.',
    devise: 'Mon amour est une route longue : ce qui grandit sans se presser tient dans le temps.',
    apportes:
      'Une confiance qui s\'installe sans effort : tu reconnais quelqu\'un à ses jours ordinaires, pas à ses soirs de spectacle. Avec toi, les liens nés lentement portent loin — la durée est ta signature.',
    freines:
      'Le mot peut attendre trop de saisons : ton attachement profond se lit parfois comme de l\'habitude. Et l\'autre doute de ce qui est déjà là. Ce ne sont pas des défauts — juste ce qui émerge quand la durée parle pour toi.',
    couple:
      'À garder en tête : dis le mot qui attend — ce qui est déjà là mérite d\'être entendu.',
    equilibre:
      'Nomme ce qui existe — Non parce que tes gestes ne parlent pas, mais parce qu\'un mot entend vaut mieux qu\'un doute.',
  },
  // CARTE-5.1-BOUSSOLE — le concret qui bâtit, et la case qui se laisse vide.
  'CARTE-5.1-BOUSSOLE': {
    intro:
      'Ton archétype révèle une personne qui donne une adresse à ce qu\'elle vit : les décisions se prennent à deux. Ton point de vigilance : une personne n\'est pas une liste — laisse-la surprendre.',
    devise: 'Mon amour est une boussole : je bâtis des projets qui portent, et je tiens le cap avec l\'autre.',
    apportes:
      'Un sol concret : les horaires se rangent, l\'argent se parle, ce qui est décidé avance. Avec toi, un projet tient debout — les gens se reposent sur ça.',
    freines:
      'La liste rassure et filtre : les rencontres sans case passent à côté, parfois les bonnes. Et l\'autre peut se sentir examiné plutôt que découvert. Ce ne sont pas des défauts — juste ce qui émerge quand bâtir a protégé.',
    couple:
      'À garder en tête : écoute une fois sans cocher — la surprise a aussi son adresse.',
    equilibre:
      'Pose ta liste une soirée — Non parce que tes repères trompent, mais parce que la personne vaut une page blanche.',
  },
  // CARTE-5.1-VIGIE — l'attention qui veille, et la paix qui reste chez soi.
  'CARTE-5.1-VIGIE': {
    intro:
      'Ton archétype révèle une personne qui veille : les horaires, les humeurs du jour, les silences qui changent — rien ne t\'échappe. Ton point de vigilance : ta paix t\'appartient — l\'autre ne la porte pas à ta place.',
    devise: 'Mon amour est une vigie : quand j\'aime, tout le monde le sait, et personne n\'est oublié.',
    apportes:
      'Une présence totale : ton attention fait des abris, on se sent veillé. Avec toi, un changement de ton se remarque dès la première semaine — l\'attention se voit.',
    freines:
      'Qu\'une réponse tarde, l\'esprit s\'emballe : une heure d\'attente devient une heure de scénarios, et l\'autre devient gardien d\'un calme qui fatigue. Ce ne sont pas des défauts — juste ce qui émerge quand la paix dépend d\'un horaire.',
    couple:
      'À garder en tête : garde un rituel d\'apaisement à toi — le gardien a droit à son repos aussi.',
    equilibre:
      'Donne à ta paix plusieurs adresses — Non parce que l\'autre compte moins, mais parce qu\'un appui unique fatigue des deux côtés.',
  },
  // CARTE-5.1-PORT — le soin de première seconde, et la moitié qui reçoit.
  'CARTE-5.1-PORT': {
    intro:
      'Ton archétype révèle une personne qui prend soin sans compter : les besoins se devinent avant les mots. Ton point de vigilance : recevoir est la moitié du chemin — elle s\'apprend.',
    devise: 'Mon amour est un port : les choses tenues portent ma marque, et les tempêtes trouvent un abri.',
    apportes:
      'Une générosité qui se voit de loin : coups de main, attentions discrètes, places cédées. Avec toi, une maison tient debout dans les tempêtes — et on sait où tu es.',
    freines:
      'Le don continu oublie la moitié du chemin : le compte se vide en silence, la fatigue arrive après coup. Et l\'autre peut se sentir redevable de ce qu\'il ne peut porter. Ce ne sont pas des défauts — juste ce qui émerge quand donner a été la première seconde.',
    couple:
      'À garder en tête : demande une chose par semaine — la maison tient mieux quand on y reçoit.',
    equilibre:
      'Reçois sans rendre la monnaie — Non parce que ton soin faiblit, mais parce qu\'un don qui reçoit dure plus longtemps.',
  },
  // CARTE-5.1-PALETTE — les six façons relais, et la règle qui se raconte.
  'CARTE-5.1-PALETTE': {
    intro:
      'Ton archétype révèle une personne qui aime avec plusieurs mains, selon la saison. La passion, le jeu, la durée, les projets, l\'attention, le don — tout se relaie chez toi. Ton point de vigilance : ta règle existe — elle se dit moins vite que ta marée.',
    devise: 'Ma façon d\'aimer est une palette : je passe d\'une main à l\'autre selon la saison.',
    apportes:
      'Une souplesse réelle : tu t\'ajustes aux maisons les plus différentes. Avec toi, personne n\'a à choisir un camp — tu traduis entre les façons d\'aimer.',
    freines:
      'La lecture extérieure ne suit pas à chaque fois : une semaine passionnée, une semaine posée, et l\'autre cherche ta règle du moment. Ce ne sont pas des défauts — juste ce qui émerge quand les saisons changent seules.',
    couple:
      'À garder en tête : dis en un mot de ta saison du moment — l\'autre cherchait justement la porte.',
    equilibre:
      'Explique ta règle du moment — Non parce que tu dois te justifier, mais parce qu\'une marée annoncée se navigue mieux.',
  },
};
