# LIVRABLE 3 — SIGNATURES ATTENDUES DU BLOC 4.4 (format du registre)

> ⚠ **Seuils et pondérations : verrou [9]** — valeurs de production PROVISOIRES
> (**« À VALIDER PAR LE COMITÉ »**, provisoire concepteur — re-signature professionnelle
> avant bêta, FM-019). **Les 5 schémas et la matrice vivent côté moteur SEUL** (Constitution [3]) —
> leur seule trace rendue est le **portrait de monde M5** (section « Ton Héritage »), au ton
> bienveillant, sans label.
> **RSQ, DTM_N, BLA sont des codes gelés du dictionnaire [4]** (registre signaux.json).

## Les variables fournies par le bloc

| Variable | Source | Domaine | Niveaux |
|---|---|---|---|
| **ABAN_D** | abandon (Q4.4-01 → 03, I recodés, normalisée) | 0-1 | bas < 0.35 · moyen · fort > 0.65 (proposition — comité) |
| **CARE_D** | carence affective (Q4.4-04 → 06, I recodés, normalisée) | 0-1 | idem (comité) |
| **MEFI_D** | méfiance — la garde (Q4.4-07 · 08, I recodés, normalisée) | 0-1 | idem (comité) |
| **ASSUJ_D** | assujettissement — le pli (Q4.4-09 · 10, I recodés, normalisée) | 0-1 | idem (comité) |
| **EXIG_D** | imperfection/exigence — la barre (Q4.4-11 · 12, I recodés, normalisée) | 0-1 | idem (comité) |
| **FIS** | aisance dans l'intimité (Q4.4-T13 → T18, D, normalisée — trames hors dépôt) | 0-1 | moteur seul — croisement FIS × attachement (refonte) |
| **MEFI_INT** | méfiance dans l'intimité naissante (Q4.4-T19 → T22, D, normalisée) | 0-1 | moteur seul — agrégée au registre méfiance |

| ID | Nom | Conditions exactes | Conséquence | Source | Fenêtre cible |
|---|---|---|---|---|---|
| **SIG-4.4-01** | La peur du départ (abandon) | **3 niveaux sur ABAN_D** (proposition — À VALIDER PAR LE COMITÉ [9]) : bas < 0.35 · moyen · fort > 0.65 | Portrait « Ton Héritage » : la sentinelle — **lumière = la fonction passée de protection** (avoir guetté a parfois tenu une maison), **ombre = le coût en couple** (la réponse tardive lue comme un adieu, la vérification qui fatigue) — registre probabiliste, jamais un diagnostic, jamais un label | 3 items carte-bloc | recalcul à chaque mise à jour ⚠ |
| **SIG-4.4-02** | La réserve affective (carence) | **3 niveaux sur CARE_D** (comité) | Portrait : la balance — lumière = avoir veillé sur les autres, ombre = le compte secret qui creuse la distance (donner sans dire, les besoins effacés) | 3 items carte-bloc | recalcul ⚠ |
| **SIG-4.4-03** | La garde (méfiance) | **3 niveaux sur MEFI_D** (comité) — **lecture complémentaire** de la méfiance trame T09-T12 (1.2, projetée générale) et de MEFI_INT (intimité naissante) | Portrait : la porte — lumière = la prudence qui protège, ombre = la vérification qui devance l'abandon ; **croisement matrice : Méfiance × RSQ haut = protection** (SIG-4.4-06) | 2 items carte-bloc + registre méfiance | recalcul ⚠ |
| **SIG-4.4-04** | Le pli (assujettissement) | **3 niveaux sur ASSUJ_D** (comité) | Portrait : le pli — lumière = l'attention aux autres qui harmonise, ombre = la paix achetée au prix du désaccord (l'avis qui attend, la fatigue de couler) ; **croisement : renforcement héritage pesant (4.1, LOYAUTE_D) × pli** | 2 items carte-bloc | recalcul ⚠ |
| **SIG-4.4-05** | La barre (imperfection/exigence) | **3 niveaux sur EXIG_D** (comité) | Portrait : la barre — lumière = le soin du travail bien fait, ombre = la correction sans fin (l'autre vit une exigence qu'il n'a pas posée) | 2 items carte-bloc | recalcul ⚠ |
| **SIG-4.4-06** | La matrice des pièges systémiques | **Côté moteur** (proposition — À VALIDER PAR LE COMITÉ [9], valeurs consignées hors dépôt si sensibles) : ① **Abandon (fort) × Évitement (1.2) = pénalité forte** — le départ anticipé double la distance ; ② **Carence (fort) × Narcissisme (DTM_N) = pénalité forte** — la balance qui penche face à la balance qui se remplit ; ③ **Méfiance × RSQ haut = PROTECTION — le blessé est protégé, le stratège est neutralisé** (doctrine établie : la vigilance vulnérable reçoit de la place, la vigilance stratège n'en tire rien) ; ④ **FIS (fort) × évitement (1.2) = renforcement de pénalité** — la peur du profond redouble la distance déclarée ; ⑤ (documenté) **RB1 × BLA** (4.2 × 4.3) = renforcement des protections de pacing | **Côté moteur SEUL — jamais au score de compatibilité affiché, jamais au matching visible, jamais au premium** ; les croisements modulent la protection (pacing, visibilité, modération des mises en avant) et la qualité du pool de découverte — la sortie existe (demi-vie des signaux) ; aucune stigmatisation, aucun verdict rendu — **« c'est du matching, pas du portrait »** (mission V10.D) | 12 cartes + 10 trames + croisements 1.2 (Évitement) · 4.2 (RSQ, RB1) · 4.3 (BLA) · registre (DTM_N) | recalcul à chaque mise à jour ⚠ · demi-vie ⚠ |

## Notes de registre

- **Le bloc alimente la protection, il ne se montre pas** (refonte verbatim : « alimente la
  protection, non affiché comme quête ») — aucun écran, aucun score, aucune carte.
- **Trois lectures de la méfiance, un seul registre** : MEFI_D (cartes), T09-T12 (1.2),
  MEFI_INT (trames) — l'agrégation respecte les angles distincts (jamais un double comptage
  du même angle).
- **La protection n'est pas un verdict** : Abandon × Évitement « pénalité forte » signifie
  visibilité réduite et pacing doublé — jamais une exclusion, jamais un message rendu.
- **Registre probabiliste obligatoire** — « conduit fréquemment à », « la recherche documente
  que », jamais le futur certain sur un membre.
- **Zéro jargon rendu** : ABAN_D, CARE_D, MEFI_D, ASSUJ_D, EXIG_D, FIS, MEFI_INT, SIG-4.4-01
  → 06 restent moteur — au rendu du portrait : la sentinelle, la balance, la porte, le pli,
  la barre (images bienveillantes).
- Les signatures sont rejouées hors dépôt (le bloc n'apparaît nulle part au dépôt rendu sous
  ses codes).
