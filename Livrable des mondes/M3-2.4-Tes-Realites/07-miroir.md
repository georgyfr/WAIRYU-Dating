# LIVRABLE 7 — MIROIR DE QUÊTE (ÉTAGE 2) — QUÊTE 2.4 « TES RÉALITÉS »

> **Brique paramétrée — standard v2** · Miroir LÉGER (format un-clic, non-Likert) → **80-150 mots/variante** (Constitution [7]).
> 1 brique (les réalités croisées) × 2 variantes de texture : A « par l'exemple » · B « par le mécanisme ».
> Structure de chaque variante : **TA LUMIÈRE** · **→ TON OMBRE (en couple)** · **→ TA TENSION** · **→ LE MINI-RES**.
> **Écran de conformité permanent** : les réalités sont des FAITS, jamais jugés moralement — aucun texte ne hiérarchise les vies (note du registre 03).

## 0 — Champ de saillance

Quête à brique unique : les 8 déclarations (un-clic) produisent **une** brique. La seule chose mesurée est la cohérence des déclarations, jamais la valeur de la personne.

## 1 — La brique (MR-24-REA-A · MR-24-REA-B)

### MR-24-REA-A — variante A « par l'exemple »

**TA LUMIÈRE**
Tu as posé tes faits : ta ville, ton tempo, ce qui est vrai aujourd'hui. Tes faits protègent ton temps — la personne qui te contacte sait dans quelle vie elle arrive.

**→ TON OMBRE (en couple)**
Des faits posés sans nuance finissent par parler trop fort. Exemple : trois réponses tranchées un soir de rangement, et ton profil ne laisse plus de place au « ça dépend ». La recherche documente qu'un tri sans zone grise rétrécit vite. Des rencontres s'annulent sur un détail qui n'aurait jamais pesé. Le coût pour toi : un fil qui coupe des fils utiles. Le coût pour l'autre : être lu comme une combinaison de cases, pas comme quelqu'un.

**→ TA TENSION**
Tes faits t'ouvrent les bonnes portes — et les mêmes faits, posés trop fermes, ferment les autres.

**→ LE MINI-RES**
- Lumière : tes déclarations honnêtes réduisent le bruit.
- Ombre : trop de tranches, et plus personne n'entre entier.
- Mode d'emploi : mets à jour tes réponses dès que ta vie bouge.

### MR-24-REA-B — variante B « par le mécanisme »

**TA LUMIÈRE**
Le mécanisme d'abord : chaque réalité déclarée croise les lignes rouges de tout le monde. Le croisement travaille avant toi, sans relance — un départ sur du clair, pas du deviné.

**→ TON OMBRE (en couple)**
Exemple : une réponse posée il y a six mois croise encore, alors que ta vie a bougé. Un profil qui t'aurait plu s'élimine sur cette case. Un profil sans zone grise filtre trop : la nuance est une force. Ça conduit fréquemment à un tri plus ancien que toi. Le coût pour toi : un monde qui rétrécit en silence. Le coût pour l'autre : s'effacer du pool sur une déclaration qui ne te décrit plus.

**→ TA TENSION**
Déclarer vrai t'aligne — et te fige un peu plus à chaque clic que tu ne revois pas.

**→ LE MINI-RES**
- Lumière : le croisement travaille pour toi dès le départ.
- Ombre : une déclaration vieille reste une déclaration fausse.
- Mode d'emploi : une réalité a changé ? Change la case le jour même.

## 2 — Gabarit paramétré (assemblage moteur)

**GAB-MR-24-BLOC** :
- `texture_seed` → variante A ou B · `date_maj` → fraîcheur des déclarations (moteur).
- Branche **tension des réalités** (SIG-2.4-03, si détectée) → ligne descriptive ajoutée : « Deux de tes réalités demandent souvent des arbitrages — le nomadisme et le tempo. La recherche documente que cette combinaison se règle, mais elle se règle en conscience. » Descriptif, jamais accusateur, jamais chiffré.
- `citation_items` → rappel en toutes lettres des déclarations concernées — JAMAIS les codes.

## 3 — Table d'ancrage (affirmation → items → vérification)

| Brique (ID moteur) | Affirmation rendue | Items (champ moteur) | Vérification |
|---|---|---|---|
| MR-24-REA-A/B | « tes faits protègent ton temps » · « la case à mettre à jour » | Q2.4-01 → Q2.4-08 | La citation d'une déclaration résout verbatim l'option choisie (04-slots) ; aucun code rendu |
| Branche tension | « ces deux réalités demandent des arbitrages » | Q2.4-07 × Q2.4-08 | SIG-2.4-03 : descriptif, registre fréquentiel, jamais chiffré |

## 4 — Signatures intégrées (registre 03 — aucune inventée)

| Signature | Intégration au miroir |
|---|---|
| **SIG-2.4-01 — Le croisement qui élimine** | Aucun texte — hard constraint côté moteur, sans trace rendue chez l'un ni chez l'autre. La brique §1 documente l'usage des déclarations, jamais leur action en cours. |
| **SIG-2.4-02 — Le profil qui se contredit** | Aucun texte — drapeau QFI moteur seul ; module la prudence du rendu, jamais exposé comme accusation. |
| **SIG-2.4-03 — La tension des réalités** | Branche du GAB-MR-24-BLOC : descriptif, registre fréquentiel (« ces deux réalités demandent souvent des arbitrages »), jamais accusateur, jamais chiffré. |

## 5 — Contrôles avant livraison (affichés)

| Contrôle | Résultat |
|---|---|
| Ombre ≥ lumière par variante | ✅ 2/2 |
| Conséquence probabiliste | ✅ |
| Coût double nommé | ✅ 2/2 |
| Rappels en toutes lettres (jamais un code) | ✅ |
| Zéro hiérarchie de vies (ni fumeur, ni nomade, ni « zéro sport » jugés) | ✅ |
| Zéro interdit lexical | ✅ |
| Ouvertures non identiques entre variantes | ✅ |

## TABLE DE FICHIERS (format P1)

═══ FICHIER : Livrable des mondes/M3-2.4-Tes-Realites/07-miroir.md ═══
(écrit directement sur disque — accès FS ; la présente table consigne la livraison)
═══ FIN FICHIER ═══

> Fichiers touchés par la présente livraison : **un seul** — `07-miroir.md` (créé). Aucun fichier 01-06 modifié, aucune signature inventée.
