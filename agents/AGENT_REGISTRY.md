# Audit-System Agent Registry

Registro central de todos os agentes disponíveis no sistema.

---

## Agente: orchestrator

- **Tipo:** coordinator
- **Descrição:** Coordena workflows multi-agente para auditorias completas
- **Uso:** Iniciar auditoria completa
- **Invocação:** `/audit-agent full` ou usar `orchestrator` via API

---

## Agente: assumption-analyzer

- **Tipo:** specialist
- **Descrição:** Phase 1 - Mapeia e quebra suposições do desenvolvedor
- **Uso:** Encontrar vulnerabilidades inovadoras
- **Invocação:** `/audit-agent assumption`
- **Fase:** 1 (Map Assumptions)

---

## Agente: economic-attacker

- **Tipo:** specialist
- **Descrição:** Phase 3 - Modela ataques econômicos e estratégias de maximização de lucro
- **Uso:** Encontrar ataques econômicos viáveis
- **Invocação:** `/audit-agent economic`
- **Fase:** 3 (Economic Modeling)

---

## Agente: state-machine-hacker

- **Tipo:** specialist
- **Descrição:** Phase 4 - Analisa máquina de estados e transições inválidas
- **Uso:** Encontrar transições de estado que quebram invariantes
- **Invocação:** `/audit-agent state`
- **Fase:** 4 (State Machine Attack)

---

## Agente: composition-attacker

- **Tipo:** specialist
- **Descrição:** Phase 5 - Encontra vulnerabilidades em interações entre features
- **Uso:** Encontrar vulnerabilidades emergentes de composição
- **Invocação:** `/audit-agent composition`
- **Fase:** 5 (Composition Attack)

---

## Agente: exploit-writer

- **Tipo:** implementer
- **Descrição:** Cria PoCs exploits em Solidity prontos para produção
- **Uso:** Implementar exploits concretos
- **Invocação:** `/audit-agent exploit --hypothesis=<id>`

---

## Agente: test-generator

- **Tipo:** implementer
- **Descrição:** Gera test suites comprehensivos em Foundry
- **Uso:** Criar testes unitários, integração, fuzz e invariantes
- **Invocação:** `/audit-agent test --target=<contract>`

---

## Agente: report-writer

- **Tipo:** documenter
- **Descrição:** Compila findings em relatórios de segurança profissionais
- **Uso:** Gerar relatórios finais
- **Invocação:** `/audit-agent report`

---

## Workflows Predefinidos

### Workflow: Full Novel Discovery

```
orchestrator → assumption-analyzer → economic-attacker → state-machine-hacker → composition-attacker → report-writer
```

### Workflow: Economic Focus

```
orchestrator → economic-attacker → exploit-writer → report-writer
```

### Workflow: State Machine Deep Dive

```
orchestrator → state-machine-hacker → composition-attacker → exploit-writer
```

---

## Configuração de Agentes

Arquivos de configuração estão em `/agents/*.json`

Para adicionar novo agente:
1. Crie arquivo `.json` em `/agents/`
2. Registre neste arquivo
3. Reinicie o audit-connect

---

## Variáveis de Configuração

```yaml
# config.yml
agents:
  default_model: claude-opus-4-6
  timeout_seconds: 300
  max_concurrent: 3
  
paths:
  agents_dir: ./agents/
  skills_dir: ./skills/
  vault_dir: ./obsidian-vault/
  
output:
  default_dir: ./audit-output/
  formats: [markdown, json, solidity]
```
