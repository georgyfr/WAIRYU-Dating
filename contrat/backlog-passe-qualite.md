# BACKLOG — PASSE QUALITÉ (décision comité, FM-019)

| Champ | Valeur |
|---|---|
| ID | BACKLOG-PASSE-QUALITE-01 |
| Type | Gouvernance (plan de charge différé) |
| Date | 2026-09-29 |
| Décision | COMITÉ (tranche fondateur, décision 6) : « PASSE QUALITÉ : backlog — 12 énoncés longs, contaminations, contrat de mélange des items de performance. **Après les vagues principales.** » |
| Priorité | BASSE — aucun élément de ce backlog ne bloque une vague de matérialisation ni la bêta |
| Déclencheur | Ouverture après la clôture des vagues principales de matérialisation |

---

## Règle de jeu

- La **fidélité verbatim au source gelé [8] prime** : tout retravail d'un énoncé passe par une
  **Fiche de Mutation** (reformulation = divergence assumée et tracée, jamais une correction muette).
- Aucun élément de ce backlog ne touche aux **trames de sécurité** (formulations gelées, rotation
  réservée au concepteur — FM-018 §4).
- Chaque entrée traitée est marquée : TRAITÉ (FM-xxx) ou REJETÉ (motif).

---

## 1. Énoncés longs (cible de rédaction ≤ 12 mots)

> Écart de comptage documenté : le verdict comité évoque « 12 énoncés longs » ; le comptage machine
> des livrables matérielisés (token par espaces, tokens contenant au moins une lettre) trouve
> **15 items strictement > 12 mots**. La liste exhaustive est prise au backlog ; si le comité visait
> une sous-liste de 12, les excédents restent au backlog sans surcoût (traitement de toute façon
> postérieur aux vagues principales).

| Code | Mots | Quête | Statut |
|---|---|---|---|
| Q1.1-02 | 18 | 1.1 Ta personnalité | EN ATTENTE (après vagues) |
| Q1.1-31 | 16 | 1.1 | EN ATTENTE |
| Q1.1-08 | 15 | 1.1 | EN ATTENTE |
| Q1.1-04 | 14 | 1.1 | EN ATTENTE |
| Q1.3-10 | 16 | 1.3 Tes émotions | EN ATTENTE |
| Q1.3-08 | 14 | 1.3 | EN ATTENTE |
| Q1.3-17 | 14 | 1.3 | EN ATTENTE |
| Q1.6-01 | 14 | 1.6 Ta façon de penser | EN ATTENTE |
| Q1.1-15 | 13 | 1.1 | EN ATTENTE |
| Q1.1-24 | 13 | 1.1 | EN ATTENTE |
| Q1.2-05 | 13 | 1.2 Ta façon de t'attacher | EN ATTENTE |
| Q1.4-05 | 13 | 1.4 Ton contrôle | EN ATTENTE |
| Q1.6-02 | 13 | 1.6 | EN ATTENTE |
| Q1.6-03 | 13 | 1.6 | EN ATTENTE |
| Q1.6-04 | 13 | 1.6 | EN ATTENTE |

Traitement type : reformulation ≤ 12 mots via Fiche de Mutation + re-comptage machine + rejeu du
mélange (les codes et positions ne bougent pas) + relecture C1 delta.

## 2. Contaminations (findings C1 — quête 2.1)

| Finding | Contenu | Statut |
|---|---|---|
| C1 4.1 — surfaces partagées 09×23 | recouvrement lexical entre l'item carte Q2.1-09 et la trame Q2.1-23 | EN ATTENTE (après vagues) |
| C1 4.1 — gabarit « avant ceux des autres » 21×23 | les trames Q2.1-21 et Q2.1-23 partagent le gabarit de fin | EN ATTENTE |
| C1 8.1 — registre grammatical des trames 21/22/24 | registre (« on » vs « je ») hétérogène entre les trois trames | EN ATTENTE |

Traitement type : arbitrage au moment de la **rotation des formulations** (déjà actée — FM-019 :
les 4 nouvelles formulations validées traiteront 4.1/8.1 par construction) ; noter tout résidu
après rotation ici.

## 3. Contrat de mélange des items de performance (FM future)

| Objet | Contenu | Statut |
|---|---|---|
| Énigmes 1.6 (É1→É3) | items de performance HORS contrat de mélange (ordre source) — une FM doit définir leur contrat propre (ordre, c5 sans-objet, pénalité écart de pôle 0.70 adossée) | EN ATTENTE (après vagues) |
| Quête 1.5 « L'épreuve du temps » | choix comportementaux + temps mesuré — contrat de mélange à concevoir à la matérialisation | EN ATTENTE |
| Énigmes/doublons — fenêtre | fenêtre des doublons « ≥ 2 semaines » : toujours non tranchée (renvoyée par FM-019 au comité) — à régler avec la FM performance | EN ATTENTE |

---

## Hors périmètre de ce backlog (rappel)

- Points comité encore ouverts non liés à la qualité : pondérations DTM_N (1.1), c2 sans-objet
  (1.2/1.3), dérogations 1.7 (miroir exempté, hors-Likert, ordre de consentement), régime de
  données du champ libre 1.7, réécriture d'historique git (formulations brûlées).
- Ces points restent listés dans les fichiers de quête correspondants et au document trames (Partie 6).
