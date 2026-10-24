# -*- coding: utf-8 -*-
"""
WTC-Q1 — LIBELLÉS OFFICIELS DE L'INSTRUMENT RIO-01 (fichier SUPPLÉMENTAIRE)
===========================================================================
WAIRYU Thérapie Couple — RIO-01 « Comment je me raccroche »
Dimension attachement (bloc Psychologique des 26 dimensions du programme).

ACTION N°3 — premier instrument scellé.
Les 19 textes ci-dessous sont LES libellés réels de l'instrument, approuvés
par le fondateur (trace de session 1a16c6a31081f721, 24/10/2026, « c'est bon
pousse cela dans github ») après relecture item par item de la proposition v2
(19 textes : 6 affirmations positives · 12 neutres · 1 vigilance équilibrée ·
0 sombre).

RÈGLE ABSOLUE : ce module est un module de DONNÉES pures.
- Il n'importe RIEN et ne modifie RIEN : aucun moteur, aucun seuil, aucun
  calcul. Le cœur réel de l'instrument reste
  `validation-q1-r1/src/wtc_q1_core.py` (révision R1, SEM structurel 0,195),
  TEL QUEL.
- Le moteur lit des entiers 1-4, jamais les mots : la valence des textes ne
  touche aucun calcul validé. Toute la preuve est dans
  `results/rapport-libelles-RIO-01.md`.

Dérivation des textes : exclusivement des axes et faces du moteur RIO-01
(peur de perdre · peur de dépendre — A1 Vigie · A2 Besoin de mots ·
A3 Rumeur · B1 Inconfort du près · B2 Debout-seul · B3 Porte fermée).
Doctrine respectée : langage simple, honnêteté sans condamnation, jamais le
mot « pathologie », jamais l'évaluation du partenaire, inclusivité (« (e) »),
anti-déjoueuvre par valence mélangée (les ancres 5 et 15, items inversés,
retournent toute stratégie mono-directionnelle).

Anti-déjoueuvre (les 3 filets sont DÉJÀ dans le cœur validé L1 — rien à
ajouter au code) :
  1. valence mélangée — tout refuser retourne les ancres 5/15 contre la
     stratégie ; tout accepter crée une contradiction mesurée en face A1/B1 ;
  2. vigilance (item 19, attendu = 3 « Plutôt vrai ») — attrape le trop
     parfait et le tout-exagéré (pénalité −20) ;
  3. RQS — linéarité (−20), anti-contradiction (−20), rythme (−25) :
     statuts OK / PRUDENCE / INVALIDE.
"""

from __future__ import annotations

# ─────────────────────────────────────────────────────────────────────────────
# LES 19 LIBELLÉS OFFICIELS (accord fondateur, 24/10/2026)
# ─────────────────────────────────────────────────────────────────────────────

#: Libellés des 18 items (clé = numéro d'item du moteur, 1-18).
LIBELLES: dict[int, str] = {
    1: "Je remarque vite les petits changements d'humeur de mon partenaire.",
    2: "Je perçois tout de suite quand l'ambiance change entre nous.",
    3: "Les mots rassurants de mon partenaire me font du bien.",
    4: "Quand mon partenaire me dit qu'il tient à moi, je me sens apaisé(e).",
    5: "Quand mon partenaire a ses activités sans moi, j'arrive à profiter de mon propre moment.",
    6: "J'aime quand les choses importantes sont dites clairement, avec des mots.",
    7: "J'essaie souvent de deviner ce que pense mon partenaire derrière ses mots.",
    8: "Je repasse mentalement nos échanges pour en tirer le sens.",
    9: "Quand quelque chose reste flou, je me fais des hypothèses sur ce que ça veut dire.",
    10: "J'ai besoin de moments à moi, même quand tout va bien entre nous.",
    11: "Quand on me demande ce que je ressens, je préfère d'abord y réfléchir tranquillement.",
    12: "Je suis fier/fière de pouvoir me débrouiller seul(e).",
    13: "Avant de demander de l'aide, j'essaie d'abord de régler les choses moi-même.",
    14: "Avoir mes propres projets en dehors du couple me fait du bien.",
    15: "Partager mes journées et mes pensées avec mon partenaire me fait du bien.",
    16: "Il m'arrive de garder mes inquiétudes pour moi.",
    17: "Je mets du temps à me confier, même aux personnes proches.",
    18: "Il y a des sujets que je préfère garder pour moi.",
}

#: Libellé de la 19e question — VIGILANCE (non comptée dans les scores,
#: réponse honnête attendue = 3 « Plutôt vrai » ; moteur : VIGILANCE_ATTENDUE).
LIBELLE_VIGILANCE: str = (
    "Il m'arrive d'avoir des réactions que je ne comprends pas tout de suite."
)

# ─────────────────────────────────────────────────────────────────────────────
# MÉTADONNÉES D'AFFICHAGE (noms écran — jamais utilisés par le calcul)
# ─────────────────────────────────────────────────────────────────────────────

#: Échelle de réponse 1-4 (libellés écran des 4 boutons).
ECHELLE_LABELS: dict[int, str] = {
    1: "FAUX de moi",
    2: "Plutôt faux",
    3: "Plutôt vrai",
    4: "VRAI de moi",
}

#: Noms écran des deux axes (moteur : AXES A/B).
AXE_NOM_ECRAN: dict[str, str] = {
    "A": "peur de perdre",
    "B": "peur de dépendre",
}

#: Noms écran des 6 faces (moteur : FACES A1…B3).
FACE_NOM_ECRAN: dict[str, str] = {
    "A1": "Vigie",
    "A2": "Besoin de mots",
    "A3": "Rumeur",
    "B1": "Inconfort du près",
    "B2": "Debout-seul",
    "B3": "Porte fermée",
}

#: Sous-titres écran des faces (une ligne, langage simple).
FACE_SOUS_TITRE: dict[str, str] = {
    "A1": "je remarque les signaux",
    "A2": "les mots qui rassurent",
    "A3": "j'interprète dans ma tête",
    "B1": "le proche qui me serre",
    "B2": "je me tiens debout tout(e) seul(e)",
    "B3": "ce que je garde pour moi",
}

# ─────────────────────────────────────────────────────────────────────────────
# TRAÇABILITÉ DE LA VALENCE (6 positives · 12 neutres · 1 équilibrée · 0 sombres)
# ─────────────────────────────────────────────────────────────────────────────

#: Valence déclarée de chaque texte (19 = vigilance, « équilibrée »).
VALENCE: dict[int, str] = {
    1: "neutre", 2: "neutre", 3: "positive", 4: "positive",
    5: "positive", 6: "neutre", 7: "neutre", 8: "neutre",
    9: "neutre", 10: "neutre", 11: "neutre", 12: "positive",
    13: "neutre", 14: "positive", 15: "positive", 16: "neutre",
    17: "neutre", 18: "neutre", 19: "équilibrée",
}

#: Ancres de sécurité = les DEUX items inversés du moteur (ITEMS_INVERSES) :
#: être d'accord avec ces phrases positives fait BAISSER le score de peur —
#: c'est ce qui retourne toute stratégie « tout refuser » contre elle-même.
ANCRES_SECURITE: tuple[int, ...] = (5, 15)

#: Provenance (consignée, vérifiable).
PROVENANCE: dict[str, str] = {
    "instrument": "RIO-01 « Comment je me raccroche »",
    "dimension": "attachement (bloc Psychologique, 26 dimensions du programme)",
    "moteur_de_référence": "validation-q1-r1/src/wtc_q1_core.py (révision R1)",
    "accord_fondateur": "trace 1a16c6a31081f721, 24/10/2026 — « c'est bon pousse cela dans github »",
    "proposition": "action n°3, v2 (Task 197-199) — 19 libellés relus item par item",
    "dérivation": "axes/faces du moteur RIO-01 uniquement — aucune source externe",
    "valence": "6 positives · 12 neutres · 1 équilibrée (vigilance 19) · 0 sombres",
}
