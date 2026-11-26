# Catequesis Viva — Relatório de entrega

**Arquivo final:** `output/Catequesis_Viva_500_Dinamicas.pdf`
**Tamanho:** 18.0 MB (limite: 50 MB) · **Páginas:** 542 · **Formato:** Carta (8,5 × 11 in)
**Capa escolhida:** v2 (janela em arco)

## Estrutura do PDF

| Página | Conteúdo |
|---|---|
| 1 | Capa |
| 2 | Carta de boas-vindas à catequista |
| 3 | Como usar este material (inclui roteiro de encontro de 60 min) |
| 4 | Legenda (7 tipos + 3 selos de idade) |
| 5 | Índice clicável por módulo |
| 6–13 | Índice de dinâmicas por módulo (clicável) |
| 14–534 | 11 divisórias ilustradas + 510 fichas (1 por página) |
| 535–541 | Índice rápido por tipo (clicável, ponto colorido = módulo) |
| 542 | Oração da catequista, mensagem final e «Mis dinámicas favoritas» |

## Total por módulo

| # | Módulo | Dinâmicas | Divisória na pág. |
|---|---|---|---|
| 1 | Rompehielos y Bienvenida | 40 | 14 |
| 2 | Dios Creador y la Creación | 35 | 55 |
| 3 | Historias del Antiguo Testamento | 40 | 91 |
| 4 | Jesús: Vida y Milagros | 80 | 132 |
| 5 | María y los Santos | 30 | 213 |
| 6 | Aprendiendo a Orar | 35 | 244 |
| 7 | Los Sacramentos | 90 | 280 |
| 8 | Mandamientos y Valores Cristianos | 70 | 371 |
| 9 | La Iglesia y la Misa | 30 | 442 |
| 10 | Juegos de Repaso | 30 | 473 |
| 11 | Cierres y Oración Final | 30 | 504 |
| | **Total** | **510** | |

## Total por tipo

| Tipo | Qtd | % |
|---|---|---|
| Juego | 119 | 23% |
| Manualidad | 88 | 17% |
| Reflexión | 79 | 15% |
| Oración | 69 | 14% |
| Teatro | 69 | 14% |
| Música | 51 | 10% |
| Rompehielos | 35 | 7% |

Nenhum módulo passa de 40% de um único tipo (maior concentração: 40%, no módulo 11).

## Total por idade

| Selo | Qtd | % | Alvo |
|---|---|---|---|
| Todas | 227 | 45% | ~45% |
| 5+ | 131 | 26% | ~25% |
| 7+ | 152 | 30% | ~30% |

## Validação (`python scripts/validate.py`): OK

- 510 dinâmicas, com a quantidade exata em cada módulo
- Todos os campos obrigatórios preenchidos, 3 a 6 passos, duração de 5 a 25 min (3 a 10 no módulo 11)
- Nenhum título duplicado e nenhuma dinâmica quase idêntica (comparação de títulos e de vocabulário dos passos)
- Distribuição de tipos e idades dentro do alvo
- Nenhum vazamento de português (acentos e palavras típicas)
- Nenhuma parábola nem tempo litúrgico, nem por palavra-chave nem por **referência bíblica** (o validador checa se a citação cai dentro do trecho de uma parábola)

## Checklist de qualidade

- [x] 510 dinâmicas, 1 por página, em espanhol neutro (tú, sem voseo nem vosotros)
- [x] Capa com crianças de 7–8 anos, fundo bege, selo «Ideal para Primera Comunión»
- [x] Índice, índice detalhado e índice por tipo com links internos funcionando (160 links testados nas páginas de índice, 100% corretos)
- [x] Cada módulo com divisória ilustrada e cor própria
- [x] Fontes embutidas (Fredoka e Nunito, instâncias estáticas, OFL), nada abaixo de 10 pt
- [x] Ilustrações 100% originais em SVG (crianças, ícones, divisórias)
- [x] Citações bíblicas só com referência + paráfrase infantil curta
- [x] Fundo das fichas creme claro (economia de tinta); fundo cheio só na capa e nas divisórias
- [x] Arquivo final menor que 50 MB

## Dinâmicas que merecem revisão doutrinária humana

Nenhuma traz erro conhecido. São pontos em que houve simplificação, tradição piedosa, rito encenado ou dado recente que vale confirmar com um sacerdote ou catequista experiente antes da venda.

| ID | Título | Pág. | Motivo |
|---|---|---|---|
| 02-001 | Los Siete Días en Mis Manos | p. 56 | Relato da Criação apresentado dia a dia; confirmar que a apresentação como «relato» não sugere leitura literalista. |
| 03-021 | Caín y Abel: Hermanos que se Cuidan | p. 112 | Tema de violência entre irmãos suavizado para crianças; verificar adequação. |
| 03-033 | Tobías y el Ángel Rafael | p. 124 | Livro deuterocanônico (correto na Bíblia católica); conferir a citação adaptada de Tobías 5, 17. |
| 07-058 | Del Trigo al Altar | p. 338 | Usa a fórmula do ofertório («fruto de la tierra y del trabajo del hombre»); conferir com o Missal local. |
| 04-030 | Cinco Panes y Dos Peces | p. 162 | A catequista «tira mais pães escondidos» para encenar o milagre; verificar se a encenação não banaliza o milagre. |
| 05-013 | Del Mismo Plato | p. 226 | Episódio do cão, gato e rato vem da tradição piedosa sobre San Martín de Porres (apresentado com «se dice»). |
| 05-016 | El Hermano Lobo | p. 229 | Lenda do lobo de Gubbio (Fioretti), apresentada como «antigua historia». |
| 05-015 | Francisco, Repara mi Casa | p. 228 | Episódio de São Damião vem das biografias antigas; conferir redação. |
| 05-005 | Juan Diego y la Señora del Tepeyac | p. 218 | Narrativa de Guadalupe (Nican Mopohua) simplificada; conferir detalhes e o ano 1531. |
| 05-022 | La Autopista al Cielo | p. 235 | São Carlo Acutis (canonizado em 2025); conferir título «San» e atribuição da frase. |
| 05-024 | José Gregorio, Médico de los Pobres | p. 237 | São José Gregorio Hernández (canonizado em 2025); conferir título «San» e dados biográficos. |
| 05-021 | Domingo Savio, Niño Santo | p. 234 | Lema «Antes morir que pecar»; confirmar a forma usada na sua comunidade. |
| 05-023 | Los Pastorcitos de Fátima | p. 236 | Santos Francisco e Jacinta; aparição de Fátima (aprovada) — conferir a forma de apresentar. |
| 05-014 | Rosa de Lima, Flor de América | p. 227 | Dados biográficos simplificados. |
| 06-021 | La Mano que Reza | p. 265 | Método popular dos cinco dedos para rezar; não é atribuído a ninguém no texto. |
| 06-010 | Mi Decena de Rosario | p. 254 | Explica uma dezena (Pai-Nosso, 10 Ave-Marias, Glória); conferir com a prática local. |
| 07-002 | Signos que se Ven, Gracia que No se Ve | p. 282 | Definição simplificada de sacramento (sinal visível de graça invisível). |
| 07-007 | ¿Quién Celebra el Sacramento? | p. 287 | Ministros: no Matrimônio, os noivos; na Confirmação, normalmente o bispo. Verificar a simplificação. |
| 07-023 | El Agua que Limpia | p. 303 | Pecado original explicado como «manchita»; verificar a simplificação. |
| 07-018 | Teatro de un Bautismo | p. 298 | Encenação do rito sem água real; conferir se respeita a sacralidade do rito. |
| 07-039 | Ensayo para Encontrarme con el Padre | p. 319 | Ensaio da confissão com exemplos inventados e sem fórmula de absolvição; validar com o pároco o diálogo usado localmente. |
| 07-040 | El Secreto del Confesionario | p. 320 | Sigilo sacramental explicado para crianças. |
| 07-045 | Jesús Dio el Poder de Perdonar | p. 325 | Encenação de Juan 20, 22-23 com o gesto de soprar. |
| 07-057 | Está Aquí de Verdad | p. 337 | Presença real e transubstanciação em linguagem infantil; revisão recomendada. |
| 07-060 | Ensayo: Cómo Recibir a Jesús | p. 340 | Ensaio da comunhão com círculo de papel; formas de receber (boca/mão) conforme as normas locais. |
| 07-063 | Una Hora de Espera | p. 343 | Jejum eucarístico de 1 hora, com exceção de água e remédios (CIC 919). |
| 07-066 | Comunión Espiritual | p. 346 | Oração de comunhão espiritual redigida de forma original, não oficial. |
| 07-059 | Mi Cáliz y mi Patena | p. 339 | Manualidade de objetos sagrados; o texto esclarece que são apenas lembranças. |
| 07-084 | Sellados con el Espíritu | p. 364 | Fórmula da Confirmação citada de forma parcial («Recibe por esta señal el don del Espíritu Santo»). |
| 07-085 | Visitamos a los Enfermos | p. 365 | Encenação da Unção dos enfermos com «óleo» simbólico. |
| 08-009 | Mi Cuerpo es Templo | p. 380 | 6º e 9º mandamentos e mensagem de proteção infantil; revisar sensibilidade e linguagem. |
| 08-001 | Diez Regalos para Vivir Felices | p. 372 | Mandamentos em linguagem simples; conferir com a fórmula catequética local. |
| 09-014 | El Cirio que Ilumina | p. 456 | Símbolos do círio pascal (alfa, ômega, cinco grãos). |
| 09-016 | Creo en Dios | p. 458 | Credo resumido em frases; confirmar se usam o Credo Niceno ou o dos Apóstolos. |

## Como regenerar

```bash
python scripts/txt2json.py          # content/src/*.txt -> content/modulo_XX.json
python scripts/validate.py          # validação completa
python scripts/cover_art.py && python scripts/module_art.py   # ilustrações
NODE_PATH=$(npm root -g) python scripts/build_pdf.py --full    # PDF final
```

Para editar uma dinâmica, altere o `.txt` do módulo em `content/src/` (formato compacto, documentado em `scripts/txt2json.py`) e rode os três comandos acima.
