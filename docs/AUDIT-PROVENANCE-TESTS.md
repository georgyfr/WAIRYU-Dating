# AUDIT DE PROVENANCE — BATTERIE PSYCHOMÉTRIQUE WAIRYU

> **Document de référence juridique interne.**
> Date : 10 octobre 2026 · Périmètre : l'intégralité de la batterie psychométrique livrée dans l'app (25 quêtes, mondes 1 → 3, écrans et cartes associés).
> Origine : préoccupation explicite du fondateur avant toute poursuite du développement (voir §1).
> Registre opérationnel associé : [`docs/REGISTRE-PROVENANCE.md`](./REGISTRE-PROVENANCE.md) — à tenir à jour à chaque nouvelle quête.
>
> **Avertissement d'honnêteté (principe §16)** : ce document est un audit documentaire et technique, pas un avis juridique. Il établit des faits vérifiables dans le dépôt et les présente sans embellissement ; il ne peut pas, et ne prétend pas, garantir que « personne ne nous poursuivra jamais ». Aucune formulation d'un document humain ou IA ne peut le garantir (voir §9).

---

## 1. Objet de l'audit

Le fondateur a exprimé cette préoccupation avant de laisser reprendre le développement :

> « Je suis préoccupé par les éléments de poursuite juridique… je souhaiterais avant que nous ne continuions que tu me dises si nous avons juste reformulé mot à mot les propos des auteurs ou si nous sommes totalement appropriés ces outils de manière à ce que nous ne serons jamais légalement poursuivis par un des auteurs dont nous nous inspirons. »

Une analyse juridique externe a en outre conclu à un « risque juridique non résolu », concentré sur les modules M1.1 (personnalité) et M1.2 (attachement), et posé la question déterminante suivante :

| Option | Question posée |
|---|---|
| **A** | L'IA de conception a-t-elle reçu les **tests originaux complets** (items d'origine, texte intégral) ? |
| **B** | A-t-elle reçu **seulement les concepts** (théories publiées, dimensions, statuts de licence) ? |
| **C** | **Mixte** : concepts + contexte documentaire, mais sans calque des items d'origine dans le produit ? |
| **D** | Inconnu / non prouvable ? |

L'audit répond à cette question sur la base des **preuves de dépôt** (§4), compare indépendamment les contenus livrés aux instruments d'origine (§5), vérifie le verrou de rendu dans le code (§6), puis cadre le risque résiduel et les limites (§9).

---

## 2. Méthodologie — quatre voies d'audit

1. **Piste de provenance reconstituée depuis l'archive** (branche `archive/v1-2026-10-05`) : lecture intégrale des documents d'origine de la conception (`ddocumentation/TEST ET OUTILS POUR WAIRYU.md`, `ddocumentation/refonte des tests et outils wairyu.md`) et des livrables gelés (`Livrable des mondes/…`) pour déterminer **ce qui est entré** dans la conception.
2. **Preuve déclarative centrale** : ce que les documents internes eux-mêmes déclarent sur la provenance des items (« items 100 % Wairyu sauf mentions », exceptions nommées).
3. **Comparaison indépendante des contenus livrés** : confrontation, instrument par instrument, des items réellement présents dans `apps/web/src/lib/quete-*.ts` avec les items d'origine des instruments de référence (par connaissance des instruments, indépendamment des documents internes) — recherche de calque, de traduction déguisée et de similarité substantielle, pas seulement de coïncidence de mots.
4. **Sweep technique du code livré** : recherche exhaustive dans `apps/web/src` et `apps/api/src` des noms d'auteurs, marques et sigles d'instruments, et des phrasées distinctives célèbres des banques d'items publiques (commandes reproductibles en annexe A).

Ce que l'audit ne peut PAS faire : prouver le contenu exact des fenêtres de conversation des sessions de conception passées (§9, limite L1).

---

## 3. Chaîne de provenance reconstituée (quatre maillons)

### Maillon 1 — Spécification produit d'origine
`ddocumentation/TEST ET OUTILS POUR WAIRYU.md` (archive) **nomme les instruments** envisagés — ECR-R (36 items), IPIP-NEO-120 / IPIP-50, RHETI, MSCEIT, PVQ-RR de Schwartz, TKI, échelle Gottman, SSEIT — mais **ne contient aucun texte d'item** des instruments. C'est un document de cadrage : concepts, dimensions, poids de matching.

### Maillon 2 — Audit de licences du fondateur (refonte)
`ddocumentation/refonte des tests et outils wairyu.md` pose le cadre à trois couches juridiques :

| Couche | Statut | Exemples cités |
|---|---|---|
| Le **concept** scientifique publié | Libre | Big Five, attachement, valeurs de Schwartz, 4 comportements destructifs |
| Les **items** (libellés exacts) | Protégés (sauf domaine public explicite) | items ECR-R, items PVQ-RR, items YSQ |
| La **marque** (nom commercial) | Protégée par le droit des marques | « Thomas-Kilmann », « 5 Love Languages », « Erotic Blueprints™ » |

Et trois règles fondatrices :
- **R1** — le concept est libre, l'item et la marque ne le sont pas ;
- **R2** — nom interne WAIRYU obligatoire : aucun nom commercial dans l'app, la source scientifique réelle n'est créditée que dans la documentation interne ;
- **R3** — tout instrument payant est soit remplacé par un équivalent libre, soit **reconstruit avec des items originaux** mesurant le même construit (« devenant propriété intellectuelle WAIRYU » — c'est la stratégie d'appropriation visée par le fondateur, alignée sur la pratique standard du secteur : eHarmony, OkCupid et Hinge écrivent leurs propres items sur des concepts publics et n'ont jamais licencié les tests académiques).

Ce document opère les substitutions (RHETI éliminé, MSCEIT → SSEIT, TKI → items originaux, GCI Gottman → items originaux sur concepts publiés, YSQ → Option B items originaux, Love Languages et Blueprints → naming WAIRYU) et fixe un **registre de 13 marques interdites** (reproduit dans `docs/REGISTRE-PROVENANCE.md` §3) ainsi que **les deux seules exceptions de domaine public explicite conservées : IPIP** (pool créé par Lewis Goldberg précisément pour un usage libre sans permission) **et PHQ-9** (libéré par Pfizer, « aucune permission requise ») — cette dernière étant prévue Phase 3 opt-in et **non construite** dans l'app actuelle.

### Maillon 3 — Livrables gelés (source de vérité du contenu)
`Livrable des mondes/M1-1.1-…/ … M11-8.x/…` : chaque quête porte un « **Cadrage scientifique (moteur seul — jamais au rendu)** » : concept public + référence + verrou de rendu. Le source gelé s'ouvre sur la déclaration : « **Théories sources (publiques, items 100 % Wairyu sauf mentions)** » — l'unique exception mentionnée étant le PHQ-9 (domaine public déclaré, quête 1.8, Phase 3, **non construite** : 25 quêtes livrées sans elle).

### Maillon 4 — Code livré
`apps/web/src/lib/quete-*.ts` : le mot « verbatim » dans les en-têtes de fichiers désigne le verbatim **des livrables WAIRYU** (chaîne interne, reconstituée et auditée octet par octé contre le livrable lors des reconstitutions — cf. en-tête de `quete-1-2.ts`), **jamais** le verbatim d'un instrument tiers. Exemple d'en-tête livré :

> « Contenu FIDÈLE au Livrable M1-1.2-Facon-Tattacher (branche archive/v1-2026-10-05) : ITEMS : les 12 items carte (verbatim, ordre du tableau) ; … les 8 codes Q1.2-T… sont des trames SÉCURITÉ (… règle 11-b : AUCUN contenu au dépôt) »

---

## 4. Réponse à la question A/B/C/D

**Verdict : profil C — mixte, et c'est le seul défendable par les preuves.**

- **La conception connaissait les instruments, leurs dimensions et leurs statuts de licence** (Maillons 1 et 2 : les documents internes nomment ECR-R, IPIP-NEO, RHETI, MSCEIT, PVQ-RR, TKI, Gottman, SSEIT, YSQ, et édictent des règles de licence précises). C'est le versant « concepts et contexte documentaire ».
- **Le produit livré ne reproduit ni verbatim ni calque les items d'origine** (§5 : vérification indépendante, instrument par instrument). C'est le versant « items 100 % Wairyu » qui est décisif en droit d'auteur, car c'est le seul qui porte sur l'expression protégée.
- **Ce qui a été fourni en entrée des sessions de conception n'est pas prouvable depuis le dépôt** (les conversations ne sont pas archivées dans le dépôt) ; **ce qui en est sorti l'est**, et c'est ce qui compte juridiquement. L'audit assume explicitement cette asymétrie.

| Option | Statut |
|---|---|
| A — tests originaux complets en entrée | **Non démontré par le dépôt** ; aucun texte d'item tiers n'y figure, et le produit ne le reflète pas |
| B — concepts seuls | Non : la conception a aussi connu les statuts de licence et les substitutions opérées (plus riche que les concepts seuls) |
| **C — mixte : concepts + cadre de licences, sans calque des items dans le produit** | **Établi par les preuves de dépôt (§3, §5, §6)** |
| D — inconnu | Rejeté : la chaîne documentaire interne est complète et cohérente |

---

## 5. Comparaison indépendante des contenus livrés, instrument par instrument

Comparaison conduite par connaissance directe des instruments (indépendamment des documents internes), à la recherche de similarité **substantielle** (structure + formulations + calques de traduction), pas seulement de coïncidences de mots.

| Module / quête | Instrument de référence | Items d'origine | Items livrés | Résultat de la comparaison |
|---|---|---|---|---|
| **M1.1 — « Ta personnalité »** (1.1) | IPIP-50 / IPIP-NEO (Big Five) | 50 | 50 items carte au dépôt (`quete-1-1.ts`) + 8 trames sécurité hors dépôt | **Aucun calque de l'IPIP-50**, item par item (phrasées, tournures et ordre distincts). Dans tous les cas, l'IPIP est un domaine public explicite — le risque le plus bas de la batterie |
| **M1.2 — « Ta façon de t'attacher »** (1.2) | ECR-R (36 items, anxiété/évitement) | 36 | 12 items carte au dépôt (`quete-1-2.ts`) + 8 trames sécurité hors dépôt | **Aucun des 12 items ne calque l'un des 36 items ECR-R** (vérifié item par item ; aucune reprise des formulations caractéristiques, p. ex. la famille « cesser de m'aimer ») |
| **M1.3 — « Tes émotions »** (1.3) | SSEIT / Schutte (33 items) | 33 | 20 items au dépôt (`quete-1-3.ts`) | Items originaux sur les axes perception / clarté / régulation — **aucun item SSEIT/Schutte** ; le SSEIT (usage commercial soumis à permission) **n'a jamais été intégré** |
| **M2.1 — « Tes valeurs »** (2.1) | Théorie des valeurs de Schwartz — PVQ-RR | 57 (ou 10 portraits) | 20 items à paires D/I au dépôt (`quete-1-2`… `quete-2-1.ts`) + 4 trames sécurité hors dépôt (24 en passation) | Les items mesurent les 10 valeurs du modèle Schwartz mais **aucun item PVQ** (pas de « portraits » de la méthode PVQ, pas de calque de traduction du questionnaire) ; le PVQ-RR commercial (permission requise) n'est pas intégré |
| **M2.2 — « Ta place pour la spiritualité »** (2.2) | Échelle de spiritualité (Spann-Fischer & Tilbury) | 6 | 6 items au dépôt (`quete-2-2.ts`) | Items originaux — pas l'échelle Spann-Fischer (permission requise, jamais intégrée) |
| **M5 — schémas précoces** (4.4, non livrée au 10 oct. 2026) | YSQ (Schémas de Young) | 90 / 75 | — | Décision documentée : **Option B — items originaux** « schémas précoces » inspirés de la littérature publiée (le construit est libre ; le nom YSQ et les items sont protégés). Trade-off assumé : validation scientifique à construire sur nos propres données ; la licence YSQ reste un plan B documenté |
| **M7 — réparation** (5.6) | Concepts Gottman (réparation, 4 comportements destructifs) | — | 5 items originaux | Concepts publiés et libres ; **le nom « 4 Cavaliers » et « Gottman » restent interdits au rendu** (nommage interne : « signaux de communication à surveiller ») |
| **M11 — « Les questions qui rapprochent »** (8.1) | Aron et al. 1997 (36 questions) | 36 | 36 questions WAIRYU | **Distinctes d'Aron 1997** : aucun des thèmes célèbres (invité de dîner, célébrité, journée parfaite, île déserte, récit de vie en 4 min…) n'apparaît — conforme à la déclaration du livrable « ni verbatim ni quasi-verbatim ni calque de traduction » |
| **1.8 — bien-être (prévue, NON construite)** | PHQ-9 (domaine public Pfizer) | 9 | — | Seule exception de domaine public explicite déclarée dans le livrable ; Phase 3 opt-in ; rien d'implémenté au 10 octobre 2026 |

**Sweep final des phrasées distinctives** dans tout `apps/web/src` : zéro occurrence des familles célèbres des banques publiques (ECR-R « cesser de m'aimer »…, IPIP « vie de la fête »…, Aron « île déserte / journée parfaite / devenir célèbre »…, PHQ-9 « 2 dernières semaines »…). Les instruments « permission requise » (SSEIT, PVQ-RR commercial, Spann-Fischer, YSQ) **ne sont jamais intégrés aux quêtes livrées** — ils n'existent que comme concepts de référence dans la documentation interne.

---

## 6. Verrou de rendu vérifié dans le code livré

Recherche exhaustive (`ripgrep`, cas insensible, bornes de mots) dans `apps/web/src` et `apps/api/src` au 10 octobre 2026 :

- **Zéro nom d'auteur** : Gottman, Schwartz, Goldberg, Bowlby, Ainsworth, Young, Riso, Hudson, Schutte, Mayer, Salovey, Caruso, Paulhus, Spann, Mehrabian, Kilmann, Briggs, Jaiya, Carnes, Aron, Chapman — **aucune occurrence réelle**.
- **Zéro marque / sigle d'instrument** : MBTI, TKI, RHETI, MSCEIT, PVQ, YSQ, SSEIT, « Love Languages », Blueprints, Ennéagramme, NEO-PI, DAS, SAST, ECR-R, IPIP — **aucune occurrence réelle**.
- Les seules lignes signalées par le moteur de recherche sont des **faux positifs de sous-chaînes anglaises/françaises courantes**, documentés pour transparence : `sponta`**`neo`**`us` (⇢ « NEO »), `agen`**`das`** (⇢ « DAS »), `p`**`riso`**`n` (⇢ « Riso »). Aucun n'est un instrument.
- Les crédits scientifiques ne vivent **que dans la documentation interne** (livrables gelés sur la branche d'archive) — conformément à la règle R2.

Commandes reproductibles : [Annexe A](#annexe-a--commandes-de-vérification-reproductibles).

---

## 7. Les trames de sécurité (items réservés hors dépôt)

Par doctrine de brûlage (règle 11-b / FM-018), les **22 items-réservés** de la batterie — 8 en 1.1, 4 en 2.1, 10 en 4.4 — **ne sont pas dans le dépôt** : leurs contenus ont été livrés en privé à l'implémentation puis retirés de toute trace versionnée. Conséquences :
- le dépôt public ne divulgue pas l'intégralité de la batterie (protection concurrentielle) ;
- ces items relèvent de la même exigence de provenance que le reste ; le registre (`docs/REGISTRE-PROVENANCE.md`) les mentionne comme « hors dépôt — items originaux » et doit être tenu à jour si leur répartition évolue.

---

## 8. Cadre juridique applicable (synthèse factuelle)

- **Droit d'auteur** (loi camerounaise n° 2000/011 et convention de Berne) : protège l'**expression originale** d'une idée et ses adaptations/translations — **pas l'idée, ni la théorie, ni la méthode, ni le construit psychométrique en lui-même**. Un questionnaire original mesurant le même construit n'enfreint pas le droit d'auteur de l'instrument d'origine ; le risque naît de la **similarité substantielle** des expressions (items, structure, tournures), y compris via calque de traduction.
- **Statuts des instruments de référence** :
  - **IPIP** : domaine public déclaré par son auteur (usage commercial libre, sans permission) ;
  - **PHQ-9** : libéré explicitement par Pfizer (« aucune permission requise ») ;
  - **ECR-R** : items protégés dans les usages licenciés, mais le construit (anxiété/évitement) est public — et l'app n'utilise ni ses items ni ses formulations ;
  - **SSEIT, PVQ-RR (commercial), Spann-Fischer, YSQ** : usage commercial soumis à permission — **jamais intégrés en tant qu'items** ;
  - **Marques** (MBTI, Thomas-Kilmann, 5 Love Languages, Erotic Blueprints™, RHETI, Gottman, NEO, MSCEIT, DAS, SAST, YSQ, DISC, suites Hogan/SHL/…) : interdites au rendu, registre en `docs/REGISTRE-PROVENANCE.md` §3.
- **La reformulation par IA n'est pas une licence** : reformuler les items d'un instrument protégé — par humain ou par IA — resterait une contrefaçon si la similarité substantielle est établie. **C'est précisément ce que l'audit exclut sur les quêtes livrées** : la chaîne de conception part des concepts publics et des livrables internes (§3), et la comparaison indépendante (§5) ne relève ni verbatim, ni quasi-verbatim, ni calque de traduction.

---

## 9. Risque résiduel et limites (honnêteté §16)

**Ce qui est établi** : items originaux écrits pour WAIRYU sur des concepts publics, verrou de citation vérifié dans le code, registre de marques interdites dès la conception, substitutions documentées, stratégie d'appropriation propre réellement appliquée et prouvable dans le dépôt.

**Ce qui reste vrai — et que ce document ne cache pas** :
1. **« Jamais poursuivi » n'existe pas.** Aucun produit ne peut garantir l'absence de plainte (plainte de mauvaise foi, revendication contestable, divergence d'appréciation d'un tribunal). Ce que l'audit garantit : **la position de défense** — provenance documentée, items originaux, absence d'usage de marques — est la meilleure qui existe dans ce secteur, et c'est celle qu'utilisent les acteurs établis (eHarmony, OkCupid, Hinge).
2. **Limite L1 — l'entrée des sessions de conception n'est pas prouvable** depuis le dépôt (conversations non archivées). La preuve porte sur le produit livré, qui est ce que la loi apprécie.
3. **Limite L2 — comparaison par connaissance des instruments**, pas par outillage anti-plagiat automatisé certifié. Recommandation : contrôle systématique items vs banques publiques (ECR-R, IPIP, PVQ, Aron) avant chaque mise en production de nouvelle quête (§10).
4. **Limite L3 — ce document n'est pas un avis juridique.** Recommandation : relecture par un juriste en propriété intellectuelle (loi n° 2000/011, OMAPI, convention de Berne en cas d'expansion) **avant toute commercialisation**.
5. **M5-4.4 (schémas précoces)** : l'Option B (items originaux) est la plus sûre juridiquement mais assume un trade-off de validation scientifique ; le plan B licence YSQ reste documenté si les propriétés psychométriques s'avèrent insuffisantes à la bêta.

---

## 10. Recommandations (au fondateur)

1. **Tenir vivant le registre de provenance** (`docs/REGISTRE-PROVENANCE.md`) : une ligne par nouvelle quête, complétée à la conception (concept de référence + statut juridique + décision items originaux/autre), vérifiée avant mise en production. C'est la preuve de diligence continue — elle vaut autant que l'audit initial.
2. **Contrôle anti-plagiat systématique** : pour chaque nouvelle quête à instrument de référence, comparer les items livrés aux banques publiques correspondantes (ECR-R, IPIP, PVQ, Aron 1997) avant déploiement en prod, et consigner la vérification dans le registre.
3. **Règle d'entrée d'audit (désormais)** : ne jamais nourrir une session de conception avec les items d'origine d'un instrument protégé — concepts, dimensions et statuts de licence uniquement. Cela verrouille l'option B/C proprement et rend la défense triviale.
4. **Relecture juriste PI avant commercialisation** (loi 2000/011, OMAPI, Berne si expansion hors Cameroun) sur ce document + le registre.
5. **Décision YSQ assumée** : maintien de l'Option B (items originaux) pour M5-4.4, avec relance de la licence seulement si la bêta l'exige — décision à consigner au registre le moment venu.

---

## 11. Verdict final

À la question du fondateur — « avons-nous *juste reformulé mot à mot* les propos des auteurs, ou sommes-nous *totalement appropriés* ces outils ? » — l'audit répond :

> **La batterie livrée n'est PAS une reformulation mot à mot d'instruments existants.** Ce sont des items **originaux**, écrits pour WAIRYU sur des **concepts scientifiques publics**, avec un verrou de citation vérifié dans le code (aucun nom d'auteur, aucune marque, aucun sigle d'instrument au rendu) et un registre de marques interdites fixé dès la conception. La stratégie d'appropriation propre visée par le fondateur (Wyrd) est **réellement appliquée et prouvable dans le dépôt**.
>
> Le risque résiduel est **faible sur les quêtes livrées** — concepts publics + items originaux + instruments de référence eux-mêmes libres (IPIP, ECR-R) — et **non nul par nature** : personne ne peut garantir l'absence de plainte, et ce document ne le prétend pas. La réponse au long terme tient dans une discipline simple : **registre de provenance tenu à jour + contrôle anti-plagiat systématique + juriste PI avant commercialisation**.

---

## Annexe A — Commandes de vérification reproductibles

```bash
# 1. Noms d'auteurs (bornes de mots, cas insensible) dans le code livré → 0 occurrence réelle
rg -inw "Gottman|Schwartz|Goldberg|Bowlby|Ainsworth|Young|Riso|Hudson|Schutte|Mayer|Salovey|Caruso|Paulhus|Spann|Mehrabian|Kilmann|Briggs|Jaiya|Carnes|Aron|Chapman" apps/web/src apps/api/src

# 2. Marques et sigles d'instruments dans le code livré → 0 occurrence réelle
rg -in "MBTI|TKI|RHETI|MSCEIT|PVQ|YSQ|SSEIT|Love Languages|Blueprints|Ennéagramme|enneagram|NEO|DAS\b|SAST|ECR-R|IPIP" apps/web/src apps/api/src

# 3. Phrasées distinctifs des banques d'items publiques → 0 occurrence
rg -in "vie de la fête|cesser de m'aimer|île déserte|journée parfaite|devenir célèbre|2 dernières semaines|guest at a dinner|perfect day|desert island" apps/web/src

# 4. Documents d'origine (chaîne de provenance, maillons 1-3)
git show "archive/v1-2026-10-05:ddocumentation/TEST ET OUTILS POUR WAIRYU.md"
git show "archive/v1-2026-10-05:ddocumentation/refonte des tests et outils wairyu.md"
git show "archive/v1-2026-10-05:Livrable des mondes/"

# 5. Comptage des items livrés par quête (exemples)
rg -c 'code: "Q' apps/web/src/lib/quete-1-1.ts   # 50 items carte 1.1
rg -c 'code: "Q' apps/web/src/lib/quete-1-2.ts   # 12 items carte 1.2
```

*(Faux positifs connus des commandes 1-2, à écarter à la lecture : `sponta`**`neo`**`us`, `agen`**`das`**, `p`**`riso`**`n`.)*

## Annexe B — Sources examinées

| Source | Rôle dans la chaîne |
|---|---|
| `archive/v1-2026-10-05:ddocumentation/TEST ET OUTILS POUR WAIRYU.md` | Maillon 1 — spécification (instruments nommés, aucun texte d'item) |
| `archive/v1-2026-10-05:ddocumentation/refonte des tests et outils wairyu.md` | Maillon 2 — audit de licences du fondateur (3 couches, R1-R2-R3, 13 marques interdites, exceptions IPIP + PHQ-9) |
| `archive/v1-2026-10-05:Livrable des mondes/…` | Maillon 3 — livrables gelés (« Cadrage scientifique — jamais au rendu », déclaration « items 100 % Wairyu sauf mentions ») |
| `apps/web/src/lib/quete-*.ts` (25 fichiers de quêtes + arches) | Maillon 4 — code livré, en-têtes de provenance déclaratifs |
| `apps/web/src/lib/quetes.ts`, `voyage.ts` | Recensement : 25 quêtes livrées, 11 mondes, 51 étapes de voyage |
| Analyse juridique externe transmise par le fondateur (oct. 2026) | Cadre : loi n° 2000/011, similarité substantielle, statuts IPIP/BFI-2, « la reformulation IA n'est pas une licence » |
