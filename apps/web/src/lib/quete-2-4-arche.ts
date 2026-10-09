/**
 * Archétypes de la quête 2.4 — Tes réalités (Monde 3 « La Boussole »).
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
 * quete-2-4.ts ; ces textes s'appuient sur le corps des cartes (cartes.yaml
 * v2, mission VAGUE 5) et les briques MR-24-REA-A/B du 07-miroir (TA LUMIÈRE /
 * TON OMBRE EN COUPLE / TA TENSION / MINI-RES) — RÉÉCRITS, jamais recopiés :
 * aucun segment ≥ 60 caractères n'est repris tel quel du miroir. Jamais un
 * diagnostic, jamais une étiquette clinique, aucun palier flatté ni blâmé.
 * Écran de conformité : l'ombre nomme des COÛTS DE MÉCANISME (filtrage sans
 * toi, invention par l'autre), jamais des défauts de la personne — aucune
 * réalité n'est jugée, aucune hiérarchie des vies (doctrine cartes.yaml).
 *
 * Typo : apostrophe ASCII uniquement, phrases ≤ 22 mots.
 */
import type { ArchetypeCarte } from './quetes-plus';
import type { VarianteId24 } from './quete-2-4';

export const ARCHES_2_4: Record<VarianteId24, ArchetypeCarte> = {
  // CARTE-2.4-A — Le·La Franc·e-jeu : les faits posés, et le filtre qui travaille sans toi.
  'CARTE-2.4-A': {
    intro:
      'Ton archétype révèle une personne qui pose tout sur la table : ta ville, ton tempo, le tabac, les enfants. Ta vie se déclare telle quelle — ceux qui te lisent savent à qui ils écrivent. Ton point de vigilance : des faits posés trop fermes finissent par parler à ta place.',
    devise: 'Tout est sur la table : ma vie se déclare, elle ne se devine pas.',
    apportes:
      'Une lecture claire : ton profil dit où tu vis, comment tu manges, à quel tempo tu rencontres. L\'autre arrive informé — moins de devinettes, moins de malentendus, du temps protégé des deux côtés.',
    freines:
      'Les nuances qui n\'entrent dans aucune case, les « ça dépend » qu\'un profil ne raconte pas. Ce ne sont pas des défauts — juste ce qui émerge quand des faits tranchés parlent plus fort que le reste.',
    couple:
      'Tu apprécies un lien qui démarre sur du clair : chacun sait dans quelle vie il arrive, personne ne découvre en retard. À garder en tête : tes faits filtrent aussi sans toi — certains s\'écartent avant le premier mot, sans rien dire.',
    equilibre:
      'Relire tes réponses dès que ta vie bouge — et garder une phrase pour le « ça dépend ». Non parce que tes faits seraient trop durs, mais parce qu\'un profil vivant raconte plus qu\'un formulaire.',
  },

  // CARTE-2.4-B — L'Énigmatique : l'essentiel d'abord, et le vide que l'autre remplit.
  'CARTE-2.4-B': {
    intro:
      'Ton archétype révèle une personne qui choisit ce qu\'elle montre : l\'essentiel d\'abord, le reste à venir. L\'indéfini, chez toi, est un choix assumé, pas un oubli. Ton point de vigilance : tes cases vides se remplissent toutes seules — l\'autre y met ses peurs.',
    devise: 'Je dis l\'essentiel, et je garde le reste pour quand ce sera mérité.',
    apportes:
      'Un profil qui donne envie de demander : tes cases vides ouvrent des conversations au lieu de les fermer. Tu laisses à l\'autre la place de découvrir — pas à pas, à son rythme comme au tien.',
    freines:
      'Les hypothèses que l\'autre remplit à ta place, les peurs projetées dans tes cases vides. Ce ne sont pas des défauts — juste ce qui émerge quand le mystère parle plus fort que les faits.',
    couple:
      'Tu apprécies la découverte progressive : chaque date révèle un étage de plus, sans tout donner le premier soir. À garder en tête : l\'attente nourrit la curiosité, et parfois le doute. Dis l\'essentiel assez tôt pour que personne n\'invente à ta place.',
    equilibre:
      'Poser une réalité de plus quand elle devient importante pour la rencontre. Non parce que ton mystère serait un problème, mais parce que le vide, laissé trop longtemps, se remplit sans toi.',
  },
};
