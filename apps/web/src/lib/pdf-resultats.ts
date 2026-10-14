/**
 * Le document personnel des résultats — jsPDF en import DYNAMIQUE (le bundle
 * principal reste intact ; le module ne se charge qu'au clic).
 *
 * Task 35 — GABARIT FONDATEUR (identique à l'écran, même ordre, mêmes mots) :
 * Ma carte (verbatim) → 🎉 Ton profil : {nom} → intro (« Ton archétype révèle
 * une personne qui… » + point de vigilance) → En résumé : « {devise} » → Ce
 * que tu apportes → Ce qui peut te freiner → En couple → Ton équilibre →
 * 🪞 Tes N tendances (d'après tes réponses) : « {nom} — {score}/100
 * ({palier}) » + barre + texte → À noter → La suite de ton voyage
 * (cliffhanger) → note de pied honnête + pagination.
 *
 * L'algorithme (cf. quetes-plus.ts) : un gabarit unique en code, les mots en
 * registre d'archétypes (ARCHE, 2ᵉ personne), les mesures calculées
 * (scorer → 0-100 → palier). Les sections de la formule 33 (langage
 * relationnel, leviers, conseils) ne sont plus imprimées — les données
 * restent dans quete-1-*-plus.ts pour le matching futur.
 *
 * Gabarit A4 (unités mm) : en-tête Wairyu bicolore + date. WinAnsi (police
 * Helvetica) : œ é « » · — vérifiés dans le flux ; pas d'emoji (police non
 * couverte) — les titres de section restent en texte.
 *
 * RECONSTITUTION (5ᵉ reset sandbox) — base fidèle au chunk staging
 * pdf-resultats-DJPOSrQf.js (Task 27), gabarit 35 selon les retours.
 */

import type { ApercuResultats, Palier, QueteDef } from './quetes';
import { construireApercuResultats, mondeDeQuete, nomFichierPdf, NOTA_BARRES, QUETES_FUSION_OMBRE, titreTendances } from './quetes';
import { ARCHE } from './quetes-plus';
// Task 77 — les sources des champs dans le document (identiques à l'écran).
import { sourcesDeQuete, type LigneSource } from './sources-sections';
// Task 78 — les échos des tendances (identiques à l'écran) : les cartes citent
// les réponses réelles, les freines gagnent leur ligne « Et tes réponses le
// disent », l'ombre fusionne dans « En couple ».
import { texteTendanceDe, echoFreinesDe } from './echoes-tendances';
import { txSync } from '../i18n/tx-sync';
import { getLang } from '../i18n/current';
import { localeDevise } from '../i18n/currency';

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
  return d.toLocaleDateString(localeDevise(getLang()), {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
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
  // Task 77 — les sources des champs (mécanique, lecture seule) : le même
  // bloc « D'après tes réponses » que l'écran, imprimé sous chaque champ.
  const sources = sourcesDeQuete(quete.id, carte.id, reponses);
  // Task 78 — même fusion que l'écran : « Ton risque / Ce qui aide » sous « En
  // couple », sources des deux champs dédupliquées, écho des freines.
  const fusionOmbre = QUETES_FUSION_OMBRE.has(quete.id);
  const ombreParas = fusionOmbre
    ? typeof quete.ombreRelationnel[carte.id] === 'string'
      ? (quete.ombreRelationnel[carte.id] as string).split('\n\n').filter((p) => p.trim().length > 0)
      : []
    : [];
  const sourcesCoupleFusion = fusionOmbre
    ? [...sources.couple, ...sources.ombre.filter((l) => !sources.couple.some((c) => c.code === l.code))]
    : sources.couple;
  const echoFreines = echoFreinesDe(quete.id, carte.id, reponses);
  const nomDim = (k: string): string => quete.dims.find((d) => d.key === k)?.nom ?? k;
  const paraSources = (lignes: LigneSource[]): void => {
    if (lignes.length === 0) return;
    para(txSync("D'après tes réponses :"), { size: 8.8, couleur: ENCRE_DOUCE, gras: true });
    for (const l of lignes) {
      para(`${nomDim(l.dim)} — « ${l.enonce} » · ${l.reponse}`, {
        size: 8.8,
        couleur: ENCRE_DOUCE,
      });
    }
  };
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
  doc.text(
    txSync('Mon document personnel — « {{titre}} »', { titre: quete.titre }),
    MARGE,
    curseur.y,
  );
  curseur.y += 6.5;
  para(
    txSync(
      'Ta carte, ce que représente ton type de personnalité, ce que tes réponses dessinent — et ce que tu peux en faire. Généré depuis tes réponses, il reste le tien.',
    ),
    {
      size: 10,
      couleur: ENCRE_DOUCE,
      italique: true,
    },
  );

  // ---- Ma carte (verbatim — la carte elle-même, validée)
  section(txSync('Ma carte'));
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

  // ---- Ton profil (gabarit fondateur — mots du registre ARCHE, Task 35 ;
  //      titres et voix Task 74, identiques à l'écran)
  section(txSync('Ton profil : {{nom}}', { nom: carte.nom }));
  para(txSync("{{titre}}, d'après tes réponses", { titre: quete.titre }), {
    size: 9,
    couleur: ENCRE_DOUCE,
    italique: true,
  });
  para(arche.intro, { size: 10 });
  para(txSync('En résumé :') + ` « ${arche.devise} »`, { size: 10.5, italique: true, couleur: TURQUOISE, gras: true });
  para(txSync('Ta force'), { size: 9.5, couleur: TURQUOISE, gras: true });
  para(arche.apportes, { size: 10 });
  paraSources(sources.force);
  para(txSync('Là où ça peut se compliquer'), { size: 9.5, couleur: CORAIL, gras: true });
  para(arche.freines + (echoFreines ? ' ' + echoFreines : ''), { size: 10 });
  paraSources(sources.freines);
  para(txSync('En couple'), { size: 9.5, couleur: TURQUOISE, gras: true });
  // Task 78 — fusion ombre → « En couple » : ouverture + « Ton risque » dans
  // un ¶, « Ce qui aide » dans le second — identique à l'écran.
  para(arche.couple + (ombreParas[0] ? ' ' + ombreParas[0] : ''), { size: 10 });
  if (ombreParas[1]) para(ombreParas[1], { size: 10 });
  paraSources(sourcesCoupleFusion);
  para(txSync('Ce que ce profil te souffle'), { size: 9.5, couleur: CORAIL, gras: true });
  para(arche.equilibre, { size: 10 });
  paraSources(sources.equilibre);

  // ---- Tes N tendances (d'après tes réponses) — les mesures réelles
  section(titreTendances(apercu.bars.length));
  for (const barre of apercu.bars) {
    assurerPlace(26);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11.5);
    doc.setTextColor(...BLEU_NUIT);
    doc.text(barre.nom, MARGE, curseur.y);
    doc.setFontSize(10.5);
    doc.setTextColor(...TURQUOISE);
    doc.text(`· ${barre.pct}/100 · ${barre.palierLabel}`, 210 - MARGE, curseur.y, { align: 'right' });
    curseur.y += 3.6;
    const yBarre = curseur.y;
    doc.setFillColor(...CREME);
    doc.setDrawColor(...SABLE);
    doc.roundedRect(MARGE, yBarre, LARGEUR, 4.4, 2.2, 2.2, 'FD');
    if (barre.pct > 0) {
      doc.setFillColor(...couleurPalier(barre.palier));
      doc.roundedRect(MARGE, yBarre, Math.max(4.4, (LARGEUR * barre.pct) / 100), 4.4, 2.2, 2.2, 'F');
    }
    curseur.y += 8;
    // Task 78 — le texte de la carte cite les réponses réelles (identique à
    // l'écran) ; repli sur le texte de palier quand rien n'est tranché.
    para(texteTendanceDe(quete.id, barre.key, reponses, barre.texte) ?? barre.texte, { size: 10 });
    curseur.y += 1.4;
  }
  para(NOTA_BARRES, { size: 9.5, couleur: ENCRE_DOUCE, italique: true });

  // ---- Task 65 — Ta zone d'ombre en relation (le même contenu que l'écran :
  //      le contenu par variante existait, il n'était jamais imprimé ni rendu)
  //      — Task 78 : pas rendue pour les quêtes en FUSION (le risque vit dans
  //      « En couple », imprimé plus haut).
  const ombreRel = quete.ombreRelationnel[carte.id];
  if (!fusionOmbre && typeof ombreRel === 'string' && ombreRel.length > 0) {
    section(txSync("Ta zone d'ombre en relation (pdf)"));
    // Task 74 — deux paragraphes quand le texte en contient deux (séparateur
    // \n\n — V1 1.1 : « le risque » puis « ce qui aide »).
    for (const p of ombreRel.split('\n\n').filter((x) => x.trim().length > 0)) {
      para(p, { size: 10 });
    }
    paraSources(sources.ombre);
  }

  // ---- La suite de ton voyage (cliffhanger)
  section(txSync('La suite de ton voyage (pdf)'));
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
    txSync(
      'Ce document vient de tes réponses à la quête « {{quete}} » du {{monde}}. Il reste le tien : rien n\'est publié sur Wairyu sans ton action. Les textes d\'accompagnement sont une lecture d\'app — ils ne remplacent ni un professionnel, ni une étiquette.',
      { quete: quete.titre, monde: mondeDeQuete(quete.id).nom },
    ),
    { size: 8.8, couleur: ENCRE_DOUCE, italique: true },
  );

  // ---- pagination
  const pages = doc.getNumberOfPages();
  for (let p = 1; p <= pages; p += 1) {
    doc.setPage(p);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...ENCRE_DOUCE);
    doc.text(txSync('Wairyu — document personnel, généré le {{date}}', { date: dateLongue() }), MARGE, 289);
    doc.text(`${p} / ${pages}`, 210 - MARGE, 289, { align: 'right' });
  }

  doc.save(nomFichierPdf(quete));
}
