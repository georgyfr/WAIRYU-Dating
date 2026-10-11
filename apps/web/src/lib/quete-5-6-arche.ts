/**
 * Archétypes de la quête 5.6 — Après un désaccord (Monde 7 « Face aux
 * Tempêtes » · 💎 PREMIUM · accès libre).
 *
 * Même gabarit que les quêtes 1.x-5.x : chaque type est écrit à la 2ᵉ
 * personne, SIMPLE ET LITTÉRAL, dans les 6 champs — intro (« Ton archétype
 * révèle une personne qui… » + point de vigilance), devise, « Ce que tu
 * apportes », « Ce qui peut te freiner » (refermé sur « Ce ne sont pas des
 * défauts — juste ce qui émerge quand… »), « En couple » (« À garder en
 * tête : … »), « Ton équilibre » (un geste + « Non parce que…, mais parce
 * que… »).
 *
 * Ancrage : les cartes VERBATIM (nom, lumière, ombre, tension) restent dans
 * quete-5-6.ts ; ces textes s'appuient sur le corps des cartes (cartes.yaml)
 * et les textures du 07-miroir.md (TA LUMIÈRE / TON OMBRE EN COUPLE / TA
 * TENSION / LE MINI-RES) — RÉÉCRITS, jamais recopiés : aucun segment ≥ 60
 * caractères n'est repris tel quel du miroir.
 *
 * GABARIT OUVERT (doctrine capitale du Livrable) : aucun type ne scelle le
 * niveau — « à travailler » est une porte (un muscle, ça se travaille), le
 * silence n'est pas un échec (il protège), le silence décrit ne prédit rien.
 * NEUTRALITÉ : les trois façons de revenir se valent — aucune variante dressée
 * en idéal, aucune en défaut. DOCTRINE DE L'OMBRE : l'ombre = le COÛT (pour
 * soi ET pour l'autre), jamais la nature de la personne — jamais un blâme.
 * Aucun vocabulaire clinique, aucune étiquette, aucune citation non certifiée
 * (arbitrage 6 — les « tu l'as répondu » restent aux cartes verbatim).
 *
 * Typo : apostrophe ASCII uniquement, phrases ≤ 22 mots.
 */
import type { ArchetypeCarte } from './quetes-plus';

export const ARCHES_5_6: Record<
  'CARTE-5.6-QUI-TIENT' | 'CARTE-5.6-SE-TRAVAILLE' | 'CARTE-5.6-SILENCIEUSE',
  ArchetypeCarte
> = {
  // CARTE-5.6-QUI-TIENT — le retour sans attendre, et le pas laissé dormant
  // chez l'autre.
  'CARTE-5.6-QUI-TIENT': {
    intro:
      'Ton archétype révèle une personne qui sait revenir : après un désaccord, le geste, le mot ou l\'excuse arrive sans attendre. Ton point de vigilance : quand un seul revient, le premier pas de l\'autre reste un muscle dormant.',
    devise: 'Je sais revenir : le premier pas est chez moi, et la porte se rouvre vite.',
    apportes:
      'Une force qui rassure : les tensions se dénouent avant de s\'installer. Avec toi, un désaccord reste banal — il se règle, et le lien tient.',
    freines:
      'Revenir vite peut absorber le silence de l\'autre : ses propres excuses ne s\'exercent plus. Ce ne sont pas des défauts — juste ce qui émerge quand la réparation est fluide.',
    couple: 'À garder en tête : laisse parfois à l\'autre le pas de la porte — la réparation se partage.',
    equilibre:
      'Attends parfois le retour de l\'autre — Non parce que ta réparation est de trop, mais parce que deux muscles valent mieux qu\'un.',
  },
  // CARTE-5.6-SE-TRAVAILLE — le retour en retard, et la page qui se rouvre
  // en silence.
  'CARTE-5.6-SE-TRAVAILLE': {
    intro:
      'Ton archétype révèle une personne qui revient, mais en retard : les réparations existent, elles demandent un déclic. Ton point de vigilance : la dispute réglée repasse dans ta tête pendant des jours.',
    devise: 'Ma réparation est un muscle : elle se travaille, elle ne se juge pas.',
    apportes:
      'Des réparations réelles, même timides : l\'humour détend, et une excuse sincèrement reçue te fait redescendre. Avec toi, les reprises arrivent — un peu tard, mais elles arrivent.',
    freines:
      'La rumination rouvre une page déjà tournée : l\'excuse de l\'autre reste acceptée à moitié. Ce ne sont pas des défauts — juste ce qui émerge quand le déclic tarde.',
    couple: 'À garder en tête : dis « c\'est réglé » à voix haute, et laisse la phrase travailler pour toi.',
    equilibre:
      'Pose un mot de fin — Non parce que tu répares mal, mais parce que la page aime se fermer net.',
  },
  // CARTE-5.6-SILENCIEUSE — le silence qui protège, et la porte qui attend
  // un premier pas.
  'CARTE-5.6-SILENCIEUSE': {
    intro:
      'Ton archétype révèle une personne qui se tait après la dispute : le silence protège ce qui est vif. Ton point de vigilance : quand personne ne revient, le mur s\'installe — et il parle pour toi.',
    devise: 'Mon silence protège : je n\'enflamme pas ce qui compte.',
    apportes:
      'Un calme qui désamorce : tu évites d\'enflammer ce qui est déjà vif. Avec toi, les escalades perdent leur carburant.',
    freines:
      'Le silence non partagé s\'entasse : des disputes qui ne finissent pas, une porte qui tarde à s\'ouvrir. Ce ne sont pas des défauts — juste ce qui émerge quand le premier pas attend.',
    couple:
      'À garder en tête : le silence est aussi une réponse — la tienne peut changer de ton dès le premier pas.',
    equilibre:
      'Fais un premier pas, même malhabile, même petit — Non parce que ton silence ne compte pas, mais parce qu\'il se dit autrement.',
  },
};
