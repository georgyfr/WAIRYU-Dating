# -*- coding: utf-8 -*-
"""WAIRYU — WTC-EMO-Q2-01 : moteur Quête 2 émotionnelle
« Ce que je n'arrive pas à dire »
Construits cités : invalidation (Gottman — les 4 cavaliers) ;
réassurance seeking (Joiner & Metalsky) ; reproche-code /
demande explicite (chapitre émotionnel WTC) ; D-ÉCHELLE (seuils
ancrés au milieu de l'échelle 5 points = 3,00). RIO-07 cible.
Déterministe · local."""

INV_D = ["INV-D1","INV-D2","INV-D3"]
INV_R = ["INV-R1","INV-R2","INV-R3"]
RC    = ["RC-1","RC-2","RC-3"]
SEUIL_MID = 3.00          # D-ÉCHELLE : milieu échelle 5 pts

def moyenne(items, rep):  # rep : dict {code: 1-5}
    return round(sum(rep[i] for i in items) / len(items), 2)

def zones_invalidation(rep):
    """3 zones descriptives — jamais de verdict d'être."""
    def zone(m):
        if m <= 2.00:  return "ABSENT"
        if m <= 3.50:  return "OCCASIONNEL"
        return "FRÉQUENT"
    mD = moyenne(INV_D, rep); mR = moyenne(INV_R, rep)
    return {"donnee": {"moyenne": mD, "zone": zone(mD)},
            "recue":  {"moyenne": mR, "zone": zone(mR)}}

def reproche_code(rep, rc_d):
    """Le reproche-code — la boucle du besoin non formulé.
    RC-D renversé : 1 = toujours reproche, 5 = toujours demande.
    Seuil D-ÉCHELLE : 3,00 (le milieu = le mixte honnête).

    M3 (WTC-EMO-Q2-R1) — Arbre documenté (4 débouchés explicites, D-VÉRITÉ) :

        m ≥ 3,00 ET formulation < 3,00  → "REPROCHE-CODE ACTIF"
            (le besoin s'exprime en reproche : le mécanisme à traiter)

        m ≥ 3,00 ET formulation ≥ 3,00  → "BESOIN VIVANT, FORMULATION MIXTE"
            (le besoin est là, la formulation marche en partie —
             le cas E5, et le plus commun des couples réels)

        m < 3,00 ET formulation < 3,00  → "BESOIN DISCRET"
            (ni reproche ni demande : le silence — à ne pas confondre
             avec l'absence de besoin)

        m < 3,00 ET formulation ≥ 3,00  → "FORMULATION ACQUISE"
            (la compétence est là, le besoin est discret — le cas
             « le couple a déjà résolu » : c'est le succès, affiché
             comme tel)

    Aucune logique modifiée — le code était juste (S-EMO-Q2-3, hypothèse 1).
    C'est la table de vérité cachée qui corrige (M1+M2 simulateur).
    """
    m = moyenne(RC, rep)
    formulation = rc_d          # 1-5
    if m >= 3.00 and formulation < 3.00:
        label = "REPROCHE-CODE ACTIF"
    elif m >= 3.00 and formulation >= 3.00:
        label = "BESOIN VIVANT, FORMULATION MIXTE"
    elif m < 3.00 and formulation < 3.00:
        label = "BESOIN DISCRET"
    else:
        label = "FORMULATION ACQUISE"
    return {"moyenne": m, "formulation": formulation, "label": label}

def boucle_reassurance(rep, score_A, i_alarm, h_norm):
    """Cercle de Joiner — la réassurance qui use son récepteur.
    Active si demande + inefficacité perçue + terrain anxieux."""
    m_re = rep["RE-2"]        # inversé : 5 = le calme ne tient pas
    active = (rep["RE-1"] >= 3) and (m_re >= 3.00)
    terrain = score_A >= 2.61 or i_alarm >= 5 or h_norm >= 0.30
    return {"demande": rep["RE-1"], "tenue": m_re,
            "active": active and terrain, "terrain": terrain}

def convergence_interdimensions(score_A, label_ombre, inv_r_zone,
                                 rc_label):
    """Première convergence inter-dimensions (RIO-01/02 × RIO-06/07).
    Prédiction théorique documentée (chapitre émotionnel) :
      A vive × ombre d'attachement → invalidation reçue présente
      ET reproche-code actif (la même personne qui craint l'abandon
      formule en reproche et reçoit la minimisation).
    Contrôles applicables seulement si le terrain les concerne —
    index = satisfaits ÷ applicables (même logique Q2 attachement)."""
    checks = []
    if score_A >= 2.61 and label_ombre in ("PEUR DE PERDRE","LES DEUX"):
        checks.append(("CI-1", inv_r_zone != "ABSENT"))
        checks.append(("CI-2", rc_label in ("REPROCHE-CODE ACTIF",
                        "BESOIN VIVANT, FORMULATION MIXTE")))
    if not checks:
        return {"index": 1.00, "prudence": False, "checks": checks,
                "applicables": 0}
    sat = sum(1 for _, ok in checks if ok)
    return {"index": round(sat / len(checks), 2),
            "prudence": index_p(index := sat/len(checks)),
            "checks": checks, "applicables": len(checks)}

def index_p(i):
    if i == 1.00: return False
    if i <= 0.50: return True   # prudence forte
    return False

def palier(inv_d, rc_label, boucle_active):
    """Palier de la quête — 🟢 exercice maison · 🟠 le décodeur à
    deux · 🔴 orientation (escalade d'invalidation chronique
    bilatérale = dynamique documentée à haut risque)."""
    grave = (inv_d["zone"] == "FRÉQUENT"
             and inv_d["moyenne"] >= 4.0
             and boucle_active)
    if grave: return "🔴"
    if (inv_d["zone"] != "ABSENT" or inv_d["moyenne"] >= 2.60
            or rc_label == "REPROCHE-CODE ACTIF" or boucle_active):
        return "🟠"
    return "🟢"


# ============================================================
# TEMPLATES — ajoutés pour validation C3/C5 (non dans spec originale)
# Règle : JAMAIS de verdict d'être. Zones descriptives uniquement.
# L'invalidant n'est jamais condamné, l'invalidé n'est jamais minimisé.
# ============================================================

TEMPLATES_INVALIDATION_DONNEE = {
    "ABSENT": "La minimisation n'apparaît pas dans ce que tu décris de "
              "tes réactions — tu accueilles le ressenti de l'autre tel "
              "qu'il est.",
    "OCCASIONNEL": "La minimisation apparaît occasionnellement dans tes "
                   "échanges — c'est un mécanisme, pas une définition de "
                   "qui tu es.",
    "FRÉQUENT": "La minimisation apparaît fréquemment dans tes échanges — "
                "quand on conteste le ressenti de l'autre, le lien s'use. "
                "C'est un signal, pas un verdict.",
}

TEMPLATES_INVALIDATION_RECUE = {
    "ABSENT": "Ce que tu reçois ne montre pas de minimisation — ton "
              "ressenti est respecté.",
    "OCCASIONNEL": "Ce que tu décris recevoir montre de la minimisation "
                   "occasionnelle — ce que tu ressens est réel, même si on "
                   "te dit le contraire.",
    "FRÉQUENT": "Ce que tu décris recevoir montre de la minimisation "
                "fréquente — ce que tu ressens est réel. C'est un signal, "
                "pas une fatalité.",
}

TEMPLATES_REPROCHE_CODE = {
    "REPROCHE-CODE ACTIF": "Tu attends que l'autre devine plutôt que tu ne "
                           "formules — c'est un mécanisme qui s'observe, pas "
                           "un défaut de caractère.",
    "BESOIN VIVANT, FORMULATION MIXTE": "Tu sens ce qui te manque, et tu "
                                        "formules tantôt en reproche tantôt "
                                        "en demande — c'est un mixte honnête.",
    "BESOIN DISCRET": "Tes besoins sont discrets — ni formulés ni attendus "
                      "en devinette. C'est une position.",
    "FORMULATION ACQUISE": "Tu formules tes besoins explicitement — c'est "
                           "une assise.",
}

TEMPLATES_BOUCLE = {
    True: "Le cercle de la réassurance tourne — tu demandes des preuves, le "
          "calme ne tient pas. C'est un mécanisme documenté, pas une faute.",
    False: "Le cercle de la réassurance ne tourne pas — ou tu ne demandes "
           "pas, ou le calme tient.",
}

TEMPLATES_PALIER = {
    "🟢": "Exercice maison — explore les pistes de formulation claire.",
    "🟠": "Le décodeur à deux — un travail de communication est possible.",
    "🔴": "Orientation — la dynamique d'invalidation chronique bilatérale est "
          "documentée à haut risque. Un accompagnement professionnel est suggéré.",
}

# Mots interdits (test C3a — anti-culpabilisation bilatérale)
MOTS_INTERDITS_VERDICT = [
    "tu es invalidant", "tu es invalidante",
    "tu es mauvais", "tu es toxique",
    "c'est ta faute", "tu devrais avoir honte",
    "tu ne vaux rien", "tu abîmes",
]
