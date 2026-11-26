"""Gera site/index.html (documento completo para hospedar) a partir de site/src/landing.html."""
from pathlib import Path
src = Path(__file__).with_name("landing.html").read_text(encoding="utf-8")
html = ('<!doctype html>\n<html lang="es">\n<head>\n<meta charset="utf-8">\n'
        '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
        + src.replace("<div class=\"topbar\">", "</head>\n<body>\n<div class=\"topbar\">", 1)
        + "\n</body>\n</html>\n")
html = html.replace("</style>\n\n</head>", "</style>\n</head>")
Path(__file__).parents[1].joinpath("index.html").write_text(html, encoding="utf-8")
print("ok", len(html))
