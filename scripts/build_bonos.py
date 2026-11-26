#!/usr/bin/env python3
"""Gera os PDFs dos 4 bônus do Catequesis Viva.

Uso:
  python scripts/build_bonos.py --sample   # capas + 2 páginas de cada bônus (prévia)
  python scripts/build_bonos.py            # os 4 PDFs completos em output/bonos/

Ilustrações: coloque os PNG em assets/illustrations/bonos/ (veja ILUSTRACOES_NECESSARIAS.md)
e rode de novo. Imagem ausente = o layout usa só tipografia e formas.
"""
import argparse
import json
import re
import shutil
import subprocess
import sys
from pathlib import Path

from markupsafe import Markup

sys.path.insert(0, str(Path(__file__).resolve().parent))
from build_pdf import ROOT, OUT, MODULOS, make_env  # noqa: E402

CONTENT = ROOT / "content"
BONOS = CONTENT / "bonos"
IMG_DIR = ROOT / "assets/illustrations/bonos"
OUT_B = OUT / "bonos"

CAPAS = {
    1: dict(n=1, titulo_html="Ruta de Encuentros:<br><b>12 Semanas</b>", subtitulo="Tu catequesis planificada, semana a semana",
            icono="reloj", numero="12", unidad="semanas", imagen="bono1_capa.png"),
    2: dict(n=2, titulo_html="<b>30</b> Parábolas para Niños", subtitulo="Las historias de Jesús contadas para los más pequeños",
            icono="reflexion", numero="30", unidad="parábolas", imagen="bono2_capa.png"),
    3: dict(n=3, titulo_html="Dinámicas para<br><b>Fechas Litúrgicas</b>", subtitulo="Adviento, Navidad, Cuaresma, Pascua y más",
            icono="liturgia", numero="60", unidad="dinámicas", imagen="bono3_capa.png"),
    4: dict(n=4, titulo_html="Guía de Oración<br>para <b>Cada Encuentro</b>", subtitulo="Enseña a los niños a hablar con Dios",
            icono="oracion", numero="+60", unidad="oraciones", imagen="bono4_capa.png"),
}


def load(name):
    return json.loads((BONOS / name).read_text(encoding="utf-8"))


def img_slot(nome):
    """<img> se o arquivo existir; senão string vazia (o layout se adapta)."""
    if nome and (IMG_DIR / nome).exists():
        return Markup(f'<img src="../assets/illustrations/bonos/{nome}" alt="">')
    return ""


def principal():
    """Índice das 510 dinâmicas: id -> dados + página no PDF principal."""
    paginas = json.loads((OUT / "paginas.json").read_text(encoding="utf-8"))["num"]
    idx = {}
    for n in MODULOS:
        for d in json.loads((CONTENT / f"modulo_{n:02d}.json").read_text(encoding="utf-8")):
            d["pagina"] = paginas[d["id"]]
            idx[d["id"]] = d
    return idx


def enriquecer_semana(s, idx):
    mats, ordem = {}, []
    for b in s["bloques"]:
        b["dinamicas"] = [idx[i] for i in b["ids"]]
        for d in b["dinamicas"]:
            for m in d["materiales"]:
                if m.lower() == "sin materiales":
                    continue
                if m not in mats:
                    mats[m] = []
                    ordem.append(m)
                mats[m].append(d["id"])
    s["materiales"] = [{"texto": m, "ids": mats[m]} for m in ordem] or [{"texto": "Sin materiales", "ids": []}]
    return s


def env_bonos():
    env = make_env()
    base_nb = env.filters["nb"]
    # travessão de diálogo nunca fica sozinho no fim da linha
    env.filters["nb"] = lambda t: re.sub(r"—(?=\S)", "—\u2060", base_nb(t))
    env.globals["img_slot"] = img_slot
    return env


def render(html, name, png=True, scale=1):
    OUT_B.mkdir(parents=True, exist_ok=True)
    html_path = OUT / f"{name}.html"          # fica em output/ para os caminhos ../templates funcionarem
    html_path.write_text(html, encoding="utf-8")
    pdf_path = OUT_B / f"{name}.pdf"
    cmd = ["node", str(ROOT / "scripts/render.js"), str(html_path), str(pdf_path)]
    if png:
        cmd += ["--png", str(OUT_B / f"{name}_png"), "--scale", str(scale)]
    res = subprocess.run(cmd, capture_output=True, text=True, cwd=ROOT)
    if res.returncode != 0:
        print(res.stderr, file=sys.stderr)
        sys.exit(1)
    rep = json.loads(res.stdout.strip().splitlines()[-1])
    print(f"PDF: {pdf_path.relative_to(ROOT)} · {rep['pages']} páginas · fontes: {', '.join(rep['fonts'])}")
    print("⚠ overflow:", rep["overflow"]) if rep["overflow"] else print("Sem overflow.")
    return rep


def build_sample():
    env = env_bonos()
    m = env.get_template("bonos.html.j2").module
    ficha = env.get_template("ficha_bono.html.j2")
    idx = principal()
    b1, b2, b3, b4 = load("bono_1.json"), load("bono_2.json"), load("bono_3.json"), load("bono_4.json")
    sec = b3["secciones"][0]
    partes = [
        m.capa(CAPAS[1]), m.capa(CAPAS[2]), m.capa(CAPAS[3]), m.capa(CAPAS[4]),
        m.semana(enriquecer_semana(b1["semanas"][0], idx), 6, 7),
        m.parabola(b2["parabolas"][0], 30, 28, 29),
        m.div_lit(sec),
        ficha.render(d=sec["dinamicas"][0], sec=sec, page_no=9),
        m.oracion_basica(b4["basicas"][0], 7),
        m.oraciones_modulos(b4["modulos"][:2], 12),
    ]
    html = env.get_template("base_bonos.html.j2").render(body="\n".join(str(p) for p in partes), title="Muestra Bonos")
    render(html, "Muestra_Bonos", png=True, scale=2)


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--sample", action="store_true")
    a = ap.parse_args()
    if a.sample:
        build_sample()
    else:
        print("Build completo ainda não implementado (aguardando aprovação da amostra).")
