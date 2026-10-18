# AUDIT PONT — Mission WTC-LEGAL-01, chantier D (audit PI)

> **Audit du pont** du document `legal/D-audit-pi.md` (commit `cf0c583`, publié 18/10/2026).
> Producteur : superviseur/pont, à l'ordre du fondateur (« audit pont complet de la mission LEGAL- »), 18/10/2026.
> Le document audité reste **immuable** (D-EMPREINTE) : le présent rapport est un document séparé, aucune section du rapport publié n'est modifiée.

---

## 1. Objet et périmètre de l'audit pont

La mission WTC-LEGAL-01 chantier D a produit, sous la responsabilité de l'orchestrateur, un audit de propriété intellectuelle des instruments RIO face aux instruments psychométriques établis : audit lexical item-par-item sur les 32 items de WTC-EMO-Q1 (RIO-06, source `validation-emotionnelle/fondation/01-items-q1.md` v1.1), comparaison au niveau des construits pour RIO-01 (attachement vs ECR-R), le bloc E-L vs Chapman, le bloc CAP vs Gable & Reis, le DAS, la santé mentale (RIO-11 à RIO-15) et RIO-16 (Générationnelle). Verdict publié : **CONFORME** (score max 0,444, 0/32 en zone d'alerte ≥ 0,70, 2/32 en vigilance ≥ 0,40).

L'audit pont **ne re-fait pas** le calcul lexical : le protocole du document (§4) repose sur un corpus de paraphrases analystes qui n'est pas un artefact du dépôt (alerte A4 ci-dessous) — le pont ne peut ni le reproduire ni l'inventer (D-CANAL-2). Ce que l'audit pont fait, et qui est à sa portée : vérifier **la chaîne documentaire** — que le corpus audité existe réellement dans le dépôt, que la table de résultats du document est cohérente avec ses propres affirmations, que les citations de bonne foi alléguées sont présentes dans le code, que le verdict est soutenu par les données internes, et que les recommandations du document ont bien un chemin d'exécution.

## 2. Méthode (D-LECTURE)

Script `audit_legal01.py` (persisté hors dépôt), 17 vérifications booléennes F1-F17 exécutées in-sandbox sur l'arbre `7f8253f` (origin/main, auditée bit-identique) : extraction regex des codes d'items, comparaison croisée document ↔ `01-items-q1.md`, parsing de la table §5, recherche de citations dans les `src/*.py`, contrôle d'existence des SPEC citées. Aucune lecture affichée sensible ; aucune modification du document audité.

## 3. Résultats — 17/17 vérifications TRUE

| # | Vérification | Valeur | Constat |
|---|---|---|---|
| F1 | Source des items existe | ✅ | `01-items-q1.md` présent (fondation, v1.1) |
| F2 | 32 codes uniques extraits du doc PI | ✅ | E-R/E-B/E-L (27) + C-A/B/C + D-EXP + OPT-A3 |
| F3 | Chaque code PI présent dans la source | ✅ | 32/32 — le corpus audité est le corpus réel |
| F4 | La source contient ≥ 32 items déclarés | ✅ | 35 marqueurs `**[code]**` (32 items + doublons d'appel) |
| F5 | Score max de la table §5 = 0,444 | ✅ | cohérent avec le résumé §5 et le verdict §9 |
| F6 | 2 items ≥ 0,40, 0 item ≥ 0,70 | ✅ | E-R3-3 (0,444) et E-B1-1 (0,429) — les seuls |
| F7 | Bowlby/Brennan cités dans le code attachement | ✅ | `validation-q1/src` |
| F8 | Gable & Reis cités dans le code émotionnel | ✅ | emo-Q3/Q4 (marqueur capitalisation) |
| F9 | Carstensen + Jacobson & Truax cités dans EXT | ✅ | `validation-ext-q1/src` (axe H, L7) |
| F10 | Chapman absent des instruments | ✅ | occurrences limitées au canon (contre-indication, ligne 353) et au doc PI |
| F11 | R1 non exécutée : pas de « registre des citations » | ✅ | aucun artefact dans `legal/` — **action ouverte** |
| F12 | DAS décrit sans items verbatim | ✅ | EAD 32 items / Spanier décrits, aucune liste d'items |
| F13 | Tension ligne 263 OUTILS (« l'application intègre l'EAD ») | ⚠️ | alerte A2 |
| F14 | SPECs citées comme corpus « construits » présentes | ✅ | SM-Q2 à Q5, EXT-Q1 |
| F15 | Écart de périmètre annoncé vs couvert | ⚠️ | alerte A3 |
| F16 | Corpus de paraphrases non joint | ⚠️ | alerte A4 |
| F17 | RIO-16 non audité lexicalement (construits seuls) | ⚠️ | alerte A5 — suivi R2 |

## 4. Verdict sur la mission

**MISSION SOUTENUE — verdict CONFORME soutenu par ses données internes et par le dépôt.** La chaîne documentaire tient : le corpus audité existe mot pour mot (F1-F4), la table de résultats est arithmétiquement cohérente avec le verdict publié (F5-F6), les citations de bonne foi alléguées (§7.4 du document) sont vérifiables dans le code des packages (F7-F9), le DAS est décrit sans reproduction d'items (F12), et les SPEC citées comme corpus « niveau construits » existent toutes (F14). Le pont souligne ce que le document fait correctement : la limite inter-langue est assumée comme minorant (§4.4), les items de référence ne sont jamais reproduits (§3), et les deux voisinages de vigilance sont analysés et classés sans action requise avec justification (§5).

## 5. Alertes documentées par le pont (sans blocage)

- **A1 — R1 ouverte : le « registre des citations » n'existe pas comme artefact.** La recommandation R1 du document (haute priorité : « ajouter Chapman (1992) au registre des citations ») n'est pas exécutable telle quelle : aucun registre de citations n'est déposé (F11). Tant que le registre n'existe pas, R1 n'a pas de lieu d'atterrissage et l'audit de la prochaine mission ne pourra pas vérifier son exécution.
- **A2 — Tension documentaire ligne 263 d'OUTILS.** Le document de veille `OUTILS DE TERAPIE DU COUPLE.txt` déclare : « L'application intègre l'Échelle d'Ajustement Dyadique (EAD), un outil de 32 items » avec sa version abrégée RDAS. L'audit PI répond « le DAS n'est pas utilisé comme instrument » — exact pour tous les packages RIO contresignés (aucun ne cite le DAS comme instrument) — mais la phrase d'intégration reste dans le dépôt. Ce fichier est une compilation de recherche aspirée (le même fichier contient des fragments de dialogue et de pages web), pas une spécification produit ; rien ne le scelle comme tel. Risque : un tiers lit la ligne 263 comme une déclaration d'implémentation et la retourne contre la pièce de défense.
- **A3 — Écart de nomenclature de périmètre.** §1 annonce « RIO-01 à RIO-15 » et §9 conclut sur « les 15 instruments », tandis que §2 inclut RIO-16 (construits) — publié le jour même où RIO-16 était contresigné. La couverture réelle est donc 16/16 RIO (un seul audité item-par-item : RIO-06), mais les énoncés de périmètre du document ne le disent pas uniformément (D-NOMENCLATURE).
- **A4 — Recalculabilité conditionnelle.** La note de reproductibilité du document promet une table « recalculable à partir des items de fondation/01-items-q1.md et du corpus de paraphrases documenté en section 3 » : or la section 3 documente les INSTRUMENTS de référence, pas les PARAPHRASES françaises analystes effectivement comparées (F16). Sans ce corpus ni le script de calcul, un tiers ne peut pas rejouer le protocole ; l'audit pont lui-même ne l'a pas fait (§1). La recalculabilité annoncée n'est donc pas encore opposable.
- **A5 — RIO-16 hors protocole lexical.** RIO-16 est couvert « au niveau des construits » seulement ; ses 18 items (core `wtc_ext_q1_core.py`) n'ont pas subi le protocole Jaccard. La recommandation R2 du document le prévoit (« actualiser à chaque nouvel instrument RIO (RIO-16 en tête) ») — l'audit pont confirme le point de départ : elle est encore à exécuter, et devra l'être aussi pour RIO-17 et RIO-18.

## 6. Recommandations du pont

| # | Action | Ancrage |
|---|---|---|
| P1 | Créer le **registre des citations** (`legal/registre-citations.md`) et y entrer Chapman (1992) — exécute R1 du document | A1 · R1 |
| P2 | Sceller le statut du document de veille : bannière d'en-tête « document de recherche aspiré, pas une spécification produit ; aucune déclaration d'intégration n'y vaut décision » — neutralise la ligne 263 sans la réécrire | A2 |
| P3 | À la prochaine révision du document PI (erratum), harmoniser le périmètre : « RIO-01 à RIO-16, dont un seul audité item-par-item (RIO-06) » | A3 · D-NOMENCLATURE |
| P4 | Déposer le corpus de paraphrases + le script de calcul Jaccard dans `legal/` pour rendre la recalculabilité réelle (les paraphrases analystes ne sont pas des items protégés — elles peuvent être publiées) | A4 |
| P5 | Exécuter R2 : protocole lexical sur les 18 items RIO-16, puis à chaque nouvel instrument (RIO-17, RIO-18) | A5 · R2 |
| P6 | Rappeler R3 avant VALID-01 : vérifier les licences d'usage **commercial** des instruments de validité convergente, DAS/RDAS inclus explicitement si jamais envisagé (items édités — jamais intégrer) | R3 |

**Portée du pont** : le pont signale et recommande, il ne corrige pas (exécuteur strict, hub) — P1 à P6 relèvent de l'orchestrateur ou d'un ordre fondateur explicite.
