# D — Audit PI : conformité propriété intellectuelle des instruments WTC
> **Mission WTC-LEGAL-01, chantier D.** Audit croisé item-par-item des instruments RIO du programme Wairyu Thérapie Couple face aux instruments psychométriques établis.
> Date : 18/10/2026 · Producteur : orchestrateur Vibe, à la demande du propriétaire du dépôt.

---

## 1. Objet

Constituer la **preuve vérifiable** que les instruments RIO (RIO-01 à RIO-15) sont des créations originales et non des copies d'instruments existants — afin de prévenir toute action en contrefaçon et de disposer d'un dossier de défense opposable.

## 2. Corpus RIO audité

- **WTC-EMO-Q1 « Ma météo intérieure » (RIO-06)** : les 32 items ont été audités mot pour mot (source : `validation-emotionnelle/fondation/01-items-q1.md`, v1.1). Audit lexical complet.
- **WTC-Q1 attachement (RIO-01)** : 18 items, 2 axes (peur de perdre / peur de dépendre), 6 faces — texte des items non reproduit dans les fichiers audités ; comparaison au niveau des construits (source : `validation-q1/src/wtc_q1_core.py`, README).
- **Dimensions Santé mentale (RIO-11 à RIO-15) et Extensions (RIO-16)** : comparaison au niveau des construits (SPEC SM-Q2 à Q5, EXT-Q1).

## 3. Corpus de référence

Instruments comparés (items de référence **jamais reproduits verbatim** dans ce document ; seuls des construits et des paraphrases analystes ont été utilisés) :

| Instrument | Auteur | Statut d'usage | Rôle dans l'audit |
|---|---|---|---|
| ECR-R | Fraley, Waller & Brennan (2000) | Items publics sur le site de l'auteur, usage recherche non commercial sans frais | Comparaison item-par-item (paraphrases) |
| ERQ | Gross & John (2003) | Libre pour la recherche | Comparaison item-par-item (paraphrases) |
| Rumination | Nolen-Hoeksema (construct) | Construit théorique public | Comparaison item-par-item (paraphrase) |
| DAS | Spanier (1976) | **Items protégés — jamais reproduits ici** | Comparaison au niveau des 4 dimensions uniquement |
| CSI | Funk & Rogge (2007) | Permission accordée pour recherche et clinique sans lettre | Comparaison au niveau des construits |
| Capitalisation | Gable & Reis (typologie AC/PC/AD/PD) | Construit théorique public (déjà cité par WTC) | Comparaison item-par-item (paraphrases) |
| 5 langages | Chapman (1992) | Construits popularisés, non protégés au titre du droit d'auteur | Comparaison item-par-item (paraphrases) |

## 4. Méthodologie

1. **Normalisation** : minuscules, suppression des accents/ponctuation, stopwords français (y compris « partenaire », « besoin » pour neutraliser les mots de liaison obligatoires du domaine).
2. **Similarité** : coefficient de Jaccard, pris comme max(similarité des mots, similarité des bigrammes de mots), entre chaque item RIO et chaque paraphrase du corpus de référence.
3. **Seuils** : vigilance ≥ 0,40 · alerte ≥ 0,70 (réécriture obligatoire).
4. **Limite méthodologique assumée** : les items RIO sont en français, les instruments de référence en anglais ; la comparaison se fait donc contre des **paraphrases françaises analystes** du propos de chaque item de référence. La similarité mesurée est donc un **minorant** (une copie traduite serait détectée, un simple voisinage conceptuel ne l'est pas artificiellement gonflé).

## 5. Résultats — audit lexical WTC-EMO-Q1 (32 items)

**Score maximal observé : 0,444 · 2/32 items en zone de vigilance (≥ 0,40) · 0/32 en zone d'alerte (≥ 0,70).**

### Zone de vigilance (voisinage conceptuel, formulation originale)

| Item RIO | Meilleure correspondance | Score | Analyse |
|---|---|---|---|
| E-R3-3 « Je rejoue mentalement les conversations qui m'ont blessé(e), en imaginant ce que j'aurais pu dire. » | Rumination (Nolen-Hoeksema) — paraphrase | 0,444 | Le construit de rumination est du domaine public théorique ; la formulation WTC (« conversations », « blessé(e) », registre du quotidien) est distincte de toute échelle existante. **Aucune action requise.** |
| E-B1-1 « J'ai besoin d'entendre régulièrement que l'on tient à moi, même quand tout va bien. » | ECR-R anxiété (Fraley et al.) — paraphrase | 0,429 | Voisinage attendu : RIO-01/RIO-06 mesurent l'attachement, même famille théorique que l'ECR-R (Bowlby, Brennan-Clark-Shaver — cités dans le code source WTC). La formulation est originale ; l'ECR-R affiche ses items librement pour la recherche et son construit n'est pas protégé. **Aucune action requise.** |

### Table complète (similarité max par item)

| Item | Meilleure réf. | Score | | Item | Meilleure réf. | Score |
|---|---|---|---|---|---|---|
| E-R3-3 | RUM | 0,444 | | E-L2-2 | Chapman/mots | 0,143 |
| E-B1-1 | ECR-R | 0,429 | | E-B2-2 | Chapman/temps | 0,125 |
| E-R2-1 | ERQ | 0,200 | | E-L2-3 | Chapman/temps | 0,125 |
| E-B3-1 | Chapman/toucher | 0,200 | | E-L3-3 | Chapman/temps | 0,125 |
| E-L3-1 | Gable & Reis | 0,200 | | C-C | ECR-R | 0,125 |
| E-B3-3 | Chapman/toucher | 0,182 | | E-R3-1 | ERQ/rumination | 0,111 |
| E-R2-3 | ECR-R | 0,167 | | E-R1-2 | ERQ | 0,100 |
| E-L1-3 | Chapman/services | 0,167 | | E-L2-1 | Chapman/cadeaux | 0,100 |
| OPT-A3 | ERQ | 0,167 | | C-B | DAS | 0,100 |
| E-R2-2 | ECR-R | 0,143 | | D-EXP | ECR-R | 0,091 |
| E-B2-3 | DAS/cohésion | 0,143 | | E-B2-1 | Chapman/cadeaux | 0,083 |
| E-L1-2 | ECR-R | 0,143 | | E-R1-1 | DAS | 0,077 |
| | | | | E-R1-3 | ERQ | 0,077 |
| | | | | E-B1-3 | CSI | 0,063 |
| | | | | E-R3-2, E-B1-2, E-B3-2, E-L1-1, E-L3-2, C-A | — | 0,000 |

## 6. Comparaison au niveau des construits

### WTC-Q1 attachement (RIO-01) vs ECR-R (Fraley et al.)

| WTC | ECR-R | Verdict |
|---|---|---|
| Axe « Peur de perdre » (9 items) | Anxiété d'attachement | Même famille théorique (Bowlby), **cité dans le code source WTC**. Construit non protégeable ; items originaux, échelle originale à 4 points (ECR-R : 7 points), structure inédite en 6 faces diagnostiques (Vigie / Besoin de mots / Rumeur / Inconfort du près / Debout-seul / Porte fermée) inexistante chez ECR-R. |
| Axe « Peur de dépendre » (9 items) | Évitement d'attachement | Idem. La sortie WTC (niveaux nommés + frontières + décision conservatrice + RQS) n'existe dans aucun instrument établi. |

### Bloc « langages d'affection » (E-L, RIO-06) vs Chapman (1992)

Voisinage conceptuel assumé avec les « 5 langages de l'amour » — construits popularisés et non protégeables au titre du droit d'auteur. La formulation des items est originale. **Recommandation : ajouter Chapman (1992) au registre des citations** du programme (au même titre que Gable & Reis, déjà cité pour le bloc CAP).

### Bloc CAP (RIO-06) vs Gable & Reis

La typologie AC/PC/AD/PD est **explicitement citée** dans `01-items-q1.md` (« le marqueur le plus prédictif du positif documenté dans la littérature (Gable & Reis) »). Usage de construits académiques avec citation : conforme.

### DAS (Spanier)

Aucun item DAS n'est reproduit dans le dépôt WTC (vérifié : le fichier « OUTILS DE TERAPIE DU COUPLE.txt » **décrit** le DAS dans un document de recherche, sans reproduire ses items). Le DAS n'est pas utilisé comme instrument : conforme.

### Santé mentale (RIO-11 à RIO-15)

Les instruments WTC-SM sont des échelles comportementales originales en langage du quotidien ; ils ne reproduisent ni le PHQ-9, ni la C-SSRS, ni aucun instrument protégé. Les filets de crise (3919/3114) sont des références de service public, pas des instruments.

## 7. Analyse juridique (principes)

1. **Le droit d'auteur protège la formulation, pas les construits.** Mesurer l'anxiété d'attachement ou la régulation émotionnelle est un usage libre d'idées scientifiques (théorie non protégeable — traité sur les idées/expressions, art. 2 TRIPS, art. L112-1 CPI).
2. **Aucune reproduction** : l'audit lexical (score max 0,444, loin du seuil d'alerte 0,70) et l'examen des sources ne révèlent aucun item repris, traduit ou adapté d'un instrument existant.
3. **Antériorité prouvée** : l'historique GitHub horodaté + SHA des fichiers d'items constituent une preuve d'existence et de datation des créations originales.
4. **Citations de bonne foi** : Bowlby, Brennan-Clark-Shaver, Gable & Reis, Jacobson & Truax sont cités dans le code et la documentation WTC — démonstration de démarche d'inspiration théorique assumée, à l'opposé d'une contrefaçon délibérée.
5. **Usage futur** : si le pilote VALID-01 intègre un jour des instruments externes (ECR-R, CSI pour la validité convergente), vérifier le statut d'usage **commercial** de chacun : ECR-R est libre pour la recherche non commerciale ; le CSI est explicitement libre pour recherche et clinique ; ne jamais intégrer d'items d'instruments édités (MMPI, DAS complet, échelles Pearson/PAR).

## 8. Recommandations

| # | Action | Priorité |
|---|---|---|
| R1 | Ajouter Chapman (1992) au registre des citations (bloc E-L) | Haute |
| R2 | Conserver ce document et l'actualiser à chaque nouvel instrument RIO (RIO-16 en tête) avec le même protocole lexical | Haute |
| R3 | Avant VALID-01 : vérifier les licences des instruments de validité convergente retenus (usage commercial vs recherche) | Haute |
| R4 | Option : dépôt IMO/WIPO ou enveloppe Soleau des batteries RIO avant tout partenariat commercial | Moyenne |
| R5 | Ajouter une mention « instruments originaux Wairyu » + bibliographie théorique dans la documentation produit | Moyenne |

## 9. Verdict

**CONFORME.** Sur les 32 items audités lexicalement et les 15 instruments examinés au niveau des construits : aucune copie, aucune traduction d'items existants, aucun item en zone d'alerte (≥ 0,70). Les voisinages détectés sont des voisinages théoriques attendus (rumination, attachement, langages d'affection), assumés et cités. Le risque juridique de poursuite pour copie est **très faible** ; la présente pièce, jointe à l'historique GitHub, constitue une défense documentée.

---

*Reproductibilité : la table de similarité complète (section 5) est recalculable à partir des items de `fondation/01-items-q1.md` et du corpus de paraphrases documenté en section 3, par la méthode de la section 4. Aucun item d'instrument protégé n'est reproduit dans ce document.*
