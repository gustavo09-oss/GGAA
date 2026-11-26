#!/usr/bin/env python3
"""Gera o PDF do Catequesis Viva.

Uso:
  python scripts/build_pdf.py --sample   # PDF de amostra com content/muestra.json
"""
import argparse
import json
import re
import subprocess
import sys
import unicodedata
from pathlib import Path

from jinja2 import Environment, FileSystemLoader

ROOT = Path(__file__).resolve().parent.parent
TPL = ROOT / "templates"
ASSETS = ROOT / "assets"
OUT = ROOT / "output"

MODULOS = {
    1: "Rompehielos y Bienvenida",
    2: "Dios Creador y la Creación",
    3: "Historias del Antiguo Testamento",
    4: "Jesús: Vida y Milagros",
    5: "María y los Santos",
    6: "Aprendiendo a Orar",
    7: "Los Sacramentos",
    8: "Mandamientos y Valores Cristianos",
    9: "La Iglesia y la Misa",
    10: "Juegos de Repaso",
    11: "Cierres y Oración Final",
}

# Ilustração padrão do box "Mensaje para llevar a casa" por módulo
ILUS_MODULO = {1: "corazon", 2: "paloma", 3: "biblia", 4: "biblia", 5: "corazon", 6: "paloma",
               7: "caliz", 8: "corazon", 9: "caliz", 10: "biblia", 11: "paloma"}


def slug(s: str) -> str:
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", "", s.lower())


def load_svgs(folder: Path) -> dict:
    return {p.stem: p.read_text(encoding="utf-8") for p in folder.glob("*.svg")}


def make_env():
    env = Environment(loader=FileSystemLoader(TPL), autoescape=True)
    icons = load_svgs(ASSETS / "icons")
    ilus = load_svgs(ASSETS / "illustrations")
    from markupsafe import Markup
    icons = {k: Markup(v) for k, v in icons.items()}
    ilus = {k: Markup(v) for k, v in ilus.items()}
    def nb(text):
        # espaço inseparável entre número e unidade ("20 cm", "3 x 20")
        t = re.sub(r"(\d) (x|cm|m|min|años|segundos)\b", "\\1\u00a0\\2", str(text))
        t = re.sub(r"(x) (\d)", "\\1\u00a0\\2", t)
        return t
    env.filters["nb"] = nb
    env.globals.update(
        icons=icons,
        ilus=ilus,
        tipo_slug=slug,
        edad_slug=lambda e: {"Todas": "todas", "5+": "5", "7+": "7"}[e],
        edad_label=lambda e: {"Todas": "Todas las edades", "5+": "Desde 5 años", "7+": "Desde 7 años"}[e],
        ilus_for=lambda d: ilus[ILUS_MODULO[d["modulo"]]],
    )
    return env


def render_pdf(html: str, name: str, png_pages=None, scale=1):
    OUT.mkdir(exist_ok=True)
    html_path = OUT / f"{name}.html"
    html_path.write_text(html, encoding="utf-8")
    pdf_path = OUT / f"{name}.pdf"
    cmd = ["node", str(ROOT / "scripts/render.js"), str(html_path), str(pdf_path)]
    if png_pages is not None:
        cmd += ["--png", str(OUT / f"{name}_png"), "--scale", str(scale)]
        if png_pages:
            cmd += ["--pages", ",".join(map(str, png_pages))]
    res = subprocess.run(cmd, capture_output=True, text=True, cwd=ROOT)
    if res.returncode != 0:
        print(res.stderr, file=sys.stderr)
        sys.exit(1)
    report = json.loads(res.stdout.strip().splitlines()[-1])
    print(f"PDF: {pdf_path.relative_to(ROOT)} · {report['pages']} páginas")
    print("Fontes:", ", ".join(report["fonts"]))
    if report["overflow"]:
        print("⚠ Páginas com overflow:", report["overflow"])
    else:
        print("Sem overflow.")
    return report


def build_sample():
    env = make_env()
    dinamicas = json.loads((ROOT / "content/muestra.json").read_text(encoding="utf-8"))
    ficha = env.get_template("ficha.html.j2")
    pages = [ficha.render(d=d, mod={"titulo": MODULOS[d["modulo"]]}, page_no=i + 1)
             for i, d in enumerate(dinamicas)]
    html = env.get_template("base.html.j2").render(body="\n".join(pages), title="Muestra")
    render_pdf(html, "muestra", png_pages=[], scale=2)


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--sample", action="store_true")
    a = ap.parse_args()
    if a.sample:
        build_sample()
    else:
        print("Build completo ainda não implementado (etapa 6).")
