# LIVRABLE 3 — SIGNATURES ATTENDUES DE LA QUÊTE 2.1 (format du registre)

> ⚠ **Seuils et fenêtres : ADOPTÉS comme valeurs de départ (décision comité, FM-019) — provisoire concepteur — re-signature professionnelle avant bêta.**

| ID | Nom | Conditions exactes | Conséquence | Source | Fenêtre cible |
|---|---|---|---|---|---|
| **SIG-2.1-01** | Le gouvernail | bloc_max − bloc_suivant ≥ 0,5 (moyennes normalisées 1-5 des 4 blocs) — *seuil* ⚠ | La Carte nomme le bloc dominant ET le bloc le plus discret — lumière + ombre en une phrase | 20 items carte, 4 blocs | ~80 % de bloc dominant net ⚠ |
| **SIG-2.1-02** | Les deux réponses qui se tirent dessus | \|D_k − (6−I_k)\| ≥ 3, k ∈ 10 valeurs (règle R6 d'incohérence miroir) | Drapeau fiabilité sur k · rappel des 2 réponses **en toutes lettres** · score k = moyenne des items valides + prudence du miroir | 10 paires miroir | ≥ 2 paires : 5-15 % ⚠ |
| **SIG-2.1-03** | La boussole qui penche pour soi | score trame (4 ▲ DTM_N) normalisé ≥ T1 **ET** bloc Dépassement de soi au tiers inférieur — *seuil T1* ⚠ | Alimente **DTM_N** (composante entitlement) **côté moteur UNIQUEMENT** — zéro trace UI, entre dans la trame sécurité | 4 trames × bloc Dépassement de soi | < 5 % ⚠ |
| **SIG-2.1-04** | L'étendue de la loyauté | \|BE − UN\| ≥ 1,0 → 3 degrés (cercle resserré / nuancé / étendu) — *seuil* ⚠ | Slot miroir descriptif, registre probabiliste, jamais normatif | Q2.1-17/18 × Q2.1-19/20 | étendu ~30 %, resserré ~25 % ⚠ |

## Notes de registre

- **Registre probabiliste obligatoire** : toute conséquence documentée dans un miroir s'exprime
  en « conduit fréquemment à », « la recherche documente que » — jamais « tu finiras par ».
- **SIG-2.1-03 est un signal de trame** : il ne produit AUCUN texte, AUCUN slot, AUCUNE citation.
  Sa seule sortie est côté moteur (trame sécurité → paliers de visibilité).
- Les 4 signatures sont rejouées contre les 4 Portraits du Monde 1 selon le protocole du
  Registre des Signatures (test de non-régression 22/22 à maintenir).
