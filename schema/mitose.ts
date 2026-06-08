/**
 * Mitose — crescimento por CÓPIA FIEL (sem LLM)
 * =============================================
 *
 * Mitose é cópia idêntica para crescer/reparar. Decisão travada:
 *
 *   Gatilho → um átomo DISPUTADO por temas/constelações distintas ao mesmo
 *             tempo se DIVIDE. Cada cópia passa a servir um tema e pode
 *             ESPECIALIZAR com o uso (drift).
 *
 * Barata: não chama Gemini. Cresce em quantidade/alcance (a meiose cresce
 * em profundidade). Gating: precisa de co-uso real para detectar disputa.
 */

import type { Atomo, AtomoId, Tema } from "./atomos";

export const PARAMS = {
  /** Mínimo de temas distintos disputando o átomo para ele se dividir. */
  TEMAS_DISPUTA: 2,
  /** Co-uso mínimo dentro de cada tema disputante (evita divisão prematura). */
  CO_USO_POR_TEMA: 6,
} as const;

/** Quantas vezes o átomo foi recrutado por query, agrupado por tema da query. */
export type DisputaPorTema = Map<Tema, number>;

/** Decide se o átomo está sendo disputado o bastante para se dividir. */
export function deveDividir(disputa: DisputaPorTema): boolean {
  const temasFortes = [...disputa.entries()]
    .filter(([, n]) => n >= PARAMS.CO_USO_POR_TEMA);
  return temasFortes.length >= PARAMS.TEMAS_DISPUTA;
}

/**
 * Divide o átomo: uma cópia fiel por tema disputante. Cada cópia herda o
 * conteúdo intacto (cópia fiel), mas nasce ancorada no seu tema, livre para
 * especializar com o uso. A massa é repartida (não inflar o sistema).
 */
export function dividir(
  pai: Atomo,
  disputa: DisputaPorTema,
  agora: string,
): Atomo[] {
  const temas = [...disputa.entries()]
    .filter(([, n]) => n >= PARAMS.CO_USO_POR_TEMA)
    .map(([t]) => t);

  return temas.map((tema, i) => ({
    ...pai,
    id: `mitose_${pai.id}_${tema}`,
    norm: `${pai.norm}__${tema}`,
    tema, // cada cópia ancora num tema disputante
    conteudo: pai.conteudo, // cópia FIEL
    massa: pai.massa / temas.length, // reparte a massa
    co_uso: Math.round(pai.co_uso / temas.length),
    // espalha levemente em torno do pai para não sobrepor
    pos: [pai.pos[0] + i * 0.5, pai.pos[1], pai.pos[2] + i * 0.5],
    origem: "mitose",
    linhagem: {
      pais: [pai.id],
      processo: "mitose",
      nascido_em: agora,
    },
  }));
}
