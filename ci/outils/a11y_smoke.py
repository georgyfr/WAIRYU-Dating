#!/usr/bin/env python3
# ═══════════════════════════════════════════════════════════════════
# SMOKE A11Y APPS/WEB — findings G.4a + G.3b (re-audit 31-REAUDIT)
# mission P0 runtime — volet frontend/accessibilité
#
# ZÉRO dépendance : python3 stdlib UNIQUEMENT (pas de node_modules — le
# clone n'installe rien ; même convention que balayage_codes_rendu.py).
#
# Balaye apps/web/src/**/*.tsx et parse apps/web/src/styles.css :
#   ① NOM ACCESSIBLE — pour chaque élément interactif (<button>, <a>,
#      <input>, <select>, <textarea>, role="button") : contenu texte
#      statique, texte dynamique ({…} hors aria-hidden), alt des <img>
#      enfants (nom par contenu), aria-label / aria-labelledby, <label>
#      associé (htmlFor ou englobant). Manque total = 🔴 dur.
#   ② IMAGES — <img> sans attribut alt = 🔴 dur ; alt="" décoratif = ✅
#      (consigné) ; alt="…" = ✅.
#   ③ CIBLES TACTILES (par classes) — pour chaque classe appliquée à un
#      <button>/<a> : règles styles.css applicables (width / height /
#      min-height / padding / font-size / line-height / border) et BORNE
#      INFÉRIEURE plausible de la hauteur (et largeur si width fixé).
#      Approche conservatrice documentée :
#        · box-sizing: border-box global (styles.css `*`) → height fixée
#          vaut hauteur rendue (pire cas = minimum sur tous les contextes,
#          media queries non résolus — biais bas : ne peut que
#          SUR-signaler, jamais faux VERT) ;
#        · sinon hauteur ≥ paddings verticaux (minimum déclaré) + contenu
#          textuel estimé (font-size minimum × line-height ; défaut
#          16px × 1.2) + bordures verticales ;
#        · inférence contenu : si une règle `.classe img` fixe une hauteur
#          px, la cible contient une image → contenu = max(texte, image) ;
#        · variantes conditionnées par un ancêtre absent de l'élément
#          (`.x .y`, body.theme-dark .y…) : ignorées ici — elles sont
#          TRAITÉES en ⑥ (sélecteurs descendants) ;
#        · hauteur pilotée par aspect-ratio + largeur fluide (%, vw) :
#          indéterminable → consignée « à vérifier », ne fait PAS échouer
#          (honnêteté > faux rouge) ;
#        · indéterminable (%, calc, contenu libre) → consigné « à vérifier »,
#          ne fait PAS échouer (honnêteté > faux rouge).
#   ⑥ CIBLES TACTILES (sélecteurs descendants) — toute règle CSS dont le
#      DERNIER composé cible un tag button/a ou une classe posée sur un
#      button/a. COMPLÉTION 33-c : agrégation PAR SÉLECTEUR sur toutes les
#      règles (toutes media confondus — pire cas) : hauteur plausible =
#      max(min des height, max des min-height) — en CSS min-height gagne
#      TOUJOURS sur height (idem largeur), la borne rendue est donc
#      conservatrice et ne peut que SUR-signaler, jamais faux VERT.
#      Cible < 44px CERTAINE = 🔴 (référence WCAG 2.5.8 / HIG 44pt).
#
# Sortie : rapport complet (comptages, manquements, consignations) ·
# code 1 si au moins un 🔴, 0 sinon.
#
# Exécution : python3 ci/outils/a11y_smoke.py   (racine du dépôt)
# ═══════════════════════════════════════════════════════════════════

import re
import sys
from pathlib import Path

RACINE = Path(__file__).resolve().parents[2]
SRC = RACINE / "apps" / "web" / "src"
CSS = SRC / "styles.css"

MIN_TARGET = 44  # px
INTERACTIFS = ("button", "a", "input", "select", "textarea")
VOID = {"img", "input", "br", "hr", "meta", "link", "source", "wbr"}
TAG_RE = re.compile(r"<(button|a|input|select|textarea|img)(?=[\s/>])")


# ───────────────────────────────────────── utilitaires source JSX ────

def blinder_commentaires(src: str, lignes: bool = True) -> str:
    """Neutralise les commentaires — espaces et sauts de ligne conservés.
    · /* … */ toujours (y compris {/* … */} JSX) ;
    · // … en fin d'expression (lignes=True) SAUF « :// » (URLs dans les
      chaînes) — vérifié sur le corpus : aucun « // » en texte JSX.
    Les chaînes ne sont pas altérées : les attributs y sont lus ensuite."""
    out, i, n = [], 0, len(src)
    while i < n:
        c = src[i]
        if c == "/" and i + 1 < n and src[i + 1] == "*":
            j = src.find("*/", i + 2)
            j = n if j < 0 else j + 2
            out.append("".join(ch if ch == "\n" else " " for ch in src[i:j]))
            i = j
            continue
        if lignes and c == "/" and i + 1 < n and src[i + 1] == "/" and (i == 0 or src[i - 1] != ":"):
            j = src.find("\n", i)
            j = n if j < 0 else j
            out.append("".join(ch if ch == "\n" else " " for ch in src[i:j]))
            i = j
            continue
        out.append(c)
        i += 1
    return "".join(out)


def fin_de_balise(code: str, debut: int) -> int:
    """Index du '>' fermant la balise ouverte à `debut`, en ignorant les '>'
    imbriqués dans {…} (arrow functions, ternaires) et les chaînelles."""
    i, n, depth, quote = debut, len(code), 0, None
    while i < n:
        c = code[i]
        if quote:
            if c == "\\":
                i += 2
                continue
            if c == quote:
                quote = None
        elif c in "\"'`":
            quote = c
        elif c == "{":
            depth += 1
        elif c == "}":
            depth -= 1
        elif c == ">" and depth == 0:
            return i
        i += 1
    return n


def attributs(brut: str) -> dict:
    """Attributs d'une balise JSX → {nom: 'valeur' | '{expr}' | None}.
    CORRECTION 33-c : un attribut NU suivi d'un autre attribut (« hidden
    onChange={…} ») était perdu — l'ancienne ancre (=|$) échouait dès qu'un
    attribut suivait ; l'ancre est désormais une anticipation (=, fin, « / »
    de self-close, ou blanc suivi d'un caractère)."""
    attrs, i, n = {}, 0, len(brut)
    while i < n:
        m = re.match(r"\s*([A-Za-z_][\w.-]*)\s*(?=[=>\s/]|$)", brut[i:])
        if not m:
            i += 1
            continue
        nom, i = m.group(1), i + m.end()
        if i >= n or brut[i] != "=":
            attrs[nom] = None
            continue
        i += 1
        if i < n and brut[i] in "\"'":
            q = brut[i]
            j = brut.find(q, i + 1)
            if j < 0:
                j = n
            attrs[nom] = brut[i + 1 : j]
            i = j + 1
        elif i < n and brut[i] == "{":
            depth, k, q = 0, i, None
            while k < n:
                c = brut[k]
                if q:
                    if c == "\\":
                        k += 2
                        continue
                    if c == q:
                        q = None
                elif c in "\"'`":
                    q = c
                elif c == "{":
                    depth += 1
                elif c == "}":
                    depth -= 1
                    if depth == 0:
                        break
                k += 1
            attrs[nom] = brut[i : k + 1]
            i = k + 1
        else:
            m2 = re.match(r"[^\s/>]+", brut[i:])
            attrs[nom] = m2.group(0) if m2 else None
            i += m2.end() if m2 else 0
    return attrs


def classes_de(valeur) -> list:
    """Classes d'un attribut className : littéraux de gabarit + chaînes
    quotées, découpés aux espaces. Les jetons interpolés (${…}) sont
    abandonnés (indéterminés statiquement)."""
    if valeur is None:
        return []
    brut = valeur[1:-1] if valeur.startswith("{") and valeur.endswith("}") else valeur
    brut = brut.replace("${", " \x00")  # coupe les parties interpolées
    tokens = []
    for morceau in re.findall(r"`([^`]*)`|'([^']*)'|\"([^\"]*)\"|([\w\s./:-]+)", brut):
        for part in morceau:
            if part:
                tokens.extend(part.split())
    return [t for t in tokens if re.match(r"^-?[A-Za-z][\w-]*$", t)]


def aria_cache_dans(brut: str) -> bool:
    return bool(re.search(r"aria-hidden\s*=\s*[\"'{]?\s*(true|1|\{true\})", brut))


def expressions(segment: str) -> list:
    """{…} équilibrées d'un segment JSX (les apostrophes du texte français
    ne sont PAS des délimiteurs — pas de suivi de chaînes ici)."""
    dyn, depth, start = [], 0, None
    for idx, c in enumerate(segment):
        if c == "{":
            if depth == 0:
                start = idx
            depth += 1
        elif c == "}":
            depth -= 1
            if depth == 0 and start is not None:
                expr = segment[start : idx + 1]
                if "/*" not in expr:
                    dyn.append(expr)
                start = None
    return dyn


def hors_expressions(segment: str) -> str:
    """Texte du segment hors {…} (entités JSX comptées comme du texte)."""
    out, depth = [], 0
    for c in segment:
        if c == "{":
            depth += 1
        elif c == "}":
            depth -= 1
        elif depth == 0:
            out.append(c)
    return "".join(out)


def extraire_enfants(code: str, debut: int, tag: str):
    """Enfants d'un <tag …> non vide → (statique, dyn, contient_img).
    Suit l'imbrication (pile) ; le contenu sous aria-hidden est ignoré ;
    l'alt d'un <img> enfant (non vide) participe au nom (nom par contenu) ;
    la balise fermante homonyme de profondeur 0 termine la zone."""
    n = len(code)
    statique, dyn, contient_img = [], [], False
    pile = []  # (nom, aria_hidden)
    pos = debut
    while pos < n:
        lt = code.find("<", pos)
        if lt < 0:
            break
        seg = code[pos:lt]
        if not (pile and pile[-1][1]):
            statique.append(hors_expressions(seg))
            dyn.extend(expressions(seg))
        fm = re.match(r"</\s*([A-Za-z][\w-]*)", code[lt : lt + 80])
        if fm:
            nom = fm.group(1)
            while pile and pile[-1][0] != nom:
                pile.pop()
            if pile:
                pile.pop()
            pos = (code.find(">", lt) + 1) if ">" in code[lt : lt + 200] else n
            if nom == tag and not any(p[0] == tag for p in pile):
                break
            continue
        j = fin_de_balise(code, lt + 1)
        brut = code[lt : j + 1]
        nm = re.match(r"<([A-Za-z][\w.-]*)", brut)
        selfclose = brut.rstrip()[:-1].rstrip().endswith("/") or (nm and nm.group(1) in VOID)
        if nm and nm.group(1) == "img":
            contient_img = True
            if not (pile and pile[-1][1]):
                alt = attributs(brut[1:-1].strip()).get("alt")
                if alt:  # alt="" décoratif : pas un nom
                    statique.append(alt)
        if nm and not selfclose:
            ah = aria_cache_dans(brut) or bool(pile and pile[-1][1])
            pile.append((nm.group(1), ah))
        pos = j + 1
    return " ".join(" ".join(statique).split()), dyn, contient_img


def scanner_tsx(chemin: Path):
    """(interactifs, images) — dicts consommés par le rapport."""
    code = blinder_commentaires(chemin.read_text(encoding="utf-8"))
    interactifs, images = [], []
    labels_for = set(re.findall(r"htmlFor\s*=\s*\"([\w-]+)\"", code)) | set(
        re.findall(r"htmlFor\s*=\s*\{\s*['\"]([\w-]+)['\"]", code)
    )
    pile = []  # (nom, aria_hidden)

    def ligne(pos):
        return code.count("\n", 0, pos) + 1

    i, n = 0, len(code)
    while i < n:
        lt = code.find("<", i)
        if lt < 0:
            break
        fm = re.match(r"</\s*([A-Za-z][\w-]*)", code[lt : lt + 80])
        if fm:
            nom = fm.group(1)
            while pile and pile[-1][0] != nom:
                pile.pop()
            if pile:
                pile.pop()
            i = (code.find(">", lt) + 1) if ">" in code[lt : lt + 200] else n
            continue
        m = TAG_RE.match(code, lt)
        j = fin_de_balise(code, lt + 1)
        brut = code[lt : j + 1]
        attrs = attributs(brut[1:-1].strip())
        nm = re.match(r"<([A-Za-z][\w.-]*)", brut)
        selfclose = brut.rstrip()[:-1].rstrip().endswith("/") or (nm and nm.group(1) in VOID)

        if not m:
            if nm and not selfclose:
                pile.append((nm.group(1), aria_cache_dans(brut) or bool(pile and pile[-1][1])))
            i = j + 1
            continue

        tag = m.group(1)
        i = j + 1
        if tag == "img":
            images.append(
                {
                    "fichier": chemin,
                    "ligne": ligne(lt),
                    "alt_ok": "alt" in attrs,
                    "decoratif": attrs.get("alt") == "",
                    "classes": classes_de(attrs.get("className")),
                }
            )
            continue

        dans_label = any(p[0] == "label" for p in pile)
        cache = bool(pile and pile[-1][1])
        if attrs.get("hidden") is not None or "hidden" in attrs:
            continue  # contrôle masqué (ex. input file caché) : pas une cible
        statique, dyn, contient_img = ("", [], False)
        if tag in ("button", "a") and not selfclose:
            statique, dyn, contient_img = extraire_enfants(code, j + 1, tag)
        ident = attrs.get("id")
        nom_label = (ident and ident in labels_for) or dans_label
        nom_ok = bool(
            statique
            or dyn
            or attrs.get("aria-label")
            or attrs.get("aria-labelledby")
            or (nom_label and tag in ("input", "select", "textarea"))
        )
        source = (
            "texte" if statique
            else "dynamique {…}" if dyn
            else "aria-label" if attrs.get("aria-label")
            else "aria-labelledby" if attrs.get("aria-labelledby")
            else "label/htmlFor" if nom_label and tag in ("input", "select", "textarea")
            else "AUCUN"
        )
        interactifs.append(
            {
                "fichier": chemin,
                "ligne": ligne(lt),
                "tag": tag,
                "classes": classes_de(attrs.get("className")),
                "aria_cache": cache,
                "nom_ok": nom_ok,
                "nom_source": source,
                "contient_img": contient_img,
            }
        )
    return interactifs, images


# ───────────────────────────────────────────── parse de styles.css ────

def _decls(corps: str):
    out = []
    for d in corps.split(";"):
        if ":" in d:
            k, v = d.split(":", 1)
            out.append((k.strip().lower(), v.strip()))
    return out


def parser_css(texte: str):
    """Règles (media, sélecteur, corps). @media/@supports aplatis avec leur
    condition ; les pseudo-éléments (::…) ignorés — décorations, pas la
    boîte de l'élément."""
    css = blinder_commentaires(texte, lignes=False)  # CSS : pas de //
    regles, pile_media = [], []
    i, n = 0, len(css)
    while i < n:
        c = css[i]
        if c == "@":
            m = re.match(r"@(media|supports)\b([^{]*)\{", css[i:])
            if m:
                pile_media.append(m.group(2).strip())
                i += m.end()
                continue
            m2 = re.match(r"@[a-zA-Z-]+[^{]*\{", css[i:])
            if m2:
                j, depth = i + m2.end(), 1
                while j < n and depth:
                    if css[j] == "{":
                        depth += 1
                    elif css[j] == "}":
                        depth -= 1
                    j += 1
                i = j
                continue
            j = css.find(";", i)
            i = (j + 1) if j >= 0 else n
            continue
        if c == "}":
            if pile_media:
                pile_media.pop()
            i += 1
            continue
        m = re.match(r"([^{}@]+)\{([^{}]*)\}", css[i:])
        if m:
            sel, corps = m.group(1).strip(), m.group(2).strip()
            media = " ".join(pile_media) if pile_media else None
            if "::" not in sel and corps:
                regles.append((media, sel, corps))
            i += m.end()
            continue
        i += 1
    return regles


def composants(sel_u: str):
    """Sélecteur unitaire → composés nettoyés (pseudo-classes retirées)."""
    sel_u = re.sub(r":has\([^)]*\)|:not\([^)]*\)|:{1,2}[a-zA-Z-]+(\([^)]*\))?", "", sel_u)
    return [c for c in re.split(r"[\s>+~]+", sel_u.strip()) if c]


def dernier_composant(sel_u: str):
    cs = composants(sel_u)
    return cs[-1] if cs else None


def compound_matches(comp: str, classes: set, tag: str) -> bool:
    """Un composé (.a.b, button.on, body…) matche-t-il l'élément ?
    TOUTES les classes du composé doivent être posées sur l'élément (.a.b
    exige a ET b — bug corrigé : l'ancienne version ne lisait que la 1ʳᵉ) ;
    un tag explicite doit être celui de l'élément ; sans classe ni tag :
    ancêtre générique (body/html/*/[attr]) accepté."""
    clss = re.findall(r"\.([A-Za-z][\w-]*)", comp)
    tm = re.match(
        r"^(button|a|input|select|textarea|img|label|div|span|nav|header|footer|ul|li|p|h[1-6]|section|article|form|table|td|th|tr|main|aside)(?![\w-])",
        comp,
    )
    if tm and tm.group(1) != tag:
        return False
    if clss:
        return all(c in classes for c in clss)
    if tm:
        return True  # sélecteur de tag pur (ancêtre ou cible tag)
    return comp in ("body", "html", "*") or comp.startswith("[")


PX = re.compile(r"^(-?\d+(?:\.\d+)?)(px|rem|em)$")


def val_px(decl: str):
    """Première longueur px/rem/em → float ; None si %, calc, auto…"""
    m = PX.match(decl.strip())
    if m:
        v = float(m.group(1))
        return v * 16 if m.group(2) in ("rem", "em") else v
    if "clamp(" in decl:
        nums = [float(x) for x in re.findall(r"(\d+(?:\.\d+)?)px", decl)]
        return min(nums) if nums else None
    return None


def paddings_v(corps: str):
    """(somme paddings VERTICAUX px — composant indéterminé compté 0,
    au_moins_un_padding_connu). Shorthand : V=1er/3e valeur (1 ou 2
    valeurs → la 1ʳᵉ compte deux fois)."""
    total, connu = 0.0, False
    for k, v in _decls(corps):
        if k == "padding":
            parts = v.split()
            if len(parts) == 1:
                total += 2 * (val_px(parts[0]) or 0)
            elif len(parts) == 2:
                total += 2 * (val_px(parts[0]) or 0)
            else:
                total += (val_px(parts[0]) or 0) + (val_px(parts[2]) or 0)
            connu = True
        elif k in ("padding-top", "padding-bottom"):
            x = val_px(v)
            total += x or 0
            connu = True
    return total, connu


def bordures_v(corps: str):
    """(largeur de bordure verticale totale retenue, connu) — minimum des
    déclarations (border:none compte 0) : biais bas conservateur."""
    vals = []
    for k, v in _decls(corps):
        if k in (
            "border", "border-width", "border-top", "border-bottom",
            "border-top-width", "border-bottom-width", "border-block",
        ):
            if v.strip() in ("none", "0"):
                vals.append(0.0)
                continue
            parts = v.split()
            x = val_px(parts[0]) if parts else None
            if x:
                vals.append(x)
    return (min(vals) if vals else 0.0), bool(vals)


def contenu_ligne(candidats_fs, candidats_lh):
    """Contenu textuel vertical estimé — pire cas (minimums) : le contenu
    ne peut pas être plus petit que ça (biais bas conservateur)."""
    fs = min(candidats_fs) if candidats_fs else 16.0  # défaut 16px documenté
    if candidats_lh:
        estimations = [fs * x if genre == "ratio" else x for genre, x in candidats_lh]
        return min(estimations)
    return fs * 1.2  # ratio par défaut documenté


def regles_pour(regles, classes, tag):
    """Règles applicables à (tag, classes) : chaque composé doit matcher
    (compound_matches) ET le DERNIER composé doit porter au moins une classe
    de l'élément — les règles dont la cible finale est un tag nu (.x button)
    sont conditionnées par un ancêtre inconnu : elles sortent du périmètre
    ③ et sont traitées en ⑥ (sélecteurs descendants)."""
    ok = []
    cl = set(classes)
    if not cl:
        return ok
    for media, sel, corps in regles:
        for sel_u in sel.split(","):
            compos = composants(sel_u)
            if not compos:
                continue
            if not all(compound_matches(c, cl, tag) for c in compos):
                continue
            dern = compos[-1]
            if not re.findall(r"\.([A-Za-z][\w-]*)", dern):
                continue  # cible finale = tag nu → passe ⑥
            ok.append((media, sel_u.strip(), corps))
            break
    return ok


def img_inference(regles, classes, img_classes):
    """Règles dont les composés ancêtres sont justifiés par les classes de
    l'élément et dont la CIBLE est une image (tag img, ou classe posée sur
    un <img> du JSX — ex. `.msgtoast-ava`) avec height px → la carte contient
    cette image → son contenu vaut au moins cette hauteur (une image en flux
    ne rétrécit pas son parent). Retourne (hauteur_px_min | None, trouvée) —
    trouvée sans px = taille en %/calc → hauteur pilotée par l'image :
    indéterminable statiquement."""
    cl = set(classes)
    pxs, trouvee = [], False
    for _media, sel, corps in regles:
        for sel_u in sel.split(","):
            comps = composants(sel_u)
            if len(comps) < 2:
                continue
            if not all(compound_matches(c, cl, None) for c in comps[:-1]):
                continue
            dern = comps[-1]
            dcl = re.findall(r"\.([A-Za-z][\w-]*)", dern)
            if dern == "img":
                est_img = True  # tag nu : `.carte img`
            elif dern.startswith("img."):
                est_img = bool(dcl) and all(c in img_classes for c in dcl)
            else:
                # cible classe pure (pas un tag) : posée sur un <img> du JSX ?
                est_img = bool(dcl) and not re.match(
                    r"^(button|a|input|select|textarea|img|label|div|span|nav|header|footer|ul|li|p|h[1-6]|section|article|form|table|td|th|tr|main|aside)$", dern
                ) and all(c in img_classes for c in dcl)
            if not est_img:
                continue
            trouvee = True
            for k, v in _decls(corps):
                if k == "height":
                    x = val_px(v)
                    if x:
                        pxs.append(x)
    return (min(pxs) if pxs else None), trouvee


def cible_minimale(regles_elem, contient_img, img_px=None):
    """Borne inférieure conservatrice (hauteur, largeur) — cf. en-tête.
    img_px = hauteur d'image contenue connue (inférence) → contenu ≥ img_px.
    COMPLÉTION 33-c : un élément dimensionné par aspect-ratio (largeur
    fluide) a une hauteur réelle dépendante du contexte → « inconnu »
    (consigné, hors verdict) au lieu d'une estimation trompeuse.
    Retourne (h, w, statut) : statut ∈ {ok, inconnu}."""
    hauteurs, largeurs = [], []
    min_h = min_w = 0.0
    pads, fss, lhs, brs = [], [], [], []
    aspect = False
    for _media, _sel, corps in regles_elem:
        if _sel.strip() == "*":
            continue  # reset universel (* { padding: 0 }) : neutralisé par
            # toute règle ultérieure déclarant un padding — hors estimation
        for k, v in _decls(corps):
            if k == "height":
                x = val_px(v)
                if x is not None:
                    hauteurs.append(x)
            elif k == "min-height":
                x = val_px(v)
                if x is not None:
                    min_h = max(min_h, x)
            elif k == "width":
                x = val_px(v)
                if x is not None:
                    largeurs.append(x)
            elif k == "min-width":
                x = val_px(v)
                if x is not None:
                    min_w = max(min_w, x)
            elif k == "aspect-ratio":
                aspect = True
            elif k == "font-size":
                x = val_px(v)
                if x is not None:
                    fss.append(x)
            elif k == "line-height":
                m = re.match(r"^(\d+(?:\.\d+)?)$", v)
                if m:
                    lhs.append(("ratio", float(m.group(1))))
                else:
                    x = val_px(v)
                    if x:
                        lhs.append(("px", x))
        pad, pad_connu = paddings_v(corps)
        if pad_connu:
            pads.append(pad)
        br, br_connu = bordures_v(corps)
        if br_connu:
            brs.append(br)
    if hauteurs:  # height fixée (border-box) → pire cas = minimum
        h = max(min(hauteurs), min_h)
        statut = "ok"
    else:
        # contenu = max(texte estimé, image contenue) — une image en flux
        # impose sa hauteur au parent
        contenu = max(contenu_ligne(fss, lhs), img_px or 0.0)
        base = (min(pads) if pads else 0.0) + contenu + (min(brs) if brs else 0.0)
        if aspect and not min_h:
            # hauteur pilotée par le ratio × une largeur fluide : la hauteur
            # réelle dépend du contexte d'affichage — indéterminable
            # statiquement (honnêteté > faux rouge) ; un min-height déclaré
            # reste une borne dure et suffit au verdict.
            h, statut = None, "inconnu"
        elif pads or fss or img_px is not None:
            h = max(base, min_h)
            statut = "ok"
        elif min_h:
            h = min_h
            statut = "ok"
        elif contient_img:
            # carte à image sans taille déclarée : hauteur pilotée par le
            # contenu réel (photo) — hors périmètre d'une analyse statique
            h, statut = None, "inconnu"
        else:
            h, statut = None, "inconnu"
    w = None
    if largeurs:
        w = max(min(largeurs), min_w)
    elif min_w:
        w = min_w
    return h, w, statut


# ───────────────────────────────────────────── programme principal ────

def main() -> int:
    tsx = sorted(SRC.rglob("*.tsx"))
    if not tsx or not CSS.exists():
        print("🔴 Structure attendue absente (apps/web/src/**/*.tsx, styles.css).")
        return 1
    regles = parser_css(CSS.read_text(encoding="utf-8"))

    tous_inter, toutes_img = [], []
    for f in tsx:
        inter, img = scanner_tsx(f)
        tous_inter.extend(inter)
        toutes_img.extend(img)

    # inventaire des classes posées sur des button/a et des <img> (pour ③/⑥)
    classes_bouton = set()
    for e in tous_inter:
        if e["tag"] in ("button", "a"):
            classes_bouton.update(e["classes"])
    classes_img = set()
    for i2 in toutes_img:
        classes_img.update(i2["classes"])

    # ① noms accessibles
    sans_nom = [e for e in tous_inter if not e["nom_ok"] and not e["aria_cache"]]
    masques = [e for e in tous_inter if e["aria_cache"]]

    # ② images
    img_ko = [i for i in toutes_img if not i["alt_ok"]]
    img_deco = [i for i in toutes_img if i["alt_ok"] and i["decoratif"]]

    # ③ cibles tactiles par classes (button / a)
    cibles_ko, cibles_verif, cibles_ok = [], [], 0
    vus = set()
    for e in tous_inter:
        if e["tag"] not in ("button", "a") or e["aria_cache"] or not e["classes"]:
            continue
        cle = (tuple(e["classes"]), e["tag"])
        if cle in vus:
            continue
        vus.add(cle)
        r_elems = regles_pour(regles, e["classes"], e["tag"])
        # inférence image sur TOUTES les règles (`.carte img` n'a pas de
        # classe d'élément en dernier composé — regles_pour l'écarte)
        img_px, img_trouvee = img_inference(regles, e["classes"], classes_img)
        h, w, statut = cible_minimale(r_elems, e["contient_img"], img_px)
        nom = " ".join(e["classes"]) + f" <{e['tag']}>"
        if (h is not None and h < MIN_TARGET) or (w is not None and w < MIN_TARGET):
            detail = []
            if h is not None and h < MIN_TARGET:
                detail.append(f"h≈{h:.0f}px")
            if w is not None and w < MIN_TARGET:
                detail.append(f"w≈{w:.0f}px")
            cibles_ko.append((nom, ", ".join(detail)))
        elif statut == "inconnu":
            cibles_verif.append(nom + (" (carte à image — hauteur pilotée par la photo)" if img_trouvee or e["contient_img"] else ""))
        else:
            cibles_ok += 1

    # ⑥ cibles tactiles par sélecteurs descendants (dernier composé interactif)
    # COMPLÉTION 33-c : agrégation PAR SÉLECTEUR sur toutes les règles (media
    # confondus — pire cas) ; la borne rendue plausible tient compte des
    # min-height/min-width : en CSS min-height gagne TOUJOURS sur height,
    # donc hauteur plausible = max(min des height, max des min-height).
    # Biais conservateur intact : la borne ne peut que SOUS-estimer la
    # réalité (sur-signalement possible, faux VERT impossible).
    sacs: dict = {}
    for media, sel, corps in regles:
        for sel_u in sel.split(","):
            dern = dernier_composant(sel_u)
            if not dern:
                continue
            cm = re.match(r"^\.([A-Za-z][\w-]*)$", dern)
            if not (dern in ("button", "a") or (cm and cm.group(1) in classes_bouton)):
                continue
            sac = sacs.setdefault(sel_u.strip(), {"h": [], "w": [], "mh": [], "mw": []})
            for k, v in _decls(corps):
                x = val_px(v)
                if x is None:
                    continue
                if k == "height":
                    sac["h"].append(x)
                elif k == "min-height":
                    sac["mh"].append(x)
                elif k == "width":
                    sac["w"].append(x)
                elif k == "min-width":
                    sac["mw"].append(x)

    def borne(sac, fixees, minims):
        """Borne rendue plausible : max(min des valeurs fixées, max des
        minimums) ; None si rien n'est déclaré."""
        if fixees:
            return max(min(fixees), max(minims) if minims else 0.0)
        return max(minims) if minims else None

    descend_ko = []
    for cle, sac in sacs.items():
        hauteur = borne(sac, sac["h"], sac["mh"])
        largeur = borne(sac, sac["w"], sac["mw"])
        if (hauteur is not None and hauteur < MIN_TARGET) or (
            largeur is not None and largeur < MIN_TARGET
        ):
            detail = []
            if hauteur is not None and hauteur < MIN_TARGET:
                detail.append(f"height {hauteur:g}px")
            if largeur is not None and largeur < MIN_TARGET:
                detail.append(f"width {largeur:g}px")
            descend_ko.append((cle, ", ".join(detail)))

    # rapport
    print("═══ SMOKE A11Y APPS/WEB — noms accessibles · images · cibles tactiles ≥ 44px ═══")
    print(f"Fichiers tsx balayés : {len(tsx)} · règles CSS retenues : {len(regles)}")
    comptage = {
        t: sum(1 for e in tous_inter if e["tag"] == t)
        for t in ("button", "a", "input", "select", "textarea")
    }
    print(
        f"Interactifs : {len(tous_inter)} — " + " · ".join(f"{t} {c}" for t, c in comptage.items())
        + f" — sous aria-hidden (hors cible, consignés) : {len(masques)}"
    )
    print(f"Images : {len(toutes_img)} — alt=\"\" décoratif (consigné) : {len(img_deco)}")
    print()
    print(f"① NOM ACCESSIBLE MANQUANT : {len(sans_nom)}")
    for e in sans_nom:
        print(f"  🔴 {e['fichier'].relative_to(RACINE)}:{e['ligne']} <{e['tag']}> — {e['nom_source']}")
    print(f"② IMAGES SANS ALT : {len(img_ko)}")
    for i2 in img_ko:
        print(f"  🔴 {i2['fichier'].relative_to(RACINE)}:{i2['ligne']} <img> sans attribut alt")
    print(f"③ CIBLES < {MIN_TARGET}px (classes button/a) : {len(cibles_ko)}")
    for nom, detail in cibles_ko:
        print(f"  🔴 {nom} → {detail}")
    print(f"⑥ CIBLES < {MIN_TARGET}px (sélecteurs descendants, règles dédiées) : {len(descend_ko)}")
    for nom, detail in descend_ko:
        print(f"  🔴 {nom} → {detail}")
    print(f"④ CIBLES ≥ {MIN_TARGET}px vérifiées (classes uniques) : {cibles_ok}")
    print(f"⑤ À VÉRIFIER (hauteur indéterminable statiquement : %, calc, aspect-ratio, contenu libre) : {len(cibles_verif)}")
    for nom in cibles_verif:
        print(f"  ⚠ à vérifier : {nom}")
    if img_deco:
        print("   décoratives : " + ", ".join(f"{i2['fichier'].relative_to(RACINE)}:{i2['ligne']}" for i2 in img_deco))
    if masques:
        print("   sous aria-hidden : " + ", ".join(f"{e['fichier'].relative_to(RACINE)}:{e['ligne']} <{e['tag']}>" for e in masques[:10]))
    rouges = len(sans_nom) + len(img_ko) + len(cibles_ko) + len(descend_ko)
    print()
    print(
        "VERDICT SMOKE A11Y : 🔴 ROUGE — manquements durs à corriger." if rouges
        else "VERDICT SMOKE A11Y : 🟢 VERT — 0 manquement dur (« à vérifier » consignés, hors verdict)."
    )
    return 1 if rouges else 0


if __name__ == "__main__":
    sys.exit(main())
