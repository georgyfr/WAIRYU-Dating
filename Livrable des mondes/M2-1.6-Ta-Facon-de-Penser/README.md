# QUÊTE 1.6 « TA FAÇON DE PENSER » — LIVRABLES DE PRODUCTION

> **Monde** : M2 — Le Volant · **Statut** : 🆓 gratuit · **Catégorie** : Socle · **Phase** : MVP
> **Domaine** : DOMAINE DU SOI (les liaisons M1×M2 vivent au Portrait de Domaine, jamais ici)
> **Items** : 7 items déclaratifs Likert (mono-dimension `traitement`) + **3 énigmes de performance** ⚡ (Q1.6-É1/É2/É3)
> **Plage de codes gelée** : Q1.6-01 → Q1.6-07 + Q1.6-É1, Q1.6-É2, Q1.6-É3 (+ doublon longitudinal `Q1.6-05.r`)
> **Cadre** : Constitution v2.1 · source gelé PARTIE 6 (l. 2467-2496) · charte des cartes PARTIE 6 (l. 3194-3298)
> ⚠ **Codes Q1.6 vivent au M2** : le code reste la clé, le monde est une métadonnée (FM-011 v2).

## 📁 Contenu du livrable (9 fichiers)

| Fichier | Livrable |
|---|---|
| `00-README.md` | Fiche de cadrage de production : restitution [10], cadrage (dimensions/format/signatures/slots), ambiguïtés signalées |
| `01-tableau-des-items.md` | Les 7 items VERBATIM + **les 3 énigmes ENTIÈRES** (énoncé, réponse intuitive, réponse correcte, statut juridique VERBATIM) + scoring + doublon |
| `02-plan-de-melange-graine-216427.md` | Plan de mélange : graine 216427, ordre réel des 7 items, 6 verdicts réels — **les 3 énigmes sont HORS contrat de mélange** |
| `03-signatures-registre.md` | SIG_ECART_POLE (pénalité écart de pôle) · SIG_STANDARD_PROJETE / SIG_CALME_VERROU (consomment POL) — format du registre |
| `04-slots-de-miroir.md` | Slots de miroir — 7 items + 3 énigmes = 10 blocs → gabarit MOYEN 150-250 mots (Constitution [7]) |
| `05-ecran-d-intro.md` | Écran d'intro (texte VERBATIM du source, contrôles de conformité) |
| `06-fiche-computation-EXEMPLE.yaml` | Fiche de computation complète de Q1.6-05 (D) — modèle des 5 canaux, YAML |
| `cartes.yaml` | Les 5 variantes de carte (sélecteur D×E + textes VERBATIM, charte PARTIE 6) |

## ✅ Déclaration de conformité (interdits absolus)

| Interdit absolu | Statut |
|---|---|
| Dimensions non listées | ✅ une seule pour les items : `traitement` — les énigmes sont des items de performance, hors échelle |
| Items non demandés | ✅ 7 items + 3 énigmes exactement, textes VERBATIM du source gelé |
| Formulations de trame au dépôt (FM-018 / [11-b]) | ✅ aucune trame dans la quête — les énigmes É1/É2 portent le statut « ✅ Composée Wairyu », É3 « folklore séculaire » avec note juridique documentée (verbatim) |
| Sigle hors glossaire en UI | ✅ POL / SIG_ECART_POLE : côté moteur uniquement, jamais rendus à l'utilisateur |
| Verrous [9] traités comme décisions | ✅ pénalité d'écart de pôle (0.70), fenêtre de temps (< 15 s), seuils de sélection D×E : tout est marqué **« À VALIDER PAR LE COMITÉ »** |
| Codes/scores/sigles rendus à l'utilisateur [3] | ✅ aucun — rappels en toutes lettres ; le temps de réponse aux énigmes n'est JAMAIS rendu en secondes |

## ⚠️ Points en attente de validation comité

- **Pénalité d'écart de pôle 0.70** (SIG_ECART_POLE, matching) : proposition du registre — ADOPTÉE comme valeur de départ (FM-019) : provisoire concepteur — re-signature professionnelle avant bêta.
- **Fenêtre « réponse intuitive < 15 s »** (captation du temps aux énigmes) : ADOPTÉE comme valeur de départ (FM-019) — provisoire concepteur — re-signature professionnelle avant bêta.
- Seuils du sélecteur de carte (D ≥ 0.60 / < 0.40 ; E ≥ 2/3 / ≤ 1/3) : propositions du source gelé — À VALIDER.
- Conditions de SIG_STANDARD_PROJETE (C > 0.75 ET A > 0.60 ET POL > 0.60) et SIG_CALME_VERROU (S > 0.65 ET POL > 0.65) : ADOPTÉES comme valeurs de départ (FM-019) — provisoire concepteur — re-signature professionnelle avant bêta.
- **Items de performance hors contrat de mélange** (énigmes en ordre source É1→É2→É3) : cette absence de contrat est documentée — Fiche de Mutation future demandée (FM).
- **Tension documentaire signalée** : le doublon `Q1.6-05.r` (trame fiabilité) — énoncé reproduit sur instruction de mission, frontière [11-b] à arbitrer par le comité.
- Statut juridique de Q1.6-É3 (énigme de marine, folklore séculaire, auteur non identifiable) : note verbatim conservée — revue juridique périodique recommandée.

## 🔁 Circuit restant

Production (fait) → **validateur (linter)** → **auditeur hostile C1 (session séparée)** → **gouvernance D1**.
