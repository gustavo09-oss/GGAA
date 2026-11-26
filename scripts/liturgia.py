"""Datas litúrgicas calculadas (nada fixo à mão): Páscoa por dateutil.easter (gregoriano)."""
from datetime import date, timedelta

from dateutil.easter import easter

MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto",
         "septiembre", "octubre", "noviembre", "diciembre"]
DIAS = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"]


def fmt(d: date, dia_semana=False) -> str:
    s = f"{d.day} de {MESES[d.month - 1]}"
    return f"{DIAS[d.weekday()]} {s}" if dia_semana else s


def primer_domingo_adviento(ano: int) -> date:
    navidad = date(ano, 12, 25)
    # 4.º domingo antes de Navidad (se Navidad cai num domingo, conta-se desde o domingo anterior)
    domingo_antes = navidad - timedelta(days=(navidad.weekday() + 1) % 7 or 7)
    return domingo_antes - timedelta(weeks=3)


def calendario(ano: int) -> dict:
    pascua = easter(ano)
    adv = primer_domingo_adviento(ano)
    # Epifania: 6/1 ou, onde se transfere, domingo entre 2 e 8 de janeiro
    jan2 = date(ano, 1, 2)
    epif_dom = jan2 + timedelta(days=(6 - jan2.weekday()) % 7)
    # Batismo do Senhor: domingo depois da Epifania (se a Epifania transferida cair em 7 ou 8, é a segunda seguinte)
    bautismo = epif_dom + timedelta(days=1) if epif_dom.day in (7, 8) else epif_dom + timedelta(days=7)
    return {
        "maria_madre": date(ano, 1, 1),
        "epifania": date(ano, 1, 6),
        "epifania_domingo": epif_dom,
        "bautismo": bautismo,
        "ceniza": pascua - timedelta(days=46),
        "ramos": pascua - timedelta(days=7),
        "jueves_santo": pascua - timedelta(days=3),
        "viernes_santo": pascua - timedelta(days=2),
        "pascua": pascua,
        "ascension": pascua + timedelta(days=39),
        "ascension_domingo": pascua + timedelta(days=42),
        "pentecostes": pascua + timedelta(days=49),
        "trinidad": pascua + timedelta(days=56),
        "corpus": pascua + timedelta(days=60),
        "corpus_domingo": pascua + timedelta(days=63),
        "asuncion": date(ano, 8, 15),
        "todos_santos": date(ano, 11, 1),
        "cristo_rey": adv - timedelta(days=7),
        "adviento": adv,
        "inmaculada": date(ano, 12, 8),
        "guadalupe": date(ano, 12, 12),
        "navidad": date(ano, 12, 25),
    }


if __name__ == "__main__":
    for k, v in calendario(2027).items():
        print(f"{k:18} {fmt(v, True)}")
