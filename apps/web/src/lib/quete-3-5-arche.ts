/**
 * Archétypes de la quête 3.5 — Ton entourage (Monde 4 « Ton Terrain »).
 *
 * Même gabarit fondateur que la quête 2.1 (Task 35) : chaque type est écrit
 * à la 2ᵉ personne, SIMPLE ET LITTÉRAL, dans les 6 champs — intro (« Ton
 * archétype révèle une personne qui… » + point de vigilance), devise,
 * « Ce que tu apportes », « Ce qui peut te freiner » (refermé sur « Ce ne
 * sont pas des défauts — juste ce qui émerge quand… »), « En couple »
 * (« À garder en tête : … »), « Ton équilibre » (un geste + « Non parce
 * que…, mais parce que… »).
 *
 * Ancrage : les cartes VERBATIM (nom, lumière, ombre, tension) restent dans
 * quete-3-5.ts ; ces textes s'appuient sur le corps des cartes (cartes.yaml,
 * charte C1-C11) et les briques du 07-miroir.md (MR-35-ENT-FUSIONNEL /
 * EQUILIBRE / INDEPENDANT — la table élargie · le milieu du gué · le
 * tête-à-tête gardé, TA LUMIÈRE / TON OMBRE EN COUPLE / TA TENSION /
 * MINI-RES) — RÉÉCRITS, jamais recopiés : aucun segment ≥ 60 caractères
 * n'est repris tel quel. Registre probabiliste : les conséquences se disent
 * en fréquences (« souvent », « parfois »), jamais un futur certain sur les
 * familles.
 *
 * Doctrine du Livrable respectée : neutralité absolue — entourage dense et
 * cercle étroit se valent (la qualité n'est pas la quantité) ; la
 * différenciation n'est pas l'indépendance (des places, jamais des degrés
 * de maturité) ; ZÉRO personne nommée (la fête, le dimanche, la chaise —
 * jamais un personnage) ; ombre = conséquence du mouvement, jamais un
 * défaut ni un jugement moral ; concepts publics (différenciation, homogamie
 * sociale) et friction des entourages jamais rendus (C2/C3).
 *
 * Typo : apostrophe ASCII uniquement, phrases ≤ 22 mots.
 */
import type { ArchetypeCarte } from './quetes-plus';
import type { VarianteId35 } from './quete-3-5';

export const ARCHES_35: Record<VarianteId35, ArchetypeCarte> = {
  // CARTE-3.5-TABLE-ELARGIE — la table élargie : un entourage dense qui
  // compte, et les chaises qui se préparent (profil fusionnel).
  'CARTE-3.5-TABLE-ELARGIE': {
    intro:
      "Ton archétype révèle une personne qui vit entourée. Les tiens comptent dans tes grandes décisions, tes week-ends accueillent le cercle, ta table s'élargit — et tu y es bien. Ton point de vigilance : une table pleine impose ses places, et celle ou celui qui arrive gagne sa chaise.",
    devise: "Ma table est grande — et tout le monde y a sa voix.",
    apportes:
      "Un filet humain : autour de toi, personne ne tombe. Tu offres à l'autre une famille d'accueil — des fêtes remplies, des rendez-vous tenus, des liens qui se transmettent.",
    freines:
      "Les avis qui affluent, les week-ends partagés en trois, les règles négociées à plusieurs. Ce ne sont pas des défauts — juste ce qui émerge quand tout le cercle a voix au chapitre.",
    couple:
      "Tu apprécies un lien qui s'étend : les amis, les familles, les tables qui débordent. À garder en tête : la personne qui partage ta vie entre dans un cercle déjà plein. Prépare sa chaise — elle ne se gagne pas seule.",
    equilibre:
      "Réserver chaque mois un week-end rien qu'à vous deux, et l'annoncer au cercle comme un rendez-vous qui compte. Non parce que les autres comptent moins, mais parce que le centre de la table a besoin de ses coins tranquilles.",
  },

  // CARTE-3.5-DEUX-RIVES — le milieu du gué : les deux rives entendues, et
  // le pont qui encaisse les vagues (profil équilibre).
  'CARTE-3.5-DEUX-RIVES': {
    intro:
      "Ton archétype révèle une personne qui fait le pont. Ton entourage compte sans envahir : tu connais la valeur des deux rives. La famille d'un côté, le couple de l'autre, les amis au milieu. Ton point de vigilance : le pont encaisse les vagues des deux rives, et les négociations s'arrêtent souvent sur toi.",
    devise: "Je fais le pont — sans rester planté au milieu.",
    apportes:
      "Une souplesse rare : tu peux entendre la famille et le couple sans trahir l'un ni l'autre. Avec toi, les deux mondes se parlent — les malentendus se dénouent souvent avant de s'installer.",
    freines:
      "Les attentes floues, les questions qu'on te reporte, les règles qui restent tacites. Ce ne sont pas des défauts — juste ce qui émerge quand ta souplesse se lit dehors plus qu'elle ne se dit dedans.",
    couple:
      "Tu apprécies un lien où chacun garde sa rive : tu fais la passerelle, pas la fusion. À garder en tête : ta règle des fêtes se dit — elle ne se devine pas. L'autre ne lit pas ton milieu du gué.",
    equilibre:
      "Dire ta règle des fêtes avant que la vague arrive — une phrase douce et claire suffit. Non parce que ton équilibre serait fragile, mais parce qu'une place qui se dit se vit mieux qu'une place devinée.",
  },

  // CARTE-3.5-TERRITOIRE — le territoire gardé : une géographie choisie,
  // et la place des autres à nommer (profil indépendant).
  'CARTE-3.5-TERRITOIRE': {
    intro:
      "Ton archétype révèle une personne qui garde son territoire. Tes décisions se prennent entre vous, tes week-ends se réservent, chacun garde sa géographie — un choix assumé, pas une coupure. Ton point de vigilance : la place que les autres peuvent habiter se nomme — sans ce mot, elle se devine mal.",
    devise: "Ma clarté est un don — je la partage sans me défaire.",
    apportes:
      "Une clarté qui repose : avec toi, on sait qui décide quoi, et les temps à deux sont denses. Ton choix d'attention rend les temps partagés plus vrais — moins de surface, plus de profondeur.",
    freines:
      "Les familles qui cherchent leur place, les invitations à déchiffrer, les silences pris pour de la distance. Ce ne sont pas des défauts — juste ce qui émerge quand une géographie choisie rencontre des cartes différentes.",
    couple:
      "Tu apprécies un lien qui respecte votre territoire : des week-ends gardés, des décisions souveraines. À garder en tête : une place nommée vaut mieux qu'une place devinée — dis où les autres peuvent habiter.",
    equilibre:
      "Nommer une fois par saison la place que les autres peuvent habiter — une porte ouverte ne déplace aucun mur. Non parce que ton territoire devrait se justifier, mais parce qu'une frontière dite se traverse sans être franchie.",
  },
};
