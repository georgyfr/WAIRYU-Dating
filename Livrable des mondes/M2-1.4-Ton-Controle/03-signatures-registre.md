# LIVRABLE 3 — SIGNATURES ET VARIABLES EN JEU (format du registre)

> ⚠ **Seuils et fenêtres : ADOPTÉS comme valeurs de départ (décision comité, FM-019) — provisoire concepteur — re-signature professionnelle avant bêta.**
> **Marquage mission Phases A/B/C/D (point 4 — conversion du registre des signatures) :** chaque seuil ci-dessus porte le statut **« À VALIDER PAR LE COMITÉ »** — l'adoption FM-019 fixe la valeur de départ ; la re-signature professionnelle avant bêta reste requise.
> La quête 1.4 n'émet **aucune signature propre** : elle fournit des VARIABLES d'entrée au registre des
> signatures Monde 1 (source gelé, l. 5495-5777). Les signatures ci-dessous consomment ces variables au
> Portrait (ÉTAGE 3+) — jamais dans le miroir de la quête seule.

## Les variables fournies par la quête (dictionnaire §0.2 du registre — verbatim)

| Variable | Source | Domaine |
|---|---|---|
| **AC_D** | Auto-contrôle déclaré (Q1.4) | 0-1 |
| **AC_B** | Auto-contrôle comportemental (1.5) | 0-1 |
| **EC** | Écart de cohérence = \|AC_D − AC_B\| | 0-1 |
| IMP_B | Impulsivité comportementale (1 − AC_B) | 0-1 |

## SIG_COH_HAUTE (n° 1 — méta) — condition verbatim du registre

| ID | Conditions exactes (verbatim registre) | Conséquence (verbatim registre) |
|---|---|---|
| **SIG_COH_HAUTE** | **EC ≤ 0.15 ET garde QFI ≥ 0.60** ⚠ ADOPTÉ (FM-019) — provisoire concepteur | Gabarit GAB-LIGNE_COHERENCE : *« Et ça colle : tes mots et tes choix racontent la même histoire. »* + brique §1.3 du Portrait (la donnée rare) activée |

- Déclenchement au Portrait (ÉTAGE 3) — jamais au miroir de quête, jamais sur une carte.
- C'est la sortie calculée de la « ligne de cohérence » que la charte de la quête 1.5 affiche sur
  sa carte en cas de concordance — continuité Carte → Portrait garantie par le registre (§0.4, règle 1).

## SIG_COH_DIV (n° 2 — méta) — condition verbatim du registre

| ID | Conditions exactes (verbatim registre) | Conséquence (verbatim registre) |
|---|---|---|
| **SIG_COH_DIV** | **EC ≥ 0.30 ET garde QFI ≥ 0.60** ⚠ ADOPTÉ (FM-019) — provisoire concepteur | Brique spéciale DIV-M1-AC : le paragraphe de divergence (§2, placement prioritaire, slot ecart_coh) · Jamais dans la version Engagement (§5 porte sa traduction : « bâtis sur les accords définis à froid ») |

- Le paragraphe de divergence joue au Portrait de Monde M1 (les Portraits croisent déjà 1.4 × 1.5
  via AC_D/AC_B) — la quête 1.4 seule n'affiche JAMAIS cet écart à l'utilisateur.

## La règle de silence (verbatim registre)

> *(règle de silence)* — **0.15 < EC < 0.30** : Aucun affichage, jamais. L'écart modéré module en interne
> (AC_effectif = 0.6×AC_D + 0.4×AC_B) — la divergence n'est un contenu qu'au-delà de 0.30 ⚠
> bornes et pondération ADOPTÉ (FM-019) — provisoire concepteur.

## SIG_DGR_PRECURSEUR (n° 32 — sécurité, trame — JAMAIS visible)

> **SIG_DGR_PRECURSEUR — pré-signal DGR niveau 1 : l'évaluation complète attend le Monde 3 (argent) et le
> Monde 5 (tension) ; conditions et seuils : document trames, hors dépôt, canal privé — ADOPTÉ (FM-019) — provisoire concepteur.**

- ⚠ **AUCUN seuil de cette signature n'est écrit au dépôt** — ni dans ce fichier, ni ailleurs
  (doctrine de brûlage FM-018 / Constitution [11-b]). La conséquence verbatim du registre public est
  « pré-signal DGR niveau 1 — surveillance passive » ; les conditions exactes (deux variables et deux
  seuils) vivent exclusivement au document trames confidentiel, remis à l'implémenteur par canal privé
  au moment de l'intégration.
- La quête 1.4 est la source déclarative de ce pré-signal ; l'évaluation complète attend le Monde 3
  (argent) et le Monde 5 (tension). **Surveillance passive** : aucune conséquence narrative, aucune
  trace UI, aucun effet de matching au Monde 1.
- Rappel glossaire [4] : **DGR** = dangerosité réactive (impulsivité × instabilité) — sigle côté
  moteur uniquement, JAMAIS en UI.

## Notes de registre

- **Registre probabiliste obligatoire** : toute conséquence documentée dans un miroir s'exprime en
  « conduit fréquemment à », « la recherche documente que » — jamais au futur certain.
- La garde universelle (registre §0.4, règle 2) : aucune signature narrative ne se déclenche sous
  QFI < 0.60 — un profil peu fiable reçoit les versions prudentes, jamais les affirmations fortes.
- Les modulations des Mondes 2-5 s'ajoutent dans la variable effective (`_eff`) sans toucher aux
  règles — l'indirection variable/item garantit la stabilité des signatures.
- Fenêtres de calibration (cible_freq) de chaque signature : ADOPTÉ (FM-019) — provisoire concepteur.
