/**
 * Meiose — reprodução para APROFUNDAR (recombinação de dois pais)
 * ==============================================================
 *
 * Recombina dois átomos num filho de síntese. É onde a Gemini trabalha como
 * motor de maturação. Decisões travadas:
 *
 *   Escopo    → dois gatilhos: DUPLA alma-gêmea (co-uso muito alto) e
 *               PLAYBOOK (constelação que deu certo N vezes)
 *   Direção   → cross-tema PREFERIDA (barra menor); mesmo-tema barra maior
 *   Posição   → filho no ponto médio dos pais, com linhagem
 *   Motor     → Gemini sintetiza o conteúdo do filho
 *
 * Gating de dado real: lê co-uso (co_orbitas). No cold-start = 0 → nada
 * nasce, e isso é correto. Plugar ao grav-build quando o log tiver corpo.
 */

import type { Atomo, Aresta, AtomoId } from "./atomos";

/** Constelação coerente (saída do retrieval por subgrafo coeso). */
export interface Constelacao {
  atomos: AtomoId[];
  temas: string[];
  /** Sucessos acumulados — gatilho de cristalização em playbook. */
  sucessos: number;
}

export const PARAMS = {
  N_SUCESSOS_PLAYBOOK: 4,
  /** Barra ALTA de co-órbita para uma dupla cross-tema recombinar. */
  CO_ORBITAS_CROSS: 12,
  /** Mesmo-tema: barra ainda mais alta (direção prefere cross-tema). */
  CO_ORBITAS_MESMO: 20,
  W_MIN: 3.0,
} as const;

/** Motor de síntese — a Gemini, injetada (não acoplada). */
export type Sintetizador = (pais: Atomo[]) => Promise<string>;

function pontoMedio(ps: Atomo[]): [number, number, number] {
  const n = ps.length;
  return [
    ps.reduce((s, p) => s + p.pos[0], 0) / n,
    ps.reduce((s, p) => s + p.pos[1], 0) / n,
    ps.reduce((s, p) => s + p.pos[2], 0) / n,
  ];
}

// ── Gatilho DUPLA ────────────────────────────────────────────────────────────

export function duplaDeveRecombinar(a: Atomo, b: Atomo, e: Aresta): boolean {
  const cross = a.tema !== b.tema;
  const barra = cross ? PARAMS.CO_ORBITAS_CROSS : PARAMS.CO_ORBITAS_MESMO;
  return e.co_orbitas >= barra && e.w >= PARAMS.W_MIN;
}

export async function nascerDeDupla(
  a: Atomo,
  b: Atomo,
  sintetizar: Sintetizador,
  agora: string,
): Promise<Atomo> {
  const conteudo = await sintetizar([a, b]); // Gemini funde os dois pais
  return {
    id: `meiose_${a.id}_${b.id}`,
    norm: `sintese-${a.norm}-${b.norm}`,
    tema: a.massa >= b.massa ? a.tema : b.tema,
    conteudo,
    massa: ((a.massa + b.massa) / 2) * 0.5, // cria nasce leve
    densidade: (a.densidade + b.densidade) / 2,
    co_uso: 0,
    pos: pontoMedio([a, b]),
    origem: "meiose",
    linhagem: {
      pais: [a.id, b.id],
      processo: "meiose",
      cross_tema: a.tema !== b.tema,
      nascido_em: agora,
    },
  };
}

// ── Gatilho PLAYBOOK ─────────────────────────────────────────────────────────

export function constelacaoDeveCristalizar(c: Constelacao): boolean {
  return c.sucessos >= PARAMS.N_SUCESSOS_PLAYBOOK;
}

export async function nascerPlaybook(
  c: Constelacao,
  byId: Map<AtomoId, Atomo>,
  sintetizar: Sintetizador,
  agora: string,
): Promise<Atomo> {
  const pais = c.atomos.map((id) => byId.get(id)!).filter(Boolean);
  const conteudo = await sintetizar(pais); // Gemini empacota a receita
  return {
    id: `playbook_${c.atomos.join("_").slice(0, 40)}`,
    norm: `playbook-${c.temas.join("-")}`,
    tema: pais[0].tema,
    conteudo,
    massa: 0.9, // playbook nasce âncora: receita comprovada
    densidade: 0.9,
    co_uso: 0,
    pos: pontoMedio(pais),
    origem: "meiose",
    linhagem: {
      pais: c.atomos,
      processo: "meiose",
      cross_tema: c.temas.length > 1,
      nascido_em: agora,
    },
  };
}

// ── Passada de meiose (roda no grav-build; cross-tema primeiro) ───────────────

export async function passadaDeMeiose(
  atomos: Atomo[],
  arestas: Aresta[],
  constelacoes: Constelacao[],
  sintetizar: Sintetizador,
  agora: string,
): Promise<Atomo[]> {
  const byId = new Map(atomos.map((a) => [a.id, a]));
  const jaExiste = new Set(
    atomos.filter((a) => a.linhagem?.processo === "meiose")
      .map((a) => a.linhagem!.pais.slice().sort().join("|")),
  );
  const novos: Atomo[] = [];

  // Direção: cross-tema primeiro
  const ordenadas = [...arestas].sort((x, y) => {
    const cx = byId.get(x.a)?.tema !== byId.get(x.b)?.tema ? 1 : 0;
    const cy = byId.get(y.a)?.tema !== byId.get(y.b)?.tema ? 1 : 0;
    return cy - cx;
  });

  for (const e of ordenadas) {
    const a = byId.get(e.a), b = byId.get(e.b);
    if (!a || !b) continue;
    const chave = [a.id, b.id].sort().join("|");
    if (jaExiste.has(chave)) continue;
    if (duplaDeveRecombinar(a, b, e)) {
      novos.push(await nascerDeDupla(a, b, sintetizar, agora));
      jaExiste.add(chave);
    }
  }

  for (const c of constelacoes) {
    if (constelacaoDeveCristalizar(c)) {
      novos.push(await nascerPlaybook(c, byId, sintetizar, agora));
    }
  }

  return novos;
}
