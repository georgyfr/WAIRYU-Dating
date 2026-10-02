# QUÊTE 7.3 « LA MIXITÉ ET TOI » — FICHE DE CADRAGE PUIS LECTURE DU LIVRABLE

> Monde **M10 « Mon Monde »** (interculturel) · 💎 **PREMIUM** (statut_freemium : premium) · Phase **P3** ·
> Accès **Libre + opt-in** (le module vécu est opt-in strict — JAMAIS supposé)
> 8 items Likert : **6 en mélange** (codes gelés Q7.3-01 → Q7.3-06) + **2 module opt-in vécu** (Q7.3-07 → Q7.3-08,
> bloc fixe HORS mélange — précédent sérénité 6.1)
> Source : Constitution v2.1 [5] [6] [7] · refonte (PARTIE 7 table l. 2014-2023 — « 7.3 « La mixité et toi » ·
> 8 + module opt-in · Lecture Carte « Tes attentes explicites » · Lecture Signal « Divergence attentes famille →
> signal "à aborder tôt" » · P3 · Libre + opt-in » ; cadre de dignité l. 1376-1420 (4 règles verbatim ci-dessous) ;
> contenu 7.3 l. 1405-1408 verbatim ci-dessous ; classe miroir l. 3788-3794 — « Attentes mixité B (2-3 profils) ») ·
> mission V15.C (cadrage fondateur + squelette verrouillé — FAIT FOI)
> B.3 : **production neuve déclarée** — première émission de la quête au dépôt (M10 jamais produit, constat
> V14-B). Aucun texte antérieur n'existe.

## 🧭 FICHE DE CADRAGE (lire avant tout le reste)

| Champ | Cadrage |
|---|---|
| **Ce que ça mesure** | Tes **attentes explicites** sur une relation mixte/culturelle (refonte l. 1375 : « tes attentes et tes préparations ») sur trois axes dignes : **la posture** (dimension `posture` — l'entre-deux t'attire ↔ la proximité choisie) · **la famille** (dimension `famille` — l'anticipation sereine ↔ tendue) · **le tempo** (dimension `tempo` — aborder tôt ↔ voir sur le vif). Zéro mesure d'origine, de nationalité ou d'apparence : le moteur ne croise que **des traits, jamais des origines** (règle 4 du cadre de dignité). |
| **Le cadre de dignité** | **Matière gelée du refonte (l. 1381-1392) — les 4 règles VERBATIM** : ① **Digne, jamais exotisante** — on ne mesure pas « ton ethnicité », on mesure **le poids de ton héritage dans ta vie** et **ton ouverture à celui de l'autre**. ② **L'auto-identification libre** — chacun se décrit avec ses propres mots (liste large + champ libre), jamais de cases imposées. ③ **Le vécu minoritaire, opt-in strict** — les questions sur le regard social et les expériences de discrimination existent, mais uniquement pour ceux qui choisissent d'en parler, jamais supposées. ④ **Jamais de filtre racial** — ❌ AUCUN filtrage par origine dans le moteur (contrairement à certaines apps) ; ce qui se croise : **l'ancrage culturel × l'ouverture culturelle** — des traits, jamais des origines. |
| **Le contenu source 7.3** | **Matière gelée du refonte (l. 1405-1408) — VERBATIM** : « Une relation mixte pour toi : évidente, belle, délicate, ou tu ne t'y sens pas concerné ? · Ce que tu redoutes ou espères si ta famille découvrait ton/ta partenaire · *(opt-in)* Si tu vis des regards ou des préjugés : ce que ça t'a appris sur ce que tu veux ». Les énoncés finaux (Wairyu, B.3) portent ces trois angles sur les 3 axes + le module ; les libellés de la mission sont les **angles**, pas les énoncés. |
| **Le module opt-in vécu** | Deux items (**Q7.3-07 × 08**, bloc fixe HORS mélange, ordre de passation 07→08 — précédent sérénité 6.1 : Q6.1-S01 → S04). **Opt-in strict, JAMAIS supposé** : l'écran de quête ne l'annonce pas ; l'invitation explicite + le refus digne s'affichent à l'entrée du module (libellé de production au 01) ; **retrait visible « Je préfère ne pas dire » à CHAQUE item**. Le module **NE PRODUIT AUCUNE brique** : son output = **ressources bienveillantes séparées** (REN compatible — SIG-7.3-03, précédent sérénité 6.1 : SIG-6.1-04 → ressources REN). Hors cartes, hors miroir de profils, hors profil public, hors exports, jamais une entrée de compatibilité. |
| **Format de réponse** | Likert 5 niveaux · D/I recodés `6 − r` · **3 paires R6 complètes** (01×02 · 03×04 · 05×06 — une par axe) · équilibre d'orientations **3 D / 3 I** (une paire = 1 D + 1 I) — documenté au 01. Le module vécu : 2 items Likert 5 **HORS mélange** (exclus de la config `ci/quetes/7.3.json` — champ documentaire `hors_melange`). |
| **Mélange** | Graine **273427** (210427 + 1000 × ordinal 63 — règle de décade ((a−1)×10+b), quête 7.3 → (7−1)×10+3 = **63** ; **note coordination M11** : la réservation du plan sans-objet 8.3 (V14-B) citait 273427 comme place de décade hypothétique — V15 la consomme canoniquement pour 7.3, **zéro collision réelle, aucun tirage opéré**) · outil **générique** `melange.py` (aucune trame, 3×2 — le générique suffit) · config `ci/quetes/7.3.json` créée par ce sous-agent (**6 items de mélange uniquement** ; `hors_melange` : Q7.3-07/Q7.3-08 déclaré en champ documentaire — le melange.py n'itère que sur « items », zéro effet machine) · **course réelle exécutée** : 3 passes identiques octet pour octet, empreinte `39d9b51976b22a034bbac4a4e6be64e1`, verdicts c1-c6 réels au 02 · c2/c3 **sans-objet** (zéro trame). |
| **Signatures attendues** | **SIG-7.3-01 « MATRICE ANCRAGE × OUVERTURE »** — **[MOTEUR SEUL]** : quatre quadrants verbatim (le bâtisseur de ponts / homophilie culturelle assumée — respectée, jamais jugée / le passe-partout — vigilance inverse / divergence d'attentes famille) ; consomme **SIG-7.1-01** (ancrage) et **SIG-7.2-01** (ouverture) ; seuils comité. **SIG-7.3-02 « À ABORDER TÔT »** — divergence d'attentes famille entre deux membres (le regard des familles = 1ʳᵉ friction documentée des couples mixtes) : signal proposé **AUX DEUX**, jamais un verdict, jamais un score. **SIG-7.3-03 « VÉCU → RESSOURCES »** (**opt-in strict**) — le vécu minoritaire alimente des ressources bienveillantes : **JAMAIS supposé, JAMAIS une carte, jamais cité au profil public**. |
| **Slots prévus** | Miroir **LÉGER** (80-150 mots/variante) · **3 profils** (classe refonte « Attentes mixité B (2-3 profils) » — 3 retenus, un par axe) : « l'entre-deux qui t'attire » · « la famille au cœur de la conversation » · « ton tempo d'explication » — routage au **max des 3 moyennes** ; ex æquo strict → 1ʳᵉ position de passation (convention de cascade, [9]). **Le module vécu ne produit aucun slot de miroir** (exemption gravée au 04). |
| **Points de doctrine** | ① **Les deux dignes** : la proximité choisie est respectée, jamais jugée — l'homophilie culturelle assumée est un **quadrant moteur**, jamais un message rendu. ② La matrice ne franchit JAMAIS le rendu : aucun nom de quadrant, aucun score d'adéquation à l'écran. ③ Premium [6] : zéro présupposition des mondes gratuits, zéro teaser — les rappels s'ancrent aux énoncés **D** de CETTE quête uniquement (01 · 03 · 05 ; citer un énoncé I au score haut serait une fausse citation). ④ Aucune trame : 7.3 n'héberge AUCUN signal ▲ — colonne ▲ = « — » sur les 8 lignes ; les SIG sont **déclarés** au 03, pas hébergés. ⑤ Le vécu minoritaire n'est **jamais supposé** : l'écran de quête n'annonce pas le module, l'invitation s'affiche à l'entrée du module avec le refus digne. |

## ⚖️ ARBITRAGES CONSIGNÉS (À VALIDER PAR LE COMITÉ [9])

1. **Comptage** : la source dit « 8 items, incl. opt-in vécu » (refonte l. 1405) — lecture V15.C :
   **8 items total = 6 en mélange** (3 axes × 2, paires R6) **+ 2 items du module opt-in vécu HORS
   mélange** (précédent sérénité 6.1). L'arithmétique du Monde 7 = 24 items tient : 8 (7.1) +
   8 (7.2) + 8 (7.3 = 6 + 2 opt-in). Arbitrage consigné aux Décisions de composition du 01 — [9].
2. **Graine 273427** : consommée canoniquement pour 7.3 (convention concaténée, ordinal 63) —
   la place de décade hypothétique citée par la réservation du plan sans-objet 8.3 n'a donné
   lieu à AUCUN tirage : zéro collision réelle. Coordination M11 documentée au 02 — [9].
3. **Routage du miroir** : la classe refonte « Attentes mixité B (2-3 profils) » est réalisée en
   **3 profils, un par axe** (max des 3 moyennes ; ex æquo → 1ʳᵉ position de passation,
   convention alignée SIG-5.1-01/5.2-01) — proposition, [9].
4. **Temps verbaux des énoncés** : présent de l'indicatif partout ; Q7.3-03 porte un
   conditionnel **subordonné** (« saurait accueillir ») — l'hypothèse EST l'angle (la famille
   découvre), le verbe principal reste au présent — proposition, [9].
5. **Module vécu : 2 items D sans item I** : le renversement I lirait comme un énoncé de
   déficit (« rien appris ») — contraire à la dignité du bloc ; le retrait visible « Je préfère
   ne pas dire » à chaque item remplace le dispositif anti-aquiescement du précédent S03 (6.1) —
   proposition, [9].

## 🚫 INTERDITS SPÉCIFIQUES (liste fermée, vérifiable machine)

- **Au rendu (05, 07)** : « exotique », « exotisme », « ethnie », « ethnique », « racial »,
  « race », « nationalité », « homogamie », « homophilie », « acculturation » + tout nom
  d'auteur ou de typologie scientifique — zéro occurrence. ⚠ « homophilie culturelle
  assumée » n'existe QUE dans les sections **MOTEUR** (00/01/03), JAMAIS au rendu.
- **Vocabulaire rendu** : deux mondes, l'ailleurs, les familles, les regards, les racines,
  l'entre-deux.
- **Toute mesure d'origine, de nationalité, d'apparence** : le moteur ne croise que des traits
  (règle 4 du cadre de dignité — AUCUN filtre par origine).
- **Toute supposition de vécu** : le module opt-in ne s'ouvre que sur choix explicite ; aucun
  énoncé, aucun écran, aucun rappel ne suppose que l'utilisateur a vécu des regards.
- **Tout quadrant de la matrice au rendu** (« bâtisseur de ponts », « passe-partout », niveaux
  d'ancrage/d'ouverture affichés) — moteur seul.
- « toujours » / « jamais » au rendu · tout verdict ou correction d'attente · toute
  hiérarchie des postures · tout teaser ou présupposition des mondes gratuits · toute
  métadonnée visible (scores, codes, identifiants de signaux).

## 🔒 VERROUS

- **Matrice [MOTEUR SEUL]** (SIG-7.3-01) : marque obligatoire partout où elle est documentée ;
  aucun contenu croisé au rendu, à l'UI ou au match affiché.
- **Signal aux deux membres** (SIG-7.3-02) : jamais un tiers, jamais un verdict, jamais un
  score — la rédaction se rend SANS BLÂME (précédent 6.1 : « vos rythmes diffèrent »).
- **Exemption du module vécu** (SIG-7.3-03) : Q7.3-07 × 08 ne produisent AUCUNE brique —
  gravée au 00, au 01, au 03, au 04 et au 07.
- **Ombre ≥ lumière** sur les 3 profils du miroir — coût pour soi + coût pour l'autre nommés.
- **Registre probabiliste** — « la recherche documente que », « conduit fréquemment à » ;
  zéro « toujours/jamais » au texte rendu, zéro futur certain.
- Aucune trame : zéro contenu signal ▲ dans tout le dossier.

## 📖 Lecture des fichiers (ordre conseillé)

1. `01-tableau-des-items.md` — les 6 énoncés de mélange + le module opt-in vécu (libellé d'entrée, retrait) + usage moteur + décisions de composition.
2. `02-plan-de-melange-graine-273427.md` — graine, particularité « 6 en mélange + 2 hors mélange », verdicts c1-c6 réels, empreinte, coordination M11.
3. `03-signatures-registre.md` — SIG-7.3-01/02/03 (matrice verbatim, signal aux deux, ressources).
4. `04-slots-de-miroir.md` — le miroir LÉGER (3 profils), les verrous, l'exemption du module vécu.
5. `05-ecran-d-intro.md` — l'écran d'entrée (ton premium, zéro vécu supposé).
6. `07-miroir.md` — 3 profils respectés (gabarit LÉGER 80-150 mots, comptage × 3 machine).

## Conformité a11y

Conformité a11y : WCAG 2.1 AA visée (contrastes ≥ 4,5:1, cibles tactiles ≥ 44×44 px, support lecteur d'écran, respect du mode réduit-animations). Implémentation : voir spec quête 1.1 §10 et styles.css.
