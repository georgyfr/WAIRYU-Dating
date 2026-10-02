# QUÊTE 1.5 « L'ÉPREUVE DU TEMPS » — FICHE DE CADRAGE PUIS LECTURE DU LIVRABLE

> Monde M2 · 🆓 gratuit · Socle · MVP · ⚡ tâche comportementale · 6 choix binaires · Codes gelés Q1.5-C1 → Q1.5-C6
> Source : Contrat d'Inventaire (1.5 « ⚡ L'épreuve du temps », 6 choix — Carte « Ce que tes choix révèlent » · Signal « Impulsivité comportementale → DGR (corrige 1.4) ») · Constitution v2.1 · FM-011 v2 (le code reste la clé)

## 🧭 FICHE DE CADRAGE (lire avant tout le reste)

| Champ | Cadrage |
|---|---|
| **Ce que ça mesure** | L'impulsivité COMPORTEMENTALE — pas déclarée : révélée. La personne choisit entre un bénéfice immédiat (A) et un bénéfice équivalent différé (B). La synthèse déclaratif/comportemental du contrat : *« Ce que tu choisis révèle plus que ce que tu dis »*. Côté moteur : le signal impulsivité comportemental → modulateur **DGR** (corrige 1.4). |
| **Format de réponse (NON-Likert)** | **6 choix binaires** A (immédiat) / B (différé), **hypothétiques assumés** (l'écran d'intro le pose sans détour). Un clic par choix, dans l'ordre canonique. Chaque choix porte la mesure du **temps de réponse** (écran → clic), sans l'afficher. |
| **Scoring** | Chaque A = +1 impulsivité comportementale. Score brut = nombre de A (0-6), normalisé `IMP_B = n_A / 6` ∈ [0,1]. La variable complémentaire `AC_B = 1 − IMP_B` (auto-contrôle comportemental) alimente l'écart de cohérence `EC = \|AC_D − AC_B\|` avec le déclaratif de 1.4 (variables verbatim du registre M1). Aucune « bonne réponse » : le score décrit un rapport au temps, il ne note rien. |
| **Cohérence interne** | Les 6 choix sont mutuellement cohérents **par design** : chaque binôme confronte deux options équivalentes en valeur perçue, un seul axe diverge (le temps). Il n'existe donc aucune paire d'énoncés contradictoires — **aucun profil de réponses ne peut se contredire** (un résultat mixte 3A/3B est un profil valide, intermédiaire). L'incohérence interne n'est donc pas une contradiction logique : elle est opérationnalisée par le **temps de réponse** (passation trop rapide pour lire, ou absente — SIG-1.5-02). Toute autre lecture serait une invention. |
| **Mélange** | **SANS OBJET — ordre canonique assumé, documenté** (`02-ordre-canonique.md`). Les 6 choix se succèdent un écran par choix, ordre C1 → C6 : la tâche comportementale n'a ni dimensions à alterner ni trames à ancrer ; le rejeu des 6 contraintes n'a pas de prise (justification complète au fichier 02). |
| **Signatures attendues** | SIG-1.5-01 « La main avant la tête » (impulsivité comportementale → modulateur DGR, double usage avec 1.4) · SIG-1.5-02 « Le temps trahi » (temps de réponse inattentif → QFI). Le croisement déclaratif × comportemental vit au **Portrait de Monde M2** (SIG_COH_HAUTE / SIG_COH_DIV, variables EC/AC_D/AC_B — verbatim registre M1) : **jamais** dans le miroir de la quête seule (Constitution [7]). |
| **Slots prévus** | Miroir **MOYEN** (6 items → gabarit 150-250 mots, Constitution [7]) · 5 profils par nombre de choix différés c = 0-6 · 3 slots de quête + le **slot de cohérence 1.4 × 1.5** documenté à part (ligne bonus si EC ≤ 0.15 — silence si divergence ; rendu à l'ÉTAGE 3, gabarit GAB-LIGNE_COHERENCE verbatim du registre). |
| **Points de doctrine** | ① Neutralité absolue : ni le piège évident (l'option immédiate dérisoire) ni la vertu affichée (l'option différée embellie) — chaque binôme est équivalent en valeur perçue. ② Zéro jugement du résultat : attendre n'est pas « mûr », céder n'est pas « faible » — la carte et le miroir décrivent une mécanique. ③ Le temps de réponse est collecté, jamais montré. ④ Aucune trame ▲ dans cette quête (vérifié au registre du mélange — sans objet de fait). ⑤ Gratuit ne présuppose jamais premium ([6]). |

## 📖 Lecture des fichiers (ordre conseillé)

1. `01-tableau-des-choix.md` — les 6 binômes (codes gelés, équivalences construites, fiches condensées).
2. `02-ordre-canonique.md` — l'ordre de passation SANS mélange (sans-objet documenté).
3. `03-signatures-registre.md` — les 2 signatures de quête + les variables du croisement 1.4 × 1.5.
4. `04-slots-de-miroir.md` — les slots du miroir MOYEN + le slot de cohérence (ÉTAGE 3).
5. `05-ecran-d-intro.md` — l'écran d'entrée (verbatim du contrat, hypothétiques assumés).
6. `06-fiche-computation-EXEMPLE.yaml` — le choix Q1.5-C1 déployé aux 5 canaux.
7. `07-miroir.md` — l'étage 2 : 5 profils par nombre de choix différés.
8. `cartes.yaml` — les 5 variantes de carte (étage 1, charte C1-C11).

## 🔄 Flux de production

```
cadrage (cette fiche) → rédaction des 6 binômes → ordre canonique (sans mélange, documenté)
→ signatures/slots/cartes/intro → validateur (linter)
→ auditeur hostile C1 (session séparée) → gouvernance D1
```

> Aucun fichier du dépôt contractuel n'est modifié par ce livrable (pas de git, pas de CI).

## Conformité a11y

Conformité a11y : WCAG 2.1 AA visée selon le format de la quête (contrastes ≥ 4,5:1, cibles tactiles ≥ 44×44 px, support lecteur d'écran, respect du mode réduit-animations). Implémentation : voir spec quête 1.1 §10 et styles.css.
