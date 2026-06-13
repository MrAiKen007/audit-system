# Audit-System Agent Registry

Registro central de todos os agentes disponíveis no sistema.

**Linguagens Suportadas:** Solidity (EVM) | Rust (Solana/Anchor/ink!)
**Auto-detecção:** `/audit-connect` detecta automaticamente `.sol` ou `Cargo.toml`/`Anchor.toml`
**Override manual:** `--lang=solidity` | `--lang=rust` | `--lang=both`

Todos os agents são **LANG-aware**: ajustam seus prompts e outputs conforme `AUDIT_LANG`.

---

## Agente: orchestrator

- **Tipo:** coordinator
- **Descrição:** Coordena workflows multi-agente para auditorias completas (Solidity + Rust)
- **Uso:** Iniciar auditoria completa (detecta linguagem automaticamente)
- **Invocação:** `/audit-agent full`
- **LANG-aware:** ✅ Passa `AUDIT_LANG` para todos os sub-agentes

---

## Agente: assumption-analyzer

- **Tipo:** specialist
- **Descrição:** Phase 1 - Mapeia e quebra suposições do desenvolvedor
- **Uso:** Encontrar vulnerabilidades inovadoras (EVM ou Solana)
- **Invocação:** `/audit-agent assumption`
- **Fase:** 1 (Map Assumptions)
- **LANG-aware:** ✅ Solidity: CEI/storage patterns | Rust: account model/PDA/CPI

---

## Agente: economic-attacker

- **Tipo:** specialist
- **Descrição:** Phase 3 - Modela ataques econômicos e estratégias de maximização de lucro
- **Uso:** Encontrar ataques econômicos viáveis
- **Invocação:** `/audit-agent economic`
- **Fase:** 3 (Economic Modeling)
- **LANG-aware:** ✅ Solidity: MEV/flash loans | Rust: Solana scheduler/Serum

---

## Agente: state-machine-hacker

- **Tipo:** specialist
- **Descrição:** Phase 4 - Analisa máquina de estados e transições inválidas
- **Uso:** Encontrar transições de estado que quebram invariantes
- **Invocação:** `/audit-agent state`
- **Fase:** 4 (State Machine Attack)
- **LANG-aware:** ✅ Solidity: EVM storage | Rust: account discriminator/close+reinit

---

## Agente: composition-attacker

- **Tipo:** specialist
- **Descrição:** Phase 5 - Encontra vulnerabilidades em interações entre features
- **Uso:** Encontrar vulnerabilidades emergentes de composição
- **Invocação:** `/audit-agent composition`
- **Fase:** 5 (Composition Attack)
- **LANG-aware:** ✅ Solidity: cross-contract | Rust: CPI chains/Sealevel

---

## Agente: exploit-writer

- **Tipo:** implementer
- **Descrição:** Cria PoCs exploits em Solidity (Foundry) ou Rust (Anchor/TS)
- **Uso:** Implementar exploits concretos
- **Invocação:** `/audit-agent exploit --hypothesis=<id>`
- **LANG-aware:** ✅ Output: Foundry `.sol` ou Anchor `.ts` conforme `AUDIT_LANG`

---

## Agente: test-generator

- **Tipo:** implementer
- **Descrição:** Gera test suites comprehensivos em Foundry (Solidity) ou Anchor (Rust)
- **Uso:** Criar testes unitários, integração, fuzz e invariantes
- **Invocação:** `/audit-agent test --target=<contract>`
- **LANG-aware:** ✅ Framework: `forge test` ou `anchor test` conforme `AUDIT_LANG`

---

## Agente: report-writer

- **Tipo:** documenter
- **Descrição:** Compila findings em relatórios de segurança profissionais (multi-linguagem)
- **Uso:** Gerar relatórios finais
- **Invocação:** `/audit-agent report`
- **LANG-aware:** ✅ Report adaptado à linguagem do projeto auditado

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
version: 2.0.0
agents:
  default_model: claude-opus-4-6
  supported_languages: [solidity, rust]
  default_language: auto-detect
  timeout_seconds: 300
  max_concurrent: 3
  
paths:
  agents_dir: ./agents/
  skills_dir: ./skills/
  vault_dir: ./obsidian-vault/
  
output:
  default_dir: ./audit-output/
  formats: [markdown, json, solidity, rust]
```
