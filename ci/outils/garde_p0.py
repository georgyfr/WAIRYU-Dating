#!/usr/bin/env python3
# ═══════════════════════════════════════════════════════════════════
# GARDE ÉTENDUE P0 — règle 11-b (brûlage) sur TOUT le dépôt
# finding F.1 (audit externe) · mission corrections P0 conception
# fiche-mutation: FM-027
#
# Rôle : le garde CI-10 historique (hors dépôt, perdu au reset) ne
# scannait pas les .yaml (finding V15 : Glob *.md aveugle aux .yaml).
# Cette garde étendue scanne TOUS les formats porteurs de texte
# (.md .yaml .json .ts .tsx .sql — + .py en bonus) sur TOUT le dépôt,
# Y COMPRIS le code d'application (apps/ packages/ migrations/
# etapes/) : SCANNE, JAMAIS MODIFIER.
#
# Aiguilles :
#   A1 · les formulations de trames retirées (F.1 + F.1-bis) doivent
#        avoir ZÉRO occurrence — matching normalisé (accents, casse,
#        espaces, guillemets, apostrophes, tirets) pour attraper les
#        copies reformattées.
#   A2 · le placeholder officiel doit être INTACT (sha256 canonique) —
#        toute occurrence approximative est un finding.
#   A3 · tout fichier .md/.yaml (périmètre production) déclarant un
#        slot sécurité doit porter le placeholder officiel.
#        ddocumentation/ est exempté (corpus source fondateur, hors
#        périmètre de modification — conforme, vérifié FM-027 §3).
#   A4 · tout item machine (contenu/**/items.yaml) portant un signal
#        DTM_N doit avoir enonce == placeholder officiel.
#
# Limites consignées (FM-027 §4) : les formulations T01-T60 sont
# inconnues du dépôt par construction — le garde ne peut aiguiller
# que les formulations qu'il connaît (retraitées ci-dessous) ; pour
# le reste, le document trames hors dépôt fait foi.
#
# Exécution : python3 ci/outils/garde_p0.py   (depuis la racine)
# Sortie    : rapport détaillé · code 0 si VERT, 1 si ROUGE
# ═══════════════════════════════════════════════════════════════════

import hashlib
import re
import sys
import unicodedata
from pathlib import Path

RACINE = Path(__file__).resolve().parents[2]

# ── Le placeholder officiel (libellé gravé par FM-021) — 2 variantes officielles :
#    la forme courte (FM-021, M8-6.2 l.89-93) et la variante « hébergée »
#    (M11-8.3 l.33-35, trames T58-T60 hébergées à la Partie 11 du document trames).
PLACEHOLDER = (
    "[TRAME SÉCURITÉ — formulation retirée du dépôt. Contenu fourni au "
    "document trames confidentiel, hors dépôt — règle 11-b.]"
)
PLACEHOLDER_HEBERGEE = (
    "[TRAME SÉCURITÉ — formulation retirée du dépôt. Contenu fourni au "
    "document trames confidentiel, hors dépôt — règle 11-b. Statut : "
    "hébergée — énoncé hors dépôt (document trames, Partie 11).]"
)
PLACEHOLDER_SHA256_ATTENDU = (
    "0d90aef535aca2cfbbeed2b1e7796930825fc102f27040fc1be628e9f111f8cb"
)
VARIANTES_OFFICIELLES = (PLACEHOLDER, PLACEHOLDER_HEBERGEE)

# ── Aiguilles A1 : formulations retirées (fragments distinctifs) ────
# FM-027 §1-§2 : 4 formulations actuelles (F.1) + v1 de Q2.1-23 (F.1-bis).
FORMULATIONS_RETIREES = [
    "besoins passent avant ceux des autres",                    # Q2.1-21
    "reste en dessous de ce qui m'est dû",                      # Q2.1-22
    "ma place doit être reconnue avant celle des autres",       # Q2.1-23 (v2)
    "traite comme tout le monde",                               # Q2.1-24 (cœur)
    "décisions importantes me reviennent naturellement",        # Q2.1-23 (v1)
]

# ── Formats scannés ─────────────────────────────────────────────────
FORMATS = {".md", ".yaml", ".json", ".ts", ".tsx", ".sql"}
FORMATS_BONUS = {".py"}                      # scannés aussi, reportés à part
EXCLUS_DOSSIERS = {".git", "node_modules"}
EXEMPT_A3 = {"ddocumentation"}              # corpus source fondateur (FM-027 §3)


def normalise(txt: str) -> str:
    """NFD sans accents · minuscules · apostrophes/tirets/guillemets unifiés ·
    tout blanc (y compris sauts de ligne) réduit à un espace — pour attraper
    les copies reformatées d'une formulation."""
    txt = unicodedata.normalize("NFD", txt)
    txt = "".join(c for c in txt if not unicodedata.combining(c))
    txt = txt.lower()
    txt = txt.replace("'", "'").replace("'", "'")
    txt = txt.replace("«", '"').replace("»", '"')
    txt = txt.replace('"', '"').replace('"', '"')
    txt = re.sub("[–—−]", "-", txt)
    txt = re.sub(r"\s+", " ", txt)
    return txt


AIGUILLES_NORM = [normalise(f) for f in FORMULATIONS_RETIREES]
VARIANTES_NORM = {normalise(v) for v in VARIANTES_OFFICIELLES}
MOTIF_ETIQUETTE = re.compile(r"\[TRAME S[ÉE]CURIT[ÉE][^\]]*\]")
SOI = Path(__file__).resolve()          # la garde ne se scanne pas elle-même
                                        # (elle PORTE les aiguilles par construction)


def fichiers_a_scanner():
    md_yaml = []
    par_format = {}
    for p in RACINE.rglob("*"):
        if not p.is_file() or p.suffix.lower() not in (FORMATS | FORMATS_BONUS):
            continue
        rel = p.relative_to(RACINE)
        if any(part in EXCLUS_DOSSIERS for part in rel.parts):
            continue
        fmt = p.suffix.lower()
        par_format[fmt] = par_format.get(fmt, 0) + 1
        md_yaml.append(rel)
    return md_yaml, par_format


def main() -> int:
    trouvailles: list[tuple[str, str]] = []      # (aiguille, fichier)
    fichiers_slot_sans_placeholder: list[str] = []
    items_dtm_inconformes: list[str] = []
    placeholders_mutés: list[str] = []

    cibles, par_format = fichiers_a_scanner()
    for rel in cibles:
        chemin = RACINE / rel
        try:
            brut = chemin.read_text(encoding="utf-8")
        except (UnicodeDecodeError, OSError):
            continue                              # binaire/illisible : hors champ texte
        norm_fichier = normalise(brut)
        parties = rel.parts

        # A1 — formulations retirées : ZÉRO occurrence tolérée
        if chemin.resolve() != SOI:
            for i, aiguille in enumerate(AIGUILLES_NORM):
                if aiguille in norm_fichier:
                    trouvailles.append((f"F.1-{i + 1}", str(rel)))

        # A2 — étiquettes [TRAME SÉCURITÉ …] : chaque occurrence doit être
        #      UNE des deux variantes officielles (intègre, non mutée)
        if chemin.resolve() != SOI:
            for m in MOTIF_ETIQUETTE.finditer(brut):
                if m.group(0) not in VARIANTES_OFFICIELLES:
                    placeholders_mutés.append(f"{rel} : {m.group(0)[:60]}…")

        # A3 — slot sécurité déclaré dans les dossiers de production ⇒
        #      placeholder officiel présent (une des 2 variantes).
        #      Hors champ : mentions narratives (STATUS, Constitution,
        #     fiches) qui citent la règle sans déclarer de slot.
        if (
            brut and ".md" == chemin.suffix.lower()
            and parties[0] == "Livrable des mondes"
            and ("ITEM SÉCURITÉ" in brut or "TRAME SÉCURITÉ" in brut)
            and not any(v in brut for v in VARIANTES_OFFICIELLES)
        ):
            fichiers_slot_sans_placeholder.append(str(rel))

    # A4 — items machine à signal DTM_N : enonce ∈ variantes officielles
    import yaml  # dépendance CI déclarée (pyyaml)
    for p in (RACINE / "contenu").rglob("items.yaml"):
        doc = yaml.safe_load(p.read_text(encoding="utf-8"))
        for it in (doc or {}).get("items", []):
            if (it.get("signal") or "").strip() == "DTM_N":
                if it.get("enonce") not in VARIANTES_OFFICIELLES:
                    items_dtm_inconformes.append(f"{p.relative_to(RACINE)}:{it.get('id')}")
    nb_items_dtm = 0
    for p in (RACINE / "contenu").rglob("items.yaml"):
        doc = yaml.safe_load(p.read_text(encoding="utf-8"))
        nb_items_dtm += sum(
            1 for it in (doc or {}).get("items", [])
            if (it.get("signal") or "").strip() == "DTM_N"
        )

    # ── Contrôle d'intégrité du placeholder canonique lui-même ──────
    sha_reel = hashlib.sha256(PLACEHOLDER.encode("utf-8")).hexdigest()
    placeholder_intact = sha_reel == PLACEHOLDER_SHA256_ATTENDU

    # ── Rapport ─────────────────────────────────────────────────────
    total = sum(par_format.values())
    formats_lus = " · ".join(f"{k}:{v}" for k, v in sorted(par_format.items()))
    print("═══ GARDE ÉTENDUE P0 — règle 11-b (FM-027 · finding F.1) ═══")
    print(f"Périmètre scanné : TOUT le dépôt ({RACINE}) — code d'application compris (scan, jamais écriture)")
    print(f"Fichiers texte scannés : {total} — {formats_lus}")
    print(f"Aiguilles A1 (formulations retirées) : {len(FORMULATIONS_RETIREES)} — occurrences trouvées : {len(trouvailles)}")
    for aiguille, rel in trouvailles:
        print(f"    🔴 {aiguille} → {rel}")
    print(f"Aiguille A2 (placeholder intact, sha256 canonique) : {'OK' if placeholder_intact else 'MUTÉ'} — {PLACEHOLDER_SHA256_ATTENDU}")
    if placeholders_mutés:
        print(f"    🔴 occurrences approximatives : {placeholders_mutés}")
    print(f"Aiguille A3 (slot sécurité ⇒ placeholder présent, ddocumentation exemptée) : {len(fichiers_slot_sans_placeholder)} manquant(s)")
    for rel in fichiers_slot_sans_placeholder:
        print(f"    🔴 → {rel}")
    print(f"Aiguille A4 (items machine DTM_N == placeholder) : {nb_items_dtm} item(s) DTM_N — inconformes : {len(items_dtm_inconformes)}")
    for rel in items_dtm_inconformes:
        print(f"    🔴 → {rel}")

    rouge = bool(trouvailles or placeholders_mutés or fichiers_slot_sans_placeholder or items_dtm_inconformes or not placeholder_intact)
    print()
    print("VERDICT GARDE ÉTENDUE : 🔴 ROUGE — fuite(s) restante(s), brûlage incomplet." if rouge
          else "VERDICT GARDE ÉTENDUE : 🟢 VERT — zéro formulation de trame en clair sur tout le dépôt scanné (7 formats).")
    return 1 if rouge else 0


if __name__ == "__main__":
    sys.exit(main())
