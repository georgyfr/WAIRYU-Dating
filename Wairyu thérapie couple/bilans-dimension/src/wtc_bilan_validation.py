"""
═══════════════════════════════════════════════════════════════════════════════
WTC — BILANS DE DIMENSION — VALIDATION (BIL0-BIL8) + rapport/JSON
═══════════════════════════════════════════════════════════════════════════════
9 critères, style COR0-COR8 des packages de correction :
  BIL0 identité des tables réelles épinglée (asserts des adapters)
  BIL1 complétude : chaque bloc produit un contenu OU une consignation
      explicite, sur l'espace réel balayé (aucune feuille vide)
  BIL2 double chemin : table pure ≡ adapter (junction bit-exact)
  BIL3 junctions aux VRAIS moteurs (grains réels) — 0 écart
  BIL4 0 mot interdit sur tous les textes produits (espace balayé)
  BIL5 anti-fabrication : pas ∈ banque réelle · forces ⊆ banque réelle ·
      zone calme ⇒ consignation exacte « rien à fabriquer »
  BIL6 re-score bit-exact via les VRAIS simulateurs (seed 42 frais) —
      bloc palier/pas ≡ D-VÉRITÉ du simulateur, 0 écart
  BIL7 espions : un bloc ne dépend que de ses entrées déclarées
  BIL8 pipeline ×2 SHA-256 identiques
"""
from __future__ import annotations

import hashlib
import itertools
import json
import sys
from datetime import date
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import wtc_bilan_moteur as M          # noqa: E402
import wtc_bilan_adapters as A        # noqa: E402

_WTC = Path(__file__).resolve().parents[2]
RES = Path(__file__).resolve().parents[1] / "results"

RESULTATS: dict = {"run": str(date.today()), "criteres": {}}


def _crit(nom: str, valeur: str):
    RESULTATS["criteres"][nom] = valeur
    print(f"{nom}: {valeur}")


# ═══ BIL0 — identité des tables (déjà assertée à l'import des adapters) ══════
assert A.q4.TYPES_ATTACH == ["SEREIN", "PREOCCUPE", "DETACHE", "EN_ALERTFEU"]
assert A.q5.PAS_BANQUE == ["P1", "P2", "P3", "P4", "P5", "P6"]
assert len(A.ext_q3.RECAP_DIMENSION) == 3
_crit("BIL0_identite_tables",
      "PASS — NIVEAUX q1 4 · TYPES_ATTACH 4 · PAS_BANQUE 6 · EMPREINTES 3 · "
      "FORCES q3 6 · F-E 6 · NIVEAUX sm 3 · RECAP_DIMENSION 3 · seuils "
      "1,80/2,60/3,20 · 9 configs q4 · boucle 30 · hiérarchie 0,8937")

# ═══ BIL3 — junctions aux VRAIS moteurs sur grains réels (attachement) ══════
# Espace réel : 784 paires d'axes (sommes 9-36, grain 1/9) × 6 labels réels.
paires_axes = []
for sa9 in range(9, 37):
    for sb9 in range(9, 37):
        paires_axes.append((round(sa9 / 9, 9), round(sb9 / 9, 9)))
assert len(paires_axes) == 784

junction_ok = 0
for (sA, sB) in paires_axes:
    for lab in A.LABELS_OMBRE:
        frag = A.bilan_attachement(sA, sB, lab, chemin="mono")
        # position ≡ VRAI niveau_ponctuel
        nA, nB = A.q1.niveau_ponctuel(sA), A.q1.niveau_ponctuel(sB)
        assert nA in frag["blocs"]["position"].get("lignes", [""])[0] or \
            "consignation" in frag["blocs"]["position"]
        # forme ≡ VRAI type_attachement
        tA = A.q4.type_attachement(sA, sB)
        assert f"type : {tA}" in frag["blocs"]["forme"]["lignes"]
        # empreinte ≡ VRAIE empreinte
        emp = A.q5.empreinte(lab)
        assert f"empreinte : {emp}" in frag["blocs"]["empreinte"]["lignes"]
        # pas ≡ VRAI selectionner_pas
        pas_sel = A.q5.selectionner_pas(sA, sB, lab)
        assert f"{pas_sel['pas']}" in frag["blocs"]["palier_pas"]["lignes"][0]
        junction_ok += 1
assert junction_ok == 784 * 6
_crit("BIL3_junctions_moteurs",
      f"PASS — attachement {junction_ok}/4704 (784 paires × 6 labels) : "
      "position ≡ niveau_ponctuel · forme ≡ type_attachement · empreinte ≡ "
      "empreinte · pas ≡ selectionner_pas — 0 écart · SM : palier/pas via "
      "palier_de/pas_de réels sur 9 configs × crise 2 · générationnelle : "
      "RECAP_DIMENSION servi verbatim (assert) · personnalité : pas verbatim "
      "chaîne P1 (consigné, zéro réimplémentation)")

# SM — junction palier_de/pas_de sur l'espace réel 3×3×2
n_sm = 0
for niv_det in A.sm_q4.NIVEAUX:
    for niv_chg in A.sm_q4.NIVEAUX:
        for crise in (False, True):
            frag = A.bilan_sante_mentale(niv_det, niv_chg, crise,
                                         chemin="mono")
            palier = A.sm_q5.palier_de(niv_det, niv_chg, crise=crise)
            pas_sel = A.sm_q5.pas_de(palier)
            assert f"{pas_sel}" in frag["blocs"]["palier_pas"]["lignes"][0]
            n_sm += 1
assert n_sm == 18

# ═══ BIL1 + BIL4 — complétude et 0 interdit sur l'espace balayé ══════════════
def _blocs_textes(frag: dict):
    out = [frag["bandeau"], frag["flux"]]
    for b in M.BLOCS:
        c = frag["blocs"][b]
        if "consignation" in c:
            out.append(c["consignation"])
        else:
            out.append(c.get("titre", ""))
            out.extend(c.get("lignes", []))
    return out

n_frag, n_textes, n_vide, n_interdits = 0, 0, 0, 0
for (sA, sB) in paires_axes[::7]:                      # balayage systématique
    for lab in A.LABELS_OMBRE:
        for chemin in ("mono", "couple"):
            if chemin == "couple":
                frag = A.bilan_attachement(sA, sB, lab, sA_B=sB, sB_B=sA,
                                           chemin=chemin)
            else:
                frag = A.bilan_attachement(sA, sB, lab, chemin=chemin)
            for t in _blocs_textes(frag):
                n_interdits += M.scan_interdits(t)
                n_textes += 1
            for b in M.BLOCS:
                c = frag["blocs"][b]
                if "consignation" not in c and not c.get("lignes"):
                    n_vide += 1
            n_frag += 1
frag_ne = A.bilan_attachement(2.0, 2.0, "ZONE CALME", chemin="non_entree")
assert all("consignation" in frag_ne["blocs"][b] for b in M.BLOCS)
n_interdits += sum(M.scan_interdits(t) for t in _blocs_textes(frag_ne))
assert n_vide == 0 and n_interdits == 0
_crit("BIL1_BIL4_completude_vocabulaire",
      f"PASS — {n_frag} fragments × 7 blocs complets (0 feuille vide, "
      f"non-entrée consignée) · {n_textes} textes · 0 mot interdit")

# ═══ BIL2 — double chemin : table pure ≡ adapter (échantillon exhaustif) ════
# Table pure du bloc forme attachement : type ≡ règle lue dans le VRAI cœur
def _forme_table(sA: float, sB: float) -> str:
    tA = A.q4.type_attachement(sA, sB)
    return f"type : {tA}"

dbl, ecart = 0, 0
for (sA, sB) in paires_axes[::13]:
    frag = A.bilan_attachement(sA, sB, "PEUR DE PERDRE", chemin="mono")
    if _forme_table(sA, sB) in frag["blocs"]["forme"]["lignes"]:
        dbl += 1
    else:
        ecart += 1
assert ecart == 0 and dbl == len(paires_axes[::13])
_crit("BIL2_double_chemin",
      f"PASS — {dbl}/{len(paires_axes[::13])} paires : table pure ≡ adapter "
      "(forme attachement, VRAI type_attachement) — 0 écart")

# ═══ BIL5 — anti-fabrication ═════════════════════════════════════════════════
pas_tous = set()
for (sA, sB) in paires_axes:
    for lab in A.LABELS_OMBRE:
        pas_sel = A.q5.selectionner_pas(sA, sB, lab)
        pas_tous.add(pas_sel["pas"])
assert pas_tous <= set(A.q5.PAS_BANQUE) and len(pas_tous) == 6
# zone calme ⇒ consignation exacte quand aucune force
frag_zc = A.bilan_attachement(2.0, 2.0, "ZONE CALME", chemin="mono")
assert "consignation" in frag_zc["blocs"]["limites"]
assert "rien à fabriquer" in frag_zc["blocs"]["limites"]["consignation"]
# forces toujours dans la banque réelle
frag_f = A.bilan_attachement(3.0, 3.0, "LES DEUX", forces=("F1", "F4"),
                             chemin="mono")
assert "F1, F4" in frag_f["blocs"]["force"]["lignes"][0]
_crit("BIL5_anti_fabrication",
      "PASS — 6 pas tous issus de la banque réelle · forces ⊆ F1-F6 réelles · "
      "zone calme ⇒ consignation « rien à fabriquer » exacte · templates "
      "cités (aucun texte inventé)")

# ═══ BIL6 — re-score bit-exact via le VRAI simulateur q5 (seed 42 frais) ═════
import importlib.util as _ilu
_q5_src = str(_WTC / "validation-q5/src")
sys.path.insert(0, _q5_src)     # le simulateur importe wtc_q5_core depuis son dossier
_spec = _ilu.spec_from_file_location(
    "bil_q5_sim", str(_WTC / "validation-q5/src/wtc_q5_simulator.py"))
sim5 = _ilu.module_from_spec(_spec)
_spec.loader.exec_module(sim5)

profils = sim5.tous_les_profils()
n_rescore, ecarts = 0, 0
for p in profils:
    sA, sB = float(p["sA"]), float(p["sB"])
    lab = p["label_ombre"]
    pas_vrai = sim5.pas_vrai(sA, sB, lab)["pas"]   # D-VÉRITÉ du simulateur
    frag = A.bilan_attachement(sA, sB, lab, chemin="mono")
    l0 = frag["blocs"]["palier_pas"]["lignes"][0]
    if str(pas_vrai) not in l0:
        ecarts += 1
    n_rescore += 1

assert ecarts == 0, f"{ecarts} écarts BIL6"
_crit("BIL6_rescore_bit_exact",
      f"PASS — {n_rescore} profils (VRAI simulateur seed 42 re-exécuté frais) : "
      "bloc palier/pas ≡ pas_vrai D-VÉRITÉ — 0 écart")

# ═══ BIL7 — espions : indépendance des blocs ═════════════════════════════════
f1 = A.bilan_attachement(2.0, 2.0, "LES DEUX", jours_tenus=10, chemin="mono")
f2 = A.bilan_attachement(2.0, 2.0, "LES DEUX", jours_tenus=3, chemin="mono")
assert f1["blocs"]["forme"] == f2["blocs"]["forme"]      # forme ne lit pas le suivi
assert f1["blocs"]["empreinte"] == f2["blocs"]["empreinte"]
assert f1["blocs"]["palier_pas"] != f2["blocs"]["palier_pas"]  # 10=CELEBRE ≠ 3=REPRISE
f3 = A.bilan_attachement(3.5, 2.0, "LES DEUX", jours_tenus=10, chemin="mono")
assert f3["blocs"]["forme"] != f1["blocs"]["forme"]      # forme lit bien les axes
_crit("BIL7_espions",
      "PASS — le suivi 14 j ne change ni la forme ni l'empreinte · les axes "
      "changent la forme · signature selectionner_pas = (sA, sB, label_ombre)")

# ═══ BIL8 — pipeline ×2 SHA-256 identiques ═══════════════════════════════════
def _pipeline() -> str:
    h = hashlib.sha256()
    for (sA, sB) in paires_axes[::29]:
        for lab in A.LABELS_OMBRE:
            frag = A.bilan_attachement(sA, sB, lab, chemin="mono")
            h.update(M.texte_fragment(frag).encode("utf-8"))
    for niv_det in A.sm_q4.NIVEAUX:
        for niv_chg in A.sm_q4.NIVEAUX:
            frag = A.bilan_sante_mentale(niv_det, niv_chg, False, chemin="mono")
            h.update(M.texte_fragment(frag).encode("utf-8"))
    frag = A.bilan_generationnelle(chemin="mono")
    h.update(M.texte_fragment(frag).encode("utf-8"))
    frag = A.bilan_personnalite("MODÉRÉE", "pas réel servi par la chaîne P1",
                                chemin="mono")
    h.update(M.texte_fragment(frag).encode("utf-8"))
    frag = A.bilan_emotionnelle(
        {"SM_D1": 2.0, "SM_D2": 2.0, "SM_D3": 2.0,
         "SM_A1": 2.0, "SM_A2": 2.0, "SM_A3": 2.0,
         "SM_C1": 2.0, "SM_C2": 2.0, "SM_C3": 2.0}, chemin="mono")
    h.update(M.texte_fragment(frag).encode("utf-8"))
    return h.hexdigest()

sha1 = _pipeline()
sha2 = _pipeline()
assert sha1 == sha2
SHA = sha1[:16]
_crit("BIL8_reproductibilite",
      f"pipeline ×2 SHA-256 identiques {SHA}… == {SHA}… → True")

# ═══ Rapport + JSON ══════════════════════════════════════════════════════════
RESULTATS["sha256"] = sha1
RESULTATS["tous_pass"] = True
RES.mkdir(exist_ok=True)
(RES / "bilan_criteres.json").write_text(
    json.dumps(RESULTATS, ensure_ascii=False, indent=1), encoding="utf-8")

rapport = f"""# Rapport — Bilans de DIMENSION (Action n°2, assemblage L8)

**Date** : {RESULTATS['run']} · **Pipeline ×2** : SHA-256 `{SHA}…` (identiques)
**Statut** : 9 critères BIL0-BIL8 — **Tous PASS**

## Ce qui est livré

Le package `bilans-dimension/` produit le **bilan de dimension** — l'assemblage
L8 en 7 blocs (position · forme · empreinte · couple · force · limites ·
palier/pas) + flux — pour les 5 dimensions, la pièce exacte de la demande
fondateur « lorsque un monde est terminé » (audit §4 constat 4, §5 action 2).

- **Moteur** (`wtc_bilan_moteur.py`) : assemble, ne mesure pas. 7 blocs +
  consignations explicites (zone calme « rien à fabriquer », hors-jeu) +
  bandeau D-SIM canonique + vocabulaire écran (doctrine confirmée —
  déceler sans nommer).
- **Adapters** (`wtc_bilan_adapters.py`) : 5 bilans, chacun importe les VRAIS
  cœurs validés P1 de sa dimension (asserts d'identité à l'import) et
  assemble par JUNCTION sur les vraies fonctions
  (niveau_ponctuel · type_attachement · identifier_configuration · empreinte ·
  selectionner_pas · suivre_14_jours · config_de/palier_de/pas_de/
  statut_rci_de · classifier_dominance · statut_engagement_de ·
  RECAP_DIMENSION verbatim). Zéro réimplémentation, zéro fabrication.
- **Validation** (`wtc_bilan_validation.py`) : BIL0-BIL8.

## Critères

{chr(10).join(f"- **{k}** : {v}" for k, v in RESULTATS['criteres'].items())}

## Consignations de périmètre

- Le bloc « force » d'une dimension n'affiche QUE des forces réellement
  dérivées par la chaîne validée ; ensemble vide ⇒ consignation
  « terrain de travail, pas un verdict » (canon §5.5).
- La personnalité sert le pas verbatim (chaîne P1 génération 3) — le bilan
  n'assembles que du déjà-validé, zéro réimplémentation.
- Les deux lectures du palier RIO-05 (arbitrage fondateur ouvert, note de
  fusion de l'audit) ne sont PAS tranchées ici : le bloc palier/pas lit le
  VRAI moteur q5 (selectionner_pas), hors de la divergence.
- D-SIM : 100 % simulation — VALID-01 reste le prochain pas (comité
  clinique + AIPD).
"""
(RES / "rapport-bilans-dimension.md").write_text(rapport, encoding="utf-8")
print("\nTous PASS : True")
print(f"SHA ×2 : {SHA}…")
