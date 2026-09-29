# LIVRABLE 7 — MIROIR DE QUÊTE (ÉTAGE 2) — QUÊTE 3.6 « LE CHOIX VISUEL »

> **Brique paramétrée — standard v2** · Miroir **LÉGER** (gabarit **80-150 mots/variante**,
> Constitution [7] — 8 paires) · **3 profils** : l'ancre / l'équilibre / l'horizon — **trois
> teintes, aucune norme**. Structure : **TA LUMIÈRE** · **→ TON OMBRE (en couple)** ·
> **→ TA TENSION** · **→ LE MINI-RES**. Ombre ≥ lumière · registre probabiliste · coût double
> nommé · rappels en toutes lettres · zéro métadonnée.
> **Mesure FAIBLE : ce miroir se rend uniquement EN COMPLÉMENT d'autres restitutions — jamais
> seul, jamais clinique** (refonte verbatim — verrou 04 n° 4). Aucune trace de la lecture P6
> (Arbitrage 4 — verrou 04 n° 5).

## 0 — Champ de saillance

Les 8 choix produisent **une** brique, choisie par la dominante d'ancrage VISO_ANC (0 à 8) :
**ancré-dominant** (≥ 6) · **équilibre** (3-5) · **horizon-dominant** (≤ 2) — bornes reprises
FM-019, provisoire concepteur (SIG-3.6-01, À VALIDER PAR LE COMITÉ). Les noms de profils sont des
ID moteur ; le rendu re-cite des images (ton intérieur, ta fenêtre, ton dimanche), jamais une
étiquette psychologique.

## 1 — Les 3 profils

### MR-36-VIS-ANCRE — l'ancre

**TA LUMIÈRE**
Tes images penchent au repos : la maison, la stabilité, le café lent, le dimanche cadencé — comme tes choix le disent. Tu choisis des lieux qui te portent.

**→ TON OMBRE (en couple)**
L'ancrage rassure, mais il se ferme : la recherche documente que les préférences stables vivent fréquemment des partenaires qui veulent partir. Ton risque : des journées qui se ressemblent — et un autre qui s'ennuie. Le coût pour toi : un calme qui devient une habitude aveugle. Le coût pour l'autre : un horizon qui se réduit à ta fenêtre.

**→ TA TENSION**
Tes images tiennent — elles laissent peu de place au vent.

**→ LE MINI-RES**
- Lumière : tes choix construisent des lieux où l'on respire.
- Ombre : l'ancre qui ne bouge plus devient un poids.
- Mode d'emploi : garde une image dehors — l'équilibre se choisit aussi.

### MR-36-VIS-EQUILIBRE — l'équilibre

**TA LUMIÈRE**
Tes images se partagent : tantôt la maison, tantôt le dehors — comme tes choix le disent. Tu navigues entre le calme et l'air libre sans y perdre ton fil.

**→ TON OMBRE (en couple)**
L'équilibre s'adapte, mais il se lit mal. La recherche documente que les teintes mélangées vivent fréquemment des attentes floues. L'autre ne sait pas si tu veux rester ou sortir. Le coût pour toi : trancher quand il le faut. Le coût pour l'autre : suivre une boussole qui varie.

**→ TA TENSION**
Tes images glissent — elles annoncent rarement leur vent.

**→ LE MINI-RES**
- Lumière : ta variété ouvre des week-ends à deux couleurs.
- Ombre : l'entre-deux demande un mot — sinon l'autre devine.
- Mode d'emploi : dis l'image de ta semaine — l'équilibre y gagne un langage.

### MR-36-VIS-HORIZON — l'horizon

**TA LUMIÈRE**
Tes images penchent dehors : la terrasse, le festin, le groupe, la ville qui bouge — comme tes choix le disent. Tu choisis des lieux où le monde entre.

**→ TON OMBRE (en couple)**
L'horizon emmène, mais il dépense : la recherche documente que les préférences ouvertes vivent fréquemment des partenaires qui ont besoin de rentrer. Ton risque : la maison devient un couloir. Le coût pour toi : une énergie qui se répand au-dehors. Le coût pour l'autre : un chez-soi à partager avec le monde.

**→ TA TENSION**
Tes images ouvrent — elles doivent parfois se refermer.

**→ LE MINI-RES**
- Lumière : tes choix apportent le monde à la table.
- Ombre : l'horizon sans retour fatigue la maison.
- Mode d'emploi : garde une image dedans — le retour se choisit aussi.

## 2 — Gabarit paramétré (assemblage moteur)

**GAB-MR-36-VIS** :
- `texture_seed` → fixe (1 variante par profil) · `VISO_ANC` → ancré-dominant (≥ 6) / équilibre
  (3-5) / horizon-dominant (≤ 2) — bornes FM-019, provisoire concepteur (SIG-3.6-01, À VALIDER
  PAR LE COMITÉ).
- `citation_items` → rappel en toutes lettres d'UN choix direct et d'UN choix opposé réels,
  résolus verbatim contre `01-tableau-des-paires.md` — JAMAIS les codes, jamais le score.
- **Rendu conditionné** : ce miroir ne s'affiche qu'en complément d'autres restitutions du Monde
  (verrou 04 n° 4) · AUCUNE trace de la lecture P6 (verrou 04 n° 5).

## 3 — Table d'ancrage (affirmation → items → vérification)

| Brique (ID moteur) | Affirmation rendue | Items (champ moteur) | Vérification |
|---|---|---|---|
| MR-36-VIS-ANCRE | « tu choisis des lieux qui te portent » | Q3.6-P1 → P8, VISO_ANC ≥ 6 | Citations résolues verbatim contre le tableau 01 ; aucun code rendu |
| MR-36-VIS-EQUILIBRE | « tantôt la maison, tantôt le dehors » | VISO_ANC 3-5 | idem |
| MR-36-VIS-HORIZON | « tu choisis des lieux où le monde entre » | VISO_ANC ≤ 2 | idem — l'ouverture respectée, jamais une instabilité |

## 4 — Signatures intégrées (registre 03 — aucune inventée)

| Signature | Intégration au miroir |
|---|---|
| **SIG-3.6-01 — Le lecteur d'images** | Le champ de saillance (§0) applique la partition (≥ 6 / 3-5 / ≤ 2) ; le rendu re-cite des images, jamais une étiquette psychologique ; mesure faible — rendu en complément uniquement. |
| **SIG-3.6-02 — La lecture complémentaire (P6)** | **Aucune intégration au rendu — par design** (Arbitrage 4) : la lecture contrôle/isolement vit dans la documentation 03, signal_id null, jamais rendue sauf Fiche de Mutation post-arbitrage comité. |

## 5 — Contrôles avant livraison (affichés)

| Contrôle | Résultat |
|---|---|
| Volume 80-150 mots par variante (markup inclus) | ✅ 3/3 (comptage machine — voir rapport de vague) |
| Ombre ≥ lumière par variante | ✅ 3/3 |
| Conséquence probabiliste | ✅ 3/3 (« la recherche documente que ») |
| Coût double nommé | ✅ 3/3 |
| Mesure faible (jamais seule, jamais clinique) | ✅ verrou 04 n° 4 — rendu conditionné |
| AUCUNE trace de la lecture P6 | ✅ vérifié machine |
| Les deux choix de chaque paire respectés | ✅ |
| Rappels en toutes lettres (jamais un code) | ✅ |
| Zéro interdit lexical | ✅ |
| L'écart calculé à un membre jamais rendu | ✅ vérifié machine |
| Ouvertures non identiques entre profils | ✅ (le repos · le partage · le dehors) |

## TABLE DE FICHIERS (format P1)

═══ FICHIER : Livrable des mondes/M4-3.6-Le-Choix-Visuel/07-miroir.md ═══
(écrit directement sur disque — accès FS ; la présente table consigne la livraison)
═══ FIN FICHIER ═══

> Fichier touché par la présente livraison : un seul — `07-miroir.md` (créé V9.F).
> Aucune signature inventée ; SIG-3.6-01/02 formalisent des bornes déjà cadrées par la mission
> (Arbitrage 4 documenté à l'entrée — 03).
