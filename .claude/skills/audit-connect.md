---
description: Connects current audited project to audit-system resources and activates the multi-agent audit framework using claude-opus-4-6 model
type: skill
commands:
  - audit-connect
  - audit-init
  - use-audit-system
---

# Audit Connect Skill

## Purpose

Ativa o audit-system a partir de qualquer diretório de projeto, conectando TODOS os recursos (skills, agents, obsidian-vault) ao projeto atual.

## Modelo Utilizado

**Modelo Padrão:** `claude-opus-4-6`

Todos os agents são executados com o modelo mais poderoso disponível para garantir análises complexas de vulnerabilidades.

## Usage

Quando estiver no diretório de um projeto a ser auditado, execute:

```
/audit-connect
```

Ou com parâmetros:

```
/audit-connect --phase=assumption-analysis --target=./contracts
```

## O que este skill faz (Integração Completa)

### 1. **Carrega Configuração**
   - Lê `config.json` do audit-system
   - Configura `default_model: "claude-opus-4-6"`
   - Registra todos os caminhos (agents, skills, vault)

### 2. **Registra 8 Agents Especializados**
   ```
   Agents carregados de: C:/Users/Jorge Paim/Desktop/audit-system/audit-system/agents/

   ✓ orchestrator.json         - Coordenador de workflows
   ✓ assumption-analyzer.json - Phase 1: Quebra de suposições
   ✓ economic-attacker.json    - Phase 3: Modelagem econômica
   ✓ state-machine-hacker.json - Phase 4: Máquina de estados
   ✓ composition-attacker.json - Phase 5: Ataques por composição
   ✓ exploit-writer.json       - Criação de PoCs
   ✓ test-generator.json       - Geração de testes
   ✓ report-writer.json        - Compilação de relatórios
   ```

### 3. **Carrega 5 Skills no Contexto**
   ```
   Skills disponíveis:

   ✓ auditor.md              - Workflow de auditoria padrão
   ✓ novel-discovery.md      - Framework 6 fases COMPLETO
   ✓ exploit-generator.md  - Templates de exploits
   ✓ test-generator.md     - Templates de testes Foundry
   ✓ audit-connect.md      - Este skill (recursivo)
   ```

### 4. **Indexa Obsidian-Vault (Knowledge Base)**
   ```
   Knowledge base carregado:

   ✓ vulnerabilities/          (4 arquivos)
     - reentrancy.md
     - access-control.md
     - oracle-manipulation.md
     - flash-loan-attack.md

   ✓ hypotheses/             (1 template)
     - _template.md

   ✓ invariant-catalog/      (1 catálogo)
     - defi-invariants.md

   ✓ novel-patterns/         (1 framework)
     - pattern-mutation-framework.md

   ✓ attack-patterns/        (1 padrão)
     - state-inconsistency.md

   ✓ test-strategies/        (1 estratégia)
     - fuzzing.md

   ✓ reports/                (1 template)
     - _template.md

   ✓ research/               (3 diretórios)
     - emerging-threats/
     - protocol-specific/
     - cross-protocol-analysis/
   ```

### 5. **Cria Estrutura de Output**
   ```
   No projeto atual:
   ./audit-output/
   ├── findings/
   ├── exploits/
   ├── tests/
   └── report.md
   ```

### 6. **Configura Variáveis de Ambiente**
   ```
   AUDIT_SYSTEM_PATH="C:/Users/Jorge Paim/Desktop/audit-system/audit-system"
   AUDIT_AGENTS_PATH="C:/Users/Jorge Paim/Desktop/audit-system/audit-system/agents"
   AUDIT_SKILLS_PATH="C:/Users/Jorge Paim/Desktop/audit-system/audit-system/skills"
   AUDIT_VAULT_PATH="C:/Users/Jorge Paim/Desktop/audit-system/audit-system/obsidian-vault"
   AUDIT_MODEL="claude-opus-4-6"
   AUDIT_PROJECT_PATH="<diretório atual>"
   AUDIT_OUTPUT_PATH="./audit-output"
   ```

## Workflow de Integração

```
[Projeto Auditado]
        ↓
/audit-connect  ← SKILL de ativação
        ↓
[Carrega Config] ← config.json (model: claude-opus-4-6)
        ↓
[Registra Agents] ← 8 agents de ./agents/
        ↓
[Carrega Skills] ← 5 skills de ./skills/
        ↓
[Indexa Vault] ← knowledge base de ./obsidian-vault/
        ↓
[Cria Output Dir] ← ./audit-output/
        ↓
[Sistema Conectado] ← Todos os recursos disponíveis
        ↓
Escolha do agente → Execução → Resultados
```

## Agents Disponíveis

Após conectar, os seguintes agentes podem ser invocados:

| Agente | Comando | Descrição | Recursos Utilizados |
|--------|---------|-----------|---------------------|
| orchestrator | `/audit-agent full` | Coordena todos os agents | Todos os recursos |
| assumption-analyzer | `/audit-agent assumption` | Phase 1: Mapeia e quebra suposições | novel-discovery.md (Phase 1), invariant-catalog/, hypotheses/_template.md |
| economic-attacker | `/audit-agent economic` | Phase 3: Modelagem econômica | novel-discovery.md (seção econômica), vulnerabilities/flash-loan-attack.md |
| state-machine-hacker | `/audit-agent state` | Phase 4: Análise de máquina de estados | novel-discovery.md (seção state machine), attack-patterns/, invariant-catalog/ |
| composition-attacker | `/audit-agent composition` | Phase 5: Ataques por composição | novel-discovery.md (seção composition), vulnerabilities/, novel-patterns/ |
| exploit-writer | `/audit-agent exploit` | Cria PoCs em Solidity | exploit-generator.md, test-strategies/ |
| test-generator | `/audit-agent test` | Gera testes Foundry | test-generator.md, test-strategies/fuzzing.md |
| report-writer | `/audit-agent report` | Compila relatórios | reports/_template.md, hypotheses/_template.md |

## Como os Recursos se Interligam

### Exemplo: assumption-analyzer em ação

```
1. Usuário: /audit-agent assumption --target=./contracts/Pool.sol

2. Agente assumption-analyzer ativa:
   ├── Config: agents/assumption-analyzer.json
   ├── Modelo: claude-opus-4-6
   ├── Prompts: skills/novel-discovery.md (Phase 1)
   ├── Contexto: obsidian-vault/invariant-catalog/defi-invariants.md
   └── Template: obsidian-vault/hypotheses/_template.md

3. Agente analisa o contrato Pool.sol

4. Output gerado:
   ├── ./audit-output/assumptions-[timestamp].md
   ├── Referências a invariantes do vault
   └── Hipóteses formatadas pelo template
```

### Exemplo: economic-attacker em ação

```
1. Usuário: /audit-agent economic --target=./contracts/

2. Agente economic-attacker ativa:
   ├── Config: agents/economic-attacker.json
   ├── Modelo: claude-opus-4-6
   ├── Prompts: skills/novel-discovery.md (seção econômica)
   └── Contexto: obsidian-vault/vulnerabilities/flash-loan-attack.md

3. Agente modela ataques econômicos

4. Output gerado:
   ├── ./audit-output/economic-analysis-[timestamp].md
   ├── Cálculos de expected value (EV)
   └── Vetores de ataque economicamente viáveis
```

## Exemplos de Uso

### Exemplo 1: Conectar e verificar status

```
/user está em: ~/projetos/defi-protocol/
!pwd
/audit-connect
/audit-status
/audit-agents
```

### Exemplo 2: Executar Phase 1

```
/audit-connect
/audit-agent assumption --target=./src/
```

### Exemplo 3: Auditoria econômica rápida

```
/audit-connect
/audit-agent economic --target=./contracts/Pool.sol
```

### Exemplo 4: Auditoria completa (todos os agents)

```
/audit-connect
/audit-agent full --target=./contracts/ --output=./audit-results/
```

### Exemplo 5: Workflow específico

```
/audit-connect
/audit-agent assumption   # Gera hipóteses
/audit-agent economic     # Valida viabilidade econômica
/audit-agent exploit      # Cria PoC da hipótese mais promissora
```

## Configuração

### Configurar caminho do audit-system

Se o audit-system estiver em local diferente:

```
/audit-connect --config-path="C:/caminho/para/audit-system"
```

### Modos de operação

1. **Mode: connect** (padrão)
   - Conecta e ativa todos os recursos
   - Prepara ambiente para auditoria

2. **Mode: init**
   - Inicializa estrutura de auditoria no projeto
   - Cria pasta `audit-output/` completa

3. **Mode: full**
   - Executa auditoria completa automaticamente
   - Usa orchestrator para coordenar todos os agents

## Comandos Disponíveis

| Comando | Descrição |
|---------|-----------|
| `/audit-connect` | Ativa conexão com audit-system |
| `/audit-connect --config-path=X` | Define caminho customizado |
| `/audit-status` | Mostra status da conexão e recursos carregados |
| `/audit-agents` | Lista agents disponíveis |
| `/audit-agent <name>` | Executa agente específico |
| `/audit-phase <N>` | Executa fase específica do framework |

## Verificação de Conexão

Para confirmar que TODOS os recursos estão conectados:

```
/audit-connect
/audit-status
```

Saída esperada:
```
✓ Audit-System conectado
✓ Modelo: claude-opus-4-6
✓ 8 agents registrados
✓ 5 skills carregadas
✓ Vault indexado (14 arquivos)
✓ Output directory: ./audit-output/
```

## Related Resources

- [[../ARCHITECTURE.md]] - Arquitetura completa de integração
- [[../agents/AGENT_REGISTRY.md]] - Registro de todos os agents
- [[../config.json]] - Configuração do sistema
- [[../README.md]] - Documentação principal

## Notas Importantes

- O audit-system não precisa estar no mesmo diretório do projeto
- Todos os agents usam o modelo `claude-opus-4-6` por padrão
- Skills são carregadas automaticamente no contexto do Claude
- O vault é indexado para consulta rápida durante análises
- Resultados são salvos em `./audit-output/` por padrão
- Cada agente pode ser chamado individualmente após a conexão
- O orchestrator pode coordenar workflows multi-agente completos
