# QUÊTE 5.2 « TA VISION DE L'AMOUR » — FICHE DE CADRAGE PUIS LECTURE DU LIVRABLE

> Monde M6 « Mon Cœur » · 💎 **PREMIUM** (statut_freemium : premium) · Phase P1.5 · Accès Libre (pas d'opt-in)
> 8 items Likert · Codes gelés Q5.2-01 → Q5.2-08 · 4 axes de croyances romantiques × 2 items — **4 paires R6**
> **AUCUNE trame dans cette quête** : zéro signal ▲, zéro position réservée, zéro contenu signal au dossier
> (décision comité : ne JAMAIS réinventer les trames perdues T01-T42 — document trames hors dépôt)
> Source : Constitution v2.1 [5] [6] [7] · refonte (statut quête l. 1813 — « **Ta vision de l'amour** —
> le destin, le coup de foudre, le grand amour unique | ♻️ RESTAURÉ en quête visible | 🕸️ pénalité
> destin×évitant » ; ancien bloc 2.3 l. 440 — « concept de croyances romantiques (public), 8 items
> originaux Wairyu » ; l. 1988 — lecture carte « Destin, coup de foudre, grand amour », lecture signal
> « Pénalité destin extrême × évitant », P1.5, Libre) · mission R-b (ré-émission 2ᵉ génération —
> enregistrements du worklog Task 21)
> B.3 : **production neuve déclarée** — le dossier V11 (commits jamais poussés) a été PERDU au reset du
> bac à sable ; les textes sont réécrits Wairyu sur le cadre gelé. AUCUN texte V11 n'existe à copier.

## 🧭 FICHE DE CADRAGE (lire avant tout le reste)

| Champ | Cadrage |
|---|---|
| **Ce que ça mesure** | Les **croyances romantiques** (concept public et libre — refonte l. 440) sur quatre axes : **le destin · le coup de foudre · le grand amour unique · l'idéalisation**. La typologie académique de référence (croyances de relation — Sprecher et Metts) reste **hors rendu** : noms d'auteures et nom d'échelle INTERDITS en toutes lettres dans 05, 07, cartes et écrans ; ils ne vivent que dans les fichiers moteur (01, 03, 06) comme référence scientifique. |
| **Neutralité axiologique stricte** | Une croyance n'est ni saine ni fragile : chaque axe a sa **lumière** et son **ombre en excès**. L'ombre se joue EXCLUSIVEMENT en couple (mécanisme + exemple concret + conséquence probabiliste + coût pour soi ET coût pour l'autre, les deux nommés). Zéro diagnostic, zéro étiquette, zéro hiérarchie des croyances. |
| **Format de réponse** | Likert 5 niveaux · D/I recodés `6 − r` · **4 paires R6 complètes** (01×02 · 03×04 · 05×06 · 07×08 — une par axe) · équilibre d'orientations **4 D / 4 I** — documenté au 01. |
| **Le slot probabiliste** | La restitution ne juge JAMAIS une vision de l'amour : la carte et le miroir racontent un **rapport au temps** — « la suite te dira si tu attends ou si tu construis » (matière gelée du refonte, l. 1813). Un verdict, une prédiction, une correction de croyance : interdits au rendu. |
| **La pénalité moteur (SIG-5.2-02)** | Destin extrême × attachement évitant (Monde 1) : le premier conflit sera fréquemment lu comme preuve d'incompatibilité — **[MOTEUR SEUL]**, jamais au rendu, jamais en UI, jamais au match affiché. Condition et poids : « À VALIDER PAR LE COMITÉ » (provisoire concepteur). |
| **Mélange** | Graine **252427** (210427 + 1000 × ordinal 42 — règle de décade, M6 = décade 40) · outil **générique** `melange.py` (finding d'outillage V11 : aucune trame, 4×2 — le générique suffit) · config `ci/quetes/5.2.json` créée par la session principale · course à exécuter ensuite, verdicts c1-c6 réels au 02 · c2/c3 **sans-objet** (zéro trame). |
| **Signatures attendues** | **SIG-5.2-01 « Le film que tu projettes »** — profil de croyances : l'axe le plus haut nomme la variante (4 sorties) ; slot d'attente probabiliste au rendu. **SIG-5.2-02 « Le scénario du premier conflit »** — destin extrême × évitant, [MOTEUR SEUL], comité. |
| **Slots prévus** | Miroir **LÉGER** (80-150 mots/variante — arbitrage gabarit consigné ci-dessous) · **4 profils** : un par axe dominant · 4 cartes (étage 1). |
| **Points de doctrine** | ① Aucun axe ne se corrige : le rendu donne des mots, jamais une thérapie de la croyance. ② Le secondaire (2ᵉ axe) nuance en conversation, il ne produit jamais un deuxième portrait. ③ Premium [6] : zéro présupposition des mondes gratuits, zéro teaser — les rappels s'ancrent aux réponses de CETTE quête, aux énoncés D uniquement (règle d'ancrage V11 : citer un énoncé I au score haut serait une fausse citation). ④ Aucune trame : 5.2 n'héberge AUCUN signal ▲ — zéro contenu signal au dossier. |

## ⚖️ ARBITRAGES CONSIGNÉS (re-consignés 2ᵉ génération — À VALIDER PAR LE COMITÉ)

1. **Gabarit du miroir** : [7] lirait MOYEN (8-14 items → 150-250 mots) ; la mission V11 calibre
   explicitement 5.2 en **LÉGER (80-150)** pour 8 items — le gabarit calibré par la mission prime
   (précédent V11 5.2/5.3, consigné comité). LÉGER appliqué, fenêtre de garde 80-150 mots.
2. **Statut** : le refonte marque « Libre » (l. 1988) — lecture V11 conservée : l'accès est libre
   (pas d'opt-in) et le monde M6 reste 💎 PREMIUM (Constitution [6]).
3. **Départage en ex æquo strict** : l'axe dont un item occupe la 1ʳᵉ position de passation
   l'emporte (convention de cascade, alignée sur SIG-5.1-01) — proposition, comité.
4. **La carte de référence refonte** (« Tu crois à l'amour qui frappe une fois… ») est traitée
   en **matière gelée du slot probabiliste** : la phrase-tension « la suite te dira si tu attends
   ou si tu construis » est gravée au 03/04/07 et reprise à la carte destin — reformulée
   ailleurs en registre probabiliste (zéro futur certain).

## 🚫 INTERDITS SPÉCIFIQUES (liste fermée, vérifiable machine)

- Les noms de la typologie de référence et de ses auteures : **jamais au rendu** (05, 07,
  cartes, écrans) — présents uniquement dans les fichiers moteur 01, 03, 06.
- « toujours » / « jamais » au rendu · tout diagnostic ou suffixe clinique · toute hiérarchie
  des croyances · toute correction de vision (« en réalité », « la vérité c'est que ») · tout
  verdict sur la vie amoureuse de l'utilisateur · tout teaser ou présupposition des mondes
  gratuits · toute métadonnée visible (scores, codes, identifiants de signaux).

## 🔒 VERROUS

- Ombre ≥ lumière sur les 4 profils du miroir et les 4 cartes.
- Slot probabiliste : zéro verdict, zéro prédiction — « la suite te dira » seul autorisé.
- Pénalité SIG-5.2-02 : [MOTEUR SEUL] — marque obligatoire partout où elle est documentée.
- Rappels ancrés aux énoncés **D** de CETTE quête uniquement.
- Aucune trame : zéro contenu signal ▲ dans tout le dossier.

## 📖 Lecture des fichiers (ordre conseillé)

1. `01-tableau-des-items.md` — les 8 énoncés (D/I, 4 axes) + usage moteur + décisions de composition.
2. `02-plan-de-melange-graine-252427.md` — graine dérivée, faisabilité c1-c6, trace de course réelle.
3. `03-signatures-registre.md` — SIG-5.2-01/02.
4. `04-slots-de-miroir.md` — le miroir LÉGER (4 profils) et ses 8 verrous.
5. `05-ecran-d-intro.md` — l'écran d'entrée (ton premium, zéro teaser).
6. `06-fiche-computation-EXEMPLE.yaml` — l'item Q5.2-01 aux 5 canaux.
7. `07-miroir.md` — 4 profils respectés (gabarit LÉGER 80-150 mots).
8. `cartes.yaml` — 4 variantes de carte (étage 1, charte C1-C11).

## Conformité a11y

Conformité a11y : WCAG 2.1 AA visée (contrastes ≥ 4,5:1, cibles tactiles ≥ 44×44 px, support lecteur d'écran, respect du mode réduit-animations). Implémentation : voir spec quête 1.1 §10 et styles.css.
