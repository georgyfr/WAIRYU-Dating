#!/usr/bin/env python3
# ═══════════════════════════════════════════════════════════════════
# HARNAIS P0 RUNTIME — 12 vérifications machine (mission P0 implémentation)
#
# Chaque check est reproductible : lecture des fichiers du dépôt + grep
# + rejeu d'outils existants (garde étendue, smoke a11y). Un check rouge
# = un finding runtime non traité. Verdict : « HARNAIS P0 : n/12 ».
#
# Exécution : python3 ci/harnais_p0.py   (racine du dépôt)
# ═══════════════════════════════════════════════════════════════════

import hashlib
import json
import re
import subprocess
import sys
from pathlib import Path

RACINE = Path(__file__).resolve().parents[1]
PLACEHOLDER_SHA = "0d90aef535aca2cfbbeed2b1e7796930825fc102f27040fc1be628e9f111f8cb"
PLACEHOLDER_COURT = PLACEHOLDER_SHA[:8]

resultats: list[tuple[str, bool, str]] = []


def check(ref: str, ok: bool, detail: str) -> None:
    resultats.append((ref, ok, detail))
    print(f"  {'✅' if ok else '🔴'} {ref} — {detail}")


def lit(chemin: str) -> str:
    return (RACINE / chemin).read_text(encoding="utf-8")


def existe(chemin: str) -> bool:
    return (RACINE / chemin).exists()


def grep_count(motif: str, texte: str) -> int:
    return len(re.findall(motif, texte))


def main() -> int:
    print("═══ HARNAIS P0 RUNTIME — 12 vérifications machine ═══\n")

    # ── H-01 (F.2a) — banque doctrine : 531 items, 0 générique ──────
    seed = lit("apps/api/migrations/0022_q_doctrine_seed.sql")
    m21 = lit("apps/api/migrations/0021_questionnaire_doctrine.sql")
    n_seed = grep_count(r"INSERT INTO q_doctrine_items", seed)
    gen_seed = grep_count(r"VALUES \('n[12]_", seed)
    retirés = "UPDATE q_items SET active = 0" in m21
    j = json.loads(lit("scripts/q_items_runtime.json"))
    check(
        "H-01 F.2a banque 531/0 générique",
        n_seed == 531 and gen_seed == 0 and retirés and j["meta"]["counts"]["total"] == 531,
        f"seed {n_seed} items · génériques {gen_seed} · banque générique désactivée: {retirés} · JSON {j['meta']['counts']['total']}",
    )

    # ── H-02 (F.2a) — intégrité des codes doctrine ───────────────────
    codes = [i["code"] for i in j["items"]]
    uniq = len(set(codes)) == len(codes)
    # Format gelé : Qx.y-NN (items) · Qx.y-Tnn (trames ▲) · suffixes de
    # formats spéciaux (C=choix 1.5 · É=énigmes 1.6 · P=paires 3.6 ·
    # S=scénarios 6.1) — 21 codes concernés, constat machine Task 33-a.
    fmt_ok = all(re.match(r"^Q\d+\.\d+-(T?\d+|C\d+|É\d+|P\d+|S\d+)$", c) for c in codes)
    check("H-02 F.2a codes uniques et format gelé", uniq and fmt_ok, f"{len(codes)} codes · uniques: {uniq} · format: {fmt_ok}")

    # ── H-03 (F.1 / 11-b) — trames = placeholder officiel + garde VERT ─
    trames = [i for i in j["items"] if i.get("is_trame")]
    ph_ok = 0
    for t in trames:
        sha = hashlib.sha256(t["enonce"].strip().encode("utf-8")).hexdigest()
        if sha == PLACEHOLDER_SHA or t["enonce"].strip() + "\n" and hashlib.sha256((t["enonce"].strip() + "\n").encode()).hexdigest() == PLACEHOLDER_SHA:
            ph_ok += 1
    garde = subprocess.run(
        [sys.executable, str(RACINE / "ci" / "outils" / "garde_p0.py")],
        capture_output=True, text=True, cwd=RACINE,
    )
    check(
        "H-03 11-b trames = placeholder officiel + garde VERT",
        ph_ok == len(trames) and garde.returncode == 0,
        f"{ph_ok}/{len(trames)} trames au placeholder ({PLACEHOLDER_COURT}…) · garde_p0 exit {garde.returncode}",
    )

    # ── H-04 (G.1a) — mécanisme de trames runtime (env/DO, 11-b) ─────
    trames_lib = lit("apps/api/src/lib/trames.ts") if existe("apps/api/src/lib/trames.ts") else ""
    quest = lit("apps/api/src/routes/questionnaire.ts")
    check(
        "H-04 G.1a chargeur trames runtime",
        "loadTrame" in trames_lib and "TRAME_" in trames_lib and "trames.get(r.code)" in quest,
        "lib/trames.ts (env TRAME_*, zéro log) + substitution à la volée dans GET /qd",
    )

    # ── H-05 (F.2b) — le moteur expose les 14 codes du registre ──────
    reg = json.loads(lit("contrat/registres/signaux.json"))
    codes_registre = sorted(c["code"] for c in reg["codes"])
    vig = lit("packages/shared/src/vigilance.ts")
    m = re.search(r"export const SIGNAL_CODES: SignalCode\[\] = \[(.*?)\];", vig, re.DOTALL)
    codes_moteur = sorted(re.findall(r"'([A-Z_0-9]+)'", m.group(1))) if m else []
    check("H-05 F.2b 14 signaux == registre", codes_moteur == codes_registre, f"{codes_moteur}")

    # ── H-06 (F.2b / BLOC 2) — COC double assurance · Q1.7 · matrice ──
    coc = "double assurance 6.2×8.3" in vig and "plafonné à « moyen »" in vig
    q17 = "Q17_TDAH_THRESHOLD_SHIFT" in vig and "seuils relâchés" in vig
    mat = "SIG-4.4-06" in vig and "Méfiance × RSQ" in vig and "protection" in vig
    snapshot = "matricePuits" in quest and "pitMatrix(" in quest
    check("H-06 F.2b COC 6.2×8.3 + Q1.7/TDAH + matrice SIG-4.4-06", coc and q17 and mat and snapshot,
          f"COC double assurance: {coc} · Q1.7: {q17} · matrice: {mat} · snapshot: {snapshot}")

    # ── H-07 (B.5d) — seuils dans PSYCHOMETRY + env override, zéro dur ─
    consts = lit("packages/shared/src/constants.ts")
    matching = lit("packages/shared/src/matching.ts")
    personality = lit("packages/shared/src/personality.ts")
    override = "PSYCHOMETRY_OVERRIDE" in consts and "mergePsychometryOverride" in vig
    comite = "À VALIDER PAR LE COMITÉ" in consts
    plus_72 = not re.search(r">= 72\b", matching)
    plus_55 = not re.search(r"< 55\b", matching)
    plus_10 = not re.search(r"= 10;", personality)
    psy_used = "PSYCHOMETRY.FORCES_DIM_THRESHOLD" in matching and "PSYCHOMETRY.N1_MIN_ANSWERS" in personality
    # faux « vigilanceScore » (re-audit : matching.ts:290 — min de dimensions
    # qui N'ÉTAIT PAS un signal du moteur) : supprimé et renommé lowestDimScore.
    # V16 R6.3 (P4-F7) : la regex historique ne catchait que les déclarations
    # let/const/var — élargie aux déclarations function/class/public/private/
    # static ET aux affectations SANS déclaration (y c. propriété obj.vigilanceScore).
    faux_vigilance = (
        not re.search(r"\b(let|const|var)\s+vigilanceScore\b", matching)
        and not re.search(r"\b(function|class|public|private|static)\s+vigilanceScore\b", matching)
        and not re.search(r"\bvigilanceScore\b\s*(?::\s*[\w<>\[\]|]+\s*)?=[^=]", matching)
        and "lowestDimScore" in matching
    )  # le mot peut rester dans le commentaire de traçabilité — seules les DÉCLARATIONS et AFFECTATIONS comptent
    check("H-07 B.5d seuils PSYCHOMETRY + env override + faux vigilanceScore retiré",
          override and comite and plus_72 and plus_55 and plus_10 and psy_used and faux_vigilance,
          f"override: {override} · verrou comité: {comite} · 72/55/10 retirés: {plus_72}/{plus_55}/{plus_10} · import PSYCHOMETRY: {psy_used} · faux vigilanceScore retiré: {faux_vigilance}")

    # ── H-08 (B.5b) — response_ms de bout en bout ────────────────────
    col = "response_ms" in m21
    api = "responseMs" in quest and "response_ms = excluded.response_ms" in quest
    web_files = list((RACINE / "apps" / "web" / "src").rglob("*.tsx"))
    web = sum(grep_count(r"responseMs", f.read_text(encoding="utf-8")) for f in web_files)
    check("H-08 B.5b response_ms end-to-end", col and api and web > 0,
          f"colonne migration: {col} · API: {api} · front: {web} occurrence(s)")

    # ── H-09 (B.5c) — détecteurs psychométriques + R6 ────────────────
    det = all(x in vig for x in ("detectStraightLining", "detectRandomPattern", "r6Incoherent"))
    r6c = "R6_MAX_INCOHERENCE" in consts and "R6_MAX_INCOHERENCE" in vig
    branché = "detectStraightLining(likert)" in quest and "r6Incoherent(d, i)" in quest
    check("H-09 B.5c détecteurs + R6", det and r6c and branché,
          f"détecteurs: {det} · seuil en constants: {r6c} · branchés API: {branché}")

    # ── H-10 (F.3/F.4/C.3.1) — âge, mineur, admin nommé ──────────────
    # V16 R6.1 (audit V1.2) : l'ancienne regex « reviewed_by = 'token' »
    # imposait les ESPACES — elle ratait admin.ts:41 reviewed_by='token' et
    # les usages réels. Regex élargie sans espaces obligatoires + scope
    # safety.ts + check spécifique de la dégradation adminIdentity ?? 'token'
    # (0 attendu après correction R4).
    auth = lit("apps/api/src/routes/auth.ts")
    safety_ts = lit("apps/api/src/routes/safety.ts")
    inserts = grep_count(r"INSERT INTO users \([^)]*birth_year[^)]*birth_date", auth)
    age_lib = existe("apps/api/src/lib/age.ts") and "18" in lit("apps/api/src/lib/age.ts")
    m23 = lit("apps/api/migrations/0023_safety_aggregate.sql")
    trigger = "strftime('%Y','now')" in m23 and "RAISE(ABORT" in m23
    minor = "signup_minor_refused" in auth or "minor_ban" in auth or "minor_ban" in lit("apps/api/src/routes/profiles.ts")
    admin = lit("apps/api/src/routes/admin.ts")
    motif_token = r"reviewed_by\s*=\s*['\"]token['\"]"
    motif_degrade = r"adminIdentity\s*\?\?\s*['\"]token['\"]"
    no_token = (
        grep_count(motif_token, admin) == 0
        and grep_count(motif_token, auth) == 0
        and grep_count(motif_token, safety_ts) == 0
        and grep_count(motif_degrade, admin) == 0
        and grep_count(motif_degrade, safety_ts) == 0
        and "requireAdminIdentity" in admin
    )
    check("H-10 F.3/F.4/C.3.1 âge + mineur + admin nommé (élargi V16 R6.1)", inserts == 3 and age_lib and trigger and minor and no_token,
          f"INSERT avec âge: {inserts}/3 · validateur: {age_lib} · trigger dynamique: {trigger} · chemin mineur: {minor} · 'token' (regex espaces libres + safety + dégradation adminIdentity): {no_token}")

    # ── H-11 (C.5.1/C.5.2/C.8.4) — agrégat, recours, purge DO ────────
    safety = lit("apps/api/src/routes/safety.ts")
    agg = "report_aggregate" in m23 and "recomputeReportAggregate" in safety
    appeal = "sanctions/:id/appeal" in safety
    do = lit("apps/api/src/do/chat-room.ts")
    purge = "365" in do and "alarm" in do
    check("H-11 C.5.1/C.5.2/C.8.4 agrégat + recours + purge DO", agg and appeal and purge,
          f"report_aggregate: {agg} · POST appeal: {appeal} · purge 365j DO: {purge}")

    # ── H-12 (B.5a/G.3b/G.4a) — export RGPD EXHAUSTIF + registre + smoke ──
    # V16 R6.2 (audit V1.2) : l'ancien check se contentait de 4 mots-clés —
    # il ne vérifiait ni l'ENDPOINT d'export (route définie), ni la liste
    # EXHAUSTIVE des tables RGPD du rapport V1.2 (q_answers/doctrine +
    # personality + swipes + matches + conversations + sanctions + appeals +
    # sessions + consentements), ni le déploiement du registre (R1).
    export_route = "authRoutes.get('/account/export'" in auth
    export_tables = all(
        x in auth
        for x in (
            "FROM q_answers",
            "FROM q_doctrine_answers",
            "FROM personality_profiles",
            "FROM swipes",
            "FROM matches",
            "FROM conversations",
            "FROM sanctions",
            "FROM sanctions_appeals",
            "FROM sessions",
            "profile_consent_at",
        )
    )
    registre = existe("apps/web/public/legal/registre.md")
    smoke = subprocess.run(
        [sys.executable, str(RACINE / "ci" / "outils" / "a11y_smoke.py")],
        capture_output=True, text=True, cwd=RACINE,
    )
    check("H-12 B.5a/G.3b/G.4a export RGPD exhaustif + registre + smoke a11y (élargi V16 R6.2)",
          export_route and export_tables and registre and smoke.returncode == 0,
          f"endpoint: {export_route} · tables RGPD exhaustives: {export_tables} · registre.md déployé: {registre} · a11y_smoke exit {smoke.returncode}")

    # ── Verdict ──────────────────────────────────────────────────────
    passes = sum(1 for _, ok, _ in resultats if ok)
    print(f"\n{'═══ ' if True else ''}VERDICT HARNAIS P0 : {passes}/12" + (" — VERT 🟢" if passes == 12 else " — ROUGE 🔴"))
    if passes != 12:
        for ref, ok, d in resultats:
            if not ok:
                print(f"  🔴 ÉCHEC {ref}: {d}")
    return 0 if passes == 12 else 1


if __name__ == "__main__":
    sys.exit(main())
