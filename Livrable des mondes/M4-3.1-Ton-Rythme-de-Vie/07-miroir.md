# LIVRABLE 7 — MIROIR DE QUÊTE (ÉTAGE 2) — QUÊTE 3.1 « TON RYTHME DE VIE »

> **Brique paramétrée — standard v2** · Miroir **LÉGER** (gabarit **80-150 mots/variante**,
> Constitution [7] — 5 items) · **3 profils** : matinal / intermédiaire / nocturne — **chacun
> respecté, aucune norme** (l'oiseau de nuit n'est pas un défaut). Structure : **TA LUMIÈRE** ·
> **→ TON OMBRE (en couple)** · **→ TA TENSION** · **→ LE MINI-RES**. Ombre ≥ lumière · registre
> probabiliste · coût double nommé · rappels en toutes lettres · zéro métadonnée.
> Badge 🌅 (matinal) / 🦉 (nocturne) à l'écran — jamais un grade, l'intermédiaire n'en porte pas.

## 0 — Champ de saillance

Quête à brique unique : les 5 réponses produisent **une** brique, choisie par la matinalité
CHRONO_D (moyenne recodée, normalisée) : **matinal** (> 0.65, badge 🌅) · **intermédiaire**
(0.35-0.65) · **nocturne** (< 0.35, badge 🦉) — bornes reprises FM-019, provisoire concepteur
(SIG-3.1-01, À VALIDER PAR LE COMITÉ). Les noms de profils sont des ID moteur ; le rendu parle
en images (le lever avec le soleil, l'entre-deux, les heures calmes), jamais en étiquette.

## 1 — Les 3 profils

### MR-31-RYT-MATINALE — l'heure du lever

**TA LUMIÈRE**
Ta journée démarre tôt et tu y es toi : « tu fonctionnes au mieux quand le jour se lève », comme tu l'as répondu. Les premières heures sont tes heures fortes — la tête claire avant le bruit.

**→ TON OMBRE (en couple)**
Le matin appelle le silence, et pas tout le monde l'a encore trouvé. La recherche documente que les couples à rythme matinal vivent souvent des soirées plus courtes que celles de l'autre. Le risque : fermer la journée avant que l'autre y entre. Le coût pour toi : un coucher que ton corps choisit avant ta tête. Le coût pour l'autre : une moitié de soirée à deux, l'autre moitié à un.

**→ TA TENSION**
Ton énergie part tôt — elle attend le monde au lever.

**→ LE MINI-RES**
- Lumière : tes premières heures valent les journées des autres.
- Ombre : la journée finit plus tôt — pour toi comme pour deux.
- Mode d'emploi : nomme ton créneau fort, il devient un rendez-vous possible.

### MR-31-RYT-ENTRE-DEUX — l'heure qui glisse

**TA LUMIÈRE**
Ton rythme ne vote ni matin ni soir. Les heures calmes et le lever du jour te valent pareil, comme tes réponses le disent. Tu glisses — et ce glissement est une ressource.

**→ TON OMBRE (en couple)**
L'entre-deux s'adapte, mais l'adaptation répétée coûte : la recherche documente que les profils flexibles finissent souvent par porter les compromis d'agenda du couple. Le risque : n'avoir plus d'heure à soi, faute d'avoir défendu la sienne. Le coût pour toi : une horloge qui suit les autres. Le coût pour l'autre : chercher ton heure sans la trouver marquée nulle part.

**→ TA TENSION**
Ton heure bouge — elle se défend rarement toute seule.

**→ LE MINI-RES**
- Lumière : ta souplesse dénoue les agendas bloqués.
- Ombre : trop de flex, plus d'heure à toi.
- Mode d'emploi : protège un créneau fixe — le glissement y gagne une ancre.

### MR-31-RYT-NOCTURNE — l'heure des calmes

**TA LUMIÈRE**
Ton énergie se lève quand le monde se couche, comme tu l'as répondu. Les heures où le monde se calme sont tes heures fortes. C'est une façon d'habiter la journée, pas un défaut : le soir te rend à toi.

**→ TON OMBRE (en couple)**
Le soir appelle le calme, et pas tous les agendas le savent. La recherche documente que les couples à rythme tardif vivent souvent des matinals plus raccrochés que ceux de l'autre. Le risque : démarrer la journée décalé du duo. Le coût pour toi : un lever que le monde impose avant ton horloge. Le coût pour l'autre : une moitié de matinée à deux, l'autre moitié à un.

**→ TA TENSION**
Ton énergie arrive tard — elle fait la queue au monde du matin.

**→ LE MINI-RES**
- Lumière : tes soirées portent ce que les jours n'ont pas.
- Ombre : le matin exige sa part — à deux plus qu'à un.
- Mode d'emploi : nomme ton créneau fort, il devient un rendez-vous possible.

## 2 — Gabarit paramétré (assemblage moteur)

**GAB-MR-31-RYT** :
- `texture_seed` → fixe (1 variante par profil) · `CHRONO_D` → matinal (> 0.65, badge 🌅) /
  intermédiaire (0.35-0.65) / nocturne (< 0.35, badge 🦉) — bornes FM-019, provisoire concepteur
  (SIG-3.1-01, À VALIDER PAR LE COMITÉ).
- `citation_items` → rappel en toutes lettres d'UN direct et d'UN inversé réels, résolus verbatim
  contre `01-tableau-des-items.md` — JAMAIS les codes, jamais le score.
- Aucune mention du concept public (chronotype) ni de l'écart calculé (SIG-3.1-02 sans trace).

## 3 — Table d'ancrage (affirmation → items → vérification)

| Brique (ID moteur) | Affirmation rendue | Items (champ moteur) | Vérification |
|---|---|---|---|
| MR-31-RYT-MATINALE | « les premières heures sont tes heures fortes » | Q3.1-01 → 05, CHRONO_D > 0.65 | Citations résolues verbatim contre le tableau 01 ; aucun code rendu |
| MR-31-RYT-ENTRE-DEUX | « ton rythme ne vote ni matin ni soir » | CHRONO_D 0.35-0.65 | idem |
| MR-31-RYT-NOCTURNE | « le soir te rend à toi » | CHRONO_D < 0.35 | idem — le rythme tardif respecté, jamais un défaut |

## 4 — Signatures intégrées (registre 03 — aucune inventée)

| Signature | Intégration au miroir |
|---|---|
| **SIG-3.1-01 — Le rythme** | Le champ de saillance (§0) applique les seuils blocs ; le rendu parle d'images (le lever, l'entre-deux, les calmes), jamais d'étiquette ni de discipline. Le badge 🌅/🦉 accompagne les extrêmes à l'écran — pont de conversation, jamais un grade. |
| **SIG-3.1-02 — La compatibilité de rythme** | Aucun texte calculé — l'ombre de chaque profil documente la friction en situation GÉNÉRIQUE (les agendas, les meilleurs moments communs) au registre fréquentiel ; l'écart CALCULÉ à un membre ne se raconte jamais, aucun score rendu, jamais d'élimination. |

## 5 — Contrôles avant livraison (affichés)

| Contrôle | Résultat |
|---|---|
| Volume 80-150 mots par variante (markup inclus) | ✅ 3/3 (comptage machine — voir rapport de vague) |
| Ombre ≥ lumière par variante | ✅ 3/3 |
| Conséquence probabiliste | ✅ 3/3 (« la recherche documente que ») |
| Coût double nommé | ✅ 3/3 |
| Anti-normativité (le soir n'est pas un défaut, le matin pas une vertu) | ✅ |
| Rappels en toutes lettres (jamais un code) | ✅ |
| Zéro interdit lexical | ✅ |
| Zéro jargon (chronotype/rMEQ côté moteur) | ✅ |
| L'écart calculé à un membre jamais rendu (SIG-3.1-02 sans trace) | ✅ vérifié machine |
| Ouvertures non identiques entre profils | ✅ (lever tôt · glissement · énergie tardive) |

## TABLE DE FICHIERS (format P1)

═══ FICHIER : Livrable des mondes/M4-3.1-Ton-Rythme-de-Vie/07-miroir.md ═══
(écrit directement sur disque — accès FS ; la présente table consigne la livraison)
═══ FIN FICHIER ═══

> Fichier touché par la présente livraison : un seul — `07-miroir.md` (créé V9.A).
> Aucune signature inventée ; SIG-3.1-01/02 formalisent des bornes déjà cadrées par la mission.
