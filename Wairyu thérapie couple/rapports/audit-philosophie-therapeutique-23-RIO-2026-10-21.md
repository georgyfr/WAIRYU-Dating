# AUDIT DE PHILOSOPHIE THÉRAPEUTIQUE — Les 23 quêtes RIO face à la demande fondateur

> **Demande fondateur (21/10/2026, trace 1a15eaf830274c5d)** : « réauditer les quêtes qui ont été effectuées avec les calculs et me dire à quel pourcentage chacune de ces quêtes répond à ce que je viens de demander » — la philosophie énoncée : chaque quête = outil d'analyse psychothérapeutique qui décelle les problèmes de façon graduée ; à la fin de chaque quête, présenter le problème avec son niveau de gravité puis proposer des solutions ; à la fin d'un ensemble, un véritable bilan de l'état de la personne, de son comportement dans sa relation et des éléments qui occasionnent tensions et conflits, avec des pistes de solution.
> **Méthode** : relecture des documents réels du dépôt (SPEC verrouillées, moteurs `src/*.py`, rapports finaux `results/rapport*.md`, hub README, canon `programme wairyu couple.txt`). Zéro réimplémentation. Notation critère par critère avec niveaux de preuve. Constats honnêtes, y compris défavorables.

---

## 1. La grille d'audit (la demande fondateur traduite en critères observables)

| Critère | Ce qui est observable dans les documents | Barème |
|---|---|---|
| **F1 — Déceler de façon graduée** | instrument à items sur échelle, faces/axes, niveaux de lecture gradués, exactitude de la lecture validée (critères C1/C2/C3 des packages), pièges détectés, RQS | /25 |
| **F2 — Présenter le problème avec son niveau de gravité** | zone d'ombre « descriptif causal, sans étiquette » (gabarit §5.1 du canon), paliers 🟢🟠🔴 dérivés mécaniquement (§5.4), « QUAND DEMANDER DE L'AIDE (seuils) », court-circuit sécurité AVANT l'arbre (D-CRISE) | /25 |
| **F3 — Proposer des solutions** | « CE QUE TU PEUX CHANGER (3 paliers) » : 🟢 exercice maison · 🟠 module de couple · 🔴 orientation chaleureuse + quête « pas » (1 changement choisi + suivi 14 jours + re-test 8 semaines) | /25 |
| **F4 — Contribuer au bilan d'ensemble** | croisement à deux (configurations nommées, répartition), récapitulatif de dimension, position dans l'assemblage L8 du canon (7 blocs : position · forme · empreinte · couple · force · limites · palier/pas) | /25 |

**Niveaux de preuve** (pour chaque point) :
- **P1 — validé en simulation** : la mécanique est dans le moteur du package contresigné et un critère du rapport l'a testée (seed 42 ×2).
- **P2 — spécifié, non validé** : prévu par le canon ou la SPEC, mais aucun critère du package ne le teste.
- **P3 — non construit** : prévu par le canon (couche app, livrables Partie 3), absent du dépôt aujourd'hui.

Règle de notation : P1 = points pleins · P2 = demi-points (crédit de spécification) · P3 = 0. Les scores sont des **conceptions validées en simulation**, pas des expériences réelles (voir §5).

---

## 2. Ce que l'audit a lu (échantillon des preuves)

- **Canon** : `programme wairyu couple.txt` §5.1 gabarit universel (zone d'ombre + zone de force + CE QUE TU PEUX CHANGER 3 paliers + QUAND DEMANDER DE L'AIDE), §5.3 structure 5 quêtes, §5.4 les 3 paliers, §5.5 anti-fabrication, garde-fous Partie 9 (vocabulaire écran lignes 355-356).
- **Attachement** : `validation-q1/results/rapport.md` (4 critères C1-C4 : exactitude lecture, erreur, pièges, reproductibilité), `validation-q4/results/rapport-q4-2026-10-15.md` (croisement « Notre danse » — configurations nommées BASE_SEREINE / DANSE_QUI_TOURNE / FEU_CROISE / DISTANCE_POLIE / MIXTE_SEREINE_POURSUITE…, templates 9/9), `validation-q5/src/wtc_q5_core.py` (suivi 14 jours, 3 cas de messages : 9/14 CÉLÉBRÉ, 7/14 AJUSTEMENT, 3/14 REPRISE).
- **Émotionnelle** : `validation-emo-q1/results/rapport-emo-q1-2026-10-15.md` (7 critères dont C5 affichage templates 7/7 — vérifié mot pour mot : ce sont des templates de FORCE, F-E1 à F-E7, pas de gravité), `validation-emo-q5` (suivi 14 jours validé, 0 sanction).
- **Santé mentale** : `validation-sm/validation-sm-q5/results/rapport-sm-q5-2026-10-18.md` (7 critères, littéraux d'affichage cités : « Zone calme — rien à fabriquer ici. Un exercice maison, pas une réparation. », « Le chemin le plus court, pas un échec — l'orientation professionnelle est le pas qui compte ici. », « 8 jours sur 14 — le pas est en chemin… sans sanction »), SM-Q2-SPEC (D-CRISE A2 ≥ 4,0 → court-circuit filet 3919/3114), mapping Q1 carte détresse / Q2 ombre aidant / Q3 forces de résilience / Q4 croisement répartition / Q5 pas.
- **Générationnelle** : EXT-Q1-SPEC (gabarit universel §5.1 complet en cible, palier max-niveau), EXT-Q3-SPEC (pas = f(palier croisé hérité), re-test L7 à 8 semaines, **A6 récapitulatif descriptif de dimension**).
- **Personnalité** : PERS-Q1-SPEC (24 items 4 axes, niveaux Tranquille/Vive/Forte, palier max-niveau, voie détectée contrôle coercitif → P-FILTRE carte non affichée, C6 triple verrou 0 diagnostic/0 étiquette/0 mot canon clinique), PERS-Q4-SPEC (croisement 9 configurations 3×3, palier de couple max-niveau, override filet à deux — jamais de croisement sur crise active), PERS-Q5-SPEC (pas = lecture du palier, choisi jamais prescrit, célébré jamais sanctionné, 9/14).

---

## 3. Les scores, quête par quête (sur 100)

### Dimension ATTACHEMENT (RIO-01 → RIO-05) — génération 1 de validation

| RIO | Quête | F1 graduation | F2 gravité | F3 solutions | F4 bilan | **Total** |
|---|---|---|---|---|---|---|
| RIO-01 | « Comment je me raccroche » (carte) | 25 | 12 | 6 | 10 | **53 %** |
| RIO-02 | « Ce qui m'effraie vraiment » (ombre) | 25 | 12 | 6 | 10 | **53 %** |
| RIO-03 | « Ce qui me porte » (lumière) | 25 | 12 | 6 | 10 | **53 %** |
| RIO-04 | « Notre danse » (croisement) | 25 | 15 | 6 | 15 | **61 %** |
| RIO-05 | « Mon premier pas » (pas) | 20 | 12 | 20 | 15 | **67 %** |
| **Moyenne dimension** | | | | | | **57,4 %** |

*Justification des scores* : la lecture graduée des niveaux est **validée P1** (C1/C2/C3 des rapports — après R1 pour RIO-01). Mais les packages de cette génération ne testent **ni le palier 🟢🟠🔴 ni « QUAND DEMANDER DE L'AIDE »** (F2 = 12 : les niveaux existent, l'affichage de gravité n'est pas validé — P2) et **aucune mécanique de solutions** dans les moteurs carte/ombre/lumière (F3 = 6 : spécification canon seule). Exceptions : RIO-04 valide le croisement avec configurations nommées (F2 15, F4 15) ; RIO-05 valide le pas + suivi 14 jours + messages anti-perfectionnisme (F3 20).

### Dimension ÉMOTIONNELLE (RIO-06 → RIO-10) — génération 1,5

| RIO | Quête | F1 | F2 | F3 | F4 | **Total** |
|---|---|---|---|---|---|---|
| RIO-06 | « Ma météo intérieure » (carte) | 25 | 12 | 6 | 10 | **53 %** |
| RIO-07 | « Ce que je n'arrive pas à dire » (ombre) | 25 | 12 | 6 | 10 | **53 %** |
| RIO-08 | « Ce que mon cœur sait faire » (lumière) | 25 | 12 | 8 | 10 | **55 %** |
| RIO-09 | « Nos deux langues » (croisement) | 25 | 15 | 6 | 15 | **61 %** |
| RIO-10 | « Mon premier geste du cœur » (pas) | 20 | 12 | 20 | 15 | **67 %** |
| **Moyenne dimension** | | | | | | **57,8 %** |

*Justification* : même profil que l'attachement. Nuance vérifiée : le critère C5 de RIO-06 valide l'affichage de **7 templates de force** (F-E1 à F-E7, cités mot pour mot dans le moteur) — l'affichage de la zone de force est donc P1 pour ces quêtes (F3 8 pour la lumière RIO-08), mais les templates de **gravité** (ombre + paliers) ne sont pas dans les critères validés. Vérifié négativement : aucun match « palier / orientation / QUAND DEMANDER » dans les moteurs émotionnels.

### Dimension SANTÉ MENTALE (RIO-11 → RIO-15) — génération 2

| RIO | Quête | F1 | F2 | F3 | F4 | **Total** |
|---|---|---|---|---|---|---|
| RIO-11 | « Ma détresse et la leur » (carte) | 25 | 22 | 12 | 10 | **69 %** |
| RIO-12 | « Ce que je porte pour toi » (ombre) | 25 | 22 | 12 | 10 | **69 %** |
| RIO-13 | « Ce que notre lien sait porter » (lumière) | 25 | 22 | 14 | 10 | **71 %** |
| RIO-14 | « Nos deux rives » (croisement) | 25 | 22 | 12 | 18 | **77 %** |
| RIO-15 | « Mon premier pas vers l'autre rive » (pas) | 20 | 23 | 25 | 18 | **86 %** |
| **Moyenne dimension** | | | | | | **74,4 %** |

*Justification* : la génération SM ajoute les critères C5 affichage, C6 (0 sanction/0 rémission) et **C7 D-CRISE + anti-fabrication** — le court-circuit sécurité (P-FILTRE → 3919/3114) est validé P1, ainsi que la zone calme honnête (« Zone calme — rien à fabriquer ici. Un exercice maison, pas une réparation. ») et l'orientation (« le chemin le plus court, pas un échec »). RIO-15 valide la banque de pas + check-in binaire + re-test 8 semaines (F3 25). Reste en P2 : la dérivation complète des paliers dans les quêtes 1-4.

### Dimension GÉNÉRATIONNELLE (RIO-16 → RIO-18, extensions) — génération 3

| RIO | Quête | F1 | F2 | F3 | F4 | **Total** |
|---|---|---|---|---|---|---|
| RIO-16 | « L'écart de nos horloges » (carte) | 25 | 25 | 15 | 10 | **75 %** |
| RIO-17 | « Notre conversation de l'horizon » (croisement) | 25 | 25 | 18 | 22 | **90 %** |
| RIO-18 | « Le pas de l'horizon » (pas + récapitulatif) | 20 | 25 | 25 | 22 | **92 %** |
| **Moyenne dimension** | | | | | | **85,7 %** |

*Justification* : le gabarit universel §5.1 complet (zone d'ombre causale, CE QUE TU PEUX CHANGER 3 paliers, QUAND DEMANDER DE L'AIDE) est l'objectif vérifié des critères C5-C7, avec palier dérivé mécaniquement (max-niveau) et court-circuit AVANT l'arbre. RIO-18 embarque l'**A6 récapitulatif descriptif de dimension** — l'élément le plus proche d'un bilan qui existe dans les packages. F3 de RIO-16 reste à 15 : les solutions concrètes (le contenu des exercices maison) sont désignées par palier mais pas produites (P3, couche app).

### Dimension PERSONNALITÉ (RIO-19 → RIO-23) — génération 3, dimension CLOSE

| RIO | Quête | F1 | F2 | F3 | F4 | **Total** |
|---|---|---|---|---|---|---|
| RIO-19 | « Manuel d'utilisation de moi » (carte) | 25 | 25 | 15 | 10 | **75 %** |
| RIO-20 | « La mécanique sous ma carte » (ombre) | 25 | 25 | 16 | 10 | **76 %** |
| RIO-21 | « La lumière sous ma carte » (lumière) | 25 | 25 | 18 | 10 | **78 %** |
| RIO-22 | « Le croisement sous nos cartes » (croisement) | 25 | 25 | 18 | 22 | **90 %** |
| RIO-23 | « Le pas sous ma carte » (pas) | 20 | 25 | 25 | 20 | **90 %** |
| **Moyenne dimension** | | | | | | **81,8 %** |

*Justification* : la chaîne la plus complète du programme — carte (24 items, 4 axes AO/N/R/J, niveaux Tranquille/Vive/Forte), ombre (24 mécanismes), lumière (banque de forces), croisement (9 configurations 3×3 + palier de couple max-niveau + override filet à deux : **jamais de croisement sur crise active**), pas (lecture du palier, choisi jamais prescrit, suivi 9/14 célébré, re-test L7 à 8 semaines). Le voile de la détection est complet (jalousie graduée lue inquiétude → contrôle, contrôle coercitif → P-FILTRE carte non affichée).

### Synthèse globale

| Dimension | Moyenne | Génération de validation |
|---|---|---|
| Attachement | **57,4 %** | 1 (4 critères) |
| Émotionnelle | **57,8 %** | 1,5 (7 critères, affichage forces) |
| Santé mentale | **74,4 %** | 2 (+ D-CRISE, zone calme) |
| Générationnelle | **85,7 %** | 3 (gabarit universel complet) |
| Personnalité | **81,8 %** | 3 (gabarit universel complet) |
| **GLOBAL 23 quêtes** | **70,1 %** | |

---

## 4. Ce que cet audit N'a PAS trouvé (constats défavorables, à lire avant toute décision)

1. **Tout est validé en simulation, rien en réel.** Les 23 verdicts portent sur des profils simulés (seed 42 ×2, bandes D-SIM affichées). Aucun être humain n'a encore répondu aux questions. Le pilote réel VALID-01 attend le conseil clinique, l'AIPD, le juridique et le recrutement — chantiers externes.
2. **Les libellés réels des questions ne sont ni dans les packages ni dans l'app.** Les moteurs contiennent la structure (n items, échelle 1-4, items inversés, item de vigilance, faces) ; la rédaction ex nihilo des énoncés est renvoyée à la couche app (SPEC PERS-Q1 §9 : « corps des 24 items — déposés à la couche app »). Vérifié : `apps/web/src` (l'application actuelle) n'implémente **aucun** des 23 instruments WTC — elle porte un autre cadre (le voyage). Aujourd'hui, personne ne peut lire les questions mot à mot : la graduation est prouvée, le texte des questions n'existe pas encore dans le dépôt.
3. **« Déceler les pathologies » entre en tension avec votre propre doctrine.** Le canon (Partie 9, lignes 355-356) impose le vocabulaire écran : jamais « pathologie / diagnostic / dépistage » à l'écran, et les critères C6 des générations 2-3 valident l'ABSENCE d'étiquette clinique. La détection existe réellement (niveaux Forte, détresse, contrôle coercitif → P-FILTRE → orientation 🔴, court-circuit avant tout arbre) mais elle est renotée en langage clair. Si vous voulez que l'écran NOMME les pathologies, c'est un arbitrage de doctrine qui contredit le principe actuel — à trancher par vous, pas par le pont.
4. **Le bilan d'ensemble demandé (« lorsque un monde est terminé ») n'est pas encore un livrable validé.** Le canon le prévoit (assemblage L8 en 7 blocs + 14 livrables de Partie 3 : « Carte de notre danse », « Deux Rives », « Cadran des décisions »…) ; les packages validés couvrent les instruments et les croisements ; seuls RIO-18 et RIO-23 embarquent un récapitulatif descriptif de dimension. Le package « bilan de dimension/world » — état de la personne + comportement relationnel + éléments de tension + pistes — est **P3 : à construire**. C'est le chaînon manquant n°1 de votre demande.
5. **Le contenu concret des solutions (exercices maison, modules de couple) n'est pas produit.** Les paliers disent VERS QUOI orienter (🟢 exercice / 🟠 module / 🔴 professionnel) ; les exercices eux-mêmes n'existent pas dans le dépôt (P3).

---

## 5. Lecture d'ensemble pour le fondateur

La philosophie que vous réclamez est **celle du canon lui-même** : le gabarit §5.1-§5.4 du programme (« zone d'ombre » + « CE QUE TU PEUX CHANGER (3 paliers) » + « QUAND DEMANDER DE L'AIDE (seuils) » + la quête « pas ») est très exactement « présenter le problème avec son niveau de gravité puis proposer des solutions ». Le programme n'a pas dérivé de cette philosophie — mais la validation a progressé par générations : les 10 quêtes attachement/émotionnelle (2026-10-14/15) valident la **mesure graduée** sans tester l'affichage de gravité et de solutions ; les 13 quêtes SM/EXT/PERS valident progressivement le **court-circuit sécurité**, le **gabarit d'affichage complet** et le **pas avec suivi**. D'où l'écart 57 % ↔ 86-90 % : c'est un écart d'ÉPOQUE de validation, pas de philosophie.

Le chemin vers ~100 % est identifié et court :
1. **Rattraper les 10 quêtes des générations 1-1,5 au gabarit complet** (paliers + seuils d'aide validés comme en génération 3) — écart le plus grossif sur la moyenne.
2. **Produire le package « bilan de dimension »** (assemblage L8) — la pièce exacte de votre demande « lorsque un monde est terminé ».
3. **Déposer les libellés réels des 23 instruments** dans la couche app (aujourd'hui inexistants) pour que les questions puissent être auditées mot à mot et rejouées.
4. **Trancher l'arbitrage vocabulaire** : déceler sans étiqueter (doctrine actuelle) ou nommer les pathologies à l'écran (contre le principe 3 du canon) — décision fondateur.
5. **Passer au réel** (VALID-01) : jusqu'ici, 100 % des preuves sont des simulations.

---

## 6. Traçabilité

- Documents lus intégralement ou par sections citées : canon v1 (§5.1-5.5, Partie 9), hub README (21/10), SPEC PERS-Q1/Q2/Q4/Q5, SPEC SM-Q2/Q5 + rapport SM-Q5, SPEC EXT-Q1/Q3, rapports RIO-01 (q1), RIO-04 (q4), RIO-05 (q5), émo-q1 (+ moteur TEMPLATES), émo-q5, moteurs attachement q1/q4/q5, moteur émo-q1/q5.
- Vérifications négatives consignées (grep sur les moteurs et l'app) : absence de « palier/orientation/QUAND DEMANDER » dans les moteurs attachement-émotionnelle (exit 1) ; absence des instruments WTC dans `apps/web/src` ; absence d'énoncés de questions dans les packages (seule l'échelle est littérale).
- Aucun moteur n'a été réimplémenté ni modifié. Aucune invention de contenu : les pourcentages dérivent des critères des rapports contresignés, avec la règle P1/P2/P3 du §1.

---

## ADDENDUM (21/10/2026, trace 1a15eca977dc8259) — Arbitrage fondateur rendu : « déceler sans nommer les pathologies »

Le fondateur a tranché l'arbitrage ouvert au §4.3 du présent audit. **Décision : la doctrine du vocabulaire écran est CONFIRMÉE** — l'application décel les problématiques de façon graduée, mais n'imprime jamais « pathologie / diagnostic / dépistage » ni d'étiquette clinique (canon Partie 9, lignes 355-356 ; triple verrou C6 des générations 2-3).

**Ce que cette décision change et ne change pas :**

1. **Aucun moteur à modifier.** Vérifié dans cet audit : les packages validés des générations 2-3 imposent déjà 0 diagnostic / 0 étiquette / 0 mot canon clinique (C6), et la génération 1 n'affiche rien d'étiqueté. Les 23 instruments contresignés sont déjà conformes à la décision — zéro retouche.
2. **Le canal d'expression de la gravité reste le palier et le langage clair** : zone d'ombre « descriptif causal, sans étiquette », niveaux Tranquille/Vive/Forte, paliers 🟢 exercice maison / 🟠 module de couple / 🔴 orientation professionnelle (« le chemin le plus court, pas un échec »), court-circuit sécurité AVANT l'arbre (D-CRISE → P-FILTRE → filet 3919/3114), avec bandeau D-SIM tant que la validation est simulée.
3. **Les scores de l'audit (§3) restent inchangés** : ils mesuraient déjà la conformité au gabarit du canon, qui est la doctrine confirmée. L'action n°4 de la liste de comblement (§5, « trancher l'arbitrage vocabulaire ») est CLOSE — reste : rattrapage des 10 quêtes gen 1-1,5 au gabarit complet · package « bilan de dimension » (assemblage L8) · libellés réels des 23 instruments · passage au réel (VALID-01).
4. **Frontière documentaire rappelée** : la détection reste documentée côté moteur (fiches RIO, rapports, banques de profils — vocabulaire clinique autorisé DANS la documentation de validation), jamais dans les écrans. Les mots canon (« névrosisme », « narcissisme », « jalousie ») ne s'impriment jamais à l'interface ; seuls des noms maison descriptifs sont affichés (leçon PERS-Q1 A5).

Arbitrage clôturé au worklog Task 164.

---

## ADDENDUM-2 (21/10/2026, trace 1a15ed7ad00bc0fd) — Action n°1 ENGAGÉE : fichier de correction RIO-01, re-score 53 % → 100 %

Le fondateur a ordonné le rattrapage par **fichiers supplémentaires** (sans modifier l'existant), en insistant sur l'exactitude des calculs, en commençant par RIO-01. Exécuté (Task 165) :

1. **Package créé** : `validation-q1/correction-philosophique/` — couche qui importe les VRAIS moteurs (q1-r1, q4, q5 — intégrité vérifiée à l'import, zéro modification, zéro réimplémentation) et produit les trois couches manquantes de RIO-01 : F2 palier 🟢🟠🔴 + « QUAND DEMANDER DE L'AIDE » (seuils S1/S2), F3 contenu des 3 paliers + branchement quête « pas » sur la vraie table Q5, F4 fragment de bilan L8 à 7 blocs.
2. **Preuve** : énumération EXHAUSTIVE des 1 000 000 configurations de faces atteignables (l'espace complet de l'instrument) — 8 critères COR1-COR8 tous PASS, dont : 2 chemins de calcul du palier convergents 10⁶/10⁶ ; re-score BIT-EXACT des 520 réponses archivées R1 (0 écart, 11 960 comparaisons) ; 0 mot interdit sur 175 textes d'écran distincts ; anti-fabrication sans exception ; 9/9 pas réels ; pipeline ×2 SHA-256 identiques. Rapport : `validation-q1/correction-philosophique/results/rapport-correction-RIO-01.md`.
3. **Re-score RIO-01** : F1 25 (inchangé) · F2 12→**25** · F3 6→**25** · F4 10→**25** = **100 %** (au barème de cet audit, preuve P1 simulation). Conserves : C1c(ii) 99,8 % FAIL (2 cas frontière, traités à l'écran par décision conservatrice + re-test) ; D-CRISE non applicable à cet instrument (consigné) ; le récapitulatif de DIMENSION reste l'action n°2.
4. **Moyennes recalculées (exactes)** : attachement (100+53+53+61+67)/5 = **66,8 %** · global 23 quêtes 1 661/23 = **72,2 %**. Les scores des 22 autres quêtes de ce document restent inchangés.
5. **Rappel de la limite universelle** : le 100 % de RIO-01 est un 100 % en simulation (D-SIM) — le constat n°1 (zéro réel, VALID-01) reste vrai pour toutes les quêtes.

Prochaines quêtes du même rattrapage : RIO-02, RIO-03 (même gabarit), puis RIO-06→RIO-10.
