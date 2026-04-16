# Audit System - Claude Code Plugin

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)](https://nodejs.org/)
[![Claude Code](https://img.shields.io/badge/Claude%20Code-Compatible-blue)](https://claude.ai/claude-code)

**Multi-agent smart contract security auditing framework for Claude Code**

> Break developer assumptions, discover novel vulnerabilities, and generate comprehensive security audits with 8 specialized AI agents.

## Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/MrAiKen007/audit-system.git
cd audit-system

# Install dependencies and setup
npm install
npm run setup

# Verify installation
npm test
```

### Usage in Claude Code

Once installed, use these commands in any project directory:

```bash
# Connect audit system to your project
/audit-connect

# Run complete audit
/audit-agent full

# Quick vulnerability check
/audit-agent quick
```

## Features

### 8 Specialized Agents

| Agent | Phase | Capability |
|-------|-------|------------|
| **assumption-analyzer** | Phase 1 | Break developer assumptions |
| **economic-attacker** | Phase 3 | Economic attack modeling |
| **state-machine-hacker** | Phase 4 | State machine analysis |
| **composition-attacker** | Phase 5 | Composition attacks |
| **exploit-writer** | Implementation | PoC generation |
| **test-generator** | Implementation | Test suite creation |
| **report-writer** | Documentation | Professional reports |
| **orchestrator** | Coordination | Workflow management |

### 5 Analysis Skills

- **novel-discovery** - 6-phase vulnerability discovery framework
- **exploit-generator** - Solidity exploit templates
- **test-generator** - Foundry test suite generation
- **auditor** - Standard audit workflows
- **audit-connect** - Project integration

### Knowledge Base

Comprehensive Obsidian vault with:
- 50+ vulnerability patterns
- Attack hypothesis templates
- Invariant catalogs
- Research papers
- Test strategies

## Model Compatibility

Works with **any AI model**:
- Claude (Opus/Sonnet/Haiku)
- Kimi (K2.5/K2)
- GPT (4o/4-turbo)
- Gemini (Pro/Ultra)
- Local models (via API)

## Installation Guide

### Prerequisites

- Node.js >= 16.0.0
- Claude Code >= 1.0.0
- Git

### Step-by-Step

1. **Clone Repository**
   ```bash
   git clone https://github.com/MrAiKen007/audit-system.git
   cd audit-system
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Setup Plugin**
   ```bash
   npm run setup
   ```

4. **Verify Installation**
   ```bash
   npm test
   ```

5. **Start Using**
   ```bash
   # Navigate to your project
   cd /path/to/your/smart-contract-project
   
   # Connect audit system
   /audit-connect
   
   # Run audit
   /audit-agent full
   ```

## Commands Reference

### Connection Commands

| Command | Description | Example |
|---------|-------------|---------|
| `/audit-connect` | Connect to project | `/audit-connect` |
| `/audit-status` | Check connection | `/audit-status` |
| `/audit-agents` | List agents | `/audit-agents` |

### Analysis Commands

| Command | Description | Example |
|---------|-------------|---------|
| `/audit-agent full` | Complete audit | `/audit-agent full` |
| `/audit-agent assumption` | Phase 1 analysis | `/audit-agent assumption` |
| `/audit-agent economic` | Phase 3 analysis | `/audit-agent economic` |
| `/audit-agent state` | Phase 4 analysis | `/audit-agent state` |
| `/audit-agent composition` | Phase 5 analysis | `/audit-agent composition` |
| `/audit-agent exploit` | Generate exploits | `/audit-agent exploit` |
| `/audit-agent test` | Generate tests | `/audit-agent test` |
| `/audit-agent report` | Compile report | `/audit-agent report` |

### Options

```bash
# Audit mode
/audit-connect --mode=full|novel|quick

# Target directory
/audit-agent full --target=./contracts

# Model selection
/audit-connect --model=claude-opus-4-6

# Custom output
/audit-connect --output=./my-audit-results
```

## Workflow Examples

### Full Smart Contract Audit

```bash
# 1. Navigate to project
cd ~/projects/my-defi-protocol

# 2. Connect audit system
/audit-connect --mode=full

# 3. Run complete analysis
/audit-agent full --target=./contracts/

# 4. Review results
ls ./audit-output/
```

### Novel Vulnerability Discovery

```bash
# Focus on innovative attack vectors
/audit-connect --mode=novel
/audit-agent assumption --target=./contracts/Pool.sol
/audit-agent economic
/audit-agent state
/audit-agent composition
```

### Quick Security Check

```bash
# Fast assessment for high-risk issues
/audit-connect --mode=quick
/audit-agent quick --target=./contracts/
```

## Output Structure

Results are saved in `./audit-output/`:

```
audit-output/
|-- assumptions-2024-04-16-15-30.md
|-- economic-analysis-2024-04-16-15-45.md
|-- state-transitions-2024-04-16-16-00.md
|-- composition-vulns-2024-04-16-16-15.md
|-- exploits/
|   |-- flash-loan-exploit.sol
|   |-- reentrancy-exploit.sol
|   -- oracle-manipulation.sol
|-- tests/
|   |-- PoolTest.t.sol
|   |-- SecurityTest.t.sol
|   -- FuzzTest.t.sol
|-- report.md
-- summary.json
```

## Architecture

### 6-Phase Discovery Framework

1. **Map Assumptions** - Identify explicit/implicit assumptions
2. **Break Assumptions** - Generate attack hypotheses
3. **Economic Modeling** - Model protocol as economic game
4. **State Machine Attack** - Find invalid state transitions
5. **Composition Attack** - Discover emergent vulnerabilities
6. **Novel Hypothesis** - Create proof-of-concept exploits

### Integration Flow

```
Project + /audit-connect
    |
    v
[8 Agents + 5 Skills + Knowledge Base]
    |
    v
Comprehensive Security Analysis
    |
    v
Exploits + Tests + Reports
```

## Development

### Adding New Agents

1. Create `agents/new-agent.json`
2. Define agent configuration
3. Add skill prompts in `skills/`
4. Update `config.json` workflows
5. Test with `npm test`

### Agent Configuration Template

```json
{
  "name": "new-agent",
  "description": "Agent description",
  "type": "specialist|implementer|coordinator|documenter",
  "model": "claude-opus-4-6",
  "skills": ["skill1.md", "skill2.md"],
  "vault_references": ["vulnerabilities/", "hypotheses/"],
  "output_format": "markdown|json|solidity",
  "dependencies": [],
  "parameters": {
    "target": "./contracts/",
    "depth": "comprehensive|quick"
  }
}
```

## Troubleshooting

### Common Issues

**"Command not found"**
- Ensure plugin is installed: `npm run setup`
- Check Claude Code version compatibility

**"Agent failed to load"**
- Verify agent JSON syntax
- Check required skills exist
- Run `npm test` for diagnostics

**"Knowledge base not accessible"**
- Verify obsidian-vault directory structure
- Check file permissions
- Re-run setup script

### Support

- **Issues**: [GitHub Issues](https://github.com/MrAiKen007/audit-system/issues)
- **Discussions**: [GitHub Discussions](https://github.com/MrAiKen007/audit-system/discussions)
- **Documentation**: [Wiki](https://github.com/MrAiKen007/audit-system/wiki)

## Contributing

1. Fork repository
2. Create feature branch
3. Make changes
4. Add tests
5. Run `npm test`
6. Submit pull request

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built for Claude Code ecosystem
- Inspired by formal verification methods
- Community vulnerability research
- DeFi security best practices

---

**Ready to audit?** Install now and run `/audit-connect` in your smart contract project!
