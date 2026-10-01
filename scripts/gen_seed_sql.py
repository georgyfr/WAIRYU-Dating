#!/usr/bin/env python3
# ═══════════════════════════════════════════════════════════════════
# GÉNÉRATEUR DE SEED — banque doctrine runtime (BLOC 1, finding F.2a)
#
# Lit scripts/q_items_runtime.json (extraction machine Task 33-a des 48
# tableaux de « Livrable des mondes ») et produit la migration
# apps/api/migrations/0022_q_doctrine_seed.sql — INSERTs idempotents.
#
# Contrôles inclus (le générateur REFUSE d'écrire si un contrôle échoue) :
#   · total == 531 (comptage contrat — CI-01 : 570 = 540 + 30 · 531 produits) ;
#   · zéro code générique (n1_q/n2_q) ;
#   · codes uniques ;
#   · les trames (is_trame) portent le PLACEHOLDER OFFICIEL (sha256 0d90aef5…)
#     — interdiction 11-b : aucune formulation de trame dans le dépôt ;
#   · sha256 du placeholder vérifié par item trame.
# Re-exécution : python3 scripts/gen_seed_sql.py   (racine du dépôt)
# ═══════════════════════════════════════════════════════════════════

import hashlib
import json
import sqlite3  # pour l'échappement SQL via quote — stdlib uniquement
import sys
from pathlib import Path

RACINE = Path(__file__).resolve().parents[1]
JSON_SRC = RACINE / "scripts" / "q_items_runtime.json"
SQL_OUT = RACINE / "apps" / "api" / "migrations" / "0022_q_doctrine_seed.sql"

PLACEHOLDER_SHA = "0d90aef535aca2cfbbeed2b1e7796930825fc102f27040fc1be628e9f111f8cb"
TOTAL_ATTENDU = 531


def q(s: str | None) -> str:
    """Littéral SQL échappé (None → NULL)."""
    if s is None:
        return "NULL"
    return "'" + str(s).replace("'", "''") + "'"


def main() -> int:
    data = json.loads(JSON_SRC.read_text(encoding="utf-8"))
    items = data["items"]

    # ── Contrôles bloquants ─────────────────────────────────────────
    erreurs = []
    codes = [i["code"] for i in items]
    if len(items) != TOTAL_ATTENDU:
        erreurs.append(f"total {len(items)} ≠ {TOTAL_ATTENDU}")
    if len(set(codes)) != len(codes):
        doublons = sorted({c for c in codes if codes.count(c) > 1})
        erreurs.append(f"codes en double : {doublons[:5]}…")
    genériques = [c for c in codes if c.startswith(("n1_", "n2_"))]
    if genériques:
        erreurs.append(f"codes génériques interdits : {genériques[:5]}…")

    trames = [i for i in items if i.get("is_trame")]
    for t in trames:
        sha = hashlib.sha256((t["enonce"].strip() + "\n").encode("utf-8")).hexdigest()
        sha_sans_nl = hashlib.sha256(t["enonce"].strip().encode("utf-8")).hexdigest()
        if PLACEHOLDER_SHA not in (sha, sha_sans_nl):
            erreurs.append(f"trame {t['code']} : enonce ≠ placeholder officiel (sha {sha[:8]})")
    if erreurs:
        print("🔴 GÉNÉRATION REFUSÉE — contrôles bloquants :")
        for e in erreurs:
            print("  🔴", e)
        return 1

    # ── Émission SQL ────────────────────────────────────────────────
    now = 1790121600  # cohérent avec la seed 0009 (epoch fixe — builds reproductibles)
    lignes = [
        "-- 0022_q_doctrine_seed.sql — GÉNÉRÉ par scripts/gen_seed_sql.py — NE PAS ÉDITER.",
        f"-- Source : scripts/q_items_runtime.json (sha256 "
        f"{hashlib.sha256(JSON_SRC.read_bytes()).hexdigest()[:12]}…) — {len(items)} items doctrine, 0 générique.",
        f"-- Trames ▲ : {len(trames)} — prompt = placeholder officiel (sha256 {PLACEHOLDER_SHA[:8]}…) — règle 11-b.",
        "-- Rejouable : les INSERT sont idempotents (ON CONFLICT DO UPDATE).",
        "",
    ]
    for i in items:
        vals = [
            q(i["code"]), "1", q(i["monde"]), q(i["quete"]),
            str(i["position"]) if i.get("position") is not None else "NULL",
            q(i.get("orientation")), q(i.get("carte_id")), q(i.get("facette")),
            q(i.get("paire")), q(i.get("signal_id")),
            "1" if i.get("is_trame") else "0", q(i.get("format", "likert5")),
            q(i["enonce"]), "1", str(now),
        ]
        lignes.append(
            "INSERT INTO q_doctrine_items (code, version, monde, quete, position, orientation, "
            "carte_id, facette, paire, signal_id, is_trame, format, prompt, active, created_at) "
            "VALUES (" + ", ".join(vals) + ") "
            "ON CONFLICT(code) DO UPDATE SET prompt = excluded.prompt, signal_id = excluded.signal_id, "
            "is_trame = excluded.is_trame, format = excluded.format, position = excluded.position, "
            "orientation = excluded.orientation, carte_id = excluded.carte_id, facette = excluded.facette, "
            "paire = excluded.paire;"
        )
    SQL_OUT.write_text("\n".join(lignes) + "\n", encoding="utf-8")

    # ── Contrôle final : le SQL généré s'exécute (sqlite3 stdlib) ──
    con = sqlite3.connect(":memory:")
    con.execute("""
    CREATE TABLE q_doctrine_items (
      code TEXT PRIMARY KEY, version INTEGER NOT NULL DEFAULT 1, monde TEXT NOT NULL,
      quete TEXT NOT NULL, position INTEGER,
      orientation TEXT CHECK (orientation IN ('D','I') OR orientation IS NULL),
      carte_id TEXT, facette TEXT, paire TEXT, signal_id TEXT,
      is_trame INTEGER NOT NULL DEFAULT 0, format TEXT NOT NULL DEFAULT 'likert5',
      prompt TEXT NOT NULL, active INTEGER NOT NULL DEFAULT 1, created_at INTEGER NOT NULL)""")
    con.executescript(SQL_OUT.read_text(encoding="utf-8"))
    n, tr = con.execute("SELECT COUNT(*), SUM(is_trame) FROM q_doctrine_items").fetchone()
    if n != TOTAL_ATTENDU or tr != len(trames):
        print(f"🔴 Rejeu SQL incohérent : {n} items / {tr} trames")
        return 1
    print(f"🟢 0022_q_doctrine_seed.sql généré et REJOUÉ en mémoire : {n} items · {tr} trames · 0 générique")
    print(f"   sha256 seed : {hashlib.sha256(SQL_OUT.read_bytes()).hexdigest()}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
