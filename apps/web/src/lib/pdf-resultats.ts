/**
 * Export PDF des résultats détaillés — jsPDF en import DYNAMIQUE (le bundle
 * principal reste intact ; le module ne se charge qu'au clic).
 *
 * Gabarit A4 (unités mm) : en-tête Wairyu bicolore + date, « Mes résultats —
 * « {titre} » », Ma carte, Mon profil tendance par tendance (barres RÉELLES du
 * scorer du Livrable), Ma manière de répondre, Comment utiliser cette quête,
 * note de pied honnête (lecture d'app, rien n'est envoyé) + pagination.
 *
 * WinAnsi (police Helvetica) : œ é « » vérifiés dans le flux.
 *
 * RECONSTITUTION (5ᵉ reset sandbox) — fidèle au chunk staging
 * pdf-resultats-DJPOSrQf.js (Task 27).
 */

import type { ApercuResultats, Palier, QueteDef } from './quetes';
import { construireApercuResultats, nomFichierPdf, PALIER_LABELS } from './quetes';

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
 * Télécharge le PDF des résultats (déclenché au clic sur
 * « Télécharger mes résultats en PDF »).
 */
export async function telechargerResultatsPdf(
  quete: QueteDef,
  carte: { id: string; nom: string; lumiere: string; ombre: string; tension: string },
  reponses: Record<string, number>,
): Promise<void> {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const apercu: ApercuResultats = construireApercuResultats(quete, reponses);
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
  doc.text(`Mes résultats — « ${quete.titre} »`, MARGE, curseur.y);
  curseur.y += 6.5;
  para('Ton document personnel du voyage Wairyu : ta carte, tes tendances réelles, ton volet d\'ombre côté relation et tes conseils d\'utilisation.', {
    size: 10,
    couleur: ENCRE_DOUCE,
    italique: true,
  });

  // ---- Ma carte
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
  para('Côté relation', { size: 9.5, couleur: TURQUOISE, gras: true });
  para(quete.ombreRelationnel[carte.id] ?? '', { size: 10 });

  // ---- Mon profil, tendance par tendance
  section('Mon profil, tendance par tendance');
  para(apercu.intro, { size: 9.5, couleur: ENCRE_DOUCE, italique: true });
  para(apercu.commentLire, { size: 9.5, couleur: ENCRE_DOUCE, italique: true });
  for (const barre of apercu.bars) {
    assurerPlace(26);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11.5);
    doc.setTextColor(...BLEU_NUIT);
    doc.text(barre.nom, MARGE, curseur.y);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10.5);
    doc.setTextColor(...TURQUOISE);
    doc.text(`${barre.pct} %`, 210 - MARGE, curseur.y, { align: 'right' });
    curseur.y += 3.6;
    doc.setFontSize(8.8);
    doc.setTextColor(...ENCRE_DOUCE);
    doc.text(`${barre.sousLigne} · ${PALIER_LABELS[barre.palier]}`, MARGE, curseur.y);
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
    curseur.y += 1.4;
  }

  // ---- Comment utiliser cette quête
  section('Comment utiliser cette quête');
  for (const conseil of apercu.conseils) {
    assurerPlace(14);
    doc.setFillColor(...TURQUOISE);
    doc.circle(MARGE + 1.6, curseur.y - 1.2, 0.9, 'F');
    para(conseil, { size: 10 });
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
