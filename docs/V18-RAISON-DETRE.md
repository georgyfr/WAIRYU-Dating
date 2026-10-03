# MISSION V18 — « TA RAISON D'ÊTRE ICI »

> Inversion architecturale (demande fondateur, Mission V18) :
>
> **AVANT** : une app de rencontre avec un parcours de connaissance de soi.
> **APRÈS** : un parcours de connaissance de soi dont la rencontre est une
> **destination optionnelle**.
>
> Tout le monde (majeur, célibataire) peut faire le parcours — personne n'est
> jamais poussé vers la rencontre. La rencontre s'ouvre **seulement sur
> décision explicite**, elle est **bidirectionnelle** et **réversible à
> l'infini**. Les voyageurs solo reçoivent l'expérience **complète** : les
> 11 mondes, les portraits, le carnet, les cartes, l'énergie, le parrainage.

---

## 1. Le champ `raison` (V18.A)

| Valeur | Signification | Découverte |
|--------|---------------|------------|
| `voyage` | 🪞 Le parcours d'abord (11 mondes, portraits, carnet). | **Jamais visible.** |
| `rencontre` | 💞 La rencontre est ouverte (bassin + pipeline complets). | Visible (selon les filtres). |
| `indecis` | ⏸️ État par défaut — l'app ne présume rien. | **Jamais visible.** |

- **Stockage** : `users.raison TEXT NOT NULL DEFAULT 'indecis'` + `raison_updated_at`,
  `raison_activation`, `raison_asked_at`, `raison_pause_reason`
  (migration **0024_v18_raison.sql** — append-only, ALTER TABLE ADD COLUMN uniquement,
  zéro donnée existante modifiée).
- **CHECK SQL (verrou V18.D)** : `CHECK (raison IN ('voyage','rencontre','indecis'))`.
- **Écran de choix (A.2)** : première étape de l'assistant profil, AVANT toute autre
  question (après la vérification 18+). Trois cartes **visuellement équivalentes** —
  même style, même accent de sélection, aucune hiérarchie. Modifiable à tout moment.
- **Confidentialité immédiate (A.4)** : orientation, intention et « personnes montrées »
  ne sont **rendues ni demandées** que pour `raison='rencontre'`. Double rideau :
  le front ne construit pas les étapes (par construction) et l'API **refuse** les
  écritures d'orientation/intention/préférences hors bassin rencontre
  (appel forgé compris).

### ⚠️ couple_travail — RÉSERVÉ, JAMAIS câblé

Le statut réservé **couple_travail** (Monde couple) est **volontairement absent** du
type partagé, de `RAISONS`, du validateur et du CHECK SQL. Il est **impossible à
écrire** (l'API et la base le rejetaient). Le câbler exigera une décision explicite
et une migration dédiée — périmètre **P3+ SUR CADRAGE**. Testé : `ci/test_v18_raison.py` T-1b/T-1g.

---

## 2. Bascule bidirectionnelle réversible (V18.B)

- **B.1 — La proposition** : à l'écran de fin du questionnaire (le seul endroit),
  si `raison ≠ 'rencontre'`, l'app peut poser **une fois par palier** :
  *« Et si tu ouvrais la rencontre ? »* — trois réponses égales :
  **Oui, ouvrir la rencontre** · **Pas maintenant** (plus AUCUNE relance
  automatique) · **Me le redemander plus tard** (reproposée seulement si de
  nouvelles réponses doctrine sont intervenues). Jamais de spam, jamais
  d'auto-conversion.
- **B.2 — Après « Oui »** (`#/activer-rencontre`) : ① ton orientation + tu
  cherches (hommes/femmes/les deux — bi et gay sont des orientations pleinement
  légitimes, jamais des choix dégradés) + ton intention · ② fenêtre d'âge ·
  ③ proximité · ④ récapitulatif honnête des quêtes M3 déjà posées (2.5/2.3/2.4)
  — complétées dans le carnet, jamais re-demandées ici.
- **B.3 — La pause (rencontre → voyage)** : invisible dans la découverte, mais
  **conversations, matchs et messages sont TOUS conservés** (aucun DELETE —
  testé T-3). Le motif libre (≤ 300 car.) reste dans le profil.
- **B.4 — Réactivation (voyage → rencontre)** : un clic si la configuration de
  recherche existe déjà, sinon passage par la séquence B.2. Les deux sens sont
  illimités (aucun compteur).
- **B.6 — Le profil** : la carte **« Ta raison d'être ici »** est TOUJOURS
  visible en tête de « Mon profil », avec les boutons de bascule dans les deux sens.

---

## 3. Q2.5 quitte le Socle (V18.C)

- Le choix de l'intention de rencontre n'est **plus l'aboutissement du Socle** :
  l'intention est confirmée par la séquence B.2 ④ et la quête 2.5 reste dans
  l'ordre de son monde (M3), au cœur du parcours.
- **Les 3 items Q2.5-01/02/03 restent dans la banque doctrine**, énoncés
  STRICTEMENT intacts (testé T-7c), la 4ᵉ réponse « Je découvre » reste au
  contrat. Aucune donnée bêta n'est touchée : les réponses restent dans
  `q_doctrine_answers` (aucun DELETE, aucune réécriture).
- Le dealbreaker 2.5 côté moteur est inchangé.
- **La raison ne participe JAMAIS au matching** — filtre dur de bassin
  uniquement, jamais un score, jamais une pondération.

---

## 4. Les verrous doctrinaux (V18.D — `ci/test_v18_raison.py`, 23 vérifications)

| Verrou | Garantie | Preuve machine |
|--------|----------|----------------|
| **D.1** | Les profils voyage/indecis ne sont **jamais retournés** par la découverte (pool + radar + garde d'appel forgé). | T-1c/T-1d/T-4 (clause du dépôt appliquée telle quelle en sqlite). |
| **D.2** | Profondeur de test **identique** pour les 3 raisons — 531 items, aucune « version allégée ». | T-5a/T-5b/T-5c (replay 0021+0022). |
| **D.3** | L'orientation n'est **jamais rendue** hors rencontre — par construction (étapes inexistantes) + refus API (2ᵉ rideau). | T-1e/T-1f/T-1g. |
| **D.4** | Métriques de conversion **collectées mais jamais consommées** par le moteur — aucune optimisation au détriment du parcours. | T-6a/T-6b (`metrics_daily` absent de discovery/matching/personnalité). |

Red lines vérifiées (T-7) : pas d'auto-conversion · la proposition ne vit qu'à
l'écran de fin, au plus 1 fois/palier · énoncés des quêtes intouchés · la
doctrine 2.5 reste entière.

---

## 5. Contrat API (résumé)

| Endpoint | Changement V18 |
|----------|----------------|
| `GET /api/me` | + `raison` (défaut `indecis`). |
| `GET /api/profile` | + `raison`, `raisonUpdatedAt`, `raisonActivation`, `raisonPauseReason`. |
| `PUT /api/profile` | + `raison`, `raisonPauseReason` (pause). Refus orientation/intention si raison ≠ `rencontre`. |
| `PUT /api/profile/preferences` | Refus hors bassin `rencontre`. |
| `GET /api/qd` | + `raison`, `activation.eligible` — la banque reste entière (D.2). |
| `PUT /api/qd/answers/:code` | + `activationEligible` (recalcul après palier). |
| `POST /api/qd/activation` | **Nouveau** — `{answer:'oui'|'pas_maintenant'|'plus_tard'}`, décision explicite, anti-spam par palier. |
| Feed / radar (interne) | Pool filtré `raison = 'rencontre'` — verrou D.1. |

`isProfileComplete` est raison-aware : orientation/intention/préférences ne sont
requises **que** pour `raison='rencontre'` — un voyageur peut avoir un profil
complet sans jamais déclarer d'orientation.

Navigation : hors `rencontre`, la barre passe en mode **Voyage** (📖 Carnet ·
💬 Messages · 👤 Profil) — aucun onglet de rencontre ; l'accueil d'un non-
rencontre est le carnet, jamais la découverte.

## 6. Garde-fous conservés

CI 17/17 · harnais P0 12/12 · garde étendue VERT · a11y smoke VERT · tsc 0 —
re-certifiés au commit V18. Append-only : aucune donnée ni écran historique
supprimé ; les comptes existants passent à `indecis` (l'app ne présume rien)
et restent maîtres de leur choix en un clic.
