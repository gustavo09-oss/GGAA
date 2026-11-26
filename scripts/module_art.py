#!/usr/bin/env python3
"""Ilustrações originais das páginas divisórias (uma por módulo) e da página final.

Saída: assets/illustrations/modulo_XX.svg
"""
import math
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from cover_art import CAFE, LINE, kid, star, sparkle, heart, dove  # noqa: E402

OUT = Path(__file__).resolve().parent.parent / "assets" / "illustrations"


def wrap(inner, bg="#FBF7F1"):
    deco = (star(40, 50, 9) + star(262, 70, 7, "#D9A5A0") + sparkle(60, 250, 7, "#8DB8D6")
            + sparkle(250, 240, 8, "#E2B45A") + f'<circle cx="270" cy="160" r="3" fill="#C9AE8C"/>'
            + f'<circle cx="28" cy="150" r="3" fill="#8FAE8B"/>')
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">'
            f'<circle cx="150" cy="150" r="128" fill="{bg}"/>'
            f'<circle cx="150" cy="150" r="128" fill="none" stroke="#C9AE8C" stroke-width="2.5" '
            f'stroke-dasharray="7 7"/>{deco}{inner}</svg>')


def m1():  # Rompehielos: duas crianças que se cumprimentam
    a = kid("#D9A47E", "#2E231C", "pigtails", "#E2B45A", "#8DB8D6", pose="wave", accent="#D9896C")
    b = kid("#B97A55", "#2A211C", "curly", "#8FAE8B", "#A99BC9", pose="wave")
    return (f'<g transform="translate(105,120) scale(0.95)">{a}</g>'
            f'<g transform="translate(200,120) scale(-0.95,0.95)">{b}</g>'
            + heart(152, 70, 1.1, "#D9896C"))


def m2():  # Criação: sol, árvore, flores, pássaro
    rays = "".join(
        f'<path d="M{95+34*math.cos(math.radians(a)):.1f},{90+34*math.sin(math.radians(a)):.1f} '
        f'L{95+46*math.cos(math.radians(a)):.1f},{90+46*math.sin(math.radians(a)):.1f}" '
        f'stroke="#E2B45A" stroke-width="5" stroke-linecap="round"/>' for a in range(0, 360, 40))
    flowers = "".join(
        f'<g transform="translate({x},222)"><path d="M0,0 V22" stroke="#5E8A5A" stroke-width="3"/>'
        + "".join(f'<circle cx="{7*math.cos(math.radians(k)):.1f}" cy="{7*math.sin(math.radians(k)):.1f}" '
                  f'r="5.5" fill="{c}" {LINE}/>' for k in range(0, 360, 72))
        + f'<circle r="4" fill="#E2B45A"/></g>' for x, c in [(70, "#D9A5A0"), (110, "#A99BC9"), (235, "#D9896C")])
    return (f'<circle cx="95" cy="90" r="26" fill="#E2B45A" {LINE}/>{rays}'
            f'<path d="M30,250 C80,215 220,215 270,250 Z" fill="#8FAE8B" {LINE}/>'
            f'<rect x="183" y="150" width="16" height="80" rx="4" fill="#A9805E" {LINE}/>'
            f'<circle cx="191" cy="130" r="40" fill="#8FAE8B" {LINE}/>'
            f'<circle cx="171" cy="122" r="6" fill="#D9896C" {LINE}/><circle cx="205" cy="140" r="6" fill="#D9896C" {LINE}/>'
            f'<circle cx="196" cy="108" r="6" fill="#D9896C" {LINE}/>{flowers}'
            f'<path d="M120,60 q8,-8 16,0 q8,-8 16,0" fill="none" {LINE}/>')


def m3():  # Antigo Testamento: arca de Noé e arco-íris
    arc = "".join(f'<path d="M{150-r},178 A{r},{r} 0 0 1 {150+r},178" fill="none" stroke="{c}" '
                  f'stroke-width="10" stroke-linecap="round"/>'
                  for r, c in zip(range(104, 54, -10), ["#D9896C", "#E2B45A", "#8FAE8B", "#8DB8D6", "#A99BC9"]))
    return (arc + f'<path d="M40,230 q15,-10 30,0 t30,0 t30,0 t30,0 t30,0 t30,0 t30,0" fill="#8DB8D6" '
            f'stroke="{CAFE}" stroke-width="2.2"/>'
            f'<path d="M75,200 H225 L205,235 H95 Z" fill="#A9805E" {LINE}/>'
            f'<rect x="110" y="168" width="80" height="32" rx="4" fill="#E6D5BE" {LINE}/>'
            f'<path d="M104,170 L150,148 L196,170 Z" fill="#D9896C" {LINE}/>'
            f'<rect x="125" y="178" width="14" height="14" rx="3" fill="#fff" {LINE}/>'
            f'<rect x="161" y="178" width="14" height="14" rx="3" fill="#fff" {LINE}/>'
            f'<path d="M95,214 H205" stroke="{CAFE}" stroke-width="1.6" stroke-dasharray="5 5"/>'
            + dove(222, 120, 0.7))


def m4():  # Jesus: cesto com pães e peixes
    loaves = "".join(f'<ellipse cx="{x}" cy="{y}" rx="24" ry="15" fill="#E2B45A" {LINE}/>'
                     f'<path d="M{x-12},{y-4} q12,-8 24,0" fill="none" stroke="{CAFE}" stroke-width="1.6"/>'
                     for x, y in [(115, 145), (150, 135), (185, 145), (132, 160), (168, 160)])
    fish = "".join(f'<g transform="translate({x},{y}) rotate({r})"><path d="M-26,0 C-14,-14 12,-14 20,0 '
                   f'C12,14 -14,14 -26,0 Z" fill="#8DB8D6" {LINE}/><path d="M20,0 L32,-10 L32,10 Z" '
                   f'fill="#8DB8D6" {LINE}/><circle cx="-14" cy="-2" r="2" fill="{CAFE}"/></g>'
                   for x, y, r in [(95, 120, -20), (205, 118, 200)])
    return (f'<path d="M70,160 H230 L210,235 H90 Z" fill="#C9956B" {LINE}/>'
            f'<path d="M80,185 H220 M86,210 H214" stroke="{CAFE}" stroke-width="2" stroke-dasharray="8 6"/>'
            + fish + loaves +
            f'<path d="M150,60 V100 M134,74 H166" stroke="#D9896C" stroke-width="6" stroke-linecap="round"/>')


def m5():  # Maria: monograma M com rosas e 12 estrelas
    stars = "".join(star(150 + 92 * math.cos(math.radians(a)), 150 + 92 * math.sin(math.radians(a)), 7,
                         "#E2B45A") for a in [-180 + k * 180 / 11 for k in range(12)])
    rose = lambda x, y: (f'<circle cx="{x}" cy="{y}" r="13" fill="#D9A5A0" {LINE}/>'
                         f'<path d="M{x-6},{y} a6,6 0 1 1 6,6" fill="none" stroke="{CAFE}" stroke-width="1.6"/>'
                         f'<path d="M{x-10},{y+14} q-10,6 -18,0 q8,-10 18,0Z" fill="#8FAE8B" {LINE}/>')
    return (stars + f'<text x="150" y="190" text-anchor="middle" font-family="Fredoka, sans-serif" '
            f'font-weight="600" font-size="118" fill="#8DB8D6" stroke="{CAFE}" stroke-width="3">M</text>'
            f'<path d="M126,74 l8,-14 8,10 8,-14 8,14 8,-10 8,14 z" fill="#E2B45A" {LINE}/>'
            + rose(105, 225) + rose(150, 235) + rose(195, 225))


def m6():  # Oração: mãos em oração e vela
    return (f'<g transform="translate(150,185) scale(2.7)">'
            f'<path d="M0,-30 c-6,4 -11,16 -12,28 l-5,10 10,5 7,-9z" fill="#E8B58E" stroke="{CAFE}" stroke-width="1"/>'
            f'<path d="M0,-30 c6,4 11,16 12,28 l5,10 -10,5 -7,-9z" fill="#F1C9A5" stroke="{CAFE}" stroke-width="1"/>'
            f'<path d="M0,-30 V4" stroke="{CAFE}" stroke-width="1"/>'
            f'<path d="M-17,8 l12,9 M17,8 l-12,9" stroke="{CAFE}" stroke-width="1" stroke-linecap="round"/></g>'
            f'<path d="M150,62 c-9,11 -9,20 0,27 c9,-7 9,-16 0,-27z" fill="#E2B45A" {LINE}/>'
            + "".join(f'<path d="M{150+30*math.cos(math.radians(a)):.1f},{78+30*math.sin(math.radians(a)):.1f} '
                      f'L{150+42*math.cos(math.radians(a)):.1f},{78+42*math.sin(math.radians(a)):.1f}" '
                      f'stroke="#E2B45A" stroke-width="4" stroke-linecap="round"/>' for a in range(-160, -10, 30)))


def m7():  # Sacramentos: cálice, hóstia, trigo e uvas
    grapes = "".join(f'<circle cx="{x}" cy="{y}" r="8" fill="#A99BC9" {LINE}/>'
                     for x, y in [(222, 150), (238, 150), (230, 164), (214, 164), (246, 164), (222, 178), (238, 178), (230, 192)])
    wheat = "".join(f'<ellipse cx="{70 + (i % 2) * 10}" cy="{120 + i * 12}" rx="6" ry="10" fill="#E2B45A" {LINE} '
                    f'transform="rotate({-20 if i % 2 else 20} {70 + (i % 2) * 10} {120 + i * 12})"/>' for i in range(6))
    return (f'<path d="M75,110 V230" stroke="#A9805E" stroke-width="3"/>{wheat}'
            f'<path d="M230,140 V128" stroke="#5E8A5A" stroke-width="3"/>{grapes}'
            f'<circle cx="150" cy="78" r="30" fill="#fff" {LINE}/>'
            f'<path d="M150,62 V94 M136,76 H164" stroke="#C9AE8C" stroke-width="3" stroke-linecap="round"/>'
            f'<path d="M108,120 H192 C192,158 174,180 150,180 C126,180 108,158 108,120 Z" fill="#E2B45A" {LINE}/>'
            f'<path d="M150,180 V212" stroke="{CAFE}" stroke-width="7"/><path d="M150,180 V212" stroke="#E2B45A" stroke-width="3"/>'
            f'<path d="M118,232 C118,218 134,212 150,212 C166,212 182,218 182,232 Z" fill="#E2B45A" {LINE}/>')


def m8():  # Mandamentos: duas tábuas (I–III e IV–X) e coração
    def tab(x, nums):
        out = f'<path d="M{x},238 V105 a32,32 0 0 1 64,0 V238 Z" fill="#E6D5BE" {LINE}/>'
        for i, n in enumerate(nums):
            out += (f'<text x="{x+32}" y="{112+i*17.5}" text-anchor="middle" font-family="Fredoka, sans-serif" '
                    f'font-size="14" font-weight="600" fill="{CAFE}">{n}</text>')
        return out
    return (tab(80, ["I", "II", "III"]) + tab(156, ["IV", "V", "VI", "VII", "VIII", "IX", "X"])
            + heart(150, 62, 1.6, "#D9896C"))


def m9():  # Igreja: pequena igreja com sino
    return (f'<path d="M60,235 H240" stroke="{CAFE}" stroke-width="2.2"/>'
            f'<rect x="85" y="140" width="130" height="95" fill="#FBF7F1" {LINE}/>'
            f'<path d="M75,145 L150,95 L225,145 Z" fill="#D9896C" {LINE}/>'
            f'<rect x="128" y="60" width="44" height="60" fill="#FBF7F1" {LINE}/>'
            f'<path d="M122,64 L150,38 L178,64 Z" fill="#D9896C" {LINE}/>'
            f'<path d="M150,14 V36 M141,22 H159" stroke="{CAFE}" stroke-width="3.5" stroke-linecap="round"/>'
            f'<path d="M140,104 C140,88 160,88 160,104 L163,110 H137 Z" fill="#E2B45A" {LINE}/>'
            f'<path d="M132,235 V195 a18,18 0 0 1 36,0 V235" fill="#A9805E" {LINE}/>'
            f'<circle cx="110" cy="175" r="11" fill="#8DB8D6" {LINE}/><circle cx="190" cy="175" r="11" fill="#8DB8D6" {LINE}/>'
            f'<path d="M70,235 c-6,-14 -2,-24 8,-28 c10,4 14,14 8,28" fill="#8FAE8B" {LINE}/>'
            f'<path d="M214,235 c-6,-14 -2,-24 8,-28 c10,4 14,14 8,28" fill="#8FAE8B" {LINE}/>')


def m10():  # Repaso: dado, pontos de interrogação e peças
    die = (f'<g transform="rotate(-12 120 160)"><rect x="80" y="120" width="80" height="80" rx="14" fill="#fff" {LINE}/>'
           + "".join(f'<circle cx="{x}" cy="{y}" r="7" fill="{CAFE}"/>' for x, y in
                     [(100, 140), (140, 140), (120, 160), (100, 180), (140, 180)]) + '</g>')
    q = lambda x, y, c, s: (f'<text x="{x}" y="{y}" text-anchor="middle" font-family="Fredoka, sans-serif" '
                            f'font-weight="600" font-size="{s}" fill="{c}" stroke="{CAFE}" stroke-width="2">?</text>')
    return (die + q(205, 150, "#E2B45A", 90) + q(80, 105, "#D9A5A0", 44)
            + f'<path d="M175,195 h20 a8,8 0 1 1 16,0 h20 v20 a8,8 0 1 0 0,16 v20 h-56 z" fill="#8FAE8B" {LINE}/>')


def m11():  # Encerramento: pomba, lua e estrelas
    return (f'<path d="M228,52 a36,36 0 1 0 26,54 a29,29 0 1 1 -26,-54 z" fill="#E2B45A" {LINE}/>'
            + star(90, 80, 10) + star(120, 55, 6, "#D9A5A0") + star(250, 190, 7, "#8DB8D6")
            + f'<g transform="translate(140,182) scale(2.0)">{dove(0, 0, 1)}</g>'
            + f'<path d="M60,240 q90,-30 180,0" fill="none" stroke="#C9AE8C" stroke-width="3" stroke-dasharray="6 6"/>')


ARTS = [m1, m2, m3, m4, m5, m6, m7, m8, m9, m10, m11]

if __name__ == "__main__":
    for i, fn in enumerate(ARTS, 1):
        (OUT / f"modulo_{i:02d}.svg").write_text(wrap(fn()), encoding="utf-8")
    print("ok")
