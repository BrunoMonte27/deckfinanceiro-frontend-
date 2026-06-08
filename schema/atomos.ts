/**
 * Esquema de dados — Centro Gravitacional de Comunicação
 * ======================================================
 *
 * Contrato TypeScript da memória viva. O centro é ATIVO: recebe a query,
 * emite uma onda (propagação instantânea), atrai fontes ressonantes para
 * órbita, recorta o fragmento de interesse (Gemini, em lote) e sintetiza.
 *
 * Conceito ↔ visual:
 *   tema       → cor
 *   massa      → tamanho        (densidade de conteúdo + co-uso)
 *   distância  → relevância de repouso
 *   raio órbita→ força de atração nesta query
 *   ativação   → brilho (ao vivo)
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. TEMA (a "natureza" da fonte → cor)
// ─────────────────────────────────────────────────────────────────────────────

/** Cluster temático. Cresce com o acervo; estes são os iniciais. */
export type Tema =
  | "dados"
  | "conteudo"
  | "neurodesign"
  | "clientes";

// ─────────────────────────────────────────────────────────────────────────────
// 2. ÁTOMO (a fonte / o corpo no campo)
// ─────────────────────────────────────────────────────────────────────────────

export type AtomoId = string;

export type Origem = "observado" | "importado" | "mitose" | "meiose";

export interface Linhagem {
  /** Pais. Mitose: 1 pai (cópia). Meiose: 2 pais (recombinação). */
  pais: AtomoId[];
  processo: "mitose" | "meiose";
  /** Meiose: registra se foi fusão cross-tema (preferida). */
  cross_tema?: boolean;
  nascido_em: string; // ISO-8601
}

export interface Atomo {
  id: AtomoId;
  /** Nome normalizado — chave de junção com o grafo. */
  norm: string;
  tema: Tema;
  /** O conteúdo da fonte. */
  conteudo: string;

  // ── Física ────────────────────────────────────────────────────────────────
  /**
   * massa = densidade_de_conteudo + co_uso_acumulado.
   * Monotônica (co-uso só cresce). SEM autoridade, SEM recência. → tamanho.
   */
  massa: number;
  /** Densidade de conteúdo (componente estático da massa). */
  densidade: number;
  /** Co-uso acumulado (componente dinâmico — incrementa a cada recrutamento). */
  co_uso: number;
  /** Posição 3D no campo. Só muda pelo uso (Hebbiano); nunca por decaimento. */
  pos: [number, number, number];

  // ── Procedência ───────────────────────────────────────────────────────────
  origem: Origem;
  /** Presente sse origem é "mitose" ou "meiose". */
  linhagem?: Linhagem;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. GRAVIDADE / co-uso (aresta Hebbiana → reaproximação)
// ─────────────────────────────────────────────────────────────────────────────

export interface Aresta {
  a: AtomoId;
  b: AtomoId;
  /** Peso Hebbiano: cresce quando os dois orbitam juntos. → reaproxima. */
  w: number;
  /** Quantas vezes co-orbitaram (lastro do peso). */
  co_orbitas: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. ESTADO DE UMA QUERY (o comando do centro em execução)
// ─────────────────────────────────────────────────────────────────────────────

/** Uma fonte atraída e orbitando nesta query. */
export interface Orbiter {
  atomo: AtomoId;
  /** Força de atração F = (massaᵅ·ressonânciaᵝ)/d² → raio de órbita. */
  forca: number;
  /** Sintonia semântica (embedding cosine) com a query. */
  ressonancia: number;
  /** Recorte que o centro copiou (Gemini, em lote). A fonte fica intacta. */
  fragmento: string;
}

export interface Query {
  texto: string;
  /** Embedding da query (espectro de harmônicos). */
  espectro: number[];
  /** Orçamento de atenção: só N fontes orbitam (competição). N ≈ 12-15. */
  N: number;
  /** As fontes que venceram a competição e orbitam. */
  orbita: Orbiter[];
  /** Síntese final dos fragmentos. */
  resultado?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. PARÂMETROS DA FÍSICA (os "botões", afinar com uso)
// ─────────────────────────────────────────────────────────────────────────────

export const FISICA = {
  /** Expoentes da lei híbrida F = (massaᵅ·ressonânciaᵝ)/d². */
  alpha: 1.0, // peso da massa (presença)
  beta: 1.0,  // peso da ressonância (sintonia)

  /** Orçamento de órbita (saturação / competição por atenção). */
  N_ORBITA: 14, // ~12-15

  /** Força da repulsão para fontes não-afins (carga negativa). */
  REPULSAO: 0.6,

  /** Inércia média: fração da migração Hebbiana aplicada por query. */
  ATRITO: 0.5, // 0 = move tudo (instável) · 1 = não move (rígido)

  /** Decaimento: ZERO. O campo só se move pelo uso. */
  DECAIMENTO: 0.0,
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// 6. MAPA (estado completo serializável)
// ─────────────────────────────────────────────────────────────────────────────

export interface MapaGravitacional {
  atomos: Atomo[];
  arestas: Aresta[];
  /** O "sol": fontes de maior massa que ancoram a identidade da marca. */
  centro_gravitacional: AtomoId[];
  versao: number;
}
