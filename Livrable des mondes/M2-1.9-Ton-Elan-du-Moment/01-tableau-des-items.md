# LIVRABLE 1 — LES 8 ITEMS DE LA QUÊTE 1.9 « TON ÉLAN DU MOMENT »

> Légende de la fiche de computation condensée — `C:` carte · `S:` signal · `F:` fiabilité · `M:` modulation · `A:` ancrage.
> Échelle : Likert 5 niveaux (Arbitrage 2) · Orientation : D = direct, I = inversé recodé `6 − réponse` (Arbitrage 1).
> **Tonalité ÉTAT** : chaque énoncé porte son ancre temporelle (« en ce moment », « ces derniers jours »,
> « ces derniers temps ») — on mesure une météo, pas une personnalité.
> **5 D + 3 I, sans paire miroir stricte** : état subjectif — la fiabilité passe par le temps de
> réponse et la ré-administration 30 jours (cadrage 00-README, choix de conception documenté).
> ⚠ **Aucune trame ▲ dans cette quête** : aucun énoncé réservé, aucune balise signal_id de trame.
> ⚠ **Règle absolue** : aucun des 8 items n'entre JAMAIS dans un score de matching — expérience et rétention seulement.

| Code (gelé) | Énoncé | Or. | Besoin | Facette | ▲ (signal_id) | Fiche de computation — 5 canaux |
|---|---|---|---|---|---|---|
| Q1.9-01 | En ce moment, mes journées ressemblent à mes choix. | **D** | autonomie | l'alliance du quotidien | — | C: aucun score — état descriptif (carte unique) · S: SIG_ÉLAN_FAIBLE (moteur) · F: temps de réponse + ré-administration 30 j · M: flux rétention interne (rythme doux) · A: rappel OK |
| Q1.9-02 | En ce moment, ce sont les circonstances qui décident pour moi. | **I** | autonomie | la gouverne extérieure | — | C: état descriptif (recodé 6−r) · S: idem 01 · F: temps de réponse + ré-administration · M: idem 01 · A: rappel OK |
| Q1.9-03 | Ces derniers jours, je fais ce que j'ai choisi de faire. | **D** | autonomie | l'initiative tenue | — | C: état descriptif · S: idem 01 · F: idem 01 · M: idem 01 · A: rappel OK |
| Q1.9-04 | En ce moment, ce que j'entreprends tient debout. | **D** | compétence | l'efficacité ressentie | — | C: état descriptif · S: idem 01 · F: idem 01 · M: idem 01 · A: rappel OK |
| Q1.9-05 | Ces derniers temps, je me sens démuni·e face aux imprévus. | **I** | compétence | la vulnérabilité aux imprévus | — | C: état descriptif (recodé) · S: idem 01 · F: idem 01 · M: idem 01 · A: rappel OK |
| Q1.9-06 | En ce moment, je termine ce que je commence. | **D** | compétence | la continuité de l'action | — | C: état descriptif · S: idem 01 · F: idem 01 · M: idem 01 · A: rappel OK |
| Q1.9-07 | Ces derniers jours, je me sens proche des gens qui comptent. | **D** | affiliation | le lien ressenti | — | C: état descriptif · S: idem 01 · F: idem 01 · M: idem 01 · A: rappel OK |
| Q1.9-08 | En ce moment, je traverse les journées sans vraie conversation. | **I** | affiliation | la solitude du quotidien | — | C: état descriptif (recodé) · S: idem 01 · F: idem 01 · M: idem 01 · A: rappel OK |

## Usage moteur (lecture du contrat — cadrage)

> Les trois besoins (autonomie, compétence, affiliation) composent **l'élan du moment** : moyenne des
> trois scores de besoin (items recodés 6−r pour les inversés, puis normalisation 0-1 par besoin).
> L'élan nourrit **deux lectures exclusives** : ① l'auto-connaissance (miroir LÉGER + carte unique) ;
> ② le flux rétention interne via SIG_ÉLAN_FAIBLE (rythme doux de l'app).
> **Interdictions structurelles** : jamais au score de quête, jamais au matching, jamais aux
> compatibilités, jamais aux portraits exposés à l'autre — vérifié machine (contrôle §règle absolue).

## Décisions de composition documentées (domaine réservé [9] — propositions)

1. **Ancre temporelle sur chaque énoncé** : « en ce moment » (4 items), « ces derniers jours » (2),
   « ces derniers temps » (1) — la répétition est le marqueur sémantique du format ÉTAT (precedent :
   la charpente partagée des checklists 2.3) ; elle empêche la lecture-trait (« je suis quelqu'un
   qui… »), interdit lexical des énoncés.
2. **8 items = 5 D + 3 I** (autonomie 2 D + 1 I · compétence 2 D + 1 I · affiliation 1 D + 1 I) :
   l'inversé porte la facette « en creux » de chaque besoin ; l'autonomie garde deux directs parce
   que son encre (l'alliance du quotidien vs l'initiative tenue) se prête mal à une symétrie stricte
   sans double négation.
3. **Q1.9-08 « sans vraie conversation »** : la solitude mesurée est celle du quotidien partagé, pas
   l'absence de gens — un membre entouré mais non conversé est exactement le cas visé (le besoin
   d'affiliation est un besoin d'échange, pas de présence).
4. **Aucune mention de fatigue, sommeil ou santé** : l'élan est psychologique (trois besoins), pas
   physique — tout item somatique basculerait la quête vers le bien-être clinique (territoire 1.8,
   Phase 3, opt-in strict, verrou renforcé FM-019).

## Contrôles mécaniques passés

| Contrôle | Résultat |
|---|---|
| ≤ 12 mots / énoncé (max constaté : 11) | ✅ |
| 1re personne, présent de l'indicatif | ✅ |
| Zéro double négation | ✅ |
| Zéro fréquence ambiguë (ancres temporelles d'état assumées et documentées) | ✅ |
| Neutralité normative (aucun élan « meilleur ») | ✅ |
| Ancre d'état sur chaque énoncé (zéro lecture-trait) | ✅ 8/8 |
| Orientation conforme à la config CI (`ci/quetes/1.9.json`) : D 01/03/04/06/07 · I 02/05/08 | ✅ |
| Aucun item de trame ▲, aucun énoncé réservé | ✅ |
