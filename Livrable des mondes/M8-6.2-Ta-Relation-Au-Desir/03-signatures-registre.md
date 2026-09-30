🗒️ quete: 6.2 · dossier: M8-6.2-Ta-Relation-Au-Desir · fiche: première émission V13.B (FM à graver à la consolidation) · session: 2026-09-30

# LIVRABLE 3 — SIGNATURES ATTENDUES DE LA QUÊTE 6.2 (format du registre)

> ⚠ **Seuils et pondérations : verrou [9]** — valeurs de production PROVISOIRES (marque mission :
> **« À VALIDER PAR LE COMITÉ »**, provisoire concepteur — re-signature professionnelle avant bêta, FM-019).
> La matrice du refus (SIG-6.2-02) et le signal COC (SIG-6.2-03) sont **[MOTEUR SEUL]** — JAMAIS au rendu,
> JAMAIS en UI, JAMAIS dans un score affiché, JAMAIS à un tiers (Constitution [3] ; précédents SIG-4.1-02 /
> SIG-5.4-02/03/04 / SIG-6.1-03). Le signal COC vit sous **chiffrement maximal**, **opt-in** (étage 2).

## Les variables fournies par la quête

| Variable | Source | Domaine |
|---|---|---|
| **TEMP_ELEVEE** | température élevée (Q6.2-01×02, I recodés `6 − r`, normalisée) — haut = l'évidence détendue | 0-1 |
| **TEMP_NEUTRE** | température neutre (Q6.2-03×04, I recodés) — haut = le fluide sans empressement | 0-1 |
| **TEMP_BASSE** | température basse (Q6.2-05×06, I recodés) — haut = la sécurité et la lenteur | 0-1 |
| **INIT** | initiation (Q6.2-07 D + Q6.2-08 I recodé — la question QUI) — bas = initiateur-hésitant | 0-1 |
| **STYLE_INIT** | la facette COMMENT (Q6.2-09 D, brut) — haut = le terrain préparé, bas = la franchise directe — **JAMAIS fusionnée dans INIT** (décision n° 3, 01) | lecture de facette |
| **FUS_COEUR** | fusionnel (Q6.2-10×11, I recodés) — haut = le désir et le cœur ne font qu'un | 0-1 |
| **FUS_BESOIN** | autonome (Q6.2-12×13, I recodés) — haut = le désir vit sa propre vie | 0-1 |
| **FUS_CONTEXTE** | les deux selon le contexte (Q6.2-14×15, I recodés) | 0-1 |
| **COC (signal)** | les 5▲ Q6.2-T53 → T57 — vigilance coercion (vécu du refus) — MOTEUR SEUL, chiffrement maximal, registre ACTIF | binaire/score moteur |

| ID | Nom | Conditions exactes | Conséquence | Source | Fenêtre cible |
|---|---|---|---|---|---|
| **SIG-6.2-01** | Ta température | **Cascade des 3 températures** (proposition — À VALIDER PAR LE COMITÉ [9], conventions alignées SIG-5.4-01/SIG-6.1-02) : **dominante = max des trois scores** · quasi-égalité (écart 1ᵉʳ-2ᵉ < 0.05) → départage à la 1ʳᵉ position de passation (précédents) · **bande 0.10** → le secondaire nuance au slot S2 (pas de variante séparée — **3 profils gelés mission**) · **SANS AUCUNE HIÉRARCHIE** : aucune température n'est « meilleure », le rendu ne corrige jamais une température basse (règle 5 — asexualité jamais un déficit). **Matrice de température ambiante** : croisement TEMP_ELEVEE (membre A) × TEMP_BASSE (membre B) — et symétriquement — vigilance si **écart > 0.6** (seuil comité) → « **une différence de température ambiante, pas une question de préférences** » — les deux se croient « normaux » : l'incompatibilité sourde à nommer tôt, **aux DEUX** (usage ② semi-visible) — JAMAIS à un tiers, JAMAIS de pénalité, sortie au libellé seul | Rendu descriptif — le miroir (3 profils) et la carte rendent la température dominante ; la matrice ambiante produit un signal de divergence aux deux membres, formulation sans blâme | 6 items température | recalcul à chaque mise à jour ⚠ |
| **SIG-6.2-02** | La matrice du refus | **[MOTEUR SEUL]** — croisement **refus-sensible (COC) × initiateur-hésitant (INIT bas)** = **vigilance MAJEURE** : le cycle initiation → refus → blessure → moins d'initiation → distance (refonte l. 866 — le cycle le plus destructeur du couple long terme ; deux personnes à libido identique peuvent le vivre quand l'une prend chaque refus personnellement) — **alimente COC** ; croisement complémentaire COC × TEMP_BASSE (lenteur du cadre × blessure du refus) : cellule À VALIDER PAR LE COMITÉ ; seuils provisoires concepteur | Vigilance côté moteur uniquement — JAMAIS au rendu, JAMAIS en UI, JAMAIS au match affiché, JAMAIS aux portraits visibles (marque [MOTEUR SEUL] obligatoire sur toute occurrence) | 5▲ COC + 3 items initiation + matrice moteur | activation P2 ⚠ |
| **SIG-6.2-03** | COC — la vigilance coercion | **MOTEUR SEUL** : les 5▲ **Q6.2-T53 → T57** alimentent le signal **COC** (dictionnaire [4] — vigilance coercion, vécu du refus : blessure · humiliation · rejet global · réinsistance · pression comme norme) ; registre **ACTIF** (mission V13.B — arbitrage Étape 0) ; **chiffrement maximal, opt-in** (étage 2) ; **croisement futur avec 8.3 « Le refus »** (M11 — les 3 scénarios de refus du Voyage à Deux) **ATTENDU, NON CALCULÉ** — P3/M11, précédent SIG-5.4-03 (Mania × JR1) ; l'angle T57 (pression comme norme) porte la composante coercion la plus directe — pondérations comité | Vigilance côté moteur (jamais un verdict, jamais un label sur une personne) ; **JAMAIS rendu, JAMAIS à un tiers, JAMAIS pénalité** — aucun des trois visages (score/signal/progression) ne le porte | 5▲ COC (codes seuls au dépôt — énoncés hors dépôt, règle 11-b) | activation P2 ⚠ |
| **SIG-6.2-04** | Le lien désir-cœur | Divergence **FUS_COEUR (fusionnel) × FUS_BESOIN (autonome)** entre les deux membres = information **CONVERSATIONNELLE** signalée **aux DEUX** — « la dispute la plus répétée du couple » (refonte l. 880 : « pour toi, ce n'est qu'un besoin ? » / « pourquoi en faire tout un drame ? ») — nommée tôt pour ne pas s'interpréter en manque d'amour ni en exigence émotionnelle ; **JAMAIS de pénalité**, JAMAIS à un tiers ; FUS_CONTEXTE ne porte pas de divergence (posture neutre — vérification des autres cellules À VALIDER PAR LE COMITÉ) ; le rendu individuel (miroir, carte) décrit SA posture, jamais celle de l'autre | Information conversationnelle — signal semi-visible aux deux membres (« à aborder tôt »), zéro verdict, zéro pénalité | 6 items fusion | recalcul à chaque mise à jour ⚠ |

## Notes de registre

- **Neutralité stricte — verrou capital** : l'ombre = le COÛT EN COUPLE de chaque température et de chaque
  posture, jamais leur nature ; aucune température ni posture supérieure ou inférieure ; le moteur classe
  une dominante, il ne mesure pas une « santé du désir ».
- **Aucune restitution des trames** : les 5▲ (COC) n'entrent dans AUCUN score affiché, AUCUN miroir, AUCUNE
  carte, AUCUN slot, AUCUN rappel — le bloc vit côté moteur seul, sous chiffrement maximal (précédents
  4.1/4.2/5.4/6.1, règle d'administration Partie 0 du document trames). Les rappels du miroir s'ancrent aux
  énoncés **D des 15 carte uniquement** (8 D : 01 · 03 · 05 · 07 · 09 · 10 · 12 · 14).
- **Les matrices ne sortent jamais** : la matrice ambiante (SIG-6.2-01) ne sort que par son libellé de
  divergence, aux deux membres ; la matrice du refus (SIG-6.2-02) et le COC (SIG-6.2-03) ne sortent jamais.
- **SIG-6.2-03 est un attendu, pas un calcul** : le croisement 8.3 « Le refus » × COC est CONSIGNÉ
  (P3/M11) ; la marque « ATTENDU — NON CALCULÉ » accompagne toute mention.
- **Zéro jargon rendu** : TEMP_*, INIT, STYLE_INIT, FUS_*, SIG-6.2-01/02/03/04 et les identifiants de
  signaux restent moteur (nommage UI obligatoire au rendu : la température — l'évidence détendue, le fluide
  sans empressement, la sécurité et la lenteur ; la dynamique — le premier pas, le terrain préparé ; la
  fusion — le désir et le cœur, le désir qui vit sa vie, les deux selon le moment).
- **Liaisons de domaine ATTENDUES (sans calcul, opérées aux PORTRAITS — Constitution [5])** :
  **6.2 × 6.1** (température × écart de désir / communication modératrice — domaine de l'Intime) ·
  **6.2 × 6.3** (température × carte des préférences — le chaud module l'exploration) ·
  **6.2 × 5.1** (pré-signal **Mania × COC** — l'autre bout du précédent **SIG-5.1-03** : « MANIA_D haut ×
  JR1 attendu V12 » s'achève ici côté intime) — **JAMAIS calculées dans cette quête** (le Portrait de
  Domaine de l'Intime est futur — non demandé V13).
- **Registre probabiliste obligatoire** — « la recherche documente que », « conduit fréquemment à », jamais
  le futur certain.
- SIG-6.2-01 et SIG-6.2-04 sont rejouées contre les portraits du Monde selon le protocole du Registre des
  Signatures ; SIG-6.2-02/03 (côté trames et matrice) sont rejouées hors dépôt.
