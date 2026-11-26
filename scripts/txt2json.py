#!/usr/bin/env python3
"""Converte content/src/modulo_XX.txt (formato compacto) em content/modulo_XX.json.

Formato de cada dinâmica:
  ## Título | Tipo | Edad | duración | participantes
  O: objetivo
  M: material 1; material 2        (ou "Sin materiales")
  R: preparación                   (opcional)
  1. paso                          (3 a 6)
  -: adaptación más pequeños
  +: adaptación mayores
  C: Referencia | paráfrasis
  F: mensaje final
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "content" / "src"


def parse(text: str, modulo: int):
    items, cur = [], None
    for ln, raw in enumerate(text.splitlines(), 1):
        line = raw.strip()
        if not line or line.startswith("#!"):
            continue
        try:
            if line.startswith("## "):
                if cur:
                    items.append(cur)
                t, tipo, edad, dur, part = [x.strip() for x in line[3:].split("|")]
                cur = {"titulo": t, "tipo": tipo, "edad": edad, "duracion_min": int(dur),
                       "participantes": part, "objetivo": "", "materiales": [], "preparacion": "",
                       "pasos": [], "para_los_mas_pequenos": "", "para_los_mayores": "",
                       "cita_biblica": {"referencia": "", "mensaje": ""}, "mensaje_final": ""}
            elif line.startswith("O:"):
                cur["objetivo"] = line[2:].strip()
            elif line.startswith("M:"):
                cur["materiales"] = [m.strip() for m in line[2:].split(";") if m.strip()]
            elif line.startswith("R:"):
                cur["preparacion"] = line[2:].strip()
            elif re.match(r"^\d+\.", line):
                cur["pasos"].append(line.split(".", 1)[1].strip())
            elif line.startswith("-:"):
                cur["para_los_mas_pequenos"] = line[2:].strip()
            elif line.startswith("+:"):
                cur["para_los_mayores"] = line[2:].strip()
            elif line.startswith("C:"):
                ref, msg = line[2:].split("|", 1)
                cur["cita_biblica"] = {"referencia": ref.strip(), "mensaje": msg.strip()}
            elif line.startswith("F:"):
                cur["mensaje_final"] = line[2:].strip()
            else:
                raise ValueError("linha não reconhecida")
        except Exception as e:  # noqa: BLE001
            sys.exit(f"modulo_{modulo:02d}.txt linha {ln}: {e}\n  {raw}")
    if cur:
        items.append(cur)
    out = []
    for i, d in enumerate(items, 1):
        out.append({"id": f"{modulo:02d}-{i:03d}", "modulo": modulo, **d})
    return out


def main():
    mods = [int(a) for a in sys.argv[1:]] or [int(p.stem[-2:]) for p in sorted(SRC.glob("modulo_*.txt"))]
    for m in mods:
        data = parse((SRC / f"modulo_{m:02d}.txt").read_text(encoding="utf-8"), m)
        (ROOT / "content" / f"modulo_{m:02d}.json").write_text(
            json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"módulo {m:02d}: {len(data)} dinámicas")


if __name__ == "__main__":
    main()
