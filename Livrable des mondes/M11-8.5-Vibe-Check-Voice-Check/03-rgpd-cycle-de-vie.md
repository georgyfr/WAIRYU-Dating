# LIVRABLE 3 — RGPD : LE CYCLE DE VIE DE L'AUDIO

> element : 8.5 « Vibe Check / Voice Check » · fiche : 03 — cycle de vie (sept temps)
> Régime : le renforcé du bloc intime (chiffrement dédié, révocabilité immédiate, hors exports,
> zéro tiers) appliqué à un audio de conversation · ⚠️ **8.5 = 0 item** : ce cycle porte une
> fonctionnalité, pas une quête — le compteur d'items du projet ne bouge pas.

## Vue d'ensemble (table récapitulative)

| Temps | Règle gravée | Statut |
|---|---|---|
| 1 — Création | consentement double, révocabilité immédiate | spécifié (01 §4) |
| 2 — Stockage | chiffrement renforcé, aucune copie côté client, pas de CDN public | spécifié (01 §7) |
| 3 — Lecture | streaming vers l'écouteur consenti uniquement | spécifié (01 §5) |
| 4 — Rétention | purge à la fermeture OU à la révocation OU au délai maximal court (30 jours glissants — proposition) | **À VALIDER PAR LE COMITÉ** |
| 5 — Suppression | effacement immédiat sur demande (RGPD) | spécifié (ci-dessous) |
| 6 — Export | aucun export ne contient l'audio | gravé (ci-dessous) |
| 7 — Tiers | aucun tiers | gravé (ci-dessous) |

## 1 — CRÉATION (consentement double, révocabilité immédiate)

- Rien ne s'enregistre sans un **geste explicite de l'orateur** (maintien pressé) — zéro
  captation à l'insu, zéro enregistrement en tâche de fond.
- Le consentement est **double** : l'orateur consent à partager, l'écouteur consent à
  écouter (un tap par écoute) — les deux, révocables à tout instant (01 §4).
- La révocation est **immédiate** : le retrait de l'orateur purge l'audio des deux côtés au
  même instant (01 §4 · 5 ci-dessous).

## 2 — STOCKAGE (chiffrement renforcé, aucune copie, pas de CDN public)

- **Chiffrement renforcé au repos** (régime du bloc intime) — l'audio dort chiffré, hors de
  tout stockage lisible, avec des clés dédiées au régime.
- **Aucune copie côté client** : lecture continue seule, zéro cache persistant, zéro
  téléchargement (01 §5).
- **Pas de CDN public** : l'audio reste derrière l'authentification du service — zéro cache
  distribué, zéro lien direct, zéro URL devinable.
- **Une copie vivante par conversation** : la voix active ; repartager une voix purge la
  précédente (proposition — À VALIDER PAR LE COMITÉ, 01 §3).

## 3 — LECTURE (streaming vers l'écouteur consenti uniquement)

- La lecture est un **streaming vers l'écouteur qui vient d'accepter** : un tap explicite
  par écoute, aucun lancement automatique (01 §4).
- **Aucune preuve d'écoute exposée** à l'orateur (pas de « vu », pas de compteur) : écouter
  est un geste privé (01 §4).
- La lecture ne crée rien : aucun artefact, aucune copie, aucune transformation (doctrine
  02 — zéro calcul de contenu).

## 4 — RÉTENTION (purge à la fermeture, à la révocation, au délai court)

| Déclencheur | Effet |
|---|---|
| **Fermeture de la conversation** | purge automatique de l'audio (les deux côtés) |
| **Révocation** (retrait de l'orateur / fermeture d'écoute) | purge immédiate du côté concerné — retrait de l'orateur : purge des deux côtés |
| **Délai maximal court** | proposition de production : **30 jours glissants si aucune écoute** — la voix non écoutée se retire d'elle-même ; l'orateur en est informé une fois (une seule notification, sans relance) · **À VALIDER PAR LE COMITÉ/juridique** |

- La voix écoutée vit tant que la conversation vit : elle se purge à la fermeture (1er
  déclencheur). Rien ne survit à la conversation — l'audio n'est pas un souvenir stocké,
  c'est un moment partagé.

## 5 — SUPPRESSION (effacement immédiat sur demande — RGPD)

- **Demande de suppression** : effacement **immédiat** de l'audio (les deux côtés) — le droit
  RGPD d'effacement s'exerce dans la conversation, sans détour, sans justification à fournir.
- La purge est **effective et définitive** : aucune ressuscitation, aucune réintégration
  depuis une sauvegarde vers l'espace vivant du produit.
- **Les sauvegardes froides** (régime des copies de secours) : sujet juridique ouvert — la
  proposition de production est l'exclusion de l'audio des sauvegardes courantes ; la
  doctrine exacte des sauvegardes froides : **À VALIDER PAR LE COMITÉ/juridique** (consigné,
  non tranché).

## 6 — EXPORT (aucun export ne contient l'audio)

- **Aucun export ne contient l'audio** — ni le tien, ni celui de l'autre : la voix vit dans
  la conversation, elle ne sort pas (01 §7).
- La portabilité RGPD s'exerce sur les **données déclarées** du compte (réponses, textes,
  paramètres) — la lecture restrictive pour l'audio de conversation est **assumée et
  consignée** (l'audio partagé appartient à un espace à deux ; le sortir d'un clic en ferait
  un objet copiable, contraire à l'écoute limitée) — **À VALIDER PAR LE COMITÉ/juridique**.

## 7 — TIERS (aucun tiers)

- **Zéro sous-traitant** de transcription, d'analyse, d'optimisation audio (doctrine 02 :
  aucune fonction de la liste interdite).
- **Zéro analytique audio** (aucune télémétrie du contenu) · **zéro service d'IA vocale** ·
  **zéro CDN public** (§2) · zéro transfert hors du périmètre du service.
- Le seul circuit de l'audio : l'orateur → le coffre chiffré du service → l'écouteur
  consenti. Rien d'autre n'existe.

## ⚠️ Note 0 item (répétée ici, comme au README et au 00)

> **8.5 = 0 item** — ce cycle de vie porte une FONCTIONNALITÉ de M11, pas une quête : le
> compteur d'items du projet ne bouge pas (M11 : 46 items = 36 + 6 + 3 + 1 geste).

## Points comité/juridique (cumul de la fiche)

1. Le délai de rétention : **30 jours glissants si aucune écoute** — proposition, À VALIDER.
2. Le remplacement de voix (purge de la précédente) — proposition, À VALIDER.
3. La doctrine des sauvegardes froides — À VALIDER (comité/juridique).
4. La lecture restrictive de l'export pour l'audio — consignée, À VALIDER.
5. Les libellés UI (placeholders du 01 §9) — À VALIDER (design).
