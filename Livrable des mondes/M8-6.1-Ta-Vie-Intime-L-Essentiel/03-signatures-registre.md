# LIVRABLE 3 — SIGNATURES ATTENDUES DE LA QUÊTE 6.1 (format du registre)

> ⚠ **Seuils et pondérations : verrou [9]** — valeurs de production PROVISOIRES (marque mission :
> **« À VALIDER PAR LE COMITÉ »**, provisoire concepteur — re-signature professionnelle avant bêta, FM-019).
> SIG-6.1-02 (modératrice) et SIG-6.1-03 (CMP) sont **[MOTEUR SEUL]** — JAMAIS au rendu, JAMAIS en UI,
> JAMAIS dans un score affiché (Constitution [3] ; précédents SIG-5.1-02 / SIG-5.4-02/03/04).
> SIG-6.1-01 est le **premier signal semi-visible à seuil du domaine de l'Intime** : il sort **aux DEUX membres
> du match** (règle 4 du bloc — jamais à un tiers), au registre probabiliste, sans blâme.

## Les variables fournies par la quête

| Variable | Source | Domaine |
|---|---|---|
| **DES_D** | le désir et son importance (Q6.1-01 → 03, I recodés `6 − r`, normalisée) — haut = le désir compte beaucoup chez toi | 0-1 |
| **INT_D** | l'intention intime (Q6.1-04 → 06, I recodés, normalisée) — haut = l'intimité dans un cadre construit ; bas = la légèreté assumée | 0-1 |
| **COM_D** | l'aisance à en parler (Q6.1-07 → 10, I recodés, normalisée) — haut = la parole circule | 0-1 |
| **CMP (signal)** | les 2▲ Q6.1-T51 → T52 — compulsion intime (dictionnaire [4]) — MOTEUR SEUL | binaire/score moteur |
| **SER_D** | la sérénité (sous-module Q6.1-S01 → S04, bloc fixe hors mélange) — haut = serein ; signal interne | 0-1 |

| ID | Nom | Conditions exactes | Conséquence | Source | Fenêtre cible |
|---|---|---|---|---|---|
| **SIG-6.1-01** | L'écart de désir — le dealbreaker à seuil | **Signal croisé** : écart de désir entre les deux membres d'un match **|DES_A − DES_B| > 0.7** (scores normalisés) → signal « à aborder tôt » rendu **aux DEUX membres** du match, au registre probabiliste, **sans blâme** (gelé mission : « vos rythmes diffèrent — l'un des sujets les plus documentés des couples, qui se travaille quand on en parle tôt ») · **seuil 0.7 : COMITÉ, jamais arbitraire** — À VALIDER PAR LE COMITÉ · le signal ne juge **aucun niveau** (règle 4 du bloc) : deux assumés qui divergent ne produisent aucun verdict sur l'un ni sur l'autre · **inclusion structurelle** : un asexuel assumé × un libido-forte assumé = une incompatibilité à éliminer tôt, dignement — jamais un écart à pénaliser ; l'auto-déclaration d'identité (monde 6.5, futur) prime sur toute lecture du score | Signal semi-visible aux deux membres (« à aborder tôt ») — JAMAIS à un tiers, JAMAIS en penalty sur une personne seule, JAMAIS au rendu du miroir de quête (le miroir raconte le profil, pas le match) | DES_A × DES_B (6 items desir au total) | recalcul à chaque mise à jour de l'un des deux profils ⚠ |
| **SIG-6.1-02** | La communication comme modératrice | **[MOTEUR SEUL]** — **terme d'interaction** : l'effet de l'écart de désir sur la viabilité du match est modulé par le niveau de communication du couple (COM_A × COM_B) — **une bonne communication compense des écarts modérés** ; l'effet d'interaction n'existe pas en tant que texte : il module le calcul de compatibilité · forme proposée : `poids_écart = f(|DES_A − DES_B|) × g(min(COM_A, COM_B))` — forme et bornes À VALIDER PAR LE COMITÉ | Alimente la compatibilité **côté moteur uniquement** — JAMAIS au rendu, JAMAIS en UI, JAMAIS au match affiché, JAMAIS aux portraits visibles (marque [MOTEUR SEUL] obligatoire sur toute occurrence) ; au rendu, la communication se raconte comme un actif du profil (lumière des profils), jamais comme un modulateur | COM_A × COM_B (8 items communication au total) | recalcul à chaque mise à jour ⚠ |
| **SIG-6.1-03** | CMP — le signal de compulsion intime | **MOTEUR SEUL** : les 2▲ **Q6.1-T51 → T52** alimentent le signal **CMP** (dictionnaire [4] — compulsion intime : le désir ressenti comme subi plutôt que choisi · l'après qui n'appartient plus — déguisées en questions banales de la quête) ; **croisement avec l'impulsivité (quête 1.4 — double usage DGR) ATTENDU, non calculé** — précédent JR1×Mania (SIG-5.1-03 / SIG-5.4-03) : le croisement opère au PORTRAIT DE DOMAINE de l'Intime (futur), jamais dans un miroir de quête seul (Constitution [5]) ; décision comité de mise en signal requise avant consommation (P2) | Vigilance côté moteur — JAMAIS au rendu de 6.1, JAMAIS à la carte, JAMAIS au match affiché, JAMAIS à l'autre membre | 2▲ CMP (codes seuls au dépôt — énoncés hors dépôt, règle 11-b, Partie 10) | activation P2 ⚠ |
| **SIG-6.1-04** | Sérénité × communication — vers les ressources | **Signal interne** : une personne peu sereine (SER_D bas, sous-module sérénité) a besoin d'un partenaire **patient** — croisement proposé : **SER_D bas × COM_D bas (soi ou croisé)** → signal interne ; **aucune étiquette, jamais** (règle 3 du bloc) ; le signal alimente **des ressources bienveillantes REN uniquement** — rendu séparé, opt-in renforcé (REN compatible : tout renvoi professionnel éventuel passe par le gabarit REN unique, formulation verrouillée, sobre, une fois — refonte R14) ; croisement avec la communication : prévu, bornes À VALIDER PAR LE COMITÉ | Ressources bienveillantes (rendu séparé du sous-module) — jamais une étiquette, jamais un verdict, jamais au miroir de profils, jamais à l'autre membre sans le consentement du rendu ressources | SER_D (Q6.1-S01 → S04) × COM_D | activation à la complétion du sous-module ⚠ |

## La cascade de rendu du miroir (rendu descriptif — mécanisme, pas une signature)

> Les 4 signatures de la mission sont des signaux moteur/croisés ; la cascade de profil reste un **mécanisme
> de rendu** documenté ici, au 04 et au 07 (conventions 5.1/5.4/5.7) — proposition, À VALIDER PAR LE COMITÉ.

1. **Dominante = max(DES_D, INT_D, COM_D)** · quasi-égalité (écart 1ᵉʳ-2ᵉ < 0.05) → départage par le pivot le
   mieux noté des dimensions à égalité, puis, à égalité exacte, par la 1ʳᵉ position de passation
   (précédents 5.1/5.3/5.4/5.7) — le départage ordonne le récit, il ne change pas le profil.
2. **Si dominante = COM_D → profil « le pont par la parole »** (la parole comme actif majeur).
3. **Sinon → la température du désir décide** : DES_D ≥ 0.60 → « l'évidence tranquille » · 0.40 ≤ DES_D < 0.60
   → « le rythme personnel » · DES_D < 0.40 → « la prudence qui se prépare » (bandes provisoires concepteur).
4. **L'intention ne produit jamais un profil** : si INT_D domine sans COM_D, la température du désir décide et
   l'intention colore la nuance (slot S2 — une phrase, jamais un deuxième portrait).
5. **Partition exclusive + exhaustive des 4 profils** — chaque résultat tombe dans exactement une variante.

## Notes de registre

- **Neutralité stricte des attitudes — verrou capital** : l'ombre = le COÛT EN COUPLE, jamais la nature ;
  aucune façon de vivre l'intime supérieure ou inférieure ; le moteur classe une dominante, il ne mesure
  aucune « santé » (règle 3 du bloc — la famille des étiquettes cliniques est bannie, y compris ici).
- **Aucune restitution des trames** : les 2▲ (CMP) n'entrent dans AUCUN score affiché, AUCUN miroir, AUCUNE
  carte, AUCUN slot, AUCUN rappel — le bloc vit côté moteur seul (précédent 4.1/4.2/5.4). Les rappels du
  miroir s'ancrent aux énoncés **D des 10 carte uniquement** (01 · 04 · 06 · 07 · 09).
- **Le sous-module sérénité vit hors du miroir** : rendu ressources bienveillantes séparé (REN compatible) —
  jamais un profil, jamais une carte, jamais un rappel de profil.
- **SIG-6.1-01 ne sort jamais dans un miroir** : l'écart de désir est un signal DE MATCH (aux deux membres) ;
  le miroir raconte le profil seul — la délicatesse de l'écart vit dans l'ombre des profils de désir, au
  registre probabiliste, sans blâme (gelé mission).
- **SIG-6.1-02 est un terme, pas un texte** : le moteur module, il ne dit rien — au rendu, la communication
  se raconte comme un actif (lumière), jamais comme un correctif d'écart.
- **SIG-6.1-03 est un attendu, pas un calcul** : le croisement impulsivité (1.4) × CMP est CONSIGNÉ ; sa
  consommation est une décision du futur portrait de domaine de l'Intime — la marque « ATTENDU — NON CALCULÉ »
  accompagne toute mention.
- **Zéro jargon rendu** : DES_D / INT_D / COM_D / SER_D, SIG-6.1-01/02/03/04 et les identifiants de signaux
  restent moteur — le rendu parle en images (l'évidence, le tempo, la prudence, le pont).
- **Liaisons de domaine de l'INTIME (M8+M9 — attendues, sans calcul, à opérer au PORTRAIT DE DOMAINE de
  l'Intime — futur, non demandé V13, Constitution [5])** : **6.1 × 6.2** (l'essentiel × la relation au désir —
  l'érotophilie et l'initiation prolongent le désir et l'intention de 6.1) · **6.1 × 6.3** (l'essentiel × la
  carte des préférences — la parole de 6.1 ouvre la carte) · **6.2 × 6.3** (le désir × les préférences) —
  documentées ATTENDUES, **JAMAIS calculées dans cette quête**.
- **Registre probabiliste obligatoire** — « la recherche documente que », « conduit fréquemment à », jamais le
  futur certain.
- SIG-6.1-01 et la cascade de rendu sont rejouées contre les portraits du Monde selon le protocole du Registre
  des Signatures ; SIG-6.1-02/03/04 (moteur, trames, sous-module) sont rejoués hors dépôt.
