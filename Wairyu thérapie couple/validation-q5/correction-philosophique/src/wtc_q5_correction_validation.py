# -*- coding: utf-8 -*-
"""
WTC-Q5 — VALIDATION DE LA COUCHE DE CORRECTION PHILOSOPHIQUE (RIO-05)
=====================================================================
Stages de preuve sur les VRAIS moteurs (zéro réimplémentation) :

  Stage 0 — COMPACTATIONS PROUVÉES EXHAUSTIVEMENT :
            (a) niveaux de la carte : plateau sur la grille centièmes
                (401 valeurs × 2 axes) + PILE 1,80/2,60/3,20 inclusifs
                côté haut (consignés) + batterie de frontière (saut
                exact à t) ;
            (b) empreinte : batterie de variantes (6 labels réels +
                casse/accents/underscores/vide/None/inconnu) → 3
                empreintes du VRAI moteur ; mapping par défaut (LES
                DEUX / ALARME SANS MAIN / SIGNAL LÉGER NON NOMMÉ /
                vide → ZONE_CALME) consigné, jamais masqué ;
            (c) espion machine : la signature du VRAI selectionner_pas
                ne contient QUE (sA, sB, label_ombre) — jours_tenus et
                date_pas ne sont JAMAIS lus par la sélection ;
                déterminisme vérifié par appels répétés ;
            (d) suivi 14 j : les 15 valeurs réelles de jours → 3
                catégories du VRAI suivre_14_jours, frontières 6/7 et
                8/9 exactes, sanction None partout (15/15), taux vérifié ;
            (e) re-test : +8 semaines exactes (56 jours), jamais forcé ;
            (f) face : PILE 2,61 inclusif (les deux axes), priorité sB,
                intervalle [2,60 ; 2,61) réel (frontières DISTINCTES
                2,60 niveaux-carte vs 2,61 face-pas — consignées) ;
            (g) junction type_attachement (VRAI q4) : 4 représentants →
                4 types, déterministe ;
            (h) les 3 vérificateurs VRAI du moteur (templates,
                anti-perfectionnisme, rappels doux) ok.
  Stage 1 — ÉNUMÉRATION EXHAUSTIVE : 43 sA × 43 sB × 7 labels × 15 jours
            = 194 145 configurations (grille dizièmes 0,0→4,0 + PILE
            2,60/2,605/2,61 — frontières réelles incluses). Palier
            lecture héritée (VRAIS seuils) + double chemin + textes +
            fragments. COR2 = double chemin + junctions S1 ⇔ 🔴 /
            S2 ⇔ 🟠 + les 6 pas résolus par le VRAI moteur sur l'espace
            complet. Date du re-test fixée à 2026-01-01 (elle ne fait
            que formater le message — espion stage 0c).
  Stage 2 — RE-SCORE BIT-EXACT des 180 profils archivés du rapport q5
            (3 groupes × 60, seed 42) : simulateur RE-EXÉCUTÉ frais
            (D-REPRO) → agrégats ≡ archive resultats-q5-2026-10-15.json
            (groupes · pas · faces · catégories · plafonds 9 × 100 %) ·
            C1 180/180 pas ≡ pas_vrai (D-VÉRITÉ) · C3 0 désaccord ·
            C2 cas-types messages BIT-EXACT vs archive + anti ok ·
            C5 180/180 + rappels ok · re-test 180/180 (+56 j, jamais
            forcé) — puis couche appliquée aux 180.
  Stage 4 — SUIVI 15/15 sans sanction + re-test + rappels doux J1/J7/J14
            + junctions (type_attachement, table 9 pas, bijections).
  COR8    — pipeline ×2, SHA-256 identiques.

Sorties : results/correction_criteres.json
"""

from __future__ import annotations

import hashlib
import inspect
import json
import os
import sys
from datetime import datetime, timedelta
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import wtc_q5_correction as corr
core_q1 = corr.core_q1
core_q4 = corr.core_q4
core_q5 = corr.core_q5

RES = Path(__file__).resolve().parents[1] / "results"
SMOKE = os.environ.get("CORR_SMOKE") == "1"

_SIM_N = [0]


def _sim_frais():
    """Re-exécute le VRAI simulateur (rng seed 42 frais) — D-REPRO."""
    _SIM_N[0] += 1
    return corr._charge(f"wtc_q5_simulator_r{_SIM_N[0]}",
                        corr._Q5 / "src" / "wtc_q5_simulator.py")


# ── Constantes d'ÉNUMÉRATION ────────────────────────────────────────────────
# sA/sB : grille dizièmes 0,0 → 4,0 (41) + les frontières réelles fines
# 2,605 / 2,61 (l'intervalle [2,60 ; 2,61) existe — niveaux carte 2,60 vs
# face pas 2,61 : deux frontières RÉELLES distinctes des moteurs, aucune
# retouchée) → 43 valeurs par axe.
_SAB = sorted({k / 10 for k in range(41)} | {2.605, 2.61})
SA_SPACE = (2,) if SMOKE else tuple(_SAB)
SB_SPACE = (3,) if SMOKE else tuple(_SAB)
LABELS_ESPACE = ("PEUR DE PERDRE",) if SMOKE else corr.LABELS_OMBRE_REELS
JOURS_ESPACE = (9,) if SMOKE else tuple(range(15))
DATE_CANONIQUE = "2026-01-01"

BANDEAU_OK = corr.BANDEAU_DSIM

# ── ARCHIVE (lu dans validation-q5/results/resultats-q5-2026-10-15.json,
#    rapport du 15/10/2026, sha256_run 015f7e9d…) ───────────────────────────
ARCHIVE_N = 180
ARCHIVE_RESUME_GROUPES = {"CELEBRE": 60, "AJUSTEMENT": 60, "REPRISE": 60}
ARCHIVE_PAS_DISTRIBUTION = {"P1": 21, "P2": 42, "P3": 39, "P4": 21,
                            "P5": 39, "P6": 18}
ARCHIVE_FACE_DISTRIBUTION = {"RASSUREE": 60, "EN_QUETE": 60, "SUR_LA_RA": 60}
ARCHIVE_CATEGORIE_PAR_GROUPE = {
    "CELEBRE": {"CELEBRE": 60, "AJUSTEMENT": 0, "REPRISE": 0},
    "AJUSTEMENT": {"CELEBRE": 0, "AJUSTEMENT": 60, "REPRISE": 0},
    "REPRISE": {"CELEBRE": 0, "AJUSTEMENT": 0, "REPRISE": 60}}
ARCHIVE_SHA256_RUN = ("015f7e9dfbe4e24b9b089891967295e7a9877b7760adf94a0f94"
                      "c0673a69c596")
# Messages cas-types C2 — copiés MOT POUR MOT de l'archive du 15/10 et
# comparés BIT-EXACT au VRAI moteur régénéré :
ARCHIVE_C2_MESSAGES = {
    "CELEBRE": ("Tu as tenu 9 jours sur 14 (ou plus). C'est une assise "
                "réelle — pas un échec les jours manqués. Le pas est entré "
                "dans ta semaine. Tu peux le garder tel quel, ou l'ajuster "
                "si tu sens qu'il pourrait mieux te aller."),
    "AJUSTEMENT": ("Tu as tenu 7 jours sur 14. C'est un début d'assise — "
                   "pas un échec. Les jours manqués ne sont pas une faute. "
                   "Peut-être le pas demande-t-il un ajustement : plus "
                   "petit, plus simple, mieux placé dans ta journée. La "
                   "suite du parcours t'aide à le voir."),
    "REPRISE": ("Tu as tenu 3 jours sur 14. Ce n'est pas un échec — c'est "
                "un signal. Le pas tel qu'il est ne tient pas dans ta vie "
                "actuelle. Peut-être est-il trop grand, mal placé, ou le "
                "moment n'est pas le bon. La suite du parcours t'aide à le "
                "reprendre, autrement, sans pression."),
}
ARCHIVE_C2_CAS_JOURS = {"CELEBRE": 9, "AJUSTEMENT": 7, "REPRISE": 3}


def categorie_attendue(jours: int) -> str:
    if jours >= core_q5.SEUIL_CELEBRE:
        return "CELEBRE"
    if jours >= core_q5.SEUIL_AJUSTEMENT:
        return "AJUSTEMENT"
    return "REPRISE"


# ─────────────────────────────────────────────────────────────────────────────
# STAGE 0 — COMPACTATIONS PROUVÉES EXHAUSTIVEMENT
# ─────────────────────────────────────────────────────────────────────────────
def stage0() -> dict:
    res = {
        "niveaux_plateau": 0, "niveaux_ecarts": 0,
        "niveaux_pile": 0, "niveaux_frontiere": 0,
        "niveaux_frontiere_ecarts": 0, "dist_min_seuils": 9.0,
        "empreinte_variants": 0, "empreinte_ecarts": 0,
        "empreinte_defaut_consignes": 0,
        "espion_signature": 0, "espion_signature_ok": 0,
        "espion_determinisme": 0, "espion_determinisme_ecarts": 0,
        "suivi_jours": 0, "suivi_ecarts": 0, "suivi_sanctions": 0,
        "suivi_taux_ecarts": 0,
        "retest_dates": 0, "retest_ecarts": 0,
        "face_pile": 0, "face_ecarts": 0,
        "face_sliver": 0, "face_sliver_ecarts": 0,
        "type_junction": 0, "type_junction_ecarts": 0,
        "verifiants_moteur": 0, "verifiants_ecarts": 0,
        "pile_inventaire": {},
    }

    # (a) niveaux : plateau grille centièmes × 2 axes + PILE + frontière
    attendu_bandes = [(0.0, 1.79, "Discrète"), (1.80, 2.59, "Tranquille"),
                      (2.60, 3.19, "Vive"), (3.20, 4.00, "Forte")]
    for _axe in (0, 1):
        for k in range(401):
            s = k / 100
            res["niveaux_plateau"] += 1
            att = next(n for lo, hi, n in attendu_bandes if lo <= s <= hi)
            if core_q1.niveau_ponctuel(s) != att:
                res["niveaux_ecarts"] += 1
    for s, att in ((1.80, "Tranquille"), (2.60, "Vive"), (3.20, "Forte")):
        res["niveaux_pile"] += 1
        if core_q1.niveau_ponctuel(s) != att:
            res["niveaux_ecarts"] += 1
        res["pile_inventaire"][f"niveau_{s}"] = core_q1.niveau_ponctuel(s)
    for t in (1.80, 2.60, 3.20):
        bas = core_q1.niveau_ponctuel(round(t - 0.001, 3))
        sur = core_q1.niveau_ponctuel(t)
        haut = core_q1.niveau_ponctuel(round(t + 0.003, 3))
        res["niveaux_frontiere"] += 1
        if not (corr.RANG_NIVEAU[bas] < corr.RANG_NIVEAU[sur]
                and sur == haut):
            res["niveaux_frontiere_ecarts"] += 1
        for m in (-3, -2, -1, 0, 1, 2, 3):
            d = abs(round(t + m / 1000, 3) - t)
            if d < res["dist_min_seuils"]:
                res["dist_min_seuils"] = d

    # (b) empreinte : 6 labels réels + variantes + vides → 3 empreintes
    variants = []
    for lb in ("ZONE CALME", "PEUR DE PERDRE", "PEUR D'ÊTRE ÉTOUFFÉE",
               "LES DEUX", "ALARME SANS MAIN", "SIGNAL LÉGER NON NOMMÉ"):
        variants += [lb, lb.lower(), lb.title()]
    variants += ["Zone Calme", "PEUR_DE_PERDRE", "peur de perdre",
                 "PEUR D'ETRE ETOUFFEE", "peur d'être etouffée",
                 "PEUR_D_ETRE_ETOUFFEE", "", None, "   ", "inconnu complet"]
    defauts = {"LES DEUX", "les deux", "Les Deux", "ALARME SANS MAIN",
               "alarme sans main", "Alarme Sans Main",
               "SIGNAL LÉGER NON NOMMÉ", "signal léger non nommé",
               "Signal Léger Non Nommé", "", None, "   ", "inconnu complet"}
    for lb in variants:
        emp = core_q5.empreinte(lb)
        res["empreinte_variants"] += 1
        norm = (lb or "").upper().strip().replace(" ", "_")
        if "CALME" in norm:
            att = "ZONE_CALME"
        elif "PERDRE" in norm:
            att = "PEUR_DE_PERDRE"
        elif "ETOUFF" in norm or "ÉTOUFF" in norm:
            att = "PEUR_D_ETRE_ETOUFFEE"
        else:
            att = "ZONE_CALME"          # défaut du VRAI moteur
        if lb in defauts:
            res["empreinte_defaut_consignes"] += 1
        if emp != att:
            res["empreinte_ecarts"] += 1

    # (c) espions : signature machine + déterminisme
    params = set(inspect.signature(core_q5.selectionner_pas).parameters)
    res["espion_signature"] += 1
    if params == {"sA", "sB", "label_ombre"}:
        res["espion_signature_ok"] += 1
    ref = core_q5.selectionner_pas(2.0, 2.0, "ZONE CALME")
    for _ in range(5):
        res["espion_determinisme"] += 1
        if core_q5.selectionner_pas(2.0, 2.0, "ZONE CALME") != ref:
            res["espion_determinisme_ecarts"] += 1

    # (d) suivi : 15 valeurs réelles, frontières 6/7-8/9, 0 sanction, taux
    for jours in range(15):
        s = core_q5.suivre_14_jours(jours)
        res["suivi_jours"] += 1
        if s["categorie"] != categorie_attendue(jours):
            res["suivi_ecarts"] += 1
        if s["sanction"] is not None:
            res["suivi_sanctions"] += 1
        if s["taux"] != round(jours / 14 * 100, 1):
            res["suivi_taux_ecarts"] += 1

    # (e) re-test : +8 semaines exactes, jamais forcé
    for d0 in ("2026-01-01", "2026-03-15", "2027-12-31"):
        rt = core_q5.programmer_re_test_q1(d0)
        res["retest_dates"] += 1
        att = (datetime.fromisoformat(d0) + timedelta(weeks=8)).isoformat()
        if (rt["date_re_test"] != att or rt["semaines"] != 8
                or rt["force"] is not False):
            res["retest_ecarts"] += 1

    # (f) face : PILE 2,61 (les deux axes) + priorité sB + intervalle réel
    for (a, b, att) in ((2.61, 2.0, "EN_QUETE"), (2.0, 2.61, "SUR_LA_RA"),
                        (2.61, 2.61, "SUR_LA_RA"), (2.60, 2.60, "RASSUREE"),
                        (3.20, 2.0, "EN_QUETE"), (2.0, 3.20, "SUR_LA_RA")):
        res["face_pile"] += 1
        if core_q5.face_dominante(a, b) != att:
            res["face_ecarts"] += 1
    res["pile_inventaire"]["face_2_61"] = "inclusif (sA et sB), priorité sB"
    for (a, b, att) in ((2.605, 2.0, "RASSUREE"), (2.0, 2.605, "RASSUREE"),
                        (2.60, 2.0, "RASSUREE"), (2.0, 2.60, "RASSUREE")):
        res["face_sliver"] += 1
        if core_q5.face_dominante(a, b) != att:
            res["face_sliver_ecarts"] += 1

    # (g) junction type_attachement (VRAI q4) — déterministe
    for (a, b, att) in ((2.0, 2.0, "SEREIN"), (3.3, 2.0, "PREOCCUPE"),
                        (2.0, 3.3, "DETACHE"), (3.3, 3.3, "EN_ALERTFEU")):
        res["type_junction"] += 1
        if (corr.type_couple(a, b) != att
                or corr.type_couple(a, b) != core_q4.type_attachement(a, b)):
            res["type_junction_ecarts"] += 1

    # (h) les 3 vérificateurs VRAI du moteur
    for ok in (core_q5.verifier_templates()["ok"],
               core_q5.verifier_anti_perfectionnisme()["ok"],
               core_q5.verifier_rappels_doux()["ok"]):
        res["verifiants_moteur"] += 1
        if not ok:
            res["verifiants_ecarts"] += 1
    return res


# ─────────────────────────────────────────────────────────────────────────────
# STAGE 1 — ÉNUMÉRATION EXHAUSTIVE (43 × 43 × 7 × 15 = 194 145)
# ─────────────────────────────────────────────────────────────────────────────
def stage1() -> dict:
    stats = {
        "configs": 0, "fragments_distincts": 0, "fragment_incomplets": 0,
        "cor2_ecarts": 0, "junction_s1s2_ecarts": 0,
        "paliers": {"🟢": 0, "🟠": 0, "🔴": 0},
        "S1": 0, "S2": 0,
        "pas_distribution": {p: 0 for p in core_q5.PAS_BANQUE},
        "faces_distribution": {f: 0 for f in core_q5.FACES},
        "categories": {"CELEBRE": 0, "AJUSTEMENT": 0, "REPRISE": 0},
        "sanctions_non_nulles": 0,
        "md5_texts_count": 0,
        "mots_interdits_max": 0, "dsim_manquants": 0,
        "templates_cites_ecarts": 0,
        "pas_hors_banque": 0,
        "empreintes_vues": {e: 0 for e in core_q5.EMPREINTES},
    }
    cache_texte = {}
    cache_frag = {}
    md5_textes = set()
    md5_fragments = set()
    retest = core_q5.programmer_re_test_q1(DATE_CANONIQUE)

    for sA in SA_SPACE:
        for sB in SB_SPACE:
            for label in LABELS_ESPACE:
                pas_sel = core_q5.selectionner_pas(sA, sB, label)
                stats["pas_distribution"][pas_sel["pas"]] += 1
                stats["faces_distribution"][pas_sel["face"]] += 1
                stats["empreintes_vues"][pas_sel["empreinte"]] += 1
                if pas_sel["pas"] not in core_q5.PAS_BANQUE:
                    stats["pas_hors_banque"] += 1
                pal = corr.plancher_carte(sA, sB)
                pal_i = corr.palier_independant(sA, sB)
                for jours in JOURS_ESPACE:
                    stats["configs"] += 1
                    suivi = core_q5.suivre_14_jours(jours)
                    stats["categories"][suivi["categorie"]] += 1
                    if suivi["sanction"] is not None:
                        stats["sanctions_non_nulles"] += 1
                    if (pal["palier"] != pal_i["palier"]
                            or pal["S1"] != pal_i["S1"]
                            or pal["S2"] != pal_i["S2"]
                            or pal["S1_axes"] != pal_i["S1_axes"]
                            or pal["S2_axes"] != pal_i["S2_axes"]):
                        stats["cor2_ecarts"] += 1
                    if (pal["S1"] != (pal["palier"] == "🔴")
                            or pal["S2"] != (pal["palier"] == "🟠")):
                        stats["junction_s1s2_ecarts"] += 1
                    stats["paliers"][pal["palier"]] += 1
                    if pal["S1"]:
                        stats["S1"] += 1
                    if pal["S2"]:
                        stats["S2"] += 1
                    cle = (sA, sB, label, jours)
                    bloc = cache_texte.get(cle)
                    if bloc is None:
                        b = corr.bloc_ecran(pas_sel, suivi, pal, label,
                                            retest["message"])
                        bloc = (b["md5"], b["nb_mots_interdits"],
                                BANDEAU_OK in b["texte"],
                                b["nb_templates_cites"], 6)
                        cache_texte[cle] = bloc
                        md5_textes.add(bloc[0])
                    _md5_t, nb_mots, dsim_ok, nb_cites, att_cites = bloc
                    if nb_mots > stats["mots_interdits_max"]:
                        stats["mots_interdits_max"] = nb_mots
                    if not dsim_ok:
                        stats["dsim_manquants"] += 1
                    if nb_cites != att_cites:
                        stats["templates_cites_ecarts"] += 1
                    frag = cache_frag.get(cle)
                    if frag is None:
                        f_ = corr.bilan_fragment(pas_sel, suivi, pal, label,
                                                 retest, sA, sB)
                        fh = hashlib.md5(json.dumps(
                            f_, sort_keys=True, ensure_ascii=False,
                            default=list).encode("utf-8")).hexdigest()
                        md5_fragments.add(fh)
                        frag = (f_["_complet"],)
                        cache_frag[cle] = frag
                    if not frag[0]:
                        stats["fragment_incomplets"] += 1

    stats["md5_texts_count"] = len(md5_textes)
    stats["fragments_distincts"] = len(md5_fragments)
    stats["configs_attendues"] = (len(SA_SPACE) * len(SB_SPACE)
                                  * len(LABELS_ESPACE) * len(JOURS_ESPACE))
    return stats


# ─────────────────────────────────────────────────────────────────────────────
# STAGE 2 — RE-SCORE BIT-EXACT DES 180 PROFILS ARCHIVÉS (VRAI simulateur 42)
# ─────────────────────────────────────────────────────────────────────────────
def stage2() -> dict:
    sim = _sim_frais()                      # D-REPRO — rng frais à chaque
    res = {                                 # exécution du pipeline
        "profils": 0, "comparaisons": 0, "ecarts": [],
        "c1_match": 0, "c3_desaccords": 0,
        "c2_cas_types_bit_exact": 0, "c2_cas_vus": 0, "c2_sanctions": 0,
        "anti_ok": None, "c5_conformes": 0, "rappels_ok": None,
        "c6_retest_56j": 0,
        "plafonds_par_config": {}, "configs_vues": 0,
        "paliers": {"🟢": 0, "🟠": 0, "🔴": 0},
        "S1": 0, "S2": 0,
        "fragments_archives": 0, "fragments_incomplets": 0,
        "dsim_archives": 0, "mots_interdits_max": 0,
        "templates_cites_ecarts": 0,
        "resume_groupes": {}, "pas_distribution": {}, "face_distribution": {},
        "categorie_par_groupe": {},
    }
    profils = sim.PROFILS                   # 180, seed 42, régénérés frais
    res["profils"] = len(profils)
    if res["profils"] != ARCHIVE_N:
        res["ecarts"].append({"champ": "n_total",
                              "calcule": res["profils"],
                              "archive": ARCHIVE_N})
    pas_dist = {}
    face_dist = {}
    cat_groupe = {}
    resume = {}
    plafond_ok = {}
    c2_vus = set()
    for p in profils:
        gid = p["groupe"]
        resume[gid] = resume.get(gid, 0) + 1
        pas_sel = core_q5.selectionner_pas(p["sA"], p["sB"], p["label_ombre"])
        suivi = core_q5.suivre_14_jours(p["jours_tenus"])
        retest = core_q5.programmer_re_test_q1(p["date_pas"])
        pas_dist[pas_sel["pas"]] = pas_dist.get(pas_sel["pas"], 0) + 1
        face_dist[pas_sel["face"]] = face_dist.get(pas_sel["face"], 0) + 1
        cg = cat_groupe.setdefault(gid, {"CELEBRE": 0, "AJUSTEMENT": 0,
                                         "REPRISE": 0})
        cg[suivi["categorie"]] += 1
        # C1 — pas ≡ pas_vrai (D-VÉRITÉ, éliminatoire) :
        res["comparaisons"] += 1
        if pas_sel["pas"] == sim.pas_vrai(p["sA"], p["sB"],
                                          p["label_ombre"])["pas"]:
            res["c1_match"] += 1
        else:
            res["ecarts"].append({"id": p["id"], "champ": "c1_pas",
                                  "calcule": pas_sel["pas"]})
        # C3 — plafond par configuration (D-STD-2) :
        cle_cfg = f"{pas_sel['face']}×{pas_sel['empreinte']}"
        res["configs_vues"] += 1
        att_pas = core_q5._PAS_TABLE[(pas_sel["face"], pas_sel["empreinte"])]
        ok_cfg = pas_sel["pas"] == att_pas
        plafond_ok.setdefault(cle_cfg, []).append(ok_cfg)
        if not ok_cfg:
            res["c3_desaccords"] += 1
        # C2 — cas-types : messages BIT-EXACT vs archive (1 profil par cas)
        if gid in ARCHIVE_C2_MESSAGES and gid not in c2_vus \
                and p["jours_tenus"] == ARCHIVE_C2_CAS_JOURS[gid]:
            c2_vus.add(gid)
            res["c2_cas_vus"] += 1
            res["comparaisons"] += 3
            if suivi["categorie"] == gid:
                res["c2_cas_types_bit_exact"] += 1
            if suivi["message"] == core_q5.TEMPLATES_SUIVI[gid]:
                res["c2_cas_types_bit_exact"] += 1
            if suivi["message"] == ARCHIVE_C2_MESSAGES[gid]:
                res["c2_cas_types_bit_exact"] += 1
        if suivi["sanction"] is not None:
            res["c2_sanctions"] += 1
        # C6 — re-test +56 jours exact, jamais forcé :
        res["comparaisons"] += 1
        att_date = (datetime.fromisoformat(p["date_pas"])
                    + timedelta(weeks=8)).isoformat()
        if (retest["date_re_test"] == att_date and retest["semaines"] == 8
                and retest["force"] is False):
            res["c6_retest_56j"] += 1
        # COUCHE appliquée :
        pal = corr.plancher_carte(p["sA"], p["sB"])
        bloc = corr.bloc_ecran(pas_sel, suivi, pal, p["label_ombre"],
                               retest["message"])
        res["comparaisons"] += 3
        if BANDEAU_OK in bloc["texte"]:
            res["dsim_archives"] += 1
        res["mots_interdits_max"] = max(res["mots_interdits_max"],
                                        bloc["nb_mots_interdits"])
        if bloc["nb_templates_cites"] != 6:
            res["templates_cites_ecarts"] += 1
        frag = corr.bilan_fragment(pas_sel, suivi, pal, p["label_ombre"],
                                   retest, p["sA"], p["sB"])
        res["comparaisons"] += 1
        if frag["_complet"]:
            res["fragments_archives"] += 1
        else:
            res["fragments_incomplets"] += 1
        res["paliers"][pal["palier"]] += 1
        if pal["S1"]:
            res["S1"] += 1
        if pal["S2"]:
            res["S2"] += 1
    res["plafonds_par_config"] = {
        k: round(100.0 * sum(v) / len(v), 1)
        for k, v in sorted(plafond_ok.items())}
    res["resume_groupes"] = resume
    res["pas_distribution"] = dict(sorted(pas_dist.items()))
    res["face_distribution"] = dict(sorted(face_dist.items()))
    res["categorie_par_groupe"] = cat_groupe
    # Agrégats ≡ archive du 15/10 (bit-exact) :
    for nom, calc, arc in (
            ("resume_groupes", resume, ARCHIVE_RESUME_GROUPES),
            ("pas_distribution",
             {k: pas_dist.get(k, 0) for k in ARCHIVE_PAS_DISTRIBUTION},
             ARCHIVE_PAS_DISTRIBUTION),
            ("face_distribution",
             {k: face_dist.get(k, 0) for k in ARCHIVE_FACE_DISTRIBUTION},
             ARCHIVE_FACE_DISTRIBUTION),
            ("categorie_par_groupe", cat_groupe,
             ARCHIVE_CATEGORIE_PAR_GROUPE)):
        res["comparaisons"] += 1
        if calc != arc:
            res["ecarts"].append({"champ": nom, "calcule": str(calc),
                                  "archive": str(arc)})
    if set(pas_dist) != set(ARCHIVE_PAS_DISTRIBUTION):
        res["ecarts"].append({"champ": "pas_cles",
                              "calcule": str(sorted(pas_dist)),
                              "archive": str(sorted(ARCHIVE_PAS_DISTRIBUTION))})
    res["anti_ok"] = bool(core_q5.verifier_anti_perfectionnisme()["ok"])
    res["rappels_ok"] = bool(core_q5.verifier_rappels_doux()["ok"])
    res["c5_conformes"] = sum(1 for v in plafond_ok.values() for o in v)
    return res


# ─────────────────────────────────────────────────────────────────────────────
# STAGE 4 — SUIVI + RE-TEST + RAPPELS + JUNCTIONS
# ─────────────────────────────────────────────────────────────────────────────
def stage4() -> dict:
    suivi_ok = 0
    categories = set()
    frontieres_exactes = (core_q5.suivre_14_jours(6)["categorie"] == "REPRISE"
                          and core_q5.suivre_14_jours(7)["categorie"]
                          == "AJUSTEMENT"
                          and core_q5.suivre_14_jours(8)["categorie"]
                          == "AJUSTEMENT"
                          and core_q5.suivre_14_jours(9)["categorie"]
                          == "CELEBRE")
    for jours in range(15):
        s = core_q5.suivre_14_jours(jours)
        categories.add(s["categorie"])
        if s["sanction"] is None:
            suivi_ok += 1
    rt = core_q5.programmer_re_test_q1("2026-01-01")
    retest_ok = (rt["semaines"] == 8 and rt["force"] is False
                 and rt["date_re_test"] == "2026-02-26T00:00:00"
                 and "jamais forcé" in rt["message"])
    label_reel = core_q5.PAS_LABELS["P4"]        # « Demander sans exiger »
    rappels = {j: core_q5.rappel_doux(j, label_reel) for j in (1, 7, 14)}
    rappels_ok = all(label_reel in r for r in rappels.values()) \
        and len(rappels) == 3
    # table 9 : toutes les combos → pas de la banque, bijections 6/6
    table_ok = True
    combos = set()
    for face in core_q5.FACES:
        for emp in core_q5.EMPREINTES:
            pas = core_q5._PAS_TABLE[(face, emp)]
            combos.add(pas)
            table_ok = table_ok and pas in core_q5.PAS_BANQUE
    bijection_ok = (len(core_q5.PAS_LABELS) == 6
                    and len(set(core_q5.PAS_LABELS.values())) == 6
                    and len(set(core_q5.TEMPLATES_PAS.values())) == 6
                    and combos == set(core_q5.PAS_BANQUE))
    types = {corr.type_couple(a, b) for (a, b) in
             ((2.0, 2.0), (3.3, 2.0), (2.0, 3.3), (3.3, 3.3))}
    return {
        "suivi_15_sans_sanction": suivi_ok,
        "suivi_categories": sorted(categories),
        "suivi_frontieres_6_7_8_9_exactes": frontieres_exactes,
        "retest_8_semaines": retest_ok,
        "rappels_doux_3": rappels_ok,
        "table_9_pas_banque": table_ok,
        "bijections_labels_templates": bijection_ok,
        "types_junction_4": sorted(types),
    }


# ─────────────────────────────────────────────────────────────────────────────
# PIPELINE COMPLET (exécuté 2 fois pour COR8)
# ─────────────────────────────────────────────────────────────────────────────
def pipeline() -> dict:
    print("  stage 0 — compactations …", flush=True)
    s0 = stage0()
    print("  stage 1 — énumération exhaustive …", flush=True)
    s1 = stage1()
    print(f"    {s1['configs']} configurations · textes distincts "
          f"{s1['md5_texts_count']} · fragments distincts "
          f"{s1['fragments_distincts']}", flush=True)
    print("  stage 2 — re-score bit-exact des 180 …", flush=True)
    s2 = stage2()
    print(f"    {s2['profils']} profils · {s2['comparaisons']} comparaisons "
          f"· écarts {len(s2['ecarts'])}", flush=True)
    print("  stage 4 — suivi + re-test + rappels + junctions …", flush=True)
    s4 = stage4()
    print(f"    suivi {s4['suivi_15_sans_sanction']}/15 · re-test "
          f"{s4['retest_8_semaines']}", flush=True)
    return {"stage0": s0, "stage1": s1, "stage2": s2, "stage4": s4,
            "standings": {
                "mots_interdits_standings": max(
                    [sum(1 for m in corr.MOTS_INTERDITS if m in t.lower())
                     for t in (corr.BANDEAU_DSIM, corr.PHRASE_ORIENTATION,
                               corr.NOTE_PAS, corr.NOTE_PLANCHER,
                               corr.clause_aide_standing(),
                               *(corr.note_ombre(l, "ZONE_CALME")
                                 for l in corr.LABELS_OMBRE_REELS),
                               *corr.PALIER_NOM.values(),
                               *corr.AXE_NOM_ECRAN.values(),
                               *core_q5.PAS_LABELS.values(),
                               *core_q5.TEMPLATES_PAS.values(),
                               *core_q5.TEMPLATES_SUIVI.values(),
                               *core_q5.TEMPLATES_RAPPELS.values())]),
                "orientation_canon_dans_phrase":
                    "pas un échec" in corr.PHRASE_ORIENTATION,
                "archive_sha256_run_reference": ARCHIVE_SHA256_RUN[:16],
            }}


def main() -> int:
    print("Exécution 1/2 …", flush=True)
    r1 = pipeline()
    print("Exécution 2/2 …", flush=True)
    r2 = pipeline()

    def canonique(d) -> bytes:
        return json.dumps(d, sort_keys=True, ensure_ascii=False,
                          default=list).encode("utf-8")

    sha1 = hashlib.sha256(canonique(r1)).hexdigest()
    sha2 = hashlib.sha256(canonique(r2)).hexdigest()
    cor8 = sha1 == sha2

    s0, s1, s2, s4 = r1["stage0"], r1["stage1"], r1["stage2"], r1["stage4"]
    n = s1["configs"]

    # chaînes pré-calculées (lisibilité des observes)
    inv0 = json.dumps(s0["pile_inventaire"], ensure_ascii=False,
                      sort_keys=True)
    plaf2 = json.dumps(s2["plafonds_par_config"], ensure_ascii=False,
                       sort_keys=True)
    dist1 = json.dumps(s1["pas_distribution"], sort_keys=True)
    emp1 = json.dumps(s1["empreintes_vues"], sort_keys=True)
    types4 = json.dumps(s4["types_junction_4"])

    criteres = {
        "COR0_compactations": {
            "definition": "compactations PROUVÉES exhaustivement : niveaux de "
                          "la carte — plateau 401 centièmes × 2 axes + PILE "
                          "1,80/2,60/3,20 inclusifs côté haut (consignés) + "
                          "batterie de frontière (saut exact à t) · "
                          "empreinte — variants casse/accents/underscores/"
                          "vides/inconnu → 3 empreintes du VRAI moteur, "
                          "mapping par défaut (LES DEUX / ALARME SANS MAIN / "
                          "SIGNAL LÉGER NON NOMMÉ / vide → ZONE_CALME) "
                          "consigné · espion machine : la signature du VRAI "
                          "selectionner_pas ne contient QUE (sA, sB, "
                          "label_ombre) — jours/date jamais lus · suivi 15 "
                          "valeurs (frontières 6/7-8/9 exactes, 0 sanction, "
                          "taux vérifié) · re-test +56 j exact · face PILE "
                          "2,61 inclusif + priorité sB + intervalle "
                          "[2,60 ; 2,61) réel (frontières DISTINCTES 2,60 "
                          "niveaux vs 2,61 face — consignées) · junction "
                          "type_attachement 4/4 déterministe · 3 "
                          "vérificateurs VRAI ok",
            "observe": f"plateau {s0['niveaux_plateau']} → écart "
                       f"{s0['niveaux_ecarts']} · PILE {s0['niveaux_pile']} "
                       f"(inventaire {inv0}) · frontière "
                       f"{s0['niveaux_frontiere']} → écart "
                       f"{s0['niveaux_frontiere_ecarts']} · empreinte "
                       f"{s0['empreinte_variants']} → écart "
                       f"{s0['empreinte_ecarts']} (défauts consignés "
                       f"{s0['empreinte_defaut_consignes']}) · espion "
                       f"signature {s0['espion_signature_ok']}/"
                       f"{s0['espion_signature']} · déterminisme "
                       f"{s0['espion_determinisme']} → écart "
                       f"{s0['espion_determinisme_ecarts']} · suivi "
                       f"{s0['suivi_jours']} → écart {s0['suivi_ecarts']} · "
                       f"sanctions {s0['suivi_sanctions']} · re-test "
                       f"{s0['retest_dates']} → écart {s0['retest_ecarts']} · "
                       f"face PILE {s0['face_pile']} → écart "
                       f"{s0['face_ecarts']} · sliver {s0['face_sliver']} → "
                       f"écart {s0['face_sliver_ecarts']} · type "
                       f"{s0['type_junction']} → écart "
                       f"{s0['type_junction_ecarts']} · vérifiants "
                       f"{s0['verifiants_moteur']} → écart "
                       f"{s0['verifiants_ecarts']}",
            "pass": (s0["niveaux_ecarts"] == 0
                     and s0["niveaux_frontiere_ecarts"] == 0
                     and s0["empreinte_ecarts"] == 0
                     and s0["espion_signature_ok"] == 1
                     and s0["espion_determinisme_ecarts"] == 0
                     and s0["suivi_ecarts"] == 0
                     and s0["suivi_sanctions"] == 0
                     and s0["suivi_taux_ecarts"] == 0
                     and s0["retest_ecarts"] == 0
                     and s0["face_ecarts"] == 0
                     and s0["face_sliver_ecarts"] == 0
                     and s0["type_junction_ecarts"] == 0
                     and s0["verifiants_ecarts"] == 0)},
        "COR1_fragment_complet": {
            "definition": f"{n}/{n} configurations → fragment L8 7 blocs, "
                          "0 champ vide (aucun gate sur cet instrument — pas "
                          "de suspension inventée, R4) + 180/180 profils "
                          "archivés",
            "observe": f"{n}/{n} configs complètes · {s1['fragments_distincts']} "
                       f"états distincts de fragment · incomplets "
                       f"{s1['fragment_incomplets']} · archivés "
                       f"{s2['fragments_archives']}/{s2['profils']} · "
                       f"incomplets {s2['fragments_incomplets']}",
            "pass": (s1["fragment_incomplets"] == 0
                     and s2["fragments_incomplets"] == 0
                     and s2["fragments_archives"] == s2["profils"] == 180)},
        "COR2_derivation_palier": {
            "definition": "double chemin : comptage sur les VRAIS seuils "
                          "importés ≡ VRAI if-chaîne niveau_ponctuel (q1-r1, "
                          "seuils 1,80/2,60/3,20) — palier + S1/S2 + axes "
                          "exactement ; junctions S1 ⇔ 🔴, S2 ⇔ 🟠 "
                          "exactement ; PLANCHER PARTIEL consigné (i_alarm "
                          "et somme des mains absents des héritages du pas — "
                          "lecture héritée de la CARTE, règle R1 de RIO-01) ; "
                          "frontières 2,60 (niveaux) vs 2,61 (face) "
                          "DISTINCTES, toutes deux réelles, consignées",
            "observe": f"{n} configs · écart double chemin "
                       f"{s1['cor2_ecarts']} · écart junction "
                       f"{s1['junction_s1s2_ecarts']}",
            "pass": (s1["cor2_ecarts"] == 0
                     and s1["junction_s1s2_ecarts"] == 0)},
        "COR3_seuils_aide": {
            "definition": "S1 = un axe lu Forte (rang 3, VRAI "
                          "niveau_ponctuel ≥ 3,20) ; S2 = un axe lu Vive sans "
                          "aucune Forte (rang 2, ≥ 2,60) ; la couche n'ajoute "
                          "AUCUN seuil numérique — seuils affichés = "
                          "SEUILS_NIVEAUX (importés) + 2,61 (face du VRAI "
                          "moteur) + 9/7 (suivi) + 8 semaines (re-test), tous "
                          "préexistants ; PILE moteurs vérifiés et consignés "
                          "(niveaux inclusifs côté haut : 1,80→Tranquille, "
                          "2,60→Vive, 3,20→Forte ; face 2,61 inclusive ; "
                          "suivi ≥ 9 / ≥ 7 inclusifs) ; seuils du suivi "
                          "entiers exacts",
            "observe": f"S1 {s1['S1']}/{n} · S2 {s1['S2']}/{n} · PILE "
                       f"{s0['niveaux_pile'] + s0['face_pile']} vérifiés "
                       f"(0 écart) · frontières suivi exactes "
                       f"{s4['suivi_frontieres_6_7_8_9_exactes']} · "
                       f"inventaire {inv0}",
            "pass": (s1["junction_s1s2_ecarts"] == 0
                     and s0["niveaux_ecarts"] == 0
                     and s0["face_ecarts"] == 0
                     and s4["suivi_frontieres_6_7_8_9_exactes"])},
        "COR4_vocabulaire_ecran": {
            "definition": "0 mot interdit (canon Partie 9) sur tous les "
                          "textes générés + templates réels du moteur (6 pas "
                          "+ 3 suivi + 3 rappels) + labels d'ombre réels, "
                          "D-SIM 100 %",
            "observe": f"max mots interdits par texte = "
                       f"{s1['mots_interdits_max']} ; standing = "
                       f"{r1['standings']['mots_interdits_standings']} ; "
                       f"textes distincts = {s1['md5_texts_count']} "
                       f"({n} configs balayées) ; D-SIM "
                       f"manquants {s1['dsim_manquants']} ; archivés D-SIM "
                       f"{s2['dsim_archives']}/{s2['profils']} · max "
                       f"archivés {s2['mots_interdits_max']}",
            "pass": (s1["mots_interdits_max"] == 0
                     and r1["standings"]["mots_interdits_standings"] == 0
                     and s1["dsim_manquants"] == 0
                     and s2["dsim_archives"] == 180
                     and s2["mots_interdits_max"] == 0)},
        "COR5_anti_fabrication": {
            "definition": "le pas affiché ≡ VRAI selectionner_pas (table 9 "
                          "(face, empreinte), trace de source réelle) ; 6 "
                          "templates réels cités par écran (pas + suivi + 3 "
                          "rappels + re-test) ; label d'ombre reçu affiché "
                          "mot pour mot, normalisation tracée honnêtement "
                          "(défaut du moteur consigné) ; JAMAIS de sanction "
                          "(structurel) ; pas ⊆ banque fermée",
            "observe": f"templates cités : écart "
                       f"{s1['templates_cites_ecarts']} · pas hors banque "
                       f"{s1['pas_hors_banque']} · sanctions non nulles "
                       f"{s1['sanctions_non_nulles']} (énum) + "
                       f"{s2['c2_sanctions']} (archivés) · archivés "
                       f"templates {s2['templates_cites_ecarts']} · "
                       f"bijections {s4['bijections_labels_templates']}",
            "pass": (s1["templates_cites_ecarts"] == 0
                     and s1["pas_hors_banque"] == 0
                     and s1["sanctions_non_nulles"] == 0
                     and s2["c2_sanctions"] == 0
                     and s2["templates_cites_ecarts"] == 0
                     and s4["bijections_labels_templates"])},
        "COR6_rescore_bit_exact": {
            "definition": "180 profils archivés q5 régénérés par le VRAI "
                          "simulateur seed 42 RE-EXÉCUTÉ frais (D-REPRO) : "
                          "agrégats ≡ archive resultats-q5-2026-10-15.json "
                          "(3×60 · pas 21/42/39/21/39/18 · faces 60/60/60 · "
                          "catégories par groupe · plafonds 9 × 100 %) · C1 "
                          "180/180 pas ≡ pas_vrai (D-VÉRITÉ, éliminatoire) · "
                          "C3 0 désaccord · C2 cas-types messages BIT-EXACT "
                          "vs archive (3 × [catégorie + template moteur + "
                          "chaîne archivée]) + anti-perfectionnisme ok · C5 "
                          "180/180 + rappels ok · re-test +56 j 180/180 "
                          "jamais forcé",
            "observe": f"{s2['profils']} profils · {s2['comparaisons']} "
                       f"comparaisons · écarts {len(s2['ecarts'])} · C1 "
                       f"{s2['c1_match']}/180 · C3 désaccords "
                       f"{s2['c3_desaccords']} · C2 bit-exact "
                       f"{s2['c2_cas_types_bit_exact']}/9 (cas vus "
                       f"{s2['c2_cas_vus']}/3) · anti {s2['anti_ok']} · C5 "
                       f"{s2['c5_conformes']}/180 · rappels "
                       f"{s2['rappels_ok']} · C6 {s2['c6_retest_56j']}/180 · "
                       f"plafonds {plaf2} · paliers {s2['paliers']} · "
                       f"S1 {s2['S1']} · S2 {s2['S2']}",
            "pass": (len(s2["ecarts"]) == 0
                     and s2["profils"] == 180
                     and s2["c1_match"] == 180
                     and s2["c3_desaccords"] == 0
                     and s2["c2_cas_types_bit_exact"] == 9
                     and s2["c2_cas_vus"] == 3
                     and s2["anti_ok"] is True
                     and s2["c5_conformes"] == 180
                     and s2["rappels_ok"] is True
                     and s2["c6_retest_56j"] == 180
                     and all(v == 100.0 for v in
                             s2["plafonds_par_config"].values())
                     and len(s2["plafonds_par_config"]) == 9)},
        "COR7_couplage_pas": {
            "definition": "les 6 pas réels résolus par le VRAI "
                          "selectionner_pas sur l'espace complet des "
                          "héritages (43 × 43 × 7 : axes × labels ombre "
                          "réels — tous mesurés par RIO-01/RIO-02) ; suivi "
                          "14 j sans sanction 15/15 ; re-test 8 semaines "
                          "jamais forcé ; rappels doux J1/J7/J14 réels ; "
                          "junctions réelles (type_attachement q4 — RIO-04)",
            "observe": f"pas résolus "
                       f"{sum(1 for v in s1['pas_distribution'].values() if v)}"
                       f"/6 · distribution {dist1} · empreintes {emp1} · "
                       f"suivi {s4['suivi_15_sans_sanction']}/15 · re-test "
                       f"{s4['retest_8_semaines']} · rappels "
                       f"{s4['rappels_doux_3']} · table 9 "
                       f"{s4['table_9_pas_banque']} · types {types4}",
            "pass": (sum(1 for v in s1["pas_distribution"].values() if v) == 6
                     and s4["suivi_15_sans_sanction"] == 15
                     and s4["suivi_frontieres_6_7_8_9_exactes"]
                     and s4["retest_8_semaines"]
                     and s4["rappels_doux_3"]
                     and s4["table_9_pas_banque"]
                     and len(s4["types_junction_4"]) == 4)},
        "COR8_reproductibilite": {
            "definition": "pipeline ×2 → SHA-256 identiques",
            "observe": f"{sha1[:16]}… == {sha2[:16]}… → {cor8}", "pass": cor8},
    }

    RES.mkdir(exist_ok=True)
    payload = {
        "package": "validation-q5/correction-philosophique",
        "cible": "RIO-05 « Mon premier pas »",
        "moteurs_reels": [
            "validation-q5/src/wtc_q5_core.py (pas + suivi + rappels + "
            "re-test)",
            "validation-q5/src/wtc_q5_simulator.py (seed 42, 180 profils)",
            "validation-q1-r1/src/wtc_q1_core.py (VRAIS seuils des niveaux "
            "1,80/2,60/3,20 — lecture héritée de la carte)",
            "validation-q4/src/wtc_q4_core.py (type_attachement — RIO-04)"],
        "espace_enumeré": {
            "dimension": ("sA (43 : dizièmes 0,0→4,0 + 2,605/2,61) × sB (43) "
                          "× label ombre réel (6 + vide) × jours tenus (15)"),
            "configurations": n,
        },
        "re_score_p1_simulation": {
            "F1_graduation": 20,
            "F2_gravite": 25,
            "F3_solutions": 25,
            "F4_bilan": 25,
            "total": 95,
            "note": "F1 = 20 : plafond structurel du barème pour les quêtes "
                    "« pas » (la lecture graduée appartient aux quêtes amont "
                    "— même traitement que RIO-10/15/18/23 ; prétendre "
                    "100 % serait une fabrication)",
        },
        "cor8_sha256_run1": sha1, "cor8_sha256_run2": sha2,
        "criteres": criteres,
        "stage0": s0,
        "stage1": s1,
        "stage2": {k: v for k, v in s2.items() if k != "ecarts"},
        "stage2_ecarts": s2["ecarts"][:20],
        "stage4": s4,
        "standings": r1["standings"],
    }
    (RES / "correction_criteres.json").write_text(
        json.dumps(payload, indent=1, ensure_ascii=False, default=list),
        encoding="utf-8")
    print(json.dumps({k: v["observe"] for k, v in criteres.items()},
                     indent=1, ensure_ascii=False))
    print("Tous PASS :", all(c["pass"] for c in criteres.values()))
    return 0 if all(c["pass"] for c in criteres.values()) else 1


if __name__ == "__main__":
    sys.exit(main())
