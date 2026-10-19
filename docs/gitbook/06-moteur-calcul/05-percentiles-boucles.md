# Percentiles mid-rank, boucles et styles

> Les croisements à deux (RIO-04, RIO-09, RIO-14, RIO-17) partagent trois
> mécaniques transversales : le percentile de chaque rive, la boucle
> détectée par écart de percentiles, et les styles comparés par
> dispersion.

## Le percentile mid-rank

```
pct = round(100 × (inférieurs + 0,5 × égaux) / n, 1)
```

La méthode **mid-rank** place les ex æquo au milieu de leur rang — un score
identique au score de k autres profils ne « domine » personne fictivement.
Population de référence (santé mentale et générationnelle) : **2 000
couples/profils, seed 42, μ rive ~ N(3,0 ; 0,8)** borné [1,5] + bruit item
σ 0,60 — **statut : placeholder L2**, à remplacer par les données réelles
du pilote VALID-01. (Repères attachement Q4 : SEREIN 25 · PRÉOCCUPÉ 70 ·
DÉTACHÉ 20 · EN ALERTFEU 85 — « repères D-SIM, à recalibrer au pilote ».)

## La boucle (seuil 30 points — ligne 262 du programme)

```
boucle_probable : |pct_rive1 − pct_rive2| ≥ 30,0
```

- **Jamais un verdict** : un avertissement descriptif, nommé ENSEMBLE.
- **Jamais de direction affichée** : la direction de la boucle (P1 avance /
  P2 recule, ou inverse) est calculée dans RIO-04 mais **non affichée** —
  la boucle n'est imputée à aucune rive.
- Réels : SM-Q4 **49,0 %** global · émo-Q4 **270/450 (60,0 %)** · Q4
  attachement **370/800 (46,25 %)** · EXT-Q2 **87 boucles** · EXT-Q3 **65
  boucles**. G11 d'EXT-Q3 (CONTRASTE) et G11 de SM-Q4 (ÉCART_PERCENTILES)
  bouclent à 100 % par construction.

## Les styles (dispersion des faces)

Deux implémentations :

### 1. Écart-type de population par rive (SM-Q4, EXT)
```
style d'une rive = σ (ddof=0) de ses 3 scores de face
styles dissemblables si |σ_det − σ_chg| ≥ 1,00   (statut INTERPRÉTÉ/D-PARAM)
```
Réels : SM-Q4 styles dissemblables **4,5 %** global (G12 : 30/30, 76,7 %
conformes au seuil) · EXT-Q2 **75 styles** · EXT-Q3 **47 styles**.

### 2. Correction de style L6 (attachement Q4)
```
HAUT si moyenne > 3,5 → correction −0,5
BAS  si moyenne < 1,5 → +0,5
sinon MOYEN
styles « dissimulables » = {HAUT, BAS} → avertissement (non bloquant)
```
Réel : 28 avertissements styles sur 800 paires.

## L'anti-verdict transversal

Les trois mécaniques sont **descriptifs, jamais prescriptifs** :

- `pct_compatibilite = None`, **jamais affiché** (RIO-04) ;
- garde lexical sur les 9 templates (« ta faute », « c'est toi »…
  interdits ; aucun « % » dans les textes) ;
- la boucle et les styles sont des **avertissements**, jamais des causes de
  décision ;
- les inférences L5 de RIO-17 (« la taxe se paie à deux »…) sont des
  **empreintes descriptives verrouillées mot pour mot**, déclenchées par
  des conditions exactes (taxe : max(L1) ≥ 2,60 · sujet : n1 ≠ n2 ·
  silence : C2 > C1 des deux côtés) — réels : taxe 403 · sujet 407 ·
  silence 102 sur 610 croisements servis.

## Pourquoi mid-rank et pas « rang brut »

Avec n = 2000, un rang brut place les ex æquo arbitrairement (premier
trouvé = premier servi) ; le mid-rank garantit que **deux rives
identiques obtiennent le même percentile** — condition nécessaire de la
symétrie testée à 100 % dans les croisements (800/800 en Q4 attachement,
450/450 en émo-Q4, 610/610 anti-inversion en EXT-Q2).
