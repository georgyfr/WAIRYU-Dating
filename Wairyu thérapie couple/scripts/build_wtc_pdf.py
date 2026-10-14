# -*- coding: utf-8 -*-
"""
Génération du PDF « programme wairyu couple.pdf »
Pipeline Report (ReportLab) + couverture Template 07 Crystal Blue (html2poster.js)
Source : /home/z/my-project/download/programme wairyu couple.txt
"""
import os
import re
import sys
import hashlib
import subprocess

PDF_SKILL_DIR = "/home/z/my-project/skills/pdf"
sys.path.insert(0, os.path.join(PDF_SKILL_DIR, "scripts"))

from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT, TA_JUSTIFY, TA_CENTER
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily
from reportlab.platypus import (SimpleDocTemplate, Paragraph, Spacer, Table,
                                TableStyle, PageBreak, CondPageBreak,
                                KeepTogether)
from reportlab.platypus.tableofcontents import TableOfContents

# ------------------------------------------------------------------
# 1. Polices
# ------------------------------------------------------------------
FONT_DIR = "/usr/share/fonts"
pdfmetrics.registerFont(TTFont("FreeSerif", f"{FONT_DIR}/truetype/freefont/FreeSerif.ttf"))
pdfmetrics.registerFont(TTFont("FreeSerif-Bold", f"{FONT_DIR}/truetype/freefont/FreeSerifBold.ttf"))
pdfmetrics.registerFont(TTFont("FreeSerif-Italic", f"{FONT_DIR}/truetype/freefont/FreeSerifItalic.ttf"))
pdfmetrics.registerFont(TTFont("FreeSerif-BoldItalic", f"{FONT_DIR}/truetype/freefont/FreeSerifBoldItalic.ttf"))
pdfmetrics.registerFont(TTFont("NotoSerifSC", f"{FONT_DIR}/truetype/noto-serif-sc/NotoSerifSC-Regular.ttf"))
pdfmetrics.registerFont(TTFont("NotoSerifSC-Bold", f"{FONT_DIR}/truetype/noto-serif-sc/NotoSerifSC-Bold.ttf"))
pdfmetrics.registerFont(TTFont("DejaVuSans", f"{FONT_DIR}/truetype/dejavu/DejaVuSans.ttf"))
pdfmetrics.registerFont(TTFont("DejaVuMono", f"{FONT_DIR}/truetype/dejavu/DejaVuSansMono.ttf"))
registerFontFamily("FreeSerif", normal="FreeSerif", bold="FreeSerif-Bold",
                   italic="FreeSerif-Italic", boldItalic="FreeSerif-BoldItalic")
registerFontFamily("NotoSerifSC", normal="NotoSerifSC", bold="NotoSerifSC-Bold")
registerFontFamily("DejaVuSans", normal="DejaVuSans", bold="DejaVuSans")
registerFontFamily("DejaVuMono", normal="DejaVuMono", bold="DejaVuMono")

from pdf import install_font_fallback  # noqa: E402
install_font_fallback()

# ------------------------------------------------------------------
# 2. Palette Template 07 « Crystal Blue » (corps clair, fixe)
# ------------------------------------------------------------------
PAGE_BG      = colors.HexColor("#f5f8fc")
SECTION_BG   = colors.HexColor("#edf2f9")
CARD_BG      = colors.HexColor("#e4ecf5")
TABLE_STRIPE = colors.HexColor("#eef3fa")
HEADER_FILL  = colors.HexColor("#1a4a7a")
BORDER       = colors.HexColor("#c0d0e2")
ACCENT       = colors.HexColor("#2d7ab3")
TEXT_PRIMARY = colors.HexColor("#142840")
TEXT_MUTED   = colors.HexColor("#5a7a96")

TABLE_HEADER_COLOR = HEADER_FILL
TABLE_ROW_EVEN = colors.white
TABLE_ROW_ODD = TABLE_STRIPE

# ------------------------------------------------------------------
# 3. Document / marges / en-tête-pied de page
# ------------------------------------------------------------------
SRC_TXT = "/home/z/my-project/download/programme wairyu couple.txt"
BODY_PDF = "/home/z/my-project/download/_wtc_body.pdf"
PAGE_W, PAGE_H = A4
LM, RM, TM, BM = 54, 54, 64, 56
AVAIL_W = PAGE_W - LM - RM

DOC_TITLE = "WAIRYU Thérapie Couple — Document de référence complet du programme"


def on_page(canvas, doc):
    canvas.saveState()
    # Fond de page (bleu-blanc très clair, famille 215°)
    canvas.setFillColor(PAGE_BG)
    canvas.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)
    # En-tête
    canvas.setFont("FreeSerif", 8)
    canvas.setFillColor(TEXT_MUTED)
    canvas.drawString(LM, PAGE_H - 40, "WAIRYU Thérapie Couple — Document de référence complet")
    canvas.drawRightString(PAGE_W - RM, PAGE_H - 40, "Contexte projet · GLM Data Insight")
    canvas.setStrokeColor(BORDER)
    canvas.setLineWidth(0.6)
    canvas.line(LM, PAGE_H - 46, PAGE_W - RM, PAGE_H - 46)
    # Pied de page
    canvas.line(LM, 42, PAGE_W - RM, 42)
    canvas.setFont("FreeSerif", 9)
    canvas.setFillColor(TEXT_MUTED)
    canvas.drawCentredString(PAGE_W / 2.0, 28, str(doc.page))
    canvas.setFont("FreeSerif", 7.5)
    canvas.drawRightString(PAGE_W - RM, 28, "Version 1.0 · 14/10/2026")
    canvas.restoreState()


class TocDocTemplate(SimpleDocTemplate):
    def afterFlowable(self, flowable):
        if hasattr(flowable, "bookmark_name"):
            level = getattr(flowable, "bookmark_level", 0)
            text = getattr(flowable, "bookmark_text", "")
            key = getattr(flowable, "bookmark_key", "")
            self.notify("TOCEntry", (level, text, self.page, key))


# ------------------------------------------------------------------
# 4. Styles
# ------------------------------------------------------------------
S = {}
S["h1"] = ParagraphStyle("H1", fontName="FreeSerif-Bold", fontSize=17, leading=22,
                         textColor=HEADER_FILL, spaceBefore=20, spaceAfter=10)
S["h2"] = ParagraphStyle("H2", fontName="FreeSerif-Bold", fontSize=13, leading=17,
                         textColor=TEXT_PRIMARY, spaceBefore=14, spaceAfter=7)
S["h3"] = ParagraphStyle("H3", fontName="FreeSerif-Bold", fontSize=11, leading=15,
                         textColor=TEXT_PRIMARY, spaceBefore=12, spaceAfter=6)
S["body"] = ParagraphStyle("Body", fontName="FreeSerif", fontSize=10, leading=15,
                           textColor=TEXT_PRIMARY, alignment=TA_JUSTIFY, spaceAfter=8)
S["bullet"] = ParagraphStyle("Bullet", fontName="FreeSerif", fontSize=10, leading=14.5,
                             textColor=TEXT_PRIMARY, alignment=TA_LEFT,
                             leftIndent=14, spaceAfter=5)
S["note"] = ParagraphStyle("Note", fontName="FreeSerif-Italic", fontSize=9.5, leading=14,
                           textColor=TEXT_MUTED, alignment=TA_LEFT,
                           leftIndent=10, spaceAfter=8)
S["code"] = ParagraphStyle("Code", fontName="DejaVuMono", fontSize=8, leading=12,
                           textColor=TEXT_PRIMARY, backColor=CARD_BG,
                           borderPadding=6, leftIndent=16, spaceAfter=8)
S["toc_title"] = ParagraphStyle("TocTitle", fontName="FreeSerif-Bold", fontSize=17,
                                leading=22, textColor=HEADER_FILL, spaceAfter=14)
S["tbl_head"] = ParagraphStyle("TblHead", fontName="FreeSerif-Bold", fontSize=8.5,
                               leading=11, textColor=colors.white, alignment=TA_LEFT)
S["tbl_cell"] = ParagraphStyle("TblCell", fontName="FreeSerif", fontSize=8.5,
                               leading=11.5, textColor=TEXT_PRIMARY, alignment=TA_LEFT)

# ------------------------------------------------------------------
# 5. Helpers
# ------------------------------------------------------------------
MAX_KEEP_HEIGHT = PAGE_H * 0.4


AMP, LT, GT = chr(38), chr(60), chr(62)


def esc(t):
    return (t.replace(AMP, AMP + "amp;")
                .replace(LT, AMP + "lt;")
                .replace(GT, AMP + "gt;"))


def inline(t):
    t = esc(t)
    t = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", t)
    t = t.replace("`", "")
    # Emoji non rendus par ReportLab → équivalents texte
    t = t.replace("🟢", "Palier vert —").replace("🟠", "Palier ambre —").replace("🔴", "Palier rouge —")
    # Ponctuation : lier · et — au mot précédent (jamais en début de ligne)
    t = t.replace(" ·", "\u00a0·").replace(" —", "\u00a0—")
    return t


def add_heading(text, style, level=0):
    key = "h_" + hashlib.md5(text.encode()).hexdigest()[:8]
    p = Paragraph('<a name="%s"/>%s' % (key, inline(text)), style)
    p.bookmark_name = key
    p.bookmark_level = level
    p.bookmark_text = inline(text)
    p.bookmark_key = key
    return p


def safe_keep_together(elements):
    total_h = 0
    for el in elements:
        w, h = el.wrap(AVAIL_W, PAGE_H)
        total_h += h
    if total_h <= MAX_KEEP_HEIGHT:
        return [KeepTogether(elements)]
    elif len(elements) >= 2:
        return [KeepTogether(elements[:2])] + list(elements[2:])
    return list(elements)


def make_table(rows):
    """rows = liste de lignes (listes de cellules str). 1re ligne = en-tête."""
    ncol = len(rows[0])
    if ncol == 2:
        ratios = [0.22, 0.78]
    elif ncol == 3:
        ratios = [0.22, 0.50, 0.28]
    elif ncol == 4:
        ratios = [0.13, 0.15, 0.51, 0.21]
    else:
        ratios = [1.0 / ncol] * ncol
    col_widths = [r * AVAIL_W for r in ratios]
    data = []
    for i, row in enumerate(rows):
        st = S["tbl_head"] if i == 0 else S["tbl_cell"]
        data.append([Paragraph(inline(c), st) for c in row])
    tbl = Table(data, colWidths=col_widths, hAlign="CENTER", repeatRows=1)
    style = [
        ("BACKGROUND", (0, 0), (-1, 0), TABLE_HEADER_COLOR),
        ("GRID", (0, 0), (-1, -1), 0.5, BORDER),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ]
    for i in range(1, len(rows)):
        style.append(("BACKGROUND", (0, i), (-1, i),
                      TABLE_ROW_ODD if i % 2 else TABLE_ROW_EVEN))
    tbl.setStyle(TableStyle(style))
    return tbl


# ------------------------------------------------------------------
# 6. Parseur du fichier source
# ------------------------------------------------------------------
def parse_source(path):
    with open(path, encoding="utf-8") as f:
        lines = f.read().split("\n")

    blocks = []          # (kind, payload)
    i, n = 0, len(lines)
    while i < n:
        line = lines[i]
        stripped = line.strip()
        if not stripped or stripped == "─" * 68 or set(stripped) in ({"═"}, {"─"}):
            i += 1
            continue
        if stripped.startswith("```"):
            i += 1
            code = []
            while i < n and not lines[i].strip().startswith("```"):
                code.append(lines[i])
                i += 1
            i += 1
            blocks.append(("code", code))
            continue
        if stripped.startswith("|"):
            rows = []
            while i < n and lines[i].strip().startswith("|"):
                raw = lines[i].strip()
                # Protéger les pipes échappés (\|) avant le découpage
                safe = raw.replace("\\|", "\x00")
                cells = [c.strip().replace("\x00", "|") for c in safe.strip("|").split("|")]
                if not all(re.fullmatch(r":?-{2,}:?", c) for c in cells if c):
                    rows.append(cells)
                i += 1
            if rows:
                blocks.append(("table", rows))
            continue
        if stripped.startswith("#"):
            level = len(stripped) - len(stripped.lstrip("#"))
            blocks.append(("h%d" % min(level, 3), stripped.lstrip("#").strip()))
            i += 1
            continue
        if stripped.startswith("- "):
            buf = stripped[2:]
            i += 1
            while i < n and lines[i].startswith("  ") and lines[i].strip():
                buf += " " + lines[i].strip()
                i += 1
            blocks.append(("bullet", buf))
            continue
        if stripped.startswith("> "):
            blocks.append(("note", stripped[2:]))
            i += 1
            continue
        para = [stripped]
        i += 1
        while i < n and lines[i].strip() and not lines[i].strip().startswith(("#", "- ", "|", ">", "```")) \
                and not set(lines[i].strip()) in ({"═"}, {"─"}):
            para.append(lines[i].strip())
            i += 1
        blocks.append(("para", " ".join(para)))
    return blocks


# ------------------------------------------------------------------
# 7. Construction du corps
# ------------------------------------------------------------------
blocks = parse_source(SRC_TXT)
story = []

toc = TableOfContents()
toc.levelStyles = [
    ParagraphStyle("TOC0", fontName="FreeSerif-Bold", fontSize=10.5, leading=15,
                   textColor=TEXT_PRIMARY, leftIndent=6),
    ParagraphStyle("TOC1", fontName="FreeSerif", fontSize=9.5, leading=13.5,
                   textColor=TEXT_MUTED, leftIndent=22),
]
story.append(Paragraph("Table des matières", S["toc_title"]))
story.append(toc)
story.append(PageBreak())

pending_heading = None
H1_ORPHAN = (PAGE_H - TM - BM) * 0.15

for kind, payload in blocks:
    if kind == "h1":
        if pending_heading:
            story.append(pending_heading)
        story.append(CondPageBreak(H1_ORPHAN))
        pending_heading = add_heading("PARTIE %s" % payload.split("—", 1)[0].replace("PARTIE", "").strip()
                                      if payload.startswith("PARTIE") else payload,
                                      S["h1"], level=0)
        # Titre complet fidèle
        pending_heading = add_heading(payload, S["h1"], level=0)
    elif kind == "h2":
        if pending_heading:
            story.append(pending_heading)
            pending_heading = None
        pending_heading = add_heading(payload, S["h2"], level=1)
    elif kind == "h3":
        if pending_heading:
            story.append(pending_heading)
            pending_heading = None
        story.append(Paragraph(inline(payload), S["h3"]))
    elif kind == "para":
        p = Paragraph(inline(payload), S["body"])
        if pending_heading:
            story.extend(safe_keep_together([pending_heading, p]))
            pending_heading = None
        else:
            story.append(p)
    elif kind == "bullet":
        p = Paragraph("• " + inline(payload), S["bullet"])
        if pending_heading:
            story.extend(safe_keep_together([pending_heading, p]))
            pending_heading = None
        else:
            story.append(p)
    elif kind == "note":
        p = Paragraph(inline(payload), S["note"])
        story.append(p)
    elif kind == "code":
        lines = [inline(l) if l.strip() else " " for l in payload]
        p = Paragraph("<br/>".join(lines), S["code"])
        if pending_heading:
            story.extend(safe_keep_together([pending_heading, p]))
            pending_heading = None
        else:
            story.append(p)
    elif kind == "table":
        tbl = make_table(payload)
        if pending_heading:
            story.append(pending_heading)
            pending_heading = None
        story.append(Spacer(1, 8))
        story.append(tbl)
        story.append(Spacer(1, 10))

if pending_heading:
    story.append(pending_heading)

# ------------------------------------------------------------------
# 8. Build corps
# ------------------------------------------------------------------
doc = TocDocTemplate(
    BODY_PDF, pagesize=A4,
    leftMargin=LM, rightMargin=RM, topMargin=TM, bottomMargin=BM,
    title=DOC_TITLE, author="Z.ai", creator="Z.ai",
    subject="Document de référence complet du programme WAIRYU Thérapie Couple (WTC)",
)
doc.multiBuild(story, onFirstPage=on_page, onLaterPages=on_page)
print("Corps OK :", BODY_PDF)

# ------------------------------------------------------------------
# 9. Couverture Template 07 (HTML → html2poster.js)
# ------------------------------------------------------------------
COVER_HTML = "/home/z/my-project/download/_wtc_cover.html"
COVER_PDF = "/home/z/my-project/download/_wtc_cover.pdf"

cover = """<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700;900&display=swap" rel="stylesheet">
<style>
  @page { size: 794px 1123px; margin: 0; }
  html, body { margin: 0; padding: 0; background: #0a1628; }
  @media screen {
    html { height: auto; display: flex; justify-content: center; }
    body { transform-origin: top center; scale: min(1, calc(100vh / 1123)); margin: 0 auto; }
  }
  .poster {
    position: relative; width: 794px; height: 1123px;
    background: #0a1628; font-family: 'Inter', 'Liberation Sans', 'DejaVu Sans', sans-serif;
  }
  .bg-layer { position: absolute; inset: 0; overflow: hidden; z-index: 1; }
  .glow1 { position: absolute; left: -80px; top: -60px; width: 420px; height: 420px;
    background: radial-gradient(circle, rgba(45,122,179,0.10) 0%, rgba(45,122,179,0) 70%); }
  .glow2 { position: absolute; right: -60px; bottom: -40px; width: 480px; height: 480px;
    background: radial-gradient(circle, rgba(77,168,218,0.08) 0%, rgba(77,168,218,0) 70%); }
  .frame { position: absolute; left: 60px; right: 60px; top: 80px; bottom: 80px;
    border: 2px solid #4da8da; z-index: 2; }
  .kicker { position: absolute; left: 90px; top: 135px; width: 600px;
    font-size: 11pt; font-weight: 300; letter-spacing: 5px; color: #4da8da;
    text-transform: uppercase; }
  .hero { position: absolute; left: 90px; top: 236px; max-width: 610px;
    font-size: 46pt; font-weight: 900; line-height: 1.15; color: #e8f0f8;
    text-shadow: 0 0 24px rgba(77,168,218,0.35); }
  .summary { position: absolute; left: 90px; top: 505px; max-width: 520px;
    font-size: 15px; line-height: 1.7; color: #7a9bb8; font-weight: 400; }
  .org { position: absolute; left: 90px; top: 719px; max-width: 600px;
    font-size: 18px; color: #e8f0f8; font-weight: 700; }
  .org-sub { position: absolute; left: 90px; top: 752px; max-width: 600px;
    font-size: 13px; color: #7a9bb8; font-weight: 300; }
  .date { position: absolute; left: 90px; top: 1013px;
    font-size: 10pt; color: #7a9bb8; letter-spacing: 3px; text-transform: uppercase; }
</style>
</head>
<body>
  <div class="poster">
    <div class="bg-layer">
      <div class="glow1"></div>
      <div class="glow2"></div>
    </div>
    <div class="frame"></div>
    <div class="kicker">Document de référence complet du programme</div>
    <div class="hero">WAIRYU<br>Thérapie<br>Couple</div>
    <div class="summary">Le document intégral de tout ce qui a été conçu depuis le début :
      les 26 dimensions d'analyse, les 14 livrables d'infrastructure, les 110 quêtes
      et leur standard, les mécanismes de calcul en 8 couches, le moteur de contexte
      de Solène, la doctrine RIO, les garde-fous consolidés, les fonctionnalités
      complémentaires, le protocole de test IA et le plan de conception des calculs
      pour Data Insight.</div>
    <div class="org">Programme WTC — Wairyu Thérapie Couple</div>
    <div class="org-sub">Contexte de projet destiné à GLM Data Insight · Exécution stricte, signale sans corriger</div>
    <div class="date">14 octobre 2026 · Version 1.0</div>
  </div>
</body>
</html>
"""
with open(COVER_HTML, "w", encoding="utf-8") as f:
    f.write(cover)
print("Couverture HTML OK :", COVER_HTML)
