# LIVRABLE 3 — SIGNATURES DU REGISTRE MONDE 1 CONSOMMANT LES VARIABLES DE LA QUÊTE 1.1

> ⚠ **TOUTES les conditions, seuils et fenêtres ci-dessous sont copiés VERBATIM du registre gelé
> (« Le Registre des Signatures — Monde 1 : Le Miroir », source `refonte des tests et outils
> wairyu.md`) — ADOPTÉES comme valeurs de départ (décision comité, FM-019) — provisoire
> concepteur — re-signature professionnelle avant bêta.**
> **Marquage mission Phases A/B/C/D (point 4 — conversion du registre des signatures) :** chaque seuil ci-dessus porte le statut **« À VALIDER PAR LE COMITÉ »** — l'adoption FM-019 fixe la valeur de départ ; la re-signature professionnelle avant bêta reste requise.
>
> **Variables 1.1** (dictionnaire §0.2 du registre) : `O` ouverture · `C` organisation · `E` énergie
> sociale · `A` bienveillance · `S` stabilité émotionnelle — domaine 0-1, effectif.
> Conventions du registre reproduites : `_eff` = après modulations disponibles à l'instant de la
> compilation · **garde universelle** : aucune signature narrative ne se déclenche sous QFI < 0.60 ·
> constantes de zone : faible < 0.35 · central 0.35-0.65 · élevé > 0.65 · saillance forte > 0.70.
>
> Ces fiches décrivent le MOTEUR : aucune condition n'est un texte utilisateur. Les conséquences
> narratives (briques, gabarits) sont désignées par leurs IDs — leurs textes vivent au registre des
> Portraits. Les 8 items ▲ (T01→T08) n'alimentent AUCUNE conséquence narrative : la seule sortie de
> la trame est côté moteur.

## PARTIE A — Les 7 signatures méta (cohérence et fiabilité) — verbatim

| # | ID | Conditions exactes (verbatim) | Conséquence (verbatim) | Variables 1.1 | Verrou [9] |
|---|---|---|---|---|---|
| 1 | SIG_COH_HAUTE | EC ≤ 0.15 ET garde QFI ≥ 0.60 | Gabarit GAB-LIGNE_COHERENCE : *« Et ça colle : tes mots et tes choix racontent la même histoire. »* + brique §1.3 du Portrait (la donnée rare) activée | — (EC = écart 1.4×1.5 · QFI inclut les doublons 1.1) | **ADOPTÉ (FM-019) — provisoire concepteur** |
| 2 | SIG_COH_DIV | EC ≥ 0.30 ET garde QFI ≥ 0.60 | Brique spéciale DIV-M1-AC : le paragraphe de divergence (§2, placement prioritaire, slot ecart_coh) · Jamais dans la version Engagement (§5 porte sa traduction : « bâtis sur les accords définis à froid ») | — (idem) | **ADOPTÉ (FM-019) — provisoire concepteur** |
| — | *(règle de silence)* | 0.15 < EC < 0.30 | Aucun affichage, jamais. L'écart modéré module en interne (AC_effectif = 0.6×AC_D + 0.4×AC_B) — la divergence n'est un contenu qu'au-delà de 0.30 | — | **ADOPTÉ (FM-019) — provisoire concepteur** |
| 3 | SIG_QFI_CRISTALLIN | concordance doublons ≥ 0.90 ET temps de réponse normaux | Affirmations marquées « confirmées sur tes réponses » ; intervalles resserrés au rendu | doublons `02.r`×`02` et `11.r`×`11` | **ADOPTÉ (FM-019) — provisoire concepteur** |
| 4 | SIG_QFI_CONSTRUCTION | concordance doublons 0.60-0.90 | Paragraphes prudents : *« tes réponses sur ce point sont partagées — c'est une information en soi »* | doublons `02.r`×`02` et `11.r`×`11` | **ADOPTÉ (FM-019) — provisoire concepteur** |
| 5 | SIG_QFI_STRATEGIQUE | désirabilité sociale élevée (items SDA trame) ET over-claiming ≥ 1 | Déflation des échelles déclarées (facteur 1 − 0.3×SDA) + note §0 renforcée | module les 5 échelles O C E A S | **ADOPTÉ (FM-019) — provisoire concepteur** |
| 6 | SIG_QFI_AVEUGLE | > 20% des items répondu < 1,2 s | Profil suspendu au matching + proposition de re-test (jamais de sanction affichée) | couvre les 58 items 1.1 | **ADOPTÉ (FM-019) — provisoire concepteur** |
| 7 | SIG_AMBIVALENT | ANX ≥ 0.55 ET EVI ≥ 0.55 | Aligné sur le sélecteur de Carte 1.2 (Va-et-vient) · briques d'attachement en version « dispersion » + §3 réécrit sur la double exigence | — (ANX·EVI = 1.2) | **ADOPTÉ (FM-019) — provisoire concepteur** |

## PARTIE B — Les narratives du registre Monde 1 — verbatim

> ⚠ **Constat de fidélité, signalé non corrigé (Constitution [8])** : le registre titre « Les 17
> Signatures Narratives » mais sa Partie 2 énumère 19 fiches numérotées 8-26 (le bloc Autonome
> annonce « (4) » et en liste 5 ; la transversale ajoute la n° 26). Les fiches sont reproduites
> TELLES QUELLES ; l'écart d'arithmétique est remis au comité.
> La colonne « Ancrage 1.1 » indique les variables O/C/E/A/S consommées par la condition (— si
> aucune : la fiche vit au Monde 1 sans consommer directement la quête 1.1).

### Bloc Vigie (5) — la famille attachement investi

| # | ID | Conditions exactes (verbatim) | Conséquence (verbatim) | Ancrage 1.1 | Verrou [9] |
|---|---|---|---|---|---|
| 8 | SIG_ALARME_AMPLIFIEE | ANX_eff > 0.70 · R_eff < 0.45 (exclut : SIG_VIGIE_SOUTENABLE) | briques OMB-M1-ANX-ELV, CON-M1-ANX-ELV, TRV-M1-ANX-ELV, MDE-M1-ANX-ELV · slots pct(ANX), cite(Q1.2-01), cite(Q1.2-02), texture_seed · source : croisement anxiété × régulation — cycle poursuite-retrait (littérature conjugale) · cible_freq 4-7% | — | **ADOPTÉ (FM-019) — provisoire concepteur** |
| 9 | SIG_VIGIE_SOUTENABLE | ANX_eff > 0.65 ET R_eff ≥ 0.55 | mêmes briques, CON adoucie, §3 orienté ressource (*« vigilante mais outillé — le paradoxe qui te caractérise »*) | — | **ADOPTÉ (FM-019) — provisoire concepteur** |
| 10 | SIG_RADAR_DOUBLE | P > 0.65 ET ANX > 0.70 ET R < 0.55 | brique ombre « fausses alertes » (§2.2). Seuil ANX à 0.70 (pas 0.60) : c'est la valeur qui fait que l'Intense (ANX 0.61) reçoit le radar comme *lumière* (§1.3) et non comme ombre | — | **ADOPTÉ (FM-019) — provisoire concepteur** |
| 11 | SIG_ABSORPTION | A > 0.70 ET ANX > 0.60 | brique ombre « générosité qui se retourne » (§2.3) : la bienveillance indexée sur l'harmonie devient sacrifice non négocié. Slot cite(Q1.1-31) | **A** | **ADOPTÉ (FM-019) — provisoire concepteur** |
| 12 | SIG_EXPRESS_CONDITIONNELLE | X > 0.65 ET ANX > 0.60 | brique ombre « l'expression qui attend un reçu » (§2.4). Croisement expression × anxiété — la donnée que l'échelle seule ne voit jamais | — | **ADOPTÉ (FM-019) — provisoire concepteur** |

### Bloc Bâtisseur (4) — la famille structuré-stable

| # | ID | Conditions exactes (verbatim) | Conséquence (verbatim) | Ancrage 1.1 | Verrou [9] |
|---|---|---|---|---|---|
| 13 | SIG_STANDARD_PROJETE | C > 0.75 ET A > 0.60 ET POL > 0.60 | brique ombre « projection de standard » (§2.1). La triple condition distingue le rigoureux bienveillant du rigoureux sec | **C · A** | **ADOPTÉ (FM-019) — provisoire concepteur** |
| 14 | SIG_CALME_VERROU | S > 0.65 ET POL > 0.65 | brique ombre « refuse l'urgence émotionnelle » (§2.2) : le calme qui rationalise. La recherche : rationalisation répétée → silence conjugal | **S** | **ADOPTÉ (FM-019) — provisoire concepteur** |
| 15 | SIG_REFUGE_OCCUPATION | C > 0.70 ET X < 0.55 | brique ombre « l'occupation comme refuge » (§2.3). L'évasion par la tâche détectée par sa structure — personne ne la déclare jamais | **C** | **ADOPTÉ (FM-019) — provisoire concepteur** |
| 16 | SIG_VERROU_AUTOACCUSATION | A > 0.65 ET S > 0.55 ET X < 0.60 | brique ombre « l'auto-accusation comme fermeture » (§2.4) | **A · S** | **ADOPTÉ (FM-019) — provisoire concepteur** |

> ⚠️ **Note d'audit (verbatim du registre)** — découverte de spécification. En fixant les ancrages de
> cette signature, une faiblesse est apparue : le §2.4 du Portrait 2 cite Q1.1-48 comme item
> d'ancrage, mais Q1.1-48 est un item inversé de *stabilité*, pas une mesure d'auto-accusation.
> Deux remèdes, au choix du comité : (a) ajouter 2 items dédiés d'auto-accusation à la banque en
> calibration (Fiche de Mutation candidate : Q1.1-51, Q1.1-52) ; (b) reformuler la brique pour
> l'ancrer sur A×S uniquement. La signature fonctionne dans les deux cas — mais le registre ne
> laisse pas passer une citation d'ancrage approximative : c'est le rôle de la Partie 6 (verrou CI
> n°2). → **En conséquence : le rappel de Q1.1-48 est SUSPENDU dans les livrables de cette quête
> (voir 01 · 06) jusqu'à l'arbitrage.**

### Bloc Autonome (4 selon l'en-tête du registre — 5 fiches énumérées) — la famille indépendant-intérieur

| # | ID | Conditions exactes (verbatim) | Conséquence (verbatim) | Ancrage 1.1 | Verrou [9] |
|---|---|---|---|---|---|
| 17 | SIG_INDEPENDANCE_ACTIVE | EVI > 0.65 ET S > 0.55 ET O > 0.65 | briques lumière composées (§1 : la présence calme, la richesse intérieure, l'indépendance-don, l'utile en crise). L'ombre et la lumière de l'évitement sont deux signatures distinctes — un évitant ouvert et stable n'a pas la même ombre qu'un évitant pauvre en expression | **S · O** | **ADOPTÉ (FM-019) — provisoire concepteur** |
| 18 | SIG_DESACTIVATION | EVI > 0.65 | signature-mère du bloc : active le kit ombre de base (§2.1 « l'esprit coupe le son ») + modulateur de section | — | **ADOPTÉ (FM-019) — provisoire concepteur** |
| 19 | SIG_FORTERESSE | EVI > 0.65 ET X < 0.55 | brique ombre « la forteresse intérieure accumule » (§2.2). Fille de DESACTIVATION — co-déclenchement attendu, ordre fixé | — | **ADOPTÉ (FM-019) — provisoire concepteur** |
| 20 | SIG_RETRAIT_PATIENT | EVI > 0.65 ET S > 0.55 | brique ombre « la patience qui devient déni » (§2.4) : les ruptures « sans prévenir » du profil stable-évitant | **S** | **ADOPTÉ (FM-019) — provisoire concepteur** |
| 21 | SIG_DEFET_SOUDAIN | EVI > 0.65 ET O > 0.75 | brique ombre « les défauts soudains » (§2.1, fin de paragraphe) : la richesse cognitive au service de la désactivation. La signature la plus fine du bloc — elle ne s'active que chez les évitants curieux, où l'esprit a de quoi fabriquer des portes de sortie respectables | **O** | **ADOPTÉ (FM-019) — provisoire concepteur** |

### Bloc Intense (4) — la famille réactif-expressif

| # | ID | Conditions exactes (verbatim) | Conséquence (verbatim) | Ancrage 1.1 | Verrou [9] |
|---|---|---|---|---|---|
| 22 | SIG_METEO_FORTE | S < 0.40 ET R < 0.40 | brique ombre « la météo intérieure » (§2.1) + définition en ligne de la réactivité (concept nommé une fois, R18) | **S** | **ADOPTÉ (FM-019) — provisoire concepteur** |
| 23 | SIG_MOTS_DE_CRISE | SIG_METEO_FORTE ET X > 0.65 | brique ombre « les mots qui restent » (§2.2). Réactivité × expressivité : le croisement qui fabrique les mots de crise | — (via METEO) | **ADOPTÉ (FM-019) — provisoire concepteur** |
| 24 | SIG_VERIF_PRESSION | ANX > 0.55 ET R < 0.40 | brique ombre « la vérification sous pression » (§2.4). Seuil ANX abaissé à 0.55 ici : la réactivité transforme une anxiété modérée en pression relationnelle — c'est l'asymétrie voulue avec la Vigie (0.70) : le vigilant-stable ne surveille pas, le réactif-anxieux oui | — | **ADOPTÉ (FM-019) — provisoire concepteur** |
| 25 | SIG_REN_REQUIS | R < 0.35 ET (S < 0.45 OU ANX > 0.60) ET garde QFI ≥ 0.60 | gabarit unique GAB-REN (encadré de renvoi professionnel, formulation verrouillée). Évaluée en dernière passe, déclenchable une seule fois par Portrait, jamais réduplicée. Fréquence cible : 2-4% | **S** | **ADOPTÉ (FM-019) — provisoire concepteur** |

### Transversale (1)

| # | ID | Conditions exactes (verbatim) | Conséquence (verbatim) | Ancrage 1.1 | Verrou [9] |
|---|---|---|---|---|---|
| 26 | SIG_ECARTE_POLE | \|POL_A − POL_B\| > 0.70 au matching (les deux profils) | modulation de compatibilité de communication (pénalité) + signal conversationnel « vos styles de pensée diffèrent ». Héritée du contrat Bloc 1 — formalisée ici car elle est évaluable dès le Monde 1 | — | **ADOPTÉ (FM-019) — provisoire concepteur** |

## PARTIE C — Hors de ce livrable

> **6 signatures de sécurité + SIG_RSQ_HAUT : conditions fines hors dépôt (document trames, canal
> privé).**

## Moteur d'évaluation — l'ordre des passes (verbatim, pour situer les fiches ci-dessus)

```
PASSE 0 : QFI (fiabilité)        → module toutes les passes suivantes
PASSE 1 : Sécurité (27-32)       → visibilité, signaux, protection   [hors dépôt — voir PARTIE C]
PASSE 2 : Méta (1-7)             → cohérence, ambivalence, marqueurs de rendu
PASSE 3 : Narratives (8-25)      → sélection des briques
PASSE 4 : REN (25)               → toujours en dernier, une fois max
PASSE 5 : Matching transversal   → SIG_ECARTE_POLE, drapeaux de protection
```

Exclusions mathématiques (verbatim) : COH_HAUTE ⊕ COH_DIV · ALARME ⊕ SOUTENABLE (zone grise 0.45-0.55
sur R = version standard). Plafond de saillance : maximum 6 dimensions développées par Portrait.
Plafond d'ombres : §2 contient au minimum 2 tendances — si une seule signature ombre est active, la
brique SYN centrale est reformulée en vigilance légère plutôt qu'en silence.

## Notes de registre

- **Héritage des sélecteurs de cartes** (règle de continuité 1 du registre) : quand une signature
  prolonge une Carte, elle reprend exactement les seuils du sélecteur de la Carte — la continuité
  Carte → Portrait est garantie par construction (les sélecteurs 1.1 sont au `cartes.yaml`).
- **Registre probabiliste obligatoire** : toute conséquence rendue s'exprime en « conduit
  fréquemment à », « la recherche documente que » — jamais « tu finiras par » (Constitution [2]).
- Les citations d'ancrage (`cite(...)`) résolvent vers un item réel du contrat dont la formulation
  correspond au contenu de la brique (verrou CI n°4 du registre) — pour la quête 1.1 : cite(Q1.1-31)
  résout ; le cas Q1.1-48 est suspendu (note d'audit ci-dessus).
- **Règle d'or du registre (verbatim, gravée en tête)** : *« Une signature n'est pas une intuition
  mise en code : c'est un paragraphe déjà écrit, dont on a reconstitué la naissance. Si la règle ne
  produit pas le paragraphe, c'est la règle qu'on corrige — jamais le paragraphe. Si le paragraphe
  ne peut pas sortir d'une règle, c'est qu'il ne devait pas exister. »*
