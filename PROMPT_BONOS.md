# PROJETO: Catequesis Viva — 4 Bônus

> Especificação dos 4 bônus (PDFs separados), na mesma pasta do produto principal (510 dinâmicas).

## 1. Contexto

Criar os **4 bônus**, cada um em um **PDF separado**, com a **mesma identidade visual** do principal. Reaproveitar templates, paleta, fontes, estilos de ficha e ícones existentes.

### Regras gerais
- **Idioma:** espanhol neutro latino-americano ("tú").
- **Público:** crianças, foco 7–8 anos (Primeira Comunhão). Quem usa: catequista, mãe ou professora.
- **Doutrina:** católica, fiel ao Catecismo. Na dúvida, simplificar.
- **Bíblia:** referência + paráfrase infantil própria. Nada de texto literal de traduções.
- **Formato:** Carta (8.5 × 11 in), para imprimir em casa.

### Ilustrações: NÃO FAZER
- Usar só tipografia, cores da paleta, formas simples e os ícones de `assets/icons/`.
- Capas e divisórias têm espaço reservado que carrega `assets/illustrations/bonos/<nome>.png` se existir; se não existir, o espaço some e o layout continua bonito. Nunca caixa vazia nem "imagen aquí".
- Gerar `ILUSTRACOES_NECESSARIAS.md` (arquivo, onde aparece, proporção, sugestão de desenho).

## 2. Capas (uma por bônus)
Fundo bege `#F3E9DC` com formas decorativas; selo "BONO N"; título (Fredoka) e subtítulo (Nunito); espaço para ilustração; rodapé "Catequesis Viva · +500 Dinámicas para Niños".

| Bônus | Título | Subtítulo | Cor | Imagem |
|---|---|---|---|---|
| 1 | Ruta de Encuentros: 12 Semanas | Tu catequesis planificada, semana a semana | Sálvia `#8FAE8B` | `bono1_capa.png` |
| 2 | 30 Parábolas para Niños | Las historias de Jesús contadas para los más pequeños | Céu `#8DB8D6` | `bono2_capa.png` |
| 3 | Dinámicas para Fechas Litúrgicas | Adviento, Navidad, Cuaresma, Pascua y más | Terracota `#D9896C` | `bono3_capa.png` |
| 4 | Guía de Oración para Cada Encuentro | Enseña a los niños a hablar con Dios | Lavanda `#A99BC9` | `bono4_capa.png` |

## 3. Conteúdo
Estrutura de cada PDF: Capa → Bienvenida (1 pág.) → Cómo usar (1 pág.) → Índice clicável → Conteúdo → Página final (oração + "Mis notas"). Conteúdo em `content/bonos/bono_N.json`.

### BONO 1: Ruta de Encuentros: 12 Semanas
Trimestre planejado usando dinâmicas reais do produto principal. Semanas: 1 Bienvenidos: Dios nos ama · 2 Dios creó todo con amor · 3 La Biblia: la carta de Dios · 4 Jesús nace entre nosotros · 5 Jesús, nuestro amigo: sus milagros · 6 Aprendemos a orar · 7 El mandamiento del amor · 8 Dios siempre nos perdona (Reconciliación) · 9 El Bautismo: somos hijos de Dios · 10 La Misa: la fiesta de la familia de Dios · 11 La Última Cena y la Eucaristía · 12 ¡Jesús vive en mí! (encerramento).
Cada semana = 2 páginas: tema, objetivo, referência + paráfrase; roteiro de 60 min (Bienvenida y oración inicial 5 → Rompehielos 10 → Dinámica central 25 → Reflexión y conversación 10 → Cierre y oración 10) indicando dinâmica do principal por ID, título e página (só IDs reais, tema coerente); checklist de materiais; "Compromiso para la semana"; "Nota para la catequista".
Extras: visão geral das 12 semanas (1 pág., tabela) + 2 páginas de planejador em branco.

### BONO 2: 30 Parábolas para Niños
Cada parábola = 2 páginas: título + referência; história recontada (250–350 palavras); "¿Qué nos enseña Jesús?" (2–3 frases); 3 perguntas; atividade rápida (5–10 min, materiais de casa); oração curta. Temas pesados contados de forma suave e esperançosa.
Lista: El Sembrador (Mt 13,1-9) · La Semilla que Crece Sola (Mc 4,26-29) · El Grano de Mostaza (Mt 13,31-32) · La Levadura (Mt 13,33) · El Trigo y la Cizaña (Mt 13,24-30) · El Tesoro Escondido (Mt 13,44) · La Perla Preciosa (Mt 13,45-46) · La Red de Pesca (Mt 13,47-50) · La Oveja Perdida (Lc 15,4-7) · La Moneda Perdida (Lc 15,8-10) · El Hijo Pródigo (Lc 15,11-32) · El Buen Samaritano (Lc 10,25-37) · La Casa sobre la Roca (Mt 7,24-27) · La Lámpara (Mc 4,21-23) · El Amigo que Pide de Noche (Lc 11,5-8) · El Rico Insensato (Lc 12,16-21) · Los Siervos Vigilantes (Lc 12,35-38) · La Higuera sin Frutos (Lc 13,6-9) · Los Primeros Puestos (Lc 14,7-11) · El Gran Banquete (Lc 14,15-24) · El Rico y Lázaro (Lc 16,19-31) · La Viuda que No se Rindió (Lc 18,1-8) · El Fariseo y el Publicano (Lc 18,9-14) · Los Trabajadores de la Viña (Mt 20,1-16) · Los Dos Hijos (Mt 21,28-32) · El Siervo que No Perdonó (Mt 18,23-35) · Las Diez Jóvenes y sus Lámparas (Mt 25,1-13) · Los Talentos (Mt 25,14-30) · El Buen Pastor (Jn 10,11-16) · Los Dos Deudores (Lc 7,41-43)

### BONO 3: Dinámicas para Fechas Litúrgicas
60 dinâmicas no mesmo formato de ficha do principal. Abertura: "¿Qué es el Año Litúrgico?" (tempos e cores, diagrama circular com formas) + "Calendario 2027" (datas móveis por algoritmo, ex. `dateutil.easter`).
Seções: Adviento 8 · Navidad 8 · Epifanía/Reyes 4 · Miércoles de Ceniza y Cuaresma 8 · Domingo de Ramos y Semana Santa 8 · Pascua 6 · Pentecostés 4 · Corpus Christi 3 · Fiestas de María 5 · Todos los Santos 3 · Cristo Rey 3 = 60. Cada seção abre com divisória na cor litúrgica. Não repetir nem quase repetir títulos do principal.

### BONO 4: Guía de Oración para Cada Encuentro
1. Por qué rezar con los niños (1 pág.) + Cómo armar un rincón de oración (1 pág., vela de LED).
2. Oraciones básicas (versões tradicionais LATAM): Señal de la Cruz · Padre Nuestro · Ave María · Gloria · Ángel de la Guarda · Credo de los Apóstoles · Acto de Contrición (infantil) · Bendición de los Alimentos — cada uma com explicação curta e gesto.
3. Oraciones para cada encuentro: para os 11 módulos, 2 de abertura + 2 de encerramento (44).
4. 10 formas creativas de orar (gestos, eco, cinco dedos, gratidão com bola, silêncio guiado, pedidos com velas de LED, cantada, com desenho, caixinha de intenções, em duplas), com passo a passo.
5. Momentos especiales: cumpleaños, alguien enfermo, la familia, antes de la Primera Comunión, después de comulgar, antes de dormir, al empezar las vacaciones, oración de la catequista.
6. Tarjetas recortables: 2 páginas, 8 cartões por página, linha de corte tracejada.

## 4. Ordem de execução
1. Ler o projeto e listar o reaproveitamento.
2. Amostra: 4 capas + 2 páginas de cada bônus (Semana 1, El Hijo Pródigo, ficha de Adviento, Padre Nuestro). **Parar e esperar aprovação.**
3. Gerar o conteúdo em JSON, em lotes.
4. Validação (`scripts/validate_bonos.py`): B1 12 semanas, IDs existem e páginas batem; B2 30 parábolas, campos completos, 250–350 palavras; B3 60 dinâmicas, contagem por seção, sem títulos repetidos (nem com o principal), datas 2027 calculadas; B4 44 orações de encontro, 8 básicas, 10 formas, cartões completos; nenhuma palavra em português.
5. Build dos 4 PDFs (fontes embutidas, índice clicável, < 30 MB cada).
6. Revisão visual: capa + 3 páginas aleatórias de cada PDF.
7. Entrega em `output/bonos/`: `Bono1_Ruta_de_Encuentros_12_Semanas.pdf`, `Bono2_30_Parabolas_para_Ninos.pdf`, `Bono3_Dinamicas_Fechas_Liturgicas.pdf`, `Bono4_Guia_de_Oracion.pdf`, `ILUSTRACOES_NECESSARIAS.md`, `relatorio_bonos.md` (contagens + trechos para revisão doutrinária humana). Explicar que basta rodar o build de novo depois de colocar as ilustrações.
