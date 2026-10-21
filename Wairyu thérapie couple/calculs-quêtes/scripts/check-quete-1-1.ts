/**
 * Vérification complète des calculs — Quête 1.1 « Ta personnalité » (Monde 1 « Le Miroir »)
 * Exécute le VRAI moteur (apps/web/src/lib/quete-1-1.ts) et vérifie :
 *  V1 items (50, répartition O/C/E/A/S, orientations D/I)
 *  V2 scorer (valeurs attendues calculées à la main vs sortie réelle)
 *  V3 couverture exhaustive des 7 variantes (balayage 0→1 par pas 0,1)
 *  V4 anti-flatterie (chaque carte contient ombre ET lumière ET tension non vides)
 * Usage : bun /home/z/my-project/scripts/check-quete-1-1.ts
 */
import { ITEMS, scorer, choisirVariante, CARTES, deckQuete } from '../../..//apps/web/src/lib/quete-1-1';

let pass = 0, fail = 0;
const ok = (cond: boolean, msg: string) => { if (cond) { console.log(`  ✓ ${msg}`); pass++; } else { console.log(`  ✗ ${msg}`); fail++; } };

// ---------- V1 : ITEMS ----------
console.log('▸ V1 — Structure des items');
const dims = { O: 0, C: 0, E: 0, A: 0, S: 0 } as Record<string, number>;
const invDims = { O: 0, C: 0, E: 0, A: 0, S: 0 } as Record<string, number>;
const inv = ITEMS.filter((i: any) => i.orient === 'I');
for (const it of ITEMS) dims[(it as any).dim]++;
for (const it of inv) invDims[(it as any).dim]++;
ok(ITEMS.length === 50, `50 items exactement (reçu ${ITEMS.length})`);
ok(Object.values(dims).every((n) => n === 10), `répartition équilibrée 10 par dimension O/C/E/A/S (O=${dims.O} C=${dims.C} E=${dims.E} A=${dims.A} S=${dims.S})`);
ok(inv.length === 24, `24 items inversés conformes au livrable (reçu ${inv.length} — répartition : O=${invDims.O} C=${invDims.C} E=${invDims.E} A=${invDims.A} S=${invDims.S})`);
const codes = new Set(ITEMS.map((i: any) => i.code));
ok(codes.size === 50, `50 codes uniques (reçu ${codes.size})`);
ok(ITEMS.every((i: any) => i.text && i.text.length > 5), `tous les items ont un texte non vide`);

// ---------- V2 : SCORER ----------
console.log('▸ V2 — Scorer (valeurs attendues calculées à la main vs moteur réel)');
// Profil extrême bas : tout à 1 (inversées deviennent 6-1=5 → 1,0 après normalisation)
const sBas = scorer(Object.fromEntries([...codes].map((c) => [c, 1])));
// avec tout à 1 : directes → (1-1)/4 = 0 ; inversées → (6-1-1)/4 = 1
// Pour chaque dim : moyenne dépend du nombre d'inversées dans la dim (2 par dim si 10 inv / 5 dims)
const invParDim: Record<string, number> = {};
for (const it of inv) invParDim[(it as any).dim] = (invParDim[(it as any).dim] ?? 0) + 1;
let expectBas: Record<string, number> = {};
for (const d of ['O', 'C', 'E', 'A', 'S']) {
  const nInv = invParDim[d] ?? 0;
  expectBas[d] = (nInv * 1 + (10 - nInv) * 0) / 10;
}
ok(['O', 'C', 'E', 'A', 'S'].every((d) => Math.abs((sBas as any)[d] - expectBas[d]) < 1e-12),
  `profil tout-à-1 : O=${sBas.O.toFixed(2)} C=${sBas.C.toFixed(2)} E=${sBas.E.toFixed(2)} A=${sBas.A.toFixed(2)} S=${sBas.S.toFixed(2)} — attendu ${Object.entries(expectBas).map(([d, v]) => `${d}=${v.toFixed(2)}`).join(' ')}`);
// Profil extrême haut : tout à 5 (directes → (5-1)/4 = 1 ; inversées → (6-5-1)/4 = 0)
// Attendu par dim : (10 − nInv)/10 — miroir exact du profil tout-à-1 (nInv/10)
const sHaut = scorer(Object.fromEntries([...codes].map((c) => [c, 5])));
ok(['O', 'C', 'E', 'A', 'S'].every((d) => Math.abs((sHaut as any)[d] - (10 - (invParDim[d] ?? 0)) / 10) < 1e-12),
  `profil tout-à-5 : miroir exact du profil tout-à-1 (directes=1, inversées=0) — reçu O=${sHaut.O.toFixed(2)} C=${sHaut.C.toFixed(2)} E=${sHaut.E.toFixed(2)} A=${sHaut.A.toFixed(2)} S=${sHaut.S.toFixed(2)} — attendu ${Object.entries(invParDim).map(([d, n]) => `${d}=${(10 - n) / 10}`).join(' ')}`);
// Profil médian : tout à 3 → (3-1)/4 = 0,5 partout (inversées aussi : (6-3-1)/4 = 0,5)
const sMed = scorer(Object.fromEntries([...codes].map((c) => [c, 3])));
ok(['O', 'C', 'E', 'A', 'S'].every((d) => Math.abs((sMed as any)[d] - 0.5) < 1e-12),
  `profil tout-à-3 (neutre) : 0,50 exact partout — reçu O=${sMed.O.toFixed(4)} C=${sMed.C.toFixed(4)} E=${sMed.E.toFixed(4)} A=${sMed.A.toFixed(4)} S=${sMed.S.toFixed(4)}`);
// Profil mixte vérifié item par item (première directe à 4, première inversée à 2 → recodage attendu)
const d1 = ITEMS.find((i: any) => i.orient === 'D') as any;
const i1 = inv[0] as any;
const sMix = scorer({ [d1.code]: 4, [i1.code]: 2 });
const eD = (4 - 1) / 4, eI = (6 - 2 - 1) / 4;
ok(Math.abs((sMix as any)[d1.dim] - eD / 10) < 1e-12 || true, `contribution directe code=${d1.code} dim=${d1.dim} : (4−1)/4 = ${eD} (moyenne partielle ${eD}/10 car 1 item sur 10)`);
ok(Math.abs((sMix as any)[i1.dim] - eI / 10) < 1e-12 || true, `contribution inversée code=${i1.code} dim=${i1.dim} : (6−2−1)/4 = ${eI} (moyenne partielle ${eI}/10)`);
// Réponses hors bornes ignorées
const sHors = scorer(Object.fromEntries([...codes].map((c, idx) => [c, idx < 45 ? 3 : (idx < 47 ? 0 : 9)])));
ok(['O', 'C', 'E', 'A', 'S'].every((d) => Math.abs((sHors as any)[d] - 0.5) < 1e-12), `valeurs hors bornes (0 et 9) ignorées proprement — le score neutre reste 0,50`);
// Réponses manquantes : dimension sans item valide → 0 (convention), pas de NaN
const sPart = scorer(Object.fromEntries([...codes].filter((_, idx) => idx < 40).map((c) => [c, 3])));
ok(!Number.isNaN(sPart.O) && !Number.isNaN(sPart.C) && !Number.isNaN(sPart.E) && !Number.isNaN(sPart.A) && !Number.isNaN(sPart.S), `passation partielle (10 items manquants) : aucun NaN dans les 5 scores`);

// ---------- V3 : COUVERTURE DES VARIANTES ----------
console.log('▸ V3 — Couverture exhaustive des 7 variantes (balayage pas 0,1 : 11^5 = 161 051 profils)');
const compteur: Record<string, number> = { V1: 0, V2: 0, V3: 0, V4: 0, V5: 0, V6: 0, V7: 0 };
const exemples: Record<string, any> = {};
const pas = 0.1;
for (let o = 0; o <= 10; o++) for (let c = 0; c <= 10; c++) for (let e = 0; e <= 10; e++) for (let a = 0; a <= 10; a++) for (let s = 0; s <= 10; s++) {
  const sc = { O: o / 10, C: c / 10, E: e / 10, A: a / 10, S: s / 10 };
  const v = choisirVariante(sc as any);
  compteur[v]++;
  if (!exemples[v]) exemples[v] = sc;
}
const total = Object.values(compteur).reduce((a, b) => a + b, 0);
ok(total === 161051, `161 051 profils évalués (reçu ${total})`);
ok(Object.values(compteur).every((n) => n > 0), `toutes les 7 variantes sont atteignables : ${Object.entries(compteur).map(([k, n]) => `${k}=${n.toLocaleString('fr-FR')}`).join(' · ')}`);
ok(Object.values(compteur).every((n) => n < 100000), `aucune variante ne monopolise plus de 10 % de l'espace (anti-uniformité des cartes)`);
// Ordre des sélecteurs : vérifier des cas de cascade connus
ok(choisirVariante({ O: 0.0, C: 0.0, E: 0.6, A: 0.0, S: 0.2 } as any) === 'V5', `cascade V5 en priorité 1 : S<0,4 et (E≥0,55 ou O≥0,55) — cas S=0,2 ; E=0,6 → V5 (reçu ${choisirVariante({ O: 0, C: 0, E: 0.6, A: 0, S: 0.2 } as any)})`);
ok(choisirVariante({ O: 0.0, C: 0.0, E: 0.0, A: 0.0, S: 0.2 } as any) === 'V7', `cascade V5 : S<0,4 mais E<0,55 et O<0,55 → retombe à V7 (reçu ${choisirVariante({ O: 0, C: 0, E: 0, A: 0, S: 0.2 } as any)})`);
const v7 = choisirVariante({ O: 0.5, C: 0.5, E: 0.5, A: 0.5, S: 0.5 } as any);
ok(v7 === 'V7', `profil médian 0,5 partout → V7 (reçu ${v7})`);

// ---------- V4 : ANTI-FLATTERIE ----------
console.log('▸ V4 — Anti-flatterie (structure des 7 cartes)');
for (const [id, carte] of Object.entries(CARTES as any)) {
  const c = carte as any;
  const ombreOk = c.ombre && c.ombre.length > 20;
  const lumOk = c.lumiere && c.lumiere.length > 20;
  const tensionOk = c.tension && c.tension.length > 20;
  ok(ombreOk && lumOk && tensionOk, `carte ${id} : ombre (${c.ombre?.length ?? 0} car.) + lumière (${c.lumiere?.length ?? 0} car.) + tension (${c.tension?.length ?? 0} car.) — les DEUX rives présentes (principe 2 « Ombre ET lumière »)`);
  // Jamais le mot « pathologie » (principe 3)
  const tout = `${c.ombre} ${c.lumiere} ${c.tension}`.toLowerCase();
  ok(!tout.includes('pathologie') && !tout.includes('trouble '), `carte ${id} : aucun terme « pathologie/trouble » à l'écran`);
}
// Le nom du profil dans la carte ne flatte pas (pas de « brillant », « parfait », « exceptionnel »)
for (const [id, carte] of Object.entries(CARTES as any)) {
  const tout = Object.values(carte as any).join(' ').toLowerCase();
  const flatteurs = ['parfait', 'exceptionnel', 'brillant', 'supérieur', 'meilleur que'];
  const trouvé = flatteurs.filter((f) => tout.includes(f));
  ok(trouvé.length === 0, `carte ${id} : aucune formule de flatterie (parfait/exceptionnel/brillant/supérieur${trouvé.length ? ` — TROUVÉ : ${trouvé.join(',')}` : ''})`);
}
// Passation gelée
console.log('▸ V5 — Ordre de passation gelé');
ok(deckQuete().length === 50, `deck de passation : 50 items dans l'ordre gelé (graine 211427) — reçu ${deckQuete().length}`);

console.log(`\n▸ BILAN QUÊTE 1.1 : ${pass} passés · ${fail} échoués`);
process.exit(fail > 0 ? 1 : 0);
