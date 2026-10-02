# QUÊTE 7.1 « TES RACINES » — FICHE DE CADRAGE PUIS LECTURE DU LIVRABLE

> Monde M10 « Mon Monde » · 💎 **PREMIUM** (statut_freemium : premium) · Phase P3 · Accès Libre (pas d'opt-in)
> 8 items Likert · Codes gelés Q7.1-01 → Q7.1-08 · 4 axes du poids de l'héritage × 2 items — **4 paires R6**
> **AUCUNE trame dans cette quête** : zéro signal ▲, zéro position réservée, zéro contenu signal au dossier
> (M10 n'héberge aucune trame — colonne ▲ du tableau 01 = « — » sur les 8 lignes)
> Source : Constitution v2.1 [5] [6] [7] · refonte (statut quête l. 2019 — « **Tes racines** » |
> lecture carte « **Le poids de ton héritage** » | lecture signal « **Ancrage culturel (trait)** » |
> P3 | Libre ; contenu 7.1 l. 1389-1393 — « Ta culture d'origine dans ta vie quotidienne :
> omniprésente, présente, lointaine, ou multiple ? · La langue, la cuisine, les fêtes : ce que tu
> veux transmettre ou vivre · La place de ta famille élargie dans tes choix de vie · Tes attentes
> sur les traditions dans un couple » ; **cadre de dignité** l. 1380-1385 — 4 règles ;
> matrice ANCRAGE × OUVERTURE l. 1405-1419 ; classes miroir l. 3792 — Ancrage culturel « B
> (3 niveaux) », **mission V15 prime : 4 profils descriptifs, aucune hiérarchie**) · mission V15.A
> B.3 : **production neuve déclarée** — M10 n'avait aucune trace antérieure ; les textes sont
> écrits Wairyu sur le cadre gelé. AUCUN texte hérité n'existe à copier.

## 🧭 FICHE DE CADRAGE (lire avant tout le reste)

| Champ | Cadrage |
|---|---|
| **Ce que ça mesure** | Le **poids de ton héritage dans ta vie** (concept public et libre — refonte l. 1389) sur quatre axes : **le quotidien · la transmission · la famille élargie · les traditions en couple**. La recherche de référence (champs gelés de la source, l. 2015) reste **hors rendu** : les termes de la discipline et tout nom d'auteur·e ou d'échelle sont INTERDITS en toutes lettres dans 05 et 07 ; ils ne vivent que dans les fichiers moteur (00, 01, 03). |
| **Règle de dignité (source gelée l. 1380-1385 — appliquée à la lettre)** | ① **Digne, en aucun cas exotisante** — on mesure **le poids de ton héritage**, en aucun cas une origine. ② **L'auto-identification libre** — chacun se décrit avec ses propres mots : principe gravé ici, mais le champ libre est un **domaine réservé [9]** — cette quête n'impose aucune case ni aucun champ libre. ③ **Le vécu minoritaire, opt-in strict** — hors périmètre 7.1 (module opt-in de la quête 7.3) : cette quête ne suppose rien du vécu de personne. ④ **Zéro filtre par origine** — le moteur croise des traits (ANCRAGE × OUVERTURE, matrice gelée), en aucun cas des origines. |
| **Neutralité axiologique stricte** | Une place d'héritage n'est ni plus mûre ni plus fidèle : chaque axe a sa **lumière** et son **ombre en excès**. L'ombre se joue EXCLUSIVEMENT en couple (mécanisme + coût pour toi ET coût pour l'autre, les deux nommés). Zéro diagnostic, zéro étiquette, zéro hiérarchie — les 4 profils du miroir sont **descriptifs, aucun n'est « meilleur »** (mission V15 prime sur la classe source « B (3 niveaux) », l. 3792). |
| **Format de réponse** | Likert 5 niveaux · D/I recodés `6 − r` · **4 paires R6 complètes** (01×02 · 03×04 · 05×06 · 07×08 — une par axe) · équilibre d'orientations **4 D / 4 I** — documenté au 01. |
| **Le trait moteur (SIG-7.1-01)** | **ANCRAGE (trait)** = moyenne des 4 moyennes d'axe — **[MOTEUR SEUL]** : il alimente la **matrice interculturelle de la quête 7.3** (croisements du Monde 7 : ancrage × ouverture ; divergence d'attentes famille → signal « à aborder tôt »), **en aucun cas** le rendu, l'UI ou le match affiché. Seuils : « À VALIDER PAR LE COMITÉ » (provisoire concepteur). |
| **Mélange** | Graine **271427** (210427 + 1000 × ordinal 61 — convention concaténée : quête 7.1 → (7−1)×10+1 = **61**) · outil **générique** `melange.py` (zéro trame, 4×2 — le générique suffit) · config `ci/quetes/7.1.json` créée avec le dossier (session V15.A) · course exécutée **3 fois** — sorties identiques octet pour octet (empreinte unique), verdicts c1-c6 réels au 02 · c2/c3 **sans-objet** (zéro trame). |
| **Signatures attendues** | **SIG-7.1-01 « ANCRAGE (trait) »** — moyenne des 4 axes, **[MOTEUR SEUL]**, seuils [9]. Le routage d'affichage du miroir (axe dominant, 4 profils) est une convention d'affichage documentée au 03/04/07 — distincte du trait. |
| **Slots prévus** | Miroir **LÉGER** (80-150 mots/variante — arbitrage consigné ci-dessous) · **4 profils** : un par axe dominant · carte du monde : hors périmètre de la présente mission (lecture carte gelée « Le poids de ton héritage » — aucun fichier carte au dossier). |
| **Points de doctrine** | ① Aucun axe ne se corrige : le rendu donne des mots, **en aucun cas une mesure d'origine** (règle de dignité). ② Le secondaire (2ᵉ axe) nuance en conversation, il ne produit **aucun** deuxième portrait. ③ Premium [6] : zéro présupposition des mondes gratuits, zéro teaser — les rappels s'ancrent aux réponses de CETTE quête, aux énoncés D uniquement (règle d'ancrage V11 : citer un énoncé I au score haut serait une fausse citation). ④ Aucune trame : 7.1 n'héberge AUCUN signal ▲ — colonne ▲ = « — » sur les 8 lignes. ⑤ La position **« multiple »** de la source (culture multiple, l. 1390) se lit dans l'égalité stricte de plusieurs axes dominants — départage conventionnel documenté [9]. |

## ⚖️ ARBITRAGES CONSIGNÉS (1ʳᵉ génération V15 — À VALIDER PAR LE COMITÉ)

1. **Gabarit du miroir** : la mission V15 calibre explicitement 7.1 en **LÉGER (80-150)** pour
   8 items — même arbitrage que le précédent 5.2 (mission MOYEN **arbitré LÉGER**, consigné
   comité). LÉGER appliqué, fenêtre de garde 80-150 mots, comptage machine au 07 §2.
2. **4 profils descriptifs vs classe source « B (3 niveaux) »** (l. 3792) : la mission V15
   prime — **4 profils d'ancrage descriptifs, aucune hiérarchie** au rendu. La lecture en
   niveaux reste un paramètre moteur du trait (seuils [9]) : les deux plans coexistent sans
   se mélanger (descriptif au rendu, niveaux au ledger).
3. **Départage en ex æquo strict** : l'axe dont un item occupe la 1ʳᵉ position de passation
   l'emporte (convention de cascade, alignée sur SIG-5.1-01) — proposition, comité.
4. **Position « multiple » de la source** : couverte par l'égalité stricte de plusieurs axes
   dominants (départage d'affichage conventionnel) + par la zone médiane du Likert —
   convention documentée, comité.
5. **Statut** : le refonte marque « Libre » (l. 2019) — l'accès est libre (pas d'opt-in) et
   le monde M10 reste 💎 PREMIUM (Constitution [6]).

## 🚫 INTERDITS SPÉCIFIQUES (liste fermée, vérifiable machine)

- Au rendu (05, 07 — et tout écran/libellé UI de la quête) : **exotique · exotisme · ethnie ·
  ethnique · racial · race · nationalité · homogamie · homophilie · acculturation** + tout
  nom d'auteur·e, d'échelle ou de type scientifique — 0 occurrence vérifiée machine.
- **Zéro référence ethnique, nationale ou religieuse** : les écrans et libellés UI mesurent le
  POIDS DE L'HÉRITAGE, en aucun cas une origine — aucun pays, aucun groupe, aucune pratique
  nommée comme appartenant à qui que ce soit.
- Vocabulaire rendu autorisé (champ de l'héritage) : **héritage · racines · culture familiale ·
  pays · ailleurs · deux mondes · fête · cuisine · langue · famille** — le rendu ne nomme
  l'héritage que dans ce lexique-là (+ mots ordinaires sans lien avec l'origine).
- Toute mesure d'origine, toute case imposée, tout champ libre exigé · tout adverbe de
  fréquence absolue · tout diagnostic ou suffixe clinique · toute hiérarchie des positions
  d'ancrage · tout verdict sur la vie de l'utilisateur · tout teaser ou présupposition des
  mondes gratuits · toute métadonnée visible (scores, codes, identifiants de signaux).

## 🔒 VERROUS

- Ombre ≥ lumière sur les 4 profils du miroir.
- Trait SIG-7.1-01 : **[MOTEUR SEUL]** — marque obligatoire partout où il est documenté ;
  zéro franchissement du rendu, de l'UI ou du match affiché.
- Rappels ancrés aux énoncés **D** de CETTE quête uniquement.
- Aucune trame : zéro contenu signal ▲ dans tout le dossier.
- Profils descriptifs : **aucune hiérarchie** — aucun profil « meilleur » (règle de dignité).
- Miroir LÉGER 80-150 mots — gabarit verrouillé (mission V15 ; précédent 5.2).

## 📖 Lecture des fichiers (ordre conseillé)

1. `01-tableau-des-items.md` — les 8 énoncés (D/I, 4 axes) + usage moteur + décisions + contrôles.
2. `02-plan-de-melange-graine-271427.md` — graine dérivée, faisabilité c1-c6, trace de course réelle (3 passes).
3. `03-signatures-registre.md` — SIG-7.1-01 (trait) + routage d'affichage du miroir.
4. `04-slots-de-miroir.md` — le miroir LÉGER (4 profils) et ses 10 verrous.
5. `05-ecran-d-intro.md` — l'écran d'entrée (ton premium, zéro teaser, zéro origine).
6. `07-miroir.md` — 4 profils respectés (gabarit LÉGER 80-150 mots, comptage §2).

## Conformité a11y

Conformité a11y : WCAG 2.1 AA visée (contrastes ≥ 4,5:1, cibles tactiles ≥ 44×44 px, support lecteur d'écran, respect du mode réduit-animations). Implémentation : voir spec quête 1.1 §10 et styles.css.
