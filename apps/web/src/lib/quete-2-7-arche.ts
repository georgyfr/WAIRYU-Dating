/**
 * Archétypes de la quête 2.7 — Ta vision de la famille (Monde 3 « La Boussole »).
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
 * quete-2-7.ts ; ces textes s'appuient sur le corps des cartes (cartes.yaml)
 * et les briques texture A du 07-miroir.md (TA LUMIÈRE / TON OMBRE EN COUPLE /
 * TA TENSION / MINI-RES) — RÉÉCRITS, jamais recopiés : aucun segment ≥ 60
 * caractères n'est repris tel quel du miroir. Jamais un diagnostic, jamais
 * une étiquette clinique.
 *
 * Doctrine (00-README + 07-miroir) : neutralité absolue sur la parentalité —
 * le désir d'enfant, l'indécision honnête et le choix sans enfant sont trois
 * vies dignes : aucun désir dressé en vertu, aucun choix traité en manque,
 * aucune indécision traitée en lâcheté. Les ombres nomment des mécaniques de
 * couple (le désir qui presse · l'indécis qui laisse porter · le choix qui se
 * dit tard), jamais des défauts de personne. Le dealbreaker parentalité,
 * SIG-2.7-02 et SIG-2.7-03 sont des mécanismes MOTEUR : aucun texte ne les
 * mentionne, jamais un seuil, jamais un chiffre d'années.
 *
 * Typo : apostrophe ASCII uniquement, phrases ≤ 22 mots.
 */
import type { ArchetypeCarte } from './quetes-plus';
import type { VarianteId27 } from './quete-2-7';

export const ARCHES_2_7: Record<VarianteId27, ArchetypeCarte> = {
  // CARTE-2.7-BERCEAU — le désir qui s'annonce, et la clarté qui presse.
  'CARTE-2.7-BERCEAU': {
    intro:
      'Ton archétype révèle une personne qui a un projet. Tu es de celles et ceux qui annoncent les enfants comme un chapitre voulu — pas comme une hypothèse lointaine. Tu poses les questions difficiles maintenant, pour les vraies réponses. Ton point de vigilance : un désir clair presse parfois celui qui n\'a pas fini de répondre.',
    devise: 'Je sais ce que je veux : mon projet s\'annonce, en toutes lettres.',
    apportes:
      'Une direction claire : avec toi, les grandes questions se posent tôt et se disent franchement. Tu rends le flou impossible — et beaucoup respirent devant une clarté qui ne juge pas. Tu offres un cap, pas une contrainte.',
    freines:
      'Les réponses qui tardent, les peut-être des autres, les horizons qui ne se croisent pas. Ce ne sont pas des défauts — juste ce qui émerge quand un cap clair rencontre une question encore ouverte.',
    couple:
      'Tu apprécies un lien où le projet commun se dit tôt : les enfants, la maison, le rythme — posés franchement. À garder en tête : ta clarté avance vite — accorde à l\'autre un horizon pour respirer, une réponse arrachée ne tient pas debout.',
    equilibre:
      'Poser ton désir en toutes lettres, puis laisser la question respirer. Non parce que ton cap serait trop fort, mais parce qu\'une décision vécue à deux se tient mieux qu\'une décision pressée.',
  },

  // CARTE-2.7-PORTE — le peut-être honnête, et la décision qui attend un cadre.
  'CARTE-2.7-PORTE': {
    intro:
      'Ton archétype révèle une personne à l\'équilibre ouvert. Tu es de celles et ceux qui répondent « peut-être » parce que c\'est vrai — ni oui de circonstance, ni non de peur. Ton point de vigilance : sans date posée, le peut-être peut finir par choisir à ta place.',
    devise: 'Mon peut-être est honnête — il ne trompe personne.',
    apportes:
      'Une ouverture sincère : tu laisses les grandes questions mûrir au lieu de les trancher sous pression. Avec toi, les gens peuvent changer d\'avis sans se justifier — c\'est rare, et ça libère la parole.',
    freines:
      'Les décisions qui attendent, les échéances floues, le temps qui tranche seul. Ce ne sont pas des défauts — juste ce qui émerge quand l\'ouverture dure sans jamais prendre de rendez-vous.',
    couple:
      'Tu apprécies un lien qui respecte tes temps de maturation : on peut y dire « je ne sais pas encore » sans dramatiser. À garder en tête : quelqu\'un finira par porter la décision — donne-lui un cadre avant qu\'elle ne se donne par fatigue.',
    equilibre:
      'Te donner une échéance intérieure, même douce. Non parce que ton ouverture serait une faiblesse, mais parce qu\'un peut-être daté reste un choix — pas un abandon de décision.',
  },

  // CARTE-2.7-ROUTE — la route choisie, et le tôt qui la sauve.
  'CARTE-2.7-ROUTE': {
    intro:
      'Ton archétype révèle une personne qui a choisi sa route. Tu es de celles et ceux qui construisent une vie entière sans passer par les enfants — un choix, pas un manque. Ton point de vigilance : une route choisie se dit tard parfois, quand les années ont déjà tissé.',
    devise: 'Ma route est choisie — elle se tient debout toute seule.',
    apportes:
      'Une vie assumée : tu sais où tu vas, et tu n\'attends pas que la vie décide pour toi. Ta franchise sur les grandes questions rend les autres honnêtes — avec toi, on ne joue pas.',
    freines:
      'Les attachements qui butent sur la même question, les désirs opposés qui se disent tard. Ce ne sont pas des défauts — juste ce qui émerge quand un choix clair rencontre un cap différent.',
    couple:
      'Tu apprécies un lien qui veut la même route : une vie pleine à deux, sans parenthèse imposée. À garder en tête : dis ta route tôt — une question si grande, dite tard, coûte les années déjà tissées.',
    equilibre:
      'Dire ta route dès que ça compte, en toutes lettres. Non parce que ton choix devrait se justifier, mais parce que dit tôt, il laisse la place aux vraies rencontres.',
  },
};
