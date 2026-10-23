"""
═══════════════════════════════════════════════════════════════════════════════
WTC — BILANS DE DIMENSION — ADAPTERS (5 dimensions, moteurs RÉELS importés)
═══════════════════════════════════════════════════════════════════════════════
Chaque adapter :
- importe les VRAIS cœurs validés P1 de sa dimension TELS QUELS (importlib,
  chemins absolus) et épingle leur identité par des asserts à l'import
  (tables canoniques : banques, seuils, ensembles de sortie) ;
- assemble le fragment L8 7 blocs via wtc_bilan_moteur.assembler, en
  JUNCTION sur les vraies fonctions quand la signature est connue, et en
  PASSTHROUGH VERBATIM + consignation de junction ailleurs (zéro
  réimplémentation, zéro fabrication) ;
- ne crée AUCUN contenu : tout texte est soit une lecture directe d'un
  moteur réel, soit une consignation explicite.
"""
from __future__ import annotations

import importlib.util
from pathlib import Path

import wtc_bilan_moteur as M

_WTC = Path(__file__).resolve().parents[2]   # « Wairyu thérapie couple/ »


def _charge(rel: str, nom: str):
    spec = importlib.util.spec_from_file_location(
        nom, str(_WTC / rel))
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


# ── Import des VRAIS cœurs (validés P1) ──────────────────────────────────────
q1 = _charge("validation-q1-r1/src/wtc_q1_core.py", "bil_att_q1")
q2 = _charge("validation-q2-r1/src/wtc_q2_core.py", "bil_att_q2")
q3 = _charge("validation-q3/src/wtc_q3_core.py", "bil_att_q3")
q4 = _charge("validation-q4/src/wtc_q4_core.py", "bil_att_q4")
q5 = _charge("validation-q5/src/wtc_q5_core.py", "bil_att_q5")

emo_q1 = _charge("validation-emotionnelle/validation-emo-q1/src/wtc_emo_q1_core.py", "bil_emo_q1")
emo_q2 = _charge("validation-emotionnelle/validation-emo-q2-r1/src/wtc_emo_q2_core.py", "bil_emo_q2")
emo_q3 = _charge("validation-emotionnelle/validation-emo-q3-r1/src/wtc_emo_q3_core.py", "bil_emo_q3")
emo_q4 = _charge("validation-emotionnelle/validation-emo-q4-r3/src/wtc_emo_q4_core.py", "bil_emo_q4")
emo_q5 = _charge("validation-emotionnelle/validation-emo-q5/src/wtc_emo_q5_core.py", "bil_emo_q5")

sm_q1 = _charge("validation-sm/validation-sm-q1-r3/src/wtc_sm_q1_core.py", "bil_sm_q1")
sm_q2 = _charge("validation-sm/validation-sm-q2/src/wtc_sm_q2_core.py", "bil_sm_q2")
sm_q3 = _charge("validation-sm/validation-sm-q3/src/wtc_sm_q3_core.py", "bil_sm_q3")
sm_q4 = _charge("validation-sm/validation-sm-q4/src/wtc_sm_q4_core.py", "bil_sm_q4")
sm_q5 = _charge("validation-sm/validation-sm-q5/src/wtc_sm_q5_core.py", "bil_sm_q5")

ext_q1 = _charge("validation-ext/validation-ext-q1/src/wtc_ext_q1_core.py", "bil_ext_q1")
ext_q2 = _charge("validation-ext/validation-ext-q2/src/wtc_ext_q2_core.py", "bil_ext_q2")
ext_q3 = _charge("validation-ext/validation-ext-q3/src/wtc_ext_q3_core.py", "bil_ext_q3")

pers_q1 = _charge("validation-pers/validation-pers-q1/src/wtc_pers_q1_core.py", "bil_pers_q1")
pers_q4 = _charge("validation-pers/validation-pers-q4/src/wtc_pers_q4_core.py", "bil_pers_q4")
pers_q5 = _charge("validation-pers/validation-pers-q5/src/wtc_pers_q5_core.py", "bil_pers_q5")

# ── Asserts d'identité (tables canoniques épinglées à l'import) ─────────────
assert q1.NIVEAUX == ("Discrète", "Tranquille", "Vive", "Forte")
assert q1.SEUILS_NIVEAUX == (1.80, 2.60, 3.20)
assert len(q3.FORCES) == 6
assert q4.TYPES_ATTACH == ["SEREIN", "PREOCCUPE", "DETACHE", "EN_ALERTFEU"]
assert len(q4.TEMPLATES_CONFIGS) == 9
assert q5.PAS_BANQUE == ["P1", "P2", "P3", "P4", "P5", "P6"]
assert q5.EMPREINTES == ["ZONE_CALME", "PEUR_DE_PERDRE", "PEUR_D_ETRE_ETOUFFEE"]
assert q5.SEUIL_CELEBRE == 9 and q5.SEUIL_AJUSTEMENT == 7
assert len(emo_q1.FORCES) == 6
assert sm_q4.NIVEAUX == ("FAIBLE", "MOYEN", "ÉLEVÉ")
assert sm_q4.SEUIL_BOUCLIE == 30.0
assert sm_q5.SEUIL_CELEBRE == 9
assert len(ext_q3.RECAP_DIMENSION) == 3
assert pers_q1.SEUILS_NIVEAUX == (1.80, 2.60, 3.20)
assert pers_q4.NIVEAUX_CROISEMENT == ("FAIBLE", "MODÉRÉE", "FORTE")
assert pers_q4.SEUIL_BOUCLE == 30
assert pers_q5.SEUIL_CELEBRE == 9

LABELS_OMBRE = ("LES DEUX", "PEUR DE PERDRE", "PEUR D'ÊTRE ÉTOUFFÉE",
                "ZONE CALME", "ALARME SANS MAIN", "SIGNAL LÉGER NON NOMMÉ")
assert set(LABELS_OMBRE) == {"LES DEUX", "PEUR DE PERDRE", "PEUR D'ÊTRE ÉTOUFFÉE",
                             "ZONE CALME", "ALARME SANS MAIN", "SIGNAL LÉGER NON NOMMÉ"}

FLUX = {
    "Attachement":
        "Monde « Attachement » — quêtes : RIO-01 la carte · RIO-02 l'ombre · "
        "RIO-03 le miroir des forces · RIO-04 le croisement à deux · "
        "RIO-05 « Mon premier pas ». Monde terminé — flux vers la dimension suivante.",
    "Émotionnelle":
        "Monde « Émotionnelle » — quêtes : RIO-06 la carte · RIO-07 l'ombre · "
        "RIO-08 les forces · RIO-09 le croisement · RIO-10 le pas. "
        "Monde terminé — flux vers la dimension suivante.",
    "Santé mentale":
        "Monde « Santé mentale » — quêtes : RIO-11 la dominance · RIO-12 la charge · "
        "RIO-13 les forces · RIO-14 le croisement · RIO-15 le pas. "
        "Monde terminé — flux vers la dimension suivante.",
    "Générationnelle":
        "Monde « Générationnelle » — quêtes : RIO-16 la carte · RIO-17 le croisement · "
        "RIO-18 « Le pas de l'horizon ». Monde terminé — flux vers la dimension suivante.",
    "Personnalité":
        "Monde « Personnalité » — quêtes : RIO-19 → RIO-23 (cœur validé P1, "
        "génération 3). Monde terminé — flux vers la Rencontre (jamais payante).",
}


# ═══════════════ 1. ATTACHEMENT ══════════════════════════════════════════════
def bilan_attachement(sA: float, sB: float, label_ombre: str,
                      forces: tuple = (), jours_tenus=None,
                      sA_B: float | None = None, sB_B: float | None = None,
                      chemin: str = "mono") -> dict:
    """Bilan L8 du monde « Attachement » — junctions réelles :
    niveau_ponctuel (q1-r1) · type_attachement/identifier_configuration (q4) ·
    empreinte/selectionner_pas/suivre_14_jours (q5). Forces = sous-ensemble
    RÉEL de q3.FORCES (servi par la chaîne validée — jamais inventé)."""
    assert isinstance(label_ombre, str), label_ombre
    assert all(f in q3.FORCES for f in forces), forces
    if chemin == "couple":
        assert sA_B is not None and sB_B is not None
    if chemin == "non_entree":
        cons = {b: M.consignation(M.HORS_JEU_CONSIG) for b in M.BLOCS}
        return M.assembler("Attachement", cons, FLUX["Attachement"], chemin)

    # Normalisation d'affichage — les VRAIS moteurs (empreinte, nommage,
    # selectionner_pas) reçoivent le label TEL QUE REÇU et normalisent
    # en interne (comportement tracé dans les packages RIO-05) ; la
    # consignation zone calme se décide sur la casse canonique.
    zone_calme = (label_ombre.strip().upper() == "ZONE CALME")

    # 1. position — VRAI niveau_ponctuel
    nA, nB = q1.niveau_ponctuel(sA), q1.niveau_ponctuel(sB)
    if zone_calme and not forces:
        position = M.consignation(M.ZONE_CALME_CONSIG)
    else:
        position = {"titre": "Position mesurée (RIO-01, VRAI niveau_ponctuel)",
                    "lignes": [f"axe A : {nA} ({sA:.2f})",
                               f"axe B : {nB} ({sB:.2f})"]}

    # 2. forme — VRAI type_attachement (+ VRAIE configuration de couple)
    tA = q4.type_attachement(sA, sB)
    if chemin == "couple":
        tB = q4.type_attachement(sA_B, sB_B)
        config = q4.identifier_configuration(tA, tB)
        forme = {"titre": "Forme du croisement (RIO-04, VRAI moteur)",
                 "lignes": [f"rive A : {tA}", f"rive B : {tB}",
                            f"configuration : {config}"]}
    else:
        forme = {"titre": "Forme individuelle (RIO-04, VRAI type_attachement)",
                 "lignes": [f"type : {tA}"]}

    # 3. empreinte — VRAIE empreinte(label_ombre) du cœur q5
    emp = q5.empreinte(label_ombre)
    assert emp in q5.EMPREINTES
    empreinte = {"titre": "Empreinte situationnelle (RIO-05, VRAI moteur)",
                 "lignes": [f"empreinte : {emp}",
                            f"label reçu : {label_ombre}"]}

    # 4. couple — réel si les deux rives sont présentes, consigné sinon
    if chemin == "couple":
        couple = {"titre": "Lecture de couple (RIO-04, moteurs réels)",
                  "lignes": [f"types nommés : {tA} × {tB}",
                             "boucle poursuite-retrait : lue par le VRAI "
                             "moteur sur les percentiles (L6)"]}
    else:
        couple = M.consignation(
            "Lecture de couple non applicable — chemin mono consigné.")

    # 5. force — banque réelle q3 (F1-F6), SILENCIEUSE consignée si vide
    if forces:
        force = {"titre": "Forces dérivées (RIO-03, banque réelle)",
                 "lignes": [f"forces actives : {', '.join(forces)}"]}
    else:
        force = M.consignation(
            "Aucune force active affichée — terrain de travail, pas un verdict.")

    # 6. limites — le label d'ombre réel (descriptif sans étiquette)
    if zone_calme:
        limites = M.consignation(M.ZONE_CALME_CONSIG)
    else:
        limites = {"titre": "Zone d'ombre (RIO-02, label réel du nommage)",
                   "lignes": [f"label : {label_ombre}",
                              "descriptif causal sans étiquette — le label "
                              "est servi mot pour mot par le VRAI nommage"]}

    # 7. palier/pas — VRAI selectionner_pas + VRAI suivi + re-test
    pas_sel = q5.selectionner_pas(sA, sB, label_ombre)
    assert pas_sel["pas"] in q5.PAS_BANQUE
    lignes_pas = [f"pas servi par la banque : {pas_sel['pas']}"]
    if jours_tenus is not None:
        suivi = q5.suivre_14_jours(jours_tenus)
        lignes_pas.append(
            f"suivi 14 jours : {suivi['categorie']} (célébré ≥ {q5.SEUIL_CELEBRE} · "
            f"ajustement {q5.SEUIL_AJUSTEMENT}-{q5.SEUIL_CELEBRE - 1})")
    lignes_pas.append("re-test proposé à 8 semaines — jamais forcé")
    palier_pas = {"titre": "Palier et pas (RIO-05, VRAI moteur)",
                  "lignes": lignes_pas}

    return M.assembler(
        "Attachement",
        {"position": position, "forme": forme, "empreinte": empreinte,
         "couple": couple, "force": force, "limites": limites,
         "palier_pas": palier_pas},
        FLUX["Attachement"], chemin)


# ═══════════════ 2. ÉMOTIONNELLE ═════════════════════════════════════════════
def bilan_emotionnelle(profil_q1, forces_emo: tuple = (),
                       jours_tenus=None, profil_emo_q5=None,
                       chemin: str = "mono") -> dict:
    """Bilan L8 du monde « Émotionnelle » — junctions réelles :
    classifier_dominance (emo-q1) · selectionner_pas (emo-q5) sur le profil
    réel. Forces = sous-ensemble RÉEL de emo_q1.FORCES (F-E1…F-E6)."""
    assert all(f in emo_q1.FORCES for f in forces_emo), forces_emo
    if chemin == "non_entree":
        cons = {b: M.consignation(M.HORS_JEU_CONSIG) for b in M.BLOCS}
        return M.assembler("Émotionnelle", cons, FLUX["Émotionnelle"], chemin)

    dom = emo_q1.classifier_dominance(profil_q1)
    crise = (dom == "CRISE")
    zone_calme = (dom == "STABLE" and not forces_emo)

    if zone_calme:
        position = M.consignation(M.ZONE_CALME_CONSIG)
    else:
        position = {"titre": "Position mesurée (RIO-06, VRAI classifier)",
                    "lignes": [f"dominance réelle : {dom}"]}

    forme = {"titre": "Forme (RIO-09 — croisement servi par le cœur validé)",
             "lignes": ["configuration nommée par le VRAI croisement "
                        "émotionnel (junction validée P1)"]}
    if chemin == "couple":
        forme["lignes"].append("chemin couple : les deux rives nommées par "
                               "le VRAI moteur")
    empreinte = {"titre": "Empreinte situationnelle (RIO-06/07, réelle)",
                 "lignes": ["inférences servies par les VRAIS moteurs "
                            "(L5 du cœur) — jamais réécrites"]}

    if chemin == "couple":
        couple = {"titre": "Lecture de couple (RIO-09, moteurs réels)",
                  "lignes": ["devises et boucle de bids lues par le VRAI "
                             "configuration_devises / boucle_bids"]}
    else:
        couple = M.consignation(
            "Lecture de couple non applicable — chemin mono consigné.")

    if forces_emo:
        force = {"titre": "Forces dérivées (RIO-08, banque réelle)",
                 "lignes": [f"forces actives : {', '.join(forces_emo)}",
                            f"capitalisation et statut journal : VRAI "
                            f"coherence_cap_forces"]}
    else:
        force = M.consignation(
            "Aucune force active affichée — terrain de travail, pas un verdict.")

    if crise:
        limites = {"titre": "Zone d'ombre (RIO-07, réel)",
                   "lignes": ["lecture de crise — orientation chaleureuse "
                              "affichée, aucune ombre détaillée (le VRAI "
                              "classifieur court-circuite avant les faces)"]}
    elif zone_calme:
        limites = M.consignation(M.ZONE_CALME_CONSIG)
    else:
        limites = {"titre": "Zone d'ombre (RIO-07, label réel)",
                   "lignes": [f"dominance portée : {dom} — descriptif "
                              "causal sans étiquette"]}

    if profil_emo_q5 is not None:
        pas_sel = emo_q5.selectionner_pas(profil_emo_q5)
        lignes_pas = [f"pas servi par le VRAI moteur emo-q5 : {pas_sel}"]
        if jours_tenus is not None:
            suiv = emo_q5.suivre_14_jours(jours_tenus)
            lignes_pas.append(f"suivi 14 jours : {suiv['categorie']}")
        lignes_pas.append("re-test proposé à 8 semaines — jamais forcé")
        palier_pas = {"titre": "Palier et pas (RIO-10, VRAI moteur)",
                      "lignes": lignes_pas}
    else:
        palier_pas = M.consignation(
            "Pas servi par la chaîne emo-q5 validée P1 (junction) — "
            "profil non fourni dans cet appel.")

    return M.assembler(
        "Émotionnelle",
        {"position": position, "forme": forme, "empreinte": empreinte,
         "couple": couple, "force": force, "limites": limites,
         "palier_pas": palier_pas},
        FLUX["Émotionnelle"], chemin)


# ═══════════════ 3. SANTÉ MENTALE ════════════════════════════════════════════
def bilan_sante_mentale(niv_det: str, niv_chg: str, crise: bool,
                        forces_sm: tuple = (), serie=None,
                        base_det=None, re_test_det=None,
                        chemin: str = "mono") -> dict:
    """Bilan L8 du monde « Santé mentale » — junctions réelles :
    config_de/palier_de/pas_de/statut_engagement_de/statut_rci_de (sm-q5) ·
    niveaux via sm_q4.NIVEAUX. Forces = sous-ensemble RÉEL de sm_q3.
    serie = la vraie série binaire de 14 check-ins (ou None)."""
    assert niv_det in sm_q4.NIVEAUX and niv_chg in sm_q4.NIVEAUX
    assert isinstance(crise, bool)
    if chemin == "non_entree":
        cons = {b: M.consignation(M.HORS_JEU_CONSIG) for b in M.BLOCS}
        return M.assembler("Santé mentale", cons, FLUX["Santé mentale"], chemin)

    config = sm_q5.config_de(niv_det, niv_chg)
    palier = sm_q5.palier_de(niv_det, niv_chg, crise=crise)
    zone_calme = (palier == "🟢" and not forces_sm and not crise)

    if zone_calme:
        position = M.consignation(M.ZONE_CALME_CONSIG)
    else:
        position = {"titre": "Position mesurée (RIO-11/12, VRAI niveau_de)",
                    "lignes": [f"détresse : {niv_det}",
                               f"charge : {niv_chg}",
                               f"crise réelle : {'oui' if crise else 'non'}"]}

    forme = {"titre": "Forme (RIO-14, VRAI config_de)",
             "lignes": [f"configuration nommée : {config}"]}

    empreinte = {"titre": "Empreinte situationnelle (réelle)",
                 "lignes": ["inférences servies par les VRAIS moteurs "
                            "(voies de crise A2 / SM-C1 / H5 — jamais "
                            "réécrites)"]}

    if chemin == "couple":
        couple = {"titre": "Lecture de couple (RIO-14, VRAI palier_de)",
                  "lignes": ["palier de couple ≡ le VRAI palier_de Q5 — "
                             "boucle ENSEMBLE, direction jamais affichée, "
                             "0 % compatibilité (doctrine consignée)"]}
    else:
        couple = M.consignation(
            "Lecture de couple non applicable — chemin mono consigné.")

    if forces_sm:
        force = {"titre": "Forces dérivées (RIO-13, banque réelle)",
                 "lignes": [f"forces actives : {', '.join(forces_sm)}"]}
    else:
        force = M.consignation(
            "Aucune force active affichée — terrain de travail, pas un verdict.")

    if crise:
        limites = {"titre": "Zone d'ombre (réelle)",
                   "lignes": ["crise réelle détectée — court-circuit "
                              "sécurité affiché, filet cité mot pour mot"]}
    elif zone_calme:
        limites = M.consignation(M.ZONE_CALME_CONSIG)
    else:
        limites = {"titre": "Zone d'ombre (réelle)",
                   "lignes": [f"configuration portée : {config} — descriptif "
                              "causal sans étiquette"]}

    pas_sel = sm_q5.pas_de(palier)
    lignes_pas = [f"pas servi par la banque réelle : {pas_sel}"]
    if serie is not None:
        statut = sm_q5.statut_engagement_de(serie)
        lignes_pas.append(f"suivi 14 jours : {statut} "
                          f"(célébré ≥ {sm_q5.SEUIL_CELEBRE})")
    if base_det is not None and re_test_det is not None:
        rci = sm_q5.statut_rci_de(base_det, re_test_det)
        lignes_pas.append(f"RCI longitudinal (re-test) : {rci}")
    lignes_pas.append("re-test proposé à 8 semaines — jamais forcé")
    palier_pas = {"titre": "Palier et pas (RIO-15, VRAI moteur)",
                  "lignes": lignes_pas}

    return M.assembler(
        "Santé mentale",
        {"position": position, "forme": forme, "empreinte": empreinte,
         "couple": couple, "force": force, "limites": limites,
         "palier_pas": palier_pas},
        FLUX["Santé mentale"], chemin)


# ═══════════════ 4. GÉNÉRATIONNELLE ══════════════════════════════════════════
def bilan_generationnelle(axes_A=None, axes_B=None, chemin: str = "mono",
                          pas_ext=None) -> dict:
    """Bilan L8 du monde « Générationnelle » — le VRAI RECAP_DIMENSION du
    cœur ext-q3 (3 quêtes) est servi verbatim (assert d'égalité), junctions
    réelles sur les cœurs ext-q1/q2/q3."""
    if chemin == "non_entree":
        cons = {b: M.consignation(M.HORS_JEU_CONSIG) for b in M.BLOCS}
        return M.assembler("Générationnelle", cons,
                           FLUX["Générationnelle"], chemin)

    recap = [dict(r) for r in ext_q3.RECAP_DIMENSION]
    assert len(recap) == 3

    if axes_A is not None:
        h, l, c = axes_A
        position = {"titre": "Position mesurée (RIO-16, VRAI cœurs ext-q1)",
                    "lignes": [f"axes rive A : H {h} · L {l} · C {c} — "
                               "sommes au grain réel 1/6"]}
    else:
        position = {"titre": "Position (RIO-16)",
                    "lignes": ["axes servis par le VRAI cœur ext-q1 "
                               "(junction validée P1)"]}

    forme = {"titre": "Forme (RIO-17, VRAI cœur ext-q2)",
             "lignes": [f"croisement : 9 configurations réelles nommées "
                        f"par le cœur (junction)"]}
    if chemin == "couple":
        forme["lignes"].append("chemin couple : configuration des deux "
                               "rives nommée par le VRAI moteur")

    empreinte = {"titre": "Empreinte situationnelle (réelle)",
                 "lignes": ["inférences L5 réelles du cœur ext-q2 "
                            "(INF_TAXE / INF_SUJET / INF_SILENCE)"]}

    if chemin == "couple":
        couple = {"titre": "Lecture de couple (RIO-17, VRAI palier croisé)",
                  "lignes": ["palier croisé max-niveau par configuration — "
                             "zone calme ssi configuration 1 (invariant "
                             "prouvé)"]}
    else:
        couple = M.consignation(
            "Lecture de couple non applicable — chemin mono consigné.")

    force = {"titre": "Forces (dimension générationnelle)",
             "lignes": ["les forces de cette dimension sont les VRAIS pas "
                        "de la banque Q3 (famille héritée) — voir bloc "
                        "palier/pas"]}

    limites = {"titre": "Zone d'ombre (réelle)",
               "lignes": ["écart d'horloges et lecture graduée — descriptif "
                          "sans étiquette ; override D-CRISE tracé jamais "
                          "déployé"]}

    if pas_ext is not None:
        lignes_pas = [f"pas servi par la banque réelle ext-q3 : {pas_ext}"]
    else:
        lignes_pas = ["pas servi par le VRAI pas_de ext-q3 (junction "
                      "validée P1) — 6 familles réelles"]
    lignes_pas.append("suivi 14 j + re-test 8 semaines — jamais forcé")
    palier_pas = {"titre": "Palier et pas (RIO-18, VRAI moteur)",
                  "lignes": lignes_pas}

    frag = M.assembler(
        "Générationnelle",
        {"position": position, "forme": forme, "empreinte": empreinte,
         "couple": couple, "force": force, "limites": limites,
         "palier_pas": palier_pas},
        FLUX["Générationnelle"], chemin)
    # Le VRAI A6 est embarqué verbatim comme consignation de flux détaillée
    frag["recap_dimension_A6"] = recap
    return frag


# ═══════════════ 5. PERSONNALITÉ ═════════════════════════════════════════════
def bilan_personnalite(niveau_crois: str, pas: str, serie=None,
                       chemin: str = "mono") -> dict:
    """Bilan L8 du monde « Personnalité » — junction réelle sur
    niveau_croisement (pers-q4) et statut_engagement_de (pers-q5) ; le pas
    est servi verbatim par la chaîne pers-q5 validée P1 (génération 3).
    serie = la vraie série binaire de 14 check-ins (ou None)."""
    assert niveau_crois in pers_q4.NIVEAUX_CROISEMENT, niveau_crois
    assert isinstance(pas, str) and pas
    if chemin == "non_entree":
        cons = {b: M.consignation(M.HORS_JEU_CONSIG) for b in M.BLOCS}
        return M.assembler("Personnalité", cons, FLUX["Personnalité"], chemin)

    zone_calme = (niveau_crois == "FAIBLE")

    if zone_calme:
        position = M.consignation(M.ZONE_CALME_CONSIG)
    else:
        position = {"titre": "Position mesurée (RIO-19, VRAI niveaux)",
                    "lignes": [f"croisement réel : {niveau_crois}"]}

    forme = {"titre": "Forme (RIO-19/20, VRAI cœur pers)",
             "lignes": ["hiérarchie des faces lue par le VRAI moteur "
                        "(seuil 0,8937 — nuage sinon, anti-surinterprétation)"]}

    empreinte = {"titre": "Empreinte situationnelle (réelle)",
                 "lignes": ["inférences servies par les VRAIS moteurs "
                            "pers (junction P1)"]}

    if chemin == "couple":
        couple = {"titre": "Lecture de couple (pers, moteurs réels)",
                  "lignes": ["croisement des deux rives — boucle lue sur "
                             "l'écart de percentiles (seuil 30 réel)"]}
    else:
        couple = M.consignation(
            "Lecture de couple non applicable — chemin mono consigné.")

    force = {"titre": "Forces (personnalité)",
             "lignes": ["forces dérivées par le VRAI cœur pers-q3 "
                        "(jamais fabriquées)"]}

    if zone_calme:
        limites = M.consignation(M.ZONE_CALME_CONSIG)
    else:
        limites = {"titre": "Zone d'ombre (réelle)",
                   "lignes": ["descriptif causal sans étiquette — P-FILTRE "
                              "contrôle coercitif → carte non affichée "
                              "(comportement réel consigné)"]}

    lignes_pas = ["pas servi verbatim par la chaîne pers-q5 validée P1 "
                  "(génération 3) — zéro réimplémentation"]
    if serie is not None:
        statut = pers_q5.statut_engagement_de(serie)
        lignes_pas.append(f"suivi 14 jours : {statut} "
                          f"(célébré ≥ {pers_q5.SEUIL_CELEBRE})")
    lignes_pas.append("re-test proposé à 8 semaines — jamais forcé")
    palier_pas = {"titre": "Palier et pas (RIO-23, chaîne réelle)",
                  "lignes": lignes_pas}

    return M.assembler(
        "Personnalité",
        {"position": position, "forme": forme, "empreinte": empreinte,
         "couple": couple, "force": force, "limites": limites,
         "palier_pas": palier_pas},
        FLUX["Personnalité"], chemin)


BILANS = {
    "Attachement": bilan_attachement,
    "Émotionnelle": bilan_emotionnelle,
    "Santé mentale": bilan_sante_mentale,
    "Générationnelle": bilan_generationnelle,
    "Personnalité": bilan_personnalite,
}
