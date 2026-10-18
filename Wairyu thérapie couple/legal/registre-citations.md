# Registre des citations — programme Wairyu Thérapie Couple

> **Créé le 18/10/2026, exécution P1 de l'audit pont WTC-LEGAL-01** (recommandation P1 du
> document `D-audit-pi-audit-pont.md`, exécutant la recommandation R1 du document PI).
> Rôle : lieu d'atterrissage unique des citations d'instruments et de construits — chaque
> entrée porte la référence, le lieu d'usage dans le dépôt, le statut d'usage et la
> vérification. L'audit de la prochaine mission pourra vérifier l'exécution des
> recommandations contre ce registre (alerte A1 levée par la présente création).
> **Ajout R1** : Chapman (1992) — entré au registre ci-dessous (marqué **[R1 · P1]**).

---

## 1. Instruments et construits cités dans le CODE des packages (vérifiés)

| Référence | Construit / instrument | Lieu d'usage dans le dépôt | Statut d'usage | Vérifié par |
|---|---|---|---|---|
| Bowlby | Théorie de l'attachement (construit public) | `validation-q1/src` (code attachement) | Construit théorique public — citation de bonne foi | Audit pont F7 |
| Brennan, Clark & Shaver | Attachement adulte (construit) | `validation-q1/src` | Construit public | Audit pont F7 |
| Fraley, Waller & Brennan (2000) | ECR-R — échelle de référence | Doc PI §3 (jamais d'items reproduits ; paraphrases analystes) | Items publics site de l'auteur, usage recherche **non commercial** sans frais | Doc PI §3 · audit pont F3 |
| Gross & John (2003) | ERQ — régulation émotionnelle | Doc PI §3 | Libre pour la recherche | Doc PI §3 |
| Nolen-Hoeksema | Rumination (construit) | Doc PI §3 | Construit théorique public | Doc PI §3 |
| Spanier (1976) | DAS / EAD | Doc PI §3, §6 | **Items protégés — jamais reproduits** ; le DAS n'est PAS utilisé comme instrument | Audit pont F12 |
| Funk & Rogge (2007) | CSI | Doc PI §3 | Permission recherche et clinique sans lettre | Doc PI §3 |
| Gable & Reis | Capitalisation (typologie AC/PC/AD/PD) | `01-items-q1.md` (citée verbatim) · `validation-emotionnelle` bloc CAP · code émotionnel | Construits académiques avec citation — conforme | Audit pont F8 |
| **Chapman (1992)** | **Les 5 langages de l'amour — bloc E-L (RIO-06)** | **Registre (présente entrée) · voisinage documenté Doc PI §6** | **Construits popularisés, non protégés au titre du droit d'auteur ; les MATÉRIAUX Chapman restent en contre-indication absolue de clonage (canon, lignes 352-354)** | **[R1 · P1]** ajout 18/10/2026 |
| Carstensen | Sélectivité socio-émotionnelle (construit) | `validation-ext-q1/src` (axe H, RIO-16) | Construit public cité ; la référence académique n'est pas dans le dépôt (aveu E-SM-7) | Audit pont F9 |
| Jacobson & Truax | RCI ( Reliable Change Index) | Canon ligne 263 · `validation-ext-q1/src` (L7) | Méthode publiée, usage académique standard | Audit pont F9 |

## 2. Construits cités par le canon (Partie 2 — source documentaire, hors code)

Le canon (`programme wairyu couple.txt`) cite les auteurs des 26 dimensions
(Gottman — 4 cavaliers, démarrage dur, ratio 5:1 · Coyne · Zarit — aidant ·
Sager · Eidelson & Epstein · Knee · Klontz · Pahl · Nagy · Bourdieu · Sprecher ·
Miller · Glass · Freyd · Haidt · Stark · Schwartz · Carstensen). Ces citations
appartiennent au document de conception ; elles ne constituent pas des usages
d'instruments dans le code. Le présent registre les recense sans double
documentation : la source fait foi.

## 3. Règles du registre

1. **Toute citation d'instrument établi dans un package RIO** doit avoir une entrée
   dans la section 1 (référence, lieu, statut, vérification).
2. **Aucun item d'instrument protégé** n'est jamais reproduit dans le dépôt
   (DAS, MMPI, échelles Pearson/PAR — Doc PI §7.5) ; les contre-indications
   canon (lignes 352-354 : ECR, YSQ, DAS, KMSI, Willcox, Duluth graphique,
   Chapman-matériaux, Gottman-matériaux, EFT/Hold Me Tight, CTS2, MBI) tiennent
   lieu de liste noire de clonage.
3. **Chaque nouvel instrument RIO** reçoit sa vérification d'originalité (R2 · P5)
   et, le cas échéant, ses nouvelles citations ici — avant publication du package.
4. Le registre est tenu par le pont ; toute entrée est datée et tracée par commit.
