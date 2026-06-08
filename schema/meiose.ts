/**
 * Meiose — lógica de reprodução do conhecimento
 * =============================================
 *
 * Implementação de referência (pseudo-código tipado) da meiose, com as 3
 * decisões travadas codificadas:
 *
 *   §7.1 Escopo    → dois gatilhos: PLAYBOOK (constelação, N sucessos) e
 *                    DUPLA (par alma-gêmea, barra de co-uso ALTA)
 *   §7.2 Posição   → filho nasce no ponto médio dos pais, com linhagem
 *   §7.3 Direção   → fusão cross-domínio é PREFERIDA (barra menor)
 *
 * IMPORTANTE — gating de dado real: a meiose lê `co_usos` (lastro do
 * cooccurrence.jsonl). No cold-start `co_usos = 0`, então NADA nasce — e
 * isso está correto. A função só passa a gerar filhos quando o log tiver
 * corpo. Plugar ao grav-build quando isso acontecer.
 */

import type { Atomo, Aresta, AtomoId, Constelacao, Dominio, Linhagem } from "./atomos";

// ─────────────────────────────────────────────────────────────────────────────
// Parâmetros (os "botões") — afinar com dado real, não no escuro
// ─────────────────────────────────────────────────────────────────────────────

export const PARAMS = {
  /** N sucessos para uma constelação cristalizar em playbook. */
  N_SUCESSOS_PLAYBOOK: 4,

  /** Barra ALTA de co-uso para uma dupla virar síntese (§7.1, controlado). */
  CO_USOS_DUPLA: 12,
  /** Peso w_ij mínimo para a dupla (reforça que andam MUITO juntos). */
  W_DUPLA: 3.0,

  /**
   * Direção (§7.3): fusão cross-domínio é preferida → barra menor.
   * Mesmo-domínio precisa de co-uso ainda mais alto para nascer.
   */
  CO_USOS_MESMO_DOMINIO: 20,

  /** Não regerar um filho que já existe (anti-duplicata por linhagem). */
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// 1. GATILHO "DUPLA" — dois átomos alma-gêmea
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Decide se uma aresta (par) deve gerar um filho de síntese.
 * Aplica a barra alta, com a direção cross-domínio preferida.
 */
export function duplaDeveGerar(
  a: Atomo,
  b: Atomo,
  aresta: Aresta,
): boolean {
  const cross = a.dominio !== b.dominio;
  // Direção (§7.3): cross-domínio tem barra menor; mesmo-domínio, barra maior.
  const barraCoUso = cross
    ? PARAMS.CO_USOS_DUPLA
    : PARAMS.CO_USOS_MESMO_DOMINIO;

  return aresta.co_usos >= barraCoUso && aresta.w >= PARAMS.W_DUPLA;
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. GATILHO "PLAYBOOK" — constelação inteira comprovada
// ─────────────────────────────────────────────────────────────────────────────

export function constelacaoDeveCristalizar(c: Constelacao): boolean {
  return c.sucessos >= PARAMS.N_SUCESSOS_PLAYBOOK;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. NASCIMENTO — cria o filho (posição + linhagem, §7.2)
// ─────────────────────────────────────────────────────────────────────────────

function pontoMedio(
  pa: [number, number, number],
  pb: [number, number, number],
): [number, number, number] {
  return [(pa[0] + pb[0]) / 2, (pa[1] + pb[1]) / 2, (pa[2] + pb[2]) / 2];
}

/** Domínio do filho: se cross, herda o domínio do pai de MAIOR massa. */
function dominioDoFilho(a: Atomo, b: Atomo): Dominio {
  return a.massa >= b.massa ? a.dominio : b.dominio;
}

export function nascerDeDupla(
  a: Atomo,
  b: Atomo,
  conteudoSintese: string, // gerado pelo modelo a partir dos dois pais
  agora: string,           // ISO-8601
): Atomo {
  const linhagem: Linhagem = {
    pais: [a.id, b.id],
    cross_dominio: a.dominio !== b.dominio,
    nascido_em: agora,
    gatilho: "dupla",
  };
  return {
    id: `meiose_${a.id}_${b.id}`,
    norm: `sintese-${a.norm}-${b.norm}`,
    dominio: dominioDoFilho(a, b),
    conteudo: conteudoSintese,
    // massa inicial moderada: herda metade da média dos pais (ainda é cria)
    massa: ((a.massa + b.massa) / 2) * 0.5,
    idade: 0,
    pos: pontoMedio(a.pos, b.pos), // §7.2: entre os pais
    origem: "meiose",
    tipo: "sintese",
    linhagem,
  };
}

export function nascerPlaybook(
  c: Constelacao,
  atomosById: Map<AtomoId, Atomo>,
  conteudoReceita: string,
  agora: string,
): Atomo {
  const pais = c.atomos.map((id) => atomosById.get(id)!).filter(Boolean);
  // centróide da constelação inteira
  const cx = pais.reduce((s, p) => s + p.pos[0], 0) / pais.length;
  const cy = pais.reduce((s, p) => s + p.pos[1], 0) / pais.length;
  const cz = pais.reduce((s, p) => s + p.pos[2], 0) / pais.length;
  return {
    id: `playbook_${c.atomos.join("_").slice(0, 40)}`,
    norm: `playbook-${c.dominios.join("-")}`,
    dominio: dominioDoFilho(pais[0], pais[1] ?? pais[0]),
    conteudo: conteudoReceita,
    massa: 0.9, // playbook nasce âncora: é receita comprovada
    idade: 0,
    pos: [cx, cy, cz],
    origem: "meiose",
    tipo: "playbook",
    linhagem: {
      pais: [c.atomos[0], c.atomos[c.atomos.length - 1]],
      cross_dominio: c.dominios.length > 1,
      nascido_em: agora,
      gatilho: "playbook",
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. PASSADA DE MEIOSE — roda no grav-build, sobre o grafo já construído
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Varre o grafo e gera os filhos elegíveis. Anti-duplicata por linhagem.
 * No cold-start retorna [] (co_usos = 0) — correto.
 */
export function passadaDeMeiose(
  atomos: Atomo[],
  arestas: Aresta[],
  constelacoes: Constelacao[],
  agora: string,
  sintetizar: (a: Atomo, b: Atomo) => string,        // chama o modelo
  sintetizarReceita: (c: Constelacao) => string,      // chama o modelo
): Atomo[] {
  const byId = new Map(atomos.map((a) => [a.id, a]));
  const jaExiste = new Set(
    atomos
      .filter((a) => a.linhagem)
      .map((a) => a.linhagem!.pais.slice().sort().join("|")),
  );
  const novos: Atomo[] = [];

  // Direção (§7.3): cross-domínio primeiro
  const ordenadas = [...arestas].sort((x, y) => {
    const cx = byId.get(x.a)?.dominio !== byId.get(x.b)?.dominio ? 1 : 0;
    const cy = byId.get(y.a)?.dominio !== byId.get(y.b)?.dominio ? 1 : 0;
    return cy - cx;
  });

  for (const e of ordenadas) {
    const a = byId.get(e.a), b = byId.get(e.b);
    if (!a || !b) continue;
    const chave = [a.id, b.id].sort().join("|");
    if (jaExiste.has(chave)) continue;
    if (duplaDeveGerar(a, b, e)) {
      novos.push(nascerDeDupla(a, b, sintetizar(a, b), agora));
      jaExiste.add(chave);
    }
  }

  for (const c of constelacoes) {
    if (constelacaoDeveCristalizar(c)) {
      novos.push(nascerPlaybook(c, byId, sintetizarReceita(c), agora));
    }
  }

  return novos;
}
