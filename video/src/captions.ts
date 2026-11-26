// Legendas: [início, fim, texto]. Trechos entre *asteriscos* são palavras-chave (ganham fundo colorido).
// 4º item opcional: início (em segundos) de cada grupo de palavras, tirado da narração
export type Cap = [number, number, string, number[]?];
export type Lang = 'es' | 'pt';

const HOOK_A: Record<Lang, Cap[]> = {
  es: [
    [3, 30, '*CATEQUISTA,*'],
    [30, 58, '¿LLEGAS AL ENCUENTRO'],
    [58, 74, 'SIN SABER'],
    [74, 90, '*QUÉ DINÁMICA* HACER?'],
    [92, 134, 'IMPROVISAR CADA SEMANA'],
    [134, 172, '*CANSA…*'],
    [174, 238, 'Y LOS NIÑOS *LO NOTAN.*'],
  ],
  pt: [
    [3, 30, '*CATEQUISTA,*'],
    [30, 58, 'CHEGA NO ENCONTRO'],
    [58, 74, 'SEM SABER'],
    [74, 90, '*QUAL DINÂMICA* FAZER?'],
    [92, 134, 'IMPROVISAR TODA SEMANA'],
    [134, 172, '*CANSA…*'],
    [174, 238, 'E AS CRIANÇAS *PERCEBEM.*'],
  ],
};
const HOOK_B: Record<Lang, Cap[]> = {
  es: [
    [3, 34, 'HICE ESTA DINÁMICA'],
    [34, 54, 'EN CATEQUESIS'],
    [54, 72, 'Y *NINGÚN NIÑO*'],
    [72, 92, '*SE DISTRAJO.*'],
    [96, 140, 'Y ES SOLO *UNA*'],
    [140, 190, 'DE LAS *+500*'],
    [190, 238, 'DE CATEQUESIS VIVA.'],
  ],
  pt: [
    [3, 34, 'FIZ ESSA DINÂMICA'],
    [34, 54, 'NA CATEQUESE'],
    [54, 72, 'E *NENHUMA CRIANÇA*'],
    [72, 92, '*SE DISTRAIU.*'],
    [96, 140, 'E ELA É SÓ *UMA*'],
    [140, 190, 'DAS *+500*'],
    [190, 238, 'DO CATEQUESE VIVA.'],
  ],
};
const BODY: Record<Lang, Cap[]> = {
  es: [
    [242, 286, 'EN CATEQUESIS VIVA'],
    [286, 314, 'TIENES *+500 DINÁMICAS*'],
    [314, 336, '*LISTAS,*'],
    [336, 400, 'ORGANIZADAS POR TEMA,'],
    [404, 436, 'CON *OBJETIVO,*'],
    [436, 464, '*MATERIALES*'],
    [464, 510, 'Y *PASO A PASO.*'],
    [514, 560, 'LA LEES EN *2 MINUTOS,*'],
    [560, 608, 'USAS LO QUE TIENES *EN CASA*'],
    [608, 630, 'Y VES A TU GRUPO'],
    [630, 660, '*PARTICIPAR* *DE VERDAD.*'],
    [663, 686, 'TODO POR'],
    [686, 718, '*MENOS QUE UN CAFÉ,*'],
    [718, 780, 'Y CON *4 BONOS* DE REGALO.'],
    [783, 806, 'TOCA EN'],
    [806, 840, '*“MÁS INFORMACIÓN”*'],
    [840, 898, 'Y *ASEGURA EL TUYO.*'],
  ],
  pt: [
    [242, 286, 'NO CATEQUESE VIVA'],
    [286, 314, 'SÃO *+500 DINÂMICAS*'],
    [314, 336, '*PRONTAS,*'],
    [336, 400, 'ORGANIZADAS POR TEMA,'],
    [404, 436, 'COM *OBJETIVO,*'],
    [436, 464, '*MATERIAIS*'],
    [464, 510, 'E *PASSO A PASSO.*'],
    [514, 560, 'VOCÊ LÊ EM *2 MINUTOS,*'],
    [560, 608, 'USA O QUE TEM *EM CASA*'],
    [608, 630, 'E VÊ A TURMA'],
    [630, 660, '*PARTICIPAR* *DE VERDADE.*'],
    [663, 686, 'TUDO POR'],
    [686, 718, '*MENOS QUE UM LANCHE,*'],
    [718, 742, 'E COM O PACOTE DE'],
    [742, 764, '*ADVENTO E NATAL*'],
    [764, 780, 'DE PRESENTE.'],
    [783, 806, 'TOQUE EM'],
    [806, 840, '*“SAIBA MAIS”*'],
    [840, 898, 'E *GARANTA O SEU.*'],
  ],
};

// Versão B narrada (voz em public/audio/voz_B_es.mp3): textos e tempos seguem a fala, palavra por palavra
const s = (x: number) => Math.round(x * 30);
const V = (a: number, b: number, text: string, starts: number[]): Cap => [s(a), s(b), text, starts];
export const VOICE_B_ES: Cap[] = [
  V(0.0, 1.14, 'HICE ESTA DINÁMICA', [0.0, 0.36, 0.64]),
  V(1.14, 2.5, 'EN CATEQUESIS', [1.14, 1.72]),
  V(2.5, 3.4, 'Y *NINGÚN NIÑO*', [2.5, 2.9]),
  V(3.4, 4.08, '*SE DISTRAJO.*', [3.4]),
  V(4.08, 5.44, 'Y ES SOLO *UNA*', [4.08, 4.68, 4.88, 5.1]),
  V(5.44, 6.72, 'DE LAS *+500*', [5.44, 5.88, 6.02]),
  V(6.72, 8.86, 'DE CATEQUESIS VIVA,', [6.72, 7.52, 8.18]),
  V(8.86, 9.7, 'TODAS *ORGANIZADAS*', [8.86, 9.14]),
  V(9.7, 10.48, 'POR TEMA:', [9.7, 9.92]),
  V(10.48, 11.48, '*JESÚS,*', [10.48]),
  V(11.48, 12.56, '*SACRAMENTOS,*', [11.48]),
  V(12.56, 13.52, '*ORACIÓN,*', [12.56]),
  V(13.52, 14.48, 'CON *OBJETIVO,*', [13.52, 13.6]),
  V(14.48, 15.24, '*MATERIALES*', [14.48]),
  V(15.24, 16.76, 'Y *PASO A PASO.*', [15.24, 15.56]),
  V(16.76, 18.12, 'LA LEES EN *2 MINUTOS,*', [16.76, 16.86, 17.08, 17.2]),
  V(18.12, 19.18, 'USAS LO QUE TIENES *EN CASA*', [18.12, 18.38, 18.5, 18.6, 18.8]),
  V(19.18, 20.1, 'Y LA APLICAS', [19.18, 19.64, 19.74]),
  V(20.1, 21.1, '*EL MISMO DÍA,*', [20.1]),
  V(21.1, 22.3, 'POR SOLO *5 DÓLARES*', [21.1, 21.34, 21.58]),
  V(22.3, 23.8, 'Y CON *4 BONOS*', [22.3, 23.02, 23.2]),
  V(23.8, 24.58, 'DE REGALO,', [23.8, 23.9]),
  V(24.58, 25.84, 'INCLUYENDO DINÁMICAS PARA', [24.58, 25.18, 25.64]),
  V(25.84, 27.32, '*ADVIENTO Y NAVIDAD.*', [25.84]),
  V(27.32, 27.76, 'TOCA EN', [27.32, 27.66]),
  V(27.76, 28.42, '*“MÁS INFORMACIÓN”*', [27.76]),
  V(28.42, 30.0, 'Y *ASEGURA EL TUYO.*', [28.42, 28.92]),
];

export const captionsFor = (version: 'A' | 'B', lang: Lang): Cap[] =>
  version === 'B' && lang === 'es' ? VOICE_B_ES : [...(version === 'A' ? HOOK_A : HOOK_B)[lang], ...BODY[lang]];
