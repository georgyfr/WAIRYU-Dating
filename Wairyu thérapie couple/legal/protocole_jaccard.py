# -*- coding: utf-8 -*-
"""Protocole lexical RIO — recalculabilité réelle (exécution P4, audit pont
WTC-LEGAL-01). Implémente §4 du document `D-audit-pi.md` :

  1. Normalisation : minuscules, suppression des accents/ponctuation,
     stopwords français (y compris « partenaire », « besoin » — mots de
     liaison obligatoires du domaine, neutralisés) ;
  2. Similarité : coefficient de Jaccard, pris comme max(similarité des mots,
     similarité des bigrammes de mots), entre chaque item RIO et chaque
     paraphrase du corpus de référence ;
  3. Seuils : vigilance >= 0,40 · alerte >= 0,70 (réécriture obligatoire) ;
  4. Limite inter-langue assumée : comparaison contre des paraphrases
     françaises analystes — la similarité mesurée est un minorant.

Usage :
  python3 protocole_jaccard.py --items <items.md> --corpus corpus-paraphrases.md
          [--out resultats.json]

Format `items.md` : lignes « > **[code]** texte de l'item » (format
`validation-emotionnelle/fondation/01-items-q1.md`).
Le corpus est parsé depuis `corpus-paraphrases.md` (lignes « - [CODE] texte »).

Ce script est un ARTEFACT DU DÉPÔT (traçabilité) : chaque rejeu publié cite
la version du corpus et les paramètres exacts ci-dessous.
"""
from __future__ import annotations
import argparse
import json
import re
import sys
import unicodedata
from pathlib import Path

SEUIL_VIGILANCE = 0.40
SEUIL_ALERTE = 0.70

STOPWORDS = {
    "le", "la", "les", "un", "une", "des", "du", "de", "d", "l", "au", "aux",
    "et", "ou", "mais", "donc", "or", "ni", "car", "que", "qui", "quoi", "dont",
    "ce", "cet", "cette", "ces", "mon", "ma", "mes", "ton", "ta", "tes", "son",
    "sa", "ses", "notre", "nos", "votre", "vos", "leur", "leurs", "je", "tu",
    "il", "elle", "on", "nous", "vous", "ils", "elles", "me", "te", "se", "y",
    "en", "lui", "eux", "moi", "toi", "soi", "est", "sont", "etre", "avoir",
    "ai", "as", "a", "avons", "avez", "ont", "suis", "es", "sommes", "etes",
    "pour", "par", "avec", "sans", "sous", "sur", "dans", "entre", "vers",
    "chez", "avant", "apres", "puis", "quand", "si", "tout", "toute", "tous",
    "toutes", "plus", "moins", "tres", "bien", "aussi", "comme", "alors",
    "ne", "pas", "jamais", "rien", "autre", "autres", "meme", "faire", "fait",
    # Neutralisation des mots de liaison obligatoires du domaine (§4 du doc PI) :
    "partenaire", "besoin",
}


def normalise(texte: str) -> list[str]:
    """Minuscules + suppression accents/ponctuation + stopwords -> tokens."""
    t = texte.lower()
    t = unicodedata.normalize("NFD", t)
    t = "".join(c for c in t if not unicodedata.combining(c))
    t = re.sub(r"[^a-z\s]", " ", t)
    return [w for w in t.split() if w and w not in STOPWORDS]


def jaccard(a: set, b: set) -> float:
    if not a and not b:
        return 0.0
    union = a | b
    return len(a & b) / len(union) if union else 0.0


def similarite(texte_a: str, texte_b: str) -> float:
    ta, tb = normalise(texte_a), normalise(texte_b)
    j_mots = jaccard(set(ta), set(tb))
    big_a = {f"{ta[i]} {ta[i + 1]}" for i in range(len(ta) - 1)}
    big_b = {f"{tb[i]} {tb[i + 1]}" for i in range(len(tb) - 1)}
    j_bigrams = jaccard(big_a, big_b)
    return max(j_mots, j_bigrams)


def parse_items_md(path: Path) -> dict[str, str]:
    """Lignes « > **[code]** texte » (tolère l'absence de « > »)."""
    items = {}
    pat = re.compile(r"^\s*>?\s*\*\*\[(?P<code>[^\]]+)\]\*\*\s*(?P<txt>.+?)\s*$")
    for ligne in path.read_text(encoding="utf-8").splitlines():
        m = pat.match(ligne)
        if m and m.group("txt").strip():
            items[m.group("code").strip()] = m.group("txt").strip()
    return items


def parse_corpus_md(path: Path) -> dict[str, str]:
    """Lignes « - [CODE] texte »."""
    corpus = {}
    pat = re.compile(r"^\s*-\s*\[(?P<code>[^\]]+)\]\s*(?P<txt>.+?)\s*$")
    for ligne in path.read_text(encoding="utf-8").splitlines():
        m = pat.match(ligne)
        if m and m.group("txt").strip():
            corpus[m.group("code").strip()] = m.group("txt").strip()
    return corpus


def auditer(items: dict[str, str], corpus: dict[str, str]) -> dict:
    resultats = []
    for code, texte in items.items():
        scores = {rc: similarite(texte, rtxt) for rc, rtxt in corpus.items()}
        meilleur = max(scores, key=scores.get)
        s = round(scores[meilleur], 3)
        zone = ("ALERTE" if s >= SEUIL_ALERTE
                else "VIGILANCE" if s >= SEUIL_VIGILANCE else "OK")
        resultats.append({"item": code, "meilleure_ref": meilleur,
                          "score": s, "zone": zone})
    resultats.sort(key=lambda r: -r["score"])
    n_vig = sum(1 for r in resultats if r["zone"] == "VIGILANCE")
    n_ale = sum(1 for r in resultats if r["zone"] == "ALERTE")
    return {"parametres": {
                "seuil_vigilance": SEUIL_VIGILANCE,
                "seuil_alerte": SEUIL_ALERTE,
                "n_stopwords": len(STOPWORDS),
                "methode": "max(jaccard_mots, jaccard_bigrammes), normalisation §4"},
            "n_items": len(resultats), "n_paraphrases": len(corpus),
            "score_max": resultats[0]["score"] if resultats else None,
            "n_vigilance": n_vig, "n_alerte": n_ale,
            "table": resultats}


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--items", required=True)
    ap.add_argument("--corpus", required=True)
    ap.add_argument("--out", default=None)
    args = ap.parse_args()
    items = parse_items_md(Path(args.items))
    corpus = parse_corpus_md(Path(args.corpus))
    if not items or not corpus:
        print("ERREUR : items ou corpus vide")
        return 1
    res = auditer(items, corpus)
    print(f"Items : {res['n_items']} · paraphrases : {res['n_paraphrases']}")
    print(f"Score max : {res['score_max']} · vigilance : {res['n_vigilance']}"
          f" · alerte : {res['n_alerte']}")
    print(f"{'Item':<10} {'Meilleure réf.':<14} {'Score':>6}  Zone")
    for r in res["table"]:
        print(f"{r['item']:<10} {r['meilleure_ref']:<14} {r['score']:>6.3f}  {r['zone']}")
    if args.out:
        Path(args.out).write_text(
            json.dumps(res, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"Résultats écrits : {args.out}")
    return 0 if res["n_alerte"] == 0 else 2


if __name__ == "__main__":
    sys.exit(main())
