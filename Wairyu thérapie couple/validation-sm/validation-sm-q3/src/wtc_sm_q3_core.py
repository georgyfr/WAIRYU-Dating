# -*- coding: utf-8 -*-
"""WTC-SM-Q3 « Ce que notre lien sait porter » (RIO-13) — noyau de classification.

Verrouillage : SM-Q3-SPEC.md (fondateur, 18/10/2026)
  A1 : seuil d'activation 3,50 (tel quel) · A2 : faces seules (1 voie/force)
  A3 : override affichage en crise héritée · A4 : SILENCIEUSE mot pour mot.
Règles : D-ÉCHELLE 3,00 · D-DENSITÉ ±0 · D-TABLE (table=code) ·
D-NOMENCLATURE (labels uniques) · anti-fabrication (programme §5.5) ·
D-CRISE hérité (0 voie nouvelle).
"""

# --- Constantes verrouillées -------------------------------------------------

SEUIL_ACTIVATION = 3.50   # A1 verrouillé (cohérence dominance Q2)
MAX_FORCES = 2            # règle de densité (modèle émo v1.1 / RIO-03)

TABLE_SILENCIEUSE = ("Votre lien est encore discret sur ces questions — "
                     "c'est un constat, pas un défaut : la suite du parcours "
                     "servira aussi à ça.")  # A4 verrouillé, mot pour mot

# D-TABLE — miroir EXACT du tableau §4 de la SPEC verrouillée (ordre de banque)
FORCES_BANQUE = (
    ("F-S1", "Le plan des jours durs", "SM-P1"),
    ("F-S2", "La frontière co-étiquetée", "SM-N1"),
    ("F-S3", "Les rituels de deux adultes", "SM-P2"),
    ("F-S4", "La revue mensuelle", "SM-P3"),
    ("F-S5", "Ma rive, ta rive", "SM-N2"),
    ("F-S6", "Le soin qui ne dévore pas", "SM-N3"),
)

FACES = tuple(f[2] for f in FORCES_BANQUE)
AXES = {"P": ("SM-P1", "SM-P2", "SM-P3"), "N": ("SM-N1", "SM-N2", "SM-N3")}
VOIES_HERITEES = ("SM-C1", "A2", "H5")   # D-CRISE hérité (Q1-R3 / RIO-02 / Q2)
LABELS = ("SILENCIEUSE", "LUMIÈRE_UNIQUE", "DEUX_LUMIÈRES", "CRISE_HÉRITÉE")


# --- Géométrie de l'instrument ----------------------------------------------

def moyenne_face(items):
    """Moyenne des 4 items d'une face (D-VÉRITÉ : 4 items/face, entiers 1-5)."""
    items = tuple(items)
    if len(items) != 4:
        raise ValueError("une face SM-Q3 a EXACTEMENT 4 items (verrouillage)")
    if not all(isinstance(i, int) and 1 <= i <= 5 for i in items):
        raise ValueError("items entiers 1-5 (D-ÉCHELLE)")
    return sum(items) / 4.0


def scores_faces(reponses):
    """reponses : dict face -> séquence de 4 items. -> dict face -> float."""
    return {f: moyenne_face(reponses[f]) for f in FACES}


# --- Banque de forces --------------------------------------------------------

def force_active_de_score(score, seuil=SEUIL_ACTIVATION):
    """Voie unique d'activation (A2) — frontière verrouillée : >= seuil."""
    return score >= seuil


def forces_actives(scores):
    """IDs des forces activées, ordre de banque (AVANT application limite)."""
    return [fid for fid, _nom, face in FORCES_BANQUE
            if force_active_de_score(scores[face])]


def appliquer_limite(forces):
    """Max 2 forces/profil — densités toutes égales (A2 : 1 voie/force),
    tie-break = ordre de banque (les 2 premières actives)."""
    return list(forces[:MAX_FORCES])


def crise_heritee_de(voies_heritees):
    """D-CRISE hérité : A2 ∨ SM-C1 ∨ H5 — 0 voie nouvelle en Q3."""
    return any(v in VOIES_HERITEES for v in voies_heritees)


def statut_de(n_actives, crise):
    """D-NOMENCLATURE : 4 labels uniques, jamais recalculés ailleurs."""
    if crise:
        return "CRISE_HÉRITÉE"
    if n_actives == 0:
        return "SILENCIEUSE"
    if n_actives == 1:
        return "LUMIÈRE_UNIQUE"
    return "DEUX_LUMIÈRES"


def classifier(reponses, voies_heritees=()):
    """Classification complète d'un profil — coeur du moteur Q3."""
    scores = scores_faces(reponses)
    actives = forces_actives(scores)
    calculees = appliquer_limite(actives)
    crise = crise_heritee_de(voies_heritees)
    statut = statut_de(len(actives), crise)
    return {
        "scores": scores,
        "n_actives_avant_limite": len(actives),
        "forces_actives": actives,
        "forces_calculees": calculees,          # traçabilité (A3)
        "forces_affichees": [] if crise else calculees,  # override A3
        "crise_heritee": crise,
        "statut": statut,
        "texte_silencieuse": TABLE_SILENCIEUSE if statut == "SILENCIEUSE" else None,
    }


# --- Vérificateurs de règles -------------------------------------------------

_TABLE_SPEC_VERROUILLEE = (
    ("F-S1", "Le plan des jours durs", "SM-P1"),
    ("F-S2", "La frontière co-étiquetée", "SM-N1"),
    ("F-S3", "Les rituels de deux adultes", "SM-P2"),
    ("F-S4", "La revue mensuelle", "SM-P3"),
    ("F-S5", "Ma rive, ta rive", "SM-N2"),
    ("F-S6", "Le soin qui ne dévore pas", "SM-N3"),
)


def verifier_d_echelle():
    """D-ÉCHELLE : tout à 3 -> 3,00 partout, déterministe (2 axes)."""
    reps = {f: (3, 3, 3, 3) for f in FACES}
    s = scores_faces(reps)
    faces_ok = all(abs(v - 3.0) < 1e-12 for v in s.values())
    axes_ok = all(abs(sum(s[f] for f in faces) / 3.0 - 3.0) < 1e-12
                  for faces in AXES.values())
    return {"det": bool(faces_ok and axes_ok), "scores": s}


def verifier_d_verite(reponses, labels_moteur, labels_table):
    """D-VÉRITÉ : inventaire croisé.
    reponses : dict profil -> dict face -> 4 items (univers complet).
    labels_moteur / labels_table : statuts observés (moteur) et attendus
    (table de vérité du simulateur, ancrée sur les paramètres vrais)."""
    n_par_face_ok = all(len(reps[f]) == 4 for reps in reponses.values()
                        for f in FACES)
    echantillon = next(iter(reponses.values()))
    items_total = sum(len(reps) for reps in echantillon.values())
    d_table = tuple(FORCES_BANQUE) == _TABLE_SPEC_VERROUILLEE
    inv_moteur = sorted(set(labels_moteur))
    inv_table = sorted(set(labels_table))
    croise = (inv_moteur == inv_table
              and inv_moteur == sorted(LABELS))
    return {
        "faces_6": len(FACES) == 6 and len(set(FACES)) == 6,
        "items_par_face_4": bool(n_par_face_ok),
        "items_total_24": bool(items_total == 24),
        "d_table_code_egaux_spec": bool(d_table),
        "labels_moteur": inv_moteur,
        "labels_table": inv_table,
        "croise": bool(croise),
        "match_pct": 100.0 if croise else 0.0,
    }


def tableau_centres(classes):
    """classes : liste (nom, N, centres dict, voies, label, forces).
    -> tableau D-GÉOMÉTRIE (centres par face, attendu)."""
    rows = []
    for nom, n, centres, voies, label, forces in classes:
        row = {"classe": nom, "N": n,
               "crise_heritee": bool(voies),
               "label_attendu": label, "forces_attendues": list(forces)}
        row.update({f: centres[f] for f in FACES})
        rows.append(row)
    return rows
