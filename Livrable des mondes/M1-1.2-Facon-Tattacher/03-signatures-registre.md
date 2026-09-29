# LIVRABLE 3 — SIGNATURES ATTENDUES DE LA QUÊTE 1.2 (format du registre Monde 1)

> ⚠ **Seuils et fenêtres : ADOPTÉS comme valeurs de départ (décision comité, FM-019) — provisoire concepteur — re-signature professionnelle avant bêta.**
> Portée : ces signatures s'évaluent au **Portrait M1** (étage 3) — jamais dans le miroir de quête seul.
> La quête 1.2 alimente les variables **ANX** et **EVI** (attachement, 0-1, effectives) ; elle
> participe aux croisements qui mobilisent R, S, X, O, A (quêtes 1.1 / 1.3) et POL (1.6).
> Variables effectives (`_eff`) = après modulations disponibles à l'instant de la compilation.
> Garde universelle : aucune signature narrative ne se déclenche sous QFI < 0,60.

## Bloc méta (attachement et cohérence)

| # | ID | Conditions exactes (verbatim du registre) | Conséquence | Verrou |
|---|---|---|---|---|
| 7 | **SIG_AMBIVALENT** | ANX ≥ 0.55 ET EVI ≥ 0.55 | Aligné sur le sélecteur de Carte 1.2 (Va-et-vient) · briques d'attachement en version « dispersion » + §3 réécrit sur la double exigence | seuils ADOPTÉ (FM-019) — provisoire concepteur |

## Bloc Vigie — la famille attachement investi

| # | ID | Conditions exactes (verbatim) | Conséquence | Verrou |
|---|---|---|---|---|
| 8 | **SIG_ALARME_AMPLIFIEE** | ANX_eff > 0.70 ET R_eff < 0.45 — exclut SIG_VIGIE_SOUTENABLE · cible_freq « 4-7% » | Briques OMB-M1-ANX-ELV, CON-M1-ANX-ELV, TRV-M1-ANX-ELV, MDE-M1-ANX-ELV · slots pct(ANX), cite(Q1.2-01), cite(Q1.2-02), texture_seed · source : croisement anxiété × régulation — cycle poursuite-retrait (littérature conjugale) | seuils et fenêtre ADOPTÉ (FM-019) — provisoire concepteur |
| 9 | **SIG_VIGIE_SOUTENABLE** | ANX_eff > 0.65 ET R_eff ≥ 0.55 | Mêmes briques, CON adoucie, §3 orienté ressource (« vigilante mais outillé — le paradoxe qui te caractérise ») — distingue deux vies de couple très différentes au même score d'anxiété | seuils ADOPTÉ (FM-019) — provisoire concepteur |
| 10 | **SIG_RADAR_DOUBLE** | P > 0.65 ET ANX > 0.70 ET R < 0.55 | Brique ombre « fausses alertes » (§2.2). Seuil ANX à 0.70 (pas 0.60) : c'est la valeur qui fait que l'Intense (ANX 0.61) reçoit le radar comme lumière (§1.3) et non comme ombre | seuils ADOPTÉ (FM-019) — provisoire concepteur |
| 11 | **SIG_ABSORPTION** | A > 0.70 ET ANX > 0.60 | Brique ombre « générosité qui se retourne » (§2.3) : la bienveillance indexée sur l'harmonie devient sacrifice non négocié. Slot cite(Q1.1-31) | seuils ADOPTÉ (FM-019) — provisoire concepteur |
| 12 | **SIG_EXPRESS_CONDITIONNELLE** | X > 0.65 ET ANX > 0.60 | Brique ombre « l'expression qui attend un reçu » (§2.4) — croisement expression × anxiété, la donnée que l'échelle seule ne voit jamais | seuils ADOPTÉ (FM-019) — provisoire concepteur |

Fiche complète du registre (verbatim, pour la signature 8) :

```yaml
conditions:
 - {var: ANX_eff, op: ">", seuil: 0.70}
 - {var: R_eff,   op: "<", seuil: 0.45}
exclut: [SIG_VIGIE_SOUTENABLE]     # R ne peut pas être < 0.45 et ≥ 0.55 ; la zone
cible_freq: "4-7%"                 # 0.45-0.55 est la version standard, sans renfort
consequences:
 briques: [OMB-M1-ANX-ELV, CON-M1-ANX-ELV, TRV-M1-ANX-ELV, MDE-M1-ANX-ELV]
 slots: [pct(ANX), cite(Q1.2-01), cite(Q1.2-02), texture_seed]
source: "croisement anxiété × régulation — cycle poursuite-retrait (littérature conjugale)"
calibration_note: "les deux paragr. §2.1-2.2 du Portrait 1 = sortie attendue de cette signature + SIG_RADAR_DOUBLE"
```

## Bloc Autonome — la famille indépendant-intérieur

| # | ID | Conditions exactes (verbatim) | Conséquence | Verrou |
|---|---|---|---|---|
| 17 | **SIG_INDEPENDANCE_ACTIVE** | EVI > 0.65 ET S > 0.55 ET O > 0.65 | Briques lumière composées (§1 : la présence calme, la richesse intérieure, l'indépendance-don, l'utile en crise) — un évitant ouvert et stable n'a pas la même ombre qu'un évitant pauvre en expression | seuils ADOPTÉ (FM-019) — provisoire concepteur |
| 18 | **SIG_DESACTIVATION** | EVI > 0.65 | Signature-mère du bloc : active le kit ombre de base (§2.1 « l'esprit coupe le son ») + modulateur de section | seuils ADOPTÉ (FM-019) — provisoire concepteur |
| 19 | **SIG_FORTERESSE** | EVI > 0.65 ET X < 0.55 | Brique ombre « la forteresse intérieure accumule » (§2.2) — fille de DESACTIVATION, co-déclenchement attendu, ordre fixé | seuils ADOPTÉ (FM-019) — provisoire concepteur |
| 20 | **SIG_RETRAIT_PATIENT** | EVI > 0.65 ET S > 0.55 | Brique ombre « la patience qui devient déni » (§2.4) : les ruptures « sans prévenir » du profil stable-évitant | seuils ADOPTÉ (FM-019) — provisoire concepteur |
| 21 | **SIG_DEFET_SOUDAIN** | EVI > 0.65 ET O > 0.75 | Brique ombre « les défauts soudains » (§2.1, fin de paragraphe) — la richesse cognitive au service de la désactivation ; la signature la plus fine du bloc (éviteurs curieux) | seuils ADOPTÉ (FM-019) — provisoire concepteur |

## Bloc Intense — la famille réactif-expressive (croisements consommant ANX)

| # | ID | Conditions exactes (verbatim) | Conséquence | Verrou |
|---|---|---|---|---|
| 22 | **SIG_METEO_FORTE** | S < 0.40 ET R < 0.40 | Brique ombre « la météo intérieure » (§2.1) + définition en ligne de la réactivité (concept nommé une fois, R18) | seuils ADOPTÉ (FM-019) — provisoire concepteur |
| 23 | **SIG_MOTS_DE_CRISE** | SIG_METEO_FORTE ET X > 0.65 | Brique ombre « les mots qui restent » (§2.2) — réactivité × expressivité : le croisement qui fabrique les mots de crise | seuils ADOPTÉ (FM-019) — provisoire concepteur |
| 24 | **SIG_VERIF_PRESSION** | ANX > 0.55 ET R < 0.40 | Brique ombre « la vérification sous pression » (§2.4). Seuil ANX abaissé à 0.55 ici : la réactivité transforme une anxiété modérée en pression relationnelle — asymétrie voulue avec la Vigie (0.70) | seuils ADOPTÉ (FM-019) — provisoire concepteur |
| 25 | **SIG_REN_REQUIS** | R < 0.35 ET (S < 0.45 OU ANX > 0.60) ET garde QFI ≥ 0.60 | Gabarit unique GAB-REN (encadré de renvoi professionnel, formulation verrouillée) · évaluée en dernière passe, déclenchable une seule fois par Portrait, jamais réduplicée · fréquence cible 2-4% | seuils et fenêtre ADOPTÉ (FM-019) — provisoire concepteur |

## Transversale (matching)

| # | ID | Conditions exactes (verbatim) | Conséquence | Verrou |
|---|---|---|---|---|
| 26 | **SIG_ECART_POLE** | \|POL_A − POL_B\| > 0.70 au matching (les deux profils) | Modulation de compatibilité de communication (pénalité) + signal conversationnel « vos styles de pensée diffèrent » — héritée du contrat Bloc 1, évaluable dès le Monde 1 | seuil ADOPTÉ (FM-019) — provisoire concepteur |

## Bloc méta QFI/COH (fiabilité et cohérence — alimenté par les doublons 01.r / 09.r)

| # | ID | Conditions exactes (verbatim) | Conséquence | Verrou |
|---|---|---|---|---|
| 1 | SIG_COH_HAUTE | EC ≤ 0.15 ET garde QFI ≥ 0.60 | Gabarit GAB-LIGNE_COHERENCE (« Et ça colle : tes mots et tes choix racontent la même histoire. ») + brique §1.3 du Portrait (la donnée rare) activée | seuils ADOPTÉ (FM-019) — provisoire concepteur |
| 2 | SIG_COH_DIV | EC ≥ 0.30 ET garde QFI ≥ 0.60 | Brique spéciale DIV-M1-AC : le paragraphe de divergence (§2, placement prioritaire, slot ecart_coh) · jamais dans la version Engagement | seuils ADOPTÉ (FM-019) — provisoire concepteur |
| — | règle de silence | 0.15 < EC < 0.30 | Aucun affichage, jamais. L'écart modéré module en interne (AC_effectif = 0.6×AC_D + 0.4×AC_B) | ADOPTÉ (FM-019) — provisoire concepteur |
| 3 | SIG_QFI_CRISTALLIN | concordance doublons ≥ 0.90 ET temps de réponse normaux | Affirmations marquées « confirmées sur tes réponses » ; intervalles resserrés au rendu | seuils ADOPTÉ (FM-019) — provisoire concepteur |
| 4 | SIG_QFI_CONSTRUCTION | concordance doublons 0.60-0.90 | Paragraphes prudents (« tes réponses sur ce point sont partagées — c'est une information en soi ») | seuils ADOPTÉ (FM-019) — provisoire concepteur |
| 5 | SIG_QFI_STRATEGIQUE | désirabilité sociale élevée (items SDA trame) ET over-claiming ≥ 1 | Déflation des échelles déclarées (facteur 1 − 0.3×SDA) + note §0 renforcée | seuils ADOPTÉ (FM-019) — provisoire concepteur |
| 6 | SIG_QFI_AVEUGLE | > 20% des items répondu < 1,2 s | Profil suspendu au matching + proposition de re-test (jamais de sanction affichée) | seuils ADOPTÉ (FM-019) — provisoire concepteur |

## Signatures de sécurité — conditions fines HORS DÉPÔT

Les 6 signatures de sécurité du registre Monde 1 (**SIG_SDT_COMPLET · SIG_SDT_LEGER ·
SIG_DARK_EMPATHY · SIG_MEFIANCE_FROIDE · SIG_MEFIANCE_VULNERABLE · SIG_DGR_PRECURSEUR**)
ainsi que **SIG_RSQ_HAUT** (transversale UX adaptative — consommatrice directe du signal RSQ
de cette quête) ont leurs **conditions fines hors dépôt** : document trames, fourni à
l'implémenteur uniquement au moment de l'intégration, par canal privé (FM-018 /
Constitution [11-b]). Aucune condition, aucun seuil, aucune formulation de trame n'est
reproduite ici. Côté produit : la trame n'a pas d'étage de restitution — aucun slot, aucune
citation, aucun texte (Constitution [2]).

## Notes de registre

- **Registre probabiliste obligatoire** : toute conséquence documentée dans un miroir
  s'exprime en « conduit fréquemment à », « la recherche documente que » — jamais « tu finiras par ».
- **Exclusions mathématiques** : COH_HAUTE ⊕ COH_DIV · ALARME ⊕ SOUTENABLE (zone grise
  0.45-0.55 sur R = version standard, sans renfort).
- **Constantes de zone** (fixées au registre) : faible < 0.35 · central 0.35-0.65 · élevé > 0.65 · saillance forte > 0.70.
- Les citations d'ancrage cite(Q1.2-01) et cite(Q1.2-02) résolvent vers les items réels de
  cette quête (verrou CI n°4 — la formulation correspond au contenu de la brique) et sont
  rendues **en toutes lettres**, sans code (Constitution [3] / FM-017).
- Fenêtre de calibration : chaque signature porte sa cible de fréquence ; hors fenêtre au
  trimestre 1 de bêta → recalage par Fiche de Mutation (comité).
