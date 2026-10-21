/**
 * Vérification complète des calculs — Quête 1.4 « Ton contrôle sur toi-même » (Monde 2 « Le Volant »)
 * Exécute les VRAIS moteurs (apps/web/src/lib/quete-1-4.ts + quete-1-4-def.ts + quete-1-4-arche.ts)
 * — aucune réimplémentation — et vérifie :
 *  V1 items (8 items carte + 1 trame fiabilité Q1.4-01.r JAMAIS affichée ni scorée, règle 11-b ;
 *      4 directs / 4 inversés conformes au livrable ; mono-dimension autocontrole)
 *  V2 scorer (valeurs attendues calculées à la main vs sortie réelle du moteur ;
 *      BIT-EXACTITUDE : tout l'espace k/32 est dyadique → écart strictement === 0)
 *  V3 couverture exhaustive des 5 cartes : espace EXACT 33 scores (k/32, k=0..32, tous atteignables)
 *      + grille pas 0,1 (11 points, attendu calculé à la main : 3/2/1/2/3)
 *      + espace RÉPONSE 5^8 = 390 625 vecteurs, conforme au calcul analytique indépendant
 *        (coefficients entiers de (1+x+x²+x³+x⁴)^8)
 *      + cas de cascade + frontières (0,75 atteint PILE et déterministe ; 0,60/0,45/0,30 jamais pile)
 *  V4 anti-flatterie + non-pathologisation + neutralité normative (barre jamais flattée ni blâmée)
 *      + moules verbatim/def/arche (gabarit Task 35) + aucune métadonnée moteur dans les textes rendus
 *  V5 passation gelée (graine 214427, 8 positions, 0 trame ▲ — le doublon 01.r hors passation)
 *  V6 anti-duplication ≥ 60 car entre les 3 couches (base ↔ def ↔ arche)
 * Usage : bun "Wairyu thérapie couple/calculs-quêtes/scripts/check-quete-1-4.ts" (depuis la racine du dépôt)
 */
import { ITEMS, PASSATION, deckQuete, scorer, choisirVariante, CARTES, BRIEFING, COMPLETION } from '../../../apps/web/src/lib/quete-1-4';
import { DEF_14 } from '../../../apps/web/src/lib/quete-1-4-def';
import { ARCHES_1_4 } from '../../../apps/web/src/lib/quete-1-4-arche';

let pass = 0, fail = 0;
const ok = (cond: boolean, msg: string) => { if (cond) { console.log(`  ✓ ${msg}`); pass++; } else { console.log(`  ✗ ${msg}`); fail++; } };

const CODES_CARTE = ['Q1.4-01', 'Q1.4-02', 'Q1.4-03', 'Q1.4-04', 'Q1.4-05', 'Q1.4-06', 'Q1.4-07', 'Q1.4-08'];
const TRAME = 'Q1.4-01.r';
const itemsParCode = new Map(ITEMS.map((i: any) => [i.code, i]));
const directs = ITEMS.filter((i: any) => i.orient === 'D' && i.code !== TRAME).map((i: any) => i.code);
const inverses = ITEMS.filter((i: any) => i.orient === 'I').map((i: any) => i.code);
const ids = Object.keys(CARTES);

/** Profil de réponses RÉEL atteignant exactement k/32 (k en quarts de contribution, 0..32) :
 *  q items à contribution 1, un item à rem/4, les autres à 0 — passe par les vraies réponses Likert. */
function profilPourK(k: number): Record<string, number> {
  const q = Math.floor(k / 4), rem = k - 4 * q;
  const reps: Record<string, number> = {};
  PASSATION.forEach((code, idx) => {
    const it: any = itemsParCode.get(code);
    let c = 0;
    if (idx < q) c = 1; else if (idx === q && rem > 0) c = rem / 4;
    reps[code] = it.orient === 'D' ? 4 * c + 1 : 5 - 4 * c;
  });
  return reps;
}

// ---------- V1 : ITEMS ----------
console.log('▸ V1 — Structure des items (8 carte + 1 trame fiabilité) + briefing/complétion');
ok(ITEMS.length === 9, `9 entrées dans ITEMS : 8 items carte + 1 doublon fiabilité Q1.4-01.r (reçu ${ITEMS.length})`);
const codes = new Set(ITEMS.map((i: any) => i.code));
ok(codes.size === 9, `9 codes uniques, aucun doublon de code (reçu ${codes.size})`);
ok(CODES_CARTE.every((c) => codes.has(c)), `les 8 codes carte Q1.4-01 → Q1.4-08 sont tous présents`);
ok(directs.length === 4 && inverses.length === 4
  && JSON.stringify(directs.sort()) === JSON.stringify(['Q1.4-01', 'Q1.4-03', 'Q1.4-05', 'Q1.4-07'])
  && JSON.stringify(inverses.sort()) === JSON.stringify(['Q1.4-02', 'Q1.4-04', 'Q1.4-06', 'Q1.4-08']),
  `orientations conformes au livrable : 4 directs (01/03/05/07) + 4 inversés (02/04/06/08)`);
ok(ITEMS.every((i: any) => i.dim === 'autocontrole'), `quête MONO-DIMENSION : les 9 entrées portent la dimension unique « autocontrole »`);
ok(ITEMS.every((i: any) => typeof i.text === 'string' && i.text.length > 5), `tous les énoncés sont présents, aucun vide (9/9)`);
ok(codes.has(TRAME) && !PASSATION.includes(TRAME), `la trame fiabilité Q1.4-01.r (règle 11-b) existe dans ITEMS mais est HORS passation — jamais affichée`);
ok(BRIEFING.annonce.length > 40 && BRIEFING.aQuoiCaSert.length === 4 && BRIEFING.resultats.length === 3,
  `briefing complet : annonce verbatim + 4 puces « à quoi ça sert » + 3 puces résultats`);
ok([COMPLETION.entete, COMPLETION.labelOmbre, COMPLETION.labelTension, COMPLETION.fenetre, COMPLETION.miroirNote].every((t) => typeof t === 'string' && t.length > 5),
  `fenêtre de complétion complète (entête, labels, fenêtre, note miroir)`);

// ---------- V2 : SCORER ----------
console.log('▸ V2 — Scorer (attendu calculé à la main vs moteur réel) + bit-exactitude');
const toutA = (r: number) => Object.fromEntries(CODES_CARTE.map((c) => [c, r]));
const s1 = scorer(toutA(1));
ok(Math.abs(s1.autocontrole - 0.5) < 1e-12, `tout-à-1 : 0,50 — les 4 inversés valent 1 et les 4 directs 0 → (4×1,00 + 4×0,00)/8 (reçu ${s1.autocontrole.toFixed(4)})`);
const s5 = scorer(toutA(5));
ok(Math.abs(s5.autocontrole - 0.5) < 1e-12, `tout-à-5 : 0,50 — MIROIR du tout-à-1 (équilibre 4D/4I : les deux extrêmes se rejoignent) (reçu ${s5.autocontrole.toFixed(4)})`);
const s3 = scorer(toutA(3));
ok(s3.autocontrole === 0.5, `tout-à-3 (neutre) : 0,50 exact (reçu ${s3.autocontrole.toFixed(4)})`);
const autres01 = CODES_CARTE.filter((c) => c !== 'Q1.4-01');
const sDir = scorer({ ...Object.fromEntries(autres01.map((c) => [c, 3])), 'Q1.4-01': 4 });
ok(Math.abs(sDir.autocontrole - (0.75 + 7 * 0.5) / 8) < 1e-12, `contribution directe Q1.4-01 à 4 (7 autres à 3) : (0,75 + 7×0,50)/8 = ${((0.75 + 7 * 0.5) / 8).toFixed(5)} (reçu ${sDir.autocontrole.toFixed(5)})`);
const autres02 = CODES_CARTE.filter((c) => c !== 'Q1.4-02');
const sInv = scorer({ ...Object.fromEntries(autres02.map((c) => [c, 3])), 'Q1.4-02': 2 });
ok(Math.abs(sInv.autocontrole - (0.75 + 7 * 0.5) / 8) < 1e-12, `contribution inversée Q1.4-02 à 2 (7 autres à 3) : (6−2−1)/4 = 0,75 → ${((0.75 + 7 * 0.5) / 8).toFixed(5)} (reçu ${sInv.autocontrole.toFixed(5)})`);
// Bit-exactitude : l'espace complet k/32 est dyadique → écart STRICTEMENT nul, pas une tolérance.
const ecartMax = Math.max(...Array.from({ length: 33 }, (_, k) => Math.abs(scorer(profilPourK(k)).autocontrole - k / 32)));
ok(ecartMax === 0, `BIT-EXACT : les 33 profils réels construits (k=0..32) donnent score === k/32 à l'UC près — écart maximal STRICTEMENT ${ecartMax} (espace dyadique, zéro ambiguïté flottante)`);
const sTrame = scorer({ ...toutA(3), [TRAME]: 5 });
ok(sTrame.autocontrole === 0.5, `la trame 01.r n'entre JAMAIS dans le score : tout-à-3 + 01.r à 5 → 0,50 inchangé (reçu ${sTrame.autocontrole.toFixed(4)})`);
const sTrameSeule = scorer({ [TRAME]: 5 });
ok(sTrameSeule.autocontrole === 0 && !Number.isNaN(sTrameSeule.autocontrole), `01.r seule réponse → 0 (convention), aucun NaN — le scorer ne parcourt que les codes de PASSATION`);
const sHors = scorer(Object.fromEntries(CODES_CARTE.map((c) => [c, c === 'Q1.4-01' ? 0 : c === 'Q1.4-08' ? 9 : 3])));
ok(sHors.autocontrole === 0.5, `valeurs hors bornes (0 et 9) ignorées proprement — le score neutre reste 0,50`);
const sPart = scorer(Object.fromEntries(directs.map((c) => [c, 5])));
ok(sPart.autocontrole === 1 && !Number.isNaN(sPart.autocontrole), `passation partielle : moyenne des SEULES réponses valides (4 directs à 5 → 1,00), aucun NaN (reçu ${sPart.autocontrole.toFixed(4)})`);
const sVide = scorer({});
ok(sVide.autocontrole === 0 && !Number.isNaN(sVide.autocontrole), `aucune réponse → 0 (convention du moteur), aucun NaN`);

// ---------- V3 : COUVERTURE DES 5 CARTES ----------
console.log('▸ V3 — Couverture exhaustive des 5 cartes (espace EXACT 33 scores + grille 0,1 + espace RÉPONSE 390 625)');
// Carte attendue pour une somme S en quarts (seuils ENTIERS, calcul indépendant du moteur) :
// V1 : S ≥ 24 (score ≥ 0,75) · V2 : 20-23 · V3 : 15-19 · V4 : 10-14 · V5 : 0-9.
const carteDeSomme = (S: number) => S >= 24 ? 'V1' : S >= 20 ? 'V2' : S >= 15 ? 'V3' : S >= 10 ? 'V4' : 'V5';
const attenduExact: Record<string, number> = { V1: 9, V2: 4, V3: 5, V4: 5, V5: 10 };
const compteExact: Record<string, number> = { V1: 0, V2: 0, V3: 0, V4: 0, V5: 0 };
let conformeParK = true;
for (let k = 0; k <= 32; k++) {
  const v = choisirVariante(scorer(profilPourK(k)));
  compteExact[v]++;
  if (v !== carteDeSomme(k)) conformeParK = false;
}
const totalExact = Object.values(compteExact).reduce((a, b) => a + b, 0);
ok(totalExact === 33 && conformeParK && JSON.stringify(compteExact) === JSON.stringify(attenduExact),
  `espace EXACT : 33/33 scores réellement atteignables (k/32), balayés par RÉELLES réponses Likert — répartition conforme au calcul à la main : V1=9 (k≥24) · V2=4 (20-23) · V3=5 (15-19) · V4=5 (10-14) · V5=10 (0-9) — reçu ${JSON.stringify(compteExact)}`);
ok(Object.values(compteExact).every((n) => n > 0), `les 5 cartes sont atteignables : ${Object.entries(compteExact).map(([k, n]) => `${k}=${n} (${(100 * n / 33).toFixed(1)} %)`).join(' · ')} — aucune zone morte`);
ok(Object.values(compteExact).every((n) => n <= 0.6 * 33), `aucune carte ne monopolise plus de 60 % de l'espace (anti-uniformité — max ${Math.max(...Object.values(compteExact))}/33)`);
// Frontières : 0,75 atteint PILE (24/32) et DÉTERMINISTE (dyadique exact) ; 0,60/0,45/0,30 jamais pile.
const prof24 = profilPourK(24);
ok(scorer(prof24).autocontrole === 0.75 && choisirVariante(scorer(prof24)) === 'V1',
  `frontière déterministe : le seuil 0,75 EST atteignable pile (24/32) et exact en binaire → V1 sans aucune ambiguïté d'arrondi (comparaison inclusive ≥)`);
const ecarts = [0.6, 0.45, 0.3].map((t) => Math.min(...Array.from({ length: 33 }, (_, k) => Math.abs(k / 32 - t))));
const ecartMin = Math.min(...ecarts);
ok(ecartMin > 1e-9 && Math.abs(ecartMin - 0.00625) < 1e-12, `les 3 autres seuils (0,60 / 0,45 / 0,30) ne sont JAMAIS atteints pile — écart minimal 0,00625 (19/32 ↔ 0,60), reçu ${ecartMin.toFixed(5)} : aucune ambiguïté possible`);
// Grille pas 0,1 — attendu calculé à la main : V5 {0;0,1;0,2}=3 · V4 {0,3;0,4}=2 · V3 {0,5}=1 · V2 {0,6;0,7}=2 · V1 {0,8;0,9;1,0}=3.
const attenduGrille: Record<string, number> = { V1: 3, V2: 2, V3: 1, V4: 2, V5: 3 };
const compteGrille: Record<string, number> = { V1: 0, V2: 0, V3: 0, V4: 0, V5: 0 };
for (let p = 0; p <= 10; p++) compteGrille[choisirVariante({ autocontrole: p / 10 })]++;
ok(JSON.stringify(compteGrille) === JSON.stringify(attenduGrille), `grille pas 0,1 : conforme au calcul à la main (V1=3, V2=2, V3=1, V4=2, V5=3) — reçu ${JSON.stringify(compteGrille)}`);
// Cascade — sélecteurs verbatim évalués dans l'ordre 1 → 5.
const cas: Array<[number, string]> = [[1, 'V1'], [0.7, 'V2'], [0.59375, 'V3'], [0.5, 'V3'], [0.44, 'V4'], [0.3125, 'V4'], [0.29, 'V5'], [0, 'V5']];
ok(cas.every(([s, v]) => choisirVariante({ autocontrole: s }) === v),
  `cascade vérifiée sur 8 cas connus : 1,0→V1 · 0,70→V2 · 0,59375→V3 · 0,50→V3 · 0,44→V4 · 0,3125→V4 · 0,29→V5 · 0→V5 (ordre 1→5, repli V5)`);
// Espace RÉPONSE : les 5^8 = 390 625 vecteurs de réponses Likert, tous passés dans le VRAI scorer.
const compteRep: Record<string, number> = { V1: 0, V2: 0, V3: 0, V4: 0, V5: 0 };
let bitFails = 0;
const idx5 = new Array(8).fill(0);
for (let n = 0; n < 390625; n++) {
  const reps: Record<string, number> = {};
  let S = 0;
  for (let p = 0; p < 8; p++) {
    const code = PASSATION[p];
    const it: any = itemsParCode.get(code);
    const r = idx5[p] + 1;
    reps[code] = r;
    S += it.orient === 'D' ? r - 1 : 5 - r;
  }
  const sc = scorer(reps);
  if (sc.autocontrole !== S / 32) bitFails++;
  compteRep[choisirVariante(sc)]++;
  for (let p = 0; p < 8; p++) { idx5[p]++; if (idx5[p] < 5) break; idx5[p] = 0; }
}
// Attendu analytique INDÉPENDANT : coefficients entiers de (1+x+x²+x³+x⁴)^8.
const coef = new Array(33).fill(0); coef[0] = 1;
for (let item = 1; item <= 8; item++) {
  const next = new Array(33).fill(0);
  for (let s = 0; s <= 4 * (item - 1); s++) for (let d = 0; d <= 4; d++) next[s + d] += coef[s];
  for (let s = 0; s < 33; s++) coef[s] = next[s];
}
const attenduRep: Record<string, number> = { V1: 0, V2: 0, V3: 0, V4: 0, V5: 0 };
for (let S = 0; S <= 32; S++) attenduRep[carteDeSomme(S)] += coef[S];
const totalRep = Object.values(compteRep).reduce((a, b) => a + b, 0);
ok(totalRep === 390625 && bitFails === 0, `espace RÉPONSE : 390 625/390 625 vecteurs Likert passés dans le vrai scorer — score === S/32 BIT-EXACT sur CHAQUE vecteur (0 exception)`);
ok(JSON.stringify(compteRep) === JSON.stringify(attenduRep),
  `répartition sur l'espace réponse CONFORME au calcul analytique indépendant (coefficients de (1+x+x²+x³+x⁴)^8) : V1=${compteRep.V1.toLocaleString('fr-FR')} · V2=${compteRep.V2.toLocaleString('fr-FR')} · V3=${compteRep.V3.toLocaleString('fr-FR')} · V4=${compteRep.V4.toLocaleString('fr-FR')} · V5=${compteRep.V5.toLocaleString('fr-FR')}`);
const compteExact2: Record<string, number> = { V1: 0, V2: 0, V3: 0, V4: 0, V5: 0 };
for (let k = 0; k <= 32; k++) compteExact2[choisirVariante(scorer(profilPourK(k)))]++;
ok(JSON.stringify(compteExact2) === JSON.stringify(compteExact), `déterminisme : le balayage complet des 33 profils rejoué à l'identique — cascade purement fonctionnelle, reproductible sur toute machine`);

// ---------- V4 : CONTENU — ANTI-FLATTERIE, NON-PATHOLOGISATION, NEUTRALITÉ NORMATIVE ----------
console.log('▸ V4 — Contenu des 3 couches (verbatim + registre def + arche) : anti-flatterie, neutralité, moules');
// « désordre » est exclu de la liste : il figure dans le freine V1 au sens courant (le désordre non prévu),
// pas au sens clinique — adaptation consignée ici plutôt que faux positif.
const pathologisants = ['pathologi', 'trouble', 'anomalie', 'maladie', 'syndrome', 'dysfonction', 'diagnosti', 'alexithymie', 'tdah', 'dépressif', 'bipolaire', 'addiction', 'compulsion'];
const flatteurs = ['tu es parfait', 'vous êtes parfait', 'personne parfaite', 'sans aucun défaut', 'au-dessus des autres', 'exceptionnel', 'brillant', 'supérieur', 'meilleur que'];
const denegations = ['ce ne sont pas des défauts', "ce n'est pas un défaut"]; // sur la couche VERBATIM uniquement —
// dans l'arche, la formule « Ce ne sont pas des défauts — juste ce qui émerge quand… » est le MOULE même du
// gabarit Task 35 (identique quête 1.1) : elle y est exigée et vérifiée présente 5/5 plus bas.
for (const id of ids) {
  const base: any = (CARTES as any)[id];
  const arche: any = (ARCHES_1_4 as any)[id];
  ok(base.lumiere.length > 100 && base.ombre.length > 20 && base.tension.length > 10,
    `carte ${id} « ${base.nom} » : lumière (${base.lumiere.length} car.) + ombre assumée (${base.ombre.length} car.) + tension (${base.tension.length} car.) — les DEUX rives présentes`);
  const tout = JSON.stringify([base.lumiere, base.ombre, base.tension, arche.intro, arche.devise, arche.apportes, arche.freines, arche.couple, arche.equilibre, (DEF_14.ombreRelationnel as any)[id]]).toLowerCase();
  const p = pathologisants.filter((m) => tout.includes(m));
  ok(p.length === 0, `carte ${id} : aucun terme pathologisant/diagnostic (trouble, syndrome, addiction…${p.length ? ` — TROUVÉ : ${p.join(',')}` : ''})`);
  const f = flatteurs.filter((m) => tout.includes(m));
  ok(f.length === 0, `carte ${id} : aucune formule de flatterie visant la personne — neutralité normative du Livrable (aucun palier flatté${f.length ? ` — TROUVÉ : ${f.join(',')}` : ''})`);
  // Portée VERBATIM uniquement : dans l'arche, « Ce ne sont pas des défauts — juste ce qui émerge quand… »
  // est le MOULE exigé par le gabarit Task 35 (vérifié présent 5/5 plus bas) — ce n'est pas une dénégation là où elle est prescrite.
  const d = denegations.filter((m) => JSON.stringify([base.lumiere, base.ombre, base.tension]).toLowerCase().includes(m));
  ok(d.length === 0, `carte ${id} : ombre ASSUMÉE dans la couche verbatim — aucune dénégation${d.length ? ` — TROUVÉ : ${d.join(',')}` : ''}`);
  ok(arche.intro.startsWith('Ton archétype révèle') && arche.intro.includes('Ton point de vigilance'),
    `carte ${id} : moule arche (gabarit Task 35) — intro « Ton archétype révèle … » + « Ton point de vigilance : … »`);
  ok(arche.freines.includes('Ce ne sont pas des défauts') && arche.freines.includes('ce qui émerge quand'),
    `carte ${id} : moule arche — freines refermés « Ce ne sont pas des défauts — juste ce qui émerge quand… » (même gabarit que la quête 1.1)`);
  ok(arche.couple.includes('À garder en tête') && arche.couple.length > 80, `carte ${id} : moule arche — « En couple » avec « À garder en tête : … » (${arche.couple.length} car.)`);
  ok(arche.equilibre.includes('Non parce que') && /mais parce qu[e']/.test(arche.equilibre), `carte ${id} : moule arche — équilibre « Non parce que…, mais parce qu(e)… » (élision « parce qu' » acceptée)`);
  ok(arche.devise.length > 10 && arche.apportes.length > 80, `carte ${id} : moule arche — devise + apportes substantiels (${arche.apportes.length} car.)`);
}
ok(DEF_14.dims.length === 1 && DEF_14.dims[0].key === 'autocontrole' && DEF_14.dims[0].lecture.length > 100,
  `registre DEF_14 : 1 dimension « autocontrole » (Ton auto-contrôle — ${DEF_14.dims[0].sousLigne}), lecture substantielle (${DEF_14.dims[0].lecture.length} car.)`);
const acc = DEF_14.accompagnement.autocontrole;
ok(acc.fort.length > 40 && acc.equilibre.length > 40 && acc.doux.length > 40
  && acc.fort.includes('ça tient') && acc.doux.includes('partent vite'),
  `registre DEF_14 : accompagnement fort / equilibre / doux — SENS DE LA BARRE NON INVERSÉ (fort = promesses tenues, doux = elles se renégocient), aucun palier flatté ni blâmé`);
ok(Object.keys(DEF_14.ombreRelationnel).sort().join(',') === 'V1,V2,V3,V4,V5'
  && Object.values(DEF_14.ombreRelationnel).every((v: any) => v.length > 80),
  `registre DEF_14 : ombre relationnelle présente pour les 5 cartes (dynamique possible, jamais une promesse)`);
ok(DEF_14.conseils.length === 4 && DEF_14.commentLire.length > 80 && DEF_14.suivante === '1.5'
  && DEF_14.suite.questions.length === 2 && DEF_14.suite.cta.length > 5,
  `registre DEF_14 : 4 conseils + commentLire (${DEF_14.commentLire.length} car.) + chaîne vers 1.5 + cliffhanger complet`);
// Aucune métadonnée moteur dans les textes rendus (règle d'en-tête : aucun code, score, sigle ou seuil).
// Valeurs SEULEMENT (les CLÉS d'objet — « autocontrole », « V1 »… « V5 » — sont des métadonnées légitimes,
// jamais du rendu : les sérialiser ferait un faux positif, corrigé ici).
const texteArcheScan = (id: string) => [(ARCHES_1_4 as any)[id].intro, (ARCHES_1_4 as any)[id].devise, (ARCHES_1_4 as any)[id].apportes, (ARCHES_1_4 as any)[id].freines, (ARCHES_1_4 as any)[id].couple, (ARCHES_1_4 as any)[id].equilibre].join(' § ');
const toutRendu = JSON.stringify([
  Object.values(CARTES).flatMap((c: any) => [c.nom, c.lumiere, c.ombre, c.tension]),
  BRIEFING, COMPLETION,
  DEF_14.dims.map((d: any) => [d.nom, d.sousLigne, d.lecture]),
  Object.values(DEF_14.accompagnement.autocontrole), DEF_14.conseils, DEF_14.commentLire,
  Object.values(DEF_14.ombreRelationnel), DEF_14.suite.titre, DEF_14.suite.intro, DEF_14.suite.questions, DEF_14.suite.cta,
  ids.map((id) => texteArcheScan(id)),
]).toLowerCase();
const meta = ['q1.4', 'autocontrole', /0[,.]\s?75/, /0[,.]\s?60/, /0[,.]\s?45/, /0[,.]\s?30/, /\bv[1-5]\b/].filter((m) => (m instanceof RegExp) ? m.test(toutRendu) : toutRendu.includes(m));
ok(meta.length === 0, `aucune métadonnée moteur dans les textes rendus (codes Q1.4-, clé de dimension, jetons V1-V5, seuils 0,75/0,60/0,45/0,30${meta.length ? ` — TROUVÉ : ${meta.join(',')}` : ''})`);

// ---------- V5 : PASSATION GELÉE ----------
console.log('▸ V5 — Ordre de passation gelé (graine 214427, 8 positions, 0 trame ▲)');
ok(PASSATION.length === 8, `PASSATION : 8 positions exactement (reçu ${PASSATION.length})`);
ok(PASSATION.join('|') === 'Q1.4-03|Q1.4-08|Q1.4-07|Q1.4-06|Q1.4-05|Q1.4-04|Q1.4-02|Q1.4-01',
  `ordre gelé épinglé (02-plan-de-melange, graine 214427) : 03 → 08 → 07 → 06 → 05 → 04 → 02 → 01`);
ok(!PASSATION.some((c) => c.includes('-T')), `AUCUNE trame ▲ dans la passation (livrable : 0 trame — différence structurelle avec les quêtes 1.1-1.3)`);
ok(new Set(PASSATION).size === 8 && CODES_CARTE.every((c) => PASSATION.includes(c)), `les 8 items carte apparaissent exactement une fois dans l'ordre gelé`);
ok(!PASSATION.includes(TRAME), `le doublon Q1.4-01.r est HORS passation (trame fiabilité longitudinale, règle 11-b)`);
const deck = deckQuete();
ok(deck.length === 8 && deck.every((i) => i.code !== TRAME && codes.has(i.code)), `deck réel : 8 items — la trame 01.r n'y figure JAMAIS`);
ok(deck.map((i) => i.code).join('|') === PASSATION.join('|'), `l'ordre du deck suit exactement l'ordre gelé (passation identique pour toute personne)`);
ok(JSON.stringify(deckQuete()) === JSON.stringify(deck), `deck stable : deux appels donnent le même deck à l'identique`);

// ---------- V6 : ANTI-DUPLICATION ENTRE LES 3 COUCHES ----------
console.log('▸ V6 — Anti-duplication entre les 3 couches (fenêtre glissante ≥ 60 caractères)');
const fenetres = (s: string): string[] => { const out: string[] = []; for (let i = 0; i + 60 <= s.length; i++) out.push(s.slice(i, i + 60)); return out; };
const texteBase = (id: string) => [(CARTES as any)[id].lumiere, (CARTES as any)[id].ombre, (CARTES as any)[id].tension].join(' § ');
const texteArche = texteArcheScan;
const texteDef = [DEF_14.dims.map((d: any) => d.lecture).join(' § '), DEF_14.accompagnement.autocontrole.fort, DEF_14.accompagnement.autocontrole.equilibre, DEF_14.accompagnement.autocontrole.doux, ...Object.values(DEF_14.ombreRelationnel), ...DEF_14.conseils, DEF_14.commentLire, DEF_14.suite.intro].join(' § ');
const hits: Array<{ id: string; nom: string; w: string }> = [];
for (const id of ids) {
  const paires: Array<[string, string, string]> = [
    [texteDef, texteBase(id), 'def↔base'],
    [texteArche(id), texteBase(id), 'arche↔base'],
    [texteArche(id), texteDef, 'arche↔def'],
  ];
  for (const [a, b, nom] of paires) {
    for (const w of fenetres(a)) if (b.includes(w)) { hits.push({ id, nom, w }); break; }
  }
}
// Chaque fenêtre trouvée doit appartenir à la formule connue et consignée ci-dessous (constat §3 du document).
const formuleConnueV4 = 'une seule promesse en cours à la fois — petite, datée, terminée';
const connus = hits.filter((h) => h.id === 'V4' && h.nom === 'arche↔def' && formuleConnueV4.includes(h.w));
const inconnus = hits.filter((h) => !connus.includes(h));
const presenteAuxDeux = texteArche('V4').toLowerCase().includes(formuleConnueV4) && texteDef.toLowerCase().includes(formuleConnueV4);
ok(inconnus.length === 0 && connus.length === 1 && presenteAuxDeux,
  `anti-duplication : CONSTAT CONSIGNÉ — carte V4 : la formule « une seule promesse en cours à la fois — petite, datée, terminée » (${formuleConnueV4.length} car.) figure à l'identique dans 2 couches (arche V4 « Ton équilibre » ↔ def ombre relationnelle V4 « Ce qui aide ») — retouche éditoriale à la décision du fondateur, hors calculs ; 0 doublon sur les 4 autres cartes et les autres paires${inconnus.length ? ` — INCONNU : ${inconnus.map((h) => `${h.id} ${h.nom} : « ${h.w} »`).join(' ; ')}` : ''}`);

console.log(`\n▸ BILAN QUÊTE 1.4 : ${pass} passés · ${fail} échoués`);
process.exit(fail > 0 ? 1 : 0);
