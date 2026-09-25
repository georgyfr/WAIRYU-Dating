# WAIRYU — Carte des URLs (Task 36)

> Demande fondateur : *« génère des URLs spécifiques pour toutes les pages ou onglets »*.
> Chaque page ET chaque onglet interne est désormais adressable individuellement
> (deep link partageable, bookmarkable). Le routage est en **hash** (`#/…`) —
> aucune reconfiguration serveur nécessaire, fonctionne sur tous les hôtes.
>
> Garantie append-only : les URLs historiques restent 100 % valables, rien n'est
> supprimé. Un slug inconnu dégrade gracieusement vers la page par défaut (jamais de 404).

## 1. Pages publiques (sans session)

| URL | Page | Notes |
|-----|------|-------|
| `#/` | Accueil | Détecte la session → bouton « Continuer » si connecté |
| `#/signup` | Créer un compte | Email/OTP + Google + Facebook |
| `#/login` | Connexion | Email/OTP + Google + Facebook |
| `#/verify?e=<email>` | Vérification du code OTP | `&d=<code>` en dev uniquement |
| `#/fb-complete` | Complétion OAuth Facebook | Retour de callback (email manquant) |

## 2. Pages principales — onglets de la barre permanente (session requise)

| URL | Onglet | Badge |
|-----|--------|-------|
| `#/discover` | 🔥 Découvrir | — |
| `#/likes` | ✨ Likes | Nombre de likes reçus |
| `#/matches` | ⚡ Matchs | — |
| `#/messages` | 💬 Messages | Messages non lus |
| `#/moments` | 🎬 Moments | — |
| `#/myprofile` | 👤 Profil | — |

## 3. Onglets internes — deep links (NOUVEAU Task 36)

### Découvrir — un URL par mode

| URL | Mode | Comportement |
|-----|------|--------------|
| `#/discover/classique` | 🔥 Classique | Ouvre la pile Classique ; bascule réelle (persistée) si le compte était sur un autre mode |
| `#/discover/interracial` | 🌍 Interracial | Ouvre la pile Interracial ; idem |
| `#/discover/invisible` | 🕯️ Invisible | Ouvre la pile Invisible (photos floutées) ; idem |
| `#/discover` | (mode du profil) | Comportement historique : mode des préférences serveur |

- Alias anglais acceptés : `#/discover/classic` = `#/discover/classique`.
- Basculer de mode DANS l'app met l'URL à jour automatiquement
  (`history.replaceState` — le bouton retour revient à la page précédente,
  pas au mode d'avant).
- Un deep link d'un mode ≠ serveur déclenche la vraie bascule (même logique
  qu'un clic : PUT persistant + deck du bon bassin + toast d'erreur garanti
  en cas d'échec — Task 33).

### Likes — un URL par filtre

| URL | Filtre | Comportement |
|-----|--------|--------------|
| `#/likes/tous` | Tout | Grille complète des likes reçus |
| `#/likes/likes` | ♥ Likes | Uniquement les likes simples |
| `#/likes/supers` | ✶ Super Likes | Uniquement les Super Likes |
| `#/likes` | Tout | Comportement historique |

- Alias anglais acceptés : `all`, `like`, `super` (`#/likes/super` = `#/likes/supers`).
- Le filtrage reste local et instantané (aucun appel API).

## 4. Écrans secondaires (session requise, navigation propre)

| URL | Écran | Notes |
|-----|-------|-------|
| `#/profile` | Assistant profil & photos | Protégé — redirection accueil si hors session |
| `#/questionnaire` | Questionnaire de personnalité | Étape 4 |
| `#/chat/<conversationId>` | Chat temps réel d'une conversation | Ouvrable depuis Likes, Matchs, Messages |
| `#/app` | Paramètres du compte | Compte, confidentialité, vérification, notifications |

## 5. Règles de navigation (Task 36)

1. **Changement de page** (barre d'onglets, boutons) → l'URL est poussée dans
   l'historique : le bouton retour du navigateur revient à la page précédente.
2. **Changement d'onglet interne** (mode de Découvrir, filtre de Likes) →
   l'URL est mise à jour via `replaceState` : partageable, mais sans polluer
   l'historique.
3. **Deep link ouvert directement** (nouvel onglet, lien partagé) → la page
   s'ouvre dans l'état demandé ; si la session est absente, retour accueil
   (comportement de protection inchangé).

## 6. Résumé ultra-court (à copier-coller)

```
#/                           Accueil
#/signup                     Inscription
#/login                      Connexion
#/verify?e=<email>           Code OTP
#/discover                   Découvrir (mode du profil)
#/discover/classique         Découvrir — 🔥 Classique
#/discover/interracial       Découvrir — 🌍 Interracial
#/discover/invisible         Découvrir — 🕯️ Invisible
#/likes                      Likes (Tout)
#/likes/tous                 Likes — Tout
#/likes/likes                Likes — ♥ Likes
#/likes/supers               Likes — ✶ Super Likes
#/matches                    Matchs
#/messages                   Messages
#/moments                    Moments
#/myprofile                  Mon profil
#/chat/<conversationId>      Chat d'une conversation
#/profile                    Assistant profil & photos
#/questionnaire              Questionnaire personnalité
#/app                        Paramètres du compte
```

---

## 7. Task 39 — Univers événementiel « Wairyu Moments » (deep links ajoutés)

Le mode événementiel dispose de ses propres URLs (slugs français canoniques,
alias anglais tolérés, slug inconnu → dégradation gracieuse, jamais 404) :

```
#/events                    Wairyu Moments — Découvrir (feed d'événements)
#/events/mes                Mes événements — onglet par défaut (À venir)
#/events/mes/a-venir        Mes événements — À venir (alias : avenir, upcoming)
#/events/mes/organises      Mes événements — Organisés (alias : organized, organised)
#/events/mes/passes         Mes événements — Passés (alias : past)
#/events/mes/billets        Mes événements — Mes billets (QR) (alias : tickets)
#/events/creer              Créer un événement (alias : create, nouveau)
```

Entrées / sorties de l'univers :

- Toute route `#/events*` active le **contexte Moments** : la navigation
  bascule sur 4 onglets + bouton central « + » (Découvrir · Mes events ·
  [+] Créer · Moments · Profil) et l'identité turquoise s'applique à toute
  l'app tant que le contexte est actif (y compris sur Profil).
- Le badge « Moments · actif » des écrans événementiels bascule le retour
  vers le mode rencontre (#/discover) — comme le badge de l'en-tête du
  prototype (clic = basculer de mode).
- `#/moments` (onglet historique) existe toujours : en contexte Moments, il
  met en évidence l'entrée « Moments » de la nav événementielle ; sinon il
  reste l'onglet « Moments » de la nav dating, inchangé.
