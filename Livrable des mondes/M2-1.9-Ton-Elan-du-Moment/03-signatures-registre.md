# LIVRABLE 3 — SIGNATURES ATTENDUES DE LA QUÊTE 1.9 (format du registre)

> ⚠ **Bornes : reprises des degrés ADOPTÉS (FM-019) — provisoire concepteur — re-signature
> professionnelle avant bêta.** Les fenêtres de flux restent À VALIDER PAR LE COMITÉ.
> Aucune signature de sécurité (trame) n'est attachée à cette quête — vérifié au registre du mélange.

## Les variables fournies par la quête

| Variable | Source | Domaine |
|---|---|---|
| **ELAN_AUT** | autonomie du moment (Q1.9-01 → 03, recodés, normalisé) | 0-1 |
| **ELAN_COMP** | compétence du moment (Q1.9-04 → 06, recodés, normalisé) | 0-1 |
| **ELAN_AFF** | affiliation du moment (Q1.9-07/08, recodés, normalisé) | 0-1 |
| **ELAN_TOT** | élan du moment = moyenne des trois besoins | 0-1 |

Bornes de degrés (reprises des zones moteur ADOPTÉES FM-019 — provisoire concepteur) :
faible < 0.35 · central 0.35-0.65 · élevé > 0.65.

| ID | Nom | Conditions exactes | Conséquence | Source | Fenêtre cible |
|---|---|---|---|---|---|
| **SIG_ÉLAN_FAIBLE** | Le rythme doux | **≥ 2 besoins** sur les trois en zone faible (score de besoin < 0.35) — bornes provisoire concepteur (FM-019), re-signature avant bêta | **Rythme doux de l'app** : espacement des relances, allègement des flux de notification, parcours rétention interne priorisé. Le membre vit une app plus calme — il ne voit AUCUN texte sur son état, AUCUNE mention du mécanisme. **JAMAIS au score, JAMAIS au matching, JAMAIS aux portraits** | 8 items d'état (3 besoins) | fréquence attendue ⚠ À VALIDER PAR LE COMITÉ |

## Notes de registre

- **SIG_ÉLAN_FAIBLE est un signal d'EXPÉRIENCE, pas un signal de personne** : il ajuste le rythme de
  l'app, il ne décrit ni ne juge personne. Aucun texte rendu, aucun slot, aucune citation — son
  unique sortie est le confort de navigation.
- **La ré-administration (30 jours)** remonte l'état : l'extinction du signal (élan remonté) rend au
  rythme standard, sans récompense ni commentaire — personne n'est félicité d'avoir de l'élan.
- **Fiabilité longitudinale** : la concordance des passations à 30 jours alimente la qualité de la
  lecture (proposition — À VALIDER PAR LE COMITÉ). Une divergence forte entre deux états n'est pas
  une incohérence : c'est une vie qui bouge.
- **Frontière stricte avec 1.8** : aucune corrélation exigée entre élan et bien-être — 1.8 (PHQ-9,
  Phase 3, opt-in strict) reste un territoire séparé, sans croisement automatique. Tout pont futur
  passerait par une Fiche de Mutation et le verrou [9].
- **Le nom interne (ELAN_*, SIG_ÉLAN_FAIBLE) vit côté moteur uniquement** — zéro sigle rendu.
