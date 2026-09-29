# LIVRABLE 3 — SIGNATURES ATTENDUES DE LA QUÊTE 1.5 (format du registre)

> ⚠ **Seuils et fenêtres : ADOPTÉS comme valeurs de départ (décision comité, FM-019) — provisoire
> concepteur — re-signature professionnelle avant bêta**, sauf mention contraire explicite.
> Aucune signature de sécurité (trame) n'est attachée à cette quête — vérifié au registre (n_trames = 0).

## Les variables fournies par la quête (dictionnaire §0.2 du registre M1 — continuité verbatim)

| Variable | Source | Domaine |
|---|---|---|
| **IMP_B** | Impulsivité comportementale (1.5) = n_A / 6 | 0-1 |
| **AC_B** | Auto-contrôle comportemental (1.5) = 1 − IMP_B | 0-1 |
| **EC** | Écart de cohérence = \|AC_D − AC_B\| (AC_D fourni par 1.4) | 0-1 |

> Ces trois variables sont la moitié comportementale du croisement déclaratif × comportemental du
> contrat. Leur consommation (SIG_COH_HAUTE / SIG_COH_DIV) opère au Portrait de Monde M2 (ÉTAGE 3)
> — verbatim registre 1.4 : *« la quête 1.4 n'émet aucune signature propre : elle fournit des
> variables d'entrée »*. La quête 1.5 fait de même, avec deux signatures propres ci-dessous.

| ID | Nom | Conditions exactes | Conséquence | Source | Fenêtre cible |
|---|---|---|---|---|---|
| **SIG-1.5-01** | La main avant la tête | `IMP_B ≥ T_IMP` (seuil de déclenchement ⚠ — provisoire concepteur, valeur consignée hors dépôt) **ET** garde QFI ≥ 0.60 | **Modulateur DGR** : l'impulsivité comportementale mesurée module le signal dangerosité réactive côté moteur — correction du déclaratif (1.4), le comportement prime progressivement (courbe J+90, verbatim 1.4). Aucune trace UI : le modulateur ajuste des poids, il ne commente personne | 6 choix binaires (A = +1) | recalcul à chaque passation ⚠ |
| **SIG-1.5-02** | Le temps trahi | Temps de réponse médian < 1,5 s sur les 6 choix **OU** ≥ 1 choix sans temps mesurable (réponse hors session) — seuils ⚠ À VALIDER PAR LE COMITÉ | Drapeau **QFI** (passation inattentive) : le score IMP_B du membre est déflaté côté moteur (prudence), sans aucune trace rendue — jamais au match, jamais dans les portraits | temps de réponse par choix (6 mesures) | < 5 % ⚠ |

## Notes de registre

- **Registre probabiliste obligatoire** : toute conséquence documentée dans un miroir s'exprime en
  « conduit fréquemment à », « la recherche documente que » — jamais « tu finiras par ».
- **SIG-1.5-01 est un modulateur, pas un verdict** : l'impulsivité comportementale corrige le déclaratif
  (1.4) — elle ne qualifie personne. Le contrat : *« l'impulsivité générale prédit mal l'impulsivité
  par domaine »* — le modulateur atténue donc, il n'alerte pas.
- **SIG-1.5-02 est un signal de fiabilité (QFI)** : zéro texte, zéro slot, zéro citation — sa seule
  sortie est côté moteur (déflation de prudence du score du membre).
- **Le croisement 1.4 × 1.5 (EC)** n'est PAS une signature de cette quête : il vit au Portrait de
  Monde M2 (SIG_COH_HAUTE / SIG_COH_DIV, conditions verbatim du registre — EC ≤ 0.15 / EC ≥ 0.30,
  garde QFI ≥ 0.60, ADOPTÉS FM-019). Les deux signatures de cette quête s'ajoutent au registre M2
  sans modifier les conditions verbatim du croisement.
- Les seuils T_IMP et les bornes de temps restent au **document trames (hors dépôt, canal privé)**
  ou marqués « À VALIDER PAR LE COMITÉ » — jamais gravés ici (verrou [9] · règle 11-b pour ce qui
  relève des trames ; ici aucune trame n'existe, seul le verrou des seuils s'applique).
- Les 2 signatures sont rejouées contre les portraits du Monde selon le protocole du Registre des
  Signatures (test de non-régression à maintenir).
