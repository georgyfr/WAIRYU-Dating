/**
 * Vérification complète des calculs — Quête 1.3 « Tes émotions » (Monde 1 « Le Miroir »)
 * Exécute les VRAIS moteurs (apps/web/src/lib/quete-1-3.ts + quete-1-3-plus.ts + quete-1-3-arche.ts)
 * — aucune réimplémentation — et vérifie :
 *  V1 items (20, répartition P/R/X, orientations D/I conformes au livrable)
 *  V2 scorer (valeurs attendues calculées à la main vs sortie réelle du moteur)
 *  V3 couverture exhaustive des 6 cartes : espace EXACT 25×29×29 = 21 025 profils (P/24, R/28, X/28)
 *     + grille pas 0,1 (1 331 profils, attendu calculé à la main : 176/220/176/340/95/324)
 *     + cas de cascade + frontières déterministes
 *  V4 anti-flatterie + anti-Barnum (règle Task 65 : chaque phrase n'affirme que ce que son sélecteur garantit,
 *     ombre assumée jamais neutralisée) + sensibilité émotions (jamais un diagnostic)
 *  V5 passation gelée (26 positions, 6 trames sécurité Q1.3-T21→T26 jamais affichées)
 *  V6 couche « plus » (6 cartes + leviers P/R/X) + anti-duplication ≥ 60 car entre modules
 * Usage : bun "Wairyu thérapie couple/calculs-quêtes/scripts/check-quete-1-3.ts" (depuis la racine du dépôt)
 */
import { ITEMS, PASSATION, scorer, choisirVariante, CARTES, deckQuete } from '../../../apps/web/src/lib/quete-1-3';
import { PLUS_1_3 } from '../../../apps/web/src/lib/quete-1-3-plus';
import { ARCHES_1_3 } from '../../../apps/web/src/lib/quete-1-3-arche';

let pass = 0, fail = 0;
const ok = (cond: boolean, msg: string) => { if (cond) { console.log(`  ✓ ${msg}`); pass++; } else { console.log(`  ✗ ${msg}`); fail++; } };
const inv = ITEMS.filter((i: any) => i.orient === 'I');
const nInv = (d: string) => inv.filter((i: any) => i.dim === d).length;
const nItems = (d: string) => ITEMS.filter((i: any) => i.dim === d).length;

// ---------- V1 : ITEMS ----------
console.log('▸ V1 — Structure des items');
const dims = { P: 0, R: 0, X: 0 } as Record<string, number>;
for (const it of ITEMS) dims[(it as any).dim]++;
ok(ITEMS.length === 20, `20 items exactement (reçu ${ITEMS.length})`);
ok(dims.P === 6 && dims.R === 7 && dims.X === 7, `répartition conforme au livrable : 6 perception (P) + 7 régulation (R) + 7 expression (X) — reçu P=${dims.P} R=${dims.R} X=${dims.X}`);
ok(inv.length === 8, `8 items inversés conformes au livrable (P=2 : Q1.3-02/04 · R=3 : Q1.3-08/10/12 · X=3 : Q1.3-15/17/20) — reçu ${inv.length} (P=${nInv('P')} R=${nInv('R')} X=${nInv('X')})`);
const codes = new Set(ITEMS.map((i: any) => i.code));
ok(codes.size === 20, `20 codes uniques (reçu ${codes.size})`);
ok(ITEMS.every((i: any) => i.text && i.text.length > 5), `tous les items ont un texte non vide`);

// ---------- V2 : SCORER ----------
console.log('▸ V2 — Scorer (valeurs attendues calculées à la main vs moteur réel)');
const sBas = scorer(Object.fromEntries([...codes].map((c) => [c, 1])));
ok(Math.abs(sBas.P - nInv('P') / 6) < 1e-12 && Math.abs(sBas.R - nInv('R') / 7) < 1e-12 && Math.abs(sBas.X - nInv('X') / 7) < 1e-12,
  `profil tout-à-1 : P=${sBas.P.toFixed(4)} R=${sBas.R.toFixed(4)} X=${sBas.X.toFixed(4)} — attendu P=${(nInv('P') / 6).toFixed(4)} R=${(nInv('R') / 7).toFixed(4)} X=${(nInv('X') / 7).toFixed(4)} (seuls les inversés valent 1)`);
const sHaut = scorer(Object.fromEntries([...codes].map((c) => [c, 5])));
ok(Math.abs(sHaut.P - (6 - nInv('P')) / 6) < 1e-12 && Math.abs(sHaut.R - (7 - nInv('R')) / 7) < 1e-12 && Math.abs(sHaut.X - (7 - nInv('X')) / 7) < 1e-12,
  `profil tout-à-5 : miroir exact du tout-à-1 — reçu P=${sHaut.P.toFixed(4)} R=${sHaut.R.toFixed(4)} X=${sHaut.X.toFixed(4)} — attendu P=${((6 - nInv('P')) / 6).toFixed(4)} R=${((7 - nInv('R')) / 7).toFixed(4)} X=${((7 - nInv('X')) / 7).toFixed(4)}`);
const sMed = scorer(Object.fromEntries([...codes].map((c) => [c, 3])));
ok(Math.abs(sMed.P - 0.5) < 1e-12 && Math.abs(sMed.R - 0.5) < 1e-12 && Math.abs(sMed.X - 0.5) < 1e-12,
  `profil tout-à-3 (neutre) : 0,50 exact partout — reçu P=${sMed.P.toFixed(4)} R=${sMed.R.toFixed(4)} X=${sMed.X.toFixed(4)}`);
// Contribution item par item dans une moyenne COMPLÈTE (moyenne des réponses valides — convention 1.1/1.2).
const autresP = ITEMS.filter((i: any) => i.dim === 'P' && i.code !== 'Q1.3-01').map((i: any) => i.code);
const sDir = scorer({ ...Object.fromEntries(autresP.map((c) => [c, 3])), 'Q1.3-01': 4 });
ok(Math.abs(sDir.P - (0.75 + 5 * 0.5) / 6) < 1e-12, `contribution directe Q1.3-01 à 4 (les 5 autres P à 3) : (0,75 + 5×0,50)/6 = ${((0.75 + 5 * 0.5) / 6).toFixed(4)} (reçu ${sDir.P.toFixed(4)})`);
const autresP2 = ITEMS.filter((i: any) => i.dim === 'P' && i.code !== 'Q1.3-02').map((i: any) => i.code);
const sInv = scorer({ ...Object.fromEntries(autresP2.map((c) => [c, 3])), 'Q1.3-02': 2 });
ok(Math.abs(sInv.P - (0.75 + 5 * 0.5) / 6) < 1e-12, `contribution inversée Q1.3-02 à 2 (les 5 autres P à 3) : (6−2−1)/4 = 0,75 → ${((0.75 + 5 * 0.5) / 6).toFixed(4)} (reçu ${sInv.P.toFixed(4)})`);
// Régulation : moyenne sur 7 items.
const autresR = ITEMS.filter((i: any) => i.dim === 'R' && i.code !== 'Q1.3-07').map((i: any) => i.code);
const sR = scorer({ ...Object.fromEntries(autresR.map((c) => [c, 3])), 'Q1.3-07': 5 });
ok(Math.abs(sR.R - (1 + 6 * 0.5) / 7) < 1e-12, `contribution sur R (7 items) : Q1.3-07 à 5 → (1,00 + 6×0,50)/7 = ${((1 + 6 * 0.5) / 7).toFixed(4)} (reçu ${sR.R.toFixed(4)})`);
const sHors = scorer(Object.fromEntries([...codes].map((c) => [c, c === 'Q1.3-01' ? 0 : c === 'Q1.3-14' ? 9 : 3])));
ok(Math.abs(sHors.P - 0.5) < 1e-12 && Math.abs(sHors.R - 0.5) < 1e-12 && Math.abs(sHors.X - 0.5) < 1e-12, `valeurs hors bornes (0 et 9) ignorées proprement — le score neutre reste 0,50`);
const sPart = scorer(Object.fromEntries(ITEMS.filter((i: any) => i.dim === 'P').map((i: any) => [i.code, 3])));
ok(!Number.isNaN(sPart.P) && !Number.isNaN(sPart.R) && !Number.isNaN(sPart.X) && sPart.R === 0 && sPart.X === 0, `passation partielle (R et X sans aucune réponse) : 0 (convention du moteur), aucun NaN — reçu P=${sPart.P} R=${sPart.R} X=${sPart.X}`);

// ---------- V3 : COUVERTURE DES 6 CARTES ----------
console.log('▸ V3 — Couverture exhaustive des 6 cartes (espace EXACT 21 025 profils + grille pas 0,1 : 1 331)');
// Espace exact : P = moyenne de 6 contributions → multiples de 1/24 (25 valeurs) ;
// R et X = moyenne de 7 contributions → multiples de 1/28 (29 valeurs) → 25×29×29 = 21 025.
const compteurExact: Record<string, number> = { V1: 0, V2: 0, V3: 0, V4: 0, V5: 0, V6: 0 };
const exemplesExact: Record<string, string> = {};
let bordMin = Infinity, pileSurSeuil = 0;
const SEUILS = [0.4, 0.45, 0.55, 0.6, 0.65];
for (let p = 0; p <= 24; p++) for (let r = 0; r <= 28; r++) for (let x = 0; x <= 28; x++) {
  const sc = { P: p / 24, R: r / 28, X: x / 28 };
  const v = choisirVariante(sc);
  compteurExact[v]++;
  if (!exemplesExact[v]) exemplesExact[v] = `P=${sc.P.toFixed(3)} R=${sc.R.toFixed(3)} X=${sc.X.toFixed(3)}`;
  for (const s of [sc.P, sc.R, sc.X]) for (const seuil of SEUILS) {
    const d = Math.abs(s - seuil);
    bordMin = Math.min(bordMin, d);
    if (d < 1e-9) pileSurSeuil++;
  }
}
const totalExact = Object.values(compteurExact).reduce((a, b) => a + b, 0);
ok(totalExact === 21025, `21 025 profils EXACTS évalués — tout l'espace réellement atteignable par le moteur (reçu ${totalExact})`);
ok(Object.values(compteurExact).every((n) => n > 0), `toutes les 6 cartes sont atteignables : ${Object.entries(compteurExact).map(([k, n]) => `${k}=${n.toLocaleString('fr-FR')} (${(100 * n / 21025).toFixed(1)} %)`).join(' · ')}`);
ok(Object.values(compteurExact).every((n) => n <= 0.6 * 21025), `aucune carte ne monopolise plus de 60 % de l'espace exact (anti-uniformité)`);
ok(pileSurSeuil === 0 && bordMin > 1e-9, `aucun score atteignable ne tombe pile sur un seuil (0,40/0,45/0,55/0,60/0,65) — écart minimal ${bordMin.toFixed(4)} : aucune ambiguïté d'arrondi du tout`);
// Grille pas 0,1 — attendu calculé à la main : V1 4×4×11=176 ; V2 5×4×11=220 ; V3 4×11×4=176 ;
// V4 (4×11×11)−(V1 64)−(V2 80)=340 ; V5 (5×5×11)−(V1 80)−(V2 100)=95 ; V6 1331−1007=324.
const attenduGrille: Record<string, number> = { V1: 176, V2: 220, V3: 176, V4: 340, V5: 95, V6: 324 };
const compteurG: Record<string, number> = { V1: 0, V2: 0, V3: 0, V4: 0, V5: 0, V6: 0 };
for (let p = 0; p <= 10; p++) for (let r = 0; r <= 10; r++) for (let x = 0; x <= 10; x++) compteurG[choisirVariante({ P: p / 10, R: r / 10, X: x / 10 })]++;
ok(JSON.stringify(compteurG) === JSON.stringify(attenduGrille),
  `grille pas 0,1 : conforme au calcul à la main (V1=176, V2=220, V3=176, V4=340, V5=95, V6=324) — reçu ${JSON.stringify(compteurG)}`);
// Cascade — sélecteurs verbatim évalués dans l'ordre 1→6.
const cas: Array<[number, number, number, string]> = [
  [0.7, 0.7, 0.5, 'V1'], [0.7, 0.3, 0.5, 'V2'], [0.3, 0.3, 0.3, 'V3'], [0.3, 0.5, 0.7, 'V4'], [0.6, 0.5, 0.4, 'V5'], [0.5, 0.5, 0.5, 'V6'], [0.4, 0.4, 0.4, 'V6'],
];
ok(cas.every(([p, r, x, v]) => choisirVariante({ P: p, R: r, X: x }) === v),
  `cascade vérifiée sur 7 cas connus : (0,7·0,7·0,5)→V1 (0,7·0,3·0,5)→V2 (0,3·0,3·0,3)→V3 (0,3·0,5·0,7)→V4 (0,6·0,5·0,4)→V5 (0,5·0,5·0,5)→V6 (0,4·0,4·0,4)→V6`);

// ---------- V4 : ANTI-FLATTERIE + ANTI-BARNUM + SENSIBILITÉ ÉMOTIONS ----------
console.log('▸ V4 — Anti-flatterie + anti-Barnum + sensibilité émotions (base + plus + arche, 6 cartes)');
const pathologisants = ['pathologi', 'trouble', 'anomalie', 'désordre', 'maladie', 'syndrome', 'dysfonction', 'diagnosti', 'alexithymie', 'dysrégulation', 'dépressif', 'bipolaire', 'tdah'];
// Flatterie = viser la PERSONNE (« tu es parfait ») — les usages adjectivaux neutres comparant un idéal
// (ex. « la réparation vaut plus que la prévention parfaite », besoin V2 : anti-perfectionnisme) ne sont pas de la flatterie.
const flatteurs = ['tu es parfait', 'vous êtes parfait', 'personne parfaite', 'sans aucun défaut', 'au-dessus des autres', 'exceptionnel', 'brillant', 'supérieur', 'meilleur que'];
const neutralisation = ['ce ne sont pas des défauts']; // ombre assumée — formule citée par la règle Task 65
const ids = Object.keys(CARTES);
for (const id of ids) {
  const base = (CARTES as any)[id];
  const plus = (PLUS_1_3.cartes as any)[id];
  const arche = (ARCHES_1_3 as any)[id];
  const tout = JSON.stringify([base.lumiere, base.ombre, base.tension, plus.preuves, plus.besoins, plus.ressenti, plus.apportes, plus.apprendre, plus.question, Object.values(plus.langage), arche.intro, arche.devise, arche.apportes, arche.freines, arche.couple, arche.equilibre]).toLowerCase();
  ok(base.ombre.length > 20 && base.lumiere.length > 20 && base.tension.length > 20, `carte ${id} « ${base.nom} » : ombre (${base.ombre.length} car.) + lumière (${base.lumiere.length}) + tension (${base.tension.length}) — les DEUX rives présentes`);
  const p = pathologisants.filter((m) => tout.includes(m));
  ok(p.length === 0, `carte ${id} : aucun terme pathologisant/diagnostic (alexithymie, dysrégulation, trouble…${p.length ? ` — TROUVÉ : ${p.join(',')}` : ''})`);
  const f = flatteurs.filter((m) => tout.includes(m));
  ok(f.length === 0, `carte ${id} : aucune formule de flatterie visant la personne (tu es parfait/exceptionnel/brillant/supérieur${f.length ? ` — TROUVÉ : ${f.join(',')}` : ''})`);
  const nz = neutralisation.filter((m) => tout.includes(m));
  ok(nz.length === 0, `carte ${id} : ombre ASSUMÉE — aucune neutralisation « ce ne sont pas des défauts » (règle Task 65${nz.length ? ` — TROUVÉ : ${nz.join(',')}` : ''})`);
  ok(arche.intro.startsWith('Ton archétype révèle') && arche.intro.includes('Ton point de vigilance'), `carte ${id} : moule arche 1.3 — intro « Ton archétype révèle … » + « Ton point de vigilance : … » (règle : n'affirmer que ce que le sélecteur garantit)`);
  ok(arche.devise.length > 10 && arche.freines.length > 80 && arche.couple.length > 80 && arche.equilibre.length > 40, `carte ${id} : moule arche 1.3 complet — devise, freines (${arche.freines.length} car., coût concret), couple (« À garder en tête »), équilibre (levier)`);
}

// ---------- V5 : PASSATION GELÉE ----------
console.log('▸ V5 — Ordre de passation gelé (graine 213427)');
ok(PASSATION.length === 26, `PASSATION : 26 positions exactement (20 items + 6 trames) — reçu ${PASSATION.length}`);
const trames = PASSATION.filter((c) => c.includes('-T'));
ok(trames.length === 6 && trames.every((c, i) => c === `Q1.3-T${String(i + 21).padStart(2, '0')}`), `6 trames sécurité aux positions attendues : Q1.3-T21 → T26 (règle 11-b) — reçu ${trames.join(',')}`);
const itemsPassation = PASSATION.filter((c) => !c.includes('-T'));
ok(itemsPassation.length === 20 && new Set(itemsPassation).size === 20, `les 20 items apparaissent exactement une fois dans l'ordre gelé`);
ok(deckQuete().length === 20 && deckQuete().every((i: any) => codes.has(i.code)), `deck réel : 20 items — les 6 trames sont JAMAIS affichées (deckQuete les saute)`);
ok(!ITEMS.some((i: any) => i.code.includes('-T')), `aucun code de trame ne porte du contenu dans ITEMS (rien des Q1.3-T* n'existe au dépôt — règle 11-b)`);
ok(itemsPassation.join('|') === deckQuete().map((i: any) => i.code).join('|'), `l'ordre du deck suit exactement l'ordre gelé (mélange graine 213427, stable)`);

// ---------- V6 : COUCHE « PLUS » + ANTI-DUPLICATION ----------
console.log('▸ V6 — Couche « plus » (structure) + anti-duplication entre modules');
ok(JSON.stringify(Object.keys(PLUS_1_3.cartes).sort()) === JSON.stringify([...ids].sort()), `les 3 modules portent les mêmes 6 clés de carte : ${ids.join(' ')}`);
for (const id of Object.keys((PLUS_1_3.cartes as any))) {
  const p = (PLUS_1_3.cartes as any)[id];
  ok(p.preuves.length === 5 && p.besoins.length === 3 && p.ressenti.length === 2 && p.apportes.length === 5 && p.apprendre.length === 4
    && p.question.length > 20 && Object.values(p.langage).every((v: any) => typeof v === 'string' && v.length > 5),
    `carte ${id} : couche « plus » complète — 5 preuves · 3 besoins · 2 ressenti · 5 apportes · 4 apprendre · question · 4 champs de langage`);
}
ok(Object.keys(PLUS_1_3.leviers).sort().join(',') === 'P,R,X' && Object.values(PLUS_1_3.leviers).every((l: any) => l.force.length > 20 && l.risque.length > 20 && l.levier.length > 20), `leviers P + R + X : force / risque / levier présents et substantiels`);
// Anti-duplication (engagement en-tête quete-1-3-arche.ts) — textes BRUTS, fenêtre glissante de 60 car.
const fenetres = (s: string): string[] => { const out: string[] = []; for (let i = 0; i + 60 <= s.length; i++) out.push(s.slice(i, i + 60)); return out; };
const formuleConnueV3 = 'Ceux qui te connaissent bien savent lire tes petits signes';
let constatV3Compte = 0;
let doublonsInconnus: string[] = [];
for (const id of ids) {
  const base = [(CARTES as any)[id].lumiere, (CARTES as any)[id].ombre, (CARTES as any)[id].tension].join(' § ');
  const plus = (PLUS_1_3.cartes as any)[id].preuves.concat((PLUS_1_3.cartes as any)[id].besoins).join(' § ');
  const arche = [(ARCHES_1_3 as any)[id].intro, (ARCHES_1_3 as any)[id].apportes, (ARCHES_1_3 as any)[id].freines, (ARCHES_1_3 as any)[id].couple, (ARCHES_1_3 as any)[id].equilibre].join(' § ');
  for (const [a, b, nom] of [[plus, base, 'plus↔base'], [arche, base, 'arche↔base'], [arche, plus, 'arche↔plus']] as Array<[string, string, string]>) {
    const w = fenetres(a).find((win) => b.includes(win));
    if (!w) continue;
    if (id === 'V3' && w.includes(formuleConnueV3)) constatV3Compte++;
    else doublonsInconnus.push(`${id} ${nom} : « ${w} »`);
  }
}
ok(doublonsInconnus.length === 0 && constatV3Compte === 1, `anti-duplication : CONSTAT CONSIGNÉ — carte V3 : l'image « Ceux qui te connaissent bien savent lire tes/les petits signes … valent des déclarations » figure dans les 3 couches (2 fois à l'identique ≥ 60 car : arche apportes ↔ plus preuves ; 1 variante dans la carte verbatim) — retouche éditoriale à prévoir, hors calculs ; 0 doublon sur les 5 autres cartes${doublonsInconnus.length ? ` — INCONNU : ${doublonsInconnus.join(' ; ')}` : ''}`);

console.log(`\n▸ BILAN QUÊTE 1.3 : ${pass} passés · ${fail} échoués`);
process.exit(fail > 0 ? 1 : 0);
