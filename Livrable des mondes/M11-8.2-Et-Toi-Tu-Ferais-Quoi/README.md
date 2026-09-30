# QUÊTE 8.2 « ET TOI, TU FERAIS QUOI ? » — LIVRABLES DE PRODUCTION

> **Monde** : M11 — LE VOYAGE À DEUX 🆓 **GRATUIT** (la rencontre n'est jamais payante — Constitution [6])
> · **Phase** : P2 · **Accès** : premier match · **Mode** : à deux (missions partagées, révélation mutuelle consentie)
> **Items** : 6 dilemmes à choix forcé (2 options) + justification courte libre · Codes gelés **Q8.2-01 → Q8.2-06** ·
> Ordre fixe · Graine sans-objet (aucune course).
> **La carte des dilemmes** : 6 angles distincts de la vie à deux — promesse vs opportunité · honnêteté vs
> tendresse · argent partagé · temps donné vs temps promis · loyauté vs tolérance · confort vs risque ensemble.
> **AUCUNE bonne réponse** : les deux options de chaque dilemme sont défendables — le choix + la justification
> courte racontent comment la personne arbitre, pas si elle a « bien » répondu.
> **Ce que ça mesure** : les valeurs **RÉVÉLÉES** (en situation) vs les valeurs **DÉCLARÉES** (quête 2.1
> « Tes valeurs ») → l'écart lui-même est une donnée → **ECD** (écart valeurs déclarées / révélées) —
> facteur de confiance du profil. **MOTEUR SEUL** : l'écart ne se rend jamais.
> **Jouée à deux** : les deux membres répondent ; la révélation mutuelle (choix + justification) n'arrive
> qu'après la double réponse — consentie par construction.
> **La divergence de gabarit** : UN SEUL slot de rendu — la carte unique « Tes principes ET ton pragmatisme »
> (2 variantes non-jugeantes), PAS de profils de miroir (00-README).
> ⛔ **DOCTRINE ANTI-HYPOCRISIE (le ton, jamais le mot)** : l'écart est humain et commun — le système
> assume que tout le monde en a un ; la carte ne dit jamais « tu te contredis », elle dit « tu vis tes
> principes ET ton pragmatisme, et ce n'est pas contradictoire ».

## 📁 Contenu du livrable

| Fichier | Livrable |
|---|---|
| `00-README.md` | Fiche de cadrage : divergence de gabarit (quête à deux, carte unique), doctrine anti-hypocrisie (le ton), verrous |
| `01-tableau-des-items.md` | Les 6 dilemmes (situation ≤ 30 mots, 2 options ≤ 12 mots, justification courte) + usage moteur ECD |
| `02-plan-de-melange-graine-sans-objet.md` | Ordre fixe documenté — scénarios fixes, graine sans-objet, zéro course |
| `03-signatures-registre.md` | **SIG-8.2-01 « ECD »** (moteur seul — facteur de confiance) + note de cadrage « 1.1 vs dilemmes » |
| `04-slots-de-miroir.md` | UN SEUL slot : la carte unique « Tes principes ET ton pragmatisme » (07 + cartes.yaml) — pas de profils multiples |
| `05-ecran-d-intro.md` | L'écran d'entrée (2 phrases) : dilemmes rapides joués à deux, pas de bonne réponse, révélation mutuelle |
| `06-fiche-computation-8.2.yaml` | Fiche de computation de la quête (gratuit · P2 · premier match · à deux · ECD moteur seul) |
| `07-miroir.md` | LA CARTE UNIQUE — les 2 variantes rendues (écart faible / écart fort), toutes deux non-jugeantes |
| `cartes.yaml` | Les 2 variantes en YAML (ancre_item = codes Q8.2) — sélection par écart, seuils provisoires comité |
| `README.md` | Le présent fichier |

## ✅ Déclaration de conformité (interdits absolus V14)

| Interdit absolu | Statut |
|---|---|
| Zéro « bonne réponse » / option moralement marquée | ✅ 6/6 dilemmes — les deux options sont défendables, aucune n'est récompensée ni châtiée |
| « toujours » / « jamais » au rendu | ✅ zéro occurrence dans les textes rendus (écran, dilemmes, carte — vérifié machine) |
| Label clinique | ✅ zéro — les dilemmes se disent en mots quotidiens |
| L'accusation (l'écart lu comme faute) | ✅ l'anti-hypocrisie est un TON, pas un mot : le mot et ses dérivés sont absents des textes rendus (vérifié machine) ; la carte présente l'écart comme humain et commun |
| Métadonnée visible (codes, ECD, seuils) | ✅ aucun — moteur seul (Constitution [3]) |
| L'écart ECD rendu à l'autre | ✅ impossible — la carte reste personnelle ; l'autre voit les réponses révélées (consenties), jamais un profil d'écart |
| Trame au dépôt ([11-b]) | ✅ aucune trame — les 6 dilemmes sont des items carte, énoncés au dépôt (quête non-trame) |
| Marque commerciale / nom d'auteur | ✅ aucun |
| Miroir à profils multiples | ✅ absent par divergence de gabarit documentée — la carte unique le remplace (00-README) |

## ⚠️ Points en attente de validation comité

- **Seuils de l'écart ECD** (variante de carte faible/forte, facteur de confiance) : valeurs
  PROVISOIRES de production — verrou [9], re-signature professionnelle avant bêta (FM-019).
- **La lecture ECD des justifications courtes** : le choix forcé porte la mesure principale ; la
  justification (1-2 phrases) affine la lecture du pôle choisi — modalité de cotation À VALIDER.
- **Note de cadrage « écart ECD 1.1 vs dilemmes »** (marque mission) : alignée au registre comme
  première composante du ledger ECD — les valeurs déclarées vivent à la quête **2.1** (consigné au 03).
- **La carte ne se montre pas à l'autre** : elle dérive d'un signal moteur (l'écart) — le canal à deux
  est la révélation mutuelle des dilemmes eux-mêmes, consentie (décision de production consignée au 04).

## 🔁 Circuit restant

Production (fait) → **session principale** (intégration passation à deux, Vibe Check 8.5 hors périmètre) →
**validateur (linter)** → **auditeur hostile C1** → **gouvernance D1**. Aucune course de mélange (ordre fixe — 02).
