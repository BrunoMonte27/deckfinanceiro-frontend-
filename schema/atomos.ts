/**
 * Esquema de dados — Centro Gravitacional de Comunicação
 * ======================================================
 *
 * Contrato TypeScript da Memória Gravitacional Viva. Alinhado ao runtime
 * que já existe: nodes/edges/wadj do build gravitacional, a linha do
 * cooccurrence.jsonl (Slice 1) e os 4 canais visuais do cosmos3d
 * (tamanho · arestas · brilho · órbita).
 *
 * Conceito ↔ código:
 *   Átomo        → node
 *   Domínio      → colônia / bucket (campo `c`)
 *   Massa        → node.massa            → canal visual: tamanho
 *   Gravidade    → edge.w (w_ij)         → canal visual: aresta quente
 *   Idade        → node.idade            → canal visual: brilho de base
 *   Atividade    → runtime (turno)       → canal visual: órbita
 *   Meiose       → Atomo com `linhagem`
 *   Playbook     → Atomo com tipo "playbook"
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. DOMÍNIOS (colônias)
// ─────────────────────────────────────────────────────────────────────────────

/** A "cor" do conhecimento. Cresce conforme o acervo; estes são os iniciais. */
export type Dominio =
  | "dados"        // métricas, padrões de engajamento, resultados medidos
  | "conteudo"     // narrativa, arcos, tom de voz, ganchos
  | "neurodesign"  // como a forma visual afeta a decisão
  | "clientes";    // quem é o público, o que move cada segmento

// ─────────────────────────────────────────────────────────────────────────────
// 2. ÁTOMO (node)
// ─────────────────────────────────────────────────────────────────────────────

/** De onde o átomo veio. Auditável por construção. */
export type Origem =
  | "observado"  // extraído de uma peça/insight real
  | "importado"  // trazido de fora (acervo, briefing)
  | "meiose";    // GERADO: fusão de dois pais (ver Linhagem)

/** Tipo do átomo. "playbook" = receita inteira cristalizada (ver §7.4 do spec). */
export type TipoAtomo = "simples" | "sintese" | "playbook";

export interface Linhagem {
  /** Os dois pais que geraram este filho por meiose. */
  pais: [AtomoId, AtomoId];
  /** Domínios dos pais — registra se foi fusão cross-domínio (preferida). */
  cross_dominio: boolean;
  /** Quando nasceu. ISO-8601. */
  nascido_em: string;
  /**
   * Por que nasceu (escopo travado §7.1):
   *  - "playbook": constelação inteira deu certo N vezes
   *  - "dupla":    dois átomos com co-uso MUITO alto (barra alta)
   */
  gatilho: "playbook" | "dupla";
}

export type AtomoId = string;

export interface Atomo {
  id: AtomoId;
  /** Nome normalizado — chave de junção com o grafo (k2idx no backend). */
  norm: string;
  dominio: Dominio;
  /** O insight em si, em uma frase. */
  conteudo: string;

  // ── Física ──────────────────────────────────────────────────────────────
  /** Quão provado/em uso (cresce com sucesso, decai sem uso). → tamanho. */
  massa: number;
  /** Turnos desde a criação. Idade alta + massa alta = âncora. → brilho. */
  idade: number;
  /** Posição no mapa 3D. Filhos de meiose nascem no ponto médio dos pais. */
  pos: [number, number, number];

  // ── Procedência ─────────────────────────────────────────────────────────
  origem: Origem;
  tipo: TipoAtomo;
  /** Presente sse e só se origem === "meiose". Tag de origem (§7.2). */
  linhagem?: Linhagem;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. GRAVIDADE (edge / w_ij)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Aresta ponderada Hebbiana. `w` cresce a cada co-uso (grav-build) e parte
 * de 1.0 no cold-start. No backend isto é `edges: [i, j, w]` + `wadj`.
 */
export interface Aresta {
  a: AtomoId;
  b: AtomoId;
  /** w_ij ∈ (0, ∞). Co-uso aprendido. → espessura/calor da aresta. */
  w: number;
  /** Quantas vezes os dois foram recuperados juntos (lastro do peso). */
  co_usos: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CONSTELAÇÃO (subgrafo coeso — saída do retrieve_constellation)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Resultado do retrieval por constelação: não top-k solto, mas um subgrafo
 * que COBRE as facetas da query (colônias distintas) E é amarrado por w_ij.
 * Espelha (docs, edges_internas) do backend.
 */
export interface Constelacao {
  /** Átomos escolhidos (top-5 ancorados por relevância, 6→18 por coesão). */
  atomos: AtomoId[];
  /** A "teia": arestas internas entre os átomos escolhidos. */
  arestas: Aresta[];
  /** Colônias cobertas — diversidade cross-domínio. */
  dominios: Dominio[];
  /**
   * Candidata a cristalizar em playbook quando entregar resultado N vezes.
   * Conta de sucessos acumulados.
   */
  sucessos: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. SLICE 1 — linha do cooccurrence.jsonl (co-uso real, por query)
// ─────────────────────────────────────────────────────────────────────────────

/** Uma linha por query que recupera docs. É o lastro que alimenta o w_ij. */
export interface CoUsoLog {
  /** ISO-8601. */
  ts: string;
  /** A query do usuário. */
  q: string;
  /** Átomos co-ativados nesta query (a fonte de cada incremento de w_ij). */
  active: Array<{
    norm: string;
    path: string;
    /** score de relevância (BM25 norm + 0.8·cosine). */
    score: number;
  }>;
  /** Se a resposta foi entregue (sinal de sucesso para massa/sucessos). */
  delivered: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. MAPA (estado completo serializável)
// ─────────────────────────────────────────────────────────────────────────────

export interface MapaGravitacional {
  atomos: Atomo[];
  arestas: Aresta[];
  /** IDs dos átomos de maior massa = o "sol" que ancora tudo (§6 do spec). */
  centro_gravitacional: AtomoId[];
  /** Versão do build (grav-build incrementa). */
  versao: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. EXEMPLO — a constelação "campanha de stories de interação"
// ─────────────────────────────────────────────────────────────────────────────

export const EXEMPLO_CONSTELACAO: { atomos: Atomo[]; arestas: Aresta[] } = {
  atomos: [
    {
      id: "a_enquete",
      norm: "enquete-dobra-resposta",
      dominio: "dados",
      conteudo: "Stories com enquete têm 2x mais resposta no nosso público",
      massa: 0.82,
      idade: 140,
      pos: [12, 3, -8],
      origem: "observado",
      tipo: "simples",
    },
    {
      id: "a_arco",
      norm: "arco-tensao-virada-alivio",
      dominio: "conteudo",
      conteudo: "Arco de storytelling: tensão → virada → alívio",
      massa: 0.74,
      idade: 210,
      pos: [9, 1, -11],
      origem: "observado",
      tipo: "simples",
    },
    {
      // FILHO de meiose: fusão cross-domínio (dados × conteúdo)
      id: "a_stories_guiados",
      norm: "stories-que-prendem-guiados-por-dados",
      dominio: "conteudo",
      conteudo: "Stories que prendem, guiados pelos dados de engajamento",
      massa: 0.58,
      idade: 30,
      pos: [10.5, 2, -9.5], // ponto médio entre os pais
      origem: "meiose",
      tipo: "sintese",
      linhagem: {
        pais: ["a_enquete", "a_arco"],
        cross_dominio: true,
        nascido_em: "2026-06-08T10:32:37Z",
        gatilho: "dupla", // co-uso MUITO alto, barra alta (§7.1)
      },
    },
  ],
  arestas: [
    { a: "a_enquete", b: "a_arco", w: 4.2, co_usos: 17 },
    { a: "a_enquete", b: "a_stories_guiados", w: 2.1, co_usos: 6 },
    { a: "a_arco", b: "a_stories_guiados", w: 2.0, co_usos: 6 },
  ],
};
