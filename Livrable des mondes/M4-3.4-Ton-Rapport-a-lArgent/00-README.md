# QUÊTE 3.4 « TON RAPPORT À L'ARGENT » — FICHE DE CADRAGE PUIS LECTURE DU LIVRABLE

> Monde M4 · 🆓 gratuit · P1.5 · **6 items carte + 2▲ DGR = 8 items** · Codes gelés Q3.4-01 → Q3.4-06 + Q3.4-T07 → T08
> Paires miroir : 2 paires R6 (1 par axe) + 2 items pivots — arithmétique 3/3 documentée, **À VALIDER PAR LE COMITÉ**
> **Les 2▲ sont des TRAMES SÉCURITÉ — aucun énoncé dans ce dépôt** (document trames hors dépôt, règle 11-b)
> Source : Constitution v2.1 [5] (« Ton rapport à l'argent ») · refonte (Ajout 1 — « la 1re cause de dispute conjugale documentée ») · mission V9.D

## 🧭 FICHE DE CADRAGE (lire avant tout le reste)

| Champ | Cadrage |
|---|---|
| **Ce que ça mesure** | Deux axes que la hiérarchie des buts (2.6) ne capte pas — le quotidien de l'argent (refonte verbatim) : **① dépensier ↔ économe** (le coup de cœur, l'épargne qui dort) et **② spontané ↔ calculé** (la comparaison à froid, la visibilité des comptes). **La dispute d'argent = 1re cause de dispute conjugale documentée** (refonte) — la distance dépensier/économe entre deux partenaires est un prédicteur de friction quotidien puissant. **Les 2▲ (impulsivité financière déguisée en habitudes)** : formulations franches, indiscernables (document trames hors dépôt). ⚠ **FINDING V9 (garde CI-10 v3)** : l'exemple de formulation donné par la mission pour T07 (« Je rembourse "plus tard" ce que je m'autorise "maintenant" ») est le verbatim de Q1.4-06, item EXISTANT de la quête 1.4 — T07 a reçu une formulation NEUVE (angle indépendant : le découvert habituel), divergence documentée au STATUS et au document trames (brûlage préventif — jamais poussée). B.3 : **production neuve déclarée** (axes et impulsivité financière cadrés au refonte, aucun texte d'item). |
| **Neutralité des profils** | Dépenser et économiser = **deux façons égales d'habiter un budget** ; le spontané et le calculé = **deux tempos**, ni l'un ni l'autre vertu ou défaut. La seule chose qui se documente au rendu, c'est la FRICTION de l'écart — jamais le profil comme problème. |
| **Format de réponse** | Likert 5 niveaux (Arbitrage 2) · D/I recodés `6 − r` (Arbitrage 1) · **2 paires miroir R6** (le coup de cœur · la comparaison) + 2 pivots (l'épargne qui dort · la visibilité des comptes) — arithmétique 3/3 documentée au 01, **À VALIDER PAR LE COMITÉ** · **les 2▲ : dimension null, orientation D, ancrage INTERDIT, aucun slot, aucune citation** (document trames Partie 0). |
| **Mélange** | RÉEL — graine **234427** (graine-mère 210427 + 1000 × ordinal 24, convention concaténée mission V9 — aucune collision active) · **outil DÉDIÉ melange-biaxes.py v2** — **c4 sans-objet par arithmétique** : les 2 trames ancrées en 4·8 laissent l'espace libre {1,2,3,5,6,7}, où 3 items d'un même axe ne peuvent tenir à distance ≥ 3 (span requis 7 > 6) — **minimum constructible 2 violations, atteint par l'outil** ; c1 stricte satisfaite (0 adjacence) ; run max 2 ; **5 passes identiques** (la reproductibilité de 3.2 re-vérifiée à l'identique après l'upgrade v2 de l'outil). |
| **Signatures attendues** | **SIG-3.4-01 « Le profil »** : 4 quadrants + central (dépensier×spontané · dépensier×calculé · économe×spontané · économe×calculé — bornes FM-019, À VALIDER PAR LE COMITÉ). **SIG-3.4-02 « La friction financière »** : écart dépensier × économe fort → signal conversationnel « à aborder tôt » — prédicteur de friction quotidien, jamais une pénalité dure. **SIG-3.4-03 DGR côté moteur** : les 2▲ alimentent **DGR** (dangerosité réactive — impulsivité × instabilité, code gelé du dictionnaire [4]) en **croisement moteur avec 1.4 (auto-contrôle) et 1.5 (épreuve du temps)** — le registre signaux.json anticipait « évaluation complète aux Mondes argent et tension » : cette quête EST l'étage argent — **jamais au rendu**. |
| **Slots prévus** | Miroir **MOYEN** (8 items → gabarit 150-250 mots, Constitution [7]) · 5 profils (4 quadrants + central, partition par axe le plus dévié — précédent 3.2). |
| **Points de doctrine** | ① L'argent se parle sans honte ni leçon : aucun profil n'est « responsable » ou « tête de linotte » au rendu. ② Les 2▲ passent parmi les autres (indiscernabilité) et leur score **ne se raconte JAMAIS** — ni miroir, ni carte, ni rappel, ni match, ni premium. ③ Gratuit ne présuppose jamais premium ([6]). ④ DGR et « impulsivité financière » restent côté moteur. |

## 📖 Lecture des fichiers (ordre conseillé)

1. `01-tableau-des-items.md` — les 6 énoncés carte (D/I, 2 axes) + les 2 lignes-réservées ▲.
2. `02-plan-de-melange-graine-234427.md` — l'ordre de passation RÉEL (outil dédié v2, minimums documentés) + finding c4.
3. `03-signatures-registre.md` — SIG-3.4-01/02 + SIG-3.4-03 (DGR, croisements 1.4 × 1.5).
4. `04-slots-de-miroir.md` — le miroir MOYEN et ses verrous (dont : aucune trame ne se raconte).
5. `05-ecran-d-intro.md` — l'écran d'entrée (ton, neutralité).
6. `06-fiche-computation-EXEMPLE.yaml` — l'item Q3.4-01 aux 5 canaux.
7. `07-miroir.md` — 5 profils respectés (4 quadrants + central), gabarit MOYEN.
8. `cartes.yaml` — 5 variantes de carte (étage 1, charte C1-C11).

## Cadrage moteur (moteur seul — jamais au rendu) — finding B.4d (audit : claim non sourcé)

- **Concepts publics** : les **attitudes envers l'argent** et les **comportements financiers**
  comme prédicteurs documentés de la dynamique de couple (l'argent est une source fréquente
  de tension — et un sujet dont la parlabilité protège).
- **Références** : **Dew** (l'argent et les relations — conflits financiers conjugaux) ;
  **Britt** (comportements financiers, achat compulsif et stress financier).
- **Verrou (précédent 5.6/5.7)** : les noms d'auteurs sont INTERDITS au rendu (05, 07,
  cartes, écrans) — ils ne vivent que dans le présent fichier et les fichiers moteur.
  Doctrine de citation : pattern harmonisé « cadrage moteur + verrou rendu » (Q8, audit —
  en attente de tranchage comité).

## Conformité a11y

Conformité a11y : WCAG 2.1 AA visée (contrastes ≥ 4,5:1, cibles tactiles ≥ 44×44 px, support lecteur d'écran, respect du mode réduit-animations). Implémentation : voir spec quête 1.1 §10 et styles.css.
