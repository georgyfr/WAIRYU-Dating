# PAQUET D'INSTRUCTION P1-M1 — LE MIROIR (Monde 1)

> Paquet de production pour la matérialisation P1 du Monde 1. Source unique : le document gelé
> `ddocumentation/refonte des tests et outils wairyu.md` (PARTIES 1-9 : items ; charte des cartes ;
> registre des signatures en fin de document). Le Contrat d'Inventaire v1.3 GAGNE en cas de divergence.

## ⚠ Découvertes préalables (constatées, à connaître avant production)

1. **« 139 items » = le Monde 1 ENTIER (1.1 → 1.8)** — la lecture « 1.1-1.3 seulement » (= 104) sous-compte. Répartition : 1.1 : 58 (50 carte + 8 trame) · 1.2 : 20 (12 + 8 trame) · 1.3 : 26 (20 + 6) · 1.4 : 8 · 1.5 : 6 choix · 1.6 : 7 + 3 énigmes · 1.7 : 2 · 1.8 : 9.
2. **Seules 6 quêtes sur 8 sont RÉDIGÉES** (124 items) — 1.5 « conçus » et 1.8 « cadrés » ne sont PAS matérialisables (P1 matérialise, ne rédige pas) → **option B : 148/570 = 26,0 %** (option A : 163/570 en deux vagues).
3. **Les 22 trames du Monde 1** = SDT-N 8 (1.1) + SDT-M 4 (1.2) + RSQ 4 (1.2) + DE 6 (1.3) — conforme au contrat.
4. **Le registre des 30 signatures M1** = 7 méta + 17 narratives + 6 sécurité (fin du source, 5 verrous CI propres).
5. **Le registre des 18 codes signaux n'a aucune maison fichier** → matérialiser `contrat/registres/signaux.json` AVANT les trames (alignement SDT-N → code gelé DTM_N, aucun nouveau signal — arbitrage ④).
6. **PHQ-9 (1.8) = instrument clinique** → ✅ TRANCHÉ (décision comité, FM-019) : **MAINTENU en Phase 3 avec verrou renforcé** — aucune matérialisation sans relecture professionnelle préalable ; **option de retrait** si la relecture échoue : lien ressources, ZÉRO collecte de données.
7. **Règle d'or** : les 22 trames → `contenu/trames/securite.yaml` (maison B5), JAMAIS dans les fichiers de quête ; les fichiers de quête portent les codes + signal + position uniquement.

## Séquence verrouillée (tranchage B)

1. `contrat/registres/signaux.json` — les 18 codes signaux (dictionnaire [4] de la Constitution comme référence).
2. Quêtes 1.1 · 1.2 · 1.3 · 1.4 · 1.6 · 1.7 — 102 items (format 2.1 : items.yaml + melange.json + signatures + slots + intro) — trames = lignes-réservées (code + signal + position), énoncés HORS dépôt.
3. `contenu/trames/securite.yaml` — les 22 trames : codes, signal, quête, position de passation — **aucun énoncé** ([11-b]).
4. `contrat/registres/signatures/M1.json` — les 30 signatures (bloc méta/narratif PUBLIC + les 6 sécurité = références aux conditions fines HORS dépôt).
5. Exécution FM-018 (rotation des formulations 2.1) — dès réception des 4 propositions du concepteur.
6. Manifestes + CI — extension par quête, verrous identiques, CI verte obligatoire avant push.

## Exclusions (assumées)

- **1.5** : items comportementaux non rédigés (choix + temps mesuré) — FM future pour le contrat de mélange des items de performance.
- **1.8** : PHQ-9 MAINTENU Phase 3 — verrou renforcé (relecture professionnelle obligatoire avant toute matérialisation ; en cas d'échec : retrait pur — lien ressources, zéro collecte) (FM-019).
- **Énigmes 1.6** : hors contrat de mélange (items de performance, ordre source) — pénalité écart de pôle 0.7 documentée côté signatures.
