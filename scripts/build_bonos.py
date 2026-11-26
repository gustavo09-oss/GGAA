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


# ======================================================================== BUILD COMPLETO
from liturgia import calendario, fmt  # noqa: E402

MOD_COR = {1: "#E2B45A", 2: "#8FAE8B", 3: "#D9896C", 4: "#8DB8D6", 5: "#D9A5A0", 6: "#A99BC9",
           7: "#D6A445", 8: "#7FA27B", 9: "#CB7E62", 10: "#79A7C9", 11: "#B795B9"}

FRENTE = json.loads((ROOT / "content/bonos/frente.json").read_text(encoding="utf-8"))

NOMES = {1: "Bono1_Ruta_de_Encuentros_12_Semanas", 2: "Bono2_30_Parabolas_para_Ninos",
         3: "Bono3_Dinamicas_Fechas_Liturgicas", 4: "Bono4_Guia_de_Oracion"}


class Pag:
    """Acumula páginas (html, nº de páginas) e numera."""
    def __init__(self):
        self.partes, self.n = [], 0

    def prox(self):
        return self.n + 1

    def add(self, html, paginas=1):
        self.partes.append(str(html))
        self.n += paginas


def colunas(itens, cap=40):
    """Distribui entradas do índice em colunas de até `cap` linhas (cabeçalho pesa 1.7)."""
    cols, col, peso = [], [], 0
    for it in itens:
        w = 1.7 if it["kind"] == "h" else 1
        if peso + w > cap and col:
            cols.append(col); col, peso = [], 0
        col.append(it); peso += w
    if col:
        cols.append(col)
    return [cols[i:i + 2] for i in range(0, len(cols), 2)]


def roda_liturgica(ano):
    """SVG do ano litúrgico: setores proporcionais às semanas de cada tempo."""
    import math
    C = calendario(ano)
    seg = [("Adviento", 4, "#8E6BAE"), ("Navidad", 2.5, "#D6A445"), ("Tiempo Ordinario", 6, "#7FA27B"),
           ("Cuaresma", 6, "#8E6BAE"), ("Semana Santa", 1, "#C9584B"), ("Pascua", 7, "#D6A445"),
           ("Pentecostés", 0.6, "#C9584B"), ("Tiempo Ordinario", 24.9, "#7FA27B")]
    tot = sum(s[1] for s in seg)
    cx = cy = 160; R, r = 150, 78
    out = ['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 320">']
    a0 = -math.pi / 2
    for nome, w, cor in seg:
        a1 = a0 + 2 * math.pi * w / tot
        large = 1 if a1 - a0 > math.pi else 0
        p = lambda rad, a: (cx + rad * math.cos(a), cy + rad * math.sin(a))
        x0, y0 = p(R, a0); x1, y1 = p(R, a1); x2, y2 = p(r, a1); x3, y3 = p(r, a0)
        out.append(f'<path d="M{x0:.1f},{y0:.1f} A{R},{R} 0 {large} 1 {x1:.1f},{y1:.1f} L{x2:.1f},{y2:.1f} '
                   f'A{r},{r} 0 {large} 0 {x3:.1f},{y3:.1f} Z" fill="{cor}" stroke="#FBF7F1" stroke-width="3"/>')
        if w >= 4:
            am = (a0 + a1) / 2; tx, ty = p((R + r) / 2, am)
            nm = nome.replace("Tiempo ", "T. ")
            out.append(f'<text x="{tx:.1f}" y="{ty:.1f}" text-anchor="middle" dominant-baseline="middle" '
                       f'font-family="Fredoka" font-weight="600" font-size="12" fill="#fff">{nm}</text>')
        a0 = a1
    out.append(f'<circle cx="{cx}" cy="{cy}" r="{r - 8}" fill="#FBF7F1"/>')
    out.append(f'<text x="{cx}" y="{cy - 10}" text-anchor="middle" font-family="Fredoka" font-weight="600" font-size="15" fill="#4A3A2E">Año</text>')
    out.append(f'<text x="{cx}" y="{cy + 10}" text-anchor="middle" font-family="Fredoka" font-weight="600" font-size="15" fill="#4A3A2E">Litúrgico</text>')
    out.append(f'<text x="{cx}" y="{cy + 30}" text-anchor="middle" font-family="Nunito" font-size="10" fill="#7A6656">empieza en Adviento</text>')
    out.append("</svg>")
    return Markup("".join(out))


def fechas_calendario(ano):
    C = calendario(ano)
    f = lambda d: fmt(d, True).capitalize()
    return [
        dict(fecha=f(C["maria_madre"]), nombre="Santa María, Madre de Dios", color="blanco"),
        dict(fecha=f(C["epifania"]), nombre="Epifanía del Señor", nota=f"o el domingo {fmt(C['epifania_domingo'])}", color="blanco"),
        dict(fecha=f(C["bautismo"]), nombre="Bautismo del Señor", nota="termina el tiempo de Navidad", color="blanco"),
        dict(fecha=f(C["ceniza"]), nombre="Miércoles de Ceniza", nota="empieza la Cuaresma", color="morado"),
        dict(fecha=f(C["ramos"]), nombre="Domingo de Ramos", color="rojo"),
        dict(fecha=f(C["jueves_santo"]), nombre="Jueves Santo", nota="la Última Cena", color="blanco"),
        dict(fecha=f(C["viernes_santo"]), nombre="Viernes Santo", nota="la Pasión del Señor", color="rojo"),
        dict(fecha=f(C["pascua"]), nombre="Domingo de Pascua", nota="¡Jesús resucitó!", color="blanco"),
        dict(fecha=f(C["pascua"] + __import__("datetime").timedelta(days=7)), nombre="Domingo de la Divina Misericordia", color="blanco"),
        dict(fecha=f(C["ascension"]), nombre="Ascensión del Señor", nota=f"o el domingo {fmt(C['ascension_domingo'])}", color="blanco"),
        dict(fecha=f(C["pentecostes"]), nombre="Pentecostés", color="rojo"),
        dict(fecha=f(C["trinidad"]), nombre="Santísima Trinidad", color="blanco"),
        dict(fecha=f(C["corpus"]), nombre="Corpus Christi", nota=f"o el domingo {fmt(C['corpus_domingo'])}", color="blanco"),
        dict(fecha=f(C["asuncion"]), nombre="Asunción de la Virgen María", color="blanco"),
        dict(fecha=f(C["todos_santos"]), nombre="Todos los Santos", color="blanco"),
        dict(fecha=f(C["todos_santos"] + __import__("datetime").timedelta(days=1)), nombre="Fieles Difuntos", color="morado"),
        dict(fecha=f(C["cristo_rey"]), nombre="Jesucristo, Rey del Universo", nota="último domingo del año litúrgico", color="blanco"),
        dict(fecha=f(C["adviento"]), nombre="Primer domingo de Adviento", nota="empieza el nuevo año litúrgico", color="morado"),
        dict(fecha=f(C["inmaculada"]), nombre="Inmaculada Concepción", color="blanco"),
        dict(fecha=f(C["guadalupe"]), nombre="Nuestra Señora de Guadalupe", color="blanco"),
        dict(fecha=f(C["navidad"]), nombre="Navidad", nota="nacimiento de Jesús", color="blanco"),
    ]



def montar(n, env, idx_principal):
    m = env.get_template("bonos.html.j2").module
    b = dict(FRENTE[str(n)], n=n)
    b["icono_sec"] = CAPAS[n]["icono"] if CAPAS[n]["icono"] != "liturgia" else "estrellas"
    pg = Pag()
    pg.add(m.capa(CAPAS[n]))
    pg.add(m.bienvenida(b, pg.prox()))
    pg.add(m.como_usar(b, pg.prox()))
    def construir(desloc):
        c = Pag(); c.n = pg.n + desloc; it = []
        if n == 1:
            sem = [enriquecer_semana(s, idx_principal) for s in load("bono_1.json")["semanas"]]
            paginas = {}
            p_res = c.prox(); c.add("")  # resumo: preenchido abaixo
            it.append(dict(kind="e", text="Tu trimestre en una página", anchor="resumen", page=p_res, strong=True))
            it.append(dict(kind="h", text="Las 12 semanas"))
            for s in sem:
                paginas[s["n"]] = c.prox()
                it.append(dict(kind="e", text=f"Semana {s['n']} · {s['tema']}", anchor=f"sem-{s['n']}", page=c.prox()))
                c.add(m.semana(s, c.prox(), c.prox() + 1), 2)
            c.partes[0] = str(m.b1_resumen(sem, paginas, p_res))
            it.append(dict(kind="h", text="Para seguir planificando"))
            it.append(dict(kind="e", text="Planificador en blanco", anchor="planificador", page=c.prox()))
            c.add(m.b1_planificador(1, c.prox())); c.add(m.b1_planificador(2, c.prox()))
        elif n == 2:
            pars = load("bono_2.json")["parabolas"]
            it.append(dict(kind="h", text="Las 30 parábolas"))
            for p in pars:
                it.append(dict(kind="e", text=f"{p['n']}. {p['titulo']}", anchor=f"par-{p['n']}", page=c.prox()))
                c.add(m.parabola(p, len(pars), c.prox(), c.prox() + 1), 2)
        elif n == 3:
            d3 = load("bono_3.json")
            ficha = env.get_template("ficha_bono.html.j2")
            it.append(dict(kind="e", text="¿Qué es el Año Litúrgico?", anchor="ano-liturgico", page=c.prox(), strong=True))
            c.add(m.b3_ano(roda_liturgica(d3["ano"]), c.prox()))
            it.append(dict(kind="e", text=f"Calendario litúrgico {d3['ano']}", anchor="calendario", page=c.prox(), strong=True))
            c.add(m.b3_calendario(fechas_calendario(d3["ano"]), d3["ano"], c.prox()))
            for s in d3["secciones"]:
                it.append(dict(kind="h", text=f"{s['nombre']} ({len(s['dinamicas'])})", cls=f"lit-{s['color']}"))
                c.add(m.div_lit(s))
                for d in s["dinamicas"]:
                    it.append(dict(kind="e", text=d["titulo"], anchor=f"d-{d['id']}", page=c.prox()))
                    c.add(ficha.render(d=d, sec=s, page_no=c.prox()))
        else:
            d4 = load("bono_4.json")
            it.append(dict(kind="h", text="Para empezar"))
            it.append(dict(kind="e", text="¿Por qué rezar con los niños?", anchor="por-que", page=c.prox()))
            c.add(m.b4_porque(d4["intro"], c.prox()))
            it.append(dict(kind="e", text="Cómo armar un rincón de oración", anchor="rincon", page=c.prox()))
            c.add(m.b4_rincon(d4["intro"], c.prox()))
            it.append(dict(kind="h", text="Oraciones básicas"))
            for o in d4["basicas"]:
                it.append(dict(kind="e", text=o["titulo"], anchor=f"or-{o['slug']}", page=c.prox()))
                c.add(m.oracion_basica(o, c.prox()))
            it.append(dict(kind="h", text="Oraciones para cada encuentro"))
            mods = d4["modulos"]
            for i in range(0, len(mods), 2):
                par = mods[i:i + 2]
                anc = f"orm-{par[0]['n']}"
                for mm in par:
                    it.append(dict(kind="e", text=f"Módulo {mm['n']} · {mm['titulo']}", anchor=anc, page=c.prox()))
                c.add(m.oraciones_modulos(par, c.prox(), anc))
            it.append(dict(kind="h", text="Más recursos"))
            it.append(dict(kind="e", text="10 formas creativas de orar", anchor="formas", page=c.prox()))
            fs = d4["formas"]
            for i in range(0, len(fs), 2):
                c.add(m.b4_formas(fs[i:i + 2], i + 1, c.prox()))
            it.append(dict(kind="e", text="Oraciones para momentos especiales", anchor="especiales", page=c.prox()))
            es = d4["especiales"]
            c.add(m.b4_especiales(es[:4], 1, c.prox())); c.add(m.b4_especiales(es[4:], 2, c.prox()))
            it.append(dict(kind="e", text="Tarjetas para recortar", anchor="tarjetas", page=c.prox()))
            cards1 = [dict(titulo=o["titulo"], texto=" ".join(o["texto"]), larga=o.get("larga")) for o in d4["basicas"]]
            c.add(m.b4_tarjetas(cards1, "Oraciones básicas", 1, c.prox()))
            c.add(m.b4_tarjetas(d4["cortas"], "Oraciones cortas", 2, c.prox()))
        it.append(dict(kind="e", text=b["final_titulo"], anchor="final", page=c.prox(), strong=True))
        c.add(m.final(b, c.prox()))
        return c, it

    # 1.ª passada para saber quantas páginas de índice serão necessárias
    _, it = construir(1)
    paginas_idx = colunas(it, b.get("idx_cap", 40))
    c, it = construir(len(paginas_idx))
    paginas_idx = colunas(it, b.get("idx_cap", 40))
    for k, cols in enumerate(paginas_idx):
        pg.add(m.indice(b, cols, pg.prox(), "Índice" if k == 0 else "Índice (cont.)"))
    pg.partes += c.partes
    html = env.get_template("base_bonos.html.j2").render(body="\n".join(pg.partes), title=NOMES[n])
    return html


def build_full(sel):
    env = env_bonos()
    idx = principal()
    for n in sel:
        print(f"— Bono {n}")
        rep = render(montar(n, env, idx), NOMES[n], png=False)
        if rep["overflow"]:
            print("  ⚠ revisar overflow")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--sample", action="store_true")
    ap.add_argument("bonos", nargs="*", type=int)
    a = ap.parse_args()
    if a.sample:
        build_sample()
    else:
        build_full(a.bonos or [1, 2, 3, 4])
