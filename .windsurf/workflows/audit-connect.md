---
description: Connect audit-system to current project and activate all resources
---

# Audit Connect Workflow

This workflow activates the multi-agent audit framework for any project.

## Usage

Run this workflow when in any project directory that needs security auditing:

```bash
/audit-connect
```

## What it does

1. **Detects audit-system installation** - Finds the plugin location
2. **Loads configuration** - Reads config.json and sets up model
3. **Registers 8 specialized agents**:
   - orchestrator - Workflow coordinator
   - assumption-analyzer - Phase 1: Break assumptions
   - economic-attacker - Phase 3: Economic modeling
   - state-machine-hacker - Phase 4: State machine analysis
   - composition-attacker - Phase 5: Composition attacks
   - exploit-writer - PoC generation
   - test-generator - Test suite creation
   - report-writer - Report compilation
4. **Loads 5 skills** - Specialized prompts for each phase
5. **Indexes Obsidian Vault** - Knowledge base with vulnerabilities and patterns
6. **Creates output directory** - ./audit-output/ for results

## Options

```bash
# Full audit (default)
/audit-connect

# Novel discovery only
/audit-connect --mode=novel

# Quick check
/audit-connect --mode=quick

# Specific target
/audit-connect --target=./contracts

# Override model
/audit-connect --model=claude-opus-4-6
```

## After Connection

Once connected, use these commands:

```bash
/audit-agent full          # Complete audit
/audit-agent assumption     # Phase 1 analysis
/audit-agent economic       # Phase 3 analysis
/audit-agent state          # Phase 4 analysis
/audit-agent composition    # Phase 5 analysis
/audit-agent exploit        # Generate exploits
/audit-agent test           # Generate tests
/audit-agent report         # Compile report
/audit-status               # Check connection
/audit-agents               # List agents
```

## Output

All results are saved in `./audit-output/`:
- assumptions-[timestamp].md
- economic-analysis-[timestamp].md
- state-transitions-[timestamp].md
- composition-vulns-[timestamp].md
- exploits/ (PoC contracts)
- tests/ (Foundry test suites)
- report.md (final report)
