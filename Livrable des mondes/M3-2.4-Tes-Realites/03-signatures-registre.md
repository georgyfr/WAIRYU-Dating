# LIVRABLE 3 — SIGNATURES ATTENDUES DE LA QUÊTE 2.4 (format du registre)

> ⚠ **Seuils et fenêtres : ADOPTÉS comme valeurs de départ (décision comité, FM-019) — provisoire concepteur — re-signature professionnelle avant bêta.**
> **Marquage mission Phases A/B/C/D (point 4 — conversion du registre des signatures) :** chaque seuil ci-dessus porte le statut **« À VALIDER PAR LE COMITÉ »** — l'adoption FM-019 fixe la valeur de départ ; la re-signature professionnelle avant bêta reste requise.
> Aucune signature de sécurité n'est attachée à cette quête (aucun item de trame — vérifié au registre du mélange).
> **NOTE QFI OBLIGATOIRE** : QFI (qualité de fiabilité du profil, glossaire [4]) est un signal
> **MOTEUR SEUL** — jamais affiché, jamais dit à l'utilisateur, jamais au match, jamais dans les portraits.

| ID | Nom | Conditions exactes | Conséquence | Source | Fenêtre cible |
|---|---|---|---|---|---|
| **SIG-2.4-01** | Le croisement qui élimine | Une réalité déclarée correspond à une ligne rouge cochée par un autre membre — DANS LES DEUX SENS (mes réalités × ses lignes rouges ; ses réalités × mes lignes rouges) | **Hard constraint appliqué** : élimination déterministe au matching, côté moteur, sans trace rendue chez l'un ni chez l'autre | 8 réalités × lignes rouges Q2.3 de tous | recalcul à chaque mise à jour ⚠ |
| **SIG-2.4-02** | Le profil qui se contredit | Incohérence entre déclaration 2.4 et autre donnée déclarée ou mesurée, même monde ou monde déclaré : Q2.4-04 × 2.2 (pratiquant(e) vs centralité spirituelle déclarée) · Q2.4-03 × 2.7 (enfants déclarés vs vision de la famille) · Q2.4-01 → Q2.4-06 × ligne rouge équivalente cochée chez soi (2.3) | Drapeau **QFI** — MOTEUR SEUL, zéro trace UI : l'incohérence abaisse la fiabilité du profil et module la prudence du rendu, elle n'est JAMAIS exposée comme accusation | croisements intra-M3 déclarés × déclarés | fréquence attendue ⚠ (à établir en bêta) |
| **SIG-2.4-03** | La tension des réalités | Tension interne NON contradictoire entre deux déclarations : Q2.4-07 « Je suis nomade » × Q2.4-08 « Je cherche à rencontrer rapidement » (et combinaisons analogues) | Drapeau **QFI souple** ⚠ : le miroir peut documenter la tension au registre fréquentiel (« ces deux réalités demandent souvent des arbitrages ») — descriptif, jamais accusateur, jamais chiffré | croisements internes 2.4 | < 10 % ⚠ |

## Notes de registre

- **Registre probabiliste obligatoire** : toute conséquence documentée dans un miroir s'exprime en
  « conduit fréquemment à », « la recherche documente que » — jamais « tu finiras par ».
- **Écran de conformité permanent** : les réalités sont des FAITS. Aucun texte produit ne hiérarchise
  les vies (« mieux vaut », « c'est mieux de ») : ni fumeur ni nomade ni « zéro sport » ne sont des
  défauts. La seule chose mesurée est la cohérence des déclarations, jamais la valeur de la personne.
- **SIG-2.4-01 est le mécanisme décrit par le source comme « la plus haute valeur du système entier »**
  (l.598) — il reste invisible : il façonne le pool, il ne commente jamais les personnes.
- **SIG-2.4-02 / SIG-2.4-03 alimentent QFI** : aucun slot, aucun texte, aucune citation. Leur seule
  sortie est côté moteur (paliers de prudence dans le rendu).
- **Visibilité chips & matching (décision comité, FM-019)** : le croisement SIG-2.4-01 s'applique
  **même quand une réalité est réglée privée** — la privacité retire la chip de l'affichage public,
  jamais l'application du filtre. « J'ai arrêté » (Q2.4-01) = non-fumeur au filtre, « ex-fumeur »
  à l'affichage (chip) : le moteur filtre sur l'état, l'UI montre le parcours.
- Les 3 signatures sont rejouées contre les portraits du Monde selon le protocole du Registre des
  Signatures (test de non-régression à maintenir).
