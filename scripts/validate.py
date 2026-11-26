#!/usr/bin/env python3
"""Validação do conteúdo do Catequesis Viva.

Uso: python scripts/validate.py [--partial]
  --partial  não exige as quantidades finais (útil durante a escrita)
"""
import difflib
import json
import re
import sys
import unicodedata
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ESPERADO = {1: 40, 2: 35, 3: 40, 4: 80, 5: 30, 6: 35, 7: 90, 8: 70, 9: 30, 10: 30, 11: 30}
TIPOS = {"Juego", "Manualidad", "Oración", "Teatro", "Música", "Reflexión", "Rompehielos"}
EDADES = {"Todas": 0.45, "5+": 0.25, "7+": 0.30}
CAMPOS = ["id", "modulo", "titulo", "tipo", "edad", "duracion_min", "participantes", "objetivo",
          "materiales", "pasos", "para_los_mas_pequenos", "para_los_mayores", "cita_biblica",
          "mensaje_final"]

# Palavras/grafias que só existem em português (vazamento de idioma)
PT_CHARS = re.compile(r"[ãõçêâôà]", re.I)
PT_WORDS = re.compile(
    r"\b(você|vocês|não|uma|também|então|isso|isto|nós|muito|muita|obrigad[oa]|criança|crianças|"
    r"depois|ainda|agora|fazer|coração|oração|mãe|pai|irmão|ele|ela|eles|elas|com|seu|sua|"
    r"pra|até|já|só|aqui|bem-vindo|bem-vindos|Jesus|Deus|igreja|brincadeira|lápis|cola|tesoura|"
    r"papelão|bexiga|barbante|cartolina|giz)\b", re.I)

# Temas reservados para os bônus (parábolas e tempos litúrgicos)
PROIBIDOS = re.compile(
    r"(parábola|adviento|navidad|navideñ|cuaresma|semana santa|miércoles de ceniza|tiempo pascual|"
    r"tiempo ordinario|epifanía|pentecost|corona de adviento|pesebre|villancico|"
    r"hijo pródigo|buen samaritano|oveja perdida|sembrador|grano de mostaza|levadura|perla de gran|"
    r"vírgenes prudentes|parábola de los talentos|moneda perdida|fariseo y el publicano|"
    r"rico epulón|hombre rico y lázaro|viñador|trabajadores de la viña|casa sobre la roca)", re.I)


# Trechos bíblicos que são parábolas (reservadas ao bônus): livro -> [(cap, v_ini, v_fim)]
PARABOLAS = {
    "mateo": [(7, 24, 27), (13, 1, 52), (18, 12, 14), (18, 23, 35), (20, 1, 16), (21, 28, 46),
              (22, 1, 14), (25, 1, 30)],
    "marcos": [(4, 1, 34), (12, 1, 12)],
    "lucas": [(6, 47, 49), (8, 4, 18), (10, 25, 37), (12, 13, 21), (13, 18, 21), (14, 7, 11), (14, 15, 24),
              (15, 1, 32), (16, 1, 9), (16, 19, 31), (18, 1, 14), (19, 11, 27), (20, 9, 19)],
    "juan": [(10, 1, 18)],
}


def ref_parabola(ref):
    m = re.match(r"\s*(\w+)\s+(\d+),\s*(\d+)(?:-(\d+))?", norm_ref(ref))
    if not m:
        return False
    libro, cap, v1 = m.group(1), int(m.group(2)), int(m.group(3))
    v2 = int(m.group(4) or v1)
    return any(c == cap and not (v2 < a or v1 > b) for c, a, b in PARABOLAS.get(libro, []))


def norm_ref(s):
    return unicodedata.normalize("NFKD", s.lower()).encode("ascii", "ignore").decode()


def norm(s):
    s = unicodedata.normalize("NFKD", s.lower()).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9 ]", "", s).strip()


def texto(d):
    parts = [d["titulo"], d["objetivo"], d.get("preparacion", ""), *d["pasos"],
             d["para_los_mas_pequenos"], d["para_los_mayores"], d["cita_biblica"]["mensaje"],
             d["mensaje_final"], *d["materiales"], d["participantes"]]
    return " ".join(parts)


def words(d):
    stop = set("el la los las un una de del y a en que con por para se su sus al es lo le les "
               "cada nino ninos todos juntos jesus dios".split())
    return {w for w in norm(" ".join(d["pasos"] + [d["objetivo"]])).split() if len(w) > 3 and w not in stop}


def main():
    partial = "--partial" in sys.argv
    erros, avisos = [], []
    todas = []
    for m in range(1, 12):
        p = ROOT / "content" / f"modulo_{m:02d}.json"
        if not p.exists():
            (avisos if partial else erros).append(f"módulo {m:02d}: arquivo ausente")
            continue
        data = json.loads(p.read_text(encoding="utf-8"))
        if len(data) != ESPERADO[m]:
            (avisos if partial else erros).append(f"módulo {m:02d}: {len(data)} de {ESPERADO[m]} dinâmicas")
        todas += data

    for d in todas:
        did = d.get("id", "?")
        for c in CAMPOS:
            if c not in d or d[c] in ("", [], None):
                erros.append(f"{did}: campo vazio '{c}'")
        if d["tipo"] not in TIPOS:
            erros.append(f"{did}: tipo inválido '{d['tipo']}'")
        if d["edad"] not in EDADES:
            erros.append(f"{did}: edad inválida '{d['edad']}'")
        if not (3 <= len(d["pasos"]) <= 6):
            erros.append(f"{did}: {len(d['pasos'])} pasos (3–6)")
        lo = 3 if d["modulo"] == 11 else 5
        if not (lo <= d["duracion_min"] <= 25):
            erros.append(f"{did}: duración {d['duracion_min']} min fora do intervalo")
        cb = d["cita_biblica"]
        if not cb.get("referencia") or not cb.get("mensaje"):
            erros.append(f"{did}: cita bíblica incompleta")
        elif ref_parabola(cb["referencia"]):
            erros.append(f"{did}: cita dentro de uma parábola: {cb['referencia']}")
        elif len(cb["mensaje"]) > 160:
            avisos.append(f"{did}: paráfrase longa ({len(cb['mensaje'])} car.)")
        t = texto(d)
        if PT_CHARS.search(t) or PT_WORDS.search(t):
            hit = (PT_CHARS.search(t) or PT_WORDS.search(t)).group(0)
            erros.append(f"{did}: possível português: '{hit}'")
        if PROIBIDOS.search(t):
            erros.append(f"{did}: tema reservado aos bônus: '{PROIBIDOS.search(t).group(0)}'")

    # títulos duplicados e quase idênticos
    vistos = {}
    for d in todas:
        k = norm(d["titulo"])
        if k in vistos:
            erros.append(f"título duplicado: '{d['titulo']}' ({vistos[k]} e {d['id']})")
        vistos[k] = d["id"]
    ws = [(d["id"], d["titulo"], words(d)) for d in todas]
    for i in range(len(ws)):
        for j in range(i + 1, len(ws)):
            a, b = ws[i], ws[j]
            rt = difflib.SequenceMatcher(None, norm(a[1]), norm(b[1])).ratio()
            jac = len(a[2] & b[2]) / max(1, len(a[2] | b[2]))
            if rt > 0.85:
                avisos.append(f"títulos parecidos: {a[0]} '{a[1]}' ~ {b[0]} '{b[1]}'")
            if jac > 0.45:
                erros.append(f"dinâmicas quase idênticas ({jac:.0%}): {a[0]} ~ {b[0]}")

    # distribuição de tipos por módulo
    for m in range(1, 12):
        ds = [d for d in todas if d["modulo"] == m]
        if not ds:
            continue
        c = Counter(d["tipo"] for d in ds)
        tipo, n = c.most_common(1)[0]
        if n / len(ds) > 0.42:
            erros.append(f"módulo {m:02d}: '{tipo}' = {n}/{len(ds)} ({n/len(ds):.0%}) > 40%")

    # distribuição de idade global
    if todas:
        c = Counter(d["edad"] for d in todas)
        for e, alvo in EDADES.items():
            real = c[e] / len(todas)
            if abs(real - alvo) > 0.06:
                (avisos if partial else erros).append(
                    f"idade '{e}': {real:.0%} (alvo {alvo:.0%})")

    print(f"Total: {len(todas)} dinâmicas")
    for m in range(1, 12):
        ds = [d for d in todas if d["modulo"] == m]
        if ds:
            ct = Counter(d["tipo"] for d in ds)
            ce = Counter(d["edad"] for d in ds)
            print(f"  M{m:02d}: {len(ds):3d}/{ESPERADO[m]}  tipos {dict(ct)}  idades {dict(ce)}")
    if todas:
        ce = Counter(d["edad"] for d in todas)
        print("  Idades:", {k: f"{v} ({v/len(todas):.0%})" for k, v in ce.items()})
    for a in avisos:
        print("AVISO:", a)
    for e in erros:
        print("ERRO:", e)
    print("OK" if not erros else f"{len(erros)} erro(s)")
    sys.exit(1 if erros else 0)


if __name__ == "__main__":
    main()
