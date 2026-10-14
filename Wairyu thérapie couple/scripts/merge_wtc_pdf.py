# -*- coding: utf-8 -*-
"""Fusion couverture + corps → PDF final normalisé A4 avec métadonnées."""
from pypdf import PdfReader, PdfWriter

A4_W, A4_H = 595.28, 841.89
COVER = "/home/z/my-project/download/_wtc_cover.pdf"
BODY = "/home/z/my-project/download/_wtc_body.pdf"
OUT = "/home/z/my-project/download/programme wairyu couple.pdf"
TITLE = "WAIRYU Thérapie Couple — Document de référence complet du programme"


def normalize(page):
    w, h = float(page.mediabox.width), float(page.mediabox.height)
    if abs(w - A4_W) > 0.1 or abs(h - A4_H) > 0.1:
        page.scale_to(A4_W, A4_H)
        page.mediabox.lower_left = (0, 0)
        page.mediabox.upper_right = (A4_W, A4_H)
    return page


writer = PdfWriter()
writer.add_page(normalize(PdfReader(COVER).pages[0]))
for p in PdfReader(BODY).pages:
    writer.add_page(normalize(p))
writer.add_metadata({
    "/Title": TITLE,
    "/Author": "Z.ai",
    "/Creator": "Z.ai",
    "/Subject": "Document de référence complet du programme WAIRYU Thérapie Couple (WTC) — contexte projet pour GLM Data Insight",
})
with open(OUT, "wb") as f:
    writer.write(f)
print("PDF final :", OUT, "| pages :", len(writer.pages))
