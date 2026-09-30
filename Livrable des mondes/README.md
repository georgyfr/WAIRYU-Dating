# 📦 LIVRABLE DES MONDES

Ce dossier accueille les livrables de production des quêtes du voyage Wairyu, un monde après l'autre.
Chaque livrable est né dans une session de production cadrée par la **Constitution v2.1** (voir `ddocumentation`),
avec le rituel d'ouverture [10] : restitution en 5 lignes → validation → production.

## 🗺️ Structure

```
Livrable des mondes/
├── M1-1.1-Ta-Personnalite/      ← quête 1.1 « Ta personnalité » (M1 — Le Miroir, 🆓 gratuit, 58 items)
├── M1-1.2-Facon-Tattacher/      ← quête 1.2 « Ta façon de t'attacher » (M1, 🆓, 20 items)
├── M1-1.3-Tes-Emotions/         ← quête 1.3 « Tes émotions » (M1, 🆓, 26 items)
├── M2-1.4-Ton-Controle/         ← quête 1.4 « Ton contrôle sur toi-même » (M2 — Le Volant, 🆓, 8 items)
├── M2-1.6-Ta-Facon-de-Penser/   ← quête 1.6 « Ta façon de penser » (M2, 🆓, 7 items + 3 énigmes)
├── M2-1.7-Ton-Fonctionnement/   ← quête 1.7 « Ton fonctionnement » (M2, 🆓, opt-in, 2 items)
├── M2-1.5-Lepreuve-du-Temps/    ← quête 1.5 ⚡ « L'épreuve du temps » (M2, 🆓, 6 choix — tâche comportementale, VAGUE 6)
├── M2-1.9-Ton-Elan-du-Moment/   ← quête 1.9 « Ton élan du moment » (M2, 🆓, 8 items d'ÉTAT — JAMAIS au score, VAGUE 6)
├── M2-1.10-Ce-Que-Tu-Apportes/  ← quête 1.10 « Ce que tu apportes » (M2, 🆓, 10 items — SIG_CONTRIB, VAGUE 6)
├── M2-1.11-Es-Tu-Pret-A-Rencontrer/ ← quête 1.11 « Es-tu prêt·e à rencontrer ? » (M2, 🆓, quête-écran, 3 questions, VAGUE 6)
├── M3-2.1-Tes-Valeurs/          ← quête 2.1 « Tes valeurs » (M3 — La Boussole, 🆓 gratuit, Socle, MVP)
├── M3-2.2-Ta-Place-Pour-La-Spiritualite/ ← quête 2.2 « Ta place pour la spiritualité » (M3, 🆓, 6 items, VAGUE 6)
├── M3-2.3-Tes-Non-Negociables/  ← quête 2.3 « Tes non-négociables » (M3, 🆓, Socle, 10 checks)
├── M3-2.4-Tes-Realites/         ← quête 2.4 « Tes réalités » (M3, 🆓, Socle, 8 clics)
├── M3-2.5-Ce-Que-Tu-Cherches/   ← quête 2.5 « Ce que tu cherches » (M3, 🆓, Socle, 3 binaires)
├── M3-2.6-Tes-Priorites-5-Ans/  ← quête 2.6 « Tes priorités pour les 5 prochaines années » (M3, 🆓, jeu 100 points, VAGUE 6)
├── M3-2.7-Ta-Vision-de-la-Famille/ ← quête 2.7 « Ta vision de la famille » (M3, 🆓, 8 items — dealbreaker parentalité, VAGUE 6)
├── M3-2.8-Ton-Signe/            ← quête 2.8 « Ton signe (juste pour le jeu) » (M3, 🆓, badge opt-in — hors score, VAGUE 6)
├── M4-3.1-Ton-Rythme-de-Vie/    ← quête 3.1 « Ton rythme de vie » (M4 — Ton terrain, 🆓, 5 items, badge 🌅/🦉, MISSION V9)
├── M4-3.2-Ton-Quotidien/        ← quête 3.2 « Ton quotidien » (M4, 🆓, 8 items 2 axes 5/3, outil dédié biaxes, MISSION V9)
├── M4-3.3-Ton-Temps-Libre/      ← quête 3.3 ⚡ « Ton temps libre » (M4, 🆓, 8 carte + 4▲ CSR, MISSION V9)
├── M4-3.4-Ton-Rapport-a-lArgent/ ← quête 3.4 « Ton rapport à l'argent » (M4, 🆓, 6 carte + 2▲ DGR, MISSION V9)
├── M4-3.5-Ton-Entourage/        ← quête 3.5 « Ton entourage » (M4, 🆓, 6 items, R6 intégrales, MISSION V9)
├── M4-3.6-Le-Choix-Visuel/      ← quête 3.6 ⚡ « Le choix visuel » (M4, 🆓, 8 paires A/B — brise-glaces, MISSION V9)
├── M4-3.7-Tes-Attirances/       ← quête 3.7 « Tes attirances » (M4, 🆓, 5 déclaratifs PRIVÉS — pool Mode Invisible, MISSION V9)
├── M5-4.1-Ton-Arbre-Relationnel/ ← quête 4.1 « Ton arbre relationnel » (M5 — Ton Héritage, 🆓, 8 items + génogramme interactif non compté, MISSION V10)
├── M5-4.2-Ou-Tu-En-Es-Aujourdhui/ ← quête 4.2 « Où tu en es aujourd'hui » (M5, 🆓, 19 items : 10 RB1 + 8 RSQ + 1 ouverte, MISSION V10)
├── M5-4.3-Ce-Que-Tes-Relations-Tont-Appris/ ← quête 4.3 ⚡ « Ce que tes relations t'ont appris » (M5, 🆓, 1 question ouverte — BLA P2, MISSION V10)
├── M5-4.4-Blessures-Et-Aisance/ ← quête 4.4 (INVISIBLE) « Blessures et aisance » (M5, 12 carte-bloc + 10▲ — tissées chez 4.1/4.2, MISSION V10)
├── M6-5.1-Ton-Style-Amoureux/   ← quête 5.1 « Ton style amoureux » (M6 — Mon Cœur, 💎 PREMIUM, 18 items — 6 façons × 3, VAGUE V11 2ᵉ gén.)
├── M6-5.2-Ta-Vision-De-Lamour/  ← quête 5.2 « Ta vision de l'amour » (M6, 💎, 8 items — 4 axes de croyances romantiques, VAGUE V11 2ᵉ gén.)
├── M6-5.3-Comment-Tu-Exprimes-Ton-Affection/ ← quête 5.3 « Comment tu exprimes ton affection » (M6, 💎, 10 items — 5 canaux, JAMAIS DANS LE SCORE, VAGUE V11 2ᵉ gén.)
├── M6-5.7-Ton-Humour/           ← quête 5.7 « Ton humour » (M6, 💎, 12 items — 4 styles, carte partageable, VAGUE V11 2ᵉ gén.)
├── M7-5.4-Face-Aux-Desaccords/  ← quête 5.4 « Face aux désaccords » (M7 — Face aux Tempêtes, 💎, 23 items : 15 carte + 8▲ JR1/SD hébergées, MVP conflit, VAGUE V12)
├── M7-5.5-Quand-La-Tension-Monte/ ← quête 5.5 « Quand la tension monte » (M7, 💎, 8 items — 4 températures, VAGUE V12)
└── M7-5.6-Apres-Un-Desaccord/   ← quête 5.6 « Après un désaccord » (M7, 💎, 5 items — 5 capacités de réparation, VAGUE V12)

**+ `portraits/domaines/coeur.md` — le PORTRAIT DE DOMAINE DU CŒUR (M6+M7, gabarit A5, VAGUE V12 — premier Portrait de Domaine réel : 6 liaisons croisées §2 + engagement §5).**
```

Chaque dossier de quête porte : `README.md` (vue d'ensemble) · `00-README.md` (guide de lecture 1 page)
· `01-tableau-des-items.md` · `02-plan-de-melange-graine-*.md` · `03-signatures-registre.md`
· `04-slots-de-miroir.md` · `05-ecran-d-intro.md` · `06-fiche-computation-*.yaml` · `cartes.yaml`.

**Taux de matérialisation : 402/570 items = 70,5 %** (Monde 1 : 124 · Socle 2.1 : 24 · formats spéciaux
Socle 2.3/2.4/2.5 : 21 · VAGUE 6 : 47 · MISSION V9 — Monde M4 « Ton terrain » : 52 · **MISSION V10 —
Monde M5 « Ton Héritage » : 50** — 4.1 arbre relationnel 8 + génogramme interactif non compté,
4.2 où tu en es 19 (10 RB1 + 8 RSQ + 1 ouverte), 4.3 relations apprises ⚡ 1 ouverte,
4.4 (invisible) blessures et aisance 22 (12 carte-bloc + 10▲ tissées dans les passations 4.1/4.2).
1.8 « Ton bien-être » reste Phase 3 avec verrou renforcé (relecture professionnelle obligatoire,
option de retrait — FM-019) · **VAGUE V11 2ᵉ GÉN. — Monde M6 « Mon Cœur » (💎 PREMIUM) : 48** —
5.1 style amoureux 18 · 5.2 vision de l'amour 8 · 5.3 expression de l'affection 10 (JAMAIS DANS LE SCORE)
· 5.7 humour 12 · **VAGUE V12 — Monde M7 « Face aux Tempêtes » (💎 PREMIUM) : 36** — 5.4 désaccords 23
(15 carte MVP conflit + 8▲ JR1/SD hébergées, énoncés hors dépôt règle 11-b) · 5.5 tension 8 ·
5.6 réparation 5 · **+ le PORTRAIT DE DOMAINE DU CŒUR (M6+M7) — premier Portrait de Domaine réel**.)**

> 🆓💎 **Après MISSION V12, le DOMAINE DU CŒUR (M6+M7) est REFERMÉ en items** — sept quêtes +
> un Portrait de Domaine. Le voyageur parcourt son territoire gratuit (M1 Le Miroir · M2 Le Volant ·
> M3 La Boussole · M4 Ton terrain — dont 3.7 requis avant l'activation du Mode Invisible · M5 Ton
> Héritage — 4.1→4.3 en accès libre, bloc invisible 4.4 tissé dans les passations 4.1/4.2), puis
> entre sur le **territoire 💎 PREMIUM** : **M6 Mon Cœur (5.1 · 5.2 · 5.3 · 5.7)** et **M7 Face aux
> Tempêtes (5.4 · 5.5 · 5.6)** — couronnés par le **Portrait de Domaine du Cœur** (`portraits/
> domaines/coeur.md`, gabarit A5, engagement §5 — la valeur de conversion tangible). Constitution
> [6] appliquée à la production : le premium change ZÉRO chose au contenu, ne présuppose rien du
> gratuit, sans teaser (historique V11 2ᵉ gén. : les dossiers M6 ont été RÉ-ÉMIS après la perte du
> sandbox — empreintes de mélange V11 reproduites 3/4, constat consigné aux plans 02).

## 📐 Conventions permanentes (arbitrages verrouillés, valables pour TOUTES les quêtes)

| # | Arbitrage | Décision |
|---|---|---|
| 1 | **Orientation D/I** | D = direct (contribue tel quel au score de sa dimension) · I = inversé (recodé `6 − réponse`) |
| 2 | **Format d'échelle** | Likert 5 niveaux, codage 1-5 : `1 Pas du tout comme moi · 2 Plutôt pas comme moi · 3 Neutre / je ne sais pas · 4 Plutôt comme moi · 5 Tout à fait comme moi` |
| 3 | **Codes gelés** | Chaque fiche de quête porte sa plage réservée (ex : 2.1 = Q2.1-01 → Q2.1-24). Attribution séquentielle à la rédaction ; l'ordre de passation est celui du plan de mélange ; un code non utilisé reste gelé et n'est jamais réattribué |
| 4 | **Signaux hors glossaire [4]** | Interdits en session. Procédure : demande → validation comité → Fiche de Mutation d'ajout au dictionnaire → ensuite seulement production |

## 🔒 Posture de production

- Trois verrous HUMAINS (Constitution [9]) : seuils psychométriques, formulations de sécurité/bien-être,
  validation scientifique. **État après FM-019 (décisions comité 2026-09-29)** : les seuils proposés
  sont ADOPTÉS comme valeurs de départ et marqués « **provisoires concepteur — re-signature
  professionnelle avant bêta** » dans les livrables ; les valeurs des signatures de sécurité restent
  consignées hors dépôt (document trames, canal privé). Les points non couverts par FM-019 restent
  marqués « À VALIDER PAR LE COMITÉ ».
- Circuit de chaque livrable : **production → validateur (linter) → auditeur hostile C1 (session séparée) → gouvernance D1**.
- Le Contrat d'Inventaire v1.3 reste la SOURCE UNIQUE. En cas de divergence : LE CONTRAT GAGNE — signale, ne corrige pas.
