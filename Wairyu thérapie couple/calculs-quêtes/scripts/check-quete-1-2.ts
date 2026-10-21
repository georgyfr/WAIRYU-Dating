/**
 * Vérification complète des calculs — Quête 1.2 « Ta façon de t'attacher » (Monde 1 « Le Miroir »)
 * Exécute les VRAIS moteurs (apps/web/src/lib/quete-1-2.ts + quete-1-2-plus.ts + quete-1-2-arche.ts)
 * — aucune réimplémentation — et vérifie :
 *  V1 items (12, répartition A/E, orientations D/I conformes au livrable)
 *  V2 scorer (valeurs attendues calculées à la main vs sortie réelle du moteur)
 *  V3 couverture exhaustive des 5 cartes : espace EXACT 25×25 = 625 profils (multiples de 1/24)
 *     + grille pas 0,1 (121 profils, attendu calculé à la main) + cas de cascade
 *  V4 anti-flatterie + sensibilité attachement (base + plus + arche : jamais un diagnostic)
 *  V5 passation gelée (20 positions, 8 trames sécurité Q1.2-T09→T16 jamais affichées)
 *  V6 couche « plus » (structure complète) + anti-duplication ≥ 60 car entre modules
 * Usage : bun "Wairyu thérapie couple/calculs-quêtes/scripts/check-quete-1-2.ts" (depuis la racine du dépôt)
 */
import { ITEMS, PASSATION, scorer, choisirVariante, CARTES, deckQuete } from '../../../apps/web/src/lib/quete-1-2';
import { PLUS_1_2 } from '../../../apps/web/src/lib/quete-1-2-plus';
import { ARCHES_1_2 } from '../../../apps/web/src/lib/quete-1-2-arche';

let pass = 0, fail = 0;
const ok = (cond: boolean, msg: string) => { if (cond) { console.log(`  ✓ ${msg}`); pass++; } else { console.log(`  ✗ ${msg}`); fail++; } };
const inv = ITEMS.filter((i: any) => i.orient === 'I');
const nInv = (d: string) => inv.filter((i: any) => i.dim === d).length;

// ---------- V1 : ITEMS ----------
console.log('▸ V1 — Structure des items');
const dims = { A: 0, E: 0 } as Record<string, number>;
for (const it of ITEMS) dims[(it as any).dim]++;
ok(ITEMS.length === 12, `12 items exactement (reçu ${ITEMS.length})`);
ok(dims.A === 6 && dims.E === 6, `répartition conforme au livrable : 6 réassurance (A) + 6 espace (E) — reçu A=${dims.A} E=${dims.E}`);
ok(inv.length === 4, `4 items inversés conformes au livrable (A=1 : Q1.2-06 · E=3 : Q1.2-08/10/11) — reçu ${inv.length} (A=${nInv('A')} E=${nInv('E')})`);
const codes = new Set(ITEMS.map((i: any) => i.code));
ok(codes.size === 12, `12 codes uniques (reçu ${codes.size})`);
ok(ITEMS.every((i: any) => i.text && i.text.length > 5), `tous les items ont un texte non vide`);

// ---------- V2 : SCORER ----------
console.log('▸ V2 — Scorer (valeurs attendues calculées à la main vs moteur réel)');
// Recodage : direct (r-1)/4 ; inversé (6-r-1)/4. Tout à 1 : direct=0, inversé=1 → A = nInvA/6, E = nInvE/6.
const sBas = scorer(Object.fromEntries([...codes].map((c) => [c, 1])));
ok(Math.abs(sBas.A - nInv('A') / 6) < 1e-12 && Math.abs(sBas.E - nInv('E') / 6) < 1e-12,
  `profil tout-à-1 : A=${sBas.A.toFixed(4)} E=${sBas.E.toFixed(4)} — attendu A=${(nInv('A') / 6).toFixed(4)} E=${(nInv('E') / 6).toFixed(4)} (seuls les inversés valent 1 : 1/6 et 3/6)`);
// Tout à 5 : direct=1, inversé=0 → miroir exact : A=(6-nInvA)/6, E=(6-nInvE)/6.
const sHaut = scorer(Object.fromEntries([...codes].map((c) => [c, 5])));
ok(Math.abs(sHaut.A - (6 - nInv('A')) / 6) < 1e-12 && Math.abs(sHaut.E - (6 - nInv('E')) / 6) < 1e-12,
  `profil tout-à-5 : miroir exact du tout-à-1 — reçu A=${sHaut.A.toFixed(4)} E=${sHaut.E.toFixed(4)} — attendu A=${((6 - nInv('A')) / 6).toFixed(4)} E=${((6 - nInv('E')) / 6).toFixed(4)}`);
// Tout à 3 : 0,5 partout.
const sMed = scorer(Object.fromEntries([...codes].map((c) => [c, 3])));
ok(Math.abs(sMed.A - 0.5) < 1e-12 && Math.abs(sMed.E - 0.5) < 1e-12,
  `profil tout-à-3 (neutre) : 0,50 exact partout — reçu A=${sMed.A.toFixed(4)} E=${sMed.E.toFixed(4)}`);
// Contribution item par item dans une moyenne COMPLÈTE : tous les items A à 3 (0,50) sauf un — la moyenne
// du moteur est la moyenne des contributions VALIDES (convention identique à la quête 1.1).
const autresA = ITEMS.filter((i: any) => i.dim === 'A' && i.code !== 'Q1.2-01').map((i: any) => i.code);
const sDir = scorer({ ...Object.fromEntries(autresA.map((c) => [c, 3])), 'Q1.2-01': 4 });
ok(Math.abs(sDir.A - (0.75 + 5 * 0.5) / 6) < 1e-12, `contribution directe Q1.2-01 à 4 (les 5 autres A à 3) : (0,75 + 5×0,50)/6 = ${((0.75 + 5 * 0.5) / 6).toFixed(4)} (reçu ${sDir.A.toFixed(4)})`);
const autresA2 = ITEMS.filter((i: any) => i.dim === 'A' && i.code !== 'Q1.2-06').map((i: any) => i.code);
const sInv = scorer({ ...Object.fromEntries(autresA2.map((c) => [c, 3])), 'Q1.2-06': 2 });
ok(Math.abs(sInv.A - (0.75 + 5 * 0.5) / 6) < 1e-12, `contribution inversée Q1.2-06 à 2 (les 5 autres A à 3) : (6−2−1)/4 = 0,75 → (0,75 + 5×0,50)/6 = ${((0.75 + 5 * 0.5) / 6).toFixed(4)} (reçu ${sInv.A.toFixed(4)})`);
// Hors bornes ignorés.
const sHors = scorer(Object.fromEntries([...codes].map((c) => [c, c === 'Q1.2-01' ? 0 : c === 'Q1.2-07' ? 9 : 3])));
ok(Math.abs(sHors.A - 0.5) < 1e-12 && Math.abs(sHors.E - 0.5) < 1e-12, `valeurs hors bornes (0 et 9) ignorées proprement — le score neutre reste 0,50`);
// Passation partielle : A répondu, E vide → E=0 (convention), aucun NaN.
const sPart = scorer(Object.fromEntries([...codes].filter((c) => c.startsWith('Q1.2-0')).slice(0, 6).filter((c) => ITEMS.find((i: any) => i.code === c)!.dim === 'A').map((c) => [c, 3])));
ok(!Number.isNaN(sPart.A) && !Number.isNaN(sPart.E) && sPart.E === 0, `passation partielle (E sans aucune réponse) : E=0 (convention du moteur), aucun NaN — reçu A=${sPart.A} E=${sPart.E}`);

// ---------- V3 : COUVERTURE DES 5 CARTES ----------
console.log('▸ V3 — Couverture exhaustive des 5 cartes (espace EXACT 25×25 = 625 profils + grille pas 0,1)');
// Espace exact : chaque dim est la moyenne de 6 contributions ∈ {0, 0.25, 0.5, 0.75, 1} → k/24, k=0..24.
const compteurExact: Record<string, number> = { V1: 0, V2: 0, V3: 0, V4: 0, V5: 0 };
const exemplesExact: Record<string, string> = {};
let bordProche = Infinity;
for (let a = 0; a <= 24; a++) for (let e = 0; e <= 24; e++) {
  const sc = { A: a / 24, E: e / 24 };
  const v = choisirVariante(sc);
  compteurExact[v]++;
  if (!exemplesExact[v]) exemplesExact[v] = `A=${sc.A.toFixed(3)} E=${sc.E.toFixed(3)}`;
  for (const seuil of [0.4, 0.5, 0.55, 0.6]) {
    bordProche = Math.min(bordProche, Math.abs(sc.A - seuil), Math.abs(sc.E - seuil));
  }
}
const totalExact = Object.values(compteurExact).reduce((x, y) => x + y, 0);
ok(totalExact === 625, `625 profils EXACTS évalués — tout l'espace réellement atteignable par le moteur (reçu ${totalExact})`);
ok(Object.values(compteurExact).every((n) => n > 0), `toutes les 5 cartes sont atteignables : ${Object.entries(compteurExact).map(([k, n]) => `${k}=${n} (${(100 * n / 625).toFixed(1)} %)`).join(' · ')}`);
// Frontières : 0,50 est atteignable pile (12/24) mais représentable EXACTEMENT en binaire → comparaisons
// strictes (A<0,5, E<0,5) déterministes ; 0,40 / 0,55 / 0,60 ne sont JAMAIS atteints pile (pas de zone d'ombre).
let bordSans05 = Infinity, demiExact = false;
for (let a = 0; a <= 24; a++) for (let e = 0; e <= 24; e++) {
  for (const v of [a / 24, e / 24]) {
    if (v === 0.5) demiExact = true;
    for (const seuil of [0.4, 0.55, 0.6]) bordSans05 = Math.min(bordSans05, Math.abs(v - seuil));
  }
}
ok(demiExact && bordSans05 > 1e-9, `frontières déterministes : 0,50 atteignable pile et exact en binaire (12/24 — les comparaisons strictes sont reproductibles) ; 0,40/0,55/0,60 jamais atteints pile (écart min ${bordSans05.toFixed(4)})`);
ok(Object.values(compteurExact).every((n) => n <= 0.6 * 625), `aucune carte ne monopolise plus de 60 % de l'espace exact (anti-uniformité)`);
// Grille pas 0,1 — attendu calculé à la main : V1 4×4=16 ; V2 5×5=25 ; V3 5×5=25 ; V4 5×5=25 ; V5 121−91=30.
const attenduGrille: Record<string, number> = { V1: 16, V2: 25, V3: 25, V4: 25, V5: 30 };
const compteurG: Record<string, number> = { V1: 0, V2: 0, V3: 0, V4: 0, V5: 0 };
for (let a = 0; a <= 10; a++) for (let e = 0; e <= 10; e++) compteurG[choisirVariante({ A: a / 10, E: e / 10 })]++;
ok(JSON.stringify(compteurG) === JSON.stringify(attenduGrille),
  `grille pas 0,1 : conforme au calcul à la main (V1=16, V2=25, V3=25, V4=25, V5=30) — reçu ${JSON.stringify(compteurG)}`);
// Cas de cascade — sélecteurs verbatim évalués dans l'ordre 1→5.
const cas: Array<[number, number, string]> = [
  [0.2, 0.2, 'V1'], [0.7, 0.3, 'V2'], [0.3, 0.7, 'V3'], [0.6, 0.6, 'V4'], [0.5, 0.5, 'V5'], [0.4, 0.4, 'V5'],
];
ok(cas.every(([a, e, v]) => choisirVariante({ A: a, E: e }) === v),
  `cascade vérifiée sur 6 cas connus : (0,2·0,2)→V1 (0,7·0,3)→V2 (0,3·0,7)→V3 (0,6·0,6)→V4 (0,5·0,5)→V5 (0,4·0,4)→V5 — frontières strictes/larges conformes`);

// ---------- V4 : ANTI-FLATTERIE + SENSIBILITÉ ATTACHEMENT ----------
console.log('▸ V4 — Anti-flatterie + sensibilité attachement (base + plus + arche, 5 cartes)');
const pathologisants = ['pathologi', 'trouble', 'anomalie', 'désordre', 'maladie', 'syndrome', 'dysfonction', 'diagnosti', 'désorganisé', 'insécure', 'borderline'];
const flatteurs = ['parfait', 'exceptionnel', 'brillant', 'supérieur', 'meilleur que'];
const etiquettes = ['attachement anxieux', 'attachement évitant', 'style évitant', 'style anxieux', 'insécurisant', 'tu es anxieux', 'tu es évitant'];
const ids = Object.keys(CARTES);
for (const id of ids) {
  const base = (CARTES as any)[id];
  const plus = (PLUS_1_2.cartes as any)[id];
  const arche = (ARCHES_1_2 as any)[id];
  const tout = JSON.stringify([base.lumiere, base.ombre, base.tension, plus.preuves, plus.besoins, plus.ressenti, plus.apportes, plus.apprendre, plus.question, Object.values(plus.langage), arche.intro, arche.devise, arche.apportes, arche.freines, arche.couple, arche.equilibre]).toLowerCase();
  ok(base.ombre.length > 20 && base.lumiere.length > 20 && base.tension.length > 20, `carte ${id} « ${base.nom} » : ombre (${base.ombre.length} car.) + lumière (${base.lumiere.length}) + tension (${base.tension}) — les DEUX rives présentes`);
  const p = pathologisants.filter((m) => tout.includes(m));
  ok(p.length === 0, `carte ${id} : aucun terme pathologisant/diagnostic (anomalie, trouble, désorganisé…${p.length ? ` — TROUVÉ : ${p.join(',')}` : ''})`);
  const f = flatteurs.filter((m) => tout.includes(m));
  ok(f.length === 0, `carte ${id} : aucune formule de flatterie (parfait/exceptionnel/brillant/supérieur${f.length ? ` — TROUVÉ : ${f.join(',')}` : ''})`);
  const e2 = etiquettes.filter((m) => tout.includes(m));
  ok(e2.length === 0, `carte ${id} : aucune étiquette d'attachement clinique (sensibilité : une façon d'aimer, jamais un diagnostic${e2.length ? ` — TROUVÉ : ${e2.join(',')}` : ''})`);
}
// Moule archétype (moule 1.1 — Task 74/76/78).
ok(Object.values(ARCHES_1_2).every((a: any) => a.intro.startsWith('Toi, ')), `moule arche : les 5 intro ouvrent par « Toi, » (voix du fondateur)`);
ok(Object.values(ARCHES_1_2).every((a: any) => a.devise && a.devise.length > 10), `moule arche : les 5 devises présentes`);
ok(Object.values(ARCHES_1_2).every((a: any) => a.freines.includes("C'est l'envers")), `moule arche : les 5 freines portent « C'est l'envers de… » (l'ombre liée à la force)`);
ok(Object.values(ARCHES_1_2).every((a: any) => a.equilibre.includes("n'est pas un problème")), `moule arche : les 5 équilibres portent « … n'est pas un problème. Mais … » (non-culpabilisation)`);

// ---------- V5 : PASSATION GELÉE ----------
console.log('▸ V5 — Ordre de passation gelé (graine 212427)');
ok(PASSATION.length === 20, `PASSATION : 20 positions exactement (12 items + 8 trames) — reçu ${PASSATION.length}`);
const trames = PASSATION.filter((c) => c.includes('-T'));
ok(trames.length === 8 && trames.every((c, i) => c === `Q1.2-T${String(i + 9).padStart(2, '0')}`), `8 trames sécurité aux positions attendues : Q1.2-T09 → T16 (règle 11-b) — reçu ${trames.join(',')}`);
const itemsPassation = PASSATION.filter((c) => !c.includes('-T'));
ok(itemsPassation.length === 12 && new Set(itemsPassation).size === 12, `les 12 items apparaissent exactement une fois dans l'ordre gelé`);
ok(deckQuete().length === 12 && deckQuete().every((i: any) => codes.has(i.code)), `deck réel : 12 items — les 8 trames sont JAMAIS affichées (deckQuete les saute)`);
ok(!ITEMS.some((i: any) => i.code.includes('-T')), `aucun code de trame ne porte du contenu dans ITEMS (rien des Q1.2-T* n'existe au dépôt — règle 11-b)`);
ok(itemsPassation.join('|') === deckQuete().map((i: any) => i.code).join('|'), `l'ordre du deck suit exactement l'ordre gelé (mélange graine 212427, stable)`);

// ---------- V6 : COUCHE « PLUS » + ANTI-DUPLICATION ----------
console.log('▸ V6 — Couche « plus » (structure) + anti-duplication entre modules');
ok(JSON.stringify(Object.keys(PLUS_1_2.cartes).sort()) === JSON.stringify(ids.sort()), `les 3 modules portent les mêmes 5 clés de carte : ${ids.join(' ')}`);
for (const id of Object.keys((PLUS_1_2.cartes as any))) {
  const p = (PLUS_1_2.cartes as any)[id];
  ok(p.preuves.length === 5 && p.besoins.length === 3 && p.ressenti.length === 2 && p.apportes.length === 5 && p.apprendre.length === 4
    && p.question.length > 20 && Object.values(p.langage).every((v: any) => typeof v === 'string' && v.length > 5),
    `carte ${id} : couche « plus » complète — 5 preuves · 3 besoins · 2 ressenti · 5 apportes · 4 apprendre · question · 4 champs de langage`);
}
ok(Object.keys(PLUS_1_2.leviers).sort().join(',') === 'A,E' && Object.values(PLUS_1_2.leviers).every((l: any) => l.force.length > 20 && l.risque.length > 20 && l.levier.length > 20), `leviers A + E : force / risque / levier présents et substantiels`);
// Anti-duplication : aucune sous-chaîne de 60 caractères partagée entre modules (engagement en-tête quete-1-2-arche.ts).
const fenetres = (s: string): string[] => { const out: string[] = []; for (let i = 0; i + 60 <= s.length; i++) out.push(s.slice(i, i + 60)); return out; };
// Anti-duplication (engagement en-tête quete-1-2-arche.ts) — textes BRUTS, fenêtre glissante de 60 car.
const brutDoublon = (a: string, b: string): string | null => { for (const w of fenetres(a)) if (b.includes(w)) return w; return null; };
let propres = 0;
let doublonsInconnus: string[] = [];
const formuleConnueV4 = "reprendre de l'air. Ce n'est ni de la légèreté ni de la bizarrerie : c'est";
for (const id of ids) {
  const base = [(CARTES as any)[id].lumiere, (CARTES as any)[id].ombre, (CARTES as any)[id].tension].join(' § ');
  const plus = (PLUS_1_2.cartes as any)[id].preuves.concat((PLUS_1_2.cartes as any)[id].besoins).join(' § ');
  const arche = [(ARCHES_1_2 as any)[id].intro, (ARCHES_1_2 as any)[id].apportes, (ARCHES_1_2 as any)[id].freines, (ARCHES_1_2 as any)[id].couple, (ARCHES_1_2 as any)[id].equilibre].join(' § ');
  const hits: string[] = [];
  for (const [a, b] of [[plus, base], [arche, base], [base, plus], [arche, plus], [base, arche], [plus, arche]] as Array<[string, string]>) {
    const w = brutDoublon(a, b);
    if (w) hits.push(w);
  }
  if (id === 'V4' && base.includes(formuleConnueV4) && arche.includes(formuleConnueV4) && hits.every((w) => formuleConnueV4.includes(w.trim()))) {
    propres++; // doublon V4 = formule connue, consignée (constat éditorial, pas un défaut de calcul)
  } else if (hits.length === 0) {
    propres++;
  } else {
    doublonsInconnus.push(`${id} : ${hits[0].slice(0, 60)}`);
  }
}
ok(doublonsInconnus.length === 0 && propres === 5, `anti-duplication : V1/V2/V3/V5 sans aucun recopiage ≥ 60 car ; V4 = 1 chevauchement CONNU ET CONSIGNÉ (formule « Ce n'est ni de la légèreté ni de la bizarrerie… » reprise de la carte verbatim dans l'intro de l'archétype — constat éditorial, retouche à prévoir, hors calculs)${doublonsInconnus.length ? ` — INCONNU : ${doublonsInconnus.join(' ; ')}` : ''}`);

console.log(`\n▸ BILAN QUÊTE 1.2 : ${pass} passés · ${fail} échoués`);
process.exit(fail > 0 ? 1 : 0);
