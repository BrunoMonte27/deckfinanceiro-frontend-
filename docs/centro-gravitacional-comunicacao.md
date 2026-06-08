# Centro Gravitacional de Comunicação

> Memória **viva** da comunicação da Deck Financeiro. Não é um arquivo de
> pastas — é um campo físico 3D onde cada fonte de informação é um corpo com
> massa. O **centro** recebe a query, **emite uma onda** que varre o campo,
> **atrai** as fontes ressonantes para órbita, **copia o fragmento de
> interesse** de cada uma e **sintetiza** o resultado. Depois, as fontes
> voltam ao campo **reposicionadas** pelo que foi usado junto. Com o tempo o
> sistema **cresce** (mitose) e **se aprofunda** (meiose).

> **Stack:** React + Vite + TypeScript · React Three Fiber (Three.js) para o
> campo 3D. Embeddings para ressonância; Gemini (grátis) como motor de
> recorte e de síntese.

---

## 1. A ideia central

A **física não é decoração — é o modelo de consumo.** A lei de atração que
escolhemos decide quais fontes entram, em que ordem e a que custo. A
representação gráfica é o espelho fiel disso: o que você **vê** é o que o
sistema **faz**.

O centro gravitacional é **ativo**, não uma âncora passiva. Cada query é um
**comando** que nasce no centro e se propaga como **onda** pelo campo.

---

## 2. Átomo (a fonte / o corpo)

A menor unidade de memória: uma fonte de informação registrada.

| Campo | O que é | Espelho visual |
|---|---|---|
| `id` / `norm` | identidade e chave de junção com o grafo | — |
| `tema` | a "natureza" da fonte (cluster temático) | **cor** |
| `massa` | densidade de conteúdo + co-uso acumulado | **tamanho** |
| `pos` | coordenada 3D (x,y,z) | posição no campo |
| `carga` | afinidade/repulsão com temas (permite empurrão) | — |
| `linhagem` | se nasceu de meiose/mitose, de quem veio | — |

### Massa

`massa = densidade_de_conteúdo + co_uso_acumulado`

- **Densidade** = quão rico/profundo é o conteúdo (não tamanho bruto).
- **Co-uso** = quantas vezes já foi recrutada em queries (histórico de
  utilidade).
- **Sem autoridade, sem recência.** Peso é mérito × histórico, não pedigree.
- **Monotônico:** co-uso só cresce. Não há decaimento (ver §6, Temperatura).

---

## 3. Lei de atração — Híbrida

Uma fonte só é puxada se tiver **presença E sintonia**:

```
F = (massaᵅ · ressonânciaᵝ) / d²
```

- **massa** — presença/autoridade da fonte (densidade + co-uso).
- **ressonância** — sintonia semântica com a query (ver §4).
- **d** — distância euclidiana no campo 3D.
- **α, β** — os "botões" que equilibram presença vs sintonia (afinar com uso).

Multiplicativo de propósito: massa alta sem ressonância **não** entra, e
ressonância alta sem massa também não basta. Precisa dos dois.

---

## 4. Ressonância — o espectro da query

A query "soa" no campo. A ressonância é **semântica**, não textual:

- A query e as fontes são codificadas em **embeddings**; a sintonia é a
  proximidade vetorial (cosine). Sinônimos e temas relacionados ressoam
  parcialmente — **harmônicos**.
- Isso roda barato e cacheável, **fora** do caminho da Gemini.

---

## 5. O ciclo de uma query (o comando do centro)

1. **Emissão.** A query nasce no centro e vira **onda** — propagação
   **instantânea**, varre o campo inteiro de uma vez.
2. **Cálculo de força.** Cada fonte calcula sua F (massa × ressonância / d²).
   Fontes **não-afins** sofrem **repulsão ativa** (carga negativa) — são
   empurradas, criando constelações nítidas.
3. **Órbita / competição.** As **N = 12-15** fontes de maior força entram em
   **órbita** do centro. O orçamento é fixo: uma fonte forte **expulsa** uma
   fraca (saturação = competição por atenção).
4. **Recorte do fragmento.** O centro copia só o **fragmento de interesse**
   de cada orbiter. A **Gemini** lê e puxa a passagem precisa — em **uma
   única chamada em lote** com todas as fontes orbitando (1 chamada/query,
   não 12-15). A fonte original fica **intacta**.
5. **Síntese.** Os fragmentos orbitando são fundidos no **resultado**.
6. **Retorno reposicionado.** As fontes voltam ao campo. Hebbiano: as que
   orbitaram juntas se **aproximam**; a repulsão afasta as não-afins. O campo
   só se reorganiza **pelo uso** (inércia **média** — movimento visível, sem
   caos).

---

## 6. Os botões da física (estado travado)

| Botão | Decisão | Efeito |
|---|---|---|
| **Lei de atração** | Híbrida (massaᵅ·ressonânciaᵝ/d²) | presença E sintonia |
| **Massa** | densidade + co-uso | mérito × histórico, sem recência |
| **Ressonância** | harmônicos semânticos (embeddings) | casa significado, não palavra |
| **Propagação** | instantânea | campo todo de uma vez |
| **Repulsão** | ativa (carga negativa) | constelações nítidas, filtro nativo |
| **Saturação** | N = 12-15 órbitas | competição por atenção |
| **Temperatura** | sem decaimento | só o uso move; nada esfria sozinho |
| **Inércia** | média | reorganização visível e estável |
| **Consumo** | orbita + fragmento + retorno | fonte intacta, centro usa o recorte |

> **Filosofia que emerge:** *o campo só se reorganiza pelo uso, nunca pelo
> tempo.* O "esquecer" não está na memória (que é fiel e permanente) — está
> no **orçamento de órbita** (atenção finita, transitória, por query).
>
> **Consequência consciente:** co-uso só cresce + sem decaimento ⇒ campeões
> antigos permanecem centrais. Ganha-se estabilidade; aceita-se um viés de
> vitória antiga. Botão futuro se incomodar: peso de recência suave no co-uso.

---

## 7. Crescimento — Mitose

**Mitose = cópia fiel, para crescer.** Barata, sem LLM.

- **Gatilho:** um átomo **disputado por temas/constelações distintas ao mesmo
  tempo** se **divide**. Cada cópia passa a servir um tema e pode
  **especializar** com o uso (drift).
- Serve para crescer **onde há demanda** e para **reparar** átomos
  degradados.
- Cresce em **quantidade / alcance**.

---

## 8. Reprodução — Meiose

**Meiose = recombinação de dois pais, para aprofundar.** É onde a **Gemini**
trabalha como motor de maturação.

- **Escopo (dois gatilhos):**
  1. **Dupla alma-gêmea** — dois átomos com co-uso **muito alto** entre si se
     recombinam (barra alta, controlada).
  2. **Playbook** — uma constelação inteira que deu certo **N vezes**
     cristaliza numa receita pronta.
- **Direção:** fusão **cross-domínio preferida** (juntar temas distintos vale
  mais que fundir iguais) — barra menor para cross, maior para mesmo-tema.
- **Nascimento:** o filho nasce no **ponto médio** dos pais, com **linhagem**
  (tag de origem rastreável).
- **Motor:** a Gemini sintetiza o conteúdo do filho a partir dos dois pais.
- Cresce em **qualidade / profundidade / diversidade**.

---

## 9. Dicionário visual (o espelho da física)

| Propriedade gráfica | Grandeza física |
|---|---|
| **Cor** | tema (natureza da fonte) |
| **Tamanho** | massa (densidade + co-uso) |
| **Distância do centro** | relevância / afinidade de repouso |
| **Raio de órbita** | força de atração *nesta* query |
| **Brilho** | **ativação no turno** — acende quando recrutada, ao vivo |
| **Migração pós-query** | reposicionamento Hebbiano |

O **brilho = ativação** é o que torna as regras **visíveis na primeira
query**: sem depender de lastro, as fontes recrutadas acendem e orbitam ao
vivo quando você pergunta.

---

## 10. Papel da Gemini (grátis) e a cota

A Gemini entra em **dois** pontos — e **só** neles, para não queimar a cota:

1. **Recorte do fragmento** (por query): **1 chamada em lote** com todas as
   fontes orbitando → todos os fragmentos de uma vez.
2. **Síntese da meiose** (ocasional): funde dois pais num filho.

A ressonância por query roda em **embeddings**, fora da Gemini. Net: ~1
chamada Gemini por query — viável no plano grátis.

---

## 11. Decisões travadas (resumo)

1. **Stack:** React + Vite + TS + React Three Fiber.
2. **Lei:** híbrida, F = (massaᵅ·ressonânciaᵝ)/d².
3. **Massa:** densidade de conteúdo + co-uso (sem autoridade/recência).
4. **Ressonância:** harmônicos semânticos via embeddings.
5. **Propagação:** instantânea.
6. **Repulsão:** ativa (carga negativa).
7. **Saturação:** N = 12-15 órbitas.
8. **Temperatura:** sem decaimento (campo só move pelo uso).
9. **Inércia:** média.
10. **Consumo:** orbita → fragmento (Gemini em lote) → síntese → retorno Hebbiano.
11. **Mitose:** divide quando disputado por temas distintos.
12. **Meiose:** dupla/playbook · cross-domínio · Gemini · ponto médio + linhagem.
13. **Visual:** cor=tema · tamanho=massa · distância=relevância · raio=força · brilho=ativação.
