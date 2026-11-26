// Legendas: [início, fim, texto]. Trechos entre *asteriscos* são palavras-chave (ganham fundo colorido).
export type Cap = [number, number, string];
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
    [718, 742, 'Y CON EL PACK DE'],
    [742, 764, '*ADVIENTO Y NAVIDAD*'],
    [764, 780, 'DE REGALO.'],
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

export const captionsFor = (version: 'A' | 'B', lang: Lang): Cap[] =>
  [...(version === 'A' ? HOOK_A : HOOK_B)[lang], ...BODY[lang]];
