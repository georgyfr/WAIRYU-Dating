PROJET WAIRYU — Spécification Produit v0.2 (additions contractuelles)
=======================================================================

PROVENANCE (finding E.4e, audit externe — mission corrections P0 conception, 2026-10-01)

La présente v0.2 est un ACTE D'ADDITION à la spécification produit. La v0.1
(« PROJET-WAIRYU-Specification-Produit-v0.1.txt », 12 961 lignes) reste le corpus de
référence inchangé — document fondateur. Les 4 additions ci-dessous sont CONTRACTUELLES :
elles comblent l'écart signalé par l'audit entre des livrables déjà produits par la
production des quêtes et une spécification qui ne les déclarait pas.

RÉFÉRENCE CIRCULAIRE SUPPRIMÉE : la chaîne « spec → gabarit → spec » de l'époque de
l'audit n'existe plus. Les additions référencent le gabarit UNE FOIS, par son chemin
dépôt (`contrat/GABARIT-PDF.md`) ; le gabarit, lui, ne référence pas la spec — il
référence la doctrine et le contrat d'inventaire (v1.3). La dépendance est unidirectionnelle
et vérifiable.

COHÉRENCE AVEC LA SPÉCIFICATION D'ORIGINE (vérifiée) :
  · promesse (v0.1, l.538-541) : « La monétisation ne corrompt pas l'expérience ·
    Sécurité et matching de base gratuits » → l'addition (1) est anti-commerciale par
    construction (pas d'annuaire, pas de partenaire — GABARIT-PDF.md §6) ;
  · libellé (v0.1, l.597-600) : « Wairyu promet : un cadre plus transparent · des outils
    concrets · des limites assumées · une amélioration continue » → les additions (2), (3)
    et (4) matérialisent des OUTILS CONCRETS existant déjà au dépôt (portraits, carnet,
    gabarit) — la spec rattrape la production, elle n'annonce rien de nouveau.

════════════════════════════════════════════════════════════════════
ADDITION 1 — LA PAGE « POUR EN PARLER À UN PROFESSIONNEL »
════════════════════════════════════════════════════════════════════

Page OBLIGATOIRE en fin de carnet (et infrastructure de l'application au moment où le
Portrait est rendu) : renvoi professionnel permanent, non conditionnel — psychologue ou
thérapeute de couple (titres à vérifier auprès des instances françaises compétentes au
lancement), « apportez ce document à un premier entretien ». PAS d'annuaire de thérapeutes
au lancement (anti-commercial — doctrine :615). Formulation verrouillée de la famille
GAB-REN : voir `contrat/GABARIT-PDF.md` §6 (verbatim proposé, À VALIDER PAR LE COMITÉ).

Base de production : signature SIG_REN_REQUIS (registre Monde 1, n° 25) — la page du
carnet est l'infrastructure permanente, distincte du déclenchement conditionnel GAB-REN
du Portrait (jamais réduplicé).

════════════════════════════════════════════════════════════════════
ADDITION 2 — LE CARNET DE VOYAGE TÉLÉCHARGEABLE
════════════════════════════════════════════════════════════════════

Le carnet de voyage est le document PDF personnel de l'utilisateur : la synthèse imprimable
de son parcours (les mondes traversés, les sections §0-§6 de ses portraits, ses citations
verbatim). Il est TÉLÉCHARGEABLE à tout moment, généré depuis les données de l'utilisateur
seul. Verrous de contenu : aucune donnée de score, aucun code, aucun sigle moteur, aucune
donnée d'un autre utilisateur, aucune donnée de match (GABARIT-PDF.md §8).

════════════════════════════════════════════════════════════════════
ADDITION 3 — LE GABARIT PDF (CAHIER DES CHARGES DE FORME)
════════════════════════════════════════════════════════════════════

Le gabarit de forme du carnet est matérialisé : `contrat/GABARIT-PDF.md` — A5 (148×210 mm,
marges 18 mm intérieur / 15 mm extérieur) · police Nunito (auto-hébergée) corps 11 pt /
interlignage 1,45, titres de monde 20 pt, titres de section 14 pt, citations utilisateur en
italique 11 pt · structure couverture → pages de garde par monde → sections §0-§6 → pied de
page paginé « Portrait Wairyu — généré le [date] · version v1.3 » → page finale
obligatoire · accessibilité imprimée (contraste ≥ 4,5:1, corps min 11 pt, zéro information
portée par la couleur seule) · deux moteurs acceptés (jsPDF client / Puppeteer serveur —
spécification indépendante du moteur).

════════════════════════════════════════════════════════════════════
ADDITION 4 — LE PORTRAIT INTÉGRAL
════════════════════════════════════════════════════════════════════

Le Portrait Intégral est la synthèse finale — la réunion des Portraits de Domaine (cœur
produit ; intime, sécurité, soi : différés sur cadrage, FM-026 §2) en un document unique,
porté par le même gabarit A5 (addition 3). Il est au contrat comme livrable de clôture du
parcours : sa production suit les Portraits de Domaine restants (verrou : SUR CADRAGE,
FM-026 §2). Le présent acte le déclare au niveau produit ; le contenu détaillé reste porté
par les gabarits de portraits et le contrat d'inventaire v1.3 (PARTIE 13 — différés).

════════════════════════════════════════════════════════════════════
STATUT
════════════════════════════════════════════════════════════════════

Version : v0.2 (acte d'addition sur v0.1 — corpus fondateur inchangé).
Les 4 additions sont contractuelles dès la présente version. Tout seuil, libellé verrouillé
ou fenêtre typographique reste « À VALIDER PAR LE COMITÉ » (Constitution [9]).
