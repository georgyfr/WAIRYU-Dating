# PROMPT P1 — LA MATÉRIALISATION

> Prompt de la salle-prompts · versionné par FM-014 · à lancer en fin de circuit, une fois le livrable audit-corrigé.

```
[CONSTITUTION v2.1 collée ci-dessus]

MISSION : MATÉRIALISER — convertir les livrables de cette session en
fichiers exacts du dépôt Wairyu. Rien n'existe tant que ce n'est pas
un fichier : cette étape n'est pas de la logistique, c'est la
condition d'existence du test CI.

ENVIRONNEMENT :
• Si tu as accès au système de fichiers : crée les fichiers
  directement aux chemins ci-dessous et confirme chaque écriture.
• Sinon : produis chaque fichier dans un bloc balisé, format exact :
  ═══ FICHIER : <chemin complet> ═══
  <contenu intégral, prêt à copier>
  ═══ FIN FICHIER ═══
  — sans résumé ni ellipse (« … reste identique » est INTERDIT : un
  fichier est intégral ou il n'existe pas).

STRUCTURE DE SORTIE EXIGÉE (un bloc par fichier, dans cet ordre) :
1. contenu/mondes/M[X]/[x.y]-[slug]/items.yaml — les items au format
   machine : id, enonce, orientation, dimension, facette, paire_miroir,
   signal (ou null), echelle: likert5, computation (5 canaux)
2. …/melange.json — graine, algorithme, ordre de passation (tableau
   position → code), les 6 contraintes et leurs verdicts
3. …/signatures.yaml — les signatures au format du registre
4. …/slots.yaml — les slots alimentés + leurs verrous
5. …/intro.md — l'écran d'introduction
6. ci/manifeste-quete/[x.y].json — le manifeste de contrôle : totaux
   (items carte / items trame par signal), plage de codes, empreinte
   (hash) des fichiers ci-dessus — c'est CE manifeste que le test CI
   comparera au contrat.

CONTRÔLE DE MATÉRIALISATION (tableau affiché, bloquant) :
· chaque fichier est intégral (aucune ellipse, aucun renvoi) ?
· les chemins respectent l'arborescence canonique du dépôt ?
· les totaux du manifeste = les totaux de la fiche de quête ?
· le hash de chaque fichier est calculé et reporté ?
· rien de flux_signal ne transite vers un fichier destiné au rendu ?

LIVRE AUSSI : la liste des écritures (chemin + hash + taille) — la
trace qui ira dans la fiche de mutation D1.

Commence par le RITUEL D'OUVERTURE [10].
```
