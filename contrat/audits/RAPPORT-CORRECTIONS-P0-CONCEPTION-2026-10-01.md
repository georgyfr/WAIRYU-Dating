# RAPPORT FINAL DE MISSION — CORRECTIONS P0 CONCEPTION (post-audit hostile)

> **Livrable de réception** (Bloc 9.4) — mission exécutée le 2026-10-01, session de
> conception (périmètre : Livrable des mondes/ · contrat/ · salle-prompts/ · ci/ ·
> specification/ [acte d'addition v0.2] · contenu/mondes [brûlage F.1 ordonné au Bloc 1.1] ·
> STATUS.md). **Zéro écriture dans le code d'application** (apps/, packages/, etapes/,
> migrations/, scripts/) — scanné par la garde étendue, jamais modifié.
> Chaque correction cite sa provenance d'audit. Re-vérifiable ligne par ligne : chaque bloc
> est un commit distinct, chaque verdict machine est rejouable.

## 1. LES 8 BLOCS — EMPREINTES DE COMMIT

| Bloc | Contenu | Commit |
|---|---|---|
| 1 | 🔴 F.1 — brûlage 11-b DTM_N + garde étendue 7 formats + CI-10/CI-16 + manifeste | `16f94e2` |
| 2 | 🟠 D.3a — 3 codes Q6.2 hors zone rendue + balayage 43 fichiers | `802f9ab` |
| 3 | 🟠 D.4a-e — 5 corrections éditoriales + balayage interdits (2 hits résiduels corrigés) | `0df2071` |
| 4 | 🟠 A.1 — contrat-inventaire v1.3 matérialisé + Constitution [5] corrigée | `b7f1a07` |
| 5 | 🟡 A.2 — FM-028-RETROSPECTIVE (12 fiches fondatrices reconstituées) | `9ec2c2f` |
| 6 | 🟡 A.3/A.7/A.8/A.4 — M1.json + liaisons.json + dyades.json + invariant 14 codes + CI-17 + FM-026 §2 | `769fc43` |
| 7 | 🟡 B.1e/B.4d/B.4e — 9 cadrages scientifiques + divergence Q8 consignée | `b2eb5de` |
| 8 | 🟡 E.2/G.2a/E.4e — GABARIT-PDF.md + spec v0.2 (4 additions) | `5b119c2` |

État final CI : **17/17 VERT** (15 historiques + CI-16 garde étendue + CI-17 comptage réel
signaux) · Garde étendue 11-b : **VERT** (734 fichiers texte, 7 formats, code
d'application compris).

## 2. TABLE DE RÉCONCILIATION — LES 15 FINDINGS TRAITÉS

| Finding | Correction exécutée | Preuve machine | Statut conception |
|---|---|---|---|
| **F.1** | 4 formulations DTM_N (Q2.1-21→24) remplacées par le placeholder officiel (sha256 `0d90aef5…`) ; positions 4·10·16·24, codes, orientation, angles conservés | garde A1 = 0 occurrence · CI-10 sha256 ×4 | ✅ corrigé |
| **F.1-bis** (nouveau — balayage) | v1 de Q2.1-23 citée en clair dans la note de correction items.yaml — réécrite sans formulation | garde A1 = 0 | ✅ corrigé |
| **F.1-ter** (nouveau — balayage) | FM-013 §2 citait v1 + v2 en clair — placeholders + note de provenance | garde A1 = 0 · A2 = 2 variantes officielles intactes | ✅ corrigé |
| **D.3a** | 3 codes (Q6.2-01/03/05) retirés des citations §1 de M8-6.2/07 | balayage_codes_rendu.py : 0 code en prose rendue sur 43 fichiers | ✅ corrigé |
| **D.4a** | cartes.yaml 1.1 V1 : « n'est jamais froide » supprimé | balayage_interdits_rendu.py = 0 | ✅ corrigé |
| **D.4b** | cartes.yaml 1.2 V5 : « tu ne choisis jamais vraiment » → « tu choisis peu à voix haute » | idem | ✅ corrigé |
| **D.4c** | 07 1.3 : « devine jamais » → « devine mal » · « sans jamais être sûr » → « sans être sûr » | idem | ✅ corrigé |
| **D.4d** | contrôle auto-déclaré « zéro occurrence » (l.454) corrigé en verdict RÉEL post-correction (3 hits §1 documentés, dont l.361 « pas toujours douces » découvert par le balayage — reformulé) | le contrôle cite maintenant ses 3 hits et le verdict 0 post-fix | ✅ corrigé |
| **D.4e** | écran 3.7 : « jamais ton classement » → « sans alimenter ton classement » | idem | ✅ corrigé |
| **A.1** | contrat-inventaire v1.3 matérialisé (PARTIES 0-13, R1-R7, 11 mondes, équation CI) ; 4.2 = 19 (10 RB1 + 8 RSQ + 1 ouverte) ; Constitution [5] corrigée (M5 = 50 exact) ; 50 citations de dossiers toutes résolues ; arithmétique 540 = Σ quêtes vérifiée machine | la SOURCE UNIQUE [8] existe ; 51 références résolubles | ✅ corrigé |
| **A.2** | FM-028-RETROSPECTIVE : FM-001→FM-012 reconstituées (12 décisions, mention RECONSTITUTION, perte assumée et consignée) | les 75 citations « FM-011 v2 » sont résolubles | ✅ corrigé |
| **A.3** | contrat/registres/signatures/M1.json matérialisé (28 ids nommés + 6 sécurité hors-dépôt) — écart 17/19 TEL QUEL, note « en attente de tranchage Q4 » ; invariant 30/35 inchangé | CI-14 vérifie M1.json (28 nommés + note Q4) | ✅ corrigé (tranchage Q4 = comité) |
| **A.4** | FM-026 §2 : « 1.8 (9 items PHQ-9) + 30 trames fiabilité non matérialisées = 39 différés » | décomposition gravée au contrat v1.3 §13.2 | ✅ corrigé |
| **A.7** | liaisons.json (6 liaisons cœur COMPLÈTES + stubs intime/soi documentés) + dyades.json (format cadré CNV/FRI/TROV verbatim source, 62 prévues / 0 matérialisées) — matérialisation partielle CHOISIE | 2 JSON valides, liaisons = celles de coeur.md §2 | ✅ corrigé |
| **A.8** | invariant « 18 codes » → « **14 codes (13 gelés + DE)** » + CI-17 (comptage RÉEL de signaux.json — un registre vidé rend la CI rouge) | CI-17 PASS : 14 codes réels listés | ✅ corrigé |
| **B.1e** | 6 cadrages scientifiques (1.1 Goldberg/IPIP · 1.2 Bowlby/Ainsworth/Fraley · 2.1 Schwartz · 4.1 Bowen/Boszormenyi-Nagy · 4.4 Young · 1.9 Deci & Ryan) — verrou « jamais au rendu » | zéro nom d'auteur hors 00-README (machine) | ✅ corrigé |
| **B.4d** | cadrages moteur 4.2 (Bonanno/Field) et 3.4 (Dew/Britt) — verrou identique | idem | ✅ corrigé |
| **B.4e** | cadrage moteur 5.1 (Sternberg/Berscheid) — verrou identique | idem | ✅ corrigé |
| **E.2** | contrat/GABARIT-PDF.md — le cahier des charges de forme complet (A5, Nunito 11pt/1.45, structure, page finale GAB-REN, contrats jsPDF/Puppeteer, verrous de contenu) | le carnet est productible | ✅ corrigé |
| **G.2a** | accessibilité imprimée gravée dans le gabarit (contraste ≥ 4,5:1 · corps min 11 pt · zéro info par la couleur seule) | GABARIT-PDF.md §5 | ✅ corrigé |
| **E.4e** | spec v0.1 → v0.2 (acte d'addition, v0.1 inchangé) : page professionnel + carnet téléchargeable + gabarit PDF + Portrait Intégral — référence circulaire supprimée, cohérence l.538-541/l.597-600 vérifiée | spec v0.2 (4 additions) | ✅ corrigé |

**Bilan : 15 findings d'audit traités (+ 2 findings nouveau F.1-bis/F.1-ter découverts par
les balayages, traités identiquement) — tous les verdicts machine rejouables par un
re-auditeur : `python3 ci/test_contrat_inventaire.py` · `python3 ci/outils/garde_p0.py` ·
`python3 ci/outils/balayage_codes_rendu.py` · `python3 ci/outils/balayage_interdits_rendu.py`.**

## 3. LES FINDINGS LAISSÉS AU CHANTIER D'IMPLÉMENTATION (hors périmètre conception)

**B.5a-c · B.5d · C.3.1 · C.3.2 · D.5a · F.2a-b · F.3 · F.4 · G.1a-c** — code d'application,
pipeline de contenu machine, et migrations : périmètre de l'agent d'implémentation (aucune
écriture conception autorisée — la garde étendue a scanné ces dossiers, jamais modifié).

## 4. LES QUESTIONS COMITÉ (Q1-Q10) — CONSIGNÉES EN ATTENTE, NON TRANCHÉES

| Q | Objet | État |
|---|---|---|
| Q4 | écart d'arithmétique du registre M1 (17 annoncées / 19 narratives = 32) | matérialisé TEL QUEL (M1.json) + note « en attente Q4 » — CI-14 le vérifie, l'invariant 35 sera ajusté après tranchage |
| Q5 | composition des 39 différés | CLARIFIÉ (A.4 + contrat v1.3 §13.2 : 9 PHQ-9 + 30 fiabilité tissée) — la question porte désormais sur la LEVÉE des verrous, pas sur le décompte |
| Q8 | doctrine de citation (harmonisation) | pattern majoritaire appliqué (9 blocs) ; divergence persistante 6.1/6.2 (charte TEMPÉRATURE) consignée aux 00-README — point ouvert |
| Q1-Q3, Q6-Q7, Q9-Q10 | rejets et arbitrages de l'auditeur | NON TRANCHÉS par cette mission (règle transversale) — à l'ordre du jour comité |

## 5. VERDICT DE RE-AUDIT ATTENDU

Si l'auditeur externe re-passe à froid : les **findings conception (F.1 · D.3a · D.4a-e ·
A.1 · A.2 · A.3 · A.4 · A.7 · A.8 · B.1e · B.4d · B.4e · E.2 · G.2a · E.4e) doivent passer à
✅** sur la base des preuves ci-dessus (commits séparés, outils rejouables, verdicts machine).
Les findings d'implémentation et les questions Q1-Q10 restent hors périmètre de cette
clôture. La sécurité publique (F.1) est rétablie : **zéro formulation de trame en clair sur
les 734 fichiers texte du dépôt** (7 formats scannés, aiguilles normalisées, placeholder
officiel intact — sha256 `0d90aef5…f8cb`).
