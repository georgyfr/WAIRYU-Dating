# WTC-Q3 — Rapport de validation « Ce qui me porte » (RIO-03)

> ⚠ D-SIM : résultats issus de simulations (seed 42) — la mécanique de mesure est validée ou non, pas la prévalence clinique.

> Rôle : EXÉCUTEUR STRICT — `wtc_q3_core.py` et `wtc_q3_simulator.py` exécutés TELS QUELS (deux réparations mécaniques minimales S-Q3-1 et S-Q3-14, cf. Section F). seed 42, ×2.

## A — Les 7 critères

| # | Critère | Seuil | Observé | Verdict |
|---|---|---|---|---|
| C1a | Anti-fabrication (SANS_FORCE → SILENCIEUSE) | 40/40 (100 %) | 0/40 | **FAIL** |
| C1b | Anti-négligence (G2 ≥ 1 force) | >= 82 % | 100.0 % | **PASS** |
| C1c | Conformité banque + limite 2 + SURCHARGE | 100 % banque + <= 2 + SURCHARGE 20/20 exactement 2 | banque 400/400 · max2 400/400 · SURCHARGE 20/20 exactement 2 | **PASS** |
| C2 | Vérité croisée (moteur == forces_vraies, 400) | >= 97 % | 91.25 % | **FAIL** |
| C3 | Miroir ASYM + c3 vides | 15/15 + c3 vides sans crash | 15/15 · crash vide: False | **PASS** |
| C4 | Reproductibilité ×2 (SHA-256) | SHA-256 identique ×2 | 3c9a17c3… vs 3c9a17c3… — IDENTIQUES | **PASS** |
| C5 | Affichage & honnêteté (a·b·c·d) | a·b·c·d 4/4 | a cas unitaire 1/1 (échantillon 0/475 SILENCIEUSES, cf. S-Q3-15) · b 20/20 · c 4/4 statuts · d OK | **PASS** |

**Verdict : À CORRIGER — 5/7 PASS — note 6/10** (déclaré a priori : 10 × (PASS/7), −1 si C1a FAIL (éliminatoire), arrondi au demi-point).

Détail des pièges : SANS_FORCE 0/40 SILENCIEUSES (les 40 autres reçoivent F6 via la voie B « ZONE CALME », cf. S-Q3-2) · SURCHARGE 20/20 exactement 2, retenues F1 · F3 (règle de densité), exclues ex. F2, F4, F5, F6.

## B — La matrice des forces

| Groupe | F1 | F2 | F3 | F4 | F5 | F6 | 0 force | 1 | 2 |
|---|---|---|---|---|---|---|---|---|---|
| G1_force_faible | 101 | 47 | 9 | 19 | 11 | 104 | 0 | 9 | 141 |
| G2_force_claire | 71 | 21 | 23 | 25 | 8 | 91 | 0 | 1 | 119 |
| G3_perdre_vive | 54 | 6 | 78 | 11 | 5 | 6 | 0 | 0 | 80 |
| G4_dependre | 50 | 30 | 7 | 4 | 4 | 4 | 0 | 1 | 49 |

Exclues par densité (SURCHARGE, listées) : F2, F4, F5, F6.

## C — Statistiques par groupe vs bornes D-STD (§4 du package)

| Groupe | ≥ 1 force observé | SILENCIEUSES observé | Borne D-STD du package | Écart |
|---|---|---|---|---|
| G1_force_faible | 100.0 % | 0.0 % | 35-50 % SILENCIEUSES attendues | **ÉCART MAJEUR (S-Q3-2)** |
| G2_force_claire | 100.0 % | 0.0 % | 85-92 % ≥ 1 force | documenté |
| G3_perdre_vive | 100.0 % | 0.0 % | 75-90 % ≥ 1 force | documenté |
| G4_dependre | 100.0 % | 0.0 % | 75-90 % ≥ 1 force | documenté |

Plafond de coïncidence C2 : 100 % attendu par le package — observé **91.25 %** (365/400) : contredit par la divergence moteur/simulateur sur la voie A de F1 (cf. S-Q3-5). Écarts aux bornes = signalements, pas des surprises.

## D — Quatre exemples tracés de bout en bout

**D-1 · SILENCIEUSE (gabarit affiché)** — aucun profil SILENCIEUSE dans G1 (0/150, cf. S-Q3-2) — exemple pris dans le piège SANS_FORCE. Gabarit : « SILENCIEUSE — rien n'est encore assez marqué pour être nommé ; c'est un constat, pas un défaut. ». Cas unitaire du test C5a : profil sans aucune voie (label ≠ ZONE CALME) → silencieuse True, vérité [] — accord moteur/vérité : True.

**D-2 · G2 à 2 forces** — entrées : C1 PRES · C2 3 · C3 ['E', 'H', 'Pr'] · sA 2.436 · sB 2.574 · label ZONE CALME → forces ['F2', 'F6'] ; voies A/B/C tracées dans `exemples_trace.json`.

**D-3 · SURCHARGE** — retenues ['F1', 'F3'] · exclues par densité ['F2', 'F4', 'F5', 'F6'] (jamais plus de 2).

**D-4 · ASYM_MIROIR** — partages [] · secrets ['C', 'E', 'H'] · interprétation : « certaines de tes forces restent invisibles à tes yeux » (aucun terme de défaut).

## E — L'analyse du positif

- Répartition par type de force : voir matrice (Section B) — la voie B « ZONE CALME » est satisfaite pour la totalité des G1/G2 (S-Q3-2) : F6 participe à 104/150 et 91/120 profils après application de la limite des 2 forces, ce qui domine toutes les autres voies ;
- Part des voies : A 746 · B 425 · C 398 voies vraies parmi les forces retenues (dont journal : 398) ;
- **Test anti-invention sur l'ensemble (475 profils)** : 0 force produite sans condition remplie — le positif n'est jamais généré par le moteur, il est sélectionné ; le défaut de fabrication est dans la spécification de la voie B (S-Q3-2), pas dans le moteur.

## F — Bugs et incohérences signalés (sans correction libre)

| # | Signalement | Nature |
|---|---|---|
| S-Q3-1 | `rng.sample()` n'existe pas sur `numpy.random.Generator` → `AttributeError` à l'import du simulateur (GROUPES construits au chargement). **Réparation mécanique au strict minimum** : `choice(size=4, replace=False)`, même sémantique, même rng seedé 42 ; traceback archivé (`signalement_SQ3-1_traceback.txt`) | bloquant, réparé |
| S-Q3-2 | `cond_B` : voie B de F6 = `label_ombre == "ZONE CALME"` — **absente de la table de la banque (§1 : F6 = C3 T/Pr ou journal T+M ≥ 4/7)**. Les pièges SANS_FORCE portent « ZONE CALME » → F6 fabriquée sur des profils sans aucune voie → **C1a 0/40** et la borne D-STD G1 (35-50 % SILENCIEUSES) inatteignable (plafond réel 0 %) | structurel, éliminatoire |
| S-Q3-3 | `cond_A` : `a["F1"]` assignée deux fois (ligne morte puis ligne active) — redondance **pré-documentée** (D-CHECK), la seconde prévaut | pré-documenté |
| S-Q3-4 | La voie tabulaire F1 « C1 espace ≥ 2 ET score_B ≥ 2,61 » n'est pas implémentée : ESP active F1 sans condition sur score_B (`sB` est un paramètre mort de `cond_A`) ; et `_c1v >= 2` inclut SOL (pondéré 2), absente de la table (F1 : « présence ≥ 2 ») | écart cahier vs table |
| S-Q3-5 | `forces_vraies` (simulateur) : F1-A = (PRES ou ESP) ou `c2 >= 2` — diffère du moteur (toute option ≥ 2 ; c2 absent) → désaccords C2 mesurés (cf. Section A) | divergence moteur/simulateur |
| S-Q3-6 | `gen()` : paramètre `p_c2` jamais utilisé (c2 tiré de la distribution fixe [0,1,2,3] pour tous les groupes — les bornes G2 « C2 ≥ 2 dans ~50 % » restent cohérentes par coïncidence, la distribution fixe ≈ 50 %) | paramètre mort |
| S-Q3-7 | `gen()` : `c1 = np.random.default_rng()` créé à chaque itération et jamais utilisé (code mort ; sans impact sur le déterminisme, tout passe par le rng seedé 42) | code mort |
| S-Q3-8 | `gen()` : `label_ombre` dérivé de muA/muB du groupe et non des scores du profil — tous les profils d'un groupe partagent le même label (amplifie S-Q3-2 sur G1/G2) | spécification |
| S-Q3-9 | `coherence_miroir` : branche else (c3 et c4 vides) renvoie la clé `presume` au lieu de `presumes` (incohérence de schéma, sans crash) | mineur |
| S-Q3-10 | `cond_journal_like` (simulateur) ne vérifie pas `complete` — un journal partiel serait compté ; sans impact ici (le simulateur ne génère que des journaux complets) | mineur |
| S-Q3-11 | `journal_statut` : statut SILENCIEUX (N ≥ 5) inatteignable via le simulateur (N ∈ [0,3)) ; commentaire « + phrase d'accueil : » tronqué (spécification d'affichage incomplète) | mineur |
| S-Q3-12 | Les templates d'affichage des 6 forces et de SILENCIEUSE ne sont pas fournis dans le package (le moteur livre le statut) — C5a vérifié sur le gabarit honnête du pipeline de validation | mineur |
| S-Q3-13 | Exigence Section D « 1 G1 SILENCIEUSE » irréalisable : 0/150 SILENCIEUSES dans G1 (conséquence directe de S-Q3-2) — l'exemple est fourni depuis SANS_FORCE | conséquence |
| S-Q3-14 | `forces_vraies` (simulateur) : `cb["F4"]` et `cb["F5"]` non définies mais lues → `KeyError: 'F4'` sur tout appel. **Réparation mécanique au strict minimum** : deux clés `False`, identiques à `cond_B` du cahier (« pas de voie B ») ; traceback archivé (`signalement_SQ3-14_traceback.txt`) | bloquant, réparé |
| S-Q3-15 | **Zéro SILENCIEUSE dans tout l'échantillon (0/475)** — conséquence directe de S-Q3-2 : le test C5a sur l'échantillon est vide ; il est réalisé par cas unitaire (profil mécaniquement sans voie, label ≠ ZONE CALME) et devra être re-testé sur l'échantillon après correction de S-Q3-2 | conséquence |

## G — Verdict final

- **VERDICT : À CORRIGER** — 5/7 critères PASS, FAIL : C1a, C2 ;
- **Note : 6/10** (déclaré a priori : 10 × (PASS/7), −1 si C1a FAIL (éliminatoire), arrondi au demi-point) ;
- Reproductibilité ×2 (seed 42) : SHA-256 du bundle de données `3c9a17c39c12e4d4…` — identiques ;
- Publication : `WAIRYU-Dating/Wairyu thérapie couple/validation-q3/` (src · results · figures + README avec liens directs) ;
- ⚠ D-SIM : résultats issus de simulations (seed 42) — la mécanique de mesure est validée ou non, pas la prévalence clinique.

---

### Fiche de validation

```
════════════════════════════════════════════════════════
FICHE WTC-Q3 — « Ce qui me porte »
Exécuté par Data Insight · 2026-10-15 · seed 42 · commit 09b8683 (publication)
C1a anti-fabrication 40/40       :     0/40  FAIL
C1b anti-négligence ≥ 82 %       :  100.0 %  PASS
C1c banque + limite 2 (20/20)    : banque 400/400 · max2 400/400 · SURCHARGE 20/20 exactement 2  PASS
C2 vérité croisée ≥ 97 %         :  91.25 %  FAIL
C3 miroir 15/15                  : 15/15 · crash vide: False  PASS
C4 reproductibilité SHA-256 ×2   : identiques  PASS
C5 affichage 4 sous-tests        : a cas unitaire 1/1 (échantillon 0/475 SILENCIEUSES, cf. S-Q3-15) · b 20/20 · c 4/4 statuts · d OK  PASS
VERDICT AGENT : À CORRIGER · Note : 6/10
⚠ D-SIM : résultats issus de simulations (seed 42) — la
   mécanique est validée, pas la prévalence clinique.
Contresignature GLM : [lecture, arbitrage, insertion RIO-03]
════════════════════════════════════════════════════════

```
