# Relatório dos Bônus — Catequesis Viva

## Arquivos entregues (`output/bonos/`)

| Arquivo | Páginas | Tamanho |
|---|---|---|
| `Bono1_Ruta_de_Encuentros_12_Semanas.pdf` | 32 | 0.7 MB |
| `Bono2_30_Parabolas_para_Ninos.pdf` | 65 | 0.9 MB |
| `Bono3_Dinamicas_Fechas_Liturgicas.pdf` | 79 | 3.0 MB |
| `Bono4_Guia_de_Oracion.pdf` | 30 | 0.5 MB |
| `ILUSTRACOES_NECESSARIAS.md` | — | 15 imagens opcionais |

Todos em tamanho Carta, com as fontes Fredoka e Nunito embutidas (Type0), índice clicável e sem texto estourando nenhuma página.

## Contagens

- **Bono 1 · Ruta de Encuentros:** 12 semanas × 2 páginas, visão geral em 1 página, 2 páginas de planejador em branco. São 75 referências a dinâmicas reais do livro principal, cada uma com nº e página conferidos no PDF.
- **Bono 2 · 30 Parábolas:** 30 parábolas × 2 páginas. Histórias entre 275 e 328 palavras, cada uma com ensinamento, 3 perguntas, atividade de 5–10 min e oração.
- **Bono 3 · Fechas Litúrgicas:** 60 dinâmicas em 11 seções (Adviento 8, Navidad 8, Epifanía y Reyes Magos 4, Miércoles de Ceniza y Cuaresma 8, Domingo de Ramos y Semana Santa 8, Pascua de Resurrección 6, Pentecostés 4, Corpus Christi 3, Fiestas de María 5, Todos los Santos 3, Cristo Rey 3), página do Ano Litúrgico com diagrama de cores e calendário 2027.
- **Bono 4 · Guía de Oración:** 8 orações básicas com explicação e gestos, 44 orações de encontro (2+2 para cada um dos 11 módulos), 10 formas criativas de orar, 8 orações para momentos especiais e 16 cartões recortáveis (8 básicas + 8 curtas).

## Datas de 2027 (calculadas por `scripts/liturgia.py`, com `dateutil.easter`)

| Celebração | Data |
|---|---|
| Miércoles de Ceniza | miércoles 10 de febrero |
| Domingo de Ramos | domingo 21 de marzo |
| Pascua | domingo 28 de marzo |
| Ascensión (quinta) | jueves 6 de mayo |
| Pentecostés | domingo 16 de mayo |
| Corpus Christi (quinta) | jueves 27 de mayo |
| Cristo Rey | domingo 21 de noviembre |
| 1.º domingo de Adviento | domingo 28 de noviembre |

## Validação (`python3 scripts/validate_bonos.py`)

Passou em tudo:

- **Bono 1:** 12 semanas; todos os IDs existem e o nº de página bate com o PDF principal (o texto de cada página foi conferido).
- **Bono 2:** 30 parábolas, campos completos, 250–350 palavras.
- **Bono 3:** 60 dinâmicas, contagem certa por seção, nenhum título repetido nem parecido (≥ 0,80) com o principal, datas iguais ao cálculo atual.
- **Bono 4:** 8 básicas, 44 de encontro, 10 formas e cartões completos.
- **Português:** nenhuma palavra em português no texto em espanhol.

Durante a criação do Bono 3, 22 dinâmicas que repetiam temas do livro principal foram trocadas por práticas próprias de cada tempo litúrgico. Eram cenas do Evangelho já presentes no Módulo 4 (Tomé, lava-pés, Emaús, pastores, Simão de Cirene…) e temas de Guadalupe e das flores de Maria, do Módulo 5. Entraram no lugar delas: Árbol de Jesé, Posadas, Bendición del Pesebre, Campanas que Callan, Adoración de la Cruz, Aleluya Escondido, Divina Misericordia, Mañanitas, Natividad de María e Fieles Difuntos, entre outras.

## Revisão doutrinária humana recomendada

Nenhum destes trechos tem erro conhecido. São simplificações para crianças ou pontos em que o costume varia por país, e vale um padre ou catequista experiente olhar.

| Bônus | Onde | Por que revisar |
|---|---|---|
| 2 | El Rico y Lázaro (21) | O destino do rico foi contado como «lejos de Dios y de esa alegría», sem imagens de tormento. |
| 2 | La Red de Pesca (8) e El Trigo y la Cizaña (5) | O juízo final foi suavizado («Dios respeta lo que cada uno elige»). |
| 2 | El Siervo que No Perdonó (26) | O final foi abrandado: o rei pede que pague a dívida, sem mencionar os carrascos. |
| 2 | Las Diez Jóvenes (27) e Los Talentos (28) | A porta fechada e o talento tirado foram mantidos, com explicação esperançosa. |
| 2 | Los Dos Deudores (30) | A mulher pecadora é apresentada com discrição, sem detalhar o pecado. |
| 2 | La Lámpara (14) | A interpretação («Jesús es la luz… compartirla») é catequética e vai além do texto curto de Marcos. |
| 3 | Inmaculada, Toda Limpia | A definição do dogma foi simplificada («toda limpia, sin pecado, desde el primer momento de su vida»). |
| 3 | María Sube al Cielo | A Assunção «en cuerpo y alma» foi explicada para crianças. |
| 3 | Jesús, en Ti Confío | O significado dos raios da imagem da Divina Misericórdia foi simplificado («el amor que sale del corazón de Jesús»). |
| 3 | Recordamos a los que Partieron | Oração pelos defuntos com crianças: tema delicado, confira o tom para o seu grupo. |
| 3 | Viernes de Ayuno Alegre | Ayuno para adultos e abstinência a partir dos 14 anos; a ficha propõe às crianças só um oferecimento voluntário. Confira as normas da sua conferência episcopal. |
| 3 | Las Campanas Callan | O costume (matraca, sinos calados de Quinta a Sábado Santo) varia por país. |
| 3 | El Árbol de Jesé | A seleção de antepassados e símbolos é tradicional, não exaustiva. |
| 3 | Calendario 2027 | Epifania, Ascensão e Corpus podem ser transferidos para o domingo conforme o país (a página avisa). |
| 3 | Cuatro Velas / Isaías 9, 1 | A numeração do versículo varia entre Bíblias (9, 1 ou 9, 2). |
| 4 | Acto de Contrición | É uma versão infantil, não a fórmula oficial; o texto avisa que a paróquia pode usar outra. |
| 4 | Ave María, Ángel de la Guarda, Bendición de los Alimentos | Existem variantes regionais na América Latina; foram usadas as mais comuns. |
| 4 | Credo de los Apóstoles | Texto tradicional completo; confira com a versão usada na sua diocese. |
| 1 | Semana 8 (Reconciliação) e Semana 9 (Batismo) | As notas para a catequista falam de crianças com medo da confissão e de crianças não batizadas. |
| 1 | Semana 11 (Eucaristia) | A linguagem sobre a presença real («en la Eucaristía Jesús está de verdad») foi simplificada. |

## Como colocar as ilustrações

1. Faça ou encomende as imagens listadas em `ILUSTRACOES_NECESSARIAS.md`.
2. Salve-as em `assets/illustrations/bonos/` com o nome exato (por exemplo, `bono1_capa.png`).
3. Rode o build de novo:

```bash
NODE_PATH=$(npm root -g) python3 scripts/build_bonos.py        # os 4 bônus
NODE_PATH=$(npm root -g) python3 scripts/build_bonos.py 3      # só o Bono 3
```

Imagem presente entra no layout; imagem ausente faz o espaço sumir. Não é preciso mudar nenhum código.

## Para editar o conteúdo

| Bônus | Arquivo-fonte | Depois de editar |
|---|---|---|
| 1 | `content/bonos/bono_1.json` | build |
| 2 | `content/bonos/src/bono_2*.txt` | `python3 scripts/bono2_txt2json.py` e depois o build |
| 3 | `content/bonos/src/bono_3*.txt` | `python3 scripts/bonos_txt2json.py` e depois o build |
| 4 | `content/bonos/bono_4.json` | build |
| Cartas, «cómo usar» e páginas finais | `content/bonos/frente.json` | build |

Antes de gerar a versão final, rode sempre `python3 scripts/validate_bonos.py`.
