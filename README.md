# Audit System

Sistema multi-agente de auditoria de smart contracts com foco em descoberta de vulnerabilidades inovadoras.

**Linguagens Suportadas:**
- **Solidity** (EVM/Foundry) — auto-detectado por arquivos `*.sol`
- **Rust (Solana/Anchor)** — auto-detectado por `Anchor.toml` + `Cargo.toml`
- **Rust (ink!/Polkadot)** — auto-detectado por dependência `ink` no `Cargo.toml`

**Modelo:** Funciona com QUALQUER modelo de IA - Claude, GPT, Kimi, Gemini, modelos locais, etc. O sistema detecta automaticamente o modelo atual ou permite configuração manual.

**Modelos Testados:**
- Claude Opus/Sonnet/Haiku
- Kimi K2.5 / K2
- GPT-4o / GPT-4 Turbo
- Gemini Pro / Ultra
- Modelos locais (via API compatível)

## Visão Geral

Este sistema conecta **8 agents especializados**, **5 skills** e um **knowledge base completo (Obsidian Vault)** para realizar auditorias de segurança em smart contracts.

**Auto-detecção de linguagem:** o sistema detecta automaticamente se o projeto alvo usa Solidity (EVM) ou Rust (Solana/Anchor/ink!) e configura todos os agents no modo apropriado.

Quando você executa `/audit-connect` em qualquer projeto, TODOS os recursos são ativados automaticamente.

## Estrutura

```
audit-system/
├── agents/                    # Definições dos agentes especializados (LANG-aware)
│   ├── orchestrator.json      # Coordenador de workflows
│   ├── assumption-analyzer.json    # Phase 1: Quebra de suposições
│   ├── economic-attacker.json        # Phase 3: Modelagem econômica
│   ├── state-machine-hacker.json     # Phase 4: Máquina de estados
│   ├── composition-attacker.json     # Phase 5: Ataques por composição
│   ├── exploit-writer.json           # Criação de PoCs (Solidity + Rust)
│   ├── test-generator.json           # Geração de testes (Foundry + Anchor)
│   └── report-writer.json          # Compilação de relatórios
├── skills/                    # Skills do Claude Code
│   ├── auditor.md             # Auditoria padrão (Solidity + Rust checklists)
│   ├── novel-discovery.md     # Descoberta de vulnerabilidades inovadoras
│   ├── exploit-generator.md   # Geração de exploits (Solidity + Rust)
│   ├── test-generator.md      # Geração de testes (Foundry + Anchor)
│   └── audit-connect.md       # CONECTOR DE PROJETOS ⭐
├── obsidian-vault/            # Knowledge base
│   ├── vulnerabilities/       # Vulnerabilidades conhecidas (EVM + Solana)
│   ├── hypotheses/            # Hipóteses de ataque
│   ├── invariant-catalog/     # Catálogo de invariantes (DeFi + Solana)
│   ├── novel-patterns/        # Frameworks de discovery
│   └── research/              # Pesquisas
├── config.json                # Configuração do sistema (v2.0 multi-language)
└── ARCHITECTURE.md          # Documentação da arquitetura de integração
```

## Integração de Recursos

Quando você conecta o audit-system a um projeto, **todos os recursos são ativados**:

| Recurso | Quantidade | Descrição |
|---------|------------|-----------|
| **Agents** | 8 especialistas | Especialistas em diferentes fases da auditoria (LANG-aware) |
| **Skills** | 5 prompts | Prompts reutilizáveis para análise (Solidity + Rust) |
| **Vault** | 19+ arquivos | Knowledge base com vulnerabilidades EVM + Solana, padrões, invariantes |
| **Modelo** | Qualquer um | Usa o modelo que você tiver disponível (Claude, Kimi, GPT, etc.) |
| **Linguagens** | Solidity + Rust | Auto-detecção: `.sol` ou `Anchor.toml`/`Cargo.toml` |

### Como tudo se conecta:

```
Projeto → /audit-connect → [Agents + Skills + Vault] → Resultados
```

- **Agents** usam **Skills** como prompts especializados
- **Agents** consultam **Vault** para conhecimento de vulnerabilidades
- **Qualquer modelo** pode ser usado (Claude, Kimi, GPT, Gemini, local)
- **Resultados** são salvos em `./audit-output/`

## Instalação Rápida (via npx)

```bash
# Em qualquer projeto, instale o audit-system:
npx audit-system connect

# Ou force uma linguagem específica:
npx audit-system connect --lang=rust
npx audit-system connect --lang=solidity

# Verifique o status:
npx audit-system status

# Diagnóstico:
npx audit-system doctor
```

Isso cria `.audit-system/` e `.claude/` no projeto, com todos os agents, skills e knowledge base.

### Outros Comandos npx

```bash
npx audit-system help       # Ajuda
npx audit-system lang       # Detecta linguagem do projeto
npx audit-system agents     # Lista agentes disponíveis
npx audit-system doctor     # Verifica instalação
```

## Como Usar (no Claude Code)

### 1. Conectar a um Projeto

Com o Claude Code aberto no diretório do projeto:

```bash
/audit-connect
```

Isso ativa o audit-system para o projeto atual.

### 2. Executar Agentes

Após conectar:

```bash
# Auditoria completa
/audit-agent full

# Phase 1 - Quebra de suposições
/audit-agent assumption

# Phase 3 - Modelagem econômica
/audit-agent economic

# Phase 4 - Análise de máquina de estados
/audit-agent state

# Phase 5 - Ataques por composição
/audit-agent composition

# Criar exploit
/audit-agent exploit

# Gerar testes
/audit-agent test

# Compilar relatório
/audit-agent report
```

### Modo Rust/Solana

```bash
# Auto-detecção (se Anchor.toml presente)
/audit-connect

# Ou forçar modo Rust
/audit-connect --lang=rust

# Auditoria completa em programa Solana
/audit-agent full --target=./programs/

# Análise específica
/audit-agent assumption --target=./programs/amm/src/lib.rs
/audit-agent economic --target=./programs/amm/
/audit-agent exploit --target=./programs/amm/

# Output em ./audit-output/rust/
```

### 3. Workflows Disponíveis

| Workflow | Comando | Descrição |
|----------|---------|-----------|
| Full Audit | `/audit-agent full` | Todos os agentes |
| Novel Discovery | `/audit-connect --mode=novel` | Apenas 6 fases discovery |
| Quick Check | `/audit-connect --mode=quick` | Análise rápida |

## Agentes

### Phase Specialists (Framework 6 Fases)

1. **assumption-analyzer** (Phase 1)
   - Mapeia suposições implícitas/explícitas
   - Gera hipóteses quebrando suposições
   - Saída: Lista de hipóteses ranqueadas

2. **economic-attacker** (Phase 3)
   - Modela protocolo como jogo econômico
   - Encontra ataques de maximização de lucro
   - Saída: Vetores de ataque econômicos

3. **state-machine-hacker** (Phase 4)
   - Analisa estados e transições
   - Encontra transições inválidas
   - Saída: Transições perigosas e estados raros

4. **composition-attacker** (Phase 5)
   - Analisa interações entre features
   - Encontra vulnerabilidades emergentes
   - Saída: Vulnerabilidades por composição

### Implementers

5. **exploit-writer**
   - Cria PoCs em Solidity
   - Implementa hipóteses como código
   - Saída: Código exploit + teste Foundry

6. **test-generator**
   - Gera testes comprehensivos
   - Unit, integration, fuzz, invariant
   - Saída: Suite de testes Foundry

7. **report-writer**
   - Compila findings em relatório
   - Inclui severidade, PoC, remediação
   - Saída: Relatório profissional

### Coordinator

8. **orchestrator**
   - Coordena múltiplos agentes
   - Gerencia workflow completo
   - Passa contexto entre agentes

## Comandos

| Comando | Onde | Descrição |
|---------|------|-----------|
| `npx audit-system connect` | Terminal | Instala audit-system no projeto |
| `npx audit-system status` | Terminal | Verifica instalação |
| `npx audit-system doctor` | Terminal | Diagnóstico completo |
| `/audit-connect` | Claude Code | Conecta audit-system ao projeto |
| `/audit-agent <name>` | Claude Code | Executa agente específico |
| `/audit-agents` | Claude Code | Lista agentes disponíveis |
| `/audit-status` | Claude Code | Mostra status da conexão |

## Configuração

### Caminho do Audit-System

Se o audit-system estiver em local diferente do padrão:

```bash
/audit-connect --config-path="/caminho/completo/audit-system"
```

### Output

Resultados são salvos em `./audit-output/` (configurável):

```bash
/audit-connect --output="./meus-resultados/"
```

### Modelo de IA

O sistema funciona com **qualquer modelo de IA**. Por padrão, detecta automaticamente:

```bash
# Auto-detect (padrão - recomendado)
/audit-connect

# Ou especificar modelo manualmente
/audit-connect --model=kimi-k2.5
/audit-connect --model=claude-opus-4-6
/audit-connect --model=gpt-4o
```

**Modelos Suportados:** Claude (Opus/Sonnet/Haiku), Kimi (K2.5/K2), GPT (4o/4-turbo), Gemini (Pro/Ultra), e modelos locais.

## Framework de Descoberta

### 6 Fases

1. **Map Assumptions** → assumption-analyzer
2. **Break Assumptions** → assumption-analyzer
3. **Economic Modeling** → economic-attacker
4. **State Machine Attack** → state-machine-hacker
5. **Composition Attack** → composition-attacker
6. **Novel Hypothesis** → exploit-writer

### Filosofia

> Quebrar as suposições do desenvolvedor, não apenas procurar padrões conhecidos.

## Integração com Obsidian

O vault do Obsidian contém:
- Vulnerabilidades conhecidas
- Padrões de ataque
- Catálogo de invariantes
- Templates de hipóteses
- Resultados de pesquisa

## Exemplos de Uso

### Projeto Solidity (EVM)

```bash
# Terminal: instalar
cd ~/projetos/meu-defi-protocol
npx audit-system connect

# Claude Code: ativar e auditar
/audit-connect
/audit-agent full --target=./contracts

# Ver resultados
ls ./audit-output/
```

### Projeto Rust (Solana/Anchor)

```bash
# Terminal: instalar (detecta automaticamente)
cd ~/projetos/solana-program
npx audit-system connect
# Saída: Linguagem detectada: Rust (Solana/Anchor)

# Ou forçar Rust
npx audit-system connect --lang=rust

# Claude Code: ativar e auditar
/audit-connect
/audit-agent full --target=./programs/
/audit-agent exploit --target=./programs/amm/

# Ver resultados
ls ./audit-output/rust/
```

### Deploy em Máquina Nova

```bash
# 1. Instalar Node.js (>= 16)
# 2. Rodar em qualquer projeto:
npx audit-system connect
# 3. Abrir Claude Code e digitar /audit-connect
# Pronto! Todos os 8 agents disponíveis.
```

## Desenvolvimento

Para adicionar novo agente:
1. Crie `agents/novo-agente.json`
2. Registre em `agents/AGENT_REGISTRY.md`
3. Atualize `config.json` se necessário

## Licença

MIT
