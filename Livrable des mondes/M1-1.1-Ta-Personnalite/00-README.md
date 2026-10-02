# QUÊTE 1.1 « TA PERSONNALITÉ » — LA PAGE DE LECTURE (1 page)

## À quoi sert cette quête

Première quête du voyage (M1 — Le Miroir, 🆓 gratuit). 58 affirmations à l'échelle Likert 5 dessinent
ton profil de personnalité sur 5 dimensions : **ouverture, organisation, énergie sociale, bienveillance,
stabilité émotionnelle**. Il en sort ta première carte (étage 1), ton premier miroir (étage 2) et les
5 variables O C E A S qui alimentent la suite du Monde 1, le Portrait de Domaine du soi (M1+M2) et le
Portrait Intégral. Huit affirmations ressemblent aux autres et n'en sont pas : elles alimentent la
boussole de sécurité de l'app — invisible pour toujours. Jamais à toi, jamais au match, jamais dans
les portraits.

## Comment lire les fichiers

| Fichier | Ce que tu y trouves |
|---|---|
| `README.md` | Vue d'ensemble + déclaration de conformité |
| `01-tableau-des-items.md` | Les 58 items verbatim, un par ligne, avec leur fiche de computation à 5 canaux (C:/S:/F:/M:/A:) ; les 8 lignes-réservées de trame (aucun contenu) ; les 2 doublons fiabilité ; les dérives documentées |
| `02-plan-de-melange-graine-211427.md` | L'ordre de passation réel (1→58), la graine, l'algorithme, les verdicts des 6 contraintes, la trace des échanges |
| `03-signatures-registre.md` | Les règles du moteur qui consomment O C E A S — conditions verbatim du registre gelé, toutes ADOPTÉES comme valeurs de départ (FM-019) — provisoire concepteur |
| `04-slots-de-miroir.md` | Les 4 slots du miroir de quête + les 9 verrous de slot |
| `05-ecran-d-intro.md` | Le texte d'ouverture verbatim + ses contrôles |
| `06-fiche-computation-EXEMPLE.yaml` | Le format complet d'une fiche item (exemple : Q1.1-17) — gabarit des 58 |
| `07-miroir.md` | Le miroir de quête (étage 2) — gabarit LOURD 300-450 mots, 20 briques-variantes, angles d'ombre imposés — créé VAGUE 4 |
| `cartes.yaml` | Les 7 variantes de carte (sélecteurs + textes verbatim du source) |

## Le flux : items → mélange → passation → scoring → miroir

1. **ITEMS** — 58 codes gelés : `Q1.1-01→50` (carte, 5 dimensions × 10) + `Q1.1-T01→T08` (trame DTM_N,
   lignes-réservées). À côté : 2 doublons fiabilité (`02.r`, `11.r`), présentés ≥ 2 semaines après
   l'original, **hors comptage du contrat**.
2. **MÉLANGE** — graine **211427**, fisher-yates-seede + réparation déterministe (outil
   `ci/outils/melange.py`). 6 contraintes rejouées par l'outil : **6/6 PASS**, run max 2. L'ordre de
   passation n'est JAMAIS l'ordre des codes.
3. **PASSATION** — l'utilisateur voit les 58 affirmations dans l'ordre du plan. Les 8 trames sont
   réparties aux positions 7 · 14 · 21 · 28 · 35 · 42 · 50 · 58 et passent inaperçues parmi les autres.
4. **SCORING** — 5 échelles 0-1 (moyenne par dimension ; inversés recodés `6 − r`) · QFI (fiabilité :
   doublons + temps + cohérence) · DTM_N **côté moteur uniquement** (trame, jamais rendue).
5. **MIROIR** — carte de quête (sélecteurs V1→V7, `cartes.yaml`) · miroir LOURD 300-450 mots (58 ≥ 15,
   Constitution [7]) · slots S1→S4 · signatures du registre Monde 1 (garde universelle QFI ≥ 0.60).

## Deux règles de sécurité à connaître avant d'ouvrir les autres fichiers

- **Les 8 trames = lignes-réservées.** Leur contenu n'est dans AUCUN fichier du dépôt (doctrine de
  brûlage — FM-018 · Constitution [11-b]). Le document trames vit hors dépôt et n'est remis qu'au
  moment de l'implémentation, par canal privé.
- **Aucun code, score ou sigle ne franchit un texte rendu** (Constitution [3]). Toute citation d'une
  réponse se fait par rappel en toutes lettres de l'énoncé ; l'`ancre_item` reste un champ moteur.

## Cadrage scientifique (moteur seul — jamais au rendu) — finding B.1e (audit)

- **Concept public** : le modèle des **Big Five** — les cinq grands facteurs de la
  personnalité (ouverture · conscience · extraversion · agréabilité · stabilité émotionnelle),
  structure circulaire et dimensionnelle, aucun facteur n'étant un verdict.
- **Références** : **Goldberg** (1992 — marque « Big Five ») ; l'inventaire **IPIP**
  (International Personality Item Pool — domaine public), dont les items de la quête
  s'inspirent structurellement.
- **Verrou (précédent 5.6/5.7)** : les noms d'auteurs et la marque du modèle sont INTERDITS au
  rendu (05, 07, cartes, écrans) — ils ne vivent que dans le présent fichier et les fichiers
  moteur. Doctrine de citation : pattern harmonisé « cadrage moteur + verrou rendu » (Q8,
  audit — en attente de tranchage comité).

## Conformité a11y

Conformité a11y : WCAG 2.1 AA visée (contrastes ≥ 4,5:1, cibles tactiles ≥ 44×44 px, support lecteur d'écran, respect du mode réduit-animations). Implémentation : voir spec quête 1.1 §10 et styles.css.
