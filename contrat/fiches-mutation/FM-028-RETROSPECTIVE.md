# FM-028 — RÉTROSPECTIVE : LES FICHES FONDATRICES FM-001 → FM-012 (reconstitution post-audit)

| Champ | Valeur |
|---|---|
| ID | FM-028 |
| Type | **RÉTROSPECTIVE** (matérialisation de traçabilité — finding A.2, audit externe) |
| Date | 2026-10-01 (WAT) |
| Élément | Les 12 fiches fondatrices FM-001 à FM-012 — décisions reconstituées depuis les effets observables dans le dépôt et l'historique de travail |
| État résultant | ACTIF (traçabilité restaurée — les 75 références à « FM-011 v2 » et les citations FM-001→FM-012 du dépôt sont désormais résolubles) |
| Session | MISSION CORRECTIONS P0 CONCEPTION |

> **RECONSTITUTION — le document original a été perdu avec l'environnement d'exécution
> (reset). Le contenu décrit est fidèle aux effets observables dans le dépôt et à
> l'historique de travail.** Chaque décision ci-dessous porte : son numéro · le titre de la
> décision · les éléments concernés (IDs) · son effet sur les totaux · son statut.
> **Perte assumée et consignée** : les textes originaux FM-001→FM-012 sont irrécupérables ;
> cette fiche est leur substitut de traçabilité. Toute divergence future détectée entre ce
> récapitulatif et une preuve matérielle nouvelle sera signalée au comité (Constitution [8]).

---

## FM-001 — Inventaire initial : la structure de base (8 mondes)

- **Décision** : établir l'inventaire normatif initial du questionnaire — la structure de
  base des mondes et des quêtes, avec leurs plages de codes gelées.
- **Éléments concernés** : les mondes d'origine (structure 8 mondes), les plages de codes
  Qx.y-xx gelées, l'invariant 570 items (540 carte + 30 trame fiabilité).
- **Effet sur les totaux** : création de l'invariant 570 · structure de base 8 mondes
  (fission ultérieure en 11 par FM-011 v2 sans toucher l'invariant).
- **Statut** : ✅ Appliquée — reconstituée post-audit (porteurs observables : Constitution
  [5] ; contrat-inventaire v1.3 PARTIES 4-12 ; CI-01).

## FM-002 — Renommage SDT→DTM · restauration de la trame · création de 1.9

- **Décision** : renommer le signal SDT (« signature Dark Triad ») en **DTM** (détection de
  traits masqués — DTM_N auto-centrage, DTM_M méfiance projetée) ; restaurer la trame dans
  l'inventaire ; créer la quête 1.9 « Ton élan du moment » (8 items).
- **Éléments concernés** : tous les slots signal ▲ (M1-1.1 T01-T08, M1-1.2 T09-T16, M3-2.1
  21-24…) ; la quête 1.9 (plage Q1.9-01→08).
- **Effet sur les totaux** : zéro changement d'items (renommage) · +8 items (1.9) au
  contrat — intégrés à l'invariant 570 (M2 = 56).
- **Statut** : ✅ Appliquée — reconstituée post-audit (porteurs : correspondance SDT-N→DTM_N
  · SDT-M→DTM_M gravée au registre signaux.json et au STATUS 2026-09-29 (FM-019) ;
  ddocumentation porte l'historique SDT ; dossier M2-1.9 existant).

## FM-003 — Continuité Carte→Portrait · zone d'ombre restituée

- **Décision** : garantir la continuité entre les cartes de quête et le Portrait (un
  énoncé répondu se résout identiquement aux deux étages) ; restituer la zone d'ombre dans
  les restitutions (l'ombre n'est plus l'apanage des seules cartes).
- **Éléments concernés** : les restitutions de quête (07) et les portraits ; verrou « ombre ≥
  lumière » ; résolution verbatim contre les tableaux 01.
- **Effet sur les totaux** : zéro (décision de forme et de doctrine, pas d'inventaire).
- **Statut** : ✅ Appliquée — reconstituée post-audit (porteurs : verrous 4-5 des
  04-slots ; « ombre ≥ lumière » vérifié machine sur les 07).

## FM-004 — Fusion dirigée des 50 cartes de 1.1

- **Décision** : fusionner, sous direction, les 50 cartes item-niveau de la quête 1.1 en un
  jeu réduit de profils paramétrés lisibles (le « fusionné » remplace l'énumération brute).
- **Éléments concernés** : `Livrable des mondes/M1-1.1-Ta-Personnalite/cartes.yaml` — le
  dépôt porte aujourd'hui le résultat fusionné (V1-V7, profils à conditions de sélection).
- **Effet sur les totaux** : zéro sur les ITEMS (les 50 items carte restent au contrat) —
  la fusion porte sur la couche de RESTITUTION (cartes), pas sur l'inventaire.
- **Statut** : ✅ Appliquée — reconstituée post-audit (porteur : cartes.yaml V1-V7 ;
  plage Q1.1-01→50 inchangée).

## FM-005 — Canal signal au contrat de sortie + trame fiabilité

- **Décision** : définir le contrat de sortie du moteur (ce que les signaux peuvent
  alimenter : canal signal documenté) et graver la TRAME FIABILITÉ (30 : 18 désirabilité
  sociale + 8 over-claiming + 4 doublons longitudinaux) dans l'inventaire.
- **Éléments concernés** : les contraintes de mélange (uniformité 1 trame par bloc de 6) ;
  l'équation 570 = 540 + 30.
- **Effet sur les totaux** : +30 trames fiabilité dans l'invariant (540 → 570) — tissées
  dans les quêtes porteuses, formulations hors dépôt (11-b).
- **Statut** : ✅ Appliquée — reconstituée post-audit (porteurs : CI-01 ; melange.json
  contraintes 2/3 ; contrat-inventaire §13.2).

## FM-006 — Ajout de la quête 1.10 « Ce que tu apportes »

- **Décision** : créer la quête 1.10 (10 items) + la signature SIG_CONTRIB.
- **Éléments concernés** : plage Q1.10-01→10 ; registre `contrat/registres/signatures/M2.json`.
- **Effet sur les totaux** : +10 items au contrat (M2) · +1 signature (35 = 30+1+4).
- **Statut** : ✅ Appliquée — reconstituée post-audit (porteurs : dossier M2-1.10 ;
  M2.json vérifié CI-13 ; CI-01).

## FM-007 — Ajout de la quête 1.11 « Es-tu prêt·e à rencontrer ? »

- **Décision** : créer la quête-écran de passage 1.11 (3 items) — le sas avant le territoire
  de la rencontre.
- **Éléments concernés** : plage Q1.11-01→03 ; dossier M2-1.11-Es-Tu-Pret-A-Rencontrer.
- **Effet sur les totaux** : +3 items au contrat (M2 = 56 exact).
- **Statut** : ✅ Appliquée — reconstituée post-audit (porteur : dossier existant ;
  Constitution [5] l.54).

## FM-008 — Ajout de la Boussole du discernement (8 fiches éditoriales)

- **Décision** : ajouter la dimension éditoriale « Boussole du discernement » — 8 fiches
  éditoriales (lire les signaux, reconnaître les schémas, pratiquer un discernement lucide…).
- **Éléments concernés** : le corpus éditorial (source gelée `ddocumentation/📄 LES QUATRE
  PORTRAITS COMPLETS` — la séquence numérotée « 8. Pratiquer un discernement lucide » et
  l'entité DISCERNEMENT y sont observables).
- **Effet sur les totaux** : zéro sur les items (contenu éditorial, hors inventaire
  répondu).
- **Statut** : ✅ Appliquée — reconstituée post-audit (porteur : source gelée, 20 mentions
  « discernement »).

## FM-009 — Ajout du niveau « Miroir de quête » (4 étages de restitution)

- **Décision** : instituer l'ÉTAGE 2 de restitution — le Miroir de quête (07) — dans une
  architecture à étages : écran (05) · miroir de quête (07) · portrait de domaine ·
  portrait intégral.
- **Éléments concernés** : tous les 07-miroir des dossiers ; les 04-slots (étages de
  restitution des briques) ; la charte des gabarits (LÉGER/MOYEN/LOURD/SYN).
- **Effet sur les totaux** : zéro sur les items (couche de restitution).
- **Statut** : ✅ Appliquée — reconstituée post-audit (porteurs : 07 × 43 fichiers ;
  STATUS VAGUE 4 « Les Miroirs du Socle »).

## FM-010 — Versionnement de la salle des prompts (Constitution versionnée comme artefact)

- **Décision** : la salle-prompts devient versionnée — la Constitution est un ARTEFACT
  versionné du dépôt (constitution.v2.1.md), toute mutation passe par fiche et incrémente.
- **Éléments concernés** : `salle-prompts/` (constitution.v2.1.md, paquets-production,
  paquets-audit, schema).
- **Effet sur les totaux** : zéro (gouvernance documentaire).
- **Statut** : ✅ Appliquée — reconstituée post-audit (porteur : l'arborescence
  salle-prompts versionnée dans le dépôt).

## FM-011 v2 — Fission 8→11 mondes · statut freemium 6/5 · table code→monde

- **Décision** : scinder la structure 8 mondes en **11 mondes** (création des domaines :
  M8/M9 l'Intime séparés en Essentiel/Profondeurs, M10 Mon Monde, M11 Le Voyage à deux) ;
  graver le statut freemium **6 gratuits (M1-M5, M11) / 5 premium (M6-M10)** ; établir la
  table de correspondance code→monde (annexe du contrat — les codes ne suivent PAS la
  numérotation des mondes : Q2.1 vit en M3, Q5.4 en M7).
- **Éléments concernés** : Constitution [5] et [6] ; tous les dossiers M8/M9/M10/M11 ;
  contrat-inventaire PARTIES 4-12.
- **Effet sur les totaux** : zéro sur 570 (repartition) · 51 quêtes · 11 mondes.
- **Statut** : ✅ Appliquée — reconstituée post-audit (**75 fichiers du dépôt citent
  « FM-011 v2 »** — toutes ces références sont désormais résolubles par la présente fiche ;
  porteurs : Constitution [5]/[6], index des mondes, STATUS).

## FM-012 — Plan freemium détaillé (frontière M5, écran de conversion, pool asymétrique)

- **Décision** : détailler le plan freemium au-delà du statut 6/5 : la frontière
  d'expérience (M5 = dernier monde gratuit, le premium ouvre « Comment j'aime »), l'écran de
  conversion, le pool asymétrique (les mondes gratuits restent visibles dans la dynamique de
  rencontre — Constitution [6] : « la rencontre n'est jamais payante »).
- **Éléments concernés** : Constitution [6] ; les dossiers premium (badge 💎, premium :
  aucune présupposition des mondes gratuits, zéro teaser).
- **Effet sur les totaux** : zéro (règles d'accès).
- **Statut** : ✅ Appliquée — reconstituée post-audit (porteurs : Constitution [6] l.76-78 ;
  mentions premium des dossiers).

---

## Contrôle de cohérence de la reconstitution

- Les 12 décisions sont **compatibles entre elles et avec les invariants observés** :
  570 = 540 + 30 · 51 quêtes · 11 mondes · 35 signatures · freemium 6/5 — l'équation
  ferme (CI-01 VERT, 16/16 puis 17/17 après CI-17).
- Les numéros FM-013 → FM-026 portent les décisions documentées postérieures (présentes au
  dépôt) ; FM-024/FM-025 sont des réserves non attribuées (zéro collision) ; FM-027 (brûlage
  F.1) et FM-028 (la présente) poursuivent la séquence.
- Limite consignée : cette rétrospective reconstitue des DÉCISIONS (effets, périmètres,
  totaux) — elle ne réécrit pas les rédactions originales, perdues.
