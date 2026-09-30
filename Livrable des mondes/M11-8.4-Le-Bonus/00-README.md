# 00 — FICHE DE CADRAGE DE PRODUCTION

> quete : 8.4 « Le bonus » · fiche : 00 — fiche de cadrage (lire avant tout fichier du dossier)
> Source de vérité : Constitution v2.1 [5] (M11 — LE VOYAGE À DEUX : 6 quêtes · 46 items ·
> LA RENCONTRE GRATUITE) · [6] (la rencontre est gratuite — M11, matching de base, conversation,
> sécurité) · [9] (verrous comité) · [11-b] · refonte gelée — PARTIE 8 l. 2027-2040 (table :
> 8.4 « 1 geste · Générosité réelle → GEN 🆕 (crédit facteur confiance) · P2 · Match, opt-in » ·
> « Pas de carte individuelle : les récompenses sont partagées ») + table restaurée l. 1845
> (« 🎁 Le bonus (Phase 2) — le geste de partage · Générosité réelle mesurée ») ·
> mission V14.B.4 (Task 27-c).
> B.3 : **production neuve déclarée** — 1ʳᵉ génération V14-B (aucune génération antérieure ;
> angles cadrés au refonte gelée, aucun texte hérité ni réinventé).

## Restitution [10] (5 lignes)

- **Élément** : quête 8.4 « Le bonus » — **1 geste** (Q8.4-01), le jeu des 20 pépites : le
  geste de partage de M11, ouvert après le premier match, opt-in, 30 secondes, une seule fois.
- **Monde** : M11 — LE VOYAGE À DEUX (codes 8.x — le monde est une métadonnée, FM-011 v2) ·
  la destination du voyage, débloquée au premier match, quêtes à deux, récompenses partagées.
- **Statut freemium** : 🆓 **gratuit** — M11 ENTIER est gratuit (Constitution [5]/[6]) ; aucune
  trace de conversion autour du geste (l'unique écran de conversion reste celui de M5, [6]).
- **Contraintes principales** : 1 geste, **pas d'échelle** (divergence de gabarit consignée
  ci-dessous) · **aucun miroir — le geste parle** (précédent 6.4) · **graine sans-objet** ·
  don réel (ce qui est offert sort de TON avoir) · **bloc anti-pression** (zéro classement,
  zéro badge, zéro relance, zéro avantage de visibilité) · GEN = MOTEUR SEUL.
- **Ambiguïtés détectées** : ① le refonte nomme un concept d'économie comportementale — il est
  cité SANS auteur et SANS terme technique, par la formule « protocole public et validé
  d'économie expérimentale » (décision consignée au README) ; ② « partager entre plusieurs
  profils » n'a de sens qu'avec UN avoir unique à répartir → l'offre de 20 pépites est une
  fois PAR COMPTE (arbitrage n° 4 ci-dessous) ; ③ le statut future des pépites reçues hors
  quête est ouvert (arbitrage n° 2).

## LA DIVERGENCE DE GABARIT (consignée — 1 geste, pas d'échelle)

| Attente du gabarit standard | Réalité de 8.4 | Traitement |
|---|---|---|
| Une échelle d'items (Likert, paires, pivots) | **1 geste** — un fait posé, pas des énoncés | le geste a son tableau au `01` (libellé verbatim, 3 choix, granularité, règle du don réel) ; zéro échelle, zéro orientation D/I, zéro recodage |
| Un mélange de passation + graine tirée | **1 écran de jeu** — aucune permutation possible | **SANS-OBJET documenté** au `02` (graine non tirée, zéro course, précédents 1.7 / 4.4 / 6.5) |
| Un miroir de quête (étage 2) | **AUCUN miroir — le geste parle** | **exemption par design documentée** aux `04` et `07` (précédent 6.4 : « l'absence est le livrable ») ; le seul rendu du geste est le don lui-même |
| Une carte individuelle | **Lecture carte vide** (refonte : « — (pas de carte) ») | la récompense de M11 est **partagée par nature** : le reçu reçoit les pépites — rien à restituer au donneur |
| Yaml de computation par item | **1 yaml de geste** (`06`) | champs de geste (opt_in, invitation unique, don réel) + scoring GEN moteur seul + `anti_patterns` |

## Cadrage fiche

| Élément | Cadrage |
|---|---|
| **Ce que ça mesure** | Un **geste mesuré** — un fait posé, daté, unique : la façon dont la personne répartit un avoir qui lui appartient. Le registre distingue les **réponses déclarées** (échelles de tout le voyage) et les **« gestes mesurés »** (faits réels) : 8.4 ouvre la famille des gestes mesurés du voyage à deux. Aucune déclaration, aucune auto-évaluation de générosité. |
| **Format** | **1 geste** — un jeu d'attribution en entiers de pépites (pas une échelle, pas un Likert, pas un choix-déclaratif) : Wairyu offre 20 pépites ; la personne garde, offre à un match, ou partage entre plusieurs matchs. 30 secondes. Opt-in. Une seule fois par compte. |
| **Dimensions** | 1 dimension interne : `generosite_reelle` — un seul vecteur, moteur (étiquette de geste, pas un score rendu). |
| **Trames ▲** | **AUCUNE** — le geste n'héberge aucun signal de trame. |
| **Mélange** | **SANS-OBJET** — 1 geste, aucune permutation possible (02). Graine non tirée ; la convention de décade garde la place (graine théorique 284427, non tirée — collision vérifiée nulle au dépôt). Zéro course, zéro config. |
| **Signatures** | **SIG-8.4-01 « GEN — générosité réelle »** [MOTEUR SEUL] : geste mesuré au registre (« gestes mesurés ») → crédit au FACTEUR DE CONFIANCE du profil donneur. Niveaux garde/partage, paliers d'intensité : seuils PROVISOIRES, À VALIDER PAR LE COMITÉ (verrou [9]). |
| **Miroir / carte** | **AUCUN miroir — le geste parle** (04/07, précédent 6.4) · **pas de carte** (lecture carte vide — la récompense est le don reçu) : la doctrine d'ombre ≥ lumière [2] est sans objet sur un don (ni éloge, ni blâme). |
| **Visibilité** | Le don se voit naturellement chez celui qui le reçoit (la pépite offerte arrive dans sa conversation) — et c'est l'unique visibilité. Aucun niveau, aucun badge, aucun statut de « généreux » ne s'affiche nulle part. |
| **Consentement** | Opt-in strict : l'invitation s'affiche une fois ; ignorer n'a aucune conséquence ; donner est un choix libre, la garde est un choix neutre, recevoir n'oblige à rien. |

## ⚖️ ARBITRAGES CONSIGNÉS (À VALIDER PAR LE COMITÉ)

1. **Le concept, cité sans auteur et sans terme technique** : le principe du jeu vient d'un
   protocole public et validé d'économie expérimentale (économie comportementale). La formule
   retenue crédite la provenance publique SANS nom d'auteur (interdit de mission) et SANS le
   terme technique du laboratoire (inutile, lourd et froid au rendu — même économie que 6.3 :
   le libellé technique vit hors des textes). Wairyu ne reprend aucun texte : seul le
   mécanisme est mobilisé (Constitution [1]).
2. **Le statut des pépites reçues** : les pépites offertes entrent dans l'avoir du reçu et y
   restent — sans autre usage prévu à ce stade. AUCUN boutique, AUCUNE conversion, AUCUN achat.
   Tout élargissement futur = Fiche de Mutation + verdict comité.
3. **« Partager entre plusieurs profils » = entre tes matchs actifs** : le don vit dans le
   lien (la pépite arrive dans une conversation existante). La diffusion vers des inconnus
   n'existe pas — la générosité de 8.4 n'est pas une publicité.
4. **Une offre par compte (et non par match)** : « Wairyu t'offre 20 pépites » ouvre UN avoir
   unique à répartir entre un ou plusieurs matchs — c'est ce qui rend le test lisible
   (répartir un bien limité), fidèle au protocole public (partage unilatéral sur un avoir
   propre). Un « bonus par match » créerait une mécanique de collecte, contraire à l'esprit
   du geste.
5. **GEN est un crédit, pas un score de qualité de personne** : le crédit au facteur de
   confiance récompense un fait (donner ce qui coûte) ; la garde produit un crédit nul ET
   RIEN D'AUTRE — aucun signal négatif, aucune dette, aucune trace. La générosité mesurée
   n'écrase pas la générosité non mesurée (on peut donner sans l'app : 8.4 ne voit que ce
   qui se passe dans Wairyu).

## 🚫 INTERDITS SPÉCIFIQUES (liste fermée, vérifiable machine)

- **Le bloc anti-pression** : aucun classement (pas de palmarès), aucun badge (rien sur les
  profils), aucune notification de relance (une seule invitation, silence après), aucun
  avantage de visibilité ou de matching payant déduit du geste, aucune traduction du geste
  en message d'analyse envoyé à l'autre.
- **GEN au rendu** : le crédit ne se montre à personne — ni au donneur, ni au reçu, ni aux
  tiers (MOTEUR SEUL).
- **La monnaie créée** : le don sort de l'avoir du donneur — aucune création, aucune
  conversion, aucun remboursement, aucune contre-valeur.
- La punition de la garde · la comparaison entre membres · le compte à rebours · le rappel
  du geste non joué : interdits (famille anti-pression).
- Les mots d'absolu interdits au rendu ([3]) · tout label clinique · tout nom d'auteur ·
  toute marque : interdits (vérifié machine).

## 🔒 VERROUS

- **Le geste reste un jeu** : présenté de bout en bout comme un jeu — lisible, léger, sans
  enjeu de véracité (le mensonge n'existe pas ici : le don est réel, il ne se déclare pas).
- **Le don est réel** : ce qui est offert sort de TON avoir — gravé au 01 et au 06
  (`don_reel: oui`). C'est la condition du test honnête.
- **Une seule invitation, silence après** : gravé au 00, au 03 et au 06.
- **SIG-8.4-01 est [MOTEUR SEUL]** : la marque est obligatoire partout où la signature est
  documentée (00, 03, 04, 06, 07).
- **Seuils = verrou [9]** : niveaux et paliers PROVISOIRES — À VALIDER PAR LE COMITÉ.

## 📖 Lecture des fichiers (ordre conseillé)

1. `01-tableau-des-items.md` — le geste Q8.4-01 (libellé verbatim, 3 choix, granularité, don réel).
2. `02-plan-de-melange-graine-sans-objet.md` — le sans-objet documenté (1 geste).
3. `03-signatures-registre.md` — SIG-8.4-01 « GEN » (moteur seul, seuils comité, anti-pression).
4. `04-slots-de-miroir.md` — l'exemption (aucun slot : le geste parle).
5. `05-ecran-d-intro.md` — l'écran d'entrée (2 phrases).
6. `06-fiche-computation-8.4.yaml` — la fiche yaml (champs de geste + scoring + anti_patterns).
7. `07-miroir.md` — l'exemption documentée (étage 2).
