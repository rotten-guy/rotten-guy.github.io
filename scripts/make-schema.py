#!/usr/bin/env python3
"""Draw the SAE 2.03 database schema in the Nebula style.

Usage: python3 scripts/make-schema.py [output.svg]
Default output: assets/img/sae-schema.svg

Entity tables get a cyan outline, link tables (many-to-many) a magenta one,
like regular keys and modifiers on the keymap pictures of the dotfiles.
"""
import sys
from html import escape
from pathlib import Path

W, H = 1120, 780
BOX_W, ROW_H, HEAD_H = 230, 24, 38
CYAN, MAGENTA, TEXT, DIM, CARD = "#00f0ff", "#e600ff", "#d6def5", "#7d86a8", "#12162e"

# name: (x, y, is_link_table, [(field, kind)])  kind: pk, fk, pkfk or ""
TABLES = {
    "Formation":    (40, 110, False, [("id_formation", "pk"), ("nom_formation", ""), ("annee", "")]),
    "Groupe":       (40, 340, False, [("id_groupe", "pk"), ("nom_groupe", ""), ("sous_groupe", ""), ("id_formation", "fk")]),
    "Suit":         (320, 110, True, [("id_etudiant", "pkfk"), ("id_formation", "pkfk")]),
    "Appartient":   (320, 340, True, [("id_etudiant", "pkfk"), ("id_groupe", "pkfk")]),
    "Participe":    (320, 560, True, [("id_etudiant", "pkfk"), ("id_equipage", "pkfk"), ("validation_aller", ""), ("validation_retour", "")]),
    "Etudiant":     (600, 230, False, [("id_etudiant", "pk"), ("nom", ""), ("prenom", "")]),
    "Equipage":     (600, 580, False, [("id_equipage", "pk"), ("plaque", "fk")]),
    "Compte":       (870, 60, False, [("mail", ""), ("passwd (hash)", ""), ("role", ""), ("date_creation", ""), ("token", ""), ("id_etudiant", "fk")]),
    "Horaire":      (870, 290, False, [("jour", ""), ("h_debut", ""), ("h_fin", ""), ("id_etudiant", "fk")]),
    "Offre_trajet": (870, 450, False, [("id_offre", "pk"), ("plaque", "fk"), ("nb_place_dispo", ""), ("id_etudiant", "fk")]),
    "Vehicule":     (870, 630, False, [("plaque", "pk"), ("type", "")]),
}

# (from, to): drawn from the right edge of the left box to the left edge of the right box,
# or vertically when both boxes share a column
LINKS = [
    ("Formation", "Suit"), ("Suit", "Etudiant"), ("Formation", "Groupe"),
    ("Groupe", "Appartient"), ("Appartient", "Etudiant"),
    ("Participe", "Etudiant"), ("Participe", "Equipage"),
    ("Etudiant", "Compte"), ("Etudiant", "Horaire"), ("Etudiant", "Offre_trajet"),
    ("Equipage", "Vehicule"), ("Offre_trajet", "Vehicule"),
]


def box_h(fields):
    return HEAD_H + len(fields) * ROW_H + 10


def anchor(name, side):
    x, y, _, fields = TABLES[name]
    h = box_h(fields)
    return {
        "right": (x + BOX_W, y + h / 2), "left": (x, y + h / 2),
        "top": (x + BOX_W / 2, y), "bottom": (x + BOX_W / 2, y + h),
    }[side]


def link(a, b):
    ax, bx = TABLES[a][0], TABLES[b][0]
    if ax == bx:  # same column: vertical curve
        top, bottom = sorted((a, b), key=lambda n: TABLES[n][1])
        (x1, y1), (x2, y2) = anchor(top, "bottom"), anchor(bottom, "top")
        mid = (y1 + y2) / 2
        return f"M{x1:.1f},{y1:.1f} C{x1:.1f},{mid:.1f} {x2:.1f},{mid:.1f} {x2:.1f},{y2:.1f}"
    left, right = (a, b) if ax < bx else (b, a)
    (x1, y1), (x2, y2) = anchor(left, "right"), anchor(right, "left")
    mid = (x1 + x2) / 2
    return f"M{x1:.1f},{y1:.1f} C{mid:.1f},{y1:.1f} {mid:.1f},{y2:.1f} {x2:.1f},{y2:.1f}"


def table(name):
    x, y, is_link, fields = TABLES[name]
    h = box_h(fields)
    stroke = MAGENTA if is_link else CYAN
    out = [
        f'<g><rect x="{x}" y="{y}" width="{BOX_W}" height="{h}" rx="12" fill="{CARD}" '
        f'stroke="{stroke}" stroke-opacity=".8" stroke-width="1.6"/>',
        f'<path d="M{x},{y + HEAD_H} h{BOX_W}" stroke="{stroke}" stroke-opacity=".3"/>',
        f'<text x="{x + 16}" y="{y + 25}" font-size="15" font-weight="700" fill="{stroke}" '
        f'letter-spacing="1">{escape(name.upper())}</text>',
    ]
    for i, (field, kind) in enumerate(fields):
        fy = y + HEAD_H + 20 + i * ROW_H
        colour = CYAN if "pk" in kind else (MAGENTA if kind == "fk" else TEXT)
        tag = {"pk": "PK", "fk": "FK", "pkfk": "PK·FK"}.get(kind, "")
        out.append(f'<text x="{x + 16}" y="{fy}" font-size="13" fill="{colour}">{escape(field)}</text>')
        if tag:
            out.append(f'<text x="{x + BOX_W - 14}" y="{fy}" font-size="10" text-anchor="end" fill="{DIM}">{tag}</text>')
    out.append("</g>")
    return "".join(out)


def main():
    out = Path(sys.argv[1] if len(sys.argv) > 1 else Path(__file__).parent.parent / "assets/img/sae-schema.svg")
    svg = [
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" '
        'font-family="JetBrains Mono, DejaVu Sans Mono, monospace">',
        "<defs>",
        f'<radialGradient id="g1" cx="85%" cy="0%" r="70%"><stop offset="0" stop-color="{MAGENTA}" stop-opacity=".2"/>'
        f'<stop offset="1" stop-color="{MAGENTA}" stop-opacity="0"/></radialGradient>',
        f'<radialGradient id="g2" cx="0%" cy="100%" r="70%"><stop offset="0" stop-color="{CYAN}" stop-opacity=".16"/>'
        f'<stop offset="1" stop-color="{CYAN}" stop-opacity="0"/></radialGradient>',
        f'<linearGradient id="title" x1="0" x2="1"><stop offset="0" stop-color="{CYAN}"/>'
        f'<stop offset="1" stop-color="{MAGENTA}"/></linearGradient>',
        f'<linearGradient id="wire" gradientUnits="userSpaceOnUse" x1="0" x2="{W}"><stop offset="0" stop-color="{CYAN}" stop-opacity=".7"/>'
        f'<stop offset="1" stop-color="{MAGENTA}" stop-opacity=".7"/></linearGradient>',
        "</defs>",
        f'<rect width="{W}" height="{H}" rx="18" fill="#070914"/>',
        f'<rect width="{W}" height="{H}" rx="18" fill="url(#g1)"/>',
        f'<rect width="{W}" height="{H}" rx="18" fill="url(#g2)"/>',
        f'<text x="40" y="62" font-size="30" font-weight="700" fill="url(#title)" letter-spacing="5">COVOIT · DATA MODEL</text>',
    ]
    for a, b in LINKS:
        svg.append(f'<path d="{link(a, b)}" fill="none" stroke="url(#wire)" stroke-width="1.6" stroke-dasharray="5 5"/>')
    svg += [table(name) for name in TABLES]
    svg.append(
        f'<text x="{W / 2}" y="{H - 22}" text-anchor="middle" font-size="13" fill="#5d6688">'
        "cyan = entity table · magenta = link table (many-to-many) · PK / FK = primary / foreign key</text>"
    )
    svg.append("</svg>")
    out.write_text("\n".join(svg) + "\n")
    print(f"wrote {out}")


if __name__ == "__main__":
    main()
