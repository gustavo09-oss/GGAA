#!/usr/bin/env python3
"""Converte content/bonos/src/bono_3*.txt (formato compacto do livro principal) em content/bonos/bono_3.json.
As datas de cada seção saem de scripts/liturgia.py (calculadas, nunca escritas à mão)."""
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from txt2json import parse  # noqa: E402
from liturgia import calendario, fmt  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "content/bonos/src"
ANO = 2027
C = calendario(ANO)

SECCIONES = [
    ("adviento", "Adviento", "AD", "morado", "morado", "paloma", 8,
     f"Del {fmt(C['adviento'])} al 24 de diciembre de {ANO}",
     "Adviento quiere decir «llegada». Son las cuatro semanas antes de la Navidad, en las que preparamos el corazón para recibir a Jesús. Es un tiempo de espera alegre, como cuando esperamos a un amigo muy querido."),
    ("navidad", "Navidad", "NA", "blanco", "blanco", "corazon", 8,
     f"Del 25 de diciembre al Bautismo del Señor ({fmt(C['bautismo'])} de {ANO})",
     "En Navidad celebramos que Dios se hizo niño y nació en Belén. Es la fiesta del amor de Dios que viene a vivir con nosotros. Por eso cantamos, compartimos y nos alegramos en familia."),
    ("epifania", "Epifanía y Reyes Magos", "EP", "blanco", "blanco", "paloma", 4,
     f"6 de enero (en varios países, el domingo {fmt(C['epifania_domingo'])} de {ANO})",
     "Epifanía quiere decir «manifestación»: Jesús se muestra a todos los pueblos. Unos sabios de Oriente siguieron una estrella para adorarlo. Jesús vino para todas las personas del mundo."),
    ("cuaresma", "Miércoles de Ceniza y Cuaresma", "CU", "morado", "morado", "corazon", 8,
     f"Desde el miércoles {fmt(C['ceniza'])} de {ANO}: cuarenta días",
     "La Cuaresma son cuarenta días para prepararnos a la Pascua. Empieza el Miércoles de Ceniza. Es un tiempo para rezar más, compartir con los que necesitan y cambiar lo que nos aleja de Dios."),
    ("semana-santa", "Domingo de Ramos y Semana Santa", "SS", "rojo", "rojo (y morado)", "corazon", 8,
     f"Del {fmt(C['ramos'])} al {fmt(C['viernes_santo'] + __import__('datetime').timedelta(days=1))} de {ANO}",
     "En Semana Santa acompañamos a Jesús en los días más importantes de su vida: su entrada en Jerusalén, la Última Cena, su muerte en la cruz por amor y la espera de la Resurrección."),
    ("pascua", "Pascua de Resurrección", "PA", "blanco", "blanco", "paloma", 6,
     f"Del {fmt(C['pascua'])} al {fmt(C['pentecostes'])} de {ANO}: cincuenta días",
     "¡Jesús resucitó! La Pascua es la fiesta más grande de los cristianos. Durante cincuenta días celebramos que Jesús vive y que su amor es más fuerte que todo. ¡Aleluya!"),
    ("pentecostes", "Pentecostés", "PE", "rojo", "rojo", "paloma", 4,
     f"Domingo {fmt(C['pentecostes'])} de {ANO}",
     "Cincuenta días después de la Pascua, el Espíritu Santo vino sobre los apóstoles y María. Desde ese día, la Iglesia anuncia a Jesús en todo el mundo. Es como el cumpleaños de la Iglesia."),
    ("corpus", "Corpus Christi", "CO", "blanco", "blanco", "caliz", 3,
     f"Jueves {fmt(C['corpus'])} (o domingo {fmt(C['corpus_domingo'])}) de {ANO}",
     "Corpus Christi quiere decir «Cuerpo de Cristo». Celebramos con alegría que Jesús se queda con nosotros en la Eucaristía. En muchos lugares se hace una procesión por las calles."),
    ("maria", "Fiestas de María", "MA", "blanco", "blanco (o celeste)", "corazon", 5,
     f"1 de enero, 15 de agosto, 8 y 12 de diciembre de {ANO}",
     "Durante el año celebramos varias fiestas de María, la Mamá de Jesús y nuestra Madre: Santa María Madre de Dios, la Asunción, la Inmaculada Concepción, la Virgen de Guadalupe y el mes de mayo."),
    ("santos", "Todos los Santos", "SA", "blanco", "blanco", "corazon", 3,
     f"Lunes {fmt(C['todos_santos'])} de {ANO}",
     "El 1 de noviembre celebramos a todos los santos: los conocidos y los que nadie conoce. Son amigos de Dios que nos muestran que todos podemos ser santos amando en lo pequeño."),
    ("cristo-rey", "Cristo Rey", "CR", "blanco", "blanco", "caliz", 3,
     f"Domingo {fmt(C['cristo_rey'])} de {ANO}",
     "El último domingo del año de la Iglesia celebramos que Jesús es Rey del universo. Pero es un Rey distinto: no tiene ejércitos, sino amor, y su reino crece cuando ayudamos a los demás."),
]


def main():
    bloques, cur = {}, None
    for f in sorted(SRC.glob("bono_3*.txt")):
        for line in f.read_text(encoding="utf-8").splitlines():
            if line.startswith("@@ "):
                cur = line[3:].strip()
                bloques[cur] = []
            elif cur:
                bloques[cur].append(line)
    secciones = []
    for slug, nombre, pref, color, color_nombre, ilus, cuantas, fechas, texto in SECCIONES:
        dins = parse("\n".join(bloques[slug]), 0)
        for i, d in enumerate(dins, 1):
            d["id"] = f"{pref}-{i:02d}"
            d.pop("modulo", None)
        secciones.append(dict(slug=slug, nombre=nombre, color=color, color_nombre=color_nombre, ilus=ilus,
                              imagen=f"bono3_{slug}.png", cuantas=cuantas, fechas=fechas, texto=texto,
                              dinamicas=dins))
    out = {"ano": ANO, "secciones": secciones}
    (ROOT / "content/bonos/bono_3.json").write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
    for s in secciones:
        print(f"{s['slug']:13} {len(s['dinamicas'])}/{s['cuantas']}")
    print("total", sum(len(s["dinamicas"]) for s in secciones))


if __name__ == "__main__":
    main()
