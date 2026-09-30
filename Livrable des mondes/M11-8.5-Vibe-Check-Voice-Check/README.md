# 8.5 « VIBE CHECK / VOICE CHECK » — DOSSIER DE SPÉCIFICATION FONCTIONNELLE

> **Monde** : M11 — LE VOYAGE À DEUX 🆓 **GRATUIT** (codes 8.x — le monde est une métadonnée, FM-011 v2)
> fiche : README — vue d'ensemble du livrable (lire en premier)
> **Phase** : P2 · **Accès** : match — pensée pour le **Mode Invisible**
> **Statut de dossier** : **SPÉCIFICATION FONCTIONNELLE — 0 item** (⚠️ le compteur d'items du
> projet ne bouge pas : la fonctionnalité entre au contrat comme FONCTIONNALITÉ, pas comme quête)
> **Le principe** : la voix avant le visage — la révélation par étapes : **texte → voix → photo**
> **La divergence de gabarit est TOTALE** : pas de tableau d'items, pas de mélange, pas de miroir, pas de cartes (00)

## Le principe

La voix est un canal d'attirance puissant — et moins brutal que la photo. Elle rend ce que
le texte aplatit : l'intonation, le rire, le timbre, le rythme de la parole. Dans la
révélation par étapes (**texte → voix → photo**), la voix est l'étage du milieu : elle
réintroduit le vivant avant l'exposition du visage. Chaque étage est optionnel ; aucun étage
n'ouvre le suivant d'elle-même.

**FONCTIONNALITÉ produit** — pas une quête, pas d'items, pas de passation : une mécanique
d'app consolidée par une doctrine (02) et un cycle de vie RGPD (03). Le refonte la place
comme il place 8.6 : une fonctionnalité de la spec, inscrite au monde M11, hors compteur
d'items (M11 : 46 items = 36 + 6 + 3 + 1 geste — 8.5 pèse zéro).

## 📁 Contenu du livrable (5 fichiers)

| Fichier | Livrable |
|---|---|
| `00-README.md` | Guide 1 page : **la divergence de gabarit TOTALE** (spécification fonctionnelle), cadrage, verrous |
| `01-specification-fonctionnelle.md` | **La mécanique complète** : enregistrement (30 s max, prise réenregistrable), place dans la révélation par étapes, consentement des DEUX, écoute limitée, durée de vie, chiffrement renforcé, Mode Invisible, placeholders d'écrans |
| `02-doctrine-biometrie.md` | **DOCTRINE ABSOLUE — ZÉRO analyse de la voix comme trait** : la liste interdite fermée (normative), les corollaires, la frontière gravée |
| `03-rgpd-cycle-de-vie.md` | **Le cycle de vie de l'audio** : création, stockage, lecture, rétention (30 jours glissants — proposition), suppression, export, tiers |
| `README.md` | Le présent fichier |

## ✅ Déclaration de conformité (interdits absolus V14-B)

| Interdit absolu | Statut |
|---|---|
| Analyse de la voix comme trait | ✅ ZÉRO — la doctrine (02) est NORMATIVE : la voix est écoutée par l'autre, le moteur ne la scanne pas ; la spéc (01) n'implémente aucun scan |
| Compteur d'items | ✅ 8.5 = **0 item** — note explicite au README (ici) et au 00-README |
| Label clinique / marque / nom d'auteur | ✅ zéro (vérifié machine) |
| Mots d'absolu au rendu | ✅ zéro — aucun écran dans ce dossier ; les placeholders descriptifs (01) sont vérifiés machine |
| Étage forcé | ✅ aucun — la voix n'ouvre pas la photo d'elle-même (01 §2) |
| Export / tiers | ✅ aucun export ne contient l'audio ; aucun tiers (03) |

## ⚠️ Points en attente de validation comité (verrou [9])

- **Les libellés UI « Vibe Check / Voice Check »** : noms de la spec produit ; libellés
  définitifs des écrans — À VALIDER PAR LE COMITÉ (design).
- **La rétention de 30 jours glissants** (voix non écoutée) : proposition de production,
  À VALIDER PAR LE COMITÉ/juridique (03).
- **La parité Mode Classique** : le domicile de la fonctionnalité est le Mode Invisible ;
  la disponibilité en Mode Classique est un cadrage produit — À VALIDER PAR LE COMITÉ (01 §8).
- **Une voix active par conversation** (remplacement = purge de la précédente) : proposition,
  À VALIDER PAR LE COMITÉ (01 §3 · 03).

## 🔁 Circuit restant

Spécification (fait) → **design produit** (écrans définitifs) → **implémentation** (aucune
fonction d'analyse audio au cahier des charges — 02 normatif) → **revue comité/juridique**
(03). Aucun commit, aucun push de la présente session (règle [11]).
