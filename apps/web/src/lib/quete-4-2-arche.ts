/**
 * Archétypes de la quête 4.2 — Où tu en es aujourd'hui (Monde 5
 * « Ton Héritage »).
 *
 * Même gabarit que les quêtes 1.x-3.x : chaque type est écrit à la 2ᵉ
 * personne, SIMPLE ET LITTÉRAL, dans les 6 champs — intro (« Ton archétype
 * révèle une personne qui… » + point de vigilance), devise, « Ce que tu
 * apportes », « Ce qui peut te freiner » (refermé sur « Ce ne sont pas des
 * défauts — juste ce qui émerge quand… »), « En couple » (« À garder en
 * tête : … »), « Ton équilibre » (un geste + « Non parce que…, mais parce
 * que… »).
 *
 * Ancrage : les cartes VERBATIM (nom, lumière, ombre, tension) restent dans
 * quete-4-2.ts ; ces textes s'appuient sur le corps des cartes (cartes.yaml)
 * et les textures du 07-miroir.md (TA LUMIÈRE / TON OMBRE EN COUPLE / TA
 * TENSION / LE MINI-RES) — RÉÉCRITS, jamais recopiés : aucun segment ≥ 60
 * caractères n'est repris tel quel du miroir.
 *
 * NEUTRALITÉ DES ÉTATS (doctrine capitale du Livrable) : apaisé, en chemin,
 * en travail — trois météos, JAMAIS des stades d'une guérison (interdit
 * V10). Personne n'est « en retard » : aucun palier flatté ni blâmé, aucune
 * étiquette clinique, aucun verdict de guérison.
 *
 * Typo : apostrophe ASCII uniquement, phrases ≤ 22 mots.
 */
import type { ArchetypeCarte } from './quetes-plus';

export const ARCHES_42: Record<
  'CARTE-4.2-CHAPITRE-REFERME' | 'CARTE-4.2-PAGE-QUI-TOURNE' | 'CARTE-4.2-MAISON-EN-TRAVAUX',
  ArchetypeCarte
> = {
  // CARTE-4.2-CHAPITRE-REFERME — la place calme, et les mots qui la traduisent.
  'CARTE-4.2-CHAPITRE-REFERME': {
    intro:
      'Ton archétype révèle une personne dont les chapitres passés sont refermés : tu sais ce qu\'ils t\'ont appris, et le calme que tu as ramené reste. Ton point de vigilance : le rangement d\'avant n\'est pas le rangement de l\'autre.',
    devise: 'Mes cartons sont faits — j\'avance léger.',
    apportes:
      'Une place calme qui s\'entend : les gens nouveaux, tu les regardes pour ce qu\'ils sont. Avec toi, pas de brasier de réminiscence — du repos, du vrai.',
    freines:
      'Une sérénité posée peut se lire comme une distance : la braise de l\'autre ne connaît pas ton tempo. Ce ne sont pas des défauts — juste ce qui émerge quand le calme est arrivé avant l\'autre.',
    couple: 'À garder en tête : raconte comment tu as rangé — l\'autre y trouvera son propre tempo.',
    equilibre:
      'Traduis ta sérénité en mots — Non parce qu\'elle est fausse, mais parce qu\'elle ne se voit pas seule.',
  },
  // CARTE-4.2-PAGE-QUI-TOURNE — l'entre-deux honnête, et le bulletin de
  // bascule.
  'CARTE-4.2-PAGE-QUI-TOURNE': {
    intro:
      'Ton archétype révèle une personne entre deux météos : des cartons sont faits, d\'autres attendent, et certaines pages tournent encore. C\'est un entre-deux honnête. Ton point de vigilance : une bascule s\'annonce mal — elle se raconte bien.',
    devise: 'Mes pages tournent à mon rythme — le chemin n\'a pas d\'horaire.',
    apportes:
      'Un chemin sincère : tu ne joues pas l\'apaisé, tu ne dramatises pas — tu avances vraiment. Avec toi, l\'autre voit une personne qui se connaît en cours de route.',
    freines:
      'Les jours de bascule : un prénom, une chanson, et la braise revit. Ce ne sont pas des défauts — juste ce qui émerge quand les pages tournent encore.',
    couple: 'À garder en tête : dis à l\'autre ce qui rallume — la météo y gagne un bulletin.',
    equilibre:
      'Préviens quand la braise reprend — Non parce que tu dois te cacher, mais parce qu\'un bulletin évite les mauvaises lectures.',
  },
  // CARTE-4.2-MAISON-EN-TRAVAUX — l'honnêteté sans déguisement, et la peur
  // précise.
  'CARTE-4.2-MAISON-EN-TRAVAUX': {
    intro:
      'Ton archétype révèle une personne dont l\'histoire occupe encore de la place — une maison en travaux, et les travaux se font à ton rythme. Ce n\'est pas une faille. Ton point de vigilance : la preuve répétée n\'apaise pas — elle use les deux.',
    devise: 'Ma maison est en travaux — les travaux se font à mon rythme.',
    apportes:
      'Une honnêteté sans déguisement : tu sais où tu en es, et tu ne fais pas semblant. Avec toi, l\'autre sait à quoi s\'attendre — pas de fausse vitrine.',
    freines:
      'La vérification au lieu de recevoir : une question tombe sur un chantier, un silence s\'écrit en scénario inquiet. Ce ne sont pas des défauts — juste ce qui émerge quand la clarté a manqué longtemps.',
    couple: 'À garder en tête : nomme une peur précise à l\'autre — la clarté commence par elle.',
    equilibre:
      'Reçois la preuve une fois, puis garde-la — Non parce que ton besoin n\'est pas légitime, mais parce qu\'il mérite mieux que la répétition.',
  },
};
