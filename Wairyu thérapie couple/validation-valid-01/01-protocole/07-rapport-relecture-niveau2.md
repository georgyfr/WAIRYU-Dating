# 07 — Rapport de relecture fond intégral (préparation contresignature niveau 2)

> **Document de travail du superviseur sortant — 21/10/2026**
>
> Objet : relecture du fond intégral du package protocole v1.1 (7 documents,
> 1 884 lignes), préalable à la contresignature niveau 2 annoncée par le
> README du package. Cette relecture est exécutée sur ordre fondateur
> « passons à la suite » (trace 1a15d54ba68e0129), dans le chantier de
> consolidation VALID-01 ouvert en Task 150-151.
>
> **Règle appliquée : signalement sans correction libre** — aucun document
> du protocole n'a été modifié par cette relecture. Les corrections
> éventuelles (mécaniques ou de fond) exigent un arbitrage explicite.

---

## A. Périmètre et méthode

| Document | Lignes | Lu intégralement |
|----------|--------|------------------|
| `01-protocole-etude.md` | 564 | ✅ |
| `02-consentement-eclaire.md` | 234 | ✅ |
| `03-criteres-psychometriques.md` | 297 | ✅ |
| `04-filets-securite-incident.md` | 342 | ✅ |
| `05-timeline-calendrier.md` | 249 | ✅ |
| `06-criteres-arret.md` | 174 | ✅ |
| `README.md` (sommaire) | 25 | ✅ |

Méthode : lecture intégrale document par document ; croisement des chiffres
entre prose, tableaux et documents (D-CHECK) ; vérification que les 6
amendements, 3 arbitrages et 5 recommandations de la contresignature
niveau 1 sont réellement présents dans le corps des textes ; vérification
des renvois croisés ; recoupement avec `legal/licences-validite-convergente.md`
(vérification R3 datée du 21/10/2026) ; vérification des numéros d'urgence
et de la puissance statistique annoncée.

---

## B. Ce qui est solide (vérifié et confirmé)

1. **Amendements A1-A6 tous intégrés dans le corps des textes** : A1
   (250-300 recrutés / 150-200 analysables — §6.4, §7.1, Phase 1, README) ;
   A2 (≥ 30 paires — §7.4, Phase 1) ; A3 (pré-enregistrement OSF —
   §13.1.bis, Phase 0, validation finale filets §8.4) ; A4 (test d'incendie
   5 scénarios — filets §8.2, Phase 0, §8.4) ; A5 (conflit d'intérêt 3
   niveaux — consentement FR/EN, §15.3, contenu OSF) ; A6 (assurance RC —
   §14.6, filets §8.4, Phase 0).
2. **Arbitrages niveau 1 retrouvés** : ligne d'urgence Option B avec
   migration si Type C/D > 5 % (filets §5, cohérent avec Phase 1
   mi-collecte ~75 T0) ; AIPD formelle sans CPP (§14.5) ; conseil 6 membres
   (§14.4).
3. **Les 5 recommandations retrouvées identiques** dans le document 03
   §11 et cohérentes avec le README : α 0,80 pour valider (0,85 objectif
   signalé), RMSEA 0,08, T8 = 8 semaines, item-total ≥ 0,30 avec règle
   package R2, open data (oui agrégats/instruments, non réponses libres).
4. **Chiffres croisés cohérents** : 250-300/150-200 partout ; attrition
   30-50 % ; ≥ 30 paires ; n=50 validité convergente (§8.4, doc 03 §6.4,
   consentement case séparée) ; n=10 D-TEST (OS12, doc 03 §8.1, Phases
   3-4, consentement) ; durée totale 9 mois canoniques.
5. **Puissance statistique exacte** : n = 29 minimum pour détecter
   r ≥ 0,50 (puissance 0,80, α 0,05 bilatéral) — n=50 « marge confortable »
   correctement justifié (doc 03 §6.4).
6. **Numéros d'urgence vérifiés corrects** (FR : 3919, 3114, 15, 112, 17,
   SOS Amitié, Suicide Écoute ; BE : 1712, 107, 0800 32 123 ; CH : 143,
   144, 147 ; CA-Québec : 1-800-363-9010, 514-723-4000, 1-866-APPELLE).
7. **Cascade des seuils opérationnelle** : réponse T2 75 % objectif /
   60 % investigation / 40 % futilité ; futilité < 100 à T0 ; attrition
   futilité > 60 % (bien au-dessus des 25-35 % prévus).
8. **Principes non négociables appliqués** : langage B1 du consentement,
   jamais l'évaluation du partenaire, filets prioritaires et
   non-culpabilisants (« tu peux », jamais « tu dois »), calcul 100 %
   local, anonymisation à la source, hébergement UE.
9. **Règles héritées D-STD/D-STD-2/D-CHECK/D-TABLE/D-ENV/D-SIM**
   effectivement appliquées dans les textes (seuils posés a priori,
   sous-groupes D-STD-2, D-SIM inversé en fin de pilote, D-ENV en Phase 0).
10. **Cohérence RGPD art. 9** entre document principal (§14.1) et
    consentement (consentement distinct des CGU, email haché, conservation
    10 ans, droits 15-17 rappelés).

---

## C. Signalements bloquants — arbitrage requis AVANT contresignature niveau 2

### B1 — Validité convergente : l'usage prévu de l'ECR-R croise la restriction commerciale consignée (R3)

**Constat** : le protocole prévoit l'**administration de l'ECR-R** (36 items)
à un sous-groupe n=50 (§8.4 [À VALIDER], doc 03 §6.1-6.4, consentement
FR/EN — case séparée, critères de succès du pré-enregistrement OSF). Le
promoteur de l'étude est **WAIRYU (commercial)** (§1). Or la vérification
datée du 21/10/2026 (`legal/licences-validite-convergente.md`) consigne
verbatim la FAQ de l'auteur : *« You may not use the scales for commercial
purposes without permission. »* — l'usage de recherche est « non-commercial
research » seulement.

**Analyse** : la pratique WTC actuelle (paraphrases de construits, zéro item
intégré) est conforme et reste conforme. Mais **administrer intégralement
l'ECR-R dans une étude dont le promoteur est l'éditeur commercial du
produit validé** est un changement de classe d'usage par rapport à la
« comparaison de construits » consignée. Le protocole (daté 15/10) précède
la vérification R3 du 21/10 — le croisement n'avait pas été porté au
protocole. Le point §17-5 soumis au conseil (« ECR-R et RQ sont-ils les
bons instruments ? ») pose la question de la pertinence, pas celle de la
licence.

**Options (arbitrage fondateur requis)** :
- **(a)** demander une **permission écrite de l'auteur** (R. C. Fraley)
  avant collecte — voie propre, délai externe, résultat incertain ;
- **(b)** basculer la validité convergente sur le **RQ** (Bartholomew &
  Horowitz, public — seuils 0,40 déjà prévus dans H5) et, si un second
  instrument est voulu, le **CSI** (distribué sans lettre par le co-auteur,
  canal institutionnel noté) — **reformulation de H5 et des critères OSF
  requise**, sans toucher aux instruments WTC ;
- **(c)** qualifier l'étude de recherche non commerciale via une structure
  académique partenaire — complexe, à instruire avec le juridique.

**Urgence relative** : le pré-enregistrement OSF.io (A3) **fige les
critères de succès** — l'arbitrage B1 doit précéder la publication OSF.

### B2 — Seuil d'arrêt pour faux négatifs : « > 3 » (filets) vs « 3 » (critères d'arrêt)

**Constat** : le document 04 §4.2 (Type C) écrit « Si **> 3** faux négatifs
sur le pilote : arrêt de l'étude » (le 4ᵉ déclenche) ; le document 06 §1.2
écrit « **3** incidents Type C (faux négatifs) sur l'ensemble du pilote →
arrêt sous 48h » (le 3ᵉ déclenche). Un critère de **sécurité** porte
deux valeurs différentes dans deux documents.

**Recommandation** (soumise à arbitrage) : aligner sur **≥ 3** (le plus
protecteur, conforme au principe « tout faux négatif est un échec du
système » et au document 06) — ou tout autre seuil unique explicitement
choisi, appliqué aux deux documents.

---

## D. Signalements de consistance (non bloquants, corrections mécaniques possibles sur ordre)

| # | Localisation | Constat | Correction proposée |
|---|--------------|---------|---------------------|
| S1 | doc 01 en-tête + §1 | « Version : 1.0 (brouillon superviseur actif) » vs README package « package révisé v1.1 » | Libeller v1.1 au doc 01 (ou justifier la conservation du 1.0) |
| S2 | doc 01 §17 point 6 | « Composition du conseil clinique : 5 membres proposés » vs arbitrage §14.4 fixé à **6 membres** | Actualiser le libellé (le point reste soumis au conseil, en version 6 membres) |
| S3 | doc 01 §14.4 + doc 05 Phase 0 | « les 62 points [À VALIDER] » : aucun comptage reproductible actuel ne donne 62 (68 points listés ; 54 restants après les 14 arbitrages niveau 1 ; 14 marqueurs inline) | Ancrer le chiffre à un comptage daté ou remplacer par le comptage réel |
| S4 | doc 03 §1.1 tableau | α ≥ **0,75** pour I_alarm (RIO-02) : seuil posé sans trace d'arbitrage (H1 ne couvre que RIO-01 ; les 5 recommandations ne le mentionnent pas) | Tracer l'arbitrage ou la justification du 0,75 |
| S5 | doc 03 §2.2 | AFC « si n suffisant ≥ 200 » vs effectif analysable cible **150-200** et arbitrage RMSEA « n modeste pour AFC » | Préciser le régime si n < 200 (AFE seule, ou AFC sur 150-200 avec réserves) |
| S6 | doc 04 §2.1 | « Violences Femmes Info » : numéro **3919 exact** ; appellation officielle renommée « Arrêtons les violences » (2024) | Actualiser l'appellation (le numéro prime) |
| S7 | doc 05 Phase 0 | Ligne « Intégration des amendements + relecture intégrale (niveau 2) — Superviseur actif — ✅ Fait » vs README package « niveau 2 ⏳ en attente de relecture » ; la relecture niveau 2 est portée par le **superviseur sortant** | Harmoniser l'attributaire et l'état (le présent rapport en exécute la relecture) |
| S8 | doc 05 tableau récapitulatif | Feu vert 01/11/2026 → 31/08/2027 = **10 mois calendaires** vs « 9 mois » canoniques ; Phase 4 datée 2 mois pour une durée « 1 mois » | Aligner le tableau ou noter la convention (chevauchement Phase 1/Phase 3) |
| S9 | doc 05 liste restants, point 7 | « Phase 3 : suivi T8 à 8 semaines (vs 12) — confirmé par superviseur sortant » figure dans les « restent à valider » alors qu'il est tranché (doc 03 §3.2, README recommandation 3) | Déplacer en liste tranchée ou reformuler « à ratifier par le conseil » |
| S10 | doc 06 §2 | Numérotation saute de §2.3 à §2.5 (pas de §2.4) | Renuméroter |
| S11 | doc 01 §4.2 (H6) + doc 03 §7.1 | Critère « ≥ 90 % des réponses **simulées** à risque » vs méthode « sur les réponses **réelles** au pilote » | Clarifier : le critère de validation écologique porte sur les vraies réponses signalées ; la simulation est la répétition générale |
| S12 | doc 06 §2.2 | Futilité « après **4 mois** de recrutement » vs Phase 1 = 3 mois (doc 05) | Aligner la fenêtre de recrutement |
| S13 | sommaire `README.md` | Case « Contresignature superviseur sortant » non nuancée niveau 1 (fait) / niveau 2 (en cours) | Harmoniser à la pose du tampon niveau 2 |
| S14 | sommaire `README.md` | « 4 premières cases » vs 5 verrous du README parent (OSF.io et assurance RC absents du sommaire) | Aligner la granularité des checkpoints |

---

## E. Vérifications spécifiques exécutées

- **Croisement licences (R3)** : lecture intégrale de
  `legal/licences-validite-convergente.md` — tableau 18/10 + vérification
  datée 21/10 (sources officielles Fraley/Stanford SPL/couples-research.com)
  → à l'origine du signalement B1. ERQ et CSI : distribution publique par
  les auteurs sans déclaration de restriction ; la limite honnête déjà
  consignée (absence de restriction déclarée ≠ autorisation commerciale
  écrite) est rappelée — le CSI en usage d'étude resterait de la recherche,
  toute exploitation commerciale passerait par les auteurs.
- **Comptage des points [À VALIDER]** : 14 marqueurs inline (5/3/2/1/2/1)
  + 68 points listés (15 §17 · 8 doc 02 · 12 doc 03 · 13 doc 04 · 11 doc 05
  · 9 doc 06) ; 14 arbitrages niveau 1 déjà tranchés → fondement du
  signalement S3.
- **Renvois croisés** : §9→03, §10→04, §11→05, §12→06 tous présents et
  exacts ; §14.4 renvoie §10/§12 ; filets §8.4 renvoie A3/A6 ; critères
  d'arrêt renvoient correctement.
- **Sections de messages types** (arrêt sécurité, futilité) : cohérentes
  avec les principes (non-culpabilisant, numéros corrects).

---

## F. Verdict de la relecture

**Relecture fond intégral exécutée — contresignature niveau 2 NON posée.**

Le fond du protocole est **architecturalement solide** : les amendements et
arbitrages niveau 1 sont réellement intégrés, les chiffres se recoupent
entre documents, les filets de sécurité sont pensés en profondeur (test
d'incendie A4, journal, escalade, critères d'arrêt en cascade), les
principes non négociables traversent tous les documents.

Deux points **bloquants** exigent un arbitrage fondateur avant le tampon
niveau 2 : **B1 (usage ECR-R vs restriction commerciale consignée)** et
**B2 (seuil unique de faux négatifs)**. B1 doit précéder le
pré-enregistrement OSF.io. Quatorze points de consistance (S1-S14) sont
corrigibles mécaniquement sur ordre — aucun n'a été corrigé.

**Note de confiance : 8,5/10** — déduction : 0,5 (B1 licence à arbitrer),
0,5 (B2 seuil de sécurité divergent), 0,5 (consistances S1-S14).

---

## G. Ce qui débloque la contresignature niveau 2

1. **Arbitrage B1** : option (a) permission écrite Fraley / (b) bascule RQ
   (+ CSI possible) avec reformulation H5 / (c) qualification non
   commerciale via partenaire académique — **recommandation du pont :
   (b)**, la voie la plus propre dans les délais, H5 gardant son
   architecture (seuils RQ 0,40 déjà écrits) ;
2. **Arbitrage B2** : seuil unique faux négatifs — **recommandation du
   pont : ≥ 3** (le plus protecteur) ;
3. **Ordre de correction** des points S1-S14 (corrections mécaniques, un
   seul commit documenté) ;
4. Alors : tampon contresignature niveau 2 posé sur le README du package +
   doc 01, et le package devient prêt pour la validation du conseil
   clinique et le pré-enregistrement OSF.io.

---

## H. Arbitrages rendus et exécution (mise à jour du 21/10/2026)

> Arbitrages rendus par le fondateur le 21/10/2026 (trace 1a15d6b474a4969d,
> ordre « b et 3. corrige les 14 points ») — exécutés le même jour par le
> superviseur sortant, dans le respect de la séquence décrite en section G.

1. **Arbitrage B1 → option (b)** : la validité convergente est basculée sur
   le **RQ** (seuils ≥ 0,40, déjà écrits au doc 03 §6.2) avec le **CSI** en
   second instrument (usage exact à ratifier par le conseil clinique) ;
   **l'ECR-R n'est pas administré** (restriction d'usage commerciale
   consignée dans `legal/licences-validite-convergente.md` — décision B1
   datée ajoutée à ce fichier). Exécution : doc 01 (OS6, H5, §8.4, §9,
   §13.1.bis, §13.2, §17-5, §17-7) ; doc 03 (§6.1, §6.2, §6.4) ;
   consentement FR/EN ; sommaire du package.
2. **Arbitrage B2 → seuil unique ≥ 3** : le 3ᵉ faux négatif déclenche
   l'arrêt — doc 04 §4.2 aligné sur doc 06 §1.2 (le plus protecteur,
   conforme au principe « tout faux négatif est un échec du système »).
3. **S1-S14** : les 14 corrections de consistance (section D) ont été
   appliquées — un seul commit documenté, consigné au worklog (Task 153).
4. **Tampon contresignature niveau 2 posé** (§G.4) sur le README du
   package, le sommaire et le doc 01 — le package est **prêt pour la
   validation du conseil clinique** ; tout pré-enregistrement OSF.io
   intègre la bascule B1 dans ses critères de succès.

*Le présent rapport est autoporteur : il peut être remis tel quel au
conseil clinique en annexe du dossier de présentation, comme preuve que la
relecture niveau 2 a été exécutée et documentée — sections A-G comme
signalements, section H comme exécution.*
