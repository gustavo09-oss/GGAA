#!/usr/bin/env python3
"""Validação dos 4 bônus (PROMPT_BONOS.md, item 4). Uso: python scripts/validate_bonos.py"""
import difflib
import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from validate import PT_CHARS, PT_WORDS, norm  # noqa: E402
from bonos_txt2json import SECCIONES  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
B = ROOT / "content/bonos"
erros, avisos = [], []


def err(m): erros.append(m)


def textos(obj):
    """Todas as strings de um objeto JSON (para a checagem de português)."""
    if isinstance(obj, str):
        yield obj
    elif isinstance(obj, dict):
        for v in obj.values():
            yield from textos(v)
    elif isinstance(obj, list):
        for v in obj:
            yield from textos(v)


def portugues(nome, obj):
    for t in textos(obj):
        if PT_CHARS.search(t) or PT_WORDS.search(t):
            err(f"{nome}: possível português → {t[:90]}")


# ---------------------------------------------------------------- principal
main = {}
for n in range(1, 12):
    for d in json.loads((ROOT / f"content/modulo_{n:02d}.json").read_text(encoding="utf-8")):
        main[d["id"]] = d
paginas = json.loads((ROOT / "output/paginas.json").read_text(encoding="utf-8"))["num"]

# ---------------------------------------------------------------- BONO 1
b1 = json.loads((B / "bono_1.json").read_text(encoding="utf-8"))
sem = b1["semanas"]
if [s["n"] for s in sem] != list(range(1, 13)):
    err("Bono 1: as semanas não são exatamente 1..12")
pdf_pag = {}
try:
    import pypdfium2 as pdfium
    pdf = pdfium.PdfDocument(str(ROOT / "output/Catequesis_Viva_500_Dinamicas.pdf"))
except Exception as e:  # noqa: BLE001
    pdf = None
    avisos.append(f"PDF principal não aberto ({e}); página conferida só pelo paginas.json")
ids_usados = 0
for s in sem:
    for k in ("tema", "objetivo", "compromiso", "nota_catequista"):
        if not s.get(k):
            err(f"Bono 1 semana {s['n']}: campo vazio {k}")
    if not (s["cita"]["referencia"] and s["cita"]["mensaje"]):
        err(f"Bono 1 semana {s['n']}: cita incompleta")
    if [b["min"] for b in s["bloques"]] != [5, 10, 25, 10, 10]:
        err(f"Bono 1 semana {s['n']}: blocos fora do roteiro 5/10/25/10/10")
    for b in s["bloques"]:
        for i in b["ids"]:
            ids_usados += 1
            if i not in main:
                err(f"Bono 1 semana {s['n']}: ID inexistente {i}")
                continue
            p = paginas[i]
            if pdf is not None:
                txt = pdf[p - 1].get_textpage().get_text_range()
                if f"Nº {i}" not in txt:
                    err(f"Bono 1 semana {s['n']}: {i} não está na pág. {p} do PDF principal")
portugues("Bono 1", b1)

# ---------------------------------------------------------------- BONO 2
b2 = json.loads((B / "bono_2.json").read_text(encoding="utf-8"))["parabolas"]
if len(b2) != 30 or [p["n"] for p in b2] != list(range(1, 31)):
    err(f"Bono 2: esperado 30 parábolas numeradas 1..30, há {len(b2)}")
for p in b2:
    w = len(" ".join(p["historia"]).split())
    if not 250 <= w <= 350:
        err(f"Bono 2 · {p['titulo']}: história com {w} palavras (250–350)")
    if len(p["preguntas"]) != 3:
        err(f"Bono 2 · {p['titulo']}: {len(p['preguntas'])} perguntas (esperado 3)")
    a = p["actividad"]
    if not (a and a["titulo"] and a["pasos"] and a["materiales"] and 5 <= a["minutos"] <= 10):
        err(f"Bono 2 · {p['titulo']}: atividade incompleta ou fora de 5–10 min")
    for k in ("titulo", "referencia", "ensenanza", "oracion"):
        if not p.get(k):
            err(f"Bono 2 · {p['titulo']}: campo vazio {k}")
portugues("Bono 2", b2)

# ---------------------------------------------------------------- BONO 3
b3 = json.loads((B / "bono_3.json").read_text(encoding="utf-8"))
esperado = {s[0]: s[6] for s in SECCIONES}
todas = []
for s in b3["secciones"]:
    if len(s["dinamicas"]) != esperado[s["slug"]]:
        err(f"Bono 3 · {s['nombre']}: {len(s['dinamicas'])} dinâmicas (esperado {esperado[s['slug']]})")
    for d in s["dinamicas"]:
        todas.append(d)
        for k in ("titulo", "tipo", "edad", "objetivo", "materiales", "pasos", "para_los_mas_pequenos",
                  "para_los_mayores", "mensaje_final"):
            if not d.get(k):
                err(f"Bono 3 · {d['id']}: campo vazio {k}")
        if not 3 <= len(d["pasos"]) <= 6:
            err(f"Bono 3 · {d['id']}: {len(d['pasos'])} passos (3–6)")
        if not (d["cita_biblica"]["referencia"] and d["cita_biblica"]["mensaje"]):
            err(f"Bono 3 · {d['id']}: cita incompleta")
if len(todas) != 60:
    err(f"Bono 3: {len(todas)} dinâmicas (esperado 60)")
tit = [norm(d["titulo"]) for d in todas]
if len(set(tit)) != len(tit):
    err("Bono 3: títulos repetidos")
for d in todas:
    for m in main.values():
        r = difflib.SequenceMatcher(None, norm(d["titulo"]), norm(m["titulo"])).ratio()
        if r >= 0.8:
            err(f"Bono 3 · {d['id']} «{d['titulo']}» parecido com {m['id']} «{m['titulo']}» ({r:.2f})")
for i, a in enumerate(todas):
    for b in todas[i + 1:]:
        if difflib.SequenceMatcher(None, norm(a["titulo"]), norm(b["titulo"])).ratio() >= 0.8:
            err(f"Bono 3: «{a['titulo']}» parecido com «{b['titulo']}»")
# datas: o texto de cada seção tem de bater com o cálculo atual
for s, meta in zip(b3["secciones"], SECCIONES):
    if s["fechas"] != meta[7]:
        err(f"Bono 3 · {s['nombre']}: datas desatualizadas (rode scripts/bonos_txt2json.py)")
portugues("Bono 3", b3)

# ---------------------------------------------------------------- BONO 4
b4 = json.loads((B / "bono_4.json").read_text(encoding="utf-8"))
if len(b4["basicas"]) != 8:
    err(f"Bono 4: {len(b4['basicas'])} orações básicas (esperado 8)")
if len(b4["modulos"]) != 11 or sorted(m["n"] for m in b4["modulos"]) != list(range(1, 12)):
    err("Bono 4: orações de encontro não cobrem os 11 módulos")
n_enc = sum(len(m["apertura"]) + len(m["cierre"]) for m in b4["modulos"])
if n_enc != 44 or any(len(m["apertura"]) != 2 or len(m["cierre"]) != 2 for m in b4["modulos"]):
    err(f"Bono 4: {n_enc} orações de encontro (esperado 44, 2+2 por módulo)")
if len(b4["formas"]) != 10 or any(len(f["pasos"]) < 3 for f in b4["formas"]):
    err("Bono 4: são necessárias 10 formas de orar com passo a passo")
if len(b4["especiales"]) != 8:
    err(f"Bono 4: {len(b4['especiales'])} orações especiais (esperado 8)")
if len(b4["basicas"]) + len(b4["cortas"]) != 16 or any(not c["texto"] for c in b4["cortas"]):
    err("Bono 4: cartões incompletos (2 páginas × 8)")
for o in b4["basicas"]:
    if not (o["texto"] and o["explicacion"] and o["partes"]) or any(not g["gesto"] for g in o["partes"]):
        err(f"Bono 4 · {o['titulo']}: explicação, texto ou gestos incompletos")
portugues("Bono 4", b4)
portugues("Textos de abertura", json.loads((B / "frente.json").read_text(encoding="utf-8")))

# ---------------------------------------------------------------- relatório
print(f"Bono 1: {len(sem)} semanas · {ids_usados} referências a dinâmicas do livro principal")
print(f"Bono 2: {len(b2)} parábolas · {min(len(' '.join(p['historia']).split()) for p in b2)}–"
      f"{max(len(' '.join(p['historia']).split()) for p in b2)} palavras")
print(f"Bono 3: {len(todas)} dinâmicas em {len(b3['secciones'])} seções · calendário {b3['ano']}")
print(f"Bono 4: {len(b4['basicas'])} básicas · {n_enc} de encontro · {len(b4['formas'])} formas · "
      f"{len(b4['especiales'])} especiais · {len(b4['basicas']) + len(b4['cortas'])} cartões")
for a in avisos:
    print("aviso:", a)
if erros:
    print(f"\n{len(erros)} problema(s):")
    for e in erros:
        print(" -", e)
    sys.exit(1)
print("\nOK: tudo validado.")
