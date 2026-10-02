# QUÊTE 5.7 « TON HUMOUR » — FICHE DE CADRAGE PUIS LECTURE DU LIVRABLE

> Monde M6 « MON CŒUR » · **💎 PREMIUM** · Phase **P2** · statut_freemium **premium**
> **12 items Likert** · Codes gelés **Q5.7-01 → Q5.7-12**
> 4 styles × 3 items · **4 paires R6 complètes** (01×02 · 04×05 · 07×08 · 10×11) + **4 pivots** (03 · 06 · 09 · 12) · orientations **6 D / 6 I**
> **Zéro trame hébergée par cette quête** (verrou capital — voir Sécurité ci-dessous)
> Source : Constitution v2.1 [5]/[6]/[7] · refonte (lignes 525 · 1818 · 1993 : « Ton style d'humour (carte partageable) » · « Humour agressif → croisement RSQ » · P2) · worklog Task 21 (spécifications gelées V11) — **dossier ré-émis en 2ᵉ génération** (phase R, V12 ; textes V11 perdus au reset)
> B.3 : **production neuve déclarée** — le refonte cadre l'angle (4 styles + carte partageable + signal), **aucun texte d'item** n'y figure ; les textes V11 sont perdus, la rédaction est neuve.

## 🧭 FICHE DE CADRAGE (lire avant tout le reste)

| Champ | Cadrage |
|---|---|
| **Ce que ça mesure** | Quatre styles d'humour — **typologie publique, libre avec citation** (styles d'humour, Martin et al., 2003 ; concepts publics, formulations 100 % Wairyu, zéro item copié). Le nom d'auteur et le sigle de l'instrument restent côté moteur — **JAMAIS au rendu** (verrou [3], citation tenue en documentation interne). Les quatre styles, nommage UI verbatim refonte : **« qui rapproche »** (le rire qui lie le groupe) · **« qui dédramatise »** (le rire qui traverse les coups durs) · **« qui blesse »** (le rire qui pince sa cible) · **« qui s'auto-rabaisse »** (le rire qui se prend pour cible). |
| **Le dual face (refonte verbatim)** | « Restauré en quête VISIBLE (dual face : carte partageable + signal humour agressif) ». **Face visible** : la carte partageable — produit central de la quête (le style d'humour est un déclencheur de like majeur, refonte). **Face moteur** : un humour qui blesse croisé à une forte sensibilité au rejet (RSQ — blocs 1.2/4.2) alimente un drapeau de vigilance de préparation — **MOTEUR SEUL, jamais au rendu, jamais au match** (SIG-5.7-02). |
| **Doctrine de l'ombre (gelée V11)** | **L'ombre = le COÛT, jamais le style.** Qui blesse blesse ses cibles sensibles — le coût est pour la cible et pour la relation. Qui s'auto-rabaisse devient une identité qui épuise — le coût est pour soi et pour l'autre, qui ne peut pas rassurer à l'infini. Qui rapproche repousse le sérieux — le moment grave n'atterrit jamais. Qui dédramatise pose le rire avant la conversation nécessaire — l'essentiel attend. **AUCUN style jugé supérieur** ; le partageable met en avant « qui rapproche » ET « qui dédramatise » sans hiérarchie, et les cartes des deux styles à coût restent assumées (dual face complet, précédent V11) avec leur coût nommé, pas une condamnation. |
| **Format de réponse** | Likert 5 niveaux · D/I recodés `6 − r` (Arbitrage 1) · **4 paires R6 complètes + 4 pivots (1/style)** — arithmétique 4×2 + 4 = 12, zéro écart · orientations mixtes équilibrées **6 D / 6 I** (documentées au 01). |
| **Mélange** | RÉEL — graine **257427** (graine-mère 210427 + 1000 × ordinal 47 ; décade M6 = 40 — 5.1→41 · 5.2→42 · 5.3→43 · ordinals 44/45/46 réservés V12 pour 5.4/5.5/5.6). Aucune collision (jamais attribuée — vérifié dépôt). Outil **générique** `melange.py` (zéro trame, 4 dimensions × 3 — le générique suffit, finding V11 re-consigné). Tentative 1, verdicts 6/6, run max 2, **5 passes identiques** (md5 `6425e597bbd13fc8e993f80e4342c214`) — course de référence pré-validée hors dépôt, **config `ci/quetes/5.7.json` À CRÉER par la session principale** (contenu proposé verbatim au 02). |
| **Signatures attendues** | **SIG-5.7-01 « Ton humour raconté »** — cascade : style dominant (+ secondaire selon écart), seuils provisoires « À VALIDER PAR LE COMITÉ ». **SIG-5.7-02 « La cible et la sensibilité »** — croisement humour qui blesse × RSQ haute : **MOTEUR SEUL, JAMAIS au rendu**, marque « À VALIDER PAR LE COMITÉ ». **SIG-5.7-03** — attente IAC : croisement analysé au Phase 2/3, **consigné ATTENDU, pas calculé**. |
| **Slots prévus** | Miroir **MOYEN** (12 items → gabarit **150-250 mots**, Constitution [7] — arbitrage V11 validé MOYEN, re-consigné) · **4 profils, un par style dominant** (spécification gelée phase R) · **4 cartes** (une par style, étage 1, partageables). |
| **Nommage UI (verrou)** | Les quatre styles se nomment au rendu **« qui rapproche » · « qui dédramatise » · « qui blesse » · « qui s'auto-rabaisse »** (verbatim refonte). Les noms scientifiques (affiliatif, auto-améliorant, agressif, auto-dégradant) et le nom d'auteur/sigle n'apparaissent QUE dans les fichiers moteur (01 · 03 · 06 + le présent 00) — **jamais au 05/07/cartes** (vérification machine à chaque livraison). |

## 🔒 Sécurité — verrou capital

**AUCUNE trame hébergée par 5.7 — zéro contenu signal ▲ dans cette quête.** L'humour tranchant
mesuré ici est celui du **CADRE public** (items déclaratifs, typologie ouverte, licence libre avec
citation). Les trames ▲ du bloc humour agressif (T47→T50) sont la propriété de la **quête 5.4
(phase V12)** — ne jamais les réinventer, jamais les fusionner avec cette lecture. Les 12 items de
cette passation sont TOUS carte (concepts publics) ; aucune position ▲, aucune ligne-réservée.

## Points de doctrine (5)

1. **Les quatre rires se valent** : neutralité typologique — aucun style supérieur, aucune
   hiérarchie au rendu ; « qui rapproche » n'est pas « le bon humour », « qui blesse » n'est pas
   une faute morale. Le rendu décrit des mécanismes et des coûts, jamais un classement.
2. **L'ombre = le COÛT, jamais la nature** : chaque profil nomme le coût pour soi ET le coût pour
   l'autre, en situation de couple, au registre probabiliste ; aucun style n'est condamné, aucun
   n'est prescrit.
3. **Moteur vs rendu** : le croisement humour×RSQ vit côté moteur seul (jamais au rendu, jamais au
   match) ; le nommage scientifique vit côté moteur ; le rendu parle en images — la table qui rit,
   la pique, le bouclier, la conversation qui attend.
4. **Premium [6]** : zéro présupposition des mondes gratuits, zéro teaser — le premium change ZÉRO
   chose au contenu ; la carte partageable reste le produit central (bouton partage du gabarit
   standard, dual face refonte).
5. **Divergence d'accès arbitrée** : la refonte (ligne 1993) marque 5.7 « Libre » — la
   Constitution [5] gagne (M6 = 💎 PREMIUM), précédent V11 identique ; consigné ici et au README,
   re-consigné en 2ᵉ génération (À VALIDER PAR LE COMITÉ — décision entérinée V11).

## 📖 Lecture des fichiers (ordre conseillé)

1. `01-tableau-des-items.md` — les 12 énoncés carte (D/I, 4 styles) + usage moteur + décisions.
2. `02-plan-de-melange-graine-257427.md` — l'ordre de passation (outil générique) + statut config.
3. `03-signatures-registre.md` — SIG-5.7-01/02/03 + liaisons de domaine du CŒUR (attendues V12).
4. `04-slots-de-miroir.md` — le miroir MOYEN et ses 9 verrous.
5. `05-ecran-d-intro.md` — l'écran d'entrée (ton, neutralité, règles premium [6]).
6. `06-fiche-computation-EXEMPLE.yaml` — l'item Q5.7-07 aux 5 canaux.
7. `07-miroir.md` — 4 profils respectés (un par style dominant), gabarit MOYEN.
8. `cartes.yaml` — 4 variantes de carte (étage 1, charte C1-C11, partageables).

## Conformité a11y

Conformité a11y : WCAG 2.1 AA visée (contrastes ≥ 4,5:1, cibles tactiles ≥ 44×44 px, support lecteur d'écran, respect du mode réduit-animations). Implémentation : voir spec quête 1.1 §10 et styles.css.
