# Criativos em vídeo: Catequesis Viva (30s, 9:16, sem áudio)

| Arquivo | Uso |
|---|---|
| `criativo_A_es.mp4` | Versão A (gancho de dor), legendas em espanhol: **para rodar** |
| `criativo_B_es.mp4` | Versão B (gancho de prova), legendas em espanhol: **para rodar** |
| `criativo_A_pt.mp4` | Versão A com legendas em português: **só para revisão interna** (as cenas 3D continuam em espanhol) |
| `criativo_A_es_SEM_LEGENDA.mp4`, `criativo_B_es_SEM_LEGENDA.mp4` | Mesmas cenas, sem legenda, para legendar depois no seu editor |
| `criativo_*.srt` | Legendas com os tempos exatos de cada bloco |
| `storyboard/` | Um quadro por cena |

Todos: 1080×1920, 30 fps, exatamente 30,0 s (900 quadros), H.264 `yuv420p`, **sem faixa de áudio**.

## Trocar o preço

1. Abra `video/config.json` e altere `"price"` (ex.: `"USD 9"`, `"$ 5.990 CLP"`). O texto do selo se ajusta ao tamanho.
2. Renderize de novo (passo abaixo). O selo 3D é gerado a partir desse arquivo, sem mexer no código.

No mesmo arquivo dá para trocar a palavra acima do preço (`priceLabel`) e o texto do botão (`button`).

## Renderizar de novo

Requisitos: Node 18+, ffmpeg e Chromium/Playwright.

```bash
cd video
npm install
npm run render              # A e B completos (~25 min em 4 núcleos)
node scripts/render.mjs --only=A   # só a versão A
```

Os arquivos finais vão para `output/`. Os intermediários ficam em `video/out/` (ignorados pelo git).

Outros comandos:

```bash
npm run studio                                      # pré-visualização interativa (Remotion Studio)
node scripts/stills.mjs A es ../output/storyboard 420  # um quadro específico (versão, idioma, pasta, frame)
bash scripts/qa.sh                                  # duração, áudio e quadros de checagem
```

## Onde mexer

- **Textos e tempos das legendas:** `video/src/captions.ts` (`[frame inicial, frame final, 'TEXTO']`, 30 frames = 1 s; trechos entre `*asteriscos*` ganham o destaque colorido). Os `.srt` saem desse mesmo arquivo.
- **Cenas e câmera:** `video/src/Scene3D.tsx` (a lista `CAM_A` / `CAM_B` define cada plano).
- **Ficha mostrada na cena principal:** `video/public/img/ficha_main.png` (página 353 do PDF, ficha 07-073).
