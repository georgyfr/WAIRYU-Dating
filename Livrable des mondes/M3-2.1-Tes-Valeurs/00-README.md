# QUÊTE 2.1 « TES VALEURS » — GUIDE DE LECTURE (1 page)

## À quoi sert cette quête

La quête 2.1 mesure les **10 valeurs universelles** de l'utilisateur (théorie des valeurs humaines,
concept public — items 100 % Wairyu) : ce qui guide ses choix, ce qui lui tient à cœur, ce qui le
fait tenir dans la durée. Elle alimente la **Carte** (« Ta boussole en 10 valeurs »), le **Miroir de quête** (lourd,
300-450 mots) et, au-delà, les Portraits. Elle porte aussi **4 items de trame sécurité** (signal
DTM_N) dont les énoncés vivent hors dépôt — voir plus bas.

## Comment lire les fichiers

| Fichier | Contenu | Qui le lit |
|---|---|---|
| `README.md` | vue d'ensemble + déclaration de conformité | tout le monde |
| `01-tableau-des-24-items.md` | les 20 items carte + les 4 slots de sécurité (énoncés hors dépôt) | production + implémenteur |
| `02-plan-de-melange-graine-210427.md` | l'ordre de passation (graine 210427, passe ⑤ FM-015, run max 2) | production + recette |
| `03-signatures-registre.md` | les 4 signatures SIG-2.1-01 → 04 (seuils ADOPTÉS comme valeurs de départ, FM-019 — provisoire concepteur ; T1 consigné hors dépôt) | moteur |
| `04-slots-de-miroir.md` | les 4 slots de rendu S1 → S4 + les 9 verrous de slot | rendu |
| `05-ecran-d-intro.md` | l'écran d'entrée de la quête | rendu |
| `06-fiche-computation-Q2.1-17.yaml` | le format de fiche de computation (5 canaux), exemplifié | moteur |

## Le flux de production

```
items (01) ──► plan de mélange (02, graine 210427) ──► passation (l'ordre du 02)
     │                                                        │
     ▼                                                        ▼
scoring (fiches de computation) ──► signatures (03) ──► slots de miroir (04) ──► rendu
```

1. Les items sont répondues dans l'ordre du plan de mélange — jamais l'ordre des codes.
2. Le scoring applique les arbitrages : Likert 5 (②) · inversés recodés `6 − réponse` (①).
3. La cohérence miroir R6 compare chaque paire (D, I) — écart ≥ 3 → drapeau fiabilité (SIG-2.1-02).
4. Les 4 blocs (ouverture / affirmation / conservation / dépassement) nourrissent SIG-2.1-01.
5. Les 4 trames ▲ alimentent DTM_N côté MOTEUR SEUL — aucun slot, aucune carte, aucun rappel.

## Point de sécurité (important)

Les énoncés des items Q2.1-21 à 24 ne figurent dans AUCUN fichier poussé : ils vivent dans le
document trames, fourni à l'implémenteur par canal privé au moment de l'intégration
(FM-018 / Constitution [11-b] — doctrine de brûlage). Ce dépôt reste volontairement aveugle.
