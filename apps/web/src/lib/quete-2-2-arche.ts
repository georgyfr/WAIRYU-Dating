/**
 * Archétypes de la quête 2.2 — Ta place pour la spiritualité (Monde 3
 * « La Boussole »).
 *
 * Même gabarit que les quêtes 1.x : chaque type est écrit à la 2ᵉ personne,
 * SIMPLE ET LITTÉRAL, dans les 6 champs — intro (« Ton archétype révèle une
 * personne qui… » + point de vigilance), devise, « Ce que tu apportes »,
 * « Ce qui peut te freiner » (refermé sur « Ce ne sont pas des défauts —
 * juste ce qui émerge quand… »), « En couple » (« À garder en tête : … »),
 * « Ton équilibre » (un geste + « Non parce que…, mais parce que… »).
 *
 * Ancrage : les cartes VERBATIM (nom, lumière, ombre, tension) restent dans
 * quete-2-2.ts ; ces textes s'appuient sur le corps des cartes (cartes.yaml)
 * et les textures du 07-miroir.md (TA LUMIÈRE / TON OMBRE EN COUPLE / TA
 * TENSION / LE MINI-RES) — RÉÉCRITS, jamais recopiés : aucun segment ≥ 60
 * caractères n'est repris tel quel du miroir.
 *
 * NEUTRALITÉ ABSOLUE (doctrine capitale du Livrable) : les trois profils
 * (centrale / culturelle / absente) sont respectés ET égaux en dignité —
 * l'absente n'est pas un vide à combler, la centrale n'est pas un cap à
 * tenir, la culturelle n'est pas de la surface. Aucune croyance nommée
 * (jamais dieu, confession, texte, culte) : les textes parlent de place, de
 * semaine, de décisions, de couple. Jamais un diagnostic, jamais une
 * étiquette clinique, aucun palier flatté ni blâmé.
 *
 * Typo : apostrophe ASCII uniquement, phrases ≤ 22 mots.
 */
import type { ArchetypeCarte } from './quetes-plus';

export const ARCHES_2_2: Record<'CARTE-2.2-CLOCHES' | 'CARTE-2.2-FETES' | 'CARTE-2.2-CLAIRIERE', ArchetypeCarte> = {
  // CARTE-2.2-CLOCHES — la place centrale : une architecture du sens, et le
  // partage qui se propose sans se réclamer.
  'CARTE-2.2-CLOCHES': {
    intro:
      'Ton archétype révèle une personne qui habite une place centrale. Ta spiritualité organise tes jours, porte tes décisions et donne un sens d\'avance. Ce n\'est pas un cap à tenir — c\'est une architecture à toi. Ton point de vigilance : le partage se propose — il ne se réclame jamais comme entrée obligatoire.',
    devise: 'Ma place est un centre : elle organise, elle porte, elle accueille.',
    apportes:
      'Une architecture du sens : tes jalons tiennent, ton centre rassure sans réclamer. Avec toi, une profondeur partagée devient possible — des repères qui se vivent au lieu de se négocier.',
    freines:
      'La conviction d\'avoir trouvé peut devenir une porte qu\'on oublie d\'entrouvrir. L\'interprétation divise, même sous le même toit. Ce ne sont pas des défauts — juste ce qui émerge quand le centre pèse plus que l\'accueil.',
    couple:
      'Tu apprécies un lien où le sens se vit ensemble : des jalons communs, une profondeur qui dure. À garder en tête : habiter le même lieu n\'empêche pas d\'y voir deux paysages — laisse l\'autre nommer le sien.',
    equilibre:
      'Accueillir une place différente de la tienne sans la corriger. Non parce que ton centre serait trop plein, mais parce qu\'un centre accueille mieux qu\'il ne réclame.',
  },

  // CARTE-2.2-FETES — la place des grandes heures : des rendez-vous tout
  // faits, et un reste des jours qui a aussi besoin d'un mot.
  'CARTE-2.2-FETES': {
    intro:
      'Ton archétype révèle une personne qui vit la spiritualité aux grandes heures. Les fêtes, les saisons et les gestes hérités rythment ton année : elle fait du lien, pas de la discipline. Ton point de vigilance : les autres jours restent sans rite — la fête dit l\'appartenance, elle ne raconte pas tout.',
    devise: 'Les grandes heures me rassemblent — le reste des jours respire.',
    apportes:
      'Des rendez-vous qui viennent tout faits : l\'année gagne des balises que personne n\'a à inventer. Tu fais la culture du lien — autour de toi, on se retrouve.',
    freines:
      'Le quotidien sans rite, les jours où la fête est passée et où le lien se cherche. Ce ne sont pas des défauts — juste ce qui émerge quand la place se donne en saisons plutôt qu\'en habitudes.',
    couple:
      'Tu apprécies une année balisée : des fêtes communes, des saisons partagées, des gestes qui se transmettent sans débat. À garder en tête : la fête rassemble mais n\'explique pas — dis ce qu\'elle recouvre, sinon l\'autre célèbre à l\'aveugle.',
    equilibre:
      'Donner un mot à une de tes fêtes : ce qu\'elle recouvre, vraiment. Non parce que la fête manquerait de valeur, mais parce qu\'un sens dit à voix haute se partage mieux.',
  },

  // CARTE-2.2-CLAIRIERE — la place libre : rien de pré-mappé, et des jalons
  // qui se construisent à la main — une liberté, jamais un vide.
  'CARTE-2.2-CLAIRIERE': {
    intro:
      'Ton archétype révèle une personne qui garde la place ouverte. Rien n\'y est pré-mappé : tu cherches le sens sans autel et le lien sans rituel. Ta façon d\'habiter la vie n\'en vaut pas moins qu\'une autre. Ton point de vigilance : moins de jalons tout faits — le sens se bâtit à la main.',
    devise: 'Ma liberté est entière — je choisis mes jalons.',
    apportes:
      'Une ouverture sans programme : rien n\'est pré-mappé, tout ce que vous vivrez, vous l\'aurez choisi. Tu laisses à l\'autre une place réelle — aucune coutume à suivre sans la comprendre.',
    freines:
      'Les jalons que d\'autres héritent, tu devras les inventer — parfois sans exemple ni calendrier. Ce ne sont pas des défauts — juste ce qui émerge quand la liberté se garde entière jusqu\'à deux.',
    couple:
      'Tu apprécies un lien sans rituel imposé : chaque jalon se choisit, rien ne se subit. À garder en tête : l\'autre peut aimer les repères tout faits. Un jalon choisi ensemble, puis tenu, vaut un rituel hérité.',
    equilibre:
      'Choisir un jalon à deux par saison, et le tenir. Non parce que ta liberté manquerait de quelque chose, mais parce qu\'un rendez-vous partagé grandit une clairière.',
  },
};
