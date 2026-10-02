# 00 — FICHE DE CADRAGE DE PRODUCTION

> À lire avant tout fichier du dossier. Restitution d'ouverture [10] + cadrage technique de la quête.
> Source de vérité : `ddocumentation/refonte des tests et outils wairyu.md` (source gelé) — PARTIE 7, l. 2498-2510 (quête) · PARTIE 7 charte, l. 3298-3333 (écrans spéciaux, sans carte).

## Restitution [10] (5 lignes)

- **Élément** : quête 1.7 « Ton fonctionnement (optionnel) » — 2 questions déclaratives opt-in
  (checklist multi-choix + un-clic de visibilité), sans score, sans carte, sans miroir.
- **Monde** : M2 — Le Volant (codes Q1.7 — monde = métadonnée, FM-011 v2) · Domaine du Soi (M1+M2).
- **Statut freemium** : 🆓 gratuit, opt-in explicite — la quête entière est un consentement.
- **Contraintes principales** : questions et options VERBATIM · ordre fixe 01→02 (séquence de
  consentement, sans mélange) · AUCUN signal de sécurité · aucun score · miroir EXEMPTÉ · écran
  final spécial (charte PARTIE 7, pas de carte, pas de partage).
- **Ambiguïtés détectées** : ① l'exemption de miroir s'appuie sur la lecture « fonctionnalité » de
  [7] — ratification comité ; ② « eux-mêmes déclarés via Q1.7-02 inversé » (verbatim usage moteur) :
  la lecture retenue est le double consentement (cochée × « Oui, affiche-le ») — note au fichier `03` ;
  ③ la donnée est révocable par design (modifiable/effaçable à tout moment, verbatim) — le régime de
  rétention/effacement est hors périmètre de production (comité/juridique).

## Cadrage fiche

| Élément | Valeur |
|---|---|
| Dimensions | **aucune** — quête hors score : rien n'alimente une échelle, un pôle ou un profil calculé |
| Format | **checklist multi-choix** (Q1.7-01) + **un-clic binaire** (Q1.7-02) — hors Likert, design verbatim du source (dérogation à l'Arbitrage 2 documentée) |
| Trames ▲ | **aucune** |
| Signatures | **aucune** — usage moteur = filtre d'affinité d'inclusion + réinitialisation des seuils des détecteurs (seuils : document trames, hors dépôt) |
| Carte | **aucune** — écran spécial de fin de quête (charte PARTIE 7 : « écran de confiance, PAS de carte, PAS de partage ») |
| Miroir | **EXEMPTÉ** (Constitution [7]) — justification au fichier `04` |
| Consentement | opt-in strict : « si tu le souhaites » (verbatim intro) · « Je ne souhaite pas le dire » = option de première classe · modification/effacement à tout moment |

## Table de fichiers intégrale (mission Phases A/B/C/D, point 2)

| Fichier | Contenu | Qui le lit |
|---|---|---|
| `00-README.md` | cette fiche de cadrage + table de fichiers | tout le monde |
| `README.md` | vue d'ensemble + déclaration de conformité | tout le monde |
| `01-tableau-des-items.md` | les 2 questions opt-in verbatim + leurs options + usage moteur | production + implémenteur |
| `02-plan-de-passage.md` | le plan de passage (SANS mélange — ordre source fixe) + finding borne de run sans objet | production + recette |
| `03-signatures-registre.md` | AUCUNE signature — le fichier documente l'usage moteur et les garde-fous | moteur |
| `04-slots-de-miroir.md` | l'EXEMPTION de miroir justifiée (Constitution [7]) | rendu |
| `05-ecran-d-intro.md` | le texte d'ouverture verbatim | rendu |
| `06-fiche-computation-EXEMPLE.yaml` | le format d'une fiche item, exemplifié (hors score) | moteur |
| `cartes.yaml` | l'écran spécial de fin de quête (SANS carte, SANS partage — charte PARTIE 7, verbatim) | rendu |
| `07-miroir.md` | **ABSENT PAR DESIGN** — miroir EXEMPTÉ pour cette quête (exemption documentée au `04` et dans le cadrage ci-dessus) | — (exempté) |

## Interdits rappelés à la production

- Aucun seuil de signature de sécurité au dépôt (FM-018 / [11-b]) — la réinitialisation des seuils
  des détecteurs est documentée comme mécanisme, JAMAIS avec ses valeurs.
- Constitution [2] : pas de diagnostic, jamais — l'app ne qualifie personne ; la personne coche des
  mots pour se décrire, et peut ne rien cocher.
- Constitution [3] : aucun code/score/sigle rendu ; tutoiement ; phrases ≤ 22 mots dans les textes rendus.
- Verrou [9] : produire, ne pas décider — ratifications marquées « À VALIDER PAR LE COMITÉ ».

## Conformité a11y

Conformité a11y : WCAG 2.1 AA visée selon le format de la quête (contrastes ≥ 4,5:1, cibles tactiles ≥ 44×44 px, support lecteur d'écran, respect du mode réduit-animations). Implémentation : voir spec quête 1.1 §10 et styles.css.
