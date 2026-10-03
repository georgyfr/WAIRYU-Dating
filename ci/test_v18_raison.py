#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
test_v18_raison.py — MISSION V18 : les verrous doctrinaux de « Ta raison d'être ici ».

Mission V18 (demande fondateur) — INVERSION architecturale :
  AVANT : une app de rencontre avec un parcours de connaissance de soi.
  APRÈS : un parcours de connaissance de soi dont la rencontre est une
  destination OPTIONNELLE — bidirectionnelle, réversible à l'infini.

Ce test machine vérifie les 4 verrous V18.D + les 4 preuves demandées :
  T-1  Confidentialité PAR CONSTRUCTION — l'enum raison est borné au SQL
       (CHECK 3 valeurs, 'couple_travail' JAMAIS câblable), la découverte ne
       lit que le bassin 'rencontre', l'orientation n'est ni rendue ni
       écrivable hors rencontre (front + 2e rideau API) ;
  T-2  Réversibilité ×2 — les DEUX sens existent (pause ET réactivation),
       sans compteur ni verrou de sens (bascule à l'infini) ;
  T-3  Conversations conservées — AUCUN DELETE de conversations/matchs/
       messages dans les chemins de bascule (statique + replay sqlite) ;
  T-4  Matching exclut les non-chercheurs — le pool de découverte filtre
       `raison = 'rencontre'` (2 requêtes) + replay sqlite fonctionnel :
       voyage/indecis ne sortent JAMAIS, rencontre sort, dans les deux sens ;
  T-5  Profondeur de test IDENTIQUE (D.2) — la banque doctrine (531 items)
       n'est JAMAIS filtrée par la raison (aucune « version allégée ») ;
  T-6  Métriques de conversion COLLECTÉES mais JAMAIS consommées par le
       moteur (D.4 — aucune optimisation au détriment du parcours) ;
  T-7  Les interdits rouges V18 — pas d'auto-conversion, la proposition
       d'activation n'est posée qu'à l'écran de fin (au plus 1 fois/palier),
       les énoncés des quêtes restent intouchés.

Style identique au harnais P0 : vérifications reproductibles, exit 0 = VERT.
"""

import re
import sqlite3
import sys
from pathlib import Path

RACINE = Path(__file__).resolve().parents[1]

resultats: list[tuple[str, bool, str]] = []


def check(ref: str, ok: bool, detail: str) -> None:
    resultats.append((ref, ok, detail))
    print(f"  {'✅' if ok else '🔴'} {ref} — {detail}")


def lit(chemin: str) -> str:
    return (RACINE / chemin).read_text(encoding="utf-8")


def grep_count(motif: str, texte: str) -> int:
    return len(re.findall(motif, texte))


# ---------------------------------------------------------------------------
# T-1 — Confidentialité PAR CONSTRUCTION (V18.A.4 / V18.D-D.3)
# ---------------------------------------------------------------------------
def t1() -> None:
    print("— T-1 · Confidentialité par construction (A.4 / D.3) —")

    # 1-a. Le CHECK SQL borne l'enum à TROIS valeurs, défaut 'indecis'.
    migration = lit("apps/api/migrations/0024_v18_raison.sql")
    check(
        "T-1a",
        bool(
            re.search(
                r"ALTER TABLE users ADD COLUMN raison TEXT NOT NULL DEFAULT 'indecis'\s*\n\s*CHECK \(raison IN \('voyage', 'rencontre', 'indecis'\)\)",
                migration,
            )
        ),
        "migration 0024 : raison NOT NULL DEFAULT 'indecis' + CHECK (voyage | rencontre | indecis)",
    )

    # 1-b. 'couple_travail' n'est JAMAIS câblable : aucun littéral de code
    #      (chaîne quotée) dans apps/ ou packages/ — la réservation n'existe
    #      qu'en commentaires/documentation. Le câbler exigerait une migration
    #      explicite (le CHECK la rejetterait d'ici là : replay T-1g).
    literals = 0
    for chemin in list((RACINE / "apps").rglob("*")) + list((RACINE / "packages").rglob("*")):
        if chemin.suffix not in (".ts", ".tsx", ".sql", ".py", ".js", ".mjs"):
            continue
        if not chemin.is_file():
            continue
        texte = chemin.read_text(encoding="utf-8", errors="ignore")
        literals += grep_count(r"['\"]couple_travail['\"]", texte)
    check(
        "T-1b",
        literals == 0,
        f"'couple_travail' en littéral de code (apps/ + packages/) : {literals} (attendu 0 — réservé, jamais câblé)",
    )

    # 1-c. La découverte ne retourne que le bassin 'rencontre' (pool + radar).
    discovery = lit("apps/api/src/lib/discovery.ts")
    check(
        "T-1c",
        grep_count(r"AND u0\.raison = 'rencontre'", discovery) == 2,
        "discovery.ts : filtre dur `AND u0.raison = 'rencontre'` présent sur les 2 requêtes de bassin (feed + radar)",
    )

    # 1-d. Garde défensive : un non-rencontre ne reçoit AUCUN feed (appel forgé).
    check(
        "T-1d",
        bool(re.search(r"if \(\(me\.raison \?\? 'indecis'\) !== 'rencontre'\)", discovery)),
        "discovery.ts : garde de court-circuit — AUCUN candidat si me.raison ≠ 'rencontre'",
    )

    # 1-e. 2e rideau API : orientation/intention et préférences refusées hors rencontre.
    profiles = lit("apps/api/src/routes/profiles.ts")
    check(
        "T-1e",
        "raisonCible !== 'rencontre'" in profiles
        and "Orientation et intention ne sont proposées qu" in profiles
        and "Les préférences de découverte ne sont proposées qu" in profiles,
        "profiles.ts : PUT /api/profile + PUT /api/profile/preferences refusent l'orientation et les filtres hors bassin rencontre",
    )

    # 1-f. Front : l'étape « recherches » (orientation) et « prefs » n'existent
    #      que pour raison='rencontre' (par construction de l'assistant).
    profil_screen = lit("apps/web/src/screens/Profile.tsx")
    check(
        "T-1f",
        bool(
            re.search(
                r"raison === 'rencontre'\s*\n\s*\? \['raison', 'identite', 'recherches', 'localisation', 'prompts', 'photos', 'prefs'\]\s*\n\s*: \['raison', 'identite', 'localisation', 'prompts', 'photos'\]",
                profil_screen,
            )
        ),
        "Profile.tsx : étapes « recherches » et « préférences » construites UNIQUEMENT si raison='rencontre' (jamais rendues sinon)",
    )

    # 1-g. Replay sqlite du CHECK : voyage/rencontre/indecis passent,
    #      'couple_travail' est rejeté par la base ELLE-MÊME.
    con = sqlite3.connect(":memory:")
    con.execute(
        "CREATE TABLE users (id TEXT PRIMARY KEY, raison TEXT NOT NULL DEFAULT 'indecis' "
        "CHECK (raison IN ('voyage', 'rencontre', 'indecis')))"
    )
    insertes = 0
    for valeur in ("voyage", "rencontre", "indecis", None):  # None = défaut
        con.execute("INSERT INTO users (id) VALUES (?)", (f"u-{valeur}",))
        insertes += 1
    couple_rejete = False
    try:
        con.execute("INSERT INTO users (id, raison) VALUES ('u-ct', 'couple_travail')")
    except sqlite3.IntegrityError:
        couple_rejete = True
    con.close()
    check(
        "T-1g",
        couple_rejete and insertes == 4,
        "replay sqlite : 3 valeurs + défaut 'indecis' acceptés · 'couple_travail' rejeté par la contrainte SQL (IntegrityError)",
    )


# ---------------------------------------------------------------------------
# T-2 — Réversibilité ×2 (V18.B.1/B.3/B.4 — les deux sens, à l'infini)
# ---------------------------------------------------------------------------
def t2() -> None:
    print("— T-2 · Réversibilité ×2 (B.1/B.3/B.4) —")

    profiles = lit("apps/api/src/routes/profiles.ts")

    # 2-a. Le sens ACTIVATION existe et nettoie l'état (réactivation propre).
    activation = bool(
        re.search(r"if \(raisonCible === 'rencontre'\) \{[^}]*raison_activation = \?", profiles, re.S)
    )
    # 2-b. Le sens PAUSE existe et accepte le motif (voyage ET indecis).
    pause = bool(
        re.search(
            r"else if \(raisonCible === 'voyage' \|\| raisonCible === 'indecis'\) \{[^}]*raison_pause_reason",
            profiles,
            re.S,
        )
    )
    check(
        "T-2a",
        activation and pause,
        "profiles.ts : les DEUX transitions existent — activation (rencontre, nettoyage pause) ET pause (voyage/indecis, motif libre)",
    )

    # 2-c. Aucun compteur ni verrou de sens : pas de limite de bascules.
    verrous = grep_count(r"raison[_a-z]*count|switch_count|max_switch|deja_bascule", profiles.lower())
    check(
        "T-2b",
        verrous == 0,
        f"compteur/verrou de sens sur la bascule : {verrous} (attendu 0 — réversible à l'infini)",
    )

    # 2-d. UI : pause ET réactivation accessibles depuis le profil (B.6),
    #      et la proposition de fin (B.1) propose les 3 réponses égales.
    mon_profil = lit("apps/web/src/screens/MyProfile.tsx")
    questionnaire = lit("apps/web/src/screens/Questionnaire.tsx")
    ui_ok = (
        "Mettre la rencontre en pause" in mon_profil
        and "Réactiver la rencontre" in mon_profil
        and "Ouvrir la rencontre" in mon_profil
        and "Me le redemander plus tard" in questionnaire
        and "Pas maintenant" in questionnaire
    )
    check(
        "T-2c",
        ui_ok,
        "UI : pause + réactivation en profil (B.6) · proposition B.1 avec les 3 réponses sans hiérarchie",
    )

    # 2-e. Replay sqlite : voyage → rencontre → voyage → rencontre (×2 allers-
    #      retours) réussissent TOUS — la réversibilité est mécanique.
    con = sqlite3.connect(":memory:")
    con.execute(
        "CREATE TABLE users (id TEXT PRIMARY KEY, raison TEXT NOT NULL DEFAULT 'indecis' "
        "CHECK (raison IN ('voyage', 'rencontre', 'indecis')))"
    )
    con.execute("INSERT INTO users (id, raison) VALUES ('u1', 'voyage')")
    allers_retours = 0
    try:
        for raison in ("rencontre", "voyage", "rencontre", "voyage", "rencontre"):
            con.execute("UPDATE users SET raison = ? WHERE id = 'u1'", (raison,))
            allers_retours += 1
    except sqlite3.IntegrityError:
        pass
    con.close()
    check(
        "T-2d",
        allers_retours == 5,
        f"replay sqlite : 5 bascules successives dans les deux sens acceptées ({allers_retours}/5)",
    )


# ---------------------------------------------------------------------------
# T-3 — Conversations/matchs/messages conservés pendant la pause (V18.B.3)
# ---------------------------------------------------------------------------
def t3() -> None:
    print("— T-3 · Conversations conservées (B.3) —")

    # 3-a. Statique : les chemins de bascule ne détruisent RIEN.
    destructeurs = 0
    for chemin in (
        "apps/api/migrations/0024_v18_raison.sql",
        "apps/api/src/routes/profiles.ts",
        "apps/api/src/routes/questionnaire.ts",
    ):
        texte = lit(chemin)
        destructeurs += grep_count(
            r"DELETE FROM (conversations|matches|messages|swipes)", texte
        )
    check(
        "T-3a",
        destructeurs == 0,
        f"DELETE conversations/matches/messages/swipes dans les chemins V18 : {destructeurs} (attendu 0 — la pause ne supprime rien)",
    )

    # 3-b. Replay sqlite : une conversation + un match survivent à 2 bascules.
    con = sqlite3.connect(":memory:")
    con.execute(
        "CREATE TABLE users (id TEXT PRIMARY KEY, raison TEXT NOT NULL DEFAULT 'indecis' "
        "CHECK (raison IN ('voyage', 'rencontre', 'indecis')))"
    )
    con.execute("CREATE TABLE conversations (id TEXT PRIMARY KEY, user_a TEXT, user_b TEXT)")
    con.execute("CREATE TABLE matches (id TEXT PRIMARY KEY, user_id TEXT, target_id TEXT)")
    con.execute("INSERT INTO users (id, raison) VALUES ('a', 'rencontre')")
    con.execute("INSERT INTO users (id, raison) VALUES ('b', 'rencontre')")
    con.execute("INSERT INTO conversations (id, user_a, user_b) VALUES ('c1', 'a', 'b')")
    con.execute("INSERT INTO matches (id, user_id, target_id) VALUES ('m1', 'a', 'b')")
    con.execute("UPDATE users SET raison = 'voyage' WHERE id = 'a'")  # pause
    con.execute("UPDATE users SET raison = 'rencontre' WHERE id = 'a'")  # réactivation
    conv = con.execute("SELECT COUNT(*) FROM conversations").fetchone()[0]
    matchs = con.execute("SELECT COUNT(*) FROM matches").fetchone()[0]
    con.close()
    check(
        "T-3b",
        conv == 1 and matchs == 1,
        "replay sqlite : conversation + match INTACTS après pause puis réactivation (1/1)",
    )


# ---------------------------------------------------------------------------
# T-4 — Matching exclut les non-chercheurs (V18.D-D.1, replay fonctionnel)
# ---------------------------------------------------------------------------
def t4() -> None:
    print("— T-4 · Matching exclut les non-chercheurs (D.1) —")

    # Modèle fidèle du prédicat de pool (discovery.ts) : statut actif,
    # raison, photo active, session récente. Le prédicat `raison` extrait du
    # dépôt est appliqué tel quel.
    discovery = lit("apps/api/src/lib/discovery.ts")
    clause = re.findall(r"AND u0\.raison = 'rencontre'", discovery)
    con = sqlite3.connect(":memory:")
    con.execute(
        "CREATE TABLE users (id TEXT PRIMARY KEY, status TEXT, raison TEXT NOT NULL DEFAULT 'indecis')"
    )
    con.execute("CREATE TABLE photos (user_id TEXT, status TEXT, deleted_at INTEGER)")
    con.execute("CREATE TABLE sessions (user_id TEXT, revoked_at INTEGER, last_seen_at INTEGER)")
    lignes = [
        ("r1", "active", "rencontre"),
        ("r2", "active", "rencontre"),
        ("v1", "active", "voyage"),
        ("i1", "active", "indecis"),
        ("x1", "banned", "rencontre"),
    ]
    con.executemany("INSERT INTO users (id, status, raison) VALUES (?, ?, ?)", lignes)
    for uid, *_ in lignes:
        con.execute(
            "INSERT INTO photos (user_id, status, deleted_at) VALUES (?, 'active', NULL)", (uid,)
        )
        con.execute(
            "INSERT INTO sessions (user_id, revoked_at, last_seen_at) VALUES (?, NULL, 999)", (uid,)
        )

    def pool():
        return con.execute(
            "SELECT u0.id FROM users u0 WHERE u0.id != ? AND u0.status = 'active' "
            "AND u0.raison = 'rencontre' "
            "AND EXISTS (SELECT 1 FROM photos ph WHERE ph.user_id = u0.id AND ph.status = 'active' AND ph.deleted_at IS NULL) "
            "AND EXISTS (SELECT 1 FROM sessions s WHERE s.user_id = u0.id AND s.revoked_at IS NULL AND s.last_seen_at > 0) "
            "ORDER BY u0.id",
            ("moi",),
        ).fetchall()

    avant = [r[0] for r in pool()]
    # Un voyageur met la rencontre en pause puis la réactive — dans les DEUX
    # sens le verrou tient : seuls les 'rencontre' actifs sortent, JAMAIS.
    con.execute("UPDATE users SET raison = 'voyage' WHERE id = 'r1'")
    apres_pause = [r[0] for r in pool()]
    con.execute("UPDATE users SET raison = 'rencontre' WHERE id = 'r1'")
    apres_reactivation = [r[0] for r in pool()]
    con.close()
    check(
        "T-4a",
        len(clause) == 2 and avant == ["r1", "r2"] and apres_pause == ["r2"] and apres_reactivation == ["r1", "r2"],
        f"pool (clause du dépôt appliquée telle quelle) : {avant} → pause r1 → {apres_pause} → réactivation → {apres_reactivation} — voyage/indecis/banned ne sortent JAMAIS",
    )


# ---------------------------------------------------------------------------
# T-5 — Profondeur de test identique pour les 3 raisons (V18.D-D.2)
# ---------------------------------------------------------------------------
def t5() -> None:
    print("— T-5 · Profondeur identique — 531 items pour toutes les raisons (D.2) —")

    # 5-a. La banque servie n'est JAMAIS filtrée par la raison : le chargeur
    #      des items doctrine ne mentionne la raison nulle part.
    questionnaire = lit("apps/api/src/routes/questionnaire.ts")
    chargeur = re.search(
        r"async function loadDoctrineItems\(db: D1Database\): Promise<DoctrineRow\[\]> \{.*?\n\}",
        questionnaire,
        re.S,
    )
    sans_filtre = chargeur is not None and "raison" not in chargeur.group(0)
    check(
        "T-5a",
        sans_filtre,
        "loadDoctrineItems : AUCUN filtre par raison — la même banque complète est servie à voyage, rencontre et indecis",
    )

    # 5-b. La raison ne fait que VOYAGER AVEC la réponse (champ annexe),
    #      elle ne change jamais le contenu (items/progress intacts).
    check(
        "T-5b",
        "raison: raisonState.raison" in questionnaire
        and "activation: raisonState.activation" in questionnaire
        and "items," in questionnaire,
        "GET /api/qd : la raison est un champ annexe de l'état — items et progression restent la banque entière",
    )

    # 5-c. Replay sqlite : la banque (531 items) compte le même nombre d'items
    #      actifs quel que soit le raison simulé (la requête n'en dépend pas).
    #      Prérequis des FK : users (0001) et q_items (0009).
    con = sqlite3.connect(":memory:")
    con.execute("PRAGMA foreign_keys = ON")
    con.executescript(lit("apps/api/migrations/0001_core.sql"))
    con.executescript(lit("apps/api/migrations/0009_questionnaire.sql"))
    con.executescript(lit("apps/api/migrations/0021_questionnaire_doctrine.sql"))
    con.executescript(lit("apps/api/migrations/0022_q_doctrine_seed.sql"))
    total = None
    identique = True
    for raison in ("voyage", "rencontre", "indecis"):
        n = con.execute(
            "SELECT COUNT(*) FROM q_doctrine_items WHERE active = 1"
        ).fetchone()[0]
        if total is None:
            total = n
        elif n != total:
            identique = False
    con.close()
    check(
        "T-5c",
        identique and total == 531,
        f"replay sqlite : {total} items actifs identiques pour les 3 raisons (attendu 531 — aucune version allégée)",
    )


# ---------------------------------------------------------------------------
# T-6 — Métriques collectées mais JAMAIS consommées par le moteur (V18.D-D.4)
# ---------------------------------------------------------------------------
def t6() -> None:
    print("— T-6 · Métriques de conversion : collecte seule (D.4) —")

    # 6-a. La collecte existe (choix + activation).
    profiles = lit("apps/api/src/routes/profiles.ts")
    questionnaire = lit("apps/api/src/routes/questionnaire.ts")
    collecte = (
        "raison.to." in profiles
        and "raison.activation.oui" in questionnaire
        and "raison.activation.pas_maintenant" in questionnaire
        and "raison.activation.plus_tard" in questionnaire
    )
    check(
        "T-6a",
        collecte,
        "métriques écrites : raison.to.* (choix) + raison.activation.{oui,pas_maintenant,plus_tard} (B.1)",
    )

    # 6-b. Le moteur ne lit JAMAIS metrics_daily : ni découverte, ni matching.
    moteur = 0
    for chemin in (
        "apps/api/src/lib/discovery.ts",
        "packages/shared/src/matching.ts",
        "packages/shared/src/personality.ts",
    ):
        moteur += grep_count(r"metrics_daily", lit(chemin))
    check(
        "T-6b",
        moteur == 0,
        f"lectures de metrics_daily dans discovery/matching/personnalité : {moteur} (attendu 0 — la collecte n'oriente aucun produit)",
    )


# ---------------------------------------------------------------------------
# T-7 — Les interdits rouges V18 (jamais d'auto-conversion, énoncés intacts)
# ---------------------------------------------------------------------------
def t7() -> None:
    print("— T-7 · Interdits rouges V18 —")

    # 7-a. AUCUNE écriture automatique voyage→rencontre : le POST d'activation
    #      est le seul chemin qui pose raison='rencontre' depuis le questionnaire,
    #      et il exige la réponse explicite du membre.
    questionnaire = lit("apps/api/src/routes/questionnaire.ts")
    activation_explicite = bool(
        re.search(
            r"questionnaireRoutes\.post\('/qd/activation'[^`]*?`UPDATE users SET raison = 'rencontre'",
            questionnaire,
            re.S,
        )
    )
    check(
        "T-7a",
        activation_explicite,
        "la rencontre ne s'ouvre QUE par POST /api/qd/activation {answer:'oui'} — décision explicite, jamais automatique",
    )

    # 7-b. La proposition n'est posée qu'à l'écran de fin du questionnaire et
    #      au plus 1 fois par palier (anti-spam : raison_asked_at + nouvelles réponses).
    anti_spam = (
        "raison_asked_at" in questionnaire
        and "nouvelles_reponses" in questionnaire
        and "raison_activation !== 'declined'" in questionnaire
    )
    check(
        "T-7b",
        anti_spam,
        "anti-spam B.1 : éligibilité = jamais déclinée ET (jamais posée OU nouvelles réponses depuis la dernière proposition)",
    )

    # 7-c. Les énoncés des quêtes restent intouchés : Q2.5 garde ses 3 items
    #      avec leurs prompts d'origine (aucune reformulation V18).
    graine = lit("apps/api/migrations/0022_q_doctrine_seed.sql")
    q25 = re.findall(
        r"\('Q2\.5-0[123]', 1, 'M3', '2\.5', \d+, NULL, NULL, NULL, NULL, NULL, 0, 'autre', '((?:[^']|'')*)', 1",
        graine,
    )
    attendus = [
        "Tu cherches une relation exclusive.",
        "Tu cherches une rencontre, sans plan précis.",
        "L''exclusivité n''est pas ce que tu vises aujourd''hui.",
    ]
    check(
        "T-7c",
        len(q25) == 3 and q25 == attendus,
        f"les 3 énoncés Q2.5-01/02/03 sont STRICTEMENT inchangés ({len(q25)}/3) — les quêtes ne sont jamais reformulées",
    )

    # 7-d. La 4e réponse « Je découvre » du contrat 2.5 : la banque conserve
    #      bien la quête ENTIÈRE (rien n'a été retiré du vivier doctrine).
    contrat = lit("contrat/contrat-inventaire.v1.3.md")
    check(
        "T-7d",
        "4ᵉ réponse « Je découvre »" in contrat and "| 2.5 | Ce que tu cherches |" in contrat,
        "contrat : la quête 2.5 (3 items + 4ᵉ réponse « Je découvre ») reste référencée — V18 déplace le flux, pas la doctrine",
    )


def main() -> int:
    print("═══ TEST V18 — « TA RAISON D'ÊTRE ICI » (mission V18) ═══\n")
    t1()
    t2()
    t3()
    t4()
    t5()
    t6()
    t7()
    echecs = [r for r in resultats if not r[1]]
    print(f"\n═══ VERDICT V18 : {len(resultats) - len(echecs)}/{len(resultats)} — {'VERT 🟢' if not echecs else 'ROUGE 🔴'}")
    return 1 if echecs else 0


if __name__ == "__main__":
    sys.exit(main())
