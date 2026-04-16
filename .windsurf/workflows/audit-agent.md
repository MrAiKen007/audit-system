---
description: Execute specific audit agent for targeted analysis
---

# Audit Agent Workflow

Execute specialized audit agents for different phases of security analysis.

## Available Agents

### Phase Specialists

```bash
/audit-agent assumption     # Phase 1: Break developer assumptions
/audit-agent economic       # Phase 3: Economic attack modeling  
/audit-agent state          # Phase 4: State machine hacking
/audit-agent composition    # Phase 5: Composition attacks
```

### Implementation Agents

```bash
/audit-agent exploit        # Generate proof-of-concept exploits
/audit-agent test           # Generate comprehensive test suites
/audit-agent report         # Compile professional audit report
```

### Workflow Commands

```bash
/audit-agent full           # Execute all agents in sequence
/audit-agent quick          # Fast assessment (assumption + economic)
```

## Usage Examples

```bash
# Target specific contract
/audit-agent assumption --target=./contracts/Pool.sol

# Full audit on all contracts
/audit-agent full --target=./contracts/

# Generate exploit for specific vulnerability
/audit-agent exploit --target=./vulnerability-findings.md
```

## Agent Outputs

Each agent saves results in `./audit-output/` with timestamped files.

## Dependencies

Must run `/audit-connect` first to activate the system.
