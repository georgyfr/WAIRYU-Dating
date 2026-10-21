# Lecture des documents fondateurs — le travail est-il toujours le même en termes de dimensions ?

> **Demande fondateur** (trace 1a15e690e0c53661, 21/10/2026) : « je veux que tu lises ces documents et que tu me dises si c'est toujours le même travail en termes de dimensions » — documents listés : `OUTILS DE TERAPIE DU COUPLE.txt` · `README.md` (hub) · `programme wairyu couple v2.txt` · `programme wairyu couple.pdf` · `programme wairyu couple.txt` · `README.md` (racine).
>
> **Méthode** : les 6 documents ont été lus intégralement (445 lignes + 202 lignes + 196 lignes + 32 lignes + 1 725 lignes + PDF extrait puis comparé), puis confrontés à l'état RÉEL du dépôt (hub, moteurs `apps/web/src/lib/quete-*.ts`, `voyage.ts`, `quetes.ts`, documents `calculs-quêtes/`, worklog). Chaque chiffre de ce document a été vérifié dans les fichiers cités. Rien n'est réinterprété : ce qui coïncide est dit, ce qui diffère est consigné.

---

## 1. Ce que sont les six documents (inventaire exact)

| Document | Contenu réel | Rôle |
|---|---|---|
| `programme wairyu couple.txt` | Canon intégral v1 (445 lignes, 12 parties) : projet, **26 dimensions** (Partie 2), 14 livrables, grammaire fédérée, **standard des ~110 quêtes** (Partie 5), mécanismes de calcul (Partie 6), moteur Solène, doctrine RIO, garde-fous, fonctionnalités, test IA, plan Data Insight | Le texte de référence de CONTENU |
| `programme wairyu couple v2.txt` | v2 consolidé (202 lignes) : Partie 13 (état de la validation à la date du 15/10/2026 — 2 échelles RIO validées, règles D-STD…) + résumé d'archive des Parties 1-12 | La consolidation officielle — **remplace la v1 comme contexte**, les Parties 1-12 de la v1 restent la référence de contenu |
| `programme wairyu couple.pdf` | Mise en forme du v2 (v2.0 du 15/10/2026) — contenu identique au txt v2 ; MD5 `bbf108c1…` **identique** à la copie `rapports/programme wairyu couple.pdf` | Le document de référence officiel pointé par le hub |
| `OUTILS DE TERAPIE DU COUPLE.txt` | Compilation de veille aspirée (1 725 lignes) — porte la **bannière de statut du 18/10/2026** (exécution P2 de l'audit pont WTC-LEGAL-01) : « CE DOCUMENT EST UNE COMPILATION DE VEILLE ASPIRÉE — PAS UNE SPÉCIFICATION PRODUIT » ; le DAS/EAD qu'il mentionne est un **fragment de veille, PAS utilisé** (audit PI §6, verdict CONFORME) | Matière de recherche — **ne définit aucun cadre de dimensions du programme** |
| `README.md` (dossier `Wairyu thérapie couple/`) | Hub de navigation (196 lignes, mis à jour le 21/10/2026) : arbre, 23 instruments RIO contresignés, règles permanentes, fautes d'orchestrateur, signaux, méthode commune | **L'état courant fait foi** — c'est lui qui reflète le travail réel |
| `README.md` (racine du dépôt) | Fiche de l'application v2 (32 lignes) : PWA React/Vite, écrans, espaces dating, palette | Décrit l'app — **ne porte aucune structure de dimensions** |

---

## 2. Cadre A — les 26 dimensions du canon WTC (et leur état réel)

Le canon (Partie 2) définit **26 dimensions en 6 blocs** :

| Bloc | Dimensions (verbatim canon) | Nb |
|---|---|---|
| **Héritage** | infantile · parentale · expérientielle · culturelle · sexuelle · religieuse | 6 |
| **Psychologique** | personnalité · attachement · émotionnelle · santé mentale | 4 |
| **Relationnel** | communication · pouvoir · rôles de genre · attentes | 4 |
| **Social-matériel** | économique · professionnelle · belle-famille · sociale | 4 |
| **Cycle de vie** | parentalité/procréation · cycle de vie · générationnelle · santé somatique | 4 |
| **Sociétal** | morale/éthique · politique/idéologique · numérique · spatiale | 4 |

Le standard des quêtes (Partie 5) : **structure 5 quêtes par dimension majeure** — Q1 la carte · Q2 l'ombre · Q3 la lumière · Q4 le croisement (à deux) · Q5 le pas (1 changement + suivi 14 jours) — 3 paliers (🟢 seul · 🟠 à deux · 🔴 professionnel), règle anti-fabrication, répartition annoncée « 5 quêtes pour 16 dimensions majeures, 4 pour 6 dimensions, 3 pour 4 extensions » (soit 16×5 + 6×4 + 4×3 = **116 quêtes**, annoncées « ≈ 110 » dans le canon — voir §6, E3).

**État réel du programme dans le dépôt (hub, 21/10/2026) : 5 dimensions couvertes, 23 instruments RIO-01 → RIO-23 contresignés**, exactement dans la structure 5 quêtes du canon :

| Dimension du canon | Bloc canon | Instruments (RIO) | Quêtes |
|---|---|---|---|
| Attachement | Psychologique | RIO-01 « Comment je me raccroche » → RIO-05 « Mon premier pas » | 5/5 (carte, ombre, lumière, croisement, pas) |
| Émotionnelle | Psychologique | RIO-06 « Ma météo intérieure » → RIO-10 « Mon premier geste du cœur » | 5/5 |
| Santé mentale | Psychologique | RIO-11 « Ma détresse et la leur » → RIO-15 « Mon premier pas vers l'autre rive » | 5/5 |
| Générationnelle (extension) | Cycle de vie | RIO-16 « L'écart de nos horloges » → RIO-18 « Le pas de l'horizon » | 3/3 (format extension) |
| Personnalité | Psychologique | RIO-19 « Manuel d'utilisation de moi » → RIO-23 « Le pas sous ma carte » | 5/5 |

La correspondance avec le canon est directe et vérifiable : « Comment je me raccroche » est la **Quête 1 du canon lui-même** (Partie 6.1, standard de référence, 18 items/2 axes) ; « Ce qui m'effraie vraiment » la Quête 2 (Partie 6.2) ; « Manuel d'utilisation de moi », « Nos deux langues » (RIO-09), « Nos deux rives » (RIO-14), « L'écart de nos horloges » (RIO-16) reprennent les livrables nommés au tableau de la Partie 2. **Il reste 21 dimensions** (6 Héritage + 4 Relationnel + 4 Social-matériel + 3 Cycle de vie + 4 Sociétal) au même standard.

---

## 3. Cadre B — le voyage de l'application (11 mondes · 50 quêtes)

L'application (`apps/web/src/lib/voyage.ts`) est bâtie sur une **autre structure**, documentée dans son en-tête : « doctrine du dépôt d'origine (Constitution v2.1 + Livrable des mondes, branche `archive/v1-2026-10-05`) : **11 MONDES · 50 QUÊTES** · étages de restitution · 6 mondes gratuits / 5 premium · M11 « Le Voyage à Deux » toujours gratuit, débloqué au premier match ».

Les 11 mondes (extraits vérifiés de `voyage.ts`) : M1 « Le Miroir » 3 quêtes (gratuit, ouvert) · M2 « Le Volant » 7 (gratuit, ouvert) · M3 « La Boussole » 8 (gratuit, ouvert) · M4 « Ton terrain » 7 (gratuit, ouvert) · M5 « Ton Héritage » 4 (gratuit, ouvert) · M6 « Mon Cœur » 4 (premium, ouvert) · M7 « Face aux Tempêtes » 3 (premium, ouvert) · M8 « L'Intime — L'Essentiel » 2 (premium, à venir) · M9 « L'Intime — Les Profondeurs » 3 (premium, à venir) · M10 « Mon Monde » 3 (premium, à venir) · M11 « Le Voyage à Deux » 6 (gratuit, à venir) — **somme 50 quêtes ; le 51ᵉ pas est la Rencontre**.

État réel des moteurs : **35 quêtes construites et en ligne** (fichiers `quete-1-1.ts` → `quete-5-7.ts`) ; 30 produisent une carte, 5 sont des écrans de passage (1.7, 1.11, 2.8, 3.7, 4.3) ; la quête 1.8 (PHQ-9) est au plan sans moteur ; la quête 4.4 « Blessures et aisance » est invisible par design (tissée chez 4.1/4.2). Les séries de fichiers **traversent les mondes** : `quete-1-1` → 1-3 sont les livrables M1-1.1 → M1-1.3 (Monde 1 « Le Miroir »), `quete-1-4` → 1-11 sont les livrables M2-1.4 → M2-1.11 (Monde 2 « Le Volant »), etc.

Le chantier **« calculs-quêtes »** (mode « travail par quête », trace 1a15de424e80a5a1) vérifie ces moteurs un par un, sur le moteur réel, sans réimplémentation :

| Quête vérifiée | Monde | Résultat | Commit |
|---|---|---|---|
| M1-1.1 « Ta personnalité » | Monde 1 « Le Miroir » | 40/40 | 925d742 |
| M1-1.2 « Ta façon de t'attacher » | Monde 1 « Le Miroir » | 56/56 | 9291ed9 |
| M1-1.3 « Tes émotions » | Monde 1 « Le Miroir » | 70/70 | c4fef69 |
| M1-1.4 « Ton contrôle sur toi-même » | Monde 2 « Le Volant » | 89/89 | 43077db |

Recouvrement avec le canon : les quêtes 1.1/1.2/1.3 du voyage ciblent des dimensions **homonymes du bloc Psychologique** (personnalité, attachement, émotions) — mais ce sont des **instruments distincts** des RIO du programme (contenus verbatim des livrables d'app, moteurs TypeScript reconstitués du bundle staging v1, passations gelées propres : graines 211427/212427/213427/214427). La quête 1.4 (autocontrôle) n'est pas une des 26 dimensions du canon : c'est une dimension du voyage.

---

## 4. Verdict — est-ce toujours le même travail en termes de dimensions ?

**Oui pour le programme WTC, sans aucune dérive.** Le dossier `Wairyu thérapie couple/` exécute exactement le travail défini par `programme wairyu couple` (v1 + v2) : mêmes 26 dimensions en 6 blocs, même structure 5 quêtes (carte/ombre/lumière/croisement/pas), même doctrine RIO (instruments ex nihilo, construits cités), mêmes garde-fous (jamais « pathologie » à l'écran, jamais l'évaluation du partenaire, filet 3919/3114, anti-fabrication), mêmes paliers. Cinq dimensions sont complètes et contresignées (23 instruments), vingt-et-un restent au plan — c'est l'avancement prévu, pas un changement de cadre.

**Un second cadre coexiste et doit être distingué** : le voyage de l'app (11 mondes · 50 quêtes, livrables M1-M11 de l'archive v1) n'est pas le découpage des 26 dimensions/110 quêtes du canon — c'est le parcours individuel de préparation à la rencontre de l'application. Le chantier récent « calculs-quêtes » (M1-1.1 → M1-1.4) porte sur **ce** cadre : même dépôt, même gouvernance, mêmes règles de vérification, autre découpage que le programme de thérapie. Ce n'est pas un changement de projet — mais si l'on cherche dans ce chantier les « 26 dimensions », on ne les trouvera pas telles quelles : elles vivent dans le dossier de validation RIO.

**Deux documents ne portent pas de dimensions** et ne doivent pas être lus comme spécifications : `OUTILS DE TERAPIE DU COUPLE.txt` (veille aspirée, bannière officielle du 18/10 — le DAS cité dedans n'est PAS utilisé) et le `README.md` racine (fiche technique de l'app v2).

---

## 5. Ce qui n'a pas changé (vérifié dans les trois textes de référence)

Les 10 principes fondateurs du canon (Partie 1.2) sont repris à l'identique dans le résumé v2 (Partie 1) et toujours en vigueur dans le hub : honnêteté sans condamnation · ombre ET lumière structurelles · jamais le mot « pathologie » à l'écran · langage simple · descriptif → conséquence → possibilité · jamais l'évaluation du partenaire ni des tiers · filet de sécurité prioritaire (3919/3114) · instruments 100 % originaux · inclusivité (« partenaire 1 / partenaire 2 ») · l'app se retire. Les règles permanentes du hub (D-STD, exécuteur strict, D-CANAL, D-HIST…) prolongent exactement les règles d'orchestrateur fixées par la v2 (Partie 13.4). Aucun de ces points n'a été modifié.

---

## 6. Écarts et points d'attention (consignés exactement, non bloquants, à la décision du fondateur)

- **E1 — La v2 est en retard sur le hub.** La v2/PDF (15/10) se clôt sur « Ta prochaine mission sera le PACKAGE WTC-Q3 « Ce qui me porte » » ; le hub (21/10) montre RIO-01 → RIO-23 tous contresignés, Q3 compris. La v2 reste la référence de CONTENU (Parties 1-12) ; l'état courant fait foi via le hub. Une future v3 de consolidation reste possible, à la décision du fondateur.
- **E2 — Ligne de total du hub à retoucher.** La ligne « Total : 23 instruments RIO contresignés… 3 dimensions principales (Attachement · Émotionnelle · Personnalité) » omet **Santé mentale**, complète elle aussi (RIO-11 → RIO-15, section du même README). Incohérence éditoriale mineure (blame : introduite au commit e46b6a4), retouche à la décision du fondateur.
- **E3 — « ≈ 110 quêtes » vs 116.** La répartition du canon (16×5 + 6×4 + 4×3) donne 116 ; le titre de la Partie 5 annonce « ≈ 110 ». Approximation interne au canon, à noter pour toute future v3.
- **E4 — Nommage des séries du voyage.** Le fichier `quete-1-4.ts` est le livrable **M2-1.4** (Monde 2 « Le Volant ») ; le commit 43077db le titre « M1-1.4 » (numérotation de fichier). Les séries 1.x traversent les mondes — documenté dans `calculs-quêtes/M1-quete-1-4-resultats.md`.
- **E5 — TOTAL_STEPS 51 vs 50 quêtes.** `voyage.ts` conserve TOTAL_STEPS = 51 (consigne fondateur répétée deux fois) pour 50 quêtes livrées — le 51ᵉ pas étant la Rencontre ; le commentaire de réconciliation est déjà dans le fichier.
- **E6 — Deux cadres sans page de réconciliation unique.** Le hub ne mentionne pas le voyage ; `voyage.ts` ne cite pas les 26 dimensions. Le présent document sert de pont, mais une réconciliation documentaire d'ensemble (où vivent les deux cadres, comment ils se recouvrent) reste à la décision du fondateur.
- **E7 — `OUTILS DE TERAPIE DU COUPLE.txt` ne doit pas être cité comme spécification.** Bannière du 18/10 : compilation de veille ; le DAS/EAD mentionné n'est PAS utilisé (audit PI §6 CONFORME). Seuls les packages RIO validés et le hub font foi.

---

## 7. Prochaine quête

**M1-1.5 « L'épreuve du temps »** (Monde 2 « Le Volant », 2/7 — moteur `quete-1-5.ts`) : tâche **comportementale non-Likert**, 6 choix binaires A (immédiat) / B (différé), codes gelés Q1.5-C1 → C6. La méthode reste la même : lecture intégrale des moteurs réels, script de vérification exécutant le vrai moteur, document de résultats exact sans flatterie, push GitHub, quête suivante signalée.
