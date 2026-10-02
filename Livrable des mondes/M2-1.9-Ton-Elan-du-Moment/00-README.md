# QUÊTE 1.9 « TON ÉLAN DU MOMENT » — FICHE DE CADRAGE PUIS LECTURE DU LIVRABLE

> Monde M2 · 🆓 gratuit · Socle · MVP · **8 items Likert · ÉTAT du moment — JAMAIS DANS LE SCORE**
> Codes gelés Q1.9-01 → Q1.9-08 · Ré-évaluable tous les 30 jours · nourrit l'expérience et la rétention, pas le matching
> Source : Constitution v2.1 [5] (« M2 LE VOLANT … 1.9 Ton élan du moment (8) ») · Contrat d'Inventaire · FM-011 v2

## 🧭 FICHE DE CADRAGE (lire avant tout le reste)

| Champ | Cadrage |
|---|---|
| **Ce que ça mesure** | L'ÉLAN DU MOMENT : l'état actuel de trois besoins psychologiques de base (concepts publics — théorie de l'autodétermination : autonomie, compétence, affiliation) ; énoncés 100 % originaux Wairyu. **Un état, pas un trait** : ce que la personne vit ces derniers jours, pas ce qu'elle est. |
| **Règle absolue** | Cette quête **n'entre JAMAIS dans aucun score de matching**, jamais dans aucune compatibilité, jamais dans aucun classement. Elle nourrit l'expérience (rythme doux de l'app, flux rétention interne) et l'auto-connaissance. Toute fiche, tout gabarit, tout croisement porte cette interdiction ; la violation serait une violation de doctrine ([2] — la trame de l'app décrit, elle ne trie pas les gens par leur fatigue). |
| **Format de réponse** | Likert 5 niveaux (Arbitrage 2) · Orientation D = direct, I = inversé recodé `6 − réponse` (Arbitrage 1) · **8 items au total, 5 D + 3 I, sans paire miroir stricte** (voir « État ≠ trait » ci-dessous) · autonomie (01-03) · compétence (04-06) · affiliation (07-08). |
| **État ≠ trait (pas de paires R6)** | Les paires miroir symétriques (règle R6) servent à fiabiliser des TRAITS stables. Un état subjectif du moment ne supporte pas ce traitement : la symétrie stricte produirait des divergences bancales (l'humeur du jour répond différemment au direct et à l'inversé) sans qu'elles signifient une réponse inattentive. La fiabilité passe donc par **deux autres canaux** : ① le **temps de réponse** (drapeau QFI — passation trop rapide), ② la **ré-administration à 30 jours** (concordance des deux états → fiabilité longitudinale). Choix de conception documenté — À VALIDER PAR LE COMITÉ. |
| **Ré-administration (30 jours)** | L'état se re-passe au plus tôt **30 jours** après la dernière passation (à la demande du membre, plus relance douce du flux rétention interne). Jamais deux passations avant ce délai : on mesure une météo, pas ses oscillations. |
| **Mélange** | RÉEL — graine **219427** (graine-mère 210427 + 1000 × ordinal 9) · Fisher-Yates seedé + réparation déterministe · verdicts c1-c6 rejoués par l'outil (`ci/outils/melange.py`) · c4 sans-objet déclaré pour cette quête (justification arithmétique au fichier 02, trace de la course conservée). |
| **Signatures attendues** | **SIG_ÉLAN_FAIBLE** (≥ 2 besoins bas → rythme doux de l'app — flux rétention interne, **JAMAIS score, JAMAIS matching**) · variables des degrés d'élan (faible / central / élevé, bornes reprises de FM-019 — provisoire concepteur). |
| **Slots prévus** | Miroir **LÉGER** (8 items → gabarit 80-150 mots, Constitution [7]) · 3 profils (élan haut / mixte / bas) · le profil bas porte un **encadré ressources** (esprit REN : ressources, jamais d'alarme — voir 07 §2 et ses garde-fous). |
| **Points de doctrine** | ① Zéro diagnostic, zéro pathologisation : un élan bas est un état, pas une défaillance — l'encadré ressources n'a aucun vocabulaire clinique. ② Aucune normativité : aucun « tu devrais avoir plus d'élan ». ③ Le flux rétention ne se raconte jamais : la personne voit un rythme doux, jamais un « système qui s'adapte à ta faiblesse ». ④ Gratuit ne présuppose jamais premium ([6]). ⑤ La carte 1.9 est UNIQUE (état du moment, pas un portrait) — exception documentée à cartes.yaml. |

## 📖 Lecture des fichiers (ordre conseillé)

1. `01-tableau-des-items.md` — les 8 énoncés (D/I, besoins, fiches condensées).
2. `02-plan-de-melange-graine-219427.md` — l'ordre de passation RÉEL (verdicts c1-c6 rejoués).
3. `03-signatures-registre.md` — SIG_ÉLAN_FAIBLE + variables + interdictions de flux.
4. `04-slots-de-miroir.md` — le miroir LÉGER et ses verrous.
5. `05-ecran-d-intro.md` — l'écran d'entrée (verbatim contrat).
6. `06-fiche-computation-EXEMPLE.yaml` — l'item Q1.9-01 aux 5 canaux.
7. `07-miroir.md` — 3 profils + l'encadré ressources du profil bas.
8. `cartes.yaml` — la carte unique « La Météo du moment » (format clarté 40-70).

## Cadrage scientifique (moteur seul — jamais au rendu) — finding B.1e (audit)

- **Concept public** : la **théorie de l'autodétermination** — les besoins psychologiques
  fondamentaux (autonomie · compétence · relation) et la motivation intrinsèque ; « l'élan
  du moment » mesure un état motivant contextualisé, jamais un trait figé.
- **Références** : **Deci & Ryan** (Self-Determination Theory).
- **⚠ Avertissement de sigle** : le sigle historique « SDT » du dépôt désigne le Dark Triad
  Manipulative (renommé DTM — registre signaux.json), JAMAIS cette théorie.
- **Verrou (précédent 5.6/5.7)** : les noms d'auteurs sont INTERDITS au rendu (05, 07,
  cartes, écrans) — ils ne vivent que dans le présent fichier et les fichiers moteur.
  Doctrine de citation : pattern harmonisé « cadrage moteur + verrou rendu » (Q8, audit —
  en attente de tranchage comité).

## Conformité a11y

Conformité a11y : WCAG 2.1 AA visée (contrastes ≥ 4,5:1, cibles tactiles ≥ 44×44 px, support lecteur d'écran, respect du mode réduit-animations). Implémentation : voir spec quête 1.1 §10 et styles.css.
