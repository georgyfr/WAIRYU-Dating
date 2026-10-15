# -*- coding: utf-8 -*-
"""WAIRYU — WTC-Q3-R1 · moteur Quête 3 « Ce qui me porte » (RIO-03) — RÉVISION.

Réponse de l'orchestrateur au rapport WTC-Q3 (commit 09b8683) : le code du
package initial est CONSERVÉ ; les corrections portent UNIQUEMENT sur ce que
le rapport a signalé (15 signalements S-Q3-1..15), chacune gravée en décision
D-Q3-R1-x. Le positif n'est jamais généré — il est SÉLECTIONNÉ dans une
banque fermée de 6 forces, par règles déterministes sur des conditions
chiffrées. Sinon SILENCIEUSE.
Construits cités : capitalisation (Gable & Reis) ; forces de caractère
(VIA/Peterson — cadre public, items ex nihilo) ; sécurité acquise (Main).
Instrument original WAIRYU — RIO-03. Déterministe · local.

DÉCISIONS DE RÉVISION (orchestrateur, documentées au README du package) :
  D-Q3-R1-A (S-Q3-2, structurel éliminatoire) — la voie B de F6
      (`label_ombre == "ZONE CALME"`) est SUPPRIMÉE : la banque fermée §1 est
      la seule source des voies (F6 = C3 T/Pr OU journal T+M ≥ 4/7). Le label
      d'ombre n'est pas une donnée de la banque — c'est une étiquette
      d'affichage dérivée. cond_B["F6"] = False (comme F4/F5 : pas de voie B).
      Conséquence : C1a redevient mesurable ; la borne D-STD G1 redevient
      atteignable ; S-Q3-13/S-Q3-15 (conséquences) s'effacent.
  D-Q3-R1-B (S-Q3-5 + S-Q3-4 + S-Q3-3 — C2) — la voie A de F1 est alignée
      MOT POUR MOT sur la table du cahier :
        F1-A = (C1 « présence ») OU (C1 « espace » ET score_B ≥ 2,61)
      soit : (c1_mode == "PRES") OU (c1_mode == "ESP" ET sB ≥ 2,61).
      SOL (pondération 2) n'appartient NI à « présence » NI à « espace » :
      il n'active PAS F1. Le simulateur ré-implémente LA MÊME règle
      indépendamment (le `or c2 >= 2` de la vérité est supprimé : c2 est la
      voie de F2, pas de F1). sB devient vivant dans cond_A (S-Q3-4 clos) ;
      l'assignation double disparaît (S-Q3-3 clos).
  D-Q3-R1-F (S-Q3-9) — la branche vide de coherence_miroir renvoie la clé
      « presumés » comme les autres branches (schéma cohérent).
Le reste du moteur (F2-F6 voies A/B, voies journal, limite des 2 par densité,
long_termique, journal_statut) est INCHANGÉ du package initial.
"""

C3_ITEMS = ["P", "V", "F", "E", "C", "H", "Pr", "R", "T"]
FORCES = ["F1", "F2", "F3", "F4", "F5", "F6"]

def cond_A(c1_mode, c2, c3, sA, sB):   # mode C1 : 'PRES','SOL','ESP','RIEN'
    """Composante A — conditions par force (voies A), alignées sur la table
    du cahier (D-Q3-R1-B) : F1 = « présence » seule OU « espace » avec port
    externe sB ≥ 2,61 ; SOL n'active pas F1 ; sB est vivant (S-Q3-4 clos) ;
    une seule assignation par force (S-Q3-3 clos)."""
    a = {}
    a["F1"] = (c1_mode == "PRES") or (c1_mode == "ESP" and sB >= 2.61)
    a["F2"] = c2 >= 2
    a["F3"] = sA >= 2.61 or ("V" in c3)
    a["F4"] = ("F" in c3)
    a["F5"] = ("R" in c3)
    a["F6"] = ("T" in c3) or ("Pr" in c3)
    return a

def cond_B(sA, sB, h_norm, r_norm, label_ombre):
    """Composante B — voies héritées (Quêtes 1-2).
    D-Q3-R1-A : la voie B de F6 est SUPPRIMÉE — le label d'ombre n'est pas
    une donnée de la banque fermée §1 (F6 exige C3 ou journal). F4/F5/F6 :
    pas de voie B."""
    b = {}
    b["F1"] = (sB >= 2.61)                        # il sait prendre l'air → port possible
    b["F2"] = (sB >= 3.21 and h_norm >= r_norm)
    b["F3"] = (sA >= 2.61)
    b["F4"] = False                                # pas de voie B (exige journal ou C3)
    b["F5"] = False                                # pas de voie B (exige journal ou C3)
    b["F6"] = False                                # [D-Q3-R1-A] pas de voie B —
                                                   # le label d'ombre ne crée pas de force
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
    partages = ce que je déclare ET que je crois que l'autre voit.
    [D-Q3-R1-F] la branche vide renvoie « presumés » comme les autres."""
    partages = sorted(set(c3) & set(c4))
    secrets  = sorted(set(c3) - set(c4))
    presume  = sorted(set(c4) - set(c3))
    return {"partages": partages, "secrets": secrets,
            "presumes": presume,
            "interpretation": ("tes forces sont visibles de l'autre"
                if len(partages) >= len(c3 or []) and c3 else
                "certaines de tes forces restent invisibles à tes yeux")} \
        if c3 or c4 else {"partages": [], "secrets": [], "presumes": [],
                          "interpretation": "aucune force déclarée"}

def journal_statut(journal):
    """L'honnêteté du journal : jamais de sanction du N.
    [D-Q3-R1-H] le commentaire d'affichage est complété (S-Q3-11)."""
    if journal is None: return "NON_RENSEIGNE"
    if not journal["complete"]: return "PARTIEL"
    if journal["N"] >= 5: return "SILENCIEUX"   # 5 jours sans rien noté
    return "ACTIF"
    # Affichages : SILENCIEUX → « le silence du journal est une information,
    # pas une faute. » · ACTIF → « ton journal t'éclaire — il n'est jamais
    # noté, jamais jugé. »

def long_termique(prev_forces, curr_forces):
    """Re-test : une force qui apparaît = FIABLE (condition remplie
    sur données fraîches) ; une force qui disparaît = re-vérifiée
    avant tout affichage de régression (douceur du positif)."""
    app = sorted(set(curr_forces) - set(prev_forces))
    dis = sorted(set(prev_forces) - set(curr_forces))
    return {"apparues": app, "disparues": dis,
            "verdict": ("FIABLE" if app else "BRUIT") if app or dis
                       else "STABLE"}
