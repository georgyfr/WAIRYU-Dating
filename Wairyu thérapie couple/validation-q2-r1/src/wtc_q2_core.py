# -*- coding: utf-8 -*-
"""WAIRYU — WTC-Q2-01 : moteur Quête 2 « Ce qui m'effraie vraiment »
Construits cités : hyperactivation/déactivation (Mikulincer & Shaver) ;
comportements de proteste (Bowlby) ; convergence multi-instruments (méthode).
Instrument original WAIRYU — fiche RIO-02. Déterministe · local.

RÉVISION R1 (package WTC-Q2-R1, réponse au rapport commit 0c3aaab) :
  · D-Q2-B — 3 templates ajoutés à la banque : SUPPRESSION_MASQUEE ·
    MAINSLIBRES_EXPLIQUE · FALLTHROUGH_LEGER (complétude C5a : 32 → 35).
  · D-Q2-F — longitudinal() marqué NON TESTÉ (reporté WTC-SUIVI) ;
    ne pénalise aucun critère.
AUCUNE règle de calcul modifiée : nommage, convergence, palier, zone_force
restent mot pour mot ceux du moteur fourni (WTC-Q2-01)."""

D_ITEMS = ["D1","D2","D3","D4","D5","D6"]
P_ITEMS = ["P1","P2","P3","P4"]
H_ITEMS = ["H1","H2","H3","H4","H5"]
R_ITEMS = ["R1","R2","R3"]
ORIGINE_MAP = {"O1":"SÉCURISANT","O2":"INVALIDATION","O3":"INVISIBILITÉ",
               "O4":"PARENTIFICATION","O5":"INTRUSION","O6":"MIXTE",
               "O7":"LIBRE"}   # LIBRE → NLP local, seuil 0,70


def profil_declencheurs(d, p):
    """Étape 1 — comptages et profil des déclencheurs."""
    cd = sum(1 for k in D_ITEMS if d.get(k,0) == 1)
    cp = sum(1 for k in P_ITEMS if p.get(k,0) == 1)
    if   cd + cp <= 2:          prof = "RARES"
    elif cd >= 3 and cp >= 2:   prof = "DEUX_COTES"
    elif cd - cp >= 2:          prof = "DISTANCE"
    elif cp >= 2 and cd <= 2:   prof = "PROXIMITE"
    else:                       prof = "MIXTE_LEGERS"
    return {"count_d": cd, "count_p": cp, "profil": prof}


def comportements(h, r):
    """Étape 2 — les deux mains. Normalisations : H sur 15, R sur 9."""
    hb = sum(h.get(k,0) for k in H_ITEMS)
    rb = sum(r.get(k,0) for k in R_ITEMS)
    hn, rn = round(hb/15, 3), round(rb/9, 3)
    n_checked = (sum(1 for k in H_ITEMS if h.get(k,0) > 0)
                 + sum(1 for k in R_ITEMS if r.get(k,0) > 0))
    if   hn >= 0.30 and rn >= 0.30 and abs(hn - rn) < 0.20:
        dom = "MIXTE"
    elif hn - rn >= 0.20:  dom = "H"
    elif rn - hn >= 0.20:  dom = "R"
    else:                  dom = "LEGER"
    return {"h_norm": hn, "r_norm": rn, "n_checked": n_checked,
            "domination": dom, "somme": round(hn + rn, 3)}


def signal_securite(h5_freq, score_A, i_alarm):
    """Filet — routage H5. signal = suivre dans les écrans sécurité ;
    p_filtre = re-pousser le filtre du Cadran. Déterministe."""
    actif    = (h5_freq >= 1) and (score_A >= 3.21 or i_alarm >= 7)
    p_filtre = (h5_freq == 3) and (score_A >= 3.70)
    return {"signal": bool(actif), "p_filtre": bool(p_filtre)}


def convergence(sA, sB, cd, cp, n_checked, hn, rn):
    """Index de convergence Q1×Q2 — le garde anti-incohérence.
    C1 : A vive → déclencheurs de distance présents (cd ≥ 2)
    C2 : B vive → proximité OU mains qui lâchent dominantes
    C3 : Q1 tranquille → peu de déclencheurs ET peu de comportements
    index = satisfaits ÷ applicables. Ne gates que l'OMBRE (D-Q2-2)."""
    checks = []
    if sA >= 2.61: checks.append(("C1", cd >= 2))
    if sB >= 2.61: checks.append(("C2", (cp >= 1) or (rn > hn)))
    if sA < 2.61 and sB < 2.61:
        checks.append(("C3", (cd + cp <= 2) and (n_checked <= 1)))
    if not checks:
        return {"index": 1.00, "prudence": False, "supprime": False,
                "checks": checks}
    sat = sum(1 for _, ok in checks if ok)
    index = round(sat / len(checks), 2)
    return {"index": index, "prudence": 0 < index <= 0.50,
            "supprime": index == 0.00, "checks": checks}


def nommage(sA, sB, prof, comp, i_alarm, conv):
    """Arbre de nommage — PRIORITÉ : LES DEUX > PEUR simple > ZONE CALME.
    Le comportement tranche entre peurs simples. Fallthrough défini
    (décision d'orchestrateur D-Q2-1) : ALARME SANS MAIN (i_alarm ≥ 5,
    🟠 mini) / SIGNAL LÉGER NON NOMMÉ (🟢). La convergence ne gates
    que les étiquettes d'OMBRE (D-Q2-2) — jamais ZONE CALME."""
    cd, cp = prof["count_d"], prof["count_p"]
    hn, rn, dom = comp["h_norm"], comp["r_norm"], comp["domination"]
    q1_trq = (sA < 2.61 and sB < 2.61)
    ombre_permise = not conv["supprime"]
    les_deux  = ((sA >= 2.61 and sB >= 2.61)
                 or (cd >= 3 and cp >= 2)
                 or (hn >= 0.30 and rn >= 0.30 and abs(hn - rn) < 0.20))
    p_perdre  = ((sA >= 2.61 or cd >= 3) and dom == "H")
    p_etouf   = ((sB >= 2.61 or cp >= 2) and dom in ("R", "MIXTE"))
    z_calme   = (q1_trq and cd + cp <= 2
                 and comp["n_checked"] <= 1 and i_alarm <= 4)
    if   les_deux and ombre_permise: label = "LES DEUX"
    elif p_perdre and ombre_permise: label = "PEUR DE PERDRE"
    elif p_etouf  and ombre_permise: label = "PEUR D'ÊTRE ÉTOUFFÉE"
    elif z_calme:                    label = "ZONE CALME"
    elif i_alarm >= 5:               label = "ALARME SANS MAIN"
    else:                            label = "SIGNAL LÉGER NON NOMMÉ"
    if   label == "ZONE CALME":  type_res = "CALME"
    elif label in ("ALARME SANS MAIN", "SIGNAL LÉGER NON NOMMÉ"):
                                 type_res = "NON_NOMMÉ"
    else:                        type_res = ("OMBRE_PRUDENCE"
                                             if conv["prudence"]
                                             else "OMBRE")
    return {"label": label, "type": type_res,
            "prudence": conv["prudence"], "supprime": conv["supprime"]}


def zone_force(origine, prof, comp, label):
    """La force dérivée des vraies réponses — jamais fabriquée."""
    if origine == "SÉCURISANT":  return "SECURISANT"
    if label == "ZONE CALME":    return "CALME_RICHE"
    if label == "LES DEUX":      return "LUCIDITE"
    if prof["profil"] != "RARES" and comp["somme"] < 0.30:
        return "MAINSLIBRES"
    return "SILENCIEUSE"


def palier(i_alarm, sA, sB, comp, sig):
    """Palier final — calculé sur les données, indépendant du label.
    Sévérité maximale entre filet et scores (jamais l'inverse)."""
    if (sig["signal"] or i_alarm >= 8 or sA >= 3.70
            or (sA >= 3.21 and sB >= 3.21)):
        return "🔴"
    if i_alarm >= 6 or 0.30 <= comp["somme"] < 0.60:
        return "🟠"
    return "🟢"


def longitudinal(prev, curr):
    """Re-test à 8 semaines. Seuils : I_alarm ±2 · normes ±0,15.
    D-Q2-F — NON TESTÉ ce cycle : reporté à WTC-SUIVI (aucun couple
    avant/après simulé). Ne pénalise aucun critère."""
    di = curr["i_alarm"] - prev["i_alarm"]
    dh = curr["h_norm"] - prev["h_norm"]
    dr = curr["r_norm"] - prev["r_norm"]
    return {"i_alarm": {"delta": round(di, 2),
                        "verdict": "FIABLE" if abs(di) >= 2 else "BRUIT"},
            "h_norm": {"delta": round(dh, 3),
                       "verdict": "FIABLE" if abs(dh) >= 0.15 else "BRUIT"},
            "r_norm": {"delta": round(dr, 3),
                       "verdict": "FIABLE" if abs(dr) >= 0.15 else "BRUIT"}}


# --- Banque des récits (complétude vérifiée en validation — C5) ---
CLUSTERS = ["H", "R", "MIXTE", "LEGER"]
ORIGINES_VALIDES = ["SÉCURISANT", "INVALIDATION", "INVISIBILITÉ",
                    "PARENTIFICATION", "INTRUSION", "MIXTE",
                    "COMPOSITE", "NON-CLASSIFIABLE"]
TEMPLATES_CAUSE = {(o, c): f"T-{o[:4]}-{c}"
                   for o in ORIGINES_VALIDES for c in CLUSTERS}
TEMPLATES_CONSEQ = {"H":  "T-CONSEQ-H",   "R":  "T-CONSEQ-R",
                    "MIXTE": "T-CONSEQ-M", "LEGER": "T-CONSEQ-L"}
PHRASE_PIVOT = "elle t'a protégé(e) là où tu as grandi — dans ton couple d'aujourd'hui, elle produit l'effet inverse"

# D-Q2-B — 3 templates AJOUTÉS à la banque (révision R1) ; identifiants
# posés mot pour mot par l'orchestrateur. Le rôle d'affichage de chacun :
#   SUPPRESSION_MASQUEE  → index de convergence 0,00 : l'étiquette d'OMBRE
#                          est masquée (jamais posée), la sortie tombe dans
#                          le fallthrough D-Q2-1, le profil reste consultable.
#   MAINSLIBRES_EXPLIQUE → force MAINSLIBRES (profil ≠ RARES et somme < 0,30) :
#                          des déclencheurs existent sans comportements
#                          saillants — l'ombre ne saisit plus.
#   FALLTHROUGH_LEGER    → étiquettes de chute (ALARME SANS MAIN ·
#                          SIGNAL LÉGER NON NOMMÉ) : un signal discret est
#                          tracé sans être nommé.
TEMPLATES_SPECIAUX = {
    "SUPPRESSION_MASQUEE":
        "récit affiché quand l'index de convergence vaut 0,00 : l'étiquette "
        "d'ombre est masquée et la sortie emprunte le fallthrough prévu "
        "(D-Q2-1) — aucun nommage fabriqué.",
    "MAINSLIBRES_EXPLIQUE":
        "récit affiché quand la force MAINSLIBRES est posée (profil de "
        "déclencheurs ≠ RARES et somme des mains < 0,30) : les déclencheurs "
        "existent mais les comportements ne saisissent plus.",
    "FALLTHROUGH_LEGER":
        "récit affiché pour les étiquettes de chute (ALARME SANS MAIN · "
        "SIGNAL LÉGER NON NOMMÉ) : un signal discret est tracé, il remontera "
        "s'il se confirme.",
}
TEMPLATES_SPECIAUX_ATTENDUS = ["SUPPRESSION_MASQUEE",
                               "MAINSLIBRES_EXPLIQUE",
                               "FALLTHROUGH_LEGER"]


def verifier_templates():
    """C5a — complétude : 8 origines × 4 clusters = 32 paires
    + 3 templates spéciaux (D-Q2-B) = 35 entrées."""
    manquants = [(o, c) for o in ORIGINES_VALIDES for c in CLUSTERS
                 if (o, c) not in TEMPLATES_CAUSE]
    manquants += [t for t in TEMPLATES_SPECIAUX_ATTENDUS
                  if t not in TEMPLATES_SPECIAUX]
    return manquants   # doit être []
