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


FRASES = {
    1: ("Donde dos o tres se reúnen en mi nombre, allí estoy yo en medio de ellos.", "Mateo 18, 20"),
    2: ("Dios miró todo lo que había hecho, y vio que era muy bueno.", "Génesis 1, 31"),
    3: ("Contaremos a nuestros hijos las maravillas que hizo el Señor.", "Salmo 78, 4"),
    4: ("Jesús pasó por el mundo haciendo el bien.", "Hechos 10, 38"),
    5: ("Desde ahora todas las generaciones me llamarán feliz.", "Lucas 1, 48"),
    6: ("Pidan y se les dará; busquen y encontrarán; llamen y se les abrirá.", "Mateo 7, 7"),
    7: ("Yo soy el pan vivo bajado del cielo; el que coma de este pan vivirá para siempre.", "Juan 6, 51"),
    8: ("Ámense unos a otros como yo los he amado.", "Juan 13, 34"),
    9: ("¡Qué alegría cuando me dijeron: vamos a la casa del Señor!", "Salmo 122, 1"),
    10: ("Guardo tu palabra en mi corazón.", "Salmo 119, 11"),
    11: ("Que el Señor te bendiga y te guarde, y te dé su paz.", "Números 6, 24-26"),
}

TIPOS_DESC = [
    ("Rompehielos", "Para empezar, integrar al grupo, aprender nombres y crear confianza."),
    ("Juego", "Actividades con movimiento y reglas sencillas para aprender jugando."),
    ("Manualidad", "Trabajos manuales con materiales caseros que los niños se llevan a casa."),
    ("Oración", "Momentos para hablar con Dios y aprender a rezar."),
    ("Teatro", "Dramatizaciones para vivir las historias de la Biblia y de la fe."),
    ("Música", "Cantos, ritmos y movimiento para alabar a Dios con alegría."),
    ("Reflexión", "Conversaciones guiadas para pensar y llevar la fe a la vida diaria."),
]

COL_CAP = 40  # linhas por coluna nos índices


def paginate(sections):
    """sections: [(header_item, [entries])] -> lista de páginas, cada uma com 2 colunas."""
    def weight(it):
        return 2 if it["kind"] == "h" else (2 if len(it["text"]) > 37 else 1)

    cols, col, used = [], [], 0
    for head, entries in sections:
        cont = False
        i = 0
        while i < len(entries):
            h = dict(head, text=(head.get("short", head["text"]) + " (cont.)") if cont else head["text"])
            if used + weight(h) + weight(entries[i]) > COL_CAP:
                cols.append(col); col, used = [], 0
            col.append(h); used += weight(h); cont = True
            while i < len(entries) and used + weight(entries[i]) <= COL_CAP:
                col.append(entries[i]); used += weight(entries[i]); i += 1
            if i < len(entries):
                cols.append(col); col, used = [], 0
    if col:
        cols.append(col)
    return [cols[k:k + 2] for k in range(0, len(cols), 2)]


def build_full():
    env = make_env()
    P = env.get_template("paginas.html.j2").module
    ficha = env.get_template("ficha.html.j2")
    capas = env.get_template("capas.html.j2")

    data = {m: json.loads((ROOT / f"content/modulo_{m:02d}.json").read_text(encoding="utf-8"))
            for m in range(1, 12)}

    # índices: estrutura (sem números de página ainda)
    det_sections = [({"kind": "h", "text": f"{m}. {MODULOS[m]}", "cls": f"mod-{m}"},
                     [{"kind": "e", "id": d["id"], "text": d["titulo"], "mod": m} for d in data[m]])
                    for m in range(1, 12)]
    tipo_sections = []
    for t, _ in TIPOS_DESC:
        ents = [{"kind": "e", "id": d["id"], "text": d["titulo"], "mod": d["modulo"], "dot": True}
                for m in range(1, 12) for d in data[m] if d["tipo"] == t]
        tipo_sections.append(({"kind": "h", "text": f"{t} ({len(ents)})", "short": t, "cls": "tipo",
                               "icon": slug(t)}, ents))
    det_pages = paginate(det_sections)
    tipo_pages = paginate(tipo_sections)

    # numeração
    page = 1                       # capa
    pg = {"carta": 2, "como": 3, "leyenda": 4, "indice": 5}
    page = 5
    pg["det"] = page + 1
    page += len(det_pages)
    mods, num = [], {}
    for m in range(1, 12):
        page += 1
        mods.append({"n": m, "titulo": MODULOS[m], "total": len(data[m]), "page": page,
                     "frase": FRASES[m][0], "ref": FRASES[m][1]})
        for d in data[m]:
            page += 1
            num[d["id"]] = page
    pg["tipo"] = page + 1
    page += len(tipo_pages)
    pg["final"] = page + 1
    total_pages = pg["final"]

    for pages in (det_pages, tipo_pages):
        for cols in pages:
            for col in cols:
                for it in col:
                    if it["kind"] == "e":
                        it["page"] = num[it["id"]]

    out = [capas.render(variants=[2], ilus_mini_caliz=env.globals["ilus"]["caliz_mini"]),
           P.carta(pg["carta"]), P.como_usar(pg["como"]), P.leyenda(pg["leyenda"], TIPOS_DESC)]
    extras = [("Índice de dinámicas por módulo", "indice-det", pg["det"]),
              ("Índice rápido por tipo de dinámica", "indice-tipo", pg["tipo"]),
              ("Oración de la catequista y mis favoritas", "final", pg["final"])]
    out.append(P.indice(pg["indice"], mods, extras))
    for k, cols in enumerate(det_pages):
        out.append(P.indice_cols(pg["det"] + k, cols, "Índice de dinámicas", "Por módulo",
                                 "indice-det" if k == 0 else ""))
    for mod in mods:
        out.append(P.divisoria(mod))
        for d in data[mod["n"]]:
            out.append(ficha.render(d=d, mod={"titulo": MODULOS[mod["n"]]}, page_no=num[d["id"]]))
    for k, cols in enumerate(tipo_pages):
        out.append(P.indice_cols(pg["tipo"] + k, cols, "Índice rápido por tipo", "El color del punto indica el módulo",
                                 "indice-tipo" if k == 0 else ""))
    out.append(P.final(pg["final"]))

    html = env.get_template("base.html.j2").render(
        body="\n".join(str(x) for x in out), title="Catequesis Viva: +500 Dinámicas para Niños")
    rep = render_pdf(html, "Catequesis_Viva_500_Dinamicas")
    assert rep["pages"] == total_pages, (rep["pages"], total_pages)
    meta = {"paginas": total_pages, "modulos": {m["n"]: m["page"] for m in mods},
            "indice_det": pg["det"], "indice_tipo": pg["tipo"], "final": pg["final"],
            "num": num}
    (OUT / "paginas.json").write_text(json.dumps(meta, ensure_ascii=False, indent=1), encoding="utf-8")
    return meta


def build_check(mods):
    """Renderiza as fichas dos módulos indicados e reporta overflow."""
    env = make_env()
    ficha = env.get_template("ficha.html.j2")
    pages = []
    for m in mods:
        for d in json.loads((ROOT / f"content/modulo_{m:02d}.json").read_text(encoding="utf-8")):
            pages.append(ficha.render(d=d, mod={"titulo": MODULOS[m]}, page_no=len(pages) + 1))
    html = env.get_template("base.html.j2").render(body="\n".join(pages), title="Check")
    return render_pdf(html, "check")


def build_covers():
    env = make_env()
    html_body = env.get_template("capas.html.j2").render(
        variants=[1, 2, 3], ilus_mini_caliz=env.globals["ilus"]["caliz_mini"])
    html = env.get_template("base.html.j2").render(body=html_body, title="Capas")
    render_pdf(html, "capas", png_pages=[], scale=2)
    import shutil
    for i in (1, 2, 3):
        shutil.copy(OUT / "capas_png" / f"p{i:03d}.png", OUT / f"capa_v{i}.png")
    print("Capas: output/capa_v1.png, capa_v2.png, capa_v3.png")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--sample", action="store_true")
    ap.add_argument("--covers", action="store_true")
    ap.add_argument("--check", nargs="+", type=int)
    ap.add_argument("--full", action="store_true")
    a = ap.parse_args()
    if a.sample:
        build_sample()
    elif a.full:
        build_full()
    elif a.check:
        build_check(a.check)
    elif a.covers:
        build_covers()
    else:
        print("Build completo ainda não implementado (etapa 6).")
