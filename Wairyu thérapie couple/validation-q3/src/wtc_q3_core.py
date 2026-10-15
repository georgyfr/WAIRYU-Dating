# -*- coding: utf-8 -*-
"""WAIRYU — WTC-Q3-01 : moteur Quête 3 « Ce qui me porte »
Principe fondateur : le positif n'est jamais généré — il est
SÉLECTIONNÉ dans une banque fermée de 6 forces, par règles
déterministes sur des conditions chiffrées. Sinon SILENCIEUSE.
Construits cités : capitalisation (Gable & Reis) ; forces de
caractère (VIA/Peterson — cadre public, items ex nihilo) ;
sécurité acquise (Main). Instrument original WAIRYU — RIO-03.
Déterministe · local."""

C3_ITEMS = ["P","V","F","E","C","H","Pr","R","T"]
FORCES = ["F1","F2","F3","F4","F5","F6"]

def cond_A(c1_mode, c2, c3, sA, sB):   # mode C1: 'PRES','SOL','ESP','RIEN'
    """Composante A — conditions par force (voies A)."""
    a = {}
    a["F1"] = (c1_mode == "PRES" and c1_mode is not None and _c1v(c1_mode) >= 2) \
              or (_c1v(c1_mode) == 3 and c1_mode == "ESP") \
              or False
    a["F1"] = _c1v(c1_mode) >= 2          # présent(3) ou espace(3) ou solutions(2)
    a["F2"] = c2 >= 2
    a["F3"] = sA >= 2.61 or ("V" in c3)
    a["F4"] = (("F" in c3))
    a["F5"] = ("R" in c3)
    a["F6"] = ("T" in c3) or ("Pr" in c3)
    return a

def _c1v(mode):
    return {"PRES":3,"SOL":2,"ESP":3,"RIEN":0}.get(mode,0)

def cond_B(sA, sB, h_norm, r_norm, label_ombre):
    """Composante B — voies héritées (Quêtes 1-2)."""
    b = {}
    b["F1"] = (sB >= 2.61)                        # il sait prendre l'air → port possible
    b["F2"] = (sB >= 3.21 and h_norm >= r_norm)
    b["F3"] = (sA >= 2.61)
    b["F4"] = False                                # pas de voie B (exige journal ou C3)
    b["F5"] = False
    b["F6"] = (label_ombre == "ZONE CALME")
    return b

def cond_journal(j):
    """Composante C — voies journal (si 7 entrées complètes).
    j = dict {T,U,L,M,N,phrases} (N non compté)."""
    if j is None or j["complete"] is False:
        return {f: False for f in FORCES}
    t, u, l, m = j["T"], j["U"], j["L"], j["M"]
    return {"F1": t >= 5, "F2": u >= 5, "F3": l >= 4,
            "F4": (t+u+l+m) >= 4, "F5": m >= 3, "F6": (t+m) >= 4}

def verifier_forces(c1_mode, c2, c3, sA, sB, h_norm, r_norm,
                    label_ombre, journal):
    """Calcul central — la sélection déterministe des forces.
    Retourne : forces sélectionnées (max 2), toutes les conditions
    évaluées (traçabilité), et le statut SILENCIEUSE éventuel."""
    ca = cond_A(c1_mode, c2, c3, sA, sB)
    cb = cond_B(sA, sB, h_norm, r_norm, label_ombre)
    cj = cond_journal(journal)
    conditions = {f: bool(ca[f] or cb[f] or cj[f]) for f in FORCES}
    trace = {f: {"A": ca[f], "B": cb[f], "C": cj[f],
                 "retenue": conditions[f]} for f in FORCES}
    actives = [f for f in FORCES if conditions[f]]
    if len(actives) <= 2:
        return {"forces": actives, "silencieuse": len(actives) == 0,
                "trace": trace, "nombre": len(actives)}
    # max 2 : on garde les 2 dont le score de condition est le plus
    # dense (nb de voies actives, puis ordre de la banque)
    densite = {f: (int(ca[f]) + int(cb[f]) + int(cj[f])) for f in actives}
    tri = sorted(actives, key=lambda f: (-densite[f], FORCES.index(f)))
    retenues = sorted(tri[:2], key=lambda f: FORCES.index(f))
    return {"forces": retenues, "silencieuse": False, "trace": trace,
            "nombre": 2, "exclues_par_limite": [f for f in actives
                                                if f not in retenues]}

def coherence_miroir(c3, c4):
    """C3 vs C4 (le miroir présumé) — indicateur d'humilité relationnelle
    (affiché comme information, jamais comme défaut) :
    partagés = ce que je déclare ET que je crois que l'autre voit."""
    partages = sorted(set(c3) & set(c4))
    secrets  = sorted(set(c3) - set(c4))
    presume  = sorted(set(c4) - set(c3))
    return {"partages": partages, "secrets": secrets,
            "presumes": presume,
            "interpretation": ("tes forces sont visibles de l'autre"
                if len(partages) >= len(c3 or []) and c3 else
                "certaines de tes forces restent invisibles à tes yeux")} \
        if c3 or c4 else {"partages": [], "secrets": [], "presume": [],
                          "interpretation": "aucune force déclarée"}

def journal_statut(journal):
    """L'honnêteté du journal : jamais de sanction du N."""
    if journal is None: return "NON_RENSEIGNE"
    if not journal["complete"]: return "PARTIEL"
    if journal["N"] >= 5: return "SILENCIEUX"   # 5 jours sans rien noté
    return "ACTIF"                               # + phrase d'accueil :
    # SILENCIEUX → « le silence du journal est une information, pas une faute »

def long_termique(prev_forces, curr_forces):
    """Re-test : une force qui apparaît = FIABLE (condition remplie
    sur données fraîches) ; une force qui disparaît = re-vérifiée
    avant tout affichage de régression (douceur du positif)."""
    app = sorted(set(curr_forces) - set(prev_forces))
    dis = sorted(set(prev_forces) - set(curr_forces))
    return {"apparues": app, "disparues": dis,
            "verdict": ("FIABLE" if app else "BRUIT") if app or dis
                       else "STABLE"}
