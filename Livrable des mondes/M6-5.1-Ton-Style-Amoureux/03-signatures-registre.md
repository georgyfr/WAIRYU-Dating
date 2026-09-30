# LIVRABLE 3 — SIGNATURES ATTENDUES DE LA QUÊTE 5.1 (format du registre)

> ⚠ **Seuils et pondérations : verrou [9]** — valeurs de production PROVISOIRES (marque mission :
> **« À VALIDER PAR LE COMITÉ »**, provisoire concepteur — re-signature professionnelle avant bêta, FM-019).
> La matrice des façons (SIG-5.1-02) est **[MOTEUR SEUL]** — JAMAIS au rendu, JAMAIS en UI,
> JAMAIS dans un score affiché (Constitution [3] ; précédent SIG-4.1-02 / SIG-4.4-06).

## Les variables fournies par la quête

| Variable | Source | Domaine |
|---|---|---|
| **EROS_D** | la passion (Q5.1-01 → 03, I recodés `6 − r`, normalisée) — haut = la façon dominante chez toi | 0-1 |
| **LUDUS_D** | le jeu (Q5.1-04 → 06, I recodés, normalisée) | 0-1 |
| **STORGE_D** | l'amitié devenue amour (Q5.1-07 → 09, I recodés, normalisée) | 0-1 |
| **PRAGMA_D** | le pragmatisme (Q5.1-10 → 12, I recodés, normalisée) | 0-1 |
| **MANIA_D** | l'intensité (Q5.1-13 → 15, I recodés, normalisée) | 0-1 |
| **AGAPE_D** | le don de soi (Q5.1-16 → 18, I recodés, normalisée) | 0-1 |

| ID | Nom | Conditions exactes | Conséquence | Source | Fenêtre cible |
|---|---|---|---|---|---|
| **SIG-5.1-01** | La façon dominante | **Cascade dominant/secondaire** (proposition — À VALIDER PAR LE COMITÉ [9]) : **dominant = max des six scores** · **quasi-égalité** (écart 1ᵉʳ-2ᵉ < 0.05) → départage par le pivot le mieux noté des deux styles, puis, à égalité exacte, par la 1ʳᵉ position de passation (précédent 5.3/5.7) · **bande 0.10** : si le secondaire est à ≤ 0.10 du dominant → « dominant + secondaire » nommés au rendu (le secondaire nuance le slot S2 et la tension, jamais un deuxième portrait) · au-delà de 0.10 → secondaire discret (une phrase au portrait de monde) · **étendue des six scores ≤ 0.10 → profil égalitaire/mixte** (7ᵉ brique — scores serrés) · départage au bord : l'étendue prime sur la bande | Rendu descriptif — **kit unique par profil dominant** (refonte : unités typologiques, pas de niveaux) ; le miroir (7 profils) et la carte rendent le kit du dominant ; six façons égales, aucune norme, zéro hiérarchie ; l'ombre = l'EXCÈS en couple, jamais la nature | 18 items Likert (6×3) | recalcul à chaque mise à jour ⚠ |
| **SIG-5.1-02** | La matrice des façons | **[MOTEUR SEUL]** — croisements styles × styles au moteur ; **cellules documentées (gelées V11)** : **Ludus×Mania = souffrance** (l'un joue, l'autre surveille) · **Agape×Ludus = exploitation** (l'un donne, l'autre prend) · **toutes les autres cellules : « À VALIDER PAR LE COMITÉ »** (aucune valeur de production) | Alimente le signal de compatibilité **côté moteur uniquement** — JAMAIS au rendu, JAMAIS en UI, JAMAIS au match affiché, JAMAIS aux portraits visibles (marque [MOTEUR SEUL] obligatoire sur toute occurrence) | 18 items Likert + matrice moteur | recalcul à chaque mise à jour ⚠ |
| **SIG-5.1-03** | Pré-signal intensité × JR1 | **ANTICIPÉ — NON CALCULÉ** : MANIA_D haut × JR1 (jalousie comportementale — bloc 5.4, trames jalousie T43-T46, hébergées en V12) ; **aucune donnée 5.4 n'existe dans cette quête** — le croisement est consigné comme ATTENDU, jamais calculé ici | À V12 : alimentera le portrait de domaine du CŒUR (M6+M7) **côté moteur** — jamais au rendu de 5.1, jamais à la carte | consigné (attente V12) | activation à la livraison 5.4 |

## Notes de registre

- **Neutralité typologique stricte — verrou capital** : l'ombre = l'EXCÈS de chaque façon, jamais
  sa nature ; aucune façon d'aimer supérieure ou inférieure ; le moteur classe un dominant, il ne
  mesure pas une « maturité amoureuse » (refonte : unités typologiques, pas de niveaux).
- **La matrice ne sort jamais** : Ludus×Mania et Agape×Ludus vivent au moteur (compatibilité
  signal) — aucun rendu, aucune UI, aucun match affiché ; les autres cellules n'existent pas
  en production tant que le comité ne les a pas entérinées.
- **SIG-5.1-03 est une attente, pas un calcul** : aucune donnée de la quête 5.4 (V12) n'est
  disponible dans cette passation ; la marque « ATTENDU — NON CALCULÉ » accompagne toute mention.
- **Zéro jargon rendu** : EROS_D → AGAPE_D, SIG-5.1-01/02/03 et les six noms d'atelier de la
  typologie restent moteur (nommage UI obligatoire au rendu : la passion, le jeu, l'amitié devenue
  amour, le pragmatisme, l'intensité, le don de soi).
- **Liaisons de domaine du CŒUR (attendues V12, sans calcul)** : 5.1×5.4 (façons d'aimer × postures
  de conflit) et 5.1×5.5 (façons d'aimer × expression de la tension) — à opérer au PORTRAIT DE
  DOMAINE (M6+M7), jamais dans un miroir de quête seul (Constitution [5]).
- **Registre probabiliste obligatoire** — « la recherche documente que », « conduit fréquemment à »,
  jamais le futur certain.
- SIG-5.1-01 est rejouée contre les portraits du Monde selon le protocole du Registre des
  Signatures ; SIG-5.1-02 (côté matrice) est rejouée hors dépôt.
