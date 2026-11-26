# Ilustrações necessárias — Bônus do Catequesis Viva

Salve cada imagem em `assets/illustrations/bonos/` com **exatamente** o nome indicado e gere os PDFs de novo:

```bash
NODE_PATH=$(npm root -g) python3 scripts/build_bonos.py
```

- Se a imagem existir, ela entra no layout. Se não existir, o espaço some e a página usa só tipografia e formas.
- Formato **PNG**, RGB, **no mínimo 150 dpi** no tamanho final. Fundo claro ou transparente.
- Estilo sugerido: o mesmo da capa do livro principal (traço suave, tons pastel da paleta bege, crianças de várias origens).
- Não coloque texto dentro da imagem: os títulos já estão na página.

## Capas (4)

A imagem ocupa uma janela em arco (topo arredondado) de **6,7 × 5,15 in**, cerca de **2000 × 1550 px** (proporção ≈ 4:3). Ela é recortada pelo centro, então deixe o motivo principal no meio.

| Arquivo | Onde aparece | Sugestão de desenho |
|---|---|---|
| `bono1_capa.png` | Capa do Bono 1 · Ruta de Encuentros | Crianças caminhando por uma trilha com 12 pedrinhas ou bandeirinhas; uma catequista guia com um mapa. Tons verde-sálvia. |
| `bono2_capa.png` | Capa do Bono 2 · 30 Parábolas | Jesus sentado contando uma história a um grupo de crianças; ao fundo, uma ovelha, uma semente brotando e uma lamparina. Tons azul-céu. |
| `bono3_capa.png` | Capa do Bono 3 · Fechas Litúrgicas | Círculo do ano com símbolos: coroa do Advento, estrela, cruz, sepulcro vazio, pomba. Tons terracota. |
| `bono4_capa.png` | Capa do Bono 4 · Guía de Oración | Crianças rezando de mãos postas diante de um cantinho de oração (cruz, Bíblia, vela de LED). Tons lavanda. |

## Divisórias do Bono 3 (11)

Espaço de **4 × 3,4 in**, cerca de **1200 × 1020 px** (proporção ≈ 6:5), com cantos arredondados.

| Arquivo | Seção | Sugestão de desenho |
|---|---|---|
| `bono3_adviento.png` | Adviento (cor morado) | Coroa do Advento com 3 velas roxas e 1 rosa acesa; crianças olhando com expectativa. |
| `bono3_navidad.png` | Navidad (cor blanco) | Presépio simples com Maria, José e o Menino, pastores e uma estrela; tons quentes. |
| `bono3_epifania.png` | Epifanía y Reyes Magos (cor blanco) | Os três Reis Magos seguindo uma estrela grande, com seus baús de presentes. |
| `bono3_cuaresma.png` | Miércoles de Ceniza y Cuaresma (cor morado) | Cruz simples num deserto suave, com uma plantinha brotando; crianças com a cruz de cinza na testa. |
| `bono3_semana-santa.png` | Domingo de Ramos y Semana Santa (cor rojo (y morado)) | Crianças com ramos; ao fundo, uma cruz numa colina, em tom sereno (sem cenas de dor). |
| `bono3_pascua.png` | Pascua de Resurrección (cor blanco) | Sepulcro vazio com a pedra removida, flores, sol nascendo e uma borboleta. |
| `bono3_pentecostes.png` | Pentecostés (cor rojo) | Pomba branca e pequenas chamas sobre um grupo de crianças de braços abertos. |
| `bono3_corpus.png` | Corpus Christi (cor blanco) | Ostensório dourado cercado de pétalas; crianças em procissão. |
| `bono3_maria.png` | Fiestas de María (cor blanco (o celeste)) | Nossa Senhora com o Menino, cercada de flores; estilo doce e simples. |
| `bono3_santos.png` | Todos los Santos (cor blanco) | Grupo de santos reconhecíveis (Francisco, Teresinha, Rosa de Lima, Martinho de Porres) com auréolas, sorrindo. |
| `bono3_cristo-rey.png` | Cristo Rey (cor blanco) | Jesus com coroa e manto simples, abraçando crianças de vários povos. |

**Total: 15 imagens.** Nenhuma é obrigatória: os PDFs já estão completos e prontos para vender sem elas.
