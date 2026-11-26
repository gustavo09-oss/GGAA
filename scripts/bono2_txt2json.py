#!/usr/bin/env python3
"""content/bonos/src/bono_2*.txt -> content/bonos/bono_2.json
Formato:
  ## n | Título | Referencia
  P: parágrafo da história (vários)
  E: ¿Qué nos enseña Jesús?
  Q: pergunta (3)
  A: título | tipo | minutos | material; material
  - passo da atividade
  O: oração
"""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "content/bonos/src"


def parse(text, fname):
    items, cur = [], None
    for ln, raw in enumerate(text.splitlines(), 1):
        line = raw.strip()
        if not line:
            continue
        try:
            if line.startswith("## "):
                n, t, ref = [x.strip() for x in line[3:].split("|")]
                cur = {"n": int(n), "titulo": t, "referencia": ref, "historia": [], "ensenanza": "",
                       "preguntas": [], "actividad": None, "oracion": ""}
                items.append(cur)
            elif line.startswith("P:"):
                cur["historia"].append(line[2:].strip())
            elif line.startswith("E:"):
                cur["ensenanza"] = line[2:].strip()
            elif line.startswith("Q:"):
                cur["preguntas"].append(line[2:].strip())
            elif line.startswith("A:"):
                t, tipo, mins, mats = [x.strip() for x in line[2:].split("|")]
                cur["actividad"] = {"titulo": t, "tipo": tipo, "minutos": int(mins),
                                    "materiales": [m.strip() for m in mats.split(";") if m.strip()], "pasos": []}
            elif line.startswith("- "):
                cur["actividad"]["pasos"].append(line[2:].strip())
            elif line.startswith("O:"):
                cur["oracion"] = line[2:].strip()
            else:
                raise ValueError("linha não reconhecida")
        except Exception as e:  # noqa: BLE001
            sys.exit(f"{fname} linha {ln}: {e}\n  {raw}")
    return items


def palavras(p):
    return len(" ".join(p["historia"]).split())


def main():
    items = []
    for f in sorted(SRC.glob("bono_2*.txt")):
        items += parse(f.read_text(encoding="utf-8"), f.name)
    items.sort(key=lambda p: p["n"])
    (ROOT / "content/bonos/bono_2.json").write_text(
        json.dumps({"parabolas": items}, ensure_ascii=False, indent=2), encoding="utf-8")
    for p in items:
        print(f"{p['n']:2} {p['titulo']:32} {palavras(p)} palavras")
    print("total", len(items))


if __name__ == "__main__":
    main()
