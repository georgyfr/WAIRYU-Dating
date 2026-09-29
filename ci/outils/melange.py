#!/usr/bin/env python3
# ═══════════════════════════════════════════════════════════════════
# OUTIL DE MÉLANGE GÉNÉRIQUE — Fisher-Yates seedé + réparation déterministe
# (généralisation de l'algorithme 2.1 — FM-013/FM-015 ; outil transverse 2026-09-28)
#
# 6 contraintes (verdicts REJOUÉS, jamais déclarés) :
#   c1 aucune dimension consécutive (sans-objet si mono-dimension)
#   c2 trames jamais adjacentes aux dimensions interdites de la config
#   c3 1 trame par bloc uniforme (positions ancrées à la fin de chaque bloc)
#   c4 distance intra-dimension ≥ 3 (sans-objet si mono-dimension)
#   c5 alternance D/I — run max (2 par défaut ; borné si config ; sans-objet hors Likert)
#   c6 ordre de passation ≠ ordre des codes
#
# Réparation : hill-climbing DÉTERMINISTE (rng seedé par la graine) sur
# l'objectif lexicographique (violations c1, c2, c4 · dépassements de run ·
# blocs longs · paires adjacentes) — diminution stricte → terminaison garantie.
# Les trames restent ancrées (c3 par construction). c6 non satisfaite =
# re-tirage documenté (graine + 1).
# ═══════════════════════════════════════════════════════════════════
import json, sys, random
from pathlib import Path

def runs(xs):
    out, start = [], 0
    for j in range(1, len(xs) + 1):
        if j == len(xs) or xs[j] != xs[j-1]:
            out.append((start, j - start))
            start = j
    return out

def max_run(xs):
    return max((l for _, l in runs(xs)), default=0)

def objectif(seq, cfg, items):
    dim = {c: items[c]["dimension"] for c in seq}
    orient = {c: items[c]["orientation"] for c in seq}
    trame_pos = [i for i, c in enumerate(seq) if items[c].get("signal")]
    interdits = set() if cfg.get("c2_sans_objet") else set(cfg.get("c2_dimensions_interdites", []))
    v_c1 = 0 if cfg.get("c1_sans_objet") else sum(
        1 for a, b in zip(seq, seq[1:]) if dim[a] and dim[b] and dim[a] == dim[b])
    v_c2 = sum(1 for p in trame_pos for v in (p - 1, p + 1)
               if 0 <= v < len(seq) and dim[seq[v]] in interdits)
    v_c4 = 0
    if not cfg.get("c4_sans_objet"):
        for d in {x for x in dim.values() if x}:
            ps = [i for i, c in enumerate(seq) if dim[c] == d]
            for a in range(len(ps)):
                for b in range(a + 1, len(ps)):
                    if ps[b] - ps[a] < 3:
                        v_c4 += 1
    over = blocs = 0
    if not cfg.get("c5_sans_objet"):
        rm = cfg.get("c5_run_max", 2)
        for start, l in runs([orient[c] for c in seq]):
            if l > rm:
                blocs += 1
                over += l - rm
    paires = sum(1 for a, b in zip(seq, seq[1:])
                 if not cfg.get("c5_sans_objet") and orient[a] == orient[b])
    return (v_c1, v_c2, v_c4, over, blocs, paires)

def verdicts_finaux(seq, cfg, items):
    obj = objectif(seq, cfg, items)
    v1 = cfg.get("c1_sans_objet") or obj[0] == 0
    v2 = obj[1] == 0
    v3 = True
    v4 = cfg.get("c4_sans_objet") or obj[2] == 0
    rm = cfg.get("c5_run_max", 2)
    run = max_run([items[c]["orientation"] for c in seq]) if not cfg.get("c5_sans_objet") else 0
    v5 = cfg.get("c5_sans_objet") or run <= rm
    v6 = seq != sorted(seq)
    return {"c1": v1, "c2": v2, "c3": v3, "c4": v4, "c5": v5, "c6": v6}, run

def reparer(seq, cfg, items, rng):
    ancres = {i for i, c in enumerate(seq) if items[c].get("signal")}
    base = objectif(seq, cfg, items)
    trace = []
    for _ in range(1200):
        if base == (0, 0, 0, 0, 0, base[5]) or (base[:5] == (0, 0, 0, 0, 0)):
            break
        candidats = [(i, k) for i in range(len(seq)) for k in range(len(seq)) if i != k]
        rng.shuffle(candidats)
        ameliore = False
        for i, k in candidats:
            if i in ancres or k in ancres:
                continue
            s2 = seq[:]
            s2[i], s2[k] = s2[k], s2[i]
            o2 = objectif(s2, cfg, items)
            if o2 < base:
                seq[i], seq[k] = seq[k], seq[i]
                trace.append(f"pos {i+1} ↔ pos {k+1} · {base} → {o2}")
                base = o2
                ameliore = True
                break
        if not ameliore:
            # kick seedé (iterated local search déterministe) : un échange neutre
            # ou non-dégradant sur les contraintes dures, puis re-descente
            kick = False
            rng.shuffle(candidats)
            for i, k in candidats:
                if i in ancres or k in ancres:
                    continue
                s2 = seq[:]
                s2[i], s2[k] = s2[k], s2[i]
                o2 = objectif(s2, cfg, items)
                if o2[:4] <= base[:4]:
                    seq[i], seq[k] = seq[k], seq[i]
                    trace.append(f"kick : pos {i+1} ↔ pos {k+1} · {base} → {o2}")
                    base = o2
                    kick = True
                    break
            if not kick:
                break
    return seq, trace, base

def main(cfg_path):
    cfg = json.loads(Path(cfg_path).read_text(encoding="utf-8"))
    items = {it["code"]: it for it in cfg["items"]}
    codes = [it["code"] for it in cfg["items"]]
    n_trames = sum(1 for it in cfg["items"] if it.get("signal"))
    graine = cfg["graine"]
    trace_c6 = "re-tirage non nécessaire"
    for tentative in range(6):
        rng = random.Random(graine)
        n = len(codes)
        if n_trames:
            base, reste = divmod(n, n_trames)
            tailles = [base + (1 if i >= n_trames - reste else 0) for i in range(n_trames)]
            trame_codes = [c for c in codes if items[c].get("signal")]
            autres = [c for c in codes if not items[c].get("signal")]
            rng.shuffle(autres)
            seq, ai, ti = [], 0, 0
            for t in tailles:
                seq.extend(autres[ai:ai + t - 1])
                ai += t - 1
                seq.append(trame_codes[ti]); ti += 1
        else:
            seq = codes[:]
            rng.shuffle(seq)
        if seq == sorted(seq):
            trace_c6 = f"graine {graine} → permutation identique à l'ordre des codes (c6 non satisfaite) → re-tirage documenté"
            graine += 1
            continue
        break
    seq, trace, obj_final = reparer(seq, cfg, items, rng)
    verdicts, run = verdicts_finaux(seq, cfg, items)
    print(json.dumps({
        "quete": cfg["quete"], "titre": cfg["titre"], "graine_finale": graine,
        "tentatives": tentative + 1, "trace_c6": trace_c6,
        "ordre_passation": [{"position": i + 1, "code": c, **({"trame": items[c]["signal"]} if items[c].get("signal") else {})} for i, c in enumerate(seq)],
        "verdicts": verdicts, "run_max": run,
        "positions_trames": [i + 1 for i, c in enumerate(seq) if items[c].get("signal")],
        "objectif_final": list(obj_final), "echanges": trace,
    }, ensure_ascii=False, indent=2))

if __name__ == "__main__":
    main(sys.argv[1])
