# WAIRYU — CARTE DE LA CONSTITUTION v1.0

> **Document de référence** : les règles permanentes du projet — et la preuve, règle par règle, qu'elles sont tenues par le réel.
> **Source cartographiée** : [`salle-prompts/constitution.v2.1.md`](../salle-prompts/constitution.v2.1.md) (114 lignes) — « P0 — versionnée par FM-014, amendée par FM-018 · À coller en tête de TOUTE session de production. Ne jamais résumer. » (en-tête verbatim).
> **Règle de lecture** : cette carte est un COMPAGNON de preuves, pas un résumé (le document interdit d'être résumé) : chaque article est cité verbatim, puis rendu à son **statut runtime vérifié par commande** (annexe A : une commande = un verdict). « En cas de divergence entre ce document et toute autre source : ce document gagne, et la divergence est signalée. » — divergences détectées consignées §4 et §8. ✅ tenu · 🟡 partiel/nuance · 🔵 à venir · ⚖️ décision comité.

---

## §0 — Place dans l'architecture documentaire

| Document | Rôle |
|---|---|
| Spec v0.1 (12 961 lignes) → ANALYSE-APPROFONDIE (pourquoi) → PLAN-DE-REALISATION (l'ordre) → **CONSTITUTION v2.1 (les règles permanentes — prime sur toute autre source)** → contrat d'inventaire v1.3 (la source unique de gouvernance) | chaîne fondatrice |
| Cartes de référence : CARTE-CONCEPTION (comment) · CARTE-SPECIFICATION (ce que le produit promet) · CARTE-ANALYSE-APPROFONDIE (pourquoi ces choix) · CARTE-PLAN-DE-REALISATION (ordre + gates) · **CARTE-CONSTITUTION (les règles, tenues par preuve)** | série de référence — 5ᵉ tome |

---

## §1 — [1] LE PROJET (verbatim)

> « Wairyu est une application de rencontre hybride (Mode Classique / Mode Invisible) organisée en VOYAGE de connaissance de soi dont la destination est la rencontre. Le voyage compte : 11 MONDES, 51 QUÊTES, 570 ITEMS. Tout le contenu est rédigé en interne : zéro licence externe, zéro marque tierce, zéro item copié. »

**Statut runtime** : ✅ tenu — et l'arithmétique s'ancré mot à mot dans la Constitution [5] (preuve annexe A-1) :

```
somme des items des 11 mondes [5]           = 540
+ TRAME FIABILITÉ [5]                       =  30
                                              ────
570 ITEMS conçus [1]                          = 570  ✓
540 − 9 (quête 1.8 « Ton bien-être » P3)      = 531  ✓ = l'inventaire au runtime
```

**L'arithmétique du contrat est ancrée dans la Constitution elle-même** : c'est la réponse définitive au piège de traçabilité `ci/quetes/` (fixtures ≠ inventaire — le Livrable des mondes fait foi, piège documenté CARTE-CONCEPTION §0).

---

## §2 — [2] LA DOCTRINE : 5 règles non négociables, statuts runtime

| Règle (verbatim abrégé) | Statut runtime |
|---|---|
| « MESURÉ, PAS DEVINÉ. (…) Un texte que les items ne prouvent pas est SUPPRIMÉ, pas adouci. » | ✅ le Contrat d'Inventaire + CI 1-17 + harnais P0 (12/12) vérifient que chaque élément produit est ancré |
| « LUMIÈRE ET OMBRE, EN ÉGALITÉ. Jamais de résultat flatteur. » | ✅ volume d'ombre ≥ lumière dans les 50 × 00-README du Livrable (audits C1/hostile/RE-AUDIT V1.3) |
| « PAS DE DIAGNOSTIC, JAMAIS. (…) On décrit la mécanique et ses conséquences, jamais l'étiquette. » | ✅ liste fermée (narcissique, borderline, toxique… -pathie) — appliquée aux 15 vagues ; test des 3 phrases juxtaposées |
| « CONSENTEMENT STRUCTUREL. L'intime (M8, M9) est opt-in strict (…) La trame de sécurité est INVISIBLE pour toujours. » | ✅ M8/M9 opt-in en base ; trame sécurité jamais rendue — **garde CI-16** : 770 fichiers scannés, zéro trame en clair, 7 formats |
| « FRONTIÈRES SCIENTIFIQUES. Pas de biométrie, pas de compatibilité génétique, pas de Rorschach digital, pas de MBTI. » | ✅ zéro module de ce type au code ; « Ces exclusions sont des refus de doctrine, pas des contraintes techniques » |

---

## §3 — [3] LA LANGUE (règles R1-R21 — synthèse) : statuts

- « Tutoiement, deuxième personne, présent de l'indicatif » → ✅ les 15 vagues produites sous cette règle (audits C1 puis hostile 64 findings, corrigés P0)
- « Phrases ≤ 22 mots en moyenne (…) si un passage ne se comprend pas à voix haute (…) il n'est pas fini » → ✅ règle de production des vagues
- « Métaphores pédagogiques AUTORISÉES (ton radar, ta météo intérieure, la vague…) » → ✅ présentes au Livrable
- « Jargon INTERDIT, sauf exception unique (nommé UNE fois, défini dans la même phrase) » → ✅
- « INTERDITS LEXICAUX (liste fermée, vérifiable par machine) » → ✅ appliqués à la production et aux audits (C1/hostile) — la garde machine permanente dédiée reste à durcir à l'étape 8 🟡
- « AUCUNE MÉTADONNÉE VISIBLE. (…) Toute référence à une réponse se fait par RAPPEL EN TOUTES LETTRES » → ✅ — le rappel en toutes lettres est exactement ce que la garde CI-16 protège (aucun code/sigle/statut moteur ne franchit un texte utilisateur)

---

## §4 — [4] LE GLOSSAIRE DES SIGNAUX : 13 sigles au document, 14 codes au registre runtime

Le glossaire [4] liste **13 sigles** : DTM_N · DTM_M · DGR · JR1 · CSR · CMP · COC · RB1 · BLA · RSQ · QFI · ECD · GEN — avec l'« **AVERTISSEMENT HISTORIQUE** : le sigle SDT désigne le Dark Triad Manipulative (renommé DTM par FM-002). Il ne désigne JAMAIS la théorie de l'autodétermination. »

**Divergence signalée (la constitution gagne, la divergence est signalée — en-tête)** : le registre runtime compte **14 codes = 13 gelés + DE** (invariant verrouillé par CI-17 ; `packages/shared/src/vigilance.ts` l.33 : « Les 14 codes du registre signaux.json (13 gelés + DE) »). Le DE a été ajouté après la constitution — le glossaire [4] n'a pas été amendé pour le documenter. Consigné tel quel : 13 au document fondateur · 14 au registre vivant · la CI verrouille l'invariant réel.

---

## §5 — [5] LE VOYAGE — LES 11 MONDES (table verbatim, codes gelés, liaisons)

**GRATUIT — « Qui je suis »** : M1 LE MIROIR (3 quêtes · 104 items) · M2 LE VOLANT (8 · 56) · M3 LA BOUSSOLE (8 · 65) · M4 TON TERRAIN (7 · 52) · M5 MON HISTOIRE (4 · 50) · M11 LE VOYAGE À DEUX (6 · 46 — « LA RENCONTRE, TOUJOURS GRATUITE »)

**PREMIUM — « Comment j'aime »** : M6 MON CŒUR (4 · 48) · M7 FACE AUX TEMPÊTES (3 · 36) · M8 L'INTIME — L'ESSENTIEL (2 · 36, opt-in) · M9 L'INTIME — LES PROFONDEURS (3 · 23, opt-in) · M10 MON MONDE (3 · 24)

⚠ **CODES GELÉS (verbatim)** : « les codes d'items (Q2.1-xx, Q5.4-xx…) ne correspondent PAS à la numérotation des mondes (Q2.1-01 vit au monde M3 ; Q5.4-xx vit au monde M7). Le code reste la clé du contrat ; le monde est une métadonnée. » → **CETTE règle est la référence qui tranche la confusion « Monde 2 : La Boussole » du PARCOURS-MAITRE (M2 = LE VOLANT ; M3 = LA BOUSSOLE ; le code Q2.x vit au monde M3)**. Table de correspondance code→monde en annexe du contrat (FM-011 v2).

⚠ **LIAISONS DE DOMAINE (verbatim)** : « trois domaines unissent deux mondes issus d'une même origine — DOMAINE DU SOI (M1+M2), DOMAINE DU CŒUR (M6+M7), DOMAINE DE L'INTIME (M8+M9) (…) JAMAIS dans un miroir de quête seul » → ✅ registre vivant `contrat/registres/liaisons.json` (annexe A-6)

**+ TRAME FIABILITÉ** (30 items : 18 désirabilité sociale, 8 over-claiming, 4 doublons longitudinaux) · **+ TRAME SÉCURITÉ** (~80 signaux du dictionnaire [4]) → ✅ tissées en production, **formulations brûlées hors dépôt** (doctrine [11-b] — CI-16 les garde hors du dépôt public à jamais).

---

## §6 — [6] LE STATUT FREEMIUM : la doctrine 6/5 et le réel

| Règle (verbatim abrégé) | Statut runtime |
|---|---|
| « 6 mondes gratuits (M1, M2, M3, M4, M5, M11) · 5 mondes premium (M6-M10) » | 🟡 doctrine documentée — **AUCUN verrou premium câblé au code** : seule occurrence du mot « premium » dans le front = un commentaire de thème visuel (App.tsx l.487) — écart consigné ⚖️ |
| « L'ÉCRAN DE CONVERSION n'existe qu'UN endroit : à la complétion de M5, via le prompt A7 » | 🟡 A7 non référencé au front (0 occurrence) — cohérent avec le freemium non câblé ⚖️ (point comité récurrent des cartes précédentes) |
| « LA RENCONTRE N'EST JAMAIS PAYANTE : M11, le matching de base, la conversation, la sécurité » | ✅ **RENFORCÉ PAR V18** : l'activation de la rencontre est gratuite, explicite, réversible (`POST /api/qd/activation`) — jamais d'auto-conversion |
| « LE PREMIUM N'ACHÈTE JAMAIS L'AUTRE (…) pool élargi (asymétrie ±4 vs ±2) (…) Jamais de pay-to-win » | 🟡 l'asymétrie de pool reste non vérifiée au runtime (déjà consignée au re-audit — à trancher avec la doctrine freemium ⚖️) |
| « Les résumés d'engagement (RES) (…) c'est la preuve par l'exemple, jamais la privation » | ✅ doctrine respectée dans la conception des étages (§7) |

---

## §7 — [7] LES QUATRE ÉTAGES DE RESTITUTION + « L'AUTRE VOIT »

| Étage (verbatim abrégé) | Statut runtime |
|---|---|
| « ÉTAGE 1 — LA CARTE (30-60 mots, par quête) » | ✅ chaîne 7 étages par quête du Livrable (00-README → 07-miroir + cartes.yaml charte C1-C11) — la chaîne de production englobe les 4 étages de restitution + 3 étages internes |
| « ÉTAGE 2 — LE MIROIR DE QUÊTE (80-450 mots) — gabarits LOURD ≥ 15 items / MOYEN 8-14 / LÉGER 3-7 / EXEMPTÉ (badge, écran de passage, fonctionnalité, invisible) » | ✅ gabarits appliqués aux 51 quêtes (Livrable) |
| « ÉTAGE 3 — LE PORTRAIT DE MONDE + LES PORTRAITS DE DOMAINE (M1+M2, M6+M7, M8+M9) » | ✅ — signatures inter-quêtes aux portraits, JAMAIS aux miroirs seuls (liaisons.json) |
| « ÉTAGE 4 — LE PORTRAIT INTÉGRAL (12-18 pages), téléchargeable » | 🔵 SUR CADRAGE FM-026 §2 (cohérent CARTE-SPECIFICATION) |
| « L'AUTRE VOIT : la carte, le RES (3 puces lumière, 3 puces ombre, ~300 mots), extraits opt-in. JAMAIS l'analyse complète. Symétrie absolue » | ✅ doctrine tenue dans la conception des vues partagées |

---

## §8 — [8] LA GOUVERNANCE : le contrat gagne

> « Le Contrat d'Inventaire v1.3 est la SOURCE UNIQUE. Tout élément produit a une maison déclarée. Tout retrait ou modification passe par une Fiche de Mutation. Les 4 états : CONÇU → ACTIF → EN PAUSE → RETRIÉ ; l'état “disparu” n'existe pas. Divergence entre ta production et le contrat : LE CONTRAT GAGNE — tu signales, tu ne corriges pas. »

**Statut runtime** : ✅ vivant — `contrat/contrat-inventaire.v1.3.md` · dossier `contrat/fiches-mutation/` : **14 fiches archivées** (FM-013 → FM-023, FM-026, FM-027, FM-028-RETROSPECTIVE — annexe A-5) · registres vivants `contrat/registres/` (signaux.json · liaisons.json · dyades.json · signatures).

**Faits de trace consignés (sans interprétation)** : le dossier d'archivage commence à FM-013 — les FM-002 (SDT→DTM) et FM-011 (table code→monde) citées par la constitution n'ont pas de fiche dans ce dossier ; FM-024 et FM-025 n'y figurent pas non plus. Consigné tel quel.

---

## §9 — [9] POSTURE + [10] RITUEL : les 3 verrous humains, prouvés vivants

> « Trois verrous sont HUMAINS et te sont interdits : les seuils psychométriques, les formulations de sécurité et de bien-être, la validation scientifique. (…) produis une PROPOSITION explicitement marquée “À VALIDER PAR LE COMITÉ” — jamais une décision. »

**Statut runtime** : ✅ **LE CODE CITE LUI-MÊME LE VERROU** — `packages/shared/src/constants.ts` l.294 : « ⚠ TOUTES ces valeurs sont À VALIDER PAR LE COMITÉ (verrou [9]) » · l.328 (modulation Q1.7/TDAH) · l.333 (seuils par signal). L'article [9] de la constitution est une référence exécutée, pas une décoration.

---

## §10 — [11-b] LA DOCTRINE DE BRÛLAGE + [11] LA SÉCURITÉ D'OPÉRATION : preuves vivantes du jour

**[11-b] (FM-018)** : « Aucune formulation de trame n'entre dans un dépôt accessible publiquement — sous peine de brûlage. (…) Une formulation brûlée n'est jamais re-citée : elle est désignée par son code gelé. » → ✅ **CI-16, garde étendue permanente** : 770 fichiers scannés à chaque push (7 formats) — zéro trame en clair, jour après jour.

**[11] (FM-014 §4a)** : « Aucun identifiant, jeton ou secret n'est jamais écrit dans un fichier (…) jamais sur disque, jamais dans la configuration git, jamais en argument de commande. (…) Un dépôt rouge (CI en échec) ne part jamais ; la vérification post-push (la remote pointe sur notre commit) fait partie de l'opération de publication. » → ✅ **`scripts/push-canon.sh` implémente [11] à la lettre** (3 verrous : ① CI verte avant push ② jeton en env éphémère + helper en mémoire ③ ls-remote = HEAD local) — **exécuté 4 fois ce jour** : 872a3e6 (Carte de Conception) · daac07c (Carte de Spécification) · 68ec178 (Carte de l'Analyse Approfondie) · a744270 (Carte du Plan de Réalisation) ; `git config --local` : 0 trace de jeton à chaque fois.

---

## §11 — Tableau final de conformité constitution ↔ runtime

| Article | Verdict |
|---|---|
| [1] Le projet (11 mondes · 51 quêtes · 570 items · zéro licence) | ✅ — arithmétique ancrée : 540 + 30 = 570 · 540 − 9 = 531 au runtime |
| [2] La doctrine (5 règles) | ✅ 5/5 tenues (harnais · CI · Livrable · audits) |
| [3] La langue (R1-R21) | ✅ tenu à la production · 🟡 garde machine permanente dédiée à durcir (étape 8) |
| [4] Glossaire | 🟡 **13 sigles au document vs 14 codes au registre (13 + DE)** — divergence signalée, invariant CI-17 verrouillé |
| [5] Les 11 mondes (codes gelés · liaisons · trames) | ✅ — source qui tranche la confusion domaine/monde ; liaisons.json vivant |
| [6] Freemium 6/5 | 🟡 doctrine documentée, aucun verrou câblé ⚖️ — « la rencontre n'est jamais payante » ✅ RENFORCÉE par V18 |
| [7] Les 4 étages + L'AUTRE VOIT | ✅ 3/4 livrés · 🔵 Portrait Intégral (FM-026 §2) |
| [8] Gouvernance (contrat gagne · Fiches de Mutation) | ✅ 14 fiches archivées · registres vivants · faits de trace consignés |
| [9]-[10] 3 verrous humains + rituel | ✅ « À VALIDER PAR LE COMITÉ » cité dans le code (constants.ts l.294) |
| [11-b] Brûlage | ✅ CI-16 : 770 fichiers, zéro trame, permanente |
| [11] Sécurité d'opération | ✅ push-canon.sh ×4 ce jour, 0 trace de jeton |

---

## Annexe A — Preuves (une commande = un verdict)

| # | Commande | Verdict |
|---|---|---|
| A-1 | `python3 -c` somme des 11 mondes [5] | 540 · 540+30 = 570 ✓ · 540−9 = 531 ✓ — l'arithmétique du contrat ancrée dans la constitution |
| A-2 | `grep -n "Les 14 codes" packages/shared/src/vigilance.ts` | l.33 « les 14 codes du registre signaux.json (13 gelés + DE) » — divergence 13/14 documentée au code même |
| A-3 | `grep -n "À VALIDER PAR LE COMITÉ" packages/shared/src/constants.ts` | l.294 « (verrou [9]) » · l.328 · l.333 — l'article [9] est cité par le code |
| A-4 | CI-17 (`ci/test_contrat_inventaire.py`) | 14 codes réels = 13 gelés + DE · doublons : aucun — invariant verrouillé machine |
| A-5 | `ls contrat/fiches-mutation/ \| wc -l` | 14 fiches (FM-013→023, 026, 027, 028-RETROSPECTIVE) |
| A-6 | `ls contrat/registres/` | signaux.json · liaisons.json · dyades.json · signatures |
| A-7 | `grep -rn "premium" apps/web/src --include="*.tsx"` | App.tsx l.487 SEULEMENT (commentaire de thème) — aucun verrou premium câblé |
| A-8 | `grep -rn "A7" apps/web/src --include="*.tsx"` | 0 occurrence — écran de conversion A7 non câblé ⚖️ |
| A-9 | `head -3 salle-prompts/constitution.v2.1.md` | « P0 — versionnée par FM-014, amendée par FM-018 · Ne jamais résumer » |
| A-10 | `cat scripts/push-canon.sh` | les 3 verrous de [11] implémentés (CI avant push · env éphémère · ls-remote = HEAD) |
| A-11 | `git config --local --list \| grep -i token` | 0 trace — après 4 pushes canoniques du jour |

---

## Annexe B — Journal des versions

| Version | Date | Contenu |
|---|---|---|
| v1.0 | 2026-10-03 | Première carte de la Constitution v2.1 : les 11 articles rendus à leurs preuves runtime ; arithmétique 570/531 ancrée dans le document source et démontrée par commande ; divergence [4] 13 sigles vs 14 codes signalée (la constitution gagne, la divergence est consignée) ; freemium 6/5 documenté mais non câblé ⚖️ ; faits de trace fiches de mutation consignés ; preuves vivantes du jour : verrou [9] cité dans le code, CI-16 à 770 fichiers, push-canon ×4 |
