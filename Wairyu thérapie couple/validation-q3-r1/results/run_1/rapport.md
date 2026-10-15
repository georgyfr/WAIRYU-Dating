# WTC-Q3-R1 — Rapport de révision « Ce qui me porte » (RIO-03)

> ⚠ D-SIM : résultats issus de simulations (seed 42) — la mécanique de mesure est validée ou non, pas la prévalence clinique.

> Rôle : EXÉCUTEUR STRICT — `wtc_q3_core_r1.py` et `wtc_q3_simulator_r1.py` exécutés TELS QUELS. seed 42, ×2. Bornes D-STD R1 calculées AVANT les runs par `wtc_q3_ddstd_r1.py` (Monte-Carlo 1M/groupe, seed 20261015 — indépendant).

## A — Les 7 critères

| # | Critère | Seuil | Observé | Verdict |
|---|---|---|---|---|
| C1a | Anti-fabrication (SANS_FORCE → SILENCIEUSE) | 40/40 (100 %) | 40/40 | **PASS** |
| C1b | Anti-négligence (G2 ≥ 1 force) | >= 82 % | 100.0 % | **PASS** |
| C1c | Conformité banque + limite 2 + SURCHARGE | 100 % banque + <= 2 + SURCHARGE 20/20 exactement 2 | banque 400/400 · max2 400/400 · SURCHARGE 20/20 exactement 2 | **PASS** |
| C2 | Vérité croisée (moteur == forces_vraies, 400) | >= 97 % | 100.00 % | **PASS** |
| C3 | Miroir ASYM + c3 vides | 15/15 + c3 vides sans crash | 15/15 · crash vide: False | **PASS** |
| C4 | Reproductibilité ×2 (SHA-256) | SHA-256 identique ×2 | 1e445ea8… vs 1e445ea8… — IDENTIQUES | **PASS** |
| C5 | Affichage & honnêteté (a·b·c·d) | a·b·c·d 4/4 | a 1/1 cas unitaire + échantillon 61/475 SILENCIEUSES (S-Q3-15 re-testée) · b 20/20 · c 4/4 statuts (S-Q3-11 re-testée : SILENCIEUX atteignable) · d templates 6/6 fournis (S-Q3-12 clos) | **PASS** |

**Verdict : VALIDÉ — 7/7 PASS — note 10/10** (déclaré a priori : 10 × (PASS/7), −1 si C1a FAIL (éliminatoire), arrondi au demi-point).

Détail des pièges : SANS_FORCE 40/40 SILENCIEUSES (D-Q3-R1-A : le label d'ombre ne crée plus de force) · SURCHARGE 20/20 exactement 2, retenues F1 · F3 (règle de densité), exclues ex. F2, F4, F5, F6.

## B — La matrice des forces

| Groupe | F1 | F2 | F3 | F4 | F5 | F6 | 0 force | 1 | 2 |
|---|---|---|---|---|---|---|---|---|---|
| G1_force_faible | 50 | 52 | 39 | 42 | 17 | 23 | 21 | 35 | 94 |
| G2_force_claire | 79 | 69 | 33 | 35 | 10 | 14 | 0 | 0 | 120 |
| G3_perdre_vive | 34 | 24 | 78 | 11 | 4 | 9 | 0 | 0 | 80 |
| G4_dependre | 50 | 37 | 2 | 6 | 3 | 2 | 0 | 0 | 50 |

Exclues par densité (SURCHARGE, listées) : F2, F4, F5, F6.

## C — Statistiques par groupe vs bornes D-STD R1 (recalculées par géométrie, seed 20261015)

| Groupe | ≥ 1 force observé | SILENCIEUSES observé | Plafond géométrique ≥ 1 force | Intervalle officiel n | Écart |
|---|---|---|---|---|---|
| G1_force_faible | 86.0 % | 14.0 % | 85.457 % | [76.82 ; 94.09] % | dans la borne |
| G2_force_claire | 100.0 % | 0.0 % | 99.941 % | [99.28 ; 100.0] % | dans la borne |
| G3_perdre_vive | 100.0 % | 0.0 % | 99.993 % | [99.71 ; 100.0] % | dans la borne |
| G4_dependre | 100.0 % | 0.0 % | 99.995 % | [99.7 ; 100.0] % | dans la borne |

**Écart D-STD documenté (S-Q3-R1-1)** : le package Q3 déclarait « 35-50 % SILENCIEUSES attendues » pour G1 — la géométrie même du cahier (p_c1_pres 0,20 · c2 ~ N(1,0) · journal 0,4 · C3 0,15) donne un plafond de 14.543 % de SILENCIEUSES : la borne d'intention n'était PAS atteignable par la géométrie qu'elle résume (faute de spécification du cahier, attrapée par la règle permanente D-STD). Les seuils des critères sont inchangés (C1b ≥ 82 % : 17.94 pts sous le plafond G2 · C2 ≥ 97 % : 3 pts sous le plafond 100 %).

Plafond de coïncidence C2 : 100 % (moteur == vérité, D-Q3-R1-B) — observé **100.00 %** (400/400).

## D — Quatre exemples tracés de bout en bout

**D-1 · SILENCIEUSE (G1 réelle, S-Q3-13 re-testée)** — S-Q3-13 re-testée : une G1 SILENCIEUSE existe dans l'échantillon depuis D-Q3-R1-A (G1 id 14). Gabarit : « SILENCIEUSE — rien n'est encore assez marqué pour être nommé ; c'est un constat, pas un défaut. ».

Cas unitaire du test C5a : profil mécaniquement sans voie → silencieuse True, vérité [] — accord moteur/vérité : True.

**D-2 · G2 à 2 forces** — entrées : C1 PRES · C2 3 · C3 ['E', 'H', 'Pr'] · sA 2.677 · sB 2.031 · label PEUR DE PERDRE → forces ['F1', 'F2'] ; voies A/B/C tracées dans `exemples_trace.json`.

**D-3 · SURCHARGE** — retenues ['F1', 'F3'] · exclues par densité ['F2', 'F4', 'F5', 'F6'] (jamais plus de 2).

**D-4 · ASYM_MIROIR** — partages [] · secrets ['C', 'E', 'H'] · interprétation : « certaines de tes forces restent invisibles à tes yeux » (aucun terme de défaut).

## E — L'analyse du positif

- Répartition par type de force : voir matrice (Section B) — depuis D-Q3-R1-A, F6 ne vient plus que de ses voies de la banque (C3 T/Pr · journal T+M ≥ 4/7) ;
- Part des voies : A 682 · B 187 · C 377 voies vraies parmi les forces retenues (dont journal : 377) ;
- **Test anti-invention sur l'ensemble (475 profils)** : 0 force produite sans condition remplie — le positif n'est jamais généré par le moteur, il est sélectionné ;

- **SILENCIEUSES dans l'échantillon : 61/475** (S-Q3-15 re-testée : le test C5a porte maintenant sur des cas réels, plus seulement le cas unitaire).

## F — Sort des 15 signalements du run initial

| # | Signalement (Q3) | Sort dans R1 |
|---|---|---|
| S-Q3-1 | rng.sample() inexistant (AttributeError) | ABSORBÉ — le simulateur R1 écrit `choice(size=4, replace=False)` directement |
| S-Q3-2 | voie B de F6 `ZONE CALME` absente de la banque (éliminatoire) | **CLOS par D-Q3-R1-A** — voie B supprimée, cond_B["F6"] = False |
| S-Q3-3 | a["F1"] assignée deux fois | **CLOS par D-Q3-R1-B** — assignation unique |
| S-Q3-4 | voie tabulaire F1 « espace ≥ 2 ET score_B ≥ 2,61 » non implémentée ; SOL inclus à tort | **CLOS par D-Q3-R1-B** — F1-A = PRES OU (ESP ET sB ≥ 2,61), SOL exclu, sB vivant |
| S-Q3-5 | forces_vraies F1-A = (PRES ou ESP) ou c2 ≥ 2 (divergence) | **CLOS par D-Q3-R1-B** — la vérité implémente la même table (c2 retiré de F1) |
| S-Q3-6 | p_c2 jamais utilisé | **CLOS par D-Q3-R1-D** — c2 ~ N(p_c2, 1) écrêté [0,3] |
| S-Q3-7 | c1 = np.random.default_rng() code mort | **CLOS par D-Q3-R1-E** — supprimé |
| S-Q3-8 | label_ombre dérivé du groupe | **CLOS par D-Q3-R1-C** — dérivé des scores du profil (sans effet sur les forces) |
| S-Q3-9 | branche vide renvoie `presume` | **CLOS par D-Q3-R1-F** — clé `presumes` cohérente |
| S-Q3-10 | cond_journal_like ne vérifie pas complete | **CLOS par D-Q3-R1-G** — vérification ajoutée |
| S-Q3-11 | statut SILENCIEUX inatteignable via simulateur ; commentaire tronqué | **CLOS par D-Q3-R1-H** — N ∈ [0,8) (4/4 statuts atteignables, mesuré au C5c) ; affichages complétés |
| S-Q3-12 | templates d'affichage non fournis | **CLOS par D-Q3-R1-H** — 6 templates + SILENCIEUSE fournis par l'orchestrateur (gabarits de validation honnêtes ; intitulés cliniques au cahier RIO-03) |
| S-Q3-13 | « 1 G1 SILENCIEUSE » irréalisable | **EFFACÉ** — conséquence de S-Q3-2 ; re-testée en Section D |
| S-Q3-14 | cb["F4"]/cb["F5"] KeyError | ABSORBÉ — défini False dans le code corrigé |
| S-Q3-15 | 0/475 SILENCIEUSES (C5a vide sur échantillon) | **EFFACÉ** — conséquence de S-Q3-2 ; re-testé en C5a et Section E |

**Nouveau signalement R1** :

| # | Signalement | Nature |
|---|---|---|
| S-Q3-R1-1 | Borne D-STD G1 du package Q3 (« 35-50 % SILENCIEUSES ») inatteignable par la géométrie du cahier — plafond réel 14,5 % (Section C) | bornes d'intention vs géométrie (documenté, sans impact critère) |

## G — Verdict final

- **VERDICT : VALIDÉ** — 7/7 critères PASS, FAIL : aucun ;
- **Note : 10/10** (déclaré a priori : 10 × (PASS/7), −1 si C1a FAIL (éliminatoire), arrondi au demi-point) ;
- Reproductibilité ×2 (seed 42) : SHA-256 du bundle de données `1e445ea8956c88c1…` — identiques ;
- Publication : `WAIRYU-Dating/Wairyu thérapie couple/validation-q3-r1/` (src · results · figures + README avec liens directs) ;
- ⚠ D-SIM : résultats issus de simulations (seed 42) — la mécanique de mesure est validée ou non, pas la prévalence clinique.

---

### Fiche de validation

```
════════════════════════════════════════════════════════
FICHE WTC-Q3-R1 — « Ce qui me porte » (révision)
Exécuté par Data Insight · 2026-10-15 · seed 42 · commit [push]
C1a anti-fabrication 40/40       :    40/40  PASS
C1b anti-négligence ≥ 82 %       :  100.0 %  PASS
C1c banque + limite 2 (20/20)    : banque 400/400 · max2 400/400 · SURCHARGE 20/20 exactement 2  PASS
C2 vérité croisée ≥ 97 %         : 100.00 %  PASS
C3 miroir 15/15                  : 15/15 · crash vide: False  PASS
C4 reproductibilité SHA-256 ×2   : identiques  PASS
C5 affichage 4 sous-tests        : a 1/1 cas unitaire + échantillon 61/475 SILENCIEUSES (S-Q3-15 re-testée) · b 20/20 · c 4/4 statuts (S-Q3-11 re-testée : SILENCIEUX atteignable) · d templates 6/6 fournis (S-Q3-12 clos)  PASS
VERDICT AGENT : VALIDÉ · Note : 10/10
⚠ D-SIM : résultats issus de simulations (seed 42) — la
   mécanique est validée, pas la prévalence clinique.
Contresignature GLM : [lecture, arbitrage, insertion RIO-03]
════════════════════════════════════════════════════════

```
