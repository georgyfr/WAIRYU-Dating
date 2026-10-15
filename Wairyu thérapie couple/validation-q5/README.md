# WTC-Q5 — « Mon premier pas » (pas + suivi 14 jours)

> **AVERTISSEMENT D-SIM** : résultats issus de simulations (seed 42) —
> la mécanique est validée, pas la prévalence clinique.

## Verdict : **VALIDÉ — 5/5 critères** — note **10/10** — Dimension attachement COMPLÈTE 5/5

| Critère | Attendu | Obtenu | Verdict |
|---------|---------|--------|---------|
| **C1** Suivi déterministe | ≥ 97 % | **100,0 %** (180/180) | ✅ PASS |
| **C2** Anti-perfectionnisme (9/14, 7/14, 3/14) | 3/3 cas + 0 sanction | **3/3 cas conformes**, 0 violation | ✅ PASS |
| **C3** Pas par face + empreinte (traçabilité Q1-Q2) | ≥ 97 % + 0 désaccord | **100,0 %** (180/180, 0 désaccord moteur/sim) | ✅ PASS |
| **C4** SHA-256 ×2 (seed 42) | identiques | **identiques** | ✅ PASS |
| **C5** Affichage (rappels doux, compteurs privés, D-SIM) | ≥ 97 % | **100,0 %** (180/180) | ✅ PASS |

**SHA-256 (×2, seed 42)** : `015f7e9dfbe4e24b9b089891967295e7a9877b7760adf94a0f94c0673a69c596`

**Note** : 10/10 (0 FAIL).

---

## Dimension attachement : COMPLÈTE 5/5

Avec Q5 validé, la dimension fondatrice du projet WAIRYU est complète :

| Quête | RIO | Instrument | Statut |
|-------|-----|------------|--------|
| Q1 | RIO-01 | « Comment je me raccroche » (attachement) | ✅ VALIDÉ |
| Q2 | RIO-02 | « Ce qui m'effraie vraiment » (l'ombre) | ✅ VALIDÉ |
| Q3 | RIO-03 | « Ce qui me porte » (le positif) | ✅ VALIDÉ |
| Q4 | RIO-04 | « Notre danse » (croisement de couple) | ✅ VALIDÉ (option a) |
| Q5 | RIO-05 | « Mon premier pas » (pas + suivi) | ✅ VALIDÉ — à contresigner |

**Prochaine grande mission** : pilote réel **WTC-VALID-01** (150-200 répondants) —
les paramètres simulés seront remplacés par des données réelles, et les
percentiles (Q4) + les bornes D-STD (Q3-J, Q4-2) seront recalibrés.

## D-STD recalculé d'emblée + D-STD-2 (leçon Q4)

| Critère | Plafond (global) | Plafond min (par config) | Seuil |
|---------|------------------|---------------------------|-------|
| C1 suivi déterministe | 100,0 % | — | 97,00 % |
| C2 anti-perfectionnisme | 100,0 % | — (déterministe) | 97,0 % |
| C3 pas par face+empreinte | 100,0 % | **100,0 %** (9 configs) | 97,00 % |
| C5 affichage | 100,0 % | — | 97,0 % |

**D-STD-2 appliquée** : le plafond C3 est calculé pour chacune des 9
configurations (face × empreinte). Toutes à 100 % → aucune config
injoignable (contrairement à D-Q4-1 où MIXTE_POURSUITE_FEU était à 0 %
et invisible dans la moyenne globale).

## Principes non négociables — tous respectés

1. ✅ **Anti-perfectionnisme** : 9/14 = célébré, jamais de sanction
   (vérifié par `verifier_anti_perfectionnisme()` — C2).
2. ✅ **Rappels doux, jamais culpabilisants** : aucun « tu dois »,
   « tu devrais », « une obligation » (au sens prescriptif) dans les
   rappels (vérifié par `verifier_rappels_doux()` — C5, après D-Q5-1).
3. ✅ **Compteurs privés** : `compteur_prive = True` — le taux de
   tenue n'est jamais exposé socialement.
4. ✅ **Pas sélectionné par Q1 + Q2** : la trace pointe vers la face
   dominante (Q1) et l'empreinte (Q2).
5. ✅ **Re-test Q1 jamais forcé** : `force = False`, message doux
   « tu le fais quand tu es prêt(e) ».
6. ✅ **D-SIM affiché** : avertissement présent dans l'affichage de
   chaque bilan.

## Signalements

| ID | Description | Statut |
|----|-------------|--------|
| **D-Q5-1** | Faux positif du vérificateur `verifier_rappels_doux()` : le mot « obligation » était détecté même dans « Pas une obligation » (anti-culpabilisant). Détection par C5 (180 violations au run initial). | ✅ Corrigé (regex `(?<!pas )une obligation`) |
| **D-STD-2** | Plafond PAR CONFIGURATION appliqué d'emblée. 9/9 configs à 100 %. | ✅ Appliqué |
| **Faute n°15** | Seuil posé avant plafond par configuration (close au Q4) | ✅ Close |

## Les 6 pas (banque fermée)

| Pas | Label | Face(s) + empreinte(s) associée(s) |
|-----|-------|-------------------------------------|
| P1 | Poser une présence simple | RASSUREE × ZONE_CALME |
| P2 | Nommer la peur quand elle vient | RASSUREE×PEUR_DE_PERDRE, EN_QUETE×ZONE_CALME |
| P3 | Garder l'espace sans rupture | RASSUREE×PEUR_D_ETRE_ETOUFFEE, SUR_LA_RA×ZONE_CALME |
| P4 | Demander sans exiger | EN_QUETE × PEUR_DE_PERDRE |
| P5 | Tenir le lien à distance | EN_QUETE×PEUR_D_ETRE_ETOUFFEE, SUR_LA_RA×PEUR_DE_PERDRE |
| P6 | Desserrer la garde un peu | SUR_LA_RA × PEUR_D_ETRE_ETOUFFEE |

## Les 3 messages de suivi (anti-perfectionnisme, mot pour mot)

- **CELEBRE** (≥ 9/14) : « Tu as tenu 9 jours sur 14 (ou plus). C'est une
  assise réelle — pas un échec les jours manqués. »
- **AJUSTEMENT** (7-8/14) : « Tu as tenu 7 jours sur 14. C'est un début
  d'assise — pas un échec. Les jours manqués ne sont pas une faute. »
- **REPRISE** (≤ 6/14) : « Tu as tenu 3 jours sur 14. Ce n'est pas un
  échec — c'est un signal. La suite du parcours t'aide à le reprendre,
  autrement, sans pression. »

**Jamais de sanction. Jamais de culpabilisation.** Le compteur est privé.

## Arborescence

```
validation-q5/
├── README.md                          (ce fichier — verdict en tête)
├── src/
│   ├── wtc_q5_core.py                 (6 pas + 3 messages + rappels + re-test Q1)
│   ├── wtc_q5_simulator.py            (180 profils, 3 groupes, pas_vrai)
│   └── wtc_q5_validation.py           (D-STD + D-STD-2 + 5 critères + 4 figures + rapport)
├── results/
│   ├── rapport-q5-2026-10-15.md       (7 sections)
│   ├── resultats-q5-2026-10-15.json
│   └── fingerprint-2026-10-15.json
└── figures/
    ├── fig1_c2_anti_perfectionnisme.png   (1920×1080, 150 DPI, Okabe-Ito)
    ├── fig2_c3_plafond_par_config.png
    ├── fig3_distribution_pas.png
    └── fig4_categories_suivi.png
```

## Publication

Package prêt à publier — **attente du pont humain** pour push GitHub
dans `WAIRYU-Dating → Wairyu thérapie couple/validation-q5/`. Commit
suggéré : `validation-q5: VALIDÉ 5/5 (SHA-256 015f7e9d, seed 42 ×2) —
dimension attachement complète 5/5 — D-Q5-1 corrigé — D-STD-2 appliqué`.

## Le cycle de la dimension attachement

Cinq packages validés (RIO-01 à RIO-05), cinq verdicts initiaux dont
quatre « À CORRIGER » (Q1-r1, Q2-r1, Q3-r1, Q4 arbitré), tous justifiés
et corrigés. Quinze fautes d'orchestrateur détectées et corrigées. La
preuve que le circuit survit à son transfert de superviseur : le
nouveau superviseur a recalculé D-STD d'emblée, détecté un bug de
duplication (D-Q4-1), refusé de serrer les distributions, proposé une
recommandation argumentée — et maintenant valide Q5 à 10/10 avec
D-STD-2 appliquée. **Le projet est passé de « un chat qui se souvient »
à « une méthode qui fonctionne partout ».**
