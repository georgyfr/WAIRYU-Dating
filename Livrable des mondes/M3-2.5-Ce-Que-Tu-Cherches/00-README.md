# QUÊTE 2.5 « CE QUE TU CHERCHES » — FICHE DE CADRAGE PUIS LECTURE DU LIVRABLE

> Monde M3 · 🆓 gratuit · Socle · MVP · 3 items · Codes gelés Q2.5-01 → Q2.5-03

## 🧭 FICHE DE CADRAGE (lire avant tout le reste)

| Champ | Cadrage |
|---|---|
| **Ce que ça mesure** | L'INTENTION AFFICHÉE : relation exclusive, découverte sans plan précis, non-exclusivité assumée (source : « TEST ET OUTILS POUR WAIRYU.md » l.207). Côté moteur : un dealbreaker BINAIRE, croisé plus tard avec l'intention réelle mesurée (6.1, invisible) → détection de tromperie. |
| **Format de réponse (NON-Likert)** | **BINAIRE + 4ᵉ réponse globale.** 3 énoncés assumés, réponse oui / non, ≤ 8 mots, tutoiement, présent — plus une **4ᵉ réponse « Je découvre »** (décision comité, decisions produit c) : état d'exploration déclaré, **compatible avec tout** (aucun dealbreaker, aucun drapeau QFI). Pas d'échelle, pas d'orientation D/I, pas de dimension psychométrique : `dimension = null`, `signal = null`. Les énoncés sont des constats posés à la personne (« Tu cherches… ») — assumés : ni « c'est compliqué », ni « ça dépend ». |
| **Signatures attendues** | SIG-2.5-01 « L'intention affichée » (agrégat des 3 binaires + l'état « Je découvre » — restituable) · SIG-2.5-02 « La contradiction interne » (01 oui × 03 oui → drapeau QFI, miroir dégradé) · SIG-2.5-03 « Le décalage affiché × vécu » (croisement 6.1 → tromperie, MOTEUR SEUL, EN ATTENTE D'ACTIVATION). **Seuils adoptés comme valeurs de départ — provisoire concepteur — re-signature professionnelle avant bêta (FM-019). NOTE TROMPERIE : la détection de tromperie ne produit jamais de texte, jamais de statut affiché.** |
| **Slots prévus** | Miroir **LÉGER** (3 items → gabarit 80-150 mots, Constitution [7]) · 2 slots (S1 ton cap, S2 ce que ton cap demande à l'autre) · gabarit « slots ∝ densité » proposé, À VALIDER PAR LE COMITÉ. |
| **Points de doctrine** | ① **Incomplétude assumée** : 3 items ne couvrent pas toutes les intentions — le source le sait, la complétude viendra du croisement avec 6.1 ; aucun texte ne prétend lire « toute » l'intention ; l'état « Non / Non / Non » est accueilli par un **message doux** (aucune relance, aucune insinuation de défaut) et la 4ᵉ réponse « Je découvre » lui offre une issue déclarée. ② La détection de tromperie est MOTEUR SEUL : elle module la fiabilité de l'intention, elle n'est ni montrée, ni suggérée, ni punie. ③ La contradiction interne (01 × 03) dégrade le miroir, sans texte accusateur. ④ Aucun teaser du croisement 6.1 (premium M8, opt-in) au rendu gratuit ([6]). ⑤ Aucune trame dans la quête (vérifié au registre du mélange). ⑥ La 4ᵉ réponse « Je découvre » est **compatible avec tout** : elle ne bloque jamais un appariement et ne se combine avec aucune exclusion. |

## 📖 Lecture des fichiers (ordre conseillé)

1. `01-tableau-des-items.md` — les 3 binaires, la 4ᵉ réponse « Je découvre », leurs combinaisons, leur croisement moteur.
2. `02-plan-de-melange-graine-25428.md` — l'ordre de passation RÉEL et le récit intégralement
   transparent du re-tirage 25427 → 25428.
3. `03-signatures-registre.md` — les 3 signatures (dont la note tromperie) — seuils adoptés, provisoire concepteur (FM-019).
4. `04-slots-de-miroir.md` — le miroir LÉGER et ses 9 verrous.
5. `05-ecran-d-intro.md` — les 2 phrases d'entrée dans la quête.
6. `06-fiche-computation-EXEMPLE.yaml` — l'item Q2.5-01 déployé au format complet.
7. `cartes.yaml` — les 2 variantes de carte (étage 1).
8. `07-miroir.md` — le miroir de quête (étage 2) — gabarit LÉGER 80-150 mots, 1 brique × 2 variantes de texture (A « par l'exemple » · B « par le mécanisme ») — créé VAGUE 4.

## 🔄 Flux de production

```
cadrage (cette fiche) → rédaction des 3 binaires → mélange seedé 25427 → c6 non satisfaite
(permutation identique) → RE-TIRAGE DOCUMENTÉ graine 25428 → verdicts c1-c6 rejoués
→ signatures/slots/cartes/intro → 4ᵉ réponse « Je découvre » + message doux (décision comité,
FM-019 — hors contrat de mélange : la réponse globale n'est pas un item) → validateur (linter)
→ auditeur hostile C1 (session séparée) → gouvernance D1
```

> Aucun fichier du dépôt contractuel n'est modifié par ce livrable (pas de git, pas de CI).
