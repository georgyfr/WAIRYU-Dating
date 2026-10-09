/**
 * Archétypes de la quête 2.3 — Tes non-négociables (Monde 3 « La Boussole »).
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
 * quete-2-3.ts ; ces textes s'appuient sur le corps des cartes (cartes.yaml v2,
 * mission VAGUE 5) et les briques du 07-miroir.md (MR-23-NNC-A « par
 * l'exemple » · MR-23-NNC-B « par le mécanisme » — TA LUMIÈRE / TON OMBRE EN
 * COUPLE / TA TENSION / MINI-RES) — RÉÉCRITS, jamais recopiés : aucun segment
 * ≥ 60 caractères n'est repris tel quel du miroir ou des cartes. Doctrine du
 * Livrable respectée : neutralité absolue (aucune coche « sage » ni « fermée »,
 * la liste vide n'est pas un défaut), l'ombre nomme le coût relationnel du
 * choix — jamais un jugement moral ; le mécanisme de filtre côté moteur n'est
 * jamais raconté (04-slots verrou 5). Jamais un diagnostic, jamais une
 * étiquette clinique, aucun palier flatté ni blâmé.
 *
 * Typo : apostrophe ASCII uniquement, phrases ≤ 22 mots.
 */
import type { ArchetypeCarte } from './quetes-plus';
import type { VarianteId23 } from './quete-2-3';

export const ARCHES_2_3: Record<VarianteId23, ArchetypeCarte> = {
  // CARTE-2.3-A — Le·La Confiant·e dans le flou : le cadre ouvert, et les
  // limites découvertes en situation (continuité miroir : brique 0 coche,
  // SIG-2.3-02 — un choix assumé, pas un manque).
  'CARTE-2.3-A': {
    intro:
      'Ton archétype révèle une personne qui laisse la place aux surprises. Tu ne coches presque rien : ton cadre s\'écrit en marchant, au fil des rencontres réelles. Tu donnes aux gens l\'occasion de te surprendre — et ça, beaucoup n\'osent pas le faire. Ton point de vigilance : des limites restées dans le flou finissent par se subir avant d\'être choisies.',
    devise: 'Mon cadre s\'écrit en marchant — je garde la place aux surprises.',
    apportes:
      'Une ouverture qui désarme : sans grille d\'entrée, les gens se montrent entiers, sans cocher des cases. Tu rencontres les personnes avant de les filtrer — des liens naissent là où une liste en aurait fermé la porte.',
    freines:
      'Les arbitrages remis plus tard, les limites découvertes en situation, les tests du réel. Ce ne sont pas des défauts — juste ce qui émerge quand le cadre attend que la vie l\'écrive à ta place.',
    couple:
      'Tu apprécies un lien sans examen d\'entrée : l\'autre se montre entier, sans cocher de cases. À garder en tête : sans limites dites, on finit par les subir avant de les choisir. Pose-les à froid, avant qu\'une histoire ne les pose pour toi.',
    equilibre:
      'Écrire une limite à froid, par écrit, rien que pour toi. Non parce que le cadre ouvert serait un manque, mais parce qu\'une limite choisie protège mieux qu\'une limite subie.',
  },

  // CARTE-2.3-B — Le·La Bâtisseur·se de frontières : les limites posées
  // « pas trop », et la frontière devenue excuse (continuité miroir : la
  // ligne posée à chaud coupe à froid).
  'CARTE-2.3-B': {
    intro:
      'Ton archétype révèle une personne qui bâtit ses frontières à la main. Tu as posé des limites, pas trop : l\'essentiel protégé, le reste laissé à l\'imprévu. Tes cadres disent qui tu es sans tout fermer. Ton point de vigilance : une ligne posée pour éviter la discussion ne protège plus, elle écarte.',
    devise: 'Je sais où je ne négocie pas — et je laisse le reste vivre.',
    apportes:
      'Une clarté rare : les gens savent où tu te tiens, sans deviner ni marcher sur des œufs. Tes limites rendent le reste plus libre — ce qui est ouvert chez toi l\'est vraiment.',
    freines:
      'Les lignes posées à chaud, le soir d\'une déception, et la frontière devenue excuse. Ce ne sont pas des défauts — juste ce qui émerge quand protéger devient un réflexe avant d\'être un choix.',
    couple:
      'Tu apprécies un lien où le non existe des deux côtés, sans drame. À garder en tête : une frontière peut servir d\'excuse — vérifie qu\'elle protège encore, au lieu d\'écarter.',
    equilibre:
      'Relire une ligne rouge avant de la laisser travailler. Non parce que poser des limites serait un défaut, mais parce qu\'une limite à froid tient mieux qu\'une limite à chaud.',
  },

  // CARTE-2.3-C — Le·La Forteresse : la grille pleine, et le bassin qui
  // rétrécit (continuité miroir : la mécanique exécute — coût pour toi ET
  // pour l'autre, nommé sans jugement).
  'CARTE-2.3-C': {
    intro:
      'Ton archétype révèle une personne qui sait exactement où elle ne négocie pas. Tes lignes rouges se comptent, et elles tiennent : tes rencontres démarrent nettes, sans zone grise à débrouiller après coup. Ton point de vigilance : autant de lignes font partir plus de gens qu\'elles n\'en gardent.',
    devise: 'Mes lignes rouges se comptent, et elles tiennent.',
    apportes:
      'Un cadre net, et ça se voit : avec toi, pas de malentendus qui pourrissent les semaines. Ceux qui passent l\'écran savent pourquoi ils y sont — le lien démarre sur du clair.',
    freines:
      'Les profils qui ne passent pas l\'écran, les portes fermées avant d\'avoir vu la pièce. Ce ne sont pas des défauts — juste ce qui émerge quand la grille devient le premier filtre avant la rencontre.',
    couple:
      'Tu apprécies un lien qui démarre net : attentes posées, zones grises évitées. À garder en tête : une ligne dure se vit pour l\'autre comme un mur sans explication — dire la règle adoucit la ligne.',
    equilibre:
      'Vérifier que tu gardes une porte, et pas un mur. Non parce que tes lignes seraient de trop, mais parce que le monde que tu veux habiter rétrécit à chaque ligne de plus.',
  },
};
