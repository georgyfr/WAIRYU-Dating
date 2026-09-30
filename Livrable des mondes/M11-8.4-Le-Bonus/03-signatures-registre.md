# LIVRABLE 3 — SIGNATURE ATTENDUE DE LA QUÊTE 8.4 (format du registre)

> quete : 8.4 « Le bonus » · fiche : 03 — signatures et registre
> ⚠ **Conditions et seuils : verrou [9]** — les niveaux (garde/partage), les paliers
> d'intensité et la valeur du crédit sont **PROVISOIRES** : « À VALIDER PAR LE COMITÉ »
> (provisoire concepteur — re-signature professionnelle avant bêta, FM-019).
> **[MOTEUR SEUL]** — la marque est obligatoire partout où la signature est documentée.

## Le principe gravé

> **Donner ce qui t'appartient est le seul test honnête de générosité.**
> Le registre du moteur distingue les **réponses déclarées** (les échelles du voyage) et les
> **« gestes mesurés »** (des faits posés, datés, réels). GEN — générosité réelle — est un
> geste mesuré : il ne se déclare pas, il se pose ; il coûte à celui qui le fait ; c'est ce
> coût qui le rend lisible. 8.4 ouvre la famille des gestes mesurés du voyage à deux.

## Exposition de la signature

> La quête produit un geste qui se voit (la pépite reçue) et un signal qui ne se raconte pas
> (le crédit **[MOTEUR SEUL]**). L'un est le don ; l'autre vit au ledger, sans texte, sans
> badge, sans écran. Ils ne se mélangent pas.

| ID | Nom | Conditions exactes | Conséquence | Source | Fenêtre |
|---|---|---|---|---|---|
| **SIG-8.4-01** | « GEN » — générosité réelle — **[MOTEUR SEUL]** | Le geste **Q8.4-01** posé (une seule fois par compte). **Niveau garde** : 0 pépite offerte. **Niveau partage** : ≥ 1 pépite offerte. **Intensité interne** (niveau partage) : part offerte de l'avoir — paliers PROVISOIRES : amorce ≤ 1/4 · cœur > 1/4 et < 3/4 · large ≥ 3/4 (totalité incluse) — **À VALIDER PAR LE COMITÉ**. | Un **crédit au FACTEUR DE CONFIANCE du profil donneur** (composante comportementale de fiabilité — même famille de conséquence que SIG_CONTRIB 1.10, précédent du registre), proportionnel à l'intensité, **plafonné** (seuil : comité). Écrit au ledger moteur. **Le niveau garde produit un crédit nul — et rien d'autre** : aucun signal négatif, aucune dette, aucune trace visible. Le crédit ne se montre à personne : ni au donneur, ni au reçu, ni aux tiers — **rendu hors de toute interface**. | Q8.4-01 (geste mesuré — « gestes mesurés ») | une fois par compte, à la pose du geste ; réévalué seulement si le design de l'avoir évolue (Fiche de Mutation) |

## Le bloc anti-pression (verrou capital — gravé ici, au 00, au 06)

> **Le geste ne se traduit en aucun avantage de visibilité, en aucun avantage de matching
> payant, en aucune pression.** Cinq interdits fermés, vérifiables machine :

| # | Interdit | Portée |
|---|---|---|
| 1 | **Aucun avantage de visibilité / de matching payant** | le crédit ne s'achète pas, ne se vend pas, ne booste rien ; le premium ne touche à GEN en rien (Constitution [6] — le premium n'achète personne) |
| 2 | **Aucun classement** | pas de palmarès de générosité, pas de comparaison entre membres, pas de percentile |
| 3 | **Aucun badge** | rien ne s'affiche sur un profil (« généreux » ou autre — aucun statut, aucune jauge, aucune icône) |
| 4 | **Aucune notification de relance** | **une seule invitation, silence après** — aucune relance, aucun compte à rebours, aucun rappel du geste non joué, aucune relance du reçu pour « rendre » |
| 5 | **Aucune pression sur le don** | garder est un choix neutre ; recevoir n'oblige à rien ; l'app ne provoque aucune boucle de contre-don (aucun message « rends la politesse », aucune suggestion de don au reçu) |

## Notes de registre

- **GEN est un crédit, pas un trait.** Il crédite un fait (un don réel qui coûte) ; il ne
  décrit pas un caractère (une personne généreuse) — c'est pourquoi aucun miroir n'existe
  (04/07) : décrire le geste ferait une morale, pas un portrait.
- **Le crédit est à sens unique et à sens positif** : il crédite le donneur ; il ne descend
  en dessous de zéro pour personne ; la garde ne pèse rien. Aucune compensation croisée :
  GEN ne compense aucun autre signal, ne masque rien, ne rachète rien.
- **GEN vit à côté des signaux déclarés** : il alimente le facteur de confiance (fiabilité du
  profil — faire vrai et dire vrai convergent), sans entrer dans aucun calcul de trame de
  sécurité (la trame reste invisible — Constitution [2]) et sans franchir le rendu.
- **Zéro métadonnée au rendu** : Q8.4-01, la dimension interne, les niveaux, les paliers, le
  plafond — tout reste moteur (Constitution [3]). Le membre ne voit que le jeu et le don.
- **Zéro trame hébergée** : 8.4 n'héberge aucun signal ▲ — 1 geste, rien d'autre.
- **L'évolution du geste** : toute extension (nouvel avoir, autre usage des pépites, geste
  répété) = Fiche de Mutation + verdict comité — le geste unique à une invitation est un
  choix d'anti-pression (une répétition créerait une routine à relancer).

## Cohérence avec le yaml (06)

- `signatures: [SIG-8.4-01]` · `scoring: {moteur: seul, gen: {niveaux: "garde/partage",
  facteur_confiance_donneur: oui, rendu: interdit}}` — le champ `rendu` du yaml porte la
  valeur d'interdit (valeur MÉTADONNÉE moteur) : la signature ne franchit aucune interface
  (ni interface du membre, ni portrait, ni notification, ni export).
- `anti_patterns: ["classement", "badge", "relance", "pression"]` — les quatre familles de
  l'anti-pression, portées au contrat du geste.
