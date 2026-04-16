# Arquitetura de Integração do Audit-System

Este documento explica como **todos os recursos** (skills, agents, obsidian-vault) se conectam e funcionam juntos quando você executa `/audit-connect`.

---

## Modelo Padrão

```json
{
  "default_model": "claude-opus-4-6"
}
```

Todos os agentes usam o modelo **Claude Opus 4.6** por padrão, garantindo máxima capacidade de raciocínio para análise de vulnerabilidades complexas.

---

## Diagrama de Integração Completa

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         PROJETO SENDO AUDITADO                              │
│                    (~/projetos/meu-defi-protocol/)                           │
│                                                                             │
│  ┌──────────────┐    /audit-connect    ┌─────────────────────────────────┐  │
│  │   CONTRATO   │ ═══════════════════▶│      SKILL: audit-connect      │  │
│  │   ALVO.sol   │                       │  (ativador do sistema)        │  │
│  └──────────────┘                       └─────────────────────────────────┘  │
│                                                    │                        │
└────────────────────────────────────────────────────┼────────────────────────┘
                                                     │
                          ┌──────────────────────────┼──────────────────────────┐
                          │                          ▼                          │
                          │  ┌─────────────────────────────────────────────────┐  │
                          │  │           AUDIT-SYSTEM CONECTADO             │  │
                          │  │   (C:/Users/Jorge Paim/Desktop/audit-system)  │  │
                          │  └─────────────────────────────────────────────────┘  │
                          │                          │                            │
                          │          ┌───────────────┼───────────────┐            │
                          │          ▼               ▼               ▼            │
                          │   ┌──────────┐   ┌──────────┐   ┌──────────────┐    │
                          │   │  SKILLS  │   │  AGENTS  │   │    VAULT    │    │
                          │   │          │   │          │   │              │    │
                          │   │• auditor │   │• orches- │   │• vulnerabili-│    │
                          │   │• novel-  │   │  trator  │   │  ties        │    │
                          │   │  discovery│   │• assumption│   │• hypotheses │    │
                          │   │• exploit-│   │  -analyzer│   │• invariant-  │    │
                          │   │  generator│   │• economic-│   │  catalog    │    │
                          │   │• test-   │   │  attacker │   │• novel-      │    │
                          │   │  generator│   │• state-   │   │  patterns    │    │
                          │   │• audit-   │   │  machine- │   │• research    │    │
                          │   │  connect │   │  hacker   │   │              │    │
                          │   │          │   │• composi- │   │              │    │
                          │   │          │   │  tion-     │   │              │    │
                          │   │          │   │  attacker  │   │              │    │
                          │   │          │   │• exploit- │   │              │    │
                          │   │          │   │  writer    │   │              │    │
                          │   │          │   │• test-     │   │              │    │
                          │   │          │   │  generator │   │              │    │
                          │   │          │   │• report-   │   │              │    │
                          │   │          │   │  writer    │   │              │    │
                          │   └──────────┘   └──────────┘   └──────────────┘    │
                          │          │               │               │            │
                          │          └───────────────┼───────────────┘            │
                          │                          │                            │
                          │                          ▼                            │
                          │  ┌─────────────────────────────────────────────────┐  │
                          │  │              SÍNTESE E EXECUÇÃO                │  │
                          │  │                                                 │  │
                          │  │  Agents usam Skills como prompts                │  │
                          │  │  Agents consultam Vault para conhecimento     │  │
                          │  │  Resultados salvos em ./audit-output/          │  │
                          │  └─────────────────────────────────────────────────┘  │
                          └───────────────────────────────────────────────────────┘
```

---

## Como Tudo se Conecta

### 1. SKILL: `audit-connect` (O Ativador)

Quando você executa `/audit-connect` em um projeto:

```
┌─────────────────────────────────────────────────────────────┐
│  O que audit-connect faz:                                  │
├─────────────────────────────────────────────────────────────┤
│  1. Detecta o caminho do audit-system                      │
│  2. Carrega config.json (incluindo default_model)          │
│  3. Registra os 8 AGENTS disponíveis                       │
│  4. Carrega o SKILLS directory no contexto                   │
│  5. Indexa o OBSIDIAN-VAULT para consulta                  │
│  6. Cria ./audit-output/ no projeto                         │
│  7. Estabelece variáveis de ambiente                         │
└─────────────────────────────────────────────────────────────┘
```

### 2. AGENTS (Os Especialistas)

Cada agente é um **especialista** configurado em `agents/*.json`:

| Agente | Tipo | Recursos que Usa |
|--------|------|------------------|
| `orchestrator` | coordinator | Todos os outros agents |
| `assumption-analyzer` | specialist | `novel-discovery.md`, `invariant-catalog/` |
| `economic-attacker` | specialist | `novel-discovery.md` (seção econômica), `vulnerabilities/flash-loan` |
| `state-machine-hacker` | specialist | `novel-discovery.md` (seção state machine), `attack-patterns/` |
| `composition-attacker` | specialist | `novel-discovery.md` (seção composition), `vulnerabilities/` |
| `exploit-writer` | implementer | `exploit-generator.md`, `test-strategies/` |
| `test-generator` | implementer | `test-generator.md`, `test-strategies/fuzzing` |
| `report-writer` | documenter | `reports/_template.md`, `hypotheses/_template.md` |

### 3. SKILLS (Os Prompts Especializados)

Skills são **prompts reutilizáveis** que os agents usam:

```
skills/
├── auditor.md              ← Workflow de auditoria padrão
├── novel-discovery.md      ← Framework 6 fases COMPLETO ⭐
├── exploit-generator.md  ← Templates de exploits
├── test-generator.md     ← Templates de testes Foundry
└── audit-connect.md      ← Skill de conexão
```

**Como funciona:**
- Quando `assumption-analyzer` executa, ele carrega prompts de `novel-discovery.md` (Phase 1)
- Quando `economic-attacker` executa, ele usa prompts da seção econômica de `novel-discovery.md`
- Quando `exploit-writer` executa, ele usa templates de `exploit-generator.md`

### 4. OBSIDIAN-VAULT (O Knowledge Base)

O vault é **consultado** pelos agents durante a análise:

```
obsidian-vault/
├── vulnerabilities/          ← Consultado por todos os agents
│   ├── reentrancy.md       ← Referência para composition-attacker
│   ├── access-control.md   ← Referência para assumption-analyzer
│   ├── oracle-manipulation ← Referência para economic-attacker
│   └── flash-loan-attack.md ← Referência para economic-attacker
├── hypotheses/             ← Usado por assumption-analyzer
│   └── _template.md        ← Template para novas hipóteses
├── invariant-catalog/      ← Usado por state-machine-hacker
│   └── defi-invariants.md  ← Lista de invariantes para testar
├── novel-patterns/         ← Usado por composition-attacker
│   └── pattern-mutation-framework.md
├── attack-patterns/        ← Usado por state-machine-hacker
│   └── state-inconsistency.md
└── research/               ← Consultado por todos (contexto)
    ├── emerging-threats/
    ├── protocol-specific/
    └── cross-protocol-analysis/
```

---

## Fluxo de Dados

### Exemplo: Execução de `/audit-agent assumption`

```
1. Usário chama: /audit-agent assumption --target=./contracts/Pool.sol

2. orchestrator (se não chamado diretamente) ou
   assumption-analyzer (se chamado diretamente)

3. Agente carrega:
   ✓ Config de agents/assumption-analyzer.json
   ✓ Modelo: claude-opus-4-6
   ✓ Prompts de skills/novel-discovery.md (Phase 1)
   ✓ Contexto de obsidian-vault/invariant-catalog/
   ✓ Templates de obsidian-vault/hypotheses/

4. Agente executa análise no contrato alvo

5. Resultado:
   ✓ Salvo em ./audit-output/assumptions-[timestamp].md
   ✓ Referências a vulnerabilidades do vault
   ✓ Hipóteses no formato do template

6. Próximo passo pode ser:
   /audit-agent economic (para validar hipóteses economicamente)
   ou
   /audit-agent exploit (para criar PoC de uma hipótese específica)
```

---

## Integração Total: Exemplo Completo

```
Usuário em: ~/projetos/defi-protocol/
                      ↓
/audit-connect
                      ↓
┌─────────────────────────────────────────────────────────────┐
│ SISTEMA ATIVADO                                           │
│ • Modelo: claude-opus-4-6                                 │
│ • 8 agents registrados                                      │
│ • 5 skills carregadas                                     │
│ • Vault indexado (14 arquivos)                            │
│ • Diretório ./audit-output/ criado                         │
└─────────────────────────────────────────────────────────────┘
                      ↓
/audit-agent full --target=./contracts/
                      ↓
┌─────────────────────────────────────────────────────────────┐
│ WORKFLOW EXECUTADO                                          │
├─────────────────────────────────────────────────────────────┤
│ 1. orchestrator coordena                                     │
│    ↓                                                        │
│ 2. assumption-analyzer (Phase 1)                            │
│    → Usa: novel-discovery.md (Phase 1 section)               │
│    → Consulta: invariant-catalog/defi-invariants.md          │
│    → Output: 12 hipóteses salvas em ./audit-output/          │
│    ↓                                                        │
│ 3. economic-attacker (Phase 3)                               │
│    → Usa: novel-discovery.md (Economic section)              │
│    → Consulta: vulnerabilities/flash-loan-attack.md          │
│    → Input: 12 hipóteses do passo anterior                   │
│    → Output: 5 hipóteses economicamente viáveis             │
│    ↓                                                        │
│ 4. state-machine-hacker (Phase 4)                            │
│    → Usa: novel-discovery.md (State Machine section)         │
│    → Consulta: attack-patterns/state-inconsistency.md      │
│    → Output: 3 transições inválidas identificadas           │
│    ↓                                                        │
│ 5. composition-attacker (Phase 5)                             │
│    → Usa: novel-discovery.md (Composition section)           │
│    → Consulta: vulnerabilities/reentrancy.md                 │
│    → Output: 2 vulnerabilidades por composição              │
│    ↓                                                        │
│ 6. exploit-writer                                            │
│    → Usa: exploit-generator.md                             │
│    → Input: Top 3 vulnerabilidades combinadas                │
│    → Output: PoCs em Solidity em ./audit-output/exploits/    │
│    ↓                                                        │
│ 7. test-generator                                             │
│    → Usa: test-generator.md                                  │
│    → Consulta: test-strategies/fuzzing.md                    │
│    → Output: Test suite Foundry em ./audit-output/tests/    │
│    ↓                                                        │
│ 8. report-writer                                              │
│    → Usa: reports/_template.md                               │
│    → Compila todos os outputs anteriores                     │
│    → Output: Relatório final em ./audit-output/report.md     │
└─────────────────────────────────────────────────────────────┘
                      ↓
Resultado em: ~/projetos/defi-protocol/audit-output/
├── assumptions-2024-...md
├── economic-analysis-...md
├── state-transitions-...md
├── composition-vulns-...md
├── exploits/
│   ├── exploit-001.sol
│   └── exploit-002.sol
├── tests/
│   └── PoolTest.t.sol
└── report.md
```

---

## Resposta Rápida

### "O sistema usa todos os recursos?"

**SIM.** Quando você executa `/audit-connect`:

1. ✅ **Skills** - Carregadas no contexto do Claude Code
2. ✅ **Agents** - Todos os 8 registrados e disponíveis
3. ✅ **Obsidian-Vault** - Indexado e consultável
4. ✅ **Config** - Modelo claude-opus-4-6 configurado

### "Como sei que está funcionando?"

Após `/audit-connect`, execute:
```
/audit-agents    # Lista agents disponíveis
/audit-status    # Mostra status da conexão
```

Se aparecerem os 8 agentes listados, todos os recursos estão conectados.

---

## Variáveis de Ambiente Configuradas

Após `/audit-connect`, estas variáveis são definidas:

```bash
AUDIT_SYSTEM_PATH="C:/Users/Jorge Paim/Desktop/audit-system/audit-system"
AUDIT_AGENTS_PATH="C:/Users/Jorge Paim/Desktop/audit-system/audit-system/agents"
AUDIT_SKILLS_PATH="C:/Users/Jorge Paim/Desktop/audit-system/audit-system/skills"
AUDIT_VAULT_PATH="C:/Users/Jorge Paim/Desktop/audit-system/audit-system/obsidian-vault"
AUDIT_MODEL="claude-opus-4-6"
AUDIT_PROJECT_PATH="<diretório atual>"
AUDIT_OUTPUT_PATH="./audit-output"
```

Todas estas referências garantem que **todos os recursos** estão acessíveis.
