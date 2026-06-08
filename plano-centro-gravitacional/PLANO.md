# PLANO-MESTRE — Centro Gravitacional Vivo

> Escrito sobre o sistema **real** (não a metáfora). Alvo: copiar para
> `~/Documents/Teste-HandsFree/`. Acompanha `bru_config.json` — o contrato de
> botões que `build_graph.py` e `bru_retrieve.py` leem.

---

## 0. A visão (do seu 1º comando até a meiose/mitose)

Uma **query** aciona o **centro**. O centro **emite uma onda** que varre a
memória, **puxa** os núcleos ressonantes para **órbita**, **extrai o
fragmento** de cada um e **sintetiza** o resultado. Os núcleos voltam ao
campo **reposicionados** pelo que foi usado junto. Com o tempo, o sistema
**cresce** (mitose) e **se aprofunda** (meiose).

**O sistema já encarna ~70% disso.** O ciclo `retrieval_hit → activate →
glow/blaze → órbita → síntese → done` existe e é real (não mock). O que falta
é (a) tornar a **massa visível**, (b) a massa **entrar na atração**, e (c) a
meiose/mitose **criarem** (hoje só detectam).

## Regra-mãe (inegociável)

1. **Só os ativos se mexem e voltam.** O campo é estático fora da query.
2. **O campo só muda pelo uso** — sem decaimento por tempo (`decay=0`).
3. **Dado real antes de inteligência.** Não construir meiose-criação contra
   `cooccurrence.jsonl` com 6 linhas. Lastro primeiro.
4. **Runtime $0.** Síntese e meiose = Claude OAuth Max. **Nunca API paga.**

---

## 1. Mapa modelo ↔ sistema real (a verdade de hoje)

| Conceito sculpido | Como existe HOJE | Gap |
|---|---|---|
| Átomo | 1 `.md` do vault = 1 node (7.336 nodes, 45.205 arestas) | — |
| Tema/cor | `col` (29 colônias, do frontmatter) | — |
| Massa/tamanho | `m`=mass_real criado esta sessão; tamanho ainda ∝√grau | **wire m→tamanho** |
| Posição | force-directed (spring 3D seed=42) + warp r^0.62 | — (viz-only) |
| Ressonância | BM25 (k1=1.5,b=.75, ×4·idf nome) + semântico (MiniLM-384) | — |
| Atração híbrida | retrieval **não** usa massa nem distância | **massa entra no score** |
| Onda/propagação | SSE `retrieval_hit` varre e acende a região | — |
| Órbita | `aOrbit`/`aActive` ligados ao retrieval real | ajustar **N=14** |
| Brilho=ativação | glow+blaze no `retrieval_hit` | — ✅ já vivo |
| Fragmento | `_snippet()` ~260 chars (mecânico) | — ✅ |
| Síntese | Claude Code CLI (Opus, OAuth $0) | — |
| Meiose-detecção | âncora `pb` (ponte cross-colônia N×) + halo | — ✅ |
| Meiose-criação | **só candidatos, não grava filho** | **construir** |
| Mitose | inexistente | **construir (100% nova)** |
| Sucesso de constelação | `delivered` = só o top hit | **enriquecer** |

---

## 2. Três reconciliações honestas (trade-offs que mudei vendo o real)

**R1 — Distância NÃO é euclidiana.** No sistema, posição 3D é viz desacoplada
do score. Bolar `F∝1/d²` com `d` euclidiano seria física fake que não move
nada. **Decisão:** a ressonância JÁ é o score de retrieval; a atração vira
`F = score · massaᵅ` (multiplicativa, fiel à intenção híbrida). O visual
(raio de órbita, brilho) espelha essa força — não um `d` decorativo.

**R2 — Fragmento e síntese ficam em Claude OAuth, não Gemini.** O sistema já
recorta via `_snippet` e sintetiza com Claude a **$0**. Plugar Gemini no
caminho quente quebraria o $0-natural e somaria dependência. **Decisão:**
meiose-criação também usa Claude OAuth (ocasional, fora do hot path). Gemini
permanece só em imagens. *(Reverte a escolha anterior de Gemini-fragmento.)*

**R3 — Massa sem decaimento.** O sistema tem `lu`/decay; a decisão sculpida é
`decay=0` (campo só move pelo uso). Fica no config como botão — desligado.

---

## 3. Modelagem formal do ciclo (Pilar I)

```
Entrada: q → ressonância r_i = score_retrieval(q, a_i)   [BM25+sem, já existe]
Massa:   m_i = w_d·densidade_i + w_c·couso_i              [build, normalizado, monotônico]
Atração: F_i = r_i · m_i^α   ;  repulsão: a_i off-colônia ⇒ F_i·=(1−REP)
Órbita:  top-N por F_i, N=14  [introselect, não sort]     O(n) ; n_hit pequeno
Fragmento: s_i = _snippet(a_i, q)                          [mecânico, O(N)]
Síntese: resultado = Claude(Σ s_i + paths)                 [1 chamada OAuth, $0]
Hebb:    ∀(i,j)∈órbita w_ij++ ; couso_i++                  [cooccurrence.jsonl]
Invariantes: I1 massa monotônica  I2 |órbita|≤N  I3 fonte intacta (copia snippet)
             I4 campo move só por uso
Complexidade/query: domina o retrieval atual + 1 RTT Claude. Geometria O(n) no build.
Bordas: n_hit=0→estado "sem fonte relevante" (não inventa) · N>n_hit→órbita=hit ·
        empate fronteira-N→desempate por k (determinismo) · Claude timeout→DLQ+retry
```

---

## 4. As fases (ordem: visível-barato → data-gated → crescimento)

### Fase 0 — `bru_config.json` (o contrato) ✅ entregue
Externaliza as constantes hardcoded (τ=90, Kw=3, SCALE=4, PB_THRESH=3,
k_max=18, LAMB=1.5, DIV=0.6, força-orbital=0.35) + as novas (α, N=14,
repulsão, pesos de massa). `build_graph.py` e `bru_retrieve.py` passam a
**ler** o config. *Verificação:* `python3 -c "import json;json.load(open('bru_config.json'))"` + os dois módulos importam sem erro.

### Fase 1 — Massa visível (mata o "mapa liso") · `build_graph.py` + `cosmos3d.html`
- Build: `m = 0.5·densidade_norm + 0.5·couso_norm` (densidade = grau + len + headings).
- Cosmos: `gl_PointSize` lê `m` (via atributo), não `√grau`.
- *Resultado:* **tamanho diferencia na 1ª abertura**, sem lastro. (Brilho já vive.)
- *Verificação:* headless prova variância de `m` > 0 no graph.json; **você
  screenshota antes/depois mesma câmera** — esferas com tamanhos distintos.

### Fase 2 — Atração com massa · `bru_retrieve.py`
- No rerank: `F = score · m^α` (config `atracao.alpha_massa`).
- Repulsão: node de colônia anti-ressonante leva `·(1−repulsao_offcolonia)`.
- *Resultado:* núcleos pesados E ressonantes vencem a órbita (lei híbrida real).
- *Verificação:* gold-set não regride (hit1/MRR ≥ atual); top-N reordenado
  por F coerente.

### Fase 3 — Órbita N=14 · `cosmos3d.html`
- Orçamento de atenção visual = top-14 do `retrieval_hit` orbitam o poço.
- *Verificação:* headless conta `_litStats().morphing ≤ 14`; você confirma o feel.

### Fase 4 — Sinal de sucesso de constelação · `bru_v3.py` (log)
- Enriquecer `delivered`: além do top hit, logar **a constelação** (os N
  orbiters) entregue. Isso torna "N sucessos" mensurável.
- *Gated em uso.* *Verificação:* nova linha do `cooccurrence.jsonl` carrega o set.

### Fase 5 — Meiose-CRIAÇÃO · `build_graph.py` (grav) + `graph.json`
- Gatilhos (config `meiose`): dupla cross-colônia co-uso ≥ 12 **ou**
  constelação com N_sucessos ≥ 4.
- Cria node-filho **persistido** no `graph.json`: `origem=meiose`, posição no
  ponto médio dos pais, `linhagem=[pais]`, tema do pai mais pesado.
- Conteúdo do filho = **Claude OAuth** (ocasional, batch no grav-build, $0).
- *Gated:* só roda com `cooccurrence.jsonl` com corpo (hoje 6 linhas → esperar).
- *Verificação:* após acúmulo, grav-build gera filhos; halo/linhagem no cosmos.

### Fase 6 — Mitose-SPLIT · `build_graph.py` (grav) + `graph.json`
- Gigante (PESQUISA/OPAL/SISTEMA) disputado por ≥ 2 temas (co-uso ≥ 6 cada)
  → divide em cópias fiéis ancoradas por tema (massa repartida). Sem LLM.
- *Gated:* precisa de co-uso por tema (lastro).
- *Verificação:* o gigante vira N cópias temáticas; campo desinfla.

---

## 5. Sequência de execução

```
Fase 0 ✅  →  Fase 1  →  Fase 2  →  Fase 3      (visíveis JÁ, sem lastro)
                                      │
                                      ▼
                              Fase 4 (liga o log rico)
                                      │
                              [ usar o sistema → lastro ]
                                      │
                                      ▼
                              Fase 5 (meiose)  →  Fase 6 (mitose)
```

As 1–3 entregam o que te frustrou ("ver as regras") **sem esperar dias**. As
5–6 só ganham sentido com dado real — disciplina da regra-mãe.

---

## 6. Loop de verificação (acordado)

Eu aplico → provo **headless** (SwiftShader: valida que não quebrou e que
*algo muda*, não representa FPS/feel) → **você screenshota antes/depois na
mesma câmera no seu GPU** → comparo a olho e ajusto. Render 200 não prova
visibilidade.

**Restrições de runtime:** não reinicio o `:8002` por Bash — peço restart via
`!`. O `:8014` (`opal_gateway.py`) serve o cosmos; rebuild do grafo pelo botão
↻ (`/api/galaxy/rebuild`).
