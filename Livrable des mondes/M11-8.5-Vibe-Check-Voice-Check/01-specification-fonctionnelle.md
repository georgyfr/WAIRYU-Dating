# LIVRABLE 1 — SPÉCIFICATION FONCTIONNELLE : VIBE CHECK / VOICE CHECK

> element : 8.5 « Vibe Check / Voice Check » · fiche : 01 — la mécanique complète
> 🆓 GRATUIT · P2 · match · domicile naturel : Mode Invisible · **0 item** (fonctionnalité).
> Les placeholders d'écrans (§9) sont descriptifs — texte non définitif, à habiller par le design.

## §1. L'objet

**Vibe Check / Voice Check** — une fonctionnalité de M11 : le partage d'une voix courte dans
une conversation de match. Deux volets d'une même fonctionnalité (proposition de production,
comité) :

- **Voice Check** — le volet de l'orateur : enregistrer sa voix et la partager à son match.
- **Vibe Check** — le volet de l'écouteur : accepter d'écouter la voix de son match.

Les libellés définitifs des écrans (et la répartition des deux noms) : À VALIDER PAR LE
COMITÉ (design). Le présent fichier spécifie la mécanique, pas la copie finale.

## §2. La place dans la révélation par étapes

**La révélation par étapes : texte → voix → photo.**

| Étage | Contenu | Ouverture |
|---|---|---|
| 1 — le texte | la conversation écrite | la porte du match (elle-même consentie) |
| 2 — la voix | la voix partagée (cette fonctionnalité) | une décision humaine de chaque côté — l'enregistrement (orateur) puis l'acceptation d'écoute (écouteur) |
| 3 — la photo | le visage | une décision humaine des DEUX — gouvernée par ses propres règles produit, hors du périmètre de la présente spéc |

**Verrou gravé : la voix n'ouvre pas la photo d'elle-même.** Passer à la voix ne débloque
aucun étage suivant : chaque étage est optionnel, chaque étage a son propre consentement, et
un membre peut s'arrêter à un étage pour de bon — rien ne presse, rien ne rappelle.

**Le rôle doctrinal** : la voix réintroduit le vivant (l'intonation, le rire, le timbre) que
le texte aplatit, avant l'exposition brutale du visage. Dans le **Mode Invisible** — où le
visage reste caché — la voix devient l'étage naturel du milieu : l'attirance avance sans
imposer le corps.

## §3. L'enregistrement

| Règle | Spécification |
|---|---|
| Durée | **30 secondes MAX par voix** — le compteur d'enregistrement coupe à 30 s |
| Prises | **une prise réenregistrable avant envoi** : autant de reprises que voulu AVANT l'envoi ; après envoi, la prise est figée (elle se retire, elle ne se refait pas — le retrait est au §4/§6) |
| Volume | une **seule voix active par conversation** : repartager une voix remplace la précédente (l'ancienne est purgée — proposition, À VALIDER PAR LE COMITÉ ; voir 03 §2) |
| Cadre | l'enregistrement se fait dans l'app, à la demande de l'orateur ; zéro enregistrement en tâche de fond, zéro captation à l'insu (les deux membres voient l'état de la voix : partagée / retirée) |

## §4. Le consentement des DEUX

> **L'écouteur consent à écouter ; l'orateur consent à partager — révocable des deux côtés
> à tout instant.**

| Côté | Consentement | Révocation |
|---|---|---|
| **Orateur** | il enregistre et envoie : un acte explicite — rien d'automatique | il **retire** sa voix à tout instant → purge immédiate des deux côtés (la voix n'existe plus, pour personne) |
| **Écouteur** | il **accepte d'écouter** : un tap explicite PAR écoute — aucun lancement automatique, aucune lecture auto, aucune notification qui presse | il **ferme l'écoute** à tout instant : la voix quitte sa vue, sans message envoyé à l'autre — refuser d'écouter est un geste privé |

- **Refuser d'écouter n'a aucune conséquence** : aucun score, aucune trace, aucun signal,
  aucun message à l'autre (le refus ne répond à personne — il se tait).
- **Écouter n'est pas un acte compté devant l'autre** : aucune preuve d'écoute n'est exposée
  à l'orateur (pas de « vu », pas de compteur d'écoutes — écouter est un geste privé).
- Le consentement est **par écoute** (pas un « oui » une fois pour toutes) : chaque écoute
  repart d'un tap explicite.

## §5. L'écoute limitée

- La voix **s'écoute en lecture continue** (streaming) : elle se joue, elle ne se pose pas.
- **Elle ne se télécharge pas** — zéro fichier téléversé vers l'appareil, zéro bouton
  d'enregistrement de l'écoute, zéro copie côté client.
- **Elle ne se re-partage pas** — zéro transfert vers une autre conversation, zéro
  transfert hors app, zéro lien partageable.
- **Zéro transcription automatique, zéro sous-titrage moteur** : l'écoute est humaine —
  aucune transformation du contenu de la voix n'existe (doctrine 02).

## §6. La durée de vie

- La voix **se retire quand la conversation se ferme** : la fermeture de la conversation
  entraîne la purge automatique de l'audio (03 §4).
- La voix **se retire sur demande** : le retrait de l'orateur est immédiat et définitif
  (§4) ; la demande de suppression (droit RGPD) suit le flux de 03 §5.
- La voix non écoutée ne s'accumule pas : le délai maximal court s'applique (30 jours
  glissants — proposition, À VALIDER PAR LE COMITÉ : 03 §4).

## §7. La protection

| Règle | Spécification |
|---|---|
| Au repos | **chiffrement renforcé** (régime du bloc intime) — l'audio dort chiffré, hors de tout stockage lisible |
| En transit | transport chiffré de bout en bout du canal app |
| Côté client | **aucune copie** : lecture continue seule (§5), zéro cache persistant |
| Diffusion | **pas de CDN public** — l'audio reste derrière l'authentification du service, hors de tout cache distribué |
| Exports | **hors de tout export** — aucun export ne contient l'audio (03 §6) |
| Tiers | **aucun tiers** — pas de service d'analyse vocale, pas d'analytique audio, pas de sous-traitant (03 §7) |

## §8. Le Mode Invisible (P2)

- Le **domicile naturel** de la fonctionnalité est le **Mode Invisible** : c'est là que la
  révélation par étapes prend tout son sens (le visage caché, la voix comme étage du milieu).
- **Parité Mode Classique** : la disponibilité du Vibe/Voice Check en Mode Classique (à
  parité, mêmes règles) est un cadrage produit — **À VALIDER PAR LE COMITÉ** ; la présente
  spéc s'écrit pour les deux modes (la mécanique est identique, seule la porte change).

## §9. Les écrans (placeholders descriptifs — texte non définitif)

> Chaque placeholder est une **description d'écran** pour le design : il fixe le contenu
> nécessaire, pas la formulation finale (libellés : comité). Vérifiés machine (zéro interdit
> lexical, zéro mot d'absolu).

| Écran | Porteur | Placeholder descriptif |
|---|---|---|
| Enregistrement | orateur | « [Maintiens et parle — trente secondes au plus. Réécoute-toi. Reprends autant de fois que nécessaire. Tu envoies quand c'est toi.] » |
| Ré-écoute avant envoi | orateur | « [Ta prise, telle qu'elle partira. Tu peux la reprendre ou l'envoyer.] » |
| Envoi | orateur | « [Ta voix vivra dans cette conversation. Elle s'écoute, elle ne se garde pas. Tu la retires quand tu veux.] » |
| Écoute | écouteur | « [Ton match t'a laissé une voix. Elle s'écoute ici — elle ne se garde pas. Tu l'acceptes ?] » |
| Retrait | orateur | « [Ta voix est retirée. Elle n'existe plus ici, pour personne.] » |

## §10. Ce que la fonctionnalité n'est pas (liste fermée)

- **Pas un test** : rien ne se mesure — la voix s'écoute, elle ne se scanne pas (02).
- **Pas un enregistrement caché** : les deux membres voient l'état de la voix ; les deux
  consentent, les deux révoquent (§4).
- **Pas une messagerie vocale** : pas d'historique audio qui s'accumule — une voix active
  par conversation (§3), une durée de vie courte (§6).
- **Pas un export** : aucun export ne contient l'audio (03 §6).
- **Pas un canal tiers** : zéro sous-traitant, zéro analytique, zéro CDN public (03 §7).
- **Pas une porte forcée** : la voix n'ouvre pas la photo d'elle-même (§2) ; refuser
  d'écouter n'a aucune conséquence (§4).
