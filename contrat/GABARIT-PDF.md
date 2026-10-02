# GABARIT PDF — LE CARNET DE VOYAGE (Portrait A5 imprimable)

> **Provenance** : finding E.2 (audit — « le gabarit PDF n'existe nulle part : "gabarit A5" =
> label sans détail ») + finding G.2a (accessibilité imprimée). Matérialisé par la mission
> corrections P0 conception (2026-10-01). Le présent document est le **cahier des charges de
> forme** : il rend le carnet productible — la spécification est INDÉPENDANTE du moteur de
> génération (contrat technique §7). Seuils et libellés verrouillés : « À VALIDER PAR LE
> COMITÉ ».

---

## 1. FORMAT

| Champ | Valeur |
|---|---|
| Format papier | **A5 — 148 × 210 mm** |
| Marges | **18 mm intérieur** (côté reliure) · **15 mm extérieur** (tête, pied, coupes externes) |
| Pagination | impression en cahiers A4 pliés acceptée — le gabarit reste défini en pages A5 logiques |
| Couleur | lisible en **noir et blanc** (l'accessibilité imprimée interdit de porter une information par la couleur seule — §5) |

## 2. TYPOGRAPHIE

Police unique : **Nunito** (déjà auto-hébergée par l'application —
`apps/web/src/styles.css` l.48 : `font-family: 'Nunito', system-ui, …` — la cohérence de
marque est gratuite ; aucun téléchargement tiers).

| Rôle | Corps | Notes |
|---|---|---|
| Corps de texte | **11 pt**, interlignage **1,45** | jamais en dessous de 11 pt (accessibilité — §5) |
| Titres de monde (page de garde) | **20 pt** | gras |
| Titres de section (§0-§6) | **14 pt** | gras |
| Citations utilisateur (les mots de la personne) | 11 pt **italique** | distinguées par le style, pas par la couleur |
| Pied de page | 8 pt | pagination + mention de version (§4) |

Interdits typographiques : toute police supplémentaire, tout corps < 11 pt hors pied de
page, toute justification forcée créant des rivières (alignement à gauche).

## 3. STRUCTURE DU CARNET

1. **Couverture** — logo Wairyu + nom de l'application + date de génération + version des
   tests (« version v1.3 »). Aucune note de score, aucun classement.
2. **Page de garde par monde** — titre du monde (20 pt) + l'**insight d'en-tête** du domaine
   (une phrase, extraite des en-têtes de portraits existants). Une page par monde traversé —
   les mondes non traversés n'apparaissent pas (le carnet reflète le parcours réel).
3. **Les sections §0 à §6 des portraits** — le contenu des Portraits de Domaine produits
   (précédent `portraits/domaines/coeur.md`) puis du **Portrait Intégral** ; les citations de
   l'utilisateur y sont en italique, résolues verbatim depuis ses réponses (convention
   « rappel verbatim »).
4. **Pied de page (toutes pages)** — pagination **(X/Y)** + la mention verrouillée :
   « Portrait Wairyu — généré le [date] · version v1.3 ».
5. **LA PAGE FINALE OBLIGATOIRE — « Pour en parler à un professionnel »** (§6).

## 4. PIED DE PAGE — MENTION DE VERSION

Texte exact (verrou de forme) :

> Portrait Wairyu — généré le [date] · version v1.3

La version s'incrémente avec le contrat d'inventaire (v1.3 = la version citée en source
unique — Constitution [8]). Un carnet généré porte toujours la version des tests qui l'a
produit : deux carnets de versions différentes ne se comparent pas ligne à ligne.

## 5. ACCESSIBILITÉ IMPRIMÉE (finding G.2a)

- **Contraste ≥ 4,5:1** pour tout texte (mesuré sur la palette imprimée, fond papier inclus).
- **Taille minimale du corps : 11 pt** (hors pied de page à 8 pt, porteur de pagination seule).
- **Aucune information portée par la couleur seule** — le carnet doit rester intégrable en
  noir et blanc : niveaux, états et nuances portés par le texte et la typographie.
- Pas de texte sur image ; si une image (logo) porte du texte, celui-ci est reproduit en
  texte réel à côté.
- Titres et sous-titres structurés (hiérarchie exploitable par une lecteur d'écran sur la
  version numérique PDF : balises de titres préservées).

## 6. LA PAGE FINALE OBLIGATOIRE — « POUR EN PARLER À UN PROFESSIONNEL » (verrou GAB-REN)

Présence : **OBLIGATOIRE dans tout carnet généré**, quel que soit le parcours de la personne
(la page n'est pas conditionnelle — elle n'est jamais le signe d'un problème, c'est une
infrastructure). Cohérence doctrine : formulation de la même famille que le gabarit
**GAB-REN** (encadré de renvoi professionnel — registre Monde 1, n° 25) ; le GAB-REN
conditionnel du Portrait reste unique et jamais réduplicé — la page finale du carnet est
l'infrastructure permanente, distincte du déclenchement conditionnel.

Formulation proposée (verbatim du gabarit — À VALIDER PAR LE COMITÉ) :

> **Pour en parler à un professionnel**
>
> Ce document décrit ce que vous avez partagé — il ne dit pas qui vous êtes, et il ne
> remplace pas une conversation. Si vous souhaitez en parler, un professionnel peut vous
> accompagner : **psychologue** ou **thérapeute de couple** (les titres et le cadre
> d'exercice sont à vérifier auprès des instances françaises compétentes au moment du
> lancement). **Apportez ce document à un premier entretien** : il peut servir de point de
> départ.
>
> Wairyu n'édite **pas d'annuaire de thérapeutes au lancement** — recommander une personne
> nommée créerait une dépendance et une commercialeisation déguisée (doctrine :615,
> anti-commercial). La page reste la même pour tout le monde.

Interdits de la page : aucun lien sponsorisé, aucun classement de professionnels, aucun
partenaire, aucune marque de thérapie, aucune promesse de résultat.

## 7. CONTRAT TECHNIQUE (indépendance du moteur)

Deux moteurs ACCEPTÉS, la présente spécification de forme est indépendante :

- **jsPDF côté client** — génération dans le navigateur, aucune donnée ne quitte
  l'appareil (cohérent avec la doctrine de vie privée : le carnet = les données de
  l'utilisateur seul) ;
- **Puppeteer côté serveur** — rendu HTML/CSS → PDF, fidélité typographique supérieure ;
  impose alors le chiffrement et la purge du document généré (jamais stocké au-delà du
  téléchargement, jamais exporté, jamais vu par un tiers).

Le choix du moteur appartient au chantier d'implémentation — ce gabarit les contraint
tous les deux de la même manière (A5, typographie, structure, page finale).

## 8. CE QUE CE GABARIT N'EST PAS (verrous de contenu)

Le carnet = **les données de l'utilisateur seul**. Il ne contient JAMAIS :

- **aucune donnée de score** — aucune valeur numérique, aucun pourcentage, aucun percentile ;
- **aucun code** — aucun identifiant d'item (Qx.y-xx), aucun code de signal (DTM_N, RSQ…) ;
- **aucun sigle moteur** — les construits sont nommés en toutes lettres ou pas du tout
  (Constitution [3] appliquée au papier) ;
- **aucune donnée d'un autre utilisateur** — pas de contenu de match, pas de citation
  d'autrui ;
- **aucune donnée de match** — pas de compatibilité, pas de comparaison de profils, pas de
  trace d'échange : le carnet est un objet personnel, jamais une pièce de la dynamique de
  couple (les objets À DEUX relèvent des quêtes dédiées et du consentement des deux).

Toute exception future à ces verrous = fiche-mutation + verdict comité.
