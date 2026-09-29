# LIVRABLE 3 — SIGNATURES ATTENDUES DE LA QUÊTE 4.1 (format du registre)

> ⚠ **Seuils et pondérations : verrou [9]** — valeurs de production PROVISOIRES (marque
> mission : **« À VALIDER PAR LE COMITÉ »**, provisoire concepteur — re-signature
> professionnelle avant bêta, FM-019).
> Les loyautés et le climat alimentent les **matrices de pièges côté moteur** (avec le bloc
> invisible 4.4) — **jamais au rendu** sous forme de croisement calculé (Constitution [3]).

## Les variables fournies par la quête

| Variable | Source | Domaine |
|---|---|---|
| **CLIMAT_D** | climat déclaré (Q4.1-01 → 04, I recodés, normalisée) — haut = l'ambiance qui se nomme | 0-1 |
| **LOYAUTE_D** | poids des héritages (Q4.1-05 → 08, I recodés, normalisée) — haut = loyautés pesantes | 0-1 |
| **FIS_41** | part de la variable FIS portée par cette passation (Q4.4-T13 → T14, D, normalisé) — **moteur SEUL**, agrégée au bloc 4.4 | 0-1 |

| ID | Nom | Conditions exactes | Conséquence | Source | Fenêtre cible |
|---|---|---|---|---|---|
| **SIG-4.1-01** | Le climat raconté | **Lecture 2 axes** (proposition — À VALIDER PAR LE COMITÉ [9]) : déviations dC = \|CLIMAT_D − 0.5\|, dL = \|LOYAUTE_D − 0.5\| ; **si max(dC, dL) ≤ 0.15 → central (« selon la table »)** ; sinon l'axe le plus dévié choisit le côté → **4 quadrants** (climat nommé×voix tenue · climat nommé×héritage pesant · climat deviné×voix tenue · climat deviné×héritage pesant). Départage dC = dL : l'axe climat tranche (il décrit l'ambiance d'origine) | Rendu descriptif (miroir 07, carte) — quatre façons égales d'avoir grandi + l'entre-deux ; **le climat deviné n'est pas un climat raté**, l'héritage pesant n'est pas une faiblesse ; jamais de vocabulaire clinique (« différenciation » reste moteur) | 8 items déclaratifs | recalcul à chaque mise à jour ⚠ |
| **SIG-4.1-02** | Les loyautés invisibles | **Lecture descriptive + matrices moteur** (proposition — À VALIDER PAR LE COMITÉ [9]) : LOYAUTE_D haut → le poids des rôles tenus tôt est documenté au portrait (« Ton Héritage ») ; **côté moteur**, LOYAUTE_D croise les variables du bloc 4.4 (abandon, carence, méfiance, assujettissement, exigence) dans la **matrice des pièges systémiques** — croisements significatifs : héritage pesant × assujettissement (renforcement), héritage pesant × voix propre tenue (nuance) | Côté rendu : une image bienveillante au portrait — ce que ta famille t'a appris sans le savoir, jamais un reproche, jamais un blâme parental. Côté moteur : les croisements alimentent la matrice 4.4 (pénalités fortes/protections — SIG-4.4-06) — **jamais au score de compatibilité affiché, jamais au match, jamais au premium** | 8 items déclaratifs + matrice moteur | recalcul à chaque mise à jour ⚠ |

## Notes de registre

- **Zéro blâme parental — verrou capital** (interdit V10) : le climat et les héritages se
  racontent sans auteur fautif — « ce que ta famille t'a appris sans le savoir » (refonte
  verbatim), jamais « ce qu'on t'a fait ».
- **La différenciation n'est pas une maturité** : rester dans la voix du groupe est une façon
  légitime d'habiter une famille ; le moteur nomme LOYAUTE_D, le rendu parle de place, de
  table, de voix — jamais de niveau atteint.
- **FIS_41 ne se raconte JAMAIS** : les 2 trames hébergées n'apparaissent dans aucun slot,
  aucune carte, aucun rappel (règles Partie 0, document trames hors dépôt).
- **Registre probabiliste obligatoire** — « la recherche documente que », jamais le futur certain.
- **Zéro jargon rendu** : CLIMAT_D, LOYAUTE_D, FIS_41, SIG-4.1-01/02 restent moteur.
- SIG-4.1-01 est rejouée contre les portraits du Monde selon le protocole du Registre des
  Signatures ; SIG-4.1-02 (côté matrice) est rejouée hors dépôt.
