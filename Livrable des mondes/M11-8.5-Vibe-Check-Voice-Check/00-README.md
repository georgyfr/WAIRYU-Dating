# 00 — GUIDE 1 PAGE : LA DIVERGENCE DE GABARIT TOTALE

> element : 8.5 « Vibe Check / Voice Check » · fiche : 00 — guide de cadrage (lire avant tout fichier du dossier)
> Source de vérité : Constitution v2.1 [2] (FRONTIÈRES SCIENTIFIQUES : « pas d'analyse de voix
> comme trait ») · [5] (M11 — 6 quêtes · 46 items ; 8.5 = fonctionnalité, hors compteur) · [6]
> (la rencontre est gratuite) · [11-b] (esprit : ce qui vit hors moteur vit hors moteur) ·
> refonte gelée PARTIE 8 l. 2036 (« 8.5 · Vibe Check / Voice Check · Fonctionnalité (0 item) ·
> La voix avant le visage · — · P2 · Match (mode Invisible) ») + l. 1846 · mission V14.B.5
> (Task 27-c).
> B.3 : **production neuve déclarée** — 1ʳᵉ génération V14-B (aucune génération antérieure).

## Restitution [10] (5 lignes)

- **Élément** : 8.5 « Vibe Check / Voice Check » — une **fonctionnalité** de M11 : partager sa
  voix (Voice Check) et écouter celle de son match (Vibe Check), dans la révélation par
  étapes texte → voix → photo.
- **Monde** : M11 — LE VOYAGE À DEUX (la destination du voyage, débloquée au premier match) ·
  domicile naturel : le **Mode Invisible**.
- **Statut freemium** : 🆓 **gratuit** — M11 ENTIER est gratuit (Constitution [5]/[6]) ;
  aucune trace de conversion autour de la fonctionnalité.
- **Contraintes principales** : **0 item** (le compteur d'items du projet ne bouge pas) ·
  consentement des DEUX, révocable des deux côtés · écoute limitée (streaming, zéro
  téléchargement, zéro re-partage) · chiffrement renforcé · hors exports · zéro tiers ·
  **ZÉRO analyse de la voix comme trait** (doctrine normative, 02).
- **Ambiguïtés détectées** : ① les deux noms (« Vibe Check / Voice Check ») viennent de la
  spec produit — leur répartition en volets est une proposition de production (01 §1) ;
  ② le refonte écrit « Match (mode Invisible) » : le domicile est le Mode Invisible, la
  parité Mode Classique reste un cadrage produit (comité) ; ③ 8.5 n'a ni miroir ni carte ni
  mélange — trois « sans-objet » de plus que la divergence standard (ci-dessous).

## ⚠️ NOTE 0 ITEM (grave ici et au README)

> **8.5 = 0 item — le compteur d'items du projet ne bouge pas.**
> La fonctionnalité entre au contrat d'inventaire comme FONCTIONNALITÉ (lectures carte/signal
> vides, phase P2), pas comme quête d'items. M11 reste à 46 items (36 + 6 + 3 + 1 geste).

## La divergence de gabarit TOTALE (spécification fonctionnelle)

| Pièce du gabarit standard | Statut pour 8.5 | Fondement |
|---|---|---|
| Tableau d'items (01) | **SANS-OBJET** → remplacé par `01-specification-fonctionnelle.md` | une fonctionnalité n'a pas d'énoncés : elle a une mécanique (enregistrement, consentement, écoute, durée de vie) |
| Mélange + graine (02) | **SANS-OBJET** — rien à mélanger, aucune graine (0 item, aucune passation) | l'outil `melange.py` opère sur des séries d'énoncés ; ici il n'existe aucune série |
| Miroir de quête (07) | **SANS-OBJET** — aucun rendu analytique n'existe | il n'y a rien à analyser : la voix s'écoute, elle ne se décrit pas (02 — la décrire ferait une analyse de trait, doctrine interdite) |
| Slots de miroir (04) | **SANS-OBJET** — aucun slot individuel, aucun slot dyadique | aucun texte de quête n'existe à substituer ; le canal du récit est la voix elle-même |
| Cartes (variante) | **SANS-OBJET** — aucune carte | une carte décrirait la voix : analyse de trait par la petite porte — doctrine interdite (02) |
| Yaml de computation (06) | **SANS-OBJET** — aucun item à compute | la spéc tient lieu de fiche ; si la CI exige une entrée, elle porterait `type: fonctionnalite` (proposition, comité) |
| Écran d'intro (05) | **SANS-OBJET comme fichier** — les écrans vivent DANS la spéc (01 §9, placeholders) | une fonctionnalité a plusieurs écrans (enregistrement, écoute, envoi, retrait) : chacun est un placeholder descriptif au 01 |

## Cadrage de la fonctionnalité

| Élément | Cadrage |
|---|---|
| **Ce que c'est** | Le partage d'une voix de 30 secondes au plus, dans une conversation de match : l'orateur enregistre et envoie, l'écouteur accepte et écoute. Deux volets d'une même fonctionnalité (Voice Check = enregistrer/partager · Vibe Check = écouter) — proposition, comité. |
| **Ce que ça n'est pas** | Pas un test, pas une mesure, pas un enregistrement caché, pas une messagerie vocale, pas un export, pas un canal tiers — liste fermée au 01 §10 et doctrine au 02. |
| **La place dans le voyage** | L'étage du milieu de la révélation par étapes (texte → voix → photo) — chaque étage optionnel, aucun ne force le suivant ; la voix n'ouvre pas la photo d'elle-même (01 §2). |
| **La protection** | Consentement double révocable · écoute limitée · durée de vie courte (purge) · chiffrement renforcé au repos · hors exports · zéro tiers (01 §4-7 · 03). |
| **La frontière** | **ZÉRO analyse de la voix comme trait** — la liste interdite est NORMATIVE (02) : spectrogramme, empreinte vocale, embedding audio, détection d'émotion par la voix, estimation d'âge/genre/santé, toute dérivation de trait : la voix ne nourrit aucun score, aucun signal, aucun profil. |

## 🔒 VERROUS

- **02 est NORMATIF** : la spéc (01) n'implémente aucun scan — implémenter une fonction de la
  liste interdite = violation de doctrine (Constitution [2]), Fiche de Mutation + comité,
  pas une évolution technique.
- **Le consentement des DEUX** : ni enregistrement caché, ni écoute forcée — révocable des
  deux côtés à tout instant (01 §4).
- **La voix n'ouvre pas la photo d'elle-même** : gravé au 01 §2 (chaque étage a son propre
  consentement).
- **8.5 = 0 item** : gravé ici et au README (le compteur d'items du projet ne bouge pas).

## 📖 Lecture des fichiers (ordre conseillé)

1. `01-specification-fonctionnelle.md` — la mécanique complète (écrans compris).
2. `02-doctrine-biometrie.md` — la frontière (normative, liste fermée).
3. `03-rgpd-cycle-de-vie.md` — le cycle de vie de l'audio (sept temps).

## Conformité a11y

Conformité a11y : WCAG 2.1 AA visée selon le format de la quête (contrastes ≥ 4,5:1, cibles tactiles ≥ 44×44 px, support lecteur d'écran, respect du mode réduit-animations). Implémentation : voir spec quête 1.1 §10 et styles.css.
