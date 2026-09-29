#!/usr/bin/env python3
# ═══════════════════════════════════════════════════════════════════
# PASSE ⑤ — RÉPARATION DÉTERMINISTE DE L'ALTERNANCE D/I (FM-015)
#
# Rôle : corriger la contrainte 5 (alternance D/I — aucun bloc de même
# orientation > 2) SANS re-tirage : la graine 210427 est CONSERVÉE,
# les positions des trames ▲ sont ANCRÉES, les contraintes 1-4 et 6
# restent valides. L'outil ne transcrit jamais à la main : il lit
# melange.json, répare, réécrit.
#
# Algorithme (verrouillé FM-015) :
#   1. scanner le PREMIER triplet mono-orientation (positions i, i+1, i+2)
#   2. chercher un partenaire d'échange k pour la position i+2, par
#      DISTANCE CROISSANTE, parmi les positions non-trame :
#      l'échange (i+2, k) est retenu au premier candidat qui respecte
#      TOUTES les contraintes 1, 2, 4, 6 ET fait STRICTEMENT diminuer
#      l'objectif lexicographique (nombre de blocs ≥3, puis nombre de
#      paires adjacentes de même orientation)
#   3. recommencer jusqu'à absence de triplet — la diminution stricte
#      de l'objectif garantit la terminaison
#
# Exécution :  python3 ci/reparation-passe5.py   (depuis la racine)
# ═══════════════════════════════════════════════════════════════════
import json
from pathlib import Path

RACINE = Path(__file__).resolve().parents[1]
DOSSIER = RACINE / "contenu/mondes/M3-boussole/2.1-valeurs"

import yaml
items_doc = yaml.safe_load((DOSSIER / "items.yaml").read_text(encoding="utf-8"))
orientation = {it["id"]: it["orientation"] for it in items_doc["items"]}
dimension = {it["id"]: (it["dimension"] or None) for it in items_doc["items"]}

mel = json.loads((DOSSIER / "melange.json").read_text(encoding="utf-8"))
seq = [e["code"] for e in sorted(mel["ordre_passation"], key=lambda x: x["position"])]
pos_trames = [p for p, c in enumerate(seq) if any(e["code"] == c and e.get("trame") for e in mel["ordre_passation"])]
ANCHOR = set(pos_trames)
n = len(seq)

def orientations(seq):
    return [orientation[c] for c in seq]

def max_run(xs):
    best = cur = 1
    for a, b in zip(xs, xs[1:]):
        cur = cur + 1 if a == b else 1
        best = max(best, cur)
    return best

def objectif(seq):
    xs = orientations(seq)
    blocs = sum(1 for i in range(len(xs) - 2) if xs[i] == xs[i+1] == xs[i+2])
    paires = sum(1 for a, b in zip(xs, xs[1:]) if a == b)
    return (blocs, paires)

def contraintes_valides(seq):
    # c1 — aucune dimension consécutive (paires dimensionnées)
    for a, b in zip(seq, seq[1:]):
        da, db = dimension[a], dimension[b]
        if da and db and da == db:
            return False, "c1"
    # c2 — trames jamais adjacentes à BE/UN/RE/PO
    interdits = {"bienveillance", "universalisme", "reussite", "pouvoir"}
    for p in ANCHOR:
        for v in (p - 1, p + 1):
            if 0 <= v < n and dimension[seq[v]] in interdits:
                return False, "c2"
    # c4 — distance intra-dimension ≥ 3
    for d in {x for x in dimension.values() if x}:
        ps = [i for i, c in enumerate(seq) if dimension[c] == d]
        for a in range(len(ps)):
            for b in range(a + 1, len(ps)):
                if ps[b] - ps[a] < 3:
                    return False, "c4"
    # c6 — ordre des codes != ordre de passation
    if seq == sorted(seq):
        return False, "c6"
    return True, "ok"

def echange(seq, i, k):
    s = seq[:]
    s[i], s[k] = s[k], s[i]
    return s

obj0 = objectif(seq)
print(f"état initial : run max = {max_run(orientations(seq))} · objectif = {obj0} · trames ancrées aux positions {[p+1 for p in sorted(ANCHOR)]}")
echanges = 0
while True:
    xs = orientations(seq)
    triplet = next((i for i in range(n - 2) if xs[i] == xs[i+1] == xs[i+2]), None)
    if triplet is None:
        break
    i2 = triplet + 2
    fait = False
    for dist in range(1, n):
        for k in (i2 - dist, i2 + dist):
            if not (0 <= k < n) or k == i2 or k in ANCHOR or i2 in ANCHOR:
                continue
            cand = echange(seq, i2, k)
            ok, _ = contraintes_valides(cand)
            if ok and objectif(cand) < objectif(seq):
                print(f"  échange n°{echanges+1} : pos {i2+1} ({seq[i2]}) ↔ pos {k+1} ({seq[k]}) — objectif {objectif(seq)} → {objectif(cand)}")
                seq = cand
                echanges += 1
                fait = True
                break
        if fait:
            break
    if not fait:
        raise SystemExit(f"bloqué : aucun échange valide pour le triplet en pos {triplet+1}..{triplet+3} (l'outil ne transmute pas les contraintes)")

ok, quoi = contraintes_valides(seq)
assert ok, f"contrainte {quoi} violée en sortie"
print(f"état final   : run max = {max_run(orientations(seq))} · objectif = {objectif(seq)} · échanges totaux = {echanges}")
print(f"positions modifiées : {sum(1 for a, b in zip(seq, [e['code'] for e in sorted(mel['ordre_passation'], key=lambda x: x['position'])]) if a != b)}/{n}")

# ── Réécriture de melange.json (zéro transcription manuelle) ──
ancien = {e["code"]: e for e in mel["ordre_passation"]}
nouvel_ordre = []
for pos, code in enumerate(seq, start=1):
    e = {"position": pos, "code": code}
    if code in ANCHOR_CODES if False else False:
        pass
    if any(p + 1 == pos for p in ANCHOR):
        e["trame"] = ancien[code].get("trame", "DTM_N")
    nouvel_ordre.append(e)
mel["ordre_passation"] = nouvel_ordre
mel["contraintes"][4]["detail"] = f"rejeu FM-015 : runs max D/I en passation = {max_run(orientations(seq))} (trames incluses et hors trames)"
mel["historique"].append({
    "date": "2026-09-28",
    "evenement": "passe ⑤ de réparation alternance D/I (FM-015 — finding CI-07 : 7 D consécutifs en tête déclarés 'pass')",
    "resultat": f"graine 210427 CONSERVÉE · trames ancrées (pos {' · '.join(str(p+1) for p in sorted(ANCHOR))}) · {echanges} échanges déterministes · run max {max_run(orientations(seq))} · contraintes 1-4 et 6 re-validées · séquence réécrite par l'outil (zéro transcription manuelle)"
})
(DOSSIER / "melange.json").write_text(json.dumps(mel, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print("melange.json réécrit.")
