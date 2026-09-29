# LIVRABLE 7 — MIROIR DE QUÊTE (ÉTAGE 2) — QUÊTE 1.9 « TON ÉLAN DU MOMENT »

> **Brique paramétrée — standard v2** · Miroir **LÉGER** (quête d'état — gabarit raccourci assumé,
> mission VAGUE 6) → **80-150 mots/variante** (Constitution [7]) · **3 profils** : élan haut / mixte /
> bas. Structure : **TA LUMIÈRE** · **→ TON OMBRE (en couple)** · **→ TA TENSION** · **→ LE MINI-RES**.
> Ombre ≥ lumière · registre probabiliste · coût double nommé · rappels en toutes lettres ·
> ancre temporelle d'état systématique · **JAMAIS AU SCORE, JAMAIS AU MATCHING** (verrou structurel).

## 0 — Champ de saillance

Quête à brique unique : les 8 réponses d'état produisent **une** brique, choisie par l'élan du moment
(moyenne des trois besoins, recodés) : **haut** (> 0.65) · **mixte** (0.35-0.65) · **bas** (< 0.35) —
bornes reprises FM-019, provisoire concepteur. Le profil bas porte l'**encadré ressources** (§2).
Aucune lecture permanente : chaque rendu est daté (« en ce moment ») et expire à la re-passation.

## 1 — Les 3 profils

### MR-19-ELAN-HAUT — élan haut

**TA LUMIÈRE**
En ce moment, ton élan suit : tes journées ressemblent à tes choix, ce que tu entreprends tient. C'est une saison où les choses avancent — et ça s'entend jusque dans tes conversations.

**→ TON OMBRE (en couple)**
L'élan haut pousse à en rajouter : un projet de plus, une promesse de plus. La recherche documente que l'accumulation en saison haute conduit fréquemment à des semaines plus pleines que les jours ne le permettent. Le coût pour toi : du vent dans les voiles, mais plus de nuit pour dormir. Le coût pour l'autre : une présence calée sur ta course, plus qu'à celle du lien.

**→ TA TENSION**
Ton élan construit — il lui faut des journées qui savent finir.

**→ LE MINI-RES**
- Lumière : ta saison haute porte les projets et les gens.
- Ombre : trop de voiles ouvertes, et la barque emporte l'équipage.
- Mode d'emploi : garde une place vide par semaine — l'élan y respire.

### MR-19-ELAN-MIXTE — élan mixte

**TA LUMIÈRE**
Ton élan est en deux tons : ce que tu as choisi tient, ce qui arrive te déborde. Tu as répondu que certaines journées décident à ta place — c'est le profil le plus courant.

**→ TON OMBRE (en couple)**
L'entre-deux fatigue différemment : tu montes tes jours sur ce qui tient, et l'imprévu prend le reste. La recherche documente que les états mixtes prolongés conduisent fréquemment à une lecture de soi hésitante. Le coût pour toi : te croire inconstant alors que ta saison est mixte. Le coût pour l'autre : ignorer quelle version de ta journée il va rencontrer ce soir.

**→ TA TENSION**
Ton élan n'est pas hésitant — il est en mouvement, comme ton mois.

**→ LE MINI-RES**
- Lumière : ce que tu choisis tient — c'est déjà beaucoup.
- Ombre : l'imprévu pilote la moitié restante.
- Mode d'emploi : nomme ce qui tient — le reste attend son tour, pas ton verdict.

### MR-19-ELAN-BAS — élan bas

**TA LUMIÈRE**
En ce moment, ton élan est bas : les journées décident pour toi, les vraies conversations se font rares. Le dire, comme tu l'as fait, demande du courage — pas de l'élan.

**→ TON OMBRE (en couple)**
Un élan bas rétrécit le champ : les messages attendent, les invitations glissent, et la personne qui t'attend peut lire un désintérêt. La recherche documente que les états bas conduisent fréquemment à des liens qui se relâchent par silence, pas par choix. Le coût pour toi : des liens qui s'éloignent sans l'avoir décidé. Le coût pour l'autre : ne pas savoir si c'est lui, ou ta saison.

**→ TA TENSION**
Ton élan est en pause — une marée, pas une fin de parcours.

**→ LE MINI-RES**
- Lumière : tu as nommé ta saison — ça compte déjà.
- Ombre : le silence finit les liens que personne n'a quittés.
- Mode d'emploi : une conversation ouverte par jour — une seule suffit à tenir le fil.

## 2 — L'encadré ressources du profil bas (esprit REN — ressources, jamais d'alarme)

> Bloc rendu SOUS le MINI-RES du profil bas uniquement. Zéro vocabulaire clinique, zéro diagnostic,
> zéro score, zéro urgence fabriquée : ce bloc OFFRE, il n'alerte jamais.

> **↩ Quelques appuis, si ça t'aide**
> Quand l'élan manque, trois appuis simples : garde un geste de soin par jour (marcher, cuisiner,
> dormir) ; garde une conversation ouverte — une seule suffit ; laisse l'app respirer avec toi, ton
> rythme ici suit le tien. Si la période s'installe, en parler à quelqu'un de confiance — ou à un
> professionnel — reste la voie des jours lourds. Ici, rien n'est en retard.

**Garde-fous de l'encadré :**

1. Rendu UNIQUEMENT sur le profil bas (≥ 2 besoins faibles, bornes moteur) — jamais sur les profils
   haut/mixte, jamais répété dans la même fenêtre de 30 jours.
2. **Coordination avec le GAB-REN du Portrait** (SIG_REN_REQUIS, formulation verrouillée, une seule
   occurrence par Portrait) : l'encadré 1.9 est un bloc local doux, SANS la formulation verrouillée ;
   l'unicité du GAB-REN du Portrait reste entière. La coordination des deux gabarits (jamais deux
   renvois visibles dans la même fenêtre) : À VALIDER PAR LE COMITÉ.
3. Hors comptage du gabarit LÉGER (80-150 mots = les 4 blocs de la brique).
4. Zéro métadonnée : le bloc ne cite ni score ni besoin ni borne — il parle repos, lien, rythme.
5. Aucune relance : le bloc se lit, il ne re-notifie jamais.

## 3 — Gabarit paramétré (assemblage moteur)

**GAB-MR-19-ELAN** :
- `texture_seed` → fixe (1 variante par profil) · `degre_elan` → haut / mixte / bas (moteur, bornes FM-019).
- `citation_items` → rappel en toutes lettres d'UNE réponse D et d'UNE réponse I réelles, résolues
  verbatim contre `01-tableau-des-items.md` — JAMAIS les codes.
- Branche bas → l'encadré ressources (§2) sous le MINI-RES.
- Toute affirmation porte son ancre temporelle (« en ce moment », « cette semaine ») — le rendu expire
  à la re-passation (30 jours).

## 4 — Table d'ancrage (affirmation → items → vérification)

| Brique (ID moteur) | Affirmation rendue | Items (champ moteur) | Vérification |
|---|---|---|---|
| MR-19-ELAN-HAUT | « tes journées ressemblent à tes choix » | Q1.9-01 → 08, élan > 0.65 | Citations résolues verbatim contre le tableau 01 ; aucun code rendu |
| MR-19-ELAN-MIXTE | « ton élan est en deux tons » | élan 0.35-0.65 | idem |
| MR-19-ELAN-BAS | « ton élan est en pause » + encadré ressources | élan < 0.35 (≥ 2 besoins faibles) | idem — SIG_ÉLAN_FAIBLE sans trace texte (rythme doux côté app) |

## 5 — Signatures intégrées (registre 03 — aucune inventée)

| Signature | Intégration au miroir |
|---|---|
| **SIG_ÉLAN_FAIBLE — Le rythme doux** | Aucun texte — la brique « bas » parle de saison et de pause, jamais du mécanisme de l'app. Le rythme doux se vit, il ne se raconte pas. |

## 6 — Contrôles avant livraison (affichés)

| Contrôle | Résultat |
|---|---|
| Ombre ≥ lumière par variante | ✅ 3/3 |
| Conséquence probabiliste | ✅ 3/3 (« la recherche documente que ») |
| Coût double nommé | ✅ 3/3 |
| Rappels en toutes lettres (jamais un code) | ✅ |
| Ancre temporelle d'état systématique | ✅ |
| Zéro interdit lexical | ✅ |
| Zéro normativité de l'élan (les 3 profils se valent) | ✅ |
| Encadré ressources : zéro clinique, zéro alarme, zéro relance | ✅ (garde-fous §2) |
| Volume 80-150 mots par variante (hors encadré) | ✅ 3/3 (comptage machine) |
| **JAMAIS AU SCORE** : zéro mention de matching/pool/compatibilité | ✅ vérifié machine |

## TABLE DE FICHIERS (format P1)

═══ FICHIER : Livrable des mondes/M2-1.9-Ton-Elan-du-Moment/07-miroir.md ═══
(écrit directement sur disque — accès FS ; la présente table consigne la livraison)
═══ FIN FICHIER ═══

> Fichiers touchés par la présente livraison : un seul — `07-miroir.md` (créé). Aucune signature
> inventée ; la règle absolue (jamais au score, jamais au matching) est gravée à la fiche de cadrage,
> au tableau 01, aux slots et au présent fichier.
