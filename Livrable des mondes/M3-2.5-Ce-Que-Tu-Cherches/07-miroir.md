# LIVRABLE 7 — MIROIR DE QUÊTE (ÉTAGE 2) — QUÊTE 2.5 « CE QUE TU CHERCHES »

> **Brique paramétrée — standard v2** · Miroir LÉGER (format binaire + 4ᵉ réponse globale) → **80-150 mots/variante** (Constitution [7]).
> 1 brique (l'intention) × 2 variantes de texture : A « par l'exemple » · B « par le mécanisme ».
> La **4ᵉ réponse « Je découvre »** et le **message doux** (état « Non / Non / Non ») sont intégrés au gabarit (décision comité, FM-019).
> Structure de chaque variante : **TA LUMIÈRE** · **→ TON OMBRE (en couple)** · **→ TA TENSION** · **→ LE MINI-RES**.

## 0 — Champ de saillance

Quête à brique unique : les 3 binaires + la 4ᵉ réponse produisent **une** brique, avec ses branches de rendu (voir gabarit §2 : exclusivité posée / découverte / non-exclusivité assumée / en exploration / intention à clarifier).

## 1 — La brique (MR-25-INT-A · MR-25-INT-B)

### MR-25-INT-A — variante A « par l'exemple »

**TA LUMIÈRE**
Tu as répondu trois fois : ton cap est posé. La personne qui te lit sait où tu en es. Un cap clair filtre pour toi — ce qui ne colle pas s'écarte gentiment.

**→ TON OMBRE (en couple)**
Un cap posé engage aussi le jour où il bouge. Exemple : une intention écrite il y a quelques mois, une vie qui a tourné. Une personne avance encore sur ta carte d'hier. Ça conduit fréquemment à des malentendus plus chers que la mise à jour. Le coût pour toi : des rencontres alignées sur un cap que tu ne tiens plus. Le coût pour l'autre : investir sur une intention dépassée.

**→ TA TENSION**
Poser ton cap t'aligne — le renommer, le jour où il tourne, demande du courage.

**→ LE MINI-RES**
- Lumière : ton cap clair épargne du temps à tous les deux.
- Ombre : une carte périmée mène au mauvais port.
- Mode d'emploi : intention changée, renommée le jour même — un clic, pas une confession.

### MR-25-INT-B — variante B « par le mécanisme »

**TA LUMIÈRE**
Le mécanisme d'abord : tes trois réponses forment une intention affichée, lisible par tous. Cette intention croise celle de tout le monde, dans les deux sens, avant même un premier message. Garantie : un départ sans décodeur — personne ne négocie dans le flou.

**→ TON OMBRE (en couple)**
La machine lit ta dernière déclaration — pas ton évolution. Exemple : un profil qui te correspond avance sur une intention pas relue depuis des mois. Ça conduit fréquemment à des attentes calées sur une version passée de toi. Le coût pour toi : réparer plus tard ce qu'un clic aurait ajusté. Le coût pour l'autre : s'engager dans un projet que tu ne portes plus.

**→ TA TENSION**
Ton intention affichée te fait rencontrer les bonnes personnes — tant qu'elle dit encore la vérité du jour.

**→ LE MINI-RES**
- Lumière : l'intention affichée aligne avant de faire parler.
- Ombre : une intention morte affiche encore.
- Mode d'emploi : ta réponse se modifie quand tu veux — la relire fait partie de la recherche.

## 2 — Gabarit paramétré (assemblage moteur)

**GAB-MR-25-BLOC** :
- `texture_seed` → variante A ou B · `intention` → degré de rendu (moteur, SIG-2.5-01) :
  - **exclusivité posée** → rappel : « quand tu as répondu que tu cherches une relation exclusive »
  - **non-exclusivité assumée** → rappel : « quand tu as dit que l'exclusivité n'est pas ce que tu vises aujourd'hui »
  - **découverte** → rappel : « quand tu as répondu que tu cherches une rencontre, sans plan précis »
  - **en exploration** (4ᵉ réponse « Je découvre ») → rappel : « quand tu as répondu que tu découvres ce que tu cherches » — état déclaré, compatible avec tout : aucun dealbreaker, aucun drapeau, jamais bloqué (décision comité).
- Branche **intention à clarifier** (état « Non / Non / Non » — **message doux**, décision comité) : « Aujourd'hui, aucune intention lisible chez toi — c'est incomplet, pas fautif. La recherche, ça s'affine : la réponse « Je découvre » reste ouverte, et ta boussole bougera quand elle bougera. » Aucune relance, aucune insinuation de défaut.
- `citation_items` → rappels en toutes lettres — JAMAIS les codes.

## 3 — Table d'ancrage (affirmation → items → vérification)

| Brique (ID moteur) | Affirmation rendue | Items (champ moteur) | Vérification |
|---|---|---|---|
| MR-25-INT-A/B | « ton cap est posé » · « l'intention affichée » | Q2.5-01 · Q2.5-02 · Q2.5-03 (+ 4ᵉ réponse globale) | Le rappel reprend les mots mêmes de la réponse (04-slots) ; aucun code rendu |
| Branche message doux | « aucune intention lisible aujourd'hui » | Q2.5-01/02/03 tous « Non » | SIG-2.5-01 : accueilli sans jugement ; la 4ᵉ réponse est l'issue déclarée |

## 4 — Signatures intégrées (registre 03 — aucune inventée)

| Signature | Intégration au miroir |
|---|---|
| **SIG-2.5-01 — L'intention affichée** | Gabarit GAB-MR-25-BLOC : l'intention est rendue dans les mots mêmes de la réponse, datée (« aujourd'hui »), jamais figée en trait permanent. |
| **SIG-2.5-02 — La contradiction interne** | Aucun texte accusateur — le miroir se dégrade d'un degré côté moteur (reformulé avec prudence) ; jamais de juxtaposition des deux réponses en reproche. |
| **SIG-2.5-03 — Le décalage affiché × vécu** | Aucun texte — détection de tromperie MOTEUR SEUL, en attente d'activation (pré-requis : 6.1). Zéro trace UI. |

## 5 — Contrôles avant livraison (affichés)

| Contrôle | Résultat |
|---|---|
| Ombre ≥ lumière par variante | ✅ 2/2 |
| Conséquence probabiliste | ✅ |
| Coût double nommé | ✅ 2/2 |
| 4ᵉ réponse « Je découvre » incluse (compatible avec tout) | ✅ (gabarit §2) |
| Message doux si 3 « non » inclus (aucune relance, aucune insinuation) | ✅ (gabarit §2) |
| Rappels en toutes lettres (jamais un code) | ✅ |
| Zéro interdit lexical | ✅ |
| Ouvertures non identiques entre variantes | ✅ |

## TABLE DE FICHIERS (format P1)

═══ FICHIER : Livrable des mondes/M3-2.5-Ce-Que-Tu-Cherches/07-miroir.md ═══
(écrit directement sur disque — accès FS ; la présente table consigne la livraison)
═══ FIN FICHIER ═══

> Fichiers touchés par la présente livraison : **un seul** — `07-miroir.md` (créé). Aucun fichier 01-06 modifié, aucune signature inventée.
