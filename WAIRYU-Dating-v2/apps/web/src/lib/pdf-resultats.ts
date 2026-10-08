/**
 * Le document personnel des résultats — jsPDF en import DYNAMIQUE (le bundle
 * principal reste intact ; le module ne se charge qu'au clic).
 *
 * Task 33 — réorientation fondateur (l'archétype d'abord) : Ma carte → Ton
 * archétype (présentation GÉNÉRALE du type : sa lumière, son ombre, en
 * relation, son point d'équilibre) → Mon profil, tendance par tendance
 * (QUALITATIF d'abord : « Très présente », « 78/100 — tendance actuelle » en
 * secondaire) + levier de progression par dimension → Mon langage relationnel
 * (moteur de matching) → Comment utiliser cette quête → La suite de ton
 * voyage (cliffhanger) → note de pied honnête + pagination.
 *
 * Les sections personnelles de la formule 32 (preuves, question à emporter,
 * ce que l'autre ressent, besoins) ne sont plus imprimées : elles affirmaient
 * des vérités intimes que la passation ne mesure pas — les données restent
 * dans quete-1-*-plus.ts pour le matching futur.
 *
 * Gabarit A4 (unités mm) : en-tête Wairyu bicolore + date. WinAnsi (police
 * Helvetica) : œ é « » · — vérifiés dans le flux ; pas d'emoji (police non
 * couverte) — les titres de section restent en texte.
 *
 * RECONSTITUTION (5ᵉ reset sandbox) — base fidèle au chunk staging
 * pdf-resultats-DJPOSrQf.js (Task 27), structure Tasks 32/33.
 */

import type { ApercuResultats, Palier, QueteDef } from './quetes';
import { construireApercuResultats, nomFichierPdf, PALIER_LABELS } from './quetes';
import { ARCHE, PLUS } from './quetes-plus';

// Palette (RGB 0-255) — tokens de l'identité visuelle.
const BLEU_NUIT: RGB = [23, 44, 61];
const ENCRE_TITRE: RGB = [15, 31, 44];
const TURQUOISE: RGB = [42, 154, 160];
const TURQUOISE_CLAIR: RGB = [159, 224, 214];
const TURQUOISE_PALE: RGB = [214, 233, 229];
const CORAIL: RGB = [217, 75, 52];
const ENCRE: RGB = [51, 62, 74];
const ENCRE_DOUCE: RGB = [92, 102, 112];
const CREME: RGB = [245, 241, 230];
const SABLE: RGB = [228, 221, 203];

type RGB = [number, number, number];

const MARGE = 18;
const LARGEUR = 210 - MARGE * 2;
const BAS_PAGE = 279;

function dateLongue(d = new Date()): string {
  return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

interface OptionsPara {
  size?: number;
  gras?: boolean;
  italique?: boolean;
  couleur?: RGB;
}

/** Couleur de remplissage des barres selon le palier de lecture. */
function couleurPalier(palier: Palier): RGB {
  return palier === 'fort' ? TURQUOISE : palier === 'equilibre' ? TURQUOISE_CLAIR : TURQUOISE_PALE;
}

/**
 * Télécharge le document personnel (déclenché au clic sur
 * « Télécharger mon document personnel »).
 */
export async function telechargerResultatsPdf(
  quete: QueteDef,
  carte: { id: string; nom: string; lumiere: string; ombre: string; tension: string },
  reponses: Record<string, number>,
): Promise<void> {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const apercu: ApercuResultats = construireApercuResultats(quete, reponses);
  const arche = ARCHE[quete.id][carte.id];
  const plusCarte = PLUS[quete.id].cartes[carte.id];
  const plus = PLUS[quete.id];
  const curseur = { y: 0 };

  const assurerPlace = (hauteur: number): void => {
    if (curseur.y + hauteur > BAS_PAGE) {
      doc.addPage();
      curseur.y = MARGE + 4;
    }
  };

  const section = (titre: string): void => {
    assurerPlace(16);
    doc.setDrawColor(...TURQUOISE);
    doc.setLineWidth(1.6);
    doc.line(MARGE, curseur.y, MARGE + 7, curseur.y);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12.5);
    doc.setTextColor(...ENCRE_TITRE);
    doc.text(titre.toUpperCase(), MARGE + 11, curseur.y + 1.2, { charSpace: 0.35 });
    curseur.y += 9;
  };

  const para = (texte: string, opts: OptionsPara = {}): void => {
    const size = opts.size ?? 10.5;
    doc.setFont('helvetica', opts.gras ? 'bold' : opts.italique ? 'italic' : 'normal');
    doc.setFontSize(size);
    doc.setTextColor(...(opts.couleur ?? ENCRE));
    const lignes = doc.splitTextToSize(texte, LARGEUR);
    const hauteurLigne = size * 0.52;
    assurerPlace(lignes.length * hauteurLigne + 3);
    for (const l of lignes) {
      doc.text(l, MARGE, curseur.y);
      curseur.y += hauteurLigne;
    }
    curseur.y += 2.4;
  };

  /** Une liste à puces (points turquoise). */
  const puces = (items: readonly string[], size = 10): void => {
    for (const it of items) {
      assurerPlace(size * 0.52 + 3);
      doc.setFillColor(...TURQUOISE);
      doc.circle(MARGE + 1.6, curseur.y - 1.2, 0.9, 'F');
      para(it, { size });
    }
  };

  // ---- en-tête
  curseur.y = MARGE + 2;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(21);
  doc.setTextColor(...BLEU_NUIT);
  doc.text('Wai', MARGE, curseur.y);
  const largeurWai = doc.getTextWidth('Wai');
  doc.setTextColor(...TURQUOISE);
  doc.text('ryu', MARGE + largeurWai, curseur.y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...ENCRE_DOUCE);
  doc.text(dateLongue(), 210 - MARGE, curseur.y, { align: 'right' });
  curseur.y += 9;
  doc.setDrawColor(...SABLE);
  doc.setLineWidth(0.4);
  doc.line(MARGE, curseur.y, 210 - MARGE, curseur.y);
  curseur.y += 9;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(...BLEU_NUIT);
  doc.text(`Mon document personnel — « ${quete.titre} »`, MARGE, curseur.y);
  curseur.y += 6.5;
  para('Ta carte, ce que représente ton type de personnalité, ce que tes réponses dessinent — et ce que tu peux en faire. Généré depuis tes réponses, il reste le tien.', {
    size: 10,
    couleur: ENCRE_DOUCE,
    italique: true,
  });

  // ---- Ma carte (verbatim — la carte elle-même, validée)
  section('Ma carte');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14.5);
  doc.setTextColor(...TURQUOISE);
  doc.text(carte.nom, MARGE, curseur.y);
  curseur.y += 7.4;
  para(carte.lumiere, { size: 10.5 });
  para(quete.completion.labelOmbre, { size: 9.5, couleur: CORAIL, gras: true });
  para(carte.ombre, { size: 10.5 });
  para(quete.completion.labelTension, { size: 9.5, couleur: CORAIL, gras: true });
  para(carte.tension, { size: 10.5, italique: true });

  // ---- Ton archétype (présentation GÉNÉRALE du type — Task 33)
  section('Ton archétype');
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(11);
  doc.setTextColor(...TURQUOISE);
  doc.text(`« ${arche.devise} »`, MARGE, curseur.y);
  curseur.y += 6;
  para(arche.presentation, { size: 10 });
  para('Sa lumière — ce que ce type peut généralement apporter', { size: 9.5, couleur: TURQUOISE, gras: true });
  puces(arche.lumiere);
  para(arche.lumiereNote, { size: 9.5, couleur: ENCRE_DOUCE, italique: true });
  para('Son ombre — quand cette lumière déborde', { size: 9.5, couleur: CORAIL, gras: true });
  puces(arche.ombre);
  para(arche.ombreNote, { size: 9.5, couleur: ENCRE_DOUCE, italique: true });
  para('En relation — ce que ce type peut généralement apprécier', { size: 9.5, couleur: TURQUOISE, gras: true });
  puces(arche.relation);
  para(arche.relationNote, { size: 9.5, couleur: ENCRE_DOUCE, italique: true });
  para('Son point d\'équilibre', { size: 9.5, couleur: CORAIL, gras: true });
  para(arche.equilibreQuestion, { size: 11, italique: true });
  para(arche.equilibreNote, { size: 9.5, couleur: ENCRE_DOUCE, italique: true });

  // ---- Mon profil, tendance par tendance (qualitatif d'abord)
  section('Mon profil, tendance par tendance');
  para(
    'L\'archétype donne une vue d\'ensemble. Tes réponses permettent maintenant de voir où tu te rapproches de ce portrait — et où tu t\'en éloignes.',
    { size: 9.5, couleur: ENCRE_DOUCE, italique: true },
  );
  para(apercu.commentLire, { size: 9.5, couleur: ENCRE_DOUCE, italique: true });
  for (const barre of apercu.bars) {
    assurerPlace(30);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11.5);
    doc.setTextColor(...BLEU_NUIT);
    doc.text(barre.nom, MARGE, curseur.y);
    doc.setFontSize(10.5);
    doc.setTextColor(...TURQUOISE);
    doc.text(PALIER_LABELS[barre.palier], 210 - MARGE, curseur.y, { align: 'right' });
    curseur.y += 3.6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.8);
    doc.setTextColor(...ENCRE_DOUCE);
    doc.text(`${barre.sousLigne} · ${barre.pct}/100 — tendance actuelle`, MARGE, curseur.y);
    curseur.y += 2.6;
    const yBarre = curseur.y;
    doc.setFillColor(...CREME);
    doc.setDrawColor(...SABLE);
    doc.roundedRect(MARGE, yBarre, LARGEUR, 4.4, 2.2, 2.2, 'FD');
    if (barre.pct > 0) {
      doc.setFillColor(...couleurPalier(barre.palier));
      doc.roundedRect(MARGE, yBarre, Math.max(4.4, (LARGEUR * barre.pct) / 100), 4.4, 2.2, 2.2, 'F');
    }
    curseur.y += 8;
    para(barre.lecture, { size: 9.5, couleur: ENCRE_DOUCE, italique: true });
    para(barre.texte, { size: 10 });
    const lev = plus.leviers[barre.key];
    if (lev) {
      assurerPlace(22);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(...CORAIL);
      doc.text('Ton levier de progression', MARGE, curseur.y);
      curseur.y += 4.6;
      para(`Ta force. ${lev.force}`, { size: 9.8 });
      para(`Ton risque. ${lev.risque}`, { size: 9.8 });
      para(`Ton levier. ${lev.levier}`, { size: 9.8 });
    }
    curseur.y += 1.4;
  }

  // ---- Mon langage relationnel (moteur de matching)
  section('Mon langage relationnel');
  para('Ce que Wairyu retiendra pour te proposer des personnes qui parlent la même langue que toi.', {
    size: 9.5,
    couleur: ENCRE_DOUCE,
    italique: true,
  });
  para('Tu donnes', { size: 9.5, couleur: TURQUOISE, gras: true });
  para(plusCarte.langage.donnes, { size: 10 });
  para('Tu recherches probablement', { size: 9.5, couleur: TURQUOISE, gras: true });
  para(plusCarte.langage.recherches, { size: 10 });
  para('Tu dois surveiller', { size: 9.5, couleur: CORAIL, gras: true });
  para(plusCarte.langage.surveilles, { size: 10 });
  para('Tu pourrais particulièrement apprécier', { size: 9.5, couleur: TURQUOISE, gras: true });
  para(plusCarte.langage.apprecierais, { size: 10 });

  // ---- Comment utiliser cette quête
  section('Comment utiliser cette quête');
  puces(apercu.conseils);

  // ---- La suite de ton voyage (cliffhanger)
  section('La suite de ton voyage');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11.5);
  doc.setTextColor(...BLEU_NUIT);
  doc.text(quete.suite.titre, MARGE, curseur.y);
  curseur.y += 5.6;
  para(quete.suite.intro, { size: 10 });
  for (const q of quete.suite.questions) {
    para(q, { size: 10.5, italique: true });
  }

  // ---- pied de document
  curseur.y += 2;
  assurerPlace(22);
  doc.setDrawColor(...SABLE);
  doc.line(MARGE, curseur.y, 210 - MARGE, curseur.y);
  curseur.y += 5.5;
  para(
    'Ce document vient de tes réponses à la quête « ' + quete.titre + ' » du Monde 1 — Le Miroir. Il reste le tien : rien n\'est publié sur Wairyu sans ton action. Les textes d\'accompagnement sont une lecture d\'app — ils ne remplacent ni un professionnel, ni une étiquette.',
    { size: 8.8, couleur: ENCRE_DOUCE, italique: true },
  );

  // ---- pagination
  const pages = doc.getNumberOfPages();
  for (let p = 1; p <= pages; p += 1) {
    doc.setPage(p);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...ENCRE_DOUCE);
    doc.text(`Wairyu — document personnel, généré le ${dateLongue()}`, MARGE, 289);
    doc.text(`${p} / ${pages}`, 210 - MARGE, 289, { align: 'right' });
  }

  doc.save(nomFichierPdf(quete));
}
