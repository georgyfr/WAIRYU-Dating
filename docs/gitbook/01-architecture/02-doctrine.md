# La doctrine D — les règles permanentes

> La doctrine D est l'ensemble des règles qui rendent les lectures WTC
> reproductibles et honnêtes. Chaque règle est née d'un incident réel documenté
> (une « faute » comptée publiquement). Voici les règles qui gouvernent les
> calculs documentés dans ce GitBook, avec leur origine.

## Les règles de calcul

### D-STD — le seuil vient après la mesure
Les bornes de faisabilité sont calculées **avant** les critères, sur le **code
réel** du simulateur ; les seuils sont posés à **≥ 3 points sous le plafond
atteignable**. Poser un seuil sur une intention plutôt que sur un code est une
violation. *Exemple concret* : le plafond d'activation des forces de
WTC-EMO-Q1 a été mesuré à **71,25 %** (285/400) — le seuil a été posé à
**68,25 %** (= plafond − 3 pts), pas à une valeur « souhaitable ».

### D-STD-2 — un plafond par configuration
Depuis le cycle Q4, le plafond se calcule **par configuration** (par face, par
sous-échelle, par cellule), pas seulement globalement. C'est pourquoi
WTC-SM-Q4 porte **9 seuils distincts** (82, 83, 84, 74, 75, 76, 96, 94, 98) et
WTC-SM-Q5 **12 seuils distincts** (76, 75, 74, 73, 77, 72, 78, 98, 70, 15, 50, 71).

### D-ÉCHELLE — les seuils s'ancrent au milieu de l'échelle
Le milieu de l'échelle est l'ancre neutre des classifications. Pour l'échelle
à 5 points (émotionnelle, santé mentale) : milieu = **3,00** (constante
`SEUIL_MID = 3.00`). Pour l'échelle à 4 points (générationnelle), les seuils
L3 sont 1,80 / 2,60 / 3,20.

### D-PARAM — les paramètres de bruit sont déclarés
Le bruit des items simulés est **σ = 0,60** partout (santé mentale, extensions) ;
le module de réassurance du simulateur émo-Q2 utilise σ = 0,70 pour `rc_d`.
Un paramètre non déclaré est une faute (les centres de simulation sont
littéralement gravés dans les SPEC).

### D-Q3-J — une borne est conditionnelle à la géométrie
Une borne n'est pas universelle : elle dépend des paramètres de `gen()`.
Quand une borne se révèle inatteignable, c'est un **signal géométrique**, pas
un échec. *Exemple* : la borne « 35-50 % de SILENCIEUSES » de Q3-R1 était
inatteignable — le plafond réel mesuré est **14,5 %** ; documenté comme
signal S-Q3-R1-1, non éliminatoire.

### D-CRISE — le filet passe avant tout calcul
Quand une voie de crise est active (santé mentale : `A2 ∨ SM-C1 ∨ H5`),
**aucun calcul de couple n'est déployé**. Le court-circuit est **avant l'arbre
de décision**, avec le filet **3919 (violences conjugales) / 3114 (détresse
psychiatrique)**. En Q5, crise ⇒ palier 🔴 ORIENTATION, `pas = None`,
`statut = None` — jamais de pas de couple en crise.

### D-VÉRITÉ — la vérité croisée est une méthode de construction
Le simulateur implémente la « vraie » classe **indépendamment** du moteur ;
la validation vérifie que le moteur la retrouve. Résultats réels :
400/400 (Q3 attachement), 475/475 (émo-Q1, émo-Q3), 500/500 (SM-Q1-R3),
520/520 (SM-Q2, SM-Q3), 600/600 (SM-Q4), 540/540 (SM-Q5), 650/650 (EXT-Q2, EXT-Q3).

### D-TABLE — la table est le code
Une table (banque de forces, table de configurations) gravée dans la SPEC doit
être le **miroir exact** de la table du code — vérifiée tuple-à-tuple
(`verifier_d_table`). Toute divergence est une faute éliminatoire.

### D-NOMENCLATURE — les noms sont verbatim
Les noms des configurations (CALME DES DEUX RIVES, TEMPÊTE ET DIGUE, LA MÊME
HEURE…) sont des littéraux verbatim, injectés injectivement. Renommer est
une faute.

### D-CONFIRMATION — un croisement est une fonction de ses entrées
Un croisement à deux (Q4) ne lit **que** les sorties contresignées des
mesures individuelles, et doit résister à l'**anti-inversion** (échanger les
deux rives doit changer le résultat quand il faut, le laisser stable quand
il faut). Réel : 6 flips / 3 stables (SM-Q4), 610/610 (EXT-Q2), 150/150
inversions temporelles (SM-Q5).

## Les règles d'intégrité

### D-EMPREINTE — le même code produit la même empreinte
L'empreinte SHA-256 d'un run est calculée sur le **contenu des résultats**
(sans horodatage), deux fois par exécution (`sha1` = `sha2`), et reproduite
depuis un clone frais de GitHub (auto-audit origin). Exemples complets dans
la table des 18 instruments.

### D-LECTURE — l'état se lit sur les sources
Avant toute action, l'état réel se lit sur le dépôt et les fichiers — jamais
sur un résumé ou une mémoire. (Née de la faute n°36 : un signal requalifié
faux positif faute de lecture source.)

### D-HIST — vérifier que la mission n'a pas déjà été exécutée
Avant de produire une mission, vérifier le dernier commit et le dernier
worklog GitHub. (Née de la faute n°15 bis.)

### D-CANAL / D-CANAL-2 / D-CANAL-3 — les canaux
Le code ne transite pas par les canaux de conversation ; la production est
locale, la vérification passe par SHA ×2 + rapport ; les secrets ne sont
jamais versionnés (fichier hors dépôt, chmod 600).

### D-SIM — l'avertissement obligatoire
Tout résultat de simulation porte l'avertissement : « la mécanique est
validée, pas la prévalence clinique ». Les écrans affichent des suggestions,
pas des diagnostics. Voir la partie VII.

### D-STD dérivées : grains et pas
Les pas de score sont des faits de géométrie : grain **1/3** pour la détresse
(3 faces à 1 item), grain **1/12** pour la charge (3 faces à 4 items). Le
concevoir sans le mesurer produit des seuils inatteignables — d'où la leçon
de grain de SM-Q2 (centres posés à ≥ 0,5 pt des bornes).
