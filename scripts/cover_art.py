#!/usr/bin/env python3
"""Gera as ilustrações vetoriais originais da capa (crianças de 7–8 anos em roda).

Saída: assets/illustrations/ninos_ronda.svg e assets/illustrations/medalla.svg
"""
import math
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "assets" / "illustrations"

CAFE = "#4A3A2E"
LINE = f'stroke="{CAFE}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"'


def mirror(path_fn):
    return path_fn(1) + path_fn(-1)


# ---------------------------------------------------------------- criança
def kid(skin, hair, hstyle, shirt, pants, pose="lap", prop=None, shoes="#8A6A55",
        accent="#D9896C"):
    """Criança sentada de pernas cruzadas, vista de frente. Origem = centro da cabeça.
    Proporção de 7–8 anos: cabeça ≈ 1/6 da altura em pé."""
    g = []

    # cabelo atrás da cabeça
    if hstyle == "long":
        g.append(f'<path d="M-25,-6 C-31,22 -29,40 -20,46 L20,46 C29,40 31,22 25,-6 Z" fill="{hair}" {LINE}/>')
    if hstyle == "braid":
        g.append(f'<path d="M20,4 C30,16 30,34 24,48" fill="none" stroke="{hair}" stroke-width="9" stroke-linecap="round"/>')
        g.append(f'<circle cx="24" cy="50" r="4" fill="{accent}" {LINE}/>')

    # pernas cruzadas
    g.append(f'<path d="M-46,94 C-46,80 -22,76 0,82 C22,76 46,80 46,94 C46,104 22,106 0,100 '
             f'C-22,106 -46,104 -46,94 Z" fill="{pants}" {LINE}/>')
    g.append(f'<path d="M-6,86 C-2,92 2,92 6,86" fill="none" {LINE}/>')
    g.append(f'<ellipse cx="-42" cy="99" rx="10" ry="6.5" fill="{shoes}" {LINE}/>')
    g.append(f'<ellipse cx="42" cy="99" rx="10" ry="6.5" fill="{shoes}" {LINE}/>')

    # tronco
    g.append(f'<path d="M-19,30 C-28,32 -31,42 -31,54 L-29,86 C-10,92 10,92 29,86 L31,54 '
             f'C31,42 28,32 19,30 Z" fill="{shirt}" {LINE}/>')
    g.append(f'<path d="M-9,30 Q0,39 9,30" fill="#fff" {LINE}/>')

    # braços (atrás do objeto quando segura algo)
    arm = 'stroke-width="11" stroke-linecap="round" fill="none"'

    def arm_path(d, color=shirt):
        return (f'<path d="{d}" stroke="{CAFE}" {arm.replace("11", "15")}/>'
                f'<path d="{d}" stroke="{color}" {arm}/>')

    hands = []
    if pose == "lap":
        g.append(arm_path("M-25,40 C-34,56 -36,70 -32,80"))
        g.append(arm_path("M25,40 C34,56 36,70 32,80"))
        hands += [(-31, 83), (31, 83)]
    elif pose == "hold":
        g.append(arm_path("M-25,40 C-34,56 -28,66 -16,66"))
        g.append(arm_path("M25,40 C34,56 28,66 16,66"))
        hands += [(-14, 66), (14, 66)]
    elif pose == "wave":
        g.append(arm_path("M-25,40 C-34,56 -36,70 -32,80"))
        g.append(arm_path("M25,40 C40,30 44,14 42,-2"))
        hands += [(-31, 83), (42, -6)]
    elif pose == "hug":  # abraça um objeto junto ao peito
        g.append(arm_path("M-25,40 C-36,52 -20,62 -6,58"))
        g.append(arm_path("M25,40 C36,52 20,62 6,58"))
        hands += [(-5, 57), (5, 57)]

    if prop:
        g.append(PROPS[prop])

    for hx, hy in hands:
        g.append(f'<circle cx="{hx}" cy="{hy}" r="6.2" fill="{skin}" {LINE}/>')

    # pescoço e cabeça
    g.append(f'<rect x="-6" y="16" width="12" height="15" fill="{skin}" {LINE}/>')
    g.append(f'<circle cx="-21.5" cy="4" r="5" fill="{skin}" {LINE}/>')
    g.append(f'<circle cx="21.5" cy="4" r="5" fill="{skin}" {LINE}/>')
    g.append(f'<circle cx="0" cy="0" r="22" fill="{skin}" {LINE}/>')

    # cabelo frente
    if hstyle == "short":
        g.append(f'<path d="M-23,2 C-25,-20 -10,-27 1,-26 C15,-26 25,-18 23,2 C20,-8 12,-13 2,-12 '
                 f'C-2,-8 -8,-6 -14,-8 C-18,-6 -21,-2 -23,2 Z" fill="{hair}" {LINE}/>')
    elif hstyle == "curly":
        for a in range(150, 400, 25):
            r = math.radians(a)
            g.append(f'<circle cx="{20*math.cos(r):.1f}" cy="{-4-14*abs(math.sin(r))*1.1 if a<360 else -4:.1f}" '
                     f'r="8.5" fill="{hair}" {LINE}/>')
        g.append(f'<path d="M-22,0 C-22,-22 22,-22 22,0 C14,-10 -14,-10 -22,0 Z" fill="{hair}"/>')
    elif hstyle in ("long", "braid"):
        g.append(f'<path d="M-23,6 C-25,-18 -10,-27 2,-26 C16,-25 25,-14 23,6 C20,-6 12,-11 4,-13 '
                 f'C0,-6 -10,-2 -23,6 Z" fill="{hair}" {LINE}/>')
    elif hstyle == "pigtails":
        for s in (-1, 1):
            g.append(f'<circle cx="{28*s}" cy="-4" r="9.5" fill="{hair}" {LINE}/>')
            g.append(f'<circle cx="{21*s}" cy="-8" r="3.2" fill="{accent}" {LINE}/>')
        g.append(f'<path d="M-23,2 C-25,-20 -10,-27 0,-26 C10,-27 25,-20 23,2 C16,-6 8,-10 0,-9 '
                 f'C-8,-10 -16,-6 -23,2 Z" fill="{hair}" {LINE}/>')

    # rosto
    for s in (-1, 1):
        g.append(f'<ellipse cx="{8*s}" cy="3" rx="2.6" ry="3.3" fill="{CAFE}"/>')
        g.append(f'<circle cx="{8*s+0.9}" cy="1.8" r="0.9" fill="#fff"/>')
        g.append(f'<path d="M{8*s-3.5},-4.5 Q{8*s},-6.5 {8*s+3.5},-4.5" fill="none" stroke="{CAFE}" '
                 f'stroke-width="1.6" stroke-linecap="round"/>')
        g.append(f'<circle cx="{14*s}" cy="10" r="3.8" fill="#E8968A" opacity="0.55"/>')
    g.append(f'<path d="M-6,10 Q0,16.5 6,10" fill="none" stroke="{CAFE}" stroke-width="2" stroke-linecap="round"/>')
    return "".join(g)


PROPS = {
    "biblia": (
        f'<g transform="translate(0,58)">'
        f'<path d="M0,-8 C-8,-14 -20,-14 -28,-10 L-28,12 C-20,8 -8,8 0,14 C8,8 20,8 28,12 L28,-10 '
        f'C20,-14 8,-14 0,-8 Z" fill="#fff" {LINE}/>'
        f'<path d="M0,-8 V14" {LINE}/>'
        f'<path d="M-22,-4 C-16,-6 -10,-6 -6,-4 M-22,2 C-16,0 -10,0 -6,2" fill="none" stroke="#C9AE8C" stroke-width="1.6" stroke-linecap="round"/>'
        f'<path d="M15,-6 V6 M10.5,-1.5 H19.5" stroke="#D9896C" stroke-width="2.4" stroke-linecap="round"/>'
        f'</g>'),
    "corazon": (
        f'<g transform="translate(0,56)">'
        f'<path d="M0,16 C-14,7 -19,0 -19,-6 A8,8 0 0 1 0,-10 A8,8 0 0 1 19,-6 C19,0 14,7 0,16 Z" '
        f'fill="#D9896C" {LINE}/>'
        f'<path d="M-11,-6 a4,4 0 0 1 4,-4" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/>'
        f'</g>'),
    "estrella": (
        f'<g transform="translate(42,-12)">'
        f'<path d="M0,-11 L3.2,-3.5 11,-3 5,2.2 7,10 0,5.6 -7,10 -5,2.2 -11,-3 -3.2,-3.5 Z" '
        f'fill="#E2B45A" {LINE}/></g>'),
}


def star(x, y, r, fill="#E2B45A", stroke=True):
    pts = []
    for i in range(10):
        rr = r if i % 2 == 0 else r * 0.45
        a = math.radians(-90 + i * 36)
        pts.append(f"{x + rr*math.cos(a):.1f},{y + rr*math.sin(a):.1f}")
    st = f'stroke="{CAFE}" stroke-width="1.6" stroke-linejoin="round"' if stroke else ""
    return f'<polygon points="{" ".join(pts)}" fill="{fill}" {st}/>'


def sparkle(x, y, r, fill):
    return (f'<path d="M{x},{y-r} Q{x+r*0.18},{y-r*0.18} {x+r},{y} Q{x+r*0.18},{y+r*0.18} {x},{y+r} '
            f'Q{x-r*0.18},{y+r*0.18} {x-r},{y} Q{x-r*0.18},{y-r*0.18} {x},{y-r} Z" fill="{fill}"/>')


def heart(x, y, s, fill="#D9A5A0"):
    return (f'<path transform="translate({x},{y}) scale({s})" d="M0,10 C-9,4 -12,0 -12,-4 '
            f'A5,5 0 0 1 0,-6 A5,5 0 0 1 12,-4 C12,0 9,4 0,10 Z" fill="{fill}" {LINE}/>')


def dove(x, y, s):
    return (f'<g transform="translate({x},{y}) scale({s})">'
            f'<path d="M-30,6 C-18,6 -10,0 -4,-8 C0,-14 8,-18 16,-16 L26,-20 L22,-12 C24,-2 16,12 0,14 '
            f'C-12,15 -22,12 -30,6 Z" fill="#fff" {LINE}/>'
            f'<path d="M-12,2 C-6,-12 4,-22 -2,-34 C-10,-24 -20,-10 -12,2 Z" fill="#F3E9DC" {LINE}/>'
            f'<circle cx="15" cy="-12" r="1.5" fill="{CAFE}"/>'
            f'</g>')


# ---------------------------------------------------------------- cena
def scene(width=640, height=430, bg=True):
    k = []
    # elementos de fundo
    if bg:
        k.append(f'<circle cx="320" cy="215" r="190" fill="#F7EBD0"/>')
        k.append(f'<circle cx="320" cy="215" r="190" fill="none" stroke="#E2B45A" stroke-width="2" '
                 f'stroke-dasharray="2 9" stroke-linecap="round"/>')
    # cruz suave atrás
    k.append(f'<g opacity="0.95"><rect x="309" y="62" width="22" height="112" rx="11" fill="#E6D5BE" {LINE}/>'
             f'<rect x="276" y="92" width="88" height="22" rx="11" fill="#E6D5BE" {LINE}/>'
             f'<rect x="309" y="92" width="22" height="22" fill="#E6D5BE"/></g>')
    # raios suaves da cruz
    for a in range(-150, -20, 26):
        r = math.radians(a)
        x1, y1 = 320 + 64 * math.cos(r), 110 + 64 * math.sin(r)
        x2, y2 = 320 + 84 * math.cos(r), 110 + 84 * math.sin(r)
        k.append(f'<path d="M{x1:.1f},{y1:.1f} L{x2:.1f},{y2:.1f}" stroke="#E2B45A" stroke-width="4" stroke-linecap="round" opacity="0.8"/>')

    # tapete/manta da roda
    k.append(f'<ellipse cx="320" cy="335" rx="285" ry="80" fill="#E6D5BE" {LINE}/>')
    k.append(f'<ellipse cx="320" cy="335" rx="266" ry="68" fill="none" stroke="#C9AE8C" stroke-width="2.2" stroke-dasharray="7 6"/>')

    # crianças de trás (menores, mais acima)
    back = [
        (262, 200, 0.95, dict(skin="#D9A47E", hair="#2E231C", hstyle="pigtails", shirt="#8DB8D6",
                              pants="#A99BC9", pose="hold", prop="biblia", accent="#D9896C")),
        (378, 200, 0.95, dict(skin="#F1C9A5", hair="#6B4430", hstyle="short", shirt="#E2B45A",
                              pants="#8FAE8B", pose="wave", prop="estrella")),
    ]
    front = [
        (145, 238, 1.08, dict(skin="#B97A55", hair="#2A211C", hstyle="curly", shirt="#8FAE8B",
                              pants="#8DB8D6", pose="lap")),
        (495, 238, 1.08, dict(skin="#E8B58E", hair="#3B2A20", hstyle="braid", shirt="#D9A5A0",
                              pants="#A99BC9", pose="hug", prop="corazon", accent="#E2B45A")),
    ]
    for x, y, s, kw in back + front:
        k.append(f'<g transform="translate({x},{y}) scale({s})">{kid(**kw)}</g>')

    # decoração
    k.append(dove(470, 70, 1.05))
    k.append(star(150, 80, 13))
    k.append(star(560, 150, 10, "#D9A5A0"))
    k.append(star(95, 160, 8, "#8DB8D6"))
    k.append(sparkle(210, 50, 9, "#E2B45A"))
    k.append(sparkle(545, 60, 7, "#A99BC9"))
    k.append(sparkle(70, 250, 6, "#D9896C"))
    k.append(sparkle(590, 260, 7, "#8FAE8B"))
    k.append(heart(200, 120, 0.9))
    k.append(heart(600, 210, 0.7, "#D9896C"))
    for (cx, cy, c) in [(250, 100, "#8DB8D6"), (400, 30, "#D9A5A0"), (40, 200, "#E2B45A"), (620, 320, "#C9AE8C")]:
        k.append(f'<circle cx="{cx}" cy="{cy}" r="3.5" fill="{c}"/>')

    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}">' + "".join(k) + "</svg>")


def medalla():
    """Selo festonado 'Ideal para Primera Comunión'."""
    n, R, r = 22, 100, 91
    pts = []
    for i in range(n * 2):
        rr = R if i % 2 == 0 else r
        a = math.pi * 2 * i / (n * 2)
        pts.append((100 + rr * math.cos(a), 100 + rr * math.sin(a)))
    d = "M" + " ".join(f"{x:.1f},{y:.1f}" for x, y in pts) + "Z"
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="-6 -6 212 212">'
            f'<path d="{d}" fill="#E2B45A" stroke="{CAFE}" stroke-width="2.4" stroke-linejoin="round"/>'
            f'<circle cx="100" cy="100" r="78" fill="#FBF7F1" stroke="{CAFE}" stroke-width="2.2"/>'
            f'<circle cx="100" cy="100" r="70" fill="none" stroke="#C9AE8C" stroke-width="2" stroke-dasharray="5 5"/>'
            '</svg>')


if __name__ == "__main__":
    (OUT / "ninos_ronda.svg").write_text(scene(), encoding="utf-8")
    (OUT / "ninos_ronda_sinfondo.svg").write_text(scene(bg=False), encoding="utf-8")
    (OUT / "medalla.svg").write_text(medalla(), encoding="utf-8")
    print("ok")
