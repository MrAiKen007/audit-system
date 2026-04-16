# Audit System

Sistema multi-agente de auditoria de smart contracts com foco em descoberta de vulnerabilidades inovadoras.

**Modelo:** Funciona com QUALQUER modelo de IA - Claude, GPT, Kimi, Gemini, modelos locais, etc. O sistema detecta automaticamente o modelo atual ou permite configuração manual.

**Modelos Testados:**
- ✅ Claude Opus/Sonnet/Haiku
- ✅ Kimi K2.5 / K2
- ✅ GPT-4o / GPT-4 Turbo
- ✅ Gemini Pro / Ultra
- ✅ Modelos locais (via API compatível)

## Visão Geral

Este sistema conecta **8 agents especializados**, **5 skills** e um **knowledge base completo (Obsidian Vault)** para realizar auditorias de segurança em smart contracts.

Quando você executa `/audit-connect` em qualquer projeto, TODOS os recursos são ativados automaticamente.

## Estrutura

```
audit-system/
├── agents/                    # Definições dos agentes especializados
│   ├── orchestrator.json      # Coordenador de workflows
│   ├── assumption-analyzer.json    # Phase 1: Quebra de suposições
│   ├── economic-attacker.json        # Phase 3: Modelagem econômica
│   ├── state-machine-hacker.json     # Phase 4: Máquina de estados
│   ├── composition-attacker.json     # Phase 5: Ataques por composição
│   ├── exploit-writer.json           # Criação de PoCs
│   ├── test-generator.json           # Geração de testes
│   └── report-writer.json          # Compilação de relatórios
├── skills/                    # Skills do Claude Code
│   ├── auditor.md             # Auditoria padrão
│   ├── novel-discovery.md     # Descoberta de vulnerabilidades inovadoras
│   ├── exploit-generator.md   # Geração de exploits
│   ├── test-generator.md      # Geração de testes
│   └── audit-connect.md       # CONECTOR DE PROJETOS ⭐
├── obsidian-vault/            # Knowledge base
│   ├── vulnerabilities/       # Vulnerabilidades conhecidas
│   ├── hypotheses/            # Hipóteses de ataque
│   ├── invariant-catalog/     # Catálogo de invariantes
│   ├── novel-patterns/        # Frameworks de discovery
│   └── research/              # Pesquisas
└── config.json                # Configuração do sistema
└── ARCHITECTURE.md          # Documentação da arquitetura de integração
```

## Integração de Recursos

Quando você conecta o audit-system a um projeto, **todos os recursos são ativados**:

| Recurso | Quantidade | Descrição |
|---------|------------|-----------|
| **Agents** | 8 especialistas | Especialistas em diferentes fases da auditoria |
| **Skills** | 5 prompts | Prompts reutilizáveis para análise |
| **Vault** | 14+ arquivos | Knowledge base com vulnerabilidades, padrões, invariantes |
| **Modelo** | Qualquer um | Usa o modelo que você tiver disponível (Claude, Kimi, GPT, etc.) |

### Como tudo se conecta:

```
Projeto → /audit-connect → [Agents + Skills + Vault] → Resultados
```

- **Agents** usam **Skills** como prompts especializados
- **Agents** consultam **Vault** para conhecimento de vulnerabilidades
- **Qualquer modelo** pode ser usado (Claude, Kimi, GPT, Gemini, local)
- **Resultados** são salvos em `./audit-output/`

## Como Usar

### 1. Conectar a um Projeto

Quando estiver no diretório de um projeto a ser auditado:

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

| Comando | Descrição |
|---------|-----------|
| `/audit-connect` | Conecta audit-system ao projeto atual |
| `/audit-connect --mode=full` | Executa auditoria completa |
| `/audit-agent <name>` | Executa agente específico |
| `/audit-agents` | Lista agentes disponíveis |
| `/audit-status` | Mostra status da conexão |

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

## Exemplo de Uso

```bash
# Navegar para projeto
cd ~/projetos/meu-defi-protocol

# Conectar audit-system
/audit-connect

# Executar discovery completo
/audit-agent full --target=./contracts

# Ver resultados
ls ./audit-output/
```

## Desenvolvimento

Para adicionar novo agente:
1. Crie `agents/novo-agente.json`
2. Registre em `agents/AGENT_REGISTRY.md`
3. Atualize `config.json` se necessário

## Licença

MIT
