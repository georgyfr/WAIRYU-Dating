# QUÊTE 3.2 « TON QUOTIDIEN » — LIVRABLES DE PRODUCTION

> **Monde** : M4 — Ton terrain · **Statut** : 🆓 gratuit · **Catégorie** : Libre · **Phase** : P1.5
> **Domaine** : quête Libre M4 — croisements internes M4 autorisés (rythme × quotidien × temps
> libre) selon le cadrage ; les liaisons du DOMAINE DU SOI restent au Portrait de Domaine ([5])
> **Items** : 8 items Likert — 2 axes (planification 5 · ordre domestique 3), 3 paires R6 + 2 pivots
> **Plage de codes gelée** : Q3.2-01 → Q3.2-08
> **Cadre** : Constitution v2.1 [5] (« Ton quotidien ») · refonte (Ajout 3 — « les frictions de la
> vraie vie ») · mission V9.B — **B.3 : production neuve déclarée** (aucun texte d'item au source gelé)
> **Neutralité des styles** : planifier / improviser, ordre / désordre = deux façons égales d'habiter — le désordre est un fonctionnement, pas une paresse.

## 📁 Contenu du livrable (10 fichiers)

| Fichier | Livrable |
|---|---|
| `00-README.md` | Fiche de cadrage (2 axes 5/3 ; neutralité des styles ; friction documentée) |
| `01-tableau-des-items.md` | Les 8 énoncés (D/I, 2 axes, fiches condensées) + l'arithmétique R6 (3 paires + 2 pivots) documentée |
| `02-plan-de-melange-graine-232427.md` | Mélange RÉEL via **outil dédié** melange-biaxes.py (graine 232427 avec note de provenance — ancienne graine retirée de 2.2 ; c1/c4 sans-objet par arithmétique, minimums documentés : 1 adjacence · déficit 6 ; run max 1 ; 5 passes identiques) |
| `03-signatures-registre.md` | SIG-3.2-01 « Le profil quotidien » (2 axes → 4 quadrants + central) + SIG-3.2-02 « La friction domestique » (« à aborder tôt » — jamais de pénalité dure) |
| `04-slots-de-miroir.md` | Miroir MOYEN (2 slots) + 8 verrous (le désordre = un fonctionnement ; l'écart calculé ne se raconte pas) |
| `05-ecran-d-intro.md` | Écran d'intro (« il n'y a pas de bonne façon ») |
| `06-fiche-computation-EXEMPLE.yaml` | Q3.2-01 aux 5 canaux (paire R6, profil 2 axes, double balise) |
| `07-miroir.md` | 5 profils respectés (4 quadrants + central), MOYEN 150-250 mots |
| `cartes.yaml` | 5 variantes : Le·La Cadran bien réglé · Le·La Calépin et le flot · Le·La Porte qui suit le vent · Le·La Voile au vent · Le·La Marée des jours |
| `README.md` | Le présent fichier |

## ✅ Déclaration de conformité (interdits absolus)

| Interdit absolu | Statut |
|---|---|
| Orientation normative (un style « mieux » qu'un autre) | ✅ aucune — les 5 profils respectés, l'intro le dit avant la première question |
| Vocabulaire clinique rendu | ✅ zéro — aucun « trouble », « manie », « obsession » ; le désordre = un fonctionnement |
| Dimensions non listées | ✅ les 2 axes sont nommés et bornés (planification · ordre domestique) |
| Items non demandés | ✅ 8 exactement (5+3 — cadrage mission V9.B / refonte) |
| Format d'échelle changé | ✅ Likert 5 (Arbitrage 2) — 3 paires R6 complètes + 2 pivots documentés (arithmétique 5/3, À VALIDER PAR LE COMITÉ) |
| Pénalité de style fabriquée | ✅ aucune — SIG-3.2-02 est un signal conversationnel « à aborder tôt », jamais une élimination |
| Mélange altéré / outil commun modifié | ✅ aucun — outil DÉDIÉ melange-biaxes.py créé (l'outil générique reste intact, reproductibilité des mélanges archivés préservée) ; c1/c4 sans-objet par ARITHMÉTIQUE avec minimums réels documentés (règle « jamais un verdict non atteignable » respectée) |
| Collision de graine active | ✅ aucune — 232427 = graine RETIRÉE de 2.2 (re-tirée 222427 en V8), réutilisation avec note de provenance (règle mission V9.B) |
| Sigle hors glossaire [4] | ✅ PLAN_D, ORDRE_D, EC_PLAN, EC_ORDRE, SIG-3.2-01/02 restent moteur |
| Code/score/sigle au rendu | ✅ aucun — rappels en toutes lettres |
| Verrous [9] traités comme décisions | ✅ seuils quadrants + seuils d'écart : À VALIDER PAR LE COMITÉ ; bornes FM-019 provisoires |
| Trames au dépôt (règle 11-b) | ✅ aucune trame — quête déclarative directe, déguisement impossible (n_trames = 0) |

## ⚠️ Points en attente de validation comité

- Bornes des quadrants et du central (déviations 0.15, FM-019 provisoires) · seuils d'écart
  SIG-3.2-02 (proposition > 0.30) · l'arithmétique R6 (3 paires + 2 pivots) · les minimums c1/c4
  documentés (1 adjacence · déficit 6 — sans-objet par arithmétique) · la provenance de la
  graine 232427 (réutilisation d'une graine retirée — règle mission V9.B appliquée).

## 🔁 Circuit restant

Implémentation (ingénierie) → restitution ÉTAGE 1 (carte) puis ÉTAGE 2 (miroir) au parcours —
rendu applicatif au plan de phases (P1.5 pour cette quête).
